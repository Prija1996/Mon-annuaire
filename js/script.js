// Sample data - in a real implementation, this would come from an API like Airtable
const sampleBusinesses = [
    {
        id: 1,
        name: "Tech Solutions Madagascar",
        category: "informatique",
        description: "Services informatiques et développement de logiciels.",
        contact: "contact@techsolutions.mg",
        address: "Antananarivo, Madagascar",
        lat: -18.8792,
        lng: 47.5079,
        rating: 4.5
    },
    {
        id: 2,
        name: "Commerce Plus",
        category: "commerce",
        description: "Vente de produits électroniques et accessoires.",
        contact: "info@commerceplus.mg",
        address: "Antananarivo, Madagascar",
        lat: -18.8792,
        lng: 47.5079,
        rating: 4.0
    },
    // Add more sample data as needed
];

let map;
let markers = [];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeMap();
    displayBusinesses(sampleBusinesses);
    setupEventListeners();
});

function initializeMap() {
    map = L.map('map').setView([-18.8792, 47.5079], 10); // Centered on Antananarivo

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
}

function displayBusinesses(businesses) {
    const resultsList = document.getElementById('results-list');
    resultsList.innerHTML = '';

    // Clear existing markers
    markers.forEach(marker => map.removeLayer(marker));
    markers = [];

    businesses.forEach(business => {
        // Create business card
        const card = document.createElement('div');
        card.className = 'business-card';
        card.innerHTML = `
            <h3>${business.name}</h3>
            <p><strong>Catégorie:</strong> ${business.category}</p>
            <p>${business.description}</p>
            <p><strong>Contact:</strong> ${business.contact}</p>
            <p><strong>Adresse:</strong> ${business.address}</p>
            <p class="rating">Note: ${business.rating}/5</p>
        `;
        resultsList.appendChild(card);

        // Add marker to map
        const marker = L.marker([business.lat, business.lng])
            .addTo(map)
            .bindPopup(`<b>${business.name}</b><br>${business.description}`);
        markers.push(marker);
    });
}

function setupEventListeners() {
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const categoryFilter = document.getElementById('category-filter');
    const regionFilter = document.getElementById('region-filter');
    const signupForm = document.getElementById('signup-form');

    searchBtn.addEventListener('click', filterBusinesses);
    searchInput.addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            filterBusinesses();
        }
    });

    categoryFilter.addEventListener('change', filterBusinesses);
    regionFilter.addEventListener('change', filterBusinesses);

    signupForm.addEventListener('submit', handleSignup);
}

function filterBusinesses() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const categoryFilter = document.getElementById('category-filter').value;
    const regionFilter = document.getElementById('region-filter').value;

    const filteredBusinesses = sampleBusinesses.filter(business => {
        const matchesSearch = business.name.toLowerCase().includes(searchTerm) ||
                              business.description.toLowerCase().includes(searchTerm);
        const matchesCategory = !categoryFilter || business.category === categoryFilter;
        const matchesRegion = !regionFilter || business.address.toLowerCase().includes(regionFilter);

        return matchesSearch && matchesCategory && matchesRegion;
    });

    displayBusinesses(filteredBusinesses);
}

function handleSignup(event) {
    event.preventDefault();

    const formData = {
        name: document.getElementById('company-name').value,
        category: document.getElementById('category').value,
        description: document.getElementById('description').value,
        contact: document.getElementById('contact').value,
        address: document.getElementById('address').value
    };

    // In a real implementation, this would send data to Google Forms or Airtable
    console.log('Signup data:', formData);

    // For now, just show an alert
    alert('Merci pour votre inscription ! Votre fiche sera validée sous peu.');

    // Reset form
    event.target.reset();
}
