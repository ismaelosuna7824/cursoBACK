import { Schema, model, Document } from 'mongoose';
import { Datetime } from '../lib/original';

const testSchema = new Schema({
    nombre: {
        type: String,
        require: [true],
    },
    // contrasena: {
    //     type: String, 
    //     require: [true]
    // },
    // tipo: {
    //     type: String,
    //     require: true
    // },
    // registerDate: {
    //     type: Date,
    //     default: Date.now
    // }
});

export interface Itest extends Document {
    nombre: string
    // contrasena: string
    // tipo: string
    // registerDate: Datetime
}

export const TestModel = model<Itest>('Test', testSchema);
