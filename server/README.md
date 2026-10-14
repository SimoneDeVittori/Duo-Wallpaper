# Attivare la generazione IA

La pagina `genera.html` è pronta; la generazione resta disabilitata finché `generator-config.js` non contiene un endpoint HTTPS reale. GitHub Pages non esegue questo server.

1. Eseguire `generate.mjs` su un servizio Node 22+ con un singolo processo e volume persistente. Esporre `/generate` tramite HTTPS con timeout superiore a 180 secondi.
2. Impostare `OPENAI_API_KEY` come segreto del servizio, mai in GitHub o nei file pubblici. Sono necessari accesso a `gpt-image-1` e fatturazione API attiva.
3. Impostare `QUOTA_FILE` a un percorso su volume persistente (es. `/data/duo-quota.json`), `MAX_DAILY_GENERATIONS` (default 10), `ALLOWED_ORIGIN=https://simonedevittori.github.io` e `PORT` secondo l'hosting.
4. Avviare con `node generate.mjs` e inserire l'URL HTTPS completo `/generate` nel campo `endpoint` di `generator-config.js`.
5. Verificare dal sito una generazione, il download JPEG 5340 × 3756 e Salva in Foto su iPhone.

Il server limita a una richiesta in corso, una al minuto e 10 tentativi al giorno UTC. Anche i tentativi che falliscono consumano la quota, per mantenere il limite di spesa. Il contatore viene salvato prima della richiesta API. Non usare più repliche con questo contatore su file: per scalare serve un contatore condiviso atomico. L'origine CORS non è un'autenticazione; un chiamante esterno può imitarla e consumare la quota. Prima di un uso pubblico ampio aggiungere una verifica anti-bot o autenticazione. Non abilitare log dei corpi delle richieste né delle risposte sull'hosting.

Nessun prompt o immagine viene salvato dal codice nel repository, in un database o nel browser storage. Il servizio IA riceve il prompt e applica le proprie regole di trattamento dati. Il risultato rimane nella memoria della pagina; l'utente deve scaricarlo prima di uscire. Il browser ritaglia leggermente e ingrandisce l'immagine nativa 1536 × 1024 a 5340 × 3756: questo è il formato di esportazione, non la risoluzione nativa del modello.

Documentazione API: https://developers.openai.com/api/docs/guides/image-generation
