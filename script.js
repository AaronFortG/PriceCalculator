const rankHierarchy = {
  bronze1: 1,
  bronze2: 2,
  bronze3: 3,
  silver1: 4,
  silver2: 5,
  silver3: 6,
  gold1: 7,
  gold2: 8,
  gold3: 9,
  platinum1: 10,
  platinum2: 11,
  platinum3: 12,
  diamond1: 13,
  diamond2: 14,
  diamond3: 15,
  champion1: 16,
  champion2: 17,
  champion3: 18,
  gc1: 19,
  gc2: 20,
  gc3: 21,
  ssl: 22,
};

const currentRankSelect = document.getElementById("current-rank");
const desiredRankSelect = document.getElementById("desired-rank");
const priceDisplay = document.getElementById("final-price");
const gamemodeSelect = document.getElementById("gamemode");

const duoQueueCheckbox = document.getElementById("duo-queue");
const streamingCheckbox = document.getElementById("streaming");
const priorityCheckbox = document.getElementById("priority");

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
  const selectedRankValue = rankHierarchy[selectedOption.value];
  const desiredOption = desiredRankSelect.options[desiredRankSelect.selectedIndex];
  const desiredRankValue = rankHierarchy[desiredOption.value];

  desiredRankSelect.innerHTML = "";

  for (const option of desiredRankSelectOriginalOptions) {
    const optionRankValue = rankHierarchy[option.value];

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

  console.log(selectedOption);
  console.log(desiredRankSelect.options[desiredSelectedOptionIndex]);

  basePrice = parseFloat(desiredRankSelect.options[desiredSelectedOptionIndex].getAttribute("data-add")) - parseFloat(selectedOption.getAttribute("data-add"));

  updateFinalPrice();
}

function newDesiredRank() {
    const selectedOption = currentRankSelect.options[currentRankSelect.selectedIndex];
    const desiredOption = desiredRankSelect.options[desiredRankSelect.selectedIndex];

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