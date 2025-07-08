// src/components/TabButtons.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const TabButtons = () => {
  const navigate = useNavigate();

  return (
    <div>
      <button className="tab" onClick={() => navigate('/child-report')}>Basic Information</button>
      <button className="tab" onClick={() => navigate('/child-medical-info')}>Emergency Details</button>
      <button className="tab" onClick={() => navigate('/child-development-info')}>Medical Information</button>
      <button className="tab" onClick={() => navigate('/child-details')}>Developmental Information</button>
      <button className="tab" onClick={() => navigate('/child-daily-routine')}>Daily Routine</button>
      <button className="tab" onClick={() => navigate('/child-additional-info')}>Additional Information</button>
    </div>
  );
};

export default TabButtons;
