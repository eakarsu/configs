import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'

export function inspect(root) {
  const boundary = JSON.parse(fs.readFileSync(path.join(root, 'REFERENCE_BOUNDARY.json'), 'utf8'))
  const configFiles = fs.readdirSync(root).filter((name) => name.endsWith('.json') && !['package.json', 'REFERENCE_BOUNDARY.json'].includes(name)).sort()
  const issues = []; const apps = new Set(); const folders = new Set(); let featureCount = 0; let fieldCount = 0
  const inventory = crypto.createHash('sha256')
  const secretPatterns = [
    /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
    /AKIA[0-9A-Z]{16}/,
    /\bsk-[A-Za-z0-9_-]{32,}\b/,
    /\bgh[pousr]_[A-Za-z0-9]{30,}\b/,
  ]
  for (const name of configFiles) {
    const bytes = fs.readFileSync(path.join(root, name)); const text = bytes.toString('utf8')
    inventory.update(name); inventory.update('\0'); inventory.update(crypto.createHash('sha256').update(bytes).digest('hex')); inventory.update('\n')
    if (secretPatterns.some((pattern) => pattern.test(text))) issues.push(`${name}: high-confidence secret signature`)
    let config; try { config = JSON.parse(text) } catch (error) { issues.push(`${name}: invalid JSON: ${error.message}`); continue }
    for (const key of ['appName', 'dbName', 'folderName']) if (typeof config[key] !== 'string' || !config[key].trim()) issues.push(`${name}: missing ${key}`)
    if (!String(config.folderName || '').startsWith('generated/')) issues.push(`${name}: folderName is outside generated/`)
    if (!Array.isArray(config.features) || !config.features.length) { issues.push(`${name}: features must be non-empty`); continue }
    if (apps.has(config.appName)) apps.add(config.appName); else apps.add(config.appName)
    if (folders.has(config.folderName)) folders.add(config.folderName); else folders.add(config.folderName)
    for (const feature of config.features) {
      featureCount += 1
      if (!feature || typeof feature.modelName !== 'string' || !feature.modelName || !Array.isArray(feature.fields) || !feature.fields.length) { issues.push(`${name}: invalid feature shape`); continue }
      for (const field of feature.fields) { fieldCount += 1; if (!field || typeof field.key !== 'string' || !field.key || typeof field.type !== 'string' || !field.type) issues.push(`${name}: invalid field shape`) }
    }
  }
  const digest = inventory.digest('hex')
  if (configFiles.length !== boundary.expectedConfigCount) issues.push(`expected ${boundary.expectedConfigCount} configurations, found ${configFiles.length}`)
  if (digest !== boundary.inventoryDigest) issues.push(`inventory digest mismatch: ${digest}`)
  if (boundary.application !== false || boundary.executionSupported !== false || boundary.deploymentSupported !== false) issues.push('boundary must deny app execution and deployment')
  return { boundary, configCount: configFiles.length, featureCount, fieldCount, uniqueAppNames: apps.size, uniqueFolders: folders.size, digest, issues }
}
