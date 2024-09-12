let canvas = document.getElementById('whiteboard');
let ctx = canvas.getContext('2d');
let currentColor = 'black';
let penSize = 3;  // Default pen size
let eraserSize = 10;  // Default eraser size
let isDrawing = false;
let pages = [document.createElement('canvas')];
let currentPage = 0;

// Set canvas size
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight * 0.8;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (pages[currentPage]) {
        ctx.drawImage(pages[currentPage], 0, 0);
    }
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Update canvas background color
document.getElementById('boardColor').addEventListener('change', (e) => {
    canvas.style.backgroundColor = e.target.value;
});

// Update pen color
document.getElementById('penColor').addEventListener('change', (e) => {
    currentColor = e.target.value;
});

// Adjust pen size
document.getElementById('increasePenSize').addEventListener('click', () => {
    penSize = Math.min(penSize + 1, 50);  // Limit pen size to 50
    document.getElementById('penSizeDisplay').textContent = penSize;
});
document.getElementById('decreasePenSize').addEventListener('click', () => {
    penSize = Math.max(penSize - 1, 1);  // Minimum pen size is 1
    document.getElementById('penSizeDisplay').textContent = penSize;
});

// Adjust eraser size
document.getElementById('increaseEraserSize').addEventListener('click', () => {
    eraserSize = Math.min(eraserSize + 1, 50);  // Limit eraser size to 50
    document.getElementById('eraserSizeDisplay').textContent = eraserSize;
});
document.getElementById('decreaseEraserSize').addEventListener('click', () => {
    eraserSize = Math.max(eraserSize - 1, 5);  // Minimum eraser size is 5
    document.getElementById('eraserSizeDisplay').textContent = eraserSize;
});

// Drawing on the canvas (for both mouse and touch)
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('touchstart', startDrawing);
canvas.addEventListener('touchend', stopDrawing);
canvas.addEventListener('touchmove', drawTouch);

function startDrawing(e) {
    if (e.target === canvas) {
        e.preventDefault();
        isDrawing = true;
        ctx.beginPath();
        ctx.moveTo(getX(e), getY(e));
    }
}

function stopDrawing() {
    isDrawing = false;
    ctx.beginPath();
}

function draw(e) {
    if (!isDrawing) return;
    ctx.strokeStyle = currentColor;
    ctx.lineWidth = penSize;
    ctx.lineCap = 'round';
    ctx.lineTo(getX(e), getY(e));
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(getX(e), getY(e));
}

function drawTouch(e) {
    if (!isDrawing || e.target !== canvas) return;
    e.preventDefault();  // Prevent scrolling while drawing inside the canvas
    let touch = e.touches[0];
    ctx.strokeStyle = currentColor;
    ctx.lineWidth = penSize;
    ctx.lineCap = 'round';
    ctx.lineTo(touch.clientX - canvas.offsetLeft, touch.clientY - canvas.offsetTop);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(touch.clientX - canvas.offsetLeft, touch.clientY - canvas.offsetTop);
}

// Utility function to get the correct x, y coordinates for both mouse and touch events
function getX(e) {
    if (e.type.startsWith('touch')) {
        return e.touches[0].clientX - canvas.offsetLeft;
    } else {
        return e.clientX - canvas.offsetLeft;
    }
}

function getY(e) {
    if (e.type.startsWith('touch')) {
        return e.touches[0].clientY - canvas.offsetTop;
    } else {
        return e.clientY - canvas.offsetTop;
    }
}

// Eraser
document.getElementById('eraser').addEventListener('click', () => {
    currentColor = canvas.style.backgroundColor || 'white';
    penSize = eraserSize;  // Set the pen size to the eraser size
});

// Save current page to pages array
function savePage() {
    let newCanvas = document.createElement('canvas');
    newCanvas.width = canvas.width;
    newCanvas.height = canvas.height;
    newCanvas.getContext('2d').drawImage(canvas, 0, 0);
    pages[currentPage] = newCanvas;
}

// Navigate to the previous page
document.getElementById('previousPage').addEventListener('click', () => {
    if (currentPage > 0) {
        savePage();
        currentPage--;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(pages[currentPage], 0, 0);
    }
});

// Navigate to the next page
document.getElementById('nextPage').addEventListener('click', () => {
    savePage();
    currentPage++;
    if (!pages[currentPage]) {
        let newCanvas = document.createElement('canvas');
        newCanvas.width = canvas.width;
        newCanvas.height = canvas.height;
        pages[currentPage] = newCanvas;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(pages[currentPage], 0, 0);
});


