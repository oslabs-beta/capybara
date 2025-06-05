// ----------------------------------------------------------
// >> HISTORICAL DATA << //
// ----------------------------------------------------------
import CpuMemoryUtilization from './Utilization';
import Bytes from './Bytes';
import { CardTitle } from '@/components/ui/card';

const HistoricalData: React.FC = () => {
  return (
    <div className="mx-10 mt-2 flex flex-col gap-4">
      <CardTitle className="from-primary to-secondary bg-gradient-to-r bg-clip-text text-2xl font-bold text-transparent">
        Performance Analytics
      </CardTitle>

      <CpuMemoryUtilization />
      <Bytes />
    </div>
  );
};

export default HistoricalData;
