const scorePlaceholderEL = document.querySelector('[data-js="score-placeholder"]')
const canvasEL = document.querySelector('[data-js="canvas"]')
const canvasContext = canvasEL.getContext("2d")
const beginGameScreenEL = document.querySelector('[data-js="begin-game-screen"]')
const beginGameButtonEL = document.querySelector('[data-js="begin-game-button"]')
const gameOveScreenEL = document.querySelector('[data-js="game-over-screen"]')
const restartGameButtonEL = document.querySelector('[data-js="restart-game-button"]')
const buttonsELs = document.querySelectorAll('[data-js="button"]')
const gameTip = document.querySelector('[data-js="game-tip"]')

let snakePositions = [{x: 3, y: 5}, {x: 2, y: 5}, {x: 1, y: 5}]
let foodPosition = {}
let points = 0
let snakeIsDead = false

let directionX = 1
let directionY = 0
let nextDirectionQueue = []    // this will be used to store the final snake position, preventing that it moves to the opposite direction immediatly

let gameInterval = null
let gameStarted = false
const PIXEL_SIZE = 20
let gameMaxNumberOfColumns = canvasEL.width / PIXEL_SIZE
let gameMaxNumberOfRows = canvasEL.height / PIXEL_SIZE


function updateSnakeDirection() {
  const nextDirection = nextDirectionQueue[0]

  if (nextDirection) {
    directionX = nextDirection.x
    directionY = nextDirection.y

    nextDirectionQueue.shift()
  }
}

function updateScore() {
  scorePlaceholderEL.classList.add("shake-number")
  setTimeout(() => scorePlaceholderEL.classList.remove("shake-number"), 80)
  scorePlaceholderEL.textContent = ++points
}

function snakeAteTheFood(snakeHead) {
  if (snakeHead.x === foodPosition.x && snakeHead.y === foodPosition.y) {   // snake ate the food
    generateFood()
    updateScore()
    return true
  }
  else {
    return false
  }
}

function snakeShouldDie(snakeHead) {
  if (snakeHead.x === -1 || snakeHead.y === -1) {   // snake hitted the top or the left of the canvas
    return true
  }

  else if (snakeHead.x === gameMaxNumberOfColumns || snakeHead.y === gameMaxNumberOfRows) {   // snake hitted the right or the bottom of the canvas
    return true
  }

  const snakePositionsWithoutHead = snakePositions.slice(1)
  const snakeHittedItself = snakePositionsWithoutHead.some(({x, y}) => snakeHead.x === x && snakeHead.y === y)

  if (snakeHittedItself) return true
}

function paintSnakeTail(snakeTail) {
  canvasContext.fillRect(snakeTail.x * PIXEL_SIZE, snakeTail.y * PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE)
}

function gameOver(snakeTail) {
  let audio = new Audio('src/game-over.mp3')
  audio.play()

  paintSnakeTail(snakeTail)
  clearInterval(gameInterval)

  snakeIsDead = true

  gameOveScreenEL.classList.add('canvas-wrapper__game-over--active')
  gameTip.classList.add('game-tip--active')
}

function paintSnake() {
  snakePositions.forEach(({x, y}, index) => {    // paint whole snake
    index ? canvasContext.fillStyle = "yellow" : canvasContext.fillStyle = "rgb(255, 215, 0)"
    
    canvasContext.fillRect(x * PIXEL_SIZE, y * PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE)
  })
}

function moveSnake() {
  const snakeHead = {...snakePositions[0]}
  const snakeTail = snakePositions[snakePositions.length -1]

  updateSnakeDirection()

  snakePositions.unshift({x: snakeHead.x + directionX, y: snakeHead.y + directionY})   // push snake 1 pixel forward

  if (snakeAteTheFood(snakePositions[0])) {
    let audio = new Audio('src/collect.mp3')
    audio.play()
  }
  else {
    canvasContext.clearRect(snakeTail.x * PIXEL_SIZE, snakeTail.y * PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE)   // remove snake tail from canvas
  
    snakePositions.pop()  // remove tail
  }

  if (snakeShouldDie(snakePositions[0])) {
    gameOver(snakeTail)
    return
  }

  paintSnake()
}

function generateFood() {
  while (true) {
    const snakeHead = snakePositions[0]
    const randomPositionX = Math.floor(Math.random() * (gameMaxNumberOfColumns - 1))
    const randomPositionY = Math.floor(Math.random() * (gameMaxNumberOfRows - 1))

    const generatedPositionIsTaken = snakePositions.some(partPosition => partPosition.x === randomPositionX && partPosition.y === randomPositionY)
    const generatedPositionIsAppropriated = (snakeHead.x - randomPositionX <= 5 && snakeHead.x - randomPositionX >= -5) && (snakeHead.y - randomPositionY <= 5 && snakeHead.y - randomPositionY >= -5)    // food will only get generated on the 5 by 5 area near the head
    
    if (!generatedPositionIsTaken && generatedPositionIsAppropriated) {
      foodPosition = {x: randomPositionX, y: randomPositionY}

      canvasContext.fillStyle = "gray"
      canvasContext.fillRect(randomPositionX * PIXEL_SIZE, randomPositionY * PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE)

      break
    }
  }
}

function pushDirectionInQueue(directionObject, pressedKey) {
  const directionQueueIsFull = nextDirectionQueue.length === 2
  const directionQueueIsEmpty = !nextDirectionQueue.length

  if (directionQueueIsFull) {
    return
  }

  if (directionQueueIsEmpty) {
    const validationWhenQueueIsEmpty = {    // compare to the current position
      "ArrowUp": directionY === 0,
      "ArrowLeft": directionX === 0,
      "ArrowDown": directionY === 0,
      "ArrowRight": directionX === 0
    }

    validationWhenQueueIsEmpty[pressedKey] && nextDirectionQueue.push(directionObject)
    return
  }
  
  if (!directionQueueIsFull && !directionQueueIsEmpty) {
    const validationWhenQueueIsNotEmpty = {     // compare to the first object position in queue
      "ArrowUp": nextDirectionQueue[0].y === 0,
      "ArrowLeft": nextDirectionQueue[0].x === 0,
      "ArrowDown": nextDirectionQueue[0].y === 0,
      "ArrowRight": nextDirectionQueue[0].x === 0
    }

    validationWhenQueueIsNotEmpty[pressedKey] && nextDirectionQueue.push(directionObject)
  }
}

function setSnakeDirection(event) {
  const pressedKey = event.key

  if (pressedKey === "ArrowUp") {
    pushDirectionInQueue({x: 0, y: -1}, pressedKey)
  }
  else if (pressedKey === "ArrowLeft") {
    pushDirectionInQueue({x: -1, y: 0}, pressedKey)
  }
  else if (pressedKey === "ArrowDown") {
    pushDirectionInQueue({x: 0, y: 1}, pressedKey)
  }
  else if (pressedKey === "ArrowRight") {
    pushDirectionInQueue({x: 1, y: 0}, pressedKey)
  }
  else if (pressedKey === " " && snakeIsDead) {
    restart()
  }
  else if (pressedKey === " " && !gameStarted) {
    gameStarted = true
    startGame()
  }
}

function init() {
  let audio = new Audio("src/start.mp3")
  
  audio.play()

  beginGameButtonEL.blur()    // removes focus from clicked buttons, this way pressing space won't trigger them blindly
  restartGameButtonEL.blur()

  moveSnake()
  generateFood()

  gameInterval = setInterval(moveSnake, 110)
}

function startGame() {
  gameStarted = true

  beginGameScreenEL.classList.remove("canvas-wrapper__begin-game--active")
  canvasEL.classList.add('blink')
  gameTip.classList.remove('game-tip--active')

  setTimeout(init, 85)

  setTimeout(() => canvasEL.classList.remove('blink'), 150)
}

function restart() {
  // restart game variables
  snakePositions = [{x:3, y: 5}, {x:2, y: 5}, {x:1, y: 5}]
  foodPosition = {}
  points = -1
  snakeIsDead = false
  
  directionX = 1
  directionY = 0
  nextDirection = {x: 1, y: 0}
  
  gameOveScreenEL.classList.remove('canvas-wrapper__game-over--active')   // remove game over screen
  gameTip.classList.remove('game-tip--active')
  canvasEL.classList.add('blink')
  
  setTimeout(() => canvasEL.classList.remove('blink'), 150)
  
  updateScore()
  
  setTimeout(() => {
    canvasContext.clearRect(0, 0, canvasEL.width, canvasEL.height)
    
    init()
  }, 100)
}

function clickMoveButton() {
  setSnakeDirection(this.dataset)

  let audio = new Audio("src/click.mp3")
  audio.play()
}

function handleOnLoad() {
  setTimeout(() => document.body.classList.remove("hide-game"), 200)
  const flexWrapperEL = document.querySelector('[data-js="flex-wrapper"]')

  flexWrapperEL.style = ""  // Google ad-service is reseting this element height
}


window.addEventListener("load", handleOnLoad)

document.addEventListener("keydown", setSnakeDirection)

beginGameButtonEL.addEventListener('click', startGame)

restartGameButtonEL.addEventListener("click", restart)

buttonsELs.forEach(buttonEL => buttonEL.addEventListener('click', clickMoveButton))
