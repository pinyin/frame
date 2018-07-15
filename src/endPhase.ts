import {onFrameEnd} from 'framesync'
import {SynchronousPromise} from 'synchronous-promise'

export async function endPhase(): SynchronousPromise<void> {
    return new SynchronousPromise<void>(resolve => onFrameEnd(resolve, true))
}
