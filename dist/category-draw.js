import {categoryArt} from './category-art.js';
import * as THREE from './vendor/three.module.js';

const ease=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t);};
const mix=(a,b,t)=>a+(b-a)*t;
const reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;

// Three packets cut apart, fan across the table, then pull and turn the top card.
export function createCategoryDraw(host,category,{revealed=false,onComplete=()=>{}}={}){
 let renderer;
 try{renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});}catch{return flatDraw(host,category,{revealed,onComplete});}
 renderer.setPixelRatio(Math.min(devicePixelRatio,1.75));renderer.setClearColor(0,0);renderer.outputColorSpace=THREE.SRGBColorSpace;
 renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
 renderer.domElement.setAttribute('aria-hidden','true');host.append(renderer.domElement);
 const scene=new THREE.Scene(),camera=new THREE.OrthographicCamera(-5,5,3,-3,.1,35);camera.position.set(0,1.2,12);camera.lookAt(0,0,0);
 scene.add(new THREE.HemisphereLight(0xfff8e9,0x365b48,2.3));
 const light=new THREE.DirectionalLight(0xfff8e9,2.5);light.position.set(-3,5,9);light.castShadow=true;light.shadow.mapSize.set(1024,1024);Object.assign(light.shadow.camera,{left:-7,right:7,top:6,bottom:-6});light.shadow.bias=-.001;scene.add(light);
 const shadow=new THREE.Mesh(new THREE.PlaneGeometry(24,16),new THREE.ShadowMaterial({opacity:.24}));shadow.position.z=-.3;shadow.receiveShadow=true;scene.add(shadow);
 const w=1.85,h=2.65,r=.11,shape=new THREE.Shape();shape.moveTo(-w/2+r,-h/2);shape.lineTo(w/2-r,-h/2);shape.quadraticCurveTo(w/2,-h/2,w/2,-h/2+r);shape.lineTo(w/2,h/2-r);shape.quadraticCurveTo(w/2,h/2,w/2-r,h/2);shape.lineTo(-w/2+r,h/2);shape.quadraticCurveTo(-w/2,h/2,-w/2,h/2-r);shape.lineTo(-w/2,-h/2+r);shape.quadraticCurveTo(-w/2,-h/2,-w/2+r,-h/2);
 const geometry=new THREE.ExtrudeGeometry(shape,{depth:.035,bevelEnabled:true,bevelSegments:2,bevelSize:.012,bevelThickness:.008,curveSegments:8});
 const plane=new THREE.PlaneGeometry(w-.04,h-.04),side=new THREE.MeshStandardMaterial({color:0xf3eede,roughness:.8});
 const backTexture=cardTexture(category,true),frontTexture=cardTexture(category,false,()=>{if(alive)pose(finished?3.4:elapsed);});
 const back=new THREE.MeshStandardMaterial({map:backTexture,roughness:.85}),front=new THREE.MeshStandardMaterial({map:frontTexture,roughness:.85});
 const cards=Array.from({length:12},(_,i)=>{const group=new THREE.Group();const body=new THREE.Mesh(geometry,side);body.castShadow=true;group.add(body);const f=new THREE.Mesh(plane,i===11?front:back);f.position.z=.047;group.add(f);const b=new THREE.Mesh(plane,back);b.position.z=-.017;b.rotation.y=Math.PI;group.add(b);scene.add(group);return group;});
 let frame=0,alive=true,finished=false,elapsed=0,last=null,spread=1;
 function pose(seconds){
  const lift=ease(seconds/.32),cut=Math.sin(Math.PI*ease((seconds-.25)/.85)),fan=ease((seconds-1.05)/.48)*(1-ease((seconds-1.68)/.4)),pull=ease((seconds-2.05)/.85),turn=ease((seconds-2.36)/.68);
  cards.forEach((c,i)=>{const centered=i-5.5,packet=Math.floor(i/4)-1,top=i===11;
   let x=centered*.016+packet*1.9*cut+centered*.42*fan;
   let y=.16*lift+Math.abs(packet)*.48*cut-(centered*centered)*.019*fan;
   let rz=centered*.008+packet*.55*cut-centered*.085*fan;
   let z=i*.046+Math.abs(packet)*.28*cut;
   if(top){x=mix(x,1.05,pull);y=mix(y,.13,pull);z=mix(z,1.7,pull);rz=mix(rz,-.035,pull);}
   else{x=mix(x,-1.45+centered*.015,pull);y=mix(y,-.25,pull);rz=mix(rz,.12,pull);}
   c.position.set(x*spread,y,z);c.rotation.set(.055*Math.sin(cut*Math.PI),Math.PI-(top?Math.PI*turn:0),rz);
   c.scale.setScalar(top?mix(1,1.15,pull):mix(1,.83,pull));
  });renderer.render(scene,camera);
 }
 function resize(){const w=host.clientWidth,h=host.clientHeight;if(!w||!h)return;renderer.setSize(w,h,false);const aspect=w/h;const viewHeight=4.25;camera.left=-viewHeight*aspect/2;camera.right=viewHeight*aspect/2;camera.top=viewHeight/2;camera.bottom=-viewHeight/2;camera.updateProjectionMatrix();spread=Math.min(1,aspect/1.7);pose(finished?3.4:elapsed);}
 function finish(){if(!alive||finished)return;finished=true;cancelAnimationFrame(frame);pose(3.4);onComplete();}
 function tick(now){if(!alive||finished)return;const dt=last===null?0:Math.min((now-last)/1000,.08);last=now;if(!document.hidden)elapsed+=dt;pose(elapsed);if(elapsed>=3.2)finish();else frame=requestAnimationFrame(tick);}
 const observer=new ResizeObserver(resize);observer.observe(host);resize();
 const contextLost=e=>{e.preventDefault();finish();};renderer.domElement.addEventListener('webglcontextlost',contextLost);
 if(revealed||reduced())queueMicrotask(finish);else frame=requestAnimationFrame(tick);
 return {skip:finish,destroy(){alive=false;cancelAnimationFrame(frame);observer.disconnect();renderer.domElement.removeEventListener('webglcontextlost',contextLost);geometry.dispose();plane.dispose();side.dispose();front.dispose();back.dispose();frontTexture.dispose();backTexture.dispose();shadow.geometry.dispose();shadow.material.dispose();light.shadow.map?.dispose();renderer.dispose();renderer.forceContextLoss();renderer.domElement.remove();}};
}
function cardTexture(category,isBack,onUpdate=()=>{}){
 const canvas=document.createElement('canvas');canvas.width=600;canvas.height=860;const c=canvas.getContext('2d');
 c.fillStyle=isBack?'#dce59c':'#f5f1e5';c.fillRect(0,0,600,860);c.strokeStyle=isBack?'#758d5d':'#b8bfa5';c.lineWidth=2;c.strokeRect(23,23,554,814);c.strokeRect(34,34,532,792);
 if(isBack){c.save();c.beginPath();c.rect(46,46,508,768);c.clip();c.strokeStyle='#9eaf78';c.lineWidth=1;for(let n=-850;n<650;n+=26){c.beginPath();c.moveTo(n,0);c.lineTo(n+860,860);c.stroke();c.beginPath();c.moveTo(n+860,0);c.lineTo(n,860);c.stroke();}c.restore();c.fillStyle='#dce59c';c.fillRect(90,277,420,305);c.strokeStyle='#34563d';c.strokeRect(104,291,392,277);c.textAlign='center';c.fillStyle='#244336';c.font='italic 130px Georgia,serif';c.fillText('1—5',300,443);c.font='600 18px sans-serif';c.fillText('CATEGORY',300,510);}
 else{c.fillStyle='#244336';c.textAlign='left';c.font='600 19px sans-serif';c.fillText('BEST TO WORST',54,85);c.font='16px sans-serif';c.fillStyle='#718272';c.fillText('CATEGORY CARD',54,118);c.fillStyle='#e1e7ae';c.beginPath();c.arc(300,340,100,0,Math.PI*2);c.fill();c.textAlign='center';c.fillStyle='#34563d';c.font='italic 106px Georgia,serif';c.fillText('↗',300,377);c.font='700 46px sans-serif';const words=category.name.split(' '),lines=[];let line='';for(const word of words){if(line&&c.measureText(line+' '+word).width>490){lines.push(line);line=word;}else line=line?line+' '+word:word;}lines.push(line);lines.forEach((text,i)=>c.fillText(text,300,522+i*60,490));c.font='17px sans-serif';c.fillStyle='#718272';c.fillText(`${category.cards.length} cards`,300,715);c.font='600 16px sans-serif';c.fillText('THIS ROUND',300,781);}
 const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=4;
 if(!isBack&&categoryArt(category.id)){const img=new Image();img.onload=()=>{c.fillStyle='#f5f1e5';c.fillRect(55,150,490,340);c.drawImage(img,130,150,340,340);texture.needsUpdate=true;onUpdate();};img.src=categoryArt(category.id);}
 return texture;
}
function flatDraw(host,category,{revealed,onComplete}){
 let alive=true,done=false,timer;
 const deck=document.createElement('div');deck.className='flat-category-deck';
 for(let i=0;i<5;i++){const card=document.createElement('div');card.className='flat-category-card';card.style.setProperty('--i',i);card.textContent='1—5';deck.append(card);}host.append(deck);
 const label=document.createElement('strong');label.textContent=category.name;const front=deck.lastElementChild;
 function finish(){if(!alive||done)return;done=true;clearTimeout(timer);deck.classList.remove('is-shuffling');deck.classList.add('is-drawn');front.replaceChildren(label);if(categoryArt(category.id)){const img=document.createElement('img');img.src=categoryArt(category.id);img.alt='';img.className='flat-category-art';front.prepend(img);}onComplete();}
 if(revealed||reduced())queueMicrotask(finish);else{deck.classList.add('is-shuffling');timer=setTimeout(finish,2200);}
 return {skip:finish,destroy(){alive=false;clearTimeout(timer);deck.remove();}};
}
