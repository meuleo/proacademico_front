// src/utils/crypto.js
import CryptoJS from "crypto-js"

const SECRET_KEY = "427072" // mantenha isso em segredo!

export function encrypt(data) {
  const json = JSON.stringify(data)
  return CryptoJS.AES.encrypt(json, SECRET_KEY).toString()
}

export function decrypt(cipherText) {
  const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY)
  const decrypted = bytes.toString(CryptoJS.enc.Utf8)
  return JSON.parse(decrypted)
}
