/*
* Last update: 04/01/18
*
* This is the OPTIMISE VERSION.
* The assumption here is that each world has its own TransformComponent manager.
* We should don't have a single System where everything has to live like the non optimise version.
* Instead we have to create multiple system, each populated with its own entities to be cache friendly.
*
* NOTE: In this benchmark we only implement one type of Cell with only one system.
* The Cell implement the seek steering behavior proposed by Craig W. Reynolds.
*/
'use strict';

const NB_CELL = 1000000
const NB_UPDATE = 1000

let offset = 0
const payload = new Uint8Array(NB_CELL)
const random = () => payload[offset++ % payload.length]

require("crypto").randomFillSync(payload);

class CellSystem {

    constructor(size) {
        // The component data are packed tightly in memory for good cache performance.
        const data = new Float32Array(size * 6)

        for (let i = 0; i < size; i += 6) {
            // target x, y
            data[i + 0] = random()
            data[i + 1] = random()
            // position x, y
            data[i + 2] = random()
            data[i + 3] = random()
            // velocity x,y = 5, 6
        }

        this.data = data
    }

    update() {
        const data = this.data

        for (let i = 0; i < data.length; i += 6) {
            // velocity desired = target - position
            const velDesired_x = data[i + 0] - data[i + 2]
            const velDesired_y = data[i + 1] - data[i + 3]

            if (velDesired_x === 0 || velDesired_y === 0) {
                continue
            }

            // normalize th evelocity desired
            const length = Math.sqrt(velDesired_x * velDesired_x + velDesired_y * velDesired_y)
            data[i + 4] = velDesired_x / length
            data[i + 5] = velDesired_y / length

            // position = position + new velocity
            data[i + 2] += data[i + 4]
            data[i + 3] += data[i + 5]
        }
    }
}

function main() {
    const cellSystem = new CellSystem(NB_CELL)

    for (let i = 0; i < NB_UPDATE; i++) {
        cellSystem.update()
    }
}

main()
