/*!
* Photo Sphere Viewer 4.7.2
* @copyright 2014-2015 Jérémy Heleine
* @copyright 2015-2022 Damien "Mistic" Sorel
* @licence MIT (https://opensource.org/licenses/MIT)
*/
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('three'), require('uevent')) :
  typeof define === 'function' && define.amd ? define(['exports', 'three', 'uevent'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.PhotoSphereViewer = {}, global.THREE, global.uEvent));
})(this, (function (exports, three, uevent) { 'use strict';

  /**
   * @summary Custom error used in the lib
   * @param {string} message
   * @constructor
   * @memberOf PSV
   */
  function PSVError(message) {
    this.message = message; // Use V8's native method if available, otherwise fallback

    if ('captureStackTrace' in Error) {
      Error.captureStackTrace(this, PSVError);
    } else {
      this.stack = new Error().stack;
    }
  }

  PSVError.prototype = Object.create(Error.prototype);
  PSVError.prototype.name = 'PSVError';
  PSVError.prototype.constructor = PSVError;

  /**
   * @namespace PSV.adapters
   */

  /**
   * @summary Base adapters class
   * @memberof PSV.adapters
   * @abstract
   */

  var AbstractAdapter = /*#__PURE__*/function () {
    /**
     * @summary Unique identifier of the adapter
     * @member {string}
     * @readonly
     * @static
     */

    /**
     * @summary Indicates if the adapter supports panorama download natively
     * @type {boolean}
     * @readonly
     * @static
     */

    /**
     * @summary Indicated if the adapter can display an additional transparent image above the panorama
     * @type {boolean}
     */

    /**
     * @param {PSV.Viewer} psv
     */
    function AbstractAdapter(psv) {
      /**
       * @summary Reference to main controller
       * @type {PSV.Viewer}
       * @readonly
       */
      this.psv = psv;
    }
    /**
     * @summary Destroys the adapter
     */


    var _proto = AbstractAdapter.prototype;

    _proto.destroy = function destroy() {
      delete this.psv;
    }
    /**
     * @summary Indicates if the adapter supports transitions between panoramas
     * @param {*} panorama
     * @return {boolean}
     */
    ;

    _proto.supportsTransition = function supportsTransition(panorama) {
      // eslint-disable-line no-unused-vars
      return false;
    }
    /**
     * @summary Indicates if the adapter supports preload of a panorama
     * @param {*} panorama
     * @return {boolean}
     */
    ;

    _proto.supportsPreload = function supportsPreload(panorama) {
      // eslint-disable-line no-unused-vars
      return false;
    }
    /**
     * @abstract
     * @summary Loads the panorama texture(s)
     * @param {*} panorama
     * @param {PSV.PanoData | PSV.PanoDataProvider} [newPanoData]
     * @param {boolean} [useXmpPanoData]
     * @returns {Promise.<PSV.TextureData>}
     */
    ;

    _proto.loadTexture = function loadTexture(panorama, newPanoData, useXmpPanoData) {
      // eslint-disable-line no-unused-vars
      throw new PSVError('loadTexture not implemented');
    }
    /**
     * @abstract
     * @summary Creates the cube mesh
     * @param {number} [scale=1]
     * @returns {external:THREE.Mesh}
     */
    ;

    _proto.createMesh = function createMesh(scale) {

      // eslint-disable-line no-unused-vars
      throw new PSVError('createMesh not implemented');
    }
    /**
     * @abstract
     * @summary Applies the texture to the mesh
     * @param {external:THREE.Mesh} mesh
     * @param {PSV.TextureData} textureData
     * @param {boolean} [transition=false]
     */
    ;

    _proto.setTexture = function setTexture(mesh, textureData, transition) {

      // eslint-disable-line no-unused-vars
      throw new PSVError('setTexture not implemented');
    }
    /**
     * @abstract
     * @summary Changes the opacity of the mesh
     * @param {external:THREE.Mesh} mesh
     * @param {number} opacity
     */
    ;

    _proto.setTextureOpacity = function setTextureOpacity(mesh, opacity) {
      // eslint-disable-line no-unused-vars
      throw new PSVError('setTextureOpacity not implemented');
    }
    /**
     * @abstract
     * @summary Clear a loaded texture from memory
     * @param {PSV.TextureData} textureData
     */
    ;

    _proto.disposeTexture = function disposeTexture(textureData) {
      // eslint-disable-line no-unused-vars
      throw new PSVError('disposeTexture not implemented');
    }
    /**
     * @abstract
     * @summary Applies the overlay to the mesh
     * @param {external:THREE.Mesh} mesh
     * @param {PSV.TextureData} textureData
     * @param {number} opacity
     */
    ;

    _proto.setOverlay = function setOverlay(mesh, textureData, opacity) {
      // eslint-disable-line no-unused-vars
      throw new PSVError('setOverlay not implemented');
    }
    /**
     * @internal
     */
    ;

    /**
     * @internal
     */
    AbstractAdapter.createOverlayMaterial = function createOverlayMaterial() {
      var _uniforms;

      return new three.ShaderMaterial({
        uniforms: (_uniforms = {}, _uniforms[AbstractAdapter.OVERLAY_UNIFORMS.panorama] = {
          value: new three.Texture()
        }, _uniforms[AbstractAdapter.OVERLAY_UNIFORMS.overlay] = {
          value: new three.Texture()
        }, _uniforms[AbstractAdapter.OVERLAY_UNIFORMS.globalOpacity] = {
          value: 1.0
        }, _uniforms[AbstractAdapter.OVERLAY_UNIFORMS.overlayOpacity] = {
          value: 1.0
        }, _uniforms),
        vertexShader: "\nvarying vec2 vUv;\n\nvoid main() {\n  vUv = uv;\n  gl_Position = projectionMatrix *  modelViewMatrix * vec4( position, 1.0 );\n}",
        fragmentShader: "\nuniform sampler2D " + AbstractAdapter.OVERLAY_UNIFORMS.panorama + ";\nuniform sampler2D " + AbstractAdapter.OVERLAY_UNIFORMS.overlay + ";\nuniform float " + AbstractAdapter.OVERLAY_UNIFORMS.globalOpacity + ";\nuniform float " + AbstractAdapter.OVERLAY_UNIFORMS.overlayOpacity + ";\n\nvarying vec2 vUv;\n\nvoid main() {\n  vec4 tColor1 = texture2D( " + AbstractAdapter.OVERLAY_UNIFORMS.panorama + ", vUv );\n  vec4 tColor2 = texture2D( " + AbstractAdapter.OVERLAY_UNIFORMS.overlay + ", vUv );\n  gl_FragColor = vec4( \n    mix( tColor1.rgb, tColor2.rgb, tColor2.a * " + AbstractAdapter.OVERLAY_UNIFORMS.overlayOpacity + " ), \n    " + AbstractAdapter.OVERLAY_UNIFORMS.globalOpacity + "\n  );\n}"
      });
    };

    return AbstractAdapter;
  }();
  AbstractAdapter.id = null;
  AbstractAdapter.supportsDownload = false;
  AbstractAdapter.supportsOverlay = false;
  AbstractAdapter.OVERLAY_UNIFORMS = {
    panorama: 'panorama',
    overlay: 'overlay',
    globalOpacity: 'globalOpacity',
    overlayOpacity: 'overlayOpacity'
  };

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    Object.defineProperty(Constructor, "prototype", {
      writable: false
    });
    return Constructor;
  }

  function _extends() {
    _extends = Object.assign ? Object.assign.bind() : function (target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];

        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }

      return target;
    };
    return _extends.apply(this, arguments);
  }

  function _inheritsLoose(subClass, superClass) {
    subClass.prototype = Object.create(superClass.prototype);
    subClass.prototype.constructor = subClass;

    _setPrototypeOf(subClass, superClass);
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };
    return _setPrototypeOf(o, p);
  }

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  /**
   * @namespace PSV.constants
   */

  /**
   * @summary Default duration of the transition between panoramas
   * @memberOf PSV.constants
   * @type {number}
   * @constant
   */
  var DEFAULT_TRANSITION = 1500;
  /**
   * @summary Number of pixels bellow which a mouse move will be considered as a click
   * @memberOf PSV.constants
   * @type {number}
   * @constant
   */

  var MOVE_THRESHOLD = 4;
  /**
   * @summary Delay in milliseconds between two clicks to consider a double click
   * @memberOf PSV.constants
   * @type {number}
   * @constant
   */

  var DBLCLICK_DELAY = 300;
  /**
   * @summary Delay in milliseconds to emulate a long touch
   * @memberOf PSV.constants
   * @type {number}
   * @constant
   */

  var LONGTOUCH_DELAY = 500;
  /**
   * @summary Delay in milliseconds to for the two fingers overlay to appear
   * @memberOf PSV.constants
   * @type {number}
   * @constant
   */

  var TWOFINGERSOVERLAY_DELAY = 100;
  /**
   * @summary Duration in milliseconds of the "ctrl zoom" overlay
   * @memberOf PSV.constants
   * @type {number}
   * @constant
   */

  var CTRLZOOM_TIMEOUT = 2000;
  /**
   * @summary Time size of the mouse position history used to compute inertia
   * @memberOf PSV.constants
   * @type {number}
   * @constant
   */

  var INERTIA_WINDOW = 300;
  /**
   * @summary Radius of the THREE.SphereGeometry, Half-length of the THREE.BoxGeometry
   * @memberOf PSV.constants
   * @type {number}
   * @constant
   */

  var SPHERE_RADIUS = 10;
  /**
   * @summary Property name added to viewer element
   * @memberOf PSV.constants
   * @type {string}
   * @constant
   */

  var VIEWER_DATA = 'photoSphereViewer';
  /**
   * @summary Property added the the main Mesh object
   * @memberOf PSV.constants
   * @type {string}
   * @constant
   */

  var MESH_USER_DATA = 'psvSphere';
  /**
   * @summary Available actions
   * @memberOf PSV.constants
   * @enum {string}
   * @constant
   */

  var ACTIONS = {
    ROTATE_LAT_UP: 'rotateLatitudeUp',
    ROTATE_LAT_DOWN: 'rotateLatitudeDown',
    ROTATE_LONG_RIGHT: 'rotateLongitudeRight',
    ROTATE_LONG_LEFT: 'rotateLongitudeLeft',
    ZOOM_IN: 'zoomIn',
    ZOOM_OUT: 'zoomOut',
    TOGGLE_AUTOROTATE: 'toggleAutorotate'
  };
  /**
   * @summary Available events names
   * @memberOf PSV.constants
   * @enum {string}
   * @constant
   */

  var EVENTS = {
    /**
     * @event autorotate
     * @memberof PSV
     * @summary Triggered when the automatic rotation is enabled/disabled
     * @param {boolean} enabled
     */
    AUTOROTATE: 'autorotate',

    /**
     * @event before-render
     * @memberof PSV
     * @summary Triggered before a render, used to modify the view
     * @param {number} timestamp - time provided by requestAnimationFrame
     * @param {number} elapsed - time elapsed from the previous frame
     */
    BEFORE_RENDER: 'before-render',

    /**
     * @event before-rotate
     * @memberOf PSV
     * @summary Triggered before a rotate operation, can be cancelled
     * @param {PSV.ExtendedPosition}
     */
    BEFORE_ROTATE: 'before-rotate',

    /**
     * @event click
     * @memberof PSV
     * @summary Triggered when the user clicks on the viewer (everywhere excluding the navbar and the side panel)
     * @param {PSV.ClickData} data
     */
    CLICK: 'click',

    /**
     * @event close-panel
     * @memberof PSV
     * @summary Triggered when the panel is closed
     * @param {string} [id]
     */
    CLOSE_PANEL: 'close-panel',

    /**
     * @event config-changed
     * @memberOf PSV
     * @summary Triggered after a call to setOption/setOptions
     * @param {string[]} name of changed options
     */
    CONFIG_CHANGED: 'config-changed',

    /**
     * @event dblclick
     * @memberof PSV
     * @summary Triggered when the user double clicks on the viewer. The simple `click` event is always fired before `dblclick`
     * @param {PSV.ClickData} data
     */
    DOUBLE_CLICK: 'dblclick',

    /**
     * @event fullscreen-updated
     * @memberof PSV
     * @summary Triggered when the fullscreen mode is enabled/disabled
     * @param {boolean} enabled
     */
    FULLSCREEN_UPDATED: 'fullscreen-updated',

    /**
     * @event hide-notification
     * @memberof PSV
     * @summary Triggered when the notification is hidden
     * @param {string} [id]
     */
    HIDE_NOTIFICATION: 'hide-notification',

    /**
     * @event hide-overlay
     * @memberof PSV
     * @summary Triggered when the overlay is hidden
     * @param {string} [id]
     */
    HIDE_OVERLAY: 'hide-overlay',

    /**
     * @event hide-tooltip
     * @memberof PSV
     * @summary Triggered when the tooltip is hidden
     * @param {*} Data associated to this tooltip
     */
    HIDE_TOOLTIP: 'hide-tooltip',

    /**
     * @event key-press
     * @memberof PSV
     * @summary Triggered when a key is pressed, can be cancelled
     * @param {string} key
     */
    KEY_PRESS: 'key-press',

    /**
     * @event load-progress
     * @memberof PSV
     * @summary Triggered when the loader value changes
     * @param {number} value from 0 to 100
     */
    LOAD_PROGRESS: 'load-progress',

    /**
     * @event open-panel
     * @memberof PSV
     * @summary Triggered when the panel is opened
     * @param {string} [id]
     */
    OPEN_PANEL: 'open-panel',

    /**
     * @event panorama-loaded
     * @memberof PSV
     * @summary Triggered when a panorama image has been loaded
     * @param {PSV.TextureData} textureData
     */
    PANORAMA_LOADED: 'panorama-loaded',

    /**
     * @event position-updated
     * @memberof PSV
     * @summary Triggered when the view longitude and/or latitude changes
     * @param {PSV.Position} position
     */
    POSITION_UPDATED: 'position-updated',

    /**
     * @event ready
     * @memberof PSV
     * @summary Triggered when the panorama image has been loaded and the viewer is ready to perform the first render
     */
    READY: 'ready',

    /**
     * @event render
     * @memberof PSV
     * @summary Triggered on each viewer render, **this event is triggered very often**
     */
    RENDER: 'render',

    /**
     * @event show-notification
     * @memberof PSV
     * @summary Triggered when the notification is shown
     * @param {string} [id]
     */
    SHOW_NOTIFICATION: 'show-notification',

    /**
     * @event show-overlay
     * @memberof PSV
     * @summary Triggered when the overlay is shown
     * @param {string} [id]
     */
    SHOW_OVERLAY: 'show-overlay',

    /**
     * @event show-tooltip
     * @memberof PSV
     * @summary Triggered when the tooltip is shown
     * @param {*} Data associated to this tooltip
     * @param {PSV.components.Tooltip} Instance of the tooltip
     */
    SHOW_TOOLTIP: 'show-tooltip',

    /**
     * @event size-updated
     * @memberof PSV
     * @summary Triggered when the viewer size changes
     * @param {PSV.Size} size
     */
    SIZE_UPDATED: 'size-updated',

    /**
     * @event stop-all
     * @memberof PSV
     * @summary Triggered when all current animations are stopped
     */
    STOP_ALL: 'stop-all',

    /**
     * @event zoom-updated
     * @memberof PSV
     * @summary Triggered when the zoom level changes
     * @param {number} zoomLevel
     */
    ZOOM_UPDATED: 'zoom-updated'
  };
  /**
   * @summary Available change events names
   * @memberOf PSV.constants
   * @enum {string}
   * @constant
   */

  var CHANGE_EVENTS = {
    /**
     * @event get-animate-position
     * @memberof PSV
     * @param {Position} position
     * @returns {Position}
     * @summary Called to alter the target position of an animation
     */
    GET_ANIMATE_POSITION: 'get-animate-position',

    /**
     * @event get-rotate-position
     * @memberof PSV
     * @param {Position} position
     * @returns {Position}
     * @summary Called to alter the target position of a rotation
     */
    GET_ROTATE_POSITION: 'get-rotate-position'
  };
  /**
   * @summary Special events emitted to listener using {@link Viewer#observeObjects}
   * @memberOf PSV.constants
   * @constant
   * @package
   */

  var OBJECT_EVENTS = {
    ENTER_OBJECT: 'enter-object',
    HOVER_OBJECT: 'hover-object',
    LEAVE_OBJECT: 'leave-object'
  };
  /**
   * @summary Internal identifiers for various stuff
   * @memberOf PSV.constants
   * @enum {string}
   * @constant
   */

  var IDS = {
    MENU: 'menu',
    TWO_FINGERS: 'twoFingers',
    CTRL_ZOOM: 'ctrlZoom',
    ERROR: 'error',
    DESCRIPTION: 'description'
  };
  /* eslint-disable */
  // @formatter:off

  /**
   * @summary Collection of easing functions
   * @memberOf PSV.constants
   * @see {@link https://gist.github.com/frederickk/6165768}
   * @type {Object<string, Function>}
   * @constant
   */

  var EASINGS = {
    linear: function linear(t) {
      return t;
    },
    inQuad: function inQuad(t) {
      return t * t;
    },
    outQuad: function outQuad(t) {
      return t * (2 - t);
    },
    inOutQuad: function inOutQuad(t) {
      return t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    },
    inCubic: function inCubic(t) {
      return t * t * t;
    },
    outCubic: function outCubic(t) {
      return --t * t * t + 1;
    },
    inOutCubic: function inOutCubic(t) {
      return t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    },
    inQuart: function inQuart(t) {
      return t * t * t * t;
    },
    outQuart: function outQuart(t) {
      return 1 - --t * t * t * t;
    },
    inOutQuart: function inOutQuart(t) {
      return t < .5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t;
    },
    inQuint: function inQuint(t) {
      return t * t * t * t * t;
    },
    outQuint: function outQuint(t) {
      return 1 + --t * t * t * t * t;
    },
    inOutQuint: function inOutQuint(t) {
      return t < .5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t;
    },
    inSine: function inSine(t) {
      return 1 - Math.cos(t * (Math.PI / 2));
    },
    outSine: function outSine(t) {
      return Math.sin(t * (Math.PI / 2));
    },
    inOutSine: function inOutSine(t) {
      return .5 - .5 * Math.cos(Math.PI * t);
    },
    inExpo: function inExpo(t) {
      return Math.pow(2, 10 * (t - 1));
    },
    outExpo: function outExpo(t) {
      return 1 - Math.pow(2, -10 * t);
    },
    inOutExpo: function inOutExpo(t) {
      return (t = t * 2 - 1) < 0 ? .5 * Math.pow(2, 10 * t) : 1 - .5 * Math.pow(2, -10 * t);
    },
    inCirc: function inCirc(t) {
      return 1 - Math.sqrt(1 - t * t);
    },
    outCirc: function outCirc(t) {
      return Math.sqrt(1 - (t - 1) * (t - 1));
    },
    inOutCirc: function inOutCirc(t) {
      return (t *= 2) < 1 ? .5 - .5 * Math.sqrt(1 - t * t) : .5 + .5 * Math.sqrt(1 - (t -= 2) * t);
    }
  }; // @formatter:on

  /* eslint-enable */

  /**
   * @summary Subset of key codes
   * @memberOf PSV.constants
   * @type {Object<string, string>}
   * @constant
   */

  var KEY_CODES = {
    Enter: 'Enter',
    Control: 'Control',
    Escape: 'Escape',
    Space: ' ',
    PageUp: 'PageUp',
    PageDown: 'PageDown',
    ArrowLeft: 'ArrowLeft',
    ArrowUp: 'ArrowUp',
    ArrowRight: 'ArrowRight',
    ArrowDown: 'ArrowDown',
    Delete: 'Delete',
    Plus: '+',
    Minus: '-'
  };

  var constants = /*#__PURE__*/Object.freeze({
    __proto__: null,
    DEFAULT_TRANSITION: DEFAULT_TRANSITION,
    MOVE_THRESHOLD: MOVE_THRESHOLD,
    DBLCLICK_DELAY: DBLCLICK_DELAY,
    LONGTOUCH_DELAY: LONGTOUCH_DELAY,
    TWOFINGERSOVERLAY_DELAY: TWOFINGERSOVERLAY_DELAY,
    CTRLZOOM_TIMEOUT: CTRLZOOM_TIMEOUT,
    INERTIA_WINDOW: INERTIA_WINDOW,
    SPHERE_RADIUS: SPHERE_RADIUS,
    VIEWER_DATA: VIEWER_DATA,
    MESH_USER_DATA: MESH_USER_DATA,
    ACTIONS: ACTIONS,
    EVENTS: EVENTS,
    CHANGE_EVENTS: CHANGE_EVENTS,
    OBJECT_EVENTS: OBJECT_EVENTS,
    IDS: IDS,
    EASINGS: EASINGS,
    KEY_CODES: KEY_CODES
  });

  var LOCALSTORAGE_TOUCH_SUPPORT = VIEWER_DATA + "_touchSupport";
  /**
   * @summary General information about the system
   * @constant
   * @memberOf PSV
   * @property {boolean} loaded - Indicates if the system data has been loaded
   * @property {Function} load - Loads the system if not already loaded
   * @property {number} pixelRatio
   * @property {boolean} isWebGLSupported
   * @property {number} maxCanvasWidth
   * @property {string} mouseWheelEvent
   * @property {string} fullscreenEvent
   * @property {Function} getMaxCanvasWidth - Returns the max width of a canvas allowed by the browser
   * @property {{initial: boolean, promise: Promise<boolean>}} isTouchEnabled
   */

  var SYSTEM = {
    loaded: false,
    pixelRatio: 1,
    isWebGLSupported: false,
    isTouchEnabled: null,
    maxTextureWidth: 0,
    mouseWheelEvent: null,
    fullscreenEvent: null
  };
  /**
   * @summary Loads the system if not already loaded
   */

  SYSTEM.load = function () {
    if (!SYSTEM.loaded) {
      var ctx = getWebGLCtx();
      SYSTEM.loaded = true;
      SYSTEM.pixelRatio = window.devicePixelRatio || 1;
      SYSTEM.isWebGLSupported = ctx != null;
      SYSTEM.isTouchEnabled = isTouchEnabled();
      SYSTEM.maxTextureWidth = getMaxTextureWidth(ctx);
      SYSTEM.mouseWheelEvent = getMouseWheelEvent();
      SYSTEM.fullscreenEvent = getFullscreenEvent();
    }
  };

  var maxCanvasWidth = null;

  SYSTEM.getMaxCanvasWidth = function () {
    if (maxCanvasWidth === null) {
      maxCanvasWidth = getMaxCanvasWidth(SYSTEM.maxTextureWidth);
    }

    return maxCanvasWidth;
  };
  /**
   * @summary Tries to return a canvas webgl context
   * @returns {WebGLRenderingContext}
   * @private
   */


  function getWebGLCtx() {
    var canvas = document.createElement('canvas');
    var names = ['webgl', 'experimental-webgl', 'moz-webgl', 'webkit-3d'];
    var context = null;

    if (!canvas.getContext) {
      return null;
    }

    if (names.some(function (name) {
      try {
        context = canvas.getContext(name);
        return context !== null;
      } catch (e) {
        return false;
      }
    })) {
      return context;
    } else {
      return null;
    }
  }
  /**
   * @summary Detects if the user is using a touch screen
   * @returns {{initial: boolean, promise: Promise<boolean>}}
   * @private
   */


  function isTouchEnabled() {
    var initial = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    if (LOCALSTORAGE_TOUCH_SUPPORT in localStorage) {
      initial = localStorage[LOCALSTORAGE_TOUCH_SUPPORT] === 'true';
    }

    var promise = new Promise(function (resolve) {
      var clear;

      var listenerMouse = function listenerMouse() {
        clear();
        localStorage[LOCALSTORAGE_TOUCH_SUPPORT] = false;
        resolve(false);
      };

      var listenerTouch = function listenerTouch() {
        clear();
        localStorage[LOCALSTORAGE_TOUCH_SUPPORT] = true;
        resolve(true);
      };

      var listenerTimeout = function listenerTimeout() {
        clear();
        localStorage[LOCALSTORAGE_TOUCH_SUPPORT] = initial;
        resolve(initial);
      };

      window.addEventListener('mousedown', listenerMouse, false);
      window.addEventListener('touchstart', listenerTouch, false);
      var listenerTimeoutId = setTimeout(listenerTimeout, 10000);

      clear = function clear() {
        window.removeEventListener('mousedown', listenerMouse);
        window.removeEventListener('touchstart', listenerTouch);
        clearTimeout(listenerTimeoutId);
      };
    });
    return {
      initial: initial,
      promise: promise
    };
  }
  /**
   * @summary Gets max texture width in WebGL context
   * @returns {number}
   * @private
   */


  function getMaxTextureWidth(ctx) {
    if (ctx !== null) {
      return ctx.getParameter(ctx.MAX_TEXTURE_SIZE);
    } else {
      return 0;
    }
  }
  /**
   * @summary Gets max canvas width supported by the browser.
   * We only test powers of 2 and height = width / 2 because that's what we need to generate WebGL textures
   * @param maxWidth
   * @return {number}
   * @private
   */


  function getMaxCanvasWidth(maxWidth) {
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    canvas.width = maxWidth;
    canvas.height = maxWidth / 2;

    while (canvas.width > 1024) {
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, 1, 1);

      try {
        if (ctx.getImageData(0, 0, 1, 1).data[0] > 0) {
          return canvas.width;
        }
      } catch (e) {// continue
      }

      canvas.width /= 2;
      canvas.height /= 2;
    }

    throw new PSVError('Unable to detect system capabilities');
  }
  /**
   * @summary Gets the event name for mouse wheel
   * @returns {string}
   * @private
   */


  function getMouseWheelEvent() {
    if ('onwheel' in document.createElement('div')) {
      // Modern browsers support "wheel"
      return 'wheel';
    } else if (document.onmousewheel !== undefined) {
      // Webkit and IE support at least "mousewheel"
      return 'mousewheel';
    } else {
      // let's assume that remaining browsers are older Firefox
      return 'DOMMouseScroll';
    }
  }
  /**
   * @summary Map between fullsceen method and fullscreen event name
   * @type {Object<string, string>}
   * @readonly
   * @private
   */


  var FULLSCREEN_EVT_MAP = {
    exitFullscreen: 'fullscreenchange',
    webkitExitFullscreen: 'webkitfullscreenchange',
    mozCancelFullScreen: 'mozfullscreenchange',
    msExitFullscreen: 'MSFullscreenChange'
  };
  /**
   * @summary  Gets the event name for fullscreen
   * @returns {string}
   * @private
   */

  function getFullscreenEvent() {
    var validExits = Object.keys(FULLSCREEN_EVT_MAP).filter(function (exit) {
      return exit in document;
    });

    if (validExits.length) {
      return FULLSCREEN_EVT_MAP[validExits[0]];
    } else {
      return null;
    }
  }

  /**
   * @summary Toggles a CSS class
   * @memberOf PSV.utils
   * @param {HTMLElement|SVGElement} element
   * @param {string} className
   * @param {boolean} [active] - forced state
   */
  function toggleClass(element, className, active) {
    if (active === undefined) {
      element.classList.toggle(className);
    } else if (active) {
      element.classList.add(className);
    } else if (!active) {
      element.classList.remove(className);
    }
  }
  /**
   * @summary Adds one or several CSS classes to an element
   * @memberOf PSV.utils
   * @param {HTMLElement} element
   * @param {string} className
   */

  function addClasses(element, className) {
    var _element$classList;

    (_element$classList = element.classList).add.apply(_element$classList, className.split(' '));
  }
  /**
   * @summary Removes one or several CSS classes to an element
   * @memberOf PSV.utils
   * @param {HTMLElement} element
   * @param {string} className
   */

  function removeClasses(element, className) {
    var _element$classList2;

    (_element$classList2 = element.classList).remove.apply(_element$classList2, className.split(' '));
  }
  /**
   * @summary Searches if an element has a particular parent at any level including itself
   * @memberOf PSV.utils
   * @param {HTMLElement} el
   * @param {HTMLElement} parent
   * @returns {boolean}
   */

  function hasParent(el, parent) {
    var test = el;

    do {
      if (test === parent) {
        return true;
      }

      test = test.parentNode;
    } while (test);

    return false;
  }
  /**
   * @summary Gets the closest parent (can by itself)
   * @memberOf PSV.utils
   * @param {HTMLElement|SVGElement} el
   * @param {string} selector
   * @returns {HTMLElement}
   */

  function getClosest(el, selector) {
    // When el is document or window, the matches does not exist
    if (!(el != null && el.matches)) {
      return null;
    }

    var test = el;

    do {
      if (test.matches(selector)) {
        return test;
      }

      test = test instanceof SVGElement ? test.parentNode : test.parentElement;
    } while (test);

    return null;
  }
  /**
   * @summary Gets the position of an element in the viewer without reflow
   * @description Will gives the same result as getBoundingClientRect() as soon as there are no CSS transforms
   * @memberOf PSV.utils
   * @param {HTMLElement} el
   * @return {{left: number, top: number}}
   */

  function getPosition(el) {
    var left = 0;
    var top = 0;
    var test = el;

    while (test) {
      left += test.offsetLeft - test.scrollLeft + test.clientLeft;
      top += test.offsetTop - test.scrollTop + test.clientTop;
      test = test.offsetParent;
    }

    return {
      left: left,
      top: top
    };
  }
  /**
   * @summary Detects if fullscreen is enabled
   * @memberOf PSV.utils
   * @param {HTMLElement} elt
   * @returns {boolean}
   */

  function isFullscreenEnabled(elt) {
    return (document.fullscreenElement || document.webkitFullscreenElement) === elt;
  }
  /**
   * @summary Enters fullscreen mode
   * @memberOf PSV.utils
   * @param {HTMLElement} elt
   */

  function requestFullscreen(elt) {
    (elt.requestFullscreen || elt.webkitRequestFullscreen).call(elt);
  }
  /**
   * @summary Exits fullscreen mode
   * @memberOf PSV.utils
   */

  function exitFullscreen() {
    (document.exitFullscreen || document.webkitExitFullscreen).call(document);
  }
  /**
   * @summary Gets an element style
   * @memberOf PSV.utils
   * @param {HTMLElement} elt
   * @param {string} prop
   * @returns {*}
   */

  function getStyle(elt, prop) {
    return window.getComputedStyle(elt, null)[prop];
  }
  /**
   * @summary Normalize mousewheel values accross browsers
   * @memberOf PSV.utils
   * @description From Facebook's Fixed Data Table
   * {@link https://github.com/facebookarchive/fixed-data-table/blob/master/src/vendor_upstream/dom/normalizeWheel.js}
   * @copyright Facebook
   * @param {WheelEvent} event
   * @returns {{spinX: number, spinY: number, pixelX: number, pixelY: number}}
   */

  function normalizeWheel(event) {
    var PIXEL_STEP = 10;
    var LINE_HEIGHT = 40;
    var PAGE_HEIGHT = 800;
    var spinX = 0;
    var spinY = 0;
    var pixelX = 0;
    var pixelY = 0; // Legacy

    if ('detail' in event) {
      spinY = event.detail;
    }

    if ('wheelDelta' in event) {
      spinY = -event.wheelDelta / 120;
    }

    if ('wheelDeltaY' in event) {
      spinY = -event.wheelDeltaY / 120;
    }

    if ('wheelDeltaX' in event) {
      spinX = -event.wheelDeltaX / 120;
    } // side scrolling on FF with DOMMouseScroll


    if ('axis' in event && event.axis === event.HORIZONTAL_AXIS) {
      spinX = spinY;
      spinY = 0;
    }

    pixelX = spinX * PIXEL_STEP;
    pixelY = spinY * PIXEL_STEP;

    if ('deltaY' in event) {
      pixelY = event.deltaY;
    }

    if ('deltaX' in event) {
      pixelX = event.deltaX;
    }

    if ((pixelX || pixelY) && event.deltaMode) {
      // delta in LINE units
      if (event.deltaMode === 1) {
        pixelX *= LINE_HEIGHT;
        pixelY *= LINE_HEIGHT;
      } // delta in PAGE units
      else {
        pixelX *= PAGE_HEIGHT;
        pixelY *= PAGE_HEIGHT;
      }
    } // Fall-back if spin cannot be determined


    if (pixelX && !spinX) {
      spinX = pixelX < 1 ? -1 : 1;
    }

    if (pixelY && !spinY) {
      spinY = pixelY < 1 ? -1 : 1;
    }

    return {
      spinX: spinX,
      spinY: spinY,
      pixelX: pixelX,
      pixelY: pixelY
    };
  }

  /**
   * @deprecated use THREE.MathUtils.clamp
   */

  function bound(x, min, max) {
    return three.MathUtils.clamp(x, min, max);
  }
  /**
   * @summary Ensure a value is within 0 and `max`
   * @param {number} value
   * @param {number} max
   * @return {number}
   */

  function loop(value, max) {
    var result = value % max;

    if (result < 0) {
      result += max;
    }

    return result;
  }
  /**
   * @deprecated Use THREE.MathUtils.isPowerOfTwo
   */

  function isPowerOfTwo(x) {
    return three.MathUtils.isPowerOfTwo(x);
  }
  /**
   * @summary Computes the sum of an array
   * @memberOf PSV.utils
   * @param {number[]} array
   * @returns {number}
   */

  function sum(array) {
    return array.reduce(function (a, b) {
      return a + b;
    }, 0);
  }
  /**
   * @summary Computes the distance between two points
   * @memberOf PSV.utils
   * @param {PSV.Point} p1
   * @param {PSV.Point} p2
   * @returns {number}
   */

  function distance(p1, p2) {
    return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
  }
  /**
   * @summary Compute the shortest offset between two longitudes
   * @memberOf PSV.utils
   * @param {number} from
   * @param {number} to
   * @returns {number}
   */

  function getShortestArc(from, to) {
    var tCandidates = [0, // direct
    Math.PI * 2, // clock-wise cross zero
    -Math.PI * 2 // counter-clock-wise cross zero
    ];
    return tCandidates.reduce(function (value, candidate) {
      var newCandidate = to - from + candidate;
      return Math.abs(newCandidate) < Math.abs(value) ? newCandidate : value;
    }, Infinity);
  }
  /**
   * @summary Computes the angle between the current position and a target position
   * @memberOf PSV.utils
   * @param {PSV.Position} position1
   * @param {PSV.Position} position2
   * @returns {number}
   */

  function getAngle(position1, position2) {
    return Math.acos(Math.cos(position1.latitude) * Math.cos(position2.latitude) * Math.cos(position1.longitude - position2.longitude) + Math.sin(position1.latitude) * Math.sin(position2.latitude));
  }
  /**
   * @summary Returns the distance between two points on a sphere of radius one
   * {@link http://www.movable-type.co.uk/scripts/latlong.html}
   * @memberOf PSV.utils
   * @param {number[]} p1
   * @param {number[]} p2
   * @returns {number}
   */

  function greatArcDistance(p1, p2) {
    var λ1 = p1[0],
        φ1 = p1[1];
    var λ2 = p2[0],
        φ2 = p2[1];
    var x = (λ2 - λ1) * Math.cos((φ1 + φ2) / 2);
    var y = φ2 - φ1;
    return Math.sqrt(x * x + y * y);
  }

  /**
   * @summary Transforms a string to dash-case {@link https://github.com/shahata/dasherize}
   * @memberOf PSV.utils
   * @param {string} str
   * @returns {string}
   */
  function dasherize(str) {
    return str.replace(/[A-Z](?:(?=[^A-Z])|[A-Z]*(?=[A-Z][^A-Z]|$))/g, function (s, i) {
      return (i > 0 ? '-' : '') + s.toLowerCase();
    });
  }
  /**
   * @summary Returns a function, that, when invoked, will only be triggered at most once during a given window of time.
   * @memberOf PSV.utils
   * @copyright underscore.js - modified by Clément Prévost {@link http://stackoverflow.com/a/27078401}
   * @param {Function} func
   * @param {number} wait
   * @returns {Function}
   */

  function throttle(func, wait) {
    /* eslint-disable */
    var self, args, result;
    var timeout;
    var previous = 0;

    var later = function later() {
      previous = Date.now();
      timeout = undefined;
      result = func.apply(self, args);

      if (!timeout) {
        self = args = null;
      }
    };

    return function () {
      var now = Date.now();

      if (!previous) {
        previous = now;
      }

      var remaining = wait - (now - previous);
      self = this;
      args = arguments;

      if (remaining <= 0 || remaining > wait) {
        if (timeout) {
          clearTimeout(timeout);
          timeout = undefined;
        }

        previous = now;
        result = func.apply(self, args);

        if (!timeout) {
          self = args = null;
        }
      } else if (!timeout) {
        timeout = setTimeout(later, remaining);
      }

      return result;
    };
    /* eslint-enable */
  }
  /**
   * @summary Test if an object is a plain object
   * @memberOf PSV.utils
   * @description Test if an object is a plain object, i.e. is constructed
   * by the built-in Object constructor and inherits directly from Object.prototype
   * or null. Some built-in objects pass the test, e.g. Math which is a plain object
   * and some host or exotic objects may pass also.
   * {@link http://stackoverflow.com/a/5878101/1207670}
   * @param {*} obj
   * @returns {boolean}
   */

  function isPlainObject(obj) {
    // Basic check for Type object that's not null
    if (typeof obj === 'object' && obj !== null) {
      // If Object.getPrototypeOf supported, use it
      if (typeof Object.getPrototypeOf === 'function') {
        var proto = Object.getPrototypeOf(obj);
        return proto === Object.prototype || proto === null;
      } // Otherwise, use internal class
      // This should be reliable as if getPrototypeOf not supported, is pre-ES5


      return Object.prototype.toString.call(obj) === '[object Object]';
    } // Not an object


    return false;
  }
  /**
   * @summary Merges the enumerable attributes of two objects
   * @memberOf PSV.utils
   * @description Replaces arrays and alters the target object.
   * @copyright Nicholas Fisher <nfisher110@gmail.com>
   * @param {Object} target
   * @param {Object} src
   * @returns {Object} target
   */

  function deepmerge(target, src) {
    /* eslint-disable */
    var first = src;
    return function merge(target, src) {
      if (Array.isArray(src)) {
        if (!target || !Array.isArray(target)) {
          target = [];
        } else {
          target.length = 0;
        }

        src.forEach(function (e, i) {
          target[i] = merge(null, e);
        });
      } else if (typeof src === 'object') {
        if (!target || Array.isArray(target)) {
          target = {};
        }

        Object.keys(src).forEach(function (key) {
          if (typeof src[key] !== 'object' || !src[key] || !isPlainObject(src[key])) {
            target[key] = src[key];
          } else if (src[key] != first) {
            if (!target[key]) {
              target[key] = merge(null, src[key]);
            } else {
              merge(target[key], src[key]);
            }
          }
        });
      } else {
        target = src;
      }

      return target;
    }(target, src);
    /* eslint-enable */
  }
  /**
   * @summary Deeply clones an object
   * @memberOf PSV.utils
   * @param {Object} src
   * @returns {Object}
   */

  function clone(src) {
    return deepmerge(null, src);
  }
  /**
   * @summery Test of an object is empty
   * @memberOf PSV.utils
   * @param {object} obj
   * @returns {boolean}
   */

  function isEmpty(obj) {
    return !obj || Object.keys(obj).length === 0 && obj.constructor === Object;
  }
  /**
   * @summary Loops over enumerable properties of an object
   * @memberOf PSV.utils
   * @param {Object} object
   * @param {Function} callback
   */

  function each(object, callback) {
    Object.keys(object).forEach(function (key) {
      callback(object[key], key);
    });
  }
  /**
   * @summary Returns if a valu is null or undefined
   * @memberOf PSV.utils
   * @param {*} val
   * @return {boolean}
   */

  function isNil(val) {
    return val === null || val === undefined;
  }
  /**
   * @summary Returns the first non null non undefined parameter
   * @memberOf PSV.utils
   * @param {*} values
   * @return {*}
   */

  function firstNonNull() {
    for (var _len = arguments.length, values = new Array(_len), _key = 0; _key < _len; _key++) {
      values[_key] = arguments[_key];
    }

    for (var _i = 0, _values = values; _i < _values.length; _i++) {
      var val = _values[_i];

      if (!isNil(val)) {
        return val;
      }
    }

    return undefined;
  }
  /**
   * @summary Returns deep equality between objects
   * {@link https://gist.github.com/egardner/efd34f270cc33db67c0246e837689cb9}
   * @param obj1
   * @param obj2
   * @return {boolean}
   * @private
   */

  function deepEqual(obj1, obj2) {
    if (obj1 === obj2) {
      return true;
    } else if (isObject(obj1) && isObject(obj2)) {
      if (Object.keys(obj1).length !== Object.keys(obj2).length) {
        return false;
      }

      for (var _i2 = 0, _Object$keys = Object.keys(obj1); _i2 < _Object$keys.length; _i2++) {
        var prop = _Object$keys[_i2];

        if (!deepEqual(obj1[prop], obj2[prop])) {
          return false;
        }
      }

      return true;
    } else {
      return false;
    }
  }

  function isObject(obj) {
    return typeof obj === 'object' && obj != null;
  }

  /**
   * @summary Returns the plugin constructor from the imported object
   * For retrocompatibility with previous default exports
   * @memberOf PSV.utils
   * @package
   */

  function pluginInterop(plugin, target) {
    if (plugin) {
      for (var _i = 0, _arr = [['_', plugin]].concat(Object.entries(plugin)); _i < _arr.length; _i++) {
        var _arr$_i = _arr[_i],
            p = _arr$_i[1];

        if (p.prototype instanceof target) {
          return p;
        }
      }
    }

    return null;
  }
  /**
   * @summary Builds an Error with name 'AbortError'
   * @memberOf PSV.utils
   * @return {Error}
   */

  function getAbortError() {
    var error = new Error('Loading was aborted.');
    error.name = 'AbortError';
    return error;
  }
  /**
   * @summary Tests if an Error has name 'AbortError'
   * @memberOf PSV.utils
   * @param {Error} err
   * @return {boolean}
   */

  function isAbortError(err) {
    return (err == null ? void 0 : err.name) === 'AbortError';
  }
  /**
   * @summary Displays a warning in the console
   * @memberOf PSV.utils
   * @param {string} message
   */

  function logWarn(message) {
    console.warn("PhotoSphereViewer: " + message);
  }
  /**
   * @summary Checks if an object is a {PSV.ExtendedPosition}, ie has x/y or longitude/latitude
   * @memberOf PSV.utils
   * @param {object} object
   * @returns {boolean}
   */

  function isExtendedPosition(object) {
    return [['x', 'y'], ['longitude', 'latitude']].some(function (_ref) {
      var key1 = _ref[0],
          key2 = _ref[1];
      return object[key1] !== undefined && object[key2] !== undefined;
    });
  }
  /**
   * @summary Returns the value of a given attribute in the panorama metadata
   * @memberOf PSV.utils
   * @param {string} data
   * @param {string} attr
   * @returns (number)
   */

  function getXMPValue(data, attr) {
    // XMP data are stored in children
    var result = data.match('<GPano:' + attr + '>(.*)</GPano:' + attr + '>');

    if (result !== null) {
      var val = parseInt(result[1], 10);
      return isNaN(val) ? null : val;
    } // XMP data are stored in attributes


    result = data.match('GPano:' + attr + '="(.*?)"');

    if (result !== null) {
      var _val = parseInt(result[1], 10);

      return isNaN(_val) ? null : _val;
    }

    return null;
  }
  /**
   * @readonly
   * @private
   * @type {{top: string, left: string, bottom: string, center: string, right: string}}
   */

  var CSS_POSITIONS = {
    top: '0%',
    bottom: '100%',
    left: '0%',
    right: '100%',
    center: '50%'
  };
  /**
   * @summary Translate CSS values like "top center" or "10% 50%" as top and left positions
   * @memberOf PSV.utils
   * @description The implementation is as close as possible to the "background-position" specification
   * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/background-position}
   * @param {string|PSV.Point} value
   * @returns {PSV.Point}
   */

  function parsePosition(value) {
    if (!value) {
      return {
        x: 0.5,
        y: 0.5
      };
    }

    if (typeof value === 'object') {
      return value;
    }

    var tokens = value.toLocaleLowerCase().split(' ').slice(0, 2);

    if (tokens.length === 1) {
      if (CSS_POSITIONS[tokens[0]] !== undefined) {
        tokens = [tokens[0], 'center'];
      } else {
        tokens = [tokens[0], tokens[0]];
      }
    }

    var xFirst = tokens[1] !== 'left' && tokens[1] !== 'right' && tokens[0] !== 'top' && tokens[0] !== 'bottom';
    tokens = tokens.map(function (token) {
      return CSS_POSITIONS[token] || token;
    });

    if (!xFirst) {
      tokens.reverse();
    }

    var parsed = tokens.join(' ').match(/^([0-9.]+)% ([0-9.]+)%$/);

    if (parsed) {
      return {
        x: parseFloat(parsed[1]) / 100,
        y: parseFloat(parsed[2]) / 100
      };
    } else {
      return {
        x: 0.5,
        y: 0.5
      };
    }
  }
  /**
   * @readonly
   * @private
   */

  var LEFT_MAP = {
    0: 'left',
    0.5: 'center',
    1: 'right'
  };
  /**
   * @readonly
   * @private
   */

  var TOP_MAP = {
    0: 'top',
    0.5: 'center',
    1: 'bottom'
  };
  /**
   * @summary Parse a CSS-like position into an array of position keywords among top, bottom, left, right and center
   * @memberOf PSV.utils
   * @param {string | string[]} value
   * @param {boolean} [allowCenter=true]
   * @return {string[]}
   */

  function cleanPosition(value, allowCenter) {
    if (allowCenter === void 0) {
      allowCenter = true;
    }

    if (typeof value === 'string') {
      var tempPos = parsePosition(value);

      if (!(tempPos.x in LEFT_MAP) || !(tempPos.y in TOP_MAP)) {
        throw new PSVError("Unable to parse position \"" + value + "\"");
      }

      value = [TOP_MAP[tempPos.y], LEFT_MAP[tempPos.x]];
    }

    if (!allowCenter && value[0] === 'center' && value[1] === 'center') {
      throw new PSVError('Unable to parse position "center center"');
    }

    return value;
  }
  /**
   * @summary Parses an speed
   * @memberOf PSV.utils
   * @param {string|number} speed - The speed, in radians/degrees/revolutions per second/minute
   * @returns {number} radians per second
   * @throws {PSV.PSVError} when the speed cannot be parsed
   */

  function parseSpeed(speed) {
    var parsed;

    if (typeof speed === 'string') {
      var speedStr = speed.toString().trim(); // Speed extraction

      var speedValue = parseFloat(speedStr.replace(/^(-?[0-9]+(?:\.[0-9]*)?).*$/, '$1'));
      var speedUnit = speedStr.replace(/^-?[0-9]+(?:\.[0-9]*)?(.*)$/, '$1').trim(); // "per minute" -> "per second"

      if (speedUnit.match(/(pm|per minute)$/)) {
        speedValue /= 60;
      } // Which unit?


      switch (speedUnit) {
        // Degrees per minute / second
        case 'dpm':
        case 'degrees per minute':
        case 'dps':
        case 'degrees per second':
          parsed = three.MathUtils.degToRad(speedValue);
          break;
        // Radians per minute / second

        case 'rdpm':
        case 'radians per minute':
        case 'rdps':
        case 'radians per second':
          parsed = speedValue;
          break;
        // Revolutions per minute / second

        case 'rpm':
        case 'revolutions per minute':
        case 'rps':
        case 'revolutions per second':
          parsed = speedValue * Math.PI * 2;
          break;
        // Unknown unit

        default:
          throw new PSVError('Unknown speed unit "' + speedUnit + '"');
      }
    } else {
      parsed = speed;
    }

    return parsed;
  }
  /**
   * @summary Parses an angle value in radians or degrees and returns a normalized value in radians
   * @memberOf PSV.utils
   * @param {string|number} angle - eg: 3.14, 3.14rad, 180deg
   * @param {boolean} [zeroCenter=false] - normalize between -Pi - Pi instead of 0 - 2*Pi
   * @param {boolean} [halfCircle=zeroCenter] - normalize between -Pi/2 - Pi/2 instead of -Pi - Pi
   * @returns {number}
   * @throws {PSV.PSVError} when the angle cannot be parsed
   */

  function parseAngle(angle, zeroCenter, halfCircle) {
    if (zeroCenter === void 0) {
      zeroCenter = false;
    }

    if (halfCircle === void 0) {
      halfCircle = zeroCenter;
    }

    var parsed;

    if (typeof angle === 'string') {
      var match = angle.toLowerCase().trim().match(/^(-?[0-9]+(?:\.[0-9]*)?)(.*)$/);

      if (!match) {
        throw new PSVError('Unknown angle "' + angle + '"');
      }

      var value = parseFloat(match[1]);
      var unit = match[2];

      if (unit) {
        switch (unit) {
          case 'deg':
          case 'degs':
            parsed = three.MathUtils.degToRad(value);
            break;

          case 'rad':
          case 'rads':
            parsed = value;
            break;

          default:
            throw new PSVError('Unknown angle unit "' + unit + '"');
        }
      } else {
        parsed = value;
      }
    } else if (typeof angle === 'number' && !isNaN(angle)) {
      parsed = angle;
    } else {
      throw new PSVError('Unknown angle "' + angle + '"');
    }

    parsed = loop(zeroCenter ? parsed + Math.PI : parsed, Math.PI * 2);
    return zeroCenter ? three.MathUtils.clamp(parsed - Math.PI, -Math.PI / (halfCircle ? 2 : 1), Math.PI / (halfCircle ? 2 : 1)) : parsed;
  }
  /**
   * @summary Creates a THREE texture from an image
   * @memberOf PSV.utils
   * @param {HTMLImageElement | HTMLCanvasElement} img
   * @return {external:THREE.Texture}
   */

  function createTexture(img) {
    var texture = new three.Texture(img);
    texture.needsUpdate = true;
    texture.minFilter = three.LinearFilter;
    texture.generateMipmaps = false;
    return texture;
  }
  var quaternion = new three.Quaternion();
  /**
   * @summary Applies the inverse of Euler angles to a vector
   * @memberOf PSV.utils
   * @param {external:THREE.Vector3} vector
   * @param {external:THREE.Euler} euler
   */

  function applyEulerInverse(vector, euler) {
    quaternion.setFromEuler(euler).invert();
    vector.applyQuaternion(quaternion);
  }

  /**
   * @callback OnTick
   * @summary Function called for each animation frame with computed properties
   * @memberOf PSV.utils.Animation
   * @param {Object.<string, number>} properties - current values
   * @