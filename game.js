"use strict"; 

import * as THREE from './libs/three.js/three.module.js'
import { OrbitControls } from './libs/three.js/controls/OrbitControls.js';
import { OBJLoader } from './libs/three.js/loaders/OBJLoader.js';

let renderer, scene, camera,orbitControls;
let shipGroup, ship, objectList=[];
let shipObj = {obj:'/assets/spaceship/spaceship.obj', map:'/assets/spaceship/textures/Intergalactic Spaceship_rough.jpg'};
let asteroidObj = {obj:'assets/asteroid/10464_Asteroid_L3.123c72035d71-abea-4a34-9131-5e9eeeffadcb/asteroid.obj', map:'/assets/asteroid/10464_Asteroid_L3.123c72035d71-abea-4a34-9131-5e9eeeffadcb/10464_Asteroid_v1_diffuse.jpg'}


function main()
{
    const canvas = document.getElementById("webglcanvas");
    createScene(canvas);
    update();
}

//troubleshooting models
function onError ( err ){ console.error(err); };
//loading models progress
function onProgress( xhr ) 
{
    if ( xhr.lengthComputable ) {

        const percentComplete = xhr.loaded / xhr.total * 100;
        console.log( xhr.target.responseURL, Math.round( percentComplete, 2 ) + '% downloaded' );
    }
}

function update() 
{
    requestAnimationFrame(function() { update(); });
    renderer.render( scene, camera );
    orbitControls.update();
}

async function loadShip(shipModelUrl,objectList,xpos,ypos,zpos)
{
    try
    {
        const object = await new OBJLoader().loadAsync(shipModelUrl.obj, onProgress, onError);
        let texture = new THREE.TextureLoader().load(shipObj.map);
        console.log(object);
        
    
            for(const child of object.children)
            {
      
                child.castShadow = true;
                child.receiveShadow = true;    
                child.material.map = texture;

            }
        

        object.scale.set(1, 1, 2);
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
    renderer.setSize(window.innerWidth, window.innerHeight);

    scene = new THREE.Scene();
    scene.background = new THREE.CubeTextureLoader()
    .setPath('/assets/images/')
    .load([
        'milkyway_px.jpg',
        'milkyway_nx.jpg',
        'milkyway_py.jpg',
        'milkyway_ny.jpg',
        'milkyway_pz.jpg',
        'milkyway_nz.jpg',
    ]);

    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / winsow.innerHeight, 1, 4000 );
    camera.position.set(-25, 2.5, 6.5);
    orbitControls = new OrbitControls(camera, renderer.domElement);

    const sun = new THREE.SpotLight(0xe9f7f7);
    sun.position.set(100,100,100)
    sun.castShadow = true;
    scene.add(sun);

    shipGroup = new THREE.Object3D;
    ship = await loadShip(shipObj,objectList,0,-15,6);
    shipGroup.add(ship);
    shipGroup.rotation.y = 1.8
    shipMovement(shipGroup)
    console.log(shipGroup.position)

    scene.add(shipGroup);


}

function shipMovement(shipGroup)
{
    document.addEventListener("keydown", event=>{
        if(event.key == 'w') ship.position.y += 1
        if(event.key == 's') ship.position.y -= 1
        if(event.key == 'd') ship.position.x -= 1
        if(event.key == 'a') ship.position.x += 1
    })

    
}

function generateAsteroids(asteroidObj)
{

}
main();