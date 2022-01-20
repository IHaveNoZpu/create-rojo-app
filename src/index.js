#!/usr/bin/env node

// Imports \\
const { Command } = require("commander")

const { initProject } = require("./core.js")
const packageJson = require("../package.json")

// Init Program \\
const program = new Command(packageJson.name)
	.version(packageJson.version, "-v", "Show the current version")
	.description("Create Rojo apps with one command")
	.action(() => {
		initProject()
	});

// Program Options \\
program
	.option("-ng, --nogit", "Will not init git");

// Run Program \\
program.parse(process.argv)