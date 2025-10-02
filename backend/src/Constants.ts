// as const: allowedJobStatus has type of readonly ['Wishlist', 'Applied', 'Interview', 'Offer', 'Rejected', 'Withdrawn']
export const allowedJobStatus = ['Wishlist', 'Applied', 'Interview', 'Offer', 'Rejected', 'Withdrawn'] as const;

// (typeof allowedJobStatus)[number] : 'Wishlist' | 'Applied' | 'Interview' | 'Offer' | 'Rejected' | 'Withdrawn'
export type JobStatus = (typeof allowedJobStatus)[number];

// statusColors.ts
const STATUS_COLOURS: Record<JobStatus, string> = {
  Wishlist: 'bg-pink-100 text-pink-800 border-pink-200',
  Applied: 'text-blue-600 bg-blue-100',
  Interview: 'text-yellow-600 bg-yellow-100',
  Offer: 'text-green-600 bg-green-100',
  Rejected: 'text-red-600 bg-red-100',
  Withdrawn: 'text-gray-600 bg-gray-100'
};

export const getStatusColour = (status: string) => {
  const normalized = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();

  switch (normalized) {
    case 'Wishlist': return 'bg-pink-100 text-pink-800 border-pink-200';
    case 'Applied': return 'text-blue-600 bg-blue-100';
    case 'Interview': return 'text-yellow-600 bg-yellow-100';
    case 'Offer': return 'text-green-600 bg-green-100';
    case 'Rejected': return 'text-red-600 bg-red-100';
    case 'Withdrawn': return 'text-gray-600 bg-gray-100';
    default: return 'text-gray-600 bg-gray-100';
  }
};
//export const tagColours = ['orange', 'green', 'blue', 'purple', 'red', 'grey', 'yellow', 'black', 'pink'];
