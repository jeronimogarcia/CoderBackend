import bcrypt from "bcryptjs";

const createHash = (pass) => {
  return bcrypt.hashSync(pass, bcrypt.genSaltSync(10));
}

const isValidPassword = (passInDb, passToCompare) => {
  return bcrypt.compare(passToCompare, passInDb);
}

export { createHash, isValidPassword };