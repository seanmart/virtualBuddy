export function lerp(start, end, amt){
    return (1 - amt) * start + amt * end
}

export function getValue(value,el){

  if (value == undefined || value == null) return undefined
  if (type('number', value) || type('function', value)) return value

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

export function rotateRect(angle,height,width){

    let a = (angle * Math.PI) / 180;
    let xAx = Math.cos(a);  // x axis x
    let xAy = Math.sin(a);
    let w = width
    let h = height
    let x = 0
    let y = 0
    let ox = w / 2
    let oy = h / 2
    x -= ox;  // move rectangle onto origin
    y -= oy;

    let r = [[ // return array holding the resulting points
            x * xAx - y * xAy + ox,   // Get the top left rotated position
            x * xAy + y * xAx + oy,   // and move it back to the origin
        ], [
            (x + w) * xAx - y * xAy + ox,   // Get the top right rotated position
            (x + w) * xAy + y * xAx + oy,
        ], [
            (x + w) * xAx - (y + h) * xAy + ox,   // Get the bottom right rotated position
            (x + w) * xAy + (y + h) * xAx + oy,
        ], [
            x * xAx - (y + h) * xAy + ox,   // Get the bottom left rotated position
            x * xAy + (y + h) * xAx + oy,
        ]
    ];

    return{
      left: Math.min(r[0][0], r[1][0], r[2][0], r[3][0]),
      right: Math.max(r[0][0], r[1][0], r[2][0], r[3][0]) - w,
      top: Math.min(r[0][1], r[1][1], r[2][1], r[3][1]),
      bottom: Math.max(r[0][1], r[1][1], r[2][1], r[3][1]) - h
    }




}
