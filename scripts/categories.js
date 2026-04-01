const API_KEY = "527810a36e91421e92e503eeb06cf55d";
const BASE_URL = "https://api.rawg.io/api/games";

let currentPage = 1;
const gamesPerPage = 8;
let totalPages = 1;

async function fetchGames() {
    const grid = document.getElementById("game-grid");
    const pagination = document.getElementById("pagination");

    try {
        // Build the URL link to request data
        const url = `${BASE_URL}?key=${API_KEY}&page=${currentPage}&page_size=${gamesPerPage}`;
        
        // Ask the API for data and wait for the response
        const response = await fetch(url);
        const data = await response.json();
        
        // Calculate the total number of pages available
        totalPages = Math.ceil(data.count / gamesPerPage);

        // Display the games on the screen using a loop
        let htmlSnippet = "";
        
        for (let i = 0; i < data.results.length; i++) {
            const game = data.results[i];
            
            // Get standard game info
            const title = game.name || "Unknown Game";
            const bgImage = game.background_image || "";
            const rating = game.rating || "No rating";
            const releaseYear = game.released ? game.released.substring(0, 4) : "—";
            
            // Get the first genre category
            let genreName = "Game";
            if (game.genres && game.genres.length > 0) {
                genreName = game.genres[0].name;
            }

            // Create the HTML card string for the game card
            htmlSnippet += `
            <article class="game-card">
              <div class="game-card__bg" style="background-image: url('${bgImage}');"></div>
              <div class="game-card__overlay"></div>
              <span class="game-card__rating">&#9733; ${rating}</span>
              
              <div class="game-card__bottom">
                <div class="game-card__tags">
                    <span>${genreName}</span>
                </div>
                <h2 class="game-card__title">${title}</h2>
                <div class="game-card__meta">
                  <span class="game-card__platforms">&#128187; &#127918;</span>
                  <span class="game-card__publisher">${releaseYear}</span>
                </div>
              </div>
            </article>
            `;
        }
        
        // Insert all the cards into our grid container on the webpage
        grid.innerHTML = htmlSnippet;
        
        // Pagination
        let buttonsHtml = "";
        
        // Prev button
        let disablePrev = currentPage === 1 ? "disabled" : "";
        buttonsHtml += `<button class="pagination__arrow" onclick="changePage(${currentPage - 1})" ${disablePrev}>&lt; Previous</button>`;
        
        // Determine start and end page numbers to show (show 3 pages at a time)
        let startPage = Math.max(1, currentPage - 1);
        let endPage = startPage + 2;
        
        // Make sure we never go above total pages
        if (endPage > totalPages) {
            endPage = totalPages;
            startPage = Math.max(1, endPage - 2); 
        }
        
        // Generate the Page Number buttons
        for (let i = startPage; i <= endPage; i++) {
            if (i === currentPage) {
                buttonsHtml += `<button class="pagination__page is-current">${i}</button>`;
            } else {
                buttonsHtml += `<button class="pagination__page" onclick="changePage(${i})">${i}</button>`;
            }
        }
        
        // Next button
        let disableNext = currentPage === totalPages ? "disabled" : "";
        buttonsHtml += `<button class="pagination__arrow" onclick="changePage(${currentPage + 1})" ${disableNext}>Next &gt;</button>`;
        
        // Insert buttons into pagination container
        pagination.innerHTML = buttonsHtml;

    } catch (error) {
        console.error("Failed to load games:", error);
        grid.innerHTML = '<p style="color: red;">Error loading games. Please check your internet or API key.</p>';
    }
}

// 6. Function to change the page whenever a button is clicked
function changePage(newPage) {
    // Check if the given page exists
    if (newPage >= 1 && newPage <= totalPages) {
        currentPage = newPage;   // update the current page variable
        fetchGames();            // fetch the games again for the newly chosen page
    }
}

// 7. Start the entire process immediately when the JavaScript file loads
fetchGames();
