var MooMe = (function(settings){
  var mooMeSocket = 0;
  var defaultSettings = {
    role : 'player',
    channel : '',
    onReady : function () { console.log('override onReady function with settings'); },
    onMotion : function (yaw,pitch,roll) { console.log('override onMotion(yaw,pitch,roll) function with settings'); },
    onLeft : function () { console.log('override onLeft function with settings'); },
    onRight : function () { console.log('override onRight function with settings'); }
  };
  var globalSettings = {};
  var setupSettings = function (defaultSettings, settings) {
    var key;
    for (key in defaultSettings) {
      if (Object.prototype.hasOwnProperty.call(defaultSettings, key)) {
        globalSettings[key] = defaultSettings[key];
      }
    }
    for (key in settings) {
      if (Object.prototype.hasOwnProperty.call(settings, key)) {
        globalSettings[key] = settings[key];
      }
    }
    return globalSettings;
  };
  var _sendData = function(data) {
    var dataAsString = JSON.stringify(data);
    console.log(dataAsString);
    mooMeSocket.send(dataAsString);
  }
  var _gameStart = function(){
    _sendData({action:'gameStart'});
  };
  var _gameOver = function(){
    _sendData({action:'gameOver'});
  };
  var _gameWarning = function(){
    _sendData({action:'gameWarning'});
  };
  var _gameDanger = function(){
    _sendData({action:'gameDanger'});
  };
  var _gameSuccess = function(){
    _sendData({action:'gameSuccess'});
  };
  var _gameScore = function(score){
    _sendData({action:'gameScore',value:score});
  };
  return {
    init :function(settings){
      setupSettings(defaultSettings, settings);
      mooMeSocket = new WebSocket('ws://moome.in/websocket');
      mooMeSocket.onopen = function() {
        _sendData({channel:globalSettings.channel,role:globalSettings.role});
        globalSettings.onReady();
      }
      mooMeSocket.onmessage = function(event) {
        var message = JSON.parse(event.data);
        if(message.action == 'motion') {
          globalSettings.onMotion(message.yaw,message.pitch,message.roll);
        }
        if(message.action == 'onLeft') {
          globalSettings.onLeft();
        }
        if(message.action == 'onRight') {
          globalSettings.onRight();
        }
      }
    },
    gameStart : function(){
      _gameStart();
    },
    gameOver : function(){
      _gameOver();
    },
    gameWarning : function(){
      _gameWarning();
    },
    gameDanger : function(){
      _gameDanger();
    },
    gameSuccess : function(){
      _gameSuccess();
    },
    gameScore : function(score){
      _gameScore(score);
    }
  };
})();
