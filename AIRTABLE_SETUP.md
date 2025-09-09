# 🔧 Configuration Airtable OAuth - Guide de dépannage

## ❌ **PROBLÈME PERSISTANT : URL ne fonctionne toujours pas**

L'URL testée ne fonctionne pas :
```
https://airtable.com/oauth2/v1/authorize?client_id=97b8fdcd-2b97-4554-9dc4-80f739432375&redirect_uri=http://localhost:3000/callback.html&response_type=code&scope=data.records:read%20data.records:write
```

### 🎯 **Diagnostic approfondi :**

#### **Étape 1 : Vérifiez l'état de votre application OAuth**
1. Allez sur [Airtable Developer Hub](https://airtable.com/developers/web/api/introduction)
2. Cherchez votre intégration OAuth
3. **Vérifiez si elle est en mode "DRAFT"** - si oui, publiez-la !

#### **Étape 2 : Configuration exacte requise**
Dans les paramètres de votre application OAuth :

**Nom de l'application :**
```
Mon Annuaire
```

**Redirect URIs :**
```
http://localhost:3000/callback.html
https://mon-annuaire.vercel.app/callback.html
```

**Scopes :**
- ✅ `data.records:read`
- ✅ `data.records:write`

#### **Étape 3 : Test de validation**
Après avoir configuré, testez cette URL simple :
```
https://airtable.com/oauth2/v1/authorize?client_id=97b8fdcd-2b97-4554-9dc4-80f739432375&redirect_uri=http://localhost:3000/callback.html&response_type=code&scope=data.records:read
```

### 🔍 **Causes possibles de l'échec :**

#### **1. Application en mode DRAFT**
- **Symptôme** : Erreur "invalid_client" ou "mismatched redirect_uri"
- **Solution** : Publiez l'application dans Airtable

#### **2. Client ID incorrect**
- **Vérifiez** : `97b8fdcd-2b97-4554-9dc4-80f739432375`
- **Solution** : Copiez-collez depuis Airtable (pas de frappe)

#### **3. Redirect URI avec faute de frappe**
- **Doit être exactement** : `http://localhost:3000/callback.html`
- **Pas de slash final, pas d'espace, pas de HTTPS**

#### **4. Scopes manquants**
- **Requis** : `data.records:read data.records:write`
- **Solution** : Activez les deux scopes

### � **Action immédiate requise :**

1. **Vérifiez si votre app OAuth est publiée** (pas en DRAFT)
2. **Recopiez exactement le Client ID** depuis Airtable
3. **Vérifiez chaque caractère de la Redirect URI**
4. **Testez avec UN SEUL scope d'abord** : `data.records:read`

### 📞 **Si le problème persiste :**

**Partagez-moi :**
1. Une capture d'écran de votre configuration Airtable OAuth
2. L'erreur exacte que vous voyez
3. Confirmez si votre app est publiée ou en DRAFT

---

## 🆘 **DERNIER RECOURS : Créer une nouvelle app OAuth**

Si rien ne fonctionne :

1. **Supprimez l'ancienne intégration OAuth**
2. **Créez-en une nouvelle** avec :
   - Nom : `Mon Annuaire`
   - Redirect URI : `http://localhost:3000/callback.html`
   - Scopes : `data.records:read`, `data.records:write`
3. **Publiez immédiatement l'application**
4. **Utilisez le nouveau Client ID**

**Paramètres retirés :**
- ❌ `code_challenge` - Plus utilisé
- ❌ `code_challenge_method` - Plus utilisé
- ❌ `code_verifier` - Plus utilisé

### 1. **Vérifiez votre configuration Airtable OAuth**

Allez dans [Airtable Developer Hub](https://airtable.com/developers/web/api/introduction) → OAuth integrations

**Paramètres actuels :**
- **Client ID** : `97b8fdcd-2b97-4554-9dc4-80f739432375`
- **Client Secret** : `662a79e7e7b518be5773d044199e07c306dfe8eb4e92e34ebc58fdc8eb4bdf10`

### 2. **Configuration des Redirect URIs**

Dans votre intégration OAuth Airtable, ajoutez ces URIs :

**Pour le développement local :**
```
http://localhost:3000/callback.html
```

**Pour la production Vercel :**
```
https://mon-annuaire.vercel.app/callback.html
```

### 3. **Vérification des scopes**

Assurez-vous que ces scopes sont activés :
- ✅ `data.records:read`
- ✅ `data.records:write`

### 4. **Test de l'URL de redirection**

1. Ouvrez `http://localhost:3000` dans votre navigateur
2. Ouvrez la console (F12) → onglet Console
3. Cliquez sur "Se connecter avec Airtable"
4. Vérifiez les logs qui affichent :
   - 🔗 Redirect URI utilisée
   - 🔗 URL d'autorisation complète

### 5. **Configuration Vercel (pour le déploiement)**

Dans votre projet Vercel → Settings → Environment Variables :
```
AIRTABLE_CLIENT_SECRET = 662a79e7e7b518be5773d044199e07c306dfe8eb4e92e34ebc58fdc8eb4bdf10
```

### 6. **Débogage supplémentaire**

Si l'erreur persiste :

1. **Vérifiez que l'URL dans la console correspond exactement** à celle configurée dans Airtable
2. **Assurez-vous que le Client ID est correct** (pas d'espace ou caractère spécial)
3. **Testez avec une URL de redirection simple** d'abord

### 7. **URLs de test**

**Développement local :**
- Site : `http://localhost:3000`
- Callback : `http://localhost:3000/callback.html`

**Production :**
- Site : `https://mon-annuaire.vercel.app`
- Callback : `https://mon-annuaire.vercel.app/callback.html`

---

## 🚀 Commandes de test

```bash
# Lancer le serveur local
node server.js

# Tester l'API
curl http://localhost:3000/api/oauth-token
```

## 📞 Support

Si l'erreur persiste après ces vérifications, partagez :
1. Les logs de la console du navigateur
2. L'URL exacte générée
3. Une capture d'écran de votre configuration Airtable OAuth
