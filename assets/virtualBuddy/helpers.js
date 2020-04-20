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

export function minMax(value,min,max){
  return Math.max(Math.min(value,max),min)
}

export function transform(el, x = 0, y = 0, r = 0) {
  let transform = ""
  if (x || y) transform = `matrix3d(1,0,0.00,0,0.00,1,0.00,0,0,0,1,0,${x},${y},0,1) `;
  if (r) transform += `rotate3d(0,0,1,${r}deg)`

  el.style.webkitTransform = transform;
  el.style.msTransform = transform;
  el.style.transform = transform;
}

export function getPosition(el){

  let bounds = el.getBoundingClientRect()
  let transform = getTransform(el)
  let rotate = getRotation(transform.r,el.offsetHeight,el.offsetWidth)

  let position = {}

  position.height = el.offsetHeight
  position.width = el.offsetWidth
  position.top = bounds.top - transform.y - rotate.top
  position.left = bounds.left - transform.x - rotate.left
  position.bottom = position.top + position.height
  position.right = position.left + position.width

  return position

}

export function getTransform(el) {

    let transform = {x:0,y:0,r: 0}

    if(window.getComputedStyle){

      let style = getComputedStyle(el,null);

      let ts = style.getPropertyValue("-webkit-transform") ||
                      style.getPropertyValue("-moz-transform") ||
                      style.getPropertyValue("-ms-transform") ||
                      style.getPropertyValue("-o-transform") ||
                      style.getPropertyValue("transform")

      let mat = ts.match(/^matrix\((.+)\)$/)

      if (mat){

        let values = mat[1].split(',').map(v => parseFloat(v))

        transform.x = parseFloat(values[4])
        transform.y = parseFloat(values[5])
        transform.r = Math.round(Math.atan2(values[1], values[0]) * (180/Math.PI));

        //console.log(values)

      }
    }

    return transform
}

export function round(value,place){
  return parseFloat(value.toFixed(place))
}

export function getRotation(angle,height,width){

    if (!angle) return {left: 0, right: 0, bottom: 0, top: 0}

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
