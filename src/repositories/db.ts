import { MongoClient } from 'mongodb';
import dotenv from 'dotenv'
dotenv.config()

const mongoURI = process.env.MONGO_URL
if (!mongoURI){
    throw new Error('Database url is not defined!')
}
export const client = new MongoClient(mongoURI);

export async function runDB (){
    try {
        await client.connect();
        await client.db('blogs').command({ping:1});
        console.log('Successfully connected to server');

    } catch (error) {
        console.log('Problem with connection to DB');
        await client.close();
    }
}