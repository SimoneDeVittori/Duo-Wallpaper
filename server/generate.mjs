// Run as ONE Node 22+ process with a persistent writable quota directory.
// Prompts and images are never written to disk. Only request counters are persisted.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
const key=process.env.OPENAI_API_KEY;
const origin=process.env.ALLOWED_ORIGIN||'https://simonedevittori.github.io';
const maxDaily=Number(process.env.MAX_DAILY_GENERATIONS||10);
const quotaFile=process.env.QUOTA_FILE;
if(!quotaFile||!Number.isInteger(maxDaily)||maxDaily<1)throw Error('Set QUOTA_FILE and a valid MAX_DAILY_GENERATIONS');
fs.mkdirSync(path.dirname(quotaFile),{recursive:true});
let quota={day:'',count:0,last:0};
if(fs.existsSync(quotaFile)){quota=JSON.parse(fs.readFileSync(quotaFile,'utf8'));if(typeof quota.day!=='string'||!Number.isInteger(quota.count)||quota.count<0||!Number.isFinite(quota.last))throw Error('Invalid quota file');}
let inFlight=false;
function reserve(){const now=Date.now(),day=new Date(now).toISOString().slice(0,10);if(quota.day!==day)quota={day,count:0,last:0};if(inFlight||quota.count>=maxDaily||now-quota.last<60000)return false;const next={day,count:quota.count+1,last:now};fs.writeFileSync(quotaFile+'.tmp',JSON.stringify(next),{mode:0o600});fs.renameSync(quotaFile+'.tmp',quotaFile);quota=next;return true;}
const server=http.createServer(async(req,res)=>{
 const headers={'Content-Type':'application/json','Cache-Control':'no-store','Vary':'Origin'};
 const send=(code,data)=>{res.writeHead(code,headers);res.end(JSON.stringify(data))};
 if(req.url==='/health'&&req.method==='GET'){send(200,{ok:true});return}
 if(req.headers.origin!==origin){send(403,{error:'origin_not_allowed'});return}
 headers['Access-Control-Allow-Origin']=origin;headers['Access-Control-Allow-Methods']='POST, OPTIONS';headers['Access-Control-Allow-Headers']='Content-Type';
 if(req.url==='/status'&&req.method==='GET'){send(200,{ready:Boolean(key)});return}
 if(req.url!=='/generate'){send(404,{error:'not_found'});return}
 if(req.method==='OPTIONS'){send(204,{});return}
 if(req.method!=='POST'){send(405,{error:'method_not_allowed'});return}
 if(!req.headers['content-type']?.startsWith('application/json')){send(415,{error:'json_required'});return}
 if(!key){send(503,{error:'not_configured'});return}
 try {
  const parts=[];let bytes=0;for await(const part of req){bytes+=part.length;if(bytes>12000){send(413,{error:'too_large'});return}parts.push(part)}const body=Buffer.concat(parts).toString('utf8');
  let input;try{input=JSON.parse(body)}catch{send(400,{error:'invalid_json'});return}
  const prompt=typeof input.prompt==='string'?input.prompt.trim():'';
  if(prompt.length<10||prompt.length>1500){send(400,{error:'invalid_prompt'});return}
  if(!reserve()){send(429,{error:'generation_limit'});return}
  inFlight=true;
  try {
   const upstream=await fetch('https://api.openai.com/v1/images/generations',{method:'POST',headers:{'Authorization':'Bearer '+key,'Content-Type':'application/json'},body:JSON.stringify({model:'gpt-image-1',prompt:'Create a landscape wallpaper. Keep the main subject within the central area for a slight crop to aspect ratio 1.4217. No text or watermarks unless explicitly requested. User description: '+prompt,size:'1536x1024',quality:'medium',output_format:'png',n:1}),signal:AbortSignal.timeout(180000)});
   if(!upstream.ok){send(upstream.status===400?422:502,{error:'generation_failed'});return}
   const imageBase64=(await upstream.json()).data?.[0]?.b64_json;
   if(!imageBase64){send(502,{error:'no_image'});return}
   send(200,{imageBase64});
  }finally{inFlight=false}
 }catch{if(!res.headersSent)send(503,{error:'service_unavailable'})}
});
server.requestTimeout=30000;server.headersTimeout=15000;
server.listen(Number(process.env.PORT||8080));
