// ----------------------------------------------------------
// >> DASHBOARD << //
// ----------------------------------------------------------

import React from 'react';
import Metrics from './Metrics';
import NavigationBar from './NavigationBar';

const Dashboard: React.FC = () => {
  return (
    <div className="flex h-screen flex-col">
      <header />
      <div className="flex-1 overflow-y-auto pb-24">
        <NavigationBar />
        <Metrics />
      </div>
    </div>
  );
};

export default Dashboard;
