// Script de diagnostic pour vérifier la configuration
console.log('=== DIAGNOSTIC MON ANNUAIRE ===');

// Vérifier la configuration
if (window.config) {
  console.log('✅ Config loaded:', {
    clientId: window.config.AIRTABLE_CLIENT_ID ? 'Present' : 'Missing',
    baseId: window.config.AIRTABLE_BASE_ID ? 'Present' : 'Missing',
    tableName: window.config.AIRTABLE_TABLE_NAME,
    redirectUri: window.config.getRedirectUri()
  });
} else {
  console.error('❌ Config not loaded');
}

// Vérifier les éléments DOM
const elements = ['auth-btn', 'logout-btn', 'search-input', 'map'];
elements.forEach(id => {
  const el = document.getElementById(id);
  console.log(`${id}: ${el ? '✅ Found' : '❌ Missing'}`);
});

// Vérifier Leaflet
if (typeof L !== 'undefined') {
  console.log('✅ Leaflet loaded');
} else {
  console.error('❌ Leaflet not loaded');
}

// Test de l'URL OAuth
console.log('🔗 Test URL OAuth:');
const testClientId = window.config?.AIRTABLE_CLIENT_ID || 'CLIENT_ID_MISSING';
const testRedirectUri = window.config?.getRedirectUri() || 'REDIRECT_URI_MISSING';
const testUrl = `https://airtable.com/oauth2/v1/authorize?client_id=${testClientId}&redirect_uri=${encodeURIComponent(testRedirectUri)}&response_type=code&scope=data.records:read%20data.records:write`;
console.log('URL complète:', testUrl);

// Instructions pour l'utilisateur
console.log('📋 Pour déboguer:');
console.log('1. Copiez l\'URL ci-dessus dans votre navigateur');
console.log('2. Si vous voyez une erreur "mismatched redirect_uri"');
console.log('3. Vérifiez que cette URI exacte est configurée dans Airtable:');
console.log('   ', testRedirectUri);

console.log('=== FIN DIAGNOSTIC ===');
