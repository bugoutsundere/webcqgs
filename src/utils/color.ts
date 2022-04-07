import { graphic } from 'echarts'

const colors: any = {
  blue: ['#3955FF', '#2EC8CF'],
  blue2: ['#007991', '#78ffd6'],
  blue3: ['#0000FC', '#00CEFC'],
  red: ['#c31432', '#FFA07A'],
  red2: ['#FF4E50', '#F9D423'],
  red3: ['#E55D87', '#5FC3E4'],
  yellow: ['#EDE574', '#f8b500'],
  yellow2: ['#F7971E', '#FFD200'],
  yellow3: ['#EF4689', '#CFF314'],
  green: ['#1d976c', '#93f9b9'],
  green2: ['#159957', '#34e89e'],
  green3: ['#00ED61', '#AF9CA2'],
  purple: ['#7801FF', '#FF018F'],
  blueOrange: ['#3300D7', '#FFB834'],
  greenWhite: ['#25E0CE', '#A9FFF8'],
  redWhite: ['#F25555', '#FDC9C7'],
}

export function useGradient(name: string, direction = 'horizontal') {
  if (!colors.hasOwnProperty(name)) {
    return '#fff'
  }
  const colorDic: string[] = colors[name]
  const color = [
    { offset: 0, color: colorDic[0] },
    { offset: 1, color: colorDic[1] },
  ]

  if (direction === 'vertical') {
    return new graphic.LinearGradient(0, 0, 0, 1, color)
  } else if (direction === 'horizontal') {
    return new graphic.LinearGradient(0, 0, 1, 0, color)
  } else {
    throw Error('undefined direction')
  }
}

export function useStyleGradient(name: string, direction = 'right') {
  if (!colors.hasOwnProperty(name)) {
    return '#fff'
  }
  const colorDic: string[] = colors[name]
  return `linear-gradient(to ${direction}, ${colorDic[0]},${colorDic[1]})`
}
