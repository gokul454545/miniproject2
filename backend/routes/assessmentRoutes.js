const express = require('express');
const router = express.Router();
const {
    submitAssessment,
    getHistory,
    getLatestAssessment
} = require('../controllers/assessmentController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, submitAssessment);
router.get('/', protect, getHistory);
router.get('/latest', protect, getLatestAssessment);

module.exports = router;
