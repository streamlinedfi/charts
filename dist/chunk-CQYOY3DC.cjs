"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _div = require('@streamlinedfi/div');var _react = require('react'); var _react2 = _interopRequireDefault(_react);var _styledcomponents = require('styled-components'); var _styledcomponents2 = _interopRequireDefault(_styledcomponents);var u=_styledcomponents.keyframes`
  0% {
    transform: translate3d(-100%, 0, 0);
  }

  100% {
    transform: translate3d(100%, 0, 0);
  }
`,p=_styledcomponents2.default.call(void 0, _div.Div)`
  animation: ${u} 1s ease infinite;
`;function v({text:h,width:o="100%",$w:n,$width:i,height:$=100,$h:a,$height:s,progress:w,small:t=!1,color:f="#0094FF",...d}){return _react2.default.createElement(_div.Div,{$flex:!0,$column:!0,$innerCenter:!0,$w:n||i||o,$h:a||s||$,...d},_react2.default.createElement(_div.Div,{$relative:!0,$w:t?18:22,$h:2,$overflow:"hidden",$radius:2},_react2.default.createElement(p,{$absolute:!0,$top:0,$left:0,$w:t?18:22,$h:2,$radius:2,$background:f})))}exports.a = v;
//# sourceMappingURL=chunk-CQYOY3DC.cjs.map