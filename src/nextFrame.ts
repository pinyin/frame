import {onFrameStart} from 'framesync'
import {SynchronousPromise} from 'synchronous-promise'

export async function nextFrame(): SynchronousPromise<void> {
    return new SynchronousPromise<void>(resolve => onFrameStart(resolve))
}
