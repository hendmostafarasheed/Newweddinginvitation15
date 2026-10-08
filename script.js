const CONFIG={locationQuery:'نادي الزهراء الرياضي القاهرة مصر',rsvpUrl:'',photosUrl:''};
const page1=document.getElementById('page1'),page2=document.getElementById('page2'),openBtn=document.getElementById('openInvitation'),transition=document.getElementById('transition'),canvas=document.getElementById('matrixCanvas'),music=document.getElementById('bgMusic'),clickSound=document.getElementById('clickSound'),toast=document.getElementById('toast'),modal=document.getElementById('rsvpModal');
let musicStarted=false,transitioning=false,animationId,columns=[];
function playClick(){try{clickSound.currentTime=0;clickSound.play().catch(()=>{})}catch(e){}}
function startMusic(){if(musicStarted)return;musicStarted=true;music.volume=.65;music.play().catch(()=>{musicStarted=false})}
function showToast(m){toast.textContent=m;toast.classList.add('show');clearTimeout(showToast.t);showToast.t=setTimeout(()=>toast.classList.remove('show'),2600)}
function setupMatrix(){
  const dpr=Math.min(devicePixelRatio||1,2),w=innerWidth,h=innerHeight;
  canvas.width=w*dpr;canvas.height=h*dpr;canvas.style.width=w+'px';canvas.style.height=h+'px';
  const ctx=canvas.getContext('2d');ctx.setTransform(dpr,0,0,dpr,0,0);
  const count=Math.ceil(w/15);
  columns=Array.from({length:count},(_,i)=>({
    x:i*15+Math.random()*15,
    y:-Math.random()*h,
    len:24+Math.floor(Math.random()*52),
    speed:7+Math.random()*13,
    red:Math.random()<.16,
    width:Math.random()<.18?2:1,
    delay:Math.random()*500
  }));
  return ctx
}
function drawMatrix(ctx){
  const w=innerWidth,h=innerHeight;
  ctx.clearRect(0,0,w,h);
  ctx.lineCap='round';
  columns.forEach(c=>{
    c.y+=c.speed;
    if(c.y-c.len*10>h){
      c.y=-20-Math.random()*h*.65;
      c.x=Math.random()*w;
      c.red=Math.random()<.16;
    }
    const top=c.y-c.len*10;
    const rgb=c.red?'255,52,66':'235,239,241';
    const grad=ctx.createLinearGradient(c.x,top,c.x,c.y);
    grad.addColorStop(0,`rgba(${rgb},0)`);
    grad.addColorStop(.58,`rgba(${rgb},.22)`);
    grad.addColorStop(.86,`rgba(${rgb},.68)`);
    grad.addColorStop(1,`rgba(${rgb},1)`);
    ctx.strokeStyle=grad;
    ctx.lineWidth=c.width;
    ctx.shadowBlur=c.red?18:13;
    ctx.shadowColor=c.red?'rgba(255,45,60,.85)':'rgba(245,248,250,.8)';
    ctx.beginPath();
    ctx.moveTo(c.x,top);
    ctx.lineTo(c.x,c.y);
    ctx.stroke();
    ctx.fillStyle=c.red?'rgba(255,95,105,.95)':'rgba(255,255,255,.98)';
    ctx.beginPath();ctx.arc(c.x,c.y,c.width>1?1.9:1.35,0,Math.PI*2);ctx.fill();
    ctx.shadowBlur=0;
  });
  animationId=requestAnimationFrame(()=>drawMatrix(ctx));
}
function startTransition(){if(transitioning)return;transitioning=true;playClick();startMusic();transition.classList.add('show');const ctx=setupMatrix();cancelAnimationFrame(animationId);drawMatrix(ctx);setTimeout(()=>{page1.classList.remove('active');page2.classList.add('active');page2.setAttribute('aria-hidden','false');page1.setAttribute('aria-hidden','true')},720);setTimeout(()=>{transition.classList.remove('show');cancelAnimationFrame(animationId);transitioning=false},1700)}
openBtn.addEventListener('click',startTransition);
addEventListener('resize',()=>{if(transition.classList.contains('show')){const ctx=setupMatrix();cancelAnimationFrame(animationId);drawMatrix(ctx)}});
document.querySelectorAll('.action').forEach(btn=>btn.addEventListener('click',()=>{playClick();startMusic();const a=btn.dataset.action;if(a==='location')window.open('https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(CONFIG.locationQuery),'_blank','noopener');if(a==='share'){const data={title:'محمد خليفة & سارة عيد',text:'دعوتكم لحضور حفلة خطوبتنا يوم الإثنين ٢٢ يونيو ٢٠٢٦ الساعة ٦ مساءً ❤️',url:location.href};if(navigator.share)navigator.share(data).catch(()=>{});else navigator.clipboard?.writeText(location.href).then(()=>showToast('تم نسخ رابط الدعوة ❤️')).catch(()=>showToast('انسخي رابط الدعوة من شريط المتصفح'))}if(a==='photos'){if(CONFIG.photosUrl)window.open(CONFIG.photosUrl,'_blank','noopener');else showToast('صور الحفلة هتكون متاحة قريبًا ❤️')}if(a==='rsvp'){if(CONFIG.rsvpUrl)window.open(CONFIG.rsvpUrl,'_blank','noopener');else modal.classList.add('open')}}));
document.getElementById('closeModal').addEventListener('click',()=>modal.classList.remove('open'));modal.addEventListener('click',e=>{if(e.target===modal)modal.classList.remove('open')});document.querySelectorAll('[data-rsvp]').forEach(btn=>btn.addEventListener('click',()=>{const ans=btn.dataset.rsvp==='yes'?'سأحضر ❤️':'أعتذر عن الحضور';navigator.clipboard?.writeText(`محمد خليفة & سارة عيد — ${ans}`).catch(()=>{});modal.classList.remove('open');showToast('تم اختيار الرد: '+ans)}));document.getElementById('musicToggle').addEventListener('click',()=>{if(music.paused){music.play().catch(()=>{});showToast('تم تشغيل الموسيقى 🎵')}else{music.pause();showToast('تم إيقاف الموسيقى')}});
