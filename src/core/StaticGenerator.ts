import { ensureDir, readFile, writeFile } from 'fs-extra'
import { resolve } from 'path'
import { render } from 'ejs'
import { Sprite } from './Sprite'
import { SpriteResolver } from './SpriteResolver'
import { CWD } from '../consts'
import { project } from './Project'

export class StaticGenerator {
  spriteResolver = new SpriteResolver()
  sprites: Sprite[]
  resolved: boolean = false
  outputDir = resolve(CWD, project.config?.paths?.output)

  async generate() {
    await ensureDir(this.outputDir)

    const script = await this.buildSpriteScript()
    await writeFile(resolve(this.outputDir, 'svg-sprite.js'), script, 'utf8')

    const html = await this.buildHTML()
    await writeFile(resolve(this.outputDir, 'index.html'), html, 'utf8')
  }

  async buildHTML() {
    await this.ensureResolved()
    const template = await readFile(
      resolve(__dirname, '../../template/index.ejs'),
      'utf8'
    )
    const html = render(template, {
      normal: this.sprites.filter((s) => !s.props.colorful).map((s) => s.name),
      colorful: this.sprites.filter((s) => s.props.colorful).map((s) => s.name),
    })
    return html
  }

  async buildSpriteScript() {
    await this.ensureResolved()
    const svgSpritesContent = await this.buildSvgSprites()
    return `!function(a){var l,t,h,c,e,i,m='${svgSpritesContent}',o=(o=document.getElementsByTagName("script"))[o.length-1].getAttribute("data-injectcss");if(o&&!a.__iconfont__svg__cssinject__){a.__iconfont__svg__cssinject__=!0;try{document.write("<style>.svgfont {display: inline-block;width: 1em;height: 1em;fill: currentColor;vertical-align: -0.1em;font-size:16px;}</style>")}catch(a){console&&console.log(a)}}function v(){e||(e=!0,h())}l=function(){var a,l,t,h;(h=document.createElement("div")).innerHTML=m,m=null,(t=h.getElementsByTagName("svg")[0])&&(t.setAttribute("aria-hidden","true"),t.style.position="absolute",t.style.width=0,t.style.height=0,t.style.overflow="hidden",a=t,(l=document.body).firstChild?(h=a,(t=l.firstChild).parentNode.insertBefore(h,t)):l.appendChild(a))},document.addEventListener?~["complete","loaded","interactive"].indexOf(document.readyState)?setTimeout(l,0):(t=function(){document.removeEventListener("DOMContentLoaded",t,!1),l()},document.addEventListener("DOMContentLoaded",t,!1)):document.attachEvent&&(h=l,c=a.document,e=!1,(i=function(){try{c.documentElement.doScroll("left")}catch(a){return void setTimeout(i,50)}v()})(),c.onreadystatechange=function(){"complete"==c.readyState&&(c.onreadystatechange=null,v())})}(window)`
  }

  async buildSvgSprites() {
    await this.ensureResolved()
    this.sprites.forEach((sprite) => {
      Sprite.append(sprite)
    })

    return Sprite.end().replace(/\n|\r\n/g, '')
  }

  private async ensureResolved() {
    if (!this.resolved) {
      this.sprites = await this.spriteResolver.resolve()
      this.resolved = true
    }
  }
}
