import { Router } from 'express';
const router = Router();
import {
  getAllJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
  showStats,
} from '../controllers/jobController.js';
import {
  validateJobInput,
  validateIdParam,
} from '../middleware/validationMiddleware.js';
import { checkForTestUser } from '../middleware/authMiddleware.js';

// router.get('/',getAllJobs)
// router.post('/',createJob)

router
  .route('/')
  .get(getAllJobs)
  .post(checkForTestUser, validateJobInput, createJob);

router.route('/stats').get(showStats);

router
  .route('/:id')
  .get(validateIdParam, getJob)
  .patch(checkForTestUser, validateJobInput, validateIdParam, updateJob)
  .delete(checkForTestUser, validateIdParam, deleteJob);

export default router;
// import { Router } from 'express';
// import { validateJobInput } from '../middleware/validationMiddleware.js';
// const jobRouter = Router();

// import {
//   getAllJobs,
//   getJob,
//   createJob,
//   updateJob,
//   deleteJob,
// } from '../controllers/jobController.js';

// // router.get('/', getAllJobs);
// // router.post('/', createJob);

// jobRouter.route('/').get(getAllJobs).post(validateJobInput, createJob);
// jobRouter
//   .route('/:id')
//   .get(getJob)
//   .patch(validateJobInput, updateJob)
//   .delete(deleteJob);


// export default jobRouter;