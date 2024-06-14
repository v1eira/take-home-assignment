import InvalidParamError from '../errors/invalid-param.error'
import TransactionError from '../errors/transaction.error'

export default class Account {
  private readonly id: string
  private balance: number

  constructor (id: string, balance: number) {
    this.id = id
    this.balance = balance
  }

  public getId (): string {
    return this.id
  }

  public getBalance (): number {
    return this.balance
  }

  public deposit (amount: number): void {
    if (amount <= 0) {
      throw new InvalidParamError('Amount must be greater than zero')
    }
    this.balance += amount
  }

  public withdraw (amount: number): void {
    if (amount <= 0) {
      throw new InvalidParamError('Amount must be greater than zero')
    }
    if (this.balance < amount) {
      throw new TransactionError('Insufficient funds')
    }
    this.balance -= amount
  }
}
