document.addEventListener('DOMContentLoaded', function() {
  // Set up canvas for drawing
  const canvas = document.getElementById('dynamic-canvas');
  const context = canvas.getContext('2d');

  // Set fixed resolution for the canvas
  const canvasWidth = 800; // Adjust as needed
  const canvasHeight = 50; // Fixed height for the horizontal status bar

  // Apply fixed resolution to the canvas
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  // Fetch and display time, date, and weather using APIs or other methods
  let currentTime, currentDate, currentWeather;
  updateTime();
  updateDate();
  updateWeather();
  drawCanvas();

  // Update time every second and redraw canvas
  setInterval(function() {
    updateTime();
    updateDate();
    updateWeather();
    drawCanvas();
  }, 1000);

  // Add event listener for PiP button
  const pipButton = document.getElementById('pip-button');
  pipButton.addEventListener('click', enterPiP);

  // Add event listener for settings input
  const textColorInput = document.getElementById('text-color-input');
  const bgColorInput = document.getElementById('background-color-input');
  const websiteBgColorInput = document.getElementById('website-background-color-input');

  textColorInput.addEventListener('input', updateTextColor);
  bgColorInput.addEventListener('input', updateCanvasColors);
  websiteBgColorInput.addEventListener('input', updateWebsiteBackgroundColor);

  // Show canvas content as a video
  const canvasVideo = document.getElementById('canvas-video');
  const canvasStream = canvas.captureStream();
  canvasVideo.srcObject = canvasStream;
});

function updateTime() {
  const timeElement = document.getElementById('current-time');
  currentTime = new Date().toLocaleTimeString();
  timeElement.textContent = currentTime;
}

function updateDate() {
  const dateElement = document.getElementById('current-date');
  currentDate = new Date().toLocaleDateString();
  dateElement.textContent = currentDate;
}

function updateWeather() {
  // Implement weather fetching and display logic here
  const weatherElement = document.getElementById('current-weather');
  currentWeather = 'Sunny'; // Replace with actual weather data
  weatherElement.textContent = currentWeather;
}

function drawCanvas() {
  const canvas = document.getElementById('dynamic-canvas');
  const context = canvas.getContext('2d');

  // Clear previous content
  context.clearRect(0, 0, canvas.width, canvas.height);

  // Draw time, date, and weather on the canvas
  context.font = '12px Arial'; // Adjust font size as needed
  context.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-color');
  
  // Center the text within the canvas
  const textX = canvas.width / 2;
  const textY = canvas.height / 2;

  context.fillText(`Time: ${currentTime}`, textX - 150, textY);
  context.fillText(`Date: ${currentDate}`, textX, textY);
  context.fillText(`Weather: ${currentWeather}`, textX + 150, textY);
}

function enterPiP() {
  const videoElement = document.getElementById('canvas-video');
  if (videoElement) {
    if (document.pictureInPictureElement) {
      document.exitPictureInPicture();
    } else {
      videoElement.requestPictureInPicture();
    }
  }
}

function updateTextColor() {
  const textColorInput = document.getElementById('text-color-input');
  document.documentElement.style.setProperty('--text-color', textColorInput.value);
  drawCanvas();
}

function updateCanvasColors() {
  const bgColorInput = document.getElementById('background-color-input');
  const canvasElement = document.getElementById('dynamic-canvas');
  const canvasVideo = document.getElementById('canvas-video');

  document.documentElement.style.setProperty('--text-color', bgColorInput.value);
  canvasElement.style.backgroundColor = bgColorInput.value;
  canvasVideo.style.color = bgColorInput.value;
}

function updateWebsiteBackgroundColor() {
  const websiteBgColorInput = document.getElementById('website-background-color-input');
  document.documentElement.style.setProperty('--website-background-color', websiteBgColorInput.value);
}
