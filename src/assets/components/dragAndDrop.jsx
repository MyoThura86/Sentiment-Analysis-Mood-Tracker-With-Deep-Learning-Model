import React, { useState, useRef, useImperativeHandle, forwardRef } from "react";
import { Box, Typography, Button } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const DragAndDropUpload = forwardRef(({ onFilesSelected, setSelectedFiles }, ref) => {
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
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleFileChange = (e) => {
    handleFiles(e.target.files);
  };

  const handleFiles = (fileList) => {
    const files = Array.from(fileList).filter(file =>
      /\.(csv|xlsx?)$/i.test(file.name)
    );

    if (files.length > 0) {
      setSelectedFiles(files);
      onFilesSelected?.(files);
    }
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
        mt: 4,
      }}
    >
      <CloudUploadIcon fontSize="large" color={dragOver ? "primary" : "inherit"} />
      <Typography variant="body1" sx={{ mb: 1 }}>
        Drag and drop CSV or Excel files here or
      </Typography>
      <Button variant="contained" component="label">
        Browse Files
        <input
          type="file"
          accept=".csv,.xlsx,.xls"
          hidden
          ref={fileInputRef}
          onChange={handleFileChange}
        />
      </Button>
    </Box>
  );
});

export default DragAndDropUpload;