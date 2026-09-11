
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
 * Model CareerRoadmap
 * 
 */
export type CareerRoadmap = $Result.DefaultSelection<Prisma.$CareerRoadmapPayload>
/**
 * Model DiscussionPost
 * 
 */
export type DiscussionPost = $Result.DefaultSelection<Prisma.$DiscussionPostPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more CareerRoadmaps
 * const careerRoadmaps = await prisma.careerRoadmap.findMany()
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
   * // Fetch zero or more CareerRoadmaps
   * const careerRoadmaps = await prisma.careerRoadmap.findMany()
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
   * `prisma.careerRoadmap`: Exposes CRUD operations for the **CareerRoadmap** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more CareerRoadmaps
    * const careerRoadmaps = await prisma.careerRoadmap.findMany()
    * ```
    */
  get careerRoadmap(): Prisma.CareerRoadmapDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.discussionPost`: Exposes CRUD operations for the **DiscussionPost** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more DiscussionPosts
    * const discussionPosts = await prisma.discussionPost.findMany()
    * ```
    */
  get discussionPost(): Prisma.DiscussionPostDelegate<ExtArgs, ClientOptions>;
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
    CareerRoadmap: 'CareerRoadmap',
    DiscussionPost: 'DiscussionPost'
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
      modelProps: "careerRoadmap" | "discussionPost"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      CareerRoadmap: {
        payload: Prisma.$CareerRoadmapPayload<ExtArgs>
        fields: Prisma.CareerRoadmapFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CareerRoadmapFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CareerRoadmapPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CareerRoadmapFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CareerRoadmapPayload>
          }
          findFirst: {
            args: Prisma.CareerRoadmapFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CareerRoadmapPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CareerRoadmapFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CareerRoadmapPayload>
          }
          findMany: {
            args: Prisma.CareerRoadmapFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CareerRoadmapPayload>[]
          }
          create: {
            args: Prisma.CareerRoadmapCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CareerRoadmapPayload>
          }
          createMany: {
            args: Prisma.CareerRoadmapCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CareerRoadmapCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CareerRoadmapPayload>[]
          }
          delete: {
            args: Prisma.CareerRoadmapDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CareerRoadmapPayload>
          }
          update: {
            args: Prisma.CareerRoadmapUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CareerRoadmapPayload>
          }
          deleteMany: {
            args: Prisma.CareerRoadmapDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CareerRoadmapUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.CareerRoadmapUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CareerRoadmapPayload>[]
          }
          upsert: {
            args: Prisma.CareerRoadmapUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CareerRoadmapPayload>
          }
          aggregate: {
            args: Prisma.CareerRoadmapAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCareerRoadmap>
          }
          groupBy: {
            args: Prisma.CareerRoadmapGroupByArgs<ExtArgs>
            result: $Utils.Optional<CareerRoadmapGroupByOutputType>[]
          }
          count: {
            args: Prisma.CareerRoadmapCountArgs<ExtArgs>
            result: $Utils.Optional<CareerRoadmapCountAggregateOutputType> | number
          }
        }
      }
      DiscussionPost: {
        payload: Prisma.$DiscussionPostPayload<ExtArgs>
        fields: Prisma.DiscussionPostFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DiscussionPostFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DiscussionPostPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DiscussionPostFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DiscussionPostPayload>
          }
          findFirst: {
            args: Prisma.DiscussionPostFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DiscussionPostPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DiscussionPostFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DiscussionPostPayload>
          }
          findMany: {
            args: Prisma.DiscussionPostFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DiscussionPostPayload>[]
          }
          create: {
            args: Prisma.DiscussionPostCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DiscussionPostPayload>
          }
          createMany: {
            args: Prisma.DiscussionPostCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.DiscussionPostCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DiscussionPostPayload>[]
          }
          delete: {
            args: Prisma.DiscussionPostDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DiscussionPostPayload>
          }
          update: {
            args: Prisma.DiscussionPostUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DiscussionPostPayload>
          }
          deleteMany: {
            args: Prisma.DiscussionPostDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DiscussionPostUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.DiscussionPostUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DiscussionPostPayload>[]
          }
          upsert: {
            args: Prisma.DiscussionPostUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DiscussionPostPayload>
          }
          aggregate: {
            args: Prisma.DiscussionPostAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDiscussionPost>
          }
          groupBy: {
            args: Prisma.DiscussionPostGroupByArgs<ExtArgs>
            result: $Utils.Optional<DiscussionPostGroupByOutputType>[]
          }
          count: {
            args: Prisma.DiscussionPostCountArgs<ExtArgs>
            result: $Utils.Optional<DiscussionPostCountAggregateOutputType> | number
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
    careerRoadmap?: CareerRoadmapOmit
    discussionPost?: DiscussionPostOmit
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
   * Model CareerRoadmap
   */

  export type AggregateCareerRoadmap = {
    _count: CareerRoadmapCountAggregateOutputType | null
    _avg: CareerRoadmapAvgAggregateOutputType | null
    _sum: CareerRoadmapSumAggregateOutputType | null
    _min: CareerRoadmapMinAggregateOutputType | null
    _max: CareerRoadmapMaxAggregateOutputType | null
  }

  export type CareerRoadmapAvgAggregateOutputType = {
    overallReadiness: number | null
  }

  export type CareerRoadmapSumAggregateOutputType = {
    overallReadiness: number | null
  }

  export type CareerRoadmapMinAggregateOutputType = {
    id: string | null
    userId: string | null
    rolePath: string | null
    targetCompanyTier: string | null
    overallReadiness: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CareerRoadmapMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    rolePath: string | null
    targetCompanyTier: string | null
    overallReadiness: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CareerRoadmapCountAggregateOutputType = {
    id: number
    userId: number
    rolePath: number
    targetCompanyTier: number
    overallReadiness: number
    nodesData: number
    customTechStack: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type CareerRoadmapAvgAggregateInputType = {
    overallReadiness?: true
  }

  export type CareerRoadmapSumAggregateInputType = {
    overallReadiness?: true
  }

  export type CareerRoadmapMinAggregateInputType = {
    id?: true
    userId?: true
    rolePath?: true
    targetCompanyTier?: true
    overallReadiness?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CareerRoadmapMaxAggregateInputType = {
    id?: true
    userId?: true
    rolePath?: true
    targetCompanyTier?: true
    overallReadiness?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CareerRoadmapCountAggregateInputType = {
    id?: true
    userId?: true
    rolePath?: true
    targetCompanyTier?: true
    overallReadiness?: true
    nodesData?: true
    customTechStack?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type CareerRoadmapAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CareerRoadmap to aggregate.
     */
    where?: CareerRoadmapWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CareerRoadmaps to fetch.
     */
    orderBy?: CareerRoadmapOrderByWithRelationInput | CareerRoadmapOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CareerRoadmapWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CareerRoadmaps from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CareerRoadmaps.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned CareerRoadmaps
    **/
    _count?: true | CareerRoadmapCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CareerRoadmapAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CareerRoadmapSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CareerRoadmapMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CareerRoadmapMaxAggregateInputType
  }

  export type GetCareerRoadmapAggregateType<T extends CareerRoadmapAggregateArgs> = {
        [P in keyof T & keyof AggregateCareerRoadmap]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCareerRoadmap[P]>
      : GetScalarType<T[P], AggregateCareerRoadmap[P]>
  }




  export type CareerRoadmapGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CareerRoadmapWhereInput
    orderBy?: CareerRoadmapOrderByWithAggregationInput | CareerRoadmapOrderByWithAggregationInput[]
    by: CareerRoadmapScalarFieldEnum[] | CareerRoadmapScalarFieldEnum
    having?: CareerRoadmapScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CareerRoadmapCountAggregateInputType | true
    _avg?: CareerRoadmapAvgAggregateInputType
    _sum?: CareerRoadmapSumAggregateInputType
    _min?: CareerRoadmapMinAggregateInputType
    _max?: CareerRoadmapMaxAggregateInputType
  }

  export type CareerRoadmapGroupByOutputType = {
    id: string
    userId: string
    rolePath: string
    targetCompanyTier: string
    overallReadiness: number
    nodesData: JsonValue
    customTechStack: JsonValue | null
    createdAt: Date
    updatedAt: Date
    _count: CareerRoadmapCountAggregateOutputType | null
    _avg: CareerRoadmapAvgAggregateOutputType | null
    _sum: CareerRoadmapSumAggregateOutputType | null
    _min: CareerRoadmapMinAggregateOutputType | null
    _max: CareerRoadmapMaxAggregateOutputType | null
  }

  type GetCareerRoadmapGroupByPayload<T extends CareerRoadmapGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CareerRoadmapGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CareerRoadmapGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CareerRoadmapGroupByOutputType[P]>
            : GetScalarType<T[P], CareerRoadmapGroupByOutputType[P]>
        }
      >
    >


  export type CareerRoadmapSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    rolePath?: boolean
    targetCompanyTier?: boolean
    overallReadiness?: boolean
    nodesData?: boolean
    customTechStack?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["careerRoadmap"]>

  export type CareerRoadmapSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    rolePath?: boolean
    targetCompanyTier?: boolean
    overallReadiness?: boolean
    nodesData?: boolean
    customTechStack?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["careerRoadmap"]>

  export type CareerRoadmapSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    rolePath?: boolean
    targetCompanyTier?: boolean
    overallReadiness?: boolean
    nodesData?: boolean
    customTechStack?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["careerRoadmap"]>

  export type CareerRoadmapSelectScalar = {
    id?: boolean
    userId?: boolean
    rolePath?: boolean
    targetCompanyTier?: boolean
    overallReadiness?: boolean
    nodesData?: boolean
    customTechStack?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type CareerRoadmapOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "rolePath" | "targetCompanyTier" | "overallReadiness" | "nodesData" | "customTechStack" | "createdAt" | "updatedAt", ExtArgs["result"]["careerRoadmap"]>

  export type $CareerRoadmapPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "CareerRoadmap"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      rolePath: string
      targetCompanyTier: string
      overallReadiness: number
      nodesData: Prisma.JsonValue
      customTechStack: Prisma.JsonValue | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["careerRoadmap"]>
    composites: {}
  }

  type CareerRoadmapGetPayload<S extends boolean | null | undefined | CareerRoadmapDefaultArgs> = $Result.GetResult<Prisma.$CareerRoadmapPayload, S>

  type CareerRoadmapCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CareerRoadmapFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CareerRoadmapCountAggregateInputType | true
    }

  export interface CareerRoadmapDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['CareerRoadmap'], meta: { name: 'CareerRoadmap' } }
    /**
     * Find zero or one CareerRoadmap that matches the filter.
     * @param {CareerRoadmapFindUniqueArgs} args - Arguments to find a CareerRoadmap
     * @example
     * // Get one CareerRoadmap
     * const careerRoadmap = await prisma.careerRoadmap.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CareerRoadmapFindUniqueArgs>(args: SelectSubset<T, CareerRoadmapFindUniqueArgs<ExtArgs>>): Prisma__CareerRoadmapClient<$Result.GetResult<Prisma.$CareerRoadmapPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one CareerRoadmap that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CareerRoadmapFindUniqueOrThrowArgs} args - Arguments to find a CareerRoadmap
     * @example
     * // Get one CareerRoadmap
     * const careerRoadmap = await prisma.careerRoadmap.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CareerRoadmapFindUniqueOrThrowArgs>(args: SelectSubset<T, CareerRoadmapFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CareerRoadmapClient<$Result.GetResult<Prisma.$CareerRoadmapPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CareerRoadmap that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CareerRoadmapFindFirstArgs} args - Arguments to find a CareerRoadmap
     * @example
     * // Get one CareerRoadmap
     * const careerRoadmap = await prisma.careerRoadmap.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CareerRoadmapFindFirstArgs>(args?: SelectSubset<T, CareerRoadmapFindFirstArgs<ExtArgs>>): Prisma__CareerRoadmapClient<$Result.GetResult<Prisma.$CareerRoadmapPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CareerRoadmap that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CareerRoadmapFindFirstOrThrowArgs} args - Arguments to find a CareerRoadmap
     * @example
     * // Get one CareerRoadmap
     * const careerRoadmap = await prisma.careerRoadmap.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CareerRoadmapFindFirstOrThrowArgs>(args?: SelectSubset<T, CareerRoadmapFindFirstOrThrowArgs<ExtArgs>>): Prisma__CareerRoadmapClient<$Result.GetResult<Prisma.$CareerRoadmapPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more CareerRoadmaps that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CareerRoadmapFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all CareerRoadmaps
     * const careerRoadmaps = await prisma.careerRoadmap.findMany()
     * 
     * // Get first 10 CareerRoadmaps
     * const careerRoadmaps = await prisma.careerRoadmap.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const careerRoadmapWithIdOnly = await prisma.careerRoadmap.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CareerRoadmapFindManyArgs>(args?: SelectSubset<T, CareerRoadmapFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CareerRoadmapPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a CareerRoadmap.
     * @param {CareerRoadmapCreateArgs} args - Arguments to create a CareerRoadmap.
     * @example
     * // Create one CareerRoadmap
     * const CareerRoadmap = await prisma.careerRoadmap.create({
     *   data: {
     *     // ... data to create a CareerRoadmap
     *   }
     * })
     * 
     */
    create<T extends CareerRoadmapCreateArgs>(args: SelectSubset<T, CareerRoadmapCreateArgs<ExtArgs>>): Prisma__CareerRoadmapClient<$Result.GetResult<Prisma.$CareerRoadmapPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many CareerRoadmaps.
     * @param {CareerRoadmapCreateManyArgs} args - Arguments to create many CareerRoadmaps.
     * @example
     * // Create many CareerRoadmaps
     * const careerRoadmap = await prisma.careerRoadmap.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CareerRoadmapCreateManyArgs>(args?: SelectSubset<T, CareerRoadmapCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many CareerRoadmaps and returns the data saved in the database.
     * @param {CareerRoadmapCreateManyAndReturnArgs} args - Arguments to create many CareerRoadmaps.
     * @example
     * // Create many CareerRoadmaps
     * const careerRoadmap = await prisma.careerRoadmap.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many CareerRoadmaps and only return the `id`
     * const careerRoadmapWithIdOnly = await prisma.careerRoadmap.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CareerRoadmapCreateManyAndReturnArgs>(args?: SelectSubset<T, CareerRoadmapCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CareerRoadmapPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a CareerRoadmap.
     * @param {CareerRoadmapDeleteArgs} args - Arguments to delete one CareerRoadmap.
     * @example
     * // Delete one CareerRoadmap
     * const CareerRoadmap = await prisma.careerRoadmap.delete({
     *   where: {
     *     // ... filter to delete one CareerRoadmap
     *   }
     * })
     * 
     */
    delete<T extends CareerRoadmapDeleteArgs>(args: SelectSubset<T, CareerRoadmapDeleteArgs<ExtArgs>>): Prisma__CareerRoadmapClient<$Result.GetResult<Prisma.$CareerRoadmapPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one CareerRoadmap.
     * @param {CareerRoadmapUpdateArgs} args - Arguments to update one CareerRoadmap.
     * @example
     * // Update one CareerRoadmap
     * const careerRoadmap = await prisma.careerRoadmap.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CareerRoadmapUpdateArgs>(args: SelectSubset<T, CareerRoadmapUpdateArgs<ExtArgs>>): Prisma__CareerRoadmapClient<$Result.GetResult<Prisma.$CareerRoadmapPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more CareerRoadmaps.
     * @param {CareerRoadmapDeleteManyArgs} args - Arguments to filter CareerRoadmaps to delete.
     * @example
     * // Delete a few CareerRoadmaps
     * const { count } = await prisma.careerRoadmap.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CareerRoadmapDeleteManyArgs>(args?: SelectSubset<T, CareerRoadmapDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CareerRoadmaps.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CareerRoadmapUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many CareerRoadmaps
     * const careerRoadmap = await prisma.careerRoadmap.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CareerRoadmapUpdateManyArgs>(args: SelectSubset<T, CareerRoadmapUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CareerRoadmaps and returns the data updated in the database.
     * @param {CareerRoadmapUpdateManyAndReturnArgs} args - Arguments to update many CareerRoadmaps.
     * @example
     * // Update many CareerRoadmaps
     * const careerRoadmap = await prisma.careerRoadmap.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more CareerRoadmaps and only return the `id`
     * const careerRoadmapWithIdOnly = await prisma.careerRoadmap.updateManyAndReturn({
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
    updateManyAndReturn<T extends CareerRoadmapUpdateManyAndReturnArgs>(args: SelectSubset<T, CareerRoadmapUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CareerRoadmapPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one CareerRoadmap.
     * @param {CareerRoadmapUpsertArgs} args - Arguments to update or create a CareerRoadmap.
     * @example
     * // Update or create a CareerRoadmap
     * const careerRoadmap = await prisma.careerRoadmap.upsert({
     *   create: {
     *     // ... data to create a CareerRoadmap
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the CareerRoadmap we want to update
     *   }
     * })
     */
    upsert<T extends CareerRoadmapUpsertArgs>(args: SelectSubset<T, CareerRoadmapUpsertArgs<ExtArgs>>): Prisma__CareerRoadmapClient<$Result.GetResult<Prisma.$CareerRoadmapPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of CareerRoadmaps.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CareerRoadmapCountArgs} args - Arguments to filter CareerRoadmaps to count.
     * @example
     * // Count the number of CareerRoadmaps
     * const count = await prisma.careerRoadmap.count({
     *   where: {
     *     // ... the filter for the CareerRoadmaps we want to count
     *   }
     * })
    **/
    count<T extends CareerRoadmapCountArgs>(
      args?: Subset<T, CareerRoadmapCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CareerRoadmapCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a CareerRoadmap.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CareerRoadmapAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends CareerRoadmapAggregateArgs>(args: Subset<T, CareerRoadmapAggregateArgs>): Prisma.PrismaPromise<GetCareerRoadmapAggregateType<T>>

    /**
     * Group by CareerRoadmap.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CareerRoadmapGroupByArgs} args - Group by arguments.
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
      T extends CareerRoadmapGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CareerRoadmapGroupByArgs['orderBy'] }
        : { orderBy?: CareerRoadmapGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, CareerRoadmapGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCareerRoadmapGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the CareerRoadmap model
   */
  readonly fields: CareerRoadmapFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for CareerRoadmap.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CareerRoadmapClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
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
   * Fields of the CareerRoadmap model
   */
  interface CareerRoadmapFieldRefs {
    readonly id: FieldRef<"CareerRoadmap", 'String'>
    readonly userId: FieldRef<"CareerRoadmap", 'String'>
    readonly rolePath: FieldRef<"CareerRoadmap", 'String'>
    readonly targetCompanyTier: FieldRef<"CareerRoadmap", 'String'>
    readonly overallReadiness: FieldRef<"CareerRoadmap", 'Int'>
    readonly nodesData: FieldRef<"CareerRoadmap", 'Json'>
    readonly customTechStack: FieldRef<"CareerRoadmap", 'Json'>
    readonly createdAt: FieldRef<"CareerRoadmap", 'DateTime'>
    readonly updatedAt: FieldRef<"CareerRoadmap", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * CareerRoadmap findUnique
   */
  export type CareerRoadmapFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CareerRoadmap
     */
    select?: CareerRoadmapSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CareerRoadmap
     */
    omit?: CareerRoadmapOmit<ExtArgs> | null
    /**
     * Filter, which CareerRoadmap to fetch.
     */
    where: CareerRoadmapWhereUniqueInput
  }

  /**
   * CareerRoadmap findUniqueOrThrow
   */
  export type CareerRoadmapFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CareerRoadmap
     */
    select?: CareerRoadmapSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CareerRoadmap
     */
    omit?: CareerRoadmapOmit<ExtArgs> | null
    /**
     * Filter, which CareerRoadmap to fetch.
     */
    where: CareerRoadmapWhereUniqueInput
  }

  /**
   * CareerRoadmap findFirst
   */
  export type CareerRoadmapFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CareerRoadmap
     */
    select?: CareerRoadmapSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CareerRoadmap
     */
    omit?: CareerRoadmapOmit<ExtArgs> | null
    /**
     * Filter, which CareerRoadmap to fetch.
     */
    where?: CareerRoadmapWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CareerRoadmaps to fetch.
     */
    orderBy?: CareerRoadmapOrderByWithRelationInput | CareerRoadmapOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CareerRoadmaps.
     */
    cursor?: CareerRoadmapWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CareerRoadmaps from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CareerRoadmaps.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CareerRoadmaps.
     */
    distinct?: CareerRoadmapScalarFieldEnum | CareerRoadmapScalarFieldEnum[]
  }

  /**
   * CareerRoadmap findFirstOrThrow
   */
  export type CareerRoadmapFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CareerRoadmap
     */
    select?: CareerRoadmapSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CareerRoadmap
     */
    omit?: CareerRoadmapOmit<ExtArgs> | null
    /**
     * Filter, which CareerRoadmap to fetch.
     */
    where?: CareerRoadmapWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CareerRoadmaps to fetch.
     */
    orderBy?: CareerRoadmapOrderByWithRelationInput | CareerRoadmapOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CareerRoadmaps.
     */
    cursor?: CareerRoadmapWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CareerRoadmaps from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CareerRoadmaps.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CareerRoadmaps.
     */
    distinct?: CareerRoadmapScalarFieldEnum | CareerRoadmapScalarFieldEnum[]
  }

  /**
   * CareerRoadmap findMany
   */
  export type CareerRoadmapFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CareerRoadmap
     */
    select?: CareerRoadmapSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CareerRoadmap
     */
    omit?: CareerRoadmapOmit<ExtArgs> | null
    /**
     * Filter, which CareerRoadmaps to fetch.
     */
    where?: CareerRoadmapWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CareerRoadmaps to fetch.
     */
    orderBy?: CareerRoadmapOrderByWithRelationInput | CareerRoadmapOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing CareerRoadmaps.
     */
    cursor?: CareerRoadmapWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CareerRoadmaps from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CareerRoadmaps.
     */
    skip?: number
    distinct?: CareerRoadmapScalarFieldEnum | CareerRoadmapScalarFieldEnum[]
  }

  /**
   * CareerRoadmap create
   */
  export type CareerRoadmapCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CareerRoadmap
     */
    select?: CareerRoadmapSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CareerRoadmap
     */
    omit?: CareerRoadmapOmit<ExtArgs> | null
    /**
     * The data needed to create a CareerRoadmap.
     */
    data: XOR<CareerRoadmapCreateInput, CareerRoadmapUncheckedCreateInput>
  }

  /**
   * CareerRoadmap createMany
   */
  export type CareerRoadmapCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many CareerRoadmaps.
     */
    data: CareerRoadmapCreateManyInput | CareerRoadmapCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * CareerRoadmap createManyAndReturn
   */
  export type CareerRoadmapCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CareerRoadmap
     */
    select?: CareerRoadmapSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CareerRoadmap
     */
    omit?: CareerRoadmapOmit<ExtArgs> | null
    /**
     * The data used to create many CareerRoadmaps.
     */
    data: CareerRoadmapCreateManyInput | CareerRoadmapCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * CareerRoadmap update
   */
  export type CareerRoadmapUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CareerRoadmap
     */
    select?: CareerRoadmapSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CareerRoadmap
     */
    omit?: CareerRoadmapOmit<ExtArgs> | null
    /**
     * The data needed to update a CareerRoadmap.
     */
    data: XOR<CareerRoadmapUpdateInput, CareerRoadmapUncheckedUpdateInput>
    /**
     * Choose, which CareerRoadmap to update.
     */
    where: CareerRoadmapWhereUniqueInput
  }

  /**
   * CareerRoadmap updateMany
   */
  export type CareerRoadmapUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update CareerRoadmaps.
     */
    data: XOR<CareerRoadmapUpdateManyMutationInput, CareerRoadmapUncheckedUpdateManyInput>
    /**
     * Filter which CareerRoadmaps to update
     */
    where?: CareerRoadmapWhereInput
    /**
     * Limit how many CareerRoadmaps to update.
     */
    limit?: number
  }

  /**
   * CareerRoadmap updateManyAndReturn
   */
  export type CareerRoadmapUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CareerRoadmap
     */
    select?: CareerRoadmapSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CareerRoadmap
     */
    omit?: CareerRoadmapOmit<ExtArgs> | null
    /**
     * The data used to update CareerRoadmaps.
     */
    data: XOR<CareerRoadmapUpdateManyMutationInput, CareerRoadmapUncheckedUpdateManyInput>
    /**
     * Filter which CareerRoadmaps to update
     */
    where?: CareerRoadmapWhereInput
    /**
     * Limit how many CareerRoadmaps to update.
     */
    limit?: number
  }

  /**
   * CareerRoadmap upsert
   */
  export type CareerRoadmapUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CareerRoadmap
     */
    select?: CareerRoadmapSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CareerRoadmap
     */
    omit?: CareerRoadmapOmit<ExtArgs> | null
    /**
     * The filter to search for the CareerRoadmap to update in case it exists.
     */
    where: CareerRoadmapWhereUniqueInput
    /**
     * In case the CareerRoadmap found by the `where` argument doesn't exist, create a new CareerRoadmap with this data.
     */
    create: XOR<CareerRoadmapCreateInput, CareerRoadmapUncheckedCreateInput>
    /**
     * In case the CareerRoadmap was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CareerRoadmapUpdateInput, CareerRoadmapUncheckedUpdateInput>
  }

  /**
   * CareerRoadmap delete
   */
  export type CareerRoadmapDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CareerRoadmap
     */
    select?: CareerRoadmapSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CareerRoadmap
     */
    omit?: CareerRoadmapOmit<ExtArgs> | null
    /**
     * Filter which CareerRoadmap to delete.
     */
    where: CareerRoadmapWhereUniqueInput
  }

  /**
   * CareerRoadmap deleteMany
   */
  export type CareerRoadmapDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CareerRoadmaps to delete
     */
    where?: CareerRoadmapWhereInput
    /**
     * Limit how many CareerRoadmaps to delete.
     */
    limit?: number
  }

  /**
   * CareerRoadmap without action
   */
  export type CareerRoadmapDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CareerRoadmap
     */
    select?: CareerRoadmapSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CareerRoadmap
     */
    omit?: CareerRoadmapOmit<ExtArgs> | null
  }


  /**
   * Model DiscussionPost
   */

  export type AggregateDiscussionPost = {
    _count: DiscussionPostCountAggregateOutputType | null
    _avg: DiscussionPostAvgAggregateOutputType | null
    _sum: DiscussionPostSumAggregateOutputType | null
    _min: DiscussionPostMinAggregateOutputType | null
    _max: DiscussionPostMaxAggregateOutputType | null
  }

  export type DiscussionPostAvgAggregateOutputType = {
    upvotes: number | null
  }

  export type DiscussionPostSumAggregateOutputType = {
    upvotes: number | null
  }

  export type DiscussionPostMinAggregateOutputType = {
    id: string | null
    userId: string | null
    userName: string | null
    roleCategory: string | null
    title: string | null
    content: string | null
    upvotes: number | null
    aiReply: string | null
    createdAt: Date | null
  }

  export type DiscussionPostMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    userName: string | null
    roleCategory: string | null
    title: string | null
    content: string | null
    upvotes: number | null
    aiReply: string | null
    createdAt: Date | null
  }

  export type DiscussionPostCountAggregateOutputType = {
    id: number
    userId: number
    userName: number
    roleCategory: number
    title: number
    content: number
    tags: number
    upvotes: number
    aiReply: number
    createdAt: number
    _all: number
  }


  export type DiscussionPostAvgAggregateInputType = {
    upvotes?: true
  }

  export type DiscussionPostSumAggregateInputType = {
    upvotes?: true
  }

  export type DiscussionPostMinAggregateInputType = {
    id?: true
    userId?: true
    userName?: true
    roleCategory?: true
    title?: true
    content?: true
    upvotes?: true
    aiReply?: true
    createdAt?: true
  }

  export type DiscussionPostMaxAggregateInputType = {
    id?: true
    userId?: true
    userName?: true
    roleCategory?: true
    title?: true
    content?: true
    upvotes?: true
    aiReply?: true
    createdAt?: true
  }

  export type DiscussionPostCountAggregateInputType = {
    id?: true
    userId?: true
    userName?: true
    roleCategory?: true
    title?: true
    content?: true
    tags?: true
    upvotes?: true
    aiReply?: true
    createdAt?: true
    _all?: true
  }

  export type DiscussionPostAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DiscussionPost to aggregate.
     */
    where?: DiscussionPostWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DiscussionPosts to fetch.
     */
    orderBy?: DiscussionPostOrderByWithRelationInput | DiscussionPostOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DiscussionPostWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DiscussionPosts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DiscussionPosts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned DiscussionPosts
    **/
    _count?: true | DiscussionPostCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: DiscussionPostAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: DiscussionPostSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DiscussionPostMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DiscussionPostMaxAggregateInputType
  }

  export type GetDiscussionPostAggregateType<T extends DiscussionPostAggregateArgs> = {
        [P in keyof T & keyof AggregateDiscussionPost]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDiscussionPost[P]>
      : GetScalarType<T[P], AggregateDiscussionPost[P]>
  }




  export type DiscussionPostGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DiscussionPostWhereInput
    orderBy?: DiscussionPostOrderByWithAggregationInput | DiscussionPostOrderByWithAggregationInput[]
    by: DiscussionPostScalarFieldEnum[] | DiscussionPostScalarFieldEnum
    having?: DiscussionPostScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DiscussionPostCountAggregateInputType | true
    _avg?: DiscussionPostAvgAggregateInputType
    _sum?: DiscussionPostSumAggregateInputType
    _min?: DiscussionPostMinAggregateInputType
    _max?: DiscussionPostMaxAggregateInputType
  }

  export type DiscussionPostGroupByOutputType = {
    id: string
    userId: string
    userName: string
    roleCategory: string
    title: string
    content: string
    tags: string[]
    upvotes: number
    aiReply: string | null
    createdAt: Date
    _count: DiscussionPostCountAggregateOutputType | null
    _avg: DiscussionPostAvgAggregateOutputType | null
    _sum: DiscussionPostSumAggregateOutputType | null
    _min: DiscussionPostMinAggregateOutputType | null
    _max: DiscussionPostMaxAggregateOutputType | null
  }

  type GetDiscussionPostGroupByPayload<T extends DiscussionPostGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DiscussionPostGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DiscussionPostGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DiscussionPostGroupByOutputType[P]>
            : GetScalarType<T[P], DiscussionPostGroupByOutputType[P]>
        }
      >
    >


  export type DiscussionPostSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    userName?: boolean
    roleCategory?: boolean
    title?: boolean
    content?: boolean
    tags?: boolean
    upvotes?: boolean
    aiReply?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["discussionPost"]>

  export type DiscussionPostSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    userName?: boolean
    roleCategory?: boolean
    title?: boolean
    content?: boolean
    tags?: boolean
    upvotes?: boolean
    aiReply?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["discussionPost"]>

  export type DiscussionPostSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    userName?: boolean
    roleCategory?: boolean
    title?: boolean
    content?: boolean
    tags?: boolean
    upvotes?: boolean
    aiReply?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["discussionPost"]>

  export type DiscussionPostSelectScalar = {
    id?: boolean
    userId?: boolean
    userName?: boolean
    roleCategory?: boolean
    title?: boolean
    content?: boolean
    tags?: boolean
    upvotes?: boolean
    aiReply?: boolean
    createdAt?: boolean
  }

  export type DiscussionPostOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "userName" | "roleCategory" | "title" | "content" | "tags" | "upvotes" | "aiReply" | "createdAt", ExtArgs["result"]["discussionPost"]>

  export type $DiscussionPostPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "DiscussionPost"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      userName: string
      roleCategory: string
      title: string
      content: string
      tags: string[]
      upvotes: number
      aiReply: string | null
      createdAt: Date
    }, ExtArgs["result"]["discussionPost"]>
    composites: {}
  }

  type DiscussionPostGetPayload<S extends boolean | null | undefined | DiscussionPostDefaultArgs> = $Result.GetResult<Prisma.$DiscussionPostPayload, S>

  type DiscussionPostCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<DiscussionPostFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: DiscussionPostCountAggregateInputType | true
    }

  export interface DiscussionPostDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['DiscussionPost'], meta: { name: 'DiscussionPost' } }
    /**
     * Find zero or one DiscussionPost that matches the filter.
     * @param {DiscussionPostFindUniqueArgs} args - Arguments to find a DiscussionPost
     * @example
     * // Get one DiscussionPost
     * const discussionPost = await prisma.discussionPost.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DiscussionPostFindUniqueArgs>(args: SelectSubset<T, DiscussionPostFindUniqueArgs<ExtArgs>>): Prisma__DiscussionPostClient<$Result.GetResult<Prisma.$DiscussionPostPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one DiscussionPost that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {DiscussionPostFindUniqueOrThrowArgs} args - Arguments to find a DiscussionPost
     * @example
     * // Get one DiscussionPost
     * const discussionPost = await prisma.discussionPost.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DiscussionPostFindUniqueOrThrowArgs>(args: SelectSubset<T, DiscussionPostFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DiscussionPostClient<$Result.GetResult<Prisma.$DiscussionPostPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first DiscussionPost that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DiscussionPostFindFirstArgs} args - Arguments to find a DiscussionPost
     * @example
     * // Get one DiscussionPost
     * const discussionPost = await prisma.discussionPost.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DiscussionPostFindFirstArgs>(args?: SelectSubset<T, DiscussionPostFindFirstArgs<ExtArgs>>): Prisma__DiscussionPostClient<$Result.GetResult<Prisma.$DiscussionPostPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first DiscussionPost that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DiscussionPostFindFirstOrThrowArgs} args - Arguments to find a DiscussionPost
     * @example
     * // Get one DiscussionPost
     * const discussionPost = await prisma.discussionPost.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DiscussionPostFindFirstOrThrowArgs>(args?: SelectSubset<T, DiscussionPostFindFirstOrThrowArgs<ExtArgs>>): Prisma__DiscussionPostClient<$Result.GetResult<Prisma.$DiscussionPostPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more DiscussionPosts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DiscussionPostFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all DiscussionPosts
     * const discussionPosts = await prisma.discussionPost.findMany()
     * 
     * // Get first 10 DiscussionPosts
     * const discussionPosts = await prisma.discussionPost.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const discussionPostWithIdOnly = await prisma.discussionPost.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends DiscussionPostFindManyArgs>(args?: SelectSubset<T, DiscussionPostFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DiscussionPostPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a DiscussionPost.
     * @param {DiscussionPostCreateArgs} args - Arguments to create a DiscussionPost.
     * @example
     * // Create one DiscussionPost
     * const DiscussionPost = await prisma.discussionPost.create({
     *   data: {
     *     // ... data to create a DiscussionPost
     *   }
     * })
     * 
     */
    create<T extends DiscussionPostCreateArgs>(args: SelectSubset<T, DiscussionPostCreateArgs<ExtArgs>>): Prisma__DiscussionPostClient<$Result.GetResult<Prisma.$DiscussionPostPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many DiscussionPosts.
     * @param {DiscussionPostCreateManyArgs} args - Arguments to create many DiscussionPosts.
     * @example
     * // Create many DiscussionPosts
     * const discussionPost = await prisma.discussionPost.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DiscussionPostCreateManyArgs>(args?: SelectSubset<T, DiscussionPostCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many DiscussionPosts and returns the data saved in the database.
     * @param {DiscussionPostCreateManyAndReturnArgs} args - Arguments to create many DiscussionPosts.
     * @example
     * // Create many DiscussionPosts
     * const discussionPost = await prisma.discussionPost.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many DiscussionPosts and only return the `id`
     * const discussionPostWithIdOnly = await prisma.discussionPost.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends DiscussionPostCreateManyAndReturnArgs>(args?: SelectSubset<T, DiscussionPostCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DiscussionPostPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a DiscussionPost.
     * @param {DiscussionPostDeleteArgs} args - Arguments to delete one DiscussionPost.
     * @example
     * // Delete one DiscussionPost
     * const DiscussionPost = await prisma.discussionPost.delete({
     *   where: {
     *     // ... filter to delete one DiscussionPost
     *   }
     * })
     * 
     */
    delete<T extends DiscussionPostDeleteArgs>(args: SelectSubset<T, DiscussionPostDeleteArgs<ExtArgs>>): Prisma__DiscussionPostClient<$Result.GetResult<Prisma.$DiscussionPostPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one DiscussionPost.
     * @param {DiscussionPostUpdateArgs} args - Arguments to update one DiscussionPost.
     * @example
     * // Update one DiscussionPost
     * const discussionPost = await prisma.discussionPost.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DiscussionPostUpdateArgs>(args: SelectSubset<T, DiscussionPostUpdateArgs<ExtArgs>>): Prisma__DiscussionPostClient<$Result.GetResult<Prisma.$DiscussionPostPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more DiscussionPosts.
     * @param {DiscussionPostDeleteManyArgs} args - Arguments to filter DiscussionPosts to delete.
     * @example
     * // Delete a few DiscussionPosts
     * const { count } = await prisma.discussionPost.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DiscussionPostDeleteManyArgs>(args?: SelectSubset<T, DiscussionPostDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more DiscussionPosts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DiscussionPostUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many DiscussionPosts
     * const discussionPost = await prisma.discussionPost.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DiscussionPostUpdateManyArgs>(args: SelectSubset<T, DiscussionPostUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more DiscussionPosts and returns the data updated in the database.
     * @param {DiscussionPostUpdateManyAndReturnArgs} args - Arguments to update many DiscussionPosts.
     * @example
     * // Update many DiscussionPosts
     * const discussionPost = await prisma.discussionPost.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more DiscussionPosts and only return the `id`
     * const discussionPostWithIdOnly = await prisma.discussionPost.updateManyAndReturn({
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
    updateManyAndReturn<T extends DiscussionPostUpdateManyAndReturnArgs>(args: SelectSubset<T, DiscussionPostUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DiscussionPostPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one DiscussionPost.
     * @param {DiscussionPostUpsertArgs} args - Arguments to update or create a DiscussionPost.
     * @example
     * // Update or create a DiscussionPost
     * const discussionPost = await prisma.discussionPost.upsert({
     *   create: {
     *     // ... data to create a DiscussionPost
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the DiscussionPost we want to update
     *   }
     * })
     */
    upsert<T extends DiscussionPostUpsertArgs>(args: SelectSubset<T, DiscussionPostUpsertArgs<ExtArgs>>): Prisma__DiscussionPostClient<$Result.GetResult<Prisma.$DiscussionPostPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of DiscussionPosts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DiscussionPostCountArgs} args - Arguments to filter DiscussionPosts to count.
     * @example
     * // Count the number of DiscussionPosts
     * const count = await prisma.discussionPost.count({
     *   where: {
     *     // ... the filter for the DiscussionPosts we want to count
     *   }
     * })
    **/
    count<T extends DiscussionPostCountArgs>(
      args?: Subset<T, DiscussionPostCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DiscussionPostCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a DiscussionPost.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DiscussionPostAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends DiscussionPostAggregateArgs>(args: Subset<T, DiscussionPostAggregateArgs>): Prisma.PrismaPromise<GetDiscussionPostAggregateType<T>>

    /**
     * Group by DiscussionPost.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DiscussionPostGroupByArgs} args - Group by arguments.
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
      T extends DiscussionPostGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DiscussionPostGroupByArgs['orderBy'] }
        : { orderBy?: DiscussionPostGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, DiscussionPostGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDiscussionPostGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the DiscussionPost model
   */
  readonly fields: DiscussionPostFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for DiscussionPost.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DiscussionPostClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
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
   * Fields of the DiscussionPost model
   */
  interface DiscussionPostFieldRefs {
    readonly id: FieldRef<"DiscussionPost", 'String'>
    readonly userId: FieldRef<"DiscussionPost", 'String'>
    readonly userName: FieldRef<"DiscussionPost", 'String'>
    readonly roleCategory: FieldRef<"DiscussionPost", 'String'>
    readonly title: FieldRef<"DiscussionPost", 'String'>
    readonly content: FieldRef<"DiscussionPost", 'String'>
    readonly tags: FieldRef<"DiscussionPost", 'String[]'>
    readonly upvotes: FieldRef<"DiscussionPost", 'Int'>
    readonly aiReply: FieldRef<"DiscussionPost", 'String'>
    readonly createdAt: FieldRef<"DiscussionPost", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * DiscussionPost findUnique
   */
  export type DiscussionPostFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DiscussionPost
     */
    select?: DiscussionPostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DiscussionPost
     */
    omit?: DiscussionPostOmit<ExtArgs> | null
    /**
     * Filter, which DiscussionPost to fetch.
     */
    where: DiscussionPostWhereUniqueInput
  }

  /**
   * DiscussionPost findUniqueOrThrow
   */
  export type DiscussionPostFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DiscussionPost
     */
    select?: DiscussionPostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DiscussionPost
     */
    omit?: DiscussionPostOmit<ExtArgs> | null
    /**
     * Filter, which DiscussionPost to fetch.
     */
    where: DiscussionPostWhereUniqueInput
  }

  /**
   * DiscussionPost findFirst
   */
  export type DiscussionPostFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DiscussionPost
     */
    select?: DiscussionPostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DiscussionPost
     */
    omit?: DiscussionPostOmit<ExtArgs> | null
    /**
     * Filter, which DiscussionPost to fetch.
     */
    where?: DiscussionPostWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DiscussionPosts to fetch.
     */
    orderBy?: DiscussionPostOrderByWithRelationInput | DiscussionPostOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DiscussionPosts.
     */
    cursor?: DiscussionPostWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DiscussionPosts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DiscussionPosts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DiscussionPosts.
     */
    distinct?: DiscussionPostScalarFieldEnum | DiscussionPostScalarFieldEnum[]
  }

  /**
   * DiscussionPost findFirstOrThrow
   */
  export type DiscussionPostFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DiscussionPost
     */
    select?: DiscussionPostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DiscussionPost
     */
    omit?: DiscussionPostOmit<ExtArgs> | null
    /**
     * Filter, which DiscussionPost to fetch.
     */
    where?: DiscussionPostWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DiscussionPosts to fetch.
     */
    orderBy?: DiscussionPostOrderByWithRelationInput | DiscussionPostOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DiscussionPosts.
     */
    cursor?: DiscussionPostWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DiscussionPosts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DiscussionPosts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DiscussionPosts.
     */
    distinct?: DiscussionPostScalarFieldEnum | DiscussionPostScalarFieldEnum[]
  }

  /**
   * DiscussionPost findMany
   */
  export type DiscussionPostFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DiscussionPost
     */
    select?: DiscussionPostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DiscussionPost
     */
    omit?: DiscussionPostOmit<ExtArgs> | null
    /**
     * Filter, which DiscussionPosts to fetch.
     */
    where?: DiscussionPostWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DiscussionPosts to fetch.
     */
    orderBy?: DiscussionPostOrderByWithRelationInput | DiscussionPostOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing DiscussionPosts.
     */
    cursor?: DiscussionPostWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DiscussionPosts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DiscussionPosts.
     */
    skip?: number
    distinct?: DiscussionPostScalarFieldEnum | DiscussionPostScalarFieldEnum[]
  }

  /**
   * DiscussionPost create
   */
  export type DiscussionPostCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DiscussionPost
     */
    select?: DiscussionPostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DiscussionPost
     */
    omit?: DiscussionPostOmit<ExtArgs> | null
    /**
     * The data needed to create a DiscussionPost.
     */
    data: XOR<DiscussionPostCreateInput, DiscussionPostUncheckedCreateInput>
  }

  /**
   * DiscussionPost createMany
   */
  export type DiscussionPostCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many DiscussionPosts.
     */
    data: DiscussionPostCreateManyInput | DiscussionPostCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * DiscussionPost createManyAndReturn
   */
  export type DiscussionPostCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DiscussionPost
     */
    select?: DiscussionPostSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the DiscussionPost
     */
    omit?: DiscussionPostOmit<ExtArgs> | null
    /**
     * The data used to create many DiscussionPosts.
     */
    data: DiscussionPostCreateManyInput | DiscussionPostCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * DiscussionPost update
   */
  export type DiscussionPostUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DiscussionPost
     */
    select?: DiscussionPostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DiscussionPost
     */
    omit?: DiscussionPostOmit<ExtArgs> | null
    /**
     * The data needed to update a DiscussionPost.
     */
    data: XOR<DiscussionPostUpdateInput, DiscussionPostUncheckedUpdateInput>
    /**
     * Choose, which DiscussionPost to update.
     */
    where: DiscussionPostWhereUniqueInput
  }

  /**
   * DiscussionPost updateMany
   */
  export type DiscussionPostUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update DiscussionPosts.
     */
    data: XOR<DiscussionPostUpdateManyMutationInput, DiscussionPostUncheckedUpdateManyInput>
    /**
     * Filter which DiscussionPosts to update
     */
    where?: DiscussionPostWhereInput
    /**
     * Limit how many DiscussionPosts to update.
     */
    limit?: number
  }

  /**
   * DiscussionPost updateManyAndReturn
   */
  export type DiscussionPostUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DiscussionPost
     */
    select?: DiscussionPostSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the DiscussionPost
     */
    omit?: DiscussionPostOmit<ExtArgs> | null
    /**
     * The data used to update DiscussionPosts.
     */
    data: XOR<DiscussionPostUpdateManyMutationInput, DiscussionPostUncheckedUpdateManyInput>
    /**
     * Filter which DiscussionPosts to update
     */
    where?: DiscussionPostWhereInput
    /**
     * Limit how many DiscussionPosts to update.
     */
    limit?: number
  }

  /**
   * DiscussionPost upsert
   */
  export type DiscussionPostUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DiscussionPost
     */
    select?: DiscussionPostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DiscussionPost
     */
    omit?: DiscussionPostOmit<ExtArgs> | null
    /**
     * The filter to search for the DiscussionPost to update in case it exists.
     */
    where: DiscussionPostWhereUniqueInput
    /**
     * In case the DiscussionPost found by the `where` argument doesn't exist, create a new DiscussionPost with this data.
     */
    create: XOR<DiscussionPostCreateInput, DiscussionPostUncheckedCreateInput>
    /**
     * In case the DiscussionPost was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DiscussionPostUpdateInput, DiscussionPostUncheckedUpdateInput>
  }

  /**
   * DiscussionPost delete
   */
  export type DiscussionPostDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DiscussionPost
     */
    select?: DiscussionPostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DiscussionPost
     */
    omit?: DiscussionPostOmit<ExtArgs> | null
    /**
     * Filter which DiscussionPost to delete.
     */
    where: DiscussionPostWhereUniqueInput
  }

  /**
   * DiscussionPost deleteMany
   */
  export type DiscussionPostDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DiscussionPosts to delete
     */
    where?: DiscussionPostWhereInput
    /**
     * Limit how many DiscussionPosts to delete.
     */
    limit?: number
  }

  /**
   * DiscussionPost without action
   */
  export type DiscussionPostDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DiscussionPost
     */
    select?: DiscussionPostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DiscussionPost
     */
    omit?: DiscussionPostOmit<ExtArgs> | null
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


  export const CareerRoadmapScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    rolePath: 'rolePath',
    targetCompanyTier: 'targetCompanyTier',
    overallReadiness: 'overallReadiness',
    nodesData: 'nodesData',
    customTechStack: 'customTechStack',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type CareerRoadmapScalarFieldEnum = (typeof CareerRoadmapScalarFieldEnum)[keyof typeof CareerRoadmapScalarFieldEnum]


  export const DiscussionPostScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    userName: 'userName',
    roleCategory: 'roleCategory',
    title: 'title',
    content: 'content',
    tags: 'tags',
    upvotes: 'upvotes',
    aiReply: 'aiReply',
    createdAt: 'createdAt'
  };

  export type DiscussionPostScalarFieldEnum = (typeof DiscussionPostScalarFieldEnum)[keyof typeof DiscussionPostScalarFieldEnum]


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


  export type CareerRoadmapWhereInput = {
    AND?: CareerRoadmapWhereInput | CareerRoadmapWhereInput[]
    OR?: CareerRoadmapWhereInput[]
    NOT?: CareerRoadmapWhereInput | CareerRoadmapWhereInput[]
    id?: StringFilter<"CareerRoadmap"> | string
    userId?: StringFilter<"CareerRoadmap"> | string
    rolePath?: StringFilter<"CareerRoadmap"> | string
    targetCompanyTier?: StringFilter<"CareerRoadmap"> | string
    overallReadiness?: IntFilter<"CareerRoadmap"> | number
    nodesData?: JsonFilter<"CareerRoadmap">
    customTechStack?: JsonNullableFilter<"CareerRoadmap">
    createdAt?: DateTimeFilter<"CareerRoadmap"> | Date | string
    updatedAt?: DateTimeFilter<"CareerRoadmap"> | Date | string
  }

  export type CareerRoadmapOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    rolePath?: SortOrder
    targetCompanyTier?: SortOrder
    overallReadiness?: SortOrder
    nodesData?: SortOrder
    customTechStack?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CareerRoadmapWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: CareerRoadmapWhereInput | CareerRoadmapWhereInput[]
    OR?: CareerRoadmapWhereInput[]
    NOT?: CareerRoadmapWhereInput | CareerRoadmapWhereInput[]
    userId?: StringFilter<"CareerRoadmap"> | string
    rolePath?: StringFilter<"CareerRoadmap"> | string
    targetCompanyTier?: StringFilter<"CareerRoadmap"> | string
    overallReadiness?: IntFilter<"CareerRoadmap"> | number
    nodesData?: JsonFilter<"CareerRoadmap">
    customTechStack?: JsonNullableFilter<"CareerRoadmap">
    createdAt?: DateTimeFilter<"CareerRoadmap"> | Date | string
    updatedAt?: DateTimeFilter<"CareerRoadmap"> | Date | string
  }, "id">

  export type CareerRoadmapOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    rolePath?: SortOrder
    targetCompanyTier?: SortOrder
    overallReadiness?: SortOrder
    nodesData?: SortOrder
    customTechStack?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: CareerRoadmapCountOrderByAggregateInput
    _avg?: CareerRoadmapAvgOrderByAggregateInput
    _max?: CareerRoadmapMaxOrderByAggregateInput
    _min?: CareerRoadmapMinOrderByAggregateInput
    _sum?: CareerRoadmapSumOrderByAggregateInput
  }

  export type CareerRoadmapScalarWhereWithAggregatesInput = {
    AND?: CareerRoadmapScalarWhereWithAggregatesInput | CareerRoadmapScalarWhereWithAggregatesInput[]
    OR?: CareerRoadmapScalarWhereWithAggregatesInput[]
    NOT?: CareerRoadmapScalarWhereWithAggregatesInput | CareerRoadmapScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"CareerRoadmap"> | string
    userId?: StringWithAggregatesFilter<"CareerRoadmap"> | string
    rolePath?: StringWithAggregatesFilter<"CareerRoadmap"> | string
    targetCompanyTier?: StringWithAggregatesFilter<"CareerRoadmap"> | string
    overallReadiness?: IntWithAggregatesFilter<"CareerRoadmap"> | number
    nodesData?: JsonWithAggregatesFilter<"CareerRoadmap">
    customTechStack?: JsonNullableWithAggregatesFilter<"CareerRoadmap">
    createdAt?: DateTimeWithAggregatesFilter<"CareerRoadmap"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"CareerRoadmap"> | Date | string
  }

  export type DiscussionPostWhereInput = {
    AND?: DiscussionPostWhereInput | DiscussionPostWhereInput[]
    OR?: DiscussionPostWhereInput[]
    NOT?: DiscussionPostWhereInput | DiscussionPostWhereInput[]
    id?: StringFilter<"DiscussionPost"> | string
    userId?: StringFilter<"DiscussionPost"> | string
    userName?: StringFilter<"DiscussionPost"> | string
    roleCategory?: StringFilter<"DiscussionPost"> | string
    title?: StringFilter<"DiscussionPost"> | string
    content?: StringFilter<"DiscussionPost"> | string
    tags?: StringNullableListFilter<"DiscussionPost">
    upvotes?: IntFilter<"DiscussionPost"> | number
    aiReply?: StringNullableFilter<"DiscussionPost"> | string | null
    createdAt?: DateTimeFilter<"DiscussionPost"> | Date | string
  }

  export type DiscussionPostOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    userName?: SortOrder
    roleCategory?: SortOrder
    title?: SortOrder
    content?: SortOrder
    tags?: SortOrder
    upvotes?: SortOrder
    aiReply?: SortOrderInput | SortOrder
    createdAt?: SortOrder
  }

  export type DiscussionPostWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: DiscussionPostWhereInput | DiscussionPostWhereInput[]
    OR?: DiscussionPostWhereInput[]
    NOT?: DiscussionPostWhereInput | DiscussionPostWhereInput[]
    userId?: StringFilter<"DiscussionPost"> | string
    userName?: StringFilter<"DiscussionPost"> | string
    roleCategory?: StringFilter<"DiscussionPost"> | string
    title?: StringFilter<"DiscussionPost"> | string
    content?: StringFilter<"DiscussionPost"> | string
    tags?: StringNullableListFilter<"DiscussionPost">
    upvotes?: IntFilter<"DiscussionPost"> | number
    aiReply?: StringNullableFilter<"DiscussionPost"> | string | null
    createdAt?: DateTimeFilter<"DiscussionPost"> | Date | string
  }, "id">

  export type DiscussionPostOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    userName?: SortOrder
    roleCategory?: SortOrder
    title?: SortOrder
    content?: SortOrder
    tags?: SortOrder
    upvotes?: SortOrder
    aiReply?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: DiscussionPostCountOrderByAggregateInput
    _avg?: DiscussionPostAvgOrderByAggregateInput
    _max?: DiscussionPostMaxOrderByAggregateInput
    _min?: DiscussionPostMinOrderByAggregateInput
    _sum?: DiscussionPostSumOrderByAggregateInput
  }

  export type DiscussionPostScalarWhereWithAggregatesInput = {
    AND?: DiscussionPostScalarWhereWithAggregatesInput | DiscussionPostScalarWhereWithAggregatesInput[]
    OR?: DiscussionPostScalarWhereWithAggregatesInput[]
    NOT?: DiscussionPostScalarWhereWithAggregatesInput | DiscussionPostScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"DiscussionPost"> | string
    userId?: StringWithAggregatesFilter<"DiscussionPost"> | string
    userName?: StringWithAggregatesFilter<"DiscussionPost"> | string
    roleCategory?: StringWithAggregatesFilter<"DiscussionPost"> | string
    title?: StringWithAggregatesFilter<"DiscussionPost"> | string
    content?: StringWithAggregatesFilter<"DiscussionPost"> | string
    tags?: StringNullableListFilter<"DiscussionPost">
    upvotes?: IntWithAggregatesFilter<"DiscussionPost"> | number
    aiReply?: StringNullableWithAggregatesFilter<"DiscussionPost"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"DiscussionPost"> | Date | string
  }

  export type CareerRoadmapCreateInput = {
    id?: string
    userId: string
    rolePath: string
    targetCompanyTier?: string
    overallReadiness?: number
    nodesData: JsonNullValueInput | InputJsonValue
    customTechStack?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CareerRoadmapUncheckedCreateInput = {
    id?: string
    userId: string
    rolePath: string
    targetCompanyTier?: string
    overallReadiness?: number
    nodesData: JsonNullValueInput | InputJsonValue
    customTechStack?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CareerRoadmapUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    rolePath?: StringFieldUpdateOperationsInput | string
    targetCompanyTier?: StringFieldUpdateOperationsInput | string
    overallReadiness?: IntFieldUpdateOperationsInput | number
    nodesData?: JsonNullValueInput | InputJsonValue
    customTechStack?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CareerRoadmapUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    rolePath?: StringFieldUpdateOperationsInput | string
    targetCompanyTier?: StringFieldUpdateOperationsInput | string
    overallReadiness?: IntFieldUpdateOperationsInput | number
    nodesData?: JsonNullValueInput | InputJsonValue
    customTechStack?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CareerRoadmapCreateManyInput = {
    id?: string
    userId: string
    rolePath: string
    targetCompanyTier?: string
    overallReadiness?: number
    nodesData: JsonNullValueInput | InputJsonValue
    customTechStack?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CareerRoadmapUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    rolePath?: StringFieldUpdateOperationsInput | string
    targetCompanyTier?: StringFieldUpdateOperationsInput | string
    overallReadiness?: IntFieldUpdateOperationsInput | number
    nodesData?: JsonNullValueInput | InputJsonValue
    customTechStack?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CareerRoadmapUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    rolePath?: StringFieldUpdateOperationsInput | string
    targetCompanyTier?: StringFieldUpdateOperationsInput | string
    overallReadiness?: IntFieldUpdateOperationsInput | number
    nodesData?: JsonNullValueInput | InputJsonValue
    customTechStack?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DiscussionPostCreateInput = {
    id?: string
    userId: string
    userName: string
    roleCategory: string
    title: string
    content: string
    tags?: DiscussionPostCreatetagsInput | string[]
    upvotes?: number
    aiReply?: string | null
    createdAt?: Date | string
  }

  export type DiscussionPostUncheckedCreateInput = {
    id?: string
    userId: string
    userName: string
    roleCategory: string
    title: string
    content: string
    tags?: DiscussionPostCreatetagsInput | string[]
    upvotes?: number
    aiReply?: string | null
    createdAt?: Date | string
  }

  export type DiscussionPostUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    userName?: StringFieldUpdateOperationsInput | string
    roleCategory?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    tags?: DiscussionPostUpdatetagsInput | string[]
    upvotes?: IntFieldUpdateOperationsInput | number
    aiReply?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DiscussionPostUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    userName?: StringFieldUpdateOperationsInput | string
    roleCategory?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    tags?: DiscussionPostUpdatetagsInput | string[]
    upvotes?: IntFieldUpdateOperationsInput | number
    aiReply?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DiscussionPostCreateManyInput = {
    id?: string
    userId: string
    userName: string
    roleCategory: string
    title: string
    content: string
    tags?: DiscussionPostCreatetagsInput | string[]
    upvotes?: number
    aiReply?: string | null
    createdAt?: Date | string
  }

  export type DiscussionPostUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    userName?: StringFieldUpdateOperationsInput | string
    roleCategory?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    tags?: DiscussionPostUpdatetagsInput | string[]
    upvotes?: IntFieldUpdateOperationsInput | number
    aiReply?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DiscussionPostUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    userName?: StringFieldUpdateOperationsInput | string
    roleCategory?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    tags?: DiscussionPostUpdatetagsInput | string[]
    upvotes?: IntFieldUpdateOperationsInput | number
    aiReply?: NullableStringFieldUpdateOperationsInput | string | null
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

  export type CareerRoadmapCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    rolePath?: SortOrder
    targetCompanyTier?: SortOrder
    overallReadiness?: SortOrder
    nodesData?: SortOrder
    customTechStack?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CareerRoadmapAvgOrderByAggregateInput = {
    overallReadiness?: SortOrder
  }

  export type CareerRoadmapMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    rolePath?: SortOrder
    targetCompanyTier?: SortOrder
    overallReadiness?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CareerRoadmapMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    rolePath?: SortOrder
    targetCompanyTier?: SortOrder
    overallReadiness?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CareerRoadmapSumOrderByAggregateInput = {
    overallReadiness?: SortOrder
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

  export type StringNullableListFilter<$PrismaModel = never> = {
    equals?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    has?: string | StringFieldRefInput<$PrismaModel> | null
    hasEvery?: string[] | ListStringFieldRefInput<$PrismaModel>
    hasSome?: string[] | ListStringFieldRefInput<$PrismaModel>
    isEmpty?: boolean
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

  export type DiscussionPostCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    userName?: SortOrder
    roleCategory?: SortOrder
    title?: SortOrder
    content?: SortOrder
    tags?: SortOrder
    upvotes?: SortOrder
    aiReply?: SortOrder
    createdAt?: SortOrder
  }

  export type DiscussionPostAvgOrderByAggregateInput = {
    upvotes?: SortOrder
  }

  export type DiscussionPostMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    userName?: SortOrder
    roleCategory?: SortOrder
    title?: SortOrder
    content?: SortOrder
    upvotes?: SortOrder
    aiReply?: SortOrder
    createdAt?: SortOrder
  }

  export type DiscussionPostMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    userName?: SortOrder
    roleCategory?: SortOrder
    title?: SortOrder
    content?: SortOrder
    upvotes?: SortOrder
    aiReply?: SortOrder
    createdAt?: SortOrder
  }

  export type DiscussionPostSumOrderByAggregateInput = {
    upvotes?: SortOrder
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

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type DiscussionPostCreatetagsInput = {
    set: string[]
  }

  export type DiscussionPostUpdatetagsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
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