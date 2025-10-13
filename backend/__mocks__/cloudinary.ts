export const v2 = {
  uploader: {
    upload: jest.fn().mockResolvedValue({ secure_url: 'mocked_url' }),
    destroy: jest.fn(),
  },
  config: jest.fn(),
};