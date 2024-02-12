import crypto from "crypto";

const SECRET = "this-is a-secret";

export const getRandomCryptoString = () => crypto.randomBytes(128).toString("base64");
export const getEncryptedPassword = (salt: string, password: string) => {
    return crypto
        .createHmac("sha256", [salt, password].join("/"))
        .update(SECRET)
        .digest("hex");
};
