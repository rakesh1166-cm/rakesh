# Exceptions

**1.** What is the difference between `finally` and a context manager for cleanup?

<details>
<summary>Answer</summary>

`finally` runs cleanup code you write. A context manager runs its own exit logic when you leave a `with` block.

#### Frequently used points

**1.** `finally` runs when execution leaves `try`, including when an exception occurs or the code returns early.

<details>
<summary>Answer</summary>

**`finally` runs even when `try` returns early**

```python
def get_number():
    try:
        return 10
    finally:
        print("Cleanup runs first")

print(get_number())
```

Output

```text
Cleanup runs first
10
```

Python runs `finally` before giving `10` back to the caller. It also runs `finally` if an exception leaves `try`.

</details>

**2.** `with` manages a resource for you. For example, `with open(...) as file:` closes the file when the block ends, even if an exception occurs inside it.

<details>
<summary>Answer</summary>

**`with` closes a file automatically**

```python
try:
    with open("demo.txt", "w") as file:
        file.write("Hello")
        raise ValueError("Something went wrong")
except ValueError:
    print("File closed:", file.closed)
```

Output

```text
File closed: True
```

The file closes as soon as execution leaves the `with` block. Then the `except` block handles the error.

</details>

**3.** Use `finally` for custom cleanup. For example, call `await upload.close()` after reading an uploaded file.

<details>
<summary>Answer</summary>

**Use `finally` for your own cleanup**

```python
job = {"running": False}

def run_job():
    job["running"] = True
    try:
        print("Doing the work")
    finally:
        job["running"] = False

run_job()
print("Job running:", job["running"])
```

Output

```text
Doing the work
Job running: False
```

Here, cleanup means resetting the job status. You write that action in `finally` so it also happens if the work fails.

</details>

**4.** Cleanup and error handling are separate. A `finally` block that only cleans up lets the original exception continue. A context manager can suppress an exception if it is designed to do so.

<details>
<summary>Answer</summary>

**Cleanup and error handling are separate**

```python
from contextlib import suppress

try:
    try:
        int("hello")
    finally:
        print("Cleanup ran")
except ValueError:
    print("The error reached except")

with suppress(ValueError):
    int("hello")

print("The program continued")
```

Output

```text
Cleanup ran
The error reached except
The program continued
```

The first `ValueError` reaches `except` after cleanup. The second is ignored because `suppress(ValueError)` is a context manager specifically designed to ignore that error. In point 2, the file context manager closes the file and lets the error continue.

</details>

**5.** Watch out for `return` inside `finally`. It can override an earlier return value or suppress an exception.

<details>
<summary>Answer</summary>

**A `return` inside `finally` can override a result**

```python
def get_number():
    try:
        return 10
    finally:
        return 20

print(get_number())
```

Output

```text
20
```

The `return 20` replaces `return 10`. If `try` raised an exception instead, `return 20` would also hide that exception. Keep cleanup in `finally` and put the return value in `try` or after the `try/finally` block.

</details>

#### MCQs

**M1.** What does this print?

```python
def get_number():
    try:
        return 5
    finally:
        print("Cleanup")

print(get_number())
```

- A) `5` only
- B) `Cleanup`, then `5`
- C) `5`, then `Cleanup`
- D) `Cleanup` only

<details>
<summary>Answer</summary>

**B) `Cleanup`, then `5`**. `finally` prints `Cleanup` before the function returns `5`.

</details>

**M2.** What happens if an exception occurs inside `with open(...) as file:`?

- A) The file stays open.
- B) The file closes and the exception continues.
- C) The file closes and Python always ignores the exception.
- D) The file closes only if there is an `except` block.

<details>
<summary>Answer</summary>

**B) The file closes and the exception continues.** The file context manager closes the file and lets the exception continue.

</details>

**M3.** Which is the simplest way to open a file and close it automatically?

- A) `file = open("notes.txt")`
- B) `if open("notes.txt"):`
- C) `with open("notes.txt") as file:`
- D) `try: file = open("notes.txt")` by itself

<details>
<summary>Answer</summary>

**C) `with open("notes.txt") as file:`**. `with open(...)` closes the file when execution leaves the block.

</details>

**M4.** You need to run a custom cleanup function when an operation succeeds or fails. Which clause fits?

- A) `except`
- B) `else`
- C) `finally`
- D) `elif`

<details>
<summary>Answer</summary>

**C) `finally`**. `finally` runs whether the operation succeeds or raises an exception.

</details>

**M5.** What does this print?

```python
def get_number():
    try:
        return 1
    finally:
        return 2

print(get_number())
```

- A) `1`
- B) `2`
- C) `None`
- D) It raises an exception.

<details>
<summary>Answer</summary>

**B) `2`**. The `return` inside `finally` overrides the earlier `return 1`.

</details>

#### Small program to write from memory

**Task.** Read a file containing `hello` and try to convert it to an integer. Use `try/finally` once and `with` once. In both cases, check whether the file closed after the conversion failed.

Expected output

```text
finally: invalid number, file closed = True
with: invalid number, file closed = True
```

<details>
<summary>Answer</summary>

```python
from pathlib import Path
from tempfile import TemporaryDirectory

with TemporaryDirectory() as directory:
    path = Path(directory) / "number.txt"
    path.write_text("hello", encoding="utf-8")

    file = path.open(encoding="utf-8")
    try:
        try:
            int(file.read())
        finally:
            file.close()
    except ValueError:
        print(f"finally: invalid number, file closed = {file.closed}")

    try:
        with path.open(encoding="utf-8") as file:
            int(file.read())
    except ValueError:
        print(f"with: invalid number, file closed = {file.closed}")
```

Both versions reach the outer `except` after the file closes. In the first version, you write `file.close()` yourself. In the second, the file's context manager calls it for you.

</details>

#### Python practice problems

**1.** Read a price with `with`. Write `read_price(path)` to read a price from a text file and return it as a `float`. For a file containing `149.50`, return `149.5`. For a file containing `free`, let `ValueError` reach the caller and verify that the file still closes.

<details>
<summary>Answer</summary>

```python
from pathlib import Path
from tempfile import TemporaryDirectory
from unittest.mock import patch

def read_price(path):
    with open(path, encoding="utf-8") as file:
        return float(file.read())

opened = []
real_open = open

def tracking_open(*args, **kwargs):
    file = real_open(*args, **kwargs)
    opened.append(file)
    return file

with TemporaryDirectory() as directory:
    good = Path(directory) / "good.txt"
    bad = Path(directory) / "bad.txt"
    good.write_text("149.50", encoding="utf-8")
    bad.write_text("free", encoding="utf-8")

    print(read_price(good))

    with patch("builtins.open", tracking_open):
        try:
            read_price(bad)
        except ValueError as error:
            print("Caller got:", error)

    print("File closed:", opened[0].closed)
```

Output

```text
149.5
Caller got: could not convert string to float: 'free'
File closed: True
```

`with` closes the file on the way out, and there's no `except` inside `read_price`, so `ValueError` reaches the caller. `tracking_open` only keeps a reference to the opened file, so the test can check it afterwards.

</details>

**2.** Reset a job status with `finally`. Write `run_job(job, operation)` to set `job["running"]` to `True`, call `operation()`, and reset `job["running"]` to `False` when the operation ends. If the operation returns `"done"`, return `"done"`. If it raises `ValueError`, let the error reach the caller and verify that `job["running"]` is `False`.

<details>
<summary>Answer</summary>

```python
def run_job(job, operation):
    job["running"] = True
    try:
        return operation()
    finally:
        job["running"] = False

def succeed():
    return "done"

def fail():
    raise ValueError("Job failed")

job = {"running": False}

print(run_job(job, succeed))
print("Running:", job["running"])

try:
    run_job(job, fail)
except ValueError as error:
    print("Caller got:", error)

print("Running:", job["running"])
```

Output

```text
done
Running: False
Caller got: Job failed
Running: False
```

`finally` resets the status on both paths. It has no `return` or `except`, so the result and the `ValueError` both pass through unchanged.

</details>

</details>
