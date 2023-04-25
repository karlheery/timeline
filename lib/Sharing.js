"use strict";

require("core-js/modules/web.dom.iterable.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _reactShare = require("react-share");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/**
 * Display our sharing bar
 */
class Sharing extends _react.Component {
  constructor(props) {
    super(props);
    this.state = {
      sharing_url: props.sharing_url
    };
  }

  /**   
   */
  componentDidMount() {}

  /**
   * Render the top banner and the main timeline page
   */
  render() {
    //ref={(tl) => { this.detailsMenu = tl; }}

    // sharing link should produce: { window.location.href + "?scrapbookName=" + this.state.timeline_code}
    // passcode using https://reactjsexample.com/otp-input-component-for-react/

    var full_url = window.location.href;
    if (this.state.config && this.state.config.url_code) {
      full_url = full_url + this.state.config.url_code;
    }
    return /*#__PURE__*/_react.default.createElement("div", {
      align: "center"
    }, /*#__PURE__*/_react.default.createElement(_reactShare.WhatsappShareButton, {
      url: this.state.sharing_url
    }, /*#__PURE__*/_react.default.createElement(_reactShare.WhatsappIcon, {
      round: true,
      size: 42
    })), /*#__PURE__*/_react.default.createElement(_reactShare.EmailShareButton, {
      url: this.state.sharing_url
    }, /*#__PURE__*/_react.default.createElement(_reactShare.EmailIcon, {
      round: true,
      size: 42
    })), /*#__PURE__*/_react.default.createElement(_reactShare.FacebookShareButton, {
      url: this.state.sharing_url
    }, /*#__PURE__*/_react.default.createElement(_reactShare.FacebookIcon, {
      round: true,
      size: 42
    })), /*#__PURE__*/_react.default.createElement(_reactShare.LinkedinShareButton, {
      url: this.state.sharing_url
    }, /*#__PURE__*/_react.default.createElement(_reactShare.LinkedinIcon, {
      round: true,
      size: 42
    })), /*#__PURE__*/_react.default.createElement(_reactShare.TwitterShareButton, {
      url: this.state.sharing_url
    }, /*#__PURE__*/_react.default.createElement(_reactShare.TwitterIcon, {
      round: true,
      size: 42
    })));
  }
}
var _default = Sharing;
exports.default = _default;