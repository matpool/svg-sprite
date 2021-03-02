import { load, root } from 'cheerio'

export type CheerioRoot = ReturnType<typeof load>
export type Cheerio = ReturnType<typeof root>

export function loadXml(text: string): CheerioRoot {
  return load(text, {
    xmlMode: true,
  })
}

export function removeAttributes(
  el: Cheerio,
  attrs: boolean | string[]
): Cheerio {
  let localAttrs = attrs

  if (localAttrs === true) {
    localAttrs = ['style']
  }

  if (!localAttrs || !localAttrs.length) {
    return el
  }

  const els = el.find('*')

  els.each(function (i, el) {
    ;(localAttrs as string[]).forEach(function (attr) {
      els.eq(i).removeAttr(attr)
    })
  })

  return el
}

export function setAttributes(el: Cheerio, attrs: Object): Cheerio {
  if (!attrs || typeof attrs !== 'object') {
    return el
  }

  Object.keys(attrs).forEach(function (attr) {
    var value = attrs[attr]

    // Handle function values directly as cherrio passes an unhelpful index
    // as the first argument in the native function handler.
    if (typeof value === 'function') {
      value = value(el.attr(attr))
    }

    el.attr(attr, value)
  })

  return el
}

const ALWAYS_COPY_ATTRS = ['viewBox', 'aria-labelledby', 'role', 'fill']

export function copyAttributes(
  a: Cheerio,
  b: Cheerio,
  attrs: string[]
): Cheerio {
  const attrsToCopy = ALWAYS_COPY_ATTRS.concat(attrs || [])
  const copiedAttrs = Object.create(null)

  attrsToCopy.forEach(function (attr) {
    if (!attr || copiedAttrs[attr]) {
      return
    }

    copiedAttrs[attr] = true

    const bAttr = b.attr(attr)

    if (bAttr != null) {
      a.attr(attr, b.attr(attr))
    }
  })

  return a
}

const SELECTOR_SVG = 'svg'
const TEMPLATE_SYMBOL = '<symbol/>'
const ATTRIBUTE_ID = 'id'

export function svgToSymbol(id: string, child: CheerioRoot): Cheerio {
  var svgElem = child(SELECTOR_SVG)

  // initialize a new <symbol> element
  var symbol = child(TEMPLATE_SYMBOL)

  symbol.attr(ATTRIBUTE_ID, id)
  symbol.append(svgElem.contents())

  return symbol
}
