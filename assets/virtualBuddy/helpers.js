// -----------------------------------------------------------------------------------------------
// HELPERS
// -----------------------------------------------------------------------------------------------



export function isMobile(){
  return /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
}

export function lerp(start, end, amt){
    return (1 - amt) * start + amt * end
}

export function getValue(value,el){

  if (value == undefined || value == null) return value
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
       : value.indexOf('deg') !== -1
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

export function transform(el, x = 0, y = 0, r = 0, s = 1) {

  let rad = r * (Math.PI / 180)
  let dx = Math.cos(rad) * s
  let dy = Math.sin(rad) * s
  let transform = `matrix(${dx},${dy},${-dy},${dx},${x},${y})`

  el.style.webkitTransform = transform;
  el.style.msTransform = transform;
  el.style.transform = transform;
}

export function getTransform(el) {

    let transform = {x:0,y:0,r: 0,s: 1}

    if(window.getComputedStyle){

      let style = getComputedStyle(el,null);

      let ts = style.getPropertyValue("-webkit-transform") ||
               style.getPropertyValue("-moz-transform") ||
               style.getPropertyValue("-ms-transform") ||
               style.getPropertyValue("-o-transform") ||
               style.getPropertyValue("transform")

      let mat = ts.match(/^matrix\((.+)\)$/)

      if (mat){

        let m = mat[1].split(',').map(v => parseFloat(v))

        let angle = Math.atan2(m[1], m[0])
        let denom = Math.pow(m[0], 2) + Math.pow(m[1], 2)
        let scaleX = Math.sqrt(denom)
        let scaleY = (m[0] * m[3] - m[2] * m[1]) / scaleX
        let skewX = Math.atan2(m[0] * m[2] + m[1] * m[3], denom)

        transform.x = m[4]
        transform.y = m[5]
        transform.r = angle / (Math.PI / 180)
        transform.s = scaleY
    }
  }
    return transform
}


export function getPosition(el){

  let w = el.offsetWidth
  let h = el.offsetHeight

  let bounds = el.getBoundingClientRect()
  let t = getTransform(el)
  let offset = getOffset(t.x, t.y, t.r, t.s, h, w)
  let position = {}

  position.height = h
  position.width = w
  position.top = bounds.top - offset.y + offset.ry - offset.sy
  position.left = bounds.left - offset.x + offset.rx - offset.sy
  position.bottom = position.top + position.height
  position.right = position.left + position.width

  return position

}

export function getOffset(x = 0,y = 0,r = 0,s = 1,h = 0,w = 0){

  let sh = h * s
  let sw = w * s
  let sx = (w - sw) / 2
  let sy = (h - sh) / 2
  let rx = 0
  let ry = 0

  if (r !== 0){
    let a = (r * Math.PI) / 180;
    let xAx = Math.cos(a);
    let xAy = Math.sin(a);
    let xc = 0
    let yc = 0
    let ox = sw / 2
    let oy = sh / 2
        xc -= ox;
        yc -= oy;

    let arr = [
      [
        xc * xAx - yc * xAy + ox,
        xc * xAy + yc * xAx + oy
      ],
      [
        (xc + sw) * xAx - yc * xAy + ox,
        (xc + sw) * xAy + yc * xAx + oy
      ],
      [
        (xc + sw) * xAx - (yc + sh) * xAy + ox,
        (xc + sw) * xAy + (yc + sh) * xAx + oy
      ],
      [
        xc * xAx - (yc + sh) * xAy + ox,
        xc * xAy + (yc + sh) * xAx + oy
      ]
    ];

    rx = Math.max(arr[0][0], arr[1][0], arr[2][0], arr[3][0]) - sw
    ry = Math.max(arr[0][1], arr[1][1], arr[2][1], arr[3][1]) - sh

  }

  return {x,y,rx,ry,sx,sy}

}
