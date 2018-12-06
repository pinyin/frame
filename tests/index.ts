import { nextFrame } from '../src/nextFrame'
import { writePhase } from '../src/writePhase'
import { readPhase } from '../src/readPhase'
import { OptimizeFor } from '../src/OptimizeFor'

function output(...s: any): void {
    // output(...s)
    document.write(...s)
}

async function readWrite(prefix: string) {
    // let color = Math.floor(Math.random() * 1000)
    // await writePhase()
    // output(`%c write 1`, `color: #${color};`)
    // await readPhase()
    // output(`%c read  1`, `color: #${color};`)
    // await writePhase(OptimizeFor.LATENCY)
    // output(`%c write 2`, `color: #${color};`)
    // await writePhase()
    // output(`%c write 3`, `color: #${color};`)
    // await readPhase()
    // output(`%c read  2`, `color: #${color};`)
    // await readPhase()
    // output(`%c read  3`, `color: #${color};`)
    // await writePhase()
    // output(`%c write 4`, `color: #${color};`)

    await writePhase()
    output(`${prefix}w1 `)
    await readPhase()
    output(`${prefix}r1 `)
    await writePhase(OptimizeFor.LATENCY)
    output(`${prefix}w2 `)
    await writePhase()
    output(`${prefix}w3 `)
    await readPhase()
    output(`${prefix}r2 `)
    await readPhase()
    output(`${prefix}r3 `)
    await writePhase()
    output(`${prefix}w4 `)
}

function run() {
    const f = () =>
        requestAnimationFrame(() => {
            output('f ')
            f()
        })
    f()
    const t = () =>
        setTimeout(() => {
            output('t ')
            t()
        })
    t()
    readWrite('1')
    readWrite('2')
    readWrite('3')
}

document.body.onclick = () => {
    document.body.onclick = () => {}
    run()
}
