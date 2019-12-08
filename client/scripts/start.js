#!/usr/bin/env node

// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = "development";
process.env.NODE_ENV = "development";

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on("unhandledRejection", err => {
  throw err;
});

// Ensure environment variables are read.
require("react-scripts/config/env");

const fs = require("fs-extra");
const chalk = require("react-dev-utils/chalk");
const webpack = require("webpack");
const checkRequiredFiles = require("react-dev-utils/checkRequiredFiles");
const formatWebpackMessages = require("react-dev-utils/formatWebpackMessages");
const paths = require("react-scripts/config/paths");
const configFactory = require("react-scripts/config/webpack.config");

// Warn and crash if required files are missing
if (!checkRequiredFiles([paths.appHtml, paths.appIndexJs])) {
  process.exit(1);
}

const configDevelopment = configFactory("development");
const configProduction = configFactory("production");
const config = configDevelopment;
config.entry = configProduction.entry;
config.output.path = configProduction.output.path;
config.plugins = config.plugins.filter(
  p => p.constructor.name !== "HotModuleReplacementPlugin"
);

fs.emptyDirSync(paths.appBuild);
const compiler = webpack(config);
compiler.watch({ ignored: [paths.appNodeModules] }, (err, stats) => {
  let messages;
  if (err) {
    let errMessage = err.message;

    messages = formatWebpackMessages({
      errors: [errMessage],
      warnings: []
    });
  } else {
    messages = formatWebpackMessages(
      stats.toJson({ all: false, warnings: true, errors: true })
    );
  }
  if (messages.errors.length) {
    // Only keep the first error. Others are often indicative
    // of the same problem, but confuse the reader with noise.
    if (messages.errors.length > 1) {
      messages.errors.length = 1;
    }
    console.log(chalk.red(messages.errors.join("\n\n")));
    return;
  } else if (messages.warnings.length) {
    console.log(
      chalk.yellow(
        `Compilation completed with warnings:\n${messages.warnings.join(
          "\n\n"
        )}`
      )
    );
  } else {
    console.log(
      chalk.green(
        `Compilation completed in ${(stats.endTime - stats.startTime) / 1000}s`
      )
    );
  }

  copyPublicFolder();
});

function copyPublicFolder() {
  fs.copySync(paths.appPublic, paths.appBuild, {
    dereference: true,
    filter: file => file !== paths.appHtml
  });
}
