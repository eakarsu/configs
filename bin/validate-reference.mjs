#!/usr/bin/env node
import { inspect } from '../lib/validate-configs.mjs'

const result = inspect(new URL('..', import.meta.url).pathname)
console.log(JSON.stringify(result, null, 2))
if (result.issues.length) process.exitCode = 1
