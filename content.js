// 1. Create the Main Backdrop (But don't attach it yet)
const backdrop = document.createElement("div");
backdrop.id = "stupid-captcha-backdrop";

backdrop.innerHTML = `
    <div id="stupid-captcha-box">
        <div style="display:flex; align-items:center;">
            <div class="captcha-checkbox" id="initial-checkbox"></div>
            <span class="captcha-label">I'm not a robot</span>
        </div>
        <div class="captcha-logo">
            <svg viewBox="0 0 24 24" width="28" height="28" fill="#444">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
            </svg>
            <div>reCAPTCHA</div>
        </div>
    </div>
    
    <div id="stupid-image-challenge">
        <div class="challenge-header">
            <h2>Select all images with a</h2>
            <p id="challenge-topic">Bus</p>
        </div>
        <div class="challenge-grid" id="grid-container">
            </div>
        <div style="height: 40px;">
            <button class="verify-btn" id="verify-btn">VERIFY</button>
        </div>
    </div>
`;

// Note: We do NOT appendChild yet. We wait for the trap.

// 2. Logic Variables (Targeting elements inside the backdrop memory fragment)
const initialCheckbox = backdrop.querySelector("#initial-checkbox");
const challengeModal = backdrop.querySelector("#stupid-image-challenge");
const gridContainer = backdrop.querySelector("#grid-container");
const verifyBtn = backdrop.querySelector("#verify-btn");
const challengeTopic = backdrop.querySelector("#challenge-topic");

// 3. Configuration
const targets = [
  "Bus",
  "Bridge",
  "Car",
  "Traffic Light",
  "Motorcycle",
  "Bicycle",
  "Boat",
];
const distractors = [
  "meme",
  "clown",
  "weird",
  "banana",
  "goat",
  "fail",
  "awkward",
  "potato",
  "sloth",
];
let currentTarget = "Bus";

// --- THE TRAP LOGIC (New!) ---
document.addEventListener(
  "click",
  function (e) {
    // A. Allow clicks inside the CAPTCHA itself (so they can try to solve it)
    if (backdrop.contains(e.target)) return;

    // B. Find out if they clicked a Link (<a> tag)
    const link = e.target.closest("a");

    // C. If they clicked a link, TRAP THEM.
    if (link) {
      e.preventDefault(); // Stop them from going to the link
      e.stopPropagation(); // Stop Google from handling the click

      // Show the CAPTCHA if it's not already there
      if (!document.getElementById("stupid-captcha-backdrop")) {
        document.body.appendChild(backdrop);
      }
    }
  },
  true
); // Use 'Capture' phase to beat other event listeners

// 4. THE SMART LOADER (Standard Logic)
function loadImages(targetName) {
  gridContainer.innerHTML = "";
  const correctCount = Math.floor(Math.random() * 3) + 3;
  let imageList = [];

  for (let i = 0; i < correctCount; i++) imageList.push(targetName);
  while (imageList.length < 9) {
    imageList.push(distractors[Math.floor(Math.random() * distractors.length)]);
  }
  imageList.sort(() => Math.random() - 0.5);

  imageList.forEach((keyword, index) => {
    const div = document.createElement("div");
    div.className = "challenge-img";
    const img = document.createElement("img");
    const safeKeyword = keyword.toLowerCase().replace(" ", "");
    img.src = `https://loremflickr.com/150/150/${safeKeyword}?lock=${
      Math.random() + index
    }`;

    div.appendChild(img);
    div.addEventListener("click", () => div.classList.toggle("selected"));
    gridContainer.appendChild(div);
  });
}

// 5. Interaction Listeners
initialCheckbox.addEventListener("click", () => {
  loadImages(currentTarget);
  challengeModal.style.display = "block";
});

verifyBtn.addEventListener("click", () => {
  verifyBtn.innerText = "CHECKING...";
  verifyBtn.disabled = true;

  setTimeout(() => {
    verifyBtn.innerText = "VERIFY";
    verifyBtn.disabled = false;

    challengeModal.style.transform = "translate(-50%, -50%) translateX(10px)";
    setTimeout(
      () =>
        (challengeModal.style.transform =
          "translate(-50%, -50%) translateX(-10px)"),
      50
    );
    setTimeout(
      () => (challengeModal.style.transform = "translate(-50%, -50%)"),
      100
    );

    const nextTarget = targets[Math.floor(Math.random() * targets.length)];
    currentTarget = nextTarget;
    challengeTopic.innerText = currentTarget;

    loadImages(currentTarget);
  }, 1500);
});
