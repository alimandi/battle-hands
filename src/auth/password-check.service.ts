import { Injectable } from '@nestjs/common';

// Password strengths
export const enum PasswordCheckStrength {
  Short,
  Common,
  Weak,
  Ok,
  Strong,
}

@Injectable()
export class PasswordCheckService {
  // Expected length of all passwords
  public static get MinimumLength(): number {
    return 8;
  }

  // Regex to check for a common password string - all based on 5+ length passwords
  private commonPasswordPatterns =
    /passw.*|12345.*|09876.*|qwert.*|asdfg.*|zxcvb.*|footb.*|baseb.*|drago.*/;

  public isPasswordCommon(password: string): boolean {
    return this.commonPasswordPatterns.test(password);
  }

  public checkPasswordStrength(password: string): PasswordCheckStrength {
    // Build up the strenth of our password
    let numberOfElements = 0;
    numberOfElements = /.*[a-z].*/.test(password)
      ? ++numberOfElements
      : numberOfElements; // Lowercase letters
    numberOfElements = /.*[A-Z].*/.test(password)
      ? ++numberOfElements
      : numberOfElements; // Uppercase letters
    numberOfElements = /.*[0-9].*/.test(password)
      ? ++numberOfElements
      : numberOfElements; // Numbers
    // numberOfElements = /[^a-zA-Z0-9]/.test(password)
    //   ? ++numberOfElements
    //   : numberOfElements; // Special characters (inc. space)

    // Assume we have a poor password already
    let currentPasswordStrength = PasswordCheckStrength.Short;

    // Check then strenth of this password using some simple rules
    if (
      password === null ||
      password.length < PasswordCheckService.MinimumLength
    ) {
      currentPasswordStrength = PasswordCheckStrength.Short;
      // } else if (this.isPasswordCommon(password) === true) {
      //   currentPasswordStrength = PasswordCheckStrength.Common;
    } else if (
      numberOfElements === 0 ||
      numberOfElements === 1 ||
      numberOfElements === 2
    ) {
      currentPasswordStrength = PasswordCheckStrength.Weak;
    } else if (numberOfElements === 3) {
      currentPasswordStrength = PasswordCheckStrength.Ok;
    } else {
      currentPasswordStrength = PasswordCheckStrength.Strong;
    }

    // Return the strength of this password
    return currentPasswordStrength;
  }

  public isPasswordOk(password: string): boolean {
    const strength = this.checkPasswordStrength(password);
    // console.log('strength', strength);
    return (
      strength == PasswordCheckStrength.Ok ||
      strength == PasswordCheckStrength.Strong
    );
  }
}
