
"use strict"; 

import * as THREE from './libs/three.js/three.module.js'
import { OrbitControls } from './libs/three.js/controls/OrbitControls.js';
import { OBJLoader } from './libs/three.js/loaders/OBJLoader.js';
//import { AsciiEffect } from './effects/AsciiEffect.js'

let renderer = null, scene = null, camera = null, orbitControls = null, group = null, objectList=[];
let spotLight, effect;
let shipObj = {obj:'/assets/spaceship/spaceship.obj', map:'/assets/spaceship/textures/Intergalactic Spaceship_rough.jpg'};

let SHADOW_MAP_WIDTH = 2048, SHADOW_MAP_HEIGHT = 2048;
let shipGroup = null, ship = null;




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
    scene.background = new THREE.CubeTextureLoader()
        .setPath('/assets/images')
        .load([
            'front.png',
            'back.png',
            'top.png',
            'bottom.png',
            'right.png',
            'left.png',
        ]);

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
   spotLight.shadow.camera.fov = 50;
   
   spotLight.shadow.mapSize.width = SHADOW_MAP_WIDTH;
   spotLight.shadow.mapSize.height = SHADOW_MAP_HEIGHT;

   shipGroup = new THREE.Object3D;
   ship = await loadObj(shipObj, objectList, 1,1,1);
   shipGroup.add(ship);
   shipGroup.rotation.y = 50

   scene.add(shipGroup);


    // effect = new Ascii( renderer, ' .:-+*=%@#', { invert: true } );
    // effect.setSize( window.innerWidth, window.innerHeight );
    // effect.domElement.style.color = 'white';
    // effect.domElement.style.backgroundColor = 'black';
    // document.body.appendChild( effect.domElement );
}

//TODO: add skybox, menu, ascii effects



main();
