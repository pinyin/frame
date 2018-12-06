import { nextFrame } from './nextFrame'
import { OptimizeFor } from './OptimizeFor'
import { Phase } from './Phase'
import { Queue } from './Queue'

class Scheduler {
    async schedule(
        task: () => void,
        phase: Phase.WRITE | Phase.READ,
        optimizeFor: OptimizeFor = OptimizeFor.PERFORMANCE,
    ): Promise<void> {
        if (
            this.phases.indexOf(this.currentPhase) > this.phases.indexOf(phase)
        ) {
            switch (optimizeFor) {
                case OptimizeFor.PERFORMANCE:
                    this.nextFrameTasks[phase].schedule(task)
                    break
                case OptimizeFor.LATENCY:
                    this.tasks[phase].schedule(task)
                    this.nextFrameTasks[phase].moveInto(this.tasks[phase]) // TDOO
                    this.phases = [this.currentPhase, phase]
                    break
            }
        } else {
            this.tasks[phase].schedule(task)
        }

        await this.enterFrame()
        if (!this.nextFrameScheduled && this.nextFrameHasTask) {
            await this.scheduleNextFrame()
        }
    }

    private async enterFrame(): Promise<void> {
        // add to current microtask
        // only work with browser that has native Promise support
        while (this.hasTask) {
            await Promise.resolve()
            this.phases.forEach(phase => {
                if (this.tasks[phase].hasTask) {
                    this.currentPhase = phase
                    try {
                        this.tasks[phase].execute()
                    } catch {}
                }
            })
        }
    }

    private get hasTask(): boolean {
        return this.tasks.filter(queue => queue.hasTask).length > 0
    }

    private get nextFrameHasTask(): boolean {
        return this.nextFrameTasks.filter(queue => queue.hasTask).length > 0
    }

    private currentPhase = DefaultPhaseOrder[0]
    private phases = DefaultPhaseOrder
    private tasks = [new Queue(), new Queue()]
    private nextFrameTasks = [new Queue(), new Queue()]

    private async scheduleNextFrame(): Promise<void> {
        this.nextFrameScheduled = true
        await nextFrame()
        if (!this.nextFrameScheduled) {
            return
        }
        this.nextFrameScheduled = false
        const emptyTasks = this.tasks
        this.tasks = this.nextFrameTasks
        this.nextFrameTasks = emptyTasks
        this.currentPhase = DefaultPhaseOrder[0]
        this.phases = DefaultPhaseOrder
        this.enterFrame()
    }

    private nextFrameScheduled: boolean = false
}

const DefaultPhaseOrder: [Phase, Phase] = [Phase.WRITE, Phase.READ] // [Phase.READ, Phase.WRITE]

export const SCHEDULER = new Scheduler()
