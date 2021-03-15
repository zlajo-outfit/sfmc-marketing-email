
console.clear();

<!-- START Word Counter -->
function wordCounter() {
    const containers = document.querySelectorAll('[data-wc-hook="container"]');
    
    for ( const container of containers ) {
      const max = container.dataset.wcMax;
      const wordsCount = container.innerText.split(' ').length;  
  
      if ( wordsCount > max ) {
        container.classList.add('overflow');
      } else {
        container.classList.remove('overflow');
      }
    }
  };
<!-- END Word Counter -->


<!--START MaxHeightCheck -->
/*
    Detailed instruction can be found here:
    https://github.com/aleks-frontend/max-height-check
    */

function maxHeightCheck(variation = 'primary') {
  const isExportMode = window.location.href.indexOf('exports') > -1;
  const preventExportOverflow = document.body.dataset.preventExportOverflow === 'true';
  const isProjectKit = window.parent.document.querySelector(".preview-frame");

  if ( ( isExportMode && preventExportOverflow ) || isProjectKit ) return;

  const textBlocks = document.querySelectorAll('[data-max-height]');

  textBlocks.forEach(block => {
    const dynamicCheck = block.dataset.maxHeight == 'dynamic' || block.dataset.maxHeightDynamic == 'true';
    if ( dynamicCheck ) dynamicAssign(block);

    const cssCheck = block.dataset.maxHeight == 'css';
    const bodyComputedStyle = window.getComputedStyle(document.body);
    const blockHeight = block.scrollHeight;
    const unit = block.dataset.maxHeightUnit || 'px';
    const maxHeightAlt = block.dataset.maxHeightAlt || block.dataset.maxHeight;
    let maxHeight = (variation == 'primary') ? block.dataset.maxHeight : maxHeightAlt;    

    if ( cssCheck ) {
      const computedBlockStyle = window.getComputedStyle(block);
      maxHeight = parseInt(computedBlockStyle.maxHeight);
    } else {
      // Setting the element's max-height
      block.style.maxHeight = maxHeight + unit;

      // Recalculating maxHeight in case 'rem' is set as a unit
      if ( unit == 'rem' ) maxHeight = maxHeight * parseFloat(bodyComputedStyle.fontSize);      
    }

    // Adding an 'overflow' class to an element if it's offset height exceedes the max-line-height
    ( blockHeight > maxHeight ) ? block.classList.add('overflow') : block.classList.remove('overflow');
  });
}

function dynamicAssign(element) {
  const container = element.parentNode;
  container.style.overflow = 'hidden';
  const containerComputed = {
    height: parseFloat(window.getComputedStyle(container).height),
    top: parseFloat(window.getComputedStyle(container).paddingTop),
    bottom: parseFloat(window.getComputedStyle(container).paddingBottom)
  };
  const containerHeight = Math.floor(containerComputed.height - containerComputed.top - containerComputed.bottom);
  const subtrahends = [...container.querySelectorAll('.js-subtrahend')];

  const subtrahendsHeight = subtrahends.reduce((totalHeight, subtrahend) => {
    const subtrahendMargins = {
      top: parseFloat(window.getComputedStyle(subtrahend).marginTop),
      bottom: parseFloat(window.getComputedStyle(subtrahend).marginBottom)
    };
    return totalHeight + subtrahend.offsetHeight + subtrahendMargins.top + subtrahendMargins.bottom;
  }, 0);

  const dynamicHeight = containerHeight - subtrahendsHeight;

  element.dataset.maxHeightDynamic = 'true';
  element.dataset.maxHeight = dynamicHeight;
  container.style.overflow = 'visible';
}

<!-- END MaxHeightCheck --> 



<!-- START MaxLineCheck --> 

/**
  *Detailed instruction can be found here:  ???
*/
function maxLineCheck(orientation = 'portrait') {
  const isExportMode = window.location.href.indexOf('exports') > -1;
  const preventExportOverflow = document.body.dataset.preventExportOverflow === 'true';
  const isProjectKit = window.parent.document.querySelector(".preview-frame");

  if ( ( isExportMode && preventExportOverflow ) || isProjectKit ) return;

  const textBlocks = document.querySelectorAll('[data-max-line]');

  textBlocks.forEach(block => {
    const computedStyle = window.getComputedStyle(block);
    // Checking if line-height is not set and has a normal value set by default
    const isNormal = computedStyle.getPropertyValue('line-height') == 'normal';
    // Getting the font-size of an element that will help us calculate the line-height
    // if the line-height is set to 'normal'
    const fontSize = parseFloat(computedStyle.getPropertyValue('font-size'));
    // If line-height is normal, we multiply the element's font-size with 1.14
    if ( isNormal ) block.style.lineHeight = (fontSize * 1.14) + 'px';
    const lineHeight = parseFloat(computedStyle.getPropertyValue('line-height'));
    const blockHeight = block.scrollHeight;
    // Getting the data-max-line attribute value (max number of lines allowed)
    const maxLineAlt = block.dataset.maxLineAlt || block.dataset.maxLine;
    const maxLine = (orientation == 'portrait') ? block.dataset.maxLine : maxLineAlt;
    // Setting the element's max-height 
    const limitHeight = (lineHeight * maxLine) + (lineHeight / 2);

    block.style.maxHeight = limitHeight + 'px';
    ( blockHeight > limitHeight ) ? block.classList.add('overflow') : block.classList.remove('overflow');
  });
}

<!-- END MaxLineCheck -->  

<!-- START allImagesLoadedCallback -->

function allImagesLoadedCallback() {
  let imagesLoaded = 0;
  const images = document.querySelectorAll('img')
  const totalImages = images.length;

  images.forEach((img) => {
    const tempImg = document.createElement('img');
    tempImg.onload = () => {
      imageLoaded();
    }

    tempImg.src = img.src;
  });

  if ( images.length === 0 ) {
    allImagesLoaded();    
  }

  function imageLoaded() {
    imagesLoaded++;
    if (imagesLoaded == totalImages) {
      allImagesLoaded();
    }
  }

  function allImagesLoaded() {
    maxLineCheck();
    maxHeightCheck();
    TextFit.fit({
      selector: '.textFit'
    });
  }        
}

<!-- END allImagesLoadedCallback -->


<!-- START font face observer-->

/* Font Face Observer v2.1.0 - © Bram Stein. License: BSD-3-Clause */(function(){'use strict';var f,g=[];function l(a){g.push(a);1==g.length&&f()}function m(){for(;g.length;)g[0](),g.shift()}f=function(){setTimeout(m)};function n(a){this.a=p;this.b=void 0;this.f=[];var b=this;try{a(function(a){q(b,a)},function(a){r(b,a)})}catch(c){r(b,c)}}var p=2;function t(a){return new n(function(b,c){c(a)})}function u(a){return new n(function(b){b(a)})}function q(a,b){if(a.a==p){if(b==a)throw new TypeError;var c=!1;try{var d=b&&b.then;if(null!=b&&"object"==typeof b&&"function"==typeof d){d.call(b,function(b){c||q(a,b);c=!0},function(b){c||r(a,b);c=!0});return}}catch(e){c||r(a,e);return}a.a=0;a.b=b;v(a)}}
                                                                                 function r(a,b){if(a.a==p){if(b==a)throw new TypeError;a.a=1;a.b=b;v(a)}}function v(a){l(function(){if(a.a!=p)for(;a.f.length;){var b=a.f.shift(),c=b[0],d=b[1],e=b[2],b=b[3];try{0==a.a?"function"==typeof c?e(c.call(void 0,a.b)):e(a.b):1==a.a&&("function"==typeof d?e(d.call(void 0,a.b)):b(a.b))}catch(h){b(h)}}})}n.prototype.g=function(a){return this.c(void 0,a)};n.prototype.c=function(a,b){var c=this;return new n(function(d,e){c.f.push([a,b,d,e]);v(c)})};
                                                                                 function w(a){return new n(function(b,c){function d(c){return function(d){h[c]=d;e+=1;e==a.length&&b(h)}}var e=0,h=[];0==a.length&&b(h);for(var k=0;k<a.length;k+=1)u(a[k]).c(d(k),c)})}function x(a){return new n(function(b,c){for(var d=0;d<a.length;d+=1)u(a[d]).c(b,c)})};window.Promise||(window.Promise=n,window.Promise.resolve=u,window.Promise.reject=t,window.Promise.race=x,window.Promise.all=w,window.Promise.prototype.then=n.prototype.c,window.Promise.prototype["catch"]=n.prototype.g);}());

(function(){function l(a,b){document.addEventListener?a.addEventListener("scroll",b,!1):a.attachEvent("scroll",b)}function m(a){document.body?a():document.addEventListener?document.addEventListener("DOMContentLoaded",function c(){document.removeEventListener("DOMContentLoaded",c);a()}):document.attachEvent("onreadystatechange",function k(){if("interactive"==document.readyState||"complete"==document.readyState)document.detachEvent("onreadystatechange",k),a()})};function t(a){this.a=document.createElement("div");this.a.setAttribute("aria-hidden","true");this.a.appendChild(document.createTextNode(a));this.b=document.createElement("span");this.c=document.createElement("span");this.h=document.createElement("span");this.f=document.createElement("span");this.g=-1;this.b.style.cssText="max-width:none;display:inline-block;position:absolute;height:100%;width:100%;overflow:scroll;font-size:16px;";this.c.style.cssText="max-width:none;display:inline-block;position:absolute;height:100%;width:100%;overflow:scroll;font-size:16px;";
this.f.style.cssText="max-width:none;display:inline-block;position:absolute;height:100%;width:100%;overflow:scroll;font-size:16px;";this.h.style.cssText="display:inline-block;width:200%;height:200%;font-size:16px;max-width:none;";this.b.appendChild(this.h);this.c.appendChild(this.f);this.a.appendChild(this.b);this.a.appendChild(this.c)}
            function u(a,b){a.a.style.cssText="max-width:none;min-width:20px;min-height:20px;display:inline-block;overflow:hidden;position:absolute;width:auto;margin:0;padding:0;top:-999px;white-space:nowrap;font-synthesis:none;font:"+b+";"}function z(a){var b=a.a.offsetWidth,c=b+100;a.f.style.width=c+"px";a.c.scrollLeft=c;a.b.scrollLeft=a.b.scrollWidth+100;return a.g!==b?(a.g=b,!0):!1}function A(a,b){function c(){var a=k;z(a)&&a.a.parentNode&&b(a.g)}var k=a;l(a.b,c);l(a.c,c);z(a)};function B(a,b){var c=b||{};this.family=a;this.style=c.style||"normal";this.weight=c.weight||"normal";this.stretch=c.stretch||"normal"}var C=null,D=null,E=null,F=null;function G(){if(null===D)if(J()&&/Apple/.test(window.navigator.vendor)){var a=/AppleWebKit\/([0-9]+)(?:\.([0-9]+))(?:\.([0-9]+))/.exec(window.navigator.userAgent);D=!!a&&603>parseInt(a[1],10)}else D=!1;return D}function J(){null===F&&(F=!!document.fonts);return F}
            function K(){if(null===E){var a=document.createElement("div");try{a.style.font="condensed 100px sans-serif"}catch(b){}E=""!==a.style.font}return E}function L(a,b){return[a.style,a.weight,K()?a.stretch:"","100px",b].join(" ")}
            B.prototype.load=function(a,b){var c=this,k=a||"BESbswy",r=0,n=b||3E3,H=(new Date).getTime();return new Promise(function(a,b){if(J()&&!G()){var M=new Promise(function(a,b){function e(){(new Date).getTime()-H>=n?b(Error(""+n+"ms timeout exceeded")):document.fonts.load(L(c,'"'+c.family+'"'),k).then(function(c){1<=c.length?a():setTimeout(e,25)},b)}e()}),N=new Promise(function(a,c){r=setTimeout(function(){c(Error(""+n+"ms timeout exceeded"))},n)});Promise.race([N,M]).then(function(){clearTimeout(r);a(c)},
b)}else m(function(){function v(){var b;if(b=-1!=f&&-1!=g||-1!=f&&-1!=h||-1!=g&&-1!=h)(b=f!=g&&f!=h&&g!=h)||(null===C&&(b=/AppleWebKit\/([0-9]+)(?:\.([0-9]+))/.exec(window.navigator.userAgent),C=!!b&&(536>parseInt(b[1],10)||536===parseInt(b[1],10)&&11>=parseInt(b[2],10))),b=C&&(f==w&&g==w&&h==w||f==x&&g==x&&h==x||f==y&&g==y&&h==y)),b=!b;b&&(d.parentNode&&d.parentNode.removeChild(d),clearTimeout(r),a(c))}function I(){if((new Date).getTime()-H>=n)d.parentNode&&d.parentNode.removeChild(d),b(Error(""+
n+"ms timeout exceeded"));else{var a=document.hidden;if(!0===a||void 0===a)f=e.a.offsetWidth,g=p.a.offsetWidth,h=q.a.offsetWidth,v();r=setTimeout(I,50)}}var e=new t(k),p=new t(k),q=new t(k),f=-1,g=-1,h=-1,w=-1,x=-1,y=-1,d=document.createElement("div");d.dir="ltr";u(e,L(c,"sans-serif"));u(p,L(c,"serif"));u(q,L(c,"monospace"));d.appendChild(e.a);d.appendChild(p.a);d.appendChild(q.a);document.body.appendChild(d);w=e.a.offsetWidth;x=p.a.offsetWidth;y=q.a.offsetWidth;I();A(e,function(a){f=a;v()});u(e,
L(c,'"'+c.family+'",sans-serif'));A(p,function(a){g=a;v()});u(p,L(c,'"'+c.family+'",serif'));A(q,function(a){h=a;v()});u(q,L(c,'"'+c.family+'",monospace'))})})};"object"===typeof module?module.exports=B:(window.FontFaceObserver=B,window.FontFaceObserver.prototype.load=B.prototype.load);}());

<!--END font face observer-->


// Tracking text changes and firing text restriction functions (mutationObserver)
const overflowObserver = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    maxLineCheck();
    maxHeightCheck();
    wordCounter();
  });
});

const injectObserver = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    injectDynamicContent();
  });
});      

const injectSources = document.querySelectorAll('[data-target-id]');

overflowObserver.observe(document.body, {
  attributes: false,
  characterData: true,
  childList: true,
  subtree: true,
  attributeOldValue: false,
  characterDataOldValue: true
});

if ( injectSources.length > 0 ) {
  injectSources.forEach(src => {
    injectObserver.observe(src, {
      attributes: false,
      characterData: true,
      childList: true,
      subtree: true,
      attributeOldValue: false,
      characterDataOldValue: true
    });            
  });
}    

// Calling text size restriction functions once the fonts are loaded
// All external font-families need to be added to 'fonts' array
window.addEventListener('load', function(event) {
  const fonts = ['Helvetica Neue', 'Helvetica', 'Arial'];
  const fontObservers = [];

  fonts.forEach(font => {
    const obs = new FontFaceObserver(font);
    fontObservers.push(obs.load())
  });

  Promise.all(fontObservers).then(() => {

    allImagesLoadedCallback();
    wordCounter();
   
    

    document.dispatchEvent(new Event('printready'));
  });
});      

