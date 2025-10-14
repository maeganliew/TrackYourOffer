"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//App entry point, set up express server
const app_1 = __importDefault(require("./app"));
const db_1 = require("./config/db");
const PORT = 3000;
(0, db_1.connectDB)();
app_1.default.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
//# sourceMappingURL=index.js.map