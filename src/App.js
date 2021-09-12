import React, { useState } from "react";
import ReactQuill from 'react-quill';
import {
    HashRouter as Router,
    Switch,
    Route,
} from "react-router-dom";
import 'react-quill/dist/quill.snow.css';
import './App.css';
import GetAll from './getAll.js';
import Update from './update.js';
// import Options from './options.js';

function App() {
  const [value, setValue] = useState('');

  return (
      <div>
        <header>
            <h1>JSramverk</h1>
        </header>
        <Router>
            <Switch>
                <Route exact path="/">
                    <GetAll />
                </Route>
                <Route exact path="/update/:id">
                    <Update />
                </Route>
                <Route exact path="/create">
                    <Update />
                </Route>
            </Switch>
        </Router>
    </div>
  );
}

export default App;
