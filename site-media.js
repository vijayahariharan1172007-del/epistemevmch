/* EPISTEME public media bridge. Reads only the public media registry; never contains admin credentials. */
(()=>{'use strict';
 const cfg=window.EPISTEME_SUPABASE_CONFIG;
 if(!cfg?.url||!cfg?.publishableKey||!window.supabase?.createClient)return;
 const sb=window.supabase.createClient(cfg.url,cfg.publishableKey);
 const bucket='episteme-admin-media';
 const esc=(s)=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 async function run(){
  const {data,error}=await sb.from('episteme_site_media').select('media_key,storage_path,updated_at');
  if(error||!data)return;
  const urls={};
  for(const row of data){const {data:pub}=sb.storage.from(bucket).getPublicUrl(row.storage_path);if(pub?.publicUrl)urls[row.media_key]=pub.publicUrl+'?v='+encodeURIComponent(row.updated_at||'');}
  // ASTRA's existing 15 image cards keep their built-in fallback until an admin replacement exists.
  const astraImgs=[...document.querySelectorAll('.gallery-card img')];
  astraImgs.slice(0,15).forEach((img,i)=>{const url=urls[`astra-${String(i+1).padStart(2,'0')}`];if(url){img.src=url;img.dataset.adminManaged='true';}});
  // Core-member portrait overrides.
  document.querySelectorAll('img.portrait').forEach((img,i)=>{const url=urls[`core-member-${i+1}`];if(url){img.src=url;img.dataset.adminManaged='true';}});
  // ASTRA faculty portrait placeholders.
  document.querySelectorAll('img[data-faculty-key]').forEach(img=>{const url=urls[img.dataset.facultyKey];if(url){img.src=url;img.alt=img.alt||'Faculty portrait';img.closest('[data-faculty-card]')?.classList.add('has-image');}});
  for(let i=1;i<=4;i++){const url=urls[`faculty-${i}`],el=document.getElementById(`wing-faculty-${i}`);if(url&&el)el.innerHTML=`<img src="${esc(url)}" alt="Faculty in-charge ${i}">`;}
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});else run();
})();
