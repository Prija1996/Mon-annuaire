// Configuration pour Mon Annuaire
window.config = {
  // Airtable OAuth - IDENTIFIANTS RÉELS
  AIRTABLE_CLIENT_ID: '97b8fdcd-2b97-4554-9dc4-80f739432375',
  AIRTABLE_BASE_ID: 'appqtAYbe7ZtJICJj', // À vérifier dans votre base Airtable
  AIRTABLE_TABLE_NAME: 'Fiches', // Nom de votre table Airtable

  // URLs
  getRedirectUri: function() {
    // URL dynamique basée sur l'environnement
    const baseUrl = window.location.origin;
    const redirectUri = `${baseUrl}/callback.html`;

    // Log pour débogage
    console.log('🔗 Redirect URI utilisée:', redirectUri);
    console.log('🌐 Origin actuel:', baseUrl);
    console.log('🏗️ Environnement détecté:', baseUrl.includes('localhost') ? 'Local' : 'Production');

    return redirectUri;
  },

  // API endpoints
  getApiBaseUrl: function() {
    // Pour Vercel, utilise l'URL actuelle
    // Pour local, utilise localhost
    return window.location.origin;
  }
};
