import { readdir, stat } from 'fs-extra'
import { resolve } from 'path'
import { config, CWD } from '../consts'
import { Sprite } from './Sprite'

export class SpriteResolver {
  async resolve() {
    const normalIcons = (
      await this.getSvgFiles(resolve(CWD, config?.paths?.normal))
    ).map(
      (p: string) =>
        new Sprite({
          path: p,
          colorful: false,
        })
    )

    const colorfulIcons = (
      await this.getSvgFiles(resolve(CWD, config?.paths?.colorful))
    ).map(
      (p: string) =>
        new Sprite({
          path: p,
          colorful: true,
        })
    )

    return [...normalIcons, ...colorfulIcons]
  }

  private async getSvgFiles(p: string) {
    const subps = await readdir(p)
    const files = await Promise.all(
      subps.map(async (sub) => {
        const pp = resolve(p, sub)
        return (await stat(pp)).isDirectory() ? this.getSvgFiles(pp) : pp
      })
    )

    return files
      .reduce((a, f) => a.concat(f), [])
      .filter((f) => f.endsWith('.svg'))
  }
}
