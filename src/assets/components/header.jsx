import React from "react";
import { changeModel } from "../api/changeModelApi";

import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button
} from "@mui/material";
import DescriptionIcon from "@mui/icons-material/Description";
import EditNote from "@mui/icons-material/EditNote";
import Extension from "@mui/icons-material/Extension";
import { useNavigate } from "react-router-dom";

function Header({ ai, setAi, selectedMode, setSelectedMode }) {
  const navigate = useNavigate();

  const handleChange = async (event) => {
    const selectedModel = event.target.value;
    try {
      const res = await changeModel(selectedModel.toLowerCase());
      console.log("Model changed to:", res.modelName);
      setAi(selectedModel);
    } catch (error) {
      console.error("Error switching model:", error);
    }
  };

  
  const getButtonStyle = (mode) => ({
    backgroundColor: selectedMode === mode ? "#3B3A49" : "",
    height: "42px",
    width: "42px",
    color: "white",
    
    
    borderRadius: "10px"
  });

  return (
    <div style={{
      width: "495px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      borderBottom:selectedMode=="importText" ? "0px":"1px solid white"
    }}>
      <FormControl
        variant="standard"
        sx={{
          ml: 1,
          minWidth: 120,
          pb: 2,
          "& .MuiInputLabel-root": { color: "white" },
          "& .MuiInputLabel-root.Mui-focused": { color: "white" },
          "& .MuiSelect-root": { color: "white" },
          "& .MuiInputBase-root": { color: "white" },
          "& .MuiInput-underline:before": { borderBottom: "1px solid white" },
          "& .MuiInput-underline:hover:not(.Mui-disabled):before": { borderBottom: "2px solid white" },
          "& .MuiInput-underline:after": { borderBottom: "2px solid white" }
        }}
      >
        <InputLabel id="ai-select-label">AI</InputLabel>
        <Select
          sx={{ "& .MuiSelect-icon": { color: "white" } }}
          labelId="ai-select-label"
          id="ai-select"
          value={ai}
          onChange={handleChange}
        >
          <MenuItem value={"roberta"}><em>RoBERTa</em></MenuItem>
          <MenuItem value={"lstm"}>LSTM</MenuItem>
        </Select>
      </FormControl>

      <div style={{  display: "flex", flexDirection: "row", gap: "2px" }}>
        <Button
          onClick={() => {
            setSelectedMode("importText");
            navigate("/importText");
          }}
          style={getButtonStyle("importText")}
        >
          <DescriptionIcon />
        </Button>

        <Button
          onClick={() => {
            setSelectedMode("importCSV");
            navigate("/importCSV");
          }}
          style={getButtonStyle("importCSV")}
        >
          <EditNote />
        </Button>

        <Button 
          onClick={() => {
            setSelectedMode("useExtension");
            navigate("/useExtension");
          }}
          style={getButtonStyle("useExtension")}
        >
          <Extension />
        </Button>
      </div>
    </div>
  );
}

export default Header;
