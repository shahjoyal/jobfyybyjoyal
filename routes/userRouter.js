import { Router } from 'express';
import {
  getApplicationStats,
  getCurrentUser,
  updateUser,
} from '../controllers/userController.js';
import { validateUpdateUserInput } from '../middleware/validationMiddleware.js';
import {
  authorizePermissions,
  checkForTestUser,
} from '../middleware/authMiddleware.js';
import upload from '../middleware/multerMiddleware.js';
const router = Router();

router.get('/current-user', getCurrentUser);
router.get('/admin/app-stats', [
  authorizePermissions('admin'),
  getApplicationStats,
]);
router.patch(
  '/update-user',
  checkForTestUser,
  upload.single('avatar'),
  validateUpdateUserInput,
  updateUser
);

export default router;
// import { Router } from 'express';
// const router = Router();
// import { authorizePermissions } from '../middleware/authMiddleware.js';
// import {
//   getCurrentUser,
//   getApplicationStats,
//   updateUser,
// } from '../controllers/userController.js';
// import { validateUpdateUserInput } from '../middleware/validationMiddleware.js';

// router.get('/current-user', getCurrentUser);
// router.get('/admin/app-stats', [
//   authorizePermissions('admin'),
//   getApplicationStats,
// ]);
// router.patch('/update-user',validateUpdateUserInput, updateUser);
// export default router;