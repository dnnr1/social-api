import bcrypt from "bcrypt";

function decrypt(value: string, hash: string) {
  return bcrypt.compare(value, hash);
}

export default decrypt;
