export const APP_GRADIENT_ID = "app_gradient";

export const AppGradient = () => {
  return (
    <svg width={0} height={0}>
      <defs>
        <linearGradient id={APP_GRADIENT_ID} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#4caf50" />
          <stop offset="100%" stopColor="#1976d2" />
        </linearGradient>
      </defs>
    </svg>
  );
};
