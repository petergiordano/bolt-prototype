import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ProblemOriginStory } from './activities/day1/activity1/ProblemOriginStory';
import { ProblemValidation } from './activities/day1/activity2/ProblemValidation';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/day1/activity2" replace />} />
        <Route path="/day1/activity1" element={<ProblemOriginStory />} />
        <Route path="/day1/activity2" element={<ProblemValidation />} />
      </Routes>
    </Router>
  );
}

export default App;