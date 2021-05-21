const library = require('aes-js');

const thing = [
  0, 22, 2, 12, 4, 5, 6, 7, 8, 9, 10, 11, 3, 13, 14, 15,
  16, 30, 18, 19, 20, 21, 1, 23, 24, 25, 26, 27, 28,
  29, 17, 31
];

export function makeIt(text) {

  const textBytes = library.utils.utf8.toBytes(text);

  const aesCtr = new library.ModeOfOperation.ctr(thing);
  const encryptedBytes = aesCtr.encrypt(textBytes);

  const encryptedHex = library.utils.hex.fromBytes(encryptedBytes);
  return encryptedHex;

}

export function unmakeIt(text) {

  const encryptedBytes = library.utils.hex.toBytes(text);

  const aesCtr = new library.ModeOfOperation.ctr(thing);
  const decryptedBytes = aesCtr.decrypt(encryptedBytes);

  const decryptedText = library.utils.utf8.fromBytes(decryptedBytes);
  return decryptedText;

}
