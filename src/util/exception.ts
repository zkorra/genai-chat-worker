import { HTTPException } from "hono/http-exception";
import { StatusCode } from "hono/utils/http-status";

export class GenericException extends HTTPException {
	message: string;
	detail?: string;

	constructor(status: StatusCode, message: string, detail?: string) {
		super(status);
		this.message = message;
		this.detail = detail;
	}
}

export class InputException extends GenericException {
	constructor(message: string, detail?: string) {
		super(400, message, detail);
	}
}

export class NotFoundException extends GenericException {
	constructor(message: string, detail?: string) {
		super(404, message, detail);
	}
}

export class ServerException extends GenericException {
	constructor(message: string, detail?: string) {
		super(500, message, detail);
	}
}
