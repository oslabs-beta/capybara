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
  const { metricType, duration } = req.query;

  try {
    const timeSeries = await fetchGCPMetric({
      metricType: String(metricType),
      duration: duration ? Number(duration) : 5,
    });

    res.json(timeSeries);
  } catch (error) {
    console.error('Failed to fetch metric:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
// ie.
// router.use("/auth", authRoutes);
// router.use("/users", userRoutes);

// ------------------------------------------------------------------------------------------------
// * MODULE EXPORT
// ------------------------------------------------------------------------------------------------
export default router;
