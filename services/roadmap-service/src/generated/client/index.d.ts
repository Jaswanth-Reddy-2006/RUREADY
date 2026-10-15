
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
 * Model Roadmap
 * 
 */
export type Roadmap = $Result.DefaultSelection<Prisma.$RoadmapPayload>
/**
 * Model RoadmapNode
 * 
 */
export type RoadmapNode = $Result.DefaultSelection<Prisma.$RoadmapNodePayload>
/**
 * Model RoadmapCollaborator
 * 
 */
export type RoadmapCollaborator = $Result.DefaultSelection<Prisma.$RoadmapCollaboratorPayload>
/**
 * Model RoadmapProgress
 * 
 */
export type RoadmapProgress = $Result.DefaultSelection<Prisma.$RoadmapProgressPayload>
/**
 * Model RoadmapTemplate
 * 
 */
export type RoadmapTemplate = $Result.DefaultSelection<Prisma.$RoadmapTemplatePayload>
/**
 * Model RoadmapShare
 * 
 */
export type RoadmapShare = $Result.DefaultSelection<Prisma.$RoadmapSharePayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Roadmaps
 * const roadmaps = await prisma.roadmap.findMany()
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
   * // Fetch zero or more Roadmaps
   * const roadmaps = await prisma.roadmap.findMany()
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
   * `prisma.roadmap`: Exposes CRUD operations for the **Roadmap** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Roadmaps
    * const roadmaps = await prisma.roadmap.findMany()
    * ```
    */
  get roadmap(): Prisma.RoadmapDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.roadmapNode`: Exposes CRUD operations for the **RoadmapNode** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more RoadmapNodes
    * const roadmapNodes = await prisma.roadmapNode.findMany()
    * ```
    */
  get roadmapNode(): Prisma.RoadmapNodeDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.roadmapCollaborator`: Exposes CRUD operations for the **RoadmapCollaborator** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more RoadmapCollaborators
    * const roadmapCollaborators = await prisma.roadmapCollaborator.findMany()
    * ```
    */
  get roadmapCollaborator(): Prisma.RoadmapCollaboratorDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.roadmapProgress`: Exposes CRUD operations for the **RoadmapProgress** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more RoadmapProgresses
    * const roadmapProgresses = await prisma.roadmapProgress.findMany()
    * ```
    */
  get roadmapProgress(): Prisma.RoadmapProgressDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.roadmapTemplate`: Exposes CRUD operations for the **RoadmapTemplate** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more RoadmapTemplates
    * const roadmapTemplates = await prisma.roadmapTemplate.findMany()
    * ```
    */
  get roadmapTemplate(): Prisma.RoadmapTemplateDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.roadmapShare`: Exposes CRUD operations for the **RoadmapShare** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more RoadmapShares
    * const roadmapShares = await prisma.roadmapShare.findMany()
    * ```
    */
  get roadmapShare(): Prisma.RoadmapShareDelegate<ExtArgs, ClientOptions>;
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
    Roadmap: 'Roadmap',
    RoadmapNode: 'RoadmapNode',
    RoadmapCollaborator: 'RoadmapCollaborator',
    RoadmapProgress: 'RoadmapProgress',
    RoadmapTemplate: 'RoadmapTemplate',
    RoadmapShare: 'RoadmapShare'
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
      modelProps: "roadmap" | "roadmapNode" | "roadmapCollaborator" | "roadmapProgress" | "roadmapTemplate" | "roadmapShare"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Roadmap: {
        payload: Prisma.$RoadmapPayload<ExtArgs>
        fields: Prisma.RoadmapFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RoadmapFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoadmapPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RoadmapFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoadmapPayload>
          }
          findFirst: {
            args: Prisma.RoadmapFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoadmapPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RoadmapFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoadmapPayload>
          }
          findMany: {
            args: Prisma.RoadmapFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoadmapPayload>[]
          }
          create: {
            args: Prisma.RoadmapCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoadmapPayload>
          }
          createMany: {
            args: Prisma.RoadmapCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.RoadmapCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoadmapPayload>[]
          }
          delete: {
            args: Prisma.RoadmapDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoadmapPayload>
          }
          update: {
            args: Prisma.RoadmapUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoadmapPayload>
          }
          deleteMany: {
            args: Prisma.RoadmapDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RoadmapUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.RoadmapUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoadmapPayload>[]
          }
          upsert: {
            args: Prisma.RoadmapUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoadmapPayload>
          }
          aggregate: {
            args: Prisma.RoadmapAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRoadmap>
          }
          groupBy: {
            args: Prisma.RoadmapGroupByArgs<ExtArgs>
            result: $Utils.Optional<RoadmapGroupByOutputType>[]
          }
          count: {
            args: Prisma.RoadmapCountArgs<ExtArgs>
            result: $Utils.Optional<RoadmapCountAggregateOutputType> | number
          }
        }
      }
      RoadmapNode: {
        payload: Prisma.$RoadmapNodePayload<ExtArgs>
        fields: Prisma.RoadmapNodeFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RoadmapNodeFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoadmapNodePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RoadmapNodeFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoadmapNodePayload>
          }
          findFirst: {
            args: Prisma.RoadmapNodeFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoadmapNodePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RoadmapNodeFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoadmapNodePayload>
          }
          findMany: {
            args: Prisma.RoadmapNodeFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoadmapNodePayload>[]
          }
          create: {
            args: Prisma.RoadmapNodeCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoadmapNodePayload>
          }
          createMany: {
            args: Prisma.RoadmapNodeCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.RoadmapNodeCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoadmapNodePayload>[]
          }
          delete: {
            args: Prisma.RoadmapNodeDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoadmapNodePayload>
          }
          update: {
            args: Prisma.RoadmapNodeUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoadmapNodePayload>
          }
          deleteMany: {
            args: Prisma.RoadmapNodeDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RoadmapNodeUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.RoadmapNodeUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoadmapNodePayload>[]
          }
          upsert: {
            args: Prisma.RoadmapNodeUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoadmapNodePayload>
          }
          aggregate: {
            args: Prisma.RoadmapNodeAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRoadmapNode>
          }
          groupBy: {
            args: Prisma.RoadmapNodeGroupByArgs<ExtArgs>
            result: $Utils.Optional<RoadmapNodeGroupByOutputType>[]
          }
          count: {
            args: Prisma.RoadmapNodeCountArgs<ExtArgs>
            result: $Utils.Optional<RoadmapNodeCountAggregateOutputType> | number
          }
        }
      }
      RoadmapCollaborator: {
        payload: Prisma.$RoadmapCollaboratorPayload<ExtArgs>
        fields: Prisma.RoadmapCollaboratorFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RoadmapCollaboratorFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoadmapCollaboratorPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RoadmapCollaboratorFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoadmapCollaboratorPayload>
          }
          findFirst: {
            args: Prisma.RoadmapCollaboratorFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoadmapCollaboratorPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RoadmapCollaboratorFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoadmapCollaboratorPayload>
          }
          findMany: {
            args: Prisma.RoadmapCollaboratorFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoadmapCollaboratorPayload>[]
          }
          create: {
            args: Prisma.RoadmapCollaboratorCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoadmapCollaboratorPayload>
          }
          createMany: {
            args: Prisma.RoadmapCollaboratorCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.RoadmapCollaboratorCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoadmapCollaboratorPayload>[]
          }
          delete: {
            args: Prisma.RoadmapCollaboratorDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoadmapCollaboratorPayload>
          }
          update: {
            args: Prisma.RoadmapCollaboratorUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoadmapCollaboratorPayload>
          }
          deleteMany: {
            args: Prisma.RoadmapCollaboratorDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RoadmapCollaboratorUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.RoadmapCollaboratorUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoadmapCollaboratorPayload>[]
          }
          upsert: {
            args: Prisma.RoadmapCollaboratorUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoadmapCollaboratorPayload>
          }
          aggregate: {
            args: Prisma.RoadmapCollaboratorAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRoadmapCollaborator>
          }
          groupBy: {
            args: Prisma.RoadmapCollaboratorGroupByArgs<ExtArgs>
            result: $Utils.Optional<RoadmapCollaboratorGroupByOutputType>[]
          }
          count: {
            args: Prisma.RoadmapCollaboratorCountArgs<ExtArgs>
            result: $Utils.Optional<RoadmapCollaboratorCountAggregateOutputType> | number
          }
        }
      }
      RoadmapProgress: {
        payload: Prisma.$RoadmapProgressPayload<ExtArgs>
        fields: Prisma.RoadmapProgressFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RoadmapProgressFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoadmapProgressPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RoadmapProgressFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoadmapProgressPayload>
          }
          findFirst: {
            args: Prisma.RoadmapProgressFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoadmapProgressPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RoadmapProgressFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoadmapProgressPayload>
          }
          findMany: {
            args: Prisma.RoadmapProgressFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoadmapProgressPayload>[]
          }
          create: {
            args: Prisma.RoadmapProgressCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoadmapProgressPayload>
          }
          createMany: {
            args: Prisma.RoadmapProgressCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.RoadmapProgressCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoadmapProgressPayload>[]
          }
          delete: {
            args: Prisma.RoadmapProgressDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoadmapProgressPayload>
          }
          update: {
            args: Prisma.RoadmapProgressUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoadmapProgressPayload>
          }
          deleteMany: {
            args: Prisma.RoadmapProgressDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RoadmapProgressUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.RoadmapProgressUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoadmapProgressPayload>[]
          }
          upsert: {
            args: Prisma.RoadmapProgressUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoadmapProgressPayload>
          }
          aggregate: {
            args: Prisma.RoadmapProgressAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRoadmapProgress>
          }
          groupBy: {
            args: Prisma.RoadmapProgressGroupByArgs<ExtArgs>
            result: $Utils.Optional<RoadmapProgressGroupByOutputType>[]
          }
          count: {
            args: Prisma.RoadmapProgressCountArgs<ExtArgs>
            result: $Utils.Optional<RoadmapProgressCountAggregateOutputType> | number
          }
        }
      }
      RoadmapTemplate: {
        payload: Prisma.$RoadmapTemplatePayload<ExtArgs>
        fields: Prisma.RoadmapTemplateFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RoadmapTemplateFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoadmapTemplatePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RoadmapTemplateFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoadmapTemplatePayload>
          }
          findFirst: {
            args: Prisma.RoadmapTemplateFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoadmapTemplatePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RoadmapTemplateFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoadmapTemplatePayload>
          }
          findMany: {
            args: Prisma.RoadmapTemplateFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoadmapTemplatePayload>[]
          }
          create: {
            args: Prisma.RoadmapTemplateCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoadmapTemplatePayload>
          }
          createMany: {
            args: Prisma.RoadmapTemplateCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.RoadmapTemplateCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoadmapTemplatePayload>[]
          }
          delete: {
            args: Prisma.RoadmapTemplateDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoadmapTemplatePayload>
          }
          update: {
            args: Prisma.RoadmapTemplateUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoadmapTemplatePayload>
          }
          deleteMany: {
            args: Prisma.RoadmapTemplateDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RoadmapTemplateUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.RoadmapTemplateUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoadmapTemplatePayload>[]
          }
          upsert: {
            args: Prisma.RoadmapTemplateUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoadmapTemplatePayload>
          }
          aggregate: {
            args: Prisma.RoadmapTemplateAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRoadmapTemplate>
          }
          groupBy: {
            args: Prisma.RoadmapTemplateGroupByArgs<ExtArgs>
            result: $Utils.Optional<RoadmapTemplateGroupByOutputType>[]
          }
          count: {
            args: Prisma.RoadmapTemplateCountArgs<ExtArgs>
            result: $Utils.Optional<RoadmapTemplateCountAggregateOutputType> | number
          }
        }
      }
      RoadmapShare: {
        payload: Prisma.$RoadmapSharePayload<ExtArgs>
        fields: Prisma.RoadmapShareFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RoadmapShareFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoadmapSharePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RoadmapShareFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoadmapSharePayload>
          }
          findFirst: {
            args: Prisma.RoadmapShareFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoadmapSharePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RoadmapShareFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoadmapSharePayload>
          }
          findMany: {
            args: Prisma.RoadmapShareFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoadmapSharePayload>[]
          }
          create: {
            args: Prisma.RoadmapShareCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoadmapSharePayload>
          }
          createMany: {
            args: Prisma.RoadmapShareCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.RoadmapShareCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoadmapSharePayload>[]
          }
          delete: {
            args: Prisma.RoadmapShareDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoadmapSharePayload>
          }
          update: {
            args: Prisma.RoadmapShareUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoadmapSharePayload>
          }
          deleteMany: {
            args: Prisma.RoadmapShareDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RoadmapShareUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.RoadmapShareUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoadmapSharePayload>[]
          }
          upsert: {
            args: Prisma.RoadmapShareUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoadmapSharePayload>
          }
          aggregate: {
            args: Prisma.RoadmapShareAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRoadmapShare>
          }
          groupBy: {
            args: Prisma.RoadmapShareGroupByArgs<ExtArgs>
            result: $Utils.Optional<RoadmapShareGroupByOutputType>[]
          }
          count: {
            args: Prisma.RoadmapShareCountArgs<ExtArgs>
            result: $Utils.Optional<RoadmapShareCountAggregateOutputType> | number
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
    roadmap?: RoadmapOmit
    roadmapNode?: RoadmapNodeOmit
    roadmapCollaborator?: RoadmapCollaboratorOmit
    roadmapProgress?: RoadmapProgressOmit
    roadmapTemplate?: RoadmapTemplateOmit
    roadmapShare?: RoadmapShareOmit
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
   * Count Type RoadmapCountOutputType
   */

  export type RoadmapCountOutputType = {
    nodes: number
    collaborators: number
    progress: number
  }

  export type RoadmapCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    nodes?: boolean | RoadmapCountOutputTypeCountNodesArgs
    collaborators?: boolean | RoadmapCountOutputTypeCountCollaboratorsArgs
    progress?: boolean | RoadmapCountOutputTypeCountProgressArgs
  }

  // Custom InputTypes
  /**
   * RoadmapCountOutputType without action
   */
  export type RoadmapCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoadmapCountOutputType
     */
    select?: RoadmapCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * RoadmapCountOutputType without action
   */
  export type RoadmapCountOutputTypeCountNodesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RoadmapNodeWhereInput
  }

  /**
   * RoadmapCountOutputType without action
   */
  export type RoadmapCountOutputTypeCountCollaboratorsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RoadmapCollaboratorWhereInput
  }

  /**
   * RoadmapCountOutputType without action
   */
  export type RoadmapCountOutputTypeCountProgressArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RoadmapProgressWhereInput
  }


  /**
   * Count Type RoadmapNodeCountOutputType
   */

  export type RoadmapNodeCountOutputType = {
    children: number
    progress: number
  }

  export type RoadmapNodeCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    children?: boolean | RoadmapNodeCountOutputTypeCountChildrenArgs
    progress?: boolean | RoadmapNodeCountOutputTypeCountProgressArgs
  }

  // Custom InputTypes
  /**
   * RoadmapNodeCountOutputType without action
   */
  export type RoadmapNodeCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoadmapNodeCountOutputType
     */
    select?: RoadmapNodeCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * RoadmapNodeCountOutputType without action
   */
  export type RoadmapNodeCountOutputTypeCountChildrenArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RoadmapNodeWhereInput
  }

  /**
   * RoadmapNodeCountOutputType without action
   */
  export type RoadmapNodeCountOutputTypeCountProgressArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RoadmapProgressWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Roadmap
   */

  export type AggregateRoadmap = {
    _count: RoadmapCountAggregateOutputType | null
    _avg: RoadmapAvgAggregateOutputType | null
    _sum: RoadmapSumAggregateOutputType | null
    _min: RoadmapMinAggregateOutputType | null
    _max: RoadmapMaxAggregateOutputType | null
  }

  export type RoadmapAvgAggregateOutputType = {
    estimatedWeeks: number | null
    cloneCount: number | null
    viewCount: number | null
  }

  export type RoadmapSumAggregateOutputType = {
    estimatedWeeks: number | null
    cloneCount: number | null
    viewCount: number | null
  }

  export type RoadmapMinAggregateOutputType = {
    id: string | null
    ownerId: string | null
    creatorName: string | null
    title: string | null
    description: string | null
    goal: string | null
    category: string | null
    difficulty: string | null
    estimatedWeeks: number | null
    cloneCount: number | null
    viewCount: number | null
    status: string | null
    isPublished: boolean | null
    publishedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type RoadmapMaxAggregateOutputType = {
    id: string | null
    ownerId: string | null
    creatorName: string | null
    title: string | null
    description: string | null
    goal: string | null
    category: string | null
    difficulty: string | null
    estimatedWeeks: number | null
    cloneCount: number | null
    viewCount: number | null
    status: string | null
    isPublished: boolean | null
    publishedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type RoadmapCountAggregateOutputType = {
    id: number
    ownerId: number
    creatorName: number
    title: number
    description: number
    goal: number
    category: number
    difficulty: number
    estimatedWeeks: number
    tags: number
    cloneCount: number
    viewCount: number
    status: number
    isPublished: number
    publishedAt: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type RoadmapAvgAggregateInputType = {
    estimatedWeeks?: true
    cloneCount?: true
    viewCount?: true
  }

  export type RoadmapSumAggregateInputType = {
    estimatedWeeks?: true
    cloneCount?: true
    viewCount?: true
  }

  export type RoadmapMinAggregateInputType = {
    id?: true
    ownerId?: true
    creatorName?: true
    title?: true
    description?: true
    goal?: true
    category?: true
    difficulty?: true
    estimatedWeeks?: true
    cloneCount?: true
    viewCount?: true
    status?: true
    isPublished?: true
    publishedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type RoadmapMaxAggregateInputType = {
    id?: true
    ownerId?: true
    creatorName?: true
    title?: true
    description?: true
    goal?: true
    category?: true
    difficulty?: true
    estimatedWeeks?: true
    cloneCount?: true
    viewCount?: true
    status?: true
    isPublished?: true
    publishedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type RoadmapCountAggregateInputType = {
    id?: true
    ownerId?: true
    creatorName?: true
    title?: true
    description?: true
    goal?: true
    category?: true
    difficulty?: true
    estimatedWeeks?: true
    tags?: true
    cloneCount?: true
    viewCount?: true
    status?: true
    isPublished?: true
    publishedAt?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type RoadmapAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Roadmap to aggregate.
     */
    where?: RoadmapWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Roadmaps to fetch.
     */
    orderBy?: RoadmapOrderByWithRelationInput | RoadmapOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RoadmapWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Roadmaps from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Roadmaps.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Roadmaps
    **/
    _count?: true | RoadmapCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: RoadmapAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: RoadmapSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RoadmapMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RoadmapMaxAggregateInputType
  }

  export type GetRoadmapAggregateType<T extends RoadmapAggregateArgs> = {
        [P in keyof T & keyof AggregateRoadmap]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRoadmap[P]>
      : GetScalarType<T[P], AggregateRoadmap[P]>
  }




  export type RoadmapGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RoadmapWhereInput
    orderBy?: RoadmapOrderByWithAggregationInput | RoadmapOrderByWithAggregationInput[]
    by: RoadmapScalarFieldEnum[] | RoadmapScalarFieldEnum
    having?: RoadmapScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RoadmapCountAggregateInputType | true
    _avg?: RoadmapAvgAggregateInputType
    _sum?: RoadmapSumAggregateInputType
    _min?: RoadmapMinAggregateInputType
    _max?: RoadmapMaxAggregateInputType
  }

  export type RoadmapGroupByOutputType = {
    id: string
    ownerId: string
    creatorName: string | null
    title: string
    description: string | null
    goal: string | null
    category: string | null
    difficulty: string | null
    estimatedWeeks: number | null
    tags: JsonValue | null
    cloneCount: number
    viewCount: number
    status: string
    isPublished: boolean
    publishedAt: Date | null
    createdAt: Date
    updatedAt: Date
    _count: RoadmapCountAggregateOutputType | null
    _avg: RoadmapAvgAggregateOutputType | null
    _sum: RoadmapSumAggregateOutputType | null
    _min: RoadmapMinAggregateOutputType | null
    _max: RoadmapMaxAggregateOutputType | null
  }

  type GetRoadmapGroupByPayload<T extends RoadmapGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RoadmapGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RoadmapGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RoadmapGroupByOutputType[P]>
            : GetScalarType<T[P], RoadmapGroupByOutputType[P]>
        }
      >
    >


  export type RoadmapSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    ownerId?: boolean
    creatorName?: boolean
    title?: boolean
    description?: boolean
    goal?: boolean
    category?: boolean
    difficulty?: boolean
    estimatedWeeks?: boolean
    tags?: boolean
    cloneCount?: boolean
    viewCount?: boolean
    status?: boolean
    isPublished?: boolean
    publishedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    share?: boolean | Roadmap$shareArgs<ExtArgs>
    nodes?: boolean | Roadmap$nodesArgs<ExtArgs>
    collaborators?: boolean | Roadmap$collaboratorsArgs<ExtArgs>
    progress?: boolean | Roadmap$progressArgs<ExtArgs>
    _count?: boolean | RoadmapCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["roadmap"]>

  export type RoadmapSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    ownerId?: boolean
    creatorName?: boolean
    title?: boolean
    description?: boolean
    goal?: boolean
    category?: boolean
    difficulty?: boolean
    estimatedWeeks?: boolean
    tags?: boolean
    cloneCount?: boolean
    viewCount?: boolean
    status?: boolean
    isPublished?: boolean
    publishedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["roadmap"]>

  export type RoadmapSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    ownerId?: boolean
    creatorName?: boolean
    title?: boolean
    description?: boolean
    goal?: boolean
    category?: boolean
    difficulty?: boolean
    estimatedWeeks?: boolean
    tags?: boolean
    cloneCount?: boolean
    viewCount?: boolean
    status?: boolean
    isPublished?: boolean
    publishedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["roadmap"]>

  export type RoadmapSelectScalar = {
    id?: boolean
    ownerId?: boolean
    creatorName?: boolean
    title?: boolean
    description?: boolean
    goal?: boolean
    category?: boolean
    difficulty?: boolean
    estimatedWeeks?: boolean
    tags?: boolean
    cloneCount?: boolean
    viewCount?: boolean
    status?: boolean
    isPublished?: boolean
    publishedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type RoadmapOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "ownerId" | "creatorName" | "title" | "description" | "goal" | "category" | "difficulty" | "estimatedWeeks" | "tags" | "cloneCount" | "viewCount" | "status" | "isPublished" | "publishedAt" | "createdAt" | "updatedAt", ExtArgs["result"]["roadmap"]>
  export type RoadmapInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    share?: boolean | Roadmap$shareArgs<ExtArgs>
    nodes?: boolean | Roadmap$nodesArgs<ExtArgs>
    collaborators?: boolean | Roadmap$collaboratorsArgs<ExtArgs>
    progress?: boolean | Roadmap$progressArgs<ExtArgs>
    _count?: boolean | RoadmapCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type RoadmapIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type RoadmapIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $RoadmapPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Roadmap"
    objects: {
      share: Prisma.$RoadmapSharePayload<ExtArgs> | null
      nodes: Prisma.$RoadmapNodePayload<ExtArgs>[]
      collaborators: Prisma.$RoadmapCollaboratorPayload<ExtArgs>[]
      progress: Prisma.$RoadmapProgressPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      ownerId: string
      creatorName: string | null
      title: string
      description: string | null
      goal: string | null
      category: string | null
      difficulty: string | null
      estimatedWeeks: number | null
      tags: Prisma.JsonValue | null
      cloneCount: number
      viewCount: number
      status: string
      isPublished: boolean
      publishedAt: Date | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["roadmap"]>
    composites: {}
  }

  type RoadmapGetPayload<S extends boolean | null | undefined | RoadmapDefaultArgs> = $Result.GetResult<Prisma.$RoadmapPayload, S>

  type RoadmapCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<RoadmapFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: RoadmapCountAggregateInputType | true
    }

  export interface RoadmapDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Roadmap'], meta: { name: 'Roadmap' } }
    /**
     * Find zero or one Roadmap that matches the filter.
     * @param {RoadmapFindUniqueArgs} args - Arguments to find a Roadmap
     * @example
     * // Get one Roadmap
     * const roadmap = await prisma.roadmap.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RoadmapFindUniqueArgs>(args: SelectSubset<T, RoadmapFindUniqueArgs<ExtArgs>>): Prisma__RoadmapClient<$Result.GetResult<Prisma.$RoadmapPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Roadmap that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {RoadmapFindUniqueOrThrowArgs} args - Arguments to find a Roadmap
     * @example
     * // Get one Roadmap
     * const roadmap = await prisma.roadmap.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RoadmapFindUniqueOrThrowArgs>(args: SelectSubset<T, RoadmapFindUniqueOrThrowArgs<ExtArgs>>): Prisma__RoadmapClient<$Result.GetResult<Prisma.$RoadmapPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Roadmap that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoadmapFindFirstArgs} args - Arguments to find a Roadmap
     * @example
     * // Get one Roadmap
     * const roadmap = await prisma.roadmap.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RoadmapFindFirstArgs>(args?: SelectSubset<T, RoadmapFindFirstArgs<ExtArgs>>): Prisma__RoadmapClient<$Result.GetResult<Prisma.$RoadmapPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Roadmap that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoadmapFindFirstOrThrowArgs} args - Arguments to find a Roadmap
     * @example
     * // Get one Roadmap
     * const roadmap = await prisma.roadmap.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RoadmapFindFirstOrThrowArgs>(args?: SelectSubset<T, RoadmapFindFirstOrThrowArgs<ExtArgs>>): Prisma__RoadmapClient<$Result.GetResult<Prisma.$RoadmapPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Roadmaps that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoadmapFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Roadmaps
     * const roadmaps = await prisma.roadmap.findMany()
     * 
     * // Get first 10 Roadmaps
     * const roadmaps = await prisma.roadmap.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const roadmapWithIdOnly = await prisma.roadmap.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends RoadmapFindManyArgs>(args?: SelectSubset<T, RoadmapFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RoadmapPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Roadmap.
     * @param {RoadmapCreateArgs} args - Arguments to create a Roadmap.
     * @example
     * // Create one Roadmap
     * const Roadmap = await prisma.roadmap.create({
     *   data: {
     *     // ... data to create a Roadmap
     *   }
     * })
     * 
     */
    create<T extends RoadmapCreateArgs>(args: SelectSubset<T, RoadmapCreateArgs<ExtArgs>>): Prisma__RoadmapClient<$Result.GetResult<Prisma.$RoadmapPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Roadmaps.
     * @param {RoadmapCreateManyArgs} args - Arguments to create many Roadmaps.
     * @example
     * // Create many Roadmaps
     * const roadmap = await prisma.roadmap.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends RoadmapCreateManyArgs>(args?: SelectSubset<T, RoadmapCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Roadmaps and returns the data saved in the database.
     * @param {RoadmapCreateManyAndReturnArgs} args - Arguments to create many Roadmaps.
     * @example
     * // Create many Roadmaps
     * const roadmap = await prisma.roadmap.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Roadmaps and only return the `id`
     * const roadmapWithIdOnly = await prisma.roadmap.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends RoadmapCreateManyAndReturnArgs>(args?: SelectSubset<T, RoadmapCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RoadmapPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Roadmap.
     * @param {RoadmapDeleteArgs} args - Arguments to delete one Roadmap.
     * @example
     * // Delete one Roadmap
     * const Roadmap = await prisma.roadmap.delete({
     *   where: {
     *     // ... filter to delete one Roadmap
     *   }
     * })
     * 
     */
    delete<T extends RoadmapDeleteArgs>(args: SelectSubset<T, RoadmapDeleteArgs<ExtArgs>>): Prisma__RoadmapClient<$Result.GetResult<Prisma.$RoadmapPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Roadmap.
     * @param {RoadmapUpdateArgs} args - Arguments to update one Roadmap.
     * @example
     * // Update one Roadmap
     * const roadmap = await prisma.roadmap.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends RoadmapUpdateArgs>(args: SelectSubset<T, RoadmapUpdateArgs<ExtArgs>>): Prisma__RoadmapClient<$Result.GetResult<Prisma.$RoadmapPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Roadmaps.
     * @param {RoadmapDeleteManyArgs} args - Arguments to filter Roadmaps to delete.
     * @example
     * // Delete a few Roadmaps
     * const { count } = await prisma.roadmap.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends RoadmapDeleteManyArgs>(args?: SelectSubset<T, RoadmapDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Roadmaps.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoadmapUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Roadmaps
     * const roadmap = await prisma.roadmap.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends RoadmapUpdateManyArgs>(args: SelectSubset<T, RoadmapUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Roadmaps and returns the data updated in the database.
     * @param {RoadmapUpdateManyAndReturnArgs} args - Arguments to update many Roadmaps.
     * @example
     * // Update many Roadmaps
     * const roadmap = await prisma.roadmap.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Roadmaps and only return the `id`
     * const roadmapWithIdOnly = await prisma.roadmap.updateManyAndReturn({
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
    updateManyAndReturn<T extends RoadmapUpdateManyAndReturnArgs>(args: SelectSubset<T, RoadmapUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RoadmapPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Roadmap.
     * @param {RoadmapUpsertArgs} args - Arguments to update or create a Roadmap.
     * @example
     * // Update or create a Roadmap
     * const roadmap = await prisma.roadmap.upsert({
     *   create: {
     *     // ... data to create a Roadmap
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Roadmap we want to update
     *   }
     * })
     */
    upsert<T extends RoadmapUpsertArgs>(args: SelectSubset<T, RoadmapUpsertArgs<ExtArgs>>): Prisma__RoadmapClient<$Result.GetResult<Prisma.$RoadmapPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Roadmaps.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoadmapCountArgs} args - Arguments to filter Roadmaps to count.
     * @example
     * // Count the number of Roadmaps
     * const count = await prisma.roadmap.count({
     *   where: {
     *     // ... the filter for the Roadmaps we want to count
     *   }
     * })
    **/
    count<T extends RoadmapCountArgs>(
      args?: Subset<T, RoadmapCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RoadmapCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Roadmap.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoadmapAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends RoadmapAggregateArgs>(args: Subset<T, RoadmapAggregateArgs>): Prisma.PrismaPromise<GetRoadmapAggregateType<T>>

    /**
     * Group by Roadmap.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoadmapGroupByArgs} args - Group by arguments.
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
      T extends RoadmapGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RoadmapGroupByArgs['orderBy'] }
        : { orderBy?: RoadmapGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, RoadmapGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRoadmapGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Roadmap model
   */
  readonly fields: RoadmapFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Roadmap.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RoadmapClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    share<T extends Roadmap$shareArgs<ExtArgs> = {}>(args?: Subset<T, Roadmap$shareArgs<ExtArgs>>): Prisma__RoadmapShareClient<$Result.GetResult<Prisma.$RoadmapSharePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    nodes<T extends Roadmap$nodesArgs<ExtArgs> = {}>(args?: Subset<T, Roadmap$nodesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RoadmapNodePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    collaborators<T extends Roadmap$collaboratorsArgs<ExtArgs> = {}>(args?: Subset<T, Roadmap$collaboratorsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RoadmapCollaboratorPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    progress<T extends Roadmap$progressArgs<ExtArgs> = {}>(args?: Subset<T, Roadmap$progressArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RoadmapProgressPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the Roadmap model
   */
  interface RoadmapFieldRefs {
    readonly id: FieldRef<"Roadmap", 'String'>
    readonly ownerId: FieldRef<"Roadmap", 'String'>
    readonly creatorName: FieldRef<"Roadmap", 'String'>
    readonly title: FieldRef<"Roadmap", 'String'>
    readonly description: FieldRef<"Roadmap", 'String'>
    readonly goal: FieldRef<"Roadmap", 'String'>
    readonly category: FieldRef<"Roadmap", 'String'>
    readonly difficulty: FieldRef<"Roadmap", 'String'>
    readonly estimatedWeeks: FieldRef<"Roadmap", 'Int'>
    readonly tags: FieldRef<"Roadmap", 'Json'>
    readonly cloneCount: FieldRef<"Roadmap", 'Int'>
    readonly viewCount: FieldRef<"Roadmap", 'Int'>
    readonly status: FieldRef<"Roadmap", 'String'>
    readonly isPublished: FieldRef<"Roadmap", 'Boolean'>
    readonly publishedAt: FieldRef<"Roadmap", 'DateTime'>
    readonly createdAt: FieldRef<"Roadmap", 'DateTime'>
    readonly updatedAt: FieldRef<"Roadmap", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Roadmap findUnique
   */
  export type RoadmapFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Roadmap
     */
    select?: RoadmapSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Roadmap
     */
    omit?: RoadmapOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoadmapInclude<ExtArgs> | null
    /**
     * Filter, which Roadmap to fetch.
     */
    where: RoadmapWhereUniqueInput
  }

  /**
   * Roadmap findUniqueOrThrow
   */
  export type RoadmapFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Roadmap
     */
    select?: RoadmapSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Roadmap
     */
    omit?: RoadmapOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoadmapInclude<ExtArgs> | null
    /**
     * Filter, which Roadmap to fetch.
     */
    where: RoadmapWhereUniqueInput
  }

  /**
   * Roadmap findFirst
   */
  export type RoadmapFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Roadmap
     */
    select?: RoadmapSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Roadmap
     */
    omit?: RoadmapOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoadmapInclude<ExtArgs> | null
    /**
     * Filter, which Roadmap to fetch.
     */
    where?: RoadmapWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Roadmaps to fetch.
     */
    orderBy?: RoadmapOrderByWithRelationInput | RoadmapOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Roadmaps.
     */
    cursor?: RoadmapWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Roadmaps from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Roadmaps.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Roadmaps.
     */
    distinct?: RoadmapScalarFieldEnum | RoadmapScalarFieldEnum[]
  }

  /**
   * Roadmap findFirstOrThrow
   */
  export type RoadmapFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Roadmap
     */
    select?: RoadmapSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Roadmap
     */
    omit?: RoadmapOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoadmapInclude<ExtArgs> | null
    /**
     * Filter, which Roadmap to fetch.
     */
    where?: RoadmapWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Roadmaps to fetch.
     */
    orderBy?: RoadmapOrderByWithRelationInput | RoadmapOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Roadmaps.
     */
    cursor?: RoadmapWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Roadmaps from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Roadmaps.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Roadmaps.
     */
    distinct?: RoadmapScalarFieldEnum | RoadmapScalarFieldEnum[]
  }

  /**
   * Roadmap findMany
   */
  export type RoadmapFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Roadmap
     */
    select?: RoadmapSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Roadmap
     */
    omit?: RoadmapOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoadmapInclude<ExtArgs> | null
    /**
     * Filter, which Roadmaps to fetch.
     */
    where?: RoadmapWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Roadmaps to fetch.
     */
    orderBy?: RoadmapOrderByWithRelationInput | RoadmapOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Roadmaps.
     */
    cursor?: RoadmapWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Roadmaps from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Roadmaps.
     */
    skip?: number
    distinct?: RoadmapScalarFieldEnum | RoadmapScalarFieldEnum[]
  }

  /**
   * Roadmap create
   */
  export type RoadmapCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Roadmap
     */
    select?: RoadmapSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Roadmap
     */
    omit?: RoadmapOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoadmapInclude<ExtArgs> | null
    /**
     * The data needed to create a Roadmap.
     */
    data: XOR<RoadmapCreateInput, RoadmapUncheckedCreateInput>
  }

  /**
   * Roadmap createMany
   */
  export type RoadmapCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Roadmaps.
     */
    data: RoadmapCreateManyInput | RoadmapCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Roadmap createManyAndReturn
   */
  export type RoadmapCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Roadmap
     */
    select?: RoadmapSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Roadmap
     */
    omit?: RoadmapOmit<ExtArgs> | null
    /**
     * The data used to create many Roadmaps.
     */
    data: RoadmapCreateManyInput | RoadmapCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Roadmap update
   */
  export type RoadmapUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Roadmap
     */
    select?: RoadmapSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Roadmap
     */
    omit?: RoadmapOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoadmapInclude<ExtArgs> | null
    /**
     * The data needed to update a Roadmap.
     */
    data: XOR<RoadmapUpdateInput, RoadmapUncheckedUpdateInput>
    /**
     * Choose, which Roadmap to update.
     */
    where: RoadmapWhereUniqueInput
  }

  /**
   * Roadmap updateMany
   */
  export type RoadmapUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Roadmaps.
     */
    data: XOR<RoadmapUpdateManyMutationInput, RoadmapUncheckedUpdateManyInput>
    /**
     * Filter which Roadmaps to update
     */
    where?: RoadmapWhereInput
    /**
     * Limit how many Roadmaps to update.
     */
    limit?: number
  }

  /**
   * Roadmap updateManyAndReturn
   */
  export type RoadmapUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Roadmap
     */
    select?: RoadmapSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Roadmap
     */
    omit?: RoadmapOmit<ExtArgs> | null
    /**
     * The data used to update Roadmaps.
     */
    data: XOR<RoadmapUpdateManyMutationInput, RoadmapUncheckedUpdateManyInput>
    /**
     * Filter which Roadmaps to update
     */
    where?: RoadmapWhereInput
    /**
     * Limit how many Roadmaps to update.
     */
    limit?: number
  }

  /**
   * Roadmap upsert
   */
  export type RoadmapUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Roadmap
     */
    select?: RoadmapSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Roadmap
     */
    omit?: RoadmapOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoadmapInclude<ExtArgs> | null
    /**
     * The filter to search for the Roadmap to update in case it exists.
     */
    where: RoadmapWhereUniqueInput
    /**
     * In case the Roadmap found by the `where` argument doesn't exist, create a new Roadmap with this data.
     */
    create: XOR<RoadmapCreateInput, RoadmapUncheckedCreateInput>
    /**
     * In case the Roadmap was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RoadmapUpdateInput, RoadmapUncheckedUpdateInput>
  }

  /**
   * Roadmap delete
   */
  export type RoadmapDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Roadmap
     */
    select?: RoadmapSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Roadmap
     */
    omit?: RoadmapOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoadmapInclude<ExtArgs> | null
    /**
     * Filter which Roadmap to delete.
     */
    where: RoadmapWhereUniqueInput
  }

  /**
   * Roadmap deleteMany
   */
  export type RoadmapDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Roadmaps to delete
     */
    where?: RoadmapWhereInput
    /**
     * Limit how many Roadmaps to delete.
     */
    limit?: number
  }

  /**
   * Roadmap.share
   */
  export type Roadmap$shareArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoadmapShare
     */
    select?: RoadmapShareSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoadmapShare
     */
    omit?: RoadmapShareOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoadmapShareInclude<ExtArgs> | null
    where?: RoadmapShareWhereInput
  }

  /**
   * Roadmap.nodes
   */
  export type Roadmap$nodesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoadmapNode
     */
    select?: RoadmapNodeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoadmapNode
     */
    omit?: RoadmapNodeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoadmapNodeInclude<ExtArgs> | null
    where?: RoadmapNodeWhereInput
    orderBy?: RoadmapNodeOrderByWithRelationInput | RoadmapNodeOrderByWithRelationInput[]
    cursor?: RoadmapNodeWhereUniqueInput
    take?: number
    skip?: number
    distinct?: RoadmapNodeScalarFieldEnum | RoadmapNodeScalarFieldEnum[]
  }

  /**
   * Roadmap.collaborators
   */
  export type Roadmap$collaboratorsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoadmapCollaborator
     */
    select?: RoadmapCollaboratorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoadmapCollaborator
     */
    omit?: RoadmapCollaboratorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoadmapCollaboratorInclude<ExtArgs> | null
    where?: RoadmapCollaboratorWhereInput
    orderBy?: RoadmapCollaboratorOrderByWithRelationInput | RoadmapCollaboratorOrderByWithRelationInput[]
    cursor?: RoadmapCollaboratorWhereUniqueInput
    take?: number
    skip?: number
    distinct?: RoadmapCollaboratorScalarFieldEnum | RoadmapCollaboratorScalarFieldEnum[]
  }

  /**
   * Roadmap.progress
   */
  export type Roadmap$progressArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoadmapProgress
     */
    select?: RoadmapProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoadmapProgress
     */
    omit?: RoadmapProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoadmapProgressInclude<ExtArgs> | null
    where?: RoadmapProgressWhereInput
    orderBy?: RoadmapProgressOrderByWithRelationInput | RoadmapProgressOrderByWithRelationInput[]
    cursor?: RoadmapProgressWhereUniqueInput
    take?: number
    skip?: number
    distinct?: RoadmapProgressScalarFieldEnum | RoadmapProgressScalarFieldEnum[]
  }

  /**
   * Roadmap without action
   */
  export type RoadmapDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Roadmap
     */
    select?: RoadmapSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Roadmap
     */
    omit?: RoadmapOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoadmapInclude<ExtArgs> | null
  }


  /**
   * Model RoadmapNode
   */

  export type AggregateRoadmapNode = {
    _count: RoadmapNodeCountAggregateOutputType | null
    _avg: RoadmapNodeAvgAggregateOutputType | null
    _sum: RoadmapNodeSumAggregateOutputType | null
    _min: RoadmapNodeMinAggregateOutputType | null
    _max: RoadmapNodeMaxAggregateOutputType | null
  }

  export type RoadmapNodeAvgAggregateOutputType = {
    position: number | null
  }

  export type RoadmapNodeSumAggregateOutputType = {
    position: number | null
  }

  export type RoadmapNodeMinAggregateOutputType = {
    id: string | null
    roadmapId: string | null
    title: string | null
    description: string | null
    type: string | null
    position: number | null
    parentId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type RoadmapNodeMaxAggregateOutputType = {
    id: string | null
    roadmapId: string | null
    title: string | null
    description: string | null
    type: string | null
    position: number | null
    parentId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type RoadmapNodeCountAggregateOutputType = {
    id: number
    roadmapId: number
    title: number
    description: number
    type: number
    position: number
    metadata: number
    parentId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type RoadmapNodeAvgAggregateInputType = {
    position?: true
  }

  export type RoadmapNodeSumAggregateInputType = {
    position?: true
  }

  export type RoadmapNodeMinAggregateInputType = {
    id?: true
    roadmapId?: true
    title?: true
    description?: true
    type?: true
    position?: true
    parentId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type RoadmapNodeMaxAggregateInputType = {
    id?: true
    roadmapId?: true
    title?: true
    description?: true
    type?: true
    position?: true
    parentId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type RoadmapNodeCountAggregateInputType = {
    id?: true
    roadmapId?: true
    title?: true
    description?: true
    type?: true
    position?: true
    metadata?: true
    parentId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type RoadmapNodeAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RoadmapNode to aggregate.
     */
    where?: RoadmapNodeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RoadmapNodes to fetch.
     */
    orderBy?: RoadmapNodeOrderByWithRelationInput | RoadmapNodeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RoadmapNodeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RoadmapNodes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RoadmapNodes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned RoadmapNodes
    **/
    _count?: true | RoadmapNodeCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: RoadmapNodeAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: RoadmapNodeSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RoadmapNodeMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RoadmapNodeMaxAggregateInputType
  }

  export type GetRoadmapNodeAggregateType<T extends RoadmapNodeAggregateArgs> = {
        [P in keyof T & keyof AggregateRoadmapNode]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRoadmapNode[P]>
      : GetScalarType<T[P], AggregateRoadmapNode[P]>
  }




  export type RoadmapNodeGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RoadmapNodeWhereInput
    orderBy?: RoadmapNodeOrderByWithAggregationInput | RoadmapNodeOrderByWithAggregationInput[]
    by: RoadmapNodeScalarFieldEnum[] | RoadmapNodeScalarFieldEnum
    having?: RoadmapNodeScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RoadmapNodeCountAggregateInputType | true
    _avg?: RoadmapNodeAvgAggregateInputType
    _sum?: RoadmapNodeSumAggregateInputType
    _min?: RoadmapNodeMinAggregateInputType
    _max?: RoadmapNodeMaxAggregateInputType
  }

  export type RoadmapNodeGroupByOutputType = {
    id: string
    roadmapId: string
    title: string
    description: string | null
    type: string
    position: number
    metadata: JsonValue | null
    parentId: string | null
    createdAt: Date
    updatedAt: Date
    _count: RoadmapNodeCountAggregateOutputType | null
    _avg: RoadmapNodeAvgAggregateOutputType | null
    _sum: RoadmapNodeSumAggregateOutputType | null
    _min: RoadmapNodeMinAggregateOutputType | null
    _max: RoadmapNodeMaxAggregateOutputType | null
  }

  type GetRoadmapNodeGroupByPayload<T extends RoadmapNodeGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RoadmapNodeGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RoadmapNodeGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RoadmapNodeGroupByOutputType[P]>
            : GetScalarType<T[P], RoadmapNodeGroupByOutputType[P]>
        }
      >
    >


  export type RoadmapNodeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    roadmapId?: boolean
    title?: boolean
    description?: boolean
    type?: boolean
    position?: boolean
    metadata?: boolean
    parentId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    roadmap?: boolean | RoadmapDefaultArgs<ExtArgs>
    parent?: boolean | RoadmapNode$parentArgs<ExtArgs>
    children?: boolean | RoadmapNode$childrenArgs<ExtArgs>
    progress?: boolean | RoadmapNode$progressArgs<ExtArgs>
    _count?: boolean | RoadmapNodeCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["roadmapNode"]>

  export type RoadmapNodeSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    roadmapId?: boolean
    title?: boolean
    description?: boolean
    type?: boolean
    position?: boolean
    metadata?: boolean
    parentId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    roadmap?: boolean | RoadmapDefaultArgs<ExtArgs>
    parent?: boolean | RoadmapNode$parentArgs<ExtArgs>
  }, ExtArgs["result"]["roadmapNode"]>

  export type RoadmapNodeSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    roadmapId?: boolean
    title?: boolean
    description?: boolean
    type?: boolean
    position?: boolean
    metadata?: boolean
    parentId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    roadmap?: boolean | RoadmapDefaultArgs<ExtArgs>
    parent?: boolean | RoadmapNode$parentArgs<ExtArgs>
  }, ExtArgs["result"]["roadmapNode"]>

  export type RoadmapNodeSelectScalar = {
    id?: boolean
    roadmapId?: boolean
    title?: boolean
    description?: boolean
    type?: boolean
    position?: boolean
    metadata?: boolean
    parentId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type RoadmapNodeOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "roadmapId" | "title" | "description" | "type" | "position" | "metadata" | "parentId" | "createdAt" | "updatedAt", ExtArgs["result"]["roadmapNode"]>
  export type RoadmapNodeInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    roadmap?: boolean | RoadmapDefaultArgs<ExtArgs>
    parent?: boolean | RoadmapNode$parentArgs<ExtArgs>
    children?: boolean | RoadmapNode$childrenArgs<ExtArgs>
    progress?: boolean | RoadmapNode$progressArgs<ExtArgs>
    _count?: boolean | RoadmapNodeCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type RoadmapNodeIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    roadmap?: boolean | RoadmapDefaultArgs<ExtArgs>
    parent?: boolean | RoadmapNode$parentArgs<ExtArgs>
  }
  export type RoadmapNodeIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    roadmap?: boolean | RoadmapDefaultArgs<ExtArgs>
    parent?: boolean | RoadmapNode$parentArgs<ExtArgs>
  }

  export type $RoadmapNodePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "RoadmapNode"
    objects: {
      roadmap: Prisma.$RoadmapPayload<ExtArgs>
      parent: Prisma.$RoadmapNodePayload<ExtArgs> | null
      children: Prisma.$RoadmapNodePayload<ExtArgs>[]
      progress: Prisma.$RoadmapProgressPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      roadmapId: string
      title: string
      description: string | null
      type: string
      position: number
      metadata: Prisma.JsonValue | null
      parentId: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["roadmapNode"]>
    composites: {}
  }

  type RoadmapNodeGetPayload<S extends boolean | null | undefined | RoadmapNodeDefaultArgs> = $Result.GetResult<Prisma.$RoadmapNodePayload, S>

  type RoadmapNodeCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<RoadmapNodeFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: RoadmapNodeCountAggregateInputType | true
    }

  export interface RoadmapNodeDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['RoadmapNode'], meta: { name: 'RoadmapNode' } }
    /**
     * Find zero or one RoadmapNode that matches the filter.
     * @param {RoadmapNodeFindUniqueArgs} args - Arguments to find a RoadmapNode
     * @example
     * // Get one RoadmapNode
     * const roadmapNode = await prisma.roadmapNode.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RoadmapNodeFindUniqueArgs>(args: SelectSubset<T, RoadmapNodeFindUniqueArgs<ExtArgs>>): Prisma__RoadmapNodeClient<$Result.GetResult<Prisma.$RoadmapNodePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one RoadmapNode that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {RoadmapNodeFindUniqueOrThrowArgs} args - Arguments to find a RoadmapNode
     * @example
     * // Get one RoadmapNode
     * const roadmapNode = await prisma.roadmapNode.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RoadmapNodeFindUniqueOrThrowArgs>(args: SelectSubset<T, RoadmapNodeFindUniqueOrThrowArgs<ExtArgs>>): Prisma__RoadmapNodeClient<$Result.GetResult<Prisma.$RoadmapNodePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first RoadmapNode that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoadmapNodeFindFirstArgs} args - Arguments to find a RoadmapNode
     * @example
     * // Get one RoadmapNode
     * const roadmapNode = await prisma.roadmapNode.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RoadmapNodeFindFirstArgs>(args?: SelectSubset<T, RoadmapNodeFindFirstArgs<ExtArgs>>): Prisma__RoadmapNodeClient<$Result.GetResult<Prisma.$RoadmapNodePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first RoadmapNode that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoadmapNodeFindFirstOrThrowArgs} args - Arguments to find a RoadmapNode
     * @example
     * // Get one RoadmapNode
     * const roadmapNode = await prisma.roadmapNode.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RoadmapNodeFindFirstOrThrowArgs>(args?: SelectSubset<T, RoadmapNodeFindFirstOrThrowArgs<ExtArgs>>): Prisma__RoadmapNodeClient<$Result.GetResult<Prisma.$RoadmapNodePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more RoadmapNodes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoadmapNodeFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all RoadmapNodes
     * const roadmapNodes = await prisma.roadmapNode.findMany()
     * 
     * // Get first 10 RoadmapNodes
     * const roadmapNodes = await prisma.roadmapNode.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const roadmapNodeWithIdOnly = await prisma.roadmapNode.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends RoadmapNodeFindManyArgs>(args?: SelectSubset<T, RoadmapNodeFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RoadmapNodePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a RoadmapNode.
     * @param {RoadmapNodeCreateArgs} args - Arguments to create a RoadmapNode.
     * @example
     * // Create one RoadmapNode
     * const RoadmapNode = await prisma.roadmapNode.create({
     *   data: {
     *     // ... data to create a RoadmapNode
     *   }
     * })
     * 
     */
    create<T extends RoadmapNodeCreateArgs>(args: SelectSubset<T, RoadmapNodeCreateArgs<ExtArgs>>): Prisma__RoadmapNodeClient<$Result.GetResult<Prisma.$RoadmapNodePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many RoadmapNodes.
     * @param {RoadmapNodeCreateManyArgs} args - Arguments to create many RoadmapNodes.
     * @example
     * // Create many RoadmapNodes
     * const roadmapNode = await prisma.roadmapNode.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends RoadmapNodeCreateManyArgs>(args?: SelectSubset<T, RoadmapNodeCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many RoadmapNodes and returns the data saved in the database.
     * @param {RoadmapNodeCreateManyAndReturnArgs} args - Arguments to create many RoadmapNodes.
     * @example
     * // Create many RoadmapNodes
     * const roadmapNode = await prisma.roadmapNode.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many RoadmapNodes and only return the `id`
     * const roadmapNodeWithIdOnly = await prisma.roadmapNode.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends RoadmapNodeCreateManyAndReturnArgs>(args?: SelectSubset<T, RoadmapNodeCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RoadmapNodePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a RoadmapNode.
     * @param {RoadmapNodeDeleteArgs} args - Arguments to delete one RoadmapNode.
     * @example
     * // Delete one RoadmapNode
     * const RoadmapNode = await prisma.roadmapNode.delete({
     *   where: {
     *     // ... filter to delete one RoadmapNode
     *   }
     * })
     * 
     */
    delete<T extends RoadmapNodeDeleteArgs>(args: SelectSubset<T, RoadmapNodeDeleteArgs<ExtArgs>>): Prisma__RoadmapNodeClient<$Result.GetResult<Prisma.$RoadmapNodePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one RoadmapNode.
     * @param {RoadmapNodeUpdateArgs} args - Arguments to update one RoadmapNode.
     * @example
     * // Update one RoadmapNode
     * const roadmapNode = await prisma.roadmapNode.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends RoadmapNodeUpdateArgs>(args: SelectSubset<T, RoadmapNodeUpdateArgs<ExtArgs>>): Prisma__RoadmapNodeClient<$Result.GetResult<Prisma.$RoadmapNodePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more RoadmapNodes.
     * @param {RoadmapNodeDeleteManyArgs} args - Arguments to filter RoadmapNodes to delete.
     * @example
     * // Delete a few RoadmapNodes
     * const { count } = await prisma.roadmapNode.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends RoadmapNodeDeleteManyArgs>(args?: SelectSubset<T, RoadmapNodeDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RoadmapNodes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoadmapNodeUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many RoadmapNodes
     * const roadmapNode = await prisma.roadmapNode.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends RoadmapNodeUpdateManyArgs>(args: SelectSubset<T, RoadmapNodeUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RoadmapNodes and returns the data updated in the database.
     * @param {RoadmapNodeUpdateManyAndReturnArgs} args - Arguments to update many RoadmapNodes.
     * @example
     * // Update many RoadmapNodes
     * const roadmapNode = await prisma.roadmapNode.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more RoadmapNodes and only return the `id`
     * const roadmapNodeWithIdOnly = await prisma.roadmapNode.updateManyAndReturn({
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
    updateManyAndReturn<T extends RoadmapNodeUpdateManyAndReturnArgs>(args: SelectSubset<T, RoadmapNodeUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RoadmapNodePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one RoadmapNode.
     * @param {RoadmapNodeUpsertArgs} args - Arguments to update or create a RoadmapNode.
     * @example
     * // Update or create a RoadmapNode
     * const roadmapNode = await prisma.roadmapNode.upsert({
     *   create: {
     *     // ... data to create a RoadmapNode
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the RoadmapNode we want to update
     *   }
     * })
     */
    upsert<T extends RoadmapNodeUpsertArgs>(args: SelectSubset<T, RoadmapNodeUpsertArgs<ExtArgs>>): Prisma__RoadmapNodeClient<$Result.GetResult<Prisma.$RoadmapNodePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of RoadmapNodes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoadmapNodeCountArgs} args - Arguments to filter RoadmapNodes to count.
     * @example
     * // Count the number of RoadmapNodes
     * const count = await prisma.roadmapNode.count({
     *   where: {
     *     // ... the filter for the RoadmapNodes we want to count
     *   }
     * })
    **/
    count<T extends RoadmapNodeCountArgs>(
      args?: Subset<T, RoadmapNodeCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RoadmapNodeCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a RoadmapNode.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoadmapNodeAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends RoadmapNodeAggregateArgs>(args: Subset<T, RoadmapNodeAggregateArgs>): Prisma.PrismaPromise<GetRoadmapNodeAggregateType<T>>

    /**
     * Group by RoadmapNode.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoadmapNodeGroupByArgs} args - Group by arguments.
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
      T extends RoadmapNodeGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RoadmapNodeGroupByArgs['orderBy'] }
        : { orderBy?: RoadmapNodeGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, RoadmapNodeGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRoadmapNodeGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the RoadmapNode model
   */
  readonly fields: RoadmapNodeFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for RoadmapNode.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RoadmapNodeClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    roadmap<T extends RoadmapDefaultArgs<ExtArgs> = {}>(args?: Subset<T, RoadmapDefaultArgs<ExtArgs>>): Prisma__RoadmapClient<$Result.GetResult<Prisma.$RoadmapPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    parent<T extends RoadmapNode$parentArgs<ExtArgs> = {}>(args?: Subset<T, RoadmapNode$parentArgs<ExtArgs>>): Prisma__RoadmapNodeClient<$Result.GetResult<Prisma.$RoadmapNodePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    children<T extends RoadmapNode$childrenArgs<ExtArgs> = {}>(args?: Subset<T, RoadmapNode$childrenArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RoadmapNodePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    progress<T extends RoadmapNode$progressArgs<ExtArgs> = {}>(args?: Subset<T, RoadmapNode$progressArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RoadmapProgressPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the RoadmapNode model
   */
  interface RoadmapNodeFieldRefs {
    readonly id: FieldRef<"RoadmapNode", 'String'>
    readonly roadmapId: FieldRef<"RoadmapNode", 'String'>
    readonly title: FieldRef<"RoadmapNode", 'String'>
    readonly description: FieldRef<"RoadmapNode", 'String'>
    readonly type: FieldRef<"RoadmapNode", 'String'>
    readonly position: FieldRef<"RoadmapNode", 'Int'>
    readonly metadata: FieldRef<"RoadmapNode", 'Json'>
    readonly parentId: FieldRef<"RoadmapNode", 'String'>
    readonly createdAt: FieldRef<"RoadmapNode", 'DateTime'>
    readonly updatedAt: FieldRef<"RoadmapNode", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * RoadmapNode findUnique
   */
  export type RoadmapNodeFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoadmapNode
     */
    select?: RoadmapNodeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoadmapNode
     */
    omit?: RoadmapNodeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoadmapNodeInclude<ExtArgs> | null
    /**
     * Filter, which RoadmapNode to fetch.
     */
    where: RoadmapNodeWhereUniqueInput
  }

  /**
   * RoadmapNode findUniqueOrThrow
   */
  export type RoadmapNodeFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoadmapNode
     */
    select?: RoadmapNodeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoadmapNode
     */
    omit?: RoadmapNodeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoadmapNodeInclude<ExtArgs> | null
    /**
     * Filter, which RoadmapNode to fetch.
     */
    where: RoadmapNodeWhereUniqueInput
  }

  /**
   * RoadmapNode findFirst
   */
  export type RoadmapNodeFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoadmapNode
     */
    select?: RoadmapNodeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoadmapNode
     */
    omit?: RoadmapNodeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoadmapNodeInclude<ExtArgs> | null
    /**
     * Filter, which RoadmapNode to fetch.
     */
    where?: RoadmapNodeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RoadmapNodes to fetch.
     */
    orderBy?: RoadmapNodeOrderByWithRelationInput | RoadmapNodeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RoadmapNodes.
     */
    cursor?: RoadmapNodeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RoadmapNodes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RoadmapNodes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RoadmapNodes.
     */
    distinct?: RoadmapNodeScalarFieldEnum | RoadmapNodeScalarFieldEnum[]
  }

  /**
   * RoadmapNode findFirstOrThrow
   */
  export type RoadmapNodeFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoadmapNode
     */
    select?: RoadmapNodeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoadmapNode
     */
    omit?: RoadmapNodeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoadmapNodeInclude<ExtArgs> | null
    /**
     * Filter, which RoadmapNode to fetch.
     */
    where?: RoadmapNodeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RoadmapNodes to fetch.
     */
    orderBy?: RoadmapNodeOrderByWithRelationInput | RoadmapNodeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RoadmapNodes.
     */
    cursor?: RoadmapNodeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RoadmapNodes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RoadmapNodes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RoadmapNodes.
     */
    distinct?: RoadmapNodeScalarFieldEnum | RoadmapNodeScalarFieldEnum[]
  }

  /**
   * RoadmapNode findMany
   */
  export type RoadmapNodeFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoadmapNode
     */
    select?: RoadmapNodeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoadmapNode
     */
    omit?: RoadmapNodeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoadmapNodeInclude<ExtArgs> | null
    /**
     * Filter, which RoadmapNodes to fetch.
     */
    where?: RoadmapNodeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RoadmapNodes to fetch.
     */
    orderBy?: RoadmapNodeOrderByWithRelationInput | RoadmapNodeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing RoadmapNodes.
     */
    cursor?: RoadmapNodeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RoadmapNodes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RoadmapNodes.
     */
    skip?: number
    distinct?: RoadmapNodeScalarFieldEnum | RoadmapNodeScalarFieldEnum[]
  }

  /**
   * RoadmapNode create
   */
  export type RoadmapNodeCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoadmapNode
     */
    select?: RoadmapNodeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoadmapNode
     */
    omit?: RoadmapNodeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoadmapNodeInclude<ExtArgs> | null
    /**
     * The data needed to create a RoadmapNode.
     */
    data: XOR<RoadmapNodeCreateInput, RoadmapNodeUncheckedCreateInput>
  }

  /**
   * RoadmapNode createMany
   */
  export type RoadmapNodeCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many RoadmapNodes.
     */
    data: RoadmapNodeCreateManyInput | RoadmapNodeCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * RoadmapNode createManyAndReturn
   */
  export type RoadmapNodeCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoadmapNode
     */
    select?: RoadmapNodeSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the RoadmapNode
     */
    omit?: RoadmapNodeOmit<ExtArgs> | null
    /**
     * The data used to create many RoadmapNodes.
     */
    data: RoadmapNodeCreateManyInput | RoadmapNodeCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoadmapNodeIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * RoadmapNode update
   */
  export type RoadmapNodeUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoadmapNode
     */
    select?: RoadmapNodeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoadmapNode
     */
    omit?: RoadmapNodeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoadmapNodeInclude<ExtArgs> | null
    /**
     * The data needed to update a RoadmapNode.
     */
    data: XOR<RoadmapNodeUpdateInput, RoadmapNodeUncheckedUpdateInput>
    /**
     * Choose, which RoadmapNode to update.
     */
    where: RoadmapNodeWhereUniqueInput
  }

  /**
   * RoadmapNode updateMany
   */
  export type RoadmapNodeUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update RoadmapNodes.
     */
    data: XOR<RoadmapNodeUpdateManyMutationInput, RoadmapNodeUncheckedUpdateManyInput>
    /**
     * Filter which RoadmapNodes to update
     */
    where?: RoadmapNodeWhereInput
    /**
     * Limit how many RoadmapNodes to update.
     */
    limit?: number
  }

  /**
   * RoadmapNode updateManyAndReturn
   */
  export type RoadmapNodeUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoadmapNode
     */
    select?: RoadmapNodeSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the RoadmapNode
     */
    omit?: RoadmapNodeOmit<ExtArgs> | null
    /**
     * The data used to update RoadmapNodes.
     */
    data: XOR<RoadmapNodeUpdateManyMutationInput, RoadmapNodeUncheckedUpdateManyInput>
    /**
     * Filter which RoadmapNodes to update
     */
    where?: RoadmapNodeWhereInput
    /**
     * Limit how many RoadmapNodes to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoadmapNodeIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * RoadmapNode upsert
   */
  export type RoadmapNodeUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoadmapNode
     */
    select?: RoadmapNodeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoadmapNode
     */
    omit?: RoadmapNodeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoadmapNodeInclude<ExtArgs> | null
    /**
     * The filter to search for the RoadmapNode to update in case it exists.
     */
    where: RoadmapNodeWhereUniqueInput
    /**
     * In case the RoadmapNode found by the `where` argument doesn't exist, create a new RoadmapNode with this data.
     */
    create: XOR<RoadmapNodeCreateInput, RoadmapNodeUncheckedCreateInput>
    /**
     * In case the RoadmapNode was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RoadmapNodeUpdateInput, RoadmapNodeUncheckedUpdateInput>
  }

  /**
   * RoadmapNode delete
   */
  export type RoadmapNodeDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoadmapNode
     */
    select?: RoadmapNodeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoadmapNode
     */
    omit?: RoadmapNodeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoadmapNodeInclude<ExtArgs> | null
    /**
     * Filter which RoadmapNode to delete.
     */
    where: RoadmapNodeWhereUniqueInput
  }

  /**
   * RoadmapNode deleteMany
   */
  export type RoadmapNodeDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RoadmapNodes to delete
     */
    where?: RoadmapNodeWhereInput
    /**
     * Limit how many RoadmapNodes to delete.
     */
    limit?: number
  }

  /**
   * RoadmapNode.parent
   */
  export type RoadmapNode$parentArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoadmapNode
     */
    select?: RoadmapNodeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoadmapNode
     */
    omit?: RoadmapNodeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoadmapNodeInclude<ExtArgs> | null
    where?: RoadmapNodeWhereInput
  }

  /**
   * RoadmapNode.children
   */
  export type RoadmapNode$childrenArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoadmapNode
     */
    select?: RoadmapNodeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoadmapNode
     */
    omit?: RoadmapNodeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoadmapNodeInclude<ExtArgs> | null
    where?: RoadmapNodeWhereInput
    orderBy?: RoadmapNodeOrderByWithRelationInput | RoadmapNodeOrderByWithRelationInput[]
    cursor?: RoadmapNodeWhereUniqueInput
    take?: number
    skip?: number
    distinct?: RoadmapNodeScalarFieldEnum | RoadmapNodeScalarFieldEnum[]
  }

  /**
   * RoadmapNode.progress
   */
  export type RoadmapNode$progressArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoadmapProgress
     */
    select?: RoadmapProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoadmapProgress
     */
    omit?: RoadmapProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoadmapProgressInclude<ExtArgs> | null
    where?: RoadmapProgressWhereInput
    orderBy?: RoadmapProgressOrderByWithRelationInput | RoadmapProgressOrderByWithRelationInput[]
    cursor?: RoadmapProgressWhereUniqueInput
    take?: number
    skip?: number
    distinct?: RoadmapProgressScalarFieldEnum | RoadmapProgressScalarFieldEnum[]
  }

  /**
   * RoadmapNode without action
   */
  export type RoadmapNodeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoadmapNode
     */
    select?: RoadmapNodeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoadmapNode
     */
    omit?: RoadmapNodeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoadmapNodeInclude<ExtArgs> | null
  }


  /**
   * Model RoadmapCollaborator
   */

  export type AggregateRoadmapCollaborator = {
    _count: RoadmapCollaboratorCountAggregateOutputType | null
    _min: RoadmapCollaboratorMinAggregateOutputType | null
    _max: RoadmapCollaboratorMaxAggregateOutputType | null
  }

  export type RoadmapCollaboratorMinAggregateOutputType = {
    id: string | null
    roadmapId: string | null
    userId: string | null
    email: string | null
    role: string | null
    status: string | null
    invitedAt: Date | null
    joinedAt: Date | null
  }

  export type RoadmapCollaboratorMaxAggregateOutputType = {
    id: string | null
    roadmapId: string | null
    userId: string | null
    email: string | null
    role: string | null
    status: string | null
    invitedAt: Date | null
    joinedAt: Date | null
  }

  export type RoadmapCollaboratorCountAggregateOutputType = {
    id: number
    roadmapId: number
    userId: number
    email: number
    role: number
    status: number
    invitedAt: number
    joinedAt: number
    _all: number
  }


  export type RoadmapCollaboratorMinAggregateInputType = {
    id?: true
    roadmapId?: true
    userId?: true
    email?: true
    role?: true
    status?: true
    invitedAt?: true
    joinedAt?: true
  }

  export type RoadmapCollaboratorMaxAggregateInputType = {
    id?: true
    roadmapId?: true
    userId?: true
    email?: true
    role?: true
    status?: true
    invitedAt?: true
    joinedAt?: true
  }

  export type RoadmapCollaboratorCountAggregateInputType = {
    id?: true
    roadmapId?: true
    userId?: true
    email?: true
    role?: true
    status?: true
    invitedAt?: true
    joinedAt?: true
    _all?: true
  }

  export type RoadmapCollaboratorAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RoadmapCollaborator to aggregate.
     */
    where?: RoadmapCollaboratorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RoadmapCollaborators to fetch.
     */
    orderBy?: RoadmapCollaboratorOrderByWithRelationInput | RoadmapCollaboratorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RoadmapCollaboratorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RoadmapCollaborators from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RoadmapCollaborators.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned RoadmapCollaborators
    **/
    _count?: true | RoadmapCollaboratorCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RoadmapCollaboratorMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RoadmapCollaboratorMaxAggregateInputType
  }

  export type GetRoadmapCollaboratorAggregateType<T extends RoadmapCollaboratorAggregateArgs> = {
        [P in keyof T & keyof AggregateRoadmapCollaborator]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRoadmapCollaborator[P]>
      : GetScalarType<T[P], AggregateRoadmapCollaborator[P]>
  }




  export type RoadmapCollaboratorGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RoadmapCollaboratorWhereInput
    orderBy?: RoadmapCollaboratorOrderByWithAggregationInput | RoadmapCollaboratorOrderByWithAggregationInput[]
    by: RoadmapCollaboratorScalarFieldEnum[] | RoadmapCollaboratorScalarFieldEnum
    having?: RoadmapCollaboratorScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RoadmapCollaboratorCountAggregateInputType | true
    _min?: RoadmapCollaboratorMinAggregateInputType
    _max?: RoadmapCollaboratorMaxAggregateInputType
  }

  export type RoadmapCollaboratorGroupByOutputType = {
    id: string
    roadmapId: string
    userId: string | null
    email: string
    role: string
    status: string
    invitedAt: Date
    joinedAt: Date | null
    _count: RoadmapCollaboratorCountAggregateOutputType | null
    _min: RoadmapCollaboratorMinAggregateOutputType | null
    _max: RoadmapCollaboratorMaxAggregateOutputType | null
  }

  type GetRoadmapCollaboratorGroupByPayload<T extends RoadmapCollaboratorGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RoadmapCollaboratorGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RoadmapCollaboratorGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RoadmapCollaboratorGroupByOutputType[P]>
            : GetScalarType<T[P], RoadmapCollaboratorGroupByOutputType[P]>
        }
      >
    >


  export type RoadmapCollaboratorSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    roadmapId?: boolean
    userId?: boolean
    email?: boolean
    role?: boolean
    status?: boolean
    invitedAt?: boolean
    joinedAt?: boolean
    roadmap?: boolean | RoadmapDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["roadmapCollaborator"]>

  export type RoadmapCollaboratorSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    roadmapId?: boolean
    userId?: boolean
    email?: boolean
    role?: boolean
    status?: boolean
    invitedAt?: boolean
    joinedAt?: boolean
    roadmap?: boolean | RoadmapDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["roadmapCollaborator"]>

  export type RoadmapCollaboratorSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    roadmapId?: boolean
    userId?: boolean
    email?: boolean
    role?: boolean
    status?: boolean
    invitedAt?: boolean
    joinedAt?: boolean
    roadmap?: boolean | RoadmapDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["roadmapCollaborator"]>

  export type RoadmapCollaboratorSelectScalar = {
    id?: boolean
    roadmapId?: boolean
    userId?: boolean
    email?: boolean
    role?: boolean
    status?: boolean
    invitedAt?: boolean
    joinedAt?: boolean
  }

  export type RoadmapCollaboratorOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "roadmapId" | "userId" | "email" | "role" | "status" | "invitedAt" | "joinedAt", ExtArgs["result"]["roadmapCollaborator"]>
  export type RoadmapCollaboratorInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    roadmap?: boolean | RoadmapDefaultArgs<ExtArgs>
  }
  export type RoadmapCollaboratorIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    roadmap?: boolean | RoadmapDefaultArgs<ExtArgs>
  }
  export type RoadmapCollaboratorIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    roadmap?: boolean | RoadmapDefaultArgs<ExtArgs>
  }

  export type $RoadmapCollaboratorPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "RoadmapCollaborator"
    objects: {
      roadmap: Prisma.$RoadmapPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      roadmapId: string
      userId: string | null
      email: string
      role: string
      status: string
      invitedAt: Date
      joinedAt: Date | null
    }, ExtArgs["result"]["roadmapCollaborator"]>
    composites: {}
  }

  type RoadmapCollaboratorGetPayload<S extends boolean | null | undefined | RoadmapCollaboratorDefaultArgs> = $Result.GetResult<Prisma.$RoadmapCollaboratorPayload, S>

  type RoadmapCollaboratorCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<RoadmapCollaboratorFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: RoadmapCollaboratorCountAggregateInputType | true
    }

  export interface RoadmapCollaboratorDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['RoadmapCollaborator'], meta: { name: 'RoadmapCollaborator' } }
    /**
     * Find zero or one RoadmapCollaborator that matches the filter.
     * @param {RoadmapCollaboratorFindUniqueArgs} args - Arguments to find a RoadmapCollaborator
     * @example
     * // Get one RoadmapCollaborator
     * const roadmapCollaborator = await prisma.roadmapCollaborator.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RoadmapCollaboratorFindUniqueArgs>(args: SelectSubset<T, RoadmapCollaboratorFindUniqueArgs<ExtArgs>>): Prisma__RoadmapCollaboratorClient<$Result.GetResult<Prisma.$RoadmapCollaboratorPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one RoadmapCollaborator that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {RoadmapCollaboratorFindUniqueOrThrowArgs} args - Arguments to find a RoadmapCollaborator
     * @example
     * // Get one RoadmapCollaborator
     * const roadmapCollaborator = await prisma.roadmapCollaborator.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RoadmapCollaboratorFindUniqueOrThrowArgs>(args: SelectSubset<T, RoadmapCollaboratorFindUniqueOrThrowArgs<ExtArgs>>): Prisma__RoadmapCollaboratorClient<$Result.GetResult<Prisma.$RoadmapCollaboratorPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first RoadmapCollaborator that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoadmapCollaboratorFindFirstArgs} args - Arguments to find a RoadmapCollaborator
     * @example
     * // Get one RoadmapCollaborator
     * const roadmapCollaborator = await prisma.roadmapCollaborator.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RoadmapCollaboratorFindFirstArgs>(args?: SelectSubset<T, RoadmapCollaboratorFindFirstArgs<ExtArgs>>): Prisma__RoadmapCollaboratorClient<$Result.GetResult<Prisma.$RoadmapCollaboratorPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first RoadmapCollaborator that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoadmapCollaboratorFindFirstOrThrowArgs} args - Arguments to find a RoadmapCollaborator
     * @example
     * // Get one RoadmapCollaborator
     * const roadmapCollaborator = await prisma.roadmapCollaborator.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RoadmapCollaboratorFindFirstOrThrowArgs>(args?: SelectSubset<T, RoadmapCollaboratorFindFirstOrThrowArgs<ExtArgs>>): Prisma__RoadmapCollaboratorClient<$Result.GetResult<Prisma.$RoadmapCollaboratorPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more RoadmapCollaborators that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoadmapCollaboratorFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all RoadmapCollaborators
     * const roadmapCollaborators = await prisma.roadmapCollaborator.findMany()
     * 
     * // Get first 10 RoadmapCollaborators
     * const roadmapCollaborators = await prisma.roadmapCollaborator.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const roadmapCollaboratorWithIdOnly = await prisma.roadmapCollaborator.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends RoadmapCollaboratorFindManyArgs>(args?: SelectSubset<T, RoadmapCollaboratorFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RoadmapCollaboratorPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a RoadmapCollaborator.
     * @param {RoadmapCollaboratorCreateArgs} args - Arguments to create a RoadmapCollaborator.
     * @example
     * // Create one RoadmapCollaborator
     * const RoadmapCollaborator = await prisma.roadmapCollaborator.create({
     *   data: {
     *     // ... data to create a RoadmapCollaborator
     *   }
     * })
     * 
     */
    create<T extends RoadmapCollaboratorCreateArgs>(args: SelectSubset<T, RoadmapCollaboratorCreateArgs<ExtArgs>>): Prisma__RoadmapCollaboratorClient<$Result.GetResult<Prisma.$RoadmapCollaboratorPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many RoadmapCollaborators.
     * @param {RoadmapCollaboratorCreateManyArgs} args - Arguments to create many RoadmapCollaborators.
     * @example
     * // Create many RoadmapCollaborators
     * const roadmapCollaborator = await prisma.roadmapCollaborator.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends RoadmapCollaboratorCreateManyArgs>(args?: SelectSubset<T, RoadmapCollaboratorCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many RoadmapCollaborators and returns the data saved in the database.
     * @param {RoadmapCollaboratorCreateManyAndReturnArgs} args - Arguments to create many RoadmapCollaborators.
     * @example
     * // Create many RoadmapCollaborators
     * const roadmapCollaborator = await prisma.roadmapCollaborator.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many RoadmapCollaborators and only return the `id`
     * const roadmapCollaboratorWithIdOnly = await prisma.roadmapCollaborator.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends RoadmapCollaboratorCreateManyAndReturnArgs>(args?: SelectSubset<T, RoadmapCollaboratorCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RoadmapCollaboratorPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a RoadmapCollaborator.
     * @param {RoadmapCollaboratorDeleteArgs} args - Arguments to delete one RoadmapCollaborator.
     * @example
     * // Delete one RoadmapCollaborator
     * const RoadmapCollaborator = await prisma.roadmapCollaborator.delete({
     *   where: {
     *     // ... filter to delete one RoadmapCollaborator
     *   }
     * })
     * 
     */
    delete<T extends RoadmapCollaboratorDeleteArgs>(args: SelectSubset<T, RoadmapCollaboratorDeleteArgs<ExtArgs>>): Prisma__RoadmapCollaboratorClient<$Result.GetResult<Prisma.$RoadmapCollaboratorPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one RoadmapCollaborator.
     * @param {RoadmapCollaboratorUpdateArgs} args - Arguments to update one RoadmapCollaborator.
     * @example
     * // Update one RoadmapCollaborator
     * const roadmapCollaborator = await prisma.roadmapCollaborator.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends RoadmapCollaboratorUpdateArgs>(args: SelectSubset<T, RoadmapCollaboratorUpdateArgs<ExtArgs>>): Prisma__RoadmapCollaboratorClient<$Result.GetResult<Prisma.$RoadmapCollaboratorPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more RoadmapCollaborators.
     * @param {RoadmapCollaboratorDeleteManyArgs} args - Arguments to filter RoadmapCollaborators to delete.
     * @example
     * // Delete a few RoadmapCollaborators
     * const { count } = await prisma.roadmapCollaborator.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends RoadmapCollaboratorDeleteManyArgs>(args?: SelectSubset<T, RoadmapCollaboratorDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RoadmapCollaborators.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoadmapCollaboratorUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many RoadmapCollaborators
     * const roadmapCollaborator = await prisma.roadmapCollaborator.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends RoadmapCollaboratorUpdateManyArgs>(args: SelectSubset<T, RoadmapCollaboratorUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RoadmapCollaborators and returns the data updated in the database.
     * @param {RoadmapCollaboratorUpdateManyAndReturnArgs} args - Arguments to update many RoadmapCollaborators.
     * @example
     * // Update many RoadmapCollaborators
     * const roadmapCollaborator = await prisma.roadmapCollaborator.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more RoadmapCollaborators and only return the `id`
     * const roadmapCollaboratorWithIdOnly = await prisma.roadmapCollaborator.updateManyAndReturn({
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
    updateManyAndReturn<T extends RoadmapCollaboratorUpdateManyAndReturnArgs>(args: SelectSubset<T, RoadmapCollaboratorUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RoadmapCollaboratorPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one RoadmapCollaborator.
     * @param {RoadmapCollaboratorUpsertArgs} args - Arguments to update or create a RoadmapCollaborator.
     * @example
     * // Update or create a RoadmapCollaborator
     * const roadmapCollaborator = await prisma.roadmapCollaborator.upsert({
     *   create: {
     *     // ... data to create a RoadmapCollaborator
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the RoadmapCollaborator we want to update
     *   }
     * })
     */
    upsert<T extends RoadmapCollaboratorUpsertArgs>(args: SelectSubset<T, RoadmapCollaboratorUpsertArgs<ExtArgs>>): Prisma__RoadmapCollaboratorClient<$Result.GetResult<Prisma.$RoadmapCollaboratorPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of RoadmapCollaborators.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoadmapCollaboratorCountArgs} args - Arguments to filter RoadmapCollaborators to count.
     * @example
     * // Count the number of RoadmapCollaborators
     * const count = await prisma.roadmapCollaborator.count({
     *   where: {
     *     // ... the filter for the RoadmapCollaborators we want to count
     *   }
     * })
    **/
    count<T extends RoadmapCollaboratorCountArgs>(
      args?: Subset<T, RoadmapCollaboratorCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RoadmapCollaboratorCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a RoadmapCollaborator.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoadmapCollaboratorAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends RoadmapCollaboratorAggregateArgs>(args: Subset<T, RoadmapCollaboratorAggregateArgs>): Prisma.PrismaPromise<GetRoadmapCollaboratorAggregateType<T>>

    /**
     * Group by RoadmapCollaborator.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoadmapCollaboratorGroupByArgs} args - Group by arguments.
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
      T extends RoadmapCollaboratorGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RoadmapCollaboratorGroupByArgs['orderBy'] }
        : { orderBy?: RoadmapCollaboratorGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, RoadmapCollaboratorGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRoadmapCollaboratorGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the RoadmapCollaborator model
   */
  readonly fields: RoadmapCollaboratorFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for RoadmapCollaborator.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RoadmapCollaboratorClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    roadmap<T extends RoadmapDefaultArgs<ExtArgs> = {}>(args?: Subset<T, RoadmapDefaultArgs<ExtArgs>>): Prisma__RoadmapClient<$Result.GetResult<Prisma.$RoadmapPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the RoadmapCollaborator model
   */
  interface RoadmapCollaboratorFieldRefs {
    readonly id: FieldRef<"RoadmapCollaborator", 'String'>
    readonly roadmapId: FieldRef<"RoadmapCollaborator", 'String'>
    readonly userId: FieldRef<"RoadmapCollaborator", 'String'>
    readonly email: FieldRef<"RoadmapCollaborator", 'String'>
    readonly role: FieldRef<"RoadmapCollaborator", 'String'>
    readonly status: FieldRef<"RoadmapCollaborator", 'String'>
    readonly invitedAt: FieldRef<"RoadmapCollaborator", 'DateTime'>
    readonly joinedAt: FieldRef<"RoadmapCollaborator", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * RoadmapCollaborator findUnique
   */
  export type RoadmapCollaboratorFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoadmapCollaborator
     */
    select?: RoadmapCollaboratorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoadmapCollaborator
     */
    omit?: RoadmapCollaboratorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoadmapCollaboratorInclude<ExtArgs> | null
    /**
     * Filter, which RoadmapCollaborator to fetch.
     */
    where: RoadmapCollaboratorWhereUniqueInput
  }

  /**
   * RoadmapCollaborator findUniqueOrThrow
   */
  export type RoadmapCollaboratorFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoadmapCollaborator
     */
    select?: RoadmapCollaboratorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoadmapCollaborator
     */
    omit?: RoadmapCollaboratorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoadmapCollaboratorInclude<ExtArgs> | null
    /**
     * Filter, which RoadmapCollaborator to fetch.
     */
    where: RoadmapCollaboratorWhereUniqueInput
  }

  /**
   * RoadmapCollaborator findFirst
   */
  export type RoadmapCollaboratorFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoadmapCollaborator
     */
    select?: RoadmapCollaboratorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoadmapCollaborator
     */
    omit?: RoadmapCollaboratorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoadmapCollaboratorInclude<ExtArgs> | null
    /**
     * Filter, which RoadmapCollaborator to fetch.
     */
    where?: RoadmapCollaboratorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RoadmapCollaborators to fetch.
     */
    orderBy?: RoadmapCollaboratorOrderByWithRelationInput | RoadmapCollaboratorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RoadmapCollaborators.
     */
    cursor?: RoadmapCollaboratorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RoadmapCollaborators from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RoadmapCollaborators.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RoadmapCollaborators.
     */
    distinct?: RoadmapCollaboratorScalarFieldEnum | RoadmapCollaboratorScalarFieldEnum[]
  }

  /**
   * RoadmapCollaborator findFirstOrThrow
   */
  export type RoadmapCollaboratorFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoadmapCollaborator
     */
    select?: RoadmapCollaboratorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoadmapCollaborator
     */
    omit?: RoadmapCollaboratorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoadmapCollaboratorInclude<ExtArgs> | null
    /**
     * Filter, which RoadmapCollaborator to fetch.
     */
    where?: RoadmapCollaboratorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RoadmapCollaborators to fetch.
     */
    orderBy?: RoadmapCollaboratorOrderByWithRelationInput | RoadmapCollaboratorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RoadmapCollaborators.
     */
    cursor?: RoadmapCollaboratorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RoadmapCollaborators from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RoadmapCollaborators.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RoadmapCollaborators.
     */
    distinct?: RoadmapCollaboratorScalarFieldEnum | RoadmapCollaboratorScalarFieldEnum[]
  }

  /**
   * RoadmapCollaborator findMany
   */
  export type RoadmapCollaboratorFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoadmapCollaborator
     */
    select?: RoadmapCollaboratorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoadmapCollaborator
     */
    omit?: RoadmapCollaboratorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoadmapCollaboratorInclude<ExtArgs> | null
    /**
     * Filter, which RoadmapCollaborators to fetch.
     */
    where?: RoadmapCollaboratorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RoadmapCollaborators to fetch.
     */
    orderBy?: RoadmapCollaboratorOrderByWithRelationInput | RoadmapCollaboratorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing RoadmapCollaborators.
     */
    cursor?: RoadmapCollaboratorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RoadmapCollaborators from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RoadmapCollaborators.
     */
    skip?: number
    distinct?: RoadmapCollaboratorScalarFieldEnum | RoadmapCollaboratorScalarFieldEnum[]
  }

  /**
   * RoadmapCollaborator create
   */
  export type RoadmapCollaboratorCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoadmapCollaborator
     */
    select?: RoadmapCollaboratorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoadmapCollaborator
     */
    omit?: RoadmapCollaboratorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoadmapCollaboratorInclude<ExtArgs> | null
    /**
     * The data needed to create a RoadmapCollaborator.
     */
    data: XOR<RoadmapCollaboratorCreateInput, RoadmapCollaboratorUncheckedCreateInput>
  }

  /**
   * RoadmapCollaborator createMany
   */
  export type RoadmapCollaboratorCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many RoadmapCollaborators.
     */
    data: RoadmapCollaboratorCreateManyInput | RoadmapCollaboratorCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * RoadmapCollaborator createManyAndReturn
   */
  export type RoadmapCollaboratorCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoadmapCollaborator
     */
    select?: RoadmapCollaboratorSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the RoadmapCollaborator
     */
    omit?: RoadmapCollaboratorOmit<ExtArgs> | null
    /**
     * The data used to create many RoadmapCollaborators.
     */
    data: RoadmapCollaboratorCreateManyInput | RoadmapCollaboratorCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoadmapCollaboratorIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * RoadmapCollaborator update
   */
  export type RoadmapCollaboratorUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoadmapCollaborator
     */
    select?: RoadmapCollaboratorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoadmapCollaborator
     */
    omit?: RoadmapCollaboratorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoadmapCollaboratorInclude<ExtArgs> | null
    /**
     * The data needed to update a RoadmapCollaborator.
     */
    data: XOR<RoadmapCollaboratorUpdateInput, RoadmapCollaboratorUncheckedUpdateInput>
    /**
     * Choose, which RoadmapCollaborator to update.
     */
    where: RoadmapCollaboratorWhereUniqueInput
  }

  /**
   * RoadmapCollaborator updateMany
   */
  export type RoadmapCollaboratorUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update RoadmapCollaborators.
     */
    data: XOR<RoadmapCollaboratorUpdateManyMutationInput, RoadmapCollaboratorUncheckedUpdateManyInput>
    /**
     * Filter which RoadmapCollaborators to update
     */
    where?: RoadmapCollaboratorWhereInput
    /**
     * Limit how many RoadmapCollaborators to update.
     */
    limit?: number
  }

  /**
   * RoadmapCollaborator updateManyAndReturn
   */
  export type RoadmapCollaboratorUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoadmapCollaborator
     */
    select?: RoadmapCollaboratorSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the RoadmapCollaborator
     */
    omit?: RoadmapCollaboratorOmit<ExtArgs> | null
    /**
     * The data used to update RoadmapCollaborators.
     */
    data: XOR<RoadmapCollaboratorUpdateManyMutationInput, RoadmapCollaboratorUncheckedUpdateManyInput>
    /**
     * Filter which RoadmapCollaborators to update
     */
    where?: RoadmapCollaboratorWhereInput
    /**
     * Limit how many RoadmapCollaborators to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoadmapCollaboratorIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * RoadmapCollaborator upsert
   */
  export type RoadmapCollaboratorUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoadmapCollaborator
     */
    select?: RoadmapCollaboratorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoadmapCollaborator
     */
    omit?: RoadmapCollaboratorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoadmapCollaboratorInclude<ExtArgs> | null
    /**
     * The filter to search for the RoadmapCollaborator to update in case it exists.
     */
    where: RoadmapCollaboratorWhereUniqueInput
    /**
     * In case the RoadmapCollaborator found by the `where` argument doesn't exist, create a new RoadmapCollaborator with this data.
     */
    create: XOR<RoadmapCollaboratorCreateInput, RoadmapCollaboratorUncheckedCreateInput>
    /**
     * In case the RoadmapCollaborator was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RoadmapCollaboratorUpdateInput, RoadmapCollaboratorUncheckedUpdateInput>
  }

  /**
   * RoadmapCollaborator delete
   */
  export type RoadmapCollaboratorDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoadmapCollaborator
     */
    select?: RoadmapCollaboratorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoadmapCollaborator
     */
    omit?: RoadmapCollaboratorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoadmapCollaboratorInclude<ExtArgs> | null
    /**
     * Filter which RoadmapCollaborator to delete.
     */
    where: RoadmapCollaboratorWhereUniqueInput
  }

  /**
   * RoadmapCollaborator deleteMany
   */
  export type RoadmapCollaboratorDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RoadmapCollaborators to delete
     */
    where?: RoadmapCollaboratorWhereInput
    /**
     * Limit how many RoadmapCollaborators to delete.
     */
    limit?: number
  }

  /**
   * RoadmapCollaborator without action
   */
  export type RoadmapCollaboratorDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoadmapCollaborator
     */
    select?: RoadmapCollaboratorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoadmapCollaborator
     */
    omit?: RoadmapCollaboratorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoadmapCollaboratorInclude<ExtArgs> | null
  }


  /**
   * Model RoadmapProgress
   */

  export type AggregateRoadmapProgress = {
    _count: RoadmapProgressCountAggregateOutputType | null
    _avg: RoadmapProgressAvgAggregateOutputType | null
    _sum: RoadmapProgressSumAggregateOutputType | null
    _min: RoadmapProgressMinAggregateOutputType | null
    _max: RoadmapProgressMaxAggregateOutputType | null
  }

  export type RoadmapProgressAvgAggregateOutputType = {
    percent: number | null
  }

  export type RoadmapProgressSumAggregateOutputType = {
    percent: number | null
  }

  export type RoadmapProgressMinAggregateOutputType = {
    id: string | null
    roadmapId: string | null
    nodeId: string | null
    userId: string | null
    status: string | null
    percent: number | null
    notes: string | null
    completedAt: Date | null
    updatedAt: Date | null
    createdAt: Date | null
  }

  export type RoadmapProgressMaxAggregateOutputType = {
    id: string | null
    roadmapId: string | null
    nodeId: string | null
    userId: string | null
    status: string | null
    percent: number | null
    notes: string | null
    completedAt: Date | null
    updatedAt: Date | null
    createdAt: Date | null
  }

  export type RoadmapProgressCountAggregateOutputType = {
    id: number
    roadmapId: number
    nodeId: number
    userId: number
    status: number
    percent: number
    notes: number
    completedAt: number
    updatedAt: number
    createdAt: number
    _all: number
  }


  export type RoadmapProgressAvgAggregateInputType = {
    percent?: true
  }

  export type RoadmapProgressSumAggregateInputType = {
    percent?: true
  }

  export type RoadmapProgressMinAggregateInputType = {
    id?: true
    roadmapId?: true
    nodeId?: true
    userId?: true
    status?: true
    percent?: true
    notes?: true
    completedAt?: true
    updatedAt?: true
    createdAt?: true
  }

  export type RoadmapProgressMaxAggregateInputType = {
    id?: true
    roadmapId?: true
    nodeId?: true
    userId?: true
    status?: true
    percent?: true
    notes?: true
    completedAt?: true
    updatedAt?: true
    createdAt?: true
  }

  export type RoadmapProgressCountAggregateInputType = {
    id?: true
    roadmapId?: true
    nodeId?: true
    userId?: true
    status?: true
    percent?: true
    notes?: true
    completedAt?: true
    updatedAt?: true
    createdAt?: true
    _all?: true
  }

  export type RoadmapProgressAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RoadmapProgress to aggregate.
     */
    where?: RoadmapProgressWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RoadmapProgresses to fetch.
     */
    orderBy?: RoadmapProgressOrderByWithRelationInput | RoadmapProgressOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RoadmapProgressWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RoadmapProgresses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RoadmapProgresses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned RoadmapProgresses
    **/
    _count?: true | RoadmapProgressCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: RoadmapProgressAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: RoadmapProgressSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RoadmapProgressMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RoadmapProgressMaxAggregateInputType
  }

  export type GetRoadmapProgressAggregateType<T extends RoadmapProgressAggregateArgs> = {
        [P in keyof T & keyof AggregateRoadmapProgress]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRoadmapProgress[P]>
      : GetScalarType<T[P], AggregateRoadmapProgress[P]>
  }




  export type RoadmapProgressGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RoadmapProgressWhereInput
    orderBy?: RoadmapProgressOrderByWithAggregationInput | RoadmapProgressOrderByWithAggregationInput[]
    by: RoadmapProgressScalarFieldEnum[] | RoadmapProgressScalarFieldEnum
    having?: RoadmapProgressScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RoadmapProgressCountAggregateInputType | true
    _avg?: RoadmapProgressAvgAggregateInputType
    _sum?: RoadmapProgressSumAggregateInputType
    _min?: RoadmapProgressMinAggregateInputType
    _max?: RoadmapProgressMaxAggregateInputType
  }

  export type RoadmapProgressGroupByOutputType = {
    id: string
    roadmapId: string
    nodeId: string
    userId: string
    status: string
    percent: number
    notes: string | null
    completedAt: Date | null
    updatedAt: Date
    createdAt: Date
    _count: RoadmapProgressCountAggregateOutputType | null
    _avg: RoadmapProgressAvgAggregateOutputType | null
    _sum: RoadmapProgressSumAggregateOutputType | null
    _min: RoadmapProgressMinAggregateOutputType | null
    _max: RoadmapProgressMaxAggregateOutputType | null
  }

  type GetRoadmapProgressGroupByPayload<T extends RoadmapProgressGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RoadmapProgressGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RoadmapProgressGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RoadmapProgressGroupByOutputType[P]>
            : GetScalarType<T[P], RoadmapProgressGroupByOutputType[P]>
        }
      >
    >


  export type RoadmapProgressSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    roadmapId?: boolean
    nodeId?: boolean
    userId?: boolean
    status?: boolean
    percent?: boolean
    notes?: boolean
    completedAt?: boolean
    updatedAt?: boolean
    createdAt?: boolean
    roadmap?: boolean | RoadmapDefaultArgs<ExtArgs>
    node?: boolean | RoadmapNodeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["roadmapProgress"]>

  export type RoadmapProgressSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    roadmapId?: boolean
    nodeId?: boolean
    userId?: boolean
    status?: boolean
    percent?: boolean
    notes?: boolean
    completedAt?: boolean
    updatedAt?: boolean
    createdAt?: boolean
    roadmap?: boolean | RoadmapDefaultArgs<ExtArgs>
    node?: boolean | RoadmapNodeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["roadmapProgress"]>

  export type RoadmapProgressSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    roadmapId?: boolean
    nodeId?: boolean
    userId?: boolean
    status?: boolean
    percent?: boolean
    notes?: boolean
    completedAt?: boolean
    updatedAt?: boolean
    createdAt?: boolean
    roadmap?: boolean | RoadmapDefaultArgs<ExtArgs>
    node?: boolean | RoadmapNodeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["roadmapProgress"]>

  export type RoadmapProgressSelectScalar = {
    id?: boolean
    roadmapId?: boolean
    nodeId?: boolean
    userId?: boolean
    status?: boolean
    percent?: boolean
    notes?: boolean
    completedAt?: boolean
    updatedAt?: boolean
    createdAt?: boolean
  }

  export type RoadmapProgressOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "roadmapId" | "nodeId" | "userId" | "status" | "percent" | "notes" | "completedAt" | "updatedAt" | "createdAt", ExtArgs["result"]["roadmapProgress"]>
  export type RoadmapProgressInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    roadmap?: boolean | RoadmapDefaultArgs<ExtArgs>
    node?: boolean | RoadmapNodeDefaultArgs<ExtArgs>
  }
  export type RoadmapProgressIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    roadmap?: boolean | RoadmapDefaultArgs<ExtArgs>
    node?: boolean | RoadmapNodeDefaultArgs<ExtArgs>
  }
  export type RoadmapProgressIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    roadmap?: boolean | RoadmapDefaultArgs<ExtArgs>
    node?: boolean | RoadmapNodeDefaultArgs<ExtArgs>
  }

  export type $RoadmapProgressPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "RoadmapProgress"
    objects: {
      roadmap: Prisma.$RoadmapPayload<ExtArgs>
      node: Prisma.$RoadmapNodePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      roadmapId: string
      nodeId: string
      userId: string
      status: string
      percent: number
      notes: string | null
      completedAt: Date | null
      updatedAt: Date
      createdAt: Date
    }, ExtArgs["result"]["roadmapProgress"]>
    composites: {}
  }

  type RoadmapProgressGetPayload<S extends boolean | null | undefined | RoadmapProgressDefaultArgs> = $Result.GetResult<Prisma.$RoadmapProgressPayload, S>

  type RoadmapProgressCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<RoadmapProgressFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: RoadmapProgressCountAggregateInputType | true
    }

  export interface RoadmapProgressDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['RoadmapProgress'], meta: { name: 'RoadmapProgress' } }
    /**
     * Find zero or one RoadmapProgress that matches the filter.
     * @param {RoadmapProgressFindUniqueArgs} args - Arguments to find a RoadmapProgress
     * @example
     * // Get one RoadmapProgress
     * const roadmapProgress = await prisma.roadmapProgress.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RoadmapProgressFindUniqueArgs>(args: SelectSubset<T, RoadmapProgressFindUniqueArgs<ExtArgs>>): Prisma__RoadmapProgressClient<$Result.GetResult<Prisma.$RoadmapProgressPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one RoadmapProgress that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {RoadmapProgressFindUniqueOrThrowArgs} args - Arguments to find a RoadmapProgress
     * @example
     * // Get one RoadmapProgress
     * const roadmapProgress = await prisma.roadmapProgress.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RoadmapProgressFindUniqueOrThrowArgs>(args: SelectSubset<T, RoadmapProgressFindUniqueOrThrowArgs<ExtArgs>>): Prisma__RoadmapProgressClient<$Result.GetResult<Prisma.$RoadmapProgressPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first RoadmapProgress that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoadmapProgressFindFirstArgs} args - Arguments to find a RoadmapProgress
     * @example
     * // Get one RoadmapProgress
     * const roadmapProgress = await prisma.roadmapProgress.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RoadmapProgressFindFirstArgs>(args?: SelectSubset<T, RoadmapProgressFindFirstArgs<ExtArgs>>): Prisma__RoadmapProgressClient<$Result.GetResult<Prisma.$RoadmapProgressPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first RoadmapProgress that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoadmapProgressFindFirstOrThrowArgs} args - Arguments to find a RoadmapProgress
     * @example
     * // Get one RoadmapProgress
     * const roadmapProgress = await prisma.roadmapProgress.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RoadmapProgressFindFirstOrThrowArgs>(args?: SelectSubset<T, RoadmapProgressFindFirstOrThrowArgs<ExtArgs>>): Prisma__RoadmapProgressClient<$Result.GetResult<Prisma.$RoadmapProgressPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more RoadmapProgresses that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoadmapProgressFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all RoadmapProgresses
     * const roadmapProgresses = await prisma.roadmapProgress.findMany()
     * 
     * // Get first 10 RoadmapProgresses
     * const roadmapProgresses = await prisma.roadmapProgress.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const roadmapProgressWithIdOnly = await prisma.roadmapProgress.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends RoadmapProgressFindManyArgs>(args?: SelectSubset<T, RoadmapProgressFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RoadmapProgressPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a RoadmapProgress.
     * @param {RoadmapProgressCreateArgs} args - Arguments to create a RoadmapProgress.
     * @example
     * // Create one RoadmapProgress
     * const RoadmapProgress = await prisma.roadmapProgress.create({
     *   data: {
     *     // ... data to create a RoadmapProgress
     *   }
     * })
     * 
     */
    create<T extends RoadmapProgressCreateArgs>(args: SelectSubset<T, RoadmapProgressCreateArgs<ExtArgs>>): Prisma__RoadmapProgressClient<$Result.GetResult<Prisma.$RoadmapProgressPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many RoadmapProgresses.
     * @param {RoadmapProgressCreateManyArgs} args - Arguments to create many RoadmapProgresses.
     * @example
     * // Create many RoadmapProgresses
     * const roadmapProgress = await prisma.roadmapProgress.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends RoadmapProgressCreateManyArgs>(args?: SelectSubset<T, RoadmapProgressCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many RoadmapProgresses and returns the data saved in the database.
     * @param {RoadmapProgressCreateManyAndReturnArgs} args - Arguments to create many RoadmapProgresses.
     * @example
     * // Create many RoadmapProgresses
     * const roadmapProgress = await prisma.roadmapProgress.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many RoadmapProgresses and only return the `id`
     * const roadmapProgressWithIdOnly = await prisma.roadmapProgress.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends RoadmapProgressCreateManyAndReturnArgs>(args?: SelectSubset<T, RoadmapProgressCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RoadmapProgressPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a RoadmapProgress.
     * @param {RoadmapProgressDeleteArgs} args - Arguments to delete one RoadmapProgress.
     * @example
     * // Delete one RoadmapProgress
     * const RoadmapProgress = await prisma.roadmapProgress.delete({
     *   where: {
     *     // ... filter to delete one RoadmapProgress
     *   }
     * })
     * 
     */
    delete<T extends RoadmapProgressDeleteArgs>(args: SelectSubset<T, RoadmapProgressDeleteArgs<ExtArgs>>): Prisma__RoadmapProgressClient<$Result.GetResult<Prisma.$RoadmapProgressPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one RoadmapProgress.
     * @param {RoadmapProgressUpdateArgs} args - Arguments to update one RoadmapProgress.
     * @example
     * // Update one RoadmapProgress
     * const roadmapProgress = await prisma.roadmapProgress.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends RoadmapProgressUpdateArgs>(args: SelectSubset<T, RoadmapProgressUpdateArgs<ExtArgs>>): Prisma__RoadmapProgressClient<$Result.GetResult<Prisma.$RoadmapProgressPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more RoadmapProgresses.
     * @param {RoadmapProgressDeleteManyArgs} args - Arguments to filter RoadmapProgresses to delete.
     * @example
     * // Delete a few RoadmapProgresses
     * const { count } = await prisma.roadmapProgress.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends RoadmapProgressDeleteManyArgs>(args?: SelectSubset<T, RoadmapProgressDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RoadmapProgresses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoadmapProgressUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many RoadmapProgresses
     * const roadmapProgress = await prisma.roadmapProgress.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends RoadmapProgressUpdateManyArgs>(args: SelectSubset<T, RoadmapProgressUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RoadmapProgresses and returns the data updated in the database.
     * @param {RoadmapProgressUpdateManyAndReturnArgs} args - Arguments to update many RoadmapProgresses.
     * @example
     * // Update many RoadmapProgresses
     * const roadmapProgress = await prisma.roadmapProgress.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more RoadmapProgresses and only return the `id`
     * const roadmapProgressWithIdOnly = await prisma.roadmapProgress.updateManyAndReturn({
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
    updateManyAndReturn<T extends RoadmapProgressUpdateManyAndReturnArgs>(args: SelectSubset<T, RoadmapProgressUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RoadmapProgressPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one RoadmapProgress.
     * @param {RoadmapProgressUpsertArgs} args - Arguments to update or create a RoadmapProgress.
     * @example
     * // Update or create a RoadmapProgress
     * const roadmapProgress = await prisma.roadmapProgress.upsert({
     *   create: {
     *     // ... data to create a RoadmapProgress
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the RoadmapProgress we want to update
     *   }
     * })
     */
    upsert<T extends RoadmapProgressUpsertArgs>(args: SelectSubset<T, RoadmapProgressUpsertArgs<ExtArgs>>): Prisma__RoadmapProgressClient<$Result.GetResult<Prisma.$RoadmapProgressPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of RoadmapProgresses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoadmapProgressCountArgs} args - Arguments to filter RoadmapProgresses to count.
     * @example
     * // Count the number of RoadmapProgresses
     * const count = await prisma.roadmapProgress.count({
     *   where: {
     *     // ... the filter for the RoadmapProgresses we want to count
     *   }
     * })
    **/
    count<T extends RoadmapProgressCountArgs>(
      args?: Subset<T, RoadmapProgressCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RoadmapProgressCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a RoadmapProgress.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoadmapProgressAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends RoadmapProgressAggregateArgs>(args: Subset<T, RoadmapProgressAggregateArgs>): Prisma.PrismaPromise<GetRoadmapProgressAggregateType<T>>

    /**
     * Group by RoadmapProgress.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoadmapProgressGroupByArgs} args - Group by arguments.
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
      T extends RoadmapProgressGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RoadmapProgressGroupByArgs['orderBy'] }
        : { orderBy?: RoadmapProgressGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, RoadmapProgressGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRoadmapProgressGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the RoadmapProgress model
   */
  readonly fields: RoadmapProgressFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for RoadmapProgress.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RoadmapProgressClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    roadmap<T extends RoadmapDefaultArgs<ExtArgs> = {}>(args?: Subset<T, RoadmapDefaultArgs<ExtArgs>>): Prisma__RoadmapClient<$Result.GetResult<Prisma.$RoadmapPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    node<T extends RoadmapNodeDefaultArgs<ExtArgs> = {}>(args?: Subset<T, RoadmapNodeDefaultArgs<ExtArgs>>): Prisma__RoadmapNodeClient<$Result.GetResult<Prisma.$RoadmapNodePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the RoadmapProgress model
   */
  interface RoadmapProgressFieldRefs {
    readonly id: FieldRef<"RoadmapProgress", 'String'>
    readonly roadmapId: FieldRef<"RoadmapProgress", 'String'>
    readonly nodeId: FieldRef<"RoadmapProgress", 'String'>
    readonly userId: FieldRef<"RoadmapProgress", 'String'>
    readonly status: FieldRef<"RoadmapProgress", 'String'>
    readonly percent: FieldRef<"RoadmapProgress", 'Int'>
    readonly notes: FieldRef<"RoadmapProgress", 'String'>
    readonly completedAt: FieldRef<"RoadmapProgress", 'DateTime'>
    readonly updatedAt: FieldRef<"RoadmapProgress", 'DateTime'>
    readonly createdAt: FieldRef<"RoadmapProgress", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * RoadmapProgress findUnique
   */
  export type RoadmapProgressFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoadmapProgress
     */
    select?: RoadmapProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoadmapProgress
     */
    omit?: RoadmapProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoadmapProgressInclude<ExtArgs> | null
    /**
     * Filter, which RoadmapProgress to fetch.
     */
    where: RoadmapProgressWhereUniqueInput
  }

  /**
   * RoadmapProgress findUniqueOrThrow
   */
  export type RoadmapProgressFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoadmapProgress
     */
    select?: RoadmapProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoadmapProgress
     */
    omit?: RoadmapProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoadmapProgressInclude<ExtArgs> | null
    /**
     * Filter, which RoadmapProgress to fetch.
     */
    where: RoadmapProgressWhereUniqueInput
  }

  /**
   * RoadmapProgress findFirst
   */
  export type RoadmapProgressFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoadmapProgress
     */
    select?: RoadmapProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoadmapProgress
     */
    omit?: RoadmapProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoadmapProgressInclude<ExtArgs> | null
    /**
     * Filter, which RoadmapProgress to fetch.
     */
    where?: RoadmapProgressWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RoadmapProgresses to fetch.
     */
    orderBy?: RoadmapProgressOrderByWithRelationInput | RoadmapProgressOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RoadmapProgresses.
     */
    cursor?: RoadmapProgressWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RoadmapProgresses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RoadmapProgresses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RoadmapProgresses.
     */
    distinct?: RoadmapProgressScalarFieldEnum | RoadmapProgressScalarFieldEnum[]
  }

  /**
   * RoadmapProgress findFirstOrThrow
   */
  export type RoadmapProgressFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoadmapProgress
     */
    select?: RoadmapProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoadmapProgress
     */
    omit?: RoadmapProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoadmapProgressInclude<ExtArgs> | null
    /**
     * Filter, which RoadmapProgress to fetch.
     */
    where?: RoadmapProgressWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RoadmapProgresses to fetch.
     */
    orderBy?: RoadmapProgressOrderByWithRelationInput | RoadmapProgressOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RoadmapProgresses.
     */
    cursor?: RoadmapProgressWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RoadmapProgresses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RoadmapProgresses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RoadmapProgresses.
     */
    distinct?: RoadmapProgressScalarFieldEnum | RoadmapProgressScalarFieldEnum[]
  }

  /**
   * RoadmapProgress findMany
   */
  export type RoadmapProgressFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoadmapProgress
     */
    select?: RoadmapProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoadmapProgress
     */
    omit?: RoadmapProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoadmapProgressInclude<ExtArgs> | null
    /**
     * Filter, which RoadmapProgresses to fetch.
     */
    where?: RoadmapProgressWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RoadmapProgresses to fetch.
     */
    orderBy?: RoadmapProgressOrderByWithRelationInput | RoadmapProgressOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing RoadmapProgresses.
     */
    cursor?: RoadmapProgressWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RoadmapProgresses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RoadmapProgresses.
     */
    skip?: number
    distinct?: RoadmapProgressScalarFieldEnum | RoadmapProgressScalarFieldEnum[]
  }

  /**
   * RoadmapProgress create
   */
  export type RoadmapProgressCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoadmapProgress
     */
    select?: RoadmapProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoadmapProgress
     */
    omit?: RoadmapProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoadmapProgressInclude<ExtArgs> | null
    /**
     * The data needed to create a RoadmapProgress.
     */
    data: XOR<RoadmapProgressCreateInput, RoadmapProgressUncheckedCreateInput>
  }

  /**
   * RoadmapProgress createMany
   */
  export type RoadmapProgressCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many RoadmapProgresses.
     */
    data: RoadmapProgressCreateManyInput | RoadmapProgressCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * RoadmapProgress createManyAndReturn
   */
  export type RoadmapProgressCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoadmapProgress
     */
    select?: RoadmapProgressSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the RoadmapProgress
     */
    omit?: RoadmapProgressOmit<ExtArgs> | null
    /**
     * The data used to create many RoadmapProgresses.
     */
    data: RoadmapProgressCreateManyInput | RoadmapProgressCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoadmapProgressIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * RoadmapProgress update
   */
  export type RoadmapProgressUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoadmapProgress
     */
    select?: RoadmapProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoadmapProgress
     */
    omit?: RoadmapProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoadmapProgressInclude<ExtArgs> | null
    /**
     * The data needed to update a RoadmapProgress.
     */
    data: XOR<RoadmapProgressUpdateInput, RoadmapProgressUncheckedUpdateInput>
    /**
     * Choose, which RoadmapProgress to update.
     */
    where: RoadmapProgressWhereUniqueInput
  }

  /**
   * RoadmapProgress updateMany
   */
  export type RoadmapProgressUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update RoadmapProgresses.
     */
    data: XOR<RoadmapProgressUpdateManyMutationInput, RoadmapProgressUncheckedUpdateManyInput>
    /**
     * Filter which RoadmapProgresses to update
     */
    where?: RoadmapProgressWhereInput
    /**
     * Limit how many RoadmapProgresses to update.
     */
    limit?: number
  }

  /**
   * RoadmapProgress updateManyAndReturn
   */
  export type RoadmapProgressUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoadmapProgress
     */
    select?: RoadmapProgressSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the RoadmapProgress
     */
    omit?: RoadmapProgressOmit<ExtArgs> | null
    /**
     * The data used to update RoadmapProgresses.
     */
    data: XOR<RoadmapProgressUpdateManyMutationInput, RoadmapProgressUncheckedUpdateManyInput>
    /**
     * Filter which RoadmapProgresses to update
     */
    where?: RoadmapProgressWhereInput
    /**
     * Limit how many RoadmapProgresses to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoadmapProgressIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * RoadmapProgress upsert
   */
  export type RoadmapProgressUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoadmapProgress
     */
    select?: RoadmapProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoadmapProgress
     */
    omit?: RoadmapProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoadmapProgressInclude<ExtArgs> | null
    /**
     * The filter to search for the RoadmapProgress to update in case it exists.
     */
    where: RoadmapProgressWhereUniqueInput
    /**
     * In case the RoadmapProgress found by the `where` argument doesn't exist, create a new RoadmapProgress with this data.
     */
    create: XOR<RoadmapProgressCreateInput, RoadmapProgressUncheckedCreateInput>
    /**
     * In case the RoadmapProgress was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RoadmapProgressUpdateInput, RoadmapProgressUncheckedUpdateInput>
  }

  /**
   * RoadmapProgress delete
   */
  export type RoadmapProgressDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoadmapProgress
     */
    select?: RoadmapProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoadmapProgress
     */
    omit?: RoadmapProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoadmapProgressInclude<ExtArgs> | null
    /**
     * Filter which RoadmapProgress to delete.
     */
    where: RoadmapProgressWhereUniqueInput
  }

  /**
   * RoadmapProgress deleteMany
   */
  export type RoadmapProgressDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RoadmapProgresses to delete
     */
    where?: RoadmapProgressWhereInput
    /**
     * Limit how many RoadmapProgresses to delete.
     */
    limit?: number
  }

  /**
   * RoadmapProgress without action
   */
  export type RoadmapProgressDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoadmapProgress
     */
    select?: RoadmapProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoadmapProgress
     */
    omit?: RoadmapProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoadmapProgressInclude<ExtArgs> | null
  }


  /**
   * Model RoadmapTemplate
   */

  export type AggregateRoadmapTemplate = {
    _count: RoadmapTemplateCountAggregateOutputType | null
    _min: RoadmapTemplateMinAggregateOutputType | null
    _max: RoadmapTemplateMaxAggregateOutputType | null
  }

  export type RoadmapTemplateMinAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    category: string | null
    isPublic: boolean | null
    authorId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type RoadmapTemplateMaxAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    category: string | null
    isPublic: boolean | null
    authorId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type RoadmapTemplateCountAggregateOutputType = {
    id: number
    name: number
    description: number
    category: number
    isPublic: number
    authorId: number
    definition: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type RoadmapTemplateMinAggregateInputType = {
    id?: true
    name?: true
    description?: true
    category?: true
    isPublic?: true
    authorId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type RoadmapTemplateMaxAggregateInputType = {
    id?: true
    name?: true
    description?: true
    category?: true
    isPublic?: true
    authorId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type RoadmapTemplateCountAggregateInputType = {
    id?: true
    name?: true
    description?: true
    category?: true
    isPublic?: true
    authorId?: true
    definition?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type RoadmapTemplateAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RoadmapTemplate to aggregate.
     */
    where?: RoadmapTemplateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RoadmapTemplates to fetch.
     */
    orderBy?: RoadmapTemplateOrderByWithRelationInput | RoadmapTemplateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RoadmapTemplateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RoadmapTemplates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RoadmapTemplates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned RoadmapTemplates
    **/
    _count?: true | RoadmapTemplateCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RoadmapTemplateMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RoadmapTemplateMaxAggregateInputType
  }

  export type GetRoadmapTemplateAggregateType<T extends RoadmapTemplateAggregateArgs> = {
        [P in keyof T & keyof AggregateRoadmapTemplate]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRoadmapTemplate[P]>
      : GetScalarType<T[P], AggregateRoadmapTemplate[P]>
  }




  export type RoadmapTemplateGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RoadmapTemplateWhereInput
    orderBy?: RoadmapTemplateOrderByWithAggregationInput | RoadmapTemplateOrderByWithAggregationInput[]
    by: RoadmapTemplateScalarFieldEnum[] | RoadmapTemplateScalarFieldEnum
    having?: RoadmapTemplateScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RoadmapTemplateCountAggregateInputType | true
    _min?: RoadmapTemplateMinAggregateInputType
    _max?: RoadmapTemplateMaxAggregateInputType
  }

  export type RoadmapTemplateGroupByOutputType = {
    id: string
    name: string
    description: string | null
    category: string | null
    isPublic: boolean
    authorId: string | null
    definition: JsonValue
    createdAt: Date
    updatedAt: Date
    _count: RoadmapTemplateCountAggregateOutputType | null
    _min: RoadmapTemplateMinAggregateOutputType | null
    _max: RoadmapTemplateMaxAggregateOutputType | null
  }

  type GetRoadmapTemplateGroupByPayload<T extends RoadmapTemplateGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RoadmapTemplateGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RoadmapTemplateGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RoadmapTemplateGroupByOutputType[P]>
            : GetScalarType<T[P], RoadmapTemplateGroupByOutputType[P]>
        }
      >
    >


  export type RoadmapTemplateSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    category?: boolean
    isPublic?: boolean
    authorId?: boolean
    definition?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["roadmapTemplate"]>

  export type RoadmapTemplateSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    category?: boolean
    isPublic?: boolean
    authorId?: boolean
    definition?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["roadmapTemplate"]>

  export type RoadmapTemplateSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    category?: boolean
    isPublic?: boolean
    authorId?: boolean
    definition?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["roadmapTemplate"]>

  export type RoadmapTemplateSelectScalar = {
    id?: boolean
    name?: boolean
    description?: boolean
    category?: boolean
    isPublic?: boolean
    authorId?: boolean
    definition?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type RoadmapTemplateOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "description" | "category" | "isPublic" | "authorId" | "definition" | "createdAt" | "updatedAt", ExtArgs["result"]["roadmapTemplate"]>

  export type $RoadmapTemplatePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "RoadmapTemplate"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      description: string | null
      category: string | null
      isPublic: boolean
      authorId: string | null
      definition: Prisma.JsonValue
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["roadmapTemplate"]>
    composites: {}
  }

  type RoadmapTemplateGetPayload<S extends boolean | null | undefined | RoadmapTemplateDefaultArgs> = $Result.GetResult<Prisma.$RoadmapTemplatePayload, S>

  type RoadmapTemplateCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<RoadmapTemplateFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: RoadmapTemplateCountAggregateInputType | true
    }

  export interface RoadmapTemplateDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['RoadmapTemplate'], meta: { name: 'RoadmapTemplate' } }
    /**
     * Find zero or one RoadmapTemplate that matches the filter.
     * @param {RoadmapTemplateFindUniqueArgs} args - Arguments to find a RoadmapTemplate
     * @example
     * // Get one RoadmapTemplate
     * const roadmapTemplate = await prisma.roadmapTemplate.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RoadmapTemplateFindUniqueArgs>(args: SelectSubset<T, RoadmapTemplateFindUniqueArgs<ExtArgs>>): Prisma__RoadmapTemplateClient<$Result.GetResult<Prisma.$RoadmapTemplatePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one RoadmapTemplate that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {RoadmapTemplateFindUniqueOrThrowArgs} args - Arguments to find a RoadmapTemplate
     * @example
     * // Get one RoadmapTemplate
     * const roadmapTemplate = await prisma.roadmapTemplate.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RoadmapTemplateFindUniqueOrThrowArgs>(args: SelectSubset<T, RoadmapTemplateFindUniqueOrThrowArgs<ExtArgs>>): Prisma__RoadmapTemplateClient<$Result.GetResult<Prisma.$RoadmapTemplatePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first RoadmapTemplate that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoadmapTemplateFindFirstArgs} args - Arguments to find a RoadmapTemplate
     * @example
     * // Get one RoadmapTemplate
     * const roadmapTemplate = await prisma.roadmapTemplate.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RoadmapTemplateFindFirstArgs>(args?: SelectSubset<T, RoadmapTemplateFindFirstArgs<ExtArgs>>): Prisma__RoadmapTemplateClient<$Result.GetResult<Prisma.$RoadmapTemplatePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first RoadmapTemplate that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoadmapTemplateFindFirstOrThrowArgs} args - Arguments to find a RoadmapTemplate
     * @example
     * // Get one RoadmapTemplate
     * const roadmapTemplate = await prisma.roadmapTemplate.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RoadmapTemplateFindFirstOrThrowArgs>(args?: SelectSubset<T, RoadmapTemplateFindFirstOrThrowArgs<ExtArgs>>): Prisma__RoadmapTemplateClient<$Result.GetResult<Prisma.$RoadmapTemplatePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more RoadmapTemplates that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoadmapTemplateFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all RoadmapTemplates
     * const roadmapTemplates = await prisma.roadmapTemplate.findMany()
     * 
     * // Get first 10 RoadmapTemplates
     * const roadmapTemplates = await prisma.roadmapTemplate.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const roadmapTemplateWithIdOnly = await prisma.roadmapTemplate.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends RoadmapTemplateFindManyArgs>(args?: SelectSubset<T, RoadmapTemplateFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RoadmapTemplatePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a RoadmapTemplate.
     * @param {RoadmapTemplateCreateArgs} args - Arguments to create a RoadmapTemplate.
     * @example
     * // Create one RoadmapTemplate
     * const RoadmapTemplate = await prisma.roadmapTemplate.create({
     *   data: {
     *     // ... data to create a RoadmapTemplate
     *   }
     * })
     * 
     */
    create<T extends RoadmapTemplateCreateArgs>(args: SelectSubset<T, RoadmapTemplateCreateArgs<ExtArgs>>): Prisma__RoadmapTemplateClient<$Result.GetResult<Prisma.$RoadmapTemplatePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many RoadmapTemplates.
     * @param {RoadmapTemplateCreateManyArgs} args - Arguments to create many RoadmapTemplates.
     * @example
     * // Create many RoadmapTemplates
     * const roadmapTemplate = await prisma.roadmapTemplate.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends RoadmapTemplateCreateManyArgs>(args?: SelectSubset<T, RoadmapTemplateCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many RoadmapTemplates and returns the data saved in the database.
     * @param {RoadmapTemplateCreateManyAndReturnArgs} args - Arguments to create many RoadmapTemplates.
     * @example
     * // Create many RoadmapTemplates
     * const roadmapTemplate = await prisma.roadmapTemplate.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many RoadmapTemplates and only return the `id`
     * const roadmapTemplateWithIdOnly = await prisma.roadmapTemplate.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends RoadmapTemplateCreateManyAndReturnArgs>(args?: SelectSubset<T, RoadmapTemplateCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RoadmapTemplatePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a RoadmapTemplate.
     * @param {RoadmapTemplateDeleteArgs} args - Arguments to delete one RoadmapTemplate.
     * @example
     * // Delete one RoadmapTemplate
     * const RoadmapTemplate = await prisma.roadmapTemplate.delete({
     *   where: {
     *     // ... filter to delete one RoadmapTemplate
     *   }
     * })
     * 
     */
    delete<T extends RoadmapTemplateDeleteArgs>(args: SelectSubset<T, RoadmapTemplateDeleteArgs<ExtArgs>>): Prisma__RoadmapTemplateClient<$Result.GetResult<Prisma.$RoadmapTemplatePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one RoadmapTemplate.
     * @param {RoadmapTemplateUpdateArgs} args - Arguments to update one RoadmapTemplate.
     * @example
     * // Update one RoadmapTemplate
     * const roadmapTemplate = await prisma.roadmapTemplate.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends RoadmapTemplateUpdateArgs>(args: SelectSubset<T, RoadmapTemplateUpdateArgs<ExtArgs>>): Prisma__RoadmapTemplateClient<$Result.GetResult<Prisma.$RoadmapTemplatePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more RoadmapTemplates.
     * @param {RoadmapTemplateDeleteManyArgs} args - Arguments to filter RoadmapTemplates to delete.
     * @example
     * // Delete a few RoadmapTemplates
     * const { count } = await prisma.roadmapTemplate.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends RoadmapTemplateDeleteManyArgs>(args?: SelectSubset<T, RoadmapTemplateDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RoadmapTemplates.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoadmapTemplateUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many RoadmapTemplates
     * const roadmapTemplate = await prisma.roadmapTemplate.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends RoadmapTemplateUpdateManyArgs>(args: SelectSubset<T, RoadmapTemplateUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RoadmapTemplates and returns the data updated in the database.
     * @param {RoadmapTemplateUpdateManyAndReturnArgs} args - Arguments to update many RoadmapTemplates.
     * @example
     * // Update many RoadmapTemplates
     * const roadmapTemplate = await prisma.roadmapTemplate.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more RoadmapTemplates and only return the `id`
     * const roadmapTemplateWithIdOnly = await prisma.roadmapTemplate.updateManyAndReturn({
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
    updateManyAndReturn<T extends RoadmapTemplateUpdateManyAndReturnArgs>(args: SelectSubset<T, RoadmapTemplateUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RoadmapTemplatePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one RoadmapTemplate.
     * @param {RoadmapTemplateUpsertArgs} args - Arguments to update or create a RoadmapTemplate.
     * @example
     * // Update or create a RoadmapTemplate
     * const roadmapTemplate = await prisma.roadmapTemplate.upsert({
     *   create: {
     *     // ... data to create a RoadmapTemplate
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the RoadmapTemplate we want to update
     *   }
     * })
     */
    upsert<T extends RoadmapTemplateUpsertArgs>(args: SelectSubset<T, RoadmapTemplateUpsertArgs<ExtArgs>>): Prisma__RoadmapTemplateClient<$Result.GetResult<Prisma.$RoadmapTemplatePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of RoadmapTemplates.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoadmapTemplateCountArgs} args - Arguments to filter RoadmapTemplates to count.
     * @example
     * // Count the number of RoadmapTemplates
     * const count = await prisma.roadmapTemplate.count({
     *   where: {
     *     // ... the filter for the RoadmapTemplates we want to count
     *   }
     * })
    **/
    count<T extends RoadmapTemplateCountArgs>(
      args?: Subset<T, RoadmapTemplateCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RoadmapTemplateCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a RoadmapTemplate.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoadmapTemplateAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends RoadmapTemplateAggregateArgs>(args: Subset<T, RoadmapTemplateAggregateArgs>): Prisma.PrismaPromise<GetRoadmapTemplateAggregateType<T>>

    /**
     * Group by RoadmapTemplate.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoadmapTemplateGroupByArgs} args - Group by arguments.
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
      T extends RoadmapTemplateGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RoadmapTemplateGroupByArgs['orderBy'] }
        : { orderBy?: RoadmapTemplateGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, RoadmapTemplateGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRoadmapTemplateGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the RoadmapTemplate model
   */
  readonly fields: RoadmapTemplateFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for RoadmapTemplate.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RoadmapTemplateClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
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
   * Fields of the RoadmapTemplate model
   */
  interface RoadmapTemplateFieldRefs {
    readonly id: FieldRef<"RoadmapTemplate", 'String'>
    readonly name: FieldRef<"RoadmapTemplate", 'String'>
    readonly description: FieldRef<"RoadmapTemplate", 'String'>
    readonly category: FieldRef<"RoadmapTemplate", 'String'>
    readonly isPublic: FieldRef<"RoadmapTemplate", 'Boolean'>
    readonly authorId: FieldRef<"RoadmapTemplate", 'String'>
    readonly definition: FieldRef<"RoadmapTemplate", 'Json'>
    readonly createdAt: FieldRef<"RoadmapTemplate", 'DateTime'>
    readonly updatedAt: FieldRef<"RoadmapTemplate", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * RoadmapTemplate findUnique
   */
  export type RoadmapTemplateFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoadmapTemplate
     */
    select?: RoadmapTemplateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoadmapTemplate
     */
    omit?: RoadmapTemplateOmit<ExtArgs> | null
    /**
     * Filter, which RoadmapTemplate to fetch.
     */
    where: RoadmapTemplateWhereUniqueInput
  }

  /**
   * RoadmapTemplate findUniqueOrThrow
   */
  export type RoadmapTemplateFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoadmapTemplate
     */
    select?: RoadmapTemplateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoadmapTemplate
     */
    omit?: RoadmapTemplateOmit<ExtArgs> | null
    /**
     * Filter, which RoadmapTemplate to fetch.
     */
    where: RoadmapTemplateWhereUniqueInput
  }

  /**
   * RoadmapTemplate findFirst
   */
  export type RoadmapTemplateFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoadmapTemplate
     */
    select?: RoadmapTemplateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoadmapTemplate
     */
    omit?: RoadmapTemplateOmit<ExtArgs> | null
    /**
     * Filter, which RoadmapTemplate to fetch.
     */
    where?: RoadmapTemplateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RoadmapTemplates to fetch.
     */
    orderBy?: RoadmapTemplateOrderByWithRelationInput | RoadmapTemplateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RoadmapTemplates.
     */
    cursor?: RoadmapTemplateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RoadmapTemplates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RoadmapTemplates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RoadmapTemplates.
     */
    distinct?: RoadmapTemplateScalarFieldEnum | RoadmapTemplateScalarFieldEnum[]
  }

  /**
   * RoadmapTemplate findFirstOrThrow
   */
  export type RoadmapTemplateFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoadmapTemplate
     */
    select?: RoadmapTemplateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoadmapTemplate
     */
    omit?: RoadmapTemplateOmit<ExtArgs> | null
    /**
     * Filter, which RoadmapTemplate to fetch.
     */
    where?: RoadmapTemplateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RoadmapTemplates to fetch.
     */
    orderBy?: RoadmapTemplateOrderByWithRelationInput | RoadmapTemplateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RoadmapTemplates.
     */
    cursor?: RoadmapTemplateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RoadmapTemplates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RoadmapTemplates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RoadmapTemplates.
     */
    distinct?: RoadmapTemplateScalarFieldEnum | RoadmapTemplateScalarFieldEnum[]
  }

  /**
   * RoadmapTemplate findMany
   */
  export type RoadmapTemplateFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoadmapTemplate
     */
    select?: RoadmapTemplateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoadmapTemplate
     */
    omit?: RoadmapTemplateOmit<ExtArgs> | null
    /**
     * Filter, which RoadmapTemplates to fetch.
     */
    where?: RoadmapTemplateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RoadmapTemplates to fetch.
     */
    orderBy?: RoadmapTemplateOrderByWithRelationInput | RoadmapTemplateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing RoadmapTemplates.
     */
    cursor?: RoadmapTemplateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RoadmapTemplates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RoadmapTemplates.
     */
    skip?: number
    distinct?: RoadmapTemplateScalarFieldEnum | RoadmapTemplateScalarFieldEnum[]
  }

  /**
   * RoadmapTemplate create
   */
  export type RoadmapTemplateCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoadmapTemplate
     */
    select?: RoadmapTemplateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoadmapTemplate
     */
    omit?: RoadmapTemplateOmit<ExtArgs> | null
    /**
     * The data needed to create a RoadmapTemplate.
     */
    data: XOR<RoadmapTemplateCreateInput, RoadmapTemplateUncheckedCreateInput>
  }

  /**
   * RoadmapTemplate createMany
   */
  export type RoadmapTemplateCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many RoadmapTemplates.
     */
    data: RoadmapTemplateCreateManyInput | RoadmapTemplateCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * RoadmapTemplate createManyAndReturn
   */
  export type RoadmapTemplateCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoadmapTemplate
     */
    select?: RoadmapTemplateSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the RoadmapTemplate
     */
    omit?: RoadmapTemplateOmit<ExtArgs> | null
    /**
     * The data used to create many RoadmapTemplates.
     */
    data: RoadmapTemplateCreateManyInput | RoadmapTemplateCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * RoadmapTemplate update
   */
  export type RoadmapTemplateUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoadmapTemplate
     */
    select?: RoadmapTemplateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoadmapTemplate
     */
    omit?: RoadmapTemplateOmit<ExtArgs> | null
    /**
     * The data needed to update a RoadmapTemplate.
     */
    data: XOR<RoadmapTemplateUpdateInput, RoadmapTemplateUncheckedUpdateInput>
    /**
     * Choose, which RoadmapTemplate to update.
     */
    where: RoadmapTemplateWhereUniqueInput
  }

  /**
   * RoadmapTemplate updateMany
   */
  export type RoadmapTemplateUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update RoadmapTemplates.
     */
    data: XOR<RoadmapTemplateUpdateManyMutationInput, RoadmapTemplateUncheckedUpdateManyInput>
    /**
     * Filter which RoadmapTemplates to update
     */
    where?: RoadmapTemplateWhereInput
    /**
     * Limit how many RoadmapTemplates to update.
     */
    limit?: number
  }

  /**
   * RoadmapTemplate updateManyAndReturn
   */
  export type RoadmapTemplateUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoadmapTemplate
     */
    select?: RoadmapTemplateSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the RoadmapTemplate
     */
    omit?: RoadmapTemplateOmit<ExtArgs> | null
    /**
     * The data used to update RoadmapTemplates.
     */
    data: XOR<RoadmapTemplateUpdateManyMutationInput, RoadmapTemplateUncheckedUpdateManyInput>
    /**
     * Filter which RoadmapTemplates to update
     */
    where?: RoadmapTemplateWhereInput
    /**
     * Limit how many RoadmapTemplates to update.
     */
    limit?: number
  }

  /**
   * RoadmapTemplate upsert
   */
  export type RoadmapTemplateUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoadmapTemplate
     */
    select?: RoadmapTemplateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoadmapTemplate
     */
    omit?: RoadmapTemplateOmit<ExtArgs> | null
    /**
     * The filter to search for the RoadmapTemplate to update in case it exists.
     */
    where: RoadmapTemplateWhereUniqueInput
    /**
     * In case the RoadmapTemplate found by the `where` argument doesn't exist, create a new RoadmapTemplate with this data.
     */
    create: XOR<RoadmapTemplateCreateInput, RoadmapTemplateUncheckedCreateInput>
    /**
     * In case the RoadmapTemplate was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RoadmapTemplateUpdateInput, RoadmapTemplateUncheckedUpdateInput>
  }

  /**
   * RoadmapTemplate delete
   */
  export type RoadmapTemplateDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoadmapTemplate
     */
    select?: RoadmapTemplateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoadmapTemplate
     */
    omit?: RoadmapTemplateOmit<ExtArgs> | null
    /**
     * Filter which RoadmapTemplate to delete.
     */
    where: RoadmapTemplateWhereUniqueInput
  }

  /**
   * RoadmapTemplate deleteMany
   */
  export type RoadmapTemplateDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RoadmapTemplates to delete
     */
    where?: RoadmapTemplateWhereInput
    /**
     * Limit how many RoadmapTemplates to delete.
     */
    limit?: number
  }

  /**
   * RoadmapTemplate without action
   */
  export type RoadmapTemplateDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoadmapTemplate
     */
    select?: RoadmapTemplateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoadmapTemplate
     */
    omit?: RoadmapTemplateOmit<ExtArgs> | null
  }


  /**
   * Model RoadmapShare
   */

  export type AggregateRoadmapShare = {
    _count: RoadmapShareCountAggregateOutputType | null
    _min: RoadmapShareMinAggregateOutputType | null
    _max: RoadmapShareMaxAggregateOutputType | null
  }

  export type RoadmapShareMinAggregateOutputType = {
    id: string | null
    roadmapId: string | null
    token: string | null
    expiresAt: Date | null
    access: string | null
    createdAt: Date | null
  }

  export type RoadmapShareMaxAggregateOutputType = {
    id: string | null
    roadmapId: string | null
    token: string | null
    expiresAt: Date | null
    access: string | null
    createdAt: Date | null
  }

  export type RoadmapShareCountAggregateOutputType = {
    id: number
    roadmapId: number
    token: number
    expiresAt: number
    access: number
    createdAt: number
    _all: number
  }


  export type RoadmapShareMinAggregateInputType = {
    id?: true
    roadmapId?: true
    token?: true
    expiresAt?: true
    access?: true
    createdAt?: true
  }

  export type RoadmapShareMaxAggregateInputType = {
    id?: true
    roadmapId?: true
    token?: true
    expiresAt?: true
    access?: true
    createdAt?: true
  }

  export type RoadmapShareCountAggregateInputType = {
    id?: true
    roadmapId?: true
    token?: true
    expiresAt?: true
    access?: true
    createdAt?: true
    _all?: true
  }

  export type RoadmapShareAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RoadmapShare to aggregate.
     */
    where?: RoadmapShareWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RoadmapShares to fetch.
     */
    orderBy?: RoadmapShareOrderByWithRelationInput | RoadmapShareOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RoadmapShareWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RoadmapShares from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RoadmapShares.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned RoadmapShares
    **/
    _count?: true | RoadmapShareCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RoadmapShareMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RoadmapShareMaxAggregateInputType
  }

  export type GetRoadmapShareAggregateType<T extends RoadmapShareAggregateArgs> = {
        [P in keyof T & keyof AggregateRoadmapShare]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRoadmapShare[P]>
      : GetScalarType<T[P], AggregateRoadmapShare[P]>
  }




  export type RoadmapShareGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RoadmapShareWhereInput
    orderBy?: RoadmapShareOrderByWithAggregationInput | RoadmapShareOrderByWithAggregationInput[]
    by: RoadmapShareScalarFieldEnum[] | RoadmapShareScalarFieldEnum
    having?: RoadmapShareScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RoadmapShareCountAggregateInputType | true
    _min?: RoadmapShareMinAggregateInputType
    _max?: RoadmapShareMaxAggregateInputType
  }

  export type RoadmapShareGroupByOutputType = {
    id: string
    roadmapId: string
    token: string
    expiresAt: Date | null
    access: string
    createdAt: Date
    _count: RoadmapShareCountAggregateOutputType | null
    _min: RoadmapShareMinAggregateOutputType | null
    _max: RoadmapShareMaxAggregateOutputType | null
  }

  type GetRoadmapShareGroupByPayload<T extends RoadmapShareGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RoadmapShareGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RoadmapShareGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RoadmapShareGroupByOutputType[P]>
            : GetScalarType<T[P], RoadmapShareGroupByOutputType[P]>
        }
      >
    >


  export type RoadmapShareSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    roadmapId?: boolean
    token?: boolean
    expiresAt?: boolean
    access?: boolean
    createdAt?: boolean
    roadmap?: boolean | RoadmapDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["roadmapShare"]>

  export type RoadmapShareSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    roadmapId?: boolean
    token?: boolean
    expiresAt?: boolean
    access?: boolean
    createdAt?: boolean
    roadmap?: boolean | RoadmapDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["roadmapShare"]>

  export type RoadmapShareSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    roadmapId?: boolean
    token?: boolean
    expiresAt?: boolean
    access?: boolean
    createdAt?: boolean
    roadmap?: boolean | RoadmapDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["roadmapShare"]>

  export type RoadmapShareSelectScalar = {
    id?: boolean
    roadmapId?: boolean
    token?: boolean
    expiresAt?: boolean
    access?: boolean
    createdAt?: boolean
  }

  export type RoadmapShareOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "roadmapId" | "token" | "expiresAt" | "access" | "createdAt", ExtArgs["result"]["roadmapShare"]>
  export type RoadmapShareInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    roadmap?: boolean | RoadmapDefaultArgs<ExtArgs>
  }
  export type RoadmapShareIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    roadmap?: boolean | RoadmapDefaultArgs<ExtArgs>
  }
  export type RoadmapShareIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    roadmap?: boolean | RoadmapDefaultArgs<ExtArgs>
  }

  export type $RoadmapSharePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "RoadmapShare"
    objects: {
      roadmap: Prisma.$RoadmapPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      roadmapId: string
      token: string
      expiresAt: Date | null
      access: string
      createdAt: Date
    }, ExtArgs["result"]["roadmapShare"]>
    composites: {}
  }

  type RoadmapShareGetPayload<S extends boolean | null | undefined | RoadmapShareDefaultArgs> = $Result.GetResult<Prisma.$RoadmapSharePayload, S>

  type RoadmapShareCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<RoadmapShareFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: RoadmapShareCountAggregateInputType | true
    }

  export interface RoadmapShareDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['RoadmapShare'], meta: { name: 'RoadmapShare' } }
    /**
     * Find zero or one RoadmapShare that matches the filter.
     * @param {RoadmapShareFindUniqueArgs} args - Arguments to find a RoadmapShare
     * @example
     * // Get one RoadmapShare
     * const roadmapShare = await prisma.roadmapShare.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RoadmapShareFindUniqueArgs>(args: SelectSubset<T, RoadmapShareFindUniqueArgs<ExtArgs>>): Prisma__RoadmapShareClient<$Result.GetResult<Prisma.$RoadmapSharePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one RoadmapShare that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {RoadmapShareFindUniqueOrThrowArgs} args - Arguments to find a RoadmapShare
     * @example
     * // Get one RoadmapShare
     * const roadmapShare = await prisma.roadmapShare.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RoadmapShareFindUniqueOrThrowArgs>(args: SelectSubset<T, RoadmapShareFindUniqueOrThrowArgs<ExtArgs>>): Prisma__RoadmapShareClient<$Result.GetResult<Prisma.$RoadmapSharePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first RoadmapShare that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoadmapShareFindFirstArgs} args - Arguments to find a RoadmapShare
     * @example
     * // Get one RoadmapShare
     * const roadmapShare = await prisma.roadmapShare.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RoadmapShareFindFirstArgs>(args?: SelectSubset<T, RoadmapShareFindFirstArgs<ExtArgs>>): Prisma__RoadmapShareClient<$Result.GetResult<Prisma.$RoadmapSharePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first RoadmapShare that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoadmapShareFindFirstOrThrowArgs} args - Arguments to find a RoadmapShare
     * @example
     * // Get one RoadmapShare
     * const roadmapShare = await prisma.roadmapShare.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RoadmapShareFindFirstOrThrowArgs>(args?: SelectSubset<T, RoadmapShareFindFirstOrThrowArgs<ExtArgs>>): Prisma__RoadmapShareClient<$Result.GetResult<Prisma.$RoadmapSharePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more RoadmapShares that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoadmapShareFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all RoadmapShares
     * const roadmapShares = await prisma.roadmapShare.findMany()
     * 
     * // Get first 10 RoadmapShares
     * const roadmapShares = await prisma.roadmapShare.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const roadmapShareWithIdOnly = await prisma.roadmapShare.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends RoadmapShareFindManyArgs>(args?: SelectSubset<T, RoadmapShareFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RoadmapSharePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a RoadmapShare.
     * @param {RoadmapShareCreateArgs} args - Arguments to create a RoadmapShare.
     * @example
     * // Create one RoadmapShare
     * const RoadmapShare = await prisma.roadmapShare.create({
     *   data: {
     *     // ... data to create a RoadmapShare
     *   }
     * })
     * 
     */
    create<T extends RoadmapShareCreateArgs>(args: SelectSubset<T, RoadmapShareCreateArgs<ExtArgs>>): Prisma__RoadmapShareClient<$Result.GetResult<Prisma.$RoadmapSharePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many RoadmapShares.
     * @param {RoadmapShareCreateManyArgs} args - Arguments to create many RoadmapShares.
     * @example
     * // Create many RoadmapShares
     * const roadmapShare = await prisma.roadmapShare.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends RoadmapShareCreateManyArgs>(args?: SelectSubset<T, RoadmapShareCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many RoadmapShares and returns the data saved in the database.
     * @param {RoadmapShareCreateManyAndReturnArgs} args - Arguments to create many RoadmapShares.
     * @example
     * // Create many RoadmapShares
     * const roadmapShare = await prisma.roadmapShare.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many RoadmapShares and only return the `id`
     * const roadmapShareWithIdOnly = await prisma.roadmapShare.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends RoadmapShareCreateManyAndReturnArgs>(args?: SelectSubset<T, RoadmapShareCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RoadmapSharePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a RoadmapShare.
     * @param {RoadmapShareDeleteArgs} args - Arguments to delete one RoadmapShare.
     * @example
     * // Delete one RoadmapShare
     * const RoadmapShare = await prisma.roadmapShare.delete({
     *   where: {
     *     // ... filter to delete one RoadmapShare
     *   }
     * })
     * 
     */
    delete<T extends RoadmapShareDeleteArgs>(args: SelectSubset<T, RoadmapShareDeleteArgs<ExtArgs>>): Prisma__RoadmapShareClient<$Result.GetResult<Prisma.$RoadmapSharePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one RoadmapShare.
     * @param {RoadmapShareUpdateArgs} args - Arguments to update one RoadmapShare.
     * @example
     * // Update one RoadmapShare
     * const roadmapShare = await prisma.roadmapShare.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends RoadmapShareUpdateArgs>(args: SelectSubset<T, RoadmapShareUpdateArgs<ExtArgs>>): Prisma__RoadmapShareClient<$Result.GetResult<Prisma.$RoadmapSharePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more RoadmapShares.
     * @param {RoadmapShareDeleteManyArgs} args - Arguments to filter RoadmapShares to delete.
     * @example
     * // Delete a few RoadmapShares
     * const { count } = await prisma.roadmapShare.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends RoadmapShareDeleteManyArgs>(args?: SelectSubset<T, RoadmapShareDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RoadmapShares.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoadmapShareUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many RoadmapShares
     * const roadmapShare = await prisma.roadmapShare.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends RoadmapShareUpdateManyArgs>(args: SelectSubset<T, RoadmapShareUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RoadmapShares and returns the data updated in the database.
     * @param {RoadmapShareUpdateManyAndReturnArgs} args - Arguments to update many RoadmapShares.
     * @example
     * // Update many RoadmapShares
     * const roadmapShare = await prisma.roadmapShare.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more RoadmapShares and only return the `id`
     * const roadmapShareWithIdOnly = await prisma.roadmapShare.updateManyAndReturn({
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
    updateManyAndReturn<T extends RoadmapShareUpdateManyAndReturnArgs>(args: SelectSubset<T, RoadmapShareUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RoadmapSharePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one RoadmapShare.
     * @param {RoadmapShareUpsertArgs} args - Arguments to update or create a RoadmapShare.
     * @example
     * // Update or create a RoadmapShare
     * const roadmapShare = await prisma.roadmapShare.upsert({
     *   create: {
     *     // ... data to create a RoadmapShare
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the RoadmapShare we want to update
     *   }
     * })
     */
    upsert<T extends RoadmapShareUpsertArgs>(args: SelectSubset<T, RoadmapShareUpsertArgs<ExtArgs>>): Prisma__RoadmapShareClient<$Result.GetResult<Prisma.$RoadmapSharePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of RoadmapShares.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoadmapShareCountArgs} args - Arguments to filter RoadmapShares to count.
     * @example
     * // Count the number of RoadmapShares
     * const count = await prisma.roadmapShare.count({
     *   where: {
     *     // ... the filter for the RoadmapShares we want to count
     *   }
     * })
    **/
    count<T extends RoadmapShareCountArgs>(
      args?: Subset<T, RoadmapShareCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RoadmapShareCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a RoadmapShare.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoadmapShareAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends RoadmapShareAggregateArgs>(args: Subset<T, RoadmapShareAggregateArgs>): Prisma.PrismaPromise<GetRoadmapShareAggregateType<T>>

    /**
     * Group by RoadmapShare.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoadmapShareGroupByArgs} args - Group by arguments.
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
      T extends RoadmapShareGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RoadmapShareGroupByArgs['orderBy'] }
        : { orderBy?: RoadmapShareGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, RoadmapShareGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRoadmapShareGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the RoadmapShare model
   */
  readonly fields: RoadmapShareFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for RoadmapShare.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RoadmapShareClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    roadmap<T extends RoadmapDefaultArgs<ExtArgs> = {}>(args?: Subset<T, RoadmapDefaultArgs<ExtArgs>>): Prisma__RoadmapClient<$Result.GetResult<Prisma.$RoadmapPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the RoadmapShare model
   */
  interface RoadmapShareFieldRefs {
    readonly id: FieldRef<"RoadmapShare", 'String'>
    readonly roadmapId: FieldRef<"RoadmapShare", 'String'>
    readonly token: FieldRef<"RoadmapShare", 'String'>
    readonly expiresAt: FieldRef<"RoadmapShare", 'DateTime'>
    readonly access: FieldRef<"RoadmapShare", 'String'>
    readonly createdAt: FieldRef<"RoadmapShare", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * RoadmapShare findUnique
   */
  export type RoadmapShareFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoadmapShare
     */
    select?: RoadmapShareSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoadmapShare
     */
    omit?: RoadmapShareOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoadmapShareInclude<ExtArgs> | null
    /**
     * Filter, which RoadmapShare to fetch.
     */
    where: RoadmapShareWhereUniqueInput
  }

  /**
   * RoadmapShare findUniqueOrThrow
   */
  export type RoadmapShareFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoadmapShare
     */
    select?: RoadmapShareSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoadmapShare
     */
    omit?: RoadmapShareOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoadmapShareInclude<ExtArgs> | null
    /**
     * Filter, which RoadmapShare to fetch.
     */
    where: RoadmapShareWhereUniqueInput
  }

  /**
   * RoadmapShare findFirst
   */
  export type RoadmapShareFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoadmapShare
     */
    select?: RoadmapShareSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoadmapShare
     */
    omit?: RoadmapShareOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoadmapShareInclude<ExtArgs> | null
    /**
     * Filter, which RoadmapShare to fetch.
     */
    where?: RoadmapShareWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RoadmapShares to fetch.
     */
    orderBy?: RoadmapShareOrderByWithRelationInput | RoadmapShareOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RoadmapShares.
     */
    cursor?: RoadmapShareWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RoadmapShares from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RoadmapShares.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RoadmapShares.
     */
    distinct?: RoadmapShareScalarFieldEnum | RoadmapShareScalarFieldEnum[]
  }

  /**
   * RoadmapShare findFirstOrThrow
   */
  export type RoadmapShareFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoadmapShare
     */
    select?: RoadmapShareSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoadmapShare
     */
    omit?: RoadmapShareOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoadmapShareInclude<ExtArgs> | null
    /**
     * Filter, which RoadmapShare to fetch.
     */
    where?: RoadmapShareWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RoadmapShares to fetch.
     */
    orderBy?: RoadmapShareOrderByWithRelationInput | RoadmapShareOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RoadmapShares.
     */
    cursor?: RoadmapShareWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RoadmapShares from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RoadmapShares.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RoadmapShares.
     */
    distinct?: RoadmapShareScalarFieldEnum | RoadmapShareScalarFieldEnum[]
  }

  /**
   * RoadmapShare findMany
   */
  export type RoadmapShareFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoadmapShare
     */
    select?: RoadmapShareSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoadmapShare
     */
    omit?: RoadmapShareOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoadmapShareInclude<ExtArgs> | null
    /**
     * Filter, which RoadmapShares to fetch.
     */
    where?: RoadmapShareWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RoadmapShares to fetch.
     */
    orderBy?: RoadmapShareOrderByWithRelationInput | RoadmapShareOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing RoadmapShares.
     */
    cursor?: RoadmapShareWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RoadmapShares from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RoadmapShares.
     */
    skip?: number
    distinct?: RoadmapShareScalarFieldEnum | RoadmapShareScalarFieldEnum[]
  }

  /**
   * RoadmapShare create
   */
  export type RoadmapShareCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoadmapShare
     */
    select?: RoadmapShareSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoadmapShare
     */
    omit?: RoadmapShareOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoadmapShareInclude<ExtArgs> | null
    /**
     * The data needed to create a RoadmapShare.
     */
    data: XOR<RoadmapShareCreateInput, RoadmapShareUncheckedCreateInput>
  }

  /**
   * RoadmapShare createMany
   */
  export type RoadmapShareCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many RoadmapShares.
     */
    data: RoadmapShareCreateManyInput | RoadmapShareCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * RoadmapShare createManyAndReturn
   */
  export type RoadmapShareCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoadmapShare
     */
    select?: RoadmapShareSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the RoadmapShare
     */
    omit?: RoadmapShareOmit<ExtArgs> | null
    /**
     * The data used to create many RoadmapShares.
     */
    data: RoadmapShareCreateManyInput | RoadmapShareCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoadmapShareIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * RoadmapShare update
   */
  export type RoadmapShareUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoadmapShare
     */
    select?: RoadmapShareSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoadmapShare
     */
    omit?: RoadmapShareOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoadmapShareInclude<ExtArgs> | null
    /**
     * The data needed to update a RoadmapShare.
     */
    data: XOR<RoadmapShareUpdateInput, RoadmapShareUncheckedUpdateInput>
    /**
     * Choose, which RoadmapShare to update.
     */
    where: RoadmapShareWhereUniqueInput
  }

  /**
   * RoadmapShare updateMany
   */
  export type RoadmapShareUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update RoadmapShares.
     */
    data: XOR<RoadmapShareUpdateManyMutationInput, RoadmapShareUncheckedUpdateManyInput>
    /**
     * Filter which RoadmapShares to update
     */
    where?: RoadmapShareWhereInput
    /**
     * Limit how many RoadmapShares to update.
     */
    limit?: number
  }

  /**
   * RoadmapShare updateManyAndReturn
   */
  export type RoadmapShareUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoadmapShare
     */
    select?: RoadmapShareSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the RoadmapShare
     */
    omit?: RoadmapShareOmit<ExtArgs> | null
    /**
     * The data used to update RoadmapShares.
     */
    data: XOR<RoadmapShareUpdateManyMutationInput, RoadmapShareUncheckedUpdateManyInput>
    /**
     * Filter which RoadmapShares to update
     */
    where?: RoadmapShareWhereInput
    /**
     * Limit how many RoadmapShares to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoadmapShareIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * RoadmapShare upsert
   */
  export type RoadmapShareUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoadmapShare
     */
    select?: RoadmapShareSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoadmapShare
     */
    omit?: RoadmapShareOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoadmapShareInclude<ExtArgs> | null
    /**
     * The filter to search for the RoadmapShare to update in case it exists.
     */
    where: RoadmapShareWhereUniqueInput
    /**
     * In case the RoadmapShare found by the `where` argument doesn't exist, create a new RoadmapShare with this data.
     */
    create: XOR<RoadmapShareCreateInput, RoadmapShareUncheckedCreateInput>
    /**
     * In case the RoadmapShare was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RoadmapShareUpdateInput, RoadmapShareUncheckedUpdateInput>
  }

  /**
   * RoadmapShare delete
   */
  export type RoadmapShareDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoadmapShare
     */
    select?: RoadmapShareSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoadmapShare
     */
    omit?: RoadmapShareOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoadmapShareInclude<ExtArgs> | null
    /**
     * Filter which RoadmapShare to delete.
     */
    where: RoadmapShareWhereUniqueInput
  }

  /**
   * RoadmapShare deleteMany
   */
  export type RoadmapShareDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RoadmapShares to delete
     */
    where?: RoadmapShareWhereInput
    /**
     * Limit how many RoadmapShares to delete.
     */
    limit?: number
  }

  /**
   * RoadmapShare without action
   */
  export type RoadmapShareDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoadmapShare
     */
    select?: RoadmapShareSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoadmapShare
     */
    omit?: RoadmapShareOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoadmapShareInclude<ExtArgs> | null
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


  export const RoadmapScalarFieldEnum: {
    id: 'id',
    ownerId: 'ownerId',
    creatorName: 'creatorName',
    title: 'title',
    description: 'description',
    goal: 'goal',
    category: 'category',
    difficulty: 'difficulty',
    estimatedWeeks: 'estimatedWeeks',
    tags: 'tags',
    cloneCount: 'cloneCount',
    viewCount: 'viewCount',
    status: 'status',
    isPublished: 'isPublished',
    publishedAt: 'publishedAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type RoadmapScalarFieldEnum = (typeof RoadmapScalarFieldEnum)[keyof typeof RoadmapScalarFieldEnum]


  export const RoadmapNodeScalarFieldEnum: {
    id: 'id',
    roadmapId: 'roadmapId',
    title: 'title',
    description: 'description',
    type: 'type',
    position: 'position',
    metadata: 'metadata',
    parentId: 'parentId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type RoadmapNodeScalarFieldEnum = (typeof RoadmapNodeScalarFieldEnum)[keyof typeof RoadmapNodeScalarFieldEnum]


  export const RoadmapCollaboratorScalarFieldEnum: {
    id: 'id',
    roadmapId: 'roadmapId',
    userId: 'userId',
    email: 'email',
    role: 'role',
    status: 'status',
    invitedAt: 'invitedAt',
    joinedAt: 'joinedAt'
  };

  export type RoadmapCollaboratorScalarFieldEnum = (typeof RoadmapCollaboratorScalarFieldEnum)[keyof typeof RoadmapCollaboratorScalarFieldEnum]


  export const RoadmapProgressScalarFieldEnum: {
    id: 'id',
    roadmapId: 'roadmapId',
    nodeId: 'nodeId',
    userId: 'userId',
    status: 'status',
    percent: 'percent',
    notes: 'notes',
    completedAt: 'completedAt',
    updatedAt: 'updatedAt',
    createdAt: 'createdAt'
  };

  export type RoadmapProgressScalarFieldEnum = (typeof RoadmapProgressScalarFieldEnum)[keyof typeof RoadmapProgressScalarFieldEnum]


  export const RoadmapTemplateScalarFieldEnum: {
    id: 'id',
    name: 'name',
    description: 'description',
    category: 'category',
    isPublic: 'isPublic',
    authorId: 'authorId',
    definition: 'definition',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type RoadmapTemplateScalarFieldEnum = (typeof RoadmapTemplateScalarFieldEnum)[keyof typeof RoadmapTemplateScalarFieldEnum]


  export const RoadmapShareScalarFieldEnum: {
    id: 'id',
    roadmapId: 'roadmapId',
    token: 'token',
    expiresAt: 'expiresAt',
    access: 'access',
    createdAt: 'createdAt'
  };

  export type RoadmapShareScalarFieldEnum = (typeof RoadmapShareScalarFieldEnum)[keyof typeof RoadmapShareScalarFieldEnum]


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
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


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


  export type RoadmapWhereInput = {
    AND?: RoadmapWhereInput | RoadmapWhereInput[]
    OR?: RoadmapWhereInput[]
    NOT?: RoadmapWhereInput | RoadmapWhereInput[]
    id?: StringFilter<"Roadmap"> | string
    ownerId?: StringFilter<"Roadmap"> | string
    creatorName?: StringNullableFilter<"Roadmap"> | string | null
    title?: StringFilter<"Roadmap"> | string
    description?: StringNullableFilter<"Roadmap"> | string | null
    goal?: StringNullableFilter<"Roadmap"> | string | null
    category?: StringNullableFilter<"Roadmap"> | string | null
    difficulty?: StringNullableFilter<"Roadmap"> | string | null
    estimatedWeeks?: IntNullableFilter<"Roadmap"> | number | null
    tags?: JsonNullableFilter<"Roadmap">
    cloneCount?: IntFilter<"Roadmap"> | number
    viewCount?: IntFilter<"Roadmap"> | number
    status?: StringFilter<"Roadmap"> | string
    isPublished?: BoolFilter<"Roadmap"> | boolean
    publishedAt?: DateTimeNullableFilter<"Roadmap"> | Date | string | null
    createdAt?: DateTimeFilter<"Roadmap"> | Date | string
    updatedAt?: DateTimeFilter<"Roadmap"> | Date | string
    share?: XOR<RoadmapShareNullableScalarRelationFilter, RoadmapShareWhereInput> | null
    nodes?: RoadmapNodeListRelationFilter
    collaborators?: RoadmapCollaboratorListRelationFilter
    progress?: RoadmapProgressListRelationFilter
  }

  export type RoadmapOrderByWithRelationInput = {
    id?: SortOrder
    ownerId?: SortOrder
    creatorName?: SortOrderInput | SortOrder
    title?: SortOrder
    description?: SortOrderInput | SortOrder
    goal?: SortOrderInput | SortOrder
    category?: SortOrderInput | SortOrder
    difficulty?: SortOrderInput | SortOrder
    estimatedWeeks?: SortOrderInput | SortOrder
    tags?: SortOrderInput | SortOrder
    cloneCount?: SortOrder
    viewCount?: SortOrder
    status?: SortOrder
    isPublished?: SortOrder
    publishedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    share?: RoadmapShareOrderByWithRelationInput
    nodes?: RoadmapNodeOrderByRelationAggregateInput
    collaborators?: RoadmapCollaboratorOrderByRelationAggregateInput
    progress?: RoadmapProgressOrderByRelationAggregateInput
  }

  export type RoadmapWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: RoadmapWhereInput | RoadmapWhereInput[]
    OR?: RoadmapWhereInput[]
    NOT?: RoadmapWhereInput | RoadmapWhereInput[]
    ownerId?: StringFilter<"Roadmap"> | string
    creatorName?: StringNullableFilter<"Roadmap"> | string | null
    title?: StringFilter<"Roadmap"> | string
    description?: StringNullableFilter<"Roadmap"> | string | null
    goal?: StringNullableFilter<"Roadmap"> | string | null
    category?: StringNullableFilter<"Roadmap"> | string | null
    difficulty?: StringNullableFilter<"Roadmap"> | string | null
    estimatedWeeks?: IntNullableFilter<"Roadmap"> | number | null
    tags?: JsonNullableFilter<"Roadmap">
    cloneCount?: IntFilter<"Roadmap"> | number
    viewCount?: IntFilter<"Roadmap"> | number
    status?: StringFilter<"Roadmap"> | string
    isPublished?: BoolFilter<"Roadmap"> | boolean
    publishedAt?: DateTimeNullableFilter<"Roadmap"> | Date | string | null
    createdAt?: DateTimeFilter<"Roadmap"> | Date | string
    updatedAt?: DateTimeFilter<"Roadmap"> | Date | string
    share?: XOR<RoadmapShareNullableScalarRelationFilter, RoadmapShareWhereInput> | null
    nodes?: RoadmapNodeListRelationFilter
    collaborators?: RoadmapCollaboratorListRelationFilter
    progress?: RoadmapProgressListRelationFilter
  }, "id">

  export type RoadmapOrderByWithAggregationInput = {
    id?: SortOrder
    ownerId?: SortOrder
    creatorName?: SortOrderInput | SortOrder
    title?: SortOrder
    description?: SortOrderInput | SortOrder
    goal?: SortOrderInput | SortOrder
    category?: SortOrderInput | SortOrder
    difficulty?: SortOrderInput | SortOrder
    estimatedWeeks?: SortOrderInput | SortOrder
    tags?: SortOrderInput | SortOrder
    cloneCount?: SortOrder
    viewCount?: SortOrder
    status?: SortOrder
    isPublished?: SortOrder
    publishedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: RoadmapCountOrderByAggregateInput
    _avg?: RoadmapAvgOrderByAggregateInput
    _max?: RoadmapMaxOrderByAggregateInput
    _min?: RoadmapMinOrderByAggregateInput
    _sum?: RoadmapSumOrderByAggregateInput
  }

  export type RoadmapScalarWhereWithAggregatesInput = {
    AND?: RoadmapScalarWhereWithAggregatesInput | RoadmapScalarWhereWithAggregatesInput[]
    OR?: RoadmapScalarWhereWithAggregatesInput[]
    NOT?: RoadmapScalarWhereWithAggregatesInput | RoadmapScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Roadmap"> | string
    ownerId?: StringWithAggregatesFilter<"Roadmap"> | string
    creatorName?: StringNullableWithAggregatesFilter<"Roadmap"> | string | null
    title?: StringWithAggregatesFilter<"Roadmap"> | string
    description?: StringNullableWithAggregatesFilter<"Roadmap"> | string | null
    goal?: StringNullableWithAggregatesFilter<"Roadmap"> | string | null
    category?: StringNullableWithAggregatesFilter<"Roadmap"> | string | null
    difficulty?: StringNullableWithAggregatesFilter<"Roadmap"> | string | null
    estimatedWeeks?: IntNullableWithAggregatesFilter<"Roadmap"> | number | null
    tags?: JsonNullableWithAggregatesFilter<"Roadmap">
    cloneCount?: IntWithAggregatesFilter<"Roadmap"> | number
    viewCount?: IntWithAggregatesFilter<"Roadmap"> | number
    status?: StringWithAggregatesFilter<"Roadmap"> | string
    isPublished?: BoolWithAggregatesFilter<"Roadmap"> | boolean
    publishedAt?: DateTimeNullableWithAggregatesFilter<"Roadmap"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Roadmap"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Roadmap"> | Date | string
  }

  export type RoadmapNodeWhereInput = {
    AND?: RoadmapNodeWhereInput | RoadmapNodeWhereInput[]
    OR?: RoadmapNodeWhereInput[]
    NOT?: RoadmapNodeWhereInput | RoadmapNodeWhereInput[]
    id?: StringFilter<"RoadmapNode"> | string
    roadmapId?: StringFilter<"RoadmapNode"> | string
    title?: StringFilter<"RoadmapNode"> | string
    description?: StringNullableFilter<"RoadmapNode"> | string | null
    type?: StringFilter<"RoadmapNode"> | string
    position?: IntFilter<"RoadmapNode"> | number
    metadata?: JsonNullableFilter<"RoadmapNode">
    parentId?: StringNullableFilter<"RoadmapNode"> | string | null
    createdAt?: DateTimeFilter<"RoadmapNode"> | Date | string
    updatedAt?: DateTimeFilter<"RoadmapNode"> | Date | string
    roadmap?: XOR<RoadmapScalarRelationFilter, RoadmapWhereInput>
    parent?: XOR<RoadmapNodeNullableScalarRelationFilter, RoadmapNodeWhereInput> | null
    children?: RoadmapNodeListRelationFilter
    progress?: RoadmapProgressListRelationFilter
  }

  export type RoadmapNodeOrderByWithRelationInput = {
    id?: SortOrder
    roadmapId?: SortOrder
    title?: SortOrder
    description?: SortOrderInput | SortOrder
    type?: SortOrder
    position?: SortOrder
    metadata?: SortOrderInput | SortOrder
    parentId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    roadmap?: RoadmapOrderByWithRelationInput
    parent?: RoadmapNodeOrderByWithRelationInput
    children?: RoadmapNodeOrderByRelationAggregateInput
    progress?: RoadmapProgressOrderByRelationAggregateInput
  }

  export type RoadmapNodeWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: RoadmapNodeWhereInput | RoadmapNodeWhereInput[]
    OR?: RoadmapNodeWhereInput[]
    NOT?: RoadmapNodeWhereInput | RoadmapNodeWhereInput[]
    roadmapId?: StringFilter<"RoadmapNode"> | string
    title?: StringFilter<"RoadmapNode"> | string
    description?: StringNullableFilter<"RoadmapNode"> | string | null
    type?: StringFilter<"RoadmapNode"> | string
    position?: IntFilter<"RoadmapNode"> | number
    metadata?: JsonNullableFilter<"RoadmapNode">
    parentId?: StringNullableFilter<"RoadmapNode"> | string | null
    createdAt?: DateTimeFilter<"RoadmapNode"> | Date | string
    updatedAt?: DateTimeFilter<"RoadmapNode"> | Date | string
    roadmap?: XOR<RoadmapScalarRelationFilter, RoadmapWhereInput>
    parent?: XOR<RoadmapNodeNullableScalarRelationFilter, RoadmapNodeWhereInput> | null
    children?: RoadmapNodeListRelationFilter
    progress?: RoadmapProgressListRelationFilter
  }, "id">

  export type RoadmapNodeOrderByWithAggregationInput = {
    id?: SortOrder
    roadmapId?: SortOrder
    title?: SortOrder
    description?: SortOrderInput | SortOrder
    type?: SortOrder
    position?: SortOrder
    metadata?: SortOrderInput | SortOrder
    parentId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: RoadmapNodeCountOrderByAggregateInput
    _avg?: RoadmapNodeAvgOrderByAggregateInput
    _max?: RoadmapNodeMaxOrderByAggregateInput
    _min?: RoadmapNodeMinOrderByAggregateInput
    _sum?: RoadmapNodeSumOrderByAggregateInput
  }

  export type RoadmapNodeScalarWhereWithAggregatesInput = {
    AND?: RoadmapNodeScalarWhereWithAggregatesInput | RoadmapNodeScalarWhereWithAggregatesInput[]
    OR?: RoadmapNodeScalarWhereWithAggregatesInput[]
    NOT?: RoadmapNodeScalarWhereWithAggregatesInput | RoadmapNodeScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"RoadmapNode"> | string
    roadmapId?: StringWithAggregatesFilter<"RoadmapNode"> | string
    title?: StringWithAggregatesFilter<"RoadmapNode"> | string
    description?: StringNullableWithAggregatesFilter<"RoadmapNode"> | string | null
    type?: StringWithAggregatesFilter<"RoadmapNode"> | string
    position?: IntWithAggregatesFilter<"RoadmapNode"> | number
    metadata?: JsonNullableWithAggregatesFilter<"RoadmapNode">
    parentId?: StringNullableWithAggregatesFilter<"RoadmapNode"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"RoadmapNode"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"RoadmapNode"> | Date | string
  }

  export type RoadmapCollaboratorWhereInput = {
    AND?: RoadmapCollaboratorWhereInput | RoadmapCollaboratorWhereInput[]
    OR?: RoadmapCollaboratorWhereInput[]
    NOT?: RoadmapCollaboratorWhereInput | RoadmapCollaboratorWhereInput[]
    id?: StringFilter<"RoadmapCollaborator"> | string
    roadmapId?: StringFilter<"RoadmapCollaborator"> | string
    userId?: StringNullableFilter<"RoadmapCollaborator"> | string | null
    email?: StringFilter<"RoadmapCollaborator"> | string
    role?: StringFilter<"RoadmapCollaborator"> | string
    status?: StringFilter<"RoadmapCollaborator"> | string
    invitedAt?: DateTimeFilter<"RoadmapCollaborator"> | Date | string
    joinedAt?: DateTimeNullableFilter<"RoadmapCollaborator"> | Date | string | null
    roadmap?: XOR<RoadmapScalarRelationFilter, RoadmapWhereInput>
  }

  export type RoadmapCollaboratorOrderByWithRelationInput = {
    id?: SortOrder
    roadmapId?: SortOrder
    userId?: SortOrderInput | SortOrder
    email?: SortOrder
    role?: SortOrder
    status?: SortOrder
    invitedAt?: SortOrder
    joinedAt?: SortOrderInput | SortOrder
    roadmap?: RoadmapOrderByWithRelationInput
  }

  export type RoadmapCollaboratorWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    roadmapId_email?: RoadmapCollaboratorRoadmapIdEmailCompoundUniqueInput
    AND?: RoadmapCollaboratorWhereInput | RoadmapCollaboratorWhereInput[]
    OR?: RoadmapCollaboratorWhereInput[]
    NOT?: RoadmapCollaboratorWhereInput | RoadmapCollaboratorWhereInput[]
    roadmapId?: StringFilter<"RoadmapCollaborator"> | string
    userId?: StringNullableFilter<"RoadmapCollaborator"> | string | null
    email?: StringFilter<"RoadmapCollaborator"> | string
    role?: StringFilter<"RoadmapCollaborator"> | string
    status?: StringFilter<"RoadmapCollaborator"> | string
    invitedAt?: DateTimeFilter<"RoadmapCollaborator"> | Date | string
    joinedAt?: DateTimeNullableFilter<"RoadmapCollaborator"> | Date | string | null
    roadmap?: XOR<RoadmapScalarRelationFilter, RoadmapWhereInput>
  }, "id" | "roadmapId_email">

  export type RoadmapCollaboratorOrderByWithAggregationInput = {
    id?: SortOrder
    roadmapId?: SortOrder
    userId?: SortOrderInput | SortOrder
    email?: SortOrder
    role?: SortOrder
    status?: SortOrder
    invitedAt?: SortOrder
    joinedAt?: SortOrderInput | SortOrder
    _count?: RoadmapCollaboratorCountOrderByAggregateInput
    _max?: RoadmapCollaboratorMaxOrderByAggregateInput
    _min?: RoadmapCollaboratorMinOrderByAggregateInput
  }

  export type RoadmapCollaboratorScalarWhereWithAggregatesInput = {
    AND?: RoadmapCollaboratorScalarWhereWithAggregatesInput | RoadmapCollaboratorScalarWhereWithAggregatesInput[]
    OR?: RoadmapCollaboratorScalarWhereWithAggregatesInput[]
    NOT?: RoadmapCollaboratorScalarWhereWithAggregatesInput | RoadmapCollaboratorScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"RoadmapCollaborator"> | string
    roadmapId?: StringWithAggregatesFilter<"RoadmapCollaborator"> | string
    userId?: StringNullableWithAggregatesFilter<"RoadmapCollaborator"> | string | null
    email?: StringWithAggregatesFilter<"RoadmapCollaborator"> | string
    role?: StringWithAggregatesFilter<"RoadmapCollaborator"> | string
    status?: StringWithAggregatesFilter<"RoadmapCollaborator"> | string
    invitedAt?: DateTimeWithAggregatesFilter<"RoadmapCollaborator"> | Date | string
    joinedAt?: DateTimeNullableWithAggregatesFilter<"RoadmapCollaborator"> | Date | string | null
  }

  export type RoadmapProgressWhereInput = {
    AND?: RoadmapProgressWhereInput | RoadmapProgressWhereInput[]
    OR?: RoadmapProgressWhereInput[]
    NOT?: RoadmapProgressWhereInput | RoadmapProgressWhereInput[]
    id?: StringFilter<"RoadmapProgress"> | string
    roadmapId?: StringFilter<"RoadmapProgress"> | string
    nodeId?: StringFilter<"RoadmapProgress"> | string
    userId?: StringFilter<"RoadmapProgress"> | string
    status?: StringFilter<"RoadmapProgress"> | string
    percent?: IntFilter<"RoadmapProgress"> | number
    notes?: StringNullableFilter<"RoadmapProgress"> | string | null
    completedAt?: DateTimeNullableFilter<"RoadmapProgress"> | Date | string | null
    updatedAt?: DateTimeFilter<"RoadmapProgress"> | Date | string
    createdAt?: DateTimeFilter<"RoadmapProgress"> | Date | string
    roadmap?: XOR<RoadmapScalarRelationFilter, RoadmapWhereInput>
    node?: XOR<RoadmapNodeScalarRelationFilter, RoadmapNodeWhereInput>
  }

  export type RoadmapProgressOrderByWithRelationInput = {
    id?: SortOrder
    roadmapId?: SortOrder
    nodeId?: SortOrder
    userId?: SortOrder
    status?: SortOrder
    percent?: SortOrder
    notes?: SortOrderInput | SortOrder
    completedAt?: SortOrderInput | SortOrder
    updatedAt?: SortOrder
    createdAt?: SortOrder
    roadmap?: RoadmapOrderByWithRelationInput
    node?: RoadmapNodeOrderByWithRelationInput
  }

  export type RoadmapProgressWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    nodeId_userId?: RoadmapProgressNodeIdUserIdCompoundUniqueInput
    AND?: RoadmapProgressWhereInput | RoadmapProgressWhereInput[]
    OR?: RoadmapProgressWhereInput[]
    NOT?: RoadmapProgressWhereInput | RoadmapProgressWhereInput[]
    roadmapId?: StringFilter<"RoadmapProgress"> | string
    nodeId?: StringFilter<"RoadmapProgress"> | string
    userId?: StringFilter<"RoadmapProgress"> | string
    status?: StringFilter<"RoadmapProgress"> | string
    percent?: IntFilter<"RoadmapProgress"> | number
    notes?: StringNullableFilter<"RoadmapProgress"> | string | null
    completedAt?: DateTimeNullableFilter<"RoadmapProgress"> | Date | string | null
    updatedAt?: DateTimeFilter<"RoadmapProgress"> | Date | string
    createdAt?: DateTimeFilter<"RoadmapProgress"> | Date | string
    roadmap?: XOR<RoadmapScalarRelationFilter, RoadmapWhereInput>
    node?: XOR<RoadmapNodeScalarRelationFilter, RoadmapNodeWhereInput>
  }, "id" | "nodeId_userId">

  export type RoadmapProgressOrderByWithAggregationInput = {
    id?: SortOrder
    roadmapId?: SortOrder
    nodeId?: SortOrder
    userId?: SortOrder
    status?: SortOrder
    percent?: SortOrder
    notes?: SortOrderInput | SortOrder
    completedAt?: SortOrderInput | SortOrder
    updatedAt?: SortOrder
    createdAt?: SortOrder
    _count?: RoadmapProgressCountOrderByAggregateInput
    _avg?: RoadmapProgressAvgOrderByAggregateInput
    _max?: RoadmapProgressMaxOrderByAggregateInput
    _min?: RoadmapProgressMinOrderByAggregateInput
    _sum?: RoadmapProgressSumOrderByAggregateInput
  }

  export type RoadmapProgressScalarWhereWithAggregatesInput = {
    AND?: RoadmapProgressScalarWhereWithAggregatesInput | RoadmapProgressScalarWhereWithAggregatesInput[]
    OR?: RoadmapProgressScalarWhereWithAggregatesInput[]
    NOT?: RoadmapProgressScalarWhereWithAggregatesInput | RoadmapProgressScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"RoadmapProgress"> | string
    roadmapId?: StringWithAggregatesFilter<"RoadmapProgress"> | string
    nodeId?: StringWithAggregatesFilter<"RoadmapProgress"> | string
    userId?: StringWithAggregatesFilter<"RoadmapProgress"> | string
    status?: StringWithAggregatesFilter<"RoadmapProgress"> | string
    percent?: IntWithAggregatesFilter<"RoadmapProgress"> | number
    notes?: StringNullableWithAggregatesFilter<"RoadmapProgress"> | string | null
    completedAt?: DateTimeNullableWithAggregatesFilter<"RoadmapProgress"> | Date | string | null
    updatedAt?: DateTimeWithAggregatesFilter<"RoadmapProgress"> | Date | string
    createdAt?: DateTimeWithAggregatesFilter<"RoadmapProgress"> | Date | string
  }

  export type RoadmapTemplateWhereInput = {
    AND?: RoadmapTemplateWhereInput | RoadmapTemplateWhereInput[]
    OR?: RoadmapTemplateWhereInput[]
    NOT?: RoadmapTemplateWhereInput | RoadmapTemplateWhereInput[]
    id?: StringFilter<"RoadmapTemplate"> | string
    name?: StringFilter<"RoadmapTemplate"> | string
    description?: StringNullableFilter<"RoadmapTemplate"> | string | null
    category?: StringNullableFilter<"RoadmapTemplate"> | string | null
    isPublic?: BoolFilter<"RoadmapTemplate"> | boolean
    authorId?: StringNullableFilter<"RoadmapTemplate"> | string | null
    definition?: JsonFilter<"RoadmapTemplate">
    createdAt?: DateTimeFilter<"RoadmapTemplate"> | Date | string
    updatedAt?: DateTimeFilter<"RoadmapTemplate"> | Date | string
  }

  export type RoadmapTemplateOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    category?: SortOrderInput | SortOrder
    isPublic?: SortOrder
    authorId?: SortOrderInput | SortOrder
    definition?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type RoadmapTemplateWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: RoadmapTemplateWhereInput | RoadmapTemplateWhereInput[]
    OR?: RoadmapTemplateWhereInput[]
    NOT?: RoadmapTemplateWhereInput | RoadmapTemplateWhereInput[]
    name?: StringFilter<"RoadmapTemplate"> | string
    description?: StringNullableFilter<"RoadmapTemplate"> | string | null
    category?: StringNullableFilter<"RoadmapTemplate"> | string | null
    isPublic?: BoolFilter<"RoadmapTemplate"> | boolean
    authorId?: StringNullableFilter<"RoadmapTemplate"> | string | null
    definition?: JsonFilter<"RoadmapTemplate">
    createdAt?: DateTimeFilter<"RoadmapTemplate"> | Date | string
    updatedAt?: DateTimeFilter<"RoadmapTemplate"> | Date | string
  }, "id">

  export type RoadmapTemplateOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    category?: SortOrderInput | SortOrder
    isPublic?: SortOrder
    authorId?: SortOrderInput | SortOrder
    definition?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: RoadmapTemplateCountOrderByAggregateInput
    _max?: RoadmapTemplateMaxOrderByAggregateInput
    _min?: RoadmapTemplateMinOrderByAggregateInput
  }

  export type RoadmapTemplateScalarWhereWithAggregatesInput = {
    AND?: RoadmapTemplateScalarWhereWithAggregatesInput | RoadmapTemplateScalarWhereWithAggregatesInput[]
    OR?: RoadmapTemplateScalarWhereWithAggregatesInput[]
    NOT?: RoadmapTemplateScalarWhereWithAggregatesInput | RoadmapTemplateScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"RoadmapTemplate"> | string
    name?: StringWithAggregatesFilter<"RoadmapTemplate"> | string
    description?: StringNullableWithAggregatesFilter<"RoadmapTemplate"> | string | null
    category?: StringNullableWithAggregatesFilter<"RoadmapTemplate"> | string | null
    isPublic?: BoolWithAggregatesFilter<"RoadmapTemplate"> | boolean
    authorId?: StringNullableWithAggregatesFilter<"RoadmapTemplate"> | string | null
    definition?: JsonWithAggregatesFilter<"RoadmapTemplate">
    createdAt?: DateTimeWithAggregatesFilter<"RoadmapTemplate"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"RoadmapTemplate"> | Date | string
  }

  export type RoadmapShareWhereInput = {
    AND?: RoadmapShareWhereInput | RoadmapShareWhereInput[]
    OR?: RoadmapShareWhereInput[]
    NOT?: RoadmapShareWhereInput | RoadmapShareWhereInput[]
    id?: StringFilter<"RoadmapShare"> | string
    roadmapId?: StringFilter<"RoadmapShare"> | string
    token?: StringFilter<"RoadmapShare"> | string
    expiresAt?: DateTimeNullableFilter<"RoadmapShare"> | Date | string | null
    access?: StringFilter<"RoadmapShare"> | string
    createdAt?: DateTimeFilter<"RoadmapShare"> | Date | string
    roadmap?: XOR<RoadmapScalarRelationFilter, RoadmapWhereInput>
  }

  export type RoadmapShareOrderByWithRelationInput = {
    id?: SortOrder
    roadmapId?: SortOrder
    token?: SortOrder
    expiresAt?: SortOrderInput | SortOrder
    access?: SortOrder
    createdAt?: SortOrder
    roadmap?: RoadmapOrderByWithRelationInput
  }

  export type RoadmapShareWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    roadmapId?: string
    token?: string
    AND?: RoadmapShareWhereInput | RoadmapShareWhereInput[]
    OR?: RoadmapShareWhereInput[]
    NOT?: RoadmapShareWhereInput | RoadmapShareWhereInput[]
    expiresAt?: DateTimeNullableFilter<"RoadmapShare"> | Date | string | null
    access?: StringFilter<"RoadmapShare"> | string
    createdAt?: DateTimeFilter<"RoadmapShare"> | Date | string
    roadmap?: XOR<RoadmapScalarRelationFilter, RoadmapWhereInput>
  }, "id" | "roadmapId" | "token">

  export type RoadmapShareOrderByWithAggregationInput = {
    id?: SortOrder
    roadmapId?: SortOrder
    token?: SortOrder
    expiresAt?: SortOrderInput | SortOrder
    access?: SortOrder
    createdAt?: SortOrder
    _count?: RoadmapShareCountOrderByAggregateInput
    _max?: RoadmapShareMaxOrderByAggregateInput
    _min?: RoadmapShareMinOrderByAggregateInput
  }

  export type RoadmapShareScalarWhereWithAggregatesInput = {
    AND?: RoadmapShareScalarWhereWithAggregatesInput | RoadmapShareScalarWhereWithAggregatesInput[]
    OR?: RoadmapShareScalarWhereWithAggregatesInput[]
    NOT?: RoadmapShareScalarWhereWithAggregatesInput | RoadmapShareScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"RoadmapShare"> | string
    roadmapId?: StringWithAggregatesFilter<"RoadmapShare"> | string
    token?: StringWithAggregatesFilter<"RoadmapShare"> | string
    expiresAt?: DateTimeNullableWithAggregatesFilter<"RoadmapShare"> | Date | string | null
    access?: StringWithAggregatesFilter<"RoadmapShare"> | string
    createdAt?: DateTimeWithAggregatesFilter<"RoadmapShare"> | Date | string
  }

  export type RoadmapCreateInput = {
    id?: string
    ownerId: string
    creatorName?: string | null
    title: string
    description?: string | null
    goal?: string | null
    category?: string | null
    difficulty?: string | null
    estimatedWeeks?: number | null
    tags?: NullableJsonNullValueInput | InputJsonValue
    cloneCount?: number
    viewCount?: number
    status?: string
    isPublished?: boolean
    publishedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    share?: RoadmapShareCreateNestedOneWithoutRoadmapInput
    nodes?: RoadmapNodeCreateNestedManyWithoutRoadmapInput
    collaborators?: RoadmapCollaboratorCreateNestedManyWithoutRoadmapInput
    progress?: RoadmapProgressCreateNestedManyWithoutRoadmapInput
  }

  export type RoadmapUncheckedCreateInput = {
    id?: string
    ownerId: string
    creatorName?: string | null
    title: string
    description?: string | null
    goal?: string | null
    category?: string | null
    difficulty?: string | null
    estimatedWeeks?: number | null
    tags?: NullableJsonNullValueInput | InputJsonValue
    cloneCount?: number
    viewCount?: number
    status?: string
    isPublished?: boolean
    publishedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    share?: RoadmapShareUncheckedCreateNestedOneWithoutRoadmapInput
    nodes?: RoadmapNodeUncheckedCreateNestedManyWithoutRoadmapInput
    collaborators?: RoadmapCollaboratorUncheckedCreateNestedManyWithoutRoadmapInput
    progress?: RoadmapProgressUncheckedCreateNestedManyWithoutRoadmapInput
  }

  export type RoadmapUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    creatorName?: NullableStringFieldUpdateOperationsInput | string | null
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    goal?: NullableStringFieldUpdateOperationsInput | string | null
    category?: NullableStringFieldUpdateOperationsInput | string | null
    difficulty?: NullableStringFieldUpdateOperationsInput | string | null
    estimatedWeeks?: NullableIntFieldUpdateOperationsInput | number | null
    tags?: NullableJsonNullValueInput | InputJsonValue
    cloneCount?: IntFieldUpdateOperationsInput | number
    viewCount?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    isPublished?: BoolFieldUpdateOperationsInput | boolean
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    share?: RoadmapShareUpdateOneWithoutRoadmapNestedInput
    nodes?: RoadmapNodeUpdateManyWithoutRoadmapNestedInput
    collaborators?: RoadmapCollaboratorUpdateManyWithoutRoadmapNestedInput
    progress?: RoadmapProgressUpdateManyWithoutRoadmapNestedInput
  }

  export type RoadmapUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    creatorName?: NullableStringFieldUpdateOperationsInput | string | null
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    goal?: NullableStringFieldUpdateOperationsInput | string | null
    category?: NullableStringFieldUpdateOperationsInput | string | null
    difficulty?: NullableStringFieldUpdateOperationsInput | string | null
    estimatedWeeks?: NullableIntFieldUpdateOperationsInput | number | null
    tags?: NullableJsonNullValueInput | InputJsonValue
    cloneCount?: IntFieldUpdateOperationsInput | number
    viewCount?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    isPublished?: BoolFieldUpdateOperationsInput | boolean
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    share?: RoadmapShareUncheckedUpdateOneWithoutRoadmapNestedInput
    nodes?: RoadmapNodeUncheckedUpdateManyWithoutRoadmapNestedInput
    collaborators?: RoadmapCollaboratorUncheckedUpdateManyWithoutRoadmapNestedInput
    progress?: RoadmapProgressUncheckedUpdateManyWithoutRoadmapNestedInput
  }

  export type RoadmapCreateManyInput = {
    id?: string
    ownerId: string
    creatorName?: string | null
    title: string
    description?: string | null
    goal?: string | null
    category?: string | null
    difficulty?: string | null
    estimatedWeeks?: number | null
    tags?: NullableJsonNullValueInput | InputJsonValue
    cloneCount?: number
    viewCount?: number
    status?: string
    isPublished?: boolean
    publishedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RoadmapUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    creatorName?: NullableStringFieldUpdateOperationsInput | string | null
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    goal?: NullableStringFieldUpdateOperationsInput | string | null
    category?: NullableStringFieldUpdateOperationsInput | string | null
    difficulty?: NullableStringFieldUpdateOperationsInput | string | null
    estimatedWeeks?: NullableIntFieldUpdateOperationsInput | number | null
    tags?: NullableJsonNullValueInput | InputJsonValue
    cloneCount?: IntFieldUpdateOperationsInput | number
    viewCount?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    isPublished?: BoolFieldUpdateOperationsInput | boolean
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RoadmapUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    creatorName?: NullableStringFieldUpdateOperationsInput | string | null
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    goal?: NullableStringFieldUpdateOperationsInput | string | null
    category?: NullableStringFieldUpdateOperationsInput | string | null
    difficulty?: NullableStringFieldUpdateOperationsInput | string | null
    estimatedWeeks?: NullableIntFieldUpdateOperationsInput | number | null
    tags?: NullableJsonNullValueInput | InputJsonValue
    cloneCount?: IntFieldUpdateOperationsInput | number
    viewCount?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    isPublished?: BoolFieldUpdateOperationsInput | boolean
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RoadmapNodeCreateInput = {
    id?: string
    title: string
    description?: string | null
    type?: string
    position?: number
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    roadmap: RoadmapCreateNestedOneWithoutNodesInput
    parent?: RoadmapNodeCreateNestedOneWithoutChildrenInput
    children?: RoadmapNodeCreateNestedManyWithoutParentInput
    progress?: RoadmapProgressCreateNestedManyWithoutNodeInput
  }

  export type RoadmapNodeUncheckedCreateInput = {
    id?: string
    roadmapId: string
    title: string
    description?: string | null
    type?: string
    position?: number
    metadata?: NullableJsonNullValueInput | InputJsonValue
    parentId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    children?: RoadmapNodeUncheckedCreateNestedManyWithoutParentInput
    progress?: RoadmapProgressUncheckedCreateNestedManyWithoutNodeInput
  }

  export type RoadmapNodeUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    type?: StringFieldUpdateOperationsInput | string
    position?: IntFieldUpdateOperationsInput | number
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    roadmap?: RoadmapUpdateOneRequiredWithoutNodesNestedInput
    parent?: RoadmapNodeUpdateOneWithoutChildrenNestedInput
    children?: RoadmapNodeUpdateManyWithoutParentNestedInput
    progress?: RoadmapProgressUpdateManyWithoutNodeNestedInput
  }

  export type RoadmapNodeUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    roadmapId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    type?: StringFieldUpdateOperationsInput | string
    position?: IntFieldUpdateOperationsInput | number
    metadata?: NullableJsonNullValueInput | InputJsonValue
    parentId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    children?: RoadmapNodeUncheckedUpdateManyWithoutParentNestedInput
    progress?: RoadmapProgressUncheckedUpdateManyWithoutNodeNestedInput
  }

  export type RoadmapNodeCreateManyInput = {
    id?: string
    roadmapId: string
    title: string
    description?: string | null
    type?: string
    position?: number
    metadata?: NullableJsonNullValueInput | InputJsonValue
    parentId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RoadmapNodeUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    type?: StringFieldUpdateOperationsInput | string
    position?: IntFieldUpdateOperationsInput | number
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RoadmapNodeUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    roadmapId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    type?: StringFieldUpdateOperationsInput | string
    position?: IntFieldUpdateOperationsInput | number
    metadata?: NullableJsonNullValueInput | InputJsonValue
    parentId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RoadmapCollaboratorCreateInput = {
    id?: string
    userId?: string | null
    email: string
    role?: string
    status?: string
    invitedAt?: Date | string
    joinedAt?: Date | string | null
    roadmap: RoadmapCreateNestedOneWithoutCollaboratorsInput
  }

  export type RoadmapCollaboratorUncheckedCreateInput = {
    id?: string
    roadmapId: string
    userId?: string | null
    email: string
    role?: string
    status?: string
    invitedAt?: Date | string
    joinedAt?: Date | string | null
  }

  export type RoadmapCollaboratorUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    invitedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    joinedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    roadmap?: RoadmapUpdateOneRequiredWithoutCollaboratorsNestedInput
  }

  export type RoadmapCollaboratorUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    roadmapId?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    invitedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    joinedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type RoadmapCollaboratorCreateManyInput = {
    id?: string
    roadmapId: string
    userId?: string | null
    email: string
    role?: string
    status?: string
    invitedAt?: Date | string
    joinedAt?: Date | string | null
  }

  export type RoadmapCollaboratorUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    invitedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    joinedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type RoadmapCollaboratorUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    roadmapId?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    invitedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    joinedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type RoadmapProgressCreateInput = {
    id?: string
    userId: string
    status?: string
    percent?: number
    notes?: string | null
    completedAt?: Date | string | null
    updatedAt?: Date | string
    createdAt?: Date | string
    roadmap: RoadmapCreateNestedOneWithoutProgressInput
    node: RoadmapNodeCreateNestedOneWithoutProgressInput
  }

  export type RoadmapProgressUncheckedCreateInput = {
    id?: string
    roadmapId: string
    nodeId: string
    userId: string
    status?: string
    percent?: number
    notes?: string | null
    completedAt?: Date | string | null
    updatedAt?: Date | string
    createdAt?: Date | string
  }

  export type RoadmapProgressUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    percent?: IntFieldUpdateOperationsInput | number
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    roadmap?: RoadmapUpdateOneRequiredWithoutProgressNestedInput
    node?: RoadmapNodeUpdateOneRequiredWithoutProgressNestedInput
  }

  export type RoadmapProgressUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    roadmapId?: StringFieldUpdateOperationsInput | string
    nodeId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    percent?: IntFieldUpdateOperationsInput | number
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RoadmapProgressCreateManyInput = {
    id?: string
    roadmapId: string
    nodeId: string
    userId: string
    status?: string
    percent?: number
    notes?: string | null
    completedAt?: Date | string | null
    updatedAt?: Date | string
    createdAt?: Date | string
  }

  export type RoadmapProgressUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    percent?: IntFieldUpdateOperationsInput | number
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RoadmapProgressUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    roadmapId?: StringFieldUpdateOperationsInput | string
    nodeId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    percent?: IntFieldUpdateOperationsInput | number
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RoadmapTemplateCreateInput = {
    id?: string
    name: string
    description?: string | null
    category?: string | null
    isPublic?: boolean
    authorId?: string | null
    definition: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RoadmapTemplateUncheckedCreateInput = {
    id?: string
    name: string
    description?: string | null
    category?: string | null
    isPublic?: boolean
    authorId?: string | null
    definition: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RoadmapTemplateUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    category?: NullableStringFieldUpdateOperationsInput | string | null
    isPublic?: BoolFieldUpdateOperationsInput | boolean
    authorId?: NullableStringFieldUpdateOperationsInput | string | null
    definition?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RoadmapTemplateUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    category?: NullableStringFieldUpdateOperationsInput | string | null
    isPublic?: BoolFieldUpdateOperationsInput | boolean
    authorId?: NullableStringFieldUpdateOperationsInput | string | null
    definition?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RoadmapTemplateCreateManyInput = {
    id?: string
    name: string
    description?: string | null
    category?: string | null
    isPublic?: boolean
    authorId?: string | null
    definition: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RoadmapTemplateUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    category?: NullableStringFieldUpdateOperationsInput | string | null
    isPublic?: BoolFieldUpdateOperationsInput | boolean
    authorId?: NullableStringFieldUpdateOperationsInput | string | null
    definition?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RoadmapTemplateUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    category?: NullableStringFieldUpdateOperationsInput | string | null
    isPublic?: BoolFieldUpdateOperationsInput | boolean
    authorId?: NullableStringFieldUpdateOperationsInput | string | null
    definition?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RoadmapShareCreateInput = {
    id?: string
    token?: string
    expiresAt?: Date | string | null
    access?: string
    createdAt?: Date | string
    roadmap: RoadmapCreateNestedOneWithoutShareInput
  }

  export type RoadmapShareUncheckedCreateInput = {
    id?: string
    roadmapId: string
    token?: string
    expiresAt?: Date | string | null
    access?: string
    createdAt?: Date | string
  }

  export type RoadmapShareUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    access?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    roadmap?: RoadmapUpdateOneRequiredWithoutShareNestedInput
  }

  export type RoadmapShareUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    roadmapId?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    access?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RoadmapShareCreateManyInput = {
    id?: string
    roadmapId: string
    token?: string
    expiresAt?: Date | string | null
    access?: string
    createdAt?: Date | string
  }

  export type RoadmapShareUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    access?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RoadmapShareUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    roadmapId?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    access?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
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

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
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

  export type RoadmapShareNullableScalarRelationFilter = {
    is?: RoadmapShareWhereInput | null
    isNot?: RoadmapShareWhereInput | null
  }

  export type RoadmapNodeListRelationFilter = {
    every?: RoadmapNodeWhereInput
    some?: RoadmapNodeWhereInput
    none?: RoadmapNodeWhereInput
  }

  export type RoadmapCollaboratorListRelationFilter = {
    every?: RoadmapCollaboratorWhereInput
    some?: RoadmapCollaboratorWhereInput
    none?: RoadmapCollaboratorWhereInput
  }

  export type RoadmapProgressListRelationFilter = {
    every?: RoadmapProgressWhereInput
    some?: RoadmapProgressWhereInput
    none?: RoadmapProgressWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type RoadmapNodeOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type RoadmapCollaboratorOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type RoadmapProgressOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type RoadmapCountOrderByAggregateInput = {
    id?: SortOrder
    ownerId?: SortOrder
    creatorName?: SortOrder
    title?: SortOrder
    description?: SortOrder
    goal?: SortOrder
    category?: SortOrder
    difficulty?: SortOrder
    estimatedWeeks?: SortOrder
    tags?: SortOrder
    cloneCount?: SortOrder
    viewCount?: SortOrder
    status?: SortOrder
    isPublished?: SortOrder
    publishedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type RoadmapAvgOrderByAggregateInput = {
    estimatedWeeks?: SortOrder
    cloneCount?: SortOrder
    viewCount?: SortOrder
  }

  export type RoadmapMaxOrderByAggregateInput = {
    id?: SortOrder
    ownerId?: SortOrder
    creatorName?: SortOrder
    title?: SortOrder
    description?: SortOrder
    goal?: SortOrder
    category?: SortOrder
    difficulty?: SortOrder
    estimatedWeeks?: SortOrder
    cloneCount?: SortOrder
    viewCount?: SortOrder
    status?: SortOrder
    isPublished?: SortOrder
    publishedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type RoadmapMinOrderByAggregateInput = {
    id?: SortOrder
    ownerId?: SortOrder
    creatorName?: SortOrder
    title?: SortOrder
    description?: SortOrder
    goal?: SortOrder
    category?: SortOrder
    difficulty?: SortOrder
    estimatedWeeks?: SortOrder
    cloneCount?: SortOrder
    viewCount?: SortOrder
    status?: SortOrder
    isPublished?: SortOrder
    publishedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type RoadmapSumOrderByAggregateInput = {
    estimatedWeeks?: SortOrder
    cloneCount?: SortOrder
    viewCount?: SortOrder
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

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
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

  export type RoadmapScalarRelationFilter = {
    is?: RoadmapWhereInput
    isNot?: RoadmapWhereInput
  }

  export type RoadmapNodeNullableScalarRelationFilter = {
    is?: RoadmapNodeWhereInput | null
    isNot?: RoadmapNodeWhereInput | null
  }

  export type RoadmapNodeCountOrderByAggregateInput = {
    id?: SortOrder
    roadmapId?: SortOrder
    title?: SortOrder
    description?: SortOrder
    type?: SortOrder
    position?: SortOrder
    metadata?: SortOrder
    parentId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type RoadmapNodeAvgOrderByAggregateInput = {
    position?: SortOrder
  }

  export type RoadmapNodeMaxOrderByAggregateInput = {
    id?: SortOrder
    roadmapId?: SortOrder
    title?: SortOrder
    description?: SortOrder
    type?: SortOrder
    position?: SortOrder
    parentId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type RoadmapNodeMinOrderByAggregateInput = {
    id?: SortOrder
    roadmapId?: SortOrder
    title?: SortOrder
    description?: SortOrder
    type?: SortOrder
    position?: SortOrder
    parentId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type RoadmapNodeSumOrderByAggregateInput = {
    position?: SortOrder
  }

  export type RoadmapCollaboratorRoadmapIdEmailCompoundUniqueInput = {
    roadmapId: string
    email: string
  }

  export type RoadmapCollaboratorCountOrderByAggregateInput = {
    id?: SortOrder
    roadmapId?: SortOrder
    userId?: SortOrder
    email?: SortOrder
    role?: SortOrder
    status?: SortOrder
    invitedAt?: SortOrder
    joinedAt?: SortOrder
  }

  export type RoadmapCollaboratorMaxOrderByAggregateInput = {
    id?: SortOrder
    roadmapId?: SortOrder
    userId?: SortOrder
    email?: SortOrder
    role?: SortOrder
    status?: SortOrder
    invitedAt?: SortOrder
    joinedAt?: SortOrder
  }

  export type RoadmapCollaboratorMinOrderByAggregateInput = {
    id?: SortOrder
    roadmapId?: SortOrder
    userId?: SortOrder
    email?: SortOrder
    role?: SortOrder
    status?: SortOrder
    invitedAt?: SortOrder
    joinedAt?: SortOrder
  }

  export type RoadmapNodeScalarRelationFilter = {
    is?: RoadmapNodeWhereInput
    isNot?: RoadmapNodeWhereInput
  }

  export type RoadmapProgressNodeIdUserIdCompoundUniqueInput = {
    nodeId: string
    userId: string
  }

  export type RoadmapProgressCountOrderByAggregateInput = {
    id?: SortOrder
    roadmapId?: SortOrder
    nodeId?: SortOrder
    userId?: SortOrder
    status?: SortOrder
    percent?: SortOrder
    notes?: SortOrder
    completedAt?: SortOrder
    updatedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type RoadmapProgressAvgOrderByAggregateInput = {
    percent?: SortOrder
  }

  export type RoadmapProgressMaxOrderByAggregateInput = {
    id?: SortOrder
    roadmapId?: SortOrder
    nodeId?: SortOrder
    userId?: SortOrder
    status?: SortOrder
    percent?: SortOrder
    notes?: SortOrder
    completedAt?: SortOrder
    updatedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type RoadmapProgressMinOrderByAggregateInput = {
    id?: SortOrder
    roadmapId?: SortOrder
    nodeId?: SortOrder
    userId?: SortOrder
    status?: SortOrder
    percent?: SortOrder
    notes?: SortOrder
    completedAt?: SortOrder
    updatedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type RoadmapProgressSumOrderByAggregateInput = {
    percent?: SortOrder
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

  export type RoadmapTemplateCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    category?: SortOrder
    isPublic?: SortOrder
    authorId?: SortOrder
    definition?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type RoadmapTemplateMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    category?: SortOrder
    isPublic?: SortOrder
    authorId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type RoadmapTemplateMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    category?: SortOrder
    isPublic?: SortOrder
    authorId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
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

  export type RoadmapShareCountOrderByAggregateInput = {
    id?: SortOrder
    roadmapId?: SortOrder
    token?: SortOrder
    expiresAt?: SortOrder
    access?: SortOrder
    createdAt?: SortOrder
  }

  export type RoadmapShareMaxOrderByAggregateInput = {
    id?: SortOrder
    roadmapId?: SortOrder
    token?: SortOrder
    expiresAt?: SortOrder
    access?: SortOrder
    createdAt?: SortOrder
  }

  export type RoadmapShareMinOrderByAggregateInput = {
    id?: SortOrder
    roadmapId?: SortOrder
    token?: SortOrder
    expiresAt?: SortOrder
    access?: SortOrder
    createdAt?: SortOrder
  }

  export type RoadmapShareCreateNestedOneWithoutRoadmapInput = {
    create?: XOR<RoadmapShareCreateWithoutRoadmapInput, RoadmapShareUncheckedCreateWithoutRoadmapInput>
    connectOrCreate?: RoadmapShareCreateOrConnectWithoutRoadmapInput
    connect?: RoadmapShareWhereUniqueInput
  }

  export type RoadmapNodeCreateNestedManyWithoutRoadmapInput = {
    create?: XOR<RoadmapNodeCreateWithoutRoadmapInput, RoadmapNodeUncheckedCreateWithoutRoadmapInput> | RoadmapNodeCreateWithoutRoadmapInput[] | RoadmapNodeUncheckedCreateWithoutRoadmapInput[]
    connectOrCreate?: RoadmapNodeCreateOrConnectWithoutRoadmapInput | RoadmapNodeCreateOrConnectWithoutRoadmapInput[]
    createMany?: RoadmapNodeCreateManyRoadmapInputEnvelope
    connect?: RoadmapNodeWhereUniqueInput | RoadmapNodeWhereUniqueInput[]
  }

  export type RoadmapCollaboratorCreateNestedManyWithoutRoadmapInput = {
    create?: XOR<RoadmapCollaboratorCreateWithoutRoadmapInput, RoadmapCollaboratorUncheckedCreateWithoutRoadmapInput> | RoadmapCollaboratorCreateWithoutRoadmapInput[] | RoadmapCollaboratorUncheckedCreateWithoutRoadmapInput[]
    connectOrCreate?: RoadmapCollaboratorCreateOrConnectWithoutRoadmapInput | RoadmapCollaboratorCreateOrConnectWithoutRoadmapInput[]
    createMany?: RoadmapCollaboratorCreateManyRoadmapInputEnvelope
    connect?: RoadmapCollaboratorWhereUniqueInput | RoadmapCollaboratorWhereUniqueInput[]
  }

  export type RoadmapProgressCreateNestedManyWithoutRoadmapInput = {
    create?: XOR<RoadmapProgressCreateWithoutRoadmapInput, RoadmapProgressUncheckedCreateWithoutRoadmapInput> | RoadmapProgressCreateWithoutRoadmapInput[] | RoadmapProgressUncheckedCreateWithoutRoadmapInput[]
    connectOrCreate?: RoadmapProgressCreateOrConnectWithoutRoadmapInput | RoadmapProgressCreateOrConnectWithoutRoadmapInput[]
    createMany?: RoadmapProgressCreateManyRoadmapInputEnvelope
    connect?: RoadmapProgressWhereUniqueInput | RoadmapProgressWhereUniqueInput[]
  }

  export type RoadmapShareUncheckedCreateNestedOneWithoutRoadmapInput = {
    create?: XOR<RoadmapShareCreateWithoutRoadmapInput, RoadmapShareUncheckedCreateWithoutRoadmapInput>
    connectOrCreate?: RoadmapShareCreateOrConnectWithoutRoadmapInput
    connect?: RoadmapShareWhereUniqueInput
  }

  export type RoadmapNodeUncheckedCreateNestedManyWithoutRoadmapInput = {
    create?: XOR<RoadmapNodeCreateWithoutRoadmapInput, RoadmapNodeUncheckedCreateWithoutRoadmapInput> | RoadmapNodeCreateWithoutRoadmapInput[] | RoadmapNodeUncheckedCreateWithoutRoadmapInput[]
    connectOrCreate?: RoadmapNodeCreateOrConnectWithoutRoadmapInput | RoadmapNodeCreateOrConnectWithoutRoadmapInput[]
    createMany?: RoadmapNodeCreateManyRoadmapInputEnvelope
    connect?: RoadmapNodeWhereUniqueInput | RoadmapNodeWhereUniqueInput[]
  }

  export type RoadmapCollaboratorUncheckedCreateNestedManyWithoutRoadmapInput = {
    create?: XOR<RoadmapCollaboratorCreateWithoutRoadmapInput, RoadmapCollaboratorUncheckedCreateWithoutRoadmapInput> | RoadmapCollaboratorCreateWithoutRoadmapInput[] | RoadmapCollaboratorUncheckedCreateWithoutRoadmapInput[]
    connectOrCreate?: RoadmapCollaboratorCreateOrConnectWithoutRoadmapInput | RoadmapCollaboratorCreateOrConnectWithoutRoadmapInput[]
    createMany?: RoadmapCollaboratorCreateManyRoadmapInputEnvelope
    connect?: RoadmapCollaboratorWhereUniqueInput | RoadmapCollaboratorWhereUniqueInput[]
  }

  export type RoadmapProgressUncheckedCreateNestedManyWithoutRoadmapInput = {
    create?: XOR<RoadmapProgressCreateWithoutRoadmapInput, RoadmapProgressUncheckedCreateWithoutRoadmapInput> | RoadmapProgressCreateWithoutRoadmapInput[] | RoadmapProgressUncheckedCreateWithoutRoadmapInput[]
    connectOrCreate?: RoadmapProgressCreateOrConnectWithoutRoadmapInput | RoadmapProgressCreateOrConnectWithoutRoadmapInput[]
    createMany?: RoadmapProgressCreateManyRoadmapInputEnvelope
    connect?: RoadmapProgressWhereUniqueInput | RoadmapProgressWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type RoadmapShareUpdateOneWithoutRoadmapNestedInput = {
    create?: XOR<RoadmapShareCreateWithoutRoadmapInput, RoadmapShareUncheckedCreateWithoutRoadmapInput>
    connectOrCreate?: RoadmapShareCreateOrConnectWithoutRoadmapInput
    upsert?: RoadmapShareUpsertWithoutRoadmapInput
    disconnect?: RoadmapShareWhereInput | boolean
    delete?: RoadmapShareWhereInput | boolean
    connect?: RoadmapShareWhereUniqueInput
    update?: XOR<XOR<RoadmapShareUpdateToOneWithWhereWithoutRoadmapInput, RoadmapShareUpdateWithoutRoadmapInput>, RoadmapShareUncheckedUpdateWithoutRoadmapInput>
  }

  export type RoadmapNodeUpdateManyWithoutRoadmapNestedInput = {
    create?: XOR<RoadmapNodeCreateWithoutRoadmapInput, RoadmapNodeUncheckedCreateWithoutRoadmapInput> | RoadmapNodeCreateWithoutRoadmapInput[] | RoadmapNodeUncheckedCreateWithoutRoadmapInput[]
    connectOrCreate?: RoadmapNodeCreateOrConnectWithoutRoadmapInput | RoadmapNodeCreateOrConnectWithoutRoadmapInput[]
    upsert?: RoadmapNodeUpsertWithWhereUniqueWithoutRoadmapInput | RoadmapNodeUpsertWithWhereUniqueWithoutRoadmapInput[]
    createMany?: RoadmapNodeCreateManyRoadmapInputEnvelope
    set?: RoadmapNodeWhereUniqueInput | RoadmapNodeWhereUniqueInput[]
    disconnect?: RoadmapNodeWhereUniqueInput | RoadmapNodeWhereUniqueInput[]
    delete?: RoadmapNodeWhereUniqueInput | RoadmapNodeWhereUniqueInput[]
    connect?: RoadmapNodeWhereUniqueInput | RoadmapNodeWhereUniqueInput[]
    update?: RoadmapNodeUpdateWithWhereUniqueWithoutRoadmapInput | RoadmapNodeUpdateWithWhereUniqueWithoutRoadmapInput[]
    updateMany?: RoadmapNodeUpdateManyWithWhereWithoutRoadmapInput | RoadmapNodeUpdateManyWithWhereWithoutRoadmapInput[]
    deleteMany?: RoadmapNodeScalarWhereInput | RoadmapNodeScalarWhereInput[]
  }

  export type RoadmapCollaboratorUpdateManyWithoutRoadmapNestedInput = {
    create?: XOR<RoadmapCollaboratorCreateWithoutRoadmapInput, RoadmapCollaboratorUncheckedCreateWithoutRoadmapInput> | RoadmapCollaboratorCreateWithoutRoadmapInput[] | RoadmapCollaboratorUncheckedCreateWithoutRoadmapInput[]
    connectOrCreate?: RoadmapCollaboratorCreateOrConnectWithoutRoadmapInput | RoadmapCollaboratorCreateOrConnectWithoutRoadmapInput[]
    upsert?: RoadmapCollaboratorUpsertWithWhereUniqueWithoutRoadmapInput | RoadmapCollaboratorUpsertWithWhereUniqueWithoutRoadmapInput[]
    createMany?: RoadmapCollaboratorCreateManyRoadmapInputEnvelope
    set?: RoadmapCollaboratorWhereUniqueInput | RoadmapCollaboratorWhereUniqueInput[]
    disconnect?: RoadmapCollaboratorWhereUniqueInput | RoadmapCollaboratorWhereUniqueInput[]
    delete?: RoadmapCollaboratorWhereUniqueInput | RoadmapCollaboratorWhereUniqueInput[]
    connect?: RoadmapCollaboratorWhereUniqueInput | RoadmapCollaboratorWhereUniqueInput[]
    update?: RoadmapCollaboratorUpdateWithWhereUniqueWithoutRoadmapInput | RoadmapCollaboratorUpdateWithWhereUniqueWithoutRoadmapInput[]
    updateMany?: RoadmapCollaboratorUpdateManyWithWhereWithoutRoadmapInput | RoadmapCollaboratorUpdateManyWithWhereWithoutRoadmapInput[]
    deleteMany?: RoadmapCollaboratorScalarWhereInput | RoadmapCollaboratorScalarWhereInput[]
  }

  export type RoadmapProgressUpdateManyWithoutRoadmapNestedInput = {
    create?: XOR<RoadmapProgressCreateWithoutRoadmapInput, RoadmapProgressUncheckedCreateWithoutRoadmapInput> | RoadmapProgressCreateWithoutRoadmapInput[] | RoadmapProgressUncheckedCreateWithoutRoadmapInput[]
    connectOrCreate?: RoadmapProgressCreateOrConnectWithoutRoadmapInput | RoadmapProgressCreateOrConnectWithoutRoadmapInput[]
    upsert?: RoadmapProgressUpsertWithWhereUniqueWithoutRoadmapInput | RoadmapProgressUpsertWithWhereUniqueWithoutRoadmapInput[]
    createMany?: RoadmapProgressCreateManyRoadmapInputEnvelope
    set?: RoadmapProgressWhereUniqueInput | RoadmapProgressWhereUniqueInput[]
    disconnect?: RoadmapProgressWhereUniqueInput | RoadmapProgressWhereUniqueInput[]
    delete?: RoadmapProgressWhereUniqueInput | RoadmapProgressWhereUniqueInput[]
    connect?: RoadmapProgressWhereUniqueInput | RoadmapProgressWhereUniqueInput[]
    update?: RoadmapProgressUpdateWithWhereUniqueWithoutRoadmapInput | RoadmapProgressUpdateWithWhereUniqueWithoutRoadmapInput[]
    updateMany?: RoadmapProgressUpdateManyWithWhereWithoutRoadmapInput | RoadmapProgressUpdateManyWithWhereWithoutRoadmapInput[]
    deleteMany?: RoadmapProgressScalarWhereInput | RoadmapProgressScalarWhereInput[]
  }

  export type RoadmapShareUncheckedUpdateOneWithoutRoadmapNestedInput = {
    create?: XOR<RoadmapShareCreateWithoutRoadmapInput, RoadmapShareUncheckedCreateWithoutRoadmapInput>
    connectOrCreate?: RoadmapShareCreateOrConnectWithoutRoadmapInput
    upsert?: RoadmapShareUpsertWithoutRoadmapInput
    disconnect?: RoadmapShareWhereInput | boolean
    delete?: RoadmapShareWhereInput | boolean
    connect?: RoadmapShareWhereUniqueInput
    update?: XOR<XOR<RoadmapShareUpdateToOneWithWhereWithoutRoadmapInput, RoadmapShareUpdateWithoutRoadmapInput>, RoadmapShareUncheckedUpdateWithoutRoadmapInput>
  }

  export type RoadmapNodeUncheckedUpdateManyWithoutRoadmapNestedInput = {
    create?: XOR<RoadmapNodeCreateWithoutRoadmapInput, RoadmapNodeUncheckedCreateWithoutRoadmapInput> | RoadmapNodeCreateWithoutRoadmapInput[] | RoadmapNodeUncheckedCreateWithoutRoadmapInput[]
    connectOrCreate?: RoadmapNodeCreateOrConnectWithoutRoadmapInput | RoadmapNodeCreateOrConnectWithoutRoadmapInput[]
    upsert?: RoadmapNodeUpsertWithWhereUniqueWithoutRoadmapInput | RoadmapNodeUpsertWithWhereUniqueWithoutRoadmapInput[]
    createMany?: RoadmapNodeCreateManyRoadmapInputEnvelope
    set?: RoadmapNodeWhereUniqueInput | RoadmapNodeWhereUniqueInput[]
    disconnect?: RoadmapNodeWhereUniqueInput | RoadmapNodeWhereUniqueInput[]
    delete?: RoadmapNodeWhereUniqueInput | RoadmapNodeWhereUniqueInput[]
    connect?: RoadmapNodeWhereUniqueInput | RoadmapNodeWhereUniqueInput[]
    update?: RoadmapNodeUpdateWithWhereUniqueWithoutRoadmapInput | RoadmapNodeUpdateWithWhereUniqueWithoutRoadmapInput[]
    updateMany?: RoadmapNodeUpdateManyWithWhereWithoutRoadmapInput | RoadmapNodeUpdateManyWithWhereWithoutRoadmapInput[]
    deleteMany?: RoadmapNodeScalarWhereInput | RoadmapNodeScalarWhereInput[]
  }

  export type RoadmapCollaboratorUncheckedUpdateManyWithoutRoadmapNestedInput = {
    create?: XOR<RoadmapCollaboratorCreateWithoutRoadmapInput, RoadmapCollaboratorUncheckedCreateWithoutRoadmapInput> | RoadmapCollaboratorCreateWithoutRoadmapInput[] | RoadmapCollaboratorUncheckedCreateWithoutRoadmapInput[]
    connectOrCreate?: RoadmapCollaboratorCreateOrConnectWithoutRoadmapInput | RoadmapCollaboratorCreateOrConnectWithoutRoadmapInput[]
    upsert?: RoadmapCollaboratorUpsertWithWhereUniqueWithoutRoadmapInput | RoadmapCollaboratorUpsertWithWhereUniqueWithoutRoadmapInput[]
    createMany?: RoadmapCollaboratorCreateManyRoadmapInputEnvelope
    set?: RoadmapCollaboratorWhereUniqueInput | RoadmapCollaboratorWhereUniqueInput[]
    disconnect?: RoadmapCollaboratorWhereUniqueInput | RoadmapCollaboratorWhereUniqueInput[]
    delete?: RoadmapCollaboratorWhereUniqueInput | RoadmapCollaboratorWhereUniqueInput[]
    connect?: RoadmapCollaboratorWhereUniqueInput | RoadmapCollaboratorWhereUniqueInput[]
    update?: RoadmapCollaboratorUpdateWithWhereUniqueWithoutRoadmapInput | RoadmapCollaboratorUpdateWithWhereUniqueWithoutRoadmapInput[]
    updateMany?: RoadmapCollaboratorUpdateManyWithWhereWithoutRoadmapInput | RoadmapCollaboratorUpdateManyWithWhereWithoutRoadmapInput[]
    deleteMany?: RoadmapCollaboratorScalarWhereInput | RoadmapCollaboratorScalarWhereInput[]
  }

  export type RoadmapProgressUncheckedUpdateManyWithoutRoadmapNestedInput = {
    create?: XOR<RoadmapProgressCreateWithoutRoadmapInput, RoadmapProgressUncheckedCreateWithoutRoadmapInput> | RoadmapProgressCreateWithoutRoadmapInput[] | RoadmapProgressUncheckedCreateWithoutRoadmapInput[]
    connectOrCreate?: RoadmapProgressCreateOrConnectWithoutRoadmapInput | RoadmapProgressCreateOrConnectWithoutRoadmapInput[]
    upsert?: RoadmapProgressUpsertWithWhereUniqueWithoutRoadmapInput | RoadmapProgressUpsertWithWhereUniqueWithoutRoadmapInput[]
    createMany?: RoadmapProgressCreateManyRoadmapInputEnvelope
    set?: RoadmapProgressWhereUniqueInput | RoadmapProgressWhereUniqueInput[]
    disconnect?: RoadmapProgressWhereUniqueInput | RoadmapProgressWhereUniqueInput[]
    delete?: RoadmapProgressWhereUniqueInput | RoadmapProgressWhereUniqueInput[]
    connect?: RoadmapProgressWhereUniqueInput | RoadmapProgressWhereUniqueInput[]
    update?: RoadmapProgressUpdateWithWhereUniqueWithoutRoadmapInput | RoadmapProgressUpdateWithWhereUniqueWithoutRoadmapInput[]
    updateMany?: RoadmapProgressUpdateManyWithWhereWithoutRoadmapInput | RoadmapProgressUpdateManyWithWhereWithoutRoadmapInput[]
    deleteMany?: RoadmapProgressScalarWhereInput | RoadmapProgressScalarWhereInput[]
  }

  export type RoadmapCreateNestedOneWithoutNodesInput = {
    create?: XOR<RoadmapCreateWithoutNodesInput, RoadmapUncheckedCreateWithoutNodesInput>
    connectOrCreate?: RoadmapCreateOrConnectWithoutNodesInput
    connect?: RoadmapWhereUniqueInput
  }

  export type RoadmapNodeCreateNestedOneWithoutChildrenInput = {
    create?: XOR<RoadmapNodeCreateWithoutChildrenInput, RoadmapNodeUncheckedCreateWithoutChildrenInput>
    connectOrCreate?: RoadmapNodeCreateOrConnectWithoutChildrenInput
    connect?: RoadmapNodeWhereUniqueInput
  }

  export type RoadmapNodeCreateNestedManyWithoutParentInput = {
    create?: XOR<RoadmapNodeCreateWithoutParentInput, RoadmapNodeUncheckedCreateWithoutParentInput> | RoadmapNodeCreateWithoutParentInput[] | RoadmapNodeUncheckedCreateWithoutParentInput[]
    connectOrCreate?: RoadmapNodeCreateOrConnectWithoutParentInput | RoadmapNodeCreateOrConnectWithoutParentInput[]
    createMany?: RoadmapNodeCreateManyParentInputEnvelope
    connect?: RoadmapNodeWhereUniqueInput | RoadmapNodeWhereUniqueInput[]
  }

  export type RoadmapProgressCreateNestedManyWithoutNodeInput = {
    create?: XOR<RoadmapProgressCreateWithoutNodeInput, RoadmapProgressUncheckedCreateWithoutNodeInput> | RoadmapProgressCreateWithoutNodeInput[] | RoadmapProgressUncheckedCreateWithoutNodeInput[]
    connectOrCreate?: RoadmapProgressCreateOrConnectWithoutNodeInput | RoadmapProgressCreateOrConnectWithoutNodeInput[]
    createMany?: RoadmapProgressCreateManyNodeInputEnvelope
    connect?: RoadmapProgressWhereUniqueInput | RoadmapProgressWhereUniqueInput[]
  }

  export type RoadmapNodeUncheckedCreateNestedManyWithoutParentInput = {
    create?: XOR<RoadmapNodeCreateWithoutParentInput, RoadmapNodeUncheckedCreateWithoutParentInput> | RoadmapNodeCreateWithoutParentInput[] | RoadmapNodeUncheckedCreateWithoutParentInput[]
    connectOrCreate?: RoadmapNodeCreateOrConnectWithoutParentInput | RoadmapNodeCreateOrConnectWithoutParentInput[]
    createMany?: RoadmapNodeCreateManyParentInputEnvelope
    connect?: RoadmapNodeWhereUniqueInput | RoadmapNodeWhereUniqueInput[]
  }

  export type RoadmapProgressUncheckedCreateNestedManyWithoutNodeInput = {
    create?: XOR<RoadmapProgressCreateWithoutNodeInput, RoadmapProgressUncheckedCreateWithoutNodeInput> | RoadmapProgressCreateWithoutNodeInput[] | RoadmapProgressUncheckedCreateWithoutNodeInput[]
    connectOrCreate?: RoadmapProgressCreateOrConnectWithoutNodeInput | RoadmapProgressCreateOrConnectWithoutNodeInput[]
    createMany?: RoadmapProgressCreateManyNodeInputEnvelope
    connect?: RoadmapProgressWhereUniqueInput | RoadmapProgressWhereUniqueInput[]
  }

  export type RoadmapUpdateOneRequiredWithoutNodesNestedInput = {
    create?: XOR<RoadmapCreateWithoutNodesInput, RoadmapUncheckedCreateWithoutNodesInput>
    connectOrCreate?: RoadmapCreateOrConnectWithoutNodesInput
    upsert?: RoadmapUpsertWithoutNodesInput
    connect?: RoadmapWhereUniqueInput
    update?: XOR<XOR<RoadmapUpdateToOneWithWhereWithoutNodesInput, RoadmapUpdateWithoutNodesInput>, RoadmapUncheckedUpdateWithoutNodesInput>
  }

  export type RoadmapNodeUpdateOneWithoutChildrenNestedInput = {
    create?: XOR<RoadmapNodeCreateWithoutChildrenInput, RoadmapNodeUncheckedCreateWithoutChildrenInput>
    connectOrCreate?: RoadmapNodeCreateOrConnectWithoutChildrenInput
    upsert?: RoadmapNodeUpsertWithoutChildrenInput
    disconnect?: RoadmapNodeWhereInput | boolean
    delete?: RoadmapNodeWhereInput | boolean
    connect?: RoadmapNodeWhereUniqueInput
    update?: XOR<XOR<RoadmapNodeUpdateToOneWithWhereWithoutChildrenInput, RoadmapNodeUpdateWithoutChildrenInput>, RoadmapNodeUncheckedUpdateWithoutChildrenInput>
  }

  export type RoadmapNodeUpdateManyWithoutParentNestedInput = {
    create?: XOR<RoadmapNodeCreateWithoutParentInput, RoadmapNodeUncheckedCreateWithoutParentInput> | RoadmapNodeCreateWithoutParentInput[] | RoadmapNodeUncheckedCreateWithoutParentInput[]
    connectOrCreate?: RoadmapNodeCreateOrConnectWithoutParentInput | RoadmapNodeCreateOrConnectWithoutParentInput[]
    upsert?: RoadmapNodeUpsertWithWhereUniqueWithoutParentInput | RoadmapNodeUpsertWithWhereUniqueWithoutParentInput[]
    createMany?: RoadmapNodeCreateManyParentInputEnvelope
    set?: RoadmapNodeWhereUniqueInput | RoadmapNodeWhereUniqueInput[]
    disconnect?: RoadmapNodeWhereUniqueInput | RoadmapNodeWhereUniqueInput[]
    delete?: RoadmapNodeWhereUniqueInput | RoadmapNodeWhereUniqueInput[]
    connect?: RoadmapNodeWhereUniqueInput | RoadmapNodeWhereUniqueInput[]
    update?: RoadmapNodeUpdateWithWhereUniqueWithoutParentInput | RoadmapNodeUpdateWithWhereUniqueWithoutParentInput[]
    updateMany?: RoadmapNodeUpdateManyWithWhereWithoutParentInput | RoadmapNodeUpdateManyWithWhereWithoutParentInput[]
    deleteMany?: RoadmapNodeScalarWhereInput | RoadmapNodeScalarWhereInput[]
  }

  export type RoadmapProgressUpdateManyWithoutNodeNestedInput = {
    create?: XOR<RoadmapProgressCreateWithoutNodeInput, RoadmapProgressUncheckedCreateWithoutNodeInput> | RoadmapProgressCreateWithoutNodeInput[] | RoadmapProgressUncheckedCreateWithoutNodeInput[]
    connectOrCreate?: RoadmapProgressCreateOrConnectWithoutNodeInput | RoadmapProgressCreateOrConnectWithoutNodeInput[]
    upsert?: RoadmapProgressUpsertWithWhereUniqueWithoutNodeInput | RoadmapProgressUpsertWithWhereUniqueWithoutNodeInput[]
    createMany?: RoadmapProgressCreateManyNodeInputEnvelope
    set?: RoadmapProgressWhereUniqueInput | RoadmapProgressWhereUniqueInput[]
    disconnect?: RoadmapProgressWhereUniqueInput | RoadmapProgressWhereUniqueInput[]
    delete?: RoadmapProgressWhereUniqueInput | RoadmapProgressWhereUniqueInput[]
    connect?: RoadmapProgressWhereUniqueInput | RoadmapProgressWhereUniqueInput[]
    update?: RoadmapProgressUpdateWithWhereUniqueWithoutNodeInput | RoadmapProgressUpdateWithWhereUniqueWithoutNodeInput[]
    updateMany?: RoadmapProgressUpdateManyWithWhereWithoutNodeInput | RoadmapProgressUpdateManyWithWhereWithoutNodeInput[]
    deleteMany?: RoadmapProgressScalarWhereInput | RoadmapProgressScalarWhereInput[]
  }

  export type RoadmapNodeUncheckedUpdateManyWithoutParentNestedInput = {
    create?: XOR<RoadmapNodeCreateWithoutParentInput, RoadmapNodeUncheckedCreateWithoutParentInput> | RoadmapNodeCreateWithoutParentInput[] | RoadmapNodeUncheckedCreateWithoutParentInput[]
    connectOrCreate?: RoadmapNodeCreateOrConnectWithoutParentInput | RoadmapNodeCreateOrConnectWithoutParentInput[]
    upsert?: RoadmapNodeUpsertWithWhereUniqueWithoutParentInput | RoadmapNodeUpsertWithWhereUniqueWithoutParentInput[]
    createMany?: RoadmapNodeCreateManyParentInputEnvelope
    set?: RoadmapNodeWhereUniqueInput | RoadmapNodeWhereUniqueInput[]
    disconnect?: RoadmapNodeWhereUniqueInput | RoadmapNodeWhereUniqueInput[]
    delete?: RoadmapNodeWhereUniqueInput | RoadmapNodeWhereUniqueInput[]
    connect?: RoadmapNodeWhereUniqueInput | RoadmapNodeWhereUniqueInput[]
    update?: RoadmapNodeUpdateWithWhereUniqueWithoutParentInput | RoadmapNodeUpdateWithWhereUniqueWithoutParentInput[]
    updateMany?: RoadmapNodeUpdateManyWithWhereWithoutParentInput | RoadmapNodeUpdateManyWithWhereWithoutParentInput[]
    deleteMany?: RoadmapNodeScalarWhereInput | RoadmapNodeScalarWhereInput[]
  }

  export type RoadmapProgressUncheckedUpdateManyWithoutNodeNestedInput = {
    create?: XOR<RoadmapProgressCreateWithoutNodeInput, RoadmapProgressUncheckedCreateWithoutNodeInput> | RoadmapProgressCreateWithoutNodeInput[] | RoadmapProgressUncheckedCreateWithoutNodeInput[]
    connectOrCreate?: RoadmapProgressCreateOrConnectWithoutNodeInput | RoadmapProgressCreateOrConnectWithoutNodeInput[]
    upsert?: RoadmapProgressUpsertWithWhereUniqueWithoutNodeInput | RoadmapProgressUpsertWithWhereUniqueWithoutNodeInput[]
    createMany?: RoadmapProgressCreateManyNodeInputEnvelope
    set?: RoadmapProgressWhereUniqueInput | RoadmapProgressWhereUniqueInput[]
    disconnect?: RoadmapProgressWhereUniqueInput | RoadmapProgressWhereUniqueInput[]
    delete?: RoadmapProgressWhereUniqueInput | RoadmapProgressWhereUniqueInput[]
    connect?: RoadmapProgressWhereUniqueInput | RoadmapProgressWhereUniqueInput[]
    update?: RoadmapProgressUpdateWithWhereUniqueWithoutNodeInput | RoadmapProgressUpdateWithWhereUniqueWithoutNodeInput[]
    updateMany?: RoadmapProgressUpdateManyWithWhereWithoutNodeInput | RoadmapProgressUpdateManyWithWhereWithoutNodeInput[]
    deleteMany?: RoadmapProgressScalarWhereInput | RoadmapProgressScalarWhereInput[]
  }

  export type RoadmapCreateNestedOneWithoutCollaboratorsInput = {
    create?: XOR<RoadmapCreateWithoutCollaboratorsInput, RoadmapUncheckedCreateWithoutCollaboratorsInput>
    connectOrCreate?: RoadmapCreateOrConnectWithoutCollaboratorsInput
    connect?: RoadmapWhereUniqueInput
  }

  export type RoadmapUpdateOneRequiredWithoutCollaboratorsNestedInput = {
    create?: XOR<RoadmapCreateWithoutCollaboratorsInput, RoadmapUncheckedCreateWithoutCollaboratorsInput>
    connectOrCreate?: RoadmapCreateOrConnectWithoutCollaboratorsInput
    upsert?: RoadmapUpsertWithoutCollaboratorsInput
    connect?: RoadmapWhereUniqueInput
    update?: XOR<XOR<RoadmapUpdateToOneWithWhereWithoutCollaboratorsInput, RoadmapUpdateWithoutCollaboratorsInput>, RoadmapUncheckedUpdateWithoutCollaboratorsInput>
  }

  export type RoadmapCreateNestedOneWithoutProgressInput = {
    create?: XOR<RoadmapCreateWithoutProgressInput, RoadmapUncheckedCreateWithoutProgressInput>
    connectOrCreate?: RoadmapCreateOrConnectWithoutProgressInput
    connect?: RoadmapWhereUniqueInput
  }

  export type RoadmapNodeCreateNestedOneWithoutProgressInput = {
    create?: XOR<RoadmapNodeCreateWithoutProgressInput, RoadmapNodeUncheckedCreateWithoutProgressInput>
    connectOrCreate?: RoadmapNodeCreateOrConnectWithoutProgressInput
    connect?: RoadmapNodeWhereUniqueInput
  }

  export type RoadmapUpdateOneRequiredWithoutProgressNestedInput = {
    create?: XOR<RoadmapCreateWithoutProgressInput, RoadmapUncheckedCreateWithoutProgressInput>
    connectOrCreate?: RoadmapCreateOrConnectWithoutProgressInput
    upsert?: RoadmapUpsertWithoutProgressInput
    connect?: RoadmapWhereUniqueInput
    update?: XOR<XOR<RoadmapUpdateToOneWithWhereWithoutProgressInput, RoadmapUpdateWithoutProgressInput>, RoadmapUncheckedUpdateWithoutProgressInput>
  }

  export type RoadmapNodeUpdateOneRequiredWithoutProgressNestedInput = {
    create?: XOR<RoadmapNodeCreateWithoutProgressInput, RoadmapNodeUncheckedCreateWithoutProgressInput>
    connectOrCreate?: RoadmapNodeCreateOrConnectWithoutProgressInput
    upsert?: RoadmapNodeUpsertWithoutProgressInput
    connect?: RoadmapNodeWhereUniqueInput
    update?: XOR<XOR<RoadmapNodeUpdateToOneWithWhereWithoutProgressInput, RoadmapNodeUpdateWithoutProgressInput>, RoadmapNodeUncheckedUpdateWithoutProgressInput>
  }

  export type RoadmapCreateNestedOneWithoutShareInput = {
    create?: XOR<RoadmapCreateWithoutShareInput, RoadmapUncheckedCreateWithoutShareInput>
    connectOrCreate?: RoadmapCreateOrConnectWithoutShareInput
    connect?: RoadmapWhereUniqueInput
  }

  export type RoadmapUpdateOneRequiredWithoutShareNestedInput = {
    create?: XOR<RoadmapCreateWithoutShareInput, RoadmapUncheckedCreateWithoutShareInput>
    connectOrCreate?: RoadmapCreateOrConnectWithoutShareInput
    upsert?: RoadmapUpsertWithoutShareInput
    connect?: RoadmapWhereUniqueInput
    update?: XOR<XOR<RoadmapUpdateToOneWithWhereWithoutShareInput, RoadmapUpdateWithoutShareInput>, RoadmapUncheckedUpdateWithoutShareInput>
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

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
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

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
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

  export type RoadmapShareCreateWithoutRoadmapInput = {
    id?: string
    token?: string
    expiresAt?: Date | string | null
    access?: string
    createdAt?: Date | string
  }

  export type RoadmapShareUncheckedCreateWithoutRoadmapInput = {
    id?: string
    token?: string
    expiresAt?: Date | string | null
    access?: string
    createdAt?: Date | string
  }

  export type RoadmapShareCreateOrConnectWithoutRoadmapInput = {
    where: RoadmapShareWhereUniqueInput
    create: XOR<RoadmapShareCreateWithoutRoadmapInput, RoadmapShareUncheckedCreateWithoutRoadmapInput>
  }

  export type RoadmapNodeCreateWithoutRoadmapInput = {
    id?: string
    title: string
    description?: string | null
    type?: string
    position?: number
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    parent?: RoadmapNodeCreateNestedOneWithoutChildrenInput
    children?: RoadmapNodeCreateNestedManyWithoutParentInput
    progress?: RoadmapProgressCreateNestedManyWithoutNodeInput
  }

  export type RoadmapNodeUncheckedCreateWithoutRoadmapInput = {
    id?: string
    title: string
    description?: string | null
    type?: string
    position?: number
    metadata?: NullableJsonNullValueInput | InputJsonValue
    parentId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    children?: RoadmapNodeUncheckedCreateNestedManyWithoutParentInput
    progress?: RoadmapProgressUncheckedCreateNestedManyWithoutNodeInput
  }

  export type RoadmapNodeCreateOrConnectWithoutRoadmapInput = {
    where: RoadmapNodeWhereUniqueInput
    create: XOR<RoadmapNodeCreateWithoutRoadmapInput, RoadmapNodeUncheckedCreateWithoutRoadmapInput>
  }

  export type RoadmapNodeCreateManyRoadmapInputEnvelope = {
    data: RoadmapNodeCreateManyRoadmapInput | RoadmapNodeCreateManyRoadmapInput[]
    skipDuplicates?: boolean
  }

  export type RoadmapCollaboratorCreateWithoutRoadmapInput = {
    id?: string
    userId?: string | null
    email: string
    role?: string
    status?: string
    invitedAt?: Date | string
    joinedAt?: Date | string | null
  }

  export type RoadmapCollaboratorUncheckedCreateWithoutRoadmapInput = {
    id?: string
    userId?: string | null
    email: string
    role?: string
    status?: string
    invitedAt?: Date | string
    joinedAt?: Date | string | null
  }

  export type RoadmapCollaboratorCreateOrConnectWithoutRoadmapInput = {
    where: RoadmapCollaboratorWhereUniqueInput
    create: XOR<RoadmapCollaboratorCreateWithoutRoadmapInput, RoadmapCollaboratorUncheckedCreateWithoutRoadmapInput>
  }

  export type RoadmapCollaboratorCreateManyRoadmapInputEnvelope = {
    data: RoadmapCollaboratorCreateManyRoadmapInput | RoadmapCollaboratorCreateManyRoadmapInput[]
    skipDuplicates?: boolean
  }

  export type RoadmapProgressCreateWithoutRoadmapInput = {
    id?: string
    userId: string
    status?: string
    percent?: number
    notes?: string | null
    completedAt?: Date | string | null
    updatedAt?: Date | string
    createdAt?: Date | string
    node: RoadmapNodeCreateNestedOneWithoutProgressInput
  }

  export type RoadmapProgressUncheckedCreateWithoutRoadmapInput = {
    id?: string
    nodeId: string
    userId: string
    status?: string
    percent?: number
    notes?: string | null
    completedAt?: Date | string | null
    updatedAt?: Date | string
    createdAt?: Date | string
  }

  export type RoadmapProgressCreateOrConnectWithoutRoadmapInput = {
    where: RoadmapProgressWhereUniqueInput
    create: XOR<RoadmapProgressCreateWithoutRoadmapInput, RoadmapProgressUncheckedCreateWithoutRoadmapInput>
  }

  export type RoadmapProgressCreateManyRoadmapInputEnvelope = {
    data: RoadmapProgressCreateManyRoadmapInput | RoadmapProgressCreateManyRoadmapInput[]
    skipDuplicates?: boolean
  }

  export type RoadmapShareUpsertWithoutRoadmapInput = {
    update: XOR<RoadmapShareUpdateWithoutRoadmapInput, RoadmapShareUncheckedUpdateWithoutRoadmapInput>
    create: XOR<RoadmapShareCreateWithoutRoadmapInput, RoadmapShareUncheckedCreateWithoutRoadmapInput>
    where?: RoadmapShareWhereInput
  }

  export type RoadmapShareUpdateToOneWithWhereWithoutRoadmapInput = {
    where?: RoadmapShareWhereInput
    data: XOR<RoadmapShareUpdateWithoutRoadmapInput, RoadmapShareUncheckedUpdateWithoutRoadmapInput>
  }

  export type RoadmapShareUpdateWithoutRoadmapInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    access?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RoadmapShareUncheckedUpdateWithoutRoadmapInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    access?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RoadmapNodeUpsertWithWhereUniqueWithoutRoadmapInput = {
    where: RoadmapNodeWhereUniqueInput
    update: XOR<RoadmapNodeUpdateWithoutRoadmapInput, RoadmapNodeUncheckedUpdateWithoutRoadmapInput>
    create: XOR<RoadmapNodeCreateWithoutRoadmapInput, RoadmapNodeUncheckedCreateWithoutRoadmapInput>
  }

  export type RoadmapNodeUpdateWithWhereUniqueWithoutRoadmapInput = {
    where: RoadmapNodeWhereUniqueInput
    data: XOR<RoadmapNodeUpdateWithoutRoadmapInput, RoadmapNodeUncheckedUpdateWithoutRoadmapInput>
  }

  export type RoadmapNodeUpdateManyWithWhereWithoutRoadmapInput = {
    where: RoadmapNodeScalarWhereInput
    data: XOR<RoadmapNodeUpdateManyMutationInput, RoadmapNodeUncheckedUpdateManyWithoutRoadmapInput>
  }

  export type RoadmapNodeScalarWhereInput = {
    AND?: RoadmapNodeScalarWhereInput | RoadmapNodeScalarWhereInput[]
    OR?: RoadmapNodeScalarWhereInput[]
    NOT?: RoadmapNodeScalarWhereInput | RoadmapNodeScalarWhereInput[]
    id?: StringFilter<"RoadmapNode"> | string
    roadmapId?: StringFilter<"RoadmapNode"> | string
    title?: StringFilter<"RoadmapNode"> | string
    description?: StringNullableFilter<"RoadmapNode"> | string | null
    type?: StringFilter<"RoadmapNode"> | string
    position?: IntFilter<"RoadmapNode"> | number
    metadata?: JsonNullableFilter<"RoadmapNode">
    parentId?: StringNullableFilter<"RoadmapNode"> | string | null
    createdAt?: DateTimeFilter<"RoadmapNode"> | Date | string
    updatedAt?: DateTimeFilter<"RoadmapNode"> | Date | string
  }

  export type RoadmapCollaboratorUpsertWithWhereUniqueWithoutRoadmapInput = {
    where: RoadmapCollaboratorWhereUniqueInput
    update: XOR<RoadmapCollaboratorUpdateWithoutRoadmapInput, RoadmapCollaboratorUncheckedUpdateWithoutRoadmapInput>
    create: XOR<RoadmapCollaboratorCreateWithoutRoadmapInput, RoadmapCollaboratorUncheckedCreateWithoutRoadmapInput>
  }

  export type RoadmapCollaboratorUpdateWithWhereUniqueWithoutRoadmapInput = {
    where: RoadmapCollaboratorWhereUniqueInput
    data: XOR<RoadmapCollaboratorUpdateWithoutRoadmapInput, RoadmapCollaboratorUncheckedUpdateWithoutRoadmapInput>
  }

  export type RoadmapCollaboratorUpdateManyWithWhereWithoutRoadmapInput = {
    where: RoadmapCollaboratorScalarWhereInput
    data: XOR<RoadmapCollaboratorUpdateManyMutationInput, RoadmapCollaboratorUncheckedUpdateManyWithoutRoadmapInput>
  }

  export type RoadmapCollaboratorScalarWhereInput = {
    AND?: RoadmapCollaboratorScalarWhereInput | RoadmapCollaboratorScalarWhereInput[]
    OR?: RoadmapCollaboratorScalarWhereInput[]
    NOT?: RoadmapCollaboratorScalarWhereInput | RoadmapCollaboratorScalarWhereInput[]
    id?: StringFilter<"RoadmapCollaborator"> | string
    roadmapId?: StringFilter<"RoadmapCollaborator"> | string
    userId?: StringNullableFilter<"RoadmapCollaborator"> | string | null
    email?: StringFilter<"RoadmapCollaborator"> | string
    role?: StringFilter<"RoadmapCollaborator"> | string
    status?: StringFilter<"RoadmapCollaborator"> | string
    invitedAt?: DateTimeFilter<"RoadmapCollaborator"> | Date | string
    joinedAt?: DateTimeNullableFilter<"RoadmapCollaborator"> | Date | string | null
  }

  export type RoadmapProgressUpsertWithWhereUniqueWithoutRoadmapInput = {
    where: RoadmapProgressWhereUniqueInput
    update: XOR<RoadmapProgressUpdateWithoutRoadmapInput, RoadmapProgressUncheckedUpdateWithoutRoadmapInput>
    create: XOR<RoadmapProgressCreateWithoutRoadmapInput, RoadmapProgressUncheckedCreateWithoutRoadmapInput>
  }

  export type RoadmapProgressUpdateWithWhereUniqueWithoutRoadmapInput = {
    where: RoadmapProgressWhereUniqueInput
    data: XOR<RoadmapProgressUpdateWithoutRoadmapInput, RoadmapProgressUncheckedUpdateWithoutRoadmapInput>
  }

  export type RoadmapProgressUpdateManyWithWhereWithoutRoadmapInput = {
    where: RoadmapProgressScalarWhereInput
    data: XOR<RoadmapProgressUpdateManyMutationInput, RoadmapProgressUncheckedUpdateManyWithoutRoadmapInput>
  }

  export type RoadmapProgressScalarWhereInput = {
    AND?: RoadmapProgressScalarWhereInput | RoadmapProgressScalarWhereInput[]
    OR?: RoadmapProgressScalarWhereInput[]
    NOT?: RoadmapProgressScalarWhereInput | RoadmapProgressScalarWhereInput[]
    id?: StringFilter<"RoadmapProgress"> | string
    roadmapId?: StringFilter<"RoadmapProgress"> | string
    nodeId?: StringFilter<"RoadmapProgress"> | string
    userId?: StringFilter<"RoadmapProgress"> | string
    status?: StringFilter<"RoadmapProgress"> | string
    percent?: IntFilter<"RoadmapProgress"> | number
    notes?: StringNullableFilter<"RoadmapProgress"> | string | null
    completedAt?: DateTimeNullableFilter<"RoadmapProgress"> | Date | string | null
    updatedAt?: DateTimeFilter<"RoadmapProgress"> | Date | string
    createdAt?: DateTimeFilter<"RoadmapProgress"> | Date | string
  }

  export type RoadmapCreateWithoutNodesInput = {
    id?: string
    ownerId: string
    creatorName?: string | null
    title: string
    description?: string | null
    goal?: string | null
    category?: string | null
    difficulty?: string | null
    estimatedWeeks?: number | null
    tags?: NullableJsonNullValueInput | InputJsonValue
    cloneCount?: number
    viewCount?: number
    status?: string
    isPublished?: boolean
    publishedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    share?: RoadmapShareCreateNestedOneWithoutRoadmapInput
    collaborators?: RoadmapCollaboratorCreateNestedManyWithoutRoadmapInput
    progress?: RoadmapProgressCreateNestedManyWithoutRoadmapInput
  }

  export type RoadmapUncheckedCreateWithoutNodesInput = {
    id?: string
    ownerId: string
    creatorName?: string | null
    title: string
    description?: string | null
    goal?: string | null
    category?: string | null
    difficulty?: string | null
    estimatedWeeks?: number | null
    tags?: NullableJsonNullValueInput | InputJsonValue
    cloneCount?: number
    viewCount?: number
    status?: string
    isPublished?: boolean
    publishedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    share?: RoadmapShareUncheckedCreateNestedOneWithoutRoadmapInput
    collaborators?: RoadmapCollaboratorUncheckedCreateNestedManyWithoutRoadmapInput
    progress?: RoadmapProgressUncheckedCreateNestedManyWithoutRoadmapInput
  }

  export type RoadmapCreateOrConnectWithoutNodesInput = {
    where: RoadmapWhereUniqueInput
    create: XOR<RoadmapCreateWithoutNodesInput, RoadmapUncheckedCreateWithoutNodesInput>
  }

  export type RoadmapNodeCreateWithoutChildrenInput = {
    id?: string
    title: string
    description?: string | null
    type?: string
    position?: number
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    roadmap: RoadmapCreateNestedOneWithoutNodesInput
    parent?: RoadmapNodeCreateNestedOneWithoutChildrenInput
    progress?: RoadmapProgressCreateNestedManyWithoutNodeInput
  }

  export type RoadmapNodeUncheckedCreateWithoutChildrenInput = {
    id?: string
    roadmapId: string
    title: string
    description?: string | null
    type?: string
    position?: number
    metadata?: NullableJsonNullValueInput | InputJsonValue
    parentId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    progress?: RoadmapProgressUncheckedCreateNestedManyWithoutNodeInput
  }

  export type RoadmapNodeCreateOrConnectWithoutChildrenInput = {
    where: RoadmapNodeWhereUniqueInput
    create: XOR<RoadmapNodeCreateWithoutChildrenInput, RoadmapNodeUncheckedCreateWithoutChildrenInput>
  }

  export type RoadmapNodeCreateWithoutParentInput = {
    id?: string
    title: string
    description?: string | null
    type?: string
    position?: number
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    roadmap: RoadmapCreateNestedOneWithoutNodesInput
    children?: RoadmapNodeCreateNestedManyWithoutParentInput
    progress?: RoadmapProgressCreateNestedManyWithoutNodeInput
  }

  export type RoadmapNodeUncheckedCreateWithoutParentInput = {
    id?: string
    roadmapId: string
    title: string
    description?: string | null
    type?: string
    position?: number
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    children?: RoadmapNodeUncheckedCreateNestedManyWithoutParentInput
    progress?: RoadmapProgressUncheckedCreateNestedManyWithoutNodeInput
  }

  export type RoadmapNodeCreateOrConnectWithoutParentInput = {
    where: RoadmapNodeWhereUniqueInput
    create: XOR<RoadmapNodeCreateWithoutParentInput, RoadmapNodeUncheckedCreateWithoutParentInput>
  }

  export type RoadmapNodeCreateManyParentInputEnvelope = {
    data: RoadmapNodeCreateManyParentInput | RoadmapNodeCreateManyParentInput[]
    skipDuplicates?: boolean
  }

  export type RoadmapProgressCreateWithoutNodeInput = {
    id?: string
    userId: string
    status?: string
    percent?: number
    notes?: string | null
    completedAt?: Date | string | null
    updatedAt?: Date | string
    createdAt?: Date | string
    roadmap: RoadmapCreateNestedOneWithoutProgressInput
  }

  export type RoadmapProgressUncheckedCreateWithoutNodeInput = {
    id?: string
    roadmapId: string
    userId: string
    status?: string
    percent?: number
    notes?: string | null
    completedAt?: Date | string | null
    updatedAt?: Date | string
    createdAt?: Date | string
  }

  export type RoadmapProgressCreateOrConnectWithoutNodeInput = {
    where: RoadmapProgressWhereUniqueInput
    create: XOR<RoadmapProgressCreateWithoutNodeInput, RoadmapProgressUncheckedCreateWithoutNodeInput>
  }

  export type RoadmapProgressCreateManyNodeInputEnvelope = {
    data: RoadmapProgressCreateManyNodeInput | RoadmapProgressCreateManyNodeInput[]
    skipDuplicates?: boolean
  }

  export type RoadmapUpsertWithoutNodesInput = {
    update: XOR<RoadmapUpdateWithoutNodesInput, RoadmapUncheckedUpdateWithoutNodesInput>
    create: XOR<RoadmapCreateWithoutNodesInput, RoadmapUncheckedCreateWithoutNodesInput>
    where?: RoadmapWhereInput
  }

  export type RoadmapUpdateToOneWithWhereWithoutNodesInput = {
    where?: RoadmapWhereInput
    data: XOR<RoadmapUpdateWithoutNodesInput, RoadmapUncheckedUpdateWithoutNodesInput>
  }

  export type RoadmapUpdateWithoutNodesInput = {
    id?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    creatorName?: NullableStringFieldUpdateOperationsInput | string | null
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    goal?: NullableStringFieldUpdateOperationsInput | string | null
    category?: NullableStringFieldUpdateOperationsInput | string | null
    difficulty?: NullableStringFieldUpdateOperationsInput | string | null
    estimatedWeeks?: NullableIntFieldUpdateOperationsInput | number | null
    tags?: NullableJsonNullValueInput | InputJsonValue
    cloneCount?: IntFieldUpdateOperationsInput | number
    viewCount?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    isPublished?: BoolFieldUpdateOperationsInput | boolean
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    share?: RoadmapShareUpdateOneWithoutRoadmapNestedInput
    collaborators?: RoadmapCollaboratorUpdateManyWithoutRoadmapNestedInput
    progress?: RoadmapProgressUpdateManyWithoutRoadmapNestedInput
  }

  export type RoadmapUncheckedUpdateWithoutNodesInput = {
    id?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    creatorName?: NullableStringFieldUpdateOperationsInput | string | null
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    goal?: NullableStringFieldUpdateOperationsInput | string | null
    category?: NullableStringFieldUpdateOperationsInput | string | null
    difficulty?: NullableStringFieldUpdateOperationsInput | string | null
    estimatedWeeks?: NullableIntFieldUpdateOperationsInput | number | null
    tags?: NullableJsonNullValueInput | InputJsonValue
    cloneCount?: IntFieldUpdateOperationsInput | number
    viewCount?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    isPublished?: BoolFieldUpdateOperationsInput | boolean
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    share?: RoadmapShareUncheckedUpdateOneWithoutRoadmapNestedInput
    collaborators?: RoadmapCollaboratorUncheckedUpdateManyWithoutRoadmapNestedInput
    progress?: RoadmapProgressUncheckedUpdateManyWithoutRoadmapNestedInput
  }

  export type RoadmapNodeUpsertWithoutChildrenInput = {
    update: XOR<RoadmapNodeUpdateWithoutChildrenInput, RoadmapNodeUncheckedUpdateWithoutChildrenInput>
    create: XOR<RoadmapNodeCreateWithoutChildrenInput, RoadmapNodeUncheckedCreateWithoutChildrenInput>
    where?: RoadmapNodeWhereInput
  }

  export type RoadmapNodeUpdateToOneWithWhereWithoutChildrenInput = {
    where?: RoadmapNodeWhereInput
    data: XOR<RoadmapNodeUpdateWithoutChildrenInput, RoadmapNodeUncheckedUpdateWithoutChildrenInput>
  }

  export type RoadmapNodeUpdateWithoutChildrenInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    type?: StringFieldUpdateOperationsInput | string
    position?: IntFieldUpdateOperationsInput | number
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    roadmap?: RoadmapUpdateOneRequiredWithoutNodesNestedInput
    parent?: RoadmapNodeUpdateOneWithoutChildrenNestedInput
    progress?: RoadmapProgressUpdateManyWithoutNodeNestedInput
  }

  export type RoadmapNodeUncheckedUpdateWithoutChildrenInput = {
    id?: StringFieldUpdateOperationsInput | string
    roadmapId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    type?: StringFieldUpdateOperationsInput | string
    position?: IntFieldUpdateOperationsInput | number
    metadata?: NullableJsonNullValueInput | InputJsonValue
    parentId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    progress?: RoadmapProgressUncheckedUpdateManyWithoutNodeNestedInput
  }

  export type RoadmapNodeUpsertWithWhereUniqueWithoutParentInput = {
    where: RoadmapNodeWhereUniqueInput
    update: XOR<RoadmapNodeUpdateWithoutParentInput, RoadmapNodeUncheckedUpdateWithoutParentInput>
    create: XOR<RoadmapNodeCreateWithoutParentInput, RoadmapNodeUncheckedCreateWithoutParentInput>
  }

  export type RoadmapNodeUpdateWithWhereUniqueWithoutParentInput = {
    where: RoadmapNodeWhereUniqueInput
    data: XOR<RoadmapNodeUpdateWithoutParentInput, RoadmapNodeUncheckedUpdateWithoutParentInput>
  }

  export type RoadmapNodeUpdateManyWithWhereWithoutParentInput = {
    where: RoadmapNodeScalarWhereInput
    data: XOR<RoadmapNodeUpdateManyMutationInput, RoadmapNodeUncheckedUpdateManyWithoutParentInput>
  }

  export type RoadmapProgressUpsertWithWhereUniqueWithoutNodeInput = {
    where: RoadmapProgressWhereUniqueInput
    update: XOR<RoadmapProgressUpdateWithoutNodeInput, RoadmapProgressUncheckedUpdateWithoutNodeInput>
    create: XOR<RoadmapProgressCreateWithoutNodeInput, RoadmapProgressUncheckedCreateWithoutNodeInput>
  }

  export type RoadmapProgressUpdateWithWhereUniqueWithoutNodeInput = {
    where: RoadmapProgressWhereUniqueInput
    data: XOR<RoadmapProgressUpdateWithoutNodeInput, RoadmapProgressUncheckedUpdateWithoutNodeInput>
  }

  export type RoadmapProgressUpdateManyWithWhereWithoutNodeInput = {
    where: RoadmapProgressScalarWhereInput
    data: XOR<RoadmapProgressUpdateManyMutationInput, RoadmapProgressUncheckedUpdateManyWithoutNodeInput>
  }

  export type RoadmapCreateWithoutCollaboratorsInput = {
    id?: string
    ownerId: string
    creatorName?: string | null
    title: string
    description?: string | null
    goal?: string | null
    category?: string | null
    difficulty?: string | null
    estimatedWeeks?: number | null
    tags?: NullableJsonNullValueInput | InputJsonValue
    cloneCount?: number
    viewCount?: number
    status?: string
    isPublished?: boolean
    publishedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    share?: RoadmapShareCreateNestedOneWithoutRoadmapInput
    nodes?: RoadmapNodeCreateNestedManyWithoutRoadmapInput
    progress?: RoadmapProgressCreateNestedManyWithoutRoadmapInput
  }

  export type RoadmapUncheckedCreateWithoutCollaboratorsInput = {
    id?: string
    ownerId: string
    creatorName?: string | null
    title: string
    description?: string | null
    goal?: string | null
    category?: string | null
    difficulty?: string | null
    estimatedWeeks?: number | null
    tags?: NullableJsonNullValueInput | InputJsonValue
    cloneCount?: number
    viewCount?: number
    status?: string
    isPublished?: boolean
    publishedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    share?: RoadmapShareUncheckedCreateNestedOneWithoutRoadmapInput
    nodes?: RoadmapNodeUncheckedCreateNestedManyWithoutRoadmapInput
    progress?: RoadmapProgressUncheckedCreateNestedManyWithoutRoadmapInput
  }

  export type RoadmapCreateOrConnectWithoutCollaboratorsInput = {
    where: RoadmapWhereUniqueInput
    create: XOR<RoadmapCreateWithoutCollaboratorsInput, RoadmapUncheckedCreateWithoutCollaboratorsInput>
  }

  export type RoadmapUpsertWithoutCollaboratorsInput = {
    update: XOR<RoadmapUpdateWithoutCollaboratorsInput, RoadmapUncheckedUpdateWithoutCollaboratorsInput>
    create: XOR<RoadmapCreateWithoutCollaboratorsInput, RoadmapUncheckedCreateWithoutCollaboratorsInput>
    where?: RoadmapWhereInput
  }

  export type RoadmapUpdateToOneWithWhereWithoutCollaboratorsInput = {
    where?: RoadmapWhereInput
    data: XOR<RoadmapUpdateWithoutCollaboratorsInput, RoadmapUncheckedUpdateWithoutCollaboratorsInput>
  }

  export type RoadmapUpdateWithoutCollaboratorsInput = {
    id?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    creatorName?: NullableStringFieldUpdateOperationsInput | string | null
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    goal?: NullableStringFieldUpdateOperationsInput | string | null
    category?: NullableStringFieldUpdateOperationsInput | string | null
    difficulty?: NullableStringFieldUpdateOperationsInput | string | null
    estimatedWeeks?: NullableIntFieldUpdateOperationsInput | number | null
    tags?: NullableJsonNullValueInput | InputJsonValue
    cloneCount?: IntFieldUpdateOperationsInput | number
    viewCount?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    isPublished?: BoolFieldUpdateOperationsInput | boolean
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    share?: RoadmapShareUpdateOneWithoutRoadmapNestedInput
    nodes?: RoadmapNodeUpdateManyWithoutRoadmapNestedInput
    progress?: RoadmapProgressUpdateManyWithoutRoadmapNestedInput
  }

  export type RoadmapUncheckedUpdateWithoutCollaboratorsInput = {
    id?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    creatorName?: NullableStringFieldUpdateOperationsInput | string | null
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    goal?: NullableStringFieldUpdateOperationsInput | string | null
    category?: NullableStringFieldUpdateOperationsInput | string | null
    difficulty?: NullableStringFieldUpdateOperationsInput | string | null
    estimatedWeeks?: NullableIntFieldUpdateOperationsInput | number | null
    tags?: NullableJsonNullValueInput | InputJsonValue
    cloneCount?: IntFieldUpdateOperationsInput | number
    viewCount?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    isPublished?: BoolFieldUpdateOperationsInput | boolean
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    share?: RoadmapShareUncheckedUpdateOneWithoutRoadmapNestedInput
    nodes?: RoadmapNodeUncheckedUpdateManyWithoutRoadmapNestedInput
    progress?: RoadmapProgressUncheckedUpdateManyWithoutRoadmapNestedInput
  }

  export type RoadmapCreateWithoutProgressInput = {
    id?: string
    ownerId: string
    creatorName?: string | null
    title: string
    description?: string | null
    goal?: string | null
    category?: string | null
    difficulty?: string | null
    estimatedWeeks?: number | null
    tags?: NullableJsonNullValueInput | InputJsonValue
    cloneCount?: number
    viewCount?: number
    status?: string
    isPublished?: boolean
    publishedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    share?: RoadmapShareCreateNestedOneWithoutRoadmapInput
    nodes?: RoadmapNodeCreateNestedManyWithoutRoadmapInput
    collaborators?: RoadmapCollaboratorCreateNestedManyWithoutRoadmapInput
  }

  export type RoadmapUncheckedCreateWithoutProgressInput = {
    id?: string
    ownerId: string
    creatorName?: string | null
    title: string
    description?: string | null
    goal?: string | null
    category?: string | null
    difficulty?: string | null
    estimatedWeeks?: number | null
    tags?: NullableJsonNullValueInput | InputJsonValue
    cloneCount?: number
    viewCount?: number
    status?: string
    isPublished?: boolean
    publishedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    share?: RoadmapShareUncheckedCreateNestedOneWithoutRoadmapInput
    nodes?: RoadmapNodeUncheckedCreateNestedManyWithoutRoadmapInput
    collaborators?: RoadmapCollaboratorUncheckedCreateNestedManyWithoutRoadmapInput
  }

  export type RoadmapCreateOrConnectWithoutProgressInput = {
    where: RoadmapWhereUniqueInput
    create: XOR<RoadmapCreateWithoutProgressInput, RoadmapUncheckedCreateWithoutProgressInput>
  }

  export type RoadmapNodeCreateWithoutProgressInput = {
    id?: string
    title: string
    description?: string | null
    type?: string
    position?: number
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    roadmap: RoadmapCreateNestedOneWithoutNodesInput
    parent?: RoadmapNodeCreateNestedOneWithoutChildrenInput
    children?: RoadmapNodeCreateNestedManyWithoutParentInput
  }

  export type RoadmapNodeUncheckedCreateWithoutProgressInput = {
    id?: string
    roadmapId: string
    title: string
    description?: string | null
    type?: string
    position?: number
    metadata?: NullableJsonNullValueInput | InputJsonValue
    parentId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    children?: RoadmapNodeUncheckedCreateNestedManyWithoutParentInput
  }

  export type RoadmapNodeCreateOrConnectWithoutProgressInput = {
    where: RoadmapNodeWhereUniqueInput
    create: XOR<RoadmapNodeCreateWithoutProgressInput, RoadmapNodeUncheckedCreateWithoutProgressInput>
  }

  export type RoadmapUpsertWithoutProgressInput = {
    update: XOR<RoadmapUpdateWithoutProgressInput, RoadmapUncheckedUpdateWithoutProgressInput>
    create: XOR<RoadmapCreateWithoutProgressInput, RoadmapUncheckedCreateWithoutProgressInput>
    where?: RoadmapWhereInput
  }

  export type RoadmapUpdateToOneWithWhereWithoutProgressInput = {
    where?: RoadmapWhereInput
    data: XOR<RoadmapUpdateWithoutProgressInput, RoadmapUncheckedUpdateWithoutProgressInput>
  }

  export type RoadmapUpdateWithoutProgressInput = {
    id?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    creatorName?: NullableStringFieldUpdateOperationsInput | string | null
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    goal?: NullableStringFieldUpdateOperationsInput | string | null
    category?: NullableStringFieldUpdateOperationsInput | string | null
    difficulty?: NullableStringFieldUpdateOperationsInput | string | null
    estimatedWeeks?: NullableIntFieldUpdateOperationsInput | number | null
    tags?: NullableJsonNullValueInput | InputJsonValue
    cloneCount?: IntFieldUpdateOperationsInput | number
    viewCount?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    isPublished?: BoolFieldUpdateOperationsInput | boolean
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    share?: RoadmapShareUpdateOneWithoutRoadmapNestedInput
    nodes?: RoadmapNodeUpdateManyWithoutRoadmapNestedInput
    collaborators?: RoadmapCollaboratorUpdateManyWithoutRoadmapNestedInput
  }

  export type RoadmapUncheckedUpdateWithoutProgressInput = {
    id?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    creatorName?: NullableStringFieldUpdateOperationsInput | string | null
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    goal?: NullableStringFieldUpdateOperationsInput | string | null
    category?: NullableStringFieldUpdateOperationsInput | string | null
    difficulty?: NullableStringFieldUpdateOperationsInput | string | null
    estimatedWeeks?: NullableIntFieldUpdateOperationsInput | number | null
    tags?: NullableJsonNullValueInput | InputJsonValue
    cloneCount?: IntFieldUpdateOperationsInput | number
    viewCount?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    isPublished?: BoolFieldUpdateOperationsInput | boolean
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    share?: RoadmapShareUncheckedUpdateOneWithoutRoadmapNestedInput
    nodes?: RoadmapNodeUncheckedUpdateManyWithoutRoadmapNestedInput
    collaborators?: RoadmapCollaboratorUncheckedUpdateManyWithoutRoadmapNestedInput
  }

  export type RoadmapNodeUpsertWithoutProgressInput = {
    update: XOR<RoadmapNodeUpdateWithoutProgressInput, RoadmapNodeUncheckedUpdateWithoutProgressInput>
    create: XOR<RoadmapNodeCreateWithoutProgressInput, RoadmapNodeUncheckedCreateWithoutProgressInput>
    where?: RoadmapNodeWhereInput
  }

  export type RoadmapNodeUpdateToOneWithWhereWithoutProgressInput = {
    where?: RoadmapNodeWhereInput
    data: XOR<RoadmapNodeUpdateWithoutProgressInput, RoadmapNodeUncheckedUpdateWithoutProgressInput>
  }

  export type RoadmapNodeUpdateWithoutProgressInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    type?: StringFieldUpdateOperationsInput | string
    position?: IntFieldUpdateOperationsInput | number
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    roadmap?: RoadmapUpdateOneRequiredWithoutNodesNestedInput
    parent?: RoadmapNodeUpdateOneWithoutChildrenNestedInput
    children?: RoadmapNodeUpdateManyWithoutParentNestedInput
  }

  export type RoadmapNodeUncheckedUpdateWithoutProgressInput = {
    id?: StringFieldUpdateOperationsInput | string
    roadmapId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    type?: StringFieldUpdateOperationsInput | string
    position?: IntFieldUpdateOperationsInput | number
    metadata?: NullableJsonNullValueInput | InputJsonValue
    parentId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    children?: RoadmapNodeUncheckedUpdateManyWithoutParentNestedInput
  }

  export type RoadmapCreateWithoutShareInput = {
    id?: string
    ownerId: string
    creatorName?: string | null
    title: string
    description?: string | null
    goal?: string | null
    category?: string | null
    difficulty?: string | null
    estimatedWeeks?: number | null
    tags?: NullableJsonNullValueInput | InputJsonValue
    cloneCount?: number
    viewCount?: number
    status?: string
    isPublished?: boolean
    publishedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    nodes?: RoadmapNodeCreateNestedManyWithoutRoadmapInput
    collaborators?: RoadmapCollaboratorCreateNestedManyWithoutRoadmapInput
    progress?: RoadmapProgressCreateNestedManyWithoutRoadmapInput
  }

  export type RoadmapUncheckedCreateWithoutShareInput = {
    id?: string
    ownerId: string
    creatorName?: string | null
    title: string
    description?: string | null
    goal?: string | null
    category?: string | null
    difficulty?: string | null
    estimatedWeeks?: number | null
    tags?: NullableJsonNullValueInput | InputJsonValue
    cloneCount?: number
    viewCount?: number
    status?: string
    isPublished?: boolean
    publishedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    nodes?: RoadmapNodeUncheckedCreateNestedManyWithoutRoadmapInput
    collaborators?: RoadmapCollaboratorUncheckedCreateNestedManyWithoutRoadmapInput
    progress?: RoadmapProgressUncheckedCreateNestedManyWithoutRoadmapInput
  }

  export type RoadmapCreateOrConnectWithoutShareInput = {
    where: RoadmapWhereUniqueInput
    create: XOR<RoadmapCreateWithoutShareInput, RoadmapUncheckedCreateWithoutShareInput>
  }

  export type RoadmapUpsertWithoutShareInput = {
    update: XOR<RoadmapUpdateWithoutShareInput, RoadmapUncheckedUpdateWithoutShareInput>
    create: XOR<RoadmapCreateWithoutShareInput, RoadmapUncheckedCreateWithoutShareInput>
    where?: RoadmapWhereInput
  }

  export type RoadmapUpdateToOneWithWhereWithoutShareInput = {
    where?: RoadmapWhereInput
    data: XOR<RoadmapUpdateWithoutShareInput, RoadmapUncheckedUpdateWithoutShareInput>
  }

  export type RoadmapUpdateWithoutShareInput = {
    id?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    creatorName?: NullableStringFieldUpdateOperationsInput | string | null
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    goal?: NullableStringFieldUpdateOperationsInput | string | null
    category?: NullableStringFieldUpdateOperationsInput | string | null
    difficulty?: NullableStringFieldUpdateOperationsInput | string | null
    estimatedWeeks?: NullableIntFieldUpdateOperationsInput | number | null
    tags?: NullableJsonNullValueInput | InputJsonValue
    cloneCount?: IntFieldUpdateOperationsInput | number
    viewCount?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    isPublished?: BoolFieldUpdateOperationsInput | boolean
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    nodes?: RoadmapNodeUpdateManyWithoutRoadmapNestedInput
    collaborators?: RoadmapCollaboratorUpdateManyWithoutRoadmapNestedInput
    progress?: RoadmapProgressUpdateManyWithoutRoadmapNestedInput
  }

  export type RoadmapUncheckedUpdateWithoutShareInput = {
    id?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    creatorName?: NullableStringFieldUpdateOperationsInput | string | null
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    goal?: NullableStringFieldUpdateOperationsInput | string | null
    category?: NullableStringFieldUpdateOperationsInput | string | null
    difficulty?: NullableStringFieldUpdateOperationsInput | string | null
    estimatedWeeks?: NullableIntFieldUpdateOperationsInput | number | null
    tags?: NullableJsonNullValueInput | InputJsonValue
    cloneCount?: IntFieldUpdateOperationsInput | number
    viewCount?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    isPublished?: BoolFieldUpdateOperationsInput | boolean
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    nodes?: RoadmapNodeUncheckedUpdateManyWithoutRoadmapNestedInput
    collaborators?: RoadmapCollaboratorUncheckedUpdateManyWithoutRoadmapNestedInput
    progress?: RoadmapProgressUncheckedUpdateManyWithoutRoadmapNestedInput
  }

  export type RoadmapNodeCreateManyRoadmapInput = {
    id?: string
    title: string
    description?: string | null
    type?: string
    position?: number
    metadata?: NullableJsonNullValueInput | InputJsonValue
    parentId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RoadmapCollaboratorCreateManyRoadmapInput = {
    id?: string
    userId?: string | null
    email: string
    role?: string
    status?: string
    invitedAt?: Date | string
    joinedAt?: Date | string | null
  }

  export type RoadmapProgressCreateManyRoadmapInput = {
    id?: string
    nodeId: string
    userId: string
    status?: string
    percent?: number
    notes?: string | null
    completedAt?: Date | string | null
    updatedAt?: Date | string
    createdAt?: Date | string
  }

  export type RoadmapNodeUpdateWithoutRoadmapInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    type?: StringFieldUpdateOperationsInput | string
    position?: IntFieldUpdateOperationsInput | number
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    parent?: RoadmapNodeUpdateOneWithoutChildrenNestedInput
    children?: RoadmapNodeUpdateManyWithoutParentNestedInput
    progress?: RoadmapProgressUpdateManyWithoutNodeNestedInput
  }

  export type RoadmapNodeUncheckedUpdateWithoutRoadmapInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    type?: StringFieldUpdateOperationsInput | string
    position?: IntFieldUpdateOperationsInput | number
    metadata?: NullableJsonNullValueInput | InputJsonValue
    parentId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    children?: RoadmapNodeUncheckedUpdateManyWithoutParentNestedInput
    progress?: RoadmapProgressUncheckedUpdateManyWithoutNodeNestedInput
  }

  export type RoadmapNodeUncheckedUpdateManyWithoutRoadmapInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    type?: StringFieldUpdateOperationsInput | string
    position?: IntFieldUpdateOperationsInput | number
    metadata?: NullableJsonNullValueInput | InputJsonValue
    parentId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RoadmapCollaboratorUpdateWithoutRoadmapInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    invitedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    joinedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type RoadmapCollaboratorUncheckedUpdateWithoutRoadmapInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    invitedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    joinedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type RoadmapCollaboratorUncheckedUpdateManyWithoutRoadmapInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    invitedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    joinedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type RoadmapProgressUpdateWithoutRoadmapInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    percent?: IntFieldUpdateOperationsInput | number
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    node?: RoadmapNodeUpdateOneRequiredWithoutProgressNestedInput
  }

  export type RoadmapProgressUncheckedUpdateWithoutRoadmapInput = {
    id?: StringFieldUpdateOperationsInput | string
    nodeId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    percent?: IntFieldUpdateOperationsInput | number
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RoadmapProgressUncheckedUpdateManyWithoutRoadmapInput = {
    id?: StringFieldUpdateOperationsInput | string
    nodeId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    percent?: IntFieldUpdateOperationsInput | number
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RoadmapNodeCreateManyParentInput = {
    id?: string
    roadmapId: string
    title: string
    description?: string | null
    type?: string
    position?: number
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RoadmapProgressCreateManyNodeInput = {
    id?: string
    roadmapId: string
    userId: string
    status?: string
    percent?: number
    notes?: string | null
    completedAt?: Date | string | null
    updatedAt?: Date | string
    createdAt?: Date | string
  }

  export type RoadmapNodeUpdateWithoutParentInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    type?: StringFieldUpdateOperationsInput | string
    position?: IntFieldUpdateOperationsInput | number
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    roadmap?: RoadmapUpdateOneRequiredWithoutNodesNestedInput
    children?: RoadmapNodeUpdateManyWithoutParentNestedInput
    progress?: RoadmapProgressUpdateManyWithoutNodeNestedInput
  }

  export type RoadmapNodeUncheckedUpdateWithoutParentInput = {
    id?: StringFieldUpdateOperationsInput | string
    roadmapId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    type?: StringFieldUpdateOperationsInput | string
    position?: IntFieldUpdateOperationsInput | number
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    children?: RoadmapNodeUncheckedUpdateManyWithoutParentNestedInput
    progress?: RoadmapProgressUncheckedUpdateManyWithoutNodeNestedInput
  }

  export type RoadmapNodeUncheckedUpdateManyWithoutParentInput = {
    id?: StringFieldUpdateOperationsInput | string
    roadmapId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    type?: StringFieldUpdateOperationsInput | string
    position?: IntFieldUpdateOperationsInput | number
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RoadmapProgressUpdateWithoutNodeInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    percent?: IntFieldUpdateOperationsInput | number
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    roadmap?: RoadmapUpdateOneRequiredWithoutProgressNestedInput
  }

  export type RoadmapProgressUncheckedUpdateWithoutNodeInput = {
    id?: StringFieldUpdateOperationsInput | string
    roadmapId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    percent?: IntFieldUpdateOperationsInput | number
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RoadmapProgressUncheckedUpdateManyWithoutNodeInput = {
    id?: StringFieldUpdateOperationsInput | string
    roadmapId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    percent?: IntFieldUpdateOperationsInput | number
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
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