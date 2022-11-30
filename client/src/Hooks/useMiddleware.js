import axios from "axios";
import CryptoJs from "crypto-js";

const methods = {
  1: axios.get,
  2: axios.post,
  3: axios.put,
  4: axios.delete,
};

const fetch = async (
  url,
  queries = {},
  data = false,
  options = {},
  method = 1,
  encrypt = true
) => {
  const encryptedData = data ? (encrypt ? EncryptData(data) : data) : "";
  let Res;
  try {
    const isQuery = Object.keys(queries).length > 0;
    const encryptedqueries = isQuery ? EncryptData(queries, true) : "";
    const queryLink = isQuery ? `?query=${encryptedqueries}` : "";
    const link = `${url}${queryLink}`;
    Res = await methods[method](link, encryptedData, options);
  } catch (error) {
    console.log(`useMiddleware.js | line : 28 | fetch | `, error);
  }
  const decryptedData = DecryptData(Res?.data?.data);
  return { res: Res, data: decryptedData };
};

export const EncryptData = (obj = {}, isQuery = false) => {
  try {
    const stringData = JSON.stringify(obj);
    const encryptedData = CryptoJs.AES.encrypt(
      stringData,
      process.env.REACT_APP_CRYPTO_KEY
    ).toString();
    return isQuery ? encodeURIComponent(encryptedData) : encryptedData;
  } catch (error) {
    console.log(`useMiddleware.js | line : 43 | EncryptData | `, error);
    return { data: "encryption_error" };
  }
};

export const DecryptData = (stringData = "") => {
  try {
    const decryptedData = CryptoJs.AES.decrypt(
      stringData,
      process.env.REACT_APP_CRYPTO_KEY
    ).toString(CryptoJs.enc.Utf8);
    const jsonObj = JSON.parse(decryptedData);
    return jsonObj;
  } catch (error) {
    console.log(`useMiddleware.js | line : 57 | DecryptData | `, error);
    return { data: "decryption_error" };
  }
};

export default fetch;
