import crypto from "crypto";

const NONCE_KEY = "hqzdurufm2c8mf6bsjezu1qgveouv7c7";
const AUTH_KEY = "w13r4cvf4hctaujv";

export const decryptNonce = (nonceEncrypted: string): string => {
  const nonceDecipher = crypto.createDecipheriv(
    "aes-256-cbc",
    NONCE_KEY,
    NONCE_KEY.slice(0, 16)
  );

  return Buffer.concat([
    nonceDecipher.update(nonceEncrypted, "base64"),
    nonceDecipher.final(),
  ]).toString("utf-8");
};

export const getAuthorization = (nonceDecrypted: string): string => {
  let key = "";
  for (let i = 0; i < 16; i += 1) {
    const nonceChar = nonceDecrypted.charCodeAt(i);
    key += NONCE_KEY[nonceChar % 16];
  }
  key += AUTH_KEY;

  const authCipher = crypto.createCipheriv(
    "aes-256-cbc",
    key,
    key.slice(0, 16)
  );

  return Buffer.concat([
    authCipher.update(nonceDecrypted, "utf8"),
    authCipher.final(),
  ]).toString("base64");
};

export const handleAuthRotation = (
  responseHeaders: Record<string, string>
): {
  Authorization: string;
  nonce: { decrypted: string; encrypted: string };
} => {
  const { nonce } = responseHeaders;
  const nonceDecrypted = decryptNonce(nonce);
  const authorization = getAuthorization(nonceDecrypted);

  return {
    Authorization: `FUS nonce="${nonce}", signature="${authorization}", nc="", type="", realm="", newauth="1"`,
    nonce: {
      decrypted: nonceDecrypted,
      encrypted: nonce,
    },
  };
};
