(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))s(i);new MutationObserver(i=>{for(const n of i)if(n.type==="childList")for(const o of n.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&s(o)}).observe(document,{childList:!0,subtree:!0});function r(i){const n={};return i.integrity&&(n.integrity=i.integrity),i.referrerPolicy&&(n.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?n.credentials="include":i.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function s(i){if(i.ep)return;i.ep=!0;const n=r(i);fetch(i.href,n)}})();var Ve,P,Ar,q,Bt,kr,Pr,rt,Ue,$e,Mr,gt,ht,ut,Fe={},Oe=[],fs=/acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i,Qe=Array.isArray;function O(t,e){for(var r in e)t[r]=e[r];return t}function vt(t){t&&t.parentNode&&t.parentNode.removeChild(t)}function ms(t,e,r){var s,i,n,o={};for(n in e)n=="key"?s=e[n]:n=="ref"?i=e[n]:o[n]=e[n];if(arguments.length>2&&(o.children=arguments.length>3?Ve.call(arguments,2):r),typeof t=="function"&&t.defaultProps!=null)for(n in t.defaultProps)o[n]===void 0&&(o[n]=t.defaultProps[n]);return Be(t,o,s,i,null)}function Be(t,e,r,s,i){var n={type:t,props:e,key:r,ref:s,__k:null,__:null,__b:0,__e:null,__c:null,constructor:void 0,__v:i??++Ar,__i:-1,__u:0};return i==null&&P.vnode!=null&&P.vnode(n),n}function U(t){return t.children}function Ie(t,e){this.props=t,this.context=e}function re(t,e){if(e==null)return t.__?re(t.__,t.__i+1):null;for(var r;e<t.__k.length;e++)if((r=t.__k[e])!=null&&r.__e!=null)return r.__e;return typeof t.type=="function"?re(t):null}function _s(t){if(t.__P&&t.__d){var e=t.__v,r=e.__e,s=[],i=[],n=O({},e);n.__v=e.__v+1,P.vnode&&P.vnode(n),$t(t.__P,n,e,t.__n,t.__P.namespaceURI,32&e.__u?[r]:null,s,r??re(e),!!(32&e.__u),i),n.__v=e.__v,n.__.__k[n.__i]=n,Dr(s,n,i),e.__e=e.__=null,n.__e!=r&&Er(n)}}function Er(t){if((t=t.__)!=null&&t.__c!=null)return t.__e=t.__c.base=null,t.__k.some(function(e){if(e!=null&&e.__e!=null)return t.__e=t.__c.base=e.__e}),Er(t)}function It(t){(!t.__d&&(t.__d=!0)&&q.push(t)&&!qe.__r++||Bt!=P.debounceRendering)&&((Bt=P.debounceRendering)||kr)(qe)}function qe(){try{for(var t,e=1;q.length;)q.length>e&&q.sort(Pr),t=q.shift(),e=q.length,_s(t)}finally{q.length=qe.__r=0}}function xr(t,e,r,s,i,n,o,l,d,h,u){var p,c,f,g,A,v,b=s&&s.__k||Oe,m=e.length;for(d=bs(r,e,b,d,m),p=0;p<m;p++)(f=r.__k[p])!=null&&(c=f.__i!=-1&&b[f.__i]||Fe,f.__i=p,v=$t(t,f,c,i,n,o,l,d,h,u),g=f.__e,f.ref&&c.ref!=f.ref&&(c.ref&&yt(c.ref,null,f),u.push(f.ref,f.__c||g,f)),A==null&&g!=null&&(A=g),4&f.__u?(d=Cr(f,d,t),c.__e&&(c.__e=null)):typeof f.type=="function"&&v!==void 0?d=v:g&&(d=g.nextSibling),f.__u&=-7);return r.__e=A,d}function bs(t,e,r,s,i){var n,o,l,d,h,u=r.length,p=u,c=0;for(t.__k=new Array(i),n=0;n<i;n++)(o=e[n])!=null&&typeof o!="boolean"&&typeof o!="function"?(typeof o=="string"||typeof o=="number"||typeof o=="bigint"||o.constructor==String?o=t.__k[n]=Be(null,o,null,null,null):Qe(o)?o=t.__k[n]=Be(U,{children:o},null,null,null):o.constructor===void 0&&o.__b>0?o=t.__k[n]=Be(o.type,o.props,o.key,o.ref?o.ref:null,o.__v):t.__k[n]=o,d=n+c,o.__=t,o.__b=t.__b+1,l=null,(h=o.__i=gs(o,r,d,p))!=-1&&(p--,(l=r[h])&&(l.__u|=2)),l==null||l.__v==null?(h==-1&&(i>u?c--:i<u&&c++),typeof o.type!="function"&&(o.__u|=4)):h!=d&&(h==d-1?c--:h==d+1?c++:(h>d?c--:c++,o.__u|=4))):t.__k[n]=null;if(p)for(n=0;n<u;n++)(l=r[n])!=null&&(2&l.__u)==0&&(l.__e==s&&(s=re(l)),Wr(l,l));return s}function Cr(t,e,r){var s,i;if(typeof t.type=="function"){for(s=t.__k,i=0;s&&i<s.length;i++)s[i]&&(s[i].__=t,e=Cr(s[i],e,r));return e}t.__e!=e&&(e&&t.type&&!e.parentNode&&(e=re(t)),e=r.insertBefore(t.__e,e||null));do e=e&&e.nextSibling;while(e!=null&&e.nodeType==8);return e}function gs(t,e,r,s){var i,n,o,l=t.key,d=t.type,h=e[r],u=h!=null&&(2&h.__u)==0;if(h===null&&l==null||u&&l==h.key&&d==h.type)return r;if(s>(u?1:0)){for(i=r-1,n=r+1;i>=0||n<e.length;)if((h=e[o=i>=0?i--:n++])!=null&&(2&h.__u)==0&&l==h.key&&d==h.type)return o}return-1}function Rt(t,e,r){e[0]=="-"?t.setProperty(e,r??""):t[e]=r==null?"":typeof r!="number"||fs.test(e)?r:r+"px"}function Te(t,e,r,s,i){var n,o;e:if(e=="style")if(typeof r=="string")t.style.cssText=r;else{if(typeof s=="string"&&(t.style.cssText=s=""),s)for(e in s)r&&e in r||Rt(t.style,e,"");if(r)for(e in r)s&&r[e]==s[e]||Rt(t.style,e,r[e])}else if(e[0]=="o"&&e[1]=="n")n=e!=(e=e.replace(Mr,"$1")),o=e.toLowerCase(),e=o in t||e=="onFocusOut"||e=="onFocusIn"?o.slice(2):e.slice(2),t.l||(t.l={}),t.l[e+n]=r,r?s?r[$e]=s[$e]:(r[$e]=gt,t.addEventListener(e,n?ut:ht,n)):t.removeEventListener(e,n?ut:ht,n);else{if(i=="http://www.w3.org/2000/svg")e=e.replace(/xlink(H|:h)/,"h").replace(/sName$/,"s");else if(e!="width"&&e!="height"&&e!="href"&&e!="list"&&e!="form"&&e!="tabIndex"&&e!="download"&&e!="rowSpan"&&e!="colSpan"&&e!="role"&&e!="popover"&&e in t)try{t[e]=r??"";break e}catch{}typeof r=="function"||(r==null||r===!1&&e[4]!="-"?t.removeAttribute(e):t.setAttribute(e,e=="popover"&&r==1?"":r))}}function Ht(t){return function(e){if(this.l){var r=this.l[e.type+t];if(e[Ue]==null)e[Ue]=gt++;else if(e[Ue]<r[$e])return;return r(P.event?P.event(e):e)}}}function $t(t,e,r,s,i,n,o,l,d,h){var u,p,c,f,g,A,v,b,m,y,C,W,k,V,Ce,tt,L=e.type;if(e.constructor!==void 0)return null;128&r.__u&&(d=!!(32&r.__u),n=[l=e.__e=r.__e]),(u=P.__b)&&u(e);e:if(typeof L=="function"){p=o.length;try{if(m=e.props,y=L.prototype&&L.prototype.render,C=(u=L.contextType)&&s[u.__c],W=u?C?C.props.value:u.__:s,r.__c?b=(c=e.__c=r.__c).__=c.__E:(y?e.__c=c=new L(m,W):(e.__c=c=new Ie(m,W),c.constructor=L,c.render=$s),C&&C.sub(c),c.state||(c.state={}),c.__n=s,f=c.__d=!0,c.__h=[],c._sb=[]),y&&c.__s==null&&(c.__s=c.state),y&&L.getDerivedStateFromProps!=null&&(c.__s==c.state&&(c.__s=O({},c.__s)),O(c.__s,L.getDerivedStateFromProps(m,c.__s))),g=c.props,A=c.state,c.__v=e,f)y&&L.getDerivedStateFromProps==null&&c.componentWillMount!=null&&c.componentWillMount(),y&&c.componentDidMount!=null&&c.__h.push(c.componentDidMount);else{if(y&&L.getDerivedStateFromProps==null&&m!==g&&c.componentWillReceiveProps!=null&&c.componentWillReceiveProps(m,W),e.__v==r.__v||!c.__e&&c.shouldComponentUpdate!=null&&c.shouldComponentUpdate(m,c.__s,W)===!1){e.__v!=r.__v&&(c.props=m,c.state=c.__s,c.__d=!1),e.__e=r.__e,e.__k=r.__k,e.__k.some(function(oe){oe&&(oe.__=e)}),Oe.push.apply(c.__h,c._sb),c._sb=[],c.__h.length&&o.push(c),l=re(r);break e}c.componentWillUpdate!=null&&c.componentWillUpdate(m,c.__s,W),y&&c.componentDidUpdate!=null&&c.__h.push(function(){c.componentDidUpdate(g,A,v)})}if(c.context=W,c.props=m,c.__P=t,c.__e=!1,k=P.__r,V=0,y)c.state=c.__s,c.__d=!1,k&&k(e),u=c.render(c.props,c.state,c.context),Oe.push.apply(c.__h,c._sb),c._sb=[];else do c.__d=!1,k&&k(e),u=c.render(c.props,c.state,c.context),c.state=c.__s;while(c.__d&&++V<25);c.state=c.__s,c.getChildContext!=null&&(s=O(O({},s),c.getChildContext())),y&&!f&&c.getSnapshotBeforeUpdate!=null&&(v=c.getSnapshotBeforeUpdate(g,A)),Ce=u!=null&&u.type===U&&u.key==null?Nr(u.props.children):u,l=xr(t,Qe(Ce)?Ce:[Ce],e,r,s,i,n,o,l,d,h),c.base=e.__e,e.__u&=-161,c.__h.length&&o.push(c),b&&(c.__E=c.__=null)}catch(oe){if(o.length=p,e.__v=null,d||n!=null){if(oe.then){for(e.__u|=d?160:128;l&&l.nodeType==8&&l.nextSibling;)l=l.nextSibling;n!=null&&(n[n.indexOf(l)]=null),e.__e=l}else if(n!=null)for(tt=n.length;tt--;)vt(n[tt])}else e.__e=r.__e;e.__k==null&&(e.__k=r.__k||[]),oe.then||Tr(e),P.__e(oe,e,r)}}else n==null&&e.__v==r.__v?(e.__k=r.__k,e.__e=r.__e):l=e.__e=vs(r.__e,e,r,s,i,n,o,d,h);return(u=P.diffed)&&u(e),128&e.__u?void 0:l}function Tr(t){t&&(t.__c&&(t.__c.__e=!0),t.__k&&t.__k.some(Tr))}function Dr(t,e,r){for(var s=0;s<r.length;s++)yt(r[s],r[++s],r[++s]);P.__c&&P.__c(e,t),t.some(function(i){try{t=i.__h,i.__h=[],t.some(function(n){n.call(i)})}catch(n){P.__e(n,i.__v)}})}function Nr(t){return typeof t!="object"||t==null||t.__b>0?t:Qe(t)?t.map(Nr):t.constructor!==void 0?null:O({},t)}function vs(t,e,r,s,i,n,o,l,d){var h,u,p,c,f,g,A,v=r.props||Fe,b=e.props,m=e.type;if(m=="svg"?i="http://www.w3.org/2000/svg":m=="math"?i="http://www.w3.org/1998/Math/MathML":i||(i="http://www.w3.org/1999/xhtml"),n!=null){for(h=0;h<n.length;h++)if((f=n[h])&&"setAttribute"in f==!!m&&(m?f.localName==m:f.nodeType==3)){t=f,n[h]=null;break}}if(t==null){if(m==null)return document.createTextNode(b);t=document.createElementNS(i,m,b.is&&b),l&&(P.__m&&P.__m(e,n),l=!1),n=null}if(m==null)v===b||l&&t.data==b||(t.data=b);else{if(n=m=="textarea"&&b.defaultValue!=null?null:n&&Ve.call(t.childNodes),!l&&n!=null)for(v={},h=0;h<t.attributes.length;h++)v[(f=t.attributes[h]).name]=f.value;for(h in v)f=v[h],h=="dangerouslySetInnerHTML"?p=f:h=="children"||h in b||h=="value"&&"defaultValue"in b||h=="checked"&&"defaultChecked"in b||Te(t,h,null,f,i);for(h in b)f=b[h],h=="children"?c=f:h=="dangerouslySetInnerHTML"?u=f:h=="value"?g=f:h=="checked"?A=f:l&&typeof f!="function"||v[h]===f||Te(t,h,f,v[h],i);if(u)l||p&&(u.__html==p.__html||u.__html==t.innerHTML)||(t.innerHTML=u.__html),e.__k=[];else if(p&&(t.innerHTML=""),xr(e.type=="template"?t.content:t,Qe(c)?c:[c],e,r,s,m=="foreignObject"?"http://www.w3.org/1999/xhtml":i,n,o,n?n[0]:r.__k&&re(r,0),l,d),n!=null)for(h=n.length;h--;)vt(n[h]);l&&m!="textarea"||(h="value",m=="progress"&&g==null?t.removeAttribute("value"):g!=null&&(g!==t[h]||m=="progress"&&!g||m=="option"&&g!=v[h])&&Te(t,h,g,v[h],i),h="checked",A!=null&&A!=t[h]&&Te(t,h,A,v[h],i))}return t}function yt(t,e,r){try{if(typeof t=="function"){var s=typeof t.__u=="function";s&&t.__u(),s&&e==null||(t.__u=t(e))}else t.current=e}catch(i){P.__e(i,r)}}function Wr(t,e,r){var s,i;if(P.unmount&&P.unmount(t),(s=t.ref)&&(s.current&&s.current!=t.__e||yt(s,null,e)),(s=t.__c)!=null){if(s.componentWillUnmount)try{s.componentWillUnmount()}catch(n){P.__e(n,e)}s.base=s.__P=s.__n=null}if(s=t.__k)for(i=0;i<s.length;i++)s[i]&&Wr(s[i],e,r||typeof t.type!="function");r||vt(t.__e),t.__c=t.__=t.__e=void 0}function $s(t,e,r){return this.constructor(t,r)}function ys(t,e,r){var s,i,n,o;e==document&&(e=document.documentElement),P.__&&P.__(t,e),i=(s=!1)?null:e.__k,n=[],o=[],$t(e,t=e.__k=ms(U,null,[t]),i||Fe,Fe,e.namespaceURI,i?null:e.firstChild?Ve.call(e.childNodes):null,n,i?i.__e:e.firstChild,s,o),Dr(n,t,o),t.props.children=null}Ve=Oe.slice,P={__e:function(t,e,r,s){for(var i,n,o;e=e.__;)if((i=e.__c)&&!i.__)try{if((n=i.constructor)&&n.getDerivedStateFromError!=null&&(i.setState(n.getDerivedStateFromError(t)),o=i.__d),i.componentDidCatch!=null&&(i.componentDidCatch(t,s||{}),o=i.__d),o)return i.__E=i}catch(l){t=l}throw t}},Ar=0,Ie.prototype.setState=function(t,e){var r;r=this.__s!=null&&this.__s!=this.state?this.__s:this.__s=O({},this.state),typeof t=="function"&&(t=t(O({},r),this.props)),t&&O(r,t),t!=null&&this.__v&&(e&&this._sb.push(e),It(this))},Ie.prototype.forceUpdate=function(t){this.__v&&(this.__e=!0,t&&this.__h.push(t),It(this))},Ie.prototype.render=U,q=[],kr=typeof Promise=="function"?Promise.prototype.then.bind(Promise.resolve()):setTimeout,Pr=function(t,e){return t.__v.__b-e.__v.__b},qe.__r=0,rt=Math.random().toString(8),Ue="__d"+rt,$e="__a"+rt,Mr=/(PointerCapture)$|Capture$/i,gt=0,ht=Ht(!1),ut=Ht(!0);var ws=0;function a(t,e,r,s,i,n){e||(e={});var o,l,d=e;if("ref"in d)for(l in d={},e)l=="ref"?o=e[l]:d[l]=e[l];var h={type:t,props:d,key:r,ref:o,__k:null,__:null,__b:0,__e:null,__c:null,constructor:void 0,__v:--ws,__i:-1,__u:0,__source:i,__self:n};if(typeof t=="function"&&(o=t.defaultProps))for(l in o)d[l]===void 0&&(d[l]=o[l]);return P.vnode&&P.vnode(h),h}var de,E,st,Lt,Ae=0,Ur=[],T=P,Ft=T.__b,Ot=T.__r,qt=T.diffed,zt=T.__c,jt=T.unmount,Vt=T.__;function Ke(t,e){T.__h&&T.__h(E,t,Ae||e),Ae=0;var r=E.__H||(E.__H={__:[],__h:[]});return t>=r.__.length&&r.__.push({}),r.__[t]}function $(t){return Ae=1,Ss(Ir,t)}function Ss(t,e,r){var s=Ke(de++,2);if(s.t=t,!s.__c&&(s.__=[Ir(void 0,e),function(l){var d=s.__N?s.__N[0]:s.__[0],h=s.t(d,l);d!==h&&(s.__N=[h,s.__[1]],s.__c.setState({}))}],s.__c=E,!E.__f)){var i=function(l,d,h){if(!s.__c.__H)return!0;var u=!1,p=s.__c.props!==l;if(s.__c.__H.__.some(function(f){if(f.__N){u=!0;var g=f.__[0];f.__=f.__N,f.__N=void 0,g!==f.__[0]&&(p=!0)}}),n){var c=n.call(this,l,d,h);return u?c||p:c}return!u||p};E.__f=!0;var n=E.shouldComponentUpdate,o=E.componentWillUpdate;E.componentWillUpdate=function(l,d,h){if(this.__e){var u=n;n=void 0,i(l,d,h),n=u}o&&o.call(this,l,d,h)},E.shouldComponentUpdate=i}return s.__N||s.__}function H(t,e){var r=Ke(de++,3);!T.__s&&Br(r.__H,e)&&(r.__=t,r.u=e,E.__H.__h.push(r))}function se(t){return Ae=5,Ge(function(){return{current:t}},[])}function Ge(t,e){var r=Ke(de++,7);return Br(r.__H,e)&&(r.__=t(),r.__H=e,r.__h=t),r.__}function D(t,e){return Ae=8,Ge(function(){return t},e)}function wt(){var t=Ke(de++,11);if(!t.__){for(var e=E.__v;e!==null&&!e.__m&&e.__!==null;)e=e.__;var r=e.__m||(e.__m=[0,0]);t.__="P"+r[0]+"-"+r[1]++}return t.__}function As(){for(var t;t=Ur.shift();){var e=t.__H;if(t.__P&&e)try{e.__h.some(Re),e.__h.some(pt),e.__h=[]}catch(r){e.__h=[],T.__e(r,t.__v)}}}T.__b=function(t){E=null,Ft&&Ft(t)},T.__=function(t,e){t&&e.__k&&e.__k.__m&&(t.__m=e.__k.__m),Vt&&Vt(t,e)},T.__r=function(t){Ot&&Ot(t),de=0;var e=(E=t.__c).__H;e&&(st===E?(e.__h=[],E.__h=[],e.__.some(function(r){r.__N&&(r.__=r.__N),r.u=r.__N=void 0})):(e.__h.some(Re),e.__h.some(pt),e.__h=[],de=0)),st=E},T.diffed=function(t){qt&&qt(t);var e=t.__c;e&&e.__H&&(e.__H.__h.length&&(Ur.push(e)!==1&&Lt===T.requestAnimationFrame||((Lt=T.requestAnimationFrame)||ks)(As)),e.__H.__.some(function(r){r.u&&(r.__H=r.u,r.u=void 0)})),st=E=null},T.__c=function(t,e){e.some(function(r){try{r.__h.some(Re),r.__h=r.__h.filter(function(s){return!s.__||pt(s)})}catch(s){e.some(function(i){i.__h&&(i.__h=[])}),e=[],T.__e(s,r.__v)}}),zt&&zt(t,e)},T.unmount=function(t){jt&&jt(t);var e,r=t.__c;r&&r.__H&&(r.__H.__.some(function(s){try{Re(s)}catch(i){e=i}}),r.__H=void 0,e&&T.__e(e,r.__v))};var Qt=typeof requestAnimationFrame=="function";function ks(t){var e,r=function(){clearTimeout(s),Qt&&cancelAnimationFrame(e),setTimeout(t)},s=setTimeout(r,35);Qt&&(e=requestAnimationFrame(r))}function Re(t){var e=E,r=t.__c;typeof r=="function"&&(t.__c=void 0,r()),E=e}function pt(t){var e=E;t.__c=t.__(),E=e}function Br(t,e){return!t||t.length!==e.length||e.some(function(r,s){return r!==t[s]})}function Ir(t,e){return typeof e=="function"?e(t):e}function Ps({tabs:t,active:e,onSelect:r}){return a("nav",{class:"tab-bar",role:"tablist","aria-label":"Sections",children:t.map(s=>a("button",{type:"button",role:"tab",id:`tab-${s.id}`,"aria-selected":s.id===e,"aria-controls":`panel-${s.id}`,class:s.id===e?"active":void 0,onClick:()=>r(s.id),children:s.label},s.id))})}function Ms(){const t=se(null);return H(()=>{const e=document.createElement("edc-config-backup-page");return e.setAttribute("device-name","Newton"),e.setAttribute("archive-file-name","newton-config.zip"),e.setAttribute("bin-file-name","config.bin"),t.current?.append(e),()=>e.remove()},[]),a("div",{ref:t})}const _={mqtt:{hostMax:63,portMin:1,portMax:65535,loginMax:31,passwordMax:31,haDiscoveryPrefixMax:63,topicPrefixMax:46},modbus:{speeds:[1200,2400,4800,9600,19200,38400,57600,115200],addressMin:1,addressMax:254},warmFloor:{setPointMin:16,setPointMax:40},lights:{brightnessMin:0,brightnessMax:100,tempColorMin:2700,tempColorMax:6e3,rgbMin:0,rgbMax:255}},Rr="Device returned an empty response. Check the device logs and try again.",Je="Device returned an empty response.",Hr="Could not reach the device. Check that you are connected to its network and try again.",De={};function Lr(){return{ok:!1,message:Hr}}function Es(t){try{const e=JSON.parse(t);if(e&&typeof e=="object"&&"message"in e){const r=e.message;if(typeof r=="string"&&r)return r}}catch{}}async function Fr(t){let e=`Request failed (HTTP ${t.status}).`;try{const r=await t.text();r&&(e=Es(r)??e)}catch{}return{ok:!1,status:t.status,message:e}}async function fe(t,e){let r;try{r=await fetch(t,{headers:{Accept:"application/json"}})}catch{return Lr()}if(!r.ok)return Fr(r);let s;try{s=await r.text()}catch{return{ok:!1,status:r.status,message:Hr}}if(!s.trim())return{ok:!1,status:r.status,message:e};try{return{ok:!0,data:JSON.parse(s)}}catch{return{ok:!1,status:r.status,message:e}}}async function Or(t,e){let r;try{r=await fetch(t,e)}catch{return Lr()}if(!r.ok)return Fr(r);let s="";try{s=await r.text()}catch{return{ok:!0,data:De}}if(!s.trim())return{ok:!0,data:De};try{const i=JSON.parse(s);return{ok:!0,data:i&&typeof i=="object"?i:De}}catch{return{ok:!0,data:De}}}function xe(t,e){return Or(t,{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded;charset=UTF-8"},body:e.toString()})}function me(t,e,r,s=!1){if(typeof t!="string")throw new Error(`${e} is required.`);if(!s&&t.length===0)throw new Error(`${e} must not be empty.`);if(t.length>r)throw new Error(`${e} must be at most ${r} characters.`);return t}function I(t,e,r,s){if(typeof t!="number"||!Number.isFinite(t))throw new Error(`${e} must be a number.`);if(t<r||t>s)throw new Error(`${e} must be between ${r} and ${s}.`);return t}function xs(t,e,r){if(typeof t!="number"||!Number.isFinite(t))throw new Error(`${e} must be a number.`);if(!r.includes(t))throw new Error(`${e} must be one of: ${r.join(", ")}.`);return t}function Cs(){return fe("/api/status",Je)}function qr(){return fe("/healthcheck/healty",Je)}function Ts(){return fe("/healthcheck/ready",Je)}function Ds(){return fe("/api/settings/modbus",Rr)}function Ns(){return fe("/api/settings/mqtt",Rr)}function zr(){return fe("/api/sensors",Je)}function Ws(t){const e=xs(t.modbusSpeed,"Modbus speed",_.modbus.speeds),r=I(t.addressWBMSW,"WB-MSW address",_.modbus.addressMin,_.modbus.addressMax),s=I(t.addressWBLED1,"WB-LED 1 address",_.modbus.addressMin,_.modbus.addressMax),i=I(t.addressWBLED2,"WB-LED 2 address",_.modbus.addressMin,_.modbus.addressMax),n=I(t.addressWBM1W2,"WB-M1W2 address",_.modbus.addressMin,_.modbus.addressMax),o=I(t.addressMTD262MB,"MTD262MB address",_.modbus.addressMin,_.modbus.addressMax),l=new URLSearchParams;return l.set("modbusSpeed",String(e)),l.set("addressWBMSW",String(r)),l.set("addressWBLED1",String(s)),l.set("addressWBLED2",String(i)),l.set("addressWBM1W2",String(n)),l.set("addressMTD262MB",String(o)),xe("/api/settings/modbus",l)}function Us(t){const e=me(t.host,"MQTT host",_.mqtt.hostMax),r=I(t.port,"MQTT port",_.mqtt.portMin,_.mqtt.portMax),s=me(t.login,"MQTT login",_.mqtt.loginMax,!0),i=me(t.password,"MQTT password",_.mqtt.passwordMax,!0),n=me(t.haDiscoveryPrefix,"HA discovery prefix",_.mqtt.haDiscoveryPrefixMax),o=me(t.topicPrefix,"MQTT topic prefix",_.mqtt.topicPrefixMax),l=new URLSearchParams;return l.set("host",e),l.set("port",String(r)),l.set("login",s),l.set("password",i),l.set("haDiscoveryPrefix",n),l.set("mqttIsHADiscovery",t.mqttIsHADiscovery?"true":"false"),l.set("topicPrefix",o),xe("/api/settings/mqtt",l)}function Bs(t){const e=new URLSearchParams;if(t.warmFloorMode!==void 0){if(t.warmFloorMode!=="off"&&t.warmFloorMode!=="heat")throw new Error('Mode must be "off" or "heat".');e.set("warmFloorMode",t.warmFloorMode)}if(t.warmFloorSetPoint!==void 0){const r=I(t.warmFloorSetPoint,"Setpoint",_.warmFloor.setPointMin,_.warmFloor.setPointMax);e.set("warmFloorSetPoint",String(r))}if(!e.has("warmFloorMode")&&!e.has("warmFloorSetPoint"))throw new Error("Nothing to save: provide a mode and/or a setpoint.");return xe("/api/warm_floor/set",e)}function Kt(t){if(t.light!=="main"&&t.light!=="back")throw new Error('Light must be "main" or "back".');const e=new URLSearchParams;if(e.set("light",t.light),t.enabled!==void 0){if(typeof t.enabled!="boolean")throw new Error("Enabled must be true or false.");e.set("enabled",t.enabled?"on":"off")}if(t.brightness!==void 0){const r=I(t.brightness,"Brightness",_.lights.brightnessMin,_.lights.brightnessMax);if(!Number.isInteger(r))throw new Error("Brightness must be an integer.");e.set("brightness",String(r))}if(t.tempColor!==void 0){const r=I(t.tempColor,"Color temperature",_.lights.tempColorMin,_.lights.tempColorMax);if(!Number.isInteger(r))throw new Error("Color temperature must be an integer.");e.set("tempColor",String(r))}if(t.color!==void 0){if(t.light==="main")throw new Error("The main light has no color control.");const r=I(t.color.r,"Red",_.lights.rgbMin,_.lights.rgbMax),s=I(t.color.g,"Green",_.lights.rgbMin,_.lights.rgbMax),i=I(t.color.b,"Blue",_.lights.rgbMin,_.lights.rgbMax);if(!Number.isInteger(r)||!Number.isInteger(s)||!Number.isInteger(i))throw new Error("Color channels must be integers.");e.set("color",`${r},${s},${i}`)}if(!e.has("enabled")&&!e.has("brightness")&&!e.has("tempColor")&&!e.has("color"))throw new Error("Nothing to send: provide a control value.");return xe("/api/light/set",e)}function Is(t){if(typeof t.enabled!="boolean")throw new Error("Enabled must be true or false.");const e=new URLSearchParams;return e.set("enabled",t.enabled?"true":"false"),xe("/api/light_automation/set",e)}function Rs(){return Or("/api/reboot",{method:"POST"})}function x({kind:t="info",message:e,onClose:r}){return a("div",{class:`banner banner-${t}`,role:"status",children:[a("span",{children:e}),r?a("button",{type:"button",class:"banner-close","aria-label":"Dismiss",onClick:r,children:"×"}):null]})}function Hs(t){switch(t){case"primary":return"btn btn-primary";case"danger":return"btn btn-danger";default:return"btn"}}function N({children:t,variant:e="default",type:r="button",disabled:s,title:i,onClick:n}){return a("button",{type:r,class:Hs(e),disabled:s,title:i,onClick:n,children:t})}function Ls(t){return a(N,{...t,variant:"danger"})}function R({title:t,children:e,class:r}){return a("section",{class:r?`card ${r}`:"card",children:[t?a("h2",{children:t}):null,e]})}function B({label:t,value:e,onInput:r,type:s="text",name:i,placeholder:n,maxLength:o,min:l,max:d,step:h,error:u,help:p,disabled:c,required:f,autoComplete:g,inputMode:A}){const v=wt();return a("label",{class:"field",for:v,children:[a("span",{class:"field-label",children:t}),a("input",{id:v,name:i,type:s,value:e,placeholder:n,maxLength:o,min:l,max:d,step:h,disabled:c,required:f,autoComplete:g,inputMode:A,onInput:m=>{r?.(m.currentTarget.value)},"aria-invalid":u?!0:void 0}),p&&!u?a("span",{class:"field-help",children:p}):null,u?a("span",{class:"field-error",children:u}):null]})}function jr({label:t,value:e,options:r,onChange:s,error:i,help:n,disabled:o,required:l,name:d}){const h=wt(),u=p=>{s?.(p.currentTarget.value)};return a("label",{class:"field",for:h,children:[a("span",{class:"field-label",children:t}),a("select",{id:h,name:d,value:String(e),disabled:o,required:l,onChange:u,"aria-invalid":i?!0:void 0,children:r.map(p=>a("option",{value:p.value,disabled:p.disabled,children:p.label},p.value))}),n&&!i?a("span",{class:"field-help",children:n}):null,i?a("span",{class:"field-error",children:i}):null]})}const Fs=5e3,Os=300,Gt=700,qs=1500,it="4000";function nt(t,e,r){const s=i=>i.toString(16).padStart(2,"0");return`#${s(t)}${s(e)}${s(r)}`}function zs(t){const e=/^#?([0-9a-fA-F]{6})$/.exec(t.trim());if(!e)return null;const r=parseInt(e[1],16);return{r:r>>16&255,g:r>>8&255,b:r&255}}function js({snapshot:t,scheduleRefetch:e,beginSave:r,endSave:s}){const[i,n]=$(t.warmFloor.mode),[o,l]=$(()=>String(t.warmFloor.setPoint)),[d,h]=$(!1),[u,p]=$(null),c=se({mode:t.warmFloor.mode,setPoint:String(t.warmFloor.setPoint)});H(()=>{const v=c.current,b={mode:t.warmFloor.mode,setPoint:String(t.warmFloor.setPoint)};i===v.mode&&i!==b.mode&&n(b.mode),o===v.setPoint&&o!==b.setPoint&&l(b.setPoint),c.current=b},[t.warmFloor,i,o]);const f=Number(o),g=i!==t.warmFloor.mode||f!==t.warmFloor.setPoint,A=D(async v=>{v.preventDefault(),p(null);const b={};if(i!==t.warmFloor.mode&&(b.warmFloorMode=i),!Number.isFinite(f)||f<_.warmFloor.setPointMin||f>_.warmFloor.setPointMax){p(`Setpoint must be between ${_.warmFloor.setPointMin} and ${_.warmFloor.setPointMax}.`);return}if(f!==t.warmFloor.setPoint&&(b.warmFloorSetPoint=f),!(b.warmFloorMode===void 0&&b.warmFloorSetPoint===void 0)){r(),h(!0);try{const m=await Bs(b);m.ok?e(Os):p(m.message)}catch(m){p(m instanceof Error?m.message:String(m))}finally{h(!1),s()}}},[i,f,t.warmFloor,e,r,s]);return a(R,{title:"Warm floor",children:[a("dl",{class:"kv",children:[a("dt",{children:"Current temperature"}),a("dd",{class:t.warmFloor.currentTemperatureAvailable?void 0:"muted",children:t.warmFloor.currentTemperatureAvailable?`${t.warmFloor.currentTemperature.toFixed(1)} °C`:"no data"}),a("dt",{children:"Heating"}),a("dd",{children:a("span",{class:t.warmFloor.heating?"badge badge-on":"badge badge-off",children:t.warmFloor.heating?"Heating":"Idle"})})]}),a("form",{onSubmit:A,novalidate:!0,children:[a(jr,{label:"Mode",value:i,options:[{value:"off",label:"Off"},{value:"heat",label:"Heat"}],onChange:v=>n(v),disabled:d}),a(B,{label:"Setpoint (°C)",value:o,onInput:l,type:"number",min:_.warmFloor.setPointMin,max:_.warmFloor.setPointMax,step:.5,inputMode:"decimal",help:"Between 16 and 40 °C.",disabled:d}),u?a(x,{kind:"error",message:u,onClose:()=>p(null)}):null,a("div",{class:"form-actions",children:a(N,{type:"submit",variant:"primary",disabled:d||!g,children:d?"Saving…":"Save"})})]})]})}function Vs({light:t,scheduleRefetch:e,beginSave:r,endSave:s}){const[i,n]=$(()=>String(t.brightness)),[o,l]=$(()=>t.temperatureAvailable?String(t.temperature):it),[d,h]=$(()=>t.hasColor&&t.colorAvailable?nt(t.colorR,t.colorG,t.colorB):"#ffffff"),[u,p]=$(!1),[c,f]=$(null),g=se({brightness:String(t.brightness),temperature:t.temperatureAvailable?String(t.temperature):it,color:t.hasColor&&t.colorAvailable?nt(t.colorR,t.colorG,t.colorB):"#ffffff"});H(()=>{const m=g.current,y={brightness:String(t.brightness),temperature:t.temperatureAvailable?String(t.temperature):it,color:t.hasColor&&t.colorAvailable?nt(t.colorR,t.colorG,t.colorB):"#ffffff"};i===m.brightness&&i!==y.brightness&&n(y.brightness),t.temperatureAvailable&&o===m.temperature&&o!==y.temperature&&l(y.temperature),t.hasColor&&t.colorAvailable&&d===m.color&&d!==y.color&&h(y.color),g.current=y},[t,i,o,d]);const A=D(async()=>{f(null),r(),p(!0);try{const m=await Kt({light:t.id,enabled:!t.enabled});m.ok?e(Gt):f(m.message)}catch(m){f(m instanceof Error?m.message:String(m))}finally{p(!1),s()}},[t.id,t.enabled,e,r,s]),v=D(async m=>{m.preventDefault(),f(null);const y=Number(i);if(i.trim()===""||!Number.isInteger(y)||y<_.lights.brightnessMin||y>_.lights.brightnessMax){f(`Brightness must be an integer between ${_.lights.brightnessMin} and ${_.lights.brightnessMax}.`);return}const C=Number(o);if(o.trim()===""||!Number.isInteger(C)||C<_.lights.tempColorMin||C>_.lights.tempColorMax){f(`Color temperature must be an integer between ${_.lights.tempColorMin} and ${_.lights.tempColorMax} K.`);return}const W={light:t.id};if(y!==t.brightness&&(W.brightness=y),(o!==g.current.temperature||t.temperatureAvailable&&C!==t.temperature)&&(W.tempColor=C),t.hasColor){const k=zs(d);if(!k){f("Invalid color.");return}(k.r!==t.colorR||k.g!==t.colorG||k.b!==t.colorB)&&(W.color=k)}if(!(W.brightness===void 0&&W.tempColor===void 0&&W.color===void 0)){r(),p(!0);try{const k=await Kt(W);k.ok?e(Gt):f(k.message)}catch(k){f(k instanceof Error?k.message:String(k))}finally{p(!1),s()}}},[t,i,o,d,e,r,s]),b=m=>{h(m.currentTarget.value)};return a(R,{title:t.name,children:[a("div",{class:"row",children:[a("span",{class:t.enabledAvailable&&t.enabled?"badge badge-on":"badge badge-off",children:t.enabledAvailable?t.enabled?"On":"Off":"no data"}),a(N,{onClick:()=>{A()},disabled:u,children:t.enabled?"Turn off":"Turn on"})]}),a("form",{onSubmit:v,novalidate:!0,children:[a(B,{label:"Brightness (0-100)",value:i,onInput:n,type:"number",min:_.lights.brightnessMin,max:_.lights.brightnessMax,inputMode:"numeric",help:t.brightnessAvailable?void 0:"Current value not available.",disabled:u}),a(B,{label:"Color temperature (K)",value:o,onInput:l,type:"number",min:_.lights.tempColorMin,max:_.lights.tempColorMax,step:100,inputMode:"numeric",help:t.temperatureAvailable?void 0:"Current value not available.",disabled:u}),t.hasColor?a("div",{class:"field",children:[a("span",{class:"field-label",children:"Color"}),a("div",{class:"color-picker",children:[a("input",{type:"color",value:d,disabled:u,"aria-label":"Color",onInput:b}),a("span",{class:"mono",children:d.toUpperCase()})]}),t.colorAvailable?null:a("span",{class:"field-help",children:"Current color not available."})]}):null,c?a(x,{kind:"error",message:c,onClose:()=>f(null)}):null,a("div",{class:"form-actions",children:a(N,{type:"submit",variant:"primary",disabled:u,children:u?"Saving…":"Save"})})]})]})}function Qs({snapshot:t,scheduleRefetch:e,beginSave:r,endSave:s}){const[i,n]=$(!1),[o,l]=$(null),d=t.nightMode.available,h=t.nightMode.value,u=D(async p=>{l(null),r(),n(!0);try{const c=await Is({enabled:p});c.ok?e(qs):l(c.message)}catch(c){l(c instanceof Error?c.message:String(c))}finally{n(!1),s()}},[e,r,s]);return a(R,{title:"Night mode",children:[a("div",{class:"row",children:[a("span",{class:h?"badge badge-on":"badge badge-off",children:d?h?"On":"Off":"no data"}),d?a(N,{variant:"primary",onClick:()=>{u(!h)},disabled:i,children:i?"Saving…":h?"Turn off":"Turn on"}):a(U,{children:[a(N,{variant:"primary",onClick:()=>{u(!0)},disabled:i,children:"Turn on"}),a(N,{onClick:()=>{u(!1)},disabled:i,children:"Turn off"})]})]}),o?a(x,{kind:"error",message:o,onClose:()=>l(null)}):null,d?null:a("p",{class:"muted",children:"Night-mode state unknown (no MQTT echo, no boot seed); commands are still available via the explicit buttons."})]})}function Ks(){const[t,e]=$(null),[r,s]=$(null),[i,n]=$(!1),o=se(0),l=se([]),d=D(async()=>{const c=await zr();c.ok?(e(c.data),s(null)):s(c.message),n(!0)},[]);H(()=>{d();const c=window.setInterval(()=>{o.current===0&&d()},Fs);return()=>window.clearInterval(c)},[d]),H(()=>()=>{for(const c of l.current)window.clearTimeout(c)},[]);const h=D(c=>{const f=window.setTimeout(()=>{l.current=l.current.filter(g=>g!==f),d()},c);l.current.push(f)},[d]),u=D(()=>{o.current+=1},[]),p=D(()=>{o.current=Math.max(0,o.current-1)},[]);return i?a("div",{class:"stack",children:[r?a(U,{children:[a(x,{kind:"error",message:r}),a("div",{class:"form-actions",children:a(N,{onClick:()=>{d()},children:"Retry"})})]}):null,t?a(U,{children:[a(js,{snapshot:t,scheduleRefetch:h,beginSave:u,endSave:p}),t.lights.map(c=>a(Vs,{light:c,scheduleRefetch:h,beginSave:u,endSave:p},c.id)),a(Qs,{snapshot:t,scheduleRefetch:h,beginSave:u,endSave:p})]}):null,a("p",{class:"muted",children:"Control values refresh automatically every 5 seconds; after a change the device settles within about a second."})]}):a(R,{title:"Control",children:a("p",{class:"muted",children:"Loading control snapshot…"})})}function Vr(){return a(x,{kind:"info",message:"Changes are saved to flash and take effect only after a reboot."})}const Gs={modbusSpeed:"9600",addressWBMSW:"",addressWBLED1:"",addressWBLED2:"",addressWBM1W2:"",addressMTD262MB:""};function Qr(t){if(t.trim()==="")return null;const e=Number(t);return Number.isFinite(e)?e:null}function Js(t){return Object.values(t).some(e=>!!e)}function Zs(t){const e=_.modbus.speeds.map(s=>({value:String(s),label:`${s} baud`})),r=Qr(t);return r!==null&&!_.modbus.speeds.includes(r)&&e.unshift({value:t,label:`${t} (current)`}),e}function _e(t,e){const r=Qr(t);if(r===null||!Number.isInteger(r)||r<_.modbus.addressMin||r>_.modbus.addressMax)return`${e} must be an integer between ${_.modbus.addressMin} and ${_.modbus.addressMax}.`}function Ys(){const[t,e]=$(!1),[r,s]=$(null),[i,n]=$(Gs),[o,l]=$({}),[d,h]=$(!1),[u,p]=$(null),[c,f]=$(null),g=Ge(()=>Zs(i.modbusSpeed),[i.modbusSpeed]),A=D(async()=>{s(null);const m=await Ds();m.ok?n({modbusSpeed:String(m.data.modbusSpeed),addressWBMSW:String(m.data.addressWBMSW),addressWBLED1:String(m.data.addressWBLED1),addressWBLED2:String(m.data.addressWBLED2),addressWBM1W2:String(m.data.addressWBM1W2),addressMTD262MB:String(m.data.addressMTD262MB)}):s(m.message),e(!0)},[]);H(()=>{A()},[A]);const v=m=>n(y=>({...y,...m})),b=D(async m=>{m.preventDefault();const y={addressWBMSW:_e(i.addressWBMSW,"WB-MSW address"),addressWBLED1:_e(i.addressWBLED1,"WB-LED 1 address"),addressWBLED2:_e(i.addressWBLED2,"WB-LED 2 address"),addressWBM1W2:_e(i.addressWBM1W2,"WB-M1W2 address"),addressMTD262MB:_e(i.addressMTD262MB,"MTD262MB address")};if(l(y),p(null),f(null),!Js(y)){h(!0);try{const C=await Ws({modbusSpeed:Number(i.modbusSpeed),addressWBMSW:Number(i.addressWBMSW),addressWBLED1:Number(i.addressWBLED1),addressWBLED2:Number(i.addressWBLED2),addressWBM1W2:Number(i.addressWBM1W2),addressMTD262MB:Number(i.addressMTD262MB)});C.ok?p("Modbus settings saved to flash."):f(C.message)}catch(C){f(C instanceof Error?C.message:String(C))}finally{h(!1)}}},[i]);return t?a("div",{class:"stack",children:[a(Vr,{}),r?a(U,{children:[a(x,{kind:"error",message:r}),a("div",{class:"form-actions",children:a(N,{onClick:()=>{A()},children:"Retry"})})]}):null,a(R,{title:"Modbus",children:a("form",{onSubmit:b,novalidate:!0,children:[a(jr,{label:"Bus speed",value:i.modbusSpeed,options:g,onChange:m=>v({modbusSpeed:m}),help:"Applies live. Only the speeds supported by the firmware are listed.",disabled:d}),a(B,{label:"WB-MSW address",value:i.addressWBMSW,onInput:m=>v({addressWBMSW:m}),type:"number",min:_.modbus.addressMin,max:_.modbus.addressMax,inputMode:"numeric",error:o.addressWBMSW,help:"Climate / air-quality / light sensor.",disabled:d}),a(B,{label:"WB-LED 1 address",value:i.addressWBLED1,onInput:m=>v({addressWBLED1:m}),type:"number",min:_.modbus.addressMin,max:_.modbus.addressMax,inputMode:"numeric",error:o.addressWBLED1,help:"Main CCT light.",disabled:d}),a(B,{label:"WB-LED 2 address",value:i.addressWBLED2,onInput:m=>v({addressWBLED2:m}),type:"number",min:_.modbus.addressMin,max:_.modbus.addressMax,inputMode:"numeric",error:o.addressWBLED2,help:"RGBW backlight.",disabled:d}),a(B,{label:"WB-M1W2 address",value:i.addressWBM1W2,onInput:m=>v({addressWBM1W2:m}),type:"number",min:_.modbus.addressMin,max:_.modbus.addressMax,inputMode:"numeric",error:o.addressWBM1W2,help:"1-Wire warm-floor temperature.",disabled:d}),a(B,{label:"MTD262MB address",value:i.addressMTD262MB,onInput:m=>v({addressMTD262MB:m}),type:"number",min:_.modbus.addressMin,max:_.modbus.addressMax,inputMode:"numeric",error:o.addressMTD262MB,help:"Presence sensor.",disabled:d}),u?a(x,{kind:"success",message:u,onClose:()=>p(null)}):null,c?a(x,{kind:"error",message:c,onClose:()=>f(null)}):null,a("div",{class:"form-actions",children:a(N,{type:"submit",variant:"primary",disabled:d,children:d?"Saving…":"Save Modbus"})})]})})]}):a(R,{title:"Modbus",children:a("p",{class:"muted",children:"Loading Modbus settings…"})})}function Xs({label:t,checked:e,onChange:r,disabled:s,help:i,name:n}){const o=wt();return a("div",{class:"checkbox-field",children:[a("label",{class:"checkbox-label",for:o,children:[a("input",{id:o,name:n,type:"checkbox",checked:e,disabled:s,onChange:d=>{r?.(d.currentTarget.checked)}}),a("span",{children:t})]}),i?a("span",{class:"field-help",children:i}):null]})}function ei({label:t,value:e,onInput:r,maxLength:s,error:i,help:n,disabled:o,autoComplete:l}){const[d,h]=$(!1);return a("div",{class:"password-field",children:[a(B,{label:t,value:e,onInput:r,type:d?"text":"password",maxLength:s,error:i,help:n,disabled:o,autoComplete:l}),a("button",{type:"button",class:"btn reveal-toggle","aria-pressed":d,disabled:o,onClick:()=>h(u=>!u),children:d?"Hide":"Show"})]})}const ti={host:"",port:"",login:"",password:"",haDiscoveryPrefix:"",mqttIsHADiscovery:!1,topicPrefix:""};function ri(t){const e={};t.host.trim().length===0?e.host="Host is required.":t.host.length>_.mqtt.hostMax&&(e.host=`At most ${_.mqtt.hostMax} characters.`);const r=Number(t.port);return t.port.trim()===""?e.port="Port is required.":(!Number.isInteger(r)||r<1||r>65535)&&(e.port="Port must be an integer between 1 and 65535."),t.login.length>_.mqtt.loginMax&&(e.login=`At most ${_.mqtt.loginMax} characters.`),t.password.length>_.mqtt.passwordMax&&(e.password=`At most ${_.mqtt.passwordMax} characters.`),t.haDiscoveryPrefix.trim().length===0?e.haDiscoveryPrefix="Discovery prefix is required.":t.haDiscoveryPrefix.length>_.mqtt.haDiscoveryPrefixMax&&(e.haDiscoveryPrefix=`At most ${_.mqtt.haDiscoveryPrefixMax} characters.`),t.topicPrefix.trim().length===0?e.topicPrefix="Topic prefix is required.":t.topicPrefix.length>_.mqtt.topicPrefixMax&&(e.topicPrefix=`At most ${_.mqtt.topicPrefixMax} characters.`),e}function si(t){return Object.values(t).some(e=>!!e)}function ii(){const[t,e]=$(!1),[r,s]=$(null),[i,n]=$(ti),[o,l]=$({}),[d,h]=$(!1),[u,p]=$(null),[c,f]=$(null),g=D(async()=>{s(null);const b=await Ns();b.ok?n({host:b.data.host,port:String(b.data.port),login:b.data.login,password:b.data.password,haDiscoveryPrefix:b.data.haDiscoveryPrefix,mqttIsHADiscovery:b.data.mqttIsHADiscovery,topicPrefix:b.data.topicPrefix}):s(b.message),e(!0)},[]);H(()=>{g()},[g]);const A=b=>n(m=>({...m,...b})),v=D(async b=>{b.preventDefault();const m=ri(i);if(l(m),p(null),f(null),!si(m)){h(!0);try{const y=await Us({host:i.host,port:Number(i.port),login:i.login,password:i.password,haDiscoveryPrefix:i.haDiscoveryPrefix,mqttIsHADiscovery:i.mqttIsHADiscovery,topicPrefix:i.topicPrefix});y.ok?p("MQTT settings saved to flash."):f(y.message)}catch(y){f(y instanceof Error?y.message:String(y))}finally{h(!1)}}},[i]);return t?a("div",{class:"stack",children:[a(Vr,{}),r?a(U,{children:[a(x,{kind:"error",message:r}),a("div",{class:"form-actions",children:a(N,{onClick:()=>{g()},children:"Retry"})})]}):null,a(R,{title:"MQTT",children:a("form",{onSubmit:v,novalidate:!0,children:[a(B,{label:"Host",value:i.host,onInput:b=>A({host:b}),maxLength:_.mqtt.hostMax,error:o.host,autoComplete:"off",disabled:d}),a(B,{label:"Port",value:i.port,onInput:b=>A({port:b}),type:"number",min:1,max:65535,inputMode:"numeric",error:o.port,disabled:d}),a(B,{label:"Login",value:i.login,onInput:b=>A({login:b}),maxLength:_.mqtt.loginMax,error:o.login,autoComplete:"off",disabled:d}),a(ei,{label:"Password",value:i.password,onInput:b=>A({password:b}),maxLength:_.mqtt.passwordMax,error:o.password,autoComplete:"new-password",disabled:d}),a(B,{label:"HA discovery prefix",value:i.haDiscoveryPrefix,onInput:b=>A({haDiscoveryPrefix:b}),maxLength:_.mqtt.haDiscoveryPrefixMax,error:o.haDiscoveryPrefix,autoComplete:"off",disabled:d}),a(Xs,{label:"Enable Home Assistant discovery",checked:i.mqttIsHADiscovery,onChange:b=>A({mqttIsHADiscovery:b}),disabled:d}),a(B,{label:"Topic prefix",value:i.topicPrefix,onInput:b=>A({topicPrefix:b}),maxLength:_.mqtt.topicPrefixMax,error:o.topicPrefix,help:"Prefix for every MQTT entity topic (e.g. newton/<chipid>).",autoComplete:"off",disabled:d}),u?a(x,{kind:"success",message:u,onClose:()=>p(null)}):null,c?a(x,{kind:"error",message:c,onClose:()=>f(null)}):null,a("div",{class:"form-actions",children:a(N,{type:"submit",variant:"primary",disabled:d,children:d?"Saving…":"Save MQTT"})})]})})]}):a(R,{title:"MQTT",children:a("p",{class:"muted",children:"Loading MQTT settings…"})})}function ni(){const t=se(null);return H(()=>{const e=document.createElement("edn-network-page");return e.setAttribute("poll-interval-ms","5000"),t.current?.append(e),()=>e.remove()},[]),a("div",{ref:t})}const oi=5e3;function ai(t){if(typeof t.value=="boolean")return t.value?"Detected":"Clear";switch(t.id){case"temperature":case"air_quality":return t.value.toFixed(1);case"humidity":case"co2":case"light_level":return String(Math.round(t.value));default:return String(t.value)}}function li(){const[t,e]=$(null),[r,s]=$(null),[i,n]=$(!1),o=D(async()=>{const l=await zr();l.ok?(e(l.data),s(null)):s(l.message),n(!0)},[]);return H(()=>{o();const l=window.setInterval(()=>{o()},oi);return()=>window.clearInterval(l)},[o]),i?a("div",{class:"stack",children:[r?a(U,{children:[a(x,{kind:"error",message:r}),a("div",{class:"form-actions",children:a(N,{onClick:()=>{o()},children:"Retry"})})]}):null,t?a("div",{class:"sensor-grid",children:[t.sensors.map(l=>a("div",{class:`sensor-card${l.available?"":" is-unavailable"}`,children:[a("span",{class:"sensor-name",children:l.name}),l.available?a("span",{class:"sensor-value",children:[ai(l),l.unit?a("span",{class:"sensor-unit",children:l.unit}):null]}):a("span",{class:"sensor-value sensor-unavailable",children:"no data"})]},l.id)),a("div",{class:`sensor-card${t.warmFloor.currentTemperatureAvailable?"":" is-unavailable"}`,children:[a("span",{class:"sensor-name",children:"Warm floor sensor"}),t.warmFloor.currentTemperatureAvailable?a("span",{class:"sensor-value",children:[t.warmFloor.currentTemperature.toFixed(1),a("span",{class:"sensor-unit",children:"°C"})]}):a("span",{class:"sensor-value sensor-unavailable",children:"no data"})]})]}):null,a("p",{class:"muted",children:"Sensor values refresh automatically every 5 seconds."})]}):a(R,{title:"Sensors",children:a("p",{class:"muted",children:"Loading sensor snapshot…"})})}const ot=2e3,di=12e4;function ci(){const[t,e]=$("idle"),r=se(0);H(()=>{if(t!=="rebooting")return;let o=!1,l;const d=()=>{qr().then(h=>{if(!o){if(h.ok){e("ready");return}if(r.current+=1,r.current*ot>=di){e("timeout");return}l=window.setTimeout(d,ot)}})};return l=window.setTimeout(d,ot),()=>{o=!0,l!==void 0&&window.clearTimeout(l)}},[t]);const s=D(()=>{r.current=0,e("rebooting")},[]),i=D(()=>e("idle"),[]),n=D(()=>{r.current=0,e("rebooting")},[]);return Ge(()=>({phase:t,start:s,dismiss:i,retry:n}),[t,s,i,n])}function hi({flow:t}){return t.phase==="idle"?null:a("div",{class:"reboot-overlay",role:"alertdialog","aria-modal":"true","aria-label":"Device rebooting",children:a("div",{class:"reboot-dialog card",children:[a("h2",{children:"Device is rebooting"}),t.phase==="rebooting"?a(U,{children:[a("p",{children:"Waiting for the device to come back online. This usually takes 20–60 seconds."}),a("p",{class:"muted","aria-live":"polite",children:"Polling device health…"})]}):null,t.phase==="ready"?a(U,{children:[a(x,{kind:"success",message:"The device is back online."}),a("div",{class:"form-actions",children:a(N,{variant:"primary",onClick:()=>window.location.reload(),children:"Reload panel"})})]}):null,t.phase==="timeout"?a(U,{children:[a(x,{kind:"error",message:"No response after about two minutes. Check the power and network, then reload or keep waiting."}),a("div",{class:"form-actions",children:[a(N,{onClick:t.retry,children:"Keep waiting"}),a(N,{onClick:t.dismiss,children:"Dismiss"})]})]}):null]})})}const ui=1e4;function pi(t){const e=Math.max(0,Math.floor(t)),r=Math.floor(e/86400),s=Math.floor(e%86400/3600),i=Math.floor(e%3600/60),n=e%60,o=[];return r&&o.push(`${r}d`),(r||s)&&o.push(`${s}h`),(r||s||i)&&o.push(`${i}m`),o.push(`${n}s`),o.join(" ")}function fi(t){return Number.isFinite(t)?`${Math.round(t/1024)} KB (${Math.round(t)} bytes)`:String(t)}function mi(){const[t,e]=$(null),[r,s]=$(null),[i,n]=$(!1),[o,l]=$(null),[d,h]=$(null),[u,p]=$(!0),[c,f]=$(null),[g,A]=$(!1),v=ci(),b=D(async()=>{const k=await Cs();k.ok?(e(k.data),s(null)):s(k.message),n(!0)},[]),m=D(async()=>{p(!0);const[k,V]=await Promise.all([qr(),Ts()]);l(k),h(V),p(!1)},[]);H(()=>{b();const k=window.setInterval(()=>{b()},ui);return()=>window.clearInterval(k)},[b]),H(()=>{m()},[m]);const y=D(async()=>{if(!window.confirm("Reboot the device now? Automation and MQTT reporting will be offline for about 20-60 seconds."))return;f(null),A(!0);const V=await Rs();A(!1),V.ok?v.start():f(V.message)},[v.start]),C=u&&!o?a("p",{class:"muted",children:"Checking device health…"}):o?o.ok?a(x,{kind:o.data.healty?"success":"error",message:o.data.healty?"Healthcheck is OK.":"Healthcheck reports failure."}):a(x,{kind:"error",message:o.message}):null,W=d?d.ok?a(x,{kind:d.data.ready?"success":"info",message:d.data.ready?"All registered services (MQTT, warm floor) are ready.":`Not ready: ${d.data.message}`}):d.status===500?a(x,{kind:"info",message:`Not ready: ${d.message}`}):a(x,{kind:"error",message:d.message}):null;return a("div",{class:"stack",children:[a(R,{title:"Device",children:[i?r?a(U,{children:[a(x,{kind:"error",message:r}),a("div",{class:"form-actions",children:a(N,{onClick:()=>{b()},children:"Retry"})})]}):t?a("dl",{class:"kv",children:[a("dt",{children:"Wi-Fi"}),a("dd",{children:a("span",{class:t.wifiStatus==="connected"?"badge badge-on":"badge badge-off",children:t.wifiStatus})}),a("dt",{children:"Free heap"}),a("dd",{children:fi(t.freeHeap)}),a("dt",{children:"Uptime"}),a("dd",{children:pi(t.uptime)}),a("dt",{children:"Last reset reason"}),a("dd",{children:t.lastResetReason})]}):null:a("p",{class:"muted",children:"Loading status…"}),a("p",{class:"muted mt",children:"Status refreshes automatically every 10 seconds."})]}),a(R,{title:"Services",children:[C,W,a("div",{class:"form-actions",children:a(N,{onClick:()=>{m()},disabled:u,children:u?"Checking…":"Refresh health"})})]}),a(R,{title:"Maintenance",children:[a("p",{class:"muted",children:"A reboot briefly interrupts automation and MQTT reporting. Configuration changes saved on the other tabs only take effect after a reboot."}),c?a(x,{kind:"error",message:c,onClose:()=>f(null)}):null,a("div",{class:"form-actions",children:a(Ls,{onClick:()=>{y()},disabled:g||v.phase!=="idle",children:"Reboot device"})})]}),a(hi,{flow:v})]})}const _i=[{id:"status",label:"Status"},{id:"sensors",label:"Sensors"},{id:"control",label:"Control"},{id:"modbus",label:"Modbus"},{id:"mqtt",label:"MQTT"},{id:"network",label:"Network"},{id:"backup",label:"Backup"}];function bi(t){switch(t){case"status":return a(mi,{});case"sensors":return a(li,{});case"control":return a(Ks,{});case"modbus":return a(Ys,{});case"mqtt":return a(ii,{});case"network":return a(ni,{});case"backup":return a(Ms,{})}}function gi(){const[t,e]=$("status");return a(U,{children:[a("header",{class:"app-header",children:[a("div",{class:"brand",children:a("h1",{children:"Newton"})}),a("span",{class:"hint",children:"KC868-A2 controller"})]}),a(Ps,{tabs:_i,active:t,onSelect:e}),a("main",{class:"tab-content",id:`panel-${t}`,role:"tabpanel","aria-labelledby":`tab-${t}`,children:bi(t)})]})}function vi(t){if(t&&typeof t=="object"&&"error"in t){let e=t.error;if(typeof e=="string"&&e.length>0)return e}}function Kr(t={}){let e=t.baseUrl??"",r=t.headers??{};async function s(i,n){let o;try{o=await fetch(`${e}${i}`,{...n,headers:{Accept:"application/json",...n?.body===void 0?{}:{"Content-Type":"application/json"},...r}})}catch(u){return n?.signal?.aborted===!0||typeof u=="object"&&u&&u.name==="AbortError"?{ok:!1,message:"Request aborted."}:{ok:!1,message:"Network request failed. Check the device connection and try again."}}let l=await o.text().catch(()=>""),d,h=!1;if(l.length>0)try{d=JSON.parse(l),h=!0}catch{h=!1}if(!o.ok){let u=vi(d);return{ok:!1,status:o.status,message:u??`Request failed with HTTP ${o.status}.`}}return h?{ok:!0,data:d}:{ok:!1,status:o.status,message:`Unexpected response from server (HTTP ${o.status}).`}}return{getSettings(i){return s("/api/network/settings",{signal:i})},saveSettings(i,n){return s("/api/network/settings",{method:"POST",body:JSON.stringify(i),signal:n})},getStatus(i){return s("/api/network/status",{signal:i})},wifiList(i){return s("/api/wifi/list",{signal:i})}}}var He=globalThis,St=He.ShadowRoot&&(He.ShadyCSS===void 0||He.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,At=Symbol(),Jt=new WeakMap,Gr=class{constructor(e,r,s){if(this._$cssResult$=!0,s!==At)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=r}get styleSheet(){let e=this.o,r=this.t;if(St&&e===void 0){let s=r!==void 0&&r.length===1;s&&(e=Jt.get(r)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),s&&Jt.set(r,e))}return e}toString(){return this.cssText}},$i=t=>new Gr(typeof t=="string"?t:t+"",void 0,At),kt=(t,...e)=>new Gr(t.length===1?t[0]:e.reduce((r,s,i)=>r+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[i+1],t[0]),t,At),yi=(t,e)=>{if(St)t.adoptedStyleSheets=e.map(r=>r instanceof CSSStyleSheet?r:r.styleSheet);else for(let r of e){let s=document.createElement("style"),i=He.litNonce;i!==void 0&&s.setAttribute("nonce",i),s.textContent=r.cssText,t.appendChild(s)}},Zt=St?t=>t:t=>t instanceof CSSStyleSheet?(e=>{let r="";for(let s of e.cssRules)r+=s.cssText;return $i(r)})(t):t,{is:wi,defineProperty:Si,getOwnPropertyDescriptor:Ai,getOwnPropertyNames:ki,getOwnPropertySymbols:Pi,getPrototypeOf:Mi}=Object,Ze=globalThis,Yt=Ze.trustedTypes,Ei=Yt?Yt.emptyScript:"",xi=Ze.reactiveElementPolyfillSupport,ye=(t,e)=>t,ft={toAttribute(t,e){switch(e){case Boolean:t=t?Ei:null;break;case Object:case Array:t=t==null?t:JSON.stringify(t)}return t},fromAttribute(t,e){let r=t;switch(e){case Boolean:r=t!==null;break;case Number:r=t===null?null:Number(t);break;case Object:case Array:try{r=JSON.parse(t)}catch{r=null}}return r}},Jr=(t,e)=>!wi(t,e),Xt={attribute:!0,type:String,converter:ft,reflect:!1,useDefault:!1,hasChanged:Jr};Symbol.metadata??=Symbol("metadata"),Ze.litPropertyMetadata??=new WeakMap;var ae=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,r=Xt){if(r.state&&(r.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((r=Object.create(r)).wrapped=!0),this.elementProperties.set(e,r),!r.noAccessor){let s=Symbol(),i=this.getPropertyDescriptor(e,s,r);i!==void 0&&Si(this.prototype,e,i)}}static getPropertyDescriptor(e,r,s){let{get:i,set:n}=Ai(this.prototype,e)??{get(){return this[r]},set(o){this[r]=o}};return{get:i,set(o){let l=i?.call(this);n?.call(this,o),this.requestUpdate(e,l,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??Xt}static _$Ei(){if(this.hasOwnProperty(ye("elementProperties")))return;let e=Mi(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(ye("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(ye("properties"))){let r=this.properties,s=[...ki(r),...Pi(r)];for(let i of s)this.createProperty(i,r[i])}let e=this[Symbol.metadata];if(e!==null){let r=litPropertyMetadata.get(e);if(r!==void 0)for(let[s,i]of r)this.elementProperties.set(s,i)}this._$Eh=new Map;for(let[r,s]of this.elementProperties){let i=this._$Eu(r,s);i!==void 0&&this._$Eh.set(i,r)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let r=[];if(Array.isArray(e)){let s=new Set(e.flat(1/0).reverse());for(let i of s)r.unshift(Zt(i))}else e!==void 0&&r.push(Zt(e));return r}static _$Eu(e,r){let s=r.attribute;return s===!1?void 0:typeof s=="string"?s:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){let e=new Map,r=this.constructor.elementProperties;for(let s of r.keys())this.hasOwnProperty(s)&&(e.set(s,this[s]),delete this[s]);e.size>0&&(this._$Ep=e)}createRenderRoot(){let e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return yi(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,r,s){this._$AK(e,s)}_$ET(e,r){let s=this.constructor.elementProperties.get(e),i=this.constructor._$Eu(e,s);if(i!==void 0&&s.reflect===!0){let n=(s.converter?.toAttribute===void 0?ft:s.converter).toAttribute(r,s.type);this._$Em=e,n==null?this.removeAttribute(i):this.setAttribute(i,n),this._$Em=null}}_$AK(e,r){let s=this.constructor,i=s._$Eh.get(e);if(i!==void 0&&this._$Em!==i){let n=s.getPropertyOptions(i),o=typeof n.converter=="function"?{fromAttribute:n.converter}:n.converter?.fromAttribute===void 0?ft:n.converter;this._$Em=i;let l=o.fromAttribute(r,n.type);this[i]=l??this._$Ej?.get(i)??l,this._$Em=null}}requestUpdate(e,r,s,i=!1,n){if(e!==void 0){let o=this.constructor;if(i===!1&&(n=this[e]),s??=o.getPropertyOptions(e),!((s.hasChanged??Jr)(n,r)||s.useDefault&&s.reflect&&n===this._$Ej?.get(e)&&!this.hasAttribute(o._$Eu(e,s))))return;this.C(e,r,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,r,{useDefault:s,reflect:i,wrapped:n},o){s&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,o??r??this[e]),n!==!0||o!==void 0)||(this._$AL.has(e)||(this.hasUpdated||s||(r=void 0),this._$AL.set(e,r)),i===!0&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(r){Promise.reject(r)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[i,n]of this._$Ep)this[i]=n;this._$Ep=void 0}let s=this.constructor.elementProperties;if(s.size>0)for(let[i,n]of s){let{wrapped:o}=n,l=this[i];o!==!0||this._$AL.has(i)||l===void 0||this.C(i,void 0,n,l)}}let e=!1,r=this._$AL;try{e=this.shouldUpdate(r),e?(this.willUpdate(r),this._$EO?.forEach(s=>s.hostUpdate?.()),this.update(r)):this._$EM()}catch(s){throw e=!1,this._$EM(),s}e&&this._$AE(r)}willUpdate(e){}_$AE(e){this._$EO?.forEach(r=>r.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(r=>this._$ET(r,this[r])),this._$EM()}updated(e){}firstUpdated(e){}};ae.elementStyles=[],ae.shadowRootOptions={mode:"open"},ae[ye("elementProperties")]=new Map,ae[ye("finalized")]=new Map,xi?.({ReactiveElement:ae}),(Ze.reactiveElementVersions??=[]).push("2.1.2");var Pt=globalThis,er=t=>t,ze=Pt.trustedTypes,tr=ze?ze.createPolicy("lit-html",{createHTML:t=>t}):void 0,Zr="$lit$",z=`lit$${Math.random().toFixed(9).slice(2)}$`,Yr="?"+z,Ci=`<${Yr}>`,ie=document,ke=()=>ie.createComment(""),Pe=t=>t===null||typeof t!="object"&&typeof t!="function",Mt=Array.isArray,Ti=t=>Mt(t)||typeof t?.[Symbol.iterator]=="function",at=`[ 	
\f\r]`,be=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,rr=/-->/g,sr=/>/g,Q=RegExp(`>|${at}(?:([^\\s"'>=/]+)(${at}*=${at}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),ir=/'/g,nr=/"/g,Xr=/^(?:script|style|textarea|title)$/i,w=(t=>(e,...r)=>({_$litType$:t,strings:e,values:r}))(1),ce=Symbol.for("lit-noChange"),S=Symbol.for("lit-nothing"),or=new WeakMap,G=ie.createTreeWalker(ie,129);function es(t,e){if(!Mt(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return tr===void 0?e:tr.createHTML(e)}var Di=(t,e)=>{let r=t.length-1,s=[],i,n=e===2?"<svg>":e===3?"<math>":"",o=be;for(let l=0;l<r;l++){let d=t[l],h,u,p=-1,c=0;for(;c<d.length&&(o.lastIndex=c,u=o.exec(d),u!==null);)c=o.lastIndex,o===be?u[1]==="!--"?o=rr:u[1]===void 0?u[2]===void 0?u[3]!==void 0&&(o=Q):(Xr.test(u[2])&&(i=RegExp("</"+u[2],"g")),o=Q):o=sr:o===Q?u[0]===">"?(o=i??be,p=-1):u[1]===void 0?p=-2:(p=o.lastIndex-u[2].length,h=u[1],o=u[3]===void 0?Q:u[3]==='"'?nr:ir):o===nr||o===ir?o=Q:o===rr||o===sr?o=be:(o=Q,i=void 0);let f=o===Q&&t[l+1].startsWith("/>")?" ":"";n+=o===be?d+Ci:p>=0?(s.push(h),d.slice(0,p)+Zr+d.slice(p)+z+f):d+z+(p===-2?l:f)}return[es(t,n+(t[r]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),s]},mt=class ts{constructor({strings:e,_$litType$:r},s){let i;this.parts=[];let n=0,o=0,l=e.length-1,d=this.parts,[h,u]=Di(e,r);if(this.el=ts.createElement(h,s),G.currentNode=this.el.content,r===2||r===3){let p=this.el.content.firstChild;p.replaceWith(...p.childNodes)}for(;(i=G.nextNode())!==null&&d.length<l;){if(i.nodeType===1){if(i.hasAttributes())for(let p of i.getAttributeNames())if(p.endsWith(Zr)){let c=u[o++],f=i.getAttribute(p).split(z),g=/([.?@])?(.*)/.exec(c);d.push({type:1,index:n,name:g[2],strings:f,ctor:g[1]==="."?Wi:g[1]==="?"?Ui:g[1]==="@"?Bi:Ye}),i.removeAttribute(p)}else p.startsWith(z)&&(d.push({type:6,index:n}),i.removeAttribute(p));if(Xr.test(i.tagName)){let p=i.textContent.split(z),c=p.length-1;if(c>0){i.textContent=ze?ze.emptyScript:"";for(let f=0;f<c;f++)i.append(p[f],ke()),G.nextNode(),d.push({type:2,index:++n});i.append(p[c],ke())}}}else if(i.nodeType===8)if(i.data===Yr)d.push({type:2,index:n});else{let p=-1;for(;(p=i.data.indexOf(z,p+1))!==-1;)d.push({type:7,index:n}),p+=z.length-1}n++}}static createElement(e,r){let s=ie.createElement("template");return s.innerHTML=e,s}};function he(t,e,r=t,s){if(e===ce)return e;let i=s===void 0?r._$Cl:r._$Co?.[s],n=Pe(e)?void 0:e._$litDirective$;return i?.constructor!==n&&(i?._$AO?.(!1),n===void 0?i=void 0:(i=new n(t),i._$AT(t,r,s)),s===void 0?r._$Cl=i:(r._$Co??=[])[s]=i),i!==void 0&&(e=he(t,i._$AS(t,e.values),i,s)),e}var Ni=class{constructor(e,r){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=r}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){let{el:{content:r},parts:s}=this._$AD,i=(e?.creationScope??ie).importNode(r,!0);G.currentNode=i;let n=G.nextNode(),o=0,l=0,d=s[0];for(;d!==void 0;){if(o===d.index){let h;d.type===2?h=new Et(n,n.nextSibling,this,e):d.type===1?h=new d.ctor(n,d.name,d.strings,this,e):d.type===6&&(h=new Ii(n,this,e)),this._$AV.push(h),d=s[++l]}o!==d?.index&&(n=G.nextNode(),o++)}return G.currentNode=ie,i}p(e){let r=0;for(let s of this._$AV)s!==void 0&&(s.strings===void 0?s._$AI(e[r]):(s._$AI(e,s,r),r+=s.strings.length-2)),r++}},Et=class rs{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,r,s,i){this.type=2,this._$AH=S,this._$AN=void 0,this._$AA=e,this._$AB=r,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode,r=this._$AM;return r!==void 0&&e?.nodeType===11&&(e=r.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,r=this){e=he(this,e,r),Pe(e)?e===S||e==null||e===""?(this._$AH!==S&&this._$AR(),this._$AH=S):e!==this._$AH&&e!==ce&&this._(e):e._$litType$===void 0?e.nodeType===void 0?Ti(e)?this.k(e):this._(e):this.T(e):this.$(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==S&&Pe(this._$AH)?this._$AA.nextSibling.data=e:this.T(ie.createTextNode(e)),this._$AH=e}$(e){let{values:r,_$litType$:s}=e,i=typeof s=="number"?this._$AC(e):(s.el===void 0&&(s.el=mt.createElement(es(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(r);else{let n=new Ni(i,this),o=n.u(this.options);n.p(r),this.T(o),this._$AH=n}}_$AC(e){let r=or.get(e.strings);return r===void 0&&or.set(e.strings,r=new mt(e)),r}k(e){Mt(this._$AH)||(this._$AH=[],this._$AR());let r=this._$AH,s,i=0;for(let n of e)i===r.length?r.push(s=new rs(this.O(ke()),this.O(ke()),this,this.options)):s=r[i],s._$AI(n),i++;i<r.length&&(this._$AR(s&&s._$AB.nextSibling,i),r.length=i)}_$AR(e=this._$AA.nextSibling,r){for(this._$AP?.(!1,!0,r);e!==this._$AB;){let s=er(e).nextSibling;er(e).remove(),e=s}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}},Ye=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,r,s,i,n){this.type=1,this._$AH=S,this._$AN=void 0,this.element=e,this.name=r,this._$AM=i,this.options=n,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=S}_$AI(e,r=this,s,i){let n=this.strings,o=!1;if(n===void 0)e=he(this,e,r,0),o=!Pe(e)||e!==this._$AH&&e!==ce,o&&(this._$AH=e);else{let l=e,d,h;for(e=n[0],d=0;d<n.length-1;d++)h=he(this,l[s+d],r,d),h===ce&&(h=this._$AH[d]),o||=!Pe(h)||h!==this._$AH[d],h===S?e=S:e!==S&&(e+=(h??"")+n[d+1]),this._$AH[d]=h}o&&!i&&this.j(e)}j(e){e===S?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}},Wi=class extends Ye{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===S?void 0:e}},Ui=class extends Ye{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==S)}},Bi=class extends Ye{constructor(e,r,s,i,n){super(e,r,s,i,n),this.type=5}_$AI(e,r=this){if((e=he(this,e,r,0)??S)===ce)return;let s=this._$AH,i=e===S&&s!==S||e.capture!==s.capture||e.once!==s.once||e.passive!==s.passive,n=e!==S&&(s===S||i);i&&this.element.removeEventListener(this.name,this,s),n&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}},Ii=class{constructor(e,r,s){this.element=e,this.type=6,this._$AN=void 0,this._$AM=r,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(e){he(this,e)}},Ri=Pt.litHtmlPolyfillSupport;Ri?.(mt,Et),(Pt.litHtmlVersions??=[]).push("3.3.3");var Hi=(t,e,r)=>{let s=r?.renderBefore??e,i=s._$litPart$;if(i===void 0){let n=r?.renderBefore??null;s._$litPart$=i=new Et(e.insertBefore(ke(),n),n,void 0,r??{})}return i._$AI(t),i},xt=globalThis,Z=class extends ae{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){let r=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=Hi(r,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return ce}};Z._$litElement$=!0,Z.finalized=!0,xt.litElementHydrateSupport?.({LitElement:Z});var Li=xt.litElementPolyfillSupport;Li?.({LitElement:Z}),(xt.litElementVersions??=[]).push("4.2.2");var Fi={ethernet:"Ethernet",wifi:"Wi-Fi",wifi_ap:"Wi-Fi AP"};function Oi(t){return t===void 0||Number.isNaN(t)?"Unknown":t>=-55?"Excellent":t>=-67?"Good":t>=-75?"Fair":"Weak"}function qi(t){return t===1?"Full":t===0?"Half":`Unknown (${t})`}function zi(t){let e=r=>String(r).padStart(2,"0");return`${e(t.getHours())}:${e(t.getMinutes())}:${e(t.getSeconds())}`}var Y,ji=(Y=class extends Z{constructor(...e){super(...e),this.baseUrl="",this.pollIntervalMs=1e4,this.errorMessage="",this.loading=!1,this.refreshSeq=0,this.handleRetry=()=>{this.refresh()}}connectedCallback(){super.connectedCallback(),this.refresh(),this.startPolling()}disconnectedCallback(){super.disconnectedCallback(),this.stopPolling()}updated(e){e.has("pollIntervalMs")&&this.startPolling();let r=e.get("baseUrl");e.has("baseUrl")&&r!==void 0&&r!==this.baseUrl&&(this.client=void 0,this.refresh())}render(){let e=this.status;return w`
      <div class="card">
        <header class="head">
          ${e?w`<span class="badge badge-${e.mode}">${Fi[e.mode]}</span>`:w`<span class="badge badge-unknown">Unknown</span>`}
          ${e?w`<span class="state ${e.connected?"state-up":"state-down"}">
                ${e.connected?"Connected":"Disconnected"}
              </span>`:S}
          ${this.loading?w`<span class="muted loading">Refreshing…</span>`:S}
        </header>

        ${e?.fallbackAP?w`<div class="banner banner-warn" role="alert">
              Fallback AP active — the device could not reach the configured network.
            </div>`:S}
        ${this.errorMessage?w`<div class="banner banner-error" role="alert">
              <span>${this.errorMessage}</span>
              <button type="button" @click=${this.handleRetry}>Retry</button>
            </div>`:S}
        ${e?this.renderSections(e):w`<p class="muted">Loading network status…</p>`}

        <footer class="muted foot">
          ${this.lastUpdated?w`Updated ${zi(this.lastUpdated)}`:w`Waiting for data…`}
        </footer>
      </div>
    `}renderSections(e){switch(e.mode){case"wifi":return this.renderWifi(e);case"wifi_ap":return this.renderAp(e);case"ethernet":return this.renderEthernet(e)}}renderWifi(e){return w`
      <section>
        <h2>Wi-Fi</h2>
        <dl class="rows">
          ${this.row("SSID",e.ssid)}
          ${this.row("Signal",e.rssi===void 0?void 0:`${e.rssi} dBm (${Oi(e.rssi)})`)}
          ${this.row("IP address",e.ip)} ${this.row("MAC address",e.mac)}
        </dl>
      </section>
    `}renderAp(e){let r=e.ap;return w`
      <section>
        <h2>Access point</h2>
        <dl class="rows">
          ${this.row("SSID",r?.ssid)} ${this.row("IP address",r?.ip)}
          ${this.row("Stations",r?.stations)}
        </dl>
      </section>
    `}renderEthernet(e){let r=e.eth;return w`
      <section>
        <h2>Ethernet</h2>
        <dl class="rows">
          ${this.row("IP address",r?.ip)} ${this.row("MAC address",r?.mac)}
          ${this.row("Link",r===void 0?void 0:r.linkUp?"Up":"Down")}
          ${this.row("Speed",r===void 0?void 0:`${r.speed} Mbps`)}
          ${this.row("Duplex",r===void 0?void 0:qi(r.duplex))}
        </dl>
      </section>
    `}row(e,r){return r===void 0||r===""?S:w`<dt>${e}</dt>
          <dd>${r}</dd>`}ensureClient(){return(!this.client||this.clientBaseUrl!==this.baseUrl)&&(this.client=Kr({baseUrl:this.baseUrl}),this.clientBaseUrl=this.baseUrl),this.client}async refresh(){let e=++this.refreshSeq;this.loading=!0;let r=await this.ensureClient().getStatus();if(e===this.refreshSeq){if(this.loading=!1,r.ok){this.status=r.data,this.errorMessage="",this.lastUpdated=new Date;return}this.errorMessage=r.message,this.dispatchEvent(new CustomEvent("edn-error",{detail:{message:r.message},bubbles:!0,composed:!0}))}}startPolling(){this.stopPolling();let e=Number(this.pollIntervalMs);!Number.isFinite(e)||e<=0||(this.timerId=setInterval(()=>{typeof document<"u"&&document.hidden||this.refresh()},e))}stopPolling(){this.timerId!==void 0&&(clearInterval(this.timerId),this.timerId=void 0)}},Y.properties={baseUrl:{type:String,attribute:"base-url"},pollIntervalMs:{type:Number,attribute:"poll-interval-ms"},status:{state:!0},errorMessage:{state:!0},lastUpdated:{state:!0},loading:{state:!0}},Y.styles=kt`
    :host {
      display: block;
      font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
      color: #1f2430;
      --_accent: var(--edn-accent, #2563eb);
      --_danger: var(--edn-danger, #dc2626);
      --_muted: var(--edn-muted, #6b7280);
      --_border: #e2e5ea;
      --_surface: #ffffff;
    }

    .card {
      background: var(--_surface);
      border: 1px solid var(--_border);
      border-radius: 10px;
      padding: 1rem 1.25rem;
      max-width: 28rem;
      box-shadow: 0 1px 2px rgba(16, 24, 40, 0.05);
    }

    .head {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .badge {
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.03em;
      padding: 0.15rem 0.5rem;
      border-radius: 999px;
      background: #eef2ff;
      color: var(--_accent);
    }

    .badge-ethernet {
      background: #e0f2fe;
      color: #0369a1;
    }

    .badge-wifi_ap {
      background: #fef3c7;
      color: #b45309;
    }

    .badge-unknown {
      background: #f3f4f6;
      color: var(--_muted);
    }

    .state {
      font-size: 0.85rem;
      font-weight: 600;
    }

    .state-up {
      color: #15803d;
    }

    .state-down {
      color: var(--_muted);
    }

    .loading {
      font-size: 0.8rem;
      margin-left: auto;
    }

    .banner {
      margin-top: 0.75rem;
      padding: 0.5rem 0.75rem;
      border-radius: 8px;
      font-size: 0.85rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      justify-content: space-between;
    }

    .banner-warn {
      background: #fffbeb;
      border: 1px solid #fde68a;
      color: #92400e;
    }

    .banner-error {
      background: #fef2f2;
      border: 1px solid #fecaca;
      color: var(--_danger);
    }

    section {
      margin-top: 1rem;
    }

    h2 {
      font-size: 0.8rem;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: var(--_muted);
      margin: 0 0 0.5rem;
    }

    .rows {
      display: grid;
      grid-template-columns: auto 1fr;
      gap: 0.35rem 0.75rem;
      margin: 0;
    }

    dt {
      color: var(--_muted);
      font-size: 0.85rem;
    }

    dd {
      margin: 0;
      font-size: 0.9rem;
      word-break: break-word;
    }

    .muted {
      color: var(--_muted);
    }

    .foot {
      margin-top: 1rem;
      font-size: 0.75rem;
    }

    button {
      font: inherit;
      font-size: 0.8rem;
      padding: 0.25rem 0.6rem;
      border-radius: 6px;
      border: 1px solid currentColor;
      background: transparent;
      color: var(--_accent);
      cursor: pointer;
    }

    button:hover {
      background: rgba(37, 99, 235, 0.08);
    }
  `,Y);typeof customElements<"u"&&!customElements.get("edn-network-status")&&customElements.define("edn-network-status",ji);var Ne=32,ge=64,lt=8,Vi=5e3,Qi=new TextEncoder;function We(t){return Qi.encode(t).length}function ar(t){return t.isAPMode?"ap":"station"}var X,Ki=(X=class extends Z{constructor(...e){super(...e),this.baseUrl="",this.settings=null,this.loading=!1,this.submitting=!1,this.errorMessage="",this.successMessage="",this.draftMode="station",this.draftWifiSSID="",this.draftWifiPassword="",this.draftWifiPasswordDirty=!1,this.draftApSSID="",this.draftApHasPassword=!1,this.draftApPassword="",this.draftApPasswordDirty=!1,this.fieldErrors={},this.scanning=!1,this.scanResults=[],this.scanError="",this.loadToken=0,this.settingsBaseUrl=null,this.handleWifiSSIDInput=r=>{this.draftWifiSSID=r.target.value},this.handleWifiPasswordInput=r=>{this.draftWifiPassword=r.target.value,this.draftWifiPasswordDirty=!0},this.handleApSSIDInput=r=>{this.draftApSSID=r.target.value},this.handleApPasswordInput=r=>{this.draftApPassword=r.target.value,this.draftApPasswordDirty=!0},this.handleApHasPasswordChange=r=>{this.draftApHasPassword=r.target.checked,this.draftApHasPassword||(this.draftApPassword="",this.draftApPasswordDirty=!1,this.fieldErrors={...this.fieldErrors,wifiAPPassword:void 0})},this.handlePickSsid=r=>{this.draftMode!=="station"&&(this.draftMode="station"),this.draftWifiSSID=r,this.fieldErrors={...this.fieldErrors,wifiSSID:void 0}},this.handleSubmit=r=>{r.preventDefault(),this.handleSave()},this.handleRetry=()=>{this.load()}}connectedCallback(){super.connectedCallback(),this.load()}disconnectedCallback(){super.disconnectedCallback(),this.scanController?.abort(),this.scanController=void 0}updated(e){let r=e.get("baseUrl");e.has("baseUrl")&&r!==void 0&&r!==this.baseUrl&&(this.client=void 0,this.scanResults=[],this.scanError="",this.load())}render(){let e=this.settings;return w`
      <div class="card">
        <h1>Network settings</h1>
        ${this.errorMessage?w`<div class="banner banner-error" role="alert">
              <span>${this.errorMessage}</span>
              <button type="button" @click=${this.handleRetry}>Retry</button>
            </div>`:S}
        ${this.successMessage?w`<div class="banner banner-success" role="status">${this.successMessage}</div>`:S}
        ${e?w`${this.renderForm(e)} ${this.renderScan()}`:this.loading?w`<p class="status">Loading settings…</p>`:w`<p class="status">Settings unavailable.</p>`}
      </div>
    `}renderForm(e){return w`
      <form @submit=${this.handleSubmit}>
        <fieldset>
          <legend>Mode</legend>
          <div class="segmented" role="group" aria-label="Network mode">
            <button
              type="button"
              class="seg ${this.draftMode==="station"?"active":""}"
              aria-pressed=${this.draftMode==="station"}
              @click=${()=>this.setMode("station")}
            >
              Station
            </button>
            <button
              type="button"
              class="seg ${this.draftMode==="ap"?"active":""}"
              aria-pressed=${this.draftMode==="ap"}
              @click=${()=>this.setMode("ap")}
            >
              Access Point
            </button>
          </div>
        </fieldset>

        ${this.draftMode==="station"?this.renderStation(e):this.renderAccessPoint(e)}

        <div class="actions">
          <button class="primary" type="submit" ?disabled=${this.submitting||!this.dirty}>
            ${this.submitting?"Saving…":"Save"}
          </button>
          ${this.dirty?w`<span class="muted">Unsaved changes</span>`:S}
        </div>
      </form>
    `}renderStation(e){return w`
      <section class="group">
        <h2>Station</h2>
        <label>
          Wi-Fi name
          <input
            name="wifiSSID"
            type="text"
            autocomplete="off"
            .value=${this.draftWifiSSID}
            @input=${this.handleWifiSSIDInput}
          />
        </label>
        ${this.renderFieldError("wifiSSID")}
        <label>
          Wi-Fi password
          <input
            name="wifiPassword"
            type="password"
            autocomplete="new-password"
            placeholder=${e.hasWifiPassword?"Leave blank to keep saved password":"No password set"}
            .value=${this.draftWifiPassword}
            @input=${this.handleWifiPasswordInput}
          />
        </label>
        ${e.hasWifiPassword?w`<p class="hint">Password saved •••• (leave blank to keep)</p>`:S}
        ${this.renderPasswordClearWarning("wifiPassword")}
        ${this.renderFieldError("wifiPassword")}
      </section>
    `}renderAccessPoint(e){return w`
      <section class="group">
        <h2>Access point</h2>
        <label>
          Access point name
          <input
            name="wifiAPSSID"
            type="text"
            autocomplete="off"
            .value=${this.draftApSSID}
            @input=${this.handleApSSIDInput}
          />
        </label>
        ${this.renderFieldError("wifiAPSSID")}
        <label class="check">
          <input
            type="checkbox"
            .checked=${this.draftApHasPassword}
            @change=${this.handleApHasPasswordChange}
          />
          Require password
        </label>
        ${this.draftApHasPassword?w`
              <label>
                Access point password
                <input
                  name="wifiAPPassword"
                  type="password"
                  autocomplete="new-password"
                  placeholder=${e.hasWifiAPPassword?"Leave blank to keep saved password":"At least 8 characters"}
                  .value=${this.draftApPassword}
                  @input=${this.handleApPasswordInput}
                />
              </label>
              ${e.hasWifiAPPassword?w`<p class="hint">Password saved •••• (leave blank to keep)</p>`:S}
              ${this.renderPasswordClearWarning("wifiAPPassword")}
              ${this.renderFieldError("wifiAPPassword")}
            `:S}
      </section>
    `}renderScan(){return w`
      <section class="group">
        <div class="scan-head">
          <h2>Wi-Fi scan</h2>
          <button type="button" @click=${this.handleScan} ?disabled=${this.scanning}>
            ${this.scanning?"Scanning…":"Scan"}
          </button>
        </div>
        ${this.scanError?w`<div class="banner banner-error" role="alert">${this.scanError}</div>`:S}
        ${this.scanResults.length>0?w`<ul class="networks">
              ${this.scanResults.map(e=>this.renderNetwork(e))}
            </ul>`:S}
      </section>
    `}renderNetwork(e){return w`
      <li>
        <button type="button" class="network" @click=${()=>this.handlePickSsid(e.ssid)}>
          <span class="ssid">${e.ssid}</span>
          <span class="meta">
            ${e.encrypted?w`<span class="lock" title="Encrypted" aria-label="Encrypted">🔒</span>`:S}
            ${e.rssi} dBm · Ch ${e.channel}
          </span>
        </button>
      </li>
    `}renderFieldError(e){let r=this.fieldErrors[e];return r?w`<p class="field-error" role="alert">${r}</p>`:S}renderPasswordClearWarning(e){return(e==="wifiPassword"?this.draftWifiPasswordDirty&&this.draftWifiPassword===""&&this.settings?.hasWifiPassword===!0:this.draftApPasswordDirty&&this.draftApPassword===""&&this.draftApHasPassword&&this.settings?.hasWifiAPPassword===!0)?w`<p class="clear-warning" role="alert">
          Warning: saving now will remove the stored password.
        </p>`:S}get dirty(){let e=this.settings;return e?this.draftMode!==ar(e)||this.draftWifiSSID!==e.wifiSSID||this.draftApSSID!==e.wifiAPSSID||this.draftApHasPassword!==e.wifiAPHasPassword||this.draftWifiPasswordDirty||this.draftApPasswordDirty:!1}ensureClient(){return(!this.client||this.clientBaseUrl!==this.baseUrl)&&(this.client=Kr({baseUrl:this.baseUrl}),this.clientBaseUrl=this.baseUrl),this.client}async load(){let e=++this.loadToken;this.loading=!0;let r=await this.ensureClient().getSettings();if(e!==this.loadToken){this.settingsBaseUrl!==this.baseUrl&&(this.settings=null);return}if(this.loading=!1,r.ok){this.applyServerSettings(r.data),this.errorMessage="";return}this.settingsBaseUrl!==this.baseUrl&&(this.settings=null),this.errorMessage=r.message,this.emitError(r.message)}applyServerSettings(e){this.settings=e,this.settingsBaseUrl=this.baseUrl,this.draftMode=ar(e),this.draftWifiSSID=e.wifiSSID,this.draftApSSID=e.wifiAPSSID,this.draftApHasPassword=e.wifiAPHasPassword,this.draftWifiPassword="",this.draftWifiPasswordDirty=!1,this.draftApPassword="",this.draftApPasswordDirty=!1,this.fieldErrors={}}validate(){let e=this.settings,r={};if(!e)return r;let s=this.draftMode==="ap";if(We(this.draftWifiSSID)>Ne&&(r.wifiSSID=`Wi-Fi name must be ${Ne} characters or fewer.`),We(this.draftApSSID)>Ne&&(r.wifiAPSSID=`Access point name must be ${Ne} characters or fewer.`),s?this.draftApSSID.length===0&&(r.wifiAPSSID="Access point name is required in AP mode."):this.draftWifiSSID.length===0&&(r.wifiSSID="Wi-Fi name is required in station mode."),this.draftWifiPasswordDirty&&We(this.draftWifiPassword)>ge&&(r.wifiPassword=`Wi-Fi password must be ${ge} characters or fewer.`),this.draftApHasPassword)if(this.draftApPasswordDirty){let i=We(this.draftApPassword);(i<lt||i>ge)&&(r.wifiAPPassword=`Access point password must be ${lt}–${ge} characters.`)}else e.hasWifiAPPassword||(r.wifiAPPassword=`Enter an access point password (${lt}–${ge} characters).`);return r}buildPatch(){let e=this.settings,r={};if(!e)return r;let s=this.draftMode==="ap";return s!==e.isAPMode&&(r.isAPMode=s),this.draftWifiSSID!==e.wifiSSID&&(r.wifiSSID=this.draftWifiSSID),this.draftWifiPasswordDirty&&(r.wifiPassword=this.draftWifiPassword),this.draftApSSID!==e.wifiAPSSID&&(r.wifiAPSSID=this.draftApSSID),this.draftApHasPassword!==e.wifiAPHasPassword&&(r.wifiAPHasPassword=this.draftApHasPassword),this.draftApHasPassword&&this.draftApPasswordDirty&&(r.wifiAPPassword=this.draftApPassword),r}async handleSave(){if(this.submitting||!this.settings)return;let e=this.validate();if(this.fieldErrors=e,Object.keys(e).length>0)return;let r=this.buildPatch();if(Object.keys(r).length===0)return;this.submitting=!0,this.errorMessage="",this.successMessage="";let s=await this.ensureClient().saveSettings(r);if(this.submitting=!1,s.ok){this.applyServerSettings(s.data),this.successMessage="Settings saved.",this.dispatchEvent(new CustomEvent("edn-saved",{detail:s.data,bubbles:!0,composed:!0}));return}let i=s.status===void 0?"Could not confirm the save — the device may have applied the changes and reconnected. Check the status widget or retry.":s.message;this.errorMessage=i,this.emitError(i)}async handleScan(){if(this.scanning)return;this.scanning=!0,this.scanError="";let e=new AbortController;this.scanController=e;let r,s=new Promise(n=>{r=setTimeout(()=>{e.abort(),n({ok:!1,message:"Wi-Fi scan timed out after 5 seconds."})},Vi)}),i=await Promise.race([this.ensureClient().wifiList(e.signal),s]);if(r!==void 0&&clearTimeout(r),this.scanController===e&&(this.scanController=void 0),this.scanning=!1,i.ok){this.scanResults=[...i.data.networks].sort((n,o)=>o.rssi-n.rssi);return}i.message!=="Request aborted."&&(this.scanError=i.message,this.emitError(i.message))}emitError(e){this.dispatchEvent(new CustomEvent("edn-error",{detail:{message:e},bubbles:!0,composed:!0}))}setMode(e){this.draftMode!==e&&(this.draftMode=e,this.fieldErrors={})}},X.properties={baseUrl:{type:String,attribute:"base-url"},settings:{state:!0},loading:{state:!0},submitting:{state:!0},errorMessage:{state:!0},successMessage:{state:!0},draftMode:{state:!0},draftWifiSSID:{state:!0},draftWifiPassword:{state:!0},draftWifiPasswordDirty:{state:!0},draftApSSID:{state:!0},draftApHasPassword:{state:!0},draftApPassword:{state:!0},draftApPasswordDirty:{state:!0},fieldErrors:{state:!0},scanning:{state:!0},scanResults:{state:!0},scanError:{state:!0}},X.styles=kt`
    :host {
      display: block;
      font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
      color: #1f2430;
      --_accent: var(--edn-accent, #2563eb);
      --_danger: var(--edn-danger, #dc2626);
      --_muted: var(--edn-muted, #6b7280);
      --_border: #e2e5ea;
      --_surface: #ffffff;
    }

    .card {
      background: var(--_surface);
      border: 1px solid var(--_border);
      border-radius: 10px;
      padding: 1rem 1.25rem;
      max-width: 30rem;
      box-shadow: 0 1px 2px rgba(16, 24, 40, 0.05);
    }

    h1 {
      font-size: 1rem;
      margin: 0 0 0.75rem;
    }

    h2 {
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: var(--_muted);
      margin: 0 0 0.5rem;
    }

    .banner {
      margin: 0 0 0.75rem;
      padding: 0.5rem 0.75rem;
      border-radius: 8px;
      font-size: 0.85rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      justify-content: space-between;
    }

    .banner-error {
      background: #fef2f2;
      border: 1px solid #fecaca;
      color: var(--_danger);
    }

    .banner-success {
      background: #f0fdf4;
      border: 1px solid #bbf7d0;
      color: #15803d;
    }

    fieldset {
      border: 0;
      padding: 0;
      margin: 0 0 0.75rem;
    }

    legend {
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: var(--_muted);
      margin-bottom: 0.35rem;
    }

    .segmented {
      display: inline-flex;
      border: 1px solid var(--_border);
      border-radius: 8px;
      overflow: hidden;
    }

    .seg {
      font: inherit;
      font-size: 0.85rem;
      padding: 0.35rem 0.85rem;
      border: 0;
      background: transparent;
      color: var(--_muted);
      cursor: pointer;
    }

    .seg.active {
      background: var(--_accent);
      color: #ffffff;
    }

    .group {
      border-top: 1px solid var(--_border);
      padding-top: 0.75rem;
      margin-bottom: 0.75rem;
    }

    label {
      display: block;
      font-size: 0.85rem;
      margin-bottom: 0.6rem;
    }

    input[type='text'],
    input[type='password'] {
      display: block;
      width: 100%;
      box-sizing: border-box;
      margin-top: 0.25rem;
      font: inherit;
      font-size: 0.9rem;
      padding: 0.4rem 0.55rem;
      border: 1px solid var(--_border);
      border-radius: 6px;
      background: #fff;
      color: inherit;
    }

    input[type='text']:focus,
    input[type='password']:focus {
      outline: 2px solid color-mix(in srgb, var(--_accent) 45%, transparent);
      outline-offset: 1px;
      border-color: var(--_accent);
    }

    .check {
      display: flex;
      align-items: center;
      gap: 0.45rem;
      font-size: 0.85rem;
    }

    .hint {
      font-size: 0.78rem;
      color: var(--_muted);
      margin: -0.3rem 0 0.5rem;
    }

    .field-error {
      font-size: 0.78rem;
      color: var(--_danger);
      margin: -0.3rem 0 0.6rem;
    }

    .clear-warning {
      font-size: 0.78rem;
      color: var(--_danger);
      margin: -0.3rem 0 0.6rem;
    }

    .actions {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      border-top: 1px solid var(--_border);
      padding-top: 0.75rem;
    }

    button {
      font: inherit;
      font-size: 0.8rem;
      padding: 0.3rem 0.7rem;
      border-radius: 6px;
      border: 1px solid currentColor;
      background: transparent;
      color: var(--_accent);
      cursor: pointer;
    }

    button:hover:not(:disabled) {
      background: rgba(37, 99, 235, 0.08);
    }

    button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .primary {
      background: var(--_accent);
      border-color: var(--_accent);
      color: #ffffff;
    }

    .primary:hover:not(:disabled) {
      background: color-mix(in srgb, var(--_accent) 88%, #000);
    }

    .scan-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.5rem;
    }

    .scan-head h2 {
      margin: 0;
    }

    ul.networks {
      list-style: none;
      margin: 0.5rem 0 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: 0.3rem;
    }

    .network {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.5rem;
      width: 100%;
      text-align: left;
      border: 1px solid var(--_border);
      border-radius: 6px;
      padding: 0.35rem 0.55rem;
      color: inherit;
    }

    .network .ssid {
      font-size: 0.85rem;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .network .meta {
      font-size: 0.75rem;
      color: var(--_muted);
      white-space: nowrap;
    }

    .lock {
      color: var(--_muted);
    }

    .muted {
      color: var(--_muted);
    }

    .status {
      font-size: 0.85rem;
      color: var(--_muted);
    }
  `,X);typeof customElements<"u"&&!customElements.get("edn-network-settings")&&customElements.define("edn-network-settings",Ki);var Gi=[{id:"status",label:"Status"},{id:"settings",label:"Network settings"}],ee,Ji=(ee=class extends Z{constructor(...e){super(...e),this.baseUrl="",this.pollIntervalMs=1e4,this.activeTab="status"}render(){return w`
      <div class="tabs" role="tablist" aria-label="Network">
        ${Gi.map(e=>w`
            <button
              type="button"
              role="tab"
              id="tab-${e.id}"
              aria-controls="panel-${e.id}"
              aria-selected=${this.activeTab===e.id}
              @click=${()=>this.selectTab(e.id)}
            >
              ${e.label}
            </button>
          `)}
      </div>
      <div class="panel" id="panel-${this.activeTab}" role="tabpanel">
        ${this.renderActive()}
      </div>
    `}renderActive(){return this.activeTab==="settings"?w`<edn-network-settings base-url=${this.baseUrl}></edn-network-settings>`:w`
      <edn-network-status
        base-url=${this.baseUrl}
        poll-interval-ms=${this.pollIntervalMs}
      ></edn-network-status>
    `}selectTab(e){this.activeTab!==e&&(this.activeTab=e,this.dispatchEvent(new CustomEvent("edn-tab-change",{detail:{tab:e},bubbles:!0,composed:!0})))}},ee.properties={baseUrl:{type:String,attribute:"base-url"},pollIntervalMs:{type:Number,attribute:"poll-interval-ms"},activeTab:{state:!0}},ee.styles=kt`
    :host {
      display: block;
      font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
      color: #1f2430;
      --_accent: var(--edn-accent, #2563eb);
      --_border: #e2e5ea;
    }

    .tabs {
      display: flex;
      gap: 0.25rem;
      border-bottom: 1px solid var(--_border);
      max-width: 30rem;
    }

    [role='tab'] {
      font: inherit;
      font-size: 0.85rem;
      padding: 0.45rem 0.8rem;
      border: 0;
      border-bottom: 2px solid transparent;
      background: transparent;
      color: var(--edn-muted, #6b7280);
      cursor: pointer;
      margin-bottom: -1px;
    }

    [role='tab'][aria-selected='true'] {
      color: var(--_accent);
      border-bottom-color: var(--_accent);
      font-weight: 600;
    }

    .panel {
      margin-top: 1rem;
    }
  `,ee);typeof customElements<"u"&&!customElements.get("edn-network-page")&&customElements.define("edn-network-page",Ji);var ss="Network request failed. Check the device connection and try again.",Zi={};function Yi(t){if(t&&typeof t=="object"&&"message"in t){let e=t.message;if(typeof e=="string"&&e.length>0)return e}}function Xi(t,e){return e?.aborted===!0||typeof t=="object"&&!!t&&t.name==="AbortError"}function is(t,e){return Xi(t,e)?{ok:!1,message:"Request aborted."}:{ok:!1,message:ss}}async function ns(t,e){let r=e;try{let s=await t.text();if(s.length>0)try{r=Yi(JSON.parse(s))??r}catch{}}catch{}return{ok:!1,status:t.status,message:r}}async function lr(t,e,r,s,i,n){let o;try{o=await fetch(t,{headers:{Accept:e,...i},signal:n})}catch(d){return is(d,n)}if(!o.ok)return ns(o,o.status===404?s:`Request failed with HTTP ${o.status}.`);let l;try{l=new Uint8Array(await o.arrayBuffer())}catch{return{ok:!1,status:o.status,message:ss}}return l.byteLength===0?{ok:!1,status:o.status,message:r}:{ok:!0,data:l}}async function dr(t,e,r,s,i){if(e.byteLength===0)return{ok:!1,message:r};let n=new ArrayBuffer(e.byteLength);new Uint8Array(n).set(e);let o;try{o=await fetch(t,{method:"POST",headers:{Accept:"application/json","Content-Type":"application/octet-stream",...s},body:n,signal:i})}catch(l){return is(l,i)}return o.ok?(await o.text().catch(()=>""),{ok:!0,data:Zi}):ns(o,`Upload failed with HTTP ${o.status}.`)}function en(t={}){let e=t.baseUrl??"",r=t.backupPath??"/api/config/backup",s=t.configPath??"/api/config",i=t.headers??{},n=`${e}${r}`,o=`${e}${s}`;return{downloadBackup(l){return lr(n,"application/zip","Device returned an empty archive.","The device has no config files yet.",i,l)},downloadConfig(l){return lr(o,"application/octet-stream","Device returned an empty config file.","The device has no saved config yet (no config file on flash).",i,l)},uploadBackup(l,d){return dr(n,l,"Cannot upload an empty archive.",i,d)},uploadConfig(l,d){return dr(o,l,"Cannot upload an empty config file.",i,d)}}}var Le=globalThis,Ct=Le.ShadowRoot&&(Le.ShadyCSS===void 0||Le.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Tt=Symbol(),cr=new WeakMap,os=class{constructor(t,e,r){if(this._$cssResult$=!0,r!==Tt)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(Ct&&t===void 0){let r=e!==void 0&&e.length===1;r&&(t=cr.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),r&&cr.set(e,t))}return t}toString(){return this.cssText}},tn=t=>new os(typeof t=="string"?t:t+"",void 0,Tt),rn=(t,...e)=>new os(t.length===1?t[0]:e.reduce((r,s,i)=>r+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[i+1],t[0]),t,Tt),sn=(t,e)=>{if(Ct)t.adoptedStyleSheets=e.map(r=>r instanceof CSSStyleSheet?r:r.styleSheet);else for(let r of e){let s=document.createElement("style"),i=Le.litNonce;i!==void 0&&s.setAttribute("nonce",i),s.textContent=r.cssText,t.appendChild(s)}},hr=Ct?t=>t:t=>t instanceof CSSStyleSheet?(e=>{let r="";for(let s of e.cssRules)r+=s.cssText;return tn(r)})(t):t,{is:nn,defineProperty:on,getOwnPropertyDescriptor:an,getOwnPropertyNames:ln,getOwnPropertySymbols:dn,getPrototypeOf:cn}=Object,Xe=globalThis,ur=Xe.trustedTypes,hn=ur?ur.emptyScript:"",un=Xe.reactiveElementPolyfillSupport,we=(t,e)=>t,_t={toAttribute(t,e){switch(e){case Boolean:t=t?hn:null;break;case Object:case Array:t=t==null?t:JSON.stringify(t)}return t},fromAttribute(t,e){let r=t;switch(e){case Boolean:r=t!==null;break;case Number:r=t===null?null:Number(t);break;case Object:case Array:try{r=JSON.parse(t)}catch{r=null}}return r}},as=(t,e)=>!nn(t,e),pr={attribute:!0,type:String,converter:_t,reflect:!1,useDefault:!1,hasChanged:as};Symbol.metadata??=Symbol("metadata"),Xe.litPropertyMetadata??=new WeakMap;var le=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=pr){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let r=Symbol(),s=this.getPropertyDescriptor(t,r,e);s!==void 0&&on(this.prototype,t,s)}}static getPropertyDescriptor(t,e,r){let{get:s,set:i}=an(this.prototype,t)??{get(){return this[e]},set(n){this[e]=n}};return{get:s,set(n){let o=s?.call(this);i?.call(this,n),this.requestUpdate(t,o,r)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??pr}static _$Ei(){if(this.hasOwnProperty(we("elementProperties")))return;let t=cn(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(we("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(we("properties"))){let e=this.properties,r=[...ln(e),...dn(e)];for(let s of r)this.createProperty(s,e[s])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[r,s]of e)this.elementProperties.set(r,s)}this._$Eh=new Map;for(let[e,r]of this.elementProperties){let s=this._$Eu(e,r);s!==void 0&&this._$Eh.set(s,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let r=new Set(t.flat(1/0).reverse());for(let s of r)e.unshift(hr(s))}else t!==void 0&&e.push(hr(t));return e}static _$Eu(t,e){let r=e.attribute;return r===!1?void 0:typeof r=="string"?r:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let r of e.keys())this.hasOwnProperty(r)&&(t.set(r,this[r]),delete this[r]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return sn(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,r){this._$AK(t,r)}_$ET(t,e){let r=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,r);if(s!==void 0&&r.reflect===!0){let i=(r.converter?.toAttribute===void 0?_t:r.converter).toAttribute(e,r.type);this._$Em=t,i==null?this.removeAttribute(s):this.setAttribute(s,i),this._$Em=null}}_$AK(t,e){let r=this.constructor,s=r._$Eh.get(t);if(s!==void 0&&this._$Em!==s){let i=r.getPropertyOptions(s),n=typeof i.converter=="function"?{fromAttribute:i.converter}:i.converter?.fromAttribute===void 0?_t:i.converter;this._$Em=s;let o=n.fromAttribute(e,i.type);this[s]=o??this._$Ej?.get(s)??o,this._$Em=null}}requestUpdate(t,e,r,s=!1,i){if(t!==void 0){let n=this.constructor;if(s===!1&&(i=this[t]),r??=n.getPropertyOptions(t),!((r.hasChanged??as)(i,e)||r.useDefault&&r.reflect&&i===this._$Ej?.get(t)&&!this.hasAttribute(n._$Eu(t,r))))return;this.C(t,e,r)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:r,reflect:s,wrapped:i},n){r&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,n??e??this[t]),i!==!0||n!==void 0)||(this._$AL.has(t)||(this.hasUpdated||r||(e=void 0),this._$AL.set(t,e)),s===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[s,i]of this._$Ep)this[s]=i;this._$Ep=void 0}let r=this.constructor.elementProperties;if(r.size>0)for(let[s,i]of r){let{wrapped:n}=i,o=this[s];n!==!0||this._$AL.has(s)||o===void 0||this.C(s,void 0,i,o)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(r=>r.hostUpdate?.()),this.update(e)):this._$EM()}catch(r){throw t=!1,this._$EM(),r}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(t){}firstUpdated(t){}};le.elementStyles=[],le.shadowRootOptions={mode:"open"},le[we("elementProperties")]=new Map,le[we("finalized")]=new Map,un?.({ReactiveElement:le}),(Xe.reactiveElementVersions??=[]).push("2.1.2");var Dt=globalThis,fr=t=>t,je=Dt.trustedTypes,mr=je?je.createPolicy("lit-html",{createHTML:t=>t}):void 0,ls="$lit$",j=`lit$${Math.random().toFixed(9).slice(2)}$`,ds="?"+j,pn=`<${ds}>`,ne=document,Me=()=>ne.createComment(""),Ee=t=>t===null||typeof t!="object"&&typeof t!="function",Nt=Array.isArray,fn=t=>Nt(t)||typeof t?.[Symbol.iterator]=="function",dt=`[ 	
\f\r]`,ve=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,_r=/-->/g,br=/>/g,K=RegExp(`>|${dt}(?:([^\\s"'>=/]+)(${dt}*=${dt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),gr=/'/g,vr=/"/g,cs=/^(?:script|style|textarea|title)$/i,F=(t=>(e,...r)=>({_$litType$:t,strings:e,values:r}))(1),ue=Symbol.for("lit-noChange"),M=Symbol.for("lit-nothing"),$r=new WeakMap,J=ne.createTreeWalker(ne,129);function hs(t,e){if(!Nt(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return mr===void 0?e:mr.createHTML(e)}var mn=(t,e)=>{let r=t.length-1,s=[],i,n=e===2?"<svg>":e===3?"<math>":"",o=ve;for(let l=0;l<r;l++){let d=t[l],h,u,p=-1,c=0;for(;c<d.length&&(o.lastIndex=c,u=o.exec(d),u!==null);)c=o.lastIndex,o===ve?u[1]==="!--"?o=_r:u[1]===void 0?u[2]===void 0?u[3]!==void 0&&(o=K):(cs.test(u[2])&&(i=RegExp("</"+u[2],"g")),o=K):o=br:o===K?u[0]===">"?(o=i??ve,p=-1):u[1]===void 0?p=-2:(p=o.lastIndex-u[2].length,h=u[1],o=u[3]===void 0?K:u[3]==='"'?vr:gr):o===vr||o===gr?o=K:o===_r||o===br?o=ve:(o=K,i=void 0);let f=o===K&&t[l+1].startsWith("/>")?" ":"";n+=o===ve?d+pn:p>=0?(s.push(h),d.slice(0,p)+ls+d.slice(p)+j+f):d+j+(p===-2?l:f)}return[hs(t,n+(t[r]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),s]},bt=class us{constructor({strings:e,_$litType$:r},s){let i;this.parts=[];let n=0,o=0,l=e.length-1,d=this.parts,[h,u]=mn(e,r);if(this.el=us.createElement(h,s),J.currentNode=this.el.content,r===2||r===3){let p=this.el.content.firstChild;p.replaceWith(...p.childNodes)}for(;(i=J.nextNode())!==null&&d.length<l;){if(i.nodeType===1){if(i.hasAttributes())for(let p of i.getAttributeNames())if(p.endsWith(ls)){let c=u[o++],f=i.getAttribute(p).split(j),g=/([.?@])?(.*)/.exec(c);d.push({type:1,index:n,name:g[2],strings:f,ctor:g[1]==="."?bn:g[1]==="?"?gn:g[1]==="@"?vn:et}),i.removeAttribute(p)}else p.startsWith(j)&&(d.push({type:6,index:n}),i.removeAttribute(p));if(cs.test(i.tagName)){let p=i.textContent.split(j),c=p.length-1;if(c>0){i.textContent=je?je.emptyScript:"";for(let f=0;f<c;f++)i.append(p[f],Me()),J.nextNode(),d.push({type:2,index:++n});i.append(p[c],Me())}}}else if(i.nodeType===8)if(i.data===ds)d.push({type:2,index:n});else{let p=-1;for(;(p=i.data.indexOf(j,p+1))!==-1;)d.push({type:7,index:n}),p+=j.length-1}n++}}static createElement(e,r){let s=ne.createElement("template");return s.innerHTML=e,s}};function pe(t,e,r=t,s){if(e===ue)return e;let i=s===void 0?r._$Cl:r._$Co?.[s],n=Ee(e)?void 0:e._$litDirective$;return i?.constructor!==n&&(i?._$AO?.(!1),n===void 0?i=void 0:(i=new n(t),i._$AT(t,r,s)),s===void 0?r._$Cl=i:(r._$Co??=[])[s]=i),i!==void 0&&(e=pe(t,i._$AS(t,e.values),i,s)),e}var _n=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:e},parts:r}=this._$AD,s=(t?.creationScope??ne).importNode(e,!0);J.currentNode=s;let i=J.nextNode(),n=0,o=0,l=r[0];for(;l!==void 0;){if(n===l.index){let d;l.type===2?d=new Wt(i,i.nextSibling,this,t):l.type===1?d=new l.ctor(i,l.name,l.strings,this,t):l.type===6&&(d=new $n(i,this,t)),this._$AV.push(d),l=r[++o]}n!==l?.index&&(i=J.nextNode(),n++)}return J.currentNode=ne,s}p(t){let e=0;for(let r of this._$AV)r!==void 0&&(r.strings===void 0?r._$AI(t[e]):(r._$AI(t,r,e),e+=r.strings.length-2)),e++}},Wt=class ps{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,r,s,i){this.type=2,this._$AH=M,this._$AN=void 0,this._$AA=e,this._$AB=r,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode,r=this._$AM;return r!==void 0&&e?.nodeType===11&&(e=r.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,r=this){e=pe(this,e,r),Ee(e)?e===M||e==null||e===""?(this._$AH!==M&&this._$AR(),this._$AH=M):e!==this._$AH&&e!==ue&&this._(e):e._$litType$===void 0?e.nodeType===void 0?fn(e)?this.k(e):this._(e):this.T(e):this.$(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==M&&Ee(this._$AH)?this._$AA.nextSibling.data=e:this.T(ne.createTextNode(e)),this._$AH=e}$(e){let{values:r,_$litType$:s}=e,i=typeof s=="number"?this._$AC(e):(s.el===void 0&&(s.el=bt.createElement(hs(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(r);else{let n=new _n(i,this),o=n.u(this.options);n.p(r),this.T(o),this._$AH=n}}_$AC(e){let r=$r.get(e.strings);return r===void 0&&$r.set(e.strings,r=new bt(e)),r}k(e){Nt(this._$AH)||(this._$AH=[],this._$AR());let r=this._$AH,s,i=0;for(let n of e)i===r.length?r.push(s=new ps(this.O(Me()),this.O(Me()),this,this.options)):s=r[i],s._$AI(n),i++;i<r.length&&(this._$AR(s&&s._$AB.nextSibling,i),r.length=i)}_$AR(e=this._$AA.nextSibling,r){for(this._$AP?.(!1,!0,r);e!==this._$AB;){let s=fr(e).nextSibling;fr(e).remove(),e=s}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}},et=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,r,s,i){this.type=1,this._$AH=M,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=i,r.length>2||r[0]!==""||r[1]!==""?(this._$AH=Array(r.length-1).fill(new String),this.strings=r):this._$AH=M}_$AI(t,e=this,r,s){let i=this.strings,n=!1;if(i===void 0)t=pe(this,t,e,0),n=!Ee(t)||t!==this._$AH&&t!==ue,n&&(this._$AH=t);else{let o=t,l,d;for(t=i[0],l=0;l<i.length-1;l++)d=pe(this,o[r+l],e,l),d===ue&&(d=this._$AH[l]),n||=!Ee(d)||d!==this._$AH[l],d===M?t=M:t!==M&&(t+=(d??"")+i[l+1]),this._$AH[l]=d}n&&!s&&this.j(t)}j(t){t===M?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},bn=class extends et{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===M?void 0:t}},gn=class extends et{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==M)}},vn=class extends et{constructor(t,e,r,s,i){super(t,e,r,s,i),this.type=5}_$AI(t,e=this){if((t=pe(this,t,e,0)??M)===ue)return;let r=this._$AH,s=t===M&&r!==M||t.capture!==r.capture||t.once!==r.once||t.passive!==r.passive,i=t!==M&&(r===M||s);s&&this.element.removeEventListener(this.name,this,r),i&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},$n=class{constructor(t,e,r){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=r}get _$AU(){return this._$AM._$AU}_$AI(t){pe(this,t)}},yn=Dt.litHtmlPolyfillSupport;yn?.(bt,Wt),(Dt.litHtmlVersions??=[]).push("3.3.3");var wn=(t,e,r)=>{let s=r?.renderBefore??e,i=s._$litPart$;if(i===void 0){let n=r?.renderBefore??null;s._$litPart$=i=new Wt(e.insertBefore(Me(),n),n,void 0,r??{})}return i._$AI(t),i},Ut=globalThis,Se=class extends le{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=wn(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return ue}};Se._$litElement$=!0,Se.finalized=!0,Ut.litElementHydrateSupport?.({LitElement:Se});var Sn=Ut.litElementPolyfillSupport;Sn?.({LitElement:Se}),(Ut.litElementVersions??=[]).push("4.2.2");var yr=2e3,An=12e4,wr="Unsupported file type. Choose a .zip full backup or a .bin config file.";function ct(t){let e=t.toLowerCase();return e.endsWith(".zip")?"archive":e.endsWith(".bin")?"config":null}function kn(t,e){if(typeof URL.createObjectURL!="function")return;let r=new ArrayBuffer(t.byteLength);new Uint8Array(r).set(t);let s=new Blob([r],{type:"application/octet-stream"}),i=URL.createObjectURL(s),n=document.createElement("a");n.href=i,n.download=e,document.body.appendChild(n),n.click(),n.remove(),window.setTimeout(()=>URL.revokeObjectURL(i),0)}var te,Pn=(te=class extends Se{constructor(...e){super(...e),this.baseUrl="",this.backupPath="/api/config/backup",this.configPath="/api/config",this.healthPath="/healthcheck/healty",this.deviceName="device",this.archiveFileName="config-backup.zip",this.binFileName="config.bin",this.maxUploadBytes=16384,this.zipNotes="",this.binNotes="",this.zipConfirmText="",this.binConfirmText="",this.downloading=!1,this.downloadNotice=null,this.selectedFile=null,this.fileError=null,this.uploading=!1,this.uploadError=null,this.phase="idle",this._attempts=0}disconnectedCallback(){this.clearPollTimer(),super.disconnectedCallback()}get busy(){return this.uploading||this.phase!=="idle"}get effectiveZipNotes(){return this.zipNotes||`Download a zip of everything stored on the ${this.deviceName}: ${this.binFileName} plus the device's persisted state files. Restoring this archive overwrites the stored config and state files. It contains Wi-Fi and MQTT credentials in plaintext, so keep it somewhere safe.`}get effectiveBinNotes(){return this.binNotes||`Download only ${this.binFileName}, the raw stored config. Restoring it replaces just that file. It contains Wi-Fi and MQTT credentials in plaintext, so keep it somewhere safe.`}get effectiveZipConfirmText(){return this.zipConfirmText||`Uploading this archive REPLACES ${this.binFileName} and the device's stored state files on the ${this.deviceName} AND REBOOTS IT. Validation is all-or-nothing: a rejected archive changes nothing. Continue?`}get effectiveBinConfirmText(){return this.binConfirmText||`Uploading REPLACES ${this.binFileName} on the ${this.deviceName} AND REBOOTS IT IMMEDIATELY. The device will be offline 20-60 seconds. Continue?`}render(){return F`
      <div class="stack">
        <section class="card" aria-labelledby="edc-download-heading">
          <h2 id="edc-download-heading">Download backup</h2>
          ${this.renderNotice(this.downloadNotice)}
          <div class="download-row">
            <div class="download-copy">
              <strong>Full backup (.zip)</strong>
              <p class="muted">${this.effectiveZipNotes}</p>
            </div>
            <button
              type="button"
              class="primary"
              data-action="download-backup"
              ?disabled=${this.downloading||this.phase!=="idle"}
              @click=${()=>{this.handleDownload("archive")}}
            >
              ${this.downloading?"Downloading…":"Download full backup (.zip)"}
            </button>
          </div>
          <div class="download-row">
            <div class="download-copy">
              <strong>${this.binFileName} only</strong>
              <p class="muted">${this.effectiveBinNotes}</p>
            </div>
            <button
              type="button"
              data-action="download-config"
              ?disabled=${this.downloading||this.phase!=="idle"}
              @click=${()=>{this.handleDownload("config")}}
            >
              Download ${this.binFileName} only
            </button>
          </div>
        </section>

        <section class="card" aria-labelledby="edc-restore-heading">
          <h2 id="edc-restore-heading">Restore from file</h2>
          <p class="muted">
            Restore a previously downloaded .zip full backup, or a single .bin
            config file. The device validates size, version and CRC and, for a
            full archive, commits all members atomically before rebooting. A
            rejected file changes nothing.
          </p>
          <label class="field" for="edc-restore-file">
            <span class="field-label">Backup file</span>
            <input
              id="edc-restore-file"
              type="file"
              accept=".zip,.bin,application/octet-stream"
              ?disabled=${this.busy}
              @change=${e=>this.handleFileChange(e)}
            />
            ${this.fileError?F`<span class="field-error" role="alert">${this.fileError}</span>`:M}
          </label>
          ${this.selectedFile&&!this.fileError?F`<p class="muted">
                Selected: ${this.selectedFile.name} (${this.selectedFile.size}
                bytes)${ct(this.selectedFile.name)==="archive"?" — full backup (all files)":` — ${this.binFileName} only`}
              </p>`:M}
          ${this.uploadError?F`<div class="banner banner-error" role="alert">
                ${this.uploadError}
              </div>`:M}
          <div class="form-actions">
            <button
              type="button"
              class="danger"
              data-action="upload"
              ?disabled=${!this.selectedFile||!!this.fileError||this.busy}
              @click=${()=>{this.handleUpload()}}
            >
              ${this.uploading?"Uploading…":"Upload & reboot device"}
            </button>
          </div>
        </section>
      </div>
      ${this.renderRebootOverlay()}
    `}renderNotice(e){return e?F`<div
      class="banner banner-${e.kind}"
      role=${e.kind==="error"?"alert":"status"}
    >
      ${e.message}
    </div>`:M}renderRebootOverlay(){return this.phase==="idle"?M:F`
      <div
        class="reboot-overlay"
        role="alertdialog"
        aria-modal="true"
        aria-label="Device rebooting"
      >
        <div class="reboot-dialog">
          <h2>Device is rebooting</h2>
          ${this.phase==="rebooting"?F`
                <p>
                  Waiting for the ${this.deviceName} to come back online. This
                  usually takes 20–60 seconds.
                </p>
                <p class="muted" aria-live="polite">
                  Polling device health…
                </p>
                <div class="spinner" aria-hidden="true"></div>
              `:M}
          ${this.phase==="ready"?F`
                <div class="banner banner-success" role="status">
                  The ${this.deviceName} is back online.
                </div>
                <div class="form-actions">
                  <button type="button" @click=${()=>this.dismissReboot()}>
                    Dismiss
                  </button>
                </div>
              `:M}
          ${this.phase==="timeout"?F`
                <div class="banner banner-error" role="alert">
                  No response after about two minutes. Check the power and
                  network, then keep waiting or dismiss.
                </div>
                <div class="form-actions">
                  <button type="button" @click=${()=>this.retryReboot()}>
                    Keep waiting
                  </button>
                  <button type="button" @click=${()=>this.dismissReboot()}>
                    Dismiss
                  </button>
                </div>
              `:M}
        </div>
      </div>
    `}createClient(){return en({baseUrl:this.baseUrl,backupPath:this.backupPath,configPath:this.configPath})}async handleDownload(e){if(!(this.downloading||this.phase!=="idle")){this.downloading=!0,this.downloadNotice=null;try{let r=this.createClient(),s=e==="archive"?await r.downloadBackup():await r.downloadConfig();if(!s.ok){this.downloadNotice={kind:"error",message:s.message};return}let i=e==="archive"?this.archiveFileName:this.binFileName;kn(s.data,i),this.downloadNotice={kind:"info",message:e==="archive"?`Full backup downloaded as ${i}.`:`Config downloaded as ${i}.`}}finally{this.downloading=!1}}}handleFileChange(e){let r=e.currentTarget,s=r.files&&r.files[0]?r.files[0]:null;this.selectedFile=s,this.uploadError=null,this.fileError=s?s.size===0?"The selected file is empty.":s.size>this.maxUploadBytes?`This does not look like a ${this.deviceName} backup file (max ${this.maxUploadBytes} bytes).`:ct(s.name)?null:wr:null}async handleUpload(){if(!this.selectedFile||this.fileError||this.busy)return;let e=ct(this.selectedFile.name);if(!e)this.uploadError=wr;else if(window.confirm(e==="archive"?this.effectiveZipConfirmText:this.effectiveBinConfirmText)){this.uploading=!0,this.uploadError=null;try{let r;try{r=new Uint8Array(await this.selectedFile.arrayBuffer())}catch{this.uploadError="Could not read the selected backup file.";return}let s=this.createClient(),i=e==="archive"?await s.uploadBackup(r):await s.uploadConfig(r);if(!i.ok){this.uploadError=i.message;return}if(this.clearSelection(),!this.isConnected)return;this.dispatchEvent(new CustomEvent("edc-restore-committed",{detail:{kind:e},bubbles:!0,composed:!0})),this.startReboot()}finally{this.uploading=!1}}}clearSelection(){this.selectedFile=null,this.fileError=null;let e=this.renderRoot.querySelector("#edc-restore-file");e&&(e.value="")}startReboot(){this._attempts=0,this.phase="rebooting",this.schedulePoll()}retryReboot(){this._attempts=0,this.phase="rebooting",this.schedulePoll()}dismissReboot(){this.clearPollTimer(),this.phase="idle"}schedulePoll(){this.clearPollTimer(),this._pollTimer=window.setTimeout(()=>{this._pollTimer=void 0,this.pollHealth()},yr)}clearPollTimer(){this._pollTimer!==void 0&&(window.clearTimeout(this._pollTimer),this._pollTimer=void 0)}async pollHealth(){if(this.phase!=="rebooting")return;let e=!1;try{let r=await fetch(`${this.baseUrl}${this.healthPath}`,{headers:{Accept:"application/json"}});if(r.ok){let s=await r.json();e=!!s&&typeof s=="object"&&s.healty===!0}}catch{e=!1}this.isConnected&&this.phase==="rebooting"&&(e?this.phase="ready":(this._attempts+=1,this._attempts*yr>=An?this.phase="timeout":this.schedulePoll()))}},te.properties={baseUrl:{type:String,attribute:"base-url"},backupPath:{type:String,attribute:"backup-path"},configPath:{type:String,attribute:"config-path"},healthPath:{type:String,attribute:"health-path"},deviceName:{type:String,attribute:"device-name"},archiveFileName:{type:String,attribute:"archive-file-name"},binFileName:{type:String,attribute:"bin-file-name"},maxUploadBytes:{type:Number,attribute:"max-upload-bytes"},zipNotes:{type:String,attribute:"zip-notes"},binNotes:{type:String,attribute:"bin-notes"},zipConfirmText:{type:String,attribute:"zip-confirm-text"},binConfirmText:{type:String,attribute:"bin-confirm-text"},downloading:{state:!0},downloadNotice:{state:!0},selectedFile:{state:!0},fileError:{state:!0},uploading:{state:!0},uploadError:{state:!0},phase:{state:!0}},te.styles=rn`
    :host {
      display: block;
      font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
      color: #1f2430;
      --_accent: var(--edc-accent, #2563eb);
      --_danger: var(--edc-danger, #dc2626);
      --_muted: var(--edc-muted, #6b7280);
      --_border: #e2e5ea;
      --_surface: #ffffff;
    }

    .stack {
      display: grid;
      gap: 1rem;
      max-width: 34rem;
    }

    .card {
      background: var(--_surface);
      border: 1px solid var(--_border);
      border-radius: 10px;
      padding: 1rem 1.25rem;
      box-shadow: 0 1px 2px rgba(16, 24, 40, 0.05);
    }

    h2 {
      font-size: 1rem;
      margin: 0 0 0.5rem;
    }

    p {
      margin: 0 0 0.75rem;
      font-size: 0.875rem;
      line-height: 1.45;
    }

    .muted {
      color: var(--_muted);
    }

    .form-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .download-row {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 1rem;
      padding: 0.75rem 0;
      border-top: 1px solid var(--_border);
    }

    .download-row:first-of-type {
      border-top: 0;
      padding-top: 0;
    }

    .download-row:last-of-type {
      padding-bottom: 0;
    }

    .download-copy {
      min-width: 0;
    }

    .download-copy p {
      margin-bottom: 0;
    }

    .download-copy strong {
      display: block;
      font-size: 0.85rem;
      margin-bottom: 0.2rem;
    }

    button {
      font: inherit;
      font-size: 0.85rem;
      padding: 0.45rem 0.85rem;
      border-radius: 8px;
      border: 1px solid var(--_border);
      background: var(--_surface);
      color: inherit;
      cursor: pointer;
    }

    button:hover:not(:disabled) {
      border-color: var(--_accent);
    }

    button.primary {
      background: var(--_accent);
      border-color: var(--_accent);
      color: #ffffff;
    }

    button.danger {
      background: var(--_danger);
      border-color: var(--_danger);
      color: #ffffff;
    }

    button:disabled {
      cursor: not-allowed;
      opacity: 0.55;
    }

    .field {
      display: grid;
      gap: 0.35rem;
      margin-bottom: 0.75rem;
    }

    .field-label {
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: var(--_muted);
    }

    input[type='file'] {
      font: inherit;
      font-size: 0.85rem;
      max-width: 100%;
    }

    .field-error {
      color: var(--_danger);
      font-size: 0.8rem;
    }

    .banner {
      margin: 0 0 0.75rem;
      padding: 0.5rem 0.75rem;
      border-radius: 8px;
      font-size: 0.85rem;
    }

    .banner-error {
      background: #fef2f2;
      border: 1px solid #fecaca;
      color: var(--_danger);
    }

    .banner-info {
      background: #eff6ff;
      border: 1px solid #bfdbfe;
      color: #1d4ed8;
    }

    .banner-success {
      background: #f0fdf4;
      border: 1px solid #bbf7d0;
      color: #15803d;
    }

    .reboot-overlay {
      position: fixed;
      inset: 0;
      z-index: 50;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
      background: rgba(15, 23, 42, 0.55);
    }

    .reboot-dialog {
      width: min(26rem, 100%);
      background: var(--_surface);
      border-radius: 12px;
      padding: 1.25rem;
      box-shadow: 0 20px 50px rgba(15, 23, 42, 0.35);
    }

    .spinner {
      width: 1.5rem;
      height: 1.5rem;
      border: 3px solid var(--_border);
      border-top-color: var(--_accent);
      border-radius: 50%;
      animation: edc-spin 0.9s linear infinite;
    }

    @keyframes edc-spin {
      to {
        transform: rotate(360deg);
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .spinner {
        animation: none;
      }
    }
  `,te);typeof customElements<"u"&&!customElements.get("edc-config-backup-page")&&customElements.define("edc-config-backup-page",Pn);const Sr=document.getElementById("app");Sr&&ys(a(gi,{}),Sr);
