import * as React from 'react';
import { HomePage } from './view/homepage';
import { ResultPage } from './view/resultpage';
import { ProcessPage } from './view/processpage';
import { Routes, Route, BrowserRouter } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/result" element={<ResultPage />} />
            <Route path="/process" element={<ProcessPage />} />
          </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
