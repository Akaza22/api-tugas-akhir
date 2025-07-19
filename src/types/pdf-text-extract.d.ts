declare module 'pdf-text-extract' {
  type Callback = (err: Error | null, pages: string[]) => void;

  interface Options {
    cwd?: string;
    layout?: string;
    mode?: string;
  }

  function extract(path: string, options: Options, callback: Callback): void;
  function extract(path: string, callback: Callback): void;

  export = extract;
}
