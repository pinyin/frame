// inspired by https://github.com/Popmotion/framesync

export class Queue {
    schedule(task: () => void): void {
        this.tasks.push(task)
    }

    execute(): void {
        for (let i = 0; i < this.tasks.length; i++) {
            try { this.tasks[i]() } catch {}
        }

        this.tasks.length = 0
    }

    moveInto(to: Queue): void {
        for (let i = 0; i < this.tasks.length; i++) {
            try { to.schedule(this.tasks[i]) } catch {}
        }

        this.tasks.length = 0
    }

    clear(): void {
        this.tasks.length = 0
    }

    get hasTask(): boolean {
        return this.tasks.length > 0
    }

    private readonly tasks: Array<() => void> = []
}

