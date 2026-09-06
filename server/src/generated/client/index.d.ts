
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
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model RefreshToken
 * 
 */
export type RefreshToken = $Result.DefaultSelection<Prisma.$RefreshTokenPayload>
/**
 * Model Resume
 * 
 */
export type Resume = $Result.DefaultSelection<Prisma.$ResumePayload>
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
 * Model Analysis
 * 
 */
export type Analysis = $Result.DefaultSelection<Prisma.$AnalysisPayload>
/**
 * Model ChatHistory
 * 
 */
export type ChatHistory = $Result.DefaultSelection<Prisma.$ChatHistoryPayload>
/**
 * Model TelemetryLog
 * 
 */
export type TelemetryLog = $Result.DefaultSelection<Prisma.$TelemetryLogPayload>
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
 * Enums
 */
export namespace $Enums {
  export const InterviewType: {
  INTERNSHIP: 'INTERNSHIP',
  JOB: 'JOB',
  PROMOTION: 'PROMOTION',
  PRACTICE: 'PRACTICE',
  HR_ROUND: 'HR_ROUND',
  COMMUNICATION: 'COMMUNICATION',
  SYSTEM_DESIGN: 'SYSTEM_DESIGN',
  DATA_SCIENCE: 'DATA_SCIENCE',
  PRODUCT_MANAGER: 'PRODUCT_MANAGER',
  STARTUP: 'STARTUP',
  CAREER_SWITCH: 'CAREER_SWITCH',
  LEADERSHIP: 'LEADERSHIP',
  CODING: 'CODING'
};

export type InterviewType = (typeof InterviewType)[keyof typeof InterviewType]


export const ExperienceLevel: {
  FRESHER: 'FRESHER',
  MID: 'MID',
  SENIOR: 'SENIOR'
};

export type ExperienceLevel = (typeof ExperienceLevel)[keyof typeof ExperienceLevel]


export const SessionStatus: {
  SETUP: 'SETUP',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  ANALYSED: 'ANALYSED'
};

export type SessionStatus = (typeof SessionStatus)[keyof typeof SessionStatus]


export const QuestionType: {
  TECHNICAL: 'TECHNICAL',
  BEHAVIOURAL: 'BEHAVIOURAL',
  SITUATIONAL: 'SITUATIONAL',
  RESUME_BASED: 'RESUME_BASED'
};

export type QuestionType = (typeof QuestionType)[keyof typeof QuestionType]


export const Difficulty: {
  EASY: 'EASY',
  MEDIUM: 'MEDIUM',
  HARD: 'HARD'
};

export type Difficulty = (typeof Difficulty)[keyof typeof Difficulty]


export const ReadinessVerdict: {
  NOT_READY: 'NOT_READY',
  ALMOST_READY: 'ALMOST_READY',
  READY: 'READY',
  STRONG: 'STRONG'
};

export type ReadinessVerdict = (typeof ReadinessVerdict)[keyof typeof ReadinessVerdict]


export const InterviewMode: {
  ORAL: 'ORAL',
  CODING: 'CODING'
};

export type InterviewMode = (typeof InterviewMode)[keyof typeof InterviewMode]

}

export type InterviewType = $Enums.InterviewType

export const InterviewType: typeof $Enums.InterviewType

export type ExperienceLevel = $Enums.ExperienceLevel

export const ExperienceLevel: typeof $Enums.ExperienceLevel

export type SessionStatus = $Enums.SessionStatus

export const SessionStatus: typeof $Enums.SessionStatus

export type QuestionType = $Enums.QuestionType

export const QuestionType: typeof $Enums.QuestionType

export type Difficulty = $Enums.Difficulty

export const Difficulty: typeof $Enums.Difficulty

export type ReadinessVerdict = $Enums.ReadinessVerdict

export const ReadinessVerdict: typeof $Enums.ReadinessVerdict

export type InterviewMode = $Enums.InterviewMode

export const InterviewMode: typeof $Enums.InterviewMode

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
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
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
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
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.refreshToken`: Exposes CRUD operations for the **RefreshToken** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more RefreshTokens
    * const refreshTokens = await prisma.refreshToken.findMany()
    * ```
    */
  get refreshToken(): Prisma.RefreshTokenDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.resume`: Exposes CRUD operations for the **Resume** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Resumes
    * const resumes = await prisma.resume.findMany()
    * ```
    */
  get resume(): Prisma.ResumeDelegate<ExtArgs, ClientOptions>;

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
   * `prisma.analysis`: Exposes CRUD operations for the **Analysis** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Analyses
    * const analyses = await prisma.analysis.findMany()
    * ```
    */
  get analysis(): Prisma.AnalysisDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.chatHistory`: Exposes CRUD operations for the **ChatHistory** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ChatHistories
    * const chatHistories = await prisma.chatHistory.findMany()
    * ```
    */
  get chatHistory(): Prisma.ChatHistoryDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.telemetryLog`: Exposes CRUD operations for the **TelemetryLog** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TelemetryLogs
    * const telemetryLogs = await prisma.telemetryLog.findMany()
    * ```
    */
  get telemetryLog(): Prisma.TelemetryLogDelegate<ExtArgs, ClientOptions>;

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
    User: 'User',
    RefreshToken: 'RefreshToken',
    Resume: 'Resume',
    InterviewSession: 'InterviewSession',
    Question: 'Question',
    Analysis: 'Analysis',
    ChatHistory: 'ChatHistory',
    TelemetryLog: 'TelemetryLog',
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
      modelProps: "user" | "refreshToken" | "resume" | "interviewSession" | "question" | "analysis" | "chatHistory" | "telemetryLog" | "preDefinedProblem" | "codeExecutionDelta"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      RefreshToken: {
        payload: Prisma.$RefreshTokenPayload<ExtArgs>
        fields: Prisma.RefreshTokenFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RefreshTokenFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RefreshTokenPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RefreshTokenFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RefreshTokenPayload>
          }
          findFirst: {
            args: Prisma.RefreshTokenFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RefreshTokenPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RefreshTokenFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RefreshTokenPayload>
          }
          findMany: {
            args: Prisma.RefreshTokenFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RefreshTokenPayload>[]
          }
          create: {
            args: Prisma.RefreshTokenCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RefreshTokenPayload>
          }
          createMany: {
            args: Prisma.RefreshTokenCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.RefreshTokenCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RefreshTokenPayload>[]
          }
          delete: {
            args: Prisma.RefreshTokenDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RefreshTokenPayload>
          }
          update: {
            args: Prisma.RefreshTokenUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RefreshTokenPayload>
          }
          deleteMany: {
            args: Prisma.RefreshTokenDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RefreshTokenUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.RefreshTokenUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RefreshTokenPayload>[]
          }
          upsert: {
            args: Prisma.RefreshTokenUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RefreshTokenPayload>
          }
          aggregate: {
            args: Prisma.RefreshTokenAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRefreshToken>
          }
          groupBy: {
            args: Prisma.RefreshTokenGroupByArgs<ExtArgs>
            result: $Utils.Optional<RefreshTokenGroupByOutputType>[]
          }
          count: {
            args: Prisma.RefreshTokenCountArgs<ExtArgs>
            result: $Utils.Optional<RefreshTokenCountAggregateOutputType> | number
          }
        }
      }
      Resume: {
        payload: Prisma.$ResumePayload<ExtArgs>
        fields: Prisma.ResumeFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ResumeFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResumePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ResumeFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResumePayload>
          }
          findFirst: {
            args: Prisma.ResumeFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResumePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ResumeFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResumePayload>
          }
          findMany: {
            args: Prisma.ResumeFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResumePayload>[]
          }
          create: {
            args: Prisma.ResumeCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResumePayload>
          }
          createMany: {
            args: Prisma.ResumeCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ResumeCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResumePayload>[]
          }
          delete: {
            args: Prisma.ResumeDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResumePayload>
          }
          update: {
            args: Prisma.ResumeUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResumePayload>
          }
          deleteMany: {
            args: Prisma.ResumeDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ResumeUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ResumeUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResumePayload>[]
          }
          upsert: {
            args: Prisma.ResumeUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResumePayload>
          }
          aggregate: {
            args: Prisma.ResumeAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateResume>
          }
          groupBy: {
            args: Prisma.ResumeGroupByArgs<ExtArgs>
            result: $Utils.Optional<ResumeGroupByOutputType>[]
          }
          count: {
            args: Prisma.ResumeCountArgs<ExtArgs>
            result: $Utils.Optional<ResumeCountAggregateOutputType> | number
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
      ChatHistory: {
        payload: Prisma.$ChatHistoryPayload<ExtArgs>
        fields: Prisma.ChatHistoryFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ChatHistoryFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatHistoryPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ChatHistoryFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatHistoryPayload>
          }
          findFirst: {
            args: Prisma.ChatHistoryFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatHistoryPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ChatHistoryFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatHistoryPayload>
          }
          findMany: {
            args: Prisma.ChatHistoryFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatHistoryPayload>[]
          }
          create: {
            args: Prisma.ChatHistoryCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatHistoryPayload>
          }
          createMany: {
            args: Prisma.ChatHistoryCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ChatHistoryCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatHistoryPayload>[]
          }
          delete: {
            args: Prisma.ChatHistoryDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatHistoryPayload>
          }
          update: {
            args: Prisma.ChatHistoryUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatHistoryPayload>
          }
          deleteMany: {
            args: Prisma.ChatHistoryDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ChatHistoryUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ChatHistoryUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatHistoryPayload>[]
          }
          upsert: {
            args: Prisma.ChatHistoryUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatHistoryPayload>
          }
          aggregate: {
            args: Prisma.ChatHistoryAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateChatHistory>
          }
          groupBy: {
            args: Prisma.ChatHistoryGroupByArgs<ExtArgs>
            result: $Utils.Optional<ChatHistoryGroupByOutputType>[]
          }
          count: {
            args: Prisma.ChatHistoryCountArgs<ExtArgs>
            result: $Utils.Optional<ChatHistoryCountAggregateOutputType> | number
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
    user?: UserOmit
    refreshToken?: RefreshTokenOmit
    resume?: ResumeOmit
    interviewSession?: InterviewSessionOmit
    question?: QuestionOmit
    analysis?: AnalysisOmit
    chatHistory?: ChatHistoryOmit
    telemetryLog?: TelemetryLogOmit
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
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    sessions: number
    resumes: number
    refreshTokens: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sessions?: boolean | UserCountOutputTypeCountSessionsArgs
    resumes?: boolean | UserCountOutputTypeCountResumesArgs
    refreshTokens?: boolean | UserCountOutputTypeCountRefreshTokensArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountSessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: InterviewSessionWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountResumesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ResumeWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountRefreshTokensArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RefreshTokenWhereInput
  }


  /**
   * Count Type ResumeCountOutputType
   */

  export type ResumeCountOutputType = {
    sessions: number
  }

  export type ResumeCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sessions?: boolean | ResumeCountOutputTypeCountSessionsArgs
  }

  // Custom InputTypes
  /**
   * ResumeCountOutputType without action
   */
  export type ResumeCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ResumeCountOutputType
     */
    select?: ResumeCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ResumeCountOutputType without action
   */
  export type ResumeCountOutputTypeCountSessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: InterviewSessionWhereInput
  }


  /**
   * Count Type InterviewSessionCountOutputType
   */

  export type InterviewSessionCountOutputType = {
    questions: number
    chatHistory: number
    telemetryLogs: number
    codeExecutionDeltas: number
  }

  export type InterviewSessionCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    questions?: boolean | InterviewSessionCountOutputTypeCountQuestionsArgs
    chatHistory?: boolean | InterviewSessionCountOutputTypeCountChatHistoryArgs
    telemetryLogs?: boolean | InterviewSessionCountOutputTypeCountTelemetryLogsArgs
    codeExecutionDeltas?: boolean | InterviewSessionCountOutputTypeCountCodeExecutionDeltasArgs
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
   * InterviewSessionCountOutputType without action
   */
  export type InterviewSessionCountOutputTypeCountChatHistoryArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ChatHistoryWhereInput
  }

  /**
   * InterviewSessionCountOutputType without action
   */
  export type InterviewSessionCountOutputTypeCountTelemetryLogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TelemetryLogWhereInput
  }

  /**
   * InterviewSessionCountOutputType without action
   */
  export type InterviewSessionCountOutputTypeCountCodeExecutionDeltasArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CodeExecutionDeltaWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    email: string | null
    passwordHash: string | null
    name: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    email: string | null
    passwordHash: string | null
    name: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    email: number
    passwordHash: number
    name: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    email?: true
    passwordHash?: true
    name?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    email?: true
    passwordHash?: true
    name?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    email?: true
    passwordHash?: true
    name?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    email: string
    passwordHash: string
    name: string
    createdAt: Date
    updatedAt: Date
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    passwordHash?: boolean
    name?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    sessions?: boolean | User$sessionsArgs<ExtArgs>
    resumes?: boolean | User$resumesArgs<ExtArgs>
    refreshTokens?: boolean | User$refreshTokensArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    passwordHash?: boolean
    name?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    passwordHash?: boolean
    name?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    email?: boolean
    passwordHash?: boolean
    name?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "email" | "passwordHash" | "name" | "createdAt" | "updatedAt", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sessions?: boolean | User$sessionsArgs<ExtArgs>
    resumes?: boolean | User$resumesArgs<ExtArgs>
    refreshTokens?: boolean | User$refreshTokensArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      sessions: Prisma.$InterviewSessionPayload<ExtArgs>[]
      resumes: Prisma.$ResumePayload<ExtArgs>[]
      refreshTokens: Prisma.$RefreshTokenPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      email: string
      passwordHash: string
      name: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
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
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
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
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    sessions<T extends User$sessionsArgs<ExtArgs> = {}>(args?: Subset<T, User$sessionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InterviewSessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    resumes<T extends User$resumesArgs<ExtArgs> = {}>(args?: Subset<T, User$resumesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ResumePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    refreshTokens<T extends User$refreshTokensArgs<ExtArgs> = {}>(args?: Subset<T, User$refreshTokensArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RefreshTokenPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly passwordHash: FieldRef<"User", 'String'>
    readonly name: FieldRef<"User", 'String'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.sessions
   */
  export type User$sessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
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
    where?: InterviewSessionWhereInput
    orderBy?: InterviewSessionOrderByWithRelationInput | InterviewSessionOrderByWithRelationInput[]
    cursor?: InterviewSessionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: InterviewSessionScalarFieldEnum | InterviewSessionScalarFieldEnum[]
  }

  /**
   * User.resumes
   */
  export type User$resumesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Resume
     */
    select?: ResumeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Resume
     */
    omit?: ResumeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResumeInclude<ExtArgs> | null
    where?: ResumeWhereInput
    orderBy?: ResumeOrderByWithRelationInput | ResumeOrderByWithRelationInput[]
    cursor?: ResumeWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ResumeScalarFieldEnum | ResumeScalarFieldEnum[]
  }

  /**
   * User.refreshTokens
   */
  export type User$refreshTokensArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RefreshToken
     */
    select?: RefreshTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RefreshToken
     */
    omit?: RefreshTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RefreshTokenInclude<ExtArgs> | null
    where?: RefreshTokenWhereInput
    orderBy?: RefreshTokenOrderByWithRelationInput | RefreshTokenOrderByWithRelationInput[]
    cursor?: RefreshTokenWhereUniqueInput
    take?: number
    skip?: number
    distinct?: RefreshTokenScalarFieldEnum | RefreshTokenScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model RefreshToken
   */

  export type AggregateRefreshToken = {
    _count: RefreshTokenCountAggregateOutputType | null
    _min: RefreshTokenMinAggregateOutputType | null
    _max: RefreshTokenMaxAggregateOutputType | null
  }

  export type RefreshTokenMinAggregateOutputType = {
    id: string | null
    userId: string | null
    tokenId: string | null
    expiresAt: Date | null
    createdAt: Date | null
  }

  export type RefreshTokenMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    tokenId: string | null
    expiresAt: Date | null
    createdAt: Date | null
  }

  export type RefreshTokenCountAggregateOutputType = {
    id: number
    userId: number
    tokenId: number
    expiresAt: number
    createdAt: number
    _all: number
  }


  export type RefreshTokenMinAggregateInputType = {
    id?: true
    userId?: true
    tokenId?: true
    expiresAt?: true
    createdAt?: true
  }

  export type RefreshTokenMaxAggregateInputType = {
    id?: true
    userId?: true
    tokenId?: true
    expiresAt?: true
    createdAt?: true
  }

  export type RefreshTokenCountAggregateInputType = {
    id?: true
    userId?: true
    tokenId?: true
    expiresAt?: true
    createdAt?: true
    _all?: true
  }

  export type RefreshTokenAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RefreshToken to aggregate.
     */
    where?: RefreshTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RefreshTokens to fetch.
     */
    orderBy?: RefreshTokenOrderByWithRelationInput | RefreshTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RefreshTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RefreshTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RefreshTokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned RefreshTokens
    **/
    _count?: true | RefreshTokenCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RefreshTokenMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RefreshTokenMaxAggregateInputType
  }

  export type GetRefreshTokenAggregateType<T extends RefreshTokenAggregateArgs> = {
        [P in keyof T & keyof AggregateRefreshToken]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRefreshToken[P]>
      : GetScalarType<T[P], AggregateRefreshToken[P]>
  }




  export type RefreshTokenGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RefreshTokenWhereInput
    orderBy?: RefreshTokenOrderByWithAggregationInput | RefreshTokenOrderByWithAggregationInput[]
    by: RefreshTokenScalarFieldEnum[] | RefreshTokenScalarFieldEnum
    having?: RefreshTokenScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RefreshTokenCountAggregateInputType | true
    _min?: RefreshTokenMinAggregateInputType
    _max?: RefreshTokenMaxAggregateInputType
  }

  export type RefreshTokenGroupByOutputType = {
    id: string
    userId: string
    tokenId: string
    expiresAt: Date
    createdAt: Date
    _count: RefreshTokenCountAggregateOutputType | null
    _min: RefreshTokenMinAggregateOutputType | null
    _max: RefreshTokenMaxAggregateOutputType | null
  }

  type GetRefreshTokenGroupByPayload<T extends RefreshTokenGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RefreshTokenGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RefreshTokenGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RefreshTokenGroupByOutputType[P]>
            : GetScalarType<T[P], RefreshTokenGroupByOutputType[P]>
        }
      >
    >


  export type RefreshTokenSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    tokenId?: boolean
    expiresAt?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["refreshToken"]>

  export type RefreshTokenSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    tokenId?: boolean
    expiresAt?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["refreshToken"]>

  export type RefreshTokenSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    tokenId?: boolean
    expiresAt?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["refreshToken"]>

  export type RefreshTokenSelectScalar = {
    id?: boolean
    userId?: boolean
    tokenId?: boolean
    expiresAt?: boolean
    createdAt?: boolean
  }

  export type RefreshTokenOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "tokenId" | "expiresAt" | "createdAt", ExtArgs["result"]["refreshToken"]>
  export type RefreshTokenInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type RefreshTokenIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type RefreshTokenIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $RefreshTokenPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "RefreshToken"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      tokenId: string
      expiresAt: Date
      createdAt: Date
    }, ExtArgs["result"]["refreshToken"]>
    composites: {}
  }

  type RefreshTokenGetPayload<S extends boolean | null | undefined | RefreshTokenDefaultArgs> = $Result.GetResult<Prisma.$RefreshTokenPayload, S>

  type RefreshTokenCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<RefreshTokenFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: RefreshTokenCountAggregateInputType | true
    }

  export interface RefreshTokenDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['RefreshToken'], meta: { name: 'RefreshToken' } }
    /**
     * Find zero or one RefreshToken that matches the filter.
     * @param {RefreshTokenFindUniqueArgs} args - Arguments to find a RefreshToken
     * @example
     * // Get one RefreshToken
     * const refreshToken = await prisma.refreshToken.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RefreshTokenFindUniqueArgs>(args: SelectSubset<T, RefreshTokenFindUniqueArgs<ExtArgs>>): Prisma__RefreshTokenClient<$Result.GetResult<Prisma.$RefreshTokenPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one RefreshToken that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {RefreshTokenFindUniqueOrThrowArgs} args - Arguments to find a RefreshToken
     * @example
     * // Get one RefreshToken
     * const refreshToken = await prisma.refreshToken.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RefreshTokenFindUniqueOrThrowArgs>(args: SelectSubset<T, RefreshTokenFindUniqueOrThrowArgs<ExtArgs>>): Prisma__RefreshTokenClient<$Result.GetResult<Prisma.$RefreshTokenPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first RefreshToken that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RefreshTokenFindFirstArgs} args - Arguments to find a RefreshToken
     * @example
     * // Get one RefreshToken
     * const refreshToken = await prisma.refreshToken.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RefreshTokenFindFirstArgs>(args?: SelectSubset<T, RefreshTokenFindFirstArgs<ExtArgs>>): Prisma__RefreshTokenClient<$Result.GetResult<Prisma.$RefreshTokenPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first RefreshToken that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RefreshTokenFindFirstOrThrowArgs} args - Arguments to find a RefreshToken
     * @example
     * // Get one RefreshToken
     * const refreshToken = await prisma.refreshToken.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RefreshTokenFindFirstOrThrowArgs>(args?: SelectSubset<T, RefreshTokenFindFirstOrThrowArgs<ExtArgs>>): Prisma__RefreshTokenClient<$Result.GetResult<Prisma.$RefreshTokenPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more RefreshTokens that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RefreshTokenFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all RefreshTokens
     * const refreshTokens = await prisma.refreshToken.findMany()
     * 
     * // Get first 10 RefreshTokens
     * const refreshTokens = await prisma.refreshToken.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const refreshTokenWithIdOnly = await prisma.refreshToken.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends RefreshTokenFindManyArgs>(args?: SelectSubset<T, RefreshTokenFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RefreshTokenPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a RefreshToken.
     * @param {RefreshTokenCreateArgs} args - Arguments to create a RefreshToken.
     * @example
     * // Create one RefreshToken
     * const RefreshToken = await prisma.refreshToken.create({
     *   data: {
     *     // ... data to create a RefreshToken
     *   }
     * })
     * 
     */
    create<T extends RefreshTokenCreateArgs>(args: SelectSubset<T, RefreshTokenCreateArgs<ExtArgs>>): Prisma__RefreshTokenClient<$Result.GetResult<Prisma.$RefreshTokenPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many RefreshTokens.
     * @param {RefreshTokenCreateManyArgs} args - Arguments to create many RefreshTokens.
     * @example
     * // Create many RefreshTokens
     * const refreshToken = await prisma.refreshToken.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends RefreshTokenCreateManyArgs>(args?: SelectSubset<T, RefreshTokenCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many RefreshTokens and returns the data saved in the database.
     * @param {RefreshTokenCreateManyAndReturnArgs} args - Arguments to create many RefreshTokens.
     * @example
     * // Create many RefreshTokens
     * const refreshToken = await prisma.refreshToken.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many RefreshTokens and only return the `id`
     * const refreshTokenWithIdOnly = await prisma.refreshToken.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends RefreshTokenCreateManyAndReturnArgs>(args?: SelectSubset<T, RefreshTokenCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RefreshTokenPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a RefreshToken.
     * @param {RefreshTokenDeleteArgs} args - Arguments to delete one RefreshToken.
     * @example
     * // Delete one RefreshToken
     * const RefreshToken = await prisma.refreshToken.delete({
     *   where: {
     *     // ... filter to delete one RefreshToken
     *   }
     * })
     * 
     */
    delete<T extends RefreshTokenDeleteArgs>(args: SelectSubset<T, RefreshTokenDeleteArgs<ExtArgs>>): Prisma__RefreshTokenClient<$Result.GetResult<Prisma.$RefreshTokenPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one RefreshToken.
     * @param {RefreshTokenUpdateArgs} args - Arguments to update one RefreshToken.
     * @example
     * // Update one RefreshToken
     * const refreshToken = await prisma.refreshToken.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends RefreshTokenUpdateArgs>(args: SelectSubset<T, RefreshTokenUpdateArgs<ExtArgs>>): Prisma__RefreshTokenClient<$Result.GetResult<Prisma.$RefreshTokenPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more RefreshTokens.
     * @param {RefreshTokenDeleteManyArgs} args - Arguments to filter RefreshTokens to delete.
     * @example
     * // Delete a few RefreshTokens
     * const { count } = await prisma.refreshToken.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends RefreshTokenDeleteManyArgs>(args?: SelectSubset<T, RefreshTokenDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RefreshTokens.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RefreshTokenUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many RefreshTokens
     * const refreshToken = await prisma.refreshToken.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends RefreshTokenUpdateManyArgs>(args: SelectSubset<T, RefreshTokenUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RefreshTokens and returns the data updated in the database.
     * @param {RefreshTokenUpdateManyAndReturnArgs} args - Arguments to update many RefreshTokens.
     * @example
     * // Update many RefreshTokens
     * const refreshToken = await prisma.refreshToken.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more RefreshTokens and only return the `id`
     * const refreshTokenWithIdOnly = await prisma.refreshToken.updateManyAndReturn({
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
    updateManyAndReturn<T extends RefreshTokenUpdateManyAndReturnArgs>(args: SelectSubset<T, RefreshTokenUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RefreshTokenPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one RefreshToken.
     * @param {RefreshTokenUpsertArgs} args - Arguments to update or create a RefreshToken.
     * @example
     * // Update or create a RefreshToken
     * const refreshToken = await prisma.refreshToken.upsert({
     *   create: {
     *     // ... data to create a RefreshToken
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the RefreshToken we want to update
     *   }
     * })
     */
    upsert<T extends RefreshTokenUpsertArgs>(args: SelectSubset<T, RefreshTokenUpsertArgs<ExtArgs>>): Prisma__RefreshTokenClient<$Result.GetResult<Prisma.$RefreshTokenPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of RefreshTokens.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RefreshTokenCountArgs} args - Arguments to filter RefreshTokens to count.
     * @example
     * // Count the number of RefreshTokens
     * const count = await prisma.refreshToken.count({
     *   where: {
     *     // ... the filter for the RefreshTokens we want to count
     *   }
     * })
    **/
    count<T extends RefreshTokenCountArgs>(
      args?: Subset<T, RefreshTokenCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RefreshTokenCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a RefreshToken.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RefreshTokenAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends RefreshTokenAggregateArgs>(args: Subset<T, RefreshTokenAggregateArgs>): Prisma.PrismaPromise<GetRefreshTokenAggregateType<T>>

    /**
     * Group by RefreshToken.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RefreshTokenGroupByArgs} args - Group by arguments.
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
      T extends RefreshTokenGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RefreshTokenGroupByArgs['orderBy'] }
        : { orderBy?: RefreshTokenGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, RefreshTokenGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRefreshTokenGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the RefreshToken model
   */
  readonly fields: RefreshTokenFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for RefreshToken.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RefreshTokenClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the RefreshToken model
   */
  interface RefreshTokenFieldRefs {
    readonly id: FieldRef<"RefreshToken", 'String'>
    readonly userId: FieldRef<"RefreshToken", 'String'>
    readonly tokenId: FieldRef<"RefreshToken", 'String'>
    readonly expiresAt: FieldRef<"RefreshToken", 'DateTime'>
    readonly createdAt: FieldRef<"RefreshToken", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * RefreshToken findUnique
   */
  export type RefreshTokenFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RefreshToken
     */
    select?: RefreshTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RefreshToken
     */
    omit?: RefreshTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RefreshTokenInclude<ExtArgs> | null
    /**
     * Filter, which RefreshToken to fetch.
     */
    where: RefreshTokenWhereUniqueInput
  }

  /**
   * RefreshToken findUniqueOrThrow
   */
  export type RefreshTokenFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RefreshToken
     */
    select?: RefreshTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RefreshToken
     */
    omit?: RefreshTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RefreshTokenInclude<ExtArgs> | null
    /**
     * Filter, which RefreshToken to fetch.
     */
    where: RefreshTokenWhereUniqueInput
  }

  /**
   * RefreshToken findFirst
   */
  export type RefreshTokenFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RefreshToken
     */
    select?: RefreshTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RefreshToken
     */
    omit?: RefreshTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RefreshTokenInclude<ExtArgs> | null
    /**
     * Filter, which RefreshToken to fetch.
     */
    where?: RefreshTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RefreshTokens to fetch.
     */
    orderBy?: RefreshTokenOrderByWithRelationInput | RefreshTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RefreshTokens.
     */
    cursor?: RefreshTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RefreshTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RefreshTokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RefreshTokens.
     */
    distinct?: RefreshTokenScalarFieldEnum | RefreshTokenScalarFieldEnum[]
  }

  /**
   * RefreshToken findFirstOrThrow
   */
  export type RefreshTokenFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RefreshToken
     */
    select?: RefreshTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RefreshToken
     */
    omit?: RefreshTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RefreshTokenInclude<ExtArgs> | null
    /**
     * Filter, which RefreshToken to fetch.
     */
    where?: RefreshTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RefreshTokens to fetch.
     */
    orderBy?: RefreshTokenOrderByWithRelationInput | RefreshTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RefreshTokens.
     */
    cursor?: RefreshTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RefreshTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RefreshTokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RefreshTokens.
     */
    distinct?: RefreshTokenScalarFieldEnum | RefreshTokenScalarFieldEnum[]
  }

  /**
   * RefreshToken findMany
   */
  export type RefreshTokenFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RefreshToken
     */
    select?: RefreshTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RefreshToken
     */
    omit?: RefreshTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RefreshTokenInclude<ExtArgs> | null
    /**
     * Filter, which RefreshTokens to fetch.
     */
    where?: RefreshTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RefreshTokens to fetch.
     */
    orderBy?: RefreshTokenOrderByWithRelationInput | RefreshTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing RefreshTokens.
     */
    cursor?: RefreshTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RefreshTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RefreshTokens.
     */
    skip?: number
    distinct?: RefreshTokenScalarFieldEnum | RefreshTokenScalarFieldEnum[]
  }

  /**
   * RefreshToken create
   */
  export type RefreshTokenCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RefreshToken
     */
    select?: RefreshTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RefreshToken
     */
    omit?: RefreshTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RefreshTokenInclude<ExtArgs> | null
    /**
     * The data needed to create a RefreshToken.
     */
    data: XOR<RefreshTokenCreateInput, RefreshTokenUncheckedCreateInput>
  }

  /**
   * RefreshToken createMany
   */
  export type RefreshTokenCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many RefreshTokens.
     */
    data: RefreshTokenCreateManyInput | RefreshTokenCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * RefreshToken createManyAndReturn
   */
  export type RefreshTokenCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RefreshToken
     */
    select?: RefreshTokenSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the RefreshToken
     */
    omit?: RefreshTokenOmit<ExtArgs> | null
    /**
     * The data used to create many RefreshTokens.
     */
    data: RefreshTokenCreateManyInput | RefreshTokenCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RefreshTokenIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * RefreshToken update
   */
  export type RefreshTokenUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RefreshToken
     */
    select?: RefreshTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RefreshToken
     */
    omit?: RefreshTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RefreshTokenInclude<ExtArgs> | null
    /**
     * The data needed to update a RefreshToken.
     */
    data: XOR<RefreshTokenUpdateInput, RefreshTokenUncheckedUpdateInput>
    /**
     * Choose, which RefreshToken to update.
     */
    where: RefreshTokenWhereUniqueInput
  }

  /**
   * RefreshToken updateMany
   */
  export type RefreshTokenUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update RefreshTokens.
     */
    data: XOR<RefreshTokenUpdateManyMutationInput, RefreshTokenUncheckedUpdateManyInput>
    /**
     * Filter which RefreshTokens to update
     */
    where?: RefreshTokenWhereInput
    /**
     * Limit how many RefreshTokens to update.
     */
    limit?: number
  }

  /**
   * RefreshToken updateManyAndReturn
   */
  export type RefreshTokenUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RefreshToken
     */
    select?: RefreshTokenSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the RefreshToken
     */
    omit?: RefreshTokenOmit<ExtArgs> | null
    /**
     * The data used to update RefreshTokens.
     */
    data: XOR<RefreshTokenUpdateManyMutationInput, RefreshTokenUncheckedUpdateManyInput>
    /**
     * Filter which RefreshTokens to update
     */
    where?: RefreshTokenWhereInput
    /**
     * Limit how many RefreshTokens to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RefreshTokenIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * RefreshToken upsert
   */
  export type RefreshTokenUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RefreshToken
     */
    select?: RefreshTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RefreshToken
     */
    omit?: RefreshTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RefreshTokenInclude<ExtArgs> | null
    /**
     * The filter to search for the RefreshToken to update in case it exists.
     */
    where: RefreshTokenWhereUniqueInput
    /**
     * In case the RefreshToken found by the `where` argument doesn't exist, create a new RefreshToken with this data.
     */
    create: XOR<RefreshTokenCreateInput, RefreshTokenUncheckedCreateInput>
    /**
     * In case the RefreshToken was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RefreshTokenUpdateInput, RefreshTokenUncheckedUpdateInput>
  }

  /**
   * RefreshToken delete
   */
  export type RefreshTokenDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RefreshToken
     */
    select?: RefreshTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RefreshToken
     */
    omit?: RefreshTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RefreshTokenInclude<ExtArgs> | null
    /**
     * Filter which RefreshToken to delete.
     */
    where: RefreshTokenWhereUniqueInput
  }

  /**
   * RefreshToken deleteMany
   */
  export type RefreshTokenDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RefreshTokens to delete
     */
    where?: RefreshTokenWhereInput
    /**
     * Limit how many RefreshTokens to delete.
     */
    limit?: number
  }

  /**
   * RefreshToken without action
   */
  export type RefreshTokenDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RefreshToken
     */
    select?: RefreshTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RefreshToken
     */
    omit?: RefreshTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RefreshTokenInclude<ExtArgs> | null
  }


  /**
   * Model Resume
   */

  export type AggregateResume = {
    _count: ResumeCountAggregateOutputType | null
    _min: ResumeMinAggregateOutputType | null
    _max: ResumeMaxAggregateOutputType | null
  }

  export type ResumeMinAggregateOutputType = {
    id: string | null
    userId: string | null
    fileName: string | null
    filePath: string | null
    parsedText: string | null
    uploadedAt: Date | null
  }

  export type ResumeMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    fileName: string | null
    filePath: string | null
    parsedText: string | null
    uploadedAt: Date | null
  }

  export type ResumeCountAggregateOutputType = {
    id: number
    userId: number
    fileName: number
    filePath: number
    parsedText: number
    skills: number
    experience: number
    uploadedAt: number
    _all: number
  }


  export type ResumeMinAggregateInputType = {
    id?: true
    userId?: true
    fileName?: true
    filePath?: true
    parsedText?: true
    uploadedAt?: true
  }

  export type ResumeMaxAggregateInputType = {
    id?: true
    userId?: true
    fileName?: true
    filePath?: true
    parsedText?: true
    uploadedAt?: true
  }

  export type ResumeCountAggregateInputType = {
    id?: true
    userId?: true
    fileName?: true
    filePath?: true
    parsedText?: true
    skills?: true
    experience?: true
    uploadedAt?: true
    _all?: true
  }

  export type ResumeAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Resume to aggregate.
     */
    where?: ResumeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Resumes to fetch.
     */
    orderBy?: ResumeOrderByWithRelationInput | ResumeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ResumeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Resumes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Resumes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Resumes
    **/
    _count?: true | ResumeCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ResumeMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ResumeMaxAggregateInputType
  }

  export type GetResumeAggregateType<T extends ResumeAggregateArgs> = {
        [P in keyof T & keyof AggregateResume]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateResume[P]>
      : GetScalarType<T[P], AggregateResume[P]>
  }




  export type ResumeGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ResumeWhereInput
    orderBy?: ResumeOrderByWithAggregationInput | ResumeOrderByWithAggregationInput[]
    by: ResumeScalarFieldEnum[] | ResumeScalarFieldEnum
    having?: ResumeScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ResumeCountAggregateInputType | true
    _min?: ResumeMinAggregateInputType
    _max?: ResumeMaxAggregateInputType
  }

  export type ResumeGroupByOutputType = {
    id: string
    userId: string
    fileName: string
    filePath: string
    parsedText: string | null
    skills: string[]
    experience: JsonValue | null
    uploadedAt: Date
    _count: ResumeCountAggregateOutputType | null
    _min: ResumeMinAggregateOutputType | null
    _max: ResumeMaxAggregateOutputType | null
  }

  type GetResumeGroupByPayload<T extends ResumeGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ResumeGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ResumeGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ResumeGroupByOutputType[P]>
            : GetScalarType<T[P], ResumeGroupByOutputType[P]>
        }
      >
    >


  export type ResumeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    fileName?: boolean
    filePath?: boolean
    parsedText?: boolean
    skills?: boolean
    experience?: boolean
    uploadedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    sessions?: boolean | Resume$sessionsArgs<ExtArgs>
    _count?: boolean | ResumeCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["resume"]>

  export type ResumeSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    fileName?: boolean
    filePath?: boolean
    parsedText?: boolean
    skills?: boolean
    experience?: boolean
    uploadedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["resume"]>

  export type ResumeSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    fileName?: boolean
    filePath?: boolean
    parsedText?: boolean
    skills?: boolean
    experience?: boolean
    uploadedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["resume"]>

  export type ResumeSelectScalar = {
    id?: boolean
    userId?: boolean
    fileName?: boolean
    filePath?: boolean
    parsedText?: boolean
    skills?: boolean
    experience?: boolean
    uploadedAt?: boolean
  }

  export type ResumeOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "fileName" | "filePath" | "parsedText" | "skills" | "experience" | "uploadedAt", ExtArgs["result"]["resume"]>
  export type ResumeInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    sessions?: boolean | Resume$sessionsArgs<ExtArgs>
    _count?: boolean | ResumeCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ResumeIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type ResumeIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $ResumePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Resume"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      sessions: Prisma.$InterviewSessionPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      fileName: string
      filePath: string
      parsedText: string | null
      skills: string[]
      experience: Prisma.JsonValue | null
      uploadedAt: Date
    }, ExtArgs["result"]["resume"]>
    composites: {}
  }

  type ResumeGetPayload<S extends boolean | null | undefined | ResumeDefaultArgs> = $Result.GetResult<Prisma.$ResumePayload, S>

  type ResumeCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ResumeFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ResumeCountAggregateInputType | true
    }

  export interface ResumeDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Resume'], meta: { name: 'Resume' } }
    /**
     * Find zero or one Resume that matches the filter.
     * @param {ResumeFindUniqueArgs} args - Arguments to find a Resume
     * @example
     * // Get one Resume
     * const resume = await prisma.resume.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ResumeFindUniqueArgs>(args: SelectSubset<T, ResumeFindUniqueArgs<ExtArgs>>): Prisma__ResumeClient<$Result.GetResult<Prisma.$ResumePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Resume that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ResumeFindUniqueOrThrowArgs} args - Arguments to find a Resume
     * @example
     * // Get one Resume
     * const resume = await prisma.resume.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ResumeFindUniqueOrThrowArgs>(args: SelectSubset<T, ResumeFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ResumeClient<$Result.GetResult<Prisma.$ResumePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Resume that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ResumeFindFirstArgs} args - Arguments to find a Resume
     * @example
     * // Get one Resume
     * const resume = await prisma.resume.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ResumeFindFirstArgs>(args?: SelectSubset<T, ResumeFindFirstArgs<ExtArgs>>): Prisma__ResumeClient<$Result.GetResult<Prisma.$ResumePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Resume that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ResumeFindFirstOrThrowArgs} args - Arguments to find a Resume
     * @example
     * // Get one Resume
     * const resume = await prisma.resume.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ResumeFindFirstOrThrowArgs>(args?: SelectSubset<T, ResumeFindFirstOrThrowArgs<ExtArgs>>): Prisma__ResumeClient<$Result.GetResult<Prisma.$ResumePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Resumes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ResumeFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Resumes
     * const resumes = await prisma.resume.findMany()
     * 
     * // Get first 10 Resumes
     * const resumes = await prisma.resume.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const resumeWithIdOnly = await prisma.resume.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ResumeFindManyArgs>(args?: SelectSubset<T, ResumeFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ResumePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Resume.
     * @param {ResumeCreateArgs} args - Arguments to create a Resume.
     * @example
     * // Create one Resume
     * const Resume = await prisma.resume.create({
     *   data: {
     *     // ... data to create a Resume
     *   }
     * })
     * 
     */
    create<T extends ResumeCreateArgs>(args: SelectSubset<T, ResumeCreateArgs<ExtArgs>>): Prisma__ResumeClient<$Result.GetResult<Prisma.$ResumePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Resumes.
     * @param {ResumeCreateManyArgs} args - Arguments to create many Resumes.
     * @example
     * // Create many Resumes
     * const resume = await prisma.resume.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ResumeCreateManyArgs>(args?: SelectSubset<T, ResumeCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Resumes and returns the data saved in the database.
     * @param {ResumeCreateManyAndReturnArgs} args - Arguments to create many Resumes.
     * @example
     * // Create many Resumes
     * const resume = await prisma.resume.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Resumes and only return the `id`
     * const resumeWithIdOnly = await prisma.resume.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ResumeCreateManyAndReturnArgs>(args?: SelectSubset<T, ResumeCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ResumePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Resume.
     * @param {ResumeDeleteArgs} args - Arguments to delete one Resume.
     * @example
     * // Delete one Resume
     * const Resume = await prisma.resume.delete({
     *   where: {
     *     // ... filter to delete one Resume
     *   }
     * })
     * 
     */
    delete<T extends ResumeDeleteArgs>(args: SelectSubset<T, ResumeDeleteArgs<ExtArgs>>): Prisma__ResumeClient<$Result.GetResult<Prisma.$ResumePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Resume.
     * @param {ResumeUpdateArgs} args - Arguments to update one Resume.
     * @example
     * // Update one Resume
     * const resume = await prisma.resume.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ResumeUpdateArgs>(args: SelectSubset<T, ResumeUpdateArgs<ExtArgs>>): Prisma__ResumeClient<$Result.GetResult<Prisma.$ResumePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Resumes.
     * @param {ResumeDeleteManyArgs} args - Arguments to filter Resumes to delete.
     * @example
     * // Delete a few Resumes
     * const { count } = await prisma.resume.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ResumeDeleteManyArgs>(args?: SelectSubset<T, ResumeDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Resumes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ResumeUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Resumes
     * const resume = await prisma.resume.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ResumeUpdateManyArgs>(args: SelectSubset<T, ResumeUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Resumes and returns the data updated in the database.
     * @param {ResumeUpdateManyAndReturnArgs} args - Arguments to update many Resumes.
     * @example
     * // Update many Resumes
     * const resume = await prisma.resume.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Resumes and only return the `id`
     * const resumeWithIdOnly = await prisma.resume.updateManyAndReturn({
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
    updateManyAndReturn<T extends ResumeUpdateManyAndReturnArgs>(args: SelectSubset<T, ResumeUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ResumePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Resume.
     * @param {ResumeUpsertArgs} args - Arguments to update or create a Resume.
     * @example
     * // Update or create a Resume
     * const resume = await prisma.resume.upsert({
     *   create: {
     *     // ... data to create a Resume
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Resume we want to update
     *   }
     * })
     */
    upsert<T extends ResumeUpsertArgs>(args: SelectSubset<T, ResumeUpsertArgs<ExtArgs>>): Prisma__ResumeClient<$Result.GetResult<Prisma.$ResumePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Resumes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ResumeCountArgs} args - Arguments to filter Resumes to count.
     * @example
     * // Count the number of Resumes
     * const count = await prisma.resume.count({
     *   where: {
     *     // ... the filter for the Resumes we want to count
     *   }
     * })
    **/
    count<T extends ResumeCountArgs>(
      args?: Subset<T, ResumeCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ResumeCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Resume.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ResumeAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ResumeAggregateArgs>(args: Subset<T, ResumeAggregateArgs>): Prisma.PrismaPromise<GetResumeAggregateType<T>>

    /**
     * Group by Resume.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ResumeGroupByArgs} args - Group by arguments.
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
      T extends ResumeGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ResumeGroupByArgs['orderBy'] }
        : { orderBy?: ResumeGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ResumeGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetResumeGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Resume model
   */
  readonly fields: ResumeFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Resume.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ResumeClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    sessions<T extends Resume$sessionsArgs<ExtArgs> = {}>(args?: Subset<T, Resume$sessionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InterviewSessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the Resume model
   */
  interface ResumeFieldRefs {
    readonly id: FieldRef<"Resume", 'String'>
    readonly userId: FieldRef<"Resume", 'String'>
    readonly fileName: FieldRef<"Resume", 'String'>
    readonly filePath: FieldRef<"Resume", 'String'>
    readonly parsedText: FieldRef<"Resume", 'String'>
    readonly skills: FieldRef<"Resume", 'String[]'>
    readonly experience: FieldRef<"Resume", 'Json'>
    readonly uploadedAt: FieldRef<"Resume", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Resume findUnique
   */
  export type ResumeFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Resume
     */
    select?: ResumeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Resume
     */
    omit?: ResumeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResumeInclude<ExtArgs> | null
    /**
     * Filter, which Resume to fetch.
     */
    where: ResumeWhereUniqueInput
  }

  /**
   * Resume findUniqueOrThrow
   */
  export type ResumeFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Resume
     */
    select?: ResumeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Resume
     */
    omit?: ResumeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResumeInclude<ExtArgs> | null
    /**
     * Filter, which Resume to fetch.
     */
    where: ResumeWhereUniqueInput
  }

  /**
   * Resume findFirst
   */
  export type ResumeFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Resume
     */
    select?: ResumeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Resume
     */
    omit?: ResumeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResumeInclude<ExtArgs> | null
    /**
     * Filter, which Resume to fetch.
     */
    where?: ResumeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Resumes to fetch.
     */
    orderBy?: ResumeOrderByWithRelationInput | ResumeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Resumes.
     */
    cursor?: ResumeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Resumes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Resumes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Resumes.
     */
    distinct?: ResumeScalarFieldEnum | ResumeScalarFieldEnum[]
  }

  /**
   * Resume findFirstOrThrow
   */
  export type ResumeFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Resume
     */
    select?: ResumeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Resume
     */
    omit?: ResumeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResumeInclude<ExtArgs> | null
    /**
     * Filter, which Resume to fetch.
     */
    where?: ResumeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Resumes to fetch.
     */
    orderBy?: ResumeOrderByWithRelationInput | ResumeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Resumes.
     */
    cursor?: ResumeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Resumes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Resumes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Resumes.
     */
    distinct?: ResumeScalarFieldEnum | ResumeScalarFieldEnum[]
  }

  /**
   * Resume findMany
   */
  export type ResumeFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Resume
     */
    select?: ResumeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Resume
     */
    omit?: ResumeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResumeInclude<ExtArgs> | null
    /**
     * Filter, which Resumes to fetch.
     */
    where?: ResumeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Resumes to fetch.
     */
    orderBy?: ResumeOrderByWithRelationInput | ResumeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Resumes.
     */
    cursor?: ResumeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Resumes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Resumes.
     */
    skip?: number
    distinct?: ResumeScalarFieldEnum | ResumeScalarFieldEnum[]
  }

  /**
   * Resume create
   */
  export type ResumeCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Resume
     */
    select?: ResumeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Resume
     */
    omit?: ResumeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResumeInclude<ExtArgs> | null
    /**
     * The data needed to create a Resume.
     */
    data: XOR<ResumeCreateInput, ResumeUncheckedCreateInput>
  }

  /**
   * Resume createMany
   */
  export type ResumeCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Resumes.
     */
    data: ResumeCreateManyInput | ResumeCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Resume createManyAndReturn
   */
  export type ResumeCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Resume
     */
    select?: ResumeSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Resume
     */
    omit?: ResumeOmit<ExtArgs> | null
    /**
     * The data used to create many Resumes.
     */
    data: ResumeCreateManyInput | ResumeCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResumeIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Resume update
   */
  export type ResumeUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Resume
     */
    select?: ResumeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Resume
     */
    omit?: ResumeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResumeInclude<ExtArgs> | null
    /**
     * The data needed to update a Resume.
     */
    data: XOR<ResumeUpdateInput, ResumeUncheckedUpdateInput>
    /**
     * Choose, which Resume to update.
     */
    where: ResumeWhereUniqueInput
  }

  /**
   * Resume updateMany
   */
  export type ResumeUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Resumes.
     */
    data: XOR<ResumeUpdateManyMutationInput, ResumeUncheckedUpdateManyInput>
    /**
     * Filter which Resumes to update
     */
    where?: ResumeWhereInput
    /**
     * Limit how many Resumes to update.
     */
    limit?: number
  }

  /**
   * Resume updateManyAndReturn
   */
  export type ResumeUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Resume
     */
    select?: ResumeSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Resume
     */
    omit?: ResumeOmit<ExtArgs> | null
    /**
     * The data used to update Resumes.
     */
    data: XOR<ResumeUpdateManyMutationInput, ResumeUncheckedUpdateManyInput>
    /**
     * Filter which Resumes to update
     */
    where?: ResumeWhereInput
    /**
     * Limit how many Resumes to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResumeIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Resume upsert
   */
  export type ResumeUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Resume
     */
    select?: ResumeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Resume
     */
    omit?: ResumeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResumeInclude<ExtArgs> | null
    /**
     * The filter to search for the Resume to update in case it exists.
     */
    where: ResumeWhereUniqueInput
    /**
     * In case the Resume found by the `where` argument doesn't exist, create a new Resume with this data.
     */
    create: XOR<ResumeCreateInput, ResumeUncheckedCreateInput>
    /**
     * In case the Resume was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ResumeUpdateInput, ResumeUncheckedUpdateInput>
  }

  /**
   * Resume delete
   */
  export type ResumeDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Resume
     */
    select?: ResumeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Resume
     */
    omit?: ResumeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResumeInclude<ExtArgs> | null
    /**
     * Filter which Resume to delete.
     */
    where: ResumeWhereUniqueInput
  }

  /**
   * Resume deleteMany
   */
  export type ResumeDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Resumes to delete
     */
    where?: ResumeWhereInput
    /**
     * Limit how many Resumes to delete.
     */
    limit?: number
  }

  /**
   * Resume.sessions
   */
  export type Resume$sessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
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
    where?: InterviewSessionWhereInput
    orderBy?: InterviewSessionOrderByWithRelationInput | InterviewSessionOrderByWithRelationInput[]
    cursor?: InterviewSessionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: InterviewSessionScalarFieldEnum | InterviewSessionScalarFieldEnum[]
  }

  /**
   * Resume without action
   */
  export type ResumeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Resume
     */
    select?: ResumeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Resume
     */
    omit?: ResumeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResumeInclude<ExtArgs> | null
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
    resumeId: string | null
    interviewType: $Enums.InterviewType | null
    targetRole: string | null
    targetCompany: string | null
    industry: string | null
    experienceLevel: $Enums.ExperienceLevel | null
    interviewGoal: string | null
    durationMins: number | null
    status: $Enums.SessionStatus | null
    startedAt: Date | null
    completedAt: Date | null
    createdAt: Date | null
    mode: $Enums.InterviewMode | null
    hintCount: number | null
    testCasesPassed: number | null
    selectedLanguage: string | null
    isDeleted: boolean | null
  }

  export type InterviewSessionMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    resumeId: string | null
    interviewType: $Enums.InterviewType | null
    targetRole: string | null
    targetCompany: string | null
    industry: string | null
    experienceLevel: $Enums.ExperienceLevel | null
    interviewGoal: string | null
    durationMins: number | null
    status: $Enums.SessionStatus | null
    startedAt: Date | null
    completedAt: Date | null
    createdAt: Date | null
    mode: $Enums.InterviewMode | null
    hintCount: number | null
    testCasesPassed: number | null
    selectedLanguage: string | null
    isDeleted: boolean | null
  }

  export type InterviewSessionCountAggregateOutputType = {
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
    mode?: true
    hintCount?: true
    testCasesPassed?: true
    selectedLanguage?: true
    isDeleted?: true
  }

  export type InterviewSessionMaxAggregateInputType = {
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
    mode?: true
    hintCount?: true
    testCasesPassed?: true
    selectedLanguage?: true
    isDeleted?: true
  }

  export type InterviewSessionCountAggregateInputType = {
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
    resumeId: string | null
    interviewType: $Enums.InterviewType
    targetRole: string
    targetCompany: string | null
    industry: string
    experienceLevel: $Enums.ExperienceLevel
    focusAreas: string[]
    interviewGoal: string | null
    durationMins: number
    status: $Enums.SessionStatus
    startedAt: Date | null
    completedAt: Date | null
    createdAt: Date
    mode: $Enums.InterviewMode
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
    mode?: boolean
    hintCount?: boolean
    testCasesPassed?: boolean
    selectedLanguage?: boolean
    isDeleted?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    resume?: boolean | InterviewSession$resumeArgs<ExtArgs>
    questions?: boolean | InterviewSession$questionsArgs<ExtArgs>
    analysis?: boolean | InterviewSession$analysisArgs<ExtArgs>
    chatHistory?: boolean | InterviewSession$chatHistoryArgs<ExtArgs>
    telemetryLogs?: boolean | InterviewSession$telemetryLogsArgs<ExtArgs>
    codeExecutionDeltas?: boolean | InterviewSession$codeExecutionDeltasArgs<ExtArgs>
    _count?: boolean | InterviewSessionCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["interviewSession"]>

  export type InterviewSessionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
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
    mode?: boolean
    hintCount?: boolean
    testCasesPassed?: boolean
    selectedLanguage?: boolean
    isDeleted?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    resume?: boolean | InterviewSession$resumeArgs<ExtArgs>
  }, ExtArgs["result"]["interviewSession"]>

  export type InterviewSessionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
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
    mode?: boolean
    hintCount?: boolean
    testCasesPassed?: boolean
    selectedLanguage?: boolean
    isDeleted?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    resume?: boolean | InterviewSession$resumeArgs<ExtArgs>
  }, ExtArgs["result"]["interviewSession"]>

  export type InterviewSessionSelectScalar = {
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
    mode?: boolean
    hintCount?: boolean
    testCasesPassed?: boolean
    selectedLanguage?: boolean
    isDeleted?: boolean
  }

  export type InterviewSessionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "resumeId" | "interviewType" | "targetRole" | "targetCompany" | "industry" | "experienceLevel" | "focusAreas" | "interviewGoal" | "durationMins" | "status" | "startedAt" | "completedAt" | "createdAt" | "mode" | "hintCount" | "testCasesPassed" | "selectedLanguage" | "isDeleted", ExtArgs["result"]["interviewSession"]>
  export type InterviewSessionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    resume?: boolean | InterviewSession$resumeArgs<ExtArgs>
    questions?: boolean | InterviewSession$questionsArgs<ExtArgs>
    analysis?: boolean | InterviewSession$analysisArgs<ExtArgs>
    chatHistory?: boolean | InterviewSession$chatHistoryArgs<ExtArgs>
    telemetryLogs?: boolean | InterviewSession$telemetryLogsArgs<ExtArgs>
    codeExecutionDeltas?: boolean | InterviewSession$codeExecutionDeltasArgs<ExtArgs>
    _count?: boolean | InterviewSessionCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type InterviewSessionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    resume?: boolean | InterviewSession$resumeArgs<ExtArgs>
  }
  export type InterviewSessionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    resume?: boolean | InterviewSession$resumeArgs<ExtArgs>
  }

  export type $InterviewSessionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "InterviewSession"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      resume: Prisma.$ResumePayload<ExtArgs> | null
      questions: Prisma.$QuestionPayload<ExtArgs>[]
      analysis: Prisma.$AnalysisPayload<ExtArgs> | null
      chatHistory: Prisma.$ChatHistoryPayload<ExtArgs>[]
      telemetryLogs: Prisma.$TelemetryLogPayload<ExtArgs>[]
      codeExecutionDeltas: Prisma.$CodeExecutionDeltaPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      resumeId: string | null
      interviewType: $Enums.InterviewType
      targetRole: string
      targetCompany: string | null
      industry: string
      experienceLevel: $Enums.ExperienceLevel
      focusAreas: string[]
      interviewGoal: string | null
      durationMins: number
      status: $Enums.SessionStatus
      startedAt: Date | null
      completedAt: Date | null
      createdAt: Date
      mode: $Enums.InterviewMode
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
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    resume<T extends InterviewSession$resumeArgs<ExtArgs> = {}>(args?: Subset<T, InterviewSession$resumeArgs<ExtArgs>>): Prisma__ResumeClient<$Result.GetResult<Prisma.$ResumePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    questions<T extends InterviewSession$questionsArgs<ExtArgs> = {}>(args?: Subset<T, InterviewSession$questionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$QuestionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    analysis<T extends InterviewSession$analysisArgs<ExtArgs> = {}>(args?: Subset<T, InterviewSession$analysisArgs<ExtArgs>>): Prisma__AnalysisClient<$Result.GetResult<Prisma.$AnalysisPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    chatHistory<T extends InterviewSession$chatHistoryArgs<ExtArgs> = {}>(args?: Subset<T, InterviewSession$chatHistoryArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChatHistoryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    telemetryLogs<T extends InterviewSession$telemetryLogsArgs<ExtArgs> = {}>(args?: Subset<T, InterviewSession$telemetryLogsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TelemetryLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    codeExecutionDeltas<T extends InterviewSession$codeExecutionDeltasArgs<ExtArgs> = {}>(args?: Subset<T, InterviewSession$codeExecutionDeltasArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CodeExecutionDeltaPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
    readonly resumeId: FieldRef<"InterviewSession", 'String'>
    readonly interviewType: FieldRef<"InterviewSession", 'InterviewType'>
    readonly targetRole: FieldRef<"InterviewSession", 'String'>
    readonly targetCompany: FieldRef<"InterviewSession", 'String'>
    readonly industry: FieldRef<"InterviewSession", 'String'>
    readonly experienceLevel: FieldRef<"InterviewSession", 'ExperienceLevel'>
    readonly focusAreas: FieldRef<"InterviewSession", 'String[]'>
    readonly interviewGoal: FieldRef<"InterviewSession", 'String'>
    readonly durationMins: FieldRef<"InterviewSession", 'Int'>
    readonly status: FieldRef<"InterviewSession", 'SessionStatus'>
    readonly startedAt: FieldRef<"InterviewSession", 'DateTime'>
    readonly completedAt: FieldRef<"InterviewSession", 'DateTime'>
    readonly createdAt: FieldRef<"InterviewSession", 'DateTime'>
    readonly mode: FieldRef<"InterviewSession", 'InterviewMode'>
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
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InterviewSessionIncludeCreateManyAndReturn<ExtArgs> | null
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
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InterviewSessionIncludeUpdateManyAndReturn<ExtArgs> | null
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
   * InterviewSession.resume
   */
  export type InterviewSession$resumeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Resume
     */
    select?: ResumeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Resume
     */
    omit?: ResumeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResumeInclude<ExtArgs> | null
    where?: ResumeWhereInput
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
   * InterviewSession.chatHistory
   */
  export type InterviewSession$chatHistoryArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatHistory
     */
    select?: ChatHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatHistory
     */
    omit?: ChatHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatHistoryInclude<ExtArgs> | null
    where?: ChatHistoryWhereInput
    orderBy?: ChatHistoryOrderByWithRelationInput | ChatHistoryOrderByWithRelationInput[]
    cursor?: ChatHistoryWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ChatHistoryScalarFieldEnum | ChatHistoryScalarFieldEnum[]
  }

  /**
   * InterviewSession.telemetryLogs
   */
  export type InterviewSession$telemetryLogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TelemetryLog
     */
    select?: TelemetryLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TelemetryLog
     */
    omit?: TelemetryLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TelemetryLogInclude<ExtArgs> | null
    where?: TelemetryLogWhereInput
    orderBy?: TelemetryLogOrderByWithRelationInput | TelemetryLogOrderByWithRelationInput[]
    cursor?: TelemetryLogWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TelemetryLogScalarFieldEnum | TelemetryLogScalarFieldEnum[]
  }

  /**
   * InterviewSession.codeExecutionDeltas
   */
  export type InterviewSession$codeExecutionDeltasArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
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
    questionType: $Enums.QuestionType | null
    difficulty: $Enums.Difficulty | null
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
    questionType: $Enums.QuestionType | null
    difficulty: $Enums.Difficulty | null
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
    questionType: $Enums.QuestionType
    difficulty: $Enums.Difficulty
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
      questionType: $Enums.QuestionType
      difficulty: $Enums.Difficulty
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
    readonly questionType: FieldRef<"Question", 'QuestionType'>
    readonly difficulty: FieldRef<"Question", 'Difficulty'>
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
   * Model ChatHistory
   */

  export type AggregateChatHistory = {
    _count: ChatHistoryCountAggregateOutputType | null
    _avg: ChatHistoryAvgAggregateOutputType | null
    _sum: ChatHistorySumAggregateOutputType | null
    _min: ChatHistoryMinAggregateOutputType | null
    _max: ChatHistoryMaxAggregateOutputType | null
  }

  export type ChatHistoryAvgAggregateOutputType = {
    score: number | null
  }

  export type ChatHistorySumAggregateOutputType = {
    score: number | null
  }

  export type ChatHistoryMinAggregateOutputType = {
    id: string | null
    sessionId: string | null
    role: string | null
    content: string | null
    score: number | null
    critique: string | null
    timestamp: Date | null
  }

  export type ChatHistoryMaxAggregateOutputType = {
    id: string | null
    sessionId: string | null
    role: string | null
    content: string | null
    score: number | null
    critique: string | null
    timestamp: Date | null
  }

  export type ChatHistoryCountAggregateOutputType = {
    id: number
    sessionId: number
    role: number
    content: number
    score: number
    critique: number
    timestamp: number
    _all: number
  }


  export type ChatHistoryAvgAggregateInputType = {
    score?: true
  }

  export type ChatHistorySumAggregateInputType = {
    score?: true
  }

  export type ChatHistoryMinAggregateInputType = {
    id?: true
    sessionId?: true
    role?: true
    content?: true
    score?: true
    critique?: true
    timestamp?: true
  }

  export type ChatHistoryMaxAggregateInputType = {
    id?: true
    sessionId?: true
    role?: true
    content?: true
    score?: true
    critique?: true
    timestamp?: true
  }

  export type ChatHistoryCountAggregateInputType = {
    id?: true
    sessionId?: true
    role?: true
    content?: true
    score?: true
    critique?: true
    timestamp?: true
    _all?: true
  }

  export type ChatHistoryAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ChatHistory to aggregate.
     */
    where?: ChatHistoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChatHistories to fetch.
     */
    orderBy?: ChatHistoryOrderByWithRelationInput | ChatHistoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ChatHistoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChatHistories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChatHistories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ChatHistories
    **/
    _count?: true | ChatHistoryCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ChatHistoryAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ChatHistorySumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ChatHistoryMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ChatHistoryMaxAggregateInputType
  }

  export type GetChatHistoryAggregateType<T extends ChatHistoryAggregateArgs> = {
        [P in keyof T & keyof AggregateChatHistory]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateChatHistory[P]>
      : GetScalarType<T[P], AggregateChatHistory[P]>
  }




  export type ChatHistoryGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ChatHistoryWhereInput
    orderBy?: ChatHistoryOrderByWithAggregationInput | ChatHistoryOrderByWithAggregationInput[]
    by: ChatHistoryScalarFieldEnum[] | ChatHistoryScalarFieldEnum
    having?: ChatHistoryScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ChatHistoryCountAggregateInputType | true
    _avg?: ChatHistoryAvgAggregateInputType
    _sum?: ChatHistorySumAggregateInputType
    _min?: ChatHistoryMinAggregateInputType
    _max?: ChatHistoryMaxAggregateInputType
  }

  export type ChatHistoryGroupByOutputType = {
    id: string
    sessionId: string
    role: string
    content: string
    score: number | null
    critique: string | null
    timestamp: Date
    _count: ChatHistoryCountAggregateOutputType | null
    _avg: ChatHistoryAvgAggregateOutputType | null
    _sum: ChatHistorySumAggregateOutputType | null
    _min: ChatHistoryMinAggregateOutputType | null
    _max: ChatHistoryMaxAggregateOutputType | null
  }

  type GetChatHistoryGroupByPayload<T extends ChatHistoryGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ChatHistoryGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ChatHistoryGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ChatHistoryGroupByOutputType[P]>
            : GetScalarType<T[P], ChatHistoryGroupByOutputType[P]>
        }
      >
    >


  export type ChatHistorySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sessionId?: boolean
    role?: boolean
    content?: boolean
    score?: boolean
    critique?: boolean
    timestamp?: boolean
    interviewSession?: boolean | InterviewSessionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["chatHistory"]>

  export type ChatHistorySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sessionId?: boolean
    role?: boolean
    content?: boolean
    score?: boolean
    critique?: boolean
    timestamp?: boolean
    interviewSession?: boolean | InterviewSessionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["chatHistory"]>

  export type ChatHistorySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sessionId?: boolean
    role?: boolean
    content?: boolean
    score?: boolean
    critique?: boolean
    timestamp?: boolean
    interviewSession?: boolean | InterviewSessionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["chatHistory"]>

  export type ChatHistorySelectScalar = {
    id?: boolean
    sessionId?: boolean
    role?: boolean
    content?: boolean
    score?: boolean
    critique?: boolean
    timestamp?: boolean
  }

  export type ChatHistoryOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "sessionId" | "role" | "content" | "score" | "critique" | "timestamp", ExtArgs["result"]["chatHistory"]>
  export type ChatHistoryInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    interviewSession?: boolean | InterviewSessionDefaultArgs<ExtArgs>
  }
  export type ChatHistoryIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    interviewSession?: boolean | InterviewSessionDefaultArgs<ExtArgs>
  }
  export type ChatHistoryIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    interviewSession?: boolean | InterviewSessionDefaultArgs<ExtArgs>
  }

  export type $ChatHistoryPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ChatHistory"
    objects: {
      interviewSession: Prisma.$InterviewSessionPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      sessionId: string
      role: string
      content: string
      score: number | null
      critique: string | null
      timestamp: Date
    }, ExtArgs["result"]["chatHistory"]>
    composites: {}
  }

  type ChatHistoryGetPayload<S extends boolean | null | undefined | ChatHistoryDefaultArgs> = $Result.GetResult<Prisma.$ChatHistoryPayload, S>

  type ChatHistoryCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ChatHistoryFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ChatHistoryCountAggregateInputType | true
    }

  export interface ChatHistoryDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ChatHistory'], meta: { name: 'ChatHistory' } }
    /**
     * Find zero or one ChatHistory that matches the filter.
     * @param {ChatHistoryFindUniqueArgs} args - Arguments to find a ChatHistory
     * @example
     * // Get one ChatHistory
     * const chatHistory = await prisma.chatHistory.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ChatHistoryFindUniqueArgs>(args: SelectSubset<T, ChatHistoryFindUniqueArgs<ExtArgs>>): Prisma__ChatHistoryClient<$Result.GetResult<Prisma.$ChatHistoryPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ChatHistory that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ChatHistoryFindUniqueOrThrowArgs} args - Arguments to find a ChatHistory
     * @example
     * // Get one ChatHistory
     * const chatHistory = await prisma.chatHistory.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ChatHistoryFindUniqueOrThrowArgs>(args: SelectSubset<T, ChatHistoryFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ChatHistoryClient<$Result.GetResult<Prisma.$ChatHistoryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ChatHistory that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatHistoryFindFirstArgs} args - Arguments to find a ChatHistory
     * @example
     * // Get one ChatHistory
     * const chatHistory = await prisma.chatHistory.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ChatHistoryFindFirstArgs>(args?: SelectSubset<T, ChatHistoryFindFirstArgs<ExtArgs>>): Prisma__ChatHistoryClient<$Result.GetResult<Prisma.$ChatHistoryPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ChatHistory that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatHistoryFindFirstOrThrowArgs} args - Arguments to find a ChatHistory
     * @example
     * // Get one ChatHistory
     * const chatHistory = await prisma.chatHistory.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ChatHistoryFindFirstOrThrowArgs>(args?: SelectSubset<T, ChatHistoryFindFirstOrThrowArgs<ExtArgs>>): Prisma__ChatHistoryClient<$Result.GetResult<Prisma.$ChatHistoryPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ChatHistories that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatHistoryFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ChatHistories
     * const chatHistories = await prisma.chatHistory.findMany()
     * 
     * // Get first 10 ChatHistories
     * const chatHistories = await prisma.chatHistory.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const chatHistoryWithIdOnly = await prisma.chatHistory.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ChatHistoryFindManyArgs>(args?: SelectSubset<T, ChatHistoryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChatHistoryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ChatHistory.
     * @param {ChatHistoryCreateArgs} args - Arguments to create a ChatHistory.
     * @example
     * // Create one ChatHistory
     * const ChatHistory = await prisma.chatHistory.create({
     *   data: {
     *     // ... data to create a ChatHistory
     *   }
     * })
     * 
     */
    create<T extends ChatHistoryCreateArgs>(args: SelectSubset<T, ChatHistoryCreateArgs<ExtArgs>>): Prisma__ChatHistoryClient<$Result.GetResult<Prisma.$ChatHistoryPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ChatHistories.
     * @param {ChatHistoryCreateManyArgs} args - Arguments to create many ChatHistories.
     * @example
     * // Create many ChatHistories
     * const chatHistory = await prisma.chatHistory.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ChatHistoryCreateManyArgs>(args?: SelectSubset<T, ChatHistoryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ChatHistories and returns the data saved in the database.
     * @param {ChatHistoryCreateManyAndReturnArgs} args - Arguments to create many ChatHistories.
     * @example
     * // Create many ChatHistories
     * const chatHistory = await prisma.chatHistory.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ChatHistories and only return the `id`
     * const chatHistoryWithIdOnly = await prisma.chatHistory.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ChatHistoryCreateManyAndReturnArgs>(args?: SelectSubset<T, ChatHistoryCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChatHistoryPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ChatHistory.
     * @param {ChatHistoryDeleteArgs} args - Arguments to delete one ChatHistory.
     * @example
     * // Delete one ChatHistory
     * const ChatHistory = await prisma.chatHistory.delete({
     *   where: {
     *     // ... filter to delete one ChatHistory
     *   }
     * })
     * 
     */
    delete<T extends ChatHistoryDeleteArgs>(args: SelectSubset<T, ChatHistoryDeleteArgs<ExtArgs>>): Prisma__ChatHistoryClient<$Result.GetResult<Prisma.$ChatHistoryPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ChatHistory.
     * @param {ChatHistoryUpdateArgs} args - Arguments to update one ChatHistory.
     * @example
     * // Update one ChatHistory
     * const chatHistory = await prisma.chatHistory.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ChatHistoryUpdateArgs>(args: SelectSubset<T, ChatHistoryUpdateArgs<ExtArgs>>): Prisma__ChatHistoryClient<$Result.GetResult<Prisma.$ChatHistoryPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ChatHistories.
     * @param {ChatHistoryDeleteManyArgs} args - Arguments to filter ChatHistories to delete.
     * @example
     * // Delete a few ChatHistories
     * const { count } = await prisma.chatHistory.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ChatHistoryDeleteManyArgs>(args?: SelectSubset<T, ChatHistoryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ChatHistories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatHistoryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ChatHistories
     * const chatHistory = await prisma.chatHistory.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ChatHistoryUpdateManyArgs>(args: SelectSubset<T, ChatHistoryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ChatHistories and returns the data updated in the database.
     * @param {ChatHistoryUpdateManyAndReturnArgs} args - Arguments to update many ChatHistories.
     * @example
     * // Update many ChatHistories
     * const chatHistory = await prisma.chatHistory.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ChatHistories and only return the `id`
     * const chatHistoryWithIdOnly = await prisma.chatHistory.updateManyAndReturn({
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
    updateManyAndReturn<T extends ChatHistoryUpdateManyAndReturnArgs>(args: SelectSubset<T, ChatHistoryUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChatHistoryPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ChatHistory.
     * @param {ChatHistoryUpsertArgs} args - Arguments to update or create a ChatHistory.
     * @example
     * // Update or create a ChatHistory
     * const chatHistory = await prisma.chatHistory.upsert({
     *   create: {
     *     // ... data to create a ChatHistory
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ChatHistory we want to update
     *   }
     * })
     */
    upsert<T extends ChatHistoryUpsertArgs>(args: SelectSubset<T, ChatHistoryUpsertArgs<ExtArgs>>): Prisma__ChatHistoryClient<$Result.GetResult<Prisma.$ChatHistoryPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ChatHistories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatHistoryCountArgs} args - Arguments to filter ChatHistories to count.
     * @example
     * // Count the number of ChatHistories
     * const count = await prisma.chatHistory.count({
     *   where: {
     *     // ... the filter for the ChatHistories we want to count
     *   }
     * })
    **/
    count<T extends ChatHistoryCountArgs>(
      args?: Subset<T, ChatHistoryCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ChatHistoryCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ChatHistory.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatHistoryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ChatHistoryAggregateArgs>(args: Subset<T, ChatHistoryAggregateArgs>): Prisma.PrismaPromise<GetChatHistoryAggregateType<T>>

    /**
     * Group by ChatHistory.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatHistoryGroupByArgs} args - Group by arguments.
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
      T extends ChatHistoryGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ChatHistoryGroupByArgs['orderBy'] }
        : { orderBy?: ChatHistoryGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ChatHistoryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetChatHistoryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ChatHistory model
   */
  readonly fields: ChatHistoryFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ChatHistory.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ChatHistoryClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    interviewSession<T extends InterviewSessionDefaultArgs<ExtArgs> = {}>(args?: Subset<T, InterviewSessionDefaultArgs<ExtArgs>>): Prisma__InterviewSessionClient<$Result.GetResult<Prisma.$InterviewSessionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the ChatHistory model
   */
  interface ChatHistoryFieldRefs {
    readonly id: FieldRef<"ChatHistory", 'String'>
    readonly sessionId: FieldRef<"ChatHistory", 'String'>
    readonly role: FieldRef<"ChatHistory", 'String'>
    readonly content: FieldRef<"ChatHistory", 'String'>
    readonly score: FieldRef<"ChatHistory", 'Int'>
    readonly critique: FieldRef<"ChatHistory", 'String'>
    readonly timestamp: FieldRef<"ChatHistory", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ChatHistory findUnique
   */
  export type ChatHistoryFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatHistory
     */
    select?: ChatHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatHistory
     */
    omit?: ChatHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatHistoryInclude<ExtArgs> | null
    /**
     * Filter, which ChatHistory to fetch.
     */
    where: ChatHistoryWhereUniqueInput
  }

  /**
   * ChatHistory findUniqueOrThrow
   */
  export type ChatHistoryFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatHistory
     */
    select?: ChatHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatHistory
     */
    omit?: ChatHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatHistoryInclude<ExtArgs> | null
    /**
     * Filter, which ChatHistory to fetch.
     */
    where: ChatHistoryWhereUniqueInput
  }

  /**
   * ChatHistory findFirst
   */
  export type ChatHistoryFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatHistory
     */
    select?: ChatHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatHistory
     */
    omit?: ChatHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatHistoryInclude<ExtArgs> | null
    /**
     * Filter, which ChatHistory to fetch.
     */
    where?: ChatHistoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChatHistories to fetch.
     */
    orderBy?: ChatHistoryOrderByWithRelationInput | ChatHistoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ChatHistories.
     */
    cursor?: ChatHistoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChatHistories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChatHistories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ChatHistories.
     */
    distinct?: ChatHistoryScalarFieldEnum | ChatHistoryScalarFieldEnum[]
  }

  /**
   * ChatHistory findFirstOrThrow
   */
  export type ChatHistoryFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatHistory
     */
    select?: ChatHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatHistory
     */
    omit?: ChatHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatHistoryInclude<ExtArgs> | null
    /**
     * Filter, which ChatHistory to fetch.
     */
    where?: ChatHistoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChatHistories to fetch.
     */
    orderBy?: ChatHistoryOrderByWithRelationInput | ChatHistoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ChatHistories.
     */
    cursor?: ChatHistoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChatHistories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChatHistories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ChatHistories.
     */
    distinct?: ChatHistoryScalarFieldEnum | ChatHistoryScalarFieldEnum[]
  }

  /**
   * ChatHistory findMany
   */
  export type ChatHistoryFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatHistory
     */
    select?: ChatHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatHistory
     */
    omit?: ChatHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatHistoryInclude<ExtArgs> | null
    /**
     * Filter, which ChatHistories to fetch.
     */
    where?: ChatHistoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChatHistories to fetch.
     */
    orderBy?: ChatHistoryOrderByWithRelationInput | ChatHistoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ChatHistories.
     */
    cursor?: ChatHistoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChatHistories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChatHistories.
     */
    skip?: number
    distinct?: ChatHistoryScalarFieldEnum | ChatHistoryScalarFieldEnum[]
  }

  /**
   * ChatHistory create
   */
  export type ChatHistoryCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatHistory
     */
    select?: ChatHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatHistory
     */
    omit?: ChatHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatHistoryInclude<ExtArgs> | null
    /**
     * The data needed to create a ChatHistory.
     */
    data: XOR<ChatHistoryCreateInput, ChatHistoryUncheckedCreateInput>
  }

  /**
   * ChatHistory createMany
   */
  export type ChatHistoryCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ChatHistories.
     */
    data: ChatHistoryCreateManyInput | ChatHistoryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ChatHistory createManyAndReturn
   */
  export type ChatHistoryCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatHistory
     */
    select?: ChatHistorySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ChatHistory
     */
    omit?: ChatHistoryOmit<ExtArgs> | null
    /**
     * The data used to create many ChatHistories.
     */
    data: ChatHistoryCreateManyInput | ChatHistoryCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatHistoryIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ChatHistory update
   */
  export type ChatHistoryUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatHistory
     */
    select?: ChatHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatHistory
     */
    omit?: ChatHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatHistoryInclude<ExtArgs> | null
    /**
     * The data needed to update a ChatHistory.
     */
    data: XOR<ChatHistoryUpdateInput, ChatHistoryUncheckedUpdateInput>
    /**
     * Choose, which ChatHistory to update.
     */
    where: ChatHistoryWhereUniqueInput
  }

  /**
   * ChatHistory updateMany
   */
  export type ChatHistoryUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ChatHistories.
     */
    data: XOR<ChatHistoryUpdateManyMutationInput, ChatHistoryUncheckedUpdateManyInput>
    /**
     * Filter which ChatHistories to update
     */
    where?: ChatHistoryWhereInput
    /**
     * Limit how many ChatHistories to update.
     */
    limit?: number
  }

  /**
   * ChatHistory updateManyAndReturn
   */
  export type ChatHistoryUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatHistory
     */
    select?: ChatHistorySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ChatHistory
     */
    omit?: ChatHistoryOmit<ExtArgs> | null
    /**
     * The data used to update ChatHistories.
     */
    data: XOR<ChatHistoryUpdateManyMutationInput, ChatHistoryUncheckedUpdateManyInput>
    /**
     * Filter which ChatHistories to update
     */
    where?: ChatHistoryWhereInput
    /**
     * Limit how many ChatHistories to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatHistoryIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ChatHistory upsert
   */
  export type ChatHistoryUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatHistory
     */
    select?: ChatHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatHistory
     */
    omit?: ChatHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatHistoryInclude<ExtArgs> | null
    /**
     * The filter to search for the ChatHistory to update in case it exists.
     */
    where: ChatHistoryWhereUniqueInput
    /**
     * In case the ChatHistory found by the `where` argument doesn't exist, create a new ChatHistory with this data.
     */
    create: XOR<ChatHistoryCreateInput, ChatHistoryUncheckedCreateInput>
    /**
     * In case the ChatHistory was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ChatHistoryUpdateInput, ChatHistoryUncheckedUpdateInput>
  }

  /**
   * ChatHistory delete
   */
  export type ChatHistoryDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatHistory
     */
    select?: ChatHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatHistory
     */
    omit?: ChatHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatHistoryInclude<ExtArgs> | null
    /**
     * Filter which ChatHistory to delete.
     */
    where: ChatHistoryWhereUniqueInput
  }

  /**
   * ChatHistory deleteMany
   */
  export type ChatHistoryDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ChatHistories to delete
     */
    where?: ChatHistoryWhereInput
    /**
     * Limit how many ChatHistories to delete.
     */
    limit?: number
  }

  /**
   * ChatHistory without action
   */
  export type ChatHistoryDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatHistory
     */
    select?: ChatHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatHistory
     */
    omit?: ChatHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatHistoryInclude<ExtArgs> | null
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
    interviewSession?: boolean | InterviewSessionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["telemetryLog"]>

  export type TelemetryLogSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sessionId?: boolean
    type?: boolean
    wordsPerMinute?: boolean
    fillerWordsCount?: boolean
    stressCoefficient?: boolean
    timestamp?: boolean
    interviewSession?: boolean | InterviewSessionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["telemetryLog"]>

  export type TelemetryLogSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sessionId?: boolean
    type?: boolean
    wordsPerMinute?: boolean
    fillerWordsCount?: boolean
    stressCoefficient?: boolean
    timestamp?: boolean
    interviewSession?: boolean | InterviewSessionDefaultArgs<ExtArgs>
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
  export type TelemetryLogInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    interviewSession?: boolean | InterviewSessionDefaultArgs<ExtArgs>
  }
  export type TelemetryLogIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    interviewSession?: boolean | InterviewSessionDefaultArgs<ExtArgs>
  }
  export type TelemetryLogIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    interviewSession?: boolean | InterviewSessionDefaultArgs<ExtArgs>
  }

  export type $TelemetryLogPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "TelemetryLog"
    objects: {
      interviewSession: Prisma.$InterviewSessionPayload<ExtArgs>
    }
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
    interviewSession<T extends InterviewSessionDefaultArgs<ExtArgs> = {}>(args?: Subset<T, InterviewSessionDefaultArgs<ExtArgs>>): Prisma__InterviewSessionClient<$Result.GetResult<Prisma.$InterviewSessionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
     * Choose, which related nodes to fetch as well
     */
    include?: TelemetryLogInclude<ExtArgs> | null
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
     * Choose, which related nodes to fetch as well
     */
    include?: TelemetryLogInclude<ExtArgs> | null
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
     * Choose, which related nodes to fetch as well
     */
    include?: TelemetryLogInclude<ExtArgs> | null
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
     * Choose, which related nodes to fetch as well
     */
    include?: TelemetryLogInclude<ExtArgs> | null
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
     * Choose, which related nodes to fetch as well
     */
    include?: TelemetryLogInclude<ExtArgs> | null
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
     * Choose, which related nodes to fetch as well
     */
    include?: TelemetryLogInclude<ExtArgs> | null
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
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TelemetryLogIncludeCreateManyAndReturn<ExtArgs> | null
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
     * Choose, which related nodes to fetch as well
     */
    include?: TelemetryLogInclude<ExtArgs> | null
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
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TelemetryLogIncludeUpdateManyAndReturn<ExtArgs> | null
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
     * Choose, which related nodes to fetch as well
     */
    include?: TelemetryLogInclude<ExtArgs> | null
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
     * Choose, which related nodes to fetch as well
     */
    include?: TelemetryLogInclude<ExtArgs> | null
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
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TelemetryLogInclude<ExtArgs> | null
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
    interviewSession?: boolean | InterviewSessionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["codeExecutionDelta"]>

  export type CodeExecutionDeltaSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sessionId?: boolean
    code?: boolean
    language?: boolean
    output?: boolean
    success?: boolean
    timestamp?: boolean
    interviewSession?: boolean | InterviewSessionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["codeExecutionDelta"]>

  export type CodeExecutionDeltaSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sessionId?: boolean
    code?: boolean
    language?: boolean
    output?: boolean
    success?: boolean
    timestamp?: boolean
    interviewSession?: boolean | InterviewSessionDefaultArgs<ExtArgs>
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
    interviewSession?: boolean | InterviewSessionDefaultArgs<ExtArgs>
  }
  export type CodeExecutionDeltaIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    interviewSession?: boolean | InterviewSessionDefaultArgs<ExtArgs>
  }
  export type CodeExecutionDeltaIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    interviewSession?: boolean | InterviewSessionDefaultArgs<ExtArgs>
  }

  export type $CodeExecutionDeltaPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "CodeExecutionDelta"
    objects: {
      interviewSession: Prisma.$InterviewSessionPayload<ExtArgs>
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
    interviewSession<T extends InterviewSessionDefaultArgs<ExtArgs> = {}>(args?: Subset<T, InterviewSessionDefaultArgs<ExtArgs>>): Prisma__InterviewSessionClient<$Result.GetResult<Prisma.$InterviewSessionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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


  export const UserScalarFieldEnum: {
    id: 'id',
    email: 'email',
    passwordHash: 'passwordHash',
    name: 'name',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const RefreshTokenScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    tokenId: 'tokenId',
    expiresAt: 'expiresAt',
    createdAt: 'createdAt'
  };

  export type RefreshTokenScalarFieldEnum = (typeof RefreshTokenScalarFieldEnum)[keyof typeof RefreshTokenScalarFieldEnum]


  export const ResumeScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    fileName: 'fileName',
    filePath: 'filePath',
    parsedText: 'parsedText',
    skills: 'skills',
    experience: 'experience',
    uploadedAt: 'uploadedAt'
  };

  export type ResumeScalarFieldEnum = (typeof ResumeScalarFieldEnum)[keyof typeof ResumeScalarFieldEnum]


  export const InterviewSessionScalarFieldEnum: {
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


  export const ChatHistoryScalarFieldEnum: {
    id: 'id',
    sessionId: 'sessionId',
    role: 'role',
    content: 'content',
    score: 'score',
    critique: 'critique',
    timestamp: 'timestamp'
  };

  export type ChatHistoryScalarFieldEnum = (typeof ChatHistoryScalarFieldEnum)[keyof typeof ChatHistoryScalarFieldEnum]


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
   * Reference to a field of type 'InterviewType'
   */
  export type EnumInterviewTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'InterviewType'>
    


  /**
   * Reference to a field of type 'InterviewType[]'
   */
  export type ListEnumInterviewTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'InterviewType[]'>
    


  /**
   * Reference to a field of type 'ExperienceLevel'
   */
  export type EnumExperienceLevelFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ExperienceLevel'>
    


  /**
   * Reference to a field of type 'ExperienceLevel[]'
   */
  export type ListEnumExperienceLevelFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ExperienceLevel[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'SessionStatus'
   */
  export type EnumSessionStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SessionStatus'>
    


  /**
   * Reference to a field of type 'SessionStatus[]'
   */
  export type ListEnumSessionStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SessionStatus[]'>
    


  /**
   * Reference to a field of type 'InterviewMode'
   */
  export type EnumInterviewModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'InterviewMode'>
    


  /**
   * Reference to a field of type 'InterviewMode[]'
   */
  export type ListEnumInterviewModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'InterviewMode[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'QuestionType'
   */
  export type EnumQuestionTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QuestionType'>
    


  /**
   * Reference to a field of type 'QuestionType[]'
   */
  export type ListEnumQuestionTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QuestionType[]'>
    


  /**
   * Reference to a field of type 'Difficulty'
   */
  export type EnumDifficultyFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Difficulty'>
    


  /**
   * Reference to a field of type 'Difficulty[]'
   */
  export type ListEnumDifficultyFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Difficulty[]'>
    


  /**
   * Reference to a field of type 'ReadinessVerdict'
   */
  export type EnumReadinessVerdictFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ReadinessVerdict'>
    


  /**
   * Reference to a field of type 'ReadinessVerdict[]'
   */
  export type ListEnumReadinessVerdictFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ReadinessVerdict[]'>
    


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


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    passwordHash?: StringFilter<"User"> | string
    name?: StringFilter<"User"> | string
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    sessions?: InterviewSessionListRelationFilter
    resumes?: ResumeListRelationFilter
    refreshTokens?: RefreshTokenListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    sessions?: InterviewSessionOrderByRelationAggregateInput
    resumes?: ResumeOrderByRelationAggregateInput
    refreshTokens?: RefreshTokenOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    passwordHash?: StringFilter<"User"> | string
    name?: StringFilter<"User"> | string
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    sessions?: InterviewSessionListRelationFilter
    resumes?: ResumeListRelationFilter
    refreshTokens?: RefreshTokenListRelationFilter
  }, "id" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    passwordHash?: StringWithAggregatesFilter<"User"> | string
    name?: StringWithAggregatesFilter<"User"> | string
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type RefreshTokenWhereInput = {
    AND?: RefreshTokenWhereInput | RefreshTokenWhereInput[]
    OR?: RefreshTokenWhereInput[]
    NOT?: RefreshTokenWhereInput | RefreshTokenWhereInput[]
    id?: StringFilter<"RefreshToken"> | string
    userId?: StringFilter<"RefreshToken"> | string
    tokenId?: StringFilter<"RefreshToken"> | string
    expiresAt?: DateTimeFilter<"RefreshToken"> | Date | string
    createdAt?: DateTimeFilter<"RefreshToken"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type RefreshTokenOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    tokenId?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type RefreshTokenWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId_tokenId?: RefreshTokenUserIdTokenIdCompoundUniqueInput
    AND?: RefreshTokenWhereInput | RefreshTokenWhereInput[]
    OR?: RefreshTokenWhereInput[]
    NOT?: RefreshTokenWhereInput | RefreshTokenWhereInput[]
    userId?: StringFilter<"RefreshToken"> | string
    tokenId?: StringFilter<"RefreshToken"> | string
    expiresAt?: DateTimeFilter<"RefreshToken"> | Date | string
    createdAt?: DateTimeFilter<"RefreshToken"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "userId_tokenId">

  export type RefreshTokenOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    tokenId?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    _count?: RefreshTokenCountOrderByAggregateInput
    _max?: RefreshTokenMaxOrderByAggregateInput
    _min?: RefreshTokenMinOrderByAggregateInput
  }

  export type RefreshTokenScalarWhereWithAggregatesInput = {
    AND?: RefreshTokenScalarWhereWithAggregatesInput | RefreshTokenScalarWhereWithAggregatesInput[]
    OR?: RefreshTokenScalarWhereWithAggregatesInput[]
    NOT?: RefreshTokenScalarWhereWithAggregatesInput | RefreshTokenScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"RefreshToken"> | string
    userId?: StringWithAggregatesFilter<"RefreshToken"> | string
    tokenId?: StringWithAggregatesFilter<"RefreshToken"> | string
    expiresAt?: DateTimeWithAggregatesFilter<"RefreshToken"> | Date | string
    createdAt?: DateTimeWithAggregatesFilter<"RefreshToken"> | Date | string
  }

  export type ResumeWhereInput = {
    AND?: ResumeWhereInput | ResumeWhereInput[]
    OR?: ResumeWhereInput[]
    NOT?: ResumeWhereInput | ResumeWhereInput[]
    id?: StringFilter<"Resume"> | string
    userId?: StringFilter<"Resume"> | string
    fileName?: StringFilter<"Resume"> | string
    filePath?: StringFilter<"Resume"> | string
    parsedText?: StringNullableFilter<"Resume"> | string | null
    skills?: StringNullableListFilter<"Resume">
    experience?: JsonNullableFilter<"Resume">
    uploadedAt?: DateTimeFilter<"Resume"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    sessions?: InterviewSessionListRelationFilter
  }

  export type ResumeOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    fileName?: SortOrder
    filePath?: SortOrder
    parsedText?: SortOrderInput | SortOrder
    skills?: SortOrder
    experience?: SortOrderInput | SortOrder
    uploadedAt?: SortOrder
    user?: UserOrderByWithRelationInput
    sessions?: InterviewSessionOrderByRelationAggregateInput
  }

  export type ResumeWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ResumeWhereInput | ResumeWhereInput[]
    OR?: ResumeWhereInput[]
    NOT?: ResumeWhereInput | ResumeWhereInput[]
    userId?: StringFilter<"Resume"> | string
    fileName?: StringFilter<"Resume"> | string
    filePath?: StringFilter<"Resume"> | string
    parsedText?: StringNullableFilter<"Resume"> | string | null
    skills?: StringNullableListFilter<"Resume">
    experience?: JsonNullableFilter<"Resume">
    uploadedAt?: DateTimeFilter<"Resume"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    sessions?: InterviewSessionListRelationFilter
  }, "id">

  export type ResumeOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    fileName?: SortOrder
    filePath?: SortOrder
    parsedText?: SortOrderInput | SortOrder
    skills?: SortOrder
    experience?: SortOrderInput | SortOrder
    uploadedAt?: SortOrder
    _count?: ResumeCountOrderByAggregateInput
    _max?: ResumeMaxOrderByAggregateInput
    _min?: ResumeMinOrderByAggregateInput
  }

  export type ResumeScalarWhereWithAggregatesInput = {
    AND?: ResumeScalarWhereWithAggregatesInput | ResumeScalarWhereWithAggregatesInput[]
    OR?: ResumeScalarWhereWithAggregatesInput[]
    NOT?: ResumeScalarWhereWithAggregatesInput | ResumeScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Resume"> | string
    userId?: StringWithAggregatesFilter<"Resume"> | string
    fileName?: StringWithAggregatesFilter<"Resume"> | string
    filePath?: StringWithAggregatesFilter<"Resume"> | string
    parsedText?: StringNullableWithAggregatesFilter<"Resume"> | string | null
    skills?: StringNullableListFilter<"Resume">
    experience?: JsonNullableWithAggregatesFilter<"Resume">
    uploadedAt?: DateTimeWithAggregatesFilter<"Resume"> | Date | string
  }

  export type InterviewSessionWhereInput = {
    AND?: InterviewSessionWhereInput | InterviewSessionWhereInput[]
    OR?: InterviewSessionWhereInput[]
    NOT?: InterviewSessionWhereInput | InterviewSessionWhereInput[]
    id?: StringFilter<"InterviewSession"> | string
    userId?: StringFilter<"InterviewSession"> | string
    resumeId?: StringNullableFilter<"InterviewSession"> | string | null
    interviewType?: EnumInterviewTypeFilter<"InterviewSession"> | $Enums.InterviewType
    targetRole?: StringFilter<"InterviewSession"> | string
    targetCompany?: StringNullableFilter<"InterviewSession"> | string | null
    industry?: StringFilter<"InterviewSession"> | string
    experienceLevel?: EnumExperienceLevelFilter<"InterviewSession"> | $Enums.ExperienceLevel
    focusAreas?: StringNullableListFilter<"InterviewSession">
    interviewGoal?: StringNullableFilter<"InterviewSession"> | string | null
    durationMins?: IntFilter<"InterviewSession"> | number
    status?: EnumSessionStatusFilter<"InterviewSession"> | $Enums.SessionStatus
    startedAt?: DateTimeNullableFilter<"InterviewSession"> | Date | string | null
    completedAt?: DateTimeNullableFilter<"InterviewSession"> | Date | string | null
    createdAt?: DateTimeFilter<"InterviewSession"> | Date | string
    mode?: EnumInterviewModeFilter<"InterviewSession"> | $Enums.InterviewMode
    hintCount?: IntFilter<"InterviewSession"> | number
    testCasesPassed?: IntNullableFilter<"InterviewSession"> | number | null
    selectedLanguage?: StringNullableFilter<"InterviewSession"> | string | null
    isDeleted?: BoolFilter<"InterviewSession"> | boolean
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    resume?: XOR<ResumeNullableScalarRelationFilter, ResumeWhereInput> | null
    questions?: QuestionListRelationFilter
    analysis?: XOR<AnalysisNullableScalarRelationFilter, AnalysisWhereInput> | null
    chatHistory?: ChatHistoryListRelationFilter
    telemetryLogs?: TelemetryLogListRelationFilter
    codeExecutionDeltas?: CodeExecutionDeltaListRelationFilter
  }

  export type InterviewSessionOrderByWithRelationInput = {
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
    mode?: SortOrder
    hintCount?: SortOrder
    testCasesPassed?: SortOrderInput | SortOrder
    selectedLanguage?: SortOrderInput | SortOrder
    isDeleted?: SortOrder
    user?: UserOrderByWithRelationInput
    resume?: ResumeOrderByWithRelationInput
    questions?: QuestionOrderByRelationAggregateInput
    analysis?: AnalysisOrderByWithRelationInput
    chatHistory?: ChatHistoryOrderByRelationAggregateInput
    telemetryLogs?: TelemetryLogOrderByRelationAggregateInput
    codeExecutionDeltas?: CodeExecutionDeltaOrderByRelationAggregateInput
  }

  export type InterviewSessionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: InterviewSessionWhereInput | InterviewSessionWhereInput[]
    OR?: InterviewSessionWhereInput[]
    NOT?: InterviewSessionWhereInput | InterviewSessionWhereInput[]
    userId?: StringFilter<"InterviewSession"> | string
    resumeId?: StringNullableFilter<"InterviewSession"> | string | null
    interviewType?: EnumInterviewTypeFilter<"InterviewSession"> | $Enums.InterviewType
    targetRole?: StringFilter<"InterviewSession"> | string
    targetCompany?: StringNullableFilter<"InterviewSession"> | string | null
    industry?: StringFilter<"InterviewSession"> | string
    experienceLevel?: EnumExperienceLevelFilter<"InterviewSession"> | $Enums.ExperienceLevel
    focusAreas?: StringNullableListFilter<"InterviewSession">
    interviewGoal?: StringNullableFilter<"InterviewSession"> | string | null
    durationMins?: IntFilter<"InterviewSession"> | number
    status?: EnumSessionStatusFilter<"InterviewSession"> | $Enums.SessionStatus
    startedAt?: DateTimeNullableFilter<"InterviewSession"> | Date | string | null
    completedAt?: DateTimeNullableFilter<"InterviewSession"> | Date | string | null
    createdAt?: DateTimeFilter<"InterviewSession"> | Date | string
    mode?: EnumInterviewModeFilter<"InterviewSession"> | $Enums.InterviewMode
    hintCount?: IntFilter<"InterviewSession"> | number
    testCasesPassed?: IntNullableFilter<"InterviewSession"> | number | null
    selectedLanguage?: StringNullableFilter<"InterviewSession"> | string | null
    isDeleted?: BoolFilter<"InterviewSession"> | boolean
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    resume?: XOR<ResumeNullableScalarRelationFilter, ResumeWhereInput> | null
    questions?: QuestionListRelationFilter
    analysis?: XOR<AnalysisNullableScalarRelationFilter, AnalysisWhereInput> | null
    chatHistory?: ChatHistoryListRelationFilter
    telemetryLogs?: TelemetryLogListRelationFilter
    codeExecutionDeltas?: CodeExecutionDeltaListRelationFilter
  }, "id">

  export type InterviewSessionOrderByWithAggregationInput = {
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
    resumeId?: StringNullableWithAggregatesFilter<"InterviewSession"> | string | null
    interviewType?: EnumInterviewTypeWithAggregatesFilter<"InterviewSession"> | $Enums.InterviewType
    targetRole?: StringWithAggregatesFilter<"InterviewSession"> | string
    targetCompany?: StringNullableWithAggregatesFilter<"InterviewSession"> | string | null
    industry?: StringWithAggregatesFilter<"InterviewSession"> | string
    experienceLevel?: EnumExperienceLevelWithAggregatesFilter<"InterviewSession"> | $Enums.ExperienceLevel
    focusAreas?: StringNullableListFilter<"InterviewSession">
    interviewGoal?: StringNullableWithAggregatesFilter<"InterviewSession"> | string | null
    durationMins?: IntWithAggregatesFilter<"InterviewSession"> | number
    status?: EnumSessionStatusWithAggregatesFilter<"InterviewSession"> | $Enums.SessionStatus
    startedAt?: DateTimeNullableWithAggregatesFilter<"InterviewSession"> | Date | string | null
    completedAt?: DateTimeNullableWithAggregatesFilter<"InterviewSession"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"InterviewSession"> | Date | string
    mode?: EnumInterviewModeWithAggregatesFilter<"InterviewSession"> | $Enums.InterviewMode
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
    questionType?: EnumQuestionTypeFilter<"Question"> | $Enums.QuestionType
    difficulty?: EnumDifficultyFilter<"Question"> | $Enums.Difficulty
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
    questionType?: EnumQuestionTypeFilter<"Question"> | $Enums.QuestionType
    difficulty?: EnumDifficultyFilter<"Question"> | $Enums.Difficulty
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
    questionType?: EnumQuestionTypeWithAggregatesFilter<"Question"> | $Enums.QuestionType
    difficulty?: EnumDifficultyWithAggregatesFilter<"Question"> | $Enums.Difficulty
    answerText?: StringNullableWithAggregatesFilter<"Question"> | string | null
    answeredAt?: DateTimeNullableWithAggregatesFilter<"Question"> | Date | string | null
    timeTakenSecs?: IntNullableWithAggregatesFilter<"Question"> | number | null
    evalScore?: IntNullableWithAggregatesFilter<"Question"> | number | null
    evalFeedback?: StringNullableWithAggregatesFilter<"Question"> | string | null
    evalStrengths?: StringNullableListFilter<"Question">
    evalWeaknesses?: StringNullableListFilter<"Question">
    betterAnswer?: StringNullableWithAggregatesFilter<"Question"> | string | null
  }

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

  export type ChatHistoryWhereInput = {
    AND?: ChatHistoryWhereInput | ChatHistoryWhereInput[]
    OR?: ChatHistoryWhereInput[]
    NOT?: ChatHistoryWhereInput | ChatHistoryWhereInput[]
    id?: StringFilter<"ChatHistory"> | string
    sessionId?: StringFilter<"ChatHistory"> | string
    role?: StringFilter<"ChatHistory"> | string
    content?: StringFilter<"ChatHistory"> | string
    score?: IntNullableFilter<"ChatHistory"> | number | null
    critique?: StringNullableFilter<"ChatHistory"> | string | null
    timestamp?: DateTimeFilter<"ChatHistory"> | Date | string
    interviewSession?: XOR<InterviewSessionScalarRelationFilter, InterviewSessionWhereInput>
  }

  export type ChatHistoryOrderByWithRelationInput = {
    id?: SortOrder
    sessionId?: SortOrder
    role?: SortOrder
    content?: SortOrder
    score?: SortOrderInput | SortOrder
    critique?: SortOrderInput | SortOrder
    timestamp?: SortOrder
    interviewSession?: InterviewSessionOrderByWithRelationInput
  }

  export type ChatHistoryWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ChatHistoryWhereInput | ChatHistoryWhereInput[]
    OR?: ChatHistoryWhereInput[]
    NOT?: ChatHistoryWhereInput | ChatHistoryWhereInput[]
    sessionId?: StringFilter<"ChatHistory"> | string
    role?: StringFilter<"ChatHistory"> | string
    content?: StringFilter<"ChatHistory"> | string
    score?: IntNullableFilter<"ChatHistory"> | number | null
    critique?: StringNullableFilter<"ChatHistory"> | string | null
    timestamp?: DateTimeFilter<"ChatHistory"> | Date | string
    interviewSession?: XOR<InterviewSessionScalarRelationFilter, InterviewSessionWhereInput>
  }, "id">

  export type ChatHistoryOrderByWithAggregationInput = {
    id?: SortOrder
    sessionId?: SortOrder
    role?: SortOrder
    content?: SortOrder
    score?: SortOrderInput | SortOrder
    critique?: SortOrderInput | SortOrder
    timestamp?: SortOrder
    _count?: ChatHistoryCountOrderByAggregateInput
    _avg?: ChatHistoryAvgOrderByAggregateInput
    _max?: ChatHistoryMaxOrderByAggregateInput
    _min?: ChatHistoryMinOrderByAggregateInput
    _sum?: ChatHistorySumOrderByAggregateInput
  }

  export type ChatHistoryScalarWhereWithAggregatesInput = {
    AND?: ChatHistoryScalarWhereWithAggregatesInput | ChatHistoryScalarWhereWithAggregatesInput[]
    OR?: ChatHistoryScalarWhereWithAggregatesInput[]
    NOT?: ChatHistoryScalarWhereWithAggregatesInput | ChatHistoryScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ChatHistory"> | string
    sessionId?: StringWithAggregatesFilter<"ChatHistory"> | string
    role?: StringWithAggregatesFilter<"ChatHistory"> | string
    content?: StringWithAggregatesFilter<"ChatHistory"> | string
    score?: IntNullableWithAggregatesFilter<"ChatHistory"> | number | null
    critique?: StringNullableWithAggregatesFilter<"ChatHistory"> | string | null
    timestamp?: DateTimeWithAggregatesFilter<"ChatHistory"> | Date | string
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
    interviewSession?: XOR<InterviewSessionScalarRelationFilter, InterviewSessionWhereInput>
  }

  export type TelemetryLogOrderByWithRelationInput = {
    id?: SortOrder
    sessionId?: SortOrder
    type?: SortOrder
    wordsPerMinute?: SortOrderInput | SortOrder
    fillerWordsCount?: SortOrderInput | SortOrder
    stressCoefficient?: SortOrderInput | SortOrder
    timestamp?: SortOrder
    interviewSession?: InterviewSessionOrderByWithRelationInput
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
    interviewSession?: XOR<InterviewSessionScalarRelationFilter, InterviewSessionWhereInput>
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
    interviewSession?: XOR<InterviewSessionScalarRelationFilter, InterviewSessionWhereInput>
  }

  export type CodeExecutionDeltaOrderByWithRelationInput = {
    id?: SortOrder
    sessionId?: SortOrder
    code?: SortOrder
    language?: SortOrder
    output?: SortOrderInput | SortOrder
    success?: SortOrderInput | SortOrder
    timestamp?: SortOrder
    interviewSession?: InterviewSessionOrderByWithRelationInput
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
    interviewSession?: XOR<InterviewSessionScalarRelationFilter, InterviewSessionWhereInput>
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

  export type UserCreateInput = {
    id?: string
    email: string
    passwordHash: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
    sessions?: InterviewSessionCreateNestedManyWithoutUserInput
    resumes?: ResumeCreateNestedManyWithoutUserInput
    refreshTokens?: RefreshTokenCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    email: string
    passwordHash: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
    sessions?: InterviewSessionUncheckedCreateNestedManyWithoutUserInput
    resumes?: ResumeUncheckedCreateNestedManyWithoutUserInput
    refreshTokens?: RefreshTokenUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: InterviewSessionUpdateManyWithoutUserNestedInput
    resumes?: ResumeUpdateManyWithoutUserNestedInput
    refreshTokens?: RefreshTokenUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: InterviewSessionUncheckedUpdateManyWithoutUserNestedInput
    resumes?: ResumeUncheckedUpdateManyWithoutUserNestedInput
    refreshTokens?: RefreshTokenUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    email: string
    passwordHash: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RefreshTokenCreateInput = {
    id?: string
    tokenId: string
    expiresAt: Date | string
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutRefreshTokensInput
  }

  export type RefreshTokenUncheckedCreateInput = {
    id?: string
    userId: string
    tokenId: string
    expiresAt: Date | string
    createdAt?: Date | string
  }

  export type RefreshTokenUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tokenId?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutRefreshTokensNestedInput
  }

  export type RefreshTokenUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    tokenId?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RefreshTokenCreateManyInput = {
    id?: string
    userId: string
    tokenId: string
    expiresAt: Date | string
    createdAt?: Date | string
  }

  export type RefreshTokenUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    tokenId?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RefreshTokenUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    tokenId?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ResumeCreateInput = {
    id?: string
    fileName: string
    filePath: string
    parsedText?: string | null
    skills?: ResumeCreateskillsInput | string[]
    experience?: NullableJsonNullValueInput | InputJsonValue
    uploadedAt?: Date | string
    user: UserCreateNestedOneWithoutResumesInput
    sessions?: InterviewSessionCreateNestedManyWithoutResumeInput
  }

  export type ResumeUncheckedCreateInput = {
    id?: string
    userId: string
    fileName: string
    filePath: string
    parsedText?: string | null
    skills?: ResumeCreateskillsInput | string[]
    experience?: NullableJsonNullValueInput | InputJsonValue
    uploadedAt?: Date | string
    sessions?: InterviewSessionUncheckedCreateNestedManyWithoutResumeInput
  }

  export type ResumeUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    filePath?: StringFieldUpdateOperationsInput | string
    parsedText?: NullableStringFieldUpdateOperationsInput | string | null
    skills?: ResumeUpdateskillsInput | string[]
    experience?: NullableJsonNullValueInput | InputJsonValue
    uploadedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutResumesNestedInput
    sessions?: InterviewSessionUpdateManyWithoutResumeNestedInput
  }

  export type ResumeUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    filePath?: StringFieldUpdateOperationsInput | string
    parsedText?: NullableStringFieldUpdateOperationsInput | string | null
    skills?: ResumeUpdateskillsInput | string[]
    experience?: NullableJsonNullValueInput | InputJsonValue
    uploadedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: InterviewSessionUncheckedUpdateManyWithoutResumeNestedInput
  }

  export type ResumeCreateManyInput = {
    id?: string
    userId: string
    fileName: string
    filePath: string
    parsedText?: string | null
    skills?: ResumeCreateskillsInput | string[]
    experience?: NullableJsonNullValueInput | InputJsonValue
    uploadedAt?: Date | string
  }

  export type ResumeUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    filePath?: StringFieldUpdateOperationsInput | string
    parsedText?: NullableStringFieldUpdateOperationsInput | string | null
    skills?: ResumeUpdateskillsInput | string[]
    experience?: NullableJsonNullValueInput | InputJsonValue
    uploadedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ResumeUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    filePath?: StringFieldUpdateOperationsInput | string
    parsedText?: NullableStringFieldUpdateOperationsInput | string | null
    skills?: ResumeUpdateskillsInput | string[]
    experience?: NullableJsonNullValueInput | InputJsonValue
    uploadedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InterviewSessionCreateInput = {
    id?: string
    interviewType: $Enums.InterviewType
    targetRole: string
    targetCompany?: string | null
    industry: string
    experienceLevel: $Enums.ExperienceLevel
    focusAreas?: InterviewSessionCreatefocusAreasInput | string[]
    interviewGoal?: string | null
    durationMins?: number
    status?: $Enums.SessionStatus
    startedAt?: Date | string | null
    completedAt?: Date | string | null
    createdAt?: Date | string
    mode?: $Enums.InterviewMode
    hintCount?: number
    testCasesPassed?: number | null
    selectedLanguage?: string | null
    isDeleted?: boolean
    user: UserCreateNestedOneWithoutSessionsInput
    resume?: ResumeCreateNestedOneWithoutSessionsInput
    questions?: QuestionCreateNestedManyWithoutSessionInput
    analysis?: AnalysisCreateNestedOneWithoutSessionInput
    chatHistory?: ChatHistoryCreateNestedManyWithoutInterviewSessionInput
    telemetryLogs?: TelemetryLogCreateNestedManyWithoutInterviewSessionInput
    codeExecutionDeltas?: CodeExecutionDeltaCreateNestedManyWithoutInterviewSessionInput
  }

  export type InterviewSessionUncheckedCreateInput = {
    id?: string
    userId: string
    resumeId?: string | null
    interviewType: $Enums.InterviewType
    targetRole: string
    targetCompany?: string | null
    industry: string
    experienceLevel: $Enums.ExperienceLevel
    focusAreas?: InterviewSessionCreatefocusAreasInput | string[]
    interviewGoal?: string | null
    durationMins?: number
    status?: $Enums.SessionStatus
    startedAt?: Date | string | null
    completedAt?: Date | string | null
    createdAt?: Date | string
    mode?: $Enums.InterviewMode
    hintCount?: number
    testCasesPassed?: number | null
    selectedLanguage?: string | null
    isDeleted?: boolean
    questions?: QuestionUncheckedCreateNestedManyWithoutSessionInput
    analysis?: AnalysisUncheckedCreateNestedOneWithoutSessionInput
    chatHistory?: ChatHistoryUncheckedCreateNestedManyWithoutInterviewSessionInput
    telemetryLogs?: TelemetryLogUncheckedCreateNestedManyWithoutInterviewSessionInput
    codeExecutionDeltas?: CodeExecutionDeltaUncheckedCreateNestedManyWithoutInterviewSessionInput
  }

  export type InterviewSessionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    interviewType?: EnumInterviewTypeFieldUpdateOperationsInput | $Enums.InterviewType
    targetRole?: StringFieldUpdateOperationsInput | string
    targetCompany?: NullableStringFieldUpdateOperationsInput | string | null
    industry?: StringFieldUpdateOperationsInput | string
    experienceLevel?: EnumExperienceLevelFieldUpdateOperationsInput | $Enums.ExperienceLevel
    focusAreas?: InterviewSessionUpdatefocusAreasInput | string[]
    interviewGoal?: NullableStringFieldUpdateOperationsInput | string | null
    durationMins?: IntFieldUpdateOperationsInput | number
    status?: EnumSessionStatusFieldUpdateOperationsInput | $Enums.SessionStatus
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    mode?: EnumInterviewModeFieldUpdateOperationsInput | $Enums.InterviewMode
    hintCount?: IntFieldUpdateOperationsInput | number
    testCasesPassed?: NullableIntFieldUpdateOperationsInput | number | null
    selectedLanguage?: NullableStringFieldUpdateOperationsInput | string | null
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    user?: UserUpdateOneRequiredWithoutSessionsNestedInput
    resume?: ResumeUpdateOneWithoutSessionsNestedInput
    questions?: QuestionUpdateManyWithoutSessionNestedInput
    analysis?: AnalysisUpdateOneWithoutSessionNestedInput
    chatHistory?: ChatHistoryUpdateManyWithoutInterviewSessionNestedInput
    telemetryLogs?: TelemetryLogUpdateManyWithoutInterviewSessionNestedInput
    codeExecutionDeltas?: CodeExecutionDeltaUpdateManyWithoutInterviewSessionNestedInput
  }

  export type InterviewSessionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    resumeId?: NullableStringFieldUpdateOperationsInput | string | null
    interviewType?: EnumInterviewTypeFieldUpdateOperationsInput | $Enums.InterviewType
    targetRole?: StringFieldUpdateOperationsInput | string
    targetCompany?: NullableStringFieldUpdateOperationsInput | string | null
    industry?: StringFieldUpdateOperationsInput | string
    experienceLevel?: EnumExperienceLevelFieldUpdateOperationsInput | $Enums.ExperienceLevel
    focusAreas?: InterviewSessionUpdatefocusAreasInput | string[]
    interviewGoal?: NullableStringFieldUpdateOperationsInput | string | null
    durationMins?: IntFieldUpdateOperationsInput | number
    status?: EnumSessionStatusFieldUpdateOperationsInput | $Enums.SessionStatus
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    mode?: EnumInterviewModeFieldUpdateOperationsInput | $Enums.InterviewMode
    hintCount?: IntFieldUpdateOperationsInput | number
    testCasesPassed?: NullableIntFieldUpdateOperationsInput | number | null
    selectedLanguage?: NullableStringFieldUpdateOperationsInput | string | null
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    questions?: QuestionUncheckedUpdateManyWithoutSessionNestedInput
    analysis?: AnalysisUncheckedUpdateOneWithoutSessionNestedInput
    chatHistory?: ChatHistoryUncheckedUpdateManyWithoutInterviewSessionNestedInput
    telemetryLogs?: TelemetryLogUncheckedUpdateManyWithoutInterviewSessionNestedInput
    codeExecutionDeltas?: CodeExecutionDeltaUncheckedUpdateManyWithoutInterviewSessionNestedInput
  }

  export type InterviewSessionCreateManyInput = {
    id?: string
    userId: string
    resumeId?: string | null
    interviewType: $Enums.InterviewType
    targetRole: string
    targetCompany?: string | null
    industry: string
    experienceLevel: $Enums.ExperienceLevel
    focusAreas?: InterviewSessionCreatefocusAreasInput | string[]
    interviewGoal?: string | null
    durationMins?: number
    status?: $Enums.SessionStatus
    startedAt?: Date | string | null
    completedAt?: Date | string | null
    createdAt?: Date | string
    mode?: $Enums.InterviewMode
    hintCount?: number
    testCasesPassed?: number | null
    selectedLanguage?: string | null
    isDeleted?: boolean
  }

  export type InterviewSessionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    interviewType?: EnumInterviewTypeFieldUpdateOperationsInput | $Enums.InterviewType
    targetRole?: StringFieldUpdateOperationsInput | string
    targetCompany?: NullableStringFieldUpdateOperationsInput | string | null
    industry?: StringFieldUpdateOperationsInput | string
    experienceLevel?: EnumExperienceLevelFieldUpdateOperationsInput | $Enums.ExperienceLevel
    focusAreas?: InterviewSessionUpdatefocusAreasInput | string[]
    interviewGoal?: NullableStringFieldUpdateOperationsInput | string | null
    durationMins?: IntFieldUpdateOperationsInput | number
    status?: EnumSessionStatusFieldUpdateOperationsInput | $Enums.SessionStatus
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    mode?: EnumInterviewModeFieldUpdateOperationsInput | $Enums.InterviewMode
    hintCount?: IntFieldUpdateOperationsInput | number
    testCasesPassed?: NullableIntFieldUpdateOperationsInput | number | null
    selectedLanguage?: NullableStringFieldUpdateOperationsInput | string | null
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
  }

  export type InterviewSessionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    resumeId?: NullableStringFieldUpdateOperationsInput | string | null
    interviewType?: EnumInterviewTypeFieldUpdateOperationsInput | $Enums.InterviewType
    targetRole?: StringFieldUpdateOperationsInput | string
    targetCompany?: NullableStringFieldUpdateOperationsInput | string | null
    industry?: StringFieldUpdateOperationsInput | string
    experienceLevel?: EnumExperienceLevelFieldUpdateOperationsInput | $Enums.ExperienceLevel
    focusAreas?: InterviewSessionUpdatefocusAreasInput | string[]
    interviewGoal?: NullableStringFieldUpdateOperationsInput | string | null
    durationMins?: IntFieldUpdateOperationsInput | number
    status?: EnumSessionStatusFieldUpdateOperationsInput | $Enums.SessionStatus
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    mode?: EnumInterviewModeFieldUpdateOperationsInput | $Enums.InterviewMode
    hintCount?: IntFieldUpdateOperationsInput | number
    testCasesPassed?: NullableIntFieldUpdateOperationsInput | number | null
    selectedLanguage?: NullableStringFieldUpdateOperationsInput | string | null
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
  }

  export type QuestionCreateInput = {
    id?: string
    orderIndex: number
    questionText: string
    questionType: $Enums.QuestionType
    difficulty: $Enums.Difficulty
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
    questionType: $Enums.QuestionType
    difficulty: $Enums.Difficulty
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
    questionType?: EnumQuestionTypeFieldUpdateOperationsInput | $Enums.QuestionType
    difficulty?: EnumDifficultyFieldUpdateOperationsInput | $Enums.Difficulty
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
    questionType?: EnumQuestionTypeFieldUpdateOperationsInput | $Enums.QuestionType
    difficulty?: EnumDifficultyFieldUpdateOperationsInput | $Enums.Difficulty
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
    questionType: $Enums.QuestionType
    difficulty: $Enums.Difficulty
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
    questionType?: EnumQuestionTypeFieldUpdateOperationsInput | $Enums.QuestionType
    difficulty?: EnumDifficultyFieldUpdateOperationsInput | $Enums.Difficulty
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
    questionType?: EnumQuestionTypeFieldUpdateOperationsInput | $Enums.QuestionType
    difficulty?: EnumDifficultyFieldUpdateOperationsInput | $Enums.Difficulty
    answerText?: NullableStringFieldUpdateOperationsInput | string | null
    answeredAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    timeTakenSecs?: NullableIntFieldUpdateOperationsInput | number | null
    evalScore?: NullableIntFieldUpdateOperationsInput | number | null
    evalFeedback?: NullableStringFieldUpdateOperationsInput | string | null
    evalStrengths?: QuestionUpdateevalStrengthsInput | string[]
    evalWeaknesses?: QuestionUpdateevalWeaknessesInput | string[]
    betterAnswer?: NullableStringFieldUpdateOperationsInput | string | null
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

  export type ChatHistoryCreateInput = {
    id?: string
    role: string
    content: string
    score?: number | null
    critique?: string | null
    timestamp?: Date | string
    interviewSession: InterviewSessionCreateNestedOneWithoutChatHistoryInput
  }

  export type ChatHistoryUncheckedCreateInput = {
    id?: string
    sessionId: string
    role: string
    content: string
    score?: number | null
    critique?: string | null
    timestamp?: Date | string
  }

  export type ChatHistoryUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    score?: NullableIntFieldUpdateOperationsInput | number | null
    critique?: NullableStringFieldUpdateOperationsInput | string | null
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    interviewSession?: InterviewSessionUpdateOneRequiredWithoutChatHistoryNestedInput
  }

  export type ChatHistoryUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionId?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    score?: NullableIntFieldUpdateOperationsInput | number | null
    critique?: NullableStringFieldUpdateOperationsInput | string | null
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChatHistoryCreateManyInput = {
    id?: string
    sessionId: string
    role: string
    content: string
    score?: number | null
    critique?: string | null
    timestamp?: Date | string
  }

  export type ChatHistoryUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    score?: NullableIntFieldUpdateOperationsInput | number | null
    critique?: NullableStringFieldUpdateOperationsInput | string | null
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChatHistoryUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionId?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    score?: NullableIntFieldUpdateOperationsInput | number | null
    critique?: NullableStringFieldUpdateOperationsInput | string | null
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TelemetryLogCreateInput = {
    id?: string
    type: string
    wordsPerMinute?: number | null
    fillerWordsCount?: number | null
    stressCoefficient?: number | null
    timestamp?: Date | string
    interviewSession: InterviewSessionCreateNestedOneWithoutTelemetryLogsInput
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
    type?: StringFieldUpdateOperationsInput | string
    wordsPerMinute?: NullableIntFieldUpdateOperationsInput | number | null
    fillerWordsCount?: NullableIntFieldUpdateOperationsInput | number | null
    stressCoefficient?: NullableFloatFieldUpdateOperationsInput | number | null
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    interviewSession?: InterviewSessionUpdateOneRequiredWithoutTelemetryLogsNestedInput
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
    interviewSession: InterviewSessionCreateNestedOneWithoutCodeExecutionDeltasInput
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
    interviewSession?: InterviewSessionUpdateOneRequiredWithoutCodeExecutionDeltasNestedInput
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

  export type InterviewSessionListRelationFilter = {
    every?: InterviewSessionWhereInput
    some?: InterviewSessionWhereInput
    none?: InterviewSessionWhereInput
  }

  export type ResumeListRelationFilter = {
    every?: ResumeWhereInput
    some?: ResumeWhereInput
    none?: ResumeWhereInput
  }

  export type RefreshTokenListRelationFilter = {
    every?: RefreshTokenWhereInput
    some?: RefreshTokenWhereInput
    none?: RefreshTokenWhereInput
  }

  export type InterviewSessionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ResumeOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type RefreshTokenOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    name?: SortOrder
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

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type RefreshTokenUserIdTokenIdCompoundUniqueInput = {
    userId: string
    tokenId: string
  }

  export type RefreshTokenCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    tokenId?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
  }

  export type RefreshTokenMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    tokenId?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
  }

  export type RefreshTokenMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    tokenId?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
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

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type ResumeCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    fileName?: SortOrder
    filePath?: SortOrder
    parsedText?: SortOrder
    skills?: SortOrder
    experience?: SortOrder
    uploadedAt?: SortOrder
  }

  export type ResumeMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    fileName?: SortOrder
    filePath?: SortOrder
    parsedText?: SortOrder
    uploadedAt?: SortOrder
  }

  export type ResumeMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    fileName?: SortOrder
    filePath?: SortOrder
    parsedText?: SortOrder
    uploadedAt?: SortOrder
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

  export type EnumInterviewTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.InterviewType | EnumInterviewTypeFieldRefInput<$PrismaModel>
    in?: $Enums.InterviewType[] | ListEnumInterviewTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.InterviewType[] | ListEnumInterviewTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumInterviewTypeFilter<$PrismaModel> | $Enums.InterviewType
  }

  export type EnumExperienceLevelFilter<$PrismaModel = never> = {
    equals?: $Enums.ExperienceLevel | EnumExperienceLevelFieldRefInput<$PrismaModel>
    in?: $Enums.ExperienceLevel[] | ListEnumExperienceLevelFieldRefInput<$PrismaModel>
    notIn?: $Enums.ExperienceLevel[] | ListEnumExperienceLevelFieldRefInput<$PrismaModel>
    not?: NestedEnumExperienceLevelFilter<$PrismaModel> | $Enums.ExperienceLevel
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

  export type EnumSessionStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.SessionStatus | EnumSessionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.SessionStatus[] | ListEnumSessionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.SessionStatus[] | ListEnumSessionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumSessionStatusFilter<$PrismaModel> | $Enums.SessionStatus
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

  export type EnumInterviewModeFilter<$PrismaModel = never> = {
    equals?: $Enums.InterviewMode | EnumInterviewModeFieldRefInput<$PrismaModel>
    in?: $Enums.InterviewMode[] | ListEnumInterviewModeFieldRefInput<$PrismaModel>
    notIn?: $Enums.InterviewMode[] | ListEnumInterviewModeFieldRefInput<$PrismaModel>
    not?: NestedEnumInterviewModeFilter<$PrismaModel> | $Enums.InterviewMode
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

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type ResumeNullableScalarRelationFilter = {
    is?: ResumeWhereInput | null
    isNot?: ResumeWhereInput | null
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

  export type ChatHistoryListRelationFilter = {
    every?: ChatHistoryWhereInput
    some?: ChatHistoryWhereInput
    none?: ChatHistoryWhereInput
  }

  export type TelemetryLogListRelationFilter = {
    every?: TelemetryLogWhereInput
    some?: TelemetryLogWhereInput
    none?: TelemetryLogWhereInput
  }

  export type CodeExecutionDeltaListRelationFilter = {
    every?: CodeExecutionDeltaWhereInput
    some?: CodeExecutionDeltaWhereInput
    none?: CodeExecutionDeltaWhereInput
  }

  export type QuestionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ChatHistoryOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TelemetryLogOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type CodeExecutionDeltaOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type InterviewSessionCountOrderByAggregateInput = {
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
    mode?: SortOrder
    hintCount?: SortOrder
    testCasesPassed?: SortOrder
    selectedLanguage?: SortOrder
    isDeleted?: SortOrder
  }

  export type InterviewSessionMinOrderByAggregateInput = {
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

  export type EnumInterviewTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.InterviewType | EnumInterviewTypeFieldRefInput<$PrismaModel>
    in?: $Enums.InterviewType[] | ListEnumInterviewTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.InterviewType[] | ListEnumInterviewTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumInterviewTypeWithAggregatesFilter<$PrismaModel> | $Enums.InterviewType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumInterviewTypeFilter<$PrismaModel>
    _max?: NestedEnumInterviewTypeFilter<$PrismaModel>
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

  export type EnumSessionStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.SessionStatus | EnumSessionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.SessionStatus[] | ListEnumSessionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.SessionStatus[] | ListEnumSessionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumSessionStatusWithAggregatesFilter<$PrismaModel> | $Enums.SessionStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumSessionStatusFilter<$PrismaModel>
    _max?: NestedEnumSessionStatusFilter<$PrismaModel>
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

  export type EnumInterviewModeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.InterviewMode | EnumInterviewModeFieldRefInput<$PrismaModel>
    in?: $Enums.InterviewMode[] | ListEnumInterviewModeFieldRefInput<$PrismaModel>
    notIn?: $Enums.InterviewMode[] | ListEnumInterviewModeFieldRefInput<$PrismaModel>
    not?: NestedEnumInterviewModeWithAggregatesFilter<$PrismaModel> | $Enums.InterviewMode
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumInterviewModeFilter<$PrismaModel>
    _max?: NestedEnumInterviewModeFilter<$PrismaModel>
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

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type EnumQuestionTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.QuestionType | EnumQuestionTypeFieldRefInput<$PrismaModel>
    in?: $Enums.QuestionType[] | ListEnumQuestionTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.QuestionType[] | ListEnumQuestionTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumQuestionTypeFilter<$PrismaModel> | $Enums.QuestionType
  }

  export type EnumDifficultyFilter<$PrismaModel = never> = {
    equals?: $Enums.Difficulty | EnumDifficultyFieldRefInput<$PrismaModel>
    in?: $Enums.Difficulty[] | ListEnumDifficultyFieldRefInput<$PrismaModel>
    notIn?: $Enums.Difficulty[] | ListEnumDifficultyFieldRefInput<$PrismaModel>
    not?: NestedEnumDifficultyFilter<$PrismaModel> | $Enums.Difficulty
  }

  export type InterviewSessionScalarRelationFilter = {
    is?: InterviewSessionWhereInput
    isNot?: InterviewSessionWhereInput
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

  export type EnumQuestionTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.QuestionType | EnumQuestionTypeFieldRefInput<$PrismaModel>
    in?: $Enums.QuestionType[] | ListEnumQuestionTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.QuestionType[] | ListEnumQuestionTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumQuestionTypeWithAggregatesFilter<$PrismaModel> | $Enums.QuestionType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumQuestionTypeFilter<$PrismaModel>
    _max?: NestedEnumQuestionTypeFilter<$PrismaModel>
  }

  export type EnumDifficultyWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Difficulty | EnumDifficultyFieldRefInput<$PrismaModel>
    in?: $Enums.Difficulty[] | ListEnumDifficultyFieldRefInput<$PrismaModel>
    notIn?: $Enums.Difficulty[] | ListEnumDifficultyFieldRefInput<$PrismaModel>
    not?: NestedEnumDifficultyWithAggregatesFilter<$PrismaModel> | $Enums.Difficulty
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumDifficultyFilter<$PrismaModel>
    _max?: NestedEnumDifficultyFilter<$PrismaModel>
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

  export type ChatHistoryCountOrderByAggregateInput = {
    id?: SortOrder
    sessionId?: SortOrder
    role?: SortOrder
    content?: SortOrder
    score?: SortOrder
    critique?: SortOrder
    timestamp?: SortOrder
  }

  export type ChatHistoryAvgOrderByAggregateInput = {
    score?: SortOrder
  }

  export type ChatHistoryMaxOrderByAggregateInput = {
    id?: SortOrder
    sessionId?: SortOrder
    role?: SortOrder
    content?: SortOrder
    score?: SortOrder
    critique?: SortOrder
    timestamp?: SortOrder
  }

  export type ChatHistoryMinOrderByAggregateInput = {
    id?: SortOrder
    sessionId?: SortOrder
    role?: SortOrder
    content?: SortOrder
    score?: SortOrder
    critique?: SortOrder
    timestamp?: SortOrder
  }

  export type ChatHistorySumOrderByAggregateInput = {
    score?: SortOrder
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

  export type BoolNullableFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableFilter<$PrismaModel> | boolean | null
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

  export type BoolNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableWithAggregatesFilter<$PrismaModel> | boolean | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedBoolNullableFilter<$PrismaModel>
    _max?: NestedBoolNullableFilter<$PrismaModel>
  }

  export type InterviewSessionCreateNestedManyWithoutUserInput = {
    create?: XOR<InterviewSessionCreateWithoutUserInput, InterviewSessionUncheckedCreateWithoutUserInput> | InterviewSessionCreateWithoutUserInput[] | InterviewSessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: InterviewSessionCreateOrConnectWithoutUserInput | InterviewSessionCreateOrConnectWithoutUserInput[]
    createMany?: InterviewSessionCreateManyUserInputEnvelope
    connect?: InterviewSessionWhereUniqueInput | InterviewSessionWhereUniqueInput[]
  }

  export type ResumeCreateNestedManyWithoutUserInput = {
    create?: XOR<ResumeCreateWithoutUserInput, ResumeUncheckedCreateWithoutUserInput> | ResumeCreateWithoutUserInput[] | ResumeUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ResumeCreateOrConnectWithoutUserInput | ResumeCreateOrConnectWithoutUserInput[]
    createMany?: ResumeCreateManyUserInputEnvelope
    connect?: ResumeWhereUniqueInput | ResumeWhereUniqueInput[]
  }

  export type RefreshTokenCreateNestedManyWithoutUserInput = {
    create?: XOR<RefreshTokenCreateWithoutUserInput, RefreshTokenUncheckedCreateWithoutUserInput> | RefreshTokenCreateWithoutUserInput[] | RefreshTokenUncheckedCreateWithoutUserInput[]
    connectOrCreate?: RefreshTokenCreateOrConnectWithoutUserInput | RefreshTokenCreateOrConnectWithoutUserInput[]
    createMany?: RefreshTokenCreateManyUserInputEnvelope
    connect?: RefreshTokenWhereUniqueInput | RefreshTokenWhereUniqueInput[]
  }

  export type InterviewSessionUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<InterviewSessionCreateWithoutUserInput, InterviewSessionUncheckedCreateWithoutUserInput> | InterviewSessionCreateWithoutUserInput[] | InterviewSessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: InterviewSessionCreateOrConnectWithoutUserInput | InterviewSessionCreateOrConnectWithoutUserInput[]
    createMany?: InterviewSessionCreateManyUserInputEnvelope
    connect?: InterviewSessionWhereUniqueInput | InterviewSessionWhereUniqueInput[]
  }

  export type ResumeUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<ResumeCreateWithoutUserInput, ResumeUncheckedCreateWithoutUserInput> | ResumeCreateWithoutUserInput[] | ResumeUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ResumeCreateOrConnectWithoutUserInput | ResumeCreateOrConnectWithoutUserInput[]
    createMany?: ResumeCreateManyUserInputEnvelope
    connect?: ResumeWhereUniqueInput | ResumeWhereUniqueInput[]
  }

  export type RefreshTokenUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<RefreshTokenCreateWithoutUserInput, RefreshTokenUncheckedCreateWithoutUserInput> | RefreshTokenCreateWithoutUserInput[] | RefreshTokenUncheckedCreateWithoutUserInput[]
    connectOrCreate?: RefreshTokenCreateOrConnectWithoutUserInput | RefreshTokenCreateOrConnectWithoutUserInput[]
    createMany?: RefreshTokenCreateManyUserInputEnvelope
    connect?: RefreshTokenWhereUniqueInput | RefreshTokenWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type InterviewSessionUpdateManyWithoutUserNestedInput = {
    create?: XOR<InterviewSessionCreateWithoutUserInput, InterviewSessionUncheckedCreateWithoutUserInput> | InterviewSessionCreateWithoutUserInput[] | InterviewSessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: InterviewSessionCreateOrConnectWithoutUserInput | InterviewSessionCreateOrConnectWithoutUserInput[]
    upsert?: InterviewSessionUpsertWithWhereUniqueWithoutUserInput | InterviewSessionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: InterviewSessionCreateManyUserInputEnvelope
    set?: InterviewSessionWhereUniqueInput | InterviewSessionWhereUniqueInput[]
    disconnect?: InterviewSessionWhereUniqueInput | InterviewSessionWhereUniqueInput[]
    delete?: InterviewSessionWhereUniqueInput | InterviewSessionWhereUniqueInput[]
    connect?: InterviewSessionWhereUniqueInput | InterviewSessionWhereUniqueInput[]
    update?: InterviewSessionUpdateWithWhereUniqueWithoutUserInput | InterviewSessionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: InterviewSessionUpdateManyWithWhereWithoutUserInput | InterviewSessionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: InterviewSessionScalarWhereInput | InterviewSessionScalarWhereInput[]
  }

  export type ResumeUpdateManyWithoutUserNestedInput = {
    create?: XOR<ResumeCreateWithoutUserInput, ResumeUncheckedCreateWithoutUserInput> | ResumeCreateWithoutUserInput[] | ResumeUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ResumeCreateOrConnectWithoutUserInput | ResumeCreateOrConnectWithoutUserInput[]
    upsert?: ResumeUpsertWithWhereUniqueWithoutUserInput | ResumeUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ResumeCreateManyUserInputEnvelope
    set?: ResumeWhereUniqueInput | ResumeWhereUniqueInput[]
    disconnect?: ResumeWhereUniqueInput | ResumeWhereUniqueInput[]
    delete?: ResumeWhereUniqueInput | ResumeWhereUniqueInput[]
    connect?: ResumeWhereUniqueInput | ResumeWhereUniqueInput[]
    update?: ResumeUpdateWithWhereUniqueWithoutUserInput | ResumeUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ResumeUpdateManyWithWhereWithoutUserInput | ResumeUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ResumeScalarWhereInput | ResumeScalarWhereInput[]
  }

  export type RefreshTokenUpdateManyWithoutUserNestedInput = {
    create?: XOR<RefreshTokenCreateWithoutUserInput, RefreshTokenUncheckedCreateWithoutUserInput> | RefreshTokenCreateWithoutUserInput[] | RefreshTokenUncheckedCreateWithoutUserInput[]
    connectOrCreate?: RefreshTokenCreateOrConnectWithoutUserInput | RefreshTokenCreateOrConnectWithoutUserInput[]
    upsert?: RefreshTokenUpsertWithWhereUniqueWithoutUserInput | RefreshTokenUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: RefreshTokenCreateManyUserInputEnvelope
    set?: RefreshTokenWhereUniqueInput | RefreshTokenWhereUniqueInput[]
    disconnect?: RefreshTokenWhereUniqueInput | RefreshTokenWhereUniqueInput[]
    delete?: RefreshTokenWhereUniqueInput | RefreshTokenWhereUniqueInput[]
    connect?: RefreshTokenWhereUniqueInput | RefreshTokenWhereUniqueInput[]
    update?: RefreshTokenUpdateWithWhereUniqueWithoutUserInput | RefreshTokenUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: RefreshTokenUpdateManyWithWhereWithoutUserInput | RefreshTokenUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: RefreshTokenScalarWhereInput | RefreshTokenScalarWhereInput[]
  }

  export type InterviewSessionUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<InterviewSessionCreateWithoutUserInput, InterviewSessionUncheckedCreateWithoutUserInput> | InterviewSessionCreateWithoutUserInput[] | InterviewSessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: InterviewSessionCreateOrConnectWithoutUserInput | InterviewSessionCreateOrConnectWithoutUserInput[]
    upsert?: InterviewSessionUpsertWithWhereUniqueWithoutUserInput | InterviewSessionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: InterviewSessionCreateManyUserInputEnvelope
    set?: InterviewSessionWhereUniqueInput | InterviewSessionWhereUniqueInput[]
    disconnect?: InterviewSessionWhereUniqueInput | InterviewSessionWhereUniqueInput[]
    delete?: InterviewSessionWhereUniqueInput | InterviewSessionWhereUniqueInput[]
    connect?: InterviewSessionWhereUniqueInput | InterviewSessionWhereUniqueInput[]
    update?: InterviewSessionUpdateWithWhereUniqueWithoutUserInput | InterviewSessionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: InterviewSessionUpdateManyWithWhereWithoutUserInput | InterviewSessionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: InterviewSessionScalarWhereInput | InterviewSessionScalarWhereInput[]
  }

  export type ResumeUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<ResumeCreateWithoutUserInput, ResumeUncheckedCreateWithoutUserInput> | ResumeCreateWithoutUserInput[] | ResumeUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ResumeCreateOrConnectWithoutUserInput | ResumeCreateOrConnectWithoutUserInput[]
    upsert?: ResumeUpsertWithWhereUniqueWithoutUserInput | ResumeUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ResumeCreateManyUserInputEnvelope
    set?: ResumeWhereUniqueInput | ResumeWhereUniqueInput[]
    disconnect?: ResumeWhereUniqueInput | ResumeWhereUniqueInput[]
    delete?: ResumeWhereUniqueInput | ResumeWhereUniqueInput[]
    connect?: ResumeWhereUniqueInput | ResumeWhereUniqueInput[]
    update?: ResumeUpdateWithWhereUniqueWithoutUserInput | ResumeUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ResumeUpdateManyWithWhereWithoutUserInput | ResumeUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ResumeScalarWhereInput | ResumeScalarWhereInput[]
  }

  export type RefreshTokenUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<RefreshTokenCreateWithoutUserInput, RefreshTokenUncheckedCreateWithoutUserInput> | RefreshTokenCreateWithoutUserInput[] | RefreshTokenUncheckedCreateWithoutUserInput[]
    connectOrCreate?: RefreshTokenCreateOrConnectWithoutUserInput | RefreshTokenCreateOrConnectWithoutUserInput[]
    upsert?: RefreshTokenUpsertWithWhereUniqueWithoutUserInput | RefreshTokenUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: RefreshTokenCreateManyUserInputEnvelope
    set?: RefreshTokenWhereUniqueInput | RefreshTokenWhereUniqueInput[]
    disconnect?: RefreshTokenWhereUniqueInput | RefreshTokenWhereUniqueInput[]
    delete?: RefreshTokenWhereUniqueInput | RefreshTokenWhereUniqueInput[]
    connect?: RefreshTokenWhereUniqueInput | RefreshTokenWhereUniqueInput[]
    update?: RefreshTokenUpdateWithWhereUniqueWithoutUserInput | RefreshTokenUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: RefreshTokenUpdateManyWithWhereWithoutUserInput | RefreshTokenUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: RefreshTokenScalarWhereInput | RefreshTokenScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutRefreshTokensInput = {
    create?: XOR<UserCreateWithoutRefreshTokensInput, UserUncheckedCreateWithoutRefreshTokensInput>
    connectOrCreate?: UserCreateOrConnectWithoutRefreshTokensInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutRefreshTokensNestedInput = {
    create?: XOR<UserCreateWithoutRefreshTokensInput, UserUncheckedCreateWithoutRefreshTokensInput>
    connectOrCreate?: UserCreateOrConnectWithoutRefreshTokensInput
    upsert?: UserUpsertWithoutRefreshTokensInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutRefreshTokensInput, UserUpdateWithoutRefreshTokensInput>, UserUncheckedUpdateWithoutRefreshTokensInput>
  }

  export type ResumeCreateskillsInput = {
    set: string[]
  }

  export type UserCreateNestedOneWithoutResumesInput = {
    create?: XOR<UserCreateWithoutResumesInput, UserUncheckedCreateWithoutResumesInput>
    connectOrCreate?: UserCreateOrConnectWithoutResumesInput
    connect?: UserWhereUniqueInput
  }

  export type InterviewSessionCreateNestedManyWithoutResumeInput = {
    create?: XOR<InterviewSessionCreateWithoutResumeInput, InterviewSessionUncheckedCreateWithoutResumeInput> | InterviewSessionCreateWithoutResumeInput[] | InterviewSessionUncheckedCreateWithoutResumeInput[]
    connectOrCreate?: InterviewSessionCreateOrConnectWithoutResumeInput | InterviewSessionCreateOrConnectWithoutResumeInput[]
    createMany?: InterviewSessionCreateManyResumeInputEnvelope
    connect?: InterviewSessionWhereUniqueInput | InterviewSessionWhereUniqueInput[]
  }

  export type InterviewSessionUncheckedCreateNestedManyWithoutResumeInput = {
    create?: XOR<InterviewSessionCreateWithoutResumeInput, InterviewSessionUncheckedCreateWithoutResumeInput> | InterviewSessionCreateWithoutResumeInput[] | InterviewSessionUncheckedCreateWithoutResumeInput[]
    connectOrCreate?: InterviewSessionCreateOrConnectWithoutResumeInput | InterviewSessionCreateOrConnectWithoutResumeInput[]
    createMany?: InterviewSessionCreateManyResumeInputEnvelope
    connect?: InterviewSessionWhereUniqueInput | InterviewSessionWhereUniqueInput[]
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type ResumeUpdateskillsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type UserUpdateOneRequiredWithoutResumesNestedInput = {
    create?: XOR<UserCreateWithoutResumesInput, UserUncheckedCreateWithoutResumesInput>
    connectOrCreate?: UserCreateOrConnectWithoutResumesInput
    upsert?: UserUpsertWithoutResumesInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutResumesInput, UserUpdateWithoutResumesInput>, UserUncheckedUpdateWithoutResumesInput>
  }

  export type InterviewSessionUpdateManyWithoutResumeNestedInput = {
    create?: XOR<InterviewSessionCreateWithoutResumeInput, InterviewSessionUncheckedCreateWithoutResumeInput> | InterviewSessionCreateWithoutResumeInput[] | InterviewSessionUncheckedCreateWithoutResumeInput[]
    connectOrCreate?: InterviewSessionCreateOrConnectWithoutResumeInput | InterviewSessionCreateOrConnectWithoutResumeInput[]
    upsert?: InterviewSessionUpsertWithWhereUniqueWithoutResumeInput | InterviewSessionUpsertWithWhereUniqueWithoutResumeInput[]
    createMany?: InterviewSessionCreateManyResumeInputEnvelope
    set?: InterviewSessionWhereUniqueInput | InterviewSessionWhereUniqueInput[]
    disconnect?: InterviewSessionWhereUniqueInput | InterviewSessionWhereUniqueInput[]
    delete?: InterviewSessionWhereUniqueInput | InterviewSessionWhereUniqueInput[]
    connect?: InterviewSessionWhereUniqueInput | InterviewSessionWhereUniqueInput[]
    update?: InterviewSessionUpdateWithWhereUniqueWithoutResumeInput | InterviewSessionUpdateWithWhereUniqueWithoutResumeInput[]
    updateMany?: InterviewSessionUpdateManyWithWhereWithoutResumeInput | InterviewSessionUpdateManyWithWhereWithoutResumeInput[]
    deleteMany?: InterviewSessionScalarWhereInput | InterviewSessionScalarWhereInput[]
  }

  export type InterviewSessionUncheckedUpdateManyWithoutResumeNestedInput = {
    create?: XOR<InterviewSessionCreateWithoutResumeInput, InterviewSessionUncheckedCreateWithoutResumeInput> | InterviewSessionCreateWithoutResumeInput[] | InterviewSessionUncheckedCreateWithoutResumeInput[]
    connectOrCreate?: InterviewSessionCreateOrConnectWithoutResumeInput | InterviewSessionCreateOrConnectWithoutResumeInput[]
    upsert?: InterviewSessionUpsertWithWhereUniqueWithoutResumeInput | InterviewSessionUpsertWithWhereUniqueWithoutResumeInput[]
    createMany?: InterviewSessionCreateManyResumeInputEnvelope
    set?: InterviewSessionWhereUniqueInput | InterviewSessionWhereUniqueInput[]
    disconnect?: InterviewSessionWhereUniqueInput | InterviewSessionWhereUniqueInput[]
    delete?: InterviewSessionWhereUniqueInput | InterviewSessionWhereUniqueInput[]
    connect?: InterviewSessionWhereUniqueInput | InterviewSessionWhereUniqueInput[]
    update?: InterviewSessionUpdateWithWhereUniqueWithoutResumeInput | InterviewSessionUpdateWithWhereUniqueWithoutResumeInput[]
    updateMany?: InterviewSessionUpdateManyWithWhereWithoutResumeInput | InterviewSessionUpdateManyWithWhereWithoutResumeInput[]
    deleteMany?: InterviewSessionScalarWhereInput | InterviewSessionScalarWhereInput[]
  }

  export type InterviewSessionCreatefocusAreasInput = {
    set: string[]
  }

  export type UserCreateNestedOneWithoutSessionsInput = {
    create?: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSessionsInput
    connect?: UserWhereUniqueInput
  }

  export type ResumeCreateNestedOneWithoutSessionsInput = {
    create?: XOR<ResumeCreateWithoutSessionsInput, ResumeUncheckedCreateWithoutSessionsInput>
    connectOrCreate?: ResumeCreateOrConnectWithoutSessionsInput
    connect?: ResumeWhereUniqueInput
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

  export type ChatHistoryCreateNestedManyWithoutInterviewSessionInput = {
    create?: XOR<ChatHistoryCreateWithoutInterviewSessionInput, ChatHistoryUncheckedCreateWithoutInterviewSessionInput> | ChatHistoryCreateWithoutInterviewSessionInput[] | ChatHistoryUncheckedCreateWithoutInterviewSessionInput[]
    connectOrCreate?: ChatHistoryCreateOrConnectWithoutInterviewSessionInput | ChatHistoryCreateOrConnectWithoutInterviewSessionInput[]
    createMany?: ChatHistoryCreateManyInterviewSessionInputEnvelope
    connect?: ChatHistoryWhereUniqueInput | ChatHistoryWhereUniqueInput[]
  }

  export type TelemetryLogCreateNestedManyWithoutInterviewSessionInput = {
    create?: XOR<TelemetryLogCreateWithoutInterviewSessionInput, TelemetryLogUncheckedCreateWithoutInterviewSessionInput> | TelemetryLogCreateWithoutInterviewSessionInput[] | TelemetryLogUncheckedCreateWithoutInterviewSessionInput[]
    connectOrCreate?: TelemetryLogCreateOrConnectWithoutInterviewSessionInput | TelemetryLogCreateOrConnectWithoutInterviewSessionInput[]
    createMany?: TelemetryLogCreateManyInterviewSessionInputEnvelope
    connect?: TelemetryLogWhereUniqueInput | TelemetryLogWhereUniqueInput[]
  }

  export type CodeExecutionDeltaCreateNestedManyWithoutInterviewSessionInput = {
    create?: XOR<CodeExecutionDeltaCreateWithoutInterviewSessionInput, CodeExecutionDeltaUncheckedCreateWithoutInterviewSessionInput> | CodeExecutionDeltaCreateWithoutInterviewSessionInput[] | CodeExecutionDeltaUncheckedCreateWithoutInterviewSessionInput[]
    connectOrCreate?: CodeExecutionDeltaCreateOrConnectWithoutInterviewSessionInput | CodeExecutionDeltaCreateOrConnectWithoutInterviewSessionInput[]
    createMany?: CodeExecutionDeltaCreateManyInterviewSessionInputEnvelope
    connect?: CodeExecutionDeltaWhereUniqueInput | CodeExecutionDeltaWhereUniqueInput[]
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

  export type ChatHistoryUncheckedCreateNestedManyWithoutInterviewSessionInput = {
    create?: XOR<ChatHistoryCreateWithoutInterviewSessionInput, ChatHistoryUncheckedCreateWithoutInterviewSessionInput> | ChatHistoryCreateWithoutInterviewSessionInput[] | ChatHistoryUncheckedCreateWithoutInterviewSessionInput[]
    connectOrCreate?: ChatHistoryCreateOrConnectWithoutInterviewSessionInput | ChatHistoryCreateOrConnectWithoutInterviewSessionInput[]
    createMany?: ChatHistoryCreateManyInterviewSessionInputEnvelope
    connect?: ChatHistoryWhereUniqueInput | ChatHistoryWhereUniqueInput[]
  }

  export type TelemetryLogUncheckedCreateNestedManyWithoutInterviewSessionInput = {
    create?: XOR<TelemetryLogCreateWithoutInterviewSessionInput, TelemetryLogUncheckedCreateWithoutInterviewSessionInput> | TelemetryLogCreateWithoutInterviewSessionInput[] | TelemetryLogUncheckedCreateWithoutInterviewSessionInput[]
    connectOrCreate?: TelemetryLogCreateOrConnectWithoutInterviewSessionInput | TelemetryLogCreateOrConnectWithoutInterviewSessionInput[]
    createMany?: TelemetryLogCreateManyInterviewSessionInputEnvelope
    connect?: TelemetryLogWhereUniqueInput | TelemetryLogWhereUniqueInput[]
  }

  export type CodeExecutionDeltaUncheckedCreateNestedManyWithoutInterviewSessionInput = {
    create?: XOR<CodeExecutionDeltaCreateWithoutInterviewSessionInput, CodeExecutionDeltaUncheckedCreateWithoutInterviewSessionInput> | CodeExecutionDeltaCreateWithoutInterviewSessionInput[] | CodeExecutionDeltaUncheckedCreateWithoutInterviewSessionInput[]
    connectOrCreate?: CodeExecutionDeltaCreateOrConnectWithoutInterviewSessionInput | CodeExecutionDeltaCreateOrConnectWithoutInterviewSessionInput[]
    createMany?: CodeExecutionDeltaCreateManyInterviewSessionInputEnvelope
    connect?: CodeExecutionDeltaWhereUniqueInput | CodeExecutionDeltaWhereUniqueInput[]
  }

  export type EnumInterviewTypeFieldUpdateOperationsInput = {
    set?: $Enums.InterviewType
  }

  export type EnumExperienceLevelFieldUpdateOperationsInput = {
    set?: $Enums.ExperienceLevel
  }

  export type InterviewSessionUpdatefocusAreasInput = {
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

  export type EnumSessionStatusFieldUpdateOperationsInput = {
    set?: $Enums.SessionStatus
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type EnumInterviewModeFieldUpdateOperationsInput = {
    set?: $Enums.InterviewMode
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type UserUpdateOneRequiredWithoutSessionsNestedInput = {
    create?: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSessionsInput
    upsert?: UserUpsertWithoutSessionsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutSessionsInput, UserUpdateWithoutSessionsInput>, UserUncheckedUpdateWithoutSessionsInput>
  }

  export type ResumeUpdateOneWithoutSessionsNestedInput = {
    create?: XOR<ResumeCreateWithoutSessionsInput, ResumeUncheckedCreateWithoutSessionsInput>
    connectOrCreate?: ResumeCreateOrConnectWithoutSessionsInput
    upsert?: ResumeUpsertWithoutSessionsInput
    disconnect?: ResumeWhereInput | boolean
    delete?: ResumeWhereInput | boolean
    connect?: ResumeWhereUniqueInput
    update?: XOR<XOR<ResumeUpdateToOneWithWhereWithoutSessionsInput, ResumeUpdateWithoutSessionsInput>, ResumeUncheckedUpdateWithoutSessionsInput>
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

  export type ChatHistoryUpdateManyWithoutInterviewSessionNestedInput = {
    create?: XOR<ChatHistoryCreateWithoutInterviewSessionInput, ChatHistoryUncheckedCreateWithoutInterviewSessionInput> | ChatHistoryCreateWithoutInterviewSessionInput[] | ChatHistoryUncheckedCreateWithoutInterviewSessionInput[]
    connectOrCreate?: ChatHistoryCreateOrConnectWithoutInterviewSessionInput | ChatHistoryCreateOrConnectWithoutInterviewSessionInput[]
    upsert?: ChatHistoryUpsertWithWhereUniqueWithoutInterviewSessionInput | ChatHistoryUpsertWithWhereUniqueWithoutInterviewSessionInput[]
    createMany?: ChatHistoryCreateManyInterviewSessionInputEnvelope
    set?: ChatHistoryWhereUniqueInput | ChatHistoryWhereUniqueInput[]
    disconnect?: ChatHistoryWhereUniqueInput | ChatHistoryWhereUniqueInput[]
    delete?: ChatHistoryWhereUniqueInput | ChatHistoryWhereUniqueInput[]
    connect?: ChatHistoryWhereUniqueInput | ChatHistoryWhereUniqueInput[]
    update?: ChatHistoryUpdateWithWhereUniqueWithoutInterviewSessionInput | ChatHistoryUpdateWithWhereUniqueWithoutInterviewSessionInput[]
    updateMany?: ChatHistoryUpdateManyWithWhereWithoutInterviewSessionInput | ChatHistoryUpdateManyWithWhereWithoutInterviewSessionInput[]
    deleteMany?: ChatHistoryScalarWhereInput | ChatHistoryScalarWhereInput[]
  }

  export type TelemetryLogUpdateManyWithoutInterviewSessionNestedInput = {
    create?: XOR<TelemetryLogCreateWithoutInterviewSessionInput, TelemetryLogUncheckedCreateWithoutInterviewSessionInput> | TelemetryLogCreateWithoutInterviewSessionInput[] | TelemetryLogUncheckedCreateWithoutInterviewSessionInput[]
    connectOrCreate?: TelemetryLogCreateOrConnectWithoutInterviewSessionInput | TelemetryLogCreateOrConnectWithoutInterviewSessionInput[]
    upsert?: TelemetryLogUpsertWithWhereUniqueWithoutInterviewSessionInput | TelemetryLogUpsertWithWhereUniqueWithoutInterviewSessionInput[]
    createMany?: TelemetryLogCreateManyInterviewSessionInputEnvelope
    set?: TelemetryLogWhereUniqueInput | TelemetryLogWhereUniqueInput[]
    disconnect?: TelemetryLogWhereUniqueInput | TelemetryLogWhereUniqueInput[]
    delete?: TelemetryLogWhereUniqueInput | TelemetryLogWhereUniqueInput[]
    connect?: TelemetryLogWhereUniqueInput | TelemetryLogWhereUniqueInput[]
    update?: TelemetryLogUpdateWithWhereUniqueWithoutInterviewSessionInput | TelemetryLogUpdateWithWhereUniqueWithoutInterviewSessionInput[]
    updateMany?: TelemetryLogUpdateManyWithWhereWithoutInterviewSessionInput | TelemetryLogUpdateManyWithWhereWithoutInterviewSessionInput[]
    deleteMany?: TelemetryLogScalarWhereInput | TelemetryLogScalarWhereInput[]
  }

  export type CodeExecutionDeltaUpdateManyWithoutInterviewSessionNestedInput = {
    create?: XOR<CodeExecutionDeltaCreateWithoutInterviewSessionInput, CodeExecutionDeltaUncheckedCreateWithoutInterviewSessionInput> | CodeExecutionDeltaCreateWithoutInterviewSessionInput[] | CodeExecutionDeltaUncheckedCreateWithoutInterviewSessionInput[]
    connectOrCreate?: CodeExecutionDeltaCreateOrConnectWithoutInterviewSessionInput | CodeExecutionDeltaCreateOrConnectWithoutInterviewSessionInput[]
    upsert?: CodeExecutionDeltaUpsertWithWhereUniqueWithoutInterviewSessionInput | CodeExecutionDeltaUpsertWithWhereUniqueWithoutInterviewSessionInput[]
    createMany?: CodeExecutionDeltaCreateManyInterviewSessionInputEnvelope
    set?: CodeExecutionDeltaWhereUniqueInput | CodeExecutionDeltaWhereUniqueInput[]
    disconnect?: CodeExecutionDeltaWhereUniqueInput | CodeExecutionDeltaWhereUniqueInput[]
    delete?: CodeExecutionDeltaWhereUniqueInput | CodeExecutionDeltaWhereUniqueInput[]
    connect?: CodeExecutionDeltaWhereUniqueInput | CodeExecutionDeltaWhereUniqueInput[]
    update?: CodeExecutionDeltaUpdateWithWhereUniqueWithoutInterviewSessionInput | CodeExecutionDeltaUpdateWithWhereUniqueWithoutInterviewSessionInput[]
    updateMany?: CodeExecutionDeltaUpdateManyWithWhereWithoutInterviewSessionInput | CodeExecutionDeltaUpdateManyWithWhereWithoutInterviewSessionInput[]
    deleteMany?: CodeExecutionDeltaScalarWhereInput | CodeExecutionDeltaScalarWhereInput[]
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

  export type ChatHistoryUncheckedUpdateManyWithoutInterviewSessionNestedInput = {
    create?: XOR<ChatHistoryCreateWithoutInterviewSessionInput, ChatHistoryUncheckedCreateWithoutInterviewSessionInput> | ChatHistoryCreateWithoutInterviewSessionInput[] | ChatHistoryUncheckedCreateWithoutInterviewSessionInput[]
    connectOrCreate?: ChatHistoryCreateOrConnectWithoutInterviewSessionInput | ChatHistoryCreateOrConnectWithoutInterviewSessionInput[]
    upsert?: ChatHistoryUpsertWithWhereUniqueWithoutInterviewSessionInput | ChatHistoryUpsertWithWhereUniqueWithoutInterviewSessionInput[]
    createMany?: ChatHistoryCreateManyInterviewSessionInputEnvelope
    set?: ChatHistoryWhereUniqueInput | ChatHistoryWhereUniqueInput[]
    disconnect?: ChatHistoryWhereUniqueInput | ChatHistoryWhereUniqueInput[]
    delete?: ChatHistoryWhereUniqueInput | ChatHistoryWhereUniqueInput[]
    connect?: ChatHistoryWhereUniqueInput | ChatHistoryWhereUniqueInput[]
    update?: ChatHistoryUpdateWithWhereUniqueWithoutInterviewSessionInput | ChatHistoryUpdateWithWhereUniqueWithoutInterviewSessionInput[]
    updateMany?: ChatHistoryUpdateManyWithWhereWithoutInterviewSessionInput | ChatHistoryUpdateManyWithWhereWithoutInterviewSessionInput[]
    deleteMany?: ChatHistoryScalarWhereInput | ChatHistoryScalarWhereInput[]
  }

  export type TelemetryLogUncheckedUpdateManyWithoutInterviewSessionNestedInput = {
    create?: XOR<TelemetryLogCreateWithoutInterviewSessionInput, TelemetryLogUncheckedCreateWithoutInterviewSessionInput> | TelemetryLogCreateWithoutInterviewSessionInput[] | TelemetryLogUncheckedCreateWithoutInterviewSessionInput[]
    connectOrCreate?: TelemetryLogCreateOrConnectWithoutInterviewSessionInput | TelemetryLogCreateOrConnectWithoutInterviewSessionInput[]
    upsert?: TelemetryLogUpsertWithWhereUniqueWithoutInterviewSessionInput | TelemetryLogUpsertWithWhereUniqueWithoutInterviewSessionInput[]
    createMany?: TelemetryLogCreateManyInterviewSessionInputEnvelope
    set?: TelemetryLogWhereUniqueInput | TelemetryLogWhereUniqueInput[]
    disconnect?: TelemetryLogWhereUniqueInput | TelemetryLogWhereUniqueInput[]
    delete?: TelemetryLogWhereUniqueInput | TelemetryLogWhereUniqueInput[]
    connect?: TelemetryLogWhereUniqueInput | TelemetryLogWhereUniqueInput[]
    update?: TelemetryLogUpdateWithWhereUniqueWithoutInterviewSessionInput | TelemetryLogUpdateWithWhereUniqueWithoutInterviewSessionInput[]
    updateMany?: TelemetryLogUpdateManyWithWhereWithoutInterviewSessionInput | TelemetryLogUpdateManyWithWhereWithoutInterviewSessionInput[]
    deleteMany?: TelemetryLogScalarWhereInput | TelemetryLogScalarWhereInput[]
  }

  export type CodeExecutionDeltaUncheckedUpdateManyWithoutInterviewSessionNestedInput = {
    create?: XOR<CodeExecutionDeltaCreateWithoutInterviewSessionInput, CodeExecutionDeltaUncheckedCreateWithoutInterviewSessionInput> | CodeExecutionDeltaCreateWithoutInterviewSessionInput[] | CodeExecutionDeltaUncheckedCreateWithoutInterviewSessionInput[]
    connectOrCreate?: CodeExecutionDeltaCreateOrConnectWithoutInterviewSessionInput | CodeExecutionDeltaCreateOrConnectWithoutInterviewSessionInput[]
    upsert?: CodeExecutionDeltaUpsertWithWhereUniqueWithoutInterviewSessionInput | CodeExecutionDeltaUpsertWithWhereUniqueWithoutInterviewSessionInput[]
    createMany?: CodeExecutionDeltaCreateManyInterviewSessionInputEnvelope
    set?: CodeExecutionDeltaWhereUniqueInput | CodeExecutionDeltaWhereUniqueInput[]
    disconnect?: CodeExecutionDeltaWhereUniqueInput | CodeExecutionDeltaWhereUniqueInput[]
    delete?: CodeExecutionDeltaWhereUniqueInput | CodeExecutionDeltaWhereUniqueInput[]
    connect?: CodeExecutionDeltaWhereUniqueInput | CodeExecutionDeltaWhereUniqueInput[]
    update?: CodeExecutionDeltaUpdateWithWhereUniqueWithoutInterviewSessionInput | CodeExecutionDeltaUpdateWithWhereUniqueWithoutInterviewSessionInput[]
    updateMany?: CodeExecutionDeltaUpdateManyWithWhereWithoutInterviewSessionInput | CodeExecutionDeltaUpdateManyWithWhereWithoutInterviewSessionInput[]
    deleteMany?: CodeExecutionDeltaScalarWhereInput | CodeExecutionDeltaScalarWhereInput[]
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

  export type EnumQuestionTypeFieldUpdateOperationsInput = {
    set?: $Enums.QuestionType
  }

  export type EnumDifficultyFieldUpdateOperationsInput = {
    set?: $Enums.Difficulty
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

  export type InterviewSessionUpdateOneRequiredWithoutAnalysisNestedInput = {
    create?: XOR<InterviewSessionCreateWithoutAnalysisInput, InterviewSessionUncheckedCreateWithoutAnalysisInput>
    connectOrCreate?: InterviewSessionCreateOrConnectWithoutAnalysisInput
    upsert?: InterviewSessionUpsertWithoutAnalysisInput
    connect?: InterviewSessionWhereUniqueInput
    update?: XOR<XOR<InterviewSessionUpdateToOneWithWhereWithoutAnalysisInput, InterviewSessionUpdateWithoutAnalysisInput>, InterviewSessionUncheckedUpdateWithoutAnalysisInput>
  }

  export type InterviewSessionCreateNestedOneWithoutChatHistoryInput = {
    create?: XOR<InterviewSessionCreateWithoutChatHistoryInput, InterviewSessionUncheckedCreateWithoutChatHistoryInput>
    connectOrCreate?: InterviewSessionCreateOrConnectWithoutChatHistoryInput
    connect?: InterviewSessionWhereUniqueInput
  }

  export type InterviewSessionUpdateOneRequiredWithoutChatHistoryNestedInput = {
    create?: XOR<InterviewSessionCreateWithoutChatHistoryInput, InterviewSessionUncheckedCreateWithoutChatHistoryInput>
    connectOrCreate?: InterviewSessionCreateOrConnectWithoutChatHistoryInput
    upsert?: InterviewSessionUpsertWithoutChatHistoryInput
    connect?: InterviewSessionWhereUniqueInput
    update?: XOR<XOR<InterviewSessionUpdateToOneWithWhereWithoutChatHistoryInput, InterviewSessionUpdateWithoutChatHistoryInput>, InterviewSessionUncheckedUpdateWithoutChatHistoryInput>
  }

  export type InterviewSessionCreateNestedOneWithoutTelemetryLogsInput = {
    create?: XOR<InterviewSessionCreateWithoutTelemetryLogsInput, InterviewSessionUncheckedCreateWithoutTelemetryLogsInput>
    connectOrCreate?: InterviewSessionCreateOrConnectWithoutTelemetryLogsInput
    connect?: InterviewSessionWhereUniqueInput
  }

  export type NullableFloatFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type InterviewSessionUpdateOneRequiredWithoutTelemetryLogsNestedInput = {
    create?: XOR<InterviewSessionCreateWithoutTelemetryLogsInput, InterviewSessionUncheckedCreateWithoutTelemetryLogsInput>
    connectOrCreate?: InterviewSessionCreateOrConnectWithoutTelemetryLogsInput
    upsert?: InterviewSessionUpsertWithoutTelemetryLogsInput
    connect?: InterviewSessionWhereUniqueInput
    update?: XOR<XOR<InterviewSessionUpdateToOneWithWhereWithoutTelemetryLogsInput, InterviewSessionUpdateWithoutTelemetryLogsInput>, InterviewSessionUncheckedUpdateWithoutTelemetryLogsInput>
  }

  export type InterviewSessionCreateNestedOneWithoutCodeExecutionDeltasInput = {
    create?: XOR<InterviewSessionCreateWithoutCodeExecutionDeltasInput, InterviewSessionUncheckedCreateWithoutCodeExecutionDeltasInput>
    connectOrCreate?: InterviewSessionCreateOrConnectWithoutCodeExecutionDeltasInput
    connect?: InterviewSessionWhereUniqueInput
  }

  export type NullableBoolFieldUpdateOperationsInput = {
    set?: boolean | null
  }

  export type InterviewSessionUpdateOneRequiredWithoutCodeExecutionDeltasNestedInput = {
    create?: XOR<InterviewSessionCreateWithoutCodeExecutionDeltasInput, InterviewSessionUncheckedCreateWithoutCodeExecutionDeltasInput>
    connectOrCreate?: InterviewSessionCreateOrConnectWithoutCodeExecutionDeltasInput
    upsert?: InterviewSessionUpsertWithoutCodeExecutionDeltasInput
    connect?: InterviewSessionWhereUniqueInput
    update?: XOR<XOR<InterviewSessionUpdateToOneWithWhereWithoutCodeExecutionDeltasInput, InterviewSessionUpdateWithoutCodeExecutionDeltasInput>, InterviewSessionUncheckedUpdateWithoutCodeExecutionDeltasInput>
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

  export type NestedEnumInterviewTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.InterviewType | EnumInterviewTypeFieldRefInput<$PrismaModel>
    in?: $Enums.InterviewType[] | ListEnumInterviewTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.InterviewType[] | ListEnumInterviewTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumInterviewTypeFilter<$PrismaModel> | $Enums.InterviewType
  }

  export type NestedEnumExperienceLevelFilter<$PrismaModel = never> = {
    equals?: $Enums.ExperienceLevel | EnumExperienceLevelFieldRefInput<$PrismaModel>
    in?: $Enums.ExperienceLevel[] | ListEnumExperienceLevelFieldRefInput<$PrismaModel>
    notIn?: $Enums.ExperienceLevel[] | ListEnumExperienceLevelFieldRefInput<$PrismaModel>
    not?: NestedEnumExperienceLevelFilter<$PrismaModel> | $Enums.ExperienceLevel
  }

  export type NestedEnumSessionStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.SessionStatus | EnumSessionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.SessionStatus[] | ListEnumSessionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.SessionStatus[] | ListEnumSessionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumSessionStatusFilter<$PrismaModel> | $Enums.SessionStatus
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

  export type NestedEnumInterviewModeFilter<$PrismaModel = never> = {
    equals?: $Enums.InterviewMode | EnumInterviewModeFieldRefInput<$PrismaModel>
    in?: $Enums.InterviewMode[] | ListEnumInterviewModeFieldRefInput<$PrismaModel>
    notIn?: $Enums.InterviewMode[] | ListEnumInterviewModeFieldRefInput<$PrismaModel>
    not?: NestedEnumInterviewModeFilter<$PrismaModel> | $Enums.InterviewMode
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedEnumInterviewTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.InterviewType | EnumInterviewTypeFieldRefInput<$PrismaModel>
    in?: $Enums.InterviewType[] | ListEnumInterviewTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.InterviewType[] | ListEnumInterviewTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumInterviewTypeWithAggregatesFilter<$PrismaModel> | $Enums.InterviewType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumInterviewTypeFilter<$PrismaModel>
    _max?: NestedEnumInterviewTypeFilter<$PrismaModel>
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

  export type NestedEnumSessionStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.SessionStatus | EnumSessionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.SessionStatus[] | ListEnumSessionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.SessionStatus[] | ListEnumSessionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumSessionStatusWithAggregatesFilter<$PrismaModel> | $Enums.SessionStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumSessionStatusFilter<$PrismaModel>
    _max?: NestedEnumSessionStatusFilter<$PrismaModel>
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

  export type NestedEnumInterviewModeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.InterviewMode | EnumInterviewModeFieldRefInput<$PrismaModel>
    in?: $Enums.InterviewMode[] | ListEnumInterviewModeFieldRefInput<$PrismaModel>
    notIn?: $Enums.InterviewMode[] | ListEnumInterviewModeFieldRefInput<$PrismaModel>
    not?: NestedEnumInterviewModeWithAggregatesFilter<$PrismaModel> | $Enums.InterviewMode
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumInterviewModeFilter<$PrismaModel>
    _max?: NestedEnumInterviewModeFilter<$PrismaModel>
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

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedEnumQuestionTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.QuestionType | EnumQuestionTypeFieldRefInput<$PrismaModel>
    in?: $Enums.QuestionType[] | ListEnumQuestionTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.QuestionType[] | ListEnumQuestionTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumQuestionTypeFilter<$PrismaModel> | $Enums.QuestionType
  }

  export type NestedEnumDifficultyFilter<$PrismaModel = never> = {
    equals?: $Enums.Difficulty | EnumDifficultyFieldRefInput<$PrismaModel>
    in?: $Enums.Difficulty[] | ListEnumDifficultyFieldRefInput<$PrismaModel>
    notIn?: $Enums.Difficulty[] | ListEnumDifficultyFieldRefInput<$PrismaModel>
    not?: NestedEnumDifficultyFilter<$PrismaModel> | $Enums.Difficulty
  }

  export type NestedEnumQuestionTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.QuestionType | EnumQuestionTypeFieldRefInput<$PrismaModel>
    in?: $Enums.QuestionType[] | ListEnumQuestionTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.QuestionType[] | ListEnumQuestionTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumQuestionTypeWithAggregatesFilter<$PrismaModel> | $Enums.QuestionType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumQuestionTypeFilter<$PrismaModel>
    _max?: NestedEnumQuestionTypeFilter<$PrismaModel>
  }

  export type NestedEnumDifficultyWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Difficulty | EnumDifficultyFieldRefInput<$PrismaModel>
    in?: $Enums.Difficulty[] | ListEnumDifficultyFieldRefInput<$PrismaModel>
    notIn?: $Enums.Difficulty[] | ListEnumDifficultyFieldRefInput<$PrismaModel>
    not?: NestedEnumDifficultyWithAggregatesFilter<$PrismaModel> | $Enums.Difficulty
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumDifficultyFilter<$PrismaModel>
    _max?: NestedEnumDifficultyFilter<$PrismaModel>
  }

  export type NestedEnumReadinessVerdictFilter<$PrismaModel = never> = {
    equals?: $Enums.ReadinessVerdict | EnumReadinessVerdictFieldRefInput<$PrismaModel>
    in?: $Enums.ReadinessVerdict[] | ListEnumReadinessVerdictFieldRefInput<$PrismaModel>
    notIn?: $Enums.ReadinessVerdict[] | ListEnumReadinessVerdictFieldRefInput<$PrismaModel>
    not?: NestedEnumReadinessVerdictFilter<$PrismaModel> | $Enums.ReadinessVerdict
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

  export type NestedBoolNullableFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableFilter<$PrismaModel> | boolean | null
  }

  export type NestedBoolNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableWithAggregatesFilter<$PrismaModel> | boolean | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedBoolNullableFilter<$PrismaModel>
    _max?: NestedBoolNullableFilter<$PrismaModel>
  }

  export type InterviewSessionCreateWithoutUserInput = {
    id?: string
    interviewType: $Enums.InterviewType
    targetRole: string
    targetCompany?: string | null
    industry: string
    experienceLevel: $Enums.ExperienceLevel
    focusAreas?: InterviewSessionCreatefocusAreasInput | string[]
    interviewGoal?: string | null
    durationMins?: number
    status?: $Enums.SessionStatus
    startedAt?: Date | string | null
    completedAt?: Date | string | null
    createdAt?: Date | string
    mode?: $Enums.InterviewMode
    hintCount?: number
    testCasesPassed?: number | null
    selectedLanguage?: string | null
    isDeleted?: boolean
    resume?: ResumeCreateNestedOneWithoutSessionsInput
    questions?: QuestionCreateNestedManyWithoutSessionInput
    analysis?: AnalysisCreateNestedOneWithoutSessionInput
    chatHistory?: ChatHistoryCreateNestedManyWithoutInterviewSessionInput
    telemetryLogs?: TelemetryLogCreateNestedManyWithoutInterviewSessionInput
    codeExecutionDeltas?: CodeExecutionDeltaCreateNestedManyWithoutInterviewSessionInput
  }

  export type InterviewSessionUncheckedCreateWithoutUserInput = {
    id?: string
    resumeId?: string | null
    interviewType: $Enums.InterviewType
    targetRole: string
    targetCompany?: string | null
    industry: string
    experienceLevel: $Enums.ExperienceLevel
    focusAreas?: InterviewSessionCreatefocusAreasInput | string[]
    interviewGoal?: string | null
    durationMins?: number
    status?: $Enums.SessionStatus
    startedAt?: Date | string | null
    completedAt?: Date | string | null
    createdAt?: Date | string
    mode?: $Enums.InterviewMode
    hintCount?: number
    testCasesPassed?: number | null
    selectedLanguage?: string | null
    isDeleted?: boolean
    questions?: QuestionUncheckedCreateNestedManyWithoutSessionInput
    analysis?: AnalysisUncheckedCreateNestedOneWithoutSessionInput
    chatHistory?: ChatHistoryUncheckedCreateNestedManyWithoutInterviewSessionInput
    telemetryLogs?: TelemetryLogUncheckedCreateNestedManyWithoutInterviewSessionInput
    codeExecutionDeltas?: CodeExecutionDeltaUncheckedCreateNestedManyWithoutInterviewSessionInput
  }

  export type InterviewSessionCreateOrConnectWithoutUserInput = {
    where: InterviewSessionWhereUniqueInput
    create: XOR<InterviewSessionCreateWithoutUserInput, InterviewSessionUncheckedCreateWithoutUserInput>
  }

  export type InterviewSessionCreateManyUserInputEnvelope = {
    data: InterviewSessionCreateManyUserInput | InterviewSessionCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type ResumeCreateWithoutUserInput = {
    id?: string
    fileName: string
    filePath: string
    parsedText?: string | null
    skills?: ResumeCreateskillsInput | string[]
    experience?: NullableJsonNullValueInput | InputJsonValue
    uploadedAt?: Date | string
    sessions?: InterviewSessionCreateNestedManyWithoutResumeInput
  }

  export type ResumeUncheckedCreateWithoutUserInput = {
    id?: string
    fileName: string
    filePath: string
    parsedText?: string | null
    skills?: ResumeCreateskillsInput | string[]
    experience?: NullableJsonNullValueInput | InputJsonValue
    uploadedAt?: Date | string
    sessions?: InterviewSessionUncheckedCreateNestedManyWithoutResumeInput
  }

  export type ResumeCreateOrConnectWithoutUserInput = {
    where: ResumeWhereUniqueInput
    create: XOR<ResumeCreateWithoutUserInput, ResumeUncheckedCreateWithoutUserInput>
  }

  export type ResumeCreateManyUserInputEnvelope = {
    data: ResumeCreateManyUserInput | ResumeCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type RefreshTokenCreateWithoutUserInput = {
    id?: string
    tokenId: string
    expiresAt: Date | string
    createdAt?: Date | string
  }

  export type RefreshTokenUncheckedCreateWithoutUserInput = {
    id?: string
    tokenId: string
    expiresAt: Date | string
    createdAt?: Date | string
  }

  export type RefreshTokenCreateOrConnectWithoutUserInput = {
    where: RefreshTokenWhereUniqueInput
    create: XOR<RefreshTokenCreateWithoutUserInput, RefreshTokenUncheckedCreateWithoutUserInput>
  }

  export type RefreshTokenCreateManyUserInputEnvelope = {
    data: RefreshTokenCreateManyUserInput | RefreshTokenCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type InterviewSessionUpsertWithWhereUniqueWithoutUserInput = {
    where: InterviewSessionWhereUniqueInput
    update: XOR<InterviewSessionUpdateWithoutUserInput, InterviewSessionUncheckedUpdateWithoutUserInput>
    create: XOR<InterviewSessionCreateWithoutUserInput, InterviewSessionUncheckedCreateWithoutUserInput>
  }

  export type InterviewSessionUpdateWithWhereUniqueWithoutUserInput = {
    where: InterviewSessionWhereUniqueInput
    data: XOR<InterviewSessionUpdateWithoutUserInput, InterviewSessionUncheckedUpdateWithoutUserInput>
  }

  export type InterviewSessionUpdateManyWithWhereWithoutUserInput = {
    where: InterviewSessionScalarWhereInput
    data: XOR<InterviewSessionUpdateManyMutationInput, InterviewSessionUncheckedUpdateManyWithoutUserInput>
  }

  export type InterviewSessionScalarWhereInput = {
    AND?: InterviewSessionScalarWhereInput | InterviewSessionScalarWhereInput[]
    OR?: InterviewSessionScalarWhereInput[]
    NOT?: InterviewSessionScalarWhereInput | InterviewSessionScalarWhereInput[]
    id?: StringFilter<"InterviewSession"> | string
    userId?: StringFilter<"InterviewSession"> | string
    resumeId?: StringNullableFilter<"InterviewSession"> | string | null
    interviewType?: EnumInterviewTypeFilter<"InterviewSession"> | $Enums.InterviewType
    targetRole?: StringFilter<"InterviewSession"> | string
    targetCompany?: StringNullableFilter<"InterviewSession"> | string | null
    industry?: StringFilter<"InterviewSession"> | string
    experienceLevel?: EnumExperienceLevelFilter<"InterviewSession"> | $Enums.ExperienceLevel
    focusAreas?: StringNullableListFilter<"InterviewSession">
    interviewGoal?: StringNullableFilter<"InterviewSession"> | string | null
    durationMins?: IntFilter<"InterviewSession"> | number
    status?: EnumSessionStatusFilter<"InterviewSession"> | $Enums.SessionStatus
    startedAt?: DateTimeNullableFilter<"InterviewSession"> | Date | string | null
    completedAt?: DateTimeNullableFilter<"InterviewSession"> | Date | string | null
    createdAt?: DateTimeFilter<"InterviewSession"> | Date | string
    mode?: EnumInterviewModeFilter<"InterviewSession"> | $Enums.InterviewMode
    hintCount?: IntFilter<"InterviewSession"> | number
    testCasesPassed?: IntNullableFilter<"InterviewSession"> | number | null
    selectedLanguage?: StringNullableFilter<"InterviewSession"> | string | null
    isDeleted?: BoolFilter<"InterviewSession"> | boolean
  }

  export type ResumeUpsertWithWhereUniqueWithoutUserInput = {
    where: ResumeWhereUniqueInput
    update: XOR<ResumeUpdateWithoutUserInput, ResumeUncheckedUpdateWithoutUserInput>
    create: XOR<ResumeCreateWithoutUserInput, ResumeUncheckedCreateWithoutUserInput>
  }

  export type ResumeUpdateWithWhereUniqueWithoutUserInput = {
    where: ResumeWhereUniqueInput
    data: XOR<ResumeUpdateWithoutUserInput, ResumeUncheckedUpdateWithoutUserInput>
  }

  export type ResumeUpdateManyWithWhereWithoutUserInput = {
    where: ResumeScalarWhereInput
    data: XOR<ResumeUpdateManyMutationInput, ResumeUncheckedUpdateManyWithoutUserInput>
  }

  export type ResumeScalarWhereInput = {
    AND?: ResumeScalarWhereInput | ResumeScalarWhereInput[]
    OR?: ResumeScalarWhereInput[]
    NOT?: ResumeScalarWhereInput | ResumeScalarWhereInput[]
    id?: StringFilter<"Resume"> | string
    userId?: StringFilter<"Resume"> | string
    fileName?: StringFilter<"Resume"> | string
    filePath?: StringFilter<"Resume"> | string
    parsedText?: StringNullableFilter<"Resume"> | string | null
    skills?: StringNullableListFilter<"Resume">
    experience?: JsonNullableFilter<"Resume">
    uploadedAt?: DateTimeFilter<"Resume"> | Date | string
  }

  export type RefreshTokenUpsertWithWhereUniqueWithoutUserInput = {
    where: RefreshTokenWhereUniqueInput
    update: XOR<RefreshTokenUpdateWithoutUserInput, RefreshTokenUncheckedUpdateWithoutUserInput>
    create: XOR<RefreshTokenCreateWithoutUserInput, RefreshTokenUncheckedCreateWithoutUserInput>
  }

  export type RefreshTokenUpdateWithWhereUniqueWithoutUserInput = {
    where: RefreshTokenWhereUniqueInput
    data: XOR<RefreshTokenUpdateWithoutUserInput, RefreshTokenUncheckedUpdateWithoutUserInput>
  }

  export type RefreshTokenUpdateManyWithWhereWithoutUserInput = {
    where: RefreshTokenScalarWhereInput
    data: XOR<RefreshTokenUpdateManyMutationInput, RefreshTokenUncheckedUpdateManyWithoutUserInput>
  }

  export type RefreshTokenScalarWhereInput = {
    AND?: RefreshTokenScalarWhereInput | RefreshTokenScalarWhereInput[]
    OR?: RefreshTokenScalarWhereInput[]
    NOT?: RefreshTokenScalarWhereInput | RefreshTokenScalarWhereInput[]
    id?: StringFilter<"RefreshToken"> | string
    userId?: StringFilter<"RefreshToken"> | string
    tokenId?: StringFilter<"RefreshToken"> | string
    expiresAt?: DateTimeFilter<"RefreshToken"> | Date | string
    createdAt?: DateTimeFilter<"RefreshToken"> | Date | string
  }

  export type UserCreateWithoutRefreshTokensInput = {
    id?: string
    email: string
    passwordHash: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
    sessions?: InterviewSessionCreateNestedManyWithoutUserInput
    resumes?: ResumeCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutRefreshTokensInput = {
    id?: string
    email: string
    passwordHash: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
    sessions?: InterviewSessionUncheckedCreateNestedManyWithoutUserInput
    resumes?: ResumeUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutRefreshTokensInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutRefreshTokensInput, UserUncheckedCreateWithoutRefreshTokensInput>
  }

  export type UserUpsertWithoutRefreshTokensInput = {
    update: XOR<UserUpdateWithoutRefreshTokensInput, UserUncheckedUpdateWithoutRefreshTokensInput>
    create: XOR<UserCreateWithoutRefreshTokensInput, UserUncheckedCreateWithoutRefreshTokensInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutRefreshTokensInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutRefreshTokensInput, UserUncheckedUpdateWithoutRefreshTokensInput>
  }

  export type UserUpdateWithoutRefreshTokensInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: InterviewSessionUpdateManyWithoutUserNestedInput
    resumes?: ResumeUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutRefreshTokensInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: InterviewSessionUncheckedUpdateManyWithoutUserNestedInput
    resumes?: ResumeUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutResumesInput = {
    id?: string
    email: string
    passwordHash: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
    sessions?: InterviewSessionCreateNestedManyWithoutUserInput
    refreshTokens?: RefreshTokenCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutResumesInput = {
    id?: string
    email: string
    passwordHash: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
    sessions?: InterviewSessionUncheckedCreateNestedManyWithoutUserInput
    refreshTokens?: RefreshTokenUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutResumesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutResumesInput, UserUncheckedCreateWithoutResumesInput>
  }

  export type InterviewSessionCreateWithoutResumeInput = {
    id?: string
    interviewType: $Enums.InterviewType
    targetRole: string
    targetCompany?: string | null
    industry: string
    experienceLevel: $Enums.ExperienceLevel
    focusAreas?: InterviewSessionCreatefocusAreasInput | string[]
    interviewGoal?: string | null
    durationMins?: number
    status?: $Enums.SessionStatus
    startedAt?: Date | string | null
    completedAt?: Date | string | null
    createdAt?: Date | string
    mode?: $Enums.InterviewMode
    hintCount?: number
    testCasesPassed?: number | null
    selectedLanguage?: string | null
    isDeleted?: boolean
    user: UserCreateNestedOneWithoutSessionsInput
    questions?: QuestionCreateNestedManyWithoutSessionInput
    analysis?: AnalysisCreateNestedOneWithoutSessionInput
    chatHistory?: ChatHistoryCreateNestedManyWithoutInterviewSessionInput
    telemetryLogs?: TelemetryLogCreateNestedManyWithoutInterviewSessionInput
    codeExecutionDeltas?: CodeExecutionDeltaCreateNestedManyWithoutInterviewSessionInput
  }

  export type InterviewSessionUncheckedCreateWithoutResumeInput = {
    id?: string
    userId: string
    interviewType: $Enums.InterviewType
    targetRole: string
    targetCompany?: string | null
    industry: string
    experienceLevel: $Enums.ExperienceLevel
    focusAreas?: InterviewSessionCreatefocusAreasInput | string[]
    interviewGoal?: string | null
    durationMins?: number
    status?: $Enums.SessionStatus
    startedAt?: Date | string | null
    completedAt?: Date | string | null
    createdAt?: Date | string
    mode?: $Enums.InterviewMode
    hintCount?: number
    testCasesPassed?: number | null
    selectedLanguage?: string | null
    isDeleted?: boolean
    questions?: QuestionUncheckedCreateNestedManyWithoutSessionInput
    analysis?: AnalysisUncheckedCreateNestedOneWithoutSessionInput
    chatHistory?: ChatHistoryUncheckedCreateNestedManyWithoutInterviewSessionInput
    telemetryLogs?: TelemetryLogUncheckedCreateNestedManyWithoutInterviewSessionInput
    codeExecutionDeltas?: CodeExecutionDeltaUncheckedCreateNestedManyWithoutInterviewSessionInput
  }

  export type InterviewSessionCreateOrConnectWithoutResumeInput = {
    where: InterviewSessionWhereUniqueInput
    create: XOR<InterviewSessionCreateWithoutResumeInput, InterviewSessionUncheckedCreateWithoutResumeInput>
  }

  export type InterviewSessionCreateManyResumeInputEnvelope = {
    data: InterviewSessionCreateManyResumeInput | InterviewSessionCreateManyResumeInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithoutResumesInput = {
    update: XOR<UserUpdateWithoutResumesInput, UserUncheckedUpdateWithoutResumesInput>
    create: XOR<UserCreateWithoutResumesInput, UserUncheckedCreateWithoutResumesInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutResumesInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutResumesInput, UserUncheckedUpdateWithoutResumesInput>
  }

  export type UserUpdateWithoutResumesInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: InterviewSessionUpdateManyWithoutUserNestedInput
    refreshTokens?: RefreshTokenUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutResumesInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: InterviewSessionUncheckedUpdateManyWithoutUserNestedInput
    refreshTokens?: RefreshTokenUncheckedUpdateManyWithoutUserNestedInput
  }

  export type InterviewSessionUpsertWithWhereUniqueWithoutResumeInput = {
    where: InterviewSessionWhereUniqueInput
    update: XOR<InterviewSessionUpdateWithoutResumeInput, InterviewSessionUncheckedUpdateWithoutResumeInput>
    create: XOR<InterviewSessionCreateWithoutResumeInput, InterviewSessionUncheckedCreateWithoutResumeInput>
  }

  export type InterviewSessionUpdateWithWhereUniqueWithoutResumeInput = {
    where: InterviewSessionWhereUniqueInput
    data: XOR<InterviewSessionUpdateWithoutResumeInput, InterviewSessionUncheckedUpdateWithoutResumeInput>
  }

  export type InterviewSessionUpdateManyWithWhereWithoutResumeInput = {
    where: InterviewSessionScalarWhereInput
    data: XOR<InterviewSessionUpdateManyMutationInput, InterviewSessionUncheckedUpdateManyWithoutResumeInput>
  }

  export type UserCreateWithoutSessionsInput = {
    id?: string
    email: string
    passwordHash: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
    resumes?: ResumeCreateNestedManyWithoutUserInput
    refreshTokens?: RefreshTokenCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutSessionsInput = {
    id?: string
    email: string
    passwordHash: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
    resumes?: ResumeUncheckedCreateNestedManyWithoutUserInput
    refreshTokens?: RefreshTokenUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutSessionsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
  }

  export type ResumeCreateWithoutSessionsInput = {
    id?: string
    fileName: string
    filePath: string
    parsedText?: string | null
    skills?: ResumeCreateskillsInput | string[]
    experience?: NullableJsonNullValueInput | InputJsonValue
    uploadedAt?: Date | string
    user: UserCreateNestedOneWithoutResumesInput
  }

  export type ResumeUncheckedCreateWithoutSessionsInput = {
    id?: string
    userId: string
    fileName: string
    filePath: string
    parsedText?: string | null
    skills?: ResumeCreateskillsInput | string[]
    experience?: NullableJsonNullValueInput | InputJsonValue
    uploadedAt?: Date | string
  }

  export type ResumeCreateOrConnectWithoutSessionsInput = {
    where: ResumeWhereUniqueInput
    create: XOR<ResumeCreateWithoutSessionsInput, ResumeUncheckedCreateWithoutSessionsInput>
  }

  export type QuestionCreateWithoutSessionInput = {
    id?: string
    orderIndex: number
    questionText: string
    questionType: $Enums.QuestionType
    difficulty: $Enums.Difficulty
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
    questionType: $Enums.QuestionType
    difficulty: $Enums.Difficulty
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

  export type ChatHistoryCreateWithoutInterviewSessionInput = {
    id?: string
    role: string
    content: string
    score?: number | null
    critique?: string | null
    timestamp?: Date | string
  }

  export type ChatHistoryUncheckedCreateWithoutInterviewSessionInput = {
    id?: string
    role: string
    content: string
    score?: number | null
    critique?: string | null
    timestamp?: Date | string
  }

  export type ChatHistoryCreateOrConnectWithoutInterviewSessionInput = {
    where: ChatHistoryWhereUniqueInput
    create: XOR<ChatHistoryCreateWithoutInterviewSessionInput, ChatHistoryUncheckedCreateWithoutInterviewSessionInput>
  }

  export type ChatHistoryCreateManyInterviewSessionInputEnvelope = {
    data: ChatHistoryCreateManyInterviewSessionInput | ChatHistoryCreateManyInterviewSessionInput[]
    skipDuplicates?: boolean
  }

  export type TelemetryLogCreateWithoutInterviewSessionInput = {
    id?: string
    type: string
    wordsPerMinute?: number | null
    fillerWordsCount?: number | null
    stressCoefficient?: number | null
    timestamp?: Date | string
  }

  export type TelemetryLogUncheckedCreateWithoutInterviewSessionInput = {
    id?: string
    type: string
    wordsPerMinute?: number | null
    fillerWordsCount?: number | null
    stressCoefficient?: number | null
    timestamp?: Date | string
  }

  export type TelemetryLogCreateOrConnectWithoutInterviewSessionInput = {
    where: TelemetryLogWhereUniqueInput
    create: XOR<TelemetryLogCreateWithoutInterviewSessionInput, TelemetryLogUncheckedCreateWithoutInterviewSessionInput>
  }

  export type TelemetryLogCreateManyInterviewSessionInputEnvelope = {
    data: TelemetryLogCreateManyInterviewSessionInput | TelemetryLogCreateManyInterviewSessionInput[]
    skipDuplicates?: boolean
  }

  export type CodeExecutionDeltaCreateWithoutInterviewSessionInput = {
    id?: string
    code: string
    language: string
    output?: string | null
    success?: boolean | null
    timestamp?: Date | string
  }

  export type CodeExecutionDeltaUncheckedCreateWithoutInterviewSessionInput = {
    id?: string
    code: string
    language: string
    output?: string | null
    success?: boolean | null
    timestamp?: Date | string
  }

  export type CodeExecutionDeltaCreateOrConnectWithoutInterviewSessionInput = {
    where: CodeExecutionDeltaWhereUniqueInput
    create: XOR<CodeExecutionDeltaCreateWithoutInterviewSessionInput, CodeExecutionDeltaUncheckedCreateWithoutInterviewSessionInput>
  }

  export type CodeExecutionDeltaCreateManyInterviewSessionInputEnvelope = {
    data: CodeExecutionDeltaCreateManyInterviewSessionInput | CodeExecutionDeltaCreateManyInterviewSessionInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithoutSessionsInput = {
    update: XOR<UserUpdateWithoutSessionsInput, UserUncheckedUpdateWithoutSessionsInput>
    create: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutSessionsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutSessionsInput, UserUncheckedUpdateWithoutSessionsInput>
  }

  export type UserUpdateWithoutSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    resumes?: ResumeUpdateManyWithoutUserNestedInput
    refreshTokens?: RefreshTokenUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    resumes?: ResumeUncheckedUpdateManyWithoutUserNestedInput
    refreshTokens?: RefreshTokenUncheckedUpdateManyWithoutUserNestedInput
  }

  export type ResumeUpsertWithoutSessionsInput = {
    update: XOR<ResumeUpdateWithoutSessionsInput, ResumeUncheckedUpdateWithoutSessionsInput>
    create: XOR<ResumeCreateWithoutSessionsInput, ResumeUncheckedCreateWithoutSessionsInput>
    where?: ResumeWhereInput
  }

  export type ResumeUpdateToOneWithWhereWithoutSessionsInput = {
    where?: ResumeWhereInput
    data: XOR<ResumeUpdateWithoutSessionsInput, ResumeUncheckedUpdateWithoutSessionsInput>
  }

  export type ResumeUpdateWithoutSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    filePath?: StringFieldUpdateOperationsInput | string
    parsedText?: NullableStringFieldUpdateOperationsInput | string | null
    skills?: ResumeUpdateskillsInput | string[]
    experience?: NullableJsonNullValueInput | InputJsonValue
    uploadedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutResumesNestedInput
  }

  export type ResumeUncheckedUpdateWithoutSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    filePath?: StringFieldUpdateOperationsInput | string
    parsedText?: NullableStringFieldUpdateOperationsInput | string | null
    skills?: ResumeUpdateskillsInput | string[]
    experience?: NullableJsonNullValueInput | InputJsonValue
    uploadedAt?: DateTimeFieldUpdateOperationsInput | Date | string
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
    questionType?: EnumQuestionTypeFilter<"Question"> | $Enums.QuestionType
    difficulty?: EnumDifficultyFilter<"Question"> | $Enums.Difficulty
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

  export type ChatHistoryUpsertWithWhereUniqueWithoutInterviewSessionInput = {
    where: ChatHistoryWhereUniqueInput
    update: XOR<ChatHistoryUpdateWithoutInterviewSessionInput, ChatHistoryUncheckedUpdateWithoutInterviewSessionInput>
    create: XOR<ChatHistoryCreateWithoutInterviewSessionInput, ChatHistoryUncheckedCreateWithoutInterviewSessionInput>
  }

  export type ChatHistoryUpdateWithWhereUniqueWithoutInterviewSessionInput = {
    where: ChatHistoryWhereUniqueInput
    data: XOR<ChatHistoryUpdateWithoutInterviewSessionInput, ChatHistoryUncheckedUpdateWithoutInterviewSessionInput>
  }

  export type ChatHistoryUpdateManyWithWhereWithoutInterviewSessionInput = {
    where: ChatHistoryScalarWhereInput
    data: XOR<ChatHistoryUpdateManyMutationInput, ChatHistoryUncheckedUpdateManyWithoutInterviewSessionInput>
  }

  export type ChatHistoryScalarWhereInput = {
    AND?: ChatHistoryScalarWhereInput | ChatHistoryScalarWhereInput[]
    OR?: ChatHistoryScalarWhereInput[]
    NOT?: ChatHistoryScalarWhereInput | ChatHistoryScalarWhereInput[]
    id?: StringFilter<"ChatHistory"> | string
    sessionId?: StringFilter<"ChatHistory"> | string
    role?: StringFilter<"ChatHistory"> | string
    content?: StringFilter<"ChatHistory"> | string
    score?: IntNullableFilter<"ChatHistory"> | number | null
    critique?: StringNullableFilter<"ChatHistory"> | string | null
    timestamp?: DateTimeFilter<"ChatHistory"> | Date | string
  }

  export type TelemetryLogUpsertWithWhereUniqueWithoutInterviewSessionInput = {
    where: TelemetryLogWhereUniqueInput
    update: XOR<TelemetryLogUpdateWithoutInterviewSessionInput, TelemetryLogUncheckedUpdateWithoutInterviewSessionInput>
    create: XOR<TelemetryLogCreateWithoutInterviewSessionInput, TelemetryLogUncheckedCreateWithoutInterviewSessionInput>
  }

  export type TelemetryLogUpdateWithWhereUniqueWithoutInterviewSessionInput = {
    where: TelemetryLogWhereUniqueInput
    data: XOR<TelemetryLogUpdateWithoutInterviewSessionInput, TelemetryLogUncheckedUpdateWithoutInterviewSessionInput>
  }

  export type TelemetryLogUpdateManyWithWhereWithoutInterviewSessionInput = {
    where: TelemetryLogScalarWhereInput
    data: XOR<TelemetryLogUpdateManyMutationInput, TelemetryLogUncheckedUpdateManyWithoutInterviewSessionInput>
  }

  export type TelemetryLogScalarWhereInput = {
    AND?: TelemetryLogScalarWhereInput | TelemetryLogScalarWhereInput[]
    OR?: TelemetryLogScalarWhereInput[]
    NOT?: TelemetryLogScalarWhereInput | TelemetryLogScalarWhereInput[]
    id?: StringFilter<"TelemetryLog"> | string
    sessionId?: StringFilter<"TelemetryLog"> | string
    type?: StringFilter<"TelemetryLog"> | string
    wordsPerMinute?: IntNullableFilter<"TelemetryLog"> | number | null
    fillerWordsCount?: IntNullableFilter<"TelemetryLog"> | number | null
    stressCoefficient?: FloatNullableFilter<"TelemetryLog"> | number | null
    timestamp?: DateTimeFilter<"TelemetryLog"> | Date | string
  }

  export type CodeExecutionDeltaUpsertWithWhereUniqueWithoutInterviewSessionInput = {
    where: CodeExecutionDeltaWhereUniqueInput
    update: XOR<CodeExecutionDeltaUpdateWithoutInterviewSessionInput, CodeExecutionDeltaUncheckedUpdateWithoutInterviewSessionInput>
    create: XOR<CodeExecutionDeltaCreateWithoutInterviewSessionInput, CodeExecutionDeltaUncheckedCreateWithoutInterviewSessionInput>
  }

  export type CodeExecutionDeltaUpdateWithWhereUniqueWithoutInterviewSessionInput = {
    where: CodeExecutionDeltaWhereUniqueInput
    data: XOR<CodeExecutionDeltaUpdateWithoutInterviewSessionInput, CodeExecutionDeltaUncheckedUpdateWithoutInterviewSessionInput>
  }

  export type CodeExecutionDeltaUpdateManyWithWhereWithoutInterviewSessionInput = {
    where: CodeExecutionDeltaScalarWhereInput
    data: XOR<CodeExecutionDeltaUpdateManyMutationInput, CodeExecutionDeltaUncheckedUpdateManyWithoutInterviewSessionInput>
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

  export type InterviewSessionCreateWithoutQuestionsInput = {
    id?: string
    interviewType: $Enums.InterviewType
    targetRole: string
    targetCompany?: string | null
    industry: string
    experienceLevel: $Enums.ExperienceLevel
    focusAreas?: InterviewSessionCreatefocusAreasInput | string[]
    interviewGoal?: string | null
    durationMins?: number
    status?: $Enums.SessionStatus
    startedAt?: Date | string | null
    completedAt?: Date | string | null
    createdAt?: Date | string
    mode?: $Enums.InterviewMode
    hintCount?: number
    testCasesPassed?: number | null
    selectedLanguage?: string | null
    isDeleted?: boolean
    user: UserCreateNestedOneWithoutSessionsInput
    resume?: ResumeCreateNestedOneWithoutSessionsInput
    analysis?: AnalysisCreateNestedOneWithoutSessionInput
    chatHistory?: ChatHistoryCreateNestedManyWithoutInterviewSessionInput
    telemetryLogs?: TelemetryLogCreateNestedManyWithoutInterviewSessionInput
    codeExecutionDeltas?: CodeExecutionDeltaCreateNestedManyWithoutInterviewSessionInput
  }

  export type InterviewSessionUncheckedCreateWithoutQuestionsInput = {
    id?: string
    userId: string
    resumeId?: string | null
    interviewType: $Enums.InterviewType
    targetRole: string
    targetCompany?: string | null
    industry: string
    experienceLevel: $Enums.ExperienceLevel
    focusAreas?: InterviewSessionCreatefocusAreasInput | string[]
    interviewGoal?: string | null
    durationMins?: number
    status?: $Enums.SessionStatus
    startedAt?: Date | string | null
    completedAt?: Date | string | null
    createdAt?: Date | string
    mode?: $Enums.InterviewMode
    hintCount?: number
    testCasesPassed?: number | null
    selectedLanguage?: string | null
    isDeleted?: boolean
    analysis?: AnalysisUncheckedCreateNestedOneWithoutSessionInput
    chatHistory?: ChatHistoryUncheckedCreateNestedManyWithoutInterviewSessionInput
    telemetryLogs?: TelemetryLogUncheckedCreateNestedManyWithoutInterviewSessionInput
    codeExecutionDeltas?: CodeExecutionDeltaUncheckedCreateNestedManyWithoutInterviewSessionInput
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
    interviewType?: EnumInterviewTypeFieldUpdateOperationsInput | $Enums.InterviewType
    targetRole?: StringFieldUpdateOperationsInput | string
    targetCompany?: NullableStringFieldUpdateOperationsInput | string | null
    industry?: StringFieldUpdateOperationsInput | string
    experienceLevel?: EnumExperienceLevelFieldUpdateOperationsInput | $Enums.ExperienceLevel
    focusAreas?: InterviewSessionUpdatefocusAreasInput | string[]
    interviewGoal?: NullableStringFieldUpdateOperationsInput | string | null
    durationMins?: IntFieldUpdateOperationsInput | number
    status?: EnumSessionStatusFieldUpdateOperationsInput | $Enums.SessionStatus
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    mode?: EnumInterviewModeFieldUpdateOperationsInput | $Enums.InterviewMode
    hintCount?: IntFieldUpdateOperationsInput | number
    testCasesPassed?: NullableIntFieldUpdateOperationsInput | number | null
    selectedLanguage?: NullableStringFieldUpdateOperationsInput | string | null
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    user?: UserUpdateOneRequiredWithoutSessionsNestedInput
    resume?: ResumeUpdateOneWithoutSessionsNestedInput
    analysis?: AnalysisUpdateOneWithoutSessionNestedInput
    chatHistory?: ChatHistoryUpdateManyWithoutInterviewSessionNestedInput
    telemetryLogs?: TelemetryLogUpdateManyWithoutInterviewSessionNestedInput
    codeExecutionDeltas?: CodeExecutionDeltaUpdateManyWithoutInterviewSessionNestedInput
  }

  export type InterviewSessionUncheckedUpdateWithoutQuestionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    resumeId?: NullableStringFieldUpdateOperationsInput | string | null
    interviewType?: EnumInterviewTypeFieldUpdateOperationsInput | $Enums.InterviewType
    targetRole?: StringFieldUpdateOperationsInput | string
    targetCompany?: NullableStringFieldUpdateOperationsInput | string | null
    industry?: StringFieldUpdateOperationsInput | string
    experienceLevel?: EnumExperienceLevelFieldUpdateOperationsInput | $Enums.ExperienceLevel
    focusAreas?: InterviewSessionUpdatefocusAreasInput | string[]
    interviewGoal?: NullableStringFieldUpdateOperationsInput | string | null
    durationMins?: IntFieldUpdateOperationsInput | number
    status?: EnumSessionStatusFieldUpdateOperationsInput | $Enums.SessionStatus
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    mode?: EnumInterviewModeFieldUpdateOperationsInput | $Enums.InterviewMode
    hintCount?: IntFieldUpdateOperationsInput | number
    testCasesPassed?: NullableIntFieldUpdateOperationsInput | number | null
    selectedLanguage?: NullableStringFieldUpdateOperationsInput | string | null
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    analysis?: AnalysisUncheckedUpdateOneWithoutSessionNestedInput
    chatHistory?: ChatHistoryUncheckedUpdateManyWithoutInterviewSessionNestedInput
    telemetryLogs?: TelemetryLogUncheckedUpdateManyWithoutInterviewSessionNestedInput
    codeExecutionDeltas?: CodeExecutionDeltaUncheckedUpdateManyWithoutInterviewSessionNestedInput
  }

  export type InterviewSessionCreateWithoutAnalysisInput = {
    id?: string
    interviewType: $Enums.InterviewType
    targetRole: string
    targetCompany?: string | null
    industry: string
    experienceLevel: $Enums.ExperienceLevel
    focusAreas?: InterviewSessionCreatefocusAreasInput | string[]
    interviewGoal?: string | null
    durationMins?: number
    status?: $Enums.SessionStatus
    startedAt?: Date | string | null
    completedAt?: Date | string | null
    createdAt?: Date | string
    mode?: $Enums.InterviewMode
    hintCount?: number
    testCasesPassed?: number | null
    selectedLanguage?: string | null
    isDeleted?: boolean
    user: UserCreateNestedOneWithoutSessionsInput
    resume?: ResumeCreateNestedOneWithoutSessionsInput
    questions?: QuestionCreateNestedManyWithoutSessionInput
    chatHistory?: ChatHistoryCreateNestedManyWithoutInterviewSessionInput
    telemetryLogs?: TelemetryLogCreateNestedManyWithoutInterviewSessionInput
    codeExecutionDeltas?: CodeExecutionDeltaCreateNestedManyWithoutInterviewSessionInput
  }

  export type InterviewSessionUncheckedCreateWithoutAnalysisInput = {
    id?: string
    userId: string
    resumeId?: string | null
    interviewType: $Enums.InterviewType
    targetRole: string
    targetCompany?: string | null
    industry: string
    experienceLevel: $Enums.ExperienceLevel
    focusAreas?: InterviewSessionCreatefocusAreasInput | string[]
    interviewGoal?: string | null
    durationMins?: number
    status?: $Enums.SessionStatus
    startedAt?: Date | string | null
    completedAt?: Date | string | null
    createdAt?: Date | string
    mode?: $Enums.InterviewMode
    hintCount?: number
    testCasesPassed?: number | null
    selectedLanguage?: string | null
    isDeleted?: boolean
    questions?: QuestionUncheckedCreateNestedManyWithoutSessionInput
    chatHistory?: ChatHistoryUncheckedCreateNestedManyWithoutInterviewSessionInput
    telemetryLogs?: TelemetryLogUncheckedCreateNestedManyWithoutInterviewSessionInput
    codeExecutionDeltas?: CodeExecutionDeltaUncheckedCreateNestedManyWithoutInterviewSessionInput
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
    interviewType?: EnumInterviewTypeFieldUpdateOperationsInput | $Enums.InterviewType
    targetRole?: StringFieldUpdateOperationsInput | string
    targetCompany?: NullableStringFieldUpdateOperationsInput | string | null
    industry?: StringFieldUpdateOperationsInput | string
    experienceLevel?: EnumExperienceLevelFieldUpdateOperationsInput | $Enums.ExperienceLevel
    focusAreas?: InterviewSessionUpdatefocusAreasInput | string[]
    interviewGoal?: NullableStringFieldUpdateOperationsInput | string | null
    durationMins?: IntFieldUpdateOperationsInput | number
    status?: EnumSessionStatusFieldUpdateOperationsInput | $Enums.SessionStatus
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    mode?: EnumInterviewModeFieldUpdateOperationsInput | $Enums.InterviewMode
    hintCount?: IntFieldUpdateOperationsInput | number
    testCasesPassed?: NullableIntFieldUpdateOperationsInput | number | null
    selectedLanguage?: NullableStringFieldUpdateOperationsInput | string | null
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    user?: UserUpdateOneRequiredWithoutSessionsNestedInput
    resume?: ResumeUpdateOneWithoutSessionsNestedInput
    questions?: QuestionUpdateManyWithoutSessionNestedInput
    chatHistory?: ChatHistoryUpdateManyWithoutInterviewSessionNestedInput
    telemetryLogs?: TelemetryLogUpdateManyWithoutInterviewSessionNestedInput
    codeExecutionDeltas?: CodeExecutionDeltaUpdateManyWithoutInterviewSessionNestedInput
  }

  export type InterviewSessionUncheckedUpdateWithoutAnalysisInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    resumeId?: NullableStringFieldUpdateOperationsInput | string | null
    interviewType?: EnumInterviewTypeFieldUpdateOperationsInput | $Enums.InterviewType
    targetRole?: StringFieldUpdateOperationsInput | string
    targetCompany?: NullableStringFieldUpdateOperationsInput | string | null
    industry?: StringFieldUpdateOperationsInput | string
    experienceLevel?: EnumExperienceLevelFieldUpdateOperationsInput | $Enums.ExperienceLevel
    focusAreas?: InterviewSessionUpdatefocusAreasInput | string[]
    interviewGoal?: NullableStringFieldUpdateOperationsInput | string | null
    durationMins?: IntFieldUpdateOperationsInput | number
    status?: EnumSessionStatusFieldUpdateOperationsInput | $Enums.SessionStatus
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    mode?: EnumInterviewModeFieldUpdateOperationsInput | $Enums.InterviewMode
    hintCount?: IntFieldUpdateOperationsInput | number
    testCasesPassed?: NullableIntFieldUpdateOperationsInput | number | null
    selectedLanguage?: NullableStringFieldUpdateOperationsInput | string | null
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    questions?: QuestionUncheckedUpdateManyWithoutSessionNestedInput
    chatHistory?: ChatHistoryUncheckedUpdateManyWithoutInterviewSessionNestedInput
    telemetryLogs?: TelemetryLogUncheckedUpdateManyWithoutInterviewSessionNestedInput
    codeExecutionDeltas?: CodeExecutionDeltaUncheckedUpdateManyWithoutInterviewSessionNestedInput
  }

  export type InterviewSessionCreateWithoutChatHistoryInput = {
    id?: string
    interviewType: $Enums.InterviewType
    targetRole: string
    targetCompany?: string | null
    industry: string
    experienceLevel: $Enums.ExperienceLevel
    focusAreas?: InterviewSessionCreatefocusAreasInput | string[]
    interviewGoal?: string | null
    durationMins?: number
    status?: $Enums.SessionStatus
    startedAt?: Date | string | null
    completedAt?: Date | string | null
    createdAt?: Date | string
    mode?: $Enums.InterviewMode
    hintCount?: number
    testCasesPassed?: number | null
    selectedLanguage?: string | null
    isDeleted?: boolean
    user: UserCreateNestedOneWithoutSessionsInput
    resume?: ResumeCreateNestedOneWithoutSessionsInput
    questions?: QuestionCreateNestedManyWithoutSessionInput
    analysis?: AnalysisCreateNestedOneWithoutSessionInput
    telemetryLogs?: TelemetryLogCreateNestedManyWithoutInterviewSessionInput
    codeExecutionDeltas?: CodeExecutionDeltaCreateNestedManyWithoutInterviewSessionInput
  }

  export type InterviewSessionUncheckedCreateWithoutChatHistoryInput = {
    id?: string
    userId: string
    resumeId?: string | null
    interviewType: $Enums.InterviewType
    targetRole: string
    targetCompany?: string | null
    industry: string
    experienceLevel: $Enums.ExperienceLevel
    focusAreas?: InterviewSessionCreatefocusAreasInput | string[]
    interviewGoal?: string | null
    durationMins?: number
    status?: $Enums.SessionStatus
    startedAt?: Date | string | null
    completedAt?: Date | string | null
    createdAt?: Date | string
    mode?: $Enums.InterviewMode
    hintCount?: number
    testCasesPassed?: number | null
    selectedLanguage?: string | null
    isDeleted?: boolean
    questions?: QuestionUncheckedCreateNestedManyWithoutSessionInput
    analysis?: AnalysisUncheckedCreateNestedOneWithoutSessionInput
    telemetryLogs?: TelemetryLogUncheckedCreateNestedManyWithoutInterviewSessionInput
    codeExecutionDeltas?: CodeExecutionDeltaUncheckedCreateNestedManyWithoutInterviewSessionInput
  }

  export type InterviewSessionCreateOrConnectWithoutChatHistoryInput = {
    where: InterviewSessionWhereUniqueInput
    create: XOR<InterviewSessionCreateWithoutChatHistoryInput, InterviewSessionUncheckedCreateWithoutChatHistoryInput>
  }

  export type InterviewSessionUpsertWithoutChatHistoryInput = {
    update: XOR<InterviewSessionUpdateWithoutChatHistoryInput, InterviewSessionUncheckedUpdateWithoutChatHistoryInput>
    create: XOR<InterviewSessionCreateWithoutChatHistoryInput, InterviewSessionUncheckedCreateWithoutChatHistoryInput>
    where?: InterviewSessionWhereInput
  }

  export type InterviewSessionUpdateToOneWithWhereWithoutChatHistoryInput = {
    where?: InterviewSessionWhereInput
    data: XOR<InterviewSessionUpdateWithoutChatHistoryInput, InterviewSessionUncheckedUpdateWithoutChatHistoryInput>
  }

  export type InterviewSessionUpdateWithoutChatHistoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    interviewType?: EnumInterviewTypeFieldUpdateOperationsInput | $Enums.InterviewType
    targetRole?: StringFieldUpdateOperationsInput | string
    targetCompany?: NullableStringFieldUpdateOperationsInput | string | null
    industry?: StringFieldUpdateOperationsInput | string
    experienceLevel?: EnumExperienceLevelFieldUpdateOperationsInput | $Enums.ExperienceLevel
    focusAreas?: InterviewSessionUpdatefocusAreasInput | string[]
    interviewGoal?: NullableStringFieldUpdateOperationsInput | string | null
    durationMins?: IntFieldUpdateOperationsInput | number
    status?: EnumSessionStatusFieldUpdateOperationsInput | $Enums.SessionStatus
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    mode?: EnumInterviewModeFieldUpdateOperationsInput | $Enums.InterviewMode
    hintCount?: IntFieldUpdateOperationsInput | number
    testCasesPassed?: NullableIntFieldUpdateOperationsInput | number | null
    selectedLanguage?: NullableStringFieldUpdateOperationsInput | string | null
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    user?: UserUpdateOneRequiredWithoutSessionsNestedInput
    resume?: ResumeUpdateOneWithoutSessionsNestedInput
    questions?: QuestionUpdateManyWithoutSessionNestedInput
    analysis?: AnalysisUpdateOneWithoutSessionNestedInput
    telemetryLogs?: TelemetryLogUpdateManyWithoutInterviewSessionNestedInput
    codeExecutionDeltas?: CodeExecutionDeltaUpdateManyWithoutInterviewSessionNestedInput
  }

  export type InterviewSessionUncheckedUpdateWithoutChatHistoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    resumeId?: NullableStringFieldUpdateOperationsInput | string | null
    interviewType?: EnumInterviewTypeFieldUpdateOperationsInput | $Enums.InterviewType
    targetRole?: StringFieldUpdateOperationsInput | string
    targetCompany?: NullableStringFieldUpdateOperationsInput | string | null
    industry?: StringFieldUpdateOperationsInput | string
    experienceLevel?: EnumExperienceLevelFieldUpdateOperationsInput | $Enums.ExperienceLevel
    focusAreas?: InterviewSessionUpdatefocusAreasInput | string[]
    interviewGoal?: NullableStringFieldUpdateOperationsInput | string | null
    durationMins?: IntFieldUpdateOperationsInput | number
    status?: EnumSessionStatusFieldUpdateOperationsInput | $Enums.SessionStatus
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    mode?: EnumInterviewModeFieldUpdateOperationsInput | $Enums.InterviewMode
    hintCount?: IntFieldUpdateOperationsInput | number
    testCasesPassed?: NullableIntFieldUpdateOperationsInput | number | null
    selectedLanguage?: NullableStringFieldUpdateOperationsInput | string | null
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    questions?: QuestionUncheckedUpdateManyWithoutSessionNestedInput
    analysis?: AnalysisUncheckedUpdateOneWithoutSessionNestedInput
    telemetryLogs?: TelemetryLogUncheckedUpdateManyWithoutInterviewSessionNestedInput
    codeExecutionDeltas?: CodeExecutionDeltaUncheckedUpdateManyWithoutInterviewSessionNestedInput
  }

  export type InterviewSessionCreateWithoutTelemetryLogsInput = {
    id?: string
    interviewType: $Enums.InterviewType
    targetRole: string
    targetCompany?: string | null
    industry: string
    experienceLevel: $Enums.ExperienceLevel
    focusAreas?: InterviewSessionCreatefocusAreasInput | string[]
    interviewGoal?: string | null
    durationMins?: number
    status?: $Enums.SessionStatus
    startedAt?: Date | string | null
    completedAt?: Date | string | null
    createdAt?: Date | string
    mode?: $Enums.InterviewMode
    hintCount?: number
    testCasesPassed?: number | null
    selectedLanguage?: string | null
    isDeleted?: boolean
    user: UserCreateNestedOneWithoutSessionsInput
    resume?: ResumeCreateNestedOneWithoutSessionsInput
    questions?: QuestionCreateNestedManyWithoutSessionInput
    analysis?: AnalysisCreateNestedOneWithoutSessionInput
    chatHistory?: ChatHistoryCreateNestedManyWithoutInterviewSessionInput
    codeExecutionDeltas?: CodeExecutionDeltaCreateNestedManyWithoutInterviewSessionInput
  }

  export type InterviewSessionUncheckedCreateWithoutTelemetryLogsInput = {
    id?: string
    userId: string
    resumeId?: string | null
    interviewType: $Enums.InterviewType
    targetRole: string
    targetCompany?: string | null
    industry: string
    experienceLevel: $Enums.ExperienceLevel
    focusAreas?: InterviewSessionCreatefocusAreasInput | string[]
    interviewGoal?: string | null
    durationMins?: number
    status?: $Enums.SessionStatus
    startedAt?: Date | string | null
    completedAt?: Date | string | null
    createdAt?: Date | string
    mode?: $Enums.InterviewMode
    hintCount?: number
    testCasesPassed?: number | null
    selectedLanguage?: string | null
    isDeleted?: boolean
    questions?: QuestionUncheckedCreateNestedManyWithoutSessionInput
    analysis?: AnalysisUncheckedCreateNestedOneWithoutSessionInput
    chatHistory?: ChatHistoryUncheckedCreateNestedManyWithoutInterviewSessionInput
    codeExecutionDeltas?: CodeExecutionDeltaUncheckedCreateNestedManyWithoutInterviewSessionInput
  }

  export type InterviewSessionCreateOrConnectWithoutTelemetryLogsInput = {
    where: InterviewSessionWhereUniqueInput
    create: XOR<InterviewSessionCreateWithoutTelemetryLogsInput, InterviewSessionUncheckedCreateWithoutTelemetryLogsInput>
  }

  export type InterviewSessionUpsertWithoutTelemetryLogsInput = {
    update: XOR<InterviewSessionUpdateWithoutTelemetryLogsInput, InterviewSessionUncheckedUpdateWithoutTelemetryLogsInput>
    create: XOR<InterviewSessionCreateWithoutTelemetryLogsInput, InterviewSessionUncheckedCreateWithoutTelemetryLogsInput>
    where?: InterviewSessionWhereInput
  }

  export type InterviewSessionUpdateToOneWithWhereWithoutTelemetryLogsInput = {
    where?: InterviewSessionWhereInput
    data: XOR<InterviewSessionUpdateWithoutTelemetryLogsInput, InterviewSessionUncheckedUpdateWithoutTelemetryLogsInput>
  }

  export type InterviewSessionUpdateWithoutTelemetryLogsInput = {
    id?: StringFieldUpdateOperationsInput | string
    interviewType?: EnumInterviewTypeFieldUpdateOperationsInput | $Enums.InterviewType
    targetRole?: StringFieldUpdateOperationsInput | string
    targetCompany?: NullableStringFieldUpdateOperationsInput | string | null
    industry?: StringFieldUpdateOperationsInput | string
    experienceLevel?: EnumExperienceLevelFieldUpdateOperationsInput | $Enums.ExperienceLevel
    focusAreas?: InterviewSessionUpdatefocusAreasInput | string[]
    interviewGoal?: NullableStringFieldUpdateOperationsInput | string | null
    durationMins?: IntFieldUpdateOperationsInput | number
    status?: EnumSessionStatusFieldUpdateOperationsInput | $Enums.SessionStatus
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    mode?: EnumInterviewModeFieldUpdateOperationsInput | $Enums.InterviewMode
    hintCount?: IntFieldUpdateOperationsInput | number
    testCasesPassed?: NullableIntFieldUpdateOperationsInput | number | null
    selectedLanguage?: NullableStringFieldUpdateOperationsInput | string | null
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    user?: UserUpdateOneRequiredWithoutSessionsNestedInput
    resume?: ResumeUpdateOneWithoutSessionsNestedInput
    questions?: QuestionUpdateManyWithoutSessionNestedInput
    analysis?: AnalysisUpdateOneWithoutSessionNestedInput
    chatHistory?: ChatHistoryUpdateManyWithoutInterviewSessionNestedInput
    codeExecutionDeltas?: CodeExecutionDeltaUpdateManyWithoutInterviewSessionNestedInput
  }

  export type InterviewSessionUncheckedUpdateWithoutTelemetryLogsInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    resumeId?: NullableStringFieldUpdateOperationsInput | string | null
    interviewType?: EnumInterviewTypeFieldUpdateOperationsInput | $Enums.InterviewType
    targetRole?: StringFieldUpdateOperationsInput | string
    targetCompany?: NullableStringFieldUpdateOperationsInput | string | null
    industry?: StringFieldUpdateOperationsInput | string
    experienceLevel?: EnumExperienceLevelFieldUpdateOperationsInput | $Enums.ExperienceLevel
    focusAreas?: InterviewSessionUpdatefocusAreasInput | string[]
    interviewGoal?: NullableStringFieldUpdateOperationsInput | string | null
    durationMins?: IntFieldUpdateOperationsInput | number
    status?: EnumSessionStatusFieldUpdateOperationsInput | $Enums.SessionStatus
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    mode?: EnumInterviewModeFieldUpdateOperationsInput | $Enums.InterviewMode
    hintCount?: IntFieldUpdateOperationsInput | number
    testCasesPassed?: NullableIntFieldUpdateOperationsInput | number | null
    selectedLanguage?: NullableStringFieldUpdateOperationsInput | string | null
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    questions?: QuestionUncheckedUpdateManyWithoutSessionNestedInput
    analysis?: AnalysisUncheckedUpdateOneWithoutSessionNestedInput
    chatHistory?: ChatHistoryUncheckedUpdateManyWithoutInterviewSessionNestedInput
    codeExecutionDeltas?: CodeExecutionDeltaUncheckedUpdateManyWithoutInterviewSessionNestedInput
  }

  export type InterviewSessionCreateWithoutCodeExecutionDeltasInput = {
    id?: string
    interviewType: $Enums.InterviewType
    targetRole: string
    targetCompany?: string | null
    industry: string
    experienceLevel: $Enums.ExperienceLevel
    focusAreas?: InterviewSessionCreatefocusAreasInput | string[]
    interviewGoal?: string | null
    durationMins?: number
    status?: $Enums.SessionStatus
    startedAt?: Date | string | null
    completedAt?: Date | string | null
    createdAt?: Date | string
    mode?: $Enums.InterviewMode
    hintCount?: number
    testCasesPassed?: number | null
    selectedLanguage?: string | null
    isDeleted?: boolean
    user: UserCreateNestedOneWithoutSessionsInput
    resume?: ResumeCreateNestedOneWithoutSessionsInput
    questions?: QuestionCreateNestedManyWithoutSessionInput
    analysis?: AnalysisCreateNestedOneWithoutSessionInput
    chatHistory?: ChatHistoryCreateNestedManyWithoutInterviewSessionInput
    telemetryLogs?: TelemetryLogCreateNestedManyWithoutInterviewSessionInput
  }

  export type InterviewSessionUncheckedCreateWithoutCodeExecutionDeltasInput = {
    id?: string
    userId: string
    resumeId?: string | null
    interviewType: $Enums.InterviewType
    targetRole: string
    targetCompany?: string | null
    industry: string
    experienceLevel: $Enums.ExperienceLevel
    focusAreas?: InterviewSessionCreatefocusAreasInput | string[]
    interviewGoal?: string | null
    durationMins?: number
    status?: $Enums.SessionStatus
    startedAt?: Date | string | null
    completedAt?: Date | string | null
    createdAt?: Date | string
    mode?: $Enums.InterviewMode
    hintCount?: number
    testCasesPassed?: number | null
    selectedLanguage?: string | null
    isDeleted?: boolean
    questions?: QuestionUncheckedCreateNestedManyWithoutSessionInput
    analysis?: AnalysisUncheckedCreateNestedOneWithoutSessionInput
    chatHistory?: ChatHistoryUncheckedCreateNestedManyWithoutInterviewSessionInput
    telemetryLogs?: TelemetryLogUncheckedCreateNestedManyWithoutInterviewSessionInput
  }

  export type InterviewSessionCreateOrConnectWithoutCodeExecutionDeltasInput = {
    where: InterviewSessionWhereUniqueInput
    create: XOR<InterviewSessionCreateWithoutCodeExecutionDeltasInput, InterviewSessionUncheckedCreateWithoutCodeExecutionDeltasInput>
  }

  export type InterviewSessionUpsertWithoutCodeExecutionDeltasInput = {
    update: XOR<InterviewSessionUpdateWithoutCodeExecutionDeltasInput, InterviewSessionUncheckedUpdateWithoutCodeExecutionDeltasInput>
    create: XOR<InterviewSessionCreateWithoutCodeExecutionDeltasInput, InterviewSessionUncheckedCreateWithoutCodeExecutionDeltasInput>
    where?: InterviewSessionWhereInput
  }

  export type InterviewSessionUpdateToOneWithWhereWithoutCodeExecutionDeltasInput = {
    where?: InterviewSessionWhereInput
    data: XOR<InterviewSessionUpdateWithoutCodeExecutionDeltasInput, InterviewSessionUncheckedUpdateWithoutCodeExecutionDeltasInput>
  }

  export type InterviewSessionUpdateWithoutCodeExecutionDeltasInput = {
    id?: StringFieldUpdateOperationsInput | string
    interviewType?: EnumInterviewTypeFieldUpdateOperationsInput | $Enums.InterviewType
    targetRole?: StringFieldUpdateOperationsInput | string
    targetCompany?: NullableStringFieldUpdateOperationsInput | string | null
    industry?: StringFieldUpdateOperationsInput | string
    experienceLevel?: EnumExperienceLevelFieldUpdateOperationsInput | $Enums.ExperienceLevel
    focusAreas?: InterviewSessionUpdatefocusAreasInput | string[]
    interviewGoal?: NullableStringFieldUpdateOperationsInput | string | null
    durationMins?: IntFieldUpdateOperationsInput | number
    status?: EnumSessionStatusFieldUpdateOperationsInput | $Enums.SessionStatus
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    mode?: EnumInterviewModeFieldUpdateOperationsInput | $Enums.InterviewMode
    hintCount?: IntFieldUpdateOperationsInput | number
    testCasesPassed?: NullableIntFieldUpdateOperationsInput | number | null
    selectedLanguage?: NullableStringFieldUpdateOperationsInput | string | null
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    user?: UserUpdateOneRequiredWithoutSessionsNestedInput
    resume?: ResumeUpdateOneWithoutSessionsNestedInput
    questions?: QuestionUpdateManyWithoutSessionNestedInput
    analysis?: AnalysisUpdateOneWithoutSessionNestedInput
    chatHistory?: ChatHistoryUpdateManyWithoutInterviewSessionNestedInput
    telemetryLogs?: TelemetryLogUpdateManyWithoutInterviewSessionNestedInput
  }

  export type InterviewSessionUncheckedUpdateWithoutCodeExecutionDeltasInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    resumeId?: NullableStringFieldUpdateOperationsInput | string | null
    interviewType?: EnumInterviewTypeFieldUpdateOperationsInput | $Enums.InterviewType
    targetRole?: StringFieldUpdateOperationsInput | string
    targetCompany?: NullableStringFieldUpdateOperationsInput | string | null
    industry?: StringFieldUpdateOperationsInput | string
    experienceLevel?: EnumExperienceLevelFieldUpdateOperationsInput | $Enums.ExperienceLevel
    focusAreas?: InterviewSessionUpdatefocusAreasInput | string[]
    interviewGoal?: NullableStringFieldUpdateOperationsInput | string | null
    durationMins?: IntFieldUpdateOperationsInput | number
    status?: EnumSessionStatusFieldUpdateOperationsInput | $Enums.SessionStatus
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    mode?: EnumInterviewModeFieldUpdateOperationsInput | $Enums.InterviewMode
    hintCount?: IntFieldUpdateOperationsInput | number
    testCasesPassed?: NullableIntFieldUpdateOperationsInput | number | null
    selectedLanguage?: NullableStringFieldUpdateOperationsInput | string | null
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    questions?: QuestionUncheckedUpdateManyWithoutSessionNestedInput
    analysis?: AnalysisUncheckedUpdateOneWithoutSessionNestedInput
    chatHistory?: ChatHistoryUncheckedUpdateManyWithoutInterviewSessionNestedInput
    telemetryLogs?: TelemetryLogUncheckedUpdateManyWithoutInterviewSessionNestedInput
  }

  export type InterviewSessionCreateManyUserInput = {
    id?: string
    resumeId?: string | null
    interviewType: $Enums.InterviewType
    targetRole: string
    targetCompany?: string | null
    industry: string
    experienceLevel: $Enums.ExperienceLevel
    focusAreas?: InterviewSessionCreatefocusAreasInput | string[]
    interviewGoal?: string | null
    durationMins?: number
    status?: $Enums.SessionStatus
    startedAt?: Date | string | null
    completedAt?: Date | string | null
    createdAt?: Date | string
    mode?: $Enums.InterviewMode
    hintCount?: number
    testCasesPassed?: number | null
    selectedLanguage?: string | null
    isDeleted?: boolean
  }

  export type ResumeCreateManyUserInput = {
    id?: string
    fileName: string
    filePath: string
    parsedText?: string | null
    skills?: ResumeCreateskillsInput | string[]
    experience?: NullableJsonNullValueInput | InputJsonValue
    uploadedAt?: Date | string
  }

  export type RefreshTokenCreateManyUserInput = {
    id?: string
    tokenId: string
    expiresAt: Date | string
    createdAt?: Date | string
  }

  export type InterviewSessionUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    interviewType?: EnumInterviewTypeFieldUpdateOperationsInput | $Enums.InterviewType
    targetRole?: StringFieldUpdateOperationsInput | string
    targetCompany?: NullableStringFieldUpdateOperationsInput | string | null
    industry?: StringFieldUpdateOperationsInput | string
    experienceLevel?: EnumExperienceLevelFieldUpdateOperationsInput | $Enums.ExperienceLevel
    focusAreas?: InterviewSessionUpdatefocusAreasInput | string[]
    interviewGoal?: NullableStringFieldUpdateOperationsInput | string | null
    durationMins?: IntFieldUpdateOperationsInput | number
    status?: EnumSessionStatusFieldUpdateOperationsInput | $Enums.SessionStatus
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    mode?: EnumInterviewModeFieldUpdateOperationsInput | $Enums.InterviewMode
    hintCount?: IntFieldUpdateOperationsInput | number
    testCasesPassed?: NullableIntFieldUpdateOperationsInput | number | null
    selectedLanguage?: NullableStringFieldUpdateOperationsInput | string | null
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    resume?: ResumeUpdateOneWithoutSessionsNestedInput
    questions?: QuestionUpdateManyWithoutSessionNestedInput
    analysis?: AnalysisUpdateOneWithoutSessionNestedInput
    chatHistory?: ChatHistoryUpdateManyWithoutInterviewSessionNestedInput
    telemetryLogs?: TelemetryLogUpdateManyWithoutInterviewSessionNestedInput
    codeExecutionDeltas?: CodeExecutionDeltaUpdateManyWithoutInterviewSessionNestedInput
  }

  export type InterviewSessionUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    resumeId?: NullableStringFieldUpdateOperationsInput | string | null
    interviewType?: EnumInterviewTypeFieldUpdateOperationsInput | $Enums.InterviewType
    targetRole?: StringFieldUpdateOperationsInput | string
    targetCompany?: NullableStringFieldUpdateOperationsInput | string | null
    industry?: StringFieldUpdateOperationsInput | string
    experienceLevel?: EnumExperienceLevelFieldUpdateOperationsInput | $Enums.ExperienceLevel
    focusAreas?: InterviewSessionUpdatefocusAreasInput | string[]
    interviewGoal?: NullableStringFieldUpdateOperationsInput | string | null
    durationMins?: IntFieldUpdateOperationsInput | number
    status?: EnumSessionStatusFieldUpdateOperationsInput | $Enums.SessionStatus
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    mode?: EnumInterviewModeFieldUpdateOperationsInput | $Enums.InterviewMode
    hintCount?: IntFieldUpdateOperationsInput | number
    testCasesPassed?: NullableIntFieldUpdateOperationsInput | number | null
    selectedLanguage?: NullableStringFieldUpdateOperationsInput | string | null
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    questions?: QuestionUncheckedUpdateManyWithoutSessionNestedInput
    analysis?: AnalysisUncheckedUpdateOneWithoutSessionNestedInput
    chatHistory?: ChatHistoryUncheckedUpdateManyWithoutInterviewSessionNestedInput
    telemetryLogs?: TelemetryLogUncheckedUpdateManyWithoutInterviewSessionNestedInput
    codeExecutionDeltas?: CodeExecutionDeltaUncheckedUpdateManyWithoutInterviewSessionNestedInput
  }

  export type InterviewSessionUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    resumeId?: NullableStringFieldUpdateOperationsInput | string | null
    interviewType?: EnumInterviewTypeFieldUpdateOperationsInput | $Enums.InterviewType
    targetRole?: StringFieldUpdateOperationsInput | string
    targetCompany?: NullableStringFieldUpdateOperationsInput | string | null
    industry?: StringFieldUpdateOperationsInput | string
    experienceLevel?: EnumExperienceLevelFieldUpdateOperationsInput | $Enums.ExperienceLevel
    focusAreas?: InterviewSessionUpdatefocusAreasInput | string[]
    interviewGoal?: NullableStringFieldUpdateOperationsInput | string | null
    durationMins?: IntFieldUpdateOperationsInput | number
    status?: EnumSessionStatusFieldUpdateOperationsInput | $Enums.SessionStatus
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    mode?: EnumInterviewModeFieldUpdateOperationsInput | $Enums.InterviewMode
    hintCount?: IntFieldUpdateOperationsInput | number
    testCasesPassed?: NullableIntFieldUpdateOperationsInput | number | null
    selectedLanguage?: NullableStringFieldUpdateOperationsInput | string | null
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
  }

  export type ResumeUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    filePath?: StringFieldUpdateOperationsInput | string
    parsedText?: NullableStringFieldUpdateOperationsInput | string | null
    skills?: ResumeUpdateskillsInput | string[]
    experience?: NullableJsonNullValueInput | InputJsonValue
    uploadedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: InterviewSessionUpdateManyWithoutResumeNestedInput
  }

  export type ResumeUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    filePath?: StringFieldUpdateOperationsInput | string
    parsedText?: NullableStringFieldUpdateOperationsInput | string | null
    skills?: ResumeUpdateskillsInput | string[]
    experience?: NullableJsonNullValueInput | InputJsonValue
    uploadedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: InterviewSessionUncheckedUpdateManyWithoutResumeNestedInput
  }

  export type ResumeUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    filePath?: StringFieldUpdateOperationsInput | string
    parsedText?: NullableStringFieldUpdateOperationsInput | string | null
    skills?: ResumeUpdateskillsInput | string[]
    experience?: NullableJsonNullValueInput | InputJsonValue
    uploadedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RefreshTokenUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    tokenId?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RefreshTokenUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    tokenId?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RefreshTokenUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    tokenId?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InterviewSessionCreateManyResumeInput = {
    id?: string
    userId: string
    interviewType: $Enums.InterviewType
    targetRole: string
    targetCompany?: string | null
    industry: string
    experienceLevel: $Enums.ExperienceLevel
    focusAreas?: InterviewSessionCreatefocusAreasInput | string[]
    interviewGoal?: string | null
    durationMins?: number
    status?: $Enums.SessionStatus
    startedAt?: Date | string | null
    completedAt?: Date | string | null
    createdAt?: Date | string
    mode?: $Enums.InterviewMode
    hintCount?: number
    testCasesPassed?: number | null
    selectedLanguage?: string | null
    isDeleted?: boolean
  }

  export type InterviewSessionUpdateWithoutResumeInput = {
    id?: StringFieldUpdateOperationsInput | string
    interviewType?: EnumInterviewTypeFieldUpdateOperationsInput | $Enums.InterviewType
    targetRole?: StringFieldUpdateOperationsInput | string
    targetCompany?: NullableStringFieldUpdateOperationsInput | string | null
    industry?: StringFieldUpdateOperationsInput | string
    experienceLevel?: EnumExperienceLevelFieldUpdateOperationsInput | $Enums.ExperienceLevel
    focusAreas?: InterviewSessionUpdatefocusAreasInput | string[]
    interviewGoal?: NullableStringFieldUpdateOperationsInput | string | null
    durationMins?: IntFieldUpdateOperationsInput | number
    status?: EnumSessionStatusFieldUpdateOperationsInput | $Enums.SessionStatus
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    mode?: EnumInterviewModeFieldUpdateOperationsInput | $Enums.InterviewMode
    hintCount?: IntFieldUpdateOperationsInput | number
    testCasesPassed?: NullableIntFieldUpdateOperationsInput | number | null
    selectedLanguage?: NullableStringFieldUpdateOperationsInput | string | null
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    user?: UserUpdateOneRequiredWithoutSessionsNestedInput
    questions?: QuestionUpdateManyWithoutSessionNestedInput
    analysis?: AnalysisUpdateOneWithoutSessionNestedInput
    chatHistory?: ChatHistoryUpdateManyWithoutInterviewSessionNestedInput
    telemetryLogs?: TelemetryLogUpdateManyWithoutInterviewSessionNestedInput
    codeExecutionDeltas?: CodeExecutionDeltaUpdateManyWithoutInterviewSessionNestedInput
  }

  export type InterviewSessionUncheckedUpdateWithoutResumeInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    interviewType?: EnumInterviewTypeFieldUpdateOperationsInput | $Enums.InterviewType
    targetRole?: StringFieldUpdateOperationsInput | string
    targetCompany?: NullableStringFieldUpdateOperationsInput | string | null
    industry?: StringFieldUpdateOperationsInput | string
    experienceLevel?: EnumExperienceLevelFieldUpdateOperationsInput | $Enums.ExperienceLevel
    focusAreas?: InterviewSessionUpdatefocusAreasInput | string[]
    interviewGoal?: NullableStringFieldUpdateOperationsInput | string | null
    durationMins?: IntFieldUpdateOperationsInput | number
    status?: EnumSessionStatusFieldUpdateOperationsInput | $Enums.SessionStatus
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    mode?: EnumInterviewModeFieldUpdateOperationsInput | $Enums.InterviewMode
    hintCount?: IntFieldUpdateOperationsInput | number
    testCasesPassed?: NullableIntFieldUpdateOperationsInput | number | null
    selectedLanguage?: NullableStringFieldUpdateOperationsInput | string | null
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    questions?: QuestionUncheckedUpdateManyWithoutSessionNestedInput
    analysis?: AnalysisUncheckedUpdateOneWithoutSessionNestedInput
    chatHistory?: ChatHistoryUncheckedUpdateManyWithoutInterviewSessionNestedInput
    telemetryLogs?: TelemetryLogUncheckedUpdateManyWithoutInterviewSessionNestedInput
    codeExecutionDeltas?: CodeExecutionDeltaUncheckedUpdateManyWithoutInterviewSessionNestedInput
  }

  export type InterviewSessionUncheckedUpdateManyWithoutResumeInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    interviewType?: EnumInterviewTypeFieldUpdateOperationsInput | $Enums.InterviewType
    targetRole?: StringFieldUpdateOperationsInput | string
    targetCompany?: NullableStringFieldUpdateOperationsInput | string | null
    industry?: StringFieldUpdateOperationsInput | string
    experienceLevel?: EnumExperienceLevelFieldUpdateOperationsInput | $Enums.ExperienceLevel
    focusAreas?: InterviewSessionUpdatefocusAreasInput | string[]
    interviewGoal?: NullableStringFieldUpdateOperationsInput | string | null
    durationMins?: IntFieldUpdateOperationsInput | number
    status?: EnumSessionStatusFieldUpdateOperationsInput | $Enums.SessionStatus
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    mode?: EnumInterviewModeFieldUpdateOperationsInput | $Enums.InterviewMode
    hintCount?: IntFieldUpdateOperationsInput | number
    testCasesPassed?: NullableIntFieldUpdateOperationsInput | number | null
    selectedLanguage?: NullableStringFieldUpdateOperationsInput | string | null
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
  }

  export type QuestionCreateManySessionInput = {
    id?: string
    orderIndex: number
    questionText: string
    questionType: $Enums.QuestionType
    difficulty: $Enums.Difficulty
    answerText?: string | null
    answeredAt?: Date | string | null
    timeTakenSecs?: number | null
    evalScore?: number | null
    evalFeedback?: string | null
    evalStrengths?: QuestionCreateevalStrengthsInput | string[]
    evalWeaknesses?: QuestionCreateevalWeaknessesInput | string[]
    betterAnswer?: string | null
  }

  export type ChatHistoryCreateManyInterviewSessionInput = {
    id?: string
    role: string
    content: string
    score?: number | null
    critique?: string | null
    timestamp?: Date | string
  }

  export type TelemetryLogCreateManyInterviewSessionInput = {
    id?: string
    type: string
    wordsPerMinute?: number | null
    fillerWordsCount?: number | null
    stressCoefficient?: number | null
    timestamp?: Date | string
  }

  export type CodeExecutionDeltaCreateManyInterviewSessionInput = {
    id?: string
    code: string
    language: string
    output?: string | null
    success?: boolean | null
    timestamp?: Date | string
  }

  export type QuestionUpdateWithoutSessionInput = {
    id?: StringFieldUpdateOperationsInput | string
    orderIndex?: IntFieldUpdateOperationsInput | number
    questionText?: StringFieldUpdateOperationsInput | string
    questionType?: EnumQuestionTypeFieldUpdateOperationsInput | $Enums.QuestionType
    difficulty?: EnumDifficultyFieldUpdateOperationsInput | $Enums.Difficulty
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
    questionType?: EnumQuestionTypeFieldUpdateOperationsInput | $Enums.QuestionType
    difficulty?: EnumDifficultyFieldUpdateOperationsInput | $Enums.Difficulty
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
    questionType?: EnumQuestionTypeFieldUpdateOperationsInput | $Enums.QuestionType
    difficulty?: EnumDifficultyFieldUpdateOperationsInput | $Enums.Difficulty
    answerText?: NullableStringFieldUpdateOperationsInput | string | null
    answeredAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    timeTakenSecs?: NullableIntFieldUpdateOperationsInput | number | null
    evalScore?: NullableIntFieldUpdateOperationsInput | number | null
    evalFeedback?: NullableStringFieldUpdateOperationsInput | string | null
    evalStrengths?: QuestionUpdateevalStrengthsInput | string[]
    evalWeaknesses?: QuestionUpdateevalWeaknessesInput | string[]
    betterAnswer?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ChatHistoryUpdateWithoutInterviewSessionInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    score?: NullableIntFieldUpdateOperationsInput | number | null
    critique?: NullableStringFieldUpdateOperationsInput | string | null
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChatHistoryUncheckedUpdateWithoutInterviewSessionInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    score?: NullableIntFieldUpdateOperationsInput | number | null
    critique?: NullableStringFieldUpdateOperationsInput | string | null
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChatHistoryUncheckedUpdateManyWithoutInterviewSessionInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    score?: NullableIntFieldUpdateOperationsInput | number | null
    critique?: NullableStringFieldUpdateOperationsInput | string | null
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TelemetryLogUpdateWithoutInterviewSessionInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    wordsPerMinute?: NullableIntFieldUpdateOperationsInput | number | null
    fillerWordsCount?: NullableIntFieldUpdateOperationsInput | number | null
    stressCoefficient?: NullableFloatFieldUpdateOperationsInput | number | null
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TelemetryLogUncheckedUpdateWithoutInterviewSessionInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    wordsPerMinute?: NullableIntFieldUpdateOperationsInput | number | null
    fillerWordsCount?: NullableIntFieldUpdateOperationsInput | number | null
    stressCoefficient?: NullableFloatFieldUpdateOperationsInput | number | null
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TelemetryLogUncheckedUpdateManyWithoutInterviewSessionInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    wordsPerMinute?: NullableIntFieldUpdateOperationsInput | number | null
    fillerWordsCount?: NullableIntFieldUpdateOperationsInput | number | null
    stressCoefficient?: NullableFloatFieldUpdateOperationsInput | number | null
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CodeExecutionDeltaUpdateWithoutInterviewSessionInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    language?: StringFieldUpdateOperationsInput | string
    output?: NullableStringFieldUpdateOperationsInput | string | null
    success?: NullableBoolFieldUpdateOperationsInput | boolean | null
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CodeExecutionDeltaUncheckedUpdateWithoutInterviewSessionInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    language?: StringFieldUpdateOperationsInput | string
    output?: NullableStringFieldUpdateOperationsInput | string | null
    success?: NullableBoolFieldUpdateOperationsInput | boolean | null
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CodeExecutionDeltaUncheckedUpdateManyWithoutInterviewSessionInput = {
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