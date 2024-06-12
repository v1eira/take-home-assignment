import Account from '../../../domain/account/account'
import InMemoryAccountRepository from './in-memory-account-repository'

describe('In memory account repository tests', () => {
  const accountRepository = new InMemoryAccountRepository()

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('Should create an account', async () => {
    const account = new Account('100', 0)
    await accountRepository.save(account)

    const savedAccount = await accountRepository.get('100')
    expect(savedAccount).toEqual(account)
  })

  it('Should get an account', async () => {
    Object.defineProperty(accountRepository, 'accounts', { value: [new Account('100', 0)] })

    const account = await accountRepository.get('100')
    expect(account).toHaveProperty('id', '100')
    expect(account).toHaveProperty('balance', 0)
  })

  it('Should return null if account not found', async () => {
    Object.defineProperty(accountRepository, 'accounts', { value: [] })

    const account = await accountRepository.get('100')
    expect(account).toBeNull()
  })

  it('Should update an account', async () => {
    Object.defineProperty(accountRepository, 'accounts', { value: [new Account('100', 0)] })

    const account = new Account('100', 0)
    account.deposit(10)
    await accountRepository.save(account)

    const savedAccount = await accountRepository.get('100')
    expect(savedAccount).toHaveProperty('id', '100')
    expect(savedAccount).toHaveProperty('balance', 10)
  })
})
