class Asteroid
{
    constructor(x,y,z,asteroidObj, scene)
    {
        this.x = x
        this.y = y
        this.z = z
        this.asteroidObj = asteroidObj.clone()
        scene.add(asteroidObj)

        this.onscreen = true
   

    }

     update()
    {
        const now = Date.now();
        let currentTime = Date.now();
        const duration = 5000;

        const deltat = now - currentTime;
        currentTime = now;
        const fract = deltat / duration;
        const angle = Math.PI * 2 * fract;
        const max = 30;
        const min = -30;

        this.asteroidObj.rotation.x += angle
        this.asteroidObj.rotation.z += angle
        //sacar de la escena y remover
        // if (asteroidObj.position.z >= 0) this.onscreen = true;
        // if (asteroidObj.position.z <=-40) this.onscreen = false;       
      
    
        // if (this.onscreen) { 
        //     asteroidObj.position.z -= 1.5 
        // } else {
            this.asteroidObj.position.z = 70
            this.asteroidObj.position.x = (Math.random()) * (max - min) + min;
            this.asteroidObj.position.y = (Math.random()) * (max - min) + min;
        
    }
}

export{Asteroid}