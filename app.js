(function(){
"use strict";
const L=[["en","English","eng"],["ru","Русский","rus"],["uk","Українська","ukr"],["be","Беларуская","bel"],["de","Deutsch","deu"],["fr","Français","fra"],["es","Español","spa"],["it","Italiano","ita"],["pt","Português","por"],["nl","Nederlands","nld"],["pl","Polski","pol"],["cs","Čeština","ces"],["sk","Slovenčina","slk"],["sl","Slovenščina","slv"],["hr","Hrvatski","hrv"],["sr","Српски","srp"],["bg","Български","bul"],["ro","Română","ron"],["hu","Magyar","hun"],["el","Ελληνικά","ell"],["tr","Türkçe","tur"],["ar","العربية","ara"],["he","עברית","heb"],["fa","فارسی","fas"],["hi","हिन्दी","hin"],["bn","বাংলা","ben"],["ur","اردو","urd"],["ta","தமிழ்","tam"],["te","తెలుగు","tel"],["ml","മലയാളം","mal"],["kn","ಕನ್ನಡ","kan"],["mr","मराठी","mar"],["gu","ગુજરાતી","guj"],["pa","ਪੰਜਾਬੀ","pan"],["ne","नेपाली","nep"],["si","සිංහල","sin"],["th","ไทย","tha"],["vi","Tiếng Việt","vie"],["id","Indonesia","ind"],["ms","Melayu","msa"],["tl","Filipino","tgl"],["zh-CN","中文 (简体)","chi_sim"],["zh-TW","中文 (繁體)","chi_tra"],["ja","日本語","jpn"],["ko","한국어","kor"],["my","မြန်မာ","mya"],["km","ខ្មែរ","khm"],["lo","ລາວ","lao"],["mn","Монгол","mon"],["kk","Қазақша","kaz"],["uz","Oʻzbek","uzb"],["az","Azərbaycan","aze"],["ka","ქართული","kat"],["hy","Հայերեն","hye"],["fi","Suomi","fin"],["sv","Svenska","swe"],["no","Norsk","nor"],["da","Dansk","dan"],["is","Íslenska","isl"],["et","Eesti","est"],["lv","Latviešu","lav"],["lt","Lietuvių","lit"],["sq","Shqip","sqi"],["mk","Македонски","mkd"],["mt","Malti","mlt"],["ga","Gaeilge","gle"],["cy","Cymraeg","cym"],["ca","Català","cat"],["eu","Euskara","eus"],["gl","Galego","glg"],["la","Latina","lat"],["af","Afrikaans","afr"],["sw","Kiswahili","swa"]];
const $=id=>document.getElementById(id);
const src=$("src"),dst=$("dst");
src.add(new Option("Авто-определение","auto"));
L.forEach(l=>{src.add(new Option(l[1],l[0]));dst.add(new Option(l[1],l[0]))});
const store={get(k,d){try{const v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(e){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
const S=Object.assign({local:true,key:"",dsKey:"",ocr:"best"},store.get("lingo.set",{})),saveS=()=>store.set("lingo.set",S);
const sv=store.get("lingo.l2",{s:"auto",d:"ru"});
src.value=[...src.options].some(o=>o.value===sv.s)?sv.s:"auto";
dst.value=L.some(l=>l[0]===sv.d)?sv.d:"ru";
const saveLangs=()=>store.set("lingo.l2",{s:src.value,d:dst.value});
const name=c=>c==="auto"?"Авто":(L.find(l=>l[0]===c)||[])[1]||c;
// языки для распознавания: родной + английский для смешанных текстов
let lastDet=store.get("lingo.det","");
function ocrLang(){const c=src.value;if(c==="auto"){const d=(L.find(l=>l[0]===lastDet)||[])[2];return d&&d!=="eng"&&d!=="rus"?"eng+rus+"+d:"eng+rus"}const t=(L.find(l=>l[0]===c)||[])[2]||"eng";return t}
let tt;function toast(m){const t=$("toast");t.textContent=m;t.classList.add("on");clearTimeout(tt);tt=setTimeout(()=>t.classList.remove("on"),2400)}

/* тема */
const root=document.documentElement;
root.dataset.theme=store.get("lingo.theme",matchMedia("(prefers-color-scheme:dark)").matches?"dark":"light");
$("theme").onclick=e=>{const apply=()=>{const n=root.dataset.theme==="dark"?"light":"dark";root.dataset.theme=n;store.set("lingo.theme",n);const m=document.querySelector('meta[name=theme-color]');if(m)m.content=n==="dark"?"#1B1A18":"#FAF9F5"};
 if(!document.startViewTransition||matchMedia("(prefers-reduced-motion:reduce)").matches){apply();return}
 const r=e.currentTarget.getBoundingClientRect(),x=r.left+r.width/2,y=r.top+r.height/2,R=Math.hypot(Math.max(x,innerWidth-x),Math.max(y,innerHeight-y));
 document.startViewTransition(apply).ready.then(()=>root.animate({clipPath:["circle(0px at "+x+"px "+y+"px)","circle("+R+"px at "+x+"px "+y+"px)"]},{duration:700,easing:"cubic-bezier(.2,.8,.2,1)",pseudoElement:"::view-transition-new(root)"})).catch(()=>{})};
/* волна на кнопках */
document.addEventListener("pointerdown",e=>{const b=e.target.closest(".btn,.swap");if(!b)return;const r=b.getBoundingClientRect(),d=Math.max(r.width,r.height),s=document.createElement("span");s.className="rip";s.style.cssText="width:"+d+"px;height:"+d+"px;left:"+(e.clientX-r.left-d/2)+"px;top:"+(e.clientY-r.top-d/2)+"px";b.appendChild(s);setTimeout(()=>s.remove(),650)});
/* вкладки */
const tabs=[...document.querySelectorAll(".tab")];
const pill=$("pill");
function movePill(){const a=document.querySelector(".tab.active");if(!a)return;pill.style.left=a.offsetLeft+"px";pill.style.top=a.offsetTop+"px";pill.style.width=a.offsetWidth+"px";pill.style.height=a.offsetHeight+"px"}
addEventListener("resize",movePill);addEventListener("load",movePill);if(document.fonts&&document.fonts.ready)document.fonts.ready.then(movePill);setTimeout(movePill,60);
tabs.forEach(t=>t.onclick=()=>{const ci=tabs.findIndex(x=>x.classList.contains("active")),ni=tabs.indexOf(t);root.style.setProperty("--dir",ni>=ci?1:-1);tabs.forEach(x=>x.classList.toggle("active",x===t));movePill();document.querySelectorAll(".panel").forEach(p=>p.classList.toggle("show",p.id===t.dataset.tab));if(t.dataset.tab==="history")renderHist();scrollTo({top:0,behavior:"smooth"})});

/* ПЕРЕВОД: быстрый движок, куски идут параллельно */
function split(t,max=1500){const out=[];let cur="";t.split("\n").forEach(line=>{while(line.length>max){if(cur){out.push(cur);cur=""}out.push(line.slice(0,max));line=line.slice(max)}
 if((cur+"\n"+line).length>max){out.push(cur);cur=line}else cur=cur?cur+"\n"+line:line});if(cur)out.push(cur);return out}
const lg=c=>({"zh-CN":"zh","zh-TW":"zh_HANT",he:"iw"})[c]||c;
const ENG=[
 async(q,f,t)=>{const r=await fetch("https://translate.googleapis.com/translate_a/single?client=gtx&sl="+f+"&tl="+t+"&dt=t&q="+encodeURIComponent(q));if(!r.ok)throw 0;const j=await r.json();return {text:j[0].map(x=>x[0]||"").join(""),lang:j[2]}},
 async(q,f,t)=>{const r=await fetch("https://clients5.google.com/translate_a/t?client=dict-chrome-ex&dj=1&sl="+f+"&tl="+t+"&q="+encodeURIComponent(q));if(!r.ok)throw 0;const j=await r.json();return {text:j.sentences.map(s=>s.trans||"").join(""),lang:j.src}},
 async(q,f,t)=>{const r=await fetch("https://lingva.ml/api/v1/"+lg(f)+"/"+lg(t)+"/"+encodeURIComponent(q));if(!r.ok)throw 0;const j=await r.json();if(!j.translation)throw 0;return {text:j.translation}},
 async(q,f,t)=>{const out=[];for(let i=0;i<q.length;i+=450){const r=await fetch("https://api.mymemory.translated.net/get?q="+encodeURIComponent(q.slice(i,i+450))+"&langpair="+(f==="auto"?"Autodetect":f)+"|"+t);const j=await r.json();if(String(j.responseStatus)!=="200")throw 0;out.push(j.responseData.translatedText)}return {text:out.join(" ")}}];
const NAMES=["Google","Google 2","Lingva","MyMemory"];
const LOC=typeof self!=="undefined"&&"Translator" in self,trC={};
const bc=c=>({"zh-CN":"zh","zh-TW":"zh-Hant"})[c]||c;
async function localEng(q,f,t){if(f==="auto")throw 0;const k=f+">"+t;
 if(trC[k]===undefined){try{const o={sourceLanguage:bc(f),targetLanguage:bc(t)};trC[k]=(await self.Translator.availability(o))==="available"?await self.Translator.create(o):false}catch(e){trC[k]=false}}
 if(!trC[k])throw 0;return {text:await trC[k].translate(q)}}
async function officialEng(q,f,t){const r=await fetch("https://translation.googleapis.com/language/translate/v2?key="+encodeURIComponent(S.key),{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(Object.assign({q,target:t,format:"text"},f==="auto"?{}:{source:f}))});
 if(!r.ok)throw 0;const o=(await r.json()).data.translations[0];return {text:o.translatedText,lang:o.detectedSourceLanguage}}
async function deepseekEng(q,f,t){
 const srcN=f==="auto"?"the source language (auto-detect)":(name(f)||f),dstN=name(t)||t;
 const r=await fetch("https://api.deepseek.com/chat/completions",{method:"POST",headers:{"Content-Type":"application/json","Authorization":"Bearer "+S.dsKey},body:JSON.stringify({model:"deepseek-chat",temperature:.1,messages:[{role:"system",content:"You are a professional translator. Translate the user's text from "+srcN+" to "+dstN+". Output ONLY the translation — no quotes, no explanations, no notes."},{role:"user",content:q}]})});
 if(!r.ok)throw 0;const j=await r.json();const text=(j.choices&&j.choices[0]&&j.choices[0].message&&j.choices[0].message.content||"").trim();if(!text)throw 0;return {text}}
/* Index-Translate — бесплатная нейросеть Bilibili, 150 языков, без ключа */
async function indexEng(q,f,t){
 const srcN=f==="auto"?"auto-detected language":(name(f)||f),dstN=name(t)||t;
 const prompt="Translate the following text from "+srcN+" to "+dstN+". Output ONLY the translation, nothing else.\n\n"+q;
 const r=await fetch("https://index-translate.bilibili.com/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"Index-Translate-35B-A3B",temperature:.1,messages:[{role:"user",content:prompt}]})});
 if(!r.ok)throw 0;const j=await r.json();const text=(j.choices&&j.choices[0]&&j.choices[0].message&&j.choices[0].message.content||"").trim();if(!text)throw 0;return {text}}
async function translate(text,from,to){
 text=text.trim();if(!text)return {text:""};
 if(from===to)return {text,engine:""};
 const parts=split(text),list=[];let det,used=0;
 if(S.dsKey)list.push(["DeepSeek",deepseekEng]);
 if(S.key)list.push(["Google Cloud",officialEng]);
 list.push(["Index-Translate",indexEng]); // бесплатная нейросеть, без ключа
 if(S.local&&LOC)list.push(["на устройстве",localEng]);
 ENG.forEach((f,i)=>list.push([NAMES[i],f]));
 const res=await Promise.all(parts.map(async p=>{
  if(!p.trim())return p;
  let same=null;
  for(let i=0;i<list.length;i++){try{const o=await list[i][1](p,from,to);if(!o.text)throw 0;
   if(o.text.trim()===p.trim()&&p.length>12&&/\p{L}{3}/u.test(p)&&i<list.length-1){same=same||[o,i];continue}
   det=det||o.lang;used=Math.max(used,i);return o.text}catch(e){}}
  if(same){det=det||same[0].lang;used=Math.max(used,same[1]);return same[0].text}
  throw new Error("сервисы перевода недоступны — проверьте интернет")}));
 return {text:res.join("\n").replace(/\n{3,}/g,"\n\n").trim(),lang:det,engine:list[used][0]}}
/* склеиваем строки одного предложения — так перевод точнее */
function joinLines(t){return t.split(/\n{2,}/).map(p=>{let a="";p.split("\n").forEach(l=>{l=l.trim();if(!l)return;if(!a){a=l;return}
 const last=a.slice(a.lastIndexOf("\n")+1);const sentEnd=/[.!?:;。！？…»”)]$/.test(last),low=l[0]!==l[0].toUpperCase();
 a+=(!sentEnd&&(low||last.length>40))?" "+l:"\n"+l});return a}).join("\n\n")}
function setRes(el,t,ph,anim){el.classList.toggle("empty-r",!t);
 if(!t){el.textContent=ph;return}
 if(!anim){el.textContent=t;return}
 el.textContent="";let i=0;t.split(/(\s+)/).forEach(p=>{if(!p)return;const s=document.createElement("span");s.textContent=p;if(/\S/.test(p)){s.className="w";s.style.animationDelay=Math.min(i++*35,1400)+"ms"}else s.style.whiteSpace="pre-wrap";el.appendChild(s)})}
function skel(el){el.classList.remove("empty-r");el.innerHTML='<i class="sk"></i><i class="sk"></i><i class="sk"></i>'}
function burst(el){for(let i=0;i<14;i++){const s=document.createElement("span");s.className="sp";s.textContent="✺";const a=Math.random()*6.28,d=50+Math.random()*70;s.style.setProperty("--dx",Math.cos(a)*d+"px");s.style.setProperty("--dy",Math.sin(a)*d-20+"px");s.style.fontSize=8+Math.random()*12+"px";el.appendChild(s);setTimeout(()=>s.remove(),1000)}}
function addHist(a,b,s){const h=store.get("lingo.hist",[]),p=h[0];
 if(p&&!p.f&&p.d===dst.value&&Date.now()-p.t<120000&&(a.startsWith(p.a)||p.a.startsWith(a)))h.shift();
 h.unshift({s,d:dst.value,a:a.slice(0,300),b:b.slice(0,300),t:Date.now()});store.set("lingo.hist",h.filter((x,i)=>i<40||x.f))}

/* ФОТО: сжатие + ч/б + контраст, затем распознавание быстрыми моделями */
/* УЛУЧШЕНИЕ РАСПОЗНАВАНИЯ: адаптивная бинаризация (Bradley) и очистка текста */
function bradley(p,w,h,q,thr){const W=w+1,I=new Uint32Array(W*(h+1)),t=thr||.88;
 for(let y=0;y<h;y++){let row=0;for(let i=0;i<w;i++){row+=p[(y*w+i)*4];I[(y+1)*W+i+1]=I[y*W+i+1]+row}}
 const r=Math.max(10,w>>5);
 for(let y=0;y<h;y++){const y0=Math.max(0,y-r),y1=Math.min(h-1,y+r);for(let i=0;i<w;i++){const x0=Math.max(0,i-r),x1=Math.min(w-1,i+r),n=(x1-x0+1)*(y1-y0+1),sum=I[(y1+1)*W+x1+1]-I[y0*W+x1+1]-I[(y1+1)*W+x0]+I[y0*W+x0],k=(y*w+i)*4,v=p[k]*n<sum*t?0:255;q[k]=q[k+1]=q[k+2]=v;q[k+3]=255}}}
function canvasToBlob(c,type){return new Promise((ok,fail)=>c.toBlob(b=>b?ok(b):fail(new Error("blob")),type||"image/png"))}
function binBlob(c,thr){return new Promise((ok,fail)=>{const w=c.width,h=c.height,d=c.getContext("2d").getImageData(0,0,w,h),out=document.createElement("canvas");out.width=w;out.height=h;
 const ox=out.getContext("2d"),od=ox.createImageData(w,h);bradley(d.data,w,h,od.data,thr);ox.putImageData(od,0,0);out.toBlob(b=>b?ok(b):fail(new Error("bin")),"image/png")})}
/* усиление резкости (unsharp) для мелкого текста */
function sharpen(c){const w=c.width,h=c.height,x=c.getContext("2d"),d=x.getImageData(0,0,w,h),p=d.data,out=new Uint8ClampedArray(p),k=[0,-1,0,-1,5,-1,0,-1,0];
 for(let y=1;y<h-1;y++)for(let i=1;i<w-1;i++){let s=0;for(let ky=-1;ky<=1;ky++)for(let kx=-1;kx<=1;kx++)s+=p[((y+ky)*w+i+kx)*4]*k[(ky+1)*3+kx+1];const v=Math.max(0,Math.min(255,s|0)),o=(y*w+i)*4;out[o]=out[o+1]=out[o+2]=v}
 const id=new ImageData(out,w,h);x.putImageData(id,0,0);return c}
function cleanOcr(t){
 t=t.replace(/\r/g,"").replace(/(\p{L})[-\u00AD]\n(\p{Ll})/gu,"$1$2").replace(/[ \t]+/g," ");
 return t.split("\n").map(l=>l.trim()).filter(l=>{
  if(!l)return true;
  const a=(l.match(/[\p{L}\p{N}]/gu)||[]).length;
  if(a<2||a/l.length<.35)return false;
  const weird=(l.match(/[$%@#^&*=_|\\{}[\]]/g)||[]).length;
  return weird/l.length<.25
 }).join("\n").replace(/\n{3,}/g,"\n\n").trim()}
function prep(file){return new Promise((ok,fail)=>{const tmp=URL.createObjectURL(file),img=new Image();
 img.onload=()=>{let w=img.naturalWidth,h=img.naturalHeight;const m=Math.max(w,h);
  // для OCR: оптимальный размер 1600–2000px по длинной стороне; не апскейлим сильно
  const k=m>2000?2000/m:(m<900?Math.min(1.6,1200/m):1);w=Math.round(w*k);h=Math.round(h*k);
  const c=document.createElement("canvas");c.width=w;c.height=h;const x=c.getContext("2d");x.imageSmoothingQuality="high";x.drawImage(img,0,0,w,h);
  // цветная копия для превью/оверлея
  const cc=document.createElement("canvas");cc.width=w;cc.height=h;cc.getContext("2d").drawImage(c,0,0);
  try{const d=x.getImageData(0,0,w,h),p=d.data;let lo=255,hi=0,sum=0,n=0;
   for(let i=0;i<p.length;i+=4){const g=(p[i]*.299+p[i+1]*.587+p[i+2]*.114)|0;p[i]=g;if(g<lo)lo=g;if(g>hi)hi=g;sum+=g;n++}
   // растягиваем контраст + лёгкая гамма для тёмных фото
   const mean=sum/n,s=255/Math.max(1,hi-lo);
   for(let i=0;i<p.length;i+=4){let g=Math.max(0,Math.min(255,(p[i]-lo)*s));
    if(mean<110)g=Math.min(255,Math.pow(g/255,.75)*255)|0; // осветляем тёмные
    p[i]=p[i+1]=p[i+2]=g}
   x.putImageData(d,0,0);sharpen(c)}catch(e){}
  URL.revokeObjectURL(tmp);
  const colorUrl=cc.toDataURL("image/jpeg",.92);
  c.toBlob(b=>b?ok({blob:b,url:colorUrl,color:cc,gray:c}):fail(new Error("Не удалось обработать фото")),"image/png")};
 img.onerror=()=>{URL.revokeObjectURL(tmp);fail(new Error("Не удалось открыть изображение"))};img.src=tmp})}
let curFile=null;
let worker=null,workerLang="",progressCb=null,busy=false;
async function getWorker(lang){const key=lang+"|"+S.ocr;
 if(worker&&workerLang===key)return worker;
 if(worker){try{await worker.terminate()}catch(e){}worker=null}
 const o={logger:m=>{if(progressCb)progressCb(m)}};
 if(S.ocr==="fast")o.langPath="https://cdn.jsdelivr.net/gh/naptha/tessdata@gh-pages/4.0.0_fast";
 worker=await Tesseract.createWorker(lang,1,o);workerLang=key;return worker}
const prev=$("preview"),stage=$("stage"),empty=$("empty"),scan=$("scan"),bar=$("bar"),barWrap=$("barWrap"),status=$("status");
function setStatus(t,load){status.textContent=t;status.classList.toggle("dots",!!load)}
async function handleFile(f){
 if(!f||!/^image\//.test(f.type)){toast("Выберите изображение");return}
 if(busy){toast("Подождите, идёт обработка");return}
 busy=true;curFile=f;const t0=Date.now();
 stage.hidden=false;empty.hidden=true;$("imgTools").hidden=false;scan.hidden=false;barWrap.hidden=false;bar.style.width="4%";
 try{
  if(typeof Tesseract==="undefined")throw new Error("Не загрузился модуль распознавания — проверьте интернет");
  setStatus("Подготавливаю фото",true);
  const p=await prep(f);prev.src=p.url;bar.style.width="10%";
  setStatus("Загружаю языковую модель (только в первый раз)",true);
  const w=await getWorker(ocrLang());
  progressCb=m=>{if(m.status==="recognizing text"){bar.style.width=(15+m.progress*65)+"%";setStatus("Распознаю текст",true)}};
  // несколько проходов: оригинал → бинаризация → другая сегментация
  let r=await w.recognize(p.blob);
  if(r.data.confidence<72){setStatus("Уточняю распознавание",true);
   let bin88=null,bin82=null;
   try{bin88=await binBlob(p.gray,.88)}catch(e){}
   try{bin82=await binBlob(p.gray,.82)}catch(e){}
   const tries=[[p.blob,"6"],[p.blob,"3"],[p.blob,"4"],[bin88,"6"],[bin88,"3"],[bin82,"6"],[bin82,"11"]];
   for(const [b,psm] of tries){if(!b||r.data.confidence>=80)break;
    try{await w.setParameters({tessedit_pageseg_mode:psm});const r2=await w.recognize(b);
     if((r2.data.confidence||0)>(r.data.confidence||0))r=r2}catch(e){}}
   try{await w.setParameters({tessedit_pageseg_mode:"3"})}catch(e){}}
  progressCb=null;lastConf=r.data.confidence||0;lastOcr={lines:r.data.lines||[],color:p.color,orig:p.url};resetSeg();
  const txt=cleanOcr(r.data.text||"");
  $("ocrOut").value=txt;if(src.value==="auto"&&lastConf<60){src.classList.add("nudge");setTimeout(()=>src.classList.remove("nudge"),3000)}
  if(!txt){setRes($("photoRes"),"","Перевод появится здесь");setStatus("Текст не найден. Выберите язык фото вместо «Авто», снимите крупнее или выделите область.");return}
  await photoTranslate(t0);
 }catch(e){setStatus("Ошибка: "+e.message);toast("Не получилось, попробуйте ещё раз")}
 finally{busy=false;progressCb=null;scan.hidden=true;setTimeout(()=>{barWrap.hidden=true},500)}}
async function photoTranslate(t0){
 const txt=$("ocrOut").value.trim();if(!txt){toast("Нет текста для перевода");return}
 setStatus("Перевожу",true);bar.style.width="85%";barWrap.hidden=false;skel($("photoRes"));
 try{const o=await translate(joinLines(txt),src.value,dst.value);bar.style.width="100%";setRes($("photoRes"),o.text,"",true);burst($("photoRes"));if(src.value==="auto"&&o.lang&&L.some(l=>l[0]===o.lang)){lastDet=o.lang;store.set("lingo.det",lastDet)}
  setStatus("Готово за "+(((Date.now()-(t0||Date.now()))/1000)|0)+" с"+(o.lang&&src.value==="auto"?" · язык: "+name(o.lang):"")+(o.engine?" · "+o.engine:"")+" ✓"+(lastConf&&lastConf<60?" · фото нечёткое: "+(src.value==="auto"?"выберите язык фото вручную, ":"")+"снимите ближе при хорошем свете или поправьте текст ниже":""));buildOverlay().catch(()=>{});
  addHist(txt,o.text,src.value);
 }catch(e){setRes($("photoRes"),"","Перевод появится здесь");setStatus("Ошибка перевода: "+e.message)}}

/* ПЕРЕВОД ПРЯМО НА ФОТО */
let lastOcr=null,ovlUrl=null,lastConf=0;
const seg=$("seg");
function resetSeg(){seg.hidden=true;if(ovlUrl){try{URL.revokeObjectURL(ovlUrl)}catch(_){}ovlUrl=null}
 seg.querySelectorAll("button[data-v]").forEach(b=>b.classList.toggle("on",b.dataset.v==="orig"))}
function showSeg(v){if(!lastOcr)return;seg.querySelectorAll("button[data-v]").forEach(b=>b.classList.toggle("on",b.dataset.v===v));
 const srcUrl=(v==="ovl"&&ovlUrl)?ovlUrl:lastOcr.orig;
 if(prev.src!==srcUrl){prev.src=srcUrl;stage.classList.remove("flash");void stage.offsetWidth;stage.classList.add("flash")}}
async function buildOverlay(){
 if(!lastOcr||lastConf<45)return;
 const imgW=lastOcr.color.width,imgH=lastOcr.color.height,area=imgW*imgH;
 // только уверенные строки разумного размера (не мусор на весь кадр)
 const lines=lastOcr.lines.filter(l=>{
  if(!l.text||!l.bbox||l.confidence<40)return false;
  const t=l.text.replace(/\s+/g," ").trim();if(t.length<2)return false;
  const w=l.bbox.x1-l.bbox.x0,h=l.bbox.y1-l.bbox.y0;
  if(w<12||h<8||w*h>area*.35)return false;
  const letters=(t.match(/[\p{L}\p{N}]/gu)||[]).length;return letters>=2&&letters/t.length>=.35
 }).slice(0,50);
 if(!lines.length)return;
 const texts=lines.map(l=>l.text.replace(/\s+/g," ").trim());let tr;
 try{const o=await translate(texts.join("\n"),src.value,dst.value);tr=o.text.split("\n");if(tr.length!==texts.length)throw 0}
 catch(e){tr=await Promise.all(texts.map(t=>translate(t,src.value,dst.value).then(o=>o.text).catch(()=>t)))}
 const s0=lastOcr.color,c=document.createElement("canvas");c.width=s0.width;c.height=s0.height;
 const x=c.getContext("2d"),px=s0.getContext("2d");x.drawImage(s0,0,0);
 lines.forEach((l,i)=>{const b=l.bbox,w=b.x1-b.x0,h=b.y1-b.y0,t=(tr[i]||"").trim();if(w<8||h<6||!t)return;
  const pad=Math.max(2,h*.14);let R=0,G=0,B=0,n=0;
  [[b.x0-3,b.y0-3],[b.x1+3,b.y0-3],[b.x0-3,b.y1+3],[b.x1+3,b.y1+3],[b.x0-3,(b.y0+b.y1)/2],[b.x1+3,(b.y0+b.y1)/2]].forEach(q=>{const sx=Math.max(0,Math.min(c.width-1,q[0]|0)),sy=Math.max(0,Math.min(c.height-1,q[1]|0)),d=px.getImageData(sx,sy,1,1).data;R+=d[0];G+=d[1];B+=d[2];n++});
  R=R/n|0;G=G/n|0;B=B/n|0;x.fillStyle="rgb("+R+","+G+","+B+")";x.fillRect(b.x0-pad,b.y0-pad,w+pad*2,h+pad*2);
  x.fillStyle=(.299*R+.587*G+.114*B)>140?"#111":"#fff";
  let fs=h*.92;x.font="600 "+fs+"px system-ui,sans-serif";
  while(x.measureText(t).width>w+pad*2&&fs>8){fs-=1;x.font="600 "+fs+"px system-ui,sans-serif"}
  x.textBaseline="middle";x.fillText(t,b.x0,(b.y0+b.y1)/2)});
 c.toBlob(b=>{if(!b||!lastOcr)return;if(ovlUrl)try{URL.revokeObjectURL(ovlUrl)}catch(_){}
  ovlUrl=URL.createObjectURL(b);seg.hidden=false;showSeg("orig");toast("Можно переключить «Перевод на фото»")},"image/png")}
seg.onclick=e=>{const b=e.target.closest("button");if(!b)return;
 if(b.id==="dl"){if(!ovlUrl)return;const a=document.createElement("a");a.href=ovlUrl;a.download="lingo-translation.png";a.click();return}
 showSeg(b.dataset.v)};

$("btnFile").onclick=()=>$("fileGal").click();
["fileCam","fileGal"].forEach(id=>$(id).onchange=e=>{handleFile(e.target.files[0]);e.target.value=""});
$("btnClear").onclick=()=>{if(busy)return;lastOcr=null;resetSeg();prev.removeAttribute("src");stage.hidden=true;empty.hidden=false;$("imgTools").hidden=true;curFile=null;$("ocrOut").value="";setRes($("photoRes"),"","Перевод появится здесь");setStatus("")};
$("reTr").onclick=async()=>{if(busy)return;busy=true;try{await photoTranslate()}finally{busy=false}};
const drop=$("drop");
drop.onclick=()=>{if(!empty.hidden)$("fileGal").click()};
["dragenter","dragover"].forEach(ev=>drop.addEventListener(ev,e=>{e.preventDefault();drop.classList.add("over")}));
["dragleave","drop"].forEach(ev=>drop.addEventListener(ev,e=>{e.preventDefault();drop.classList.remove("over")}));
drop.addEventListener("drop",e=>handleFile(e.dataTransfer.files[0]));
addEventListener("paste",e=>{const it=[...(e.clipboardData?e.clipboardData.items:[])].find(i=>i.type.startsWith("image/"));if(it)handleFile(it.getAsFile())});

/* ТЕКСТ: автоперевод с задержкой */
let dt,seq=0;
async function textTranslate(){
 const t=$("txtIn").value,my=++seq;
 if(!t.trim()){setRes($("txtRes"),"","Перевод появится здесь");return}
 $("txtRes").classList.remove("empty-r");
 try{const o=await translate(t,src.value,dst.value);if(my!==seq)return;setRes($("txtRes"),o.text,"");addHist(t,o.text,src.value)}
 catch(e){if(my===seq)$("txtRes").textContent="Ошибка: "+e.message}}
$("txtIn").addEventListener("input",()=>{clearTimeout(dt);dt=setTimeout(textTranslate,700)});
$("btnTxtClear").onclick=()=>{$("txtIn").value="";seq++;setRes($("txtRes"),"","Перевод появится здесь")};
const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
$("btnMic").onclick=()=>{if(!SR){toast("Голосовой ввод не поддерживается этим браузером");return}
 const r=new SR();r.lang=src.value==="auto"?navigator.language:src.value;
 r.onresult=e=>{const a=$("txtIn");a.value+=(a.value?" ":"")+e.results[0][0].transcript;textTranslate()};
 r.onerror=()=>toast("Не удалось распознать речь");r.start();toast("Говорите…")};

/* смена языков */
let rec=store.get("lingo.rec",["en","ru","de","es","fr"]);
function renderChips(){$("chips").innerHTML=rec.map(c=>`<button class="chip${c===dst.value?" on":""}" data-c="${c}">${name(c)}</button>`).join("")}
function pushRec(){rec=[dst.value,...rec.filter(c=>c!==dst.value)].slice(0,6);store.set("lingo.rec",rec);renderChips()}
const langChanged=()=>{saveLangs();pushRec();if($("txtIn").value.trim())textTranslate();if($("ocrOut").value.trim()&&!busy){busy=true;photoTranslate().finally(()=>{busy=false})}};
src.onchange=dst.onchange=langChanged;
$("chips").onclick=e=>{const b=e.target.closest(".chip");if(!b)return;dst.value=b.dataset.c;langChanged()};
$("swap").onclick=function(){this.classList.toggle("rot");if(src.value==="auto"){toast("Выберите язык слева, чтобы поменять");return}const s=src.value;src.value=dst.value;dst.value=s;saveLangs();[[src,"fl-l"],[dst,"fl-r"]].forEach(([e,c])=>{e.classList.remove("fl-l","fl-r");void e.offsetWidth;e.classList.add(c)});langChanged()};

/* кнопки результата */
document.addEventListener("click",async e=>{const b=e.target.closest("[data-act]");if(!b)return;b.classList.add("ok");setTimeout(()=>b.classList.remove("ok"),900);
 const el=$(b.dataset.from),t=el.classList.contains("empty-r")?"":el.textContent.trim();if(!t){toast("Пока нечего "+(b.dataset.act==="copy"?"копировать":"выбрать"));return}
 if(b.dataset.act==="back"){const card=b.closest(".card");let bk=card.querySelector(".back");if(!bk){bk=document.createElement("div");bk.className="back";card.appendChild(bk)}
  bk.innerHTML='<i class="sk"></i><i class="sk"></i>';
  try{const o=await translate(t,dst.value,src.value==="auto"?(lastDet||"en"):src.value);bk.innerHTML="<small>Обратный перевод — так получателя поймут на исходном языке:</small>";const q=document.createElement("p");q.setAttribute("dir","auto");q.textContent=o.text;bk.appendChild(q)}
  catch(err){bk.textContent="Не удалось проверить — нет связи с сервисом"}return}
 if(b.dataset.act==="copy"){try{await navigator.clipboard.writeText(t)}catch(_){const a=document.createElement("textarea");a.value=t;document.body.appendChild(a);a.select();document.execCommand("copy");a.remove()}toast("Скопировано ✓")}
 else if(b.dataset.act==="speak"){if(!("speechSynthesis"in window)){toast("Озвучка недоступна");return}speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(t);u.lang=({tl:"fil-PH",he:"he-IL",no:"nb-NO"})[dst.value]||dst.value;speechSynthesis.speak(u)}
 else if(navigator.share){try{await navigator.share({text:t})}catch(_){}}
 else{try{await navigator.clipboard.writeText(t);toast("Скопировано — вставьте куда нужно")}catch(_){toast("Поделиться нельзя")}}});

/* история */
const esc=s=>s.replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
let hq="";
function renderHist(){const all=store.get("lingo.hist",[]);
 const it=all.map((x,i)=>({x,i})).filter(o=>!hq||(o.x.a+" "+o.x.b).toLowerCase().includes(hq)).sort((p,q)=>(q.x.f?1:0)-(p.x.f?1:0));
 $("histList").innerHTML=it.length?it.map((o,k)=>{const x=o.x;return `<div class="hi" data-i="${o.i}" style="animation-delay:${Math.min(k*45,600)}ms"><button class="star${x.f?" on":""}" aria-label="Избранное">${x.f?"★":"☆"}</button><small>${esc(name(x.s))} → ${esc(name(x.d))} · ${new Date(x.t).toLocaleString()}</small><p>${esc(x.a)}</p><p>${esc(x.b)}</p></div>`}).join(""):'<p class="status">'+(hq?"Ничего не найдено":"Пока пусто")+'</p>'}
$("hq").oninput=e=>{hq=e.target.value.trim().toLowerCase();renderHist()};
$("histList").onclick=e=>{const d=e.target.closest(".hi");if(!d)return;const h=store.get("lingo.hist",[]),x=h[+d.dataset.i];if(!x)return;
 if(e.target.closest(".star")){x.f=!x.f;store.set("lingo.hist",h);renderHist();return}
 src.value=[...src.options].some(o=>o.value===x.s)?x.s:"auto";dst.value=x.d;$("txtIn").value=x.a;setRes($("txtRes"),x.b,"");cnt();tabs[1].click()};
$("histExp").onclick=()=>{const h=store.get("lingo.hist",[]);if(!h.length){toast("История пуста");return}
 const t=h.map(x=>name(x.s)+" → "+name(x.d)+"\n"+x.a+"\n"+x.b).join("\n\n---\n\n"),a=document.createElement("a");a.href=URL.createObjectURL(new Blob([t],{type:"text/plain;charset=utf-8"}));a.download="lingo-history.txt";document.body.appendChild(a);a.click();a.remove()};
$("histClear").onclick=()=>{store.set("lingo.hist",[]);renderHist();toast("История очищена")};
/* ЖИВАЯ КАМЕРА + LIVE-перевод */
const cam=$("cam"),vid=$("vid"),liveBtn=$("liveBtn"),livecap=$("livecap");let stream=null,live=false,liveT=0,lastLive="";
function closeCam(){live=false;clearTimeout(liveT);liveBtn.classList.remove("on");livecap.hidden=true;if(stream){stream.getTracks().forEach(t=>t.stop());stream=null}vid.srcObject=null;cam.hidden=true}
$("btnCam").onclick=async()=>{
 if(matchMedia("(pointer:coarse)").matches||!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia){$("fileCam").click();return}
 try{stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:"environment"},width:{ideal:1920}}});vid.srcObject=stream;cam.hidden=false}
 catch(e){toast("Нет доступа к камере — выберите файл");$("fileCam").click()}};
$("camClose").onclick=closeCam;
addEventListener("keydown",e=>{if(e.key==="Escape"&&!cam.hidden)closeCam()});
$("shutter").onclick=()=>{if(!vid.videoWidth)return;const c=document.createElement("canvas");c.width=vid.videoWidth;c.height=vid.videoHeight;c.getContext("2d").drawImage(vid,0,0);
 const f=document.createElement("div");f.style.cssText="position:fixed;inset:0;background:#fff;z-index:60;pointer-events:none;animation:flash .4s forwards";document.body.appendChild(f);setTimeout(()=>f.remove(),450);
 c.toBlob(b=>{closeCam();if(b)handleFile(new File([b],"shot.jpg",{type:"image/jpeg"}))},"image/jpeg",.95)};
async function liveTick(){
 if(!live)return;
 if(cam.hidden||!vid.videoWidth){liveT=setTimeout(liveTick,500);return}
 try{const w=await getWorker(ocrLang()),k=Math.min(1,1100/vid.videoWidth),c=document.createElement("canvas");c.width=vid.videoWidth*k;c.height=vid.videoHeight*k;c.getContext("2d").drawImage(vid,0,0,c.width,c.height);
  const r=await w.recognize(c),txt=(r.data.text||"").trim();
  if(live&&txt.length>2&&r.data.confidence>50&&txt!==lastLive){lastLive=txt;const o=await translate(joinLines(txt),src.value,dst.value);if(live){livecap.hidden=false;livecap.textContent=o.text}}
 }catch(e){}
 if(live)liveT=setTimeout(liveTick,300)}
liveBtn.onclick=()=>{live=!live;liveBtn.classList.toggle("on",live);if(live){livecap.hidden=false;livecap.textContent="Наведите камеру на текст…";lastLive="";toast("LIVE: перевод в реальном времени");liveTick()}else{clearTimeout(liveT);livecap.hidden=true}};
/* указатель: подсветка карточек, параллакс фона, магнитные кнопки; RTL-языки */
["photoRes","txtRes","ocrOut","txtIn"].forEach(id=>$(id).setAttribute("dir","auto"));
if(matchMedia("(hover:hover)").matches){let raf=0;
 document.addEventListener("pointermove",e=>{if(raf)return;raf=requestAnimationFrame(()=>{raf=0;
  root.style.setProperty("--px",(e.clientX/innerWidth-.5).toFixed(3));root.style.setProperty("--py",(e.clientY/innerHeight-.5).toFixed(3));
  const cd=e.target.closest&&e.target.closest(".card");if(cd){const r=cd.getBoundingClientRect();cd.style.setProperty("--mx",e.clientX-r.left+"px");cd.style.setProperty("--my",e.clientY-r.top+"px")}
  const b=e.target.closest&&e.target.closest(".btn.primary");if(b){const r=b.getBoundingClientRect();b.style.translate=((e.clientX-r.left-r.width/2)*.12)+"px "+((e.clientY-r.top-r.height/2)*.25)+"px"}})});
 document.addEventListener("pointerout",e=>{const b=e.target.closest&&e.target.closest(".btn.primary");if(b)b.style.translate=""})}
/* текст: вставка, счётчик, Ctrl+Enter */
function cnt(){$("cnt").textContent=$("txtIn").value.length+" симв."}
$("txtIn").addEventListener("input",cnt);$("btnTxtClear").addEventListener("click",()=>setTimeout(cnt));
$("txtIn").addEventListener("keydown",e=>{if(e.key==="Enter"&&(e.ctrlKey||e.metaKey)){clearTimeout(dt);textTranslate()}});
$("btnPaste").onclick=async()=>{try{$("txtIn").value=await navigator.clipboard.readText();$("txtIn").dispatchEvent(new Event("input"))}catch(e){toast("Разрешите доступ к буферу обмена")}};
/* настройки */
const dlg=$("set");
$("gear").onclick=()=>{$("sLocal").checked=S.local&&LOC;$("sLocal").disabled=!LOC;$("sKey").value=S.key;$("sDsKey").value=S.dsKey;$("sOcr").value=S.ocr;dlg.showModal()};
$("setClose").onclick=()=>dlg.close();dlg.addEventListener("click",e=>{if(e.target===dlg)dlg.close()});
$("sLocal").onchange=e=>{S.local=e.target.checked;saveS()};
$("sKey").onchange=e=>{S.key=e.target.value.trim();saveS();toast(S.key?"Ключ Google сохранён":"Ключ Google удалён")};
$("sDsKey").onchange=e=>{S.dsKey=e.target.value.trim();saveS();toast(S.dsKey?"Ключ DeepSeek сохранён":"Ключ DeepSeek удалён")};
$("sOcr").onchange=e=>{S.ocr=e.target.value;saveS();toast("Применится к следующему фото")};
$("sReset").onclick=()=>{if(!confirm("Сбросить настройки, историю и языки?"))return;try{localStorage.clear()}catch(e){}location.reload()};
let ip=null;addEventListener("beforeinstallprompt",e=>{e.preventDefault();ip=e;$("sInstall").hidden=false});
$("sInstall").onclick=async()=>{if(!ip)return;ip.prompt();try{await ip.userChoice}catch(e){}ip=null;$("sInstall").hidden=true};
if("serviceWorker"in navigator&&/^https?:$/.test(location.protocol))addEventListener("load",()=>navigator.serviceWorker.register("sw.js").catch(()=>{}));
renderChips();cnt();
/* поворот и выделение области фото — точнее распознавание */
const cb=document.createElement("div");cb.className="cropbox";stage.appendChild(cb);let cs=null;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function imgRect(){const r=prev.getBoundingClientRect(),nw=prev.naturalWidth||1,nh=prev.naturalHeight||1,s=Math.min(r.width/nw,r.height/nh),w=nw*s,h=nh*s;return {x:r.left+(r.width-w)/2,y:r.top+(r.height-h)/2,w,h}}
function drawBox(){const sr=stage.getBoundingClientRect();cb.style.display="block";cb.style.left=Math.min(cs.x,cs.x2)-sr.left+"px";cb.style.top=Math.min(cs.y,cs.y2)-sr.top+"px";cb.style.width=Math.abs(cs.x2-cs.x)+"px";cb.style.height=Math.abs(cs.y2-cs.y)+"px"}
async function reprocess(fn){if(!curFile||busy)return;try{const bmp=await createImageBitmap(curFile),c=fn(bmp);c.toBlob(b=>{if(b)handleFile(new File([b],"photo.png",{type:"image/png"}))},"image/png")}catch(e){toast("Не удалось обработать фото")}}
$("btnRot").onclick=()=>reprocess(bmp=>{const c=document.createElement("canvas");c.width=bmp.height;c.height=bmp.width;const x=c.getContext("2d");x.translate(c.width/2,c.height/2);x.rotate(Math.PI/2);x.drawImage(bmp,-bmp.width/2,-bmp.height/2);return c});
$("btnCrop").onclick=()=>{if(busy||!curFile)return;stage.classList.toggle("crop");cb.style.display="none";if(stage.classList.contains("crop"))toast("Проведите по тексту, который нужно перевести")};
stage.addEventListener("pointerdown",e=>{if(!stage.classList.contains("crop"))return;e.preventDefault();try{stage.setPointerCapture(e.pointerId)}catch(_){}const R=imgRect(),x=clamp(e.clientX,R.x,R.x+R.w),y=clamp(e.clientY,R.y,R.y+R.h);cs={R,x,y,x2:x,y2:y};drawBox()});
stage.addEventListener("pointermove",e=>{if(!cs)return;cs.x2=clamp(e.clientX,cs.R.x,cs.R.x+cs.R.w);cs.y2=clamp(e.clientY,cs.R.y,cs.R.y+cs.R.h);drawBox()});
stage.addEventListener("pointerup",()=>{if(!cs)return;const c0=cs;cs=null;cb.style.display="none";stage.classList.remove("crop");
 const w=Math.abs(c0.x2-c0.x),h=Math.abs(c0.y2-c0.y);if(w<20||h<20){toast("Выделите область побольше");return}
 const fx=(Math.min(c0.x,c0.x2)-c0.R.x)/c0.R.w,fy=(Math.min(c0.y,c0.y2)-c0.R.y)/c0.R.h,fw=w/c0.R.w,fh=h/c0.R.h;
 reprocess(bmp=>{const sw=Math.round(fw*bmp.width),sh=Math.round(fh*bmp.height),c=document.createElement("canvas");c.width=sw;c.height=sh;c.getContext("2d").drawImage(bmp,Math.round(fx*bmp.width),Math.round(fy*bmp.height),sw,sh,0,0,sw,sh);return c})});
})();
