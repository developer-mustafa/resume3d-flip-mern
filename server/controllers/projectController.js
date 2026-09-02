import Project from '../models/Project.js';
import { createCrudController } from './crudFactory.js';
import { logActivity } from '../utils/activityLogger.js';
import { AppError } from '../middleware/errorHandler.js';

const controller = createCrudController(Project, 'Project', {
  publicFilter: { status: 'published' },
  publicSort: { order: 1, createdAt: -1 },
  adminSort: { order: 1, createdAt: -1 },
});

export const { adminGetAll, getById, create, update, remove } = controller;

// Public: Get all published projects
export const getAll = async (req, res, next) => {
  try {
    const projects = await Project.find({ status: 'published' })
      .sort({ featured: -1, order: 1, createdAt: -1 });
    res.json(projects);
  } catch (error) {
    next(error);
  }
};

// Public: Get by slug
export const getBySlug = async (req, res, next) => {
  try {
    const project = await Project.findOne({
      slug: req.params.slug,
      status: 'published',
    });
    if (!project) {
      throw new AppError('Project not found', 404);
    }
    res.json(project);
  } catch (error) {
    next(error);
  }
};

// Admin: Duplicate project
export const duplicate = async (req, res, next) => {
  try {
    const original = await Project.findById(req.params.id);
    if (!original) {
      throw new AppError('Project not found', 404);
    }

    const data = original.toObject();
    delete data._id;
    delete data.createdAt;
    delete data.updatedAt;
    data.title = `${data.title} (Copy)`;
    data.slug = `${data.slug}-copy-${Date.now()}`;
    data.status = 'draft';

    const copy = await Project.create(data);
    await logActivity(req, 'create', 'Project', copy._id, { duplicatedFrom: original._id });

    res.status(201).json(copy);
  } catch (error) {
    next(error);
  }
};
