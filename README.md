# ValidatorJs

The ValidatorJs library makes data validation in JavaScript very easy in both the browser and Node.js. This library was
forked from [ValidatorJs](https://github.com/mikeerickson/validatorjs) to re-write in typescript to add more rules and
features.

## Why use ValidatorJs?

-   Works in both the browser and Node.
-   Readable and declarative validation rules.
-   Error messages with multilingual support.
-   CommonJS/Browserify support.
-   ES6 support.
-   Re-written in Typescript

### Basic Usage

```js
const validation = new Validator(rules, options);
```

**rules** {Object} - Validation rules

**options** {Object} - Optional custom **options** {errors:\{[nameofRule]:Errors}}

#### Example 1 - Passing Validation

```js
let data = {
    name: 'John',
    email: 'johndoe@gmail.com',
    age: 28,
};

let rules = {
    name: ['required'],
    email: ['requried', 'email'],
    age: [{ min: 18 }],
};

let validation = new Validator(rules);

validation.passes(data); // {state:true,data:{'name': 'John','email': 'johndoe@gmail.com','age': 28}}
validation.getErrors(data); // {}
```

### the result of passes function

#### if the state is true

**data** the valid data type that you can use

#### if the state is false

**errors** it as an object the define the the paths of the errors ant array of all the error messages

```js
{
    [errorPaths]:[
        {
            value:any,//the value of the path,
            message:string,//the description of the error
        }
    ]
}
```

To apply validation rules to the _data_ object, use the same object key names for the _rules_ object.

#### Example 2 - Failing Validation

```js
let validation = new Validator({
    name: [{ max: 3 }],
    email: ['required', 'email'],
});

validation.passes({
    name: 'D',
    email: 'not an email address.com',
}); // {'errors': {'email': [{'message': 'THIS IS NOT A VALID EMAIL', 'value': 'not an email address.com'}]}, 'state': false}

validation.getErrors({
    name: 'D',
    email: 'not an email address.com',
}); //{'email': [{'message': 'THIS IS NOT A VALID EMAIL', 'value': 'not an email address.com'}]}
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
};
```

We could declare our validation rules as follows:

```js
let nested = {
    name: ['required'],
    bio: {
        age: [{ min: 18 }],
        education: {
            primary: ['string'],
            secondary: ['string'],
        },
    },
};
```

you can declare self validation for the path by adding . to the object:

```js
let nested = {
    name: ['required'],
    bio: {
        '.': ['required'], //here you can add some rules to control bio path
        age: [{ min: 18 }],
        education: {
            primary: ['string'],
            secondary: ['string'],
        },
    },
};
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
};
```

We could declare our validation rules as follows:

```js
let rules = {
    users: [
        {
            name: ['string'],
            bio: {
                age: [{ min: 18 }],
                primary: ['string'],
                secondary: ['string'],
            },
        },
        'array',
    ],
};
```

Or if you want the data as a map object

```js
let rules = {
    users: [
        {
            name: ['string'],
            bio: {
                age: [{ min: 18 }],
                primary: ['string'],
                secondary: ['string'],
            },
        },
        'object', //here you can specify the type of the object if it is map (object) or an array (array)
    ],
};
```

you can add some rules to the users path by adding the rules after type element

```js
let rules = {
    users: [
        {
            name: ['string'],
            bio: {
                age: [{ min: 18 }],
                primary: ['string'],
                secondary: ['string'],
            },
        },
        'object',
        ['required', { max: 20 }], // here you can specify the object
    ],
};
```

you can specify some exceptions of the rules
by adding the exception elemnts indexs

```js
let rules = {
    users: [
        {
            name: ['string'],
            bio: {
                age: [{ min: 18 }],
                primary: ['string'],
                secondary: ['string'],
            },
        },
        'object',
        { '.': ['required', { max: 20 }], 0: ['string'], 1: ['integer'] },
    ],
};
```

### Available Rules

Validation rules do not have an implicit 'required'. If a field is _undefined_ or an empty string, it will pass
validation. If you want a validation to fail for undefined or '', use the _required_ rule.

#### accepted

The field under validation must be yes, on, 1 or true. This is useful for validating 'Terms of Service' acceptance.

#### after:date

The field under validation must be after the given date. -->

#### before:date

The field under validation must be before the given date. -->

#### date:date

The field under validation must be after or equal to the given field

#### alpha

The field under validation must be entirely alphabetic characters.

#### alpha_dash

The field under validation may have alpha-numeric characters, as well as dashes and underscores.

#### alpha_num

The field under validation must be entirely alpha-numeric characters.

#### array

The field under validation must be an array.

#### min,max

The field under validation must have a size between the given min and max. Strings, numerics, and files are evaluated in
the same fashion as the size rule.

#### boolean

The field under validation must be a boolean value of the form `true`, `false`, `0`, `1`, `'true'`, `'false'`, `'0'`
, `'1'`,

#### confirmed

The field under validation must have a matching field of foo_confirmation. For example, if the field under validation is
password, a matching password_confirmation field must be present in the input.

#### isDate

The field under validation must be a valid date format which is acceptable by Javascript's `Date` object.

#### different:attribute

The given field must be different than the field under validation.

#### email

The field under validation must be formatted as an e-mail address.

#### in:[values]

The field under validation must be included in the given list of values. The field can be an array or string.

#### integer

The field under validation must have an integer value.

#### max:value

Validate that an attribute is no greater than a given size

_Note: Maximum checks are inclusive._

#### Example 1 - Max validation

```js
let rules = {
    phone: ['required', 'numeric', { max: 11 }],
};
let input = {
    phone: '01234567890',
};
// passes: true
```

#### Example 2 - Max validation

```js
let rules = {
    phone: ['integer', { max: 16 }],
};
let input = {
    phone: '18',
};
// passes: false
```

#### min:value

Validate that an attribute is at least a given size.

_Note: Minimum checks are inclusive._

#### Example 1 - Min validation

```js
let rules = {
    phone: ['required', 'numeric', { min: 11 }],
};
let input = {
    phone: '01234567890',
};
// passes: true
```

#### Example 2 - Min validation

```js
let rules = {
    phone: ['integer', { min: 11 }],
};
let input = {
    phone: '18',
};
// passes: false
```

#### not_in:[array of string]

The field under validation must not be included in the given list of values.

#### numeric

Validate that an attribute is numeric. The string representation of a number will pass.

#### required

Checks if the length of the String representation of the value is >

#### required_if:{path:string , value:any}

The field under validation must be present and not empty if the anotherfield field is equal to any value.

#### required_unless:{path:string , value:any}

The field under validation must be present and not empty unless the anotherfield field is equal to any value.

#### required_with:[paths]

The field under validation must be present and not empty only if any of the other specified fields are present.

#### required_with_all:[paths]

The field under validation must be present and not empty only if all of the other specified fields are present.

#### required_without:[paths]

The field under validation must be present and not empty only when any of the other specified fields are not present.

#### required_without_all:[paths]

The field under validation must be present and not empty only when all of the other specified fields are not present.

#### string

The field under validation must be a string.

#### url

Validate that an attribute has a valid URL format

#### regex:pattern

The field under validation must match the given regular expression.

#### Example 3 - Regex validation

```js
let validation = new Validator({
    name: [
        'required',
        {
            min: 3,
            max: 3,
        },
    ],
    salary: [
        'required',
        { regex: /^(?!0\\.00)\\d{1,3}(,\\d{3})*(\\.\\d\\d)?$/ },
    ],
    yearOfBirth: ['required', { regex: /^(19|20)[\\d]{2,2}$/ }],
});

validation.passes({
    name: 'Doe',
    salary: '10,000.00',
    yearOfBirth: '1980',
}); // {state:true,data:{name: 'Doe',salary: '10,000.00',yearOfBirth: '1980'}}
```

#### Example 4 - Type Checking Validation

```js
let validation = new Validator({
    age: ['required', { in: [29, 30] }],
    name: [{ required_if: { path: 'age', value: 30 } }],
});

validation.passes({
    age: 30,
    name: '',
}); // {state:false}
```

### Register Custom Validation Rules

```js
Validator.register(key, nameOrFunName, callbackFn, errorsObj);
```

**name** {String} - The name of the rule that will be stored in theRules and must be unique.

**nameOrFunName** {String|(val:unknown)=>boolean} - The name of the rule or the the function that will check if the data pattern belongs to it.

**callbackFn** {Function} - Returns a string to represent a failed state and undefined to represent a successful.
\<Data>(value:unknown ,data:Data ,path:string,input:unknown,lang:LangTypes,errors:MessageStore\<Data> )=>string|undefined

#### Custom Attribute Names

## Validate One Value

```js
const validator = new Validator({});
validator.validate(value, ruleData, lang);
```

**value** {unknown} - The value taht you want to validate.

**ruleData** {RuleNames} - The rule description that you want to validate like 'string' or {min:20}.

**lang** {LangTypes} optional :the displaying message language

### Asynchronous Validation

Register an asynchronous rule which accepts a `passes` callback:

```js
Validator.registerAsync(
    'username_available',
    'username_available',
    async function (username, data, path, input, lang, errors) {}
);
```

Then call your validator using `checkAsync` passing `fails` and `passes` callbacks like so:

```js
let validator = new Validator({
    username: ['required', 'min:3', 'username_available'],
});

validator
    .asyncPasses({ username: 'username' })
    .then((res) => {})
    .catch((err) => {});
validator
    .asyncGetErrors({ username: 'username' })
    .then((res) => {})
    .catch((err) => {});
```

### Language Support

Error messages are in English by default. To include another language in the browser, reference the language file in a script tag and call `Validator.useLang('lang_code')`.

```html
<script src="dist/validator.js"></script>
<script src="dist/lang/ru.js"></script>
<script>
  Validator.useLang('es');
</script>
```

In Node, it will automatically pickup on the language source files.

```js
let Validator = require('validatorjs');
Validator.useLang('ru');
```

You can add your own custom language in initialization by add your custom errors in the options:

```js
const validator = new Validator(
    {},
    {
        errors: {
            required: { en: 'The :attribute field is required.' },
        },
    }
);
```

Get the raw object of messages for the given language:

```js
validator.errors.required;
```

Switch the default language used by the validator:

```js
Validator.useLang('lang_code');
```
Get the default language being used:

```js
Validator.getDefaultLang(); // returns e.g. 'en'
```

get specific errors message by adding lang attribute to the passes or getErrors function

```js
validator.getErrors(data, 'lang_code');
```

Override default messages for language:
```js
let messages = Validator.Rules.required
messages.en="my new custom message for required rule"
```

### Credits

validatorjs created by Imam Ashour

E-Mail: [workemam54637@gmail.com](mailto:workemam54637@gmail.com)
Website: [codedungeon.io](http://emam546.github.io)