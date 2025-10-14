export declare const allowedJobStatus: readonly ["Wishlist", "Applied", "Interview", "Offer", "Rejected", "Withdrawn"];
export type JobStatus = (typeof allowedJobStatus)[number];
export declare const getStatusColour: (status: string) => "bg-pink-100 text-pink-800 border-pink-200" | "text-blue-600 bg-blue-100" | "text-yellow-600 bg-yellow-100" | "text-green-600 bg-green-100" | "text-red-600 bg-red-100" | "text-gray-600 bg-gray-100";
//# sourceMappingURL=Constants.d.ts.map