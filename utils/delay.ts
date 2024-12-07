export const delay = (delayMS: number) => {
  return new Promise((resolve) => setTimeout(resolve, delayMS));
};
