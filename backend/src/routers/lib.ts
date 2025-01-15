export class Mutex {

    locked: boolean;
    waitingQueue: Array<() => void>

    constructor() {
        this.locked = false;
        this.waitingQueue = [];
    }
  
    async acquire() {
        return new Promise<void>((resolve, reject) => {
            if (!this.locked) {
                this.locked = true;
                resolve();
            } else {
                this.waitingQueue.push(resolve);
            }
        });
    }
  
    release() {
        if (this.waitingQueue.length > 0) {
            const nextResolve = this.waitingQueue.shift() as () => void;
            nextResolve();
        } else {
            this.locked = false;
        }
    }
}

export class MutexManager {
    
    mutexes: Map<number, Mutex>;

    constructor() {
        this.mutexes = new Map();
    }

    getMutex(id: number): Mutex {
        if (!this.mutexes.has(id)) {
            this.mutexes.set(id, new Mutex());
        }
        return this.mutexes.get(id) as Mutex;
    }

    dropMutex(id: number) {
        this.mutexes.delete(id);
    }
}