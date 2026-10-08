# DUO Wallpapers — sito per iPhone Duo

Sito statico responsive pronto per GitHub Pages. Ha ricerca, filtri per categorie, preferiti salvati sul dispositivo, modalità chiara/scura, anteprima e download dei nuovi sfondi originali a 2160 × 3840 pixel (4K verticale).

## Pubblicazione su GitHub Pages

1. Crea un repository pubblico su GitHub chiamato `duo-wallpapers`.
2. Carica **il contenuto** di questa cartella (index.html, style.css, app.js, wallpapers.json, assets/ e originals/) nella radice del repository.
3. Apri **Settings → Pages → Build and deployment → Deploy from a branch**; seleziona `main` e `/ (root)` e salva.
4. Dopo la pubblicazione apri `https://TUO-USERNAME.github.io/duo-wallpapers/`.

Non è stata eseguita alcuna pubblicazione su GitHub: bisogna caricare i file sul proprio account.

## Importazione dei 20 wallpaper da Google Drive

Google Drive → Immagini e Icone → Duo Wallpaper:
https://drive.google.com/drive/folders/1vKYwCp3RftN4lSEsO0IH1m80BAuQ5L4c

I 20 file sono già presenti nel catalogo `wallpapers.json` con i loro nomi precisi e link privati Drive, ma i **file binari non sono stati copiati** in questo pacchetto. Per renderli visualizzabili e scaricabili direttamente dalla galleria:

1. Scarica tutti i 20 file dalla cartella Drive.
2. Copiali senza rinominarli in `originals/`.
3. Nel file `app.js`, cambia `function hasLocal(w){return !w.driveId}` in `function hasLocal(w){return true}`.
4. Per gli sfondi già importati, il download avverrà tramite il sito. Per gli altri rimane il link al file su Drive.
5. Personalizza titoli e categorie nel file `wallpapers.json`: quelli con nome automatico sono etichettati `Da classificare`, perché non si poteva verificarne il contenuto visuale.

Per un import selettivo, modifica `hasLocal` in `return !w.driveId || importedFiles.has(w.filename)` definendo l'insieme dei file importati.

## Note

- I nuovi wallpaper nella cartella `assets/` sono 2160 × 3840 pixel e non necessitano di account o servizi esterni.
- I preferiti sono salvati localmente nel browser, non sincronizzati fra dispositivi.
- Il sito è autonomo; usa soltanto Google Fonts come risorsa esterna facoltativa.
- Questo sito è un concept indipendente e non è affiliato ad Apple.
