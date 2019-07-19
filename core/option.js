export default {
  series: [],
  labels: [],
  margin: {
    top: 30,
    bottom: 30
  },
  xAxis: {
    font: {
      size: 13,
      family: 'Arial',
      style: '#333'
    },
    line: {
      style: '#333',
      width: 1
    },
    tick: {
      style: '#333',
      width: 1,
      length: 6
    }
  },
  yAxis: {
    font: {
      size: 13,
      family: 'Arial',
      style: '#333'
    },
    line: {
      style: '#333',
      width: 1
    },
    tick: {
      style: '#333',
      width: 1,
      length: 6
    }
  },
  guideLine: {
    style: '#ccc',
    width: 1
  },
  defaultLine: { // set default style of line
    isPoint: true,
    point: {
      fill: false,
      style: ''
    },
    style: {
      default: '#108ee9',
      select: 'red'
    }
  },
  duration: 500,
  tooltip: {
    title: '',
    style: 'rgba(0, 0, 0, 0.6)',
    height: 50,
    radius: 4,
    mark: {
      radius: 5
    },
    font: {
      size: 14,
      family: 'Arial',
      style: 'rgb(255, 255, 255)'
    }
  }
};
