import express from 'express';

const router = express.Router();

import { postCreate, postRead, postDelete } from '../controllers/post.controller.js';
import auth from '../middlewares/auth.middleware.js';

router.post('/create',auth, postCreate);
router.get('/posts', postRead);
router.delete('/delete/:id',auth, postDelete);

export default router;