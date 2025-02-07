import GoogleSpreadsheet from 'public-google-sheets-parser';
import { logger } from '../logging.js';
import { sendPasswordEmail } from '../routers/mail.js';

interface UserInfo {
  name: string;
  email: string;
  password: string;
  balance: number;
}

export async function fetchUsers(spreadsheetId: string): Promise<UserInfo[]> {
    try {
        //@ts-ignore
        const spreadsheet = new GoogleSpreadsheet(spreadsheetId, {sheetName: "Email"});
        const data = await spreadsheet.parse();
        logger.info(`Fetched ${data.length} users`);
        return data as UserInfo[];

    } catch (error) {
        console.error('Error fetching data:', error);
        return [];

    }
}

export async function sendEmails() {
    const users = await fetchUsers(process.env.GOOGLE_SHEET_ID as string);

    await Promise.all(
        users.map(async user => {
            await sendPasswordEmail(user.name, user.email, user.password);
            logger.info("Email sent to", user.email);
        })
    );

    logger.info("All emails sent");
}
