class Shield {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.alpha = 50;
    this.lineWidth = 1;
  }

  draw() {
    c.save();
    c.globalAlpha = this.alpha;
    c.lineWidth = this.lineWidth;
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.strokeStyle = this.color;
    c.stroke();
    c.restore();
  }

  update() {
    this.lineWidth += 0.05;
    this.alpha -= 0.5;
    this.radius *= 1.02;
    this.draw();
  }
}
