// Load the JSON data
async function fetchData() {
    try {
        const [gamesResponse, appsResponse] = await Promise.all([
            fetch('/games.json'),
            fetch('/apps.json')
        ]);
        const games = await gamesResponse.json();
        const apps = await appsResponse.json();
        
        // Add a type property to distinguish between games and apps
        games.forEach(game => game.type = 'game');
        apps.forEach(app => app.type = 'app');
        
        return [...games, ...apps]; // Combine both arrays
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}

// Filter data based on search query
function filterData(data, query) {
    return data.filter(item => 
        item.name.toLowerCase().includes(query.toLowerCase())
    );
}

// Render the search results
function renderResults(results) {
    const resultsContainer = document.getElementById('results-container');
    resultsContainer.innerHTML = ''; // Clear previous results

    results.forEach(result => {
        const resultElement = document.createElement('div');
        resultElement.classList.add('search-result');

        // Create elements for name, image, and identifier
        const imageElement = document.createElement('img');
        imageElement.src = result.image;
        imageElement.alt = result.name;

        const nameElement = document.createElement('span');
        nameElement.classList.add('name');
        nameElement.textContent = result.name;

        const identifier = document.createElement('span');
        identifier.classList.add('identifier');
        identifier.textContent = result.type === 'game' ? 'Game' : 'App';

        // Append elements to the result container
        resultElement.appendChild(imageElement);
        resultElement.appendChild(nameElement);
        resultElement.appendChild(identifier);
        resultsContainer.appendChild(resultElement);

        // Add click functionality to redirect to the correct page
        resultElement.addEventListener('click', () => {
            const url = result.type === 'game' 
                ? `/game.html?game=${encodeURIComponent(result.name)}`
                : `/app.html?app=${encodeURIComponent(result.name)}`;
            window.location.href = url;
        });
    });
}

// Handle search input
function handleSearchInput(data) {
    const searchBar = document.getElementById('search-bar');
    searchBar.addEventListener('input', () => {
        const query = searchBar.value;
        const filteredResults = filterData(data, query);
        renderResults(filteredResults);
    });
}

// Initialize the search functionality
async function initSearch() {
    const data = await fetchData();
    handleSearchInput(data);
}

initSearch();
