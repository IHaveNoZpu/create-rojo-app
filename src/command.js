#!/usr/bin/env node

// Imports \\
import { Command } from "commander"
import fs from "node:fs"
import ora from "ora"
import { dirname, resolve } from "path"
import { fileURLToPath } from "node:url"

// Variable \\
const __dirname = dirname(dirname(fileURLToPath(import.meta.url)))

import initProject from "./core.js"
const packageJson = JSON.parse(fs.readFileSync(resolve(__dirname, "package.json")))

// Init Program \\
const program = new Command(packageJson.name)
	.version(packageJson.version, "-v", "Show the current version")
	.description("Create Rojo apps with one command")
	.action(() => {
		initProject(program.opts())
	});

// Program Options \\
program
	.option("-ng, --nogit", "Will not init git repository")
	.option("-ni, --noinstall", "Will not install wally packages for you");

// Run Program \\
program.parse(process.argv)