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

  this.drums = {
    kick: [1,0,0,0,1,0,0,0,1,0,1,0,1,0,1,0,1,0,0,0,1,0,0,0,1,0,1,0,1,0,1,0],
    snare: [0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,1,0,0,0,0,0,0,0,1,0,1,1],
    clhat: [0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,0],
    ophat: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0],
    clap: [0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0],
    rim: [0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    cowbell: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0],
    clave: [0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0]
  };

  this.audioFiles =   ['media/kick.mp3',
                      'media/snare.mp3',
                      'media/clsdHat.mp3',
                      'media/opHat.mp3',
                      'media/clap.mp3',
                      'media/rim.mp3',
                      'media/cowbell.mp3',
                      'media/clave.mp3'];

  this.tempo = 110;

  this.togglePlay = false;

  this.tick = 0;
}

Machine.prototype.play = function (tick) {
  if (this.togglePlay) {
    return;
  }
  this.togglePlay = true;
  this.tick = tick ? tick : 0;
  var _this = this;
  var start = function loop () {
      if (_this.togglePlay) setTimeout(loop, 15000/_this.tempo);
      for (var k in _this.drums) {
        if (_this.drums[k][_this.tick]) {
          _this.playSound(_this.audioBuffers[k]);
        }
      }
      _this.tick = _this.tick < 31 ? _this.tick + 1 : 0;
  };
  start();
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

Machine.prototype.loadBuffers = function() {
    var bufferLoader = new BufferLoader(
        this.context,
        this.audioFiles,
        this._finishedLoading, 
        this
    );
    bufferLoader.load();
};

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
machine.loadBuffers();



