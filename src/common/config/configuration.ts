export const configuration = () => {
  return {
    environment: process.env.NODE_ENV,
    port: process.env.PORT,
  };
};

export const environmentFilePath =
  process.env.NODE_ENV === 'development'
    ? ['.env.dev', '.env']
    : process.env.NODE_ENV === 'test'
      ? ['.env.test']
      : ['.env'];
