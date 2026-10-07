const GRID_SIZE = 5;
const IMAGE_URL = "medha.jpeg";

const board = document.getElementById("puzzleBoard");
const tray = document.getElementById("pieceTray");
const moveCountDisplay = document.getElementById("moveCount");
const completionScreen = document.getElementById("completionScreen");

let selectedPiece = null;
let moves = 0;
let piecesPlaced = 0;

function startGame() {
    selectedPiece = null;
    moves = 0;
    piecesPlaced = 0;

    moveCountDisplay.textContent = "0";
    board.innerHTML = "";
    tray.innerHTML = "";

    board.style.gridTemplateColumns = `repeat(${GRID_SIZE}, 1fr)`;
    board.style.gridTemplateRows = `repeat(${GRID_SIZE}, 1fr)`;

    const backgroundSize = `${GRID_SIZE * 100}% ${GRID_SIZE * 100}%`;
    const pieces = [];

    // Create puzzle slots
    for (
        let position = 0;
        position < GRID_SIZE * GRID_SIZE;
        position++
    ) {
        const slot = document.createElement("div");

        slot.className = "slot";
        slot.dataset.position = position;

        slot.addEventListener("click", () => {
            handleSlotClick(slot);
        });

        slot.addEventListener("dragover", (event) => {
            event.preventDefault();
            slot.classList.add("drag-over");
        });

        slot.addEventListener("dragleave", () => {
            slot.classList.remove("drag-over");
        });

        slot.addEventListener("drop", (event) => {
            event.preventDefault();
            slot.classList.remove("drag-over");

            if (selectedPiece) {
                tryPlacePiece(selectedPiece, slot);
            }
        });

        board.appendChild(slot);
    }

    // Create puzzle pieces
    for (let row = 0; row < GRID_SIZE; row++) {
        for (let column = 0; column < GRID_SIZE; column++) {
            const correctPosition = row * GRID_SIZE + column;

            const piece = document.createElement("div");

            piece.className = "piece";
            piece.dataset.position = correctPosition;

            piece.style.backgroundImage = `url("${IMAGE_URL}")`;
            piece.style.backgroundSize = backgroundSize;

            const xPercent =
                column === 0
                    ? 0
                    : (column / (GRID_SIZE - 1)) * 100;

            const yPercent =
                row === 0
                    ? 0
                    : (row / (GRID_SIZE - 1)) * 100;

            piece.style.backgroundPosition = `${xPercent}% ${yPercent}%`;

            piece.draggable = true;

            piece.addEventListener("dragstart", () => {
                selectPiece(piece);
            });

            piece.addEventListener("click", (event) => {
                event.stopPropagation();
                selectPiece(piece);
            });

            pieces.push(piece);
        }
    }

    // Shuffle pieces
    shuffleArray(pieces);

    pieces.forEach((piece) => {
        tray.appendChild(piece);
    });
}

function selectPiece(piece) {
    document
        .querySelectorAll(".piece.selected")
        .forEach((item) => {
            item.classList.remove("selected");
        });

    selectedPiece = piece;
    piece.classList.add("selected");
}

function handleSlotClick(slot) {
    if (!selectedPiece) {
        return;
    }

    tryPlacePiece(selectedPiece, slot);
}

function tryPlacePiece(piece, slot) {
    // Don't allow placing a piece into an occupied slot
    if (slot.children.length > 0) {
        return;
    }

    moves++;
    moveCountDisplay.textContent = moves;

    const piecePosition = Number(piece.dataset.position);
    const slotPosition = Number(slot.dataset.position);

    if (piecePosition === slotPosition) {
        piece.classList.remove("selected");
        piece.draggable = false;

        slot.appendChild(piece);

        slot.classList.add("correct-flash");

        setTimeout(() => {
            slot.classList.remove("correct-flash");
        }, 450);

        selectedPiece = null;
        piecesPlaced++;

        if (piecesPlaced === GRID_SIZE * GRID_SIZE) {
            setTimeout(puzzleComplete, 650);
        }
    } else {
        piece.animate(
            [
                { transform: "translateX(0)" },
                { transform: "translateX(-6px)" },
                { transform: "translateX(6px)" },
                { transform: "translateX(0)" }
            ],
            {
                duration: 260
            }
        );
    }
}

function puzzleComplete() {
    launchConfetti();

    setTimeout(() => {
        completionScreen.classList.add("show");
    }, 650);
}

function closeLetter() {
    completionScreen.classList.remove("show");
}

function restartGame() {
    completionScreen.classList.remove("show");
    startGame();
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));

        [array[i], array[j]] = [array[j], array[i]];
    }
}

function launchConfetti() {
    const container = document.getElementById("confettiContainer");

    const colors = [
        "#183b56",
        "#2e5d7b",
        "#4f7d9a",
        "#7fa6bc",
        "#dceaf3",
        "#a9c4d3"
    ];

    for (let i = 0; i < 120; i++) {
        const confetti = document.createElement("div");

        confetti.className = "confetti";

        confetti.style.left = Math.random() * 100 + "vw";

        confetti.style.background =
            colors[Math.floor(Math.random() * colors.length)];

        confetti.style.width =
            6 + Math.random() * 8 + "px";

        confetti.style.height =
            8 + Math.random() * 12 + "px";

        confetti.style.animationDuration =
            2.5 + Math.random() * 2.2 + "s";

        confetti.style.animationDelay =
            Math.random() * 0.7 + "s";

        container.appendChild(confetti);

        setTimeout(() => {
            confetti.remove();
        }, 5500);
    }
}

function createBackgroundHearts() {
    const container =
        document.getElementById("backgroundHearts");

    const symbols = ["18", "18", "18", "18"];

    // Floating numbers
    for (let i = 0; i < 18; i++) {
        const number = document.createElement("span");

        number.className = "floating-heart";

        number.textContent =
            symbols[Math.floor(Math.random() * symbols.length)];

        number.style.left = Math.random() * 100 + "%";

        number.style.fontSize =
            16 + Math.random() * 24 + "px";

        number.style.fontWeight =
            Math.random() > 0.5 ? "600" : "700";

        number.style.animationDuration =
            12 + Math.random() * 15 + "s";

        number.style.animationDelay =
            Math.random() * -20 + "s";

        container.appendChild(number);
    }

    // Floating balloons
    const balloonColors = [
        "#183b56",
        "#2e5d7b",
        "#4f7d9a",
        "#7fa6bc",
        "#a9c4d3"
    ];

    for (let i = 0; i < 10; i++) {
        const balloon = document.createElement("span");

        balloon.className = "floating-balloon";

        balloon.style.background =
            balloonColors[
                Math.floor(Math.random() * balloonColors.length)
            ];

        balloon.style.left =
            Math.random() * 100 + "%";

        const size = 24 + Math.random() * 20;

        balloon.style.width = size + "px";
        balloon.style.height = size * 1.3 + "px";

        balloon.style.animationDuration =
            14 + Math.random() * 16 + "s";

        balloon.style.animationDelay =
            Math.random() * -25 + "s";

        container.appendChild(balloon);
    }
}

createBackgroundHearts();
startGame();
