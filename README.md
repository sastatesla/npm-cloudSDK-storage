# CloudStorage - Universal Storage Wrapper

A plug-and-play, class-based TypeScript library to interact with multiple cloud
storage providers (GCS, S3, Spaces, etc.) using a unified, extensible interface.

---

## Key Highlights

- 🔌 **Plug-and-play:** Easily swap cloud providers via configuration.
- 🔒 **Optional file type validation:** Restrict uploads to allowed MIME types.
- 🧑‍💻 **Object-oriented:** Clean, class-based structure for easy extension.
- 💪 **Strongly-typed:** TypeScript-first with clear interfaces.
- 🎛 **Provider-agnostic:** Add your own providers by extending the base class.
- ❌ **No web dependencies required for core usage:** Works in any Node.js
  environment.
- 🗂 **Supports file paths and in-memory buffers:** Upload files from disk
  (`filePath`), or from memory (`Buffer`/in-memory file object).
- 🚀 **Bulk operations:** Bulk upload and delete for both file paths and
  buffers.

---

## Installation

````bash
npm i @sastatesla/cloud-storage-sdk
# or
yarn @sastatesla/cloud-storage-sdk

---

## Usage

### 1. **Setup Configuration**

```typescript
import {CloudStorage} from "@sastatesla/cloud-storage-sdk"
const gcsKey = require("../gcs-key.json")

// Example for Google Cloud Storage (GCS)
const storage = CloudStorage.init({
	provider: "gcs",
	config: {
		bucketName: process.env.GCS_BUCKET,
		credentials: gcskey // Pass as an objet not just he path of the file
	},
	allowedFileTypes: ["image/jpeg", "image/png", "application/pdf"] // (Optional)
})
````

---

### 2. **Uploading a File (from File Path)**

```typescript
const result = await storage.upload("./path/to/file.jpg")
console.log(result.url) // File public URL
```

---

### 3. **Uploading a File (from Buffer / In-Memory File)**

You can upload files directly from memory (e.g., if you've received them via an
HTTP request parser or created them in your app):

```typescript
const file = {
	buffer: fs.readFileSync("./my-image.png"), // or any Buffer
	originalname: "my-image.png",
	mimetype: "image/png"
}
const result = await storage.uploadBuffer(file)
console.log(result.url)
```

---

### 4. **Uploading via HTTP API (with Multer)**

If you're building an HTTP API (for example, with Express), you need a
middleware to handle file uploads from HTTP requests.  
[Multer](https://github.com/expressjs/multer) is the most popular middleware for
this in Node.js.

Here's an example of how to use **Multer** to upload files as buffers to this
library:

```typescript
import express from "express"
import multer from "multer"
import {CloudStorage} from "@sastatesla/cloud-storage-sdk"

const upload = multer({storage: multer.memoryStorage()})
const router = express.Router()
const storage = CloudStorage.init({
	/* ...your config... */
})

// Single file upload route
router.post("/upload", upload.single("file"), async (req, res) => {
	try {
		const {buffer, originalname, mimetype} = req.file
		const info = await storage.uploadBuffer({
			buffer,
			originalname,
			mimetype
		})
		res.json(info)
	} catch (err) {
		res.status(500).json({error: err.message})
	}
})

// Multiple files upload route
router.post("/upload-bulk", upload.array("files"), async (req, res) => {
	try {
		const files = req.files.map((f) => ({
			buffer: f.buffer,
			originalname: f.originalname,
			mimetype: f.mimetype
		}))
		const results = await storage.uploadBulkBuffer(files)
		res.json(results)
	} catch (err) {
		res.status(500).json({error: err.message})
	}
})

export default router
```

> **Note:**
>
> - `multer.memoryStorage()` stores uploads in memory as buffers, which is
>   required for `uploadBuffer` and `uploadBulkBuffer`.
> - You still do **not** need Multer for local or programmatic usage (just for
>   HTTP file uploads).

---

### 5. **Bulk Upload**

#### Bulk Upload from File Paths

```typescript
const results = await storage.uploadBulk(["./a.jpg", "./b.png"])
```

#### Bulk Upload from Buffers

```typescript
const files = [
  { buffer: ..., originalname: "a.jpg", mimetype: "image/jpeg" },
  { buffer: ..., originalname: "b.png", mimetype: "image/png" }
]
const results = await storage.uploadBulkBuffer(files)
```

---

### 6. **Delete a File**

```typescript
await storage.delete("file.jpg")
```

---

### 7. **Create a Folder**

```typescript
await storage.createFolder("my-folder")
```

#### Upload File to a Folder (Path or Buffer)

Create (if necessary) and upload a file to a folder:

```typescript
await storage.createFolder("docs")
const info = await storage.uploadToFolder("docs", "./file.pdf")
console.log(info.url) // .../docs/file.pdf
```

Upload buffer directly to a folder:

```typescript
const result = await storage.uploadBufferToFolder("images", file)
console.log(result.url) // .../images/my-image.png
```

---

### 8. **File Type Validation (Optional)**

- To **restrict uploads** to certain file types, pass the `allowedFileTypes`
  option (array of MIME types) when initializing.
- If not set, any file type is allowed.

---

## API

### `CloudStorage.init(config): CloudStorage`

**Config:**

| Option           | Type           | Description                                                 |
| ---------------- | -------------- | ----------------------------------------------------------- |
| provider         | string         | `"gcs"`, `"s3"`, `"do-spaces"` (more coming soon)           |
| config           | object         | Provider-specific config (see below)                        |
| allowedFileTypes | string[] (opt) | Allowed MIME types (e.g. `["image/png"]`). If omitted, any. |

#### **GCS Example Config**

```typescript
import fs from "fs"
import {CloudStorage} from "your-storage-package"

// Read and parse the credentials JSON file as an object
const gcsCredentials = JSON.parse(
	fs.readFileSync(process.env.GCS_CREDENTIALS_PATH!, "utf-8")
)

const storage = CloudStorage.init({
	provider: "gcs",
	config: {
		bucketName: process.env.GCS_BUCKET!,
		credentials: gcsCredentials
	},
	allowedFileTypes: ["image/jpeg", "image/png", "application/pdf"] // optional
})
```

#### AWS S3 Example Config

```typescript
import {CloudStorage} from "your-storage-package"

const storage = CloudStorage.init({
	provider: "s3",
	config: {
		region: process.env.AWS_REGION!,
		accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
		bucketName: process.env.S3_BUCKET!
	},
	allowedFileTypes: ["image/jpeg", "image/png", "application/pdf"]
})
```

#### DigitalOcean Spaces Example Config

```typescript
import {CloudStorage} from "your-storage-package"

const storage = CloudStorage.init({
	provider: "do-spaces",
	config: {
		region: "nyc3",
		endpoint: "nyc3.digitaloceanspaces.com",
		accessKeyId: process.env.DO_SPACES_KEY!,
		secretAccessKey: process.env.DO_SPACES_SECRET!,
		bucketName: process.env.DO_SPACES_BUCKET!
	},
	allowedFileTypes: ["image/jpeg", "image/png", "application/pdf"] // optional
})
```

---

### Instance Methods

| Method                 | Arguments                                              | Returns               | Description                                   |
| ---------------------- | ------------------------------------------------------ | --------------------- | --------------------------------------------- |
| `upload`               | filePath, options?                                     | `Promise<FileInfo>`   | Upload a single file from file path           |
| `uploadBulk`           | filePaths[], options?                                  | `Promise<FileInfo[]>` | Upload multiple files from file paths         |
| `uploadBuffer`         | {buffer, originalname, mimetype}, options?             | `Promise<FileInfo>`   | Upload a single file from an in-memory buffer |
| `uploadBulkBuffer`     | [{buffer, originalname, mimetype}], options?           | `Promise<FileInfo[]>` | Upload multiple files from in-memory buffers  |
| `uploadToFolder`       | folderName, filePath, options?                         | `Promise<FileInfo>`   | Upload a file path to a specific folder       |
| `uploadBufferToFolder` | folderName, {buffer, originalname, mimetype}, options? | `Promise<FileInfo>`   | Upload a buffer file to a specific folder     |
| `delete`               | fileId                                                 | `Promise<void>`       | Delete a file                                 |
| `deleteBulk`           | fileIds[]                                              | `Promise<void[]>`     | Delete multiple files                         |
| `createFolder`         | folderName                                             | `Promise<void>`       | Create a folder                               |

---

### FileInfo Type

```typescript
interface FileInfo {
	id: string // File identifier
	url: string // Public URL
	provider: string // e.g. "gcs"
	metadata?: any
}
```

---

## Error Handling

Errors thrown by the library are **instances of `StorageError`** (or built-in
`Error`).

```typescript
import {StorageError} from "@sastatesla/cloud-storage-sdk"

try {
	await storage.upload("./myfile.pdf")
} catch (err) {
	if (err instanceof StorageError) {
		console.error(err.message, err.code, err.details)
	} else {
		throw err
	}
}
```

---

## Environment Variables

You can manage per-env credentials using `.env`, `.env.dev`, `.env.prod` as
needed:

```
GCS_BUCKET=my-bucket
GCS_CREDENTIALS_PATH=./gcs-key.json
```

---

## FAQ

### Do I need Multer for this library?

**No for core usage!**  
File upload middleware (like Multer) is only needed in web servers (e.g.,
Express) to parse incoming files from HTTP requests as buffers.  
This library works directly with file paths or buffers.  
**If you are handling HTTP file uploads, you must use Multer (or similar) to
obtain the file buffer for use with `uploadBuffer` or `uploadBulkBuffer`.**

### Can I restrict uploads to certain file types?

**Yes!** Use the `allowedFileTypes` option with an array of MIME types.

### Can I use this with S3/Spaces/cloudinary/Other Providers?

Currently, GCS, S2 and Spaces is implemented as an example.  
Others will be added subsequently in newer version

---

## Contributing

PRs and issues welcome!

---

## License

MIT
