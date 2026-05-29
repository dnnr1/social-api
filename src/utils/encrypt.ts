import bcrypt from "bcrypt";

const salts = 10;

async function encrypt(value: string): Promise<string> {
  return await bcrypt.hash(value, salts);
}

export default encrypt;
