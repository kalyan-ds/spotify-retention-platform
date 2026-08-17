import fs from 'fs';
import path from 'path';

const filesToFixReact = [
  'src/components/charts/index.tsx',
  'src/components/system/LoadingScreen.tsx',
  'src/components/system/NotificationCenter.tsx',
  'src/components/system/RouteErrorBoundary.tsx',
  'src/components/system/Toast.tsx',
  'src/components/table/index.tsx',
  'src/layouts/BlankLayout.tsx',
  'src/layouts/DashboardLayout.tsx',
  'src/pages/AIModels/index.tsx',
  'src/pages/Engagement/index.tsx',
  'src/pages/NotFound/index.tsx',
  'src/pages/Predictions/index.tsx',
  'src/pages/Reports/index.tsx',
  'src/pages/Retention/index.tsx',
  'src/pages/Revenue/index.tsx',
  'src/pages/Segments/index.tsx',
  'src/pages/Settings/index.tsx',
  'src/pages/Users/index.tsx'
];

for (const file of filesToFixReact) {
  const p = path.join(process.cwd(), file);
  if (fs.existsSync(p)) {
    let content = fs.readFileSync(p, 'utf8');
    content = content.replace(/import React(, \{ Suspense \})? from 'react';\n/, (match, p1) => {
      return p1 ? `import { Suspense } from 'react';\n` : '';
    });
    fs.writeFileSync(p, content);
  }
}

const filesToFixTypography = [
  'src/components/system/EnterprisePlaceholder.tsx',
  'src/components/system/GlobalErrorBoundary.tsx',
  'src/components/system/LoadingScreen.tsx',
  'src/components/system/RouteErrorBoundary.tsx',
  'src/pages/ComponentsPlayground.tsx',
  'src/pages/NotFound/index.tsx'
];

for (const file of filesToFixTypography) {
  const p = path.join(process.cwd(), file);
  if (fs.existsSync(p)) {
    let content = fs.readFileSync(p, 'utf8');
    content = content.replace(/variant="h1"/g, 'variant="pageTitle"');
    content = content.replace(/variant="h2"/g, 'variant="sectionTitle"');
    content = content.replace(/variant="body1"/g, 'variant="body"');
    fs.writeFileSync(p, content);
  }
}

console.log('Fixed TS Errors.');
