/**
 * EXPENSE ITEM MODEL
 * price: double number > 0
 * priority: integer number from 1-3 (default = 0)
 */

export interface ExpenseItem {
  userId: string;
  expenseId: string;
  createdAt: string;
  name: string;
  price: number;
  priority: number;
  attachmentUrl?: string;
}
