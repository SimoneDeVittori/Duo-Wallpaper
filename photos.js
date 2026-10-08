/* Prepare the image before the tap: iOS requires sharing during user activation. */
let photoRequest=0, photoFile=null, photoWallpaper=null;
const photoButton=document.getElementById('save-photos');
const photoNote=document.getElementById('photo-note');
const manualPhotoNote='Apri l’immagine, tienila premuta e scegli “Salva in Foto” o “Salva immagine”.';
function manualPhotoMode(message=manualPhotoNote){
  photoFile=null;
  photoButton.disabled=false;
  photoButton.textContent='Salva in Foto';
  photoNote.textContent=message;
}
async function preparePhotoSave(w){
  const request=++photoRequest;
  photoWallpaper=w;
  photoFile=null;
  if(!navigator.share||!navigator.canShare){manualPhotoMode();return;}
  photoButton.disabled=true;
  photoButton.textContent='Preparo immagine…';
  photoNote.textContent='Preparazione del file alla risoluzione originale.';
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
    photoButton.textContent='Salva in Foto';
    photoNote.textContent='Su iPhone: tocca “Salva in Foto”, poi “Salva immagine” nel menu. Se non trovi la voce, apri l’immagine e tienila premuta.';
  }catch(error){if(request===photoRequest)manualPhotoMode();}
}
photoButton.addEventListener('click',async()=>{
  if(!photoWallpaper)return;
  if(!photoFile){window.open(photoWallpaper.image,'_blank','noopener');return;}
  const request=photoRequest;
  photoButton.disabled=true;
  try{
    // No asynchronous work before share(): preserve the user's tap activation.
    await navigator.share({files:[photoFile]});
  }catch(error){
    if(request===photoRequest&&error.name!=='AbortError'){
      manualPhotoMode('Condivisione non disponibile. Tocca di nuovo “Salva in Foto” per aprire l’immagine, poi tienila premuta per salvarla.');
    }
  }finally{if(request===photoRequest)photoButton.disabled=false;}
});
