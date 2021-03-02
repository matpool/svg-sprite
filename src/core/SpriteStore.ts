import {
  copyAttributes,
  loadXml,
  removeAttributes,
  setAttributes,
  svgToSymbol,
  CheerioRoot,
  Cheerio,
} from './utils'

const SELECTOR_SVG = 'svg'
const SELECTOR_DEFS = 'defs'

const TEMPLATE_SVG = '<svg><defs/></svg>'
const TEMPLATE_DOCTYPE =
  '<?xml version="1.0" encoding="UTF-8"?>' +
  '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" ' +
  '"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">'

const DEFAULT_OPTIONS = {
  cleanDefs: false,
  cleanSymbols: false,
  inline: false,
  svgAttrs: false,
  symbolAttrs: false,
  copyAttrs: [],
}

export class SpriteStore {
  options: typeof DEFAULT_OPTIONS

  parent: CheerioRoot = loadXml(TEMPLATE_SVG)
  parentSvg: Cheerio = this.parent(SELECTOR_SVG)
  parentDefs: Cheerio = this.parent(SELECTOR_DEFS)
  element: CheerioRoot = this.parent

  constructor(op: Partial<typeof DEFAULT_OPTIONS> = {}) {
    this.options = Object.assign({}, DEFAULT_OPTIONS, op)
  }

  add(id: string, content: string) {
    const $ = loadXml(content)

    const childDefs = $(SELECTOR_DEFS)
    removeAttributes(childDefs, this.options.cleanDefs)

    childDefs.children().each((_, el) => {
      const elem = $(el)
      const oldDefId = elem.attr('id')
      const newDefId = `${id}-${oldDefId}`
      elem.attr('id', newDefId)

      // 查找所有带 #oldDefId 的属性 值改为 #newDefId
      $('*').each((_, el2) => {
        for (let attr of el2.attributes) {
          if (attr.value.includes(`#${oldDefId}`)) {
            $(el2).attr(
              attr.name,
              attr.value.replace(`#${oldDefId}`, `#${newDefId}`)
            )
          }
        }
      })
    })

    this.parentDefs.append(childDefs.contents())
    childDefs.remove()

    const childSvg = $(SELECTOR_SVG)
    const childSymbol = svgToSymbol(id, $)

    removeAttributes(childSymbol, this.options.cleanSymbols)
    copyAttributes(childSymbol, childSvg, this.options.copyAttrs)
    setAttributes(childSymbol, this.options.symbolAttrs)
    this.parentSvg.append(childSymbol)

    return this
  }
  toString() {
    const clone = loadXml(this.parent.xml())

    const svg = clone(SELECTOR_SVG)

    setAttributes(svg, this.options.svgAttrs)

    if (this.options.inline) {
      return clone.xml()
    }

    svg.attr('xmlns', function (val) {
      return val || 'http://www.w3.org/2000/svg'
    })

    svg.attr('xmlns:xlink', function (val) {
      return val || 'http://www.w3.org/1999/xlink'
    })

    return TEMPLATE_DOCTYPE + clone.xml()
  }
}
