var movePixels = 10;
var delayMs = 50;
var catTimer1 = null;
var catTimer2 = null;
var startBtn = document.getElementById('start-button');
var cat1StartWalk = false;
var cat2StartWalk = false;
var direction = 'right';

function cat1Walk() {
  var currentLeft = parseInt($("#cat1").css('left'));
  if(direction === 'right'){
    $("#cat1").attr('class','');
    $("#cat1").css('left',(currentLeft + movePixels) + 'px');
    if (currentLeft > (window.innerWidth*0.9 - parseInt($("#cat1").css('width')))) {
      direction = 'left';
    }
  }else{
    $("#cat1").attr('class','reverse');
    $("#cat1").css('left',(currentLeft - movePixels) + 'px');
    if(currentLeft === 0){
      direction = 'right';
    }
  }
}

function startCat1Walk() {
  $("#cat1").attr('class','');
  if(!cat1StartWalk){
    cat1StartWalk = true;
    catTimer1 = window.setInterval(cat1Walk, delayMs);
  }
}

function stopCat1Walk(){
  catStart1Walk = false;
  window.clearInterval(catTimer1);
}

function cat2Walk() {
  var currentLeft = parseInt($("#cat2").css('left'));
  if(direction === 'right'){
    $("#cat2").attr('class','');
    $("#cat2").css('left',(currentLeft + movePixels) + 'px');
    if (currentLeft > (window.innerWidth*0.9 - parseInt($("#cat2").css('width')))) {
      direction = 'left';
    }
  }else{
    $("#cat2").attr('class','reverse');
    $("#cat2").css('left',(currentLeft - movePixels) + 'px');
    if(currentLeft === 0){
      direction = 'right';
    }
  }
}

function startCat2Walk() {
  $("#cat2").attr('class','');
  if(!cat2StartWalk){
    catStartWalk = true;
    catTimer1 = window.setInterval(cat2Walk, delayMs);
  }
}

function stopCat2Walk(){
  catStart2Walk = false;
  window.clearInterval(catTimer2);
}
