const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const { Admin, Application } = require('../models');
const env = require('../config/env');
const storageService = require('../services/storage.service');
const ApiError = require('../utils/ApiError');

async function login(req, res, next) {
  try {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username });

    if (!admin) throw new ApiError(401, 'Invalid credentials');

    const valid = await bcrypt.compare(password, admin.password);
    if (!valid) throw new ApiError(401, 'Invalid credentials');

    const token = jwt.sign(
      { id: admin._id, username: admin.username },
      env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token });
  } catch (err) {
    next(err);
  }
}

async function listApplications(req, res, next) {
  try {
    const filter = {};
    if (req.query.type) filter.type = req.query.type;
    if (req.query.status) filter.paymentStatus = req.query.status;
    if (req.query.provider) filter.paymentProvider = req.query.provider;

    const applications = await Application.find(filter).sort({ createdAt: -1 });
    res.json(applications);
  } catch (err) {
    next(err);
  }
}

async function downloadCv(req, res, next) {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) throw new ApiError(404, 'Application not found');

    const cvData = await storageService.getCvDownload(application.cvPath);
    if (!cvData) throw new ApiError(404, 'CV file not found');

    const ext = path.extname(application.cvPath);
    const safeName = application.fullName.replace(/\s+/g, '_');
    const filename = `CV-${safeName}${ext}`;

    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    if (cvData.contentType) res.setHeader('Content-Type', cvData.contentType);
    cvData.stream.pipe(res);
  } catch (err) {
    next(err);
  }
}

async function deleteApplication(req, res, next) {
  try {
    const application = await Application.findByIdAndDelete(req.params.id);
    if (!application) throw new ApiError(404, 'Application not found');
    res.json({ message: 'Deleted' });
  } catch (err) {
    next(err);
  }
}

module.exports = { login, listApplications, downloadCv, deleteApplication };
