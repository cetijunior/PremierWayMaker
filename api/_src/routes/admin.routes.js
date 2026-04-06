const { Router } = require('express');
const auth = require('../middleware/auth');
const adminController = require('../controllers/admin.controller');

const router = Router();

router.post('/login', adminController.login);
router.get('/applications', auth, adminController.listApplications);
router.get('/applications/:id/cv', auth, adminController.downloadCv);
router.delete('/applications/:id', auth, adminController.deleteApplication);

module.exports = router;
