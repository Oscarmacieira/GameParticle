class GameObject {
  constructor({ x, y, radius, durability, src }) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.durability = durability;
    // set up the image
    this.image = new Image();
    this.image.src = src;
    this.image.width = 250;
    this.image.onload = () => {
      this.isLoaded = true;
    };
    this.alpha = durability;
  }

  draw() {
    c.save();
    c.globalAlpha = this.alpha;
    c.drawImage(this.image, this.x, this.y, this.radius, this.radius);
    c.restore();
  }

  update() {
    if (this.isLoaded) {
      this.draw();
    }
    this.alpha -= 1;
    this.durability -= 0.01;
  }
}
