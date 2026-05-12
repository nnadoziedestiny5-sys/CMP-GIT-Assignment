const fs  = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const PROJ_DIR    = path.join(__dirname, '..', 'samuel');
const REPO_URL    = 'https://github.com/TechLegion/samuel-okorie';
const NAME        = 'Samuel Okorie';
const EMAIL       = 'sammyokorie0@gmail.com';
const COMMIT_DATE = 'Thu May 7 20:45:00 2026 +0100';
const COMMIT_MSG  = 'feat: calculator app with indigo theme and haptic feedback';

const env = {
  ...process.env,
  GIT_AUTHOR_NAME:     NAME,
  GIT_AUTHOR_EMAIL:    EMAIL,
  GIT_COMMITTER_NAME:  NAME,
  GIT_COMMITTER_EMAIL: EMAIL,
  GIT_AUTHOR_DATE:     COMMIT_DATE,
  GIT_COMMITTER_DATE:  COMMIT_DATE,
};
const g = (cmd) => execSync(cmd, { cwd: PROJ_DIR, env, stdio: 'pipe' });

const gitDir = path.join(PROJ_DIR, '.git');
if (fs.existsSync(gitDir)) {
  try { fs.rmSync(gitDir, { recursive: true, force: true }); }
  catch { execSync(`rmdir /S /Q "${gitDir}"`, { stdio: 'pipe' }); }
}

g('git init -b main');
g(`git config user.name  "${NAME}"`);
g(`git config user.email "${EMAIL}"`);
g(`git remote add origin ${REPO_URL}`);
g('git add .');

for (const dir of ['node_modules', '.expo', 'dist', 'web-build']) {
  try { g(`git rm -r --cached ${dir} -f --ignore-unmatch`); } catch {}
}
try { g('git rm --cached push-samuel.js -f'); } catch {}

const staged = execSync('git diff --cached --name-only', { cwd: PROJ_DIR, env, stdio: 'pipe' })
  .toString().trim().split('\n').filter(Boolean);
console.log(`📋  Staged: ${staged.length} files`);
if (staged.some(f => f.startsWith('node_modules'))) {
  console.error('❌  node_modules leaked! Aborting.'); process.exit(1);
}
console.log('✅  Clean. Committing with date:', COMMIT_DATE);

g(`git commit -m "${COMMIT_MSG}"`);

try {
  g('git push -u origin main --force');
  console.log('✅  Done! https://github.com/TechLegion/samuel-okorie');
} catch (e) {
  console.error('❌  Push failed:\n', e.stderr?.toString() ?? e.message);
}
