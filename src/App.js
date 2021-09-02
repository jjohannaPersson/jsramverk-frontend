import React, { useState } from "react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './App.css';

function App() {
  const [value, setValue] = useState('');

  return (
      <div>
        <header>
            <h1>JSramverk</h1>
        </header>
        <button onClick={() => console.log(value)}>Spara</button>
        <ReactQuill theme="snow" value={value} onChange={setValue}/>
    </div>
  );
}

export default App;
