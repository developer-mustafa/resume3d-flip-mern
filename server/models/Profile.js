import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'Mustafa Rahman',
    trim: true,
    maxlength: 100,
  },
  title: {
    type: String,
    default: 'Full Stack Software Engineer',
    trim: true,
    maxlength: 200,
  },
  subtitle: {
    type: String,
    default: 'Software Engineer • Web Developer • Educator',
    trim: true,
    maxlength: 300,
  },
  location: {
    type: String,
    default: 'Austin, Texas, USA',
    trim: true,
  },
  bio: {
    type: String,
    default: 'Full Stack Software Engineer focused on building scalable, secure, high-performance web applications and SaaS products.',
    maxlength: 2000,
  },
  headline: {
    type: String,
    default: 'BUILD • SCALE • AUTOMATE',
    trim: true,
    maxlength: 200,
  },
  profileImage: {
    type: String,
    default: '',
  },
  availability: {
    type: String,
    default: 'Available for opportunities',
    trim: true,
  },
  summary: {
    type: String,
    default: 'Full Stack Software Engineer specializing in modern web applications, SaaS architecture, backend systems, databases, cloud platforms, and AI-powered products.',
    maxlength: 5000,
  },
  email: {
    type: String,
    default: '',
    trim: true,
  },
  phone: {
    type: String,
    default: '',
    trim: true,
  },
  website: {
    type: String,
    default: '',
    trim: true,
  },
  resumeTagline: {
    type: String,
    default: 'DESIGN WITH PURPOSE. ENGINEER FOR SCALE. BUILD FOR IMPACT.',
    trim: true,
  },
  techBadges: {
    type: [String],
    default: [
      'TypeScript', 'React', 'Next.js', 'Node.js', 'PostgreSQL',
      'Prisma', 'MongoDB', 'Firebase', 'Supabase', 'AI Integration'
    ],
  },
}, {
  timestamps: true,
});

export default mongoose.model('Profile', profileSchema);
