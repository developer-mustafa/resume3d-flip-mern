import EmailSettings from '../models/EmailSettings.js';
import axios from 'axios';

/**
 * Sends an email using the provider configured in EmailSettings.
 * @param {Object} options - { to, subject, text, html }
 */
export const sendEmail = async (options) => {
  const settings = await EmailSettings.findOne();
  if (!settings || settings.provider === 'none') {
    console.log('Email provider not configured or disabled. Skipping email send.');
    return;
  }

  const { provider, fromEmail, resendApiKey, sendgridApiKey, emailjsServiceId, emailjsTemplateId, emailjsPublicKey, emailjsPrivateKey } = settings;

  try {
    if (provider === 'resend') {
      if (!resendApiKey) throw new Error('Resend API key missing');
      
      const payload = {
        from: fromEmail || 'onboarding@resend.dev',
        to: Array.isArray(options.to) ? options.to : [options.to],
        subject: options.subject,
        text: options.text,
        html: options.html,
      };

      const res = await axios.post('https://api.resend.com/emails', payload, {
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json'
        }
      });
      return res.data;

    } else if (provider === 'sendgrid') {
      if (!sendgridApiKey) throw new Error('SendGrid API key missing');
      
      const payload = {
        personalizations: [{ to: [{ email: options.to }] }],
        from: { email: fromEmail },
        subject: options.subject,
        content: [
          ...(options.text ? [{ type: 'text/plain', value: options.text }] : []),
          ...(options.html ? [{ type: 'text/html', value: options.html }] : [])
        ]
      };

      const res = await axios.post('https://api.sendgrid.com/v3/mail/send', payload, {
        headers: {
          'Authorization': `Bearer ${sendgridApiKey}`,
          'Content-Type': 'application/json'
        }
      });
      return res.data;

    } else if (provider === 'emailjs') {
      if (!emailjsServiceId || !emailjsTemplateId || !emailjsPublicKey) {
        throw new Error('EmailJS credentials missing');
      }

      const payload = {
        service_id: emailjsServiceId,
        template_id: emailjsTemplateId,
        user_id: emailjsPublicKey,
        accessToken: emailjsPrivateKey || undefined,
        template_params: {
          to_email: options.to,
          subject: options.subject,
          message: options.text || options.html,
        }
      };

      const res = await axios.post('https://api.emailjs.com/api/v1.0/email/send', payload, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return res.data;
    }
  } catch (error) {
    console.error(`Error sending email via ${provider}:`, error?.response?.data || error.message);
    throw new Error('Email could not be sent');
  }
};
