const express = require('express');
const router = express.Router();
const { getUsers, getUser, toggleUserStatus, updateRole, deleteUser, getAnalytics } = require('../controllers/userController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', protect, adminOnly, getUsers);
router.get('/admin/analytics', protect, adminOnly, getAnalytics);
router.get('/:id', getUser);
router.put('/:id/toggle-status', protect, adminOnly, toggleUserStatus);
router.put('/:id/role', protect, adminOnly, updateRole);
router.delete('/:id', protect, adminOnly, deleteUser);

module.exports = router;
