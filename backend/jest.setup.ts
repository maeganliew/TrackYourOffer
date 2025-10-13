jest.mock("cloudinary", () => ({
  v2: {
    config: jest.fn(),
    uploader: {
      upload: jest.fn().mockResolvedValue({ secure_url: "mocked_url" }),
      destroy: jest.fn().mockResolvedValue({ result: "ok" }),
    },
  },
}));

// Mock environment variables that might be checked in src/utils/cloudinary.ts
process.env.CLOUDINARY_CLOUD_NAME = "mock";
process.env.CLOUDINARY_API_KEY = "mock";
process.env.CLOUDINARY_API_SECRET = "mock";