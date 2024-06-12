import type Account from '../../../domain/account/account'
import type AccountRepositoryInterface from '../../../domain/account/account-repository.interface'

export default class InMemoryAccountRepository implements AccountRepositoryInterface {
  private readonly accounts: Account[] = []

  async save (account: Account): Promise<void> {
    const accountIndex = this.accounts.findIndex(item => item.getId() === account.getId())
    if (accountIndex >= 0) {
      this.accounts[accountIndex] = account
    } else {
      this.accounts.push(account)
    }
  }

  async get (id: string): Promise<Account | null> {
    const account = this.accounts.find(account => account.getId() === id)
    if (account === undefined) {
      return null
    }
    return account
  }
}
