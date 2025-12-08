const generateOtp = () => {
  try {
    const otp = Math.floor(1000 + Math.random() * 9000);
    return otp;
  } catch (error) {
    console.log("Something went wrong while generating otp");
  }
};

export { generateOtp };
