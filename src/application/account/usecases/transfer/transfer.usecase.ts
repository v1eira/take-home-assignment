import type AccountRepositoryInterface from '../../../../domain/account/account-repository.interface'
import { type TransferInputDto, type TransferOutputDto } from './transfer.dto'
import { type TransferUsecaseInterface } from './transfer.usecase.interface'

export default class TransferUsecase implements TransferUsecaseInterface {
  constructor (private readonly accountRepository: AccountRepositoryInterface) {}

  async execute (input: TransferInputDto): Promise<TransferOutputDto> {
    if (input.amount <= 0) {
      throw new Error('Amount must be greater than zero')
    }
    if (input.origin === input.destination) {
      throw new Error('Origin and destination must be different')
    }

    const [originAccount, destinationAccount] = await Promise.all([
      this.accountRepository.get(input.origin),
      this.accountRepository.get(input.destination)
    ])
    if (originAccount === null) {
      throw new Error('Origin account not found')
    }
    if (destinationAccount === null) {
      throw new Error('Destination account not found')
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
