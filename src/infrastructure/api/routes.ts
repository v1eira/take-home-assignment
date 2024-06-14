/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-misused-promises */
import express, { type Request, type Response } from 'express'
import { makeAccountController } from '../../presentation/controllers/account/factory/account.controller.factory'
import NotFoundError from '../../domain/errors/not-found.error'
import InvalidParamError from '../../domain/errors/invalid-param.error'
import TransactionError from '../../domain/errors/transaction.error'

const router = express.Router()
let accountController = makeAccountController()

router.get('/balance', async (req: Request, res: Response) => {
  try {
    const { account_id } = req.query
    const balance = await accountController.getBalance(account_id as string)
    res.status(200).send(balance.toString())
  } catch (error: any) {
    if (error instanceof InvalidParamError) {
      res.status(400).send({ error: error.message })
    } else if (error instanceof NotFoundError) {
      res.status(404).send('0')
    } else {
      res.status(500).send({ error: error.message })
    }
  }
})

router.post('/event', async (req: Request, res: Response) => {
  try {
    const eventInput = {
      type: req.body.type,
      data: {
        origin: req.body.origin ?? '',
        destination: req.body.destination ?? '',
        amount: req.body.amount
      }
    }
    const output = await accountController.handleEvent(eventInput)
    res.status(201).send(output)
  } catch (error: any) {
    if (error instanceof InvalidParamError || error instanceof TransactionError) {
      res.status(400).send({ error: error.message })
    } else if (error instanceof NotFoundError) {
      res.status(404).send('0')
    } else {
      res.status(500).send({ error: error.message })
    }
  }
})

router.post('/reset', async (req: Request, res: Response) => {
  try {
    accountController = makeAccountController()
    res.status(200).send('OK')
  } catch (error: any) {
    res.status(500).send({ error: error.message })
  }
})

export default router
