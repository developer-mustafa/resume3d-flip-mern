import Service from '../models/Service.js';
import { createCrudController } from './crudFactory.js';

const controller = createCrudController(Service, 'Service', {
  publicFilter: { status: 'published' },
  publicSort: { order: 1 },
  adminSort: { order: 1 },
});

export const { getAll, adminGetAll, getById, create, update, remove } = controller;
