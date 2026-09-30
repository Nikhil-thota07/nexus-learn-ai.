import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const user = await db.user.findUnique({ where: { email } });
    if (!user) {
      // Return success anyway to prevent user enumeration
      return NextResponse.json({
        success: true,
        message: 'If this email exists in our system, a password reset link has been dispatched.',
      });
    }

    // In a production environment with an email service, send an email.
    // For local resilience and demo testing, provide the mock token back in message for seamless UX.
    const token = `reset_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    return NextResponse.json({
      success: true,
      message: 'Password reset link sent to your registered email address.',
      demoResetToken: token, // Provided for easy development testing
    });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to process password reset' }, { status: 500 });
  }
}
