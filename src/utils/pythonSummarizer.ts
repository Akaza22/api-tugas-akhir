import { execFile } from 'child_process';
import path from 'path';

export async function summarizePdfWithPython(pdfUrl: string, sentences = 3): Promise<string | null> {
  return new Promise((resolve) => {
    // Path ke summarizer.py relatif ke berkas TS yang dikompilasi.
    // __dirname saat runtime (dist), jadi lompat ke ../python
    const scriptPath = path.join(__dirname, '..', '..', 'python3', 'summarizer.py');

    const py = execFile(
      'python',                // Atau 'python' di Windows (cek env)
      [scriptPath, pdfUrl, sentences.toString()],
      { timeout: 120000 },      // 120s timeout
      (err, stdout, stderr) => {
        if (err) {
          console.warn('Python summarizer error:', err);
          if (stderr) console.warn('stderr:', stderr);
          return resolve(null);
        }
        const out = stdout?.trim() ?? '';
        resolve(out || null);
      }
    );
  });
}
