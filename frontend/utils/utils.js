const CryptoJS = require("crypto-js");

let decryptWithAES = ciphertext => {
    const passphrase = 'QuizApp2020ECommerce';
    const bytes = CryptoJS.AES.decrypt(ciphertext, passphrase);
    return bytes.toString(CryptoJS.enc.Utf8);
};

export default {
    decryptWithAES,
}
