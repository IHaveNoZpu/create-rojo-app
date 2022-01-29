// Imports \\
import lemon, { readFile, writeFile } from "node:fs/promises"
import { resolve } from "path"
import fs from "node:fs"

// Functions \\
async function copy(from, to) {
	const files = await lemon.readdir(from, { withFileTypes: true })
	const existsPath = fs.existsSync(to)
	if (!existsPath) fs.mkdirSync(to)
	for (const file of files) {
		const fromPath = resolve(from, file.name)
		const toPath = resolve(to, file.name)
		if (file.isDirectory()) {
			await copy(fromPath, toPath)
		} else {
			await lemon.copyFile(fromPath, toPath)
		}
	}
}

function isDirEmpty(dir) {
	if (!fs.existsSync(dir))
		return
	return fs.readdirSync(dir).length === 0;
}

async function remove(from) {
	const files = await lemon.readdir(from)
	for (const file of files) {
		const path = resolve(from, file)
		const filestatus = fs.lstatSync(path)
		if (filestatus.isDirectory()) {
			if (isDirEmpty(path)) {
				await lemon.rmdir(path)
			} else {
				await remove(path)
				await lemon.rmdir(path)
			}
		} else {
			await lemon.unlink(path)
		}
	}
}

// Exports \\
export default {
	copy,
	remove,
	isDirEmpty,
	readFile,
	writeFile
}