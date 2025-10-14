"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_2 = require("mongoose");
const jobTagSchema = new mongoose_2.Schema({
    jobId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Job',
        required: true
    },
    tagId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Tag',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    versionKey: false
});
// Creates compound unique index, indexes by jobId ascending, then tagId ascendint.
// No two documents can have the same combination of jobId and tagId
// jobTagSchema.index({ jobId: 1, tagId: 1 }, { unique: true });
const JobTag = (0, mongoose_2.model)('JobTag', jobTagSchema);
exports.default = JobTag;
//# sourceMappingURL=jobTag.js.map