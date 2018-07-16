import {nextFrame} from './nextFrame'
import {OptimizeFor} from './OptimizeFor'
import {Phase} from './Phase'
import {Queue} from './Queue'

class Scheduler {
    async schedule(task: () => void,
                   phase: Phase.WRITE | Phase.READ,
                   optimizeFor: OptimizeFor = OptimizeFor.PERFORMANCE): Promise<void> {
        if (PhaseOrder.indexOf(this.currentPhase) > PhaseOrder.indexOf(phase)) {
            switch (optimizeFor) {
                case OptimizeFor.PERFORMANCE:
                    this.nextFrameTasks[phase].schedule(task)
                    break
                case OptimizeFor.LATENCY:
                    this.tasks[phase].schedule(task)
                    this.nextFrameTasks[phase].moveInto(this.tasks[phase]) // TDOO
                    break
            }
        } else {
            this.tasks[phase].schedule(task)
        }

        await this.enterFrame()
        if (this.nextFrameHasTask) {
            this.needNextFrame = true
            await nextFrame()
            await this.prepareNextFrame()
        }
    }

    private async enterFrame(): Promise<void> {
        // add to current microtask
        // only work with browser that has native Promise support
        while (this.hasTask) {
            await Promise.resolve()
            PhaseOrder.forEach(phase => {
                this.currentPhase = phase
                try { this.tasks[phase].execute() } catch {}
            })
        }
    }

    private get hasTask(): boolean {
        return this.tasks.filter(queue => queue.hasTask).length > 0
    }

    private get nextFrameHasTask(): boolean {
        return this.nextFrameTasks.filter(queue => queue.hasTask).length > 0
    }

    private currentPhase: Phase = PhaseOrder[0]
    private tasks: [Queue, Queue] = [new Queue(), new Queue()]
    private nextFrameTasks: [Queue, Queue] = [new Queue(), new Queue()]
    private needNextFrame: boolean = false

    private prepareNextFrame(): void {
        if (!this.needNextFrame) {
            return
        }
        this.needNextFrame = false
        this.tasks.forEach(queue => queue.clear())
        const emptyTasks = this.tasks
        this.tasks = this.nextFrameTasks
        this.nextFrameTasks = emptyTasks
        this.currentPhase = PhaseOrder[0]
        this.enterFrame()
    }
}

const PhaseOrder = [Phase.WRITE, Phase.READ]

export const SCHEDULER = new Scheduler()

