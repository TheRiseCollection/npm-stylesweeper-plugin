# styleSweeper

[![npm version](https://img.shields.io/npm/v/stylesweeper.svg)](https://www.npmjs.com/package/stylesweeper)
[![npm downloads](https://img.shields.io/npm/dm/stylesweeper.svg)](https://www.npmjs.com/package/stylesweeper)
[![GitHub](https://img.shields.io/badge/github-stylesweeper--plugin-black)](https://github.com/TheRiseCollection/stylesweeper-plugin)

`styleSweeper` is a CLI tool that detects inline styles in your project files. It scans files like `.html`, `.jsx`, and `.tsx` for inline `style` attributes or basic CSS‑in‑JS style patterns, helping you keep styles in external stylesheets or shared style modules for a cleaner, more maintainable codebase.

Learn more on the styleSweeper portfolio page in THE RISE COLLECTION:  
[https://www.therisecollection.co/portfolio/stylesweeper](https://www.therisecollection.co/portfolio/stylesweeper)

## Features

- **Sweep command**: Detects inline styles in your project directory with the `sweep start` command.
- **Detailed output**: Shows file names, line numbers, and matching inline style code.
- **Simple CLI**: Lightweight and easy to integrate into any workflow.

## Installation

Install `stylesweeper` globally via npm:

```bash
npm install -g stylesweeper
```

## Usage

From the root of your project:

```bash
sweep start
```

This will:

- Scan `**/*.{html,jsx,tsx}` in the current directory
- Ignore common build and dependency folders like `node_modules` and `dist`
- Print any detected inline styles, including:
  - The file path
  - The line number
  - The full line of code
  - The matching `style` snippet(s)

### Example output

```text
Sweeping for inline styles...

Inline styles found in src/components/Button.jsx:12
<button style={{ color: 'red', padding: 8 }}>Click me</button>
Matches: style={{ color: 'red', padding: 8 }}
```

If no inline styles are found:

```text
Sweeping for inline styles...
No inline styles detected!
```

## When to use styleSweeper

Use `styleSweeper` when you want to:

- Enforce a **“no inline styles”** rule in your projects
- Gradually migrate inline styles into CSS modules, Tailwind, or design system components
- Quickly audit a new or legacy codebase for inline styling practices

## Development

```
npm install
node index.js               # run against the current directory
npm test                    # node test.js
```

`tmp-test/` is scratch for the test run and is not tracked. Run the tool against a
real project before publishing: the failure that matters is a false positive, because
a tool that reports a used class as dead gets used exactly once.

## Decisions of record

* **It reports; it does not delete.** styleSweeper prints what looks unused and stops
  there. Static analysis cannot see a class name built at runtime from a template
  string, so anything that deleted automatically would eventually delete something
  live — and silently.

* **`glob` and nothing heavier.** No PostCSS pipeline, no AST parse of the whole
  project. The tool stays fast enough to run on every commit, which is what makes it
  worth running at all.

* **A finding is a question, not a verdict.** The output is a starting list for a
  human, which is why the README leads with when *not* to trust it.

## License

ISC © Joshua Paulsen / THE RISE COLLECTION
