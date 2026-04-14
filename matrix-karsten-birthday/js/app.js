(function () {
  "use strict";

  var totalScenes = 9;
  var currentScene = 1;
  var collectedKeys = 0;
  var requiredKeys = 5;

  var wakeLines = [
    "Wake up, Karsten...",
    "The Matrix has you...",
    "A birthday anomaly has been detected...",
    "Heute wird ein Admin 52."
  ];

  var powershellLines = [
    "PS C:\\Matrix> Import-Module Legacy-Memory",
    "[OK] Profil wird geladen: Karsten",
    "[2013] Erstkontakt hergestellt",
    "[2013-2017] Enge Kollegen- und Freundschaftszeit erkannt",
    "[ROLE] Good Enterprise Admin: stabil",
    "[ROLE] Citrix Admin: solide wie Beton",
    "[SUPPORT] Exchange Support: aktiv",
    "[SUPPORT] Fileserver Support: zuverlässig",
    "[PERSON] Gespräche: immer wertvoll",
    "[FLAG] Familie = Priorität",
    "[FLAG] Hunde = Sehr gute Menschenkenntnis",
    "[DONE] Geburtstagsprofil erfolgreich geladen"
  ];

  var intuneLines = [
    "[INTUNE] Verbindung zum fiktiven Tenant hergestellt...",
    "[INTUNE] Device Compliance: 100% (weil Geburtstagsmodus)",
    "[INTUNE] Script Mode: harmless-demo.ps1",
    "[INTUNE] Keine echten Hacks. Nur Style.",
    "[INTUNE] Sammle Admin-Keys zur Freischaltung..."
  ];

  var appReplacements = [
    "Microsoft Teams -> Notepad",
    "Outlook -> Rechner",
    "Company Portal -> Paint",
    "OneDrive -> Fotos",
    "Word -> Editor",
    "Excel -> Snipping Tool",
    "PowerPoint -> Media Player",
    "Edge -> Uhr"
  ];

  function byId(id) {
    return document.getElementById(id);
  }

  function updateIndicator() {
    byId("scene-indicator").textContent = "Sequenz " + currentScene + "/" + totalScenes;
  }

  function goToScene(nextScene) {
    var active = document.querySelector(".scene.active");
    var target = byId("scene-" + nextScene);

    if (!target || nextScene < 1 || nextScene > totalScenes) {
      return;
    }

    if (active) {
      active.classList.remove("active");
    }

    currentScene = nextScene;
    target.classList.add("active");
    updateIndicator();

    if (currentScene === 4) {
      runPowerShellScene();
    }

    if (currentScene === 6) {
      runIntuneScene();
      buildMiniGame();
    }

    if (currentScene === 7) {
      runReplacementSequence();
    }
  }

  function typeLines(targetEl, lines, speed, callback) {
    targetEl.textContent = "";
    var allText = lines.join("\n");
    var idx = 0;

    function step() {
      if (idx <= allText.length) {
        targetEl.textContent = allText.slice(0, idx);
        idx += 1;
        setTimeout(step, speed);
      } else if (callback) {
        callback();
      }
    }

    step();
  }

  function runWakeScene() {
    var wakeTarget = byId("wake-typing");
    typeLines(wakeTarget, wakeLines, 42, function () {
      byId("wake-next").disabled = false;
    });
  }

  var powershellAlreadyRun = false;
  function runPowerShellScene() {
    if (powershellAlreadyRun) {
      return;
    }
    powershellAlreadyRun = true;
    var output = byId("powershell-output");
    var nextBtn = byId("powershell-next");
    nextBtn.disabled = true;

    typeLines(output, powershellLines, 27, function () {
      nextBtn.disabled = false;
    });
  }

  var intuneAlreadyRun = false;
  function runIntuneScene() {
    if (intuneAlreadyRun) {
      return;
    }
    intuneAlreadyRun = true;
    typeLines(byId("intune-output"), intuneLines, 26);
  }

  function buildMiniGame() {
    var field = byId("key-field");
    if (field.childElementCount > 0) {
      return;
    }

    var symbols = ["⌁", "⌘", "⟐", "◈", "⌬", "✶", "⚙", "▣", "⎈", "⟁", "⬢", "✹"];

    for (var i = 0; i < 12; i += 1) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "key-node";
      btn.textContent = symbols[i];
      btn.addEventListener("click", onKeyNodeClick);
      field.appendChild(btn);
    }
  }

  function onKeyNodeClick(event) {
    var node = event.currentTarget;
    if (node.classList.contains("hit")) {
      return;
    }

    node.classList.add("hit");
    collectedKeys += 1;

    if (collectedKeys > requiredKeys) {
      collectedKeys = requiredKeys;
    }

    byId("key-count").textContent = collectedKeys + "/" + requiredKeys;

    if (collectedKeys >= requiredKeys) {
      byId("game-next").disabled = false;
      byId("steelcase-tease").textContent = "Jackpot fast erreicht... Matrix lacht bereits.";
    }
  }

  function runReplacementSequence() {
    var list = byId("replacement-list");
    var nextBtn = byId("replace-next");
    nextBtn.disabled = true;

    if (list.childElementCount > 0) {
      nextBtn.disabled = false;
      return;
    }

    appReplacements.forEach(function (entry, index) {
      var item = document.createElement("li");
      item.className = "replace-item";
      item.textContent = "[Policy " + String(index + 1).padStart(2, "0") + "] " + entry;
      list.appendChild(item);

      setTimeout(function () {
        item.classList.add("show");
        if (index === appReplacements.length - 1) {
          nextBtn.disabled = false;
        }
      }, 300 * (index + 1));
    });
  }

  function runUpgrade() {
    var fill = byId("upgrade-fill");
    var status = byId("upgrade-status");
    var button = byId("upgrade-btn");

    button.disabled = true;
    status.textContent = "Status: Elevation laeuft...";
    fill.style.width = "100%";

    setTimeout(function () {
      status.textContent = "Status: Super Admin freigeschaltet.";
    }, 2000);

    setTimeout(function () {
      goToScene(9);
    }, 2500);
  }

  function attachImageFallbacks() {
    var images = document.querySelectorAll(".image-wrap img");

    images.forEach(function (img) {
      img.addEventListener("error", function () {
        var wrapper = img.parentElement;
        img.style.display = "none";

        var fallback = document.createElement("div");
        fallback.className = "image-fallback";
        fallback.textContent = img.getAttribute("data-fallback") || "Memory placeholder";
        wrapper.appendChild(fallback);
      });
    });
  }

  function setupInteractions() {
    byId("wake-next").disabled = true;
    byId("wake-next").addEventListener("click", function () {
      goToScene(2);
    });

    byId("rabbit-btn").addEventListener("click", function () {
      byId("rabbit-hint").textContent = "Signal bestaetigt. Der Hase nickt zufrieden.";
      setTimeout(function () {
        goToScene(3);
      }, 500);
    });

    byId("blue-pill").addEventListener("click", function () {
      byId("pill-message").textContent = "Blaue Pille: Du wachst im Ticket-Backlog auf. Nett, aber nein.";
    });

    byId("red-pill").addEventListener("click", function () {
      byId("pill-message").textContent = "Rote Pille akzeptiert. Geburtstagssystem wird entsperrt...";
      setTimeout(function () {
        goToScene(4);
      }, 450);
    });

    byId("powershell-next").addEventListener("click", function () {
      goToScene(5);
    });

    byId("memory-next").addEventListener("click", function () {
      goToScene(6);
    });

    byId("game-next").addEventListener("click", function () {
      goToScene(7);
    });

    byId("replace-next").addEventListener("click", function () {
      goToScene(8);
    });

    byId("upgrade-btn").addEventListener("click", runUpgrade);

    byId("restart-btn").addEventListener("click", function () {
      window.location.reload();
    });
  }

  function startMatrixRain() {
    var canvas = byId("matrix-canvas");
    var ctx = canvas.getContext("2d");
    var chars = "01ABCDEFGHIJKLMNOPQRSTUVWXYZ#*+-<>{}";
    var fontSize = 16;
    var columns;
    var drops;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      columns = Math.floor(canvas.width / fontSize);
      drops = [];
      for (var i = 0; i < columns; i += 1) {
        drops[i] = Math.floor(Math.random() * -30);
      }
    }

    function draw() {
      ctx.fillStyle = "rgba(0, 0, 0, 0.08)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#42ff8f";
      ctx.font = fontSize + "px monospace";

      for (var i = 0; i < drops.length; i += 1) {
        var char = chars.charAt(Math.floor(Math.random() * chars.length));
        var x = i * fontSize;
        var y = drops[i] * fontSize;

        ctx.fillText(char, x, y);

        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }

        drops[i] += 1;
      }
    }

    resize();
    setInterval(draw, 50);
    window.addEventListener("resize", resize);
  }

  function init() {
    updateIndicator();
    attachImageFallbacks();
    setupInteractions();
    startMatrixRain();
    runWakeScene();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
