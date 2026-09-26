
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
 * Model SystemDesignProblem
 * 
 */
export type SystemDesignProblem = $Result.DefaultSelection<Prisma.$SystemDesignProblemPayload>
/**
 * Model SystemDesignSession
 * 
 */
export type SystemDesignSession = $Result.DefaultSelection<Prisma.$SystemDesignSessionPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more SystemDesignProblems
 * const systemDesignProblems = await prisma.systemDesignProblem.findMany()
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
   * // Fetch zero or more SystemDesignProblems
   * const systemDesignProblems = await prisma.systemDesignProblem.findMany()
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
   * `prisma.systemDesignProblem`: Exposes CRUD operations for the **SystemDesignProblem** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SystemDesignProblems
    * const systemDesignProblems = await prisma.systemDesignProblem.findMany()
    * ```
    */
  get systemDesignProblem(): Prisma.SystemDesignProblemDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.systemDesignSession`: Exposes CRUD operations for the **SystemDesignSession** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SystemDesignSessions
    * const systemDesignSessions = await prisma.systemDesignSession.findMany()
    * ```
    */
  get systemDesignSession(): Prisma.SystemDesignSessionDelegate<ExtArgs, ClientOptions>;
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
    SystemDesignProblem: 'SystemDesignProblem',
    SystemDesignSession: 'SystemDesignSession'
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
      modelProps: "systemDesignProblem" | "systemDesignSession"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      SystemDesignProblem: {
        payload: Prisma.$SystemDesignProblemPayload<ExtArgs>
        fields: Prisma.SystemDesignProblemFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SystemDesignProblemFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemDesignProblemPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SystemDesignProblemFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemDesignProblemPayload>
          }
          findFirst: {
            args: Prisma.SystemDesignProblemFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemDesignProblemPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SystemDesignProblemFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemDesignProblemPayload>
          }
          findMany: {
            args: Prisma.SystemDesignProblemFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemDesignProblemPayload>[]
          }
          create: {
            args: Prisma.SystemDesignProblemCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemDesignProblemPayload>
          }
          createMany: {
            args: Prisma.SystemDesignProblemCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SystemDesignProblemCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemDesignProblemPayload>[]
          }
          delete: {
            args: Prisma.SystemDesignProblemDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemDesignProblemPayload>
          }
          update: {
            args: Prisma.SystemDesignProblemUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemDesignProblemPayload>
          }
          deleteMany: {
            args: Prisma.SystemDesignProblemDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SystemDesignProblemUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SystemDesignProblemUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemDesignProblemPayload>[]
          }
          upsert: {
            args: Prisma.SystemDesignProblemUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemDesignProblemPayload>
          }
          aggregate: {
            args: Prisma.SystemDesignProblemAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSystemDesignProblem>
          }
          groupBy: {
            args: Prisma.SystemDesignProblemGroupByArgs<ExtArgs>
            result: $Utils.Optional<SystemDesignProblemGroupByOutputType>[]
          }
          count: {
            args: Prisma.SystemDesignProblemCountArgs<ExtArgs>
            result: $Utils.Optional<SystemDesignProblemCountAggregateOutputType> | number
          }
        }
      }
      SystemDesignSession: {
        payload: Prisma.$SystemDesignSessionPayload<ExtArgs>
        fields: Prisma.SystemDesignSessionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SystemDesignSessionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemDesignSessionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SystemDesignSessionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemDesignSessionPayload>
          }
          findFirst: {
            args: Prisma.SystemDesignSessionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemDesignSessionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SystemDesignSessionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemDesignSessionPayload>
          }
          findMany: {
            args: Prisma.SystemDesignSessionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemDesignSessionPayload>[]
          }
          create: {
            args: Prisma.SystemDesignSessionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemDesignSessionPayload>
          }
          createMany: {
            args: Prisma.SystemDesignSessionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SystemDesignSessionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemDesignSessionPayload>[]
          }
          delete: {
            args: Prisma.SystemDesignSessionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemDesignSessionPayload>
          }
          update: {
            args: Prisma.SystemDesignSessionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemDesignSessionPayload>
          }
          deleteMany: {
            args: Prisma.SystemDesignSessionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SystemDesignSessionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SystemDesignSessionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemDesignSessionPayload>[]
          }
          upsert: {
            args: Prisma.SystemDesignSessionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemDesignSessionPayload>
          }
          aggregate: {
            args: Prisma.SystemDesignSessionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSystemDesignSession>
          }
          groupBy: {
            args: Prisma.SystemDesignSessionGroupByArgs<ExtArgs>
            result: $Utils.Optional<SystemDesignSessionGroupByOutputType>[]
          }
          count: {
            args: Prisma.SystemDesignSessionCountArgs<ExtArgs>
            result: $Utils.Optional<SystemDesignSessionCountAggregateOutputType> | number
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
    systemDesignProblem?: SystemDesignProblemOmit
    systemDesignSession?: SystemDesignSessionOmit
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
   * Count Type SystemDesignProblemCountOutputType
   */

  export type SystemDesignProblemCountOutputType = {
    sessions: number
  }

  export type SystemDesignProblemCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sessions?: boolean | SystemDesignProblemCountOutputTypeCountSessionsArgs
  }

  // Custom InputTypes
  /**
   * SystemDesignProblemCountOutputType without action
   */
  export type SystemDesignProblemCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemDesignProblemCountOutputType
     */
    select?: SystemDesignProblemCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * SystemDesignProblemCountOutputType without action
   */
  export type SystemDesignProblemCountOutputTypeCountSessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SystemDesignSessionWhereInput
  }


  /**
   * Models
   */

  /**
   * Model SystemDesignProblem
   */

  export type AggregateSystemDesignProblem = {
    _count: SystemDesignProblemCountAggregateOutputType | null
    _min: SystemDesignProblemMinAggregateOutputType | null
    _max: SystemDesignProblemMaxAggregateOutputType | null
  }

  export type SystemDesignProblemMinAggregateOutputType = {
    id: string | null
    slug: string | null
    title: string | null
    difficulty: string | null
    category: string | null
    summary: string | null
    description: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SystemDesignProblemMaxAggregateOutputType = {
    id: string | null
    slug: string | null
    title: string | null
    difficulty: string | null
    category: string | null
    summary: string | null
    description: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SystemDesignProblemCountAggregateOutputType = {
    id: number
    slug: number
    title: number
    difficulty: number
    category: number
    summary: number
    description: number
    functionalRequirements: number
    nonFunctionalRequirements: number
    trafficDefaults: number
    suggestedComponents: number
    starterGraph: number
    referenceArchitecture: number
    rubricTemplate: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type SystemDesignProblemMinAggregateInputType = {
    id?: true
    slug?: true
    title?: true
    difficulty?: true
    category?: true
    summary?: true
    description?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SystemDesignProblemMaxAggregateInputType = {
    id?: true
    slug?: true
    title?: true
    difficulty?: true
    category?: true
    summary?: true
    description?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SystemDesignProblemCountAggregateInputType = {
    id?: true
    slug?: true
    title?: true
    difficulty?: true
    category?: true
    summary?: true
    description?: true
    functionalRequirements?: true
    nonFunctionalRequirements?: true
    trafficDefaults?: true
    suggestedComponents?: true
    starterGraph?: true
    referenceArchitecture?: true
    rubricTemplate?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type SystemDesignProblemAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SystemDesignProblem to aggregate.
     */
    where?: SystemDesignProblemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SystemDesignProblems to fetch.
     */
    orderBy?: SystemDesignProblemOrderByWithRelationInput | SystemDesignProblemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SystemDesignProblemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SystemDesignProblems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SystemDesignProblems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SystemDesignProblems
    **/
    _count?: true | SystemDesignProblemCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SystemDesignProblemMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SystemDesignProblemMaxAggregateInputType
  }

  export type GetSystemDesignProblemAggregateType<T extends SystemDesignProblemAggregateArgs> = {
        [P in keyof T & keyof AggregateSystemDesignProblem]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSystemDesignProblem[P]>
      : GetScalarType<T[P], AggregateSystemDesignProblem[P]>
  }




  export type SystemDesignProblemGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SystemDesignProblemWhereInput
    orderBy?: SystemDesignProblemOrderByWithAggregationInput | SystemDesignProblemOrderByWithAggregationInput[]
    by: SystemDesignProblemScalarFieldEnum[] | SystemDesignProblemScalarFieldEnum
    having?: SystemDesignProblemScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SystemDesignProblemCountAggregateInputType | true
    _min?: SystemDesignProblemMinAggregateInputType
    _max?: SystemDesignProblemMaxAggregateInputType
  }

  export type SystemDesignProblemGroupByOutputType = {
    id: string
    slug: string
    title: string
    difficulty: string
    category: string
    summary: string
    description: string
    functionalRequirements: string[]
    nonFunctionalRequirements: string[]
    trafficDefaults: JsonValue
    suggestedComponents: string[]
    starterGraph: JsonValue
    referenceArchitecture: JsonValue
    rubricTemplate: JsonValue
    createdAt: Date
    updatedAt: Date
    _count: SystemDesignProblemCountAggregateOutputType | null
    _min: SystemDesignProblemMinAggregateOutputType | null
    _max: SystemDesignProblemMaxAggregateOutputType | null
  }

  type GetSystemDesignProblemGroupByPayload<T extends SystemDesignProblemGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SystemDesignProblemGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SystemDesignProblemGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SystemDesignProblemGroupByOutputType[P]>
            : GetScalarType<T[P], SystemDesignProblemGroupByOutputType[P]>
        }
      >
    >


  export type SystemDesignProblemSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    slug?: boolean
    title?: boolean
    difficulty?: boolean
    category?: boolean
    summary?: boolean
    description?: boolean
    functionalRequirements?: boolean
    nonFunctionalRequirements?: boolean
    trafficDefaults?: boolean
    suggestedComponents?: boolean
    starterGraph?: boolean
    referenceArchitecture?: boolean
    rubricTemplate?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    sessions?: boolean | SystemDesignProblem$sessionsArgs<ExtArgs>
    _count?: boolean | SystemDesignProblemCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["systemDesignProblem"]>

  export type SystemDesignProblemSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    slug?: boolean
    title?: boolean
    difficulty?: boolean
    category?: boolean
    summary?: boolean
    description?: boolean
    functionalRequirements?: boolean
    nonFunctionalRequirements?: boolean
    trafficDefaults?: boolean
    suggestedComponents?: boolean
    starterGraph?: boolean
    referenceArchitecture?: boolean
    rubricTemplate?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["systemDesignProblem"]>

  export type SystemDesignProblemSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    slug?: boolean
    title?: boolean
    difficulty?: boolean
    category?: boolean
    summary?: boolean
    description?: boolean
    functionalRequirements?: boolean
    nonFunctionalRequirements?: boolean
    trafficDefaults?: boolean
    suggestedComponents?: boolean
    starterGraph?: boolean
    referenceArchitecture?: boolean
    rubricTemplate?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["systemDesignProblem"]>

  export type SystemDesignProblemSelectScalar = {
    id?: boolean
    slug?: boolean
    title?: boolean
    difficulty?: boolean
    category?: boolean
    summary?: boolean
    description?: boolean
    functionalRequirements?: boolean
    nonFunctionalRequirements?: boolean
    trafficDefaults?: boolean
    suggestedComponents?: boolean
    starterGraph?: boolean
    referenceArchitecture?: boolean
    rubricTemplate?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type SystemDesignProblemOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "slug" | "title" | "difficulty" | "category" | "summary" | "description" | "functionalRequirements" | "nonFunctionalRequirements" | "trafficDefaults" | "suggestedComponents" | "starterGraph" | "referenceArchitecture" | "rubricTemplate" | "createdAt" | "updatedAt", ExtArgs["result"]["systemDesignProblem"]>
  export type SystemDesignProblemInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sessions?: boolean | SystemDesignProblem$sessionsArgs<ExtArgs>
    _count?: boolean | SystemDesignProblemCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type SystemDesignProblemIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type SystemDesignProblemIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $SystemDesignProblemPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SystemDesignProblem"
    objects: {
      sessions: Prisma.$SystemDesignSessionPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      slug: string
      title: string
      difficulty: string
      category: string
      summary: string
      description: string
      functionalRequirements: string[]
      nonFunctionalRequirements: string[]
      trafficDefaults: Prisma.JsonValue
      suggestedComponents: string[]
      starterGraph: Prisma.JsonValue
      referenceArchitecture: Prisma.JsonValue
      rubricTemplate: Prisma.JsonValue
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["systemDesignProblem"]>
    composites: {}
  }

  type SystemDesignProblemGetPayload<S extends boolean | null | undefined | SystemDesignProblemDefaultArgs> = $Result.GetResult<Prisma.$SystemDesignProblemPayload, S>

  type SystemDesignProblemCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SystemDesignProblemFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SystemDesignProblemCountAggregateInputType | true
    }

  export interface SystemDesignProblemDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SystemDesignProblem'], meta: { name: 'SystemDesignProblem' } }
    /**
     * Find zero or one SystemDesignProblem that matches the filter.
     * @param {SystemDesignProblemFindUniqueArgs} args - Arguments to find a SystemDesignProblem
     * @example
     * // Get one SystemDesignProblem
     * const systemDesignProblem = await prisma.systemDesignProblem.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SystemDesignProblemFindUniqueArgs>(args: SelectSubset<T, SystemDesignProblemFindUniqueArgs<ExtArgs>>): Prisma__SystemDesignProblemClient<$Result.GetResult<Prisma.$SystemDesignProblemPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one SystemDesignProblem that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SystemDesignProblemFindUniqueOrThrowArgs} args - Arguments to find a SystemDesignProblem
     * @example
     * // Get one SystemDesignProblem
     * const systemDesignProblem = await prisma.systemDesignProblem.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SystemDesignProblemFindUniqueOrThrowArgs>(args: SelectSubset<T, SystemDesignProblemFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SystemDesignProblemClient<$Result.GetResult<Prisma.$SystemDesignProblemPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SystemDesignProblem that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SystemDesignProblemFindFirstArgs} args - Arguments to find a SystemDesignProblem
     * @example
     * // Get one SystemDesignProblem
     * const systemDesignProblem = await prisma.systemDesignProblem.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SystemDesignProblemFindFirstArgs>(args?: SelectSubset<T, SystemDesignProblemFindFirstArgs<ExtArgs>>): Prisma__SystemDesignProblemClient<$Result.GetResult<Prisma.$SystemDesignProblemPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SystemDesignProblem that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SystemDesignProblemFindFirstOrThrowArgs} args - Arguments to find a SystemDesignProblem
     * @example
     * // Get one SystemDesignProblem
     * const systemDesignProblem = await prisma.systemDesignProblem.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SystemDesignProblemFindFirstOrThrowArgs>(args?: SelectSubset<T, SystemDesignProblemFindFirstOrThrowArgs<ExtArgs>>): Prisma__SystemDesignProblemClient<$Result.GetResult<Prisma.$SystemDesignProblemPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more SystemDesignProblems that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SystemDesignProblemFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SystemDesignProblems
     * const systemDesignProblems = await prisma.systemDesignProblem.findMany()
     * 
     * // Get first 10 SystemDesignProblems
     * const systemDesignProblems = await prisma.systemDesignProblem.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const systemDesignProblemWithIdOnly = await prisma.systemDesignProblem.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SystemDesignProblemFindManyArgs>(args?: SelectSubset<T, SystemDesignProblemFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SystemDesignProblemPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a SystemDesignProblem.
     * @param {SystemDesignProblemCreateArgs} args - Arguments to create a SystemDesignProblem.
     * @example
     * // Create one SystemDesignProblem
     * const SystemDesignProblem = await prisma.systemDesignProblem.create({
     *   data: {
     *     // ... data to create a SystemDesignProblem
     *   }
     * })
     * 
     */
    create<T extends SystemDesignProblemCreateArgs>(args: SelectSubset<T, SystemDesignProblemCreateArgs<ExtArgs>>): Prisma__SystemDesignProblemClient<$Result.GetResult<Prisma.$SystemDesignProblemPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many SystemDesignProblems.
     * @param {SystemDesignProblemCreateManyArgs} args - Arguments to create many SystemDesignProblems.
     * @example
     * // Create many SystemDesignProblems
     * const systemDesignProblem = await prisma.systemDesignProblem.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SystemDesignProblemCreateManyArgs>(args?: SelectSubset<T, SystemDesignProblemCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many SystemDesignProblems and returns the data saved in the database.
     * @param {SystemDesignProblemCreateManyAndReturnArgs} args - Arguments to create many SystemDesignProblems.
     * @example
     * // Create many SystemDesignProblems
     * const systemDesignProblem = await prisma.systemDesignProblem.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many SystemDesignProblems and only return the `id`
     * const systemDesignProblemWithIdOnly = await prisma.systemDesignProblem.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SystemDesignProblemCreateManyAndReturnArgs>(args?: SelectSubset<T, SystemDesignProblemCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SystemDesignProblemPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a SystemDesignProblem.
     * @param {SystemDesignProblemDeleteArgs} args - Arguments to delete one SystemDesignProblem.
     * @example
     * // Delete one SystemDesignProblem
     * const SystemDesignProblem = await prisma.systemDesignProblem.delete({
     *   where: {
     *     // ... filter to delete one SystemDesignProblem
     *   }
     * })
     * 
     */
    delete<T extends SystemDesignProblemDeleteArgs>(args: SelectSubset<T, SystemDesignProblemDeleteArgs<ExtArgs>>): Prisma__SystemDesignProblemClient<$Result.GetResult<Prisma.$SystemDesignProblemPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one SystemDesignProblem.
     * @param {SystemDesignProblemUpdateArgs} args - Arguments to update one SystemDesignProblem.
     * @example
     * // Update one SystemDesignProblem
     * const systemDesignProblem = await prisma.systemDesignProblem.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SystemDesignProblemUpdateArgs>(args: SelectSubset<T, SystemDesignProblemUpdateArgs<ExtArgs>>): Prisma__SystemDesignProblemClient<$Result.GetResult<Prisma.$SystemDesignProblemPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more SystemDesignProblems.
     * @param {SystemDesignProblemDeleteManyArgs} args - Arguments to filter SystemDesignProblems to delete.
     * @example
     * // Delete a few SystemDesignProblems
     * const { count } = await prisma.systemDesignProblem.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SystemDesignProblemDeleteManyArgs>(args?: SelectSubset<T, SystemDesignProblemDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SystemDesignProblems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SystemDesignProblemUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SystemDesignProblems
     * const systemDesignProblem = await prisma.systemDesignProblem.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SystemDesignProblemUpdateManyArgs>(args: SelectSubset<T, SystemDesignProblemUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SystemDesignProblems and returns the data updated in the database.
     * @param {SystemDesignProblemUpdateManyAndReturnArgs} args - Arguments to update many SystemDesignProblems.
     * @example
     * // Update many SystemDesignProblems
     * const systemDesignProblem = await prisma.systemDesignProblem.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more SystemDesignProblems and only return the `id`
     * const systemDesignProblemWithIdOnly = await prisma.systemDesignProblem.updateManyAndReturn({
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
    updateManyAndReturn<T extends SystemDesignProblemUpdateManyAndReturnArgs>(args: SelectSubset<T, SystemDesignProblemUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SystemDesignProblemPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one SystemDesignProblem.
     * @param {SystemDesignProblemUpsertArgs} args - Arguments to update or create a SystemDesignProblem.
     * @example
     * // Update or create a SystemDesignProblem
     * const systemDesignProblem = await prisma.systemDesignProblem.upsert({
     *   create: {
     *     // ... data to create a SystemDesignProblem
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SystemDesignProblem we want to update
     *   }
     * })
     */
    upsert<T extends SystemDesignProblemUpsertArgs>(args: SelectSubset<T, SystemDesignProblemUpsertArgs<ExtArgs>>): Prisma__SystemDesignProblemClient<$Result.GetResult<Prisma.$SystemDesignProblemPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of SystemDesignProblems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SystemDesignProblemCountArgs} args - Arguments to filter SystemDesignProblems to count.
     * @example
     * // Count the number of SystemDesignProblems
     * const count = await prisma.systemDesignProblem.count({
     *   where: {
     *     // ... the filter for the SystemDesignProblems we want to count
     *   }
     * })
    **/
    count<T extends SystemDesignProblemCountArgs>(
      args?: Subset<T, SystemDesignProblemCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SystemDesignProblemCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SystemDesignProblem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SystemDesignProblemAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends SystemDesignProblemAggregateArgs>(args: Subset<T, SystemDesignProblemAggregateArgs>): Prisma.PrismaPromise<GetSystemDesignProblemAggregateType<T>>

    /**
     * Group by SystemDesignProblem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SystemDesignProblemGroupByArgs} args - Group by arguments.
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
      T extends SystemDesignProblemGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SystemDesignProblemGroupByArgs['orderBy'] }
        : { orderBy?: SystemDesignProblemGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, SystemDesignProblemGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSystemDesignProblemGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SystemDesignProblem model
   */
  readonly fields: SystemDesignProblemFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SystemDesignProblem.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SystemDesignProblemClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    sessions<T extends SystemDesignProblem$sessionsArgs<ExtArgs> = {}>(args?: Subset<T, SystemDesignProblem$sessionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SystemDesignSessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the SystemDesignProblem model
   */
  interface SystemDesignProblemFieldRefs {
    readonly id: FieldRef<"SystemDesignProblem", 'String'>
    readonly slug: FieldRef<"SystemDesignProblem", 'String'>
    readonly title: FieldRef<"SystemDesignProblem", 'String'>
    readonly difficulty: FieldRef<"SystemDesignProblem", 'String'>
    readonly category: FieldRef<"SystemDesignProblem", 'String'>
    readonly summary: FieldRef<"SystemDesignProblem", 'String'>
    readonly description: FieldRef<"SystemDesignProblem", 'String'>
    readonly functionalRequirements: FieldRef<"SystemDesignProblem", 'String[]'>
    readonly nonFunctionalRequirements: FieldRef<"SystemDesignProblem", 'String[]'>
    readonly trafficDefaults: FieldRef<"SystemDesignProblem", 'Json'>
    readonly suggestedComponents: FieldRef<"SystemDesignProblem", 'String[]'>
    readonly starterGraph: FieldRef<"SystemDesignProblem", 'Json'>
    readonly referenceArchitecture: FieldRef<"SystemDesignProblem", 'Json'>
    readonly rubricTemplate: FieldRef<"SystemDesignProblem", 'Json'>
    readonly createdAt: FieldRef<"SystemDesignProblem", 'DateTime'>
    readonly updatedAt: FieldRef<"SystemDesignProblem", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * SystemDesignProblem findUnique
   */
  export type SystemDesignProblemFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemDesignProblem
     */
    select?: SystemDesignProblemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SystemDesignProblem
     */
    omit?: SystemDesignProblemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SystemDesignProblemInclude<ExtArgs> | null
    /**
     * Filter, which SystemDesignProblem to fetch.
     */
    where: SystemDesignProblemWhereUniqueInput
  }

  /**
   * SystemDesignProblem findUniqueOrThrow
   */
  export type SystemDesignProblemFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemDesignProblem
     */
    select?: SystemDesignProblemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SystemDesignProblem
     */
    omit?: SystemDesignProblemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SystemDesignProblemInclude<ExtArgs> | null
    /**
     * Filter, which SystemDesignProblem to fetch.
     */
    where: SystemDesignProblemWhereUniqueInput
  }

  /**
   * SystemDesignProblem findFirst
   */
  export type SystemDesignProblemFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemDesignProblem
     */
    select?: SystemDesignProblemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SystemDesignProblem
     */
    omit?: SystemDesignProblemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SystemDesignProblemInclude<ExtArgs> | null
    /**
     * Filter, which SystemDesignProblem to fetch.
     */
    where?: SystemDesignProblemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SystemDesignProblems to fetch.
     */
    orderBy?: SystemDesignProblemOrderByWithRelationInput | SystemDesignProblemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SystemDesignProblems.
     */
    cursor?: SystemDesignProblemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SystemDesignProblems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SystemDesignProblems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SystemDesignProblems.
     */
    distinct?: SystemDesignProblemScalarFieldEnum | SystemDesignProblemScalarFieldEnum[]
  }

  /**
   * SystemDesignProblem findFirstOrThrow
   */
  export type SystemDesignProblemFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemDesignProblem
     */
    select?: SystemDesignProblemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SystemDesignProblem
     */
    omit?: SystemDesignProblemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SystemDesignProblemInclude<ExtArgs> | null
    /**
     * Filter, which SystemDesignProblem to fetch.
     */
    where?: SystemDesignProblemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SystemDesignProblems to fetch.
     */
    orderBy?: SystemDesignProblemOrderByWithRelationInput | SystemDesignProblemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SystemDesignProblems.
     */
    cursor?: SystemDesignProblemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SystemDesignProblems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SystemDesignProblems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SystemDesignProblems.
     */
    distinct?: SystemDesignProblemScalarFieldEnum | SystemDesignProblemScalarFieldEnum[]
  }

  /**
   * SystemDesignProblem findMany
   */
  export type SystemDesignProblemFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemDesignProblem
     */
    select?: SystemDesignProblemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SystemDesignProblem
     */
    omit?: SystemDesignProblemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SystemDesignProblemInclude<ExtArgs> | null
    /**
     * Filter, which SystemDesignProblems to fetch.
     */
    where?: SystemDesignProblemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SystemDesignProblems to fetch.
     */
    orderBy?: SystemDesignProblemOrderByWithRelationInput | SystemDesignProblemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SystemDesignProblems.
     */
    cursor?: SystemDesignProblemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SystemDesignProblems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SystemDesignProblems.
     */
    skip?: number
    distinct?: SystemDesignProblemScalarFieldEnum | SystemDesignProblemScalarFieldEnum[]
  }

  /**
   * SystemDesignProblem create
   */
  export type SystemDesignProblemCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemDesignProblem
     */
    select?: SystemDesignProblemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SystemDesignProblem
     */
    omit?: SystemDesignProblemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SystemDesignProblemInclude<ExtArgs> | null
    /**
     * The data needed to create a SystemDesignProblem.
     */
    data: XOR<SystemDesignProblemCreateInput, SystemDesignProblemUncheckedCreateInput>
  }

  /**
   * SystemDesignProblem createMany
   */
  export type SystemDesignProblemCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SystemDesignProblems.
     */
    data: SystemDesignProblemCreateManyInput | SystemDesignProblemCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SystemDesignProblem createManyAndReturn
   */
  export type SystemDesignProblemCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemDesignProblem
     */
    select?: SystemDesignProblemSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SystemDesignProblem
     */
    omit?: SystemDesignProblemOmit<ExtArgs> | null
    /**
     * The data used to create many SystemDesignProblems.
     */
    data: SystemDesignProblemCreateManyInput | SystemDesignProblemCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SystemDesignProblem update
   */
  export type SystemDesignProblemUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemDesignProblem
     */
    select?: SystemDesignProblemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SystemDesignProblem
     */
    omit?: SystemDesignProblemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SystemDesignProblemInclude<ExtArgs> | null
    /**
     * The data needed to update a SystemDesignProblem.
     */
    data: XOR<SystemDesignProblemUpdateInput, SystemDesignProblemUncheckedUpdateInput>
    /**
     * Choose, which SystemDesignProblem to update.
     */
    where: SystemDesignProblemWhereUniqueInput
  }

  /**
   * SystemDesignProblem updateMany
   */
  export type SystemDesignProblemUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SystemDesignProblems.
     */
    data: XOR<SystemDesignProblemUpdateManyMutationInput, SystemDesignProblemUncheckedUpdateManyInput>
    /**
     * Filter which SystemDesignProblems to update
     */
    where?: SystemDesignProblemWhereInput
    /**
     * Limit how many SystemDesignProblems to update.
     */
    limit?: number
  }

  /**
   * SystemDesignProblem updateManyAndReturn
   */
  export type SystemDesignProblemUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemDesignProblem
     */
    select?: SystemDesignProblemSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SystemDesignProblem
     */
    omit?: SystemDesignProblemOmit<ExtArgs> | null
    /**
     * The data used to update SystemDesignProblems.
     */
    data: XOR<SystemDesignProblemUpdateManyMutationInput, SystemDesignProblemUncheckedUpdateManyInput>
    /**
     * Filter which SystemDesignProblems to update
     */
    where?: SystemDesignProblemWhereInput
    /**
     * Limit how many SystemDesignProblems to update.
     */
    limit?: number
  }

  /**
   * SystemDesignProblem upsert
   */
  export type SystemDesignProblemUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemDesignProblem
     */
    select?: SystemDesignProblemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SystemDesignProblem
     */
    omit?: SystemDesignProblemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SystemDesignProblemInclude<ExtArgs> | null
    /**
     * The filter to search for the SystemDesignProblem to update in case it exists.
     */
    where: SystemDesignProblemWhereUniqueInput
    /**
     * In case the SystemDesignProblem found by the `where` argument doesn't exist, create a new SystemDesignProblem with this data.
     */
    create: XOR<SystemDesignProblemCreateInput, SystemDesignProblemUncheckedCreateInput>
    /**
     * In case the SystemDesignProblem was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SystemDesignProblemUpdateInput, SystemDesignProblemUncheckedUpdateInput>
  }

  /**
   * SystemDesignProblem delete
   */
  export type SystemDesignProblemDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemDesignProblem
     */
    select?: SystemDesignProblemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SystemDesignProblem
     */
    omit?: SystemDesignProblemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SystemDesignProblemInclude<ExtArgs> | null
    /**
     * Filter which SystemDesignProblem to delete.
     */
    where: SystemDesignProblemWhereUniqueInput
  }

  /**
   * SystemDesignProblem deleteMany
   */
  export type SystemDesignProblemDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SystemDesignProblems to delete
     */
    where?: SystemDesignProblemWhereInput
    /**
     * Limit how many SystemDesignProblems to delete.
     */
    limit?: number
  }

  /**
   * SystemDesignProblem.sessions
   */
  export type SystemDesignProblem$sessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemDesignSession
     */
    select?: SystemDesignSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SystemDesignSession
     */
    omit?: SystemDesignSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SystemDesignSessionInclude<ExtArgs> | null
    where?: SystemDesignSessionWhereInput
    orderBy?: SystemDesignSessionOrderByWithRelationInput | SystemDesignSessionOrderByWithRelationInput[]
    cursor?: SystemDesignSessionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SystemDesignSessionScalarFieldEnum | SystemDesignSessionScalarFieldEnum[]
  }

  /**
   * SystemDesignProblem without action
   */
  export type SystemDesignProblemDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemDesignProblem
     */
    select?: SystemDesignProblemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SystemDesignProblem
     */
    omit?: SystemDesignProblemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SystemDesignProblemInclude<ExtArgs> | null
  }


  /**
   * Model SystemDesignSession
   */

  export type AggregateSystemDesignSession = {
    _count: SystemDesignSessionCountAggregateOutputType | null
    _avg: SystemDesignSessionAvgAggregateOutputType | null
    _sum: SystemDesignSessionSumAggregateOutputType | null
    _min: SystemDesignSessionMinAggregateOutputType | null
    _max: SystemDesignSessionMaxAggregateOutputType | null
  }

  export type SystemDesignSessionAvgAggregateOutputType = {
    stage: number | null
    durationSeconds: number | null
    score: number | null
  }

  export type SystemDesignSessionSumAggregateOutputType = {
    stage: number | null
    durationSeconds: number | null
    score: number | null
  }

  export type SystemDesignSessionMinAggregateOutputType = {
    id: string | null
    userId: string | null
    userName: string | null
    problemId: string | null
    title: string | null
    stage: number | null
    status: string | null
    durationSeconds: number | null
    score: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SystemDesignSessionMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    userName: string | null
    problemId: string | null
    title: string | null
    stage: number | null
    status: string | null
    durationSeconds: number | null
    score: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SystemDesignSessionCountAggregateOutputType = {
    id: number
    userId: number
    userName: number
    problemId: number
    title: number
    stage: number
    status: number
    durationSeconds: number
    graphData: number
    capacityInputs: number
    capacityOutputs: number
    validationState: number
    transcript: number
    score: number
    evaluation: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type SystemDesignSessionAvgAggregateInputType = {
    stage?: true
    durationSeconds?: true
    score?: true
  }

  export type SystemDesignSessionSumAggregateInputType = {
    stage?: true
    durationSeconds?: true
    score?: true
  }

  export type SystemDesignSessionMinAggregateInputType = {
    id?: true
    userId?: true
    userName?: true
    problemId?: true
    title?: true
    stage?: true
    status?: true
    durationSeconds?: true
    score?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SystemDesignSessionMaxAggregateInputType = {
    id?: true
    userId?: true
    userName?: true
    problemId?: true
    title?: true
    stage?: true
    status?: true
    durationSeconds?: true
    score?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SystemDesignSessionCountAggregateInputType = {
    id?: true
    userId?: true
    userName?: true
    problemId?: true
    title?: true
    stage?: true
    status?: true
    durationSeconds?: true
    graphData?: true
    capacityInputs?: true
    capacityOutputs?: true
    validationState?: true
    transcript?: true
    score?: true
    evaluation?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type SystemDesignSessionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SystemDesignSession to aggregate.
     */
    where?: SystemDesignSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SystemDesignSessions to fetch.
     */
    orderBy?: SystemDesignSessionOrderByWithRelationInput | SystemDesignSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SystemDesignSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SystemDesignSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SystemDesignSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SystemDesignSessions
    **/
    _count?: true | SystemDesignSessionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SystemDesignSessionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SystemDesignSessionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SystemDesignSessionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SystemDesignSessionMaxAggregateInputType
  }

  export type GetSystemDesignSessionAggregateType<T extends SystemDesignSessionAggregateArgs> = {
        [P in keyof T & keyof AggregateSystemDesignSession]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSystemDesignSession[P]>
      : GetScalarType<T[P], AggregateSystemDesignSession[P]>
  }




  export type SystemDesignSessionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SystemDesignSessionWhereInput
    orderBy?: SystemDesignSessionOrderByWithAggregationInput | SystemDesignSessionOrderByWithAggregationInput[]
    by: SystemDesignSessionScalarFieldEnum[] | SystemDesignSessionScalarFieldEnum
    having?: SystemDesignSessionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SystemDesignSessionCountAggregateInputType | true
    _avg?: SystemDesignSessionAvgAggregateInputType
    _sum?: SystemDesignSessionSumAggregateInputType
    _min?: SystemDesignSessionMinAggregateInputType
    _max?: SystemDesignSessionMaxAggregateInputType
  }

  export type SystemDesignSessionGroupByOutputType = {
    id: string
    userId: string
    userName: string | null
    problemId: string
    title: string
    stage: number
    status: string
    durationSeconds: number
    graphData: JsonValue
    capacityInputs: JsonValue
    capacityOutputs: JsonValue
    validationState: JsonValue
    transcript: JsonValue
    score: number | null
    evaluation: JsonValue | null
    createdAt: Date
    updatedAt: Date
    _count: SystemDesignSessionCountAggregateOutputType | null
    _avg: SystemDesignSessionAvgAggregateOutputType | null
    _sum: SystemDesignSessionSumAggregateOutputType | null
    _min: SystemDesignSessionMinAggregateOutputType | null
    _max: SystemDesignSessionMaxAggregateOutputType | null
  }

  type GetSystemDesignSessionGroupByPayload<T extends SystemDesignSessionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SystemDesignSessionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SystemDesignSessionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SystemDesignSessionGroupByOutputType[P]>
            : GetScalarType<T[P], SystemDesignSessionGroupByOutputType[P]>
        }
      >
    >


  export type SystemDesignSessionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    userName?: boolean
    problemId?: boolean
    title?: boolean
    stage?: boolean
    status?: boolean
    durationSeconds?: boolean
    graphData?: boolean
    capacityInputs?: boolean
    capacityOutputs?: boolean
    validationState?: boolean
    transcript?: boolean
    score?: boolean
    evaluation?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    problem?: boolean | SystemDesignProblemDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["systemDesignSession"]>

  export type SystemDesignSessionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    userName?: boolean
    problemId?: boolean
    title?: boolean
    stage?: boolean
    status?: boolean
    durationSeconds?: boolean
    graphData?: boolean
    capacityInputs?: boolean
    capacityOutputs?: boolean
    validationState?: boolean
    transcript?: boolean
    score?: boolean
    evaluation?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    problem?: boolean | SystemDesignProblemDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["systemDesignSession"]>

  export type SystemDesignSessionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    userName?: boolean
    problemId?: boolean
    title?: boolean
    stage?: boolean
    status?: boolean
    durationSeconds?: boolean
    graphData?: boolean
    capacityInputs?: boolean
    capacityOutputs?: boolean
    validationState?: boolean
    transcript?: boolean
    score?: boolean
    evaluation?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    problem?: boolean | SystemDesignProblemDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["systemDesignSession"]>

  export type SystemDesignSessionSelectScalar = {
    id?: boolean
    userId?: boolean
    userName?: boolean
    problemId?: boolean
    title?: boolean
    stage?: boolean
    status?: boolean
    durationSeconds?: boolean
    graphData?: boolean
    capacityInputs?: boolean
    capacityOutputs?: boolean
    validationState?: boolean
    transcript?: boolean
    score?: boolean
    evaluation?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type SystemDesignSessionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "userName" | "problemId" | "title" | "stage" | "status" | "durationSeconds" | "graphData" | "capacityInputs" | "capacityOutputs" | "validationState" | "transcript" | "score" | "evaluation" | "createdAt" | "updatedAt", ExtArgs["result"]["systemDesignSession"]>
  export type SystemDesignSessionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    problem?: boolean | SystemDesignProblemDefaultArgs<ExtArgs>
  }
  export type SystemDesignSessionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    problem?: boolean | SystemDesignProblemDefaultArgs<ExtArgs>
  }
  export type SystemDesignSessionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    problem?: boolean | SystemDesignProblemDefaultArgs<ExtArgs>
  }

  export type $SystemDesignSessionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SystemDesignSession"
    objects: {
      problem: Prisma.$SystemDesignProblemPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      userName: string | null
      problemId: string
      title: string
      stage: number
      status: string
      durationSeconds: number
      graphData: Prisma.JsonValue
      capacityInputs: Prisma.JsonValue
      capacityOutputs: Prisma.JsonValue
      validationState: Prisma.JsonValue
      transcript: Prisma.JsonValue
      score: number | null
      evaluation: Prisma.JsonValue | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["systemDesignSession"]>
    composites: {}
  }

  type SystemDesignSessionGetPayload<S extends boolean | null | undefined | SystemDesignSessionDefaultArgs> = $Result.GetResult<Prisma.$SystemDesignSessionPayload, S>

  type SystemDesignSessionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SystemDesignSessionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SystemDesignSessionCountAggregateInputType | true
    }

  export interface SystemDesignSessionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SystemDesignSession'], meta: { name: 'SystemDesignSession' } }
    /**
     * Find zero or one SystemDesignSession that matches the filter.
     * @param {SystemDesignSessionFindUniqueArgs} args - Arguments to find a SystemDesignSession
     * @example
     * // Get one SystemDesignSession
     * const systemDesignSession = await prisma.systemDesignSession.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SystemDesignSessionFindUniqueArgs>(args: SelectSubset<T, SystemDesignSessionFindUniqueArgs<ExtArgs>>): Prisma__SystemDesignSessionClient<$Result.GetResult<Prisma.$SystemDesignSessionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one SystemDesignSession that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SystemDesignSessionFindUniqueOrThrowArgs} args - Arguments to find a SystemDesignSession
     * @example
     * // Get one SystemDesignSession
     * const systemDesignSession = await prisma.systemDesignSession.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SystemDesignSessionFindUniqueOrThrowArgs>(args: SelectSubset<T, SystemDesignSessionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SystemDesignSessionClient<$Result.GetResult<Prisma.$SystemDesignSessionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SystemDesignSession that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SystemDesignSessionFindFirstArgs} args - Arguments to find a SystemDesignSession
     * @example
     * // Get one SystemDesignSession
     * const systemDesignSession = await prisma.systemDesignSession.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SystemDesignSessionFindFirstArgs>(args?: SelectSubset<T, SystemDesignSessionFindFirstArgs<ExtArgs>>): Prisma__SystemDesignSessionClient<$Result.GetResult<Prisma.$SystemDesignSessionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SystemDesignSession that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SystemDesignSessionFindFirstOrThrowArgs} args - Arguments to find a SystemDesignSession
     * @example
     * // Get one SystemDesignSession
     * const systemDesignSession = await prisma.systemDesignSession.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SystemDesignSessionFindFirstOrThrowArgs>(args?: SelectSubset<T, SystemDesignSessionFindFirstOrThrowArgs<ExtArgs>>): Prisma__SystemDesignSessionClient<$Result.GetResult<Prisma.$SystemDesignSessionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more SystemDesignSessions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SystemDesignSessionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SystemDesignSessions
     * const systemDesignSessions = await prisma.systemDesignSession.findMany()
     * 
     * // Get first 10 SystemDesignSessions
     * const systemDesignSessions = await prisma.systemDesignSession.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const systemDesignSessionWithIdOnly = await prisma.systemDesignSession.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SystemDesignSessionFindManyArgs>(args?: SelectSubset<T, SystemDesignSessionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SystemDesignSessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a SystemDesignSession.
     * @param {SystemDesignSessionCreateArgs} args - Arguments to create a SystemDesignSession.
     * @example
     * // Create one SystemDesignSession
     * const SystemDesignSession = await prisma.systemDesignSession.create({
     *   data: {
     *     // ... data to create a SystemDesignSession
     *   }
     * })
     * 
     */
    create<T extends SystemDesignSessionCreateArgs>(args: SelectSubset<T, SystemDesignSessionCreateArgs<ExtArgs>>): Prisma__SystemDesignSessionClient<$Result.GetResult<Prisma.$SystemDesignSessionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many SystemDesignSessions.
     * @param {SystemDesignSessionCreateManyArgs} args - Arguments to create many SystemDesignSessions.
     * @example
     * // Create many SystemDesignSessions
     * const systemDesignSession = await prisma.systemDesignSession.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SystemDesignSessionCreateManyArgs>(args?: SelectSubset<T, SystemDesignSessionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many SystemDesignSessions and returns the data saved in the database.
     * @param {SystemDesignSessionCreateManyAndReturnArgs} args - Arguments to create many SystemDesignSessions.
     * @example
     * // Create many SystemDesignSessions
     * const systemDesignSession = await prisma.systemDesignSession.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many SystemDesignSessions and only return the `id`
     * const systemDesignSessionWithIdOnly = await prisma.systemDesignSession.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SystemDesignSessionCreateManyAndReturnArgs>(args?: SelectSubset<T, SystemDesignSessionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SystemDesignSessionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a SystemDesignSession.
     * @param {SystemDesignSessionDeleteArgs} args - Arguments to delete one SystemDesignSession.
     * @example
     * // Delete one SystemDesignSession
     * const SystemDesignSession = await prisma.systemDesignSession.delete({
     *   where: {
     *     // ... filter to delete one SystemDesignSession
     *   }
     * })
     * 
     */
    delete<T extends SystemDesignSessionDeleteArgs>(args: SelectSubset<T, SystemDesignSessionDeleteArgs<ExtArgs>>): Prisma__SystemDesignSessionClient<$Result.GetResult<Prisma.$SystemDesignSessionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one SystemDesignSession.
     * @param {SystemDesignSessionUpdateArgs} args - Arguments to update one SystemDesignSession.
     * @example
     * // Update one SystemDesignSession
     * const systemDesignSession = await prisma.systemDesignSession.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SystemDesignSessionUpdateArgs>(args: SelectSubset<T, SystemDesignSessionUpdateArgs<ExtArgs>>): Prisma__SystemDesignSessionClient<$Result.GetResult<Prisma.$SystemDesignSessionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more SystemDesignSessions.
     * @param {SystemDesignSessionDeleteManyArgs} args - Arguments to filter SystemDesignSessions to delete.
     * @example
     * // Delete a few SystemDesignSessions
     * const { count } = await prisma.systemDesignSession.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SystemDesignSessionDeleteManyArgs>(args?: SelectSubset<T, SystemDesignSessionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SystemDesignSessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SystemDesignSessionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SystemDesignSessions
     * const systemDesignSession = await prisma.systemDesignSession.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SystemDesignSessionUpdateManyArgs>(args: SelectSubset<T, SystemDesignSessionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SystemDesignSessions and returns the data updated in the database.
     * @param {SystemDesignSessionUpdateManyAndReturnArgs} args - Arguments to update many SystemDesignSessions.
     * @example
     * // Update many SystemDesignSessions
     * const systemDesignSession = await prisma.systemDesignSession.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more SystemDesignSessions and only return the `id`
     * const systemDesignSessionWithIdOnly = await prisma.systemDesignSession.updateManyAndReturn({
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
    updateManyAndReturn<T extends SystemDesignSessionUpdateManyAndReturnArgs>(args: SelectSubset<T, SystemDesignSessionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SystemDesignSessionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one SystemDesignSession.
     * @param {SystemDesignSessionUpsertArgs} args - Arguments to update or create a SystemDesignSession.
     * @example
     * // Update or create a SystemDesignSession
     * const systemDesignSession = await prisma.systemDesignSession.upsert({
     *   create: {
     *     // ... data to create a SystemDesignSession
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SystemDesignSession we want to update
     *   }
     * })
     */
    upsert<T extends SystemDesignSessionUpsertArgs>(args: SelectSubset<T, SystemDesignSessionUpsertArgs<ExtArgs>>): Prisma__SystemDesignSessionClient<$Result.GetResult<Prisma.$SystemDesignSessionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of SystemDesignSessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SystemDesignSessionCountArgs} args - Arguments to filter SystemDesignSessions to count.
     * @example
     * // Count the number of SystemDesignSessions
     * const count = await prisma.systemDesignSession.count({
     *   where: {
     *     // ... the filter for the SystemDesignSessions we want to count
     *   }
     * })
    **/
    count<T extends SystemDesignSessionCountArgs>(
      args?: Subset<T, SystemDesignSessionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SystemDesignSessionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SystemDesignSession.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SystemDesignSessionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends SystemDesignSessionAggregateArgs>(args: Subset<T, SystemDesignSessionAggregateArgs>): Prisma.PrismaPromise<GetSystemDesignSessionAggregateType<T>>

    /**
     * Group by SystemDesignSession.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SystemDesignSessionGroupByArgs} args - Group by arguments.
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
      T extends SystemDesignSessionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SystemDesignSessionGroupByArgs['orderBy'] }
        : { orderBy?: SystemDesignSessionGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, SystemDesignSessionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSystemDesignSessionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SystemDesignSession model
   */
  readonly fields: SystemDesignSessionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SystemDesignSession.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SystemDesignSessionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    problem<T extends SystemDesignProblemDefaultArgs<ExtArgs> = {}>(args?: Subset<T, SystemDesignProblemDefaultArgs<ExtArgs>>): Prisma__SystemDesignProblemClient<$Result.GetResult<Prisma.$SystemDesignProblemPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the SystemDesignSession model
   */
  interface SystemDesignSessionFieldRefs {
    readonly id: FieldRef<"SystemDesignSession", 'String'>
    readonly userId: FieldRef<"SystemDesignSession", 'String'>
    readonly userName: FieldRef<"SystemDesignSession", 'String'>
    readonly problemId: FieldRef<"SystemDesignSession", 'String'>
    readonly title: FieldRef<"SystemDesignSession", 'String'>
    readonly stage: FieldRef<"SystemDesignSession", 'Int'>
    readonly status: FieldRef<"SystemDesignSession", 'String'>
    readonly durationSeconds: FieldRef<"SystemDesignSession", 'Int'>
    readonly graphData: FieldRef<"SystemDesignSession", 'Json'>
    readonly capacityInputs: FieldRef<"SystemDesignSession", 'Json'>
    readonly capacityOutputs: FieldRef<"SystemDesignSession", 'Json'>
    readonly validationState: FieldRef<"SystemDesignSession", 'Json'>
    readonly transcript: FieldRef<"SystemDesignSession", 'Json'>
    readonly score: FieldRef<"SystemDesignSession", 'Int'>
    readonly evaluation: FieldRef<"SystemDesignSession", 'Json'>
    readonly createdAt: FieldRef<"SystemDesignSession", 'DateTime'>
    readonly updatedAt: FieldRef<"SystemDesignSession", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * SystemDesignSession findUnique
   */
  export type SystemDesignSessionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemDesignSession
     */
    select?: SystemDesignSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SystemDesignSession
     */
    omit?: SystemDesignSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SystemDesignSessionInclude<ExtArgs> | null
    /**
     * Filter, which SystemDesignSession to fetch.
     */
    where: SystemDesignSessionWhereUniqueInput
  }

  /**
   * SystemDesignSession findUniqueOrThrow
   */
  export type SystemDesignSessionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemDesignSession
     */
    select?: SystemDesignSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SystemDesignSession
     */
    omit?: SystemDesignSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SystemDesignSessionInclude<ExtArgs> | null
    /**
     * Filter, which SystemDesignSession to fetch.
     */
    where: SystemDesignSessionWhereUniqueInput
  }

  /**
   * SystemDesignSession findFirst
   */
  export type SystemDesignSessionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemDesignSession
     */
    select?: SystemDesignSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SystemDesignSession
     */
    omit?: SystemDesignSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SystemDesignSessionInclude<ExtArgs> | null
    /**
     * Filter, which SystemDesignSession to fetch.
     */
    where?: SystemDesignSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SystemDesignSessions to fetch.
     */
    orderBy?: SystemDesignSessionOrderByWithRelationInput | SystemDesignSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SystemDesignSessions.
     */
    cursor?: SystemDesignSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SystemDesignSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SystemDesignSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SystemDesignSessions.
     */
    distinct?: SystemDesignSessionScalarFieldEnum | SystemDesignSessionScalarFieldEnum[]
  }

  /**
   * SystemDesignSession findFirstOrThrow
   */
  export type SystemDesignSessionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemDesignSession
     */
    select?: SystemDesignSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SystemDesignSession
     */
    omit?: SystemDesignSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SystemDesignSessionInclude<ExtArgs> | null
    /**
     * Filter, which SystemDesignSession to fetch.
     */
    where?: SystemDesignSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SystemDesignSessions to fetch.
     */
    orderBy?: SystemDesignSessionOrderByWithRelationInput | SystemDesignSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SystemDesignSessions.
     */
    cursor?: SystemDesignSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SystemDesignSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SystemDesignSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SystemDesignSessions.
     */
    distinct?: SystemDesignSessionScalarFieldEnum | SystemDesignSessionScalarFieldEnum[]
  }

  /**
   * SystemDesignSession findMany
   */
  export type SystemDesignSessionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemDesignSession
     */
    select?: SystemDesignSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SystemDesignSession
     */
    omit?: SystemDesignSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SystemDesignSessionInclude<ExtArgs> | null
    /**
     * Filter, which SystemDesignSessions to fetch.
     */
    where?: SystemDesignSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SystemDesignSessions to fetch.
     */
    orderBy?: SystemDesignSessionOrderByWithRelationInput | SystemDesignSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SystemDesignSessions.
     */
    cursor?: SystemDesignSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SystemDesignSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SystemDesignSessions.
     */
    skip?: number
    distinct?: SystemDesignSessionScalarFieldEnum | SystemDesignSessionScalarFieldEnum[]
  }

  /**
   * SystemDesignSession create
   */
  export type SystemDesignSessionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemDesignSession
     */
    select?: SystemDesignSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SystemDesignSession
     */
    omit?: SystemDesignSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SystemDesignSessionInclude<ExtArgs> | null
    /**
     * The data needed to create a SystemDesignSession.
     */
    data: XOR<SystemDesignSessionCreateInput, SystemDesignSessionUncheckedCreateInput>
  }

  /**
   * SystemDesignSession createMany
   */
  export type SystemDesignSessionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SystemDesignSessions.
     */
    data: SystemDesignSessionCreateManyInput | SystemDesignSessionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SystemDesignSession createManyAndReturn
   */
  export type SystemDesignSessionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemDesignSession
     */
    select?: SystemDesignSessionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SystemDesignSession
     */
    omit?: SystemDesignSessionOmit<ExtArgs> | null
    /**
     * The data used to create many SystemDesignSessions.
     */
    data: SystemDesignSessionCreateManyInput | SystemDesignSessionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SystemDesignSessionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * SystemDesignSession update
   */
  export type SystemDesignSessionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemDesignSession
     */
    select?: SystemDesignSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SystemDesignSession
     */
    omit?: SystemDesignSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SystemDesignSessionInclude<ExtArgs> | null
    /**
     * The data needed to update a SystemDesignSession.
     */
    data: XOR<SystemDesignSessionUpdateInput, SystemDesignSessionUncheckedUpdateInput>
    /**
     * Choose, which SystemDesignSession to update.
     */
    where: SystemDesignSessionWhereUniqueInput
  }

  /**
   * SystemDesignSession updateMany
   */
  export type SystemDesignSessionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SystemDesignSessions.
     */
    data: XOR<SystemDesignSessionUpdateManyMutationInput, SystemDesignSessionUncheckedUpdateManyInput>
    /**
     * Filter which SystemDesignSessions to update
     */
    where?: SystemDesignSessionWhereInput
    /**
     * Limit how many SystemDesignSessions to update.
     */
    limit?: number
  }

  /**
   * SystemDesignSession updateManyAndReturn
   */
  export type SystemDesignSessionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemDesignSession
     */
    select?: SystemDesignSessionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SystemDesignSession
     */
    omit?: SystemDesignSessionOmit<ExtArgs> | null
    /**
     * The data used to update SystemDesignSessions.
     */
    data: XOR<SystemDesignSessionUpdateManyMutationInput, SystemDesignSessionUncheckedUpdateManyInput>
    /**
     * Filter which SystemDesignSessions to update
     */
    where?: SystemDesignSessionWhereInput
    /**
     * Limit how many SystemDesignSessions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SystemDesignSessionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * SystemDesignSession upsert
   */
  export type SystemDesignSessionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemDesignSession
     */
    select?: SystemDesignSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SystemDesignSession
     */
    omit?: SystemDesignSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SystemDesignSessionInclude<ExtArgs> | null
    /**
     * The filter to search for the SystemDesignSession to update in case it exists.
     */
    where: SystemDesignSessionWhereUniqueInput
    /**
     * In case the SystemDesignSession found by the `where` argument doesn't exist, create a new SystemDesignSession with this data.
     */
    create: XOR<SystemDesignSessionCreateInput, SystemDesignSessionUncheckedCreateInput>
    /**
     * In case the SystemDesignSession was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SystemDesignSessionUpdateInput, SystemDesignSessionUncheckedUpdateInput>
  }

  /**
   * SystemDesignSession delete
   */
  export type SystemDesignSessionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemDesignSession
     */
    select?: SystemDesignSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SystemDesignSession
     */
    omit?: SystemDesignSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SystemDesignSessionInclude<ExtArgs> | null
    /**
     * Filter which SystemDesignSession to delete.
     */
    where: SystemDesignSessionWhereUniqueInput
  }

  /**
   * SystemDesignSession deleteMany
   */
  export type SystemDesignSessionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SystemDesignSessions to delete
     */
    where?: SystemDesignSessionWhereInput
    /**
     * Limit how many SystemDesignSessions to delete.
     */
    limit?: number
  }

  /**
   * SystemDesignSession without action
   */
  export type SystemDesignSessionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemDesignSession
     */
    select?: SystemDesignSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SystemDesignSession
     */
    omit?: SystemDesignSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SystemDesignSessionInclude<ExtArgs> | null
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


  export const SystemDesignProblemScalarFieldEnum: {
    id: 'id',
    slug: 'slug',
    title: 'title',
    difficulty: 'difficulty',
    category: 'category',
    summary: 'summary',
    description: 'description',
    functionalRequirements: 'functionalRequirements',
    nonFunctionalRequirements: 'nonFunctionalRequirements',
    trafficDefaults: 'trafficDefaults',
    suggestedComponents: 'suggestedComponents',
    starterGraph: 'starterGraph',
    referenceArchitecture: 'referenceArchitecture',
    rubricTemplate: 'rubricTemplate',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type SystemDesignProblemScalarFieldEnum = (typeof SystemDesignProblemScalarFieldEnum)[keyof typeof SystemDesignProblemScalarFieldEnum]


  export const SystemDesignSessionScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    userName: 'userName',
    problemId: 'problemId',
    title: 'title',
    stage: 'stage',
    status: 'status',
    durationSeconds: 'durationSeconds',
    graphData: 'graphData',
    capacityInputs: 'capacityInputs',
    capacityOutputs: 'capacityOutputs',
    validationState: 'validationState',
    transcript: 'transcript',
    score: 'score',
    evaluation: 'evaluation',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type SystemDesignSessionScalarFieldEnum = (typeof SystemDesignSessionScalarFieldEnum)[keyof typeof SystemDesignSessionScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull
  };

  export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


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
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


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


  export type SystemDesignProblemWhereInput = {
    AND?: SystemDesignProblemWhereInput | SystemDesignProblemWhereInput[]
    OR?: SystemDesignProblemWhereInput[]
    NOT?: SystemDesignProblemWhereInput | SystemDesignProblemWhereInput[]
    id?: StringFilter<"SystemDesignProblem"> | string
    slug?: StringFilter<"SystemDesignProblem"> | string
    title?: StringFilter<"SystemDesignProblem"> | string
    difficulty?: StringFilter<"SystemDesignProblem"> | string
    category?: StringFilter<"SystemDesignProblem"> | string
    summary?: StringFilter<"SystemDesignProblem"> | string
    description?: StringFilter<"SystemDesignProblem"> | string
    functionalRequirements?: StringNullableListFilter<"SystemDesignProblem">
    nonFunctionalRequirements?: StringNullableListFilter<"SystemDesignProblem">
    trafficDefaults?: JsonFilter<"SystemDesignProblem">
    suggestedComponents?: StringNullableListFilter<"SystemDesignProblem">
    starterGraph?: JsonFilter<"SystemDesignProblem">
    referenceArchitecture?: JsonFilter<"SystemDesignProblem">
    rubricTemplate?: JsonFilter<"SystemDesignProblem">
    createdAt?: DateTimeFilter<"SystemDesignProblem"> | Date | string
    updatedAt?: DateTimeFilter<"SystemDesignProblem"> | Date | string
    sessions?: SystemDesignSessionListRelationFilter
  }

  export type SystemDesignProblemOrderByWithRelationInput = {
    id?: SortOrder
    slug?: SortOrder
    title?: SortOrder
    difficulty?: SortOrder
    category?: SortOrder
    summary?: SortOrder
    description?: SortOrder
    functionalRequirements?: SortOrder
    nonFunctionalRequirements?: SortOrder
    trafficDefaults?: SortOrder
    suggestedComponents?: SortOrder
    starterGraph?: SortOrder
    referenceArchitecture?: SortOrder
    rubricTemplate?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    sessions?: SystemDesignSessionOrderByRelationAggregateInput
  }

  export type SystemDesignProblemWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    slug?: string
    AND?: SystemDesignProblemWhereInput | SystemDesignProblemWhereInput[]
    OR?: SystemDesignProblemWhereInput[]
    NOT?: SystemDesignProblemWhereInput | SystemDesignProblemWhereInput[]
    title?: StringFilter<"SystemDesignProblem"> | string
    difficulty?: StringFilter<"SystemDesignProblem"> | string
    category?: StringFilter<"SystemDesignProblem"> | string
    summary?: StringFilter<"SystemDesignProblem"> | string
    description?: StringFilter<"SystemDesignProblem"> | string
    functionalRequirements?: StringNullableListFilter<"SystemDesignProblem">
    nonFunctionalRequirements?: StringNullableListFilter<"SystemDesignProblem">
    trafficDefaults?: JsonFilter<"SystemDesignProblem">
    suggestedComponents?: StringNullableListFilter<"SystemDesignProblem">
    starterGraph?: JsonFilter<"SystemDesignProblem">
    referenceArchitecture?: JsonFilter<"SystemDesignProblem">
    rubricTemplate?: JsonFilter<"SystemDesignProblem">
    createdAt?: DateTimeFilter<"SystemDesignProblem"> | Date | string
    updatedAt?: DateTimeFilter<"SystemDesignProblem"> | Date | string
    sessions?: SystemDesignSessionListRelationFilter
  }, "id" | "slug">

  export type SystemDesignProblemOrderByWithAggregationInput = {
    id?: SortOrder
    slug?: SortOrder
    title?: SortOrder
    difficulty?: SortOrder
    category?: SortOrder
    summary?: SortOrder
    description?: SortOrder
    functionalRequirements?: SortOrder
    nonFunctionalRequirements?: SortOrder
    trafficDefaults?: SortOrder
    suggestedComponents?: SortOrder
    starterGraph?: SortOrder
    referenceArchitecture?: SortOrder
    rubricTemplate?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: SystemDesignProblemCountOrderByAggregateInput
    _max?: SystemDesignProblemMaxOrderByAggregateInput
    _min?: SystemDesignProblemMinOrderByAggregateInput
  }

  export type SystemDesignProblemScalarWhereWithAggregatesInput = {
    AND?: SystemDesignProblemScalarWhereWithAggregatesInput | SystemDesignProblemScalarWhereWithAggregatesInput[]
    OR?: SystemDesignProblemScalarWhereWithAggregatesInput[]
    NOT?: SystemDesignProblemScalarWhereWithAggregatesInput | SystemDesignProblemScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"SystemDesignProblem"> | string
    slug?: StringWithAggregatesFilter<"SystemDesignProblem"> | string
    title?: StringWithAggregatesFilter<"SystemDesignProblem"> | string
    difficulty?: StringWithAggregatesFilter<"SystemDesignProblem"> | string
    category?: StringWithAggregatesFilter<"SystemDesignProblem"> | string
    summary?: StringWithAggregatesFilter<"SystemDesignProblem"> | string
    description?: StringWithAggregatesFilter<"SystemDesignProblem"> | string
    functionalRequirements?: StringNullableListFilter<"SystemDesignProblem">
    nonFunctionalRequirements?: StringNullableListFilter<"SystemDesignProblem">
    trafficDefaults?: JsonWithAggregatesFilter<"SystemDesignProblem">
    suggestedComponents?: StringNullableListFilter<"SystemDesignProblem">
    starterGraph?: JsonWithAggregatesFilter<"SystemDesignProblem">
    referenceArchitecture?: JsonWithAggregatesFilter<"SystemDesignProblem">
    rubricTemplate?: JsonWithAggregatesFilter<"SystemDesignProblem">
    createdAt?: DateTimeWithAggregatesFilter<"SystemDesignProblem"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"SystemDesignProblem"> | Date | string
  }

  export type SystemDesignSessionWhereInput = {
    AND?: SystemDesignSessionWhereInput | SystemDesignSessionWhereInput[]
    OR?: SystemDesignSessionWhereInput[]
    NOT?: SystemDesignSessionWhereInput | SystemDesignSessionWhereInput[]
    id?: StringFilter<"SystemDesignSession"> | string
    userId?: StringFilter<"SystemDesignSession"> | string
    userName?: StringNullableFilter<"SystemDesignSession"> | string | null
    problemId?: StringFilter<"SystemDesignSession"> | string
    title?: StringFilter<"SystemDesignSession"> | string
    stage?: IntFilter<"SystemDesignSession"> | number
    status?: StringFilter<"SystemDesignSession"> | string
    durationSeconds?: IntFilter<"SystemDesignSession"> | number
    graphData?: JsonFilter<"SystemDesignSession">
    capacityInputs?: JsonFilter<"SystemDesignSession">
    capacityOutputs?: JsonFilter<"SystemDesignSession">
    validationState?: JsonFilter<"SystemDesignSession">
    transcript?: JsonFilter<"SystemDesignSession">
    score?: IntNullableFilter<"SystemDesignSession"> | number | null
    evaluation?: JsonNullableFilter<"SystemDesignSession">
    createdAt?: DateTimeFilter<"SystemDesignSession"> | Date | string
    updatedAt?: DateTimeFilter<"SystemDesignSession"> | Date | string
    problem?: XOR<SystemDesignProblemScalarRelationFilter, SystemDesignProblemWhereInput>
  }

  export type SystemDesignSessionOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    userName?: SortOrderInput | SortOrder
    problemId?: SortOrder
    title?: SortOrder
    stage?: SortOrder
    status?: SortOrder
    durationSeconds?: SortOrder
    graphData?: SortOrder
    capacityInputs?: SortOrder
    capacityOutputs?: SortOrder
    validationState?: SortOrder
    transcript?: SortOrder
    score?: SortOrderInput | SortOrder
    evaluation?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    problem?: SystemDesignProblemOrderByWithRelationInput
  }

  export type SystemDesignSessionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: SystemDesignSessionWhereInput | SystemDesignSessionWhereInput[]
    OR?: SystemDesignSessionWhereInput[]
    NOT?: SystemDesignSessionWhereInput | SystemDesignSessionWhereInput[]
    userId?: StringFilter<"SystemDesignSession"> | string
    userName?: StringNullableFilter<"SystemDesignSession"> | string | null
    problemId?: StringFilter<"SystemDesignSession"> | string
    title?: StringFilter<"SystemDesignSession"> | string
    stage?: IntFilter<"SystemDesignSession"> | number
    status?: StringFilter<"SystemDesignSession"> | string
    durationSeconds?: IntFilter<"SystemDesignSession"> | number
    graphData?: JsonFilter<"SystemDesignSession">
    capacityInputs?: JsonFilter<"SystemDesignSession">
    capacityOutputs?: JsonFilter<"SystemDesignSession">
    validationState?: JsonFilter<"SystemDesignSession">
    transcript?: JsonFilter<"SystemDesignSession">
    score?: IntNullableFilter<"SystemDesignSession"> | number | null
    evaluation?: JsonNullableFilter<"SystemDesignSession">
    createdAt?: DateTimeFilter<"SystemDesignSession"> | Date | string
    updatedAt?: DateTimeFilter<"SystemDesignSession"> | Date | string
    problem?: XOR<SystemDesignProblemScalarRelationFilter, SystemDesignProblemWhereInput>
  }, "id">

  export type SystemDesignSessionOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    userName?: SortOrderInput | SortOrder
    problemId?: SortOrder
    title?: SortOrder
    stage?: SortOrder
    status?: SortOrder
    durationSeconds?: SortOrder
    graphData?: SortOrder
    capacityInputs?: SortOrder
    capacityOutputs?: SortOrder
    validationState?: SortOrder
    transcript?: SortOrder
    score?: SortOrderInput | SortOrder
    evaluation?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: SystemDesignSessionCountOrderByAggregateInput
    _avg?: SystemDesignSessionAvgOrderByAggregateInput
    _max?: SystemDesignSessionMaxOrderByAggregateInput
    _min?: SystemDesignSessionMinOrderByAggregateInput
    _sum?: SystemDesignSessionSumOrderByAggregateInput
  }

  export type SystemDesignSessionScalarWhereWithAggregatesInput = {
    AND?: SystemDesignSessionScalarWhereWithAggregatesInput | SystemDesignSessionScalarWhereWithAggregatesInput[]
    OR?: SystemDesignSessionScalarWhereWithAggregatesInput[]
    NOT?: SystemDesignSessionScalarWhereWithAggregatesInput | SystemDesignSessionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"SystemDesignSession"> | string
    userId?: StringWithAggregatesFilter<"SystemDesignSession"> | string
    userName?: StringNullableWithAggregatesFilter<"SystemDesignSession"> | string | null
    problemId?: StringWithAggregatesFilter<"SystemDesignSession"> | string
    title?: StringWithAggregatesFilter<"SystemDesignSession"> | string
    stage?: IntWithAggregatesFilter<"SystemDesignSession"> | number
    status?: StringWithAggregatesFilter<"SystemDesignSession"> | string
    durationSeconds?: IntWithAggregatesFilter<"SystemDesignSession"> | number
    graphData?: JsonWithAggregatesFilter<"SystemDesignSession">
    capacityInputs?: JsonWithAggregatesFilter<"SystemDesignSession">
    capacityOutputs?: JsonWithAggregatesFilter<"SystemDesignSession">
    validationState?: JsonWithAggregatesFilter<"SystemDesignSession">
    transcript?: JsonWithAggregatesFilter<"SystemDesignSession">
    score?: IntNullableWithAggregatesFilter<"SystemDesignSession"> | number | null
    evaluation?: JsonNullableWithAggregatesFilter<"SystemDesignSession">
    createdAt?: DateTimeWithAggregatesFilter<"SystemDesignSession"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"SystemDesignSession"> | Date | string
  }

  export type SystemDesignProblemCreateInput = {
    id?: string
    slug: string
    title: string
    difficulty?: string
    category?: string
    summary: string
    description: string
    functionalRequirements?: SystemDesignProblemCreatefunctionalRequirementsInput | string[]
    nonFunctionalRequirements?: SystemDesignProblemCreatenonFunctionalRequirementsInput | string[]
    trafficDefaults?: JsonNullValueInput | InputJsonValue
    suggestedComponents?: SystemDesignProblemCreatesuggestedComponentsInput | string[]
    starterGraph?: JsonNullValueInput | InputJsonValue
    referenceArchitecture?: JsonNullValueInput | InputJsonValue
    rubricTemplate?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    sessions?: SystemDesignSessionCreateNestedManyWithoutProblemInput
  }

  export type SystemDesignProblemUncheckedCreateInput = {
    id?: string
    slug: string
    title: string
    difficulty?: string
    category?: string
    summary: string
    description: string
    functionalRequirements?: SystemDesignProblemCreatefunctionalRequirementsInput | string[]
    nonFunctionalRequirements?: SystemDesignProblemCreatenonFunctionalRequirementsInput | string[]
    trafficDefaults?: JsonNullValueInput | InputJsonValue
    suggestedComponents?: SystemDesignProblemCreatesuggestedComponentsInput | string[]
    starterGraph?: JsonNullValueInput | InputJsonValue
    referenceArchitecture?: JsonNullValueInput | InputJsonValue
    rubricTemplate?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    sessions?: SystemDesignSessionUncheckedCreateNestedManyWithoutProblemInput
  }

  export type SystemDesignProblemUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    difficulty?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    summary?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    functionalRequirements?: SystemDesignProblemUpdatefunctionalRequirementsInput | string[]
    nonFunctionalRequirements?: SystemDesignProblemUpdatenonFunctionalRequirementsInput | string[]
    trafficDefaults?: JsonNullValueInput | InputJsonValue
    suggestedComponents?: SystemDesignProblemUpdatesuggestedComponentsInput | string[]
    starterGraph?: JsonNullValueInput | InputJsonValue
    referenceArchitecture?: JsonNullValueInput | InputJsonValue
    rubricTemplate?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: SystemDesignSessionUpdateManyWithoutProblemNestedInput
  }

  export type SystemDesignProblemUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    difficulty?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    summary?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    functionalRequirements?: SystemDesignProblemUpdatefunctionalRequirementsInput | string[]
    nonFunctionalRequirements?: SystemDesignProblemUpdatenonFunctionalRequirementsInput | string[]
    trafficDefaults?: JsonNullValueInput | InputJsonValue
    suggestedComponents?: SystemDesignProblemUpdatesuggestedComponentsInput | string[]
    starterGraph?: JsonNullValueInput | InputJsonValue
    referenceArchitecture?: JsonNullValueInput | InputJsonValue
    rubricTemplate?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: SystemDesignSessionUncheckedUpdateManyWithoutProblemNestedInput
  }

  export type SystemDesignProblemCreateManyInput = {
    id?: string
    slug: string
    title: string
    difficulty?: string
    category?: string
    summary: string
    description: string
    functionalRequirements?: SystemDesignProblemCreatefunctionalRequirementsInput | string[]
    nonFunctionalRequirements?: SystemDesignProblemCreatenonFunctionalRequirementsInput | string[]
    trafficDefaults?: JsonNullValueInput | InputJsonValue
    suggestedComponents?: SystemDesignProblemCreatesuggestedComponentsInput | string[]
    starterGraph?: JsonNullValueInput | InputJsonValue
    referenceArchitecture?: JsonNullValueInput | InputJsonValue
    rubricTemplate?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SystemDesignProblemUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    difficulty?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    summary?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    functionalRequirements?: SystemDesignProblemUpdatefunctionalRequirementsInput | string[]
    nonFunctionalRequirements?: SystemDesignProblemUpdatenonFunctionalRequirementsInput | string[]
    trafficDefaults?: JsonNullValueInput | InputJsonValue
    suggestedComponents?: SystemDesignProblemUpdatesuggestedComponentsInput | string[]
    starterGraph?: JsonNullValueInput | InputJsonValue
    referenceArchitecture?: JsonNullValueInput | InputJsonValue
    rubricTemplate?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SystemDesignProblemUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    difficulty?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    summary?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    functionalRequirements?: SystemDesignProblemUpdatefunctionalRequirementsInput | string[]
    nonFunctionalRequirements?: SystemDesignProblemUpdatenonFunctionalRequirementsInput | string[]
    trafficDefaults?: JsonNullValueInput | InputJsonValue
    suggestedComponents?: SystemDesignProblemUpdatesuggestedComponentsInput | string[]
    starterGraph?: JsonNullValueInput | InputJsonValue
    referenceArchitecture?: JsonNullValueInput | InputJsonValue
    rubricTemplate?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SystemDesignSessionCreateInput = {
    id?: string
    userId: string
    userName?: string | null
    title: string
    stage?: number
    status?: string
    durationSeconds?: number
    graphData?: JsonNullValueInput | InputJsonValue
    capacityInputs?: JsonNullValueInput | InputJsonValue
    capacityOutputs?: JsonNullValueInput | InputJsonValue
    validationState?: JsonNullValueInput | InputJsonValue
    transcript?: JsonNullValueInput | InputJsonValue
    score?: number | null
    evaluation?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    problem: SystemDesignProblemCreateNestedOneWithoutSessionsInput
  }

  export type SystemDesignSessionUncheckedCreateInput = {
    id?: string
    userId: string
    userName?: string | null
    problemId: string
    title: string
    stage?: number
    status?: string
    durationSeconds?: number
    graphData?: JsonNullValueInput | InputJsonValue
    capacityInputs?: JsonNullValueInput | InputJsonValue
    capacityOutputs?: JsonNullValueInput | InputJsonValue
    validationState?: JsonNullValueInput | InputJsonValue
    transcript?: JsonNullValueInput | InputJsonValue
    score?: number | null
    evaluation?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SystemDesignSessionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    userName?: NullableStringFieldUpdateOperationsInput | string | null
    title?: StringFieldUpdateOperationsInput | string
    stage?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    durationSeconds?: IntFieldUpdateOperationsInput | number
    graphData?: JsonNullValueInput | InputJsonValue
    capacityInputs?: JsonNullValueInput | InputJsonValue
    capacityOutputs?: JsonNullValueInput | InputJsonValue
    validationState?: JsonNullValueInput | InputJsonValue
    transcript?: JsonNullValueInput | InputJsonValue
    score?: NullableIntFieldUpdateOperationsInput | number | null
    evaluation?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    problem?: SystemDesignProblemUpdateOneRequiredWithoutSessionsNestedInput
  }

  export type SystemDesignSessionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    userName?: NullableStringFieldUpdateOperationsInput | string | null
    problemId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    stage?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    durationSeconds?: IntFieldUpdateOperationsInput | number
    graphData?: JsonNullValueInput | InputJsonValue
    capacityInputs?: JsonNullValueInput | InputJsonValue
    capacityOutputs?: JsonNullValueInput | InputJsonValue
    validationState?: JsonNullValueInput | InputJsonValue
    transcript?: JsonNullValueInput | InputJsonValue
    score?: NullableIntFieldUpdateOperationsInput | number | null
    evaluation?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SystemDesignSessionCreateManyInput = {
    id?: string
    userId: string
    userName?: string | null
    problemId: string
    title: string
    stage?: number
    status?: string
    durationSeconds?: number
    graphData?: JsonNullValueInput | InputJsonValue
    capacityInputs?: JsonNullValueInput | InputJsonValue
    capacityOutputs?: JsonNullValueInput | InputJsonValue
    validationState?: JsonNullValueInput | InputJsonValue
    transcript?: JsonNullValueInput | InputJsonValue
    score?: number | null
    evaluation?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SystemDesignSessionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    userName?: NullableStringFieldUpdateOperationsInput | string | null
    title?: StringFieldUpdateOperationsInput | string
    stage?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    durationSeconds?: IntFieldUpdateOperationsInput | number
    graphData?: JsonNullValueInput | InputJsonValue
    capacityInputs?: JsonNullValueInput | InputJsonValue
    capacityOutputs?: JsonNullValueInput | InputJsonValue
    validationState?: JsonNullValueInput | InputJsonValue
    transcript?: JsonNullValueInput | InputJsonValue
    score?: NullableIntFieldUpdateOperationsInput | number | null
    evaluation?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SystemDesignSessionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    userName?: NullableStringFieldUpdateOperationsInput | string | null
    problemId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    stage?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    durationSeconds?: IntFieldUpdateOperationsInput | number
    graphData?: JsonNullValueInput | InputJsonValue
    capacityInputs?: JsonNullValueInput | InputJsonValue
    capacityOutputs?: JsonNullValueInput | InputJsonValue
    validationState?: JsonNullValueInput | InputJsonValue
    transcript?: JsonNullValueInput | InputJsonValue
    score?: NullableIntFieldUpdateOperationsInput | number | null
    evaluation?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
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

  export type StringNullableListFilter<$PrismaModel = never> = {
    equals?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    has?: string | StringFieldRefInput<$PrismaModel> | null
    hasEvery?: string[] | ListStringFieldRefInput<$PrismaModel>
    hasSome?: string[] | ListStringFieldRefInput<$PrismaModel>
    isEmpty?: boolean
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

  export type SystemDesignSessionListRelationFilter = {
    every?: SystemDesignSessionWhereInput
    some?: SystemDesignSessionWhereInput
    none?: SystemDesignSessionWhereInput
  }

  export type SystemDesignSessionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type SystemDesignProblemCountOrderByAggregateInput = {
    id?: SortOrder
    slug?: SortOrder
    title?: SortOrder
    difficulty?: SortOrder
    category?: SortOrder
    summary?: SortOrder
    description?: SortOrder
    functionalRequirements?: SortOrder
    nonFunctionalRequirements?: SortOrder
    trafficDefaults?: SortOrder
    suggestedComponents?: SortOrder
    starterGraph?: SortOrder
    referenceArchitecture?: SortOrder
    rubricTemplate?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SystemDesignProblemMaxOrderByAggregateInput = {
    id?: SortOrder
    slug?: SortOrder
    title?: SortOrder
    difficulty?: SortOrder
    category?: SortOrder
    summary?: SortOrder
    description?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SystemDesignProblemMinOrderByAggregateInput = {
    id?: SortOrder
    slug?: SortOrder
    title?: SortOrder
    difficulty?: SortOrder
    category?: SortOrder
    summary?: SortOrder
    description?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
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
  export type JsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
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

  export type SystemDesignProblemScalarRelationFilter = {
    is?: SystemDesignProblemWhereInput
    isNot?: SystemDesignProblemWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type SystemDesignSessionCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    userName?: SortOrder
    problemId?: SortOrder
    title?: SortOrder
    stage?: SortOrder
    status?: SortOrder
    durationSeconds?: SortOrder
    graphData?: SortOrder
    capacityInputs?: SortOrder
    capacityOutputs?: SortOrder
    validationState?: SortOrder
    transcript?: SortOrder
    score?: SortOrder
    evaluation?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SystemDesignSessionAvgOrderByAggregateInput = {
    stage?: SortOrder
    durationSeconds?: SortOrder
    score?: SortOrder
  }

  export type SystemDesignSessionMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    userName?: SortOrder
    problemId?: SortOrder
    title?: SortOrder
    stage?: SortOrder
    status?: SortOrder
    durationSeconds?: SortOrder
    score?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SystemDesignSessionMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    userName?: SortOrder
    problemId?: SortOrder
    title?: SortOrder
    stage?: SortOrder
    status?: SortOrder
    durationSeconds?: SortOrder
    score?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SystemDesignSessionSumOrderByAggregateInput = {
    stage?: SortOrder
    durationSeconds?: SortOrder
    score?: SortOrder
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
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
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
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }

  export type SystemDesignProblemCreatefunctionalRequirementsInput = {
    set: string[]
  }

  export type SystemDesignProblemCreatenonFunctionalRequirementsInput = {
    set: string[]
  }

  export type SystemDesignProblemCreatesuggestedComponentsInput = {
    set: string[]
  }

  export type SystemDesignSessionCreateNestedManyWithoutProblemInput = {
    create?: XOR<SystemDesignSessionCreateWithoutProblemInput, SystemDesignSessionUncheckedCreateWithoutProblemInput> | SystemDesignSessionCreateWithoutProblemInput[] | SystemDesignSessionUncheckedCreateWithoutProblemInput[]
    connectOrCreate?: SystemDesignSessionCreateOrConnectWithoutProblemInput | SystemDesignSessionCreateOrConnectWithoutProblemInput[]
    createMany?: SystemDesignSessionCreateManyProblemInputEnvelope
    connect?: SystemDesignSessionWhereUniqueInput | SystemDesignSessionWhereUniqueInput[]
  }

  export type SystemDesignSessionUncheckedCreateNestedManyWithoutProblemInput = {
    create?: XOR<SystemDesignSessionCreateWithoutProblemInput, SystemDesignSessionUncheckedCreateWithoutProblemInput> | SystemDesignSessionCreateWithoutProblemInput[] | SystemDesignSessionUncheckedCreateWithoutProblemInput[]
    connectOrCreate?: SystemDesignSessionCreateOrConnectWithoutProblemInput | SystemDesignSessionCreateOrConnectWithoutProblemInput[]
    createMany?: SystemDesignSessionCreateManyProblemInputEnvelope
    connect?: SystemDesignSessionWhereUniqueInput | SystemDesignSessionWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type SystemDesignProblemUpdatefunctionalRequirementsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type SystemDesignProblemUpdatenonFunctionalRequirementsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type SystemDesignProblemUpdatesuggestedComponentsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type SystemDesignSessionUpdateManyWithoutProblemNestedInput = {
    create?: XOR<SystemDesignSessionCreateWithoutProblemInput, SystemDesignSessionUncheckedCreateWithoutProblemInput> | SystemDesignSessionCreateWithoutProblemInput[] | SystemDesignSessionUncheckedCreateWithoutProblemInput[]
    connectOrCreate?: SystemDesignSessionCreateOrConnectWithoutProblemInput | SystemDesignSessionCreateOrConnectWithoutProblemInput[]
    upsert?: SystemDesignSessionUpsertWithWhereUniqueWithoutProblemInput | SystemDesignSessionUpsertWithWhereUniqueWithoutProblemInput[]
    createMany?: SystemDesignSessionCreateManyProblemInputEnvelope
    set?: SystemDesignSessionWhereUniqueInput | SystemDesignSessionWhereUniqueInput[]
    disconnect?: SystemDesignSessionWhereUniqueInput | SystemDesignSessionWhereUniqueInput[]
    delete?: SystemDesignSessionWhereUniqueInput | SystemDesignSessionWhereUniqueInput[]
    connect?: SystemDesignSessionWhereUniqueInput | SystemDesignSessionWhereUniqueInput[]
    update?: SystemDesignSessionUpdateWithWhereUniqueWithoutProblemInput | SystemDesignSessionUpdateWithWhereUniqueWithoutProblemInput[]
    updateMany?: SystemDesignSessionUpdateManyWithWhereWithoutProblemInput | SystemDesignSessionUpdateManyWithWhereWithoutProblemInput[]
    deleteMany?: SystemDesignSessionScalarWhereInput | SystemDesignSessionScalarWhereInput[]
  }

  export type SystemDesignSessionUncheckedUpdateManyWithoutProblemNestedInput = {
    create?: XOR<SystemDesignSessionCreateWithoutProblemInput, SystemDesignSessionUncheckedCreateWithoutProblemInput> | SystemDesignSessionCreateWithoutProblemInput[] | SystemDesignSessionUncheckedCreateWithoutProblemInput[]
    connectOrCreate?: SystemDesignSessionCreateOrConnectWithoutProblemInput | SystemDesignSessionCreateOrConnectWithoutProblemInput[]
    upsert?: SystemDesignSessionUpsertWithWhereUniqueWithoutProblemInput | SystemDesignSessionUpsertWithWhereUniqueWithoutProblemInput[]
    createMany?: SystemDesignSessionCreateManyProblemInputEnvelope
    set?: SystemDesignSessionWhereUniqueInput | SystemDesignSessionWhereUniqueInput[]
    disconnect?: SystemDesignSessionWhereUniqueInput | SystemDesignSessionWhereUniqueInput[]
    delete?: SystemDesignSessionWhereUniqueInput | SystemDesignSessionWhereUniqueInput[]
    connect?: SystemDesignSessionWhereUniqueInput | SystemDesignSessionWhereUniqueInput[]
    update?: SystemDesignSessionUpdateWithWhereUniqueWithoutProblemInput | SystemDesignSessionUpdateWithWhereUniqueWithoutProblemInput[]
    updateMany?: SystemDesignSessionUpdateManyWithWhereWithoutProblemInput | SystemDesignSessionUpdateManyWithWhereWithoutProblemInput[]
    deleteMany?: SystemDesignSessionScalarWhereInput | SystemDesignSessionScalarWhereInput[]
  }

  export type SystemDesignProblemCreateNestedOneWithoutSessionsInput = {
    create?: XOR<SystemDesignProblemCreateWithoutSessionsInput, SystemDesignProblemUncheckedCreateWithoutSessionsInput>
    connectOrCreate?: SystemDesignProblemCreateOrConnectWithoutSessionsInput
    connect?: SystemDesignProblemWhereUniqueInput
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type SystemDesignProblemUpdateOneRequiredWithoutSessionsNestedInput = {
    create?: XOR<SystemDesignProblemCreateWithoutSessionsInput, SystemDesignProblemUncheckedCreateWithoutSessionsInput>
    connectOrCreate?: SystemDesignProblemCreateOrConnectWithoutSessionsInput
    upsert?: SystemDesignProblemUpsertWithoutSessionsInput
    connect?: SystemDesignProblemWhereUniqueInput
    update?: XOR<XOR<SystemDesignProblemUpdateToOneWithWhereWithoutSessionsInput, SystemDesignProblemUpdateWithoutSessionsInput>, SystemDesignProblemUncheckedUpdateWithoutSessionsInput>
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
  export type NestedJsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
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

  export type SystemDesignSessionCreateWithoutProblemInput = {
    id?: string
    userId: string
    userName?: string | null
    title: string
    stage?: number
    status?: string
    durationSeconds?: number
    graphData?: JsonNullValueInput | InputJsonValue
    capacityInputs?: JsonNullValueInput | InputJsonValue
    capacityOutputs?: JsonNullValueInput | InputJsonValue
    validationState?: JsonNullValueInput | InputJsonValue
    transcript?: JsonNullValueInput | InputJsonValue
    score?: number | null
    evaluation?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SystemDesignSessionUncheckedCreateWithoutProblemInput = {
    id?: string
    userId: string
    userName?: string | null
    title: string
    stage?: number
    status?: string
    durationSeconds?: number
    graphData?: JsonNullValueInput | InputJsonValue
    capacityInputs?: JsonNullValueInput | InputJsonValue
    capacityOutputs?: JsonNullValueInput | InputJsonValue
    validationState?: JsonNullValueInput | InputJsonValue
    transcript?: JsonNullValueInput | InputJsonValue
    score?: number | null
    evaluation?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SystemDesignSessionCreateOrConnectWithoutProblemInput = {
    where: SystemDesignSessionWhereUniqueInput
    create: XOR<SystemDesignSessionCreateWithoutProblemInput, SystemDesignSessionUncheckedCreateWithoutProblemInput>
  }

  export type SystemDesignSessionCreateManyProblemInputEnvelope = {
    data: SystemDesignSessionCreateManyProblemInput | SystemDesignSessionCreateManyProblemInput[]
    skipDuplicates?: boolean
  }

  export type SystemDesignSessionUpsertWithWhereUniqueWithoutProblemInput = {
    where: SystemDesignSessionWhereUniqueInput
    update: XOR<SystemDesignSessionUpdateWithoutProblemInput, SystemDesignSessionUncheckedUpdateWithoutProblemInput>
    create: XOR<SystemDesignSessionCreateWithoutProblemInput, SystemDesignSessionUncheckedCreateWithoutProblemInput>
  }

  export type SystemDesignSessionUpdateWithWhereUniqueWithoutProblemInput = {
    where: SystemDesignSessionWhereUniqueInput
    data: XOR<SystemDesignSessionUpdateWithoutProblemInput, SystemDesignSessionUncheckedUpdateWithoutProblemInput>
  }

  export type SystemDesignSessionUpdateManyWithWhereWithoutProblemInput = {
    where: SystemDesignSessionScalarWhereInput
    data: XOR<SystemDesignSessionUpdateManyMutationInput, SystemDesignSessionUncheckedUpdateManyWithoutProblemInput>
  }

  export type SystemDesignSessionScalarWhereInput = {
    AND?: SystemDesignSessionScalarWhereInput | SystemDesignSessionScalarWhereInput[]
    OR?: SystemDesignSessionScalarWhereInput[]
    NOT?: SystemDesignSessionScalarWhereInput | SystemDesignSessionScalarWhereInput[]
    id?: StringFilter<"SystemDesignSession"> | string
    userId?: StringFilter<"SystemDesignSession"> | string
    userName?: StringNullableFilter<"SystemDesignSession"> | string | null
    problemId?: StringFilter<"SystemDesignSession"> | string
    title?: StringFilter<"SystemDesignSession"> | string
    stage?: IntFilter<"SystemDesignSession"> | number
    status?: StringFilter<"SystemDesignSession"> | string
    durationSeconds?: IntFilter<"SystemDesignSession"> | number
    graphData?: JsonFilter<"SystemDesignSession">
    capacityInputs?: JsonFilter<"SystemDesignSession">
    capacityOutputs?: JsonFilter<"SystemDesignSession">
    validationState?: JsonFilter<"SystemDesignSession">
    transcript?: JsonFilter<"SystemDesignSession">
    score?: IntNullableFilter<"SystemDesignSession"> | number | null
    evaluation?: JsonNullableFilter<"SystemDesignSession">
    createdAt?: DateTimeFilter<"SystemDesignSession"> | Date | string
    updatedAt?: DateTimeFilter<"SystemDesignSession"> | Date | string
  }

  export type SystemDesignProblemCreateWithoutSessionsInput = {
    id?: string
    slug: string
    title: string
    difficulty?: string
    category?: string
    summary: string
    description: string
    functionalRequirements?: SystemDesignProblemCreatefunctionalRequirementsInput | string[]
    nonFunctionalRequirements?: SystemDesignProblemCreatenonFunctionalRequirementsInput | string[]
    trafficDefaults?: JsonNullValueInput | InputJsonValue
    suggestedComponents?: SystemDesignProblemCreatesuggestedComponentsInput | string[]
    starterGraph?: JsonNullValueInput | InputJsonValue
    referenceArchitecture?: JsonNullValueInput | InputJsonValue
    rubricTemplate?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SystemDesignProblemUncheckedCreateWithoutSessionsInput = {
    id?: string
    slug: string
    title: string
    difficulty?: string
    category?: string
    summary: string
    description: string
    functionalRequirements?: SystemDesignProblemCreatefunctionalRequirementsInput | string[]
    nonFunctionalRequirements?: SystemDesignProblemCreatenonFunctionalRequirementsInput | string[]
    trafficDefaults?: JsonNullValueInput | InputJsonValue
    suggestedComponents?: SystemDesignProblemCreatesuggestedComponentsInput | string[]
    starterGraph?: JsonNullValueInput | InputJsonValue
    referenceArchitecture?: JsonNullValueInput | InputJsonValue
    rubricTemplate?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SystemDesignProblemCreateOrConnectWithoutSessionsInput = {
    where: SystemDesignProblemWhereUniqueInput
    create: XOR<SystemDesignProblemCreateWithoutSessionsInput, SystemDesignProblemUncheckedCreateWithoutSessionsInput>
  }

  export type SystemDesignProblemUpsertWithoutSessionsInput = {
    update: XOR<SystemDesignProblemUpdateWithoutSessionsInput, SystemDesignProblemUncheckedUpdateWithoutSessionsInput>
    create: XOR<SystemDesignProblemCreateWithoutSessionsInput, SystemDesignProblemUncheckedCreateWithoutSessionsInput>
    where?: SystemDesignProblemWhereInput
  }

  export type SystemDesignProblemUpdateToOneWithWhereWithoutSessionsInput = {
    where?: SystemDesignProblemWhereInput
    data: XOR<SystemDesignProblemUpdateWithoutSessionsInput, SystemDesignProblemUncheckedUpdateWithoutSessionsInput>
  }

  export type SystemDesignProblemUpdateWithoutSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    difficulty?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    summary?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    functionalRequirements?: SystemDesignProblemUpdatefunctionalRequirementsInput | string[]
    nonFunctionalRequirements?: SystemDesignProblemUpdatenonFunctionalRequirementsInput | string[]
    trafficDefaults?: JsonNullValueInput | InputJsonValue
    suggestedComponents?: SystemDesignProblemUpdatesuggestedComponentsInput | string[]
    starterGraph?: JsonNullValueInput | InputJsonValue
    referenceArchitecture?: JsonNullValueInput | InputJsonValue
    rubricTemplate?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SystemDesignProblemUncheckedUpdateWithoutSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    difficulty?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    summary?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    functionalRequirements?: SystemDesignProblemUpdatefunctionalRequirementsInput | string[]
    nonFunctionalRequirements?: SystemDesignProblemUpdatenonFunctionalRequirementsInput | string[]
    trafficDefaults?: JsonNullValueInput | InputJsonValue
    suggestedComponents?: SystemDesignProblemUpdatesuggestedComponentsInput | string[]
    starterGraph?: JsonNullValueInput | InputJsonValue
    referenceArchitecture?: JsonNullValueInput | InputJsonValue
    rubricTemplate?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SystemDesignSessionCreateManyProblemInput = {
    id?: string
    userId: string
    userName?: string | null
    title: string
    stage?: number
    status?: string
    durationSeconds?: number
    graphData?: JsonNullValueInput | InputJsonValue
    capacityInputs?: JsonNullValueInput | InputJsonValue
    capacityOutputs?: JsonNullValueInput | InputJsonValue
    validationState?: JsonNullValueInput | InputJsonValue
    transcript?: JsonNullValueInput | InputJsonValue
    score?: number | null
    evaluation?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SystemDesignSessionUpdateWithoutProblemInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    userName?: NullableStringFieldUpdateOperationsInput | string | null
    title?: StringFieldUpdateOperationsInput | string
    stage?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    durationSeconds?: IntFieldUpdateOperationsInput | number
    graphData?: JsonNullValueInput | InputJsonValue
    capacityInputs?: JsonNullValueInput | InputJsonValue
    capacityOutputs?: JsonNullValueInput | InputJsonValue
    validationState?: JsonNullValueInput | InputJsonValue
    transcript?: JsonNullValueInput | InputJsonValue
    score?: NullableIntFieldUpdateOperationsInput | number | null
    evaluation?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SystemDesignSessionUncheckedUpdateWithoutProblemInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    userName?: NullableStringFieldUpdateOperationsInput | string | null
    title?: StringFieldUpdateOperationsInput | string
    stage?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    durationSeconds?: IntFieldUpdateOperationsInput | number
    graphData?: JsonNullValueInput | InputJsonValue
    capacityInputs?: JsonNullValueInput | InputJsonValue
    capacityOutputs?: JsonNullValueInput | InputJsonValue
    validationState?: JsonNullValueInput | InputJsonValue
    transcript?: JsonNullValueInput | InputJsonValue
    score?: NullableIntFieldUpdateOperationsInput | number | null
    evaluation?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SystemDesignSessionUncheckedUpdateManyWithoutProblemInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    userName?: NullableStringFieldUpdateOperationsInput | string | null
    title?: StringFieldUpdateOperationsInput | string
    stage?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    durationSeconds?: IntFieldUpdateOperationsInput | number
    graphData?: JsonNullValueInput | InputJsonValue
    capacityInputs?: JsonNullValueInput | InputJsonValue
    capacityOutputs?: JsonNullValueInput | InputJsonValue
    validationState?: JsonNullValueInput | InputJsonValue
    transcript?: JsonNullValueInput | InputJsonValue
    score?: NullableIntFieldUpdateOperationsInput | number | null
    evaluation?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
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