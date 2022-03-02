# Expense Tracker

## Starter Code

[serverless-todo-starter](https://github.com/udacity/cloud-developer/tree/master/course-04/project/c4-final-project-starter-code)

### In real life, we need manage our money flow. Expense tracker keep track off how much do you spend at specific time. It's have CRUD methods for expense object as well as authentication to display list expenses of specific user

### Tech stack using: serverless technology, typescript, nodejs and auth0

Expense object has properties

- userId: unique identifier expense for that user
- expenseId: unique identifier expense for expense object
- createdAt: Time when it created
- name: Expense name
- price: Expense price is a double number
- priority: Integer number range from 1-3 (default is 1)
- attachmentUrl: not required, help user upload image for expense
