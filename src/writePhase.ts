import {onFrameUpdate} from 'framesync'
import {SynchronousPromise} from 'synchronous-promise'

export async function writePhase(): SynchronousPromise<void> {
    return new SynchronousPromise<void>(resolve => onFrameUpdate(resolve))
}
