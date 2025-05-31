// ----------------------------------------------------------
// >> APP COMPONENT << //
// ----------------------------------------------------------
<<<<<<< HEAD
import { useEffect } from 'react';
import TestComponent from './components/TestComponent';
import Metrics from './components/Metrics';
=======
import { Container } from '@mui/material';
import { Box } from '@mui/system';
import Grid from '@mui/material/Grid';

// import TestComponent from './components/TestComponent';
import {CpuChart} from './components/GcpMetric';
>>>>>>> dev

const App = () => {
  // ** Saved Theme To Local Storage
  //  !! To be completed //
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);
  //  !! To be completed //

  // ----------------------------------------------------------
  // >> COMPONENT RENDERING << //
  // ----------------------------------------------------------
  return (
<<<<<<< HEAD
    <>
      <TestComponent />
      <Metrics />
    </>
=======
    <Container maxWidth="md" sx={{ mt: 10, mb: 0 }}>
    <Grid container justifyContent="center" spacing={2}>
      <Grid size={{ xs: 5, sm: 0, md: 0 }}>
        <Box
          sx={{
            bgcolor: 'background.paper',
            boxShadow: 1,
            borderRadius: 2,
            p: 3,
            minWidth: 600,
          }}
        >
          <CpuChart />
        </Box>
      </Grid>
    </Grid>
  </Container>
  
>>>>>>> dev
  );
};

export default App;
