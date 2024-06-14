import { type DepositUsecaseInterface } from '../../../application/account/usecases/deposit/deposit.usecase.interface'
import { type GetBalanceUsecaseInterface } from '../../../application/account/usecases/get-balance/get-balance.usecase.interface'
import { type TransferUsecaseInterface } from '../../../application/account/usecases/transfer/transfer.usecase.interface'
import { type WithdrawUsecaseInterface } from '../../../application/account/usecases/withdraw/withdraw.usecase.interface'
import { type EventInputDto, type DepositOutputDto, type WithdrawOutputDto, type TransferOutputDto, type DepositInputDto, type WithdrawInputDto, type TransferInputDto } from './account.controller.dto'

export default class AccountController {
  private readonly depositUsecase: DepositUsecaseInterface
  private readonly withdrawUsecase: WithdrawUsecaseInterface
  private readonly transferUsecase: TransferUsecaseInterface
  private readonly getBalanceUsecase: GetBalanceUsecaseInterface

  constructor ({
    depositUsecase,
    withdrawUsecase,
    transferUsecase,
    getBalanceUsecase
  }: {
    depositUsecase: DepositUsecaseInterface
    withdrawUsecase: WithdrawUsecaseInterface
    transferUsecase: TransferUsecaseInterface
    getBalanceUsecase: GetBalanceUsecaseInterface
  }) {
    this.depositUsecase = depositUsecase
    this.withdrawUsecase = withdrawUsecase
    this.transferUsecase = transferUsecase
    this.getBalanceUsecase = getBalanceUsecase
  }

  async handleEvent (event: EventInputDto): Promise<DepositOutputDto | WithdrawOutputDto | TransferOutputDto> {
    switch (event.type) {
      case 'deposit':
        return await this.deposit({
          destination: this.validateAndReturnStringParam(event.data.destination, 'Destination'),
          amount: event.data.amount
        })
      case 'withdraw':
        return await this.withdraw({
          origin: this.validateAndReturnStringParam(event.data.origin, 'Origin'),
          amount: event.data.amount
        })
      case 'transfer':
        return await this.transfer({
          origin: this.validateAndReturnStringParam(event.data.origin, 'Origin'),
          destination: this.validateAndReturnStringParam(event.data.destination, 'Destination'),
          amount: event.data.amount
        })
      default:
        throw new Error('Invalid event type')
    }
  }

  async getBalance (id: string): Promise<number> {
    const balance = await this.getBalanceUsecase.execute({ accountId: this.validateAndReturnStringParam(id, 'Account Id') })
    return balance.balance
  }

  private async deposit (input: DepositInputDto): Promise<DepositOutputDto> {
    const account = await this.depositUsecase.execute({ destination: input.destination, amount: input.amount })
    return {
      destination: {
        id: account.id,
        balance: account.balance
      }
    }
  }

  private async withdraw (input: WithdrawInputDto): Promise<WithdrawOutputDto> {
    const account = await this.withdrawUsecase.execute({ origin: input.origin, amount: input.amount })
    return {
      origin: {
        id: account.id,
        balance: account.balance
      }
    }
  }

  private async transfer (input: TransferInputDto): Promise<TransferOutputDto> {
    const accounts = await this.transferUsecase.execute({ origin: input.origin, destination: input.destination, amount: input.amount })
    return {
      origin: {
        id: accounts.origin.id,
        balance: accounts.origin.balance
      },
      destination: {
        id: accounts.destination.id,
        balance: accounts.destination.balance
      }
    }
  }

  private validateAndReturnStringParam (param: string | undefined, name: string): string {
    if (typeof param !== 'string' || param.length === 0) {
      throw new Error(`${name} is required`)
    }
    return param
  }
}
