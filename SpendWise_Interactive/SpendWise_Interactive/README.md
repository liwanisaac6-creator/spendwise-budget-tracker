# SpendWise — Interactive Budget Tracker

## About the project
SpendWise is a personal finance dashboard that helps a user track a monthly budget, expenses and savings. This version continues the earlier SpendWise dashboard and adds interactive JavaScript features.

## Features
- Shows monthly budget, total expenses and remaining balance.
- Stores multiple expense and savings records in an array.
- Adds and deletes transactions using forms and event listeners.
- Uses loops to calculate totals and build category cards.
- Uses conditionals to show within-budget, warning and over-budget messages.
- Updates the webpage through DOM manipulation without reloading.
- Saves records in browser localStorage on the current device.

## Starting sample figures
- Monthly budget: KSh 50,000
- Expenses: KSh 31,500
- Remaining balance: KSh 18,500
- Savings tracked separately: KSh 7,000

## How to run
1. Keep `index.html`, `style.css` and `script.js` in the same folder.
2. Open `index.html` in a web browser (Chrome is recommended).
3. Add a transaction, delete a transaction or change the monthly budget.
4. Refresh the page to confirm that browser storage keeps your records.

## JavaScript concepts demonstrated
- **Decision making:** `if...else` checks whether spending is within, near or above the budget.
- **Arrays:** `transactions` stores multiple expense and savings objects.
- **Loops:** `for...of` processes transaction records and category totals.
- **DOM manipulation:** JavaScript updates summary figures, category cards and transaction rows.
- **Events:** form submissions, change events and delete/clear button clicks trigger updates.
- **Functions:** reusable functions calculate totals, save data and render the dashboard.

## Reflection
The hardest part was connecting the transaction form to the dashboard so that every section updates together. The most important bug to avoid was counting savings as an expense, because this would make the remaining budget incorrect. I used an array of transaction objects so the application can manage many records instead of relying on separate variables. I also used loops to calculate totals and display category cards. Conditional statements now show a warning when spending reaches 80 percent of the budget and an alert when the budget is exceeded. Browser localStorage keeps the records on the same device after refreshing the page. If I had one more week, I would add monthly reports, charts and an option to export transactions to CSV.
