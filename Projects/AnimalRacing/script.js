const runnersBtn = document.createElement("button");
const resetBtn = document.createElement("button");
const startBtn = document.createElement("button");
const lockBtn = document.createElement("button");
const bankValue = document.getElementById("bank-value");

const controlsDiv = document.getElementById("race-controls");
const trackDiv = document.getElementById("race-track");
const resultsDiv = document.getElementById("race-results");
const playersDiv = document.getElementById("players");

let racing;
let pendingRace = true;
let bank = 0;

runnersBtn.textContent = "Place Runners";
startBtn.textContent = "Start Race";
resetBtn.textContent = "Reset Race";
lockBtn.textContent = "Lock Racer";
startBtn.disabled = true;
resetBtn.disabled = true;
lockBtn.disabled = true;
startBtn.style.backgroundColor = "gray";
resetBtn.style.backgroundColor = "gray";

trackDiv.style.width = "100%";
trackDiv.style.height = "30rem";
trackDiv.style.padding = "2rem";
trackDiv.style.direction = "ltr";

controlsDiv.style.margin = "1em";

runnersBtn.classList.add("btn", "btn-primary");
startBtn.classList.add("btn");
resetBtn.classList.add("btn");
trackDiv.classList.add("bg-secondary");
lockBtn.classList.add("btn", "btn-success");

const animals = runners;
const playingPlayers = players;

const handlePlayers = () => {
  players.forEach((player) => {
    const playerDiv = document.createElement("div");
    const playerName = document.createElement("span");
    const playerCoins = document.createElement("span");
    const placeBetBtn = document.createElement("button");

    playerDiv.dataset.playerName = player.name;
    playerDiv.style.width = "150px";
    playerDiv.style.height = "auto";
    playerDiv.style.display = "grid";
    playerDiv.style.backgroundColor = "rgba(175,175,175,0.8)";
    playerDiv.style.margin = "0 0.5em 0 0.5em";
    playerDiv.style.borderRadius = "1em";

    playerName.textContent = player.name;
    playerCoins.textContent = `Coins: ${player.coins}💰`;
    playerCoins.dataset.playerCoinsLabel = player.name;

    placeBetBtn.dataset.playerBet = player.name;
    placeBetBtn.textContent = "Place Bet";
    placeBetBtn.disabled = true;
    placeBetBtn.style.width = "66%";
    placeBetBtn.style.margin = "auto";
    placeBetBtn.classList.add("btn", "btn-success");
    placeBetBtn.addEventListener("click", (e) => handlePlayerBet(e));

    playerDiv.appendChild(playerName);
    playerDiv.appendChild(playerCoins);
    playerDiv.appendChild(placeBetBtn);
    playersDiv.appendChild(playerDiv);
  });
};

const handlePlayerBet = (e) => {
  e.target.style.display = "none";
  document.querySelectorAll("[data-player-bet]").forEach((button) => {
    button.disabled = true;
  });
  const playerDiv = e.composedPath()[1];
  const player = findPlayerByName(playerDiv.dataset.playerName);

  const playerBetLabel = document.createElement("label");
  const playerBetRange = document.createElement("input");
  const betAmountDiv = document.createElement("div");
  const betAmountInput = document.createElement("input");
  const betAmountLabel = document.createElement("label");
  const betAreaDiv = document.createElement("div");

  betAreaDiv.dataset.betArea = player.name;

  betAmountDiv.classList.add("form-floating");

  betAmountInput.type = "number";
  betAmountInput.classList.add("form-control");
  betAmountInput.id = "betAmountValue";
  betAmountInput.classList.add("betAmountValue");
  betAmountInput.defaultValue = Number(player.coins) / 4;
  betAmountInput.max = player.coins;
  betAmountInput.dataset.betPlaced = betAmountInput.value;
  betAmountInput.dataset.betPlayerName = player.name;

  betAmountLabel.for = "betAmountValue";
  betAmountLabel.textContent = "Amount:";

  betAmountDiv.style.width = "66%";
  betAmountDiv.style.margin = "auto";

  playerDiv.classList.add("selectedPlayer");

  playerBetLabel.for = "playersBetRange";
  playerBetLabel.classList.add("form-label");
  playerBetLabel.textContent = `Place Bet:`;

  playerBetRange.type = "range";
  playerBetRange.classList.add("form-range");
  playerBetRange.min = "0";
  playerBetRange.max = player.coins;
  playerBetRange.step = "1";
  playerBetRange.id = "playersBetRange";

  betAmountInput.addEventListener("change", function handleChange(e) {
    playerBetRange.value = e.target.value;
  });
  playerBetRange.addEventListener("change", function handleChange(e) {
    betAmountInput.value = e.target.value;
  });

  betAmountDiv.appendChild(betAmountInput);
  betAmountDiv.appendChild(betAmountLabel);
  betAreaDiv.appendChild(playerBetLabel);
  betAreaDiv.appendChild(playerBetRange);
  betAreaDiv.appendChild(betAmountDiv);
  playerDiv.appendChild(betAreaDiv);
};

const placeRunners = (runners) => {
  runners.forEach((runner) => {
    const runnerDiv = document.createElement("div");
    const runnerImg = document.createElement("img");

    runnerDiv.id = runner.name;
    runnerDiv.dataset.runnerName = runner.name;
    runnerDiv.dataset.runnerSpeed = runner.step;
    runnerDiv.style.margin = "1rem";

    runnerImg.style.cursor = "pointer";
    runnerImg.style.height = "75px";
    runnerImg.style.width = "75px";
    runnerImg.src = runner.img;
    runnerImg.alt = runner.name;
    runnerImg.dataset.runnerImage = runner.name;
    runnerImg.addEventListener("click", selectRacer);

    runnerDiv.appendChild(runnerImg);
    trackDiv.appendChild(runnerDiv);
  });
  runnersBtn.disabled = true;
  runnersBtn.style.backgroundColor = "gray";
  runnersBtn.classList.remove("btn-primary");
  startBtn.style.backgroundColor = "";
  startBtn.disabled = false;
  startBtn.classList.add("btn-primary");
  document.querySelectorAll("[data-player-bet]").forEach((button) => {
    button.disabled = false;
  });
};

const startRace = () => {
  if (trackDiv.getElementsByClassName("lockedRacer").length === 0) {
    throw new Error("Please lock a racer");
  }
  pendingRace = false;
  racing = true;
  while (racing) {
    trackDiv.querySelectorAll("[data-runner-name]").forEach((runner) => {
      if (racing) {
        moveRunner(runner);
      }
      if (runner.offsetLeft > 1400) {
        handleWinner(runner);
        return;
      }
    });
  }
  resetBtn.disabled = false;
  resetBtn.style.backgroundColor = "";
  resetBtn.classList.add("btn-primary");
  startBtn.disabled = true;
  startBtn.style.backgroundColor = "gray";
  startBtn.classList.remove("btn-primary");
};

const moveRunner = (runner) => {
  let runnerWay =
    runner.offsetLeft + Math.random() * Number(runner.dataset.runnerSpeed);
  runner.style.left = `${runnerWay}px`;
};

const handleWinner = (runner) => {
  racing = false;
  resultsDiv.querySelector(
    "h1"
  ).textContent = `winner: ${runner.dataset.runnerName}`;
  winners = findWinners(runner);
  winners.forEach((winner) => {
    winner.coins += bank / winners.length;
  });
  bank = 0;
  bankValue.textContent = `Bank total is: ${bank}`;
  playersDiv
    .querySelectorAll("[data-player-coins-label]")
    .forEach((playerLabel) => {
      playerLabel.textContent = `Coins: ${
        findPlayerByName(playerLabel.dataset.playerCoinsLabel).coins
      }💰`;
    });
  const locked = playersDiv.getElementsByClassName("lockedPlayer");
  Array.from(locked).forEach((div) => {
    div.classList.remove("lockedPlayer");
  });
  const selected = playersDiv.getElementsByClassName("selectedPlayer");
  Array.from(selected).forEach((div) => {
    div.classList.remove("selectedPlayer");
  });
};

const findWinners = (runner) =>
  playingPlayers.filter(
    (player) => player.choice === runner.dataset.runnerName
  );

const resetRace = () => {
  trackDiv.querySelectorAll("[data-runner-name]").forEach((runner) => {
    runner.style.left = ``;
  });
  trackDiv.querySelectorAll("[data-runner-image]").forEach((runnerImg) => {
    runnerImg.addEventListener("click", selectRacer);
  });

  const lockedRacers = trackDiv.getElementsByClassName("lockedRacer");
  Array.from(lockedRacers).forEach((racer) => {
    racer.classList.remove("lockedRacer");
  });
  const selectedRacers = trackDiv.getElementsByClassName("selectedRacer");
  Array.from(selectedRacers).forEach((racer) => {
    racer.classList.remove("selectedRacer");
  });
  pendingRace = true;
  playingPlayers.forEach((player) => {
    player.choice = null;
  });

  startBtn.style.backgroundColor = "";
  startBtn.disabled = false;
  startBtn.classList.add("btn-primary");
  resetBtn.disabled = true;
  resetBtn.style.backgroundColor = "gray";
  resetBtn.classList.remove("btn-primary");
  resultsDiv.querySelector("h1").textContent = "";

  bank = 0;
  bankValue.textContent = `Bank total is: ${bank}`;

  document.querySelectorAll("[data-player-bet]").forEach((btn) => {
    btn.style.display = "";
  });
};

const selectRacer = (e) => {
  if (pendingRace) {
    if (trackDiv.getElementsByClassName("selectedRacer").length !== 0) {
      trackDiv
        .getElementsByClassName("selectedRacer")[0]
        .classList.remove("selectedRacer");
    }
    e.target.classList.add("selectedRacer");
    lockBtn.disabled = false;
  }
  return;
};

const lockRacer = () => {
  if (pendingRace) {
    const racer = trackDiv.getElementsByClassName("selectedRacer")[0];

    const playerBetAmount = playersDiv.querySelector("[data-bet-placed]");

    if (!playerBetAmount) return;

    const playerPlaced = findPlayerByName(
      playersDiv.querySelector("[data-bet-player-name]").dataset.betPlayerName
    );
    if (playerPlaced.choice) {
      throw new Error("You already chose an animal");
    }
    if (playerPlaced.coins - playerBetAmount.value < 0) {
      throw new Error("You don't have enough money");
    }

    playerPlaced.coins = playerPlaced.coins - playerBetAmount.value;
    playersDiv
      .querySelectorAll("[data-player-coins-label]")
      .forEach((playerLabel) => {
        playerLabel.textContent = `Coins: ${
          findPlayerByName(playerLabel.dataset.playerCoinsLabel).coins
        }💰`;
      });
    bank += Number(playerBetAmount.value);
    bankValue.textContent = `Bank total is: ${bank}`;

    playerPlaced.choice = racer.dataset.runnerImage;

    playersDiv
      .getElementsByClassName("selectedPlayer")[0]
      .classList.add("lockedPlayer");
    playersDiv
      .getElementsByClassName("selectedPlayer")[0]
      .classList.remove("selectedPlayer");

    playersDiv.querySelectorAll("[data-bet-area]").forEach((player) => {
      if (player.dataset.betArea === playerPlaced.name) {
        player.style.display = "none";

        const handleBet = document.getElementsByClassName("betAmountValue");
        Array.from(handleBet).forEach((playerBet) => {
          playerBet.removeAttribute("data-bet-player-name");
        });
      }
    });

    document.querySelectorAll("[data-player-bet]").forEach((button) => {
      button.disabled = false;
    });

    racer.classList.remove("selectedRacer");
    racer.classList.add("lockedRacer");
    lockBtn.disabled = true;
  }
};

const findPlayerByName = (name) =>
  playingPlayers.filter((player) => player.name === name)[0];

handlePlayers();

runnersBtn.addEventListener("click", () => placeRunners(animals), true);
startBtn.addEventListener("click", () => startRace());
resetBtn.addEventListener("click", () => resetRace());
lockBtn.addEventListener("click", () => lockRacer());

controlsDiv.appendChild(runnersBtn);
controlsDiv.appendChild(startBtn);
controlsDiv.appendChild(resetBtn);
resultsDiv.appendChild(lockBtn);
