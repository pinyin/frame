import {onFrameStart} from 'framesync'

export async function readPhase(): Promise<void> {
    return new Promise<void>(resolve => onFrameStart(resolve, true))
}
