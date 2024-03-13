// ==UserScript==
// @name         Bloxflip Rain Autojoin with GUI (Draggable)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Toggle notification sound and automatic clicking of the button for Bloxflip Rain Autojoin script with draggable GUI
// @author       Hydrx
// @match        https://bloxflip.com/*
// @icon         https://bloxflip.com/favicon.ico
// @license      MIT
// ==/UserScript==

// Function to make the panel draggable
function makeDraggable(element) {
  let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  element.onmousedown = dragMouseDown;

  function dragMouseDown(e) {
    if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'BUTTON') { // Only start dragging if not clicking on input or button
      e = e || window.event;
      e.preventDefault();
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      document.onmousemove = elementDrag;
    }
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    element.style.top = (element.offsetTop - pos2) + "px";
    element.style.left = (element.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

// CSS for styling the GUI
const style = `
#autojoin-panel {
  position: fixed;
  top: 10px;
  left: 10px;
  background-color: #282828; /* Background color set to black */
  color: #E7D7AD; /* Text color set to white */
  border: 1px solid #8EC07C;
  border-radius: 5px;
  padding: 10px;
  padding-left: 20px; /* Add padding to the left side */
  z-index: 9999;
}

#autojoin-panel label {
  display: block;
  margin-bottom: 5px;
  margin-right: 82px; /* Add margin to the right side of the label */
}

#autojoin-panel input[type="checkbox"] {
  margin-right: 5px;
  width: auto; /* Set width to auto */
}

#autojoin-panel input[type="text"] {
  width: 80px; /* Adjust width as needed */
  margin-top: 5px;
  border: 1px solid #8EC07C;
  border-radius: 5px;
  background-color: #282828;
  color: #E7D7AD;
  padding: 5px;
}

#interval {
  border: 1px solid #8EC07C;
  border-radius: 5px;
  background-color: #282828;
  color: #E7D7AD;
  padding: 5px;
}

#last-successful-rain {
  margin-top: 10px;
}

#reset-button {
  margin-top: 10px;
  background-color: #8EC07C;
  color: #282828;
  border: none;
  border-radius: 5px;
  padding: 5px 10px;
  cursor: pointer;
}
`;

// HTML for the GUI
const panelHTML = `
<div id="autojoin-panel">
  <label><input type="checkbox" id="toggle-sound"> Sound <span id="sound-status">(false)</span></label>
  <label><input type="checkbox" id="toggle-autojoin"> Autojoin <span id="autojoin-status">(false)</span></label>
  <label for="interval">Check Interval:</label>
  <input type="text" id="interval" value="5000">
  <div id="last-successful-rain">Last Successful Rain: <span id="last-successful-rain-time">(Not Yet Detected)</span></div>
  <div id="last-rain">Last Rain: <span id="last-rain-time">(Not Yet Detected)</span></div>
  <button id="reset-button">Reset Settings</button>
</div>
`;

// Inject the CSS and HTML into the page
document.head.insertAdjacentHTML('beforeend', `<style>${style}</style>`);
document.body.insertAdjacentHTML('beforeend', panelHTML);

// Retrieve the panel element
const autojoinPanel = document.getElementById('autojoin-panel');

// Make the panel draggable
makeDraggable(autojoinPanel);

// Retrieve the checkboxes and input field
const toggleSoundCheckbox = document.getElementById('toggle-sound');
const toggleAutojoinCheckbox = document.getElementById('toggle-autojoin');
const intervalInput = document.getElementById('interval');

// Retrieve settings from localStorage or set default values
let soundEnabled = localStorage.getItem('soundEnabled') === 'true';
let autojoinEnabled = localStorage.getItem('autojoinEnabled') === 'true';

// Update checkbox state and text content based on soundEnabled variable
toggleSoundCheckbox.checked = soundEnabled;
document.getElementById('sound-status').textContent = `(${soundEnabled})`;

// Update checkbox state and text content based on autojoinEnabled variable
toggleAutojoinCheckbox.checked = autojoinEnabled;
document.getElementById('autojoin-status').textContent = `(${autojoinEnabled})`;

// Function to toggle notification sound
function toggleNotificationSound() {
  soundEnabled = toggleSoundCheckbox.checked;
  localStorage.setItem('soundEnabled', soundEnabled ? 'true' : 'false');
  document.getElementById('sound-status').textContent = `(${soundEnabled})`;
}

// Function to toggle automatic clicking of the button
function toggleAutojoin() {
  autojoinEnabled = toggleAutojoinCheckbox.checked;
  localStorage.setItem('autojoinEnabled', autojoinEnabled ? 'true' : 'false');
  document.getElementById('autojoin-status').textContent = `(${autojoinEnabled})`;
}

// Function to reset settings to default
function resetToDefault() {
  localStorage.removeItem('soundEnabled');
  localStorage.removeItem('autojoinEnabled');
  toggleSoundCheckbox.checked = false;
  toggleAutojoinCheckbox.checked = false;
  intervalInput.value = '5000';
  soundEnabled = false;
  autojoinEnabled = false;
  document.getElementById('sound-status').textContent = '(false)';
  document.getElementById('autojoin-status').textContent = '(false)';
}

// Add event listeners to the checkboxes and input field
toggleSoundCheckbox.addEventListener('change', toggleNotificationSound);
toggleAutojoinCheckbox.addEventListener('change', toggleAutojoin);

// Add event listener to reset button
const resetButton = document.getElementById('reset-button');
resetButton.addEventListener('click', resetToDefault);

// Function to fetch historyJson
async function fetchHistoryJson() {
  const history = await fetch('https://api.bloxflip.com/chat/history');
  return JSON.parse(await history.text());
}

// Function to check if it's raining
function checkIfRaining(historyJson) {
  return historyJson && historyJson.rain && historyJson.rain.active;
}

// Function to check if the last rain was successful
function checkIfLastRainSuccessful() {
  const statusElements = document.querySelectorAll('div[role="status"]');
  for (const element of statusElements) {
    if (element.textContent.trim() === "You're now participating in this chat rain event!") {
      return true;
    }
  }
  return false;
}

// Define isRaining initially as false
let isRaining = false;

// Function to play sound if needed
async function playSoundIfNeeded() {
  if (soundEnabled) {
    let audio = new Audio('https://www.myinstants.com/media/sounds/bepbob.mp3');
    audio.muted = true;
    setTimeout(() => {
      audio.muted = false;
      audio.play();
    }, 1000);
  }
}

// Function to handle autojoin logic
async function handleAutojoin() {
  const historyJson = await fetchHistoryJson();

  if (checkIfRaining(historyJson) && !isRaining) {
    if (autojoinEnabled) {
      await playSoundIfNeeded();
      setTimeout(() => {
        const joinButton = document.evaluate('//p[contains(text(), "Join For Free")]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (joinButton) {
          joinButton.click();
        }
      }, 1000);
    }
    isRaining = true;
    updateLastRainTime();
    if (checkIfLastRainSuccessful()) {
      updateLastSuccessfulRainTime();
    }
  } else if (!checkIfRaining(historyJson) && isRaining) {
    isRaining = false;
  }
}


// Function to update the last rain time
function updateLastRainTime() {
  const lastRainElement = document.getElementById('last-rain-time');
  const now = new Date();
  const timeString = now.toLocaleString();
  lastRainElement.textContent = timeString;
}

// Function to update the last successful rain time
function updateLastSuccessfulRainTime() {
  const lastSuccessfulRainElement = document.getElementById('last-successful-rain-time');
  const now = new Date();
  const timeString = now.toLocaleString();
  lastSuccessfulRainElement.textContent = timeString;
}

// Interval to check for rain every 5 seconds
setInterval(handleAutojoin, 5000);
