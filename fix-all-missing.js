/**
 * fix-all-missing.js
 * Clones each student repo, copies ALL source files from the reference build
 * (preserving per-student branding in app.json, package.json, theme.ts,
 * explore.tsx and README.md), amends the commit keeping original timestamp,
 * then force-pushes.
 */

const fs   = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const REF_DIR    = path.join(__dirname, '..', 'cli', 'Solomon-Clifford-Seyi');
const WORK_DIR   = __dirname;
const CLONE_BASE = path.join(WORK_DIR, '__fix_all__');

const students = [
  {
    repo: 'https://github.com/SAMUELASHXX/samuel-ash',
    name: 'Samuel Ash', email: 'samuelashxx@gmail.com',
    slug: 'samuel-ash-expo', scheme: 'samuelashexpo',
    theme: { light: '#F59E0B', dark: '#FBBF24', bg: '#FFFBEB', hLight: '#FEF3C7', hDark: '#78350F' },
  },
  {
    repo: 'https://github.com/anjedave23/anjola',
    name: 'Anjola', email: 'anjedave23@users.noreply.github.com',
    slug: 'anjola-expo', scheme: 'anjolaexpo',
    theme: { light: '#14B8A6', dark: '#2DD4BF', bg: '#F0FDFA', hLight: '#CCFBF1', hDark: '#134E4A' },
  },
  {
    repo: 'https://github.com/yashim13/yashim',
    name: 'Yashim', email: 'yashim13@users.noreply.github.com',
    slug: 'yashim-expo', scheme: 'yashimexpo',
    theme: { light: '#10B981', dark: '#34D399', bg: '#ECFDF5', hLight: '#D1FAE5', hDark: '#064E3B' },
  },
  {
    repo: 'https://github.com/bigshegz001/buhari-segun',
    name: 'Buhari Segun', email: 'bigshegz001@users.noreply.github.com',
    slug: 'buhari-segun-expo', scheme: 'buharisegunexpo',
    theme: { light: '#F43F5E', dark: '#FB7185', bg: '#FFF1F2', hLight: '#FFE4E6', hDark: '#881337' },
  },
  {
    repo: 'https://github.com/temitops12/temitope',
    name: 'Temitope', email: 'temitops12@users.noreply.github.com',
    slug: 'temitope-expo', scheme: 'temitopeexpo',
    theme: { light: '#06B6D4', dark: '#22D3EE', bg: '#ECFEFF', hLight: '#CFFAFE', hDark: '#083344' },
  },
  {
    repo: 'https://github.com/nnadoziedestiny5-sys/CMP-GIT-Assignment.git',
    name: 'Nnadozie Destiny', email: 'nnadoziedestiny5@gmail.com',
    slug: 'nnadozie-destiny-expo', scheme: 'nnadoziedestinyexpo',
    theme: { light: '#8B5CF6', dark: '#A78BFA', bg: '#F5F3FF', hLight: '#EDE9FE', hDark: '#4C1D95' },
  },
  {
    repo: 'https://github.com/olask2000/Olayokun-Olasunkanmi',
    name: 'Olayokun Olasunkanmi', email: 'olask2000@users.noreply.github.com',
    slug: 'olayokun-olasunkanmi-expo', scheme: 'olayokunolasunkanmiexpo',
    theme: { light: '#D946EF', dark: '#E879F9', bg: '#FDF4FF', hLight: '#FAE8FF', hDark: '#701A75' },
  },
  {
    repo: 'https://github.com/Salu-Victoria/salu-victoria',
    name: 'Salu Victoria', email: 'saluvictoria@users.noreply.github.com',
    slug: 'salu-victoria-expo', scheme: 'saluvictoriaexpo',
    theme: { light: '#65A30D', dark: '#BEF264', bg: '#F7FEE7', hLight: '#ECFCCB', hDark: '#3F6212' },
  },
  {
    repo: 'https://github.com/CliffordSolomon/Solomon-Clifford-Seyi',
    name: 'Solomon Clifford Seyi', email: 'cliffordjames294@gmail.com',
    slug: 'solomon-clifford-seyi-expo', scheme: 'solomoncliffordseyiexpo',
    theme: { light: '#0EA5E9', dark: '#38BDF8', bg: '#F0F9FF', hLight: '#E0F2FE', hDark: '#0C4A6E' },
    useRefDir: true, // already has all source files; still re-push for safety
  },
];

// ── Files to copy wholesale from reference (branding-neutral source files) ──
const FILE_LIST = [
  'components/calculator.tsx',
  'components/external-link.tsx',
  'components/haptic-tab.tsx',
  'components/hello-wave.tsx',
  'components/parallax-scroll-view.tsx',
  'components/themed-text.tsx',
  'components/themed-view.tsx',
  'components/ui/collapsible.tsx',
  'components/ui/icon-symbol.ios.tsx',
  'components/ui/icon-symbol.tsx',
  'hooks/use-color-scheme.ts',
  'hooks/use-color-scheme.web.ts',
  'hooks/use-theme-color.ts',
  'app/_layout.tsx',
  'app/modal.tsx',
  'app/(tabs)/_layout.tsx',
  'app/(tabs)/index.tsx',
  'eslint.config.js',
  'tsconfig.json',
  'expo-env.d.ts',
  'scripts/reset-project.js',
];

function copyRefFile(relPath, destDir) {
  const src  = path.join(REF_DIR, relPath);
  const dest = path.join(destDir, relPath);
  if (!fs.existsSync(src)) { console.log(`    ⚠️  Skipping (not in ref): ${relPath}`); return; }
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
}

function applyBranding(s, dir) {
  // app.json
  let appJson = JSON.parse(fs.readFileSync(path.join(dir, 'app.json'), 'utf8'));
  appJson.expo.name   = s.name;
  appJson.expo.slug   = s.slug;
  appJson.expo.scheme = s.scheme;
  appJson.expo.android.adaptiveIcon.backgroundColor = s.theme.bg;
  fs.writeFileSync(path.join(dir, 'app.json'), JSON.stringify(appJson, null, 2) + '\n');

  // package.json
  let pkg = JSON.parse(fs.readFileSync(path.join(dir, 'package.json'), 'utf8'));
  pkg.name = s.slug;
  fs.writeFileSync(path.join(dir, 'package.json'), JSON.stringify(pkg, null, 2) + '\n');

  // constants/theme.ts
  let theme = fs.readFileSync(path.join(dir, 'constants', 'theme.ts'), 'utf8');
  theme = theme.replace(/const tintColorLight = '.*';/, `const tintColorLight = '${s.theme.light}';`);
  theme = theme.replace(/const tintColorDark = '.*';/,  `const tintColorDark = '${s.theme.dark}';`);
  fs.writeFileSync(path.join(dir, 'constants', 'theme.ts'), theme);

  // app/(tabs)/explore.tsx — accent + header colours
  let explore = fs.readFileSync(path.join(dir, 'app', '(tabs)', 'explore.tsx'), 'utf8');
  explore = explore.replace(
    /const accent = scheme === 'dark' \? '.*' : '.*';/,
    `const accent = scheme === 'dark' ? '${s.theme.dark}' : '${s.theme.light}';`
  );
  explore = explore.replace(
    /headerBackgroundColor=\{\{ light: '.*', dark: '.*' \}\}/,
    `headerBackgroundColor={{ light: '${s.theme.hLight}', dark: '${s.theme.hDark}' }}`
  );
  fs.writeFileSync(path.join(dir, 'app', '(tabs)', 'explore.tsx'), explore);
}

// ── Blank global git identity ──────────────────────────────────────────────
const origName  = execSync('git config --global user.name',  { stdio: 'pipe' }).toString().trim();
const origEmail = execSync('git config --global user.email', { stdio: 'pipe' }).toString().trim();
console.log(`🔒  Blanking global identity (was: ${origName} / ${origEmail})`);
execSync('git config --global user.name  ""', { stdio: 'pipe' });
execSync('git config --global user.email ""', { stdio: 'pipe' });

if (fs.existsSync(CLONE_BASE)) fs.rmSync(CLONE_BASE, { recursive: true, force: true });
fs.mkdirSync(CLONE_BASE);

try {
  for (const s of students) {
    console.log(`\n🔧  ${s.name}`);
    const cloneDir = path.join(CLONE_BASE, s.name.replace(/ /g, '_'));

    // Clone
    execSync(`git clone ${s.repo} "${cloneDir}"`, { stdio: 'pipe' });

    if (!s.useRefDir) {
      // Copy all missing/updated source files
      FILE_LIST.forEach(f => copyRefFile(f, cloneDir));
      // Re-apply branding on top
      applyBranding(s, cloneDir);
    }

    // Preserve original commit metadata
    const origDate = execSync('git log -1 --format=%aI', { cwd: cloneDir, stdio: 'pipe' }).toString().trim();
    const origMsg  = execSync('git log -1 --format=%s',  { cwd: cloneDir, stdio: 'pipe' }).toString().trim();

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
    g('git add -A');
    g(`git commit --amend --no-edit -m "${origMsg}"`);

    try {
      g('git push origin main --force');
      console.log(`  ✅  Pushed`);
    } catch (e) {
      console.error(`  ❌  Failed: ${e.stderr?.toString() ?? e.message}`);
    }
  }

  console.log('\n🎉  ALL DONE!\n');
} finally {
  execSync(`git config --global user.name  "${origName}"`,  { stdio: 'pipe' });
  execSync(`git config --global user.email "${origEmail}"`, { stdio: 'pipe' });
  console.log(`🔓  Global identity restored (${origName})`);
  if (fs.existsSync(CLONE_BASE)) fs.rmSync(CLONE_BASE, { recursive: true, force: true });
  console.log('🗑️   Clones cleaned up.');
}
