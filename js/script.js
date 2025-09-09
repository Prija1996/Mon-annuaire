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

// Configuration is loaded globally from config.js

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeMap();
    setupEventListeners();
    updateAuthUI(); // Ceci va charger les bonnes données selon l'état d'auth
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
        email: document.getElementById('email').value,
        address: document.getElementById('address').value,
        region: document.getElementById('region').value,
        website: document.getElementById('website').value || null,
        socialMedia: document.getElementById('social-media').value || null
    };

    console.log('📝 [FORM] Données collectées du formulaire:');
    console.log('📝 [FORM] Nom:', formData.name);
    console.log('📝 [FORM] Catégorie brute:', formData.category);
    console.log('📝 [FORM] Catégorie type:', typeof formData.category);
    console.log('📝 [FORM] Catégorie length:', formData.category?.length);
    console.log('📝 [FORM] Toutes les données:', JSON.stringify(formData, null, 2));

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
        const CLIENT_ID = window.config.AIRTABLE_CLIENT_ID;
        const REDIRECT_URI = window.config.getRedirectUri();

        // Fonction pour initier l'authentification
        async function initiateAuth() {
            console.log('======= DEBUT initiateAuth =======');
            console.log('Timestamp:', new Date().toISOString());
            console.log('Client ID disponible:', !!CLIENT_ID);
            console.log('Redirect URI disponible:', !!REDIRECT_URI);

            if (!CLIENT_ID || !REDIRECT_URI) {
                console.error('ERREUR: Client ID ou Redirect URI manquant');
                console.log('Client ID:', CLIENT_ID);
                console.log('Redirect URI:', REDIRECT_URI);
                return;
            }

            console.log('Demarrage authentification OAuth');
            console.log('Client ID:', CLIENT_ID);
            console.log('Redirect URI:', REDIRECT_URI);

            // Generer un state aleatoire pour la securite
            const state = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
            console.log('State genere:', `"${state}"`);
            localStorage.setItem('oauth_state', state);
            console.log('State stocke dans localStorage');

            // Générer les paramètres PKCE pour Airtable
            console.log('Génération des paramètres PKCE...');
            const codeVerifier = generateCodeVerifier();
            const codeChallenge = await generateCodeChallenge(codeVerifier);
            localStorage.setItem('oauth_code_verifier', codeVerifier);
            console.log('Code verifier généré et stocké');
            console.log('Code challenge généré:', codeChallenge);

            // Construction étape par étape de l'URL
            console.log('Construction de l\'URL étape par étape:');
            const baseUrl = 'https://airtable.com/oauth2/v1/authorize';
            const params = new URLSearchParams();

            params.append('client_id', CLIENT_ID);
            params.append('redirect_uri', REDIRECT_URI); // Pas d'encodage ici, URLSearchParams le fait
            params.append('response_type', 'code');
            params.append('state', state);
            params.append('scope', 'data.records:read data.records:write');
            params.append('code_challenge', codeChallenge);
            params.append('code_challenge_method', 'S256');

            const authUrl = `${baseUrl}?${params.toString()}`;

            console.log('� Paramètres individuels:');
            for (let [key, value] of params) {
                console.log(`  ${key}: "${value}"`);
            }
            console.log('URL finale:', authUrl);

            // Vérification avec URL constructor
            try {
                const url = new URL(authUrl);
                console.log('Vérification URL:');
                console.log('  Host:', url.host);
                console.log('  Path:', url.pathname);
                console.log('  Paramètres vérifiés:');
                for (let [key, value] of url.searchParams) {
                    console.log(`    ${key}: "${value}"`);
                }
            } catch (error) {
                console.error('Erreur URL:', error);
            }

            window.location.href = authUrl;
        }

        // Fonctions PKCE pour Airtable OAuth
        // Fonction pour générer un code_verifier PKCE
        function generateCodeVerifier() {
            const array = new Uint8Array(32);
            crypto.getRandomValues(array);
            return base64URLEncode(array);
        }

        // Fonction pour générer un code_challenge PKCE
        async function generateCodeChallenge(codeVerifier) {
            const encoder = new TextEncoder();
            const data = encoder.encode(codeVerifier);
            const digest = await crypto.subtle.digest('SHA-256', data);
            return base64URLEncode(new Uint8Array(digest));
        }

        // Fonction pour encoder en base64url
        function base64URLEncode(array) {
            const base64 = btoa(String.fromCharCode.apply(null, array));
            return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
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
        // Utilisation de la configuration
        const baseId = window.config.AIRTABLE_BASE_ID;
        const tableName = window.config.AIRTABLE_TABLE_NAME;

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
            name: record.fields["Nom de l'entité"] || '',
            category: record.fields["Catégorie"] || '',
            description: record.fields["Description"] || '',
            contact: record.fields["Contact"] || '',
            email: record.fields["Email"] || '',
            address: record.fields["Adresse"] || '',
            region: record.fields["Région"] || '',
            website: record.fields["Lien du site web"] || '',
            socialMedia: record.fields["Réseaux Sociaux"] || '',
            status: record.fields["Statut"] || '',
            lat: record.fields.Latitude || -18.8792,
            lng: record.fields.Longitude || 47.5079,
            rating: record.fields["Avis"] || 0
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
        const baseId = window.config.AIRTABLE_BASE_ID;
        const tableName = window.config.AIRTABLE_TABLE_NAME;

        console.log('📤 Envoi des données à Airtable...');
        console.log('Base ID:', baseId);
        console.log('Table:', tableName);
        console.log('🔍 [SUBMIT] Données reçues:', formData);
        console.log('🔍 [SUBMIT] Catégorie avant traitement:', formData.category);

        const airtableFields = {
            "Nom de l'entité": formData.name,
            "Catégorie": formData.category,
            "Description": formData.description,
            "Contact": formData.contact,
            "Email": formData.email,
            "Adresse": formData.address,
            "Région": formData.region,
            "Statut": "En attente de validation" // Valeur par défaut pour modération
        };

        console.log('🔍 [SUBMIT] Valeur exacte pour Catégorie:', airtableFields["Catégorie"]);
        console.log('🔍 [SUBMIT] Type de la catégorie:', typeof airtableFields["Catégorie"]);
        console.log('🔍 [SUBMIT] Caractères de la catégorie:', Array.from(airtableFields["Catégorie"] || '').map(c => `${c} (${c.charCodeAt(0)})`));

        // Ajouter les champs optionnels seulement s'ils ont une valeur
        if (formData.website) {
            airtableFields["Lien du site web"] = formData.website;
        }
        if (formData.socialMedia) {
            airtableFields["Réseaux Sociaux"] = formData.socialMedia;
        }

        console.log('🔍 Champs Airtable à envoyer:', airtableFields);

        const requestBody = {
            fields: airtableFields
        };

        console.log('🚀 [REQUEST] Corps de la requête complet:', JSON.stringify(requestBody, null, 2));
        console.log('🚀 [REQUEST] JSON string brut:', JSON.stringify(requestBody));

        const response = await fetch(`https://api.airtable.com/v0/${baseId}/${tableName}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        const responseData = await response.json();
        console.log('📡 Réponse Airtable:', response.status, responseData);

        if (!response.ok) {
            console.error('❌ Erreur Airtable:', responseData);
            console.error('❌ Détails de l\'erreur:', JSON.stringify(responseData, null, 2));
            
            // Extraire le message d'erreur spécifique
            let errorMessage = 'Unknown error';
            if (responseData.error) {
                if (responseData.error.message) {
                    errorMessage = responseData.error.message;
                } else if (responseData.error.type) {
                    errorMessage = responseData.error.type;
                } else {
                    errorMessage = JSON.stringify(responseData.error);
                }
            }
            
            throw new Error(`Airtable error: ${errorMessage}`);
        }

        alert('✅ Entreprise soumise avec succès ! Elle sera visible après validation.');
        console.log('✅ Succès:', responseData);
        
        // Recharger les données pour afficher la nouvelle entrée
        loadBusinessesFromAirtable();
        
        return responseData;
    } catch (error) {
        console.error('💥 Erreur lors de la soumission:', error);
        alert(`❌ Erreur lors de la soumission: ${error.message}`);
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
