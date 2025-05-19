import React, { useState, useRef, useEffect } from "react";
import DragAndDropUpload from "./dragAndDrop";
import Header from "./header";
import { Typography, Box, Chip, IconButton } from "@mui/material";
import Close from "@mui/icons-material/CloseOutlined";
import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";
import { BarChart } from "@mui/x-charts";

function ImportCSV({ ai, setAi, selectedMode, setSelectedMode }) {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [csvData, setCsvData] = useState([]);
  const [manualCounts, setManualCounts] = useState({ Positive: 0, Neutral: 0, Negative: 0 });
  const [SentimentCounts, setSentimentCounts] = useState({ Positive: 0, Neutral: 0, Negative: 0 });
  const uploadRef = useRef();

  const handleFiles = (files) => {
    console.log("CSV files selected:", files);
  };

  const handleClear = () => {
    setSelectedFiles([]);
    setCsvData([]);
    setManualCounts({ Positive: 0, Neutral: 0, Negative: 0 });
    uploadRef.current?.clearFileInput();
  };

  useEffect(() => {
    const counts = { Positive: 0, Neutral: 0, Negative: 0 };
    csvData.forEach(row => {
      const val = row.manual?.trim();
      if (val && counts.hasOwnProperty(val)) {
        counts[val]++;
      }
    });
    setManualCounts(counts);
    setSentimentCounts(counts);
  }, [csvData]);

  const pieData = [
    { id: 0, value: manualCounts.Positive, label: "Positive" },
    { id: 1, value: manualCounts.Neutral, label: "Neutral" },
    { id: 2, value: manualCounts.Negative, label: "Negative" },
  ];

  return (
    <div style={{ padding: "30px", display: "flex", flexDirection: "column", alignItems: "center", color: "white" }}>
      <Header
        ai={ai}
        setAi={setAi}
        selectedMode={selectedMode}
        setSelectedMode={setSelectedMode}
      />

      {selectedFiles.length === 0 && (
        <DragAndDropUpload
          ref={uploadRef}
          onFilesSelected={handleFiles}
          selectedFiles={selectedFiles}
          setSelectedFiles={setSelectedFiles}
          setCsvData={setCsvData}
        />
      )}

      {selectedFiles.length > 0 && (
        <Box>
          <Box sx={{ width: "480px", display: "flex", alignItems: "center", gap: 1, mt: 2 }}>
            <Typography sx={{ color: "white" }}>Imported data from:</Typography>
            <Chip label={selectedFiles.map(f => f.name).join(", ")} color="primary" />
            <IconButton aria-label="clear" size="small" onClick={handleClear} sx={{ color: "white" }}>
              <Close fontSize="inherit" />
            </IconButton>
          </Box>

          <Box sx={{ display:"flex",flexDirection:"column",mt:4,gap:"100px" }}>
            <PieChart
              series={[{ data: pieData, arcLabel: (item) => item.label }]}
              sx={{
                [`& .${pieArcLabelClasses.root}`]: {
                  fill: "white",
                  
                  fontWeight: "bold",
                },
                "& .MuiChartsLabel-root":{color:"white"}
              }}
              width={300}
              height={300}
            />
            
            <BarChart
              xAxis={[
                {
                  data: ['Positive', 'Neutral', 'Negative'],
                  label: 'Analysis between Manual and Sentiment',
                  tickLabelStyle: { fill: 'white' },
                  labelStyle: { fill: 'white' },
                }
              ]}
              yAxis={[
                {
                  label: 'Count',
                  tickLabelStyle: { fill: 'white' },
                  labelStyle: { fill: 'white' },
                }
              ]}
              series={[
                {
                  label: 'Manual',
                  data: [
                    manualCounts.Positive,
                    manualCounts.Neutral,
                    manualCounts.Negative,
                  ],
                },
                {
                  label: 'Sentiment',
                  data: [
                    SentimentCounts.Positive,
                    SentimentCounts.Neutral,
                    SentimentCounts.Negative,
                  ],
                }
              ]}
              height={300}
              barLabel="value"
              sx={{
                
                "& .MuiChartsAxis-line": { stroke: "white" },
                "& .MuiChartsLegend-root": { color: "white" },
                "& .MuiBarElement-root text": { fill: "white" },
                "& .MuiChartsAxis-tickLabel": { fill: "white" },
              }}
            />


          </Box>
        </Box>
      )}
    </div>
  );
}

export default ImportCSV;
