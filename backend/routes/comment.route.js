import express from 'express';

import { commentCreate, commentRead, commentDelete } from '../controllers/comment.controller.js';
import auth from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/create', auth, commentCreate);
router.get('/comments', commentRead);
router.delete('/delete/:id',auth, commentDelete);

export default router;