import React, { useState, useRef } from "react";
import DragAndDropUpload from "./dragAndDrop";
import Header from "./header";
import { Typography, Box, Chip, IconButton, Button } from "@mui/material";
import Close from "@mui/icons-material/CloseOutlined";
import { sendCSVFile } from "../api/importCSVApi";
import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart';
import { BarChart } from '@mui/x-charts/BarChart';
import LinearProgress from '@mui/material/LinearProgress';


function ImportCSV({ ai, setAi, selectedMode, setSelectedMode }) {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [downloadData, setDownloadData] = useState(null);
  const [chartData, setChartData] = useState({ Positive: 0, Neutral: 0, Negative: 0 });
  const [loading, setLoading] = useState(false);
  const uploadRef = useRef();


  
  const pieData = [
    { id: 0, value: chartData.Positive, label: "Positive" },
    { id: 1, value: chartData.Neutral, label: "Neutral" },
    { id: 2, value: chartData.Negative, label: "Negative" },
  ];

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
    setLoading(true)
    try {
      const res = await sendCSVFile(selectedFiles[0]);
      console.log("📥 Backend Response:", res);

      setDownloadData(res);

      // Calculate sentiment counts from the results array
      if (res.results && Array.isArray(res.results)) {
        const sentimentCounts = { Positive: 0, Neutral: 0, Negative: 0 };
        res.results.forEach(result => {
          if (result.sentiment) {
            sentimentCounts[result.sentiment] = (sentimentCounts[result.sentiment] || 0) + 1;
          }
        });
        setChartData(sentimentCounts);
      }

    } catch (err) {
      console.error("🚫 Upload failed:", err);
      alert(`Upload failed: ${err.message}`);
    }finally {
      setLoading(false); // Stop loading regardless of success/failure
    }
  };

  const triggerDownload = () => {
    if (!downloadData || !downloadData.results) return;

    // Create CSV content from results
    const csvHeader = "Row,Text,Sentiment,Confidence,RoBERTa_Sentiment,RoBERTa_Confidence,LSTM_Sentiment,LSTM_Confidence,Agreement\n";
    const csvRows = downloadData.results.map(result => {
      const text = (result.text || "").replace(/"/g, '""'); // Escape quotes
      return `${result.row},"${text}",${result.sentiment},${result.confidence},${result.roberta?.sentiment || ''},${result.roberta?.confidence || ''},${result.lstm?.sentiment || ''},${result.lstm?.confidence || ''},${result.agreement}`;
    }).join('\n');

    const csvContent = csvHeader + csvRows;
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `sentiment_analysis_results_${new Date().toISOString().split('T')[0]}.csv`;
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

          {loading && <LinearProgress sx={{ mt: 2, width: '100%' }} />}

          {downloadData && (
            <Box sx={{ mt: 2 }}>
              <Button variant="outlined" onClick={triggerDownload}>
                Download Output CSV
              </Button>

              <Box sx={{ mt: 4 }}>
                <Typography variant="h5" sx={{ color: "white", textAlign: "center", mb: 4, fontWeight: "bold" }}>
                  Data From the Predicted Sentiment
                </Typography>

                <Box sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                  gap: 4,
                  alignItems: "center",
                  justifyItems: "center",
                  maxWidth: "1000px",
                  margin: "0 auto"
                }}>
                  <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <Typography variant="h6" sx={{ color: "white", mb: 2, textAlign: "center" }}>
                      Sentiment Distribution
                    </Typography>
                    <PieChart
                      series={[{ data: pieData, arcLabel: (item) => item.label }]}
                      sx={{
                        [`& .${pieArcLabelClasses.root}`]: {
                          fill: "white",
                          fontWeight: "bold",
                        },
                        "& .MuiChartsLabel-root": { color: "white" }
                      }}
                      width={350}
                      height={350}
                    />
                  </Box>

                  <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <Typography variant="h6" sx={{ color: "white", mb: 2, textAlign: "center" }}>
                      Sentiment Count
                    </Typography>
                    <BarChart
                      xAxis={[
                        {
                          data: ['Positive', 'Neutral', 'Negative'],
                          label: 'Sentiment',
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
                          label: 'Total Data',
                          data: [
                            chartData.Positive,
                            chartData.Neutral,
                            chartData.Negative,
                          ],
                        }
                      ]}
                      width={350}
                      height={350}
                      barLabel="value"
                      sx={{
                        "& .MuiChartsAxis-line": { stroke: "white"},
                        "& .MuiChartsLegend-root": { color: "white" },
                        "& .MuiBarElement-root text": { fill: "white" },
                        "& .MuiChartsAxis-tickLabel": { fill: "white" },
                      }}
                    />
                  </Box>
                </Box>
              </Box>
              
            </Box>
          )}
          
        </Box>
      )}
    </div>
  );
}

export default ImportCSV;