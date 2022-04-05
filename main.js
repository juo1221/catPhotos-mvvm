/*! For license information please see main.js.LICENSE.txt */
(()=>{"use strict";var e={d:(t,s)=>{for(var i in s)e.o(s,i)&&!e.o(t,i)&&Object.defineProperty(t,i,{enumerable:!0,get:s[i]})},o:(e,t)=>Object.prototype.hasOwnProperty.call(e,t)};e.d({},{Z:()=>L});const t=(e,t=document)=>t.querySelector(e),s=(e,...t)=>{const s="string"==typeof e?document.createElement(e):e;for(let e=0;e<t.length;){const i=t[e++],r=t[e++];"function"==typeof s[i]?s[i](...Array.isArray(r)?r:[r]):"@"==i[0]?s.style[i.substr(1)]=r:s[i]=r}return s},i=(e,...t)=>(t.reduce(((e,t)=>(e.appendChild(t),e)),s(e)),e),r=(e="invalid")=>{throw new Error(e)},a=(e,t)=>e instanceof t,n=()=>r("override!"),o=(e,t)=>Object.assign(e,t),d=new class extends WeakMap{get(){util.err("disable")}set(){util.err("disable")}has(){util.err("disable")}delete(){util.err("disable")}getInstance(e){return super.has(e.constructor)||super.set(e.constructor,e),super.get(e.constructor)}},c=class{observe(){}},h=class extends Set{add(e){a(e,c)||r(`invalid obj : ${e}`),super.add(e)}has(e){return a(e,c)||r(`invalid obj : ${e}`),super.has(e)}delete(e){a(e,c)||r(`invalid obj : ${e}`),super.delete(e)}notify(...e){this.forEach((t=>e.length?t.observe(...e):t.observe(this)))}},l=class extends h{constructor(e){return super(),e?d.getInstance(this):this}},v=class extends l{constructor(e){super(e),this._cachedList||o(this,{_cachedList:new Map}),this._breadCrumb||o(this,{_breadCrumb:[]})}async load(e=""){const t=await(await fetch(`https://zl3m4qq0l9.execute-api.ap-northeast-2.amazonaws.com/dev/${e}`)).json();o(this,{_list:t})}setList(e){o(this,{_list:e})}cached(e="root"){this._cachedList.set(e,this._list)}loadCached(e){o(this,{_list:this.cachedList.get(e)})}savePath(e){this._breadCrumb.push(e)}removePath(){this._breadCrumb.pop()}jumpTo(e){this._breadCrumb.some(((t,s)=>t===e&&this._breadCrumb.splice(s+1)))||this._breadCrumb.splice(0)}get path(){return this._breadCrumb}get list(){return this._list}get(e){let t;return this._list.some((s=>{if(s.id===e)return t=s,!0})),t}get cachedList(){return this._cachedList}},p=class extends c{constructor(e,t){return super(),o(e?d.getInstance(this):this,{_view:t})}render(){n()}observe(...e){this.render(...e)}get view(){return this._view}get viewModel(){return this._vm}set viewModel(e){o(this,{_vm:e}),e.add(this)}},u=class extends p{constructor(e){super(e,s("div"));t(".spinner")}render(e,r){const{view:a,viewModel:n}=this,o=document.createElement("template"),d=e.map((e=>`\n            <div class="Node" data-id=${e.id}> \n                <div class="div-fas" style="pointer-events:none"><i class="fas fa-${"DIRECTORY"===e.type?"folder-open":"file-image"}"></i></div>\n                <div style="pointer-events:none">${e.name}</div>\n            </div>`)).join(""),c=r.map((e=>`<div style="cursor:pointer">${e}</div>`)).join("");o.innerHTML=` \n        <nav class="Breadcrumb">\n            <div style="cursor:pointer">root</div>\n            ${c}\n        </nav>\n        <div class="Nodes">\n          <div class="Node  ${n._state?"visible":"invisible"}">\n            <div class="div-fas">\n              <i class="fas fa-caret-left"></i>\n            </div>\n          </div>\n        ${d}\n        </div>\n       \n        `,i(s(a,"innerHTML",""),o.content),setTimeout((()=>{t(".Nodes").addEventListener("click",(e=>n.$direct(e.target.dataset.id))),t(".div-fas").addEventListener("click",(e=>n.$prev())),t(".Breadcrumb").addEventListener("click",(e=>e.currentTarget!==e.target&&n.$jump(e.target.innerHTML)))}),0)}},m=class extends c{constructor(e){super(),o(this,{_vm:e})}observe(e){this._vm.listen(e)}},b=class extends h{constructor(e){super();const t=e?d.getInstance(this):this;return o(this,{_observer:new m(t)}),t}listen(){n()}get observer(){return this._observer}},_=class extends l{constructor(e){super(e),this._prevList||o(this,{_prevList:[],_prevState:!1})}save(e){a(e,v)||r(`invalid home model ${e}`),this._prevList.push(e.list)}load(){const e=this._prevList.pop();return 0===this._prevList.length&&o(this,{_prevState:!1}),e}setState(){o(this,{_prevState:!0})}savePath(e){this._breadCrumb=[...e]}removeList(e){this._prevList.some(((t,s)=>t===e&&this._prevList.splice(s)))||r(`현재 위치 입니다. : ${e}`),this._prevList.length||o(this,{_prevState:!1})}get state(){return this._prevState}get list(){return this._prevList[this._prevList.length-1]}get path(){return this._breadCrumb}},g=class{#e;constructor(e){a(e,v)||r(`invalid homeModel : ${e}`);const{list:t,path:s}=e;Array.isArray(t)&&t.length||r(`invalid list : ${t}`),t.forEach((e=>{const{id:t,name:s,type:i,filePath:a,parent:n}=e;"string"==typeof t&&t||r(`invalid id : ${t}`),"string"==typeof s&&s||r(`invalid name : ${s}`),"string"==typeof i&&i||r(`invalid type : ${i}`),a&&"string"!=typeof a&&r(`invalid filePath : ${a}`),n&&"string"!=typeof n.id&&r(`invalid parentID : ${n.id}`)})),Array.isArray(s)||r(`invalid path : ${s}`),s.every((e=>"string"==typeof e))||r(`invalid typeof path : ${s}`),this.#e={list:t,path:s}}get datas(){return this.#e}},y=class extends b{_state=!1;base(){const e=new v(!0),t=new _(!0);e.add(this.observer),t.add(this.observer),e.notify()}listen(e){switch(!0){case a(e,v):const{datas:t}=new g(e);this.notify(t.list,t.path);break;case a(e,_):const s=e.load();o(this,{_state:e.state}),this.notify(s,e.path)}}async $direct(e){if(e)try{const t=new v(!0),s=new _(!0),i=t.get(e);"DIRECTORY"===i.type?(s.save(t),s.savePath(t.path),s.setState(),o(this,{_state:s.state}),t.cachedList.has(i.name)?t.loadCached(i.name):(L.classList.toggle("invisible"),await t.load(e),L.classList.toggle("invisible"),t.cached(i.name)),t.savePath(i.name),t.notify()):window.open(`https://fe-dev-matching-2021-03-serverlessdeploymentbuck-t3kpj3way537.s3.ap-northeast-2.amazonaws.com/public${i.filePath}`)}catch(e){}}$prev(){const e=new v(!0),t=new _(!0);e.setList(t.list),e.removePath(),t.savePath(e.path),t.notify()}$jump(e){try{const t=new v(!0),s=new _(!0);t.cachedList.has(e)||err(`invalid path:${e}`);const i=t.cachedList.get(e);t.setList(i),t.jumpTo(e),s.removeList(i),o(this,{_state:s.state}),t.notify()}catch(e){}}},f=new class extends Map{constructor(e){super(),o(this,{_parent:e})}add(e,t,s){super.set(e,[t,s])}route(e,...r){const[a,n="base"]=[e],[o,d]=super.get(a).map((e=>e()));o.viewModel=d,d[n](...r),i(s(t(this._parent),"innerHTML",""),o.view)}}(".App"),w=t(".Loading");(async()=>{const e=new v(!0);await e.load(),w.classList.toggle("invisible"),e.cached(),f.add("home",(()=>new u(!0)),(()=>new y(!0))),f.route("home")})();const L=w})();