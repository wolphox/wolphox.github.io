var targetX = 47.5;
var targetY = 47.5;
var indicatorX = 50;
var indicatorY = 50;

var targetLeft = 0;
var targetRight = 0;
var targetTop = 0;
var targetBottom = 0;

var isOnTarget = true;

var indicatorCenterX = undefined;
var indicatorCenterY = undefined;
var aLeft = false;
var wUp = false;
var dRight = false;
var sDown = false;

var skyRotate = 0;
var groundRotate = 0;
var skyPitch = -280;
var groundPitch = 300;

//Speeds
var targetSpeedX = 0.6;
var targetSpeedY = 0.6;
var rotateSpeed = 0.8;
var equilibriumSpeed = 0.5;
var ySpeed = 0.4;

var movementMax = 2; //How much randomization for box movement (in px)
var rumbleMax = 2; //How much the cockpit rumbles (in px);
var rotateCockpitMax = 2;
var unstableCockpit = false;

var debug = false;

var endGame = false;


$(document).ready(function(){
console.log('Flight Controls... check!');

});

function setFlightEventListeners()
  {
    $(window).on('keydown', function(e){
      if (e.keyCode === 65 || e.which === 65)
      {

        //console.log('A button down');
        if (inverted)
        {
          aLeft = true;
        }else {
          dRight = true;
        }

      }
      if (e.keyCode === 87 || e.which === 87)
      {
        //console.log('W button down');

        if (inverted)
        {
          wUp = true;
        }else {
          sDown = true;
        }

      }
      if (e.keyCode === 68 || e.which === 68)
      {
        //console.log('D button down');

        if (inverted)
        {
          dRight = true;
        }else {
          aLeft = true;
        }

      }
      if (e.keyCode === 83 || e.which === 83)
      {
        //console.log('s button down');

        if (inverted)
        {
          sDown = true;
        }else {
          wUp = true;
        }

      }
    });

    $(window).on('keyup', function(e){
      if (e.keyCode === 65 || e.which === 65)
      {
        //console.log('A button Up');
        if (inverted)
        {
          aLeft = false;
        }else {
          dRight = false;
        }

      }
      if (e.keyCode === 87 || e.which === 87)
      {
        //console.log('W button Up');
        if (inverted)
        {
          wUp = false;
        }else {
          sDown = false;
        }

      }
      if (e.keyCode === 68 || e.which === 68)
      {
        //console.log('D button Up');

        if (inverted)
        {
          dRight = false;
        }else {
          aLeft = false;
        }

      }
      if (e.keyCode === 83 || e.which === 83)
      {
        //console.log('s button Up');
        if (inverted)
        {
          sDown = false;
        }else {
          wUp = false;
        }

      }
    })
  }

function moveTargetZone(){
//#######
//Moving the Target Zone
//Called from Update (every 50ms)
//#######

  var moveCalcX = (Math.random() * movementMax) - (movementMax/2);
  var moveCalcY = (Math.random() * movementMax) - (movementMax/2);

  targetX+=moveCalcX;
  targetY+=moveCalcY;
  $angleBox.css({
  'top': targetY+'vh',
  'left': targetX+'vw'
  });
}

function controlShuttle() {

//########
//Moving the Shuttle
//Called from Update (every 50ms)
//########

  if (aLeft === true)
  {
    targetX+=targetSpeedX;
    $angleBox.css({
    'left': targetX+'vw'
    });

    skyRotate+=rotateSpeed;
    groundRotate+=rotateSpeed;
    $sky.css({
    'transform': 'rotate('+skyRotate+'deg)',
    });
    $ground.css({
    'transform': 'rotate('+groundRotate+'deg)',
    });
  }

  if (wUp === true)
  {
    targetY+=targetSpeedY;
    $angleBox.css({
    'top': targetY+'vh'
    });

    skyPitch-=ySpeed;
    groundPitch+=ySpeed;
    $sky.css({
    'bottom': skyPitch+'vh'
    });
    $ground.css({
    'top': groundPitch+'vh'
    });
  }

  if (dRight === true)
  {
    targetX-=targetSpeedX;
    $angleBox.css({
    'left': targetX+'vw'
    });

    skyRotate-=rotateSpeed;
    groundRotate-=rotateSpeed;
    $sky.css({
    'transform': 'rotate('+skyRotate+'deg)',
    });
    $ground.css({
    'transform': 'rotate('+groundRotate+'deg)',
    });
  }
  if (sDown === true)
  {
    targetY-=targetSpeedY;
    $angleBox.css({
    'top': targetY+'vh'
    });

    skyPitch+=ySpeed;
    groundPitch-=ySpeed;
    $sky.css({
    'bottom': skyPitch+'vh'
    });
    $ground.css({
    'top': groundPitch+'vh'
    });
  }

}

function trackCoordinates(){

  //#######
  //Finding Center
  //Called from Update (every 50ms)
  //#######

  indicatorCenterX = $angleIndicator.position().left + ($angleIndicator.innerWidth() / 2);
  indicatorCenterY = $angleIndicator.position().top + ($angleIndicator.innerHeight() / 2);
  targetLeft = $angleBox.position().left;
  targetRight = ($angleBox.position().left + $angleBox.innerWidth());
  targetTop = $angleBox.position().top;
  targetBottom = ($angleBox.position().top + $angleBox.innerHeight());
}

function onTarget(){

//########
//Checking for Indicator on Target
//Called from Update (every 50ms)
//########

  if (debug)
  {
    console.log('Center Y: '+indicatorCenterY);
    console.log('Center X: '+indicatorCenterX);
    console.log('Top: '+ targetTop + ' Bottom: '+targetBottom);
    console.log('Left: '+ targetLeft + ' Right: ' + targetRight);
  }


  if (indicatorCenterX > targetLeft && indicatorCenterX < targetRight && indicatorCenterY > targetTop && indicatorCenterY < targetBottom)
  {
      if (debug)
      {
         console.log('on Target')
      }
      isOnTarget = true;
      $angleBox.css({
        'background-color' : 'rgba(88, 255, 88, 0.3)'
      });

  } else {
    isOnTarget = false;
    $angleBox.css({
        'background-color' : 'rgba(255, 150,150,0.5'
      });

  }

}

function rotationEquilibrium(){
  //#######
  //Return rotation to equilibrium (0) gradually always
  //Called from Update (every 50ms)
  //#######

  if (groundRotate > 0.1 || groundRotate < -0.1)
  {
    //console.log('Rotation: '+groundRotate)
    if (groundRotate > 0.1)
    {
      groundRotate -=equilibriumSpeed;
      skyRotate -=equilibriumSpeed;
      //console.log('decreasing Rotation')

      $sky.css({
      'transform': 'rotate('+skyRotate+'deg)',
      });
      $ground.css({
      'transform': 'rotate('+groundRotate+'deg)',
      });
        if (groundRotate < 0.2)
        {
          $sky.css({
          'transform': 'rotate(0deg)',
          });
          $ground.css({
          'transform': 'rotate(0deg)',
          });
          //console.log('Centralizing');
        }

    } else if (groundRotate < -0.1){
        groundRotate +=equilibriumSpeed;
        skyRotate +=equilibriumSpeed;
        //console.log('increasing Rotation')

        $sky.css({
        'transform': 'rotate('+skyRotate+'deg)',
        });
        $ground.css({
        'transform': 'rotate('+groundRotate+'deg)',
        });

          if (groundRotate > -0.2)
          {
            $sky.css({
            'transform': 'rotate(0deg)',
            });
            $ground.css({
            'transform': 'rotate(0deg)',
            });

            //console.log('Centralizing');
          }
      }
  }
}

function clampRoll(){
  //Called from Update (every 50ms)

  if (groundRotate > 15)
  {
    groundRotate = 15;
    skyRotate = 15;
  } else if (skyRotate < (-15)){

    groundRotate = -15;
    skyRotate = -15;
  }
}

//This function's use has somewhat depcracated now that the scenery's route is on tracks
function clampPitch(){
  //Called from Update (every 50ms)


  // if (groundPitch > 200)
  // {
  //   groundPitch = 200;
  //   skyPitch = -100;
  // } else if (groundPitch < 0){

  //   groundPitch = 0;
  //   //skyPitch = 100;
  // }
}

function cockpitRumble(){
  //######
  //Randomize rumble amounts.
  //Called from Update (every 50ms)
  //######

  var rumbleCalcX = (Math.random() * rumbleMax) - (rumbleMax/2);
  var rumbleCalcY = (Math.random() * rumbleMax) - (rumbleMax/2);

  $cockpit.animate({
    'top': '-'+rumbleCalcY+'vh',
    'left' : '-'+rumbleCalcX+'vw'
  },25)
  .animate({
    'top': '-2vh',
    'left' : '-2vw'
  },25);

  if (unstableCockpit){
     var rotateCockpitCalc = (Math.random() * rotateCockpitMax) - (rotateCockpitMax/2);

    $cockpit.css({
    'transform': 'rotate('+rotateCockpitCalc+'deg)'
  });
    setTimeout(function() {
       $cockpit.css({
      'transform': 'rotate(0deg)'
    });
    },25);


  }
}

var adjustFlightMeter = function (){
  //##############
  //Track player performance, win/lose
  //Called from Update (every 50ms)
  //#############

  if (!isOnTarget && !endGame)
    {
      flightMeterFill -= 0.5;
      $flightMeterInner.css({
        'width' : flightMeterFill+'vw'
      });
    } else if (isOnTarget)
    {
      flightMeterFill += 0.5;
      $flightMeterInner.css({
        'width' : flightMeterFill+'vw'
      });
    }

    if (flightMeterFill <= 0 && !endGame)
    {
      flightMeterFill = 0;
      console.log('shuttle crashed! You lose!')

      if (!endGame)
      {
        loseGame();
        endGame = true;
      }

    } else if (flightMeterFill >=80)
    {
      flightMeterFill = 80;
    }
}


