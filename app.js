const categories=[{name:'Animali',image:'originals/wildlife-leone-savana.jpg',subtitle:'La natura, libera'},{name:'Natura',image:'originals/Matterhorn%2001.png',subtitle:'Paesaggi che emozionano'},{name:'Paesaggi',image:'originals/97A233FF-D5C5-44C3-B746-6B9283F49172.JPG',subtitle:'Luoghi da esplorare'}];
let wallpapers=[],selected='Tutti',term='',active=null;let favs=new Set(JSON.parse(localStorage.getItem('duo-favs')||'[]'));
const $=id=>document.getElementById(id);const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
function catFor(w){return w.category||''}
function hasLocal(w){return true}
function imagePath(w){return w.image}
function toggleFav(id){if(favs.has(id))favs.delete(id);else favs.add(id);localStorage.setItem('duo-favs',JSON.stringify([...favs]));render();if(active?.id===id)refreshHeart()}
function card(w){let local=hasLocal(w);let article=document.createElement('article');article.className='wall-card';article.innerHTML=`<button class="wall-preview" aria-label="Apri ${esc(w.title)}"><img loading="lazy" src="${esc(imagePath(w))}" alt="${esc(w.title)}">${w.category?`<span class="tag">${esc(catFor(w))}</span>`:''}</button><button class="heart ${favs.has(w.id)?'liked':''}" aria-label="${favs.has(w.id)?'Rimuovi dai':'Aggiungi ai'} preferiti">${favs.has(w.id)?'♥':'♡'}</button><div class="wall-info"><div><strong>${esc(w.title)}</strong><small>${esc(w.source||'DUO Studio')}</small></div><span class="card-arrow" aria-hidden="true"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12m-5-5 5 5 5-5M5 16v4a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-4"/></svg></span></div>`;article.querySelector('.wall-preview').onclick=()=>openDetail(w);article.querySelector('.heart').onclick=()=>toggleFav(w.id);return article}
function render(){const filtered=wallpapers.filter(w=>(selected==='Tutti'||catFor(w)===selected)&&(w.title+' '+catFor(w)).toLowerCase().includes(term));$('gallery').replaceChildren(...filtered.map(card));$('results').textContent=filtered.length+' sfondi';$('empty').hidden=filtered.length!==0;const favourites=wallpapers.filter(w=>favs.has(w.id));$('fav-gallery').replaceChildren(...favourites.map(card));$('fav-empty').hidden=favourites.length>0;document.querySelectorAll('.filter').forEach(b=>b.classList.toggle('selected',b.dataset.filter===selected))}
function setFilter(name){selected=name;render();document.querySelector('#galleria').scrollIntoView({behavior:'smooth'})}
function refreshHeart(){$('detail-heart').textContent=favs.has(active.id)?'♥ Nei preferiti':'♡ Salva nei preferiti'}
function openDetail(w){active=w;$('detail-title').textContent=w.title;$('detail-category').textContent=catFor(w)||'DUO Wallpapers';$('detail-description').textContent=w.description||'Uno sfondo della collezione DUO Wallpapers. Pensato per uno schermo immersivo.';$('detail-source').textContent=w.source;$('detail-resolution').textContent=w.width+' × '+w.height+(w.generated?' · Alta definizione':' · File originale');$('detail-img').hidden=false;$('detail-fallback').hidden=true;$('detail-img').src=w.image;$('detail-img').style.objectFit='contain';const d=$('download');d.href=w.image;d.textContent=w.generated?'↓ Scarica wallpaper':'↓ Scarica originale';d.setAttribute('download',w.filename||w.title+'.jpg');d.target='_self';$('detail-note').textContent='Il download conserva la risoluzione originale. Per il rullino fotografico usa “Salva in Foto”.';$('open-photo').href=w.image;refreshHeart();$('detail').showModal();preparePhotoSave(w)}
$('close').onclick=()=>$('detail').close();$('detail').addEventListener('click',e=>{if(e.target===$('detail'))$('detail').close()});$('detail-heart').onclick=()=>toggleFav(active.id);$('search').addEventListener('input',e=>{term=e.target.value.toLowerCase().trim();render();if(term)document.querySelector('#galleria').scrollIntoView({behavior:'smooth'})});$('theme').onclick=()=>{document.body.classList.toggle('light');localStorage.setItem('duo-theme',document.body.classList.contains('light')?'light':'dark')};if(localStorage.getItem('duo-theme')==='light')document.body.classList.add('light');$('reset').onclick=()=>{selected='Tutti';term='';$('search').value='';render()};
fetch('wallpapers.json?v=collection-30').then(r=>{if(!r.ok)throw Error('Catalogo non disponibile');return r.json()}).then(data=>{wallpapers=data;startHeroSlideshow(data);$('total-count').textContent=data.length;const cats=['Tutti',...categories.map(c=>c.name)];$('filters').replaceChildren(...cats.map(name=>{const b=document.createElement('button');b.className='filter';b.dataset.filter=name;b.textContent=name;b.onclick=()=>setFilter(name);return b}));render()}).catch(err=>{$('gallery').textContent='Errore di caricamento: '+err.message+'. Pubblica su GitHub Pages o usa un server locale.'});

/* Live lock screen: use the visitor's device time and local timezone. */
function updateDeviceClock(){
  const now=new Date();
  const time=new Intl.DateTimeFormat('it-CH',{hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).format(now);
  document.querySelectorAll('[data-device-time]').forEach(el=>{el.textContent=time;el.setAttribute('datetime',now.toISOString())});
  const date=document.querySelector('[data-device-date]');
  if(date){date.textContent=new Intl.DateTimeFormat('it-CH',{weekday:'long',day:'numeric',month:'long'}).format(now);date.setAttribute('datetime',now.toISOString().slice(0,10))}
}
updateDeviceClock();
setInterval(updateDeviceClock,1000);
document.addEventListener('visibilitychange',()=>{if(!document.hidden)updateDeviceClock()});
window.addEventListener('pageshow',updateDeviceClock);

/* Rotate the ten latest catalog additions every 20 seconds. */
function startHeroSlideshow(items){
  const slides=items.slice(0,10);
  const heroButton=document.querySelector('.float-tag');
  let currentWallpaper=items.find(w=>w.id==='drive-19')||slides[0];
  heroButton.disabled=!currentWallpaper;
  heroButton.onclick=()=>{if(currentWallpaper)openDetail(currentWallpaper)};
  const first=document.querySelector('.fold-wallpaper');
  if(!first||!slides.length)return;
  const second=first.cloneNode(false);
  second.style.opacity='0';
  first.after(second);
  const layers=[first,second];
  let shown=0,index=0,busy=false;
  function preload(w){
    const image=new Image();
    const ready=new Promise(resolve=>{image.onload=()=>resolve(true);image.onerror=()=>resolve(false)});
    image.src=w.image;
    return ready;
  }
  let ready=preload(slides[index]);
  setInterval(async()=>{
    if(document.hidden||busy||$('detail').open)return;
    busy=true;
    const w=slides[index];
    try{
      if(await ready){
        const next=1-shown;
        layers[next].style.backgroundImage='url('+JSON.stringify(w.image)+')';
        layers[next].style.opacity='1';
        layers[shown].style.opacity='0';
        shown=next;
        document.querySelector('.hero-phone-area').setAttribute('aria-label','Telefono pieghevole con sfondo '+w.title);
        currentWallpaper=w;
        heroButton.textContent='✦  '+w.title;
        heroButton.setAttribute('aria-label','Apri '+w.title);
        heroButton.title='Visualizza e scarica '+w.title;
      }
    }finally{
      index=(index+1)%slides.length;
      ready=preload(slides[index]);
      busy=false;
    }
  },20000);
}
