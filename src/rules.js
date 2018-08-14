export const REQUIRED = Symbol('REQUIRED')
export const UNIQUE = Symbol('UNIQUE')
export const ELEMENT = Symbol('ELEMENT')
export const TEXT = Symbol('TEXT')
export const URL = Symbol('URL')

const define = definition => ({
  required: () => define({ ...definition, required: REQUIRED }),
  unique: () => define({ ...definition, unique: UNIQUE }),
  ...definition,
})

const element = definition =>
  define({
    children: () => [],
    inline: false,
    type: ELEMENT,
    ...definition,
    attributes: () => [...globalAttributes, ...(definition.attributes ? definition.attributes() : [])],
  })

const voidElement = (tag, definition) => element({ ...definition, tag, inline: true })

const groupingElement = (tag, definition) =>
  element({
    ...definition,
    tag,
    children: () => [...groupingElements, ...textElements],
  })

const textElement = (tag, definition) =>
  element({
    ...definition,
    tag,
    children: () => [text, url, ...textElements],
  })

const text = element({ type: TEXT })

const url = element({ type: URL })

const attribute = (name, values) => define({ name, values })

const globalAttributes = [attribute('class', [text]), attribute('id', [text.unique()])]

export default element({
  tag: 'html',
  children: () => [head.unique(), body.required().unique()],
})

const head = element({
  tag: 'head',
  children: () => [title.unique(), link, meta],
})

const title = element({
  tag: 'title',
  children: () => [text.required()],
})

const link = voidElement('link', {
  attributes: () => [
    attribute('href', [url.required()])
      .required()
      .unique(),
    attribute('rel', ['stylesheet'])
      .required()
      .unique(),
  ],
})

const meta = voidElement('meta', {
  attributes: () => [
    attribute('name', [text.required()])
      .required()
      .unique(),
    attribute('content', [text.required()])
      .required()
      .unique(),
  ],
})

const body = element({
  tag: 'body',
  children: () => [text, url, ...groupingElements, ...textElements],
})

const article = groupingElement('article')

const section = groupingElement('section')

const h1 = groupingElement('h1')

const h2 = groupingElement('h2')

const h3 = groupingElement('h3')

const h4 = groupingElement('h4')

const h5 = groupingElement('h5')

const h6 = groupingElement('h6')

const header = groupingElement('header')

const footer = groupingElement('footer')

const p = groupingElement('p')

const hr = voidElement('hr')

const pre = groupingElement('pre')

const ol = groupingElement('ol')

const ul = groupingElement('ul')

const main = groupingElement('main')

const div = groupingElement('div')

const groupingElements = [article, section, h1, h2, h3, h4, h5, h6, header, footer, p, hr, pre, ol, ul, main, div]

const a = textElement('a')

const em = textElement('em')

const string = textElement('string')

const small = textElement('small')

const s = textElement('s')

const cite = textElement('cite')

const q = textElement('q')

const dfn = textElement('dfn')

const abbr = textElement('abbr')

const rt = textElement('rt')

const rp = textElement('rp')

const data = textElement('data')

const time = textElement('time')

const code = textElement('code')

const sub = textElement('sub')

const sup = textElement('sup')

const i = textElement('i')

const b = textElement('b')

const u = textElement('u')

const span = textElement('span')

const br = voidElement('br')

const textElements = [
  a,
  em,
  string,
  small,
  s,
  cite,
  q,
  dfn,
  abbr,
  rt,
  rp,
  data,
  time,
  code,
  sub,
  sup,
  i,
  b,
  u,
  span,
  br,
]
