import * as crypto from 'crypto';

export const hashPwd = (pwd: string): string => {
  const hmac = crypto.createHmac(
    'sha512',
    's8f5tjn4dtyjasgjesrpogtjdfbjsdhry5j4tyjhsfgkbhj',
  );
  hmac.update(pwd);
  return hmac.digest('hex');
};
