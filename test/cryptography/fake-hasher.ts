import { Hasher } from '@/domain/forum/application/cryptography/hasher'

export class FakeHasher implements Hasher {
  async compare(plain: string, hash: string) {
    return plain.concat('-hashed') === hash
  }

  async hash(plain: string): Promise<string> {
    return plain.concat('-hashed')
  }
}
