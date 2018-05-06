import {onFrameEnd} from 'framesync'

export async function endPhase(): Promise<void> {
    return new Promise<void>(resolve => onFrameEnd(resolve, true))
}
