// Configuration pour Mon Annuaire
window.config = {
  // Airtable OAuth
  AIRTABLE_CLIENT_ID: '97b8fdcd-2b97-4554-9dc4-80f739432375', // À remplacer par votre vrai Client ID
  AIRTABLE_BASE_ID: 'appqtAYbe7ZtJICJj', // À remplacer par votre vraie Base ID
  AIRTABLE_TABLE_NAME: 'Fiches', // Nom de votre table Airtable

  // URLs
  getRedirectUri: function() {
    // URL dynamique basée sur l'environnement
    const baseUrl = window.location.origin;
    return `${baseUrl}/callback.html`;
  },

  // API endpoints
  getApiBaseUrl: function() {
    // Pour Vercel, utilise l'URL actuelle
    // Pour local, utilise localhost
    return window.location.origin;
  }
};
