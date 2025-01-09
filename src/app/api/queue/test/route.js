import { NextResponse } from 'next/server';
import { createQueue } from '@/lib/redis';

export async function GET() {
    const queue = createQueue();
    
    try {
        await queue.client.ping();
        await queue.close();
        
        return NextResponse.json({ 
            status: 'connected',
            environment: process.env.NODE_ENV
        });
    } catch (error) {
        try {
            await queue.close();
        } catch (closeError) {
            console.error('Error closing queue:', closeError);
        }

        return NextResponse.json({ 
            status: 'error',
            message: error.message,
            environment: process.env.NODE_ENV
        }, { status: 500 });
    }
}