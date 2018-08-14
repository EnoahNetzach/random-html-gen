import indent from 'indent-string'
import flatten from 'lodash/flatten'
import random from 'lodash/random'
import sampleSize from 'lodash/sampleSize'
import shuffle from 'lodash/shuffle'
import uuid from 'uuid'
import html, { ELEMENT, REQUIRED, TEXT, UNIQUE, URL } from './rules'

const select = (definitions, size) =>
  shuffle([
    ...definitions.filter(definition => definition.required === REQUIRED),
    ...sampleSize(
      flatten(
        definitions
          .filter(definition => !(definition.required === REQUIRED && definition.unique === UNIQUE))
          .map(definition => Array.from({ length: random(0, definition.unique === UNIQUE ? 1 : 5) }, () => definition)),
      ),
      random(0, size),
    ),
  ])

const getTextOrUrl = definition => {
  if (definition instanceof Object) {
    switch (definition.type) {
      case TEXT:
        return uuid.v4()
      case URL:
        return `https://www.example.com/${uuid.v4().replace(/-/g, '/')}`
    }
  }

  return definition
}

const buildAST = (node, maxDepth) => {
  switch (node.type) {
    default:
    case ELEMENT: {
      const selected = select(node.children(), 5)
      const children = maxDepth === 0 ? [] : selected.map(child => buildAST(child, maxDepth - 1))

      return {
        tag: node.tag,
        attributes: select(node.attributes(), 10).map(attribute => ({
          name: attribute.name,
          value: getTextOrUrl(select(attribute.values, 30)[0]) || '',
        })),
        children,
        inline: children.length === 0 && node.inline ? !!Math.round(Math.random()) : false,
      }
    }
    case TEXT:
    case URL:
      return getTextOrUrl(node)
  }
}

const print = node => {
  if (typeof node === 'string') {
    return `${node}\n`
  }

  const attributes = node.attributes.map(attribute => `${attribute.name}="${attribute.value}"`).join(' ')
  const children = node.children.map(print)

  const startTag = `<${node.tag}${attributes ? ' ' : ''}${attributes}>`
  const endTag = node.inline ? '\n' : `</${node.tag}>\n`

  return startTag + (children.length > 0 ? '\n' : '') + indent(children.join(''), 2) + endTag
}

export default function() {
  const ast = buildAST(html, random(5, 10))
  const printed = print(ast)

  return `<!DOCTYPE html>\n${printed}`
}
