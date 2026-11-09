# Configuration de l’assistant Gemini

Le site reste statique. Sur Vercel, la fonction `api/chat.js` transmet les messages à Gemini sans envoyer la clé API au navigateur.

1. Crée une clé Gemini dans [Google AI Studio](https://aistudio.google.com/app/apikey).
2. Dans le projet Vercel, ouvre **Settings → Environment Variables**.
3. Ajoute `GEMINI_API_KEY` avec la clé, pour les environnements nécessaires.
4. Redéploie le site pour activer la variable.

Ne place jamais cette clé dans un fichier HTML ou JavaScript et ne la publie pas dans Git. L’API Gemini propose un quota gratuit, soumis à des limites qui peuvent changer. Sur l’offre gratuite, les messages peuvent être utilisés par Google pour améliorer ses produits. Le chat du site prévient les visiteurs et leur recommande de ne pas envoyer de données sensibles.

Le bouton WhatsApp fonctionne sans cette configuration. Tant que la variable Vercel n’est pas définie, l’assistant propose de contacter l’équipe sur WhatsApp.
