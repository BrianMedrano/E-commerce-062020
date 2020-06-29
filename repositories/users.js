const fs = require('fs');
const crypto = require('crypto');
const util = require('util');
const Repository = require('./repository');
const scrypt = util.promisify(crypto.scrypt);

class UsersRepository extends Repository {
  //Create new user
  async create(attrs) {
    attrs.id = this.randomId();

    //salt password
    const salt = crypto.randomBytes(8).toString('hex');
    const buf = await scrypt(attrs.password, salt, 64);

    const records = await this.getAll();
    const record = {
      ...attrs,
      password: `${buf.toString('hex')}.${salt}`,
    };

    records.push(record);

    await this.writeAll(records);
    return record;
  }

  //Password checker
  async comparePasswords(saved, supplied) {
    //Saved password in database spit 'hashed.salt'
    const [hashed, salt] = saved.split('.');
    const hashedPassword = await scrypt(supplied, salt, 64);
    return hashed === hashedPassword.toString('hex');
  }
}

module.exports = new UsersRepository('users.json');
