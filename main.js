'use strict';
$( document ).ready(init);



function init() {
    $('.tower').on('click', selectTower);
    $('#holder3').on('DOMNodeInserted', function(e) {
      if ($(e.target).is('.disc')) {
        iHasWon();
      }
    });
    startGame();
  }


//GLOBALS
var isSelectingSourceTower = true;
var $discQueuedToMove = {};
var queuedDiscSize = 0;
var prevTowerId = 'not';
var secondCheckToggle = false;




//ANIMATION TO START GAME

function startGame(){
  $('*').each(function(idx, li) {

        setTimeout(function(){
          $(li).css('visibility', '').addClass('animated bounceIn');
          },100*idx);
    }).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
      $('*').removeClass('bounceIn');
    });
}







//MAIN GAME LOGIC
function selectTower() {

  //WHAT TOWER IS SELECTED?
  var $selectedTower = $(this);
  var selectedTowerId = $selectedTower.attr('id');
  var selectedTowerNum = parseInt( $(this).attr('id').slice(-1) , 10);
  var $topDisc = {};
  var topDiscSize = 0;

  //WHAT IS ALL DISCS IN TOWER AND TOP DISC?
  var currentDiscs = $selectedTower.find('.disc').map(function() {return (this.id).slice(-1);}).get().join();

  //ONLY EVAL HOW MANY DISCS AND ORDER IF MORE THAN 0
  if (currentDiscs.split('').length !== 0) {
    var $topDisc = $selectedTower.find('.disc:first-of-type');
    var topDiscSize = parseInt($topDisc.attr('id').slice(-1), 10);
  }


  //IF USER CLICKED SAME TOWER TWICE DE-SELECT THAT DISC

  if (isSelectingSourceTower === false && $selectedTower.attr('id') === prevTowerId) {
    // RESETTING SELECTION VALUES TO BLANK
    $discQueuedToMove.css('background-color','#545454').removeClass('infinite animated pulse');
    $discQueuedToMove = {};
    isSelectingSourceTower = true;
    queuedDiscSize = 0;
    topDiscSize = 0;
    return;
  }



  //SELECT THE SOURCE TOWER TO PULL A DISC FROM
  if (isSelectingSourceTower === true && currentDiscs.split('').length !== 0) {
      //WHAT IS TOP DISC?
      var $topDisc = $selectedTower.find('.disc:first-of-type');
      //console.log($topDisc);
      var topDiscSize = parseInt($topDisc.attr('id').slice(-1), 10);
      //HIGHLIGHT TOP DISC TO MOVE & TOGGLE SELECTINGSOURCE FLAG
      $discQueuedToMove = $topDisc;
      $discQueuedToMove.css('background-color','#d21a9f').addClass('infinite animated pulse');
      isSelectingSourceTower = false;
      queuedDiscSize = topDiscSize;
      topDiscSize = 0;
      prevTowerId = $selectedTower.attr('id');
      return;
  }


  //SELECT A DESTINATION TOWER TO MOVE DISC TO
  if (isSelectingSourceTower === false && (queuedDiscSize < topDiscSize || topDiscSize === 0)) {
    //remove disc from source with animation
    $discQueuedToMove.css('background-color','#545454').removeClass('infinite pulse').addClass('bounceOutUp').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
      $discQueuedToMove.removeClass('bounceOutUp').remove();
      //add disc to destination with animation
      $discQueuedToMove.addClass('bounceInDown');
      $discQueuedToMove.insertBefore($selectedTower.find('.disc-holder div:first-child')).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
            $discQueuedToMove.removeClass('animated bounceInDown')
          });
    });
    isSelectingSourceTower = true;
    topDiscSize = 0;
    secondCheckToggle = false;
  }

  else if (queuedDiscSize > topDiscSize) {
    console.log('bad boy!');
    $selectedTower.addClass('shake').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
      $selectedTower.removeClass('shake');
    });
  }


}



function iHasWon(){
  var maybe = $('#holder3').find('.disc').length;
  if (maybe === 3) {
    console.log('YOU HAVE WON!');
    winGame();
  }
}

function winGame(){
  $('*').each(function(idx, li) {

        setTimeout(function(){
          $(li).css('background', 'linear-gradient( 45deg, rgb(179, 236, 188), rgb(21, 205, 49))').addClass('animated infinite tada');
          },100*idx);
    });
}
