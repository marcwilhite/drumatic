'use strict';

window.AudioContext = window.AudioContext || window.webkitAudioContext;

var context = new AudioContext();

function Machine (context) {

  this.context = context;

  this.gainNode = this.context.createGain();
  this.gainNode.connect(this.context.destination);
  this.gain = this.gainNode.gain;
  this.gain.value = 0;

  this.audioBuffers = {};

  this.drums = {};

  this.tempo = 120;

  this.togglePlay = false;

  this.tick = 0;
}

Machine.prototype.play = function(tick) {
  if (this.togglePlay) {
    return;
  }
  this.togglePlay = true;
  this.tick = tick ? tick : 0;
  var _this = this;
  var currentTime = this.context.currentTime;
  var updateAudio = function() {
    if (_this.togglePlay) {
      requestAnimationFrame(updateAudio);
      if (_this.context.currentTime - currentTime >= 15/_this.tempo) {
        console.log("play");
        for (var k in _this.drums) {
          if (_this.drums[k][_this.tick]) {
            _this.playSound(_this.audioBuffers[k]);
          }
        }
        _this.tick = _this.tick < 31 ? _this.tick + 1 : 0;
        currentTime = _this.context.currentTime;
      }
    };
  };
  updateAudio();
};

Machine.prototype.stop = function () {
    var _this = this;
    setTimeout(function(){_this.tick = 0;}, 15000/this.tempo);
    this.togglePlay = false;
    return 0;
};

Machine.prototype.pause = function () {
    this.togglePlay = false;
    return this.tick;
}

Machine.prototype.playSound = function (buffer) {
  var source = this.context.createBufferSource();
  source.buffer = buffer;
  source.connect(this.gainNode);
  source.connect(this.context.destination);
  source.start(this.context.currentTime);
};

Machine.prototype.loadBuffers = function(audioFiles) {
    var bufferLoader = new BufferLoader(
        this.context,
        audioFiles,
        this._finishedLoading, 
        this
    );
    bufferLoader.load();
};

Machine.prototype.loadPattern = function(pattern) {
  this.drums = pattern.drums;
};

Machine.prototype.copyPattern = function(patternIndex) {
  for (var key in this.drums) {
    for (var i = 0; i < 32; i++) {
      patterns['pattern'+patternIndex].drums[key][i] = this.drums[key][i];
    }
  }
}

Machine.prototype._finishedLoading = function (bufferList, loaderContext) {
    loaderContext.audioBuffers['kick'] = bufferList[0];
    loaderContext.audioBuffers['snare'] = bufferList[1];
    loaderContext.audioBuffers['clhat'] = bufferList[2];
    loaderContext.audioBuffers['ophat'] = bufferList[3];
    loaderContext.audioBuffers['clap'] = bufferList[4];
    loaderContext.audioBuffers['rim'] = bufferList[5];
    loaderContext.audioBuffers['cowbell'] = bufferList[6];
    loaderContext.audioBuffers['clave'] = bufferList[7];
};

var machine = new Machine(context);
machine.loadPattern(patterns.pattern1);
machine.loadBuffers(kits.oldSchool);



