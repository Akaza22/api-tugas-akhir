# python/summarizer.py
import sys
import tempfile
import requests

def download_pdf(url: str) -> str:
    resp = requests.get(url, timeout=60)
    resp.raise_for_status()
    tmp = tempfile.NamedTemporaryFile(delete=False, suffix=".pdf")
    tmp.write(resp.content)
    tmp.flush()
    return tmp.name

def extract_text_pymupdf(path: str) -> str:
    try:
        import fitz  # PyMuPDF
        doc = fitz.open(path)
        texts = []
        for page in doc:
            texts.append(page.get_text("text"))
        doc.close()
        return "\n".join(texts)
    except Exception:
        return ""

def extract_text_pdfminer(path: str) -> str:
    try:
        from pdfminer.high_level import extract_text
        return extract_text(path)
    except Exception:
        return ""

def clean_text(text: str) -> str:
    # buang spasi berlebih
    import re
    text = text.replace('\r', ' ').replace('\n', ' ')
    text = re.sub(r'\s+', ' ', text).strip()
    return text

def summarize_textrank(text: str, sentence_count: int = 3, language: str = "english") -> str:
    # Sumy tidak punya bahasa Indonesia built-in; gunakan english tokenizer untuk dokumen campur
    from sumy.parsers.plaintext import PlaintextParser
    from sumy.nlp.tokenizers import Tokenizer
    from sumy.summarizers.text_rank import TextRankSummarizer

    parser = PlaintextParser.from_string(text, Tokenizer(language))
    summarizer = TextRankSummarizer()
    summary_sentences = summarizer(parser.document, sentence_count)

    return " ".join(str(s) for s in summary_sentences)

def main():
    if len(sys.argv) < 2:
        print("", end="")
        return

    pdf_url = sys.argv[1]
    sentence_count = 3
    if len(sys.argv) >= 3:
        try:
            sentence_count = int(sys.argv[2])
        except ValueError:
            pass

    path = download_pdf(pdf_url)

    text = extract_text_pymupdf(path)
    if not text.strip():
        text = extract_text_pdfminer(path)

    text = clean_text(text)

    if not text:
        print("", end="")
        return

    # Gunakan 'english' tokenizer. Jika mayoritas kontenmu bahasa Indonesia,
    # hasil tetap usable karena TextRank berbasis graf kemiripan, bukan grammar penuh.
    summary = summarize_textrank(text, sentence_count=sentence_count, language="english")
    print(summary, end="")

if __name__ == "__main__":
    main()
