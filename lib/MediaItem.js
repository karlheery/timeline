"use strict";

require("core-js/modules/web.dom.iterable.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
require("core-js/modules/es6.regexp.split.js");
var _react = _interopRequireWildcard(require("react"));
require("slick-carousel/slick/slick.css");
require("slick-carousel/slick/slick-theme.css");
var _reactSlick = _interopRequireDefault(require("react-slick"));
var _reactImageLightbox = _interopRequireDefault(require("react-image-lightbox"));
require("react-image-lightbox/style.css");
var _reactVisibilitySensor = _interopRequireDefault(require("react-visibility-sensor"));
var _materialUiImage = _interopRequireDefault(require("material-ui-image"));
var _Edit = _interopRequireDefault(require("@material-ui/icons/Edit"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
class MediaItem extends _react.Component {
  constructor(props) {
    super(props);

    // set initial state
    this.state = {
      item: this.props.contentItem,
      show_details: this.props.show_details,
      vizStyle: this.props.vizStyle,
      itemVisible: false
    };
    this.expandItem = this.expandItem.bind(this);
    this.play = this.play.bind(this);
    this.pause = this.pause.bind(this);
    this.toggleSlider = this.toggleSlider.bind(this);
  }
  getId() {
    return this.state.item.title_on_date;
  }

  // called by ReactJS after `render()`
  componentDidMount() {
    //this.timerID = setInterval(() => this.doSOmething(), 1000 );
  }
  play() {
    this.slider.slickPlay();
  }
  pause() {
    this.slider.slickPause();
  }
  toggleSlider(slide) {
    slide ? this.play() : this.pause();
  }

  /**
   * update the item, perhaps as a result of an edit, so we can show changes in real-time	 
   */
  updateItem(changedItem) {
    this.setState({
      item: changedItem
    });
  }

  /**
   * Open the menu to allow editing of the clicked item
   */
  expandItem(item) {
    console.log("expanding item " + item);
    if (!item || !item.title) {
      console.error("couldnt find item to edit: " + item);
    }

    // now open the menu with this item as its state
    //window.menuComponent.openMenuToEdit( item );	
  }

  openModal(file) {
    var contentItem = this.state.item;
    var index = contentItem.media.findIndex(obj => obj == file);
    console.log("at index " + index);
    this.setState({
      lightboxOpen: true,
      lightboxFileIndex: index
    });
  }

  /*
   * Return number of content items within this MediaItem, perhaps to helps set delay on scroll
   */
  getNumberContentItems() {
    var contentItem = this.state.item;
    if (!contentItem.media || !Array.isArray(contentItem.media)) {
      return 1;
    }
    return contentItem.media.length;
  }
  isMovie(checkType) {
    // if not preloaded yet - do nothing useful - send them through as if images (dont filter them out altogether as preloadimages gets called later)
    if (checkType.type && checkType.type.startsWith("video") || !checkType.type && typeof checkType === 'string' && ['mp4', '.avi', 'mov'].indexOf(checkType.toLowerCase().split('.').pop()) >= 0) {
      return true;
    } else {
      // assume image
      return false;
    }
  }

  /**
   * Build and display the timeline
   */
  render() {
    var contentItem = this.state.item;

    //console.log( "rendering item with " + contentItem.media.length + " media") ;

    const settings = {
      className: "slider variable-width",
      variableWidth: true,
      adaptiveHeight: true,
      dots: true,
      infinite: true,
      speed: 4000,
      autoplay: true,
      autoplaySpeed: 100,
      slidesToShow: 1,
      slidesToScroll: 1
    };
    var imgStyle = "Scrapbook" == this.state.vizStyle ? "scrap-img-for-slider" : "App-itemimage";
    if (!contentItem.media || !Array.isArray(contentItem.media)) {
      contentItem.media = [];
    }

    // remove movies from sliders ...for now . another @TODO
    if (contentItem.media.length > 1) {
      var newMedia = [];
      for (var i = 0; i < contentItem.media.length; i++) {
        if (!this.isMovie(contentItem.media[i])) {
          newMedia.push(contentItem.media[i]);
        } else {
          console.log("had to filter our video from list of media - cant show in slider: " + contentItem.media[i]);
        }
      }
      contentItem.media = newMedia;
    }

    // now i have react avatar for user rotating, i dont need to do any best effort using ExifOrientationImg...so removed this... contentItem.media.map(f => ( <div key={f}><ExifOrientationImg src={f} className={imgStyle} onClick={()=>this.openModal(f)}/></div> ))						
    return /*#__PURE__*/_react.default.createElement("div", {
      name: "media"
    }, this.state.show_details && /*#__PURE__*/_react.default.createElement("p", {
      className: "handwriting"
    }, /*#__PURE__*/_react.default.createElement("i", null, contentItem.date)), contentItem.media && (contentItem.media.length > 1 || contentItem.media.length == 1 && !this.isMovie(contentItem.media[0])) && /*#__PURE__*/_react.default.createElement(_reactVisibilitySensor.default, {
      onChange: isVisible => {
        this.setState({
          itemVisible: isVisible
        });
        this.toggleSlider(isVisible);
      }
    }, /*#__PURE__*/_react.default.createElement(_reactSlick.default, _extends({
      ref: slider => this.slider = slider
    }, settings), contentItem.media.map(f => /*#__PURE__*/_react.default.createElement("div", {
      key: f
    }, /*#__PURE__*/_react.default.createElement("img", {
      src: f,
      className: imgStyle,
      onClick: () => this.openModal(f)
    }))))), contentItem.media && contentItem.media.length == 1 && this.isMovie(contentItem.media[0]) && /*#__PURE__*/_react.default.createElement(_reactVisibilitySensor.default, {
      onChange: isVisible => {
        this.setState({
          itemVisible: isVisible
        });
        // need to play video now - react-video needed https://video-react.js.org/components/player/							
        // autoPlay="autoplay" 
      }
    }, /*#__PURE__*/_react.default.createElement("video", {
      preload: "auto",
      controls: "controls",
      className: "scrap-img-for-slider"
    }, /*#__PURE__*/_react.default.createElement("source", {
      src: contentItem.media[0],
      className: "App-itemmovie",
      onClick: () => this.openModal(contentItem.media[0])
    }), "Your browser does not support the video tag.")), this.state.lightboxOpen && /*#__PURE__*/_react.default.createElement(_reactImageLightbox.default, {
      mainSrc: contentItem.media[this.state.lightboxFileIndex],
      imageTitle: contentItem.title,
      imageCaption: contentItem.comment,
      nextSrc: contentItem.media[(this.state.lightboxFileIndex + 1) % contentItem.media.length],
      prevSrc: contentItem.media[(this.state.lightboxFileIndex + contentItem.media.length - 1) % contentItem.media.length],
      onCloseRequest: () => this.setState({
        lightboxOpen: false
      }),
      onMovePrevRequest: () => this.setState({
        lightboxFileIndex: (this.state.lightboxFileIndex + contentItem.media.length - 1) % contentItem.media.length
      }),
      onMoveNextRequest: () => this.setState({
        lightboxFileIndex: (this.state.lightboxFileIndex + 1) % contentItem.media.length
      })
    }), this.state.show_details && /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement("h3", {
      className: "handwriting"
    }, contentItem.title), /*#__PURE__*/_react.default.createElement("p", {
      className: "handwriting"
    }, contentItem.comment)));
  }

  /**
   * Moved Edit button to text box in MediaTimeline up a level
    				<div align="right" valign="top">
  			<EditIcon className="hoverable-img" onClick={() => window.timelineComponent.editItem(this.state.item)}/>
  		</div>
     */
}
var _default = MediaItem;
exports.default = _default;