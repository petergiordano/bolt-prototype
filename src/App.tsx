import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ProblemOriginStory } from './activities/workshop-1-problems_worth_solving/activity-1/ProblemOriginStory';
import { ProblemValidation } from './activities/workshop-1-problems_worth_solving/activity-2/ProblemValidation';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/workshop-1-problems_worth_solving/activity-2" replace />} />
        <Route path="/workshop-1-problems_worth_solving/activity-1" element={<ProblemOriginStory />} />
        <Route path="/workshop-1-problems_worth_solving/activity-2" element={<ProblemValidation />} />
      </Routes>
    </Router>
  );
}

export default App;