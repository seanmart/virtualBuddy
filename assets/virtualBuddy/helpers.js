export function lerp(start, end, amt){
    return (1 - amt) * start + amt * end
}

export function getValue(value,el){

  if (value == undefined || value == null) return undefined
  if (is('number', value) || is('function', value)) return value

  let parsedValue = parseFloat(value)

  return value.indexOf('%y') !== -1
            ? parsedValue * (el.offsetHeight/100)
       : value.indexOf('%x') !== -1
            ? parsedValue * (el.offsetWidth/100)
       : value.indexOf('vh') !== -1
            ? parsedValue * (window.innerHeight / 100)
       : value.indexOf('vw') !== -1
           ? parsedValue * (window.innerWidth / 100)
       : value.indexOf('px') !== -1
           ? parsedValue
       : 0
}

export function type(type,value){

  switch(type){
    case 'boolean':
    return typeof value === "boolean"
    case 'array':
    return Array.isArray(value)
    case 'object':
    return value === Object(value);
    case 'float':
    return Number(value) === value && value % 1 !== 0;
    case 'int':
    return Number(value) === value && value % 1 === 0;
    case 'number':
    return !isNaN(value)
    case 'function':
    typeof value === "function"
  }
}

export function isDescendant(parent, child) {
     var node = child.parentNode;
     while (node != null) {
         if (node == parent) {
             return true;
         }
         node = node.parentNode;
     }
     return false;
}

export function getPosition(el){

  let position = {}

  position.top = getTop(el)
  position.left = getLeft(el)
  position.bottom = position.top + el.offsetHeight
  position.right = position.left + el.offsetWidth

  return position

}

export function getTranslate(el) {
    const translate = {}
    if(!window.getComputedStyle) return ;

    const style = getComputedStyle(el);
    const transform = style.transform || style.webkitTransform || style.mozTransform;

    if (!transform) return
    let mat = transform.match(/^matrix3d\((.+)\)$/);
    if(mat) return parseFloat(mat[1].split(', ')[13]);

    mat = transform.match(/^matrix\((.+)\)$/);
    translate.x = mat ? parseFloat(mat[1].split(', ')[4]) : 0;
    translate.y = mat ? parseFloat(mat[1].split(', ')[5]) : 0;

    return translate;
}

export function minMax(value,min,max){
  return Math.max(Math.min(value,max),min)
}

export function getTop(el){
  let top = 0
  do {
    top += el.offsetTop
    el = el.offsetParent;
  } while(el)
  return top
}

export function getLeft(el){
  let left = 0
  do {
    left += el.offsetLeft
    el = el.offsetParent
  } while(el)
  return left
}
