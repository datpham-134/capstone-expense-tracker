import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import * as uuid from 'uuid'

const XAWS = AWSXRay.captureAWS(AWS)

export class FileStorage {
  s3: any
  table: string
  index: string
  bucket: string
  urlTime: number
  docClient: DocumentClient

  constructor(
    s3: any,
    table: string,
    index: string,
    bucket: string,
    urlTime: number,
    docClient: DocumentClient
  ) {
    this.s3 = s3
    this.table = table
    this.index = index
    this.bucket = bucket
    this.urlTime = urlTime
    this.docClient = docClient
  }

  async getPresignedUrl(userId: string, expenseId: string): Promise<string> {
    const imageId = uuid.v4()
    const attachmentUrl = await this.s3.getSignedUrl('putObject', {
      Bucket: this.bucket,
      Key: imageId,
      Expires: this.urlTime
    })

    this.docClient.update(
      {
        TableName: this.table,
        Key: {
          expenseId,
          userId
        },
        UpdateExpression: 'set attachmentUrl = :attachmentUrl',
        ExpressionAttributeValues: {
          ':attachmentUrl': `https://${this.bucket}.s3.amazonaws.com/${imageId}`
        }
      },
      (err, data) => {
        if (err) throw new Error('Error ' + err)
        else console.log('Element updated ' + data)
      }
    )

    return attachmentUrl
  }
}

const s3 = new XAWS.S3({ signatureVersion: 'v4' })
const table = process.env.EXPENSES_TABLE
const index = process.env.EXPENSES_CREATED_AT_INDEX
const bucket = process.env.ATTACHMENT_S3_BUCKET
const urlTime = +process.env.SIGNED_URL_EXPIRATION
const docClient = new XAWS.DynamoDB.DocumentClient()

export const FileStorageInstance = new FileStorage(
  s3,
  table,
  index,
  bucket,
  urlTime,
  docClient
)
