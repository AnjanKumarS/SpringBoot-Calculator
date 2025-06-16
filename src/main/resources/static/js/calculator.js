document.addEventListener('DOMContentLoaded', () => {
    const display = document.getElementById('display');
    let currentExpression = '';
    let isShowingResult = false;

    // Add event listeners to all buttons
    document.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', () => {
            const value = button.getAttribute('data-value');
            handleInput(value);
        });
    });

    // Add keyboard support
    document.addEventListener('keydown', (event) => {
        event.preventDefault(); // Prevent default keyboard behavior
        
        const key = event.key;
        
        // Handle numeric keys and operators
        if (isValidKey(key)) {
            if (key === 'Enter') {
                handleInput('=');
            } else if (key === 'Escape') {
                handleInput('C');
            } else if (key === '*') {
                handleInput('*');
            } else if (key === '/') {
                handleInput('/');
            } else {
                handleInput(key);
            }
        }
    });

    function isValidKey(key) {
        // Allow numbers, operators, decimal point, parentheses, and control keys
        const validKeys = [
            '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
            '+', '-', '*', '/', '.',
            '(', ')',
            'Enter', 'Escape', 'Backspace'
        ];
        return validKeys.includes(key);
    }

    function handleInput(value) {
        if (isShowingResult && !isOperator(value) && value !== 'C') {
            currentExpression = '';
            isShowingResult = false;
        }

        switch(value) {
            case 'C':
                clear();
                break;
            case '±':
                handleNegative();
                break;
            case '=':
                calculate();
                break;
            case 'sin':
            case 'cos':
            case 'tan':
                handleTrig(value);
                break;
            case 'Backspace':
                if (!isShowingResult) {
                    currentExpression = currentExpression.slice(0, -1);
                }
                break;
            default:
                if (isValidInput(value)) {
                    appendToExpression(value);
                }
        }
        
        updateDisplay();
    }

    function isValidInput(value) {
        // Check if the value is a number, operator, decimal point, or parenthesis
        return /^[0-9+\-*/.()]$/.test(value);
    }

    function handleTrig(func) {
        if (isShowingResult) {
            currentExpression = '';
            isShowingResult = false;
        }
        currentExpression = func + '(';
        updateDisplay();
    }

    function appendToExpression(value) {
        if (value === '.' && currentExpression.includes('.')) return;
        currentExpression += value;
    }

    function handleNegative() {
        if (currentExpression.startsWith('-')) {
            currentExpression = currentExpression.slice(1);
        } else {
            currentExpression = '-' + currentExpression;
        }
    }

    function isOperator(value) {
        return ['+', '-', '*', '/', '(', ')'].includes(value);
    }

    function calculate() {
        try {
            // Replace × and ÷ with * and / for evaluation
            let evalExpression = currentExpression.replace(/×/g, '*').replace(/÷/g, '/');
            
            // Evaluate the expression following BODMAS rules
            const result = evaluateExpression(evalExpression);
            currentExpression = result.toFixed(8).replace(/\.?0+$/, ''); // Format result to 8 decimal places and remove trailing zeros
            isShowingResult = true;
        } catch (error) {
            currentExpression = 'Error';
            isShowingResult = true;
        }
        updateDisplay();
    }

    function evaluateExpression(expression) {
        // Remove all spaces
        expression = expression.replace(/\s+/g, '');
        
        // Handle brackets first (B in BODMAS)
        while (expression.includes('(')) {
            expression = expression.replace(/\(([^()]+)\)/g, function(match, group) {
                return evaluateExpression(group);
            });
        }

        // Handle trigonometric functions
        expression = expression.replace(/(sin|cos|tan)\(([^)]+)\)/g, function(match, func, angle) {
            const value = parseFloat(evaluateExpression(angle));
            const radians = value * Math.PI / 180; // Convert to radians
            switch(func) {
                case 'sin': return Math.sin(radians);
                case 'cos': return Math.cos(radians);
                case 'tan': return Math.tan(radians);
            }
        });

        // Handle multiplication and division (DM in BODMAS)
        while (expression.match(/[\d.]+[\*/][\d.]+/)) {
            expression = expression.replace(/([\d.]+)([\*/])([\d.]+)/, function(match, num1, op, num2) {
                return op === '*' ? num1 * num2 : num1 / num2;
            });
        }

        // Handle addition and subtraction (AS in BODMAS)
        while (expression.match(/[\d.]+[\+\-][\d.]+/)) {
            expression = expression.replace(/([\d.]+)([\+\-])([\d.]+)/, function(match, num1, op, num2) {
                return op === '+' ? parseFloat(num1) + parseFloat(num2) : parseFloat(num1) - parseFloat(num2);
            });
        }

        return parseFloat(expression);
    }

    function clear() {
        currentExpression = '';
        isShowingResult = false;
    }

    function updateDisplay() {
        display.value = currentExpression || '0';
        display.className = isShowingResult ? 'result' : 'input';
    }

    // Initialize display
    updateDisplay();
}); 