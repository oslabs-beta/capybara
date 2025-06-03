// ----------------------------------------------------------
// >> DASHBOARD << //
// ----------------------------------------------------------

import React from 'react';
import Sidebar from './Sidebar';
import MainContent from './MainContent';
import Metrics from './Metrics';
import NavigationBar from './NavigationBar';

const Dashboard: React.FC = () => {
  return (
    <div className="flex h-screen flex-col">
      <header />
      <div>
        <NavigationBar />
        <Sidebar />
        <MainContent />
        <Metrics />
      </div>
    </div>
  );
};

export default Dashboard;
