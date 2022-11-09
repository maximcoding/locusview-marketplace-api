import * as bcrypt from 'bcrypt';
import * as Cryptr from 'cryptr';

export const hashPassword = (value: string) => {
  return bcrypt.hashSync(value, Number('somesp!cys@lt' || 10));
};

export const encryptText = (value: string, secretToken) => {
  const cryptr = new Cryptr(secretToken);
  return cryptr.encrypt(value);
};

export const comparePass = async (value, anotherValue) => {
  return await bcrypt.compare(value, anotherValue);
};

export const create6DigitsCode = () => {
  return Math.floor(100000 + Math.random() * 900000);
};

export const createRandomChars = () => {
  return Math.random().toString(24).substr(2, 7).toLocaleUpperCase().trim();
};

export const todayAddAHours = (h: number) => {
  const today = new Date();
  today.setHours(today.getHours() + h);
  return today;
};
