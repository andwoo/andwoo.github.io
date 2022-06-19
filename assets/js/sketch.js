// const density = '  ░▒▓█'
const density = 'Ñ@#W$9876543210?!abc;:+=-,._ '
const blockWidth = 12
const blockHeight = 12
let video

function setup() {
  noCanvas();
  frameRate(16)
  video = createVideo('/assets/video/clouds.mp4', function () {
    const container = document.getElementById('asciiContainer')
    container.className = 'asciiContainerLoaded'
  })
  video.volume(0);
  video.loop();
  video.hide()
}

function draw() {
  const container = document.getElementById('asciiContainer')
  const fontScale = (container.clientWidth / video.width) * 1.7
  container.style['fontSize'] = `${blockWidth * fontScale}px`
  container.style['lineHeight'] = `${(blockWidth / 1.75) * fontScale}px`
  // container.style['color'] = '#e2e8f0'

  video.loadPixels()
  let imageText = ''
  for (let y = 0; y < video.height; y += blockHeight) {
    for (let x = 0; x < video.width; x += blockWidth) {
      const xBound = x + blockWidth > video.width ? video.width - 1 : x + blockWidth
      const yBound = y + blockHeight > video.height ? video.height - 1 : y + blockHeight
      const average = pixelsAverage(x, y, xBound, yBound, video)
      const densityIndex = floor(map(average, 0, 255, 0, density.length))
      const character = density.charAt(densityIndex)
      imageText += character === ' ' ? '&nbsp;' : character
    }
    imageText += '</br>'
  }
  container.innerHTML = imageText
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