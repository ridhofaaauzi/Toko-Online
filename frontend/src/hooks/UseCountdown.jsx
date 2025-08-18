import { useState, useEffect } from "react";

const useCountdown = () => {
  const [countdown, setCountdown] = useState(0);
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      setDisabled(true);
      timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
    } else {
      setDisabled(false);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const startCountdown = (seconds) => setCountdown(seconds);

  return { countdown, disabled, startCountdown };
};

export default useCountdown;
