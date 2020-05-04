#!/usr/bin/env node

import chalk from "chalk";
import clear from "clear";
import figlet from "figlet";
import path from "path";
import program from "commander";

clear();
console.log(
  chalk.green(
    figlet.textSync("Dungeons&Dragons CLI", { horizontalLayout: "full" })
  )
);

program.version("1.0.0").description("CLI for playing Dungeons and Dragons");
program.outputHelp();
