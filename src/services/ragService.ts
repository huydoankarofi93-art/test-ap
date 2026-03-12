
import { GoogleGenAI } from "@google/genai";
import { KNOWLEDGE_BASE, KnowledgeSnippet } from "./knowledgeBase";

// Simple cosine similarity function
function cosineSimilarity(vecA: number[], vecB: number[]): number {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

// Cache for embeddings to avoid re-embedding the same snippets
const embeddingCache: Map<string, number[]> = new Map();

export async function getRelevantContext(query: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return "";

  const ai = new GoogleGenAI({ apiKey });
  
  try {
    // 1. Get embedding for the query
    const queryResult = await ai.models.embedContent({
      model: "gemini-embedding-2-preview",
      contents: [query]
    });
    const queryEmbedding = queryResult.embeddings[0].values;

    // 2. Get embeddings for knowledge base (in a real app, these would be pre-computed)
    const results: { snippet: KnowledgeSnippet; score: number }[] = [];
    
    for (const snippet of KNOWLEDGE_BASE) {
      let snippetEmbedding = embeddingCache.get(snippet.id);
      if (!snippetEmbedding) {
        const res = await ai.models.embedContent({
          model: "gemini-embedding-2-preview",
          contents: [snippet.content]
        });
        snippetEmbedding = res.embeddings[0].values;
        embeddingCache.set(snippet.id, snippetEmbedding);
      }
      
      const score = cosineSimilarity(queryEmbedding, snippetEmbedding);
      results.push({ snippet, score });
    }

    // 3. Sort and take top 3
    const topSnippets = results
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map(r => r.snippet.content);

    return topSnippets.join("\n\n");
  } catch (e) {
    console.error("RAG failed", e);
    // Fallback to simple keyword matching if embedding fails
    const keywords = query.toLowerCase().split(/\s+/);
    const fallback = KNOWLEDGE_BASE
      .filter(s => keywords.some(k => s.content.toLowerCase().includes(k)))
      .slice(0, 2)
      .map(s => s.content);
    return fallback.join("\n\n");
  }
}
