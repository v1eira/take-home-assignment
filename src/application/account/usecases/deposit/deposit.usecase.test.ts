import Account from '../../../../domain/account/account'
import DepositUsecase from './deposit.usecase'

describe('Deposit usecase tests', () => {
  const accountRepository = {
    save: jest.fn(),
    get: jest.fn()
  }
  const usecase = new DepositUsecase(accountRepository)

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('Should create account with initial balance if account not found', async () => {
    const input = {
      destination: '100',
      amount: 10
    }
    accountRepository.get.mockReturnValueOnce(null)
    const output = await usecase.execute(input)
    expect(output).toEqual({
      id: '100',
      balance: 10
    })
  })

  it('Should deposit into existing account', async () => {
    const input = {
      destination: '100',
      amount: 10
    }
    accountRepository.get.mockReturnValueOnce(new Account('100', 10))
    const output = await usecase.execute(input)
    expect(output).toEqual({
      id: '100',
      balance: 20
    })
  })

  it('Should throw an error if amount is zero', async () => {
    const input = {
      destination: '100',
      amount: 0
    }
    await expect(usecase.execute(input)).rejects.toThrow('Amount must be greater than zero')
  })

  it('Should throw an error if amount is less than zero', async () => {
    const input = {
      destination: '100',
      amount: -10
    }
    await expect(usecase.execute(input)).rejects.toThrow('Amount must be greater than zero')
  })
})
