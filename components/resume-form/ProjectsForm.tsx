'use client';

import { useResume } from '@/lib/resume-context';
import { Plus, Trash2, Sparkles, Loader2, GripVertical, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Project, BulletPoint } from '@/lib/resume-schema';

const inputClass = `w-full bg-white/5 border border-white/10 text-white placeholder-gray-500 rounded-xl px-3 py-2 text-sm
  focus:outline-none focus:border-indigo-500/60 transition-all duration-200`;

export default function ProjectsForm() {
  const { state, dispatch } = useResume();
  const { projects } = state.resume;
  const [expandedId, setExpandedId] = useState<string | null>(projects[0]?.id || null);
  const [rewritingBullet, setRewritingBullet] = useState<string | null>(null);

  const updateProject = (id: string, data: Partial<Project>) => {
    dispatch({ type: 'UPDATE_PROJECT', payload: { id, data } });
  };

  const addBullet = (proj: Project) => {
    const newBullet: BulletPoint = { id: crypto.randomUUID(), text: '' };
    updateProject(proj.id, {
      bullets: [...proj.bullets, newBullet],
    });
  };

  const updateBullet = (proj: Project, bulletId: string, text: string, isRewritten = false) => {
    const updated = proj.bullets.map((b) =>
      b.id === bulletId ? { ...b, text, isRewritten } : b
    );
    updateProject(proj.id, { bullets: updated });
  };

  const removeBullet = (proj: Project, bulletId: string) => {
    const updated = proj.bullets.filter((b) => b.id !== bulletId);
    updateProject(proj.id, { bullets: updated });
  };

  const handleRewriteBullet = async (proj: Project, bulletId: string, text: string) => {
    if (!text.trim()) {
      toast.error('Write something first!');
      return;
    }
    const key = `${proj.id}-${bulletId}`;
    setRewritingBullet(key);
    try {
      const keywords = state.jdAnalysis?.mustHave || state.jdAnalysis?.rawKeywords || [];
      const res = await fetch('/api/ai-rewrite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, keywords, type: 'bullet' }),
      });
      const data = await res.json();
      if (data.rewritten) {
        updateBullet(proj, bulletId, data.rewritten, true);
        toast.success('Bullet rewritten! ✨', { icon: '🚀' });
      } else {
        toast.error('Rewrite failed');
      }
    } catch {
      toast.error('Rewrite failed');
    } finally {
      setRewritingBullet(null);
    }
  };

  return (
    <div className="space-y-3">
      {projects.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mx-auto mb-3">
            <Plus className="w-6 h-6 text-gray-400" />
          </div>
          <p className="text-sm">Add your projects</p>
        </div>
      )}

      {projects.map((proj, idx) => (
        <div key={proj.id} className="border border-white/10 rounded-xl overflow-hidden">
          {/* Accordion header */}
          <button
            onClick={() => setExpandedId(expandedId === proj.id ? null : proj.id)}
            className="w-full flex items-center justify-between px-4 py-3 bg-white/5 hover:bg-white/8 transition-colors text-left"
          >
            <div className="flex items-center gap-3 min-w-0">
              <GripVertical className="w-4 h-4 text-gray-500 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {proj.name || `Project ${idx + 1}`}
                </p>
                {proj.technologies.length > 0 && (
                  <p className="text-xs text-gray-400 truncate">
                    {proj.technologies.join(', ')}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  dispatch({ type: 'REMOVE_PROJECT', payload: proj.id });
                }}
                className="p-1 hover:bg-red-500/20 text-gray-500 hover:text-red-400 rounded-lg transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              {expandedId === proj.id ? (
                <ChevronUp className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-400" />
              )}
            </div>
          </button>

          {expandedId === proj.id && (
            <div className="px-4 pb-4 pt-3 space-y-3 bg-black/20">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Project Name *</label>
                <input
                  type="text"
                  value={proj.name}
                  onChange={(e) => updateProject(proj.id, { name: e.target.value })}
                  placeholder="E-Commerce Platform"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="text-xs text-gray-400 mb-1 block">Technologies (comma-separated)</label>
                <input
                  type="text"
                  value={proj.technologies.join(', ')}
                  onChange={(e) =>
                    updateProject(proj.id, {
                      technologies: e.target.value
                        .split(',')
                        .map((s) => s.trim()),
                    })
                  }
                  placeholder="React, Next.js, Stripe, Tailwind"
                  className={inputClass}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Project URL (Demo)</label>
                  <input
                    type="url"
                    value={proj.url || ''}
                    onChange={(e) => updateProject(proj.id, { url: e.target.value })}
                    placeholder="https://example.com"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">GitHub Repository</label>
                  <input
                    type="url"
                    value={proj.github || ''}
                    onChange={(e) => updateProject(proj.id, { github: e.target.value })}
                    placeholder="https://github.com/username/project"
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Bullet points */}
              <div className="space-y-2">
                <label className="text-xs text-gray-400">Bullet Points</label>
                {proj.bullets.map((bullet, bIdx) => (
                  <div key={bullet.id} className="flex items-start gap-2">
                    <div className="flex-1 relative">
                      <textarea
                        value={bullet.text}
                        onChange={(e) =>
                          updateBullet(proj, bullet.id, e.target.value)
                        }
                        placeholder={`Bullet ${bIdx + 1}: Developed an interactive dashboard rendering real-time sales data...`}
                        rows={2}
                        className={`${inputClass} resize-none pr-10 ${
                          bullet.isRewritten ? 'border-indigo-500/40 bg-indigo-500/5' : ''
                        }`}
                      />
                      {bullet.isRewritten && (
                        <span className="absolute top-2 right-2 text-[10px] text-indigo-400">✨ AI</span>
                      )}
                    </div>
                    <div className="flex flex-col gap-1 pt-1">
                      <button
                        onClick={() => handleRewriteBullet(proj, bullet.id, bullet.text)}
                        disabled={rewritingBullet === `${proj.id}-${bullet.id}`}
                        title="AI Rewrite"
                        className="p-1.5 bg-indigo-500/20 hover:bg-indigo-500/40 text-indigo-400 rounded-lg transition-colors disabled:opacity-50"
                      >
                        {rewritingBullet === `${proj.id}-${bullet.id}` ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Sparkles className="w-3.5 h-3.5" />
                        )}
                      </button>
                      {proj.bullets.length > 1 && (
                        <button
                          onClick={() => removeBullet(proj, bullet.id)}
                          className="p-1.5 hover:bg-red-500/20 text-gray-500 hover:text-red-400 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => addBullet(proj)}
                  className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 transition-colors py-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add bullet point
                </button>
              </div>
            </div>
          )}
        </div>
      ))}

      <button
        onClick={() => dispatch({ type: 'ADD_PROJECT' })}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-dashed border-white/20 hover:border-indigo-500/50 text-gray-400 hover:text-indigo-300 text-sm rounded-xl transition-all duration-200 hover:bg-indigo-500/5"
      >
        <Plus className="w-4 h-4" /> Add Project
      </button>
    </div>
  );
}
