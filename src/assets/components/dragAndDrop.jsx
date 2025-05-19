import React, { useState, useRef, useImperativeHandle, forwardRef } from "react";
import { Box, Typography, Button } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const DragAndDropUpload = forwardRef(({
  onFilesSelected,
  selectedFiles,
  setSelectedFiles,
  setCsvData,
}, ref) => {
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef();

  useImperativeHandle(ref, () => ({
    clearFileInput: () => {
      if (fileInputRef.current) {
        fileInputRef.current.value = null;
      }
    },
  }));

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);

    const files = Array.from(e.dataTransfer.files).filter(file =>
      file.name.endsWith(".csv")
    );

    if (files.length > 0) {
      setSelectedFiles(files);
      readCSV(files[0]);
      onFilesSelected?.(files);
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files).filter(file =>
      file.name.endsWith(".csv")
    );

    if (files.length > 0) {
      setSelectedFiles(files);
      readCSV(files[0]);
      onFilesSelected?.(files);
    }
  };

  const readCSV = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const lines = text.split(/\r?\n/).filter(line => line.trim() !== "");

      if (lines.length > 1) {
        const headers = lines[0].split(",").map(h => h.trim().toLowerCase());

        const rows = lines.slice(1).map(line => {
          const values = line.split(",");
          const rowData = {};
          headers.forEach((header, index) => {
            if (["comment", "manual", "sentiment"].includes(header)) {
              rowData[header] = values[index]?.trim() || "";
            }
          });
          return rowData;
        });

        console.log("CSV Rows:", rows);  // Just console log here
        setCsvData(rows);  // still set it if needed elsewhere
      } else {
        console.log("No data rows found.");
        setCsvData([]);
      }
    };
    reader.readAsText(file);
  };

  return (
    <Box
      onDrop={handleDrop}
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      sx={{
        width: 400,
        height: "auto",
        border: `2px dashed ${dragOver ? "#1976d2" : "#ccc"}`,
        borderRadius: 4,
        color: "white",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        transition: "0.2s ease",
        p: 3,
        mt: "30px",
      }}
    >
      <CloudUploadIcon fontSize="large" color={dragOver ? "primary" : "white"} />
      <Typography variant="body1" sx={{ mb: 1 }}>
        Drag and drop CSV files here or
      </Typography>
      <Button variant="contained" component="label">
        Browse Files
        <input
          type="file"
          accept=".csv"
          multiple
          hidden
          ref={fileInputRef}
          onChange={handleFileChange}
        />
      </Button>
    </Box>
  );
});

export default DragAndDropUpload;
