// ----------------------------------------------------------
// >> METRICS << //
// ----------------------------------------------------------
// import BarChartExample from './ExampleBarChart';
// import InteractiveLineChartExample from './ExampleInteractiveLineChart';
// import InteractiveAreaChartExample from './ExampleInteractiveAreaChart';
// import LineChartExample from './ExampleLineChart';
// import RadialChartExample from './ExampleRadialChart';

import RecentUsage from './RecentUsage';
import CpuMemoryUtilization from './Utilization';
import Bytes from './Bytes';

const Metrics: React.FC = () => {
  return (
    <div>
      <RecentUsage />
      <CpuMemoryUtilization />
      <Bytes />
      {/* <BarChartExample />
      <InteractiveAreaChartExample />
      <RadialChartExample />
      <InteractiveLineChartExample />
      <LineChartExample /> */}
      {/* <h1>~~~~~~~~~~ Metrics TEST COMPONENTS END ~~~~~~~~~~</h1> */}
    </div>
  );
};

export default Metrics;
