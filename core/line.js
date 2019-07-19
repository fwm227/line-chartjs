
import optionManager from './option.js';

var pointInfns = ['x', 'y', 'line_w', 'val'];
var lineInfos = ['points', 'p_conf', 'd_style', 'a_style'];

/**
 * Create point
 * @return {Object} the point instance
 */
function createPoint () {
  var point = Object.create(null);
  var arg = arguments;
  pointInfns.forEach(function (info, idx) {
    point[info] = arg[idx];
  });
  return point;
}

/**
 * Create line
 * @return {Object} item instance of line-chart
 */
function createLine () {
  var line = Object.create(null);
  var args = arguments;
  lineInfos.forEach(function (info, idx) {
    line[info] = args[idx];
  });
  return line;
}

/**
 * Draw line
 */
function drawLine (ctx, line, isSelect) {

  var points = line.points;
  var radius = line['p_conf'].radius;
  var isFill = line['p_conf'].fill;

  ctx.strokeStyle = line.d_style;
  if (!line.d_style) ctx.fillStyle = optionManager.defaultLine.style.default;

  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (var i = 0; i < points.length; i++) {
    if (i < points.length - 1) ctx.lineTo(points[i + 1].x, points[i + 1].y);
    ctx.stroke();
  };
}

export {
  createPoint,
  createLine,
  drawLine
};
