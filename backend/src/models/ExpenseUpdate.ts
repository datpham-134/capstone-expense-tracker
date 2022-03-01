/**
 * EXPENSE ITEM MODEL
 * price: double number > 0
 * priority: integer number from 1-3 (default = 0)
 */

export interface ExpenseUpdate {
  name: string;
  price: number;
  priority: number;
}
