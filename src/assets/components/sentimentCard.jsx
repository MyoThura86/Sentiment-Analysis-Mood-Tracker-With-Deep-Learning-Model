import { Box, Typography } from "@mui/material";

function SentimentCard({ sentiment, text }) {
  // Map sentiment to colors
  const sentimentColors = {
    Positive: "#27FF5A",  // green
    Negative: "#FF3B3B",  // red
    Neutral: "#B0B0B0",   // light grey
  };

  // Default color if sentiment is unknown
  const color = sentimentColors[sentiment] || "white";

  return (
    <Box
      sx={{
        height: "auto",
        width: "460px",
        padding: "30px",
        border: "2px solid white",
        borderRadius: "30px",
      }}
    >
      <div style={{ display: "flex" }}>
        <Typography
          sx={{
            marginRight: "10px",
            fontFamily: "Roboto",
            fontWeight: "regular",
            fontSize: "20px",
          }}
        >
          Sentiment Analysis:
        </Typography>
        <Typography
          sx={{
            color: color,
            fontFamily: "Roboto",
            fontWeight: "bolder",
            fontSize: "20px",
          }}
        >
          {sentiment}
        </Typography>
      </div>
      <Typography sx={{ marginTop: "30px" }}>{text}</Typography>
    </Box>
  );
}

export default SentimentCard;
