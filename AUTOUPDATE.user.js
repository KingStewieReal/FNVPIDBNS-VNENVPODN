// ==UserScript==
// @name         Bloxflip Rain Autojoin with GUI (Draggable)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @updateURL    https://github.com/KingStewieReal/FNVPIDBNS-VNENVPODN/edit/main/AUTOUPDATE.user.js
// @downloadURL  https://github.com/KingStewieReal/FNVPIDBNS-VNENVPODN/edit/main/AUTOUPDATE.user.js
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
    e = e || window.event;
    e.preventDefault();
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
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
  background-color: #000; /* Background color set to black */
  color: #fff; /* Text color set to white */
  border: 1px solid #ccc;
  padding: 10px;
  z-index: 9999;
  cursor: move; /* Add cursor for draggability */
}

#autojoin-panel label {
  display: block;
  margin-bottom: 5px;
}

#autojoin-panel input[type="checkbox"] {
  margin-right: 5px;
}

#autojoin-panel input[type="text"] {
  width: 80px; /* Adjust width as needed */
  margin-top: 5px;
}
`;

// HTML for the GUI
const panelHTML = `
<div id="autojoin-panel">
  <label><input type="checkbox" id="toggle-sound" checked> Enable Sound <span id="sound-status">(true)</span></label>
  <label><input type="checkbox" id="toggle-autojoin" checked> Enable Autojoin <span id="autojoin-status">(true)</span></label>
  <label for="interval">Check Interval:</label>
  <input type="text" id="interval" value="5000">
</div>
`;

// Inject the CSS and HTML into the page
document.head.insertAdjacentHTML('beforeend', `<style>${style}</style>`);
document.body.insertAdjacentHTML('beforeend', panelHTML);

// Retrieve the panel element
const autojoinPanel = document.getElementById('autojoin-panel');

// Make the panel draggable
makeDraggable(autojoinPanel);

// Retrieve the checkboxes
const toggleSoundCheckbox = document.getElementById('toggle-sound');
const toggleAutojoinCheckbox = document.getElementById('toggle-autojoin');

// Function to toggle notification sound
function toggleNotificationSound() {
  playSound = toggleSoundCheckbox.checked;
  document.getElementById('sound-status').textContent = `(${playSound})`;
}

// Function to toggle automatic clicking of the button
function toggleAutojoin() {
  autoJoin = toggleAutojoinCheckbox.checked;
  document.getElementById('autojoin-status').textContent = `(${autoJoin})`;
}

// Add event listeners to the checkboxes
toggleSoundCheckbox.addEventListener('change', toggleNotificationSound);
toggleAutojoinCheckbox.addEventListener('change', toggleAutojoin);

// Modify your existing code to use the playSound and autoJoin variables
let playSound = true;
let autoJoin = true;

async function playSoundIfNeeded() {
  if (playSound) {
    let audio = new Audio('https://www.myinstants.com/media/sounds/bepbob.mp3');
    audio.muted = true;
    setTimeout(() => {
      audio.muted = false;
      audio.play();
    }, 1000);
  }
}

// Function to fetch historyJson
async function fetchHistoryJson() {
  const history = await fetch('https://api.bloxflip.com/chat/history');
  return JSON.parse(await history.text());
}

// Function to check if it's raining
function checkIfRaining(historyJson) {
  return historyJson && historyJson.rain && historyJson.rain.active;
}

// Define isRaining initially as false
let isRaining = false;

// Function to handle autojoin logic
async function handleAutojoin() {
  const historyJson = await fetchHistoryJson();

  if (checkIfRaining(historyJson) && !isRaining) {
    await playSoundIfNeeded();
    if (autoJoin) {
      setTimeout(() => {
        document.querySelector('.chat_chatBannerJoinButton__avNuN').click();
      }, 1000);
    }
    isRaining = true;
  } else if (!checkIfRaining(historyJson) && isRaining) {
    isRaining = false;
  }
}

// Interval to check for rain every 5 seconds
setInterval(handleAutojoin, 5000);
