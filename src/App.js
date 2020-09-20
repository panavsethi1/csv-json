import React, { useState } from "react";
import "./App.css";
import XLSX from "xlsx";
import jsonexport from "jsonexport/dist";
import csvtojson from "csvtojson";
import flat from "flat";

console.log(XLSX);

function App() {
  const [excelToJson, setExcelToJson] = useState([]);
  const [jsonToExcel, setJsonToExcel] = useState();
  let inputJson;
  let selectedFile;

  function exportData(filename, data) {
    var mimeType = "text/plain";
    var link = document.createElement("a");
    link.setAttribute("download", filename);
    link.setAttribute(
      "href",
      "data:" + mimeType + ";charset=utf-8," + encodeURIComponent(data)
    );
    link.click();
  }

  const handleFileUpload = (event) => {
    selectedFile = event.target.files[0];
  };

  const handleFileConvert = (event) => {
    if (selectedFile) {
      let filename = String(selectedFile.name);
      let ext = Number(filename.indexOf("."));
      let fileReader = new FileReader();
      fileReader.readAsBinaryString(selectedFile);
      fileReader.onload = (event) => {
        let data = event.target.result;
        // let workbook = XLSX.read(data, { type: "binary" });
        // workbook.SheetNames.forEach((sheet) => {
        //   setExcelToJson((prev) => [
        //     ...prev,
        //     XLSX.utils.sheet_to_json(workbook.Sheets[sheet]),
        //   ]);
        // });
        csvtojson({ flatKeys: true })
          .fromString(data)
          .then((json) => {
            exportData(
              `${filename.substring(0, ext)}.json`,
              JSON.stringify(json)
            );
          });
      };
    }
  };

  const handleJsonChange = (event) => {
    inputJson = event.target.files[0];
  };

  const handleJsonConvert = () => {
    if (inputJson) {
      let inputJsonName = String(inputJson.name);
      let ext = Number(inputJsonName.indexOf("."));
      let fileReader = new FileReader();
      fileReader.readAsBinaryString(inputJson);
      fileReader.onload = (event) => {
        let json = JSON.parse(event.target.result);

        // let json = flatten(JSON.parse(event.target.result));
        // const jsonArray = Object.entries(json).map((ent) => {
        //   return [ent[0], String(ent[1])];
        // });
        // setJsonToExcel(Object.fromEntries(jsonArray));
        // Axios.post("https://json-csv.com/api/getcsv", {
        //   email: "panav.sethi.delhi@gmail.com",
        //   json: json,
        // }).then((resp) => {
        //   console.log(resp);
        // });
        // const csv = parse(json, {
        //   excelStrings: true,
        // });
        // setJsonToExcel(csv);
        // exportData(`${inputJsonName.substring(0, ext)}.csv`, csv);
        Array.isArray(json)
          ? jsonexport(json, { fillTopRow: true }, function (err, csv) {
              if (err) {
                return console.error(err);
              }
              exportData(`${inputJsonName.substring(0, ext)}.csv`, csv);
            })
          : jsonexport([json], { fillTopRow: true }, function (err, csv) {
              if (err) {
                return console.error(err);
              }
              exportData(`${inputJsonName.substring(0, ext)}.csv`, csv);
            });
      };
    }
  };
  if (jsonToExcel) {
    console.log(jsonToExcel);
  }
  const jsonString = JSON.stringify(excelToJson);
  return (
    <div className="App">
      <div className="container" style={{ textAlign: "center" }}>
        <h3>Excel to JSON</h3>
        <input
          id="xlsFile"
          className="form-group"
          onChange={handleFileUpload}
          type="file"
          accept=".xls, .xlsx, .csv"
        ></input>
        <button className="btn btn-lg btn-primary" onClick={handleFileConvert}>
          Convert
        </button>
        {jsonString === "[]" ? null : (
          <div>
            <h4>Your data in JSON string:</h4>
            <p>{jsonString}</p>
          </div>
        )}
        <h3>JSON to Excel</h3>
        <input
          className="form-group"
          onChange={handleJsonChange}
          type="file"
          accept=".json, .js"
        ></input>
        <button className="btn btn-lg btn-primary" onClick={handleJsonConvert}>
          Convert
        </button>{" "}
        <br />
        <br />
        {/* {jsonToExcel !== undefined ? (
          Array.isArray(jsonToExcel) ? (
            <CsvDownload data={jsonToExcel} filename={csvName}>
              Download File
            </CsvDownload>
          ) : (
            <CsvDownload data={[jsonToExcel]} filename={csvName}>
              Download File
            </CsvDownload>
          )
        ) : null} */}
      </div>
    </div>
  );
}

export default App;

//  function exportData(filename, data) {
//         mimeType = 'text/plain';
//         var link = document.createElement('a');
//         link.setAttribute('download', filename);
//         link.setAttribute('href', 'data:' + mimeType + ';charset=utf-8,' + encodeURIComponent(data));
//         link.click();
//     }\
// function exportData(filename, data) {
//   mimeType = "text/plain";
//   var link = document.createElement("a");
//   link.setAttribute("download", filename);
//   link.setAttribute(
//     "href",
//     "data:" + mimeType + ";charset=utf-8," + encodeURIComponent(data)
//   );
//   link.click();
// }

// exportData("test.csv", "sadhfasfdjaskjfd,las")
