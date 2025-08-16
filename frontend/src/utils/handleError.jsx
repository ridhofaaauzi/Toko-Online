export const handleError = (error, setErrors) => {
  console.error("API ERROR:", error);

  if (error.response) {
    const status = error.response.status;
    const data = error.response.data;

    if (status === 429) {
      const retryAfter = parseInt(
        error.response.headers["retry-after"] || "60",
        10
      );
      setErrors((prev) => ({
        ...prev,
        general: `Too many attempts. Try again in ${retryAfter}s.`,
      }));
    } else if (status === 401) {
      setErrors((prev) => ({
        ...prev,
        general: data?.message || "Unauthorized access",
      }));
    } else if (status === 500) {
      setErrors((prev) => ({
        ...prev,
        general: "Server error. Please try again later.",
      }));
    } else if (data?.errors) {
      setErrors((prev) => ({
        ...prev,
        ...data.errors,
        general: data.message,
      }));
    } else {
      setErrors((prev) => ({
        ...prev,
        general: data?.message || `Request failed (status: ${status})`,
      }));
    }
  } else if (error.request) {
    setErrors((prev) => ({
      ...prev,
      general: "No response from server. Check your network.",
    }));
  } else {
    setErrors((prev) => ({
      ...prev,
      general: error.message || "An unexpected error occurred",
    }));
  }
};
