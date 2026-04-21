const API_KEY = "48e17256";
const BASE_URL = "https://www.omdbapi.com/";

const moviesGrid = document.getElementById("moviesGrid");
const searchInput = document.querySelector(".search-bar");

// SEARCH MOVIES
async function searchMovies(query) {
    const res = await fetch(`${BASE_URL}?apikey=${API_KEY}&s=${query}`);
    const data = await res.json();

    if (data.Search) {
        displayMovies(data.Search);
    } else {
        moviesGrid.innerHTML = "<p>No results found</p>";
    }
}

// DISPLAY MOVIES
function displayMovies(movies) {
    moviesGrid.innerHTML = "";

    movies.forEach(movie => {
        const movieEl = document.createElement("div");
        movieEl.classList.add("movie-card");

        movieEl.innerHTML = `
            <img src="${movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/200"}">
            <h3>${movie.Title}</h3>
            <p>${movie.Year}</p>
        `;

        movieEl.addEventListener("click", () => {
            getMovieDetails(movie.imdbID);
        });

        moviesGrid.appendChild(movieEl);
    });
}

// GET FULL DETAILS
async function getMovieDetails(id) {
    const res = await fetch(`${BASE_URL}?apikey=${API_KEY}&i=${id}`);
    const movie = await res.json();

    showDetails(movie);
}

// SHOW DETAILS (FIXED)
function showDetails(movie) {
    const detailsSection = document.getElementById("detailsSection");

    const poster = movie.Poster !== "N/A"
        ? movie.Poster
        : "https://via.placeholder.com/300";

    detailsSection.innerHTML = `
        <div class="details-container">
            <img src="${poster}">
            <div class="details-text">
                <h2>${movie.Title}</h2>
                <p>${movie.Plot}</p>
                <p><strong>Actors:</strong> ${movie.Actors}</p>
                <p><strong>Rating:</strong> ${movie.imdbRating}</p>
            </div>
        </div>
        ${createVotingUI()}
    `;

    // ✅ ADD THESE LINES HERE
    setupActors(movie);
    setupSceneButton();
    renderVotes();
    renderScenes();
}

// SEARCH EVENT (CORRECT PLACE)
searchInput.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
        searchMovies(e.target.value);
    }
});


function createVotingUI() {
    return `
        <div class="voting-container">

            <h3>🎭 Vote Best Actor</h3>
            <div id="actorList"></div>
            <div id="voteResults"></div>

            <h3>🎬 Best Scene</h3>
            <input id="sceneInput" placeholder="Enter your favorite scene">
            <button id="sceneBtn">Submit</button>

            <div id="sceneList"></div>

        </div>
    `;
}

function setupActors(movie) {
    const actors = movie.Actors ? movie.Actors.split(", ") : [];

    const actorList = document.getElementById("actorList");

    actorList.innerHTML = "";

    actors.forEach(actor => {
        const btn = document.createElement("button");
        btn.textContent = actor;

        btn.onclick = () => vote(actor);

        actorList.appendChild(btn);
    });
}

let votes = {};

function vote(actor) {
    if (!votes[actor]) {
        votes[actor] = 0;
    }

    votes[actor]++;

    renderVotes();
}

function renderVotes() {
    const voteResults = document.getElementById("voteResults");

    voteResults.innerHTML = "";

    for (let actor in votes) {
        voteResults.innerHTML += `<p>${actor}: ${votes[actor]} votes</p>`;
    }
}

let scenes = [];

function setupSceneButton() {
    const btn = document.getElementById("sceneBtn");

    btn.onclick = () => {
        const input = document.getElementById("sceneInput");

        if (!input.value) return;

        scenes.push(input.value);

        input.value = "";

        renderScenes();
    };
}

function renderScenes() {
    const list = document.getElementById("sceneList");

    list.innerHTML = scenes.map(scene => `<p>${scene}</p>`).join("");
}



// DEFAULT LOAD
searchMovies("Avengers");
setupActors(movie);
setupSceneButton();
renderVotes();
renderScenes();