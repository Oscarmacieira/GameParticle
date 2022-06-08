class Enemy {
  constructor(x, y, radius, color, velocity, isFocused) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
    this.isFocused = isFocused;
    this.velocityMultiplier = 1;
  }

  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
  }

  update() {
    this.draw();
    this.x = this.x + this.velocity.x * this.velocityMultiplier;
    this.y = this.y + this.velocity.y * this.velocityMultiplier;
  }
}
