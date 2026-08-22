#!/usr/bin/env node
/**
 * Standalone API URL Normalization Contract Validator
 * Spotify Premium Retention Intelligence Platform
 *
 * Executes the ACTUAL TypeScript source implementation from `src/utils/url.ts`
 * and verifies that API base URL normalization and full endpoint route construction
 * strictly comply with the backend /api/v1 contract across all environments.
 */

import { strict as assert } from 'node:assert';
import { normalizeApiBaseUrl } from '../src/utils/url.ts';

const testCases = [
  {
    name: 'Production bare Render URL without trailing slash',
    input: 'https://spotify-retention-api.onrender.com',
    expected: 'https://spotify-retention-api.onrender.com/api/v1'
  },
  {
    name: 'Production Render URL with trailing slash',
    input: 'https://spotify-retention-api.onrender.com/',
    expected: 'https://spotify-retention-api.onrender.com/api/v1'
  },
  {
    name: 'Production Render URL with /api/v1 already present',
    input: 'https://spotify-retention-api.onrender.com/api/v1',
    expected: 'https://spotify-retention-api.onrender.com/api/v1'
  },
  {
    name: 'Production Render URL with /api/v1/ and trailing slash',
    input: 'https://spotify-retention-api.onrender.com/api/v1/',
    expected: 'https://spotify-retention-api.onrender.com/api/v1'
  },
  {
    name: 'Local development bare port URL',
    input: 'http://localhost:8000',
    expected: 'http://localhost:8000/api/v1'
  },
  {
    name: 'Local development URL with /api/v1',
    input: 'http://localhost:8000/api/v1',
    expected: 'http://localhost:8000/api/v1'
  },
  {
    name: 'Relative /api/v1 prefix',
    input: '/api/v1',
    expected: '/api/v1'
  },
  {
    name: 'Relative /api/v1/ with trailing slash',
    input: '/api/v1/',
    expected: '/api/v1'
  },
  {
    name: 'Empty string fallback',
    input: '',
    expected: '/api/v1'
  },
  {
    name: 'Whitespace only fallback',
    input: '   ',
    expected: '/api/v1'
  },
  {
    name: 'Undefined fallback',
    input: undefined,
    expected: '/api/v1'
  }
];

const contractEndpoints = [
  { relative: '/predictions/summary', expected: 'https://spotify-retention-api.onrender.com/api/v1/predictions/summary' },
  { relative: '/dashboard/summary', expected: 'https://spotify-retention-api.onrender.com/api/v1/dashboard/summary' },
  { relative: '/auth/login', expected: 'https://spotify-retention-api.onrender.com/api/v1/auth/login' },
  { relative: '/analytics/overview', expected: 'https://spotify-retention-api.onrender.com/api/v1/analytics/overview' }
];

console.log('--- RUNNING API BASE URL NORMALIZATION VALIDATION (SOURCE: src/utils/url.ts) ---');
let passedCount = 0;
let failedCount = 0;

for (const tc of testCases) {
  const actual = normalizeApiBaseUrl(tc.input);
  try {
    assert.strictEqual(actual, tc.expected);
    console.log(`  ✓ PASS: ${tc.name} -> "${actual}"`);
    passedCount++;
  } catch (err) {
    console.error(`  ✗ FAIL: ${tc.name} -> expected "${tc.expected}", got "${actual}" (${err.message})`);
    failedCount++;
  }
}

console.log('\n--- VERIFYING FULL ENDPOINT ROUTE CONTRACTS ---');
const prodBase = normalizeApiBaseUrl('https://spotify-retention-api.onrender.com');
for (const ep of contractEndpoints) {
  const fullUrl = `${prodBase}${ep.relative}`;
  try {
    assert.strictEqual(fullUrl, ep.expected);
    assert(!fullUrl.includes('/api/v1/api/v1'), 'Must not duplicate /api/v1 segment');
    console.log(`  ✓ PASS: ${ep.relative} -> "${fullUrl}"`);
    passedCount++;
  } catch (err) {
    console.error(`  ✗ FAIL: ${ep.relative} -> expected "${ep.expected}", got "${fullUrl}" (${err.message})`);
    failedCount++;
  }
}

console.log(`\n======================================================`);
console.log(`VALIDATION RESULT: ${passedCount} passed, ${failedCount} failed.`);
console.log(`======================================================`);

if (failedCount > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
