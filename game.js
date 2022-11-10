
"use strict"; 

import * as THREE from './libs/three.js/three.module.js'
import { OrbitControls } from './libs/three.js/controls/OrbitControls.js';
import { OBJLoader } from './libs/three.js/loaders/OBJLoader.js';
import { AsciiEffect } from 'three/addons/effects/AsciiEffect.js'

let renderer = null, scene = null, camera = null, orbitControls = null, group = null, objectList=[];
let ambientLight = null, directionalLight = null, spotLight;
let shipObj = {obj:'/assets/spaceship/spaceship.obj', map:'/assets/spaceship/textures/Intergalactic Spaceship_rough.jpg'};

let SHADOW_MAP_WIDTH = 2048, SHADOW_MAP_HEIGHT = 2048;
let tankgroup = null, tank = null;


let mapUrl = "/assets/images/galaxy.jpg";

function main()
{
    const canvas = document.getElementById("webglcanvas");

    createScene(canvas);

    update();

    
}
//troubleshooting
function onError ( err ){ console.error(err); };

function onProgress( xhr ) 
{
    if ( xhr.lengthComputable ) {

        const percentComplete = xhr.loaded / xhr.total * 100;
        console.log( xhr.target.responseURL, Math.round( percentComplete, 2 ) + '% downloaded' );
    }
}
/////////////////////////

function update() 
{
    requestAnimationFrame(function() { update(); });
    
    renderer.render( scene, camera );

    orbitControls.update();
}

async function loadObj(objModelUrl, objectList,xpos,ypos,zpos)
{
    try
    {
        const object = await new OBJLoader().loadAsync(objModelUrl.obj, onProgress, onError);
        let texture = new THREE.TextureLoader().load(shipObj.map);
        console.log(object);
        
    
            for(const child of object.children)
            {
      
                child.castShadow = true;
                child.receiveShadow = true;    
                child.material.map = texture;
               

            }
        

        object.scale.set(2, 2, 2);
        object.position.z = zpos;
        object.position.x = xpos;
        object.position.y = ypos;
      
    
        object.name = "objObject";
       
        
       
        return object
    }
    catch (err) 
    {
        onError(err);
    }
}


async function createScene(canvas) 
{
    renderer = new THREE.WebGLRenderer( { canvas: canvas, antialias: true } );

    renderer.setSize(canvas.width, canvas.height);

    // Turn on shadows
    renderer.shadowMap.enabled = true;

    // Options are THREE.BasicShadowMap, THREE.PCFShadowMap, PCFSoftShadowMap
    renderer.shadowMap.type = THREE.PCFShadowMap;

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 45, canvas.width / canvas.height, 1, 4000 );
    camera.position.set(-30, 1, 1);
    orbitControls = new OrbitControls(camera, renderer.domElement);


    // Lights
   spotLight = new THREE.SpotLight (0xaaaaaa);
   spotLight.position.set(2, 9, 15);
   spotLight.target.position.set(-2, 0, -2);
   scene.add(spotLight);

   spotLight.castShadow = true;

   spotLight.shadow.camera.near = 1;
   spotLight.shadow.camera.far = 200;
   spotLight.shadow.camera.fov = 45;
   
   spotLight.shadow.mapSize.width = SHADOW_MAP_WIDTH;
   spotLight.shadow.mapSize.height = SHADOW_MAP_HEIGHT;

   tankgroup = new THREE.Object3D;
   tank = await loadObj(shipObj, objectList, 1,1,1);
   tankgroup.add(tank);
   tankgroup.rotation.y = 50

   scene.add(tankgroup);
    const map = new THREE.TextureLoader().load(mapUrl);
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.repeat.set(8, 8);

    let geometry = new THREE.PlaneGeometry(200, 200, 50, 50);
    let mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({map:map, side:THREE.DoubleSide}));

    mesh.rotation.x = -Math.PI / 2;
    mesh.position.y = -4.02;
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    scene.add( mesh );

  

}



main();
