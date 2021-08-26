Instruction Set for the Intel 8086/88 Microprocessor
====================================================

This guide is adapted from a document located at the URL:

	https://en.wikipedia.org/wiki/X86_instruction_set


Instructions
------------

| Mnemonic  | Meaning                               | Opcodes               | Notes                                            |
| --------  | -------                               | -------               | -----                                            |
|           |                                       |                       |                                                  |
| AAA       | ASCII adjust AL after addition        | 0x37                  | Used with unpacked binary-coded decimal.         |
|           |                                       |                       |                                                  |
| AAD       | ASCII adjust AX before division       | 0xD5                  | Operand is radix.  Only 0x0A (10) is documented. |
|           |                                       |                       |                                                  |
|           |                                       |                       |                                                  |
|           |                                       |                       |                                                  |
|           |                                       |                       |                                                  |
|           |                                       |                       |                                                  |
|           |                                       |                       |                                                  |
| AAM       | ASCII adjust AX after multiplication  | 0xD4                  | See notes for AAD.                               |
|           |                                       |                       |                                                  |
| AAS       | ASCII adjust AL after subtraction     | 0x3F                  | [None.]                                          |
|           |                                       |                       |                                                  |
| ADC       | Add with carry                        | 0x10...0x15,          | Destination = destination + source + carry_flag. |
|           |                                       | 0x80...0x81/2,        |                                                  |
|           |                                       | 0x82...0x83/2 [1]     |                                                  |
|           |                                       |                       |                                                  |
| ADD       | Add                                   | 0x00...0x05,          | (1) r/m += r/imm;                                |
|           |                                       | 0x80/0...0x81/0,      | (2) r += m/imm;                                  |
|           |                                       | 0x82/0...0x83/0 [1]   |                                                  |
|           |                                       |                       |                                                  |
| AND       | Logical AND                           | 0x20...0x25,          | (1) r/m &= r/imm;                                |
|           |                                       | 0x80...0x81/4,        | (2) r &= m/imm;                                  |
|           |                                       | 0x82...0x83/4 [1]     |                                                  |
|           |                                       |                       |                                                  |
| CALL      | Call procedure                        | 0x9A,                 | Push eip; eip points to the instruction          |
|           |                                       | 0xE8,                 | directly after the call.                         |
|           |                                       | 0xFF/2,               |                                                  |
|           |                                       | 0xFF/3                |                                                  |
|           |                                       |                       |                                                  |
| CBW       | Convert byte to word                  | 0x98                  | [None.]                                          |
|           |                                       |                       |                                                  |
| CLC       | Clear carry flag                      | 0xF8                  | CF = 0;                                          |
|           |                                       |                       |                                                  |
| CLD       | Clear direction flag                  | 0xFC                  | DF = 0;                                          |
|           |                                       |                       |                                                  |
| CLI       | Clear interrupt flag                  | 0xFA                  | IF = 0;                                          |
|           |                                       |                       |                                                  |
| CMC       | Complement carry flag                 | 0xF5                  | [None.]                                          |
|           |                                       |                       |                                                  |
| CMP       | Compare operands                      | 0x38...0x3D,          | [None.]                                          |
|           |                                       | 0x80...0x81/7,        |                                                  |
|           |                                       | 0x82...0x83/7 [1]     |                                                  |
|           |                                       |                       |                                                  |
| CMPSB     | Compare bytes in memory               | 0xA6                  | [None.]                                          |
|           |                                       |                       |                                                  |
| CMPSW     | Compare words                         | 0xA7                  | [None.]                                          |
|           |                                       |                       |                                                  |
| CWD       | Convert word to doubleword            | 0x99                  | [None.]                                          |
|           |                                       |                       |                                                  |
| DAA       | Decimal adjust AL after addition      | 0x27                  | Used with packed binary-coded decimal.           |
|           |                                       |                       |                                                  |
| DAS       | Decimal adjust AL after subtraction   | 0x2F                  | [None.]                                          |
|           |                                       |                       |                                                  |
| DEC       | Decrement by 1                        | 0x48...0x4F,          | [None.]                                          |
|           |                                       | 0xFE/1,               |                                                  |
|           |                                       | 0xFF/1                |                                                  |
|           |                                       |                       |                                                  |
| DIV       | Unsigned divide                       | 0xF7/6,               | (1) AX = DX:AX / r/m; resulting DX = remainder   |
|           |                                       | 0xF6/6                | (2) AL = AX / r/m; resulting AH = remainder      |
|           |                                       |                       |                                                  |
| ESC       | Used with floating-point unit         | 0xD8...0xDF           | [None.]                                          |
|           |                                       |                       |                                                  |
| HLT       | Enter halt state                      | 0xF4                  | [None.]                                          |
|           |                                       |                       |                                                  |
| IDIV      | Signed divide                         | 0xF7/7,               | (1) AX = DX:AX / r/m; resulting DX = remainder   |
|           |                                       | 0xF6/7                | (2) AL = AX / r/m; resulting AH = remainder      |
|           |                                       |                       |                                                  |
| IMUL      | Signed multiply                       | 0x69, [1]             | (1) DX:AX = AX * r/m;                            |
|           |                                       | 0x6B, [1]             | (2) AX = AL * r/m                                |
|           |                                       | 0xF7/5,               |                                                  |
|           |                                       | 0xF6/5,               |                                                  |
|           |                                       | 0x0FAF [2]            |                                                  |
|           |                                       |                       |                                                  |
| IN        | Input from port                       | 0xE4,                 | (1) AL = port[imm];                              |
|           |                                       | 0xE5,                 | (2) AL = port[DX];                               |
|           |                                       | 0xEC,                 | (3) AX = port[imm];                              |
|           |                                       | 0xED                  | (4) AX = port[DX];                               |
|           |                                       |                       |                                                  |
| INC       | Increment by 1                        | 0x40...0x47,          | [None.]                                          |
|           |                                       | 0xFE/0,               |                                                  |
|           |                                       | 0xFF/0                |                                                  |
|           |                                       |                       |                                                  |
| INT       | Call to interrupt                     | 0xCC, 0xCD            | [None.]                                          |
|           |                                       |                       |                                                  |
| INTO      | Call to interrupt if overflow         | 0xCE                  | [None.]                                          |
|           |                                       |                       |                                                  |
| IRET      | Return from interrupt                 | 0xCF                  | [None.]                                          |
|           |                                       |                       |                                                  |
| J[...]    | Jump if condition                     | 0x70...0x7F,          | (JA, JAE, JB, JBE, JC, JE, JG, JGE,              |
|           |                                       | 0x0F80...0x0F8F [2]   | JL, JLE, JNA, JNAE, JNB, JNBE, JNC, JNE,         |
|           |                                       |                       | JNG, JNGE, JNL, JNLE, JNO, JNP, JNS, JNZ,        |
|           |                                       |                       | JO, JP, JPE, JPO, JS, JZ)                        |
|           |                                       |                       |                                                  |
| JCXZ      | Jump if CX is zero                    | 0xE3                  | [None.]                                          |
|           |                                       |                       |                                                  |
| JMP       | Jump                                  | 0xE9...0xEB,          | [None.]                                          |
|           |                                       | 0xFF/4,               |                                                  |
|           |                                       | 0xFF/5                |                                                  |
|           |                                       |                       |                                                  |
| LAHF      | Load FLAGS into AH register           | 0x9F                  | [None.]                                          |
|           |                                       |                       |                                                  |
| LDS       | Load pointer using DS                 | 0xC5                  | [None.]                                          |
|           |                                       |                       |                                                  |
| LEA       | Load Effective Address                | 0x8D                  | [None.]                                          |
|           |                                       |                       |                                                  |
| LES       | Load ES with pointer                  | 0xC4                  | [None.]                                          |
|           |                                       |                       |                                                  |
| LOCK      | Assert BUS LOCK# signal               | 0xF0                  | [None.]                                          |
|           | (for multiprocessing)                 |                       |                                                  |
|           |                                       |                       |                                                  |
| LODSB     | Load string byte                      | 0xAC                  | If DF is 0, AL = *SI++,                          |
|           |                                       |                       | else AL = *SI--.                                 |
|           |                                       |                       |                                                  |
| LODSW     | Load string word                      | 0xAD                  | If DF is 0, AX = *SI++,                          |
|           |                                       |                       | else AX = *SI--.                                 |
|           |                                       |                       |                                                  |
| LOOP[...] | Loop control                          | 0xE0...0xE2           | (LOOPE, LOOPNE, LOOPNZ, LOOPZ)                   |
|           |                                       |                       | if (x && --CX) goto lbl;                         |
|           |                                       |                       |                                                  |
| MOV       | Move                                  | 0xA0...0xA3           | Copies data from one location to another.        |
|           |                                       |                       | (1) r/m = r;                                     |
|           |                                       |                       | (2) r = r/m;                                     |
|           |                                       |                       |                                                  |
| MOVSB     | Move byte from string to string       | 0xA4                  | If DF is 0, *(byte*)DI++ = *(byte*)SI++,         |
|           |                                       |                       | else *(byte*)DI-- = *(byte*)SI--;                |
|           |                                       |                       |                                                  |
| MOVSW     | Move word from string to string       | 0xA5                  | If DF is 0, *(word*)DI++ = *(word*)SI++,         |
|           |                                       |                       | else *(word*)DI-- = *(word*)SI--;                |
|           |                                       |                       |                                                  |
| MUL       | Unsigned multiply                     | 0xF7/4, 0xF6/4        | (1) DX:AX = AX * r/m; (2) AX = AL * r/m;         |
|           |                                       |                       |                                                  |
| NEG       | Two's complement negation             | 0xF6/3...0xF7/3       | r/m *= -1;                                       |
|           |                                       |                       |                                                  |
| NOP       | No operation                          | 0x90                  | Opcode equivalent to XCHG EAX, EAX.              |
|           |                                       |                       |                                                  |
| NOT       | Negate the operand, logical NOT       | 0xF6/2...0xF7/2       | r/m ^= -1;                                       |
|           |                                       |                       |                                                  |
| OR        | Logical OR                            | 0x08...0x0D,          | (1) r/m |= r/imm; (2) r |= m/imm;                |
|           |                                       | 0x80...0x81/1,        |                                                  |
|           |                                       | 0x82...0x83/1 [1]     |                                                  |
|           |                                       |                       |                                                  |
| OUT       | Output to port                        | 0xE6, 0xE7,           | (1) port[imm] = AL;                              |
|           |                                       | 0xEE, 0xEF            | (2) port[DX] = AL;                               |
|           |                                       |                       | (3) port[imm] = AX;                              |
|           |                                       |                       | (4) port[DX] = AX;                               |
|           |                                       |                       |                                                  |
| POP       | Pop data from stack                   | 0x07,                 | r/m = *SP++; POP CS (opcode 0x0F)                |
|           |                                       | 0x0F [3],             | works only on 8086/8088.                         |
|           |                                       | 0x17,                 | Later CPUs use 0x0F as a prefix                  |
|           |                                       | 0x1F,                 | for newer instructions.                          |
|           |                                       | 0x58...0x5F,          |                                                  |
|           |                                       | 0x8F/0                |                                                  |
|           |                                       |                       |                                                  |
| POPF      | Pop FLAGS register from stack         | 0x9D                  | FLAGS = *SP++;                                   |
|           |                                       |                       |                                                  |
| PUSH      | Push data onto stack                  | 0x06,                 | *--SP = r/m;                                     |
|           |                                       | 0x0E,                 |                                                  |
|           |                                       | 0x16,                 |                                                  |
|           |                                       | 0x1E,                 |                                                  |
|           |                                       | 0x50...0x57,          |                                                  |
|           |                                       | 0x68, 0x6A [1],       |                                                  |
|           |                                       | 0xFF/6                |                                                  |
|           |                                       |                       |                                                  |
| PUSHF     | Push FLAGS onto stack                 | 0x9C                  | *--SP = FLAGS;                                   |
|           |                                       |                       |                                                  |
| RCL       | Rotate left (with carry)              | 0xC0...0xC1/2 [1],    | [None.]                                          |
|           |                                       | 0xD0...0xD3/2         |                                                  |
|           |                                       |                       |                                                  |
| RCR       | Rotate right (with carry)             | 0xC0...0xC1/3 [1],    | [None.]                                          |
|           |                                       | 0xD0...0xD3/3         |                                                  |
|           |                                       |                       |                                                  |
| REPxx     | Repeat                                | 0xF2, 0xF3            | MOVS/STOS/CMPS/LODS/SCAS                         |
|           |                                       |                       | (REP, REPE, REPNE, REPNZ, REPZ)                  |
|           |                                       |                       |                                                  |
| RETx      | Return from procedure                 | [See notes.]          | Translated to RETN or RETF depending             |
|           |                                       |                       | on memory model of the target system.            |
|           |                                       |                       |                                                  |
|           |                                       |                       |                                                  |
| RETN      | Return from near procedure            | 0xC2, 0xC3            | [None.]                                          |
|           |                                       |                       |                                                  |
| RETF      | Return from far procedure             | 0xCA, 0xCB            | [None.]                                          |
|           |                                       |                       |                                                  |
| ROL       | Rotate left                           | 0xC0...0xC1/0 [1],    | [None.]                                          |
|           |                                       | 0xD0...0xD3/0         |                                                  |
|           |                                       |                       |                                                  |
| ROR       | Rotate right                          | 0xC0...0xC1/1 [1],    | [None.]                                          |
|           |                                       | 0xD0...0xD3/1         |                                                  |
|           |                                       |                       |                                                  |
| SAHF      | Store AH into FLAGS                   | 0x9E                  |                                                  |
|           |                                       |                       |                                                  |
| SAL       | Shift Arithmetically left (signed)    | 0xC0...0xC1/4 [1],    | (1) r/m <<= 1; (2) r/m <<= CL;                   |
|           |                                       | 0xD0...0xD3/4         |                                                  |
|           |                                       |                       |                                                  |
| SAR       | Shift Arithmetically right (signed)   | 0xC0...0xC1/7 [1],    | (1) (signed) r/m >>= 1; (2) (signed) r/m >>= CL; |
|           |                                       | 0xD0...0xD3/7         |                                                  |
|           |                                       |                       |                                                  |
| SBB       | Subtraction with borrow               | 0x18...0x1D,          | Alternative 1-byte encoding of SBB AL,           |
|           |                                       | 0x80...0x81/3,        | AL available via undocumented SALC instruction.  |
|           |                                       | 0x82...0x83/3 [1]     |                                                  |
|           |                                       |                       |                                                  |
| SCASB     | Compare byte string                   | 0xAE                  | [None.]                                          |
|           |                                       |                       |                                                  |
| SCASW     | Compare word string                   | 0xAF                  | [None.]                                          |
|           |                                       |                       |                                                  |
| SHL       | Shift left (unsigned)                 | 0xC0...0xC1/4 [1],    | [None.]                                          |
|           |                                       | 0xD0...0xD3/4         |                                                  |
|           |                                       |                       |                                                  |
| SHR       | Shift right (unsigned)                | 0xC0...0xC1/5 [1],    | [None.]                                          |
|           |                                       | 0xD0...0xD3/5         |                                                  |
|           |                                       |                       |                                                  |
| STC       | Set carry flag                        | 0xF9                  | CF = 1;                                          |
|           |                                       |                       |                                                  |
| STD       | Set direction flag                    | 0xFD                  | DF = 1;                                          |
|           |                                       |                       |                                                  |
| STI       | Set interrupt flag                    | 0xFB                  | IF = 1;                                          |
|           |                                       |                       |                                                  |
| STOSB     | Store byte in string                  | 0xAA                  | If DF is 0, *ES:DI++ = AL, else *ES:DI-- = AL.   |
|           |                                       |                       |                                                  |
| STOSW     | Store word in string                  | 0xAB                  | If DF is 0, *ES:DI++ = AX, else *ES:DI-- = AX.   |
|           |                                       |                       |                                                  |
| SUB       | Subtraction                           | 0x28...0x2D,          | (1) r/m -= r/imm; (2) r -= m/imm;                |
|           |                                       | 0x80...0x81/5,        |                                                  |
|           |                                       | 0x82...0x83/5 [1]     |                                                  |
|           |                                       |                       |                                                  |
| TEST      | Logical compare (AND)                 | 0x84, 0x84, [sic]     | (1) r/m & r/imm; (2) r & m/imm;                  |
|           |                                       | 0xA8, 0xA9,           |                                                  |
|           |                                       | 0xF6/0, 0xF7/0        |                                                  |
|           |                                       |                       |                                                  |
| WAIT      | Wait until not busy                   | 0x9B                  | Waits until BUSY# pin is inactive                |
|           |                                       |                       | (used with floating-point unit).                 |
|           |                                       |                       |                                                  |
| XCHG      | Exchange data                         | 0x86, 0x87,           | r :=: r/m; A spinlock typically uses xchg        |
|           |                                       | 0x91...0x97           | as an atomic operation. (coma bug).              |
|           |                                       |                       |                                                  |
| XLAT      | Table look-up translation             | 0xD7                  | Behaves like MOV AL, [BX+AL].                    |
|           |                                       |                       |                                                  |
| XOR       | Exclusive OR                          | 0x30...0x35,          | (1) r/m ^= r/imm;                                |
|           |                                       | 0x80...0x81/6,        | (2) r ^= m/imm;                                  |
|           |                                       | 0x82...0x83/6 [1]     |                                                  |

Legend:
[1] Since 80186.
[2] Since 80386
[3] 8086/8088 only.
