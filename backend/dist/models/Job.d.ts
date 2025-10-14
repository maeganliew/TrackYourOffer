import mongoose from 'mongoose';
declare const Job: mongoose.Model<{
    name: string;
    status: "Wishlist" | "Applied" | "Interview" | "Offer" | "Rejected" | "Withdrawn";
    userId: mongoose.Types.ObjectId;
    file?: {
        type?: string | null | undefined;
        filename?: string | null | undefined;
        url?: string | null | undefined;
    } | null | undefined;
    appliedAt?: NativeDate | null | undefined;
} & mongoose.DefaultTimestampProps, {}, {}, {}, mongoose.Document<unknown, {}, {
    name: string;
    status: "Wishlist" | "Applied" | "Interview" | "Offer" | "Rejected" | "Withdrawn";
    userId: mongoose.Types.ObjectId;
    file?: {
        type?: string | null | undefined;
        filename?: string | null | undefined;
        url?: string | null | undefined;
    } | null | undefined;
    appliedAt?: NativeDate | null | undefined;
} & mongoose.DefaultTimestampProps, {}, {
    timestamps: true;
}> & {
    name: string;
    status: "Wishlist" | "Applied" | "Interview" | "Offer" | "Rejected" | "Withdrawn";
    userId: mongoose.Types.ObjectId;
    file?: {
        type?: string | null | undefined;
        filename?: string | null | undefined;
        url?: string | null | undefined;
    } | null | undefined;
    appliedAt?: NativeDate | null | undefined;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    name: string;
    status: "Wishlist" | "Applied" | "Interview" | "Offer" | "Rejected" | "Withdrawn";
    userId: mongoose.Types.ObjectId;
    file?: {
        type?: string | null | undefined;
        filename?: string | null | undefined;
        url?: string | null | undefined;
    } | null | undefined;
    appliedAt?: NativeDate | null | undefined;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    name: string;
    status: "Wishlist" | "Applied" | "Interview" | "Offer" | "Rejected" | "Withdrawn";
    userId: mongoose.Types.ObjectId;
    file?: {
        type?: string | null | undefined;
        filename?: string | null | undefined;
        url?: string | null | undefined;
    } | null | undefined;
    appliedAt?: NativeDate | null | undefined;
} & mongoose.DefaultTimestampProps>, {}, mongoose.ResolveSchemaOptions<{
    timestamps: true;
}>> & mongoose.FlatRecord<{
    name: string;
    status: "Wishlist" | "Applied" | "Interview" | "Offer" | "Rejected" | "Withdrawn";
    userId: mongoose.Types.ObjectId;
    file?: {
        type?: string | null | undefined;
        filename?: string | null | undefined;
        url?: string | null | undefined;
    } | null | undefined;
    appliedAt?: NativeDate | null | undefined;
} & mongoose.DefaultTimestampProps> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
export default Job;
//# sourceMappingURL=Job.d.ts.map