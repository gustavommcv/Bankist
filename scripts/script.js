'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

const containerMovements = document.querySelector('.movements');
const labelBalance = document.querySelector('.main__current-balance-amount');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInt = document.querySelector('.summary__value--interest');

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

const displayMovements = function(movements) {
  containerMovements.innerHTML = '';

  movements.forEach(function (moviment, i) {
    const type = moviment > 0 ? 'deposit' : 'withdrawal'

    const html = `
       <div class="movements__row">
          <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
          <div class="movements__date">12/03/2020</div>
          <div class="movements__value">${moviment}</div>
        </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
}

displayMovements(account1.movements);

const user = 'Steven Thomas Williams'; // stw

const createUsernames = function(accounts) {
  accounts.forEach(function(acc) {
    acc.username = acc.owner.toLowerCase()
    .split(' ')
    .map(x => x.charAt(0))
    .join(''); 
  });
}

createUsernames(accounts);

const calcDisplayBalance = function(movements) {
  const balance = movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${balance} €`;
}

calcDisplayBalance(account1.movements);

const calcDisplaySummary = function(movements) {
  const incomes = movements.filter(m => m > 0).reduce((acc, curr) => acc + curr, 0);
  labelSumIn.textContent = `${incomes} €`;

  const outcomes = movements.filter(m => m < 0).reduce((acc, curr) => acc + curr);
  labelSumOut.textContent = `${Math.abs(outcomes)} €`;

  const interest = movements.
  filter(mov => mov > 0).
  map(deposit => deposit * 1.2/100).
  filter(int => int >= 1).
  reduce((acc, int) => acc + int, 0);

  labelSumInt.textContent = `${Math.abs(interest)} €`;
}

calcDisplaySummary(account1.movements);

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
    ['USD', 'United States dollar'],
    ['EUR', 'Euro'],
    ['GBP', 'Pound sterling'],
]);
  
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
  
/////////////////////////////////////////////////

const eurToUsd = 1.1;

// const movementsUSD = movements.map(function(movement) {
//   return movement * eurToUsd;
// });

const movementsUSD = movements.map(movement => movement * eurToUsd);

// console.log(movements);
// console.log(movementsUSD);

const movementsDescriptions = movements.map((mov, i, arr) => 
  `Movement ${i + 1}: You ${mov > 0 ? 'deposited' : 'withdrew'} ${Math.abs(mov)}`
);

// console.log(movementsDescriptions);

const deposits = movements.filter(m => m > 0);
const withdrawals = movements.filter(m => m < 0);

// console.log(deposits);
// console.log(withdrawals);
// console.log(movements);

// const balance = movements.reduce(function (acc, cur, i, arr) {
//   return acc + cur;
// }, 0);
// console.log(balance);

const max = movements.reduce((acc, mov) => {
  if (mov > acc) {
    return mov;
  } else {
    return acc;
  }
}, movements[0]);
// console.log(max);

// PIPELINE
const totalDepositsUSD = movements
.filter(mov => mov > 0)
.map((mov, i, arr) => {
  return mov * eurToUsd;
})
// .map(mov => mov * eurToUsd)
.reduce((acc, mov) => acc + mov, 0);

// console.log(totalDepositsUSD);
