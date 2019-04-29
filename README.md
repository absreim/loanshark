### Loanshark - an app to track borrowed items between friends

Lent items are kept track in a unit known as a "loan", which contains a description of the contents lent out, the date that it was lent out, a promised return date, and an actual return date.

Loans that are initially created in a **pending** state, where the potential borrower may accept the terms of the loan. Once accepted, that loan changes to the **outstanding** state, awaiting the return of the item. Once the item is returned, the lender may mark the loan as **completed**.

#### Usage

This repository contains a backend only. No working front end is currently available.

A production deployment is available at https://loanshark.brook.li.

The project has been tested to work on NodeJS 10 and 11. It relies on PostgreSQL (tested with version 11) with a database named "loanshark". Run the npm "seed" script to have Sequelize create the necessary tables in the database.

The project will use a port number specified in the environment variable PORT and a session secret in environment variable SECRET if the respective variable exists.

#### Lessons learned

The web server used for this project is Koa 3, which has far worse community support than Express 4. In particular, no actual implementation of Passport exists for Koa as of the time of this writing. The *koa-passport* module adapts Passport to work with Koa.

#### Future improvements

The most pressing improvement to make, of course, is to have a working front end. Besides that, there are several features in mind for the next tier of functionality:

- Allow for pending loans to be cancelled or rejected.
- A rating system for lending/borrowing expriences.
- A social credit score system that is built up by completed borrowing and lending actions and hurt by returning items late and bad ratings.
- A persistent friends list.