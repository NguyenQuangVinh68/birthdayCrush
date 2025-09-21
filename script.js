startStars1();
const giftBox = document.getElementById('giftBox');
giftBox.addEventListener('click', () => {
    giftBox.classList.add("open");

    setTimeout(() => {
        document.getElementById('page1').style.display = 'none';
        document.getElementById('page2').style.display = 'flex';
        startFireworks();
        startBubbles();
        startStars()
        startTyping();
    }, 900);
});

// ----------------- FIREWORKS -----------------
function startFireworks() {
    const canvas = document.getElementById('fireworks');
    const ctx = canvas.getContext('2d');
    function resize() { canvas.width = innerWidth; canvas.height = innerHeight; }
    resize(); addEventListener('resize', resize);

    const rockets = [];
    const particles = [];
    const rand = (min, max) => Math.random() * (max - min) + min;

    // Rocket (tia bay lên)
    function launchRocket() {
        rockets.push({
            x: rand(canvas.width * 0.2, canvas.width * 0.8),
            y: canvas.height,
            speed: rand(7, 10),
            targetY: rand(canvas.height * 0.2, canvas.height * 0.5),
            hue: Math.floor(rand(0, 360))
        });
    }

    // Nổ pháo hoa
    function createExplosion(x, y, hue, size = "small") {
        const count = size === "small" ? 30 : 100; // ít hạt cho nổ nhỏ
        const speedMin = size === "small" ? 1 : 2;
        const speedMax = size === "small" ? 3 : 6;

        for (let i = 0; i < count; i++) {
            particles.push({
                x, y,
                angle: Math.random() * Math.PI * 2,
                speed: rand(speedMin, speedMax),
                radius: size === "small" ? 1.5 : 2.5,
                alpha: 1,
                decay: rand(0.012, 0.02),
                hue: hue + rand(-20, 20),
                isCore: size === "small" // đánh dấu hạt nổ nhỏ
            });
        }
    }

    function loop() {
        // nền tối mờ
        ctx.fillStyle = 'rgba(0,0,0,0.2)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // rocket bay
        for (let i = rockets.length - 1; i >= 0; i--) {
            const r = rockets[i];
            r.y -= r.speed;

            // rocket sáng
            ctx.beginPath();
            ctx.arc(r.x, r.y, 2.5, 0, Math.PI * 2);
            ctx.fillStyle = `hsl(${r.hue}, 100%, 70%)`;
            ctx.fill();

            // đuôi khói
            ctx.beginPath();
            ctx.arc(r.x, r.y + 15, 2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255,255,255,0.3)`;
            ctx.fill();

            if (r.y <= r.targetY) {
                // Nổ nhỏ trước
                createExplosion(r.x, r.y, r.hue, "small");

                // Sau 1.5s nổ lớn từ vị trí đó
                setTimeout(() => {
                    createExplosion(r.x, r.y, r.hue, "big");
                }, 1500);

                rockets.splice(i, 1);
            }
        }

        // update hạt pháo hoa
        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            p.x += Math.cos(p.angle) * p.speed;
            p.y += Math.sin(p.angle) * p.speed + 0.05; // trọng lực nhẹ
            p.speed *= 0.98;
            p.alpha -= p.decay;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${p.hue}, 100%, 50%, ${p.alpha})`;
            ctx.fill();

            if (p.alpha <= 0) particles.splice(i, 1);
        }

        requestAnimationFrame(loop);
    }

    setInterval(() => {
        launchRocket();
    }, 1200);

    loop();
}



// ----------------- BUBBLES -----------------
function startBubbles() {
    const canvas = document.getElementById('bubbles');
    const ctx = canvas.getContext('2d');
    function resize() { canvas.width = innerWidth; canvas.height = innerHeight; }
    resize(); addEventListener('resize', resize);

    const bubbles = [];
    const rand = (min, max) => Math.random() * (max - min) + min;
    const colors = ['#ff4f8b', '#3b83ff', '#a463ff'];

    function createBubble() {
        bubbles.push({
            x: rand(50, canvas.width - 50),
            y: canvas.height + 40,
            r: rand(18, 32),
            s: rand(0.6, 1.5),
            alpha: rand(0.7, 1),
            color: colors[Math.floor(Math.random() * colors.length)],
            offset: rand(0, Math.PI * 2) // tạo độ lệch để dây mỗi bóng khác nhau
        });
    }

    function loop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = bubbles.length - 1; i >= 0; i--) {
            const b = bubbles[i];
            b.y -= b.s;
            // vẽ bong bóng
            ctx.beginPath();
            ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
            const grad = ctx.createRadialGradient(b.x - b.r / 3, b.y - b.r / 3, 2, b.x, b.y, b.r);
            grad.addColorStop(0, "#fff");
            grad.addColorStop(0.4, b.color);
            grad.addColorStop(1, "rgba(0,0,0,0.2)");
            ctx.fillStyle = grad;
            ctx.globalAlpha = b.alpha;
            ctx.fill();
            ctx.globalAlpha = 1;

            if (b.y + b.r < 0) bubbles.splice(i, 1);
        }

        requestAnimationFrame(loop);
    }

    setInterval(createBubble, 2000);
    loop();
}


// ----------------- STARS -----------------
function startStars() {
    const canvas = document.getElementById('stars');
    const ctx = canvas.getContext('2d');
    function resize() { canvas.width = innerWidth; canvas.height = innerHeight; }
    resize(); addEventListener('resize', resize);

    const stars = [];
    const rand = (min, max) => Math.random() * (max - min) + min;

    // tạo nhiều ngôi sao
    for (let i = 0; i < 120; i++) {
        stars.push({
            x: rand(0, canvas.width),
            y: rand(0, canvas.height * 0.7), // chỉ từ giữa lên trên
            r: rand(1, 2),                    // bán kính sao
            alpha: rand(0.3, 1),
            speed: rand(0.0008, 0.002),       // tốc độ lấp lánh
            offset: rand(0, Math.PI * 2)      // lệch pha để không đồng bộ
        });
    }

    function loop(time) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < stars.length; i++) {
            const s = stars[i];
            // alpha dao động theo sin → lấp lánh
            s.alpha = 0.5 + Math.sin(time * s.speed + s.offset) * 0.5;

            ctx.beginPath();
            ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255,255,255,${s.alpha})`;
            ctx.fill();
        }

        requestAnimationFrame(loop);
    }

    loop(0);
}

function startStars1() {
    const canvas = document.getElementById('stars1');
    const ctx = canvas.getContext('2d');
    function resize() {
        canvas.width = innerWidth;
        canvas.height = innerHeight;
    }
    resize();
    addEventListener('resize', resize);

    const stars = [];
    const rand = (min, max) => Math.random() * (max - min) + min;

    // tạo nhiều ngôi sao
    for (let i = 0; i < 120; i++) {
        stars.push({
            x: rand(0, canvas.width),
            y: rand(0, canvas.height * 0.7), // chỉ từ giữa lên trên
            r: rand(2, 4),                   // 🌟 sao to hơn
            alpha: rand(0.3, 1),
            speed: rand(0.002, 0.006),       // ⚡ lấp lánh nhanh hơn
            offset: rand(0, Math.PI * 2)     // lệch pha để không đồng bộ
        });
    }

    function loop(time) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < stars.length; i++) {
            const s = stars[i];
            // alpha dao động theo sin → lấp lánh
            s.alpha = 0.5 + Math.sin(time * s.speed + s.offset) * 0.5;

            ctx.beginPath();
            ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255,255,255,${s.alpha})`;
            ctx.fill();
        }

        requestAnimationFrame(loop);
    }

    loop(0);
}

const messageElement = document.querySelector('.message');
const text = 'Happy Birthday em 🌷! Chúc em tuổi mới luôn xinh đẹp, luôn hạnh phúc nè. Anh hy vọng tuổi mới này sẽ mang đến cho em sức mạnh và cơ hội để thực hiện mọi ước mơ mà em hằng ấp ủ he💖';
let index = 0;
let isTyping = false;

function typeWriter() {
    if (index < text.length && isTyping) {
        messageElement.textContent += text.charAt(index);
        index++;
        setTimeout(typeWriter, 50); // Adjust speed (50ms per character)
    }
}

function startTyping() {
    if (!isTyping) {
        // Reset the text and index
        messageElement.textContent = '';
        index = 0;
        isTyping = true;
        typeWriter();
    }
}