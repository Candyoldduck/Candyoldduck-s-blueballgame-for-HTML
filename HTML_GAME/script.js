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

// 增加一个初始化角度的属性
function initStars() {
    const colors = ['#ff4d4d', '#1e90ff', '#32cd32', '#ff8c00', '#4b0082'];
    for (let i = 0; i < numStars; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 2 + 0.5, // 粒子大小范围
            color: colors[Math.floor(Math.random() * colors.length)],
            alpha: Math.random() * 0.5 + 0.5, // 透明度
            angle: Math.random() * Math.PI * 2, // 随机角度
            speed: Math.random() * 0.02 + starSpeed, // 粒子速度范围
            life: Math.random() * 1000 + 1000 // 粒子生命周期，以毫秒为单位
        });
    }
}

// 导弹数组，用于存储所有活动的导弹
let missiles = [];

// 导弹类
class Missile {
    constructor(x, y, targetX, targetY, speed, radius) {
        this.x = x;
        this.y = y;
        this.targetX = targetX;
        this.targetY = targetY;
        this.dx = (targetX - x) / 100; // 水平速度分量
        this.dy = (targetY - y) / 100; // 垂直速度分量
        this.speed = speed; // 发射速度
        this.active = true; // 是否活跃
        this.radius = radius; // 导弹半径
    }

    update() {
        // 更新导弹位置
        this.x += this.dx * this.speed;
        this.y += this.dy * this.speed;
        const initialRadius = 5;
        const life = 1000; // 空气波的生命周期，以毫秒为单位
        airWaves.push(new AirWave(this.x, this.y, initialRadius, life));

        // 检查导弹是否飞出屏幕
        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
            this.active = false;
        }
        
        if (this.y + this.radius > canvas.height) {
            // 触发爆炸
            const explosion = new Explosion(this.x, this.y);
            explosions.push(explosion);
            this.active = false;
        }
        if (this.y + this.radius > canvas.height) {
            // 触发爆炸
            const explosion = new Explosion(this.x+15, this.y);
            explosions.push(explosion);
            this.active = false;
        }
        if (this.y + this.radius > canvas.height) {
            // 触发爆炸
            const explosion = new Explosion(this.x, this.y+20);
            explosions.push(explosion);
            this.active = false;
        }
        if (this.y + this.radius > canvas.height) {
            // 触发爆炸
            const explosion = new Explosion(this.x-20, this.y);
            explosions.push(explosion);
            this.active = false;
        }
        if (this.y + this.radius > canvas.height) {
            // 触发爆炸
            const explosion = new Explosion(this.x, this.y-11);
            explosions.push(explosion);
            this.active = false;
        }
        if (this.y + this.radius > canvas.height) {
            // 触发爆炸
            const explosion = new Explosion(this.x-19, this.y-19);
            explosions.push(explosion);
            this.active = false;
        }
        if (this.y + this.radius > canvas.height) {
            // 触发爆炸
            const explosion = new Explosion(this.x+11, this.y+14);
            explosions.push(explosion);
            this.active = false;
        }
    }

    draw() {
        if (this.active) {
            // 设置导弹的发光效果
            ctx.shadowBlur = 30; // 发光模糊程度
            ctx.shadowColor = 'red'; // 发光颜色
            ctx.shadowOffsetX = 0; // 阴影X偏移
            ctx.shadowOffsetY = 0; // 阴影Y偏移

            // 绘制圆形导弹
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'grey';
            ctx.fill();
            ctx.closePath();

            // 取消发光效果
            ctx.shadowBlur = 0;
        }
    }
}



initStars();

// 渐变背景设置
let backgroundColorPhase = 0;

// 修复drawStars函数
function drawStars() {
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';

    stars.forEach(star => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${parseInt(star.color.slice(1, 3), 16)}, ${parseInt(star.color.slice(3, 5), 16)}, ${parseInt(star.color.slice(5, 7), 16)}, ${star.alpha})`;
        ctx.fill();
        ctx.closePath();

        // 更新粒子位置
        star.x += Math.cos(star.angle) * star.speed;
        star.y += Math.sin(star.angle) * star.speed;

        // 减少粒子透明度，实现生命周期效果
        star.alpha -= star.life / 60 / 1000; // 假设draw函数每秒调用60次

        // 重置粒子位置和透明度，实现重生效果
        if (star.alpha <= 0) {
            star.x = Math.random() * canvas.width;
            star.y = Math.random() * canvas.height;
            star.alpha = Math.random() * 0.5 + 0.5;
        }
    });

    ctx.restore();
}

// 其他代码保持不变，确保调用initStars()函数初始化粒子// 绘制背景
function drawBackground() {
    backgroundColorPhase += 0.01; // 使背景颜色逐渐变化
    const r = Math.sin(backgroundColorPhase) * 30 + 20;
    const g = Math.sin(backgroundColorPhase + Math.PI / 2) * 30 + 20;
    const b = Math.sin(backgroundColorPhase + Math.PI) * 30 + 20;

    ctx.fillStyle = `rgb(${r}, ${g}, ${b})`; // 动态颜色背景
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// 辅助函数，将十六进制颜色转换为rgba格式
function getRgbaFromHex(hex, alpha) {
    let r = parseInt(hex.slice(1, 3), 16);
    let g = parseInt(hex.slice(3, 5), 16);
    let b = parseInt(hex.slice(5, 7), 16);
    if (alpha) {
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    } else {
        return `rgb(${r}, ${g}, ${b})`;
    }
}


// 其他游戏设置
let ballRadius = 20;
let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 0;
let dy = 0;
const gravity = 0.5; // 重力值
const bounceFactor = 0.7; // 弹跳因子，小于1
const moveSpeed = 5; // 移动速度
const jumpStrength = -10.0; // 跳跃力量
let isJumping = false; // 是否正在跳跃

// 存储按下的键
const keys = {
    left: false,
    right: false,
    space: false
};

// 存储小球历史位置
const trail = [];
const trailLength = 5; // 调整拖尾长度

// 敌人属性
const enemyRadius = 30;
let enemyX = Math.random() * (canvas.width - 2 * enemyRadius) + enemyRadius;
let enemyY = Math.random() * (canvas.height - 2 * enemyRadius) + enemyRadius;

// 定义空气波对象构造函数
function AirWave(x, y, radius, life) {
    this.x = x;
    this.y = y;
    this.radius = radius; // 初始半径
    this.maxRadius = radius + 50; // 最大半径
    this.alpha = 1; // 初始透明度
    this.growthSpeed = 0.2; // 扩散速度
    this.dissipateSpeed = 0.02; // 消散速度
    this.life = life; // 空气波的生命周期
}

// 空气波的更新和绘制函数
AirWave.prototype.update = function() {
    if (this.radius < this.maxRadius) {
        this.radius += this.growthSpeed; // 增加半径
    }
    this.alpha -= this.dissipateSpeed; // 减少透明度
};

AirWave.prototype.draw = function() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
    ctx.shadowBlur = 20; // 设置阴影效果
    ctx.shadowColor = 'rgba(230, 174, 104, 0.6)';
    ctx.fill();
    ctx.closePath();
};

const enemySpeed = 2;

// 处理键盘按下事件
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

// 处理键盘松开事件
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

// 绘制拖尾
function drawTrail() {
    ctx.save();
    ctx.globalCompositeOperation = 'lighter'; // 更加显著的拖尾效果

    for (let i = 0; i < trail.length; i++) {
        const alpha = (i + 1) / trailLength; // 逐渐变淡
        ctx.beginPath();
        ctx.arc(trail[i].x, trail[i].y, ballRadius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`; // 带有透明度的颜色
        ctx.fill();
        ctx.closePath();
    }
    
    ctx.restore();
}

// 绘制小球
function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    
    // 设置小球的发光效果
    ctx.shadowBlur = 30; // 发光模糊程度
    ctx.shadowColor = 'blue'; // 发光颜色，这里使用蓝色作为示例
    ctx.shadowOffsetX = 0; // 阴影X偏移
    ctx.shadowOffsetY = 0; // 阴影Y偏移

    ctx.fillStyle = '#00bfff'; // 小球的颜色
    ctx.fill();
    
    // 绘制完成后取消发光效果
    ctx.shadowBlur = 0;
    ctx.closePath();
}

// 绘制敌人
function drawEnemy() {
    ctx.beginPath();
    ctx.arc(enemyX, enemyY, enemyRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#ff1493'; // 科幻风格的颜色
    ctx.fill();
    ctx.closePath();
}

// 检测碰撞
function checkCollision(x1, y1, r1, x2, y2, r2) {
    const dx = x1 - x2;
    const dy = y1 - y2;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < r1 + r2;
}

// 更新小球位置
function updateBallPosition() {
    if (keys.left) {
        dx = -moveSpeed;
    } else if (keys.right) {
        dx = moveSpeed;
    } else {
        // 如果没有按键按下，逐渐减小速度直到停止
		dx *= 0.9125; // 每次更新减少10%的速度
    }

    if (keys.space && !isJumping) {
        dy = jumpStrength;
        isJumping = true;
        // 在跳跃点生成空气波
        const initialRadius = 5;
        const life = 1000; // 空气波的生命周期，以毫秒为单位
        airWaves.push(new AirWave(x, y, initialRadius, life));
    }

    // 更新小球位置
    x += dx;
    y += dy;

    // 应用重力
    dy += gravity;

    // 碰撞检测和弹跳逻辑
    if (y + dy > canvas.height - ballRadius) {
        y = canvas.height - ballRadius; // 保持在画布内
        dy = -dy * bounceFactor; // 反转速度并应用弹跳因子
        isJumping = false;
    }

    // 保存当前的位置到拖尾数组
    trail.push({ x: x, y: y });
    if (trail.length > trailLength) {
        trail.shift(); // 移除最旧的拖尾位置
    }
}

// 更新敌人位置
function updateEnemyPosition() {
    // 敌人简单的移动逻辑
    enemyX += (Math.random() - 0.5) * enemySpeed;
    enemyY += (Math.random() - 0.5) * enemySpeed;

    // 保证敌人在画布内
    if (enemyX - enemyRadius < 0 || enemyX + enemyRadius > canvas.width) {
        enemyX = Math.max(enemyRadius, Math.min(enemyX, canvas.width - enemyRadius));
    }
    if (enemyY - enemyRadius < 0 || enemyY + enemyRadius > canvas.height) {
        enemyY = Math.max(enemyRadius, Math.min(enemyY, canvas.height - enemyRadius));
    }
}

// 更新敌人类，添加发射导弹的方法
function updateEnemy() {
    // 简单的示例：敌人每秒发射一次导弹
    if (Math.random() < 0.01) { // 调整0.1的值来控制发射频率
        const missileSpeed = 1; // 导弹速度
        const missile = new Missile(enemyX, enemyY - enemyRadius, x, y - ballRadius, missileSpeed,(Math.floor(Math.random() * (7 - 3) + 3)));
        missiles.push(missile);
    }
}

// 游戏逻辑
function gameLogic() {
    // 检查敌人与玩家的碰撞
    if (checkCollision(x, y, ballRadius, enemyX, enemyY, enemyRadius)) {
        // 游戏结束的逻辑
        alert('Game Over!');
        // 可以添加动画或其他反馈
        // ...
        document.location.reload(); // 重新加载页面
    }

    // 遍历导弹数组检查每个导弹是否与玩家碰撞
    for (let i = 0; i < missiles.length; i++) {
        if (checkCollision(missiles[i].x, missiles[i].y, missiles[i].radius, x, y, ballRadius)) {
            // 导弹击中玩家，标记导弹为非活跃状态
            missiles[i].active = false;
            // 游戏结束的逻辑
            alert('Game Over!');
            // 可以添加动画或其他反馈
            // ...
            document.location.reload(); // 重新加载页面
        }
    }
}

//// 爆炸类
//class Explosion {
//    constructor(x, y) {
//        this.x = x;
//        this.y = y;
//        this.maxRadius = 50; // 爆炸的最大半径
//        this.currentRadius = 0; // 爆炸的当前半径
//        this.alpha = 1; // 初始透明度
//        this.growthSpeed = 2; // 爆炸增长速度
//        this.dissipateSpeed = 1; // 透明度减少速度
//    }
//
//    update() {
//        if (this.currentRadius < this.maxRadius) {
//            this.currentRadius += this.growthSpeed; // 增加当前半径
//        } else {
//            this.alpha -= this.dissipateSpeed; // 透明度减少
//        }
//    }
//
//    draw() {
//        ctx.beginPath();
//        ctx.arc(this.x, this.y, this.currentRadius, 0, Math.PI * 2);
//        ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`; // 红色爆炸，透明度由 alpha 控制
//        
//	    ctx.shadowBlur = 20; // 发光模糊程度
//	    ctx.shadowColor = '88001b'; // 发光颜色，这里使用蓝色作为示例
//	    ctx.shadowOffsetX = 0; // 阴影X偏移
//	    ctx.shadowOffsetY = 0; // 阴影Y偏移
//        
//        ctx.fill();
//   		// 绘制完成后取消发光效果
//    	ctx.shadowBlur = 0;
//        ctx.closePath();
//    }
//}

// 爆炸类，处理逐渐变大、变亮然后透明消失的效果
class Explosion {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 0; // 爆炸起始半径
        this.maxRadius = 50; // 爆炸的最大半径
        this.alpha = 1; // 初始透明度
        this.growthSpeed = 2; // 爆炸增长速度
        this.dissipateSpeed = 1; // 透明度减少速度
    }

    update() {
        if (this.radius < this.maxRadius) {
            this.radius += this.growthSpeed; // 逐渐增加半径
        } else {
            this.alpha -= this.dissipateSpeed; // 透明度逐渐减少
        }
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, ${this.alpha})'; // 白色爆炸核心
        ctx.fill();
        
        // 绘制发光效果
        ctx.shadowBlur = 30; // 发光模糊程度与半径成正比
        ctx.shadowColor = 'rgba(253,200,200)'; // 红色发光，透明度较低
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(253,236,230)'; // 红色边缘
        ctx.fill();

        // 取消发光效果
        ctx.shadowBlur = 0;
    }
}

// 动画循环中的爆炸绘制逻辑
function drawExplosions() {
    explosions.forEach(explosion => {
        explosion.update();
        if (explosion.alpha > 0 && explosion.radius <= explosion.maxRadius) {
            explosion.draw();
        } else {
            // 移除完成的爆炸效果
            explosions.splice(explosions.indexOf(explosion), 1);
        }
    });
}

// 事件监听器和其他代码保持不变

// 动画循环
function draw() {
    drawBackground();
    drawStars();
    drawTrail();
    
    // 更新和绘制空气波
    airWaves = airWaves.filter(airWave => airWave.alpha > 0); // 过滤不可见的空气波
    airWaves.forEach(airWave => {
        airWave.update();
        airWave.draw();
    });
    
    drawBall();
    
    // 更新和绘制导弹
    for (let i = missiles.length - 1; i >= 0; i--) {
        missiles[i].update();
        if (!missiles[i].active) {
            missiles.splice(i, 1); // 移除不活跃的导弹
        } else {
            missiles[i].draw();
        }
    }
    drawExplosions();
    drawEnemy();
    updateBallPosition();
    updateEnemyPosition();
    updateEnemy(); // 更新敌人逻辑，包括发射导弹

    // 由于上面的逻辑已经更新了 missiles，这行是多余的
    // missiles = missiles.filter(missile => missile.active);

    gameLogic(); // 检测游戏逻辑
    requestAnimationFrame(draw);
}

// 事件监听器
window.addEventListener('keydown', handleKeyDown);
window.addEventListener('keyup', handleKeyUp);

draw();
