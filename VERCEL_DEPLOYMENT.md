# Mon Annuaire - Déploiement Vercel

## ✅ DÉPLOIEMENT RÉUSSI !

Votre projet est déployé sur : **https://mon-annuaire.vercel.app**

## Configuration OAuth pour Vercel

### 1. URL de production
- ✅ **Site principal** : https://mon-annuaire.vercel.app
- ✅ **Page de callback** : https://mon-annuaire.vercel.app/callback.html

### 2. Mettre à jour Airtable OAuth
Dans votre intégration OAuth Airtable, la Redirect URI doit être :
```
https://mon-annuaire.vercel.app/callback.html
```

### 3. Test de l'OAuth
1. Allez sur https://mon-annuaire.vercel.app
2. Cliquez sur "Se connecter avec Airtable"
3. Autorisez l'accès
4. Vous devriez être redirigé vers la page de callback qui traite l'authentification

## Debugging
Si vous avez encore des erreurs :
1. Ouvrez la console (F12)
2. Regardez les logs détaillés ajoutés
3. Vérifiez que la Redirect URI dans Airtable correspond exactement

## Prochaines étapes
- Tester l'OAuth complètement
- Ajouter des données dans votre base Airtable "Fiches"
- Personnaliser le design si nécessaire
