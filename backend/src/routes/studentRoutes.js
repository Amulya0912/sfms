const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { authenticate } = require('../middlewares/auth');
const { authorize } = require('../middlewares/rbac');
const { validate } = require('../middlewares/validator');
const upload = require('../middlewares/upload');
const { createStudentValidation, updateStudentValidation, studentSelfUpdateValidation } = require('../validators/studentValidator');
const { ROLES } = require('../utils/constants');

router.use(authenticate);

// Student self-service routes
router.get('/me', authorize(ROLES.STUDENT), studentController.getMyProfile);
router.get('/me/fees', authorize(ROLES.STUDENT), studentController.getMyFees);
router.put('/me', authorize(ROLES.STUDENT), studentSelfUpdateValidation, validate, studentController.updateSelf);
router.post('/me/picture', authorize(ROLES.STUDENT), upload.single('picture'), studentController.uploadProfilePicture);

// Staff+ routes
router.use(authorize(ROLES.SUPER_ADMIN, ROLES.ACCOUNTANT, ROLES.STAFF));

router.get('/pending-dues', studentController.getPendingDues);

router.route('/')
  .get(studentController.getAll)
  .post(createStudentValidation, validate, studentController.create);

router.route('/:id')
  .get(studentController.getById)
  .put(updateStudentValidation, validate, studentController.update)
  .delete(studentController.delete);

router.post('/:id/picture', upload.single('picture'), studentController.uploadProfilePicture);

module.exports = router;
