document.addEventListener('DOMContentLoaded', () => {
    // Add typing effect to all elements with class 'typing-text'
    const typingElements = document.querySelectorAll('.typing-text');
    
    typingElements.forEach(element => {
        const text = element.innerHTML;
        element.innerHTML = '';
        let charIndex = 0;
        
        function typeChar() {
            if (charIndex < text.length) {
                element.innerHTML += text.charAt(charIndex);
                charIndex++;
                setTimeout(typeChar, Math.random() * 100 + 50); // Random delay between 50-150ms
            }
        }
        
        typeChar();
    });

    // Add random glitch effect to CRT overlay
    setInterval(() => {
        const crt = document.querySelector('.crt');
        crt.style.transform = `skew(${Math.random() * 0.5}deg)`;
        setTimeout(() => {
            crt.style.transform = 'skew(0deg)';
        }, 100);
    }, 5000);

    // Add terminal startup sequence
    const terminal = document.querySelector('.terminal-content');
    terminal.style.opacity = '0';
    
    setTimeout(() => {
        terminal.style.transition = 'opacity 1s ease-in';
        terminal.style.opacity = '1';
        
        // Add a power-on animation
        const powerOnOverlay = document.createElement('div');
        powerOnOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: white;
            z-index: 999;
            pointer-events: none;
            opacity: 0.8;
            transition: opacity 1s ease-out;
        `;
        document.body.appendChild(powerOnOverlay);
        
        setTimeout(() => {
            powerOnOverlay.style.opacity = '0';
            setTimeout(() => powerOnOverlay.remove(), 1000);
        }, 100);
    }, 500);

    // Terminal Input Handling
    const terminalInput = document.querySelector('.terminal-input');
    const terminalContent = document.querySelector('.terminal-content');

    if (terminalInput) {
        terminalInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const command = terminalInput.value.trim();
                if (command) {
                    // Create command entry container
                    const commandEntry = document.createElement('div');
                    commandEntry.className = 'command-entry';
                    
                    // Add timestamp
                    const timestamp = new Date().toLocaleTimeString();
                    
                    // Create command line with timestamp
                    const newCommand = document.createElement('div');
                    newCommand.className = 'command-line typing';
                    newCommand.innerHTML = `<span class="timestamp">[${timestamp}]</span><span class="prompt">visitor@portfolio:~$</span> <span class="command">${command}</span>`;
                    commandEntry.appendChild(newCommand);
                    
                    // Create output element
                    const output = document.createElement('div');
                    output.className = 'command-output';
                    
                    // Handle different commands
                    switch(command.toLowerCase()) {
                        case 'help':
                        case 'man':
                            output.innerHTML = `
                                <span class="help-title">PORTFOLIO TERMINAL HELP</span>
                                <br><br>Available commands:
                                <br>
                                <br>Navigation:
                                <br>  cd skills         Navigate to Skills section
                                <br>  cd projects       Navigate to Projects section
                                <br>
                                <br>Information:
                                <br>  ls skills/        List all skills
                                <br>  ls projects/      List all projects
                                <br>
                                <br>System:
                                <br>  clear            Clear terminal screen
                                <br>  help             Show this help message
                                <br>  man              Show this help message
                                <br>  whoami           Show current user
                                <br>  pwd              Show current location
                                <br>  date             Show current date
                            `;
                            break;
                            break;
                        case 'clear':
                            // Remove all command history
                            const terminalHistory = document.querySelector('.terminal-history');
                            terminalHistory.innerHTML = '';
                            return;

                        case 'cd skills':
                        case 'cd projects':
                            const sectionId = command.split(' ')[1];
                            const section = document.getElementById(sectionId);
                            const offset = window.innerHeight / 2;
                            const sectionTop = section.getBoundingClientRect().top + window.pageYOffset;
                            window.scrollTo({
                                top: sectionTop - offset + (section.offsetHeight / 4),
                                behavior: 'smooth'
                            });
                            output.textContent = `Changed directory to ~/${sectionId}`;
                            break;
                        
                        case 'ls skills/':
                            const skills = Array.from(document.querySelectorAll('.skill-list li')).map(skill => skill.textContent);
                            output.innerHTML = `total ${skills.length}<br>`;
                            output.innerHTML += skills.map(skill => 
                                `drwxr-xr-x  2 visitor  staff  ${skill.length}B May 16 2025 ${skill}`
                            ).join('<br>');
                            break;

                        case 'ls projects/':
                            const projects = Array.from(document.querySelectorAll('.project-card h3')).map(project => project.textContent);
                            output.innerHTML = `total ${projects.length}<br>`;
                            output.innerHTML += projects.map(project => 
                                `drwxr-xr-x  2 visitor  staff  ${project.length}B May 16 2025 ${project}`
                            ).join('<br>');
                            break;


                        case 'whoami':
                            output.textContent = 'visitor';
                            break;
                        case 'pwd':
                            const currentSection = Array.from(document.querySelectorAll('section')).find(section => {
                                const rect = section.getBoundingClientRect();
                                return rect.top <= window.innerHeight/2 && rect.bottom >= window.innerHeight/2;
                            });
                            output.textContent = currentSection ? `/home/visitor/${currentSection.id}` : '/home/visitor';
                            break;
                        case 'date':
                            output.textContent = new Date().toLocaleString();
                            break;
                        default:
                            if (command.startsWith('cd ') || command.startsWith('cat ') || command.startsWith('ls ')) {
                                output.textContent = `No such file or directory: ${command.split(' ')[1]}`;
                            } else {
                                output.textContent = `Command not found: ${command}. Type 'help' or 'man' for available commands.`;
                            }
                    }
                    
                    // Add output to command entry
                    commandEntry.appendChild(output);
                    
                    // Insert command entry into terminal history
                    const terminalHistory = document.querySelector('.terminal-history');
                    terminalHistory.appendChild(commandEntry);
                    
                    // Scroll to the bottom of the history
                    terminalHistory.scrollTop = terminalHistory.scrollHeight;
                    
                    // Clear input and scroll to bottom
                    terminalInput.value = '';
                    terminalPrompt.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });

        // Update terminal focus behavior
        const interactiveTerminal = document.querySelector('.interactive-terminal');
        const mainContent = document.querySelector('.terminal-content');
        
        // Only focus terminal when clicking specifically in the interactive terminal area
        interactiveTerminal.addEventListener('click', (e) => {
            if (e.target.closest('.interactive-terminal')) {
                terminalInput.focus();
            }
        });

        // Prevent auto-scrolling to the input when it gains focus
        terminalInput.addEventListener('focus', (e) => {
            e.preventDefault();
            // Store the current scroll position
            const scrollPos = window.scrollY;
            // Set it back after the focus
            setTimeout(() => window.scrollTo(0, scrollPos), 0);
        });

        // When selecting text in the main content, prevent terminal focus
        mainContent.addEventListener('mousedown', (e) => {
            if (!e.target.closest('.interactive-terminal')) {
                e.stopPropagation();
            }
        });

        // Ensure input is focused when clicking anywhere in the terminal
        document.querySelector('.terminal').addEventListener('click', () => {
            terminalInput.focus();
        });
    }

    // Terminal window controls
    const terminalWindow = document.querySelector('.interactive-terminal');
    const closeBtn = terminalWindow.querySelector('.terminal-button.close');
    const minimizeBtn = terminalWindow.querySelector('.terminal-button.minimize');
    const maximizeBtn = terminalWindow.querySelector('.terminal-button.maximize');
    const terminalWindowContent = terminalWindow.querySelector('.terminal-window-content');
    
    let isMinimized = false;
    let isMaximized = false;
    const originalStyles = {
        width: terminalWindow.style.width,
        height: terminalWindowContent.style.height,
        bottom: terminalWindow.style.bottom,
        left: terminalWindow.style.left,
        transform: terminalWindow.style.transform
    };

    closeBtn.addEventListener('click', () => {
        terminalWindow.style.animation = 'fadeOut 0.3s forwards';
        setTimeout(() => {
            terminalWindow.style.display = 'none';
        }, 300);
    });

    minimizeBtn.addEventListener('click', () => {
        if (!isMinimized) {
            terminalWindowContent.style.height = '0';
            terminalWindowContent.style.padding = '0';
            terminalWindow.classList.add('minimized');
        } else {
            terminalWindowContent.style.height = isMaximized ? '90vh' : '300px';
            terminalWindowContent.style.padding = '20px';
            terminalWindow.classList.remove('minimized');
        }
        isMinimized = !isMinimized;
    });

    maximizeBtn.addEventListener('click', () => {
        if (!isMaximized) {
            terminalWindow.style.width = '100%';
            terminalWindow.style.height = '100vh';
            terminalWindow.style.bottom = '0';
            terminalWindow.style.left = '0';
            terminalWindow.style.transform = 'none';
            terminalWindowContent.style.height = '90vh';
            terminalWindow.classList.add('maximized');
        } else {
            terminalWindow.style.width = 'calc(100% - 40px)';
            terminalWindow.style.height = 'auto';
            terminalWindow.style.bottom = '20px';
            terminalWindow.style.left = '50%';
            terminalWindow.style.transform = 'translateX(-50%)';
            terminalWindowContent.style.height = '300px';
            terminalWindow.classList.remove('maximized');
        }
        isMaximized = !isMaximized;
    });

    const minimizeButtons = document.querySelectorAll('.terminal-button.minimize');
    minimizeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const terminal = button.closest('.terminal, .interactive-terminal');
            if (terminal) {
                terminal.classList.toggle('minimized');
            }
        });
    });
});