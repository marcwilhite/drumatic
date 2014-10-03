$(document).ready(function() { 

  var nextTick = 0;
  $('.button-play').on('click', function(){
    $('.button-play').blur();
    machine.play(nextTick);
  });

  $('.button-stop').on('click', function(){
    $('.button-stop').blur();
    nextTick = machine.stop();
  });

  $('.button-pause').on('click', function(){
    $('.button-pause').blur();
    nextTick = machine.pause();
  });

  $('#tempo').slider({
    formatter: function(value) {
      console.log(value);
      return value;
    }
  });
  $('#tempo').slider().on('slide', function(event){
    machine.tempo = event.value;
      
  })

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

});

var updateUI = function() {
    requestAnimationFrame(updateUI);
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
  }
updateUI();