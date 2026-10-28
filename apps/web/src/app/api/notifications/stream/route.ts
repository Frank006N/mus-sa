import { NextRequest } from 'next/server';
import { db } from '@/db';
import * as schema from '@/db/schema';
import { eq, desc, count } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('userId');
  if (!userId) return new Response('User ID required', { status: 400 });

  const encoder = new TextEncoder();
  
  const stream = new ReadableStream({
    async start(controller) {
      try {
        // SAFE COUNT QUERY: Use drizzle-orm's count() helper correctly
        const result = await db.select({ value: count() })
          .from(schema.notifications)
          .where(eq(schema.notifications.recipientId, userId))
          .where(eq(schema.notifications.read, false));
        
        const unreadCount = result[0]?.value ?? 0;
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'init', count: unreadCount })}\n\n`));

        // Poll for updates every 5 seconds with error isolation
        const interval = setInterval(async () => {
          try {
            const newNotifs = await db.select()
              .from(schema.notifications)
              .where(eq(schema.notifications.recipientId, userId))
              .where(eq(schema.notifications.read, false))
              .orderBy(desc(schema.notifications.createdAt))
              .limit(10);
            
            if (newNotifs.length > 0) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'update', notifications: newNotifs })}\n\n`));
            }
          } catch (pollErr) {
            console.warn('[SSE POLL ERROR]', pollErr);
            // Don't crash the stream on transient DB errors
          }
        }, 5000);

        req.signal.addEventListener('abort', () => {
          clearInterval(interval);
          controller.close();
        });
      } catch (err) {
        console.error('[SSE STREAM INIT ERROR]', err);
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'error', message: 'Notification service unavailable' })}\n\n`));
        controller.close();
      }
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    }
  });
}
