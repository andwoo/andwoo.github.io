// const density = ' .:░▒▓█'
const density = 'Ñ@#W$9876543210?!abc;:+=-,._ '
const blockWidth = 6
const blockHeight = 6

const arrayAverage = (array) => array.reduce((acc, val) => {
  return acc + val
}, 0) / array.length

let testImage

function preload() {
  testImage = loadImage('/assets/images/building.jpeg')
}

function setup() {
  noCanvas();

  const container = document.getElementById('asciiContainer')
  const fontScale = (container.clientWidth / testImage.width) * 1.7
  container.style['fontSize'] = `${blockWidth * fontScale}px`
  container.style['lineHeight'] = `${(blockWidth / 1.75) * fontScale}px`
  container.style['color'] = '#e2e8f0'

  testImage.loadPixels()
  for (let y = 0; y < testImage.height; y += blockHeight) {
    let row = ''
    for (let x = 0; x < testImage.width; x += blockWidth) {
      const xBound = x + blockWidth > testImage.width ? testImage.width - 1 : x + blockWidth
      const yBound = y + blockHeight > testImage.height ? testImage.height - 1 : y + blockHeight
      const average = pixelsAverage(x, y, xBound, yBound, testImage)
      const densityIndex = floor(map(average, 0, 255, 0, density.length))
      row += density.charAt(densityIndex)
    }
    const div = createDiv(row)
    div.parent(container)
  }
}

function pixelsAverage(startX, startY, endX, endY, sourceImage) {
  let sum = 0
  let count = 0
  for (let x = startX; x <= endX; ++x) {
    for (let y = startY; y <= endY; ++y) {
      const pixelIndex = (x + y * sourceImage.width) * 4
      const r = sourceImage.pixels[pixelIndex + 0]
      const g = sourceImage.pixels[pixelIndex + 1]
      const b = sourceImage.pixels[pixelIndex + 2]
      sum += (r + g + b) / 3
      ++count
    }
  }
  return sum / count
}