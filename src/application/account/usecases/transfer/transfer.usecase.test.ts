import Account from '../../../../domain/account/account'
import InvalidParamError from '../../../../domain/errors/invalid-param.error'
import NotFoundError from '../../../../domain/errors/not-found.error'
import TransactionError from '../../../../domain/errors/transaction.error'
import TransferUsecase from './transfer.usecase'

describe('Transfer usecase tests', () => {
  const accountRepository = {
    save: jest.fn(),
    get: jest.fn()
  }
  const usecase = new TransferUsecase(accountRepository)

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('Should transfer amount between accounts', async () => {
    const input = {
      origin: '100',
      destination: '300',
      amount: 15
    }
    accountRepository.get
      .mockReturnValueOnce(new Account('100', 15))
      .mockReturnValueOnce(new Account('300', 0))
    const output = await usecase.execute(input)
    expect(output).toEqual({
      origin: {
        id: '100',
        balance: 0
      },
      destination: {
        id: '300',
        balance: 15
      }
    })
  })

  it('Should throw an error if amount is zero', async () => {
    const input = {
      origin: '100',
      destination: '300',
      amount: 0
    }
    await expect(usecase.execute(input)).rejects.toThrow(new InvalidParamError('Amount must be greater than zero'))
  })

  it('Should throw an error if amount is less than zero', async () => {
    const input = {
      origin: '100',
      destination: '300',
      amount: -15
    }
    accountRepository.get
      .mockReturnValueOnce(new Account('100', 15))
      .mockReturnValueOnce(new Account('300', 0))
    await expect(usecase.execute(input)).rejects.toThrow(new InvalidParamError('Amount must be greater than zero'))
  })

  it('Should throw an error if origin and destination are the same', async () => {
    const input = {
      origin: '100',
      destination: '100',
      amount: 15
    }
    await expect(usecase.execute(input)).rejects.toThrow(new InvalidParamError('Origin and destination must be different'))
  })

  it('Should throw an error if origin account not found', async () => {
    const input = {
      origin: '100',
      destination: '300',
      amount: 15
    }
    accountRepository.get.mockReturnValueOnce(null)
    await expect(usecase.execute(input)).rejects.toThrow(new NotFoundError('Origin account not found'))
  })

  it('Should throw an error if destination account not found', async () => {
    const input = {
      origin: '100',
      destination: '300',
      amount: 15
    }
    accountRepository.get
      .mockReturnValueOnce(new Account('100', 15))
      .mockReturnValueOnce(null)
    await expect(usecase.execute(input)).rejects.toThrow(new NotFoundError('Destination account not found'))
  })

  it('Should throw an error if origin account has insufficient funds', async () => {
    const input = {
      origin: '100',
      destination: '300',
      amount: 15
    }
    accountRepository.get
      .mockReturnValueOnce(new Account('100', 5))
      .mockReturnValueOnce(new Account('300', 0))
    await expect(usecase.execute(input)).rejects.toThrow(new TransactionError('Insufficient funds'))
  })
})
