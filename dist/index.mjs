import{a as s}from"./chunk-GLXN5JT4.mjs";import"./chunk-AHONOM5Y.mjs";import i,{forwardRef as x,lazy as C,Suspense as S,useEffect as b,useState as k}from"react";import{Div as u}from"@streamlinedfi/div";import a from"react";import p,{keyframes as c}from"styled-components";var w=c`
  0% {
    transform: translate3d(-100%, 0, 0);
  }

  100% {
    transform: translate3d(100%, 0, 0);
  }
`,v=p(u)`
  animation: ${w} 1s ease infinite;
`;function f({text:e,width:t="100%",$w:r,$width:o,height:m=100,$h:h,$height:$,progress:B,small:d=!1,color:l="#0094FF",...g}){return a.createElement(u,{$flex:!0,$column:!0,$innerCenter:!0,$w:r||o||t,$h:h||$||m,...g},a.createElement(u,{$relative:!0,$w:d?18:22,$h:2,$overflow:"hidden",$radius:2},a.createElement(v,{$absolute:!0,$top:0,$left:0,$w:d?18:22,$h:2,$radius:2,$background:l})))}var y=C(()=>import("./Chart-DIEG5EIP.mjs")),D=x((e,t)=>{let[r,o]=k(!1);return b(()=>{o(!0)},[]),r?i.createElement(S,{fallback:i.createElement(f,{$height:e.config.height})},i.createElement(y,{...e,fwdRef:t})):i.createElement(f,{$height:e.config.height})});import n,{forwardRef as M,lazy as L,Suspense as z,useEffect as E,useState as F}from"react";var I=L(()=>import("./Chart-RMVWBAAM.mjs")),A=M((e,t)=>{let[r,o]=F(!1);return E(()=>{o(!0)},[]),r?n.createElement(z,{fallback:n.createElement(s,{$height:e.config.height})},n.createElement(I,{...e,fwdRef:t})):n.createElement(s,{$height:e.config.height})});export{D as BarChart,A as CandlesChart};
//# sourceMappingURL=index.mjs.map