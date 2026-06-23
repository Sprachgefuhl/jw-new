const canvas = document.getElementById('staticCanvas');
const ctx = canvas.getContext('2d');

// Resize canvas dynamically to match the viewport dimensions
function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

window.addEventListener('resize', resize);
resize();

// Generate random multi-colored gray/white noise pixels
function generateNoise() {
  const image = ctx.createImageData(canvas.width, canvas.height);
  const data = image.data;

  for (let i = 0; i < data.length; i += 4) {
    // Generate random grayscale value from 0 to 255
    const noiseValue = Math.floor(Math.random() * 255);
    
    data[i] = noiseValue;     // Red channel
    data[i + 1] = noiseValue; // Green channel
    data[i + 2] = noiseValue; // Blue channel
    data[i + 3] = 255;        // Alpha channel (Fully opaque)
  }

  ctx.putImageData(image, 0, 0);
}

// Creates an infinite loop animating the static noise frame by frame
function loop() {
  generateNoise();
  requestAnimationFrame(loop);
}

loop();