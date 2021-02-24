import { Command, flags } from '@oclif/command'
import { readdir, readFile, readFileSync, stat, writeFile } from 'fs-extra'
import { resolve } from 'path'
import * as svgstore from 'svgstore'
import { optimize } from 'svgo'
import { render } from 'ejs'
import { CWD } from '../consts'
import { getConfig } from '../utils'

export default class Gen extends Command {
  static description = 'auto generate icon script and example html'

  static flags = {
    help: flags.help({ char: 'h' }),
  }

  static args = []

  async run() {
    const config = await getConfig()

    if (
      !config?.paths?.normal ||
      !config?.paths?.colorful ||
      !config?.paths?.output
    ) {
      throw new Error(`paths config invalid`)
    }

    const normalIconNames = []
    const colorfulIconNames = []
    const sprites = svgstore()

    const normalIcons = await this.getSvgFiles(
      resolve(CWD, config?.paths?.normal)
    )

    const colorfulIcons = await this.getSvgFiles(
      resolve(CWD, config?.paths?.colorful)
    )

    for (let icon of normalIcons) {
      const iconName =
        (config.prefix || '') + icon.replace(/^.*\/([^/]+)\..*$/, '$1')
      normalIconNames.push(iconName)
      sprites.add(iconName, await this.getSvgContent(icon, true), {
        copyAttrs: ['fill'],
      })
    }

    for (let icon of colorfulIcons) {
      const iconName =
        (config.prefix || '') + icon.replace(/^.*\/([^/]+)\..*$/, '$1')
      colorfulIconNames.push(iconName)
      sprites.add(iconName, await this.getSvgContent(icon), {
        copyAttrs: ['fill'],
      })
    }

    const script = this.buildScript(sprites.toString())
    await writeFile(
      resolve(CWD, config?.paths?.output, 'svgicons.js'),
      script.replace(/\n|\r\n/g, ''),
      'utf8'
    )

    const html = this.buildHTML({ normalIconNames, colorfulIconNames })
    await writeFile(
      resolve(CWD, config?.paths?.output, 'icons.html'),
      html,
      'utf8'
    )
    console.log('file generate successfully')
  }

  async getSvgContent(p: string, op = false) {
    const svgContent = await readFile(p, 'utf8')
    if (op) {
      return optimize(svgContent, {
        plugins: [{ name: 'convertColors', params: { currentColor: true } }],
      }).data
    } else {
      return svgContent
    }
  }

  async getSvgFiles(p: string) {
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

  buildScript(svgContent: string) {
    return `!function(a){var l,t,h,c,e,i,m='${svgContent}',o=(o=document.getElementsByTagName("script"))[o.length-1].getAttribute("data-injectcss");if(o&&!a.__iconfont__svg__cssinject__){a.__iconfont__svg__cssinject__=!0;try{document.write("<style>.svgfont {display: inline-block;width: 1em;height: 1em;fill: currentColor;vertical-align: -0.1em;font-size:16px;}</style>")}catch(a){console&&console.log(a)}}function v(){e||(e=!0,h())}l=function(){var a,l,t,h;(h=document.createElement("div")).innerHTML=m,m=null,(t=h.getElementsByTagName("svg")[0])&&(t.setAttribute("aria-hidden","true"),t.style.position="absolute",t.style.width=0,t.style.height=0,t.style.overflow="hidden",a=t,(l=document.body).firstChild?(h=a,(t=l.firstChild).parentNode.insertBefore(h,t)):l.appendChild(a))},document.addEventListener?~["complete","loaded","interactive"].indexOf(document.readyState)?setTimeout(l,0):(t=function(){document.removeEventListener("DOMContentLoaded",t,!1),l()},document.addEventListener("DOMContentLoaded",t,!1)):document.attachEvent&&(h=l,c=a.document,e=!1,(i=function(){try{c.documentElement.doScroll("left")}catch(a){return void setTimeout(i,50)}v()})(),c.onreadystatechange=function(){"complete"==c.readyState&&(c.onreadystatechange=null,v())})}(window)`
  }

  buildHTML(data: { normalIconNames; colorfulIconNames }) {
    const template = readFileSync(
      resolve(__dirname, '../template/icons.ejs'),
      'utf8'
    )
    const html = render(template, data)
    return html
  }
}
