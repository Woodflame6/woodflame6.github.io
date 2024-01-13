document.addEventListener('DOMContentLoaded', function () {
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
   drawCanvas();

   // Update time every second and redraw canvas
   setInterval(function () {
      updateTime();
      updateDate();
      drawCanvas();
      drawRssWidget(); // Draw RSS widget

      // Crossfade between RSS titles
      crossfadeRssTitles();
   }, 1000);

   // Add event listener for PiP button
   const pipButton = document.getElementById('pip-button');
   pipButton.addEventListener('click', enterPiP);

   // Add event listener for settings input
   const textColorInput = document.getElementById('text-color-input');
   const bgColorInput = document.getElementById('background-color-input');
   const websiteBgColorInput = document.getElementById('website-background-color-input');
   const textSizeSlider = document.getElementById('text-size-slider');
   const textPlacementSlider = document.getElementById('text-placement-slider');
   const boldTextCheckbox = document.getElementById('bold-text-checkbox');
   const textPlacementSlider2 = document.getElementById('text-placement-slider-y');

   textColorInput.addEventListener('input', updateTextColor);
   bgColorInput.addEventListener('input', updateCanvasColors);
   websiteBgColorInput.addEventListener('input', updateWebsiteBackgroundColor);
   textSizeSlider.addEventListener('input', updateTextSize);
   textPlacementSlider.addEventListener('input', updateTextPlacement);
   boldTextCheckbox.addEventListener('change', updateBoldText);
   textPlacementSlider2.addEventListener('input', updateTextPlacement);

   // Add event listener for text spacing slider
   const textSpacingSlider = document.getElementById('text-spacing-slider');
   textSpacingSlider.addEventListener('input', updateTextSpacing);

   // Add event listener for fetching weather
   const fetchWeatherButton = document.getElementById('fetch-weather-button');
   fetchWeatherButton.addEventListener('click', updateWeather);

   // Show canvas content as a video
   const canvasVideo = document.getElementById('canvas-video');
   const canvasVideoContainer = document.getElementById('canvas-video-container');
   const previewHeading = document.getElementById('preview-heading');

   const canvasStream = canvas.captureStream();
   canvasVideo.srcObject = canvasStream;

   // Hide canvas video
   canvasVideoContainer.style.display = 'none';

   // Add event listener for export button
   const exportButton = document.getElementById('export-button');
   exportButton.addEventListener('click', exportSettings);

   // Add event listener for import button
   const importButton = document.getElementById('import-button');
   importButton.addEventListener('click', importSettings);

   // Mobile-friendly adjustments
   if (window.innerWidth <= 768) {
      canvas.width = window.innerWidth - 20;
      textSizeSlider.value = 12; // Set default text size for mobile
   }

   // Add event listeners for widget toggle buttons
   const toggleTimeWidgetButton = document.getElementById('toggle-time-widget');
   const toggleDateWidgetButton = document.getElementById('toggle-date-widget');
   const toggleWeatherWidgetButton = document.getElementById('toggle-weather-widget');

   toggleTimeWidgetButton.addEventListener('click', toggleTimeWidget);
   toggleDateWidgetButton.addEventListener('click', toggleDateWidget);
   toggleWeatherWidgetButton.addEventListener('click', toggleWeatherWidget);

   // Add event listener for fetching RSS feed
   const fetchRssButton = document.getElementById('fetch-rss-button');
   fetchRssButton.addEventListener('click', fetchRssFeed);

   let showRssWidget = false; // Toggle variable for RSS widget
   const rssWidgetList = document.getElementById('rss-widget-list');
   let currentRssIndex = 0; // Index to track current RSS title

   const toggleRssWidget = document.getElementById('toggle-rss-widget');
   toggleRssWidget.addEventListener('click', function () {
      showRssWidget = !showRssWidget; // Toggle showRssWidget variable
      drawCanvas(); // Redraw canvas with updated settings
   });
});

let showRssWidget = false;
let currentRssIndex = 0;
let currentTime, currentDate, currentWeather;
const rssWidgetList = document.getElementById('rss-widget-list');
const toggleRssWidget = document.getElementById('toggle-rss-widget');

// Add this to your JavaScript file
const apiKey = 'f81b2b7c41314a8989ecaf2fafc2f672'; // Replace with your actual API key


// Function to fetch and display RSS feed
function fetchRssFeed() {
   const rssUrlInput = document.getElementById('rss-url-input').value;
   const rssWidgetList = document.getElementById('rss-widget-list');

   // Clear previous articles
   rssWidgetList.innerHTML = '';

   // Fetch RSS feed
   fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrlInput)}`)
      .then(response => response.json())
      .then(data => {
         // Check if the response contains items (articles)
         if (data.items) {
            data.items.forEach(item => {
               // Create list item for each article title
               const listItem = document.createElement('li');
               listItem.textContent = item.title;
               rssWidgetList.appendChild(listItem);
            });
         } else {
            // Display an error message if no articles found
            const errorMessage = document.createElement('li');
            errorMessage.textContent = 'Error fetching articles. Please check the RSS URL.';
            rssWidgetList.appendChild(errorMessage);
         }
      })
      .catch(error => {
         // Display an error message in case of fetch failure
         const errorMessage = document.createElement('li');
         errorMessage.textContent = 'Error fetching articles. Please try again later.';
         rssWidgetList.appendChild(errorMessage);
      });
}

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

// Replace the existing updateWeather function with the updated version below
function updateWeather() {
   const weatherElement = document.getElementById('current-weather');

   const latitudeInput = document.getElementById('latitude-input');
   const longitudeInput = document.getElementById('longitude-input');

   const latitude = latitudeInput.value.trim();
   const longitude = longitudeInput.value.trim();

   // Check if both latitude and longitude are entered
   if (latitude === '' || longitude === '') {
      weatherElement.textContent = 'Please enter both latitude and longitude.';
      return;
   }


   // Fetch weather data
   fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`)
      .then(response => {
         if (!response.ok) {
            throw new Error('Network response was not ok');
         }
         return response.json();
      })
      .then(data => {
         // Check if the response contains weather information
         if (data.weather && data.weather.length > 0) {
            const description = data.weather[0].description;
            currentWeather = description;
            weatherElement.textContent = `${description}`;
            drawCanvas(); // Redraw canvas with updated weather information
         } else {
            // Display an error message if no weather information found
            currentWeather = 'Error fetching weather information.';
            weatherElement.textContent = currentWeather;
         }
      })
      .catch(error => {
         // Display an error message in case of fetch failure
         currentWeather = 'Error fetching weather information. Please try again later.';
         weatherElement.textContent = currentWeather;
      });
}


function updateTextSpacing() {
   drawCanvas();
}

// Add RSS widget to the canvas within drawCanvas function
function drawCanvas() {
   const canvas = document.getElementById('dynamic-canvas');
   const context = canvas.getContext('2d');

   // Clear previous content
   context.clearRect(0, 0, canvas.width, canvas.height);

   // Draw time, date, and weather on the canvas
   const fontStyle = `${boldText ? 'bold' : 'normal'} ${textSize}px Arial`; // Adjust font size and weight
   context.font = fontStyle;
   context.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-color');

   // Add event listener for text spacing slider
   const textSpacingSlider = document.getElementById('text-spacing-slider');
   const textPlacementSlider = document.getElementById('text-placement-slider');
   const textPlacementSlider2 = document.getElementById('text-placement-slider-y');

   // Calculate text position based on the slider values
   const textX = parseInt(textPlacementSlider.value);
   const textY = parseInt(textPlacementSlider2.value);
   const textSpacing = parseInt(textSpacingSlider.value);

   // Draw each piece of text with adjusted spacing
   if (timeWidgetVisible) {
      context.fillText(`Time: ${currentTime}`, textX, textY);
   }
   if (dateWidgetVisible) {
      context.fillText(`Date: ${currentDate}`, textX + 150 + textSpacing, textY);
   }
   if (weatherWidgetVisible) {
      context.fillText(`Weather: ${currentWeather}`, textX + 300 + (2 * textSpacing), textY);
   }


   // Draw RSS widget titles on the canvas with crossfade effect
   if (showRssWidget && rssWidgetList.childNodes.length > 0) {
      const currentRssTitle = rssWidgetList.childNodes[currentRssIndex].textContent;
      const rssTextX = textX; // Adjust as needed
      const rssTextY = textY + 300; // Adjust as needed
      const rssFontStyle = `14px Arial`; // Adjust font size and weight
      const rssColor = 'black'; // Adjust color
      context.font = rssFontStyle;
      context.fillStyle = rssColor;
      context.fillText(currentRssTitle, rssTextX, rssTextY);
   }

   // Calculate text position for RSS widget
   const rssX = textX; // Adjust as needed
   const rssY = textY + 300; // Adjust as needed

   // Draw RSS widget titles on the canvas with crossfade effect
   rssWidgetList.childNodes.forEach((item, index) => {
      const articleY = rssY + (index + 1) * 20; // Adjust spacing between articles
      const alpha = index === currentRssIndex ? 1 : 0; // Set alpha for crossfade
      context.globalAlpha = alpha; // Apply alpha for crossfade
      context.font = `14px Arial`; // Adjust font size and weight
      context.fillStyle = 'black'; // Adjust color
      context.fillText(item.textContent, rssX, articleY);
   });
   context.globalAlpha = 1; // Reset alpha after drawing
}


// Function to crossfade between RSS titles
function crossfadeRssTitles() {
   if (rssWidgetList.childNodes.length > 1) {
      // Crossfade between titles every 10 seconds
      setInterval(() => {
         const nextIndex = (currentRssIndex + 1) % rssWidgetList.childNodes.length;
         fadeOut(rssWidgetList.childNodes[currentRssIndex]);
         fadeIn(rssWidgetList.childNodes[nextIndex]);
         currentRssIndex = nextIndex;
      }, 10000);
   }
}

// Function to fade out an element
function fadeOut(element) {
   let opacity = 1;
   const fadeOutInterval = setInterval(() => {
      if (opacity > 0) {
         opacity -= 0.1;
         element.style.opacity = opacity;
      } else {
         clearInterval(fadeOutInterval);
      }
   }, 100);
}

// Function to fade in an element
function fadeIn(element) {
   let opacity = 0;
   const fadeInInterval = setInterval(() => {
      if (opacity < 1) {
         opacity += 0.1;
         element.style.opacity = opacity;
      } else {
         clearInterval(fadeInInterval);
      }
   }, 100);
}

// Add RSS widget to the canvas
function drawRssWidget() {
   const canvas = document.getElementById('dynamic-canvas');
   const context = canvas.getContext('2d');
   const rssWidgetList = document.getElementById('rss-widget-list');

   // Check if RSS widget should be shown
   if (showRssWidget && rssWidgetList.childNodes.length > 0) {
      // Draw RSS widget on the canvas
      const currentRssTitle = rssWidgetList.childNodes[currentRssIndex].textContent;
      context.font = '14px Arial';
      context.fillStyle = 'black';
      context.fillText(currentRssTitle, 10, 300);
   }

   // Calculate text position for RSS widget
   const rssX = 10;
   const rssY = 300;

   // Draw RSS widget on the canvas
   context.font = '14px Arial';
   context.fillStyle = 'black';
   context.fillText('Latest Articles:', rssX, rssY);

   // Draw each article title
   rssWidgetList.childNodes.forEach((item, index) => {
      const articleY = rssY + (index + 1) * 20; // Adjust spacing between articles
      context.fillText(item.textContent, rssX, articleY);
   });
}

// Function to fetch and display RSS feed
function fetchRssFeed() {
   const rssUrlInput = document.getElementById('rss-url-input').value;
   const rssWidgetList = document.getElementById('rss-widget-list');

   // Clear previous articles
   rssWidgetList.innerHTML = '';

   // Fetch RSS feed
   fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrlInput)}`)
      .then(response => response.json())
      .then(data => {
         // Check if the response contains items (articles)
         if (data.items) {
            data.items.forEach(item => {
               // Create list item for each article title
               const listItem = document.createElement('li');
               listItem.textContent = item.title;
               rssWidgetList.appendChild(listItem);
            });
         } else {
            // Display an error message if no articles found
            const errorMessage = document.createElement('li');
            errorMessage.textContent = 'Error fetching articles. Please check the RSS URL.';
            rssWidgetList.appendChild(errorMessage);
         }
      })
      .catch(error => {
         // Display an error message in case of fetch failure
         const errorMessage = document.createElement('li');
         errorMessage.textContent = 'Error fetching articles. Please try again later.';
         rssWidgetList.appendChild(errorMessage);
      });
}

function enterPiP() {
   const videoElement = document.getElementById('canvas-video');
   const canvasVideoContainer = document.getElementById('canvas-video-container');
   const previewHeading = document.getElementById('preview-heading');

   if (videoElement) {
      if (document.pictureInPictureEnabled && typeof videoElement.requestPictureInPicture === 'function') {
         if (document.pictureInPictureElement) {
            document.exitPictureInPicture().then(() => {
               canvasVideoContainer.style.display = 'none';
               previewHeading.style.display = 'block';
            }).catch((error) => {
               console.error('Error exiting PiP:', error);
            });
         } else {
            // Ensure that the video is not in fullscreen mode
            if (document.fullscreenElement || document.webkitFullscreenElement) {
               document.exitFullscreen();
            }

            // Request PiP with a user gesture
            videoElement.requestPictureInPicture().then(() => {
               canvasVideoContainer.style.display = 'block';
               previewHeading.style.display = 'none';
            }).catch((error) => {
               console.error('Error entering PiP:', error);
            });
         }
      } else {
         console.error('Picture-in-Picture not supported on this browser or device.');
      }
   } else {
      console.error('Video element not found.');
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

   // Set only the background color of the canvas
   canvasElement.style.backgroundColor = bgColorInput.value;
}

function updateWebsiteBackgroundColor() {
   const websiteBgColorInput = document.getElementById('website-background-color-input');
   document.documentElement.style.setProperty('--website-background-color', websiteBgColorInput.value);
}

// Additional functions for new features
let textSize = 14; // Default text size
function updateTextSize() {
   const textSizeSlider = document.getElementById('text-size-slider');
   textSize = textSizeSlider.value;
   drawCanvas();
}

let boldText = false; // Default is not bold
function updateBoldText() {
   const boldTextCheckbox = document.getElementById('bold-text-checkbox');
   boldText = boldTextCheckbox.checked;
   drawCanvas();
}

function updateTextPlacement() {
   const textPlacementSlider = document.getElementById('text-placement-slider');
   const textPlacementSlider2 = document.getElementById('text-placement-slider-y');
   drawCanvas();
}

// Updated exportSettings function
function exportSettings() {
   const settings = {
      textColor: document.getElementById('text-color-input').value,
      bgColor: document.getElementById('background-color-input').value,
      textSize: document.getElementById('text-size-slider').value,
      textPlacementX: document.getElementById('text-placement-slider').value,
      textPlacementY: document.getElementById('text-placement-slider-y').value,
      boldText: document.getElementById('bold-text-checkbox').checked,
      textSpacing: document.getElementById('text-spacing-slider').value,
      websiteBgColor: document.getElementById('website-background-color-input').value,
      latitude: document.getElementById('latitude-input').value,
      longitude: document.getElementById('longitude-input').value,
   };

   const settingsJson = JSON.stringify(settings);
   downloadJson(settingsJson, 'settings.json');
}

// Updated importSettings function
function importSettings() {
   const input = document.createElement('input');
   input.type = 'file';
   input.accept = '.json';
   input.addEventListener('change', handleFileSelect);
   input.click();
}

// Updated handleFileSelect function
function handleFileSelect(event) {
   const file = event.target.files[0];
   if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
         const settingsJson = e.target.result;
         try {
            const settings = JSON.parse(settingsJson);
            applySettings(settings);
         } catch (error) {
            console.error('Error parsing JSON:', error);
         }
      };
      reader.readAsText(file);
   }
}

// Updated applySettings function
function applySettings(settings) {
   document.getElementById('text-color-input').value = settings.textColor;
   document.getElementById('background-color-input').value = settings.bgColor;
   document.getElementById('text-size-slider').value = settings.textSize;
   document.getElementById('text-placement-slider').value = settings.textPlacementX;
   document.getElementById('text-placement-slider-y').value = settings.textPlacementY;
   document.getElementById('bold-text-checkbox').checked = settings.boldText;
   document.getElementById('text-spacing-slider').value = settings.textSpacing;
   document.getElementById('website-background-color-input').value = settings.websiteBgColor;
   document.getElementById('latitude-input').value = settings.latitude;
   document.getElementById('longitude-input').value = settings.longitude;

   // Update canvas and other elements with the new settings
   updateTextColor();
   updateCanvasColors();
   updateTextSize();
   updateTextPlacement();
   updateBoldText();
   updateTextSpacing();
   updateWebsiteBackgroundColor();
   updateWeather();
   drawCanvas();
}

function downloadJson(data, filename) {
   const blob = new Blob([data], {
      type: 'application/json'
   });
   const link = document.createElement('a');
   link.href = URL.createObjectURL(blob);
   link.download = filename;
   link.click();
}

// Add global variables to track widget visibility
let timeWidgetVisible = true;
let dateWidgetVisible = true;
let weatherWidgetVisible = true;

function toggleTimeWidget() {
   timeWidgetVisible = !timeWidgetVisible;
   drawCanvas();
}

function toggleDateWidget() {
   dateWidgetVisible = !dateWidgetVisible;
   drawCanvas();
}

function toggleWeatherWidget() {
   weatherWidgetVisible = !weatherWidgetVisible;
   drawCanvas();
}

function toggleWidgetVisibility(widgetElement) {
   const currentDisplay = getComputedStyle(widgetElement).display;
   widgetElement.style.display = currentDisplay === 'none' ? 'block' : 'none';
   drawCanvas(); // Redraw canvas after toggling widget visibility
}
