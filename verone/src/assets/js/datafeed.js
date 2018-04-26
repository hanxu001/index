'use strict';
/*
 This class implements interaction with UDF-compatible datafeed.

 See UDF protocol reference at
 https://github.com/tradingview/charting_library/wiki/UDF
 */

var Datafeeds = {};

Datafeeds.UDFCompatibleDatafeed = function (locale, updateFrequency) {
  // console.log(1);
  this._locale = locale;
  this._configuration = undefined;

  this._symbolSearch = null;
  this._symbolsStorage = null;
  this._barsPulseUpdater = new Datafeeds.DataPulseUpdater(this, updateFrequency || 10 * 1000);
  //this._quotesPulseUpdater = new Datafeeds.QuotesPulseUpdater(this);

  this._enableLogging = false;
  this._initializationFinished = false;
  this._callbacks = {};
  this._currentSubscriptionRecord = null;
  this._socket = new WebSocket("wss://websocket.haobtc.io:9502");
  // this._socket = new WebSocket("wss://ex.haobtc.io:9502");

  this._initialize();
};

Datafeeds.UDFCompatibleDatafeed.prototype.defaultConfiguration = function () {
  // console.log(2);
  return {
    supports_search: false,
    supports_group_request: true,
    supported_resolutions: ['1', '5', '15', '30', '60', '1D', '1W', '1M'],
    supports_marks: false,
    supports_timescale_marks: false
  };
};

Datafeeds.UDFCompatibleDatafeed.prototype.getServerTime = function (callback) {
  // console.log(3);
  if (this._configuration.supports_time) {

    this._send({
      method: "server.time",
      params: []
    }, function (res) {
      if (!res.error) {
        callback(res.result);
      }
    })
  }
};

Datafeeds.UDFCompatibleDatafeed.prototype.on = function (event, callback) {
  // console.log(4);
  if (!this._callbacks.hasOwnProperty(event)) {
    this._callbacks[event] = [];
  }

  this._callbacks[event].push(callback);
  return this;
};

Datafeeds.UDFCompatibleDatafeed.prototype._fireEvent = function (event, argument) {
  // console.log(5);
  if (this._callbacks.hasOwnProperty(event)) {
    var callbacksChain = this._callbacks[event];
    for (var i = 0; i < callbacksChain.length; ++i) {
      callbacksChain[i](argument);
    }

    this._callbacks[event] = [];
  }
};

Datafeeds.UDFCompatibleDatafeed.prototype.onInitialized = function () {
  // console.log(6);
  this._initializationFinished = true;
  this._fireEvent('initialized');
};

Datafeeds.UDFCompatibleDatafeed.prototype._logMessage = function (message) {
  // console.log(7);
  if (this._enableLogging) {
    var now = new Date();
    console.log(now.toLocaleTimeString() + '.' + now.getMilliseconds() + '> ' + message);
  }
};

Datafeeds.UDFCompatibleDatafeed.prototype._send = function (params, callback) {
  var that = this;
  if (that._socket.readyState===1) {
    that._socket.send(JSON.stringify(params));
    if(callback){
      that._socket.onmessage = function (res) {
        callback(res.data);
      }
    }
  }
};

Datafeeds.UDFCompatibleDatafeed.prototype._initialize = function () {
  // console.log(9);
  var that = this;

  this._setupWithConfiguration({
    "supports_search": true,
    "supports_group_request": false,
    "supports_marks": false,
    "supports_timescale_marks": false,
    "supports_time": false,
    "exchanges": [
      {"value": "otc", "name": "otc", "desc": "otc exchange"}
    ],
    "supportedResolutions": ["1", "5", "15", "30", "60", "120", "240", "360", "720", "D"]
  })

};

Datafeeds.UDFCompatibleDatafeed.prototype.onReady = function (callback) {
  // console.log(10);
  var that = this;
  if (this._configuration) {
    setTimeout(function () {
      callback(that._configuration);
    }, 0);
  } else {
    this.on('configuration_ready', function () {
      callback(that._configuration);
    });
  }
};

Datafeeds.UDFCompatibleDatafeed.prototype._setupWithConfiguration = function (configurationData) {
  // console.log(11);
  this._configuration = configurationData;

  if (!configurationData.exchanges) {
    configurationData.exchanges = [];
  }

  //	@obsolete; remove in 1.5
  var supportedResolutions = configurationData.supported_resolutions || configurationData.supportedResolutions;
  configurationData.supported_resolutions = supportedResolutions;

  //	@obsolete; remove in 1.5
  var symbolsTypes = configurationData.symbols_types || configurationData.symbolsTypes;
  configurationData.symbols_types = symbolsTypes;

  if (!configurationData.supports_search && !configurationData.supports_group_request) {
    throw new Error('Unsupported datafeed configuration. Must either support search, or support group request');
  }

  if (!configurationData.supports_search) {
    this._symbolSearch = new Datafeeds.SymbolSearchComponent(this);
  }

  if (configurationData.supports_group_request) {
    //	this component will call onInitialized() by itself
    this._symbolsStorage = new Datafeeds.SymbolsStorage(this);
  } else {
    this.onInitialized();
  }

  this._fireEvent('configuration_ready');
  this._logMessage('Initialized with ' + JSON.stringify(configurationData));
};

//	===============================================================================================================================
//	The functions set below is the implementation of JavaScript API.

Datafeeds.UDFCompatibleDatafeed.prototype.getMarks = function (symbolInfo, rangeStart, rangeEnd, onDataCallback, resolution) {

};

Datafeeds.UDFCompatibleDatafeed.prototype.getTimescaleMarks = function (symbolInfo, rangeStart, rangeEnd, onDataCallback, resolution) {

};

Datafeeds.UDFCompatibleDatafeed.prototype._symbolResolveURL = '/symbols';

//	BEWARE: this function does not consider symbol's exchange

Datafeeds.UDFCompatibleDatafeed.prototype.resolveSymbol = function (symbolName, onSymbolResolvedCallback, onResolveErrorCallback) {
  // console.log(symbolName);
  var that = this;

  if (!this._initializationFinished) {
    this.on('initialized', function () {
      that.resolveSymbol(symbolName, onSymbolResolvedCallback, onResolveErrorCallback);
    });

    return;
  }

  var resolveRequestStartTime = Date.now();
  that._logMessage('Resolve requested');

  function onResultReady(data) {
    var postProcessedData = data;
    if (that.postProcessSymbolInfo) {
      postProcessedData = that.postProcessSymbolInfo(postProcessedData);
    }

    that._logMessage('Symbol resolved: ' + (Date.now() - resolveRequestStartTime));

    onSymbolResolvedCallback(postProcessedData);
  }

  if (!this._configuration.supports_group_request) {
    setTimeout(function () {
      onResultReady({
        name: symbolName,
        market: symbolName,
        "exchange-traded": "",
        "exchange-listed": "",
        timezone: "Asia/Shanghai",
        minmov: 1,
        minmov2: 0,
        pricescale: 100,
        pointvalue: 1,
        fractional: false,
        session: "24x7",
        has_intraday: true,
        has_no_volume: false,
        ticker: "BTC",
        // description: cur_in.toUpperCase() + "/" + cur_out.toUpperCase(),
        description: 'BTCUSD',
        type: "bitcoin"
      })
    }, 1)
  } else {
    if (this._initializationFinished) {
      this._symbolsStorage.resolveSymbol(symbolName, onResultReady, onResolveErrorCallback);
    } else {
      this.on('initialized', function () {
        that._symbolsStorage.resolveSymbol(symbolName, onResultReady, onResolveErrorCallback);
      });
    }
  }
};

Datafeeds.UDFCompatibleDatafeed.prototype._historyURL = '/history';

Datafeeds.UDFCompatibleDatafeed.prototype.getBars = function (symbolInfo, resolution, rangeStartDate, rangeEndDate, onDataCallback, onErrorCallback) {
  // console.log(13);

  //debugger
  if (rangeStartDate > 0 && (rangeStartDate + '').length > 10) {
    throw new Error(['Got a JS time instead of Unix one.', rangeStartDate, rangeEndDate]);
  }

  //debugger
  var _this = this;
  if (!this._isGettingBar) {
    this._isGettingBar = true;
    var params = {
      // "event": "kline.query",
      "event": "web_kline_start",
      "params": [symbolInfo.market, rangeEndDate - ((rangeEndDate - rangeStartDate)/4), rangeEndDate, resolution]
    };
    this._send(params, function (response) {
      var res = JSON.parse(response);
      if (!res.error) {
        //debugger
        _this._isGettingBar = false;
        var data = res.result;
        var nodata = data.length === 0;
        var bars = [];

        var barsCount = nodata ? 0 : data.length;

        if (!nodata) {
          _this.cachedKlines = data
        }

        var volumePresent = true;
        var ohlPresent = true;

        for (var i = 0; i < barsCount; ++i) {
          var barValue = {
            time: data[i][0] * 1000,
            close: data[i][2] * 1
          };

          if (ohlPresent) {
            barValue.open = data[i][1] * 1;
            barValue.high = data[i][3] * 1;
            barValue.low = data[i][4] * 1;
          } else {
            barValue.open = barValue.high = barValue.low = barValue.close;
          }

          if (volumePresent) {
            barValue.volume = data[i][5] * 1;
          }

          bars.push(barValue);
        }
        //debugger
        onDataCallback(bars, {noData: nodata, nextTime: data.nb || data.nextTime});
      }
      else {
        if (!!onErrorCallback) {
          onErrorCallback(res.error);
        }
        return;
      }
    })

  }
};

Datafeeds.UDFCompatibleDatafeed.prototype.subscribeBars = function (symbolInfo, resolution, onRealtimeCallback, listenerGUID, onResetCacheNeededCallback) {
  // console.log(14);
  // alert('subscribeBars:  '+listenerGUID);
  this._barsPulseUpdater.subscribeDataListener(symbolInfo, resolution, onRealtimeCallback, listenerGUID, onResetCacheNeededCallback);
};

Datafeeds.UDFCompatibleDatafeed.prototype.unsubscribeBars = function (listenerGUID) {
  // console.log(15);
  // alert('unsubscribeBars:  '+listenerGUID);
  this._barsPulseUpdater.unsubscribeDataListener(listenerGUID);
};

Datafeeds.UDFCompatibleDatafeed.prototype.calculateHistoryDepth = function (period, resolutionBack, intervalBack) {
  // console.log(period,resolutionBack,intervalBack);
};

/*
 This is a pulse updating components for ExternalDatafeed. They emulates realtime updates with periodic requests.
 */

Datafeeds.DataPulseUpdater = function (datafeed, updateFrequency) {
  this._datafeed = datafeed;
  this._subscribers = {};

  this._requestsPending = 0;
  var that = this;
  var heart = function () {
    that._datafeed._send({event: 'ping'});
  };

  var update = function () {
    // if (that._requestsPending > 0) {
    //   return;
    // }

    // var hasSubscribe = false
    for (var listenerGUID in that._subscribers) {
      //hasSubscribe = true
      var subscriptionRecord = that._subscribers[listenerGUID];
      var resolution = subscriptionRecord.resolution;
      if (this._currentSubscriptionRecord != subscriptionRecord) {
        this._currentSubscriptionRecord = subscriptionRecord;

        (function (_subscriptionRecord) { // eslint-disable-line
          that._requestsPending++;
          var param = {
            // event: "kline.subscribe",
            event: "web_kline_update",
            params: [_subscriptionRecord.symbolInfo.market, resolution]
          };
          that._datafeed._send(param, function (res) {
            var res = JSON.parse(res);
            if (!res.error) {
              that._requestsPending--;

              if (res.event) {
                var bars = res.result;
                //	means the subscription was cancelled while waiting for data
                if (!that._subscribers.hasOwnProperty(listenerGUID)) {
                  return;
                }

                if (bars.length === 0) {
                  return;
                }

                // var data = bars[bars.length - 1];
                var data = bars;

                var lastBar = {
                  time: data[0] * 1000,
                  close: data[2] * 1
                };
                lastBar.open = data[1] * 1;
                lastBar.high = data[3] * 1;
                lastBar.low = data[4] * 1;
                lastBar.volume = data[5] * 1;


                if (!isNaN(_subscriptionRecord.lastBarTime) && lastBar.time < _subscriptionRecord.lastBarTime) {
                  return;
                }

                var subscribers = _subscriptionRecord.listeners;

                //	BEWARE: this one isn't working when first update comes and this update makes a new bar. In this case
                //	_subscriptionRecord.lastBarTime = NaN
                var isNewBar = !isNaN(_subscriptionRecord.lastBarTime) && lastBar.time > _subscriptionRecord.lastBarTime;

                _subscriptionRecord.lastBarTime = lastBar.time;

                for (var i = 0; i < subscribers.length; ++i) {
                  subscribers[i](lastBar);
                }
              }
              else {
                //console.log("kline订阅成功")
              }
            } else {
              console.error(res.error)
            }
          })
        })(subscriptionRecord);
      }
      else {
        //已订阅，不重复订阅
      }
    }
  };
  var interval = setInterval(update, 2 * 1000);
  var interval = setInterval(heart, 60 * 1000);
};;

Datafeeds.DataPulseUpdater.prototype.unsubscribeDataListener = function (listenerGUID) {
  // console.log(18);
  this._datafeed._logMessage('Unsubscribing ' + listenerGUID);
  delete this._subscribers[listenerGUID];
};

Datafeeds.DataPulseUpdater.prototype.subscribeDataListener = function (symbolInfo, resolution, newDataCallback, listenerGUID) {
  // console.log(19);
  this._datafeed._logMessage('Subscribing ' + listenerGUID);

  if (!this._subscribers.hasOwnProperty(listenerGUID)) {
    this._subscribers[listenerGUID] = {
      symbolInfo: symbolInfo,
      resolution: resolution,
      lastBarTime: NaN,
      listeners: []
    };
  }

  this._subscribers[listenerGUID].listeners.push(newDataCallback);
};

Datafeeds.DataPulseUpdater.prototype.periodLengthSeconds = function (resolution, requiredPeriodsCount) {
  // console.log(20);
  var daysCount = 0;

  if (resolution === 'D') {
    daysCount = requiredPeriodsCount;
  } else if (resolution === 'M') {
    daysCount = 31 * requiredPeriodsCount;
  } else if (resolution === 'W') {
    daysCount = 7 * requiredPeriodsCount;
  } else {
    daysCount = requiredPeriodsCount * resolution / (24 * 60);
  }

  return daysCount * 24 * 60 * 60;
};

export default {
  UDFCompatibleDatafeed: Datafeeds.UDFCompatibleDatafeed
};
