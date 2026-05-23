export class HttpException extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = new.target.name;
    this.status = status;
  }
}

export class AppError extends HttpException {
  constructor(message: string) {
    super(400, message);
  }
}

export class UnauthorizedException extends HttpException {
  constructor(message = "Não autorizado") {
    super(401, message);
  }
}

export class ForbiddenException extends HttpException {
  constructor(message = "Acesso negado") {
    super(403, message);
  }
}

export class NotFoundException extends HttpException {
  constructor(message = "Recurso não encontrado") {
    super(404, message);
  }
}
