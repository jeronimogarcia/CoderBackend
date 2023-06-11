import bcrypt from 'bcrypt'

const createHash = (pass) => {
   return bcrypt.hashSync(pass, bcrypt.genSaltSync(10))
}

const isValidPassword = (userInDb, pass) => {
  return bcrypt.compareSync(pass, userInDb.password)
}

export { createHash, isValidPassword }