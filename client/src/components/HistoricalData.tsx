// ----------------------------------------------------------
// >> HISTORICAL DATA << //
// ----------------------------------------------------------

import CpuMemoryUtilization from './Utilization';
import Bytes from './Bytes';

const HistoricalData: React.FC = () => {
  return (
    <div className="flex flex-col">
      <CpuMemoryUtilization />
      <Bytes />
    </div>
  );
};

export default HistoricalData;
