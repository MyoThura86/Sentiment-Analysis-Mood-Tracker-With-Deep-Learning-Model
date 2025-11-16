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
        width: { xs: '100%', sm: '90%', md: 400 },
        maxWidth: 400,
        border: `2px dashed ${dragOver ? "#1976d2" : "#ccc"}`,
        borderRadius: 3,
        color: "white",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        transition: "0.2s ease",
        p: { xs: 2, sm: 2.5, md: 3 },
        mt: { xs: 2, sm: 3 },
      }}
    >
      <CloudUploadIcon sx={{ fontSize: { xs: 36, sm: 40, md: 48 } }} color={dragOver ? "primary" : "inherit"} />
      <Typography variant="body2" sx={{ mb: 1, fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
        Drag and drop CSV or Excel files here or
      </Typography>
      <Button variant="contained" component="label" size="small">
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