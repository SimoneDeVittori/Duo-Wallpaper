/* Prepare the image before the tap: iOS requires sharing during user activation. */
let photoRequest=0, photoFile=null, photoWallpaper=null;
const photoButton=document.getElementById('save-photos');
const photoNote=document.getElementById('photo-note');
function androidPhotoDownload(){return document.documentElement.classList.contains('android')||/Android/i.test(navigator.userAgent)||navigator.userAgentData?.platform==='Android';}
function desktopPhotoDownload(){return !window.matchMedia('(max-width:760px), (hover:none) and (pointer:coarse)').matches;}
const manualPhotoNote=()=>duoT('Apri l’immagine, tienila premuta e scegli “Salva in Foto” o “Salva immagine”.');
function manualPhotoMode(message=manualPhotoNote()){
  photoFile=null;
  photoButton.disabled=false;
  photoButton.textContent=duoT('Salva in Foto');
  photoNote.textContent=message;
}
async function preparePhotoSave(w){
  const request=++photoRequest;
  photoWallpaper=w;
  photoFile=null;
  photoNote.hidden=desktopPhotoDownload();
  if(androidPhotoDownload()){
    photoButton.disabled=false;
    photoButton.textContent=duoT('Scarica sfondo');
    photoNote.hidden=false;
    photoNote.textContent=duoT('Scarica il file alla risoluzione originale. Lo trovi nella cartella Download.');
    return;
  }
  if(desktopPhotoDownload()){photoButton.disabled=false;photoButton.textContent=duoT('Scarica sfondo');photoNote.textContent='';return;}
  if(!navigator.share||!navigator.canShare){manualPhotoMode();return;}
  photoButton.disabled=true;
  photoButton.textContent=duoT('Preparo immagine…');
  photoNote.textContent=duoT('Preparazione del file alla risoluzione originale.');
  try{
    const response=await fetch(w.image);
    if(!response.ok)throw new Error('Image unavailable');
    const blob=await response.blob();
    const filename=w.filename||w.image.split('/').pop();
    const type=/\.png$/i.test(filename)?'image/png':/\.webp$/i.test(filename)?'image/webp':'image/jpeg';
    const file=new File([blob],filename,{type});
    if(request!==photoRequest)return;
    if(!file.size||!navigator.canShare({files:[file]})){manualPhotoMode();return;}
    photoFile=file;
    photoButton.disabled=false;
    photoButton.textContent=duoT('Salva in Foto');
    photoNote.textContent=duoT('Su iPhone: tocca “Salva in Foto”, poi “Salva immagine” nel menu. Se non trovi la voce, apri l’immagine e tienila premuta.');
  }catch(error){if(request===photoRequest)manualPhotoMode();}
}
photoButton.addEventListener('click',async()=>{
  if(!photoWallpaper)return;
  if(androidPhotoDownload()||desktopPhotoDownload()){
    const link=document.createElement('a');
    link.href=photoWallpaper.image;
    link.download=photoWallpaper.filename||photoWallpaper.image.split('/').pop();
    document.body.append(link);link.click();link.remove();
    if(androidPhotoDownload())photoNote.textContent=duoT('Download avviato. Controlla la cartella Download o la notifica del browser.');
    return;
  }
  if(!photoFile){window.open(photoWallpaper.image,'_blank','noopener');return;}
  const request=photoRequest;
  photoButton.disabled=true;
  try{
    // No asynchronous work before share(): preserve the user's tap activation.
    await navigator.share({files:[photoFile]});
  }catch(error){
    if(request===photoRequest&&error.name!=='AbortError'){
      manualPhotoMode(duoT('Condivisione non disponibile. Tocca di nuovo “Salva in Foto” per aprire l’immagine, poi tienila premuta per salvarla.'));
    }
  }finally{if(request===photoRequest)photoButton.disabled=false;}
});
