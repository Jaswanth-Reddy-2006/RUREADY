
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
 * Model InterviewSession
 * 
 */
export type InterviewSession = $Result.DefaultSelection<Prisma.$InterviewSessionPayload>
/**
 * Model Question
 * 
 */
export type Question = $Result.DefaultSelection<Prisma.$QuestionPayload>
/**
 * Model PreDefinedProblem
 * 
 */
export type PreDefinedProblem = $Result.DefaultSelection<Prisma.$PreDefinedProblemPayload>
/**
 * Model AtsMatch
 * 
 */
export type AtsMatch = $Result.DefaultSelection<Prisma.$AtsMatchPayload>
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
 * Enums
 */
export namespace $Enums {
  export const ReadinessVerdict: {
  NOT_READY: 'NOT_READY',
  ALMOST_READY: 'ALMOST_READY',
  READY: 'READY',
  STRONG: 'STRONG'
};

export type ReadinessVerdict = (typeof ReadinessVerdict)[keyof typeof ReadinessVerdict]


export const ExperienceLevel: {
  FRESHER: 'FRESHER',
  MID: 'MID',
  SENIOR: 'SENIOR'
};

export type ExperienceLevel = (typeof ExperienceLevel)[keyof typeof ExperienceLevel]

}

export type ReadinessVerdict = $Enums.ReadinessVerdict

export const ReadinessVerdict: typeof $Enums.ReadinessVerdict

export type ExperienceLevel = $Enums.ExperienceLevel

export const ExperienceLevel: typeof $Enums.ExperienceLevel

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
   * `prisma.interviewSession`: Exposes CRUD operations for the **InterviewSession** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more InterviewSessions
    * const interviewSessions = await prisma.interviewSession.findMany()
    * ```
    */
  get interviewSession(): Prisma.InterviewSessionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.question`: Exposes CRUD operations for the **Question** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Questions
    * const questions = await prisma.question.findMany()
    * ```
    */
  get question(): Prisma.QuestionDelegate<ExtArgs, ClientOptions>;

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
   * `prisma.atsMatch`: Exposes CRUD operations for the **AtsMatch** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AtsMatches
    * const atsMatches = await prisma.atsMatch.findMany()
    * ```
    */
  get atsMatch(): Prisma.AtsMatchDelegate<ExtArgs, ClientOptions>;

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
    Analysis: 'Analysis',
    InterviewSession: 'InterviewSession',
    Question: 'Question',
    PreDefinedProblem: 'PreDefinedProblem',
    AtsMatch: 'AtsMatch',
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
      modelProps: "analysis" | "interviewSession" | "question" | "preDefinedProblem" | "atsMatch" | "careerRoadmap" | "discussionPost"
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
      InterviewSession: {
        payload: Prisma.$InterviewSessionPayload<ExtArgs>
        fields: Prisma.InterviewSessionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.InterviewSessionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InterviewSessionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.InterviewSessionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InterviewSessionPayload>
          }
          findFirst: {
            args: Prisma.InterviewSessionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InterviewSessionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.InterviewSessionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InterviewSessionPayload>
          }
          findMany: {
            args: Prisma.InterviewSessionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InterviewSessionPayload>[]
          }
          create: {
            args: Prisma.InterviewSessionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InterviewSessionPayload>
          }
          createMany: {
            args: Prisma.InterviewSessionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.InterviewSessionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InterviewSessionPayload>[]
          }
          delete: {
            args: Prisma.InterviewSessionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InterviewSessionPayload>
          }
          update: {
            args: Prisma.InterviewSessionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InterviewSessionPayload>
          }
          deleteMany: {
            args: Prisma.InterviewSessionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.InterviewSessionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.InterviewSessionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InterviewSessionPayload>[]
          }
          upsert: {
            args: Prisma.InterviewSessionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InterviewSessionPayload>
          }
          aggregate: {
            args: Prisma.InterviewSessionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateInterviewSession>
          }
          groupBy: {
            args: Prisma.InterviewSessionGroupByArgs<ExtArgs>
            result: $Utils.Optional<InterviewSessionGroupByOutputType>[]
          }
          count: {
            args: Prisma.InterviewSessionCountArgs<ExtArgs>
            result: $Utils.Optional<InterviewSessionCountAggregateOutputType> | number
          }
        }
      }
      Question: {
        payload: Prisma.$QuestionPayload<ExtArgs>
        fields: Prisma.QuestionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.QuestionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuestionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.QuestionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuestionPayload>
          }
          findFirst: {
            args: Prisma.QuestionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuestionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.QuestionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuestionPayload>
          }
          findMany: {
            args: Prisma.QuestionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuestionPayload>[]
          }
          create: {
            args: Prisma.QuestionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuestionPayload>
          }
          createMany: {
            args: Prisma.QuestionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.QuestionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuestionPayload>[]
          }
          delete: {
            args: Prisma.QuestionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuestionPayload>
          }
          update: {
            args: Prisma.QuestionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuestionPayload>
          }
          deleteMany: {
            args: Prisma.QuestionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.QuestionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.QuestionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuestionPayload>[]
          }
          upsert: {
            args: Prisma.QuestionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuestionPayload>
          }
          aggregate: {
            args: Prisma.QuestionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateQuestion>
          }
          groupBy: {
            args: Prisma.QuestionGroupByArgs<ExtArgs>
            result: $Utils.Optional<QuestionGroupByOutputType>[]
          }
          count: {
            args: Prisma.QuestionCountArgs<ExtArgs>
            result: $Utils.Optional<QuestionCountAggregateOutputType> | number
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
      AtsMatch: {
        payload: Prisma.$AtsMatchPayload<ExtArgs>
        fields: Prisma.AtsMatchFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AtsMatchFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AtsMatchPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AtsMatchFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AtsMatchPayload>
          }
          findFirst: {
            args: Prisma.AtsMatchFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AtsMatchPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AtsMatchFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AtsMatchPayload>
          }
          findMany: {
            args: Prisma.AtsMatchFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AtsMatchPayload>[]
          }
          create: {
            args: Prisma.AtsMatchCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AtsMatchPayload>
          }
          createMany: {
            args: Prisma.AtsMatchCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AtsMatchCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AtsMatchPayload>[]
          }
          delete: {
            args: Prisma.AtsMatchDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AtsMatchPayload>
          }
          update: {
            args: Prisma.AtsMatchUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AtsMatchPayload>
          }
          deleteMany: {
            args: Prisma.AtsMatchDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AtsMatchUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AtsMatchUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AtsMatchPayload>[]
          }
          upsert: {
            args: Prisma.AtsMatchUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AtsMatchPayload>
          }
          aggregate: {
            args: Prisma.AtsMatchAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAtsMatch>
          }
          groupBy: {
            args: Prisma.AtsMatchGroupByArgs<ExtArgs>
            result: $Utils.Optional<AtsMatchGroupByOutputType>[]
          }
          count: {
            args: Prisma.AtsMatchCountArgs<ExtArgs>
            result: $Utils.Optional<AtsMatchCountAggregateOutputType> | number
          }
        }
      }
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
    analysis?: AnalysisOmit
    interviewSession?: InterviewSessionOmit
    question?: QuestionOmit
    preDefinedProblem?: PreDefinedProblemOmit
    atsMatch?: AtsMatchOmit
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
   * Count Type InterviewSessionCountOutputType
   */

  export type InterviewSessionCountOutputType = {
    questions: number
  }

  export type InterviewSessionCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    questions?: boolean | InterviewSessionCountOutputTypeCountQuestionsArgs
  }

  // Custom InputTypes
  /**
   * InterviewSessionCountOutputType without action
   */
  export type InterviewSessionCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InterviewSessionCountOutputType
     */
    select?: InterviewSessionCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * InterviewSessionCountOutputType without action
   */
  export type InterviewSessionCountOutputTypeCountQuestionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: QuestionWhereInput
  }


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
    readinessVerdict: $Enums.ReadinessVerdict | null
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
    readinessVerdict: $Enums.ReadinessVerdict | null
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
    readinessVerdict: $Enums.ReadinessVerdict
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
    session?: boolean | InterviewSessionDefaultArgs<ExtArgs>
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
    session?: boolean | InterviewSessionDefaultArgs<ExtArgs>
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
    session?: boolean | InterviewSessionDefaultArgs<ExtArgs>
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
  export type AnalysisInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    session?: boolean | InterviewSessionDefaultArgs<ExtArgs>
  }
  export type AnalysisIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    session?: boolean | InterviewSessionDefaultArgs<ExtArgs>
  }
  export type AnalysisIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    session?: boolean | InterviewSessionDefaultArgs<ExtArgs>
  }

  export type $AnalysisPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Analysis"
    objects: {
      session: Prisma.$InterviewSessionPayload<ExtArgs>
    }
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
      readinessVerdict: $Enums.ReadinessVerdict
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
    session<T extends InterviewSessionDefaultArgs<ExtArgs> = {}>(args?: Subset<T, InterviewSessionDefaultArgs<ExtArgs>>): Prisma__InterviewSessionClient<$Result.GetResult<Prisma.$InterviewSessionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
    readonly readinessVerdict: FieldRef<"Analysis", 'ReadinessVerdict'>
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
     * Choose, which related nodes to fetch as well
     */
    include?: AnalysisInclude<ExtArgs> | null
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
     * Choose, which related nodes to fetch as well
     */
    include?: AnalysisInclude<ExtArgs> | null
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
     * Choose, which related nodes to fetch as well
     */
    include?: AnalysisInclude<ExtArgs> | null
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
     * Choose, which related nodes to fetch as well
     */
    include?: AnalysisInclude<ExtArgs> | null
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
     * Choose, which related nodes to fetch as well
     */
    include?: AnalysisInclude<ExtArgs> | null
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
     * Choose, which related nodes to fetch as well
     */
    include?: AnalysisInclude<ExtArgs> | null
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
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnalysisIncludeCreateManyAndReturn<ExtArgs> | null
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
     * Choose, which related nodes to fetch as well
     */
    include?: AnalysisInclude<ExtArgs> | null
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
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnalysisIncludeUpdateManyAndReturn<ExtArgs> | null
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
     * Choose, which related nodes to fetch as well
     */
    include?: AnalysisInclude<ExtArgs> | null
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
     * Choose, which related nodes to fetch as well
     */
    include?: AnalysisInclude<ExtArgs> | null
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
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnalysisInclude<ExtArgs> | null
  }


  /**
   * Model InterviewSession
   */

  export type AggregateInterviewSession = {
    _count: InterviewSessionCountAggregateOutputType | null
    _avg: InterviewSessionAvgAggregateOutputType | null
    _sum: InterviewSessionSumAggregateOutputType | null
    _min: InterviewSessionMinAggregateOutputType | null
    _max: InterviewSessionMaxAggregateOutputType | null
  }

  export type InterviewSessionAvgAggregateOutputType = {
    durationMins: number | null
    hintCount: number | null
    testCasesPassed: number | null
  }

  export type InterviewSessionSumAggregateOutputType = {
    durationMins: number | null
    hintCount: number | null
    testCasesPassed: number | null
  }

  export type InterviewSessionMinAggregateOutputType = {
    id: string | null
    userId: string | null
    interviewType: string | null
    targetRole: string | null
    targetCompany: string | null
    industry: string | null
    experienceLevel: $Enums.ExperienceLevel | null
    interviewGoal: string | null
    durationMins: number | null
    status: string | null
    startedAt: Date | null
    completedAt: Date | null
    createdAt: Date | null
    mode: string | null
    hintCount: number | null
    testCasesPassed: number | null
    selectedLanguage: string | null
    isDeleted: boolean | null
  }

  export type InterviewSessionMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    interviewType: string | null
    targetRole: string | null
    targetCompany: string | null
    industry: string | null
    experienceLevel: $Enums.ExperienceLevel | null
    interviewGoal: string | null
    durationMins: number | null
    status: string | null
    startedAt: Date | null
    completedAt: Date | null
    createdAt: Date | null
    mode: string | null
    hintCount: number | null
    testCasesPassed: number | null
    selectedLanguage: string | null
    isDeleted: boolean | null
  }

  export type InterviewSessionCountAggregateOutputType = {
    id: number
    userId: number
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
    mode: number
    hintCount: number
    testCasesPassed: number
    selectedLanguage: number
    isDeleted: number
    _all: number
  }


  export type InterviewSessionAvgAggregateInputType = {
    durationMins?: true
    hintCount?: true
    testCasesPassed?: true
  }

  export type InterviewSessionSumAggregateInputType = {
    durationMins?: true
    hintCount?: true
    testCasesPassed?: true
  }

  export type InterviewSessionMinAggregateInputType = {
    id?: true
    userId?: true
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
    mode?: true
    hintCount?: true
    testCasesPassed?: true
    selectedLanguage?: true
    isDeleted?: true
  }

  export type InterviewSessionMaxAggregateInputType = {
    id?: true
    userId?: true
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
    mode?: true
    hintCount?: true
    testCasesPassed?: true
    selectedLanguage?: true
    isDeleted?: true
  }

  export type InterviewSessionCountAggregateInputType = {
    id?: true
    userId?: true
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
    mode?: true
    hintCount?: true
    testCasesPassed?: true
    selectedLanguage?: true
    isDeleted?: true
    _all?: true
  }

  export type InterviewSessionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which InterviewSession to aggregate.
     */
    where?: InterviewSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InterviewSessions to fetch.
     */
    orderBy?: InterviewSessionOrderByWithRelationInput | InterviewSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: InterviewSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InterviewSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InterviewSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned InterviewSessions
    **/
    _count?: true | InterviewSessionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: InterviewSessionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: InterviewSessionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: InterviewSessionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: InterviewSessionMaxAggregateInputType
  }

  export type GetInterviewSessionAggregateType<T extends InterviewSessionAggregateArgs> = {
        [P in keyof T & keyof AggregateInterviewSession]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateInterviewSession[P]>
      : GetScalarType<T[P], AggregateInterviewSession[P]>
  }




  export type InterviewSessionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: InterviewSessionWhereInput
    orderBy?: InterviewSessionOrderByWithAggregationInput | InterviewSessionOrderByWithAggregationInput[]
    by: InterviewSessionScalarFieldEnum[] | InterviewSessionScalarFieldEnum
    having?: InterviewSessionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: InterviewSessionCountAggregateInputType | true
    _avg?: InterviewSessionAvgAggregateInputType
    _sum?: InterviewSessionSumAggregateInputType
    _min?: InterviewSessionMinAggregateInputType
    _max?: InterviewSessionMaxAggregateInputType
  }

  export type InterviewSessionGroupByOutputType = {
    id: string
    userId: string
    interviewType: string
    targetRole: string
    targetCompany: string | null
    industry: string
    experienceLevel: $Enums.ExperienceLevel
    focusAreas: string[]
    interviewGoal: string | null
    durationMins: number
    status: string
    startedAt: Date | null
    completedAt: Date | null
    createdAt: Date
    mode: string
    hintCount: number
    testCasesPassed: number | null
    selectedLanguage: string | null
    isDeleted: boolean
    _count: InterviewSessionCountAggregateOutputType | null
    _avg: InterviewSessionAvgAggregateOutputType | null
    _sum: InterviewSessionSumAggregateOutputType | null
    _min: InterviewSessionMinAggregateOutputType | null
    _max: InterviewSessionMaxAggregateOutputType | null
  }

  type GetInterviewSessionGroupByPayload<T extends InterviewSessionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<InterviewSessionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof InterviewSessionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], InterviewSessionGroupByOutputType[P]>
            : GetScalarType<T[P], InterviewSessionGroupByOutputType[P]>
        }
      >
    >


  export type InterviewSessionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
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
    mode?: boolean
    hintCount?: boolean
    testCasesPassed?: boolean
    selectedLanguage?: boolean
    isDeleted?: boolean
    questions?: boolean | InterviewSession$questionsArgs<ExtArgs>
    analysis?: boolean | InterviewSession$analysisArgs<ExtArgs>
    _count?: boolean | InterviewSessionCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["interviewSession"]>

  export type InterviewSessionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
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
    mode?: boolean
    hintCount?: boolean
    testCasesPassed?: boolean
    selectedLanguage?: boolean
    isDeleted?: boolean
  }, ExtArgs["result"]["interviewSession"]>

  export type InterviewSessionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
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
    mode?: boolean
    hintCount?: boolean
    testCasesPassed?: boolean
    selectedLanguage?: boolean
    isDeleted?: boolean
  }, ExtArgs["result"]["interviewSession"]>

  export type InterviewSessionSelectScalar = {
    id?: boolean
    userId?: boolean
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
    mode?: boolean
    hintCount?: boolean
    testCasesPassed?: boolean
    selectedLanguage?: boolean
    isDeleted?: boolean
  }

  export type InterviewSessionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "interviewType" | "targetRole" | "targetCompany" | "industry" | "experienceLevel" | "focusAreas" | "interviewGoal" | "durationMins" | "status" | "startedAt" | "completedAt" | "createdAt" | "mode" | "hintCount" | "testCasesPassed" | "selectedLanguage" | "isDeleted", ExtArgs["result"]["interviewSession"]>
  export type InterviewSessionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    questions?: boolean | InterviewSession$questionsArgs<ExtArgs>
    analysis?: boolean | InterviewSession$analysisArgs<ExtArgs>
    _count?: boolean | InterviewSessionCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type InterviewSessionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type InterviewSessionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $InterviewSessionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "InterviewSession"
    objects: {
      questions: Prisma.$QuestionPayload<ExtArgs>[]
      analysis: Prisma.$AnalysisPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      interviewType: string
      targetRole: string
      targetCompany: string | null
      industry: string
      experienceLevel: $Enums.ExperienceLevel
      focusAreas: string[]
      interviewGoal: string | null
      durationMins: number
      status: string
      startedAt: Date | null
      completedAt: Date | null
      createdAt: Date
      mode: string
      hintCount: number
      testCasesPassed: number | null
      selectedLanguage: string | null
      isDeleted: boolean
    }, ExtArgs["result"]["interviewSession"]>
    composites: {}
  }

  type InterviewSessionGetPayload<S extends boolean | null | undefined | InterviewSessionDefaultArgs> = $Result.GetResult<Prisma.$InterviewSessionPayload, S>

  type InterviewSessionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<InterviewSessionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: InterviewSessionCountAggregateInputType | true
    }

  export interface InterviewSessionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['InterviewSession'], meta: { name: 'InterviewSession' } }
    /**
     * Find zero or one InterviewSession that matches the filter.
     * @param {InterviewSessionFindUniqueArgs} args - Arguments to find a InterviewSession
     * @example
     * // Get one InterviewSession
     * const interviewSession = await prisma.interviewSession.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends InterviewSessionFindUniqueArgs>(args: SelectSubset<T, InterviewSessionFindUniqueArgs<ExtArgs>>): Prisma__InterviewSessionClient<$Result.GetResult<Prisma.$InterviewSessionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one InterviewSession that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {InterviewSessionFindUniqueOrThrowArgs} args - Arguments to find a InterviewSession
     * @example
     * // Get one InterviewSession
     * const interviewSession = await prisma.interviewSession.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends InterviewSessionFindUniqueOrThrowArgs>(args: SelectSubset<T, InterviewSessionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__InterviewSessionClient<$Result.GetResult<Prisma.$InterviewSessionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first InterviewSession that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InterviewSessionFindFirstArgs} args - Arguments to find a InterviewSession
     * @example
     * // Get one InterviewSession
     * const interviewSession = await prisma.interviewSession.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends InterviewSessionFindFirstArgs>(args?: SelectSubset<T, InterviewSessionFindFirstArgs<ExtArgs>>): Prisma__InterviewSessionClient<$Result.GetResult<Prisma.$InterviewSessionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first InterviewSession that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InterviewSessionFindFirstOrThrowArgs} args - Arguments to find a InterviewSession
     * @example
     * // Get one InterviewSession
     * const interviewSession = await prisma.interviewSession.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends InterviewSessionFindFirstOrThrowArgs>(args?: SelectSubset<T, InterviewSessionFindFirstOrThrowArgs<ExtArgs>>): Prisma__InterviewSessionClient<$Result.GetResult<Prisma.$InterviewSessionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more InterviewSessions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InterviewSessionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all InterviewSessions
     * const interviewSessions = await prisma.interviewSession.findMany()
     * 
     * // Get first 10 InterviewSessions
     * const interviewSessions = await prisma.interviewSession.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const interviewSessionWithIdOnly = await prisma.interviewSession.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends InterviewSessionFindManyArgs>(args?: SelectSubset<T, InterviewSessionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InterviewSessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a InterviewSession.
     * @param {InterviewSessionCreateArgs} args - Arguments to create a InterviewSession.
     * @example
     * // Create one InterviewSession
     * const InterviewSession = await prisma.interviewSession.create({
     *   data: {
     *     // ... data to create a InterviewSession
     *   }
     * })
     * 
     */
    create<T extends InterviewSessionCreateArgs>(args: SelectSubset<T, InterviewSessionCreateArgs<ExtArgs>>): Prisma__InterviewSessionClient<$Result.GetResult<Prisma.$InterviewSessionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many InterviewSessions.
     * @param {InterviewSessionCreateManyArgs} args - Arguments to create many InterviewSessions.
     * @example
     * // Create many InterviewSessions
     * const interviewSession = await prisma.interviewSession.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends InterviewSessionCreateManyArgs>(args?: SelectSubset<T, InterviewSessionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many InterviewSessions and returns the data saved in the database.
     * @param {InterviewSessionCreateManyAndReturnArgs} args - Arguments to create many InterviewSessions.
     * @example
     * // Create many InterviewSessions
     * const interviewSession = await prisma.interviewSession.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many InterviewSessions and only return the `id`
     * const interviewSessionWithIdOnly = await prisma.interviewSession.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends InterviewSessionCreateManyAndReturnArgs>(args?: SelectSubset<T, InterviewSessionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InterviewSessionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a InterviewSession.
     * @param {InterviewSessionDeleteArgs} args - Arguments to delete one InterviewSession.
     * @example
     * // Delete one InterviewSession
     * const InterviewSession = await prisma.interviewSession.delete({
     *   where: {
     *     // ... filter to delete one InterviewSession
     *   }
     * })
     * 
     */
    delete<T extends InterviewSessionDeleteArgs>(args: SelectSubset<T, InterviewSessionDeleteArgs<ExtArgs>>): Prisma__InterviewSessionClient<$Result.GetResult<Prisma.$InterviewSessionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one InterviewSession.
     * @param {InterviewSessionUpdateArgs} args - Arguments to update one InterviewSession.
     * @example
     * // Update one InterviewSession
     * const interviewSession = await prisma.interviewSession.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends InterviewSessionUpdateArgs>(args: SelectSubset<T, InterviewSessionUpdateArgs<ExtArgs>>): Prisma__InterviewSessionClient<$Result.GetResult<Prisma.$InterviewSessionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more InterviewSessions.
     * @param {InterviewSessionDeleteManyArgs} args - Arguments to filter InterviewSessions to delete.
     * @example
     * // Delete a few InterviewSessions
     * const { count } = await prisma.interviewSession.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends InterviewSessionDeleteManyArgs>(args?: SelectSubset<T, InterviewSessionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more InterviewSessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InterviewSessionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many InterviewSessions
     * const interviewSession = await prisma.interviewSession.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends InterviewSessionUpdateManyArgs>(args: SelectSubset<T, InterviewSessionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more InterviewSessions and returns the data updated in the database.
     * @param {InterviewSessionUpdateManyAndReturnArgs} args - Arguments to update many InterviewSessions.
     * @example
     * // Update many InterviewSessions
     * const interviewSession = await prisma.interviewSession.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more InterviewSessions and only return the `id`
     * const interviewSessionWithIdOnly = await prisma.interviewSession.updateManyAndReturn({
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
    updateManyAndReturn<T extends InterviewSessionUpdateManyAndReturnArgs>(args: SelectSubset<T, InterviewSessionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InterviewSessionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one InterviewSession.
     * @param {InterviewSessionUpsertArgs} args - Arguments to update or create a InterviewSession.
     * @example
     * // Update or create a InterviewSession
     * const interviewSession = await prisma.interviewSession.upsert({
     *   create: {
     *     // ... data to create a InterviewSession
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the InterviewSession we want to update
     *   }
     * })
     */
    upsert<T extends InterviewSessionUpsertArgs>(args: SelectSubset<T, InterviewSessionUpsertArgs<ExtArgs>>): Prisma__InterviewSessionClient<$Result.GetResult<Prisma.$InterviewSessionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of InterviewSessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InterviewSessionCountArgs} args - Arguments to filter InterviewSessions to count.
     * @example
     * // Count the number of InterviewSessions
     * const count = await prisma.interviewSession.count({
     *   where: {
     *     // ... the filter for the InterviewSessions we want to count
     *   }
     * })
    **/
    count<T extends InterviewSessionCountArgs>(
      args?: Subset<T, InterviewSessionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], InterviewSessionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a InterviewSession.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InterviewSessionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends InterviewSessionAggregateArgs>(args: Subset<T, InterviewSessionAggregateArgs>): Prisma.PrismaPromise<GetInterviewSessionAggregateType<T>>

    /**
     * Group by InterviewSession.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InterviewSessionGroupByArgs} args - Group by arguments.
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
      T extends InterviewSessionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: InterviewSessionGroupByArgs['orderBy'] }
        : { orderBy?: InterviewSessionGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, InterviewSessionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetInterviewSessionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the InterviewSession model
   */
  readonly fields: InterviewSessionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for InterviewSession.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__InterviewSessionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    questions<T extends InterviewSession$questionsArgs<ExtArgs> = {}>(args?: Subset<T, InterviewSession$questionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$QuestionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    analysis<T extends InterviewSession$analysisArgs<ExtArgs> = {}>(args?: Subset<T, InterviewSession$analysisArgs<ExtArgs>>): Prisma__AnalysisClient<$Result.GetResult<Prisma.$AnalysisPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the InterviewSession model
   */
  interface InterviewSessionFieldRefs {
    readonly id: FieldRef<"InterviewSession", 'String'>
    readonly userId: FieldRef<"InterviewSession", 'String'>
    readonly interviewType: FieldRef<"InterviewSession", 'String'>
    readonly targetRole: FieldRef<"InterviewSession", 'String'>
    readonly targetCompany: FieldRef<"InterviewSession", 'String'>
    readonly industry: FieldRef<"InterviewSession", 'String'>
    readonly experienceLevel: FieldRef<"InterviewSession", 'ExperienceLevel'>
    readonly focusAreas: FieldRef<"InterviewSession", 'String[]'>
    readonly interviewGoal: FieldRef<"InterviewSession", 'String'>
    readonly durationMins: FieldRef<"InterviewSession", 'Int'>
    readonly status: FieldRef<"InterviewSession", 'String'>
    readonly startedAt: FieldRef<"InterviewSession", 'DateTime'>
    readonly completedAt: FieldRef<"InterviewSession", 'DateTime'>
    readonly createdAt: FieldRef<"InterviewSession", 'DateTime'>
    readonly mode: FieldRef<"InterviewSession", 'String'>
    readonly hintCount: FieldRef<"InterviewSession", 'Int'>
    readonly testCasesPassed: FieldRef<"InterviewSession", 'Int'>
    readonly selectedLanguage: FieldRef<"InterviewSession", 'String'>
    readonly isDeleted: FieldRef<"InterviewSession", 'Boolean'>
  }
    

  // Custom InputTypes
  /**
   * InterviewSession findUnique
   */
  export type InterviewSessionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InterviewSession
     */
    select?: InterviewSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InterviewSession
     */
    omit?: InterviewSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InterviewSessionInclude<ExtArgs> | null
    /**
     * Filter, which InterviewSession to fetch.
     */
    where: InterviewSessionWhereUniqueInput
  }

  /**
   * InterviewSession findUniqueOrThrow
   */
  export type InterviewSessionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InterviewSession
     */
    select?: InterviewSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InterviewSession
     */
    omit?: InterviewSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InterviewSessionInclude<ExtArgs> | null
    /**
     * Filter, which InterviewSession to fetch.
     */
    where: InterviewSessionWhereUniqueInput
  }

  /**
   * InterviewSession findFirst
   */
  export type InterviewSessionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InterviewSession
     */
    select?: InterviewSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InterviewSession
     */
    omit?: InterviewSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InterviewSessionInclude<ExtArgs> | null
    /**
     * Filter, which InterviewSession to fetch.
     */
    where?: InterviewSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InterviewSessions to fetch.
     */
    orderBy?: InterviewSessionOrderByWithRelationInput | InterviewSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for InterviewSessions.
     */
    cursor?: InterviewSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InterviewSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InterviewSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of InterviewSessions.
     */
    distinct?: InterviewSessionScalarFieldEnum | InterviewSessionScalarFieldEnum[]
  }

  /**
   * InterviewSession findFirstOrThrow
   */
  export type InterviewSessionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InterviewSession
     */
    select?: InterviewSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InterviewSession
     */
    omit?: InterviewSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InterviewSessionInclude<ExtArgs> | null
    /**
     * Filter, which InterviewSession to fetch.
     */
    where?: InterviewSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InterviewSessions to fetch.
     */
    orderBy?: InterviewSessionOrderByWithRelationInput | InterviewSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for InterviewSessions.
     */
    cursor?: InterviewSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InterviewSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InterviewSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of InterviewSessions.
     */
    distinct?: InterviewSessionScalarFieldEnum | InterviewSessionScalarFieldEnum[]
  }

  /**
   * InterviewSession findMany
   */
  export type InterviewSessionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InterviewSession
     */
    select?: InterviewSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InterviewSession
     */
    omit?: InterviewSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InterviewSessionInclude<ExtArgs> | null
    /**
     * Filter, which InterviewSessions to fetch.
     */
    where?: InterviewSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InterviewSessions to fetch.
     */
    orderBy?: InterviewSessionOrderByWithRelationInput | InterviewSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing InterviewSessions.
     */
    cursor?: InterviewSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InterviewSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InterviewSessions.
     */
    skip?: number
    distinct?: InterviewSessionScalarFieldEnum | InterviewSessionScalarFieldEnum[]
  }

  /**
   * InterviewSession create
   */
  export type InterviewSessionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InterviewSession
     */
    select?: InterviewSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InterviewSession
     */
    omit?: InterviewSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InterviewSessionInclude<ExtArgs> | null
    /**
     * The data needed to create a InterviewSession.
     */
    data: XOR<InterviewSessionCreateInput, InterviewSessionUncheckedCreateInput>
  }

  /**
   * InterviewSession createMany
   */
  export type InterviewSessionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many InterviewSessions.
     */
    data: InterviewSessionCreateManyInput | InterviewSessionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * InterviewSession createManyAndReturn
   */
  export type InterviewSessionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InterviewSession
     */
    select?: InterviewSessionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the InterviewSession
     */
    omit?: InterviewSessionOmit<ExtArgs> | null
    /**
     * The data used to create many InterviewSessions.
     */
    data: InterviewSessionCreateManyInput | InterviewSessionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * InterviewSession update
   */
  export type InterviewSessionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InterviewSession
     */
    select?: InterviewSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InterviewSession
     */
    omit?: InterviewSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InterviewSessionInclude<ExtArgs> | null
    /**
     * The data needed to update a InterviewSession.
     */
    data: XOR<InterviewSessionUpdateInput, InterviewSessionUncheckedUpdateInput>
    /**
     * Choose, which InterviewSession to update.
     */
    where: InterviewSessionWhereUniqueInput
  }

  /**
   * InterviewSession updateMany
   */
  export type InterviewSessionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update InterviewSessions.
     */
    data: XOR<InterviewSessionUpdateManyMutationInput, InterviewSessionUncheckedUpdateManyInput>
    /**
     * Filter which InterviewSessions to update
     */
    where?: InterviewSessionWhereInput
    /**
     * Limit how many InterviewSessions to update.
     */
    limit?: number
  }

  /**
   * InterviewSession updateManyAndReturn
   */
  export type InterviewSessionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InterviewSession
     */
    select?: InterviewSessionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the InterviewSession
     */
    omit?: InterviewSessionOmit<ExtArgs> | null
    /**
     * The data used to update InterviewSessions.
     */
    data: XOR<InterviewSessionUpdateManyMutationInput, InterviewSessionUncheckedUpdateManyInput>
    /**
     * Filter which InterviewSessions to update
     */
    where?: InterviewSessionWhereInput
    /**
     * Limit how many InterviewSessions to update.
     */
    limit?: number
  }

  /**
   * InterviewSession upsert
   */
  export type InterviewSessionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InterviewSession
     */
    select?: InterviewSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InterviewSession
     */
    omit?: InterviewSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InterviewSessionInclude<ExtArgs> | null
    /**
     * The filter to search for the InterviewSession to update in case it exists.
     */
    where: InterviewSessionWhereUniqueInput
    /**
     * In case the InterviewSession found by the `where` argument doesn't exist, create a new InterviewSession with this data.
     */
    create: XOR<InterviewSessionCreateInput, InterviewSessionUncheckedCreateInput>
    /**
     * In case the InterviewSession was found with the provided `where` argument, update it with this data.
     */
    update: XOR<InterviewSessionUpdateInput, InterviewSessionUncheckedUpdateInput>
  }

  /**
   * InterviewSession delete
   */
  export type InterviewSessionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InterviewSession
     */
    select?: InterviewSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InterviewSession
     */
    omit?: InterviewSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InterviewSessionInclude<ExtArgs> | null
    /**
     * Filter which InterviewSession to delete.
     */
    where: InterviewSessionWhereUniqueInput
  }

  /**
   * InterviewSession deleteMany
   */
  export type InterviewSessionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which InterviewSessions to delete
     */
    where?: InterviewSessionWhereInput
    /**
     * Limit how many InterviewSessions to delete.
     */
    limit?: number
  }

  /**
   * InterviewSession.questions
   */
  export type InterviewSession$questionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Question
     */
    select?: QuestionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Question
     */
    omit?: QuestionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuestionInclude<ExtArgs> | null
    where?: QuestionWhereInput
    orderBy?: QuestionOrderByWithRelationInput | QuestionOrderByWithRelationInput[]
    cursor?: QuestionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: QuestionScalarFieldEnum | QuestionScalarFieldEnum[]
  }

  /**
   * InterviewSession.analysis
   */
  export type InterviewSession$analysisArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Analysis
     */
    select?: AnalysisSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Analysis
     */
    omit?: AnalysisOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnalysisInclude<ExtArgs> | null
    where?: AnalysisWhereInput
  }

  /**
   * InterviewSession without action
   */
  export type InterviewSessionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InterviewSession
     */
    select?: InterviewSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InterviewSession
     */
    omit?: InterviewSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InterviewSessionInclude<ExtArgs> | null
  }


  /**
   * Model Question
   */

  export type AggregateQuestion = {
    _count: QuestionCountAggregateOutputType | null
    _avg: QuestionAvgAggregateOutputType | null
    _sum: QuestionSumAggregateOutputType | null
    _min: QuestionMinAggregateOutputType | null
    _max: QuestionMaxAggregateOutputType | null
  }

  export type QuestionAvgAggregateOutputType = {
    orderIndex: number | null
    timeTakenSecs: number | null
    evalScore: number | null
  }

  export type QuestionSumAggregateOutputType = {
    orderIndex: number | null
    timeTakenSecs: number | null
    evalScore: number | null
  }

  export type QuestionMinAggregateOutputType = {
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

  export type QuestionMaxAggregateOutputType = {
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

  export type QuestionCountAggregateOutputType = {
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


  export type QuestionAvgAggregateInputType = {
    orderIndex?: true
    timeTakenSecs?: true
    evalScore?: true
  }

  export type QuestionSumAggregateInputType = {
    orderIndex?: true
    timeTakenSecs?: true
    evalScore?: true
  }

  export type QuestionMinAggregateInputType = {
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

  export type QuestionMaxAggregateInputType = {
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

  export type QuestionCountAggregateInputType = {
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

  export type QuestionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Question to aggregate.
     */
    where?: QuestionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Questions to fetch.
     */
    orderBy?: QuestionOrderByWithRelationInput | QuestionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: QuestionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Questions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Questions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Questions
    **/
    _count?: true | QuestionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: QuestionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: QuestionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: QuestionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: QuestionMaxAggregateInputType
  }

  export type GetQuestionAggregateType<T extends QuestionAggregateArgs> = {
        [P in keyof T & keyof AggregateQuestion]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateQuestion[P]>
      : GetScalarType<T[P], AggregateQuestion[P]>
  }




  export type QuestionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: QuestionWhereInput
    orderBy?: QuestionOrderByWithAggregationInput | QuestionOrderByWithAggregationInput[]
    by: QuestionScalarFieldEnum[] | QuestionScalarFieldEnum
    having?: QuestionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: QuestionCountAggregateInputType | true
    _avg?: QuestionAvgAggregateInputType
    _sum?: QuestionSumAggregateInputType
    _min?: QuestionMinAggregateInputType
    _max?: QuestionMaxAggregateInputType
  }

  export type QuestionGroupByOutputType = {
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
    _count: QuestionCountAggregateOutputType | null
    _avg: QuestionAvgAggregateOutputType | null
    _sum: QuestionSumAggregateOutputType | null
    _min: QuestionMinAggregateOutputType | null
    _max: QuestionMaxAggregateOutputType | null
  }

  type GetQuestionGroupByPayload<T extends QuestionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<QuestionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof QuestionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], QuestionGroupByOutputType[P]>
            : GetScalarType<T[P], QuestionGroupByOutputType[P]>
        }
      >
    >


  export type QuestionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
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
    session?: boolean | InterviewSessionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["question"]>

  export type QuestionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
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
    session?: boolean | InterviewSessionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["question"]>

  export type QuestionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
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
    session?: boolean | InterviewSessionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["question"]>

  export type QuestionSelectScalar = {
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

  export type QuestionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "sessionId" | "orderIndex" | "questionText" | "questionType" | "difficulty" | "answerText" | "answeredAt" | "timeTakenSecs" | "evalScore" | "evalFeedback" | "evalStrengths" | "evalWeaknesses" | "betterAnswer", ExtArgs["result"]["question"]>
  export type QuestionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    session?: boolean | InterviewSessionDefaultArgs<ExtArgs>
  }
  export type QuestionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    session?: boolean | InterviewSessionDefaultArgs<ExtArgs>
  }
  export type QuestionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    session?: boolean | InterviewSessionDefaultArgs<ExtArgs>
  }

  export type $QuestionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Question"
    objects: {
      session: Prisma.$InterviewSessionPayload<ExtArgs>
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
    }, ExtArgs["result"]["question"]>
    composites: {}
  }

  type QuestionGetPayload<S extends boolean | null | undefined | QuestionDefaultArgs> = $Result.GetResult<Prisma.$QuestionPayload, S>

  type QuestionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<QuestionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: QuestionCountAggregateInputType | true
    }

  export interface QuestionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Question'], meta: { name: 'Question' } }
    /**
     * Find zero or one Question that matches the filter.
     * @param {QuestionFindUniqueArgs} args - Arguments to find a Question
     * @example
     * // Get one Question
     * const question = await prisma.question.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends QuestionFindUniqueArgs>(args: SelectSubset<T, QuestionFindUniqueArgs<ExtArgs>>): Prisma__QuestionClient<$Result.GetResult<Prisma.$QuestionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Question that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {QuestionFindUniqueOrThrowArgs} args - Arguments to find a Question
     * @example
     * // Get one Question
     * const question = await prisma.question.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends QuestionFindUniqueOrThrowArgs>(args: SelectSubset<T, QuestionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__QuestionClient<$Result.GetResult<Prisma.$QuestionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Question that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuestionFindFirstArgs} args - Arguments to find a Question
     * @example
     * // Get one Question
     * const question = await prisma.question.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends QuestionFindFirstArgs>(args?: SelectSubset<T, QuestionFindFirstArgs<ExtArgs>>): Prisma__QuestionClient<$Result.GetResult<Prisma.$QuestionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Question that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuestionFindFirstOrThrowArgs} args - Arguments to find a Question
     * @example
     * // Get one Question
     * const question = await prisma.question.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends QuestionFindFirstOrThrowArgs>(args?: SelectSubset<T, QuestionFindFirstOrThrowArgs<ExtArgs>>): Prisma__QuestionClient<$Result.GetResult<Prisma.$QuestionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Questions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuestionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Questions
     * const questions = await prisma.question.findMany()
     * 
     * // Get first 10 Questions
     * const questions = await prisma.question.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const questionWithIdOnly = await prisma.question.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends QuestionFindManyArgs>(args?: SelectSubset<T, QuestionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$QuestionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Question.
     * @param {QuestionCreateArgs} args - Arguments to create a Question.
     * @example
     * // Create one Question
     * const Question = await prisma.question.create({
     *   data: {
     *     // ... data to create a Question
     *   }
     * })
     * 
     */
    create<T extends QuestionCreateArgs>(args: SelectSubset<T, QuestionCreateArgs<ExtArgs>>): Prisma__QuestionClient<$Result.GetResult<Prisma.$QuestionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Questions.
     * @param {QuestionCreateManyArgs} args - Arguments to create many Questions.
     * @example
     * // Create many Questions
     * const question = await prisma.question.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends QuestionCreateManyArgs>(args?: SelectSubset<T, QuestionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Questions and returns the data saved in the database.
     * @param {QuestionCreateManyAndReturnArgs} args - Arguments to create many Questions.
     * @example
     * // Create many Questions
     * const question = await prisma.question.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Questions and only return the `id`
     * const questionWithIdOnly = await prisma.question.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends QuestionCreateManyAndReturnArgs>(args?: SelectSubset<T, QuestionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$QuestionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Question.
     * @param {QuestionDeleteArgs} args - Arguments to delete one Question.
     * @example
     * // Delete one Question
     * const Question = await prisma.question.delete({
     *   where: {
     *     // ... filter to delete one Question
     *   }
     * })
     * 
     */
    delete<T extends QuestionDeleteArgs>(args: SelectSubset<T, QuestionDeleteArgs<ExtArgs>>): Prisma__QuestionClient<$Result.GetResult<Prisma.$QuestionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Question.
     * @param {QuestionUpdateArgs} args - Arguments to update one Question.
     * @example
     * // Update one Question
     * const question = await prisma.question.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends QuestionUpdateArgs>(args: SelectSubset<T, QuestionUpdateArgs<ExtArgs>>): Prisma__QuestionClient<$Result.GetResult<Prisma.$QuestionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Questions.
     * @param {QuestionDeleteManyArgs} args - Arguments to filter Questions to delete.
     * @example
     * // Delete a few Questions
     * const { count } = await prisma.question.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends QuestionDeleteManyArgs>(args?: SelectSubset<T, QuestionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Questions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuestionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Questions
     * const question = await prisma.question.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends QuestionUpdateManyArgs>(args: SelectSubset<T, QuestionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Questions and returns the data updated in the database.
     * @param {QuestionUpdateManyAndReturnArgs} args - Arguments to update many Questions.
     * @example
     * // Update many Questions
     * const question = await prisma.question.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Questions and only return the `id`
     * const questionWithIdOnly = await prisma.question.updateManyAndReturn({
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
    updateManyAndReturn<T extends QuestionUpdateManyAndReturnArgs>(args: SelectSubset<T, QuestionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$QuestionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Question.
     * @param {QuestionUpsertArgs} args - Arguments to update or create a Question.
     * @example
     * // Update or create a Question
     * const question = await prisma.question.upsert({
     *   create: {
     *     // ... data to create a Question
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Question we want to update
     *   }
     * })
     */
    upsert<T extends QuestionUpsertArgs>(args: SelectSubset<T, QuestionUpsertArgs<ExtArgs>>): Prisma__QuestionClient<$Result.GetResult<Prisma.$QuestionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Questions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuestionCountArgs} args - Arguments to filter Questions to count.
     * @example
     * // Count the number of Questions
     * const count = await prisma.question.count({
     *   where: {
     *     // ... the filter for the Questions we want to count
     *   }
     * })
    **/
    count<T extends QuestionCountArgs>(
      args?: Subset<T, QuestionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], QuestionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Question.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuestionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends QuestionAggregateArgs>(args: Subset<T, QuestionAggregateArgs>): Prisma.PrismaPromise<GetQuestionAggregateType<T>>

    /**
     * Group by Question.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuestionGroupByArgs} args - Group by arguments.
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
      T extends QuestionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: QuestionGroupByArgs['orderBy'] }
        : { orderBy?: QuestionGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, QuestionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetQuestionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Question model
   */
  readonly fields: QuestionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Question.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__QuestionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    session<T extends InterviewSessionDefaultArgs<ExtArgs> = {}>(args?: Subset<T, InterviewSessionDefaultArgs<ExtArgs>>): Prisma__InterviewSessionClient<$Result.GetResult<Prisma.$InterviewSessionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the Question model
   */
  interface QuestionFieldRefs {
    readonly id: FieldRef<"Question", 'String'>
    readonly sessionId: FieldRef<"Question", 'String'>
    readonly orderIndex: FieldRef<"Question", 'Int'>
    readonly questionText: FieldRef<"Question", 'String'>
    readonly questionType: FieldRef<"Question", 'String'>
    readonly difficulty: FieldRef<"Question", 'String'>
    readonly answerText: FieldRef<"Question", 'String'>
    readonly answeredAt: FieldRef<"Question", 'DateTime'>
    readonly timeTakenSecs: FieldRef<"Question", 'Int'>
    readonly evalScore: FieldRef<"Question", 'Int'>
    readonly evalFeedback: FieldRef<"Question", 'String'>
    readonly evalStrengths: FieldRef<"Question", 'String[]'>
    readonly evalWeaknesses: FieldRef<"Question", 'String[]'>
    readonly betterAnswer: FieldRef<"Question", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Question findUnique
   */
  export type QuestionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Question
     */
    select?: QuestionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Question
     */
    omit?: QuestionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuestionInclude<ExtArgs> | null
    /**
     * Filter, which Question to fetch.
     */
    where: QuestionWhereUniqueInput
  }

  /**
   * Question findUniqueOrThrow
   */
  export type QuestionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Question
     */
    select?: QuestionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Question
     */
    omit?: QuestionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuestionInclude<ExtArgs> | null
    /**
     * Filter, which Question to fetch.
     */
    where: QuestionWhereUniqueInput
  }

  /**
   * Question findFirst
   */
  export type QuestionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Question
     */
    select?: QuestionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Question
     */
    omit?: QuestionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuestionInclude<ExtArgs> | null
    /**
     * Filter, which Question to fetch.
     */
    where?: QuestionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Questions to fetch.
     */
    orderBy?: QuestionOrderByWithRelationInput | QuestionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Questions.
     */
    cursor?: QuestionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Questions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Questions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Questions.
     */
    distinct?: QuestionScalarFieldEnum | QuestionScalarFieldEnum[]
  }

  /**
   * Question findFirstOrThrow
   */
  export type QuestionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Question
     */
    select?: QuestionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Question
     */
    omit?: QuestionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuestionInclude<ExtArgs> | null
    /**
     * Filter, which Question to fetch.
     */
    where?: QuestionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Questions to fetch.
     */
    orderBy?: QuestionOrderByWithRelationInput | QuestionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Questions.
     */
    cursor?: QuestionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Questions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Questions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Questions.
     */
    distinct?: QuestionScalarFieldEnum | QuestionScalarFieldEnum[]
  }

  /**
   * Question findMany
   */
  export type QuestionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Question
     */
    select?: QuestionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Question
     */
    omit?: QuestionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuestionInclude<ExtArgs> | null
    /**
     * Filter, which Questions to fetch.
     */
    where?: QuestionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Questions to fetch.
     */
    orderBy?: QuestionOrderByWithRelationInput | QuestionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Questions.
     */
    cursor?: QuestionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Questions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Questions.
     */
    skip?: number
    distinct?: QuestionScalarFieldEnum | QuestionScalarFieldEnum[]
  }

  /**
   * Question create
   */
  export type QuestionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Question
     */
    select?: QuestionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Question
     */
    omit?: QuestionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuestionInclude<ExtArgs> | null
    /**
     * The data needed to create a Question.
     */
    data: XOR<QuestionCreateInput, QuestionUncheckedCreateInput>
  }

  /**
   * Question createMany
   */
  export type QuestionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Questions.
     */
    data: QuestionCreateManyInput | QuestionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Question createManyAndReturn
   */
  export type QuestionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Question
     */
    select?: QuestionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Question
     */
    omit?: QuestionOmit<ExtArgs> | null
    /**
     * The data used to create many Questions.
     */
    data: QuestionCreateManyInput | QuestionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuestionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Question update
   */
  export type QuestionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Question
     */
    select?: QuestionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Question
     */
    omit?: QuestionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuestionInclude<ExtArgs> | null
    /**
     * The data needed to update a Question.
     */
    data: XOR<QuestionUpdateInput, QuestionUncheckedUpdateInput>
    /**
     * Choose, which Question to update.
     */
    where: QuestionWhereUniqueInput
  }

  /**
   * Question updateMany
   */
  export type QuestionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Questions.
     */
    data: XOR<QuestionUpdateManyMutationInput, QuestionUncheckedUpdateManyInput>
    /**
     * Filter which Questions to update
     */
    where?: QuestionWhereInput
    /**
     * Limit how many Questions to update.
     */
    limit?: number
  }

  /**
   * Question updateManyAndReturn
   */
  export type QuestionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Question
     */
    select?: QuestionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Question
     */
    omit?: QuestionOmit<ExtArgs> | null
    /**
     * The data used to update Questions.
     */
    data: XOR<QuestionUpdateManyMutationInput, QuestionUncheckedUpdateManyInput>
    /**
     * Filter which Questions to update
     */
    where?: QuestionWhereInput
    /**
     * Limit how many Questions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuestionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Question upsert
   */
  export type QuestionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Question
     */
    select?: QuestionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Question
     */
    omit?: QuestionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuestionInclude<ExtArgs> | null
    /**
     * The filter to search for the Question to update in case it exists.
     */
    where: QuestionWhereUniqueInput
    /**
     * In case the Question found by the `where` argument doesn't exist, create a new Question with this data.
     */
    create: XOR<QuestionCreateInput, QuestionUncheckedCreateInput>
    /**
     * In case the Question was found with the provided `where` argument, update it with this data.
     */
    update: XOR<QuestionUpdateInput, QuestionUncheckedUpdateInput>
  }

  /**
   * Question delete
   */
  export type QuestionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Question
     */
    select?: QuestionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Question
     */
    omit?: QuestionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuestionInclude<ExtArgs> | null
    /**
     * Filter which Question to delete.
     */
    where: QuestionWhereUniqueInput
  }

  /**
   * Question deleteMany
   */
  export type QuestionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Questions to delete
     */
    where?: QuestionWhereInput
    /**
     * Limit how many Questions to delete.
     */
    limit?: number
  }

  /**
   * Question without action
   */
  export type QuestionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Question
     */
    select?: QuestionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Question
     */
    omit?: QuestionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuestionInclude<ExtArgs> | null
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
   * Model AtsMatch
   */

  export type AggregateAtsMatch = {
    _count: AtsMatchCountAggregateOutputType | null
    _avg: AtsMatchAvgAggregateOutputType | null
    _sum: AtsMatchSumAggregateOutputType | null
    _min: AtsMatchMinAggregateOutputType | null
    _max: AtsMatchMaxAggregateOutputType | null
  }

  export type AtsMatchAvgAggregateOutputType = {
    matchScore: number | null
  }

  export type AtsMatchSumAggregateOutputType = {
    matchScore: number | null
  }

  export type AtsMatchMinAggregateOutputType = {
    id: string | null
    userId: string | null
    jobTitle: string | null
    companyName: string | null
    matchScore: number | null
    summary: string | null
    experienceMatch: string | null
    createdAt: Date | null
  }

  export type AtsMatchMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    jobTitle: string | null
    companyName: string | null
    matchScore: number | null
    summary: string | null
    experienceMatch: string | null
    createdAt: Date | null
  }

  export type AtsMatchCountAggregateOutputType = {
    id: number
    userId: number
    jobTitle: number
    companyName: number
    matchScore: number
    summary: number
    matchedSkills: number
    missingSkills: number
    experienceMatch: number
    atsWarnings: number
    bulletRewrites: number
    tailoredQuestions: number
    createdAt: number
    _all: number
  }


  export type AtsMatchAvgAggregateInputType = {
    matchScore?: true
  }

  export type AtsMatchSumAggregateInputType = {
    matchScore?: true
  }

  export type AtsMatchMinAggregateInputType = {
    id?: true
    userId?: true
    jobTitle?: true
    companyName?: true
    matchScore?: true
    summary?: true
    experienceMatch?: true
    createdAt?: true
  }

  export type AtsMatchMaxAggregateInputType = {
    id?: true
    userId?: true
    jobTitle?: true
    companyName?: true
    matchScore?: true
    summary?: true
    experienceMatch?: true
    createdAt?: true
  }

  export type AtsMatchCountAggregateInputType = {
    id?: true
    userId?: true
    jobTitle?: true
    companyName?: true
    matchScore?: true
    summary?: true
    matchedSkills?: true
    missingSkills?: true
    experienceMatch?: true
    atsWarnings?: true
    bulletRewrites?: true
    tailoredQuestions?: true
    createdAt?: true
    _all?: true
  }

  export type AtsMatchAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AtsMatch to aggregate.
     */
    where?: AtsMatchWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AtsMatches to fetch.
     */
    orderBy?: AtsMatchOrderByWithRelationInput | AtsMatchOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AtsMatchWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AtsMatches from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AtsMatches.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AtsMatches
    **/
    _count?: true | AtsMatchCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AtsMatchAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AtsMatchSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AtsMatchMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AtsMatchMaxAggregateInputType
  }

  export type GetAtsMatchAggregateType<T extends AtsMatchAggregateArgs> = {
        [P in keyof T & keyof AggregateAtsMatch]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAtsMatch[P]>
      : GetScalarType<T[P], AggregateAtsMatch[P]>
  }




  export type AtsMatchGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AtsMatchWhereInput
    orderBy?: AtsMatchOrderByWithAggregationInput | AtsMatchOrderByWithAggregationInput[]
    by: AtsMatchScalarFieldEnum[] | AtsMatchScalarFieldEnum
    having?: AtsMatchScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AtsMatchCountAggregateInputType | true
    _avg?: AtsMatchAvgAggregateInputType
    _sum?: AtsMatchSumAggregateInputType
    _min?: AtsMatchMinAggregateInputType
    _max?: AtsMatchMaxAggregateInputType
  }

  export type AtsMatchGroupByOutputType = {
    id: string
    userId: string
    jobTitle: string
    companyName: string | null
    matchScore: number
    summary: string
    matchedSkills: string[]
    missingSkills: string[]
    experienceMatch: string | null
    atsWarnings: string[]
    bulletRewrites: JsonValue
    tailoredQuestions: JsonValue
    createdAt: Date
    _count: AtsMatchCountAggregateOutputType | null
    _avg: AtsMatchAvgAggregateOutputType | null
    _sum: AtsMatchSumAggregateOutputType | null
    _min: AtsMatchMinAggregateOutputType | null
    _max: AtsMatchMaxAggregateOutputType | null
  }

  type GetAtsMatchGroupByPayload<T extends AtsMatchGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AtsMatchGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AtsMatchGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AtsMatchGroupByOutputType[P]>
            : GetScalarType<T[P], AtsMatchGroupByOutputType[P]>
        }
      >
    >


  export type AtsMatchSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    jobTitle?: boolean
    companyName?: boolean
    matchScore?: boolean
    summary?: boolean
    matchedSkills?: boolean
    missingSkills?: boolean
    experienceMatch?: boolean
    atsWarnings?: boolean
    bulletRewrites?: boolean
    tailoredQuestions?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["atsMatch"]>

  export type AtsMatchSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    jobTitle?: boolean
    companyName?: boolean
    matchScore?: boolean
    summary?: boolean
    matchedSkills?: boolean
    missingSkills?: boolean
    experienceMatch?: boolean
    atsWarnings?: boolean
    bulletRewrites?: boolean
    tailoredQuestions?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["atsMatch"]>

  export type AtsMatchSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    jobTitle?: boolean
    companyName?: boolean
    matchScore?: boolean
    summary?: boolean
    matchedSkills?: boolean
    missingSkills?: boolean
    experienceMatch?: boolean
    atsWarnings?: boolean
    bulletRewrites?: boolean
    tailoredQuestions?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["atsMatch"]>

  export type AtsMatchSelectScalar = {
    id?: boolean
    userId?: boolean
    jobTitle?: boolean
    companyName?: boolean
    matchScore?: boolean
    summary?: boolean
    matchedSkills?: boolean
    missingSkills?: boolean
    experienceMatch?: boolean
    atsWarnings?: boolean
    bulletRewrites?: boolean
    tailoredQuestions?: boolean
    createdAt?: boolean
  }

  export type AtsMatchOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "jobTitle" | "companyName" | "matchScore" | "summary" | "matchedSkills" | "missingSkills" | "experienceMatch" | "atsWarnings" | "bulletRewrites" | "tailoredQuestions" | "createdAt", ExtArgs["result"]["atsMatch"]>

  export type $AtsMatchPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AtsMatch"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      jobTitle: string
      companyName: string | null
      matchScore: number
      summary: string
      matchedSkills: string[]
      missingSkills: string[]
      experienceMatch: string | null
      atsWarnings: string[]
      bulletRewrites: Prisma.JsonValue
      tailoredQuestions: Prisma.JsonValue
      createdAt: Date
    }, ExtArgs["result"]["atsMatch"]>
    composites: {}
  }

  type AtsMatchGetPayload<S extends boolean | null | undefined | AtsMatchDefaultArgs> = $Result.GetResult<Prisma.$AtsMatchPayload, S>

  type AtsMatchCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AtsMatchFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AtsMatchCountAggregateInputType | true
    }

  export interface AtsMatchDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AtsMatch'], meta: { name: 'AtsMatch' } }
    /**
     * Find zero or one AtsMatch that matches the filter.
     * @param {AtsMatchFindUniqueArgs} args - Arguments to find a AtsMatch
     * @example
     * // Get one AtsMatch
     * const atsMatch = await prisma.atsMatch.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AtsMatchFindUniqueArgs>(args: SelectSubset<T, AtsMatchFindUniqueArgs<ExtArgs>>): Prisma__AtsMatchClient<$Result.GetResult<Prisma.$AtsMatchPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one AtsMatch that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AtsMatchFindUniqueOrThrowArgs} args - Arguments to find a AtsMatch
     * @example
     * // Get one AtsMatch
     * const atsMatch = await prisma.atsMatch.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AtsMatchFindUniqueOrThrowArgs>(args: SelectSubset<T, AtsMatchFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AtsMatchClient<$Result.GetResult<Prisma.$AtsMatchPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AtsMatch that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AtsMatchFindFirstArgs} args - Arguments to find a AtsMatch
     * @example
     * // Get one AtsMatch
     * const atsMatch = await prisma.atsMatch.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AtsMatchFindFirstArgs>(args?: SelectSubset<T, AtsMatchFindFirstArgs<ExtArgs>>): Prisma__AtsMatchClient<$Result.GetResult<Prisma.$AtsMatchPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AtsMatch that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AtsMatchFindFirstOrThrowArgs} args - Arguments to find a AtsMatch
     * @example
     * // Get one AtsMatch
     * const atsMatch = await prisma.atsMatch.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AtsMatchFindFirstOrThrowArgs>(args?: SelectSubset<T, AtsMatchFindFirstOrThrowArgs<ExtArgs>>): Prisma__AtsMatchClient<$Result.GetResult<Prisma.$AtsMatchPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more AtsMatches that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AtsMatchFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AtsMatches
     * const atsMatches = await prisma.atsMatch.findMany()
     * 
     * // Get first 10 AtsMatches
     * const atsMatches = await prisma.atsMatch.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const atsMatchWithIdOnly = await prisma.atsMatch.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AtsMatchFindManyArgs>(args?: SelectSubset<T, AtsMatchFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AtsMatchPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a AtsMatch.
     * @param {AtsMatchCreateArgs} args - Arguments to create a AtsMatch.
     * @example
     * // Create one AtsMatch
     * const AtsMatch = await prisma.atsMatch.create({
     *   data: {
     *     // ... data to create a AtsMatch
     *   }
     * })
     * 
     */
    create<T extends AtsMatchCreateArgs>(args: SelectSubset<T, AtsMatchCreateArgs<ExtArgs>>): Prisma__AtsMatchClient<$Result.GetResult<Prisma.$AtsMatchPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many AtsMatches.
     * @param {AtsMatchCreateManyArgs} args - Arguments to create many AtsMatches.
     * @example
     * // Create many AtsMatches
     * const atsMatch = await prisma.atsMatch.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AtsMatchCreateManyArgs>(args?: SelectSubset<T, AtsMatchCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AtsMatches and returns the data saved in the database.
     * @param {AtsMatchCreateManyAndReturnArgs} args - Arguments to create many AtsMatches.
     * @example
     * // Create many AtsMatches
     * const atsMatch = await prisma.atsMatch.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AtsMatches and only return the `id`
     * const atsMatchWithIdOnly = await prisma.atsMatch.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AtsMatchCreateManyAndReturnArgs>(args?: SelectSubset<T, AtsMatchCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AtsMatchPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a AtsMatch.
     * @param {AtsMatchDeleteArgs} args - Arguments to delete one AtsMatch.
     * @example
     * // Delete one AtsMatch
     * const AtsMatch = await prisma.atsMatch.delete({
     *   where: {
     *     // ... filter to delete one AtsMatch
     *   }
     * })
     * 
     */
    delete<T extends AtsMatchDeleteArgs>(args: SelectSubset<T, AtsMatchDeleteArgs<ExtArgs>>): Prisma__AtsMatchClient<$Result.GetResult<Prisma.$AtsMatchPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one AtsMatch.
     * @param {AtsMatchUpdateArgs} args - Arguments to update one AtsMatch.
     * @example
     * // Update one AtsMatch
     * const atsMatch = await prisma.atsMatch.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AtsMatchUpdateArgs>(args: SelectSubset<T, AtsMatchUpdateArgs<ExtArgs>>): Prisma__AtsMatchClient<$Result.GetResult<Prisma.$AtsMatchPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more AtsMatches.
     * @param {AtsMatchDeleteManyArgs} args - Arguments to filter AtsMatches to delete.
     * @example
     * // Delete a few AtsMatches
     * const { count } = await prisma.atsMatch.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AtsMatchDeleteManyArgs>(args?: SelectSubset<T, AtsMatchDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AtsMatches.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AtsMatchUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AtsMatches
     * const atsMatch = await prisma.atsMatch.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AtsMatchUpdateManyArgs>(args: SelectSubset<T, AtsMatchUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AtsMatches and returns the data updated in the database.
     * @param {AtsMatchUpdateManyAndReturnArgs} args - Arguments to update many AtsMatches.
     * @example
     * // Update many AtsMatches
     * const atsMatch = await prisma.atsMatch.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more AtsMatches and only return the `id`
     * const atsMatchWithIdOnly = await prisma.atsMatch.updateManyAndReturn({
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
    updateManyAndReturn<T extends AtsMatchUpdateManyAndReturnArgs>(args: SelectSubset<T, AtsMatchUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AtsMatchPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one AtsMatch.
     * @param {AtsMatchUpsertArgs} args - Arguments to update or create a AtsMatch.
     * @example
     * // Update or create a AtsMatch
     * const atsMatch = await prisma.atsMatch.upsert({
     *   create: {
     *     // ... data to create a AtsMatch
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AtsMatch we want to update
     *   }
     * })
     */
    upsert<T extends AtsMatchUpsertArgs>(args: SelectSubset<T, AtsMatchUpsertArgs<ExtArgs>>): Prisma__AtsMatchClient<$Result.GetResult<Prisma.$AtsMatchPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of AtsMatches.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AtsMatchCountArgs} args - Arguments to filter AtsMatches to count.
     * @example
     * // Count the number of AtsMatches
     * const count = await prisma.atsMatch.count({
     *   where: {
     *     // ... the filter for the AtsMatches we want to count
     *   }
     * })
    **/
    count<T extends AtsMatchCountArgs>(
      args?: Subset<T, AtsMatchCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AtsMatchCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AtsMatch.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AtsMatchAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends AtsMatchAggregateArgs>(args: Subset<T, AtsMatchAggregateArgs>): Prisma.PrismaPromise<GetAtsMatchAggregateType<T>>

    /**
     * Group by AtsMatch.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AtsMatchGroupByArgs} args - Group by arguments.
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
      T extends AtsMatchGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AtsMatchGroupByArgs['orderBy'] }
        : { orderBy?: AtsMatchGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, AtsMatchGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAtsMatchGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AtsMatch model
   */
  readonly fields: AtsMatchFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AtsMatch.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AtsMatchClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
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
   * Fields of the AtsMatch model
   */
  interface AtsMatchFieldRefs {
    readonly id: FieldRef<"AtsMatch", 'String'>
    readonly userId: FieldRef<"AtsMatch", 'String'>
    readonly jobTitle: FieldRef<"AtsMatch", 'String'>
    readonly companyName: FieldRef<"AtsMatch", 'String'>
    readonly matchScore: FieldRef<"AtsMatch", 'Int'>
    readonly summary: FieldRef<"AtsMatch", 'String'>
    readonly matchedSkills: FieldRef<"AtsMatch", 'String[]'>
    readonly missingSkills: FieldRef<"AtsMatch", 'String[]'>
    readonly experienceMatch: FieldRef<"AtsMatch", 'String'>
    readonly atsWarnings: FieldRef<"AtsMatch", 'String[]'>
    readonly bulletRewrites: FieldRef<"AtsMatch", 'Json'>
    readonly tailoredQuestions: FieldRef<"AtsMatch", 'Json'>
    readonly createdAt: FieldRef<"AtsMatch", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AtsMatch findUnique
   */
  export type AtsMatchFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AtsMatch
     */
    select?: AtsMatchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AtsMatch
     */
    omit?: AtsMatchOmit<ExtArgs> | null
    /**
     * Filter, which AtsMatch to fetch.
     */
    where: AtsMatchWhereUniqueInput
  }

  /**
   * AtsMatch findUniqueOrThrow
   */
  export type AtsMatchFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AtsMatch
     */
    select?: AtsMatchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AtsMatch
     */
    omit?: AtsMatchOmit<ExtArgs> | null
    /**
     * Filter, which AtsMatch to fetch.
     */
    where: AtsMatchWhereUniqueInput
  }

  /**
   * AtsMatch findFirst
   */
  export type AtsMatchFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AtsMatch
     */
    select?: AtsMatchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AtsMatch
     */
    omit?: AtsMatchOmit<ExtArgs> | null
    /**
     * Filter, which AtsMatch to fetch.
     */
    where?: AtsMatchWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AtsMatches to fetch.
     */
    orderBy?: AtsMatchOrderByWithRelationInput | AtsMatchOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AtsMatches.
     */
    cursor?: AtsMatchWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AtsMatches from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AtsMatches.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AtsMatches.
     */
    distinct?: AtsMatchScalarFieldEnum | AtsMatchScalarFieldEnum[]
  }

  /**
   * AtsMatch findFirstOrThrow
   */
  export type AtsMatchFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AtsMatch
     */
    select?: AtsMatchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AtsMatch
     */
    omit?: AtsMatchOmit<ExtArgs> | null
    /**
     * Filter, which AtsMatch to fetch.
     */
    where?: AtsMatchWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AtsMatches to fetch.
     */
    orderBy?: AtsMatchOrderByWithRelationInput | AtsMatchOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AtsMatches.
     */
    cursor?: AtsMatchWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AtsMatches from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AtsMatches.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AtsMatches.
     */
    distinct?: AtsMatchScalarFieldEnum | AtsMatchScalarFieldEnum[]
  }

  /**
   * AtsMatch findMany
   */
  export type AtsMatchFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AtsMatch
     */
    select?: AtsMatchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AtsMatch
     */
    omit?: AtsMatchOmit<ExtArgs> | null
    /**
     * Filter, which AtsMatches to fetch.
     */
    where?: AtsMatchWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AtsMatches to fetch.
     */
    orderBy?: AtsMatchOrderByWithRelationInput | AtsMatchOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AtsMatches.
     */
    cursor?: AtsMatchWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AtsMatches from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AtsMatches.
     */
    skip?: number
    distinct?: AtsMatchScalarFieldEnum | AtsMatchScalarFieldEnum[]
  }

  /**
   * AtsMatch create
   */
  export type AtsMatchCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AtsMatch
     */
    select?: AtsMatchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AtsMatch
     */
    omit?: AtsMatchOmit<ExtArgs> | null
    /**
     * The data needed to create a AtsMatch.
     */
    data: XOR<AtsMatchCreateInput, AtsMatchUncheckedCreateInput>
  }

  /**
   * AtsMatch createMany
   */
  export type AtsMatchCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AtsMatches.
     */
    data: AtsMatchCreateManyInput | AtsMatchCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AtsMatch createManyAndReturn
   */
  export type AtsMatchCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AtsMatch
     */
    select?: AtsMatchSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AtsMatch
     */
    omit?: AtsMatchOmit<ExtArgs> | null
    /**
     * The data used to create many AtsMatches.
     */
    data: AtsMatchCreateManyInput | AtsMatchCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AtsMatch update
   */
  export type AtsMatchUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AtsMatch
     */
    select?: AtsMatchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AtsMatch
     */
    omit?: AtsMatchOmit<ExtArgs> | null
    /**
     * The data needed to update a AtsMatch.
     */
    data: XOR<AtsMatchUpdateInput, AtsMatchUncheckedUpdateInput>
    /**
     * Choose, which AtsMatch to update.
     */
    where: AtsMatchWhereUniqueInput
  }

  /**
   * AtsMatch updateMany
   */
  export type AtsMatchUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AtsMatches.
     */
    data: XOR<AtsMatchUpdateManyMutationInput, AtsMatchUncheckedUpdateManyInput>
    /**
     * Filter which AtsMatches to update
     */
    where?: AtsMatchWhereInput
    /**
     * Limit how many AtsMatches to update.
     */
    limit?: number
  }

  /**
   * AtsMatch updateManyAndReturn
   */
  export type AtsMatchUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AtsMatch
     */
    select?: AtsMatchSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AtsMatch
     */
    omit?: AtsMatchOmit<ExtArgs> | null
    /**
     * The data used to update AtsMatches.
     */
    data: XOR<AtsMatchUpdateManyMutationInput, AtsMatchUncheckedUpdateManyInput>
    /**
     * Filter which AtsMatches to update
     */
    where?: AtsMatchWhereInput
    /**
     * Limit how many AtsMatches to update.
     */
    limit?: number
  }

  /**
   * AtsMatch upsert
   */
  export type AtsMatchUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AtsMatch
     */
    select?: AtsMatchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AtsMatch
     */
    omit?: AtsMatchOmit<ExtArgs> | null
    /**
     * The filter to search for the AtsMatch to update in case it exists.
     */
    where: AtsMatchWhereUniqueInput
    /**
     * In case the AtsMatch found by the `where` argument doesn't exist, create a new AtsMatch with this data.
     */
    create: XOR<AtsMatchCreateInput, AtsMatchUncheckedCreateInput>
    /**
     * In case the AtsMatch was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AtsMatchUpdateInput, AtsMatchUncheckedUpdateInput>
  }

  /**
   * AtsMatch delete
   */
  export type AtsMatchDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AtsMatch
     */
    select?: AtsMatchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AtsMatch
     */
    omit?: AtsMatchOmit<ExtArgs> | null
    /**
     * Filter which AtsMatch to delete.
     */
    where: AtsMatchWhereUniqueInput
  }

  /**
   * AtsMatch deleteMany
   */
  export type AtsMatchDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AtsMatches to delete
     */
    where?: AtsMatchWhereInput
    /**
     * Limit how many AtsMatches to delete.
     */
    limit?: number
  }

  /**
   * AtsMatch without action
   */
  export type AtsMatchDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AtsMatch
     */
    select?: AtsMatchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AtsMatch
     */
    omit?: AtsMatchOmit<ExtArgs> | null
  }


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


  export const InterviewSessionScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
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
    createdAt: 'createdAt',
    mode: 'mode',
    hintCount: 'hintCount',
    testCasesPassed: 'testCasesPassed',
    selectedLanguage: 'selectedLanguage',
    isDeleted: 'isDeleted'
  };

  export type InterviewSessionScalarFieldEnum = (typeof InterviewSessionScalarFieldEnum)[keyof typeof InterviewSessionScalarFieldEnum]


  export const QuestionScalarFieldEnum: {
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

  export type QuestionScalarFieldEnum = (typeof QuestionScalarFieldEnum)[keyof typeof QuestionScalarFieldEnum]


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


  export const AtsMatchScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    jobTitle: 'jobTitle',
    companyName: 'companyName',
    matchScore: 'matchScore',
    summary: 'summary',
    matchedSkills: 'matchedSkills',
    missingSkills: 'missingSkills',
    experienceMatch: 'experienceMatch',
    atsWarnings: 'atsWarnings',
    bulletRewrites: 'bulletRewrites',
    tailoredQuestions: 'tailoredQuestions',
    createdAt: 'createdAt'
  };

  export type AtsMatchScalarFieldEnum = (typeof AtsMatchScalarFieldEnum)[keyof typeof AtsMatchScalarFieldEnum]


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
   * Reference to a field of type 'ReadinessVerdict'
   */
  export type EnumReadinessVerdictFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ReadinessVerdict'>
    


  /**
   * Reference to a field of type 'ReadinessVerdict[]'
   */
  export type ListEnumReadinessVerdictFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ReadinessVerdict[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'ExperienceLevel'
   */
  export type EnumExperienceLevelFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ExperienceLevel'>
    


  /**
   * Reference to a field of type 'ExperienceLevel[]'
   */
  export type ListEnumExperienceLevelFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ExperienceLevel[]'>
    


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
    readinessVerdict?: EnumReadinessVerdictFilter<"Analysis"> | $Enums.ReadinessVerdict
    createdAt?: DateTimeFilter<"Analysis"> | Date | string
    session?: XOR<InterviewSessionScalarRelationFilter, InterviewSessionWhereInput>
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
    session?: InterviewSessionOrderByWithRelationInput
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
    readinessVerdict?: EnumReadinessVerdictFilter<"Analysis"> | $Enums.ReadinessVerdict
    createdAt?: DateTimeFilter<"Analysis"> | Date | string
    session?: XOR<InterviewSessionScalarRelationFilter, InterviewSessionWhereInput>
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
    readinessVerdict?: EnumReadinessVerdictWithAggregatesFilter<"Analysis"> | $Enums.ReadinessVerdict
    createdAt?: DateTimeWithAggregatesFilter<"Analysis"> | Date | string
  }

  export type InterviewSessionWhereInput = {
    AND?: InterviewSessionWhereInput | InterviewSessionWhereInput[]
    OR?: InterviewSessionWhereInput[]
    NOT?: InterviewSessionWhereInput | InterviewSessionWhereInput[]
    id?: StringFilter<"InterviewSession"> | string
    userId?: StringFilter<"InterviewSession"> | string
    interviewType?: StringFilter<"InterviewSession"> | string
    targetRole?: StringFilter<"InterviewSession"> | string
    targetCompany?: StringNullableFilter<"InterviewSession"> | string | null
    industry?: StringFilter<"InterviewSession"> | string
    experienceLevel?: EnumExperienceLevelFilter<"InterviewSession"> | $Enums.ExperienceLevel
    focusAreas?: StringNullableListFilter<"InterviewSession">
    interviewGoal?: StringNullableFilter<"InterviewSession"> | string | null
    durationMins?: IntFilter<"InterviewSession"> | number
    status?: StringFilter<"InterviewSession"> | string
    startedAt?: DateTimeNullableFilter<"InterviewSession"> | Date | string | null
    completedAt?: DateTimeNullableFilter<"InterviewSession"> | Date | string | null
    createdAt?: DateTimeFilter<"InterviewSession"> | Date | string
    mode?: StringFilter<"InterviewSession"> | string
    hintCount?: IntFilter<"InterviewSession"> | number
    testCasesPassed?: IntNullableFilter<"InterviewSession"> | number | null
    selectedLanguage?: StringNullableFilter<"InterviewSession"> | string | null
    isDeleted?: BoolFilter<"InterviewSession"> | boolean
    questions?: QuestionListRelationFilter
    analysis?: XOR<AnalysisNullableScalarRelationFilter, AnalysisWhereInput> | null
  }

  export type InterviewSessionOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
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
    mode?: SortOrder
    hintCount?: SortOrder
    testCasesPassed?: SortOrderInput | SortOrder
    selectedLanguage?: SortOrderInput | SortOrder
    isDeleted?: SortOrder
    questions?: QuestionOrderByRelationAggregateInput
    analysis?: AnalysisOrderByWithRelationInput
  }

  export type InterviewSessionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: InterviewSessionWhereInput | InterviewSessionWhereInput[]
    OR?: InterviewSessionWhereInput[]
    NOT?: InterviewSessionWhereInput | InterviewSessionWhereInput[]
    userId?: StringFilter<"InterviewSession"> | string
    interviewType?: StringFilter<"InterviewSession"> | string
    targetRole?: StringFilter<"InterviewSession"> | string
    targetCompany?: StringNullableFilter<"InterviewSession"> | string | null
    industry?: StringFilter<"InterviewSession"> | string
    experienceLevel?: EnumExperienceLevelFilter<"InterviewSession"> | $Enums.ExperienceLevel
    focusAreas?: StringNullableListFilter<"InterviewSession">
    interviewGoal?: StringNullableFilter<"InterviewSession"> | string | null
    durationMins?: IntFilter<"InterviewSession"> | number
    status?: StringFilter<"InterviewSession"> | string
    startedAt?: DateTimeNullableFilter<"InterviewSession"> | Date | string | null
    completedAt?: DateTimeNullableFilter<"InterviewSession"> | Date | string | null
    createdAt?: DateTimeFilter<"InterviewSession"> | Date | string
    mode?: StringFilter<"InterviewSession"> | string
    hintCount?: IntFilter<"InterviewSession"> | number
    testCasesPassed?: IntNullableFilter<"InterviewSession"> | number | null
    selectedLanguage?: StringNullableFilter<"InterviewSession"> | string | null
    isDeleted?: BoolFilter<"InterviewSession"> | boolean
    questions?: QuestionListRelationFilter
    analysis?: XOR<AnalysisNullableScalarRelationFilter, AnalysisWhereInput> | null
  }, "id">

  export type InterviewSessionOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
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
    mode?: SortOrder
    hintCount?: SortOrder
    testCasesPassed?: SortOrderInput | SortOrder
    selectedLanguage?: SortOrderInput | SortOrder
    isDeleted?: SortOrder
    _count?: InterviewSessionCountOrderByAggregateInput
    _avg?: InterviewSessionAvgOrderByAggregateInput
    _max?: InterviewSessionMaxOrderByAggregateInput
    _min?: InterviewSessionMinOrderByAggregateInput
    _sum?: InterviewSessionSumOrderByAggregateInput
  }

  export type InterviewSessionScalarWhereWithAggregatesInput = {
    AND?: InterviewSessionScalarWhereWithAggregatesInput | InterviewSessionScalarWhereWithAggregatesInput[]
    OR?: InterviewSessionScalarWhereWithAggregatesInput[]
    NOT?: InterviewSessionScalarWhereWithAggregatesInput | InterviewSessionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"InterviewSession"> | string
    userId?: StringWithAggregatesFilter<"InterviewSession"> | string
    interviewType?: StringWithAggregatesFilter<"InterviewSession"> | string
    targetRole?: StringWithAggregatesFilter<"InterviewSession"> | string
    targetCompany?: StringNullableWithAggregatesFilter<"InterviewSession"> | string | null
    industry?: StringWithAggregatesFilter<"InterviewSession"> | string
    experienceLevel?: EnumExperienceLevelWithAggregatesFilter<"InterviewSession"> | $Enums.ExperienceLevel
    focusAreas?: StringNullableListFilter<"InterviewSession">
    interviewGoal?: StringNullableWithAggregatesFilter<"InterviewSession"> | string | null
    durationMins?: IntWithAggregatesFilter<"InterviewSession"> | number
    status?: StringWithAggregatesFilter<"InterviewSession"> | string
    startedAt?: DateTimeNullableWithAggregatesFilter<"InterviewSession"> | Date | string | null
    completedAt?: DateTimeNullableWithAggregatesFilter<"InterviewSession"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"InterviewSession"> | Date | string
    mode?: StringWithAggregatesFilter<"InterviewSession"> | string
    hintCount?: IntWithAggregatesFilter<"InterviewSession"> | number
    testCasesPassed?: IntNullableWithAggregatesFilter<"InterviewSession"> | number | null
    selectedLanguage?: StringNullableWithAggregatesFilter<"InterviewSession"> | string | null
    isDeleted?: BoolWithAggregatesFilter<"InterviewSession"> | boolean
  }

  export type QuestionWhereInput = {
    AND?: QuestionWhereInput | QuestionWhereInput[]
    OR?: QuestionWhereInput[]
    NOT?: QuestionWhereInput | QuestionWhereInput[]
    id?: StringFilter<"Question"> | string
    sessionId?: StringFilter<"Question"> | string
    orderIndex?: IntFilter<"Question"> | number
    questionText?: StringFilter<"Question"> | string
    questionType?: StringFilter<"Question"> | string
    difficulty?: StringFilter<"Question"> | string
    answerText?: StringNullableFilter<"Question"> | string | null
    answeredAt?: DateTimeNullableFilter<"Question"> | Date | string | null
    timeTakenSecs?: IntNullableFilter<"Question"> | number | null
    evalScore?: IntNullableFilter<"Question"> | number | null
    evalFeedback?: StringNullableFilter<"Question"> | string | null
    evalStrengths?: StringNullableListFilter<"Question">
    evalWeaknesses?: StringNullableListFilter<"Question">
    betterAnswer?: StringNullableFilter<"Question"> | string | null
    session?: XOR<InterviewSessionScalarRelationFilter, InterviewSessionWhereInput>
  }

  export type QuestionOrderByWithRelationInput = {
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
    session?: InterviewSessionOrderByWithRelationInput
  }

  export type QuestionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: QuestionWhereInput | QuestionWhereInput[]
    OR?: QuestionWhereInput[]
    NOT?: QuestionWhereInput | QuestionWhereInput[]
    sessionId?: StringFilter<"Question"> | string
    orderIndex?: IntFilter<"Question"> | number
    questionText?: StringFilter<"Question"> | string
    questionType?: StringFilter<"Question"> | string
    difficulty?: StringFilter<"Question"> | string
    answerText?: StringNullableFilter<"Question"> | string | null
    answeredAt?: DateTimeNullableFilter<"Question"> | Date | string | null
    timeTakenSecs?: IntNullableFilter<"Question"> | number | null
    evalScore?: IntNullableFilter<"Question"> | number | null
    evalFeedback?: StringNullableFilter<"Question"> | string | null
    evalStrengths?: StringNullableListFilter<"Question">
    evalWeaknesses?: StringNullableListFilter<"Question">
    betterAnswer?: StringNullableFilter<"Question"> | string | null
    session?: XOR<InterviewSessionScalarRelationFilter, InterviewSessionWhereInput>
  }, "id">

  export type QuestionOrderByWithAggregationInput = {
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
    _count?: QuestionCountOrderByAggregateInput
    _avg?: QuestionAvgOrderByAggregateInput
    _max?: QuestionMaxOrderByAggregateInput
    _min?: QuestionMinOrderByAggregateInput
    _sum?: QuestionSumOrderByAggregateInput
  }

  export type QuestionScalarWhereWithAggregatesInput = {
    AND?: QuestionScalarWhereWithAggregatesInput | QuestionScalarWhereWithAggregatesInput[]
    OR?: QuestionScalarWhereWithAggregatesInput[]
    NOT?: QuestionScalarWhereWithAggregatesInput | QuestionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Question"> | string
    sessionId?: StringWithAggregatesFilter<"Question"> | string
    orderIndex?: IntWithAggregatesFilter<"Question"> | number
    questionText?: StringWithAggregatesFilter<"Question"> | string
    questionType?: StringWithAggregatesFilter<"Question"> | string
    difficulty?: StringWithAggregatesFilter<"Question"> | string
    answerText?: StringNullableWithAggregatesFilter<"Question"> | string | null
    answeredAt?: DateTimeNullableWithAggregatesFilter<"Question"> | Date | string | null
    timeTakenSecs?: IntNullableWithAggregatesFilter<"Question"> | number | null
    evalScore?: IntNullableWithAggregatesFilter<"Question"> | number | null
    evalFeedback?: StringNullableWithAggregatesFilter<"Question"> | string | null
    evalStrengths?: StringNullableListFilter<"Question">
    evalWeaknesses?: StringNullableListFilter<"Question">
    betterAnswer?: StringNullableWithAggregatesFilter<"Question"> | string | null
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

  export type AtsMatchWhereInput = {
    AND?: AtsMatchWhereInput | AtsMatchWhereInput[]
    OR?: AtsMatchWhereInput[]
    NOT?: AtsMatchWhereInput | AtsMatchWhereInput[]
    id?: StringFilter<"AtsMatch"> | string
    userId?: StringFilter<"AtsMatch"> | string
    jobTitle?: StringFilter<"AtsMatch"> | string
    companyName?: StringNullableFilter<"AtsMatch"> | string | null
    matchScore?: IntFilter<"AtsMatch"> | number
    summary?: StringFilter<"AtsMatch"> | string
    matchedSkills?: StringNullableListFilter<"AtsMatch">
    missingSkills?: StringNullableListFilter<"AtsMatch">
    experienceMatch?: StringNullableFilter<"AtsMatch"> | string | null
    atsWarnings?: StringNullableListFilter<"AtsMatch">
    bulletRewrites?: JsonFilter<"AtsMatch">
    tailoredQuestions?: JsonFilter<"AtsMatch">
    createdAt?: DateTimeFilter<"AtsMatch"> | Date | string
  }

  export type AtsMatchOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    jobTitle?: SortOrder
    companyName?: SortOrderInput | SortOrder
    matchScore?: SortOrder
    summary?: SortOrder
    matchedSkills?: SortOrder
    missingSkills?: SortOrder
    experienceMatch?: SortOrderInput | SortOrder
    atsWarnings?: SortOrder
    bulletRewrites?: SortOrder
    tailoredQuestions?: SortOrder
    createdAt?: SortOrder
  }

  export type AtsMatchWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AtsMatchWhereInput | AtsMatchWhereInput[]
    OR?: AtsMatchWhereInput[]
    NOT?: AtsMatchWhereInput | AtsMatchWhereInput[]
    userId?: StringFilter<"AtsMatch"> | string
    jobTitle?: StringFilter<"AtsMatch"> | string
    companyName?: StringNullableFilter<"AtsMatch"> | string | null
    matchScore?: IntFilter<"AtsMatch"> | number
    summary?: StringFilter<"AtsMatch"> | string
    matchedSkills?: StringNullableListFilter<"AtsMatch">
    missingSkills?: StringNullableListFilter<"AtsMatch">
    experienceMatch?: StringNullableFilter<"AtsMatch"> | string | null
    atsWarnings?: StringNullableListFilter<"AtsMatch">
    bulletRewrites?: JsonFilter<"AtsMatch">
    tailoredQuestions?: JsonFilter<"AtsMatch">
    createdAt?: DateTimeFilter<"AtsMatch"> | Date | string
  }, "id">

  export type AtsMatchOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    jobTitle?: SortOrder
    companyName?: SortOrderInput | SortOrder
    matchScore?: SortOrder
    summary?: SortOrder
    matchedSkills?: SortOrder
    missingSkills?: SortOrder
    experienceMatch?: SortOrderInput | SortOrder
    atsWarnings?: SortOrder
    bulletRewrites?: SortOrder
    tailoredQuestions?: SortOrder
    createdAt?: SortOrder
    _count?: AtsMatchCountOrderByAggregateInput
    _avg?: AtsMatchAvgOrderByAggregateInput
    _max?: AtsMatchMaxOrderByAggregateInput
    _min?: AtsMatchMinOrderByAggregateInput
    _sum?: AtsMatchSumOrderByAggregateInput
  }

  export type AtsMatchScalarWhereWithAggregatesInput = {
    AND?: AtsMatchScalarWhereWithAggregatesInput | AtsMatchScalarWhereWithAggregatesInput[]
    OR?: AtsMatchScalarWhereWithAggregatesInput[]
    NOT?: AtsMatchScalarWhereWithAggregatesInput | AtsMatchScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AtsMatch"> | string
    userId?: StringWithAggregatesFilter<"AtsMatch"> | string
    jobTitle?: StringWithAggregatesFilter<"AtsMatch"> | string
    companyName?: StringNullableWithAggregatesFilter<"AtsMatch"> | string | null
    matchScore?: IntWithAggregatesFilter<"AtsMatch"> | number
    summary?: StringWithAggregatesFilter<"AtsMatch"> | string
    matchedSkills?: StringNullableListFilter<"AtsMatch">
    missingSkills?: StringNullableListFilter<"AtsMatch">
    experienceMatch?: StringNullableWithAggregatesFilter<"AtsMatch"> | string | null
    atsWarnings?: StringNullableListFilter<"AtsMatch">
    bulletRewrites?: JsonWithAggregatesFilter<"AtsMatch">
    tailoredQuestions?: JsonWithAggregatesFilter<"AtsMatch">
    createdAt?: DateTimeWithAggregatesFilter<"AtsMatch"> | Date | string
  }

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

  export type AnalysisCreateInput = {
    id?: string
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
    readinessVerdict: $Enums.ReadinessVerdict
    createdAt?: Date | string
    session: InterviewSessionCreateNestedOneWithoutAnalysisInput
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
    readinessVerdict: $Enums.ReadinessVerdict
    createdAt?: Date | string
  }

  export type AnalysisUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
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
    readinessVerdict?: EnumReadinessVerdictFieldUpdateOperationsInput | $Enums.ReadinessVerdict
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    session?: InterviewSessionUpdateOneRequiredWithoutAnalysisNestedInput
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
    readinessVerdict?: EnumReadinessVerdictFieldUpdateOperationsInput | $Enums.ReadinessVerdict
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
    readinessVerdict: $Enums.ReadinessVerdict
    createdAt?: Date | string
  }

  export type AnalysisUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
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
    readinessVerdict?: EnumReadinessVerdictFieldUpdateOperationsInput | $Enums.ReadinessVerdict
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
    readinessVerdict?: EnumReadinessVerdictFieldUpdateOperationsInput | $Enums.ReadinessVerdict
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InterviewSessionCreateInput = {
    id?: string
    userId: string
    interviewType: string
    targetRole: string
    targetCompany?: string | null
    industry: string
    experienceLevel: $Enums.ExperienceLevel
    focusAreas?: InterviewSessionCreatefocusAreasInput | string[]
    interviewGoal?: string | null
    durationMins?: number
    status?: string
    startedAt?: Date | string | null
    completedAt?: Date | string | null
    createdAt?: Date | string
    mode?: string
    hintCount?: number
    testCasesPassed?: number | null
    selectedLanguage?: string | null
    isDeleted?: boolean
    questions?: QuestionCreateNestedManyWithoutSessionInput
    analysis?: AnalysisCreateNestedOneWithoutSessionInput
  }

  export type InterviewSessionUncheckedCreateInput = {
    id?: string
    userId: string
    interviewType: string
    targetRole: string
    targetCompany?: string | null
    industry: string
    experienceLevel: $Enums.ExperienceLevel
    focusAreas?: InterviewSessionCreatefocusAreasInput | string[]
    interviewGoal?: string | null
    durationMins?: number
    status?: string
    startedAt?: Date | string | null
    completedAt?: Date | string | null
    createdAt?: Date | string
    mode?: string
    hintCount?: number
    testCasesPassed?: number | null
    selectedLanguage?: string | null
    isDeleted?: boolean
    questions?: QuestionUncheckedCreateNestedManyWithoutSessionInput
    analysis?: AnalysisUncheckedCreateNestedOneWithoutSessionInput
  }

  export type InterviewSessionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    interviewType?: StringFieldUpdateOperationsInput | string
    targetRole?: StringFieldUpdateOperationsInput | string
    targetCompany?: NullableStringFieldUpdateOperationsInput | string | null
    industry?: StringFieldUpdateOperationsInput | string
    experienceLevel?: EnumExperienceLevelFieldUpdateOperationsInput | $Enums.ExperienceLevel
    focusAreas?: InterviewSessionUpdatefocusAreasInput | string[]
    interviewGoal?: NullableStringFieldUpdateOperationsInput | string | null
    durationMins?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    mode?: StringFieldUpdateOperationsInput | string
    hintCount?: IntFieldUpdateOperationsInput | number
    testCasesPassed?: NullableIntFieldUpdateOperationsInput | number | null
    selectedLanguage?: NullableStringFieldUpdateOperationsInput | string | null
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    questions?: QuestionUpdateManyWithoutSessionNestedInput
    analysis?: AnalysisUpdateOneWithoutSessionNestedInput
  }

  export type InterviewSessionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    interviewType?: StringFieldUpdateOperationsInput | string
    targetRole?: StringFieldUpdateOperationsInput | string
    targetCompany?: NullableStringFieldUpdateOperationsInput | string | null
    industry?: StringFieldUpdateOperationsInput | string
    experienceLevel?: EnumExperienceLevelFieldUpdateOperationsInput | $Enums.ExperienceLevel
    focusAreas?: InterviewSessionUpdatefocusAreasInput | string[]
    interviewGoal?: NullableStringFieldUpdateOperationsInput | string | null
    durationMins?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    mode?: StringFieldUpdateOperationsInput | string
    hintCount?: IntFieldUpdateOperationsInput | number
    testCasesPassed?: NullableIntFieldUpdateOperationsInput | number | null
    selectedLanguage?: NullableStringFieldUpdateOperationsInput | string | null
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    questions?: QuestionUncheckedUpdateManyWithoutSessionNestedInput
    analysis?: AnalysisUncheckedUpdateOneWithoutSessionNestedInput
  }

  export type InterviewSessionCreateManyInput = {
    id?: string
    userId: string
    interviewType: string
    targetRole: string
    targetCompany?: string | null
    industry: string
    experienceLevel: $Enums.ExperienceLevel
    focusAreas?: InterviewSessionCreatefocusAreasInput | string[]
    interviewGoal?: string | null
    durationMins?: number
    status?: string
    startedAt?: Date | string | null
    completedAt?: Date | string | null
    createdAt?: Date | string
    mode?: string
    hintCount?: number
    testCasesPassed?: number | null
    selectedLanguage?: string | null
    isDeleted?: boolean
  }

  export type InterviewSessionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    interviewType?: StringFieldUpdateOperationsInput | string
    targetRole?: StringFieldUpdateOperationsInput | string
    targetCompany?: NullableStringFieldUpdateOperationsInput | string | null
    industry?: StringFieldUpdateOperationsInput | string
    experienceLevel?: EnumExperienceLevelFieldUpdateOperationsInput | $Enums.ExperienceLevel
    focusAreas?: InterviewSessionUpdatefocusAreasInput | string[]
    interviewGoal?: NullableStringFieldUpdateOperationsInput | string | null
    durationMins?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    mode?: StringFieldUpdateOperationsInput | string
    hintCount?: IntFieldUpdateOperationsInput | number
    testCasesPassed?: NullableIntFieldUpdateOperationsInput | number | null
    selectedLanguage?: NullableStringFieldUpdateOperationsInput | string | null
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
  }

  export type InterviewSessionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    interviewType?: StringFieldUpdateOperationsInput | string
    targetRole?: StringFieldUpdateOperationsInput | string
    targetCompany?: NullableStringFieldUpdateOperationsInput | string | null
    industry?: StringFieldUpdateOperationsInput | string
    experienceLevel?: EnumExperienceLevelFieldUpdateOperationsInput | $Enums.ExperienceLevel
    focusAreas?: InterviewSessionUpdatefocusAreasInput | string[]
    interviewGoal?: NullableStringFieldUpdateOperationsInput | string | null
    durationMins?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    mode?: StringFieldUpdateOperationsInput | string
    hintCount?: IntFieldUpdateOperationsInput | number
    testCasesPassed?: NullableIntFieldUpdateOperationsInput | number | null
    selectedLanguage?: NullableStringFieldUpdateOperationsInput | string | null
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
  }

  export type QuestionCreateInput = {
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
    evalStrengths?: QuestionCreateevalStrengthsInput | string[]
    evalWeaknesses?: QuestionCreateevalWeaknessesInput | string[]
    betterAnswer?: string | null
    session: InterviewSessionCreateNestedOneWithoutQuestionsInput
  }

  export type QuestionUncheckedCreateInput = {
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
    evalStrengths?: QuestionCreateevalStrengthsInput | string[]
    evalWeaknesses?: QuestionCreateevalWeaknessesInput | string[]
    betterAnswer?: string | null
  }

  export type QuestionUpdateInput = {
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
    evalStrengths?: QuestionUpdateevalStrengthsInput | string[]
    evalWeaknesses?: QuestionUpdateevalWeaknessesInput | string[]
    betterAnswer?: NullableStringFieldUpdateOperationsInput | string | null
    session?: InterviewSessionUpdateOneRequiredWithoutQuestionsNestedInput
  }

  export type QuestionUncheckedUpdateInput = {
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
    evalStrengths?: QuestionUpdateevalStrengthsInput | string[]
    evalWeaknesses?: QuestionUpdateevalWeaknessesInput | string[]
    betterAnswer?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type QuestionCreateManyInput = {
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
    evalStrengths?: QuestionCreateevalStrengthsInput | string[]
    evalWeaknesses?: QuestionCreateevalWeaknessesInput | string[]
    betterAnswer?: string | null
  }

  export type QuestionUpdateManyMutationInput = {
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
    evalStrengths?: QuestionUpdateevalStrengthsInput | string[]
    evalWeaknesses?: QuestionUpdateevalWeaknessesInput | string[]
    betterAnswer?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type QuestionUncheckedUpdateManyInput = {
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
    evalStrengths?: QuestionUpdateevalStrengthsInput | string[]
    evalWeaknesses?: QuestionUpdateevalWeaknessesInput | string[]
    betterAnswer?: NullableStringFieldUpdateOperationsInput | string | null
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

  export type AtsMatchCreateInput = {
    id?: string
    userId: string
    jobTitle: string
    companyName?: string | null
    matchScore: number
    summary: string
    matchedSkills?: AtsMatchCreatematchedSkillsInput | string[]
    missingSkills?: AtsMatchCreatemissingSkillsInput | string[]
    experienceMatch?: string | null
    atsWarnings?: AtsMatchCreateatsWarningsInput | string[]
    bulletRewrites: JsonNullValueInput | InputJsonValue
    tailoredQuestions: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type AtsMatchUncheckedCreateInput = {
    id?: string
    userId: string
    jobTitle: string
    companyName?: string | null
    matchScore: number
    summary: string
    matchedSkills?: AtsMatchCreatematchedSkillsInput | string[]
    missingSkills?: AtsMatchCreatemissingSkillsInput | string[]
    experienceMatch?: string | null
    atsWarnings?: AtsMatchCreateatsWarningsInput | string[]
    bulletRewrites: JsonNullValueInput | InputJsonValue
    tailoredQuestions: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type AtsMatchUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    jobTitle?: StringFieldUpdateOperationsInput | string
    companyName?: NullableStringFieldUpdateOperationsInput | string | null
    matchScore?: IntFieldUpdateOperationsInput | number
    summary?: StringFieldUpdateOperationsInput | string
    matchedSkills?: AtsMatchUpdatematchedSkillsInput | string[]
    missingSkills?: AtsMatchUpdatemissingSkillsInput | string[]
    experienceMatch?: NullableStringFieldUpdateOperationsInput | string | null
    atsWarnings?: AtsMatchUpdateatsWarningsInput | string[]
    bulletRewrites?: JsonNullValueInput | InputJsonValue
    tailoredQuestions?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AtsMatchUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    jobTitle?: StringFieldUpdateOperationsInput | string
    companyName?: NullableStringFieldUpdateOperationsInput | string | null
    matchScore?: IntFieldUpdateOperationsInput | number
    summary?: StringFieldUpdateOperationsInput | string
    matchedSkills?: AtsMatchUpdatematchedSkillsInput | string[]
    missingSkills?: AtsMatchUpdatemissingSkillsInput | string[]
    experienceMatch?: NullableStringFieldUpdateOperationsInput | string | null
    atsWarnings?: AtsMatchUpdateatsWarningsInput | string[]
    bulletRewrites?: JsonNullValueInput | InputJsonValue
    tailoredQuestions?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AtsMatchCreateManyInput = {
    id?: string
    userId: string
    jobTitle: string
    companyName?: string | null
    matchScore: number
    summary: string
    matchedSkills?: AtsMatchCreatematchedSkillsInput | string[]
    missingSkills?: AtsMatchCreatemissingSkillsInput | string[]
    experienceMatch?: string | null
    atsWarnings?: AtsMatchCreateatsWarningsInput | string[]
    bulletRewrites: JsonNullValueInput | InputJsonValue
    tailoredQuestions: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type AtsMatchUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    jobTitle?: StringFieldUpdateOperationsInput | string
    companyName?: NullableStringFieldUpdateOperationsInput | string | null
    matchScore?: IntFieldUpdateOperationsInput | number
    summary?: StringFieldUpdateOperationsInput | string
    matchedSkills?: AtsMatchUpdatematchedSkillsInput | string[]
    missingSkills?: AtsMatchUpdatemissingSkillsInput | string[]
    experienceMatch?: NullableStringFieldUpdateOperationsInput | string | null
    atsWarnings?: AtsMatchUpdateatsWarningsInput | string[]
    bulletRewrites?: JsonNullValueInput | InputJsonValue
    tailoredQuestions?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AtsMatchUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    jobTitle?: StringFieldUpdateOperationsInput | string
    companyName?: NullableStringFieldUpdateOperationsInput | string | null
    matchScore?: IntFieldUpdateOperationsInput | number
    summary?: StringFieldUpdateOperationsInput | string
    matchedSkills?: AtsMatchUpdatematchedSkillsInput | string[]
    missingSkills?: AtsMatchUpdatemissingSkillsInput | string[]
    experienceMatch?: NullableStringFieldUpdateOperationsInput | string | null
    atsWarnings?: AtsMatchUpdateatsWarningsInput | string[]
    bulletRewrites?: JsonNullValueInput | InputJsonValue
    tailoredQuestions?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
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

  export type EnumReadinessVerdictFilter<$PrismaModel = never> = {
    equals?: $Enums.ReadinessVerdict | EnumReadinessVerdictFieldRefInput<$PrismaModel>
    in?: $Enums.ReadinessVerdict[] | ListEnumReadinessVerdictFieldRefInput<$PrismaModel>
    notIn?: $Enums.ReadinessVerdict[] | ListEnumReadinessVerdictFieldRefInput<$PrismaModel>
    not?: NestedEnumReadinessVerdictFilter<$PrismaModel> | $Enums.ReadinessVerdict
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

  export type InterviewSessionScalarRelationFilter = {
    is?: InterviewSessionWhereInput
    isNot?: InterviewSessionWhereInput
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

  export type EnumReadinessVerdictWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ReadinessVerdict | EnumReadinessVerdictFieldRefInput<$PrismaModel>
    in?: $Enums.ReadinessVerdict[] | ListEnumReadinessVerdictFieldRefInput<$PrismaModel>
    notIn?: $Enums.ReadinessVerdict[] | ListEnumReadinessVerdictFieldRefInput<$PrismaModel>
    not?: NestedEnumReadinessVerdictWithAggregatesFilter<$PrismaModel> | $Enums.ReadinessVerdict
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumReadinessVerdictFilter<$PrismaModel>
    _max?: NestedEnumReadinessVerdictFilter<$PrismaModel>
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

  export type EnumExperienceLevelFilter<$PrismaModel = never> = {
    equals?: $Enums.ExperienceLevel | EnumExperienceLevelFieldRefInput<$PrismaModel>
    in?: $Enums.ExperienceLevel[] | ListEnumExperienceLevelFieldRefInput<$PrismaModel>
    notIn?: $Enums.ExperienceLevel[] | ListEnumExperienceLevelFieldRefInput<$PrismaModel>
    not?: NestedEnumExperienceLevelFilter<$PrismaModel> | $Enums.ExperienceLevel
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

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type QuestionListRelationFilter = {
    every?: QuestionWhereInput
    some?: QuestionWhereInput
    none?: QuestionWhereInput
  }

  export type AnalysisNullableScalarRelationFilter = {
    is?: AnalysisWhereInput | null
    isNot?: AnalysisWhereInput | null
  }

  export type QuestionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type InterviewSessionCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
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
    mode?: SortOrder
    hintCount?: SortOrder
    testCasesPassed?: SortOrder
    selectedLanguage?: SortOrder
    isDeleted?: SortOrder
  }

  export type InterviewSessionAvgOrderByAggregateInput = {
    durationMins?: SortOrder
    hintCount?: SortOrder
    testCasesPassed?: SortOrder
  }

  export type InterviewSessionMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
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
    mode?: SortOrder
    hintCount?: SortOrder
    testCasesPassed?: SortOrder
    selectedLanguage?: SortOrder
    isDeleted?: SortOrder
  }

  export type InterviewSessionMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
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
    mode?: SortOrder
    hintCount?: SortOrder
    testCasesPassed?: SortOrder
    selectedLanguage?: SortOrder
    isDeleted?: SortOrder
  }

  export type InterviewSessionSumOrderByAggregateInput = {
    durationMins?: SortOrder
    hintCount?: SortOrder
    testCasesPassed?: SortOrder
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

  export type EnumExperienceLevelWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ExperienceLevel | EnumExperienceLevelFieldRefInput<$PrismaModel>
    in?: $Enums.ExperienceLevel[] | ListEnumExperienceLevelFieldRefInput<$PrismaModel>
    notIn?: $Enums.ExperienceLevel[] | ListEnumExperienceLevelFieldRefInput<$PrismaModel>
    not?: NestedEnumExperienceLevelWithAggregatesFilter<$PrismaModel> | $Enums.ExperienceLevel
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumExperienceLevelFilter<$PrismaModel>
    _max?: NestedEnumExperienceLevelFilter<$PrismaModel>
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

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type QuestionCountOrderByAggregateInput = {
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

  export type QuestionAvgOrderByAggregateInput = {
    orderIndex?: SortOrder
    timeTakenSecs?: SortOrder
    evalScore?: SortOrder
  }

  export type QuestionMaxOrderByAggregateInput = {
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

  export type QuestionMinOrderByAggregateInput = {
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

  export type QuestionSumOrderByAggregateInput = {
    orderIndex?: SortOrder
    timeTakenSecs?: SortOrder
    evalScore?: SortOrder
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

  export type AtsMatchCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    jobTitle?: SortOrder
    companyName?: SortOrder
    matchScore?: SortOrder
    summary?: SortOrder
    matchedSkills?: SortOrder
    missingSkills?: SortOrder
    experienceMatch?: SortOrder
    atsWarnings?: SortOrder
    bulletRewrites?: SortOrder
    tailoredQuestions?: SortOrder
    createdAt?: SortOrder
  }

  export type AtsMatchAvgOrderByAggregateInput = {
    matchScore?: SortOrder
  }

  export type AtsMatchMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    jobTitle?: SortOrder
    companyName?: SortOrder
    matchScore?: SortOrder
    summary?: SortOrder
    experienceMatch?: SortOrder
    createdAt?: SortOrder
  }

  export type AtsMatchMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    jobTitle?: SortOrder
    companyName?: SortOrder
    matchScore?: SortOrder
    summary?: SortOrder
    experienceMatch?: SortOrder
    createdAt?: SortOrder
  }

  export type AtsMatchSumOrderByAggregateInput = {
    matchScore?: SortOrder
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

  export type AnalysisCreatestrengthsInput = {
    set: string[]
  }

  export type AnalysisCreateimprovementsInput = {
    set: string[]
  }

  export type InterviewSessionCreateNestedOneWithoutAnalysisInput = {
    create?: XOR<InterviewSessionCreateWithoutAnalysisInput, InterviewSessionUncheckedCreateWithoutAnalysisInput>
    connectOrCreate?: InterviewSessionCreateOrConnectWithoutAnalysisInput
    connect?: InterviewSessionWhereUniqueInput
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

  export type EnumReadinessVerdictFieldUpdateOperationsInput = {
    set?: $Enums.ReadinessVerdict
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type InterviewSessionUpdateOneRequiredWithoutAnalysisNestedInput = {
    create?: XOR<InterviewSessionCreateWithoutAnalysisInput, InterviewSessionUncheckedCreateWithoutAnalysisInput>
    connectOrCreate?: InterviewSessionCreateOrConnectWithoutAnalysisInput
    upsert?: InterviewSessionUpsertWithoutAnalysisInput
    connect?: InterviewSessionWhereUniqueInput
    update?: XOR<XOR<InterviewSessionUpdateToOneWithWhereWithoutAnalysisInput, InterviewSessionUpdateWithoutAnalysisInput>, InterviewSessionUncheckedUpdateWithoutAnalysisInput>
  }

  export type InterviewSessionCreatefocusAreasInput = {
    set: string[]
  }

  export type QuestionCreateNestedManyWithoutSessionInput = {
    create?: XOR<QuestionCreateWithoutSessionInput, QuestionUncheckedCreateWithoutSessionInput> | QuestionCreateWithoutSessionInput[] | QuestionUncheckedCreateWithoutSessionInput[]
    connectOrCreate?: QuestionCreateOrConnectWithoutSessionInput | QuestionCreateOrConnectWithoutSessionInput[]
    createMany?: QuestionCreateManySessionInputEnvelope
    connect?: QuestionWhereUniqueInput | QuestionWhereUniqueInput[]
  }

  export type AnalysisCreateNestedOneWithoutSessionInput = {
    create?: XOR<AnalysisCreateWithoutSessionInput, AnalysisUncheckedCreateWithoutSessionInput>
    connectOrCreate?: AnalysisCreateOrConnectWithoutSessionInput
    connect?: AnalysisWhereUniqueInput
  }

  export type QuestionUncheckedCreateNestedManyWithoutSessionInput = {
    create?: XOR<QuestionCreateWithoutSessionInput, QuestionUncheckedCreateWithoutSessionInput> | QuestionCreateWithoutSessionInput[] | QuestionUncheckedCreateWithoutSessionInput[]
    connectOrCreate?: QuestionCreateOrConnectWithoutSessionInput | QuestionCreateOrConnectWithoutSessionInput[]
    createMany?: QuestionCreateManySessionInputEnvelope
    connect?: QuestionWhereUniqueInput | QuestionWhereUniqueInput[]
  }

  export type AnalysisUncheckedCreateNestedOneWithoutSessionInput = {
    create?: XOR<AnalysisCreateWithoutSessionInput, AnalysisUncheckedCreateWithoutSessionInput>
    connectOrCreate?: AnalysisCreateOrConnectWithoutSessionInput
    connect?: AnalysisWhereUniqueInput
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type EnumExperienceLevelFieldUpdateOperationsInput = {
    set?: $Enums.ExperienceLevel
  }

  export type InterviewSessionUpdatefocusAreasInput = {
    set?: string[]
    push?: string | string[]
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type QuestionUpdateManyWithoutSessionNestedInput = {
    create?: XOR<QuestionCreateWithoutSessionInput, QuestionUncheckedCreateWithoutSessionInput> | QuestionCreateWithoutSessionInput[] | QuestionUncheckedCreateWithoutSessionInput[]
    connectOrCreate?: QuestionCreateOrConnectWithoutSessionInput | QuestionCreateOrConnectWithoutSessionInput[]
    upsert?: QuestionUpsertWithWhereUniqueWithoutSessionInput | QuestionUpsertWithWhereUniqueWithoutSessionInput[]
    createMany?: QuestionCreateManySessionInputEnvelope
    set?: QuestionWhereUniqueInput | QuestionWhereUniqueInput[]
    disconnect?: QuestionWhereUniqueInput | QuestionWhereUniqueInput[]
    delete?: QuestionWhereUniqueInput | QuestionWhereUniqueInput[]
    connect?: QuestionWhereUniqueInput | QuestionWhereUniqueInput[]
    update?: QuestionUpdateWithWhereUniqueWithoutSessionInput | QuestionUpdateWithWhereUniqueWithoutSessionInput[]
    updateMany?: QuestionUpdateManyWithWhereWithoutSessionInput | QuestionUpdateManyWithWhereWithoutSessionInput[]
    deleteMany?: QuestionScalarWhereInput | QuestionScalarWhereInput[]
  }

  export type AnalysisUpdateOneWithoutSessionNestedInput = {
    create?: XOR<AnalysisCreateWithoutSessionInput, AnalysisUncheckedCreateWithoutSessionInput>
    connectOrCreate?: AnalysisCreateOrConnectWithoutSessionInput
    upsert?: AnalysisUpsertWithoutSessionInput
    disconnect?: AnalysisWhereInput | boolean
    delete?: AnalysisWhereInput | boolean
    connect?: AnalysisWhereUniqueInput
    update?: XOR<XOR<AnalysisUpdateToOneWithWhereWithoutSessionInput, AnalysisUpdateWithoutSessionInput>, AnalysisUncheckedUpdateWithoutSessionInput>
  }

  export type QuestionUncheckedUpdateManyWithoutSessionNestedInput = {
    create?: XOR<QuestionCreateWithoutSessionInput, QuestionUncheckedCreateWithoutSessionInput> | QuestionCreateWithoutSessionInput[] | QuestionUncheckedCreateWithoutSessionInput[]
    connectOrCreate?: QuestionCreateOrConnectWithoutSessionInput | QuestionCreateOrConnectWithoutSessionInput[]
    upsert?: QuestionUpsertWithWhereUniqueWithoutSessionInput | QuestionUpsertWithWhereUniqueWithoutSessionInput[]
    createMany?: QuestionCreateManySessionInputEnvelope
    set?: QuestionWhereUniqueInput | QuestionWhereUniqueInput[]
    disconnect?: QuestionWhereUniqueInput | QuestionWhereUniqueInput[]
    delete?: QuestionWhereUniqueInput | QuestionWhereUniqueInput[]
    connect?: QuestionWhereUniqueInput | QuestionWhereUniqueInput[]
    update?: QuestionUpdateWithWhereUniqueWithoutSessionInput | QuestionUpdateWithWhereUniqueWithoutSessionInput[]
    updateMany?: QuestionUpdateManyWithWhereWithoutSessionInput | QuestionUpdateManyWithWhereWithoutSessionInput[]
    deleteMany?: QuestionScalarWhereInput | QuestionScalarWhereInput[]
  }

  export type AnalysisUncheckedUpdateOneWithoutSessionNestedInput = {
    create?: XOR<AnalysisCreateWithoutSessionInput, AnalysisUncheckedCreateWithoutSessionInput>
    connectOrCreate?: AnalysisCreateOrConnectWithoutSessionInput
    upsert?: AnalysisUpsertWithoutSessionInput
    disconnect?: AnalysisWhereInput | boolean
    delete?: AnalysisWhereInput | boolean
    connect?: AnalysisWhereUniqueInput
    update?: XOR<XOR<AnalysisUpdateToOneWithWhereWithoutSessionInput, AnalysisUpdateWithoutSessionInput>, AnalysisUncheckedUpdateWithoutSessionInput>
  }

  export type QuestionCreateevalStrengthsInput = {
    set: string[]
  }

  export type QuestionCreateevalWeaknessesInput = {
    set: string[]
  }

  export type InterviewSessionCreateNestedOneWithoutQuestionsInput = {
    create?: XOR<InterviewSessionCreateWithoutQuestionsInput, InterviewSessionUncheckedCreateWithoutQuestionsInput>
    connectOrCreate?: InterviewSessionCreateOrConnectWithoutQuestionsInput
    connect?: InterviewSessionWhereUniqueInput
  }

  export type QuestionUpdateevalStrengthsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type QuestionUpdateevalWeaknessesInput = {
    set?: string[]
    push?: string | string[]
  }

  export type InterviewSessionUpdateOneRequiredWithoutQuestionsNestedInput = {
    create?: XOR<InterviewSessionCreateWithoutQuestionsInput, InterviewSessionUncheckedCreateWithoutQuestionsInput>
    connectOrCreate?: InterviewSessionCreateOrConnectWithoutQuestionsInput
    upsert?: InterviewSessionUpsertWithoutQuestionsInput
    connect?: InterviewSessionWhereUniqueInput
    update?: XOR<XOR<InterviewSessionUpdateToOneWithWhereWithoutQuestionsInput, InterviewSessionUpdateWithoutQuestionsInput>, InterviewSessionUncheckedUpdateWithoutQuestionsInput>
  }

  export type AtsMatchCreatematchedSkillsInput = {
    set: string[]
  }

  export type AtsMatchCreatemissingSkillsInput = {
    set: string[]
  }

  export type AtsMatchCreateatsWarningsInput = {
    set: string[]
  }

  export type AtsMatchUpdatematchedSkillsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type AtsMatchUpdatemissingSkillsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type AtsMatchUpdateatsWarningsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type DiscussionPostCreatetagsInput = {
    set: string[]
  }

  export type DiscussionPostUpdatetagsInput = {
    set?: string[]
    push?: string | string[]
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

  export type NestedEnumReadinessVerdictFilter<$PrismaModel = never> = {
    equals?: $Enums.ReadinessVerdict | EnumReadinessVerdictFieldRefInput<$PrismaModel>
    in?: $Enums.ReadinessVerdict[] | ListEnumReadinessVerdictFieldRefInput<$PrismaModel>
    notIn?: $Enums.ReadinessVerdict[] | ListEnumReadinessVerdictFieldRefInput<$PrismaModel>
    not?: NestedEnumReadinessVerdictFilter<$PrismaModel> | $Enums.ReadinessVerdict
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

  export type NestedEnumReadinessVerdictWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ReadinessVerdict | EnumReadinessVerdictFieldRefInput<$PrismaModel>
    in?: $Enums.ReadinessVerdict[] | ListEnumReadinessVerdictFieldRefInput<$PrismaModel>
    notIn?: $Enums.ReadinessVerdict[] | ListEnumReadinessVerdictFieldRefInput<$PrismaModel>
    not?: NestedEnumReadinessVerdictWithAggregatesFilter<$PrismaModel> | $Enums.ReadinessVerdict
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumReadinessVerdictFilter<$PrismaModel>
    _max?: NestedEnumReadinessVerdictFilter<$PrismaModel>
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

  export type NestedEnumExperienceLevelFilter<$PrismaModel = never> = {
    equals?: $Enums.ExperienceLevel | EnumExperienceLevelFieldRefInput<$PrismaModel>
    in?: $Enums.ExperienceLevel[] | ListEnumExperienceLevelFieldRefInput<$PrismaModel>
    notIn?: $Enums.ExperienceLevel[] | ListEnumExperienceLevelFieldRefInput<$PrismaModel>
    not?: NestedEnumExperienceLevelFilter<$PrismaModel> | $Enums.ExperienceLevel
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

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
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

  export type NestedEnumExperienceLevelWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ExperienceLevel | EnumExperienceLevelFieldRefInput<$PrismaModel>
    in?: $Enums.ExperienceLevel[] | ListEnumExperienceLevelFieldRefInput<$PrismaModel>
    notIn?: $Enums.ExperienceLevel[] | ListEnumExperienceLevelFieldRefInput<$PrismaModel>
    not?: NestedEnumExperienceLevelWithAggregatesFilter<$PrismaModel> | $Enums.ExperienceLevel
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumExperienceLevelFilter<$PrismaModel>
    _max?: NestedEnumExperienceLevelFilter<$PrismaModel>
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

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type InterviewSessionCreateWithoutAnalysisInput = {
    id?: string
    userId: string
    interviewType: string
    targetRole: string
    targetCompany?: string | null
    industry: string
    experienceLevel: $Enums.ExperienceLevel
    focusAreas?: InterviewSessionCreatefocusAreasInput | string[]
    interviewGoal?: string | null
    durationMins?: number
    status?: string
    startedAt?: Date | string | null
    completedAt?: Date | string | null
    createdAt?: Date | string
    mode?: string
    hintCount?: number
    testCasesPassed?: number | null
    selectedLanguage?: string | null
    isDeleted?: boolean
    questions?: QuestionCreateNestedManyWithoutSessionInput
  }

  export type InterviewSessionUncheckedCreateWithoutAnalysisInput = {
    id?: string
    userId: string
    interviewType: string
    targetRole: string
    targetCompany?: string | null
    industry: string
    experienceLevel: $Enums.ExperienceLevel
    focusAreas?: InterviewSessionCreatefocusAreasInput | string[]
    interviewGoal?: string | null
    durationMins?: number
    status?: string
    startedAt?: Date | string | null
    completedAt?: Date | string | null
    createdAt?: Date | string
    mode?: string
    hintCount?: number
    testCasesPassed?: number | null
    selectedLanguage?: string | null
    isDeleted?: boolean
    questions?: QuestionUncheckedCreateNestedManyWithoutSessionInput
  }

  export type InterviewSessionCreateOrConnectWithoutAnalysisInput = {
    where: InterviewSessionWhereUniqueInput
    create: XOR<InterviewSessionCreateWithoutAnalysisInput, InterviewSessionUncheckedCreateWithoutAnalysisInput>
  }

  export type InterviewSessionUpsertWithoutAnalysisInput = {
    update: XOR<InterviewSessionUpdateWithoutAnalysisInput, InterviewSessionUncheckedUpdateWithoutAnalysisInput>
    create: XOR<InterviewSessionCreateWithoutAnalysisInput, InterviewSessionUncheckedCreateWithoutAnalysisInput>
    where?: InterviewSessionWhereInput
  }

  export type InterviewSessionUpdateToOneWithWhereWithoutAnalysisInput = {
    where?: InterviewSessionWhereInput
    data: XOR<InterviewSessionUpdateWithoutAnalysisInput, InterviewSessionUncheckedUpdateWithoutAnalysisInput>
  }

  export type InterviewSessionUpdateWithoutAnalysisInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    interviewType?: StringFieldUpdateOperationsInput | string
    targetRole?: StringFieldUpdateOperationsInput | string
    targetCompany?: NullableStringFieldUpdateOperationsInput | string | null
    industry?: StringFieldUpdateOperationsInput | string
    experienceLevel?: EnumExperienceLevelFieldUpdateOperationsInput | $Enums.ExperienceLevel
    focusAreas?: InterviewSessionUpdatefocusAreasInput | string[]
    interviewGoal?: NullableStringFieldUpdateOperationsInput | string | null
    durationMins?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    mode?: StringFieldUpdateOperationsInput | string
    hintCount?: IntFieldUpdateOperationsInput | number
    testCasesPassed?: NullableIntFieldUpdateOperationsInput | number | null
    selectedLanguage?: NullableStringFieldUpdateOperationsInput | string | null
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    questions?: QuestionUpdateManyWithoutSessionNestedInput
  }

  export type InterviewSessionUncheckedUpdateWithoutAnalysisInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    interviewType?: StringFieldUpdateOperationsInput | string
    targetRole?: StringFieldUpdateOperationsInput | string
    targetCompany?: NullableStringFieldUpdateOperationsInput | string | null
    industry?: StringFieldUpdateOperationsInput | string
    experienceLevel?: EnumExperienceLevelFieldUpdateOperationsInput | $Enums.ExperienceLevel
    focusAreas?: InterviewSessionUpdatefocusAreasInput | string[]
    interviewGoal?: NullableStringFieldUpdateOperationsInput | string | null
    durationMins?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    mode?: StringFieldUpdateOperationsInput | string
    hintCount?: IntFieldUpdateOperationsInput | number
    testCasesPassed?: NullableIntFieldUpdateOperationsInput | number | null
    selectedLanguage?: NullableStringFieldUpdateOperationsInput | string | null
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    questions?: QuestionUncheckedUpdateManyWithoutSessionNestedInput
  }

  export type QuestionCreateWithoutSessionInput = {
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
    evalStrengths?: QuestionCreateevalStrengthsInput | string[]
    evalWeaknesses?: QuestionCreateevalWeaknessesInput | string[]
    betterAnswer?: string | null
  }

  export type QuestionUncheckedCreateWithoutSessionInput = {
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
    evalStrengths?: QuestionCreateevalStrengthsInput | string[]
    evalWeaknesses?: QuestionCreateevalWeaknessesInput | string[]
    betterAnswer?: string | null
  }

  export type QuestionCreateOrConnectWithoutSessionInput = {
    where: QuestionWhereUniqueInput
    create: XOR<QuestionCreateWithoutSessionInput, QuestionUncheckedCreateWithoutSessionInput>
  }

  export type QuestionCreateManySessionInputEnvelope = {
    data: QuestionCreateManySessionInput | QuestionCreateManySessionInput[]
    skipDuplicates?: boolean
  }

  export type AnalysisCreateWithoutSessionInput = {
    id?: string
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
    readinessVerdict: $Enums.ReadinessVerdict
    createdAt?: Date | string
  }

  export type AnalysisUncheckedCreateWithoutSessionInput = {
    id?: string
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
    readinessVerdict: $Enums.ReadinessVerdict
    createdAt?: Date | string
  }

  export type AnalysisCreateOrConnectWithoutSessionInput = {
    where: AnalysisWhereUniqueInput
    create: XOR<AnalysisCreateWithoutSessionInput, AnalysisUncheckedCreateWithoutSessionInput>
  }

  export type QuestionUpsertWithWhereUniqueWithoutSessionInput = {
    where: QuestionWhereUniqueInput
    update: XOR<QuestionUpdateWithoutSessionInput, QuestionUncheckedUpdateWithoutSessionInput>
    create: XOR<QuestionCreateWithoutSessionInput, QuestionUncheckedCreateWithoutSessionInput>
  }

  export type QuestionUpdateWithWhereUniqueWithoutSessionInput = {
    where: QuestionWhereUniqueInput
    data: XOR<QuestionUpdateWithoutSessionInput, QuestionUncheckedUpdateWithoutSessionInput>
  }

  export type QuestionUpdateManyWithWhereWithoutSessionInput = {
    where: QuestionScalarWhereInput
    data: XOR<QuestionUpdateManyMutationInput, QuestionUncheckedUpdateManyWithoutSessionInput>
  }

  export type QuestionScalarWhereInput = {
    AND?: QuestionScalarWhereInput | QuestionScalarWhereInput[]
    OR?: QuestionScalarWhereInput[]
    NOT?: QuestionScalarWhereInput | QuestionScalarWhereInput[]
    id?: StringFilter<"Question"> | string
    sessionId?: StringFilter<"Question"> | string
    orderIndex?: IntFilter<"Question"> | number
    questionText?: StringFilter<"Question"> | string
    questionType?: StringFilter<"Question"> | string
    difficulty?: StringFilter<"Question"> | string
    answerText?: StringNullableFilter<"Question"> | string | null
    answeredAt?: DateTimeNullableFilter<"Question"> | Date | string | null
    timeTakenSecs?: IntNullableFilter<"Question"> | number | null
    evalScore?: IntNullableFilter<"Question"> | number | null
    evalFeedback?: StringNullableFilter<"Question"> | string | null
    evalStrengths?: StringNullableListFilter<"Question">
    evalWeaknesses?: StringNullableListFilter<"Question">
    betterAnswer?: StringNullableFilter<"Question"> | string | null
  }

  export type AnalysisUpsertWithoutSessionInput = {
    update: XOR<AnalysisUpdateWithoutSessionInput, AnalysisUncheckedUpdateWithoutSessionInput>
    create: XOR<AnalysisCreateWithoutSessionInput, AnalysisUncheckedCreateWithoutSessionInput>
    where?: AnalysisWhereInput
  }

  export type AnalysisUpdateToOneWithWhereWithoutSessionInput = {
    where?: AnalysisWhereInput
    data: XOR<AnalysisUpdateWithoutSessionInput, AnalysisUncheckedUpdateWithoutSessionInput>
  }

  export type AnalysisUpdateWithoutSessionInput = {
    id?: StringFieldUpdateOperationsInput | string
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
    readinessVerdict?: EnumReadinessVerdictFieldUpdateOperationsInput | $Enums.ReadinessVerdict
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AnalysisUncheckedUpdateWithoutSessionInput = {
    id?: StringFieldUpdateOperationsInput | string
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
    readinessVerdict?: EnumReadinessVerdictFieldUpdateOperationsInput | $Enums.ReadinessVerdict
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InterviewSessionCreateWithoutQuestionsInput = {
    id?: string
    userId: string
    interviewType: string
    targetRole: string
    targetCompany?: string | null
    industry: string
    experienceLevel: $Enums.ExperienceLevel
    focusAreas?: InterviewSessionCreatefocusAreasInput | string[]
    interviewGoal?: string | null
    durationMins?: number
    status?: string
    startedAt?: Date | string | null
    completedAt?: Date | string | null
    createdAt?: Date | string
    mode?: string
    hintCount?: number
    testCasesPassed?: number | null
    selectedLanguage?: string | null
    isDeleted?: boolean
    analysis?: AnalysisCreateNestedOneWithoutSessionInput
  }

  export type InterviewSessionUncheckedCreateWithoutQuestionsInput = {
    id?: string
    userId: string
    interviewType: string
    targetRole: string
    targetCompany?: string | null
    industry: string
    experienceLevel: $Enums.ExperienceLevel
    focusAreas?: InterviewSessionCreatefocusAreasInput | string[]
    interviewGoal?: string | null
    durationMins?: number
    status?: string
    startedAt?: Date | string | null
    completedAt?: Date | string | null
    createdAt?: Date | string
    mode?: string
    hintCount?: number
    testCasesPassed?: number | null
    selectedLanguage?: string | null
    isDeleted?: boolean
    analysis?: AnalysisUncheckedCreateNestedOneWithoutSessionInput
  }

  export type InterviewSessionCreateOrConnectWithoutQuestionsInput = {
    where: InterviewSessionWhereUniqueInput
    create: XOR<InterviewSessionCreateWithoutQuestionsInput, InterviewSessionUncheckedCreateWithoutQuestionsInput>
  }

  export type InterviewSessionUpsertWithoutQuestionsInput = {
    update: XOR<InterviewSessionUpdateWithoutQuestionsInput, InterviewSessionUncheckedUpdateWithoutQuestionsInput>
    create: XOR<InterviewSessionCreateWithoutQuestionsInput, InterviewSessionUncheckedCreateWithoutQuestionsInput>
    where?: InterviewSessionWhereInput
  }

  export type InterviewSessionUpdateToOneWithWhereWithoutQuestionsInput = {
    where?: InterviewSessionWhereInput
    data: XOR<InterviewSessionUpdateWithoutQuestionsInput, InterviewSessionUncheckedUpdateWithoutQuestionsInput>
  }

  export type InterviewSessionUpdateWithoutQuestionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    interviewType?: StringFieldUpdateOperationsInput | string
    targetRole?: StringFieldUpdateOperationsInput | string
    targetCompany?: NullableStringFieldUpdateOperationsInput | string | null
    industry?: StringFieldUpdateOperationsInput | string
    experienceLevel?: EnumExperienceLevelFieldUpdateOperationsInput | $Enums.ExperienceLevel
    focusAreas?: InterviewSessionUpdatefocusAreasInput | string[]
    interviewGoal?: NullableStringFieldUpdateOperationsInput | string | null
    durationMins?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    mode?: StringFieldUpdateOperationsInput | string
    hintCount?: IntFieldUpdateOperationsInput | number
    testCasesPassed?: NullableIntFieldUpdateOperationsInput | number | null
    selectedLanguage?: NullableStringFieldUpdateOperationsInput | string | null
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    analysis?: AnalysisUpdateOneWithoutSessionNestedInput
  }

  export type InterviewSessionUncheckedUpdateWithoutQuestionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    interviewType?: StringFieldUpdateOperationsInput | string
    targetRole?: StringFieldUpdateOperationsInput | string
    targetCompany?: NullableStringFieldUpdateOperationsInput | string | null
    industry?: StringFieldUpdateOperationsInput | string
    experienceLevel?: EnumExperienceLevelFieldUpdateOperationsInput | $Enums.ExperienceLevel
    focusAreas?: InterviewSessionUpdatefocusAreasInput | string[]
    interviewGoal?: NullableStringFieldUpdateOperationsInput | string | null
    durationMins?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    mode?: StringFieldUpdateOperationsInput | string
    hintCount?: IntFieldUpdateOperationsInput | number
    testCasesPassed?: NullableIntFieldUpdateOperationsInput | number | null
    selectedLanguage?: NullableStringFieldUpdateOperationsInput | string | null
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    analysis?: AnalysisUncheckedUpdateOneWithoutSessionNestedInput
  }

  export type QuestionCreateManySessionInput = {
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
    evalStrengths?: QuestionCreateevalStrengthsInput | string[]
    evalWeaknesses?: QuestionCreateevalWeaknessesInput | string[]
    betterAnswer?: string | null
  }

  export type QuestionUpdateWithoutSessionInput = {
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
    evalStrengths?: QuestionUpdateevalStrengthsInput | string[]
    evalWeaknesses?: QuestionUpdateevalWeaknessesInput | string[]
    betterAnswer?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type QuestionUncheckedUpdateWithoutSessionInput = {
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
    evalStrengths?: QuestionUpdateevalStrengthsInput | string[]
    evalWeaknesses?: QuestionUpdateevalWeaknessesInput | string[]
    betterAnswer?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type QuestionUncheckedUpdateManyWithoutSessionInput = {
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
    evalStrengths?: QuestionUpdateevalStrengthsInput | string[]
    evalWeaknesses?: QuestionUpdateevalWeaknessesInput | string[]
    betterAnswer?: NullableStringFieldUpdateOperationsInput | string | null
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