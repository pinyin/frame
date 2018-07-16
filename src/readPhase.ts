import {SynchronousPromise} from 'synchronous-promise'
import {OptimizeFor} from './OptimizeFor'
import {Phase} from './Phase'
import {SCHEDULER} from './Scheduler'

export async function readPhase(optimizeFor: OptimizeFor = OptimizeFor.PERFORMANCE): Promise<void> {
    return new SynchronousPromise<void>(resolve => {
        SCHEDULER.schedule(resolve, Phase.READ, optimizeFor)
    })
}
