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
    updateAuthUI(); // Ajouter cette ligne pour vérifier l'auth au chargement
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

    // Gestion de l'authentification
    const authBtn = document.getElementById('auth-btn');
    const logoutBtn = document.getElementById('logout-btn');

    authBtn.addEventListener('click', initiateAuth);
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('airtable_access_token');
        localStorage.removeItem('airtable_refresh_token');
        location.reload();
    });

    // Vérifier l'état d'authentification au chargement
    updateAuthUI();
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

    if (isAuthenticated()) {
        // Soumettre à Airtable
        submitBusiness(formData);
    } else {
        // Fallback : afficher un message
        alert('Connectez-vous avec Airtable pour soumettre votre entreprise.');
    }

    // Reset form
    event.target.reset();
}

        // Configuration OAuth 2.0
        const CLIENT_ID = '97b8fdcd-2b97-4554-9dc4-80f739432375'; // Remplacez par votre Client ID Airtable
        const REDIRECT_URI = 'https://mon-annuaire.vercel.app/callback.html';

        // Fonction pour initier l'authentification
        function initiateAuth() {
            const authUrl = `https://airtable.com/oauth2/v1/authorize?` +
                `client_id=${CLIENT_ID}&` +
                `redirect_uri=${encodeURIComponent(REDIRECT_URI)}&` +
                `response_type=code&` +
                `scope=data.records:read data.records:write`; // Ajustez les scopes selon vos besoins

            window.location.href = authUrl;
        }

// Fonction pour vérifier si l'utilisateur est connecté
function isAuthenticated() {
    return localStorage.getItem('airtable_access_token') !== null;
}

// Fonction pour récupérer les données depuis Airtable
async function fetchAirtableData() {
    const token = localStorage.getItem('airtable_access_token');
    if (!token) {
        console.error('Pas de token d\'accès disponible');
        return [];
    }

    try {
        // Remplacez par votre vraie base ID et table name
        const baseId = 'appqtAYbe7ZtJICJj';
        const tableName = 'Fiches';

        const response = await fetch(`https://api.airtable.com/v0/${baseId}/${tableName}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des données');
        }

        const data = await response.json();
        return data.records.map(record => ({
            id: record.id,
            name: record.fields.Nom || '',
            category: record.fields.Catégorie || '',
            description: record.fields.Description || '',
            contact: record.fields.Contact || '',
            address: record.fields.Adresse || '',
            lat: record.fields.Latitude || -18.8792,
            lng: record.fields.Longitude || 47.5079,
            rating: record.fields.Note || 0
        }));
    } catch (error) {
        console.error('Erreur lors de la récupération des données Airtable:', error);
        return [];
    }
}

// Fonction pour soumettre une nouvelle entreprise
async function submitBusiness(formData) {
    const token = localStorage.getItem('airtable_access_token');
    if (!token) {
        alert('Vous devez être connecté pour soumettre une entreprise');
        return;
    }

    try {
        const baseId = 'appqtAYbe7ZtJICJj';
        const tableName = 'Fiches';

        const response = await fetch(`https://api.airtable.com/v0/${baseId}/${tableName}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                fields: {
                    Nom: formData.name,
                    Catégorie: formData.category,
                    Description: formData.description,
                    Contact: formData.contact,
                    Adresse: formData.address,
                    // Ajoutez d'autres champs si nécessaire
                }
            })
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la soumission');
        }

        alert('Entreprise soumise avec succès !');
        return await response.json();
    } catch (error) {
        console.error('Erreur lors de la soumission:', error);
        alert('Erreur lors de la soumission. Veuillez réessayer.');
    }
}

function updateAuthUI() {
    const authBtn = document.getElementById('auth-btn');
    const logoutBtn = document.getElementById('logout-btn');

    if (isAuthenticated()) {
        authBtn.style.display = 'none';
        logoutBtn.style.display = 'inline-block';
        // Charger les données depuis Airtable
        loadBusinessesFromAirtable();
    } else {
        authBtn.style.display = 'inline-block';
        logoutBtn.style.display = 'none';
        // Afficher les données d'exemple
        displayBusinesses(sampleBusinesses);
    }
}

async function loadBusinessesFromAirtable() {
    const businesses = await fetchAirtableData();
    if (businesses.length > 0) {
        displayBusinesses(businesses);
    } else {
        // Fallback aux données d'exemple si pas de données Airtable
        displayBusinesses(sampleBusinesses);
    }
}
