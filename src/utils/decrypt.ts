import bcrypt from "bcrypt";

async function decrypt(value: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(value, hash);
}

export default decrypt;
