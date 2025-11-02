import{Div as e}from"@streamlinedfi/div";import r from"react";import m,{keyframes as l}from"styled-components";var u=l`
  0% {
    transform: translate3d(-100%, 0, 0);
  }

  100% {
    transform: translate3d(100%, 0, 0);
  }
`,p=m(e)`
  animation: ${u} 1s ease infinite;
`;function v({text:h,width:o="100%",$w:n,$width:i,height:$=100,$h:a,$height:s,progress:w,small:t=!1,color:f="#0094FF",...d}){return r.createElement(e,{$flex:!0,$column:!0,$innerCenter:!0,$w:n||i||o,$h:a||s||$,...d},r.createElement(e,{$relative:!0,$w:t?18:22,$h:2,$overflow:"hidden",$radius:2},r.createElement(p,{$absolute:!0,$top:0,$left:0,$w:t?18:22,$h:2,$radius:2,$background:f})))}export{v as a};
//# sourceMappingURL=chunk-GLXN5JT4.mjs.map