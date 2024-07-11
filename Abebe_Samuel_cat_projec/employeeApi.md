# Employee data storage

## employees.json
The id is unique.
```json
 [
 {
        "number": 1,
        "name": "Lion II",
        "breed": "sillycat",
        "length": 30,
        "yearOfBirth": 2017
    },
    {
        "number": 3,
        "name": "Hairball",
        "breed": "domesticus",
        "length": 32,
        "yearOfBirth": 2011
    },
    {
        "number": 6,
        "name": "Fatzo",
        "breed": "alley cat",
        "length": 40,
        "yearOfBirth": 2000
    }
]
```

## JsonStorageEngine

Storage engine is general solution for json storage. 

### public API (methods of Datastorage class)

#### dataStorageLayer.js

-  getAll()
   - returns an array of all employees / []

-  get(value, key)
   - returns an employee objects in an array / []

-  insert(newItem)
   - returns INSERT_OK / NOT_INSERTED / ALREADY_IN_USE

-  remove(value)
   - returns REMOVE_OK / NOT_FOUND / NOT_REMOVED

-  getter CODES
   - returns an array of status codes 

-  getter TYPES
   -  returns the types of status codes 

-  getter PRIMARY_KEY
   - unique key for object

- getter KEYS
  - return an array of keys (field names) in the objects / []
  - searches keys from all objects 
  - key is added to the array only once
  - for example key of employees.json are 
    - ["id","firstname","lastname","department","salary"]


#### Format of the returned json data

All GET methods return on array of objects on an empty array.
No status messages returned

##### Example 

```js
get('River','lastname')
```
returns

```json
[
    {
        "id": 2,
        "firstname": "Matt",
        "lastname": "River",
        "department": "ict",
        "salary": 4000
    },
    {
        "id": 3,
        "firstname": "Mary",
        "lastname": "River",
        "department": "ict",
        "salary": 5000
    }
]
```
and

```js
get(1,'id')
```
returns

```json
[
    {
        "id":1,
        "firstname":"Leila",
        "lastname":"Hökki",
        "department":"ict",
        "salary":4000
    }
]
```

All post methods return a ststus object.

#### Status codes and messages

```js
const CODES={
    PROGRAM_ERROR:0,
    NOT_FOUND:1,
    INSERT_OK:2
    ...
}
```
```js
const TYPES = {
    ERROR: 'error',
    INFO:'info'
}
```

The format of an status message is:
```js
const MESSAGES={
    PROGRAM_ERROR: () => ({
        message: 'Sorry! Error in the program',
        code: CODES.PROGRAM_ERROR,
        type: TYPES.ERROR
    }),
    NOT_FOUND: (key, value) => ({
        message: `No resource found with ${key} ${value}`,
        code: CODES.NOT_FOUND,
        type: TYPES.INFO
    }),
    INSERT_OK: (key, value ) => ({
        message: `Resource with ${key} ${value} was inserted`,
        code: CODES.INSERT_OK,
        type: TYPES.INFO
    })
}
```
status types are `ERROR` or `INFO`

#### Example

```js
remove(10)
```
returns
```js
{
  message: 'No resource found with id 10',
  code: 1,
  type: 'info'
}
```

### private API.


#### readerWriter.js

-   readStorage()
    -   returns an array of employees / []
-   writeStorage(data)
    -   returns true / false

#### storageLayer.js
-   getAllFromStorage()
    -   returns an array of employees / []
-   getFromStorage(value,key)
    -   default key will be primary_key
    -   returns an object matching the criterion / []
-   addToStorage(newEmployee)
    -   returns true/false
-   removeFromStorage(id)
    -   returns true / false
-   getKeys()
    -   returns all keys (once) in an array / []
-   primary_key
    -   return the primary_key from storageConfig



## Storage folder

This folder contains the files that are specific to the actual storage

#### storageConfig.json

```json
{
    "storageFile": "employees.json",
    "adapterFile": "personAdapter.js",
    "primary_key":"id"
}
```

#### adapter file

Adapter casts numbers from string to number.

#### Example
```js
function adapt(item){
    return {
        id: +item.id, // also id:Number(item.id)
        firstname:item.firstname,
        lastname:item.lastname,
        department: item.department,
        salary: +item.salary
    };
}
```
or using Object.assign
```js
function adapt(item){
    return Object.assign(item, {
        id: +item.id, 
        salary: +item.salary 
    });
}
```

or with "deep copy" especially if your object has multiple levels
```js
function adapt(item) {
    const tempItem = JSON.parse(JSON.stringify(item));
    tempItem.id = +tempItem.id;
    tempItem.salary = +tempItem.salary;
    return tempItem;
}
```

## Server config

### config.json
```json
{
  "port":3000,
  "host":"localhost",
  "storageEngine":{
    "folder":"jsonStorageEngine",
    "dataStorageFile":"dataStorageLayer.js"
  },
  "storage":{
    "folder":"employeeRegister",
    "storageConfigFile":"storageConfig.json"
  }
}
```