const CryptoJs = require("crypto-js");
require("dotenv").config();
const genRes = (
  status = 200,
  error = false,
  message = "Success",
  data = null
) => {
  // const encryptedData = data !== null ? EncryptData(data) : data;

  return {
    status,
    error,
    message,
    data: data,
  };
};

const EncryptData = (obj = {}) => {
  try {
    const stringData = JSON.stringify(obj);
    const encryptedData = CryptoJs.AES.encrypt(
      stringData,
      process.env.CRYPTO_KEY
    ).toString();
    return encryptedData;
  } catch (error) {
    console.log(`useMiddleware.js | line : 27 | EncryptData | `, error);
    return ["encryption_error"];
  }
};

const DecryptData = (stringData = "", isQuery = false) => {
  try {
    stringData = isQuery ? decodeURIComponent(stringData) : stringData;
    const decryptedData = CryptoJs.AES.decrypt(
      stringData,
      process.env.CRYPTO_KEY
    ).toString(CryptoJs.enc.Utf8);
    const jsonObj = JSON.parse(decryptedData);
    return jsonObj;
  } catch (error) {
    console.log(`useMiddleware.js | line : 42 | DecryptData | `, error);
    return ["decryption_error"];
  }
};

exports.EncryptData;
exports.DecryptData;
module.exports = genRes;
