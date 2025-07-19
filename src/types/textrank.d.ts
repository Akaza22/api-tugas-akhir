declare module 'textrank' {
  export function textrank(
    text: string,
    options?: { language?: string; maxSentences?: number }
  ): string;
}
