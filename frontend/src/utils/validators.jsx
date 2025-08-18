export const validateEmail = (email) => {
  if (!email) return "Email is required";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return "Please enter a valid email";
  return "";
};

export const validatePassword = (password) => {
  if (!password) return "Password is required";
  if (password.length < 8) return "Password must be at least 8 characters";
  return "";
};

export const validateUsername = (username) => {
  if (!username) return "Username is required";
  if (!/^[a-zA-Z0-9_]+$/.test(username))
    return "Only letters, numbers and underscores allowed";
  if (username.length < 3) return "Username must be at least 3 characters";
  return "";
};
