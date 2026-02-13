1) Scope MVP (à valider)
POST /api/admin/categories -> créer catégorie
GET /api/categories -> lister catégories
GET /api/categories/:id -> détail catégorie
GET /api/categories?name=info -> rechercher des catégories par nom
PATCH /api/admin/categories/:id -> modifier catégorie
DELETE /api/admin/categories/:id -> supprimer catégorie
2) Règles métier MVP
name requis
name unique
description optionnel
id invalide -> erreur 400
catégorie inexistante -> erreur 404
nom déjà utilisé -> erreur 409
3) Contrat de payload
Create body:
{
  "name": "Informatique",
  "description": "Produits informatiques"
}
Update body (au moins un champ):
{
  "name": "Informatique & Tech",
  "description": "Nouveau libelle"
}
4) Codes HTTP attendus
POST -> 201
GET -> 200
PATCH -> 200
DELETE -> 200 (ou 204, mais on choisit 200 pour un message simple)
Erreurs validation -> 400
Doublon name -> 409
Not found -> 404
