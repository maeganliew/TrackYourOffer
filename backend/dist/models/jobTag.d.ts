import mongoose from 'mongoose';
declare const JobTag: mongoose.Model<{
    createdAt: NativeDate;
    tagId: mongoose.Types.ObjectId;
    jobId: mongoose.Types.ObjectId;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    createdAt: NativeDate;
    tagId: mongoose.Types.ObjectId;
    jobId: mongoose.Types.ObjectId;
}, {}, {
    versionKey: false;
}> & {
    createdAt: NativeDate;
    tagId: mongoose.Types.ObjectId;
    jobId: mongoose.Types.ObjectId;
} & {
    _id: mongoose.Types.ObjectId;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    versionKey: false;
}, {
    createdAt: NativeDate;
    tagId: mongoose.Types.ObjectId;
    jobId: mongoose.Types.ObjectId;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    createdAt: NativeDate;
    tagId: mongoose.Types.ObjectId;
    jobId: mongoose.Types.ObjectId;
}>, {}, mongoose.ResolveSchemaOptions<{
    versionKey: false;
}>> & mongoose.FlatRecord<{
    createdAt: NativeDate;
    tagId: mongoose.Types.ObjectId;
    jobId: mongoose.Types.ObjectId;
}> & {
    _id: mongoose.Types.ObjectId;
}>>;
export default JobTag;
//# sourceMappingURL=jobTag.d.ts.map