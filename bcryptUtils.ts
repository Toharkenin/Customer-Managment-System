import bcrypt from "bcrypt";

const hashPassword = async (plainPassword: string) => {
  const saltRounds = 10;
  return await bcrypt.hash(plainPassword, saltRounds);
};

const comparePassword = async (plainPassword: string, hashedPassword: string) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

module.exports = { hashPassword, comparePassword };