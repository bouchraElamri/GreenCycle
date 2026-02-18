# Admin Backend Issue - Progress

## Scope travaille
- Gestion admin des utilisateurs
- Gestion admin des commandes (liste, filtres, detail)
- Dashboard admin (stats globales)

## Fonctionnalites implementees

### 1) Admin - Liste des utilisateurs
- Route: `GET /api/admin/users`
- Protection: `authenticate` + `isAdmin`
- Donnees renvoyees:
  - Liste des users (sans champs sensibles: password/tokens)
  - Pagination (`page`, `limit`, `total`, `totalPages`)
  - Filtre recherche `q` (nom, prenom, email, phone)

Fichiers principaux:
- `src/repositories/user.repository.js`
- `src/controllers/auth.controller.js`
- `src/routes/admin.routes.js`

### 2) Admin - Liste des commandes
- Route: `GET /api/admin/orders`
- Tri: plus recente vers plus ancienne
- Donnees renvoyees:
  - `orderId`
  - `totalPrice`
  - `clientId`
  - `date`
  - `status`

Filtres statut:
- `GET /api/admin/orders/confirmed`
- `GET /api/admin/orders/delivered`

Fichiers principaux:
- `src/repositories/order.repository.js`
- `src/services/order.service.js`
- `src/controllers/order.controller.js`
- `src/routes/admin.routes.js`

### 3) Admin - Detail d'une commande
- Route: `GET /api/admin/orders/:id`
- Donnees detail renvoyees:
  - `orderId`
  - `clientId`
  - `clientUserId`
  - `totalPrice`
  - `status`
  - `date`
  - `items[]` avec:
    - `productId`
    - `sellerId`
    - `sellerUserId`
    - `name`
    - `price`
    - `photos`
    - `quantity`

### 4) Workflow moderation produit (deja present et verifie)
- Seller ajoute un produit -> `isApproved = false`
- Admin approuve via:
  - `PATCH /api/admin/products/approve/:id`
  - Body: `{ "isApproved": true }`
- Produit visible en public uniquement apres approbation

## Dashboard admin (version actuelle)
- Route: `GET /api/admin/dashboard`
- Champs retournes:
  - `usersRegistered`
  - `productsInSelling` (`isApproved: true`)
  - `productsOnHold` (`isApproved: false`)
  - `totalOrders`
  - `totalConfirmedOrders` (`status: confirmed`)
  - `totalDeliveredOrders` (`status: delivered`)

Fichiers principaux:
- `src/repositories/product.repository.js`
- `src/services/admin.service.js`
- `src/controllers/admin.controller.js`
- `src/routes/admin.routes.js`

## Tests Postman realises
- Login admin + token bearer
- Liste users admin
- Creation commande client
- Liste commandes admin + filtres statut
- Detail commande admin
- Approve produit admin
- Verification dashboard

## Limites connues (assumees dans ce scope)
- Pas de statut `rejected` explicite dans le dashboard actuel
- `isApproved=false` est considere comme "On Hold"

## Etat
- Base admin backend fonctionnelle pour le besoin immediate du projet
