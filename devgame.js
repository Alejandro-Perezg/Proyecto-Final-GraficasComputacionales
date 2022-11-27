"use strict"; 

import * as THREE from './libs/three.js/three.module.js'
import { OrbitControls } from './libs/three.js/controls/OrbitControls.js';
import { OBJLoader } from './libs/three.js/loaders/OBJLoader.js';
import {Asteroid} from './Asteroid.js'

let counter = 0;
let renderer, scene, camera,orbitControls;
let shipGroup, ship, asteroid;
let asteroidList=[];
let shipObj = {obj:'/assets/spaceship/spaceship.obj', map:'/assets/spaceship/textures/Intergalactic Spaceship_rough.jpg'};
let asteroidObj = {obj:'assets/asteroid/10464_Asteroid_L3.123c72035d71-abea-4a34-9131-5e9eeeffadcb/asteroid.obj', map:'/assets/asteroid/10464_Asteroid_L3.123c72035d71-abea-4a34-9131-5e9eeeffadcb/10464_Asteroid_v1_diffuse.jpg'};
let up = false, down = false, right = false, left = false;



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

async function loadObj(objModel,xpos,ypos,zpos,scaleX,scaleY,scaleZ)
{
    try
    {
        const object = await new OBJLoader().loadAsync(objModel.obj, onProgress, onError);
        let texture = new THREE.TextureLoader().load(objModel.map);
        console.log(object);
        
    
            for(const child of object.children)
            {
      
                child.castShadow = true;
                child.receiveShadow = true;    
                child.material.map = texture;

            }
        

        object.scale.set(scaleX, scaleY, scaleZ);
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

function update() 
{

    requestAnimationFrame(function() { update(); });
    renderer.render( scene, camera ); 
    counter++
    if (counter % 10 == 0) { 
        counter = 0
        let renderedAsteroid = new Asteroid (0,10,155,asteroid.clone(), shipGroup)
        asteroidList.push(renderedAsteroid) 
    }

    for (let index = 0; index < asteroidList.length; index++) {
        const element = asteroidList[index];
        element.update()
        if (element.getPosition() <= -10) {
            element.despawn()
        }
    }

    orbitControls.update();
    shipMovement(shipGroup)
    
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
    //scene.background = new THREE.Color('gray') 

    camera = new THREE.PerspectiveCamera( 70, canvas.width / canvas.height, 1, 4000 );
    camera.position.set(-25, 2.5, 6.5);
    orbitControls = new OrbitControls(camera, renderer.domElement);

    const sun = new THREE.SpotLight(0xe9f7f7);
    sun.position.set(0,100,1000)
    sun.castShadow = true;
    scene.add(sun);

    shipGroup = new THREE.Object3D;
    ship = await loadObj(shipObj,0,-15,3,1,1,1);
    asteroid = await loadObj(asteroidObj,0,10,550,.005,.005,.005);
    

    shipGroup.add(ship);
     
    shipGroup.rotation.y = 1.8
    shipMovement(shipGroup)
    console.log(ship.position)

    scene.add(shipGroup);
   


}


function shipMovement(shipGroup)
{
    document.addEventListener("keydown", event=>{
        if(event.key == 'w') up = true
        if(event.key == 's') down = true
        if(event.key == 'd') right = true
        if(event.key == 'a') left = true
    })


    document.addEventListener("keyup", event=>{
        if(event.key == 'w') up = false
        if(event.key == 's') down = false
        if(event.key == 'd') right = false
        if(event.key == 'a') left = false
    })


    if (ship.position.x >= 36)left = false
    if (ship.position.x <= -32)right = false
    if (ship.position.y <= -15)down = false
    if (ship.position.y >= 15)up = false
      

    if(up) ship.position.y += 1;
    if(down) ship.position.y -= 1;
    if(right) ship.position.x -= 1;
    if(left) ship.position.x += 1;
}





main();

// u cant escape, it lives in your walls
// ███████╗██╗░░░██╗███╗░░██╗███╗░░██╗██╗░░░██╗
// ██╔════╝██║░░░██║████╗░██║████╗░██║╚██╗░██╔╝
// █████╗░░██║░░░██║██╔██╗██║██╔██╗██║░╚████╔╝░
// ██╔══╝░░██║░░░██║██║╚████║██║╚████║░░╚██╔╝░░
// ██║░░░░░╚██████╔╝██║░╚███║██║░╚███║░░░██║░░░
// ╚═╝░░░░░░╚═════╝░╚═╝░░╚══╝╚═╝░░╚══╝░░░╚═╝░░░

// ░█████╗░░█████╗░████████╗
// ██╔══██╗██╔══██╗╚══██╔══╝
// ██║░░╚═╝███████║░░░██║░░░
// ██║░░██╗██╔══██║░░░██║░░░
// ╚█████╔╝██║░░██║░░░██║░░░
// ░╚════╝░╚═╝░░╚═╝░░░╚═╝░░░

// ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡔⣻⠁⠀⢀⣀⣀⡀⠀⠀⠀⠀⠀⠀⠀⠀
// ⠀⠀⠀⠀⢀⣾⠳⢶⣦⠤⣀⠀⠀⠀⠀⠀⠀⠀⣾⢀⡇⡴⠋⣀⠴⣊⣩⣤⠶⠞⢹⣄⠀⠀⠀
// ⠀⠀⠀⠀⢸⠀⠀⢠⠈⠙⠢⣙⠲⢤⠤⠤⠀⠒⠳⡄⣿⢀⠾⠓⢋⠅⠛⠉⠉⠝⠀⠼⠀⠀⠀
// ⠀⠀⠀⠀⢸⠀⢰⡀⠁⠀⠀⠈⠑⠦⡀⠀⠀⠀⠀⠈⠺⢿⣂⠀⠉⠐⠲⡤⣄⢉⠝⢸⠀⠀⠀
// ⠀⠀⠀⠀⢸⠀⢀⡹⠆⠀⠀⠀⠀⡠⠃⠀⠀⠀⠀⠀⠀⠀⠉⠙⠲⣄⠀⠀⠙⣷⡄⢸⠀⠀⠀
// ⠀⠀⠀⠀⢸⡀⠙⠂⢠⠀⠀⡠⠊⠀⠀⠀⠀⢠⠀⠀⠀⠀⠘⠄⠀⠀⠑⢦⣔⠀⢡⡸⠀⠀⠀
// ⠀⠀⠀⠀⢀⣧⠀⢀⡧⣴⠯⡀⠀⠀⠀⠀⠀⡎⠀⠀⠀⠀⠀⢸⡠⠔⠈⠁⠙⡗⡤⣷⡀⠀⠀
// ⠀⠀⠀⠀⡜⠈⠚⠁⣬⠓⠒⢼⠅⠀⠀⠀⣠⡇⠀⠀⠀⠀⠀⠀⣧⠀⠀⠀⡀⢹⠀⠸⡄⠀⠀
// ⠀⠀⠀⡸⠀⠀⠀⠘⢸⢀⠐⢃⠀⠀⠀⡰⠋⡇⠀⠀⠀⢠⠀⠀⡿⣆⠀⠀⣧⡈⡇⠆⢻⠀⠀
// ⠀⠀⢰⠃⠀⠀⢀⡇⠼⠉⠀⢸⡤⠤⣶⡖⠒⠺⢄⡀⢀⠎⡆⣸⣥⠬⠧⢴⣿⠉⠁⠸⡀⣇⠀
// ⠀⠀⠇⠀⠀⠀⢸⠀⠀⠀⣰⠋⠀⢸⣿⣿⠀⠀⠀⠙⢧⡴⢹⣿⣿⠀⠀⠀⠈⣆⠀⠀⢧⢹⡄
// ⠀⣸⠀⢠⠀⠀⢸⡀⠀⠀⢻⡀⠀⢸⣿⣿⠀⠀⠀⠀⡼⣇⢸⣿⣿⠀⠀⠀⢀⠏⠀⠀⢸⠀⠇
// ⠀⠓⠈⢃⠀⠀⠀⡇⠀⠀⠀⣗⠦⣀⣿⡇⠀⣀⠤⠊⠀⠈⠺⢿⣃⣀⠤⠔⢸⠀⠀⠀⣼⠑⢼
// ⠀⠀⠀⢸⡀⣀⣾⣷⡀⠀⢸⣯⣦⡀⠀⠀⠀⢇⣀⣀⠐⠦⣀⠘⠀⠀⢀⣰⣿⣄⠀⠀⡟⠀⠀
// ⠀⠀⠀⠀⠛⠁⣿⣿⣧⠀⣿⣿⣿⣿⣦⣀⠀⠀⠀⠀⠀⠀⠀⣀⣠⣴⣿⣿⡿⠈⠢⣼⡇⠀⠀
// ⠀⠀⠀⠀⠀⠀⠈⠁⠈⠻⠈⢻⡿⠉⣿⠿⠛⡇⠒⠒⢲⠺⢿⣿⣿⠉⠻⡿⠁⠀⠀⠈⠁⠀⠀
// ⢀⠤⠒⠦⡀⠀⠀⠀⠀⠀⠀⠀⢀⠞⠉⠆⠀⠀⠉⠉⠉⠀⠀⡝⣍⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
// ⡎⠀⠀⠀⡇⠀⠀⠀⠀⠀⠀⡰⠋⠀⠀⢸⠀⠀⠀⠀⠀⠀⠀⢡⠈⢦⠀⠀⠀⠀⠀⠀⠀⠀⠀
// ⡇⠀⠀⠸⠁⠀⠀⠀⠀⢀⠜⠁⠀⠀⠀⡸⠀⠀⠀⠀⠀⠀⠀⠘⡄⠈⢳⡀⠀⠀⠀⠀⠀⠀⠀
// ⡇⠀⠀⢠⠀⠀⠀⠀⠠⣯⣀⠀⠀⠀⡰⡇⠀⠀⠀⠀⠀⠀⠀⠀⢣⠀⢀⡦⠤⢄⡀⠀⠀⠀⠀
// ⢱⡀⠀⠈⠳⢤⣠⠖⠋⠛⠛⢷⣄⢠⣷⠁⠀⠀⠀⠀⠀⠀⠀⠀⠘⡾⢳⠃⠀⠀⠘⢇⠀⠀⠀
// ⠀⠙⢦⡀⠀⢠⠁⠀⠀⠀⠀⠀⠙⣿⣏⣀⠀⠀⠀⠀⠀⠀⠀⣀⣴⣧⡃⠀⠀⠀⠀⣸⠀⠀⠀
// ⠀⠀⠀⠈⠉⢺⣄⠀⠀⠀⠀⠀⠀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣗⣤⣀⣠⡾⠃⠀⠀⠀
// ⠀⠀⠀⠀⠀⠀⠣⢅⡤⣀⣀⣠⣼⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⠉⠉⠉⠀⠀⠀⠀⠀
// ⠀⠀⠀⠀⠀⠀⠀⠀⠉⠉⠉⠁⠀⠉⣿⣿⣿⣿⣿⡿⠻⣿⣿⣿⣿⠛⠉⠀⠀⠀⠀⠀⠀⠀⠀
// ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣸⣿⣿⣿⠀⠀⠀⠀⣿⣿⣿⡿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
// ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣴⣿⣿⣿⣟⠀⠀⢠⣿⣿⣿⣿⣧⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
// ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢰⣿⣿⣿⣿⣿⠀⠀⢸⣿⣿⣿⣿⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
// ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⣿⣿⡏⠀⠀⢸⣿⣿⣿⣿⣿⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀
// ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⣿⣿⣿⣿⣿⠀⠀⠀⢺⣿⣿⣿⣿⣿⣿⣷⠀⠀⠀⠀⠀⠀⠀⠀
// ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣿⣿⣿⣿⣿⠀⠀⠀⠀⠈⠉⠻⣿⣿⣿⠟⠀⠀⠀⠀⠀⠀⠀⠀
// ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⢿⣿⣿⣿⠏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀