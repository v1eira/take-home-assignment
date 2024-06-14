import { type DepositUsecaseInterface } from '../../../application/account/usecases/deposit/deposit.usecase.interface'
import { type GetBalanceUsecaseInterface } from '../../../application/account/usecases/get-balance/get-balance.usecase.interface'
import { type TransferUsecaseInterface } from '../../../application/account/usecases/transfer/transfer.usecase.interface'
import { type WithdrawUsecaseInterface } from '../../../application/account/usecases/withdraw/withdraw.usecase.interface'
import Account from '../../../domain/account/account'
import InvalidParamError from '../../../domain/errors/invalid-param.error'
import NotFoundError from '../../../domain/errors/not-found.error'
import TransactionError from '../../../domain/errors/transaction.error'
import AccountController from './account.controller'

describe('Account controller tests', () => {
  const g = (): GetBalanceUsecaseInterface => ({
    execute: jest.fn()
  })
  const d = (): DepositUsecaseInterface => ({
    execute: jest.fn()
  })
  const w = (): WithdrawUsecaseInterface => ({
    execute: jest.fn()
  })
  const t = (): TransferUsecaseInterface => ({
    execute: jest.fn()
  })

  const getBalanceUsecase = g()
  const depositUsecase = d()
  const withdrawUsecase = w()
  const transferUsecase = t()

  const accountController = new AccountController({
    getBalanceUsecase,
    depositUsecase,
    withdrawUsecase,
    transferUsecase
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('Get balance usecase tests', () => {
    it('Should get balance', async () => {
      const id = '100'
      jest.spyOn(getBalanceUsecase, 'execute').mockReturnValue(Promise.resolve({ balance: 20 }))
      const output = await accountController.getBalance(id)
      expect(output).toEqual(20)
    })

    it('Should throw an error if account not found', async () => {
      const id = '100'
      jest.spyOn(getBalanceUsecase, 'execute').mockImplementationOnce(() => { throw new NotFoundError('Account not found') })
      await expect(accountController.getBalance(id)).rejects.toThrow()
    })
  })

  describe('Handle Event tests', () => {
    describe('Deposit usecase tests', () => {
      it('Should deposit into non-existing account (Create account with initial balance)', async () => {
        const input = {
          type: 'deposit',
          data: {
            destination: '100',
            amount: 10
          }
        }

        jest.spyOn(depositUsecase, 'execute').mockImplementationOnce(async () => {
          const account = new Account(input.data.destination, 0)
          account.deposit(input.data.amount)
          return await Promise.resolve({ id: account.getId(), balance: account.getBalance() })
        })

        const output = await accountController.handleEvent(input)
        expect(output).toEqual({
          destination: {
            id: '100',
            balance: 10
          }
        })
      })

      it('Should deposit into existing account', async () => {
        const account = new Account('100', 10)
        const initialBalance = account.getBalance()
        const input = {
          type: 'deposit',
          data: {
            destination: '100',
            amount: 10
          }
        }

        jest.spyOn(depositUsecase, 'execute').mockImplementationOnce(async () => {
          account.deposit(input.data.amount)
          return await Promise.resolve({ id: account.getId(), balance: account.getBalance() })
        })

        const output = await accountController.handleEvent(input)
        expect(output).toEqual({
          destination: {
            id: '100',
            balance: initialBalance + input.data.amount
          }
        })
      })

      it('Should throw an error if destination is empty', async () => {
        const input = {
          type: 'deposit',
          data: {
            destination: '',
            amount: 10
          }
        }

        await expect(accountController.handleEvent(input)).rejects.toThrow(new InvalidParamError('Destination is required'))

        const input2 = {
          type: 'deposit',
          data: {
            amount: 10
          }
        }

        await expect(accountController.handleEvent(input2)).rejects.toThrow(new InvalidParamError('Destination is required'))
      })

      it('Should throw an error if amount is <= 0', async () => {
        const input = {
          type: 'deposit',
          data: {
            destination: '100',
            amount: 0
          }
        }

        jest.spyOn(depositUsecase, 'execute').mockImplementation(() => { throw new InvalidParamError('Amount must be greater than zero') })

        await expect(accountController.handleEvent(input)).rejects.toThrow(new InvalidParamError('Amount must be greater than zero'))

        input.data.amount = -10
        await expect(accountController.handleEvent(input)).rejects.toThrow(new InvalidParamError('Amount must be greater than zero'))
        expect(depositUsecase.execute).toHaveBeenCalledTimes(2)
      })
    })

    describe('Withdraw usecase tests', () => {
      it('Should withdraw from account', async () => {
        const account = new Account('100', 20)

        const input = {
          type: 'withdraw',
          data: {
            origin: '100',
            amount: 5
          }
        }

        jest.spyOn(withdrawUsecase, 'execute').mockImplementationOnce(async () => {
          account.withdraw(input.data.amount)
          return await Promise.resolve({ id: account.getId(), balance: account.getBalance() })
        })

        const output = await accountController.handleEvent(input)
        expect(output).toEqual({
          origin: {
            id: '100',
            balance: 15
          }
        })
      })

      it('Should throw an error if origin is empty', async () => {
        const input = {
          type: 'withdraw',
          data: {
            origin: '',
            amount: 10
          }
        }

        await expect(accountController.handleEvent(input)).rejects.toThrow(new InvalidParamError('Origin is required'))

        const input2 = {
          type: 'withdraw',
          data: {
            amount: 10
          }
        }

        await expect(accountController.handleEvent(input2)).rejects.toThrow(new InvalidParamError('Origin is required'))
      })

      it('Should throw an error if amount is <= 0', async () => {
        const input = {
          type: 'withdraw',
          data: {
            origin: '100',
            amount: 0
          }
        }

        jest.spyOn(withdrawUsecase, 'execute').mockImplementation(() => { throw new InvalidParamError('Amount must be greater than zero') })

        await expect(accountController.handleEvent(input)).rejects.toThrow(new InvalidParamError('Amount must be greater than zero'))

        input.data.amount = -10
        await expect(accountController.handleEvent(input)).rejects.toThrow(new InvalidParamError('Amount must be greater than zero'))
        expect(withdrawUsecase.execute).toHaveBeenCalledTimes(2)
      })

      it('Should throw an error if origin account not found', async () => {
        const input = {
          type: 'withdraw',
          data: {
            origin: '100',
            amount: 10
          }
        }
        jest.spyOn(withdrawUsecase, 'execute').mockImplementationOnce(() => { throw new NotFoundError('Origin account not found') })
        await expect(accountController.handleEvent(input)).rejects.toThrow(new NotFoundError('Origin account not found'))
      })

      it('Should throw an error if origin account has insufficient balance', async () => {
        const account = new Account('100', 10)
        const input = {
          type: 'withdraw',
          data: {
            origin: '100',
            amount: 20
          }
        }
        jest.spyOn(withdrawUsecase, 'execute').mockImplementationOnce(async () => {
          account.withdraw(input.data.amount)
          return await Promise.resolve({ id: account.getId(), balance: account.getBalance() })
        })
        await expect(accountController.handleEvent(input)).rejects.toThrow(new TransactionError('Insufficient funds'))
      })
    })

    describe('Transfer usecase tests', () => {
      it('Should transfer between accounts', async () => {
        const origin = new Account('100', 20)
        const destination = new Account('200', 0)

        const input = {
          type: 'transfer',
          data: {
            origin: '100',
            destination: '200',
            amount: 10
          }
        }

        jest.spyOn(transferUsecase, 'execute').mockImplementationOnce(async () => {
          origin.withdraw(input.data.amount)
          destination.deposit(input.data.amount)
          return await Promise.resolve({
            origin: {
              id: origin.getId(),
              balance: origin.getBalance()
            },
            destination: {
              id: destination.getId(),
              balance: destination.getBalance()
            }
          })
        })

        const output = await accountController.handleEvent(input)
        expect(output).toEqual({
          origin: {
            id: '100',
            balance: 10
          },
          destination: {
            id: '200',
            balance: 10
          }
        })
      })

      it('Should throw an error if origin is empty', async () => {
        const input = {
          type: 'transfer',
          data: {
            origin: '',
            destination: '200',
            amount: 10
          }
        }

        await expect(accountController.handleEvent(input)).rejects.toThrow(new InvalidParamError('Origin is required'))

        const input2 = {
          type: 'transfer',
          data: {
            destination: '200',
            amount: 10
          }
        }

        await expect(accountController.handleEvent(input2)).rejects.toThrow(new InvalidParamError('Origin is required'))
      })

      it('Should throw an error if destination is empty', async () => {
        const input = {
          type: 'transfer',
          data: {
            origin: '100',
            destination: '',
            amount: 10
          }
        }

        await expect(accountController.handleEvent(input)).rejects.toThrow(new InvalidParamError('Destination is required'))

        const input2 = {
          type: 'transfer',
          data: {
            origin: '100',
            amount: 10
          }
        }

        await expect(accountController.handleEvent(input2)).rejects.toThrow(new InvalidParamError('Destination is required'))
      })

      it('Should throw an error if amount is <= 0', async () => {
        const input = {
          type: 'transfer',
          data: {
            origin: '100',
            destination: '200',
            amount: 0
          }
        }

        jest.spyOn(transferUsecase, 'execute').mockImplementation(() => { throw new InvalidParamError('Amount must be greater than zero') })

        await expect(accountController.handleEvent(input)).rejects.toThrow(new InvalidParamError('Amount must be greater than zero'))

        input.data.amount = -10
        await expect(accountController.handleEvent(input)).rejects.toThrow(new InvalidParamError('Amount must be greater than zero'))
        expect(transferUsecase.execute).toHaveBeenCalledTimes(2)
      })

      it('Should throw an error if origin account not found', async () => {
        const input = {
          type: 'transfer',
          data: {
            origin: '100',
            destination: '200',
            amount: 10
          }
        }
        jest.spyOn(transferUsecase, 'execute').mockImplementationOnce(() => { throw new NotFoundError('Origin account not found') })
        await expect(accountController.handleEvent(input)).rejects.toThrow(new NotFoundError('Origin account not found'))
      })

      it('Should throw an error if destination account not found', async () => {
        const input = {
          type: 'transfer',
          data: {
            origin: '100',
            destination: '200',
            amount: 10
          }
        }
        jest.spyOn(transferUsecase, 'execute').mockImplementationOnce(() => { throw new NotFoundError('Destination account not found') })
        await expect(accountController.handleEvent(input)).rejects.toThrow(new NotFoundError('Destination account not found'))
      })

      it('Should throw an error if origin and destination accounts are the same', async () => {
        const input = {
          type: 'transfer',
          data: {
            origin: '100',
            destination: '100',
            amount: 10
          }
        }
        jest.spyOn(transferUsecase, 'execute').mockImplementationOnce(() => { throw new InvalidParamError('Origin and destination must be different') })
        await expect(accountController.handleEvent(input)).rejects.toThrow(new InvalidParamError('Origin and destination must be different'))
      })

      it('Should throw an error if origin account has insufficient balance', async () => {
        const origin = new Account('100', 5)
        const input = {
          type: 'transfer',
          data: {
            origin: '100',
            destination: '200',
            amount: 10
          }
        }
        jest.spyOn(transferUsecase, 'execute').mockImplementationOnce(() => {
          origin.withdraw(input.data.amount)
          return {} as any
        })
        await expect(accountController.handleEvent(input)).rejects.toThrow(new TransactionError('Insufficient funds'))
      })
    })

    describe('Invalid event', () => {
      it('Should throw an error if event type is invalid', async () => {
        const input = {
          type: 'invalid',
          data: {
            origin: '100',
            destination: '200',
            amount: 10
          }
        }
        await expect(accountController.handleEvent(input)).rejects.toThrow(new InvalidParamError('Invalid event type'))
      })
    })
  })
})
