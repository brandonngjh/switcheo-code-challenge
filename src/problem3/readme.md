# Changes

Implemented Datasource class to retrieve prices. Import statements are assumed to be complete.

## Inefficiencies:

1. interface WalletBallance:

- Added blockchain property for getPriority function

2. getPrices:

- Refactored promise handling for to use async/await as it is more readable and easier to work with.
- console.err(error) is replaced with console.error(error) in catching promise error.

3. getPriority:

- Use object literal instead of switch as objects are more flexible, readable and maintainable.
- Type in blockchain should be string instead of any.

4. sortedBalances:

- Refactored nested if statements with && operator for code readability.
- Replace lhsPriority which is undefined with balancePriority.
- Refactored and simplified sorting logic to not use if statements

4. rows:

- Takes in formattedBalances instead of sortedBalances
