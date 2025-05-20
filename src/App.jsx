// App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Hero from "./assets/components/hero";
import ImportCSV from "./assets/components/importCSV";
import UseExtension from "./assets/components/useExtension";
import ImportText from "./assets/components/importText";

function App() {
  const [ai, setAi] = useState("");
  const [selectedMode, setSelectedMode] = useState("");

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<Hero ai={ai} setAi={setAi} selectedMode={selectedMode} setSelectedMode={setSelectedMode} />}
        />
        <Route
          path="/importCSV"
          element={<ImportCSV ai={ai} setAi={setAi} selectedMode="importCSV" setSelectedMode={setSelectedMode}/>}
        />
        <Route
          path="/importText"
          element={<ImportText ai={ai} setAi={setAi} selectedMode="importText" setSelectedMode={setSelectedMode}/>}
        />
        <Route
          path="/useExtension"
          element={<UseExtension ai={ai} setAi={setAi} selectedMode="useExtension" setSelectedMode={setSelectedMode}/>}
        />
      </Routes>
    </Router>
  );
}

export default App;
