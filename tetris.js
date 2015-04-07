var tetris = {};
speed = 500;

//Draw the grid
tetris.drawPlayField = function(){
  for(var row=0;row<22;row++){
    $('#playfield').append('<tr class="'+row+'"></tr>');
    for (var col=0;col<10;col++){
      $('tr.'+row).append('<td id="'+col+'"></td>');
    }
  }
}


//Fill the cells
tetris.fillCells = function(coordinates,fillColor){
  for(var i=0;i<coordinates.length;i++){
    var row = coordinates[i].row;
    var col = coordinates[i].col;
    var $coor = $('.'+row).find('#'+col);
    $coor.attr('bgcolor',fillColor);
  }
}

// Spawn Shapes

tetris.spawn = function(){
  var random = Math.floor(Math.random()*7);
  var shapeArray = ['L', "J", "I", "O", "S", "T", "Z"];
  this.currentShape = shapeArray[random];
  this.origin = {row:2, col:5};
  this.currentCoor = this.shapeToCoor(this.currentShape, this.origin);
}

// Drop && Gravity

tetris.drop = function(addTime){
  if(addTime != false){
    x = parseFloat($('#time').text());
    tetris.timePlayed = (x + (speed/1000));
    $("#time").text(tetris.timePlayed);
  }
  var reverse = false;
  this.fillCells(this.currentCoor,"");
  this.origin.row++;

  for(var i=0;i<this.currentCoor.length;i++){
    this.currentCoor[i].row++;
    if(tetris.ifReverse()){
      reverse = true;
    }
  }
  if(reverse){
    for(var i=0;i<this.currentCoor.length;i++){
      this.currentCoor[i].row--;
    }
    this.origin.row--;
    console.log(tetris.origin);
    if(tetris.origin.row == 2){
      tetris.pause();
      if(localStorage.getItem("highScore") == null){
        localStorage.setItem('highScore', 0);
      }
      var newHigh = localStorage.getItem("highScore") < tetris.score;
      var congratulations = (newHigh ? "Congratulations on your new High Score!!!" : "");
      localStorage.setItem('highScore', (localStorage.getItem("highScore") > tetris.score ? localStorage.getItem("highScore") : tetris.score));
      $("body").text("").append("<div id='over' style='font-size:120px'> Game Over </div> <br>"
      + " <input style='height: 50px; width: 20em;' type='button' value='newGame' onClick='window.location.reload()'> <br><br>"
      + " <div id='score'> Score:" + tetris.score + " </div> <br>"
      + " <div id='highScore'> High Score: " + localStorage.getItem("highScore") + " </div> <br> "
      + " <div id='congratulations'> " + congratulations + " </div>");
    }
  }
  this.fillCells(this.currentCoor, 'black');
  if(reverse){
    this.fillCells(this.currentCoor,'BLACK');
    this.emptyFullRow();
    tetris.spawn();
  }
}

var gravity = window.setInterval(function(){
    tetris.drop();
}, speed);

//Move current shape
tetris.move = function(direction){
  this.fillCells(this.currentCoor,'');

  //move origin
  if(direction === 'right'){
    this.origin.col++;
  } else if (direction === 'left'){
    this.origin.col--;
  }

  this.currentCoor = this.shapeToCoor(this.currentShape,this.origin);

  if(this.ifReverse()){
    if(direction === 'right'){
      this.origin.col--;
    } else if (direction === 'left'){
      this.origin.col++;
    }
  }

  this.currentCoor = this.shapeToCoor(this.currentShape,this.origin);

  this.fillCells(this.currentCoor,'black');
}

$(document).keydown(function(e){
  if(e.keyCode === 39){
    tetris.move('right');
  } else if (e.keyCode === 37){
    tetris.move('left');
  } else if (e.keyCode === 38){
    tetris.rotate();
  } else if (e.keyCode === 40){
    tetris.drop(false);
  } else if (e.keyCode === 80){
    tetris.pause();
  } else if (e.keyCode === 83){
    tetris.restart = performance.now();
    gravity = window.setInterval(function(){
      tetris.drop();
    }, speed);
  }
})


tetris.pause = function(){
  window.clearInterval(gravity);
  $(document).unbind()
  $(document).keydown(function(e){
    if (e.keyCode === 83){
      tetris.restart = performance.now();
      gravity = window.setInterval(function(){
        tetris.drop();
      }, speed);
      $(document).unbind();
      $(document).keydown(function(e){
        if(e.keyCode === 39){
          tetris.move('right');
        } else if (e.keyCode === 37){
          tetris.move('left');
        } else if (e.keyCode === 38){
          tetris.rotate();
        } else if (e.keyCode === 40){
          tetris.drop(false);
        } else if (e.keyCode === 80){
          tetris.pause();
        } else if (e.keyCode === 83){
          tetris.restart = tetris.time();
          gravity = window.setInterval(function(){
            tetris.drop();
          }, speed);
        }
      })
    }
  })
}



// Rotate the shape

tetris.rotate = function(){
  var lastShape = this.currentShape;
  var ninety = /90/;
  var oneEighty = /180/;
  var twoSeventy = /270/;
  this.fillCells(this.currentCoor,'');
  if(this.currentShape.length == 1){
    this.currentShape = this.currentShape+"90";
  }else if(this.currentShape.match(ninety)){
    this.currentShape = this.currentShape[0]+"180";
  }else if(this.currentShape.match(oneEighty)){
    this.currentShape =  this.currentShape[0]+"270";
  }else if(this.currentShape.match(twoSeventy)){
    this.currentShape =  this.currentShape[0];
  }
  this.currentCoor = this.shapeToCoor(this.currentShape,this.origin);

  for(var i=0;i<this.currentCoor.length;i++){
    if(this.ifReverse()){
      this.currentShape = lastShape;
    }
  }

  this.currentCoor = this.shapeToCoor(this.currentShape,this.origin);
  this.fillCells(this.currentCoor,'black');
}

//If we need to reverse
tetris.ifReverse = function(){
  for(var i=0;i<this.currentCoor.length;i++){
    var row = this.currentCoor[i].row;
    var col = this.currentCoor[i].col;
    var $coor = $('.'+row).find('#'+col);
    if($coor.length === 0 || $coor.attr('bgcolor') === 'BLACK'){
      return true;
    }
  }
  return false;
}

// Empty full row

tetris.emptyFullRow = function(){
  var drops = 0;
  for(var i=21;i>0;i--){
    var rowIsFull = true;
    for(var j=0;j<10;j++){
      var $coor = $('.'+i).find('#'+j);
      if ($coor.attr('bgcolor') != "BLACK"){
        rowIsFull = false;
      }

      if(drops>0){
        var $newCoor = $('.'+(i+drops)).find('#'+j);
        $newCoor.attr('bgcolor',$coor.attr('bgcolor'));
      }
    }

    if(rowIsFull){
      drops++;
      tetris.score++;
      window.clearInterval(gravity);
      speed = ((500 - tetris.score*10) > 100 ? 500 - (tetris.score*10) : 100);
      gravity = window.setInterval(function(){
        tetris.drop();
      }, speed);

      $("#score").text("Score: "+tetris.score);
    }
  }
}


//Variables to store current coordinates

tetris.origin = {row:5, col:5};
tetris.currentShape = "J";
tetris.currentCoor;
tetris.score = 0;
tetris.time = performance.now();
tetris.timePlayed;

tetris.shapeToCoor = function(shape, origin){
  if(shape === "L"){
    return [
      {row:origin.row, col:origin.col},
      {row:origin.row-1, col:origin.col},
      {row:origin.row+1, col:origin.col},
      {row:origin.row+1, col:origin.col+1}
    ]
  }else if(shape === 'L90'){
    return [
    {row:origin.row, col:origin.col},
    {row:origin.row, col:origin.col-1},
    {row:origin.row, col:origin.col+1},
    {row:origin.row-1, col:origin.col+1}
    ]
  }else if(shape === 'L180'){
    return [
    {row:origin.row, col:origin.col},
    {row:origin.row-1, col:origin.col-1},
    {row:origin.row-1, col:origin.col},
    {row:origin.row+1, col:origin.col}
    ]
  }else if(shape === 'L270'){
    return [
    {row:origin.row, col:origin.col},
    {row:origin.row+1, col:origin.col-1},
    {row:origin.row, col:origin.col-1},
    {row:origin.row, col:origin.col+1}
    ]
  }else if(shape === 'I'){
    return [
      {row:origin.row, col:origin.col},
      {row:origin.row+1, col:origin.col},
      {row:origin.row-1, col:origin.col},
      {row:origin.row-2, col:origin.col}
    ]
  }else if(shape === 'I90'){
    return [
    {row:origin.row, col:origin.col},
    {row:origin.row, col:origin.col+1},
    {row:origin.row, col:origin.col-1},
    {row:origin.row, col:origin.col-2}
    ]
  }else if(shape === 'I180'){
    return [
    {row:origin.row, col:origin.col},
    {row:origin.row+1, col:origin.col},
    {row:origin.row-1, col:origin.col},
    {row:origin.row+2, col:origin.col}
    ]
  }else if(shape === 'I270'){
    return [
    {row:origin.row, col:origin.col},
    {row:origin.row, col:origin.col+1},
    {row:origin.row, col:origin.col-1},
    {row:origin.row, col:origin.col+2}
    ]
  }else if(shape === 'J'){
    return [
    {row:origin.row, col:origin.col},
    {row:origin.row-1, col:origin.col},
    {row:origin.row+1, col:origin.col},
    {row:origin.row+1, col:origin.col-1}
    ]
  }else if(shape === 'J90'){
    return [
    {row:origin.row, col:origin.col},
    {row:origin.row, col:origin.col-1},
    {row:origin.row, col:origin.col+1},
    {row:origin.row-1, col:origin.col-1}
    ]
  }else if(shape === 'J180'){
    return [
    {row:origin.row, col:origin.col},
    {row:origin.row-1, col:origin.col+1},
    {row:origin.row-1, col:origin.col},
    {row:origin.row+1, col:origin.col}
    ]
  }else if(shape === 'J270'){
    return [
    {row:origin.row, col:origin.col},
    {row:origin.row, col:origin.col-1},
    {row:origin.row, col:origin.col+1},
    {row:origin.row+1, col:origin.col+1}
    ]
  }else if(shape === 'O'){
    return [
    {row:origin.row, col:origin.col},
    {row:origin.row+1, col:origin.col},
    {row:origin.row, col:origin.col+1},
    {row:origin.row+1, col:origin.col+1}
    ]
  }else if(shape === 'S'){
    return [
    {row:origin.row, col:origin.col},
    {row:origin.row+1, col:origin.col},
    {row:origin.row, col:origin.col-1},
    {row:origin.row+1, col:origin.col+1}
    ]
  }else if(shape === 'S90'){
    return [
    {row:origin.row+2, col:origin.col},
    {row:origin.row+1, col:origin.col},
    {row:origin.row, col:origin.col+1},
    {row:origin.row+1, col:origin.col+1}
    ]
  }else if(shape === 'S180'){
    return [
    {row:origin.row, col:origin.col},
    {row:origin.row+1, col:origin.col},
    {row:origin.row, col:origin.col-1},
    {row:origin.row+1, col:origin.col+1}
    ]
  }else if(shape === 'S270'){
    return [
    {row:origin.row+2, col:origin.col},
    {row:origin.row+1, col:origin.col},
    {row:origin.row, col:origin.col+1},
    {row:origin.row+1, col:origin.col+1}
    ]
  }else if(shape === 'T'){
    return [
    {row:origin.row, col:origin.col},
    {row:origin.row, col:origin.col+1},
    {row:origin.row, col:origin.col-1},
    {row:origin.row-1, col:origin.col}
    ]
  }else if(shape === 'T90'){
    return [
    {row:origin.row, col:origin.col},
    {row:origin.row, col:origin.col+1},
    {row:origin.row+1, col:origin.col},
    {row:origin.row-1, col:origin.col}
    ]
  }else if(shape === 'T180'){
    return [
    {row:origin.row, col:origin.col},
    {row:origin.row, col:origin.col+1},
    {row:origin.row, col:origin.col-1},
    {row:origin.row+1, col:origin.col}
    ]
  }else if(shape === 'T270'){
    return [
    {row:origin.row, col:origin.col},
    {row:origin.row+1, col:origin.col},
    {row:origin.row, col:origin.col-1},
    {row:origin.row-1, col:origin.col}
    ]
  }else if(shape === 'Z'){
    return [
    {row:origin.row, col:origin.col},
    {row:origin.row+1, col:origin.col},
    {row:origin.row, col:origin.col+1},
    {row:origin.row+1, col:origin.col-1}
    ]
  }else if(shape === 'Z90'){
    return [
    {row:origin.row, col:origin.col},
    {row:origin.row+1, col:origin.col},
    {row:origin.row, col:origin.col-1},
    {row:origin.row-1, col:origin.col-1}
    ]
  }else if(shape === 'Z180'){
    return [
    {row:origin.row, col:origin.col},
    {row:origin.row+1, col:origin.col},
    {row:origin.row, col:origin.col+1},
    {row:origin.row+1, col:origin.col-1}
    ]
  }else if(shape === 'Z270'){
    return [
    {row:origin.row, col:origin.col},
    {row:origin.row+1, col:origin.col},
    {row:origin.row, col:origin.col-1},
    {row:origin.row-1, col:origin.col-1}
    ]
  }
}


// My implentation of moving left and right and falling down

// tetris.move = function(coordinates){
//   newCoordinates = [];
//   for(var i=0; i<coordinates.length;i++){
//       var x = {}
//       x.row = coordinates[i].row + 2;
//       x.col = coordinates[i].col;
//       newCoordinates.push(x);
//   }
//   tetris.fillCells(coordinates, "white");
//   tetris.fillCells(newCoordinates, 'green');
//   setTimeout(function(){
//     tetris.move(newCoordinates)
//   }, 1000);
//   tetris.key(newCoordinates);
// }
//
// tetris.key = function(coordinates) {
//   $("body").keydown(function(e) {
//     if(e.keyCode == 37) { // left
//       tetris.moveLeft = function(coordinates){
//         newCoordinates = [];
//         for(var i=0; i<coordinates.length;i++){
//           var x = {}
//           x.row = coordinates[i].row;
//           x.col = coordinates[i].col - 1;
//           newCoordinates.push(x);
//         }
//         tetris.fillCells(coordinates, "white");
//         tetris.fillCells(newCoordinates, 'green');
//         setTimeout(function(){
//           tetris.move(newCoordinates)
//         }, 1000);
//       }
//       tetris.moveLeft(coordinates);
//
//     }
//     else if(e.keyCode == 39) { // right
//       tetris.moveRight = function(coordinates){
//         newCoordinates = [];
//         for(var i=0; i<coordinates.length;i++){
//           var x = {}
//           x.row = coordinates[i].row;
//           x.col = coordinates[i].col + 1;
//           newCoordinates.push(x);
//         }
//         tetris.fillCells(coordinates, "white");
//         tetris.fillCells(newCoordinates, 'green');
//         setTimeout(function(){
//           tetris.move(newCoordinates)
//         }, 1000);
//       }
//       tetris.moveRight(coordinates);
//     }
//   });
// }

$(document).ready(function() {
  tetris.currentCoor = tetris.shapeToCoor(tetris.currentShape, tetris.origin);
  tetris.drawPlayField();
  tetris.fillCells(tetris.currentCoor,'black');
  // gravity();


  // My implentation of moving left and right and falling down

  // setTimeout(function() {
  //   tetris.fillCells(tetris.currentCoor, "white");
  //   tetris.move(tetris.currentCoor);
  // }, 1000);


})
