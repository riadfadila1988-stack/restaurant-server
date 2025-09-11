declare module 'escpos' {
  export interface PrinterOptions {
    type?: string;
    interface?: string;
    width?: number;
    characterSet?: string;
    removeSpecialCharacters?: boolean;
    replaceSpecialCharacters?: boolean;
  }

  export class Printer {
    constructor(device: any, options?: PrinterOptions);
    font(family: string): this;
    align(alignment: string): this;
    style(type: string): this;
    size(width: number, height: number): this;
    text(content: string): this;
    feed(lines?: number): this;
    cut(partial?: boolean): this;
    close(callback?: () => void): void;
  }

  export class USB {
    constructor(vid?: number, pid?: number);
  }

  export class Network {
    constructor(address: string, port?: number);
  }

  export class Serial {
    constructor(device: string, options?: any);
  }
}
