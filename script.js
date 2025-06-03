let countriesList = [];
const container = document.querySelector(".container");
const modeBtn = document.querySelector(".mode-change");
const body = document.querySelector("body");

document.addEventListener("DOMContentLoaded", function () {
  getCountries();
});

async function getCountries() {
  const url = "/data.json";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const data = await response.json();

    countriesList = data;
    localStorage.setItem("countriesList", JSON.stringify(countriesList));
    showCountries(countriesList);
    showFilter();
  } catch (error) {
    console.error("Failed to fetch countries:", error);
  }
}

function showCountries(list) {
  const listContainer = document.querySelector(".countries_wrapper-list");
  if (!listContainer) return;
  listContainer.innerHTML = "";

  list?.forEach((item) => {
    const listItem = document.createElement("div");
    listItem.className = "countries";
    listItem.setAttribute("data-item-name", item.name);

    listItem.innerHTML = `

      <div class="country-img-wrapper">
        <img class="country-img" src="${item.flags.png}">
      </div>
      <div class="country-contents">
        <h2 class="country-title">${item.name}</h2>
        <div class="country-details">
          <p><strong>Population:</strong> ${item.population}</p>
          <p><strong>Region:</strong> ${item.region}</p>
          <p><strong>Capital:</strong> ${item.capital}</p>
        </div>
      </div>`;
    listItem.addEventListener("click", function () {
      showDetailedCountry(item.name);
    });
    listContainer.appendChild(listItem);
  });
}

function showFilter() {
  const filterContainer = document.querySelector(".filter");
  if (!filterContainer) return;
  filterContainer.innerHTML = "";

  const regions = [...new Set(countriesList.map((item) => item.region))];

  const filter = document.createElement("div");
  filter.className = "filterContainer";
  filter.innerHTML = `
    <button class="dropbtn">Filter by Region</button>
    <div class="dropdown-content">
     
      ${regions
        .map(
          (region) =>
            `<a class="dropdown-items" href="#" data-region="${region}">${region}</a>`
        )
        .join("")}
    </div>`;
  filterContainer.appendChild(filter);
}

container?.addEventListener("click", function (event) {
  const target = event.target;

  if (target.classList.contains("dropdown-items")) {
    const regionattribute = target.getAttribute("data-region");
    showFilterItems(regionattribute);
  }

  if (target.classList.contains("dropbtn")) {
    const dropdownContent = document.querySelector(".dropdown-content");
    console.log("btn");
    dropdownContent.classList.add("show");
  }
  if (!target.classList.contains("dropbtn")) {
    const dropdownContent = document.querySelector(".dropdown-content");
    dropdownContent.classList.remove("show");
  }
});

function showFilterItems(regionattribute) {
  const filteredCountries = countriesList.filter(
    (item) => item.region === regionattribute
  );
  showCountries(filteredCountries);
}

function searchCountries() {
  const input = document.getElementById("search-input");
  const filterValue = input?.value.trim().toLowerCase();
  console.log("input", filterValue);
  const filteredBySearch = countriesList.filter((country) =>
    country.name.toLowerCase().includes(filterValue)
  );
  console.log("inputsearch", filteredBySearch);
  showCountries(filteredBySearch);
}

function showDetailedCountry(countryName) {
  console.log("countryName", countryName);
  localStorage.setItem("countryName", JSON.stringify(countryName));
  window.location.href = "/detail-page.html";
}

modeBtn?.addEventListener("click", () => {
  console.log("mode change");
  body?.classList.toggle("dark");
  if (body?.classList.contains("dark")) {
    modeBtn.textContent = "light mode";
    modeBtn.style.color = "#fff";
  } else {
    modeBtn.textContent = "dark mode";
    modeBtn.style.color = "#000";
  }
});
