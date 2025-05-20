import {Response} from "express"
import morgan from "morgan"
import config from "./config"
import eventEmitter from "../utils/logging"

// Add custom token for optional error messages
morgan.token("message", (req, res: Response) => res.locals.errorMessage || "")

// Choose IP format for production/dev
const getIpFormat = () => (config.env === "production" ? ":remote-addr - " : "")

// Define formats
const successFormat = `${getIpFormat()}:method :url :status - :response-time ms`
const errorFormat = `${getIpFormat()}:method :url :status - :response-time ms - message: :message`

const successHandler = morgan(successFormat, {
	skip: (req, res) => res.statusCode >= 400,
	stream: {
		write: (message) => eventEmitter.emit("logging", message.trim())
	}
})

const errorHandler = morgan(errorFormat, {
	skip: (req, res) => res.statusCode < 400,
	stream: {
		write: (message) => eventEmitter.emit("logging", message.trim())
	}
})

export default {
	successHandler,
	errorHandler
}
