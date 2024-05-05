const canvasEL = document.querySelector('[data-js="canvas"]')
const canvasContext = canvasEL.getContext("2d")
const pixelSize = 20

let snakePositions = [{x:3, y: 5}, {x:2, y: 5}, {x:1, y: 5}]
let directionX = 1
let directionY = 0


function moveSnake() {
  let previousSnakePartPosition = {}

  canvasContext.fillStyle = "yellow"

  snakePositions.forEach((snakePartPosition, snakePartIndex) => {
    const snakePartIsTheHead = !snakePartIndex

    if (snakePartIsTheHead) {
      previousSnakePartPosition = {...snakePartPosition}

      snakePartPosition.x += directionX
      snakePartPosition.y += directionY
    }
    else {
      const temporaryVariable = {...snakePartPosition}

      snakePartPosition.x = previousSnakePartPosition.x
      snakePartPosition.y = previousSnakePartPosition.y

      previousSnakePartPosition = temporaryVariable
    }

    ({x, y} = snakePartPosition)

    canvasContext.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize)
  })

  canvasContext.clearRect(previousSnakePartPosition.x * pixelSize, previousSnakePartPosition.y * pixelSize, pixelSize, pixelSize)
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
// setInterval(moveSnake, 150)

document.addEventListener("keydown", changeSnakeDirection)
