// ─── ANIMATED BACKGROUND ───
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let W, H, particles = [], lines = [];

function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.vx = (Math.random() - 0.5) * 0.4;
    this.vy = (Math.random() - 0.5) * 0.4;
    this.r = Math.random() * 1.5 + 0.5;
    this.alpha = Math.random() * 0.5 + 0.1;
    const c = [[139,92,246],[56,189,248],[244,114,182]][Math.floor(Math.random()*3)];
    this.color = c;
  }
  update() {
    this.x += this.vx; this.y += this.vy;
    if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI*2);
    ctx.fillStyle = `rgba(${this.color[0]},${this.color[1]},${this.color[2]},${this.alpha})`;
    ctx.fill();
  }
}

for (let i = 0; i < 120; i++) particles.push(new Particle());

function drawLines() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i+1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx*dx+dy*dy);
      if (dist < 120) {
        const a = (1 - dist/120) * 0.08;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(139,92,246,${a})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
}

function loop() {
  ctx.clearRect(0,0,W,H);
  particles.forEach(p => { p.update(); p.draw(); });
  drawLines();
  requestAnimationFrame(loop);
}
loop();

// ─── CURSOR ───
const cur = document.getElementById('cursor');
const ring = document.getElementById('cursor-ring');
let mx=0,my=0,px=0,py=0,rx=0,ry=0;

document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;});

(function animCursor() {
  px += (mx-px)*0.15; py += (my-py)*0.15;
  rx += (mx-rx)*0.08; ry += (my-ry)*0.08;
  cur.style.left=px+'px'; cur.style.top=py+'px';
  ring.style.left=rx+'px'; ring.style.top=ry+'px';
  requestAnimationFrame(animCursor);
})();

document.querySelectorAll('.hover-target').forEach(el=>{
  el.addEventListener('mouseenter',()=>{cur.classList.add('hover');ring.classList.add('hover');});
  el.addEventListener('mouseleave',()=>{cur.classList.remove('hover');ring.classList.remove('hover');});
});

// ─── TYPING ───
const phrases = ["AI & ML Student","Full Stack Developer","Android Developer","Generative AI Enthusiast"];
let pi=0,ci=0,del=false;
const tyEl = document.getElementById('typing-out');

function type() {
  const word = phrases[pi%phrases.length];
  if (!del && ci<=word.length) { tyEl.innerHTML = word.slice(0,ci++) + '<span class="cursor-blink">|</span>'; }
  else if (del && ci>=0) { tyEl.innerHTML = word.slice(0,ci--) + '<span class="cursor-blink">|</span>'; }
  if (ci===word.length+1) { del=true; setTimeout(type,1200); return; }
  if (ci===-1) { del=false; pi++; ci=0; }
  setTimeout(type, del?40:90);
}
type();

// ─── 3D TILT ───
const tGrid = document.getElementById('tech-grid');
document.addEventListener('mousemove',e=>{
  const x=(window.innerWidth/2 - e.clientX)/30;
  const y=(window.innerHeight/2 - e.clientY)/30;
  if(tGrid) tGrid.style.transform=`rotateY(${x}deg) rotateX(${y}deg)`;
});

// ─── LIVE CLOCK + DATE ───
function updateClock() {
  const now = new Date();
  const hh = String(now.getHours()).padStart(2,'0');
  const mm = String(now.getMinutes()).padStart(2,'0');
  const ss = String(now.getSeconds()).padStart(2,'0');
  const el = document.getElementById('live-clock');
  if(el) el.textContent = `${hh}:${mm}:${ss}`;
  const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const dateEl = document.getElementById('live-date');
  if(dateEl) dateEl.textContent = `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;
}
setInterval(updateClock, 1000);
updateClock();

// ─── FAKE CAMERA CANVAS ───
const camC = document.getElementById('cam-canvas');
if(camC) {
  const cc = camC.getContext('2d');
  let camFrame = 0;
  // face positions
  const faceX = 100, faceY = 75;
  const names = ['Reena','User_02','Priya'];
  let nameIdx = 0, switchTimer = 0;

  function drawCamera() {
    camFrame++;
    cc.clearRect(0,0,200,150);
    // dark bg
    cc.fillStyle = '#040810';
    cc.fillRect(0,0,200,150);
    // grid lines
    cc.strokeStyle = 'rgba(56,189,248,0.06)';
    cc.lineWidth = 0.5;
    for(let x=0;x<200;x+=20){cc.beginPath();cc.moveTo(x,0);cc.lineTo(x,150);cc.stroke();}
    for(let y=0;y<150;y+=20){cc.beginPath();cc.moveTo(0,y);cc.lineTo(200,y);cc.stroke();}
    // noise dots
    for(let i=0;i<18;i++){
      cc.fillStyle=`rgba(56,189,248,${Math.random()*0.12})`;
      cc.fillRect(Math.random()*200,Math.random()*150,1,1);
    }
    // face silhouette
    const wobX = faceX + Math.sin(camFrame*0.04)*3;
    const wobY = faceY + Math.cos(camFrame*0.06)*2;
    // head
    cc.beginPath();
    cc.ellipse(wobX, wobY-8, 22, 26, 0, 0, Math.PI*2);
    cc.fillStyle = 'rgba(139,92,246,0.18)';
    cc.fill();
    cc.strokeStyle = 'rgba(139,92,246,0.5)';
    cc.lineWidth = 1;
    cc.stroke();
    // eyes
    [wobX-8, wobX+8].forEach(ex=>{
      cc.beginPath();
      cc.ellipse(ex, wobY-10, 3, 3.5, 0, 0, Math.PI*2);
      cc.fillStyle='rgba(56,189,248,0.7)';
      cc.fill();
    });
    // bounding box
    const pulse = 0.6 + Math.abs(Math.sin(camFrame*0.05))*0.4;
    cc.strokeStyle=`rgba(110,231,183,${pulse})`;
    cc.lineWidth=1.5;
    cc.setLineDash([4,3]);
    cc.strokeRect(wobX-34, wobY-40, 68, 80);
    cc.setLineDash([]);
    // corner brackets
    const bx=wobX-34,by=wobY-40,bw=68,bh=80,cs=10;
    cc.strokeStyle=`rgba(110,231,183,${pulse})`;
    cc.lineWidth=2;
    [[bx,by,cs,0,0,cs],[bx+bw,by,-cs,0,0,cs],[bx,by+bh,cs,0,0,-cs],[bx+bw,by+bh,-cs,0,0,-cs]].forEach(([x,y,dx1,dy1,dx2,dy2])=>{
      cc.beginPath();cc.moveTo(x+dx1,y);cc.lineTo(x,y);cc.lineTo(x,y+dy2||dy1||dy2);
      cc.stroke();
    });
    // name label
    switchTimer++;
    if(switchTimer>120){switchTimer=0;nameIdx=(nameIdx+1)%names.length;}
    const isReena = names[nameIdx]==='Reena';
    cc.fillStyle = isReena ? 'rgba(110,231,183,0.85)' : 'rgba(244,114,182,0.85)';
    cc.fillRect(wobX-34, wobY+42, 68, 14);
    cc.fillStyle='#050510';
    cc.font='bold 8px monospace';
    cc.textAlign='center';
    cc.fillText(names[nameIdx], wobX, wobY+52);
    // confidence bar
    const conf = isReena ? 96 + Math.floor(Math.sin(camFrame*0.02)*2) : 72 + Math.floor(Math.sin(camFrame*0.03)*5);
    cc.fillStyle='rgba(0,0,0,0.5)';
    cc.fillRect(wobX-34, wobY+58, 68, 8);
    cc.fillStyle = isReena ? 'rgba(110,231,183,0.7)' : 'rgba(244,114,182,0.7)';
    cc.fillRect(wobX-34, wobY+58, 68*(conf/100), 8);
    cc.fillStyle='white';
    cc.font='6px monospace';
    cc.fillText(`${conf}%`, wobX, wobY+64);
    // update status panel
    const fl = document.getElementById('face-label');
    const fd = document.getElementById('face-dot');
    const nb = document.getElementById('name-badge');
    if(fl && isReena){ fl.textContent='Face Detected'; fl.style.color='#6ee7b7'; fd.style.background='#6ee7b7'; fd.style.boxShadow='0 0 8px #6ee7b7'; nb.textContent='👤 Reena — Present ✓'; nb.style.color='#a78bfa'; }
    else if(fl){ fl.textContent='Identifying...'; fl.style.color='#f9a8d4'; fd.style.background='#f472b6'; fd.style.boxShadow='0 0 8px #f472b6'; nb.textContent='⚠️ Unknown Face'; nb.style.color='#f9a8d4'; }
    requestAnimationFrame(drawCamera);
  }
  drawCamera();
}
const revealEls = document.querySelectorAll('.reveal,.reveal-left,.reveal-right');
const observer = new IntersectionObserver(entries=>{
  entries.forEach(e=>{ if(e.isIntersecting) e.target.classList.add('visible'); });
},{threshold:0.12});
revealEls.forEach(el=>observer.observe(el));

// Trigger first section immediately
document.querySelectorAll('.hero .reveal,.hero .reveal-left,.hero .reveal-right').forEach(el=>el.classList.add('visible'));

// ─── CERT MODAL ───
function openCert(src) {
  document.getElementById('cert-modal-img').src = src;
  document.getElementById('cert-modal').classList.add('open');
}
function closeCert(e) {
  if(e.target === document.getElementById('cert-modal')) {
    document.getElementById('cert-modal').classList.remove('open');
  }
}