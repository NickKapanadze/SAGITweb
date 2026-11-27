import {locations,scene,project,projectedScene} from './campus-model.js';
const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
export function initCampus(root){
 const canvas=root.querySelector('canvas'),ctx=canvas.getContext('2d');
 if(!ctx)throw new Error('Canvas rendering unavailable');
 const visual=root.querySelector('.campus-visual');
 const markers=root.querySelector('.campus-markers'),detail=root.querySelector('.campus-detail');
 const categories=root.querySelector('.campus-categories'),list=root.querySelector('.campus-destinations');
 const heading=root.querySelector('.campus-sidebar-heading');
 const model=scene();
 let width=900,height=620,selected=null,category='all',language=document.documentElement.lang,mode='3d',visible=true;
 let frame=0,animation=0,drag=null,gesture=null;
 const reduce=matchMedia('(prefers-reduced-motion:reduce)');
 const overview={x:-5,z:0,yaw:-.2,pitch:.68,zoom:1.05};
 let camera={...overview};
 const pins=locations.map(p=>{const el=document.createElement('span');el.className='campus-pin';el.textContent=p.id;markers.append(el);return{p,el};});
 const byLanguage=(p,ka,en)=>language==='en'?p[en]:p[ka];
 const categoryName=c=>({learning:language==='en'?'LEARNING & DISCOVERY':'სწავლა და აღმოჩენა',life:language==='en'?'LIFE ON CAMPUS':'ცხოვრება კამპუსში',sport:language==='en'?'SPORT & WELLBEING':'სპორტი და კეთილდღეობა'})[c];
 function updateLabels(){
  canvas.setAttribute('aria-label',language==='en'?'Interactive campus map. Select a destination, drag to orbit, or use left/right and plus/minus keys.':'ინტერაქტიული კამპუსის რუკა. აირჩიეთ ადგილი; მოსაბრუნებლად გადაათრიეთ ან გამოიყენეთ მარცხენა/მარჯვენა და პლუს/მინუს ღილაკები.');
  const labels={in:['მიახლოება','Zoom in'],out:['დაშორება','Zoom out'],left:['მარცხნივ მობრუნება','Rotate left'],right:['მარჯვნივ მობრუნება','Rotate right']};
  root.querySelectorAll('[data-camera]').forEach(b=>{if(labels[b.dataset.camera])b.setAttribute('aria-label',labels[b.dataset.camera][language==='en'?1:0]);});
 }
 const requestDraw=()=>{if(!frame&&visible)frame=requestAnimationFrame(draw);};
 function draw(){
  frame=0;if(!visible)return;
  const dpr=Math.min(devicePixelRatio||1,1.75);ctx.setTransform(dpr,0,0,dpr,0,0);
  ctx.clearRect(0,0,width,height);
  // A soft grounding shadow remains flat on the landscape, rather than tracking the viewport.
  const ground=project([-5,-1,1],camera,width,height);ctx.save();ctx.translate(ground[0],ground[1]+12);ctx.scale(1,.45);const shadow=ctx.createRadialGradient(0,0,20,0,0,width*.4);shadow.addColorStop(0,'#34452717');shadow.addColorStop(1,'#34452700');ctx.fillStyle=shadow;ctx.fillRect(-width,-height,width*2,height*2);ctx.restore();
  for(const poly of projectedScene(model,camera,width,height,selected?.id)){
   ctx.beginPath();poly.points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();ctx.fillStyle=poly.color;ctx.fill();
   if(poly.layer===5){ctx.strokeStyle='#5d665017';ctx.lineWidth=.55;ctx.stroke();}
  }
  for(const {p,el} of pins){const anchor=project([p.x,7.5,p.z],camera,width,height);el.style.transform=`translate(${anchor[0]}px,${anchor[1]}px)`;el.classList.toggle('active',selected?.id===p.id);el.classList.toggle('dim',category!=='all'&&p.category!==category);el.hidden=anchor[0]<0||anchor[0]>width||anchor[1]<0||anchor[1]>height;}
  root.querySelector('.compass i').style.transform=`rotate(${-camera.yaw}rad)`;
 }
 function resize(){const rect=visual.getBoundingClientRect();width=rect.width;height=rect.height;const dpr=Math.min(devicePixelRatio||1,1.75);canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);requestDraw();}
 const resizeObserver=new ResizeObserver(resize);resizeObserver.observe(visual);
 function moveTo(target){
  cancelAnimationFrame(animation);animation=0;
  if(reduce.matches||!visible){camera={...target};requestDraw();return;}
  const from={...camera},start=performance.now();
  function tick(now){const progress=clamp((now-start)/680,0,1),ease=1-Math.pow(1-progress,3);for(const key of Object.keys(from))camera[key]=from[key]+(target[key]-from[key])*ease;requestDraw();if(progress<1&&visible&&!document.hidden)animation=requestAnimationFrame(tick);else animation=0;}
  animation=requestAnimationFrame(tick);
 }
 function updateDetail(){
  if(!selected)return;
  root.querySelector('.detail-number').textContent=String(selected.id).padStart(2,'0');
  root.querySelector('.detail-category').textContent=categoryName(selected.category);
  root.querySelector('.detail-title').textContent=byLanguage(selected,'ka','en');
  root.querySelector('.detail-intro').textContent=byLanguage(selected,'introKa','introEn');
  root.querySelector('.detail-copy').textContent=byLanguage(selected,'kaText','enText');
  const link=root.querySelector('.detail-link');link.href=selected.link;link.textContent=byLanguage(selected,'ctaKa','ctaEn');
  root.querySelector('.related-schools').hidden=selected.id!==3;
 }
 function select(id,{focus=false,updateUrl=true}={}){
  const place=locations.find(p=>p.id===Number(id));if(!place)return;
  selected=place;updateDetail();detail.hidden=false;list.hidden=true;categories.hidden=true;heading.hidden=true;
  root.querySelectorAll('[data-destination]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.destination)===place.id)));
  moveTo({...camera,x:place.x,z:place.z,pitch:mode==='plan'?Math.PI/2:.8,zoom:1.8});
  root.classList.add('has-selection');
  if(updateUrl&&document.body.dataset.page==='campus'){const url=new URL(location.href);url.searchParams.set('place',place.key);history.replaceState(null,'',url);}
  if(focus)root.querySelector('.campus-back').focus({preventScroll:true});
 }
 function reset({focus=false}={}){
  selected=null;detail.hidden=true;list.hidden=false;categories.hidden=false;heading.hidden=false;root.classList.remove('has-selection');
  root.querySelectorAll('[data-destination]').forEach(b=>b.setAttribute('aria-pressed','false'));
  moveTo({...overview,pitch:mode==='plan'?Math.PI/2:overview.pitch});
  if(document.body.dataset.page==='campus'){const url=new URL(location.href);url.searchParams.delete('place');history.replaceState(null,'',url);}
  if(focus)root.querySelector('[data-destination]:not([hidden])')?.focus({preventScroll:true});
 }
 root.querySelectorAll('[data-destination]').forEach(b=>b.addEventListener('click',()=>select(b.dataset.destination,{focus:true})));
 root.querySelector('.campus-back').addEventListener('click',()=>reset({focus:true}));
 root.querySelectorAll('[data-category]').forEach(b=>b.addEventListener('click',()=>{
  category=b.dataset.category;root.querySelectorAll('[data-category]').forEach(other=>{const active=other===b;other.classList.toggle('selected',active);other.setAttribute('aria-pressed',String(active));});
  root.querySelectorAll('[data-destination]').forEach(other=>other.hidden=category!=='all'&&other.dataset.kind!==category);requestDraw();
 }));
 root.querySelectorAll('[data-view]').forEach(b=>b.addEventListener('click',()=>{
  mode=b.dataset.view;root.querySelectorAll('[data-view]').forEach(other=>{const active=b===other;other.classList.toggle('selected',active);other.setAttribute('aria-pressed',String(active));});
  moveTo({...camera,pitch:mode==='plan'?Math.PI/2:.68,yaw:mode==='plan'?0:camera.yaw});
 }));
 function adjust(action){cancelAnimationFrame(animation);if(action==='reset'){reset();return;}if(action==='in')camera.zoom=clamp(camera.zoom+.2,.7,3);if(action==='out')camera.zoom=clamp(camera.zoom-.2,.7,3);if(action==='left')camera.yaw-=.18;if(action==='right')camera.yaw+=.18;requestDraw();}
 root.querySelectorAll('[data-camera]').forEach(b=>b.addEventListener('click',()=>adjust(b.dataset.camera)));
 const hit=(x,y)=>{let best=null,distance=Infinity;for(const {p} of pins){if(category!=='all'&&p.category!==category)continue;const pos=project([p.x,7.5,p.z],camera,width,height),d=Math.hypot(pos[0]-x,pos[1]-y);if(d<25&&d<distance){best=p;distance=d;}}return best;};
 canvas.addEventListener('pointerdown',event=>{
  if(event.button!==0)return;cancelAnimationFrame(animation);canvas.setPointerCapture(event.pointerId);
  if(drag){gesture={distance:Math.hypot(event.clientX-drag.clientX,event.clientY-drag.clientY),zoom:camera.zoom,id:event.pointerId};return;}
  drag={x:event.clientX,y:event.clientY,clientX:event.clientX,clientY:event.clientY,id:event.pointerId,yaw:camera.yaw,pitch:camera.pitch,moved:false};
 });
 canvas.addEventListener('pointermove',event=>{
  if(gesture&&event.pointerId===gesture.id){const distance=Math.hypot(event.clientX-drag.clientX,event.clientY-drag.clientY);camera.zoom=clamp(gesture.zoom*distance/Math.max(gesture.distance,1),.7,3);drag.moved=true;requestDraw();return;}
  if(!drag){const rect=canvas.getBoundingClientRect();canvas.style.cursor=hit(event.clientX-rect.left,event.clientY-rect.top)?'pointer':'grab';return;}
  if(event.pointerId!==drag.id)return;const dx=event.clientX-drag.x,dy=event.clientY-drag.y;drag.clientX=event.clientX;drag.clientY=event.clientY;if(Math.hypot(dx,dy)>5)drag.moved=true;
  camera.yaw=drag.yaw+dx*.006;if(mode!=='plan')camera.pitch=clamp(drag.pitch+dy*.003,.35,1.25);requestDraw();
 });
 const release=event=>{if(gesture){gesture=null;drag=null;return;}if(!drag||drag.id!==event.pointerId)return;if(!drag.moved&&event.type!=='pointercancel'){const rect=canvas.getBoundingClientRect(),p=hit(event.clientX-rect.left,event.clientY-rect.top);if(p)select(p.id,{focus:false});}drag=null;};
 canvas.addEventListener('pointerup',release);canvas.addEventListener('pointercancel',release);canvas.addEventListener('lostpointercapture',()=>{drag=null;gesture=null;});
 canvas.addEventListener('wheel',event=>{if(!event.ctrlKey&&!event.metaKey)return;event.preventDefault();adjust(event.deltaY<0?'in':'out');},{passive:false});
 canvas.addEventListener('keydown',event=>{const action={ArrowLeft:'left',ArrowRight:'right','+':'in','=':'in','-':'out','0':'reset',Escape:'reset'}[event.key];if(action){event.preventDefault();adjust(action);}});
 document.addEventListener('sagit:language',event=>{language=event.detail;updateDetail();updateLabels();});
 const visibility=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(!visible){cancelAnimationFrame(animation);animation=0;}else requestDraw();});visibility.observe(root);
 document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(animation);animation=0;}else requestDraw();});
 canvas.hidden=false;root.querySelector('.campus-poster').setAttribute('hidden','');updateLabels();resize();
 const requested=new URL(location.href).searchParams.get('place')||root.dataset.location;
 if(requested){const p=locations.find(p=>p.key===requested);if(p)select(p.id,{updateUrl:false});}
}
