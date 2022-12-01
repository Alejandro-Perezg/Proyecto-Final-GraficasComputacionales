
class Asteroid
{
    constructor(x,y,z,asteroidObj, shipgroup)
    {
        this.x = x
        this.y = y
        this.z = z
        this.asteroidObj = asteroidObj.clone()
        shipgroup.add(this.asteroidObj)

        const max = 15;
        const min = -15;
        this.asteroidObj.position.x = (Math.random()) * (max - min) + min;
        this.asteroidObj.position.y = (Math.random()) * (max - min) + min;
        
        
        
    }

     update()
    {
        this.asteroidObj.position.z -= 2 
    }       

    despawn()
    {
        this.asteroidObj.clear()
    }

    getPosition()
    {
        let position = this.asteroidObj.position
        return position
    }
    
}

export{Asteroid}