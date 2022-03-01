import { TodosAccess } from "./expensesAccess";
import { AttachmentUtils } from "./attachmentUtils";
import { TodoItem } from "../models/ExpenseItem";
import { CreateTodoRequest } from "../requests/CreateExpenseRequest";
import { UpdateTodoRequest } from "../requests/UpdateExpenseRequest";
import { createLogger } from "../utils/logger";
import * as uuid from "uuid";
import * as createError from "http-errors";
import { expenseAccessInstance } from "./expensesAccess";

// TODO: Implement businessLogic
export async function getExpensesForCurrentUser(userId: string): Promise<any> {
  return expenseAccessInstance.getExpenses(userId);
}
