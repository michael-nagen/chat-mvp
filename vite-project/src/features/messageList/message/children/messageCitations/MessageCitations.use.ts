import { useState } from 'react';
import { useMessage } from '../../Message.context';
import { getKnowledgeChunk } from '../../../../knowledgeUpload';
import { createSourcePreview } from './MessageCitations.utils';
import type { UseMessageCitations } from './MessageCitations.types';

// Owns source hydration for the Sources block: one open source at a time,
// fetched on demand from Atlas by chunkId and cached so re-opening never
// refetches. A failed fetch degrades to a fixed message; embeddings are never
// requested and source text is never persisted to message metadata.
export function useMessageCitations(): UseMessageCitations {
  const { message } = useMessage();
  const citations = message.metadata?.citations ?? [];
  const [openChunkId, setOpenChunkId] = useState<string | null>(null);
  const [sources, setSources] = useState<Record<string, string>>({});
  const [loadingChunkId, setLoadingChunkId] = useState<string | null>(null);

  async function loadSource(chunkId: string): Promise<void> {
    setLoadingChunkId(chunkId);
    try {
      const chunk = await getKnowledgeChunk(chunkId);
      setSources((prev) => ({ ...prev, [chunkId]: chunk.text }));
    } catch {
      setSources((prev) => ({ ...prev, [chunkId]: 'Source unavailable.' }));
    } finally {
      setLoadingChunkId((current) => (current === chunkId ? null : current));
    }
  }

  function toggleSource(chunkId: string): void {
    if (openChunkId === chunkId) {
      setOpenChunkId(null);
      return;
    }
    setOpenChunkId(chunkId);
    if (sources[chunkId] === undefined) void loadSource(chunkId);
  }

  function getSourcePreview(chunkId: string): string | null {
    if (openChunkId !== chunkId) return null;
    const text = sources[chunkId];
    return text === undefined ? null : createSourcePreview(text);
  }

  return {
    citations,
    isSourceOpen: (chunkId) => openChunkId === chunkId,
    isSourceLoading: (chunkId) => loadingChunkId === chunkId,
    getSourcePreview,
    toggleSource,
  };
}
