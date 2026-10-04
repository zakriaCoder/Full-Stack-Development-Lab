LAB REPORT 4 — JAVASCRIPT FUNDAMENTALS
CS301L-FSWD-Lab | BSCS 5C

EXECUTION
1. Keep index.html, style.css and script.js in the same folder.
2. Open index.html in Chrome/Edge, or use VS Code Live Server.
3. Press F12 and select Console. Reload once to see all warm-up and task logs.
4. Test All/Pass/Fail, search by name and Sort by Marks (ascending then descending).
5. Scroll down to inspect catalog, validation, batch results, confirmations and both stock reports.
6. Reload to restore original stock and process the sample batch once again.

REQUIREMENT CHECKLIST
Warm-up 1: Bilal Ahmed marks changed from 45 to 55; card shows Pass, grade C.
Class summary: average 68.00, top scorer Zainab Riaz (95), 5 passed, 1 failed.
Warm-up 2: getGrade() logs the returned grade exactly once per student per page load.
Grades are saved before rendering so search/filter/sort do not repeat these logs.
Warm-up 3: for...of prints all six student names and pass/fail statuses.
Warm-up 4: filter logs failed student objects; map logs their names: Hamza Tariq.

Task 1: Book catalog and separate orders array; required title, author, price,
stock and category fields; deliberate declarations with keyword comments.
Task 2: Book existence, positive integer quantity and available stock checks;
comparison/logical operators and ternary status message; valid and missing-book tests.
Task 3: for...of processes orders in sequence, subtracting only valid quantities;
map creates order summary; reduce counts revenue from fulfilled orders only.
Task 4: Book class, ternary low-stock method, destructured confirmation fields,
and template literal confirmation messages.
Task 5: One lowStockReport function combines category AND stock threshold with
filter, then sorts ascending. Two different category/threshold combinations run.

EXPECTED BOOKSTORE RESULTS
101: Clean Code, 2 copies — Fulfilled, $45.00
102: Eloquent JavaScript, 3 copies — Fulfilled, $90.00
103: The Pragmatic Programmer, 5 copies — Rejected, insufficient stock
104: Unknown book 99, 1 copy — Rejected, book does not exist
105: Atomic Habits, 0 copies — Rejected, invalid quantity
106: Atomic Habits, 2 copies — Fulfilled, $36.00
107: Deep Work, 1 copy — Fulfilled, $20.00
108: Clean Code, 7 copies — Rejected, only 6 remain after order 101
Total revenue: $191.00. Four confirmations printed.
Remaining stock (catalog order): 6, 3, 3, 5, 1.
Programming, stock < 5: Eloquent JavaScript (3), The Pragmatic Programmer (3).
Self-Development, stock < 6: Deep Work (1), Atomic Habits (5).

SUBMISSION EVIDENCE
Capture the full dashboard summary/cards, Console warm-ups, bookstore batch
results/revenue and both category reports. Include these in your lab report if
required by your instructor; attach source files or ZIP as the assignment permits.
Add your own name and student ID if a report cover page is required.

VERIFICATION
JavaScript syntax and runtime logic checked. Boundary checks include missing
books, zero/negative/fractional/text quantities, exact available stock, repeated
orders for the same book, empty batches and empty search summaries.
Automated visual browser verification was unavailable in the execution environment.
