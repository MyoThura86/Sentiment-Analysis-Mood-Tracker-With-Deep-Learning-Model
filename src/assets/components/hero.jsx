// Hero.js
import React from "react";
import {
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import DescriptionIcon from "@mui/icons-material/Description";
import EditNote from "@mui/icons-material/EditNote";
import Extension from "@mui/icons-material/Extension";
import { useNavigate } from 'react-router-dom';
import { changeModel } from "../api/changeModelApi";

function Hero({ ai, setAi, selectedMode, setSelectedMode }) {
  const navigate = useNavigate();

  const handleChange = async (event) => {
    const selectedModel = event.target.value;
    try {
      const res = await changeModel(selectedModel);
      console.log("Model changed:", res.modelName);
      setAi(selectedModel);
    } catch (err) {
      console.error("Error changing model:", err);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        justifyContent: "space-around",
        padding: "20px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-around",
        }}
      >
        <Typography
          sx={{
            fontFamily: "Inter",
            fontWeight: "bold",
            fontSize: "20px",
            color: "white",
          }}
        >
          Hello, You are using
        </Typography>

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
            "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
              borderBottom: "2px solid white",
            },
            "& .MuiInput-underline:after": { borderBottom: "2px solid white" },
          }}
        >
          
          <Select
            sx={{ "& .MuiSelect-icon": { color: "white" } }}
            labelId="ai-select-label"
            id="ai-select"
            value={ai}
            defaultValue={"roberta"}
            onChange={handleChange}
          >
            <MenuItem value={"roberta"}>RoBERTa</MenuItem>
            <MenuItem value={"lstm"}>LSTM</MenuItem>
          </Select>
        </FormControl>
      </div>

      <Typography
        sx={{
          fontFamily: "Inter",
          fontWeight: "bold",
          fontSize: "30px",
          color: "white",
        }}
      >
        CHOOSE YOUR MODE
      </Typography>

      <div
        style={{
          display: "flex",
          justifyContent: "space-evenly",
          padding: "30px",
          width: "668px",
        }}
      >
        <Button
          onClick={() => {
            setSelectedMode("importText");
            navigate("/importText");
          }}
          variant="contained"
          style={{
            backgroundColor: "#3B3A49",
            height: "136px",
            width: "174px",
            color: "white",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-evenly",
            borderRadius: "30px",
          }}
        >
          <DescriptionIcon sx={{ fontSize: 48, mb: 1 }} />
          Import Text
        </Button>

        <Button
          onClick={() => {
            setSelectedMode("importCSV");
            navigate("/importCSV");
          }}
          variant="contained"
          style={{
            backgroundColor: "#3B3A49",
            height: "136px",
            width: "174px",
            color: "white",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-evenly",
            borderRadius: "30px",
          }}
        >
          <EditNote sx={{ fontSize: 48, mb: 1 }} />
          Import CSV
        </Button>

        <Button
          onClick={() => {
            setSelectedMode("useExtension");
            navigate("/useExtension");
          }}
          variant="contained"
          style={{
            backgroundColor: "#3B3A49",
            height: "136px",
            width: "174px",
            color: "white",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-evenly",
            borderRadius: "30px",
          }}
        >
          <Extension sx={{ fontSize: 48, mb: 1 }} />
          Use Extension
        </Button>
      </div>

      
    </div>
  );
}

export default Hero;
