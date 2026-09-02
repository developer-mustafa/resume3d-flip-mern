import ContactMessage from '../models/ContactMessage.js';
import EmailSettings from '../models/EmailSettings.js';
import { sendEmail } from '../utils/sendEmail.js';
import { logActivity } from '../utils/activityLogger.js';
import { AppError } from '../middleware/errorHandler.js';
import xss from 'xss';

// Public: Submit contact form
export const submitMessage = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;
    const sanitized = {
      name: xss(name),
      email: xss(email),
      subject: xss(subject || ''),
      message: xss(message),
    };

    const msg = await ContactMessage.create(sanitized);

    // Send email alert if enabled
    try {
      const emailSettings = await EmailSettings.findOne();
      if (emailSettings && emailSettings.enableContactAlerts && emailSettings.toEmail) {
        await sendEmail({
          to: emailSettings.toEmail,
          subject: `New Contact Message: ${sanitized.subject || 'No Subject'}`,
          text: `You have received a new message from your portfolio.\n\nName: ${sanitized.name}\nEmail: ${sanitized.email}\nSubject: ${sanitized.subject}\n\nMessage:\n${sanitized.message}`,
          html: `
            <h2>New Contact Message</h2>
            <p><strong>Name:</strong> ${sanitized.name}</p>
            <p><strong>Email:</strong> ${sanitized.email}</p>
            <p><strong>Subject:</strong> ${sanitized.subject}</p>
            <hr />
            <p>${sanitized.message.replace(/\n/g, '<br/>')}</p>
          `
        });
      }
    } catch (emailError) {
      console.error('Failed to send contact alert email:', emailError);
    }

    res.status(201).json({ message: 'Message sent successfully' });
  } catch (error) {
    next(error);
  }
};

// Admin: Get all messages
export const getMessages = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const total = await ContactMessage.countDocuments(filter);
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const messages = await ContactMessage.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      items: messages,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit)),
      },
      counts: {
        unread: await ContactMessage.countDocuments({ status: 'unread' }),
        read: await ContactMessage.countDocuments({ status: 'read' }),
        archived: await ContactMessage.countDocuments({ status: 'archived' }),
      },
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Update message status
export const updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['unread', 'read', 'archived'].includes(status)) {
      throw new AppError('Invalid status', 400);
    }

    const msg = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!msg) {
      throw new AppError('Message not found', 404);
    }

    res.json(msg);
  } catch (error) {
    next(error);
  }
};

// Admin: Delete message
export const deleteMessage = async (req, res, next) => {
  try {
    const msg = await ContactMessage.findByIdAndDelete(req.params.id);
    if (!msg) {
      throw new AppError('Message not found', 404);
    }
    await logActivity(req, 'delete', 'ContactMessage', msg._id);
    res.json({ message: 'Message deleted' });
  } catch (error) {
    next(error);
  }
};
