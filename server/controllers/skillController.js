import Skill from '../models/Skill.js';
import { createCrudController } from './crudFactory.js';

const controller = createCrudController(Skill, 'Skill', {
  publicFilter: { status: 'published' },
  publicSort: { category: 1, order: 1 },
  adminSort: { category: 1, order: 1 },
});

export const { getAll, adminGetAll, getById, create, update, remove } = controller;
