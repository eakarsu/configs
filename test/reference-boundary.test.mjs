import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { inspect } from '../lib/validate-configs.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const result = inspect(root)
test('archive is explicitly retained as a non-executable reference', () => { assert.equal(result.boundary.decision, 'retain-as-quarantined-reference'); assert.equal(result.boundary.application, false); assert.equal(result.boundary.executionSupported, false); assert.equal(result.boundary.deploymentSupported, false) })
test('all 1,232 configuration files parse and match the pinned digest', () => { assert.equal(result.configCount, 1232); assert.equal(result.digest, result.boundary.inventoryDigest) })
test('configuration and nested feature schemas validate', () => { assert.equal(result.issues.length, 0); assert.equal(result.featureCount, 32688); assert.equal(result.fieldCount, 311827) })
test('provenance records origin, immutable commit and missing license', () => { assert.match(result.boundary.snapshot.origin, /^https:\/\/github\.com\//); assert.match(result.boundary.snapshot.commit, /^[a-f0-9]{40}$/); assert.equal(result.boundary.license.projectLicenseFound, false) })
test('ownership and redistribution fail closed', () => { assert.equal(result.boundary.ownership.status, 'external-assignment-required'); assert.equal(result.boundary.redistributionSupported, false); assert.equal(result.boundary.ownership.productOwner, null) })
test('repository exposes no supported application entry point', () => { const launcher = fs.readFileSync(path.join(root, 'start.sh'), 'utf8'); const manifest = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8')); assert.match(launcher, /exit 78/); assert.equal(manifest.private, true); assert.equal(manifest.scripts.start, './start.sh') })
