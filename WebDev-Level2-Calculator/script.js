const display = document.getElementById('display');
const buttons = document.querySelectorAll('.btn');

let currentInput = '0';
let previousInput = null;
let operator = null;
let shouldResetDisplay = false;

function updateDisplay() {
  display.textContent = currentInput;
}

function handleNumber(number) {
  if (currentInput === '0' || shouldResetDisplay) {
    currentInput = number;
    shouldResetDisplay = false;
  } else {
    currentInput += number;
  }
}

function handleDecimal() {
  if (shouldResetDisplay) {
    currentInput = '0.';
    shouldResetDisplay = false;
    return;
  }
  if (!currentInput.includes('.')) {
    currentInput += '.';
  }
}

function handleOperator(nextOperator) {
  const inputValue = parseFloat(currentInput);

  if (operator && shouldResetDisplay) {
    operator = nextOperator;
    return;
  }

  if (previousInput === null) {
    previousInput = inputValue;
  } else if (operator) {
    const result = calculate(previousInput, inputValue, operator);
    if (result === 'Error') {
      currentInput = 'Error';
      updateDisplay();
      resetState();
      return;
    }
    currentInput = `${result}`;
    previousInput = result;
  }

  shouldResetDisplay = true;
  operator = nextOperator;
}

function calculate(first, second, op) {
  switch (op) {
    case '+':
      return first + second;
    case '-':
      return first - second;
    case '*':
      return first * second;
    case '/':
      return second === 0 ? 'Error' : first / second;
    default:
      return second;
  }
}

function resetState() {
  previousInput = null;
  operator = null;
  shouldResetDisplay = true;
}

function clearAll() {
  currentInput = '0';
  previousInput = null;
  operator = null;
  shouldResetDisplay = false;
}

function handleBackspace() {
  if (shouldResetDisplay || currentInput === 'Error') return;
  
  if (currentInput.length === 1) {
    currentInput = '0';
  } else {
    currentInput = currentInput.slice(0, -1);
  }
}

// Global Event Listeners (No inline handlers)
buttons.forEach(button => {
  button.addEventListener('click', () => {
    const action = button.dataset.action;
    const value = button.dataset.value;

    if (currentInput === 'Error' && action !== 'clear') return;

    if (!action) {
      if (value === '.') {
        handleDecimal();
      } else {
        handleNumber(value);
      }
    } else if (action === 'operator') {
      handleOperator(value);
    } else if (action === 'calculate') {
      if (operator && previousInput !== null) {
        const result = calculate(previousInput, parseFloat(currentInput), operator);
        currentInput = result === 'Error' ? 'Error' : `${result}`;
        resetState();
      }
    } else if (action === 'clear') {
      clearAll();
    } else if (action === 'backspace') {
      handleBackspace();
    }

    updateDisplay();
  });
});