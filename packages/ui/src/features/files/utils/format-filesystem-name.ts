// TODO: this is mostly just a placeholder for now.
// We need to implement this robustly. Look into css truncation.
import type {FileSystemItem} from '@/features/files/types'

// Formats file/folder names for display, including truncation
export function formatItemName({name, maxLength = 30}: {name: FileSystemItem['name']; maxLength?: number}) {
	// For files, handle name and extension separately
	const {name: fileName, extension} = splitFileName(name)

	const truncatedName = truncateName(fileName, maxLength)
	return extension ? `${truncatedName}${extension}` : truncatedName
}

// Splits a filename into its name and extension parts
// Example: "document.pdf" -> { name: "document", extension: ".pdf" }
// Handles edge cases:
// - Hidden files (.gitignore) -> { name: ".gitignore", extension: null }
// - Multiple dots (file.name.txt) -> { name: "file.name", extension: ".txt" }
// - No extension (README) -> { name: "README", extension: null }
// - .tar.* extensions (file.tar.gz, file.tar.bz2, etc) -> { name: "file", extension: ".tar.gz" }
export function splitFileName(fileName: string): {name: string; extension: string | null} {
	// Handle .tar.* compound extensions first
	const compoundMatch = fileName.match(/^(.+?)(\.tar\.[^./]+)$/)
	if (compoundMatch) {
		const [, name, extension] = compoundMatch
		return {name, extension}
	}

	// Handle regular files
	const matches = fileName.match(/^([^/]*?)(?:(\.[^./]+))?$/)

	if (!matches) {
		return {name: fileName, extension: null}
	}

	const [, name, extension] = matches
	return {
		name,
		extension: extension || null,
	}
}

// Truncates a name while preserving meaningful parts
// Example: "very-long-document-name" -> "very-long...name"
function truncateName(name: string, maxLength: number): string {
	if (name.length <= maxLength) return name

	const startLength = Math.ceil(maxLength * 0.6) // Keep more characters at start
	const endLength = Math.floor(maxLength * 0.3) // Keep fewer at end

	const start = name.slice(0, startLength)
	const end = name.slice(-endLength)

	return `${start}...${end}`
}
