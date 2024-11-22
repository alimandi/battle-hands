const { randomBytes, pbkdf2Sync } = require('crypto');

export class PasswordUtil {
  static iteration: number = 50000;
  static keyLen: number = 32;
  static digest: string = 'sha256';

  static hashPassword(password): string {
    const salt = randomBytes(4).toString('hex');
    const hash = pbkdf2Sync(
      password,
      salt,
      PasswordUtil.iteration,
      PasswordUtil.keyLen,
      PasswordUtil.digest,
    ).toString('hex');
    return `pbkdf2:${PasswordUtil.digest}:${PasswordUtil.iteration}$${[
      salt,
      hash,
    ].join('$')}`;
  }

  static verifyHash(password, hashedPassword): boolean {
    const originalHash = hashedPassword.split('$')[2];
    const salt = hashedPassword.split('$')[1];

    const hash = pbkdf2Sync(
      password,
      salt,
      PasswordUtil.iteration,
      PasswordUtil.keyLen,
      PasswordUtil.digest,
    ).toString('hex');

    if (hash === originalHash) {
      return true;
    } else;
    return false;
  }
}
