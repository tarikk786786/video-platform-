import { NextRequest, NextResponse } from 'next/server';

// Temporary in-memory chunk tracker for active uploads
const uploadSessionChunks = new Map<string, { totalChunks: number; chunksReceived: Set<number> }>();

export async function POST(req: NextRequest) {
  try {
    const uploadId = req.headers.get('x-upload-id');
    const chunkIndexStr = req.headers.get('x-chunk-index');
    const totalChunksStr = req.headers.get('x-total-chunks');
    const fileName = req.headers.get('x-file-name') || 'unnamed_file';

    if (!uploadId || chunkIndexStr === null || totalChunksStr === null) {
      return NextResponse.json(
        { error: 'Missing required chunk headers (x-upload-id, x-chunk-index, x-total-chunks)' },
        { status: 400 }
      );
    }

    const chunkIndex = parseInt(chunkIndexStr, 10);
    const totalChunks = parseInt(totalChunksStr, 10);

    const chunkData = await req.arrayBuffer();

    if (!uploadSessionChunks.has(uploadId)) {
      uploadSessionChunks.set(uploadId, {
        totalChunks,
        chunksReceived: new Set<number>(),
      });
    }

    const session = uploadSessionChunks.get(uploadId)!;
    session.chunksReceived.add(chunkIndex);

    const isComplete = session.chunksReceived.size === totalChunks;

    return NextResponse.json({
      success: true,
      uploadId,
      chunkIndex,
      receivedBytes: chunkData.byteLength,
      chunksCompleted: session.chunksReceived.size,
      totalChunks,
      isComplete,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Chunk upload failed' }, { status: 500 });
  }
}