# Cas d'échec observés — Agent Wander

## 1. Refus de sécurité en anglais au lieu du message personnalisé

- **Entrée** : "Question sexuelle ou interdite ou criminelle"
- **Sortie** : "I'm sorry, but I can't help with that."
- **Problème** : le refus de sécurité du modèle prend le dessus sur l'instruction du system prompt (répondre en français avec un message dédié). Contenu bien bloqué, mais incohérent avec le reste de l'UX.
- **Mitigation** : pas de fix léger fiable actuellement (génération non déterministe). À traiter en bloc 7.3 (hardening prod) si besoin, pas prioritaire.

## 2. Réponse hors-sujet au lieu du refus de périmètre

- **Entrée** : "où sont les catalogues municipaux"
- **Sortie** : réponse détaillée et utile sur comment trouver un catalogue municipal
- **Problème** : l'instruction "reste dans le cadre de la recherche d'événements" n'est pas suivie car la question a l'air légitime. Rien ne bloque une dérive hors-sujet.
- **Mitigation** : ajouter une branche "hors-sujet" au routeur prévu au bloc 4 (filtres vs sémantique), qui coupe avant l'appel au modèle principal.
