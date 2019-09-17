var sketchProc=function(processingInstance){ with (processingInstance){
size(400, 400); 
frameRate(60);

var gravity = new PVector(0, 0.1);
var wind = new PVector(1, 0);
var windSpeed = 0;
var gameState = 0;
var baskets = [];
var traps = [];
var score = 5;
var spin = 0;
var sec = 0;

var basketObj1 = function(x,y){
    this.x = x;
    this.y = y;
};
basketObj1.prototype.draw = function() {
    fill(96, 247, 98);
    rect(this.x,this.y,10,60);
};
var basket1 = new basketObj1(390,50);
baskets.push(basket1);
//////////////////////////////////////
var basketObj2 = function(x,y){
    this.x = x;
    this.y = y;
};
basketObj2.prototype.draw = function() {
    fill(255, 0, 0);
    rect(this.x,this.y,10,100);
};
var basket2 = new basketObj2(390,300);
traps.push(basket2);
/////////////////////////////////////////////
var basketObj3 = function(x,y){
    this.x = x;
    this.y = y;
};
basketObj3.prototype.draw = function() {
    fill(96, 247, 98);
    rect(this.x,this.y,60,10);
};
var basket3 = new basketObj3(300,390);
baskets.push(basket3);
//////////////////////////////////////////////
var basketObj4 = function(x,y){
    this.x = x;
    this.y = y;
};
basketObj4.prototype.draw = function() {
    fill(255, 0, 0);
    rect(this.x,this.y,100,10);
};
var basket4 = new basketObj4(150,390);
traps.push(basket4);
/////////////////////////////////////////////
var ballObj = function(x, y) {
    this.position = new PVector(x, y);
    this.velocity = new PVector(0, 0);
    this.acceleration = new PVector(0, 0);
    this.size = 16;
    this.mass = this.size / 5;
    this.thrown = 0;
};
var ball = new ballObj(0, 0);
ballObj.prototype.applyForce = function(force) {
    var f = PVector.div(force, this.mass);
    this.acceleration.add(f);
};
ballObj.prototype.updatePosition = function() {
    var gravityForce = PVector.mult(gravity, this.mass);
    this.applyForce(gravityForce);
    var windForce = PVector.mult(wind, this.mass);
    windForce.mult(windSpeed);
    this.applyForce(windForce);
    var airFriction = PVector.mult(this.velocity,-0.02);
    this.applyForce(airFriction);
    if (this.thrown === 2) {
        this.velocity.add(this.acceleration);
        this.position.add(this.velocity);
        this.acceleration.set(0, 0);
    }
    if ((this.position.x < -10) || (this.position.x > 410) || (this.position.y < -80) || (this.position.y > 410)) {
        this.thrown = 0;
        score--;
    }
    
    if((this.position.x > 390 && this.position.x < 405 && this.position.y > 50 && this.position.y < 110) || (this.position.x > 300 && this.position.x < 360 && this.position.y > 395 && this.position.y < 405)){
        score = score + 2;
        ball.thrown = 0;
    }
    if((this.position.x > 390 && this.position.x < 405 && this.position.y > 300 && this.position.y < 400) || (this.position.x > 150 && this.position.x < 250 && this.position.y > 395 && this.position.y < 405)){
        score = score - 4;
        ball.thrown = 0;
    }
};

ballObj.prototype.draw = function() {
    pushMatrix();
    translate(this.position.x, this.position.y);
    rotate(spin);
    fill(242, 224, 58);
    ellipse(0, 0, this.size, this.size);
    noStroke();
    fill(255, 0, 255);
    triangle(0,0,8,0,0,8);
    fill(255, 0, 0);
    triangle(0,0,0,8,-8,0);
    fill(24, 12, 199);
    triangle(0,0,0,-8,-8,0);
    fill(77, 255, 0);
    triangle(0,0,0,-8,8,0);
    stroke(0, 0, 0);
    popMatrix();
};

///// EXPERIMENT /////
var mousePressed = function() {
    if(gameState === 0){
        gameState = 1;
    }
    if(mouseX > 20 && mouseX < 70 && mouseY > 170 && mouseY < 220 && ball.thrown === 0 && gameState === 1){
        ball.position.set(mouseX, mouseY);
        ball.thrown = 1;
    }
};
var mouseDragged = function() {
    if(ball.thrown === 1 && mouseX < 200 && mouseY < 300){
        ball.velocity.set(mouseX - pmouseX, mouseY - pmouseY);
        ball.position.set(mouseX, mouseY);
    }
};

mouseReleased = function() {
    if (ball.thrown === 1) {
        ball.thrown = 2;
    }
};

var draw = function() {
    if(gameState === 0){
        background(134, 176, 67);
        fill(0, 0, 0);
        textSize(50);
        text("Basketball", 80, 80);
        
        textSize(15);
        fill(255, 255, 255);
        text("Click mouse to begin", 130, 260);
        textSize(25);
        text("Instructions", 135, 150);
        textSize(15);
        text("Use Mouse to Throw the Balls", 95, 180);
        text("Red Basket: -4 Points", 125, 200);
        text("Green Basket: +2 Points", 115, 220);
    }
    else if(gameState === 1){
        background(227, 217, 152);
        noStroke();
        fill(255, 255, 255);
        rect(20,170,50,50);
        stroke(0, 0, 0);
        sec++;
        if(sec >= 60){
            sec = 0;
            windSpeed = random(-0.1,0.1);
        }
        if(ball.thrown === 2){
            spin = spin + Math.PI;
        }
        for (var i=0; i<baskets.length; i++) {
            baskets[i].draw();
            traps[i].draw();
        }
        if (ball.thrown > 0) {
            ball.draw();
        }
        if(ball.thrown > 1){
            ball.updatePosition();
        }
        if(score >= 20){
            gameState = 2;
        }
        if(score <= 0){
            gameState = 3;
        }
        fill(255, 0, 0);
        text("Score:", 5, 20);
        text(score, 60, 20);
        text("Wind:", 5, 40);
        text(windSpeed, 60, 40);
    }
    else if(gameState === 2){
        background(153, 182, 189);
        fill(217, 0, 0);
        textSize(50);
        text("YOU WON", 75, 210);
    }
    else if(gameState === 3){
        background(0, 0, 0);
        fill(255, 0, 0);
        textSize(50);
        text("GAME OVER", 45, 210);
    }
};



}};
