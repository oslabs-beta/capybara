// ----------------------------------------------------------
// >> DASHBOARD << //
// ----------------------------------------------------------

import React from 'react';
import EnhancedMetrics from './EnhancedMetrics';

const Dashboard: React.FC = () => {
  return (
    <div className="mx-10 mt-2 flex max-w-full flex-col">
      {/* Remove height constraints and let it flow naturally in the scroll container */}
      <div className="space-y-3">
        <EnhancedMetrics />
      </div>
    </div>
  );
};

export default Dashboard;
