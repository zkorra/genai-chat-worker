import { HTTPException } from "hono/http-exception";
import { StatusCode } from "hono/utils/http-status";

type AppExceptionDetails = {
	message: string;
	type?: string;
	additional?: string;
};

export class AppException extends HTTPException {
	details: AppExceptionDetails;

	constructor(status: StatusCode, details: AppExceptionDetails) {
		super(status);
		this.details = details;
		this.details.type = this.constructor.name;
	}
}

export class InputException extends AppException {
	constructor(message: string, additional?: string) {
		super(400, { message: message, additional: additional });
	}
}

export class NotFoundException extends AppException {
	constructor(message: string, additional?: string) {
		super(404, { message: message, additional: additional });
	}
}

export class ServerException extends AppException {
	constructor(message: string, additional?: string) {
		super(500, { message: message, additional: additional });
	}
}
