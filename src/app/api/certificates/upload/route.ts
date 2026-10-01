import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { analyzeCertificate } from '@/services/certificate/certificateService';
import crypto from 'crypto';

export const runtime = 'nodejs';
export const maxDuration = 30;

export async function POST(req: NextRequest) {
  const session = await getSessionUser(req);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    const fileExt = file.name.split('.').pop()?.toLowerCase() || '';
    const allowedExts = ['pdf', 'jpg', 'jpeg', 'png'];
    if (!allowedExts.includes(fileExt)) {
      return NextResponse.json({ error: 'Unsupported file type. Use PDF, JPG, JPEG, or PNG.' }, { status: 400 });
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large. Maximum 10MB.' }, { status: 400 });
    }

    // Read file content
    const buffer = Buffer.from(await file.arrayBuffer());
    let textContent = '';

    if (fileExt === 'pdf') {
      // Extract text from PDF: use buffer toString to get any readable text
      // For production: use pdf-parse npm package. For now: extract printable ASCII
      textContent = buffer.toString('latin1').replace(/[^\x20-\x7E\n\r\t]/g, ' ').replace(/\s+/g, ' ').trim();
      // If too short, fall back to filename analysis
      if (textContent.length < 50) {
        textContent = `Certificate file: ${file.name}. PDF content could not be fully extracted.`;
      }
    } else {
      // Image: use base64 + OpenAI Vision if available, otherwise use filename
      const apiKey = process.env.OPENAI_API_KEY;
      if (apiKey && apiKey !== 'your-openai-api-key-here') {
        try {
          const OpenAI = (await import('openai')).default;
          const openai = new OpenAI({ apiKey });
          const base64 = buffer.toString('base64');
          const mimeType = fileExt === 'png' ? 'image/png' : 'image/jpeg';
          const visionResponse = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [{
              role: 'user',
              content: [
                { type: 'text', text: 'Extract ALL text visible in this certificate image. Return the raw text only, no commentary.' },
                { type: 'image_url', image_url: { url: `data:${mimeType};base64,${base64}`, detail: 'high' } }
              ]
            }],
            max_tokens: 1000,
          });
          textContent = visionResponse.choices[0]?.message?.content || `Certificate image: ${file.name}`;
        } catch {
          textContent = `Certificate image: ${file.name}. Image content analysis unavailable.`;
        }
      } else {
        textContent = `Certificate image: ${file.name}. OCR not available — analyzing by filename.`;
      }
    }

    // Get student knowledge for personalization
    const knowledgeList = await db.knowledgeState.findMany({ where: { studentId: session.id } });
    const knowledgeContext = knowledgeList.map(k => ({ conceptId: k.conceptId, masteryScore: k.masteryScore }));

    // Run AI analysis
    const analysis = await analyzeCertificate(textContent, file.name, knowledgeContext);

    // Store certificate record
    const certId = crypto.randomUUID();
    const now = new Date().toISOString();

    const certRecord = await db.certificate.create({
      data: {
        id: certId,
        studentId: session.id,
        fileName: file.name,
        fileType: fileExt,
        certificateTitle: analysis.certificateTitle,
        certificateType: analysis.certificateType,
        organization: analysis.organization,
        eventName: analysis.eventName,
        issueDate: analysis.issueDate,
        credentialId: analysis.credentialId,
        description: analysis.description,
        extractionConfidence: analysis.extractionConfidence,
        verificationStatus: 'EXTRACTED',
        domains: analysis.domains,
        skillsDetected: analysis.skillsDetected,
        evidenceLevel: analysis.evidenceLevel,
        reasoningSummary: analysis.reasoningSummary,
        recommendedAssessment: analysis.recommendedAssessment,
        nextSkillRecommendations: analysis.nextSkillRecommendations,
        learningPathUpdates: analysis.learningPathUpdates,
        uploadedAt: now,
      }
    });

    // Create skill evidence records
    for (const skill of analysis.skillsDetected.slice(0, 10)) {
      await db.skillEvidence.create({
        data: {
          id: crypto.randomUUID(),
          studentId: session.id,
          skillName: skill.skillName,
          sourceType: 'CERTIFICATE',
          sourceId: certId,
          evidenceLevel: analysis.evidenceLevel,
          confidence: skill.confidence,
          createdAt: now,
        }
      });
    }

    // Search for related YouTube videos for skill gaps
    let recommendedVideos: any[] = [];
    try {
      if (analysis.nextSkillRecommendations.length > 0) {
        const topSkill = analysis.nextSkillRecommendations[0].skill;
        const { searchEducationalVideos } = await import('@/lib/youtube/service');
        const videos = await searchEducationalVideos(`${topSkill} tutorial for beginners`);
        recommendedVideos = videos;
      }
    } catch {}

    return NextResponse.json({
      success: true,
      certificate: certRecord,
      analysis,
      evidenceSummary: analysis.evidenceSummary,
      recommendedVideos,
      message: 'Certificate uploaded and analyzed successfully.',
    });
  } catch (err: any) {
    console.error('Certificate upload error:', err);
    return NextResponse.json({ error: 'Certificate processing failed', details: err.message }, { status: 500 });
  }
}
