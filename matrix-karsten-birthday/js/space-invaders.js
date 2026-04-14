/*
 * Isolated Space Invaders module for reuse in other projects.
 *
 * Required DOM IDs:
 * - spaceInvadersOverlay
 * - spaceInvadersCanvas
 * - levelNum, scoreNum, livesNum, finalScore
 * - siSplashScreen, siGameOverScreen, siCreditsScreen
 *
 * Required asset:
 * - /assets/space-invaders.css (or equivalent copied styles)
 *
 * Public API:
 * - window.RevpiSpaceInvaders.launch()
 * - window.RevpiSpaceInvaders.close()
 * - window.RevpiSpaceInvaders.isActive()
 */
(function () {
  const WIDTH = 800;
  const HEIGHT = 560;
  const LEVELS = 3;

  class SpaceInvadersGame {
    constructor() {
      this.active = false;
      this.running = false;
      this.showingPanel = false;
      this.rafId = 0;
      this.level = 1;
      this.score = 0;
      this.lives = 3;
      this.keys = Object.create(null);
      this.bullets = [];
      this.enemyBullets = [];
      this.enemies = [];
      this.particles = [];
      this.enemyDirection = 1;
      this.enemySpeed = 0.5;
      this.lastEnemyShotAt = 0;
      this.lastPlayerShotAt = 0;
      this.lastFrameAt = 0;
      this.splashTimerId = 0;
      this.gameOverTimerId = 0;

      this.player = {
        x: WIDTH / 2 - 18,
        y: HEIGHT - 48,
        w: 36,
        h: 18,
        speed: 360,
      };

      this.onKeyDown = this.onKeyDown.bind(this);
      this.onKeyUp = this.onKeyUp.bind(this);
      this.frame = this.frame.bind(this);
    }

    bindDom() {
      this.overlay = document.getElementById("spaceInvadersOverlay");
      this.canvas = document.getElementById("spaceInvadersCanvas");
      this.ctx = this.canvas ? this.canvas.getContext("2d") : null;

      this.levelEl = document.getElementById("levelNum");
      this.scoreEl = document.getElementById("scoreNum");
      this.livesEl = document.getElementById("livesNum");
      this.finalScoreEl = document.getElementById("finalScore");

      this.splashEl = document.getElementById("siSplashScreen");
      this.gameOverEl = document.getElementById("siGameOverScreen");
      this.creditsEl = document.getElementById("siCreditsScreen");

      if (!this.overlay || !this.canvas || !this.ctx) {
        return false;
      }

      this.canvas.width = WIDTH;
      this.canvas.height = HEIGHT;
      return true;
    }

    launch() {
      if (this.active) {
        return;
      }
      if (!this.bindDom()) {
        return;
      }

      this.resetSession();
      this.active = true;
      this.overlay.hidden = false;
      this.showPanel(this.splashEl);
      this.splashTimerId = window.setTimeout(() => {
        if (!this.active) {
          return;
        }
        this.hidePanels();
        this.startLevel(1);
        this.running = true;
        this.lastFrameAt = performance.now();
        this.rafId = requestAnimationFrame(this.frame);
      }, 1000);

      window.addEventListener("keydown", this.onKeyDown);
      window.addEventListener("keyup", this.onKeyUp);
    }

    resetSession() {
      this.level = 1;
      this.score = 0;
      this.lives = 3;
      this.keys = Object.create(null);
      this.bullets = [];
      this.enemyBullets = [];
      this.enemies = [];
      this.particles = [];
      this.enemyDirection = 1;
      this.enemySpeed = 0.5;
      this.lastEnemyShotAt = 0;
      this.lastPlayerShotAt = 0;
      this.player.x = WIDTH / 2 - 18;
      this.player.y = HEIGHT - 48;
      this.updateHud();
      this.hidePanels();
    }

    startLevel(level) {
      this.level = level;
      this.enemyDirection = 1;
      this.enemySpeed = 0.5 + (level - 1) * 0.25;
      this.bullets = [];
      this.enemyBullets = [];
      this.particles = [];

      const rows = 3 + (level - 1);
      const cols = 10;
      const startX = 70;
      const startY = 70;
      const gapX = 60;
      const gapY = 40;

      this.enemies = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          this.enemies.push({
            x: startX + c * gapX,
            y: startY + r * gapY,
            w: 24,
            h: 20,
            hp: 1,
            color: r % 2 === 0 ? "#00eaff" : "#ff66d6",
          });
        }
      }
      this.updateHud();
    }

    onKeyDown(event) {
      if (!this.active) {
        return;
      }
      this.keys[event.key] = true;

      if (event.key === " ") {
        event.preventDefault();
        if (this.running && !this.showingPanel) {
          this.firePlayer();
        }
      }
      if (event.key === "Escape") {
        this.close();
      }
    }

    onKeyUp(event) {
      if (!this.active) {
        return;
      }
      this.keys[event.key] = false;
    }

    firePlayer() {
      const now = performance.now();
      if (now - this.lastPlayerShotAt < 170) {
        return;
      }
      this.lastPlayerShotAt = now;
      this.bullets.push({
        x: this.player.x + this.player.w / 2 - 2,
        y: this.player.y - 10,
        w: 4,
        h: 10,
        vy: -450,
      });
    }

    fireEnemy() {
      if (!this.enemies.length) {
        return;
      }
      const now = performance.now();
      const period = Math.max(220, 800 - this.level * 140);
      if (now - this.lastEnemyShotAt < period) {
        return;
      }
      this.lastEnemyShotAt = now;
      const idx = Math.floor(Math.random() * this.enemies.length);
      const enemy = this.enemies[idx];
      this.enemyBullets.push({
        x: enemy.x + enemy.w / 2 - 2,
        y: enemy.y + enemy.h,
        w: 4,
        h: 10,
        vy: 260 + this.level * 30,
      });
    }

    frame(ts) {
      if (!this.active) {
        return;
      }
      const dt = Math.min(0.05, (ts - this.lastFrameAt) / 1000);
      this.lastFrameAt = ts;

      if (this.running && !this.showingPanel) {
        this.update(dt);
      }
      this.draw();
      this.rafId = requestAnimationFrame(this.frame);
    }

    update(dt) {
      const moveLeft = this.keys.ArrowLeft || this.keys.a || this.keys.A;
      const moveRight = this.keys.ArrowRight || this.keys.d || this.keys.D;
      if (moveLeft) {
        this.player.x = Math.max(0, this.player.x - this.player.speed * dt);
      }
      if (moveRight) {
        this.player.x = Math.min(WIDTH - this.player.w, this.player.x + this.player.speed * dt);
      }

      for (const bullet of this.bullets) {
        bullet.y += bullet.vy * dt;
      }
      for (const bullet of this.enemyBullets) {
        bullet.y += bullet.vy * dt;
      }

      this.bullets = this.bullets.filter((b) => b.y + b.h >= 0);
      this.enemyBullets = this.enemyBullets.filter((b) => b.y <= HEIGHT + 10);

      this.updateEnemyWave(dt);
      this.fireEnemy();
      this.handleHits();
      this.updateParticles(dt);

      if (this.enemies.length === 0) {
        if (this.level >= LEVELS) {
          this.running = false;
          this.showPanel(this.creditsEl);
        } else {
          this.startLevel(this.level + 1);
        }
      }
    }

    updateEnemyWave(dt) {
      if (!this.enemies.length) {
        return;
      }
      const dx = this.enemySpeed * this.enemyDirection * 60 * dt;
      for (const enemy of this.enemies) {
        enemy.x += dx;
      }

      const minX = Math.min(...this.enemies.map((e) => e.x));
      const maxX = Math.max(...this.enemies.map((e) => e.x + e.w));
      if (minX <= 12 || maxX >= WIDTH - 12) {
        this.enemyDirection *= -1;
        for (const enemy of this.enemies) {
          enemy.y += 14;
        }
      }

      const reachedPlayer = this.enemies.some((e) => e.y + e.h >= this.player.y - 6);
      if (reachedPlayer) {
        this.triggerGameOver();
      }
    }

    handleHits() {
      const remainingEnemies = [];
      const bulletsToKeep = [];

      for (const enemy of this.enemies) {
        let hit = false;
        for (const bullet of this.bullets) {
          if (this.collide(enemy, bullet)) {
            hit = true;
            bullet.hit = true;
            this.score += 10 + this.level * 2;
            this.spawnExplosion(enemy.x + enemy.w / 2, enemy.y + enemy.h / 2, 10, "#ff66d6");
            break;
          }
        }
        if (!hit) {
          remainingEnemies.push(enemy);
        }
      }

      for (const bullet of this.bullets) {
        if (!bullet.hit) {
          bulletsToKeep.push(bullet);
        }
      }

      this.enemies = remainingEnemies;
      this.bullets = bulletsToKeep;

      const enemyBulletsToKeep = [];
      let gotHit = false;
      for (const bullet of this.enemyBullets) {
        if (this.collide(this.player, bullet)) {
          gotHit = true;
          this.spawnExplosion(this.player.x + this.player.w / 2, this.player.y + this.player.h / 2, 22, "#ff3d2e");
          continue;
        }
        enemyBulletsToKeep.push(bullet);
      }
      this.enemyBullets = enemyBulletsToKeep;

      if (gotHit) {
        this.lives -= 1;
        this.updateHud();
        if (this.lives <= 0) {
          this.triggerGameOver();
        } else {
          this.player.x = WIDTH / 2 - this.player.w / 2;
        }
      }
    }

    triggerGameOver() {
      if (!this.active || this.showingPanel) {
        return;
      }
      this.running = false;
      this.showPanel(this.gameOverEl);
      if (this.finalScoreEl) {
        this.finalScoreEl.textContent = String(this.score);
      }
      this.spawnExplosion(WIDTH / 2, HEIGHT / 2, 220, "#ff3d2e", true);
      this.gameOverTimerId = window.setTimeout(() => {
        this.close();
      }, 2800);
    }

    spawnExplosion(x, y, amount, color, wide) {
      for (let i = 0; i < amount; i++) {
        const a = Math.random() * Math.PI * 2;
        const speed = (wide ? 50 : 20) + Math.random() * (wide ? 350 : 120);
        this.particles.push({
          x,
          y,
          vx: Math.cos(a) * speed,
          vy: Math.sin(a) * speed,
          life: wide ? 1.3 : 0.6,
          size: wide ? 2 + Math.random() * 6 : 2 + Math.random() * 2,
          color,
        });
      }
    }

    updateParticles(dt) {
      for (const p of this.particles) {
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.vy += 160 * dt;
        p.life -= dt;
      }
      this.particles = this.particles.filter((p) => p.life > 0);
    }

    collide(a, b) {
      return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
    }

    showPanel(panel) {
      this.hidePanels();
      this.showingPanel = true;
      if (panel) {
        panel.hidden = false;
      }
    }

    hidePanels() {
      this.showingPanel = false;
      if (this.splashEl) {
        this.splashEl.hidden = true;
      }
      if (this.gameOverEl) {
        this.gameOverEl.hidden = true;
      }
      if (this.creditsEl) {
        this.creditsEl.hidden = true;
      }
    }

    updateHud() {
      if (this.levelEl) {
        this.levelEl.textContent = String(this.level);
      }
      if (this.scoreEl) {
        this.scoreEl.textContent = String(this.score);
      }
      if (this.livesEl) {
        this.livesEl.textContent = String(this.lives);
      }
    }

    draw() {
      if (!this.ctx) {
        return;
      }
      const ctx = this.ctx;
      ctx.fillStyle = "#00111d";
      ctx.fillRect(0, 0, WIDTH, HEIGHT);

      ctx.strokeStyle = "rgba(0,255,102,0.08)";
      ctx.lineWidth = 1;
      for (let x = 0; x <= WIDTH; x += 20) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, HEIGHT);
        ctx.stroke();
      }
      for (let y = 0; y <= HEIGHT; y += 20) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(WIDTH, y);
        ctx.stroke();
      }

      ctx.fillStyle = "#00ff66";
      ctx.fillRect(this.player.x, this.player.y, this.player.w, this.player.h);

      ctx.fillStyle = "#b2ff00";
      for (const b of this.bullets) {
        ctx.fillRect(b.x, b.y, b.w, b.h);
      }

      ctx.fillStyle = "#ff4e42";
      for (const b of this.enemyBullets) {
        ctx.fillRect(b.x, b.y, b.w, b.h);
      }

      for (const enemy of this.enemies) {
        ctx.fillStyle = enemy.color;
        ctx.fillRect(enemy.x, enemy.y, enemy.w, enemy.h);
      }

      for (const p of this.particles) {
        ctx.globalAlpha = Math.max(0, Math.min(1, p.life));
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, p.size, p.size);
      }
      ctx.globalAlpha = 1;

      ctx.strokeStyle = "rgba(0, 255, 102, 0.04)";
      for (let y = 0; y < HEIGHT; y += 2) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(WIDTH, y);
        ctx.stroke();
      }
    }

    close() {
      if (!this.active) {
        return;
      }
      this.active = false;
      this.running = false;
      this.keys = Object.create(null);

      if (this.rafId) {
        cancelAnimationFrame(this.rafId);
        this.rafId = 0;
      }
      if (this.splashTimerId) {
        clearTimeout(this.splashTimerId);
        this.splashTimerId = 0;
      }
      if (this.gameOverTimerId) {
        clearTimeout(this.gameOverTimerId);
        this.gameOverTimerId = 0;
      }

      window.removeEventListener("keydown", this.onKeyDown);
      window.removeEventListener("keyup", this.onKeyUp);

      this.hidePanels();
      if (this.overlay) {
        this.overlay.hidden = true;
      }
    }
  }

  const instance = new SpaceInvadersGame();

  window.RevpiSpaceInvaders = {
    launch: () => instance.launch(),
    close: () => instance.close(),
    isActive: () => instance.active,
  };
})();
