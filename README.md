# Mon Annuaire

Un annuaire numérique pour les entreprises et formations à Madagascar.

## Fonctionnalités

- Recherche et filtrage des entreprises
- Carte interactive avec OpenStreetMap
- Inscription gratuite pour les entreprises
- Design responsive

## Technologies utilisées

- HTML5
- CSS3 (avec variables CSS)
- JavaScript
- Leaflet.js pour la carte

## Installation et Configuration

### 1. Cloner le dépôt
```bash
git clone <repository-url>
cd mon-annuaire
```

### 2. Configuration Airtable
1. Créez une base Airtable avec une table "Fiches" contenant les champs :
   - Nom (Single Line Text)
   - Catégorie (Single Line Text)
   - Description (Long Text)
   - Contact (Single Line Text)
   - Adresse (Single Line Text)
   - Latitude (Number)
   - Longitude (Number)
   - Note (Number)

2. Créez une intégration OAuth dans Airtable :
   - Allez dans Account > Developer Hub > OAuth integrations
   - Créez une nouvelle intégration
   - Notez le Client ID

3. Configurez les variables dans `js/config.js` :
   ```javascript
   AIRTABLE_CLIENT_ID: 'votre-client-id',
   AIRTABLE_BASE_ID: 'votre-base-id',
   AIRTABLE_TABLE_NAME: 'Fiches'
   ```

4. Dans Vercel, ajoutez la variable d'environnement :
   - `AIRTABLE_CLIENT_SECRET`: Votre client secret Airtable

### 3. Développement local
```bash
npm install
npm run dev
```

### 4. Déploiement
Le projet est configuré pour Vercel. Poussez vos changements et Vercel déploiera automatiquement.

## Configuration OAuth

### URL de redirection
L'URL de redirection est maintenant dynamique et s'adapte à l'environnement :
- Production : `https://mon-annuaire.vercel.app/callback.html`
- Local : `http://localhost:3000/callback.html` (avec Vercel CLI)

### Variables d'environnement Vercel
- `AIRTABLE_CLIENT_SECRET`: Secret de l'intégration OAuth Airtable

## Structure du projet

```
mon-annuaire/
├── index.html          # Page principale
├── callback.html       # Page de callback OAuth
├── js/
│   ├── config.js       # Configuration centralisée
│   └── script.js       # Logique principale
├── css/
│   └── styles.css      # Styles
├── api/
│   └── oauth-token.js  # API serverless pour échange de tokens
├── assets/
│   └── favicon.ico     # Icône du site
└── package.json        # Dépendances et scripts
```
