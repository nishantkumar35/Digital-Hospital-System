import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Doctors from './pages/Doctors';
import Patients from './pages/Patients';
import Medicines from './pages/Medicines';
import Receipts from './pages/Receipts';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div style={{ paddingBottom: '4rem' }}>
        <Routes>
          <Route path="/" element={<Navigate to="/doctors" replace />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/patients" element={<Patients />} />
          <Route path="/medicines" element={<Medicines />} />
          <Route path="/receipts" element={<Receipts />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
