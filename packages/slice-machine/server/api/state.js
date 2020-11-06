import fs from 'fs'
import path from 'path'
import fetchLibs from './libraries'
import { getEnv } from '../../lib/env'
import { warningStates } from '../../src/consts'
import { fetchStorybookUrl } from './common/utils'

const hasStorybookScript = (cwd) => {
  const pathToManifest = path.join(cwd, 'package.json')
  try {
    const file = fs.readFileSync(pathToManifest, 'utf-8')
    const manifest = JSON.parse(file)
    return !!(manifest && manifest.scripts && manifest.scripts.storybook)
  } catch(e) {
    return false
  }
}

const createWarnings = async ({ env, configErrors }) => {
  const hasScript = hasStorybookScript(env.cwd)
  let storybookIsRunning = await (async () => {
    try {
      await fetchStorybookUrl(env.storybook)
      return true
    } catch(e) {
      return false
    }
  })()

  const storybookState = (() => {
    if (!hasScript) {
      return [warningStates.STORYBOOK_NOT_INSTALLED]
    }
    if (configErrors.storybook) {
      return [warningStates.STORYBOOK_NOT_IN_MANIFEST]
    }
    if (!storybookIsRunning) {
      return [warningStates.STORYBOOK_NOT_RUNNING]
    }
    return []
  })()
  return [
    ...!env.auth ? [warningStates.NOT_CONNECTED] : [],
    ...storybookState,
  ]
}

export default async function handler() {
  const { env, errors: configErrors } = getEnv()
  const { libraries, err: clientError } = await fetchLibs(env)
  const warnings = await createWarnings({ env, configErrors })
  return { libraries, clientError, configErrors, env, warnings }
}