declare module 'pdf-parse' {
  interface PDFMetadata { [key: string]: any }

  interface PDFInfo {
    PDFFormatVersion: string;
    IsAcroFormPresent: boolean;
    IsXFAPresent: boolean;
    Title?: string;
    Author?: string;
    Creator?: string;
    Producer?: string;
    CreationDate?: string;
    ModDate?: string;
  }

  interface PDFPage {
    pageIndex: number;
    text: string;
  }

  interface PDFParseResult {
    numpages: number;
    numrender: number;
    info: PDFInfo;
    metadata: PDFMetadata | null;
    version: string;
    text: string;
  }

  function pdf(dataBuffer: Buffer | Uint8Array): Promise<PDFParseResult>;

  export = pdf;
}
