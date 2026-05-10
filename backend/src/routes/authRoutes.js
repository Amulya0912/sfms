const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validate } = require('../middlewares/validator');
const { loginValidation, refreshValidation } = require('../validators/authValidator');
const { authenticate } = require('../middlewares/auth');

router.post('/login', loginValidation, validate, authController.login);
router.post('/refresh', refreshValidation, validate, authController.refreshToken);
router.post('/logout', authenticate, authController.logout);
router.get('/me', authenticate, authController.getMe);

module.exports = router;
