// ----------------------------------------------------------
// >> METRICS << //
// ----------------------------------------------------------
import BarChartExample from './ExampleBarChart';
import InteractiveAreaChartExample from './ExampleInteractiveAreaChart';
import RadialChartExample from './ExampleRadialChart';

const Metrics: React.FC = () => {
  return (
    <div>
      <h1>~~~~~~~~~~ Metrics TEST COMPONENTS START ~~~~~~~~~~</h1>
      <BarChartExample />
      <InteractiveAreaChartExample />
      <RadialChartExample />
      <h1>~~~~~~~~~~ Metrics TEST COMPONENTS END ~~~~~~~~~~</h1>
    </div>
  );
};

export default Metrics;
