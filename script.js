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
    let fireworksStarted = false;

    // --- Canvas Setup ---
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    let particles = [];

    // --- Box Open Logic ---
    giftBox.addEventListener('click', () => {
        if (isBoxOpen) return;
        isBoxOpen = true;

        // Play Music
        bgMusic.play().then(() => {
            isPlaying = true;
            musicBtn.textContent = "⏸️ Pause Music";
        }).catch(e => console.log("Audio play blocked", e));

        // Open Animation
        giftBox.classList.add('open');

        // Show Surprise after delay
        setTimeout(() => {
            giftBox.style.display = 'none';
            surpriseContent.classList.add('show');
        }, 1500);
    });

    // --- Accept Button Logic ---
    acceptBtn.addEventListener('click', () => {
        startFireworks();

        acceptBtn.textContent = "Thank You! I Love You! ❤️";
        acceptBtn.style.background = "#00e676";
        acceptBtn.disabled = true;

        // Show Video after 5 seconds
        setTimeout(() => {
            const videoContainer = document.getElementById('videoContainer');
            const myVideo = document.getElementById('myVideo');

            videoContainer.classList.remove('hidden');
            void videoContainer.offsetWidth;
            videoContainer.classList.add('show');

            bgMusic.pause();
            musicBtn.textContent = "🎵 Play Music";
            isPlaying = false;

            myVideo.play().catch(e => console.log("Video Play Error", e));
        }, 5000);
    });

    // --- Close Video -> Proposal ---
    const closeVideoBtn = document.getElementById('closeVideoBtn');
    closeVideoBtn.addEventListener('click', () => {
        const videoContainer = document.getElementById('videoContainer');
        const myVideo = document.getElementById('myVideo');
        myVideo.pause();
        videoContainer.classList.remove('show');
        setTimeout(() => {
            videoContainer.classList.add('hidden');
            // Show Proposal!
            const proposalScreen = document.getElementById('proposalScreen');
            proposalScreen.classList.remove('hidden');
            proposalScreen.style.display = 'flex';
        }, 500);

        bgMusic.play().then(() => {
            isPlaying = true;
            musicBtn.textContent = "⏸️ Pause Music";
        });

        // Start Heart Rain
        setInterval(() => {
            const heart = document.createElement('div');
            heart.classList.add('heart-fall');
            heart.innerHTML = '❤️';
            heart.style.left = Math.random() * 100 + 'vw';
            heart.style.animationDuration = Math.random() * 3 + 2 + 's';
            heart.style.position = 'fixed'; // Explicitly set position just in case
            heart.style.top = '-10vh';
            document.body.appendChild(heart);
            setTimeout(() => heart.remove(), 5000);
        }, 300);

    });

    // --- Proposal Logic ---
    const noBtn = document.getElementById('noBtn');
    const yesBtn = document.getElementById('yesBtn');

    // "No" button runs away!
    noBtn.addEventListener('mouseover', () => {
        const x = Math.random() * (window.innerWidth - 100);
        const y = Math.random() * (window.innerHeight - 50);
        noBtn.style.position = 'fixed';
        noBtn.style.left = x + 'px';
        noBtn.style.top = y + 'px';
        noBtn.style.zIndex = '9999';
    });

    noBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        const x = Math.random() * (window.innerWidth - 100);
        const y = Math.random() * (window.innerHeight - 50);
        noBtn.style.position = 'fixed';
        noBtn.style.left = x + 'px';
        noBtn.style.top = y + 'px';
        noBtn.style.zIndex = '9999';
    });

    // "Yes" celebration!
    yesBtn.addEventListener('click', () => {
        document.querySelector('.proposal-buttons').style.display = 'none';
        document.querySelector('.proposal-text').style.display = 'none';
        document.querySelector('.proposal-question').style.display = 'none';

        const yesMessage = document.getElementById('yesMessage');
        yesMessage.classList.remove('hidden');
        yesMessage.style.display = 'block';

        startFireworks();
        for (let i = 0; i < 50; i++) {
            setTimeout(() => createFirework(
                Math.random() * window.innerWidth,
                Math.random() * window.innerHeight / 2
            ), i * 100);
        }

        if (navigator.vibrate) {
            navigator.vibrate([300, 100, 300, 100, 500]);
        }
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

    // --- Fireworks System ---
    function startFireworks() {
        if (fireworksStarted) return; // Prevent multiple intervals
        fireworksStarted = true;
        setInterval(() => {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height / 2;
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
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
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

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

});
