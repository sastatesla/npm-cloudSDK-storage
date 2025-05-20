import * as path from "path"
import {lookup as mimeLookupLib} from "mime-types"

export default function mimeLookup(filePath: string): string | false {
	const ext = path.extname(filePath)
	return mimeLookupLib(ext) || false
}
