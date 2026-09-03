import puppeteer from 'puppeteer-core';
import Profile from '../models/Profile.js';
import Skill from '../models/Skill.js';
import Experience from '../models/Experience.js';
import Project from '../models/Project.js';
import Education from '../models/Education.js';
import Certification from '../models/Certification.js';
import Service from '../models/Service.js';
import SocialLink from '../models/SocialLink.js';

// Category order for skills
const categoryOrder = ['Frontend', 'Backend', 'Database', 'Cloud', 'DevOps', 'AI', 'Tools'];

export const generateResumePDF = async (req, res) => {
  let browser;
  try {
    // Fetch all data from DB
    const [profile, skills, experience, projects, education, certifications, services, socialLinks] = await Promise.all([
      Profile.findOne().lean(),
      Skill.find({ status: 'published' }).sort({ order: 1 }).lean(),
      Experience.find({ status: 'published' }).sort({ order: 1 }).lean(),
      Project.find({ status: 'published' }).sort({ order: 1 }).lean(),
      Education.find({ status: 'published' }).sort({ order: 1 }).lean(),
      Certification.find({ status: 'published' }).sort({ order: 1 }).lean(),
      Service.find({ status: 'published' }).sort({ order: 1 }).lean(),
      SocialLink.find({ status: 'published' }).lean(),
    ]);

    const p = profile || {};

    // Group skills by category
    const grouped = {};
    (skills || []).forEach((skill) => {
      if (!grouped[skill.category]) grouped[skill.category] = [];
      grouped[skill.category].push(skill);
    });
    const sortedCategories = categoryOrder.filter((c) => grouped[c]?.length > 0);

    // Build professional HTML
    const html = buildResumeHTML({
      profile: p,
      grouped,
      sortedCategories,
      experience: experience || [],
      projects: projects || [],
      education: education || [],
      certifications: certifications || [],
      services: services || [],
      socialLinks: socialLinks || [],
    });

    // Launch Puppeteer and generate PDF
    browser = await puppeteer.launch({
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--font-render-hinting=none'],
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: true,
    });

    await browser.close();
    browser = null;

    const filename = `${(p.name || 'Resume').replace(/\s+/g, '_')}_Resume.pdf`;

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Content-Length': pdfBuffer.length,
    });

    res.send(pdfBuffer);
  } catch (error) {
    console.error('PDF generation error:', error);
    if (browser) await browser.close();
    res.status(500).json({ error: 'Failed to generate PDF', details: error.message });
  }
};

function buildResumeHTML({ profile, grouped, sortedCategories, experience, projects, education, certifications, services, socialLinks }) {
  const p = profile;

  // Contact items for the header
  const contactItems = [];
  if (p.location) contactItems.push({ icon: '📍', text: p.location });
  if (p.email) contactItems.push({ icon: '✉', text: p.email });
  if (p.phone) contactItems.push({ icon: '📞', text: p.phone });
  if (p.website) contactItems.push({ icon: '🌐', text: p.website });
  
  const linkedin = socialLinks.find(l => l.platform?.toLowerCase() === 'linkedin');
  if (linkedin) contactItems.push({ icon: '🔗', text: linkedin.url?.replace('https://', '') });
  const github = socialLinks.find(l => l.platform?.toLowerCase() === 'github');
  if (github) contactItems.push({ icon: '💻', text: github.url?.replace('https://', '') });

  // Skills HTML
  const skillsHTML = sortedCategories.length > 0 ? `
    <div class="section">
      <h2 class="section-title">Technical Skills</h2>
      <table class="skills-table">
        <tbody>
          ${sortedCategories.map(cat => `
            <tr>
              <td class="skill-label">${cat === 'AI' ? 'AI / ML' : cat}</td>
              <td class="skill-values">${grouped[cat].map(s => s.name).join(' • ')}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  ` : '';

  // Experience HTML
  const experienceHTML = experience.length > 0 ? `
    <div class="section">
      <h2 class="section-title">Professional Experience</h2>
      ${experience.map(exp => `
        <div class="exp-item">
          <div class="exp-header">
            <h3 class="exp-title">${exp.position}</h3>
            ${exp.duration ? `<span class="exp-duration">${exp.duration}</span>` : ''}
          </div>
          <div class="exp-meta">
            <span class="exp-company">${exp.company}</span>
            ${exp.location ? `<span class="exp-location">📍 ${exp.location}</span>` : ''}
          </div>
          ${exp.description ? `<p class="exp-desc">${exp.description}</p>` : ''}
          ${exp.responsibilities?.length > 0 ? `
            <div class="tags">
              ${exp.responsibilities.map(r => `<span class="tag">${r}</span>`).join('')}
            </div>
          ` : ''}
        </div>
      `).join('')}
    </div>
  ` : '';

  // Education HTML
  const educationHTML = education.length > 0 ? `
    <div class="section">
      <h2 class="section-title">Education</h2>
      ${education.map(edu => `
        <div class="edu-item">
          <div class="exp-header">
            <h3 class="edu-title">${edu.institution}</h3>
            ${edu.location ? `<span class="exp-location">📍 ${edu.location}</span>` : ''}
          </div>
          ${(edu.degree || edu.field) ? `<p class="edu-field">${edu.degree || ''}${edu.degree && edu.field ? ' in ' : ''}${edu.field || ''}</p>` : ''}
          ${edu.description ? `<p class="edu-desc">${edu.description}</p>` : ''}
        </div>
      `).join('')}
    </div>
  ` : '';

  // Projects HTML
  const projectsHTML = projects.length > 0 ? `
    <div class="section">
      <h2 class="section-title">Selected Projects</h2>
      ${projects.map(proj => `
        <div class="proj-item">
          <div class="proj-header">
            <h3 class="proj-title">${proj.title}</h3>
            ${proj.liveUrl ? `<span class="proj-link">${proj.liveUrl.replace('https://', '')}</span>` : ''}
          </div>
          ${proj.shortDescription ? `<p class="proj-desc">${proj.shortDescription}</p>` : ''}
          ${proj.technologies?.length > 0 ? `
            <div class="tags">
              ${proj.technologies.map(t => `<span class="tag-accent">${t}</span>`).join('')}
            </div>
          ` : ''}
          ${proj.features?.length > 0 ? `
            <ul class="feature-list">
              ${proj.features.slice(0, 3).map(f => `<li>${f}</li>`).join('')}
            </ul>
          ` : ''}
        </div>
      `).join('')}
    </div>
  ` : '';

  // Certifications HTML
  const certificationsHTML = certifications.length > 0 ? `
    <div class="section">
      <h2 class="section-title">Certifications</h2>
      <div class="cert-grid">
        ${certifications.map(cert => `
          <div class="cert-item">
            <h3 class="cert-title">${cert.name}</h3>
            ${cert.issuer ? `<span class="cert-issuer">Issued by: ${cert.issuer}</span>` : ''}
            ${cert.credentialId ? `<span class="cert-id">ID: ${cert.credentialId}</span>` : ''}
          </div>
        `).join('')}
      </div>
    </div>
  ` : '';

  // Services HTML
  const servicesHTML = services.length > 0 ? `
    <div class="section">
      <h2 class="section-title">Services</h2>
      <div class="svc-grid">
        ${services.map(svc => `
          <div class="svc-item">
            <h3 class="svc-title">${svc.title}</h3>
            ${svc.description ? `<p class="svc-desc">${svc.description}</p>` : ''}
          </div>
        `).join('')}
      </div>
    </div>
  ` : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=210mm, initial-scale=1.0">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    @page {
      size: A4;
      margin: 15mm 0mm; /* 15mm top and bottom margin for all pages */
    }
    
    @page :first {
      margin-top: 0mm; /* No top margin on the first page so header touches the edge */
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    html, body {
      width: 210mm;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      font-size: 10pt;
      line-height: 1.5;
      color: #1e293b;
      background: #ffffff;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    /* ═══════════ HEADER ═══════════ */
    .header {
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
      color: #f8fafc;
      padding: 28px 36px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 24px;
    }

    .header-left { flex: 1; }

    .name {
      font-size: 26pt;
      font-weight: 900;
      letter-spacing: -0.8px;
      line-height: 1.15;
      margin-bottom: 4px;
    }

    .title-badge {
      display: inline-block;
      font-size: 8.5pt;
      font-weight: 700;
      color: #fb923c;
      text-transform: uppercase;
      letter-spacing: 3px;
      margin-bottom: 12px;
      border-bottom: 2px solid #f97316;
      padding-bottom: 4px;
    }

    .summary {
      font-size: 8.5pt;
      color: #94a3b8;
      line-height: 1.7;
      max-width: 380px;
    }

    .contact-info {
      text-align: right;
      font-size: 8pt;
      color: #cbd5e1;
      line-height: 2.4;
      white-space: nowrap;
      flex-shrink: 0;
    }

    .contact-item {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 6px;
    }

    .contact-icon {
      font-size: 7pt;
      width: 14px;
      text-align: center;
    }

    /* ═══════════ BODY ═══════════ */
    .body { padding: 22px 36px 20px 36px; }

    .section { margin-bottom: 18px; }

    .section-title {
      font-size: 10pt;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 2.5px;
      color: #0f172a;
      border-bottom: 2.5px solid #0f172a;
      padding-bottom: 6px;
      margin-bottom: 12px;
      page-break-after: avoid;
      break-after: avoid;
    }

    /* ─── Skills Table ─── */
    .skills-table {
      width: 100%;
      border-collapse: collapse;
    }

    .skills-table td {
      padding: 4px 0;
      vertical-align: top;
      border-bottom: 1px solid #f1f5f9;
    }
    
    .skills-table tr {
      page-break-inside: avoid;
      break-inside: avoid;
    }

    .skill-label {
      font-size: 8pt;
      font-weight: 700;
      color: #334155;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      width: 90px;
      padding-right: 12px;
    }

    .skill-values {
      font-size: 8.5pt;
      color: #475569;
      line-height: 1.7;
    }

    /* ─── Experience ─── */
    .exp-item { 
      margin-bottom: 14px;
      page-break-inside: avoid;
      break-inside: avoid;
    }

    .exp-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
    }

    .exp-title {
      font-size: 10.5pt;
      font-weight: 700;
      color: #0f172a;
    }

    .exp-duration {
      font-size: 7.5pt;
      color: #64748b;
      font-weight: 500;
      white-space: nowrap;
    }

    .exp-meta {
      display: flex;
      align-items: center;
      gap: 12px;
      margin: 3px 0 6px 0;
    }

    .exp-company {
      font-size: 9pt;
      font-weight: 600;
      color: #334155;
    }

    .exp-location {
      font-size: 7.5pt;
      color: #94a3b8;
    }

    .exp-desc {
      font-size: 8.5pt;
      color: #475569;
      line-height: 1.6;
      margin: 4px 0;
    }

    /* ─── Tags ─── */
    .tags {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
      margin-top: 6px;
    }

    .tag {
      font-size: 7pt;
      padding: 2.5px 8px;
      background: #f8fafc;
      color: #475569;
      border: 1px solid #e2e8f0;
      border-radius: 4px;
      font-weight: 500;
    }

    .tag-accent {
      font-size: 6.5pt;
      padding: 2px 7px;
      background: #fff7ed;
      color: #c2410c;
      border: 1px solid #fed7aa;
      border-radius: 4px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    /* ─── Education ─── */
    .edu-item { 
      margin-bottom: 10px;
      page-break-inside: avoid;
      break-inside: avoid;
    }

    .edu-title {
      font-size: 10pt;
      font-weight: 700;
      color: #0f172a;
    }

    .edu-field {
      font-size: 8.5pt;
      color: #475569;
      font-style: italic;
      margin: 2px 0;
    }

    .edu-desc {
      font-size: 8pt;
      color: #64748b;
      line-height: 1.5;
      margin: 2px 0;
    }

    /* ─── Projects ─── */
    .proj-item { 
      margin-bottom: 12px;
      page-break-inside: avoid;
      break-inside: avoid;
    }

    .proj-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
    }

    .proj-title {
      font-size: 10pt;
      font-weight: 700;
      color: #0f172a;
    }

    .proj-link {
      font-size: 7pt;
      color: #f97316;
      font-weight: 500;
    }

    .proj-desc {
      font-size: 8pt;
      color: #64748b;
      margin: 2px 0 4px 0;
    }

    .feature-list {
      margin: 4px 0 0 16px;
      padding: 0;
    }

    .feature-list li {
      font-size: 8pt;
      color: #475569;
      line-height: 1.6;
    }

    /* ─── Certifications ─── */
    .cert-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px 20px;
    }

    .cert-item { 
      page-break-inside: avoid;
      break-inside: avoid;
    }

    .cert-title {
      font-size: 9pt;
      font-weight: 600;
      color: #0f172a;
    }

    .cert-issuer {
      display: block;
      font-size: 7.5pt;
      color: #64748b;
    }

    .cert-id {
      display: block;
      font-size: 7pt;
      color: #94a3b8;
    }

    /* ─── Services ─── */
    .svc-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px 20px;
    }

    .svc-item {
      page-break-inside: avoid;
      break-inside: avoid;
    }

    .svc-title {
      font-size: 9pt;
      font-weight: 600;
      color: #0f172a;
    }

    .svc-desc {
      font-size: 8pt;
      color: #64748b;
      margin: 2px 0;
    }

    /* ─── Footer ─── */
    .footer {
      border-top: 1.5px solid #e2e8f0;
      margin: 8px 36px 0 36px;
      padding: 10px 0;
      text-align: center;
    }

    .footer-text {
      font-size: 6.5pt;
      color: #94a3b8;
      letter-spacing: 2.5px;
      text-transform: uppercase;
      font-weight: 600;
    }
  </style>
</head>
<body>
  <!-- HEADER -->
  <div class="header">
    <div class="header-left">
      <h1 class="name">${p.name || 'Mustafa Rahman'}</h1>
      <div class="title-badge">${p.title || 'Full Stack Software Engineer'}</div>
      <p class="summary">${p.summary || 'Full Stack Software Engineer specializing in modern web applications, SaaS architecture, backend systems, databases, cloud platforms, and AI-powered products.'}</p>
    </div>
    <div class="contact-info">
      ${contactItems.map(ci => `
        <div class="contact-item">
          <span>${ci.text}</span>
          <span class="contact-icon">${ci.icon}</span>
        </div>
      `).join('')}
    </div>
  </div>

  <!-- BODY -->
  <div class="body">
    ${skillsHTML}
    ${experienceHTML}
    ${educationHTML}
    ${projectsHTML}
    ${certificationsHTML}
    ${servicesHTML}
  </div>

  <!-- FOOTER -->
  <div class="footer">
    <span class="footer-text">${p.resumeTagline || 'Design with purpose • Engineer for scale • Build for impact'}</span>
  </div>
</body>
</html>`;
}
