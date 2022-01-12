// Imports \\
const fs = require("fs-extra")
const path = require("path")
const { prompt } = require("inquirer")

// Variable \\
const TemplateFolder = path.resolve(__dirname, "..", "template")
const KnitTemplateFolder = path.resolve(TemplateFolder, "knit")
const NormalTemplateFolder = path.resolve(TemplateFolder, "normal")

// Functions \\
function initProject(template) {
	let questions = [
		{
			type: "input",
			name: "name",
			message: "Enter project name",
		}
		
	]
	let newQuestion

	if (template == "default") {
		let bQuestions = [
			{
				type: "list",
				name: "gf",
				message: "Select game framework",
				choices: [
					"Knit",
					"No Game Framework"
				],
			}
		]

		newQuestion = [...questions, ...bQuestions]
	}

	prompt(newQuestion).then(async (ans) => {
		const projectName = ans.name || "Template"
		const gameFramework = ans.gf || "No Game Framework"

		const projectPath = path.resolve(process.cwd(), projectName)

		const existsPath = await fs.pathExists(projectPath)
		let x

		console.log("Creating a New Rojo App")

		if (existsPath) {
			newQuestion = [
				{
					type: "input",
					name: "x",
					message: "We have found that folder is already exists. Would you like to continute [Yes/No]",
					validate(value) {
						const lowerCase = value.toLowerCase()

						if (lowerCase == "y" || lowerCase == "n" || lowerCase == "yes" || lowerCase == "no") {
							return true
						}

						return "Please enter a valid answer [Yes/No]"
					}
				}
			]

			await prompt(newQuestion).then(nAns => {
				if (nAns.x.toLowerCase() == "no" || nAns.x.toLowerCase() == "n") {
					x = false
				} else {
					x = true
				}
			})
		} else {
			x = true
		}

		if (x) {
			await fs.ensureDir(projectPath)
				.then(async () => {
					if (gameFramework == "Knit") {
						console.log("Coping Files...")
						await fs.readdir(KnitTemplateFolder, async(err, files) => {
							if (err)
								return console.error(err.message)

							for (const file of files) {
								await fs.copy(`${KnitTemplateFolder}/${file}`, `${projectPath}/${file}`)
							}
						})
						console.log("Finished Coping Files!")
					} else if (gameFramework == "No Game Framework") {
						console.log("Coping Files...")
						await fs.readdir(NormalTemplateFolder, async(err, files) => {
							if (err)
								return console.error(err.message)

							for (const file of files) {
								await fs.copy(`${NormalTemplateFolder}/${file}`, `${projectPath}/${file}`)
							}
						})
						console.log("Finished Coping Files!")
					}

				})
				.catch((err) => {
					console.error(err)
				})

				console.log("Created! a New Rojo App")
				console.log("\nNow You can run this command\n")
				console.log(`cd ${projectName}`)
				console.log(`foreman install`)
				console.log(`wally install`)
				console.log("\nNow You let start a rojo server\n")
				console.log(`rojo serve\n`)
		}
	})
}

module.exports = initProject