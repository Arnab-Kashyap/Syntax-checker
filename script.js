// Main syntax checking function
function checkSyntax() {
    const code = document.getElementById('code').value;
    const language = document.getElementById('language').value;
    const result = document.getElementById('result');

    // Clear previous results
    result.classList.remove('visible');
    
    // Check if code is empty
    if (!code.trim()) {
        result.className = 'error visible';
        result.textContent = 'Please enter some code to check';
        return;
    }

    // Basic syntax checking based on language
    try {
        switch(language) {
            case 'c':
                checkCSyntax(code);
                break;
            case 'cpp':
                checkCPPSyntax(code);
                break;
            case 'java':
                checkJavaSyntax(code);
                break;
            case 'python':
                checkPythonSyntax(code);
                break;
            default:
                throw new Error('Unsupported language selected');
        }
        result.className = 'success visible';
        result.textContent = '✓ No obvious syntax errors found!';
    } catch (error) {
        result.className = 'error visible';
        result.textContent = '✗ Syntax Error: ' + error.message;
    }
}

function checkCSyntax(code) {
    const errors = [];
    
    // Check for matching braces
    if ((code.match(/\{/g) || []).length !== (code.match(/\}/g) || []).length) {
        errors.push("Mismatched braces");
    }

    // Check for matching parentheses
    if ((code.match(/\(/g) || []).length !== (code.match(/\)/g) || []).length) {
        errors.push("Mismatched parentheses");
    }

    // Check for semicolons
    const lines = code.split('\n').filter(line => 
        line.trim() && 
        !line.trim().startsWith('//') && 
        !line.trim().startsWith('#') &&
        !line.trim().endsWith('{') &&
        !line.trim().endsWith('}')
    );
    
    if (lines.some(line => !line.trim().endsWith(';'))) {
        errors.push("Missing semicolons");
    }

    // Check for main function
    if (!code.includes('main()') && !code.includes('main(void)') && !code.includes('main(int argc, char *argv[])')) {
        errors.push("No main function found");
    }

    // Check for basic include statements
    if (!code.includes('#include')) {
        errors.push("No include statements found");
    }

    // Check for string literal termination
    const unclosedQuotes = (code.match(/"/g) || []).length % 2;
    if (unclosedQuotes !== 0) {
        errors.push("Unclosed string literal");
    }

    if (errors.length > 0) {
        throw new Error(errors.join(', '));
    }
}

function checkCPPSyntax(code) {
    const errors = [];
    
    // Check for matching braces
    if ((code.match(/\{/g) || []).length !== (code.match(/\}/g) || []).length) {
        errors.push("Mismatched braces");
    }

    // Check for matching parentheses
    if ((code.match(/\(/g) || []).length !== (code.match(/\)/g) || []).length) {
        errors.push("Mismatched parentheses");
    }

    // Check for semicolons
    const lines = code.split('\n').filter(line => 
        line.trim() && 
        !line.trim().startsWith('//') && 
        !line.trim().startsWith('#') &&
        !line.trim().endsWith('{') &&
        !line.trim().endsWith('}')
    );
    
    if (lines.some(line => !line.trim().endsWith(';'))) {
        errors.push("Missing semicolons");
    }

    // Check for main function
    if (!code.includes('main()') && !code.includes('main(void)') && !code.includes('main(int argc, char *argv[])')) {
        errors.push("No main function found");
    }

    // Check for iostream
    if (!code.includes('iostream')) {
        errors.push("No iostream include found");
    }

    // Check for using namespace std or std:: usage
    if (!code.includes('using namespace std') && !code.includes('std::')) {
        errors.push("No std namespace specification found");
    }

    // Check for string literal termination
    const unclosedQuotes = (code.match(/"/g) || []).length % 2;
    if (unclosedQuotes !== 0) {
        errors.push("Unclosed string literal");
    }

    if (errors.length > 0) {
        throw new Error(errors.join(', '));
    }
}

function checkJavaSyntax(code) {
    const errors = [];
    
    // Check for matching braces
    if ((code.match(/\{/g) || []).length !== (code.match(/\}/g) || []).length) {
        errors.push("Mismatched braces");
    }

    // Check for matching parentheses
    if ((code.match(/\(/g) || []).length !== (code.match(/\)/g) || []).length) {
        errors.push("Mismatched parentheses");
    }

    // Check for semicolons
    const lines = code.split('\n').filter(line => 
        line.trim() && 
        !line.trim().startsWith('//') && 
        !line.trim().startsWith('*') &&
        !line.trim().endsWith('{') &&
        !line.trim().endsWith('}')
    );
    
    if (lines.some(line => !line.trim().endsWith(';'))) {
        errors.push("Missing semicolons");
    }

    // Check for class definition
    if (!code.includes('class')) {
        errors.push("No class definition found");
    }

    // Check for main method
    if (!code.includes('public static void main')) {
        errors.push("No main method found");
    }

    // Check for string literal termination
    const unclosedQuotes = (code.match(/"/g) || []).length % 2;
    if (unclosedQuotes !== 0) {
        errors.push("Unclosed string literal");
    }

    if (errors.length > 0) {
        throw new Error(errors.join(', '));
    }
}

function checkPythonSyntax(code) {
    const errors = [];
    
    // Check for matching parentheses
    if ((code.match(/\(/g) || []).length !== (code.match(/\)/g) || []).length) {
        errors.push("Mismatched parentheses");
    }

    // Check for matching square brackets
    if ((code.match(/\[/g) || []).length !== (code.match(/\]/g) || []).length) {
        errors.push("Mismatched square brackets");
    }

    // Check for colons in control structures
    const controlStructures = ['if', 'for', 'while', 'def', 'class', 'try', 'except', 'finally'];
    const lines = code.split('\n');
    
    lines.forEach((line, index) => {
        const trimmedLine = line.trim();
        if (controlStructures.some(struct => trimmedLine.startsWith(struct))) {
            if (!trimmedLine.includes(':')) {
                errors.push(`Missing colon after control structure at line ${index + 1}`);
            }
        }
    });

    // Check for basic indentation
    let previousIndentation = 0;
    lines.forEach((line, index) => {
        if (line.trim() === '') return;
        
        const currentIndentation = line.search(/\S/);
        if (currentIndentation === -1) return;
        
        if (currentIndentation > previousIndentation + 4) {
            errors.push(`Incorrect indentation at line ${index + 1}`);
        }
        previousIndentation = currentIndentation;
    });

    // Check for string literal termination
    const singleQuotes = (code.match(/'/g) || []).length % 2;
    const doubleQuotes = (code.match(/"/g) || []).length % 2;
    
    if (singleQuotes !== 0) {
        errors.push("Unclosed single quote string");
    }
    if (doubleQuotes !== 0) {
        errors.push("Unclosed double quote string");
    }

    if (errors.length > 0) {
        throw new Error(errors.join(', '));
    }
}

// Add event listener for textarea to enable checking with Ctrl+Enter
document.getElementById('code').addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.key === 'Enter') {
        checkSyntax();
    }
});

// Add event listener for language change to update placeholder
document.getElementById('language').addEventListener('change', function(e) {
    const textarea = document.getElementById('code');
    const language = e.target.value;
    
    const placeholders = {
        'c': '#include <stdio.h>\n\nint main() {\n    // Your C code here\n    return 0;\n}',
        'cpp': '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Your C++ code here\n    return 0;\n}',
        'java': 'public class Main {\n    public static void main(String[] args) {\n        // Your Java code here\n    }\n}',
        'python': '# Your Python code here\ndef main():\n    pass\n\nif __name__ == "__main__":\n    main()'
    };
    
    textarea.placeholder = placeholders[language] || 'Enter your code here...';
});