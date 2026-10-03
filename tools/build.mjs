// Bundle the game (dist/game.js), marked with the commit it was built on
// ("+": with changes to src/ not committed yet); the benchmark reports it,
// so that a measurement can be told apart from one of an older version.
import { execSync } from 'node:child_process';
import { build } from 'esbuild';

const git = (args) => execSync(`git ${args}`, { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
let commit = 'unknown';
try {
  commit = git('rev-parse --short HEAD') + (git('status --porcelain --untracked-files=no -- src') ? '+' : '');
} catch {
  // not a git checkout
}

await build({
  entryPoints: ['src/main.js'],
  bundle: true,
  minify: true,
  format: 'iife',
  target: 'es2020',
  outfile: 'dist/game.js',
  define: { __BUILD__: JSON.stringify(commit) },
  logLevel: 'info',
});
