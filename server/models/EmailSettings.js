import mongoose from 'mongoose';

const emailSettingsSchema = new mongoose.Schema({
  provider: {
    type: String,
    enum: ['none', 'resend', 'sendgrid', 'emailjs'],
    default: 'none',
  },
  fromEmail: {
    type: String,
    trim: true,
    default: 'noreply@resumebook.dev',
  },
  toEmail: {
    type: String,
    trim: true,
    default: 'admin@resumebook.dev',
  },
  enableContactAlerts: {
    type: Boolean,
    default: false,
  },
  enablePasswordReset: {
    type: Boolean,
    default: false,
  },
  // Resend
  resendApiKey: {
    type: String,
    trim: true,
  },
  // SendGrid
  sendgridApiKey: {
    type: String,
    trim: true,
  },
  // EmailJS
  emailjsServiceId: {
    type: String,
    trim: true,
  },
  emailjsTemplateId: {
    type: String,
    trim: true,
  },
  emailjsPublicKey: {
    type: String,
    trim: true,
  },
  emailjsPrivateKey: {
    type: String, // Useful if calling EmailJS REST API from backend
    trim: true,
  }
}, {
  timestamps: true,
});

export default mongoose.model('EmailSettings', emailSettingsSchema);
