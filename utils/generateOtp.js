const generateOtp = () => {
  let otp = "";
  const random = (range) => Math.floor(Math.random() * (range + 1));
  const getArr = () => {
    let date = new Date().valueOf().toPrecision(15).split("");
    if (date.includes(".")) {
      date.splice(date.indexOf("."), 1);
    }
    return date;
  };
  const strArr = getArr();
  for (let index = 0; index < 6; index++) {
    otp += strArr[random(strArr.length - 1)];
  }
  return otp;
};

module.exports = { generateOtp };
