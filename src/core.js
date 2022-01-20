// Imports \\
const fs = require("fs")
const grape = require("fs/promises")
const path = require("path")
const ora = require("ora")
const sym = require("log-symbols")
const chalk = require("chalk")
const { prompt } = require("inquirer")
const { execSync } = require("child_process")

// Variable \\
const TemplateFolder = path.resolve(__dirname, "..", "template")

// Functions \\
function initGit(projectPath) {
	const commands = [
		"git init",
		"git add .",
		"git commit -m \"Init Project\""
	]

	for (const cmd of commands) {
		try {
			execSync(`cd ${projectPath} && ${cmd}`)
		} catch(err) {
			console.error(sym.error, chalk.redBright(`Failed to initialize git repo, ${err}`))
		}
	}
}

function installPackages(projectPath) {
	const commands = [
		"foreman install",
		"wally install"
	]

	for (const cmd of commands) {
		try {
			execSync(`cd ${projectPath} && ${cmd}`)
		} catch(err) {
			console.error(sym.error, chalk.redBright(`Failed to install packages, ${err}`))
		}
	}
}

function initProject(opt) {
	let questions = [
		{
			type: "input",
			name: "name",
			message: "Enter project name",
		},
		{
			type: "list",
			name: "gt",
			message: "Select project template",
			choices: [
				"Knit",
				"Normal"
			],
		}
	]

	prompt(questions).then(async (ans) => {
		const projectName = ans.name || "Template"
		const gameTemplate = ans.gt

		const projectPath = path.resolve(process.cwd(), projectName)
		const existsPath = fs.existsSync(projectPath)

		let con = existsPath ? await askForCon("We have found that folder is alrady exists.") : true

		if (con) {
			const templateFolder = path.resolve(TemplateFolder, gameTemplate.toLowerCase())

			try {
				const copyFileLoader = ora(chalk.cyanBright("Coping files...")).start()
				await copy(templateFolder, projectPath)
				copyFileLoader.succeed(chalk.cyanBright("Finished coping files!"))
				if (!opt.nogit) {
					const gitInitLoader = ora(chalk.cyanBright("Initializing git repo...")).start()
					initGit(projectPath)
					gitInitLoader.succeed(chalk.cyanBright("Initialized git repo!"))
				} else {
					console.log(sym.warning, chalk.yellowBright("You have used --nogit, Git will not init."))
				}
				if (!opt.noinstall) {
					const installLoader = ora(chalk.cyanBright("Installing packages...\n")).start()
					installPackages(projectPath)
					installLoader.succeed(chalk.cyanBright("Installed packages!"))
				} else {
					console.log(sym.warning, chalk.yellowBright("You have used --noinstall, You have to install packages your self."))
				}

				console.log([
						`Success! Created ${projectName} at ${projectPath}`,
						"",
						"To stating rojo server type below command",
						"",
						`${chalk.cyan("cd")} ${path.join(process.cwd(), projectName)}`,
						`${chalk.cyan("rojo serve")}`,
						"",
						"Join Discord server for support: https://discord.gg/mteJJrEFhj"
					].join("\n"))
			} catch(err) {
				return console.error(sym.error, chalk.redBright(err))
			}
		}
	})
}

async function copy(from, to) {
	const files = await grape.readdir(from, { withFileTypes: true })
	const existsPath = fs.existsSync(to)
	if (!existsPath) fs.mkdirSync(to)
	for (const file of files) {
		const fromPath = path.join(from, file.name)
		const toPath = path.join(to, file.name)
		if (file.isDirectory()) {
			await copy(fromPath, toPath)
		} else {
			await grape.copyFile(fromPath, toPath)
		}
	}
}	

async function askForCon(text) {
	let res

	const question = [
		{
			type: "input",
			name: "x",
			message: (chalk.yellowBright(`${text} Would you like to continute [Yes/No]`)),
			validate(val) {
				const lower = val.toLowerCase()

				if (lower == "y" || lower == "n" || lower == "yes" || lower == "no") {
					return true
				}

				return "Please ennter a valid answer [Yes/No]"
			}
		}
	]

	await prompt(question).then(ans => {
		const lower = ans.x.toLowerCase()

		if (lower == "n" || lower == "no") {
			res = false
		} else {
			res = true
		}
	})

	return res
}

// Exports \\
module.exports = {
	initProject
}