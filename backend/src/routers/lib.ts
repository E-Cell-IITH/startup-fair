import { FastifyInstance, FastifyReply } from "fastify";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import { Equity } from "../entity/Investment";

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

export var GlobalStats = {
    users: 0,
    payments: 0,
    recent_payments: 0,
    average_response_time: 0,
    max_response_time: 0,

    next_max_response_time: 0,
    next_average_response_time: 0,
    next_recent_payments: 0,
    n_requests: 0
} 

setInterval(() => {
    GlobalStats.recent_payments = GlobalStats.next_recent_payments;
    GlobalStats.average_response_time = GlobalStats.n_requests ? GlobalStats.next_average_response_time/GlobalStats.n_requests : 0;
    GlobalStats.max_response_time = GlobalStats.next_max_response_time;

    GlobalStats.next_max_response_time = 0;
    GlobalStats.next_average_response_time = 0;
    GlobalStats.next_recent_payments = 0;
    GlobalStats.n_requests = 0;
}, 5000)

export function attachStats(server: FastifyInstance) {
    server.addHook('onRequest', async (request, reply) => {
        GlobalStats.n_requests++;
    });

    server.addHook('onResponse', async (request, reply) => {
        GlobalStats.next_average_response_time += reply.elapsedTime;
        GlobalStats.next_max_response_time = Math.max(GlobalStats.next_max_response_time, reply.elapsedTime);
    });

    server.addHook('onReady', async () => {
        const userRepository = AppDataSource.getRepository(User);
        const equityRepository = AppDataSource.getRepository(Equity);

        GlobalStats.users = await userRepository.count();
        GlobalStats.payments = await equityRepository.count();
    })
}