/**
 * Return a unique identifier with the given `len`.
 *
 *     handy.uid(10);
 *     // => "FDaS435D2z"
 *
 * @param {Number} len
 * @return {String}
 * @api private
 */
var sampleNames = [
  'zipper'
  , 'approval'
  , 'jellyfish'
  , 'pet'
  , 'yam'
  , 'fold'
  , 'reading'
  , 'cap'
  , 'tooth'
  , 'fairies'
  , 'ray'
  , 'design'
  , 'toad'
  , 'month'
  , 'sisters'
  , 'jam'
  , 'talk'
  , 'root'
  , 'downtown'
  , 'teaching'
  , 'trains'
  , 'observation'
  , 'account'
  , 'space'
  , 'giraffe'
  , 'care'
  , 'low'
  , 'battle'
  , 'sound'
  , 'engine'
  , 'scent'
  , 'calculator'
  , 'bait'
  , 'wine'
  , 'robin'
  , 'spot'
  , 'crook'
  , 'sleet'
  , 'silver'
  , 'shelf'
  , 'jeans'
  , 'notebook'
  , 'boot'
  , 'toe'
  , 'bird'
  , 'gate'
  , 'pest'
  , 'bikes'
  , 'stove'
  , 'range'
  , 'cherries'
  , 'bed'
  , 'spade'
  , 'bee'
  , 'table'
  , 'stop'
  , 'calendar'
  , 'sea'
  , 'muscle'
  , 'cave'
  , 'land'
  , 'foot'
  , 'stick'
  , 'swing'
  , 'peace'
  , 'current'
  , 'page'
  , 'sleep'
  , 'profit'
  , 'cart'
  , 'turn'
  , 'wall'
  , 'uncle'
  , 'thread'
  , 'vein'
  , 'wrist'
  , 'thunder'
  , 'finger'
  , 'bone'
  , 'pets'
  , 'glove'
  , 'egg'
  , 'hope'
  , 'rabbit'
  , 'rabbits'
  , 'expert'
  , 'liquid'
  , 'tray'
  , 'teeth'
  , 'humor'
  , 'zephyr'
  , 'crown'
  , 'force'
  , 'copper'
  , 'plastic'
  , 'wealth'
];

var randomUsername = function () {
  var numSet = sampleNames.length - 1,
    randKey = Math.round(Math.random() * numSet),
    randKey2 = Math.round(Math.random() * 1000);
  return [sampleNames[randKey], randKey2].join('');
};

exports.uid = function (len) {
  var buf = []
    , chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    , charlen = chars.length;

  for (var i = 0; i < len; ++i) {
    buf.push(chars[getRandomInt(0, charlen - 1)]);
  }

  return buf.join('');
};

exports.randomUsername = randomUsername;

exports.randomName = function () {
  var numSet = sampleNames.length - 1,
    randKey = Math.round(Math.random() * numSet);
  return sampleNames[randKey];
};

exports.friendlyPassword = function () {
  var part1 = randomUsername(),
    specialChars = ['_', '?', '@', '#', '+'];
  var specialCharIndex = Math.round(Math.random() * specialChars.length - 1);
  return [part1, specialChars[specialCharIndex]].join('');
};

function newPassword(len) {
  return this.uid(len);
};

exports.randomPassword = newPassword;
exports.newPassword = newPassword;

/**
 * Return a random int, used by `handy.uid()`
 *
 * @param {Number} min
 * @param {Number} max
 * @return {Number}
 * @api private
 */

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// export randomInt function
exports.getRandomInt = getRandomInt;

exports.isFunction = function (obj) {
  return obj && typeof obj === 'function';
};

exports.cleanId = function (Id) {
  if (Id && typeof Id === 'string')
    return Id.replace(/["']/g, '');
};

exports.interruptIfThereIsAnError = function (err, errorMessage, payload) {
  var _o = payload;
  if (typeof _o !== 'object')
    _o = {};
  if (err) {
    if (!errorMessage)
      errorMessage = "Something went wrong with your request";
    _o.error = {
      message: errorMessage
    };
    _o.success = false;
    res.status(409);
    log.error("%s: %s", _o.error.message, err.message);
    return res.json(_o);
  }
};