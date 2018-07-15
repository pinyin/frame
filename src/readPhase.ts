import {onFrameStart} from 'framesync'
import {SynchronousPromise} from 'synchronous-promise'

export async function readPhase(): SynchronousPromise<void> {
    return new SynchronousPromise<void>(resolve => onFrameStart(resolve, true))
}
