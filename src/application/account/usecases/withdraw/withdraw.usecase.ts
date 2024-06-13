import type AccountRepositoryInterface from '../../../../domain/account/account-repository.interface'
import { type WithdrawInputDto, type WithdrawOutputDto } from './withdraw.dto'
import { type WithdrawUsecaseInterface } from './withdraw.usecase.interface'

export default class WithdrawUsecase implements WithdrawUsecaseInterface {
  constructor (private readonly accountRepository: AccountRepositoryInterface) {}

  async execute (input: WithdrawInputDto): Promise<WithdrawOutputDto> {
    if (input.amount <= 0) {
      throw new Error('Amount must be greater than zero')
    }
    const account = await this.accountRepository.get(input.origin)
    if (account === null) {
      throw new Error('Account not found')
    }
    account.withdraw(input.amount)
    await this.accountRepository.save(account)
    return {
      id: account.getId(),
      balance: account.getBalance()
    }
  }
}
