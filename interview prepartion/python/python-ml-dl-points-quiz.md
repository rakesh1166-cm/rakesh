# My Programming Revision Quiz

Lists, NumPy, statistics, Pandas, and sets. Try to answer first, then click **Answer** to check.

Sample data used below: `x = [10, 20, 30]` and `arr = np.array([10, 20, 30])`

---

**1.** How do you add (sum) all elements of a list / NumPy array?

<details>
<summary>Answer</summary>

`sum(x)` for a list, `np.sum(arr)` or `arr.sum()` for NumPy.

```python
sum([10, 20, 30])         # 60
np.sum(np.array([10, 20, 30]))  # 60
```

</details>

**2.** How do you count how many elements are inside a list / NumPy array?

<details>
<summary>Answer</summary>

`len(x)` works for both. NumPy also has `arr.size` (total elements, even in 2D).

```python
len([10, 20, 30])   # 3
arr.size            # 3
```

</details>

**3.** How do you find the average, min, and max of a list / NumPy array?

<details>
<summary>Answer</summary>

List: `sum(x)/len(x)`, `min(x)`, `max(x)`. NumPy: `np.mean(arr)`, `np.min(arr)`, `np.max(arr)`.
Note: Python has **no** built-in `avg()`.

```python
sum(x) / len(x)   # 20.0
min(x), max(x)    # (10, 30)
np.mean(arr), np.min(arr), np.max(arr)   # 20.0, 10, 30
```

</details>

**4.** How do you find mean, median, mode, and stdev of a list / NumPy array?

<details>
<summary>Answer</summary>

Use the `statistics` module for lists. NumPy has `np.mean`, `np.median`, `np.std`, but **no** `np.mode` (use `statistics.mode` or `scipy.stats.mode`).

```python
import statistics
statistics.mean([10, 20, 30])        # 20
statistics.median([10, 20, 90])      # 20
statistics.mode([10, 20, 20, 30])    # 20
statistics.stdev([10, 20, 30])       # 10.0  (sample)

np.mean(arr), np.median(arr), np.std(arr)   # 20.0, 20.0, 8.16 (population)
```

</details>

**5.** What is the difference between median and mean?

<details>
<summary>Answer</summary>

**Mean** = sum ÷ count (the average). **Median** = middle value after sorting. Mean is pulled by outliers; median is not.

```python
salaries = [30, 35, 40, 1000]
statistics.mean(salaries)    # 276.25  (one big outlier drags it up)
statistics.median(salaries)  # 37.5    (still shows a "typical" salary)
```

</details>

**6.** What is meant by standard deviation (stdev) and percentile?

<details>
<summary>Answer</summary>

**Stdev** = how far values typically sit from the mean (small = tightly packed, large = spread out).
**Percentile** = the value below which that % of data falls (95th percentile = 95% of values are at or below it).

```python
statistics.stdev([50, 50, 50])   # 0.0  (no spread)
statistics.stdev([10, 50, 90])   # 40.0 (widely spread)
np.percentile([1,2,3,4,5,6,7,8,9,10], 90)   # 9.1 → 90% of values are ≤ 9.1
```

</details>

**7.** How do you check whether at least one item is truthy?

<details>
<summary>Answer</summary>

`any()` returns True if at least one item is truthy.

```python
any([False, True, False])   # True
any([0, "", None])          # False
```

</details>

**8.** How do you check whether every item is truthy?

<details>
<summary>Answer</summary>

`all()` returns True only if every item is truthy (and True for an empty list).

```python
all([True, True, False])   # False
all([1, 2, 3])             # True
```

</details>

**9.** How do you tell whether a variable is a list or a NumPy array?

<details>
<summary>Answer</summary>

Use `isinstance()` (preferred) or `type()`.

```python
isinstance(x, list)          # True
isinstance(arr, np.ndarray)  # True
type(arr)                    # <class 'numpy.ndarray'>
```

</details>

**10.** How do you find the average squared distance from the mean (variance) in NumPy?

<details>
<summary>Answer</summary>

`np.var(arr)`. Steps: find mean → subtract mean from each value → square → average.

```python
arr = np.array([10, 20, 30])   # mean = 20
# distances: -10, 0, 10 → squared: 100, 0, 100 → average: 200/3
np.var(arr)    # 66.67
np.std(arr)    # 8.16  (stdev = square root of variance)
```

</details>

**11.** How do you find a value's position in the data distribution in NumPy?

<details>
<summary>Answer</summary>

`np.percentile(arr, p)` gives the value at the p-th percentile, e.g. "what response time do 95% of requests stay under?"

```python
times = np.array([100, 120, 130, 150, 900])   # ms
np.percentile(times, 50)   # 130.0 → median
np.percentile(times, 95)   # 750.0 → 95% of requests are ≤ 750 ms
```

</details>

**12.** How do you count how often each distinct value appears in a NumPy array or Pandas Series?

<details>
<summary>Answer</summary>

Pandas: `Series.value_counts()`. NumPy: `np.unique(arr, return_counts=True)`.

```python
labels = ["cat", "dog", "cat", "cat", "dog", "bird"]
pd.Series(labels).value_counts()   # cat 3, dog 2, bird 1

np.unique(labels, return_counts=True)
# (array(['bird','cat','dog']), array([1, 3, 2]))
```

</details>

**13.** How do you calculate the average price for each category in a Pandas DataFrame?

<details>
<summary>Answer</summary>

`df.groupby("category")["price"].mean()`: split rows by category, then average the price in each group.

```python
df = pd.DataFrame({
    "category": ["fruit", "fruit", "veg", "veg"],
    "price":    [10, 20, 5, 15],
})
df.groupby("category")["price"].mean()
# fruit    15.0   ← (10+20)/2
# veg      10.0   ← (5+15)/2
```

</details>

**14.** What is the difference between variance, percentile, value counts, and grouped mean in Pandas?

<details>
<summary>Answer</summary>

| Operation | Code | Purpose | Example result |
|---|---|---|---|
| Variance | `df["price"].var()` | How spread out values are | `41.67` |
| Percentile | `df["price"].quantile(0.9)` | Value below which 90% of data falls | `18.5` |
| Value counts | `df["category"].value_counts()` | How often each category appears | `fruit 2, veg 2` |
| Grouped mean | `df.groupby("category")["price"].mean()` | Average per group | `fruit 15, veg 10` |

(Uses the DataFrame from Q13. Note: Pandas `var()` is sample variance; NumPy `np.var()` is population variance by default.)

</details>

**15.** How do you filter list elements based on a condition, returning a list, in different ways?

<details>
<summary>Answer</summary>

Three ways: list comprehension (most Pythonic), for loop with `append()`, and `filter()` with a lambda.

```python
nums = [1, 2, 3, 4, 5, 6]

[n for n in nums if n % 2 == 0]              # 1. [2, 4, 6]

evens = []
for n in nums:
    if n % 2 == 0:
        evens.append(n)                      # 2. [2, 4, 6]

list(filter(lambda n: n % 2 == 0, nums))     # 3. [2, 4, 6]
```

</details>

**16.** How do you get unique values from a list using a set?

<details>
<summary>Answer</summary>

`set(numbers)` removes duplicates (order not guaranteed). Use `sorted(set(...))` for a sorted list.

```python
numbers = [1, 2, 2, 3, 3, 4]
set(numbers)           # {1, 2, 3, 4}
sorted(set(numbers))   # [1, 2, 3, 4]
```

</details>

**17.** Set operations: add one element, add many, remove, clear, union, intersection, subset check?

<details>
<summary>Answer</summary>

| Task | Code | Result (`s = {1, 2}`) |
|---|---|---|
| Add single element | `s.add(3)` | `{1, 2, 3}` |
| Add multiple elements | `s.update([4, 5])` | `{1, 2, 3, 4, 5}` |
| Remove element | `s.remove(5)` / `s.discard(5)` | `remove` errors if missing, `discard` doesn't |
| Remove all | `s.clear()` | `set()` |
| Combine unique (union) | `a \| b` or `a.union(b)` | all items from both |
| Common (intersection) | `a & b` or `a.intersection(b)` | items in both |
| All exist in another (subset) | `a <= b` or `a.issubset(b)` | `True` / `False` |

</details>

**18.** Using set operators `&`, `-`, `|`: find common labels, test labels missing from training, and all unique labels.

<details>
<summary>Answer</summary>

`train = {"cat", "dog", "bird"}`, `test = {"dog", "fish", "cat"}`

| Task | Code | Sorted Output |
|---|---|---|
| Common labels | `sorted(train & test)` | `['cat', 'dog']` |
| In test, missing from train | `sorted(test - train)` | `['fish']` |
| All unique labels | `sorted(train \| test)` | `['bird', 'cat', 'dog', 'fish']` |

</details>

**19.** Starting from two **lists**, convert to sets and return sorted lists of: common labels, test labels missing from training, all unique labels.

<details>
<summary>Answer</summary>

Wrap each list in `set()` first, then apply the operator and `sorted()`.

`train = ["cat", "dog", "cat", "bird"]`, `test = ["dog", "fish", "dog"]`

| Task | Code | Result |
|---|---|---|
| Common labels | `sorted(set(train) & set(test))` | `['dog']` |
| In test, missing from train | `sorted(set(test) - set(train))` | `['fish']` |
| All unique labels | `sorted(set(train) \| set(test))` | `['bird', 'cat', 'dog', 'fish']` |

</details>

---

## Conversions

**C1.** How do you convert a list, tuple, whole string, string characters, string words, numeric string, and single character into NumPy arrays?

<details>
<summary>Answer</summary>

Pass any sequence to `np.array()`. For strings, first split into a list (`list()` for characters, `.split()` for words).

| Input | Conversion | Result |
|---|---|---|
| List `[1, 2, 3]` | `np.array([1, 2, 3])` | `array([1, 2, 3])` |
| Tuple `(1, 2, 3)` | `np.array((1, 2, 3))` | `array([1, 2, 3])` |
| Whole string `"hello"` | `np.array(["hello"])` | `array(['hello'])` (1 element) |
| String characters `"hi"` | `np.array(list("hi"))` | `array(['h', 'i'])` |
| String words `"I love AI"` | `np.array("I love AI".split())` | `array(['I', 'love', 'AI'])` |
| Numeric string `"1,2,3"` | `np.array("1,2,3".split(","), dtype=int)` | `array([1, 2, 3])` |
| Single character `"a"` | `np.array(["a"])` | `array(['a'])` |

</details>

**C2.** How do you convert a tuple, string (characters or words), single character, numeric string, NumPy array, dict keys/values, Pandas Series, and single number into a Python list?

<details>
<summary>Answer</summary>

Mostly `list()` or `.split()`. Use `.tolist()` for NumPy and Pandas, which also turns NumPy numbers into plain Python ints.

| Input Format | Conversion | Result |
|---|---|---|
| Tuple `(1, 2, 3)` | `list((1, 2, 3))` | `[1, 2, 3]` |
| String → characters `"hi"` | `list("hi")` | `['h', 'i']` |
| String → words `"I love AI"` | `"I love AI".split()` | `['I', 'love', 'AI']` |
| Single character `"a"` | `list("a")` | `['a']` |
| Numeric string `"1,2,3"` | `list(map(int, "1,2,3".split(",")))` | `[1, 2, 3]` |
| NumPy array | `np.array([1, 2]).tolist()` | `[1, 2]` |
| Dict keys `{"a": 1, "b": 2}` | `list(d.keys())` | `['a', 'b']` |
| Dict values | `list(d.values())` | `[1, 2]` |
| Pandas Series | `pd.Series([10, 20]).tolist()` | `[10, 20]` |
| Single number `5` | `[5]` | `[5]` (`list(5)` raises TypeError) |

</details>

**C3.** How do you convert a list, tuple, string (characters or words), whole string, NumPy array, dict of lists, list of dicts, and scalar dict into a Pandas Series or DataFrame?

<details>
<summary>Answer</summary>

1D data → `pd.Series()`. Table-like data (2D array, dict of lists, list of dicts) → `pd.DataFrame()`.

| Input Format | Conversion | Result / Structure |
|---|---|---|
| List `[10, 20, 30]` | `pd.Series([10, 20, 30])` | Series, index 0–2 |
| Tuple `(10, 20)` | `pd.Series((10, 20))` | Series, 2 rows |
| String → characters `"hi"` | `pd.Series(list("hi"))` | Series `['h', 'i']` |
| String → words `"I love AI"` | `pd.Series("I love AI".split())` | Series of 3 words |
| Whole string `"hello"` | `pd.Series(["hello"])` | Series with 1 row |
| NumPy 1D | `pd.Series(np.array([1, 2]))` | Series, 2 rows |
| NumPy 2D | `pd.DataFrame(arr2d, columns=["a", "b"])` | DataFrame, named columns |
| Dict of lists `{"name": ["A", "B"], "age": [25, 30]}` | `pd.DataFrame(d)` | 2 rows × 2 columns (keys = columns) |
| List of dicts `[{"name": "A", "age": 25}, ...]` | `pd.DataFrame(records)` | Each dict = one row |
| Scalar dict `{"a": 1, "b": 2}` | `pd.Series(d)` or `pd.DataFrame([d])` | Series indexed a, b / DataFrame with 1 row |

Note: `pd.DataFrame({"a": 1, "b": 2})` fails ("If using all scalar values, you must pass an index"), so wrap it in a list.

</details>

**C4.** How do you convert key-value pairs, a plain list, two lists, a string, a single character, a NumPy array, a Series, a DataFrame, and a JSON string into a Python dictionary?

<details>
<summary>Answer</summary>

Pairs → `dict()`. Index as keys → `dict(enumerate(...))`. Two lists → `dict(zip(...))`. Pandas → `.to_dict()`. JSON → `json.loads()`.

| Input Format | Conversion | Result |
|---|---|---|
| List/tuple of pairs `[("a", 1), ("b", 2)]` | `dict(pairs)` | `{'a': 1, 'b': 2}` |
| Plain list → indexed keys `["x", "y"]` | `dict(enumerate(["x", "y"]))` | `{0: 'x', 1: 'y'}` |
| Two lists → keys, values | `dict(zip(["a", "b"], [1, 2]))` | `{'a': 1, 'b': 2}` |
| String → indexed characters `"hi"` | `dict(enumerate("hi"))` | `{0: 'h', 1: 'i'}` |
| Single character `"a"` | `dict(enumerate("a"))` | `{0: 'a'}` |
| NumPy array `[10, 20]` | `dict(enumerate(arr.tolist()))` | `{0: 10, 1: 20}` |
| Pandas Series (index a, b) | `s.to_dict()` | `{'a': 10, 'b': 20}` |
| DataFrame → column lists | `df.to_dict("list")` | `{'name': ['A', 'B'], 'age': [25, 30]}` |
| JSON string `'{"a": 1}'` | `json.loads('{"a": 1}')` | `{'a': 1}` |

</details>

**C5.** How do you load different data sources (list of dicts, dict of lists, list of lists/tuples, NumPy, CSV, Excel, JSON, SQL, API) into a Pandas DataFrame?

<details>
<summary>Answer</summary>

Python objects → `pd.DataFrame()`. Files and databases → the matching `pd.read_*()` function.

| Input Format | Conversion | Result |
|---|---|---|
| List of dicts | `pd.DataFrame(records)` | Each dict = row, keys = columns |
| Dict of lists | `pd.DataFrame(data)` | Keys = columns |
| List of lists | `pd.DataFrame(rows, columns=["id", "name"])` | Rows with named columns |
| List of tuples | `pd.DataFrame(rows, columns=["id", "name"])` | Same as list of lists |
| NumPy array | `pd.DataFrame(arr, columns=["a", "b"])` | Numeric DataFrame |
| CSV file | `pd.read_csv("data.csv")` | DataFrame from the file |
| Excel file | `pd.read_excel("data.xlsx")` | DataFrame (needs `openpyxl`) |
| JSON file of records | `pd.read_json("data.json")` | Each record = row |
| SQL query | `pd.read_sql("SELECT * FROM users", conn)` | Query result as DataFrame |
| API response | `pd.DataFrame(requests.get(url).json())` | Records as rows (`pd.json_normalize()` for nested JSON) |

</details>

**C6.** How do you convert a DataFrame into a list of dicts, dict of lists, list of lists, NumPy array, feature matrix, and target array, and then into PyTorch/TensorFlow tensors?

<details>
<summary>Answer</summary>

Use `to_dict()` / `to_numpy()` on the DataFrame, drop the target to get X, then `torch.tensor()` or `tf.convert_to_tensor()`.

`df = pd.DataFrame({"age": [25, 30], "salary": [50, 60], "label": [0, 1]})`

| Input Format | Conversion | Result |
|---|---|---|
| DataFrame → list of dicts | `df.to_dict("records")` | `[{'age': 25, 'salary': 50, 'label': 0}, ...]` |
| DataFrame → dict of lists | `df.to_dict("list")` | `{'age': [25, 30], 'salary': [50, 60], 'label': [0, 1]}` |
| DataFrame → list of lists | `df.values.tolist()` | `[[25, 50, 0], [30, 60, 1]]` |
| DataFrame → NumPy | `df.to_numpy()` | array, shape `(2, 3)` |
| Feature matrix X | `X = df.drop(columns="label").to_numpy()` | shape `(2, 2)` |
| Target array y | `y = df["label"].to_numpy()` | `array([0, 1])` |
| X → PyTorch | `torch.tensor(X, dtype=torch.float32)` | `torch.Size([2, 2])` |
| X → TensorFlow | `tf.convert_to_tensor(X, dtype=tf.float32)` | `TensorShape([2, 2])` |

</details>

**C7.** How do you split a paragraph into sentences, give each an ID with `enumerate()`, and convert the result into a list of dicts, dict of lists, DataFrame, NumPy string array, and JSON string?

<details>
<summary>Answer</summary>

Paragraph → `split()` + `strip()` → records with `enumerate()` → `pd.DataFrame()` → `to_dict("list")` / `np.array()` / `json.dumps()`.

| Input Format with Example | Conversion | Result |
|---|---|---|
| Paragraph `"AI is useful. Python is popular. RAG uses retrieval."` | `sentences = [s.strip() for s in text.split(".") if s.strip()]` | `['AI is useful', 'Python is popular', 'RAG uses retrieval']` |
| Sentences → list of dicts | `records = [{"id": i, "text": s} for i, s in enumerate(sentences, start=1)]` | `[{'id': 1, 'text': 'AI is useful'}, ...]` |
| Records → DataFrame | `df = pd.DataFrame(records)` | 3 rows × 2 columns (`id`, `text`) |
| DataFrame → dict of lists | `df.to_dict("list")` | `{'id': [1, 2, 3], 'text': [...]}` |
| Sentences → NumPy string array | `np.array(sentences)` | `array([...], dtype='<U18')` |
| Records → JSON string | `json.dumps(records)` | `'[{"id": 1, "text": "AI is useful"}, ...]'` |

</details>

**C8.** How do you turn a group of strings into id/text records and a DataFrame, remove empty and duplicate texts, and export the result as a dict of lists, CSV, and JSON?

<details>
<summary>Answer</summary>

Strings → records with `enumerate()` → DataFrame → `str.strip()` → drop empty rows → `drop_duplicates(subset="text")` → `to_dict()` / `to_csv()` / `to_json()`.

| Input Format with Example | Conversion | Result |
|---|---|---|
| Strings `["  hello ", "", "world", "hello"]` | `records = [{"id": i, "text": t} for i, t in enumerate(texts)]` | 4 records, ids 0–3 |
| Records → DataFrame | `df = pd.DataFrame(records)` | 4 rows × 2 columns |
| Trim whitespace | `df["text"] = df["text"].str.strip()` | `"  hello "` → `"hello"` |
| Remove empty texts | `df = df.loc[df["text"].ne("")]` | 3 rows |
| Remove duplicate texts | `df = df.drop_duplicates(subset="text")` | 2 rows: `hello` (id 0), `world` (id 2) |
| → Dict of lists | `df.to_dict("list")` | `{'id': [0, 2], 'text': ['hello', 'world']}` |
| → CSV file | `df.to_csv("clean.csv", index=False)` | `clean.csv` with header `id,text` |
| → JSON file | `df.to_json("clean.json", orient="records")` | `[{"id":0,"text":"hello"},{"id":2,"text":"world"}]` |

Tip: use `subset="text"`. Without it, the different ids make every row unique, so no duplicates are removed.

</details>

**C9.** How do you turn labeled text (reviews with sentiment) into a DataFrame, split the text from the target, convert the text to TF-IDF features, and the labels to a NumPy array?

<details>
<summary>Answer</summary>

Records → `pd.DataFrame()` → `df["text"]` and `df["label"]` → `TfidfVectorizer().fit_transform()` (sparse matrix) + `to_numpy()` for the labels.

| Input Format with Example | Conversion | Result |
|---|---|---|
| Records `[{"text": "great product", "label": "positive"}, {"text": "bad quality", "label": "negative"}, {"text": "great value", "label": "positive"}]` | `df = pd.DataFrame(reviews)` | 3 rows × 2 columns |
| Separate text | `X_text = df["text"]` | Series of 3 reviews |
| Separate target | `y_raw = df["label"]` | Series of 3 labels |
| Text → TF-IDF | `vec = TfidfVectorizer(); X = vec.fit_transform(X_text)` | Sparse matrix, shape `(3, 5)` (5 unique words) |
| Labels → NumPy | `y = df["label"].map({"negative": 0, "positive": 1}).to_numpy()` | `array([1, 0, 1])` |

Tip: in a real project, fit the vectorizer on training data only, then call `transform()` on the test data.

</details>

**C10.** How do you split a long document into overlapping chunks, give each chunk an ID and source, store them as a list of dicts, and create a NumPy embedding matrix for RAG?

<details>
<summary>Answer</summary>

Document → `split()` → overlapping slices joined with `" ".join()` → dicts with id and source → list of texts → `model.encode(..., convert_to_numpy=True)`.

| Input Format with Example | Conversion | Result |
|---|---|---|
| Document of 10 words `"w1 w2 ... w10"` | `words = doc.split()` | list of 10 words |
| Words → overlapping chunks (size 4, overlap 2) | `chunks = [" ".join(words[i:i+4]) for i in range(0, len(words) - 2, 2)]` | `['w1 w2 w3 w4', 'w3 w4 w5 w6', 'w5 w6 w7 w8', 'w7 w8 w9 w10']` |
| Chunks → records with metadata | `records = [{"id": f"doc1_{i}", "source": "doc1.pdf", "text": c} for i, c in enumerate(chunks)]` | `[{'id': 'doc1_0', 'source': 'doc1.pdf', 'text': 'w1 w2 w3 w4'}, ...]` |
| Records → texts | `texts = [r["text"] for r in records]` | list of 4 strings |
| Texts → embeddings | `SentenceTransformer("all-MiniLM-L6-v2").encode(texts, convert_to_numpy=True)` | NumPy matrix, shape `(4, 384)` |

Why overlap: a sentence that crosses a chunk boundary still appears whole in one chunk.

</details>

**C11.** How do you convert a batch of texts into token IDs and attention masks, pad or truncate them to the same length, and return PyTorch or TensorFlow tensors?

<details>
<summary>Answer</summary>

One tokenizer call does it all: `tokenizer(texts, padding=..., truncation=True, max_length=..., return_tensors="pt" or "tf")`.

`tok = AutoTokenizer.from_pretrained("bert-base-uncased")`, `texts = ["I love AI", "Hello"]`

| Input Format with Example | Conversion | Result |
|---|---|---|
| Strings → token IDs | `tok(texts)["input_ids"]` | `[[101, 1045, 2293, 9932, 102], [101, 7592, 102]]` (different lengths) |
| Pad/truncate to length 6 | `tok(texts, padding="max_length", truncation=True, max_length=6)` | `[[101, 1045, 2293, 9932, 102, 0], [101, 7592, 102, 0, 0, 0]]` |
| Attention mask | made by the tokenizer | `[[1, 1, 1, 1, 1, 0], [1, 1, 1, 0, 0, 0]]` (1 = real token, 0 = padding) |
| → PyTorch tensors | add `return_tensors="pt"` | `torch.Tensor`, shape `[2, 6]` |
| → TensorFlow tensors | add `return_tensors="tf"` | `tf.Tensor`, shape `(2, 6)` |

Tip: `padding=True` pads only to the longest text in the batch (less wasted compute). `101` = `[CLS]`, `102` = `[SEP]`, `0` = `[PAD]`.

</details>

---

## Machine Learning (scikit-learn)

Example dataset used in sections 1–2:

```python
import pandas as pd
df = pd.DataFrame({
    "age":    [25, 32, None, 45, 25],
    "city":   ["Delhi", "Mumbai", "Delhi", "Pune", "Delhi"],
    "income": [50, 80, 60, None, 50],
    "bought": [0, 1, 0, 1, 0],          # target
})
# rows 0 and 4 are exact duplicates
```

### 1. Load and inspect data

**ML1.1** How do you load a CSV file into a pandas DataFrame?

<details>
<summary>Answer</summary>

| Task | Command | Purpose | Output |
|---|---|---|---|
| Load CSV | `df = pd.read_csv("customers.csv")` | Read a file into a table | DataFrame with the file's rows and columns |

</details>

**ML1.2** How do you display the first five rows of a DataFrame?

<details>
<summary>Answer</summary>

| Task | Command | Purpose | Output |
|---|---|---|---|
| First 5 rows | `df.head()` | Quick look at the data | Rows 0–4 (`df.head(10)` for 10 rows, `df.tail()` for the last 5) |

</details>

**ML1.3** How do you find the number of rows and columns?

<details>
<summary>Answer</summary>

| Task | Command | Purpose | Output |
|---|---|---|---|
| Rows × columns | `df.shape` | Know the dataset size | `(5, 4)` → 5 rows, 4 columns |

</details>

**ML1.4** How do you inspect column names, data types, and non-null counts?

<details>
<summary>Answer</summary>

| Task | Command | Purpose | Output |
|---|---|---|---|
| Summary of columns | `df.info()` | See types and missing values in one view | `age 4 non-null float64`, `city 5 non-null object`, `income 4 non-null float64`, `bought 5 non-null int64` |

</details>

**ML1.5** How do you generate descriptive statistics for numerical columns?

<details>
<summary>Answer</summary>

| Task | Command | Purpose | Output |
|---|---|---|---|
| Stats summary | `df.describe()` | count, mean, std, min, quartiles, max per numeric column | `age`: count 4, mean 31.75, min 25, max 45; `income`: count 4, mean 60.0 |

</details>

**ML1.6** How do you count missing values in each column?

<details>
<summary>Answer</summary>

| Task | Command | Purpose | Output |
|---|---|---|---|
| Missing per column | `df.isnull().sum()` | Decide whether to drop or fill missing values | `age 1, city 0, income 1, bought 0` |

</details>

**ML1.7** How do you count duplicate rows?

<details>
<summary>Answer</summary>

| Task | Command | Purpose | Output |
|---|---|---|---|
| Count duplicates | `df.duplicated().sum()` | Find repeated records | `1` (row 4 repeats row 0) |

</details>

**ML1.8** How do you count each target class to check class balance?

<details>
<summary>Answer</summary>

| Task | Command | Purpose | Output |
|---|---|---|---|
| Class counts | `df["bought"].value_counts()` | Spot imbalanced classes | `0 → 3`, `1 → 2` |
| Class share | `df["bought"].value_counts(normalize=True)` | Same, as proportions | `0 → 0.6`, `1 → 0.4` |

</details>

**ML1.9** How do you display all column names and each column's data type?

<details>
<summary>Answer</summary>

| Task | Command | Purpose | Output |
|---|---|---|---|
| Column names | `df.columns.tolist()` | List all columns | `['age', 'city', 'income', 'bought']` |
| Data types | `df.dtypes` | Type of each column | `age float64, city object, income float64, bought int64` |

</details>

### 2. Clean and prepare data

**ML2.1** How do you remove duplicate rows?

<details>
<summary>Answer</summary>

| Task | Command | Purpose | Output |
|---|---|---|---|
| Drop duplicates | `df = df.drop_duplicates()` | Stop repeated rows from biasing the model | 5 rows → 4 rows |

</details>

**ML2.2** How do you remove rows containing missing values?

<details>
<summary>Answer</summary>

| Task | Command | Purpose | Output |
|---|---|---|---|
| Drop missing rows | `df = df.dropna()` | Keep only complete rows (when few are missing) | 5 rows → 3 rows (rows 2 and 3 removed) |

</details>

**ML2.3** How do you select specific columns as the feature matrix X?

<details>
<summary>Answer</summary>

| Task | Command | Purpose | Output |
|---|---|---|---|
| Features | `X = df[["age", "city", "income"]]` | Model inputs (double brackets → DataFrame) | DataFrame, shape `(5, 3)` |

</details>

**ML2.4** How do you select a target column as y?

<details>
<summary>Answer</summary>

| Task | Command | Purpose | Output |
|---|---|---|---|
| Target | `y = df["bought"]` | What the model predicts (single brackets → Series) | Series, shape `(5,)` |

</details>

**ML2.5** How do you split features and targets into training and test sets?

<details>
<summary>Answer</summary>

| Task | Command | Purpose | Output |
|---|---|---|---|
| Train/test split | `from sklearn.model_selection import train_test_split`<br>`X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)` | Keep unseen data for a fair final test | `X_train (4, 3)`, `X_test (1, 3)` |

Tip: add `stratify=y` for classification on real data so both sets keep the same class ratio.

</details>

**ML2.6** How do you fill missing numerical values with SimpleImputer?

<details>
<summary>Answer</summary>

| Task | Command | Purpose | Output |
|---|---|---|---|
| Fill NaN | `from sklearn.impute import SimpleImputer`<br>`imp = SimpleImputer(strategy="median")`<br>`X_train_num = imp.fit_transform(X_train[["age", "income"]])`<br>`X_test_num = imp.transform(X_test[["age", "income"]])` | Replace NaN with the **training** median | `NaN` → training median (e.g. `28.5`); no NaN left |

</details>

**ML2.7** How do you standardize numerical features with StandardScaler?

<details>
<summary>Answer</summary>

| Task | Command | Purpose | Output |
|---|---|---|---|
| Scale | `from sklearn.preprocessing import StandardScaler`<br>`sc = StandardScaler()`<br>`X_train_s = sc.fit_transform(X_train_num)`<br>`X_test_s = sc.transform(X_test_num)` | Mean 0, std 1 so large-valued features don't dominate | age `[25, 32, 45]` → `[-1.09, -0.24, 1.33]` |

</details>

**ML2.8** How do you convert categorical features into numerical columns with OneHotEncoder?

<details>
<summary>Answer</summary>

| Task | Command | Purpose | Output |
|---|---|---|---|
| One-hot | `from sklearn.preprocessing import OneHotEncoder`<br>`ohe = OneHotEncoder(handle_unknown="ignore", sparse_output=False)`<br>`city_train = ohe.fit_transform(X_train[["city"]])` | One 0/1 column per category | `Delhi → [1,0,0]`, `Mumbai → [0,1,0]`, `Pune → [0,0,1]` |

`handle_unknown="ignore"` turns a city never seen in training into all zeros instead of an error.

</details>

**ML2.9** How do you convert text into numerical features with TfidfVectorizer?

<details>
<summary>Answer</summary>

| Task | Command | Purpose | Output |
|---|---|---|---|
| Text → TF-IDF | `from sklearn.feature_extraction.text import TfidfVectorizer`<br>`vec = TfidfVectorizer()`<br>`X_train_t = vec.fit_transform(train_texts)`<br>`X_test_t = vec.transform(test_texts)` | Weight words by how important they are to each document | Sparse matrix `(n_docs, vocab_size)`, e.g. `(3, 5)` |

</details>

**ML2.10** How do you apply different preprocessing to different columns with ColumnTransformer?

<details>
<summary>Answer</summary>

| Task | Command | Purpose | Output |
|---|---|---|---|
| Per-column prep | `from sklearn.compose import ColumnTransformer`<br>`num = Pipeline([("imp", SimpleImputer(strategy="median")), ("sc", StandardScaler())])`<br>`prep = ColumnTransformer([("num", num, ["age", "income"]), ("cat", OneHotEncoder(handle_unknown="ignore"), ["city"])])`<br>`X_train_p = prep.fit_transform(X_train)` | Impute + scale numbers, one-hot encode categories, in one step | Shape `(n_rows, 2 + n_cities)`, e.g. `(4, 5)` |

</details>

**ML2.11** How do you combine preprocessing and a model with Pipeline?

<details>
<summary>Answer</summary>

| Task | Command | Purpose | Output |
|---|---|---|---|
| Full pipeline | `from sklearn.pipeline import Pipeline`<br>`pipe = Pipeline([("prep", prep), ("model", LogisticRegression())])`<br>`pipe.fit(X_train, y_train)` | Prep is learned only on training data (no leakage); one object to tune, save, and deploy | Fitted `Pipeline(steps=[('prep', ...), ('model', LogisticRegression())])` |

</details>

### 3. Choose and create an algorithm

Each one is used the same way: `model.fit(X_train, y_train)` then `model.predict(X_test)`.

**ML3.1** Linear regression for predicting numbers?

<details>
<summary>Answer</summary>

| Task | Command | Purpose | Output |
|---|---|---|---|
| Linear regression | `from sklearn.linear_model import LinearRegression`<br>`model = LinearRegression()` | Fit a straight line/plane to predict a number (e.g. price) | `LinearRegression()` |

</details>

**ML3.2** Ridge regression with regularization?

<details>
<summary>Answer</summary>

| Task | Command | Purpose | Output |
|---|---|---|---|
| Ridge | `from sklearn.linear_model import Ridge`<br>`model = Ridge(alpha=10)` | L2 penalty shrinks coefficients → less overfitting (higher alpha = stronger) | `Ridge(alpha=10)` |

</details>

**ML3.3** Lasso regression that can produce zero coefficients?

<details>
<summary>Answer</summary>

| Task | Command | Purpose | Output |
|---|---|---|---|
| Lasso | `from sklearn.linear_model import Lasso`<br>`model = Lasso(alpha=0.1)` | L1 penalty can set useless features' coefficients to exactly 0 (feature selection) | `Lasso(alpha=0.1)`; after fit, `model.coef_` → e.g. `[2.1, 0.0, 0.8]` |

</details>

**ML3.4** Logistic regression for classification?

<details>
<summary>Answer</summary>

| Task | Command | Purpose | Output |
|---|---|---|---|
| Logistic regression | `from sklearn.linear_model import LogisticRegression`<br>`model = LogisticRegression(max_iter=1000)` | Linear classifier that outputs class probabilities | `LogisticRegression(max_iter=1000)` |

</details>

**ML3.5** Decision tree classifier?

<details>
<summary>Answer</summary>

| Task | Command | Purpose | Output |
|---|---|---|---|
| Tree classifier | `from sklearn.tree import DecisionTreeClassifier`<br>`model = DecisionTreeClassifier(max_depth=3, random_state=42)` | If/else splits to predict a class; easy to explain; `max_depth` limits overfitting | `DecisionTreeClassifier(max_depth=3, random_state=42)` |

</details>

**ML3.6** Decision tree regressor?

<details>
<summary>Answer</summary>

| Task | Command | Purpose | Output |
|---|---|---|---|
| Tree regressor | `from sklearn.tree import DecisionTreeRegressor`<br>`model = DecisionTreeRegressor(max_depth=3, random_state=42)` | Tree that predicts the average target in each leaf | `DecisionTreeRegressor(max_depth=3, random_state=42)` |

</details>

**ML3.7** Random forest classifier?

<details>
<summary>Answer</summary>

| Task | Command | Purpose | Output |
|---|---|---|---|
| RF classifier | `from sklearn.ensemble import RandomForestClassifier`<br>`model = RandomForestClassifier(n_estimators=200, random_state=42)` | Many trees vote → more accurate and stable than one tree | `RandomForestClassifier(n_estimators=200, random_state=42)` |

</details>

**ML3.8** Random forest regressor?

<details>
<summary>Answer</summary>

| Task | Command | Purpose | Output |
|---|---|---|---|
| RF regressor | `from sklearn.ensemble import RandomForestRegressor`<br>`model = RandomForestRegressor(n_estimators=200, random_state=42)` | Averages many trees' numeric predictions | `RandomForestRegressor(n_estimators=200, random_state=42)` |

</details>

**ML3.9** Support vector classifier (SVC)?

<details>
<summary>Answer</summary>

| Task | Command | Purpose | Output |
|---|---|---|---|
| SVC | `from sklearn.svm import SVC`<br>`model = SVC(kernel="rbf", C=1.0, probability=True)` | Finds the widest-margin boundary; RBF kernel handles curved boundaries; scale features first | `SVC(probability=True)` (defaults not shown) |

</details>

**ML3.10** Support vector regression (SVR)?

<details>
<summary>Answer</summary>

| Task | Command | Purpose | Output |
|---|---|---|---|
| SVR | `from sklearn.svm import SVR`<br>`model = SVR(kernel="rbf", C=10)` | Fits a function that ignores errors smaller than epsilon; needs scaled features | `SVR(C=10)` |

</details>

**ML3.11** K-nearest neighbors classifier?

<details>
<summary>Answer</summary>

| Task | Command | Purpose | Output |
|---|---|---|---|
| KNN | `from sklearn.neighbors import KNeighborsClassifier`<br>`model = KNeighborsClassifier(n_neighbors=3)` | Predicts the majority class of the 3 closest training points; needs scaling | `KNeighborsClassifier(n_neighbors=3)` |

</details>

**ML3.12** Multinomial Naive Bayes for nonnegative text features?

<details>
<summary>Answer</summary>

| Task | Command | Purpose | Output |
|---|---|---|---|
| Naive Bayes | `from sklearn.naive_bayes import MultinomialNB`<br>`model = MultinomialNB()`<br>`model.fit(X_train_counts, y_train)` | Fast, strong baseline for text using word counts / TF-IDF (values must be ≥ 0) | `MultinomialNB()` |

</details>

**ML3.13** Histogram gradient boosting classifier?

<details>
<summary>Answer</summary>

| Task | Command | Purpose | Output |
|---|---|---|---|
| HGB classifier | `from sklearn.ensemble import HistGradientBoostingClassifier`<br>`model = HistGradientBoostingClassifier(max_iter=200)` | Trees built one after another, each fixing earlier errors; fast on large data; handles NaN natively | `HistGradientBoostingClassifier(max_iter=200)` |

</details>

**ML3.14** Histogram gradient boosting regressor?

<details>
<summary>Answer</summary>

| Task | Command | Purpose | Output |
|---|---|---|---|
| HGB regressor | `from sklearn.ensemble import HistGradientBoostingRegressor`<br>`model = HistGradientBoostingRegressor()` | Boosting for numeric targets; top choice for tabular data | `HistGradientBoostingRegressor()` |

</details>

**ML3.15** K-means for clustering?

<details>
<summary>Answer</summary>

| Task | Command | Purpose | Output |
|---|---|---|---|
| K-means | `from sklearn.cluster import KMeans`<br>`model = KMeans(n_clusters=3, random_state=42)` | Groups unlabeled data into k round clusters (you choose k) | `KMeans(n_clusters=3, random_state=42)` |

</details>

**ML3.16** DBSCAN for clustering and finding noise?

<details>
<summary>Answer</summary>

| Task | Command | Purpose | Output |
|---|---|---|---|
| DBSCAN | `from sklearn.cluster import DBSCAN`<br>`model = DBSCAN(eps=0.3, min_samples=5)` | Finds dense clusters of any shape, no k needed; outliers get label `-1` | `DBSCAN(eps=0.3)`; after `fit_predict` → e.g. `[0, 0, 1, 1, -1]` |

</details>

**ML3.17** PCA for dimensionality reduction?

<details>
<summary>Answer</summary>

| Task | Command | Purpose | Output |
|---|---|---|---|
| PCA | `from sklearn.decomposition import PCA`<br>`pca = PCA(n_components=2)`<br>`X_2d = pca.fit_transform(X_scaled)` | Compress many features into a few that keep the most variance | `PCA(n_components=2)`; shape `(100, 10)` → `(100, 2)` |

</details>

### 4. Train, transform, and predict

**ML4.1** How do you train a supervised model with `fit(X_train, y_train)`?

<details>
<summary>Answer</summary>

| Task | Command | Purpose | Output |
|---|---|---|---|
| Train | `model.fit(X_train, y_train)` | Learn patterns from features and labels | Returns the fitted model, e.g. `LogisticRegression()`, with learned `coef_` |

</details>

**ML4.2** How do you predict numbers or class labels with `predict(X_test)`?

<details>
<summary>Answer</summary>

| Task | Command | Purpose | Output |
|---|---|---|---|
| Predict | `y_pred = model.predict(X_test)` | Get predictions for new rows | Classifier → `array([0, 1, 1])`; regressor → `array([52.3, 61.8])` |

</details>

**ML4.3** How do you get class probabilities with `predict_proba()`?

<details>
<summary>Answer</summary>

| Task | Command | Purpose | Output |
|---|---|---|---|
| Probabilities | `proba = model.predict_proba(X_test)`<br>`proba[:, 1]` | Confidence per class (for thresholds, ROC AUC) | `[[0.8, 0.2], [0.3, 0.7]]` (rows sum to 1); `[:, 1]` → `[0.2, 0.7]` |

Supported by LogisticRegression, trees, forests, NB, KNN; SVC only with `probability=True`.

</details>

**ML4.4** How do you apply a fitted transformation with `transform()`?

<details>
<summary>Answer</summary>

| Task | Command | Purpose | Output |
|---|---|---|---|
| Transform | `X_test_s = scaler.transform(X_test)` | Apply the **training** mean/std to new data (no re-fitting → no leakage) | age `35` → `(35 - 34) / 8.29 = 0.12` |

</details>

**ML4.5** How do you learn a transformation and apply it to training data with `fit_transform()`?

<details>
<summary>Answer</summary>

| Task | Command | Purpose | Output |
|---|---|---|---|
| Fit + transform | `X_train_s = scaler.fit_transform(X_train)` | Learn mean/std from training data and scale it in one call | `[25, 32, 45]` → `[-1.09, -0.24, 1.33]` |

Use only on training data. Never call `fit_transform` on the test set.

</details>

**ML4.6** How do you fit a clustering model and get labels with `fit_predict()`?

<details>
<summary>Answer</summary>

| Task | Command | Purpose | Output |
|---|---|---|---|
| Cluster labels | `labels = KMeans(n_clusters=2, random_state=42).fit_predict(X)` | Fit and assign each row to a cluster | `array([0, 0, 1, 1])` (numbers are group IDs, not ranks) |

</details>

### 5. Evaluate the model

Regression example: `y_true = [3, 5, 7]`, `y_pred = [2, 5, 9]`
Classification example: `y_true = [1, 0, 1, 1, 0, 1]`, `y_pred = [1, 0, 0, 1, 1, 1]` → TP 3, TN 1, FP 1, FN 1

**ML5.1** Mean Absolute Error (MAE)?

<details>
<summary>Answer</summary>

| Task | Command | Purpose | Output |
|---|---|---|---|
| MAE | `from sklearn.metrics import mean_absolute_error`<br>`mean_absolute_error(y_true, y_pred)` | Average size of the error, in target units | `1.0` → off by 1 on average (errors 1, 0, 2) |

</details>

**ML5.2** Mean Squared Error (MSE)?

<details>
<summary>Answer</summary>

| Task | Command | Purpose | Output |
|---|---|---|---|
| MSE | `from sklearn.metrics import mean_squared_error`<br>`mean_squared_error(y_true, y_pred)` | Average squared error; punishes big errors more | `1.667` = (1 + 0 + 4) / 3; RMSE = √1.667 ≈ 1.29 |

</details>

**ML5.3** R² score?

<details>
<summary>Answer</summary>

| Task | Command | Purpose | Output |
|---|---|---|---|
| R² | `from sklearn.metrics import r2_score`<br>`r2_score(y_true, y_pred)` | Share of the target's variance the model explains (1 = perfect, 0 = no better than predicting the mean) | `0.375` = 1 − 5/8 |

</details>

**ML5.4** Classification accuracy?

<details>
<summary>Answer</summary>

| Task | Command | Purpose | Output |
|---|---|---|---|
| Accuracy | `from sklearn.metrics import accuracy_score`<br>`accuracy_score(y_true, y_pred)` | Share of correct predictions | `0.667` = 4/6 correct (misleading on imbalanced data) |

</details>

**ML5.5** Precision?

<details>
<summary>Answer</summary>

| Task | Command | Purpose | Output |
|---|---|---|---|
| Precision | `from sklearn.metrics import precision_score`<br>`precision_score(y_true, y_pred)` | Of predicted positives, how many were right: TP / (TP + FP) | `0.75` = 3/4 (matters when false alarms are costly, e.g. spam) |

</details>

**ML5.6** Recall?

<details>
<summary>Answer</summary>

| Task | Command | Purpose | Output |
|---|---|---|---|
| Recall | `from sklearn.metrics import recall_score`<br>`recall_score(y_true, y_pred)` | Of actual positives, how many we caught: TP / (TP + FN) | `0.75` = 3/4 (matters when misses are costly, e.g. disease) |

</details>

**ML5.7** F1 score?

<details>
<summary>Answer</summary>

| Task | Command | Purpose | Output |
|---|---|---|---|
| F1 | `from sklearn.metrics import f1_score`<br>`f1_score(y_true, y_pred)` | Harmonic mean of precision and recall; one balanced number | `0.75` |

</details>

**ML5.8** Confusion matrix?

<details>
<summary>Answer</summary>

| Task | Command | Purpose | Output |
|---|---|---|---|
| Confusion matrix | `from sklearn.metrics import confusion_matrix`<br>`confusion_matrix(y_true, y_pred)` | Shows which classes get mixed up | `[[1, 1], [1, 3]]` → `[[TN, FP], [FN, TP]]` |

</details>

**ML5.9** Classification report?

<details>
<summary>Answer</summary>

| Task | Command | Purpose | Output |
|---|---|---|---|
| Report | `from sklearn.metrics import classification_report`<br>`print(classification_report(y_true, y_pred))` | Precision, recall, F1, and support for every class at once | class 0: P 0.50, R 0.50, F1 0.50, support 2<br>class 1: P 0.75, R 0.75, F1 0.75, support 4<br>accuracy 0.67 |

</details>

**ML5.10** Binary ROC AUC from probabilities or decision scores?

<details>
<summary>Answer</summary>

| Task | Command | Purpose | Output |
|---|---|---|---|
| ROC AUC | `from sklearn.metrics import roc_auc_score`<br>`roc_auc_score([0, 0, 1, 1], [0.1, 0.4, 0.35, 0.8])` | How well the model ranks positives above negatives, across all thresholds | `0.75` → 75% chance a random positive scores higher than a random negative (0.5 = random, 1 = perfect) |

Pass `model.predict_proba(X)[:, 1]` or `model.decision_function(X)`, **not** `predict()` labels.

</details>

**ML5.11** Silhouette score for clustering?

<details>
<summary>Answer</summary>

| Task | Command | Purpose | Output |
|---|---|---|---|
| Silhouette | `from sklearn.metrics import silhouette_score`<br>`silhouette_score([[1, 1], [1, 2], [8, 8], [8, 9]], [0, 0, 1, 1])` | How close points are to their own cluster vs the nearest other one (range −1 to 1) | `≈ 0.90` → well-separated clusters |

Needs at least 2 clusters (and fewer clusters than points), which is why "multiple clusters" is required.

</details>

### 6. Validate and tune

Tuning uses **only** `X_train, y_train`. The test set is used once, at the very end.

**ML6.1** Five-fold cross-validation of a pipeline?

<details>
<summary>Answer</summary>

| Task | Command | Purpose | Output |
|---|---|---|---|
| 5-fold CV | `from sklearn.model_selection import cross_val_score`<br>`scores = cross_val_score(pipe, X_train, y_train, cv=5, scoring="accuracy")`<br>`scores.mean()` | Train/validate on 5 different splits → more reliable estimate | `[0.82, 0.85, 0.80, 0.84, 0.83]`, mean `0.828` |

</details>

**ML6.2** Configure GridSearchCV?

<details>
<summary>Answer</summary>

| Task | Command | Purpose | Output |
|---|---|---|---|
| Grid search | `from sklearn.model_selection import GridSearchCV`<br>`grid = {"model__C": [0.1, 1, 10]}`<br>`search = GridSearchCV(pipe, grid, cv=5, scoring="f1")` | Try **every** combination listed | 3 combos × 5 folds = 15 fits |

`model__C` = step name `model` + two underscores + parameter `C`.

</details>

**ML6.3** Configure RandomizedSearchCV?

<details>
<summary>Answer</summary>

| Task | Command | Purpose | Output |
|---|---|---|---|
| Random search | `from sklearn.model_selection import RandomizedSearchCV`<br>`from scipy.stats import loguniform`<br>`search = RandomizedSearchCV(pipe, {"model__C": loguniform(1e-3, 1e2)}, n_iter=20, cv=5, random_state=42)` | Sample 20 random combos; faster than grid search when the space is large | 20 combos × 5 folds = 100 fits |

</details>

**ML6.4** Run the hyperparameter search on training data?

<details>
<summary>Answer</summary>

| Task | Command | Purpose | Output |
|---|---|---|---|
| Run search | `search.fit(X_train, y_train)` | Cross-validate each combo, then refit the best one on all of `X_train` | Fitted search object; `search.best_score_` → e.g. `0.84` |

</details>

**ML6.5** Get the best fitted pipeline with `best_estimator_`?

<details>
<summary>Answer</summary>

| Task | Command | Purpose | Output |
|---|---|---|---|
| Best model | `best = search.best_estimator_`<br>`best.score(X_test, y_test)` | Ready-to-use fitted pipeline; evaluate it once on the test set | `Pipeline(steps=[('prep', ...), ('model', LogisticRegression(C=1))])`; test score e.g. `0.83` |

</details>

**ML6.6** Get the best hyperparameters with `best_params_`?

<details>
<summary>Answer</summary>

| Task | Command | Purpose | Output |
|---|---|---|---|
| Best params | `search.best_params_` | See which settings won | `{'model__C': 1}` |

</details>

### 7. Save, load, use, and monitor

**ML7.1** Save a fitted pipeline with `joblib.dump()`?

<details>
<summary>Answer</summary>

| Task | Command | Purpose | Output |
|---|---|---|---|
| Save | `import joblib`<br>`joblib.dump(pipe, "model.joblib")` | Save preprocessing **and** model together so production uses identical steps | `['model.joblib']` |

</details>

**ML7.2** Load a trusted saved pipeline with `joblib.load()`?

<details>
<summary>Answer</summary>

| Task | Command | Purpose | Output |
|---|---|---|---|
| Load | `pipe = joblib.load("model.joblib")` | Reuse the trained pipeline without retraining | `Pipeline(steps=[...])` |

Only load files you trust: loading a joblib/pickle file can run arbitrary code. Use the same scikit-learn version you saved with.

</details>

**ML7.3** Predict on new records with the loaded pipeline?

<details>
<summary>Answer</summary>

| Task | Command | Purpose | Output |
|---|---|---|---|
| Predict new | `new = pd.DataFrame([{"age": 30, "city": "Pune", "income": 70}])`<br>`pipe.predict(new)` | Raw input goes in; the pipeline handles all preprocessing | `array([1])` |

Column names must match the training columns.

</details>

**ML7.4** Compare production and training feature distributions to detect data drift?

<details>
<summary>Answer</summary>

| Task | Command | Purpose | Output |
|---|---|---|---|
| Numeric drift | `from scipy.stats import ks_2samp`<br>`ks_2samp(train["income"], prod["income"])` | Test whether the two distributions differ | `statistic=0.31, pvalue=0.002` → p < 0.05 → likely drift |
| Category drift | `train["city"].value_counts(normalize=True)` vs `prod["city"].value_counts(normalize=True)` | Compare category shares | Delhi `0.60 → 0.30` → shift |
| Quick check | `train.describe()` vs `prod.describe()` | Compare means and ranges | mean income `60 → 85` |

</details>

**ML7.5** Evaluate production predictions against actual outcomes?

<details>
<summary>Answer</summary>

| Task | Command | Purpose | Output |
|---|---|---|---|
| Live performance | `f1_score(actual_labels, logged_predictions)` | Once true labels arrive, compute the same metric as at deployment | test F1 `0.84` → this month `0.71` |
| Trend over time | `logs.groupby("week").apply(lambda g: f1_score(g["actual"], g["pred"]))` | Spot gradual decline | weekly F1 values |

A clear drop means it's time to investigate the data or retrain.

</details>
