const gameArea = document.getElementById("gameArea");
const character = document.getElementById("character");
const scoreDisplay = document.getElementById("score");
const startButton = document.getElementById("startButton");
const modal = document.getElementById("modal");
const closeModal = document.getElementById("closeModal");
const finalScore = document.getElementById("finalScore");
let score = 0;
let gameLoop;
let objectInterval = 1000; // Start with 1 second interval
let gameActive = false;
let characterX = 190;
let characterY = 190;
const speed = 8; // Increased speed from 5 to 8

startButton.addEventListener("click", startGame);
closeModal.addEventListener("click", () => {
  modal.style.display = "none";
});

function updateCharacterPosition() {
  character.style.left = `${characterX}px`;
  character.style.top = `${characterY}px`;
}

document.addEventListener("keydown", moveCharacter);

function moveCharacter(e) {
  if (!gameActive) return;

  switch (e.key) {
    case "ArrowLeft":
      characterX = Math.max(0, characterX - speed);
      break;
    case "ArrowRight":
      characterX = Math.min(380, characterX + speed);
      break;
    case "ArrowUp":
      characterY = Math.max(0, characterY - speed);
      break;
    case "ArrowDown":
      characterY = Math.min(380, characterY + speed);
      break;
  }
  updateCharacterPosition();
}

function createObject() {
  if (!gameActive) return;

  const object = document.createElement("div");
  object.classList.add("object");
  object.style.left = `${Math.random() * 390}px`;
  object.style.top = `${Math.random() * 390}px`;
  gameArea.appendChild(object);

  function moveTowardsCharacter() {
    if (!gameActive) {
      object.remove();
      return;
    }

    const objLeft = parseFloat(object.style.left);
    const objTop = parseFloat(object.style.top);

    const angle = Math.atan2(characterY - objTop, characterX - objLeft);
    const newLeft = objLeft + Math.cos(angle) * 1;
    const newTop = objTop + Math.sin(angle) * 1;

    object.style.left = `${newLeft}px`;
    object.style.top = `${newTop}px`;

    if (checkCollision(object, character)) {
      gameOver();
    } else {
      requestAnimationFrame(moveTowardsCharacter);
    }
  }

  moveTowardsCharacter();
}

function checkCollision(obj1, obj2) {
  const rect1 = obj1.getBoundingClientRect();
  const rect2 = obj2.getBoundingClientRect();
  return !(
    rect1.right < rect2.left ||
    rect1.left > rect2.right ||
    rect1.bottom < rect2.top ||
    rect1.top > rect2.bottom
  );
}

function updateScore() {
  if (!gameActive) return;
  score++;
  scoreDisplay.textContent = `Score: ${score}`;
}

function gameOver() {
  gameActive = false;
  clearInterval(gameLoop);

  // Remove all objects from the game area
  const objects = document.querySelectorAll(".object");
  objects.forEach((object) => object.remove());

  finalScore.textContent = `You made ${score} points`;

  // Set a specific GIF for the end game modal
  document.getElementById("gameOverGif").src = "assets/gameover.gif"; // Update the GIF URL if needed

  modal.style.display = "block";
  startButton.disabled = false;
}

function startGame() {
  gameActive = true;
  score = 0;
  objectInterval = 1000;
  scoreDisplay.textContent = "Score: 0";
  // Reset character position without removing it from the DOM
  characterX = 190;
  characterY = 190;
  updateCharacterPosition();
  startButton.disabled = true;

  gameLoop = setInterval(() => {
    createObject();
    updateScore();
  }, objectInterval);

  // Increase difficulty every minute
  setInterval(() => {
    if (gameActive && objectInterval > 100) {
      objectInterval -= 100;
      clearInterval(gameLoop);
      gameLoop = setInterval(() => {
        createObject();
        updateScore();
      }, objectInterval);
    }
  }, 60000);
}

document
  .getElementById("shareResult")
  .addEventListener("click", shareGameResult);

function shareGameResult() {
  const playerName = document.getElementById("playerName").value.trim();
  if (!playerName) {
    alert("Please enter your name before sharing!");
    return;
  }

  const resultMessage = `${playerName} scored ${score} points in the game! Can you beat my score? Check it out here: https://github.com/devgl96/cadeira_game`;

  // Create a temporary text area to copy the message
  const tempTextArea = document.createElement("textarea");
  tempTextArea.value = resultMessage;
  document.body.appendChild(tempTextArea);
  tempTextArea.select();
  document.execCommand("copy");
  document.body.removeChild(tempTextArea);

  // Show the share message to the user
  const shareMessage = document.getElementById("shareMessage");
  shareMessage.style.display = "block";
  shareMessage.textContent =
    "Result copied to clipboard! Share it with your friends.";

  // Optional: You can also add social media sharing links
  // Example for Twitter:
  //   const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
  //     resultMessage
  //   )}`;
  //   window.open(twitterShareUrl, "_blank");
}