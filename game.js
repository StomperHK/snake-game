const scorePlaceholderEL = document.querySelector('[data-js="score-placeholder"]')
const canvasEL = document.querySelector('[data-js="canvas"]')
const canvasContext = canvasEL.getContext("2d")

let snakePositions = [{x:3, y: 5}, {x:2, y: 5}, {x:1, y: 5}]
let foodPosition = {}
let points = 0
const pixelSize = 20

let directionX = 1
let directionY = 0
const nextDirection = {x: 1, y: 0}    // this will be used to store the final snake position, preventing that it moves to the opposite direction immediatly

let gameInterval = null
let gameMaxNumberOfColumns = canvasEL.width / pixelSize
let gameMaxNumberOfRows = canvasEL.height / pixelSize


function updateSnakeDirection() {
  directionX = nextDirection.x
  directionY = nextDirection.y
}

function snakeShouldDie(headPosition) {
  if (headPosition.x === -1 || headPosition.y === -1) {   // snake hitted the top or the left of the canvas
    return true
  }

  else if (headPosition.x === gameMaxNumberOfColumns || headPosition.y === gameMaxNumberOfRows) {   // snake hitted the right or the bottom of the canvas
    return true
  }

  const snakePositionsWithoutHead = snakePositions.slice(1)
  const snakeHittedItself = snakePositionsWithoutHead.some(({x, y}) => headPosition.x === x && headPosition.y === y)

  if (snakeHittedItself) return true
}

function updateScore() {
  scorePlaceholderEL.classList.add("shake-number")
  setTimeout(() => scorePlaceholderEL.classList.remove("shake-number"), 80)
  scorePlaceholderEL.textContent = ++points
}

function snakeAteTheFood(headPosition) {
  if (headPosition.x === foodPosition.x && headPosition.y === foodPosition.y) {   // snake ate the food
    generateFood()
    updateScore()
    return true
  }
  else {
    return false
  }
}

function moveSnake() {
  const snakeHead = {...snakePositions[0]}
  const snakeTail = snakePositions[snakePositions.length -1]

  updateSnakeDirection()

  snakePositions.unshift({x: snakeHead.x + directionX, y: snakeHead.y + directionY})   // push snake 1 pixel forward

  if (!snakeAteTheFood(snakePositions[0])) {
    canvasContext.clearRect(snakeTail.x * pixelSize, snakeTail.y * pixelSize, pixelSize, pixelSize)   // remove snake tail from canvas
  
    snakePositions.pop()  // remove tail
  }

  if (snakeShouldDie(snakePositions[0])) {
    clearInterval(gameInterval)
    return
  }

  snakePositions.forEach(({x, y}, index) => {    // paint whole snake
    index ? canvasContext.fillStyle = "yellow" : canvasContext.fillStyle = "rgb(255, 215, 0)"
    
    canvasContext.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize)
  })

}

function generateFood() {
  while (true) {
    const randomPositionX = Math.floor(Math.random() * (gameMaxNumberOfColumns - 1))
    const randomPositionY = Math.floor(Math.random() * (gameMaxNumberOfRows - 1))

    const generatedPositionIsTaken = snakePositions.some(partPosition => partPosition.x === randomPositionX && partPosition.y === randomPositionY)

    if (!generatedPositionIsTaken) {
      foodPosition = {x: randomPositionX, y: randomPositionY}

      canvasContext.fillStyle = "gray"
      canvasContext.fillRect(randomPositionX * pixelSize, randomPositionY * pixelSize, pixelSize, pixelSize)

      break
    }
  }
}

function changeSnakeDirection(event) {
  const pressedKey = event.key

  if (pressedKey === "ArrowUp" && directionY === 0) {
    nextDirection.x = 0
    nextDirection.y = -1
  }
  else if (pressedKey === "ArrowLeft" && directionX === 0) {
    nextDirection.x = -1
    nextDirection.y = 0
  }
  else if (pressedKey === "ArrowDown" && directionY === 0) {
    nextDirection.x = 0
    nextDirection.y = 1
  }
  else if (pressedKey === "ArrowRight" && directionX === 0) {
    nextDirection.x = 1
    nextDirection.y = 0
  }
}

function init() {
  moveSnake()
  generateFood()

  gameInterval = setInterval(moveSnake, 80)
}

init()


document.addEventListener("keydown", changeSnakeDirection)
