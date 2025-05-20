# CloudStorage - Universal Cloud Storage Wrapper

A plug-and-play, class-based TypeScript library to interact with multiple cloud
storage providers (GCS, S3, Cloudinary, etc.) using a unified, extensible
interface.

---

## Features

- 🔌 **Plug-and-play:** Easily swap cloud providers via configuration.
- 🔒 **Optional file type validation:** Restrict uploads to allowed MIME types.
- 🧑‍💻 **Object-oriented:** Clean, class-based structure for easy extension.
- 💪 **Strongly-typed:** TypeScript-first with clear interfaces.
- 🎛 **Provider-agnostic:** Add your own providers by extending the base class.
- ❌ **No web dependencies:** No Express/Multer required; works in any Node.js
  environment.

---

## Installation

```bash
npm install your-storage-package
# or
yarn add your-storage-package
```

---

## Usage

### 1. **Setup Configuration**

```typescript
import {CloudStorage} from "your-storage-package"

// Example for Google Cloud Storage (GCS)
const storage = CloudStorage.init({
	provider: "gcs",
	config: {
		bucketName: process.env.GCS_BUCKET,
		credentials: require(process.env.GCS_CREDENTIALS_PATH)
	},
	allowedFileTypes: ["image/jpeg", "image/png", "application/pdf"] // (Optional)
})
```

---

### 2. **Uploading a File**

```typescript
const result = await storage.upload("./path/to/file.jpg")
console.log(result.url) // File public URL
```

---

### 3. **Bulk Upload**

```typescript
const results = await storage.uploadBulk(["./a.jpg", "./b.png"])
```

---

### 4. **Delete a File**

```typescript
await storage.delete("file.jpg")
```

---

### 5. **Create a Folder**

```typescript
await storage.createFolder("my-folder")
```

### Upload File to a Folder

Create (if necessary) and upload a file to a folder:

```typescript
await storage.createFolder("docs")
const info = await storage.uploadToFolder("docs", "./file.pdf")
console.log(info.url) // .../docs/file.pdf
```

---

### 6. **File Type Validation (Optional)**

- To **restrict uploads** to certain file types, pass the `allowedFileTypes`
  option (array of MIME types) when initializing.
- If not set, any file type is allowed.

---

## API

### `CloudStorage.init(config): CloudStorage`

**Config:**

| Option           | Type           | Description                                                 |
| ---------------- | -------------- | ----------------------------------------------------------- |
| provider         | string         | `"gcs"`, `"s3"`, `"cloudinary"` (more coming soon)          |
| config           | object         | Provider-specific config (see below)                        |
| allowedFileTypes | string[] (opt) | Allowed MIME types (e.g. `["image/png"]`). If omitted, any. |

#### **GCS Example Config**

```typescript
{
  bucketName: "your-bucket",
  credentials: require("./gcs-key.json"),
}
```

---

### Instance Methods

| Method         | Arguments             | Returns               | Description           |
| -------------- | --------------------- | --------------------- | --------------------- |
| `upload`       | filePath, options?    | `Promise<FileInfo>`   | Upload a single file  |
| `uploadBulk`   | filePaths[], options? | `Promise<FileInfo[]>` | Upload multiple files |
| `delete`       | fileId                | `Promise<void>`       | Delete a file         |
| `deleteBulk`   | fileIds[]             | `Promise<void[]>`     | Delete multiple files |
| `createFolder` | folderName            | `Promise<void>`       | Create a folder       |

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
import {StorageError} from "your-storage-package"

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

**No!** File upload middleware (like Multer) is only needed in web servers
(e.g., Express) to parse incoming files from HTTP requests.  
This library works with file paths or buffers, not HTTP requests.

### Can I restrict uploads to certain file types?

**Yes!** Use the `allowedFileTypes` option with an array of MIME types.

### Can I use this with S3/Cloudinary/Other Providers?

Currently, only GCS is implemented as an example.  
To add more providers, extend the `StorageProvider` class and update the factory
in `CloudStorage`.

---

## Extending

To add a new provider:

1. Create a new class in `src/providers/` extending `StorageProvider`.
2. Implement all abstract methods.
3. Update the factory in `CloudStorage.ts` to include your new provider.

---

## Contributing

PRs and issues welcome!

---

## License

MIT
