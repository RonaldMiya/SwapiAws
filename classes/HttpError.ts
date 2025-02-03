type Jsonable = string | number | boolean | null | undefined | readonly Jsonable[] | { readonly [key: string]: Jsonable } | { toJSON(): Jsonable }

interface HttpErrorOptions {
  cause?: Error;
  context?: Jsonable;
}

export class HttpError extends Error {
  public readonly context?: Jsonable;

  constructor(message: string, options: HttpErrorOptions = {}) {
    const { cause, context } = options;

    super(message);
    this.name = this.constructor.name;
    if (cause) {
      this.stack = cause.stack;
    }

    this.context = context;
  }
}
