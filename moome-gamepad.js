var MooMe = (function(settings){
  var mooMeSocket = 0;
  var defaultSettings = {
    role : 'game',
    channel : '',
    onMotion : function (yaw,pitch,roll) { console.log('override onMotion(yaw,pitch,roll) function with settings'); },
    onLeft : function () { console.log('override onLeft function with settings'); },
    onRight : function () { console.log('override onRight function with settings'); },
    onInsertCoin : function () { console.log('override onInsertCoin function with settings'); },
    onGameStart : function () { console.log('override onGameStart function with settings'); },
    onGameOver : function () { console.log('override onGameOver function with settings'); },
    onGameWarning : function () { console.log('override onGameWarning function with settings'); },
    onGameDanger : function () { console.log('override onGameDanger function with settings'); },
    onGameSuccess : function () { console.log('override onGameSuccess function with settings'); },
    onGameScore : function (score) { console.log('override onGameScore(score) function with settings'); },
    onInsertCoin : function () { console.log('override onInsertCoin function with settings'); },
    onReady : function () { console.log('override onReady function with settings'); }
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
  var _insertCoin = function(score){
    _sendData({action:'insertCoin'});
  };
  var _motion = function(yaw,pitch,roll){
    _sendData({action:'motion',yaw:yaw,pitch:pitch,roll:roll});
  };
  var _left = function(){
    _sendData({action:'left'});
  };
  var _right = function(){
    _sendData({action:'right'});
  };
  return {
    init :function(settings){
      setupSettings(defaultSettings, settings);
      mooMeSocket = new WebSocket('ws://moome.in/websocket');
      mooMeSocket.onopen = function() {
        _sendData({channel:globalSettings.channel,role:globalSettings.role});
        globalSettings.onReady();
        console.log('ok');
      }
      mooMeSocket.onerror = function(error) {
        console.log('ko: '+error);
      }
      mooMeSocket.onmessage = function(event) {
        var message = JSON.parse(event.data);
        console.log(event.data);
        if(message.action == 'motion') {
          globalSettings.onMotion(message.yaw,message.pitch,message.roll);
        }
        if(message.action == 'left') {
          globalSettings.onLeft();
        }
        if(message.action == 'right') {
          globalSettings.onRight();
        }
        if(message.action == 'insertCoin') {
          globalSettings.onInsertCoin();
        }
        if(message.action == 'gameStart') {
          globalSettings.onGameStart();
        }
        if(message.action == 'gameOver') {
          globalSettings.onGameOver();
        }
        if(message.action == 'gameSuccess') {
          globalSettings.onGameSuccess();
        }
        if(message.action == 'gameWarning') {
          globalSettings.onGameWarning();
        }
        if(message.action == 'gameDanger') {
          globalSettings.onGameDanger();
        }
        if(message.action == 'gameScore') {
          globalSettings.onGameScore(message.value);
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
    },
    insertCoin : function(score){
      _insertCoin(score);
    },
    motion : function(yaw,pitch,roll){
      _motion(yaw,pitch,roll);
    },
    left : function(){
      _left();
    },
    right : function(){
      _right();
    }
  };
})();
