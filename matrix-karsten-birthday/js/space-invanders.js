(function () {
  "use strict";

  var KEY = {
    LEFT: false,
    RIGHT: false,
    FIRE: false
  };

  var EASY_MODE = true;
  var game = null;
  var creditsStarted = false;

  function createOverlay() {
    if (document.getElementById("si-overlay")) {
      return document.getElementById("si-overlay");
    }

    var overlay = document.createElement("div");
    overlay.id = "si-overlay";
    overlay.className = "si-overlay";

    overlay.innerHTML = [
      '<div class="si-panel" role="dialog" aria-modal="true" aria-label="Space Invanders Easter Egg">',
      '  <div class="si-head">',
      '    <h3 class="si-title">Space Invanders: Matrix Bonus</h3>',
      '    <button id="si-close" class="si-close" type="button">Schliessen</button>',
      '  </div>',
      '  <div id="si-game-stage" class="si-game-stage">',
      '    <canvas id="si-canvas" class="si-canvas" width="720" height="420"></canvas>',
      '    <div class="si-info">',
      '      <span id="si-level">Level 1/2</span>',
      '      <span id="si-score">Score: 0</span>',
      '      <span id="si-lives">Leben: 3</span>',
      '    </div>',
      '    <div id="si-reminder" class="si-reminder">Geheimmodus geladen. Tipp: Wenn du es schaffst, kommt ein Karsten-Reminder.</div>',
      '    <div class="si-controls">',
      '      <button id="si-start" class="si-btn" type="button">Start</button>',
      '      <button id="si-restart" class="si-btn" type="button" disabled>Neustart</button>',
      '    </div>',
      '    <div class="si-touch">',
      '      <button id="si-left" class="si-btn" type="button">Links</button>',
      '      <button id="si-fire" class="si-btn" type="button">Feuer</button>',
      '      <button id="si-right" class="si-btn" type="button">Rechts</button>',
      '    </div>',
      '  </div>',
      '  <section id="si-credits-stage" class="si-credits-stage" aria-live="polite" aria-label="Final Credits">',
      '    <h4 class="si-credits-title si-glitch">System Credits: Karsten Build</h4>',
      '    <div class="si-credits-mask">',
      '      <div id="si-credits-scroll" class="si-credits-scroll">',
      '        <article class="si-credit-chapter">',
      '          <h5 class="si-credit-heading">Connection initialized</h5>',
      '          <p class="si-credit-text">2013 wurde die Verbindung aufgebaut. Kein Zufall, sondern ein sauberer Handshake zwischen zwei Systemen mit derselben Sprache: Klartext und Verlass.</p>',
      '        </article>',
      '        <article class="si-credit-chapter">',
      '          <h5 class="si-credit-heading">Shared systems and shared years</h5>',
      '          <p class="si-credit-text">Von 2013 bis 2017 liefen wir eng synchron. Kollegen im Betrieb, Freunde im echten Layer. Die Uptime dieser Zeit: bemerkenswert stabil.</p>',
      '        </article>',
      '        <article class="si-credit-chapter">',
      '          <h5 class="si-credit-heading">Technical legacy</h5>',
      '          <p class="si-credit-text">Karsten hielt Good Enterprise und Citrix ruhig im Takt. Bei Exchange und Fileservern war er kein Hotfix, sondern die verlässliche Architektur dahinter.</p>',
      '        </article>',
      '        <article class="si-credit-chapter">',
      '          <h5 class="si-credit-heading">Memory fragments</h5>',
      '          <p class="si-credit-text">Zwischen Tickets, Deployments und langen Tagen blieb etwas, das man nicht skripten kann: ehrliche Gespräche, die immer gut getan haben.</p>',
      '        </article>',
      '        <article class="si-credit-chapter">',
      '          <h5 class="si-credit-heading">Human layer</h5>',
      '          <p class="si-credit-text">Hinter jedem Admin-Account steht ein Mensch. Bei Karsten: Familie zuerst, Hunde sowieso. Genau dieser Kern macht ihn als Freund so stark.</p>',
      '        </article>',
      '        <article class="si-credit-chapter">',
      '          <h5 class="si-credit-heading">Birthday build 52.0</h5>',
      '          <p class="si-credit-text">Heute rollt Version 52.0 live. Performance: souverän. Stabilität: legendär. Humor: produktiv in jeder Umgebung.</p>',
      '        </article>',
      '        <article class="si-credit-chapter">',
      '          <h5 class="si-credit-heading">Final dedication</h5>',
      '          <p class="si-credit-text">Danke für alles, Karsten. Super Kollege, super Mensch, super Freund. Kein materieller Drop, aber maximaler Respekt im Hauptbranch.</p>',
      '        </article>',
      '        <p class="si-credit-final si-glitch">Happy 52, Karsten. Connection remains: persistent.</p>',
      '      </div>',
      '    </div>',
      '    <button id="si-credits-restart" class="si-btn si-credits-restart" type="button" disabled>Spiel neu starten</button>',
      '  </section>',
      '</div>'
    ].join("");

    document.body.appendChild(overlay);

    document.getElementById("si-close").addEventListener("click", function () {
      stopGameLoop();
      overlay.remove();
    });

    document.getElementById("si-start").addEventListener("click", function () {
      document.getElementById("si-start").disabled = true;
      startGame();
    });

    document.getElementById("si-restart").addEventListener("click", function () {
      document.getElementById("si-restart").disabled = true;
      startGame();
    });

    document.getElementById("si-credits-restart").addEventListener("click", function () {
      document.getElementById("si-restart").disabled = true;
      startGame();
    });

    document.getElementById("si-left").addEventListener("click", function () {
      if (!game) {
        return;
      }
      game.player.x -= 28;
      clampPlayer();
    });

    document.getElementById("si-right").addEventListener("click", function () {
      if (!game) {
        return;
      }
      game.player.x += 28;
      clampPlayer();
    });

    document.getElementById("si-fire").addEventListener("click", function () {
      if (!game) {
        return;
      }
      shoot();
    });

    return overlay;
  }

  function spawnInvaders(level) {
    var invaders = [];
    var rows = 2 + level;
    var cols = 7;
    var startX = 90;
    var startY = 55;
    var spacingX = 72;
    var spacingY = 42;

    for (var r = 0; r < rows; r += 1) {
      for (var c = 0; c < cols; c += 1) {
        invaders.push({
          x: startX + c * spacingX,
          y: startY + r * spacingY,
          w: 30,
          h: 20,
          alive: true
        });
      }
    }

    return invaders;
  }

  function resetStagesForGame() {
    var gameStage = document.getElementById("si-game-stage");
    var creditsStage = document.getElementById("si-credits-stage");
    var creditsScroll = document.getElementById("si-credits-scroll");
    var creditsRestart = document.getElementById("si-credits-restart");

    creditsStarted = false;
    gameStage.classList.remove("si-hidden", "si-fade-out");
    creditsStage.classList.remove("si-active");

    creditsScroll.classList.remove("si-run-scroll");
    creditsRestart.classList.remove("si-show");
    creditsRestart.disabled = true;
  }

  function startGame() {
    var canvas = document.getElementById("si-canvas");
    var ctx = canvas.getContext("2d");

    stopGameLoop();
    resetStagesForGame();

    game = {
      canvas: canvas,
      ctx: ctx,
      level: 1,
      maxLevel: 2,
      score: 0,
      lives: EASY_MODE ? 5 : 3,
      invaderDirection: 1,
      player: { x: canvas.width / 2 - 18, y: canvas.height - 34, w: 36, h: 12, speed: EASY_MODE ? 6 : 5 },
      bullets: [],
      enemyBullets: [],
      invaders: spawnInvaders(1),
      active: true,
      rafId: null,
      lastShotAt: 0,
      winner: false
    };

    setReminder("Level 1 gestartet (Easy). Halte die Linie und denk an Karsten.");
    updateHud();
    attachKeyboard();
    gameLoop();
  }

  function attachKeyboard() {
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
  }

  function detachKeyboard() {
    window.removeEventListener("keydown", onKeyDown);
    window.removeEventListener("keyup", onKeyUp);
  }

  function onKeyDown(event) {
    if (!game || !game.active) {
      return;
    }

    var key = event.key || "";
    if (key === "ArrowLeft" || key.toLowerCase() === "a") {
      KEY.LEFT = true;
    } else if (key === "ArrowRight" || key.toLowerCase() === "d") {
      KEY.RIGHT = true;
    } else if (event.code === "Space") {
      KEY.FIRE = true;
      event.preventDefault();
    }
  }

  function onKeyUp(event) {
    var key = event.key || "";
    if (key === "ArrowLeft" || key.toLowerCase() === "a") {
      KEY.LEFT = false;
    } else if (key === "ArrowRight" || key.toLowerCase() === "d") {
      KEY.RIGHT = false;
    } else if (event.code === "Space") {
      KEY.FIRE = false;
    }
  }

  function shoot() {
    var now = Date.now();
    if (now - game.lastShotAt < (EASY_MODE ? 170 : 220)) {
      return;
    }

    game.lastShotAt = now;
    game.bullets.push({
      x: game.player.x + game.player.w / 2 - 2,
      y: game.player.y - 8,
      w: 4,
      h: 8,
      vy: -7
    });
  }

  function enemyShoot() {
    if (Math.random() > (EASY_MODE ? 0.022 : 0.04)) {
      return;
    }

    var aliveInvaders = game.invaders.filter(function (i) {
      return i.alive;
    });

    if (aliveInvaders.length === 0) {
      return;
    }

    var shooter = aliveInvaders[Math.floor(Math.random() * aliveInvaders.length)];
    game.enemyBullets.push({
      x: shooter.x + shooter.w / 2,
      y: shooter.y + shooter.h,
      w: 4,
      h: 9,
      vy: EASY_MODE ? (3 + game.level * 0.35) : (4.2 + game.level * 0.5)
    });
  }

  function clampPlayer() {
    if (game.player.x < 8) {
      game.player.x = 8;
    }

    if (game.player.x + game.player.w > game.canvas.width - 8) {
      game.player.x = game.canvas.width - game.player.w - 8;
    }
  }

  function intersects(a, b) {
    return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
  }

  function update() {
    if (KEY.LEFT) {
      game.player.x -= game.player.speed;
    }
    if (KEY.RIGHT) {
      game.player.x += game.player.speed;
    }
    if (KEY.FIRE) {
      shoot();
    }

    clampPlayer();

    game.bullets.forEach(function (b) {
      b.y += b.vy;
    });

    game.enemyBullets.forEach(function (b) {
      b.y += b.vy;
    });

    game.bullets = game.bullets.filter(function (b) {
      return b.y + b.h > 0;
    });

    game.enemyBullets = game.enemyBullets.filter(function (b) {
      return b.y < game.canvas.height + 10;
    });

    var edgeHit = false;
    game.invaders.forEach(function (inv) {
      if (!inv.alive) {
        return;
      }
      inv.x += game.invaderDirection * (EASY_MODE ? (0.7 + game.level * 0.14) : (1 + game.level * 0.2));
      if (inv.x <= 6 || inv.x + inv.w >= game.canvas.width - 6) {
        edgeHit = true;
      }
    });

    if (edgeHit) {
      game.invaderDirection *= -1;
      game.invaders.forEach(function (inv) {
        if (inv.alive) {
          inv.y += 16;
        }
      });
    }

    enemyShoot();

    game.bullets.forEach(function (b) {
      game.invaders.forEach(function (inv) {
        if (inv.alive && intersects(b, inv)) {
          inv.alive = false;
          b.y = -999;
          game.score += 15;
        }
      });
    });

    game.enemyBullets.forEach(function (b) {
      if (intersects(b, game.player)) {
        b.y = game.canvas.height + 20;
        game.lives -= 1;
      }
    });

    var reachedBase = game.invaders.some(function (inv) {
      return inv.alive && inv.y + inv.h >= game.player.y;
    });

    if (reachedBase || game.lives <= 0) {
      endRun(false);
      return;
    }

    var alive = game.invaders.filter(function (inv) {
      return inv.alive;
    }).length;

    if (alive === 0) {
      if (game.level < game.maxLevel) {
        game.level += 1;
        game.invaders = spawnInvaders(game.level);
        game.invaderDirection = 1;
        setReminder("Level 1 geschafft. Reminder: Schreib Karsten heute noch kurz.");
      } else {
        game.winner = true;
        endRun(true);
        return;
      }
    }

    updateHud();
  }

  function draw() {
    var ctx = game.ctx;
    var canvas = game.canvas;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "rgba(70, 255, 150, 0.08)";
    for (var i = 0; i < 14; i += 1) {
      ctx.fillRect(i * 58, 0, 1, canvas.height);
    }

    ctx.fillStyle = "#7dffbc";
    ctx.fillRect(game.player.x, game.player.y, game.player.w, game.player.h);

    ctx.fillStyle = "#d9ff5d";
    game.bullets.forEach(function (b) {
      ctx.fillRect(b.x, b.y, b.w, b.h);
    });

    ctx.fillStyle = "#ff8f9f";
    game.enemyBullets.forEach(function (b) {
      ctx.fillRect(b.x, b.y, b.w, b.h);
    });

    game.invaders.forEach(function (inv) {
      if (!inv.alive) {
        return;
      }
      ctx.fillStyle = game.level === 1 ? "#5effa8" : "#99ff6f";
      ctx.fillRect(inv.x, inv.y, inv.w, inv.h);
      ctx.fillStyle = "rgba(0, 0, 0, 0.35)";
      ctx.fillRect(inv.x + 7, inv.y + 7, 4, 4);
      ctx.fillRect(inv.x + 19, inv.y + 7, 4, 4);
    });

    if (!game.active) {
      ctx.fillStyle = "rgba(0, 0, 0, 0.65)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#e9fff2";
      ctx.font = "24px Consolas";
      ctx.textAlign = "center";
      ctx.fillText(game.winner ? "Mission completed" : "System overrun", canvas.width / 2, canvas.height / 2);
      ctx.font = "16px Consolas";
      ctx.fillText(game.winner ? "2 Level klar gemacht." : "Noch ein Versuch moeglich.", canvas.width / 2, canvas.height / 2 + 30);
      ctx.textAlign = "left";
    }
  }

  function updateHud() {
    document.getElementById("si-level").textContent = "Level " + game.level + "/" + game.maxLevel;
    document.getElementById("si-score").textContent = "Score: " + game.score;
    document.getElementById("si-lives").textContent = "Leben: " + game.lives;
  }

  function setReminder(text) {
    document.getElementById("si-reminder").textContent = text;
  }

  function runCreditsSequence() {
    if (creditsStarted) {
      return;
    }

    creditsStarted = true;
    var gameStage = document.getElementById("si-game-stage");
    var creditsStage = document.getElementById("si-credits-stage");
    var creditsScroll = document.getElementById("si-credits-scroll");
    var creditsRestart = document.getElementById("si-credits-restart");

    setReminder("Victory confirmed. Umschaltung auf Credits-Sequenz...");
    gameStage.classList.add("si-fade-out");

    setTimeout(function () {
      stopGameLoop();
      gameStage.classList.add("si-hidden");
      creditsStage.classList.add("si-active");

      creditsScroll.classList.remove("si-run-scroll");
      void creditsScroll.offsetWidth;
      creditsScroll.classList.add("si-run-scroll");

      creditsScroll.addEventListener("animationend", function () {
        creditsRestart.disabled = false;
        creditsRestart.classList.add("si-show");
      }, { once: true });
    }, 700);
  }

  function endRun(isWinner) {
    game.active = false;
    KEY.LEFT = false;
    KEY.RIGHT = false;
    KEY.FIRE = false;

    if (isWinner) {
      setReminder("Finale: Kein Blu-ray-Steelcase. Echter Gewinn: Karsten nicht vergessen.");
      document.getElementById("si-restart").disabled = true;
      runCreditsSequence();
      return;
    }

    setReminder("Fehlversuch. Karsten lacht und sagt: Noch ein Run geht immer.");
    document.getElementById("si-restart").disabled = false;
  }

  function stopGameLoop() {
    if (game && game.rafId) {
      cancelAnimationFrame(game.rafId);
    }
    game = null;
    detachKeyboard();
  }

  function gameLoop() {
    if (!game) {
      return;
    }

    if (game.active) {
      update();
    }

    draw();
    game.rafId = requestAnimationFrame(gameLoop);
  }

  function start() {
    createOverlay();
  }

  window.SpaceInvanders = {
    start: start
  };
})();
