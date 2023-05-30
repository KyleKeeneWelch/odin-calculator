// References to elements in page.
const bottomButtonsContainer = document.querySelector('#bottom-buttons-container');
const displayText = document.querySelector('#display-text');
const clearbtn = document.querySelector('#clear-btn');
const deletebtn = document.querySelector('#delete-btn');

// Constant values for buttons, numbers, operator arrays and default values. 
const BOTTOM_BUTTONS = ['7', '8', '9', '÷', '4', '5', '6', 'x', '1', '2', '3', '-', '.', '0', '=', '+'];
const NUMBERS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.'];
const OPERATORS = ['÷', 'x', '+', '-'];
const DEFAULT_NUM_OPERATOR = null;
const DEFAULT_DECIMAL = false;

// Variable values for numbers, operator and decimal booleans.
let firstNum = DEFAULT_NUM_OPERATOR;
let secondNum = DEFAULT_NUM_OPERATOR
let operator = DEFAULT_NUM_OPERATOR;
let firstNumHasDecimal = DEFAULT_DECIMAL;
let secondNumHasDecimal = DEFAULT_DECIMAL;

// Event listeners including clear and delete button functionality and keyboard support through onkeydown.
clearbtn.onclick = (e) => clearDisplayText();
deletebtn.onclick = (e) => deleteDisplayText();
document.body.onkeydown = (e) => {
    // Allow only bottom buttons or slash key (divide sign alternative).
    if (BOTTOM_BUTTONS.includes(e.key) || e.key == '/') {
        if (e.key == '/') {
            processInput('÷');
        }
        else {
            processInput(e.key);
        }
    }
    else if (e.key == "Enter") {
        processInput('=');
    }
    else if (e.key == "Backspace") {
        deleteDisplayText();
    }
    else if (e.key == "Delete") {
        clearDisplayText();
    }
}

// Removes first num and obtains second.
function removeFirstNum() {
    let temp = displayText.textContent;
    let index;
    let result;
    // Negative numbers
    if (firstNum < 0) {
        // Remove initial -.
        temp = displayText.textContent.substring(1);
        // Find operator.
        index = temp.indexOf(operator) + 1;
        // Obtain second number.
        result = displayText.textContent.substring(index + 1);
    }
    // Positive numbers
    else {
        //Find operator.
        index = temp.indexOf(operator);
        // Obtain second number.
        result = displayText.textContent.substring(index + 1);
    }
    return result;
}

// Checks for decimal.
function checkContainsDecimal() {
    for (i = 0; i < displayText.textContent.length; i++) {
        if (displayText.textContent[i] == '.') {
            return true;
        }
    }
    return false;
}

// Check for operator.
function checkContainsOperator() {
    for (i = 0; i < displayText.textContent.length; i++) {
        if (OPERATORS.includes(displayText.textContent[i])) {
            return true;
        }
    }
    return false;
}

// Assign first and second number in calculation.
function assignFirstSecond() {
    // If no operator (first number).
    if (!checkContainsOperator()) {
        // If decimal.
        if(checkContainsDecimal()) {
            // Convert Float.
            firstNum = parseFloat(displayText.textContent);
        }
        // If Integer.
        else {
            // Convert Integer.
            firstNum = parseInt(displayText.textContent);
            firstNumHasDecimal = false;
        }
    }
    // If operator (second number).
    else {
        // Remove first.
        temp = removeFirstNum();
        // If decimal.
        if(checkContainsDecimal()) {
            // Convert Float.
            secondNum = parseFloat(temp);
        }
        // If Integer.
        else {
            // Convert Integer.
            secondNum = parseInt(temp);
            secondNumHasDecimal = false;
        }
    }
}

// Handle Input.
function processInput(input) {
    //If not equals and not operator
    if (input != '=' && !OPERATORS.includes(input)) {
        // If decimal point.
        if (input == '.')
        {
            // If positive number, no decimal, no operator (first number), and no decimal second number.
            if (firstNum >= 0 && !firstNumHasDecimal && !checkContainsOperator() && !secondNumHasDecimal) {
                displayText.textContent += input;
                firstNumHasDecimal = true;
            }
            // If positive number, decimal, operator (second number), and no decimal second number.
            else if (firstNum >= 0 && firstNumHasDecimal && checkContainsOperator() && !secondNumHasDecimal) {
                displayText.textContent += input;
                secondNumHasDecimal = true;
            }
            // If negative, no decimal, and no decimal second number.
            else if (firstNum < 0 && !firstNumHasDecimal && !secondNumHasDecimal) {
                displayText.textContent += input;
                firstNumHasDecimal = true;
            }
            // If negative, decimal and no decimal second number.
            else if (firstNum < 0 && firstNumHasDecimal && !secondNumHasDecimal) {
                displayText.textContent += input;
                secondNumHasDecimal = true;
            }
        }
        // If not decimal point.
        else {
            displayText.textContent += input;
        }
    }
    // If equals is pressed.
    else if (input == '=') {
        try {
            // If numbers and operator assigned.
            if (firstNum != null && secondNum != null && operator != null) {
                // Make calculation and result is new first number.
                firstNum = operate();
                displayText.textContent = firstNum.toString();
                secondNum = null;
                operator = null;
            }
        } catch (e) {
            console.log(e);
        }
    }

    // If contains a number.
    if (NUMBERS.includes(input))
    {
        // Reassign first and second numbers.
        assignFirstSecond();
    }
    // If contains an operator.
    else if (OPERATORS.includes(input)) {
        // If no operator and not empty.
        if (!checkContainsOperator() && displayText.textContent != '') {
            displayText.textContent += input;
            operator = input;
        }
        // If negative and not empty.
        else if (firstNum.toString().charAt(0) == '-' && displayText.textContent != '') {
            displayText.textContent += input;
            operator = input;
        };
    }
}

// Deletes the end character from display.
function deleteDisplayText() {
    displayString = displayText.textContent;
    if (!displayString == '') {
        // Substring display to include all but final character.
        displayText.textContent = displayString.substring(0, displayString.length - 1);
        // Reassign numbers.
        assignFirstSecond();
    }
}

// Resets display and related variables.
function clearDisplayText() {
    firstNum = null;
    secondNum = null;
    operator = null;
    hasOperatorWithNegative = false;
    firstNumHasDecimal = false;
    secondNumHasDecimal = false;
    displayText.textContent = '';
}

function add() {
    return firstNum + secondNum;
}

function subtract() {
    return firstNum - secondNum;
}

function multiply() {
    return firstNum * secondNum;
}

function divide() {
    // Prevent divide by 0.
    if (secondNum == 0)
    {
        clearDisplayText();
        alert('Unable to divide by 0');
        return '';
    }
    else {
        return firstNum / secondNum;
    }
}

// Make calculation based on operator.
function operate() {
    if (operator == "+") {
        return add();
    }
    else if (operator == "-") {
        return subtract();
    }
    else if (operator == "x") {
        return multiply();
    }
    else if (operator == "÷") {
        return divide();
    }
}

// Creates grid for bottom buttons.
function makeGrid() {
    for (i = 0; i < 16; i++) {
        const cell = document.createElement("div");
        // Button will display right text based on array order.
        cell.textContent = BOTTOM_BUTTONS[i];
        // Each button will process input by passing in their text.
        cell.onclick = (e) => processInput(cell.textContent);
        // Adds each button to grid.
        bottomButtonsContainer.appendChild(cell).className = "grid-item ripple";
    };
}

// Make grid upon load.
window.onload = () => {
    makeGrid();
}