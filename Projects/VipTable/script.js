const myTable = document.getElementById("my-table");
const peopleTable = document.createElement("table");
const tableHead = document.createElement("thead");
const tableBody = document.createElement("tbody");

const theadColName = document.createElement("th");
const theadColWorth = document.createElement("th");
const theadColSource = document.createElement("th");
const theadColImage = document.createElement("th");

peopleTable.classList.add("table", "table-hover");
tableHead.classList.add("table-light");
tableBody.classList.add("table-group-divider");

theadColName.textContent = "Name";
theadColWorth.textContent = "Worth";
theadColSource.textContent = "Source";
theadColImage.textContent = "Image";
let richPeople = json_ar;

tableHead.appendChild(theadColName);
tableHead.appendChild(theadColWorth);
tableHead.appendChild(theadColSource);
tableHead.appendChild(theadColImage);

peopleTable.appendChild(tableHead);
peopleTable.appendChild(tableBody);
myTable.appendChild(peopleTable);

const createTable = () => {
  tableBody.innerHTML = "";
  richPeople.map((people) => {
    const eachRow = document.createElement("tr");
    eachRow.dataset.rowName = people.name;
    eachRow.addEventListener("click", (e) => handleClick(e));

    const dataName = document.createElement("td");
    dataName.textContent = people.name;
    const dataWorth = document.createElement("td");
    dataWorth.textContent = people.worth;
    const dataSource = document.createElement("td");
    dataSource.textContent = people.source;
    const dataImage = document.createElement("td");
    const image = document.createElement("img");
    image.src = people.image;
    image.alt = people.name;
    image.style.width = "100px";
    image.style.height = "100px";
    dataImage.appendChild(image);
    eachRow.appendChild(dataName);
    eachRow.appendChild(dataWorth);
    eachRow.appendChild(dataSource);
    eachRow.appendChild(dataImage);
    tableBody.appendChild(eachRow);
  });
};

const handleClick = (e) => {
  const dude = e.target.closest("[data-row-name]").dataset.rowName;
  richPeople = richPeople.filter((people) => people.name !== dude);
  createTable();
};

createTable();
