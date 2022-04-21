const cellSize = 90

export function getSize(elem) {
  const size = {
    width: elem.offsetWidth,
    height: elem.offsetHeight,
  }
  size.columns = getCells(size.width)
  size.rows = getCells(size.height)
  return size
}

export function getCells(length) {
  return (length - (length % cellSize)) / cellSize
}

export function layoutCells(size) {
  const gameArea = qs('.game-area')
  for (let y = 0; y < size.rows; y++) {
    for (let x = 0; x < size.columns; x++) {
      create({
        tag: 'div',
        parent: gameArea,
        data: [
          {
            key: 'number',
            value: randomIntFromRange(0, 4),
          },
          { key: 'x', value: x },
          { key: 'y', value: y },
          { key: 'highlight', value: 0 },
        ],
        classes: ['cell'],
        styleName: [
          {
            key: 'width',
            value: `${cellSize}px`,
          },
          {
            key: 'height',
            value: `${cellSize}px`,
          },
        ],
      })
    }
  }
  gameArea.style.gridTemplateColumns = `repeat(${size.columns}, 1fr)`
  gameArea.dataset.columns = size.columns
  gameArea.dataset.rows = size.rows
}

export function qs(selector, parent = document) {
  return parent.querySelector(selector)
}

export function qsa(selector, parent = document) {
  return Array.from(parent.querySelectorAll(selector))
}

function hyphenateCamelCase(string) {
  return string.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
}

export function randomIntFromRange(from, to) {
  return Math.floor(from + (to - from) * Math.random())
}

export function create({ tag, parent, data, classes, styles }) {
  const elem = document.createElement(tag)
  if (parent) parent.appendChild(elem)
  data?.forEach(item => {
    elem.setAttribute(`data-${hyphenateCamelCase(item.key)}`, item.value)
  })
  classes?.forEach(className => {
    elem.classList.add(className)
  })
  styles?.forEach(styleName => {
    elem.style[styleName.key] = styleName.value
  })
  return elem
}
