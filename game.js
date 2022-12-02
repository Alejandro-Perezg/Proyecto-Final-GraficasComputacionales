"use strict"; 

import * as THREE from './libs/three.js/three.module.js'
import { OrbitControls } from './libs/three.js/controls/OrbitControls.js';
import { OBJLoader } from './libs/three.js/loaders/OBJLoader.js';
import {Asteroid} from './Asteroid.js'
import { Bullet } from './Bullet.js';

let counter = 0;
let renderer, scene, camera, orbitControls;
let shipGroup, ship, asteroid,renderedBullet, bulletMaterial, bulletGeometry, bulletList = [];
let shipBoundingBox;
let asteroidList=[];
let shipObj = {obj:'/assets/spaceship/spaceship.obj', map:'/assets/spaceship/textures/Intergalactic Spaceship_rough.jpg'};
let asteroidObj = {obj:'assets/asteroid/10464_Asteroid_L3.123c72035d71-abea-4a34-9131-5e9eeeffadcb/asteroid.obj', map:'/assets/asteroid/10464_Asteroid_L3.123c72035d71-abea-4a34-9131-5e9eeeffadcb/10464_Asteroid_v1_diffuse.jpg'};
let up = false, down = false, right = false, left = false, shooting = false;
let hitSound;
let canShoot=true, delayBullet = 0;

let asteroidBoundingBox, bulletBoundingBox;
let score = 0;
let play= true;
let bestscore = 0;



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
    if (play)
    {

        requestAnimationFrame(function() { update(); });
        renderer.render( scene, camera ); 
        counter++
        if (counter % 20 == 0) { 
            counter = 0
            let renderedAsteroid = new Asteroid (0,10,155,asteroid, shipGroup)
            asteroidList.push(renderedAsteroid) 
        }

        delayBullet++;

        if (( delayBullet > 10  ) && (canShoot==false) )  { 
            canShoot=true;   
            delayBullet = 0
        }

        for (let index = 0; index < bulletList.length; index++) {
            const bulletElement = bulletList[index];
            bulletBoundingBox = new THREE.Sphere(bulletElement.getPosition(), 5)
            bulletElement.update()    
        }
        
        for (let index = 0; index < asteroidList.length; index++) {
            const element = asteroidList[index];
            asteroidBoundingBox = new THREE.Sphere(element.getPosition(), 4) //se crea la hitbox del asteroide
            element.update()
            if(element.getPosition().z == -50)
            {
                element.despawn()
                score -= 3
            }
        
            if(asteroidBoundingBox.intersectsBox(shipBoundingBox)) //se checa cuando choca la nave y el asteroide
            {
                element.despawn()  
                hitSound.play() 
                score += 1
            }

            for(let indexBullet = 0; indexBullet < bulletList.length; indexBullet++){
                const bulletElement = bulletList[indexBullet];
                bulletBoundingBox = new THREE.Sphere(bulletElement.getPosition(), 2)

                if(asteroidBoundingBox.intersectsSphere(bulletBoundingBox)){
                    element.despawn();
                    score+=2;
                        
                }
            }


        }

        document.getElementById('score').innerHTML = "score: " + score;
        document.getElementById('bestscore').innerHTML = "Best score: " + bestscore;


        if (score == 0 && score <= 20) {
            document.getElementById('endorse').innerHTML = "GOOD!";
        }

        if (score >= 21 && score <= 40) {
            document.getElementById('endorse').innerHTML = "VERY GOOD!";
        }

        if (score <= -1 && score >= -20) {
            document.getElementById('endorse').innerHTML = "BAD!";
        }
        if (score <= -21 && score >= -40) {
            document.getElementById('endorse').innerHTML = "VERY BAD!!";
        }

        if (score <= -41) {
            document.getElementById('endorse').innerHTML = "UNLUCKY";
        }

        if (score > bestscore) {
            bestscore = score;
        }
        if (score <= -51) {
            play = false
            alert("you lose! Best score: " + bestscore);
            document.location.reload(true)
        }
        orbitControls.update();
        shipMovement(ship);
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
    

    camera = new THREE.PerspectiveCamera( 70, canvas.width / canvas.height, 1, 4000 );
    camera.position.set(-25, 2.5, 6.5);
    orbitControls = new OrbitControls(camera, renderer.domElement);


    const listener = new THREE.AudioListener();
    camera.add( listener );

    const audioLoader = new THREE.AudioLoader();
    const backgroundSound = new THREE.Audio(listener);

    audioLoader.load( '/assets/music/corneria.mp3', function( buffer ) {
        backgroundSound.setBuffer( buffer );
        backgroundSound.setLoop(true);
        backgroundSound.setVolume(0.5);
        backgroundSound.play();
    });

    hitSound = new THREE.Audio(listener);

    audioLoader.load( '/assets/music/hit.wav', function( buffer ) {
        hitSound.setBuffer( buffer );
        hitSound.setLoop(false);
        hitSound.setVolume(0.3);
    });


    

 

    const sun = new THREE.SpotLight(0xe9f7f7);
    sun.position.set(0,100,1000)
    sun.castShadow = true;
    scene.add(sun);

    shipGroup = new THREE.Object3D;

    ship = await loadObj(shipObj,0,-15,3,1,1,1);
    shipBoundingBox = new THREE.Sphere(ship.position, 5) //se crea el hitbox de la nave


    asteroid = await loadObj(asteroidObj,0,10,550,.005,.005,.005);
    

    bulletGeometry = new THREE.SphereGeometry(.5,30,30)
    bulletMaterial = new THREE.MeshBasicMaterial({color: 'blue'})
   
   
    shipGroup.add(ship);
    shipGroup.rotation.y = 1.8
    scene.add(shipGroup);
}


function shipMovement(ship)
{

    document.addEventListener("keydown", event=>{
        if(event.key == 'w') up = true
        if(event.key == 's') down = true
        if(event.key == 'd') right = true
        if(event.key == 'a') left = true
        if(event.key == ' ') shooting = true
    })


    document.addEventListener("keyup", event=>{
        if(event.key == 'w') up = false
        if(event.key == 's') down = false
        if(event.key == 'd') right = false
        if(event.key == 'a') left = false
        if(event.key == ' ') shooting = false
    })


    if (ship.position.x >= 36)left = false
    if (ship.position.x <= -32)right = false
    if (ship.position.y <= -15)down = false
    if (ship.position.y >= 15)up = false
      

    if(up) ship.position.y += 1;
    if(down) ship.position.y -= 1;
    if(right) ship.position.x -= 1;
    if(left) ship.position.x += 1;
    
    if (shooting && canShoot){
        canShoot=false;
        let bulletMesh = new THREE.Mesh(bulletGeometry,bulletMaterial)
        bulletMesh.position.x = ship.position.x;
        bulletMesh.position.y = ship.position.y;
        bulletMesh.position.z = ship.position.z;

        

        renderedBullet = new Bullet(ship.position.x,ship.position.y,ship.position.z,bulletMesh,ship.position,shipGroup);
        bulletList.push(renderedBullet)

    }
}



main();


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