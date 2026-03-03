const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Topic = require('./src/models/Topic');
const Assessment = require('./src/models/Assessment');

dotenv.config();

const createMCQs = (topic, level) => {
    return Array.from({ length: 10 }, (_, i) => ({
        question: `Question ${i + 1} for ${topic} at ${level} level: Analysis of system behavior?`,
        options: ['Condition A fails', 'Condition B is met', 'Hidden state mutation', 'Input overflow'],
        correctOption: Math.floor(Math.random() * 4)
    }));
};

const createLevels = (title, index) => [1, 2, 3, 4].map(num => {
    let explanationQuestion = `Detailed analysis for ${title} - Level ${num}: Explain the system failure.`;
    let hint = `Focus on how ${title} handles unexpected state changes.`;
    let mcqs = createMCQs(title, num);
    let rubric = { coreConcepts: ['Concurrency', 'State'], reasoningConcepts: ['Race Condition', 'Atomic'] };
    let programCode = `// Analysis of ${title}\nfunction evaluate(input) {\n  let state = initialize();\n  // Hidden logic that fails unexpectedly\n  return process(state, input);\n}`;

    // REDESIGNED OS CONTENT (Problem 1)
    if (index === 0) {
        if (num === 1) {
            programCode = `int current = 0;
int readyQueue[3] = {1, 2, 3};

void schedule() {
    while (1) {
        if (readyQueue[current] != -1) {
            runProcess(readyQueue[current]);
            current = (current + 1) % 3;
        }
    }
}

void blockProcess(int pid) {
    for (int i = 0; i < 3; i++) {
        if (readyQueue[i] == pid) {
            readyQueue[i] = -1;
        }
    }
}`;
            explanationQuestion = "If all processes are blocked (readyQueue[i] == -1), how does the schedule() function behave? Is it safe?";
            hint = "Look at the condition while(1) combined with the check if (readyQueue[current] != -1).";
            rubric = {
                coreConcepts: ['Busy Waiting', 'Infinite Loop', 'Process Blocking'],
                reasoningConcepts: ['Livelock', 'CPU Exhaustion', 'Empty ready-queue']
            };
            mcqs = [
                { question: "What happens if all readyQueue elements are -1?", options: ["System crashes", "Busy waiting in an infinite loop", "It sleeps", "It picks the next available"], correctOption: 1 },
                { question: "Why does 'current' continue to increment even if a process is blocked?", options: ["To find next process", "Circular scheduling", "It doesn't increment", "Hardware limitation"], correctOption: 1 },
                { question: "What is the CPU impact of this scheduler when idle?", options: ["0% usage", "100% usage on one core", "System goes to sleep", "Context switch overhead only"], correctOption: 1 },
                { question: "How would you fix this 'busy wait'?", options: ["Add a sleep() call", "Use a condition variable/yield", "Increase queue size", "Use a faster CPU"], correctOption: 1 },
                { question: "Which OS concept is missing here?", options: ["Idle process/task", "Interrupts", "Memory protection", "Virtualization"], correctOption: 0 },
                ...createMCQs(title, num).slice(0, 5)
            ];
        } else if (num === 2) {
            programCode = `int printer = 1;
int disk = 1;

void processA() {
    if (printer) {
        printer = 0;
        sleep(1);
        if (disk) {
            disk = 0;
        }
    }
}

void processB() {
    if (disk) {
        disk = 0;
        sleep(1);
        if (printer) {
            printer = 0;
        }
    }
}`;
            explanationQuestion = "The system occasionally freezes when Process A and B run concurrently. Explain how and why this happens.";
            hint = "Observe the order in which resources (printer, disk) are acquired by both processes.";
            rubric = {
                coreConcepts: ['Deadlock', 'Circular Wait', 'Resource Ordering'],
                reasoningConcepts: ['Lock Inversion', 'Timing Dependency', 'Mutual Exclusion']
            };
            mcqs = [
                { question: "Which condition for deadlock is most clearly violated/met here?", options: ["No preemption", "Circular wait", "Hold and wait", "Mutual exclusion"], correctOption: 1 },
                { question: "Why does the sleep(1) make the bug more likely?", options: ["It slows down CPU", "It ensures interleaving where both hold one resource", "Memory leak", "Context switch delay"], correctOption: 1 },
                { question: "How can this deadlock be prevented by design?", options: ["Strict resource ordering", "Faster execution", "More RAM", "Removing the sleep"], correctOption: 0 },
                ...createMCQs(title, num).slice(0, 7)
            ];
        } else if (num === 3) {
            programCode = `char* getBuffer() {
    char buffer[50];
    strcpy(buffer, "OS_LAB");
    return buffer;
}

void logData() {
    char* data = getBuffer();
    printf("Data: %s\\n", data);
}

void processRequest() {
    char* req = getBuffer();
    printf("Request: %s\\n", req);
}`;
            explanationQuestion = "The program sometimes prints garbage values or crashes. Explain the root cause of this memory corruption.";
            hint = "Think about the 'lifetime' of the 'buffer' variable inside getBuffer().";
            rubric = {
                coreConcepts: ['Stack Allocation', 'Dangling Pointer', 'Variable Lifetime'],
                reasoningConcepts: ['Undefined Behavior', 'Memory Reuse', 'Stack Frame']
            };
            mcqs = [
                { question: "What is the problem with returning 'buffer'?", options: ["It is too small", "It is allocated on the stack and destroyed after return", "It lacks a null terminator", "strcpy is slow"], correctOption: 1 },
                { question: "Why might it work 'sometimes' but fail later?", options: ["CPU cache", "Because the stack memory hasn't been overwritten yet", "Random luck", "Network latency"], correctOption: 1 },
                { question: "What is the correct way to return a string from a function in C?", options: ["Use static buffer or malloc", "Return a pointer to local", "Use global only", "Pass by value"], correctOption: 0 },
                ...createMCQs(title, num).slice(0, 7)
            ];
        } else if (num === 4) {
            programCode = `int balance = 5000;

void deposit(int amt) {
    int temp = balance;
    temp += amt;
    sleep(1);
    balance = temp;
}

void withdraw(int amt) {
    if (balance >= amt) {
        int temp = balance;
        temp -= amt;
        sleep(1);
        balance = temp;
    }
}`;
            explanationQuestion = "This code passes basic single-threaded tests but fails in production with multiple threads. Explain the failure mechanism.";
            hint = "Look at the 'read-modify-write' pattern (temp = balance ... balance = temp).";
            rubric = {
                coreConcepts: ['Race Condition', 'Atomicity', 'Shared State'],
                reasoningConcepts: ['Lost Update', 'Non-atomic operation', 'Context Switching interference']
            };
            mcqs = [
                { question: "What kind of concurrency bug is this?", options: ["Deadlock", "Race condition", "Livelock", "Memory leak"], correctOption: 1 },
                { question: "If two threads call deposit(100) at once, what is a possible final balance?", options: ["5200 (correct)", "5100 (one update lost)", "5000", "Crash"], correctOption: 1 },
                { question: "What synchronization primitive would fix this?", options: ["Semaphore/Mutex", "Condition Variable", "Signal", "Interrupt"], correctOption: 0 },
                ...createMCQs(title, num).slice(0, 7)
            ];
        }
    }

    return {
        levelNumber: num,
        difficulty: num === 1 ? 'Easy' : num === 2 ? 'Medium' : num === 3 ? 'Medium-High' : 'Hard',
        programCode,
        explanationQuestion,
        hint,
        mcqs,
        rubric
    };
});

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        await Topic.deleteMany({});
        await Assessment.deleteMany({});

        const topicData = [
            { name: 'Operating System', description: 'Core principles of scheduling, memory, and resource management.', icon: 'Cpu' },
            { name: 'Backend Systems', description: 'Designing scalable services, state management, and consistency.', icon: 'Server' },
            { name: 'Data Structures', description: 'Beyond syntax: Understanding performance assumptions and edge cases.', icon: 'Layers' },
            { name: 'System Design Basics', description: 'Building resilient architectures with caching, load balancing, and storage.', icon: 'Layout' }
        ];

        const topics = await Topic.insertMany(topicData);

        const problems = [
            // OS
            { title: 'System Reasoning & Failure', topic: topics[0]._id, desc: 'Analyze deep system behavior and failures.' },
            { title: 'Memory Segmentation Flaws', topic: topics[0]._id, desc: 'Why address translation fails under stress.' },
            { title: 'Concurrency & Deadlocks', topic: topics[0]._id, desc: 'Analyzing resource acquisition order.' },
            { title: 'Disk I/O Scheduling', topic: topics[0]._id, desc: 'Predicting seek time bottlenecks.' },

            // Backend
            { title: 'Stateful Session Risks', topic: topics[1]._id, desc: 'Consistency issues in distributed sessions.' },
            ...Array.from({ length: 11 }, (_, i) => ({ title: `Problem ${i + 2}`, topic: topics[Math.floor(i / 4) % 4]._id, desc: '...' }))
        ];

        for (let i = 0; i < problems.length; i++) {
            const p = problems[i];

            await new Assessment({
                title: p.title,
                description: p.desc || 'System understanding test.',
                topic: p.topic,
                levels: createLevels(p.title, i)
            }).save();
        }

        console.log('Seeded high-quality talent-separating assessments.');
        process.exit(0);
    } catch (err) {
        console.error('SEEDING ERROR:', err);
        process.exit(1);
    }
};

seed();
