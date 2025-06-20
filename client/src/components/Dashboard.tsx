// ----------------------------------------------------------
// >> DASHBOARD << //
// ----------------------------------------------------------

import React from 'react';
import EnhancedMetrics from './EnhancedMetrics';

const Dashboard: React.FC = () => {
  return (
    <div className="mx-8 flex max-w-full flex-col">
      {/* Remove height constraints and let it flow naturally in the scroll container */}
      <div>
        <EnhancedMetrics />
      </div>
    </div>
  );
};

export default Dashboard;
