import {onFrameUpdate} from 'framesync'
import {SynchronousPromise} from 'synchronous-promise'

export async function writePhase(): Promise<void> {
    return new SynchronousPromise<void>(resolve => onFrameUpdate(resolve, true))
}
