const cityInput = document.createElement("input");
const searchInput = document.getElementById("all-city-choice");
const submitCityBtn = document.createElement("button");
const searchBtn = document.createElement("button");
const resultSpan = document.createElement("span");
const showAllBtn = document.createElement("button");
const allCitiesUl = document.createElement("ul");
const cityDataList = document.createElement("datalist");

const enterDiv = document.getElementById("enter-city");
const searchDiv = document.getElementById("search-city");
const resultDiv = document.getElementById("show-result");
const showAllDiv = document.getElementById("show-all");
const allResultDiv = document.getElementById("result-all");
const categoryDdl = document.getElementById("city-category-ddl");

const hebrewRegex = /^[א-ת\s]+$/;

submitCityBtn.textContent = "Submit";
searchBtn.textContent = "Search";
showAllBtn.textContent = "Show All Cities!";

allResultDiv.style.display = "none";
resultDiv.style.display = "none";

submitCityBtn.classList.add("btn", "btn-primary");
searchBtn.classList.add("btn", "btn-primary");
showAllBtn.classList.add("btn", "btn-primary");
allCitiesUl.classList.add("list-group", "list-group-flush");

const save = () => {
  localStorage.setItem("cityData", JSON.stringify(cityData));
};
const load = () => JSON.parse(localStorage.getItem("cityData"));

let cityData = load() ? load() : data;

cityData = cityData.sort((a, b) => a.name.localeCompare(b.name));
cityDataList.id = "all-city-data";
cityData.forEach((city) => {
  const cityOption = document.createElement("option");
  cityOption.value = city.name;
  cityDataList.appendChild(cityOption);
});

const addCity = () => {
  if (!cityInput.value) throw new Error("Please enter valid data");
  if (!hebrewRegex.test(cityInput.value))
    throw new Error("Please enter only Hebrew");
  cityData.push({ id: currentId, name: cityInput.value, category: "" });
  currentId++;
  cityInput.value = "";
  cityInput.focus();
  showAllBtn.style.display = "block";
  allResultDiv.style.display = "none";
  handleNewCity();
  save();
};

const handleNewCity = () => {
  const cityOption = document.createElement("option");
  cityOption.value = cityData[cityData.length - 1].name;
  cityData = cityData.sort((a, b) => a.name.localeCompare(b.name));
  cityDataList.innerHTML = "";
  //הדרך היחידה שעבדה לי לגרום לרשימה להסתדר לפי האלף בית
  cityData.forEach((city) => {
    const cityOption = document.createElement("option");
    cityOption.value = city.name;
    cityDataList.appendChild(cityOption);
  });
};

const searchCity = () => {
  if (!searchInput.value) throw new Error("Please enter valid search");
  const result = findCityByName(searchInput.value);
  resultSpan.innerText = result.name;
  resultDiv.style.display = "block";
};

const showAllCities = () => {
  showAllBtn.style.display = "none";
  allResultDiv.style.display = "block";
  allCitiesUl.innerHTML = "";
  cityData.forEach((city) => {
    const cityLi = document.createElement("li");
    cityLi.classList.add("list-group-item");
    cityLi.innerText = city.name;
    cityLi.dataset.cityid = city.id;

    const categoryResetBtn = document.createElement("button");
    categoryResetBtn.textContent = "איפוס קטגוריה";
    categoryResetBtn.classList.add("btn", "btn-warning", "d-none");
    categoryResetBtn.addEventListener("click", (e) => handleCategory(e));

    if (city.category) {
      switch (city.category) {
        case "לעולם לא אבקר":
          cityLi.classList.add("bg-danger");
        case "ביקרתי":
          cityLi.classList.add("bg-success");
        case "בעתיד אבקר":
          cityLi.classList.add("bg-primary");
      }
      categoryResetBtn.classList.remove("d-none");
    } else {
      cityLi.innerHTML += `<div class="dropdown-center dropend" style="display:inline"> ${categoryDdl.innerHTML} </div>`;
      for (let i = 0; i < 3; i++) {
        cityLi
          .getElementsByTagName("li")
          [i].addEventListener("click", (e) => handleCategory(e));
      }
    }
    cityLi.appendChild(categoryResetBtn);
    allCitiesUl.appendChild(cityLi);
  });
};

const handleCategory = (e) => {
  if (!e.target.closest(`[data-cityid]`)) return;
  const city = findCityById(e.target.closest(`[data-cityid]`).dataset.cityid);
  const category = e.srcElement.textContent;
  const cityLi = document.querySelector(`[data-cityid="${city.id}"]`);
  if (category === "איפוס קטגוריה") {
    cityData[cityData.indexOf(city)].category = null;
    cityLi.classList.remove("bg-danger", "bg-success", "bg-primary");
    cityLi.innerHTML += `<div class="dropdown-center dropend" style="display:inline"> ${categoryDdl.innerHTML} </div>`;
    for (let i = 0; i < 3; i++) {
      cityLi
        .getElementsByTagName("li")
        [i].addEventListener("click", (e) => handleCategory(e));
    }
  } else {
    cityData[cityData.indexOf(city)].category = category;
    switch (city.category) {
      case "לעולם לא אבקר":
        cityLi.classList.add("bg-danger");
      case "ביקרתי":
        cityLi.classList.add("bg-success");
      case "בעתיד אבקר":
        cityLi.classList.add("bg-primary");
    }
  }
  showAllCities();
  save();
};

const findCityByName = (cityName) =>
  cityData.filter((city) => city.name === cityName)[0];

const findCityById = (id) =>
  cityData.filter((city) => city.id === Number(id))[0];

submitCityBtn.addEventListener("click", () => addCity());
searchBtn.addEventListener("click", () => searchCity());
showAllBtn.addEventListener("click", () => showAllCities());

resultDiv.appendChild(resultSpan);
enterDiv.appendChild(cityInput);
enterDiv.appendChild(submitCityBtn);
searchDiv.appendChild(cityDataList);
searchDiv.appendChild(searchBtn);
showAllDiv.appendChild(showAllBtn);
allResultDiv.appendChild(allCitiesUl);
