const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");
canvas.width = innerWidth;
canvas.height = innerHeight;

const x = canvas.width / 2;
const y = canvas.height / 2;

const scoreEl = document.getElementById("scoreEl");
const startGameBtn = document.getElementById("startGameBtn");
const modalEl = document.getElementById("modalEl");
const endScore = document.getElementById("endScore");
const healthEl = document.getElementById("playerHealth");
const energyEl = document.getElementById("playerEnergy");
const comp1Nb = document.getElementById("comp1-nb");
const comp1Outter = document.getElementById("comp1-outter");
const comp1Value = document.getElementById("comp1-value");

const comp2Outter = document.getElementById("comp2-outter");
const comp3Outter = document.getElementById("comp3-outter");
const comp3Nb = document.getElementById("comp3-nb");

const comp4Outter = document.getElementById("comp4-outter");
const comp5Outter = document.getElementById("comp5-outter");

let shields = [];
let portals = [];
let energies = [];
let hearths = [];
let munitions = [];
let projectiles = [];
let cursors = [];
let particles = [];
let enemies = [];
let keys = {
  a: {
    pressed: false,
    nb: 10,
    cooldown: 20,
    obj: comp1Outter,
    energy: 0,
  },
  z: {
    pressed: false,
    nb: 5,
    cooldown: 100,
    obj: comp2Outter,
    energy: 20,
  },
  e: {
    pressed: false,
    nb: 2,
    cooldown: 50,
    obj: comp3Outter,
    energy: 25,
  },
  r: {
    pressed: false,
    nb: 2,
    cooldown: 200,
    obj: comp4Outter,
    energy: 25,
  },
  d: {
    pressed: false,
    nb: 1,
    cooldown: 650,
    obj: comp5Outter,
    energy: 25,
  },
};

let player = new Player({
  position: { x: x, y: y },
  velocity: { x: 0, y: 0 },
  radius: 10,
  color: "white",
  health: 100,
  energy: 100,
  competences: {
    a: {
      nb: keys.a.nb,
      cooldown: keys.a.cooldown,
      energy: keys.a.energy,
    },
    z: {
      nb: keys.z.nb,
      cooldown: keys.z.cooldown,
      energy: keys.z.energy,
    },
    e: {
      nb: keys.e.nb,
      cooldown: keys.e.cooldown,
      energy: keys.e.energy,
    },
    r: {
      nb: keys.r.nb,
      cooldown: keys.r.cooldown,
      energy: keys.r.energy,
    },
    d: {
      nb: keys.d.nb,
      cooldown: keys.d.cooldown,
      energy: keys.d.energy,
    },
  },
});

function init() {
  player = new Player({
    position: { x: x, y: y },
    velocity: { x: 0, y: 0 },
    radius: 10,
    color: "white",
    health: 100,
    energy: 100,
    competences: {
      a: {
        nb: keys.a.nb,
        cooldown: keys.a.cooldown,
        energy: keys.a.energy,
      },
      z: {
        nb: keys.z.nb,
        cooldown: keys.z.cooldown,
        energy: keys.z.energy,
      },
      e: {
        nb: keys.e.nb,
        cooldown: keys.e.cooldown,
        energy: keys.e.energy,
      },
      r: {
        nb: keys.r.nb,
        cooldown: keys.r.cooldown,
        energy: keys.r.energy,
      },
      d: {
        nb: keys.d.nb,
        cooldown: keys.d.cooldown,
        energy: keys.d.energy,
      },
    },
  });
  shields = [];
  portals = [];
  energies = [];
  hearths = [];
  munitions = [];
  projectiles = [];
  particles = [];
  enemies = [];
  score = 0;
  cursors = [];
  scoreEl.innerHTML = score;
  endScore.innerHTML = score;
  healthEl.style.width = player.health + "%";
  healthEl.innerHTML = player.health + " / 100";
  energyEl.style.width = player.energy + "%";
  energyEl.innerHTML = player.energy + " / 100";

  comp1Nb.innerHTML = player.competences.a.nb;
  comp3Nb.innerHTML = player.competences.e.nb;
}

function spawnEnergies() {
  setInterval(() => {
    energies.push(
      new GameObject({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: 70,
        durability: 180,
        src: "./img/colorEnergy.png",
      })
    );
  }, 4000);
}

function spawnMunitions() {
  setInterval(() => {
    munitions.push(
      new GameObject({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: 50,
        durability: 100,
        src: "./img/colorIron.png",
      })
    );
  }, 1000);
}

function spanwHearths() {
  setInterval(() => {
    hearths.push(
      new GameObject({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: 60,
        durability: 150,
        src: "./img/colorHearth.png",
      })
    );
  }, 8000);
}

function spawnEnemies() {
  setInterval(() => {
    const radius = Math.random() * (30 - 4) + 4;
    let x;
    let y;

    if (Math.random() < 0.5) {
      x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
      y = Math.random() * canvas.height;
    } else {
      y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius;
      x = Math.random() * canvas.width;
    }

    const color = `hsl(${Math.random() * 360},50%,50%)`;
    const angle = Math.atan2(player.position.y - y, player.position.x - x);
    const velocity = { x: Math.cos(angle) * 3, y: Math.sin(angle) * 3 };
    enemies.push(
      new Enemy(
        x,
        y,
        radius,
        color,
        velocity,
        Math.random() < 0.3 ? true : false
      )
    );
  }, 1000);
}

let animationId;
let score = 0;
let cursorPosition = {};
let clickPosition = { x: 0, y: 0 };

function reduceCoolDown() {
  Object.keys(player.competences).forEach((key, indexKey) => {
    switch (indexKey) {
      case 0:
        comp1Outter.style.height = `${
          (player.competences["a"].cooldown / keys.a.cooldown) * 100
        }%`;
        break;
      case 1:
        comp2Outter.style.height = `${
          (player.competences["z"].cooldown / keys.z.cooldown) * 100
        }%`;
        break;
      case 2:
        if (player.competences["e"].nb === 0) {
          comp3Outter.style.height = `${
            (player.competences["e"].cooldown / (keys.e.cooldown * 10)) * 100
          }%`;
        } else {
          comp3Outter.style.height = `${
            (player.competences["e"].cooldown / keys.e.cooldown) * 100
          }%`;
        }
        break;
      case 3:
        comp4Outter.style.height = `${
          (player.competences["r"].cooldown / keys.r.cooldown) * 100
        }%`;
        break;
      case 4:
        comp5Outter.style.height = `${
          (player.competences["d"].cooldown / keys.d.cooldown) * 100
        }%`;
        break;
    }
    if (player.competences[key].cooldown > 0) {
      player.competences[key].cooldown--;
    }
  });
  if (player.competences.a.nb === 0) {
    comp1Outter.style.height = `100%`;
  }
}

function animate() {
  animationId = requestAnimationFrame(animate);
  reduceCoolDown();
  energyEl.style.width = player.energy + "%";
  energyEl.innerHTML = Math.round(player.energy, 1) + " / 100";
  healthEl.style.width = player.health + "%";
  healthEl.innerHTML = Math.round(player.health, 1) + " / 100";

  if (portals.length === 0 && player.competences.e.cooldown <= 0) {
    player.competences.e.nb = keys.e.nb;
    comp3Nb.innerHTML = player.competences.e.nb;
  }

  portals.forEach((portal, indexPortal) => {
    const xPlayerPortal = player.position.x - portal.x;
    const yPlayerPortal = player.position.y - portal.y;

    const distPortal = Math.hypot(xPlayerPortal, yPlayerPortal);

    if (player.competences.e.cooldown <= 0 && portal.alpha <= 0) {
      player.competences.e.nb++;
      comp3Nb.innerHTML = player.competences.e.nb;
    }

    if (
      distPortal - portal.radius - player.radius < 1 &&
      portals.length === 2 &&
      portal.isActive
    ) {
      // portals and player touch
      if (indexPortal === 0) {
        player.position.x =
          portals[1]?.x +
          (portals[1]?.radius + player.radius) * (xPlayerPortal > 0 ? -1 : 1);
        player.position.y =
          portals[1]?.y +
          (portals[1]?.radius + player.radius) * (yPlayerPortal > 0 ? -1 : 1);
        portals[1]?.disabledPortal();
      }
      if (indexPortal === 1) {
        player.position.x =
          portals[0]?.x +
          (portals[0]?.radius + player.radius) * (xPlayerPortal > 0 ? -1 : 1);
        player.position.y =
          portals[0]?.y +
          (portals[0]?.radius + player.radius) * (yPlayerPortal > 0 ? -1 : 1);
        portals[0]?.disabledPortal();
      }
      const angle = Math.atan2(
        cursorPosition.y - player.position.y,
        cursorPosition.x - player.position.x
      );
      const velocity = { x: Math.cos(angle) * 5, y: Math.sin(angle) * 5 };
      player.velocity = velocity;
    }

    if (portal.alpha <= 0) {
      portals.splice(indexPortal, 1);
    } else portal.update();
  });

  //energy and player touch
  energies.forEach((energy, indexEnergy) => {
    const dist = Math.hypot(
      player.position.x - energy.x,
      player.position.y - energy.y
    );

    //hearth and player touch
    if (dist - energy.radius - player.radius < 1 && player.energy < 100) {
      player.energy += 15;
      energyEl.style.width = player.energy + "%";
      energyEl.innerHTML = player.energy + " / 100";
      energies.splice(indexEnergy, 1);
    }
    if (energy.alpha < 0) {
      energies.splice(indexEnergy, 1);
    } else energy.update();
  });

  //hearths and player touch
  hearths.forEach((hearth, indexHearth) => {
    const dist = Math.hypot(
      player.position.x - hearth.x,
      player.position.y - hearth.y
    );

    //hearth and player touch
    if (dist - hearth.radius - player.radius < 1 && player.health < 100) {
      player.health += 10;
      healthEl.style.width = player.health + "%";
      healthEl.innerHTML = Math.round(player.health) + " / 100";
      hearths.splice(indexHearth, 1);
    }
    if (hearth.alpha < 0) {
      hearths.splice(indexHearth, 1);
    } else hearth.update();
  });

  munitions.forEach((munition, indexMunition) => {
    const dist = Math.hypot(
      player.position.x - munition.x,
      player.position.y - munition.y
    );

    //munition and player touch
    if (dist - munition.radius - player.radius < 1) {
      player.competences.a.nb += 10;
      comp1Nb.innerHTML = player.competences.a.nb;
      munitions.splice(indexMunition, 1);
    }
    if (munition.alpha < 0) {
      munitions.splice(indexMunition, 1);
    } else munition.update();
  });

  if (player.isHit) {
    var gradient = c.createRadialGradient(
      player.position.x,
      player.position.y,
      player.radius * 10,
      player.position.x,
      player.position.y,
      player.radius * 200
    );
    gradient.addColorStop(0, "rgba(0,0,0,0.1)");
    gradient.addColorStop(1, "rgb(255, 0, 0, 0.01)");
    c.fillStyle = gradient;
  } else c.fillStyle = "rgba(0,0,0,0.1)";

  c.fillRect(0, 0, canvas.width, canvas.height);
  player.update();

  particles.forEach((particle, indexParticle) => {
    if (particle.alpha <= 0) {
      particles.splice(indexParticle, 1);
    } else {
      particle.update();
    }
  });

  cursors.forEach((cursor, indexCursor) => {
    if (cursor.alpha <= 0) {
      cursors.splice(indexCursor, 1);
    } else {
      cursor.update();
    }
  });

  // player Movement
  // stop player at location
  const cursorDist = Math.hypot(
    player.position.x - cursorPosition.x,
    player.position.y - cursorPosition.y
  );
  const clickDist = Math.hypot(
    player.position.x - clickPosition.x,
    player.position.y - clickPosition.y
  );

  const directionAngle = Math.atan2(
    cursorPosition.y - player.position.y,
    cursorPosition.x - player.position.x
  );
  const velocity = {
    x: Math.cos(directionAngle) * 5,
    y: Math.sin(directionAngle) * 5,
  };
  player.velocity = velocity;

  if (cursorDist - player.radius < 1) {
    // || clickDist - player.radius < 1
    player.velocity.x = 0;
    player.velocity.y = 0;
    player.isMoving = false;
  } else player.isMoving = true;

  //throw proectiles
  if (
    keys.a.pressed &&
    player.competences.a.nb > 0 &&
    player.competences.a.cooldown === 0
  ) {
    comp1Value.style.display = "block";

    comp1Value.className = "fading-value";
    setTimeout(() => {
      comp1Value.classList.remove("fading-value");
      comp1Value.style.display = "none";
    }, 500);
    player.competences.a.nb--;
    player.competences.a.cooldown = keys.a.cooldown;
    comp1Nb.innerHTML = player.competences.a.nb;

    const angle = Math.atan2(
      clickPosition.y - player.position.y,
      clickPosition.x - player.position.x
    );
    const velocity = { x: Math.cos(angle) * 5, y: Math.sin(angle) * 5 };
    projectiles.push(
      new Projectile(player.position.x, player.position.y, 5, "grey", velocity)
    );
  }

  //dash
  if (
    keys.z.pressed &&
    player.isMoving &&
    player.competences.z.cooldown === 0 &&
    player.energy >= keys.z.energy
  ) {
    keys.z.pressed = false;
    player.energy -= keys.z.energy;
    player.competences.z.cooldown = keys.z.cooldown;
    energyEl.style.width = Math.round(player.energy, 1) + "%";
    energyEl.innerHTML = Math.round(player.energy, 1) + " / 100";
    //  const angle = Math.atan2(
    //  clickPosition.y - player.position.y,
    //  clickPosition.x - player.position.x
    //  );
    //  const velocity = { x: Math.cos(angle) * 15, y: Math.sin(angle) * 15 };
    //  player.velocity = velocity;
    player.velocityMultiplier = 3;
    setTimeout(() => {
      player.velocityMultiplier = 1;
    }, 500);
  }

  // create portal
  if (
    keys.e.pressed &&
    player.competences.e.cooldown <= 0 &&
    player.competences.e.nb > 0 &&
    portals.length < 2 &&
    (player.competences.e.nb === 2
      ? player.energy >= keys.e.energy / 2
      : player.energy >= keys.e.energy)
  ) {
    keys.e.pressed = false;

    if (player.competences.e.nb === 2) {
      player.competences.e.nb--;
      player.energy -= keys.e.energy / 2;
      player.competences.e.cooldown = keys.e.cooldown;
    } else if (player.competences.e.nb === 1) {
      player.competences.e.nb--;
      player.energy -= keys.e.energy;
      player.competences.e.cooldown = keys.e.cooldown * 10;
    }

    energyEl.style.width = Math.round(player.energy, 1) + "%";
    energyEl.innerHTML = Math.round(player.energy, 1) + " / 100";
    comp3Nb.innerHTML = player.competences.e.nb;

    portals.push(
      new Portal({
        x: clickPosition.x,
        y: clickPosition.y,
        radius: 40,
        durability: 350,
      })
    );
    if (portals.length === 2) {
      portals.forEach((portal) => {
        portal.alpha = portal.durability;
      });
    }
    console.log(player.energy, player.competences.e.nb);
  }

  // shield for proteection
  if (keys.r.pressed && player.competences.r.cooldown <= 0) {
    keys.r.pressed = false;
    player.competences.r.cooldown = keys.r.cooldown;

    const color = `hsl(${Math.random() * 360},50%,50%)`;

    player.isShield = true;
    shields.push(
      new Shield(
        player.position.x,
        player.position.y,
        player.radius + 10,
        color
      )
    );
  } else {
    player.isShield = false;
  }

  // slow enm

  if (keys.d.pressed && player.competences.d.cooldown <= 0) {
    player.competences.d.cooldown = keys.d.cooldown;
    enemies.forEach((enemy) => {
      enemy.velocityMultiplier = 0.3;
      setTimeout(() => {
        enemy.velocityMultiplier = 1;
      }, 500);
    });
  }

  projectiles.forEach((projectile, index) => {
    projectile.update();

    // delete proj out of map
    if (
      projectile.x + projectile.radius < 0 ||
      projectile.x - projectile.radius > canvas.width ||
      projectile.y + projectile.radius < 0 ||
      projectile.y - projectile.radius > canvas.height
    ) {
      setTimeout(() => {
        projectiles.splice(index, 1);
      }, 0);
    }
  });
  enemies.forEach((enemy, enemyIndex) => {
    enemy.update();

    shields.forEach((shield, indexShield) => {
      if (shield.alpha <= 0 || shield.radius >= 200) {
        shields.splice(indexShield, 1);
      } else {
        // shield.x = player.position.x;
        // shield.y = player.position.y;
        shield.update();
      }

      // shield and enemey collision
      const dist = Math.hypot(enemy.x - shield.x, enemy.y - shield.y);

      //player and enemy touch
      if (dist - enemy.radius - shield.radius < 1) {
        for (let i = 0; i < 20; i++) {
          particles.push(
            new Particle(enemy.x, enemy.y, Math.random() * 2, enemy.color, {
              x: (Math.random() - 0.5) * Math.random() * 6,
              y: (Math.random() - 0.5) * Math.random() * 6,
            }),
            new Particle(enemy.x, enemy.y, Math.random() * 2, shield.color, {
              x: (Math.random() - 0.5) * Math.random() * 6,
              y: (Math.random() - 0.5) * Math.random() * 6,
            })
          );
        }
        enemies.splice(enemyIndex, 1);
      }
    });

    // direct to player
    const angleEnemy = Math.atan2(
      player.position.y - enemy.y,
      player.position.x - enemy.x
    );
    const velocityEnemy = {
      x: Math.cos(angleEnemy) * 3,
      y: Math.sin(angleEnemy) * 3,
    };
    if (enemy.isFocused) {
      enemy.velocity = velocityEnemy;
    }
    if (
      enemy.x + enemy.radius < 0 ||
      enemy.x - enemy.radius > canvas.width ||
      enemy.y + enemy.radius < 0 ||
      enemy.y - enemy.radius > canvas.height
    ) {
      // delete enmey out of map
      setTimeout(() => {
        enemies.splice(enemyIndex, 1);
      }, 0);
    }
    const dist = Math.hypot(
      player.position.x - enemy.x,
      player.position.y - enemy.y
    );

    //player and enemy touch
    if (dist - enemy.radius - player.radius < 1) {
      player.health -= 20;
      healthEl.style.width = player.health + "%";
      healthEl.innerHTML = Math.round(player.health, 1) + " / 100";

      // genenrate rdm particles

      if (player.health <= 0) {
        cancelAnimationFrame(animationId);
        modalEl.style.display = "flex";
      } else {
        player.isHit = true;
        setTimeout(() => {
          player.isHit = false;
        }, 300);
        // delete enmey out of map
        setTimeout(() => {
          enemies.splice(enemyIndex, 1);
        }, 0);
        for (let i = 0; i < 20; i++) {
          particles.push(
            new Particle(
              player.position.x,
              player.position.y,
              Math.random() * 2,
              player.color,
              {
                x: (Math.random() - 0.5) * Math.random() * 6,
                y: (Math.random() - 0.5) * Math.random() * 6,
              }
            ),
            new Particle(enemy.x, enemy.y, Math.random() * 2, enemy.color, {
              x: (Math.random() - 0.5) * Math.random() * 6,
              y: (Math.random() - 0.5) * Math.random() * 6,
            })
          );
        }
      }
      endScore.innerHTML = score;
    }
    projectiles.forEach((projectile, projectileIndex) => {
      const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y);

      //projectile and enemy touch
      if (dist - enemy.radius - projectile.radius < 1) {
        // genenrate rdm particles
        for (let i = 0; i < 8; i++) {
          particles.push(
            new Particle(
              projectile.x,
              projectile.y,
              Math.random() * 2,
              enemy.color,
              {
                x: (Math.random() - 0.5) * Math.random() * 6,
                y: (Math.random() - 0.5) * Math.random() * 6,
              }
            )
          );
        }
        if (enemy.radius - 10 > 5) {
          // increase the score
          score += 100;
          scoreEl.innerHTML = score;
          gsap.to(enemy, {
            radius: enemy.radius - 10,
          });
          setTimeout(() => {
            projectiles.splice(projectileIndex, 1);
          }, 0);
        } else {
          // increase the score
          score += 250;
          scoreEl.innerHTML = score;
          setTimeout(() => {
            enemies.splice(enemyIndex, 1);
            projectiles.splice(projectileIndex, 1);
          }, 0);
        }
      }
    });
  });
}

//keyboards

addEventListener(
  "mousemove",
  function (e) {
    clickPosition.x = e.clientX;
    clickPosition.y = e.clientY;
  },
  false
);

addEventListener("click", (event) => {
  cursors.push(new Cursor(event.clientX, event.clientY, 0, "white"));
  const angle = Math.atan2(
    event.clientY - player.position.y,
    event.clientX - player.position.x
  );
  const velocity = { x: Math.cos(angle) * 5, y: Math.sin(angle) * 5 };
  player.velocity = velocity;
  cursorPosition = { x: event.clientX, y: event.clientY };
});

addEventListener("keydown", (event) => {
  switch (event.key) {
    case "a":
      keys.a.pressed = true;
      player.lastKey = "a";
      break;
    case "z":
      keys.z.pressed = true;
      player.lastKey = "z";
      break;
    case "e":
      if (player.competences.e.nb > 0 && player.competences.e.cooldown <= 0) {
        keys.e.pressed = true;
        player.lastKey = "e";
      }
      break;
    case "r":
      keys.r.pressed = true;
      player.lastKey = "r";
      break;
    case "d":
      keys.d.pressed = true;
      player.lastKey = "d";
      break;
  }
});
addEventListener("keyup", (event) => {
  switch (event.key) {
    case "a":
      keys.a.pressed = false;

      break;
    case "z":
      keys.z.pressed = false;
      break;
    case "e":
      keys.e.pressed = false;
      break;
    case "r":
      keys.r.pressed = false;
      break;
    case "d":
      keys.d.pressed = false;
      break;
  }
});

startGameBtn.addEventListener("click", () => {
  init();
  animate();
  spawnEnemies();
  spawnMunitions();
  spanwHearths();
  spawnEnergies();
  modalEl.style.display = "none";
});
