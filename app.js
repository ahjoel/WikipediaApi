// API ENDPOINT : `https://en.wikipedia.org/w/api.php?action=query&list=search&format=json&origin=*&srlimit=20&srsearch=${searchInput}`

const form = document.querySelector("form");
const input = document.querySelector("input");
const errorMsg = document.querySelector(".error-msg");
const loader = document.querySelector(".loader");

form.addEventListener("submit", handleSubmit);

function handleSubmit(e) {
  e.preventDefault();

  if (input.value === "") {
    errorMsg.textContent = "Wops, veuillez remplir le champ de recherche";
    return;
  } else {
    errorMsg.textContent = "";
    loader.style.display = "flex";
    // Reset pour d'autres recherche
    resultsDisplay.textContent = "";
    wikiApiCall(input.value);
  }
}

// Async et await permet de patienter le chargement des données depuis l'api
async function wikiApiCall(searchInput) {
    try {
        const response = await fetch(
            `https://en.wikipedia.org/w/api.php?action=query&list=search&format=json&origin=*&srlimit=20&srsearch=${searchInput}`
          );
        
          // Retourne le statut d'une erreur 
          if (!response.ok) {
            throw new Error(`${response.status}`)
          }

          //console.log(response)
          // Methode json pour analyser le corps de la requete
          const data = await response.json();
          //console.log(data);
        
          // Resultat de recherche en parametre
          createCards(data.query.search)
    } catch (error) {
        // Non acces à la base ou internet indisponible exception levée
        errorMsg.textContent = `${error}`;
        loader.style.display = "none";
    }
  
}

const resultsDisplay = document.querySelector(".results-display")

function createCards(data) {
    if (!data.length) {
        errorMsg.textContent = "Wopsy, aucun résultat";
        loader.style.display = "none";
        return;
    }
    data.forEach(el => {
        const url = `https://en.wikipedia.org/?curid=${el.pageid}`
        const card = document.createElement("div")
        card.className = "result-item"
        card.innerHTML = `
        <h3 class="result-title">
            <a href="${url}" target="_blank">${el.title}</a>
        </h3>
        <a href="${url}" class="result-link" target="_blank">${url}</a>
        <span class="result-snippet">${el.snippet}</span>
        <br>
        `
        // Le loader tourne tant que tous les données ne sont pas encore chargées
        resultsDisplay.appendChild(card)
    });

    // Suppression du loader une fois les données chargées
    loader.style.display = "none";
}
