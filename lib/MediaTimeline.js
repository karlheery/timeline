"use strict";

require("core-js/modules/web.dom.iterable.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
require("./displayStyles/scrapbook-style.css");
require("./displayStyles/flipbook-style.css");
var _reactVerticalTimelineComponent = require("react-vertical-timeline-component");
require("react-vertical-timeline-component/style.min.css");
var _MediaItem = _interopRequireDefault(require("./MediaItem"));
var _PolaroidDisplay = _interopRequireDefault(require("./displayStyles/PolaroidDisplay"));
var _FlipbookDisplay = _interopRequireDefault(require("./displayStyles/FlipbookDisplay"));
var _ScrapbookDisplay = _interopRequireDefault(require("./displayStyles/ScrapbookDisplay"));
var _reactScrollToComponent = _interopRequireDefault(require("react-scroll-to-component"));
var _Work = _interopRequireDefault(require("@material-ui/icons/Work"));
var _Star = _interopRequireDefault(require("@material-ui/icons/Star"));
var _School = _interopRequireDefault(require("@material-ui/icons/School"));
var _FaceSharp = _interopRequireDefault(require("@material-ui/icons/FaceSharp"));
var _FavoriteSharp = _interopRequireDefault(require("@material-ui/icons/FavoriteSharp"));
var _SupervisorAccount = _interopRequireDefault(require("@material-ui/icons/SupervisorAccount"));
var _moment = require("moment");
var _Edit = _interopRequireDefault(require("@material-ui/icons/Edit"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
// consider toggling with a tiled photo gallery
// ...like: https://github.com/neptunian/react-photo-gallery
//

class MediaTimeline extends _react.Component {
  constructor(props) {
    super(props);
    this.mediaItems = {};
    this.numberScrollers = 0;
    this.scrolling = 0;
    this.scrollTarget = 0;
    this.sleepTimePerItem = 3000;
    this.previousItemSleepTime = this.sleepTimePerItem;

    // set initial state
    this.state = {
      timeline_name: this.props.timeline_name,
      timelineData: this.props.timeline_data,
      config: this.props.config,
      menuController: this.props.app,
      chapterIndex: 0
    };
    this.editItem = this.editItem.bind(this);
    window.timelineComponent = this;
  }

  // called by ReactJS after `render()`
  componentDidMount() {
    this.timerID = setInterval(() => this.changeBackground(), 8000);
  }

  /**
   * Open the menu to allow editing of the clicked item
   */
  editItem(item) {
    console.log("editing item " + item);
    if (!item || !item.title) {
      console.error("couldnt find item to edit: " + item);
    }

    // now open the menu with this item as its state
    window.menuComponent.openMenuToEdit(item);
  }

  /**
   * Save reference from child so we can update item state
   * Is this a right use of refs?
   */
  saveRef(title_on_date, ref) {
    this.mediaItems[title_on_date] = ref;
  }

  /**
   * Update an item following a save
   */
  updateItem(item) {
    var timelineContent = this.state.timelineData;
    var foundIt = false;
    for (var i = 0; i < timelineContent.content.length; i++) {
      // replace the item
      if (timelineContent.content[i].title_on_date === item.title_on_date) {
        timelineContent.content[i] = item;
        foundIt = true;
      }
    }

    // new item - append it
    if (!foundIt) {
      timelineContent.content.push(item);
    }

    // reset state
    this.setTimeline(timelineContent);

    // changing state like above doesnt trigger a re-render
    // so lets go one lever deeper -  lookup the actual react node so we can change the internal state
    var itemComponent = this.mediaItems[item.title_on_date];
    if (itemComponent) {
      console.log("updating item state for " + item.title_on_date);
      itemComponent.updateItem(item);
    }
    try {
      // now try scroll it into view
      var elmnt = document.getElementById(item.title_on_date);
      elmnt.scrollIntoView();
    } catch (err) {
      // swallow it
    }
  }
  deleteItem(itemName) {
    var timelineContent = this.state.timelineData;
    var prev_title = "";
    for (var i = 0; i < timelineContent.content.length; i++) {
      if (i > 0) {
        prev_title = timelineContent.content[i].title_on_date;
      }

      // replace the item
      if (timelineContent.content[i].title_on_date === itemName) {
        timelineContent.content.splice(i, 1);
      }
    }

    // reset state
    this.setTimeline(timelineContent);
    try {
      // now try scroll previous one  into view
      var elmnt = document.getElementById(prev_title);
      elmnt.scrollIntoView();
    } catch (err) {
      // swallow it
    }
  }

  /**
   * Start scrolling to end of timeline
   * 
   */
  startScrolling() {
    if (this.displayCanScroll()) {
      // scroll direction forward

      if (this.scrolling === 0 && this.numberScrollers === 0) {
        this.scrolling = +1;
        this.numberScrollers += 1;
        this.nextScroll();
      }
    }
  }

  /**
   * Certain displays dont do scrolling so ignore
   */
  displayCanScroll() {
    if (this.state.timelineData.viz_style && (this.state.timelineData.viz_style === "Polaroid" || this.state.timelineData.viz_style === "Flipbook")) {
      return false;
    } else {
      return true;
    }
  }

  /**
   * Stop scrolling 
   *    
   */
  stopScrolling() {
    // scroll direction forward
    this.scrolling = 0;
    this.scrollingHadStopped = true;
  }

  /**
   * As we hit end of scrolling and set about firing off another one, check whether we've since hit stop
   */
  checkNextScroll() {
    // check the flag - user might have stopped scrolling
    // also checked if someone stopped & restarted scrolling why we were sleeping
    // if so, escape recursive scrolling here, just once mind!
    if (this.scrolling === 0 || this.numberScrollers > 1) {
      this.numberScrollers -= 1;
      return;
    }
    window.timelineComponent.nextScroll();
  }

  /**
   * Called recursively at event when item scrolls into view
   *   * @TODO pause and wait for end of carousel
   */
  nextScroll() {
    var timelineContent = this.state.timelineData;
    this.scrollTarget += this.scrolling;

    // and once we hit bottom we'll go in reverse
    if (this.scrollTarget < 0 || this.scrollTarget >= timelineContent.content.length) {
      this.scrolling = -1 * this.scrolling;
      this.scrollTarget += this.scrolling;
    }

    // now find the media item
    var mediaItem = this.mediaItems[timelineContent.content[this.scrollTarget].title_on_date];

    // then set a delay timer and scroll to it
    setTimeout(function () {
      try {
        // now sleep is over, check one more time if we're still scrolling
        if (this.scrolling === 0 || this.numberScrollers > 1) {
          this.numberScrollers -= 1;
          return;
        }
        console.log("scrolling to item " + this.scrollTarget + " of " + timelineContent.content.length + ": item = " + mediaItem.getId());
        let scroller = (0, _reactScrollToComponent.default)(mediaItem, {
          offset: 0,
          align: 'centre',
          duration: 10000
        });
        scroller.on('end', () => window.timelineComponent.checkNextScroll());
        this.previousItemSleepTime = mediaItem.getNumberContentItems() == 0 ? this.sleepTimePerItem : this.sleepTimePerItem * mediaItem.getNumberContentItems();
      } catch (err) {
        // swallow it
        console.log("can't scroll", err);
      }
    }, this.previousItemSleepTime);
  }

  /**
   * Retrieve the cached timeline data - to be used in edit screen to move stuff around
   * 
   * @returns 
   */
  getTimelineData() {
    return this.state.timelineData;
  }

  /**
   * Save some newly source timeline data, eg from API call
   */
  setTimeline(tData) {
    this.setState({
      timelineData: tData,
      vizStyle: tData.viz_style
    });

    // toggle menu style to suit viz type, if it exists yet
    if (window.menuComponent) {
      window.menuComponent.setMenuStyle(tData.viz_style);
    }
    console.log("timeline data saved: " + this.state.timelineData);
  }
  shouldComponentUpdate() {
    return true;
  }

  /** 
   * Rotate to next background image. @TODO - change it based on period in timeline
   */
  changeBackground() {
    var i = 0;
    if (this.state.chapterIndex) {
      i = this.state.chapterIndex;
    }
    i = i + 1;
    if (this.state.timelineData && this.state.timelineData.chapters && i >= this.state.timelineData.chapters.length) {
      i = 0;
    }

    //console.log( "changing to backgound " + i )

    if (!this.state.timelineData || !this.state.timelineData.chapters || this.state.timelineData.chapters.length < 2) {
      return;
    }
    var imgName = this.state.timelineData.chapters[i].background;
    var mainPage = document.getElementById("main-bg");

    //console.log( "new background image is " + imgName )
    //mainPage.style.backgroundImage = "url('" + imgName + "')";	  	  

    window.addEventListener("load", function () {
      mainPage.classList.add("hidden");
    });
    window.addEventListener("transitionend", this.changeBackgroundTo(imgName));
    //window.addEventListener("webkitTransitionEnd", this.changeBackgroundTo( imgName ) );
    //window.addEventListener("mozTransitionEnd", this.changeBackgroundTo( imgName ) );
    //window.addEventListener("oTransitionEnd", this.changeBackgroundTo( imgName ) );	  

    this.setState({
      chapterIndex: i
    });
  }

  /**
   * CHange background image to given URL
   * @param {} imgName 
   */
  changeBackgroundTo(imgName) {
    var mainPage = document.getElementById("main-bg");
    if (mainPage.classList.contains("hidden")) {
      mainPage.style.backgroundImage = "url('" + imgName + "')";
    }
    mainPage.classList.toggle("hidden");
  }

  /**
   * Handle click on display (e.g. Flipbook changing page)
   * ...bubbling it up to next level
   */
  handleDisplayClick(e) {
    if (this.state.timelineData.viz_style === "Flipbook") {
      this.props.onDisplayClick(e);
    }
  }

  /**
   * Build and display the timeline
   */
  render() {
    var timelineContent = this.state.timelineData;
    if (!timelineContent) {
      timelineContent = {};
      timelineContent.content = [];
    }

    //console.log( "rendering timeline with " + timelineContent.content.length + " items" );	

    for (var i = 0; i < timelineContent.content.length; i++) {
      //console.log( " item: " + timelineContent.content[i].title_on_date );

      if (timelineContent.content[i].category === "Friends") {
        timelineContent.content[i].category_icon = /*#__PURE__*/_react.default.createElement(_FaceSharp.default, null);
      } else if (timelineContent.content[i].category === "Love") {
        timelineContent.content[i].category_icon = /*#__PURE__*/_react.default.createElement(_FavoriteSharp.default, null);
      } else if (timelineContent.content[i].category === "Work") {
        timelineContent.content[i].category_icon = /*#__PURE__*/_react.default.createElement(_Work.default, null);
      } else if (timelineContent.content[i].category === "School") {
        timelineContent.content[i].category_icon = /*#__PURE__*/_react.default.createElement(_School.default, null);
      } else if (timelineContent.content[i].category === "Family") {
        timelineContent.content[i].category_icon = /*#__PURE__*/_react.default.createElement(_SupervisorAccount.default, null);
      } else if (timelineContent.content[i].category === "Success") {
        timelineContent.content[i].category_icon = /*#__PURE__*/_react.default.createElement(_Star.default, null);
      }
    }

    /* FOR TESTING
    var mockItem = { 	
    				title_on_date: "Test Timeline Title 2|1001",
    				time_sortable: 1001,				
    					title: "Test Timeline Title 2",
    				category: "Love",
    				date: "2015-04-20",			
    				media: ["https://s3-eu-west-1.amazonaws.com/khpublicbucket/Caroline/95E9EFBD-4FC3-4524-A06C-5F4A3035E345_0_1538256967385.jpeg", "https://s3-eu-west-1.amazonaws.com/khpublicbucket/Caroline/95E9EFBD-4FC3-4524-A06C-5F4A3035E345_0_1538256967385.jpeg"],					
    				comment: "This is another test comment!"					
    			};
    
    
        return (
    			<div id='timeline'>
    			
    				<MediaItem contentItem={mockItem}/>
    			
    			</div>
    );
    */

    //width={1200} height={800} 
    if (this.state.timelineData && this.state.timelineData.viz_style && this.state.timelineData.viz_style === "Polaroid") {
      return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement("div", {
        id: "timeline"
      }, /*#__PURE__*/_react.default.createElement("div", {
        id: "canvas-container",
        align: "center"
      }, /*#__PURE__*/_react.default.createElement("canvas", {
        id: "mediaview",
        ref: this.refCallback
      })), /*#__PURE__*/_react.default.createElement(_PolaroidDisplay.default, {
        timeline_name: this.state.timeline_name,
        canvasArea: "mediaview",
        timelineContent: timelineContent
      })));
    }
    if (this.state.timelineData && this.state.timelineData.viz_style && this.state.timelineData.viz_style === "Flipbook") {
      return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement("div", {
        id: "timeline"
      }, /*#__PURE__*/_react.default.createElement(_FlipbookDisplay.default, {
        timeline_name: this.state.timeline_name,
        timelineContent: timelineContent,
        cover: this.state.config.banner_image,
        onDisplayClick: this.handleDisplayClick.bind(this)
      })));
    }
    if (this.state.timelineData && this.state.timelineData.viz_style && this.state.timelineData.viz_style === "Scrapbook") {
      return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement("div", {
        id: "timeline"
      }, /*#__PURE__*/_react.default.createElement(_ScrapbookDisplay.default, {
        timeline_name: this.state.timeline_name,
        timelineContent: timelineContent,
        vizStyle: this.state.timelineData.viz_style,
        ref: node => {
          this.child = node;
        },
        onDisplayClick: this.handleDisplayClick.bind(this)
      })));
    }

    // ELSE the default view...

    console.log("Displaying in VerticalTimeline mode");
    return /*#__PURE__*/_react.default.createElement("div", {
      id: "timeline"
    }, /*#__PURE__*/_react.default.createElement(_reactVerticalTimelineComponent.VerticalTimeline, null, timelineContent.content.map(contentItem => {
      return /*#__PURE__*/_react.default.createElement(_reactVerticalTimelineComponent.VerticalTimelineElement, {
        key: contentItem.title_on_date,
        id: contentItem.title_on_date,
        className: "vertical-timeline-element"
        //date={contentItem.date}
        ,
        iconStyle: {
          background: 'rgb(131, 112, 140)',
          color: '#dad4dd'
        },
        iconOnClick: () => this.editItem(contentItem),
        icon: contentItem.category_icon
      }, /*#__PURE__*/_react.default.createElement(_MediaItem.default, {
        contentItem: contentItem,
        show_details: true,
        ref: item => {
          this.saveRef(contentItem.title_on_date, item);
        },
        vizStyle: this.state.vizStyle
      }));
    })), /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement("section", {
      className: "end",
      ref: section => {
        this.EndOfTimeline = section;
      }
    })));
  }
}
var _default = MediaTimeline;
exports.default = _default;