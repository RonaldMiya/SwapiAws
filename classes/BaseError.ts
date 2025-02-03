interface BaseErrorParams<T extends string> {
  name: T;
  message: string;
  cause?: unknown;
}

export class BaseError<T extends string> extends Error {
  cause?: unknown;
  stack?: string;

  constructor({ name, message, cause }: BaseErrorParams<T>) {
    super(message);

    this.name = name;
    this.cause = cause;

    if (cause instanceof Error) {
      this.stack = cause.stack;
    }

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  toString(): string {
    let causeStr = this.cause ? `Caused by: ${this.cause}` : '';
    return `${this.name}: ${this.message}${causeStr}`;
  }
}
