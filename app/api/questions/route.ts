import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'public', 'questions.json');
    
    try {
      const fileContent = await fs.readFile(filePath, 'utf-8');
      const questions = JSON.parse(fileContent);
      
      return NextResponse.json(questions, {
        headers: {
          'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
        },
      });
    } catch (fileError) {
      // If file doesn't exist, return empty array
      console.log('questions.json not found, returning empty array');
      return NextResponse.json([], {
        headers: {
          'Cache-Control': 'no-cache',
        },
      });
    }
  } catch (error) {
    console.error('Error loading questions:', error);
    return NextResponse.json(
      { error: 'Failed to load questions' },
      { status: 500 }
    );
  }
}