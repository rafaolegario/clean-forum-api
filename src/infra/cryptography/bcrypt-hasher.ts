import { Hasher } from '@/domain/forum/application/cryptography/hasher'
import { compare, hash } from 'bcrypt'

export class BcryptHasher implements Hasher {
  hash(plain: string) {
    return hash(plain, 8)
  }

  compare(plain: string, hash: string) {
    return compare(plain, hash)
  }
}
