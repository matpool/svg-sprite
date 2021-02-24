import { readFile, pathExistsSync } from 'fs-extra'
import { resolve } from 'path'
import { CWD, PROJECT_CONFIG_FILE } from './consts'

export async function getConfig(): Promise<any> {
  const projectConfigPath = resolve(CWD, PROJECT_CONFIG_FILE)

  if (!pathExistsSync(projectConfigPath)) {
    throw new Error(`icons config file ${PROJECT_CONFIG_FILE} not exists`)
  }

  let config = {}
  const configStr = await readFile(projectConfigPath, 'utf8')

  try {
    config = JSON.parse(configStr)
  } catch (e) {
    throw new Error(
      `icons config file ${PROJECT_CONFIG_FILE} is not a valid json file`
    )
  }

  return config
}
