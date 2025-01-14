import { useState } from "react";

const useAuth = () => {
  const [accessToken, setAccessToken] = useState<string | null>(null);

  return {
    accessToken,
  };
};
