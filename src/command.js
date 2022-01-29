#!/usr/bin/env node

// Imports \\
import yargs from "yargs"
import { hideBin } from "yargs/helpers"
import commmandHandle from "./commandHandle.js"

// Create App \\
const app = yargs(hideBin(process.argv))
	.alias("h", "help")
	.alias("v", "version")
	.alias("c", "create")
	.alias("ng", "noGit")
	.alias("nw", "noWally")
	.help(false)
	.version(false)
	.argv;

commmandHandle(app)