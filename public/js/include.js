Phaser.Scene.include = function (properties) {
  var prototype = this.prototype;
  var _super = this.prototype;
  _.each(properties, function(val, name) {
    if (typeof properties[name] !== 'function') {
      prototype[name] = properties[name];
    } else if (typeof prototype[name] === 'function' && prototype.hasOwnProperty(name)) {
      prototype[name] = (function (name, fn, previous) {
        return function () {
          var tmp = this._super;
          this._super = previous;
          var ret = fn.apply(this, arguments);
          this._super = tmp;
          return ret;
        };
      })(name, properties[name], prototype[name]);
    } else if (typeof _super[name] === 'function') {
      prototype[name] = (function (name, fn) {
        return function () {
          var tmp = this._super;
          this._super = _super[name];
          var ret = fn.apply(this, arguments);
          this._super = tmp;
          return ret;
        };
      })(name, properties[name]);
    } else if(typeof properties[name] === 'function') {
      prototype[name] = properties[name];
    }
  });
};
