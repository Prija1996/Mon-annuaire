# Mon Annuaire - Déploiement Vercel

## 🚀 Guide de déploiement

### 1. Variables d'environnement à configurer sur Vercel

Dans les settings de votre projet Vercel, ajoutez cette variable :

```
AIRTABLE_CLIENT_SECRET = 30f50f4d36fbff5a48d07ad7087df246d6f486c63e9977e37d9021bc020dfd27
```

### 2. Configuration Airtable OAuth

Une fois déployé sur Vercel, vous devrez mettre à jour la configuration OAuth dans Airtable :

**Redirect URIs à ajouter :**
- `https://VOTRE-DOMAINE-VERCEL.vercel.app/callback.html`

**Exemple si votre domaine est `mon-annuaire-madagascar.vercel.app` :**
- `https://mon-annuaire-madagascar.vercel.app/callback.html`

### 3. Configuration actuelle

- **Client ID** : `97b8fdcd-2b97-4554-9dc4-80f739432375`
- **Base Airtable** : `appqtAYbe7ZtJICJj`
- **Table** : `Fiches`

### 4. Fonctionnalités déployées

✅ Authentification OAuth avec Airtable  
✅ Formulaire d'ajout d'entreprises  
✅ Affichage des données avec carte Leaflet  
✅ Modération avec statut "En attente de validation"  
✅ Interface responsive  

### 5. Post-déploiement

Après le déploiement :
1. Testez l'authentification OAuth
2. Vérifiez que le formulaire fonctionne
3. Ajustez les noms de champs si nécessaire
4. Testez l'affichage des données

## 🔧 Structure du projet

```
/
├── index.html              # Page principale
├── callback.html           # Page de callback OAuth
├── css/styles.css          # Styles
├── js/
│   ├── script.js          # Logique principale
│   └── config.js          # Configuration
├── api/
│   └── oauth-token.js     # API OAuth pour Vercel
└── vercel.json            # Configuration Vercel
```
