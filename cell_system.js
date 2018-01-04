/*
* Last update: 04/01/18
*
* This is the NON OPTIMISE VERSION.
* The assumption here is that Cell is a Javascript Object that implement
* the IA of a steering behavior. We store them in a javascript
* Array full of other things with update() methods.
*
* NOTE: In this benchmark we only implement one type of Cell.
* The Cell implement the seek steering behavior proposed by Craig W. Reynolds.
*
* IMO this is a common, readable, and fine code if you only have a few entities.
*
* However it fails to scale up to large numbers (>= 1000).
* Its because we face to the cost of V8 inline-caching, hidden-class which involves cache-misses.
*/

'use strict';

/*------------------------ UTILS PART -----------------------------------*/

class Vector {

    constructor(x = 0.0, y = 0.0) {
        this.x = x
        this.y = y
    }

    add(vector) {
        this.x += vector.x
        this.y += vector.y
        return this
    }

    normalized() {
        const x = this.x
        const y = this.y
        const length = Math.sqrt(x * x + y * y)

        if (length > 0) {
            this.x = x / length
            this.y = y / length
        }

        return this
    }

    sub(vector) {
        // New memory allocation :(
        return new Vector(this.x - vector.x, this.y - vector.y)
    }
}

function random(min = 0.0, max = 100.0) {
    return Math.floor(Math.random() * (max - min + 1.0 ) + min);
}

/*-----------------------------------------------------------*/

class Cell {

    constructor(startPosition, targetPosition) {
        this.target = targetPosition
        this.position = startPosition
        this.velocity = new Vector(0, 0)
    }

    /**
     * Implementation of the seek steering behavior.
     */
    update() {
        let velocityDesired, vecSteer

        velocityDesired = this.target.sub(this.position).normalized()

        vecSteer = velocityDesired.sub(this.velocity)

        this.velocity.add(vecSteer)

        this.position.add(this.velocity)
    }
}

// You can modify the samples of the benchmark with this configs variables.
const NB_CELL = 1000000
const NB_UPDATE = 1000

function main() {
    let cells = []

    // We store the "different" cell in the same Array but they all have a update() method.
    // Remember, for this benchmark we only have one type of Cell but you can add yours.
    for (let i = 0; i < NB_CELL; i++)
        cells.push(new Cell(new Vector(random(), random()), new Vector(random(), random())))

    // We update the World system by calling update() for each cells.
    for (let j = 0; j < NB_UPDATE; j++)
        cells.forEach(c => c.update())

    //console.log(cells[0].position, cells[0].target);
}

main()
