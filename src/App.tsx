import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ProblemOriginStory } from './activities/day1/activity1/ProblemOriginStory';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/day1/activity1" replace />} />
        <Route path="/day1/activity1" element={<ProblemOriginStory />} />
      </Routes>
    </Router>
  );
}

export default App;