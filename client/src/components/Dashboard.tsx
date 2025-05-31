// >> DASBOARD << //

import React from 'react';

const Dashboard: React.FC = () => {
  return (
    <div className="flex h-screen flex-col">
      <header />
      <div className="flex flex-1">
        <Sidebar />
        <MainContent />
      </div>
    </div>
  );
};

export default Dashboard;
