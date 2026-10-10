# Thêta — v2.1

Web-app personnelle, 100 % locale, hors ligne, installable sur Android.

## Fichiers à mettre dans le dépôt GitHub

| Fichier | Rôle |
|---|---|
| `index.html` | Toute l'application |
| `manifest.json` | Nom, icônes, raccourcis (installation sur l'écran d'accueil) |
| `sw.js` | Fonctionnement hors ligne |
| `icon-192.png`, `icon-512.png` | Icônes (exigées par Android pour l'installation) |

Les cinq fichiers vont à la racine du dépôt `mon-organisateur` (le nom du dépôt peut rester tel quel ; pour une adresse en `/theta/`, renommer le dépôt en `theta`), GitHub Pages activé sur la branche `main`.
Adresse : `https://xaviergougaud1-netizen.github.io/mon-organisateur/`

**Mise à jour future** : remplacer `index.html` et changer le numéro `CACHE` en haut de `sw.js` (ex. `theta-v2.1.1`).

## Installer sur le téléphone

1. Ouvrir l'adresse dans Chrome sur Android.
2. Menu ⋮ › **Installer l'application** (ou « Ajouter à l'écran d'accueil »).
3. Un appui long sur l'icône propose les raccourcis : Dicter une note, Tâches, Agenda.

## Brancher Google Agenda (une seule fois, ~10 min)

1. https://console.cloud.google.com → créer un projet « Thêta ».
2. **API et services › Bibliothèque** → activer **Google Calendar API**.
3. **Écran de consentement OAuth** → Externe → nom de l'app + ton e-mail.
   Dans **Audience / Utilisateurs test**, ajouter `xavier.gougaud1@gmail.com`.
4. **Identifiants › Créer des identifiants › ID client OAuth** → type **Application Web**.
   Origines JavaScript autorisées : `https://xaviergougaud1-netizen.github.io`
5. Copier l'ID client (`…apps.googleusercontent.com`).
6. Dans l'app : **Plus › Google Agenda** → coller l'identifiant → **Se connecter à Google**.
   Si Google affiche « application non validée » : *Paramètres avancés › Accéder à Thêta*.
7. Cocher les agendas à importer (Principal, Famille, Todoist sont cochés d'office s'ils existent) et choisir l'agenda par défaut.

### Fonctionnement de la synchro
- **App → Google** : événements créés/modifiés/supprimés, et tâches datées (préfixe ✅, ✔️ une fois faites).
- **Google → App** : événements des agendas cochés, de J-30 à J+120 ; modifications et suppressions répercutées.
- Une tâche déplacée dans Google Agenda change aussi de date dans l'app.
- La session Google dure 1 h : la synchro est automatique pendant ce temps, ensuite un appui sur 🔄 la rouvre.
- Agendas en lecture seule (souvent Todoist) : importés mais non modifiables (🔒).

## Notes vocales : comment l'app range

L'analyse se fait **sur le téléphone** (aucun envoi). Chaque note est découpée (dire « à la ligne », ou utiliser « puis », « ensuite »), puis chaque morceau est proposé avec son type ; tu valides ou corriges d'un geste.

| Tu dis… | L'app propose |
|---|---|
| « Conseil de cycle jeudi 17h » | 📅 Agenda, jeudi 17:00–18:00 |
| « Acheter des feutres pour la classe » | 📁 Todo › Travail › Achat pour la classe |
| « Pour le conseil des maîtres : parler de la kermesse » | 📁 Todo › Conseil des maîtres |
| « Rappelle-moi d'appeler maman demain soir » | 🔔 Rappel, demain 19:00 |
| « Corriger les évaluations vendredi, urgent » | 📋 Tâche, vendredi, priorité haute |
| « Arroser les plantes tous les lundis » | 🔔 Rappel chaque semaine |
| « Film à voir : Dune, conseillé par Julie » | 💡 Idée › Film |
| « J'ai prêté la BD Astérix à Paul » | 📚 Prêt à Paul |
| « Repeindre le portail » | 📁 Todo › Travaux |

Mots reconnus : aujourd'hui, demain, après-demain, ce soir, lundi…dimanche, le 12, le 12 octobre, 12/10, dans 3 jours, la semaine prochaine, 14h, 14h30, de 9h à 11h, midi, pendant 1h, urgent, pas urgent… Le nom de n'importe quel dossier Todo que tu crées est aussi reconnu.

## Fond d'écran
**Plus › Réglages › Fond d'écran** : quatre fonds zen dessinés dans l'app (Brume, Aube, Lac, Jardin), fonctionnant hors ligne, ou **📷 Depuis le téléphone** pour choisir n'importe quelle photo de ta galerie. Deux curseurs : *Voile* (atténue l'image pour la lisibilité) et *Flou*. La photo choisie est incluse dans l'export de sauvegarde.

## Données
- Tout reste dans Chrome sur le téléphone ; images dans IndexedDB (plusieurs centaines de Mo possibles).
- **Réglages › Exporter** : fichier `.json` complet (avec images). À faire régulièrement ; un bandeau le rappelle tous les 14 jours.
- **Réglages › Importer** pour restaurer ou passer sur un autre téléphone.

## Limites
- Notifications de rappel : seulement quand l'app est ouverte ou récemment en arrière-plan.
- Dictée : Chrome Android, avec connexion internet (service de reconnaissance Google).
- Synchro Google : nécessite internet ; hors ligne, les changements attendent (« ⏳ à synchroniser »).
