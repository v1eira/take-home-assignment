import request from 'supertest'
import { app } from '../express'

afterEach(async () => {
  await request(app).post('/reset')
})

describe('E2E routes tests', () => {
  describe('GET Balance tests', () => {
    it('Should get balance for existing account', async () => {
      let response = await request(app)
        .post('/event')
        .send({ type: 'deposit', destination: '100', amount: 10 })
      expect(response.status).toBe(201)
      expect(response.body).toEqual({ destination: { id: '100', balance: 10 } })

      response = await request(app)
        .get('/balance')
        .query({ account_id: '100' })
      expect(response.status).toBe(200)
      expect(response.text).toBe('10')
    })

    it('Should not get balance for non-existing account', async () => {
      const response = await request(app).get('/balance?account_id=1234')
      expect(response.status).toBe(404)
      expect(response.text).toBe('0')
    })

    it('Should not get balance if account_id is missing', async () => {
      const response = await request(app).get('/balance')
      expect(response.status).toBe(400)
    })
  })

  describe('POST Event tests', () => {
    describe('Deposit tests', () => {
      it('Should create account with initial balance', async () => {
        const response = await request(app)
          .post('/event')
          .send({ type: 'deposit', destination: '100', amount: 10 })
        expect(response.status).toBe(201)
        expect(response.body).toEqual({ destination: { id: '100', balance: 10 } })
      })

      it('Should deposit into existing account', async () => {
        let response = await request(app)
          .post('/event')
          .send({ type: 'deposit', destination: '100', amount: 10 })
        expect(response.status).toBe(201)
        expect(response.body).toEqual({ destination: { id: '100', balance: 10 } })

        response = await request(app)
          .post('/event')
          .send({ type: 'deposit', destination: '100', amount: 10 })
        expect(response.status).toBe(201)
        expect(response.body).toEqual({ destination: { id: '100', balance: 20 } })
      })

      it('Should throw an error if destination is empty', async () => {
        const response = await request(app)
          .post('/event')
          .send({ type: 'deposit', amount: 10 })
        expect(response.status).toBe(400)
      })
    })

    describe('Withdraw tests', () => {
      it('Should withdraw from existing account', async () => {
        let response = await request(app)
          .post('/event')
          .send({ type: 'deposit', destination: '100', amount: 10 })
        expect(response.status).toBe(201)
        expect(response.body).toEqual({ destination: { id: '100', balance: 10 } })

        response = await request(app)
          .post('/event')
          .send({ type: 'withdraw', origin: '100', amount: 10 })
        expect(response.status).toBe(201)
        expect(response.body).toEqual({ origin: { id: '100', balance: 0 } })
      })

      it('Should not withdraw from non-existing account', async () => {
        const response = await request(app)
          .post('/event')
          .send({ type: 'withdraw', origin: '200', amount: 10 })
        expect(response.status).toBe(404)
        expect(response.text).toBe('0')
      })

      it('Should throw an error if origin is empty', async () => {
        const response = await request(app)
          .post('/event')
          .send({ type: 'withdraw', amount: 10 })
        expect(response.status).toBe(400)
      })
    })

    describe('Transfer tests', () => {
      it('Should transfer from existing account', async () => {
        let response = await request(app)
          .post('/event')
          .send({ type: 'deposit', destination: '100', amount: 10 })
        expect(response.status).toBe(201)
        expect(response.body).toEqual({ destination: { id: '100', balance: 10 } })

        response = await request(app)
          .post('/event')
          .send({ type: 'transfer', origin: '100', destination: '200', amount: 10 })
        expect(response.status).toBe(201)
        expect(response.body).toEqual({ origin: { id: '100', balance: 0 }, destination: { id: '200', balance: 10 } })
      })

      it('Should not transfer from existing account', async () => {
        const response = await request(app)
          .post('/event')
          .send({ type: 'transfer', origin: '100', destination: '200', amount: 10 })
        expect(response.status).toBe(404)
        expect(response.text).toBe('0')
      })

      it('Should throw an error if origin is empty', async () => {
        const response = await request(app)
          .post('/event')
          .send({ type: 'transfer', destination: '200', amount: 10 })
        expect(response.status).toBe(400)
      })

      it('Should throw an error if destination is empty', async () => {
        const response = await request(app)
          .post('/event')
          .send({ type: 'transfer', origin: '100', amount: 10 })
        expect(response.status).toBe(400)
      })
    })

    describe('Invalid event tests', () => {
      it('Should throw an error if event type is invalid', async () => {
        const response = await request(app)
          .post('/event')
          .send({ type: 'invalid', origin: '100', destination: '200', amount: 10 })
        expect(response.status).toBe(400)
      })

      it('Should throw an error if event type is missing', async () => {
        const response = await request(app)
          .post('/event')
          .send({ origin: '100', destination: '200', amount: 10 })
        expect(response.status).toBe(400)
      })
    })
  })

  describe('POST Reset tests', () => {
    it('Should reset state before starting tests', async () => {
      const response = await request(app).post('/reset')
      expect(response.status).toBe(200)
    })
  })
})
