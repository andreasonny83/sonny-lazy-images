/**
 * Sonny LazyImages
 * @version 0.0.1
 *
 * Copyright (c) 2016 by andreasonny83. All Rights Reserved.
 * This code may only be used under the MIT style license found at https://andreasonny.mit-license.org/@2016/
 */
(function(global, defaults, undefined) {
  var lazySonny = {};
  var private = {};
  var version = '0.0.1';

  /**
   * Extend the default options with the ones specified by the user, if any.
   *
   * @param  {Object} options   The usrs's options
   *
   * @return {Object}           The extended default options
   */
  function _optionsInit(options) {
    options = options || {};
    var newOptions = {};
    var defaultOptions = defaults();

    for (var prop in defaultOptions) {
      if (options.hasOwnProperty(prop)) {
        newOptions[prop] = options[prop];
      } else {
        newOptions[prop] = defaultOptions[prop];
      }
    }

    return newOptions;
  }

  /**
   * Find if the target image is visible in the current area of the screen
   * and consider any offest present in the options.
   *
   * @param  {Object}  el       An image element present in the DOM
   * @param  {Int}    offset    The offset in px from the visible area of the screen
   *
   * @return {Boolean}          Return true if the element is visible
   */
  function _isElementInViewport(el, offset) {
    offset = offset || 0;

    var rect = el.getBoundingClientRect();

    return (
        rect.top >= (0 - offset) &&
        rect.left >= (0 - offset) &&
        rect.bottom <= ((global.innerHeight + offset) || (global.document.documentElement.clientHeight + offset)) &&
        rect.right <= ((global.innerWidth + offset) || (global.document.documentElement.clientWidth + offset))
    );
  }

  /**
   * Display a debug message to the console if the debug mode is active.
   *
   * @param  {String} msg   The message to render in the console.
   * @param  {Any}    att   Extra attribute. Could be String, Object or Array
   *                        It will be rendered as a string in the console.
   */
  function _debugInfo(msg, att) {
    msg = msg || null;
    att = att || null;

    if(!private.options.debug || !msg) {
      return;
    }

    if (typeof msg === 'string' && msg.length > 0 ) {
      msg = att ? [msg + ':', JSON.stringify(att)].join(' ') : msg;
      console.info('SonnyLazyImages:', msg);
    }
  }

  /**
   * Find all the Lazy images in the DOM and render the ones visible if any
   *
   * @param  {Object} e   The event listenter object who triggered this function
   */
  function _lazyLoadImages(e) {
    e = e || {type: 'function invocation'};

    var targets;
    var rect;

    targets = global.document.querySelectorAll('img.sonny-lazy-images[data-src]');

    targets.forEach(function(el) {
      if(_isElementInViewport(el, private.options.offset)) {
        var image = el.getAttribute('data-src');

        _debugInfo('loading image', image);

        el.setAttribute('src', image);
        el.removeAttribute('data-src');
      }
    });

    if (!targets.length) {
      global.removeEventListener('DOMContentLoaded', _lazyLoadImages);
      global.removeEventListener('load', _lazyLoadImages);
      global.removeEventListener('resize', _lazyLoadImages);
      global.removeEventListener('scroll', _lazyLoadImages);
    }
  }

  /**
   * Initialize the library
   *
   * @param  {Object} options   The custom options defined by the user
   *
   */
  function init(options) {
    private.options = _optionsInit(options);

    _debugInfo('I am so lazy');
    _debugInfo('Options', private.options);

    //these handlers will be removed once the images have loaded
    global.addEventListener('DOMContentLoaded', _lazyLoadImages, false);
    global.addEventListener('load', _lazyLoadImages, false);
    global.addEventListener('resize', _lazyLoadImages, false);
    global.addEventListener('scroll', _lazyLoadImages, false);

    _lazyLoadImages();
  };

  lazySonny.init = init;
  lazySonny.version = version;

  // expose the module to the global scope
  global.SonnyLazyImages = lazySonny;
}(typeof window !== "undefined" ? window : this, function() {
  /**
   * The default options
   *
   * @type {Object}
   */
  var defaults = {
    offset: 100,
    debug: false
  };

  return defaults;
}));
