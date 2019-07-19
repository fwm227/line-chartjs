import {createPoint, createLine, drawLine} from './line.js';
import drawFrame from './frame.js';
import helpers from './helpers.js';
import optionManager from './option.js';
import drawTooltip from './tooltip.js';

/**
 * Throw exception
 * @param  {Object} err - exception object
 */
function throwException (err) {
  throw err;
}

/**
 * Init line-chart
 * @param  {[type]} ctx     context of line-chart
 * @param  {[type]} options config options
 */
lineChart.prototype._init = function (canvasDom, option) {
  this.initContext(canvasDom);
  this.initOption(option);
  this.initData();
  this.caculateScele();
  this.initlines();
  // this.initEvent(canvasDom);
  this.render();
};

/**
 * Init event
 * @param  {Dom} canvasDom canvas dom
 */
lineChart.prototype.initEvent = function (canvasDom) {
  var self = this;

  var move_position = Object.create(null);
  canvasDom.addEventListener('mousemove', function () {
    move_position.x = event.clientX - self.boundingRect.left;
    move_position.y = event.clientY - self.boundingRect.top;

    clearTimeout(timer);
    var timer = setTimeout(function () {
      self.context.clearRect(0, 0, self.canvasW, self.canvasH);
      drawFrame(self);
      self.drawLines(move_position);
    }, 1000 / 60);
  });
};

/**
 * Init data
 */
lineChart.prototype.initData = function () {
  if (optionManager.series.length > 1) this.series = true;

  this.animIdx = 0;
  var totalData = [];
  optionManager.series.forEach(function (item, idx) {
    totalData = totalData.concat(item.data);
  });
  this.min_data = Math.min(...totalData);
  this.max_data = Math.max(...totalData);
  this.max_abs_data = Math.max(Math.abs(this.min_data), Math.abs(this.max_data));
};

/**
 * Init context
 * @param  {Object} ctx context of line-chart
 */
lineChart.prototype.initContext = function (canvasDom) {
  this.boundingRect = canvasDom.getBoundingClientRect();
  if (canvasDom.nodeType === Node.ELEMENT_NODE && canvasDom.nodeName === 'CANVAS') {
    this.canvasW = canvasDom.width;
    this.canvasH = canvasDom.height;
    this.context = canvasDom.getContext('2d');
  }
  else throwException(new Error('Context should be a canvas DOM'));
};

/**
 * Init option
 * @param  {Object} opt - config option
 */
lineChart.prototype.initOption = function (opt) {
  var setOption = function setOption (option, optionManager) {
    Object.keys(option).forEach(function (key) {
      if (option[key] && !helpers.isObject(option[key])) optionManager[key] = option[key];
      else if (helpers.isObject(option[key])) setOption(option[key], optionManager[key]);
    });
  };
  setOption(opt, optionManager);
};

/**
 * Init data of line-chart
 */
lineChart.prototype.initlines = function () {
  var self = this;

  self.lines = [];
  self.phyScale = (self.areaH - optionManager.margin.top) / (self.tick[1] - self.tick[0]);
  var step_len = self.areaW / (optionManager.labels.length + 1);

  optionManager.series.forEach(function (item, index) {
    var points = [];
    var point_step = step_len;
    var point_config = item.point;
    // set default style
    if (!helpers.isObject(item.style)) {
      item.style = Object.create(null);
      item.style.default = optionManager.defaultLine.style.default;
      item.style.active = optionManager.defaultLine.style.select;
    }
    item.data.forEach(function (val, idx) {
      var point = createPoint(point_step + self.yAxis_left, self.areaH + self.tick[0] * self.phyScale - val * self.phyScale, 1, val);
      points.push(point);
      point_step += step_len;
    });
    self.lines.push(createLine(points, point_config, item.style.default, item.style.active));
  });
};

/**
 * Saculate scalue
 */
lineChart.prototype.caculateScele = function () {
  var self = this;

  self.tick = helpers.getTick(self.min_data >= 0 ? 0 : self.min_data, self.max_data);
  self.context.font = `${optionManager.yAxis.font.size} ${optionManager.yAxis.font.size}`;
  self.yAxis_left = parseInt(3 * self.context.measureText(self.tick[1]).width);
  self.areaW = self.canvasW - self.yAxis_left;
  self.areaH = self.canvasH - optionManager.margin.bottom;
};

/**
 * Render line-chart
 */
lineChart.prototype.render = function () {
  var ctx = this.context;
  ctx.translate(0.5, 0.5);
  drawFrame(this);
  this.drawLines();
  this.animation();
};

/**
 * Draw line
 */
lineChart.prototype.drawLines = function (move_position) {
  var self = this, isSelect = false, selInfo;
  // var step_len = self.areaW / (optionManager.labels.length + 1);*/
  self.lines.forEach(function (line, idx) {
    drawLine(self.context, line);
  });
  /*self.lines.forEach(function (line, idx) {
    if (move_position &&
      (move_position.x > line.x && move_position.x < (line.x + line.w)) && ((
      move_position.y > (line.y + line.h) && move_position.y < line.y) ||
      move_position.y > line.y && move_position.y < (line.y + line.h))) {
      isSelect = true;
      selInfo = {
        label_val: optionManager.labels[Math.floor((move_position.x - self.yAxis_left) / step_len)],
        data_val: line.val,
        style: line.d_style
      };
    } else isSelect = false;
    drawLine(self.context, line, isSelect);
  });*/
  if (selInfo) drawTooltip(self.context, move_position, selInfo);
};

/**
 * Animation
 */
lineChart.prototype.animation = function () {
  var self = this;

  var ctx = self.context;
  var tickMove = (self.max_abs_data * self.phyScale) / (optionManager.duration * 1e-3 * 60);
  var baseLineH = self.areaH + self.tick[0] * self.phyScale;
  ctx.clearRect(0, 0, self.canvasW, self.canvasH);
  ctx.save();
  drawFrame(self);
  self.animIdx -= tickMove;
  var temp = self.animIdx;
  ctx.beginPath();
  ctx.rect(0, baseLineH - temp, self.canvasW, 2 * temp);
  ctx.closePath();
  ctx.clip();

  self.drawLines();
  if (self.animIdx > -1 * self.max_abs_data * self.phyScale) {
    var anim = self.animation.bind(self);
    helpers.requestAnimationFrame()(anim);
  }
  ctx.restore();
};

/**
 * line-chart constructor
 */
function lineChart (canvasDom, opt) {
  if (!(this instanceof lineChart)) {
    throwException(new Error('lineChart is constructor, should be involed with "new" operator!'));
  }
  this._init(canvasDom, opt);
};

export default lineChart;
