const crypto = require("crypto");

const algorithm = "aes-256-cbc";
const key = Buffer.from(process.env.EMAIL_ENCRYPTION_KEY, "utf8");

const normalizeEmail = (email) => email.toLowerCase().trim();

const hashEmail = (email) => {
  return crypto
    .createHash("sha256")
    .update(normalizeEmail(email))
    .digest("hex");
};

const encryptEmail = (email) => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, key, iv);

  let encrypted = cipher.update(normalizeEmail(email), "utf8", "hex");
  encrypted += cipher.final("hex");

  return `${iv.toString("hex")}:${encrypted}`;
};

const decryptEmail = (encryptedEmail) => {
  const [ivHex, encrypted] = encryptedEmail.split(":");
  const iv = Buffer.from(ivHex, "hex");
  const decipher = crypto.createDecipheriv(algorithm, key, iv);

  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
};

module.exports = {
  normalizeEmail,
  hashEmail,
  encryptEmail,
  decryptEmail,
};