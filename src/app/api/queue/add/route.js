import Queue from 'bull';
import { NextResponse } from 'next/server';

const imageQueue = new Queue('imageProcessing', process.env.REDIS_URL);

export async function POST(request) {
    try {
        const body = await request.json();
        const { filename, originalName, url, projectId } = body;

        const job = await imageQueue.add({
            filename,
            originalName,
            url,
            projectId,
            timestamp: Date.now()
        });

        return NextResponse.json({ jobId: job.id });
    } catch (error) {
        console.error('Queue error:', error);
        return NextResponse.json(
            { error: 'Failed to queue image' },
            { status: 500 }
        );
    }
}