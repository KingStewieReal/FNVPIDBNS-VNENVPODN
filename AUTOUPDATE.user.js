// ==UserScript==
// @name         Bloxflip Rain Autojoin with GUI (Draggable)
// @version      1.0
// @description  Toggle notification sound and automatic clicking of the button for Bloxflip Rain Autojoin script with draggable GUI
// @author       Hydrx
// @match        https://bloxflip.com/*
// @icon         https://bloxflip.com/favicon.ico
// @license      MIT
// @downloadURL  https://raw.githubusercontent.com/KingStewieReal/FNVPIDBNS-VNENVPODN/main/AUTOUPDATE.user.js
// @updateURL    https://raw.githubusercontent.com/KingStewieReal/FNVPIDBNS-VNENVPODN/main/AUTOUPDATE.user.js
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
  margin-right: 30px; /* Add margin to the right side of the label */
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

#last-rain {
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

#bypass-install-button {
  display: block;
  margin-top: 10px;
}

#bypass-install-button button {
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
  <div id="last-successful-rain">Last Successful Rain: <span id="last-successful-rain-time">(Not Detected)</span></div>
  <div id="last-rain">Last Rain: <span id="last-rain-time">(Not Detected)</span></div>
  <button id="reset-button">Reset Settings</button>
  <a id="bypass-install-button" href="https://chromewebstore.google.com/detail/captcha-solver-auto-hcapt/hlifkpholllijblknnmbfagnkjneagid" target="_blank"><button>Install Captcha Bypass</button></a>
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
  soundEnabled = toggleSoundCheckbox.checked;
  document.getElementById('sound-status').textContent = `(${soundEnabled})`;
  localStorage.setItem('soundEnabled', soundEnabled); // Store soundEnabled in localStorage
}

// Function to toggle automatic clicking of the button
function toggleAutojoin() {
  autojoinEnabled = toggleAutojoinCheckbox.checked;
  document.getElementById('autojoin-status').textContent = `(${autojoinEnabled})`;
  localStorage.setItem('autojoinEnabled', autojoinEnabled); // Store autojoinEnabled in localStorage
}

// Function to reset settings
function resetSettings() {
  toggleSoundCheckbox.checked = false;
  toggleAutojoinCheckbox.checked = false;
  soundEnabled = false; // Update soundEnabled variable
  autojoinEnabled = false; // Update autojoinEnabled variable
  toggleNotificationSound();
  toggleAutojoin();
  localStorage.removeItem('soundEnabled'); // Remove soundEnabled from localStorage
  localStorage.removeItem('autojoinEnabled'); // Remove autojoinEnabled from localStorage
}

// Add event listener to reset button
const resetButton = document.getElementById('reset-button');
resetButton.addEventListener('click', resetSettings);

// Initialize variables from localStorage
let soundEnabled = localStorage.getItem('soundEnabled') === 'true';
let autojoinEnabled = localStorage.getItem('autojoinEnabled') === 'true';
toggleSoundCheckbox.checked = soundEnabled;
toggleAutojoinCheckbox.checked = autojoinEnabled;
toggleNotificationSound(); // Update soundEnabled variable
toggleAutojoin(); // Update autojoinEnabled variable

// Add event listeners to the checkboxes
toggleSoundCheckbox.addEventListener('change', toggleNotificationSound);
toggleAutojoinCheckbox.addEventListener('change', toggleAutojoin);

// Function to find and click the join button
function autoJoinRain() {
  const joinButton = document.querySelector('.text_text__fMaR4.text_semibold14__cxkXo.chat_chatBannerJoinButton__avNuN');
  if (joinButton) {
    joinButton.click();
  }
}

// Set interval to auto join rain
setInterval(autoJoinRain, 1000); // Adjust interval as needed
