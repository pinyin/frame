import {onFrameStart} from 'framesync'

export async function nextFrame(): Promise<void> {
    return new Promise<void>(resolve => onFrameStart(resolve, false))
}
