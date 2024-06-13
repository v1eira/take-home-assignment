import type AccountRepositoryInterface from '../../../../domain/account/account-repository.interface'
import { type GetBalanceInputDto, type GetBalanceOutputDto } from './get-balance.dto'
import { type GetBalanceUsecaseInterface } from './get-balance.usecase.interface'

export default class GetBalanceUsecase implements GetBalanceUsecaseInterface {
  constructor (private readonly accountRepository: AccountRepositoryInterface) {}

  async execute (input: GetBalanceInputDto): Promise<GetBalanceOutputDto> {
    const account = await this.accountRepository.get(input.accountId)
    if (account === null) {
      throw new Error('Account not found')
    }
    return {
      balance: account.getBalance()
    }
  }
}
