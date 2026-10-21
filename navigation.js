/* Independent navigation controls also work while the catalog is loading. */
(() => {
  const button=document.getElementById('back-to-wallpapers');
  const gallery=document.getElementById('galleria');
  const favourites=document.querySelector('.mobile-favourites');
  if(!button||!gallery)return;
  let scheduled=false;
  function headerHeight(){return document.querySelector('.topbar')?.getBoundingClientRect().height||0}
  function update(){
    scheduled=false;
    const scroll=window.scrollY||document.scrollingElement?.scrollTop||0;
    button.hidden=!(scroll>200&&gallery.getBoundingClientRect().top<headerHeight()-120);
  }
  function schedule(){if(!scheduled){scheduled=true;requestAnimationFrame(update)}}
  function labels(){
    const en=window.duoLanguage?.()==='en';
    button.setAttribute('aria-label',en?'Back to the top of wallpapers':'Torna all’inizio degli sfondi');
    button.title=en?'Back to wallpapers':'Torna agli sfondi';
    if(favourites){favourites.setAttribute('aria-label',en?'Favourites':'Preferiti');favourites.title=en?'Favourites':'Preferiti'}
  }
  function reveal(section){
    const top=section.getBoundingClientRect().top+(window.scrollY||document.scrollingElement?.scrollTop||0)-headerHeight()-16;
    window.scrollTo({top:Math.max(0,top),behavior:window.matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth'});
    const heading=section.querySelector('h2');
    if(heading){heading.setAttribute('tabindex','-1');heading.focus({preventScroll:true})}
  }
  button.addEventListener('click',()=>reveal(gallery));
  if(favourites)favourites.addEventListener('click',event=>{
    const section=document.getElementById('preferiti');
    if(section){event.preventDefault();reveal(section)}
  });
  document.addEventListener('scroll',schedule,{passive:true,capture:true});
  window.addEventListener('scroll',schedule,{passive:true});
  window.addEventListener('resize',schedule);
  window.addEventListener('pageshow',schedule);
  window.addEventListener('load',schedule);
  if(window.visualViewport){window.visualViewport.addEventListener('resize',schedule);window.visualViewport.addEventListener('scroll',schedule)}
  window.addEventListener('duo-language-change',labels);
  labels();update();
})();
