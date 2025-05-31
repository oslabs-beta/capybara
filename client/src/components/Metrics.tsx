// ----------------------------------------------------------
// >> METRICS << //
// ----------------------------------------------------------
import BarChartExample from './ExampleBarChart';
import InteractiveAreaChartExample from './ExampleInteractiveAreaChart';
import InteractiveLineChartExample from './ExampleInteractiveLineChart';
import LineChartExample from './ExampleLineChart';
import RadialChartExample from './ExampleRadialChart';

const Metrics: React.FC = () => {
  return (
    <div>
      <h1>~~~~~~~~~~ Metrics TEST COMPONENTS START ~~~~~~~~~~</h1>
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
