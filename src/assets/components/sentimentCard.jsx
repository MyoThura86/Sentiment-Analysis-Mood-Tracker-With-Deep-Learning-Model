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

  // Add emoji for sentiment
  const getEmoji = (sentiment) => {
    switch(sentiment) {
      case "Positive": return "😊";
      case "Negative": return "😞";
      case "Neutral": return "😐";
      default: return "🤔";
    }
  };

  return (
    <Box
      sx={{
        height: "auto",
        width: { xs: "100%", sm: "90%", md: "460px" },
        maxWidth: "460px",
        padding: { xs: "20px", sm: "25px", md: "30px" },
        border: "2px solid white",
        borderRadius: "30px",
      }}
    >
      <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 1 }}>
        <Typography
          sx={{
            fontFamily: "Roboto",
            fontWeight: "regular",
            fontSize: { xs: "16px", sm: "18px", md: "20px" },
          }}
        >
          Sentiment Analysis:
        </Typography>
        <Typography
          sx={{
            color: color,
            fontFamily: "Roboto",
            fontWeight: "bolder",
            fontSize: { xs: "16px", sm: "18px", md: "20px" },
          }}
        >
          {getEmoji(sentiment)} {sentiment}
        </Typography>
      </Box>
      <Typography sx={{ mt: { xs: 2, md: 4 }, fontSize: { xs: "14px", sm: "16px" } }}>{text}</Typography>
    </Box>
  );
}

export default SentimentCard;
