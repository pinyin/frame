import {nextFrame} from './nextFrame'
import {OptimizeFor} from './OptimizeFor'
import {Phase} from './Phase'
import {Queue} from './Queue'

class Scheduler {
    schedule(task: () => void,
             phase: Phase.WRITE | Phase.READ,
             optimizeFor: OptimizeFor = OptimizeFor.PERFORMANCE): void {
        switch (this.phase) {
            case Phase.WRITE:
                this.frame[phase].schedule(task)
                break
            case Phase.READ:
                switch (phase) {
                    case Phase.WRITE:
                        switch (optimizeFor) {
                            case OptimizeFor.PERFORMANCE:
                                this.nextFrame[phase].schedule(task)
                                break
                            case OptimizeFor.LATENCY:
                                this.prepareThrash()
                                this.frame[phase].schedule(task)
                                break
                        }
                        break
                    case Phase.READ:
                        this.frame[phase].schedule(task)
                        break
                }
                break
        }
        this.runTasks()
    }

    private async runTasks(): Promise<void> {
        // add to current microtask
        // only work with browser that has native Promise support
        await Promise.resolve()
        if (!this.hasTask) {
            return
        }

        while (this.hasTask) {
            [Phase.WRITE, Phase.READ].forEach(phase => {
                this.phase = phase
                this.frame[phase].execute()
            })
        }

        await nextFrame()
        this.phase = Phase.WRITE
        if (!this.nextFrameHasTask) {
            return
        }

        const emptyFrame = this.frame
        this.frame = this.nextFrame
        this.nextFrame = emptyFrame
        this.runTasks()
    }

    private get hasTask(): boolean {
        return this.frame.filter(queue => queue.hasTask).length > 0
    }

    private get nextFrameHasTask(): boolean {
        return this.nextFrame.filter(queue => queue.hasTask).length > 0
    }

    private prepareThrash(): void {
        [Phase.WRITE, Phase.READ].forEach(phase => {
            this.nextFrame[phase].reschedule(this.frame[phase])
        })
    }

    private frame: [Queue, Queue] = [new Queue(), new Queue()]
    private phase: Phase = Phase.READ
    private nextFrame: [Queue, Queue] = [new Queue(), new Queue()]
}

export const SCHEDULER = new Scheduler()

