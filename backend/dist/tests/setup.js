"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearTestDB = exports.disconnectTestDB = exports.connectTestDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const mongodb_memory_server_1 = require("mongodb-memory-server");
let mongoServer;
const connectTestDB = async () => {
    mongoServer = await mongodb_memory_server_1.MongoMemoryServer.create();
    await mongoose_1.default.connect(mongoServer.getUri());
    // mock env variables used by your app
    process.env.JWT_SECRET = 'testsecret';
};
exports.connectTestDB = connectTestDB;
const disconnectTestDB = async () => {
    await mongoose_1.default.disconnect();
    await mongoServer.stop();
};
exports.disconnectTestDB = disconnectTestDB;
const clearTestDB = async () => {
    const collections = mongoose_1.default.connection.collections;
    for (const key in collections) {
        await collections[key]?.deleteMany({});
    }
};
exports.clearTestDB = clearTestDB;
//# sourceMappingURL=setup.js.map