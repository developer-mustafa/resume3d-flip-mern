import Certification from '../models/Certification.js';
import { createCrudController } from './crudFactory.js';

const controller = createCrudController(Certification, 'Certification', {
  publicFilter: { status: 'published' },
  publicSort: { issueDate: -1 },
  adminSort: { createdAt: -1 },
});

export const { getAll, adminGetAll, getById, create, update, remove } = controller;
