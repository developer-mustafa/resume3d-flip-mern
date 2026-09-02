import 'dotenv/config';
import dns from 'dns';
if (process.env.NODE_ENV !== 'production') {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
}
import mongoose from 'mongoose';
import Admin from '../models/Admin.js';
import Profile from '../models/Profile.js';
import Skill from '../models/Skill.js';
import Experience from '../models/Experience.js';
import Project from '../models/Project.js';
import Service from '../models/Service.js';
import SiteSettings from '../models/SiteSettings.js';
import SEOSettings from '../models/SEOSettings.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/resume-book';

const skills = [
  // Frontend
  { name: 'HTML5', category: 'Frontend', order: 0 },
  { name: 'CSS3', category: 'Frontend', order: 1 },
  { name: 'JavaScript', category: 'Frontend', order: 2 },
  { name: 'TypeScript', category: 'Frontend', order: 3 },
  { name: 'React', category: 'Frontend', order: 4 },
  { name: 'Next.js', category: 'Frontend', order: 5 },
  { name: 'Tailwind CSS', category: 'Frontend', order: 6 },
  { name: 'Responsive UI', category: 'Frontend', order: 7 },
  { name: 'Accessibility', category: 'Frontend', order: 8 },
  { name: 'Framer Motion', category: 'Frontend', order: 9 },
  // Backend
  { name: 'Node.js', category: 'Backend', order: 0 },
  { name: 'Express.js', category: 'Backend', order: 1 },
  { name: 'REST APIs', category: 'Backend', order: 2 },
  { name: 'Authentication', category: 'Backend', order: 3 },
  { name: 'Authorization', category: 'Backend', order: 4 },
  { name: 'API Architecture', category: 'Backend', order: 5 },
  { name: 'Validation', category: 'Backend', order: 6 },
  { name: 'Error Handling', category: 'Backend', order: 7 },
  // Database
  { name: 'MongoDB', category: 'Database', order: 0 },
  { name: 'PostgreSQL', category: 'Database', order: 1 },
  { name: 'Supabase', category: 'Database', order: 2 },
  { name: 'Firebase Firestore', category: 'Database', order: 3 },
  { name: 'Prisma', category: 'Database', order: 4 },
  { name: 'Mongoose', category: 'Database', order: 5 },
  { name: 'Database Design', category: 'Database', order: 6 },
  { name: 'Query Optimization', category: 'Database', order: 7 },
  // DevOps
  { name: 'Git', category: 'DevOps', order: 0 },
  { name: 'GitHub', category: 'DevOps', order: 1 },
  { name: 'CI/CD', category: 'DevOps', order: 2 },
  { name: 'Vercel', category: 'Cloud', order: 0 },
  { name: 'Netlify', category: 'Cloud', order: 1 },
  { name: 'Cloudflare', category: 'Cloud', order: 2 },
  { name: 'Docker', category: 'DevOps', order: 3 },
  { name: 'Environment Configuration', category: 'DevOps', order: 4 },
  // AI
  { name: 'AI API Integration', category: 'AI', order: 0 },
  { name: 'AI Gateway', category: 'AI', order: 1 },
  { name: 'Provider Routing', category: 'AI', order: 2 },
  { name: 'Gemini', category: 'AI', order: 3 },
  { name: 'OpenAI', category: 'AI', order: 4 },
  { name: 'Groq', category: 'AI', order: 5 },
  { name: 'OpenRouter', category: 'AI', order: 6 },
  { name: 'RAG', category: 'AI', order: 7 },
  { name: 'Streaming AI', category: 'AI', order: 8 },
  { name: 'Usage Metering', category: 'AI', order: 9 },
  { name: 'Quota Management', category: 'AI', order: 10 },
];

const experiences = [
  {
    company: 'SolarWinds',
    position: 'Software Engineer',
    location: 'Texas, USA',
    description: '',
    responsibilities: [
      'Production software engineering',
      'Scalable web applications',
      'Backend services',
      'Frontend architecture',
      'API development',
      'Database systems',
      'Debugging',
      'Performance',
      'Reliability',
      'Maintainable code',
    ],
    technologies: [],
    order: 0,
  },
  {
    company: 'MMMC | MIFM',
    position: 'Lecturer of ICT',
    location: '',
    description: '',
    responsibilities: [
      'Programming education',
      'Web development',
      'ICT curriculum',
      'Technical training',
      'Mentoring',
      'Project-based learning',
    ],
    technologies: [],
    order: 1,
  },
];

const projects = [
  {
    title: 'EdTech Automata Pro',
    slug: 'edtech-automata-pro',
    shortDescription: 'Education Institution Automation SaaS',
    technologies: ['Next.js', 'React', 'TypeScript', 'Firebase', 'AI', 'Cloud Architecture'],
    features: [
      'Student management',
      'Attendance',
      'Academic performance',
      'Marksheet',
      'Reporting',
      'Automation',
      'Multi-device support',
    ],
    status: 'published',
    featured: true,
    order: 0,
  },
  {
    title: 'Admission Tracker Pro',
    slug: 'admission-tracker-pro',
    shortDescription: 'Admission tracking and analytics platform',
    technologies: ['React', 'Firebase', 'Firestore', 'CSV', 'PDF', 'Analytics'],
    features: [
      'CRUD',
      'Analytics dashboard',
      'CSV import/export',
      'JSON backup',
      'PDF export',
      'Payment integration architecture',
    ],
    status: 'published',
    order: 1,
  },
  {
    title: 'AI SaaS Platform',
    slug: 'ai-saas-platform',
    shortDescription: 'Multi-provider AI gateway and management platform',
    technologies: ['Next.js', 'TypeScript', 'Prisma', 'PostgreSQL', 'Supabase', 'Gemini', 'Groq', 'OpenAI', 'OpenRouter'],
    features: [
      'AI Gateway',
      'Provider Routing',
      'Quota Management',
      'Usage Ledger',
      'Cost Tracking',
      'Fallback System',
    ],
    status: 'published',
    order: 2,
  },
  {
    title: 'Professional Portfolio Platform',
    slug: 'professional-portfolio-platform',
    shortDescription: 'Personal portfolio and resume platform',
    technologies: ['Next.js', 'React', 'TypeScript', 'PostgreSQL', 'Prisma', 'Tailwind CSS', 'Framer Motion'],
    features: [],
    status: 'published',
    order: 3,
  },
  {
    title: 'Learning Management System',
    slug: 'learning-management-system',
    shortDescription: 'Comprehensive LMS platform',
    technologies: [],
    features: [
      'Course management',
      'Student management',
      'Video learning',
      'Digital resources',
      'Progress tracking',
      'Assessment',
    ],
    status: 'published',
    order: 4,
  },
  {
    title: 'Digital Book / Publishing Platform',
    slug: 'digital-book-publishing-platform',
    shortDescription: 'Digital book publishing and delivery platform',
    technologies: [],
    features: [
      'Book publishing',
      'Digital books',
      'PDF delivery',
      'Author management',
      'Sales',
      'Content management',
    ],
    status: 'published',
    order: 5,
  },
];

const services = [
  { title: 'Full Stack Development', description: '', icon: 'code', order: 0 },
  { title: 'SaaS Development', description: '', icon: 'cloud', order: 1 },
  { title: 'Web Application Development', description: '', icon: 'globe', order: 2 },
  { title: 'API Development', description: '', icon: 'server', order: 3 },
  { title: 'Database Architecture', description: '', icon: 'database', order: 4 },
  { title: 'AI Integration', description: '', icon: 'cpu', order: 5 },
  { title: 'Technical Training', description: '', icon: 'book-open', order: 6 },
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI, { family: 4 });
    console.log('Connected to MongoDB');

    // Create superadmin if doesn't exist
    const adminExists = await Admin.findOne({ email: 'admin@resumebook.dev' });
    if (!adminExists) {
      await Admin.create({
        name: 'Mustafa Rahman',
        email: 'admin@resumebook.dev',
        password: 'Admin@123456',
        role: 'superadmin',
      });
      console.log('✅ Superadmin created (admin@resumebook.dev / Admin@123456)');
      console.log('⚠️  CHANGE THIS PASSWORD IN PRODUCTION');
    } else {
      console.log('ℹ️  Admin already exists, skipping');
    }

    // Profile
    const profileExists = await Profile.findOne();
    if (!profileExists) {
      await Profile.create({});
      console.log('✅ Default profile created');
    }

    // Skills
    const skillCount = await Skill.countDocuments();
    if (skillCount === 0) {
      await Skill.insertMany(skills);
      console.log(`✅ ${skills.length} skills seeded`);
    }

    // Experience
    const expCount = await Experience.countDocuments();
    if (expCount === 0) {
      await Experience.insertMany(experiences);
      console.log(`✅ ${experiences.length} experiences seeded`);
    }

    // Projects
    const projCount = await Project.countDocuments();
    if (projCount === 0) {
      await Project.insertMany(projects);
      console.log(`✅ ${projects.length} projects seeded`);
    }

    // Services
    const svcCount = await Service.countDocuments();
    if (svcCount === 0) {
      await Service.insertMany(services);
      console.log(`✅ ${services.length} services seeded`);
    }

    // Settings
    const settingsExist = await SiteSettings.findOne();
    if (!settingsExist) {
      await SiteSettings.create({});
      console.log('✅ Default site settings created');
    }

    // SEO
    const seoExists = await SEOSettings.findOne();
    if (!seoExists) {
      await SEOSettings.create({});
      console.log('✅ Default SEO settings created');
    }

    console.log('\n🎉 Seed complete!\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
}

seed();
