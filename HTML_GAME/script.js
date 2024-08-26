// script.js
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// 存储所有爆炸实例的数组
let explosions = [];

// 设置画布大小
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// 星星设置
const numStars = 100; // 星星数量
const stars = [];
const starSpeed = 0.2; // 星星移动速度

function createExplosion(x, y) {
    const explosion = new Explosion(x, y, canvas);
    explosions.push(explosion);
}

// 初始化空气波数组
let airWaves = [];

// 初始化星星
function initStars() {
    const colors = ['#ff4d4d', '#1e90ff', '#32cd32', '#ff8c00', '#4b0082'];
    for (let i = 0; i < numStars; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 2 + 0.5,
            color: colors[Math.floor(Math.random() * colors.length)],
            alpha: Math.random() * 0.5 + 0.5,
            angle: Math.random() * Math.PI * 2,
            speed: Math.random() * 0.02 + starSpeed,
            life: Math.random() * 1000 + 1000
        });
    }
}

// 导弹数组
let missiles = [];

// 导弹类
class Missile {
    constructor(x, y, targetX, targetY, speed, radius) {
        this.x = x;
        this.y = y;
        this.targetX = targetX;
        this.targetY = targetY;
        this.dx = (targetX - x) / 100;
        this.dy = (targetY - y) / 100;
        this.speed = speed;
        this.active = true;
        this.radius = radius;
    }

    update() {
        this.x += this.dx * this.speed;
        this.y += this.dy * this.speed;
        airWaves.push(new AirWave(this.x, this.y, 5, 1000));

        if (this.y + this.radius > canvas.height) {
            createExplosion(this.x, this.y);
            this.active = false;
        }

        // 检查导弹是否飞出屏幕
        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
            this.active = false;
        }
    }

    draw() {
        if (this.active) {
            ctx.shadowBlur = 30;
            ctx.shadowColor = 'red';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'grey';
            ctx.fill();
            ctx.closePath();
            ctx.shadowBlur = 0;
        }
    }
}

initStars();

let backgroundColorPhase = 0;

function drawStars() {
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';

    stars.forEach(star => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${parseInt(star.color.slice(1, 3), 16)}, ${parseInt(star.color.slice(3, 5), 16)}, ${parseInt(star.color.slice(5, 7), 16)}, ${star.alpha})`;
        ctx.fill();
        ctx.closePath();

        star.x += Math.cos(star.angle) * star.speed;
        star.y += Math.sin(star.angle) * star.speed;
        star.alpha -= star.life / 60 / 1000;

        if (star.alpha <= 0) {
            star.x = Math.random() * canvas.width;
            star.y = Math.random() * canvas.height;
            star.alpha = Math.random() * 0.5 + 0.5;
        }
    });

    ctx.restore();
}

function drawBackground() {
    backgroundColorPhase += 0.01;
    const r = Math.sin(backgroundColorPhase) * 30 + 20;
    const g = Math.sin(backgroundColorPhase + Math.PI / 2) * 30 + 20;
    const b = Math.sin(backgroundColorPhase + Math.PI) * 30 + 20;

    ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

const ballRadius = 20;
let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 0;
let dy = 0;
const gravity = 0.5;
const bounceFactor = 0.7;
const moveSpeed = 5;
const jumpStrength = -10.0;
let isJumping = false;

const keys = { left: false, right: false, space: false };
const trail = [];
const trailLength = 5;

const enemyRadius = 30;
let enemyX = Math.random() * (canvas.width - 2 * enemyRadius) + enemyRadius;
let enemyY = Math.random() * (canvas.height - 2 * enemyRadius) + enemyRadius;

function AirWave(x, y, radius, life) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.maxRadius = radius + 50;
    this.alpha = 1;
    this.growthSpeed = 0.2;
    this.dissipateSpeed = 0.02;
    this.life = life;
}

AirWave.prototype.update = function() {
    if (this.radius < this.maxRadius) {
        this.radius += this.growthSpeed;
    }
    this.alpha -= this.dissipateSpeed;
};

AirWave.prototype.draw = function() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
    ctx.shadowBlur = 20;
    ctx.shadowColor = 'rgba(230, 174, 104, 0.6)';
    ctx.fill();
    ctx.closePath();
};

const enemySpeed = 2;

function handleKeyDown(event) {
    switch (event.key) {
        case 'a':
        case 'A':
            keys.left = true;
            break;
        case 'd':
        case 'D':
            keys.right = true;
            break;
        case ' ':
            keys.space = true;
            break;
    }
}

function handleKeyUp(event) {
    switch (event.key) {
        case 'a':
        case 'A':
            keys.left = false;
            break;
        case 'd':
        case 'D':
            keys.right = false;
            break;
        case ' ':
            keys.space = false;
            break;
    }
}

function drawTrail() {
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';

    trail.forEach((point, i) => {
        const alpha = (i + 1) / trailLength;
        ctx.beginPath();
        ctx.arc(point.x, point.y, ballRadius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.fill();
        ctx.closePath();
    });

    ctx.restore();
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.shadowBlur = 30;
    ctx.shadowColor = 'blue';
    ctx.fillStyle = '#00bfff';
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.closePath();
}

function drawEnemy() {
    ctx.beginPath();
    ctx.arc(enemyX, enemyY, enemyRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#ff1493';
    ctx.fill();
    ctx.closePath();
}

function checkCollision(x1, y1, r1, x2, y2, r2) {
    const dx = x1 - x2;
    const dy = y1 - y2;
    return Math.sqrt(dx * dx + dy * dy) < r1 + r2;
}

function updateBallPosition() {
    dx = keys.left ? -moveSpeed : keys.right ? moveSpeed : dx * 0.9125;

    if (keys.space && !isJumping) {
        dy = jumpStrength;
        isJumping = true;
        airWaves.push(new AirWave(x, y, 5, 1000));
    }

    x += dx;
    y += dy;
    dy += gravity;

    if (y + dy > canvas.height - ballRadius) {
        y = canvas.height - ballRadius;
        dy = -dy * bounceFactor;
        isJumping = false;
    }

    trail.push({ x, y });
    if (trail.length > trailLength) {
        trail.shift();
    }
}

function updateEnemyPosition() {
    enemyX += (Math.random() - 0.5) * enemySpeed;
    enemyY += (Math.random() - 0.5) * enemySpeed;

    enemyX = Math.max(enemyRadius, Math.min(enemyX, canvas.width - enemyRadius));
    enemyY = Math.max(enemyRadius, Math.min(enemyY, canvas.height - enemyRadius));
}

function updateEnemy() {
    if (Math.random() < 0.01) {
        const missileSpeed = 1;
        const missile = new Missile(enemyX, enemyY - enemyRadius, x, y - ballRadius, missileSpeed, (Math.floor(Math.random() * (7 - 3) + 3)));
        missiles.push(missile);
    }
}

function gameLogic() {
    if (checkCollision(x, y, ballRadius, enemyX, enemyY, enemyRadius)) {
        alert('Game Over!');
        document.location.reload();
    }

    missiles.forEach(missile => {
        if (checkCollision(missile.x, missile.y, missile.radius, x, y, ballRadius)) {
            missile.active = false;
            alert('Game Over!');
            document.location.reload();
        }
    });
}

class Explosion {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 0;
        this.maxRadius = 50;
        this.alpha = 1;
        this.growthSpeed = 2;
        this.dissipateSpeed = 1;
    }

    update() {
        if (this.radius < this.maxRadius) {
            this.radius += this.growthSpeed;
        } else {
            this.alpha -= this.dissipateSpeed;
        }
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
        ctx.fill();
        ctx.shadowBlur = 30;
        ctx.shadowColor = 'rgba(253,200,200)'; 
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.closePath();
    }
}

function drawExplosions() {
    explosions.forEach(explosion => {
        explosion.update();
        if (explosion.alpha > 0 && explosion.radius <= explosion.maxRadius) {
            explosion.draw();
        } else {
            explosions.splice(explosions.indexOf(explosion), 1);
        }
    });
}

function draw() {
    drawBackground();
    drawStars();
    drawTrail();
    
    airWaves = airWaves.filter(airWave => airWave.alpha > 0);
    airWaves.forEach(airWave => {
        airWave.update();
        airWave.draw();
    });
    
    drawBall();
    
    missiles.forEach((missile, index) => {
        missile.update();
        if (!missile.active) {
            missiles.splice(index, 1);
        } else {
            missile.draw();
        }
    });

    drawExplosions();
    drawEnemy();
    updateBallPosition();
    updateEnemyPosition();
    updateEnemy();

    gameLogic();
    requestAnimationFrame(draw);
}

window.addEventListener('keydown', handleKeyDown);
window.addEventListener('keyup', handleKeyUp);

draw();
