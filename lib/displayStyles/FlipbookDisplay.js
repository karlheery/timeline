"use strict";

require("core-js/modules/web.dom.iterable.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
require("core-js/modules/es6.regexp.split.js");
require("core-js/modules/es6.symbol.js");
var _react = _interopRequireWildcard(require("react"));
var _exifJs = _interopRequireDefault(require("exif-js"));
var _reactMagnifier = _interopRequireDefault(require("react-magnifier"));
var _MediaItem = _interopRequireDefault(require("../MediaItem"));
var _reactPageflip = _interopRequireDefault(require("react-pageflip"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
/**
 * Uses open source: https://nodlik.github.io/react-pageflip/   - main page
 *                  https://github.com/Nodlik/react-pageflip    - react source code
 *                  https://github.com/Nodlik/StPageFlip        - base JS version
 * 
 */
class FlipbookDisplay extends _react.Component {
  constructor(props) {
    super(props);

    // build a flat list of media ....while I decide if we are going to break up chapters
    _defineProperty(this, "nextButtonClick", () => {
      this.flipBook.getPageFlip().flipNext();
    });
    _defineProperty(this, "prevButtonClick", () => {
      this.flipBook.getPageFlip().flipPrev();
    });
    _defineProperty(this, "onPage", e => {
      this.setState({
        page: e.data
      });
      this.props.onDisplayClick(e.data);
    });
    this.medialist = [];
    for (var i = 0; i < this.props.timelineContent.content.length; i++) {
      if (this.props.timelineContent.content[i]['media'].length > 0) {
        this.medialist = this.medialist.concat(this.props.timelineContent.content[i]['media']);
      }
    }

    // set initial state
    this.state = {
      timeline_name: this.props.timeline_name,
      timelineContent: this.props.timelineContent,
      medialist: this.medialist,
      cover: this.props.cover,
      index: -1,
      playOrPauseAction: "Pause",
      shuffleOrUnshuffleAction: "Shuffle",
      page: 0,
      totalPage: this.medialist.length
    };
  }

  // called by ReactJS after `render()`
  componentDidMount() {
    this.setState({
      totalPage: this.flipBook.getPageFlip().getPageCount()
    });

    // set interval for the timer between showing photos
    //this.timer = setInterval(() => this.nextButtonClick(this), 10000 );        	
  }

  componentWillUnmount() {
    this.pauseShow();
  }
  shouldComponentUpdate() {
    return true;
  }
  /**
   * Render the HTMLFlipBook
   */
  render() {
    var timelineContent = this.state.timelineContent;
    if (!timelineContent) {
      timelineContent = {};
      timelineContent.content = [];
    }
    return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement(_reactPageflip.default, {
      width: 550,
      height: 550,
      size: "stretch",
      minWidth: 315,
      minHeight: 315,
      maxShadowOpacity: 0.5,
      showCover: true,
      mobileScrollSupport: true,
      onFlip: this.onPage,
      onChangeOrientation: this.onChangeOrientation,
      onChangeState: this.onChangeState,
      className: "flip-book",
      ref: el => this.flipBook = el
    }, /*#__PURE__*/_react.default.createElement(PageCover, {
      picture: this.state.cover
    }, timelineContent.description), this.state.medialist.map(f => /*#__PURE__*/_react.default.createElement(Page, {
      chapter: timelineContent.description,
      number: 1,
      picture: f,
      key: f
    })), /*#__PURE__*/_react.default.createElement(PageCover, null, "THE END"))));
  }
  async fetchImage(fileRef) {
    // it's either a URL to S3 or an actual File object already
    if (fileRef && typeof fileRef === 'string' && fileRef.startsWith("http")) {
      console.log("retrieving file from URL " + fileRef);
      var self = this;

      // no-cache and origin is essential to avoiding non-deterministic CORS issues
      // read: https://stackoverflow.com/questions/44800431/caching-effect-on-cors-no-access-control-allow-origin-header-is-present-on-th
      let r = await fetch(fileRef, {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        referrerPolicy: 'origin'
      });
      let b = await r.blob();
      var objectURL = URL.createObjectURL(b);
      var myImage = new Image();
      myImage.src = objectURL;
      return myImage;
    } else {
      return fileRef;
    }
  }
  async fetchFile(fileRef) {
    // it's either a URL to S3 or an actual File object already
    if (fileRef && typeof fileRef === 'string' && fileRef.startsWith("http")) {
      console.log("retrieving file from URL " + fileRef);
      var self = this;

      // no-cache and origin is essential to avoiding non-deterministic CORS issues
      // read: https://stackoverflow.com/questions/44800431/caching-effect-on-cors-no-access-control-allow-origin-header-is-present-on-th
      let r = await fetch(fileRef, {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        referrerPolicy: 'origin'
      });
      let b = await r.blob();
      var fname = self.parseFilenameFromURL(fileRef);
      var f = new File([b], fname, {
        type: "image/jpeg"
      });
      return f;

      /*
      // paste into dev tool to test
      // fetch("https://s3-eu-west-1.amazonaws.com/khpublicbucket/TaraGlen/761E7CAD-7E80-462D-8EDA-582720A130B1_0_1597709364999.jpeg", { "method": "GET",  "mode": "cors" });
      					method: 'GET', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
      		'Content-Type': 'application/json'
      	 'Content-Type': 'application/x-www-form-urlencoded',
      },			
      */
    } else {
      return fileRef;
    }
  }

  /**
   * used for keys in HTML elements etc
   * 
   * @param {*} file 
   */
  parseFilenameFromURL(file) {
    var name = file.name ? file.name : typeof file === 'string' ? file : "unknown";

    // if we were editing a server side file we need the short name again
    // parse the list of files so we can see have simple short names for reuploading existing S3 images after edit
    // @TODO check trouble parsing https://s3-eu-west-1.amazonaws.com/khpublicbucket/Caroline/Monaco 7:10:161537710565215.jpg
    //

    if (name.indexOf("/") < 0) {
      return name;
    }
    var tokens = name.split("/");
    if (tokens && tokens.length > 1) {
      return tokens[tokens.length - 1];
    } else if (tokens && tokens.length == 1) {
      return tokens[0];
    } else {
      console.error("could not cleanup file name " + name);
      return name;
    }
    return name;
  }
  togglePlayPause() {
    if (this.state.playOrPauseAction == "Play") {
      //this.timer = setInterval(this.nextButtonClick, 10000);
      this.setState({
        playOrPauseAction: "Pause"
      });
      console.log("(re)starting show");
    } else {
      window.mediaCanvas.pauseShow();
    }
  }
  pauseShow() {
    //clearInterval(this.timer);
    this.setState({
      playOrPauseAction: "Play"
    });
    console.log("stopping show");
  }
}
var _default = FlipbookDisplay;
exports.default = _default;
const PageCover = /*#__PURE__*/_react.default.forwardRef((props, ref) => {
  return /*#__PURE__*/_react.default.createElement("div", {
    className: "page page-cover",
    ref: ref,
    "data-density": "hard"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "page-content"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "page-image"
  }, /*#__PURE__*/_react.default.createElement("img", {
    src: props.picture,
    className: "page-image"
  })), /*#__PURE__*/_react.default.createElement("h2", null, props.children)));
});
const Page = /*#__PURE__*/_react.default.forwardRef((props, ref) => {
  // if we have text to show we'll split the page
  if (props.children && props.children.length > 0) {
    return /*#__PURE__*/_react.default.createElement("div", {
      className: "page",
      ref: ref
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "page-content"
    }, /*#__PURE__*/_react.default.createElement("h2", {
      className: "page-header"
    }, props.chapter), /*#__PURE__*/_react.default.createElement("div", {
      className: "page-image"
    }, /*#__PURE__*/_react.default.createElement(_reactMagnifier.default, {
      src: props.picture,
      className: "page-image",
      zoomImgSrc: props.picture,
      mgShape: "square",
      zoomFactor: 1.10,
      mgWidth: 300,
      mgHeight: 200
    })), /*#__PURE__*/_react.default.createElement("div", {
      className: "page-text"
    }, props.children), /*#__PURE__*/_react.default.createElement("div", {
      className: "page-footer"
    }, props.number + 1)));
  } else {
    return /*#__PURE__*/_react.default.createElement("div", {
      className: "page",
      ref: ref
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "page-content"
    }, /*#__PURE__*/_react.default.createElement("h2", {
      className: "page-header"
    }, props.chapter), /*#__PURE__*/_react.default.createElement("div", {
      className: "page-image"
    }, /*#__PURE__*/_react.default.createElement(_reactMagnifier.default, {
      src: props.picture,
      className: "page-image",
      zoomImgSrc: props.picture,
      mgShape: "square",
      zoomFactor: 1.10,
      mgWidth: 300,
      mgHeight: 200
    })), /*#__PURE__*/_react.default.createElement("div", {
      className: "page-footer"
    }, props.number + 1)));
  }
});

// <img src={props.picture} 
// zoomImgSrc={props.picture} mgShape="square" zoomFactor={1.10} mgWidth={300} mgHeight={200}