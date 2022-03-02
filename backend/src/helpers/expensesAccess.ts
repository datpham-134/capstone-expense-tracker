import * as AWS from "aws-sdk";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import * as AWSXRay from "aws-xray-sdk";
import { ExpenseItem } from "../models/ExpenseItem";
import { ExpenseUpdate } from "../models/ExpenseUpdate";
import { createLogger } from "../utils/logger";

const XAWS = AWSXRay.captureAWS(AWS);

const logger = createLogger("ExpensesAccess");

// TODO: Implement the dataLayer logic
export class ExpenseAccess {
  s3: any;
  table: string;
  index: string;
  bucket: string;
  urlTime: number;
  docClient: DocumentClient;

  constructor(
    s3: any,
    table: string,
    index: string,
    bucket: string,
    urlTime: number,
    docClient: DocumentClient
  ) {
    this.s3 = s3;
    this.table = table;
    this.index = index;
    this.bucket = bucket;
    this.urlTime = urlTime;
    this.docClient = docClient;
  }

  async getExpenses(userId: string): Promise<any> {
    const expenses = this.docClient
      .query({
        TableName: this.table,
        IndexName: this.index,
        KeyConditionExpression: "userId = :userId",
        ExpressionAttributeValues: {
          ":userId": userId,
        },
      })
      .promise();
    logger.info("list expenses of userId = ", {
      credentials: userId,
      key: expenses,
    });
    return expenses;
  }

  async createExpense(expense: ExpenseItem): Promise<any> {
    this.docClient
      .put({
        TableName: this.table,
        Item: expense,
      })
      .promise();
    logger.info("expense created = ", {
      key: expense,
    });
    return expense;
  }

  async updateExpense(
    userId: string,
    expenseId: string,
    expensePayload: ExpenseUpdate
  ): Promise<void> {
    logger.info("update expense = ", {
      credentials: userId,
      expenseId,
      expensePayload,
    });
    this.docClient.update(
      {
        TableName: this.table,
        Key: {
          userId,
          expenseId,
        },
        UpdateExpression: "set #name = :n, #price = :p1, #priority = :p2",
        ExpressionAttributeValues: {
          ":n": expensePayload.name,
          ":p1": expensePayload.price,
          ":p2": expensePayload.priority,
        },
        ExpressionAttributeNames: {
          "#name": "name",
          "#price": "price",
          "#priority": "priority",
        },
      },
      (err, data) => {
        if (err) throw new Error("Error " + err);
        else console.log("updated " + data);
      }
    );
  }

  async deleteExpense(userId: string, expenseId: string): Promise<void> {
    logger.info("delete expense = ", {
      credentials: userId,
      expenseId,
    });
    this.docClient.delete(
      {
        TableName: this.table,
        Key: {
          userId,
          expenseId,
        },
      },
      (err, data) => {
        if (err) throw new Error("Error " + err);
        else console.log("delete " + data);
      }
    );
  }
}

const docClient = new XAWS.DynamoDB.DocumentClient();
const table = process.env.TODOS_TABLE;
const index = process.env.TODOS_CREATED_AT_INDEX;
const bucket = process.env.ATTACHMENT_S3_BUCKET;
const urlTime = +process.env.SIGNED_URL_EXPIRATION;
const s3 = new XAWS.S3({ signatureVersion: "v4" });

export const expenseAccessInstance = new ExpenseAccess(
  s3,
  table,
  index,
  bucket,
  urlTime,
  docClient
);
