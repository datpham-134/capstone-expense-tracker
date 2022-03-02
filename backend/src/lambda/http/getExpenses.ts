import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { getExpensesForCurrentUser } from '../../helpers/expenses'
import { getUserId } from '../utils'

import { createLogger } from '../../utils/logger'

const logger = createLogger('getExpenses')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // Write your code here
    logger.info('event = ', { key: event })
    const userId = getUserId(event)
    logger.info('userId = ', { key: userId })
    const listExpenses = await getExpensesForCurrentUser(userId)
    logger.info('list expenses = ', { key: listExpenses })

    if (listExpenses.count === 0)
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'List expenses not found' })
      }

    return {
      statusCode: 200,
      body: JSON.stringify({ items: listExpenses.Items })
    }
  }
)

handler.use(httpErrorHandler()).use(
  cors({
    credentials: true
  })
)
