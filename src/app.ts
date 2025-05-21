import express from "express"
import helmet from "helmet"
import compression from "compression"
import config from "./configs/config"
// import morgan from "./configs/morgan"
import eventEmitter from "./utils/logging"

const app = express()
const port: number = parseInt(process.env.PORT as string) || 5002

// set security HTTP headers
app.use(helmet())

// parse json request body
app.use(express.json())

// parse urlencoded request body
app.use(express.urlencoded({extended: true}))

// gzip compression
app.use(compression())

app.listen(port, async () => {
	// get redis client
	eventEmitter.emit("logging", `Server is up and running on port: ${port}`)
})

export default app
