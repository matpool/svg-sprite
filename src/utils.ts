import { readFileSync, pathExistsSync, readdir, stat } from 'fs-extra'
import { resolve } from 'path'
import { CWD, PROJECT_CONFIG_FILE } from './consts'

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
