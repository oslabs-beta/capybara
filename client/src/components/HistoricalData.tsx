// ----------------------------------------------------------
// >> HISTORICAL DATA << //
// ----------------------------------------------------------
import CpuMemoryUtilization from './Utilization';
import Bytes from './Bytes';
import { CardTitle } from '@/components/ui/card';

const HistoricalData: React.FC = () => {
  return (
    <div className="mx-8 flex max-w-full flex-col space-y-2">
      {/* <CardTitle className="from-primary to-secondary bg-gradient-to-r bg-clip-text text-xl font-bold text-transparent">
        Performance Analytics
      </CardTitle> */}
      <CardTitle className="from-primary to-secondary bg-gradient-to-r bg-clip-text text-lg font-bold text-transparent md:text-2xl">
        <span className="hidden md:inline">Performance Analytics</span>
        <span className="inline md:hidden">24hr Performance Analytics</span>
      </CardTitle>
      <CpuMemoryUtilization />
      <Bytes />
    </div>
  );
};

export default HistoricalData;
