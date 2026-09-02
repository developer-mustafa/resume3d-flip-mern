import Experience from '../models/Experience.js';
import { createCrudController } from './crudFactory.js';

const controller = createCrudController(Experience, 'Experience', {
  publicFilter: { status: 'published' },
  publicSort: { order: 1 },
  adminSort: { order: 1 },
});

export const { getAll, adminGetAll, getById, create, update, remove } = controller;
