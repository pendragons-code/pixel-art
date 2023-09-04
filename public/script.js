const canvas = document.getElementById("pixel-canvas");
const ctx = canvas.getContext("2d");
ctx.willReadFrequently = true;
const colorPicker = document.getElementById("colorPicker");
const eraserButton = document.getElementById("eraser");
const clearButton = document.getElementById("clear");
const downloadButton = document.getElementById("download");
const undoButton = document.getElementById("undo");
const redoButton = document.getElementById("redo");

let pixelSize = 10;
let drawing = false;
let eraserActive = false;

const commandHistory = []; // Stack to keep track of commands for undo and redo
let currentIndex = -1; // Index to track the current command

canvas.width = 1920;
canvas.height = 1080;

ctx.fillStyle = "#ffffff";
ctx.fillRect(0, 0, canvas.width, canvas.height);

class Command {
	constructor() {
		this.stateBefore = ctx.getImageData(0, 0, canvas.width, canvas.height);
	}

	execute() {
		// This method should apply the command's action
	}

	undo() {
		ctx.putImageData(this.stateBefore, 0, 0);
	}
}

class DrawPixelCommand extends Command {
	constructor(x, y, color) {
		super();
		this.x = x;
		this.y = y;
		this.color = color;
	}

	execute() {
		super.execute();
		// Draw a block of pixels (e.g., a square)
		ctx.fillStyle = this.color;
		ctx.fillRect(this.x, this.y, pixelSize, pixelSize);
	}

	undo() {
		// Clear the block of pixels to the previous state
		ctx.putImageData(this.stateBefore, 0, 0);
	}
}

canvas.addEventListener("mousedown", () => {
	drawing = true;
	saveCanvasState();
	if (eraserActive) {
		canvas.style.cursor = "crosshair";
	} else {
		canvas.style.cursor = "crosshair";
	}
});

canvas.addEventListener("mouseup", () => {
	drawing = false;
	canvas.style.cursor = eraserActive ? "crosshair" : "crosshair";
});

canvas.addEventListener("mousemove", (e) => {
	if (!drawing) return;
	const rect = canvas.getBoundingClientRect();
	const x = Math.floor((e.clientX - rect.left) / pixelSize) * pixelSize;
	const y = Math.floor((e.clientY - rect.top) / pixelSize) * pixelSize;
	const color = eraserActive ? "#ffffff" : colorPicker.value;
	if (eraserActive) {
		executeCommand(new DrawPixelCommand(x, y, "#ffffff"));
	} else {
		executeCommand(new DrawPixelCommand(x, y, color));
	}
});

colorPicker.addEventListener("input", () => {
	eraserActive = false;
	eraserButton.textContent = "Eraser: Off";
	canvas.style.cursor = "crosshair";
});

eraserButton.addEventListener("click", () => {
	eraserActive = !eraserActive;
	eraserButton.textContent = eraserActive ? "Eraser: On" : "Eraser: Off";
	canvas.style.cursor = eraserActive ? "crosshair" : "crosshair";
});

clearButton.addEventListener("click", () => {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	saveCanvasState();
	updateUndoRedoButtons();
});

downloadButton.addEventListener("click", () => {
	const link = document.createElement("a");
	link.href = canvas.toDataURL("image/png");
	link.download = "pixel-art.png";
	link.click();
});

undoButton.addEventListener("click", undo);
redoButton.addEventListener("click", redo);

function saveCanvasState() {
	++currentIndex;
	commandHistory.length = currentIndex + 1;
	const command = new Command();
	commandHistory.push(command);
	updateUndoRedoButtons();
}

function executeCommand(command) {
	command.execute();
	++currentIndex;
	commandHistory.length = currentIndex + 1;
	commandHistory.push(command);
	updateUndoRedoButtons();
}

function undo() {
	if (currentIndex >= 0) {
		commandHistory[currentIndex].undo();
		--currentIndex;
		updateUndoRedoButtons();
	}
}

function redo() {
	if (currentIndex < commandHistory.length - 1) {
		++currentIndex;
		commandHistory[currentIndex].execute();
		updateUndoRedoButtons();
	}
}

function updateUndoRedoButtons() {
	undoButton.disabled = currentIndex < 0;
	redoButton.disabled = currentIndex >= commandHistory.length - 1;
}

