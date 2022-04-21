import {
  getSize,
  getCells,
  layoutCells,
  qs,
  qsa,
  create,
  randomIntFromRange,
} from './dom.js'

initialize()

function initialize() {
  const gameArea = qs('.game-area')
  clearGameArea()
  const size = getSize(gameArea)
  const cells = layoutCells(size)
  const interval = setInterval(() => traverseCells(), 300)
}

function clearGameArea() {
  const gameArea = qs('.game-area')
  while (qsa('div', gameArea).length > 0) {
    qsa('div, gameArea')[0]?.remove()
  }
}

function traverseCells() {
  const cells = qsa('.cell')
  cells.forEach(cell => {
    switch (Number(cell.dataset.number)) {
      case 0:
        spread(cell)
        break
      case 1:
        verticalKill(cell)
        break
      case 2:
        horizontalKill(cell)
        break
      case 3:
        crossBreed(cell)
        break
      case 4:
        shrink(cell)
        break
    }
  })
}

function getCell(pos) {
  const selector = `[data-x="${pos[0]}"][data-y="${pos[1]}"]`
  return qs(selector)
}

function outOfBounds(pos) {
  const gameArea = qs('.game-area')
  if (pos[0] < 0) return true
  if (pos[1] < 0) return true
  if (pos[0] >= Number(gameArea.dataset.columns)) return true
  if (pos[1] >= Number(gameArea.dataset.rows)) return true
  return false
}

function changeCellNumber(cell, change, circle) {
  if (circle) {
    const newNumber = Number(cell.dataset.number) + change
    if (newNumber > 4) cell.dataset.number = newNumber - 4
    if (newNumber < 0) cell.dataset.number = newNumber + 4
  } else {
    cell.dataset.number = Math.min(4, Number(cell.dataset.number) + change)
    cell.dataset.number = Math.max(0, Number(cell.dataset.number))
  }
}

function setCellNumber(cell, number) {
  cell.dataset.number = number
}

function spread(cell) {
  const pos = [Number(cell.dataset.x), Number(cell.dataset.y)]
  const upPos = [pos[0], pos[1] - 1]
  if (!outOfBounds(upPos)) changeCellNumber(getCell(upPos), 1, true)
  const downPos = [pos[0], pos[1] + 1]
  if (!outOfBounds(downPos)) changeCellNumber(getCell(downPos), 1, true)
  const leftPos = [pos[0] - 1, pos[1]]
  if (!outOfBounds(leftPos)) changeCellNumber(getCell(leftPos), 1, true)
  const rightPos = [pos[0] + 1, pos[1]]
  if (!outOfBounds(rightPos)) changeCellNumber(getCell(rightPos), 1, true)
  setCellNumber(cell, randomIntFromRange(0, 4))
}

function verticalKill(cell) {
  const pos = [Number(cell.dataset.x), Number(cell.dataset.y)]
  const upPos = [pos[0], pos[1] - 1]
  if (!outOfBounds(upPos)) changeCellNumber(getCell(upPos), -1, false)
  const downPos = [pos[0], pos[1] + 1]
  if (!outOfBounds(downPos)) changeCellNumber(getCell(downPos), -1, false)
}

function horizontalKill(cell) {
  const pos = [Number(cell.dataset.x), Number(cell.dataset.y)]
  const leftPos = [pos[0] - 1, pos[1]]
  if (!outOfBounds(leftPos)) changeCellNumber(getCell(leftPos), -1, false)
  const rightPos = [pos[0] + 1, pos[1]]
  if (!outOfBounds(rightPos)) changeCellNumber(getCell(rightPos), -1, false)
}

function crossBreed(cell) {
  const pos = [Number(cell.dataset.x), Number(cell.dataset.y)]
  const number = cell.dataset.number
  const upLeftPos = [pos[0] - 1, pos[1] - 1]
  if (!outOfBounds(upLeftPos))
    setCellNumber(getCell(upLeftPos), randomIntFromRange(0, 4))
  const downLeftPos = [pos[0] - 1, pos[1] + 1]
  if (!outOfBounds(downLeftPos))
    setCellNumber(getCell(downLeftPos), randomIntFromRange(0, 4))
  const upRightPos = [pos[0] + 1, pos[1] - 1]
  if (!outOfBounds(upRightPos))
    setCellNumber(getCell(upRightPos), randomIntFromRange(0, 4))
  const downRightPos = [pos[0] + 1, pos[1] + 1]
  if (!outOfBounds(downRightPos))
    setCellNumber(getCell(downRightPos), randomIntFromRange(0, 4))
  setCellNumber(cell, randomIntFromRange(0, 4))
}

function shrink(cell) {
  changeCellNumber(cell.dataset.number, -1, true)
}

window.addEventListener('resize', () => {
  initialize()
})
