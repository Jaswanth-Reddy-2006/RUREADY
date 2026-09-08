
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model OralSession
 * 
 */
export type OralSession = $Result.DefaultSelection<Prisma.$OralSessionPayload>
/**
 * Model OralQuestion
 * 
 */
export type OralQuestion = $Result.DefaultSelection<Prisma.$OralQuestionPayload>
/**
 * Model OralChatHistory
 * 
 */
export type OralChatHistory = $Result.DefaultSelection<Prisma.$OralChatHistoryPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more OralSessions
 * const oralSessions = await prisma.oralSession.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more OralSessions
   * const oralSessions = await prisma.oralSession.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.oralSession`: Exposes CRUD operations for the **OralSession** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more OralSessions
    * const oralSessions = await prisma.oralSession.findMany()
    * ```
    */
  get oralSession(): Prisma.OralSessionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.oralQuestion`: Exposes CRUD operations for the **OralQuestion** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more OralQuestions
    * const oralQuestions = await prisma.oralQuestion.findMany()
    * ```
    */
  get oralQuestion(): Prisma.OralQuestionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.oralChatHistory`: Exposes CRUD operations for the **OralChatHistory** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more OralChatHistories
    * const oralChatHistories = await prisma.oralChatHistory.findMany()
    * ```
    */
  get oralChatHistory(): Prisma.OralChatHistoryDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.19.3
   * Query Engine version: c2990dca591cba766e3b7ef5d9e8a84796e47ab7
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    OralSession: 'OralSession',
    OralQuestion: 'OralQuestion',
    OralChatHistory: 'OralChatHistory'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "oralSession" | "oralQuestion" | "oralChatHistory"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      OralSession: {
        payload: Prisma.$OralSessionPayload<ExtArgs>
        fields: Prisma.OralSessionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.OralSessionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OralSessionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.OralSessionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OralSessionPayload>
          }
          findFirst: {
            args: Prisma.OralSessionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OralSessionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.OralSessionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OralSessionPayload>
          }
          findMany: {
            args: Prisma.OralSessionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OralSessionPayload>[]
          }
          create: {
            args: Prisma.OralSessionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OralSessionPayload>
          }
          createMany: {
            args: Prisma.OralSessionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.OralSessionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OralSessionPayload>[]
          }
          delete: {
            args: Prisma.OralSessionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OralSessionPayload>
          }
          update: {
            args: Prisma.OralSessionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OralSessionPayload>
          }
          deleteMany: {
            args: Prisma.OralSessionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.OralSessionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.OralSessionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OralSessionPayload>[]
          }
          upsert: {
            args: Prisma.OralSessionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OralSessionPayload>
          }
          aggregate: {
            args: Prisma.OralSessionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateOralSession>
          }
          groupBy: {
            args: Prisma.OralSessionGroupByArgs<ExtArgs>
            result: $Utils.Optional<OralSessionGroupByOutputType>[]
          }
          count: {
            args: Prisma.OralSessionCountArgs<ExtArgs>
            result: $Utils.Optional<OralSessionCountAggregateOutputType> | number
          }
        }
      }
      OralQuestion: {
        payload: Prisma.$OralQuestionPayload<ExtArgs>
        fields: Prisma.OralQuestionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.OralQuestionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OralQuestionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.OralQuestionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OralQuestionPayload>
          }
          findFirst: {
            args: Prisma.OralQuestionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OralQuestionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.OralQuestionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OralQuestionPayload>
          }
          findMany: {
            args: Prisma.OralQuestionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OralQuestionPayload>[]
          }
          create: {
            args: Prisma.OralQuestionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OralQuestionPayload>
          }
          createMany: {
            args: Prisma.OralQuestionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.OralQuestionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OralQuestionPayload>[]
          }
          delete: {
            args: Prisma.OralQuestionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OralQuestionPayload>
          }
          update: {
            args: Prisma.OralQuestionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OralQuestionPayload>
          }
          deleteMany: {
            args: Prisma.OralQuestionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.OralQuestionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.OralQuestionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OralQuestionPayload>[]
          }
          upsert: {
            args: Prisma.OralQuestionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OralQuestionPayload>
          }
          aggregate: {
            args: Prisma.OralQuestionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateOralQuestion>
          }
          groupBy: {
            args: Prisma.OralQuestionGroupByArgs<ExtArgs>
            result: $Utils.Optional<OralQuestionGroupByOutputType>[]
          }
          count: {
            args: Prisma.OralQuestionCountArgs<ExtArgs>
            result: $Utils.Optional<OralQuestionCountAggregateOutputType> | number
          }
        }
      }
      OralChatHistory: {
        payload: Prisma.$OralChatHistoryPayload<ExtArgs>
        fields: Prisma.OralChatHistoryFieldRefs
        operations: {
          findUnique: {
            args: Prisma.OralChatHistoryFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OralChatHistoryPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.OralChatHistoryFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OralChatHistoryPayload>
          }
          findFirst: {
            args: Prisma.OralChatHistoryFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OralChatHistoryPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.OralChatHistoryFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OralChatHistoryPayload>
          }
          findMany: {
            args: Prisma.OralChatHistoryFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OralChatHistoryPayload>[]
          }
          create: {
            args: Prisma.OralChatHistoryCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OralChatHistoryPayload>
          }
          createMany: {
            args: Prisma.OralChatHistoryCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.OralChatHistoryCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OralChatHistoryPayload>[]
          }
          delete: {
            args: Prisma.OralChatHistoryDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OralChatHistoryPayload>
          }
          update: {
            args: Prisma.OralChatHistoryUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OralChatHistoryPayload>
          }
          deleteMany: {
            args: Prisma.OralChatHistoryDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.OralChatHistoryUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.OralChatHistoryUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OralChatHistoryPayload>[]
          }
          upsert: {
            args: Prisma.OralChatHistoryUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OralChatHistoryPayload>
          }
          aggregate: {
            args: Prisma.OralChatHistoryAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateOralChatHistory>
          }
          groupBy: {
            args: Prisma.OralChatHistoryGroupByArgs<ExtArgs>
            result: $Utils.Optional<OralChatHistoryGroupByOutputType>[]
          }
          count: {
            args: Prisma.OralChatHistoryCountArgs<ExtArgs>
            result: $Utils.Optional<OralChatHistoryCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory | null
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    oralSession?: OralSessionOmit
    oralQuestion?: OralQuestionOmit
    oralChatHistory?: OralChatHistoryOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type OralSessionCountOutputType
   */

  export type OralSessionCountOutputType = {
    questions: number
    chatHistory: number
  }

  export type OralSessionCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    questions?: boolean | OralSessionCountOutputTypeCountQuestionsArgs
    chatHistory?: boolean | OralSessionCountOutputTypeCountChatHistoryArgs
  }

  // Custom InputTypes
  /**
   * OralSessionCountOutputType without action
   */
  export type OralSessionCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OralSessionCountOutputType
     */
    select?: OralSessionCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * OralSessionCountOutputType without action
   */
  export type OralSessionCountOutputTypeCountQuestionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: OralQuestionWhereInput
  }

  /**
   * OralSessionCountOutputType without action
   */
  export type OralSessionCountOutputTypeCountChatHistoryArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: OralChatHistoryWhereInput
  }


  /**
   * Models
   */

  /**
   * Model OralSession
   */

  export type AggregateOralSession = {
    _count: OralSessionCountAggregateOutputType | null
    _avg: OralSessionAvgAggregateOutputType | null
    _sum: OralSessionSumAggregateOutputType | null
    _min: OralSessionMinAggregateOutputType | null
    _max: OralSessionMaxAggregateOutputType | null
  }

  export type OralSessionAvgAggregateOutputType = {
    durationMins: number | null
  }

  export type OralSessionSumAggregateOutputType = {
    durationMins: number | null
  }

  export type OralSessionMinAggregateOutputType = {
    id: string | null
    userId: string | null
    resumeId: string | null
    interviewType: string | null
    targetRole: string | null
    targetCompany: string | null
    industry: string | null
    experienceLevel: string | null
    interviewGoal: string | null
    durationMins: number | null
    status: string | null
    startedAt: Date | null
    completedAt: Date | null
    createdAt: Date | null
  }

  export type OralSessionMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    resumeId: string | null
    interviewType: string | null
    targetRole: string | null
    targetCompany: string | null
    industry: string | null
    experienceLevel: string | null
    interviewGoal: string | null
    durationMins: number | null
    status: string | null
    startedAt: Date | null
    completedAt: Date | null
    createdAt: Date | null
  }

  export type OralSessionCountAggregateOutputType = {
    id: number
    userId: number
    resumeId: number
    interviewType: number
    targetRole: number
    targetCompany: number
    industry: number
    experienceLevel: number
    focusAreas: number
    interviewGoal: number
    durationMins: number
    status: number
    startedAt: number
    completedAt: number
    createdAt: number
    _all: number
  }


  export type OralSessionAvgAggregateInputType = {
    durationMins?: true
  }

  export type OralSessionSumAggregateInputType = {
    durationMins?: true
  }

  export type OralSessionMinAggregateInputType = {
    id?: true
    userId?: true
    resumeId?: true
    interviewType?: true
    targetRole?: true
    targetCompany?: true
    industry?: true
    experienceLevel?: true
    interviewGoal?: true
    durationMins?: true
    status?: true
    startedAt?: true
    completedAt?: true
    createdAt?: true
  }

  export type OralSessionMaxAggregateInputType = {
    id?: true
    userId?: true
    resumeId?: true
    interviewType?: true
    targetRole?: true
    targetCompany?: true
    industry?: true
    experienceLevel?: true
    interviewGoal?: true
    durationMins?: true
    status?: true
    startedAt?: true
    completedAt?: true
    createdAt?: true
  }

  export type OralSessionCountAggregateInputType = {
    id?: true
    userId?: true
    resumeId?: true
    interviewType?: true
    targetRole?: true
    targetCompany?: true
    industry?: true
    experienceLevel?: true
    focusAreas?: true
    interviewGoal?: true
    durationMins?: true
    status?: true
    startedAt?: true
    completedAt?: true
    createdAt?: true
    _all?: true
  }

  export type OralSessionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which OralSession to aggregate.
     */
    where?: OralSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OralSessions to fetch.
     */
    orderBy?: OralSessionOrderByWithRelationInput | OralSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: OralSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OralSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OralSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned OralSessions
    **/
    _count?: true | OralSessionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: OralSessionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: OralSessionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: OralSessionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: OralSessionMaxAggregateInputType
  }

  export type GetOralSessionAggregateType<T extends OralSessionAggregateArgs> = {
        [P in keyof T & keyof AggregateOralSession]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateOralSession[P]>
      : GetScalarType<T[P], AggregateOralSession[P]>
  }




  export type OralSessionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: OralSessionWhereInput
    orderBy?: OralSessionOrderByWithAggregationInput | OralSessionOrderByWithAggregationInput[]
    by: OralSessionScalarFieldEnum[] | OralSessionScalarFieldEnum
    having?: OralSessionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: OralSessionCountAggregateInputType | true
    _avg?: OralSessionAvgAggregateInputType
    _sum?: OralSessionSumAggregateInputType
    _min?: OralSessionMinAggregateInputType
    _max?: OralSessionMaxAggregateInputType
  }

  export type OralSessionGroupByOutputType = {
    id: string
    userId: string
    resumeId: string | null
    interviewType: string
    targetRole: string
    targetCompany: string | null
    industry: string
    experienceLevel: string
    focusAreas: string[]
    interviewGoal: string | null
    durationMins: number
    status: string
    startedAt: Date | null
    completedAt: Date | null
    createdAt: Date
    _count: OralSessionCountAggregateOutputType | null
    _avg: OralSessionAvgAggregateOutputType | null
    _sum: OralSessionSumAggregateOutputType | null
    _min: OralSessionMinAggregateOutputType | null
    _max: OralSessionMaxAggregateOutputType | null
  }

  type GetOralSessionGroupByPayload<T extends OralSessionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<OralSessionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof OralSessionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], OralSessionGroupByOutputType[P]>
            : GetScalarType<T[P], OralSessionGroupByOutputType[P]>
        }
      >
    >


  export type OralSessionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    resumeId?: boolean
    interviewType?: boolean
    targetRole?: boolean
    targetCompany?: boolean
    industry?: boolean
    experienceLevel?: boolean
    focusAreas?: boolean
    interviewGoal?: boolean
    durationMins?: boolean
    status?: boolean
    startedAt?: boolean
    completedAt?: boolean
    createdAt?: boolean
    questions?: boolean | OralSession$questionsArgs<ExtArgs>
    chatHistory?: boolean | OralSession$chatHistoryArgs<ExtArgs>
    _count?: boolean | OralSessionCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["oralSession"]>

  export type OralSessionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    resumeId?: boolean
    interviewType?: boolean
    targetRole?: boolean
    targetCompany?: boolean
    industry?: boolean
    experienceLevel?: boolean
    focusAreas?: boolean
    interviewGoal?: boolean
    durationMins?: boolean
    status?: boolean
    startedAt?: boolean
    completedAt?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["oralSession"]>

  export type OralSessionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    resumeId?: boolean
    interviewType?: boolean
    targetRole?: boolean
    targetCompany?: boolean
    industry?: boolean
    experienceLevel?: boolean
    focusAreas?: boolean
    interviewGoal?: boolean
    durationMins?: boolean
    status?: boolean
    startedAt?: boolean
    completedAt?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["oralSession"]>

  export type OralSessionSelectScalar = {
    id?: boolean
    userId?: boolean
    resumeId?: boolean
    interviewType?: boolean
    targetRole?: boolean
    targetCompany?: boolean
    industry?: boolean
    experienceLevel?: boolean
    focusAreas?: boolean
    interviewGoal?: boolean
    durationMins?: boolean
    status?: boolean
    startedAt?: boolean
    completedAt?: boolean
    createdAt?: boolean
  }

  export type OralSessionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "resumeId" | "interviewType" | "targetRole" | "targetCompany" | "industry" | "experienceLevel" | "focusAreas" | "interviewGoal" | "durationMins" | "status" | "startedAt" | "completedAt" | "createdAt", ExtArgs["result"]["oralSession"]>
  export type OralSessionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    questions?: boolean | OralSession$questionsArgs<ExtArgs>
    chatHistory?: boolean | OralSession$chatHistoryArgs<ExtArgs>
    _count?: boolean | OralSessionCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type OralSessionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type OralSessionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $OralSessionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "OralSession"
    objects: {
      questions: Prisma.$OralQuestionPayload<ExtArgs>[]
      chatHistory: Prisma.$OralChatHistoryPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      resumeId: string | null
      interviewType: string
      targetRole: string
      targetCompany: string | null
      industry: string
      experienceLevel: string
      focusAreas: string[]
      interviewGoal: string | null
      durationMins: number
      status: string
      startedAt: Date | null
      completedAt: Date | null
      createdAt: Date
    }, ExtArgs["result"]["oralSession"]>
    composites: {}
  }

  type OralSessionGetPayload<S extends boolean | null | undefined | OralSessionDefaultArgs> = $Result.GetResult<Prisma.$OralSessionPayload, S>

  type OralSessionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<OralSessionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: OralSessionCountAggregateInputType | true
    }

  export interface OralSessionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['OralSession'], meta: { name: 'OralSession' } }
    /**
     * Find zero or one OralSession that matches the filter.
     * @param {OralSessionFindUniqueArgs} args - Arguments to find a OralSession
     * @example
     * // Get one OralSession
     * const oralSession = await prisma.oralSession.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends OralSessionFindUniqueArgs>(args: SelectSubset<T, OralSessionFindUniqueArgs<ExtArgs>>): Prisma__OralSessionClient<$Result.GetResult<Prisma.$OralSessionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one OralSession that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {OralSessionFindUniqueOrThrowArgs} args - Arguments to find a OralSession
     * @example
     * // Get one OralSession
     * const oralSession = await prisma.oralSession.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends OralSessionFindUniqueOrThrowArgs>(args: SelectSubset<T, OralSessionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__OralSessionClient<$Result.GetResult<Prisma.$OralSessionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first OralSession that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OralSessionFindFirstArgs} args - Arguments to find a OralSession
     * @example
     * // Get one OralSession
     * const oralSession = await prisma.oralSession.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends OralSessionFindFirstArgs>(args?: SelectSubset<T, OralSessionFindFirstArgs<ExtArgs>>): Prisma__OralSessionClient<$Result.GetResult<Prisma.$OralSessionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first OralSession that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OralSessionFindFirstOrThrowArgs} args - Arguments to find a OralSession
     * @example
     * // Get one OralSession
     * const oralSession = await prisma.oralSession.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends OralSessionFindFirstOrThrowArgs>(args?: SelectSubset<T, OralSessionFindFirstOrThrowArgs<ExtArgs>>): Prisma__OralSessionClient<$Result.GetResult<Prisma.$OralSessionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more OralSessions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OralSessionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all OralSessions
     * const oralSessions = await prisma.oralSession.findMany()
     * 
     * // Get first 10 OralSessions
     * const oralSessions = await prisma.oralSession.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const oralSessionWithIdOnly = await prisma.oralSession.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends OralSessionFindManyArgs>(args?: SelectSubset<T, OralSessionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OralSessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a OralSession.
     * @param {OralSessionCreateArgs} args - Arguments to create a OralSession.
     * @example
     * // Create one OralSession
     * const OralSession = await prisma.oralSession.create({
     *   data: {
     *     // ... data to create a OralSession
     *   }
     * })
     * 
     */
    create<T extends OralSessionCreateArgs>(args: SelectSubset<T, OralSessionCreateArgs<ExtArgs>>): Prisma__OralSessionClient<$Result.GetResult<Prisma.$OralSessionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many OralSessions.
     * @param {OralSessionCreateManyArgs} args - Arguments to create many OralSessions.
     * @example
     * // Create many OralSessions
     * const oralSession = await prisma.oralSession.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends OralSessionCreateManyArgs>(args?: SelectSubset<T, OralSessionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many OralSessions and returns the data saved in the database.
     * @param {OralSessionCreateManyAndReturnArgs} args - Arguments to create many OralSessions.
     * @example
     * // Create many OralSessions
     * const oralSession = await prisma.oralSession.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many OralSessions and only return the `id`
     * const oralSessionWithIdOnly = await prisma.oralSession.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends OralSessionCreateManyAndReturnArgs>(args?: SelectSubset<T, OralSessionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OralSessionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a OralSession.
     * @param {OralSessionDeleteArgs} args - Arguments to delete one OralSession.
     * @example
     * // Delete one OralSession
     * const OralSession = await prisma.oralSession.delete({
     *   where: {
     *     // ... filter to delete one OralSession
     *   }
     * })
     * 
     */
    delete<T extends OralSessionDeleteArgs>(args: SelectSubset<T, OralSessionDeleteArgs<ExtArgs>>): Prisma__OralSessionClient<$Result.GetResult<Prisma.$OralSessionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one OralSession.
     * @param {OralSessionUpdateArgs} args - Arguments to update one OralSession.
     * @example
     * // Update one OralSession
     * const oralSession = await prisma.oralSession.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends OralSessionUpdateArgs>(args: SelectSubset<T, OralSessionUpdateArgs<ExtArgs>>): Prisma__OralSessionClient<$Result.GetResult<Prisma.$OralSessionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more OralSessions.
     * @param {OralSessionDeleteManyArgs} args - Arguments to filter OralSessions to delete.
     * @example
     * // Delete a few OralSessions
     * const { count } = await prisma.oralSession.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends OralSessionDeleteManyArgs>(args?: SelectSubset<T, OralSessionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more OralSessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OralSessionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many OralSessions
     * const oralSession = await prisma.oralSession.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends OralSessionUpdateManyArgs>(args: SelectSubset<T, OralSessionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more OralSessions and returns the data updated in the database.
     * @param {OralSessionUpdateManyAndReturnArgs} args - Arguments to update many OralSessions.
     * @example
     * // Update many OralSessions
     * const oralSession = await prisma.oralSession.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more OralSessions and only return the `id`
     * const oralSessionWithIdOnly = await prisma.oralSession.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends OralSessionUpdateManyAndReturnArgs>(args: SelectSubset<T, OralSessionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OralSessionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one OralSession.
     * @param {OralSessionUpsertArgs} args - Arguments to update or create a OralSession.
     * @example
     * // Update or create a OralSession
     * const oralSession = await prisma.oralSession.upsert({
     *   create: {
     *     // ... data to create a OralSession
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the OralSession we want to update
     *   }
     * })
     */
    upsert<T extends OralSessionUpsertArgs>(args: SelectSubset<T, OralSessionUpsertArgs<ExtArgs>>): Prisma__OralSessionClient<$Result.GetResult<Prisma.$OralSessionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of OralSessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OralSessionCountArgs} args - Arguments to filter OralSessions to count.
     * @example
     * // Count the number of OralSessions
     * const count = await prisma.oralSession.count({
     *   where: {
     *     // ... the filter for the OralSessions we want to count
     *   }
     * })
    **/
    count<T extends OralSessionCountArgs>(
      args?: Subset<T, OralSessionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], OralSessionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a OralSession.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OralSessionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends OralSessionAggregateArgs>(args: Subset<T, OralSessionAggregateArgs>): Prisma.PrismaPromise<GetOralSessionAggregateType<T>>

    /**
     * Group by OralSession.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OralSessionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends OralSessionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: OralSessionGroupByArgs['orderBy'] }
        : { orderBy?: OralSessionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, OralSessionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetOralSessionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the OralSession model
   */
  readonly fields: OralSessionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for OralSession.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__OralSessionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    questions<T extends OralSession$questionsArgs<ExtArgs> = {}>(args?: Subset<T, OralSession$questionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OralQuestionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    chatHistory<T extends OralSession$chatHistoryArgs<ExtArgs> = {}>(args?: Subset<T, OralSession$chatHistoryArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OralChatHistoryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the OralSession model
   */
  interface OralSessionFieldRefs {
    readonly id: FieldRef<"OralSession", 'String'>
    readonly userId: FieldRef<"OralSession", 'String'>
    readonly resumeId: FieldRef<"OralSession", 'String'>
    readonly interviewType: FieldRef<"OralSession", 'String'>
    readonly targetRole: FieldRef<"OralSession", 'String'>
    readonly targetCompany: FieldRef<"OralSession", 'String'>
    readonly industry: FieldRef<"OralSession", 'String'>
    readonly experienceLevel: FieldRef<"OralSession", 'String'>
    readonly focusAreas: FieldRef<"OralSession", 'String[]'>
    readonly interviewGoal: FieldRef<"OralSession", 'String'>
    readonly durationMins: FieldRef<"OralSession", 'Int'>
    readonly status: FieldRef<"OralSession", 'String'>
    readonly startedAt: FieldRef<"OralSession", 'DateTime'>
    readonly completedAt: FieldRef<"OralSession", 'DateTime'>
    readonly createdAt: FieldRef<"OralSession", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * OralSession findUnique
   */
  export type OralSessionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OralSession
     */
    select?: OralSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OralSession
     */
    omit?: OralSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OralSessionInclude<ExtArgs> | null
    /**
     * Filter, which OralSession to fetch.
     */
    where: OralSessionWhereUniqueInput
  }

  /**
   * OralSession findUniqueOrThrow
   */
  export type OralSessionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OralSession
     */
    select?: OralSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OralSession
     */
    omit?: OralSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OralSessionInclude<ExtArgs> | null
    /**
     * Filter, which OralSession to fetch.
     */
    where: OralSessionWhereUniqueInput
  }

  /**
   * OralSession findFirst
   */
  export type OralSessionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OralSession
     */
    select?: OralSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OralSession
     */
    omit?: OralSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OralSessionInclude<ExtArgs> | null
    /**
     * Filter, which OralSession to fetch.
     */
    where?: OralSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OralSessions to fetch.
     */
    orderBy?: OralSessionOrderByWithRelationInput | OralSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for OralSessions.
     */
    cursor?: OralSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OralSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OralSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of OralSessions.
     */
    distinct?: OralSessionScalarFieldEnum | OralSessionScalarFieldEnum[]
  }

  /**
   * OralSession findFirstOrThrow
   */
  export type OralSessionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OralSession
     */
    select?: OralSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OralSession
     */
    omit?: OralSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OralSessionInclude<ExtArgs> | null
    /**
     * Filter, which OralSession to fetch.
     */
    where?: OralSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OralSessions to fetch.
     */
    orderBy?: OralSessionOrderByWithRelationInput | OralSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for OralSessions.
     */
    cursor?: OralSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OralSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OralSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of OralSessions.
     */
    distinct?: OralSessionScalarFieldEnum | OralSessionScalarFieldEnum[]
  }

  /**
   * OralSession findMany
   */
  export type OralSessionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OralSession
     */
    select?: OralSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OralSession
     */
    omit?: OralSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OralSessionInclude<ExtArgs> | null
    /**
     * Filter, which OralSessions to fetch.
     */
    where?: OralSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OralSessions to fetch.
     */
    orderBy?: OralSessionOrderByWithRelationInput | OralSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing OralSessions.
     */
    cursor?: OralSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OralSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OralSessions.
     */
    skip?: number
    distinct?: OralSessionScalarFieldEnum | OralSessionScalarFieldEnum[]
  }

  /**
   * OralSession create
   */
  export type OralSessionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OralSession
     */
    select?: OralSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OralSession
     */
    omit?: OralSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OralSessionInclude<ExtArgs> | null
    /**
     * The data needed to create a OralSession.
     */
    data: XOR<OralSessionCreateInput, OralSessionUncheckedCreateInput>
  }

  /**
   * OralSession createMany
   */
  export type OralSessionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many OralSessions.
     */
    data: OralSessionCreateManyInput | OralSessionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * OralSession createManyAndReturn
   */
  export type OralSessionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OralSession
     */
    select?: OralSessionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the OralSession
     */
    omit?: OralSessionOmit<ExtArgs> | null
    /**
     * The data used to create many OralSessions.
     */
    data: OralSessionCreateManyInput | OralSessionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * OralSession update
   */
  export type OralSessionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OralSession
     */
    select?: OralSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OralSession
     */
    omit?: OralSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OralSessionInclude<ExtArgs> | null
    /**
     * The data needed to update a OralSession.
     */
    data: XOR<OralSessionUpdateInput, OralSessionUncheckedUpdateInput>
    /**
     * Choose, which OralSession to update.
     */
    where: OralSessionWhereUniqueInput
  }

  /**
   * OralSession updateMany
   */
  export type OralSessionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update OralSessions.
     */
    data: XOR<OralSessionUpdateManyMutationInput, OralSessionUncheckedUpdateManyInput>
    /**
     * Filter which OralSessions to update
     */
    where?: OralSessionWhereInput
    /**
     * Limit how many OralSessions to update.
     */
    limit?: number
  }

  /**
   * OralSession updateManyAndReturn
   */
  export type OralSessionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OralSession
     */
    select?: OralSessionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the OralSession
     */
    omit?: OralSessionOmit<ExtArgs> | null
    /**
     * The data used to update OralSessions.
     */
    data: XOR<OralSessionUpdateManyMutationInput, OralSessionUncheckedUpdateManyInput>
    /**
     * Filter which OralSessions to update
     */
    where?: OralSessionWhereInput
    /**
     * Limit how many OralSessions to update.
     */
    limit?: number
  }

  /**
   * OralSession upsert
   */
  export type OralSessionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OralSession
     */
    select?: OralSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OralSession
     */
    omit?: OralSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OralSessionInclude<ExtArgs> | null
    /**
     * The filter to search for the OralSession to update in case it exists.
     */
    where: OralSessionWhereUniqueInput
    /**
     * In case the OralSession found by the `where` argument doesn't exist, create a new OralSession with this data.
     */
    create: XOR<OralSessionCreateInput, OralSessionUncheckedCreateInput>
    /**
     * In case the OralSession was found with the provided `where` argument, update it with this data.
     */
    update: XOR<OralSessionUpdateInput, OralSessionUncheckedUpdateInput>
  }

  /**
   * OralSession delete
   */
  export type OralSessionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OralSession
     */
    select?: OralSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OralSession
     */
    omit?: OralSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OralSessionInclude<ExtArgs> | null
    /**
     * Filter which OralSession to delete.
     */
    where: OralSessionWhereUniqueInput
  }

  /**
   * OralSession deleteMany
   */
  export type OralSessionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which OralSessions to delete
     */
    where?: OralSessionWhereInput
    /**
     * Limit how many OralSessions to delete.
     */
    limit?: number
  }

  /**
   * OralSession.questions
   */
  export type OralSession$questionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OralQuestion
     */
    select?: OralQuestionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OralQuestion
     */
    omit?: OralQuestionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OralQuestionInclude<ExtArgs> | null
    where?: OralQuestionWhereInput
    orderBy?: OralQuestionOrderByWithRelationInput | OralQuestionOrderByWithRelationInput[]
    cursor?: OralQuestionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: OralQuestionScalarFieldEnum | OralQuestionScalarFieldEnum[]
  }

  /**
   * OralSession.chatHistory
   */
  export type OralSession$chatHistoryArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OralChatHistory
     */
    select?: OralChatHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the OralChatHistory
     */
    omit?: OralChatHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OralChatHistoryInclude<ExtArgs> | null
    where?: OralChatHistoryWhereInput
    orderBy?: OralChatHistoryOrderByWithRelationInput | OralChatHistoryOrderByWithRelationInput[]
    cursor?: OralChatHistoryWhereUniqueInput
    take?: number
    skip?: number
    distinct?: OralChatHistoryScalarFieldEnum | OralChatHistoryScalarFieldEnum[]
  }

  /**
   * OralSession without action
   */
  export type OralSessionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OralSession
     */
    select?: OralSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OralSession
     */
    omit?: OralSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OralSessionInclude<ExtArgs> | null
  }


  /**
   * Model OralQuestion
   */

  export type AggregateOralQuestion = {
    _count: OralQuestionCountAggregateOutputType | null
    _avg: OralQuestionAvgAggregateOutputType | null
    _sum: OralQuestionSumAggregateOutputType | null
    _min: OralQuestionMinAggregateOutputType | null
    _max: OralQuestionMaxAggregateOutputType | null
  }

  export type OralQuestionAvgAggregateOutputType = {
    orderIndex: number | null
    timeTakenSecs: number | null
    evalScore: number | null
  }

  export type OralQuestionSumAggregateOutputType = {
    orderIndex: number | null
    timeTakenSecs: number | null
    evalScore: number | null
  }

  export type OralQuestionMinAggregateOutputType = {
    id: string | null
    sessionId: string | null
    orderIndex: number | null
    questionText: string | null
    questionType: string | null
    difficulty: string | null
    answerText: string | null
    answeredAt: Date | null
    timeTakenSecs: number | null
    evalScore: number | null
    evalFeedback: string | null
    betterAnswer: string | null
  }

  export type OralQuestionMaxAggregateOutputType = {
    id: string | null
    sessionId: string | null
    orderIndex: number | null
    questionText: string | null
    questionType: string | null
    difficulty: string | null
    answerText: string | null
    answeredAt: Date | null
    timeTakenSecs: number | null
    evalScore: number | null
    evalFeedback: string | null
    betterAnswer: string | null
  }

  export type OralQuestionCountAggregateOutputType = {
    id: number
    sessionId: number
    orderIndex: number
    questionText: number
    questionType: number
    difficulty: number
    answerText: number
    answeredAt: number
    timeTakenSecs: number
    evalScore: number
    evalFeedback: number
    evalStrengths: number
    evalWeaknesses: number
    betterAnswer: number
    _all: number
  }


  export type OralQuestionAvgAggregateInputType = {
    orderIndex?: true
    timeTakenSecs?: true
    evalScore?: true
  }

  export type OralQuestionSumAggregateInputType = {
    orderIndex?: true
    timeTakenSecs?: true
    evalScore?: true
  }

  export type OralQuestionMinAggregateInputType = {
    id?: true
    sessionId?: true
    orderIndex?: true
    questionText?: true
    questionType?: true
    difficulty?: true
    answerText?: true
    answeredAt?: true
    timeTakenSecs?: true
    evalScore?: true
    evalFeedback?: true
    betterAnswer?: true
  }

  export type OralQuestionMaxAggregateInputType = {
    id?: true
    sessionId?: true
    orderIndex?: true
    questionText?: true
    questionType?: true
    difficulty?: true
    answerText?: true
    answeredAt?: true
    timeTakenSecs?: true
    evalScore?: true
    evalFeedback?: true
    betterAnswer?: true
  }

  export type OralQuestionCountAggregateInputType = {
    id?: true
    sessionId?: true
    orderIndex?: true
    questionText?: true
    questionType?: true
    difficulty?: true
    answerText?: true
    answeredAt?: true
    timeTakenSecs?: true
    evalScore?: true
    evalFeedback?: true
    evalStrengths?: true
    evalWeaknesses?: true
    betterAnswer?: true
    _all?: true
  }

  export type OralQuestionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which OralQuestion to aggregate.
     */
    where?: OralQuestionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OralQuestions to fetch.
     */
    orderBy?: OralQuestionOrderByWithRelationInput | OralQuestionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: OralQuestionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OralQuestions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OralQuestions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned OralQuestions
    **/
    _count?: true | OralQuestionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: OralQuestionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: OralQuestionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: OralQuestionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: OralQuestionMaxAggregateInputType
  }

  export type GetOralQuestionAggregateType<T extends OralQuestionAggregateArgs> = {
        [P in keyof T & keyof AggregateOralQuestion]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateOralQuestion[P]>
      : GetScalarType<T[P], AggregateOralQuestion[P]>
  }




  export type OralQuestionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: OralQuestionWhereInput
    orderBy?: OralQuestionOrderByWithAggregationInput | OralQuestionOrderByWithAggregationInput[]
    by: OralQuestionScalarFieldEnum[] | OralQuestionScalarFieldEnum
    having?: OralQuestionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: OralQuestionCountAggregateInputType | true
    _avg?: OralQuestionAvgAggregateInputType
    _sum?: OralQuestionSumAggregateInputType
    _min?: OralQuestionMinAggregateInputType
    _max?: OralQuestionMaxAggregateInputType
  }

  export type OralQuestionGroupByOutputType = {
    id: string
    sessionId: string
    orderIndex: number
    questionText: string
    questionType: string
    difficulty: string
    answerText: string | null
    answeredAt: Date | null
    timeTakenSecs: number | null
    evalScore: number | null
    evalFeedback: string | null
    evalStrengths: string[]
    evalWeaknesses: string[]
    betterAnswer: string | null
    _count: OralQuestionCountAggregateOutputType | null
    _avg: OralQuestionAvgAggregateOutputType | null
    _sum: OralQuestionSumAggregateOutputType | null
    _min: OralQuestionMinAggregateOutputType | null
    _max: OralQuestionMaxAggregateOutputType | null
  }

  type GetOralQuestionGroupByPayload<T extends OralQuestionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<OralQuestionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof OralQuestionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], OralQuestionGroupByOutputType[P]>
            : GetScalarType<T[P], OralQuestionGroupByOutputType[P]>
        }
      >
    >


  export type OralQuestionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sessionId?: boolean
    orderIndex?: boolean
    questionText?: boolean
    questionType?: boolean
    difficulty?: boolean
    answerText?: boolean
    answeredAt?: boolean
    timeTakenSecs?: boolean
    evalScore?: boolean
    evalFeedback?: boolean
    evalStrengths?: boolean
    evalWeaknesses?: boolean
    betterAnswer?: boolean
    session?: boolean | OralSessionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["oralQuestion"]>

  export type OralQuestionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sessionId?: boolean
    orderIndex?: boolean
    questionText?: boolean
    questionType?: boolean
    difficulty?: boolean
    answerText?: boolean
    answeredAt?: boolean
    timeTakenSecs?: boolean
    evalScore?: boolean
    evalFeedback?: boolean
    evalStrengths?: boolean
    evalWeaknesses?: boolean
    betterAnswer?: boolean
    session?: boolean | OralSessionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["oralQuestion"]>

  export type OralQuestionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sessionId?: boolean
    orderIndex?: boolean
    questionText?: boolean
    questionType?: boolean
    difficulty?: boolean
    answerText?: boolean
    answeredAt?: boolean
    timeTakenSecs?: boolean
    evalScore?: boolean
    evalFeedback?: boolean
    evalStrengths?: boolean
    evalWeaknesses?: boolean
    betterAnswer?: boolean
    session?: boolean | OralSessionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["oralQuestion"]>

  export type OralQuestionSelectScalar = {
    id?: boolean
    sessionId?: boolean
    orderIndex?: boolean
    questionText?: boolean
    questionType?: boolean
    difficulty?: boolean
    answerText?: boolean
    answeredAt?: boolean
    timeTakenSecs?: boolean
    evalScore?: boolean
    evalFeedback?: boolean
    evalStrengths?: boolean
    evalWeaknesses?: boolean
    betterAnswer?: boolean
  }

  export type OralQuestionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "sessionId" | "orderIndex" | "questionText" | "questionType" | "difficulty" | "answerText" | "answeredAt" | "timeTakenSecs" | "evalScore" | "evalFeedback" | "evalStrengths" | "evalWeaknesses" | "betterAnswer", ExtArgs["result"]["oralQuestion"]>
  export type OralQuestionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    session?: boolean | OralSessionDefaultArgs<ExtArgs>
  }
  export type OralQuestionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    session?: boolean | OralSessionDefaultArgs<ExtArgs>
  }
  export type OralQuestionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    session?: boolean | OralSessionDefaultArgs<ExtArgs>
  }

  export type $OralQuestionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "OralQuestion"
    objects: {
      session: Prisma.$OralSessionPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      sessionId: string
      orderIndex: number
      questionText: string
      questionType: string
      difficulty: string
      answerText: string | null
      answeredAt: Date | null
      timeTakenSecs: number | null
      evalScore: number | null
      evalFeedback: string | null
      evalStrengths: string[]
      evalWeaknesses: string[]
      betterAnswer: string | null
    }, ExtArgs["result"]["oralQuestion"]>
    composites: {}
  }

  type OralQuestionGetPayload<S extends boolean | null | undefined | OralQuestionDefaultArgs> = $Result.GetResult<Prisma.$OralQuestionPayload, S>

  type OralQuestionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<OralQuestionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: OralQuestionCountAggregateInputType | true
    }

  export interface OralQuestionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['OralQuestion'], meta: { name: 'OralQuestion' } }
    /**
     * Find zero or one OralQuestion that matches the filter.
     * @param {OralQuestionFindUniqueArgs} args - Arguments to find a OralQuestion
     * @example
     * // Get one OralQuestion
     * const oralQuestion = await prisma.oralQuestion.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends OralQuestionFindUniqueArgs>(args: SelectSubset<T, OralQuestionFindUniqueArgs<ExtArgs>>): Prisma__OralQuestionClient<$Result.GetResult<Prisma.$OralQuestionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one OralQuestion that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {OralQuestionFindUniqueOrThrowArgs} args - Arguments to find a OralQuestion
     * @example
     * // Get one OralQuestion
     * const oralQuestion = await prisma.oralQuestion.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends OralQuestionFindUniqueOrThrowArgs>(args: SelectSubset<T, OralQuestionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__OralQuestionClient<$Result.GetResult<Prisma.$OralQuestionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first OralQuestion that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OralQuestionFindFirstArgs} args - Arguments to find a OralQuestion
     * @example
     * // Get one OralQuestion
     * const oralQuestion = await prisma.oralQuestion.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends OralQuestionFindFirstArgs>(args?: SelectSubset<T, OralQuestionFindFirstArgs<ExtArgs>>): Prisma__OralQuestionClient<$Result.GetResult<Prisma.$OralQuestionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first OralQuestion that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OralQuestionFindFirstOrThrowArgs} args - Arguments to find a OralQuestion
     * @example
     * // Get one OralQuestion
     * const oralQuestion = await prisma.oralQuestion.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends OralQuestionFindFirstOrThrowArgs>(args?: SelectSubset<T, OralQuestionFindFirstOrThrowArgs<ExtArgs>>): Prisma__OralQuestionClient<$Result.GetResult<Prisma.$OralQuestionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more OralQuestions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OralQuestionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all OralQuestions
     * const oralQuestions = await prisma.oralQuestion.findMany()
     * 
     * // Get first 10 OralQuestions
     * const oralQuestions = await prisma.oralQuestion.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const oralQuestionWithIdOnly = await prisma.oralQuestion.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends OralQuestionFindManyArgs>(args?: SelectSubset<T, OralQuestionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OralQuestionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a OralQuestion.
     * @param {OralQuestionCreateArgs} args - Arguments to create a OralQuestion.
     * @example
     * // Create one OralQuestion
     * const OralQuestion = await prisma.oralQuestion.create({
     *   data: {
     *     // ... data to create a OralQuestion
     *   }
     * })
     * 
     */
    create<T extends OralQuestionCreateArgs>(args: SelectSubset<T, OralQuestionCreateArgs<ExtArgs>>): Prisma__OralQuestionClient<$Result.GetResult<Prisma.$OralQuestionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many OralQuestions.
     * @param {OralQuestionCreateManyArgs} args - Arguments to create many OralQuestions.
     * @example
     * // Create many OralQuestions
     * const oralQuestion = await prisma.oralQuestion.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends OralQuestionCreateManyArgs>(args?: SelectSubset<T, OralQuestionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many OralQuestions and returns the data saved in the database.
     * @param {OralQuestionCreateManyAndReturnArgs} args - Arguments to create many OralQuestions.
     * @example
     * // Create many OralQuestions
     * const oralQuestion = await prisma.oralQuestion.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many OralQuestions and only return the `id`
     * const oralQuestionWithIdOnly = await prisma.oralQuestion.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends OralQuestionCreateManyAndReturnArgs>(args?: SelectSubset<T, OralQuestionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OralQuestionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a OralQuestion.
     * @param {OralQuestionDeleteArgs} args - Arguments to delete one OralQuestion.
     * @example
     * // Delete one OralQuestion
     * const OralQuestion = await prisma.oralQuestion.delete({
     *   where: {
     *     // ... filter to delete one OralQuestion
     *   }
     * })
     * 
     */
    delete<T extends OralQuestionDeleteArgs>(args: SelectSubset<T, OralQuestionDeleteArgs<ExtArgs>>): Prisma__OralQuestionClient<$Result.GetResult<Prisma.$OralQuestionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one OralQuestion.
     * @param {OralQuestionUpdateArgs} args - Arguments to update one OralQuestion.
     * @example
     * // Update one OralQuestion
     * const oralQuestion = await prisma.oralQuestion.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends OralQuestionUpdateArgs>(args: SelectSubset<T, OralQuestionUpdateArgs<ExtArgs>>): Prisma__OralQuestionClient<$Result.GetResult<Prisma.$OralQuestionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more OralQuestions.
     * @param {OralQuestionDeleteManyArgs} args - Arguments to filter OralQuestions to delete.
     * @example
     * // Delete a few OralQuestions
     * const { count } = await prisma.oralQuestion.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends OralQuestionDeleteManyArgs>(args?: SelectSubset<T, OralQuestionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more OralQuestions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OralQuestionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many OralQuestions
     * const oralQuestion = await prisma.oralQuestion.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends OralQuestionUpdateManyArgs>(args: SelectSubset<T, OralQuestionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more OralQuestions and returns the data updated in the database.
     * @param {OralQuestionUpdateManyAndReturnArgs} args - Arguments to update many OralQuestions.
     * @example
     * // Update many OralQuestions
     * const oralQuestion = await prisma.oralQuestion.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more OralQuestions and only return the `id`
     * const oralQuestionWithIdOnly = await prisma.oralQuestion.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends OralQuestionUpdateManyAndReturnArgs>(args: SelectSubset<T, OralQuestionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OralQuestionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one OralQuestion.
     * @param {OralQuestionUpsertArgs} args - Arguments to update or create a OralQuestion.
     * @example
     * // Update or create a OralQuestion
     * const oralQuestion = await prisma.oralQuestion.upsert({
     *   create: {
     *     // ... data to create a OralQuestion
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the OralQuestion we want to update
     *   }
     * })
     */
    upsert<T extends OralQuestionUpsertArgs>(args: SelectSubset<T, OralQuestionUpsertArgs<ExtArgs>>): Prisma__OralQuestionClient<$Result.GetResult<Prisma.$OralQuestionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of OralQuestions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OralQuestionCountArgs} args - Arguments to filter OralQuestions to count.
     * @example
     * // Count the number of OralQuestions
     * const count = await prisma.oralQuestion.count({
     *   where: {
     *     // ... the filter for the OralQuestions we want to count
     *   }
     * })
    **/
    count<T extends OralQuestionCountArgs>(
      args?: Subset<T, OralQuestionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], OralQuestionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a OralQuestion.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OralQuestionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends OralQuestionAggregateArgs>(args: Subset<T, OralQuestionAggregateArgs>): Prisma.PrismaPromise<GetOralQuestionAggregateType<T>>

    /**
     * Group by OralQuestion.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OralQuestionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends OralQuestionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: OralQuestionGroupByArgs['orderBy'] }
        : { orderBy?: OralQuestionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, OralQuestionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetOralQuestionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the OralQuestion model
   */
  readonly fields: OralQuestionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for OralQuestion.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__OralQuestionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    session<T extends OralSessionDefaultArgs<ExtArgs> = {}>(args?: Subset<T, OralSessionDefaultArgs<ExtArgs>>): Prisma__OralSessionClient<$Result.GetResult<Prisma.$OralSessionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the OralQuestion model
   */
  interface OralQuestionFieldRefs {
    readonly id: FieldRef<"OralQuestion", 'String'>
    readonly sessionId: FieldRef<"OralQuestion", 'String'>
    readonly orderIndex: FieldRef<"OralQuestion", 'Int'>
    readonly questionText: FieldRef<"OralQuestion", 'String'>
    readonly questionType: FieldRef<"OralQuestion", 'String'>
    readonly difficulty: FieldRef<"OralQuestion", 'String'>
    readonly answerText: FieldRef<"OralQuestion", 'String'>
    readonly answeredAt: FieldRef<"OralQuestion", 'DateTime'>
    readonly timeTakenSecs: FieldRef<"OralQuestion", 'Int'>
    readonly evalScore: FieldRef<"OralQuestion", 'Int'>
    readonly evalFeedback: FieldRef<"OralQuestion", 'String'>
    readonly evalStrengths: FieldRef<"OralQuestion", 'String[]'>
    readonly evalWeaknesses: FieldRef<"OralQuestion", 'String[]'>
    readonly betterAnswer: FieldRef<"OralQuestion", 'String'>
  }
    

  // Custom InputTypes
  /**
   * OralQuestion findUnique
   */
  export type OralQuestionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OralQuestion
     */
    select?: OralQuestionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OralQuestion
     */
    omit?: OralQuestionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OralQuestionInclude<ExtArgs> | null
    /**
     * Filter, which OralQuestion to fetch.
     */
    where: OralQuestionWhereUniqueInput
  }

  /**
   * OralQuestion findUniqueOrThrow
   */
  export type OralQuestionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OralQuestion
     */
    select?: OralQuestionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OralQuestion
     */
    omit?: OralQuestionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OralQuestionInclude<ExtArgs> | null
    /**
     * Filter, which OralQuestion to fetch.
     */
    where: OralQuestionWhereUniqueInput
  }

  /**
   * OralQuestion findFirst
   */
  export type OralQuestionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OralQuestion
     */
    select?: OralQuestionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OralQuestion
     */
    omit?: OralQuestionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OralQuestionInclude<ExtArgs> | null
    /**
     * Filter, which OralQuestion to fetch.
     */
    where?: OralQuestionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OralQuestions to fetch.
     */
    orderBy?: OralQuestionOrderByWithRelationInput | OralQuestionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for OralQuestions.
     */
    cursor?: OralQuestionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OralQuestions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OralQuestions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of OralQuestions.
     */
    distinct?: OralQuestionScalarFieldEnum | OralQuestionScalarFieldEnum[]
  }

  /**
   * OralQuestion findFirstOrThrow
   */
  export type OralQuestionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OralQuestion
     */
    select?: OralQuestionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OralQuestion
     */
    omit?: OralQuestionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OralQuestionInclude<ExtArgs> | null
    /**
     * Filter, which OralQuestion to fetch.
     */
    where?: OralQuestionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OralQuestions to fetch.
     */
    orderBy?: OralQuestionOrderByWithRelationInput | OralQuestionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for OralQuestions.
     */
    cursor?: OralQuestionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OralQuestions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OralQuestions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of OralQuestions.
     */
    distinct?: OralQuestionScalarFieldEnum | OralQuestionScalarFieldEnum[]
  }

  /**
   * OralQuestion findMany
   */
  export type OralQuestionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OralQuestion
     */
    select?: OralQuestionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OralQuestion
     */
    omit?: OralQuestionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OralQuestionInclude<ExtArgs> | null
    /**
     * Filter, which OralQuestions to fetch.
     */
    where?: OralQuestionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OralQuestions to fetch.
     */
    orderBy?: OralQuestionOrderByWithRelationInput | OralQuestionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing OralQuestions.
     */
    cursor?: OralQuestionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OralQuestions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OralQuestions.
     */
    skip?: number
    distinct?: OralQuestionScalarFieldEnum | OralQuestionScalarFieldEnum[]
  }

  /**
   * OralQuestion create
   */
  export type OralQuestionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OralQuestion
     */
    select?: OralQuestionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OralQuestion
     */
    omit?: OralQuestionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OralQuestionInclude<ExtArgs> | null
    /**
     * The data needed to create a OralQuestion.
     */
    data: XOR<OralQuestionCreateInput, OralQuestionUncheckedCreateInput>
  }

  /**
   * OralQuestion createMany
   */
  export type OralQuestionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many OralQuestions.
     */
    data: OralQuestionCreateManyInput | OralQuestionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * OralQuestion createManyAndReturn
   */
  export type OralQuestionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OralQuestion
     */
    select?: OralQuestionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the OralQuestion
     */
    omit?: OralQuestionOmit<ExtArgs> | null
    /**
     * The data used to create many OralQuestions.
     */
    data: OralQuestionCreateManyInput | OralQuestionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OralQuestionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * OralQuestion update
   */
  export type OralQuestionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OralQuestion
     */
    select?: OralQuestionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OralQuestion
     */
    omit?: OralQuestionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OralQuestionInclude<ExtArgs> | null
    /**
     * The data needed to update a OralQuestion.
     */
    data: XOR<OralQuestionUpdateInput, OralQuestionUncheckedUpdateInput>
    /**
     * Choose, which OralQuestion to update.
     */
    where: OralQuestionWhereUniqueInput
  }

  /**
   * OralQuestion updateMany
   */
  export type OralQuestionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update OralQuestions.
     */
    data: XOR<OralQuestionUpdateManyMutationInput, OralQuestionUncheckedUpdateManyInput>
    /**
     * Filter which OralQuestions to update
     */
    where?: OralQuestionWhereInput
    /**
     * Limit how many OralQuestions to update.
     */
    limit?: number
  }

  /**
   * OralQuestion updateManyAndReturn
   */
  export type OralQuestionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OralQuestion
     */
    select?: OralQuestionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the OralQuestion
     */
    omit?: OralQuestionOmit<ExtArgs> | null
    /**
     * The data used to update OralQuestions.
     */
    data: XOR<OralQuestionUpdateManyMutationInput, OralQuestionUncheckedUpdateManyInput>
    /**
     * Filter which OralQuestions to update
     */
    where?: OralQuestionWhereInput
    /**
     * Limit how many OralQuestions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OralQuestionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * OralQuestion upsert
   */
  export type OralQuestionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OralQuestion
     */
    select?: OralQuestionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OralQuestion
     */
    omit?: OralQuestionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OralQuestionInclude<ExtArgs> | null
    /**
     * The filter to search for the OralQuestion to update in case it exists.
     */
    where: OralQuestionWhereUniqueInput
    /**
     * In case the OralQuestion found by the `where` argument doesn't exist, create a new OralQuestion with this data.
     */
    create: XOR<OralQuestionCreateInput, OralQuestionUncheckedCreateInput>
    /**
     * In case the OralQuestion was found with the provided `where` argument, update it with this data.
     */
    update: XOR<OralQuestionUpdateInput, OralQuestionUncheckedUpdateInput>
  }

  /**
   * OralQuestion delete
   */
  export type OralQuestionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OralQuestion
     */
    select?: OralQuestionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OralQuestion
     */
    omit?: OralQuestionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OralQuestionInclude<ExtArgs> | null
    /**
     * Filter which OralQuestion to delete.
     */
    where: OralQuestionWhereUniqueInput
  }

  /**
   * OralQuestion deleteMany
   */
  export type OralQuestionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which OralQuestions to delete
     */
    where?: OralQuestionWhereInput
    /**
     * Limit how many OralQuestions to delete.
     */
    limit?: number
  }

  /**
   * OralQuestion without action
   */
  export type OralQuestionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OralQuestion
     */
    select?: OralQuestionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OralQuestion
     */
    omit?: OralQuestionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OralQuestionInclude<ExtArgs> | null
  }


  /**
   * Model OralChatHistory
   */

  export type AggregateOralChatHistory = {
    _count: OralChatHistoryCountAggregateOutputType | null
    _avg: OralChatHistoryAvgAggregateOutputType | null
    _sum: OralChatHistorySumAggregateOutputType | null
    _min: OralChatHistoryMinAggregateOutputType | null
    _max: OralChatHistoryMaxAggregateOutputType | null
  }

  export type OralChatHistoryAvgAggregateOutputType = {
    score: number | null
  }

  export type OralChatHistorySumAggregateOutputType = {
    score: number | null
  }

  export type OralChatHistoryMinAggregateOutputType = {
    id: string | null
    sessionId: string | null
    role: string | null
    content: string | null
    score: number | null
    critique: string | null
    timestamp: Date | null
  }

  export type OralChatHistoryMaxAggregateOutputType = {
    id: string | null
    sessionId: string | null
    role: string | null
    content: string | null
    score: number | null
    critique: string | null
    timestamp: Date | null
  }

  export type OralChatHistoryCountAggregateOutputType = {
    id: number
    sessionId: number
    role: number
    content: number
    score: number
    critique: number
    timestamp: number
    _all: number
  }


  export type OralChatHistoryAvgAggregateInputType = {
    score?: true
  }

  export type OralChatHistorySumAggregateInputType = {
    score?: true
  }

  export type OralChatHistoryMinAggregateInputType = {
    id?: true
    sessionId?: true
    role?: true
    content?: true
    score?: true
    critique?: true
    timestamp?: true
  }

  export type OralChatHistoryMaxAggregateInputType = {
    id?: true
    sessionId?: true
    role?: true
    content?: true
    score?: true
    critique?: true
    timestamp?: true
  }

  export type OralChatHistoryCountAggregateInputType = {
    id?: true
    sessionId?: true
    role?: true
    content?: true
    score?: true
    critique?: true
    timestamp?: true
    _all?: true
  }

  export type OralChatHistoryAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which OralChatHistory to aggregate.
     */
    where?: OralChatHistoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OralChatHistories to fetch.
     */
    orderBy?: OralChatHistoryOrderByWithRelationInput | OralChatHistoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: OralChatHistoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OralChatHistories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OralChatHistories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned OralChatHistories
    **/
    _count?: true | OralChatHistoryCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: OralChatHistoryAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: OralChatHistorySumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: OralChatHistoryMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: OralChatHistoryMaxAggregateInputType
  }

  export type GetOralChatHistoryAggregateType<T extends OralChatHistoryAggregateArgs> = {
        [P in keyof T & keyof AggregateOralChatHistory]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateOralChatHistory[P]>
      : GetScalarType<T[P], AggregateOralChatHistory[P]>
  }




  export type OralChatHistoryGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: OralChatHistoryWhereInput
    orderBy?: OralChatHistoryOrderByWithAggregationInput | OralChatHistoryOrderByWithAggregationInput[]
    by: OralChatHistoryScalarFieldEnum[] | OralChatHistoryScalarFieldEnum
    having?: OralChatHistoryScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: OralChatHistoryCountAggregateInputType | true
    _avg?: OralChatHistoryAvgAggregateInputType
    _sum?: OralChatHistorySumAggregateInputType
    _min?: OralChatHistoryMinAggregateInputType
    _max?: OralChatHistoryMaxAggregateInputType
  }

  export type OralChatHistoryGroupByOutputType = {
    id: string
    sessionId: string
    role: string
    content: string
    score: number | null
    critique: string | null
    timestamp: Date
    _count: OralChatHistoryCountAggregateOutputType | null
    _avg: OralChatHistoryAvgAggregateOutputType | null
    _sum: OralChatHistorySumAggregateOutputType | null
    _min: OralChatHistoryMinAggregateOutputType | null
    _max: OralChatHistoryMaxAggregateOutputType | null
  }

  type GetOralChatHistoryGroupByPayload<T extends OralChatHistoryGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<OralChatHistoryGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof OralChatHistoryGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], OralChatHistoryGroupByOutputType[P]>
            : GetScalarType<T[P], OralChatHistoryGroupByOutputType[P]>
        }
      >
    >


  export type OralChatHistorySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sessionId?: boolean
    role?: boolean
    content?: boolean
    score?: boolean
    critique?: boolean
    timestamp?: boolean
    session?: boolean | OralSessionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["oralChatHistory"]>

  export type OralChatHistorySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sessionId?: boolean
    role?: boolean
    content?: boolean
    score?: boolean
    critique?: boolean
    timestamp?: boolean
    session?: boolean | OralSessionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["oralChatHistory"]>

  export type OralChatHistorySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sessionId?: boolean
    role?: boolean
    content?: boolean
    score?: boolean
    critique?: boolean
    timestamp?: boolean
    session?: boolean | OralSessionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["oralChatHistory"]>

  export type OralChatHistorySelectScalar = {
    id?: boolean
    sessionId?: boolean
    role?: boolean
    content?: boolean
    score?: boolean
    critique?: boolean
    timestamp?: boolean
  }

  export type OralChatHistoryOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "sessionId" | "role" | "content" | "score" | "critique" | "timestamp", ExtArgs["result"]["oralChatHistory"]>
  export type OralChatHistoryInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    session?: boolean | OralSessionDefaultArgs<ExtArgs>
  }
  export type OralChatHistoryIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    session?: boolean | OralSessionDefaultArgs<ExtArgs>
  }
  export type OralChatHistoryIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    session?: boolean | OralSessionDefaultArgs<ExtArgs>
  }

  export type $OralChatHistoryPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "OralChatHistory"
    objects: {
      session: Prisma.$OralSessionPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      sessionId: string
      role: string
      content: string
      score: number | null
      critique: string | null
      timestamp: Date
    }, ExtArgs["result"]["oralChatHistory"]>
    composites: {}
  }

  type OralChatHistoryGetPayload<S extends boolean | null | undefined | OralChatHistoryDefaultArgs> = $Result.GetResult<Prisma.$OralChatHistoryPayload, S>

  type OralChatHistoryCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<OralChatHistoryFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: OralChatHistoryCountAggregateInputType | true
    }

  export interface OralChatHistoryDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['OralChatHistory'], meta: { name: 'OralChatHistory' } }
    /**
     * Find zero or one OralChatHistory that matches the filter.
     * @param {OralChatHistoryFindUniqueArgs} args - Arguments to find a OralChatHistory
     * @example
     * // Get one OralChatHistory
     * const oralChatHistory = await prisma.oralChatHistory.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends OralChatHistoryFindUniqueArgs>(args: SelectSubset<T, OralChatHistoryFindUniqueArgs<ExtArgs>>): Prisma__OralChatHistoryClient<$Result.GetResult<Prisma.$OralChatHistoryPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one OralChatHistory that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {OralChatHistoryFindUniqueOrThrowArgs} args - Arguments to find a OralChatHistory
     * @example
     * // Get one OralChatHistory
     * const oralChatHistory = await prisma.oralChatHistory.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends OralChatHistoryFindUniqueOrThrowArgs>(args: SelectSubset<T, OralChatHistoryFindUniqueOrThrowArgs<ExtArgs>>): Prisma__OralChatHistoryClient<$Result.GetResult<Prisma.$OralChatHistoryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first OralChatHistory that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OralChatHistoryFindFirstArgs} args - Arguments to find a OralChatHistory
     * @example
     * // Get one OralChatHistory
     * const oralChatHistory = await prisma.oralChatHistory.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends OralChatHistoryFindFirstArgs>(args?: SelectSubset<T, OralChatHistoryFindFirstArgs<ExtArgs>>): Prisma__OralChatHistoryClient<$Result.GetResult<Prisma.$OralChatHistoryPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first OralChatHistory that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OralChatHistoryFindFirstOrThrowArgs} args - Arguments to find a OralChatHistory
     * @example
     * // Get one OralChatHistory
     * const oralChatHistory = await prisma.oralChatHistory.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends OralChatHistoryFindFirstOrThrowArgs>(args?: SelectSubset<T, OralChatHistoryFindFirstOrThrowArgs<ExtArgs>>): Prisma__OralChatHistoryClient<$Result.GetResult<Prisma.$OralChatHistoryPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more OralChatHistories that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OralChatHistoryFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all OralChatHistories
     * const oralChatHistories = await prisma.oralChatHistory.findMany()
     * 
     * // Get first 10 OralChatHistories
     * const oralChatHistories = await prisma.oralChatHistory.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const oralChatHistoryWithIdOnly = await prisma.oralChatHistory.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends OralChatHistoryFindManyArgs>(args?: SelectSubset<T, OralChatHistoryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OralChatHistoryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a OralChatHistory.
     * @param {OralChatHistoryCreateArgs} args - Arguments to create a OralChatHistory.
     * @example
     * // Create one OralChatHistory
     * const OralChatHistory = await prisma.oralChatHistory.create({
     *   data: {
     *     // ... data to create a OralChatHistory
     *   }
     * })
     * 
     */
    create<T extends OralChatHistoryCreateArgs>(args: SelectSubset<T, OralChatHistoryCreateArgs<ExtArgs>>): Prisma__OralChatHistoryClient<$Result.GetResult<Prisma.$OralChatHistoryPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many OralChatHistories.
     * @param {OralChatHistoryCreateManyArgs} args - Arguments to create many OralChatHistories.
     * @example
     * // Create many OralChatHistories
     * const oralChatHistory = await prisma.oralChatHistory.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends OralChatHistoryCreateManyArgs>(args?: SelectSubset<T, OralChatHistoryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many OralChatHistories and returns the data saved in the database.
     * @param {OralChatHistoryCreateManyAndReturnArgs} args - Arguments to create many OralChatHistories.
     * @example
     * // Create many OralChatHistories
     * const oralChatHistory = await prisma.oralChatHistory.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many OralChatHistories and only return the `id`
     * const oralChatHistoryWithIdOnly = await prisma.oralChatHistory.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends OralChatHistoryCreateManyAndReturnArgs>(args?: SelectSubset<T, OralChatHistoryCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OralChatHistoryPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a OralChatHistory.
     * @param {OralChatHistoryDeleteArgs} args - Arguments to delete one OralChatHistory.
     * @example
     * // Delete one OralChatHistory
     * const OralChatHistory = await prisma.oralChatHistory.delete({
     *   where: {
     *     // ... filter to delete one OralChatHistory
     *   }
     * })
     * 
     */
    delete<T extends OralChatHistoryDeleteArgs>(args: SelectSubset<T, OralChatHistoryDeleteArgs<ExtArgs>>): Prisma__OralChatHistoryClient<$Result.GetResult<Prisma.$OralChatHistoryPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one OralChatHistory.
     * @param {OralChatHistoryUpdateArgs} args - Arguments to update one OralChatHistory.
     * @example
     * // Update one OralChatHistory
     * const oralChatHistory = await prisma.oralChatHistory.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends OralChatHistoryUpdateArgs>(args: SelectSubset<T, OralChatHistoryUpdateArgs<ExtArgs>>): Prisma__OralChatHistoryClient<$Result.GetResult<Prisma.$OralChatHistoryPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more OralChatHistories.
     * @param {OralChatHistoryDeleteManyArgs} args - Arguments to filter OralChatHistories to delete.
     * @example
     * // Delete a few OralChatHistories
     * const { count } = await prisma.oralChatHistory.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends OralChatHistoryDeleteManyArgs>(args?: SelectSubset<T, OralChatHistoryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more OralChatHistories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OralChatHistoryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many OralChatHistories
     * const oralChatHistory = await prisma.oralChatHistory.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends OralChatHistoryUpdateManyArgs>(args: SelectSubset<T, OralChatHistoryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more OralChatHistories and returns the data updated in the database.
     * @param {OralChatHistoryUpdateManyAndReturnArgs} args - Arguments to update many OralChatHistories.
     * @example
     * // Update many OralChatHistories
     * const oralChatHistory = await prisma.oralChatHistory.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more OralChatHistories and only return the `id`
     * const oralChatHistoryWithIdOnly = await prisma.oralChatHistory.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends OralChatHistoryUpdateManyAndReturnArgs>(args: SelectSubset<T, OralChatHistoryUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OralChatHistoryPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one OralChatHistory.
     * @param {OralChatHistoryUpsertArgs} args - Arguments to update or create a OralChatHistory.
     * @example
     * // Update or create a OralChatHistory
     * const oralChatHistory = await prisma.oralChatHistory.upsert({
     *   create: {
     *     // ... data to create a OralChatHistory
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the OralChatHistory we want to update
     *   }
     * })
     */
    upsert<T extends OralChatHistoryUpsertArgs>(args: SelectSubset<T, OralChatHistoryUpsertArgs<ExtArgs>>): Prisma__OralChatHistoryClient<$Result.GetResult<Prisma.$OralChatHistoryPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of OralChatHistories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OralChatHistoryCountArgs} args - Arguments to filter OralChatHistories to count.
     * @example
     * // Count the number of OralChatHistories
     * const count = await prisma.oralChatHistory.count({
     *   where: {
     *     // ... the filter for the OralChatHistories we want to count
     *   }
     * })
    **/
    count<T extends OralChatHistoryCountArgs>(
      args?: Subset<T, OralChatHistoryCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], OralChatHistoryCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a OralChatHistory.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OralChatHistoryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends OralChatHistoryAggregateArgs>(args: Subset<T, OralChatHistoryAggregateArgs>): Prisma.PrismaPromise<GetOralChatHistoryAggregateType<T>>

    /**
     * Group by OralChatHistory.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OralChatHistoryGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends OralChatHistoryGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: OralChatHistoryGroupByArgs['orderBy'] }
        : { orderBy?: OralChatHistoryGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, OralChatHistoryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetOralChatHistoryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the OralChatHistory model
   */
  readonly fields: OralChatHistoryFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for OralChatHistory.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__OralChatHistoryClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    session<T extends OralSessionDefaultArgs<ExtArgs> = {}>(args?: Subset<T, OralSessionDefaultArgs<ExtArgs>>): Prisma__OralSessionClient<$Result.GetResult<Prisma.$OralSessionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the OralChatHistory model
   */
  interface OralChatHistoryFieldRefs {
    readonly id: FieldRef<"OralChatHistory", 'String'>
    readonly sessionId: FieldRef<"OralChatHistory", 'String'>
    readonly role: FieldRef<"OralChatHistory", 'String'>
    readonly content: FieldRef<"OralChatHistory", 'String'>
    readonly score: FieldRef<"OralChatHistory", 'Int'>
    readonly critique: FieldRef<"OralChatHistory", 'String'>
    readonly timestamp: FieldRef<"OralChatHistory", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * OralChatHistory findUnique
   */
  export type OralChatHistoryFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OralChatHistory
     */
    select?: OralChatHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the OralChatHistory
     */
    omit?: OralChatHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OralChatHistoryInclude<ExtArgs> | null
    /**
     * Filter, which OralChatHistory to fetch.
     */
    where: OralChatHistoryWhereUniqueInput
  }

  /**
   * OralChatHistory findUniqueOrThrow
   */
  export type OralChatHistoryFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OralChatHistory
     */
    select?: OralChatHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the OralChatHistory
     */
    omit?: OralChatHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OralChatHistoryInclude<ExtArgs> | null
    /**
     * Filter, which OralChatHistory to fetch.
     */
    where: OralChatHistoryWhereUniqueInput
  }

  /**
   * OralChatHistory findFirst
   */
  export type OralChatHistoryFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OralChatHistory
     */
    select?: OralChatHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the OralChatHistory
     */
    omit?: OralChatHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OralChatHistoryInclude<ExtArgs> | null
    /**
     * Filter, which OralChatHistory to fetch.
     */
    where?: OralChatHistoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OralChatHistories to fetch.
     */
    orderBy?: OralChatHistoryOrderByWithRelationInput | OralChatHistoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for OralChatHistories.
     */
    cursor?: OralChatHistoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OralChatHistories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OralChatHistories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of OralChatHistories.
     */
    distinct?: OralChatHistoryScalarFieldEnum | OralChatHistoryScalarFieldEnum[]
  }

  /**
   * OralChatHistory findFirstOrThrow
   */
  export type OralChatHistoryFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OralChatHistory
     */
    select?: OralChatHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the OralChatHistory
     */
    omit?: OralChatHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OralChatHistoryInclude<ExtArgs> | null
    /**
     * Filter, which OralChatHistory to fetch.
     */
    where?: OralChatHistoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OralChatHistories to fetch.
     */
    orderBy?: OralChatHistoryOrderByWithRelationInput | OralChatHistoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for OralChatHistories.
     */
    cursor?: OralChatHistoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OralChatHistories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OralChatHistories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of OralChatHistories.
     */
    distinct?: OralChatHistoryScalarFieldEnum | OralChatHistoryScalarFieldEnum[]
  }

  /**
   * OralChatHistory findMany
   */
  export type OralChatHistoryFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OralChatHistory
     */
    select?: OralChatHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the OralChatHistory
     */
    omit?: OralChatHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OralChatHistoryInclude<ExtArgs> | null
    /**
     * Filter, which OralChatHistories to fetch.
     */
    where?: OralChatHistoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OralChatHistories to fetch.
     */
    orderBy?: OralChatHistoryOrderByWithRelationInput | OralChatHistoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing OralChatHistories.
     */
    cursor?: OralChatHistoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OralChatHistories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OralChatHistories.
     */
    skip?: number
    distinct?: OralChatHistoryScalarFieldEnum | OralChatHistoryScalarFieldEnum[]
  }

  /**
   * OralChatHistory create
   */
  export type OralChatHistoryCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OralChatHistory
     */
    select?: OralChatHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the OralChatHistory
     */
    omit?: OralChatHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OralChatHistoryInclude<ExtArgs> | null
    /**
     * The data needed to create a OralChatHistory.
     */
    data: XOR<OralChatHistoryCreateInput, OralChatHistoryUncheckedCreateInput>
  }

  /**
   * OralChatHistory createMany
   */
  export type OralChatHistoryCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many OralChatHistories.
     */
    data: OralChatHistoryCreateManyInput | OralChatHistoryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * OralChatHistory createManyAndReturn
   */
  export type OralChatHistoryCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OralChatHistory
     */
    select?: OralChatHistorySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the OralChatHistory
     */
    omit?: OralChatHistoryOmit<ExtArgs> | null
    /**
     * The data used to create many OralChatHistories.
     */
    data: OralChatHistoryCreateManyInput | OralChatHistoryCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OralChatHistoryIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * OralChatHistory update
   */
  export type OralChatHistoryUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OralChatHistory
     */
    select?: OralChatHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the OralChatHistory
     */
    omit?: OralChatHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OralChatHistoryInclude<ExtArgs> | null
    /**
     * The data needed to update a OralChatHistory.
     */
    data: XOR<OralChatHistoryUpdateInput, OralChatHistoryUncheckedUpdateInput>
    /**
     * Choose, which OralChatHistory to update.
     */
    where: OralChatHistoryWhereUniqueInput
  }

  /**
   * OralChatHistory updateMany
   */
  export type OralChatHistoryUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update OralChatHistories.
     */
    data: XOR<OralChatHistoryUpdateManyMutationInput, OralChatHistoryUncheckedUpdateManyInput>
    /**
     * Filter which OralChatHistories to update
     */
    where?: OralChatHistoryWhereInput
    /**
     * Limit how many OralChatHistories to update.
     */
    limit?: number
  }

  /**
   * OralChatHistory updateManyAndReturn
   */
  export type OralChatHistoryUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OralChatHistory
     */
    select?: OralChatHistorySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the OralChatHistory
     */
    omit?: OralChatHistoryOmit<ExtArgs> | null
    /**
     * The data used to update OralChatHistories.
     */
    data: XOR<OralChatHistoryUpdateManyMutationInput, OralChatHistoryUncheckedUpdateManyInput>
    /**
     * Filter which OralChatHistories to update
     */
    where?: OralChatHistoryWhereInput
    /**
     * Limit how many OralChatHistories to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OralChatHistoryIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * OralChatHistory upsert
   */
  export type OralChatHistoryUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OralChatHistory
     */
    select?: OralChatHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the OralChatHistory
     */
    omit?: OralChatHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OralChatHistoryInclude<ExtArgs> | null
    /**
     * The filter to search for the OralChatHistory to update in case it exists.
     */
    where: OralChatHistoryWhereUniqueInput
    /**
     * In case the OralChatHistory found by the `where` argument doesn't exist, create a new OralChatHistory with this data.
     */
    create: XOR<OralChatHistoryCreateInput, OralChatHistoryUncheckedCreateInput>
    /**
     * In case the OralChatHistory was found with the provided `where` argument, update it with this data.
     */
    update: XOR<OralChatHistoryUpdateInput, OralChatHistoryUncheckedUpdateInput>
  }

  /**
   * OralChatHistory delete
   */
  export type OralChatHistoryDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OralChatHistory
     */
    select?: OralChatHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the OralChatHistory
     */
    omit?: OralChatHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OralChatHistoryInclude<ExtArgs> | null
    /**
     * Filter which OralChatHistory to delete.
     */
    where: OralChatHistoryWhereUniqueInput
  }

  /**
   * OralChatHistory deleteMany
   */
  export type OralChatHistoryDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which OralChatHistories to delete
     */
    where?: OralChatHistoryWhereInput
    /**
     * Limit how many OralChatHistories to delete.
     */
    limit?: number
  }

  /**
   * OralChatHistory without action
   */
  export type OralChatHistoryDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OralChatHistory
     */
    select?: OralChatHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the OralChatHistory
     */
    omit?: OralChatHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OralChatHistoryInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const OralSessionScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    resumeId: 'resumeId',
    interviewType: 'interviewType',
    targetRole: 'targetRole',
    targetCompany: 'targetCompany',
    industry: 'industry',
    experienceLevel: 'experienceLevel',
    focusAreas: 'focusAreas',
    interviewGoal: 'interviewGoal',
    durationMins: 'durationMins',
    status: 'status',
    startedAt: 'startedAt',
    completedAt: 'completedAt',
    createdAt: 'createdAt'
  };

  export type OralSessionScalarFieldEnum = (typeof OralSessionScalarFieldEnum)[keyof typeof OralSessionScalarFieldEnum]


  export const OralQuestionScalarFieldEnum: {
    id: 'id',
    sessionId: 'sessionId',
    orderIndex: 'orderIndex',
    questionText: 'questionText',
    questionType: 'questionType',
    difficulty: 'difficulty',
    answerText: 'answerText',
    answeredAt: 'answeredAt',
    timeTakenSecs: 'timeTakenSecs',
    evalScore: 'evalScore',
    evalFeedback: 'evalFeedback',
    evalStrengths: 'evalStrengths',
    evalWeaknesses: 'evalWeaknesses',
    betterAnswer: 'betterAnswer'
  };

  export type OralQuestionScalarFieldEnum = (typeof OralQuestionScalarFieldEnum)[keyof typeof OralQuestionScalarFieldEnum]


  export const OralChatHistoryScalarFieldEnum: {
    id: 'id',
    sessionId: 'sessionId',
    role: 'role',
    content: 'content',
    score: 'score',
    critique: 'critique',
    timestamp: 'timestamp'
  };

  export type OralChatHistoryScalarFieldEnum = (typeof OralChatHistoryScalarFieldEnum)[keyof typeof OralChatHistoryScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type OralSessionWhereInput = {
    AND?: OralSessionWhereInput | OralSessionWhereInput[]
    OR?: OralSessionWhereInput[]
    NOT?: OralSessionWhereInput | OralSessionWhereInput[]
    id?: StringFilter<"OralSession"> | string
    userId?: StringFilter<"OralSession"> | string
    resumeId?: StringNullableFilter<"OralSession"> | string | null
    interviewType?: StringFilter<"OralSession"> | string
    targetRole?: StringFilter<"OralSession"> | string
    targetCompany?: StringNullableFilter<"OralSession"> | string | null
    industry?: StringFilter<"OralSession"> | string
    experienceLevel?: StringFilter<"OralSession"> | string
    focusAreas?: StringNullableListFilter<"OralSession">
    interviewGoal?: StringNullableFilter<"OralSession"> | string | null
    durationMins?: IntFilter<"OralSession"> | number
    status?: StringFilter<"OralSession"> | string
    startedAt?: DateTimeNullableFilter<"OralSession"> | Date | string | null
    completedAt?: DateTimeNullableFilter<"OralSession"> | Date | string | null
    createdAt?: DateTimeFilter<"OralSession"> | Date | string
    questions?: OralQuestionListRelationFilter
    chatHistory?: OralChatHistoryListRelationFilter
  }

  export type OralSessionOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    resumeId?: SortOrderInput | SortOrder
    interviewType?: SortOrder
    targetRole?: SortOrder
    targetCompany?: SortOrderInput | SortOrder
    industry?: SortOrder
    experienceLevel?: SortOrder
    focusAreas?: SortOrder
    interviewGoal?: SortOrderInput | SortOrder
    durationMins?: SortOrder
    status?: SortOrder
    startedAt?: SortOrderInput | SortOrder
    completedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    questions?: OralQuestionOrderByRelationAggregateInput
    chatHistory?: OralChatHistoryOrderByRelationAggregateInput
  }

  export type OralSessionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: OralSessionWhereInput | OralSessionWhereInput[]
    OR?: OralSessionWhereInput[]
    NOT?: OralSessionWhereInput | OralSessionWhereInput[]
    userId?: StringFilter<"OralSession"> | string
    resumeId?: StringNullableFilter<"OralSession"> | string | null
    interviewType?: StringFilter<"OralSession"> | string
    targetRole?: StringFilter<"OralSession"> | string
    targetCompany?: StringNullableFilter<"OralSession"> | string | null
    industry?: StringFilter<"OralSession"> | string
    experienceLevel?: StringFilter<"OralSession"> | string
    focusAreas?: StringNullableListFilter<"OralSession">
    interviewGoal?: StringNullableFilter<"OralSession"> | string | null
    durationMins?: IntFilter<"OralSession"> | number
    status?: StringFilter<"OralSession"> | string
    startedAt?: DateTimeNullableFilter<"OralSession"> | Date | string | null
    completedAt?: DateTimeNullableFilter<"OralSession"> | Date | string | null
    createdAt?: DateTimeFilter<"OralSession"> | Date | string
    questions?: OralQuestionListRelationFilter
    chatHistory?: OralChatHistoryListRelationFilter
  }, "id">

  export type OralSessionOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    resumeId?: SortOrderInput | SortOrder
    interviewType?: SortOrder
    targetRole?: SortOrder
    targetCompany?: SortOrderInput | SortOrder
    industry?: SortOrder
    experienceLevel?: SortOrder
    focusAreas?: SortOrder
    interviewGoal?: SortOrderInput | SortOrder
    durationMins?: SortOrder
    status?: SortOrder
    startedAt?: SortOrderInput | SortOrder
    completedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: OralSessionCountOrderByAggregateInput
    _avg?: OralSessionAvgOrderByAggregateInput
    _max?: OralSessionMaxOrderByAggregateInput
    _min?: OralSessionMinOrderByAggregateInput
    _sum?: OralSessionSumOrderByAggregateInput
  }

  export type OralSessionScalarWhereWithAggregatesInput = {
    AND?: OralSessionScalarWhereWithAggregatesInput | OralSessionScalarWhereWithAggregatesInput[]
    OR?: OralSessionScalarWhereWithAggregatesInput[]
    NOT?: OralSessionScalarWhereWithAggregatesInput | OralSessionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"OralSession"> | string
    userId?: StringWithAggregatesFilter<"OralSession"> | string
    resumeId?: StringNullableWithAggregatesFilter<"OralSession"> | string | null
    interviewType?: StringWithAggregatesFilter<"OralSession"> | string
    targetRole?: StringWithAggregatesFilter<"OralSession"> | string
    targetCompany?: StringNullableWithAggregatesFilter<"OralSession"> | string | null
    industry?: StringWithAggregatesFilter<"OralSession"> | string
    experienceLevel?: StringWithAggregatesFilter<"OralSession"> | string
    focusAreas?: StringNullableListFilter<"OralSession">
    interviewGoal?: StringNullableWithAggregatesFilter<"OralSession"> | string | null
    durationMins?: IntWithAggregatesFilter<"OralSession"> | number
    status?: StringWithAggregatesFilter<"OralSession"> | string
    startedAt?: DateTimeNullableWithAggregatesFilter<"OralSession"> | Date | string | null
    completedAt?: DateTimeNullableWithAggregatesFilter<"OralSession"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"OralSession"> | Date | string
  }

  export type OralQuestionWhereInput = {
    AND?: OralQuestionWhereInput | OralQuestionWhereInput[]
    OR?: OralQuestionWhereInput[]
    NOT?: OralQuestionWhereInput | OralQuestionWhereInput[]
    id?: StringFilter<"OralQuestion"> | string
    sessionId?: StringFilter<"OralQuestion"> | string
    orderIndex?: IntFilter<"OralQuestion"> | number
    questionText?: StringFilter<"OralQuestion"> | string
    questionType?: StringFilter<"OralQuestion"> | string
    difficulty?: StringFilter<"OralQuestion"> | string
    answerText?: StringNullableFilter<"OralQuestion"> | string | null
    answeredAt?: DateTimeNullableFilter<"OralQuestion"> | Date | string | null
    timeTakenSecs?: IntNullableFilter<"OralQuestion"> | number | null
    evalScore?: IntNullableFilter<"OralQuestion"> | number | null
    evalFeedback?: StringNullableFilter<"OralQuestion"> | string | null
    evalStrengths?: StringNullableListFilter<"OralQuestion">
    evalWeaknesses?: StringNullableListFilter<"OralQuestion">
    betterAnswer?: StringNullableFilter<"OralQuestion"> | string | null
    session?: XOR<OralSessionScalarRelationFilter, OralSessionWhereInput>
  }

  export type OralQuestionOrderByWithRelationInput = {
    id?: SortOrder
    sessionId?: SortOrder
    orderIndex?: SortOrder
    questionText?: SortOrder
    questionType?: SortOrder
    difficulty?: SortOrder
    answerText?: SortOrderInput | SortOrder
    answeredAt?: SortOrderInput | SortOrder
    timeTakenSecs?: SortOrderInput | SortOrder
    evalScore?: SortOrderInput | SortOrder
    evalFeedback?: SortOrderInput | SortOrder
    evalStrengths?: SortOrder
    evalWeaknesses?: SortOrder
    betterAnswer?: SortOrderInput | SortOrder
    session?: OralSessionOrderByWithRelationInput
  }

  export type OralQuestionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: OralQuestionWhereInput | OralQuestionWhereInput[]
    OR?: OralQuestionWhereInput[]
    NOT?: OralQuestionWhereInput | OralQuestionWhereInput[]
    sessionId?: StringFilter<"OralQuestion"> | string
    orderIndex?: IntFilter<"OralQuestion"> | number
    questionText?: StringFilter<"OralQuestion"> | string
    questionType?: StringFilter<"OralQuestion"> | string
    difficulty?: StringFilter<"OralQuestion"> | string
    answerText?: StringNullableFilter<"OralQuestion"> | string | null
    answeredAt?: DateTimeNullableFilter<"OralQuestion"> | Date | string | null
    timeTakenSecs?: IntNullableFilter<"OralQuestion"> | number | null
    evalScore?: IntNullableFilter<"OralQuestion"> | number | null
    evalFeedback?: StringNullableFilter<"OralQuestion"> | string | null
    evalStrengths?: StringNullableListFilter<"OralQuestion">
    evalWeaknesses?: StringNullableListFilter<"OralQuestion">
    betterAnswer?: StringNullableFilter<"OralQuestion"> | string | null
    session?: XOR<OralSessionScalarRelationFilter, OralSessionWhereInput>
  }, "id">

  export type OralQuestionOrderByWithAggregationInput = {
    id?: SortOrder
    sessionId?: SortOrder
    orderIndex?: SortOrder
    questionText?: SortOrder
    questionType?: SortOrder
    difficulty?: SortOrder
    answerText?: SortOrderInput | SortOrder
    answeredAt?: SortOrderInput | SortOrder
    timeTakenSecs?: SortOrderInput | SortOrder
    evalScore?: SortOrderInput | SortOrder
    evalFeedback?: SortOrderInput | SortOrder
    evalStrengths?: SortOrder
    evalWeaknesses?: SortOrder
    betterAnswer?: SortOrderInput | SortOrder
    _count?: OralQuestionCountOrderByAggregateInput
    _avg?: OralQuestionAvgOrderByAggregateInput
    _max?: OralQuestionMaxOrderByAggregateInput
    _min?: OralQuestionMinOrderByAggregateInput
    _sum?: OralQuestionSumOrderByAggregateInput
  }

  export type OralQuestionScalarWhereWithAggregatesInput = {
    AND?: OralQuestionScalarWhereWithAggregatesInput | OralQuestionScalarWhereWithAggregatesInput[]
    OR?: OralQuestionScalarWhereWithAggregatesInput[]
    NOT?: OralQuestionScalarWhereWithAggregatesInput | OralQuestionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"OralQuestion"> | string
    sessionId?: StringWithAggregatesFilter<"OralQuestion"> | string
    orderIndex?: IntWithAggregatesFilter<"OralQuestion"> | number
    questionText?: StringWithAggregatesFilter<"OralQuestion"> | string
    questionType?: StringWithAggregatesFilter<"OralQuestion"> | string
    difficulty?: StringWithAggregatesFilter<"OralQuestion"> | string
    answerText?: StringNullableWithAggregatesFilter<"OralQuestion"> | string | null
    answeredAt?: DateTimeNullableWithAggregatesFilter<"OralQuestion"> | Date | string | null
    timeTakenSecs?: IntNullableWithAggregatesFilter<"OralQuestion"> | number | null
    evalScore?: IntNullableWithAggregatesFilter<"OralQuestion"> | number | null
    evalFeedback?: StringNullableWithAggregatesFilter<"OralQuestion"> | string | null
    evalStrengths?: StringNullableListFilter<"OralQuestion">
    evalWeaknesses?: StringNullableListFilter<"OralQuestion">
    betterAnswer?: StringNullableWithAggregatesFilter<"OralQuestion"> | string | null
  }

  export type OralChatHistoryWhereInput = {
    AND?: OralChatHistoryWhereInput | OralChatHistoryWhereInput[]
    OR?: OralChatHistoryWhereInput[]
    NOT?: OralChatHistoryWhereInput | OralChatHistoryWhereInput[]
    id?: StringFilter<"OralChatHistory"> | string
    sessionId?: StringFilter<"OralChatHistory"> | string
    role?: StringFilter<"OralChatHistory"> | string
    content?: StringFilter<"OralChatHistory"> | string
    score?: IntNullableFilter<"OralChatHistory"> | number | null
    critique?: StringNullableFilter<"OralChatHistory"> | string | null
    timestamp?: DateTimeFilter<"OralChatHistory"> | Date | string
    session?: XOR<OralSessionScalarRelationFilter, OralSessionWhereInput>
  }

  export type OralChatHistoryOrderByWithRelationInput = {
    id?: SortOrder
    sessionId?: SortOrder
    role?: SortOrder
    content?: SortOrder
    score?: SortOrderInput | SortOrder
    critique?: SortOrderInput | SortOrder
    timestamp?: SortOrder
    session?: OralSessionOrderByWithRelationInput
  }

  export type OralChatHistoryWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: OralChatHistoryWhereInput | OralChatHistoryWhereInput[]
    OR?: OralChatHistoryWhereInput[]
    NOT?: OralChatHistoryWhereInput | OralChatHistoryWhereInput[]
    sessionId?: StringFilter<"OralChatHistory"> | string
    role?: StringFilter<"OralChatHistory"> | string
    content?: StringFilter<"OralChatHistory"> | string
    score?: IntNullableFilter<"OralChatHistory"> | number | null
    critique?: StringNullableFilter<"OralChatHistory"> | string | null
    timestamp?: DateTimeFilter<"OralChatHistory"> | Date | string
    session?: XOR<OralSessionScalarRelationFilter, OralSessionWhereInput>
  }, "id">

  export type OralChatHistoryOrderByWithAggregationInput = {
    id?: SortOrder
    sessionId?: SortOrder
    role?: SortOrder
    content?: SortOrder
    score?: SortOrderInput | SortOrder
    critique?: SortOrderInput | SortOrder
    timestamp?: SortOrder
    _count?: OralChatHistoryCountOrderByAggregateInput
    _avg?: OralChatHistoryAvgOrderByAggregateInput
    _max?: OralChatHistoryMaxOrderByAggregateInput
    _min?: OralChatHistoryMinOrderByAggregateInput
    _sum?: OralChatHistorySumOrderByAggregateInput
  }

  export type OralChatHistoryScalarWhereWithAggregatesInput = {
    AND?: OralChatHistoryScalarWhereWithAggregatesInput | OralChatHistoryScalarWhereWithAggregatesInput[]
    OR?: OralChatHistoryScalarWhereWithAggregatesInput[]
    NOT?: OralChatHistoryScalarWhereWithAggregatesInput | OralChatHistoryScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"OralChatHistory"> | string
    sessionId?: StringWithAggregatesFilter<"OralChatHistory"> | string
    role?: StringWithAggregatesFilter<"OralChatHistory"> | string
    content?: StringWithAggregatesFilter<"OralChatHistory"> | string
    score?: IntNullableWithAggregatesFilter<"OralChatHistory"> | number | null
    critique?: StringNullableWithAggregatesFilter<"OralChatHistory"> | string | null
    timestamp?: DateTimeWithAggregatesFilter<"OralChatHistory"> | Date | string
  }

  export type OralSessionCreateInput = {
    id?: string
    userId: string
    resumeId?: string | null
    interviewType: string
    targetRole: string
    targetCompany?: string | null
    industry: string
    experienceLevel: string
    focusAreas?: OralSessionCreatefocusAreasInput | string[]
    interviewGoal?: string | null
    durationMins?: number
    status?: string
    startedAt?: Date | string | null
    completedAt?: Date | string | null
    createdAt?: Date | string
    questions?: OralQuestionCreateNestedManyWithoutSessionInput
    chatHistory?: OralChatHistoryCreateNestedManyWithoutSessionInput
  }

  export type OralSessionUncheckedCreateInput = {
    id?: string
    userId: string
    resumeId?: string | null
    interviewType: string
    targetRole: string
    targetCompany?: string | null
    industry: string
    experienceLevel: string
    focusAreas?: OralSessionCreatefocusAreasInput | string[]
    interviewGoal?: string | null
    durationMins?: number
    status?: string
    startedAt?: Date | string | null
    completedAt?: Date | string | null
    createdAt?: Date | string
    questions?: OralQuestionUncheckedCreateNestedManyWithoutSessionInput
    chatHistory?: OralChatHistoryUncheckedCreateNestedManyWithoutSessionInput
  }

  export type OralSessionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    resumeId?: NullableStringFieldUpdateOperationsInput | string | null
    interviewType?: StringFieldUpdateOperationsInput | string
    targetRole?: StringFieldUpdateOperationsInput | string
    targetCompany?: NullableStringFieldUpdateOperationsInput | string | null
    industry?: StringFieldUpdateOperationsInput | string
    experienceLevel?: StringFieldUpdateOperationsInput | string
    focusAreas?: OralSessionUpdatefocusAreasInput | string[]
    interviewGoal?: NullableStringFieldUpdateOperationsInput | string | null
    durationMins?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    questions?: OralQuestionUpdateManyWithoutSessionNestedInput
    chatHistory?: OralChatHistoryUpdateManyWithoutSessionNestedInput
  }

  export type OralSessionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    resumeId?: NullableStringFieldUpdateOperationsInput | string | null
    interviewType?: StringFieldUpdateOperationsInput | string
    targetRole?: StringFieldUpdateOperationsInput | string
    targetCompany?: NullableStringFieldUpdateOperationsInput | string | null
    industry?: StringFieldUpdateOperationsInput | string
    experienceLevel?: StringFieldUpdateOperationsInput | string
    focusAreas?: OralSessionUpdatefocusAreasInput | string[]
    interviewGoal?: NullableStringFieldUpdateOperationsInput | string | null
    durationMins?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    questions?: OralQuestionUncheckedUpdateManyWithoutSessionNestedInput
    chatHistory?: OralChatHistoryUncheckedUpdateManyWithoutSessionNestedInput
  }

  export type OralSessionCreateManyInput = {
    id?: string
    userId: string
    resumeId?: string | null
    interviewType: string
    targetRole: string
    targetCompany?: string | null
    industry: string
    experienceLevel: string
    focusAreas?: OralSessionCreatefocusAreasInput | string[]
    interviewGoal?: string | null
    durationMins?: number
    status?: string
    startedAt?: Date | string | null
    completedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type OralSessionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    resumeId?: NullableStringFieldUpdateOperationsInput | string | null
    interviewType?: StringFieldUpdateOperationsInput | string
    targetRole?: StringFieldUpdateOperationsInput | string
    targetCompany?: NullableStringFieldUpdateOperationsInput | string | null
    industry?: StringFieldUpdateOperationsInput | string
    experienceLevel?: StringFieldUpdateOperationsInput | string
    focusAreas?: OralSessionUpdatefocusAreasInput | string[]
    interviewGoal?: NullableStringFieldUpdateOperationsInput | string | null
    durationMins?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OralSessionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    resumeId?: NullableStringFieldUpdateOperationsInput | string | null
    interviewType?: StringFieldUpdateOperationsInput | string
    targetRole?: StringFieldUpdateOperationsInput | string
    targetCompany?: NullableStringFieldUpdateOperationsInput | string | null
    industry?: StringFieldUpdateOperationsInput | string
    experienceLevel?: StringFieldUpdateOperationsInput | string
    focusAreas?: OralSessionUpdatefocusAreasInput | string[]
    interviewGoal?: NullableStringFieldUpdateOperationsInput | string | null
    durationMins?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OralQuestionCreateInput = {
    id?: string
    orderIndex: number
    questionText: string
    questionType: string
    difficulty: string
    answerText?: string | null
    answeredAt?: Date | string | null
    timeTakenSecs?: number | null
    evalScore?: number | null
    evalFeedback?: string | null
    evalStrengths?: OralQuestionCreateevalStrengthsInput | string[]
    evalWeaknesses?: OralQuestionCreateevalWeaknessesInput | string[]
    betterAnswer?: string | null
    session: OralSessionCreateNestedOneWithoutQuestionsInput
  }

  export type OralQuestionUncheckedCreateInput = {
    id?: string
    sessionId: string
    orderIndex: number
    questionText: string
    questionType: string
    difficulty: string
    answerText?: string | null
    answeredAt?: Date | string | null
    timeTakenSecs?: number | null
    evalScore?: number | null
    evalFeedback?: string | null
    evalStrengths?: OralQuestionCreateevalStrengthsInput | string[]
    evalWeaknesses?: OralQuestionCreateevalWeaknessesInput | string[]
    betterAnswer?: string | null
  }

  export type OralQuestionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    orderIndex?: IntFieldUpdateOperationsInput | number
    questionText?: StringFieldUpdateOperationsInput | string
    questionType?: StringFieldUpdateOperationsInput | string
    difficulty?: StringFieldUpdateOperationsInput | string
    answerText?: NullableStringFieldUpdateOperationsInput | string | null
    answeredAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    timeTakenSecs?: NullableIntFieldUpdateOperationsInput | number | null
    evalScore?: NullableIntFieldUpdateOperationsInput | number | null
    evalFeedback?: NullableStringFieldUpdateOperationsInput | string | null
    evalStrengths?: OralQuestionUpdateevalStrengthsInput | string[]
    evalWeaknesses?: OralQuestionUpdateevalWeaknessesInput | string[]
    betterAnswer?: NullableStringFieldUpdateOperationsInput | string | null
    session?: OralSessionUpdateOneRequiredWithoutQuestionsNestedInput
  }

  export type OralQuestionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionId?: StringFieldUpdateOperationsInput | string
    orderIndex?: IntFieldUpdateOperationsInput | number
    questionText?: StringFieldUpdateOperationsInput | string
    questionType?: StringFieldUpdateOperationsInput | string
    difficulty?: StringFieldUpdateOperationsInput | string
    answerText?: NullableStringFieldUpdateOperationsInput | string | null
    answeredAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    timeTakenSecs?: NullableIntFieldUpdateOperationsInput | number | null
    evalScore?: NullableIntFieldUpdateOperationsInput | number | null
    evalFeedback?: NullableStringFieldUpdateOperationsInput | string | null
    evalStrengths?: OralQuestionUpdateevalStrengthsInput | string[]
    evalWeaknesses?: OralQuestionUpdateevalWeaknessesInput | string[]
    betterAnswer?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type OralQuestionCreateManyInput = {
    id?: string
    sessionId: string
    orderIndex: number
    questionText: string
    questionType: string
    difficulty: string
    answerText?: string | null
    answeredAt?: Date | string | null
    timeTakenSecs?: number | null
    evalScore?: number | null
    evalFeedback?: string | null
    evalStrengths?: OralQuestionCreateevalStrengthsInput | string[]
    evalWeaknesses?: OralQuestionCreateevalWeaknessesInput | string[]
    betterAnswer?: string | null
  }

  export type OralQuestionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    orderIndex?: IntFieldUpdateOperationsInput | number
    questionText?: StringFieldUpdateOperationsInput | string
    questionType?: StringFieldUpdateOperationsInput | string
    difficulty?: StringFieldUpdateOperationsInput | string
    answerText?: NullableStringFieldUpdateOperationsInput | string | null
    answeredAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    timeTakenSecs?: NullableIntFieldUpdateOperationsInput | number | null
    evalScore?: NullableIntFieldUpdateOperationsInput | number | null
    evalFeedback?: NullableStringFieldUpdateOperationsInput | string | null
    evalStrengths?: OralQuestionUpdateevalStrengthsInput | string[]
    evalWeaknesses?: OralQuestionUpdateevalWeaknessesInput | string[]
    betterAnswer?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type OralQuestionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionId?: StringFieldUpdateOperationsInput | string
    orderIndex?: IntFieldUpdateOperationsInput | number
    questionText?: StringFieldUpdateOperationsInput | string
    questionType?: StringFieldUpdateOperationsInput | string
    difficulty?: StringFieldUpdateOperationsInput | string
    answerText?: NullableStringFieldUpdateOperationsInput | string | null
    answeredAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    timeTakenSecs?: NullableIntFieldUpdateOperationsInput | number | null
    evalScore?: NullableIntFieldUpdateOperationsInput | number | null
    evalFeedback?: NullableStringFieldUpdateOperationsInput | string | null
    evalStrengths?: OralQuestionUpdateevalStrengthsInput | string[]
    evalWeaknesses?: OralQuestionUpdateevalWeaknessesInput | string[]
    betterAnswer?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type OralChatHistoryCreateInput = {
    id?: string
    role: string
    content: string
    score?: number | null
    critique?: string | null
    timestamp?: Date | string
    session: OralSessionCreateNestedOneWithoutChatHistoryInput
  }

  export type OralChatHistoryUncheckedCreateInput = {
    id?: string
    sessionId: string
    role: string
    content: string
    score?: number | null
    critique?: string | null
    timestamp?: Date | string
  }

  export type OralChatHistoryUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    score?: NullableIntFieldUpdateOperationsInput | number | null
    critique?: NullableStringFieldUpdateOperationsInput | string | null
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    session?: OralSessionUpdateOneRequiredWithoutChatHistoryNestedInput
  }

  export type OralChatHistoryUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionId?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    score?: NullableIntFieldUpdateOperationsInput | number | null
    critique?: NullableStringFieldUpdateOperationsInput | string | null
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OralChatHistoryCreateManyInput = {
    id?: string
    sessionId: string
    role: string
    content: string
    score?: number | null
    critique?: string | null
    timestamp?: Date | string
  }

  export type OralChatHistoryUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    score?: NullableIntFieldUpdateOperationsInput | number | null
    critique?: NullableStringFieldUpdateOperationsInput | string | null
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OralChatHistoryUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionId?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    score?: NullableIntFieldUpdateOperationsInput | number | null
    critique?: NullableStringFieldUpdateOperationsInput | string | null
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type StringNullableListFilter<$PrismaModel = never> = {
    equals?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    has?: string | StringFieldRefInput<$PrismaModel> | null
    hasEvery?: string[] | ListStringFieldRefInput<$PrismaModel>
    hasSome?: string[] | ListStringFieldRefInput<$PrismaModel>
    isEmpty?: boolean
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type OralQuestionListRelationFilter = {
    every?: OralQuestionWhereInput
    some?: OralQuestionWhereInput
    none?: OralQuestionWhereInput
  }

  export type OralChatHistoryListRelationFilter = {
    every?: OralChatHistoryWhereInput
    some?: OralChatHistoryWhereInput
    none?: OralChatHistoryWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type OralQuestionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type OralChatHistoryOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type OralSessionCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    resumeId?: SortOrder
    interviewType?: SortOrder
    targetRole?: SortOrder
    targetCompany?: SortOrder
    industry?: SortOrder
    experienceLevel?: SortOrder
    focusAreas?: SortOrder
    interviewGoal?: SortOrder
    durationMins?: SortOrder
    status?: SortOrder
    startedAt?: SortOrder
    completedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type OralSessionAvgOrderByAggregateInput = {
    durationMins?: SortOrder
  }

  export type OralSessionMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    resumeId?: SortOrder
    interviewType?: SortOrder
    targetRole?: SortOrder
    targetCompany?: SortOrder
    industry?: SortOrder
    experienceLevel?: SortOrder
    interviewGoal?: SortOrder
    durationMins?: SortOrder
    status?: SortOrder
    startedAt?: SortOrder
    completedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type OralSessionMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    resumeId?: SortOrder
    interviewType?: SortOrder
    targetRole?: SortOrder
    targetCompany?: SortOrder
    industry?: SortOrder
    experienceLevel?: SortOrder
    interviewGoal?: SortOrder
    durationMins?: SortOrder
    status?: SortOrder
    startedAt?: SortOrder
    completedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type OralSessionSumOrderByAggregateInput = {
    durationMins?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type OralSessionScalarRelationFilter = {
    is?: OralSessionWhereInput
    isNot?: OralSessionWhereInput
  }

  export type OralQuestionCountOrderByAggregateInput = {
    id?: SortOrder
    sessionId?: SortOrder
    orderIndex?: SortOrder
    questionText?: SortOrder
    questionType?: SortOrder
    difficulty?: SortOrder
    answerText?: SortOrder
    answeredAt?: SortOrder
    timeTakenSecs?: SortOrder
    evalScore?: SortOrder
    evalFeedback?: SortOrder
    evalStrengths?: SortOrder
    evalWeaknesses?: SortOrder
    betterAnswer?: SortOrder
  }

  export type OralQuestionAvgOrderByAggregateInput = {
    orderIndex?: SortOrder
    timeTakenSecs?: SortOrder
    evalScore?: SortOrder
  }

  export type OralQuestionMaxOrderByAggregateInput = {
    id?: SortOrder
    sessionId?: SortOrder
    orderIndex?: SortOrder
    questionText?: SortOrder
    questionType?: SortOrder
    difficulty?: SortOrder
    answerText?: SortOrder
    answeredAt?: SortOrder
    timeTakenSecs?: SortOrder
    evalScore?: SortOrder
    evalFeedback?: SortOrder
    betterAnswer?: SortOrder
  }

  export type OralQuestionMinOrderByAggregateInput = {
    id?: SortOrder
    sessionId?: SortOrder
    orderIndex?: SortOrder
    questionText?: SortOrder
    questionType?: SortOrder
    difficulty?: SortOrder
    answerText?: SortOrder
    answeredAt?: SortOrder
    timeTakenSecs?: SortOrder
    evalScore?: SortOrder
    evalFeedback?: SortOrder
    betterAnswer?: SortOrder
  }

  export type OralQuestionSumOrderByAggregateInput = {
    orderIndex?: SortOrder
    timeTakenSecs?: SortOrder
    evalScore?: SortOrder
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type OralChatHistoryCountOrderByAggregateInput = {
    id?: SortOrder
    sessionId?: SortOrder
    role?: SortOrder
    content?: SortOrder
    score?: SortOrder
    critique?: SortOrder
    timestamp?: SortOrder
  }

  export type OralChatHistoryAvgOrderByAggregateInput = {
    score?: SortOrder
  }

  export type OralChatHistoryMaxOrderByAggregateInput = {
    id?: SortOrder
    sessionId?: SortOrder
    role?: SortOrder
    content?: SortOrder
    score?: SortOrder
    critique?: SortOrder
    timestamp?: SortOrder
  }

  export type OralChatHistoryMinOrderByAggregateInput = {
    id?: SortOrder
    sessionId?: SortOrder
    role?: SortOrder
    content?: SortOrder
    score?: SortOrder
    critique?: SortOrder
    timestamp?: SortOrder
  }

  export type OralChatHistorySumOrderByAggregateInput = {
    score?: SortOrder
  }

  export type OralSessionCreatefocusAreasInput = {
    set: string[]
  }

  export type OralQuestionCreateNestedManyWithoutSessionInput = {
    create?: XOR<OralQuestionCreateWithoutSessionInput, OralQuestionUncheckedCreateWithoutSessionInput> | OralQuestionCreateWithoutSessionInput[] | OralQuestionUncheckedCreateWithoutSessionInput[]
    connectOrCreate?: OralQuestionCreateOrConnectWithoutSessionInput | OralQuestionCreateOrConnectWithoutSessionInput[]
    createMany?: OralQuestionCreateManySessionInputEnvelope
    connect?: OralQuestionWhereUniqueInput | OralQuestionWhereUniqueInput[]
  }

  export type OralChatHistoryCreateNestedManyWithoutSessionInput = {
    create?: XOR<OralChatHistoryCreateWithoutSessionInput, OralChatHistoryUncheckedCreateWithoutSessionInput> | OralChatHistoryCreateWithoutSessionInput[] | OralChatHistoryUncheckedCreateWithoutSessionInput[]
    connectOrCreate?: OralChatHistoryCreateOrConnectWithoutSessionInput | OralChatHistoryCreateOrConnectWithoutSessionInput[]
    createMany?: OralChatHistoryCreateManySessionInputEnvelope
    connect?: OralChatHistoryWhereUniqueInput | OralChatHistoryWhereUniqueInput[]
  }

  export type OralQuestionUncheckedCreateNestedManyWithoutSessionInput = {
    create?: XOR<OralQuestionCreateWithoutSessionInput, OralQuestionUncheckedCreateWithoutSessionInput> | OralQuestionCreateWithoutSessionInput[] | OralQuestionUncheckedCreateWithoutSessionInput[]
    connectOrCreate?: OralQuestionCreateOrConnectWithoutSessionInput | OralQuestionCreateOrConnectWithoutSessionInput[]
    createMany?: OralQuestionCreateManySessionInputEnvelope
    connect?: OralQuestionWhereUniqueInput | OralQuestionWhereUniqueInput[]
  }

  export type OralChatHistoryUncheckedCreateNestedManyWithoutSessionInput = {
    create?: XOR<OralChatHistoryCreateWithoutSessionInput, OralChatHistoryUncheckedCreateWithoutSessionInput> | OralChatHistoryCreateWithoutSessionInput[] | OralChatHistoryUncheckedCreateWithoutSessionInput[]
    connectOrCreate?: OralChatHistoryCreateOrConnectWithoutSessionInput | OralChatHistoryCreateOrConnectWithoutSessionInput[]
    createMany?: OralChatHistoryCreateManySessionInputEnvelope
    connect?: OralChatHistoryWhereUniqueInput | OralChatHistoryWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type OralSessionUpdatefocusAreasInput = {
    set?: string[]
    push?: string | string[]
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type OralQuestionUpdateManyWithoutSessionNestedInput = {
    create?: XOR<OralQuestionCreateWithoutSessionInput, OralQuestionUncheckedCreateWithoutSessionInput> | OralQuestionCreateWithoutSessionInput[] | OralQuestionUncheckedCreateWithoutSessionInput[]
    connectOrCreate?: OralQuestionCreateOrConnectWithoutSessionInput | OralQuestionCreateOrConnectWithoutSessionInput[]
    upsert?: OralQuestionUpsertWithWhereUniqueWithoutSessionInput | OralQuestionUpsertWithWhereUniqueWithoutSessionInput[]
    createMany?: OralQuestionCreateManySessionInputEnvelope
    set?: OralQuestionWhereUniqueInput | OralQuestionWhereUniqueInput[]
    disconnect?: OralQuestionWhereUniqueInput | OralQuestionWhereUniqueInput[]
    delete?: OralQuestionWhereUniqueInput | OralQuestionWhereUniqueInput[]
    connect?: OralQuestionWhereUniqueInput | OralQuestionWhereUniqueInput[]
    update?: OralQuestionUpdateWithWhereUniqueWithoutSessionInput | OralQuestionUpdateWithWhereUniqueWithoutSessionInput[]
    updateMany?: OralQuestionUpdateManyWithWhereWithoutSessionInput | OralQuestionUpdateManyWithWhereWithoutSessionInput[]
    deleteMany?: OralQuestionScalarWhereInput | OralQuestionScalarWhereInput[]
  }

  export type OralChatHistoryUpdateManyWithoutSessionNestedInput = {
    create?: XOR<OralChatHistoryCreateWithoutSessionInput, OralChatHistoryUncheckedCreateWithoutSessionInput> | OralChatHistoryCreateWithoutSessionInput[] | OralChatHistoryUncheckedCreateWithoutSessionInput[]
    connectOrCreate?: OralChatHistoryCreateOrConnectWithoutSessionInput | OralChatHistoryCreateOrConnectWithoutSessionInput[]
    upsert?: OralChatHistoryUpsertWithWhereUniqueWithoutSessionInput | OralChatHistoryUpsertWithWhereUniqueWithoutSessionInput[]
    createMany?: OralChatHistoryCreateManySessionInputEnvelope
    set?: OralChatHistoryWhereUniqueInput | OralChatHistoryWhereUniqueInput[]
    disconnect?: OralChatHistoryWhereUniqueInput | OralChatHistoryWhereUniqueInput[]
    delete?: OralChatHistoryWhereUniqueInput | OralChatHistoryWhereUniqueInput[]
    connect?: OralChatHistoryWhereUniqueInput | OralChatHistoryWhereUniqueInput[]
    update?: OralChatHistoryUpdateWithWhereUniqueWithoutSessionInput | OralChatHistoryUpdateWithWhereUniqueWithoutSessionInput[]
    updateMany?: OralChatHistoryUpdateManyWithWhereWithoutSessionInput | OralChatHistoryUpdateManyWithWhereWithoutSessionInput[]
    deleteMany?: OralChatHistoryScalarWhereInput | OralChatHistoryScalarWhereInput[]
  }

  export type OralQuestionUncheckedUpdateManyWithoutSessionNestedInput = {
    create?: XOR<OralQuestionCreateWithoutSessionInput, OralQuestionUncheckedCreateWithoutSessionInput> | OralQuestionCreateWithoutSessionInput[] | OralQuestionUncheckedCreateWithoutSessionInput[]
    connectOrCreate?: OralQuestionCreateOrConnectWithoutSessionInput | OralQuestionCreateOrConnectWithoutSessionInput[]
    upsert?: OralQuestionUpsertWithWhereUniqueWithoutSessionInput | OralQuestionUpsertWithWhereUniqueWithoutSessionInput[]
    createMany?: OralQuestionCreateManySessionInputEnvelope
    set?: OralQuestionWhereUniqueInput | OralQuestionWhereUniqueInput[]
    disconnect?: OralQuestionWhereUniqueInput | OralQuestionWhereUniqueInput[]
    delete?: OralQuestionWhereUniqueInput | OralQuestionWhereUniqueInput[]
    connect?: OralQuestionWhereUniqueInput | OralQuestionWhereUniqueInput[]
    update?: OralQuestionUpdateWithWhereUniqueWithoutSessionInput | OralQuestionUpdateWithWhereUniqueWithoutSessionInput[]
    updateMany?: OralQuestionUpdateManyWithWhereWithoutSessionInput | OralQuestionUpdateManyWithWhereWithoutSessionInput[]
    deleteMany?: OralQuestionScalarWhereInput | OralQuestionScalarWhereInput[]
  }

  export type OralChatHistoryUncheckedUpdateManyWithoutSessionNestedInput = {
    create?: XOR<OralChatHistoryCreateWithoutSessionInput, OralChatHistoryUncheckedCreateWithoutSessionInput> | OralChatHistoryCreateWithoutSessionInput[] | OralChatHistoryUncheckedCreateWithoutSessionInput[]
    connectOrCreate?: OralChatHistoryCreateOrConnectWithoutSessionInput | OralChatHistoryCreateOrConnectWithoutSessionInput[]
    upsert?: OralChatHistoryUpsertWithWhereUniqueWithoutSessionInput | OralChatHistoryUpsertWithWhereUniqueWithoutSessionInput[]
    createMany?: OralChatHistoryCreateManySessionInputEnvelope
    set?: OralChatHistoryWhereUniqueInput | OralChatHistoryWhereUniqueInput[]
    disconnect?: OralChatHistoryWhereUniqueInput | OralChatHistoryWhereUniqueInput[]
    delete?: OralChatHistoryWhereUniqueInput | OralChatHistoryWhereUniqueInput[]
    connect?: OralChatHistoryWhereUniqueInput | OralChatHistoryWhereUniqueInput[]
    update?: OralChatHistoryUpdateWithWhereUniqueWithoutSessionInput | OralChatHistoryUpdateWithWhereUniqueWithoutSessionInput[]
    updateMany?: OralChatHistoryUpdateManyWithWhereWithoutSessionInput | OralChatHistoryUpdateManyWithWhereWithoutSessionInput[]
    deleteMany?: OralChatHistoryScalarWhereInput | OralChatHistoryScalarWhereInput[]
  }

  export type OralQuestionCreateevalStrengthsInput = {
    set: string[]
  }

  export type OralQuestionCreateevalWeaknessesInput = {
    set: string[]
  }

  export type OralSessionCreateNestedOneWithoutQuestionsInput = {
    create?: XOR<OralSessionCreateWithoutQuestionsInput, OralSessionUncheckedCreateWithoutQuestionsInput>
    connectOrCreate?: OralSessionCreateOrConnectWithoutQuestionsInput
    connect?: OralSessionWhereUniqueInput
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type OralQuestionUpdateevalStrengthsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type OralQuestionUpdateevalWeaknessesInput = {
    set?: string[]
    push?: string | string[]
  }

  export type OralSessionUpdateOneRequiredWithoutQuestionsNestedInput = {
    create?: XOR<OralSessionCreateWithoutQuestionsInput, OralSessionUncheckedCreateWithoutQuestionsInput>
    connectOrCreate?: OralSessionCreateOrConnectWithoutQuestionsInput
    upsert?: OralSessionUpsertWithoutQuestionsInput
    connect?: OralSessionWhereUniqueInput
    update?: XOR<XOR<OralSessionUpdateToOneWithWhereWithoutQuestionsInput, OralSessionUpdateWithoutQuestionsInput>, OralSessionUncheckedUpdateWithoutQuestionsInput>
  }

  export type OralSessionCreateNestedOneWithoutChatHistoryInput = {
    create?: XOR<OralSessionCreateWithoutChatHistoryInput, OralSessionUncheckedCreateWithoutChatHistoryInput>
    connectOrCreate?: OralSessionCreateOrConnectWithoutChatHistoryInput
    connect?: OralSessionWhereUniqueInput
  }

  export type OralSessionUpdateOneRequiredWithoutChatHistoryNestedInput = {
    create?: XOR<OralSessionCreateWithoutChatHistoryInput, OralSessionUncheckedCreateWithoutChatHistoryInput>
    connectOrCreate?: OralSessionCreateOrConnectWithoutChatHistoryInput
    upsert?: OralSessionUpsertWithoutChatHistoryInput
    connect?: OralSessionWhereUniqueInput
    update?: XOR<XOR<OralSessionUpdateToOneWithWhereWithoutChatHistoryInput, OralSessionUpdateWithoutChatHistoryInput>, OralSessionUncheckedUpdateWithoutChatHistoryInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type OralQuestionCreateWithoutSessionInput = {
    id?: string
    orderIndex: number
    questionText: string
    questionType: string
    difficulty: string
    answerText?: string | null
    answeredAt?: Date | string | null
    timeTakenSecs?: number | null
    evalScore?: number | null
    evalFeedback?: string | null
    evalStrengths?: OralQuestionCreateevalStrengthsInput | string[]
    evalWeaknesses?: OralQuestionCreateevalWeaknessesInput | string[]
    betterAnswer?: string | null
  }

  export type OralQuestionUncheckedCreateWithoutSessionInput = {
    id?: string
    orderIndex: number
    questionText: string
    questionType: string
    difficulty: string
    answerText?: string | null
    answeredAt?: Date | string | null
    timeTakenSecs?: number | null
    evalScore?: number | null
    evalFeedback?: string | null
    evalStrengths?: OralQuestionCreateevalStrengthsInput | string[]
    evalWeaknesses?: OralQuestionCreateevalWeaknessesInput | string[]
    betterAnswer?: string | null
  }

  export type OralQuestionCreateOrConnectWithoutSessionInput = {
    where: OralQuestionWhereUniqueInput
    create: XOR<OralQuestionCreateWithoutSessionInput, OralQuestionUncheckedCreateWithoutSessionInput>
  }

  export type OralQuestionCreateManySessionInputEnvelope = {
    data: OralQuestionCreateManySessionInput | OralQuestionCreateManySessionInput[]
    skipDuplicates?: boolean
  }

  export type OralChatHistoryCreateWithoutSessionInput = {
    id?: string
    role: string
    content: string
    score?: number | null
    critique?: string | null
    timestamp?: Date | string
  }

  export type OralChatHistoryUncheckedCreateWithoutSessionInput = {
    id?: string
    role: string
    content: string
    score?: number | null
    critique?: string | null
    timestamp?: Date | string
  }

  export type OralChatHistoryCreateOrConnectWithoutSessionInput = {
    where: OralChatHistoryWhereUniqueInput
    create: XOR<OralChatHistoryCreateWithoutSessionInput, OralChatHistoryUncheckedCreateWithoutSessionInput>
  }

  export type OralChatHistoryCreateManySessionInputEnvelope = {
    data: OralChatHistoryCreateManySessionInput | OralChatHistoryCreateManySessionInput[]
    skipDuplicates?: boolean
  }

  export type OralQuestionUpsertWithWhereUniqueWithoutSessionInput = {
    where: OralQuestionWhereUniqueInput
    update: XOR<OralQuestionUpdateWithoutSessionInput, OralQuestionUncheckedUpdateWithoutSessionInput>
    create: XOR<OralQuestionCreateWithoutSessionInput, OralQuestionUncheckedCreateWithoutSessionInput>
  }

  export type OralQuestionUpdateWithWhereUniqueWithoutSessionInput = {
    where: OralQuestionWhereUniqueInput
    data: XOR<OralQuestionUpdateWithoutSessionInput, OralQuestionUncheckedUpdateWithoutSessionInput>
  }

  export type OralQuestionUpdateManyWithWhereWithoutSessionInput = {
    where: OralQuestionScalarWhereInput
    data: XOR<OralQuestionUpdateManyMutationInput, OralQuestionUncheckedUpdateManyWithoutSessionInput>
  }

  export type OralQuestionScalarWhereInput = {
    AND?: OralQuestionScalarWhereInput | OralQuestionScalarWhereInput[]
    OR?: OralQuestionScalarWhereInput[]
    NOT?: OralQuestionScalarWhereInput | OralQuestionScalarWhereInput[]
    id?: StringFilter<"OralQuestion"> | string
    sessionId?: StringFilter<"OralQuestion"> | string
    orderIndex?: IntFilter<"OralQuestion"> | number
    questionText?: StringFilter<"OralQuestion"> | string
    questionType?: StringFilter<"OralQuestion"> | string
    difficulty?: StringFilter<"OralQuestion"> | string
    answerText?: StringNullableFilter<"OralQuestion"> | string | null
    answeredAt?: DateTimeNullableFilter<"OralQuestion"> | Date | string | null
    timeTakenSecs?: IntNullableFilter<"OralQuestion"> | number | null
    evalScore?: IntNullableFilter<"OralQuestion"> | number | null
    evalFeedback?: StringNullableFilter<"OralQuestion"> | string | null
    evalStrengths?: StringNullableListFilter<"OralQuestion">
    evalWeaknesses?: StringNullableListFilter<"OralQuestion">
    betterAnswer?: StringNullableFilter<"OralQuestion"> | string | null
  }

  export type OralChatHistoryUpsertWithWhereUniqueWithoutSessionInput = {
    where: OralChatHistoryWhereUniqueInput
    update: XOR<OralChatHistoryUpdateWithoutSessionInput, OralChatHistoryUncheckedUpdateWithoutSessionInput>
    create: XOR<OralChatHistoryCreateWithoutSessionInput, OralChatHistoryUncheckedCreateWithoutSessionInput>
  }

  export type OralChatHistoryUpdateWithWhereUniqueWithoutSessionInput = {
    where: OralChatHistoryWhereUniqueInput
    data: XOR<OralChatHistoryUpdateWithoutSessionInput, OralChatHistoryUncheckedUpdateWithoutSessionInput>
  }

  export type OralChatHistoryUpdateManyWithWhereWithoutSessionInput = {
    where: OralChatHistoryScalarWhereInput
    data: XOR<OralChatHistoryUpdateManyMutationInput, OralChatHistoryUncheckedUpdateManyWithoutSessionInput>
  }

  export type OralChatHistoryScalarWhereInput = {
    AND?: OralChatHistoryScalarWhereInput | OralChatHistoryScalarWhereInput[]
    OR?: OralChatHistoryScalarWhereInput[]
    NOT?: OralChatHistoryScalarWhereInput | OralChatHistoryScalarWhereInput[]
    id?: StringFilter<"OralChatHistory"> | string
    sessionId?: StringFilter<"OralChatHistory"> | string
    role?: StringFilter<"OralChatHistory"> | string
    content?: StringFilter<"OralChatHistory"> | string
    score?: IntNullableFilter<"OralChatHistory"> | number | null
    critique?: StringNullableFilter<"OralChatHistory"> | string | null
    timestamp?: DateTimeFilter<"OralChatHistory"> | Date | string
  }

  export type OralSessionCreateWithoutQuestionsInput = {
    id?: string
    userId: string
    resumeId?: string | null
    interviewType: string
    targetRole: string
    targetCompany?: string | null
    industry: string
    experienceLevel: string
    focusAreas?: OralSessionCreatefocusAreasInput | string[]
    interviewGoal?: string | null
    durationMins?: number
    status?: string
    startedAt?: Date | string | null
    completedAt?: Date | string | null
    createdAt?: Date | string
    chatHistory?: OralChatHistoryCreateNestedManyWithoutSessionInput
  }

  export type OralSessionUncheckedCreateWithoutQuestionsInput = {
    id?: string
    userId: string
    resumeId?: string | null
    interviewType: string
    targetRole: string
    targetCompany?: string | null
    industry: string
    experienceLevel: string
    focusAreas?: OralSessionCreatefocusAreasInput | string[]
    interviewGoal?: string | null
    durationMins?: number
    status?: string
    startedAt?: Date | string | null
    completedAt?: Date | string | null
    createdAt?: Date | string
    chatHistory?: OralChatHistoryUncheckedCreateNestedManyWithoutSessionInput
  }

  export type OralSessionCreateOrConnectWithoutQuestionsInput = {
    where: OralSessionWhereUniqueInput
    create: XOR<OralSessionCreateWithoutQuestionsInput, OralSessionUncheckedCreateWithoutQuestionsInput>
  }

  export type OralSessionUpsertWithoutQuestionsInput = {
    update: XOR<OralSessionUpdateWithoutQuestionsInput, OralSessionUncheckedUpdateWithoutQuestionsInput>
    create: XOR<OralSessionCreateWithoutQuestionsInput, OralSessionUncheckedCreateWithoutQuestionsInput>
    where?: OralSessionWhereInput
  }

  export type OralSessionUpdateToOneWithWhereWithoutQuestionsInput = {
    where?: OralSessionWhereInput
    data: XOR<OralSessionUpdateWithoutQuestionsInput, OralSessionUncheckedUpdateWithoutQuestionsInput>
  }

  export type OralSessionUpdateWithoutQuestionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    resumeId?: NullableStringFieldUpdateOperationsInput | string | null
    interviewType?: StringFieldUpdateOperationsInput | string
    targetRole?: StringFieldUpdateOperationsInput | string
    targetCompany?: NullableStringFieldUpdateOperationsInput | string | null
    industry?: StringFieldUpdateOperationsInput | string
    experienceLevel?: StringFieldUpdateOperationsInput | string
    focusAreas?: OralSessionUpdatefocusAreasInput | string[]
    interviewGoal?: NullableStringFieldUpdateOperationsInput | string | null
    durationMins?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    chatHistory?: OralChatHistoryUpdateManyWithoutSessionNestedInput
  }

  export type OralSessionUncheckedUpdateWithoutQuestionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    resumeId?: NullableStringFieldUpdateOperationsInput | string | null
    interviewType?: StringFieldUpdateOperationsInput | string
    targetRole?: StringFieldUpdateOperationsInput | string
    targetCompany?: NullableStringFieldUpdateOperationsInput | string | null
    industry?: StringFieldUpdateOperationsInput | string
    experienceLevel?: StringFieldUpdateOperationsInput | string
    focusAreas?: OralSessionUpdatefocusAreasInput | string[]
    interviewGoal?: NullableStringFieldUpdateOperationsInput | string | null
    durationMins?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    chatHistory?: OralChatHistoryUncheckedUpdateManyWithoutSessionNestedInput
  }

  export type OralSessionCreateWithoutChatHistoryInput = {
    id?: string
    userId: string
    resumeId?: string | null
    interviewType: string
    targetRole: string
    targetCompany?: string | null
    industry: string
    experienceLevel: string
    focusAreas?: OralSessionCreatefocusAreasInput | string[]
    interviewGoal?: string | null
    durationMins?: number
    status?: string
    startedAt?: Date | string | null
    completedAt?: Date | string | null
    createdAt?: Date | string
    questions?: OralQuestionCreateNestedManyWithoutSessionInput
  }

  export type OralSessionUncheckedCreateWithoutChatHistoryInput = {
    id?: string
    userId: string
    resumeId?: string | null
    interviewType: string
    targetRole: string
    targetCompany?: string | null
    industry: string
    experienceLevel: string
    focusAreas?: OralSessionCreatefocusAreasInput | string[]
    interviewGoal?: string | null
    durationMins?: number
    status?: string
    startedAt?: Date | string | null
    completedAt?: Date | string | null
    createdAt?: Date | string
    questions?: OralQuestionUncheckedCreateNestedManyWithoutSessionInput
  }

  export type OralSessionCreateOrConnectWithoutChatHistoryInput = {
    where: OralSessionWhereUniqueInput
    create: XOR<OralSessionCreateWithoutChatHistoryInput, OralSessionUncheckedCreateWithoutChatHistoryInput>
  }

  export type OralSessionUpsertWithoutChatHistoryInput = {
    update: XOR<OralSessionUpdateWithoutChatHistoryInput, OralSessionUncheckedUpdateWithoutChatHistoryInput>
    create: XOR<OralSessionCreateWithoutChatHistoryInput, OralSessionUncheckedCreateWithoutChatHistoryInput>
    where?: OralSessionWhereInput
  }

  export type OralSessionUpdateToOneWithWhereWithoutChatHistoryInput = {
    where?: OralSessionWhereInput
    data: XOR<OralSessionUpdateWithoutChatHistoryInput, OralSessionUncheckedUpdateWithoutChatHistoryInput>
  }

  export type OralSessionUpdateWithoutChatHistoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    resumeId?: NullableStringFieldUpdateOperationsInput | string | null
    interviewType?: StringFieldUpdateOperationsInput | string
    targetRole?: StringFieldUpdateOperationsInput | string
    targetCompany?: NullableStringFieldUpdateOperationsInput | string | null
    industry?: StringFieldUpdateOperationsInput | string
    experienceLevel?: StringFieldUpdateOperationsInput | string
    focusAreas?: OralSessionUpdatefocusAreasInput | string[]
    interviewGoal?: NullableStringFieldUpdateOperationsInput | string | null
    durationMins?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    questions?: OralQuestionUpdateManyWithoutSessionNestedInput
  }

  export type OralSessionUncheckedUpdateWithoutChatHistoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    resumeId?: NullableStringFieldUpdateOperationsInput | string | null
    interviewType?: StringFieldUpdateOperationsInput | string
    targetRole?: StringFieldUpdateOperationsInput | string
    targetCompany?: NullableStringFieldUpdateOperationsInput | string | null
    industry?: StringFieldUpdateOperationsInput | string
    experienceLevel?: StringFieldUpdateOperationsInput | string
    focusAreas?: OralSessionUpdatefocusAreasInput | string[]
    interviewGoal?: NullableStringFieldUpdateOperationsInput | string | null
    durationMins?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    questions?: OralQuestionUncheckedUpdateManyWithoutSessionNestedInput
  }

  export type OralQuestionCreateManySessionInput = {
    id?: string
    orderIndex: number
    questionText: string
    questionType: string
    difficulty: string
    answerText?: string | null
    answeredAt?: Date | string | null
    timeTakenSecs?: number | null
    evalScore?: number | null
    evalFeedback?: string | null
    evalStrengths?: OralQuestionCreateevalStrengthsInput | string[]
    evalWeaknesses?: OralQuestionCreateevalWeaknessesInput | string[]
    betterAnswer?: string | null
  }

  export type OralChatHistoryCreateManySessionInput = {
    id?: string
    role: string
    content: string
    score?: number | null
    critique?: string | null
    timestamp?: Date | string
  }

  export type OralQuestionUpdateWithoutSessionInput = {
    id?: StringFieldUpdateOperationsInput | string
    orderIndex?: IntFieldUpdateOperationsInput | number
    questionText?: StringFieldUpdateOperationsInput | string
    questionType?: StringFieldUpdateOperationsInput | string
    difficulty?: StringFieldUpdateOperationsInput | string
    answerText?: NullableStringFieldUpdateOperationsInput | string | null
    answeredAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    timeTakenSecs?: NullableIntFieldUpdateOperationsInput | number | null
    evalScore?: NullableIntFieldUpdateOperationsInput | number | null
    evalFeedback?: NullableStringFieldUpdateOperationsInput | string | null
    evalStrengths?: OralQuestionUpdateevalStrengthsInput | string[]
    evalWeaknesses?: OralQuestionUpdateevalWeaknessesInput | string[]
    betterAnswer?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type OralQuestionUncheckedUpdateWithoutSessionInput = {
    id?: StringFieldUpdateOperationsInput | string
    orderIndex?: IntFieldUpdateOperationsInput | number
    questionText?: StringFieldUpdateOperationsInput | string
    questionType?: StringFieldUpdateOperationsInput | string
    difficulty?: StringFieldUpdateOperationsInput | string
    answerText?: NullableStringFieldUpdateOperationsInput | string | null
    answeredAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    timeTakenSecs?: NullableIntFieldUpdateOperationsInput | number | null
    evalScore?: NullableIntFieldUpdateOperationsInput | number | null
    evalFeedback?: NullableStringFieldUpdateOperationsInput | string | null
    evalStrengths?: OralQuestionUpdateevalStrengthsInput | string[]
    evalWeaknesses?: OralQuestionUpdateevalWeaknessesInput | string[]
    betterAnswer?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type OralQuestionUncheckedUpdateManyWithoutSessionInput = {
    id?: StringFieldUpdateOperationsInput | string
    orderIndex?: IntFieldUpdateOperationsInput | number
    questionText?: StringFieldUpdateOperationsInput | string
    questionType?: StringFieldUpdateOperationsInput | string
    difficulty?: StringFieldUpdateOperationsInput | string
    answerText?: NullableStringFieldUpdateOperationsInput | string | null
    answeredAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    timeTakenSecs?: NullableIntFieldUpdateOperationsInput | number | null
    evalScore?: NullableIntFieldUpdateOperationsInput | number | null
    evalFeedback?: NullableStringFieldUpdateOperationsInput | string | null
    evalStrengths?: OralQuestionUpdateevalStrengthsInput | string[]
    evalWeaknesses?: OralQuestionUpdateevalWeaknessesInput | string[]
    betterAnswer?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type OralChatHistoryUpdateWithoutSessionInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    score?: NullableIntFieldUpdateOperationsInput | number | null
    critique?: NullableStringFieldUpdateOperationsInput | string | null
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OralChatHistoryUncheckedUpdateWithoutSessionInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    score?: NullableIntFieldUpdateOperationsInput | number | null
    critique?: NullableStringFieldUpdateOperationsInput | string | null
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OralChatHistoryUncheckedUpdateManyWithoutSessionInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    score?: NullableIntFieldUpdateOperationsInput | number | null
    critique?: NullableStringFieldUpdateOperationsInput | string | null
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}