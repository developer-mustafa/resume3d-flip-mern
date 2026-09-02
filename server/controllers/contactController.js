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
        const htmlTemplate = `
            <div style="font-family: system-ui, sans-serif, Arial; font-size: 14px; color: #333; padding: 20px 14px; background-color: #f5f5f5;">
              <div style="max-width: 600px; margin: auto; background-color: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
                <div style="text-align: center; background-color: #1e293b; padding: 20px;">
                  <h2 style="color: #fff; margin: 0; font-size: 24px; font-weight: 700;">Resume3D CMS</h2>
                </div>
                <div style="padding: 30px 20px;">
                  <h1 style="font-size: 20px; margin-bottom: 20px; color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">New Contact Message</h1>
                  <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                    <tr>
                      <td style="padding: 8px 0; color: #64748b; width: 80px; font-weight: 600;">Name:</td>
                      <td style="padding: 8px 0; color: #0f172a; font-weight: 500;">${sanitized.name}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; color: #64748b; width: 80px; font-weight: 600;">Email:</td>
                      <td style="padding: 8px 0;"><a href="mailto:${sanitized.email}" style="color: #3b82f6; text-decoration: none;">${sanitized.email}</a></td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; color: #64748b; width: 80px; font-weight: 600;">Subject:</td>
                      <td style="padding: 8px 0; color: #0f172a; font-weight: 500;">${sanitized.subject || 'No Subject'}</td>
                    </tr>
                  </table>
                  <div style="background-color: #f8fafc; padding: 20px; border-radius: 6px; border: 1px solid #e2e8f0; color: #334155; line-height: 1.6;">
                    ${sanitized.message.replace(/\n/g, '<br/>')}
                  </div>
                </div>
              </div>
              <div style="max-width: 600px; margin: 20px auto; text-align: center;">
                <p style="color: #94a3b8; font-size: 12px;">This is an automated message from your Resume3D Platform.</p>
              </div>
            </div>
          `;

        await sendEmail({
          to: emailSettings.toEmail,
          subject: `New Contact Message: ${sanitized.subject || 'No Subject'}`,
          text: `You have received a new message from your portfolio.\n\nName: ${sanitized.name}\nEmail: ${sanitized.email}\nSubject: ${sanitized.subject}\n\nMessage:\n${sanitized.message}`,
          html: htmlTemplate
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
