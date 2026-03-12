#!/usr/bin/env node
const { program } = require('commander');
const glob = require('glob');
const fs = require('fs').promises;
const chalk = require('chalk');

const INLINE_STYLE_REGEX = /style=["'{][^"'}]+["'}]|style={{[^}}]+}}/g;
const DEFAULT_GLOB_PATTERN = '**/*.{html,jsx,tsx}';
const DEFAULT_IGNORE = ['node_modules/**', 'dist/**'];

function getTargetFiles(pattern = DEFAULT_GLOB_PATTERN, ignore = DEFAULT_IGNORE) {
  return glob.sync(pattern, { ignore });
}

async function scanFileForInlineStyles(filePath, inlineStyleRegex = INLINE_STYLE_REGEX) {
  const content = await fs.readFile(filePath, 'utf8');
  const lines = content.split('\n');
  const matchesForFile = [];

  lines.forEach((line, index) => {
    const matches = line.match(inlineStyleRegex);
    if (matches) {
      matchesForFile.push({
        filePath,
        lineNumber: index + 1,
        lineText: line.trim(),
        matches,
      });
    }
  });

  return matchesForFile;
}

async function sweepDirectory() {
  try {
    console.log(chalk.blue('Sweeping for inline styles...'));

    const files = getTargetFiles();

    if (files.length === 0) {
      console.log(chalk.yellow('No files found to sweep.'));
      return;
    }

    let hasInlineStyles = false;

    for (const file of files) {
      try {
        const matchesForFile = await scanFileForInlineStyles(file);

        matchesForFile.forEach(({ filePath, lineNumber, lineText, matches }) => {
          hasInlineStyles = true;
          console.log(chalk.red(`\nInline styles found in ${filePath}:${lineNumber}`));
          console.log(chalk.gray(lineText));
          console.log(chalk.yellow(`Matches: ${matches.join(', ')}`));
        });
      } catch (fileError) {
        console.error(chalk.red(`Error reading file ${file}:`), fileError.message);
      }
    }

    if (!hasInlineStyles) {
      console.log(chalk.green('No inline styles detected!'));
    }
  } catch (error) {
    console.error(chalk.red('Error sweeping directory:'), error.message);
  }
}

module.exports = {
  INLINE_STYLE_REGEX,
  getTargetFiles,
  scanFileForInlineStyles,
  sweepDirectory,
};

// Set up CLI command
program
  .command('start')
  .description('Sweep the current directory for inline styles')
  .action(sweepDirectory);

if (require.main === module) {
  program.parse(process.argv);

  // Show help if no command is provided
  if (!process.argv.slice(2).length) {
    program.outputHelp();
  }
}