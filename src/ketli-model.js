import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// A scored-paperboard shape study. It intentionally makes no manufacturing claims.
export async function mountKettle(container,teas,swatches,buttons){
  const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});
  renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.setClearColor(0x000000,0);renderer.outputColorSpace=THREE.SRGBColorSpace;
  container.appendChild(renderer.domElement);
  const scene=new THREE.Scene();
  const camera=new THREE.PerspectiveCamera(33,1,.1,100);camera.position.set(3.1,1.8,7.8);
  const controls=new OrbitControls(camera,renderer.domElement);controls.enableZoom=false;controls.enablePan=false;controls.target.set(.1,.4,0);controls.minPolarAngle=.5;controls.maxPolarAngle=2.2;
  scene.add(new THREE.HemisphereLight(0xffffff,0x6e7053,3));
  const key=new THREE.DirectionalLight(0xffffff,4);key.position.set(-4,6,7);scene.add(key);
  const group=new THREE.Group();scene.add(group);
  const paper=new THREE.MeshStandardMaterial({color:'#eee6d0',roughness:.96,metalness:0});
  const olive=new THREE.MeshStandardMaterial({color:'#555b2e',roughness:.94});
  const accent=new THREE.MeshStandardMaterial({color:teas[0].colour,roughness:.94});
  const shape=new THREE.Shape();shape.moveTo(-1,-.95);shape.lineTo(1,-.95);shape.lineTo(1.12,.45);shape.lineTo(.68,1.08);shape.lineTo(-.68,1.08);shape.lineTo(-1.12,.45);shape.closePath();
  const bodyGeometry=new THREE.ExtrudeGeometry(shape,{depth:.9,bevelEnabled:true,bevelSegments:1,bevelSize:.015,bevelThickness:.015,steps:1});
  const body=new THREE.Mesh(bodyGeometry,[paper,olive]);body.position.z=-.45;group.add(body);
  const edges=new THREE.LineSegments(new THREE.EdgesGeometry(bodyGeometry,25),new THREE.LineBasicMaterial({color:'#777b51',transparent:true,opacity:.28}));edges.position.copy(body.position);group.add(edges);
  const borderShape=shape.clone(),inset=new THREE.Path();
  inset.moveTo(-.9,-.85);inset.lineTo(-1.01,.42);inset.lineTo(-.61,.98);inset.lineTo(.61,.98);inset.lineTo(1.01,.42);inset.lineTo(.9,-.85);inset.closePath();borderShape.holes.push(inset);
  const border=new THREE.Mesh(new THREE.ShapeGeometry(borderShape),olive);border.position.z=.47;group.add(border);
  const spout=new THREE.Shape();spout.moveTo(.92,-.04);spout.lineTo(1.83,1.02);spout.lineTo(1.58,1.15);spout.lineTo(.98,.58);spout.closePath();
  const spoutMesh=new THREE.Mesh(new THREE.ExtrudeGeometry(spout,{depth:.23,bevelEnabled:false}),olive);spoutMesh.position.z=-.115;group.add(spoutMesh);
  const handle=new THREE.Shape();handle.moveTo(-.58,.94);handle.lineTo(-.58,1.65);handle.quadraticCurveTo(-.58,2.08,0,2.08);handle.quadraticCurveTo(.58,2.08,.58,1.65);handle.lineTo(.58,.94);handle.closePath();
  const hole=new THREE.Path();hole.moveTo(-.4,1.13);hole.lineTo(.4,1.13);hole.lineTo(.4,1.64);hole.quadraticCurveTo(.4,1.9,0,1.9);hole.quadraticCurveTo(-.4,1.9,-.4,1.64);hole.closePath();handle.holes.push(hole);
  const handleMesh=new THREE.Mesh(new THREE.ExtrudeGeometry(handle,{depth:.055,bevelEnabled:false}),olive);handleMesh.position.z=-.025;group.add(handleMesh);
  const band=new THREE.Mesh(new THREE.BoxGeometry(1.99,.14,.016),accent);band.position.set(0,-.8,.476);group.add(band);
  const canvas=document.createElement('canvas');canvas.width=1024;canvas.height=1024;const ctx=canvas.getContext('2d');
  const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;
  const label=new THREE.Mesh(new THREE.PlaneGeometry(1.53,1.15),new THREE.MeshStandardMaterial({map:texture,roughness:1}));label.position.set(0,-.12,.48);group.add(label);
  const wordmark=await new THREE.TextureLoader().loadAsync('/images/ketli-time/brand.webp');
  let disposed=false;
  function render(){if(!disposed)renderer.render(scene,camera);}
  function select(t){
    accent.color.set(t.colour);olive.color.set(t.colour);ctx.fillStyle='#f5efdf';ctx.fillRect(0,0,1024,1024);
    ctx.strokeStyle=t.colour;ctx.lineWidth=34;ctx.strokeRect(17,17,990,990);
    ctx.drawImage(wordmark.image,372,45,280,477);ctx.fillStyle='#555b2e';ctx.textAlign='center';
    ctx.font='86px Georgia';ctx.fillText(t.name,512,610);ctx.font='34px Arial';ctx.fillText(`${t.type} ${t.kind==='Herbal infusion'?'infusion':'tea'}`,512,670);
    ctx.strokeStyle=t.colour;ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(405,810);ctx.bezierCurveTo(450,755,555,790,625,730);ctx.moveTo(460,785);ctx.bezierCurveTo(355,770,405,710,442,751);ctx.moveTo(512,775);ctx.bezierCurveTo(510,705,590,725,560,760);ctx.stroke();
    ctx.font='24px Arial';ctx.fillText(t.ingredients.slice(0,2).map(i=>i.name).join(' · '),512,865);ctx.fillText(t.ingredients.slice(2).map(i=>i.name).join(' · '),512,903);ctx.font='22px Arial';ctx.fillText('50 g · Academic label concept',512,950);texture.needsUpdate=true;
    swatches.querySelectorAll('[data-model-tea]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.modelTea===t.id)));render();
  }
  swatches.innerHTML=teas.map((t,index)=>`<button data-model-tea="${t.id}" style="--tea:${t.colour}" aria-label="Show ${t.name} kettle label" aria-pressed="${index===0}"><span></span>${t.name}</button>`).join('');
  const choose=e=>{const b=e.target.closest('[data-model-tea]');if(b)select(teas.find(t=>t.id===b.dataset.modelTea));};swatches.addEventListener('click',choose);
  buttons.innerHTML='<button class="button button-outline" data-model-turn="-1" aria-label="Turn kettle left">Turn left</button><button class="underlined" data-model-reset>Reset view</button><button class="button button-outline" data-model-turn="1" aria-label="Turn kettle right">Turn right</button>';
  const turn=e=>{const b=e.target.closest('[data-model-turn]');if(b){group.rotation.y+=Number(b.dataset.modelTurn)*Math.PI/6;render();}if(e.target.closest('[data-model-reset]')){group.rotation.set(0,0,0);camera.position.set(3.1,1.8,7.8);controls.target.set(.1,.4,0);controls.update();render();}};
  buttons.addEventListener('click',turn);
  const keyboard=e=>{if(!['ArrowLeft','ArrowRight'].includes(e.key))return;e.preventDefault();group.rotation.y+=(e.key==='ArrowLeft'?-1:1)*Math.PI/12;render();};
  renderer.domElement.tabIndex=0;renderer.domElement.setAttribute('aria-label','3D kettle. Drag to rotate or use left and right arrows.');renderer.domElement.addEventListener('keydown',keyboard);
  controls.addEventListener('change',render);
  const resize=new ResizeObserver(()=>{const width=container.clientWidth,height=container.clientHeight;if(width<1||height<1)return;renderer.setSize(width,height,false);camera.aspect=width/height;camera.updateProjectionMatrix();render();});resize.observe(container);
  select(teas[0]);controls.update();render();
  return {dispose(){disposed=true;resize.disconnect();controls.dispose();swatches.removeEventListener('click',choose);buttons.removeEventListener('click',turn);renderer.domElement.removeEventListener('keydown',keyboard);scene.traverse(object=>{object.geometry?.dispose();if(object.material){for(const material of Array.isArray(object.material)?object.material:[object.material])material.dispose();}});texture.dispose();wordmark.dispose();renderer.dispose();}};
}
