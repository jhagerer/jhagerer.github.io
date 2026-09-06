---
title: "LLM Coding Concepts: Static Typing, Structured Output, and asyncio"
subtitle: "Python patterns that carry a professional LLM codebase"
date: 2026-09-06 16:00:00 +0200
tags: [nlp-and-data-concepts]
---

Modern LLM applications require robust, type-safe code that can efficiently handle
structured data and asynchronous operations. This article explores essential Python
concepts that form the foundation of professional LLM development, from basic type
annotations to advanced async patterns. Understanding these concepts is crucial for
building reliable AI systems that can validate inputs, generate structured outputs,
and scale effectively. Whether you're creating tool-calling agents or processing large
datasets, these patterns will help you write cleaner, more maintainable code.

### Table of Contents

- [Type annotations and static typing with mypy](#type-annotations-and-static-typing-with-mypy)
- [LLM structured output with Pydantic and JSON schema](#llm-structured-output-with-pydantic-and-json-schema)
- [Repository structure](#repository-structure)
- [Asynchronous programming with asyncio](#asynchronous-programming-with-asyncio)
- [Create Pydantic BaseModels for Python functions](#create-pydantic-basemodels-for-python-functions)

The design patterns for LLM agents and workflows that benefit from static typing, LLM
structured output, and asynchronous programming are laid out well in
[LLM Workflows: From Automation to AI Agents](https://shawhin.medium.com/llm-workflows-from-automation-to-ai-agents-a62f96a0f89a)
by Shaw Talebi.

## Type annotations and static typing with mypy

Here's how to define a basic function with type annotations for parameters and return
value:

```python
def add_numbers(a: int, b: int) -> int:
    return a + b
```

You can use complex nested types like dictionaries containing lists for more
sophisticated data structures:

```python
def process_data(data: dict[str, list[int]]) -> dict[str, float]:
    return {key: sum(values) / len(values) for key, values in data.items()}
```

The typing module provides advanced types like `TypedDict` for structured dictionaries
and `Literal` for restricted string values:

```python
from typing import Any, Literal, TypedDict

class UserConfig(TypedDict):
    name: str
    age: int
    role: Literal["admin", "user", "guest"]

def process_user(config: UserConfig, metadata: Any) -> str:
    return f"{config['name']} ({config['role']})"
```

You can run type checking using mypy directly on files or through pre-commit hooks:

```bash
mypy <filepath>     # calls mypy on file
uv run pre-commit   # calls mypy and ruff in the project
```

## LLM structured output with Pydantic and JSON schema

Pydantic `BaseModel` classes provide data validation and parsing from JSON strings:

```python
from pydantic import BaseModel

class Person(BaseModel):
    name: str
    age: int
    email: str

# Parsing
json_data = '{"name": "Anna", "age": 30, "email": "anna@example.com"}'
person = Person.model_validate_json(json_data)
```

Pydantic models can generate JSON schemas for API documentation and validation:

```python
from pydantic import BaseModel

class Person(BaseModel):
    name: str
    age: int
    email: str

# Generate schema
schema = Person.model_json_schema()
print(schema)
# {'type': 'object', 'properties': {'name': {'type': 'string'}, ...}
```

In order to guide the LLM on the extraction, you need to formulate prompts for each
field separately. In ontologies, you call these the competency questions:

```python
from pydantic import BaseModel, Field

class Person(BaseModel):
    """A person is a human being with the denoted attributes."""

    name: str = Field(..., description="Which is the name of the person?")
    age: int = Field(..., description="Which is the age of the person?")
    email: str = Field(..., description="Which is the email of the person?")

# Generate schema
schema = Person.model_json_schema()
print(schema)
# {'type': 'object', 'properties': {'name': {'type': 'string'}, ...}
```

Snowflake Cortex Complete returns unstructured text when no schema is provided:

```python
import snowflake.cortex as cortex

response = cortex.Complete(
    model="llama3.1-8b",
    prompt="Describe a person named Max:",
    session=session
)
print(response)  # Unstructured text
```

Adding a JSON schema to Snowflake Cortex Complete ensures structured, validated output:

```python
import snowflake.cortex as cortex

response = cortex.Complete(
    model="llama3.1-8b",
    prompt="Describe a person named Max:",
    json_schema=Person.model_json_schema(),
    session=session
)
person = Person.model_validate_json(response)
```

## Repository structure

```text
project-name/
├── data/
│   ├── all_data.duckdb
│   ├── raw/
│   │   ├── document01.pdf
│   │   └── document02.pdf
│   ├── transformed/
│   │   ├── 01_extracted_texts.parquet
│   │   └── 02_texts_with_markup.parquet
├── llm_ops/
│   ├── helpers/
│   ├── steps/
│   │   ├── processing_step_1
│   │   │   ├── config.py
│   │   │   ├── base_model.py
│   │   │   └── run.py
│   │   └── processing_step_2 ....
│   └── workflows/
│      └── workflow_1
│         └── run.py
├── data_ops/
│   ├── helpers/
│   └── transformations/
│      ├── 01_extract_texts.py
│      └── 02_add_markup_to_texts.py
├── rest_api/
└── tests/
```

## Asynchronous programming with asyncio

Async functions are defined with the `async` keyword and must be awaited when called:

```python
# sync function definition
def sync_function(x: int) -> int:
    return x * 2

# Async function definition
async def async_function(x: int) -> int:
    import asyncio
    await asyncio.sleep(0.1)
    return x * 2
```

Async functions can be called from other async functions using `await`, or from a sync
context using `asyncio.run()`:

```python
async def main():
    # from an async function
    result = await async_function(5)
    print(result)

# From normal sync context
if __name__ == "__main__":
    import asyncio
    asyncio.run(main())
```

You can call synchronous functions from async contexts using `asyncio.to_thread()` to
avoid blocking:

```python
async def async_caller():
    # With asyncio.to_thread() for sync functions
    result1 = await asyncio.to_thread(sync_function, 5)
    return result1
```

## Create Pydantic BaseModels for Python functions

Given that we have tool functions defined in Python which we want to make available to
an LLM agent, we need to create the structured output information of the function
signatures and parameter lists as Pydantic BaseModels and JSON schemas. The following
code should serve as a template for the respective conversion.

First we show the BaseModel of an `add` function and how its JSON schema looks like:

```python
from pydantic import BaseModel, Field, create_model, ConfigDict
import json

class add(BaseModel):
    """Function add docstring."""
    x: int
    y: int

json_schema_1 = add.model_json_schema()
print(json.dumps(json_schema_1, indent=2))
```

Output:

```json
{
  "description": "Function add docstring.",
  "properties": {
    "x": {
      "title": "X",
      "type": "integer"
    },
    "y": {
      "title": "Y",
      "type": "integer"
    }
  },
  "required": [
    "x",
    "y"
  ],
  "title": "add",
  "type": "object"
}
```

Now, we create actual implementations of the add function. Further, we implement a
conversion from the function to an according dynamically created Pydantic BaseModel
based on the function signature. We demonstrate that the JSON schema between the
manually and dynamically generated BaseModels are identical.

```python
from typing import Callable, Union
import inspect

def add(x: int, y: int) -> int:
    """Function add docstring."""
    return x + y

def subtract(x: int, y: int) -> int:
    """Function subtract docstring."""
    return x - y

def get_basemodel_from_function(func: Callable) -> type[BaseModel]:
    func_name = func.__name__
    docstr = inspect.getdoc(func)
    sig = inspect.signature(func)
    params = {param.name: (param.annotation, Field(...)) for param in sig.parameters.values()}
    Model = create_model(func_name, **params)
    Model.__doc__ = docstr
    return Model

FuncModel = get_basemodel_from_function(add)
json_schema_2 = FuncModel.model_json_schema()
assert json_schema_1 == json_schema_2
# assert runs through successfully -> JSON schemas are identical
```

Eventually, we need a BaseModel which incorporates all tool calls, such that we can
pass it to the LLM as structured output JSON schema:

```python
def create_tools(tools: list[Callable]) -> type[BaseModel]:
    tool_models = tuple(get_basemodel_from_function(x) for x in tools)
    type_annotation = Union[tool_models]
    params = {"tools": (type_annotation, Field(...))}
    config = ConfigDict(arbitrary_types_allowed=True)
    Model = create_model("ToolCalls", __config__=config, **params)
    return Model

ToolCalls = create_tools([add, subtract])
json_schema_3 = ToolCalls.model_json_schema()
print(json.dumps(json_schema_3, indent=2))
```

Output:

```json
{
  "$defs": {
    "add": {
      "description": "Function add docstring.",
      "properties": {
        "x": {
          "title": "X",
          "type": "integer"
        },
        "y": {
          "title": "Y",
          "type": "integer"
        }
      },
      "required": [
        "x",
        "y"
      ],
      "title": "add",
      "type": "object"
    },
    "subtract": {
      "description": "Function subtract docstring.",
      "properties": {
        "x": {
          "title": "X",
          "type": "integer"
        },
        "y": {
          "title": "Y",
          "type": "integer"
        }
      },
      "required": [
        "x",
        "y"
      ],
      "title": "subtract",
      "type": "object"
    }
  },
  "properties": {
    "tools": {
      "anyOf": [
        {
          "$ref": "#/$defs/add"
        },
        {
          "$ref": "#/$defs/subtract"
        }
      ],
      "title": "Tools"
    }
  },
  "required": [
    "tools"
  ],
  "title": "ToolCalls",
  "type": "object"
}
```
