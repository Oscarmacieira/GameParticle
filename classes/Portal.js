class Portal {
  constructor({ x, y, radius, durability }) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.durability = durability;
    // set up the image
    this.alpha = durability;
    this.rotation = 0;
    this.isActive = true;
  }

  disabledPortal() {
    this.isActive = false;
    setTimeout(() => {
      this.isActive = true;
    }, 2000);
  }

  strokeStar(x, y, r, n, inset, color, rotation) {
    c.save();
    c.globalAlpha = this.alpha;
    c.strokeStyle = color;
    c.fillStyle = color;
    c.filter = "blur(2.5px)";

    c.beginPath();
    c.translate(x, y);
    c.rotate((rotation * Math.PI) / 180);

    c.moveTo(0, 0 - r);

    for (var i = 0; i < n; i++) {
      c.rotate(Math.PI / n);
      c.lineTo(0, 0 - r * inset);
      c.rotate(Math.PI / n);
      c.lineTo(0, 0 - r);
    }
    c.closePath();
    c.fill();
    c.restore();
  }

  draw() {
    this.strokeStar(
      this.x,
      this.y,
      this.radius,
      10,
      this.radius / 50,
      "#BA55D3",
      this.rotation
    );
    this.strokeStar(
      this.x,
      this.y,
      this.radius / 1.3,
      10,
      this.radius / 50,
      "#DDA0DD",
      0
    );
  }

  update() {
    this.alpha--;
    this.rotation += 0.5;
    this.draw();
  }
}
