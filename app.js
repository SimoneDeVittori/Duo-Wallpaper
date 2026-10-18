const categories=[{name:'Animali',image:'originals/wildlife-leone-savana.jpg',subtitle:'La natura, libera'},{name:'Natura',image:'originals/Matterhorn%2001.png',subtitle:'Paesaggi che emozionano'},{name:'Paesaggi e Città',image:'originals/97A233FF-D5C5-44C3-B746-6B9283F49172.JPG',subtitle:'Luoghi da esplorare'}];
let wallpapers=[],selected='Tutti',term='',active=null;let favs=new Set(JSON.parse(localStorage.getItem('duo-favs')||'[]'));
const $=id=>document.getElementById(id);const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const categoryAliases={"Draghi":"Fantasy","Paesaggi": "Paesaggi e Città", "Cartoon vintage": "Cartoon", "Cartoni animati": "Cartoon", "Snoopy": "Cartoon", "Extraterrestri": "Spazio", "Pianeti": "Spazio", "Chucky": "Halloween", "Colibrì": "Animali", "Colibri": "Animali", "Camaleonti": "Animali"};
function catFor(w){return categoryAliases[w.category]||w.category||''}
function hasLocal(w){return true}
function imagePath(w){return w.thumbnail||w.image}
function toggleFav(id){if(favs.has(id))favs.delete(id);else favs.add(id);localStorage.setItem('duo-favs',JSON.stringify([...favs]));render();if(active?.id===id)refreshHeart()}
function card(w,items=wallpapers){let local=hasLocal(w);let article=document.createElement('article');article.className='wall-card';article.innerHTML=`<button class="wall-preview" aria-label="${esc(duoT('Apri {title}',{title:duoTitle(w)}))}"><img loading="lazy" src="${esc(imagePath(w))}" alt="${esc(duoTitle(w))}"></button><button class="heart ${favs.has(w.id)?'liked':''}" aria-pressed="${favs.has(w.id)}" aria-label="${esc(duoT(favs.has(w.id)?'Rimuovi dai preferiti':'Aggiungi ai preferiti'))}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/></svg></button><div class="wall-info"><div><strong>${esc(duoTitle(w))}</strong><small>${esc(w.width)} × ${esc(w.height)}</small></div><a class="card-arrow" href="${esc(w.image)}" download="${esc(w.filename||w.id)}" aria-label="${esc(duoT('Scarica {title}',{title:duoTitle(w)}))}" title="${esc(duoT('Scarica sfondo'))}"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12m-5-5 5 5 5-5M5 16v4a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-4"/></svg></a></div>`;const preview=article.querySelector('.wall-preview');const img=preview.querySelector('img');const reveal=()=>preview.classList.remove('loading');preview.classList.add('loading');img.addEventListener('load',reveal,{once:true});img.addEventListener('error',reveal,{once:true});if(img.complete)reveal();preview.onclick=()=>openDetail(w,items);article.querySelector('.heart').onclick=()=>toggleFav(w.id);return article}
function render(){const filtered=wallpapers.filter(w=>(selected==='Tutti'||catFor(w)===selected)&&(w.title+' '+(w.titleEn||'')+' '+catFor(w)+' '+duoCategory(catFor(w))+' '+(w.subcategory||w.category||'')).toLowerCase().includes(term));$('gallery').replaceChildren(...filtered.map(w=>card(w,filtered)));$('results').textContent=duoT('{count} sfondi',{count:filtered.length});$('empty').hidden=filtered.length!==0;const favourites=wallpapers.filter(w=>favs.has(w.id));$('fav-gallery').replaceChildren(...favourites.map(w=>card(w,favourites)));$('fav-empty').hidden=favourites.length>0;document.querySelectorAll('.filter').forEach(b=>b.classList.toggle('selected',b.dataset.filter===selected))}

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
function refreshHeart(){const liked=favs.has(active.id);const button=$('detail-heart');button.classList.add('detail-heart');button.classList.toggle('liked',liked);button.setAttribute('aria-pressed',String(liked));button.setAttribute('aria-label',duoT(liked?'Rimuovi dai preferiti':'Aggiungi ai preferiti'));button.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/></svg><span>'+duoT(liked?'Nei preferiti':'Preferiti')+'</span>'}
let detailItems=[];
function refreshDetailNavigation(){
  const index=detailItems.findIndex(w=>w.id===active.id);
  $('detail-prev').disabled=index<=0;
  $('detail-next').disabled=index<0||index>=detailItems.length-1;
  $('detail-position').textContent=(index+1)+' / '+detailItems.length;
}
function fitDetailTitle(){
  if(!$('detail').open)return;
  const title=$('detail-title');
  title.style.fontSize='';
  let size=parseFloat(getComputedStyle(title).fontSize);
  while(title.scrollWidth>title.clientWidth&&size>12){
    size=Math.max(12,size-.5);
    title.style.fontSize=size+'px';
  }
}
window.addEventListener('resize',fitDetailTitle);
if(document.fonts)document.fonts.ready.then(fitDetailTitle);
function showDetailWallpaper(w){
  active=w;
  $('detail-title').textContent=duoTitle(w);
  $('detail-title').title=duoTitle(w);
  $('detail-resolution').textContent=w.width+' × '+w.height;
  $('detail-img').hidden=false;
  $('detail-fallback').hidden=true;
  $('detail-img').alt=duoTitle(w);
  $('detail-img').style.aspectRatio=w.width+' / '+w.height;
  $('detail-img').src=w.image;
  $('detail-img').style.objectFit='contain';
  $('open-photo').href=w.image;
  refreshHeart();
  refreshDetailNavigation();
  preparePhotoSave(w);
  fitDetailTitle();
}
function openDetail(w,items=wallpapers){
  detailItems=items.some(item=>item.id===w.id)?[...items]:[w];
  showDetailWallpaper(w);
  if(!$('detail').open)$('detail').showModal();
  fitDetailTitle();
}
function navigateDetail(direction){
  if(!$('detail').open||!active)return;
  const index=detailItems.findIndex(w=>w.id===active.id);
  const next=detailItems[index+direction];
  if(next)showDetailWallpaper(next);
}
$('detail-prev').onclick=()=>navigateDetail(-1);
$('detail-next').onclick=()=>navigateDetail(1);
$('detail').addEventListener('keydown',event=>{
  if(event.altKey||event.ctrlKey||event.metaKey||event.shiftKey||event.target.closest('input,textarea,select,[contenteditable="true"]'))return;
  if(event.key==='ArrowLeft'||event.key==='ArrowRight'){
    event.preventDefault();
    navigateDetail(event.key==='ArrowLeft'?-1:1);
  }
});
/* Horizontal gestures browse images; vertical gestures keep scrolling/closing. */
const detailPhoto=document.querySelector('.detail-photo');
let detailSwipe=null;
detailPhoto.addEventListener('touchstart',event=>{
  detailSwipe=null;
  if(event.touches.length!==1||event.target.closest('button,a'))return;
  const touch=event.touches[0];
  detailSwipe={x:touch.clientX,y:touch.clientY,time:Date.now()};
},{passive:true});
detailPhoto.addEventListener('touchmove',event=>{
  if(!detailSwipe)return;
  if(event.touches.length!==1){detailSwipe=null;return;}
  const touch=event.touches[0];
  const dx=Math.abs(touch.clientX-detailSwipe.x),dy=Math.abs(touch.clientY-detailSwipe.y);
  if(dx>12&&dx>dy*1.4&&event.cancelable)event.preventDefault();
},{passive:false});
detailPhoto.addEventListener('touchend',event=>{
  const origin=detailSwipe;detailSwipe=null;
  if(!origin||!event.changedTouches.length||event.touches.length)return;
  const touch=event.changedTouches[0];
  const dx=touch.clientX-origin.x,dy=Math.abs(touch.clientY-origin.y);
  if(Math.abs(dx)>=50&&Math.abs(dx)>dy*1.4&&Date.now()-origin.time<1000)navigateDetail(dx<0?1:-1);
},{passive:true});
detailPhoto.addEventListener('touchcancel',()=>{detailSwipe=null},{passive:true});
$('detail').addEventListener('close',()=>{detailSwipe=null;detailItems=[]});
$('close').onclick=()=>$('detail').close();$('detail').addEventListener('click',e=>{if(e.target===$('detail'))$('detail').close()});$('detail-heart').onclick=()=>toggleFav(active.id);$('search').addEventListener('input',e=>{term=e.target.value.toLowerCase().trim();render();scrollToSearchResult()});function resetGallery(){selected='Tutti';term='';$('search').value='';clearTimeout(searchScrollTimer);render()}$('reset').onclick=resetGallery;
function renderFilters(){const categoryNames=[...new Set([...categories.map(c=>c.name),...wallpapers.map(catFor).filter(Boolean)])];const cats=['Tutti',...categoryNames.filter(name=>name!=='Vario'),...(categoryNames.includes('Vario')?['Vario']:[])];$('filters').replaceChildren(...cats.map(name=>{const b=document.createElement('button');b.className='filter';b.dataset.filter=name;b.textContent=name==='Tutti'?duoT('Tutti - dal più recente'):duoCategory(name);b.onclick=()=>setFilter(name);return b}))}
window.addEventListener('duo-language-change',()=>{
  renderFilters();render();updateDeviceClock();$('reset').onclick=resetGallery;
  if(active&&$('detail').open)showDetailWallpaper(active);
});
fetch('wallpapers.json?v=collection-277-ponti').then(r=>{if(!r.ok)throw Error(duoT('Catalogo non disponibile'));return r.json()}).then(data=>{wallpapers=data;startHeroSlideshow(data);$('total-count').textContent=data.length;renderFilters();render();scrollToSearchResult()}).catch(err=>{$('gallery').textContent=duoT('Errore di caricamento:')+' '+err.message+duoT('. Pubblica su GitHub Pages o usa un server locale.')});

/* Live lock screen: use the visitor's device time and local timezone. */
function updateDeviceClock(){
  const now=new Date();
  const time=new Intl.DateTimeFormat(duoLocale(),{hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).format(now);
  document.querySelectorAll('[data-device-time]').forEach(el=>{el.textContent=time;el.setAttribute('datetime',now.toISOString())});
  const date=document.querySelector('[data-device-date]');
  if(date){date.textContent=new Intl.DateTimeFormat(duoLocale(),{weekday:'long',day:'numeric',month:'long'}).format(now);date.setAttribute('datetime',now.toISOString().slice(0,10))}
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
  heroButton.textContent=duoT('Caricamento sfondo…');
  window.addEventListener('duo-language-change',()=>{
    if(!currentWallpaper){heroButton.textContent=duoT('Caricamento sfondo…');return;}
    heroButton.textContent='✦  '+duoTitle(currentWallpaper);
    heroButton.setAttribute('aria-label',duoT('Apri {title}',{title:duoTitle(currentWallpaper)}));
    heroButton.title=duoT('Visualizza e scarica {title}',{title:duoTitle(currentWallpaper)});
    document.querySelector('.hero-phone-area').setAttribute('aria-label',duoT('Telefono pieghevole con sfondo {title}',{title:duoTitle(currentWallpaper)}));
  });
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
        document.querySelector('.hero-phone-area').setAttribute('aria-label',duoT('Telefono pieghevole con sfondo {title}',{title:duoTitle(w)}));
        heroButton.disabled=false;
        heroButton.textContent='✦  '+duoTitle(w);
        heroButton.setAttribute('aria-label',duoT('Apri {title}',{title:duoTitle(w)}));
        heroButton.title=duoT('Visualizza e scarica {title}',{title:duoTitle(w)});
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


