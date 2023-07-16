const apiKey = '0d92ab3e9a4135271e50f3febd03bf8f';
const apiUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}`;

async function getMovies() {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        return data.results;
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}

function displayMovies(movies) {
    const movieContainer = document.getElementById('movie-container');

    movies.forEach((movie) => {
        const movieCard = document.createElement('div');
        movieCard.classList.add('movie-card');

        const moviePoster = document.createElement('img');
        moviePoster.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
        moviePoster.alt = movie.title;
        moviePoster.classList.add('movie-poster');

        const movieTitle = document.createElement('h2');
        movieTitle.innerText = movie.title;
        movieTitle.classList.add('movie-title');

        const movieOverview = document.createElement('p');
        movieOverview.innerText = movie.overview;
        movieOverview.classList.add('movie-overview');

        movieCard.appendChild(moviePoster);
        movieCard.appendChild(movieTitle);
        movieCard.appendChild(movieOverview);

        movieContainer.appendChild(movieCard);
    });
}

function displayMovieDetails(movie) {
    const movieDetailsContainer = document.getElementById('movie-details');
    movieDetailsContainer.innerHTML = `
        <div class="search-result-card">
            <h2>${movie.title}</h2>
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" class="movie-poster">
            <p class="movie-overview">${movie.overview}</p>
            <p>Release Date: ${movie.release_date}</p>
            <p>Rating: ${movie.vote_average}/10</p>
        </div>
    `;
    movieDetailsContainer.style.display = 'block';
}

async function searchMovieByTitle(title) {
    try {
        const searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(title)}`;
        const response = await fetch(searchUrl);
        const data = await response.json();
        const movie = data.results[0]; 
        if (movie) {
            const movieContainer = document.getElementById('movie-container');
            const existingMovieCards = document.querySelectorAll('.movie-card');
            if (existingMovieCards.length > 0) {
                movieContainer.insertBefore(createSearchResultCard(movie), existingMovieCards[0]);
            } else {
                movieContainer.appendChild(createSearchResultCard(movie));
            }
        } else {
            alert('Movie not found!');
            const movieDetailsContainer = document.getElementById('movie-details');
            movieDetailsContainer.style.display = 'none';
        }
    } catch (error) {
        console.error('Error searching for movie:', error);
    }
}

function createSearchResultCard(movie) {
    const searchResultCard = document.createElement('div');
    searchResultCard.classList.add('search-result-card');
    searchResultCard.innerHTML = `
        <h2>${movie.title}</h2>
        <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" class="movie-poster">
        <p class="movie-overview">${movie.overview}</p>
        <p>Release Date: ${movie.release_date}</p>
        <p>Rating: ${movie.vote_average}/10</p>
    `;
    return searchResultCard;
}

function addSearchButtonListener() {
    const searchButton = document.getElementById('search-btn');
    searchButton.addEventListener('click', () => {
        const searchInput = document.getElementById('search-input');
        const searchTerm = searchInput.value;
        if (searchTerm.trim() !== '') {
            searchMovieByTitle(searchTerm);
        }
    });
}

async function init() {
    const movies = await getMovies();
    displayMovies(movies);
    addSearchButtonListener();
}

init();
