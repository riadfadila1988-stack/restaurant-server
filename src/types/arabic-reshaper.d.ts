declare module 'arabic-reshaper' {
  /**
   * Reshapes Arabic text to display correctly in environments that don't support Arabic text shaping
   * @param text - The Arabic text to reshape
   * @returns The reshaped Arabic text
   */
  export function reshape(text: string): string;
}
