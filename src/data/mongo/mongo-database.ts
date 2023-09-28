import mongoose from 'mongoose'
interface Options {
    mongoURL: string;
    dbName: string;
}

export class MongoDatabase{
    static async connect( options: Options ){
        const { mongoURL, dbName } = options;

        try{
            await mongoose.connect(mongoURL, {
                dbName: dbName
            })
            
            return true;
        }catch(error){
            console.log(error);
            throw error
        }
    }
}