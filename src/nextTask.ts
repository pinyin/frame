export function nextTask(): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, 0))
}
