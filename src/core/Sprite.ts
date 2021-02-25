import { readFileSync } from 'fs-extra'
import svgstore from 'svgstore'
import { optimize } from 'svgo'
import { resolve } from 'path'
import { project } from './Project'
import { CWD } from '../consts'

interface IProps {
  path: string
  colorful: boolean
}

export class Sprite {
  constructor(public props: IProps) {}

  static store = svgstore()

  get name() {
    return (
      (project.config.prefix || '') +
      this.props.path.replace(/^.*\/([^/]+)\..*$/, '$1')
    )
  }

  get fullpath() {
    return resolve(
      CWD,
      this.props.colorful
        ? project.config.paths.colorful
        : project.config.paths.normal,
      this.props.path
    )
  }

  get content() {
    const { colorful } = this.props
    const svgContent = readFileSync(this.fullpath, 'utf8')

    if (colorful) {
      return svgContent
    } else {
      return optimize(svgContent, {
        plugins: [{ name: 'convertColors', params: { currentColor: true } }],
      }).data
    }
  }

  static append(sprite: Sprite) {
    Sprite.store.add(sprite.name, sprite.content, {
      copyAttrs: ['fill'],
    })
    return Sprite
  }

  static end() {
    return Sprite.store.toString()
  }
}
