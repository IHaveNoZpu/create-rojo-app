// Imports \\
import { execSync } from "node:child_process"
import inquirer from "inquirer"
import chalk from "chalk"
import sym from "log-symbols"

// Functions \
function runCommands(commandList, errText) {
	for (const cmd of commandList) {
		try {
			execSync(cmd)
		} catch(err) {
			console.error(sym.error, chalk.redBright(`${errText}, ${err}`))
		}
	}
}

async function askForCon(text = "", textB = "Would you like to continute [Yes/No]") {
	const promptQuestion = {
		type: "input",
		name: "continute",
		message: (chalk.yellowBright(`${text} ${textB}`)),
		validate(val) {
			const lower = val.toLowerCase()

			if (lower == "y" || lower == "n" || lower == "yes" || lower == "no") {
				return true
			}

			return "Please enter a valid answer [Yes/No]"
		}
	}

	const { continute } = await inquirer.prompt(promptQuestion)
	const lower = continute.toLowerCase()

	return lower == "yes" || lower == "y"
}

// Exports \\
export default {
	askForCon,
	runCommands
}