// ----------------------------------------------------------
// >> DASHBOARD << //
// ----------------------------------------------------------

import React from 'react';
import Metrics from './Metrics';

const Dashboard: React.FC = () => {
  return (
    <div className="flex flex-col">
      <Metrics />
    </div>
  );
};

export default Dashboard;
