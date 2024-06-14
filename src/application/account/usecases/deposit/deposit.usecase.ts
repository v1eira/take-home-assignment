import Account from '../../../../domain/account/account'
import type AccountRepositoryInterface from '../../../../domain/account/account-repository.interface'
import InvalidParamError from '../../../../domain/errors/invalid-param.error'
import { type DepositInputDto, type DepositOutputDto } from './deposit.dto'
import { type DepositUsecaseInterface } from './deposit.usecase.interface'

export default class DepositUsecase implements DepositUsecaseInterface {
  constructor (private readonly accountRepository: AccountRepositoryInterface) {}

  async execute (input: DepositInputDto): Promise<DepositOutputDto> {
    if (input.amount <= 0) {
      throw new InvalidParamError('Amount must be greater than zero')
    }
    let account = await this.accountRepository.get(input.destination)
    if (account === null) {
      account = new Account(input.destination, 0)
    }
    account.deposit(input.amount)
    await this.accountRepository.save(account)
    return {
      id: account.getId(),
      balance: account.getBalance()
    }
  }
}
