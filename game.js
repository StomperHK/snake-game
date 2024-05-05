const canvasEL = document.querySelector('[data-js="canvas"]')
const canvasContext = canvasEL.getContext("2d")
const pixelSize = 15

let snakePositions = [{x:3, y: 5}, {x:2, y: 5}, {x:1, y: 5}]
let directionX = 1
let directionY = 0


function moveSnake() {
  const snakeHead = {...snakePositions[0]}
  const snakeTail = snakePositions[snakePositions.length -1]

  snakePositions.unshift({x: snakeHead.x + directionX, y: snakeHead.y + directionY})   // push snake 1 pixel forward

  snakePositions.forEach(({x, y}) => {
    canvasContext.fillStyle = "yellow"
    canvasContext.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize)  // paint whole snake
  })

  canvasContext.clearRect(snakeTail.x * pixelSize, snakeTail.y * pixelSize, pixelSize, pixelSize)   // remove snake tail from canvas

  snakePositions.pop()  // remove tail 
}

function changeSnakeDirection(event) {
  const pressedKey = event.key

  if (pressedKey === "ArrowUp" && directionY === 0) {
    directionX = 0
    directionY = -1
  }
  else if (pressedKey === "ArrowLeft" && directionX === 0) {
    directionX = -1
    directionY = 0
  }
  else if (pressedKey === "ArrowDown" && directionY === 0) {
    directionX = 0
    directionY = 1
  }
  else if (pressedKey === "ArrowRight" && directionX === 0) {
    directionX = 1
    directionY = 0
  }
}
setInterval(moveSnake, 100)

document.addEventListener("keydown", changeSnakeDirection)
