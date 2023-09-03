const cors = require("cors");
const { allowedOrigins } = require("../utils/config");

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Domian not allowed"));
    }
  },
  optionSuccessStatus: 200,
};

const useCors = () => cors(corsOptions);

module.exports = useCors;
