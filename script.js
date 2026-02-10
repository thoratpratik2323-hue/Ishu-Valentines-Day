document.addEventListener('DOMContentLoaded', () => {

    // --- References ---
    const giftBox = document.getElementById('giftBox');
    const surpriseContent = document.getElementById('surprise');
    const musicBtn = document.getElementById('musicBtn');
    const bgMusic = document.getElementById('bgMusic');
    const acceptBtn = document.getElementById('acceptBtn');
    const canvas = document.getElementById('fireworks');
    const ctx = canvas.getContext('2d');

    // --- State ---
    let isBoxOpen = false;
    let isPlaying = false;
    let fireworkTimer;

    // --- Box Open Logic ---
    giftBox.addEventListener('click', () => {
        if (isBoxOpen) return;
        isBoxOpen = true;

        // 1. Play Music (if not already)
        bgMusic.play().then(() => {
            isPlaying = true;
            musicBtn.textContent = "⏸️ Pause Music";
        }).catch(e => console.log("Audio play blocked", e));

        // 2. Open Animation
        giftBox.classList.add('open'); // CSS does lid rotate & box move down

        // 3. Show Surprise after delay
        setTimeout(() => {
            giftBox.style.display = 'none'; // Hide box completely
            surpriseContent.style.opacity = '1';
            surpriseContent.classList.add('show');

            // Start Fireworks Loop
            // startFireworks(); // REMOVED: Wait for click
        }, 1500);
    });

    // --- Accept Button Logic ---
    acceptBtn.addEventListener('click', () => {
        startFireworks(); // START HERE

        // Massive Fireworks Finale
        for (let i = 0; i < 30; i++) {
            setTimeout(() => createFirework(window.innerWidth / 2, window.innerHeight / 2), i * 100);
        }

        acceptBtn.textContent = "Thank You! I Love You! ❤️";
        acceptBtn.style.background = "#00e676";
        acceptBtn.disabled = true;

        // Show Video Message after 5 seconds
        setTimeout(() => {
            const videoContainer = document.getElementById('videoContainer');
            const myVideo = document.getElementById('myVideo');

            videoContainer.classList.remove('hidden');
            // Force reflow for opacity transition
            void videoContainer.offsetWidth;
            videoContainer.classList.add('show');

            // Pause BG Music
            bgMusic.pause();
            musicBtn.textContent = "🎵 Play Music";
            isPlaying = false;

            // Play Video
            myVideo.play().catch(e => console.log("Video Play Error", e));
        }, 5000);
    });

    // --- Close Video Logic ---
    const closeVideoBtn = document.getElementById('closeVideoBtn');
    const videoContainer = document.getElementById('videoContainer');
    const myVideo = document.getElementById('myVideo');

    closeVideoBtn.addEventListener('click', () => {
        myVideo.pause();
        videoContainer.classList.remove('show');
        setTimeout(() => {
            videoContainer.classList.add('hidden');
        }, 1000);

        // Resume BG Music (Optional)
        bgMusic.play().then(() => {
            isPlaying = true;
            musicBtn.textContent = "⏸️ Pause Music";
        });
    });

    // --- Music Button ---
    musicBtn.addEventListener('click', () => {
        if (isPlaying) {
            bgMusic.pause();
            musicBtn.textContent = "🎵 Play Music";
            isPlaying = false;
        } else {
            bgMusic.play().then(() => {
                musicBtn.textContent = "⏸️ Pause Music";
                isPlaying = true;
            });
        }
    });

    // --- Fireworks System (Simple Particle System) ---
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particles = [];

    function startFireworks() {
        setInterval(() => {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height / 2; // Top half
            createFirework(x, y);
        }, 800);
        animate();
    }

    function createFirework(x, y) {
        const color = `hsl(${Math.random() * 360}, 100%, 50%)`;
        for (let i = 0; i < 50; i++) {
            particles.push(new Particle(x, y, color));
        }
    }

    class Particle {
        constructor(x, y, color) {
            this.x = x;
            this.y = y;
            this.color = color;
            const angle = Math.random() * Math.PI * 2;
            const velocity = Math.random() * 5 + 2;
            this.vx = Math.cos(angle) * velocity;
            this.vy = Math.sin(angle) * velocity;
            this.alpha = 1;
            this.decay = Math.random() * 0.02 + 0.01;
            this.gravity = 0.05;
        }

        draw() {
            ctx.save();
            ctx.globalAlpha = this.alpha;
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.vy += this.gravity;
            this.alpha -= this.decay;
        }
    }

    function animate() {
        requestAnimationFrame(animate);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'; // Trail effect
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        particles.forEach((p, index) => {
            if (p.alpha > 0) {
                p.update();
                p.draw();
            } else {
                particles.splice(index, 1);
            }
        });
    }

    // Resize Canvas
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

});
