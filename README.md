# ValidatorJs
The ValidatorJs library makes data validation in JavaScript very easy in both the browser and Node.js. This library was
forked from [ValidatorJs](https://github.com/mikeerickson/validatorjs) to re-write in typescript to add more rules and
features.

## Why use ValidatorJs?

- Works in both the browser and Node.
- Readable and declarative validation rules.
- Error messages with multilingual support.
- CommonJS/Browserify support.
- ES6 support.
- Re-written in Typescript

### Basic Usage

```js
const validation = new Validator(data, rules, options)
```

**data** {Object} - The data you want to validate

**rules** {Object} - Validation rules

**options** {Object} - Optional custom **options** to return


#### Example 1 - Passing Validation

```js
let data = {
  name: 'John',
  email: 'johndoe@gmail.com',
  age: 28,
}

let rules = {
  name: 'required',
  email: 'required|email',
  age: 'min:18',
}

let validation = new Validator(data, rules)

validation.passes() // true
validation.fails() // false
```

To apply validation rules to the _data_ object, use the same object key names for the _rules_ object.

#### Example 2 - Failing Validation

```js
let validation = new Validator(
  {
    name: 'D',
    email: 'not an email address.com',
  },
  {
    name: 'size:3',
    email: 'required|email',
  },
)

validation.fails() // true
validation.passes() // false

```

### Nested Rules

Nested objects can also be validated. There are two ways to declare validation rules for nested objects. The first way
is to declare the validation rules with a corresponding nested object structure that reflects the data. The second way
is to declare validation rules with flattened key names. For example, to validate the following data:

```js
let data = {
  name: 'John',
  bio: {
    age: 28,
    education: {
      primary: 'Elementary School',
      secondary: 'Secondary School',
    },
  },
}
```

We could declare our validation rules as follows:

```js
let nested = {
  name: 'required',
  bio: {
    age: 'min:18',
    education: {
      primary: 'string',
      secondary: 'string',
    },
  },
}

// OR

let flattened = {
  name: 'required',
  'bio.age': 'min:18',
  'bio.education.primary': 'string',
  'bio.education.secondary': 'string',
}
```

### WildCards Rules

WildCards can also be validated.

```js
let data = {
  users: [
    {
      name: 'John',
      bio: {
        age: 28,
        education: {
          primary: 'Elementary School',
          secondary: 'Secondary School',
        },
      },
    },
  ],
}
```

We could declare our validation rules as follows:

```js
let rules = {
  'users.*:array.name': 'required',
  'users.*:array.bio.age': 'min:18',
  'users.*:array.bio.education.primary': 'string',
  'users.*:array.bio.education.secondary': 'string',
}
```

### Available Rules

Validation rules do not have an implicit 'required'. If a field is _undefined_ or an empty string, it will pass
validation. If you want a validation to fail for undefined or '', use the _required_ rule.

#### accepted

The field under validation must be yes, on, 1 or true. This is useful for validating "Terms of Service" acceptance.

<!-- #### after:date

The field under validation must be after the given date. -->

<!-- #### after_or_equal:date

The field under validation must be after or equal to the given field -->

#### alpha

The field under validation must be entirely alphabetic characters.

#### alpha_dash

The field under validation may have alpha-numeric characters, as well as dashes and underscores.

#### alpha_num

The field under validation must be entirely alpha-numeric characters.

#### array

The field under validation must be an array.

<!-- #### before:date

The field under validation must be before the given date. -->

<!-- #### before_or_equal:date

The field under validation must be before or equal to the given date. -->

#### limit:min,max

The field under validation must have a size between the given min and max. Strings, numerics, and files are evaluated in
the same fashion as the size rule.

#### boolean

The field under validation must be a boolean value of the form `true`, `false`, `0`, `1`, `'true'`, `'false'`, `'0'`
, `'1'`,

#### confirmed

The field under validation must have a matching field of foo_confirmation. For example, if the field under validation is
password, a matching password_confirmation field must be present in the input.

#### date

The field under validation must be a valid date format which is acceptable by Javascript's `Date` object.

#### digits:value

The field under validation must be numeric and must have an exact length of value.

<!-- #### digits_between:min,max

The field under validation must be numeric and must have length between given min and max. -->

#### different:attribute

The given field must be different than the field under validation.

#### email

The field under validation must be formatted as an e-mail address.

#### hex

The field under validation should be a hexadecimal format. Useful in combination with other rules, like `hex|size:6` for
hex color code validation.

#### in:foo,bar,...

The field under validation must be included in the given list of values. The field can be an array or string.

#### integer

The field under validation must have an integer value.

#### max:value

Validate that an attribute is no greater than a given size

_Note: Maximum checks are inclusive._

#### Example 1 - Max validation

```js
let rules = {
  phone: 'required|numeric|max:11',
}
let input = {
  phone: '01234567890',
}
// passes: true
```

#### Example 2 - Max validation

```js
let rules = {
  phone: 'integer|max:16',
}
let input = {
  phone: '18',
}
// passes: false
```

#### min:value

Validate that an attribute is at least a given size.

_Note: Minimum checks are inclusive._

#### Example 1 - Min validation

```js
let rules = {
  phone: 'required|numeric|min:11',
}
let input = {
  phone: '01234567890',
}
// passes: true
```

#### Example 2 - Min validation

```js
let rules = {
  phone: 'integer|min:11',
}
let input = {
  phone: '18',
}
// passes: false
```

#### not_in:foo,bar,...

The field under validation must not be included in the given list of values.

#### numeric

Validate that an attribute is numeric. The string representation of a number will pass.

#### present

The field under validation must be present in the input data but can be empty.

#### required

Checks if the length of the String representation of the value is >

#### required_if:another_field,value

The field under validation must be present and not empty if the anotherfield field is equal to any value.

#### required_unless:another_field,value

The field under validation must be present and not empty unless the anotherfield field is equal to any value.

#### required_with:foo,bar,...

The field under validation must be present and not empty only if any of the other specified fields are present.

#### required_with_all:foo,bar,...

The field under validation must be present and not empty only if all of the other specified fields are present.

#### required_without:foo,bar,...

The field under validation must be present and not empty only when any of the other specified fields are not present.

#### required_without_all:foo,bar,...

The field under validation must be present and not empty only when all of the other specified fields are not present.

#### string

The field under validation must be a string.

#### url

Validate that an attribute has a valid URL format

#### regex:pattern

The field under validation must match the given regular expression.

**Note**: When using the `regex` pattern, it may be necessary to specify rules in an array instead of using pipe
delimiters, especially if the regular expression contains a pipe character. For each backward slash that you used in
your regex pattern, you must escape each one with another backward slash.

#### Example 3 - Regex validation

```js
let validation = new Validator(
  {
    name: 'Doe',
    salary: '10,000.00',
    yearOfBirth: '1980',
  },
  {
    name: 'required|size:3',
    salary: ['required', 'regex:/^(?!0\\.00)\\d{1,3}(,\\d{3})*(\\.\\d\\d)?$/'],
    yearOfBirth: ['required', 'regex:/^(19|20)[\\d]{2,2}$/'],
  },
)

validation.fails() // false
validation.passes() // true
```

#### Example 4 - Type Checking Validation

```js
let validation = new Validator(
  {
    age: 30,
    name: '',
  },
  {
    age: ['required', { in: [29, 30] }],
    name: [{ required_if: ['age', 30] }],
  },
)

validation.fails() // true
validation.passes() // false
```

### Register Custom Validation Rules

```js
Validator.register(name, callbackFn)
```

**name** {String} - The name of the rule.

**callbackFn** {Function} - Returns a boolean to represent a successful or failed validation.









### Custom Attribute Names

#### Using config for custom attribute name

```js
const validator = new Validator(
  { form: { name: null } },
  { form: { name: 'required', age: 'required' } },
  {
    customAttributes: { form: { name: 'Username' } },
    customMessages: {
      required: 'The :attribute need to be filled.',
    },
  },
)
if (validator.fails()) {
  validator.errors.first('form.name') // "The Userame need to be filled."
}
```

