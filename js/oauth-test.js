// Script de test OAuth pour diagnostiquer les problèmes
console.log('=== TEST OAUTH AIRTABLE ===');

// Configuration de test
const TEST_CONFIG = {
  clientId: '97b8fdcd-2b97-4554-9dc4-80f739432375',
  redirectUri: 'http://localhost:3000/callback.html',
  scopes: ['data.records:read', 'data.records:write']
};

// Fonction pour tester différentes URLs
function testOAuthUrls() {
  console.log('🔗 URLs de test à essayer :');

  // URL complète
  const fullUrl = `https://airtable.com/oauth2/v1/authorize?client_id=${TEST_CONFIG.clientId}&redirect_uri=${encodeURIComponent(TEST_CONFIG.redirectUri)}&response_type=code&scope=${TEST_CONFIG.scopes.join('%20')}`;
  console.log('1. URL complète :', fullUrl);

  // URL avec un seul scope
  const singleScopeUrl = `https://airtable.com/oauth2/v1/authorize?client_id=${TEST_CONFIG.clientId}&redirect_uri=${encodeURIComponent(TEST_CONFIG.redirectUri)}&response_type=code&scope=${TEST_CONFIG.scopes[0]}`;
  console.log('2. Scope unique :', singleScopeUrl);

  // URL sans encodage
  const noEncodeUrl = `https://airtable.com/oauth2/v1/authorize?client_id=${TEST_CONFIG.clientId}&redirect_uri=${TEST_CONFIG.redirectUri}&response_type=code&scope=${TEST_CONFIG.scopes[0]}`;
  console.log('3. Sans encodage :', noEncodeUrl);

  // URL minimale
  const minimalUrl = `https://airtable.com/oauth2/v1/authorize?client_id=${TEST_CONFIG.clientId}&redirect_uri=${TEST_CONFIG.redirectUri}&response_type=code`;
  console.log('4. URL minimale :', minimalUrl);
}

// Test de connectivité
function testConnectivity() {
  console.log('🌐 Test de connectivité :');

  // Test si on peut atteindre Airtable
  fetch('https://airtable.com/oauth2/v1/authorize?client_id=invalid', {
    method: 'HEAD'
  })
  .then(response => {
    console.log('✅ Airtable reachable, status:', response.status);
  })
  .catch(error => {
    console.log('❌ Airtable not reachable:', error.message);
  });
}

// Vérifications de configuration
function checkConfiguration() {
  console.log('⚙️ Vérifications de configuration :');

  console.log('- Client ID length:', TEST_CONFIG.clientId.length);
  console.log('- Redirect URI:', TEST_CONFIG.redirectUri);
  console.log('- Scopes:', TEST_CONFIG.scopes);

  // Vérifier si l'URL semble correcte
  if (TEST_CONFIG.clientId.length === 36) {
    console.log('✅ Client ID format seems correct');
  } else {
    console.log('❌ Client ID format might be wrong');
  }

  if (TEST_CONFIG.redirectUri.startsWith('http://') || TEST_CONFIG.redirectUri.startsWith('https://')) {
    console.log('✅ Redirect URI format seems correct');
  } else {
    console.log('❌ Redirect URI format might be wrong');
  }
}

// Instructions pour l'utilisateur
function showInstructions() {
  console.log('📋 Instructions de test :');
  console.log('1. Copiez UNE des URLs ci-dessus dans votre navigateur');
  console.log('2. Si vous voyez "mismatched redirect_uri" :');
  console.log('   → Vérifiez la configuration Airtable');
  console.log('3. Si vous voyez "invalid_client" :');
  console.log('   → Vérifiez le Client ID');
  console.log('4. Si vous voyez la page d\'autorisation :');
  console.log('   → ✅ Configuration correcte !');
}

// Exécuter tous les tests
testOAuthUrls();
checkConfiguration();
testConnectivity();
showInstructions();

console.log('=== FIN TEST OAUTH ===');
