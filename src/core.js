// Imports \\
import sym from "log-symbols"
import chalk from "chalk"
import fs from "node:fs"
import ora from "ora"
import { resolve } from "path"
import grape from "./utils/grape.js"
import utils from "./utils/utils.js"

// Main \\
export default class Core {
	constructor(name, args, templatePath) {
		this.name = name || "app"
		this.args = args
		this.projectPath = args.dir ? resolve(process.cwd(), args.dir) : resolve(process.cwd(), this.name)
		this.templatePath = templatePath
		this.clear = !!args.clear
		this.utils = utils
	}

	// Functions \\
	initGit(errText) {
		const commands = [
			`cd ${this.projectPath} && git init`,
			`cd ${this.projectPath} && git add .`
		]

		this.utils.runCommands(commands, errText)
	}

	installPackages(errText) {
		const commands = [
			`cd ${this.projectPath} && foreman install`,
			`cd ${this.projectPath} && wally install`
		]

		this.utils.runCommands(commands, errText)
	}

	async changeName() {
		const wallyConfig = resolve(this.projectPath, "wally.toml")
		const foremanConfig = resolve(this.projectPath, "default.project.json")

		await grape.readFile(wallyConfig, "utf8")
			.then(async (data) => {
				const res = data.replace(/templateName/g, `sora/${this.name}`)

				await grape.writeFile(wallyConfig, res)
			})
			.catch((err) => {
				return console.error(sym.error, chalk.redBright(`[ERROR] >> ${err}`))
			})

		await grape.readFile(foremanConfig, "utf8")
			.then(async (data) => {
				const res = data.replace(/templateName/g, this.name)

				await grape.writeFile(foremanConfig, res)
			})
			.catch((err) => {
				return console.error(sym.error, chalk.redBright(`[ERROR] >> ${err}`))
			})
	}

	async initProject() {
		if (this.clear) {
			console.warn(sym.warning, chalk.yellowBright("[WARNING] >> You have used --clear, it will clear directory if it already exist"))
			const con = await this.utils.askForCon()
			if (!con)
				return
		}

		if (!fs.existsSync(this.projectPath))
			fs.mkdirSync(this.projectPath)
		if (fs.readdirSync(this.projectPath).length !== 0) {
			if (!this.clear) {
				const con = await this.utils.askForCon("We have found that folder is alrady exists.", "Would you like to continute without clear the dir? [Yes/No]")
				if (!con)
					return
			} else {
				// const con = await this.askForCon("We have found that folder is alrady exists.", "Would you like to continute with clear the dir? [Yes/No]")
				// if (!con)
				// 	return

				const loader = ora(chalk.cyanBright("Clearing Directory...")).start()
				await grape.remove(this.projectPath);
				loader.succeed(chalk.cyanBright("Directory cleared!"))
			}
		}

		try {
			const loader = ora(chalk.cyanBright("Coping files...")).start()
			await grape.copy(this.templatePath, this.projectPath)
			await this.changeName()
			loader.succeed(chalk.cyanBright("Finished coping files!"))

			if (!this.args.noWally) {
				const loader = ora(chalk.cyanBright("Installing Packages...\n")).start()
				this.installPackages("Failed to install packages")
				loader.succeed(chalk.cyanBright("Installed Packages!"))
			}

			if (!this.args.noGit) {
				const loader = ora(chalk.cyanBright("Initializing Git Repo...\n")).start()
				this.initGit("Failed to initialize git repo")
				loader.succeed(chalk.cyanBright("Initialized Git Repo!"))
			}

			console.log([
				"",
				`Success! Created ${this.name} at ${this.projectPath}`,
				"",
				"To stating rojo server type below command",
				"",
				`${chalk.cyan("cd")} ${resolve(process.cwd(), this.name)}`,
				`${chalk.cyan("rojo serve")}`,
				"",
				"Join Discord server for support: https://discord.gg/mteJJrEFhj"
			].join("\n"))

		} catch(err) {
			return console.error(sym.error, chalk.redBright(err))
		}
	}
}