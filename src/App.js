import React, { useState } from "react";
import "./App.css";
import XLSX from "xlsx";
import CsvDownload from "react-json-to-csv";

console.log(XLSX);

function App() {
  const [excelToJson, setExcelToJson] = useState([]);
  const [jsonToExcel, setJsonToExcel] = useState();
  const [csvName, setCsvName] = useState("");
  let inputJson;
  let selectedFile;

  const handleFileUpload = (event) => {
    selectedFile = event.target.files[0];
  };

  const handleFileConvert = (event) => {
    if (selectedFile) {
      let fileReader = new FileReader();
      fileReader.readAsBinaryString(selectedFile);
      fileReader.onload = (event) => {
        let data = event.target.result;
        let workbook = XLSX.read(data, { type: "binary" });
        workbook.SheetNames.forEach((sheet) => {
          setExcelToJson((prev) => [
            ...prev,
            XLSX.utils.sheet_to_json(workbook.Sheets[sheet]),
          ]);
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
      setCsvName(`${inputJsonName.substring(0, ext)}.csv`);
      let fileReader = new FileReader();
      fileReader.readAsBinaryString(inputJson);
      fileReader.onload = (event) => {
        setJsonToExcel(JSON.parse(event.target.result));
      };
    }
  };
  if (jsonToExcel) {
    console.log(Array.isArray(jsonToExcel));
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
            <h4>Your data in JSON:</h4>
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
        {jsonToExcel !== undefined ? (
          Array.isArray(jsonToExcel) ? (
            <CsvDownload data={jsonToExcel} filename={csvName}>
              Download File
            </CsvDownload>
          ) : (
            <CsvDownload data={[jsonToExcel]} filename={csvName}>
              Download File
            </CsvDownload>
          )
        ) : null}
      </div>
    </div>
  );
}

export default App;
