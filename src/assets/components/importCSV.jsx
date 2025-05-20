import React, { useState, useRef } from "react";
import DragAndDropUpload from "./dragAndDrop";
import Header from "./header";
import { Typography, Box, Chip, IconButton, Button } from "@mui/material";
import Close from "@mui/icons-material/CloseOutlined";
import { sendCSVFile } from "../api/importCSVApi";

function ImportCSV({ ai, setAi, selectedMode, setSelectedMode }) {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [downloadData, setDownloadData] = useState(null);
  const uploadRef = useRef();

  const handleFiles = (files) => {
    setDownloadData(null); // Reset download data
    console.log("CSV files selected:", files);
  };

  const handleClear = () => {
    setSelectedFiles([]);
    setDownloadData(null);
    uploadRef.current?.clearFileInput();
  };

  const handleSubmit = async () => {
    if (selectedFiles.length === 0) return;

    try {
      const res = await sendCSVFile(selectedFiles[0]);
      console.log("📥 Backend Response:", res);
      setDownloadData(res);
    } catch (err) {
      console.error("🚫 Upload failed:", err);
    }
  };

  const triggerDownload = () => {
  if (!downloadData) return;

  const blob = new Blob(
    [atob(downloadData.download.base64)],
    { type: "text/csv" }
  );

  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = downloadData.filename || "output.csv";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

  return (
    <div style={{ padding: 30, display: "flex", flexDirection: "column", alignItems: "center", color: "white" }}>
      <Header ai={ai} setAi={setAi} selectedMode={selectedMode} setSelectedMode={setSelectedMode} />

      {selectedFiles.length === 0 ? (
        <DragAndDropUpload
          ref={uploadRef}
          onFilesSelected={handleFiles}
          selectedFiles={selectedFiles}
          setSelectedFiles={setSelectedFiles}
        />
      ) : (
        <Box>
          <Box sx={{ width: "480px", display: "flex", alignItems: "center", gap: 1, mt: 2 }}>
            <Typography sx={{ color: "white" }}>Imported data from:</Typography>
            <Chip label={selectedFiles.map(f => f.name).join(", ")} color="primary" />
            <IconButton aria-label="clear" size="small" onClick={handleClear} sx={{ color: "white" }}>
              <Close fontSize="inherit" />
            </IconButton>
          </Box>

          <Box sx={{ mt: 2 }}>
            <Button variant="contained" onClick={handleSubmit}>
              Get Your Output Text
            </Button>
          </Box>

          {downloadData && (
            <Box sx={{ mt: 2 }}>
              <Button variant="outlined" onClick={triggerDownload}>
                Download Output CSV
              </Button>
            </Box>
          )}
        </Box>
      )}
    </div>
  );
}

export default ImportCSV;