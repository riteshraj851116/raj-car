import { Router } from 'express';
import { getOwnerStats } from '../store.js';
import { authenticateToken, requireOwner } from '../middleware/auth.js';

const router = Router();

router.get('/stats', authenticateToken, requireOwner, async (req, res) => {
  try {
    const stats = await getOwnerStats(req.user.id);
    res.json(stats);
  } catch (error) {
    console.error('Owner stats error:', error);
    res.status(500).json({ message: 'Failed to fetch owner statistics' });
  }
});

export default router;
