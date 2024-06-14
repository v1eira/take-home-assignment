import DepositUsecase from '../../../../application/account/usecases/deposit/deposit.usecase'
import GetBalanceUsecase from '../../../../application/account/usecases/get-balance/get-balance.usecase'
import TransferUsecase from '../../../../application/account/usecases/transfer/transfer.usecase'
import WithdrawUsecase from '../../../../application/account/usecases/withdraw/withdraw.usecase'
import InMemoryAccountRepository from '../../../../infrastructure/persistence/in-memory/in-memory-account-repository'
import AccountController from '../account.controller'

export const makeAccountController = (): AccountController => {
  const accountRepository = new InMemoryAccountRepository()

  const getBalanceUsecase = new GetBalanceUsecase(accountRepository)
  const depositUsecase = new DepositUsecase(accountRepository)
  const withdrawUsecase = new WithdrawUsecase(accountRepository)
  const transferUsecase = new TransferUsecase(accountRepository)

  return new AccountController({ getBalanceUsecase, depositUsecase, withdrawUsecase, transferUsecase })
}
