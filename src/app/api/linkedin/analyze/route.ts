import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { analyzeLinkedInData } from '@/services/linkedin/linkedinService';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  const session = await getSessionUser(req);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const { profileUrl = '', profileData = '', dataSource = 'TEXT_PASTE' } = body;

    if (!profileData && !profileUrl) {
      return NextResponse.json({ error: 'Provide profile data or URL' }, { status: 400 });
    }

    // Sanitize LinkedIn URL (never store credentials)
    const safeUrl = profileUrl.replace(/[?&].*$/, '').trim();

    // Get student knowledge for context
    const knowledgeList = await db.knowledgeState.findMany({ where: { studentId: session.id } });
    const knowledgeContext = knowledgeList.map(k => ({ conceptId: k.conceptId, masteryScore: k.masteryScore }));

    // Analyze
    const analysis = await analyzeLinkedInData(profileData || `LinkedIn profile URL: ${safeUrl}`, knowledgeContext);

    const now = new Date().toISOString();
    const linkedinId = crypto.randomUUID();

    // Store or update LinkedIn profile (one per student)
    const existing = await db.linkedinProfile.findFirst({ where: { studentId: session.id } });
    let record;
    if (existing) {
      record = await db.linkedinProfile.update({
        where: { id: existing.id },
        data: {
          profileUrl: safeUrl,
          profileData: profileData.slice(0, 10000),
          lastAnalyzedAt: now,
          analysisStatus: 'ANALYZED',
          dataSource: dataSource as any,
          skillsDetected: analysis.skillsDetected,
          experiences: analysis.experiences,
          projects: analysis.projects,
          certifications: analysis.certifications,
          education: analysis.education,
          headline: analysis.headline,
          about: analysis.about,
          skillGaps: analysis.skillGaps,
          nextSkillRecommendations: analysis.nextSkillRecommendations,
          careerAlignments: analysis.careerAlignments,
          updatedAt: now,
        }
      });
    } else {
      record = await db.linkedinProfile.create({
        data: {
          id: linkedinId,
          studentId: session.id,
          profileUrl: safeUrl,
          profileData: profileData.slice(0, 10000),
          lastAnalyzedAt: now,
          analysisStatus: 'ANALYZED',
          dataSource: dataSource as any,
          skillsDetected: analysis.skillsDetected,
          experiences: analysis.experiences,
          projects: analysis.projects,
          certifications: analysis.certifications,
          education: analysis.education,
          headline: analysis.headline,
          about: analysis.about,
          skillGaps: analysis.skillGaps,
          nextSkillRecommendations: analysis.nextSkillRecommendations,
          careerAlignments: analysis.careerAlignments,
          createdAt: now,
          updatedAt: now,
        }
      });
    }

    // Store skill evidence for top skills
    for (const skill of analysis.skillsDetected.slice(0, 15)) {
      await db.skillEvidence.create({
        data: {
          id: crypto.randomUUID(),
          studentId: session.id,
          skillName: skill.skillName,
          sourceType: 'LINKEDIN',
          sourceId: record.id,
          evidenceLevel: skill.evidenceStrength === 'HIGH' ? 'DEMONSTRATED' : skill.evidenceStrength === 'MEDIUM' ? 'LEARNING' : 'EXPOSURE',
          confidence: skill.confidence,
          createdAt: now,
        }
      });
    }

    return NextResponse.json({
      success: true,
      profile: record,
      analysis,
      message: 'LinkedIn profile analyzed successfully.',
    });
  } catch (err: any) {
    console.error('LinkedIn analyze error:', err);
    return NextResponse.json({ error: 'LinkedIn analysis failed', details: err.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const session = await getSessionUser(req);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const profile = await db.linkedinProfile.findFirst({ where: { studentId: session.id } });
  const skillEvidence = await db.skillEvidence.findMany({ where: { studentId: session.id } });
  return NextResponse.json({ profile, skillEvidence });
}

export async function DELETE(req: NextRequest) {
  const session = await getSessionUser(req);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const profile = await db.linkedinProfile.findFirst({ where: { studentId: session.id } });
  if (profile) {
    await db.linkedinProfile.delete({ where: { id: profile.id } });
  }
  return NextResponse.json({ success: true });
}
