const scorePlaceholderEL = document.querySelector('[data-js="score-placeholder"]')
const canvasEL = document.querySelector('[data-js="canvas"]')
const canvasContext = canvasEL.getContext("2d")

let snakePositions = [{x:3, y: 5}, {x:2, y: 5}, {x:1, y: 5}]
let foodPosition = {}
let directionX = 1
let directionY = 0
let points = 0
const pixelSize = 20
let gameInterval = null
let gameMaxNumberOfColumns = canvasEL.width / pixelSize
let gameMaxNumberOfRows = canvasEL.height / pixelSize


function snakeShouldDie(headPosition) {
  if (headPosition.x === -1 || headPosition.y === -1) {   // snake hitted the top or the left of the canvas
    clearInterval(gameInterval)
    return true
  }

  else if (headPosition.x === gameMaxNumberOfColumns || headPosition.y === gameMaxNumberOfRows) {
    clearInterval(gameInterval)
    return true
  }
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

  snakePositions.unshift({x: snakeHead.x + directionX, y: snakeHead.y + directionY})   // push snake 1 pixel forward

  if (snakeShouldDie(snakePositions[0])) return

  snakePositions.forEach(({x, y}) => {    // paint whole snake
    canvasContext.fillStyle = "yellow"
    canvasContext.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize)
  })

  if (!snakeAteTheFood(snakePositions[0])) {
    canvasContext.clearRect(snakeTail.x * pixelSize, snakeTail.y * pixelSize, pixelSize, pixelSize)   // remove snake tail from canvas
  
    snakePositions.pop()  // remove tail
  }

}

function generateFood() {
  while (true) {
    const randomPositionX = Math.floor(Math.random() * (gameMaxNumberOfColumns - 1))
    const randomPositionY = Math.floor(Math.random() * (gameMaxNumberOfRows - 1))

    console.log(randomPositionX, randomPositionY);

    const generatedPositionIsTaken = snakePositions.some(partPosition => partPosition.x === randomPositionX && partPosition.y === randomPositionY)

    if (!generatedPositionIsTaken) {
      foodPosition = {x: randomPositionX, y: randomPositionY}

      canvasContext.fillStyle = "purple"
      canvasContext.fillRect(randomPositionX * pixelSize, randomPositionY * pixelSize, pixelSize, pixelSize)

      break
    }
  }
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

function init() {
  moveSnake()
  generateFood()

  gameInterval = setInterval(moveSnake, 80)
}

init()


document.addEventListener("keydown", changeSnakeDirection)
