import { readFileSync, pathExistsSync, readdir, stat } from 'fs-extra'
import { resolve } from 'path'
import { CWD, PROJECT_CONFIG_FILE } from './consts'

export function getConfig(): any {
  const projectConfigPath = resolve(CWD, PROJECT_CONFIG_FILE)

  if (!pathExistsSync(projectConfigPath)) {
    throw new Error(`icons config file ${PROJECT_CONFIG_FILE} not exists`)
  }

  let config: any = {}
  const configStr = readFileSync(projectConfigPath, 'utf8')

  try {
    config = JSON.parse(configStr)
  } catch (e) {
    throw new Error(
      `icons config file ${PROJECT_CONFIG_FILE} is not a valid json file`
    )
  }

  if (
    !config?.paths?.normal ||
    !config?.paths?.colorful ||
    !config?.paths?.output
  ) {
    throw new Error(`config content invalid`)
  }

  return config
}

export async function getSvgFiles(p: string) {
  const subps = await readdir(p)
  const files = await Promise.all(
    subps.map(async (sub) => {
      const pp = resolve(p, sub)
      return (await stat(pp)).isDirectory() ? getSvgFiles(pp) : pp
    })
  )

  return files
    .reduce((a, f) => a.concat(f), [])
    .filter((f) => f.endsWith('.svg'))
}
