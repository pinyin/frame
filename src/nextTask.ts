import {SynchronousPromise} from 'synchronous-promise'

export function nextTask(): Promise<void> {
    return new SynchronousPromise(resolve =>
        setTimeout(resolve, 0),
    )
}
