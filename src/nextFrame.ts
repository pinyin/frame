import {SynchronousPromise} from 'synchronous-promise'

export async function nextFrame(): Promise<void> {
    return new SynchronousPromise<void>(resolve =>
        requestAnimationFrame(() => resolve()),
    )
}
