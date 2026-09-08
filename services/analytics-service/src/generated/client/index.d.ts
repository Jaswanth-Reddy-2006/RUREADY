
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
 * Model Analysis
 * 
 */
export type Analysis = $Result.DefaultSelection<Prisma.$AnalysisPayload>
/**
 * Model TelemetryLog
 * 
 */
export type TelemetryLog = $Result.DefaultSelection<Prisma.$TelemetryLogPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Analyses
 * const analyses = await prisma.analysis.findMany()
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
   * // Fetch zero or more Analyses
   * const analyses = await prisma.analysis.findMany()
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
   * `prisma.analysis`: Exposes CRUD operations for the **Analysis** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Analyses
    * const analyses = await prisma.analysis.findMany()
    * ```
    */
  get analysis(): Prisma.AnalysisDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.telemetryLog`: Exposes CRUD operations for the **TelemetryLog** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TelemetryLogs
    * const telemetryLogs = await prisma.telemetryLog.findMany()
    * ```
    */
  get telemetryLog(): Prisma.TelemetryLogDelegate<ExtArgs, ClientOptions>;
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
    Analysis: 'Analysis',
    TelemetryLog: 'TelemetryLog'
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
      modelProps: "analysis" | "telemetryLog"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Analysis: {
        payload: Prisma.$AnalysisPayload<ExtArgs>
        fields: Prisma.AnalysisFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AnalysisFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnalysisPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AnalysisFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnalysisPayload>
          }
          findFirst: {
            args: Prisma.AnalysisFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnalysisPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AnalysisFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnalysisPayload>
          }
          findMany: {
            args: Prisma.AnalysisFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnalysisPayload>[]
          }
          create: {
            args: Prisma.AnalysisCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnalysisPayload>
          }
          createMany: {
            args: Prisma.AnalysisCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AnalysisCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnalysisPayload>[]
          }
          delete: {
            args: Prisma.AnalysisDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnalysisPayload>
          }
          update: {
            args: Prisma.AnalysisUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnalysisPayload>
          }
          deleteMany: {
            args: Prisma.AnalysisDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AnalysisUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AnalysisUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnalysisPayload>[]
          }
          upsert: {
            args: Prisma.AnalysisUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnalysisPayload>
          }
          aggregate: {
            args: Prisma.AnalysisAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAnalysis>
          }
          groupBy: {
            args: Prisma.AnalysisGroupByArgs<ExtArgs>
            result: $Utils.Optional<AnalysisGroupByOutputType>[]
          }
          count: {
            args: Prisma.AnalysisCountArgs<ExtArgs>
            result: $Utils.Optional<AnalysisCountAggregateOutputType> | number
          }
        }
      }
      TelemetryLog: {
        payload: Prisma.$TelemetryLogPayload<ExtArgs>
        fields: Prisma.TelemetryLogFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TelemetryLogFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TelemetryLogPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TelemetryLogFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TelemetryLogPayload>
          }
          findFirst: {
            args: Prisma.TelemetryLogFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TelemetryLogPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TelemetryLogFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TelemetryLogPayload>
          }
          findMany: {
            args: Prisma.TelemetryLogFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TelemetryLogPayload>[]
          }
          create: {
            args: Prisma.TelemetryLogCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TelemetryLogPayload>
          }
          createMany: {
            args: Prisma.TelemetryLogCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TelemetryLogCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TelemetryLogPayload>[]
          }
          delete: {
            args: Prisma.TelemetryLogDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TelemetryLogPayload>
          }
          update: {
            args: Prisma.TelemetryLogUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TelemetryLogPayload>
          }
          deleteMany: {
            args: Prisma.TelemetryLogDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TelemetryLogUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TelemetryLogUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TelemetryLogPayload>[]
          }
          upsert: {
            args: Prisma.TelemetryLogUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TelemetryLogPayload>
          }
          aggregate: {
            args: Prisma.TelemetryLogAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTelemetryLog>
          }
          groupBy: {
            args: Prisma.TelemetryLogGroupByArgs<ExtArgs>
            result: $Utils.Optional<TelemetryLogGroupByOutputType>[]
          }
          count: {
            args: Prisma.TelemetryLogCountArgs<ExtArgs>
            result: $Utils.Optional<TelemetryLogCountAggregateOutputType> | number
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
    analysis?: AnalysisOmit
    telemetryLog?: TelemetryLogOmit
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
   * Models
   */

  /**
   * Model Analysis
   */

  export type AggregateAnalysis = {
    _count: AnalysisCountAggregateOutputType | null
    _avg: AnalysisAvgAggregateOutputType | null
    _sum: AnalysisSumAggregateOutputType | null
    _min: AnalysisMinAggregateOutputType | null
    _max: AnalysisMaxAggregateOutputType | null
  }

  export type AnalysisAvgAggregateOutputType = {
    overallScore: number | null
    communicationScore: number | null
    technicalScore: number | null
    confidenceScore: number | null
    structureScore: number | null
    confidenceMeterScore: number | null
    eyeContactScore: number | null
    presenceScore: number | null
  }

  export type AnalysisSumAggregateOutputType = {
    overallScore: number | null
    communicationScore: number | null
    technicalScore: number | null
    confidenceScore: number | null
    structureScore: number | null
    confidenceMeterScore: number | null
    eyeContactScore: number | null
    presenceScore: number | null
  }

  export type AnalysisMinAggregateOutputType = {
    id: string | null
    sessionId: string | null
    overallScore: number | null
    communicationScore: number | null
    technicalScore: number | null
    confidenceScore: number | null
    structureScore: number | null
    confidenceMeterScore: number | null
    eyeContactScore: number | null
    presenceScore: number | null
    summary: string | null
    readinessVerdict: string | null
    createdAt: Date | null
  }

  export type AnalysisMaxAggregateOutputType = {
    id: string | null
    sessionId: string | null
    overallScore: number | null
    communicationScore: number | null
    technicalScore: number | null
    confidenceScore: number | null
    structureScore: number | null
    confidenceMeterScore: number | null
    eyeContactScore: number | null
    presenceScore: number | null
    summary: string | null
    readinessVerdict: string | null
    createdAt: Date | null
  }

  export type AnalysisCountAggregateOutputType = {
    id: number
    sessionId: number
    overallScore: number
    communicationScore: number
    technicalScore: number
    confidenceScore: number
    structureScore: number
    confidenceMeterScore: number
    confidenceSignals: number
    eyeContactScore: number
    presenceScore: number
    summary: number
    strengths: number
    improvements: number
    actionableTips: number
    readinessVerdict: number
    createdAt: number
    _all: number
  }


  export type AnalysisAvgAggregateInputType = {
    overallScore?: true
    communicationScore?: true
    technicalScore?: true
    confidenceScore?: true
    structureScore?: true
    confidenceMeterScore?: true
    eyeContactScore?: true
    presenceScore?: true
  }

  export type AnalysisSumAggregateInputType = {
    overallScore?: true
    communicationScore?: true
    technicalScore?: true
    confidenceScore?: true
    structureScore?: true
    confidenceMeterScore?: true
    eyeContactScore?: true
    presenceScore?: true
  }

  export type AnalysisMinAggregateInputType = {
    id?: true
    sessionId?: true
    overallScore?: true
    communicationScore?: true
    technicalScore?: true
    confidenceScore?: true
    structureScore?: true
    confidenceMeterScore?: true
    eyeContactScore?: true
    presenceScore?: true
    summary?: true
    readinessVerdict?: true
    createdAt?: true
  }

  export type AnalysisMaxAggregateInputType = {
    id?: true
    sessionId?: true
    overallScore?: true
    communicationScore?: true
    technicalScore?: true
    confidenceScore?: true
    structureScore?: true
    confidenceMeterScore?: true
    eyeContactScore?: true
    presenceScore?: true
    summary?: true
    readinessVerdict?: true
    createdAt?: true
  }

  export type AnalysisCountAggregateInputType = {
    id?: true
    sessionId?: true
    overallScore?: true
    communicationScore?: true
    technicalScore?: true
    confidenceScore?: true
    structureScore?: true
    confidenceMeterScore?: true
    confidenceSignals?: true
    eyeContactScore?: true
    presenceScore?: true
    summary?: true
    strengths?: true
    improvements?: true
    actionableTips?: true
    readinessVerdict?: true
    createdAt?: true
    _all?: true
  }

  export type AnalysisAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Analysis to aggregate.
     */
    where?: AnalysisWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Analyses to fetch.
     */
    orderBy?: AnalysisOrderByWithRelationInput | AnalysisOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AnalysisWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Analyses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Analyses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Analyses
    **/
    _count?: true | AnalysisCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AnalysisAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AnalysisSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AnalysisMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AnalysisMaxAggregateInputType
  }

  export type GetAnalysisAggregateType<T extends AnalysisAggregateArgs> = {
        [P in keyof T & keyof AggregateAnalysis]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAnalysis[P]>
      : GetScalarType<T[P], AggregateAnalysis[P]>
  }




  export type AnalysisGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AnalysisWhereInput
    orderBy?: AnalysisOrderByWithAggregationInput | AnalysisOrderByWithAggregationInput[]
    by: AnalysisScalarFieldEnum[] | AnalysisScalarFieldEnum
    having?: AnalysisScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AnalysisCountAggregateInputType | true
    _avg?: AnalysisAvgAggregateInputType
    _sum?: AnalysisSumAggregateInputType
    _min?: AnalysisMinAggregateInputType
    _max?: AnalysisMaxAggregateInputType
  }

  export type AnalysisGroupByOutputType = {
    id: string
    sessionId: string
    overallScore: number
    communicationScore: number
    technicalScore: number
    confidenceScore: number
    structureScore: number
    confidenceMeterScore: number | null
    confidenceSignals: JsonValue | null
    eyeContactScore: number | null
    presenceScore: number | null
    summary: string
    strengths: string[]
    improvements: string[]
    actionableTips: JsonValue
    readinessVerdict: string
    createdAt: Date
    _count: AnalysisCountAggregateOutputType | null
    _avg: AnalysisAvgAggregateOutputType | null
    _sum: AnalysisSumAggregateOutputType | null
    _min: AnalysisMinAggregateOutputType | null
    _max: AnalysisMaxAggregateOutputType | null
  }

  type GetAnalysisGroupByPayload<T extends AnalysisGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AnalysisGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AnalysisGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AnalysisGroupByOutputType[P]>
            : GetScalarType<T[P], AnalysisGroupByOutputType[P]>
        }
      >
    >


  export type AnalysisSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sessionId?: boolean
    overallScore?: boolean
    communicationScore?: boolean
    technicalScore?: boolean
    confidenceScore?: boolean
    structureScore?: boolean
    confidenceMeterScore?: boolean
    confidenceSignals?: boolean
    eyeContactScore?: boolean
    presenceScore?: boolean
    summary?: boolean
    strengths?: boolean
    improvements?: boolean
    actionableTips?: boolean
    readinessVerdict?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["analysis"]>

  export type AnalysisSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sessionId?: boolean
    overallScore?: boolean
    communicationScore?: boolean
    technicalScore?: boolean
    confidenceScore?: boolean
    structureScore?: boolean
    confidenceMeterScore?: boolean
    confidenceSignals?: boolean
    eyeContactScore?: boolean
    presenceScore?: boolean
    summary?: boolean
    strengths?: boolean
    improvements?: boolean
    actionableTips?: boolean
    readinessVerdict?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["analysis"]>

  export type AnalysisSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sessionId?: boolean
    overallScore?: boolean
    communicationScore?: boolean
    technicalScore?: boolean
    confidenceScore?: boolean
    structureScore?: boolean
    confidenceMeterScore?: boolean
    confidenceSignals?: boolean
    eyeContactScore?: boolean
    presenceScore?: boolean
    summary?: boolean
    strengths?: boolean
    improvements?: boolean
    actionableTips?: boolean
    readinessVerdict?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["analysis"]>

  export type AnalysisSelectScalar = {
    id?: boolean
    sessionId?: boolean
    overallScore?: boolean
    communicationScore?: boolean
    technicalScore?: boolean
    confidenceScore?: boolean
    structureScore?: boolean
    confidenceMeterScore?: boolean
    confidenceSignals?: boolean
    eyeContactScore?: boolean
    presenceScore?: boolean
    summary?: boolean
    strengths?: boolean
    improvements?: boolean
    actionableTips?: boolean
    readinessVerdict?: boolean
    createdAt?: boolean
  }

  export type AnalysisOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "sessionId" | "overallScore" | "communicationScore" | "technicalScore" | "confidenceScore" | "structureScore" | "confidenceMeterScore" | "confidenceSignals" | "eyeContactScore" | "presenceScore" | "summary" | "strengths" | "improvements" | "actionableTips" | "readinessVerdict" | "createdAt", ExtArgs["result"]["analysis"]>

  export type $AnalysisPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Analysis"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      sessionId: string
      overallScore: number
      communicationScore: number
      technicalScore: number
      confidenceScore: number
      structureScore: number
      confidenceMeterScore: number | null
      confidenceSignals: Prisma.JsonValue | null
      eyeContactScore: number | null
      presenceScore: number | null
      summary: string
      strengths: string[]
      improvements: string[]
      actionableTips: Prisma.JsonValue
      readinessVerdict: string
      createdAt: Date
    }, ExtArgs["result"]["analysis"]>
    composites: {}
  }

  type AnalysisGetPayload<S extends boolean | null | undefined | AnalysisDefaultArgs> = $Result.GetResult<Prisma.$AnalysisPayload, S>

  type AnalysisCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AnalysisFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AnalysisCountAggregateInputType | true
    }

  export interface AnalysisDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Analysis'], meta: { name: 'Analysis' } }
    /**
     * Find zero or one Analysis that matches the filter.
     * @param {AnalysisFindUniqueArgs} args - Arguments to find a Analysis
     * @example
     * // Get one Analysis
     * const analysis = await prisma.analysis.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AnalysisFindUniqueArgs>(args: SelectSubset<T, AnalysisFindUniqueArgs<ExtArgs>>): Prisma__AnalysisClient<$Result.GetResult<Prisma.$AnalysisPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Analysis that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AnalysisFindUniqueOrThrowArgs} args - Arguments to find a Analysis
     * @example
     * // Get one Analysis
     * const analysis = await prisma.analysis.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AnalysisFindUniqueOrThrowArgs>(args: SelectSubset<T, AnalysisFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AnalysisClient<$Result.GetResult<Prisma.$AnalysisPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Analysis that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnalysisFindFirstArgs} args - Arguments to find a Analysis
     * @example
     * // Get one Analysis
     * const analysis = await prisma.analysis.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AnalysisFindFirstArgs>(args?: SelectSubset<T, AnalysisFindFirstArgs<ExtArgs>>): Prisma__AnalysisClient<$Result.GetResult<Prisma.$AnalysisPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Analysis that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnalysisFindFirstOrThrowArgs} args - Arguments to find a Analysis
     * @example
     * // Get one Analysis
     * const analysis = await prisma.analysis.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AnalysisFindFirstOrThrowArgs>(args?: SelectSubset<T, AnalysisFindFirstOrThrowArgs<ExtArgs>>): Prisma__AnalysisClient<$Result.GetResult<Prisma.$AnalysisPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Analyses that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnalysisFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Analyses
     * const analyses = await prisma.analysis.findMany()
     * 
     * // Get first 10 Analyses
     * const analyses = await prisma.analysis.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const analysisWithIdOnly = await prisma.analysis.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AnalysisFindManyArgs>(args?: SelectSubset<T, AnalysisFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AnalysisPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Analysis.
     * @param {AnalysisCreateArgs} args - Arguments to create a Analysis.
     * @example
     * // Create one Analysis
     * const Analysis = await prisma.analysis.create({
     *   data: {
     *     // ... data to create a Analysis
     *   }
     * })
     * 
     */
    create<T extends AnalysisCreateArgs>(args: SelectSubset<T, AnalysisCreateArgs<ExtArgs>>): Prisma__AnalysisClient<$Result.GetResult<Prisma.$AnalysisPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Analyses.
     * @param {AnalysisCreateManyArgs} args - Arguments to create many Analyses.
     * @example
     * // Create many Analyses
     * const analysis = await prisma.analysis.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AnalysisCreateManyArgs>(args?: SelectSubset<T, AnalysisCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Analyses and returns the data saved in the database.
     * @param {AnalysisCreateManyAndReturnArgs} args - Arguments to create many Analyses.
     * @example
     * // Create many Analyses
     * const analysis = await prisma.analysis.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Analyses and only return the `id`
     * const analysisWithIdOnly = await prisma.analysis.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AnalysisCreateManyAndReturnArgs>(args?: SelectSubset<T, AnalysisCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AnalysisPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Analysis.
     * @param {AnalysisDeleteArgs} args - Arguments to delete one Analysis.
     * @example
     * // Delete one Analysis
     * const Analysis = await prisma.analysis.delete({
     *   where: {
     *     // ... filter to delete one Analysis
     *   }
     * })
     * 
     */
    delete<T extends AnalysisDeleteArgs>(args: SelectSubset<T, AnalysisDeleteArgs<ExtArgs>>): Prisma__AnalysisClient<$Result.GetResult<Prisma.$AnalysisPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Analysis.
     * @param {AnalysisUpdateArgs} args - Arguments to update one Analysis.
     * @example
     * // Update one Analysis
     * const analysis = await prisma.analysis.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AnalysisUpdateArgs>(args: SelectSubset<T, AnalysisUpdateArgs<ExtArgs>>): Prisma__AnalysisClient<$Result.GetResult<Prisma.$AnalysisPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Analyses.
     * @param {AnalysisDeleteManyArgs} args - Arguments to filter Analyses to delete.
     * @example
     * // Delete a few Analyses
     * const { count } = await prisma.analysis.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AnalysisDeleteManyArgs>(args?: SelectSubset<T, AnalysisDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Analyses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnalysisUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Analyses
     * const analysis = await prisma.analysis.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AnalysisUpdateManyArgs>(args: SelectSubset<T, AnalysisUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Analyses and returns the data updated in the database.
     * @param {AnalysisUpdateManyAndReturnArgs} args - Arguments to update many Analyses.
     * @example
     * // Update many Analyses
     * const analysis = await prisma.analysis.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Analyses and only return the `id`
     * const analysisWithIdOnly = await prisma.analysis.updateManyAndReturn({
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
    updateManyAndReturn<T extends AnalysisUpdateManyAndReturnArgs>(args: SelectSubset<T, AnalysisUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AnalysisPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Analysis.
     * @param {AnalysisUpsertArgs} args - Arguments to update or create a Analysis.
     * @example
     * // Update or create a Analysis
     * const analysis = await prisma.analysis.upsert({
     *   create: {
     *     // ... data to create a Analysis
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Analysis we want to update
     *   }
     * })
     */
    upsert<T extends AnalysisUpsertArgs>(args: SelectSubset<T, AnalysisUpsertArgs<ExtArgs>>): Prisma__AnalysisClient<$Result.GetResult<Prisma.$AnalysisPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Analyses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnalysisCountArgs} args - Arguments to filter Analyses to count.
     * @example
     * // Count the number of Analyses
     * const count = await prisma.analysis.count({
     *   where: {
     *     // ... the filter for the Analyses we want to count
     *   }
     * })
    **/
    count<T extends AnalysisCountArgs>(
      args?: Subset<T, AnalysisCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AnalysisCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Analysis.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnalysisAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends AnalysisAggregateArgs>(args: Subset<T, AnalysisAggregateArgs>): Prisma.PrismaPromise<GetAnalysisAggregateType<T>>

    /**
     * Group by Analysis.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnalysisGroupByArgs} args - Group by arguments.
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
      T extends AnalysisGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AnalysisGroupByArgs['orderBy'] }
        : { orderBy?: AnalysisGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, AnalysisGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAnalysisGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Analysis model
   */
  readonly fields: AnalysisFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Analysis.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AnalysisClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
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
   * Fields of the Analysis model
   */
  interface AnalysisFieldRefs {
    readonly id: FieldRef<"Analysis", 'String'>
    readonly sessionId: FieldRef<"Analysis", 'String'>
    readonly overallScore: FieldRef<"Analysis", 'Int'>
    readonly communicationScore: FieldRef<"Analysis", 'Int'>
    readonly technicalScore: FieldRef<"Analysis", 'Int'>
    readonly confidenceScore: FieldRef<"Analysis", 'Int'>
    readonly structureScore: FieldRef<"Analysis", 'Int'>
    readonly confidenceMeterScore: FieldRef<"Analysis", 'Int'>
    readonly confidenceSignals: FieldRef<"Analysis", 'Json'>
    readonly eyeContactScore: FieldRef<"Analysis", 'Int'>
    readonly presenceScore: FieldRef<"Analysis", 'Int'>
    readonly summary: FieldRef<"Analysis", 'String'>
    readonly strengths: FieldRef<"Analysis", 'String[]'>
    readonly improvements: FieldRef<"Analysis", 'String[]'>
    readonly actionableTips: FieldRef<"Analysis", 'Json'>
    readonly readinessVerdict: FieldRef<"Analysis", 'String'>
    readonly createdAt: FieldRef<"Analysis", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Analysis findUnique
   */
  export type AnalysisFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Analysis
     */
    select?: AnalysisSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Analysis
     */
    omit?: AnalysisOmit<ExtArgs> | null
    /**
     * Filter, which Analysis to fetch.
     */
    where: AnalysisWhereUniqueInput
  }

  /**
   * Analysis findUniqueOrThrow
   */
  export type AnalysisFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Analysis
     */
    select?: AnalysisSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Analysis
     */
    omit?: AnalysisOmit<ExtArgs> | null
    /**
     * Filter, which Analysis to fetch.
     */
    where: AnalysisWhereUniqueInput
  }

  /**
   * Analysis findFirst
   */
  export type AnalysisFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Analysis
     */
    select?: AnalysisSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Analysis
     */
    omit?: AnalysisOmit<ExtArgs> | null
    /**
     * Filter, which Analysis to fetch.
     */
    where?: AnalysisWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Analyses to fetch.
     */
    orderBy?: AnalysisOrderByWithRelationInput | AnalysisOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Analyses.
     */
    cursor?: AnalysisWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Analyses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Analyses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Analyses.
     */
    distinct?: AnalysisScalarFieldEnum | AnalysisScalarFieldEnum[]
  }

  /**
   * Analysis findFirstOrThrow
   */
  export type AnalysisFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Analysis
     */
    select?: AnalysisSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Analysis
     */
    omit?: AnalysisOmit<ExtArgs> | null
    /**
     * Filter, which Analysis to fetch.
     */
    where?: AnalysisWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Analyses to fetch.
     */
    orderBy?: AnalysisOrderByWithRelationInput | AnalysisOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Analyses.
     */
    cursor?: AnalysisWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Analyses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Analyses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Analyses.
     */
    distinct?: AnalysisScalarFieldEnum | AnalysisScalarFieldEnum[]
  }

  /**
   * Analysis findMany
   */
  export type AnalysisFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Analysis
     */
    select?: AnalysisSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Analysis
     */
    omit?: AnalysisOmit<ExtArgs> | null
    /**
     * Filter, which Analyses to fetch.
     */
    where?: AnalysisWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Analyses to fetch.
     */
    orderBy?: AnalysisOrderByWithRelationInput | AnalysisOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Analyses.
     */
    cursor?: AnalysisWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Analyses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Analyses.
     */
    skip?: number
    distinct?: AnalysisScalarFieldEnum | AnalysisScalarFieldEnum[]
  }

  /**
   * Analysis create
   */
  export type AnalysisCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Analysis
     */
    select?: AnalysisSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Analysis
     */
    omit?: AnalysisOmit<ExtArgs> | null
    /**
     * The data needed to create a Analysis.
     */
    data: XOR<AnalysisCreateInput, AnalysisUncheckedCreateInput>
  }

  /**
   * Analysis createMany
   */
  export type AnalysisCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Analyses.
     */
    data: AnalysisCreateManyInput | AnalysisCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Analysis createManyAndReturn
   */
  export type AnalysisCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Analysis
     */
    select?: AnalysisSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Analysis
     */
    omit?: AnalysisOmit<ExtArgs> | null
    /**
     * The data used to create many Analyses.
     */
    data: AnalysisCreateManyInput | AnalysisCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Analysis update
   */
  export type AnalysisUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Analysis
     */
    select?: AnalysisSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Analysis
     */
    omit?: AnalysisOmit<ExtArgs> | null
    /**
     * The data needed to update a Analysis.
     */
    data: XOR<AnalysisUpdateInput, AnalysisUncheckedUpdateInput>
    /**
     * Choose, which Analysis to update.
     */
    where: AnalysisWhereUniqueInput
  }

  /**
   * Analysis updateMany
   */
  export type AnalysisUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Analyses.
     */
    data: XOR<AnalysisUpdateManyMutationInput, AnalysisUncheckedUpdateManyInput>
    /**
     * Filter which Analyses to update
     */
    where?: AnalysisWhereInput
    /**
     * Limit how many Analyses to update.
     */
    limit?: number
  }

  /**
   * Analysis updateManyAndReturn
   */
  export type AnalysisUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Analysis
     */
    select?: AnalysisSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Analysis
     */
    omit?: AnalysisOmit<ExtArgs> | null
    /**
     * The data used to update Analyses.
     */
    data: XOR<AnalysisUpdateManyMutationInput, AnalysisUncheckedUpdateManyInput>
    /**
     * Filter which Analyses to update
     */
    where?: AnalysisWhereInput
    /**
     * Limit how many Analyses to update.
     */
    limit?: number
  }

  /**
   * Analysis upsert
   */
  export type AnalysisUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Analysis
     */
    select?: AnalysisSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Analysis
     */
    omit?: AnalysisOmit<ExtArgs> | null
    /**
     * The filter to search for the Analysis to update in case it exists.
     */
    where: AnalysisWhereUniqueInput
    /**
     * In case the Analysis found by the `where` argument doesn't exist, create a new Analysis with this data.
     */
    create: XOR<AnalysisCreateInput, AnalysisUncheckedCreateInput>
    /**
     * In case the Analysis was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AnalysisUpdateInput, AnalysisUncheckedUpdateInput>
  }

  /**
   * Analysis delete
   */
  export type AnalysisDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Analysis
     */
    select?: AnalysisSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Analysis
     */
    omit?: AnalysisOmit<ExtArgs> | null
    /**
     * Filter which Analysis to delete.
     */
    where: AnalysisWhereUniqueInput
  }

  /**
   * Analysis deleteMany
   */
  export type AnalysisDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Analyses to delete
     */
    where?: AnalysisWhereInput
    /**
     * Limit how many Analyses to delete.
     */
    limit?: number
  }

  /**
   * Analysis without action
   */
  export type AnalysisDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Analysis
     */
    select?: AnalysisSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Analysis
     */
    omit?: AnalysisOmit<ExtArgs> | null
  }


  /**
   * Model TelemetryLog
   */

  export type AggregateTelemetryLog = {
    _count: TelemetryLogCountAggregateOutputType | null
    _avg: TelemetryLogAvgAggregateOutputType | null
    _sum: TelemetryLogSumAggregateOutputType | null
    _min: TelemetryLogMinAggregateOutputType | null
    _max: TelemetryLogMaxAggregateOutputType | null
  }

  export type TelemetryLogAvgAggregateOutputType = {
    wordsPerMinute: number | null
    fillerWordsCount: number | null
    stressCoefficient: number | null
  }

  export type TelemetryLogSumAggregateOutputType = {
    wordsPerMinute: number | null
    fillerWordsCount: number | null
    stressCoefficient: number | null
  }

  export type TelemetryLogMinAggregateOutputType = {
    id: string | null
    sessionId: string | null
    type: string | null
    wordsPerMinute: number | null
    fillerWordsCount: number | null
    stressCoefficient: number | null
    timestamp: Date | null
  }

  export type TelemetryLogMaxAggregateOutputType = {
    id: string | null
    sessionId: string | null
    type: string | null
    wordsPerMinute: number | null
    fillerWordsCount: number | null
    stressCoefficient: number | null
    timestamp: Date | null
  }

  export type TelemetryLogCountAggregateOutputType = {
    id: number
    sessionId: number
    type: number
    wordsPerMinute: number
    fillerWordsCount: number
    stressCoefficient: number
    timestamp: number
    _all: number
  }


  export type TelemetryLogAvgAggregateInputType = {
    wordsPerMinute?: true
    fillerWordsCount?: true
    stressCoefficient?: true
  }

  export type TelemetryLogSumAggregateInputType = {
    wordsPerMinute?: true
    fillerWordsCount?: true
    stressCoefficient?: true
  }

  export type TelemetryLogMinAggregateInputType = {
    id?: true
    sessionId?: true
    type?: true
    wordsPerMinute?: true
    fillerWordsCount?: true
    stressCoefficient?: true
    timestamp?: true
  }

  export type TelemetryLogMaxAggregateInputType = {
    id?: true
    sessionId?: true
    type?: true
    wordsPerMinute?: true
    fillerWordsCount?: true
    stressCoefficient?: true
    timestamp?: true
  }

  export type TelemetryLogCountAggregateInputType = {
    id?: true
    sessionId?: true
    type?: true
    wordsPerMinute?: true
    fillerWordsCount?: true
    stressCoefficient?: true
    timestamp?: true
    _all?: true
  }

  export type TelemetryLogAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TelemetryLog to aggregate.
     */
    where?: TelemetryLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TelemetryLogs to fetch.
     */
    orderBy?: TelemetryLogOrderByWithRelationInput | TelemetryLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TelemetryLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TelemetryLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TelemetryLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned TelemetryLogs
    **/
    _count?: true | TelemetryLogCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TelemetryLogAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TelemetryLogSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TelemetryLogMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TelemetryLogMaxAggregateInputType
  }

  export type GetTelemetryLogAggregateType<T extends TelemetryLogAggregateArgs> = {
        [P in keyof T & keyof AggregateTelemetryLog]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTelemetryLog[P]>
      : GetScalarType<T[P], AggregateTelemetryLog[P]>
  }




  export type TelemetryLogGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TelemetryLogWhereInput
    orderBy?: TelemetryLogOrderByWithAggregationInput | TelemetryLogOrderByWithAggregationInput[]
    by: TelemetryLogScalarFieldEnum[] | TelemetryLogScalarFieldEnum
    having?: TelemetryLogScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TelemetryLogCountAggregateInputType | true
    _avg?: TelemetryLogAvgAggregateInputType
    _sum?: TelemetryLogSumAggregateInputType
    _min?: TelemetryLogMinAggregateInputType
    _max?: TelemetryLogMaxAggregateInputType
  }

  export type TelemetryLogGroupByOutputType = {
    id: string
    sessionId: string
    type: string
    wordsPerMinute: number | null
    fillerWordsCount: number | null
    stressCoefficient: number | null
    timestamp: Date
    _count: TelemetryLogCountAggregateOutputType | null
    _avg: TelemetryLogAvgAggregateOutputType | null
    _sum: TelemetryLogSumAggregateOutputType | null
    _min: TelemetryLogMinAggregateOutputType | null
    _max: TelemetryLogMaxAggregateOutputType | null
  }

  type GetTelemetryLogGroupByPayload<T extends TelemetryLogGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TelemetryLogGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TelemetryLogGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TelemetryLogGroupByOutputType[P]>
            : GetScalarType<T[P], TelemetryLogGroupByOutputType[P]>
        }
      >
    >


  export type TelemetryLogSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sessionId?: boolean
    type?: boolean
    wordsPerMinute?: boolean
    fillerWordsCount?: boolean
    stressCoefficient?: boolean
    timestamp?: boolean
  }, ExtArgs["result"]["telemetryLog"]>

  export type TelemetryLogSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sessionId?: boolean
    type?: boolean
    wordsPerMinute?: boolean
    fillerWordsCount?: boolean
    stressCoefficient?: boolean
    timestamp?: boolean
  }, ExtArgs["result"]["telemetryLog"]>

  export type TelemetryLogSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sessionId?: boolean
    type?: boolean
    wordsPerMinute?: boolean
    fillerWordsCount?: boolean
    stressCoefficient?: boolean
    timestamp?: boolean
  }, ExtArgs["result"]["telemetryLog"]>

  export type TelemetryLogSelectScalar = {
    id?: boolean
    sessionId?: boolean
    type?: boolean
    wordsPerMinute?: boolean
    fillerWordsCount?: boolean
    stressCoefficient?: boolean
    timestamp?: boolean
  }

  export type TelemetryLogOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "sessionId" | "type" | "wordsPerMinute" | "fillerWordsCount" | "stressCoefficient" | "timestamp", ExtArgs["result"]["telemetryLog"]>

  export type $TelemetryLogPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "TelemetryLog"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      sessionId: string
      type: string
      wordsPerMinute: number | null
      fillerWordsCount: number | null
      stressCoefficient: number | null
      timestamp: Date
    }, ExtArgs["result"]["telemetryLog"]>
    composites: {}
  }

  type TelemetryLogGetPayload<S extends boolean | null | undefined | TelemetryLogDefaultArgs> = $Result.GetResult<Prisma.$TelemetryLogPayload, S>

  type TelemetryLogCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TelemetryLogFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TelemetryLogCountAggregateInputType | true
    }

  export interface TelemetryLogDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['TelemetryLog'], meta: { name: 'TelemetryLog' } }
    /**
     * Find zero or one TelemetryLog that matches the filter.
     * @param {TelemetryLogFindUniqueArgs} args - Arguments to find a TelemetryLog
     * @example
     * // Get one TelemetryLog
     * const telemetryLog = await prisma.telemetryLog.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TelemetryLogFindUniqueArgs>(args: SelectSubset<T, TelemetryLogFindUniqueArgs<ExtArgs>>): Prisma__TelemetryLogClient<$Result.GetResult<Prisma.$TelemetryLogPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one TelemetryLog that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TelemetryLogFindUniqueOrThrowArgs} args - Arguments to find a TelemetryLog
     * @example
     * // Get one TelemetryLog
     * const telemetryLog = await prisma.telemetryLog.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TelemetryLogFindUniqueOrThrowArgs>(args: SelectSubset<T, TelemetryLogFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TelemetryLogClient<$Result.GetResult<Prisma.$TelemetryLogPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TelemetryLog that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TelemetryLogFindFirstArgs} args - Arguments to find a TelemetryLog
     * @example
     * // Get one TelemetryLog
     * const telemetryLog = await prisma.telemetryLog.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TelemetryLogFindFirstArgs>(args?: SelectSubset<T, TelemetryLogFindFirstArgs<ExtArgs>>): Prisma__TelemetryLogClient<$Result.GetResult<Prisma.$TelemetryLogPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TelemetryLog that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TelemetryLogFindFirstOrThrowArgs} args - Arguments to find a TelemetryLog
     * @example
     * // Get one TelemetryLog
     * const telemetryLog = await prisma.telemetryLog.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TelemetryLogFindFirstOrThrowArgs>(args?: SelectSubset<T, TelemetryLogFindFirstOrThrowArgs<ExtArgs>>): Prisma__TelemetryLogClient<$Result.GetResult<Prisma.$TelemetryLogPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more TelemetryLogs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TelemetryLogFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TelemetryLogs
     * const telemetryLogs = await prisma.telemetryLog.findMany()
     * 
     * // Get first 10 TelemetryLogs
     * const telemetryLogs = await prisma.telemetryLog.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const telemetryLogWithIdOnly = await prisma.telemetryLog.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TelemetryLogFindManyArgs>(args?: SelectSubset<T, TelemetryLogFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TelemetryLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a TelemetryLog.
     * @param {TelemetryLogCreateArgs} args - Arguments to create a TelemetryLog.
     * @example
     * // Create one TelemetryLog
     * const TelemetryLog = await prisma.telemetryLog.create({
     *   data: {
     *     // ... data to create a TelemetryLog
     *   }
     * })
     * 
     */
    create<T extends TelemetryLogCreateArgs>(args: SelectSubset<T, TelemetryLogCreateArgs<ExtArgs>>): Prisma__TelemetryLogClient<$Result.GetResult<Prisma.$TelemetryLogPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many TelemetryLogs.
     * @param {TelemetryLogCreateManyArgs} args - Arguments to create many TelemetryLogs.
     * @example
     * // Create many TelemetryLogs
     * const telemetryLog = await prisma.telemetryLog.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TelemetryLogCreateManyArgs>(args?: SelectSubset<T, TelemetryLogCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many TelemetryLogs and returns the data saved in the database.
     * @param {TelemetryLogCreateManyAndReturnArgs} args - Arguments to create many TelemetryLogs.
     * @example
     * // Create many TelemetryLogs
     * const telemetryLog = await prisma.telemetryLog.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many TelemetryLogs and only return the `id`
     * const telemetryLogWithIdOnly = await prisma.telemetryLog.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TelemetryLogCreateManyAndReturnArgs>(args?: SelectSubset<T, TelemetryLogCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TelemetryLogPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a TelemetryLog.
     * @param {TelemetryLogDeleteArgs} args - Arguments to delete one TelemetryLog.
     * @example
     * // Delete one TelemetryLog
     * const TelemetryLog = await prisma.telemetryLog.delete({
     *   where: {
     *     // ... filter to delete one TelemetryLog
     *   }
     * })
     * 
     */
    delete<T extends TelemetryLogDeleteArgs>(args: SelectSubset<T, TelemetryLogDeleteArgs<ExtArgs>>): Prisma__TelemetryLogClient<$Result.GetResult<Prisma.$TelemetryLogPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one TelemetryLog.
     * @param {TelemetryLogUpdateArgs} args - Arguments to update one TelemetryLog.
     * @example
     * // Update one TelemetryLog
     * const telemetryLog = await prisma.telemetryLog.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TelemetryLogUpdateArgs>(args: SelectSubset<T, TelemetryLogUpdateArgs<ExtArgs>>): Prisma__TelemetryLogClient<$Result.GetResult<Prisma.$TelemetryLogPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more TelemetryLogs.
     * @param {TelemetryLogDeleteManyArgs} args - Arguments to filter TelemetryLogs to delete.
     * @example
     * // Delete a few TelemetryLogs
     * const { count } = await prisma.telemetryLog.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TelemetryLogDeleteManyArgs>(args?: SelectSubset<T, TelemetryLogDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TelemetryLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TelemetryLogUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TelemetryLogs
     * const telemetryLog = await prisma.telemetryLog.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TelemetryLogUpdateManyArgs>(args: SelectSubset<T, TelemetryLogUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TelemetryLogs and returns the data updated in the database.
     * @param {TelemetryLogUpdateManyAndReturnArgs} args - Arguments to update many TelemetryLogs.
     * @example
     * // Update many TelemetryLogs
     * const telemetryLog = await prisma.telemetryLog.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more TelemetryLogs and only return the `id`
     * const telemetryLogWithIdOnly = await prisma.telemetryLog.updateManyAndReturn({
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
    updateManyAndReturn<T extends TelemetryLogUpdateManyAndReturnArgs>(args: SelectSubset<T, TelemetryLogUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TelemetryLogPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one TelemetryLog.
     * @param {TelemetryLogUpsertArgs} args - Arguments to update or create a TelemetryLog.
     * @example
     * // Update or create a TelemetryLog
     * const telemetryLog = await prisma.telemetryLog.upsert({
     *   create: {
     *     // ... data to create a TelemetryLog
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TelemetryLog we want to update
     *   }
     * })
     */
    upsert<T extends TelemetryLogUpsertArgs>(args: SelectSubset<T, TelemetryLogUpsertArgs<ExtArgs>>): Prisma__TelemetryLogClient<$Result.GetResult<Prisma.$TelemetryLogPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of TelemetryLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TelemetryLogCountArgs} args - Arguments to filter TelemetryLogs to count.
     * @example
     * // Count the number of TelemetryLogs
     * const count = await prisma.telemetryLog.count({
     *   where: {
     *     // ... the filter for the TelemetryLogs we want to count
     *   }
     * })
    **/
    count<T extends TelemetryLogCountArgs>(
      args?: Subset<T, TelemetryLogCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TelemetryLogCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TelemetryLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TelemetryLogAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends TelemetryLogAggregateArgs>(args: Subset<T, TelemetryLogAggregateArgs>): Prisma.PrismaPromise<GetTelemetryLogAggregateType<T>>

    /**
     * Group by TelemetryLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TelemetryLogGroupByArgs} args - Group by arguments.
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
      T extends TelemetryLogGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TelemetryLogGroupByArgs['orderBy'] }
        : { orderBy?: TelemetryLogGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, TelemetryLogGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTelemetryLogGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the TelemetryLog model
   */
  readonly fields: TelemetryLogFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for TelemetryLog.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TelemetryLogClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
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
   * Fields of the TelemetryLog model
   */
  interface TelemetryLogFieldRefs {
    readonly id: FieldRef<"TelemetryLog", 'String'>
    readonly sessionId: FieldRef<"TelemetryLog", 'String'>
    readonly type: FieldRef<"TelemetryLog", 'String'>
    readonly wordsPerMinute: FieldRef<"TelemetryLog", 'Int'>
    readonly fillerWordsCount: FieldRef<"TelemetryLog", 'Int'>
    readonly stressCoefficient: FieldRef<"TelemetryLog", 'Float'>
    readonly timestamp: FieldRef<"TelemetryLog", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * TelemetryLog findUnique
   */
  export type TelemetryLogFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TelemetryLog
     */
    select?: TelemetryLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TelemetryLog
     */
    omit?: TelemetryLogOmit<ExtArgs> | null
    /**
     * Filter, which TelemetryLog to fetch.
     */
    where: TelemetryLogWhereUniqueInput
  }

  /**
   * TelemetryLog findUniqueOrThrow
   */
  export type TelemetryLogFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TelemetryLog
     */
    select?: TelemetryLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TelemetryLog
     */
    omit?: TelemetryLogOmit<ExtArgs> | null
    /**
     * Filter, which TelemetryLog to fetch.
     */
    where: TelemetryLogWhereUniqueInput
  }

  /**
   * TelemetryLog findFirst
   */
  export type TelemetryLogFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TelemetryLog
     */
    select?: TelemetryLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TelemetryLog
     */
    omit?: TelemetryLogOmit<ExtArgs> | null
    /**
     * Filter, which TelemetryLog to fetch.
     */
    where?: TelemetryLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TelemetryLogs to fetch.
     */
    orderBy?: TelemetryLogOrderByWithRelationInput | TelemetryLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TelemetryLogs.
     */
    cursor?: TelemetryLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TelemetryLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TelemetryLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TelemetryLogs.
     */
    distinct?: TelemetryLogScalarFieldEnum | TelemetryLogScalarFieldEnum[]
  }

  /**
   * TelemetryLog findFirstOrThrow
   */
  export type TelemetryLogFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TelemetryLog
     */
    select?: TelemetryLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TelemetryLog
     */
    omit?: TelemetryLogOmit<ExtArgs> | null
    /**
     * Filter, which TelemetryLog to fetch.
     */
    where?: TelemetryLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TelemetryLogs to fetch.
     */
    orderBy?: TelemetryLogOrderByWithRelationInput | TelemetryLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TelemetryLogs.
     */
    cursor?: TelemetryLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TelemetryLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TelemetryLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TelemetryLogs.
     */
    distinct?: TelemetryLogScalarFieldEnum | TelemetryLogScalarFieldEnum[]
  }

  /**
   * TelemetryLog findMany
   */
  export type TelemetryLogFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TelemetryLog
     */
    select?: TelemetryLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TelemetryLog
     */
    omit?: TelemetryLogOmit<ExtArgs> | null
    /**
     * Filter, which TelemetryLogs to fetch.
     */
    where?: TelemetryLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TelemetryLogs to fetch.
     */
    orderBy?: TelemetryLogOrderByWithRelationInput | TelemetryLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing TelemetryLogs.
     */
    cursor?: TelemetryLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TelemetryLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TelemetryLogs.
     */
    skip?: number
    distinct?: TelemetryLogScalarFieldEnum | TelemetryLogScalarFieldEnum[]
  }

  /**
   * TelemetryLog create
   */
  export type TelemetryLogCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TelemetryLog
     */
    select?: TelemetryLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TelemetryLog
     */
    omit?: TelemetryLogOmit<ExtArgs> | null
    /**
     * The data needed to create a TelemetryLog.
     */
    data: XOR<TelemetryLogCreateInput, TelemetryLogUncheckedCreateInput>
  }

  /**
   * TelemetryLog createMany
   */
  export type TelemetryLogCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many TelemetryLogs.
     */
    data: TelemetryLogCreateManyInput | TelemetryLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * TelemetryLog createManyAndReturn
   */
  export type TelemetryLogCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TelemetryLog
     */
    select?: TelemetryLogSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TelemetryLog
     */
    omit?: TelemetryLogOmit<ExtArgs> | null
    /**
     * The data used to create many TelemetryLogs.
     */
    data: TelemetryLogCreateManyInput | TelemetryLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * TelemetryLog update
   */
  export type TelemetryLogUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TelemetryLog
     */
    select?: TelemetryLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TelemetryLog
     */
    omit?: TelemetryLogOmit<ExtArgs> | null
    /**
     * The data needed to update a TelemetryLog.
     */
    data: XOR<TelemetryLogUpdateInput, TelemetryLogUncheckedUpdateInput>
    /**
     * Choose, which TelemetryLog to update.
     */
    where: TelemetryLogWhereUniqueInput
  }

  /**
   * TelemetryLog updateMany
   */
  export type TelemetryLogUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update TelemetryLogs.
     */
    data: XOR<TelemetryLogUpdateManyMutationInput, TelemetryLogUncheckedUpdateManyInput>
    /**
     * Filter which TelemetryLogs to update
     */
    where?: TelemetryLogWhereInput
    /**
     * Limit how many TelemetryLogs to update.
     */
    limit?: number
  }

  /**
   * TelemetryLog updateManyAndReturn
   */
  export type TelemetryLogUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TelemetryLog
     */
    select?: TelemetryLogSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TelemetryLog
     */
    omit?: TelemetryLogOmit<ExtArgs> | null
    /**
     * The data used to update TelemetryLogs.
     */
    data: XOR<TelemetryLogUpdateManyMutationInput, TelemetryLogUncheckedUpdateManyInput>
    /**
     * Filter which TelemetryLogs to update
     */
    where?: TelemetryLogWhereInput
    /**
     * Limit how many TelemetryLogs to update.
     */
    limit?: number
  }

  /**
   * TelemetryLog upsert
   */
  export type TelemetryLogUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TelemetryLog
     */
    select?: TelemetryLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TelemetryLog
     */
    omit?: TelemetryLogOmit<ExtArgs> | null
    /**
     * The filter to search for the TelemetryLog to update in case it exists.
     */
    where: TelemetryLogWhereUniqueInput
    /**
     * In case the TelemetryLog found by the `where` argument doesn't exist, create a new TelemetryLog with this data.
     */
    create: XOR<TelemetryLogCreateInput, TelemetryLogUncheckedCreateInput>
    /**
     * In case the TelemetryLog was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TelemetryLogUpdateInput, TelemetryLogUncheckedUpdateInput>
  }

  /**
   * TelemetryLog delete
   */
  export type TelemetryLogDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TelemetryLog
     */
    select?: TelemetryLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TelemetryLog
     */
    omit?: TelemetryLogOmit<ExtArgs> | null
    /**
     * Filter which TelemetryLog to delete.
     */
    where: TelemetryLogWhereUniqueInput
  }

  /**
   * TelemetryLog deleteMany
   */
  export type TelemetryLogDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TelemetryLogs to delete
     */
    where?: TelemetryLogWhereInput
    /**
     * Limit how many TelemetryLogs to delete.
     */
    limit?: number
  }

  /**
   * TelemetryLog without action
   */
  export type TelemetryLogDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TelemetryLog
     */
    select?: TelemetryLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TelemetryLog
     */
    omit?: TelemetryLogOmit<ExtArgs> | null
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


  export const AnalysisScalarFieldEnum: {
    id: 'id',
    sessionId: 'sessionId',
    overallScore: 'overallScore',
    communicationScore: 'communicationScore',
    technicalScore: 'technicalScore',
    confidenceScore: 'confidenceScore',
    structureScore: 'structureScore',
    confidenceMeterScore: 'confidenceMeterScore',
    confidenceSignals: 'confidenceSignals',
    eyeContactScore: 'eyeContactScore',
    presenceScore: 'presenceScore',
    summary: 'summary',
    strengths: 'strengths',
    improvements: 'improvements',
    actionableTips: 'actionableTips',
    readinessVerdict: 'readinessVerdict',
    createdAt: 'createdAt'
  };

  export type AnalysisScalarFieldEnum = (typeof AnalysisScalarFieldEnum)[keyof typeof AnalysisScalarFieldEnum]


  export const TelemetryLogScalarFieldEnum: {
    id: 'id',
    sessionId: 'sessionId',
    type: 'type',
    wordsPerMinute: 'wordsPerMinute',
    fillerWordsCount: 'fillerWordsCount',
    stressCoefficient: 'stressCoefficient',
    timestamp: 'timestamp'
  };

  export type TelemetryLogScalarFieldEnum = (typeof TelemetryLogScalarFieldEnum)[keyof typeof TelemetryLogScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull
  };

  export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]


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
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


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


  export type AnalysisWhereInput = {
    AND?: AnalysisWhereInput | AnalysisWhereInput[]
    OR?: AnalysisWhereInput[]
    NOT?: AnalysisWhereInput | AnalysisWhereInput[]
    id?: StringFilter<"Analysis"> | string
    sessionId?: StringFilter<"Analysis"> | string
    overallScore?: IntFilter<"Analysis"> | number
    communicationScore?: IntFilter<"Analysis"> | number
    technicalScore?: IntFilter<"Analysis"> | number
    confidenceScore?: IntFilter<"Analysis"> | number
    structureScore?: IntFilter<"Analysis"> | number
    confidenceMeterScore?: IntNullableFilter<"Analysis"> | number | null
    confidenceSignals?: JsonNullableFilter<"Analysis">
    eyeContactScore?: IntNullableFilter<"Analysis"> | number | null
    presenceScore?: IntNullableFilter<"Analysis"> | number | null
    summary?: StringFilter<"Analysis"> | string
    strengths?: StringNullableListFilter<"Analysis">
    improvements?: StringNullableListFilter<"Analysis">
    actionableTips?: JsonFilter<"Analysis">
    readinessVerdict?: StringFilter<"Analysis"> | string
    createdAt?: DateTimeFilter<"Analysis"> | Date | string
  }

  export type AnalysisOrderByWithRelationInput = {
    id?: SortOrder
    sessionId?: SortOrder
    overallScore?: SortOrder
    communicationScore?: SortOrder
    technicalScore?: SortOrder
    confidenceScore?: SortOrder
    structureScore?: SortOrder
    confidenceMeterScore?: SortOrderInput | SortOrder
    confidenceSignals?: SortOrderInput | SortOrder
    eyeContactScore?: SortOrderInput | SortOrder
    presenceScore?: SortOrderInput | SortOrder
    summary?: SortOrder
    strengths?: SortOrder
    improvements?: SortOrder
    actionableTips?: SortOrder
    readinessVerdict?: SortOrder
    createdAt?: SortOrder
  }

  export type AnalysisWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    sessionId?: string
    AND?: AnalysisWhereInput | AnalysisWhereInput[]
    OR?: AnalysisWhereInput[]
    NOT?: AnalysisWhereInput | AnalysisWhereInput[]
    overallScore?: IntFilter<"Analysis"> | number
    communicationScore?: IntFilter<"Analysis"> | number
    technicalScore?: IntFilter<"Analysis"> | number
    confidenceScore?: IntFilter<"Analysis"> | number
    structureScore?: IntFilter<"Analysis"> | number
    confidenceMeterScore?: IntNullableFilter<"Analysis"> | number | null
    confidenceSignals?: JsonNullableFilter<"Analysis">
    eyeContactScore?: IntNullableFilter<"Analysis"> | number | null
    presenceScore?: IntNullableFilter<"Analysis"> | number | null
    summary?: StringFilter<"Analysis"> | string
    strengths?: StringNullableListFilter<"Analysis">
    improvements?: StringNullableListFilter<"Analysis">
    actionableTips?: JsonFilter<"Analysis">
    readinessVerdict?: StringFilter<"Analysis"> | string
    createdAt?: DateTimeFilter<"Analysis"> | Date | string
  }, "id" | "sessionId">

  export type AnalysisOrderByWithAggregationInput = {
    id?: SortOrder
    sessionId?: SortOrder
    overallScore?: SortOrder
    communicationScore?: SortOrder
    technicalScore?: SortOrder
    confidenceScore?: SortOrder
    structureScore?: SortOrder
    confidenceMeterScore?: SortOrderInput | SortOrder
    confidenceSignals?: SortOrderInput | SortOrder
    eyeContactScore?: SortOrderInput | SortOrder
    presenceScore?: SortOrderInput | SortOrder
    summary?: SortOrder
    strengths?: SortOrder
    improvements?: SortOrder
    actionableTips?: SortOrder
    readinessVerdict?: SortOrder
    createdAt?: SortOrder
    _count?: AnalysisCountOrderByAggregateInput
    _avg?: AnalysisAvgOrderByAggregateInput
    _max?: AnalysisMaxOrderByAggregateInput
    _min?: AnalysisMinOrderByAggregateInput
    _sum?: AnalysisSumOrderByAggregateInput
  }

  export type AnalysisScalarWhereWithAggregatesInput = {
    AND?: AnalysisScalarWhereWithAggregatesInput | AnalysisScalarWhereWithAggregatesInput[]
    OR?: AnalysisScalarWhereWithAggregatesInput[]
    NOT?: AnalysisScalarWhereWithAggregatesInput | AnalysisScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Analysis"> | string
    sessionId?: StringWithAggregatesFilter<"Analysis"> | string
    overallScore?: IntWithAggregatesFilter<"Analysis"> | number
    communicationScore?: IntWithAggregatesFilter<"Analysis"> | number
    technicalScore?: IntWithAggregatesFilter<"Analysis"> | number
    confidenceScore?: IntWithAggregatesFilter<"Analysis"> | number
    structureScore?: IntWithAggregatesFilter<"Analysis"> | number
    confidenceMeterScore?: IntNullableWithAggregatesFilter<"Analysis"> | number | null
    confidenceSignals?: JsonNullableWithAggregatesFilter<"Analysis">
    eyeContactScore?: IntNullableWithAggregatesFilter<"Analysis"> | number | null
    presenceScore?: IntNullableWithAggregatesFilter<"Analysis"> | number | null
    summary?: StringWithAggregatesFilter<"Analysis"> | string
    strengths?: StringNullableListFilter<"Analysis">
    improvements?: StringNullableListFilter<"Analysis">
    actionableTips?: JsonWithAggregatesFilter<"Analysis">
    readinessVerdict?: StringWithAggregatesFilter<"Analysis"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Analysis"> | Date | string
  }

  export type TelemetryLogWhereInput = {
    AND?: TelemetryLogWhereInput | TelemetryLogWhereInput[]
    OR?: TelemetryLogWhereInput[]
    NOT?: TelemetryLogWhereInput | TelemetryLogWhereInput[]
    id?: StringFilter<"TelemetryLog"> | string
    sessionId?: StringFilter<"TelemetryLog"> | string
    type?: StringFilter<"TelemetryLog"> | string
    wordsPerMinute?: IntNullableFilter<"TelemetryLog"> | number | null
    fillerWordsCount?: IntNullableFilter<"TelemetryLog"> | number | null
    stressCoefficient?: FloatNullableFilter<"TelemetryLog"> | number | null
    timestamp?: DateTimeFilter<"TelemetryLog"> | Date | string
  }

  export type TelemetryLogOrderByWithRelationInput = {
    id?: SortOrder
    sessionId?: SortOrder
    type?: SortOrder
    wordsPerMinute?: SortOrderInput | SortOrder
    fillerWordsCount?: SortOrderInput | SortOrder
    stressCoefficient?: SortOrderInput | SortOrder
    timestamp?: SortOrder
  }

  export type TelemetryLogWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: TelemetryLogWhereInput | TelemetryLogWhereInput[]
    OR?: TelemetryLogWhereInput[]
    NOT?: TelemetryLogWhereInput | TelemetryLogWhereInput[]
    sessionId?: StringFilter<"TelemetryLog"> | string
    type?: StringFilter<"TelemetryLog"> | string
    wordsPerMinute?: IntNullableFilter<"TelemetryLog"> | number | null
    fillerWordsCount?: IntNullableFilter<"TelemetryLog"> | number | null
    stressCoefficient?: FloatNullableFilter<"TelemetryLog"> | number | null
    timestamp?: DateTimeFilter<"TelemetryLog"> | Date | string
  }, "id">

  export type TelemetryLogOrderByWithAggregationInput = {
    id?: SortOrder
    sessionId?: SortOrder
    type?: SortOrder
    wordsPerMinute?: SortOrderInput | SortOrder
    fillerWordsCount?: SortOrderInput | SortOrder
    stressCoefficient?: SortOrderInput | SortOrder
    timestamp?: SortOrder
    _count?: TelemetryLogCountOrderByAggregateInput
    _avg?: TelemetryLogAvgOrderByAggregateInput
    _max?: TelemetryLogMaxOrderByAggregateInput
    _min?: TelemetryLogMinOrderByAggregateInput
    _sum?: TelemetryLogSumOrderByAggregateInput
  }

  export type TelemetryLogScalarWhereWithAggregatesInput = {
    AND?: TelemetryLogScalarWhereWithAggregatesInput | TelemetryLogScalarWhereWithAggregatesInput[]
    OR?: TelemetryLogScalarWhereWithAggregatesInput[]
    NOT?: TelemetryLogScalarWhereWithAggregatesInput | TelemetryLogScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"TelemetryLog"> | string
    sessionId?: StringWithAggregatesFilter<"TelemetryLog"> | string
    type?: StringWithAggregatesFilter<"TelemetryLog"> | string
    wordsPerMinute?: IntNullableWithAggregatesFilter<"TelemetryLog"> | number | null
    fillerWordsCount?: IntNullableWithAggregatesFilter<"TelemetryLog"> | number | null
    stressCoefficient?: FloatNullableWithAggregatesFilter<"TelemetryLog"> | number | null
    timestamp?: DateTimeWithAggregatesFilter<"TelemetryLog"> | Date | string
  }

  export type AnalysisCreateInput = {
    id?: string
    sessionId: string
    overallScore: number
    communicationScore: number
    technicalScore: number
    confidenceScore: number
    structureScore: number
    confidenceMeterScore?: number | null
    confidenceSignals?: NullableJsonNullValueInput | InputJsonValue
    eyeContactScore?: number | null
    presenceScore?: number | null
    summary: string
    strengths?: AnalysisCreatestrengthsInput | string[]
    improvements?: AnalysisCreateimprovementsInput | string[]
    actionableTips: JsonNullValueInput | InputJsonValue
    readinessVerdict?: string
    createdAt?: Date | string
  }

  export type AnalysisUncheckedCreateInput = {
    id?: string
    sessionId: string
    overallScore: number
    communicationScore: number
    technicalScore: number
    confidenceScore: number
    structureScore: number
    confidenceMeterScore?: number | null
    confidenceSignals?: NullableJsonNullValueInput | InputJsonValue
    eyeContactScore?: number | null
    presenceScore?: number | null
    summary: string
    strengths?: AnalysisCreatestrengthsInput | string[]
    improvements?: AnalysisCreateimprovementsInput | string[]
    actionableTips: JsonNullValueInput | InputJsonValue
    readinessVerdict?: string
    createdAt?: Date | string
  }

  export type AnalysisUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionId?: StringFieldUpdateOperationsInput | string
    overallScore?: IntFieldUpdateOperationsInput | number
    communicationScore?: IntFieldUpdateOperationsInput | number
    technicalScore?: IntFieldUpdateOperationsInput | number
    confidenceScore?: IntFieldUpdateOperationsInput | number
    structureScore?: IntFieldUpdateOperationsInput | number
    confidenceMeterScore?: NullableIntFieldUpdateOperationsInput | number | null
    confidenceSignals?: NullableJsonNullValueInput | InputJsonValue
    eyeContactScore?: NullableIntFieldUpdateOperationsInput | number | null
    presenceScore?: NullableIntFieldUpdateOperationsInput | number | null
    summary?: StringFieldUpdateOperationsInput | string
    strengths?: AnalysisUpdatestrengthsInput | string[]
    improvements?: AnalysisUpdateimprovementsInput | string[]
    actionableTips?: JsonNullValueInput | InputJsonValue
    readinessVerdict?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AnalysisUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionId?: StringFieldUpdateOperationsInput | string
    overallScore?: IntFieldUpdateOperationsInput | number
    communicationScore?: IntFieldUpdateOperationsInput | number
    technicalScore?: IntFieldUpdateOperationsInput | number
    confidenceScore?: IntFieldUpdateOperationsInput | number
    structureScore?: IntFieldUpdateOperationsInput | number
    confidenceMeterScore?: NullableIntFieldUpdateOperationsInput | number | null
    confidenceSignals?: NullableJsonNullValueInput | InputJsonValue
    eyeContactScore?: NullableIntFieldUpdateOperationsInput | number | null
    presenceScore?: NullableIntFieldUpdateOperationsInput | number | null
    summary?: StringFieldUpdateOperationsInput | string
    strengths?: AnalysisUpdatestrengthsInput | string[]
    improvements?: AnalysisUpdateimprovementsInput | string[]
    actionableTips?: JsonNullValueInput | InputJsonValue
    readinessVerdict?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AnalysisCreateManyInput = {
    id?: string
    sessionId: string
    overallScore: number
    communicationScore: number
    technicalScore: number
    confidenceScore: number
    structureScore: number
    confidenceMeterScore?: number | null
    confidenceSignals?: NullableJsonNullValueInput | InputJsonValue
    eyeContactScore?: number | null
    presenceScore?: number | null
    summary: string
    strengths?: AnalysisCreatestrengthsInput | string[]
    improvements?: AnalysisCreateimprovementsInput | string[]
    actionableTips: JsonNullValueInput | InputJsonValue
    readinessVerdict?: string
    createdAt?: Date | string
  }

  export type AnalysisUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionId?: StringFieldUpdateOperationsInput | string
    overallScore?: IntFieldUpdateOperationsInput | number
    communicationScore?: IntFieldUpdateOperationsInput | number
    technicalScore?: IntFieldUpdateOperationsInput | number
    confidenceScore?: IntFieldUpdateOperationsInput | number
    structureScore?: IntFieldUpdateOperationsInput | number
    confidenceMeterScore?: NullableIntFieldUpdateOperationsInput | number | null
    confidenceSignals?: NullableJsonNullValueInput | InputJsonValue
    eyeContactScore?: NullableIntFieldUpdateOperationsInput | number | null
    presenceScore?: NullableIntFieldUpdateOperationsInput | number | null
    summary?: StringFieldUpdateOperationsInput | string
    strengths?: AnalysisUpdatestrengthsInput | string[]
    improvements?: AnalysisUpdateimprovementsInput | string[]
    actionableTips?: JsonNullValueInput | InputJsonValue
    readinessVerdict?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AnalysisUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionId?: StringFieldUpdateOperationsInput | string
    overallScore?: IntFieldUpdateOperationsInput | number
    communicationScore?: IntFieldUpdateOperationsInput | number
    technicalScore?: IntFieldUpdateOperationsInput | number
    confidenceScore?: IntFieldUpdateOperationsInput | number
    structureScore?: IntFieldUpdateOperationsInput | number
    confidenceMeterScore?: NullableIntFieldUpdateOperationsInput | number | null
    confidenceSignals?: NullableJsonNullValueInput | InputJsonValue
    eyeContactScore?: NullableIntFieldUpdateOperationsInput | number | null
    presenceScore?: NullableIntFieldUpdateOperationsInput | number | null
    summary?: StringFieldUpdateOperationsInput | string
    strengths?: AnalysisUpdatestrengthsInput | string[]
    improvements?: AnalysisUpdateimprovementsInput | string[]
    actionableTips?: JsonNullValueInput | InputJsonValue
    readinessVerdict?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TelemetryLogCreateInput = {
    id?: string
    sessionId: string
    type: string
    wordsPerMinute?: number | null
    fillerWordsCount?: number | null
    stressCoefficient?: number | null
    timestamp?: Date | string
  }

  export type TelemetryLogUncheckedCreateInput = {
    id?: string
    sessionId: string
    type: string
    wordsPerMinute?: number | null
    fillerWordsCount?: number | null
    stressCoefficient?: number | null
    timestamp?: Date | string
  }

  export type TelemetryLogUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionId?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    wordsPerMinute?: NullableIntFieldUpdateOperationsInput | number | null
    fillerWordsCount?: NullableIntFieldUpdateOperationsInput | number | null
    stressCoefficient?: NullableFloatFieldUpdateOperationsInput | number | null
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TelemetryLogUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionId?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    wordsPerMinute?: NullableIntFieldUpdateOperationsInput | number | null
    fillerWordsCount?: NullableIntFieldUpdateOperationsInput | number | null
    stressCoefficient?: NullableFloatFieldUpdateOperationsInput | number | null
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TelemetryLogCreateManyInput = {
    id?: string
    sessionId: string
    type: string
    wordsPerMinute?: number | null
    fillerWordsCount?: number | null
    stressCoefficient?: number | null
    timestamp?: Date | string
  }

  export type TelemetryLogUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionId?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    wordsPerMinute?: NullableIntFieldUpdateOperationsInput | number | null
    fillerWordsCount?: NullableIntFieldUpdateOperationsInput | number | null
    stressCoefficient?: NullableFloatFieldUpdateOperationsInput | number | null
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TelemetryLogUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionId?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    wordsPerMinute?: NullableIntFieldUpdateOperationsInput | number | null
    fillerWordsCount?: NullableIntFieldUpdateOperationsInput | number | null
    stressCoefficient?: NullableFloatFieldUpdateOperationsInput | number | null
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

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type AnalysisCountOrderByAggregateInput = {
    id?: SortOrder
    sessionId?: SortOrder
    overallScore?: SortOrder
    communicationScore?: SortOrder
    technicalScore?: SortOrder
    confidenceScore?: SortOrder
    structureScore?: SortOrder
    confidenceMeterScore?: SortOrder
    confidenceSignals?: SortOrder
    eyeContactScore?: SortOrder
    presenceScore?: SortOrder
    summary?: SortOrder
    strengths?: SortOrder
    improvements?: SortOrder
    actionableTips?: SortOrder
    readinessVerdict?: SortOrder
    createdAt?: SortOrder
  }

  export type AnalysisAvgOrderByAggregateInput = {
    overallScore?: SortOrder
    communicationScore?: SortOrder
    technicalScore?: SortOrder
    confidenceScore?: SortOrder
    structureScore?: SortOrder
    confidenceMeterScore?: SortOrder
    eyeContactScore?: SortOrder
    presenceScore?: SortOrder
  }

  export type AnalysisMaxOrderByAggregateInput = {
    id?: SortOrder
    sessionId?: SortOrder
    overallScore?: SortOrder
    communicationScore?: SortOrder
    technicalScore?: SortOrder
    confidenceScore?: SortOrder
    structureScore?: SortOrder
    confidenceMeterScore?: SortOrder
    eyeContactScore?: SortOrder
    presenceScore?: SortOrder
    summary?: SortOrder
    readinessVerdict?: SortOrder
    createdAt?: SortOrder
  }

  export type AnalysisMinOrderByAggregateInput = {
    id?: SortOrder
    sessionId?: SortOrder
    overallScore?: SortOrder
    communicationScore?: SortOrder
    technicalScore?: SortOrder
    confidenceScore?: SortOrder
    structureScore?: SortOrder
    confidenceMeterScore?: SortOrder
    eyeContactScore?: SortOrder
    presenceScore?: SortOrder
    summary?: SortOrder
    readinessVerdict?: SortOrder
    createdAt?: SortOrder
  }

  export type AnalysisSumOrderByAggregateInput = {
    overallScore?: SortOrder
    communicationScore?: SortOrder
    technicalScore?: SortOrder
    confidenceScore?: SortOrder
    structureScore?: SortOrder
    confidenceMeterScore?: SortOrder
    eyeContactScore?: SortOrder
    presenceScore?: SortOrder
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

  export type FloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type TelemetryLogCountOrderByAggregateInput = {
    id?: SortOrder
    sessionId?: SortOrder
    type?: SortOrder
    wordsPerMinute?: SortOrder
    fillerWordsCount?: SortOrder
    stressCoefficient?: SortOrder
    timestamp?: SortOrder
  }

  export type TelemetryLogAvgOrderByAggregateInput = {
    wordsPerMinute?: SortOrder
    fillerWordsCount?: SortOrder
    stressCoefficient?: SortOrder
  }

  export type TelemetryLogMaxOrderByAggregateInput = {
    id?: SortOrder
    sessionId?: SortOrder
    type?: SortOrder
    wordsPerMinute?: SortOrder
    fillerWordsCount?: SortOrder
    stressCoefficient?: SortOrder
    timestamp?: SortOrder
  }

  export type TelemetryLogMinOrderByAggregateInput = {
    id?: SortOrder
    sessionId?: SortOrder
    type?: SortOrder
    wordsPerMinute?: SortOrder
    fillerWordsCount?: SortOrder
    stressCoefficient?: SortOrder
    timestamp?: SortOrder
  }

  export type TelemetryLogSumOrderByAggregateInput = {
    wordsPerMinute?: SortOrder
    fillerWordsCount?: SortOrder
    stressCoefficient?: SortOrder
  }

  export type FloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type AnalysisCreatestrengthsInput = {
    set: string[]
  }

  export type AnalysisCreateimprovementsInput = {
    set: string[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
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

  export type AnalysisUpdatestrengthsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type AnalysisUpdateimprovementsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type NullableFloatFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
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

  export type NestedFloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
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