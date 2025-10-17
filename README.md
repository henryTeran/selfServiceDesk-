# 🍕 Self Service Desk

> Application de borne de commande tactile pour restaurants - Angular 19 + Ionic 8 + Supabase

Une application moderne et professionnelle pour gérer les commandes dans un restaurant via une borne tactile interactive. Conçue pour offrir une expérience utilisateur fluide et une gestion administrative complète.

---

## ✨ Fonctionnalités principales

### 🛒 Interface client (Borne tactile)
- **Navigation intuitive** par catégories de produits
- **Modale de sélection quantité** avec photo, prix et boutons +/−
- **Panier intelligent** avec fusion automatique des doublons
- **Gestion des quantités** directement depuis le panier
- **Calcul du total** en temps réel
- **Choix du mode** : sur place ou à emporter
- **Formatage des prix** en CHF (format suisse)

### 👨‍💼 Interface administrateur
- **Vue en temps réel** des commandes (Supabase Realtime)
- **Liste scrollable** avec filtrage par statut
- **Validation article par article** avec cases à cocher
- **Workflow de statuts** : En attente → Validée → Livrée
- **Notifications sonores** pour nouvelles commandes
- **Statuts colorés** pour identification rapide
- **Historique complet** des commandes

### 🎨 Design moderne
- Interface tactile optimisée pour bornes
- Design responsive (mobile, tablette, écran tactile)
- Animations fluides et micro-interactions
- Palette cohérente orange (#ff6600)
- Empty states et loading states
- PWA avec support offline

---

## 🛠️ Technologies

- **Framework** : Angular 19 (standalone components)
- **UI/UX** : Ionic 8
- **Base de données** : Supabase (PostgreSQL + Realtime)
- **State Management** : Angular Signals
- **Styling** : CSS custom + Ionic Components
- **Build** : Angular CLI + Vite
- **PWA** : Service Workers Angular

---

## 📦 Installation

### Prérequis
- Node.js 18+
- npm 9+

### Étapes

1. **Cloner le projet**
```bash
git clone <url-du-repo>
cd self-service-desk
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configuration Supabase**
Créer un fichier `.env` à la racine :
```env
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre-clé-anonyme
```

4. **Lancer le serveur de développement**
```bash
npm start
```

L'application sera accessible sur `http://localhost:4200/`

---

## 🚀 Scripts disponibles

| Commande | Description |
|----------|-------------|
| `npm start` | Génère les variables d'environnement et lance le serveur dev |
| `npm run build` | Compile le projet pour la production |
| `npm test` | Lance les tests unitaires |
| `npm run watch` | Build en mode watch |

---

## 📁 Structure du projet

```
src/
├── app/
│   ├── components/          # Composants réutilisables
│   │   ├── cart/           # Panier avec gestion quantités
│   │   ├── header/         # En-tête avec compteur panier
│   │   ├── footer/         # Pied de page
│   │   ├── sidebar/        # Menu latéral catégories
│   │   ├── recipe/         # Card produit
│   │   ├── notification/   # Toast notifications
│   │   └── product-quantity-modal/  # Modale sélection quantité
│   │
│   ├── pages/              # Pages principales
│   │   ├── home-page/      # Accueil
│   │   ├── choise-order-page/     # Choix sur place/emporter
│   │   ├── order-page/     # Menu et commande
│   │   ├── validation-page/        # Confirmation commande
│   │   └── admin-orders-page/     # Gestion admin
│   │
│   ├── services/           # Services métier
│   │   ├── cart-store.service.ts          # Gestion panier (Signals)
│   │   ├── supabase-api.service.ts        # API Supabase
│   │   ├── notification.service.ts        # Notifications toast
│   │   ├── choise.service.ts              # Type de commande
│   │   └── idle.service.ts                # Détection inactivité
│   │
│   ├── pipes/              # Pipes custom
│   │   └── price.pipe.ts   # Formatage prix CHF
│   │
│   └── interfaces.ts       # Types TypeScript
│
├── assets/                 # Images et données statiques
├── environments/           # Variables d'environnement
└── styles.css             # Styles globaux
```

---

## 🗄️ Base de données Supabase

### Table `orders`

```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL,
  items JSONB NOT NULL,
  total_price NUMERIC NOT NULL,
  order_type TEXT NOT NULL,
  payment_method TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ
);

-- Index pour performances
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created ON orders(created_at DESC);

-- RLS activé avec policies restrictives
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
```

### Statuts disponibles
- `pending` : Commande en attente de préparation
- `validated` : Commande validée par le staff
- `delivered` : Commande livrée au client
- `cancelled` : Commande annulée

---

## 🎯 Workflow utilisateur

### Client (Borne tactile)
1. **Accueil** → Choix "Sur place" ou "À emporter"
2. **Menu** → Sélection des produits
3. **Modale quantité** → Ajustement avec +/− (1-99)
4. **Panier** → Révision et modification
5. **Validation** → Confirmation et envoi

### Administrateur
1. **Dashboard** → Liste temps réel des commandes
2. **Filtrage** → Par statut (toutes, en attente, validées, etc.)
3. **Détails** → Clic pour voir les articles
4. **Validation** → Cocher chaque article préparé
5. **Statut** → Passer de "En attente" → "Validée" → "Livrée"

---

## 🔧 Configuration avancée

### Inactivité (Idle Service)
Par défaut, le panier se réinitialise après 2 minutes d'inactivité.
Configurable dans `src/app/services/idle.service.ts`

### Notifications
Sons et toasts configurables dans :
- `src/app/services/notifications/notification.service.ts`
- `src/app/pages/admin-orders-page/` (son nouvelle commande)

### Menu produits
Données statiques : `src/assets/data/resto-data.json`
Modifiable pour intégration API externe

---

## 🎨 Personnalisation

### Couleurs
Variables principales dans `src/styles.css` :
```css
--primary-color: #ff6600;
--primary-dark: #e65c00;
--success-color: #4caf50;
--warning-color: #ffc107;
--error-color: #f44336;
```

### Logo et images
Remplacer les fichiers dans `src/assets/`

---

## 📱 PWA et Offline

L'application fonctionne en mode hors ligne grâce aux Service Workers :
- Cache des assets statiques
- Cache des données menu
- Synchronisation différée des commandes

Configuration : `ngsw-config.json`

---

## 🐛 Débogage

### Problèmes courants

**Le panier ne persiste pas**
→ Vérifier localStorage dans DevTools

**Erreur Supabase connection**
→ Vérifier les variables `.env` et la configuration RLS

**Modale quantité ne s'ouvre pas**
→ Vérifier l'import de `ModalController` dans OrderPage

**Build échoue**
→ Supprimer `node_modules` et `.angular/cache`, puis `npm install`

---

## 🚀 Déploiement

### Build de production
```bash
npm run build
```
Les fichiers compilés seront dans `dist/self-service-desk/`

### Hébergement recommandé
- **Frontend** : Vercel, Netlify, Firebase Hosting
- **Backend** : Supabase (déjà configuré)

### Variables d'environnement production
Ne pas oublier de configurer :
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

---

## 📄 Licence

Ce projet est sous licence MIT.

---

## 👨‍💻 Auteur

Développé avec ❤️ pour optimiser l'expérience de commande en restaurant.

---

## 🙏 Remerciements

- Angular Team
- Ionic Framework
- Supabase
- Communauté open source

---

## 📞 Support

Pour toute question ou problème :
- 📧 Email : support@example.com
- 🐛 Issues : GitHub Issues
- 💬 Discord : [Lien serveur]

---

**Version actuelle : 2.0.0** - Dernière mise à jour : 2025
