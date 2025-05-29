// ----------------------------------------------------------
// >> APP COMPONENT << //
// ----------------------------------------------------------
import { Container, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';

// import TestComponent from './components/TestComponent';
import {CpuChart} from './components/GcpMetric';

const App = () => {
  // ----------------------------------------------------------
  // >> COMPONENT RENDERING << //
  // ----------------------------------------------------------
  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>
        GCP Metrics Dashboard
      </Typography>
      <Grid container spacing={2}>
        <Grid>
          <CpuChart />
        </Grid>
      </Grid>
    </Container>
  )
};

export default App;
