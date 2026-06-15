'use client';

import { useState, useRef, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import ContactForm from '@/components/resume-form/ContactForm';
import SummaryForm from '@/components/resume-form/SummaryForm';
import ExperienceForm from '@/components/resume-form/ExperienceForm';
import EducationForm from '@/components/resume-form/EducationForm';
import SkillsForm from '@/components/resume-form/SkillsForm';
import ProjectsForm from '@/components/resume-form/ProjectsForm';
import CertificationsForm from '@/components/resume-form/CertificationsForm';
import ResumePreview from '@/components/resume-preview/ResumePreview';
import ATSScoreMeter from '@/components/ui/ATSScoreMeter';
import { useResume } from '@/lib/resume-context';
import {
  User, Briefcase, GraduationCap, Wrench, FileText,
  Download, Loader2, Target, ChevronRight,
  Zap, LayoutTemplate, Brain, AlertCircle, FolderCode, Award,
  Upload, Minus, Plus,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { MOCK_RESUME_FRONTEND, MOCK_RESUME_PRODUCT_MANAGER, MOCK_RESUME_UX_DESIGNER } from '@/data/mock-resumes';

const SECTIONS = [
  { id: 'contact', label: 'Contact', icon: User },
  { id: 'summary', label: 'Summary', icon: FileText },
  { id: 'experience', label: 'Experience', icon: Briefcase },
  { id: 'education', label: 'Education', icon: GraduationCap },
  { id: 'skills', label: 'Skills', icon: Wrench },
  { id: 'projects', label: 'Projects', icon: FolderCode },
  { id: 'certifications', label: 'Certifications', icon: Award },
];

const TEMPLATES = [
  { id: 'modern', label: 'Modern', color: 'from-indigo-600 to-purple-600', desc: 'Vibrant & Contemporary' },
  { id: 'executive', label: 'Executive', color: 'from-slate-700 to-slate-900', desc: 'Classic & Professional' },
  { id: 'minimal', label: 'Minimal', color: 'from-gray-700 to-gray-900', desc: 'Clean & Simple' },
];

export default function BuilderPage() {
  const { state, dispatch, analyzeJD, downloadPDF } = useResume();
  const [activeSection, setActiveSection] = useState('contact');
  const [showJDPanel, setShowJDPanel] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [zoom, setZoom] = useState<number>(0.85);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isLoadedRef = useRef(false);

  const { resume, jobDescription, jdAnalysis, atsResult, isAnalyzing, isGeneratingPdf } = state;

  // Load saved resume from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('careerforge_current');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object' && 'contact' in parsed) {
          dispatch({ type: 'SET_RESUME', payload: parsed });
        }
      } catch (e) {
        console.error('Failed to load saved resume:', e);
      }
    }
    isLoadedRef.current = true;
  }, [dispatch]);

  // Auto-save resume to localStorage when it changes
  useEffect(() => {
    if (isLoadedRef.current && resume) {
      localStorage.setItem('careerforge_current', JSON.stringify(resume));
    }
  }, [resume]);

  const handleExportJSON = () => {
    try {
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(resume, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `${resume.name || 'resume'}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      toast.success('Resume JSON exported successfully! 💾');
    } catch {
      toast.error('Failed to export resume.');
    }
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importedResume = JSON.parse(event.target?.result as string);
        if (importedResume && typeof importedResume === 'object' && 'contact' in importedResume) {
          dispatch({
            type: 'SET_RESUME',
            payload: {
              ...importedResume,
              id: resume.id,
            },
          });
          toast.success('Resume JSON imported successfully! 🚀');
        } else {
          toast.error('Invalid resume JSON format.');
        }
      } catch {
        toast.error('Failed to parse JSON file.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleAnalyzeJD = async () => {
    if (!jobDescription.trim()) {
      toast.error('Paste a job description first!');
      return;
    }
    toast.loading('Analyzing job description...', { id: 'jd-analyze' });
    try {
      await analyzeJD();
      toast.success('JD analyzed! Keywords extracted ✨', { id: 'jd-analyze' });
    } catch {
      toast.error('Analysis failed', { id: 'jd-analyze' });
    }
  };

  const handleDownloadPDF = async () => {
    toast.loading('Generating PDF...', { id: 'pdf-gen' });
    try {
      await downloadPDF();
      toast.success('PDF downloaded! 🎉', { id: 'pdf-gen' });
    } catch {
      toast.error('PDF generation failed', { id: 'pdf-gen' });
    }
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'contact': return <ContactForm />;
      case 'summary': return <SummaryForm />;
      case 'experience': return <ExperienceForm />;
      case 'education': return <EducationForm />;
      case 'skills': return <SkillsForm />;
      case 'projects': return <ProjectsForm />;
      case 'certifications': return <CertificationsForm />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0f1e]">
      <Navbar />

      {/* Top Bar */}
      <div className="fixed top-16 left-0 right-0 z-40 border-b border-white/10 bg-[#0a0f1e]/95 backdrop-blur-xl">
        <div className="flex items-center justify-between px-4 py-2.5 max-w-[1800px] mx-auto">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={resume.name}
              onChange={(e) => dispatch({ type: 'SET_RESUME_NAME', payload: e.target.value })}
              className="bg-transparent text-white font-medium text-sm border-b border-transparent hover:border-white/20 focus:border-indigo-500 focus:outline-none px-1 py-0.5 transition-colors w-48"
            />
          </div>

          <div className="flex items-center gap-2">
            {/* ATS Score compact */}
            {atsResult && (
              <div className="flex items-center gap-2 px-3 py-1.5 glass rounded-xl">
                <ATSScoreMeter score={atsResult.score} compact />
              </div>
            )}

            {/* Demo Data Selector */}
            <select
              onChange={(e) => {
                const val = e.target.value;
                if (val === 'frontend') {
                  dispatch({ type: 'SET_RESUME', payload: { ...MOCK_RESUME_FRONTEND, id: resume.id } });
                  toast.success('Loaded Frontend Demo data! ✨');
                }
                if (val === 'pm') {
                  dispatch({ type: 'SET_RESUME', payload: { ...MOCK_RESUME_PRODUCT_MANAGER, id: resume.id } });
                  toast.success('Loaded Product Manager Demo data! ✨');
                }
                if (val === 'ux') {
                  dispatch({ type: 'SET_RESUME', payload: { ...MOCK_RESUME_UX_DESIGNER, id: resume.id } });
                  toast.success('Loaded UX Designer Demo data! ✨');
                }
                e.target.value = '';
              }}
              className="flex items-center gap-1.5 px-3 py-2 glass hover:bg-white/10 text-gray-300 text-xs sm:text-sm rounded-xl transition-all outline-none"
            >
              <option value="" className="bg-[#0a0f1e] text-gray-400">Load Demo Data...</option>
              <option value="frontend" className="bg-[#0a0f1e] text-white">Frontend Dev</option>
              <option value="pm" className="bg-[#0a0f1e] text-white">Product Manager</option>
              <option value="ux" className="bg-[#0a0f1e] text-white">UX/UI Designer</option>
            </select>

            {/* Import/Export JSON */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImportJSON}
              accept=".json"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-2 glass hover:bg-white/10 text-gray-300 text-xs sm:text-sm rounded-xl transition-all"
              title="Import resume from JSON"
            >
              <Upload className="w-4 h-4" />
              <span className="hidden sm:inline">Import JSON</span>
            </button>
            <button
              onClick={handleExportJSON}
              className="flex items-center gap-1.5 px-3 py-2 glass hover:bg-white/10 text-gray-300 text-xs sm:text-sm rounded-xl transition-all"
              title="Export resume to JSON"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export JSON</span>
            </button>

            {/* Template picker */}
            <button
              onClick={() => setShowTemplates(!showTemplates)}
              className="flex items-center gap-1.5 px-3 py-2 glass hover:bg-white/10 text-gray-300 text-sm rounded-xl transition-all"
            >
              <LayoutTemplate className="w-4 h-4" />
              <span className="hidden sm:inline capitalize">{resume.template}</span>
            </button>

            {/* JD Panel */}
            <button
              onClick={() => setShowJDPanel(!showJDPanel)}
              className={`flex items-center gap-1.5 px-3 py-2 text-sm rounded-xl transition-all ${
                showJDPanel
                  ? 'bg-indigo-600 text-white'
                  : 'glass hover:bg-white/10 text-gray-300'
              }`}
            >
              <Target className="w-4 h-4" />
              <span className="hidden sm:inline">JD Analysis</span>
              {jdAnalysis && (
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
              )}
            </button>

            {/* Download PDF */}
            <button
              onClick={handleDownloadPDF}
              disabled={isGeneratingPdf}
              className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-sm font-medium rounded-xl transition-all shadow-lg shadow-emerald-500/25 disabled:opacity-60"
            >
              {isGeneratingPdf ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              <span className="hidden sm:inline">Download PDF</span>
            </button>
          </div>
        </div>

        {/* Template dropdown */}
        {showTemplates && (
          <div className="px-4 pb-3.5 pt-2 border-t border-white/5 space-y-3.5">
            <div className="flex gap-2">
              {TEMPLATES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    dispatch({ type: 'SET_TEMPLATE', payload: t.id as 'modern' | 'executive' | 'minimal' });
                    setShowTemplates(false);
                  }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-all ${
                    resume.template === t.id
                      ? 'bg-white/15 border border-white/30 text-white'
                      : 'glass hover:bg-white/10 text-gray-400'
                  }`}
                >
                  <div className={`w-5 h-5 rounded bg-gradient-to-br ${t.color}`} />
                  <div className="text-left">
                    <div className="font-medium">{t.label}</div>
                    <div className="text-[10px] text-gray-500">{t.desc}</div>
                  </div>
                  {resume.template === t.id && <ChevronRight className="w-3 h-3 text-indigo-400" />}
                </button>
              ))}
            </div>

            {/* Custom Theme Colors Picker */}
            <div className="flex flex-wrap items-center gap-4 pt-2.5 border-t border-white/5 text-xs">
              <span className="text-gray-400 font-medium">Custom Palette:</span>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 text-gray-300 hover:text-white cursor-pointer bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded-xl border border-white/5 hover:border-white/15 transition-all duration-300 hover:scale-105">
                  <span className="text-gray-400 font-medium">Primary:</span>
                  <input
                    type="color"
                    value={resume.customColors?.primary || {
                      modern: '#6366f1',
                      executive: '#1e3a5f',
                      minimal: '#111827'
                    }[resume.template || 'modern']}
                    onChange={(e) => {
                      const primary = e.target.value;
                      const accent = resume.customColors?.accent || {
                        modern: '#10b981',
                        executive: '#c9a84c',
                        minimal: '#6b7280'
                      }[resume.template || 'modern'];
                      dispatch({ type: 'SET_CUSTOM_COLORS', payload: { primary, accent } });
                    }}
                    className="w-5 h-5 rounded-md cursor-pointer border border-white/20 bg-transparent p-0 transition-transform duration-200 hover:scale-110"
                  />
                </label>

                <label className="flex items-center gap-2 text-gray-300 hover:text-white cursor-pointer bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded-xl border border-white/5 hover:border-white/15 transition-all duration-300 hover:scale-105">
                  <span className="text-gray-400 font-medium">Accent:</span>
                  <input
                    type="color"
                    value={resume.customColors?.accent || {
                      modern: '#10b981',
                      executive: '#c9a84c',
                      minimal: '#6b7280'
                    }[resume.template || 'modern']}
                    onChange={(e) => {
                      const accent = e.target.value;
                      const primary = resume.customColors?.primary || {
                        modern: '#6366f1',
                        executive: '#1e3a5f',
                        minimal: '#111827'
                      }[resume.template || 'modern'];
                      dispatch({ type: 'SET_CUSTOM_COLORS', payload: { primary, accent } });
                    }}
                    className="w-5 h-5 rounded-md cursor-pointer border border-white/20 bg-transparent p-0 transition-transform duration-200 hover:scale-110"
                  />
                </label>

                {/* Font Size Selector */}
                <div className="flex items-center gap-1.5 ml-4 bg-white/5 border border-white/10 hover:bg-white/10 px-2.5 py-1 rounded-xl transition-all">
                  <span className="text-gray-400 font-medium">Font:</span>
                  <select
                    value={resume.fontSize || '10pt'}
                    onChange={(e) => {
                      const sz = e.target.value as '9pt' | '10pt' | '11pt' | '12pt';
                      dispatch({ type: 'SET_FONT_SIZE', payload: sz });
                    }}
                    className="bg-transparent text-white border-none outline-none text-xs cursor-pointer font-medium"
                  >
                    <option value="9pt" className="bg-[#0a0f1e] text-white">9pt (Compact)</option>
                    <option value="10pt" className="bg-[#0a0f1e] text-white">10pt (Standard)</option>
                    <option value="11pt" className="bg-[#0a0f1e] text-white">11pt (Medium)</option>
                    <option value="12pt" className="bg-[#0a0f1e] text-white">12pt (Large)</option>
                  </select>
                </div>

                {resume.customColors && (
                  <button
                    onClick={() => dispatch({ type: 'SET_CUSTOM_COLORS', payload: undefined })}
                    className="text-xs text-red-400 hover:text-red-300 underline font-medium ml-2"
                  >
                    Reset Colors
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Layout */}
      <div className={`flex pt-[${showTemplates ? '120px' : '96px'}] min-h-screen`} style={{ paddingTop: showTemplates ? '120px' : '96px' }}>

        {/* Left: Form Panel */}
        <div className="w-[420px] flex-shrink-0 flex flex-col border-r border-white/10 h-[calc(100vh-96px)] sticky top-[96px] overflow-hidden">

          {/* Section tabs */}
          <div className="flex border-b border-white/10 bg-[#0d1226] flex-shrink-0">
            {SECTIONS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveSection(id)}
                className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium transition-all ${
                  activeSection === id
                    ? 'text-indigo-300 border-b-2 border-indigo-500 bg-indigo-500/5'
                    : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </button>
            ))}
          </div>

          {/* Form content */}
          <div className="flex-1 overflow-y-auto scrollbar-thin p-4">
            {renderSection()}
          </div>
        </div>

        {/* Middle: JD Panel (conditional) */}
        {showJDPanel && (
          <div className="w-[360px] flex-shrink-0 border-r border-white/10 flex flex-col h-[calc(100vh-96px)] sticky top-[96px] overflow-hidden">
            <div className="p-4 border-b border-white/10 flex-shrink-0">
              <div className="flex items-center gap-2 mb-1">
                <Brain className="w-4 h-4 text-indigo-400" />
                <h3 className="font-semibold text-white text-sm">JD Analysis Agent</h3>
              </div>
              <p className="text-xs text-gray-500">Paste a job description to extract ATS keywords</p>
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-4">
              {/* JD Input */}
              <div>
                <textarea
                  value={jobDescription}
                  onChange={(e) => dispatch({ type: 'SET_JOB_DESCRIPTION', payload: e.target.value })}
                  placeholder="Paste the full job description here...&#10;&#10;We're looking for a Senior Software Engineer with expertise in React, Node.js, and AWS..."
                  rows={8}
                  className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-600 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-indigo-500/60 transition-all resize-none leading-relaxed"
                />
                <button
                  onClick={handleAnalyzeJD}
                  disabled={isAnalyzing}
                  className="mt-2 w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-sm font-medium rounded-xl transition-all disabled:opacity-60 shadow-lg shadow-indigo-500/25"
                >
                  {isAnalyzing ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Zap className="w-4 h-4" />
                  )}
                  {isAnalyzing ? 'Analyzing...' : 'Analyze Job Description'}
                </button>
              </div>

              {/* Results */}
              {jdAnalysis && (
                <div className="space-y-3 animate-fade-in">
                  {/* ATS Score */}
                  {atsResult && (
                    <div className="glass-card p-4">
                      <ATSScoreMeter
                        score={atsResult.score}
                        matched={atsResult.matched}
                        missing={atsResult.missing}
                      />
                    </div>
                  )}

                  {/* Must-Have Keywords */}
                  {jdAnalysis.mustHave?.length > 0 && (
                    <KeywordSection
                      title="Must-Have"
                      keywords={jdAnalysis.mustHave}
                      color="red"
                      icon="🎯"
                    />
                  )}

                  {/* Technical */}
                  {jdAnalysis.technical?.length > 0 && (
                    <KeywordSection
                      title="Technical Skills"
                      keywords={jdAnalysis.technical}
                      color="indigo"
                      icon="⚡"
                    />
                  )}

                  {/* Tools */}
                  {jdAnalysis.tools?.length > 0 && (
                    <KeywordSection
                      title="Tools & Platforms"
                      keywords={jdAnalysis.tools}
                      color="cyan"
                      icon="🔧"
                    />
                  )}

                  {/* Soft Skills */}
                  {jdAnalysis.softSkills?.length > 0 && (
                    <KeywordSection
                      title="Soft Skills"
                      keywords={jdAnalysis.softSkills}
                      color="emerald"
                      icon="💼"
                    />
                  )}

                  {jdAnalysis.jobTitle && (
                    <div className="flex items-center gap-2 p-3 glass rounded-xl text-xs">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                      <span className="text-gray-400">
                        <span className="text-white font-medium">{jdAnalysis.jobTitle}</span>
                        {jdAnalysis.experienceLevel && ` · ${jdAnalysis.experienceLevel}`}
                        {jdAnalysis.industry && ` · ${jdAnalysis.industry}`}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Right: Resume Preview */}
        <div className="flex-1 bg-[#080d1a] flex flex-col overflow-hidden relative">
          {/* Zoom controls floating bar */}
          <div className="absolute top-4 right-4 z-30 flex items-center gap-1.5 p-1.5 glass rounded-xl border border-white/10 shadow-lg">
            <button
              onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
              className="p-1 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
              title="Zoom Out"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="text-[11px] font-semibold text-gray-300 w-10 text-center select-none">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={() => setZoom(Math.min(1.5, zoom + 0.1))}
              className="p-1 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
              title="Zoom In"
            >
              <Plus className="w-4 h-4" />
            </button>
            <div className="w-px h-3 bg-white/10 mx-0.5" />
            <button
              onClick={() => setZoom(0.85)}
              className="px-2 py-1 hover:bg-white/10 rounded-lg text-[10px] font-medium text-gray-400 hover:text-white transition-colors"
              title="Reset Zoom"
            >
              Reset
            </button>
            <button
              onClick={() => setZoom(1.0)}
              className="px-2 py-1 hover:bg-white/10 rounded-lg text-[10px] font-medium text-gray-400 hover:text-white transition-colors"
              title="Fit Page Width"
            >
              100%
            </button>
          </div>

          <div className="flex-1 overflow-auto scrollbar-thin p-6 flex justify-center items-start">
            <div
              style={{
                width: `calc(210mm * ${zoom})`,
                transition: 'width 0.2s ease',
              }}
            >
              <div
                className="shadow-2xl origin-top-left transition-transform duration-200"
                style={{
                  transform: `scale(${zoom})`,
                  width: '210mm',
                }}
              >
                <ResumePreview resume={resume} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function KeywordSection({
  title, keywords, color, icon,
}: {
  title: string;
  keywords: string[];
  color: string;
  icon: string;
}) {
  const colorMap: Record<string, string> = {
    red: 'bg-red-500/15 text-red-300 border-red-500/25',
    indigo: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/25',
    cyan: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/25',
    emerald: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/25',
  };

  return (
    <div className="glass rounded-xl p-3">
      <p className="text-xs font-semibold text-gray-300 mb-2">
        {icon} {title}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {keywords.map((kw) => (
          <span
            key={kw}
            className={`text-xs px-2 py-0.5 rounded-full border ${colorMap[color] || colorMap.indigo}`}
          >
            {kw}
          </span>
        ))}
      </div>
    </div>
  );
}
