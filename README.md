# json-schema-to-ts_TS2589

### `geocode.schema.ts`
[Jump](./src/geocode.schema.ts)  
Illustration of improper conditional type inference using [json-schema-to-ts](https://github.com/ThomasAribart/json-schema-to-ts#ifthenelse).

### `itinerary.schema.ts`
[Jump](./src/itinerary.schema.ts)  
Illustration of "**Type instantiation is excessively deep and possibly infinite. ts(2589)**" with [json-schema-to-ts](https://github.com/ThomasAribart/json-schema-to-ts#ifthenelse).  
Conditional types are also wrongly inferred.

___

Note that manipulating (adding or removing some) conditional blocks in schemas cand lead to a TS2589 in `geocode.schema.ts`.  
TS2589 occurs when the TypeScript compiler try to instantiate types, but get blocked because it's taking too long ([too many operations to succeed](https://github.com/microsoft/TypeScript/issues/34933#issuecomment-878728142)).  
This issue has already been pointed out on `json-schema-to-ts` : [link](https://github.com/ThomasAribart/json-schema-to-ts/issues/20#issuecomment-831635569).
