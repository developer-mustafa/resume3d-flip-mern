import React from 'react';
import useBookStore from '../../stores/bookStore';

const categoryOrder = ['Frontend', 'Backend', 'Database', 'Cloud', 'DevOps', 'AI', 'Tools'];

// All inline styles for perfect PDF rendering (no Tailwind needed)
const styles = {
  page: {
    width: '210mm',
    minHeight: '297mm',
    margin: '0 auto',
    background: '#ffffff',
    color: '#1e293b',
    fontFamily: "'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif",
    fontSize: '9.5pt',
    lineHeight: '1.5',
    padding: 0,
    boxSizing: 'border-box',
  },
  header: {
    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
    color: '#f8fafc',
    padding: '24px 32px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '20px',
  },
  name: { fontSize: '22pt', fontWeight: 800, margin: 0, letterSpacing: '-0.5px', lineHeight: 1.2 },
  title: { fontSize: '9pt', fontWeight: 700, color: '#f97316', textTransform: 'uppercase', letterSpacing: '2.5px', margin: '6px 0 8px 0' },
  summary: { fontSize: '8.5pt', color: '#94a3b8', margin: 0, maxWidth: '380px', lineHeight: '1.6' },
  contactInfo: { textAlign: 'right', fontSize: '8pt', color: '#cbd5e1', lineHeight: '2.2', whiteSpace: 'nowrap' },
  body: { padding: '20px 32px 16px 32px' },
  sectionTitle: {
    fontSize: '10.5pt', fontWeight: 800, color: '#0f172a', margin: 0,
    textTransform: 'uppercase', letterSpacing: '2px',
    paddingBottom: '5px', borderBottom: '2px solid #0f172a', marginBottom: '10px',
    pageBreakAfter: 'avoid', breakAfter: 'avoid',
  },
  sectionWrap: { marginBottom: '16px' },
  blockItem: { pageBreakInside: 'avoid', breakInside: 'avoid', marginBottom: '12px' },
  // Skills
  skillRow: { display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '4px', pageBreakInside: 'avoid', breakInside: 'avoid' },
  skillLabel: { fontSize: '7.5pt', fontWeight: 700, color: '#475569', minWidth: '70px', textTransform: 'uppercase', letterSpacing: '0.5px', paddingTop: '2px' },
  skillValues: { fontSize: '8.5pt', color: '#334155', lineHeight: '1.7', flex: 1 },
  // Experience
  expTitle: { fontSize: '10pt', fontWeight: 700, color: '#0f172a', margin: 0 },
  expMeta: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px', marginTop: '2px' },
  expCompany: { fontSize: '9pt', fontWeight: 600, color: '#334155' },
  expLocation: { fontSize: '7.5pt', color: '#94a3b8' },
  expDuration: { fontSize: '7.5pt', color: '#64748b', fontWeight: 500 },
  tag: { fontSize: '7pt', padding: '2px 7px', background: '#f1f5f9', color: '#475569', borderRadius: '3px', border: '1px solid #e2e8f0', fontWeight: 500, display: 'inline-block' },
  tagOrange: { fontSize: '6.5pt', padding: '1.5px 6px', background: '#fff7ed', color: '#9a3412', borderRadius: '3px', border: '1px solid #fed7aa', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'inline-block' },
  // Projects
  projTitle: { fontSize: '9.5pt', fontWeight: 700, color: '#0f172a', margin: 0 },
  projDesc: { fontSize: '8pt', color: '#64748b', margin: '2px 0 4px 0' },
  projFeature: { fontSize: '8pt', color: '#475569', lineHeight: '1.6', margin: 0, paddingLeft: '4px' },
  // Education
  eduTitle: { fontSize: '9.5pt', fontWeight: 700, color: '#0f172a', margin: 0 },
  eduField: { fontSize: '8.5pt', color: '#475569', margin: '2px 0' },
  // Certifications
  certTitle: { fontSize: '9pt', fontWeight: 600, color: '#0f172a', margin: 0 },
  certIssuer: { fontSize: '8pt', color: '#64748b' },
  // Services
  svcTitle: { fontSize: '9pt', fontWeight: 600, color: '#0f172a', margin: 0 },
  svcDesc: { fontSize: '8pt', color: '#64748b', margin: '2px 0' },
  // Footer
  footer: { borderTop: '1px solid #e2e8f0', margin: '0 32px', padding: '10px 0', textAlign: 'center' },
  footerText: { fontSize: '6.5pt', color: '#94a3b8', letterSpacing: '2px', textTransform: 'uppercase', fontWeight: 600 },
};

export default function PrintableResume() {
  const { profile, skills, experience, projects, education, certifications, services, socialLinks } = useBookStore();
  const p = profile || {};

  // Group skills by category
  const grouped = {};
  (skills || []).forEach((skill) => {
    if (!grouped[skill.category]) grouped[skill.category] = [];
    grouped[skill.category].push(skill);
  });
  const sortedCategories = categoryOrder.filter((c) => grouped[c]?.length > 0);

  const filteredEducation = (education || []).filter(e => e.status !== 'draft');
  const filteredCertifications = (certifications || []).filter(c => c.status !== 'draft');
  const filteredServices = (services || []).filter(s => s.status !== 'draft');

  return (
    <div id="printable-resume" style={styles.page}>
      {/* ═══════════════════ HEADER ═══════════════════ */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.name}>{p.name || 'Mustafa Rahman'}</h1>
          <p style={styles.title}>{p.title || 'Full Stack Software Engineer'}</p>
          <p style={styles.summary}>
            {p.summary || 'Full Stack Software Engineer specializing in modern web applications, SaaS architecture, backend systems, databases, cloud platforms, and AI-powered products.'}
          </p>
        </div>
        <div style={styles.contactInfo}>
          {p.location && <div>📍 {p.location}</div>}
          {p.email && <div>✉ {p.email}</div>}
          {p.website && <div>🌐 {p.website}</div>}
          {p.phone && <div>📞 {p.phone}</div>}
          {socialLinks?.filter(l => l.platform?.toLowerCase() === 'linkedin').map(l => (
            <div key={l._id}>🔗 {l.url?.replace('https://', '')}</div>
          ))}
          {socialLinks?.filter(l => l.platform?.toLowerCase() === 'github').map(l => (
            <div key={l._id}>💻 {l.url?.replace('https://', '')}</div>
          ))}
        </div>
      </div>

      {/* ═══════════════════ BODY ═══════════════════ */}
      <div style={styles.body}>

        {/* ─── TECHNICAL SKILLS ───────────────────── */}
        {sortedCategories.length > 0 && (
          <div style={styles.sectionWrap}>
            <h2 style={styles.sectionTitle}>Technical Skills</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 16px' }}>
              {sortedCategories.map((category) => (
                <div key={category} style={styles.skillRow}>
                  <span style={styles.skillLabel}>
                    {category === 'AI' ? 'AI / ML' : category}:
                  </span>
                  <span style={styles.skillValues}>
                    {grouped[category].map((s) => s.name).join(', ')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── PROFESSIONAL EXPERIENCE ────────────── */}
        {(experience || []).length > 0 && (
          <div style={styles.sectionWrap}>
            <h2 style={styles.sectionTitle}>Professional Experience</h2>
            {experience.map((exp) => (
              <div key={exp._id} style={styles.blockItem}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <h3 style={styles.expTitle}>{exp.position}</h3>
                  {exp.duration && <span style={styles.expDuration}>{exp.duration}</span>}
                </div>
                <div style={styles.expMeta}>
                  <span style={styles.expCompany}>{exp.company}</span>
                  {exp.location && <span style={styles.expLocation}>📍 {exp.location}</span>}
                </div>
                {exp.description && (
                  <p style={{ fontSize: '8.5pt', color: '#475569', margin: '3px 0', lineHeight: '1.6' }}>{exp.description}</p>
                )}
                {exp.responsibilities?.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px', marginTop: '5px' }}>
                    {exp.responsibilities.map((r, i) => (
                      <span key={i} style={styles.tag}>{r}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ─── EDUCATION ─────────────────────────── */}
        {filteredEducation.length > 0 && (
          <div style={styles.sectionWrap}>
            <h2 style={styles.sectionTitle}>Education</h2>
            {filteredEducation.map((edu) => (
              <div key={edu._id} style={{ ...styles.blockItem, marginBottom: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <h3 style={styles.eduTitle}>{edu.institution}</h3>
                  {edu.location && <span style={styles.expLocation}>📍 {edu.location}</span>}
                </div>
                {(edu.degree || edu.field) && (
                  <p style={styles.eduField}>
                    {edu.degree}{edu.degree && edu.field ? ' in ' : ''}{edu.field}
                  </p>
                )}
                {edu.description && (
                  <p style={{ fontSize: '8pt', color: '#64748b', margin: '2px 0', lineHeight: '1.5' }}>{edu.description}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ─── SELECTED PROJECTS ──────────────────── */}
        {(projects || []).length > 0 && (
          <div style={styles.sectionWrap}>
            <h2 style={styles.sectionTitle}>Selected Projects</h2>
            {projects.map((project) => (
              <div key={project._id} style={{ ...styles.blockItem, marginBottom: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <h3 style={styles.projTitle}>{project.title}</h3>
                  <div style={{ display: 'flex', gap: '8px', fontSize: '7pt', flexShrink: 0 }}>
                    {project.liveUrl && <span style={{ color: '#f97316' }}>{project.liveUrl.replace('https://', '')}</span>}
                  </div>
                </div>
                {project.shortDescription && <p style={styles.projDesc}>{project.shortDescription}</p>}
                {project.technologies?.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px', marginTop: '3px' }}>
                    {project.technologies.map((tech) => (
                      <span key={tech} style={styles.tagOrange}>{tech}</span>
                    ))}
                  </div>
                )}
                {project.features?.length > 0 && (
                  <ul style={{ margin: '4px 0 0 14px', padding: 0, listStyle: 'disc' }}>
                    {project.features.slice(0, 3).map((f, i) => (
                      <li key={i} style={styles.projFeature}>{f}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ─── CERTIFICATIONS ────────────────────── */}
        {filteredCertifications.length > 0 && (
          <div style={styles.sectionWrap}>
            <h2 style={styles.sectionTitle}>Certifications</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 16px' }}>
              {filteredCertifications.map((cert) => (
                <div key={cert._id} style={{ display: 'flex', flexDirection: 'column', pageBreakInside: 'avoid', breakInside: 'avoid' }}>
                  <h3 style={styles.certTitle}>{cert.name}</h3>
                  {cert.issuer && <span style={styles.certIssuer}>Issued by: {cert.issuer}</span>}
                  {cert.credentialId && <span style={{ fontSize: '7pt', color: '#94a3b8' }}>ID: {cert.credentialId}</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── SERVICES ─────────────────────────── */}
        {filteredServices.length > 0 && (
          <div style={styles.sectionWrap}>
            <h2 style={styles.sectionTitle}>Services</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 16px' }}>
              {filteredServices.map((svc) => (
                <div key={svc._id} style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
                  <h3 style={styles.svcTitle}>{svc.title}</h3>
                  {svc.description && <p style={styles.svcDesc}>{svc.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ═══════════════════ FOOTER ═══════════════════ */}
      <div style={styles.footer}>
        <span style={styles.footerText}>
          {p.resumeTagline || 'Design with purpose • Engineer for scale • Build for impact'}
        </span>
      </div>
    </div>
  );
}
