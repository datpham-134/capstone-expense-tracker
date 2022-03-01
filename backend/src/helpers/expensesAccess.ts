import * as AWS from "aws-sdk";
import * as AWSXRay from "aws-xray-sdk";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { createLogger } from "../utils/logger";
import { TodoItem } from "../models/ExpenseItem";
import { TodoUpdate } from "../models/ExpenseUpdate";

const XAWS = AWSXRay.captureAWS(AWS);

const logger = createLogger("TodosAccess");

// TODO: Implement the dataLayer logic