import * as Formula from '@formulajs/formulajs';

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

const aliases = { SOMMA: 'SUM', MEDIA: 'AVERAGE', 'CONTA.NUMERI': 'COUNT', SE: 'IF', ARROTONDA: 'ROUND', ASS: 'ABS', 'SE.ERRORE': 'IFERROR', 'SOMMA.SE': 'SUMIF', 'SOMMA.PIÙ.SE': 'SUMIFS', 'CONTA.SE': 'COUNTIF', 'CONTA.PIÙ.SE': 'COUNTIFS', 'MEDIA.SE': 'AVERAGEIF', 'MEDIA.PIÙ.SE': 'AVERAGEIFS', 'CONTA.VALORI': 'COUNTA', 'CONTA.VUOTE': 'COUNTBLANK', E: 'AND', O: 'OR', NON: 'NOT', CONCATENA: 'CONCATENATE', SINISTRA: 'LEFT', DESTRA: 'RIGHT', 'STRINGA.ESTRAI': 'MID', LUNGHEZZA: 'LEN', MAIUSC: 'UPPER', MINUSC: 'LOWER', 'ANNULLA.SPAZI': 'TRIM', SOSTITUISCI: 'SUBSTITUTE', TROVA: 'FIND', RICERCA: 'SEARCH', VALORE: 'VALUE', TESTO: 'TEXT', OGGI: 'TODAY', ADESSO: 'NOW', DATA: 'DATE', ANNO: 'YEAR', MESE: 'MONTH', GIORNO: 'DAY', 'GIORNO.SETTIMANA': 'WEEKDAY', 'FINE.MESE': 'EOMONTH', 'CERCA.VERT': 'VLOOKUP', 'CERCA.ORIZZ': 'HLOOKUP', INDICE: 'INDEX', CONFRONTA: 'MATCH', RADQ: 'SQRT', POTENZA: 'POWER', RESTO: 'MOD', INT: 'INT', PRODOTTO: 'PRODUCT', 'MATR.SOMMA.PRODOTTO': 'SUMPRODUCT', 'ARROTONDA.PER.ECC': 'ROUNDUP', 'ARROTONDA.PER.DIF': 'ROUNDDOWN' };
const precedence = { '=': 5, '<>': 5, '<': 5, '>': 5, '<=': 5, '>=': 5, '&': 8, '+': 10, '-': 10, '*': 20, '/': 20, '^': 30 };
const delegatedNames = 'SUMIF SUMIFS COUNTIF COUNTIFS COUNTA COUNTBLANK AVERAGEIF AVERAGEIFS SUMPRODUCT PRODUCT MEDIAN MODE.SNGL STDEV.S STDEV.P VAR.S VAR.P LARGE SMALL RANK.EQ AND OR NOT XOR CONCAT CONCATENATE TEXTJOIN LEFT RIGHT MID LEN UPPER LOWER PROPER TRIM CLEAN SUBSTITUTE REPLACE FIND SEARCH EXACT VALUE TEXT REPT DATE YEAR MONTH DAY HOUR MINUTE SECOND TODAY NOW WEEKDAY WEEKNUM EDATE EOMONTH DAYS NETWORKDAYS WORKDAY SQRT POWER MOD INT TRUNC ROUNDUP ROUNDDOWN CEILING FLOOR SIGN PI EXP LN LOG LOG10 SIN COS TAN RADIANS DEGREES VLOOKUP HLOOKUP INDEX MATCH CHOOSE ISNUMBER ISTEXT ISBLANK ISERROR PMT PV FV NPV IRR'.split(' ');
const functionFor = name => name.split('.').reduce((value, key) => value?.[key], Formula);
export const SUPPORTED_FUNCTIONS = [...new Set(['SUM', 'AVERAGE', 'MIN', 'MAX', 'COUNT', 'ROUND', 'ABS', 'IF', 'IFERROR', ...delegatedNames.filter(name => typeof functionFor(name) === 'function')])];
const supported = new Set(SUPPORTED_FUNCTIONS);
const errors = { '#VALUE!': '#VALORE!', '#REF!': '#RIF!', '#NAME?': '#NOME?', '#N/A': '#N/D' };
const isError = value => typeof value === 'string' && /^#[A-Z0-9/._]+[!?]?$/.test(value);

function parse(source) {
  if (source.length > 8192) throw new Error('#LIMITE!');
  const notation = source.replace(/"(?:[^"]|"")*"|'(?:[^']|'')*'/g, '');
  const usesItalianNames = [...notation.matchAll(/([A-Za-z_À-ÿ][A-Za-z0-9_.À-ÿ]*)\s*\(/g)].some(match => Object.hasOwn(aliases, match[1].toUpperCase()));
  const decimalComma = notation.includes(';') || usesItalianNames || !/[A-Za-z_À-ÿ][A-Za-z0-9_.À-ÿ]*\s*\(/.test(notation);
  const tokens = [];
  let rest = source.trim().replace(/^=/, '');
  while (rest) {
    const numeric = (decimalComma ? /^\d+(?:[.,]\d+)?(?:[eE][+-]?\d+)?/ : /^\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/).exec(rest);
    const match = numeric || /^(\s+|"(?:[^"]|"")*"|'(?:[^']|'')*'|#[A-Za-z0-9/._]+[!?]?|\$?[A-Za-z_À-ÿ][A-Za-z0-9_.$À-ÿ]*|<=|>=|<>|[+*/^():,;%=<>!&-])/.exec(rest);
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
    else if (token?.startsWith('#')) node = { type: 'error', value: errors[token] || token };
    else if (/^\d/.test(token ?? '')) node = { type: 'literal', value: Number(token.replace(',', '.')) };
    else if (token && (/^\$?[A-Za-z_À-ÿ]/.test(token) || token.startsWith("'"))) {
      if (peek() === '(') {
        take(); const args = [];
        if (peek() !== ')') { do { args.push(expression()); } while ([',', ';'].includes(peek()) && take()); }
        if (take() !== ')') throw new Error('#VALORE!');
        node = { type: 'call', name: token.toUpperCase(), args };
      } else if (['TRUE', 'FALSE', 'VERO', 'FALSO'].includes(token.toUpperCase())) node = { type: 'literal', value: ['TRUE', 'VERO'].includes(token.toUpperCase()) };
      else {
        let sheet, address = token;
        if (peek() === '!') { take(); sheet = token.startsWith("'") ? token.slice(1, -1).replaceAll("''", "'") : token; address = take(); }
        parseAddress(address || '');
        node = { type: 'ref', sheet, original: address, address: address.replaceAll('$', '').toUpperCase() };
        if (peek() === ':') { take(); const end = take(); parseAddress(end ?? ''); node = { type: 'range', sheet, start: address, end }; }
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
export function createCalculator(getRaw, defaultSheet = '') {
  const cache = new Map(); const visiting = new Set();
  function cell(address, sheet = defaultSheet) {
    address = address.replaceAll('$', '').toUpperCase();
    const key = `${sheet.toLocaleLowerCase()}!${address}`;
    if (cache.has(key)) return cache.get(key);
    if (visiting.has(key)) throw new Error('#CICLO!');
    if (visiting.size > 150) throw new Error('#LIMITE!');
    visiting.add(key);
    let result;
    try {
      const raw = getRaw(address, sheet);
      result = raw && typeof raw === 'object' && Object.hasOwn(raw, 'literal') ? raw.literal : typeof raw === 'string' && raw.startsWith('=') ? evaluate(parse(raw), sheet) : raw ?? '';
      if (typeof result === 'number' && !Number.isFinite(result)) throw new Error('#NUM!');
      if (Array.isArray(result)) throw new Error('#VALORE!');
    } catch (error) { result = isError(error.message) ? error.message : '#VALORE!'; }
    finally { visiting.delete(key); }
    cache.set(key, result);
    return result;
  }
  function evaluate(node, sheet) {
    const run = value => evaluate(value, sheet);
    if (node.type === 'literal' || node.type === 'error') return node.value;
    if (node.type === 'ref') return cell(node.address, node.sheet ?? sheet);
    if (node.type === 'range') {
      const a = parseAddress(node.start), b = parseAddress(node.end), values = [];
      const r0 = Math.min(a.row, b.row), r1 = Math.max(a.row, b.row), c0 = Math.min(a.col, b.col), c1 = Math.max(a.col, b.col);
      if ((r1 - r0 + 1) * (c1 - c0 + 1) > 10000) throw new Error('#LIMITE!');
      for (let row = r0; row <= r1; row++) { const line = []; for (let col = c0; col <= c1; col++) line.push(cell(`${columnName(col)}${row}`, node.sheet ?? sheet)); values.push(line); }
      return values;
    }
    if (node.type === 'unary') {
      const value = number(run(node.value));
      return node.op === '-' ? -value : node.op === '%' ? value / 100 : value;
    }
    if (node.type === 'binary') {
      const left = run(node.left), right = run(node.right);
      if (isError(left)) throw new Error(left); if (isError(right)) throw new Error(right);
      if (node.op === '&') return String(left) + String(right);
      if (['=', '<>', '<', '>', '<=', '>='].includes(node.op)) {
        const a = typeof left === 'string' ? left.toLocaleLowerCase() : left, b = typeof right === 'string' ? right.toLocaleLowerCase() : right;
        return node.op === '=' ? a === b : node.op === '<>' ? a !== b : node.op === '<' ? a < b : node.op === '>' ? a > b : node.op === '<=' ? a <= b : a >= b;
      }
      const a = number(left), b = number(right);
      switch (node.op) {
        case '+': return a + b; case '-': return a - b; case '*': return a * b;
        case '/': if (!b) throw new Error('#DIV/0!'); return a / b;
        case '^': return a ** b; case '=': return a === b; case '<>': return a !== b;
        case '>': return a > b; case '<': return a < b; case '>=': return a >= b; case '<=': return a <= b;
      }
    }
    if (node.type === 'call') {
      const normalized = node.name.replace(/^_XLFN\./, '');
      const name = aliases[normalized] ?? normalized;
      if (name === 'IF') {
        if (node.args.length < 2 || node.args.length > 3) throw new Error('#VALORE!');
        return number(run(node.args[0])) ? run(node.args[1]) : node.args[2] ? run(node.args[2]) : false;
      }
      if (name === 'IFERROR') { if (node.args.length !== 2) throw new Error('#VALORE!'); try { const result = run(node.args[0]); return isError(result) ? run(node.args[1]) : result; } catch { return run(node.args[1]); } }
      if (!supported.has(name)) throw new Error('#NOME?');
      const args = node.args.map(run);
      const values = args.flat(Infinity);
      if (['ISERROR', 'ISNUMBER', 'ISTEXT', 'ISBLANK'].includes(name)) {
        if (args.length !== 1) throw new Error('#VALORE!');
        return name === 'ISERROR' ? isError(args[0]) : name === 'ISNUMBER' ? typeof args[0] === 'number' : name === 'ISTEXT' ? typeof args[0] === 'string' && !isError(args[0]) && args[0] !== '' : args[0] === '' || args[0] == null;
      }
      for (const v of values) if (typeof v === 'string' && v.startsWith('#')) throw new Error(v);
      if (!['SUM', 'AVERAGE', 'MIN', 'MAX', 'COUNT', 'ROUND', 'ABS'].includes(name)) {
        const result = functionFor(name)(...args);
        if (result instanceof Error) throw new Error(errors[result.message] || result.message);
        return result instanceof Date ? (Date.UTC(result.getFullYear(), result.getMonth(), result.getDate(), result.getHours(), result.getMinutes(), result.getSeconds()) / 86400000) + 25569 : result;
      }
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

/** XLSX stores English function names, comma argument separators and dot decimals, regardless of UI locale. */
export function invariantFormula(source) {
  try {
    const tree = parse(source);
    function write(node) {
      const sheet = node.sheet == null ? '' : `'${node.sheet.replaceAll("'", "''")}'!`;
      if (node.type === 'error') return Object.entries(errors).find(([, local]) => local === node.value)?.[0] || node.value;
      if (node.type === 'literal') return typeof node.value === 'string' ? `"${node.value.replaceAll('"', '""')}"` : typeof node.value === 'boolean' ? node.value ? 'TRUE' : 'FALSE' : String(node.value);
      if (node.type === 'ref') return `${sheet}${node.original || node.address}`;
      if (node.type === 'range') return `${sheet}${node.start}:${node.end}`;
      if (node.type === 'unary') return node.op === '%' ? `(${write(node.value)})%` : `${node.op}(${write(node.value)})`;
      if (node.type === 'binary') return `(${write(node.left)}${node.op}${write(node.right)})`;
      if (node.type === 'call') return `${aliases[node.name] || node.name.replace(/^_XLFN\./, '_xlfn.')}(${node.args.map(write).join(',')})`;
      throw new Error('Unsupported syntax');
    }
    return write(tree);
  } catch { return source.replace(/^=/, ''); }
}
