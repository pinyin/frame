import {SynchronousPromise} from 'synchronous-promise'

export function forDuration(ms: number): Promise<void> {
    return new SynchronousPromise(resolve =>
        setTimeout(resolve, ms),
    )
}
