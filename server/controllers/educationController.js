import Education from '../models/Education.js';
import { createCrudController } from './crudFactory.js';

const controller = createCrudController(Education, 'Education', {
  publicFilter: { status: 'published' },
  publicSort: { startDate: -1 },
  adminSort: { createdAt: -1 },
});

export const { getAll, adminGetAll, getById, create, update, remove } = controller;
