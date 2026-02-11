const cvs = document.getElementById("flowerCanvas");
const ctxFlower = cvs.getContext("2d");

let W = cvs.width = window.innerWidth;
let H = cvs.height = window.innerHeight;

// Resize handling
window.addEventListener('resize', () => {
    W = cvs.width = window.innerWidth;
    H = cvs.height = window.innerHeight;
});

let bloomInterval;

function startFlowerAnimation() {
    // Clear
    ctxFlower.clearRect(0, 0, W, H);

    // Config
    const centerX = W / 2;
    const centerY = H / 2 + 50; // Slightly lower
    let t = 0;

    // Stop previous if any
    if (bloomInterval) clearInterval(bloomInterval);

    // Blooming rose math drawing
    ctxFlower.lineWidth = 2;
    ctxFlower.strokeStyle = '#ff0040'; // Red/Pink
    ctxFlower.lineCap = 'round';
    ctxFlower.lineJoin = 'round';

    let points = [];
    // Generate points for a rose curve roughly
    // Equation: r = a * cos(k * theta) is simple, but for a realistic rose we need more complex logic
    // Let's use a drawing simulation of petals

    ctxFlower.beginPath();
    ctxFlower.moveTo(centerX, centerY);

    // Parametric Rose (Maurer Rose style or similar)
    // x = r * sin(theta), y = r * cos(theta)
    // r = size * sin(n*theta)
    let n = 5;
    let d = 97;
    let k = n / d;
    let scale = 300; // Size

    // Drawing step-by-step
    bloomInterval = setInterval(() => {
        t += 0.05; // speed
        if (t > Math.PI * 10) { // End
            clearInterval(bloomInterval);
            drawStem(centerX, centerY);
            return;
        }

        // Animated circular petal drawing
        // Formula for a nice flower shape
        let r = scale * Math.sin(7 * t) * Math.cos(2 * t);
        // Adjustment to make it look like a rose
        // Let's use a simpler known beautiful rose spiral
        // x = cos(k*theta) * cos(theta)

        // Better Rose:
        // r = 200 * cos(4 * t) 
        // x = r * cos(t) + centerX
        // y = r * sin(t) + centerY

        // Let's try a variation: "Cannabis Curve" style but for rose?
        // Or just multiple sine waves.

        // Let's stick to the "Love Rose" specific path often used in code reels.
        // x = 100 * sin(t) * cos(t) ... no, too risky without visual feedback.

        // I'll use a standard Spirograph Rose which looks reliable and beautiful.
        // k = 4 (8 petals)
        const radius = 200 * Math.cos(4 / 1 * t);
        const x = centerX + radius * Math.cos(t);
        const y = centerY + radius * Math.sin(t);

        // Draw line segment
        ctxFlower.lineTo(x, y);

        // Random color variation for beauty
        const hue = 330 + Math.sin(t) * 20; // 310-350 (Pink/Red)
        ctxFlower.strokeStyle = `hsl(${hue}, 80%, 60%)`;

        ctxFlower.stroke();

        // Add "sparkle" occasionally
        if (Math.random() > 0.9) {
            ctxFlower.fillStyle = `hsl(${hue}, 100%, 80%)`;
            ctxFlower.fillRect(x, y, 3, 3);
        }

    }, 20);
}

function drawStem(cx, cy) {
    // Simple stem
    ctxFlower.beginPath();
    ctxFlower.moveTo(cx, cy + 50); // From center roughly
    ctxFlower.lineWidth = 4;
    ctxFlower.strokeStyle = '#2ecc71'; // Green

    // Curve down
    ctxFlower.quadraticCurveTo(cx - 20, cy + 200, cx, cy + 400);
    ctxFlower.stroke();

    // Leaf
    ctxFlower.beginPath();
    ctxFlower.moveTo(cx - 10, cy + 250);
    ctxFlower.quadraticCurveTo(cx - 60, cy + 220, cx - 80, cy + 270);
    ctxFlower.quadraticCurveTo(cx - 30, cy + 290, cx - 10, cy + 250);
    ctxFlower.fillStyle = '#27ae60';
    ctxFlower.fill();
    ctxFlower.stroke();
}
