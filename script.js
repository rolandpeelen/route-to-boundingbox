
const drawCircle = (context, point, color = 'green') => {
  // Draw intersecting circle
  context.beginPath();
  context.arc(point.x, point.y, 10, 0, 2 * Math.PI, false);
  context.fillStyle = color;
  context.fill();
}

const average = (a,b) => (a + b) / 2

const canvas = document.getElementById("myCanvas");
const logElem = document.getElementById("log");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext("2d");
ctx.strokeStyle = "black";
ctx.lineJoin = ctx.lineCap = "round";
ctx.lineWidth = 3;

const maxLength = 50;
const offset = 10; // length of end lines

const log = (...args) => {
  logElem.innerHTML += '<br />';
  [...args].map(thingy => logElem.innerHTML += ` ${JSON.stringify(thingy)}`)
}

const determineDirection = (a, b) => {
  const NS = a.y > b.y ? 'N' : 'S';
  const EW = a.x < b.x ? 'E' : 'W';
  return `${NS}${EW}`
}

const createBoundingBox = (a, b, direction) => {
  switch(direction) {
      // In the cases NW and NE, we need to flip the values to have the proper one up top
    case 'SE':
      return {
        NW: {x: a.x - offset, y: a.y - offset},
        SE: {x: b.x + offset, y: b.y + offset}
      }
    case 'SW':
      return {
        NW: {x: b.x - offset, y: a.y - offset},
        SE: {x: a.x + offset, y: b.y + offset}
      }
    case 'NW':
      return {
        NW: {x: b.x - offset, y: b.y - offset},
        SE: {x: a.x + offset, y: a.y + offset}
      }
    case 'NE':
      return {
        NW: {x: a.x - offset, y: b.y - offset},
        SE: {x: b.x + offset, y: a.y + offset}
      }
    default: null;
  }
}

const points = [
  {x: 40, y: 40},
  {x: 500, y: 200},
  {x: 400, y: 500},
  {x: 200, y: 400},
  {x: 250, y: 300},
  {x: 800, y: 500},

];
const newPoints = [];
for (let i = 0; i < points.length - 1; i ++){
  const a = points[i];
  const b = points[i + 1];

  ctx.moveTo(a.x, a.y);
  ctx.lineTo(b.x, b.y);
  ctx.stroke();


  const direction = determineDirection(a,b);
  const A = Math.abs(b.x - a.x);
  const B = Math.abs(b.y - a.y);
  const pyth = Math.sqrt((A * A) + (B * B));
  const surfaceArea = pyth * pyth / 2;

  if(pyth > maxLength) {
    const factor = Math.ceil(pyth / maxLength); // we need the factor so we can know how many points we'll need;
    const offsetX = Math.abs(b.x - a.x) / factor; // with the factor we can set the offset for each item
    const offsetY = Math.abs(b.y - a.y) / factor; // Same for Y
    const totalPoints = [a]; // Start by adding the initial point as we'll need that anyway
    for (let j = 1; j < factor; j++){ // loop the amount of the factor and add all of them
      let p;
      const offsetP = {
        x: offsetX * j,
        y: offsetY * j
      }

      switch(direction) {
          // In the cases NW and NE, we need to flip the values to have the proper one up top
        case 'SE':
          p = {x: a.x + offsetP.x, y: a.y + offsetP.y};
          break;
        case 'SW':
          p = {x: a.x - offsetP.x, y: a.y + offsetP.y};
          break;
        case 'NW':
          p = {x: a.x - offsetP.x, y: a.y - offsetP.y};
          break;
        case 'NE':
          p = {x: a.x + offsetP.x, y: a.y - offsetP.y};
          break;
        default: null;
      }
      totalPoints.push(p);
    }
    totalPoints.push(b); // Add the last pont as we'll need that as well

    // Loop through the points and add the boundingboxes;
    for(let j = 0; j < totalPoints.length - 1; j++) {
      const a = totalPoints[j];
      const b = totalPoints[j + 1];
      newPoints.push(createBoundingBox(a, b, direction));
    }
  } else {
    // if we can just add the two bounding boxes, we're good to go instantly
    newPoints.push(createBoundingBox(a, b, direction));
  }
}

newPoints.map(({NW, SE}) => {
  ctx.setLineDash([5, 5]);
  drawCircle(ctx, NW);
  drawCircle(ctx, SE, 'red');
  ctx.strokeStyle = '#ff0000'
  ctx.moveTo(NW.x, NW.y);
  ctx.lineTo(SE.x, NW.y);
  ctx.lineTo(SE.x, SE.y);
  ctx.lineTo(NW.x, SE.y);
  ctx.lineTo(NW.x, NW.y);

  ctx.stroke();
  ctx.setLineDash([]);
  ctx.strokeStyle = '#000000'
})

