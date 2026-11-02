# Project memory

## Product intent & audience

- NaturalHairMarket est une marketplace de cheveux naturels mettant en relation acheteurs et vendeurs particuliers ou salons professionnels.
- Le système couvre les paiements marketplace, les transferts aux vendeurs, les commissions et la génération de documents de transaction.
- L’audit demandé porte sur le fonctionnement existant, sa conformité comptable et juridique française, sans modification de code.

## Brand personality & voice

- L’interface et les documents utilisent la marque « NaturalHairMarket » et le positionnement de marketplace de cheveux naturels.
- Les communications d’audit doivent rester factuelles, précises et distinguer clairement les fonctionnalités constatées, les lacunes et les recommandations.
- Les sujets juridiques et fiscaux doivent être formulés avec prudence lorsqu’ils dépendent du statut réel de la marketplace, du vendeur ou de l’évolution réglementaire.

## Visual design & UX direction

- Les factures actuelles sont des documents imprimables/PDF présentant l’acheteur et le vendeur côte à côte, ainsi que le détail du prix, de la livraison et de la commission.
- La facture affiche actuellement principalement les noms et emails, avec la marque NaturalHairMarket en en-tête/pied de page.
- Les futures vues de facturation devraient rendre visibles le type de document (vente, commission, avoir), le statut (particulier/professionnel), les informations légales, la référence de transaction et le lien avec le paiement.
- Prévoir des états explicites pour paiement en attente, paiement capturé, transfert échoué, remboursement et avoir.
- Les documents destinés à un usage comptable doivent privilégier lisibilité, traçabilité, informations structurées et cohérence entre aperçu, téléchargement et archivage.

## Decisions, constraints & rationale

- Le système actuel génère une facture à la volée à partir de la transaction ; le numéro suit le format `FAC-AAAAMM-XXXXXXXX`, basé sur les huit premiers caractères de l’ID de transaction.
- Aucun registre persistant de factures ni séquence dédiée n’a été identifié ; la conformité de la numérotation française et l’auditabilité sont donc insuffisants.
- L’en-tête désigne NaturalHairMarket comme émetteur, tandis que le vendeur est seulement affiché comme partie informative. Les factures ne sont pas actuellement émises au nom légal du vendeur réel.
- Les profils Supabase contiennent davantage de données (`full_name`, identité, email, téléphone, adresse, pays, SIRET, statut de salon), mais les documents n’exploitent actuellement que le nom et l’email.
- Aucun parcours distinct n’a été identifié entre vente particulier-particulier, professionnel-particulier ou professionnel-professionnel ; le statut `is_certified_salon` n’entraîne pas de modèle de facturation différent.
- La commission de 10 % est prélevée techniquement via Stripe Connect (`application_fee_amount`) et le montant vendeur est transféré via `transfer_data.destination`, mais aucune facture de commission séparée n’est générée pour le vendeur.
- Les webhooks suivent notamment les transferts créés ou échoués ; la création/capture/annulation des paiements est couverte. Le suivi des remboursements reste incomplet et ne produit pas d’avoir.
- Les frais Stripe réellement payés ne sont pas récupérés dans le suivi comptable, et aucune réconciliation automatisée complète entre Stripe, transaction, commission et transfert n’a été identifiée.
- L’archivage légal persistant, l’inaltérabilité, la piste d’audit fiable, les formats structurés de facturation électronique et l’e-reporting ne sont pas implémentés selon l’audit fourni.
- Priorités fonctionnelles déduites : registre et numérotation persistante, factures de commission, coordonnées légales complètes, distinction des statuts, TVA, avoirs, archivage, puis intégration de facturation électronique/e-reporting et réconciliation Stripe.
- Toute évolution doit préserver la séparation entre facture de vente du vendeur professionnel, facture de commission de la marketplace et documents liés aux ventes entre particuliers.

## Open questions & assumptions

- Le rôle juridique exact de NaturalHairMarket (mandataire, intermédiaire, revendeur ou autre) n’est pas établi ; il conditionne l’émetteur légal des factures et les obligations de TVA.
- Il faut confirmer l’identité légale de NaturalHairMarket : raison sociale, adresse, SIREN/SIRET, TVA intracommunautaire et régime de TVA.
- Il faut déterminer quels vendeurs sont réellement professionnels, quelles preuves sont collectées et si `is_certified_salon` constitue un statut fiscal suffisamment fiable.
- Les règles précises de commission, de livraison, de remboursement partiel et d’annulation doivent être documentées pour définir les bases comptables et les avoirs.
- La conservation, le stockage immuable et l’accès aux factures existantes restent à préciser, notamment pour les transactions déjà réalisées.
- Le calendrier et le périmètre applicables de la réforme française de facturation électronique/e-reporting doivent être validés avec un expert-comptable ou conseil fiscal avant implémentation.
- Les conclusions de conformité constituent un constat technique initial et doivent être confirmées juridiquement selon les contrats marketplace, les statuts des vendeurs et le régime fiscal applicable.