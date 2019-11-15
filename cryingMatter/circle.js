function Circle(x, y, radius, hue) {
  // options for a body
  console.log("circle")
  var options = {
    friction: 0.5,
    restitution: 0.3,
  }
  this.body = Bodies.circle(x, y, radius, options);
  this.radius = radius;
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
    noStroke();
    fill(this.hue, 100, 100);
    circle(0, 0, this.radius*2)
    pop()
  }
}