$(document).ready(function() { 

  var nextTick = 0;
  $('.button-play').on('click', function(){
    $('.button-play').blur();
    machine.play(nextTick);
    $(".button-play").addClass("active");
    $(".button-pause").removeClass("active");
  });

  $('.button-stop').on('click', function(){
    $('.button-stop').blur();
    $(".button-play").removeClass("active");
    $(".button-pause").removeClass("active");
    nextTick = machine.stop();
  });

  $('.button-pause').on('click', function(){
    $('.button-pause').blur();
    $(".button-play").removeClass("active");
    $(".button-pause").addClass("active");
    nextTick = machine.pause();
  });

  $('#tempo').slider({
    formatter: function(value) {
      return value;
    }
  });

  $('#tempo').slider('setValue', machine.tempo);

  $('#tempo').slider().on('slide', function(event){
    machine.tempo = event.value;     
  });

  $('#volume').slider({
    formatter: function(value) {
      return value;
    }
  });

  $('#volume').slider().on('slide', function(event){
      machine.gain.value = (event.value / 50) - 1.0;
  });

  for (var k in machine.drums) {
    for (var i = 0; i < 32; i++) {
      $('.'+k+'-btn-'+ i).on('click', {idx: i, drum: k}, function(event){
        machine.drums[event.data.drum][event.data.idx] = machine.drums[event.data.drum][event.data.idx] ? 0 : 1;
      });
    }
  }

  for (var i = 1; i <= 8; i++) {
    $('#pattern-pattern'+i).on('click', {idx: i}, function(event) {
      machine.loadPattern(patterns['pattern'+event.data.idx]);
      $('.pattern-notify h4').text('Playing Pattern: '+event.data.idx);
    });  
  }

  $('#save-patterns').on('click', function(){
    patternStorage.save();
  });


  $('#kits-old-school').on('click', function(){
    machine.loadBuffers(kits.oldSchool);
  });

  $('#kits-techno').on('click', function(){
    machine.loadBuffers(kits.techno);
  });

  for (var i = 1; i <= 8; i++) {
      $('#pattern-pattern'+i).on('click', {idx: i}, function(event) {
        machine.loadPattern(patterns['pattern'+event.data.idx]);
        $('.pattern-notify h4').text('Playing Pattern: '+event.data.idx);
    });
  }

  Mousetrap.bind('1', function() { 
    machine.loadPattern(patterns['pattern1']);
    $('.pattern-notify h4').text('Playing Pattern: 1');
  });

  Mousetrap.bind('2', function() { 
    machine.loadPattern(patterns['pattern2']);
    $('.pattern-notify h4').text('Playing Pattern: 2');
  });

  Mousetrap.bind('3', function() { 
    machine.loadPattern(patterns['pattern3']);
    $('.pattern-notify h4').text('Playing Pattern: 3');
  });

  Mousetrap.bind('4', function() { 
    machine.loadPattern(patterns['pattern4']);
    $('.pattern-notify h4').text('Playing Pattern: 4');
  });

  Mousetrap.bind('5', function() { 
    machine.loadPattern(patterns['pattern5']);
    $('.pattern-notify h4').text('Playing Pattern: 5');
  });

  Mousetrap.bind('6', function() { 
    machine.loadPattern(patterns['pattern6']);
    $('.pattern-notify h4').text('Playing Pattern: 6');
  });

  Mousetrap.bind('7', function() { 
    machine.loadPattern(patterns['pattern7']);
    $('.pattern-notify h4').text('Playing Pattern: 7');
  });

  Mousetrap.bind('8', function() { 
    machine.loadPattern(patterns['pattern8']);
    $('.pattern-notify h4').text('Playing Pattern: 8');
  });

  Mousetrap.bind('shift+1', function() { 
    machine.copyPattern(1);
    machine.loadPattern(patterns['pattern1']);
    $('.pattern-notify h4').text('Playing Pattern: 1');
  });

  Mousetrap.bind('shift+2', function() { 
    machine.copyPattern(2);
    machine.loadPattern(patterns['pattern2']);
    $('.pattern-notify h4').text('Playing Pattern: 2');
  });

  Mousetrap.bind('shift+3', function() { 
    machine.copyPattern(3);
    machine.loadPattern(patterns['pattern3']);
    $('.pattern-notify h4').text('Playing Pattern: 3');
  });

  Mousetrap.bind('shift+4', function() { 
    machine.copyPattern(4);
    machine.loadPattern(patterns['pattern4']);
    $('.pattern-notify h4').text('Playing Pattern: 4');
  });

  Mousetrap.bind('shift+5', function() { 
    machine.copyPattern(5);
    machine.loadPattern(patterns['pattern5']);
    $('.pattern-notify h4').text('Playing Pattern: 5');
  });

  Mousetrap.bind('shift+6', function() { 
    machine.copyPattern(6);
    machine.loadPattern(patterns['pattern6']);
    $('.pattern-notify h4').text('Playing Pattern: 6');
  });

  Mousetrap.bind('shift+7', function() { 
    machine.copyPattern(7);
    machine.loadPattern(patterns['pattern7']);
    $('.pattern-notify h4').text('Playing Pattern: 7');
  });

  Mousetrap.bind('shift+8', function() { 
    machine.copyPattern(8);
    machine.loadPattern(patterns['pattern8']);
    $('.pattern-notify h4').text('Playing Pattern: 8');
  });

  Mousetrap.bind('space', function() { 
    if (!machine.togglePlay) {
      machine.play(nextTick);
      $(".button-play").addClass("active");
      $(".button-pause").removeClass("active");
    } else {
      nextTick = machine.pause();
      $(".button-play").removeClass("active");
      $(".button-pause").addClass("active");
    }
  });

  Mousetrap.bind('return', function() { 
    machine.stop();
    $(".button-play").removeClass("active");
    $(".button-pause").removeClass("active");
  });

});

var frameCheck = new Date();
var updateUI = function() {
  requestAnimationFrame(updateUI);
  if ((new Date() - frameCheck) > 40) {
    for (var k in machine.drums) {
      for (var i = 0; i < 32; i++) {
        $('.'+k+'-btn-'+ i).blur();
        if (machine.tick === i) {
          $('.'+k+'-btn-'+ i).addClass('btn-danger');
          $('.'+k+'-btn-'+ i).removeClass('btn-primary');
        } else {
          $('.'+k+'-btn-'+ i).addClass('btn-primary');
          $('.'+k+'-btn-'+ i).removeClass('btn-danger');
        }
        if (machine.drums[k][i]) {
          $('.'+k+'-btn-'+ i).addClass('btn-warning');
          $('.'+k+'-btn-'+ i).removeClass('btn-primary');
        } else {
          $('.'+k+'-btn-'+ i).removeClass('btn-warning');
          $('.'+k+'-btn-'+ i).addClass('btn-primary');
        }
      }
    }
    frameCheck = new Date();
  }
}
updateUI();

if (!window.AudioContext) {
    $("body").append("<div class='container'><h4>Browser not supported. Please upgrade to a modern HTML5 browser (i.e. Chrome, Firefox, or Safari)</h4>");
}