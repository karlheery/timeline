"use strict";

require("core-js/modules/web.dom.iterable.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _reactBurgerMenu = require("react-burger-menu");
require("./OptionsMenu.css");
var _TimelineItemCreator = _interopRequireDefault(require("./TimelineItemCreator"));
var _EditMenu = _interopRequireDefault(require("./EditMenu"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
class OptionsMenu extends _react.default.Component {
  constructor(props) {
    super(props);
    this.state = {
      timeline_name: props.timeline_name,
      timeline_data: props.timeline_data,
      vizStyle: props.vizStyle,
      config: props.config,
      menuOpen: false,
      all_timelines_uri: props.backend_uri
    };
    console.log("creating options menu");
    window.menuComponent = this;

    // creata refernce for calling methods on timeline creator
    this.child = /*#__PURE__*/_react.default.createRef();
  }

  // This keeps your state in sync with the opening/closing of the menu
  // via the default means, e.g. clicking the X, pressing the ESC key etc.
  handleStateChange(state) {
    console.log("menu state changing with " + state.isOpen);
    var newMenuOpenState = state.isOpen;
    this.setState({
      menuOpen: newMenuOpenState
    });
    if (!newMenuOpenState) {
      this.child.current.clearMenuState();
    }
  }

  /**
   * This can be used to open the menu, e.g. when a user clicks a timeline item
   */
  openMenu() {
    // change menu state and clear down the state first so we arent editing a previous item	
    this.child.current.clearMenuState();
    this.setState({
      menuOpen: true
    });
  }

  // This can be used to open the menu, e.g. when a user clicks a timeline item
  openMenuToEdit(item) {
    this.child.current.setMenuState(item);
    this.setState({
      menuOpen: true
    });
  }
  setMenuStyle(vstyle) {
    this.state.vizStyle = vstyle;
    if (this.child && this.child.current) {
      this.child.current.setMenuStyle(vstyle);
    }
  }

  // This can be used to close the menu, e.g. when a user clicks a menu item
  closeMenu() {
    this.setState({
      menuOpen: false
    });
    this.child.current.clearMenuState();
  }

  // This can be used to toggle the menu, e.g. when using a custom icon
  // Tip: You probably want to hide either/both default icons if using a custom icon
  // See https://github.com/negomi/react-burger-menu#custom-icons
  toggleMenu() {
    var newMenuOpenState = !this.state.menuOpen;
    this.setState({
      menuOpen: newMenuOpenState
    });
    if (!newMenuOpenState) {
      this.child.current.clearMenuState();
    }
  }
  showSettings(event) {
    event.preventDefault();
  }
  render() {
    return /*#__PURE__*/_react.default.createElement(_reactBurgerMenu.slide, {
      right: true,
      isOpen: this.state.menuOpen,
      onStateChange: state => this.handleStateChange(state)
    }, /*#__PURE__*/_react.default.createElement(_EditMenu.default, {
      timeline_name: this.state.timeline_name,
      timeline_data: this.state.timeline_data,
      config: this.state.config,
      vizStyle: this.state.vizStyle,
      ref: this.child,
      backend_uri: this.state.all_timelines_uri,
      menu: this
    }), /*#__PURE__*/_react.default.createElement(_TimelineItemCreator.default, {
      timeline_name: this.state.timeline_name,
      config: this.state.config,
      vizStyle: this.state.vizStyle,
      ref: this.child,
      menu: this
    }));
  }
}
var _default = OptionsMenu;
exports.default = _default;