
import React from "react";
import Header from "./header";
import { Card } from "@mui/material";

function UseExtension({ai, setAi, selectedMode, setSelectedMode}){

  return(

    <div>
      <Header ai={ai} setAi={setAi} selectedMode={selectedMode} setSelectedMode={setSelectedMode} />
      <h1>Use Extension</h1>
      <Card sx={{width:"460px", padding:"8px 20px ",background:"#3B3A4A", color:"White",borderRadius:"10px"}}>
        <h3>User Manual</h3>
        <p>To analyze the sentiment level of any text, simply highlight the portion you're interested in, right-click on the selected text, and then choose the 'Analyze Text' option from the context menu. This will initiate a process that evaluates the emotional tone and sentiment behind the words you've selected.</p>
      </Card>
    </div>

  )
}

export default UseExtension