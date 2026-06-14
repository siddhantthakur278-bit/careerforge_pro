'use client';

import { ResumeData } from '@/lib/resume-schema';

interface ResumePreviewProps {
  resume: ResumeData;
}

const THEME_COLORS = {
  modern: {
    primary: '#6366f1',
    accent: '#10b981',
    text: '#1e293b',
    muted: '#64748b',
    border: '#e2e8f0',
    headerBg: 'from-indigo-600 to-purple-700',
  },
  executive: {
    primary: '#1e3a5f',
    accent: '#c9a84c',
    text: '#1a1a1a',
    muted: '#555',
    border: '#d4c5a0',
    headerBg: 'from-slate-800 to-slate-900',
  },
  minimal: {
    primary: '#111827',
    accent: '#6b7280',
    text: '#111827',
    muted: '#6b7280',
    border: '#e5e7eb',
    headerBg: 'from-gray-900 to-black',
  },
};

const formatDate = (d: string) => {
  if (!d) return '';
  if (d === 'Present') return 'Present';
  try {
    return new Date(d + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  } catch {
    return d;
  }
};

export default function ResumePreview({ resume }: ResumePreviewProps) {
  const { contact, summary, experience, education, skills, projects, certifications, template, customColors } = resume;
  const baseTheme = THEME_COLORS[template || 'modern'];
  const theme = customColors
    ? { ...baseTheme, primary: customColors.primary, accent: customColors.accent }
    : baseTheme;

  return (
    <div
      className="bg-white text-gray-900 shadow-2xl"
      style={{
        width: '210mm',
        minHeight: '297mm',
        fontFamily: "'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif",
        fontSize: resume.fontSize || '10pt',
        lineHeight: '1.5',
        color: theme.text,
        transform: 'scale(0.75)',
        transformOrigin: 'top center',
        marginBottom: '-74mm',
      }}
    >
      {/* Header */}
      <div
        style={{
          background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent === '#10b981' ? '#8b5cf6' : theme.accent})`,
          padding: '32px 40px 24px',
          color: 'white',
        }}
      >
        <h1 style={{ fontSize: '24pt', fontWeight: 700, letterSpacing: '-0.5px', marginBottom: '8px' }}>
          {contact.fullName || 'Your Name'}
        </h1>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 20px', fontSize: '9pt', opacity: 0.9 }}>
          {contact.email && <span>✉ {contact.email}</span>}
          {contact.phone && <span>📞 {contact.phone}</span>}
          {contact.location && <span>📍 {contact.location}</span>}
          {contact.linkedIn && <span>in {contact.linkedIn}</span>}
          {contact.website && <span>🔗 {contact.website}</span>}
          {contact.github && <span>⌥ {contact.github}</span>}
        </div>
      </div>

      <div style={{ padding: '24px 40px' }}>
        {/* Summary */}
        {summary && (
          <Section title="Professional Summary" theme={theme}>
            <p style={{ fontSize: '9.5pt', color: theme.text, lineHeight: '1.6' }}>{summary}</p>
          </Section>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <Section title="Work Experience" theme={theme}>
            {experience.map((exp) => (
              <div key={exp.id} style={{ marginBottom: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '10.5pt', color: theme.primary }}>
                      {exp.position || 'Position'}
                    </div>
                    <div style={{ fontSize: '9.5pt', color: theme.accent, fontWeight: 500 }}>
                      {exp.company}{exp.location ? ` · ${exp.location}` : ''}
                    </div>
                  </div>
                  <div style={{ fontSize: '8.5pt', color: theme.muted, whiteSpace: 'nowrap', marginLeft: '10px' }}>
                    {formatDate(exp.startDate)} – {exp.current ? 'Present' : formatDate(exp.endDate)}
                  </div>
                </div>
                {exp.bullets.filter(b => b.text).length > 0 && (
                  <ul style={{ marginTop: '6px', paddingLeft: '16px' }}>
                    {exp.bullets.filter(b => b.text).map((b) => (
                      <li
                        key={b.id}
                        style={{
                          fontSize: '9.5pt',
                          marginBottom: '3px',
                          color: theme.text,
                          ...(b.isRewritten ? { color: '#4f46e5', fontStyle: 'italic' } : {}),
                        }}
                      >
                        {b.text}
                        {b.isRewritten && (
                          <span style={{ fontSize: '7pt', color: '#10b981', marginLeft: '4px' }}>✨ AI</span>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </Section>
        )}

        {/* Education */}
        {education.length > 0 && (
          <Section title="Education" theme={theme}>
            {education.map((edu) => (
              <div key={edu.id} style={{ marginBottom: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '10pt' }}>{edu.institution}</div>
                    <div style={{ fontSize: '9.5pt', color: theme.muted }}>
                      {edu.degree}{edu.field ? ` in ${edu.field}` : ''}
                      {edu.gpa ? ` · GPA: ${edu.gpa}` : ''}
                    </div>
                  </div>
                  <div style={{ fontSize: '8.5pt', color: theme.muted, whiteSpace: 'nowrap' }}>
                    {formatDate(edu.startDate)} – {formatDate(edu.endDate)}
                  </div>
                </div>
              </div>
            ))}
          </Section>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <Section title="Skills" theme={theme}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              {skills.filter(g => g.skills.length > 0).map((g) => (
                <div key={g.id} style={{ display: 'flex', gap: '8px', fontSize: '9.5pt' }}>
                  <span style={{ fontWeight: 600, minWidth: '110px', color: theme.text }}>{g.category}:</span>
                  <span style={{ color: theme.muted }}>{g.skills.map(s => s.name).join(', ')}</span>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <Section title="Projects" theme={theme}>
            {projects.map((proj) => (
              <div key={proj.id} style={{ marginBottom: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <div>
                    <span style={{ fontWeight: 600, fontSize: '10pt', color: theme.primary }}>{proj.name}</span>
                    {proj.technologies.length > 0 && (
                      <span style={{ fontSize: '8.5pt', color: theme.accent, marginLeft: '8px' }}>
                        {proj.technologies.join(', ')}
                      </span>
                    )}
                  </div>
                  {(proj.github || proj.url) && (
                    <div style={{ fontSize: '8.5pt', display: 'flex', gap: '8px' }}>
                      {proj.github && (
                        <a
                          href={proj.github.startsWith('http') ? proj.github : `https://${proj.github}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: theme.primary, textDecoration: 'none', fontWeight: 500 }}
                        >
                          GitHub
                        </a>
                      )}
                      {proj.github && proj.url && <span style={{ color: theme.muted }}>|</span>}
                      {proj.url && (
                        <a
                          href={proj.url.startsWith('http') ? proj.url : `https://${proj.url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: theme.primary, textDecoration: 'none', fontWeight: 500 }}
                        >
                          Demo
                        </a>
                      )}
                    </div>
                  )}
                </div>
                {proj.bullets.filter(b => b.text).length > 0 && (
                  <ul style={{ marginTop: '4px', paddingLeft: '16px' }}>
                    {proj.bullets.filter(b => b.text).map((b) => (
                      <li key={b.id} style={{ fontSize: '9.5pt', marginBottom: '2px', color: theme.text }}>
                        {b.text}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </Section>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <Section title="Certifications" theme={theme}>
            {certifications.map((cert) => (
              <div key={cert.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <div>
                  <span style={{ fontWeight: 500, fontSize: '9.5pt' }}>{cert.name}</span>
                  {cert.issuer && (
                    <span style={{ fontSize: '8.5pt', color: theme.muted }}> · {cert.issuer}</span>
                  )}
                </div>
                <span style={{ fontSize: '8.5pt', color: theme.muted }}>{cert.date}</span>
              </div>
            ))}
          </Section>
        )}
      </div>
    </div>
  );
}

function Section({ title, theme, children }: {
  title: string;
  theme: typeof THEME_COLORS['modern'];
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: '18px' }}>
      <h2 style={{
        fontSize: '8.5pt',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '1.5px',
        color: theme.primary,
        borderBottom: `1.5px solid ${theme.primary}33`,
        paddingBottom: '4px',
        marginBottom: '10px',
      }}>
        {title}
      </h2>
      {children}
    </div>
  );
}
