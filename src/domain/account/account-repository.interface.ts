import type Account from './account'

export default interface AccountRepositoryInterface {
  save: (account: Account) => Promise<void>
  get: (id: string) => Promise<Account | null>
}
