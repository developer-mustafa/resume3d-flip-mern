import { AppError } from '../middleware/errorHandler.js';
import { logActivity } from '../utils/activityLogger.js';

/**
 * Generic CRUD controller factory.
 * Generates standard getAll, getById, create, update, delete handlers.
 */
export const createCrudController = (Model, resourceName, options = {}) => {
  const {
    publicFilter = { status: 'published' },
    publicSort = { order: 1 },
    adminSort = { createdAt: -1 },
    populateFields = '',
  } = options;

  return {
    // Public: Get all published
    getAll: async (req, res, next) => {
      try {
        let query = Model.find(publicFilter).sort(publicSort);
        if (populateFields) query = query.populate(populateFields);
        const items = await query;
        res.json(items);
      } catch (error) {
        next(error);
      }
    },

    // Admin: Get all (including drafts)
    adminGetAll: async (req, res, next) => {
      try {
        const { status, search, page = 1, limit = 50 } = req.query;
        const filter = {};
        if (status) filter.status = status;

        let query = Model.find(filter).sort(adminSort);
        if (populateFields) query = query.populate(populateFields);

        const total = await Model.countDocuments(filter);
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const items = await query.skip(skip).limit(parseInt(limit));

        res.json({
          items,
          pagination: {
            total,
            page: parseInt(page),
            limit: parseInt(limit),
            pages: Math.ceil(total / parseInt(limit)),
          },
        });
      } catch (error) {
        next(error);
      }
    },

    // Get by ID
    getById: async (req, res, next) => {
      try {
        const item = await Model.findById(req.params.id);
        if (!item) {
          throw new AppError(`${resourceName} not found`, 404);
        }
        res.json(item);
      } catch (error) {
        next(error);
      }
    },

    // Create
    create: async (req, res, next) => {
      try {
        const item = await Model.create(req.body);
        await logActivity(req, 'create', resourceName, item._id);
        res.status(201).json(item);
      } catch (error) {
        next(error);
      }
    },

    // Update
    update: async (req, res, next) => {
      try {
        const item = await Model.findByIdAndUpdate(
          req.params.id,
          req.body,
          { new: true, runValidators: true }
        );
        if (!item) {
          throw new AppError(`${resourceName} not found`, 404);
        }
        await logActivity(req, 'update', resourceName, item._id);
        res.json(item);
      } catch (error) {
        next(error);
      }
    },

    // Delete
    remove: async (req, res, next) => {
      try {
        const item = await Model.findByIdAndDelete(req.params.id);
        if (!item) {
          throw new AppError(`${resourceName} not found`, 404);
        }
        await logActivity(req, 'delete', resourceName, item._id);
        res.json({ message: `${resourceName} deleted` });
      } catch (error) {
        next(error);
      }
    },
  };
};
