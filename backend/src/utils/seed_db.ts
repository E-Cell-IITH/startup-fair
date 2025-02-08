import GoogleSpreadsheet from 'public-google-sheets-parser';
import { User } from '../entity/User.js';
import { Startup } from '../entity/Startup.js';
import { AppDataSource } from '../data-source.js';
import { logger } from '../logging.js';
import * as bcrypt from 'bcrypt';

interface UserInfo {
  name: string;
  email: string;
  password: string;
  balance: number;
}

interface StartupInfo {
    id: string;
    name: string;
    icon: string;
    valuation: number;
  }

export async function fetchUsers(spreadsheetId: string): Promise<UserInfo[]> {
    try {
        //@ts-ignore
        const spreadsheet = new GoogleSpreadsheet(spreadsheetId, {sheetId: "0"});
        const data = await spreadsheet.parse();
        logger.info(`Fetched ${data.length} users`);
        return data as UserInfo[];

    } catch (error) {
        console.error('Error fetching data:', error);
        return [];

    }
}

export async function fetchStartups(spreadsheetId: string): Promise<StartupInfo[]> {
    try {
        //@ts-ignore
        const spreadsheet = new GoogleSpreadsheet(spreadsheetId, {"sheetName": "Startup"});
        const data = await spreadsheet.parse();
        logger.info(`Fetched ${data.length} startups`);
        return data as StartupInfo[];

    } catch (error) {
        console.error('Error fetching data:', error);
        return [];

    }
}

export async function seedDatabase() {
    const usersRepository = AppDataSource.getRepository(User);
    const startupsRepository = AppDataSource.getRepository(Startup);
    
    const users = (await fetchUsers(process.env.GOOGLE_SHEET_ID as string)).map(user => {
        
        user.password = bcrypt.hashSync(user.password, 10);
        user.email = user.email.toLowerCase();

        return usersRepository.create({...user, verificationToken: '', verified: true});
    });
    
    const startups = (await fetchStartups(process.env.GOOGLE_SHEET_ID as string))
        .map(startup => startupsRepository.create(startup));
    
    // await AppDataSource.getRepository(User).delete({});
    await AppDataSource.getRepository(User).upsert(users, ['email']);
    
    // await AppDataSource.getRepository(Startup).delete({});
    await AppDataSource.getRepository(Startup).upsert(startups, ['id']);
}
