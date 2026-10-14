/* Shared interface vocabulary; catalog IDs, filenames and favourites stay stable. */
(() => {
 const en={
  'Genera il tuo sfondo con IA':'Generate your wallpaper with AI',
  'Categorie':'Categories','Galleria':'Gallery','Preferiti':'Favourites','Cerca...':'Search','Cerca sfondi':'Search wallpapers',
  'UNA NUOVA PROSPETTIVA':'A NEW PERSPECTIVE','Il tuo Duo.<br><em>Un altro mondo.</em>':'Your Duo.<br><em>Another world.</em>',
  'Wallpaper spettacolari, dettagli incredibili. Una collezione in 4K pensata per valorizzare ogni pixel del tuo iPhone Duo.':'Stunning wallpapers, incredible detail. A 4K collection designed to make every pixel of your iPhone Duo shine.',
  'sfondi in collezione':'wallpapers in the collection','alta risoluzione':'high resolution','gratuiti':'free',
  'LA COLLEZIONE':'THE COLLECTION','Sfondi da esplorare':'Explore wallpapers','LA TUA SELEZIONE':'YOUR SELECTION','I tuoi preferiti':'Your favourites',
  'Ritrova velocemente gli sfondi che ami.':'Find the wallpapers you love, all in one place.',
  'Non hai ancora preferiti. Tocca ♡ su uno sfondo per salvarlo qui.':'No favourites yet. Tap ♡ on a wallpaper to save it here.',
  'Non ci sono sfondi per questa ricerca.':'No wallpapers match this search.','Mostra tutti':'Show all','Chiudi':'Close',
  'Sfoglia gli sfondi':'Browse wallpapers','Sfondo precedente':'Previous wallpaper','Sfondo successivo':'Next wallpaper','Precedente':'Previous','Successivo':'Next',
  'Dimensioni':'Dimensions','Originale':'Original','Salva in Foto':'Save to Photos','Scarica sfondo':'Download wallpaper','Apri immagine':'Open image',
  'Caricamento sfondo…':'Loading wallpaper…','Telefono pieghevole con sfondi a rotazione':'Foldable phone with rotating wallpapers','iPhone Duo pieghevole aperto, con due varianti sul retro':'Open iPhone Duo foldable phone with two rear colour variants','Anteprima sfondo':'Wallpaper preview','Anteprima non disponibile: file da importare da Google Drive':'Preview unavailable: the file needs to be imported from Google Drive',
  'Nei preferiti':'Saved to favourites','Rimuovi dai preferiti':'Remove from favourites','Aggiungi ai preferiti':'Add to favourites',
  'Apri {title}':'Open {title}','Scarica {title}':'Download {title}','Visualizza e scarica {title}':'View and download {title}',
  'Telefono pieghevole con sfondo {title}':'Foldable phone with {title} wallpaper','{count} sfondi':'{count} wallpapers','Tutti - dal più recente':'All - newest first',
  'Catalogo non disponibile':'Collection unavailable','Errore di caricamento:':'Loading error:',
  '. Pubblica su GitHub Pages o usa un server locale.':'. Publish to GitHub Pages or use a local server.',
  'Preparo immagine…':'Preparing image…','Preparazione del file alla risoluzione originale.':'Preparing the file at its original resolution.',
  'Apri l’immagine, tienila premuta e scegli “Salva in Foto” o “Salva immagine”.':'Open the image, press and hold it, then choose “Save to Photos” or “Save image”.',
  'Scarica il file alla risoluzione originale. Lo trovi nella cartella Download.':'Download the file at its original resolution. Find it in your Downloads folder.',
  'Download avviato. Controlla la cartella Download o la notifica del browser.':'Download started. Check your Downloads folder or the browser notification.',
  'Su iPhone: tocca “Salva in Foto”, poi “Salva immagine” nel menu. Se non trovi la voce, apri l’immagine e tienila premuta.':'On iPhone, tap “Save to Photos”, then “Save Image” in the menu. If that option is missing, open the image and press and hold it.',
  'Condivisione non disponibile. Tocca di nuovo “Salva in Foto” per aprire l’immagine, poi tienila premuta per salvarla.':'Sharing is unavailable. Tap “Save to Photos” again to open the image, then press and hold it to save.',
  'Tira per aggiornare':'Pull to refresh','Rilascia per aggiornare':'Release to refresh','Aggiornamento…':'Refreshing…',
  'Accessi':'Visits','Accessi alla pagina dal giorno di attivazione del contatore':'Page visits since the counter was enabled',
  'DUO Wallpapers — Sfondi 4K per iPhone Duo':'DUO Wallpapers — 4K wallpapers for iPhone Duo',
  'DUO Wallpapers — una collezione di sfondi 4K per iPhone Duo. Esplora, salva e scarica.':'DUO Wallpapers — a collection of 4K wallpapers for iPhone Duo. Explore, save and download.'
 };
 const cats={'Tutti':'All','Animali':'Animals','Natura':'Nature','Paesaggi e Città':'Landscapes & Cities','Treni':'Trains','Robottini':'Little Robots','Spazio':'Space','Cartoon':'Cartoons','Fantasy':'Fantasy','Halloween':'Halloween','Dinosauri':'Dinosaurs','Vario':'Miscellaneous','Vintage':'Vintage','Paesaggi':'Landscapes'};
 let language='it';try{language=localStorage.getItem('duo-language')==='en'?'en':'it'}catch{}
 window.duoT=(key,values={})=>(language==='en'?(en[key]||key):key).replace(/\{(\w+)\}/g,(_,name)=>values[name]??'{'+name+'}');
 window.duoTitle=w=>language==='en'?(w.titleEn||w.title):w.title;
 window.duoCategory=key=>language==='en'?(cats[key]||key):key;
 window.duoLocale=()=>language==='en'?'en-GB':'it-CH';
 window.duoLanguage=()=>language;
 const text=(selector,key)=>{const node=document.querySelector(selector);if(node)node.textContent=duoT(key)};
 const attr=(selector,name,key)=>{const node=document.querySelector(selector);if(node)node.setAttribute(name,duoT(key))};
 function apply(){
  document.documentElement.lang=language;
  document.title=duoT('DUO Wallpapers — Sfondi 4K per iPhone Duo');
  attr('meta[name="description"]','content','DUO Wallpapers — una collezione di sfondi 4K per iPhone Duo. Esplora, salva e scarica.');
  for(const [selector,key] of [['#ai-create-link','Genera il tuo sfondo con IA'],['[data-nav="categorie"]','Categorie'],['[data-nav="galleria"]','Galleria'],['[data-nav="preferiti"]','Preferiti'],['.hero-copy>p','Wallpaper spettacolari, dettagli incredibili. Una collezione in 4K pensata per valorizzare ogni pixel del tuo iPhone Duo.'],['.hero-stats div:nth-of-type(1) small','sfondi in collezione'],['.hero-stats div:nth-of-type(2) small','alta risoluzione'],['.hero-stats div:nth-of-type(3) small','gratuiti'],['.gallery-section .kicker','LA COLLEZIONE'],['.favourites-section .kicker','LA TUA SELEZIONE'],['.favourites-section .section-top p','Ritrova velocemente gli sfondi che ami.'],['#fav-empty','Non hai ancora preferiti. Tocca ♡ su uno sfondo per salvarlo qui.'],['.detail-spec span','Dimensioni'],['#open-photo','Apri immagine'],['#detail-fallback','Anteprima non disponibile: file da importare da Google Drive']])text(selector,key);
  document.querySelector('.eyebrow').innerHTML='<span class="live-dot"></span> '+duoT('UNA NUOVA PROSPETTIVA');
  document.querySelector('.hero h1').innerHTML=duoT('Il tuo Duo.<br><em>Un altro mondo.</em>');
  document.querySelector('.gallery-section h2').innerHTML=duoT('Sfondi da esplorare')+'<span class="dot">.</span>';
  document.querySelector('.favourites-section h2').innerHTML=duoT('I tuoi preferiti')+'<span class="dot">.</span>';
  document.querySelector('#empty').innerHTML=duoT('Non ci sono sfondi per questa ricerca.')+' <button id="reset">'+duoT('Mostra tutti')+'</button>';
  document.querySelector('#detail-prev').innerHTML='<span aria-hidden="true">‹</span> '+duoT('Precedente');
  document.querySelector('#detail-next').innerHTML=duoT('Successivo')+' <span aria-hidden="true">›</span>';
  for(const [selector,name,key] of [['#search','placeholder','Cerca...'],['#search','aria-label','Cerca sfondi'],['#close','aria-label','Chiudi'],['.detail-nav','aria-label','Sfoglia gli sfondi'],['#detail-prev','aria-label','Sfondo precedente'],['#detail-next','aria-label','Sfondo successivo'],['.fold-hardware','alt','iPhone Duo pieghevole aperto, con due varianti sul retro'],['.hero-phone-area','aria-label','Telefono pieghevole con sfondi a rotazione']])attr(selector,name,key);
  if(!document.querySelector('#detail').open){text('#save-photos','Salva in Foto');text('#detail-heart','Preferiti')}
  const visits=document.querySelector('footer img');if(visits){visits.alt=duoT('Accessi');visits.title=duoT('Accessi alla pagina dal giorno di attivazione del contatore');const url=new URL(visits.src);url.searchParams.set('label',duoT('Accessi'));if(visits.src!==url.href)visits.src=url.href}
  document.querySelectorAll('[data-language]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.language===language)));
 }
 window.duoSetLanguage=value=>{language=value==='en'?'en':'it';try{localStorage.setItem('duo-language',language)}catch{}apply();window.dispatchEvent(new CustomEvent('duo-language-change'))};
 document.querySelectorAll('[data-language]').forEach(b=>b.onclick=()=>duoSetLanguage(b.dataset.language));
 apply();
})();
