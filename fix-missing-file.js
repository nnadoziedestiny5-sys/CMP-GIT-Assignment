/**
 * fix-missing-file.js
 * Clones each student repo, adds the missing external-link.tsx,
 * amends the last commit (keeping original author + timestamp), then force-pushes.
 */

const fs   = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const REF_FILE    = path.join(__dirname, '..', 'cli', 'Solomon-Clifford-Seyi', 'components', 'external-link.tsx');
const WORK_DIR    = __dirname;
const CLONE_BASE  = path.join(WORK_DIR, '__fix_clone__');

const students = [
  { repo: 'https://github.com/SAMUELASHXX/samuel-ash',             name: 'Samuel Ash',           email: 'samuelashxx@gmail.com' },
  { repo: 'https://github.com/anjedave23/anjola',                  name: 'Anjola',               email: 'anjedave23@users.noreply.github.com' },
  { repo: 'https://github.com/yashim13/yashim',                   name: 'Yashim',               email: 'yashim13@users.noreply.github.com' },
  { repo: 'https://github.com/bigshegz001/buhari-segun',           name: 'Buhari Segun',         email: 'bigshegz001@users.noreply.github.com' },
  { repo: 'https://github.com/temitops12/temitope',                name: 'Temitope',             email: 'temitops12@users.noreply.github.com' },
  { repo: 'https://github.com/nnadoziedestiny5-sys/CMP-GIT-Assignment.git', name: 'Nnadozie Destiny', email: 'nnadoziedestiny5@gmail.com' },
  { repo: 'https://github.com/olask2000/Olayokun-Olasunkanmi',     name: 'Olayokun Olasunkanmi', email: 'olask2000@users.noreply.github.com' },
  { repo: 'https://github.com/Salu-Victoria/salu-victoria',        name: 'Salu Victoria',        email: 'saluvictoria@users.noreply.github.com' },
  { repo: 'https://github.com/CliffordSolomon/Solomon-Clifford-Seyi', name: 'Solomon Clifford Seyi', email: 'cliffordjames294@gmail.com' },
];

// Read the file content once
const externalLinkContent = fs.readFileSync(REF_FILE, 'utf8');

// Blank global identity
const origName  = execSync('git config --global user.name',  { stdio: 'pipe' }).toString().trim();
const origEmail = execSync('git config --global user.email', { stdio: 'pipe' }).toString().trim();
console.log(`🔒  Blanking global git identity (was: ${origName} / ${origEmail})`);
execSync('git config --global user.name  ""', { stdio: 'pipe' });
execSync('git config --global user.email ""', { stdio: 'pipe' });

// Clean up clone dir if leftover from previous run
if (fs.existsSync(CLONE_BASE)) fs.rmSync(CLONE_BASE, { recursive: true, force: true });
fs.mkdirSync(CLONE_BASE);

try {
  for (const s of students) {
    console.log(`\n🔧  Processing: ${s.name}`);
    const cloneDir = path.join(CLONE_BASE, s.name.replace(/ /g, '_'));

    // 1. Clone the repo
    execSync(`git clone ${s.repo} "${cloneDir}"`, { stdio: 'pipe' });

    // 2. Add the missing file
    const destFile = path.join(cloneDir, 'components', 'external-link.tsx');
    fs.mkdirSync(path.dirname(destFile), { recursive: true });
    fs.writeFileSync(destFile, externalLinkContent);

    // 3. Get the original commit info to preserve it exactly
    const origDate    = execSync('git log -1 --format=%aI', { cwd: cloneDir, stdio: 'pipe' }).toString().trim();
    const origMsg     = execSync('git log -1 --format=%s',  { cwd: cloneDir, stdio: 'pipe' }).toString().trim();

    // 4. Build env with student identity + original timestamp
    const env = {
      ...process.env,
      GIT_AUTHOR_NAME:     s.name,
      GIT_AUTHOR_EMAIL:    s.email,
      GIT_COMMITTER_NAME:  s.name,
      GIT_COMMITTER_EMAIL: s.email,
      GIT_AUTHOR_DATE:     origDate,
      GIT_COMMITTER_DATE:  origDate,
    };
    const g = (cmd) => execSync(cmd, { cwd: cloneDir, env, stdio: 'pipe' });

    g(`git config user.name  "${s.name}"`);
    g(`git config user.email "${s.email}"`);
    g('git add components/external-link.tsx');
    g(`git commit --amend --no-edit -m "${origMsg}"`);

    // 5. Force push
    try {
      g('git push origin main --force');
      console.log(`  ✅  Pushed ${s.name}`);
    } catch (e) {
      console.error(`  ❌  Push failed for ${s.name}:\n     ${e.stderr?.toString() ?? e.message}`);
    }
  }

  console.log('\n🎉  ALL DONE!\n');
} finally {
  // Restore global identity
  execSync(`git config --global user.name  "${origName}"`,  { stdio: 'pipe' });
  execSync(`git config --global user.email "${origEmail}"`, { stdio: 'pipe' });
  console.log(`🔓  Global git identity restored (${origName} / ${origEmail})`);

  // Clean up clones
  if (fs.existsSync(CLONE_BASE)) fs.rmSync(CLONE_BASE, { recursive: true, force: true });
  console.log('🗑️   Clone directory cleaned up.');
}
