'use client';

import { useResume } from '@/lib/resume-context';
import { Plus, Trash2, Sparkles, Loader2, GripVertical, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { WorkExperience } from '@/lib/resume-schema';

const inputClass = `w-full bg-white/5 border border-white/10 text-white placeholder-gray-500 rounded-xl px-3 py-2 text-sm
  focus:outline-none focus:border-indigo-500/60 transition-all duration-200`;

export default function ExperienceForm() {
  const { state, dispatch, rewriteBullet } = useResume();
  const { experience } = state.resume;
  const [expandedId, setExpandedId] = useState<string | null>(experience[0]?.id || null);
  const [rewritingBullet, setRewritingBullet] = useState<string | null>(null);
  const [rewriteTone, setRewriteTone] = useState<'professional' | 'metric-driven' | 'executive' | 'creative'>('professional');

  const updateExp = (id: string, data: Partial<WorkExperience>) => {
    dispatch({ type: 'UPDATE_EXPERIENCE', payload: { id, data } });
  };

  const handleRewriteBullet = async (expId: string, bulletId: string, text: string) => {
    if (!text.trim()) { toast.error('Write something first!'); return; }
    const key = `${expId}-${bulletId}`;
    setRewritingBullet(key);
    try {
      await rewriteBullet(expId, bulletId, text, rewriteTone);
      toast.success('Bullet rewritten! ✨', { icon: '🚀' });
    } catch {
      toast.error('Rewrite failed');
    } finally {
      setRewritingBullet(null);
    }
  };

  return (
    <div className="space-y-3">
      {experience.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mx-auto mb-3">
            <Plus className="w-6 h-6 text-gray-400" />
          </div>
          <p className="text-sm">Add your work experience</p>
        </div>
      )}

      {experience.map((exp, idx) => (
        <div key={exp.id} className="border border-white/10 rounded-xl overflow-hidden">
          {/* Accordion header */}
          <button
            onClick={() => setExpandedId(expandedId === exp.id ? null : exp.id)}
            className="w-full flex items-center justify-between px-4 py-3 bg-white/5 hover:bg-white/8 transition-colors text-left"
          >
            <div className="flex items-center gap-3 min-w-0">
              <GripVertical className="w-4 h-4 text-gray-500 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {exp.position || `Experience ${idx + 1}`}
                </p>
                {exp.company && (
                  <p className="text-xs text-gray-400 truncate">{exp.company}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={(e) => { e.stopPropagation(); dispatch({ type: 'REMOVE_EXPERIENCE', payload: exp.id }); }}
                className="p-1 hover:bg-red-500/20 text-gray-500 hover:text-red-400 rounded-lg transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              {expandedId === exp.id ? (
                <ChevronUp className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-400" />
              )}
            </div>
          </button>

          {expandedId === exp.id && (
            <div className="px-4 pb-4 pt-3 space-y-3 bg-black/20">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Job Title *</label>
                  <input
                    type="text"
                    value={exp.position}
                    onChange={(e) => updateExp(exp.id, { position: e.target.value })}
                    placeholder="Software Engineer"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Company *</label>
                  <input
                    type="text"
                    value={exp.company}
                    onChange={(e) => updateExp(exp.id, { company: e.target.value })}
                    placeholder="Google"
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-400 mb-1 block">Location</label>
                <input
                  type="text"
                  value={exp.location}
                  onChange={(e) => updateExp(exp.id, { location: e.target.value })}
                  placeholder="Mountain View, CA"
                  className={inputClass}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Start Date</label>
                  <input
                    type="month"
                    value={exp.startDate}
                    onChange={(e) => updateExp(exp.id, { startDate: e.target.value })}
                    className={`${inputClass} [color-scheme:dark]`}
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">End Date</label>
                  {exp.current ? (
                    <div className="flex items-center h-[38px] px-3">
                      <span className="text-sm text-emerald-400 font-medium">Present</span>
                    </div>
                  ) : (
                    <input
                      type="month"
                      value={exp.endDate}
                      onChange={(e) => updateExp(exp.id, { endDate: e.target.value })}
                      className={`${inputClass} [color-scheme:dark]`}
                    />
                  )}
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={exp.current}
                  onChange={(e) => updateExp(exp.id, { current: e.target.checked })}
                  className="w-4 h-4 rounded accent-indigo-500"
                />
                <span className="text-sm text-gray-400">I currently work here</span>
              </label>

              {/* Bullet points */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs text-gray-400">Bullet Points</label>
                  <div className="flex items-center gap-1 text-[11px] text-gray-400">
                    <span>Tone:</span>
                    <select
                      value={rewriteTone}
                      onChange={(e) => setRewriteTone(e.target.value as any)}
                      className="bg-white/5 border border-white/10 text-gray-300 rounded-lg px-2 py-0.5 text-[11px] focus:outline-none focus:border-indigo-500/60 outline-none cursor-pointer hover:bg-white/10 transition-colors"
                    >
                      <option value="professional" className="bg-[#0a0f1e] text-white">Professional</option>
                      <option value="metric-driven" className="bg-[#0a0f1e] text-white">Metric-Driven</option>
                      <option value="executive" className="bg-[#0a0f1e] text-white">Executive</option>
                      <option value="creative" className="bg-[#0a0f1e] text-white">Creative</option>
                    </select>
                  </div>
                </div>
                {exp.bullets.map((bullet, bIdx) => (
                  <div key={bullet.id} className="flex items-start gap-2">
                    <div className="flex-1 relative">
                      <textarea
                        value={bullet.text}
                        onChange={(e) =>
                          dispatch({
                            type: 'UPDATE_BULLET',
                            payload: { experienceId: exp.id, bulletId: bullet.id, text: e.target.value },
                          })
                        }
                        placeholder={`Bullet ${bIdx + 1}: Led the development of...`}
                        rows={2}
                        className={`${inputClass} resize-none pr-10 ${bullet.isRewritten ? 'border-indigo-500/40 bg-indigo-500/5' : ''}`}
                      />
                      {bullet.isRewritten && (
                        <span className="absolute top-2 right-2 text-[10px] text-indigo-400">✨ AI</span>
                      )}
                    </div>
                    <div className="flex flex-col gap-1 pt-1">
                      <button
                        onClick={() => handleRewriteBullet(exp.id, bullet.id, bullet.text)}
                        disabled={rewritingBullet === `${exp.id}-${bullet.id}`}
                        title="AI Rewrite"
                        className="p-1.5 bg-indigo-500/20 hover:bg-indigo-500/40 text-indigo-400 rounded-lg transition-colors disabled:opacity-50"
                      >
                        {rewritingBullet === `${exp.id}-${bullet.id}` ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Sparkles className="w-3.5 h-3.5" />
                        )}
                      </button>
                      {exp.bullets.length > 1 && (
                        <button
                          onClick={() =>
                            dispatch({ type: 'REMOVE_BULLET', payload: { experienceId: exp.id, bulletId: bullet.id } })
                          }
                          className="p-1.5 hover:bg-red-500/20 text-gray-500 hover:text-red-400 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => dispatch({ type: 'ADD_BULLET', payload: { experienceId: exp.id } })}
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
        onClick={() => {
          dispatch({ type: 'ADD_EXPERIENCE' });
        }}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-dashed border-white/20 hover:border-indigo-500/50 text-gray-400 hover:text-indigo-300 text-sm rounded-xl transition-all duration-200 hover:bg-indigo-500/5"
      >
        <Plus className="w-4 h-4" /> Add Work Experience
      </button>
    </div>
  );
}
