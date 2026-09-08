
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
 * Model CodingSession
 * 
 */
export type CodingSession = $Result.DefaultSelection<Prisma.$CodingSessionPayload>
/**
 * Model PreDefinedProblem
 * 
 */
export type PreDefinedProblem = $Result.DefaultSelection<Prisma.$PreDefinedProblemPayload>
/**
 * Model CodeExecutionDelta
 * 
 */
export type CodeExecutionDelta = $Result.DefaultSelection<Prisma.$CodeExecutionDeltaPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more CodingSessions
 * const codingSessions = await prisma.codingSession.findMany()
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
   * // Fetch zero or more CodingSessions
   * const codingSessions = await prisma.codingSession.findMany()
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
   * `prisma.codingSession`: Exposes CRUD operations for the **CodingSession** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more CodingSessions
    * const codingSessions = await prisma.codingSession.findMany()
    * ```
    */
  get codingSession(): Prisma.CodingSessionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.preDefinedProblem`: Exposes CRUD operations for the **PreDefinedProblem** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PreDefinedProblems
    * const preDefinedProblems = await prisma.preDefinedProblem.findMany()
    * ```
    */
  get preDefinedProblem(): Prisma.PreDefinedProblemDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.codeExecutionDelta`: Exposes CRUD operations for the **CodeExecutionDelta** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more CodeExecutionDeltas
    * const codeExecutionDeltas = await prisma.codeExecutionDelta.findMany()
    * ```
    */
  get codeExecutionDelta(): Prisma.CodeExecutionDeltaDelegate<ExtArgs, ClientOptions>;
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
    CodingSession: 'CodingSession',
    PreDefinedProblem: 'PreDefinedProblem',
    CodeExecutionDelta: 'CodeExecutionDelta'
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
      modelProps: "codingSession" | "preDefinedProblem" | "codeExecutionDelta"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      CodingSession: {
        payload: Prisma.$CodingSessionPayload<ExtArgs>
        fields: Prisma.CodingSessionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CodingSessionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CodingSessionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CodingSessionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CodingSessionPayload>
          }
          findFirst: {
            args: Prisma.CodingSessionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CodingSessionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CodingSessionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CodingSessionPayload>
          }
          findMany: {
            args: Prisma.CodingSessionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CodingSessionPayload>[]
          }
          create: {
            args: Prisma.CodingSessionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CodingSessionPayload>
          }
          createMany: {
            args: Prisma.CodingSessionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CodingSessionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CodingSessionPayload>[]
          }
          delete: {
            args: Prisma.CodingSessionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CodingSessionPayload>
          }
          update: {
            args: Prisma.CodingSessionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CodingSessionPayload>
          }
          deleteMany: {
            args: Prisma.CodingSessionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CodingSessionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.CodingSessionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CodingSessionPayload>[]
          }
          upsert: {
            args: Prisma.CodingSessionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CodingSessionPayload>
          }
          aggregate: {
            args: Prisma.CodingSessionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCodingSession>
          }
          groupBy: {
            args: Prisma.CodingSessionGroupByArgs<ExtArgs>
            result: $Utils.Optional<CodingSessionGroupByOutputType>[]
          }
          count: {
            args: Prisma.CodingSessionCountArgs<ExtArgs>
            result: $Utils.Optional<CodingSessionCountAggregateOutputType> | number
          }
        }
      }
      PreDefinedProblem: {
        payload: Prisma.$PreDefinedProblemPayload<ExtArgs>
        fields: Prisma.PreDefinedProblemFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PreDefinedProblemFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PreDefinedProblemPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PreDefinedProblemFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PreDefinedProblemPayload>
          }
          findFirst: {
            args: Prisma.PreDefinedProblemFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PreDefinedProblemPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PreDefinedProblemFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PreDefinedProblemPayload>
          }
          findMany: {
            args: Prisma.PreDefinedProblemFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PreDefinedProblemPayload>[]
          }
          create: {
            args: Prisma.PreDefinedProblemCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PreDefinedProblemPayload>
          }
          createMany: {
            args: Prisma.PreDefinedProblemCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PreDefinedProblemCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PreDefinedProblemPayload>[]
          }
          delete: {
            args: Prisma.PreDefinedProblemDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PreDefinedProblemPayload>
          }
          update: {
            args: Prisma.PreDefinedProblemUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PreDefinedProblemPayload>
          }
          deleteMany: {
            args: Prisma.PreDefinedProblemDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PreDefinedProblemUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PreDefinedProblemUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PreDefinedProblemPayload>[]
          }
          upsert: {
            args: Prisma.PreDefinedProblemUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PreDefinedProblemPayload>
          }
          aggregate: {
            args: Prisma.PreDefinedProblemAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePreDefinedProblem>
          }
          groupBy: {
            args: Prisma.PreDefinedProblemGroupByArgs<ExtArgs>
            result: $Utils.Optional<PreDefinedProblemGroupByOutputType>[]
          }
          count: {
            args: Prisma.PreDefinedProblemCountArgs<ExtArgs>
            result: $Utils.Optional<PreDefinedProblemCountAggregateOutputType> | number
          }
        }
      }
      CodeExecutionDelta: {
        payload: Prisma.$CodeExecutionDeltaPayload<ExtArgs>
        fields: Prisma.CodeExecutionDeltaFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CodeExecutionDeltaFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CodeExecutionDeltaPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CodeExecutionDeltaFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CodeExecutionDeltaPayload>
          }
          findFirst: {
            args: Prisma.CodeExecutionDeltaFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CodeExecutionDeltaPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CodeExecutionDeltaFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CodeExecutionDeltaPayload>
          }
          findMany: {
            args: Prisma.CodeExecutionDeltaFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CodeExecutionDeltaPayload>[]
          }
          create: {
            args: Prisma.CodeExecutionDeltaCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CodeExecutionDeltaPayload>
          }
          createMany: {
            args: Prisma.CodeExecutionDeltaCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CodeExecutionDeltaCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CodeExecutionDeltaPayload>[]
          }
          delete: {
            args: Prisma.CodeExecutionDeltaDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CodeExecutionDeltaPayload>
          }
          update: {
            args: Prisma.CodeExecutionDeltaUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CodeExecutionDeltaPayload>
          }
          deleteMany: {
            args: Prisma.CodeExecutionDeltaDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CodeExecutionDeltaUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.CodeExecutionDeltaUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CodeExecutionDeltaPayload>[]
          }
          upsert: {
            args: Prisma.CodeExecutionDeltaUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CodeExecutionDeltaPayload>
          }
          aggregate: {
            args: Prisma.CodeExecutionDeltaAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCodeExecutionDelta>
          }
          groupBy: {
            args: Prisma.CodeExecutionDeltaGroupByArgs<ExtArgs>
            result: $Utils.Optional<CodeExecutionDeltaGroupByOutputType>[]
          }
          count: {
            args: Prisma.CodeExecutionDeltaCountArgs<ExtArgs>
            result: $Utils.Optional<CodeExecutionDeltaCountAggregateOutputType> | number
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
    codingSession?: CodingSessionOmit
    preDefinedProblem?: PreDefinedProblemOmit
    codeExecutionDelta?: CodeExecutionDeltaOmit
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
   * Count Type CodingSessionCountOutputType
   */

  export type CodingSessionCountOutputType = {
    executionDeltas: number
  }

  export type CodingSessionCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    executionDeltas?: boolean | CodingSessionCountOutputTypeCountExecutionDeltasArgs
  }

  // Custom InputTypes
  /**
   * CodingSessionCountOutputType without action
   */
  export type CodingSessionCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CodingSessionCountOutputType
     */
    select?: CodingSessionCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * CodingSessionCountOutputType without action
   */
  export type CodingSessionCountOutputTypeCountExecutionDeltasArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CodeExecutionDeltaWhereInput
  }


  /**
   * Models
   */

  /**
   * Model CodingSession
   */

  export type AggregateCodingSession = {
    _count: CodingSessionCountAggregateOutputType | null
    _avg: CodingSessionAvgAggregateOutputType | null
    _sum: CodingSessionSumAggregateOutputType | null
    _min: CodingSessionMinAggregateOutputType | null
    _max: CodingSessionMaxAggregateOutputType | null
  }

  export type CodingSessionAvgAggregateOutputType = {
    testCasesPassed: number | null
  }

  export type CodingSessionSumAggregateOutputType = {
    testCasesPassed: number | null
  }

  export type CodingSessionMinAggregateOutputType = {
    id: string | null
    userId: string | null
    targetRole: string | null
    difficulty: string | null
    selectedLanguage: string | null
    status: string | null
    testCasesPassed: number | null
    startedAt: Date | null
    completedAt: Date | null
  }

  export type CodingSessionMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    targetRole: string | null
    difficulty: string | null
    selectedLanguage: string | null
    status: string | null
    testCasesPassed: number | null
    startedAt: Date | null
    completedAt: Date | null
  }

  export type CodingSessionCountAggregateOutputType = {
    id: number
    userId: number
    targetRole: number
    difficulty: number
    selectedLanguage: number
    status: number
    testCasesPassed: number
    startedAt: number
    completedAt: number
    _all: number
  }


  export type CodingSessionAvgAggregateInputType = {
    testCasesPassed?: true
  }

  export type CodingSessionSumAggregateInputType = {
    testCasesPassed?: true
  }

  export type CodingSessionMinAggregateInputType = {
    id?: true
    userId?: true
    targetRole?: true
    difficulty?: true
    selectedLanguage?: true
    status?: true
    testCasesPassed?: true
    startedAt?: true
    completedAt?: true
  }

  export type CodingSessionMaxAggregateInputType = {
    id?: true
    userId?: true
    targetRole?: true
    difficulty?: true
    selectedLanguage?: true
    status?: true
    testCasesPassed?: true
    startedAt?: true
    completedAt?: true
  }

  export type CodingSessionCountAggregateInputType = {
    id?: true
    userId?: true
    targetRole?: true
    difficulty?: true
    selectedLanguage?: true
    status?: true
    testCasesPassed?: true
    startedAt?: true
    completedAt?: true
    _all?: true
  }

  export type CodingSessionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CodingSession to aggregate.
     */
    where?: CodingSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CodingSessions to fetch.
     */
    orderBy?: CodingSessionOrderByWithRelationInput | CodingSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CodingSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CodingSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CodingSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned CodingSessions
    **/
    _count?: true | CodingSessionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CodingSessionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CodingSessionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CodingSessionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CodingSessionMaxAggregateInputType
  }

  export type GetCodingSessionAggregateType<T extends CodingSessionAggregateArgs> = {
        [P in keyof T & keyof AggregateCodingSession]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCodingSession[P]>
      : GetScalarType<T[P], AggregateCodingSession[P]>
  }




  export type CodingSessionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CodingSessionWhereInput
    orderBy?: CodingSessionOrderByWithAggregationInput | CodingSessionOrderByWithAggregationInput[]
    by: CodingSessionScalarFieldEnum[] | CodingSessionScalarFieldEnum
    having?: CodingSessionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CodingSessionCountAggregateInputType | true
    _avg?: CodingSessionAvgAggregateInputType
    _sum?: CodingSessionSumAggregateInputType
    _min?: CodingSessionMinAggregateInputType
    _max?: CodingSessionMaxAggregateInputType
  }

  export type CodingSessionGroupByOutputType = {
    id: string
    userId: string
    targetRole: string
    difficulty: string
    selectedLanguage: string
    status: string
    testCasesPassed: number | null
    startedAt: Date
    completedAt: Date | null
    _count: CodingSessionCountAggregateOutputType | null
    _avg: CodingSessionAvgAggregateOutputType | null
    _sum: CodingSessionSumAggregateOutputType | null
    _min: CodingSessionMinAggregateOutputType | null
    _max: CodingSessionMaxAggregateOutputType | null
  }

  type GetCodingSessionGroupByPayload<T extends CodingSessionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CodingSessionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CodingSessionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CodingSessionGroupByOutputType[P]>
            : GetScalarType<T[P], CodingSessionGroupByOutputType[P]>
        }
      >
    >


  export type CodingSessionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    targetRole?: boolean
    difficulty?: boolean
    selectedLanguage?: boolean
    status?: boolean
    testCasesPassed?: boolean
    startedAt?: boolean
    completedAt?: boolean
    executionDeltas?: boolean | CodingSession$executionDeltasArgs<ExtArgs>
    _count?: boolean | CodingSessionCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["codingSession"]>

  export type CodingSessionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    targetRole?: boolean
    difficulty?: boolean
    selectedLanguage?: boolean
    status?: boolean
    testCasesPassed?: boolean
    startedAt?: boolean
    completedAt?: boolean
  }, ExtArgs["result"]["codingSession"]>

  export type CodingSessionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    targetRole?: boolean
    difficulty?: boolean
    selectedLanguage?: boolean
    status?: boolean
    testCasesPassed?: boolean
    startedAt?: boolean
    completedAt?: boolean
  }, ExtArgs["result"]["codingSession"]>

  export type CodingSessionSelectScalar = {
    id?: boolean
    userId?: boolean
    targetRole?: boolean
    difficulty?: boolean
    selectedLanguage?: boolean
    status?: boolean
    testCasesPassed?: boolean
    startedAt?: boolean
    completedAt?: boolean
  }

  export type CodingSessionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "targetRole" | "difficulty" | "selectedLanguage" | "status" | "testCasesPassed" | "startedAt" | "completedAt", ExtArgs["result"]["codingSession"]>
  export type CodingSessionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    executionDeltas?: boolean | CodingSession$executionDeltasArgs<ExtArgs>
    _count?: boolean | CodingSessionCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type CodingSessionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type CodingSessionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $CodingSessionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "CodingSession"
    objects: {
      executionDeltas: Prisma.$CodeExecutionDeltaPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      targetRole: string
      difficulty: string
      selectedLanguage: string
      status: string
      testCasesPassed: number | null
      startedAt: Date
      completedAt: Date | null
    }, ExtArgs["result"]["codingSession"]>
    composites: {}
  }

  type CodingSessionGetPayload<S extends boolean | null | undefined | CodingSessionDefaultArgs> = $Result.GetResult<Prisma.$CodingSessionPayload, S>

  type CodingSessionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CodingSessionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CodingSessionCountAggregateInputType | true
    }

  export interface CodingSessionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['CodingSession'], meta: { name: 'CodingSession' } }
    /**
     * Find zero or one CodingSession that matches the filter.
     * @param {CodingSessionFindUniqueArgs} args - Arguments to find a CodingSession
     * @example
     * // Get one CodingSession
     * const codingSession = await prisma.codingSession.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CodingSessionFindUniqueArgs>(args: SelectSubset<T, CodingSessionFindUniqueArgs<ExtArgs>>): Prisma__CodingSessionClient<$Result.GetResult<Prisma.$CodingSessionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one CodingSession that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CodingSessionFindUniqueOrThrowArgs} args - Arguments to find a CodingSession
     * @example
     * // Get one CodingSession
     * const codingSession = await prisma.codingSession.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CodingSessionFindUniqueOrThrowArgs>(args: SelectSubset<T, CodingSessionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CodingSessionClient<$Result.GetResult<Prisma.$CodingSessionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CodingSession that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CodingSessionFindFirstArgs} args - Arguments to find a CodingSession
     * @example
     * // Get one CodingSession
     * const codingSession = await prisma.codingSession.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CodingSessionFindFirstArgs>(args?: SelectSubset<T, CodingSessionFindFirstArgs<ExtArgs>>): Prisma__CodingSessionClient<$Result.GetResult<Prisma.$CodingSessionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CodingSession that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CodingSessionFindFirstOrThrowArgs} args - Arguments to find a CodingSession
     * @example
     * // Get one CodingSession
     * const codingSession = await prisma.codingSession.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CodingSessionFindFirstOrThrowArgs>(args?: SelectSubset<T, CodingSessionFindFirstOrThrowArgs<ExtArgs>>): Prisma__CodingSessionClient<$Result.GetResult<Prisma.$CodingSessionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more CodingSessions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CodingSessionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all CodingSessions
     * const codingSessions = await prisma.codingSession.findMany()
     * 
     * // Get first 10 CodingSessions
     * const codingSessions = await prisma.codingSession.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const codingSessionWithIdOnly = await prisma.codingSession.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CodingSessionFindManyArgs>(args?: SelectSubset<T, CodingSessionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CodingSessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a CodingSession.
     * @param {CodingSessionCreateArgs} args - Arguments to create a CodingSession.
     * @example
     * // Create one CodingSession
     * const CodingSession = await prisma.codingSession.create({
     *   data: {
     *     // ... data to create a CodingSession
     *   }
     * })
     * 
     */
    create<T extends CodingSessionCreateArgs>(args: SelectSubset<T, CodingSessionCreateArgs<ExtArgs>>): Prisma__CodingSessionClient<$Result.GetResult<Prisma.$CodingSessionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many CodingSessions.
     * @param {CodingSessionCreateManyArgs} args - Arguments to create many CodingSessions.
     * @example
     * // Create many CodingSessions
     * const codingSession = await prisma.codingSession.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CodingSessionCreateManyArgs>(args?: SelectSubset<T, CodingSessionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many CodingSessions and returns the data saved in the database.
     * @param {CodingSessionCreateManyAndReturnArgs} args - Arguments to create many CodingSessions.
     * @example
     * // Create many CodingSessions
     * const codingSession = await prisma.codingSession.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many CodingSessions and only return the `id`
     * const codingSessionWithIdOnly = await prisma.codingSession.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CodingSessionCreateManyAndReturnArgs>(args?: SelectSubset<T, CodingSessionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CodingSessionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a CodingSession.
     * @param {CodingSessionDeleteArgs} args - Arguments to delete one CodingSession.
     * @example
     * // Delete one CodingSession
     * const CodingSession = await prisma.codingSession.delete({
     *   where: {
     *     // ... filter to delete one CodingSession
     *   }
     * })
     * 
     */
    delete<T extends CodingSessionDeleteArgs>(args: SelectSubset<T, CodingSessionDeleteArgs<ExtArgs>>): Prisma__CodingSessionClient<$Result.GetResult<Prisma.$CodingSessionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one CodingSession.
     * @param {CodingSessionUpdateArgs} args - Arguments to update one CodingSession.
     * @example
     * // Update one CodingSession
     * const codingSession = await prisma.codingSession.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CodingSessionUpdateArgs>(args: SelectSubset<T, CodingSessionUpdateArgs<ExtArgs>>): Prisma__CodingSessionClient<$Result.GetResult<Prisma.$CodingSessionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more CodingSessions.
     * @param {CodingSessionDeleteManyArgs} args - Arguments to filter CodingSessions to delete.
     * @example
     * // Delete a few CodingSessions
     * const { count } = await prisma.codingSession.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CodingSessionDeleteManyArgs>(args?: SelectSubset<T, CodingSessionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CodingSessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CodingSessionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many CodingSessions
     * const codingSession = await prisma.codingSession.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CodingSessionUpdateManyArgs>(args: SelectSubset<T, CodingSessionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CodingSessions and returns the data updated in the database.
     * @param {CodingSessionUpdateManyAndReturnArgs} args - Arguments to update many CodingSessions.
     * @example
     * // Update many CodingSessions
     * const codingSession = await prisma.codingSession.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more CodingSessions and only return the `id`
     * const codingSessionWithIdOnly = await prisma.codingSession.updateManyAndReturn({
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
    updateManyAndReturn<T extends CodingSessionUpdateManyAndReturnArgs>(args: SelectSubset<T, CodingSessionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CodingSessionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one CodingSession.
     * @param {CodingSessionUpsertArgs} args - Arguments to update or create a CodingSession.
     * @example
     * // Update or create a CodingSession
     * const codingSession = await prisma.codingSession.upsert({
     *   create: {
     *     // ... data to create a CodingSession
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the CodingSession we want to update
     *   }
     * })
     */
    upsert<T extends CodingSessionUpsertArgs>(args: SelectSubset<T, CodingSessionUpsertArgs<ExtArgs>>): Prisma__CodingSessionClient<$Result.GetResult<Prisma.$CodingSessionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of CodingSessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CodingSessionCountArgs} args - Arguments to filter CodingSessions to count.
     * @example
     * // Count the number of CodingSessions
     * const count = await prisma.codingSession.count({
     *   where: {
     *     // ... the filter for the CodingSessions we want to count
     *   }
     * })
    **/
    count<T extends CodingSessionCountArgs>(
      args?: Subset<T, CodingSessionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CodingSessionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a CodingSession.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CodingSessionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends CodingSessionAggregateArgs>(args: Subset<T, CodingSessionAggregateArgs>): Prisma.PrismaPromise<GetCodingSessionAggregateType<T>>

    /**
     * Group by CodingSession.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CodingSessionGroupByArgs} args - Group by arguments.
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
      T extends CodingSessionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CodingSessionGroupByArgs['orderBy'] }
        : { orderBy?: CodingSessionGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, CodingSessionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCodingSessionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the CodingSession model
   */
  readonly fields: CodingSessionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for CodingSession.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CodingSessionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    executionDeltas<T extends CodingSession$executionDeltasArgs<ExtArgs> = {}>(args?: Subset<T, CodingSession$executionDeltasArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CodeExecutionDeltaPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the CodingSession model
   */
  interface CodingSessionFieldRefs {
    readonly id: FieldRef<"CodingSession", 'String'>
    readonly userId: FieldRef<"CodingSession", 'String'>
    readonly targetRole: FieldRef<"CodingSession", 'String'>
    readonly difficulty: FieldRef<"CodingSession", 'String'>
    readonly selectedLanguage: FieldRef<"CodingSession", 'String'>
    readonly status: FieldRef<"CodingSession", 'String'>
    readonly testCasesPassed: FieldRef<"CodingSession", 'Int'>
    readonly startedAt: FieldRef<"CodingSession", 'DateTime'>
    readonly completedAt: FieldRef<"CodingSession", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * CodingSession findUnique
   */
  export type CodingSessionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CodingSession
     */
    select?: CodingSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CodingSession
     */
    omit?: CodingSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CodingSessionInclude<ExtArgs> | null
    /**
     * Filter, which CodingSession to fetch.
     */
    where: CodingSessionWhereUniqueInput
  }

  /**
   * CodingSession findUniqueOrThrow
   */
  export type CodingSessionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CodingSession
     */
    select?: CodingSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CodingSession
     */
    omit?: CodingSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CodingSessionInclude<ExtArgs> | null
    /**
     * Filter, which CodingSession to fetch.
     */
    where: CodingSessionWhereUniqueInput
  }

  /**
   * CodingSession findFirst
   */
  export type CodingSessionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CodingSession
     */
    select?: CodingSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CodingSession
     */
    omit?: CodingSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CodingSessionInclude<ExtArgs> | null
    /**
     * Filter, which CodingSession to fetch.
     */
    where?: CodingSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CodingSessions to fetch.
     */
    orderBy?: CodingSessionOrderByWithRelationInput | CodingSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CodingSessions.
     */
    cursor?: CodingSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CodingSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CodingSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CodingSessions.
     */
    distinct?: CodingSessionScalarFieldEnum | CodingSessionScalarFieldEnum[]
  }

  /**
   * CodingSession findFirstOrThrow
   */
  export type CodingSessionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CodingSession
     */
    select?: CodingSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CodingSession
     */
    omit?: CodingSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CodingSessionInclude<ExtArgs> | null
    /**
     * Filter, which CodingSession to fetch.
     */
    where?: CodingSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CodingSessions to fetch.
     */
    orderBy?: CodingSessionOrderByWithRelationInput | CodingSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CodingSessions.
     */
    cursor?: CodingSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CodingSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CodingSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CodingSessions.
     */
    distinct?: CodingSessionScalarFieldEnum | CodingSessionScalarFieldEnum[]
  }

  /**
   * CodingSession findMany
   */
  export type CodingSessionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CodingSession
     */
    select?: CodingSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CodingSession
     */
    omit?: CodingSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CodingSessionInclude<ExtArgs> | null
    /**
     * Filter, which CodingSessions to fetch.
     */
    where?: CodingSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CodingSessions to fetch.
     */
    orderBy?: CodingSessionOrderByWithRelationInput | CodingSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing CodingSessions.
     */
    cursor?: CodingSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CodingSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CodingSessions.
     */
    skip?: number
    distinct?: CodingSessionScalarFieldEnum | CodingSessionScalarFieldEnum[]
  }

  /**
   * CodingSession create
   */
  export type CodingSessionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CodingSession
     */
    select?: CodingSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CodingSession
     */
    omit?: CodingSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CodingSessionInclude<ExtArgs> | null
    /**
     * The data needed to create a CodingSession.
     */
    data: XOR<CodingSessionCreateInput, CodingSessionUncheckedCreateInput>
  }

  /**
   * CodingSession createMany
   */
  export type CodingSessionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many CodingSessions.
     */
    data: CodingSessionCreateManyInput | CodingSessionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * CodingSession createManyAndReturn
   */
  export type CodingSessionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CodingSession
     */
    select?: CodingSessionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CodingSession
     */
    omit?: CodingSessionOmit<ExtArgs> | null
    /**
     * The data used to create many CodingSessions.
     */
    data: CodingSessionCreateManyInput | CodingSessionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * CodingSession update
   */
  export type CodingSessionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CodingSession
     */
    select?: CodingSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CodingSession
     */
    omit?: CodingSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CodingSessionInclude<ExtArgs> | null
    /**
     * The data needed to update a CodingSession.
     */
    data: XOR<CodingSessionUpdateInput, CodingSessionUncheckedUpdateInput>
    /**
     * Choose, which CodingSession to update.
     */
    where: CodingSessionWhereUniqueInput
  }

  /**
   * CodingSession updateMany
   */
  export type CodingSessionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update CodingSessions.
     */
    data: XOR<CodingSessionUpdateManyMutationInput, CodingSessionUncheckedUpdateManyInput>
    /**
     * Filter which CodingSessions to update
     */
    where?: CodingSessionWhereInput
    /**
     * Limit how many CodingSessions to update.
     */
    limit?: number
  }

  /**
   * CodingSession updateManyAndReturn
   */
  export type CodingSessionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CodingSession
     */
    select?: CodingSessionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CodingSession
     */
    omit?: CodingSessionOmit<ExtArgs> | null
    /**
     * The data used to update CodingSessions.
     */
    data: XOR<CodingSessionUpdateManyMutationInput, CodingSessionUncheckedUpdateManyInput>
    /**
     * Filter which CodingSessions to update
     */
    where?: CodingSessionWhereInput
    /**
     * Limit how many CodingSessions to update.
     */
    limit?: number
  }

  /**
   * CodingSession upsert
   */
  export type CodingSessionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CodingSession
     */
    select?: CodingSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CodingSession
     */
    omit?: CodingSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CodingSessionInclude<ExtArgs> | null
    /**
     * The filter to search for the CodingSession to update in case it exists.
     */
    where: CodingSessionWhereUniqueInput
    /**
     * In case the CodingSession found by the `where` argument doesn't exist, create a new CodingSession with this data.
     */
    create: XOR<CodingSessionCreateInput, CodingSessionUncheckedCreateInput>
    /**
     * In case the CodingSession was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CodingSessionUpdateInput, CodingSessionUncheckedUpdateInput>
  }

  /**
   * CodingSession delete
   */
  export type CodingSessionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CodingSession
     */
    select?: CodingSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CodingSession
     */
    omit?: CodingSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CodingSessionInclude<ExtArgs> | null
    /**
     * Filter which CodingSession to delete.
     */
    where: CodingSessionWhereUniqueInput
  }

  /**
   * CodingSession deleteMany
   */
  export type CodingSessionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CodingSessions to delete
     */
    where?: CodingSessionWhereInput
    /**
     * Limit how many CodingSessions to delete.
     */
    limit?: number
  }

  /**
   * CodingSession.executionDeltas
   */
  export type CodingSession$executionDeltasArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CodeExecutionDelta
     */
    select?: CodeExecutionDeltaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CodeExecutionDelta
     */
    omit?: CodeExecutionDeltaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CodeExecutionDeltaInclude<ExtArgs> | null
    where?: CodeExecutionDeltaWhereInput
    orderBy?: CodeExecutionDeltaOrderByWithRelationInput | CodeExecutionDeltaOrderByWithRelationInput[]
    cursor?: CodeExecutionDeltaWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CodeExecutionDeltaScalarFieldEnum | CodeExecutionDeltaScalarFieldEnum[]
  }

  /**
   * CodingSession without action
   */
  export type CodingSessionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CodingSession
     */
    select?: CodingSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CodingSession
     */
    omit?: CodingSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CodingSessionInclude<ExtArgs> | null
  }


  /**
   * Model PreDefinedProblem
   */

  export type AggregatePreDefinedProblem = {
    _count: PreDefinedProblemCountAggregateOutputType | null
    _min: PreDefinedProblemMinAggregateOutputType | null
    _max: PreDefinedProblemMaxAggregateOutputType | null
  }

  export type PreDefinedProblemMinAggregateOutputType = {
    id: string | null
    title: string | null
    difficulty: string | null
    pattern: string | null
    description: string | null
    optimalSolution: string | null
    optimalTime: string | null
    optimalSpace: string | null
  }

  export type PreDefinedProblemMaxAggregateOutputType = {
    id: string | null
    title: string | null
    difficulty: string | null
    pattern: string | null
    description: string | null
    optimalSolution: string | null
    optimalTime: string | null
    optimalSpace: string | null
  }

  export type PreDefinedProblemCountAggregateOutputType = {
    id: number
    title: number
    difficulty: number
    pattern: number
    description: number
    starterCode: number
    testCases: number
    optimalSolution: number
    optimalTime: number
    optimalSpace: number
    _all: number
  }


  export type PreDefinedProblemMinAggregateInputType = {
    id?: true
    title?: true
    difficulty?: true
    pattern?: true
    description?: true
    optimalSolution?: true
    optimalTime?: true
    optimalSpace?: true
  }

  export type PreDefinedProblemMaxAggregateInputType = {
    id?: true
    title?: true
    difficulty?: true
    pattern?: true
    description?: true
    optimalSolution?: true
    optimalTime?: true
    optimalSpace?: true
  }

  export type PreDefinedProblemCountAggregateInputType = {
    id?: true
    title?: true
    difficulty?: true
    pattern?: true
    description?: true
    starterCode?: true
    testCases?: true
    optimalSolution?: true
    optimalTime?: true
    optimalSpace?: true
    _all?: true
  }

  export type PreDefinedProblemAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PreDefinedProblem to aggregate.
     */
    where?: PreDefinedProblemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PreDefinedProblems to fetch.
     */
    orderBy?: PreDefinedProblemOrderByWithRelationInput | PreDefinedProblemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PreDefinedProblemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PreDefinedProblems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PreDefinedProblems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PreDefinedProblems
    **/
    _count?: true | PreDefinedProblemCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PreDefinedProblemMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PreDefinedProblemMaxAggregateInputType
  }

  export type GetPreDefinedProblemAggregateType<T extends PreDefinedProblemAggregateArgs> = {
        [P in keyof T & keyof AggregatePreDefinedProblem]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePreDefinedProblem[P]>
      : GetScalarType<T[P], AggregatePreDefinedProblem[P]>
  }




  export type PreDefinedProblemGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PreDefinedProblemWhereInput
    orderBy?: PreDefinedProblemOrderByWithAggregationInput | PreDefinedProblemOrderByWithAggregationInput[]
    by: PreDefinedProblemScalarFieldEnum[] | PreDefinedProblemScalarFieldEnum
    having?: PreDefinedProblemScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PreDefinedProblemCountAggregateInputType | true
    _min?: PreDefinedProblemMinAggregateInputType
    _max?: PreDefinedProblemMaxAggregateInputType
  }

  export type PreDefinedProblemGroupByOutputType = {
    id: string
    title: string
    difficulty: string
    pattern: string
    description: string
    starterCode: JsonValue
    testCases: JsonValue
    optimalSolution: string
    optimalTime: string
    optimalSpace: string
    _count: PreDefinedProblemCountAggregateOutputType | null
    _min: PreDefinedProblemMinAggregateOutputType | null
    _max: PreDefinedProblemMaxAggregateOutputType | null
  }

  type GetPreDefinedProblemGroupByPayload<T extends PreDefinedProblemGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PreDefinedProblemGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PreDefinedProblemGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PreDefinedProblemGroupByOutputType[P]>
            : GetScalarType<T[P], PreDefinedProblemGroupByOutputType[P]>
        }
      >
    >


  export type PreDefinedProblemSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    difficulty?: boolean
    pattern?: boolean
    description?: boolean
    starterCode?: boolean
    testCases?: boolean
    optimalSolution?: boolean
    optimalTime?: boolean
    optimalSpace?: boolean
  }, ExtArgs["result"]["preDefinedProblem"]>

  export type PreDefinedProblemSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    difficulty?: boolean
    pattern?: boolean
    description?: boolean
    starterCode?: boolean
    testCases?: boolean
    optimalSolution?: boolean
    optimalTime?: boolean
    optimalSpace?: boolean
  }, ExtArgs["result"]["preDefinedProblem"]>

  export type PreDefinedProblemSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    difficulty?: boolean
    pattern?: boolean
    description?: boolean
    starterCode?: boolean
    testCases?: boolean
    optimalSolution?: boolean
    optimalTime?: boolean
    optimalSpace?: boolean
  }, ExtArgs["result"]["preDefinedProblem"]>

  export type PreDefinedProblemSelectScalar = {
    id?: boolean
    title?: boolean
    difficulty?: boolean
    pattern?: boolean
    description?: boolean
    starterCode?: boolean
    testCases?: boolean
    optimalSolution?: boolean
    optimalTime?: boolean
    optimalSpace?: boolean
  }

  export type PreDefinedProblemOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "title" | "difficulty" | "pattern" | "description" | "starterCode" | "testCases" | "optimalSolution" | "optimalTime" | "optimalSpace", ExtArgs["result"]["preDefinedProblem"]>

  export type $PreDefinedProblemPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PreDefinedProblem"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      title: string
      difficulty: string
      pattern: string
      description: string
      starterCode: Prisma.JsonValue
      testCases: Prisma.JsonValue
      optimalSolution: string
      optimalTime: string
      optimalSpace: string
    }, ExtArgs["result"]["preDefinedProblem"]>
    composites: {}
  }

  type PreDefinedProblemGetPayload<S extends boolean | null | undefined | PreDefinedProblemDefaultArgs> = $Result.GetResult<Prisma.$PreDefinedProblemPayload, S>

  type PreDefinedProblemCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PreDefinedProblemFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PreDefinedProblemCountAggregateInputType | true
    }

  export interface PreDefinedProblemDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PreDefinedProblem'], meta: { name: 'PreDefinedProblem' } }
    /**
     * Find zero or one PreDefinedProblem that matches the filter.
     * @param {PreDefinedProblemFindUniqueArgs} args - Arguments to find a PreDefinedProblem
     * @example
     * // Get one PreDefinedProblem
     * const preDefinedProblem = await prisma.preDefinedProblem.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PreDefinedProblemFindUniqueArgs>(args: SelectSubset<T, PreDefinedProblemFindUniqueArgs<ExtArgs>>): Prisma__PreDefinedProblemClient<$Result.GetResult<Prisma.$PreDefinedProblemPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one PreDefinedProblem that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PreDefinedProblemFindUniqueOrThrowArgs} args - Arguments to find a PreDefinedProblem
     * @example
     * // Get one PreDefinedProblem
     * const preDefinedProblem = await prisma.preDefinedProblem.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PreDefinedProblemFindUniqueOrThrowArgs>(args: SelectSubset<T, PreDefinedProblemFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PreDefinedProblemClient<$Result.GetResult<Prisma.$PreDefinedProblemPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PreDefinedProblem that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PreDefinedProblemFindFirstArgs} args - Arguments to find a PreDefinedProblem
     * @example
     * // Get one PreDefinedProblem
     * const preDefinedProblem = await prisma.preDefinedProblem.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PreDefinedProblemFindFirstArgs>(args?: SelectSubset<T, PreDefinedProblemFindFirstArgs<ExtArgs>>): Prisma__PreDefinedProblemClient<$Result.GetResult<Prisma.$PreDefinedProblemPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PreDefinedProblem that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PreDefinedProblemFindFirstOrThrowArgs} args - Arguments to find a PreDefinedProblem
     * @example
     * // Get one PreDefinedProblem
     * const preDefinedProblem = await prisma.preDefinedProblem.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PreDefinedProblemFindFirstOrThrowArgs>(args?: SelectSubset<T, PreDefinedProblemFindFirstOrThrowArgs<ExtArgs>>): Prisma__PreDefinedProblemClient<$Result.GetResult<Prisma.$PreDefinedProblemPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more PreDefinedProblems that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PreDefinedProblemFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PreDefinedProblems
     * const preDefinedProblems = await prisma.preDefinedProblem.findMany()
     * 
     * // Get first 10 PreDefinedProblems
     * const preDefinedProblems = await prisma.preDefinedProblem.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const preDefinedProblemWithIdOnly = await prisma.preDefinedProblem.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PreDefinedProblemFindManyArgs>(args?: SelectSubset<T, PreDefinedProblemFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PreDefinedProblemPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a PreDefinedProblem.
     * @param {PreDefinedProblemCreateArgs} args - Arguments to create a PreDefinedProblem.
     * @example
     * // Create one PreDefinedProblem
     * const PreDefinedProblem = await prisma.preDefinedProblem.create({
     *   data: {
     *     // ... data to create a PreDefinedProblem
     *   }
     * })
     * 
     */
    create<T extends PreDefinedProblemCreateArgs>(args: SelectSubset<T, PreDefinedProblemCreateArgs<ExtArgs>>): Prisma__PreDefinedProblemClient<$Result.GetResult<Prisma.$PreDefinedProblemPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many PreDefinedProblems.
     * @param {PreDefinedProblemCreateManyArgs} args - Arguments to create many PreDefinedProblems.
     * @example
     * // Create many PreDefinedProblems
     * const preDefinedProblem = await prisma.preDefinedProblem.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PreDefinedProblemCreateManyArgs>(args?: SelectSubset<T, PreDefinedProblemCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many PreDefinedProblems and returns the data saved in the database.
     * @param {PreDefinedProblemCreateManyAndReturnArgs} args - Arguments to create many PreDefinedProblems.
     * @example
     * // Create many PreDefinedProblems
     * const preDefinedProblem = await prisma.preDefinedProblem.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many PreDefinedProblems and only return the `id`
     * const preDefinedProblemWithIdOnly = await prisma.preDefinedProblem.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PreDefinedProblemCreateManyAndReturnArgs>(args?: SelectSubset<T, PreDefinedProblemCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PreDefinedProblemPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a PreDefinedProblem.
     * @param {PreDefinedProblemDeleteArgs} args - Arguments to delete one PreDefinedProblem.
     * @example
     * // Delete one PreDefinedProblem
     * const PreDefinedProblem = await prisma.preDefinedProblem.delete({
     *   where: {
     *     // ... filter to delete one PreDefinedProblem
     *   }
     * })
     * 
     */
    delete<T extends PreDefinedProblemDeleteArgs>(args: SelectSubset<T, PreDefinedProblemDeleteArgs<ExtArgs>>): Prisma__PreDefinedProblemClient<$Result.GetResult<Prisma.$PreDefinedProblemPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one PreDefinedProblem.
     * @param {PreDefinedProblemUpdateArgs} args - Arguments to update one PreDefinedProblem.
     * @example
     * // Update one PreDefinedProblem
     * const preDefinedProblem = await prisma.preDefinedProblem.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PreDefinedProblemUpdateArgs>(args: SelectSubset<T, PreDefinedProblemUpdateArgs<ExtArgs>>): Prisma__PreDefinedProblemClient<$Result.GetResult<Prisma.$PreDefinedProblemPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more PreDefinedProblems.
     * @param {PreDefinedProblemDeleteManyArgs} args - Arguments to filter PreDefinedProblems to delete.
     * @example
     * // Delete a few PreDefinedProblems
     * const { count } = await prisma.preDefinedProblem.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PreDefinedProblemDeleteManyArgs>(args?: SelectSubset<T, PreDefinedProblemDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PreDefinedProblems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PreDefinedProblemUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PreDefinedProblems
     * const preDefinedProblem = await prisma.preDefinedProblem.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PreDefinedProblemUpdateManyArgs>(args: SelectSubset<T, PreDefinedProblemUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PreDefinedProblems and returns the data updated in the database.
     * @param {PreDefinedProblemUpdateManyAndReturnArgs} args - Arguments to update many PreDefinedProblems.
     * @example
     * // Update many PreDefinedProblems
     * const preDefinedProblem = await prisma.preDefinedProblem.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more PreDefinedProblems and only return the `id`
     * const preDefinedProblemWithIdOnly = await prisma.preDefinedProblem.updateManyAndReturn({
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
    updateManyAndReturn<T extends PreDefinedProblemUpdateManyAndReturnArgs>(args: SelectSubset<T, PreDefinedProblemUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PreDefinedProblemPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one PreDefinedProblem.
     * @param {PreDefinedProblemUpsertArgs} args - Arguments to update or create a PreDefinedProblem.
     * @example
     * // Update or create a PreDefinedProblem
     * const preDefinedProblem = await prisma.preDefinedProblem.upsert({
     *   create: {
     *     // ... data to create a PreDefinedProblem
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PreDefinedProblem we want to update
     *   }
     * })
     */
    upsert<T extends PreDefinedProblemUpsertArgs>(args: SelectSubset<T, PreDefinedProblemUpsertArgs<ExtArgs>>): Prisma__PreDefinedProblemClient<$Result.GetResult<Prisma.$PreDefinedProblemPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of PreDefinedProblems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PreDefinedProblemCountArgs} args - Arguments to filter PreDefinedProblems to count.
     * @example
     * // Count the number of PreDefinedProblems
     * const count = await prisma.preDefinedProblem.count({
     *   where: {
     *     // ... the filter for the PreDefinedProblems we want to count
     *   }
     * })
    **/
    count<T extends PreDefinedProblemCountArgs>(
      args?: Subset<T, PreDefinedProblemCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PreDefinedProblemCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PreDefinedProblem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PreDefinedProblemAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends PreDefinedProblemAggregateArgs>(args: Subset<T, PreDefinedProblemAggregateArgs>): Prisma.PrismaPromise<GetPreDefinedProblemAggregateType<T>>

    /**
     * Group by PreDefinedProblem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PreDefinedProblemGroupByArgs} args - Group by arguments.
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
      T extends PreDefinedProblemGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PreDefinedProblemGroupByArgs['orderBy'] }
        : { orderBy?: PreDefinedProblemGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, PreDefinedProblemGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPreDefinedProblemGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PreDefinedProblem model
   */
  readonly fields: PreDefinedProblemFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PreDefinedProblem.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PreDefinedProblemClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
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
   * Fields of the PreDefinedProblem model
   */
  interface PreDefinedProblemFieldRefs {
    readonly id: FieldRef<"PreDefinedProblem", 'String'>
    readonly title: FieldRef<"PreDefinedProblem", 'String'>
    readonly difficulty: FieldRef<"PreDefinedProblem", 'String'>
    readonly pattern: FieldRef<"PreDefinedProblem", 'String'>
    readonly description: FieldRef<"PreDefinedProblem", 'String'>
    readonly starterCode: FieldRef<"PreDefinedProblem", 'Json'>
    readonly testCases: FieldRef<"PreDefinedProblem", 'Json'>
    readonly optimalSolution: FieldRef<"PreDefinedProblem", 'String'>
    readonly optimalTime: FieldRef<"PreDefinedProblem", 'String'>
    readonly optimalSpace: FieldRef<"PreDefinedProblem", 'String'>
  }
    

  // Custom InputTypes
  /**
   * PreDefinedProblem findUnique
   */
  export type PreDefinedProblemFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PreDefinedProblem
     */
    select?: PreDefinedProblemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PreDefinedProblem
     */
    omit?: PreDefinedProblemOmit<ExtArgs> | null
    /**
     * Filter, which PreDefinedProblem to fetch.
     */
    where: PreDefinedProblemWhereUniqueInput
  }

  /**
   * PreDefinedProblem findUniqueOrThrow
   */
  export type PreDefinedProblemFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PreDefinedProblem
     */
    select?: PreDefinedProblemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PreDefinedProblem
     */
    omit?: PreDefinedProblemOmit<ExtArgs> | null
    /**
     * Filter, which PreDefinedProblem to fetch.
     */
    where: PreDefinedProblemWhereUniqueInput
  }

  /**
   * PreDefinedProblem findFirst
   */
  export type PreDefinedProblemFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PreDefinedProblem
     */
    select?: PreDefinedProblemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PreDefinedProblem
     */
    omit?: PreDefinedProblemOmit<ExtArgs> | null
    /**
     * Filter, which PreDefinedProblem to fetch.
     */
    where?: PreDefinedProblemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PreDefinedProblems to fetch.
     */
    orderBy?: PreDefinedProblemOrderByWithRelationInput | PreDefinedProblemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PreDefinedProblems.
     */
    cursor?: PreDefinedProblemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PreDefinedProblems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PreDefinedProblems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PreDefinedProblems.
     */
    distinct?: PreDefinedProblemScalarFieldEnum | PreDefinedProblemScalarFieldEnum[]
  }

  /**
   * PreDefinedProblem findFirstOrThrow
   */
  export type PreDefinedProblemFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PreDefinedProblem
     */
    select?: PreDefinedProblemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PreDefinedProblem
     */
    omit?: PreDefinedProblemOmit<ExtArgs> | null
    /**
     * Filter, which PreDefinedProblem to fetch.
     */
    where?: PreDefinedProblemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PreDefinedProblems to fetch.
     */
    orderBy?: PreDefinedProblemOrderByWithRelationInput | PreDefinedProblemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PreDefinedProblems.
     */
    cursor?: PreDefinedProblemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PreDefinedProblems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PreDefinedProblems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PreDefinedProblems.
     */
    distinct?: PreDefinedProblemScalarFieldEnum | PreDefinedProblemScalarFieldEnum[]
  }

  /**
   * PreDefinedProblem findMany
   */
  export type PreDefinedProblemFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PreDefinedProblem
     */
    select?: PreDefinedProblemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PreDefinedProblem
     */
    omit?: PreDefinedProblemOmit<ExtArgs> | null
    /**
     * Filter, which PreDefinedProblems to fetch.
     */
    where?: PreDefinedProblemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PreDefinedProblems to fetch.
     */
    orderBy?: PreDefinedProblemOrderByWithRelationInput | PreDefinedProblemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PreDefinedProblems.
     */
    cursor?: PreDefinedProblemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PreDefinedProblems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PreDefinedProblems.
     */
    skip?: number
    distinct?: PreDefinedProblemScalarFieldEnum | PreDefinedProblemScalarFieldEnum[]
  }

  /**
   * PreDefinedProblem create
   */
  export type PreDefinedProblemCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PreDefinedProblem
     */
    select?: PreDefinedProblemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PreDefinedProblem
     */
    omit?: PreDefinedProblemOmit<ExtArgs> | null
    /**
     * The data needed to create a PreDefinedProblem.
     */
    data: XOR<PreDefinedProblemCreateInput, PreDefinedProblemUncheckedCreateInput>
  }

  /**
   * PreDefinedProblem createMany
   */
  export type PreDefinedProblemCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PreDefinedProblems.
     */
    data: PreDefinedProblemCreateManyInput | PreDefinedProblemCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PreDefinedProblem createManyAndReturn
   */
  export type PreDefinedProblemCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PreDefinedProblem
     */
    select?: PreDefinedProblemSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PreDefinedProblem
     */
    omit?: PreDefinedProblemOmit<ExtArgs> | null
    /**
     * The data used to create many PreDefinedProblems.
     */
    data: PreDefinedProblemCreateManyInput | PreDefinedProblemCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PreDefinedProblem update
   */
  export type PreDefinedProblemUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PreDefinedProblem
     */
    select?: PreDefinedProblemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PreDefinedProblem
     */
    omit?: PreDefinedProblemOmit<ExtArgs> | null
    /**
     * The data needed to update a PreDefinedProblem.
     */
    data: XOR<PreDefinedProblemUpdateInput, PreDefinedProblemUncheckedUpdateInput>
    /**
     * Choose, which PreDefinedProblem to update.
     */
    where: PreDefinedProblemWhereUniqueInput
  }

  /**
   * PreDefinedProblem updateMany
   */
  export type PreDefinedProblemUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PreDefinedProblems.
     */
    data: XOR<PreDefinedProblemUpdateManyMutationInput, PreDefinedProblemUncheckedUpdateManyInput>
    /**
     * Filter which PreDefinedProblems to update
     */
    where?: PreDefinedProblemWhereInput
    /**
     * Limit how many PreDefinedProblems to update.
     */
    limit?: number
  }

  /**
   * PreDefinedProblem updateManyAndReturn
   */
  export type PreDefinedProblemUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PreDefinedProblem
     */
    select?: PreDefinedProblemSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PreDefinedProblem
     */
    omit?: PreDefinedProblemOmit<ExtArgs> | null
    /**
     * The data used to update PreDefinedProblems.
     */
    data: XOR<PreDefinedProblemUpdateManyMutationInput, PreDefinedProblemUncheckedUpdateManyInput>
    /**
     * Filter which PreDefinedProblems to update
     */
    where?: PreDefinedProblemWhereInput
    /**
     * Limit how many PreDefinedProblems to update.
     */
    limit?: number
  }

  /**
   * PreDefinedProblem upsert
   */
  export type PreDefinedProblemUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PreDefinedProblem
     */
    select?: PreDefinedProblemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PreDefinedProblem
     */
    omit?: PreDefinedProblemOmit<ExtArgs> | null
    /**
     * The filter to search for the PreDefinedProblem to update in case it exists.
     */
    where: PreDefinedProblemWhereUniqueInput
    /**
     * In case the PreDefinedProblem found by the `where` argument doesn't exist, create a new PreDefinedProblem with this data.
     */
    create: XOR<PreDefinedProblemCreateInput, PreDefinedProblemUncheckedCreateInput>
    /**
     * In case the PreDefinedProblem was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PreDefinedProblemUpdateInput, PreDefinedProblemUncheckedUpdateInput>
  }

  /**
   * PreDefinedProblem delete
   */
  export type PreDefinedProblemDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PreDefinedProblem
     */
    select?: PreDefinedProblemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PreDefinedProblem
     */
    omit?: PreDefinedProblemOmit<ExtArgs> | null
    /**
     * Filter which PreDefinedProblem to delete.
     */
    where: PreDefinedProblemWhereUniqueInput
  }

  /**
   * PreDefinedProblem deleteMany
   */
  export type PreDefinedProblemDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PreDefinedProblems to delete
     */
    where?: PreDefinedProblemWhereInput
    /**
     * Limit how many PreDefinedProblems to delete.
     */
    limit?: number
  }

  /**
   * PreDefinedProblem without action
   */
  export type PreDefinedProblemDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PreDefinedProblem
     */
    select?: PreDefinedProblemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PreDefinedProblem
     */
    omit?: PreDefinedProblemOmit<ExtArgs> | null
  }


  /**
   * Model CodeExecutionDelta
   */

  export type AggregateCodeExecutionDelta = {
    _count: CodeExecutionDeltaCountAggregateOutputType | null
    _min: CodeExecutionDeltaMinAggregateOutputType | null
    _max: CodeExecutionDeltaMaxAggregateOutputType | null
  }

  export type CodeExecutionDeltaMinAggregateOutputType = {
    id: string | null
    sessionId: string | null
    code: string | null
    language: string | null
    output: string | null
    success: boolean | null
    timestamp: Date | null
  }

  export type CodeExecutionDeltaMaxAggregateOutputType = {
    id: string | null
    sessionId: string | null
    code: string | null
    language: string | null
    output: string | null
    success: boolean | null
    timestamp: Date | null
  }

  export type CodeExecutionDeltaCountAggregateOutputType = {
    id: number
    sessionId: number
    code: number
    language: number
    output: number
    success: number
    timestamp: number
    _all: number
  }


  export type CodeExecutionDeltaMinAggregateInputType = {
    id?: true
    sessionId?: true
    code?: true
    language?: true
    output?: true
    success?: true
    timestamp?: true
  }

  export type CodeExecutionDeltaMaxAggregateInputType = {
    id?: true
    sessionId?: true
    code?: true
    language?: true
    output?: true
    success?: true
    timestamp?: true
  }

  export type CodeExecutionDeltaCountAggregateInputType = {
    id?: true
    sessionId?: true
    code?: true
    language?: true
    output?: true
    success?: true
    timestamp?: true
    _all?: true
  }

  export type CodeExecutionDeltaAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CodeExecutionDelta to aggregate.
     */
    where?: CodeExecutionDeltaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CodeExecutionDeltas to fetch.
     */
    orderBy?: CodeExecutionDeltaOrderByWithRelationInput | CodeExecutionDeltaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CodeExecutionDeltaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CodeExecutionDeltas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CodeExecutionDeltas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned CodeExecutionDeltas
    **/
    _count?: true | CodeExecutionDeltaCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CodeExecutionDeltaMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CodeExecutionDeltaMaxAggregateInputType
  }

  export type GetCodeExecutionDeltaAggregateType<T extends CodeExecutionDeltaAggregateArgs> = {
        [P in keyof T & keyof AggregateCodeExecutionDelta]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCodeExecutionDelta[P]>
      : GetScalarType<T[P], AggregateCodeExecutionDelta[P]>
  }




  export type CodeExecutionDeltaGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CodeExecutionDeltaWhereInput
    orderBy?: CodeExecutionDeltaOrderByWithAggregationInput | CodeExecutionDeltaOrderByWithAggregationInput[]
    by: CodeExecutionDeltaScalarFieldEnum[] | CodeExecutionDeltaScalarFieldEnum
    having?: CodeExecutionDeltaScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CodeExecutionDeltaCountAggregateInputType | true
    _min?: CodeExecutionDeltaMinAggregateInputType
    _max?: CodeExecutionDeltaMaxAggregateInputType
  }

  export type CodeExecutionDeltaGroupByOutputType = {
    id: string
    sessionId: string
    code: string
    language: string
    output: string | null
    success: boolean | null
    timestamp: Date
    _count: CodeExecutionDeltaCountAggregateOutputType | null
    _min: CodeExecutionDeltaMinAggregateOutputType | null
    _max: CodeExecutionDeltaMaxAggregateOutputType | null
  }

  type GetCodeExecutionDeltaGroupByPayload<T extends CodeExecutionDeltaGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CodeExecutionDeltaGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CodeExecutionDeltaGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CodeExecutionDeltaGroupByOutputType[P]>
            : GetScalarType<T[P], CodeExecutionDeltaGroupByOutputType[P]>
        }
      >
    >


  export type CodeExecutionDeltaSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sessionId?: boolean
    code?: boolean
    language?: boolean
    output?: boolean
    success?: boolean
    timestamp?: boolean
    session?: boolean | CodingSessionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["codeExecutionDelta"]>

  export type CodeExecutionDeltaSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sessionId?: boolean
    code?: boolean
    language?: boolean
    output?: boolean
    success?: boolean
    timestamp?: boolean
    session?: boolean | CodingSessionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["codeExecutionDelta"]>

  export type CodeExecutionDeltaSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sessionId?: boolean
    code?: boolean
    language?: boolean
    output?: boolean
    success?: boolean
    timestamp?: boolean
    session?: boolean | CodingSessionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["codeExecutionDelta"]>

  export type CodeExecutionDeltaSelectScalar = {
    id?: boolean
    sessionId?: boolean
    code?: boolean
    language?: boolean
    output?: boolean
    success?: boolean
    timestamp?: boolean
  }

  export type CodeExecutionDeltaOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "sessionId" | "code" | "language" | "output" | "success" | "timestamp", ExtArgs["result"]["codeExecutionDelta"]>
  export type CodeExecutionDeltaInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    session?: boolean | CodingSessionDefaultArgs<ExtArgs>
  }
  export type CodeExecutionDeltaIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    session?: boolean | CodingSessionDefaultArgs<ExtArgs>
  }
  export type CodeExecutionDeltaIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    session?: boolean | CodingSessionDefaultArgs<ExtArgs>
  }

  export type $CodeExecutionDeltaPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "CodeExecutionDelta"
    objects: {
      session: Prisma.$CodingSessionPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      sessionId: string
      code: string
      language: string
      output: string | null
      success: boolean | null
      timestamp: Date
    }, ExtArgs["result"]["codeExecutionDelta"]>
    composites: {}
  }

  type CodeExecutionDeltaGetPayload<S extends boolean | null | undefined | CodeExecutionDeltaDefaultArgs> = $Result.GetResult<Prisma.$CodeExecutionDeltaPayload, S>

  type CodeExecutionDeltaCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CodeExecutionDeltaFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CodeExecutionDeltaCountAggregateInputType | true
    }

  export interface CodeExecutionDeltaDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['CodeExecutionDelta'], meta: { name: 'CodeExecutionDelta' } }
    /**
     * Find zero or one CodeExecutionDelta that matches the filter.
     * @param {CodeExecutionDeltaFindUniqueArgs} args - Arguments to find a CodeExecutionDelta
     * @example
     * // Get one CodeExecutionDelta
     * const codeExecutionDelta = await prisma.codeExecutionDelta.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CodeExecutionDeltaFindUniqueArgs>(args: SelectSubset<T, CodeExecutionDeltaFindUniqueArgs<ExtArgs>>): Prisma__CodeExecutionDeltaClient<$Result.GetResult<Prisma.$CodeExecutionDeltaPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one CodeExecutionDelta that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CodeExecutionDeltaFindUniqueOrThrowArgs} args - Arguments to find a CodeExecutionDelta
     * @example
     * // Get one CodeExecutionDelta
     * const codeExecutionDelta = await prisma.codeExecutionDelta.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CodeExecutionDeltaFindUniqueOrThrowArgs>(args: SelectSubset<T, CodeExecutionDeltaFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CodeExecutionDeltaClient<$Result.GetResult<Prisma.$CodeExecutionDeltaPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CodeExecutionDelta that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CodeExecutionDeltaFindFirstArgs} args - Arguments to find a CodeExecutionDelta
     * @example
     * // Get one CodeExecutionDelta
     * const codeExecutionDelta = await prisma.codeExecutionDelta.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CodeExecutionDeltaFindFirstArgs>(args?: SelectSubset<T, CodeExecutionDeltaFindFirstArgs<ExtArgs>>): Prisma__CodeExecutionDeltaClient<$Result.GetResult<Prisma.$CodeExecutionDeltaPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CodeExecutionDelta that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CodeExecutionDeltaFindFirstOrThrowArgs} args - Arguments to find a CodeExecutionDelta
     * @example
     * // Get one CodeExecutionDelta
     * const codeExecutionDelta = await prisma.codeExecutionDelta.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CodeExecutionDeltaFindFirstOrThrowArgs>(args?: SelectSubset<T, CodeExecutionDeltaFindFirstOrThrowArgs<ExtArgs>>): Prisma__CodeExecutionDeltaClient<$Result.GetResult<Prisma.$CodeExecutionDeltaPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more CodeExecutionDeltas that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CodeExecutionDeltaFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all CodeExecutionDeltas
     * const codeExecutionDeltas = await prisma.codeExecutionDelta.findMany()
     * 
     * // Get first 10 CodeExecutionDeltas
     * const codeExecutionDeltas = await prisma.codeExecutionDelta.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const codeExecutionDeltaWithIdOnly = await prisma.codeExecutionDelta.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CodeExecutionDeltaFindManyArgs>(args?: SelectSubset<T, CodeExecutionDeltaFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CodeExecutionDeltaPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a CodeExecutionDelta.
     * @param {CodeExecutionDeltaCreateArgs} args - Arguments to create a CodeExecutionDelta.
     * @example
     * // Create one CodeExecutionDelta
     * const CodeExecutionDelta = await prisma.codeExecutionDelta.create({
     *   data: {
     *     // ... data to create a CodeExecutionDelta
     *   }
     * })
     * 
     */
    create<T extends CodeExecutionDeltaCreateArgs>(args: SelectSubset<T, CodeExecutionDeltaCreateArgs<ExtArgs>>): Prisma__CodeExecutionDeltaClient<$Result.GetResult<Prisma.$CodeExecutionDeltaPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many CodeExecutionDeltas.
     * @param {CodeExecutionDeltaCreateManyArgs} args - Arguments to create many CodeExecutionDeltas.
     * @example
     * // Create many CodeExecutionDeltas
     * const codeExecutionDelta = await prisma.codeExecutionDelta.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CodeExecutionDeltaCreateManyArgs>(args?: SelectSubset<T, CodeExecutionDeltaCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many CodeExecutionDeltas and returns the data saved in the database.
     * @param {CodeExecutionDeltaCreateManyAndReturnArgs} args - Arguments to create many CodeExecutionDeltas.
     * @example
     * // Create many CodeExecutionDeltas
     * const codeExecutionDelta = await prisma.codeExecutionDelta.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many CodeExecutionDeltas and only return the `id`
     * const codeExecutionDeltaWithIdOnly = await prisma.codeExecutionDelta.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CodeExecutionDeltaCreateManyAndReturnArgs>(args?: SelectSubset<T, CodeExecutionDeltaCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CodeExecutionDeltaPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a CodeExecutionDelta.
     * @param {CodeExecutionDeltaDeleteArgs} args - Arguments to delete one CodeExecutionDelta.
     * @example
     * // Delete one CodeExecutionDelta
     * const CodeExecutionDelta = await prisma.codeExecutionDelta.delete({
     *   where: {
     *     // ... filter to delete one CodeExecutionDelta
     *   }
     * })
     * 
     */
    delete<T extends CodeExecutionDeltaDeleteArgs>(args: SelectSubset<T, CodeExecutionDeltaDeleteArgs<ExtArgs>>): Prisma__CodeExecutionDeltaClient<$Result.GetResult<Prisma.$CodeExecutionDeltaPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one CodeExecutionDelta.
     * @param {CodeExecutionDeltaUpdateArgs} args - Arguments to update one CodeExecutionDelta.
     * @example
     * // Update one CodeExecutionDelta
     * const codeExecutionDelta = await prisma.codeExecutionDelta.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CodeExecutionDeltaUpdateArgs>(args: SelectSubset<T, CodeExecutionDeltaUpdateArgs<ExtArgs>>): Prisma__CodeExecutionDeltaClient<$Result.GetResult<Prisma.$CodeExecutionDeltaPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more CodeExecutionDeltas.
     * @param {CodeExecutionDeltaDeleteManyArgs} args - Arguments to filter CodeExecutionDeltas to delete.
     * @example
     * // Delete a few CodeExecutionDeltas
     * const { count } = await prisma.codeExecutionDelta.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CodeExecutionDeltaDeleteManyArgs>(args?: SelectSubset<T, CodeExecutionDeltaDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CodeExecutionDeltas.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CodeExecutionDeltaUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many CodeExecutionDeltas
     * const codeExecutionDelta = await prisma.codeExecutionDelta.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CodeExecutionDeltaUpdateManyArgs>(args: SelectSubset<T, CodeExecutionDeltaUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CodeExecutionDeltas and returns the data updated in the database.
     * @param {CodeExecutionDeltaUpdateManyAndReturnArgs} args - Arguments to update many CodeExecutionDeltas.
     * @example
     * // Update many CodeExecutionDeltas
     * const codeExecutionDelta = await prisma.codeExecutionDelta.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more CodeExecutionDeltas and only return the `id`
     * const codeExecutionDeltaWithIdOnly = await prisma.codeExecutionDelta.updateManyAndReturn({
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
    updateManyAndReturn<T extends CodeExecutionDeltaUpdateManyAndReturnArgs>(args: SelectSubset<T, CodeExecutionDeltaUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CodeExecutionDeltaPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one CodeExecutionDelta.
     * @param {CodeExecutionDeltaUpsertArgs} args - Arguments to update or create a CodeExecutionDelta.
     * @example
     * // Update or create a CodeExecutionDelta
     * const codeExecutionDelta = await prisma.codeExecutionDelta.upsert({
     *   create: {
     *     // ... data to create a CodeExecutionDelta
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the CodeExecutionDelta we want to update
     *   }
     * })
     */
    upsert<T extends CodeExecutionDeltaUpsertArgs>(args: SelectSubset<T, CodeExecutionDeltaUpsertArgs<ExtArgs>>): Prisma__CodeExecutionDeltaClient<$Result.GetResult<Prisma.$CodeExecutionDeltaPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of CodeExecutionDeltas.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CodeExecutionDeltaCountArgs} args - Arguments to filter CodeExecutionDeltas to count.
     * @example
     * // Count the number of CodeExecutionDeltas
     * const count = await prisma.codeExecutionDelta.count({
     *   where: {
     *     // ... the filter for the CodeExecutionDeltas we want to count
     *   }
     * })
    **/
    count<T extends CodeExecutionDeltaCountArgs>(
      args?: Subset<T, CodeExecutionDeltaCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CodeExecutionDeltaCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a CodeExecutionDelta.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CodeExecutionDeltaAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends CodeExecutionDeltaAggregateArgs>(args: Subset<T, CodeExecutionDeltaAggregateArgs>): Prisma.PrismaPromise<GetCodeExecutionDeltaAggregateType<T>>

    /**
     * Group by CodeExecutionDelta.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CodeExecutionDeltaGroupByArgs} args - Group by arguments.
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
      T extends CodeExecutionDeltaGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CodeExecutionDeltaGroupByArgs['orderBy'] }
        : { orderBy?: CodeExecutionDeltaGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, CodeExecutionDeltaGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCodeExecutionDeltaGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the CodeExecutionDelta model
   */
  readonly fields: CodeExecutionDeltaFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for CodeExecutionDelta.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CodeExecutionDeltaClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    session<T extends CodingSessionDefaultArgs<ExtArgs> = {}>(args?: Subset<T, CodingSessionDefaultArgs<ExtArgs>>): Prisma__CodingSessionClient<$Result.GetResult<Prisma.$CodingSessionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the CodeExecutionDelta model
   */
  interface CodeExecutionDeltaFieldRefs {
    readonly id: FieldRef<"CodeExecutionDelta", 'String'>
    readonly sessionId: FieldRef<"CodeExecutionDelta", 'String'>
    readonly code: FieldRef<"CodeExecutionDelta", 'String'>
    readonly language: FieldRef<"CodeExecutionDelta", 'String'>
    readonly output: FieldRef<"CodeExecutionDelta", 'String'>
    readonly success: FieldRef<"CodeExecutionDelta", 'Boolean'>
    readonly timestamp: FieldRef<"CodeExecutionDelta", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * CodeExecutionDelta findUnique
   */
  export type CodeExecutionDeltaFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CodeExecutionDelta
     */
    select?: CodeExecutionDeltaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CodeExecutionDelta
     */
    omit?: CodeExecutionDeltaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CodeExecutionDeltaInclude<ExtArgs> | null
    /**
     * Filter, which CodeExecutionDelta to fetch.
     */
    where: CodeExecutionDeltaWhereUniqueInput
  }

  /**
   * CodeExecutionDelta findUniqueOrThrow
   */
  export type CodeExecutionDeltaFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CodeExecutionDelta
     */
    select?: CodeExecutionDeltaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CodeExecutionDelta
     */
    omit?: CodeExecutionDeltaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CodeExecutionDeltaInclude<ExtArgs> | null
    /**
     * Filter, which CodeExecutionDelta to fetch.
     */
    where: CodeExecutionDeltaWhereUniqueInput
  }

  /**
   * CodeExecutionDelta findFirst
   */
  export type CodeExecutionDeltaFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CodeExecutionDelta
     */
    select?: CodeExecutionDeltaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CodeExecutionDelta
     */
    omit?: CodeExecutionDeltaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CodeExecutionDeltaInclude<ExtArgs> | null
    /**
     * Filter, which CodeExecutionDelta to fetch.
     */
    where?: CodeExecutionDeltaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CodeExecutionDeltas to fetch.
     */
    orderBy?: CodeExecutionDeltaOrderByWithRelationInput | CodeExecutionDeltaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CodeExecutionDeltas.
     */
    cursor?: CodeExecutionDeltaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CodeExecutionDeltas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CodeExecutionDeltas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CodeExecutionDeltas.
     */
    distinct?: CodeExecutionDeltaScalarFieldEnum | CodeExecutionDeltaScalarFieldEnum[]
  }

  /**
   * CodeExecutionDelta findFirstOrThrow
   */
  export type CodeExecutionDeltaFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CodeExecutionDelta
     */
    select?: CodeExecutionDeltaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CodeExecutionDelta
     */
    omit?: CodeExecutionDeltaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CodeExecutionDeltaInclude<ExtArgs> | null
    /**
     * Filter, which CodeExecutionDelta to fetch.
     */
    where?: CodeExecutionDeltaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CodeExecutionDeltas to fetch.
     */
    orderBy?: CodeExecutionDeltaOrderByWithRelationInput | CodeExecutionDeltaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CodeExecutionDeltas.
     */
    cursor?: CodeExecutionDeltaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CodeExecutionDeltas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CodeExecutionDeltas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CodeExecutionDeltas.
     */
    distinct?: CodeExecutionDeltaScalarFieldEnum | CodeExecutionDeltaScalarFieldEnum[]
  }

  /**
   * CodeExecutionDelta findMany
   */
  export type CodeExecutionDeltaFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CodeExecutionDelta
     */
    select?: CodeExecutionDeltaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CodeExecutionDelta
     */
    omit?: CodeExecutionDeltaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CodeExecutionDeltaInclude<ExtArgs> | null
    /**
     * Filter, which CodeExecutionDeltas to fetch.
     */
    where?: CodeExecutionDeltaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CodeExecutionDeltas to fetch.
     */
    orderBy?: CodeExecutionDeltaOrderByWithRelationInput | CodeExecutionDeltaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing CodeExecutionDeltas.
     */
    cursor?: CodeExecutionDeltaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CodeExecutionDeltas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CodeExecutionDeltas.
     */
    skip?: number
    distinct?: CodeExecutionDeltaScalarFieldEnum | CodeExecutionDeltaScalarFieldEnum[]
  }

  /**
   * CodeExecutionDelta create
   */
  export type CodeExecutionDeltaCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CodeExecutionDelta
     */
    select?: CodeExecutionDeltaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CodeExecutionDelta
     */
    omit?: CodeExecutionDeltaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CodeExecutionDeltaInclude<ExtArgs> | null
    /**
     * The data needed to create a CodeExecutionDelta.
     */
    data: XOR<CodeExecutionDeltaCreateInput, CodeExecutionDeltaUncheckedCreateInput>
  }

  /**
   * CodeExecutionDelta createMany
   */
  export type CodeExecutionDeltaCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many CodeExecutionDeltas.
     */
    data: CodeExecutionDeltaCreateManyInput | CodeExecutionDeltaCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * CodeExecutionDelta createManyAndReturn
   */
  export type CodeExecutionDeltaCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CodeExecutionDelta
     */
    select?: CodeExecutionDeltaSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CodeExecutionDelta
     */
    omit?: CodeExecutionDeltaOmit<ExtArgs> | null
    /**
     * The data used to create many CodeExecutionDeltas.
     */
    data: CodeExecutionDeltaCreateManyInput | CodeExecutionDeltaCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CodeExecutionDeltaIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * CodeExecutionDelta update
   */
  export type CodeExecutionDeltaUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CodeExecutionDelta
     */
    select?: CodeExecutionDeltaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CodeExecutionDelta
     */
    omit?: CodeExecutionDeltaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CodeExecutionDeltaInclude<ExtArgs> | null
    /**
     * The data needed to update a CodeExecutionDelta.
     */
    data: XOR<CodeExecutionDeltaUpdateInput, CodeExecutionDeltaUncheckedUpdateInput>
    /**
     * Choose, which CodeExecutionDelta to update.
     */
    where: CodeExecutionDeltaWhereUniqueInput
  }

  /**
   * CodeExecutionDelta updateMany
   */
  export type CodeExecutionDeltaUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update CodeExecutionDeltas.
     */
    data: XOR<CodeExecutionDeltaUpdateManyMutationInput, CodeExecutionDeltaUncheckedUpdateManyInput>
    /**
     * Filter which CodeExecutionDeltas to update
     */
    where?: CodeExecutionDeltaWhereInput
    /**
     * Limit how many CodeExecutionDeltas to update.
     */
    limit?: number
  }

  /**
   * CodeExecutionDelta updateManyAndReturn
   */
  export type CodeExecutionDeltaUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CodeExecutionDelta
     */
    select?: CodeExecutionDeltaSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CodeExecutionDelta
     */
    omit?: CodeExecutionDeltaOmit<ExtArgs> | null
    /**
     * The data used to update CodeExecutionDeltas.
     */
    data: XOR<CodeExecutionDeltaUpdateManyMutationInput, CodeExecutionDeltaUncheckedUpdateManyInput>
    /**
     * Filter which CodeExecutionDeltas to update
     */
    where?: CodeExecutionDeltaWhereInput
    /**
     * Limit how many CodeExecutionDeltas to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CodeExecutionDeltaIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * CodeExecutionDelta upsert
   */
  export type CodeExecutionDeltaUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CodeExecutionDelta
     */
    select?: CodeExecutionDeltaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CodeExecutionDelta
     */
    omit?: CodeExecutionDeltaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CodeExecutionDeltaInclude<ExtArgs> | null
    /**
     * The filter to search for the CodeExecutionDelta to update in case it exists.
     */
    where: CodeExecutionDeltaWhereUniqueInput
    /**
     * In case the CodeExecutionDelta found by the `where` argument doesn't exist, create a new CodeExecutionDelta with this data.
     */
    create: XOR<CodeExecutionDeltaCreateInput, CodeExecutionDeltaUncheckedCreateInput>
    /**
     * In case the CodeExecutionDelta was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CodeExecutionDeltaUpdateInput, CodeExecutionDeltaUncheckedUpdateInput>
  }

  /**
   * CodeExecutionDelta delete
   */
  export type CodeExecutionDeltaDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CodeExecutionDelta
     */
    select?: CodeExecutionDeltaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CodeExecutionDelta
     */
    omit?: CodeExecutionDeltaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CodeExecutionDeltaInclude<ExtArgs> | null
    /**
     * Filter which CodeExecutionDelta to delete.
     */
    where: CodeExecutionDeltaWhereUniqueInput
  }

  /**
   * CodeExecutionDelta deleteMany
   */
  export type CodeExecutionDeltaDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CodeExecutionDeltas to delete
     */
    where?: CodeExecutionDeltaWhereInput
    /**
     * Limit how many CodeExecutionDeltas to delete.
     */
    limit?: number
  }

  /**
   * CodeExecutionDelta without action
   */
  export type CodeExecutionDeltaDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CodeExecutionDelta
     */
    select?: CodeExecutionDeltaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CodeExecutionDelta
     */
    omit?: CodeExecutionDeltaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CodeExecutionDeltaInclude<ExtArgs> | null
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


  export const CodingSessionScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    targetRole: 'targetRole',
    difficulty: 'difficulty',
    selectedLanguage: 'selectedLanguage',
    status: 'status',
    testCasesPassed: 'testCasesPassed',
    startedAt: 'startedAt',
    completedAt: 'completedAt'
  };

  export type CodingSessionScalarFieldEnum = (typeof CodingSessionScalarFieldEnum)[keyof typeof CodingSessionScalarFieldEnum]


  export const PreDefinedProblemScalarFieldEnum: {
    id: 'id',
    title: 'title',
    difficulty: 'difficulty',
    pattern: 'pattern',
    description: 'description',
    starterCode: 'starterCode',
    testCases: 'testCases',
    optimalSolution: 'optimalSolution',
    optimalTime: 'optimalTime',
    optimalSpace: 'optimalSpace'
  };

  export type PreDefinedProblemScalarFieldEnum = (typeof PreDefinedProblemScalarFieldEnum)[keyof typeof PreDefinedProblemScalarFieldEnum]


  export const CodeExecutionDeltaScalarFieldEnum: {
    id: 'id',
    sessionId: 'sessionId',
    code: 'code',
    language: 'language',
    output: 'output',
    success: 'success',
    timestamp: 'timestamp'
  };

  export type CodeExecutionDeltaScalarFieldEnum = (typeof CodeExecutionDeltaScalarFieldEnum)[keyof typeof CodeExecutionDeltaScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull
  };

  export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]


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


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


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
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


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


  export type CodingSessionWhereInput = {
    AND?: CodingSessionWhereInput | CodingSessionWhereInput[]
    OR?: CodingSessionWhereInput[]
    NOT?: CodingSessionWhereInput | CodingSessionWhereInput[]
    id?: StringFilter<"CodingSession"> | string
    userId?: StringFilter<"CodingSession"> | string
    targetRole?: StringFilter<"CodingSession"> | string
    difficulty?: StringFilter<"CodingSession"> | string
    selectedLanguage?: StringFilter<"CodingSession"> | string
    status?: StringFilter<"CodingSession"> | string
    testCasesPassed?: IntNullableFilter<"CodingSession"> | number | null
    startedAt?: DateTimeFilter<"CodingSession"> | Date | string
    completedAt?: DateTimeNullableFilter<"CodingSession"> | Date | string | null
    executionDeltas?: CodeExecutionDeltaListRelationFilter
  }

  export type CodingSessionOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    targetRole?: SortOrder
    difficulty?: SortOrder
    selectedLanguage?: SortOrder
    status?: SortOrder
    testCasesPassed?: SortOrderInput | SortOrder
    startedAt?: SortOrder
    completedAt?: SortOrderInput | SortOrder
    executionDeltas?: CodeExecutionDeltaOrderByRelationAggregateInput
  }

  export type CodingSessionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: CodingSessionWhereInput | CodingSessionWhereInput[]
    OR?: CodingSessionWhereInput[]
    NOT?: CodingSessionWhereInput | CodingSessionWhereInput[]
    userId?: StringFilter<"CodingSession"> | string
    targetRole?: StringFilter<"CodingSession"> | string
    difficulty?: StringFilter<"CodingSession"> | string
    selectedLanguage?: StringFilter<"CodingSession"> | string
    status?: StringFilter<"CodingSession"> | string
    testCasesPassed?: IntNullableFilter<"CodingSession"> | number | null
    startedAt?: DateTimeFilter<"CodingSession"> | Date | string
    completedAt?: DateTimeNullableFilter<"CodingSession"> | Date | string | null
    executionDeltas?: CodeExecutionDeltaListRelationFilter
  }, "id">

  export type CodingSessionOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    targetRole?: SortOrder
    difficulty?: SortOrder
    selectedLanguage?: SortOrder
    status?: SortOrder
    testCasesPassed?: SortOrderInput | SortOrder
    startedAt?: SortOrder
    completedAt?: SortOrderInput | SortOrder
    _count?: CodingSessionCountOrderByAggregateInput
    _avg?: CodingSessionAvgOrderByAggregateInput
    _max?: CodingSessionMaxOrderByAggregateInput
    _min?: CodingSessionMinOrderByAggregateInput
    _sum?: CodingSessionSumOrderByAggregateInput
  }

  export type CodingSessionScalarWhereWithAggregatesInput = {
    AND?: CodingSessionScalarWhereWithAggregatesInput | CodingSessionScalarWhereWithAggregatesInput[]
    OR?: CodingSessionScalarWhereWithAggregatesInput[]
    NOT?: CodingSessionScalarWhereWithAggregatesInput | CodingSessionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"CodingSession"> | string
    userId?: StringWithAggregatesFilter<"CodingSession"> | string
    targetRole?: StringWithAggregatesFilter<"CodingSession"> | string
    difficulty?: StringWithAggregatesFilter<"CodingSession"> | string
    selectedLanguage?: StringWithAggregatesFilter<"CodingSession"> | string
    status?: StringWithAggregatesFilter<"CodingSession"> | string
    testCasesPassed?: IntNullableWithAggregatesFilter<"CodingSession"> | number | null
    startedAt?: DateTimeWithAggregatesFilter<"CodingSession"> | Date | string
    completedAt?: DateTimeNullableWithAggregatesFilter<"CodingSession"> | Date | string | null
  }

  export type PreDefinedProblemWhereInput = {
    AND?: PreDefinedProblemWhereInput | PreDefinedProblemWhereInput[]
    OR?: PreDefinedProblemWhereInput[]
    NOT?: PreDefinedProblemWhereInput | PreDefinedProblemWhereInput[]
    id?: StringFilter<"PreDefinedProblem"> | string
    title?: StringFilter<"PreDefinedProblem"> | string
    difficulty?: StringFilter<"PreDefinedProblem"> | string
    pattern?: StringFilter<"PreDefinedProblem"> | string
    description?: StringFilter<"PreDefinedProblem"> | string
    starterCode?: JsonFilter<"PreDefinedProblem">
    testCases?: JsonFilter<"PreDefinedProblem">
    optimalSolution?: StringFilter<"PreDefinedProblem"> | string
    optimalTime?: StringFilter<"PreDefinedProblem"> | string
    optimalSpace?: StringFilter<"PreDefinedProblem"> | string
  }

  export type PreDefinedProblemOrderByWithRelationInput = {
    id?: SortOrder
    title?: SortOrder
    difficulty?: SortOrder
    pattern?: SortOrder
    description?: SortOrder
    starterCode?: SortOrder
    testCases?: SortOrder
    optimalSolution?: SortOrder
    optimalTime?: SortOrder
    optimalSpace?: SortOrder
  }

  export type PreDefinedProblemWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: PreDefinedProblemWhereInput | PreDefinedProblemWhereInput[]
    OR?: PreDefinedProblemWhereInput[]
    NOT?: PreDefinedProblemWhereInput | PreDefinedProblemWhereInput[]
    title?: StringFilter<"PreDefinedProblem"> | string
    difficulty?: StringFilter<"PreDefinedProblem"> | string
    pattern?: StringFilter<"PreDefinedProblem"> | string
    description?: StringFilter<"PreDefinedProblem"> | string
    starterCode?: JsonFilter<"PreDefinedProblem">
    testCases?: JsonFilter<"PreDefinedProblem">
    optimalSolution?: StringFilter<"PreDefinedProblem"> | string
    optimalTime?: StringFilter<"PreDefinedProblem"> | string
    optimalSpace?: StringFilter<"PreDefinedProblem"> | string
  }, "id">

  export type PreDefinedProblemOrderByWithAggregationInput = {
    id?: SortOrder
    title?: SortOrder
    difficulty?: SortOrder
    pattern?: SortOrder
    description?: SortOrder
    starterCode?: SortOrder
    testCases?: SortOrder
    optimalSolution?: SortOrder
    optimalTime?: SortOrder
    optimalSpace?: SortOrder
    _count?: PreDefinedProblemCountOrderByAggregateInput
    _max?: PreDefinedProblemMaxOrderByAggregateInput
    _min?: PreDefinedProblemMinOrderByAggregateInput
  }

  export type PreDefinedProblemScalarWhereWithAggregatesInput = {
    AND?: PreDefinedProblemScalarWhereWithAggregatesInput | PreDefinedProblemScalarWhereWithAggregatesInput[]
    OR?: PreDefinedProblemScalarWhereWithAggregatesInput[]
    NOT?: PreDefinedProblemScalarWhereWithAggregatesInput | PreDefinedProblemScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"PreDefinedProblem"> | string
    title?: StringWithAggregatesFilter<"PreDefinedProblem"> | string
    difficulty?: StringWithAggregatesFilter<"PreDefinedProblem"> | string
    pattern?: StringWithAggregatesFilter<"PreDefinedProblem"> | string
    description?: StringWithAggregatesFilter<"PreDefinedProblem"> | string
    starterCode?: JsonWithAggregatesFilter<"PreDefinedProblem">
    testCases?: JsonWithAggregatesFilter<"PreDefinedProblem">
    optimalSolution?: StringWithAggregatesFilter<"PreDefinedProblem"> | string
    optimalTime?: StringWithAggregatesFilter<"PreDefinedProblem"> | string
    optimalSpace?: StringWithAggregatesFilter<"PreDefinedProblem"> | string
  }

  export type CodeExecutionDeltaWhereInput = {
    AND?: CodeExecutionDeltaWhereInput | CodeExecutionDeltaWhereInput[]
    OR?: CodeExecutionDeltaWhereInput[]
    NOT?: CodeExecutionDeltaWhereInput | CodeExecutionDeltaWhereInput[]
    id?: StringFilter<"CodeExecutionDelta"> | string
    sessionId?: StringFilter<"CodeExecutionDelta"> | string
    code?: StringFilter<"CodeExecutionDelta"> | string
    language?: StringFilter<"CodeExecutionDelta"> | string
    output?: StringNullableFilter<"CodeExecutionDelta"> | string | null
    success?: BoolNullableFilter<"CodeExecutionDelta"> | boolean | null
    timestamp?: DateTimeFilter<"CodeExecutionDelta"> | Date | string
    session?: XOR<CodingSessionScalarRelationFilter, CodingSessionWhereInput>
  }

  export type CodeExecutionDeltaOrderByWithRelationInput = {
    id?: SortOrder
    sessionId?: SortOrder
    code?: SortOrder
    language?: SortOrder
    output?: SortOrderInput | SortOrder
    success?: SortOrderInput | SortOrder
    timestamp?: SortOrder
    session?: CodingSessionOrderByWithRelationInput
  }

  export type CodeExecutionDeltaWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: CodeExecutionDeltaWhereInput | CodeExecutionDeltaWhereInput[]
    OR?: CodeExecutionDeltaWhereInput[]
    NOT?: CodeExecutionDeltaWhereInput | CodeExecutionDeltaWhereInput[]
    sessionId?: StringFilter<"CodeExecutionDelta"> | string
    code?: StringFilter<"CodeExecutionDelta"> | string
    language?: StringFilter<"CodeExecutionDelta"> | string
    output?: StringNullableFilter<"CodeExecutionDelta"> | string | null
    success?: BoolNullableFilter<"CodeExecutionDelta"> | boolean | null
    timestamp?: DateTimeFilter<"CodeExecutionDelta"> | Date | string
    session?: XOR<CodingSessionScalarRelationFilter, CodingSessionWhereInput>
  }, "id">

  export type CodeExecutionDeltaOrderByWithAggregationInput = {
    id?: SortOrder
    sessionId?: SortOrder
    code?: SortOrder
    language?: SortOrder
    output?: SortOrderInput | SortOrder
    success?: SortOrderInput | SortOrder
    timestamp?: SortOrder
    _count?: CodeExecutionDeltaCountOrderByAggregateInput
    _max?: CodeExecutionDeltaMaxOrderByAggregateInput
    _min?: CodeExecutionDeltaMinOrderByAggregateInput
  }

  export type CodeExecutionDeltaScalarWhereWithAggregatesInput = {
    AND?: CodeExecutionDeltaScalarWhereWithAggregatesInput | CodeExecutionDeltaScalarWhereWithAggregatesInput[]
    OR?: CodeExecutionDeltaScalarWhereWithAggregatesInput[]
    NOT?: CodeExecutionDeltaScalarWhereWithAggregatesInput | CodeExecutionDeltaScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"CodeExecutionDelta"> | string
    sessionId?: StringWithAggregatesFilter<"CodeExecutionDelta"> | string
    code?: StringWithAggregatesFilter<"CodeExecutionDelta"> | string
    language?: StringWithAggregatesFilter<"CodeExecutionDelta"> | string
    output?: StringNullableWithAggregatesFilter<"CodeExecutionDelta"> | string | null
    success?: BoolNullableWithAggregatesFilter<"CodeExecutionDelta"> | boolean | null
    timestamp?: DateTimeWithAggregatesFilter<"CodeExecutionDelta"> | Date | string
  }

  export type CodingSessionCreateInput = {
    id?: string
    userId: string
    targetRole: string
    difficulty?: string
    selectedLanguage?: string
    status?: string
    testCasesPassed?: number | null
    startedAt?: Date | string
    completedAt?: Date | string | null
    executionDeltas?: CodeExecutionDeltaCreateNestedManyWithoutSessionInput
  }

  export type CodingSessionUncheckedCreateInput = {
    id?: string
    userId: string
    targetRole: string
    difficulty?: string
    selectedLanguage?: string
    status?: string
    testCasesPassed?: number | null
    startedAt?: Date | string
    completedAt?: Date | string | null
    executionDeltas?: CodeExecutionDeltaUncheckedCreateNestedManyWithoutSessionInput
  }

  export type CodingSessionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    targetRole?: StringFieldUpdateOperationsInput | string
    difficulty?: StringFieldUpdateOperationsInput | string
    selectedLanguage?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    testCasesPassed?: NullableIntFieldUpdateOperationsInput | number | null
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    executionDeltas?: CodeExecutionDeltaUpdateManyWithoutSessionNestedInput
  }

  export type CodingSessionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    targetRole?: StringFieldUpdateOperationsInput | string
    difficulty?: StringFieldUpdateOperationsInput | string
    selectedLanguage?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    testCasesPassed?: NullableIntFieldUpdateOperationsInput | number | null
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    executionDeltas?: CodeExecutionDeltaUncheckedUpdateManyWithoutSessionNestedInput
  }

  export type CodingSessionCreateManyInput = {
    id?: string
    userId: string
    targetRole: string
    difficulty?: string
    selectedLanguage?: string
    status?: string
    testCasesPassed?: number | null
    startedAt?: Date | string
    completedAt?: Date | string | null
  }

  export type CodingSessionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    targetRole?: StringFieldUpdateOperationsInput | string
    difficulty?: StringFieldUpdateOperationsInput | string
    selectedLanguage?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    testCasesPassed?: NullableIntFieldUpdateOperationsInput | number | null
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type CodingSessionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    targetRole?: StringFieldUpdateOperationsInput | string
    difficulty?: StringFieldUpdateOperationsInput | string
    selectedLanguage?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    testCasesPassed?: NullableIntFieldUpdateOperationsInput | number | null
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type PreDefinedProblemCreateInput = {
    id?: string
    title: string
    difficulty: string
    pattern: string
    description: string
    starterCode: JsonNullValueInput | InputJsonValue
    testCases: JsonNullValueInput | InputJsonValue
    optimalSolution: string
    optimalTime: string
    optimalSpace: string
  }

  export type PreDefinedProblemUncheckedCreateInput = {
    id?: string
    title: string
    difficulty: string
    pattern: string
    description: string
    starterCode: JsonNullValueInput | InputJsonValue
    testCases: JsonNullValueInput | InputJsonValue
    optimalSolution: string
    optimalTime: string
    optimalSpace: string
  }

  export type PreDefinedProblemUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    difficulty?: StringFieldUpdateOperationsInput | string
    pattern?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    starterCode?: JsonNullValueInput | InputJsonValue
    testCases?: JsonNullValueInput | InputJsonValue
    optimalSolution?: StringFieldUpdateOperationsInput | string
    optimalTime?: StringFieldUpdateOperationsInput | string
    optimalSpace?: StringFieldUpdateOperationsInput | string
  }

  export type PreDefinedProblemUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    difficulty?: StringFieldUpdateOperationsInput | string
    pattern?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    starterCode?: JsonNullValueInput | InputJsonValue
    testCases?: JsonNullValueInput | InputJsonValue
    optimalSolution?: StringFieldUpdateOperationsInput | string
    optimalTime?: StringFieldUpdateOperationsInput | string
    optimalSpace?: StringFieldUpdateOperationsInput | string
  }

  export type PreDefinedProblemCreateManyInput = {
    id?: string
    title: string
    difficulty: string
    pattern: string
    description: string
    starterCode: JsonNullValueInput | InputJsonValue
    testCases: JsonNullValueInput | InputJsonValue
    optimalSolution: string
    optimalTime: string
    optimalSpace: string
  }

  export type PreDefinedProblemUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    difficulty?: StringFieldUpdateOperationsInput | string
    pattern?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    starterCode?: JsonNullValueInput | InputJsonValue
    testCases?: JsonNullValueInput | InputJsonValue
    optimalSolution?: StringFieldUpdateOperationsInput | string
    optimalTime?: StringFieldUpdateOperationsInput | string
    optimalSpace?: StringFieldUpdateOperationsInput | string
  }

  export type PreDefinedProblemUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    difficulty?: StringFieldUpdateOperationsInput | string
    pattern?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    starterCode?: JsonNullValueInput | InputJsonValue
    testCases?: JsonNullValueInput | InputJsonValue
    optimalSolution?: StringFieldUpdateOperationsInput | string
    optimalTime?: StringFieldUpdateOperationsInput | string
    optimalSpace?: StringFieldUpdateOperationsInput | string
  }

  export type CodeExecutionDeltaCreateInput = {
    id?: string
    code: string
    language: string
    output?: string | null
    success?: boolean | null
    timestamp?: Date | string
    session: CodingSessionCreateNestedOneWithoutExecutionDeltasInput
  }

  export type CodeExecutionDeltaUncheckedCreateInput = {
    id?: string
    sessionId: string
    code: string
    language: string
    output?: string | null
    success?: boolean | null
    timestamp?: Date | string
  }

  export type CodeExecutionDeltaUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    language?: StringFieldUpdateOperationsInput | string
    output?: NullableStringFieldUpdateOperationsInput | string | null
    success?: NullableBoolFieldUpdateOperationsInput | boolean | null
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    session?: CodingSessionUpdateOneRequiredWithoutExecutionDeltasNestedInput
  }

  export type CodeExecutionDeltaUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionId?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    language?: StringFieldUpdateOperationsInput | string
    output?: NullableStringFieldUpdateOperationsInput | string | null
    success?: NullableBoolFieldUpdateOperationsInput | boolean | null
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CodeExecutionDeltaCreateManyInput = {
    id?: string
    sessionId: string
    code: string
    language: string
    output?: string | null
    success?: boolean | null
    timestamp?: Date | string
  }

  export type CodeExecutionDeltaUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    language?: StringFieldUpdateOperationsInput | string
    output?: NullableStringFieldUpdateOperationsInput | string | null
    success?: NullableBoolFieldUpdateOperationsInput | boolean | null
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CodeExecutionDeltaUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionId?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    language?: StringFieldUpdateOperationsInput | string
    output?: NullableStringFieldUpdateOperationsInput | string | null
    success?: NullableBoolFieldUpdateOperationsInput | boolean | null
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

  export type CodeExecutionDeltaListRelationFilter = {
    every?: CodeExecutionDeltaWhereInput
    some?: CodeExecutionDeltaWhereInput
    none?: CodeExecutionDeltaWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type CodeExecutionDeltaOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type CodingSessionCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    targetRole?: SortOrder
    difficulty?: SortOrder
    selectedLanguage?: SortOrder
    status?: SortOrder
    testCasesPassed?: SortOrder
    startedAt?: SortOrder
    completedAt?: SortOrder
  }

  export type CodingSessionAvgOrderByAggregateInput = {
    testCasesPassed?: SortOrder
  }

  export type CodingSessionMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    targetRole?: SortOrder
    difficulty?: SortOrder
    selectedLanguage?: SortOrder
    status?: SortOrder
    testCasesPassed?: SortOrder
    startedAt?: SortOrder
    completedAt?: SortOrder
  }

  export type CodingSessionMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    targetRole?: SortOrder
    difficulty?: SortOrder
    selectedLanguage?: SortOrder
    status?: SortOrder
    testCasesPassed?: SortOrder
    startedAt?: SortOrder
    completedAt?: SortOrder
  }

  export type CodingSessionSumOrderByAggregateInput = {
    testCasesPassed?: SortOrder
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
  export type JsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonFilterBase<$PrismaModel>>, 'path'>>

  export type JsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type PreDefinedProblemCountOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    difficulty?: SortOrder
    pattern?: SortOrder
    description?: SortOrder
    starterCode?: SortOrder
    testCases?: SortOrder
    optimalSolution?: SortOrder
    optimalTime?: SortOrder
    optimalSpace?: SortOrder
  }

  export type PreDefinedProblemMaxOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    difficulty?: SortOrder
    pattern?: SortOrder
    description?: SortOrder
    optimalSolution?: SortOrder
    optimalTime?: SortOrder
    optimalSpace?: SortOrder
  }

  export type PreDefinedProblemMinOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    difficulty?: SortOrder
    pattern?: SortOrder
    description?: SortOrder
    optimalSolution?: SortOrder
    optimalTime?: SortOrder
    optimalSpace?: SortOrder
  }
  export type JsonWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedJsonFilter<$PrismaModel>
    _max?: NestedJsonFilter<$PrismaModel>
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

  export type BoolNullableFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableFilter<$PrismaModel> | boolean | null
  }

  export type CodingSessionScalarRelationFilter = {
    is?: CodingSessionWhereInput
    isNot?: CodingSessionWhereInput
  }

  export type CodeExecutionDeltaCountOrderByAggregateInput = {
    id?: SortOrder
    sessionId?: SortOrder
    code?: SortOrder
    language?: SortOrder
    output?: SortOrder
    success?: SortOrder
    timestamp?: SortOrder
  }

  export type CodeExecutionDeltaMaxOrderByAggregateInput = {
    id?: SortOrder
    sessionId?: SortOrder
    code?: SortOrder
    language?: SortOrder
    output?: SortOrder
    success?: SortOrder
    timestamp?: SortOrder
  }

  export type CodeExecutionDeltaMinOrderByAggregateInput = {
    id?: SortOrder
    sessionId?: SortOrder
    code?: SortOrder
    language?: SortOrder
    output?: SortOrder
    success?: SortOrder
    timestamp?: SortOrder
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

  export type BoolNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableWithAggregatesFilter<$PrismaModel> | boolean | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedBoolNullableFilter<$PrismaModel>
    _max?: NestedBoolNullableFilter<$PrismaModel>
  }

  export type CodeExecutionDeltaCreateNestedManyWithoutSessionInput = {
    create?: XOR<CodeExecutionDeltaCreateWithoutSessionInput, CodeExecutionDeltaUncheckedCreateWithoutSessionInput> | CodeExecutionDeltaCreateWithoutSessionInput[] | CodeExecutionDeltaUncheckedCreateWithoutSessionInput[]
    connectOrCreate?: CodeExecutionDeltaCreateOrConnectWithoutSessionInput | CodeExecutionDeltaCreateOrConnectWithoutSessionInput[]
    createMany?: CodeExecutionDeltaCreateManySessionInputEnvelope
    connect?: CodeExecutionDeltaWhereUniqueInput | CodeExecutionDeltaWhereUniqueInput[]
  }

  export type CodeExecutionDeltaUncheckedCreateNestedManyWithoutSessionInput = {
    create?: XOR<CodeExecutionDeltaCreateWithoutSessionInput, CodeExecutionDeltaUncheckedCreateWithoutSessionInput> | CodeExecutionDeltaCreateWithoutSessionInput[] | CodeExecutionDeltaUncheckedCreateWithoutSessionInput[]
    connectOrCreate?: CodeExecutionDeltaCreateOrConnectWithoutSessionInput | CodeExecutionDeltaCreateOrConnectWithoutSessionInput[]
    createMany?: CodeExecutionDeltaCreateManySessionInputEnvelope
    connect?: CodeExecutionDeltaWhereUniqueInput | CodeExecutionDeltaWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type CodeExecutionDeltaUpdateManyWithoutSessionNestedInput = {
    create?: XOR<CodeExecutionDeltaCreateWithoutSessionInput, CodeExecutionDeltaUncheckedCreateWithoutSessionInput> | CodeExecutionDeltaCreateWithoutSessionInput[] | CodeExecutionDeltaUncheckedCreateWithoutSessionInput[]
    connectOrCreate?: CodeExecutionDeltaCreateOrConnectWithoutSessionInput | CodeExecutionDeltaCreateOrConnectWithoutSessionInput[]
    upsert?: CodeExecutionDeltaUpsertWithWhereUniqueWithoutSessionInput | CodeExecutionDeltaUpsertWithWhereUniqueWithoutSessionInput[]
    createMany?: CodeExecutionDeltaCreateManySessionInputEnvelope
    set?: CodeExecutionDeltaWhereUniqueInput | CodeExecutionDeltaWhereUniqueInput[]
    disconnect?: CodeExecutionDeltaWhereUniqueInput | CodeExecutionDeltaWhereUniqueInput[]
    delete?: CodeExecutionDeltaWhereUniqueInput | CodeExecutionDeltaWhereUniqueInput[]
    connect?: CodeExecutionDeltaWhereUniqueInput | CodeExecutionDeltaWhereUniqueInput[]
    update?: CodeExecutionDeltaUpdateWithWhereUniqueWithoutSessionInput | CodeExecutionDeltaUpdateWithWhereUniqueWithoutSessionInput[]
    updateMany?: CodeExecutionDeltaUpdateManyWithWhereWithoutSessionInput | CodeExecutionDeltaUpdateManyWithWhereWithoutSessionInput[]
    deleteMany?: CodeExecutionDeltaScalarWhereInput | CodeExecutionDeltaScalarWhereInput[]
  }

  export type CodeExecutionDeltaUncheckedUpdateManyWithoutSessionNestedInput = {
    create?: XOR<CodeExecutionDeltaCreateWithoutSessionInput, CodeExecutionDeltaUncheckedCreateWithoutSessionInput> | CodeExecutionDeltaCreateWithoutSessionInput[] | CodeExecutionDeltaUncheckedCreateWithoutSessionInput[]
    connectOrCreate?: CodeExecutionDeltaCreateOrConnectWithoutSessionInput | CodeExecutionDeltaCreateOrConnectWithoutSessionInput[]
    upsert?: CodeExecutionDeltaUpsertWithWhereUniqueWithoutSessionInput | CodeExecutionDeltaUpsertWithWhereUniqueWithoutSessionInput[]
    createMany?: CodeExecutionDeltaCreateManySessionInputEnvelope
    set?: CodeExecutionDeltaWhereUniqueInput | CodeExecutionDeltaWhereUniqueInput[]
    disconnect?: CodeExecutionDeltaWhereUniqueInput | CodeExecutionDeltaWhereUniqueInput[]
    delete?: CodeExecutionDeltaWhereUniqueInput | CodeExecutionDeltaWhereUniqueInput[]
    connect?: CodeExecutionDeltaWhereUniqueInput | CodeExecutionDeltaWhereUniqueInput[]
    update?: CodeExecutionDeltaUpdateWithWhereUniqueWithoutSessionInput | CodeExecutionDeltaUpdateWithWhereUniqueWithoutSessionInput[]
    updateMany?: CodeExecutionDeltaUpdateManyWithWhereWithoutSessionInput | CodeExecutionDeltaUpdateManyWithWhereWithoutSessionInput[]
    deleteMany?: CodeExecutionDeltaScalarWhereInput | CodeExecutionDeltaScalarWhereInput[]
  }

  export type CodingSessionCreateNestedOneWithoutExecutionDeltasInput = {
    create?: XOR<CodingSessionCreateWithoutExecutionDeltasInput, CodingSessionUncheckedCreateWithoutExecutionDeltasInput>
    connectOrCreate?: CodingSessionCreateOrConnectWithoutExecutionDeltasInput
    connect?: CodingSessionWhereUniqueInput
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type NullableBoolFieldUpdateOperationsInput = {
    set?: boolean | null
  }

  export type CodingSessionUpdateOneRequiredWithoutExecutionDeltasNestedInput = {
    create?: XOR<CodingSessionCreateWithoutExecutionDeltasInput, CodingSessionUncheckedCreateWithoutExecutionDeltasInput>
    connectOrCreate?: CodingSessionCreateOrConnectWithoutExecutionDeltasInput
    upsert?: CodingSessionUpsertWithoutExecutionDeltasInput
    connect?: CodingSessionWhereUniqueInput
    update?: XOR<XOR<CodingSessionUpdateToOneWithWhereWithoutExecutionDeltasInput, CodingSessionUpdateWithoutExecutionDeltasInput>, CodingSessionUncheckedUpdateWithoutExecutionDeltasInput>
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
  export type NestedJsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
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

  export type NestedBoolNullableFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableFilter<$PrismaModel> | boolean | null
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

  export type NestedBoolNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableWithAggregatesFilter<$PrismaModel> | boolean | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedBoolNullableFilter<$PrismaModel>
    _max?: NestedBoolNullableFilter<$PrismaModel>
  }

  export type CodeExecutionDeltaCreateWithoutSessionInput = {
    id?: string
    code: string
    language: string
    output?: string | null
    success?: boolean | null
    timestamp?: Date | string
  }

  export type CodeExecutionDeltaUncheckedCreateWithoutSessionInput = {
    id?: string
    code: string
    language: string
    output?: string | null
    success?: boolean | null
    timestamp?: Date | string
  }

  export type CodeExecutionDeltaCreateOrConnectWithoutSessionInput = {
    where: CodeExecutionDeltaWhereUniqueInput
    create: XOR<CodeExecutionDeltaCreateWithoutSessionInput, CodeExecutionDeltaUncheckedCreateWithoutSessionInput>
  }

  export type CodeExecutionDeltaCreateManySessionInputEnvelope = {
    data: CodeExecutionDeltaCreateManySessionInput | CodeExecutionDeltaCreateManySessionInput[]
    skipDuplicates?: boolean
  }

  export type CodeExecutionDeltaUpsertWithWhereUniqueWithoutSessionInput = {
    where: CodeExecutionDeltaWhereUniqueInput
    update: XOR<CodeExecutionDeltaUpdateWithoutSessionInput, CodeExecutionDeltaUncheckedUpdateWithoutSessionInput>
    create: XOR<CodeExecutionDeltaCreateWithoutSessionInput, CodeExecutionDeltaUncheckedCreateWithoutSessionInput>
  }

  export type CodeExecutionDeltaUpdateWithWhereUniqueWithoutSessionInput = {
    where: CodeExecutionDeltaWhereUniqueInput
    data: XOR<CodeExecutionDeltaUpdateWithoutSessionInput, CodeExecutionDeltaUncheckedUpdateWithoutSessionInput>
  }

  export type CodeExecutionDeltaUpdateManyWithWhereWithoutSessionInput = {
    where: CodeExecutionDeltaScalarWhereInput
    data: XOR<CodeExecutionDeltaUpdateManyMutationInput, CodeExecutionDeltaUncheckedUpdateManyWithoutSessionInput>
  }

  export type CodeExecutionDeltaScalarWhereInput = {
    AND?: CodeExecutionDeltaScalarWhereInput | CodeExecutionDeltaScalarWhereInput[]
    OR?: CodeExecutionDeltaScalarWhereInput[]
    NOT?: CodeExecutionDeltaScalarWhereInput | CodeExecutionDeltaScalarWhereInput[]
    id?: StringFilter<"CodeExecutionDelta"> | string
    sessionId?: StringFilter<"CodeExecutionDelta"> | string
    code?: StringFilter<"CodeExecutionDelta"> | string
    language?: StringFilter<"CodeExecutionDelta"> | string
    output?: StringNullableFilter<"CodeExecutionDelta"> | string | null
    success?: BoolNullableFilter<"CodeExecutionDelta"> | boolean | null
    timestamp?: DateTimeFilter<"CodeExecutionDelta"> | Date | string
  }

  export type CodingSessionCreateWithoutExecutionDeltasInput = {
    id?: string
    userId: string
    targetRole: string
    difficulty?: string
    selectedLanguage?: string
    status?: string
    testCasesPassed?: number | null
    startedAt?: Date | string
    completedAt?: Date | string | null
  }

  export type CodingSessionUncheckedCreateWithoutExecutionDeltasInput = {
    id?: string
    userId: string
    targetRole: string
    difficulty?: string
    selectedLanguage?: string
    status?: string
    testCasesPassed?: number | null
    startedAt?: Date | string
    completedAt?: Date | string | null
  }

  export type CodingSessionCreateOrConnectWithoutExecutionDeltasInput = {
    where: CodingSessionWhereUniqueInput
    create: XOR<CodingSessionCreateWithoutExecutionDeltasInput, CodingSessionUncheckedCreateWithoutExecutionDeltasInput>
  }

  export type CodingSessionUpsertWithoutExecutionDeltasInput = {
    update: XOR<CodingSessionUpdateWithoutExecutionDeltasInput, CodingSessionUncheckedUpdateWithoutExecutionDeltasInput>
    create: XOR<CodingSessionCreateWithoutExecutionDeltasInput, CodingSessionUncheckedCreateWithoutExecutionDeltasInput>
    where?: CodingSessionWhereInput
  }

  export type CodingSessionUpdateToOneWithWhereWithoutExecutionDeltasInput = {
    where?: CodingSessionWhereInput
    data: XOR<CodingSessionUpdateWithoutExecutionDeltasInput, CodingSessionUncheckedUpdateWithoutExecutionDeltasInput>
  }

  export type CodingSessionUpdateWithoutExecutionDeltasInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    targetRole?: StringFieldUpdateOperationsInput | string
    difficulty?: StringFieldUpdateOperationsInput | string
    selectedLanguage?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    testCasesPassed?: NullableIntFieldUpdateOperationsInput | number | null
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type CodingSessionUncheckedUpdateWithoutExecutionDeltasInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    targetRole?: StringFieldUpdateOperationsInput | string
    difficulty?: StringFieldUpdateOperationsInput | string
    selectedLanguage?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    testCasesPassed?: NullableIntFieldUpdateOperationsInput | number | null
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type CodeExecutionDeltaCreateManySessionInput = {
    id?: string
    code: string
    language: string
    output?: string | null
    success?: boolean | null
    timestamp?: Date | string
  }

  export type CodeExecutionDeltaUpdateWithoutSessionInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    language?: StringFieldUpdateOperationsInput | string
    output?: NullableStringFieldUpdateOperationsInput | string | null
    success?: NullableBoolFieldUpdateOperationsInput | boolean | null
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CodeExecutionDeltaUncheckedUpdateWithoutSessionInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    language?: StringFieldUpdateOperationsInput | string
    output?: NullableStringFieldUpdateOperationsInput | string | null
    success?: NullableBoolFieldUpdateOperationsInput | boolean | null
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CodeExecutionDeltaUncheckedUpdateManyWithoutSessionInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    language?: StringFieldUpdateOperationsInput | string
    output?: NullableStringFieldUpdateOperationsInput | string | null
    success?: NullableBoolFieldUpdateOperationsInput | boolean | null
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