export const validateEmail = (email) => {
  return email.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
};
export const validateName = (name) => {
  // Check if the name is an empty string
  if (name.trim() === "") {
    return false;
  }
  // Check if the name contains only alphabetic characters (a-z, A-Z) and spaces
  const regex = /^[A-Za-z\s]+$/;
  return regex.test(name);
};

export const validatePhoneNumber = (text) => {
  // Simple validation: check if the input contains exactly 10 digits
  const phoneNumberPattern = /^(\+1\s?)?(\(?\d{3}\)?[\s.-]?)?\d{3}[\s.-]?\d{4}$/;
  return phoneNumberPattern.test(text);
};
