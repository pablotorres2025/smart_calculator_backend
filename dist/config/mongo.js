"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectMongo = connectMongo;
const mongoose_1 = __importDefault(require("mongoose"));
const DEFAULT_URI = 'mongodb+srv://smart_calculator:uUWiukcuqeEEI9cQ@smartcalculator.ponywmb.mongodb.net/?appName=smartCalculator';
const MONGODB_URI = process.env.MONGODB_URI || DEFAULT_URI;
async function connectMongo() {
    if (!MONGODB_URI) {
        throw new Error('La variable de entorno MONGODB_URI no está definida y no hay URI por defecto.');
    }
    if (mongoose_1.default.connection.readyState === 1) {
        return;
    }
    await mongoose_1.default.connect(MONGODB_URI, {
        autoIndex: true,
    });
}
