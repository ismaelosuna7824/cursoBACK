import chalk from 'chalk';
import mongoose from 'mongoose';
class Database {
    async init(){
        const MONGODB = String(process.env.DATABASE);
        const client = await mongoose.connect(MONGODB);
        const db = await client.connection;
        if(client.connection){
            console.log('=========DataBase=========');
            console.log(`STATUS: ${chalk.greenBright('ONLINE')}`);
        }
        return db;

    }
}

export default Database;