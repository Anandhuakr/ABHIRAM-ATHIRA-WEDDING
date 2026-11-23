// Edit the wedding details here. Photos and links are kept beside this file.
const WEDDING = {
  date: new Date('2026-12-13T10:45:00+05:30'),
  youtubeId: 'R5Wa9J3Whis'
};

const reveal = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) { entry.target.classList.add('visible'); reveal.unobserve(entry.target); }
}), { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => reveal.observe(el));

const cover = document.getElementById('cover');
const goToInvitation = () => {
  cover.classList.add('opened');
  document.getElementById('invitation').scrollIntoView({ behavior: 'smooth' });
  startMusic();
};
document.getElementById('open-invite').addEventListener('click', goToInvitation);
document.getElementById('cover-scroll').addEventListener('click', goToInvitation);

let player, playerReady = false, musicOn = false, musicIntent = false;
const musicButton = document.getElementById('music-toggle');
window.onYouTubeIframeAPIReady = () => {
  player = new YT.Player('yt-player', {
    width: '2', height: '2', videoId: WEDDING.youtubeId,
    playerVars: { autoplay: 0, controls: 0, disablekb: 1, playsinline: 1, rel: 0 },
    events: { onReady: () => { playerReady = true; if (musicIntent) setMusic(true); }, onStateChange: e => {
      if (e.data === YT.PlayerState.ENDED && musicOn) player.playVideo();
    }}
  });
};
const setMusic = enabled => {
  musicIntent = enabled;
  musicOn = enabled;
  if (playerReady) enabled ? player.playVideo() : player.pauseVideo();
  musicButton.classList.toggle('playing', enabled);
  musicButton.querySelector('.music-label').textContent = enabled ? 'Music on' : 'Music off';
  musicButton.setAttribute('aria-label', enabled ? 'Pause wedding music' : 'Play wedding music');
};
function startMusic() { if (playerReady) setMusic(true); }
musicButton.addEventListener('click', () => setMusic(!musicOn));
const api = document.createElement('script'); api.src = 'https://www.youtube.com/iframe_api'; document.head.append(api);

const ids = ['days','hours','minutes','seconds'];
function updateCountdown() {
  let remaining = Math.max(0, WEDDING.date.getTime() - Date.now());
  const values = [Math.floor(remaining / 86400000), Math.floor(remaining / 3600000) % 24, Math.floor(remaining / 60000) % 60, Math.floor(remaining / 1000) % 60];
  ids.forEach((id, i) => document.getElementById(id).textContent = String(values[i]).padStart(2,'0'));
}
updateCountdown(); setInterval(updateCountdown, 1000);

// Scratch the gold layer with a finger or mouse to reveal the date.
const canvas = document.getElementById('scratch-canvas'), ctx = canvas.getContext('2d', { willReadFrequently: true });
const wrap = document.getElementById('scratch-wrap'), hint = document.getElementById('scratch-hint');
let drawing = false, revealed = false;
function paintFoil() {
  const rect = wrap.getBoundingClientRect(), dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.round(rect.width * dpr); canvas.height = Math.round(rect.height * dpr);
  ctx.setTransform(dpr,0,0,dpr,0,0);
  const gradient = ctx.createLinearGradient(0,0,rect.width,rect.height);
  gradient.addColorStop(0,'#c4a66b'); gradient.addColorStop(.28,'#ead9ad'); gradient.addColorStop(.52,'#b89353'); gradient.addColorStop(.74,'#e8d3a1'); gradient.addColorStop(1,'#b08b4f');
  ctx.globalCompositeOperation = 'source-over'; ctx.fillStyle = gradient; ctx.fillRect(0,0,rect.width,rect.height);
  ctx.fillStyle = '#fff4d222';
  for(let x=0;x<rect.width;x+=12) for(let y=0;y<rect.height;y+=12) { ctx.beginPath(); ctx.arc(x+(y%2?6:0),y,Math.random()*1.15,0,Math.PI*2);ctx.fill(); }
  ctx.fillStyle = '#735b37'; ctx.textAlign='center'; ctx.textBaseline='middle';
  ctx.font='500 9px "DM Sans",Arial'; ctx.fillText('A DAY TO REMEMBER',rect.width/2,rect.height/2-20);
  ctx.font='400 30px "Cormorant Garamond",Georgia'; ctx.fillText('13 · 12 · 2026',rect.width/2,rect.height/2+10);
  ctx.font='400 10px "DM Sans",Arial'; ctx.fillText('SUNDAY  ·  10:45 AM',rect.width/2,rect.height/2+38);
}
function scratchAt(event) {
  const rect = canvas.getBoundingClientRect(), point = event.touches ? event.touches[0] : event;
  ctx.globalCompositeOperation = 'destination-out'; ctx.beginPath(); ctx.arc(point.clientX-rect.left,point.clientY-rect.top,23,0,Math.PI*2);ctx.fill();
  hint.style.opacity = '0';
  if (!revealed) {
    const data = ctx.getImageData(0,0,canvas.width,canvas.height).data; let clear=0;
    for(let i=3;i<data.length;i+=32) if(data[i]===0) clear++;
    if(clear/(data.length/32)>.36) revealDate();
  }
}
function revealDate() {
  revealed=true; canvas.style.opacity='0'; hint.style.display='none';
  setTimeout(()=>{canvas.style.pointerEvents='none';},850); petals();
}
canvas.addEventListener('pointerdown',e=>{drawing=true;canvas.setPointerCapture(e.pointerId);scratchAt(e)});
canvas.addEventListener('pointermove',e=>{if(drawing)scratchAt(e)});
canvas.addEventListener('pointerup',()=>drawing=false); canvas.addEventListener('pointercancel',()=>drawing=false);
new ResizeObserver(()=>{if(!revealed)paintFoil()}).observe(wrap); paintFoil();
function petals() {
  const layer=document.getElementById('petal-layer'), colors=['#d88587','#e8c77b','#fff0db','#c18e54'];
  for(let i=0;i<34;i++){const petal=document.createElement('i');petal.className='petal';petal.style.left=`${Math.random()*100}%`;petal.style.background=colors[i%colors.length];petal.style.setProperty('--duration',`${3+Math.random()*3}s`);petal.style.setProperty('--drift',`${Math.random()*180-90}px`);petal.style.animationDelay=`${Math.random()*.9}s`;layer.append(petal);setTimeout(()=>petal.remove(),7200)}
}
