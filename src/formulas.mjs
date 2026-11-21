export function columnName(index) {
  let name = '';
  for (let n = index; n > 0; n = Math.floor((n - 1) / 26)) name = String.fromCharCode(65 + (n - 1) % 26) + name;
  return name;
}
export function columnIndex(name) {
  return [...name.toUpperCase()].reduce((n, c) => n * 26 + c.charCodeAt(0) - 64, 0);
}
export function parseAddress(address) {
  const match = /^\$?([A-Z]{1,3})\$?([1-9]\d{0,6})$/i.exec(address);
  if (!match) throw new Error('#RIF!');
  const col = columnIndex(match[1]); const row = Number(match[2]);
  if (col > 16384 || row > 1048576) throw new Error('#RIF!');
  return { col, row };
}

const aliases = { SOMMA: 'SUM', MEDIA: 'AVERAGE', 'CONTA.NUMERI': 'COUNT', SE: 'IF', ARROTONDA: 'ROUND', ASS: 'ABS' };
const precedence = { '=': 5, '<>': 5, '<': 5, '>': 5, '<=': 5, '>=': 5, '+': 10, '-': 10, '*': 20, '/': 20, '^': 30 };

function parse(source) {
  if (source.length > 8192) throw new Error('#LIMITE!');
  const tokens = [];
  let rest = source.trim().replace(/^=/, '');
  while (rest) {
    const match = /^(\s+|\d+(?:\.\d+)?(?:[eE][+-]?\d+)?|"(?:[^"]|"")*"|\$?[A-Za-z_][A-Za-z0-9_.$]*|<=|>=|<>|[+*/^():,;%=<>-])/.exec(rest);
    if (!match) throw new Error('#NOME?');
    if (!/^\s+$/.test(match[0])) tokens.push(match[0]);
    rest = rest.slice(match[0].length);
  }
  if (tokens.length > 512) throw new Error('#LIMITE!');
  let pos = 0;
  const take = () => tokens[pos++];
  const peek = () => tokens[pos];
  function expression(min = 0) {
    let node; const token = take();
    if (token === '+' || token === '-') node = { type: 'unary', op: token, value: expression(25) };
    else if (token === '(') { node = expression(); if (take() !== ')') throw new Error('#VALORE!'); }
    else if (token?.startsWith('"')) node = { type: 'literal', value: token.slice(1, -1).replaceAll('""', '"') };
    else if (/^\d/.test(token ?? '')) node = { type: 'literal', value: Number(token) };
    else if (token && /^\$?[A-Za-z_]/.test(token)) {
      if (peek() === '(') {
        take(); const args = [];
        if (peek() !== ')') { do { args.push(expression()); } while ([',', ';'].includes(peek()) && take()); }
        if (take() !== ')') throw new Error('#VALORE!');
        node = { type: 'call', name: token.toUpperCase(), args };
      } else if (['TRUE', 'FALSE', 'VERO', 'FALSO'].includes(token.toUpperCase())) node = { type: 'literal', value: ['TRUE', 'VERO'].includes(token.toUpperCase()) };
      else {
        parseAddress(token);
        node = { type: 'ref', address: token.replaceAll('$', '').toUpperCase() };
        if (peek() === ':') { take(); const end = take(); parseAddress(end ?? ''); node = { type: 'range', start: token, end }; }
      }
    } else throw new Error('#VALORE!');
    if (peek() === '%') { take(); node = { type: 'unary', op: '%', value: node }; }
    while (peek() in precedence && precedence[peek()] >= min) {
      const op = take(); node = { type: 'binary', op, left: node, right: expression(precedence[op] + (op === '^' ? 0 : 1)) };
    }
    return node;
  }
  const tree = expression();
  if (pos !== tokens.length) throw new Error('#VALORE!');
  return tree;
}
const number = value => {
  if (Array.isArray(value)) throw new Error('#VALORE!');
  if (value === '' || value == null) return 0;
  if (typeof value === 'string' && value.startsWith('#')) throw new Error(value);
  const n = Number(value);
  if (!Number.isFinite(n)) throw new Error('#VALORE!');
  return n;
};

/** An intentionally bounded formula engine. Unknown functions return an error, never stale cached results. */
export function createCalculator(getRaw) {
  const cache = new Map(); const visiting = new Set();
  function cell(address) {
    address = address.replaceAll('$', '').toUpperCase();
    if (cache.has(address)) return cache.get(address);
    if (visiting.has(address)) throw new Error('#CICLO!');
    if (visiting.size > 150) throw new Error('#LIMITE!');
    visiting.add(address);
    let result;
    try {
      const raw = getRaw(address);
      result = typeof raw === 'string' && raw.startsWith('=') ? evaluate(parse(raw)) : raw ?? '';
      if (typeof result === 'number' && !Number.isFinite(result)) throw new Error('#NUM!');
      if (Array.isArray(result)) throw new Error('#VALORE!');
    } catch (error) { result = /^#[A-Z0-9/._]+[!?]$/.test(error.message) ? error.message : '#VALORE!'; }
    finally { visiting.delete(address); }
    cache.set(address, result);
    return result;
  }
  function evaluate(node) {
    if (node.type === 'literal') return node.value;
    if (node.type === 'ref') return cell(node.address);
    if (node.type === 'range') {
      const a = parseAddress(node.start), b = parseAddress(node.end), values = [];
      const r0 = Math.min(a.row, b.row), r1 = Math.max(a.row, b.row), c0 = Math.min(a.col, b.col), c1 = Math.max(a.col, b.col);
      if ((r1 - r0 + 1) * (c1 - c0 + 1) > 10000) throw new Error('#LIMITE!');
      for (let row = r0; row <= r1; row++) for (let col = c0; col <= c1; col++) values.push(cell(`${columnName(col)}${row}`));
      return values;
    }
    if (node.type === 'unary') {
      const value = number(evaluate(node.value));
      return node.op === '-' ? -value : node.op === '%' ? value / 100 : value;
    }
    if (node.type === 'binary') {
      const a = number(evaluate(node.left)), b = number(evaluate(node.right));
      switch (node.op) {
        case '+': return a + b; case '-': return a - b; case '*': return a * b;
        case '/': if (!b) throw new Error('#DIV/0!'); return a / b;
        case '^': return a ** b; case '=': return a === b; case '<>': return a !== b;
        case '>': return a > b; case '<': return a < b; case '>=': return a >= b; case '<=': return a <= b;
      }
    }
    if (node.type === 'call') {
      const name = aliases[node.name] ?? node.name;
      if (name === 'IF') {
        if (node.args.length < 2 || node.args.length > 3) throw new Error('#VALORE!');
        return number(evaluate(node.args[0])) ? evaluate(node.args[1]) : node.args[2] ? evaluate(node.args[2]) : false;
      }
      if (!['SUM', 'AVERAGE', 'MIN', 'MAX', 'COUNT', 'ROUND', 'ABS'].includes(name)) throw new Error('#NOME?');
      const values = node.args.flatMap(arg => { const v = evaluate(arg); return Array.isArray(v) ? v : [v]; });
      for (const v of values) if (typeof v === 'string' && v.startsWith('#')) throw new Error(v);
      const nums = values.filter(v => typeof v === 'number');
      switch (name) {
        case 'SUM': return nums.reduce((a, b) => a + b, 0);
        case 'COUNT': return nums.length;
        case 'AVERAGE': if (!nums.length) throw new Error('#DIV/0!'); return nums.reduce((a, b) => a + b, 0) / nums.length;
        case 'MIN': return nums.length ? Math.min(...nums) : 0;
        case 'MAX': return nums.length ? Math.max(...nums) : 0;
        case 'ABS': if (values.length !== 1) throw new Error('#VALORE!'); return Math.abs(number(values[0]));
        case 'ROUND': {
          if (values.length !== 2) throw new Error('#VALORE!');
          const places = number(values[1]);
          if (!Number.isInteger(places) || Math.abs(places) > 15) throw new Error('#NUM!');
          const val = number(values[0]); const factor = 10 ** places;
          return Math.sign(val) * Math.round((Math.abs(val) + Number.EPSILON) * factor) / factor;
        }
      }
    }
    throw new Error('#VALORE!');
  }
  return cell;
}
