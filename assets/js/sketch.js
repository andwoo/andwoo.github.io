const densityString = 'Ñ@#W$9876543210?!abc;:+=-,._ '.split("").reverse().join("")
const asciiOptions = {
  density: densityString,
  fileName: '/assets/video/loop.mp4',
  colorRange: [0, 255],
  densityRange: [0, densityString.length],
  blockResolution: 3,
  useResolutionAverage: false
}

let p5Video
let p5VideoWidth
let p5VideoHeight
let asciiContainer

function setup() {
  noCanvas();
  frameRate(16)

  p5Video = createVideo(asciiOptions.fileName, function () {
    p5VideoWidth = p5Video.width
    p5VideoHeight = p5Video.height

    asciiContainer = document.getElementById('asciiContainer')
    asciiContainer.className = 'asciiContainerLoaded'
    const fontScale = (asciiContainer.clientWidth / p5VideoWidth) * 2.2//1.7
    asciiContainer.style['fontSize'] = `${asciiOptions.blockResolution * fontScale}px`
    asciiContainer.style['lineHeight'] = `${(asciiOptions.blockResolution / 1.2) * fontScale}px`
  })
  p5Video.autoplay(true);
  p5Video.elt.setAttribute('muted', true);
  p5Video.elt.setAttribute('playsinline', true);
  p5Video.volume(0);
  p5Video.loop();
  p5Video.hide()
}

function draw() {
  if (!asciiContainer) {
    return
  }

  p5Video.loadPixels()
  let imageText = ''
  for (let y = 0; y < p5VideoHeight; y += asciiOptions.blockResolution) {
    for (let x = 0; x < p5VideoWidth; x += asciiOptions.blockResolution) {
      let luminosity
      if (asciiOptions.useResolutionAverage) {
        const xBound = x + asciiOptions.blockResolution > p5VideoWidth ? p5VideoWidth - 1 : x + asciiOptions.blockResolution
        const yBound = y + asciiOptions.blockResolution > p5VideoHeight ? p5VideoHeight - 1 : y + asciiOptions.blockResolution
        luminosity = pixelLuminosityAverage(x, y, xBound, yBound, p5Video.pixels, p5VideoWidth)
      } else {
        luminosity = pixelLuminosity(x, y, p5Video.pixels, p5VideoWidth)
      }
      const densityIndex = mapRange(luminosity, asciiOptions.colorRange, asciiOptions.densityRange)
      const character = asciiOptions.density.charAt(densityIndex)
      imageText += character === ' ' ? '&nbsp;' : character
    }
    imageText += '</br>'
  }
  asciiContainer.innerHTML = imageText
}

function pixelLuminosityAverage(startX, startY, endX, endY, pixels, imageWidth) {
  let sum = 0
  let count = 0
  for (let x = startX; x <= endX; ++x) {
    for (let y = startY; y <= endY; ++y) {
      sum += pixelLuminosity(startX, startY, pixels, imageWidth)
      ++count
    }
  }
  return sum / count
}

function pixelLuminosity(x, y, pixels, imageWidth) {
  const pixelIndex = (x + y * imageWidth) * 4
  const r = pixels[pixelIndex + 0]
  const g = pixels[pixelIndex + 1]
  const b = pixels[pixelIndex + 2]
  return ((0.21 * r) + (0.72 * g) + (0.07 * b))
}

function mapRange(value, oldRange, newRange) {
  const newValue = (value - oldRange[0]) * (newRange[1] - newRange[0]) / (oldRange[1] - oldRange[0]) + newRange[0]
  return Math.floor(Math.min(Math.max(newValue, newRange[0]), newRange[1]))
}