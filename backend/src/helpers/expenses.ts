import { UpdateExpenseRequest } from "./../requests/UpdateExpenseRequest";
import * as uuid from "uuid";
import { ExpenseItem } from "../models/ExpenseItem";
import { CreateExpenseRequest } from "../requests/CreateExpenseRequest";
import { expenseAccessInstance } from "./expensesAccess";

// TODO: Implement businessLogic
export async function getExpensesForCurrentUser(userId: string): Promise<any> {
  return expenseAccessInstance.getExpenses(userId);
}

export async function createExpense(
  userId: string,
  expensePayload: CreateExpenseRequest
): Promise<ExpenseItem> {
  const expenseItemCreated = expenseAccessInstance.createExpense({
    userId,
    expenseId: uuid.v4(),
    createdAt: new Date().toISOString(),
    attachmentUrl: undefined,
    priority: 1,
    ...expensePayload,
  });

  return expenseItemCreated;
}

export async function updateExpense(
  userId: string,
  expenseId: string,
  expensePayload: UpdateExpenseRequest
): Promise<void> {
  expenseAccessInstance.updateExpense(userId, expenseId, expensePayload);
}
