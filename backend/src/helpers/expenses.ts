import * as uuid from "uuid";
import { ExpenseItem } from "../models/ExpenseItem";
import { CreateExpenseRequest } from "../requests/CreateExpenseRequest";
import { UpdateExpenseRequest } from "./../requests/UpdateExpenseRequest";
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

export async function deleteExpense(userId: string, expenseId: string): Promise<void> {
  expenseAccessInstance.deleteExpense(userId, expenseId);
}
