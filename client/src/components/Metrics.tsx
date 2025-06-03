// ----------------------------------------------------------
// >> METRICS << //
// ----------------------------------------------------------
import BarChartExample from './ExampleBarChart';

import InteractiveLineChartExample from './ExampleInteractiveLineChart';
import InteractiveAreaChartExample from './ExampleInteractiveAreaChart';
import LineChartExample from './ExampleLineChart';
import CpuMemoryUtilization from './Utilization';
import RecentUsage from './RecentUsage';
import RadialChartExample from './ExampleRadialChart';
import Bytes from './Bytes';

const Metrics: React.FC = () => {
  return (
    <div>
      <h1>~~~~~~~~~~ Metrics TEST COMPONENTS START ~~~~~~~~~~</h1>
      <RecentUsage />
      <CpuMemoryUtilization />
      <Bytes />
      <BarChartExample />
      <InteractiveAreaChartExample />
      <RadialChartExample />
      <InteractiveLineChartExample />
      <LineChartExample />
      <h1>~~~~~~~~~~ Metrics TEST COMPONENTS END ~~~~~~~~~~</h1>
    </div>
  );
};

export default Metrics;
