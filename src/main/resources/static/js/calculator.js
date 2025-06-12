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
        try {
            const angle = parseFloat(currentExpression) || 0;
            const radians = (angle * Math.PI) / 180; // Convert to radians
            let result;
            
            switch(func) {
                case 'sin':
                    result = Math.sin(radians);
                    break;
                case 'cos':
                    result = Math.cos(radians);
                    break;
                case 'tan':
                    result = Math.tan(radians);
                    break;
            }
            
            currentExpression = result.toFixed(8).replace(/\.?0+$/, '');
            isShowingResult = true;
        } catch (error) {
            currentExpression = 'Error';
            isShowingResult = true;
        }
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
            const evalExpression = currentExpression.replace(/×/g, '*').replace(/÷/g, '/');
            currentExpression = eval(evalExpression).toString();
            isShowingResult = true;
        } catch (error) {
            currentExpression = 'Error';
            isShowingResult = true;
        }
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