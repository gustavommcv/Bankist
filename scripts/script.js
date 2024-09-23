'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

const containerMovements = document.querySelector('.movements');
const labelBalance = document.querySelector('.main__current-balance-amount');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInt = document.querySelector('.summary__value--interest');
const labelWelcome = document.querySelector('.header__login-message');

const inputLoginUsername = document.querySelector('.header__form-input--username');
const inputLoginPIN = document.querySelector('.header__form-input--pin');
const buttonLogin = document.querySelector('.header__submit-button');

const main = document.querySelector('.main');
const footer = document.querySelector('.footer');

const btnTransfer = document.querySelector('.transactions__submit-button--transfer');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputTransferTo = document.querySelector('.form__input--to');

const btnCloseAccount = document.querySelector('.transactions__submit-button--account');
const inputCloseUser = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const btnLoan = document.querySelector('.transactions__submit-button--loan');
const inputLoan = document.querySelector('.form__input--loan-amount');

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

const calcDisplayBalance = function(acc) {
  const balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${balance} €`;

  acc.balance = balance;
}

const calcDisplaySummary = function(acc) {
  const incomes = acc.movements.filter(m => m > 0).reduce((acc, curr) => acc + curr, 0);
  labelSumIn.textContent = `${incomes} €`;

  const outcomes = acc.movements.filter(m => m < 0).reduce((acc, curr) => acc + curr);
  labelSumOut.textContent = `${Math.abs(outcomes)} €`;

  const interest = acc.movements.
  filter(mov => mov > 0).
  map(deposit => deposit * acc.interestRate / 100).
  filter(int => int >= 1).
  reduce((acc, int) => acc + int, 0);

  labelSumInt.textContent = `${Math.abs(interest)} €`;
}

let currentAccount;

const updateUI = function(acc) {
  // Display movements
  displayMovements(acc.movements);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
}

buttonLogin.addEventListener('click', function(event) {
  // Prevent form from submiting
  event.preventDefault();
  // console.log('LOGIN')

  currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value);

  if(currentAccount?.pin === Number(inputLoginPIN.value)) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}`;
    main.style.opacity = 1;
    footer.style.opacity = 1;

    // Clear input fields
    inputLoginUsername.value = inputLoginPIN.value = '';
    inputLoginUsername.blur();
    inputLoginPIN.blur();

    // Update UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function(e) {
  e.preventDefault();

  const amount = Number(inputTransferAmount.value)
  const receiverAccount = accounts.find(acc => acc.username === inputTransferTo.value);

  inputTransferAmount.value = inputTransferTo.value = '';

  if (amount > 0 && receiverAccount && currentAccount.balance >= amount && receiverAccount?.username !== currentAccount.username) {

    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAccount.movements.push(amount);

    // Update UI
    updateUI(currentAccount);
  }
});

btnLoan.addEventListener('click', function(e) {
  e.preventDefault();

  const amount = Number(inputLoan.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // Add movement
    currentAccount.movements.push(amount);

    // Update UI
    updateUI(currentAccount);
  }

  inputLoan.value = '';
  inputLoan.blur();
});

btnCloseAccount.addEventListener('click', function(e) {
  e.preventDefault();

  if (currentAccount.pin == inputClosePin.value && currentAccount.username == inputCloseUser.value) {
    const index = accounts.findIndex(acc => acc.username === currentAccount.username);

    accounts.splice(index, 1);

    inputClosePin.value = inputCloseUser.value = '';
    inputClosePin.blur();
    inputCloseUser.blur();

    main.style.opacity = 0;
    footer.style.opacity = 0;
  }
})

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

const firstWithDrawal = movements.find(mov => mov < 0);
// console.log(movements);
// console.log(firstWithDrawal);

// Separate callback
const deposit = mov => mov > 0;

// console.log(accounts);
const account = accounts.find(acc => acc.owner === 'Jessica Davis');
// console.log(account)

// console.log(movements);

// SOME

// EQUALITY
// console.log(movements.includes(-130));

// CONDITION
const anyDeposits = movements.some(deposit);

// console.log(anyDeposits);

// EVERY
// console.log(account4.movements.every(deposit));

