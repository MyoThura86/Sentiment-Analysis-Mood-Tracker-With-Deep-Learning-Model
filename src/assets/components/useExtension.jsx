
import React from "react";
import Header from "./header";
import { Card, Box } from "@mui/material";

function UseExtension({ai, setAi, selectedMode, setSelectedMode}){

  return(

    <Box sx={{ px: { xs: 2, sm: 0 } }}>
      <Header ai={ai} setAi={setAi} selectedMode={selectedMode} setSelectedMode={setSelectedMode} />
      <h1>Use Extension</h1>
      <Card sx={{
        width: { xs: "100%", sm: "90%", md: "460px" },
        maxWidth: "460px",
        padding: { xs: "8px 15px", sm: "8px 20px" },
        background: "#3B3A4A",
        color: "White",
        borderRadius: "10px"
      }}>
        <h3>User Manual</h3>
        <p>To analyze the sentiment level of any text, simply highlight the portion you're interested in, right-click on the selected text, and then choose the 'Analyze Text' option from the context menu. This will initiate a process that evaluates the emotional tone and sentiment behind the words you've selected.</p>
      </Card>
    </Box>

  )
}

export default UseExtension