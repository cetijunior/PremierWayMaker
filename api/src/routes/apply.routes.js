const { Router } = require('express');
const upload = require('../middleware/upload');
const { validateApplyBody } = require('../middleware/validate');
const applyController = require('../controllers/apply.controller');

const router = Router();

router.post('/', upload.single('cv'), validateApplyBody, applyController.submitApplication);
router.get('/status/:sessionId', applyController.getApplicationStatus);

module.exports = router;
