// Imports \\
import chalk from "chalk"
import fs from "node:fs"
import { dirname, resolve } from "path"
import { fileURLToPath } from "node:url"
import inquirer from "inquirer"
import Core from "./core.js"
import update from "./utils/update.js"

const __dirname = dirname(dirname(fileURLToPath(import.meta.url)));

// Variable \\
const packageJson = JSON.parse(fs.readFileSync(resolve(__dirname, "package.json")))

// Functions \\
function showHelp() {
	const help = [
		chalk.cyanBright("Sora"),
		chalk.cyanBright(`v${packageJson.version}`),
		"",
		chalk.whiteBright("Options: "),
		`	${chalk.cyanBright("--help")}		: Shows help menu`,
		` 	${chalk.cyanBright("--version")}	: Shows Sora version`,
		` 	${chalk.cyanBright("--create")} 	: Create a new project`,
		"",
		chalk.whiteBright("Suboptions: "),
		`	${chalk.cyanBright("--noGit")} 	: Will not initialize git`,
		` 	${chalk.cyanBright("--noWally")} 	: Will not install wally packages`,
		` 	${chalk.cyanBright("--dir")} 		: Custom directory`,
		` 	${chalk.cyanBright("--clear")} 	: Will clear the directory when there is already have exist directory.`
	]

	return console.log(help.join("\n"))
}

async function prompt() {
	const promptList = {
		name : {
			type: "input",
			name: "name",
			message: "Enter project name:",
		},
		template: {
			type: "list",
			name: "template",
			message: "Select your project template:",
			choices: [
				"Knit",
				"Normal"
			]
		},
	}

	const { name, template } = await inquirer.prompt([
		promptList.name,
		promptList.template
	])

	return { name, template }
}

async function initProject(args) {
	const { name, template } = await prompt()
	const templatePath = resolve(__dirname, "template", template.toLowerCase())
	if (!fs.existsSync(templatePath))
		return console.error(chalk.redBright("[ERROR] >> Can't find template folder!"))

	const core = new Core(name, args, templatePath)
	core.initProject()
}

async function commmandHandle(args) {
	if (!await update.checkForUpdate()) {
		await update.updateSora()
	}
	if (args.help)
		showHelp()
	else if (args.version)
		console.log(chalk.whiteBright(`v${packageJson.version}`))
	else if (args.create)
		await initProject(args)
	else
		await initProject(args)
}

// Exports \\
export default commmandHandle