import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import * as util from 'util';

@Injectable()
export class UtilsService {
  private readonly HASH_SIZE = 32;
  private readonly SALT_SIZE = 16;

  public async hashString(value: string, salt?: string): Promise<string> {
    const saltInUse =
      salt || crypto.randomBytes(this.SALT_SIZE).toString('hex');
    const hashBuffer = (await util.promisify(crypto.scrypt)(
      value,
      saltInUse,
      this.HASH_SIZE,
    )) as Buffer;
    const hash = hashBuffer.toString('hex');
    return `${hash}:${saltInUse}`;
  }
}
