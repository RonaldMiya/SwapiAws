export class HttpResponse {
  statusCode: number;
  message: string;
  data?: any;

  constructor(statusCode: number, message: string, data?: any) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }

  public toJson() {
    return {
      statusCode: this.statusCode,
      message: this.message,
      data: this.data || null
    };
  }

  public static ok(message: string, data?: any) {
    return new HttpResponse(200, message, data);
  }

  public static badRequest(message: string, data?: any) {
    return new HttpResponse(400, message, data);
  }

  public static internalServerError(message: string, data?: any) {
    return new HttpResponse(500, message, data);
  }

  public static notFound(message: string, data?: any) {
    return new HttpResponse(404, message, data);
  }
}