const redLabel = document.createElement("label");
const redInput = document.createElement("input");
redInput.placeholder = "0";

const greenLabel = document.createElement("label");
const greenInput = document.createElement("input");
greenInput.placeholder = "0";

const blueLabel = document.createElement("label");
const blueInput = document.createElement("input");
blueInput.placeholder = "0";

const colorsBtn = document.createElement("button");

const selectionDiv = document.getElementById("user-selection");
const resultDiv = document.getElementById("result-colors");
const textDiv = document.getElementById("text");
const favoriteDiv = document.getElementById("favorite-div");
const favoriteColorsDiv = document.getElementById("favorite-colors");

const favorites = [];

resultDiv.style.height = "100px";
resultDiv.style.width = "auto";
resultDiv.style.display = "flex";
resultDiv.style.flexDirection = "row";
resultDiv.style.flexWrap = "wrap";

textDiv.style.display = "none";

favoriteDiv.style.display = "none";
favoriteColorsDiv.style.display = "flex";
favoriteColorsDiv.style.height = "100px";
favoriteColorsDiv.style.width = "auto";
favoriteColorsDiv.style.flexDirection = "row";
favoriteColorsDiv.style.flexWrap = "wrap";

redLabel.textContent = "Red: ";
greenLabel.textContent = "Green: ";
blueLabel.textContent = "Blue: ";
colorsBtn.textContent = "Submit Colors";

colorsBtn.classList.add("btn", "btn-secondary");

function collectColors() {
  return [
    Number(redInput.value),
    Number(greenInput.value),
    Number(blueInput.value),
  ];
}

const submitColors = () => {
  const colors = collectColors();
  colors.forEach((color) => {
    if (!Number.isFinite(color) || color < 0 || color > 255)
      throw new Error("Colors values are incorrect");
  });
  buildColorBlocks(colors);
  textDiv.style.display = "block";
  redInput.value = "";
  greenInput.value = "";
  blueInput.value = "";
  redInput.focus();
};

const getRGB = (colors) => `rgb(${colors[0]}, ${colors[1]}, ${colors[2]})`;

const buildColorBlocks = (colors) => {
  const fullBlock = document.createElement("div");
  const favoriteTxt = document.createElement("span");
  const colorBlock = document.createElement("div");

  colorBlock.style.width = "75px";
  colorBlock.style.height = "75px";
  colorBlock.style.backgroundColor = getRGB(colors);
  colorBlock.style.border = "1px solid black";

  favoriteTxt.textContent = "Favorite";

  colorBlock.addEventListener("click", (e) => handleHex(e));
  favoriteTxt.addEventListener("click", (e) => addToFavorite(e));

  fullBlock.appendChild(colorBlock);
  fullBlock.appendChild(favoriteTxt);
  resultDiv.appendChild(fullBlock);
};

const handleFavorites = () => {
  favoriteDiv.style.display = "block";
  const block = favorites[favorites.length - 1];
  const favoriteBlock = document.createElement("div");
  const colorBlock = document.createElement("div");
  const favoriteName = document.createElement("span");

  colorBlock.style.width = "75px";
  colorBlock.style.height = "75px";
  colorBlock.style.backgroundColor = block.color;
  colorBlock.style.border = "1px solid black";

  favoriteName.textContent = block.named;

  colorBlock.addEventListener("click", (e) => handleHex(e));

  favoriteBlock.appendChild(colorBlock);
  favoriteBlock.appendChild(favoriteName);
  favoriteColorsDiv.appendChild(favoriteBlock);
  save(block);
  console.log(localStorage);
};

const addToFavorite = (event) => {
  const favoriteColor = event.target.parentElement.children[0];
  const colorInfo = ntc.name(colorToText(favoriteColor));
  favorites.forEach((favorite) => {
    if (favorite.color === colorInfo[0])
      throw new Error("Color is already favorited");
  });

  favorites.push({ color: colorInfo[0], named: colorInfo[1] });
  handleFavorites();
};

const colorToHex = (color) => {
  const hex = Number(color).toString(16);
  return hex.length === 1 ? "0" + hex : hex;
};

const rgbToHex = (colors) =>
  "#" + colorToHex(colors[0]) + colorToHex(colors[1]) + colorToHex(colors[2]);

const handleHex = (e) => {
  const block = e.target;
  if (block.style.backgroundColor === "transparent") {
    textToColor(block);
    return;
  }
  const colorsHex = colorToText(block);
  block.textContent = colorsHex;
  block.style.color = colorsHex;
  block.style.textAlign = "center";
  block.style.alignItems = "center";
  block.style.display = "flex";
  block.style.backgroundColor = "transparent";
};

const colorToText = (block) => {
  const colorsRGB = block.style.backgroundColor
    .replace(/\D/g, ",")
    .split(",")
    .filter((color) => color.length > 0);
  return rgbToHex(colorsRGB);
};

const textToColor = (block) => {
  block.style.backgroundColor = block.style.color;
  block.textContent = "";
};

colorsBtn.addEventListener("click", () => submitColors());

selectionDiv.appendChild(redLabel);
selectionDiv.appendChild(redInput);
selectionDiv.appendChild(greenLabel);
selectionDiv.appendChild(greenInput);
selectionDiv.appendChild(blueLabel);
selectionDiv.appendChild(blueInput);
selectionDiv.appendChild(colorsBtn);
