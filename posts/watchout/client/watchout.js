//try writing a custom transition/tween from scratch

var scores = {
  score: 0,
  highScore: 0,
  collisions: 0
}
var updateScore = function() {
  d3.select('#count2')
      .text(scores.score.toString())
}
var updateHighScore = function() {
  if (scores.highScore < scores.score) {
    scores.highScore = scores.score;
  }
  d3.select('#count1').text(scores.highScore.toString())
}
var updateCollisionCount = function() {
  d3.select('#count3')
      .text(scores.collisions.toString())
}
//determines the length of our game-board axes
var boardWidth = d3.select(".board").node().getBoundingClientRect().width;
var boardHeight = d3.select(".board").node().getBoundingClientRect().height
var axes = {
  x: d3.scale.linear().domain([0,100]).range([0, boardWidth]),
  y: d3.scale.linear().domain([0,100]).range([0, boardHeight])
}
var randomWidth = boardWidth * Math.random();
var randomHeight = boardHeight * Math.random();
// var randomWidth = d3.select(".board").node().getBoundingClientRect().width * Math.random();
// var randomHeight = d3.select(".board").node().getBoundingClientRect().height * Math.random();
var playerList = [
  {id:99, x: (axes.x * 0.5), y: (axes.y * 0.5)}
];
var baddieList = [
  {id:0, x:boardWidth * Math.random(), y:boardHeight * Math.random()},
  {id:1, x:boardWidth * Math.random(), y:boardHeight * Math.random()},
  {id:2, x:boardWidth * Math.random(), y:boardHeight * Math.random()},
  {id:3, x:boardWidth * Math.random(), y:boardHeight * Math.random()},
  {id:4, x:boardWidth * Math.random(), y:boardHeight * Math.random()},
  {id:5, x:boardWidth * Math.random(), y:boardHeight * Math.random()},
  {id:6, x:boardWidth * Math.random(), y:boardHeight * Math.random()},
  {id:7, x:boardWidth * Math.random(), y:boardHeight * Math.random()},
  {id:8, x:boardWidth * Math.random(), y:boardHeight * Math.random()},
  {id:9, x:boardWidth * Math.random(), y:boardHeight * Math.random()},
  {id:10, x:boardWidth * Math.random(), y:boardHeight * Math.random()},
  {id:11, x:boardWidth * Math.random(), y:boardHeight * Math.random()},
  {id:12, x:boardWidth * Math.random(), y:boardHeight * Math.random()},
  {id:13, x:boardWidth * Math.random(), y:boardHeight * Math.random()},
  {id:14, x:boardWidth * Math.random(), y:boardHeight * Math.random()},
  {id:15, x:boardWidth * Math.random(), y:boardHeight * Math.random()},
  {id:16, x:boardWidth * Math.random(), y:boardHeight * Math.random()}
];
var colors = ['red','blue','teal','green','black','yellow','pink','purple','orange'];

//initializes our svg game-window
var gameBoard = d3.select('.board').append('svg:svg')
      .attr('width', "100%")
      .attr('height', "100%")
      
      
//Player setup
var drag = d3.behavior.drag()
             .on('dragstart', function() { players.style('fill', 'gold'); })
             .on('drag', function() { players.attr('cx', d3.event.x)
                                            .attr('cy', d3.event.y); })
             .on('dragend', function() { players.style('fill', 'orange'); });

var players = gameBoard.selectAll('.player')
                .data( [{ x: (boardWidth / 2), y: (boardHeight / 2), r: 25 }] )
                  .enter()
                    .append('svg:circle')
                      .attr('class', 'player')
                      .attr('cx', function(d) { return d.x; })
                      .attr('cy', function(d) { return d.y; })
                      .attr('r', function(d) { return d.r; })
                      .call(drag)
                      .style('fill', 'orange')
                      .style('stroke', "black") 
                      .style('stroke-width', "3")
                      

      
      
//summon the horde!
var createBaddies = function(enemy_data) {
  baddies = gameBoard.selectAll(/*'circle.enemy'*/'image.enemy')
              .data(enemy_data, function(d) {return d.id}) 
            
  baddies.enter()
    /*.append('svg:circle')
      .attr('class', 'enemy')
      .attr('cx', function(baddie) { return axes.x(Math.random()) }) 
      .attr('cy', function(baddie) { return axes.y(Math.random()) })
      .attr('r', 0)*/
        /*.selectAll('circle.enemy') //add the shuriken pattern to each circle
          .append('defs')
          .append('pattern')
            .append('svg:image')
              .attr('x', 0)
              .attr('y', 0)
              .attr('width', 80)
              .attr('height', 80)
              .attr("xlink:href", "/Users/mattdalessandro/desktop/shuriken.jpg")*/
  
    .append("svg:image")
      .attr('class', 'enemy')
      .attr('x', function(baddie) { return axes.x(Math.random()) })
      .attr('y', function(baddie) { return axes.y(Math.random()) })
      .attr('width', 50)
      .attr('height', 50)
      .attr("xlink:href", "lib/shuriken1.png")
      
  baddies.exit()
    .remove()

  //Collisions!
  var checkForCollision = function(enemy) {
    var playerCx = parseInt(d3.select('.player').attr('cx'));
    var playerCy = parseInt(d3.select('.player').attr('cy'));
    var radiusSum = parseFloat(enemy.attr('r')) + parseFloat(d3.select('.player').attr('r'));
    var xDiff = parseFloat(enemy.attr('x')) - playerCx; //change cx - x
    var yDiff = parseFloat(enemy.attr('y')) - playerCy;
    var separation = Math.sqrt( Math.pow(xDiff,2) + Math.pow(yDiff,2) )
    if (separation < radiusSum) {
      onCollision();
    }    
  };
   
  //callback to collision check
  var onCollision = function() {
    updateHighScore();
    scores.score = 0;
    updateScore();
    scores.collisions += 1;
    updateCollisionCount();
  }

  //TWEEN!
  var tweenWithCollisionDetection = function(endData) {
    var baddie = d3.select(this);
    var startPos = {
      /*x: parseFloat(baddie.attr('cx')),
      y: parseFloat(baddie.attr('cy'))*/
      x: parseFloat(baddie.attr('x')), 
      y: parseFloat(baddie.attr('y'))
    }
    var endPos = {
      x: boardWidth * Math.random(),
      y: boardHeight * Math.random()
    }
    
    return function(t) { //return the custom collision function
      checkForCollision(baddie) 
      var enemyNextPos = {
        x: startPos.x + (endPos.x - startPos.x) * t,
        y: startPos.y + (endPos.y - startPos.y) * t
      }
      
      //update enemy location
    /*  baddie.attr('cx', enemyNextPos.x)
              .attr('cy', enemyNextPos.y)*/
      baddie.attr('x', enemyNextPos.x)
              .attr('y', enemyNextPos.y)
            
    };
  };

  baddies.transition()
            .duration(500)
            .attr('r', 25)
                .transition()
                    .duration(1500)
                    .tween('custom', tweenWithCollisionDetection)
                    //.style('fill', colors[Math.floor(Math.random() *  colors.length)])       
                      

}; //end to createBaddies
     
//game RUNNER
var run = function() {
  var turn = function() {
    createBaddies(baddieList);
  };
  var increaseScore = function() {
    scores.score += 1;
    updateScore();
  }
  turn();
  setInterval(turn, 2000);
  setInterval(increaseScore, 50);
};



run();
  
//seperate function to append enemies  
  
//setInterval
  //change position of enemies
  //set the tween to the collision check

  
  
  
  
  
  
  
  
  
  
  
  
  
  
