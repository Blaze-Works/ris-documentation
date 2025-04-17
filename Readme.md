# Reverse Instruction Set (RIS) Documentation

## Overview
RIS is now an extended assembly-like language designed for OS development with support for memory management, process control, file operations, and system interrupts.

## Instruction Set

### Basic Instructions
1. `PRN` - Print output
   ```
   PRN message     ; Print direct message
   PRN $variable   ; Print variable content
   ```

2. `VAR` - Variable operations
   ```
   VAR name >> value   ; Set variable
   VAR name <<         ; Get input from user
   ```

3. `HLT` - Stop execution
   ```
   HLT               ; End program
   ```

### Memory Management
1. `MEM` - Memory operations
   ```
   MEM READ address    ; Read from memory address
   MEM WRITE address value  ; Write to memory address
   MEM SIZE            ; Display memory size
   ```

### Process Management
1. `PROC` - Process operations
   ```
   PROC CREATE name    ; Create new process
   PROC LIST          ; List all processes
   PROC KILL pid      ; Terminate process
   ```

### File System Operations
1. `FILE` - File operations
   ```
   FILE READ filename    ; Read file content
   FILE WRITE filename content  ; Write to file
   FILE DELETE filename  ; Delete file
   ```

### System Operations
1. `SYS` - System commands
   ```
   SYS DIR             ; List directory contents
   SYS CD path         ; Change directory
   SYS SLEEP ms        ; Sleep for milliseconds
   ```

### Interrupt Handling
1. `INT` - System interrupts
   ```
   INT 0               ; System status
   INT 1               ; Memory dump
   ```

## OS Development Examples

### Simple Bootloader
```
VAR BOOT_MSG >> Initializing RIS OS...
PRN $BOOT_MSG
MEM SIZE
PROC CREATE init
SYS DIR
INT 0
HLT
```

### Basic Shell
```
VAR PROMPT >> RIS>
:loop
PRN $PROMPT
VAR cmd <<
PROC CREATE shell
SYS DIR
INT 0
GOTO loop
HLT
```

### Memory Manager
```
MEM WRITE 0 255
MEM WRITE 1 128
MEM READ 0
MEM READ 1
INT 1
HLT
```

### Process Manager
```
PROC CREATE main
PROC CREATE worker1
PROC CREATE worker2
PROC LIST
PROC KILL 2
PROC LIST
HLT
```

## Features and Capabilities

### Memory Management
- 1MB default memory space
- Byte-addressable memory
- Read/write operations
- Memory size queries

### Process Management
- Process creation and termination
- Process listing
- PID tracking
- Process status monitoring

### File System Operations
- File reading and writing
- File deletion
- Directory navigation
- Directory listing

### System Operations
- Directory management
- System sleep
- Path navigation
- System status queries

### Interrupt Handling
- System status interrupts
- Memory dump capabilities
- Extensible interrupt system

## Best Practices
1. Initialize system resources at startup
2. Use process management for parallel operations
3. Implement proper error handling
4. Use interrupts for system monitoring
5. Maintain memory cleanup
6. Document all custom interrupts
## Error Handling
The interpreter includes error checking for:
- Invalid memory access
- Process management errors
- File operation failures
- System command errors
- Invalid interrupt numbers

## Future Expansion Possibilities
1. Virtual memory management
2. Inter-process communication
3. Device drivers
4. Network stack
5. Security features

## Development Environment Setup
### Visual Studio 2022
1. Create new C++ project
2. Set C++17 or later
3. Include required headers
4. Build solution

### VSCode
1. Install C/C++ extension
2. Configure c_cpp_properties.json for C++17
3. Set up build tasks
4. Configure debugging

## Compilation
```
g++ -std=c++17 ris.cpp -o ris
```

## Running
```
./ris program.ris
```