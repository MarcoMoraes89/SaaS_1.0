import { useState } from "react";

export const useToast = () => {
  const [message, setMessage] = useState<string | null>(null);

  const show = (msg: string, duration = 3000) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), duration);
  };

  const Toast = () =>
    message ? (
      <div className="fixed top-4 right-4 bg-green-500 text-white p-3 rounded shadow">
        {message}
      </div>
    ) : null;

  return { show, Toast };
};
