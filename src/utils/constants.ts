export const DEFAULT_OTP = 123456

export const VEHICLE_SLUGS = ["2-wheeler", "3-wheeler", "4-wheeler"]

export const DEFAULT_PHONE_NUMBERS = [
	"6666666666",
	"7777777777",
	"8888888888",
	"9999999999"
]

export const MESSAGE_TEMPLATE = {
	OTP: `Dear User, Your OTP for Agrictools app login is {OTP}. The OTP is valid for 5 minutes. Kashika Agritech Pvt Ltd`
}

export const DEFAULT_OTP_TEMPLATE_ID = "1007710438211609432"

export const DEFAULT_OTP_LENGTH = "6"

export const OTP_RESPONSE_SLUGS = {
	VERIFIED: "OTP Matched",
	INVALID: "OTP Not Matched",
	EXPIRED: "OTP Expired"
}

export const ALLOWED_MIMETYPES = [
	"image",
	"pdf",
	"doc",
	"spreadsheet",
	"audio",
	"video",
	"compressed",
	"code",
	"others"
]

export const S3_MIMETYPE = {
	// PDF Files
	pdf: ["application/pdf"],

	// Image Files
	image: [
		"image/jpeg", // JPEG
		"image/png", // PNG
		"image/gif", // GIF
		"image/bmp", // BMP
		"image/webp", // WebP
		"image/svg+xml", // SVG
		"image/tiff", // TIFF
		"image/vnd.microsoft.icon" // ICO
	],

	// Document Files
	doc: [
		"application/msword", // DOC
		"application/vnd.openxmlformats-officedocument.wordprocessingml.document", // DOCX
		"text/plain", // Plain Text
		"application/rtf", // RTF
		"application/vnd.oasis.opendocument.text" // ODT
	],

	// Spreadsheet Files
	spreadsheet: [
		"application/vnd.ms-excel", // XLS
		"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // XLSX
		"text/csv", // CSV
		"application/vnd.oasis.opendocument.spreadsheet" // ODS
	],

	// Audio Files
	audio: [
		"audio/mpeg", // MP3
		"audio/wav", // WAV
		"audio/ogg", // OGG
		"audio/aac", // AAC
		"audio/midi", // MIDI
		"audio/webm" // WebM Audio
	],

	// Video Files
	video: [
		"video/mp4", // MP4
		"video/x-msvideo", // AVI
		"video/webm", // WebM
		"video/mpeg", // MPEG
		"video/3gpp" // 3GP
	],

	// Compressed Files
	compressed: [
		"application/zip", // ZIP
		"application/gzip", // GZIP
		"application/x-tar", // TAR
		"application/x-7z-compressed" // 7-Zip
	],

	// Code/Programming Files
	code: [
		"application/javascript", // JavaScript
		"application/json", // JSON
		"text/html", // HTML
		"text/css", // CSS
		"application/xml" // XML
	],

	// Other Files
	others: [
		"application/octet-stream" // Binary files or unknown MIME type
	]
}

export const KYC_STATUS = {
	PENDING: "pending",
	APPROVED: "approved",
	REJECTED: "rejected"
}
