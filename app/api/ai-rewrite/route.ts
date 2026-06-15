// app/api/ai-rewrite/route.ts
// AI Rewrite Engine — rewrites resume content using Gemini with keyword injection

import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { handleGeminiError } from '@/lib/gemini-error';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

type RewriteType = 'bullet' | 'summary' | 'authority';
type RewriteTone = 'professional' | 'metric-driven' | 'executive' | 'creative';

const TONE_INSTRUCTIONS: Record<RewriteTone, string> = {
  professional: 'Maintain a standard, clear, and professional tone suitable for corporate environments.',
  'metric-driven': 'Focus heavily on quantifiable achievements, statistics, percentages, and metrics. Invent realistic, placeholder metrics if none are present in the original (e.g., "improving conversion rate by 15%", "saving 12 hours weekly").',
  executive: 'Sound authoritative, high-level, and leadership-focused. Use visionary action verbs like Spearheaded, Orchestrated, Championed, and Directed.',
  creative: 'Write with dynamic, engaging language, focusing on innovation, problem-solving, and unique value addition.',
};

const PROMPTS: Record<RewriteType, (text: string, keywords: string[], tone?: RewriteTone) => string> = {
  bullet: (text, keywords, tone = 'professional') => `You are an expert resume writer specializing in ATS optimization.

Rewrite the following resume bullet point to:
1. Start with a powerful action verb.
2. Naturally incorporate these keywords where relevant: ${keywords.slice(0, 8).join(', ')}
3. Be specific and quantifiable.
4. Be concise (1-2 lines max).
5. Tone style: ${TONE_INSTRUCTIONS[tone] || TONE_INSTRUCTIONS.professional}

Original bullet: "${text}"

Return ONLY a JSON object: {"rewritten": "the new bullet point text", "variations": ["variation1", "variation2"]}
No explanation, no markdown, just JSON.`,

  summary: (text, keywords) => `You are an expert resume writer.

Rewrite the following professional summary to:
1. Be compelling, confident, and results-oriented
2. Naturally incorporate these key terms: ${keywords.slice(0, 6).join(', ')}
3. Be 2-4 sentences (50-80 words)
4. Highlight expertise, value proposition, and career focus

Original summary: "${text}"

Return ONLY a JSON object: {"rewritten": "the new summary", "variations": ["variation1", "variation2"]}
No explanation, no markdown, just JSON.`,

  authority: (text, keywords) => `You are an expert resume writer.

Enhance this text to sound more authoritative, impactful, and leadership-focused:
1. Use power words (Spearheaded, Championed, Orchestrated, Accelerated)
2. Incorporate these keywords naturally: ${keywords.slice(0, 6).join(', ')}
3. Maintain the core meaning
4. Make it measurable and specific

Original: "${text}"

Return ONLY a JSON object: {"rewritten": "the enhanced text", "variations": ["variation1", "variation2"]}
No explanation, no markdown, just JSON.`,
};

export async function POST(req: NextRequest) {
  try {
    const { text, keywords = [], type = 'bullet', tone = 'professional' } = await req.json() as {
      text: string;
      keywords: string[];
      type: RewriteType;
      tone: RewriteTone;
    };

    if (!text || text.trim().length < 5) {
      return NextResponse.json({ error: 'Text is too short to rewrite' }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const promptFn = PROMPTS[type] || PROMPTS.bullet;
    const prompt = promptFn(text, keywords, tone);

    const result = await model.generateContent(prompt);
    const rawText = result.response.text().trim();

    const jsonText = rawText.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim();
    const parsed = JSON.parse(jsonText);

    return NextResponse.json({
      rewritten: parsed.rewritten,
      variations: parsed.variations || [],
      original: text,
      success: true,
    });
  } catch (error) {
    return handleGeminiError(error, 'AI rewrite failed');
  }
}
