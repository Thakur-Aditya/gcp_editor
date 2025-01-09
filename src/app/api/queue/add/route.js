// import Queue from 'bull';
// import { NextResponse } from 'next/server';

// const imageQueue = new Queue('imageProcessing', process.env.REDIS_URL);

// export async function POST(request) {
//     try {
//         const body = await request.json();
//         const { filename, originalName, url, projectId } = body;

//         const job = await imageQueue.add({
//             filename,
//             originalName,
//             url,
//             projectId,
//             timestamp: Date.now()
//         });

//         return NextResponse.json({ jobId: job.id });
//     } catch (error) {
//         console.error('Queue error:', error);
//         return NextResponse.json(
//             { error: 'Failed to queue image' },
//             { status: 500 }
//         );
//     }
// }


import { NextResponse } from 'next/server';
import { createQueue } from '@/lib/redis';

export const config = {
    maxDuration: 30
};

export async function POST(request) {
    const queue = createQueue();
    
    try {
        const body = await request.json();
        const { filename, originalName, url, projectId } = body;

        // Validate input
        if (!filename || !originalName || !url || !projectId) {
            await queue.close();
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const job = await queue.add({
            filename,
            originalName,
            url,
            projectId,
            timestamp: Date.now()
        });

        await queue.close();

        return NextResponse.json({ 
            success: true,
            jobId: job.id 
        });

    } catch (error) {
        try {
            await queue.close();
        } catch (closeError) {
            console.error('Error closing queue:', closeError);
        }

        console.error('Queue error:', error);
        return NextResponse.json(
            { error: 'Failed to queue image' },
            { status: 500 }
        );
    }
}