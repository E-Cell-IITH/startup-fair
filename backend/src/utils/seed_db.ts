import GoogleSpreadsheet from 'public-google-sheets-parser';
import { User } from '../entity/User';
import { Startup } from '../entity/Startup';
import { AppDataSource } from '../data-source';
import { logger } from '../logging';

interface UserInfo {
  name: string;
  email: string;
  password: string;
}

interface StartupInfo {
    name: string;
    icon: string;
    valuation: number;
  }

export async function fetchUsers(spreadsheetId: string): Promise<UserInfo[]> {
    try {
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
    const users = (await fetchUsers(process.env.GOOGLE_SHEET_ID as string))
        .map(user => usersRepository.create(user));
    const startups = (await fetchStartups(process.env.GOOGLE_SHEET_ID as string))
        .map(startup => startupsRepository.create(startup));
    
    await AppDataSource.getRepository(User).delete({});
    await AppDataSource.getRepository(User).save(users);
    
    await AppDataSource.getRepository(Startup).delete({});
    await AppDataSource.getRepository(Startup).save(startups);
}
