import { readFileSync } from 'fs-extra'
import { optimize } from 'svgo'
import { resolve } from 'path'
import { project } from './Project'
import { CWD } from '../consts'
import { SpriteStore } from './SpriteStore'

interface IProps {
  path: string
  colorful: boolean
}

export class Sprite {
  constructor(public props: IProps) {}

  static store = new SpriteStore()

  get name() {
    return this.props.path.replace(/^.*\/([^/]+)\..*$/, '$1')
  }

  get fullname() {
    return (project.config.prefix || '') + this.name
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

  get value() {
    return {
      ...this.props,
      name: this.name,
      fullname: this.fullname,
      content: this.content,
    }
  }

  static append(sprite: Sprite) {
    this.store.add(sprite.fullname, sprite.content)
    return Sprite
  }

  static end() {
    return this.store.toString()
  }

  static clear() {
    this.store = new SpriteStore()
  }
}
