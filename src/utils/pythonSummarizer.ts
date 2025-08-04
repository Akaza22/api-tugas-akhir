import axios from 'axios';

export async function summarizePdfWithPython(
  pdfUrl: string,
  numSentences: number = 3
): Promise<string | null> {
  try {
    const response = await axios.post('https://textrank-summary.vercel.app/summarize-url', {
      url: pdfUrl,
      sentences: numSentences
    });
    return response.data.summary ?? null;
  } catch (err) {
    console.error("Python summarize API failed:", err);
    return null;
  }
}
