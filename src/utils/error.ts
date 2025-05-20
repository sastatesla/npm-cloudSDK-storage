export class StorageError extends Error {
	public code?: string
	public details?: unknown

	constructor(message: string, code?: string, details?: unknown) {
		super(message)
		this.name = "StorageError"
		this.code = code
		this.details = details
		Error.captureStackTrace(this, this.constructor)
	}
}
