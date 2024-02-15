import { HTTPException } from "hono/http-exception";

export class InputException extends HTTPException {
	constructor(message: string) {
		super(400, { message: message });
	}
}

export class NotFoundException extends HTTPException {
	constructor(message: string) {
		super(404, { message: message });
	}
}
