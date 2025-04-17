# **Reverse Instruction Set (RIS) Documentation**

## **Overview**

Reverse Instruction Set (RIS) is a low-level, assembly-like programming language designed for building operating systems. RIS combines simplicity and extensibility, making it suitable for managing hardware, memory, processes, and file systems. It includes robust support for **system interrupts**, **memory management**, **process handling**, and **file operations**.

### **Core Design Principles**
1. **Efficiency**: Optimized for fast execution in resource-constrained environments.
2. **Clarity**: Easy-to-read syntax to minimize errors during OS development.
3. **Extensibility**: Flexible interrupt and process management for future feature integration.
4. **Portability**: Designed for cross-platform compatibility with standard development tools.

## **Instruction Set**

### **1. Basic Instructions**

#### **PRN**: Print Output  
Prints data to the standard output (e.g., terminal).  
```assembly
PRN message          ; Print a direct message
PRN $variable        ; Print the content of a variable
```

#### **VAR**: Variable Operations  
Handles runtime variables for dynamic data storage and manipulation.  
```assembly
VAR name >> value    ; Set variable with a value
VAR name <<          ; Read user input into the variable
```

#### **HLT**: Halt Execution  
Terminates the current program or process.  
```assembly
HLT                  ; Stop execution
```

### **2. Memory Management**

Memory management instructions allow interaction with a byte-addressable memory space.  

#### Instructions:
- `MEM READ address`: Reads the value stored at a specific memory address.
- `MEM WRITE address value`: Writes a value to a memory address.
- `MEM SIZE`: Displays the total size of the available memory.

#### Example:
```assembly
MEM WRITE 0 42        ; Write value 42 to memory address 0
MEM READ 0            ; Read value from memory address 0
MEM SIZE              ; Print total memory size
```

### **3. Process Management**

RIS supports process creation, listing, and termination.

#### Instructions:
- `PROC CREATE name`: Creates a new process with a specified name.
- `PROC LIST`: Lists all active processes along with their Process IDs (PIDs).
- `PROC KILL pid`: Terminates a process by its PID.

#### Example:
```assembly
PROC CREATE worker    ; Create a process named 'worker'
PROC LIST             ; List all active processes
PROC KILL 1           ; Terminate process with PID 1
```

### **4. File System Operations**

RIS facilitates file operations, such as reading, writing, and deleting files.

#### Instructions:
- `FILE READ filename`: Reads and outputs the contents of a file.
- `FILE WRITE filename content`: Creates or overwrites a file with the given content.
- `FILE DELETE filename`: Deletes the specified file.

#### Example:
```assembly
FILE WRITE config.txt "System Configurations"
FILE READ config.txt
FILE DELETE config.txt
```

### **5. System Operations**

Commands for directory and system state management.

#### Instructions:
- `SYS DIR`: Lists the contents of the current directory.
- `SYS CD path`: Changes the working directory to the specified path.
- `SYS SLEEP ms`: Pauses execution for the specified time in milliseconds.

#### Example:
```assembly
SYS DIR              ; List files in the current directory
SYS CD /home/user    ; Change directory to /home/user
SYS SLEEP 1000       ; Sleep for 1 second
```

### **6. Interrupt Handling**

Interrupts provide access to low-level system functionalities.

#### Predefined Interrupts:
- `INT 0`: Queries system status, such as uptime and CPU usage.
- `INT 1`: Dumps the current memory state for debugging.

#### Example:
```assembly
INT 0                ; Output system status
INT 1                ; Perform a memory dump
```

## **Advanced Features**

### **Extensibility**
RIS is designed for extensibility, allowing developers to define custom interrupts or process management logic.  

#### **Adding Custom Interrupts**
Interrupt handlers can be modified in the RIS interpreter source code for specialized tasks, like hardware communication or custom monitoring tools.

## **Best Practices for OS Development**

### **Initialization**
1. Start by defining essential variables and processes.
2. Allocate memory blocks for critical resources.

### **Error Handling**
1. Check for invalid memory access (e.g., reading from unallocated addresses).
2. Verify process IDs before attempting to terminate or list processes.
3. Ensure file operations handle missing or locked files gracefully.

### **Memory Cleanup**
Release memory and terminate processes that are no longer required to prevent resource leaks.

## **Example Programs**

### **1. Bootloader**
Initializes the operating system and displays system information.  
```assembly
VAR BOOT_MSG >> "Booting RIS OS..."
PRN $BOOT_MSG
MEM SIZE
PROC CREATE init
SYS DIR
INT 0
HLT
```

### **2. Interactive Shell**
Simulates a command-line interface.  
```assembly
VAR PROMPT >> "RIS> "
:loop
PRN $PROMPT
VAR cmd <<
PROC CREATE shell
SYS DIR
GOTO loop
HLT
```

### **3. Process Monitor**
Demonstrates process creation and management.  
```assembly
PROC CREATE main
PROC CREATE worker1
PROC LIST
PROC KILL 1
PROC LIST
HLT
```

### **4. File System Explorer**
Shows how to manipulate files.  
```assembly
FILE WRITE log.txt "System Log Initialized"
FILE READ log.txt
FILE DELETE log.txt
HLT
```

## **Development Environment**

### **Recommended Tools**
1. **Visual Studio 2022**
   - Create a C++ project and set the language version to C++17 or later.
2. **VSCode**
   - Install the C/C++ extension and configure build tasks for C++17.
3. **GCC/Clang**
   - Compile using: `g++ -std=c++17 ris.cpp -o ris`.

### **Running Programs**
Save RIS programs with a `.ris` extension and execute them using the RIS interpreter:  
```bash
./ris program.ris
```

## **Error Handling Mechanisms**

The RIS interpreter includes built-in checks for:
- Invalid memory or process operations.
- Missing files or invalid file paths.
- Incorrect command syntax.

## **Future Expansion**

The RIS system can be extended with:
1. **Virtual Memory**: Implement paging and swapping.
2. **Networking**: Support TCP/IP stack and communication protocols.
3. **Device Drivers**: Interface with hardware peripherals.
4. **Security**: Add process isolation and user permissions.

---
