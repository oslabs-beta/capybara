// ------------------------------------------------------------------------------------------------
// > ROUTES INDEX < //
// ------------------------------------------------------------------------------------------------
import express from 'express';
import fetchGCPMetric from '../utils/metricService';

// ie.
// import authRoutes from "./authRoutes";
// import userRoutes from "./userRoutes";

// const router = express.Router();
const router = express.Router();

// ------------------------------------------------------------------------------------------------
// * ATTACH EACH SUB-ROUTER UNDER ITS OWN PATH
// ------------------------------------------------------------------------------------------------
router.get('/metrics', async (req, res) => {
  const { metricType, duration, clusterName, clusterLocation } = req.query;

  try {
    const timeSeries = await fetchGCPMetric({
      metricType: String(metricType),
      duration: duration ? Number(duration) : 5,
      clusterName: clusterName ? String(clusterName) : undefined,
      clusterLocation: clusterLocation ? String(clusterLocation) : undefined,
    });

    res.json(timeSeries);
  } catch (error) {
    console.error('Failed to fetch metric:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ------------------------------------------------------------------------------------------------
// * MODULE EXPORT
// ------------------------------------------------------------------------------------------------
export default router;
