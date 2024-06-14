import Account from '../../../../domain/account/account'
import type AccountRepositoryInterface from '../../../../domain/account/account-repository.interface'
import InvalidParamError from '../../../../domain/errors/invalid-param.error'
import NotFoundError from '../../../../domain/errors/not-found.error'
import { type TransferInputDto, type TransferOutputDto } from './transfer.dto'
import { type TransferUsecaseInterface } from './transfer.usecase.interface'

export default class TransferUsecase implements TransferUsecaseInterface {
  constructor (private readonly accountRepository: AccountRepositoryInterface) {}

  async execute (input: TransferInputDto): Promise<TransferOutputDto> {
    if (input.amount <= 0) {
      throw new InvalidParamError('Amount must be greater than zero')
    }
    if (input.origin === input.destination) {
      throw new InvalidParamError('Origin and destination must be different')
    }

    let [originAccount, destinationAccount] = await Promise.all([
      this.accountRepository.get(input.origin),
      this.accountRepository.get(input.destination)
    ])
    if (originAccount === null) {
      throw new NotFoundError('Origin account not found')
    }
    if (destinationAccount === null) {
      destinationAccount = new Account(input.destination, 0)
    }

    originAccount.withdraw(input.amount)
    destinationAccount.deposit(input.amount)
    await Promise.all([
      this.accountRepository.save(originAccount),
      this.accountRepository.save(destinationAccount)
    ])

    return {
      origin: {
        id: originAccount.getId(),
        balance: originAccount.getBalance()
      },
      destination: {
        id: destinationAccount.getId(),
        balance: destinationAccount.getBalance()
      }
    }
  }
}
