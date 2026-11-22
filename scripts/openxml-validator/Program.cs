using System.Text.Json;
using DocumentFormat.OpenXml;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Validation;

if (args.Length != 2) { Console.Error.WriteLine("Indica manifest JSON e percorso del report."); return 2; }
var files = JsonSerializer.Deserialize<string[]>(File.ReadAllText(args[0])) ?? [];
if (files.Length == 0) { Console.Error.WriteLine("Nessun file esportato da validare."); return 2; }
var results = new List<object>();
var failed = false;
var validator = new OpenXmlValidator(FileFormatVersions.Microsoft365) { MaxNumberOfErrors = 1000 };
foreach (var file in files)
{
    try
    {
        using OpenXmlPackage package = Path.GetExtension(file).ToLowerInvariant() switch
        {
            ".docx" => WordprocessingDocument.Open(file, false),
            ".xlsx" => SpreadsheetDocument.Open(file, false),
            _ => throw new InvalidDataException("Formato non supportato dal validatore CosmOffice.")
        };
        var errors = validator.Validate(package).Select(error => new
        {
            id = error.Id, description = error.Description,
            part = error.Part?.Uri.ToString(), path = error.Path?.XPath
        }).ToArray();
        results.Add(new { file, errors });
        Console.WriteLine($"{(errors.Length == 0 ? "PASS" : "FAIL")} {file}: {errors.Length} errori Open XML SDK");
        if (errors.Length > 0) { failed = true; foreach (var error in errors) Console.WriteLine(JsonSerializer.Serialize(error)); }
    }
    catch (Exception error)
    {
        failed = true;
        results.Add(new { file, errors = new[] { new { id = "AperturaFallita", description = error.Message, part = "", path = "" } } });
        Console.Error.WriteLine($"FAIL {file}: apertura non riuscita: {error.Message}");
    }
}
File.WriteAllText(args[1], JsonSerializer.Serialize(new { result = failed ? "FAIL" : "PASS", sdk = "DocumentFormat.OpenXml 3.5.1", schema = "Microsoft365", files = results }, new JsonSerializerOptions { WriteIndented = true }));
return failed ? 1 : 0;
