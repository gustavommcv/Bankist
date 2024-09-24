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

const btnSort = document.querySelector('.button--sort');

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

// const account3 = {
//   owner: 'Steven Thomas Williams',
//   movements: [200, -200, 340, -300, -20, 50, 400, -460],
//   interestRate: 0.7,
//   pin: 3333,
// };

// const account4 = {
//   owner: 'Sarah Smith',
//   movements: [430, 1000, 700, 50, 90],
//   interestRate: 1,
//   pin: 4444,
// };

// const accounts = [account1, account2, account3, account4];
const accounts = [account1, account2];

const displayMovements = function(movements, sort = false) {

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  containerMovements.innerHTML = '';

  movs.forEach(function (moviment, i) {
    const type = moviment > 0 ? 'deposit' : 'withdrawal'

    const html = `
       <div class="movements__row">
          <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
          <div class="movements__date">12/03/2020</div>
          <div class="movements__value">${moviment.toFixed(2)}</div>
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
  labelBalance.textContent = `${balance.toFixed(2)} €`;

  acc.balance = balance;
}

const calcDisplaySummary = function(acc) {
  const incomes = acc.movements.filter(m => m > 0).reduce((acc, curr) => acc + curr, 0);
  labelSumIn.textContent = `${incomes.toFixed(2)} €`;

  const outcomes = acc.movements.filter(m => m < 0).reduce((acc, curr) => acc + curr);
  labelSumOut.textContent = `${Math.abs(outcomes).toFixed(2)} €`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => deposit * acc.interestRate / 100)
    .filter(int => int >= 1)
    .reduce((acc, int) => acc + int, 0);

  labelSumInt.textContent = `${Math.abs(interest).toFixed(2)} €`;
};


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

    labelWelcome.textContent = 'Log in to get started';

    accounts.splice(index, 1);

    inputClosePin.value = inputCloseUser.value = '';
    inputClosePin.blur();
    inputCloseUser.blur();

    main.style.opacity = 0;
    footer.style.opacity = 0;
  }
});

let sorted = false;
btnSort.addEventListener('click', function(e) {
  e.preventDefault();

  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

