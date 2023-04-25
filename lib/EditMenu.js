"use strict";

require("core-js/modules/web.dom.iterable.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
require("core-js/modules/es6.symbol.js");
var _react = _interopRequireWildcard(require("react"));
var _TimelineDetailsForm = _interopRequireDefault(require("./TimelineDetailsForm"));
require("./OptionsMenu.css");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
class EditMenu extends _react.Component {
  constructor(props) {
    super(props);
    _defineProperty(this, "closeEdit", shortCode => {
      console.log("closing details form");
      this.setState({
        formOpen: false
      });
    });
    this.state = {
      timeline_name: this.props.timeline_name,
      timeline_data: this.props.timeline_data,
      config: this.props.config,
      saveStatus: 0,
      vizStyle: this.props.vizStyle,
      all_timelines_uri: props.backend_uri
    };
    this.optionsMenu = props.menu;
    window.itemComponent = this;
  }
  componentDidMount() {
    window.timelineCreator = this;
  }

  /**
   * Change style in line with Timeline or Scrapbook
   * @param {*} vStyle 
   */
  setMenuStyle(vStyle) {
    this.setState({
      vizStyle: vStyle
    });
  }
  clearAndExit() {
    this.clearMenuState();
    this.optionsMenu.closeMenu();
  }

  /**
   * set the staet of menu items so that menu renders in edit mode rather than new
   */
  setMenuState(item) {
    console.log("editing item " + item.title);
    this.clearMenuState();
    var unsure_of_date = false;
    if (item.date && item.date.length < 9) {
      // full dates are stored as dddd, Do MMM YYYY (18 characters)
      unsure_of_date = true;
    }
    this.setState({
      title: item.title,
      media: item.timeline_data,
      old_title: item.title_on_date,
      // for deletion of old
      dateAsNumber: item.time_sortable,
      // this doesnt cnie
      category: item.category,
      dateDisplay: item.date,
      unsure: unsure_of_date,
      media: item.media,
      comment: item.comment,
      uploadMessage: "",
      isEdit: true
    });
  }

  /**
   * If we close an edit screen we want it to open fresh
   */
  clearMenuState() {
    console.log("clearing down timeline item");
    this.setState({
      title: undefined,
      old_title: undefined,
      media: undefined,
      dateAsNumber: undefined,
      category: "Friends",
      date: undefined,
      dateDisplay: undefined,
      unsure: undefined,
      media: undefined,
      comment: undefined,
      uploadMessage: undefined,
      isEdit: false,
      disabled: true,
      filesToUpload: [],
      rotations: [],
      saveStatus: 0,
      filePreloadComplete: false
    });
  }

  /**
   * Show a modal to capture data and create a new timeline
   * @param {*} codeInput 
   */
  editStory() {
    this.setState({
      formOpen: true
    });
  }

  /**
  * Handle the call from child component to close the timeline creation screen
  * @param {*} shortCode 
  */

  /**
   * Handle the rendering of the form
   */
  render() {
    var saveStatus = this.state.saveStatus;
    return /*#__PURE__*/_react.default.createElement("div", {
      align: "left"
    }, /*#__PURE__*/_react.default.createElement(_TimelineDetailsForm.default, {
      isOpen: this.state.formOpen,
      handleDetailsFormClose: this.closeEdit,
      backend_uri: this.state.all_timelines_uri,
      is_new: false,
      timeline_props: this.props
    }), /*#__PURE__*/_react.default.createElement("div", {
      className: "editmenu"
    }, /*#__PURE__*/_react.default.createElement("p", null, /*#__PURE__*/_react.default.createElement("a", {
      className: "menu-a",
      href: "#",
      onClick: () => this.editStory()
    }, "Edit Story")), /*#__PURE__*/_react.default.createElement("p", null, /*#__PURE__*/_react.default.createElement("a", {
      className: "menu-a",
      href: "#"
    }, "More Options..."))), /*#__PURE__*/_react.default.createElement("aside", null, /*#__PURE__*/_react.default.createElement("p", null, this.state.uploadMessage)));
  }
}
var _default = EditMenu;
exports.default = _default;