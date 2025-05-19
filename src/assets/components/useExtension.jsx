
import React from "react";
import Header from "./header";

function UseExtension({ai, setAi, selectedMode, setSelectedMode}){

  return(

    <div>
      <Header ai={ai} setAi={setAi} selectedMode={selectedMode} setSelectedMode={setSelectedMode} />
      <h1>USe Extension</h1>
      <p>Selected Mode: {selectedMode}</p>
    </div>

  )
}

export default UseExtension