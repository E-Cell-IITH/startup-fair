import { User } from '../entity/User.js';
import { AppDataSource } from '../data-source.js';
import * as bcrypt from 'bcrypt';
import { logger } from '../logging.js';

export async function createAdmin() {
    const usersRepository = AppDataSource.getRepository(User);

    const admin = {
        name: 'admin',
        email: process.env.ADMIN_EMAIL || 'admin@ecell.iith',
        password: bcrypt.hashSync(process.env.ADMIN_PASSWORD || 'ECell-VMF-ftw' as string, 10),
        isAdmin: true,
        balance: 0
    }

    const user = await usersRepository.findOneBy({ email: admin.email })
    
    if (user) {
        logger.error(`Admin user with email ${admin.email} already exists! Aborting!`);
        return 1;
    }

    await usersRepository.save(usersRepository.create(admin));
    logger.info(`Admin user with email ${admin.email} created successfully`);
    return 0
}