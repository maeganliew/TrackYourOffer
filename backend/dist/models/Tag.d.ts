import mongoose from 'mongoose';
declare const Tag: mongoose.Model<{
    name: string;
    userId: mongoose.Types.ObjectId;
    colour: string;
} & mongoose.DefaultTimestampProps, {}, {}, {}, mongoose.Document<unknown, {}, {
    name: string;
    userId: mongoose.Types.ObjectId;
    colour: string;
} & mongoose.DefaultTimestampProps, {}, {
    timestamps: true;
}> & {
    name: string;
    userId: mongoose.Types.ObjectId;
    colour: string;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    name: string;
    userId: mongoose.Types.ObjectId;
    colour: string;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    name: string;
    userId: mongoose.Types.ObjectId;
    colour: string;
} & mongoose.DefaultTimestampProps>, {}, mongoose.ResolveSchemaOptions<{
    timestamps: true;
}>> & mongoose.FlatRecord<{
    name: string;
    userId: mongoose.Types.ObjectId;
    colour: string;
} & mongoose.DefaultTimestampProps> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
export default Tag;
//# sourceMappingURL=Tag.d.ts.map