const cardTitle = document.querySelector(".card-title");
const cardSubTitle = document.querySelector(".card-subtitle");
const listGroup = document.querySelector(".list-group");
const optionList = document.querySelector("#optionList");
const formSwitch = document.querySelector(".form-switch");

let allGames = false;

let leagueVar = "";

const today = new Date();
//console.log(today.toJSON());

////2024-05-05T18:46:04.404Z
const dateString = today.toJSON().slice(0, 10);
//console.log(dateString);

cardTitle.innerText = today.toDateString();

setInterval(updateTime, 1000);

function updateTime() {
  const today2 = new Date();
  cardSubTitle.innerText = today2.toLocaleTimeString("de-DE");
}

async function getResults(league) {
  const response = await fetch(
    `https://api.openligadb.de/getmatchdata/${league}/2023`
  );
  const results = await response.json();
  //console.log(results);
  parseDate(results);
}

//parses the data from the API and extracts team names and points
function parseDate(array) {
  const gameResults = array.map((element) => ({
    teamOne: element.team1.teamName,
    teamTwo: element.team2.teamName,
    resultTeamOne: element.matchResults[1]?.pointsTeam1,
    resultTeamTwo: element.matchResults[1]?.pointsTeam2,
    gameDate: element.matchDateTimeUTC,
  }));
  //console.log(gameResults);
  createLiElements(gameResults);
}

//create the li elements with team names and points
function createLiElements(array) {
  removeLiElements();

  array.forEach((element) => {
    if (dateString === element.gameDate?.slice(0, 10) || allGames) {
      const li = document.createElement("li");
      li.classList.add(
        "list-group-item",
        "text-primary-emphasis",
        "bg-primary-subtle",
        "border",
        "border-primary-subtle",
        "rounded-3"
      );
      li.innerHTML = `${element.teamOne} VS ${element.teamTwo}<br>${element.resultTeamOne}:${element.resultTeamTwo}`;
      listGroup.appendChild(li);
    }
  });
  checkforGames();
}

//removes all existing DOM li elements
function removeLiElements() {
  const LiElements = document.querySelectorAll(".list-group-item");

  LiElements.forEach((element) => {
    element.remove();
  });
}

//check if dom elements with results were created and show warning
function checkforGames() {
  const LiElements = document.querySelector(".list-group-item");
  //console.log(`LI Elements: ${LiElements}`);
  if (!LiElements) {
    const li = document.createElement("li");
    li.classList.add("list-group-item", "list-group-item-warning");
    li.innerHTML = `No games today!`;
    listGroup.appendChild(li);
  }
}

//event listener to listen to ENTER key and get selection of league
/* document.addEventListener("keydown", (event) => {
  event.preventDefault();
  console.log(event.key);
  if (event.key.toUpperCase() == "ENTER") {
    leagueVar = optionList.value;
    console.log(`Selected league: ${leagueVar}`);
    getResults(leagueVar);
  }
}); */

//event listener to listen to click events om option list and get selection of league
optionList.addEventListener("mouseup", (event) => {
  event.preventDefault();

  //console.log(`${event} clicked!`);
  leagueVar = optionList.value;
  //console.log(leagueVar);
  if (leagueVar != "") {
    getResults(leagueVar);
  }
});

//toggle if either all games or only todays game results should be displayed
formSwitch.addEventListener("click", (event) => {
  let formSwitchInput = document.querySelector(".form-check-input");
  // console.log(formSwitchInput);
  console.log(formSwitchInput.checked);

  if (formSwitchInput.checked) {
    console.log(`toggle active!`);
    allGames = false;
    formSwitchInput.removeAttribute("checked");
  } else {
    console.log(`toggle inactive!`);
    allGames = true;
    formSwitchInput.setAttribute("checked", "");
  }
});
