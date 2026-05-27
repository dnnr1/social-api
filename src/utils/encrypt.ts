import bcrypt from "bcrypt";

const salts = 10;

function encrypt(value: string) {
  return bcrypt.hash(value, salts);
}

export default encrypt;
