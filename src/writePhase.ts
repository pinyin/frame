import {onFrameUpdate} from 'framesync'

export async function writePhase(): Promise<void> {
    return new Promise<void>(resolve => onFrameUpdate(resolve, true))
}
