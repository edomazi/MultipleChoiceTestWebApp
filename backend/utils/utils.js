const CryptoJS = require("crypto-js");

const encrypt = text => {
  const passphrase = 'QuizApp2020ECommerce';
  return CryptoJS.AES.encrypt(text, passphrase).toString();
};

let decrypt = cryptedtext => {
  const passphrase = 'QuizApp2020ECommerce';
  const bytes = CryptoJS.AES.decrypt(cryptedtext, passphrase);
  return bytes.toString(CryptoJS.enc.Utf8);
};

exports.encrypt = encrypt;
exports.decrypt = decrypt;
