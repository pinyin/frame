import {onFrameEnd} from 'framesync'
import {SynchronousPromise} from 'synchronous-promise'

export async function endPhase(): Promise<void> {
    return new SynchronousPromise<void>(resolve => onFrameEnd(resolve, true))
}
