// ----------------------------------------------------------
// >> METRICS << //
// ----------------------------------------------------------
import BarChartExample from './ExampleBarChart';

import InteractiveLineChartExample from './ExampleInteractiveLineChart';
import InteractiveAreaChartExample from './ExampleInteractiveAreaChart';
import LineChartExample from './ExampleLineChart';
import CpuMemoryUtilization from './CpuRequestUtilization';
import RecentUsage from './RecentUsage';
// import EventLog from './EventLog';
import RadialChartExample from './ExampleRadialChart';

const Metrics: React.FC = () => {
  return (
    <div>
      <h1>~~~~~~~~~~ Metrics TEST COMPONENTS START ~~~~~~~~~~</h1>
      <RecentUsage />
      <CpuMemoryUtilization />
      {/* <EventLog /> */}
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
