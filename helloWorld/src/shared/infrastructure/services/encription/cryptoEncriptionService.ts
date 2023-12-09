import * as Crypto from 'crypto';
import { EncriptionService } from '@shared/domain/services/encriptionService';
import { injectable } from 'tsyringe';

type CryptoEncriptionServiceProps = {
  secretKey: string;
  secretIV: string;
  method?: string;
};

@injectable()
export class CryptoEncriptionService implements EncriptionService {
  private static METHOD_DEFAULT: string = 'aes-256-cbc';

  private readonly secretKey: string;
  private readonly secretIV: string;
  private readonly method: string;

  constructor(props: CryptoEncriptionServiceProps) {
    this.secretKey = props.secretKey;
    this.secretIV = props.secretIV;
    this.method = props.method || CryptoEncriptionService.METHOD_DEFAULT;
  }

  public async encrypt(textToCipher: string): Promise<string> {
    const key = this.createKey();
    const encriptionIV = this.createEncriptionIV();

    const cipherResult = Crypto.createCipheriv(
      this.method,
      key,
      encriptionIV
    );

    const ciphertext = Buffer
      .from(
        cipherResult.update(textToCipher, 'utf-8', 'hex') + cipherResult.final('hex')
      )
      .toString('base64');
    
    return ciphertext;
  }

  public async decrypt(ciphertext: string): Promise<string> {
    const key = this.createKey();
    const encriptionIV = this.createEncriptionIV();

    const buffer = Buffer.from(ciphertext, 'base64');
    const decipherResult = Crypto
      .createDecipheriv(
        this.method,
        key,
        encriptionIV
      );

    const deciphertext =
      decipherResult.update(buffer.toString('utf-8'), 'hex', 'utf8')
      + decipherResult.final('utf-8');

    return deciphertext;
  }

  private createKey(): string {
    const key = Crypto
      .createHash('sha512')
      .update(this.secretKey)
      .digest('hex')
      .substring(0, 32);
    return key;
  }

  private createEncriptionIV(): string {
    const encriptionIV = Crypto
      .createHash('sha512')
      .update(this.secretIV)
      .digest('hex')
      .substring(0, 16);

    return encriptionIV;
  }
}
