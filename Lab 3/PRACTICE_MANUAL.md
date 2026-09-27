# Lab 3 JavaScript DOM Practice Manual

## Goal

Build a small to-do list in six steps. Each JavaScript file is a complete version of the app up to that task. The later files include the earlier features, so you can practice one milestone at a time without combining snippets by hand.

## Folder contents

- `index.html` is the page structure and selects the JavaScript solution.
- `style.css` provides the supplied visual design and completed-task style.
- `solutions/task-01.js` through `solutions/task-06.js` are separate runnable solutions.
- `PRACTICE_MANUAL.md` is this guide.

## Run a solution

1. Open the `Lab 3` folder in VS Code.
2. Open `index.html` in a browser. You can double-click it in File Explorer or use the Live Server extension.
3. To choose a task, edit the script line near the end of `index.html`. For example, Task 1 uses:

   ```html
   <script src="solutions/task-01.js"></script>
   ```

4. Save `index.html`, refresh the browser, and try the task. Select Task 1 first, then replace the filename with `task-02.js`, `task-03.js`, and so on.
5. Open browser developer tools with F12 and use the Console tab if something does not work. Check spelling, file names, and the first red error.

The page loads the script at the end of `<body>`, after its elements exist. Keep `style.css` and the `solutions` folder next to `index.html` so the relative paths work.

## Task sequence

| File | What to try | Main concepts |
| --- | --- | --- |
| `task-01.js` | Add with the button or Enter; blank input is ignored. | DOM selection, values, createElement, append, click and key events |
| `task-02.js` | Click task text to toggle strike-through. | Event bubbling, classList.toggle |
| `task-03.js` | Delete any task. | Event delegation, closest, remove |
| `task-04.js` | Add/delete tasks and watch the count and empty message. | children.length, template strings, function reuse |
| `task-05.js` | Submit blank spaces and see the error; then add valid text. | trim, if/return, textContent validation feedback |
| `task-06.js` | Complete several tasks and clear only completed tasks. | querySelectorAll, forEach, class selectors |

## How the code works

### Selecting page elements

`getElementById` finds the input, button, and list already written in HTML. The returned values are DOM element objects that JavaScript can read and change.

### Adding a task

`addTask()` reads `taskInput.value`, then `trim()` removes spaces around the text. `document.createElement()` builds an `li`, a `span`, and a Delete button. `textContent` inserts the user's text safely as text, and `append()`/`appendChild()` place those new elements in the list.

### Responding to events

The Add button listens for `click`. The input listens for `keydown` and checks `event.key` for Enter. Both call the same `addTask()` function, avoiding duplicate add logic.

### Completing and deleting tasks

The list itself handles clicks that bubble up from its children. If the click came from task text, the script toggles the `completed` class on its `li`. CSS draws the strike-through. If the click came from a Delete button, `closest("li")` finds and removes that task. Delete clicks return early, so they do not also toggle completion.

### Counting and validation

`taskList.children.length` gives the number of task rows. `updateTaskCount()` runs after each add and delete. In Task 5, an empty trimmed string displays the error and `return` stops the rest of the function. A valid task clears the error.

### Extension feature

Task 6 creates the Clear Completed button in JavaScript. On click, `querySelectorAll("li.completed")` selects completed tasks and `forEach()` removes each one. The count is then refreshed.

## Practice method

For each milestone:

1. Run the supplied solution and interact with it.
2. Read that file and trace each value from selection to page update.
3. Close or minimize the solution, then recreate it in a scratch copy from memory.
4. Compare your version with the solution and explain each difference to yourself.
5. Try the small challenge below before moving forward.

## Practice challenges

- **Task 1:** After adding a task, place the cursor back in the input. Then explain why `trim()` is useful.
- **Task 2:** Make completion toggle only when the task text is clicked. Confirm clicking Delete does not complete the task.
- **Task 3:** Replace the `closest(".delete-btn")` check with a safe check for nested button content, then test it.
- **Task 4:** Display `1 task` for one item and `2 tasks` for two items. The solution already demonstrates singular/plural wording.
- **Task 5:** Change the error message, then verify a successful task clears it.
- **Task 6:** Add a second feature, such as a character limit or a button that marks every task complete.

## Common problems

| Symptom | Check |
| --- | --- |
| `Cannot read properties of null` | The HTML id and JavaScript selector must match exactly. Keep the script tag after the app markup. |
| Nothing happens on Add | Check the selected script path in `index.html`, then inspect the browser Console. |
| The CSS is missing | Make sure `style.css` is beside `index.html` and the link spelling matches. |
| Enter does nothing | Confirm the input has its keydown listener and that it checks `event.key === "Enter"`. |
| Delete also marks a task complete | The delegated Delete branch should remove the row and return before completion handling. |
| Count is out of date | Call `updateTaskCount()` after both add and delete operations. |
| The task text behaves like HTML | Use `textContent` for user-entered task text, not `innerHTML`. |

## Before submitting

- Keep the provided starter structure recognizable.
- Run each task script you are asked to demonstrate.
- Be prepared to explain DOM selection, event listeners, event delegation, `classList`, and validation in your own words.
- Follow your instructor's submission requirements for screenshots or written answers.
