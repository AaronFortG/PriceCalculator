const rankHierarchy = {
  bronze1: { value: 1, image: "rocket-league/rank-icons/bronze-1.png" },
  bronze2: { value: 2, image: "rocket-league/rank-icons/bronze-2.png" },
  bronze3: { value: 3, image: "rocket-league/rank-icons/bronze-3.png" },
  silver1: { value: 4, image: "rocket-league/rank-icons/silver-1.png" },
  silver2: { value: 5, image: "rocket-league/rank-icons/silver-2.png" },
  silver3: { value: 6, image: "rocket-league/rank-icons/silver-3.png" },
  gold1: { value: 7, image: "rocket-league/rank-icons/gold-1.png" },
  gold2: { value: 8, image: "rocket-league/rank-icons/gold-2.png" },
  gold3: { value: 9, image: "rocket-league/rank-icons/gold-3.png" },
  platinum1: { value: 10, image: "rocket-league/rank-icons/platinum-1.png" },
  platinum2: { value: 11, image: "rocket-league/rank-icons/platinum-2.png" },
  platinum3: { value: 12, image: "rocket-league/rank-icons/platinum-3.png" },
  diamond1: { value: 13, image: "rocket-league/rank-icons/diamond-1.png" },
  diamond2: { value: 14, image: "rocket-league/rank-icons/diamond-2.png" },
  diamond3: { value: 15, image: "rocket-league/rank-icons/diamond-3.png" },
  champion1: { value: 16, image: "rocket-league/rank-icons/champion-1.png" },
  champion2: { value: 17, image: "rocket-league/rank-icons/champion-2.png" },
  champion3: { value: 18, image: "rocket-league/rank-icons/champion-3.png" },
  gc1: { value: 19, image: "rocket-league/rank-icons/grand-champion-1.png" },
  gc2: { value: 20, image: "rocket-league/rank-icons/grand-champion-2.png" },
  gc3: { value: 21, image: "rocket-league/rank-icons/grand-champion-3.png" },
  ssl: { value: 22, image: "rocket-league/rank-icons/super-sonic-legend.png" },
};

const currentRankSelect = document.getElementById("current-rank");
const desiredRankSelect = document.getElementById("desired-rank");
const priceDisplay = document.getElementById("final-price");
const gamemodeSelect = document.getElementById("gamemode");

const duoQueueCheckbox = document.getElementById("duo-queue");
const streamingCheckbox = document.getElementById("streaming");
const priorityCheckbox = document.getElementById("priority");

const currentRankImageElement = document.getElementById("current-rank-image");
const desiredRankImageElement = document.getElementById("desired-rank-image");

const DUO_QUEUE_EXTRA = 0.4;
const PRIORITY_EXTRA = 0.2;
const STREAMING_EXTRA = 0.15;

let isDuoQueue = false;
let isPriority = false;
let isStreaming = false;

let basePrice = 0;
let extraPrice = 1;

let previousGamemodeOption = gamemodeSelect.options[gamemodeSelect.selectedIndex];

currentRankSelect.addEventListener("change", updateDesiredRankOptions);
desiredRankSelect.addEventListener("change", newDesiredRank);
duoQueueCheckbox.addEventListener("change", duoQueueSelected);
streamingCheckbox.addEventListener("change", streamingSelected);
priorityCheckbox.addEventListener("change", prioritySelected);
gamemodeSelect.addEventListener("change", newGamemode);

function newGamemode() {
    const gamemodeOption = gamemodeSelect.options[gamemodeSelect.selectedIndex];
    const extraValue = parseFloat(gamemodeOption.getAttribute("data-add"));

    const desiredOption = desiredRankSelect.options[desiredRankSelect.selectedIndex];
    const selectedOption = currentRankSelect.options[currentRankSelect.selectedIndex];
    // basePrice = parseFloat(desiredOption.getAttribute("data-add")) - parseFloat(selectedOption.getAttribute("data-add"));

    // Remove previous gamemode extra price, add the new one.
    previousGamemodeValue = parseFloat(previousGamemodeOption.getAttribute("data-add"));

    console.log("Extra value:", previousGamemodeValue);
    console.log("Extra price:", extraPrice);

    extraPrice -= previousGamemodeValue;
    extraPrice += extraValue;               // Extra price if special gamemode selected.

    console.log("Extra value:", extraValue);
    console.log("Extra price:", extraPrice);

    previousGamemodeOption = gamemodeOption;    // Update the previous gamemode;

    updateFinalPrice();
}

function updateDesiredRankOptions() {
  const selectedOption = currentRankSelect.options[currentRankSelect.selectedIndex];
  const selectedRankValue = rankHierarchy[selectedOption.value].value;
  const desiredOption = desiredRankSelect.options[desiredRankSelect.selectedIndex];
  const desiredRankValue = rankHierarchy[desiredOption.value].value;

  desiredRankSelect.innerHTML = "";

  // Update images with new ranks
  currentRankImageElement.src = rankHierarchy[selectedOption.value].image;

  for (const option of desiredRankSelectOriginalOptions) {
    const optionRankValue = rankHierarchy[option.value].value;

    if (optionRankValue > selectedRankValue) {
      const newOption = document.createElement("option");
      newOption.value = option.value;
      newOption.textContent = option.textContent;
      newOption.setAttribute("data-add", option.getAttribute("data-add"));
      desiredRankSelect.appendChild(newOption);
    }
  }

  let desiredSelectedOptionIndex = 0;
  
  if (selectedRankValue < desiredRankValue) {
    desiredSelectedOptionIndex = (desiredRankValue - 1) - selectedRankValue;
    desiredRankSelect.selectedIndex = desiredSelectedOptionIndex;
  }
  else {
    // Update image
    console.log(desiredRankSelect.options[0]);
    let newDesiredRankOption = desiredRankSelect.options[0];
    desiredRankImageElement.src = rankHierarchy[newDesiredRankOption.value].image;
  }

  basePrice = parseFloat(desiredRankSelect.options[desiredSelectedOptionIndex].getAttribute("data-add")) - parseFloat(selectedOption.getAttribute("data-add"));

  updateFinalPrice();
}

function newDesiredRank() {
    const selectedOption = currentRankSelect.options[currentRankSelect.selectedIndex];
    const desiredOption = desiredRankSelect.options[desiredRankSelect.selectedIndex];

    // Update image of new rank
    desiredRankImageElement.src = rankHierarchy[desiredOption.value].image;

    basePrice = parseFloat(desiredOption.getAttribute("data-add")) - parseFloat(selectedOption.getAttribute("data-add"));
    updateFinalPrice();
}

function duoQueueSelected() {
    if (duoQueueCheckbox.checked) {
        isDuoQueue = true;
        extraPrice += DUO_QUEUE_EXTRA;
    } else {
        isDuoQueue = false;
        extraPrice -= DUO_QUEUE_EXTRA;
    }
    updateFinalPrice();
}

function streamingSelected() {
    if (streamingCheckbox.checked) {
        isStreaming = true;
        extraPrice += STREAMING_EXTRA;
    } else {
        isStreaming = false;
        extraPrice -= STREAMING_EXTRA;
    }
    updateFinalPrice();
}

function prioritySelected() {
    if (priorityCheckbox.checked) {
        isPriority = true;
        extraPrice += PRIORITY_EXTRA;
    } else {
        isPriority = false;
        extraPrice -= PRIORITY_EXTRA;
    }
    updateFinalPrice();
}

function updateFinalPrice() {
    let totalPrice = basePrice * extraPrice;
    totalPrice = parseFloat(totalPrice.toFixed(2)); // Round to 2 decimal places

    priceDisplay.textContent = totalPrice;  // Show the total price of the order
}

// Save the original options of desired rank select
const desiredRankSelectOriginalOptions = Array.from(desiredRankSelect.options);

// Initial update when the page loads
updateDesiredRankOptions();
newDesiredRank();