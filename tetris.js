var tetris = {};
speed = 500;

//Draw the grid
tetris.drawPlayField = function(){
  $('#title').remove();
  $('#newGame').remove();
  tetris.currentCoor = tetris.shapeToCoor(tetris.currentShape, tetris.origin);
  tetris.fillCells(tetris.currentCoor,'black');
  gravity = window.setInterval(function(){
    tetris.drop();
  }, speed);
  for(var row=0;row<22;row++){
    $('#playfield').append('<tr class="'+row+'"></tr>');
    for (var col=0;col<10;col++){
      $('tr.'+row).append('<td id="'+col+'"></td>');
    }
  }

  var dynamic = $('#playfield');
  var static = $('#biography');

  // static.setAttribute("style", "margin-top:" + "-"+dynamic.height() + "px");
  static.css('margin-top', '-'+(dynamic.height()+17)+"px").css('margin-left', '375px');
}

// Start Screen

tetris.startScreen = function(){
  $('body').append("<div id='title' style='font-size:120px'> Tetris </div> <br>"
  + " <input id='newGame' style='height: 50px; width: 20em;' type='button' value='New Game' onClick='tetris.drawPlayField()'> <br><br>");
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

var resume = "My name is Tyler Wasden and I'm a rails developer in Austin, TX. <br><br> I started my journey into software development 3 years ago, graduated from MakerSquare(back when they still taught Ruby on Rails) here in Austin 2 years ago and have been in the startup scene ever since. <br> <br> I currently work for a great company that provides patient throughput software to hospitals around the country and world(I was hired to lead the internationalization effort and was happy to deliver ahead of schedule and expectations).  Since My first project I've enjoyed creating a help app with the accompanying Oauth configuration for our main app to act as the provider and the help app as the consumer.  As well as revamping our reporting by reducing page load time and enabling easier navigation of the returned data.  Along with building internal tools to allow our support team to take on tasks that previously tied up developer time.  We offer three different products and I've worked intimately with all of them, the newest one, Admit Control, was just released and we have our first customer install this month(December 2015).  I am proud to have created the paging system that alerts charge nurses to new patients assigned to their units via their preferred device(email or text). <br><br> I appreciate the wide array of challenges I have been presented with and while I know that I'm not close to knowing it all I do have the confidence and determination to figure out the task currently at hand(whatever it may be). <br><br> I'm impressed by RealHQ's rapid growth and unique yet practical solution to a very common problem; who do you trust to help you find the home that's right for you?  I know that with growth comes unexpected obstacles and interesting puzzles to solve, I would love to help solve those puzzles.  I also appreciate your preference for talent, creativity and open communication over location.  We currently work remotely 4 days a week and I enjoy the freedom and productivity that comes with being able to set my own schedule and work in a space that allows for a maximum amount of focus.  I've been fortunate enough to work under a lead engineer that both critiques my code on one hand while also listening to my insights on projects and development practices on the other hand.  His guidance has demonstrated the value that comes from solid communication channels. <br><br>  Aside from my professional tasks I volunteer with RailsBridge Austin mentoring up and coming developers.  I was excited to see a participant that I spent a significan amount of time mentoring recently land her first job with a local dev shop.  While the accomplishment was all hers I took great joy in sharing my knowledge with her and helping her succeed. <br><br> While I can't know for sure if I would be the best fit for RealHQ at this time I am confident using the products and tools that RealHQ uses and I strongly believe that I would be a positive contributor to both the technical and cultural ambitions of the company. <br><br> Thank you for the opportunity to present myself and I hope you enjoyed my tetris project. <br><br> Best Regards, <br><br> Tyler Wasden<br>twasden@gmail.com"
tetris.drop = function(addTime){
  if(addTime != false){
    x = parseFloat($('#time').text());
    tetris.timePlayed = parseFloat(Math.round((x + (speed/1000)) * 100) / 100).toFixed(2);
    $("#time").text(tetris.timePlayed);
    $("#biography").html(resume.substr(0,x*30));
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
      var endTime = parseFloat($('#time').text());
      var newHigh = localStorage.getItem("highScore") < tetris.score;
      var congratulations = (newHigh ? "Congratulations you set a new High Score of " + tetris.score + "!!!" : "");
      localStorage.setItem('highScore', (localStorage.getItem("highScore") > tetris.score ? localStorage.getItem("highScore") : tetris.score));
      $("body").text("").append("<div id='over' style='font-size:120px'> Game Over </div> <br>"
      + " <input style='height: 50px; width: 20em;' type='button' value='New Game' onClick='window.location.reload()'> <br><br>"
      + " <div id='score'> Score:" + tetris.score + " </div> <br>"
      + " <div id='highScore'> High Score: " + localStorage.getItem("highScore") + " </div> <br>"
      + " <div id='congratulations'> " + congratulations + " </div> <br>"
      + " <div id='title'> About Me: </div><br>"
      + " <div id='biography' style='width: 40%'> " +resume.substr(0,endTime*30)+ " </div><br>"
      + " <input id='revealText' style='height: 50px; width: 20em;' type='button' value='Reveal Text' onClick='tetris.revealResume()'> <br><br>");
      $('body').on('click', '#newGame', function(){
        console.log("hello");
        this.value.click();
      });
      $('body').click();
    }
  }
  this.fillCells(this.currentCoor, 'black');
  if(reverse){
    this.fillCells(this.currentCoor,'BLACK');
    this.emptyFullRow();
    tetris.spawn();
  }
}

//reveal resume

tetris.revealResume = function(){
  $('#biography').html(resume);
  $('#revealText').hide();
}


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



$(document).ready(function() {

  tetris.startScreen();



})
