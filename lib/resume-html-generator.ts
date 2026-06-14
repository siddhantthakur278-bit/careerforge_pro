// lib/resume-html-generator.ts
// Generates standalone print-ready HTML for Puppeteer PDF rendering

import { ResumeData } from './resume-schema';

export function generateResumeHTML(resume: ResumeData): string {
  const { contact, summary, experience, education, skills, projects, certifications, template } = resume;

  const baseColors = {
    modern: { primary: '#4f46e5', accent: '#10b981', text: '#1e293b', muted: '#64748b' },
    executive: { primary: '#1e3a5f', accent: '#c9a84c', text: '#1a1a1a', muted: '#555555' },
    minimal: { primary: '#111827', accent: '#6b7280', text: '#111827', muted: '#6b7280' },
  }[template || 'modern'];

  const colors = resume.customColors
    ? { ...baseColors, primary: resume.customColors.primary, accent: resume.customColors.accent }
    : baseColors;

  const formatDate = (d: string) => {
    if (!d) return '';
    if (d === 'Present') return 'Present';
    try {
      return new Date(d + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    } catch {
      return d;
    }
  };

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${contact.fullName} - Resume</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif;
      font-size: ${resume.fontSize || '10pt'};
      line-height: 1.5;
      color: ${colors.text};
      background: white;
    }
    @page { size: A4; margin: 0.4in 0.5in; }
    .page { max-width: 100%; }

    /* Header */
    .header {
      border-bottom: 2px solid ${colors.primary};
      padding-bottom: 10px;
      margin-bottom: 14px;
    }
    .name {
      font-size: 22pt;
      font-weight: 700;
      color: ${colors.primary};
      letter-spacing: -0.5px;
    }
    .contact-info {
      display: flex;
      flex-wrap: wrap;
      gap: 4px 16px;
      margin-top: 6px;
      font-size: 8.5pt;
      color: ${colors.muted};
    }
    .contact-info span::before { content: ""; }

    /* Sections */
    .section { margin-bottom: 14px; }
    .section-title {
      font-size: 9pt;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      color: ${colors.primary};
      border-bottom: 1px solid ${colors.primary}22;
      padding-bottom: 3px;
      margin-bottom: 8px;
    }

    /* Summary */
    .summary-text { font-size: 9.5pt; color: ${colors.text}; }

    /* Experience */
    .exp-item { margin-bottom: 10px; }
    .exp-header { display: flex; justify-content: space-between; align-items: baseline; }
    .exp-title { font-weight: 600; font-size: 10pt; }
    .exp-company { font-weight: 500; color: ${colors.accent}; font-size: 9.5pt; }
    .exp-date { font-size: 8.5pt; color: ${colors.muted}; white-space: nowrap; }
    .exp-location { font-size: 8.5pt; color: ${colors.muted}; }
    .bullets { margin-top: 4px; padding-left: 14px; }
    .bullets li {
      font-size: 9.5pt;
      margin-bottom: 2px;
      color: ${colors.text};
    }

    /* Education */
    .edu-item { margin-bottom: 8px; }
    .edu-header { display: flex; justify-content: space-between; align-items: baseline; }
    .edu-school { font-weight: 600; font-size: 10pt; }
    .edu-degree { font-size: 9.5pt; color: ${colors.muted}; }
    .edu-date { font-size: 8.5pt; color: ${colors.muted}; }

    /* Skills */
    .skills-grid { display: flex; flex-direction: column; gap: 4px; }
    .skill-row { display: flex; gap: 8px; font-size: 9.5pt; }
    .skill-category { font-weight: 600; min-width: 100px; color: ${colors.text}; }
    .skill-list { color: ${colors.muted}; flex: 1; }

    /* Projects */
    .project-item { margin-bottom: 8px; }
    .project-name { font-weight: 600; font-size: 10pt; }
    .project-tech { font-size: 8.5pt; color: ${colors.accent}; }

    /* Certifications */
    .cert-item { display: flex; justify-content: space-between; margin-bottom: 4px; }
    .cert-name { font-size: 9.5pt; font-weight: 500; }
    .cert-issuer { font-size: 8.5pt; color: ${colors.muted}; }

    /* Page break control */
    .exp-item, .edu-item, .project-item { page-break-inside: avoid; }
  </style>
</head>
<body>
<div class="page">
  <!-- Header -->
  <div class="header">
    <div class="name">${contact.fullName || 'Your Name'}</div>
    <div class="contact-info">
      ${contact.email ? `<span>${contact.email}</span>` : ''}
      ${contact.phone ? `<span>${contact.phone}</span>` : ''}
      ${contact.location ? `<span>${contact.location}</span>` : ''}
      ${contact.linkedIn ? `<span>${contact.linkedIn}</span>` : ''}
      ${contact.website ? `<span>${contact.website}</span>` : ''}
      ${contact.github ? `<span>${contact.github}</span>` : ''}
    </div>
  </div>

  <!-- Summary -->
  ${summary ? `
  <div class="section">
    <div class="section-title">Professional Summary</div>
    <p class="summary-text">${summary}</p>
  </div>` : ''}

  <!-- Experience -->
  ${experience.length > 0 ? `
  <div class="section">
    <div class="section-title">Work Experience</div>
    ${experience.map(exp => `
    <div class="exp-item">
      <div class="exp-header">
        <div>
          <span class="exp-title">${exp.position}</span>
          ${exp.company ? ` — <span class="exp-company">${exp.company}</span>` : ''}
          ${exp.location ? `<span class="exp-location"> · ${exp.location}</span>` : ''}
        </div>
        <div class="exp-date">${formatDate(exp.startDate)} – ${exp.current ? 'Present' : formatDate(exp.endDate)}</div>
      </div>
      ${exp.bullets.filter(b => b.text).length > 0 ? `
      <ul class="bullets">
        ${exp.bullets.filter(b => b.text).map(b => `<li>${b.text}</li>`).join('')}
      </ul>` : ''}
    </div>`).join('')}
  </div>` : ''}

  <!-- Education -->
  ${education.length > 0 ? `
  <div class="section">
    <div class="section-title">Education</div>
    ${education.map(edu => `
    <div class="edu-item">
      <div class="edu-header">
        <div>
          <div class="edu-school">${edu.institution}</div>
          <div class="edu-degree">${edu.degree}${edu.field ? ` in ${edu.field}` : ''}${edu.gpa ? ` · GPA: ${edu.gpa}` : ''}</div>
        </div>
        <div class="edu-date">${formatDate(edu.startDate)} – ${formatDate(edu.endDate)}</div>
      </div>
    </div>`).join('')}
  </div>` : ''}

  <!-- Skills -->
  ${skills.length > 0 ? `
  <div class="section">
    <div class="section-title">Skills</div>
    <div class="skills-grid">
      ${skills.filter(g => g.skills.length > 0).map(g => `
      <div class="skill-row">
        <span class="skill-category">${g.category}:</span>
        <span class="skill-list">${g.skills.map(s => s.name).join(', ')}</span>
      </div>`).join('')}
    </div>
  </div>` : ''}

  <!-- Projects -->
  ${projects.length > 0 ? `
  <div class="section">
    <div class="section-title">Projects</div>
    ${projects.map(proj => `
    <div class="project-item">
      <div class="exp-header">
        <div>
          <span class="project-name">${proj.name}</span>
          ${proj.technologies.length > 0 ? `<span class="project-tech"> · ${proj.technologies.join(', ')}</span>` : ''}
        </div>
        ${(proj.github || proj.url) ? `
        <div style="font-size: 8.5pt; display: flex; gap: 8px;">
          ${proj.github ? `<a href="${proj.github.startsWith('http') ? proj.github : `https://${proj.github}`}" target="_blank" style="color: ${colors.primary}; text-decoration: none; font-weight: 500;">GitHub</a>` : ''}
          ${proj.github && proj.url ? `<span style="color: ${colors.muted};">|</span>` : ''}
          ${proj.url ? `<a href="${proj.url.startsWith('http') ? proj.url : `https://${proj.url}`}" target="_blank" style="color: ${colors.primary}; text-decoration: none; font-weight: 500;">Demo</a>` : ''}
        </div>` : ''}
      </div>
      ${proj.bullets.filter(b => b.text).length > 0 ? `
      <ul class="bullets">
        ${proj.bullets.filter(b => b.text).map(b => `<li>${b.text}</li>`).join('')}
      </ul>` : ''}
    </div>`).join('')}
  </div>` : ''}

  <!-- Certifications -->
  ${certifications.length > 0 ? `
  <div class="section">
    <div class="section-title">Certifications</div>
    ${certifications.map(cert => `
    <div class="cert-item">
      <div>
        <span class="cert-name">${cert.name}</span>
        ${cert.issuer ? ` · <span class="cert-issuer">${cert.issuer}</span>` : ''}
      </div>
      <div class="cert-issuer">${cert.date}</div>
    </div>`).join('')}
  </div>` : ''}
</div>
</body>
</html>`;
}
