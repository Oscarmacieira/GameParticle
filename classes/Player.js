class Player {
  constructor({
    position,
    velocity,
    radius,
    color,
    health,
    energy,
    competences,
  }) {
    this.position = position;
    this.velocity = velocity;
    this.radius = radius;
    this.color = color;
    this.lastkey;
    this.health = health;
    this.energy = energy;
    this.isHit = false;
    this.competences = competences;
    this.isMoving = false;
    this.velocityMultiplier = 1;
    this.isShield = false;
  }

  draw() {
    c.beginPath();
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
  }

  update() {
    this.draw();
    if (this.energy < 100) {
      this.energy += 0.05;
    }
    if (this.health < 100) {
      this.health += 0.005;
    }

    this.position.x += this.velocity.x * this.velocityMultiplier;
    this.position.y += this.velocity.y * this.velocityMultiplier;
  }
}
