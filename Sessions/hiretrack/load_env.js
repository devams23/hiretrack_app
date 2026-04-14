
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { log } from 'console';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({path: 'src/.env'}); 


const successColor = '\x1b[32m%s\x1b[0m';
const checkSign = '\u{2705}';

const envFile = `export const environment = {
    SUPABASE_URL: '${process.env.SUPABASE_URL}',
    SUPABASE_ANON_KEY: '${process.env.SUPABASE_ANON_KEY}',
};
`;
console.log(process.env.SUPABASE_URL);
console.log(process.env.SUPABASE_ANON_KEY);


const targetPath = path.join(__dirname, './src/environments/environment.development.ts');
fs.writeFile(targetPath, envFile, (err) => {
    if (err) {
        console.error(err);
        throw err;
    } else {
        console.log(successColor, `${checkSign} Successfully generated environment.development.ts`);
    }
});