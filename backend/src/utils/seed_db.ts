import 'dotenv/config';
import 'reflect-metadata';
import { AppDataSource } from '../data-source';
import { Equity } from '../entity/Investment';
import { Startup } from '../entity/Startup';
import { User } from '../entity/User';

AppDataSource.initialize().then(async () => {

    console.log('Database Connected');

    const userRepository = AppDataSource.getRepository(User);
    const startupRepository = AppDataSource.getRepository(Startup);
    const investmentRepository = AppDataSource.getRepository(Equity);

    const user1 = userRepository.create({
        name: 'User A',
        email: 'user.a@example.com',
        password: 'password',
        balance: 1000
    });

    const user2 = userRepository.create({
        name: 'User B',
        email: 'user.b@example.com',
        password: 'password',
        balance: 20
    });

    await userRepository.save([user1, user2]);

    const startup1 = startupRepository.create({
        name: 'Startup A',
        icon: 'icon_a.png',
        equity_sold: 20,
        valuation: 100
    });

    const startup2 = startupRepository.create({
        name: 'Startup B',
        icon: 'icon_b.png',
        equity_sold: 10,
        valuation: 200
    });

    await startupRepository.save([startup1, startup2]);

    const investment1 = investmentRepository.create({
        amount: 20,
    });
    investment1.user = user2,
    investment1.startup = startup1

    const investment2 = investmentRepository.create({
        amount: 20,
    });
    investment2.user = user2,
    investment2.startup = startup2

    await investmentRepository.save([investment1, investment2]);

    await AppDataSource.destroy()

})