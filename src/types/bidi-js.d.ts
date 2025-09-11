declare module 'bidi-js' {
  interface BidiOptions {
    dir?: 'ltr' | 'rtl';
  }

  /**
   * Applies bidirectional text algorithm to text
   * @param text - The text to process
   * @param options - Bidirectional text options
   * @returns The processed text with proper bidirectional formatting
   */
  function bidi(text: string, options?: BidiOptions): string;

  export = bidi;
}
