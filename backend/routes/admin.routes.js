const express = require('express');
const router = express.Router();
const { getDashboardStats, getAllUsers, toggleUserStatus, updateUserRole, getFests, upsertFest } = require('../controllers/admin.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.use(protect, authorize('admin'));

router.get('/stats', getDashboardStats);
router.get('/users', getAllUsers);
router.put('/users/:id/toggle', toggleUserStatus);
router.put('/users/:id/role', updateUserRole);
router.get('/fests', getFests);
router.post('/fests', upsertFest);

module.exports = router;
