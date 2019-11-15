function Box(x, y, w, h, hue) {
  // options for a body
  var options = {
    friction: 0.3,
    restitution: 1,
  }
  this.body = Bodies.rectangle(x, y, w, h, options);
  this.w = w;
  this.h = h;
  this.hue = hue;
  // add the body to the world
  World.add(world, this.body)

  // draw the body to the canvas
  // using p5 and rotate, translate it
  // to the right position/angle
  this.show = function() {
    var pos = this.body.position;
    var angle = this.body.angle;
    push();
    translate(pos.x, pos.y);
    rotate(angle);
    rectMode(CENTER);
    strokeWeight(1);
    stroke(255);
    fill(this.hue, 100, 100);
    rect(0, 0, this.w, this.h)
    pop()
  }
}