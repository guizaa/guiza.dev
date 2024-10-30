
// script.js

const outputElement = document.getElementById('output');
const inputElement = document.getElementById('input');

// Command definitions
const commands = {
    help: () => 'Available commands:\n\n' + Object.keys(commands).join('\n'),
	ls: () => '. .. secret',
	cat: (file) => {
		return (file === "secret") ? `
 /\\_/\\
( o o )
 > ^ <` : 'Usage: cat <file>';
	},
	github: () => {
		window.open("https://github.com/guizaa", "_blank");
		return "Redirecting to Github...";
	},
	linkedin: () => {
		window.open("https://www.linkedin.com/in/santiago-uribe-guiza-62b501235/", "_blank");
		return "Redirecting to LinkedIn...";
	},
	resume: () => {
		window.open("Santiago-Uribe-Guiza-Resume.pdf", "_blank");
		return "Opening resume...";
	}
};

// Function to handle command execution
function handleCommand(input) {
    const [command, ...args] = input.trim().split(/\s+/);
    
    if (commands[command]) {
        return commands[command](...args);
    } else {
        return `Command not found: ${command}. Type 'help' for available commands.`;
    }
}

// Display output in the terminal
function appendOutput(text) {
	let newLine = $('<div></div>');
	newLine.text(text);
	newLine.insertBefore("#prompt-line");
    outputElement.scrollTop = outputElement.scrollHeight; // Scroll to bottom
}

// Handle the Enter key press for command input
inputElement.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        const input = inputElement.value.trim();

        // Append user command to output
        appendOutput(`guest@guiza.dev:~$ ${input}`);
        if (input === '') return;
        
        // Execute and append the command's output
        const output = handleCommand(input);
        if (output) appendOutput(output);

        // Clear the input field for the next command
        inputElement.value = '';
    }
});

