document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.createElement('canvas');
    document.body.appendChild(canvas); // Append canvas to the body

    const ctx = canvas.getContext('2d');
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.zIndex = '-1'; // Place canvas behind other content

    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight;

    const particlesArray = [];
    const baseScreenWidth = 3840;
    const baseScreenHeight = 2160;
    const baseParticleCount = 175;
    const baseDensityFactor = baseParticleCount / (baseScreenWidth * baseScreenHeight);
    const mouse = { x: 0, y: 0, size: 10 }; // Mouse-controlled object

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 7 + 2; // Adjusted size range for smaller particles
            this.speedX = Math.random() * 3 - 1.5;
            this.speedY = Math.random() * 3 - 1.5;
            this.color = '#ffffff'; // White color
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.x + this.size > canvas.width || this.x - this.size < 0) {
                this.speedX = -this.speedX;
            }
            if (this.y + this.size > canvas.height || this.y - this.size < 0) {
                this.speedY = -this.speedY;
            }
            this.checkCollision();
        }

        draw() {
            // Draw star shape
            ctx.save();
            ctx.beginPath();
            ctx.translate(this.x, this.y);
            ctx.moveTo(0, 0 - this.size);
            for (let i = 0; i < 4; i++) {
                ctx.rotate(Math.PI / 4);
                ctx.lineTo(0, 0 - (this.size * 0.5));
                ctx.rotate(Math.PI / 4);
                ctx.lineTo(0, 0 - this.size);
            }
            ctx.fillStyle = this.color;
            ctx.shadowColor = this.color;
            ctx.shadowBlur = 10;
            ctx.fill();
            ctx.restore();
        }

        checkCollision() {
            // Check collision with other particles
            particlesArray.forEach(particle => {
                if (particle !== this) {
                    const dx = this.x - particle.x;
                    const dy = this.y - particle.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < this.size + particle.size) {
                        const angle = Math.atan2(dy, dx);
                        const sin = Math.sin(angle);
                        const cos = Math.cos(angle);

                        const vx1 = this.speedX * cos + this.speedY * sin;
                        const vy1 = this.speedY * cos - this.speedX * sin;
                        const vx2 = particle.speedX * cos + particle.speedY * sin;
                        const vy2 = particle.speedY * cos - particle.speedX * sin;

                        this.speedX = vx2 * cos - vy1 * sin;
                        this.speedY = vy1 * cos + vx2 * sin;
                        particle.speedX = vx1 * cos - vy2 * sin;
                        particle.speedY = vy2 * cos + vx1 * sin;
                    }
                }
            });

            // Check collision with mouse
            const dx = this.x - mouse.x;
            const dy = this.y - mouse.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < this.size + mouse.size) {
                const angle = Math.atan2(dy, dx);
                const sin = Math.sin(angle);
                const cos = Math.cos(angle);

                const vx = this.speedX * cos + this.speedY * sin;
                const vy = this.speedY * cos - this.speedX * sin;

                this.speedX = -vx * cos - vy * sin;
                this.speedY = vy * cos - vx * sin;
            }
        }
    }

    function init() {
        particlesArray.length = 0; // Clear the array
        const numberOfParticles = calculateNumberOfParticles();
        for (let i = 0; i < numberOfParticles; i++) {
            particlesArray.push(new Particle());
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particlesArray.forEach(particle => {
            particle.update();
            particle.draw();
        });
        requestAnimationFrame(animate);
    }

    function calculateNumberOfParticles() {
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        return Math.floor(screenWidth * screenHeight * baseDensityFactor);
    }

    function resizeCanvas() {
        canvas.width = document.body.clientWidth;
        canvas.height = document.body.clientHeight;
    }

    window.addEventListener('resize', function() {
        resizeCanvas();
        init(); // Reinitialize particles with new dimensions
    });

    window.addEventListener('mousemove', (event) => {
        mouse.x = event.clientX;
        mouse.y = event.clientY;
    });

    resizeCanvas();
    init();
    animate();
});
