import {name, version} from "../package.json"
import config from "../src/configs/config"

const swaggerDef = {
	openapi: "3.0.0",
	info: {
		title: `${name} API documentation`,
		version,
		license: {
			name: "MIT",
			url: "https://opensource.org/licenses/MIT"
		}
	},
	servers: [
		{
			url: `http://localhost:${config.port}/v1`
		}
	]
}

export default swaggerDef
