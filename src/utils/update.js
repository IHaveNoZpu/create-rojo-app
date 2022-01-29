// Imports \\
import fetch from "node-fetch"
import fs from "fs"
import ora from "ora"
import chalk from "chalk"
import { dirname, resolve } from "path"
import { fileURLToPath } from "node:url"
import utils from "./utils.js"

const __dirname = dirname(dirname(fileURLToPath(import.meta.url)));

// Variable \\
const packageJson = JSON.parse(fs.readFileSync(resolve(__dirname, "..", "package.json")))

// Functions \\
async function updateSora() {
	const con =  await utils.askForCon("New version of sora is out", "would you like to update? [Yes/No]")
	if (!con)
		return
	const loader = ora(chalk.cyanBright("Updating Sora...\n")).start()
	utils.runCommands(["npm install create-rojo-app -g"])
	loader.succeed(chalk.cyanBright("Updated Sora!"))
}

async function checkForUpdate() {
	const res = await fetch("https://registry.npmjs.org/create-rojo-app/")
	const data = await res.json();
	return data["dist-tags"]["latest"] == packageJson.version
}

// Exports \\
export default {
	checkForUpdate,
	updateSora
}