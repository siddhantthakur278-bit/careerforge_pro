'use client';

import React, { createContext, useContext, useReducer, useCallback } from 'react';
import {
  ResumeData,
  WorkExperience,
  Education,
  SkillGroup,
  Project,
  Certification,
  ResumeTemplate,
  JDAnalysis,
  ATSResult,
  createDefaultResume,
  createDefaultExperience,
  createDefaultEducation,
  createDefaultSkillGroup,
  createDefaultProject,
} from './resume-schema';

// ─── State ───────────────────────────────────────────────────────────────────

interface ResumeState {
  resume: ResumeData;
  jobDescription: string;
  jdAnalysis: JDAnalysis | null;
  atsResult: ATSResult | null;
  isAnalyzing: boolean;
  isRewriting: boolean;
  isGeneratingPdf: boolean;
  activeSection: string;
  activeTemplate: ResumeTemplate;
}

const initialState: ResumeState = {
  resume: createDefaultResume(),
  jobDescription: '',
  jdAnalysis: null,
  atsResult: null,
  isAnalyzing: false,
  isRewriting: false,
  isGeneratingPdf: false,
  activeSection: 'contact',
  activeTemplate: 'modern',
};

// ─── Actions ─────────────────────────────────────────────────────────────────

type Action =
  | { type: 'SET_RESUME'; payload: ResumeData }
  | { type: 'UPDATE_CONTACT'; payload: Partial<ResumeData['contact']> }
  | { type: 'UPDATE_SUMMARY'; payload: string }
  | { type: 'SET_TEMPLATE'; payload: ResumeTemplate }
  | { type: 'SET_RESUME_NAME'; payload: string }
  // Experience
  | { type: 'ADD_EXPERIENCE' }
  | { type: 'UPDATE_EXPERIENCE'; payload: { id: string; data: Partial<WorkExperience> } }
  | { type: 'REMOVE_EXPERIENCE'; payload: string }
  | { type: 'REORDER_EXPERIENCE'; payload: WorkExperience[] }
  | { type: 'ADD_BULLET'; payload: { experienceId: string } }
  | { type: 'UPDATE_BULLET'; payload: { experienceId: string; bulletId: string; text: string } }
  | { type: 'REMOVE_BULLET'; payload: { experienceId: string; bulletId: string } }
  // Education
  | { type: 'ADD_EDUCATION' }
  | { type: 'UPDATE_EDUCATION'; payload: { id: string; data: Partial<Education> } }
  | { type: 'REMOVE_EDUCATION'; payload: string }
  // Skills
  | { type: 'ADD_SKILL_GROUP' }
  | { type: 'UPDATE_SKILL_GROUP'; payload: { id: string; data: Partial<SkillGroup> } }
  | { type: 'REMOVE_SKILL_GROUP'; payload: string }
  | { type: 'ADD_SKILL'; payload: { groupId: string; name: string } }
  | { type: 'REMOVE_SKILL'; payload: { groupId: string; skillId: string } }
  // Projects
  | { type: 'ADD_PROJECT' }
  | { type: 'UPDATE_PROJECT'; payload: { id: string; data: Partial<Project> } }
  | { type: 'REMOVE_PROJECT'; payload: string }
  // Certifications
  | { type: 'ADD_CERTIFICATION' }
  | { type: 'UPDATE_CERTIFICATION'; payload: { id: string; data: Partial<Certification> } }
  | { type: 'REMOVE_CERTIFICATION'; payload: string }
  // JD & AI
  | { type: 'SET_JOB_DESCRIPTION'; payload: string }
  | { type: 'SET_JD_ANALYSIS'; payload: JDAnalysis | null }
  | { type: 'SET_ATS_RESULT'; payload: ATSResult | null }
  | { type: 'SET_IS_ANALYZING'; payload: boolean }
  | { type: 'SET_IS_REWRITING'; payload: boolean }
  | { type: 'SET_IS_GENERATING_PDF'; payload: boolean }
  | { type: 'SET_ACTIVE_SECTION'; payload: string }
  | { type: 'SET_ATS_SCORE'; payload: number }
  | { type: 'REWRITE_BULLET'; payload: { experienceId: string; bulletId: string; text: string } }
  | { type: 'SET_CUSTOM_COLORS'; payload: { primary: string; accent: string } | undefined }
  | { type: 'SET_FONT_SIZE'; payload: '9pt' | '10pt' | '11pt' | '12pt' | undefined };

// ─── Reducer ─────────────────────────────────────────────────────────────────

function resumeReducer(state: ResumeState, action: Action): ResumeState {
  const now = new Date().toISOString();

  switch (action.type) {
    case 'SET_RESUME':
      return { ...state, resume: action.payload };

    case 'UPDATE_CONTACT':
      return {
        ...state,
        resume: {
          ...state.resume,
          contact: { ...state.resume.contact, ...action.payload },
          lastModified: now,
        },
      };

    case 'UPDATE_SUMMARY':
      return {
        ...state,
        resume: { ...state.resume, summary: action.payload, lastModified: now },
      };

    case 'SET_TEMPLATE':
      return {
        ...state,
        resume: { ...state.resume, template: action.payload },
        activeTemplate: action.payload,
      };

    case 'SET_RESUME_NAME':
      return {
        ...state,
        resume: { ...state.resume, name: action.payload },
      };

    case 'SET_CUSTOM_COLORS':
      return {
        ...state,
        resume: {
          ...state.resume,
          customColors: action.payload,
          lastModified: now,
        },
      };

    case 'SET_FONT_SIZE':
      return {
        ...state,
        resume: {
          ...state.resume,
          fontSize: action.payload,
          lastModified: now,
        },
      };

    case 'ADD_EXPERIENCE':
      return {
        ...state,
        resume: {
          ...state.resume,
          experience: [...state.resume.experience, createDefaultExperience()],
          lastModified: now,
        },
      };

    case 'UPDATE_EXPERIENCE':
      return {
        ...state,
        resume: {
          ...state.resume,
          experience: state.resume.experience.map((exp) =>
            exp.id === action.payload.id ? { ...exp, ...action.payload.data } : exp
          ),
          lastModified: now,
        },
      };

    case 'REMOVE_EXPERIENCE':
      return {
        ...state,
        resume: {
          ...state.resume,
          experience: state.resume.experience.filter((e) => e.id !== action.payload),
          lastModified: now,
        },
      };

    case 'REORDER_EXPERIENCE':
      return {
        ...state,
        resume: { ...state.resume, experience: action.payload, lastModified: now },
      };

    case 'ADD_BULLET':
      return {
        ...state,
        resume: {
          ...state.resume,
          experience: state.resume.experience.map((exp) =>
            exp.id === action.payload.experienceId
              ? { ...exp, bullets: [...exp.bullets, { id: crypto.randomUUID(), text: '' }] }
              : exp
          ),
          lastModified: now,
        },
      };

    case 'UPDATE_BULLET':
    case 'REWRITE_BULLET':
      return {
        ...state,
        resume: {
          ...state.resume,
          experience: state.resume.experience.map((exp) =>
            exp.id === action.payload.experienceId
              ? {
                  ...exp,
                  bullets: exp.bullets.map((b) =>
                    b.id === action.payload.bulletId
                      ? { ...b, text: action.payload.text, isRewritten: action.type === 'REWRITE_BULLET' }
                      : b
                  ),
                }
              : exp
          ),
          lastModified: now,
        },
      };

    case 'REMOVE_BULLET':
      return {
        ...state,
        resume: {
          ...state.resume,
          experience: state.resume.experience.map((exp) =>
            exp.id === action.payload.experienceId
              ? { ...exp, bullets: exp.bullets.filter((b) => b.id !== action.payload.bulletId) }
              : exp
          ),
          lastModified: now,
        },
      };

    case 'ADD_EDUCATION':
      return {
        ...state,
        resume: {
          ...state.resume,
          education: [...state.resume.education, createDefaultEducation()],
          lastModified: now,
        },
      };

    case 'UPDATE_EDUCATION':
      return {
        ...state,
        resume: {
          ...state.resume,
          education: state.resume.education.map((edu) =>
            edu.id === action.payload.id ? { ...edu, ...action.payload.data } : edu
          ),
          lastModified: now,
        },
      };

    case 'REMOVE_EDUCATION':
      return {
        ...state,
        resume: {
          ...state.resume,
          education: state.resume.education.filter((e) => e.id !== action.payload),
          lastModified: now,
        },
      };

    case 'ADD_SKILL_GROUP':
      return {
        ...state,
        resume: {
          ...state.resume,
          skills: [...state.resume.skills, createDefaultSkillGroup()],
          lastModified: now,
        },
      };

    case 'UPDATE_SKILL_GROUP':
      return {
        ...state,
        resume: {
          ...state.resume,
          skills: state.resume.skills.map((g) =>
            g.id === action.payload.id ? { ...g, ...action.payload.data } : g
          ),
          lastModified: now,
        },
      };

    case 'REMOVE_SKILL_GROUP':
      return {
        ...state,
        resume: {
          ...state.resume,
          skills: state.resume.skills.filter((g) => g.id !== action.payload),
          lastModified: now,
        },
      };

    case 'ADD_SKILL':
      return {
        ...state,
        resume: {
          ...state.resume,
          skills: state.resume.skills.map((g) =>
            g.id === action.payload.groupId
              ? { ...g, skills: [...g.skills, { id: crypto.randomUUID(), name: action.payload.name }] }
              : g
          ),
          lastModified: now,
        },
      };

    case 'REMOVE_SKILL':
      return {
        ...state,
        resume: {
          ...state.resume,
          skills: state.resume.skills.map((g) =>
            g.id === action.payload.groupId
              ? { ...g, skills: g.skills.filter((s) => s.id !== action.payload.skillId) }
              : g
          ),
          lastModified: now,
        },
      };

    case 'ADD_PROJECT':
      return {
        ...state,
        resume: {
          ...state.resume,
          projects: [...state.resume.projects, createDefaultProject()],
          lastModified: now,
        },
      };

    case 'UPDATE_PROJECT':
      return {
        ...state,
        resume: {
          ...state.resume,
          projects: state.resume.projects.map((p) =>
            p.id === action.payload.id ? { ...p, ...action.payload.data } : p
          ),
          lastModified: now,
        },
      };

    case 'REMOVE_PROJECT':
      return {
        ...state,
        resume: {
          ...state.resume,
          projects: state.resume.projects.filter((p) => p.id !== action.payload),
          lastModified: now,
        },
      };

    case 'ADD_CERTIFICATION':
      return {
        ...state,
        resume: {
          ...state.resume,
          certifications: [
            ...state.resume.certifications,
            { id: crypto.randomUUID(), name: '', issuer: '', date: '' },
          ],
          lastModified: now,
        },
      };

    case 'UPDATE_CERTIFICATION':
      return {
        ...state,
        resume: {
          ...state.resume,
          certifications: state.resume.certifications.map((c) =>
            c.id === action.payload.id ? { ...c, ...action.payload.data } : c
          ),
          lastModified: now,
        },
      };

    case 'REMOVE_CERTIFICATION':
      return {
        ...state,
        resume: {
          ...state.resume,
          certifications: state.resume.certifications.filter((c) => c.id !== action.payload),
          lastModified: now,
        },
      };

    case 'SET_JOB_DESCRIPTION':
      return { ...state, jobDescription: action.payload };
    case 'SET_JD_ANALYSIS':
      return { ...state, jdAnalysis: action.payload };
    case 'SET_ATS_RESULT':
      return { ...state, atsResult: action.payload };
    case 'SET_IS_ANALYZING':
      return { ...state, isAnalyzing: action.payload };
    case 'SET_IS_REWRITING':
      return { ...state, isRewriting: action.payload };
    case 'SET_IS_GENERATING_PDF':
      return { ...state, isGeneratingPdf: action.payload };
    case 'SET_ACTIVE_SECTION':
      return { ...state, activeSection: action.payload };
    case 'SET_ATS_SCORE':
      return { ...state, resume: { ...state.resume, atsScore: action.payload } };

    default:
      return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface ResumeContextValue {
  state: ResumeState;
  dispatch: React.Dispatch<Action>;
  // Convenience helpers
  analyzeJD: () => Promise<void>;
  rewriteBullet: (experienceId: string, bulletId: string, currentText: string, tone?: string) => Promise<void>;
  downloadPDF: () => Promise<void>;
}

const ResumeContext = createContext<ResumeContextValue | null>(null);

export function ResumeProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(resumeReducer, initialState);

  const analyzeJD = useCallback(async () => {
    if (!state.jobDescription.trim()) return;
    dispatch({ type: 'SET_IS_ANALYZING', payload: true });
    try {
      const res = await fetch('/api/analyze-jd', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobDescription: state.jobDescription }),
      });
      const data = await res.json();
      dispatch({ type: 'SET_JD_ANALYSIS', payload: data.analysis });

      // Calculate ATS score
      const scoreRes = await fetch('/api/ats-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resume: state.resume,
          keywords: data.analysis.rawKeywords,
        }),
      });
      const scoreData = await scoreRes.json();
      dispatch({ type: 'SET_ATS_RESULT', payload: scoreData });
      dispatch({ type: 'SET_ATS_SCORE', payload: scoreData.score });
    } catch (error) {
      console.error('JD analysis error:', error);
    } finally {
      dispatch({ type: 'SET_IS_ANALYZING', payload: false });
    }
  }, [state.jobDescription, state.resume]);

  const rewriteBullet = useCallback(
    async (experienceId: string, bulletId: string, currentText: string, tone = 'professional') => {
      dispatch({ type: 'SET_IS_REWRITING', payload: true });
      try {
        const keywords = state.jdAnalysis?.mustHave || state.jdAnalysis?.rawKeywords || [];
        const res = await fetch('/api/ai-rewrite', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: currentText, keywords, type: 'bullet', tone }),
        });
        const data = await res.json();
        dispatch({
          type: 'REWRITE_BULLET',
          payload: { experienceId, bulletId, text: data.rewritten },
        });
      } catch (error) {
        console.error('Rewrite error:', error);
      } finally {
        dispatch({ type: 'SET_IS_REWRITING', payload: false });
      }
    },
    [state.jdAnalysis]
  );

  const downloadPDF = useCallback(async () => {
    dispatch({ type: 'SET_IS_GENERATING_PDF', payload: true });
    try {
      const res = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resume: state.resume }),
      });
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${state.resume.contact.fullName || 'resume'}-careerforge.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('PDF generation error:', error);
    } finally {
      dispatch({ type: 'SET_IS_GENERATING_PDF', payload: false });
    }
  }, [state.resume]);

  return (
    <ResumeContext.Provider value={{ state, dispatch, analyzeJD, rewriteBullet, downloadPDF }}>
      {children}
    </ResumeContext.Provider>
  );
}

export function useResume() {
  const ctx = useContext(ResumeContext);
  if (!ctx) throw new Error('useResume must be used within a ResumeProvider');
  return ctx;
}
