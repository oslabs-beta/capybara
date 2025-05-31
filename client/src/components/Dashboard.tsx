// ----------------------------------------------------------
// >> DASHBOARD << //
// ----------------------------------------------------------

import React from 'react';
import Sidebar from './Sidebar';
import MainContent from './MainContent';
import Metrics from './Metrics';

const Dashboard: React.FC = () => {
  return (
    <div className="flex h-screen flex-col">
      <header />
      <div>
        <Sidebar />
        <MainContent />
        <Metrics />
      </div>
    </div>
  );
};

export default Dashboard;
