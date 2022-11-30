class Bullet
{
    constructor(x,y,z,bulletObj, shipPosition, shipgroup)
    {
    this.x = x
    this.y = y
    this.z = z
    this.bulletObj = bulletObj
    this.shipPosition = shipPosition

    shipgroup.add(this.bulletObj)
    }

    update()
    {   
        this.bulletObj.position.z += 2
    }
}


export{Bullet}