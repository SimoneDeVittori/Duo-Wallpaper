const categories=[{name:'Animali',image:'originals/wildlife-leone-savana.jpg',subtitle:'La natura, libera'},{name:'Natura',image:'originals/Matterhorn%2001.png',subtitle:'Paesaggi che emozionano'},{name:'Paesaggi e Città',image:'originals/97A233FF-D5C5-44C3-B746-6B9283F49172.JPG',subtitle:'Luoghi da esplorare'}];
let wallpapers=[],selected='Tutti',term='',active=null;let favs=new Set(JSON.parse(localStorage.getItem('duo-favs')||'[]'));
const $=id=>document.getElementById(id);const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const categoryAliases={"Draghi":"Fantasy","Paesaggi": "Paesaggi e Città", "Cartoon vintage": "Cartoon", "Cartoni animati": "Cartoon", "Snoopy": "Cartoon", "Extraterrestri": "Spazio", "Pianeti": "Spazio", "Chucky": "Halloween", "Colibrì": "Animali", "Colibri": "Animali", "Camaleonti": "Animali"};
function catFor(w){return categoryAliases[w.category]||w.category||''}
function hasLocal(w){return true}
function imagePath(w){return w.thumbnail||w.image}
function toggleFav(id){if(favs.has(id))favs.delete(id);else favs.add(id);localStorage.setItem('duo-favs',JSON.stringify([...favs]));render();if(active?.id===id)refreshHeart()}
function card(w){let local=hasLocal(w);let article=document.createElement('article');article.className='wall-card';article.innerHTML=`<button class="wall-preview" aria-label="Apri ${esc(w.title)}"><img loading="lazy" src="${esc(imagePath(w))}" alt="${esc(w.title)}"></button><button class="heart ${favs.has(w.id)?'liked':''}" aria-pressed="${favs.has(w.id)}" aria-label="${favs.has(w.id)?'Rimuovi dai':'Aggiungi ai'} preferiti"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/></svg></button><div class="wall-info"><div><strong>${esc(w.title)}</strong><small>${esc(w.width)} × ${esc(w.height)}</small></div><a class="card-arrow" href="${esc(w.image)}" download="${esc(w.filename||w.id)}" aria-label="Scarica ${esc(w.title)}" title="Scarica immagine"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12m-5-5 5 5 5-5M5 16v4a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-4"/></svg></a></div>`;const preview=article.querySelector('.wall-preview');const img=preview.querySelector('img');const reveal=()=>preview.classList.remove('loading');preview.classList.add('loading');img.addEventListener('load',reveal,{once:true});img.addEventListener('error',reveal,{once:true});if(img.complete)reveal();preview.onclick=()=>openDetail(w);article.querySelector('.heart').onclick=()=>toggleFav(w.id);return article}
function render(){const filtered=wallpapers.filter(w=>(selected==='Tutti'||catFor(w)===selected)&&(w.title+' '+catFor(w)+' '+(w.subcategory||w.category||'')).toLowerCase().includes(term));$('gallery').replaceChildren(...filtered.map(card));$('results').textContent=filtered.length+' sfondi';$('empty').hidden=filtered.length!==0;const favourites=wallpapers.filter(w=>favs.has(w.id));$('fav-gallery').replaceChildren(...favourites.map(card));$('fav-empty').hidden=favourites.length>0;document.querySelectorAll('.filter').forEach(b=>b.classList.toggle('selected',b.dataset.filter===selected))}

/* Wait for a typing pause, then reveal the first match below the sticky header. */
let searchScrollTimer;
function scrollToSearchResult(){
  clearTimeout(searchScrollTimer);
  if(!term)return;
  searchScrollTimer=setTimeout(()=>{
    if(!term||!$('gallery').firstElementChild)return;
    const topbar=document.querySelector('.topbar');
    const headerHeight=topbar?topbar.getBoundingClientRect().height:0;
    const top=$('gallery').getBoundingClientRect().top+window.scrollY-headerHeight-16;
    window.scrollTo({top:Math.max(0,top),behavior:window.matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth'});
  },350);
}

function setFilter(name){selected=name;render();document.querySelector('#galleria').scrollIntoView({behavior:'smooth'})}
function refreshHeart(){const liked=favs.has(active.id);const button=$('detail-heart');button.classList.add('detail-heart');button.classList.toggle('liked',liked);button.setAttribute('aria-pressed',String(liked));button.setAttribute('aria-label',liked?'Rimuovi dai preferiti':'Aggiungi ai preferiti');button.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/></svg><span>'+(liked?'Nei preferiti':'Preferiti')+'</span>'} 
function openDetail(w){active=w;$('detail-title').textContent=w.title;$('detail-resolution').textContent=w.width+' × '+w.height;$('detail-img').hidden=false;$('detail-fallback').hidden=true;$('detail-img').src=w.image;$('detail-img').style.objectFit='contain';$('open-photo').href=w.image;refreshHeart();$('detail').showModal();preparePhotoSave(w)}
$('close').onclick=()=>$('detail').close();$('detail').addEventListener('click',e=>{if(e.target===$('detail'))$('detail').close()});$('detail-heart').onclick=()=>toggleFav(active.id);$('search').addEventListener('input',e=>{term=e.target.value.toLowerCase().trim();render();scrollToSearchResult()});$('reset').onclick=()=>{selected='Tutti';term='';$('search').value='';clearTimeout(searchScrollTimer);render()};
fetch('wallpapers.json?v=collection-226-trains-dinosaurs').then(r=>{if(!r.ok)throw Error('Catalogo non disponibile');return r.json()}).then(data=>{wallpapers=data;startHeroSlideshow(data);$('total-count').textContent=data.length;const categoryNames=[...new Set([...categories.map(c=>c.name),...data.map(catFor).filter(Boolean)])];const cats=['Tutti',...categoryNames.filter(name=>name!=='Vario'),...(categoryNames.includes('Vario')?['Vario']:[])];$('filters').replaceChildren(...cats.map(name=>{const b=document.createElement('button');b.className='filter';b.dataset.filter=name;b.textContent=name==='Tutti'?'Tutti - dal più recente':name;b.onclick=()=>setFilter(name);return b}));render();scrollToSearchResult()}).catch(err=>{$('gallery').textContent='Errore di caricamento: '+err.message+'. Pubblica su GitHub Pages o usa un server locale.'});

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

/* Random rotation with no repeats within a cycle or across page openings. */
function startHeroSlideshow(items){
  const slides=items.filter(w=>w.hero);
  const first=document.querySelector('.fold-wallpaper');
  const heroButton=document.querySelector('.float-tag');
  if(!first||!slides.length)return;
  first.style.backgroundImage='none';
  const second=first.cloneNode(false);
  second.style.opacity='0';
  first.after(second);
  const layers=[first,second];
  let shown=0,busy=false,currentWallpaper=null,deck=[],lastId='';
  try{lastId=localStorage.getItem('duo-last-hero')||''}catch{}
  function nextWallpaper(){
    if(!deck.length){
      deck=[...slides];
      for(let i=deck.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[deck[i],deck[j]]=[deck[j],deck[i]]}
      if(deck.length>1&&deck[0].id===lastId){[deck[0],deck[1]]=[deck[1],deck[0]]}
    }
    return deck.shift();
  }
  function preload(w){
    const image=new Image();
    const ready=new Promise(resolve=>{image.onload=()=>resolve(true);image.onerror=()=>resolve(false)});
    image.src=w.image;
    return {w,ready};
  }
  heroButton.disabled=true;
  heroButton.onclick=()=>{if(currentWallpaper)openDetail(currentWallpaper)};
  let pending=preload(nextWallpaper());
  async function advance(){
    if(document.hidden||busy||$('detail').open)return;
    busy=true;
    const {w,ready}=pending;
    try{
      if(await ready){
        const next=1-shown;
        layers[next].style.backgroundImage='url('+JSON.stringify(w.image)+')';
        layers[next].style.opacity='1';
        layers[shown].style.opacity='0';
        shown=next;
        currentWallpaper=w;
        lastId=w.id;
        try{localStorage.setItem('duo-last-hero',lastId)}catch{}
        document.querySelector('.hero-phone-area').setAttribute('aria-label','Telefono pieghevole con sfondo '+w.title);
        heroButton.disabled=false;
        heroButton.textContent='✦  '+w.title;
        heroButton.setAttribute('aria-label','Apri '+w.title);
        heroButton.title='Visualizza e scarica '+w.title;
      }
    }finally{
      pending=preload(nextWallpaper());
      busy=false;
    }
  }
  advance();
  setInterval(advance,10000);
}

/* A downward swipe from the top of the mobile sheet dismisses it. */
function installDetailSwipeToClose(dialog){
  let start=null;
  dialog.addEventListener('touchstart',event=>{
    start=null;
    if(!window.matchMedia('(max-width:760px), (hover:none) and (pointer:coarse)').matches||dialog.scrollTop>0||event.touches.length!==1||event.target.closest('button,a,input'))return;
    const touch=event.touches[0];start={x:touch.clientX,y:touch.clientY,time:Date.now()};
  },{passive:true});
  dialog.addEventListener('touchend',event=>{
    const origin=start;start=null;
    if(!origin||!event.changedTouches.length)return;
    const touch=event.changedTouches[0],dy=touch.clientY-origin.y,dx=Math.abs(touch.clientX-origin.x);
    if(dy>=80&&dy>dx*1.4&&Date.now()-origin.time<1000)dialog.close();
  },{passive:true});
  dialog.addEventListener('touchcancel',()=>{start=null},{passive:true});
}
installDetailSwipeToClose($('detail'));

/* Keep the creator's single logo beside the eyebrow on phones. */
const heroLogo=document.querySelector('.creator-logo');
const mobileHero=window.matchMedia('(max-width:760px)');
function placeHeroLogo(){
  if(!heroLogo)return;
  if(mobileHero.matches)document.querySelector('.hero-heading-row').append(heroLogo);
  else document.querySelector('.hero-phone-area').prepend(heroLogo);
}
placeHeroLogo();
mobileHero.addEventListener('change',placeHeroLogo);
