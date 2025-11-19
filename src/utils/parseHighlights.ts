// utils/parseHighlights.ts

export interface HighlightChunk {
  type: string | null;
  content: string;
}

export type ParsedNode = string | HighlightChunk;

export function parseHighlights(text: string): ParsedNode[] {
  const regex =
    /<highlight(?:\s+type="([^"]+)")?>([\s\S]*?)<\/highlight>/g;

  let result: ParsedNode[] = [];
  let lastIndex = 0;

  for (const match of text.matchAll(regex)) {
    const [fullMatch, type, content] = match;
    const start = match.index ?? 0;

    if (start > lastIndex) {
      result.push(text.slice(lastIndex, start));
    }

    result.push({
      type: type ?? null,
      content,
    });

    lastIndex = start + fullMatch.length;
  }

  if (lastIndex < text.length) {
    result.push(text.slice(lastIndex));
  }

  return result;
}
