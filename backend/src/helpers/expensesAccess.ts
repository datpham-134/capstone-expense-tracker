import * as AWS from "aws-sdk";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import * as AWSXRay from "aws-xray-sdk";
import { ExpenseItem } from "../models/ExpenseItem";
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
    this.docClient = docClient;
    this.s3 = s3;
    this.table = table;
    this.index = index;
    this.bucket = bucket;
    this.urlTime = urlTime;
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
}

// TODO: init todo access instance
const docClient = new XAWS.DynamoDB.DocumentClient();
const table = process.env.TODOS_TABLE;
const index = process.env.TODOS_CREATED_AT_INDEX;
const bucket = process.env.ATTACHMENT_S3_BUCKET;
const urlTime = +process.env.SIGNED_URL_EXPIRATION;
const s3 = new XAWS.S3({ signatureVersion: "v4" });

export const expenseAccessInstance = new ExpenseAccess(
  docClient,
  table,
  index,
  bucket,
  urlTime,
  s3
);
