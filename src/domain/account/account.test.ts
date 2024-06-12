import Account from './account'

describe('Account tests', () => {
  it('Should create an account', () => {
    const account = new Account('1', 0)
    expect(account.getId()).toBe('1')
    expect(account.getBalance()).toBe(0)
  })

  it('Should deposit an amount', () => {
    const account = new Account('1', 0)
    account.deposit(100)
    expect(account.getBalance()).toBe(100)
  })

  it('Should withdraw an amount', () => {
    const account = new Account('1', 100)
    account.withdraw(50)
    expect(account.getBalance()).toBe(50)
  })

  it('Should throw an error when depositing amount <= 0', () => {
    const account = new Account('1', 0)
    expect(() => { account.deposit(-100) }).toThrow('Amount must be greater than zero')
    expect(() => { account.deposit(0) }).toThrow('Amount must be greater than zero')
  })

  it('Should throw an error when withdrawing amount <= 0', () => {
    const account = new Account('1', 100)
    expect(() => { account.withdraw(-50) }).toThrow('Amount must be greater than zero')
    expect(() => { account.withdraw(0) }).toThrow('Amount must be greater than zero')
  })

  it('Should throw an error when withdrawing more than the balance', () => {
    const account = new Account('1', 100)
    expect(() => { account.withdraw(200) }).toThrow('Insufficient funds')
  })
})
