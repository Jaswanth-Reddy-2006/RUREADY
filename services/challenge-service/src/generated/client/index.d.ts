
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
 * Model ChallengeRoom
 * 
 */
export type ChallengeRoom = $Result.DefaultSelection<Prisma.$ChallengeRoomPayload>
/**
 * Model ChallengeParticipant
 * 
 */
export type ChallengeParticipant = $Result.DefaultSelection<Prisma.$ChallengeParticipantPayload>
/**
 * Model MatchSession
 * 
 */
export type MatchSession = $Result.DefaultSelection<Prisma.$MatchSessionPayload>
/**
 * Model MatchParticipant
 * 
 */
export type MatchParticipant = $Result.DefaultSelection<Prisma.$MatchParticipantPayload>
/**
 * Model ChallengeProblem
 * 
 */
export type ChallengeProblem = $Result.DefaultSelection<Prisma.$ChallengeProblemPayload>
/**
 * Model ChallengeSubmission
 * 
 */
export type ChallengeSubmission = $Result.DefaultSelection<Prisma.$ChallengeSubmissionPayload>
/**
 * Model QuizTemplate
 * 
 */
export type QuizTemplate = $Result.DefaultSelection<Prisma.$QuizTemplatePayload>
/**
 * Model QuizQuestion
 * 
 */
export type QuizQuestion = $Result.DefaultSelection<Prisma.$QuizQuestionPayload>
/**
 * Model QuizSession
 * 
 */
export type QuizSession = $Result.DefaultSelection<Prisma.$QuizSessionPayload>
/**
 * Model QuizAnswer
 * 
 */
export type QuizAnswer = $Result.DefaultSelection<Prisma.$QuizAnswerPayload>
/**
 * Model Friendship
 * 
 */
export type Friendship = $Result.DefaultSelection<Prisma.$FriendshipPayload>
/**
 * Model StudyGroup
 * 
 */
export type StudyGroup = $Result.DefaultSelection<Prisma.$StudyGroupPayload>
/**
 * Model GroupMember
 * 
 */
export type GroupMember = $Result.DefaultSelection<Prisma.$GroupMemberPayload>
/**
 * Model ChallengeRating
 * 
 */
export type ChallengeRating = $Result.DefaultSelection<Prisma.$ChallengeRatingPayload>
/**
 * Model ChallengeReward
 * 
 */
export type ChallengeReward = $Result.DefaultSelection<Prisma.$ChallengeRewardPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more ChallengeRooms
 * const challengeRooms = await prisma.challengeRoom.findMany()
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
   * // Fetch zero or more ChallengeRooms
   * const challengeRooms = await prisma.challengeRoom.findMany()
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
   * `prisma.challengeRoom`: Exposes CRUD operations for the **ChallengeRoom** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ChallengeRooms
    * const challengeRooms = await prisma.challengeRoom.findMany()
    * ```
    */
  get challengeRoom(): Prisma.ChallengeRoomDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.challengeParticipant`: Exposes CRUD operations for the **ChallengeParticipant** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ChallengeParticipants
    * const challengeParticipants = await prisma.challengeParticipant.findMany()
    * ```
    */
  get challengeParticipant(): Prisma.ChallengeParticipantDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.matchSession`: Exposes CRUD operations for the **MatchSession** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more MatchSessions
    * const matchSessions = await prisma.matchSession.findMany()
    * ```
    */
  get matchSession(): Prisma.MatchSessionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.matchParticipant`: Exposes CRUD operations for the **MatchParticipant** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more MatchParticipants
    * const matchParticipants = await prisma.matchParticipant.findMany()
    * ```
    */
  get matchParticipant(): Prisma.MatchParticipantDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.challengeProblem`: Exposes CRUD operations for the **ChallengeProblem** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ChallengeProblems
    * const challengeProblems = await prisma.challengeProblem.findMany()
    * ```
    */
  get challengeProblem(): Prisma.ChallengeProblemDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.challengeSubmission`: Exposes CRUD operations for the **ChallengeSubmission** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ChallengeSubmissions
    * const challengeSubmissions = await prisma.challengeSubmission.findMany()
    * ```
    */
  get challengeSubmission(): Prisma.ChallengeSubmissionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.quizTemplate`: Exposes CRUD operations for the **QuizTemplate** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more QuizTemplates
    * const quizTemplates = await prisma.quizTemplate.findMany()
    * ```
    */
  get quizTemplate(): Prisma.QuizTemplateDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.quizQuestion`: Exposes CRUD operations for the **QuizQuestion** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more QuizQuestions
    * const quizQuestions = await prisma.quizQuestion.findMany()
    * ```
    */
  get quizQuestion(): Prisma.QuizQuestionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.quizSession`: Exposes CRUD operations for the **QuizSession** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more QuizSessions
    * const quizSessions = await prisma.quizSession.findMany()
    * ```
    */
  get quizSession(): Prisma.QuizSessionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.quizAnswer`: Exposes CRUD operations for the **QuizAnswer** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more QuizAnswers
    * const quizAnswers = await prisma.quizAnswer.findMany()
    * ```
    */
  get quizAnswer(): Prisma.QuizAnswerDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.friendship`: Exposes CRUD operations for the **Friendship** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Friendships
    * const friendships = await prisma.friendship.findMany()
    * ```
    */
  get friendship(): Prisma.FriendshipDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.studyGroup`: Exposes CRUD operations for the **StudyGroup** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more StudyGroups
    * const studyGroups = await prisma.studyGroup.findMany()
    * ```
    */
  get studyGroup(): Prisma.StudyGroupDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.groupMember`: Exposes CRUD operations for the **GroupMember** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more GroupMembers
    * const groupMembers = await prisma.groupMember.findMany()
    * ```
    */
  get groupMember(): Prisma.GroupMemberDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.challengeRating`: Exposes CRUD operations for the **ChallengeRating** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ChallengeRatings
    * const challengeRatings = await prisma.challengeRating.findMany()
    * ```
    */
  get challengeRating(): Prisma.ChallengeRatingDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.challengeReward`: Exposes CRUD operations for the **ChallengeReward** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ChallengeRewards
    * const challengeRewards = await prisma.challengeReward.findMany()
    * ```
    */
  get challengeReward(): Prisma.ChallengeRewardDelegate<ExtArgs, ClientOptions>;
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
    ChallengeRoom: 'ChallengeRoom',
    ChallengeParticipant: 'ChallengeParticipant',
    MatchSession: 'MatchSession',
    MatchParticipant: 'MatchParticipant',
    ChallengeProblem: 'ChallengeProblem',
    ChallengeSubmission: 'ChallengeSubmission',
    QuizTemplate: 'QuizTemplate',
    QuizQuestion: 'QuizQuestion',
    QuizSession: 'QuizSession',
    QuizAnswer: 'QuizAnswer',
    Friendship: 'Friendship',
    StudyGroup: 'StudyGroup',
    GroupMember: 'GroupMember',
    ChallengeRating: 'ChallengeRating',
    ChallengeReward: 'ChallengeReward'
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
      modelProps: "challengeRoom" | "challengeParticipant" | "matchSession" | "matchParticipant" | "challengeProblem" | "challengeSubmission" | "quizTemplate" | "quizQuestion" | "quizSession" | "quizAnswer" | "friendship" | "studyGroup" | "groupMember" | "challengeRating" | "challengeReward"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      ChallengeRoom: {
        payload: Prisma.$ChallengeRoomPayload<ExtArgs>
        fields: Prisma.ChallengeRoomFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ChallengeRoomFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChallengeRoomPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ChallengeRoomFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChallengeRoomPayload>
          }
          findFirst: {
            args: Prisma.ChallengeRoomFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChallengeRoomPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ChallengeRoomFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChallengeRoomPayload>
          }
          findMany: {
            args: Prisma.ChallengeRoomFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChallengeRoomPayload>[]
          }
          create: {
            args: Prisma.ChallengeRoomCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChallengeRoomPayload>
          }
          createMany: {
            args: Prisma.ChallengeRoomCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ChallengeRoomCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChallengeRoomPayload>[]
          }
          delete: {
            args: Prisma.ChallengeRoomDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChallengeRoomPayload>
          }
          update: {
            args: Prisma.ChallengeRoomUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChallengeRoomPayload>
          }
          deleteMany: {
            args: Prisma.ChallengeRoomDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ChallengeRoomUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ChallengeRoomUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChallengeRoomPayload>[]
          }
          upsert: {
            args: Prisma.ChallengeRoomUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChallengeRoomPayload>
          }
          aggregate: {
            args: Prisma.ChallengeRoomAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateChallengeRoom>
          }
          groupBy: {
            args: Prisma.ChallengeRoomGroupByArgs<ExtArgs>
            result: $Utils.Optional<ChallengeRoomGroupByOutputType>[]
          }
          count: {
            args: Prisma.ChallengeRoomCountArgs<ExtArgs>
            result: $Utils.Optional<ChallengeRoomCountAggregateOutputType> | number
          }
        }
      }
      ChallengeParticipant: {
        payload: Prisma.$ChallengeParticipantPayload<ExtArgs>
        fields: Prisma.ChallengeParticipantFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ChallengeParticipantFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChallengeParticipantPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ChallengeParticipantFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChallengeParticipantPayload>
          }
          findFirst: {
            args: Prisma.ChallengeParticipantFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChallengeParticipantPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ChallengeParticipantFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChallengeParticipantPayload>
          }
          findMany: {
            args: Prisma.ChallengeParticipantFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChallengeParticipantPayload>[]
          }
          create: {
            args: Prisma.ChallengeParticipantCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChallengeParticipantPayload>
          }
          createMany: {
            args: Prisma.ChallengeParticipantCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ChallengeParticipantCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChallengeParticipantPayload>[]
          }
          delete: {
            args: Prisma.ChallengeParticipantDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChallengeParticipantPayload>
          }
          update: {
            args: Prisma.ChallengeParticipantUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChallengeParticipantPayload>
          }
          deleteMany: {
            args: Prisma.ChallengeParticipantDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ChallengeParticipantUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ChallengeParticipantUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChallengeParticipantPayload>[]
          }
          upsert: {
            args: Prisma.ChallengeParticipantUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChallengeParticipantPayload>
          }
          aggregate: {
            args: Prisma.ChallengeParticipantAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateChallengeParticipant>
          }
          groupBy: {
            args: Prisma.ChallengeParticipantGroupByArgs<ExtArgs>
            result: $Utils.Optional<ChallengeParticipantGroupByOutputType>[]
          }
          count: {
            args: Prisma.ChallengeParticipantCountArgs<ExtArgs>
            result: $Utils.Optional<ChallengeParticipantCountAggregateOutputType> | number
          }
        }
      }
      MatchSession: {
        payload: Prisma.$MatchSessionPayload<ExtArgs>
        fields: Prisma.MatchSessionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MatchSessionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchSessionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MatchSessionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchSessionPayload>
          }
          findFirst: {
            args: Prisma.MatchSessionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchSessionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MatchSessionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchSessionPayload>
          }
          findMany: {
            args: Prisma.MatchSessionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchSessionPayload>[]
          }
          create: {
            args: Prisma.MatchSessionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchSessionPayload>
          }
          createMany: {
            args: Prisma.MatchSessionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.MatchSessionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchSessionPayload>[]
          }
          delete: {
            args: Prisma.MatchSessionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchSessionPayload>
          }
          update: {
            args: Prisma.MatchSessionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchSessionPayload>
          }
          deleteMany: {
            args: Prisma.MatchSessionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MatchSessionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.MatchSessionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchSessionPayload>[]
          }
          upsert: {
            args: Prisma.MatchSessionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchSessionPayload>
          }
          aggregate: {
            args: Prisma.MatchSessionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMatchSession>
          }
          groupBy: {
            args: Prisma.MatchSessionGroupByArgs<ExtArgs>
            result: $Utils.Optional<MatchSessionGroupByOutputType>[]
          }
          count: {
            args: Prisma.MatchSessionCountArgs<ExtArgs>
            result: $Utils.Optional<MatchSessionCountAggregateOutputType> | number
          }
        }
      }
      MatchParticipant: {
        payload: Prisma.$MatchParticipantPayload<ExtArgs>
        fields: Prisma.MatchParticipantFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MatchParticipantFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchParticipantPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MatchParticipantFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchParticipantPayload>
          }
          findFirst: {
            args: Prisma.MatchParticipantFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchParticipantPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MatchParticipantFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchParticipantPayload>
          }
          findMany: {
            args: Prisma.MatchParticipantFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchParticipantPayload>[]
          }
          create: {
            args: Prisma.MatchParticipantCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchParticipantPayload>
          }
          createMany: {
            args: Prisma.MatchParticipantCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.MatchParticipantCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchParticipantPayload>[]
          }
          delete: {
            args: Prisma.MatchParticipantDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchParticipantPayload>
          }
          update: {
            args: Prisma.MatchParticipantUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchParticipantPayload>
          }
          deleteMany: {
            args: Prisma.MatchParticipantDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MatchParticipantUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.MatchParticipantUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchParticipantPayload>[]
          }
          upsert: {
            args: Prisma.MatchParticipantUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchParticipantPayload>
          }
          aggregate: {
            args: Prisma.MatchParticipantAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMatchParticipant>
          }
          groupBy: {
            args: Prisma.MatchParticipantGroupByArgs<ExtArgs>
            result: $Utils.Optional<MatchParticipantGroupByOutputType>[]
          }
          count: {
            args: Prisma.MatchParticipantCountArgs<ExtArgs>
            result: $Utils.Optional<MatchParticipantCountAggregateOutputType> | number
          }
        }
      }
      ChallengeProblem: {
        payload: Prisma.$ChallengeProblemPayload<ExtArgs>
        fields: Prisma.ChallengeProblemFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ChallengeProblemFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChallengeProblemPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ChallengeProblemFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChallengeProblemPayload>
          }
          findFirst: {
            args: Prisma.ChallengeProblemFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChallengeProblemPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ChallengeProblemFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChallengeProblemPayload>
          }
          findMany: {
            args: Prisma.ChallengeProblemFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChallengeProblemPayload>[]
          }
          create: {
            args: Prisma.ChallengeProblemCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChallengeProblemPayload>
          }
          createMany: {
            args: Prisma.ChallengeProblemCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ChallengeProblemCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChallengeProblemPayload>[]
          }
          delete: {
            args: Prisma.ChallengeProblemDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChallengeProblemPayload>
          }
          update: {
            args: Prisma.ChallengeProblemUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChallengeProblemPayload>
          }
          deleteMany: {
            args: Prisma.ChallengeProblemDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ChallengeProblemUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ChallengeProblemUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChallengeProblemPayload>[]
          }
          upsert: {
            args: Prisma.ChallengeProblemUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChallengeProblemPayload>
          }
          aggregate: {
            args: Prisma.ChallengeProblemAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateChallengeProblem>
          }
          groupBy: {
            args: Prisma.ChallengeProblemGroupByArgs<ExtArgs>
            result: $Utils.Optional<ChallengeProblemGroupByOutputType>[]
          }
          count: {
            args: Prisma.ChallengeProblemCountArgs<ExtArgs>
            result: $Utils.Optional<ChallengeProblemCountAggregateOutputType> | number
          }
        }
      }
      ChallengeSubmission: {
        payload: Prisma.$ChallengeSubmissionPayload<ExtArgs>
        fields: Prisma.ChallengeSubmissionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ChallengeSubmissionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChallengeSubmissionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ChallengeSubmissionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChallengeSubmissionPayload>
          }
          findFirst: {
            args: Prisma.ChallengeSubmissionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChallengeSubmissionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ChallengeSubmissionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChallengeSubmissionPayload>
          }
          findMany: {
            args: Prisma.ChallengeSubmissionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChallengeSubmissionPayload>[]
          }
          create: {
            args: Prisma.ChallengeSubmissionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChallengeSubmissionPayload>
          }
          createMany: {
            args: Prisma.ChallengeSubmissionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ChallengeSubmissionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChallengeSubmissionPayload>[]
          }
          delete: {
            args: Prisma.ChallengeSubmissionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChallengeSubmissionPayload>
          }
          update: {
            args: Prisma.ChallengeSubmissionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChallengeSubmissionPayload>
          }
          deleteMany: {
            args: Prisma.ChallengeSubmissionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ChallengeSubmissionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ChallengeSubmissionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChallengeSubmissionPayload>[]
          }
          upsert: {
            args: Prisma.ChallengeSubmissionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChallengeSubmissionPayload>
          }
          aggregate: {
            args: Prisma.ChallengeSubmissionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateChallengeSubmission>
          }
          groupBy: {
            args: Prisma.ChallengeSubmissionGroupByArgs<ExtArgs>
            result: $Utils.Optional<ChallengeSubmissionGroupByOutputType>[]
          }
          count: {
            args: Prisma.ChallengeSubmissionCountArgs<ExtArgs>
            result: $Utils.Optional<ChallengeSubmissionCountAggregateOutputType> | number
          }
        }
      }
      QuizTemplate: {
        payload: Prisma.$QuizTemplatePayload<ExtArgs>
        fields: Prisma.QuizTemplateFieldRefs
        operations: {
          findUnique: {
            args: Prisma.QuizTemplateFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuizTemplatePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.QuizTemplateFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuizTemplatePayload>
          }
          findFirst: {
            args: Prisma.QuizTemplateFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuizTemplatePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.QuizTemplateFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuizTemplatePayload>
          }
          findMany: {
            args: Prisma.QuizTemplateFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuizTemplatePayload>[]
          }
          create: {
            args: Prisma.QuizTemplateCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuizTemplatePayload>
          }
          createMany: {
            args: Prisma.QuizTemplateCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.QuizTemplateCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuizTemplatePayload>[]
          }
          delete: {
            args: Prisma.QuizTemplateDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuizTemplatePayload>
          }
          update: {
            args: Prisma.QuizTemplateUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuizTemplatePayload>
          }
          deleteMany: {
            args: Prisma.QuizTemplateDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.QuizTemplateUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.QuizTemplateUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuizTemplatePayload>[]
          }
          upsert: {
            args: Prisma.QuizTemplateUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuizTemplatePayload>
          }
          aggregate: {
            args: Prisma.QuizTemplateAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateQuizTemplate>
          }
          groupBy: {
            args: Prisma.QuizTemplateGroupByArgs<ExtArgs>
            result: $Utils.Optional<QuizTemplateGroupByOutputType>[]
          }
          count: {
            args: Prisma.QuizTemplateCountArgs<ExtArgs>
            result: $Utils.Optional<QuizTemplateCountAggregateOutputType> | number
          }
        }
      }
      QuizQuestion: {
        payload: Prisma.$QuizQuestionPayload<ExtArgs>
        fields: Prisma.QuizQuestionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.QuizQuestionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuizQuestionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.QuizQuestionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuizQuestionPayload>
          }
          findFirst: {
            args: Prisma.QuizQuestionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuizQuestionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.QuizQuestionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuizQuestionPayload>
          }
          findMany: {
            args: Prisma.QuizQuestionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuizQuestionPayload>[]
          }
          create: {
            args: Prisma.QuizQuestionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuizQuestionPayload>
          }
          createMany: {
            args: Prisma.QuizQuestionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.QuizQuestionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuizQuestionPayload>[]
          }
          delete: {
            args: Prisma.QuizQuestionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuizQuestionPayload>
          }
          update: {
            args: Prisma.QuizQuestionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuizQuestionPayload>
          }
          deleteMany: {
            args: Prisma.QuizQuestionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.QuizQuestionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.QuizQuestionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuizQuestionPayload>[]
          }
          upsert: {
            args: Prisma.QuizQuestionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuizQuestionPayload>
          }
          aggregate: {
            args: Prisma.QuizQuestionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateQuizQuestion>
          }
          groupBy: {
            args: Prisma.QuizQuestionGroupByArgs<ExtArgs>
            result: $Utils.Optional<QuizQuestionGroupByOutputType>[]
          }
          count: {
            args: Prisma.QuizQuestionCountArgs<ExtArgs>
            result: $Utils.Optional<QuizQuestionCountAggregateOutputType> | number
          }
        }
      }
      QuizSession: {
        payload: Prisma.$QuizSessionPayload<ExtArgs>
        fields: Prisma.QuizSessionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.QuizSessionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuizSessionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.QuizSessionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuizSessionPayload>
          }
          findFirst: {
            args: Prisma.QuizSessionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuizSessionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.QuizSessionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuizSessionPayload>
          }
          findMany: {
            args: Prisma.QuizSessionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuizSessionPayload>[]
          }
          create: {
            args: Prisma.QuizSessionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuizSessionPayload>
          }
          createMany: {
            args: Prisma.QuizSessionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.QuizSessionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuizSessionPayload>[]
          }
          delete: {
            args: Prisma.QuizSessionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuizSessionPayload>
          }
          update: {
            args: Prisma.QuizSessionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuizSessionPayload>
          }
          deleteMany: {
            args: Prisma.QuizSessionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.QuizSessionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.QuizSessionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuizSessionPayload>[]
          }
          upsert: {
            args: Prisma.QuizSessionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuizSessionPayload>
          }
          aggregate: {
            args: Prisma.QuizSessionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateQuizSession>
          }
          groupBy: {
            args: Prisma.QuizSessionGroupByArgs<ExtArgs>
            result: $Utils.Optional<QuizSessionGroupByOutputType>[]
          }
          count: {
            args: Prisma.QuizSessionCountArgs<ExtArgs>
            result: $Utils.Optional<QuizSessionCountAggregateOutputType> | number
          }
        }
      }
      QuizAnswer: {
        payload: Prisma.$QuizAnswerPayload<ExtArgs>
        fields: Prisma.QuizAnswerFieldRefs
        operations: {
          findUnique: {
            args: Prisma.QuizAnswerFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuizAnswerPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.QuizAnswerFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuizAnswerPayload>
          }
          findFirst: {
            args: Prisma.QuizAnswerFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuizAnswerPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.QuizAnswerFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuizAnswerPayload>
          }
          findMany: {
            args: Prisma.QuizAnswerFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuizAnswerPayload>[]
          }
          create: {
            args: Prisma.QuizAnswerCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuizAnswerPayload>
          }
          createMany: {
            args: Prisma.QuizAnswerCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.QuizAnswerCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuizAnswerPayload>[]
          }
          delete: {
            args: Prisma.QuizAnswerDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuizAnswerPayload>
          }
          update: {
            args: Prisma.QuizAnswerUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuizAnswerPayload>
          }
          deleteMany: {
            args: Prisma.QuizAnswerDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.QuizAnswerUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.QuizAnswerUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuizAnswerPayload>[]
          }
          upsert: {
            args: Prisma.QuizAnswerUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuizAnswerPayload>
          }
          aggregate: {
            args: Prisma.QuizAnswerAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateQuizAnswer>
          }
          groupBy: {
            args: Prisma.QuizAnswerGroupByArgs<ExtArgs>
            result: $Utils.Optional<QuizAnswerGroupByOutputType>[]
          }
          count: {
            args: Prisma.QuizAnswerCountArgs<ExtArgs>
            result: $Utils.Optional<QuizAnswerCountAggregateOutputType> | number
          }
        }
      }
      Friendship: {
        payload: Prisma.$FriendshipPayload<ExtArgs>
        fields: Prisma.FriendshipFieldRefs
        operations: {
          findUnique: {
            args: Prisma.FriendshipFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FriendshipPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.FriendshipFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FriendshipPayload>
          }
          findFirst: {
            args: Prisma.FriendshipFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FriendshipPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.FriendshipFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FriendshipPayload>
          }
          findMany: {
            args: Prisma.FriendshipFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FriendshipPayload>[]
          }
          create: {
            args: Prisma.FriendshipCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FriendshipPayload>
          }
          createMany: {
            args: Prisma.FriendshipCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.FriendshipCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FriendshipPayload>[]
          }
          delete: {
            args: Prisma.FriendshipDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FriendshipPayload>
          }
          update: {
            args: Prisma.FriendshipUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FriendshipPayload>
          }
          deleteMany: {
            args: Prisma.FriendshipDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.FriendshipUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.FriendshipUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FriendshipPayload>[]
          }
          upsert: {
            args: Prisma.FriendshipUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FriendshipPayload>
          }
          aggregate: {
            args: Prisma.FriendshipAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateFriendship>
          }
          groupBy: {
            args: Prisma.FriendshipGroupByArgs<ExtArgs>
            result: $Utils.Optional<FriendshipGroupByOutputType>[]
          }
          count: {
            args: Prisma.FriendshipCountArgs<ExtArgs>
            result: $Utils.Optional<FriendshipCountAggregateOutputType> | number
          }
        }
      }
      StudyGroup: {
        payload: Prisma.$StudyGroupPayload<ExtArgs>
        fields: Prisma.StudyGroupFieldRefs
        operations: {
          findUnique: {
            args: Prisma.StudyGroupFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudyGroupPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.StudyGroupFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudyGroupPayload>
          }
          findFirst: {
            args: Prisma.StudyGroupFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudyGroupPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.StudyGroupFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudyGroupPayload>
          }
          findMany: {
            args: Prisma.StudyGroupFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudyGroupPayload>[]
          }
          create: {
            args: Prisma.StudyGroupCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudyGroupPayload>
          }
          createMany: {
            args: Prisma.StudyGroupCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.StudyGroupCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudyGroupPayload>[]
          }
          delete: {
            args: Prisma.StudyGroupDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudyGroupPayload>
          }
          update: {
            args: Prisma.StudyGroupUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudyGroupPayload>
          }
          deleteMany: {
            args: Prisma.StudyGroupDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.StudyGroupUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.StudyGroupUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudyGroupPayload>[]
          }
          upsert: {
            args: Prisma.StudyGroupUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudyGroupPayload>
          }
          aggregate: {
            args: Prisma.StudyGroupAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateStudyGroup>
          }
          groupBy: {
            args: Prisma.StudyGroupGroupByArgs<ExtArgs>
            result: $Utils.Optional<StudyGroupGroupByOutputType>[]
          }
          count: {
            args: Prisma.StudyGroupCountArgs<ExtArgs>
            result: $Utils.Optional<StudyGroupCountAggregateOutputType> | number
          }
        }
      }
      GroupMember: {
        payload: Prisma.$GroupMemberPayload<ExtArgs>
        fields: Prisma.GroupMemberFieldRefs
        operations: {
          findUnique: {
            args: Prisma.GroupMemberFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GroupMemberPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.GroupMemberFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GroupMemberPayload>
          }
          findFirst: {
            args: Prisma.GroupMemberFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GroupMemberPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.GroupMemberFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GroupMemberPayload>
          }
          findMany: {
            args: Prisma.GroupMemberFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GroupMemberPayload>[]
          }
          create: {
            args: Prisma.GroupMemberCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GroupMemberPayload>
          }
          createMany: {
            args: Prisma.GroupMemberCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.GroupMemberCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GroupMemberPayload>[]
          }
          delete: {
            args: Prisma.GroupMemberDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GroupMemberPayload>
          }
          update: {
            args: Prisma.GroupMemberUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GroupMemberPayload>
          }
          deleteMany: {
            args: Prisma.GroupMemberDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.GroupMemberUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.GroupMemberUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GroupMemberPayload>[]
          }
          upsert: {
            args: Prisma.GroupMemberUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GroupMemberPayload>
          }
          aggregate: {
            args: Prisma.GroupMemberAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateGroupMember>
          }
          groupBy: {
            args: Prisma.GroupMemberGroupByArgs<ExtArgs>
            result: $Utils.Optional<GroupMemberGroupByOutputType>[]
          }
          count: {
            args: Prisma.GroupMemberCountArgs<ExtArgs>
            result: $Utils.Optional<GroupMemberCountAggregateOutputType> | number
          }
        }
      }
      ChallengeRating: {
        payload: Prisma.$ChallengeRatingPayload<ExtArgs>
        fields: Prisma.ChallengeRatingFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ChallengeRatingFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChallengeRatingPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ChallengeRatingFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChallengeRatingPayload>
          }
          findFirst: {
            args: Prisma.ChallengeRatingFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChallengeRatingPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ChallengeRatingFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChallengeRatingPayload>
          }
          findMany: {
            args: Prisma.ChallengeRatingFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChallengeRatingPayload>[]
          }
          create: {
            args: Prisma.ChallengeRatingCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChallengeRatingPayload>
          }
          createMany: {
            args: Prisma.ChallengeRatingCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ChallengeRatingCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChallengeRatingPayload>[]
          }
          delete: {
            args: Prisma.ChallengeRatingDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChallengeRatingPayload>
          }
          update: {
            args: Prisma.ChallengeRatingUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChallengeRatingPayload>
          }
          deleteMany: {
            args: Prisma.ChallengeRatingDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ChallengeRatingUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ChallengeRatingUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChallengeRatingPayload>[]
          }
          upsert: {
            args: Prisma.ChallengeRatingUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChallengeRatingPayload>
          }
          aggregate: {
            args: Prisma.ChallengeRatingAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateChallengeRating>
          }
          groupBy: {
            args: Prisma.ChallengeRatingGroupByArgs<ExtArgs>
            result: $Utils.Optional<ChallengeRatingGroupByOutputType>[]
          }
          count: {
            args: Prisma.ChallengeRatingCountArgs<ExtArgs>
            result: $Utils.Optional<ChallengeRatingCountAggregateOutputType> | number
          }
        }
      }
      ChallengeReward: {
        payload: Prisma.$ChallengeRewardPayload<ExtArgs>
        fields: Prisma.ChallengeRewardFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ChallengeRewardFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChallengeRewardPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ChallengeRewardFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChallengeRewardPayload>
          }
          findFirst: {
            args: Prisma.ChallengeRewardFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChallengeRewardPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ChallengeRewardFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChallengeRewardPayload>
          }
          findMany: {
            args: Prisma.ChallengeRewardFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChallengeRewardPayload>[]
          }
          create: {
            args: Prisma.ChallengeRewardCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChallengeRewardPayload>
          }
          createMany: {
            args: Prisma.ChallengeRewardCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ChallengeRewardCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChallengeRewardPayload>[]
          }
          delete: {
            args: Prisma.ChallengeRewardDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChallengeRewardPayload>
          }
          update: {
            args: Prisma.ChallengeRewardUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChallengeRewardPayload>
          }
          deleteMany: {
            args: Prisma.ChallengeRewardDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ChallengeRewardUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ChallengeRewardUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChallengeRewardPayload>[]
          }
          upsert: {
            args: Prisma.ChallengeRewardUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChallengeRewardPayload>
          }
          aggregate: {
            args: Prisma.ChallengeRewardAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateChallengeReward>
          }
          groupBy: {
            args: Prisma.ChallengeRewardGroupByArgs<ExtArgs>
            result: $Utils.Optional<ChallengeRewardGroupByOutputType>[]
          }
          count: {
            args: Prisma.ChallengeRewardCountArgs<ExtArgs>
            result: $Utils.Optional<ChallengeRewardCountAggregateOutputType> | number
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
    challengeRoom?: ChallengeRoomOmit
    challengeParticipant?: ChallengeParticipantOmit
    matchSession?: MatchSessionOmit
    matchParticipant?: MatchParticipantOmit
    challengeProblem?: ChallengeProblemOmit
    challengeSubmission?: ChallengeSubmissionOmit
    quizTemplate?: QuizTemplateOmit
    quizQuestion?: QuizQuestionOmit
    quizSession?: QuizSessionOmit
    quizAnswer?: QuizAnswerOmit
    friendship?: FriendshipOmit
    studyGroup?: StudyGroupOmit
    groupMember?: GroupMemberOmit
    challengeRating?: ChallengeRatingOmit
    challengeReward?: ChallengeRewardOmit
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
   * Count Type ChallengeRoomCountOutputType
   */

  export type ChallengeRoomCountOutputType = {
    participants: number
    matches: number
  }

  export type ChallengeRoomCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    participants?: boolean | ChallengeRoomCountOutputTypeCountParticipantsArgs
    matches?: boolean | ChallengeRoomCountOutputTypeCountMatchesArgs
  }

  // Custom InputTypes
  /**
   * ChallengeRoomCountOutputType without action
   */
  export type ChallengeRoomCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChallengeRoomCountOutputType
     */
    select?: ChallengeRoomCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ChallengeRoomCountOutputType without action
   */
  export type ChallengeRoomCountOutputTypeCountParticipantsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ChallengeParticipantWhereInput
  }

  /**
   * ChallengeRoomCountOutputType without action
   */
  export type ChallengeRoomCountOutputTypeCountMatchesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MatchSessionWhereInput
  }


  /**
   * Count Type MatchSessionCountOutputType
   */

  export type MatchSessionCountOutputType = {
    participants: number
    submissions: number
  }

  export type MatchSessionCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    participants?: boolean | MatchSessionCountOutputTypeCountParticipantsArgs
    submissions?: boolean | MatchSessionCountOutputTypeCountSubmissionsArgs
  }

  // Custom InputTypes
  /**
   * MatchSessionCountOutputType without action
   */
  export type MatchSessionCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MatchSessionCountOutputType
     */
    select?: MatchSessionCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * MatchSessionCountOutputType without action
   */
  export type MatchSessionCountOutputTypeCountParticipantsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MatchParticipantWhereInput
  }

  /**
   * MatchSessionCountOutputType without action
   */
  export type MatchSessionCountOutputTypeCountSubmissionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ChallengeSubmissionWhereInput
  }


  /**
   * Count Type QuizTemplateCountOutputType
   */

  export type QuizTemplateCountOutputType = {
    questions: number
    sessions: number
  }

  export type QuizTemplateCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    questions?: boolean | QuizTemplateCountOutputTypeCountQuestionsArgs
    sessions?: boolean | QuizTemplateCountOutputTypeCountSessionsArgs
  }

  // Custom InputTypes
  /**
   * QuizTemplateCountOutputType without action
   */
  export type QuizTemplateCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuizTemplateCountOutputType
     */
    select?: QuizTemplateCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * QuizTemplateCountOutputType without action
   */
  export type QuizTemplateCountOutputTypeCountQuestionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: QuizQuestionWhereInput
  }

  /**
   * QuizTemplateCountOutputType without action
   */
  export type QuizTemplateCountOutputTypeCountSessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: QuizSessionWhereInput
  }


  /**
   * Count Type QuizSessionCountOutputType
   */

  export type QuizSessionCountOutputType = {
    answers: number
  }

  export type QuizSessionCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    answers?: boolean | QuizSessionCountOutputTypeCountAnswersArgs
  }

  // Custom InputTypes
  /**
   * QuizSessionCountOutputType without action
   */
  export type QuizSessionCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuizSessionCountOutputType
     */
    select?: QuizSessionCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * QuizSessionCountOutputType without action
   */
  export type QuizSessionCountOutputTypeCountAnswersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: QuizAnswerWhereInput
  }


  /**
   * Count Type StudyGroupCountOutputType
   */

  export type StudyGroupCountOutputType = {
    members: number
  }

  export type StudyGroupCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    members?: boolean | StudyGroupCountOutputTypeCountMembersArgs
  }

  // Custom InputTypes
  /**
   * StudyGroupCountOutputType without action
   */
  export type StudyGroupCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudyGroupCountOutputType
     */
    select?: StudyGroupCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * StudyGroupCountOutputType without action
   */
  export type StudyGroupCountOutputTypeCountMembersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GroupMemberWhereInput
  }


  /**
   * Models
   */

  /**
   * Model ChallengeRoom
   */

  export type AggregateChallengeRoom = {
    _count: ChallengeRoomCountAggregateOutputType | null
    _avg: ChallengeRoomAvgAggregateOutputType | null
    _sum: ChallengeRoomSumAggregateOutputType | null
    _min: ChallengeRoomMinAggregateOutputType | null
    _max: ChallengeRoomMaxAggregateOutputType | null
  }

  export type ChallengeRoomAvgAggregateOutputType = {
    maxParticipants: number | null
    durationMinutes: number | null
  }

  export type ChallengeRoomSumAggregateOutputType = {
    maxParticipants: number | null
    durationMinutes: number | null
  }

  export type ChallengeRoomMinAggregateOutputType = {
    id: string | null
    roomCode: string | null
    title: string | null
    type: string | null
    visibility: string | null
    difficulty: string | null
    topic: string | null
    language: string | null
    maxParticipants: number | null
    durationMinutes: number | null
    status: string | null
    createdBy: string | null
    hostName: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ChallengeRoomMaxAggregateOutputType = {
    id: string | null
    roomCode: string | null
    title: string | null
    type: string | null
    visibility: string | null
    difficulty: string | null
    topic: string | null
    language: string | null
    maxParticipants: number | null
    durationMinutes: number | null
    status: string | null
    createdBy: string | null
    hostName: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ChallengeRoomCountAggregateOutputType = {
    id: number
    roomCode: number
    title: number
    type: number
    visibility: number
    difficulty: number
    topic: number
    language: number
    maxParticipants: number
    durationMinutes: number
    status: number
    createdBy: number
    hostName: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ChallengeRoomAvgAggregateInputType = {
    maxParticipants?: true
    durationMinutes?: true
  }

  export type ChallengeRoomSumAggregateInputType = {
    maxParticipants?: true
    durationMinutes?: true
  }

  export type ChallengeRoomMinAggregateInputType = {
    id?: true
    roomCode?: true
    title?: true
    type?: true
    visibility?: true
    difficulty?: true
    topic?: true
    language?: true
    maxParticipants?: true
    durationMinutes?: true
    status?: true
    createdBy?: true
    hostName?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ChallengeRoomMaxAggregateInputType = {
    id?: true
    roomCode?: true
    title?: true
    type?: true
    visibility?: true
    difficulty?: true
    topic?: true
    language?: true
    maxParticipants?: true
    durationMinutes?: true
    status?: true
    createdBy?: true
    hostName?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ChallengeRoomCountAggregateInputType = {
    id?: true
    roomCode?: true
    title?: true
    type?: true
    visibility?: true
    difficulty?: true
    topic?: true
    language?: true
    maxParticipants?: true
    durationMinutes?: true
    status?: true
    createdBy?: true
    hostName?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ChallengeRoomAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ChallengeRoom to aggregate.
     */
    where?: ChallengeRoomWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChallengeRooms to fetch.
     */
    orderBy?: ChallengeRoomOrderByWithRelationInput | ChallengeRoomOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ChallengeRoomWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChallengeRooms from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChallengeRooms.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ChallengeRooms
    **/
    _count?: true | ChallengeRoomCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ChallengeRoomAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ChallengeRoomSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ChallengeRoomMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ChallengeRoomMaxAggregateInputType
  }

  export type GetChallengeRoomAggregateType<T extends ChallengeRoomAggregateArgs> = {
        [P in keyof T & keyof AggregateChallengeRoom]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateChallengeRoom[P]>
      : GetScalarType<T[P], AggregateChallengeRoom[P]>
  }




  export type ChallengeRoomGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ChallengeRoomWhereInput
    orderBy?: ChallengeRoomOrderByWithAggregationInput | ChallengeRoomOrderByWithAggregationInput[]
    by: ChallengeRoomScalarFieldEnum[] | ChallengeRoomScalarFieldEnum
    having?: ChallengeRoomScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ChallengeRoomCountAggregateInputType | true
    _avg?: ChallengeRoomAvgAggregateInputType
    _sum?: ChallengeRoomSumAggregateInputType
    _min?: ChallengeRoomMinAggregateInputType
    _max?: ChallengeRoomMaxAggregateInputType
  }

  export type ChallengeRoomGroupByOutputType = {
    id: string
    roomCode: string
    title: string
    type: string
    visibility: string
    difficulty: string
    topic: string
    language: string
    maxParticipants: number
    durationMinutes: number
    status: string
    createdBy: string
    hostName: string | null
    createdAt: Date
    updatedAt: Date
    _count: ChallengeRoomCountAggregateOutputType | null
    _avg: ChallengeRoomAvgAggregateOutputType | null
    _sum: ChallengeRoomSumAggregateOutputType | null
    _min: ChallengeRoomMinAggregateOutputType | null
    _max: ChallengeRoomMaxAggregateOutputType | null
  }

  type GetChallengeRoomGroupByPayload<T extends ChallengeRoomGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ChallengeRoomGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ChallengeRoomGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ChallengeRoomGroupByOutputType[P]>
            : GetScalarType<T[P], ChallengeRoomGroupByOutputType[P]>
        }
      >
    >


  export type ChallengeRoomSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    roomCode?: boolean
    title?: boolean
    type?: boolean
    visibility?: boolean
    difficulty?: boolean
    topic?: boolean
    language?: boolean
    maxParticipants?: boolean
    durationMinutes?: boolean
    status?: boolean
    createdBy?: boolean
    hostName?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    participants?: boolean | ChallengeRoom$participantsArgs<ExtArgs>
    matches?: boolean | ChallengeRoom$matchesArgs<ExtArgs>
    _count?: boolean | ChallengeRoomCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["challengeRoom"]>

  export type ChallengeRoomSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    roomCode?: boolean
    title?: boolean
    type?: boolean
    visibility?: boolean
    difficulty?: boolean
    topic?: boolean
    language?: boolean
    maxParticipants?: boolean
    durationMinutes?: boolean
    status?: boolean
    createdBy?: boolean
    hostName?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["challengeRoom"]>

  export type ChallengeRoomSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    roomCode?: boolean
    title?: boolean
    type?: boolean
    visibility?: boolean
    difficulty?: boolean
    topic?: boolean
    language?: boolean
    maxParticipants?: boolean
    durationMinutes?: boolean
    status?: boolean
    createdBy?: boolean
    hostName?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["challengeRoom"]>

  export type ChallengeRoomSelectScalar = {
    id?: boolean
    roomCode?: boolean
    title?: boolean
    type?: boolean
    visibility?: boolean
    difficulty?: boolean
    topic?: boolean
    language?: boolean
    maxParticipants?: boolean
    durationMinutes?: boolean
    status?: boolean
    createdBy?: boolean
    hostName?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ChallengeRoomOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "roomCode" | "title" | "type" | "visibility" | "difficulty" | "topic" | "language" | "maxParticipants" | "durationMinutes" | "status" | "createdBy" | "hostName" | "createdAt" | "updatedAt", ExtArgs["result"]["challengeRoom"]>
  export type ChallengeRoomInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    participants?: boolean | ChallengeRoom$participantsArgs<ExtArgs>
    matches?: boolean | ChallengeRoom$matchesArgs<ExtArgs>
    _count?: boolean | ChallengeRoomCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ChallengeRoomIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type ChallengeRoomIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $ChallengeRoomPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ChallengeRoom"
    objects: {
      participants: Prisma.$ChallengeParticipantPayload<ExtArgs>[]
      matches: Prisma.$MatchSessionPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      roomCode: string
      title: string
      type: string
      visibility: string
      difficulty: string
      topic: string
      language: string
      maxParticipants: number
      durationMinutes: number
      status: string
      createdBy: string
      hostName: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["challengeRoom"]>
    composites: {}
  }

  type ChallengeRoomGetPayload<S extends boolean | null | undefined | ChallengeRoomDefaultArgs> = $Result.GetResult<Prisma.$ChallengeRoomPayload, S>

  type ChallengeRoomCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ChallengeRoomFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ChallengeRoomCountAggregateInputType | true
    }

  export interface ChallengeRoomDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ChallengeRoom'], meta: { name: 'ChallengeRoom' } }
    /**
     * Find zero or one ChallengeRoom that matches the filter.
     * @param {ChallengeRoomFindUniqueArgs} args - Arguments to find a ChallengeRoom
     * @example
     * // Get one ChallengeRoom
     * const challengeRoom = await prisma.challengeRoom.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ChallengeRoomFindUniqueArgs>(args: SelectSubset<T, ChallengeRoomFindUniqueArgs<ExtArgs>>): Prisma__ChallengeRoomClient<$Result.GetResult<Prisma.$ChallengeRoomPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ChallengeRoom that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ChallengeRoomFindUniqueOrThrowArgs} args - Arguments to find a ChallengeRoom
     * @example
     * // Get one ChallengeRoom
     * const challengeRoom = await prisma.challengeRoom.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ChallengeRoomFindUniqueOrThrowArgs>(args: SelectSubset<T, ChallengeRoomFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ChallengeRoomClient<$Result.GetResult<Prisma.$ChallengeRoomPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ChallengeRoom that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChallengeRoomFindFirstArgs} args - Arguments to find a ChallengeRoom
     * @example
     * // Get one ChallengeRoom
     * const challengeRoom = await prisma.challengeRoom.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ChallengeRoomFindFirstArgs>(args?: SelectSubset<T, ChallengeRoomFindFirstArgs<ExtArgs>>): Prisma__ChallengeRoomClient<$Result.GetResult<Prisma.$ChallengeRoomPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ChallengeRoom that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChallengeRoomFindFirstOrThrowArgs} args - Arguments to find a ChallengeRoom
     * @example
     * // Get one ChallengeRoom
     * const challengeRoom = await prisma.challengeRoom.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ChallengeRoomFindFirstOrThrowArgs>(args?: SelectSubset<T, ChallengeRoomFindFirstOrThrowArgs<ExtArgs>>): Prisma__ChallengeRoomClient<$Result.GetResult<Prisma.$ChallengeRoomPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ChallengeRooms that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChallengeRoomFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ChallengeRooms
     * const challengeRooms = await prisma.challengeRoom.findMany()
     * 
     * // Get first 10 ChallengeRooms
     * const challengeRooms = await prisma.challengeRoom.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const challengeRoomWithIdOnly = await prisma.challengeRoom.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ChallengeRoomFindManyArgs>(args?: SelectSubset<T, ChallengeRoomFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChallengeRoomPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ChallengeRoom.
     * @param {ChallengeRoomCreateArgs} args - Arguments to create a ChallengeRoom.
     * @example
     * // Create one ChallengeRoom
     * const ChallengeRoom = await prisma.challengeRoom.create({
     *   data: {
     *     // ... data to create a ChallengeRoom
     *   }
     * })
     * 
     */
    create<T extends ChallengeRoomCreateArgs>(args: SelectSubset<T, ChallengeRoomCreateArgs<ExtArgs>>): Prisma__ChallengeRoomClient<$Result.GetResult<Prisma.$ChallengeRoomPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ChallengeRooms.
     * @param {ChallengeRoomCreateManyArgs} args - Arguments to create many ChallengeRooms.
     * @example
     * // Create many ChallengeRooms
     * const challengeRoom = await prisma.challengeRoom.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ChallengeRoomCreateManyArgs>(args?: SelectSubset<T, ChallengeRoomCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ChallengeRooms and returns the data saved in the database.
     * @param {ChallengeRoomCreateManyAndReturnArgs} args - Arguments to create many ChallengeRooms.
     * @example
     * // Create many ChallengeRooms
     * const challengeRoom = await prisma.challengeRoom.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ChallengeRooms and only return the `id`
     * const challengeRoomWithIdOnly = await prisma.challengeRoom.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ChallengeRoomCreateManyAndReturnArgs>(args?: SelectSubset<T, ChallengeRoomCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChallengeRoomPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ChallengeRoom.
     * @param {ChallengeRoomDeleteArgs} args - Arguments to delete one ChallengeRoom.
     * @example
     * // Delete one ChallengeRoom
     * const ChallengeRoom = await prisma.challengeRoom.delete({
     *   where: {
     *     // ... filter to delete one ChallengeRoom
     *   }
     * })
     * 
     */
    delete<T extends ChallengeRoomDeleteArgs>(args: SelectSubset<T, ChallengeRoomDeleteArgs<ExtArgs>>): Prisma__ChallengeRoomClient<$Result.GetResult<Prisma.$ChallengeRoomPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ChallengeRoom.
     * @param {ChallengeRoomUpdateArgs} args - Arguments to update one ChallengeRoom.
     * @example
     * // Update one ChallengeRoom
     * const challengeRoom = await prisma.challengeRoom.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ChallengeRoomUpdateArgs>(args: SelectSubset<T, ChallengeRoomUpdateArgs<ExtArgs>>): Prisma__ChallengeRoomClient<$Result.GetResult<Prisma.$ChallengeRoomPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ChallengeRooms.
     * @param {ChallengeRoomDeleteManyArgs} args - Arguments to filter ChallengeRooms to delete.
     * @example
     * // Delete a few ChallengeRooms
     * const { count } = await prisma.challengeRoom.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ChallengeRoomDeleteManyArgs>(args?: SelectSubset<T, ChallengeRoomDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ChallengeRooms.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChallengeRoomUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ChallengeRooms
     * const challengeRoom = await prisma.challengeRoom.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ChallengeRoomUpdateManyArgs>(args: SelectSubset<T, ChallengeRoomUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ChallengeRooms and returns the data updated in the database.
     * @param {ChallengeRoomUpdateManyAndReturnArgs} args - Arguments to update many ChallengeRooms.
     * @example
     * // Update many ChallengeRooms
     * const challengeRoom = await prisma.challengeRoom.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ChallengeRooms and only return the `id`
     * const challengeRoomWithIdOnly = await prisma.challengeRoom.updateManyAndReturn({
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
    updateManyAndReturn<T extends ChallengeRoomUpdateManyAndReturnArgs>(args: SelectSubset<T, ChallengeRoomUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChallengeRoomPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ChallengeRoom.
     * @param {ChallengeRoomUpsertArgs} args - Arguments to update or create a ChallengeRoom.
     * @example
     * // Update or create a ChallengeRoom
     * const challengeRoom = await prisma.challengeRoom.upsert({
     *   create: {
     *     // ... data to create a ChallengeRoom
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ChallengeRoom we want to update
     *   }
     * })
     */
    upsert<T extends ChallengeRoomUpsertArgs>(args: SelectSubset<T, ChallengeRoomUpsertArgs<ExtArgs>>): Prisma__ChallengeRoomClient<$Result.GetResult<Prisma.$ChallengeRoomPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ChallengeRooms.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChallengeRoomCountArgs} args - Arguments to filter ChallengeRooms to count.
     * @example
     * // Count the number of ChallengeRooms
     * const count = await prisma.challengeRoom.count({
     *   where: {
     *     // ... the filter for the ChallengeRooms we want to count
     *   }
     * })
    **/
    count<T extends ChallengeRoomCountArgs>(
      args?: Subset<T, ChallengeRoomCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ChallengeRoomCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ChallengeRoom.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChallengeRoomAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ChallengeRoomAggregateArgs>(args: Subset<T, ChallengeRoomAggregateArgs>): Prisma.PrismaPromise<GetChallengeRoomAggregateType<T>>

    /**
     * Group by ChallengeRoom.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChallengeRoomGroupByArgs} args - Group by arguments.
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
      T extends ChallengeRoomGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ChallengeRoomGroupByArgs['orderBy'] }
        : { orderBy?: ChallengeRoomGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ChallengeRoomGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetChallengeRoomGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ChallengeRoom model
   */
  readonly fields: ChallengeRoomFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ChallengeRoom.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ChallengeRoomClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    participants<T extends ChallengeRoom$participantsArgs<ExtArgs> = {}>(args?: Subset<T, ChallengeRoom$participantsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChallengeParticipantPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    matches<T extends ChallengeRoom$matchesArgs<ExtArgs> = {}>(args?: Subset<T, ChallengeRoom$matchesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MatchSessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the ChallengeRoom model
   */
  interface ChallengeRoomFieldRefs {
    readonly id: FieldRef<"ChallengeRoom", 'String'>
    readonly roomCode: FieldRef<"ChallengeRoom", 'String'>
    readonly title: FieldRef<"ChallengeRoom", 'String'>
    readonly type: FieldRef<"ChallengeRoom", 'String'>
    readonly visibility: FieldRef<"ChallengeRoom", 'String'>
    readonly difficulty: FieldRef<"ChallengeRoom", 'String'>
    readonly topic: FieldRef<"ChallengeRoom", 'String'>
    readonly language: FieldRef<"ChallengeRoom", 'String'>
    readonly maxParticipants: FieldRef<"ChallengeRoom", 'Int'>
    readonly durationMinutes: FieldRef<"ChallengeRoom", 'Int'>
    readonly status: FieldRef<"ChallengeRoom", 'String'>
    readonly createdBy: FieldRef<"ChallengeRoom", 'String'>
    readonly hostName: FieldRef<"ChallengeRoom", 'String'>
    readonly createdAt: FieldRef<"ChallengeRoom", 'DateTime'>
    readonly updatedAt: FieldRef<"ChallengeRoom", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ChallengeRoom findUnique
   */
  export type ChallengeRoomFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChallengeRoom
     */
    select?: ChallengeRoomSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChallengeRoom
     */
    omit?: ChallengeRoomOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChallengeRoomInclude<ExtArgs> | null
    /**
     * Filter, which ChallengeRoom to fetch.
     */
    where: ChallengeRoomWhereUniqueInput
  }

  /**
   * ChallengeRoom findUniqueOrThrow
   */
  export type ChallengeRoomFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChallengeRoom
     */
    select?: ChallengeRoomSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChallengeRoom
     */
    omit?: ChallengeRoomOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChallengeRoomInclude<ExtArgs> | null
    /**
     * Filter, which ChallengeRoom to fetch.
     */
    where: ChallengeRoomWhereUniqueInput
  }

  /**
   * ChallengeRoom findFirst
   */
  export type ChallengeRoomFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChallengeRoom
     */
    select?: ChallengeRoomSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChallengeRoom
     */
    omit?: ChallengeRoomOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChallengeRoomInclude<ExtArgs> | null
    /**
     * Filter, which ChallengeRoom to fetch.
     */
    where?: ChallengeRoomWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChallengeRooms to fetch.
     */
    orderBy?: ChallengeRoomOrderByWithRelationInput | ChallengeRoomOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ChallengeRooms.
     */
    cursor?: ChallengeRoomWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChallengeRooms from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChallengeRooms.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ChallengeRooms.
     */
    distinct?: ChallengeRoomScalarFieldEnum | ChallengeRoomScalarFieldEnum[]
  }

  /**
   * ChallengeRoom findFirstOrThrow
   */
  export type ChallengeRoomFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChallengeRoom
     */
    select?: ChallengeRoomSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChallengeRoom
     */
    omit?: ChallengeRoomOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChallengeRoomInclude<ExtArgs> | null
    /**
     * Filter, which ChallengeRoom to fetch.
     */
    where?: ChallengeRoomWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChallengeRooms to fetch.
     */
    orderBy?: ChallengeRoomOrderByWithRelationInput | ChallengeRoomOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ChallengeRooms.
     */
    cursor?: ChallengeRoomWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChallengeRooms from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChallengeRooms.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ChallengeRooms.
     */
    distinct?: ChallengeRoomScalarFieldEnum | ChallengeRoomScalarFieldEnum[]
  }

  /**
   * ChallengeRoom findMany
   */
  export type ChallengeRoomFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChallengeRoom
     */
    select?: ChallengeRoomSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChallengeRoom
     */
    omit?: ChallengeRoomOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChallengeRoomInclude<ExtArgs> | null
    /**
     * Filter, which ChallengeRooms to fetch.
     */
    where?: ChallengeRoomWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChallengeRooms to fetch.
     */
    orderBy?: ChallengeRoomOrderByWithRelationInput | ChallengeRoomOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ChallengeRooms.
     */
    cursor?: ChallengeRoomWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChallengeRooms from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChallengeRooms.
     */
    skip?: number
    distinct?: ChallengeRoomScalarFieldEnum | ChallengeRoomScalarFieldEnum[]
  }

  /**
   * ChallengeRoom create
   */
  export type ChallengeRoomCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChallengeRoom
     */
    select?: ChallengeRoomSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChallengeRoom
     */
    omit?: ChallengeRoomOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChallengeRoomInclude<ExtArgs> | null
    /**
     * The data needed to create a ChallengeRoom.
     */
    data: XOR<ChallengeRoomCreateInput, ChallengeRoomUncheckedCreateInput>
  }

  /**
   * ChallengeRoom createMany
   */
  export type ChallengeRoomCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ChallengeRooms.
     */
    data: ChallengeRoomCreateManyInput | ChallengeRoomCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ChallengeRoom createManyAndReturn
   */
  export type ChallengeRoomCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChallengeRoom
     */
    select?: ChallengeRoomSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ChallengeRoom
     */
    omit?: ChallengeRoomOmit<ExtArgs> | null
    /**
     * The data used to create many ChallengeRooms.
     */
    data: ChallengeRoomCreateManyInput | ChallengeRoomCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ChallengeRoom update
   */
  export type ChallengeRoomUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChallengeRoom
     */
    select?: ChallengeRoomSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChallengeRoom
     */
    omit?: ChallengeRoomOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChallengeRoomInclude<ExtArgs> | null
    /**
     * The data needed to update a ChallengeRoom.
     */
    data: XOR<ChallengeRoomUpdateInput, ChallengeRoomUncheckedUpdateInput>
    /**
     * Choose, which ChallengeRoom to update.
     */
    where: ChallengeRoomWhereUniqueInput
  }

  /**
   * ChallengeRoom updateMany
   */
  export type ChallengeRoomUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ChallengeRooms.
     */
    data: XOR<ChallengeRoomUpdateManyMutationInput, ChallengeRoomUncheckedUpdateManyInput>
    /**
     * Filter which ChallengeRooms to update
     */
    where?: ChallengeRoomWhereInput
    /**
     * Limit how many ChallengeRooms to update.
     */
    limit?: number
  }

  /**
   * ChallengeRoom updateManyAndReturn
   */
  export type ChallengeRoomUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChallengeRoom
     */
    select?: ChallengeRoomSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ChallengeRoom
     */
    omit?: ChallengeRoomOmit<ExtArgs> | null
    /**
     * The data used to update ChallengeRooms.
     */
    data: XOR<ChallengeRoomUpdateManyMutationInput, ChallengeRoomUncheckedUpdateManyInput>
    /**
     * Filter which ChallengeRooms to update
     */
    where?: ChallengeRoomWhereInput
    /**
     * Limit how many ChallengeRooms to update.
     */
    limit?: number
  }

  /**
   * ChallengeRoom upsert
   */
  export type ChallengeRoomUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChallengeRoom
     */
    select?: ChallengeRoomSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChallengeRoom
     */
    omit?: ChallengeRoomOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChallengeRoomInclude<ExtArgs> | null
    /**
     * The filter to search for the ChallengeRoom to update in case it exists.
     */
    where: ChallengeRoomWhereUniqueInput
    /**
     * In case the ChallengeRoom found by the `where` argument doesn't exist, create a new ChallengeRoom with this data.
     */
    create: XOR<ChallengeRoomCreateInput, ChallengeRoomUncheckedCreateInput>
    /**
     * In case the ChallengeRoom was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ChallengeRoomUpdateInput, ChallengeRoomUncheckedUpdateInput>
  }

  /**
   * ChallengeRoom delete
   */
  export type ChallengeRoomDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChallengeRoom
     */
    select?: ChallengeRoomSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChallengeRoom
     */
    omit?: ChallengeRoomOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChallengeRoomInclude<ExtArgs> | null
    /**
     * Filter which ChallengeRoom to delete.
     */
    where: ChallengeRoomWhereUniqueInput
  }

  /**
   * ChallengeRoom deleteMany
   */
  export type ChallengeRoomDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ChallengeRooms to delete
     */
    where?: ChallengeRoomWhereInput
    /**
     * Limit how many ChallengeRooms to delete.
     */
    limit?: number
  }

  /**
   * ChallengeRoom.participants
   */
  export type ChallengeRoom$participantsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChallengeParticipant
     */
    select?: ChallengeParticipantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChallengeParticipant
     */
    omit?: ChallengeParticipantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChallengeParticipantInclude<ExtArgs> | null
    where?: ChallengeParticipantWhereInput
    orderBy?: ChallengeParticipantOrderByWithRelationInput | ChallengeParticipantOrderByWithRelationInput[]
    cursor?: ChallengeParticipantWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ChallengeParticipantScalarFieldEnum | ChallengeParticipantScalarFieldEnum[]
  }

  /**
   * ChallengeRoom.matches
   */
  export type ChallengeRoom$matchesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MatchSession
     */
    select?: MatchSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MatchSession
     */
    omit?: MatchSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchSessionInclude<ExtArgs> | null
    where?: MatchSessionWhereInput
    orderBy?: MatchSessionOrderByWithRelationInput | MatchSessionOrderByWithRelationInput[]
    cursor?: MatchSessionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MatchSessionScalarFieldEnum | MatchSessionScalarFieldEnum[]
  }

  /**
   * ChallengeRoom without action
   */
  export type ChallengeRoomDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChallengeRoom
     */
    select?: ChallengeRoomSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChallengeRoom
     */
    omit?: ChallengeRoomOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChallengeRoomInclude<ExtArgs> | null
  }


  /**
   * Model ChallengeParticipant
   */

  export type AggregateChallengeParticipant = {
    _count: ChallengeParticipantCountAggregateOutputType | null
    _avg: ChallengeParticipantAvgAggregateOutputType | null
    _sum: ChallengeParticipantSumAggregateOutputType | null
    _min: ChallengeParticipantMinAggregateOutputType | null
    _max: ChallengeParticipantMaxAggregateOutputType | null
  }

  export type ChallengeParticipantAvgAggregateOutputType = {
    userRating: number | null
  }

  export type ChallengeParticipantSumAggregateOutputType = {
    userRating: number | null
  }

  export type ChallengeParticipantMinAggregateOutputType = {
    id: string | null
    roomId: string | null
    userId: string | null
    userName: string | null
    userAvatar: string | null
    userRating: number | null
    isHost: boolean | null
    isReady: boolean | null
    status: string | null
    joinedAt: Date | null
    leftAt: Date | null
  }

  export type ChallengeParticipantMaxAggregateOutputType = {
    id: string | null
    roomId: string | null
    userId: string | null
    userName: string | null
    userAvatar: string | null
    userRating: number | null
    isHost: boolean | null
    isReady: boolean | null
    status: string | null
    joinedAt: Date | null
    leftAt: Date | null
  }

  export type ChallengeParticipantCountAggregateOutputType = {
    id: number
    roomId: number
    userId: number
    userName: number
    userAvatar: number
    userRating: number
    isHost: number
    isReady: number
    status: number
    joinedAt: number
    leftAt: number
    _all: number
  }


  export type ChallengeParticipantAvgAggregateInputType = {
    userRating?: true
  }

  export type ChallengeParticipantSumAggregateInputType = {
    userRating?: true
  }

  export type ChallengeParticipantMinAggregateInputType = {
    id?: true
    roomId?: true
    userId?: true
    userName?: true
    userAvatar?: true
    userRating?: true
    isHost?: true
    isReady?: true
    status?: true
    joinedAt?: true
    leftAt?: true
  }

  export type ChallengeParticipantMaxAggregateInputType = {
    id?: true
    roomId?: true
    userId?: true
    userName?: true
    userAvatar?: true
    userRating?: true
    isHost?: true
    isReady?: true
    status?: true
    joinedAt?: true
    leftAt?: true
  }

  export type ChallengeParticipantCountAggregateInputType = {
    id?: true
    roomId?: true
    userId?: true
    userName?: true
    userAvatar?: true
    userRating?: true
    isHost?: true
    isReady?: true
    status?: true
    joinedAt?: true
    leftAt?: true
    _all?: true
  }

  export type ChallengeParticipantAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ChallengeParticipant to aggregate.
     */
    where?: ChallengeParticipantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChallengeParticipants to fetch.
     */
    orderBy?: ChallengeParticipantOrderByWithRelationInput | ChallengeParticipantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ChallengeParticipantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChallengeParticipants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChallengeParticipants.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ChallengeParticipants
    **/
    _count?: true | ChallengeParticipantCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ChallengeParticipantAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ChallengeParticipantSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ChallengeParticipantMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ChallengeParticipantMaxAggregateInputType
  }

  export type GetChallengeParticipantAggregateType<T extends ChallengeParticipantAggregateArgs> = {
        [P in keyof T & keyof AggregateChallengeParticipant]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateChallengeParticipant[P]>
      : GetScalarType<T[P], AggregateChallengeParticipant[P]>
  }




  export type ChallengeParticipantGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ChallengeParticipantWhereInput
    orderBy?: ChallengeParticipantOrderByWithAggregationInput | ChallengeParticipantOrderByWithAggregationInput[]
    by: ChallengeParticipantScalarFieldEnum[] | ChallengeParticipantScalarFieldEnum
    having?: ChallengeParticipantScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ChallengeParticipantCountAggregateInputType | true
    _avg?: ChallengeParticipantAvgAggregateInputType
    _sum?: ChallengeParticipantSumAggregateInputType
    _min?: ChallengeParticipantMinAggregateInputType
    _max?: ChallengeParticipantMaxAggregateInputType
  }

  export type ChallengeParticipantGroupByOutputType = {
    id: string
    roomId: string
    userId: string
    userName: string
    userAvatar: string | null
    userRating: number
    isHost: boolean
    isReady: boolean
    status: string
    joinedAt: Date
    leftAt: Date | null
    _count: ChallengeParticipantCountAggregateOutputType | null
    _avg: ChallengeParticipantAvgAggregateOutputType | null
    _sum: ChallengeParticipantSumAggregateOutputType | null
    _min: ChallengeParticipantMinAggregateOutputType | null
    _max: ChallengeParticipantMaxAggregateOutputType | null
  }

  type GetChallengeParticipantGroupByPayload<T extends ChallengeParticipantGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ChallengeParticipantGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ChallengeParticipantGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ChallengeParticipantGroupByOutputType[P]>
            : GetScalarType<T[P], ChallengeParticipantGroupByOutputType[P]>
        }
      >
    >


  export type ChallengeParticipantSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    roomId?: boolean
    userId?: boolean
    userName?: boolean
    userAvatar?: boolean
    userRating?: boolean
    isHost?: boolean
    isReady?: boolean
    status?: boolean
    joinedAt?: boolean
    leftAt?: boolean
    room?: boolean | ChallengeRoomDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["challengeParticipant"]>

  export type ChallengeParticipantSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    roomId?: boolean
    userId?: boolean
    userName?: boolean
    userAvatar?: boolean
    userRating?: boolean
    isHost?: boolean
    isReady?: boolean
    status?: boolean
    joinedAt?: boolean
    leftAt?: boolean
    room?: boolean | ChallengeRoomDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["challengeParticipant"]>

  export type ChallengeParticipantSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    roomId?: boolean
    userId?: boolean
    userName?: boolean
    userAvatar?: boolean
    userRating?: boolean
    isHost?: boolean
    isReady?: boolean
    status?: boolean
    joinedAt?: boolean
    leftAt?: boolean
    room?: boolean | ChallengeRoomDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["challengeParticipant"]>

  export type ChallengeParticipantSelectScalar = {
    id?: boolean
    roomId?: boolean
    userId?: boolean
    userName?: boolean
    userAvatar?: boolean
    userRating?: boolean
    isHost?: boolean
    isReady?: boolean
    status?: boolean
    joinedAt?: boolean
    leftAt?: boolean
  }

  export type ChallengeParticipantOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "roomId" | "userId" | "userName" | "userAvatar" | "userRating" | "isHost" | "isReady" | "status" | "joinedAt" | "leftAt", ExtArgs["result"]["challengeParticipant"]>
  export type ChallengeParticipantInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    room?: boolean | ChallengeRoomDefaultArgs<ExtArgs>
  }
  export type ChallengeParticipantIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    room?: boolean | ChallengeRoomDefaultArgs<ExtArgs>
  }
  export type ChallengeParticipantIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    room?: boolean | ChallengeRoomDefaultArgs<ExtArgs>
  }

  export type $ChallengeParticipantPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ChallengeParticipant"
    objects: {
      room: Prisma.$ChallengeRoomPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      roomId: string
      userId: string
      userName: string
      userAvatar: string | null
      userRating: number
      isHost: boolean
      isReady: boolean
      status: string
      joinedAt: Date
      leftAt: Date | null
    }, ExtArgs["result"]["challengeParticipant"]>
    composites: {}
  }

  type ChallengeParticipantGetPayload<S extends boolean | null | undefined | ChallengeParticipantDefaultArgs> = $Result.GetResult<Prisma.$ChallengeParticipantPayload, S>

  type ChallengeParticipantCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ChallengeParticipantFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ChallengeParticipantCountAggregateInputType | true
    }

  export interface ChallengeParticipantDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ChallengeParticipant'], meta: { name: 'ChallengeParticipant' } }
    /**
     * Find zero or one ChallengeParticipant that matches the filter.
     * @param {ChallengeParticipantFindUniqueArgs} args - Arguments to find a ChallengeParticipant
     * @example
     * // Get one ChallengeParticipant
     * const challengeParticipant = await prisma.challengeParticipant.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ChallengeParticipantFindUniqueArgs>(args: SelectSubset<T, ChallengeParticipantFindUniqueArgs<ExtArgs>>): Prisma__ChallengeParticipantClient<$Result.GetResult<Prisma.$ChallengeParticipantPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ChallengeParticipant that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ChallengeParticipantFindUniqueOrThrowArgs} args - Arguments to find a ChallengeParticipant
     * @example
     * // Get one ChallengeParticipant
     * const challengeParticipant = await prisma.challengeParticipant.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ChallengeParticipantFindUniqueOrThrowArgs>(args: SelectSubset<T, ChallengeParticipantFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ChallengeParticipantClient<$Result.GetResult<Prisma.$ChallengeParticipantPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ChallengeParticipant that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChallengeParticipantFindFirstArgs} args - Arguments to find a ChallengeParticipant
     * @example
     * // Get one ChallengeParticipant
     * const challengeParticipant = await prisma.challengeParticipant.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ChallengeParticipantFindFirstArgs>(args?: SelectSubset<T, ChallengeParticipantFindFirstArgs<ExtArgs>>): Prisma__ChallengeParticipantClient<$Result.GetResult<Prisma.$ChallengeParticipantPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ChallengeParticipant that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChallengeParticipantFindFirstOrThrowArgs} args - Arguments to find a ChallengeParticipant
     * @example
     * // Get one ChallengeParticipant
     * const challengeParticipant = await prisma.challengeParticipant.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ChallengeParticipantFindFirstOrThrowArgs>(args?: SelectSubset<T, ChallengeParticipantFindFirstOrThrowArgs<ExtArgs>>): Prisma__ChallengeParticipantClient<$Result.GetResult<Prisma.$ChallengeParticipantPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ChallengeParticipants that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChallengeParticipantFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ChallengeParticipants
     * const challengeParticipants = await prisma.challengeParticipant.findMany()
     * 
     * // Get first 10 ChallengeParticipants
     * const challengeParticipants = await prisma.challengeParticipant.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const challengeParticipantWithIdOnly = await prisma.challengeParticipant.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ChallengeParticipantFindManyArgs>(args?: SelectSubset<T, ChallengeParticipantFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChallengeParticipantPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ChallengeParticipant.
     * @param {ChallengeParticipantCreateArgs} args - Arguments to create a ChallengeParticipant.
     * @example
     * // Create one ChallengeParticipant
     * const ChallengeParticipant = await prisma.challengeParticipant.create({
     *   data: {
     *     // ... data to create a ChallengeParticipant
     *   }
     * })
     * 
     */
    create<T extends ChallengeParticipantCreateArgs>(args: SelectSubset<T, ChallengeParticipantCreateArgs<ExtArgs>>): Prisma__ChallengeParticipantClient<$Result.GetResult<Prisma.$ChallengeParticipantPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ChallengeParticipants.
     * @param {ChallengeParticipantCreateManyArgs} args - Arguments to create many ChallengeParticipants.
     * @example
     * // Create many ChallengeParticipants
     * const challengeParticipant = await prisma.challengeParticipant.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ChallengeParticipantCreateManyArgs>(args?: SelectSubset<T, ChallengeParticipantCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ChallengeParticipants and returns the data saved in the database.
     * @param {ChallengeParticipantCreateManyAndReturnArgs} args - Arguments to create many ChallengeParticipants.
     * @example
     * // Create many ChallengeParticipants
     * const challengeParticipant = await prisma.challengeParticipant.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ChallengeParticipants and only return the `id`
     * const challengeParticipantWithIdOnly = await prisma.challengeParticipant.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ChallengeParticipantCreateManyAndReturnArgs>(args?: SelectSubset<T, ChallengeParticipantCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChallengeParticipantPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ChallengeParticipant.
     * @param {ChallengeParticipantDeleteArgs} args - Arguments to delete one ChallengeParticipant.
     * @example
     * // Delete one ChallengeParticipant
     * const ChallengeParticipant = await prisma.challengeParticipant.delete({
     *   where: {
     *     // ... filter to delete one ChallengeParticipant
     *   }
     * })
     * 
     */
    delete<T extends ChallengeParticipantDeleteArgs>(args: SelectSubset<T, ChallengeParticipantDeleteArgs<ExtArgs>>): Prisma__ChallengeParticipantClient<$Result.GetResult<Prisma.$ChallengeParticipantPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ChallengeParticipant.
     * @param {ChallengeParticipantUpdateArgs} args - Arguments to update one ChallengeParticipant.
     * @example
     * // Update one ChallengeParticipant
     * const challengeParticipant = await prisma.challengeParticipant.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ChallengeParticipantUpdateArgs>(args: SelectSubset<T, ChallengeParticipantUpdateArgs<ExtArgs>>): Prisma__ChallengeParticipantClient<$Result.GetResult<Prisma.$ChallengeParticipantPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ChallengeParticipants.
     * @param {ChallengeParticipantDeleteManyArgs} args - Arguments to filter ChallengeParticipants to delete.
     * @example
     * // Delete a few ChallengeParticipants
     * const { count } = await prisma.challengeParticipant.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ChallengeParticipantDeleteManyArgs>(args?: SelectSubset<T, ChallengeParticipantDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ChallengeParticipants.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChallengeParticipantUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ChallengeParticipants
     * const challengeParticipant = await prisma.challengeParticipant.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ChallengeParticipantUpdateManyArgs>(args: SelectSubset<T, ChallengeParticipantUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ChallengeParticipants and returns the data updated in the database.
     * @param {ChallengeParticipantUpdateManyAndReturnArgs} args - Arguments to update many ChallengeParticipants.
     * @example
     * // Update many ChallengeParticipants
     * const challengeParticipant = await prisma.challengeParticipant.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ChallengeParticipants and only return the `id`
     * const challengeParticipantWithIdOnly = await prisma.challengeParticipant.updateManyAndReturn({
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
    updateManyAndReturn<T extends ChallengeParticipantUpdateManyAndReturnArgs>(args: SelectSubset<T, ChallengeParticipantUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChallengeParticipantPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ChallengeParticipant.
     * @param {ChallengeParticipantUpsertArgs} args - Arguments to update or create a ChallengeParticipant.
     * @example
     * // Update or create a ChallengeParticipant
     * const challengeParticipant = await prisma.challengeParticipant.upsert({
     *   create: {
     *     // ... data to create a ChallengeParticipant
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ChallengeParticipant we want to update
     *   }
     * })
     */
    upsert<T extends ChallengeParticipantUpsertArgs>(args: SelectSubset<T, ChallengeParticipantUpsertArgs<ExtArgs>>): Prisma__ChallengeParticipantClient<$Result.GetResult<Prisma.$ChallengeParticipantPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ChallengeParticipants.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChallengeParticipantCountArgs} args - Arguments to filter ChallengeParticipants to count.
     * @example
     * // Count the number of ChallengeParticipants
     * const count = await prisma.challengeParticipant.count({
     *   where: {
     *     // ... the filter for the ChallengeParticipants we want to count
     *   }
     * })
    **/
    count<T extends ChallengeParticipantCountArgs>(
      args?: Subset<T, ChallengeParticipantCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ChallengeParticipantCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ChallengeParticipant.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChallengeParticipantAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ChallengeParticipantAggregateArgs>(args: Subset<T, ChallengeParticipantAggregateArgs>): Prisma.PrismaPromise<GetChallengeParticipantAggregateType<T>>

    /**
     * Group by ChallengeParticipant.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChallengeParticipantGroupByArgs} args - Group by arguments.
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
      T extends ChallengeParticipantGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ChallengeParticipantGroupByArgs['orderBy'] }
        : { orderBy?: ChallengeParticipantGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ChallengeParticipantGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetChallengeParticipantGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ChallengeParticipant model
   */
  readonly fields: ChallengeParticipantFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ChallengeParticipant.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ChallengeParticipantClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    room<T extends ChallengeRoomDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ChallengeRoomDefaultArgs<ExtArgs>>): Prisma__ChallengeRoomClient<$Result.GetResult<Prisma.$ChallengeRoomPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the ChallengeParticipant model
   */
  interface ChallengeParticipantFieldRefs {
    readonly id: FieldRef<"ChallengeParticipant", 'String'>
    readonly roomId: FieldRef<"ChallengeParticipant", 'String'>
    readonly userId: FieldRef<"ChallengeParticipant", 'String'>
    readonly userName: FieldRef<"ChallengeParticipant", 'String'>
    readonly userAvatar: FieldRef<"ChallengeParticipant", 'String'>
    readonly userRating: FieldRef<"ChallengeParticipant", 'Int'>
    readonly isHost: FieldRef<"ChallengeParticipant", 'Boolean'>
    readonly isReady: FieldRef<"ChallengeParticipant", 'Boolean'>
    readonly status: FieldRef<"ChallengeParticipant", 'String'>
    readonly joinedAt: FieldRef<"ChallengeParticipant", 'DateTime'>
    readonly leftAt: FieldRef<"ChallengeParticipant", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ChallengeParticipant findUnique
   */
  export type ChallengeParticipantFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChallengeParticipant
     */
    select?: ChallengeParticipantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChallengeParticipant
     */
    omit?: ChallengeParticipantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChallengeParticipantInclude<ExtArgs> | null
    /**
     * Filter, which ChallengeParticipant to fetch.
     */
    where: ChallengeParticipantWhereUniqueInput
  }

  /**
   * ChallengeParticipant findUniqueOrThrow
   */
  export type ChallengeParticipantFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChallengeParticipant
     */
    select?: ChallengeParticipantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChallengeParticipant
     */
    omit?: ChallengeParticipantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChallengeParticipantInclude<ExtArgs> | null
    /**
     * Filter, which ChallengeParticipant to fetch.
     */
    where: ChallengeParticipantWhereUniqueInput
  }

  /**
   * ChallengeParticipant findFirst
   */
  export type ChallengeParticipantFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChallengeParticipant
     */
    select?: ChallengeParticipantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChallengeParticipant
     */
    omit?: ChallengeParticipantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChallengeParticipantInclude<ExtArgs> | null
    /**
     * Filter, which ChallengeParticipant to fetch.
     */
    where?: ChallengeParticipantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChallengeParticipants to fetch.
     */
    orderBy?: ChallengeParticipantOrderByWithRelationInput | ChallengeParticipantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ChallengeParticipants.
     */
    cursor?: ChallengeParticipantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChallengeParticipants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChallengeParticipants.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ChallengeParticipants.
     */
    distinct?: ChallengeParticipantScalarFieldEnum | ChallengeParticipantScalarFieldEnum[]
  }

  /**
   * ChallengeParticipant findFirstOrThrow
   */
  export type ChallengeParticipantFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChallengeParticipant
     */
    select?: ChallengeParticipantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChallengeParticipant
     */
    omit?: ChallengeParticipantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChallengeParticipantInclude<ExtArgs> | null
    /**
     * Filter, which ChallengeParticipant to fetch.
     */
    where?: ChallengeParticipantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChallengeParticipants to fetch.
     */
    orderBy?: ChallengeParticipantOrderByWithRelationInput | ChallengeParticipantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ChallengeParticipants.
     */
    cursor?: ChallengeParticipantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChallengeParticipants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChallengeParticipants.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ChallengeParticipants.
     */
    distinct?: ChallengeParticipantScalarFieldEnum | ChallengeParticipantScalarFieldEnum[]
  }

  /**
   * ChallengeParticipant findMany
   */
  export type ChallengeParticipantFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChallengeParticipant
     */
    select?: ChallengeParticipantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChallengeParticipant
     */
    omit?: ChallengeParticipantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChallengeParticipantInclude<ExtArgs> | null
    /**
     * Filter, which ChallengeParticipants to fetch.
     */
    where?: ChallengeParticipantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChallengeParticipants to fetch.
     */
    orderBy?: ChallengeParticipantOrderByWithRelationInput | ChallengeParticipantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ChallengeParticipants.
     */
    cursor?: ChallengeParticipantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChallengeParticipants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChallengeParticipants.
     */
    skip?: number
    distinct?: ChallengeParticipantScalarFieldEnum | ChallengeParticipantScalarFieldEnum[]
  }

  /**
   * ChallengeParticipant create
   */
  export type ChallengeParticipantCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChallengeParticipant
     */
    select?: ChallengeParticipantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChallengeParticipant
     */
    omit?: ChallengeParticipantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChallengeParticipantInclude<ExtArgs> | null
    /**
     * The data needed to create a ChallengeParticipant.
     */
    data: XOR<ChallengeParticipantCreateInput, ChallengeParticipantUncheckedCreateInput>
  }

  /**
   * ChallengeParticipant createMany
   */
  export type ChallengeParticipantCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ChallengeParticipants.
     */
    data: ChallengeParticipantCreateManyInput | ChallengeParticipantCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ChallengeParticipant createManyAndReturn
   */
  export type ChallengeParticipantCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChallengeParticipant
     */
    select?: ChallengeParticipantSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ChallengeParticipant
     */
    omit?: ChallengeParticipantOmit<ExtArgs> | null
    /**
     * The data used to create many ChallengeParticipants.
     */
    data: ChallengeParticipantCreateManyInput | ChallengeParticipantCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChallengeParticipantIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ChallengeParticipant update
   */
  export type ChallengeParticipantUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChallengeParticipant
     */
    select?: ChallengeParticipantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChallengeParticipant
     */
    omit?: ChallengeParticipantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChallengeParticipantInclude<ExtArgs> | null
    /**
     * The data needed to update a ChallengeParticipant.
     */
    data: XOR<ChallengeParticipantUpdateInput, ChallengeParticipantUncheckedUpdateInput>
    /**
     * Choose, which ChallengeParticipant to update.
     */
    where: ChallengeParticipantWhereUniqueInput
  }

  /**
   * ChallengeParticipant updateMany
   */
  export type ChallengeParticipantUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ChallengeParticipants.
     */
    data: XOR<ChallengeParticipantUpdateManyMutationInput, ChallengeParticipantUncheckedUpdateManyInput>
    /**
     * Filter which ChallengeParticipants to update
     */
    where?: ChallengeParticipantWhereInput
    /**
     * Limit how many ChallengeParticipants to update.
     */
    limit?: number
  }

  /**
   * ChallengeParticipant updateManyAndReturn
   */
  export type ChallengeParticipantUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChallengeParticipant
     */
    select?: ChallengeParticipantSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ChallengeParticipant
     */
    omit?: ChallengeParticipantOmit<ExtArgs> | null
    /**
     * The data used to update ChallengeParticipants.
     */
    data: XOR<ChallengeParticipantUpdateManyMutationInput, ChallengeParticipantUncheckedUpdateManyInput>
    /**
     * Filter which ChallengeParticipants to update
     */
    where?: ChallengeParticipantWhereInput
    /**
     * Limit how many ChallengeParticipants to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChallengeParticipantIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ChallengeParticipant upsert
   */
  export type ChallengeParticipantUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChallengeParticipant
     */
    select?: ChallengeParticipantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChallengeParticipant
     */
    omit?: ChallengeParticipantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChallengeParticipantInclude<ExtArgs> | null
    /**
     * The filter to search for the ChallengeParticipant to update in case it exists.
     */
    where: ChallengeParticipantWhereUniqueInput
    /**
     * In case the ChallengeParticipant found by the `where` argument doesn't exist, create a new ChallengeParticipant with this data.
     */
    create: XOR<ChallengeParticipantCreateInput, ChallengeParticipantUncheckedCreateInput>
    /**
     * In case the ChallengeParticipant was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ChallengeParticipantUpdateInput, ChallengeParticipantUncheckedUpdateInput>
  }

  /**
   * ChallengeParticipant delete
   */
  export type ChallengeParticipantDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChallengeParticipant
     */
    select?: ChallengeParticipantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChallengeParticipant
     */
    omit?: ChallengeParticipantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChallengeParticipantInclude<ExtArgs> | null
    /**
     * Filter which ChallengeParticipant to delete.
     */
    where: ChallengeParticipantWhereUniqueInput
  }

  /**
   * ChallengeParticipant deleteMany
   */
  export type ChallengeParticipantDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ChallengeParticipants to delete
     */
    where?: ChallengeParticipantWhereInput
    /**
     * Limit how many ChallengeParticipants to delete.
     */
    limit?: number
  }

  /**
   * ChallengeParticipant without action
   */
  export type ChallengeParticipantDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChallengeParticipant
     */
    select?: ChallengeParticipantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChallengeParticipant
     */
    omit?: ChallengeParticipantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChallengeParticipantInclude<ExtArgs> | null
  }


  /**
   * Model MatchSession
   */

  export type AggregateMatchSession = {
    _count: MatchSessionCountAggregateOutputType | null
    _avg: MatchSessionAvgAggregateOutputType | null
    _sum: MatchSessionSumAggregateOutputType | null
    _min: MatchSessionMinAggregateOutputType | null
    _max: MatchSessionMaxAggregateOutputType | null
  }

  export type MatchSessionAvgAggregateOutputType = {
    durationSeconds: number | null
  }

  export type MatchSessionSumAggregateOutputType = {
    durationSeconds: number | null
  }

  export type MatchSessionMinAggregateOutputType = {
    id: string | null
    roomId: string | null
    matchType: string | null
    difficulty: string | null
    status: string | null
    startedAt: Date | null
    endedAt: Date | null
    durationSeconds: number | null
    winnerId: string | null
    resultSummary: string | null
    problemId: string | null
    createdAt: Date | null
  }

  export type MatchSessionMaxAggregateOutputType = {
    id: string | null
    roomId: string | null
    matchType: string | null
    difficulty: string | null
    status: string | null
    startedAt: Date | null
    endedAt: Date | null
    durationSeconds: number | null
    winnerId: string | null
    resultSummary: string | null
    problemId: string | null
    createdAt: Date | null
  }

  export type MatchSessionCountAggregateOutputType = {
    id: number
    roomId: number
    matchType: number
    difficulty: number
    status: number
    startedAt: number
    endedAt: number
    durationSeconds: number
    winnerId: number
    resultSummary: number
    problemId: number
    createdAt: number
    _all: number
  }


  export type MatchSessionAvgAggregateInputType = {
    durationSeconds?: true
  }

  export type MatchSessionSumAggregateInputType = {
    durationSeconds?: true
  }

  export type MatchSessionMinAggregateInputType = {
    id?: true
    roomId?: true
    matchType?: true
    difficulty?: true
    status?: true
    startedAt?: true
    endedAt?: true
    durationSeconds?: true
    winnerId?: true
    resultSummary?: true
    problemId?: true
    createdAt?: true
  }

  export type MatchSessionMaxAggregateInputType = {
    id?: true
    roomId?: true
    matchType?: true
    difficulty?: true
    status?: true
    startedAt?: true
    endedAt?: true
    durationSeconds?: true
    winnerId?: true
    resultSummary?: true
    problemId?: true
    createdAt?: true
  }

  export type MatchSessionCountAggregateInputType = {
    id?: true
    roomId?: true
    matchType?: true
    difficulty?: true
    status?: true
    startedAt?: true
    endedAt?: true
    durationSeconds?: true
    winnerId?: true
    resultSummary?: true
    problemId?: true
    createdAt?: true
    _all?: true
  }

  export type MatchSessionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MatchSession to aggregate.
     */
    where?: MatchSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MatchSessions to fetch.
     */
    orderBy?: MatchSessionOrderByWithRelationInput | MatchSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MatchSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MatchSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MatchSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned MatchSessions
    **/
    _count?: true | MatchSessionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: MatchSessionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: MatchSessionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MatchSessionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MatchSessionMaxAggregateInputType
  }

  export type GetMatchSessionAggregateType<T extends MatchSessionAggregateArgs> = {
        [P in keyof T & keyof AggregateMatchSession]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMatchSession[P]>
      : GetScalarType<T[P], AggregateMatchSession[P]>
  }




  export type MatchSessionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MatchSessionWhereInput
    orderBy?: MatchSessionOrderByWithAggregationInput | MatchSessionOrderByWithAggregationInput[]
    by: MatchSessionScalarFieldEnum[] | MatchSessionScalarFieldEnum
    having?: MatchSessionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MatchSessionCountAggregateInputType | true
    _avg?: MatchSessionAvgAggregateInputType
    _sum?: MatchSessionSumAggregateInputType
    _min?: MatchSessionMinAggregateInputType
    _max?: MatchSessionMaxAggregateInputType
  }

  export type MatchSessionGroupByOutputType = {
    id: string
    roomId: string | null
    matchType: string
    difficulty: string
    status: string
    startedAt: Date | null
    endedAt: Date | null
    durationSeconds: number
    winnerId: string | null
    resultSummary: string | null
    problemId: string | null
    createdAt: Date
    _count: MatchSessionCountAggregateOutputType | null
    _avg: MatchSessionAvgAggregateOutputType | null
    _sum: MatchSessionSumAggregateOutputType | null
    _min: MatchSessionMinAggregateOutputType | null
    _max: MatchSessionMaxAggregateOutputType | null
  }

  type GetMatchSessionGroupByPayload<T extends MatchSessionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MatchSessionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MatchSessionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MatchSessionGroupByOutputType[P]>
            : GetScalarType<T[P], MatchSessionGroupByOutputType[P]>
        }
      >
    >


  export type MatchSessionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    roomId?: boolean
    matchType?: boolean
    difficulty?: boolean
    status?: boolean
    startedAt?: boolean
    endedAt?: boolean
    durationSeconds?: boolean
    winnerId?: boolean
    resultSummary?: boolean
    problemId?: boolean
    createdAt?: boolean
    room?: boolean | MatchSession$roomArgs<ExtArgs>
    participants?: boolean | MatchSession$participantsArgs<ExtArgs>
    submissions?: boolean | MatchSession$submissionsArgs<ExtArgs>
    _count?: boolean | MatchSessionCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["matchSession"]>

  export type MatchSessionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    roomId?: boolean
    matchType?: boolean
    difficulty?: boolean
    status?: boolean
    startedAt?: boolean
    endedAt?: boolean
    durationSeconds?: boolean
    winnerId?: boolean
    resultSummary?: boolean
    problemId?: boolean
    createdAt?: boolean
    room?: boolean | MatchSession$roomArgs<ExtArgs>
  }, ExtArgs["result"]["matchSession"]>

  export type MatchSessionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    roomId?: boolean
    matchType?: boolean
    difficulty?: boolean
    status?: boolean
    startedAt?: boolean
    endedAt?: boolean
    durationSeconds?: boolean
    winnerId?: boolean
    resultSummary?: boolean
    problemId?: boolean
    createdAt?: boolean
    room?: boolean | MatchSession$roomArgs<ExtArgs>
  }, ExtArgs["result"]["matchSession"]>

  export type MatchSessionSelectScalar = {
    id?: boolean
    roomId?: boolean
    matchType?: boolean
    difficulty?: boolean
    status?: boolean
    startedAt?: boolean
    endedAt?: boolean
    durationSeconds?: boolean
    winnerId?: boolean
    resultSummary?: boolean
    problemId?: boolean
    createdAt?: boolean
  }

  export type MatchSessionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "roomId" | "matchType" | "difficulty" | "status" | "startedAt" | "endedAt" | "durationSeconds" | "winnerId" | "resultSummary" | "problemId" | "createdAt", ExtArgs["result"]["matchSession"]>
  export type MatchSessionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    room?: boolean | MatchSession$roomArgs<ExtArgs>
    participants?: boolean | MatchSession$participantsArgs<ExtArgs>
    submissions?: boolean | MatchSession$submissionsArgs<ExtArgs>
    _count?: boolean | MatchSessionCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type MatchSessionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    room?: boolean | MatchSession$roomArgs<ExtArgs>
  }
  export type MatchSessionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    room?: boolean | MatchSession$roomArgs<ExtArgs>
  }

  export type $MatchSessionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "MatchSession"
    objects: {
      room: Prisma.$ChallengeRoomPayload<ExtArgs> | null
      participants: Prisma.$MatchParticipantPayload<ExtArgs>[]
      submissions: Prisma.$ChallengeSubmissionPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      roomId: string | null
      matchType: string
      difficulty: string
      status: string
      startedAt: Date | null
      endedAt: Date | null
      durationSeconds: number
      winnerId: string | null
      resultSummary: string | null
      problemId: string | null
      createdAt: Date
    }, ExtArgs["result"]["matchSession"]>
    composites: {}
  }

  type MatchSessionGetPayload<S extends boolean | null | undefined | MatchSessionDefaultArgs> = $Result.GetResult<Prisma.$MatchSessionPayload, S>

  type MatchSessionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<MatchSessionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: MatchSessionCountAggregateInputType | true
    }

  export interface MatchSessionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['MatchSession'], meta: { name: 'MatchSession' } }
    /**
     * Find zero or one MatchSession that matches the filter.
     * @param {MatchSessionFindUniqueArgs} args - Arguments to find a MatchSession
     * @example
     * // Get one MatchSession
     * const matchSession = await prisma.matchSession.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MatchSessionFindUniqueArgs>(args: SelectSubset<T, MatchSessionFindUniqueArgs<ExtArgs>>): Prisma__MatchSessionClient<$Result.GetResult<Prisma.$MatchSessionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one MatchSession that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {MatchSessionFindUniqueOrThrowArgs} args - Arguments to find a MatchSession
     * @example
     * // Get one MatchSession
     * const matchSession = await prisma.matchSession.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MatchSessionFindUniqueOrThrowArgs>(args: SelectSubset<T, MatchSessionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MatchSessionClient<$Result.GetResult<Prisma.$MatchSessionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first MatchSession that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MatchSessionFindFirstArgs} args - Arguments to find a MatchSession
     * @example
     * // Get one MatchSession
     * const matchSession = await prisma.matchSession.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MatchSessionFindFirstArgs>(args?: SelectSubset<T, MatchSessionFindFirstArgs<ExtArgs>>): Prisma__MatchSessionClient<$Result.GetResult<Prisma.$MatchSessionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first MatchSession that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MatchSessionFindFirstOrThrowArgs} args - Arguments to find a MatchSession
     * @example
     * // Get one MatchSession
     * const matchSession = await prisma.matchSession.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MatchSessionFindFirstOrThrowArgs>(args?: SelectSubset<T, MatchSessionFindFirstOrThrowArgs<ExtArgs>>): Prisma__MatchSessionClient<$Result.GetResult<Prisma.$MatchSessionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more MatchSessions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MatchSessionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all MatchSessions
     * const matchSessions = await prisma.matchSession.findMany()
     * 
     * // Get first 10 MatchSessions
     * const matchSessions = await prisma.matchSession.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const matchSessionWithIdOnly = await prisma.matchSession.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MatchSessionFindManyArgs>(args?: SelectSubset<T, MatchSessionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MatchSessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a MatchSession.
     * @param {MatchSessionCreateArgs} args - Arguments to create a MatchSession.
     * @example
     * // Create one MatchSession
     * const MatchSession = await prisma.matchSession.create({
     *   data: {
     *     // ... data to create a MatchSession
     *   }
     * })
     * 
     */
    create<T extends MatchSessionCreateArgs>(args: SelectSubset<T, MatchSessionCreateArgs<ExtArgs>>): Prisma__MatchSessionClient<$Result.GetResult<Prisma.$MatchSessionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many MatchSessions.
     * @param {MatchSessionCreateManyArgs} args - Arguments to create many MatchSessions.
     * @example
     * // Create many MatchSessions
     * const matchSession = await prisma.matchSession.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MatchSessionCreateManyArgs>(args?: SelectSubset<T, MatchSessionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many MatchSessions and returns the data saved in the database.
     * @param {MatchSessionCreateManyAndReturnArgs} args - Arguments to create many MatchSessions.
     * @example
     * // Create many MatchSessions
     * const matchSession = await prisma.matchSession.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many MatchSessions and only return the `id`
     * const matchSessionWithIdOnly = await prisma.matchSession.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends MatchSessionCreateManyAndReturnArgs>(args?: SelectSubset<T, MatchSessionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MatchSessionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a MatchSession.
     * @param {MatchSessionDeleteArgs} args - Arguments to delete one MatchSession.
     * @example
     * // Delete one MatchSession
     * const MatchSession = await prisma.matchSession.delete({
     *   where: {
     *     // ... filter to delete one MatchSession
     *   }
     * })
     * 
     */
    delete<T extends MatchSessionDeleteArgs>(args: SelectSubset<T, MatchSessionDeleteArgs<ExtArgs>>): Prisma__MatchSessionClient<$Result.GetResult<Prisma.$MatchSessionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one MatchSession.
     * @param {MatchSessionUpdateArgs} args - Arguments to update one MatchSession.
     * @example
     * // Update one MatchSession
     * const matchSession = await prisma.matchSession.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MatchSessionUpdateArgs>(args: SelectSubset<T, MatchSessionUpdateArgs<ExtArgs>>): Prisma__MatchSessionClient<$Result.GetResult<Prisma.$MatchSessionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more MatchSessions.
     * @param {MatchSessionDeleteManyArgs} args - Arguments to filter MatchSessions to delete.
     * @example
     * // Delete a few MatchSessions
     * const { count } = await prisma.matchSession.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MatchSessionDeleteManyArgs>(args?: SelectSubset<T, MatchSessionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more MatchSessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MatchSessionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many MatchSessions
     * const matchSession = await prisma.matchSession.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MatchSessionUpdateManyArgs>(args: SelectSubset<T, MatchSessionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more MatchSessions and returns the data updated in the database.
     * @param {MatchSessionUpdateManyAndReturnArgs} args - Arguments to update many MatchSessions.
     * @example
     * // Update many MatchSessions
     * const matchSession = await prisma.matchSession.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more MatchSessions and only return the `id`
     * const matchSessionWithIdOnly = await prisma.matchSession.updateManyAndReturn({
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
    updateManyAndReturn<T extends MatchSessionUpdateManyAndReturnArgs>(args: SelectSubset<T, MatchSessionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MatchSessionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one MatchSession.
     * @param {MatchSessionUpsertArgs} args - Arguments to update or create a MatchSession.
     * @example
     * // Update or create a MatchSession
     * const matchSession = await prisma.matchSession.upsert({
     *   create: {
     *     // ... data to create a MatchSession
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the MatchSession we want to update
     *   }
     * })
     */
    upsert<T extends MatchSessionUpsertArgs>(args: SelectSubset<T, MatchSessionUpsertArgs<ExtArgs>>): Prisma__MatchSessionClient<$Result.GetResult<Prisma.$MatchSessionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of MatchSessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MatchSessionCountArgs} args - Arguments to filter MatchSessions to count.
     * @example
     * // Count the number of MatchSessions
     * const count = await prisma.matchSession.count({
     *   where: {
     *     // ... the filter for the MatchSessions we want to count
     *   }
     * })
    **/
    count<T extends MatchSessionCountArgs>(
      args?: Subset<T, MatchSessionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MatchSessionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a MatchSession.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MatchSessionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends MatchSessionAggregateArgs>(args: Subset<T, MatchSessionAggregateArgs>): Prisma.PrismaPromise<GetMatchSessionAggregateType<T>>

    /**
     * Group by MatchSession.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MatchSessionGroupByArgs} args - Group by arguments.
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
      T extends MatchSessionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MatchSessionGroupByArgs['orderBy'] }
        : { orderBy?: MatchSessionGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, MatchSessionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMatchSessionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the MatchSession model
   */
  readonly fields: MatchSessionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for MatchSession.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MatchSessionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    room<T extends MatchSession$roomArgs<ExtArgs> = {}>(args?: Subset<T, MatchSession$roomArgs<ExtArgs>>): Prisma__ChallengeRoomClient<$Result.GetResult<Prisma.$ChallengeRoomPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    participants<T extends MatchSession$participantsArgs<ExtArgs> = {}>(args?: Subset<T, MatchSession$participantsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MatchParticipantPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    submissions<T extends MatchSession$submissionsArgs<ExtArgs> = {}>(args?: Subset<T, MatchSession$submissionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChallengeSubmissionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the MatchSession model
   */
  interface MatchSessionFieldRefs {
    readonly id: FieldRef<"MatchSession", 'String'>
    readonly roomId: FieldRef<"MatchSession", 'String'>
    readonly matchType: FieldRef<"MatchSession", 'String'>
    readonly difficulty: FieldRef<"MatchSession", 'String'>
    readonly status: FieldRef<"MatchSession", 'String'>
    readonly startedAt: FieldRef<"MatchSession", 'DateTime'>
    readonly endedAt: FieldRef<"MatchSession", 'DateTime'>
    readonly durationSeconds: FieldRef<"MatchSession", 'Int'>
    readonly winnerId: FieldRef<"MatchSession", 'String'>
    readonly resultSummary: FieldRef<"MatchSession", 'String'>
    readonly problemId: FieldRef<"MatchSession", 'String'>
    readonly createdAt: FieldRef<"MatchSession", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * MatchSession findUnique
   */
  export type MatchSessionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MatchSession
     */
    select?: MatchSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MatchSession
     */
    omit?: MatchSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchSessionInclude<ExtArgs> | null
    /**
     * Filter, which MatchSession to fetch.
     */
    where: MatchSessionWhereUniqueInput
  }

  /**
   * MatchSession findUniqueOrThrow
   */
  export type MatchSessionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MatchSession
     */
    select?: MatchSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MatchSession
     */
    omit?: MatchSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchSessionInclude<ExtArgs> | null
    /**
     * Filter, which MatchSession to fetch.
     */
    where: MatchSessionWhereUniqueInput
  }

  /**
   * MatchSession findFirst
   */
  export type MatchSessionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MatchSession
     */
    select?: MatchSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MatchSession
     */
    omit?: MatchSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchSessionInclude<ExtArgs> | null
    /**
     * Filter, which MatchSession to fetch.
     */
    where?: MatchSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MatchSessions to fetch.
     */
    orderBy?: MatchSessionOrderByWithRelationInput | MatchSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MatchSessions.
     */
    cursor?: MatchSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MatchSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MatchSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MatchSessions.
     */
    distinct?: MatchSessionScalarFieldEnum | MatchSessionScalarFieldEnum[]
  }

  /**
   * MatchSession findFirstOrThrow
   */
  export type MatchSessionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MatchSession
     */
    select?: MatchSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MatchSession
     */
    omit?: MatchSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchSessionInclude<ExtArgs> | null
    /**
     * Filter, which MatchSession to fetch.
     */
    where?: MatchSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MatchSessions to fetch.
     */
    orderBy?: MatchSessionOrderByWithRelationInput | MatchSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MatchSessions.
     */
    cursor?: MatchSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MatchSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MatchSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MatchSessions.
     */
    distinct?: MatchSessionScalarFieldEnum | MatchSessionScalarFieldEnum[]
  }

  /**
   * MatchSession findMany
   */
  export type MatchSessionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MatchSession
     */
    select?: MatchSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MatchSession
     */
    omit?: MatchSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchSessionInclude<ExtArgs> | null
    /**
     * Filter, which MatchSessions to fetch.
     */
    where?: MatchSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MatchSessions to fetch.
     */
    orderBy?: MatchSessionOrderByWithRelationInput | MatchSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing MatchSessions.
     */
    cursor?: MatchSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MatchSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MatchSessions.
     */
    skip?: number
    distinct?: MatchSessionScalarFieldEnum | MatchSessionScalarFieldEnum[]
  }

  /**
   * MatchSession create
   */
  export type MatchSessionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MatchSession
     */
    select?: MatchSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MatchSession
     */
    omit?: MatchSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchSessionInclude<ExtArgs> | null
    /**
     * The data needed to create a MatchSession.
     */
    data?: XOR<MatchSessionCreateInput, MatchSessionUncheckedCreateInput>
  }

  /**
   * MatchSession createMany
   */
  export type MatchSessionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many MatchSessions.
     */
    data: MatchSessionCreateManyInput | MatchSessionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * MatchSession createManyAndReturn
   */
  export type MatchSessionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MatchSession
     */
    select?: MatchSessionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the MatchSession
     */
    omit?: MatchSessionOmit<ExtArgs> | null
    /**
     * The data used to create many MatchSessions.
     */
    data: MatchSessionCreateManyInput | MatchSessionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchSessionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * MatchSession update
   */
  export type MatchSessionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MatchSession
     */
    select?: MatchSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MatchSession
     */
    omit?: MatchSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchSessionInclude<ExtArgs> | null
    /**
     * The data needed to update a MatchSession.
     */
    data: XOR<MatchSessionUpdateInput, MatchSessionUncheckedUpdateInput>
    /**
     * Choose, which MatchSession to update.
     */
    where: MatchSessionWhereUniqueInput
  }

  /**
   * MatchSession updateMany
   */
  export type MatchSessionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update MatchSessions.
     */
    data: XOR<MatchSessionUpdateManyMutationInput, MatchSessionUncheckedUpdateManyInput>
    /**
     * Filter which MatchSessions to update
     */
    where?: MatchSessionWhereInput
    /**
     * Limit how many MatchSessions to update.
     */
    limit?: number
  }

  /**
   * MatchSession updateManyAndReturn
   */
  export type MatchSessionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MatchSession
     */
    select?: MatchSessionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the MatchSession
     */
    omit?: MatchSessionOmit<ExtArgs> | null
    /**
     * The data used to update MatchSessions.
     */
    data: XOR<MatchSessionUpdateManyMutationInput, MatchSessionUncheckedUpdateManyInput>
    /**
     * Filter which MatchSessions to update
     */
    where?: MatchSessionWhereInput
    /**
     * Limit how many MatchSessions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchSessionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * MatchSession upsert
   */
  export type MatchSessionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MatchSession
     */
    select?: MatchSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MatchSession
     */
    omit?: MatchSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchSessionInclude<ExtArgs> | null
    /**
     * The filter to search for the MatchSession to update in case it exists.
     */
    where: MatchSessionWhereUniqueInput
    /**
     * In case the MatchSession found by the `where` argument doesn't exist, create a new MatchSession with this data.
     */
    create: XOR<MatchSessionCreateInput, MatchSessionUncheckedCreateInput>
    /**
     * In case the MatchSession was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MatchSessionUpdateInput, MatchSessionUncheckedUpdateInput>
  }

  /**
   * MatchSession delete
   */
  export type MatchSessionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MatchSession
     */
    select?: MatchSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MatchSession
     */
    omit?: MatchSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchSessionInclude<ExtArgs> | null
    /**
     * Filter which MatchSession to delete.
     */
    where: MatchSessionWhereUniqueInput
  }

  /**
   * MatchSession deleteMany
   */
  export type MatchSessionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MatchSessions to delete
     */
    where?: MatchSessionWhereInput
    /**
     * Limit how many MatchSessions to delete.
     */
    limit?: number
  }

  /**
   * MatchSession.room
   */
  export type MatchSession$roomArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChallengeRoom
     */
    select?: ChallengeRoomSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChallengeRoom
     */
    omit?: ChallengeRoomOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChallengeRoomInclude<ExtArgs> | null
    where?: ChallengeRoomWhereInput
  }

  /**
   * MatchSession.participants
   */
  export type MatchSession$participantsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MatchParticipant
     */
    select?: MatchParticipantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MatchParticipant
     */
    omit?: MatchParticipantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchParticipantInclude<ExtArgs> | null
    where?: MatchParticipantWhereInput
    orderBy?: MatchParticipantOrderByWithRelationInput | MatchParticipantOrderByWithRelationInput[]
    cursor?: MatchParticipantWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MatchParticipantScalarFieldEnum | MatchParticipantScalarFieldEnum[]
  }

  /**
   * MatchSession.submissions
   */
  export type MatchSession$submissionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChallengeSubmission
     */
    select?: ChallengeSubmissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChallengeSubmission
     */
    omit?: ChallengeSubmissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChallengeSubmissionInclude<ExtArgs> | null
    where?: ChallengeSubmissionWhereInput
    orderBy?: ChallengeSubmissionOrderByWithRelationInput | ChallengeSubmissionOrderByWithRelationInput[]
    cursor?: ChallengeSubmissionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ChallengeSubmissionScalarFieldEnum | ChallengeSubmissionScalarFieldEnum[]
  }

  /**
   * MatchSession without action
   */
  export type MatchSessionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MatchSession
     */
    select?: MatchSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MatchSession
     */
    omit?: MatchSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchSessionInclude<ExtArgs> | null
  }


  /**
   * Model MatchParticipant
   */

  export type AggregateMatchParticipant = {
    _count: MatchParticipantCountAggregateOutputType | null
    _avg: MatchParticipantAvgAggregateOutputType | null
    _sum: MatchParticipantSumAggregateOutputType | null
    _min: MatchParticipantMinAggregateOutputType | null
    _max: MatchParticipantMaxAggregateOutputType | null
  }

  export type MatchParticipantAvgAggregateOutputType = {
    score: number | null
    problemsSolved: number | null
    passedTests: number | null
    totalTests: number | null
    ratingBefore: number | null
    ratingAfter: number | null
    xpEarned: number | null
  }

  export type MatchParticipantSumAggregateOutputType = {
    score: number | null
    problemsSolved: number | null
    passedTests: number | null
    totalTests: number | null
    ratingBefore: number | null
    ratingAfter: number | null
    xpEarned: number | null
  }

  export type MatchParticipantMinAggregateOutputType = {
    id: string | null
    matchId: string | null
    userId: string | null
    userName: string | null
    userAvatar: string | null
    score: number | null
    problemsSolved: number | null
    passedTests: number | null
    totalTests: number | null
    ratingBefore: number | null
    ratingAfter: number | null
    xpEarned: number | null
    status: string | null
    submittedAt: Date | null
  }

  export type MatchParticipantMaxAggregateOutputType = {
    id: string | null
    matchId: string | null
    userId: string | null
    userName: string | null
    userAvatar: string | null
    score: number | null
    problemsSolved: number | null
    passedTests: number | null
    totalTests: number | null
    ratingBefore: number | null
    ratingAfter: number | null
    xpEarned: number | null
    status: string | null
    submittedAt: Date | null
  }

  export type MatchParticipantCountAggregateOutputType = {
    id: number
    matchId: number
    userId: number
    userName: number
    userAvatar: number
    score: number
    problemsSolved: number
    passedTests: number
    totalTests: number
    ratingBefore: number
    ratingAfter: number
    xpEarned: number
    status: number
    submittedAt: number
    _all: number
  }


  export type MatchParticipantAvgAggregateInputType = {
    score?: true
    problemsSolved?: true
    passedTests?: true
    totalTests?: true
    ratingBefore?: true
    ratingAfter?: true
    xpEarned?: true
  }

  export type MatchParticipantSumAggregateInputType = {
    score?: true
    problemsSolved?: true
    passedTests?: true
    totalTests?: true
    ratingBefore?: true
    ratingAfter?: true
    xpEarned?: true
  }

  export type MatchParticipantMinAggregateInputType = {
    id?: true
    matchId?: true
    userId?: true
    userName?: true
    userAvatar?: true
    score?: true
    problemsSolved?: true
    passedTests?: true
    totalTests?: true
    ratingBefore?: true
    ratingAfter?: true
    xpEarned?: true
    status?: true
    submittedAt?: true
  }

  export type MatchParticipantMaxAggregateInputType = {
    id?: true
    matchId?: true
    userId?: true
    userName?: true
    userAvatar?: true
    score?: true
    problemsSolved?: true
    passedTests?: true
    totalTests?: true
    ratingBefore?: true
    ratingAfter?: true
    xpEarned?: true
    status?: true
    submittedAt?: true
  }

  export type MatchParticipantCountAggregateInputType = {
    id?: true
    matchId?: true
    userId?: true
    userName?: true
    userAvatar?: true
    score?: true
    problemsSolved?: true
    passedTests?: true
    totalTests?: true
    ratingBefore?: true
    ratingAfter?: true
    xpEarned?: true
    status?: true
    submittedAt?: true
    _all?: true
  }

  export type MatchParticipantAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MatchParticipant to aggregate.
     */
    where?: MatchParticipantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MatchParticipants to fetch.
     */
    orderBy?: MatchParticipantOrderByWithRelationInput | MatchParticipantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MatchParticipantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MatchParticipants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MatchParticipants.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned MatchParticipants
    **/
    _count?: true | MatchParticipantCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: MatchParticipantAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: MatchParticipantSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MatchParticipantMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MatchParticipantMaxAggregateInputType
  }

  export type GetMatchParticipantAggregateType<T extends MatchParticipantAggregateArgs> = {
        [P in keyof T & keyof AggregateMatchParticipant]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMatchParticipant[P]>
      : GetScalarType<T[P], AggregateMatchParticipant[P]>
  }




  export type MatchParticipantGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MatchParticipantWhereInput
    orderBy?: MatchParticipantOrderByWithAggregationInput | MatchParticipantOrderByWithAggregationInput[]
    by: MatchParticipantScalarFieldEnum[] | MatchParticipantScalarFieldEnum
    having?: MatchParticipantScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MatchParticipantCountAggregateInputType | true
    _avg?: MatchParticipantAvgAggregateInputType
    _sum?: MatchParticipantSumAggregateInputType
    _min?: MatchParticipantMinAggregateInputType
    _max?: MatchParticipantMaxAggregateInputType
  }

  export type MatchParticipantGroupByOutputType = {
    id: string
    matchId: string
    userId: string
    userName: string
    userAvatar: string | null
    score: number
    problemsSolved: number
    passedTests: number
    totalTests: number
    ratingBefore: number
    ratingAfter: number
    xpEarned: number
    status: string
    submittedAt: Date | null
    _count: MatchParticipantCountAggregateOutputType | null
    _avg: MatchParticipantAvgAggregateOutputType | null
    _sum: MatchParticipantSumAggregateOutputType | null
    _min: MatchParticipantMinAggregateOutputType | null
    _max: MatchParticipantMaxAggregateOutputType | null
  }

  type GetMatchParticipantGroupByPayload<T extends MatchParticipantGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MatchParticipantGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MatchParticipantGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MatchParticipantGroupByOutputType[P]>
            : GetScalarType<T[P], MatchParticipantGroupByOutputType[P]>
        }
      >
    >


  export type MatchParticipantSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    matchId?: boolean
    userId?: boolean
    userName?: boolean
    userAvatar?: boolean
    score?: boolean
    problemsSolved?: boolean
    passedTests?: boolean
    totalTests?: boolean
    ratingBefore?: boolean
    ratingAfter?: boolean
    xpEarned?: boolean
    status?: boolean
    submittedAt?: boolean
    match?: boolean | MatchSessionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["matchParticipant"]>

  export type MatchParticipantSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    matchId?: boolean
    userId?: boolean
    userName?: boolean
    userAvatar?: boolean
    score?: boolean
    problemsSolved?: boolean
    passedTests?: boolean
    totalTests?: boolean
    ratingBefore?: boolean
    ratingAfter?: boolean
    xpEarned?: boolean
    status?: boolean
    submittedAt?: boolean
    match?: boolean | MatchSessionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["matchParticipant"]>

  export type MatchParticipantSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    matchId?: boolean
    userId?: boolean
    userName?: boolean
    userAvatar?: boolean
    score?: boolean
    problemsSolved?: boolean
    passedTests?: boolean
    totalTests?: boolean
    ratingBefore?: boolean
    ratingAfter?: boolean
    xpEarned?: boolean
    status?: boolean
    submittedAt?: boolean
    match?: boolean | MatchSessionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["matchParticipant"]>

  export type MatchParticipantSelectScalar = {
    id?: boolean
    matchId?: boolean
    userId?: boolean
    userName?: boolean
    userAvatar?: boolean
    score?: boolean
    problemsSolved?: boolean
    passedTests?: boolean
    totalTests?: boolean
    ratingBefore?: boolean
    ratingAfter?: boolean
    xpEarned?: boolean
    status?: boolean
    submittedAt?: boolean
  }

  export type MatchParticipantOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "matchId" | "userId" | "userName" | "userAvatar" | "score" | "problemsSolved" | "passedTests" | "totalTests" | "ratingBefore" | "ratingAfter" | "xpEarned" | "status" | "submittedAt", ExtArgs["result"]["matchParticipant"]>
  export type MatchParticipantInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    match?: boolean | MatchSessionDefaultArgs<ExtArgs>
  }
  export type MatchParticipantIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    match?: boolean | MatchSessionDefaultArgs<ExtArgs>
  }
  export type MatchParticipantIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    match?: boolean | MatchSessionDefaultArgs<ExtArgs>
  }

  export type $MatchParticipantPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "MatchParticipant"
    objects: {
      match: Prisma.$MatchSessionPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      matchId: string
      userId: string
      userName: string
      userAvatar: string | null
      score: number
      problemsSolved: number
      passedTests: number
      totalTests: number
      ratingBefore: number
      ratingAfter: number
      xpEarned: number
      status: string
      submittedAt: Date | null
    }, ExtArgs["result"]["matchParticipant"]>
    composites: {}
  }

  type MatchParticipantGetPayload<S extends boolean | null | undefined | MatchParticipantDefaultArgs> = $Result.GetResult<Prisma.$MatchParticipantPayload, S>

  type MatchParticipantCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<MatchParticipantFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: MatchParticipantCountAggregateInputType | true
    }

  export interface MatchParticipantDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['MatchParticipant'], meta: { name: 'MatchParticipant' } }
    /**
     * Find zero or one MatchParticipant that matches the filter.
     * @param {MatchParticipantFindUniqueArgs} args - Arguments to find a MatchParticipant
     * @example
     * // Get one MatchParticipant
     * const matchParticipant = await prisma.matchParticipant.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MatchParticipantFindUniqueArgs>(args: SelectSubset<T, MatchParticipantFindUniqueArgs<ExtArgs>>): Prisma__MatchParticipantClient<$Result.GetResult<Prisma.$MatchParticipantPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one MatchParticipant that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {MatchParticipantFindUniqueOrThrowArgs} args - Arguments to find a MatchParticipant
     * @example
     * // Get one MatchParticipant
     * const matchParticipant = await prisma.matchParticipant.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MatchParticipantFindUniqueOrThrowArgs>(args: SelectSubset<T, MatchParticipantFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MatchParticipantClient<$Result.GetResult<Prisma.$MatchParticipantPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first MatchParticipant that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MatchParticipantFindFirstArgs} args - Arguments to find a MatchParticipant
     * @example
     * // Get one MatchParticipant
     * const matchParticipant = await prisma.matchParticipant.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MatchParticipantFindFirstArgs>(args?: SelectSubset<T, MatchParticipantFindFirstArgs<ExtArgs>>): Prisma__MatchParticipantClient<$Result.GetResult<Prisma.$MatchParticipantPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first MatchParticipant that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MatchParticipantFindFirstOrThrowArgs} args - Arguments to find a MatchParticipant
     * @example
     * // Get one MatchParticipant
     * const matchParticipant = await prisma.matchParticipant.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MatchParticipantFindFirstOrThrowArgs>(args?: SelectSubset<T, MatchParticipantFindFirstOrThrowArgs<ExtArgs>>): Prisma__MatchParticipantClient<$Result.GetResult<Prisma.$MatchParticipantPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more MatchParticipants that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MatchParticipantFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all MatchParticipants
     * const matchParticipants = await prisma.matchParticipant.findMany()
     * 
     * // Get first 10 MatchParticipants
     * const matchParticipants = await prisma.matchParticipant.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const matchParticipantWithIdOnly = await prisma.matchParticipant.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MatchParticipantFindManyArgs>(args?: SelectSubset<T, MatchParticipantFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MatchParticipantPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a MatchParticipant.
     * @param {MatchParticipantCreateArgs} args - Arguments to create a MatchParticipant.
     * @example
     * // Create one MatchParticipant
     * const MatchParticipant = await prisma.matchParticipant.create({
     *   data: {
     *     // ... data to create a MatchParticipant
     *   }
     * })
     * 
     */
    create<T extends MatchParticipantCreateArgs>(args: SelectSubset<T, MatchParticipantCreateArgs<ExtArgs>>): Prisma__MatchParticipantClient<$Result.GetResult<Prisma.$MatchParticipantPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many MatchParticipants.
     * @param {MatchParticipantCreateManyArgs} args - Arguments to create many MatchParticipants.
     * @example
     * // Create many MatchParticipants
     * const matchParticipant = await prisma.matchParticipant.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MatchParticipantCreateManyArgs>(args?: SelectSubset<T, MatchParticipantCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many MatchParticipants and returns the data saved in the database.
     * @param {MatchParticipantCreateManyAndReturnArgs} args - Arguments to create many MatchParticipants.
     * @example
     * // Create many MatchParticipants
     * const matchParticipant = await prisma.matchParticipant.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many MatchParticipants and only return the `id`
     * const matchParticipantWithIdOnly = await prisma.matchParticipant.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends MatchParticipantCreateManyAndReturnArgs>(args?: SelectSubset<T, MatchParticipantCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MatchParticipantPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a MatchParticipant.
     * @param {MatchParticipantDeleteArgs} args - Arguments to delete one MatchParticipant.
     * @example
     * // Delete one MatchParticipant
     * const MatchParticipant = await prisma.matchParticipant.delete({
     *   where: {
     *     // ... filter to delete one MatchParticipant
     *   }
     * })
     * 
     */
    delete<T extends MatchParticipantDeleteArgs>(args: SelectSubset<T, MatchParticipantDeleteArgs<ExtArgs>>): Prisma__MatchParticipantClient<$Result.GetResult<Prisma.$MatchParticipantPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one MatchParticipant.
     * @param {MatchParticipantUpdateArgs} args - Arguments to update one MatchParticipant.
     * @example
     * // Update one MatchParticipant
     * const matchParticipant = await prisma.matchParticipant.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MatchParticipantUpdateArgs>(args: SelectSubset<T, MatchParticipantUpdateArgs<ExtArgs>>): Prisma__MatchParticipantClient<$Result.GetResult<Prisma.$MatchParticipantPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more MatchParticipants.
     * @param {MatchParticipantDeleteManyArgs} args - Arguments to filter MatchParticipants to delete.
     * @example
     * // Delete a few MatchParticipants
     * const { count } = await prisma.matchParticipant.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MatchParticipantDeleteManyArgs>(args?: SelectSubset<T, MatchParticipantDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more MatchParticipants.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MatchParticipantUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many MatchParticipants
     * const matchParticipant = await prisma.matchParticipant.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MatchParticipantUpdateManyArgs>(args: SelectSubset<T, MatchParticipantUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more MatchParticipants and returns the data updated in the database.
     * @param {MatchParticipantUpdateManyAndReturnArgs} args - Arguments to update many MatchParticipants.
     * @example
     * // Update many MatchParticipants
     * const matchParticipant = await prisma.matchParticipant.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more MatchParticipants and only return the `id`
     * const matchParticipantWithIdOnly = await prisma.matchParticipant.updateManyAndReturn({
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
    updateManyAndReturn<T extends MatchParticipantUpdateManyAndReturnArgs>(args: SelectSubset<T, MatchParticipantUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MatchParticipantPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one MatchParticipant.
     * @param {MatchParticipantUpsertArgs} args - Arguments to update or create a MatchParticipant.
     * @example
     * // Update or create a MatchParticipant
     * const matchParticipant = await prisma.matchParticipant.upsert({
     *   create: {
     *     // ... data to create a MatchParticipant
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the MatchParticipant we want to update
     *   }
     * })
     */
    upsert<T extends MatchParticipantUpsertArgs>(args: SelectSubset<T, MatchParticipantUpsertArgs<ExtArgs>>): Prisma__MatchParticipantClient<$Result.GetResult<Prisma.$MatchParticipantPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of MatchParticipants.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MatchParticipantCountArgs} args - Arguments to filter MatchParticipants to count.
     * @example
     * // Count the number of MatchParticipants
     * const count = await prisma.matchParticipant.count({
     *   where: {
     *     // ... the filter for the MatchParticipants we want to count
     *   }
     * })
    **/
    count<T extends MatchParticipantCountArgs>(
      args?: Subset<T, MatchParticipantCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MatchParticipantCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a MatchParticipant.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MatchParticipantAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends MatchParticipantAggregateArgs>(args: Subset<T, MatchParticipantAggregateArgs>): Prisma.PrismaPromise<GetMatchParticipantAggregateType<T>>

    /**
     * Group by MatchParticipant.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MatchParticipantGroupByArgs} args - Group by arguments.
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
      T extends MatchParticipantGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MatchParticipantGroupByArgs['orderBy'] }
        : { orderBy?: MatchParticipantGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, MatchParticipantGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMatchParticipantGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the MatchParticipant model
   */
  readonly fields: MatchParticipantFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for MatchParticipant.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MatchParticipantClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    match<T extends MatchSessionDefaultArgs<ExtArgs> = {}>(args?: Subset<T, MatchSessionDefaultArgs<ExtArgs>>): Prisma__MatchSessionClient<$Result.GetResult<Prisma.$MatchSessionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the MatchParticipant model
   */
  interface MatchParticipantFieldRefs {
    readonly id: FieldRef<"MatchParticipant", 'String'>
    readonly matchId: FieldRef<"MatchParticipant", 'String'>
    readonly userId: FieldRef<"MatchParticipant", 'String'>
    readonly userName: FieldRef<"MatchParticipant", 'String'>
    readonly userAvatar: FieldRef<"MatchParticipant", 'String'>
    readonly score: FieldRef<"MatchParticipant", 'Int'>
    readonly problemsSolved: FieldRef<"MatchParticipant", 'Int'>
    readonly passedTests: FieldRef<"MatchParticipant", 'Int'>
    readonly totalTests: FieldRef<"MatchParticipant", 'Int'>
    readonly ratingBefore: FieldRef<"MatchParticipant", 'Int'>
    readonly ratingAfter: FieldRef<"MatchParticipant", 'Int'>
    readonly xpEarned: FieldRef<"MatchParticipant", 'Int'>
    readonly status: FieldRef<"MatchParticipant", 'String'>
    readonly submittedAt: FieldRef<"MatchParticipant", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * MatchParticipant findUnique
   */
  export type MatchParticipantFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MatchParticipant
     */
    select?: MatchParticipantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MatchParticipant
     */
    omit?: MatchParticipantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchParticipantInclude<ExtArgs> | null
    /**
     * Filter, which MatchParticipant to fetch.
     */
    where: MatchParticipantWhereUniqueInput
  }

  /**
   * MatchParticipant findUniqueOrThrow
   */
  export type MatchParticipantFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MatchParticipant
     */
    select?: MatchParticipantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MatchParticipant
     */
    omit?: MatchParticipantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchParticipantInclude<ExtArgs> | null
    /**
     * Filter, which MatchParticipant to fetch.
     */
    where: MatchParticipantWhereUniqueInput
  }

  /**
   * MatchParticipant findFirst
   */
  export type MatchParticipantFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MatchParticipant
     */
    select?: MatchParticipantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MatchParticipant
     */
    omit?: MatchParticipantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchParticipantInclude<ExtArgs> | null
    /**
     * Filter, which MatchParticipant to fetch.
     */
    where?: MatchParticipantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MatchParticipants to fetch.
     */
    orderBy?: MatchParticipantOrderByWithRelationInput | MatchParticipantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MatchParticipants.
     */
    cursor?: MatchParticipantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MatchParticipants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MatchParticipants.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MatchParticipants.
     */
    distinct?: MatchParticipantScalarFieldEnum | MatchParticipantScalarFieldEnum[]
  }

  /**
   * MatchParticipant findFirstOrThrow
   */
  export type MatchParticipantFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MatchParticipant
     */
    select?: MatchParticipantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MatchParticipant
     */
    omit?: MatchParticipantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchParticipantInclude<ExtArgs> | null
    /**
     * Filter, which MatchParticipant to fetch.
     */
    where?: MatchParticipantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MatchParticipants to fetch.
     */
    orderBy?: MatchParticipantOrderByWithRelationInput | MatchParticipantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MatchParticipants.
     */
    cursor?: MatchParticipantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MatchParticipants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MatchParticipants.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MatchParticipants.
     */
    distinct?: MatchParticipantScalarFieldEnum | MatchParticipantScalarFieldEnum[]
  }

  /**
   * MatchParticipant findMany
   */
  export type MatchParticipantFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MatchParticipant
     */
    select?: MatchParticipantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MatchParticipant
     */
    omit?: MatchParticipantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchParticipantInclude<ExtArgs> | null
    /**
     * Filter, which MatchParticipants to fetch.
     */
    where?: MatchParticipantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MatchParticipants to fetch.
     */
    orderBy?: MatchParticipantOrderByWithRelationInput | MatchParticipantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing MatchParticipants.
     */
    cursor?: MatchParticipantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MatchParticipants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MatchParticipants.
     */
    skip?: number
    distinct?: MatchParticipantScalarFieldEnum | MatchParticipantScalarFieldEnum[]
  }

  /**
   * MatchParticipant create
   */
  export type MatchParticipantCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MatchParticipant
     */
    select?: MatchParticipantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MatchParticipant
     */
    omit?: MatchParticipantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchParticipantInclude<ExtArgs> | null
    /**
     * The data needed to create a MatchParticipant.
     */
    data: XOR<MatchParticipantCreateInput, MatchParticipantUncheckedCreateInput>
  }

  /**
   * MatchParticipant createMany
   */
  export type MatchParticipantCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many MatchParticipants.
     */
    data: MatchParticipantCreateManyInput | MatchParticipantCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * MatchParticipant createManyAndReturn
   */
  export type MatchParticipantCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MatchParticipant
     */
    select?: MatchParticipantSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the MatchParticipant
     */
    omit?: MatchParticipantOmit<ExtArgs> | null
    /**
     * The data used to create many MatchParticipants.
     */
    data: MatchParticipantCreateManyInput | MatchParticipantCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchParticipantIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * MatchParticipant update
   */
  export type MatchParticipantUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MatchParticipant
     */
    select?: MatchParticipantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MatchParticipant
     */
    omit?: MatchParticipantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchParticipantInclude<ExtArgs> | null
    /**
     * The data needed to update a MatchParticipant.
     */
    data: XOR<MatchParticipantUpdateInput, MatchParticipantUncheckedUpdateInput>
    /**
     * Choose, which MatchParticipant to update.
     */
    where: MatchParticipantWhereUniqueInput
  }

  /**
   * MatchParticipant updateMany
   */
  export type MatchParticipantUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update MatchParticipants.
     */
    data: XOR<MatchParticipantUpdateManyMutationInput, MatchParticipantUncheckedUpdateManyInput>
    /**
     * Filter which MatchParticipants to update
     */
    where?: MatchParticipantWhereInput
    /**
     * Limit how many MatchParticipants to update.
     */
    limit?: number
  }

  /**
   * MatchParticipant updateManyAndReturn
   */
  export type MatchParticipantUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MatchParticipant
     */
    select?: MatchParticipantSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the MatchParticipant
     */
    omit?: MatchParticipantOmit<ExtArgs> | null
    /**
     * The data used to update MatchParticipants.
     */
    data: XOR<MatchParticipantUpdateManyMutationInput, MatchParticipantUncheckedUpdateManyInput>
    /**
     * Filter which MatchParticipants to update
     */
    where?: MatchParticipantWhereInput
    /**
     * Limit how many MatchParticipants to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchParticipantIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * MatchParticipant upsert
   */
  export type MatchParticipantUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MatchParticipant
     */
    select?: MatchParticipantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MatchParticipant
     */
    omit?: MatchParticipantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchParticipantInclude<ExtArgs> | null
    /**
     * The filter to search for the MatchParticipant to update in case it exists.
     */
    where: MatchParticipantWhereUniqueInput
    /**
     * In case the MatchParticipant found by the `where` argument doesn't exist, create a new MatchParticipant with this data.
     */
    create: XOR<MatchParticipantCreateInput, MatchParticipantUncheckedCreateInput>
    /**
     * In case the MatchParticipant was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MatchParticipantUpdateInput, MatchParticipantUncheckedUpdateInput>
  }

  /**
   * MatchParticipant delete
   */
  export type MatchParticipantDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MatchParticipant
     */
    select?: MatchParticipantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MatchParticipant
     */
    omit?: MatchParticipantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchParticipantInclude<ExtArgs> | null
    /**
     * Filter which MatchParticipant to delete.
     */
    where: MatchParticipantWhereUniqueInput
  }

  /**
   * MatchParticipant deleteMany
   */
  export type MatchParticipantDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MatchParticipants to delete
     */
    where?: MatchParticipantWhereInput
    /**
     * Limit how many MatchParticipants to delete.
     */
    limit?: number
  }

  /**
   * MatchParticipant without action
   */
  export type MatchParticipantDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MatchParticipant
     */
    select?: MatchParticipantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MatchParticipant
     */
    omit?: MatchParticipantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchParticipantInclude<ExtArgs> | null
  }


  /**
   * Model ChallengeProblem
   */

  export type AggregateChallengeProblem = {
    _count: ChallengeProblemCountAggregateOutputType | null
    _avg: ChallengeProblemAvgAggregateOutputType | null
    _sum: ChallengeProblemSumAggregateOutputType | null
    _min: ChallengeProblemMinAggregateOutputType | null
    _max: ChallengeProblemMaxAggregateOutputType | null
  }

  export type ChallengeProblemAvgAggregateOutputType = {
    timeLimitMs: number | null
    memoryLimitMb: number | null
  }

  export type ChallengeProblemSumAggregateOutputType = {
    timeLimitMs: number | null
    memoryLimitMb: number | null
  }

  export type ChallengeProblemMinAggregateOutputType = {
    id: string | null
    title: string | null
    slug: string | null
    difficulty: string | null
    description: string | null
    timeLimitMs: number | null
    memoryLimitMb: number | null
    idealSolution: string | null
    createdAt: Date | null
  }

  export type ChallengeProblemMaxAggregateOutputType = {
    id: string | null
    title: string | null
    slug: string | null
    difficulty: string | null
    description: string | null
    timeLimitMs: number | null
    memoryLimitMb: number | null
    idealSolution: string | null
    createdAt: Date | null
  }

  export type ChallengeProblemCountAggregateOutputType = {
    id: number
    title: number
    slug: number
    difficulty: number
    description: number
    examples: number
    constraints: number
    topicTags: number
    timeLimitMs: number
    memoryLimitMb: number
    starterCodes: number
    testCases: number
    idealSolution: number
    createdAt: number
    _all: number
  }


  export type ChallengeProblemAvgAggregateInputType = {
    timeLimitMs?: true
    memoryLimitMb?: true
  }

  export type ChallengeProblemSumAggregateInputType = {
    timeLimitMs?: true
    memoryLimitMb?: true
  }

  export type ChallengeProblemMinAggregateInputType = {
    id?: true
    title?: true
    slug?: true
    difficulty?: true
    description?: true
    timeLimitMs?: true
    memoryLimitMb?: true
    idealSolution?: true
    createdAt?: true
  }

  export type ChallengeProblemMaxAggregateInputType = {
    id?: true
    title?: true
    slug?: true
    difficulty?: true
    description?: true
    timeLimitMs?: true
    memoryLimitMb?: true
    idealSolution?: true
    createdAt?: true
  }

  export type ChallengeProblemCountAggregateInputType = {
    id?: true
    title?: true
    slug?: true
    difficulty?: true
    description?: true
    examples?: true
    constraints?: true
    topicTags?: true
    timeLimitMs?: true
    memoryLimitMb?: true
    starterCodes?: true
    testCases?: true
    idealSolution?: true
    createdAt?: true
    _all?: true
  }

  export type ChallengeProblemAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ChallengeProblem to aggregate.
     */
    where?: ChallengeProblemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChallengeProblems to fetch.
     */
    orderBy?: ChallengeProblemOrderByWithRelationInput | ChallengeProblemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ChallengeProblemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChallengeProblems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChallengeProblems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ChallengeProblems
    **/
    _count?: true | ChallengeProblemCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ChallengeProblemAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ChallengeProblemSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ChallengeProblemMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ChallengeProblemMaxAggregateInputType
  }

  export type GetChallengeProblemAggregateType<T extends ChallengeProblemAggregateArgs> = {
        [P in keyof T & keyof AggregateChallengeProblem]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateChallengeProblem[P]>
      : GetScalarType<T[P], AggregateChallengeProblem[P]>
  }




  export type ChallengeProblemGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ChallengeProblemWhereInput
    orderBy?: ChallengeProblemOrderByWithAggregationInput | ChallengeProblemOrderByWithAggregationInput[]
    by: ChallengeProblemScalarFieldEnum[] | ChallengeProblemScalarFieldEnum
    having?: ChallengeProblemScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ChallengeProblemCountAggregateInputType | true
    _avg?: ChallengeProblemAvgAggregateInputType
    _sum?: ChallengeProblemSumAggregateInputType
    _min?: ChallengeProblemMinAggregateInputType
    _max?: ChallengeProblemMaxAggregateInputType
  }

  export type ChallengeProblemGroupByOutputType = {
    id: string
    title: string
    slug: string
    difficulty: string
    description: string
    examples: JsonValue
    constraints: string[]
    topicTags: string[]
    timeLimitMs: number
    memoryLimitMb: number
    starterCodes: JsonValue
    testCases: JsonValue
    idealSolution: string | null
    createdAt: Date
    _count: ChallengeProblemCountAggregateOutputType | null
    _avg: ChallengeProblemAvgAggregateOutputType | null
    _sum: ChallengeProblemSumAggregateOutputType | null
    _min: ChallengeProblemMinAggregateOutputType | null
    _max: ChallengeProblemMaxAggregateOutputType | null
  }

  type GetChallengeProblemGroupByPayload<T extends ChallengeProblemGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ChallengeProblemGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ChallengeProblemGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ChallengeProblemGroupByOutputType[P]>
            : GetScalarType<T[P], ChallengeProblemGroupByOutputType[P]>
        }
      >
    >


  export type ChallengeProblemSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    slug?: boolean
    difficulty?: boolean
    description?: boolean
    examples?: boolean
    constraints?: boolean
    topicTags?: boolean
    timeLimitMs?: boolean
    memoryLimitMb?: boolean
    starterCodes?: boolean
    testCases?: boolean
    idealSolution?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["challengeProblem"]>

  export type ChallengeProblemSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    slug?: boolean
    difficulty?: boolean
    description?: boolean
    examples?: boolean
    constraints?: boolean
    topicTags?: boolean
    timeLimitMs?: boolean
    memoryLimitMb?: boolean
    starterCodes?: boolean
    testCases?: boolean
    idealSolution?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["challengeProblem"]>

  export type ChallengeProblemSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    slug?: boolean
    difficulty?: boolean
    description?: boolean
    examples?: boolean
    constraints?: boolean
    topicTags?: boolean
    timeLimitMs?: boolean
    memoryLimitMb?: boolean
    starterCodes?: boolean
    testCases?: boolean
    idealSolution?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["challengeProblem"]>

  export type ChallengeProblemSelectScalar = {
    id?: boolean
    title?: boolean
    slug?: boolean
    difficulty?: boolean
    description?: boolean
    examples?: boolean
    constraints?: boolean
    topicTags?: boolean
    timeLimitMs?: boolean
    memoryLimitMb?: boolean
    starterCodes?: boolean
    testCases?: boolean
    idealSolution?: boolean
    createdAt?: boolean
  }

  export type ChallengeProblemOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "title" | "slug" | "difficulty" | "description" | "examples" | "constraints" | "topicTags" | "timeLimitMs" | "memoryLimitMb" | "starterCodes" | "testCases" | "idealSolution" | "createdAt", ExtArgs["result"]["challengeProblem"]>

  export type $ChallengeProblemPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ChallengeProblem"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      title: string
      slug: string
      difficulty: string
      description: string
      examples: Prisma.JsonValue
      constraints: string[]
      topicTags: string[]
      timeLimitMs: number
      memoryLimitMb: number
      starterCodes: Prisma.JsonValue
      testCases: Prisma.JsonValue
      idealSolution: string | null
      createdAt: Date
    }, ExtArgs["result"]["challengeProblem"]>
    composites: {}
  }

  type ChallengeProblemGetPayload<S extends boolean | null | undefined | ChallengeProblemDefaultArgs> = $Result.GetResult<Prisma.$ChallengeProblemPayload, S>

  type ChallengeProblemCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ChallengeProblemFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ChallengeProblemCountAggregateInputType | true
    }

  export interface ChallengeProblemDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ChallengeProblem'], meta: { name: 'ChallengeProblem' } }
    /**
     * Find zero or one ChallengeProblem that matches the filter.
     * @param {ChallengeProblemFindUniqueArgs} args - Arguments to find a ChallengeProblem
     * @example
     * // Get one ChallengeProblem
     * const challengeProblem = await prisma.challengeProblem.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ChallengeProblemFindUniqueArgs>(args: SelectSubset<T, ChallengeProblemFindUniqueArgs<ExtArgs>>): Prisma__ChallengeProblemClient<$Result.GetResult<Prisma.$ChallengeProblemPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ChallengeProblem that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ChallengeProblemFindUniqueOrThrowArgs} args - Arguments to find a ChallengeProblem
     * @example
     * // Get one ChallengeProblem
     * const challengeProblem = await prisma.challengeProblem.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ChallengeProblemFindUniqueOrThrowArgs>(args: SelectSubset<T, ChallengeProblemFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ChallengeProblemClient<$Result.GetResult<Prisma.$ChallengeProblemPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ChallengeProblem that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChallengeProblemFindFirstArgs} args - Arguments to find a ChallengeProblem
     * @example
     * // Get one ChallengeProblem
     * const challengeProblem = await prisma.challengeProblem.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ChallengeProblemFindFirstArgs>(args?: SelectSubset<T, ChallengeProblemFindFirstArgs<ExtArgs>>): Prisma__ChallengeProblemClient<$Result.GetResult<Prisma.$ChallengeProblemPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ChallengeProblem that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChallengeProblemFindFirstOrThrowArgs} args - Arguments to find a ChallengeProblem
     * @example
     * // Get one ChallengeProblem
     * const challengeProblem = await prisma.challengeProblem.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ChallengeProblemFindFirstOrThrowArgs>(args?: SelectSubset<T, ChallengeProblemFindFirstOrThrowArgs<ExtArgs>>): Prisma__ChallengeProblemClient<$Result.GetResult<Prisma.$ChallengeProblemPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ChallengeProblems that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChallengeProblemFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ChallengeProblems
     * const challengeProblems = await prisma.challengeProblem.findMany()
     * 
     * // Get first 10 ChallengeProblems
     * const challengeProblems = await prisma.challengeProblem.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const challengeProblemWithIdOnly = await prisma.challengeProblem.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ChallengeProblemFindManyArgs>(args?: SelectSubset<T, ChallengeProblemFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChallengeProblemPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ChallengeProblem.
     * @param {ChallengeProblemCreateArgs} args - Arguments to create a ChallengeProblem.
     * @example
     * // Create one ChallengeProblem
     * const ChallengeProblem = await prisma.challengeProblem.create({
     *   data: {
     *     // ... data to create a ChallengeProblem
     *   }
     * })
     * 
     */
    create<T extends ChallengeProblemCreateArgs>(args: SelectSubset<T, ChallengeProblemCreateArgs<ExtArgs>>): Prisma__ChallengeProblemClient<$Result.GetResult<Prisma.$ChallengeProblemPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ChallengeProblems.
     * @param {ChallengeProblemCreateManyArgs} args - Arguments to create many ChallengeProblems.
     * @example
     * // Create many ChallengeProblems
     * const challengeProblem = await prisma.challengeProblem.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ChallengeProblemCreateManyArgs>(args?: SelectSubset<T, ChallengeProblemCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ChallengeProblems and returns the data saved in the database.
     * @param {ChallengeProblemCreateManyAndReturnArgs} args - Arguments to create many ChallengeProblems.
     * @example
     * // Create many ChallengeProblems
     * const challengeProblem = await prisma.challengeProblem.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ChallengeProblems and only return the `id`
     * const challengeProblemWithIdOnly = await prisma.challengeProblem.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ChallengeProblemCreateManyAndReturnArgs>(args?: SelectSubset<T, ChallengeProblemCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChallengeProblemPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ChallengeProblem.
     * @param {ChallengeProblemDeleteArgs} args - Arguments to delete one ChallengeProblem.
     * @example
     * // Delete one ChallengeProblem
     * const ChallengeProblem = await prisma.challengeProblem.delete({
     *   where: {
     *     // ... filter to delete one ChallengeProblem
     *   }
     * })
     * 
     */
    delete<T extends ChallengeProblemDeleteArgs>(args: SelectSubset<T, ChallengeProblemDeleteArgs<ExtArgs>>): Prisma__ChallengeProblemClient<$Result.GetResult<Prisma.$ChallengeProblemPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ChallengeProblem.
     * @param {ChallengeProblemUpdateArgs} args - Arguments to update one ChallengeProblem.
     * @example
     * // Update one ChallengeProblem
     * const challengeProblem = await prisma.challengeProblem.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ChallengeProblemUpdateArgs>(args: SelectSubset<T, ChallengeProblemUpdateArgs<ExtArgs>>): Prisma__ChallengeProblemClient<$Result.GetResult<Prisma.$ChallengeProblemPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ChallengeProblems.
     * @param {ChallengeProblemDeleteManyArgs} args - Arguments to filter ChallengeProblems to delete.
     * @example
     * // Delete a few ChallengeProblems
     * const { count } = await prisma.challengeProblem.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ChallengeProblemDeleteManyArgs>(args?: SelectSubset<T, ChallengeProblemDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ChallengeProblems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChallengeProblemUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ChallengeProblems
     * const challengeProblem = await prisma.challengeProblem.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ChallengeProblemUpdateManyArgs>(args: SelectSubset<T, ChallengeProblemUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ChallengeProblems and returns the data updated in the database.
     * @param {ChallengeProblemUpdateManyAndReturnArgs} args - Arguments to update many ChallengeProblems.
     * @example
     * // Update many ChallengeProblems
     * const challengeProblem = await prisma.challengeProblem.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ChallengeProblems and only return the `id`
     * const challengeProblemWithIdOnly = await prisma.challengeProblem.updateManyAndReturn({
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
    updateManyAndReturn<T extends ChallengeProblemUpdateManyAndReturnArgs>(args: SelectSubset<T, ChallengeProblemUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChallengeProblemPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ChallengeProblem.
     * @param {ChallengeProblemUpsertArgs} args - Arguments to update or create a ChallengeProblem.
     * @example
     * // Update or create a ChallengeProblem
     * const challengeProblem = await prisma.challengeProblem.upsert({
     *   create: {
     *     // ... data to create a ChallengeProblem
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ChallengeProblem we want to update
     *   }
     * })
     */
    upsert<T extends ChallengeProblemUpsertArgs>(args: SelectSubset<T, ChallengeProblemUpsertArgs<ExtArgs>>): Prisma__ChallengeProblemClient<$Result.GetResult<Prisma.$ChallengeProblemPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ChallengeProblems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChallengeProblemCountArgs} args - Arguments to filter ChallengeProblems to count.
     * @example
     * // Count the number of ChallengeProblems
     * const count = await prisma.challengeProblem.count({
     *   where: {
     *     // ... the filter for the ChallengeProblems we want to count
     *   }
     * })
    **/
    count<T extends ChallengeProblemCountArgs>(
      args?: Subset<T, ChallengeProblemCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ChallengeProblemCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ChallengeProblem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChallengeProblemAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ChallengeProblemAggregateArgs>(args: Subset<T, ChallengeProblemAggregateArgs>): Prisma.PrismaPromise<GetChallengeProblemAggregateType<T>>

    /**
     * Group by ChallengeProblem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChallengeProblemGroupByArgs} args - Group by arguments.
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
      T extends ChallengeProblemGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ChallengeProblemGroupByArgs['orderBy'] }
        : { orderBy?: ChallengeProblemGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ChallengeProblemGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetChallengeProblemGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ChallengeProblem model
   */
  readonly fields: ChallengeProblemFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ChallengeProblem.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ChallengeProblemClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
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
   * Fields of the ChallengeProblem model
   */
  interface ChallengeProblemFieldRefs {
    readonly id: FieldRef<"ChallengeProblem", 'String'>
    readonly title: FieldRef<"ChallengeProblem", 'String'>
    readonly slug: FieldRef<"ChallengeProblem", 'String'>
    readonly difficulty: FieldRef<"ChallengeProblem", 'String'>
    readonly description: FieldRef<"ChallengeProblem", 'String'>
    readonly examples: FieldRef<"ChallengeProblem", 'Json'>
    readonly constraints: FieldRef<"ChallengeProblem", 'String[]'>
    readonly topicTags: FieldRef<"ChallengeProblem", 'String[]'>
    readonly timeLimitMs: FieldRef<"ChallengeProblem", 'Int'>
    readonly memoryLimitMb: FieldRef<"ChallengeProblem", 'Int'>
    readonly starterCodes: FieldRef<"ChallengeProblem", 'Json'>
    readonly testCases: FieldRef<"ChallengeProblem", 'Json'>
    readonly idealSolution: FieldRef<"ChallengeProblem", 'String'>
    readonly createdAt: FieldRef<"ChallengeProblem", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ChallengeProblem findUnique
   */
  export type ChallengeProblemFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChallengeProblem
     */
    select?: ChallengeProblemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChallengeProblem
     */
    omit?: ChallengeProblemOmit<ExtArgs> | null
    /**
     * Filter, which ChallengeProblem to fetch.
     */
    where: ChallengeProblemWhereUniqueInput
  }

  /**
   * ChallengeProblem findUniqueOrThrow
   */
  export type ChallengeProblemFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChallengeProblem
     */
    select?: ChallengeProblemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChallengeProblem
     */
    omit?: ChallengeProblemOmit<ExtArgs> | null
    /**
     * Filter, which ChallengeProblem to fetch.
     */
    where: ChallengeProblemWhereUniqueInput
  }

  /**
   * ChallengeProblem findFirst
   */
  export type ChallengeProblemFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChallengeProblem
     */
    select?: ChallengeProblemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChallengeProblem
     */
    omit?: ChallengeProblemOmit<ExtArgs> | null
    /**
     * Filter, which ChallengeProblem to fetch.
     */
    where?: ChallengeProblemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChallengeProblems to fetch.
     */
    orderBy?: ChallengeProblemOrderByWithRelationInput | ChallengeProblemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ChallengeProblems.
     */
    cursor?: ChallengeProblemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChallengeProblems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChallengeProblems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ChallengeProblems.
     */
    distinct?: ChallengeProblemScalarFieldEnum | ChallengeProblemScalarFieldEnum[]
  }

  /**
   * ChallengeProblem findFirstOrThrow
   */
  export type ChallengeProblemFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChallengeProblem
     */
    select?: ChallengeProblemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChallengeProblem
     */
    omit?: ChallengeProblemOmit<ExtArgs> | null
    /**
     * Filter, which ChallengeProblem to fetch.
     */
    where?: ChallengeProblemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChallengeProblems to fetch.
     */
    orderBy?: ChallengeProblemOrderByWithRelationInput | ChallengeProblemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ChallengeProblems.
     */
    cursor?: ChallengeProblemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChallengeProblems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChallengeProblems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ChallengeProblems.
     */
    distinct?: ChallengeProblemScalarFieldEnum | ChallengeProblemScalarFieldEnum[]
  }

  /**
   * ChallengeProblem findMany
   */
  export type ChallengeProblemFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChallengeProblem
     */
    select?: ChallengeProblemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChallengeProblem
     */
    omit?: ChallengeProblemOmit<ExtArgs> | null
    /**
     * Filter, which ChallengeProblems to fetch.
     */
    where?: ChallengeProblemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChallengeProblems to fetch.
     */
    orderBy?: ChallengeProblemOrderByWithRelationInput | ChallengeProblemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ChallengeProblems.
     */
    cursor?: ChallengeProblemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChallengeProblems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChallengeProblems.
     */
    skip?: number
    distinct?: ChallengeProblemScalarFieldEnum | ChallengeProblemScalarFieldEnum[]
  }

  /**
   * ChallengeProblem create
   */
  export type ChallengeProblemCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChallengeProblem
     */
    select?: ChallengeProblemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChallengeProblem
     */
    omit?: ChallengeProblemOmit<ExtArgs> | null
    /**
     * The data needed to create a ChallengeProblem.
     */
    data: XOR<ChallengeProblemCreateInput, ChallengeProblemUncheckedCreateInput>
  }

  /**
   * ChallengeProblem createMany
   */
  export type ChallengeProblemCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ChallengeProblems.
     */
    data: ChallengeProblemCreateManyInput | ChallengeProblemCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ChallengeProblem createManyAndReturn
   */
  export type ChallengeProblemCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChallengeProblem
     */
    select?: ChallengeProblemSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ChallengeProblem
     */
    omit?: ChallengeProblemOmit<ExtArgs> | null
    /**
     * The data used to create many ChallengeProblems.
     */
    data: ChallengeProblemCreateManyInput | ChallengeProblemCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ChallengeProblem update
   */
  export type ChallengeProblemUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChallengeProblem
     */
    select?: ChallengeProblemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChallengeProblem
     */
    omit?: ChallengeProblemOmit<ExtArgs> | null
    /**
     * The data needed to update a ChallengeProblem.
     */
    data: XOR<ChallengeProblemUpdateInput, ChallengeProblemUncheckedUpdateInput>
    /**
     * Choose, which ChallengeProblem to update.
     */
    where: ChallengeProblemWhereUniqueInput
  }

  /**
   * ChallengeProblem updateMany
   */
  export type ChallengeProblemUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ChallengeProblems.
     */
    data: XOR<ChallengeProblemUpdateManyMutationInput, ChallengeProblemUncheckedUpdateManyInput>
    /**
     * Filter which ChallengeProblems to update
     */
    where?: ChallengeProblemWhereInput
    /**
     * Limit how many ChallengeProblems to update.
     */
    limit?: number
  }

  /**
   * ChallengeProblem updateManyAndReturn
   */
  export type ChallengeProblemUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChallengeProblem
     */
    select?: ChallengeProblemSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ChallengeProblem
     */
    omit?: ChallengeProblemOmit<ExtArgs> | null
    /**
     * The data used to update ChallengeProblems.
     */
    data: XOR<ChallengeProblemUpdateManyMutationInput, ChallengeProblemUncheckedUpdateManyInput>
    /**
     * Filter which ChallengeProblems to update
     */
    where?: ChallengeProblemWhereInput
    /**
     * Limit how many ChallengeProblems to update.
     */
    limit?: number
  }

  /**
   * ChallengeProblem upsert
   */
  export type ChallengeProblemUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChallengeProblem
     */
    select?: ChallengeProblemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChallengeProblem
     */
    omit?: ChallengeProblemOmit<ExtArgs> | null
    /**
     * The filter to search for the ChallengeProblem to update in case it exists.
     */
    where: ChallengeProblemWhereUniqueInput
    /**
     * In case the ChallengeProblem found by the `where` argument doesn't exist, create a new ChallengeProblem with this data.
     */
    create: XOR<ChallengeProblemCreateInput, ChallengeProblemUncheckedCreateInput>
    /**
     * In case the ChallengeProblem was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ChallengeProblemUpdateInput, ChallengeProblemUncheckedUpdateInput>
  }

  /**
   * ChallengeProblem delete
   */
  export type ChallengeProblemDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChallengeProblem
     */
    select?: ChallengeProblemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChallengeProblem
     */
    omit?: ChallengeProblemOmit<ExtArgs> | null
    /**
     * Filter which ChallengeProblem to delete.
     */
    where: ChallengeProblemWhereUniqueInput
  }

  /**
   * ChallengeProblem deleteMany
   */
  export type ChallengeProblemDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ChallengeProblems to delete
     */
    where?: ChallengeProblemWhereInput
    /**
     * Limit how many ChallengeProblems to delete.
     */
    limit?: number
  }

  /**
   * ChallengeProblem without action
   */
  export type ChallengeProblemDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChallengeProblem
     */
    select?: ChallengeProblemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChallengeProblem
     */
    omit?: ChallengeProblemOmit<ExtArgs> | null
  }


  /**
   * Model ChallengeSubmission
   */

  export type AggregateChallengeSubmission = {
    _count: ChallengeSubmissionCountAggregateOutputType | null
    _avg: ChallengeSubmissionAvgAggregateOutputType | null
    _sum: ChallengeSubmissionSumAggregateOutputType | null
    _min: ChallengeSubmissionMinAggregateOutputType | null
    _max: ChallengeSubmissionMaxAggregateOutputType | null
  }

  export type ChallengeSubmissionAvgAggregateOutputType = {
    executionTimeMs: number | null
    passedTestCases: number | null
    totalTestCases: number | null
    score: number | null
  }

  export type ChallengeSubmissionSumAggregateOutputType = {
    executionTimeMs: number | null
    passedTestCases: number | null
    totalTestCases: number | null
    score: number | null
  }

  export type ChallengeSubmissionMinAggregateOutputType = {
    id: string | null
    matchId: string | null
    userId: string | null
    problemId: string | null
    language: string | null
    sourceCode: string | null
    status: string | null
    executionTimeMs: number | null
    passedTestCases: number | null
    totalTestCases: number | null
    score: number | null
    stdout: string | null
    errorDetails: string | null
    submittedAt: Date | null
  }

  export type ChallengeSubmissionMaxAggregateOutputType = {
    id: string | null
    matchId: string | null
    userId: string | null
    problemId: string | null
    language: string | null
    sourceCode: string | null
    status: string | null
    executionTimeMs: number | null
    passedTestCases: number | null
    totalTestCases: number | null
    score: number | null
    stdout: string | null
    errorDetails: string | null
    submittedAt: Date | null
  }

  export type ChallengeSubmissionCountAggregateOutputType = {
    id: number
    matchId: number
    userId: number
    problemId: number
    language: number
    sourceCode: number
    status: number
    executionTimeMs: number
    passedTestCases: number
    totalTestCases: number
    score: number
    stdout: number
    errorDetails: number
    submittedAt: number
    _all: number
  }


  export type ChallengeSubmissionAvgAggregateInputType = {
    executionTimeMs?: true
    passedTestCases?: true
    totalTestCases?: true
    score?: true
  }

  export type ChallengeSubmissionSumAggregateInputType = {
    executionTimeMs?: true
    passedTestCases?: true
    totalTestCases?: true
    score?: true
  }

  export type ChallengeSubmissionMinAggregateInputType = {
    id?: true
    matchId?: true
    userId?: true
    problemId?: true
    language?: true
    sourceCode?: true
    status?: true
    executionTimeMs?: true
    passedTestCases?: true
    totalTestCases?: true
    score?: true
    stdout?: true
    errorDetails?: true
    submittedAt?: true
  }

  export type ChallengeSubmissionMaxAggregateInputType = {
    id?: true
    matchId?: true
    userId?: true
    problemId?: true
    language?: true
    sourceCode?: true
    status?: true
    executionTimeMs?: true
    passedTestCases?: true
    totalTestCases?: true
    score?: true
    stdout?: true
    errorDetails?: true
    submittedAt?: true
  }

  export type ChallengeSubmissionCountAggregateInputType = {
    id?: true
    matchId?: true
    userId?: true
    problemId?: true
    language?: true
    sourceCode?: true
    status?: true
    executionTimeMs?: true
    passedTestCases?: true
    totalTestCases?: true
    score?: true
    stdout?: true
    errorDetails?: true
    submittedAt?: true
    _all?: true
  }

  export type ChallengeSubmissionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ChallengeSubmission to aggregate.
     */
    where?: ChallengeSubmissionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChallengeSubmissions to fetch.
     */
    orderBy?: ChallengeSubmissionOrderByWithRelationInput | ChallengeSubmissionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ChallengeSubmissionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChallengeSubmissions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChallengeSubmissions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ChallengeSubmissions
    **/
    _count?: true | ChallengeSubmissionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ChallengeSubmissionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ChallengeSubmissionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ChallengeSubmissionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ChallengeSubmissionMaxAggregateInputType
  }

  export type GetChallengeSubmissionAggregateType<T extends ChallengeSubmissionAggregateArgs> = {
        [P in keyof T & keyof AggregateChallengeSubmission]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateChallengeSubmission[P]>
      : GetScalarType<T[P], AggregateChallengeSubmission[P]>
  }




  export type ChallengeSubmissionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ChallengeSubmissionWhereInput
    orderBy?: ChallengeSubmissionOrderByWithAggregationInput | ChallengeSubmissionOrderByWithAggregationInput[]
    by: ChallengeSubmissionScalarFieldEnum[] | ChallengeSubmissionScalarFieldEnum
    having?: ChallengeSubmissionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ChallengeSubmissionCountAggregateInputType | true
    _avg?: ChallengeSubmissionAvgAggregateInputType
    _sum?: ChallengeSubmissionSumAggregateInputType
    _min?: ChallengeSubmissionMinAggregateInputType
    _max?: ChallengeSubmissionMaxAggregateInputType
  }

  export type ChallengeSubmissionGroupByOutputType = {
    id: string
    matchId: string
    userId: string
    problemId: string
    language: string
    sourceCode: string
    status: string
    executionTimeMs: number
    passedTestCases: number
    totalTestCases: number
    score: number
    stdout: string | null
    errorDetails: string | null
    submittedAt: Date
    _count: ChallengeSubmissionCountAggregateOutputType | null
    _avg: ChallengeSubmissionAvgAggregateOutputType | null
    _sum: ChallengeSubmissionSumAggregateOutputType | null
    _min: ChallengeSubmissionMinAggregateOutputType | null
    _max: ChallengeSubmissionMaxAggregateOutputType | null
  }

  type GetChallengeSubmissionGroupByPayload<T extends ChallengeSubmissionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ChallengeSubmissionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ChallengeSubmissionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ChallengeSubmissionGroupByOutputType[P]>
            : GetScalarType<T[P], ChallengeSubmissionGroupByOutputType[P]>
        }
      >
    >


  export type ChallengeSubmissionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    matchId?: boolean
    userId?: boolean
    problemId?: boolean
    language?: boolean
    sourceCode?: boolean
    status?: boolean
    executionTimeMs?: boolean
    passedTestCases?: boolean
    totalTestCases?: boolean
    score?: boolean
    stdout?: boolean
    errorDetails?: boolean
    submittedAt?: boolean
    match?: boolean | MatchSessionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["challengeSubmission"]>

  export type ChallengeSubmissionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    matchId?: boolean
    userId?: boolean
    problemId?: boolean
    language?: boolean
    sourceCode?: boolean
    status?: boolean
    executionTimeMs?: boolean
    passedTestCases?: boolean
    totalTestCases?: boolean
    score?: boolean
    stdout?: boolean
    errorDetails?: boolean
    submittedAt?: boolean
    match?: boolean | MatchSessionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["challengeSubmission"]>

  export type ChallengeSubmissionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    matchId?: boolean
    userId?: boolean
    problemId?: boolean
    language?: boolean
    sourceCode?: boolean
    status?: boolean
    executionTimeMs?: boolean
    passedTestCases?: boolean
    totalTestCases?: boolean
    score?: boolean
    stdout?: boolean
    errorDetails?: boolean
    submittedAt?: boolean
    match?: boolean | MatchSessionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["challengeSubmission"]>

  export type ChallengeSubmissionSelectScalar = {
    id?: boolean
    matchId?: boolean
    userId?: boolean
    problemId?: boolean
    language?: boolean
    sourceCode?: boolean
    status?: boolean
    executionTimeMs?: boolean
    passedTestCases?: boolean
    totalTestCases?: boolean
    score?: boolean
    stdout?: boolean
    errorDetails?: boolean
    submittedAt?: boolean
  }

  export type ChallengeSubmissionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "matchId" | "userId" | "problemId" | "language" | "sourceCode" | "status" | "executionTimeMs" | "passedTestCases" | "totalTestCases" | "score" | "stdout" | "errorDetails" | "submittedAt", ExtArgs["result"]["challengeSubmission"]>
  export type ChallengeSubmissionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    match?: boolean | MatchSessionDefaultArgs<ExtArgs>
  }
  export type ChallengeSubmissionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    match?: boolean | MatchSessionDefaultArgs<ExtArgs>
  }
  export type ChallengeSubmissionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    match?: boolean | MatchSessionDefaultArgs<ExtArgs>
  }

  export type $ChallengeSubmissionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ChallengeSubmission"
    objects: {
      match: Prisma.$MatchSessionPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      matchId: string
      userId: string
      problemId: string
      language: string
      sourceCode: string
      status: string
      executionTimeMs: number
      passedTestCases: number
      totalTestCases: number
      score: number
      stdout: string | null
      errorDetails: string | null
      submittedAt: Date
    }, ExtArgs["result"]["challengeSubmission"]>
    composites: {}
  }

  type ChallengeSubmissionGetPayload<S extends boolean | null | undefined | ChallengeSubmissionDefaultArgs> = $Result.GetResult<Prisma.$ChallengeSubmissionPayload, S>

  type ChallengeSubmissionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ChallengeSubmissionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ChallengeSubmissionCountAggregateInputType | true
    }

  export interface ChallengeSubmissionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ChallengeSubmission'], meta: { name: 'ChallengeSubmission' } }
    /**
     * Find zero or one ChallengeSubmission that matches the filter.
     * @param {ChallengeSubmissionFindUniqueArgs} args - Arguments to find a ChallengeSubmission
     * @example
     * // Get one ChallengeSubmission
     * const challengeSubmission = await prisma.challengeSubmission.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ChallengeSubmissionFindUniqueArgs>(args: SelectSubset<T, ChallengeSubmissionFindUniqueArgs<ExtArgs>>): Prisma__ChallengeSubmissionClient<$Result.GetResult<Prisma.$ChallengeSubmissionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ChallengeSubmission that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ChallengeSubmissionFindUniqueOrThrowArgs} args - Arguments to find a ChallengeSubmission
     * @example
     * // Get one ChallengeSubmission
     * const challengeSubmission = await prisma.challengeSubmission.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ChallengeSubmissionFindUniqueOrThrowArgs>(args: SelectSubset<T, ChallengeSubmissionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ChallengeSubmissionClient<$Result.GetResult<Prisma.$ChallengeSubmissionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ChallengeSubmission that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChallengeSubmissionFindFirstArgs} args - Arguments to find a ChallengeSubmission
     * @example
     * // Get one ChallengeSubmission
     * const challengeSubmission = await prisma.challengeSubmission.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ChallengeSubmissionFindFirstArgs>(args?: SelectSubset<T, ChallengeSubmissionFindFirstArgs<ExtArgs>>): Prisma__ChallengeSubmissionClient<$Result.GetResult<Prisma.$ChallengeSubmissionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ChallengeSubmission that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChallengeSubmissionFindFirstOrThrowArgs} args - Arguments to find a ChallengeSubmission
     * @example
     * // Get one ChallengeSubmission
     * const challengeSubmission = await prisma.challengeSubmission.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ChallengeSubmissionFindFirstOrThrowArgs>(args?: SelectSubset<T, ChallengeSubmissionFindFirstOrThrowArgs<ExtArgs>>): Prisma__ChallengeSubmissionClient<$Result.GetResult<Prisma.$ChallengeSubmissionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ChallengeSubmissions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChallengeSubmissionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ChallengeSubmissions
     * const challengeSubmissions = await prisma.challengeSubmission.findMany()
     * 
     * // Get first 10 ChallengeSubmissions
     * const challengeSubmissions = await prisma.challengeSubmission.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const challengeSubmissionWithIdOnly = await prisma.challengeSubmission.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ChallengeSubmissionFindManyArgs>(args?: SelectSubset<T, ChallengeSubmissionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChallengeSubmissionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ChallengeSubmission.
     * @param {ChallengeSubmissionCreateArgs} args - Arguments to create a ChallengeSubmission.
     * @example
     * // Create one ChallengeSubmission
     * const ChallengeSubmission = await prisma.challengeSubmission.create({
     *   data: {
     *     // ... data to create a ChallengeSubmission
     *   }
     * })
     * 
     */
    create<T extends ChallengeSubmissionCreateArgs>(args: SelectSubset<T, ChallengeSubmissionCreateArgs<ExtArgs>>): Prisma__ChallengeSubmissionClient<$Result.GetResult<Prisma.$ChallengeSubmissionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ChallengeSubmissions.
     * @param {ChallengeSubmissionCreateManyArgs} args - Arguments to create many ChallengeSubmissions.
     * @example
     * // Create many ChallengeSubmissions
     * const challengeSubmission = await prisma.challengeSubmission.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ChallengeSubmissionCreateManyArgs>(args?: SelectSubset<T, ChallengeSubmissionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ChallengeSubmissions and returns the data saved in the database.
     * @param {ChallengeSubmissionCreateManyAndReturnArgs} args - Arguments to create many ChallengeSubmissions.
     * @example
     * // Create many ChallengeSubmissions
     * const challengeSubmission = await prisma.challengeSubmission.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ChallengeSubmissions and only return the `id`
     * const challengeSubmissionWithIdOnly = await prisma.challengeSubmission.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ChallengeSubmissionCreateManyAndReturnArgs>(args?: SelectSubset<T, ChallengeSubmissionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChallengeSubmissionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ChallengeSubmission.
     * @param {ChallengeSubmissionDeleteArgs} args - Arguments to delete one ChallengeSubmission.
     * @example
     * // Delete one ChallengeSubmission
     * const ChallengeSubmission = await prisma.challengeSubmission.delete({
     *   where: {
     *     // ... filter to delete one ChallengeSubmission
     *   }
     * })
     * 
     */
    delete<T extends ChallengeSubmissionDeleteArgs>(args: SelectSubset<T, ChallengeSubmissionDeleteArgs<ExtArgs>>): Prisma__ChallengeSubmissionClient<$Result.GetResult<Prisma.$ChallengeSubmissionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ChallengeSubmission.
     * @param {ChallengeSubmissionUpdateArgs} args - Arguments to update one ChallengeSubmission.
     * @example
     * // Update one ChallengeSubmission
     * const challengeSubmission = await prisma.challengeSubmission.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ChallengeSubmissionUpdateArgs>(args: SelectSubset<T, ChallengeSubmissionUpdateArgs<ExtArgs>>): Prisma__ChallengeSubmissionClient<$Result.GetResult<Prisma.$ChallengeSubmissionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ChallengeSubmissions.
     * @param {ChallengeSubmissionDeleteManyArgs} args - Arguments to filter ChallengeSubmissions to delete.
     * @example
     * // Delete a few ChallengeSubmissions
     * const { count } = await prisma.challengeSubmission.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ChallengeSubmissionDeleteManyArgs>(args?: SelectSubset<T, ChallengeSubmissionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ChallengeSubmissions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChallengeSubmissionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ChallengeSubmissions
     * const challengeSubmission = await prisma.challengeSubmission.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ChallengeSubmissionUpdateManyArgs>(args: SelectSubset<T, ChallengeSubmissionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ChallengeSubmissions and returns the data updated in the database.
     * @param {ChallengeSubmissionUpdateManyAndReturnArgs} args - Arguments to update many ChallengeSubmissions.
     * @example
     * // Update many ChallengeSubmissions
     * const challengeSubmission = await prisma.challengeSubmission.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ChallengeSubmissions and only return the `id`
     * const challengeSubmissionWithIdOnly = await prisma.challengeSubmission.updateManyAndReturn({
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
    updateManyAndReturn<T extends ChallengeSubmissionUpdateManyAndReturnArgs>(args: SelectSubset<T, ChallengeSubmissionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChallengeSubmissionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ChallengeSubmission.
     * @param {ChallengeSubmissionUpsertArgs} args - Arguments to update or create a ChallengeSubmission.
     * @example
     * // Update or create a ChallengeSubmission
     * const challengeSubmission = await prisma.challengeSubmission.upsert({
     *   create: {
     *     // ... data to create a ChallengeSubmission
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ChallengeSubmission we want to update
     *   }
     * })
     */
    upsert<T extends ChallengeSubmissionUpsertArgs>(args: SelectSubset<T, ChallengeSubmissionUpsertArgs<ExtArgs>>): Prisma__ChallengeSubmissionClient<$Result.GetResult<Prisma.$ChallengeSubmissionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ChallengeSubmissions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChallengeSubmissionCountArgs} args - Arguments to filter ChallengeSubmissions to count.
     * @example
     * // Count the number of ChallengeSubmissions
     * const count = await prisma.challengeSubmission.count({
     *   where: {
     *     // ... the filter for the ChallengeSubmissions we want to count
     *   }
     * })
    **/
    count<T extends ChallengeSubmissionCountArgs>(
      args?: Subset<T, ChallengeSubmissionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ChallengeSubmissionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ChallengeSubmission.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChallengeSubmissionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ChallengeSubmissionAggregateArgs>(args: Subset<T, ChallengeSubmissionAggregateArgs>): Prisma.PrismaPromise<GetChallengeSubmissionAggregateType<T>>

    /**
     * Group by ChallengeSubmission.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChallengeSubmissionGroupByArgs} args - Group by arguments.
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
      T extends ChallengeSubmissionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ChallengeSubmissionGroupByArgs['orderBy'] }
        : { orderBy?: ChallengeSubmissionGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ChallengeSubmissionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetChallengeSubmissionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ChallengeSubmission model
   */
  readonly fields: ChallengeSubmissionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ChallengeSubmission.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ChallengeSubmissionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    match<T extends MatchSessionDefaultArgs<ExtArgs> = {}>(args?: Subset<T, MatchSessionDefaultArgs<ExtArgs>>): Prisma__MatchSessionClient<$Result.GetResult<Prisma.$MatchSessionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the ChallengeSubmission model
   */
  interface ChallengeSubmissionFieldRefs {
    readonly id: FieldRef<"ChallengeSubmission", 'String'>
    readonly matchId: FieldRef<"ChallengeSubmission", 'String'>
    readonly userId: FieldRef<"ChallengeSubmission", 'String'>
    readonly problemId: FieldRef<"ChallengeSubmission", 'String'>
    readonly language: FieldRef<"ChallengeSubmission", 'String'>
    readonly sourceCode: FieldRef<"ChallengeSubmission", 'String'>
    readonly status: FieldRef<"ChallengeSubmission", 'String'>
    readonly executionTimeMs: FieldRef<"ChallengeSubmission", 'Int'>
    readonly passedTestCases: FieldRef<"ChallengeSubmission", 'Int'>
    readonly totalTestCases: FieldRef<"ChallengeSubmission", 'Int'>
    readonly score: FieldRef<"ChallengeSubmission", 'Int'>
    readonly stdout: FieldRef<"ChallengeSubmission", 'String'>
    readonly errorDetails: FieldRef<"ChallengeSubmission", 'String'>
    readonly submittedAt: FieldRef<"ChallengeSubmission", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ChallengeSubmission findUnique
   */
  export type ChallengeSubmissionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChallengeSubmission
     */
    select?: ChallengeSubmissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChallengeSubmission
     */
    omit?: ChallengeSubmissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChallengeSubmissionInclude<ExtArgs> | null
    /**
     * Filter, which ChallengeSubmission to fetch.
     */
    where: ChallengeSubmissionWhereUniqueInput
  }

  /**
   * ChallengeSubmission findUniqueOrThrow
   */
  export type ChallengeSubmissionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChallengeSubmission
     */
    select?: ChallengeSubmissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChallengeSubmission
     */
    omit?: ChallengeSubmissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChallengeSubmissionInclude<ExtArgs> | null
    /**
     * Filter, which ChallengeSubmission to fetch.
     */
    where: ChallengeSubmissionWhereUniqueInput
  }

  /**
   * ChallengeSubmission findFirst
   */
  export type ChallengeSubmissionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChallengeSubmission
     */
    select?: ChallengeSubmissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChallengeSubmission
     */
    omit?: ChallengeSubmissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChallengeSubmissionInclude<ExtArgs> | null
    /**
     * Filter, which ChallengeSubmission to fetch.
     */
    where?: ChallengeSubmissionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChallengeSubmissions to fetch.
     */
    orderBy?: ChallengeSubmissionOrderByWithRelationInput | ChallengeSubmissionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ChallengeSubmissions.
     */
    cursor?: ChallengeSubmissionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChallengeSubmissions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChallengeSubmissions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ChallengeSubmissions.
     */
    distinct?: ChallengeSubmissionScalarFieldEnum | ChallengeSubmissionScalarFieldEnum[]
  }

  /**
   * ChallengeSubmission findFirstOrThrow
   */
  export type ChallengeSubmissionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChallengeSubmission
     */
    select?: ChallengeSubmissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChallengeSubmission
     */
    omit?: ChallengeSubmissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChallengeSubmissionInclude<ExtArgs> | null
    /**
     * Filter, which ChallengeSubmission to fetch.
     */
    where?: ChallengeSubmissionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChallengeSubmissions to fetch.
     */
    orderBy?: ChallengeSubmissionOrderByWithRelationInput | ChallengeSubmissionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ChallengeSubmissions.
     */
    cursor?: ChallengeSubmissionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChallengeSubmissions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChallengeSubmissions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ChallengeSubmissions.
     */
    distinct?: ChallengeSubmissionScalarFieldEnum | ChallengeSubmissionScalarFieldEnum[]
  }

  /**
   * ChallengeSubmission findMany
   */
  export type ChallengeSubmissionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChallengeSubmission
     */
    select?: ChallengeSubmissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChallengeSubmission
     */
    omit?: ChallengeSubmissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChallengeSubmissionInclude<ExtArgs> | null
    /**
     * Filter, which ChallengeSubmissions to fetch.
     */
    where?: ChallengeSubmissionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChallengeSubmissions to fetch.
     */
    orderBy?: ChallengeSubmissionOrderByWithRelationInput | ChallengeSubmissionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ChallengeSubmissions.
     */
    cursor?: ChallengeSubmissionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChallengeSubmissions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChallengeSubmissions.
     */
    skip?: number
    distinct?: ChallengeSubmissionScalarFieldEnum | ChallengeSubmissionScalarFieldEnum[]
  }

  /**
   * ChallengeSubmission create
   */
  export type ChallengeSubmissionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChallengeSubmission
     */
    select?: ChallengeSubmissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChallengeSubmission
     */
    omit?: ChallengeSubmissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChallengeSubmissionInclude<ExtArgs> | null
    /**
     * The data needed to create a ChallengeSubmission.
     */
    data: XOR<ChallengeSubmissionCreateInput, ChallengeSubmissionUncheckedCreateInput>
  }

  /**
   * ChallengeSubmission createMany
   */
  export type ChallengeSubmissionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ChallengeSubmissions.
     */
    data: ChallengeSubmissionCreateManyInput | ChallengeSubmissionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ChallengeSubmission createManyAndReturn
   */
  export type ChallengeSubmissionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChallengeSubmission
     */
    select?: ChallengeSubmissionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ChallengeSubmission
     */
    omit?: ChallengeSubmissionOmit<ExtArgs> | null
    /**
     * The data used to create many ChallengeSubmissions.
     */
    data: ChallengeSubmissionCreateManyInput | ChallengeSubmissionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChallengeSubmissionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ChallengeSubmission update
   */
  export type ChallengeSubmissionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChallengeSubmission
     */
    select?: ChallengeSubmissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChallengeSubmission
     */
    omit?: ChallengeSubmissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChallengeSubmissionInclude<ExtArgs> | null
    /**
     * The data needed to update a ChallengeSubmission.
     */
    data: XOR<ChallengeSubmissionUpdateInput, ChallengeSubmissionUncheckedUpdateInput>
    /**
     * Choose, which ChallengeSubmission to update.
     */
    where: ChallengeSubmissionWhereUniqueInput
  }

  /**
   * ChallengeSubmission updateMany
   */
  export type ChallengeSubmissionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ChallengeSubmissions.
     */
    data: XOR<ChallengeSubmissionUpdateManyMutationInput, ChallengeSubmissionUncheckedUpdateManyInput>
    /**
     * Filter which ChallengeSubmissions to update
     */
    where?: ChallengeSubmissionWhereInput
    /**
     * Limit how many ChallengeSubmissions to update.
     */
    limit?: number
  }

  /**
   * ChallengeSubmission updateManyAndReturn
   */
  export type ChallengeSubmissionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChallengeSubmission
     */
    select?: ChallengeSubmissionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ChallengeSubmission
     */
    omit?: ChallengeSubmissionOmit<ExtArgs> | null
    /**
     * The data used to update ChallengeSubmissions.
     */
    data: XOR<ChallengeSubmissionUpdateManyMutationInput, ChallengeSubmissionUncheckedUpdateManyInput>
    /**
     * Filter which ChallengeSubmissions to update
     */
    where?: ChallengeSubmissionWhereInput
    /**
     * Limit how many ChallengeSubmissions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChallengeSubmissionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ChallengeSubmission upsert
   */
  export type ChallengeSubmissionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChallengeSubmission
     */
    select?: ChallengeSubmissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChallengeSubmission
     */
    omit?: ChallengeSubmissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChallengeSubmissionInclude<ExtArgs> | null
    /**
     * The filter to search for the ChallengeSubmission to update in case it exists.
     */
    where: ChallengeSubmissionWhereUniqueInput
    /**
     * In case the ChallengeSubmission found by the `where` argument doesn't exist, create a new ChallengeSubmission with this data.
     */
    create: XOR<ChallengeSubmissionCreateInput, ChallengeSubmissionUncheckedCreateInput>
    /**
     * In case the ChallengeSubmission was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ChallengeSubmissionUpdateInput, ChallengeSubmissionUncheckedUpdateInput>
  }

  /**
   * ChallengeSubmission delete
   */
  export type ChallengeSubmissionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChallengeSubmission
     */
    select?: ChallengeSubmissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChallengeSubmission
     */
    omit?: ChallengeSubmissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChallengeSubmissionInclude<ExtArgs> | null
    /**
     * Filter which ChallengeSubmission to delete.
     */
    where: ChallengeSubmissionWhereUniqueInput
  }

  /**
   * ChallengeSubmission deleteMany
   */
  export type ChallengeSubmissionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ChallengeSubmissions to delete
     */
    where?: ChallengeSubmissionWhereInput
    /**
     * Limit how many ChallengeSubmissions to delete.
     */
    limit?: number
  }

  /**
   * ChallengeSubmission without action
   */
  export type ChallengeSubmissionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChallengeSubmission
     */
    select?: ChallengeSubmissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChallengeSubmission
     */
    omit?: ChallengeSubmissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChallengeSubmissionInclude<ExtArgs> | null
  }


  /**
   * Model QuizTemplate
   */

  export type AggregateQuizTemplate = {
    _count: QuizTemplateCountAggregateOutputType | null
    _avg: QuizTemplateAvgAggregateOutputType | null
    _sum: QuizTemplateSumAggregateOutputType | null
    _min: QuizTemplateMinAggregateOutputType | null
    _max: QuizTemplateMaxAggregateOutputType | null
  }

  export type QuizTemplateAvgAggregateOutputType = {
    timePerQuestion: number | null
    totalQuestions: number | null
  }

  export type QuizTemplateSumAggregateOutputType = {
    timePerQuestion: number | null
    totalQuestions: number | null
  }

  export type QuizTemplateMinAggregateOutputType = {
    id: string | null
    title: string | null
    category: string | null
    difficulty: string | null
    timePerQuestion: number | null
    totalQuestions: number | null
    createdAt: Date | null
  }

  export type QuizTemplateMaxAggregateOutputType = {
    id: string | null
    title: string | null
    category: string | null
    difficulty: string | null
    timePerQuestion: number | null
    totalQuestions: number | null
    createdAt: Date | null
  }

  export type QuizTemplateCountAggregateOutputType = {
    id: number
    title: number
    category: number
    difficulty: number
    timePerQuestion: number
    totalQuestions: number
    createdAt: number
    _all: number
  }


  export type QuizTemplateAvgAggregateInputType = {
    timePerQuestion?: true
    totalQuestions?: true
  }

  export type QuizTemplateSumAggregateInputType = {
    timePerQuestion?: true
    totalQuestions?: true
  }

  export type QuizTemplateMinAggregateInputType = {
    id?: true
    title?: true
    category?: true
    difficulty?: true
    timePerQuestion?: true
    totalQuestions?: true
    createdAt?: true
  }

  export type QuizTemplateMaxAggregateInputType = {
    id?: true
    title?: true
    category?: true
    difficulty?: true
    timePerQuestion?: true
    totalQuestions?: true
    createdAt?: true
  }

  export type QuizTemplateCountAggregateInputType = {
    id?: true
    title?: true
    category?: true
    difficulty?: true
    timePerQuestion?: true
    totalQuestions?: true
    createdAt?: true
    _all?: true
  }

  export type QuizTemplateAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which QuizTemplate to aggregate.
     */
    where?: QuizTemplateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of QuizTemplates to fetch.
     */
    orderBy?: QuizTemplateOrderByWithRelationInput | QuizTemplateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: QuizTemplateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` QuizTemplates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` QuizTemplates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned QuizTemplates
    **/
    _count?: true | QuizTemplateCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: QuizTemplateAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: QuizTemplateSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: QuizTemplateMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: QuizTemplateMaxAggregateInputType
  }

  export type GetQuizTemplateAggregateType<T extends QuizTemplateAggregateArgs> = {
        [P in keyof T & keyof AggregateQuizTemplate]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateQuizTemplate[P]>
      : GetScalarType<T[P], AggregateQuizTemplate[P]>
  }




  export type QuizTemplateGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: QuizTemplateWhereInput
    orderBy?: QuizTemplateOrderByWithAggregationInput | QuizTemplateOrderByWithAggregationInput[]
    by: QuizTemplateScalarFieldEnum[] | QuizTemplateScalarFieldEnum
    having?: QuizTemplateScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: QuizTemplateCountAggregateInputType | true
    _avg?: QuizTemplateAvgAggregateInputType
    _sum?: QuizTemplateSumAggregateInputType
    _min?: QuizTemplateMinAggregateInputType
    _max?: QuizTemplateMaxAggregateInputType
  }

  export type QuizTemplateGroupByOutputType = {
    id: string
    title: string
    category: string
    difficulty: string
    timePerQuestion: number
    totalQuestions: number
    createdAt: Date
    _count: QuizTemplateCountAggregateOutputType | null
    _avg: QuizTemplateAvgAggregateOutputType | null
    _sum: QuizTemplateSumAggregateOutputType | null
    _min: QuizTemplateMinAggregateOutputType | null
    _max: QuizTemplateMaxAggregateOutputType | null
  }

  type GetQuizTemplateGroupByPayload<T extends QuizTemplateGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<QuizTemplateGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof QuizTemplateGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], QuizTemplateGroupByOutputType[P]>
            : GetScalarType<T[P], QuizTemplateGroupByOutputType[P]>
        }
      >
    >


  export type QuizTemplateSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    category?: boolean
    difficulty?: boolean
    timePerQuestion?: boolean
    totalQuestions?: boolean
    createdAt?: boolean
    questions?: boolean | QuizTemplate$questionsArgs<ExtArgs>
    sessions?: boolean | QuizTemplate$sessionsArgs<ExtArgs>
    _count?: boolean | QuizTemplateCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["quizTemplate"]>

  export type QuizTemplateSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    category?: boolean
    difficulty?: boolean
    timePerQuestion?: boolean
    totalQuestions?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["quizTemplate"]>

  export type QuizTemplateSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    category?: boolean
    difficulty?: boolean
    timePerQuestion?: boolean
    totalQuestions?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["quizTemplate"]>

  export type QuizTemplateSelectScalar = {
    id?: boolean
    title?: boolean
    category?: boolean
    difficulty?: boolean
    timePerQuestion?: boolean
    totalQuestions?: boolean
    createdAt?: boolean
  }

  export type QuizTemplateOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "title" | "category" | "difficulty" | "timePerQuestion" | "totalQuestions" | "createdAt", ExtArgs["result"]["quizTemplate"]>
  export type QuizTemplateInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    questions?: boolean | QuizTemplate$questionsArgs<ExtArgs>
    sessions?: boolean | QuizTemplate$sessionsArgs<ExtArgs>
    _count?: boolean | QuizTemplateCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type QuizTemplateIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type QuizTemplateIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $QuizTemplatePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "QuizTemplate"
    objects: {
      questions: Prisma.$QuizQuestionPayload<ExtArgs>[]
      sessions: Prisma.$QuizSessionPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      title: string
      category: string
      difficulty: string
      timePerQuestion: number
      totalQuestions: number
      createdAt: Date
    }, ExtArgs["result"]["quizTemplate"]>
    composites: {}
  }

  type QuizTemplateGetPayload<S extends boolean | null | undefined | QuizTemplateDefaultArgs> = $Result.GetResult<Prisma.$QuizTemplatePayload, S>

  type QuizTemplateCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<QuizTemplateFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: QuizTemplateCountAggregateInputType | true
    }

  export interface QuizTemplateDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['QuizTemplate'], meta: { name: 'QuizTemplate' } }
    /**
     * Find zero or one QuizTemplate that matches the filter.
     * @param {QuizTemplateFindUniqueArgs} args - Arguments to find a QuizTemplate
     * @example
     * // Get one QuizTemplate
     * const quizTemplate = await prisma.quizTemplate.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends QuizTemplateFindUniqueArgs>(args: SelectSubset<T, QuizTemplateFindUniqueArgs<ExtArgs>>): Prisma__QuizTemplateClient<$Result.GetResult<Prisma.$QuizTemplatePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one QuizTemplate that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {QuizTemplateFindUniqueOrThrowArgs} args - Arguments to find a QuizTemplate
     * @example
     * // Get one QuizTemplate
     * const quizTemplate = await prisma.quizTemplate.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends QuizTemplateFindUniqueOrThrowArgs>(args: SelectSubset<T, QuizTemplateFindUniqueOrThrowArgs<ExtArgs>>): Prisma__QuizTemplateClient<$Result.GetResult<Prisma.$QuizTemplatePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first QuizTemplate that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuizTemplateFindFirstArgs} args - Arguments to find a QuizTemplate
     * @example
     * // Get one QuizTemplate
     * const quizTemplate = await prisma.quizTemplate.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends QuizTemplateFindFirstArgs>(args?: SelectSubset<T, QuizTemplateFindFirstArgs<ExtArgs>>): Prisma__QuizTemplateClient<$Result.GetResult<Prisma.$QuizTemplatePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first QuizTemplate that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuizTemplateFindFirstOrThrowArgs} args - Arguments to find a QuizTemplate
     * @example
     * // Get one QuizTemplate
     * const quizTemplate = await prisma.quizTemplate.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends QuizTemplateFindFirstOrThrowArgs>(args?: SelectSubset<T, QuizTemplateFindFirstOrThrowArgs<ExtArgs>>): Prisma__QuizTemplateClient<$Result.GetResult<Prisma.$QuizTemplatePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more QuizTemplates that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuizTemplateFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all QuizTemplates
     * const quizTemplates = await prisma.quizTemplate.findMany()
     * 
     * // Get first 10 QuizTemplates
     * const quizTemplates = await prisma.quizTemplate.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const quizTemplateWithIdOnly = await prisma.quizTemplate.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends QuizTemplateFindManyArgs>(args?: SelectSubset<T, QuizTemplateFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$QuizTemplatePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a QuizTemplate.
     * @param {QuizTemplateCreateArgs} args - Arguments to create a QuizTemplate.
     * @example
     * // Create one QuizTemplate
     * const QuizTemplate = await prisma.quizTemplate.create({
     *   data: {
     *     // ... data to create a QuizTemplate
     *   }
     * })
     * 
     */
    create<T extends QuizTemplateCreateArgs>(args: SelectSubset<T, QuizTemplateCreateArgs<ExtArgs>>): Prisma__QuizTemplateClient<$Result.GetResult<Prisma.$QuizTemplatePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many QuizTemplates.
     * @param {QuizTemplateCreateManyArgs} args - Arguments to create many QuizTemplates.
     * @example
     * // Create many QuizTemplates
     * const quizTemplate = await prisma.quizTemplate.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends QuizTemplateCreateManyArgs>(args?: SelectSubset<T, QuizTemplateCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many QuizTemplates and returns the data saved in the database.
     * @param {QuizTemplateCreateManyAndReturnArgs} args - Arguments to create many QuizTemplates.
     * @example
     * // Create many QuizTemplates
     * const quizTemplate = await prisma.quizTemplate.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many QuizTemplates and only return the `id`
     * const quizTemplateWithIdOnly = await prisma.quizTemplate.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends QuizTemplateCreateManyAndReturnArgs>(args?: SelectSubset<T, QuizTemplateCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$QuizTemplatePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a QuizTemplate.
     * @param {QuizTemplateDeleteArgs} args - Arguments to delete one QuizTemplate.
     * @example
     * // Delete one QuizTemplate
     * const QuizTemplate = await prisma.quizTemplate.delete({
     *   where: {
     *     // ... filter to delete one QuizTemplate
     *   }
     * })
     * 
     */
    delete<T extends QuizTemplateDeleteArgs>(args: SelectSubset<T, QuizTemplateDeleteArgs<ExtArgs>>): Prisma__QuizTemplateClient<$Result.GetResult<Prisma.$QuizTemplatePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one QuizTemplate.
     * @param {QuizTemplateUpdateArgs} args - Arguments to update one QuizTemplate.
     * @example
     * // Update one QuizTemplate
     * const quizTemplate = await prisma.quizTemplate.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends QuizTemplateUpdateArgs>(args: SelectSubset<T, QuizTemplateUpdateArgs<ExtArgs>>): Prisma__QuizTemplateClient<$Result.GetResult<Prisma.$QuizTemplatePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more QuizTemplates.
     * @param {QuizTemplateDeleteManyArgs} args - Arguments to filter QuizTemplates to delete.
     * @example
     * // Delete a few QuizTemplates
     * const { count } = await prisma.quizTemplate.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends QuizTemplateDeleteManyArgs>(args?: SelectSubset<T, QuizTemplateDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more QuizTemplates.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuizTemplateUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many QuizTemplates
     * const quizTemplate = await prisma.quizTemplate.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends QuizTemplateUpdateManyArgs>(args: SelectSubset<T, QuizTemplateUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more QuizTemplates and returns the data updated in the database.
     * @param {QuizTemplateUpdateManyAndReturnArgs} args - Arguments to update many QuizTemplates.
     * @example
     * // Update many QuizTemplates
     * const quizTemplate = await prisma.quizTemplate.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more QuizTemplates and only return the `id`
     * const quizTemplateWithIdOnly = await prisma.quizTemplate.updateManyAndReturn({
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
    updateManyAndReturn<T extends QuizTemplateUpdateManyAndReturnArgs>(args: SelectSubset<T, QuizTemplateUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$QuizTemplatePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one QuizTemplate.
     * @param {QuizTemplateUpsertArgs} args - Arguments to update or create a QuizTemplate.
     * @example
     * // Update or create a QuizTemplate
     * const quizTemplate = await prisma.quizTemplate.upsert({
     *   create: {
     *     // ... data to create a QuizTemplate
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the QuizTemplate we want to update
     *   }
     * })
     */
    upsert<T extends QuizTemplateUpsertArgs>(args: SelectSubset<T, QuizTemplateUpsertArgs<ExtArgs>>): Prisma__QuizTemplateClient<$Result.GetResult<Prisma.$QuizTemplatePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of QuizTemplates.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuizTemplateCountArgs} args - Arguments to filter QuizTemplates to count.
     * @example
     * // Count the number of QuizTemplates
     * const count = await prisma.quizTemplate.count({
     *   where: {
     *     // ... the filter for the QuizTemplates we want to count
     *   }
     * })
    **/
    count<T extends QuizTemplateCountArgs>(
      args?: Subset<T, QuizTemplateCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], QuizTemplateCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a QuizTemplate.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuizTemplateAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends QuizTemplateAggregateArgs>(args: Subset<T, QuizTemplateAggregateArgs>): Prisma.PrismaPromise<GetQuizTemplateAggregateType<T>>

    /**
     * Group by QuizTemplate.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuizTemplateGroupByArgs} args - Group by arguments.
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
      T extends QuizTemplateGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: QuizTemplateGroupByArgs['orderBy'] }
        : { orderBy?: QuizTemplateGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, QuizTemplateGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetQuizTemplateGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the QuizTemplate model
   */
  readonly fields: QuizTemplateFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for QuizTemplate.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__QuizTemplateClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    questions<T extends QuizTemplate$questionsArgs<ExtArgs> = {}>(args?: Subset<T, QuizTemplate$questionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$QuizQuestionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    sessions<T extends QuizTemplate$sessionsArgs<ExtArgs> = {}>(args?: Subset<T, QuizTemplate$sessionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$QuizSessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the QuizTemplate model
   */
  interface QuizTemplateFieldRefs {
    readonly id: FieldRef<"QuizTemplate", 'String'>
    readonly title: FieldRef<"QuizTemplate", 'String'>
    readonly category: FieldRef<"QuizTemplate", 'String'>
    readonly difficulty: FieldRef<"QuizTemplate", 'String'>
    readonly timePerQuestion: FieldRef<"QuizTemplate", 'Int'>
    readonly totalQuestions: FieldRef<"QuizTemplate", 'Int'>
    readonly createdAt: FieldRef<"QuizTemplate", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * QuizTemplate findUnique
   */
  export type QuizTemplateFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuizTemplate
     */
    select?: QuizTemplateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QuizTemplate
     */
    omit?: QuizTemplateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuizTemplateInclude<ExtArgs> | null
    /**
     * Filter, which QuizTemplate to fetch.
     */
    where: QuizTemplateWhereUniqueInput
  }

  /**
   * QuizTemplate findUniqueOrThrow
   */
  export type QuizTemplateFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuizTemplate
     */
    select?: QuizTemplateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QuizTemplate
     */
    omit?: QuizTemplateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuizTemplateInclude<ExtArgs> | null
    /**
     * Filter, which QuizTemplate to fetch.
     */
    where: QuizTemplateWhereUniqueInput
  }

  /**
   * QuizTemplate findFirst
   */
  export type QuizTemplateFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuizTemplate
     */
    select?: QuizTemplateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QuizTemplate
     */
    omit?: QuizTemplateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuizTemplateInclude<ExtArgs> | null
    /**
     * Filter, which QuizTemplate to fetch.
     */
    where?: QuizTemplateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of QuizTemplates to fetch.
     */
    orderBy?: QuizTemplateOrderByWithRelationInput | QuizTemplateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for QuizTemplates.
     */
    cursor?: QuizTemplateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` QuizTemplates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` QuizTemplates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of QuizTemplates.
     */
    distinct?: QuizTemplateScalarFieldEnum | QuizTemplateScalarFieldEnum[]
  }

  /**
   * QuizTemplate findFirstOrThrow
   */
  export type QuizTemplateFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuizTemplate
     */
    select?: QuizTemplateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QuizTemplate
     */
    omit?: QuizTemplateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuizTemplateInclude<ExtArgs> | null
    /**
     * Filter, which QuizTemplate to fetch.
     */
    where?: QuizTemplateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of QuizTemplates to fetch.
     */
    orderBy?: QuizTemplateOrderByWithRelationInput | QuizTemplateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for QuizTemplates.
     */
    cursor?: QuizTemplateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` QuizTemplates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` QuizTemplates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of QuizTemplates.
     */
    distinct?: QuizTemplateScalarFieldEnum | QuizTemplateScalarFieldEnum[]
  }

  /**
   * QuizTemplate findMany
   */
  export type QuizTemplateFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuizTemplate
     */
    select?: QuizTemplateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QuizTemplate
     */
    omit?: QuizTemplateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuizTemplateInclude<ExtArgs> | null
    /**
     * Filter, which QuizTemplates to fetch.
     */
    where?: QuizTemplateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of QuizTemplates to fetch.
     */
    orderBy?: QuizTemplateOrderByWithRelationInput | QuizTemplateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing QuizTemplates.
     */
    cursor?: QuizTemplateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` QuizTemplates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` QuizTemplates.
     */
    skip?: number
    distinct?: QuizTemplateScalarFieldEnum | QuizTemplateScalarFieldEnum[]
  }

  /**
   * QuizTemplate create
   */
  export type QuizTemplateCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuizTemplate
     */
    select?: QuizTemplateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QuizTemplate
     */
    omit?: QuizTemplateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuizTemplateInclude<ExtArgs> | null
    /**
     * The data needed to create a QuizTemplate.
     */
    data: XOR<QuizTemplateCreateInput, QuizTemplateUncheckedCreateInput>
  }

  /**
   * QuizTemplate createMany
   */
  export type QuizTemplateCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many QuizTemplates.
     */
    data: QuizTemplateCreateManyInput | QuizTemplateCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * QuizTemplate createManyAndReturn
   */
  export type QuizTemplateCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuizTemplate
     */
    select?: QuizTemplateSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the QuizTemplate
     */
    omit?: QuizTemplateOmit<ExtArgs> | null
    /**
     * The data used to create many QuizTemplates.
     */
    data: QuizTemplateCreateManyInput | QuizTemplateCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * QuizTemplate update
   */
  export type QuizTemplateUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuizTemplate
     */
    select?: QuizTemplateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QuizTemplate
     */
    omit?: QuizTemplateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuizTemplateInclude<ExtArgs> | null
    /**
     * The data needed to update a QuizTemplate.
     */
    data: XOR<QuizTemplateUpdateInput, QuizTemplateUncheckedUpdateInput>
    /**
     * Choose, which QuizTemplate to update.
     */
    where: QuizTemplateWhereUniqueInput
  }

  /**
   * QuizTemplate updateMany
   */
  export type QuizTemplateUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update QuizTemplates.
     */
    data: XOR<QuizTemplateUpdateManyMutationInput, QuizTemplateUncheckedUpdateManyInput>
    /**
     * Filter which QuizTemplates to update
     */
    where?: QuizTemplateWhereInput
    /**
     * Limit how many QuizTemplates to update.
     */
    limit?: number
  }

  /**
   * QuizTemplate updateManyAndReturn
   */
  export type QuizTemplateUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuizTemplate
     */
    select?: QuizTemplateSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the QuizTemplate
     */
    omit?: QuizTemplateOmit<ExtArgs> | null
    /**
     * The data used to update QuizTemplates.
     */
    data: XOR<QuizTemplateUpdateManyMutationInput, QuizTemplateUncheckedUpdateManyInput>
    /**
     * Filter which QuizTemplates to update
     */
    where?: QuizTemplateWhereInput
    /**
     * Limit how many QuizTemplates to update.
     */
    limit?: number
  }

  /**
   * QuizTemplate upsert
   */
  export type QuizTemplateUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuizTemplate
     */
    select?: QuizTemplateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QuizTemplate
     */
    omit?: QuizTemplateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuizTemplateInclude<ExtArgs> | null
    /**
     * The filter to search for the QuizTemplate to update in case it exists.
     */
    where: QuizTemplateWhereUniqueInput
    /**
     * In case the QuizTemplate found by the `where` argument doesn't exist, create a new QuizTemplate with this data.
     */
    create: XOR<QuizTemplateCreateInput, QuizTemplateUncheckedCreateInput>
    /**
     * In case the QuizTemplate was found with the provided `where` argument, update it with this data.
     */
    update: XOR<QuizTemplateUpdateInput, QuizTemplateUncheckedUpdateInput>
  }

  /**
   * QuizTemplate delete
   */
  export type QuizTemplateDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuizTemplate
     */
    select?: QuizTemplateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QuizTemplate
     */
    omit?: QuizTemplateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuizTemplateInclude<ExtArgs> | null
    /**
     * Filter which QuizTemplate to delete.
     */
    where: QuizTemplateWhereUniqueInput
  }

  /**
   * QuizTemplate deleteMany
   */
  export type QuizTemplateDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which QuizTemplates to delete
     */
    where?: QuizTemplateWhereInput
    /**
     * Limit how many QuizTemplates to delete.
     */
    limit?: number
  }

  /**
   * QuizTemplate.questions
   */
  export type QuizTemplate$questionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuizQuestion
     */
    select?: QuizQuestionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QuizQuestion
     */
    omit?: QuizQuestionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuizQuestionInclude<ExtArgs> | null
    where?: QuizQuestionWhereInput
    orderBy?: QuizQuestionOrderByWithRelationInput | QuizQuestionOrderByWithRelationInput[]
    cursor?: QuizQuestionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: QuizQuestionScalarFieldEnum | QuizQuestionScalarFieldEnum[]
  }

  /**
   * QuizTemplate.sessions
   */
  export type QuizTemplate$sessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuizSession
     */
    select?: QuizSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QuizSession
     */
    omit?: QuizSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuizSessionInclude<ExtArgs> | null
    where?: QuizSessionWhereInput
    orderBy?: QuizSessionOrderByWithRelationInput | QuizSessionOrderByWithRelationInput[]
    cursor?: QuizSessionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: QuizSessionScalarFieldEnum | QuizSessionScalarFieldEnum[]
  }

  /**
   * QuizTemplate without action
   */
  export type QuizTemplateDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuizTemplate
     */
    select?: QuizTemplateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QuizTemplate
     */
    omit?: QuizTemplateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuizTemplateInclude<ExtArgs> | null
  }


  /**
   * Model QuizQuestion
   */

  export type AggregateQuizQuestion = {
    _count: QuizQuestionCountAggregateOutputType | null
    _avg: QuizQuestionAvgAggregateOutputType | null
    _sum: QuizQuestionSumAggregateOutputType | null
    _min: QuizQuestionMinAggregateOutputType | null
    _max: QuizQuestionMaxAggregateOutputType | null
  }

  export type QuizQuestionAvgAggregateOutputType = {
    correctIndex: number | null
  }

  export type QuizQuestionSumAggregateOutputType = {
    correctIndex: number | null
  }

  export type QuizQuestionMinAggregateOutputType = {
    id: string | null
    quizId: string | null
    question: string | null
    correctIndex: number | null
    explanation: string | null
    topic: string | null
    difficulty: string | null
  }

  export type QuizQuestionMaxAggregateOutputType = {
    id: string | null
    quizId: string | null
    question: string | null
    correctIndex: number | null
    explanation: string | null
    topic: string | null
    difficulty: string | null
  }

  export type QuizQuestionCountAggregateOutputType = {
    id: number
    quizId: number
    question: number
    options: number
    correctIndex: number
    explanation: number
    topic: number
    difficulty: number
    _all: number
  }


  export type QuizQuestionAvgAggregateInputType = {
    correctIndex?: true
  }

  export type QuizQuestionSumAggregateInputType = {
    correctIndex?: true
  }

  export type QuizQuestionMinAggregateInputType = {
    id?: true
    quizId?: true
    question?: true
    correctIndex?: true
    explanation?: true
    topic?: true
    difficulty?: true
  }

  export type QuizQuestionMaxAggregateInputType = {
    id?: true
    quizId?: true
    question?: true
    correctIndex?: true
    explanation?: true
    topic?: true
    difficulty?: true
  }

  export type QuizQuestionCountAggregateInputType = {
    id?: true
    quizId?: true
    question?: true
    options?: true
    correctIndex?: true
    explanation?: true
    topic?: true
    difficulty?: true
    _all?: true
  }

  export type QuizQuestionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which QuizQuestion to aggregate.
     */
    where?: QuizQuestionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of QuizQuestions to fetch.
     */
    orderBy?: QuizQuestionOrderByWithRelationInput | QuizQuestionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: QuizQuestionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` QuizQuestions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` QuizQuestions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned QuizQuestions
    **/
    _count?: true | QuizQuestionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: QuizQuestionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: QuizQuestionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: QuizQuestionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: QuizQuestionMaxAggregateInputType
  }

  export type GetQuizQuestionAggregateType<T extends QuizQuestionAggregateArgs> = {
        [P in keyof T & keyof AggregateQuizQuestion]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateQuizQuestion[P]>
      : GetScalarType<T[P], AggregateQuizQuestion[P]>
  }




  export type QuizQuestionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: QuizQuestionWhereInput
    orderBy?: QuizQuestionOrderByWithAggregationInput | QuizQuestionOrderByWithAggregationInput[]
    by: QuizQuestionScalarFieldEnum[] | QuizQuestionScalarFieldEnum
    having?: QuizQuestionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: QuizQuestionCountAggregateInputType | true
    _avg?: QuizQuestionAvgAggregateInputType
    _sum?: QuizQuestionSumAggregateInputType
    _min?: QuizQuestionMinAggregateInputType
    _max?: QuizQuestionMaxAggregateInputType
  }

  export type QuizQuestionGroupByOutputType = {
    id: string
    quizId: string
    question: string
    options: string[]
    correctIndex: number
    explanation: string
    topic: string
    difficulty: string
    _count: QuizQuestionCountAggregateOutputType | null
    _avg: QuizQuestionAvgAggregateOutputType | null
    _sum: QuizQuestionSumAggregateOutputType | null
    _min: QuizQuestionMinAggregateOutputType | null
    _max: QuizQuestionMaxAggregateOutputType | null
  }

  type GetQuizQuestionGroupByPayload<T extends QuizQuestionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<QuizQuestionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof QuizQuestionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], QuizQuestionGroupByOutputType[P]>
            : GetScalarType<T[P], QuizQuestionGroupByOutputType[P]>
        }
      >
    >


  export type QuizQuestionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    quizId?: boolean
    question?: boolean
    options?: boolean
    correctIndex?: boolean
    explanation?: boolean
    topic?: boolean
    difficulty?: boolean
    quiz?: boolean | QuizTemplateDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["quizQuestion"]>

  export type QuizQuestionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    quizId?: boolean
    question?: boolean
    options?: boolean
    correctIndex?: boolean
    explanation?: boolean
    topic?: boolean
    difficulty?: boolean
    quiz?: boolean | QuizTemplateDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["quizQuestion"]>

  export type QuizQuestionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    quizId?: boolean
    question?: boolean
    options?: boolean
    correctIndex?: boolean
    explanation?: boolean
    topic?: boolean
    difficulty?: boolean
    quiz?: boolean | QuizTemplateDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["quizQuestion"]>

  export type QuizQuestionSelectScalar = {
    id?: boolean
    quizId?: boolean
    question?: boolean
    options?: boolean
    correctIndex?: boolean
    explanation?: boolean
    topic?: boolean
    difficulty?: boolean
  }

  export type QuizQuestionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "quizId" | "question" | "options" | "correctIndex" | "explanation" | "topic" | "difficulty", ExtArgs["result"]["quizQuestion"]>
  export type QuizQuestionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    quiz?: boolean | QuizTemplateDefaultArgs<ExtArgs>
  }
  export type QuizQuestionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    quiz?: boolean | QuizTemplateDefaultArgs<ExtArgs>
  }
  export type QuizQuestionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    quiz?: boolean | QuizTemplateDefaultArgs<ExtArgs>
  }

  export type $QuizQuestionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "QuizQuestion"
    objects: {
      quiz: Prisma.$QuizTemplatePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      quizId: string
      question: string
      options: string[]
      correctIndex: number
      explanation: string
      topic: string
      difficulty: string
    }, ExtArgs["result"]["quizQuestion"]>
    composites: {}
  }

  type QuizQuestionGetPayload<S extends boolean | null | undefined | QuizQuestionDefaultArgs> = $Result.GetResult<Prisma.$QuizQuestionPayload, S>

  type QuizQuestionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<QuizQuestionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: QuizQuestionCountAggregateInputType | true
    }

  export interface QuizQuestionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['QuizQuestion'], meta: { name: 'QuizQuestion' } }
    /**
     * Find zero or one QuizQuestion that matches the filter.
     * @param {QuizQuestionFindUniqueArgs} args - Arguments to find a QuizQuestion
     * @example
     * // Get one QuizQuestion
     * const quizQuestion = await prisma.quizQuestion.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends QuizQuestionFindUniqueArgs>(args: SelectSubset<T, QuizQuestionFindUniqueArgs<ExtArgs>>): Prisma__QuizQuestionClient<$Result.GetResult<Prisma.$QuizQuestionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one QuizQuestion that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {QuizQuestionFindUniqueOrThrowArgs} args - Arguments to find a QuizQuestion
     * @example
     * // Get one QuizQuestion
     * const quizQuestion = await prisma.quizQuestion.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends QuizQuestionFindUniqueOrThrowArgs>(args: SelectSubset<T, QuizQuestionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__QuizQuestionClient<$Result.GetResult<Prisma.$QuizQuestionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first QuizQuestion that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuizQuestionFindFirstArgs} args - Arguments to find a QuizQuestion
     * @example
     * // Get one QuizQuestion
     * const quizQuestion = await prisma.quizQuestion.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends QuizQuestionFindFirstArgs>(args?: SelectSubset<T, QuizQuestionFindFirstArgs<ExtArgs>>): Prisma__QuizQuestionClient<$Result.GetResult<Prisma.$QuizQuestionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first QuizQuestion that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuizQuestionFindFirstOrThrowArgs} args - Arguments to find a QuizQuestion
     * @example
     * // Get one QuizQuestion
     * const quizQuestion = await prisma.quizQuestion.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends QuizQuestionFindFirstOrThrowArgs>(args?: SelectSubset<T, QuizQuestionFindFirstOrThrowArgs<ExtArgs>>): Prisma__QuizQuestionClient<$Result.GetResult<Prisma.$QuizQuestionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more QuizQuestions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuizQuestionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all QuizQuestions
     * const quizQuestions = await prisma.quizQuestion.findMany()
     * 
     * // Get first 10 QuizQuestions
     * const quizQuestions = await prisma.quizQuestion.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const quizQuestionWithIdOnly = await prisma.quizQuestion.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends QuizQuestionFindManyArgs>(args?: SelectSubset<T, QuizQuestionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$QuizQuestionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a QuizQuestion.
     * @param {QuizQuestionCreateArgs} args - Arguments to create a QuizQuestion.
     * @example
     * // Create one QuizQuestion
     * const QuizQuestion = await prisma.quizQuestion.create({
     *   data: {
     *     // ... data to create a QuizQuestion
     *   }
     * })
     * 
     */
    create<T extends QuizQuestionCreateArgs>(args: SelectSubset<T, QuizQuestionCreateArgs<ExtArgs>>): Prisma__QuizQuestionClient<$Result.GetResult<Prisma.$QuizQuestionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many QuizQuestions.
     * @param {QuizQuestionCreateManyArgs} args - Arguments to create many QuizQuestions.
     * @example
     * // Create many QuizQuestions
     * const quizQuestion = await prisma.quizQuestion.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends QuizQuestionCreateManyArgs>(args?: SelectSubset<T, QuizQuestionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many QuizQuestions and returns the data saved in the database.
     * @param {QuizQuestionCreateManyAndReturnArgs} args - Arguments to create many QuizQuestions.
     * @example
     * // Create many QuizQuestions
     * const quizQuestion = await prisma.quizQuestion.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many QuizQuestions and only return the `id`
     * const quizQuestionWithIdOnly = await prisma.quizQuestion.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends QuizQuestionCreateManyAndReturnArgs>(args?: SelectSubset<T, QuizQuestionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$QuizQuestionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a QuizQuestion.
     * @param {QuizQuestionDeleteArgs} args - Arguments to delete one QuizQuestion.
     * @example
     * // Delete one QuizQuestion
     * const QuizQuestion = await prisma.quizQuestion.delete({
     *   where: {
     *     // ... filter to delete one QuizQuestion
     *   }
     * })
     * 
     */
    delete<T extends QuizQuestionDeleteArgs>(args: SelectSubset<T, QuizQuestionDeleteArgs<ExtArgs>>): Prisma__QuizQuestionClient<$Result.GetResult<Prisma.$QuizQuestionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one QuizQuestion.
     * @param {QuizQuestionUpdateArgs} args - Arguments to update one QuizQuestion.
     * @example
     * // Update one QuizQuestion
     * const quizQuestion = await prisma.quizQuestion.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends QuizQuestionUpdateArgs>(args: SelectSubset<T, QuizQuestionUpdateArgs<ExtArgs>>): Prisma__QuizQuestionClient<$Result.GetResult<Prisma.$QuizQuestionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more QuizQuestions.
     * @param {QuizQuestionDeleteManyArgs} args - Arguments to filter QuizQuestions to delete.
     * @example
     * // Delete a few QuizQuestions
     * const { count } = await prisma.quizQuestion.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends QuizQuestionDeleteManyArgs>(args?: SelectSubset<T, QuizQuestionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more QuizQuestions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuizQuestionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many QuizQuestions
     * const quizQuestion = await prisma.quizQuestion.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends QuizQuestionUpdateManyArgs>(args: SelectSubset<T, QuizQuestionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more QuizQuestions and returns the data updated in the database.
     * @param {QuizQuestionUpdateManyAndReturnArgs} args - Arguments to update many QuizQuestions.
     * @example
     * // Update many QuizQuestions
     * const quizQuestion = await prisma.quizQuestion.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more QuizQuestions and only return the `id`
     * const quizQuestionWithIdOnly = await prisma.quizQuestion.updateManyAndReturn({
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
    updateManyAndReturn<T extends QuizQuestionUpdateManyAndReturnArgs>(args: SelectSubset<T, QuizQuestionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$QuizQuestionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one QuizQuestion.
     * @param {QuizQuestionUpsertArgs} args - Arguments to update or create a QuizQuestion.
     * @example
     * // Update or create a QuizQuestion
     * const quizQuestion = await prisma.quizQuestion.upsert({
     *   create: {
     *     // ... data to create a QuizQuestion
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the QuizQuestion we want to update
     *   }
     * })
     */
    upsert<T extends QuizQuestionUpsertArgs>(args: SelectSubset<T, QuizQuestionUpsertArgs<ExtArgs>>): Prisma__QuizQuestionClient<$Result.GetResult<Prisma.$QuizQuestionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of QuizQuestions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuizQuestionCountArgs} args - Arguments to filter QuizQuestions to count.
     * @example
     * // Count the number of QuizQuestions
     * const count = await prisma.quizQuestion.count({
     *   where: {
     *     // ... the filter for the QuizQuestions we want to count
     *   }
     * })
    **/
    count<T extends QuizQuestionCountArgs>(
      args?: Subset<T, QuizQuestionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], QuizQuestionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a QuizQuestion.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuizQuestionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends QuizQuestionAggregateArgs>(args: Subset<T, QuizQuestionAggregateArgs>): Prisma.PrismaPromise<GetQuizQuestionAggregateType<T>>

    /**
     * Group by QuizQuestion.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuizQuestionGroupByArgs} args - Group by arguments.
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
      T extends QuizQuestionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: QuizQuestionGroupByArgs['orderBy'] }
        : { orderBy?: QuizQuestionGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, QuizQuestionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetQuizQuestionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the QuizQuestion model
   */
  readonly fields: QuizQuestionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for QuizQuestion.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__QuizQuestionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    quiz<T extends QuizTemplateDefaultArgs<ExtArgs> = {}>(args?: Subset<T, QuizTemplateDefaultArgs<ExtArgs>>): Prisma__QuizTemplateClient<$Result.GetResult<Prisma.$QuizTemplatePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the QuizQuestion model
   */
  interface QuizQuestionFieldRefs {
    readonly id: FieldRef<"QuizQuestion", 'String'>
    readonly quizId: FieldRef<"QuizQuestion", 'String'>
    readonly question: FieldRef<"QuizQuestion", 'String'>
    readonly options: FieldRef<"QuizQuestion", 'String[]'>
    readonly correctIndex: FieldRef<"QuizQuestion", 'Int'>
    readonly explanation: FieldRef<"QuizQuestion", 'String'>
    readonly topic: FieldRef<"QuizQuestion", 'String'>
    readonly difficulty: FieldRef<"QuizQuestion", 'String'>
  }
    

  // Custom InputTypes
  /**
   * QuizQuestion findUnique
   */
  export type QuizQuestionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuizQuestion
     */
    select?: QuizQuestionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QuizQuestion
     */
    omit?: QuizQuestionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuizQuestionInclude<ExtArgs> | null
    /**
     * Filter, which QuizQuestion to fetch.
     */
    where: QuizQuestionWhereUniqueInput
  }

  /**
   * QuizQuestion findUniqueOrThrow
   */
  export type QuizQuestionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuizQuestion
     */
    select?: QuizQuestionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QuizQuestion
     */
    omit?: QuizQuestionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuizQuestionInclude<ExtArgs> | null
    /**
     * Filter, which QuizQuestion to fetch.
     */
    where: QuizQuestionWhereUniqueInput
  }

  /**
   * QuizQuestion findFirst
   */
  export type QuizQuestionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuizQuestion
     */
    select?: QuizQuestionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QuizQuestion
     */
    omit?: QuizQuestionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuizQuestionInclude<ExtArgs> | null
    /**
     * Filter, which QuizQuestion to fetch.
     */
    where?: QuizQuestionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of QuizQuestions to fetch.
     */
    orderBy?: QuizQuestionOrderByWithRelationInput | QuizQuestionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for QuizQuestions.
     */
    cursor?: QuizQuestionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` QuizQuestions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` QuizQuestions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of QuizQuestions.
     */
    distinct?: QuizQuestionScalarFieldEnum | QuizQuestionScalarFieldEnum[]
  }

  /**
   * QuizQuestion findFirstOrThrow
   */
  export type QuizQuestionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuizQuestion
     */
    select?: QuizQuestionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QuizQuestion
     */
    omit?: QuizQuestionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuizQuestionInclude<ExtArgs> | null
    /**
     * Filter, which QuizQuestion to fetch.
     */
    where?: QuizQuestionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of QuizQuestions to fetch.
     */
    orderBy?: QuizQuestionOrderByWithRelationInput | QuizQuestionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for QuizQuestions.
     */
    cursor?: QuizQuestionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` QuizQuestions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` QuizQuestions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of QuizQuestions.
     */
    distinct?: QuizQuestionScalarFieldEnum | QuizQuestionScalarFieldEnum[]
  }

  /**
   * QuizQuestion findMany
   */
  export type QuizQuestionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuizQuestion
     */
    select?: QuizQuestionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QuizQuestion
     */
    omit?: QuizQuestionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuizQuestionInclude<ExtArgs> | null
    /**
     * Filter, which QuizQuestions to fetch.
     */
    where?: QuizQuestionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of QuizQuestions to fetch.
     */
    orderBy?: QuizQuestionOrderByWithRelationInput | QuizQuestionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing QuizQuestions.
     */
    cursor?: QuizQuestionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` QuizQuestions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` QuizQuestions.
     */
    skip?: number
    distinct?: QuizQuestionScalarFieldEnum | QuizQuestionScalarFieldEnum[]
  }

  /**
   * QuizQuestion create
   */
  export type QuizQuestionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuizQuestion
     */
    select?: QuizQuestionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QuizQuestion
     */
    omit?: QuizQuestionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuizQuestionInclude<ExtArgs> | null
    /**
     * The data needed to create a QuizQuestion.
     */
    data: XOR<QuizQuestionCreateInput, QuizQuestionUncheckedCreateInput>
  }

  /**
   * QuizQuestion createMany
   */
  export type QuizQuestionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many QuizQuestions.
     */
    data: QuizQuestionCreateManyInput | QuizQuestionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * QuizQuestion createManyAndReturn
   */
  export type QuizQuestionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuizQuestion
     */
    select?: QuizQuestionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the QuizQuestion
     */
    omit?: QuizQuestionOmit<ExtArgs> | null
    /**
     * The data used to create many QuizQuestions.
     */
    data: QuizQuestionCreateManyInput | QuizQuestionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuizQuestionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * QuizQuestion update
   */
  export type QuizQuestionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuizQuestion
     */
    select?: QuizQuestionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QuizQuestion
     */
    omit?: QuizQuestionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuizQuestionInclude<ExtArgs> | null
    /**
     * The data needed to update a QuizQuestion.
     */
    data: XOR<QuizQuestionUpdateInput, QuizQuestionUncheckedUpdateInput>
    /**
     * Choose, which QuizQuestion to update.
     */
    where: QuizQuestionWhereUniqueInput
  }

  /**
   * QuizQuestion updateMany
   */
  export type QuizQuestionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update QuizQuestions.
     */
    data: XOR<QuizQuestionUpdateManyMutationInput, QuizQuestionUncheckedUpdateManyInput>
    /**
     * Filter which QuizQuestions to update
     */
    where?: QuizQuestionWhereInput
    /**
     * Limit how many QuizQuestions to update.
     */
    limit?: number
  }

  /**
   * QuizQuestion updateManyAndReturn
   */
  export type QuizQuestionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuizQuestion
     */
    select?: QuizQuestionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the QuizQuestion
     */
    omit?: QuizQuestionOmit<ExtArgs> | null
    /**
     * The data used to update QuizQuestions.
     */
    data: XOR<QuizQuestionUpdateManyMutationInput, QuizQuestionUncheckedUpdateManyInput>
    /**
     * Filter which QuizQuestions to update
     */
    where?: QuizQuestionWhereInput
    /**
     * Limit how many QuizQuestions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuizQuestionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * QuizQuestion upsert
   */
  export type QuizQuestionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuizQuestion
     */
    select?: QuizQuestionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QuizQuestion
     */
    omit?: QuizQuestionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuizQuestionInclude<ExtArgs> | null
    /**
     * The filter to search for the QuizQuestion to update in case it exists.
     */
    where: QuizQuestionWhereUniqueInput
    /**
     * In case the QuizQuestion found by the `where` argument doesn't exist, create a new QuizQuestion with this data.
     */
    create: XOR<QuizQuestionCreateInput, QuizQuestionUncheckedCreateInput>
    /**
     * In case the QuizQuestion was found with the provided `where` argument, update it with this data.
     */
    update: XOR<QuizQuestionUpdateInput, QuizQuestionUncheckedUpdateInput>
  }

  /**
   * QuizQuestion delete
   */
  export type QuizQuestionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuizQuestion
     */
    select?: QuizQuestionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QuizQuestion
     */
    omit?: QuizQuestionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuizQuestionInclude<ExtArgs> | null
    /**
     * Filter which QuizQuestion to delete.
     */
    where: QuizQuestionWhereUniqueInput
  }

  /**
   * QuizQuestion deleteMany
   */
  export type QuizQuestionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which QuizQuestions to delete
     */
    where?: QuizQuestionWhereInput
    /**
     * Limit how many QuizQuestions to delete.
     */
    limit?: number
  }

  /**
   * QuizQuestion without action
   */
  export type QuizQuestionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuizQuestion
     */
    select?: QuizQuestionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QuizQuestion
     */
    omit?: QuizQuestionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuizQuestionInclude<ExtArgs> | null
  }


  /**
   * Model QuizSession
   */

  export type AggregateQuizSession = {
    _count: QuizSessionCountAggregateOutputType | null
    _avg: QuizSessionAvgAggregateOutputType | null
    _sum: QuizSessionSumAggregateOutputType | null
    _min: QuizSessionMinAggregateOutputType | null
    _max: QuizSessionMaxAggregateOutputType | null
  }

  export type QuizSessionAvgAggregateOutputType = {
    currentQuestion: number | null
    durationSeconds: number | null
  }

  export type QuizSessionSumAggregateOutputType = {
    currentQuestion: number | null
    durationSeconds: number | null
  }

  export type QuizSessionMinAggregateOutputType = {
    id: string | null
    quizId: string | null
    roomCode: string | null
    status: string | null
    currentQuestion: number | null
    startedAt: Date | null
    endedAt: Date | null
    durationSeconds: number | null
    createdAt: Date | null
  }

  export type QuizSessionMaxAggregateOutputType = {
    id: string | null
    quizId: string | null
    roomCode: string | null
    status: string | null
    currentQuestion: number | null
    startedAt: Date | null
    endedAt: Date | null
    durationSeconds: number | null
    createdAt: Date | null
  }

  export type QuizSessionCountAggregateOutputType = {
    id: number
    quizId: number
    roomCode: number
    status: number
    currentQuestion: number
    startedAt: number
    endedAt: number
    durationSeconds: number
    createdAt: number
    _all: number
  }


  export type QuizSessionAvgAggregateInputType = {
    currentQuestion?: true
    durationSeconds?: true
  }

  export type QuizSessionSumAggregateInputType = {
    currentQuestion?: true
    durationSeconds?: true
  }

  export type QuizSessionMinAggregateInputType = {
    id?: true
    quizId?: true
    roomCode?: true
    status?: true
    currentQuestion?: true
    startedAt?: true
    endedAt?: true
    durationSeconds?: true
    createdAt?: true
  }

  export type QuizSessionMaxAggregateInputType = {
    id?: true
    quizId?: true
    roomCode?: true
    status?: true
    currentQuestion?: true
    startedAt?: true
    endedAt?: true
    durationSeconds?: true
    createdAt?: true
  }

  export type QuizSessionCountAggregateInputType = {
    id?: true
    quizId?: true
    roomCode?: true
    status?: true
    currentQuestion?: true
    startedAt?: true
    endedAt?: true
    durationSeconds?: true
    createdAt?: true
    _all?: true
  }

  export type QuizSessionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which QuizSession to aggregate.
     */
    where?: QuizSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of QuizSessions to fetch.
     */
    orderBy?: QuizSessionOrderByWithRelationInput | QuizSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: QuizSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` QuizSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` QuizSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned QuizSessions
    **/
    _count?: true | QuizSessionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: QuizSessionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: QuizSessionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: QuizSessionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: QuizSessionMaxAggregateInputType
  }

  export type GetQuizSessionAggregateType<T extends QuizSessionAggregateArgs> = {
        [P in keyof T & keyof AggregateQuizSession]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateQuizSession[P]>
      : GetScalarType<T[P], AggregateQuizSession[P]>
  }




  export type QuizSessionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: QuizSessionWhereInput
    orderBy?: QuizSessionOrderByWithAggregationInput | QuizSessionOrderByWithAggregationInput[]
    by: QuizSessionScalarFieldEnum[] | QuizSessionScalarFieldEnum
    having?: QuizSessionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: QuizSessionCountAggregateInputType | true
    _avg?: QuizSessionAvgAggregateInputType
    _sum?: QuizSessionSumAggregateInputType
    _min?: QuizSessionMinAggregateInputType
    _max?: QuizSessionMaxAggregateInputType
  }

  export type QuizSessionGroupByOutputType = {
    id: string
    quizId: string
    roomCode: string | null
    status: string
    currentQuestion: number
    startedAt: Date | null
    endedAt: Date | null
    durationSeconds: number
    createdAt: Date
    _count: QuizSessionCountAggregateOutputType | null
    _avg: QuizSessionAvgAggregateOutputType | null
    _sum: QuizSessionSumAggregateOutputType | null
    _min: QuizSessionMinAggregateOutputType | null
    _max: QuizSessionMaxAggregateOutputType | null
  }

  type GetQuizSessionGroupByPayload<T extends QuizSessionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<QuizSessionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof QuizSessionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], QuizSessionGroupByOutputType[P]>
            : GetScalarType<T[P], QuizSessionGroupByOutputType[P]>
        }
      >
    >


  export type QuizSessionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    quizId?: boolean
    roomCode?: boolean
    status?: boolean
    currentQuestion?: boolean
    startedAt?: boolean
    endedAt?: boolean
    durationSeconds?: boolean
    createdAt?: boolean
    quiz?: boolean | QuizTemplateDefaultArgs<ExtArgs>
    answers?: boolean | QuizSession$answersArgs<ExtArgs>
    _count?: boolean | QuizSessionCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["quizSession"]>

  export type QuizSessionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    quizId?: boolean
    roomCode?: boolean
    status?: boolean
    currentQuestion?: boolean
    startedAt?: boolean
    endedAt?: boolean
    durationSeconds?: boolean
    createdAt?: boolean
    quiz?: boolean | QuizTemplateDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["quizSession"]>

  export type QuizSessionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    quizId?: boolean
    roomCode?: boolean
    status?: boolean
    currentQuestion?: boolean
    startedAt?: boolean
    endedAt?: boolean
    durationSeconds?: boolean
    createdAt?: boolean
    quiz?: boolean | QuizTemplateDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["quizSession"]>

  export type QuizSessionSelectScalar = {
    id?: boolean
    quizId?: boolean
    roomCode?: boolean
    status?: boolean
    currentQuestion?: boolean
    startedAt?: boolean
    endedAt?: boolean
    durationSeconds?: boolean
    createdAt?: boolean
  }

  export type QuizSessionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "quizId" | "roomCode" | "status" | "currentQuestion" | "startedAt" | "endedAt" | "durationSeconds" | "createdAt", ExtArgs["result"]["quizSession"]>
  export type QuizSessionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    quiz?: boolean | QuizTemplateDefaultArgs<ExtArgs>
    answers?: boolean | QuizSession$answersArgs<ExtArgs>
    _count?: boolean | QuizSessionCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type QuizSessionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    quiz?: boolean | QuizTemplateDefaultArgs<ExtArgs>
  }
  export type QuizSessionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    quiz?: boolean | QuizTemplateDefaultArgs<ExtArgs>
  }

  export type $QuizSessionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "QuizSession"
    objects: {
      quiz: Prisma.$QuizTemplatePayload<ExtArgs>
      answers: Prisma.$QuizAnswerPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      quizId: string
      roomCode: string | null
      status: string
      currentQuestion: number
      startedAt: Date | null
      endedAt: Date | null
      durationSeconds: number
      createdAt: Date
    }, ExtArgs["result"]["quizSession"]>
    composites: {}
  }

  type QuizSessionGetPayload<S extends boolean | null | undefined | QuizSessionDefaultArgs> = $Result.GetResult<Prisma.$QuizSessionPayload, S>

  type QuizSessionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<QuizSessionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: QuizSessionCountAggregateInputType | true
    }

  export interface QuizSessionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['QuizSession'], meta: { name: 'QuizSession' } }
    /**
     * Find zero or one QuizSession that matches the filter.
     * @param {QuizSessionFindUniqueArgs} args - Arguments to find a QuizSession
     * @example
     * // Get one QuizSession
     * const quizSession = await prisma.quizSession.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends QuizSessionFindUniqueArgs>(args: SelectSubset<T, QuizSessionFindUniqueArgs<ExtArgs>>): Prisma__QuizSessionClient<$Result.GetResult<Prisma.$QuizSessionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one QuizSession that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {QuizSessionFindUniqueOrThrowArgs} args - Arguments to find a QuizSession
     * @example
     * // Get one QuizSession
     * const quizSession = await prisma.quizSession.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends QuizSessionFindUniqueOrThrowArgs>(args: SelectSubset<T, QuizSessionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__QuizSessionClient<$Result.GetResult<Prisma.$QuizSessionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first QuizSession that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuizSessionFindFirstArgs} args - Arguments to find a QuizSession
     * @example
     * // Get one QuizSession
     * const quizSession = await prisma.quizSession.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends QuizSessionFindFirstArgs>(args?: SelectSubset<T, QuizSessionFindFirstArgs<ExtArgs>>): Prisma__QuizSessionClient<$Result.GetResult<Prisma.$QuizSessionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first QuizSession that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuizSessionFindFirstOrThrowArgs} args - Arguments to find a QuizSession
     * @example
     * // Get one QuizSession
     * const quizSession = await prisma.quizSession.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends QuizSessionFindFirstOrThrowArgs>(args?: SelectSubset<T, QuizSessionFindFirstOrThrowArgs<ExtArgs>>): Prisma__QuizSessionClient<$Result.GetResult<Prisma.$QuizSessionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more QuizSessions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuizSessionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all QuizSessions
     * const quizSessions = await prisma.quizSession.findMany()
     * 
     * // Get first 10 QuizSessions
     * const quizSessions = await prisma.quizSession.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const quizSessionWithIdOnly = await prisma.quizSession.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends QuizSessionFindManyArgs>(args?: SelectSubset<T, QuizSessionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$QuizSessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a QuizSession.
     * @param {QuizSessionCreateArgs} args - Arguments to create a QuizSession.
     * @example
     * // Create one QuizSession
     * const QuizSession = await prisma.quizSession.create({
     *   data: {
     *     // ... data to create a QuizSession
     *   }
     * })
     * 
     */
    create<T extends QuizSessionCreateArgs>(args: SelectSubset<T, QuizSessionCreateArgs<ExtArgs>>): Prisma__QuizSessionClient<$Result.GetResult<Prisma.$QuizSessionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many QuizSessions.
     * @param {QuizSessionCreateManyArgs} args - Arguments to create many QuizSessions.
     * @example
     * // Create many QuizSessions
     * const quizSession = await prisma.quizSession.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends QuizSessionCreateManyArgs>(args?: SelectSubset<T, QuizSessionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many QuizSessions and returns the data saved in the database.
     * @param {QuizSessionCreateManyAndReturnArgs} args - Arguments to create many QuizSessions.
     * @example
     * // Create many QuizSessions
     * const quizSession = await prisma.quizSession.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many QuizSessions and only return the `id`
     * const quizSessionWithIdOnly = await prisma.quizSession.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends QuizSessionCreateManyAndReturnArgs>(args?: SelectSubset<T, QuizSessionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$QuizSessionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a QuizSession.
     * @param {QuizSessionDeleteArgs} args - Arguments to delete one QuizSession.
     * @example
     * // Delete one QuizSession
     * const QuizSession = await prisma.quizSession.delete({
     *   where: {
     *     // ... filter to delete one QuizSession
     *   }
     * })
     * 
     */
    delete<T extends QuizSessionDeleteArgs>(args: SelectSubset<T, QuizSessionDeleteArgs<ExtArgs>>): Prisma__QuizSessionClient<$Result.GetResult<Prisma.$QuizSessionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one QuizSession.
     * @param {QuizSessionUpdateArgs} args - Arguments to update one QuizSession.
     * @example
     * // Update one QuizSession
     * const quizSession = await prisma.quizSession.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends QuizSessionUpdateArgs>(args: SelectSubset<T, QuizSessionUpdateArgs<ExtArgs>>): Prisma__QuizSessionClient<$Result.GetResult<Prisma.$QuizSessionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more QuizSessions.
     * @param {QuizSessionDeleteManyArgs} args - Arguments to filter QuizSessions to delete.
     * @example
     * // Delete a few QuizSessions
     * const { count } = await prisma.quizSession.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends QuizSessionDeleteManyArgs>(args?: SelectSubset<T, QuizSessionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more QuizSessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuizSessionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many QuizSessions
     * const quizSession = await prisma.quizSession.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends QuizSessionUpdateManyArgs>(args: SelectSubset<T, QuizSessionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more QuizSessions and returns the data updated in the database.
     * @param {QuizSessionUpdateManyAndReturnArgs} args - Arguments to update many QuizSessions.
     * @example
     * // Update many QuizSessions
     * const quizSession = await prisma.quizSession.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more QuizSessions and only return the `id`
     * const quizSessionWithIdOnly = await prisma.quizSession.updateManyAndReturn({
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
    updateManyAndReturn<T extends QuizSessionUpdateManyAndReturnArgs>(args: SelectSubset<T, QuizSessionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$QuizSessionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one QuizSession.
     * @param {QuizSessionUpsertArgs} args - Arguments to update or create a QuizSession.
     * @example
     * // Update or create a QuizSession
     * const quizSession = await prisma.quizSession.upsert({
     *   create: {
     *     // ... data to create a QuizSession
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the QuizSession we want to update
     *   }
     * })
     */
    upsert<T extends QuizSessionUpsertArgs>(args: SelectSubset<T, QuizSessionUpsertArgs<ExtArgs>>): Prisma__QuizSessionClient<$Result.GetResult<Prisma.$QuizSessionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of QuizSessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuizSessionCountArgs} args - Arguments to filter QuizSessions to count.
     * @example
     * // Count the number of QuizSessions
     * const count = await prisma.quizSession.count({
     *   where: {
     *     // ... the filter for the QuizSessions we want to count
     *   }
     * })
    **/
    count<T extends QuizSessionCountArgs>(
      args?: Subset<T, QuizSessionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], QuizSessionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a QuizSession.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuizSessionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends QuizSessionAggregateArgs>(args: Subset<T, QuizSessionAggregateArgs>): Prisma.PrismaPromise<GetQuizSessionAggregateType<T>>

    /**
     * Group by QuizSession.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuizSessionGroupByArgs} args - Group by arguments.
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
      T extends QuizSessionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: QuizSessionGroupByArgs['orderBy'] }
        : { orderBy?: QuizSessionGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, QuizSessionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetQuizSessionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the QuizSession model
   */
  readonly fields: QuizSessionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for QuizSession.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__QuizSessionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    quiz<T extends QuizTemplateDefaultArgs<ExtArgs> = {}>(args?: Subset<T, QuizTemplateDefaultArgs<ExtArgs>>): Prisma__QuizTemplateClient<$Result.GetResult<Prisma.$QuizTemplatePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    answers<T extends QuizSession$answersArgs<ExtArgs> = {}>(args?: Subset<T, QuizSession$answersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$QuizAnswerPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the QuizSession model
   */
  interface QuizSessionFieldRefs {
    readonly id: FieldRef<"QuizSession", 'String'>
    readonly quizId: FieldRef<"QuizSession", 'String'>
    readonly roomCode: FieldRef<"QuizSession", 'String'>
    readonly status: FieldRef<"QuizSession", 'String'>
    readonly currentQuestion: FieldRef<"QuizSession", 'Int'>
    readonly startedAt: FieldRef<"QuizSession", 'DateTime'>
    readonly endedAt: FieldRef<"QuizSession", 'DateTime'>
    readonly durationSeconds: FieldRef<"QuizSession", 'Int'>
    readonly createdAt: FieldRef<"QuizSession", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * QuizSession findUnique
   */
  export type QuizSessionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuizSession
     */
    select?: QuizSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QuizSession
     */
    omit?: QuizSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuizSessionInclude<ExtArgs> | null
    /**
     * Filter, which QuizSession to fetch.
     */
    where: QuizSessionWhereUniqueInput
  }

  /**
   * QuizSession findUniqueOrThrow
   */
  export type QuizSessionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuizSession
     */
    select?: QuizSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QuizSession
     */
    omit?: QuizSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuizSessionInclude<ExtArgs> | null
    /**
     * Filter, which QuizSession to fetch.
     */
    where: QuizSessionWhereUniqueInput
  }

  /**
   * QuizSession findFirst
   */
  export type QuizSessionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuizSession
     */
    select?: QuizSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QuizSession
     */
    omit?: QuizSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuizSessionInclude<ExtArgs> | null
    /**
     * Filter, which QuizSession to fetch.
     */
    where?: QuizSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of QuizSessions to fetch.
     */
    orderBy?: QuizSessionOrderByWithRelationInput | QuizSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for QuizSessions.
     */
    cursor?: QuizSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` QuizSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` QuizSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of QuizSessions.
     */
    distinct?: QuizSessionScalarFieldEnum | QuizSessionScalarFieldEnum[]
  }

  /**
   * QuizSession findFirstOrThrow
   */
  export type QuizSessionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuizSession
     */
    select?: QuizSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QuizSession
     */
    omit?: QuizSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuizSessionInclude<ExtArgs> | null
    /**
     * Filter, which QuizSession to fetch.
     */
    where?: QuizSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of QuizSessions to fetch.
     */
    orderBy?: QuizSessionOrderByWithRelationInput | QuizSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for QuizSessions.
     */
    cursor?: QuizSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` QuizSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` QuizSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of QuizSessions.
     */
    distinct?: QuizSessionScalarFieldEnum | QuizSessionScalarFieldEnum[]
  }

  /**
   * QuizSession findMany
   */
  export type QuizSessionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuizSession
     */
    select?: QuizSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QuizSession
     */
    omit?: QuizSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuizSessionInclude<ExtArgs> | null
    /**
     * Filter, which QuizSessions to fetch.
     */
    where?: QuizSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of QuizSessions to fetch.
     */
    orderBy?: QuizSessionOrderByWithRelationInput | QuizSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing QuizSessions.
     */
    cursor?: QuizSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` QuizSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` QuizSessions.
     */
    skip?: number
    distinct?: QuizSessionScalarFieldEnum | QuizSessionScalarFieldEnum[]
  }

  /**
   * QuizSession create
   */
  export type QuizSessionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuizSession
     */
    select?: QuizSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QuizSession
     */
    omit?: QuizSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuizSessionInclude<ExtArgs> | null
    /**
     * The data needed to create a QuizSession.
     */
    data: XOR<QuizSessionCreateInput, QuizSessionUncheckedCreateInput>
  }

  /**
   * QuizSession createMany
   */
  export type QuizSessionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many QuizSessions.
     */
    data: QuizSessionCreateManyInput | QuizSessionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * QuizSession createManyAndReturn
   */
  export type QuizSessionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuizSession
     */
    select?: QuizSessionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the QuizSession
     */
    omit?: QuizSessionOmit<ExtArgs> | null
    /**
     * The data used to create many QuizSessions.
     */
    data: QuizSessionCreateManyInput | QuizSessionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuizSessionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * QuizSession update
   */
  export type QuizSessionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuizSession
     */
    select?: QuizSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QuizSession
     */
    omit?: QuizSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuizSessionInclude<ExtArgs> | null
    /**
     * The data needed to update a QuizSession.
     */
    data: XOR<QuizSessionUpdateInput, QuizSessionUncheckedUpdateInput>
    /**
     * Choose, which QuizSession to update.
     */
    where: QuizSessionWhereUniqueInput
  }

  /**
   * QuizSession updateMany
   */
  export type QuizSessionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update QuizSessions.
     */
    data: XOR<QuizSessionUpdateManyMutationInput, QuizSessionUncheckedUpdateManyInput>
    /**
     * Filter which QuizSessions to update
     */
    where?: QuizSessionWhereInput
    /**
     * Limit how many QuizSessions to update.
     */
    limit?: number
  }

  /**
   * QuizSession updateManyAndReturn
   */
  export type QuizSessionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuizSession
     */
    select?: QuizSessionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the QuizSession
     */
    omit?: QuizSessionOmit<ExtArgs> | null
    /**
     * The data used to update QuizSessions.
     */
    data: XOR<QuizSessionUpdateManyMutationInput, QuizSessionUncheckedUpdateManyInput>
    /**
     * Filter which QuizSessions to update
     */
    where?: QuizSessionWhereInput
    /**
     * Limit how many QuizSessions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuizSessionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * QuizSession upsert
   */
  export type QuizSessionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuizSession
     */
    select?: QuizSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QuizSession
     */
    omit?: QuizSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuizSessionInclude<ExtArgs> | null
    /**
     * The filter to search for the QuizSession to update in case it exists.
     */
    where: QuizSessionWhereUniqueInput
    /**
     * In case the QuizSession found by the `where` argument doesn't exist, create a new QuizSession with this data.
     */
    create: XOR<QuizSessionCreateInput, QuizSessionUncheckedCreateInput>
    /**
     * In case the QuizSession was found with the provided `where` argument, update it with this data.
     */
    update: XOR<QuizSessionUpdateInput, QuizSessionUncheckedUpdateInput>
  }

  /**
   * QuizSession delete
   */
  export type QuizSessionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuizSession
     */
    select?: QuizSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QuizSession
     */
    omit?: QuizSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuizSessionInclude<ExtArgs> | null
    /**
     * Filter which QuizSession to delete.
     */
    where: QuizSessionWhereUniqueInput
  }

  /**
   * QuizSession deleteMany
   */
  export type QuizSessionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which QuizSessions to delete
     */
    where?: QuizSessionWhereInput
    /**
     * Limit how many QuizSessions to delete.
     */
    limit?: number
  }

  /**
   * QuizSession.answers
   */
  export type QuizSession$answersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuizAnswer
     */
    select?: QuizAnswerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QuizAnswer
     */
    omit?: QuizAnswerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuizAnswerInclude<ExtArgs> | null
    where?: QuizAnswerWhereInput
    orderBy?: QuizAnswerOrderByWithRelationInput | QuizAnswerOrderByWithRelationInput[]
    cursor?: QuizAnswerWhereUniqueInput
    take?: number
    skip?: number
    distinct?: QuizAnswerScalarFieldEnum | QuizAnswerScalarFieldEnum[]
  }

  /**
   * QuizSession without action
   */
  export type QuizSessionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuizSession
     */
    select?: QuizSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QuizSession
     */
    omit?: QuizSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuizSessionInclude<ExtArgs> | null
  }


  /**
   * Model QuizAnswer
   */

  export type AggregateQuizAnswer = {
    _count: QuizAnswerCountAggregateOutputType | null
    _avg: QuizAnswerAvgAggregateOutputType | null
    _sum: QuizAnswerSumAggregateOutputType | null
    _min: QuizAnswerMinAggregateOutputType | null
    _max: QuizAnswerMaxAggregateOutputType | null
  }

  export type QuizAnswerAvgAggregateOutputType = {
    selectedIndex: number | null
    responseTimeMs: number | null
    pointsAwarded: number | null
  }

  export type QuizAnswerSumAggregateOutputType = {
    selectedIndex: number | null
    responseTimeMs: number | null
    pointsAwarded: number | null
  }

  export type QuizAnswerMinAggregateOutputType = {
    id: string | null
    sessionId: string | null
    questionId: string | null
    userId: string | null
    userName: string | null
    selectedIndex: number | null
    isCorrect: boolean | null
    responseTimeMs: number | null
    pointsAwarded: number | null
    submittedAt: Date | null
  }

  export type QuizAnswerMaxAggregateOutputType = {
    id: string | null
    sessionId: string | null
    questionId: string | null
    userId: string | null
    userName: string | null
    selectedIndex: number | null
    isCorrect: boolean | null
    responseTimeMs: number | null
    pointsAwarded: number | null
    submittedAt: Date | null
  }

  export type QuizAnswerCountAggregateOutputType = {
    id: number
    sessionId: number
    questionId: number
    userId: number
    userName: number
    selectedIndex: number
    isCorrect: number
    responseTimeMs: number
    pointsAwarded: number
    submittedAt: number
    _all: number
  }


  export type QuizAnswerAvgAggregateInputType = {
    selectedIndex?: true
    responseTimeMs?: true
    pointsAwarded?: true
  }

  export type QuizAnswerSumAggregateInputType = {
    selectedIndex?: true
    responseTimeMs?: true
    pointsAwarded?: true
  }

  export type QuizAnswerMinAggregateInputType = {
    id?: true
    sessionId?: true
    questionId?: true
    userId?: true
    userName?: true
    selectedIndex?: true
    isCorrect?: true
    responseTimeMs?: true
    pointsAwarded?: true
    submittedAt?: true
  }

  export type QuizAnswerMaxAggregateInputType = {
    id?: true
    sessionId?: true
    questionId?: true
    userId?: true
    userName?: true
    selectedIndex?: true
    isCorrect?: true
    responseTimeMs?: true
    pointsAwarded?: true
    submittedAt?: true
  }

  export type QuizAnswerCountAggregateInputType = {
    id?: true
    sessionId?: true
    questionId?: true
    userId?: true
    userName?: true
    selectedIndex?: true
    isCorrect?: true
    responseTimeMs?: true
    pointsAwarded?: true
    submittedAt?: true
    _all?: true
  }

  export type QuizAnswerAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which QuizAnswer to aggregate.
     */
    where?: QuizAnswerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of QuizAnswers to fetch.
     */
    orderBy?: QuizAnswerOrderByWithRelationInput | QuizAnswerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: QuizAnswerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` QuizAnswers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` QuizAnswers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned QuizAnswers
    **/
    _count?: true | QuizAnswerCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: QuizAnswerAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: QuizAnswerSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: QuizAnswerMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: QuizAnswerMaxAggregateInputType
  }

  export type GetQuizAnswerAggregateType<T extends QuizAnswerAggregateArgs> = {
        [P in keyof T & keyof AggregateQuizAnswer]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateQuizAnswer[P]>
      : GetScalarType<T[P], AggregateQuizAnswer[P]>
  }




  export type QuizAnswerGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: QuizAnswerWhereInput
    orderBy?: QuizAnswerOrderByWithAggregationInput | QuizAnswerOrderByWithAggregationInput[]
    by: QuizAnswerScalarFieldEnum[] | QuizAnswerScalarFieldEnum
    having?: QuizAnswerScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: QuizAnswerCountAggregateInputType | true
    _avg?: QuizAnswerAvgAggregateInputType
    _sum?: QuizAnswerSumAggregateInputType
    _min?: QuizAnswerMinAggregateInputType
    _max?: QuizAnswerMaxAggregateInputType
  }

  export type QuizAnswerGroupByOutputType = {
    id: string
    sessionId: string
    questionId: string
    userId: string
    userName: string
    selectedIndex: number
    isCorrect: boolean
    responseTimeMs: number
    pointsAwarded: number
    submittedAt: Date
    _count: QuizAnswerCountAggregateOutputType | null
    _avg: QuizAnswerAvgAggregateOutputType | null
    _sum: QuizAnswerSumAggregateOutputType | null
    _min: QuizAnswerMinAggregateOutputType | null
    _max: QuizAnswerMaxAggregateOutputType | null
  }

  type GetQuizAnswerGroupByPayload<T extends QuizAnswerGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<QuizAnswerGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof QuizAnswerGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], QuizAnswerGroupByOutputType[P]>
            : GetScalarType<T[P], QuizAnswerGroupByOutputType[P]>
        }
      >
    >


  export type QuizAnswerSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sessionId?: boolean
    questionId?: boolean
    userId?: boolean
    userName?: boolean
    selectedIndex?: boolean
    isCorrect?: boolean
    responseTimeMs?: boolean
    pointsAwarded?: boolean
    submittedAt?: boolean
    session?: boolean | QuizSessionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["quizAnswer"]>

  export type QuizAnswerSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sessionId?: boolean
    questionId?: boolean
    userId?: boolean
    userName?: boolean
    selectedIndex?: boolean
    isCorrect?: boolean
    responseTimeMs?: boolean
    pointsAwarded?: boolean
    submittedAt?: boolean
    session?: boolean | QuizSessionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["quizAnswer"]>

  export type QuizAnswerSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sessionId?: boolean
    questionId?: boolean
    userId?: boolean
    userName?: boolean
    selectedIndex?: boolean
    isCorrect?: boolean
    responseTimeMs?: boolean
    pointsAwarded?: boolean
    submittedAt?: boolean
    session?: boolean | QuizSessionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["quizAnswer"]>

  export type QuizAnswerSelectScalar = {
    id?: boolean
    sessionId?: boolean
    questionId?: boolean
    userId?: boolean
    userName?: boolean
    selectedIndex?: boolean
    isCorrect?: boolean
    responseTimeMs?: boolean
    pointsAwarded?: boolean
    submittedAt?: boolean
  }

  export type QuizAnswerOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "sessionId" | "questionId" | "userId" | "userName" | "selectedIndex" | "isCorrect" | "responseTimeMs" | "pointsAwarded" | "submittedAt", ExtArgs["result"]["quizAnswer"]>
  export type QuizAnswerInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    session?: boolean | QuizSessionDefaultArgs<ExtArgs>
  }
  export type QuizAnswerIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    session?: boolean | QuizSessionDefaultArgs<ExtArgs>
  }
  export type QuizAnswerIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    session?: boolean | QuizSessionDefaultArgs<ExtArgs>
  }

  export type $QuizAnswerPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "QuizAnswer"
    objects: {
      session: Prisma.$QuizSessionPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      sessionId: string
      questionId: string
      userId: string
      userName: string
      selectedIndex: number
      isCorrect: boolean
      responseTimeMs: number
      pointsAwarded: number
      submittedAt: Date
    }, ExtArgs["result"]["quizAnswer"]>
    composites: {}
  }

  type QuizAnswerGetPayload<S extends boolean | null | undefined | QuizAnswerDefaultArgs> = $Result.GetResult<Prisma.$QuizAnswerPayload, S>

  type QuizAnswerCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<QuizAnswerFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: QuizAnswerCountAggregateInputType | true
    }

  export interface QuizAnswerDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['QuizAnswer'], meta: { name: 'QuizAnswer' } }
    /**
     * Find zero or one QuizAnswer that matches the filter.
     * @param {QuizAnswerFindUniqueArgs} args - Arguments to find a QuizAnswer
     * @example
     * // Get one QuizAnswer
     * const quizAnswer = await prisma.quizAnswer.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends QuizAnswerFindUniqueArgs>(args: SelectSubset<T, QuizAnswerFindUniqueArgs<ExtArgs>>): Prisma__QuizAnswerClient<$Result.GetResult<Prisma.$QuizAnswerPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one QuizAnswer that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {QuizAnswerFindUniqueOrThrowArgs} args - Arguments to find a QuizAnswer
     * @example
     * // Get one QuizAnswer
     * const quizAnswer = await prisma.quizAnswer.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends QuizAnswerFindUniqueOrThrowArgs>(args: SelectSubset<T, QuizAnswerFindUniqueOrThrowArgs<ExtArgs>>): Prisma__QuizAnswerClient<$Result.GetResult<Prisma.$QuizAnswerPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first QuizAnswer that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuizAnswerFindFirstArgs} args - Arguments to find a QuizAnswer
     * @example
     * // Get one QuizAnswer
     * const quizAnswer = await prisma.quizAnswer.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends QuizAnswerFindFirstArgs>(args?: SelectSubset<T, QuizAnswerFindFirstArgs<ExtArgs>>): Prisma__QuizAnswerClient<$Result.GetResult<Prisma.$QuizAnswerPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first QuizAnswer that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuizAnswerFindFirstOrThrowArgs} args - Arguments to find a QuizAnswer
     * @example
     * // Get one QuizAnswer
     * const quizAnswer = await prisma.quizAnswer.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends QuizAnswerFindFirstOrThrowArgs>(args?: SelectSubset<T, QuizAnswerFindFirstOrThrowArgs<ExtArgs>>): Prisma__QuizAnswerClient<$Result.GetResult<Prisma.$QuizAnswerPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more QuizAnswers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuizAnswerFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all QuizAnswers
     * const quizAnswers = await prisma.quizAnswer.findMany()
     * 
     * // Get first 10 QuizAnswers
     * const quizAnswers = await prisma.quizAnswer.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const quizAnswerWithIdOnly = await prisma.quizAnswer.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends QuizAnswerFindManyArgs>(args?: SelectSubset<T, QuizAnswerFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$QuizAnswerPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a QuizAnswer.
     * @param {QuizAnswerCreateArgs} args - Arguments to create a QuizAnswer.
     * @example
     * // Create one QuizAnswer
     * const QuizAnswer = await prisma.quizAnswer.create({
     *   data: {
     *     // ... data to create a QuizAnswer
     *   }
     * })
     * 
     */
    create<T extends QuizAnswerCreateArgs>(args: SelectSubset<T, QuizAnswerCreateArgs<ExtArgs>>): Prisma__QuizAnswerClient<$Result.GetResult<Prisma.$QuizAnswerPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many QuizAnswers.
     * @param {QuizAnswerCreateManyArgs} args - Arguments to create many QuizAnswers.
     * @example
     * // Create many QuizAnswers
     * const quizAnswer = await prisma.quizAnswer.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends QuizAnswerCreateManyArgs>(args?: SelectSubset<T, QuizAnswerCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many QuizAnswers and returns the data saved in the database.
     * @param {QuizAnswerCreateManyAndReturnArgs} args - Arguments to create many QuizAnswers.
     * @example
     * // Create many QuizAnswers
     * const quizAnswer = await prisma.quizAnswer.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many QuizAnswers and only return the `id`
     * const quizAnswerWithIdOnly = await prisma.quizAnswer.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends QuizAnswerCreateManyAndReturnArgs>(args?: SelectSubset<T, QuizAnswerCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$QuizAnswerPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a QuizAnswer.
     * @param {QuizAnswerDeleteArgs} args - Arguments to delete one QuizAnswer.
     * @example
     * // Delete one QuizAnswer
     * const QuizAnswer = await prisma.quizAnswer.delete({
     *   where: {
     *     // ... filter to delete one QuizAnswer
     *   }
     * })
     * 
     */
    delete<T extends QuizAnswerDeleteArgs>(args: SelectSubset<T, QuizAnswerDeleteArgs<ExtArgs>>): Prisma__QuizAnswerClient<$Result.GetResult<Prisma.$QuizAnswerPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one QuizAnswer.
     * @param {QuizAnswerUpdateArgs} args - Arguments to update one QuizAnswer.
     * @example
     * // Update one QuizAnswer
     * const quizAnswer = await prisma.quizAnswer.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends QuizAnswerUpdateArgs>(args: SelectSubset<T, QuizAnswerUpdateArgs<ExtArgs>>): Prisma__QuizAnswerClient<$Result.GetResult<Prisma.$QuizAnswerPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more QuizAnswers.
     * @param {QuizAnswerDeleteManyArgs} args - Arguments to filter QuizAnswers to delete.
     * @example
     * // Delete a few QuizAnswers
     * const { count } = await prisma.quizAnswer.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends QuizAnswerDeleteManyArgs>(args?: SelectSubset<T, QuizAnswerDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more QuizAnswers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuizAnswerUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many QuizAnswers
     * const quizAnswer = await prisma.quizAnswer.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends QuizAnswerUpdateManyArgs>(args: SelectSubset<T, QuizAnswerUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more QuizAnswers and returns the data updated in the database.
     * @param {QuizAnswerUpdateManyAndReturnArgs} args - Arguments to update many QuizAnswers.
     * @example
     * // Update many QuizAnswers
     * const quizAnswer = await prisma.quizAnswer.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more QuizAnswers and only return the `id`
     * const quizAnswerWithIdOnly = await prisma.quizAnswer.updateManyAndReturn({
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
    updateManyAndReturn<T extends QuizAnswerUpdateManyAndReturnArgs>(args: SelectSubset<T, QuizAnswerUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$QuizAnswerPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one QuizAnswer.
     * @param {QuizAnswerUpsertArgs} args - Arguments to update or create a QuizAnswer.
     * @example
     * // Update or create a QuizAnswer
     * const quizAnswer = await prisma.quizAnswer.upsert({
     *   create: {
     *     // ... data to create a QuizAnswer
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the QuizAnswer we want to update
     *   }
     * })
     */
    upsert<T extends QuizAnswerUpsertArgs>(args: SelectSubset<T, QuizAnswerUpsertArgs<ExtArgs>>): Prisma__QuizAnswerClient<$Result.GetResult<Prisma.$QuizAnswerPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of QuizAnswers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuizAnswerCountArgs} args - Arguments to filter QuizAnswers to count.
     * @example
     * // Count the number of QuizAnswers
     * const count = await prisma.quizAnswer.count({
     *   where: {
     *     // ... the filter for the QuizAnswers we want to count
     *   }
     * })
    **/
    count<T extends QuizAnswerCountArgs>(
      args?: Subset<T, QuizAnswerCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], QuizAnswerCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a QuizAnswer.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuizAnswerAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends QuizAnswerAggregateArgs>(args: Subset<T, QuizAnswerAggregateArgs>): Prisma.PrismaPromise<GetQuizAnswerAggregateType<T>>

    /**
     * Group by QuizAnswer.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuizAnswerGroupByArgs} args - Group by arguments.
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
      T extends QuizAnswerGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: QuizAnswerGroupByArgs['orderBy'] }
        : { orderBy?: QuizAnswerGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, QuizAnswerGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetQuizAnswerGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the QuizAnswer model
   */
  readonly fields: QuizAnswerFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for QuizAnswer.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__QuizAnswerClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    session<T extends QuizSessionDefaultArgs<ExtArgs> = {}>(args?: Subset<T, QuizSessionDefaultArgs<ExtArgs>>): Prisma__QuizSessionClient<$Result.GetResult<Prisma.$QuizSessionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the QuizAnswer model
   */
  interface QuizAnswerFieldRefs {
    readonly id: FieldRef<"QuizAnswer", 'String'>
    readonly sessionId: FieldRef<"QuizAnswer", 'String'>
    readonly questionId: FieldRef<"QuizAnswer", 'String'>
    readonly userId: FieldRef<"QuizAnswer", 'String'>
    readonly userName: FieldRef<"QuizAnswer", 'String'>
    readonly selectedIndex: FieldRef<"QuizAnswer", 'Int'>
    readonly isCorrect: FieldRef<"QuizAnswer", 'Boolean'>
    readonly responseTimeMs: FieldRef<"QuizAnswer", 'Int'>
    readonly pointsAwarded: FieldRef<"QuizAnswer", 'Int'>
    readonly submittedAt: FieldRef<"QuizAnswer", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * QuizAnswer findUnique
   */
  export type QuizAnswerFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuizAnswer
     */
    select?: QuizAnswerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QuizAnswer
     */
    omit?: QuizAnswerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuizAnswerInclude<ExtArgs> | null
    /**
     * Filter, which QuizAnswer to fetch.
     */
    where: QuizAnswerWhereUniqueInput
  }

  /**
   * QuizAnswer findUniqueOrThrow
   */
  export type QuizAnswerFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuizAnswer
     */
    select?: QuizAnswerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QuizAnswer
     */
    omit?: QuizAnswerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuizAnswerInclude<ExtArgs> | null
    /**
     * Filter, which QuizAnswer to fetch.
     */
    where: QuizAnswerWhereUniqueInput
  }

  /**
   * QuizAnswer findFirst
   */
  export type QuizAnswerFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuizAnswer
     */
    select?: QuizAnswerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QuizAnswer
     */
    omit?: QuizAnswerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuizAnswerInclude<ExtArgs> | null
    /**
     * Filter, which QuizAnswer to fetch.
     */
    where?: QuizAnswerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of QuizAnswers to fetch.
     */
    orderBy?: QuizAnswerOrderByWithRelationInput | QuizAnswerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for QuizAnswers.
     */
    cursor?: QuizAnswerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` QuizAnswers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` QuizAnswers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of QuizAnswers.
     */
    distinct?: QuizAnswerScalarFieldEnum | QuizAnswerScalarFieldEnum[]
  }

  /**
   * QuizAnswer findFirstOrThrow
   */
  export type QuizAnswerFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuizAnswer
     */
    select?: QuizAnswerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QuizAnswer
     */
    omit?: QuizAnswerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuizAnswerInclude<ExtArgs> | null
    /**
     * Filter, which QuizAnswer to fetch.
     */
    where?: QuizAnswerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of QuizAnswers to fetch.
     */
    orderBy?: QuizAnswerOrderByWithRelationInput | QuizAnswerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for QuizAnswers.
     */
    cursor?: QuizAnswerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` QuizAnswers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` QuizAnswers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of QuizAnswers.
     */
    distinct?: QuizAnswerScalarFieldEnum | QuizAnswerScalarFieldEnum[]
  }

  /**
   * QuizAnswer findMany
   */
  export type QuizAnswerFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuizAnswer
     */
    select?: QuizAnswerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QuizAnswer
     */
    omit?: QuizAnswerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuizAnswerInclude<ExtArgs> | null
    /**
     * Filter, which QuizAnswers to fetch.
     */
    where?: QuizAnswerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of QuizAnswers to fetch.
     */
    orderBy?: QuizAnswerOrderByWithRelationInput | QuizAnswerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing QuizAnswers.
     */
    cursor?: QuizAnswerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` QuizAnswers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` QuizAnswers.
     */
    skip?: number
    distinct?: QuizAnswerScalarFieldEnum | QuizAnswerScalarFieldEnum[]
  }

  /**
   * QuizAnswer create
   */
  export type QuizAnswerCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuizAnswer
     */
    select?: QuizAnswerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QuizAnswer
     */
    omit?: QuizAnswerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuizAnswerInclude<ExtArgs> | null
    /**
     * The data needed to create a QuizAnswer.
     */
    data: XOR<QuizAnswerCreateInput, QuizAnswerUncheckedCreateInput>
  }

  /**
   * QuizAnswer createMany
   */
  export type QuizAnswerCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many QuizAnswers.
     */
    data: QuizAnswerCreateManyInput | QuizAnswerCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * QuizAnswer createManyAndReturn
   */
  export type QuizAnswerCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuizAnswer
     */
    select?: QuizAnswerSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the QuizAnswer
     */
    omit?: QuizAnswerOmit<ExtArgs> | null
    /**
     * The data used to create many QuizAnswers.
     */
    data: QuizAnswerCreateManyInput | QuizAnswerCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuizAnswerIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * QuizAnswer update
   */
  export type QuizAnswerUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuizAnswer
     */
    select?: QuizAnswerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QuizAnswer
     */
    omit?: QuizAnswerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuizAnswerInclude<ExtArgs> | null
    /**
     * The data needed to update a QuizAnswer.
     */
    data: XOR<QuizAnswerUpdateInput, QuizAnswerUncheckedUpdateInput>
    /**
     * Choose, which QuizAnswer to update.
     */
    where: QuizAnswerWhereUniqueInput
  }

  /**
   * QuizAnswer updateMany
   */
  export type QuizAnswerUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update QuizAnswers.
     */
    data: XOR<QuizAnswerUpdateManyMutationInput, QuizAnswerUncheckedUpdateManyInput>
    /**
     * Filter which QuizAnswers to update
     */
    where?: QuizAnswerWhereInput
    /**
     * Limit how many QuizAnswers to update.
     */
    limit?: number
  }

  /**
   * QuizAnswer updateManyAndReturn
   */
  export type QuizAnswerUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuizAnswer
     */
    select?: QuizAnswerSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the QuizAnswer
     */
    omit?: QuizAnswerOmit<ExtArgs> | null
    /**
     * The data used to update QuizAnswers.
     */
    data: XOR<QuizAnswerUpdateManyMutationInput, QuizAnswerUncheckedUpdateManyInput>
    /**
     * Filter which QuizAnswers to update
     */
    where?: QuizAnswerWhereInput
    /**
     * Limit how many QuizAnswers to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuizAnswerIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * QuizAnswer upsert
   */
  export type QuizAnswerUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuizAnswer
     */
    select?: QuizAnswerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QuizAnswer
     */
    omit?: QuizAnswerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuizAnswerInclude<ExtArgs> | null
    /**
     * The filter to search for the QuizAnswer to update in case it exists.
     */
    where: QuizAnswerWhereUniqueInput
    /**
     * In case the QuizAnswer found by the `where` argument doesn't exist, create a new QuizAnswer with this data.
     */
    create: XOR<QuizAnswerCreateInput, QuizAnswerUncheckedCreateInput>
    /**
     * In case the QuizAnswer was found with the provided `where` argument, update it with this data.
     */
    update: XOR<QuizAnswerUpdateInput, QuizAnswerUncheckedUpdateInput>
  }

  /**
   * QuizAnswer delete
   */
  export type QuizAnswerDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuizAnswer
     */
    select?: QuizAnswerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QuizAnswer
     */
    omit?: QuizAnswerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuizAnswerInclude<ExtArgs> | null
    /**
     * Filter which QuizAnswer to delete.
     */
    where: QuizAnswerWhereUniqueInput
  }

  /**
   * QuizAnswer deleteMany
   */
  export type QuizAnswerDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which QuizAnswers to delete
     */
    where?: QuizAnswerWhereInput
    /**
     * Limit how many QuizAnswers to delete.
     */
    limit?: number
  }

  /**
   * QuizAnswer without action
   */
  export type QuizAnswerDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuizAnswer
     */
    select?: QuizAnswerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QuizAnswer
     */
    omit?: QuizAnswerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuizAnswerInclude<ExtArgs> | null
  }


  /**
   * Model Friendship
   */

  export type AggregateFriendship = {
    _count: FriendshipCountAggregateOutputType | null
    _min: FriendshipMinAggregateOutputType | null
    _max: FriendshipMaxAggregateOutputType | null
  }

  export type FriendshipMinAggregateOutputType = {
    id: string | null
    requesterId: string | null
    recipientId: string | null
    status: string | null
    createdAt: Date | null
  }

  export type FriendshipMaxAggregateOutputType = {
    id: string | null
    requesterId: string | null
    recipientId: string | null
    status: string | null
    createdAt: Date | null
  }

  export type FriendshipCountAggregateOutputType = {
    id: number
    requesterId: number
    recipientId: number
    status: number
    createdAt: number
    _all: number
  }


  export type FriendshipMinAggregateInputType = {
    id?: true
    requesterId?: true
    recipientId?: true
    status?: true
    createdAt?: true
  }

  export type FriendshipMaxAggregateInputType = {
    id?: true
    requesterId?: true
    recipientId?: true
    status?: true
    createdAt?: true
  }

  export type FriendshipCountAggregateInputType = {
    id?: true
    requesterId?: true
    recipientId?: true
    status?: true
    createdAt?: true
    _all?: true
  }

  export type FriendshipAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Friendship to aggregate.
     */
    where?: FriendshipWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Friendships to fetch.
     */
    orderBy?: FriendshipOrderByWithRelationInput | FriendshipOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: FriendshipWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Friendships from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Friendships.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Friendships
    **/
    _count?: true | FriendshipCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: FriendshipMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: FriendshipMaxAggregateInputType
  }

  export type GetFriendshipAggregateType<T extends FriendshipAggregateArgs> = {
        [P in keyof T & keyof AggregateFriendship]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateFriendship[P]>
      : GetScalarType<T[P], AggregateFriendship[P]>
  }




  export type FriendshipGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FriendshipWhereInput
    orderBy?: FriendshipOrderByWithAggregationInput | FriendshipOrderByWithAggregationInput[]
    by: FriendshipScalarFieldEnum[] | FriendshipScalarFieldEnum
    having?: FriendshipScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: FriendshipCountAggregateInputType | true
    _min?: FriendshipMinAggregateInputType
    _max?: FriendshipMaxAggregateInputType
  }

  export type FriendshipGroupByOutputType = {
    id: string
    requesterId: string
    recipientId: string
    status: string
    createdAt: Date
    _count: FriendshipCountAggregateOutputType | null
    _min: FriendshipMinAggregateOutputType | null
    _max: FriendshipMaxAggregateOutputType | null
  }

  type GetFriendshipGroupByPayload<T extends FriendshipGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<FriendshipGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof FriendshipGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], FriendshipGroupByOutputType[P]>
            : GetScalarType<T[P], FriendshipGroupByOutputType[P]>
        }
      >
    >


  export type FriendshipSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    requesterId?: boolean
    recipientId?: boolean
    status?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["friendship"]>

  export type FriendshipSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    requesterId?: boolean
    recipientId?: boolean
    status?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["friendship"]>

  export type FriendshipSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    requesterId?: boolean
    recipientId?: boolean
    status?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["friendship"]>

  export type FriendshipSelectScalar = {
    id?: boolean
    requesterId?: boolean
    recipientId?: boolean
    status?: boolean
    createdAt?: boolean
  }

  export type FriendshipOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "requesterId" | "recipientId" | "status" | "createdAt", ExtArgs["result"]["friendship"]>

  export type $FriendshipPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Friendship"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      requesterId: string
      recipientId: string
      status: string
      createdAt: Date
    }, ExtArgs["result"]["friendship"]>
    composites: {}
  }

  type FriendshipGetPayload<S extends boolean | null | undefined | FriendshipDefaultArgs> = $Result.GetResult<Prisma.$FriendshipPayload, S>

  type FriendshipCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<FriendshipFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: FriendshipCountAggregateInputType | true
    }

  export interface FriendshipDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Friendship'], meta: { name: 'Friendship' } }
    /**
     * Find zero or one Friendship that matches the filter.
     * @param {FriendshipFindUniqueArgs} args - Arguments to find a Friendship
     * @example
     * // Get one Friendship
     * const friendship = await prisma.friendship.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends FriendshipFindUniqueArgs>(args: SelectSubset<T, FriendshipFindUniqueArgs<ExtArgs>>): Prisma__FriendshipClient<$Result.GetResult<Prisma.$FriendshipPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Friendship that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {FriendshipFindUniqueOrThrowArgs} args - Arguments to find a Friendship
     * @example
     * // Get one Friendship
     * const friendship = await prisma.friendship.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends FriendshipFindUniqueOrThrowArgs>(args: SelectSubset<T, FriendshipFindUniqueOrThrowArgs<ExtArgs>>): Prisma__FriendshipClient<$Result.GetResult<Prisma.$FriendshipPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Friendship that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FriendshipFindFirstArgs} args - Arguments to find a Friendship
     * @example
     * // Get one Friendship
     * const friendship = await prisma.friendship.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends FriendshipFindFirstArgs>(args?: SelectSubset<T, FriendshipFindFirstArgs<ExtArgs>>): Prisma__FriendshipClient<$Result.GetResult<Prisma.$FriendshipPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Friendship that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FriendshipFindFirstOrThrowArgs} args - Arguments to find a Friendship
     * @example
     * // Get one Friendship
     * const friendship = await prisma.friendship.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends FriendshipFindFirstOrThrowArgs>(args?: SelectSubset<T, FriendshipFindFirstOrThrowArgs<ExtArgs>>): Prisma__FriendshipClient<$Result.GetResult<Prisma.$FriendshipPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Friendships that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FriendshipFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Friendships
     * const friendships = await prisma.friendship.findMany()
     * 
     * // Get first 10 Friendships
     * const friendships = await prisma.friendship.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const friendshipWithIdOnly = await prisma.friendship.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends FriendshipFindManyArgs>(args?: SelectSubset<T, FriendshipFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FriendshipPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Friendship.
     * @param {FriendshipCreateArgs} args - Arguments to create a Friendship.
     * @example
     * // Create one Friendship
     * const Friendship = await prisma.friendship.create({
     *   data: {
     *     // ... data to create a Friendship
     *   }
     * })
     * 
     */
    create<T extends FriendshipCreateArgs>(args: SelectSubset<T, FriendshipCreateArgs<ExtArgs>>): Prisma__FriendshipClient<$Result.GetResult<Prisma.$FriendshipPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Friendships.
     * @param {FriendshipCreateManyArgs} args - Arguments to create many Friendships.
     * @example
     * // Create many Friendships
     * const friendship = await prisma.friendship.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends FriendshipCreateManyArgs>(args?: SelectSubset<T, FriendshipCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Friendships and returns the data saved in the database.
     * @param {FriendshipCreateManyAndReturnArgs} args - Arguments to create many Friendships.
     * @example
     * // Create many Friendships
     * const friendship = await prisma.friendship.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Friendships and only return the `id`
     * const friendshipWithIdOnly = await prisma.friendship.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends FriendshipCreateManyAndReturnArgs>(args?: SelectSubset<T, FriendshipCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FriendshipPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Friendship.
     * @param {FriendshipDeleteArgs} args - Arguments to delete one Friendship.
     * @example
     * // Delete one Friendship
     * const Friendship = await prisma.friendship.delete({
     *   where: {
     *     // ... filter to delete one Friendship
     *   }
     * })
     * 
     */
    delete<T extends FriendshipDeleteArgs>(args: SelectSubset<T, FriendshipDeleteArgs<ExtArgs>>): Prisma__FriendshipClient<$Result.GetResult<Prisma.$FriendshipPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Friendship.
     * @param {FriendshipUpdateArgs} args - Arguments to update one Friendship.
     * @example
     * // Update one Friendship
     * const friendship = await prisma.friendship.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends FriendshipUpdateArgs>(args: SelectSubset<T, FriendshipUpdateArgs<ExtArgs>>): Prisma__FriendshipClient<$Result.GetResult<Prisma.$FriendshipPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Friendships.
     * @param {FriendshipDeleteManyArgs} args - Arguments to filter Friendships to delete.
     * @example
     * // Delete a few Friendships
     * const { count } = await prisma.friendship.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends FriendshipDeleteManyArgs>(args?: SelectSubset<T, FriendshipDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Friendships.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FriendshipUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Friendships
     * const friendship = await prisma.friendship.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends FriendshipUpdateManyArgs>(args: SelectSubset<T, FriendshipUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Friendships and returns the data updated in the database.
     * @param {FriendshipUpdateManyAndReturnArgs} args - Arguments to update many Friendships.
     * @example
     * // Update many Friendships
     * const friendship = await prisma.friendship.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Friendships and only return the `id`
     * const friendshipWithIdOnly = await prisma.friendship.updateManyAndReturn({
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
    updateManyAndReturn<T extends FriendshipUpdateManyAndReturnArgs>(args: SelectSubset<T, FriendshipUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FriendshipPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Friendship.
     * @param {FriendshipUpsertArgs} args - Arguments to update or create a Friendship.
     * @example
     * // Update or create a Friendship
     * const friendship = await prisma.friendship.upsert({
     *   create: {
     *     // ... data to create a Friendship
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Friendship we want to update
     *   }
     * })
     */
    upsert<T extends FriendshipUpsertArgs>(args: SelectSubset<T, FriendshipUpsertArgs<ExtArgs>>): Prisma__FriendshipClient<$Result.GetResult<Prisma.$FriendshipPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Friendships.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FriendshipCountArgs} args - Arguments to filter Friendships to count.
     * @example
     * // Count the number of Friendships
     * const count = await prisma.friendship.count({
     *   where: {
     *     // ... the filter for the Friendships we want to count
     *   }
     * })
    **/
    count<T extends FriendshipCountArgs>(
      args?: Subset<T, FriendshipCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], FriendshipCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Friendship.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FriendshipAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends FriendshipAggregateArgs>(args: Subset<T, FriendshipAggregateArgs>): Prisma.PrismaPromise<GetFriendshipAggregateType<T>>

    /**
     * Group by Friendship.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FriendshipGroupByArgs} args - Group by arguments.
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
      T extends FriendshipGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: FriendshipGroupByArgs['orderBy'] }
        : { orderBy?: FriendshipGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, FriendshipGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetFriendshipGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Friendship model
   */
  readonly fields: FriendshipFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Friendship.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__FriendshipClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
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
   * Fields of the Friendship model
   */
  interface FriendshipFieldRefs {
    readonly id: FieldRef<"Friendship", 'String'>
    readonly requesterId: FieldRef<"Friendship", 'String'>
    readonly recipientId: FieldRef<"Friendship", 'String'>
    readonly status: FieldRef<"Friendship", 'String'>
    readonly createdAt: FieldRef<"Friendship", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Friendship findUnique
   */
  export type FriendshipFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Friendship
     */
    select?: FriendshipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Friendship
     */
    omit?: FriendshipOmit<ExtArgs> | null
    /**
     * Filter, which Friendship to fetch.
     */
    where: FriendshipWhereUniqueInput
  }

  /**
   * Friendship findUniqueOrThrow
   */
  export type FriendshipFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Friendship
     */
    select?: FriendshipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Friendship
     */
    omit?: FriendshipOmit<ExtArgs> | null
    /**
     * Filter, which Friendship to fetch.
     */
    where: FriendshipWhereUniqueInput
  }

  /**
   * Friendship findFirst
   */
  export type FriendshipFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Friendship
     */
    select?: FriendshipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Friendship
     */
    omit?: FriendshipOmit<ExtArgs> | null
    /**
     * Filter, which Friendship to fetch.
     */
    where?: FriendshipWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Friendships to fetch.
     */
    orderBy?: FriendshipOrderByWithRelationInput | FriendshipOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Friendships.
     */
    cursor?: FriendshipWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Friendships from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Friendships.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Friendships.
     */
    distinct?: FriendshipScalarFieldEnum | FriendshipScalarFieldEnum[]
  }

  /**
   * Friendship findFirstOrThrow
   */
  export type FriendshipFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Friendship
     */
    select?: FriendshipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Friendship
     */
    omit?: FriendshipOmit<ExtArgs> | null
    /**
     * Filter, which Friendship to fetch.
     */
    where?: FriendshipWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Friendships to fetch.
     */
    orderBy?: FriendshipOrderByWithRelationInput | FriendshipOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Friendships.
     */
    cursor?: FriendshipWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Friendships from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Friendships.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Friendships.
     */
    distinct?: FriendshipScalarFieldEnum | FriendshipScalarFieldEnum[]
  }

  /**
   * Friendship findMany
   */
  export type FriendshipFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Friendship
     */
    select?: FriendshipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Friendship
     */
    omit?: FriendshipOmit<ExtArgs> | null
    /**
     * Filter, which Friendships to fetch.
     */
    where?: FriendshipWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Friendships to fetch.
     */
    orderBy?: FriendshipOrderByWithRelationInput | FriendshipOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Friendships.
     */
    cursor?: FriendshipWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Friendships from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Friendships.
     */
    skip?: number
    distinct?: FriendshipScalarFieldEnum | FriendshipScalarFieldEnum[]
  }

  /**
   * Friendship create
   */
  export type FriendshipCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Friendship
     */
    select?: FriendshipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Friendship
     */
    omit?: FriendshipOmit<ExtArgs> | null
    /**
     * The data needed to create a Friendship.
     */
    data: XOR<FriendshipCreateInput, FriendshipUncheckedCreateInput>
  }

  /**
   * Friendship createMany
   */
  export type FriendshipCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Friendships.
     */
    data: FriendshipCreateManyInput | FriendshipCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Friendship createManyAndReturn
   */
  export type FriendshipCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Friendship
     */
    select?: FriendshipSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Friendship
     */
    omit?: FriendshipOmit<ExtArgs> | null
    /**
     * The data used to create many Friendships.
     */
    data: FriendshipCreateManyInput | FriendshipCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Friendship update
   */
  export type FriendshipUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Friendship
     */
    select?: FriendshipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Friendship
     */
    omit?: FriendshipOmit<ExtArgs> | null
    /**
     * The data needed to update a Friendship.
     */
    data: XOR<FriendshipUpdateInput, FriendshipUncheckedUpdateInput>
    /**
     * Choose, which Friendship to update.
     */
    where: FriendshipWhereUniqueInput
  }

  /**
   * Friendship updateMany
   */
  export type FriendshipUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Friendships.
     */
    data: XOR<FriendshipUpdateManyMutationInput, FriendshipUncheckedUpdateManyInput>
    /**
     * Filter which Friendships to update
     */
    where?: FriendshipWhereInput
    /**
     * Limit how many Friendships to update.
     */
    limit?: number
  }

  /**
   * Friendship updateManyAndReturn
   */
  export type FriendshipUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Friendship
     */
    select?: FriendshipSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Friendship
     */
    omit?: FriendshipOmit<ExtArgs> | null
    /**
     * The data used to update Friendships.
     */
    data: XOR<FriendshipUpdateManyMutationInput, FriendshipUncheckedUpdateManyInput>
    /**
     * Filter which Friendships to update
     */
    where?: FriendshipWhereInput
    /**
     * Limit how many Friendships to update.
     */
    limit?: number
  }

  /**
   * Friendship upsert
   */
  export type FriendshipUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Friendship
     */
    select?: FriendshipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Friendship
     */
    omit?: FriendshipOmit<ExtArgs> | null
    /**
     * The filter to search for the Friendship to update in case it exists.
     */
    where: FriendshipWhereUniqueInput
    /**
     * In case the Friendship found by the `where` argument doesn't exist, create a new Friendship with this data.
     */
    create: XOR<FriendshipCreateInput, FriendshipUncheckedCreateInput>
    /**
     * In case the Friendship was found with the provided `where` argument, update it with this data.
     */
    update: XOR<FriendshipUpdateInput, FriendshipUncheckedUpdateInput>
  }

  /**
   * Friendship delete
   */
  export type FriendshipDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Friendship
     */
    select?: FriendshipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Friendship
     */
    omit?: FriendshipOmit<ExtArgs> | null
    /**
     * Filter which Friendship to delete.
     */
    where: FriendshipWhereUniqueInput
  }

  /**
   * Friendship deleteMany
   */
  export type FriendshipDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Friendships to delete
     */
    where?: FriendshipWhereInput
    /**
     * Limit how many Friendships to delete.
     */
    limit?: number
  }

  /**
   * Friendship without action
   */
  export type FriendshipDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Friendship
     */
    select?: FriendshipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Friendship
     */
    omit?: FriendshipOmit<ExtArgs> | null
  }


  /**
   * Model StudyGroup
   */

  export type AggregateStudyGroup = {
    _count: StudyGroupCountAggregateOutputType | null
    _min: StudyGroupMinAggregateOutputType | null
    _max: StudyGroupMaxAggregateOutputType | null
  }

  export type StudyGroupMinAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    createdBy: string | null
    createdAt: Date | null
  }

  export type StudyGroupMaxAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    createdBy: string | null
    createdAt: Date | null
  }

  export type StudyGroupCountAggregateOutputType = {
    id: number
    name: number
    description: number
    createdBy: number
    createdAt: number
    _all: number
  }


  export type StudyGroupMinAggregateInputType = {
    id?: true
    name?: true
    description?: true
    createdBy?: true
    createdAt?: true
  }

  export type StudyGroupMaxAggregateInputType = {
    id?: true
    name?: true
    description?: true
    createdBy?: true
    createdAt?: true
  }

  export type StudyGroupCountAggregateInputType = {
    id?: true
    name?: true
    description?: true
    createdBy?: true
    createdAt?: true
    _all?: true
  }

  export type StudyGroupAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which StudyGroup to aggregate.
     */
    where?: StudyGroupWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StudyGroups to fetch.
     */
    orderBy?: StudyGroupOrderByWithRelationInput | StudyGroupOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: StudyGroupWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StudyGroups from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StudyGroups.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned StudyGroups
    **/
    _count?: true | StudyGroupCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: StudyGroupMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: StudyGroupMaxAggregateInputType
  }

  export type GetStudyGroupAggregateType<T extends StudyGroupAggregateArgs> = {
        [P in keyof T & keyof AggregateStudyGroup]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateStudyGroup[P]>
      : GetScalarType<T[P], AggregateStudyGroup[P]>
  }




  export type StudyGroupGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: StudyGroupWhereInput
    orderBy?: StudyGroupOrderByWithAggregationInput | StudyGroupOrderByWithAggregationInput[]
    by: StudyGroupScalarFieldEnum[] | StudyGroupScalarFieldEnum
    having?: StudyGroupScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: StudyGroupCountAggregateInputType | true
    _min?: StudyGroupMinAggregateInputType
    _max?: StudyGroupMaxAggregateInputType
  }

  export type StudyGroupGroupByOutputType = {
    id: string
    name: string
    description: string | null
    createdBy: string
    createdAt: Date
    _count: StudyGroupCountAggregateOutputType | null
    _min: StudyGroupMinAggregateOutputType | null
    _max: StudyGroupMaxAggregateOutputType | null
  }

  type GetStudyGroupGroupByPayload<T extends StudyGroupGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<StudyGroupGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof StudyGroupGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], StudyGroupGroupByOutputType[P]>
            : GetScalarType<T[P], StudyGroupGroupByOutputType[P]>
        }
      >
    >


  export type StudyGroupSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    createdBy?: boolean
    createdAt?: boolean
    members?: boolean | StudyGroup$membersArgs<ExtArgs>
    _count?: boolean | StudyGroupCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["studyGroup"]>

  export type StudyGroupSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    createdBy?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["studyGroup"]>

  export type StudyGroupSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    createdBy?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["studyGroup"]>

  export type StudyGroupSelectScalar = {
    id?: boolean
    name?: boolean
    description?: boolean
    createdBy?: boolean
    createdAt?: boolean
  }

  export type StudyGroupOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "description" | "createdBy" | "createdAt", ExtArgs["result"]["studyGroup"]>
  export type StudyGroupInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    members?: boolean | StudyGroup$membersArgs<ExtArgs>
    _count?: boolean | StudyGroupCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type StudyGroupIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type StudyGroupIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $StudyGroupPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "StudyGroup"
    objects: {
      members: Prisma.$GroupMemberPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      description: string | null
      createdBy: string
      createdAt: Date
    }, ExtArgs["result"]["studyGroup"]>
    composites: {}
  }

  type StudyGroupGetPayload<S extends boolean | null | undefined | StudyGroupDefaultArgs> = $Result.GetResult<Prisma.$StudyGroupPayload, S>

  type StudyGroupCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<StudyGroupFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: StudyGroupCountAggregateInputType | true
    }

  export interface StudyGroupDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['StudyGroup'], meta: { name: 'StudyGroup' } }
    /**
     * Find zero or one StudyGroup that matches the filter.
     * @param {StudyGroupFindUniqueArgs} args - Arguments to find a StudyGroup
     * @example
     * // Get one StudyGroup
     * const studyGroup = await prisma.studyGroup.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends StudyGroupFindUniqueArgs>(args: SelectSubset<T, StudyGroupFindUniqueArgs<ExtArgs>>): Prisma__StudyGroupClient<$Result.GetResult<Prisma.$StudyGroupPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one StudyGroup that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {StudyGroupFindUniqueOrThrowArgs} args - Arguments to find a StudyGroup
     * @example
     * // Get one StudyGroup
     * const studyGroup = await prisma.studyGroup.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends StudyGroupFindUniqueOrThrowArgs>(args: SelectSubset<T, StudyGroupFindUniqueOrThrowArgs<ExtArgs>>): Prisma__StudyGroupClient<$Result.GetResult<Prisma.$StudyGroupPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first StudyGroup that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StudyGroupFindFirstArgs} args - Arguments to find a StudyGroup
     * @example
     * // Get one StudyGroup
     * const studyGroup = await prisma.studyGroup.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends StudyGroupFindFirstArgs>(args?: SelectSubset<T, StudyGroupFindFirstArgs<ExtArgs>>): Prisma__StudyGroupClient<$Result.GetResult<Prisma.$StudyGroupPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first StudyGroup that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StudyGroupFindFirstOrThrowArgs} args - Arguments to find a StudyGroup
     * @example
     * // Get one StudyGroup
     * const studyGroup = await prisma.studyGroup.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends StudyGroupFindFirstOrThrowArgs>(args?: SelectSubset<T, StudyGroupFindFirstOrThrowArgs<ExtArgs>>): Prisma__StudyGroupClient<$Result.GetResult<Prisma.$StudyGroupPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more StudyGroups that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StudyGroupFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all StudyGroups
     * const studyGroups = await prisma.studyGroup.findMany()
     * 
     * // Get first 10 StudyGroups
     * const studyGroups = await prisma.studyGroup.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const studyGroupWithIdOnly = await prisma.studyGroup.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends StudyGroupFindManyArgs>(args?: SelectSubset<T, StudyGroupFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StudyGroupPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a StudyGroup.
     * @param {StudyGroupCreateArgs} args - Arguments to create a StudyGroup.
     * @example
     * // Create one StudyGroup
     * const StudyGroup = await prisma.studyGroup.create({
     *   data: {
     *     // ... data to create a StudyGroup
     *   }
     * })
     * 
     */
    create<T extends StudyGroupCreateArgs>(args: SelectSubset<T, StudyGroupCreateArgs<ExtArgs>>): Prisma__StudyGroupClient<$Result.GetResult<Prisma.$StudyGroupPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many StudyGroups.
     * @param {StudyGroupCreateManyArgs} args - Arguments to create many StudyGroups.
     * @example
     * // Create many StudyGroups
     * const studyGroup = await prisma.studyGroup.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends StudyGroupCreateManyArgs>(args?: SelectSubset<T, StudyGroupCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many StudyGroups and returns the data saved in the database.
     * @param {StudyGroupCreateManyAndReturnArgs} args - Arguments to create many StudyGroups.
     * @example
     * // Create many StudyGroups
     * const studyGroup = await prisma.studyGroup.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many StudyGroups and only return the `id`
     * const studyGroupWithIdOnly = await prisma.studyGroup.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends StudyGroupCreateManyAndReturnArgs>(args?: SelectSubset<T, StudyGroupCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StudyGroupPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a StudyGroup.
     * @param {StudyGroupDeleteArgs} args - Arguments to delete one StudyGroup.
     * @example
     * // Delete one StudyGroup
     * const StudyGroup = await prisma.studyGroup.delete({
     *   where: {
     *     // ... filter to delete one StudyGroup
     *   }
     * })
     * 
     */
    delete<T extends StudyGroupDeleteArgs>(args: SelectSubset<T, StudyGroupDeleteArgs<ExtArgs>>): Prisma__StudyGroupClient<$Result.GetResult<Prisma.$StudyGroupPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one StudyGroup.
     * @param {StudyGroupUpdateArgs} args - Arguments to update one StudyGroup.
     * @example
     * // Update one StudyGroup
     * const studyGroup = await prisma.studyGroup.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends StudyGroupUpdateArgs>(args: SelectSubset<T, StudyGroupUpdateArgs<ExtArgs>>): Prisma__StudyGroupClient<$Result.GetResult<Prisma.$StudyGroupPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more StudyGroups.
     * @param {StudyGroupDeleteManyArgs} args - Arguments to filter StudyGroups to delete.
     * @example
     * // Delete a few StudyGroups
     * const { count } = await prisma.studyGroup.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends StudyGroupDeleteManyArgs>(args?: SelectSubset<T, StudyGroupDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more StudyGroups.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StudyGroupUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many StudyGroups
     * const studyGroup = await prisma.studyGroup.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends StudyGroupUpdateManyArgs>(args: SelectSubset<T, StudyGroupUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more StudyGroups and returns the data updated in the database.
     * @param {StudyGroupUpdateManyAndReturnArgs} args - Arguments to update many StudyGroups.
     * @example
     * // Update many StudyGroups
     * const studyGroup = await prisma.studyGroup.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more StudyGroups and only return the `id`
     * const studyGroupWithIdOnly = await prisma.studyGroup.updateManyAndReturn({
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
    updateManyAndReturn<T extends StudyGroupUpdateManyAndReturnArgs>(args: SelectSubset<T, StudyGroupUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StudyGroupPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one StudyGroup.
     * @param {StudyGroupUpsertArgs} args - Arguments to update or create a StudyGroup.
     * @example
     * // Update or create a StudyGroup
     * const studyGroup = await prisma.studyGroup.upsert({
     *   create: {
     *     // ... data to create a StudyGroup
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the StudyGroup we want to update
     *   }
     * })
     */
    upsert<T extends StudyGroupUpsertArgs>(args: SelectSubset<T, StudyGroupUpsertArgs<ExtArgs>>): Prisma__StudyGroupClient<$Result.GetResult<Prisma.$StudyGroupPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of StudyGroups.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StudyGroupCountArgs} args - Arguments to filter StudyGroups to count.
     * @example
     * // Count the number of StudyGroups
     * const count = await prisma.studyGroup.count({
     *   where: {
     *     // ... the filter for the StudyGroups we want to count
     *   }
     * })
    **/
    count<T extends StudyGroupCountArgs>(
      args?: Subset<T, StudyGroupCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], StudyGroupCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a StudyGroup.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StudyGroupAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends StudyGroupAggregateArgs>(args: Subset<T, StudyGroupAggregateArgs>): Prisma.PrismaPromise<GetStudyGroupAggregateType<T>>

    /**
     * Group by StudyGroup.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StudyGroupGroupByArgs} args - Group by arguments.
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
      T extends StudyGroupGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: StudyGroupGroupByArgs['orderBy'] }
        : { orderBy?: StudyGroupGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, StudyGroupGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetStudyGroupGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the StudyGroup model
   */
  readonly fields: StudyGroupFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for StudyGroup.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__StudyGroupClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    members<T extends StudyGroup$membersArgs<ExtArgs> = {}>(args?: Subset<T, StudyGroup$membersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GroupMemberPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the StudyGroup model
   */
  interface StudyGroupFieldRefs {
    readonly id: FieldRef<"StudyGroup", 'String'>
    readonly name: FieldRef<"StudyGroup", 'String'>
    readonly description: FieldRef<"StudyGroup", 'String'>
    readonly createdBy: FieldRef<"StudyGroup", 'String'>
    readonly createdAt: FieldRef<"StudyGroup", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * StudyGroup findUnique
   */
  export type StudyGroupFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudyGroup
     */
    select?: StudyGroupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StudyGroup
     */
    omit?: StudyGroupOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudyGroupInclude<ExtArgs> | null
    /**
     * Filter, which StudyGroup to fetch.
     */
    where: StudyGroupWhereUniqueInput
  }

  /**
   * StudyGroup findUniqueOrThrow
   */
  export type StudyGroupFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudyGroup
     */
    select?: StudyGroupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StudyGroup
     */
    omit?: StudyGroupOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudyGroupInclude<ExtArgs> | null
    /**
     * Filter, which StudyGroup to fetch.
     */
    where: StudyGroupWhereUniqueInput
  }

  /**
   * StudyGroup findFirst
   */
  export type StudyGroupFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudyGroup
     */
    select?: StudyGroupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StudyGroup
     */
    omit?: StudyGroupOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudyGroupInclude<ExtArgs> | null
    /**
     * Filter, which StudyGroup to fetch.
     */
    where?: StudyGroupWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StudyGroups to fetch.
     */
    orderBy?: StudyGroupOrderByWithRelationInput | StudyGroupOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for StudyGroups.
     */
    cursor?: StudyGroupWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StudyGroups from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StudyGroups.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of StudyGroups.
     */
    distinct?: StudyGroupScalarFieldEnum | StudyGroupScalarFieldEnum[]
  }

  /**
   * StudyGroup findFirstOrThrow
   */
  export type StudyGroupFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudyGroup
     */
    select?: StudyGroupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StudyGroup
     */
    omit?: StudyGroupOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudyGroupInclude<ExtArgs> | null
    /**
     * Filter, which StudyGroup to fetch.
     */
    where?: StudyGroupWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StudyGroups to fetch.
     */
    orderBy?: StudyGroupOrderByWithRelationInput | StudyGroupOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for StudyGroups.
     */
    cursor?: StudyGroupWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StudyGroups from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StudyGroups.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of StudyGroups.
     */
    distinct?: StudyGroupScalarFieldEnum | StudyGroupScalarFieldEnum[]
  }

  /**
   * StudyGroup findMany
   */
  export type StudyGroupFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudyGroup
     */
    select?: StudyGroupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StudyGroup
     */
    omit?: StudyGroupOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudyGroupInclude<ExtArgs> | null
    /**
     * Filter, which StudyGroups to fetch.
     */
    where?: StudyGroupWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StudyGroups to fetch.
     */
    orderBy?: StudyGroupOrderByWithRelationInput | StudyGroupOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing StudyGroups.
     */
    cursor?: StudyGroupWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StudyGroups from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StudyGroups.
     */
    skip?: number
    distinct?: StudyGroupScalarFieldEnum | StudyGroupScalarFieldEnum[]
  }

  /**
   * StudyGroup create
   */
  export type StudyGroupCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudyGroup
     */
    select?: StudyGroupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StudyGroup
     */
    omit?: StudyGroupOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudyGroupInclude<ExtArgs> | null
    /**
     * The data needed to create a StudyGroup.
     */
    data: XOR<StudyGroupCreateInput, StudyGroupUncheckedCreateInput>
  }

  /**
   * StudyGroup createMany
   */
  export type StudyGroupCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many StudyGroups.
     */
    data: StudyGroupCreateManyInput | StudyGroupCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * StudyGroup createManyAndReturn
   */
  export type StudyGroupCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudyGroup
     */
    select?: StudyGroupSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the StudyGroup
     */
    omit?: StudyGroupOmit<ExtArgs> | null
    /**
     * The data used to create many StudyGroups.
     */
    data: StudyGroupCreateManyInput | StudyGroupCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * StudyGroup update
   */
  export type StudyGroupUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudyGroup
     */
    select?: StudyGroupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StudyGroup
     */
    omit?: StudyGroupOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudyGroupInclude<ExtArgs> | null
    /**
     * The data needed to update a StudyGroup.
     */
    data: XOR<StudyGroupUpdateInput, StudyGroupUncheckedUpdateInput>
    /**
     * Choose, which StudyGroup to update.
     */
    where: StudyGroupWhereUniqueInput
  }

  /**
   * StudyGroup updateMany
   */
  export type StudyGroupUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update StudyGroups.
     */
    data: XOR<StudyGroupUpdateManyMutationInput, StudyGroupUncheckedUpdateManyInput>
    /**
     * Filter which StudyGroups to update
     */
    where?: StudyGroupWhereInput
    /**
     * Limit how many StudyGroups to update.
     */
    limit?: number
  }

  /**
   * StudyGroup updateManyAndReturn
   */
  export type StudyGroupUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudyGroup
     */
    select?: StudyGroupSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the StudyGroup
     */
    omit?: StudyGroupOmit<ExtArgs> | null
    /**
     * The data used to update StudyGroups.
     */
    data: XOR<StudyGroupUpdateManyMutationInput, StudyGroupUncheckedUpdateManyInput>
    /**
     * Filter which StudyGroups to update
     */
    where?: StudyGroupWhereInput
    /**
     * Limit how many StudyGroups to update.
     */
    limit?: number
  }

  /**
   * StudyGroup upsert
   */
  export type StudyGroupUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudyGroup
     */
    select?: StudyGroupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StudyGroup
     */
    omit?: StudyGroupOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudyGroupInclude<ExtArgs> | null
    /**
     * The filter to search for the StudyGroup to update in case it exists.
     */
    where: StudyGroupWhereUniqueInput
    /**
     * In case the StudyGroup found by the `where` argument doesn't exist, create a new StudyGroup with this data.
     */
    create: XOR<StudyGroupCreateInput, StudyGroupUncheckedCreateInput>
    /**
     * In case the StudyGroup was found with the provided `where` argument, update it with this data.
     */
    update: XOR<StudyGroupUpdateInput, StudyGroupUncheckedUpdateInput>
  }

  /**
   * StudyGroup delete
   */
  export type StudyGroupDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudyGroup
     */
    select?: StudyGroupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StudyGroup
     */
    omit?: StudyGroupOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudyGroupInclude<ExtArgs> | null
    /**
     * Filter which StudyGroup to delete.
     */
    where: StudyGroupWhereUniqueInput
  }

  /**
   * StudyGroup deleteMany
   */
  export type StudyGroupDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which StudyGroups to delete
     */
    where?: StudyGroupWhereInput
    /**
     * Limit how many StudyGroups to delete.
     */
    limit?: number
  }

  /**
   * StudyGroup.members
   */
  export type StudyGroup$membersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GroupMember
     */
    select?: GroupMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GroupMember
     */
    omit?: GroupMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GroupMemberInclude<ExtArgs> | null
    where?: GroupMemberWhereInput
    orderBy?: GroupMemberOrderByWithRelationInput | GroupMemberOrderByWithRelationInput[]
    cursor?: GroupMemberWhereUniqueInput
    take?: number
    skip?: number
    distinct?: GroupMemberScalarFieldEnum | GroupMemberScalarFieldEnum[]
  }

  /**
   * StudyGroup without action
   */
  export type StudyGroupDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudyGroup
     */
    select?: StudyGroupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StudyGroup
     */
    omit?: StudyGroupOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudyGroupInclude<ExtArgs> | null
  }


  /**
   * Model GroupMember
   */

  export type AggregateGroupMember = {
    _count: GroupMemberCountAggregateOutputType | null
    _min: GroupMemberMinAggregateOutputType | null
    _max: GroupMemberMaxAggregateOutputType | null
  }

  export type GroupMemberMinAggregateOutputType = {
    id: string | null
    groupId: string | null
    userId: string | null
    userName: string | null
    role: string | null
    joinedAt: Date | null
  }

  export type GroupMemberMaxAggregateOutputType = {
    id: string | null
    groupId: string | null
    userId: string | null
    userName: string | null
    role: string | null
    joinedAt: Date | null
  }

  export type GroupMemberCountAggregateOutputType = {
    id: number
    groupId: number
    userId: number
    userName: number
    role: number
    joinedAt: number
    _all: number
  }


  export type GroupMemberMinAggregateInputType = {
    id?: true
    groupId?: true
    userId?: true
    userName?: true
    role?: true
    joinedAt?: true
  }

  export type GroupMemberMaxAggregateInputType = {
    id?: true
    groupId?: true
    userId?: true
    userName?: true
    role?: true
    joinedAt?: true
  }

  export type GroupMemberCountAggregateInputType = {
    id?: true
    groupId?: true
    userId?: true
    userName?: true
    role?: true
    joinedAt?: true
    _all?: true
  }

  export type GroupMemberAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which GroupMember to aggregate.
     */
    where?: GroupMemberWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GroupMembers to fetch.
     */
    orderBy?: GroupMemberOrderByWithRelationInput | GroupMemberOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: GroupMemberWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GroupMembers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GroupMembers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned GroupMembers
    **/
    _count?: true | GroupMemberCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: GroupMemberMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: GroupMemberMaxAggregateInputType
  }

  export type GetGroupMemberAggregateType<T extends GroupMemberAggregateArgs> = {
        [P in keyof T & keyof AggregateGroupMember]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateGroupMember[P]>
      : GetScalarType<T[P], AggregateGroupMember[P]>
  }




  export type GroupMemberGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GroupMemberWhereInput
    orderBy?: GroupMemberOrderByWithAggregationInput | GroupMemberOrderByWithAggregationInput[]
    by: GroupMemberScalarFieldEnum[] | GroupMemberScalarFieldEnum
    having?: GroupMemberScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: GroupMemberCountAggregateInputType | true
    _min?: GroupMemberMinAggregateInputType
    _max?: GroupMemberMaxAggregateInputType
  }

  export type GroupMemberGroupByOutputType = {
    id: string
    groupId: string
    userId: string
    userName: string
    role: string
    joinedAt: Date
    _count: GroupMemberCountAggregateOutputType | null
    _min: GroupMemberMinAggregateOutputType | null
    _max: GroupMemberMaxAggregateOutputType | null
  }

  type GetGroupMemberGroupByPayload<T extends GroupMemberGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<GroupMemberGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof GroupMemberGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], GroupMemberGroupByOutputType[P]>
            : GetScalarType<T[P], GroupMemberGroupByOutputType[P]>
        }
      >
    >


  export type GroupMemberSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    groupId?: boolean
    userId?: boolean
    userName?: boolean
    role?: boolean
    joinedAt?: boolean
    group?: boolean | StudyGroupDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["groupMember"]>

  export type GroupMemberSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    groupId?: boolean
    userId?: boolean
    userName?: boolean
    role?: boolean
    joinedAt?: boolean
    group?: boolean | StudyGroupDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["groupMember"]>

  export type GroupMemberSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    groupId?: boolean
    userId?: boolean
    userName?: boolean
    role?: boolean
    joinedAt?: boolean
    group?: boolean | StudyGroupDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["groupMember"]>

  export type GroupMemberSelectScalar = {
    id?: boolean
    groupId?: boolean
    userId?: boolean
    userName?: boolean
    role?: boolean
    joinedAt?: boolean
  }

  export type GroupMemberOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "groupId" | "userId" | "userName" | "role" | "joinedAt", ExtArgs["result"]["groupMember"]>
  export type GroupMemberInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    group?: boolean | StudyGroupDefaultArgs<ExtArgs>
  }
  export type GroupMemberIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    group?: boolean | StudyGroupDefaultArgs<ExtArgs>
  }
  export type GroupMemberIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    group?: boolean | StudyGroupDefaultArgs<ExtArgs>
  }

  export type $GroupMemberPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "GroupMember"
    objects: {
      group: Prisma.$StudyGroupPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      groupId: string
      userId: string
      userName: string
      role: string
      joinedAt: Date
    }, ExtArgs["result"]["groupMember"]>
    composites: {}
  }

  type GroupMemberGetPayload<S extends boolean | null | undefined | GroupMemberDefaultArgs> = $Result.GetResult<Prisma.$GroupMemberPayload, S>

  type GroupMemberCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<GroupMemberFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: GroupMemberCountAggregateInputType | true
    }

  export interface GroupMemberDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['GroupMember'], meta: { name: 'GroupMember' } }
    /**
     * Find zero or one GroupMember that matches the filter.
     * @param {GroupMemberFindUniqueArgs} args - Arguments to find a GroupMember
     * @example
     * // Get one GroupMember
     * const groupMember = await prisma.groupMember.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends GroupMemberFindUniqueArgs>(args: SelectSubset<T, GroupMemberFindUniqueArgs<ExtArgs>>): Prisma__GroupMemberClient<$Result.GetResult<Prisma.$GroupMemberPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one GroupMember that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {GroupMemberFindUniqueOrThrowArgs} args - Arguments to find a GroupMember
     * @example
     * // Get one GroupMember
     * const groupMember = await prisma.groupMember.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends GroupMemberFindUniqueOrThrowArgs>(args: SelectSubset<T, GroupMemberFindUniqueOrThrowArgs<ExtArgs>>): Prisma__GroupMemberClient<$Result.GetResult<Prisma.$GroupMemberPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first GroupMember that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GroupMemberFindFirstArgs} args - Arguments to find a GroupMember
     * @example
     * // Get one GroupMember
     * const groupMember = await prisma.groupMember.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends GroupMemberFindFirstArgs>(args?: SelectSubset<T, GroupMemberFindFirstArgs<ExtArgs>>): Prisma__GroupMemberClient<$Result.GetResult<Prisma.$GroupMemberPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first GroupMember that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GroupMemberFindFirstOrThrowArgs} args - Arguments to find a GroupMember
     * @example
     * // Get one GroupMember
     * const groupMember = await prisma.groupMember.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends GroupMemberFindFirstOrThrowArgs>(args?: SelectSubset<T, GroupMemberFindFirstOrThrowArgs<ExtArgs>>): Prisma__GroupMemberClient<$Result.GetResult<Prisma.$GroupMemberPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more GroupMembers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GroupMemberFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all GroupMembers
     * const groupMembers = await prisma.groupMember.findMany()
     * 
     * // Get first 10 GroupMembers
     * const groupMembers = await prisma.groupMember.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const groupMemberWithIdOnly = await prisma.groupMember.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends GroupMemberFindManyArgs>(args?: SelectSubset<T, GroupMemberFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GroupMemberPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a GroupMember.
     * @param {GroupMemberCreateArgs} args - Arguments to create a GroupMember.
     * @example
     * // Create one GroupMember
     * const GroupMember = await prisma.groupMember.create({
     *   data: {
     *     // ... data to create a GroupMember
     *   }
     * })
     * 
     */
    create<T extends GroupMemberCreateArgs>(args: SelectSubset<T, GroupMemberCreateArgs<ExtArgs>>): Prisma__GroupMemberClient<$Result.GetResult<Prisma.$GroupMemberPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many GroupMembers.
     * @param {GroupMemberCreateManyArgs} args - Arguments to create many GroupMembers.
     * @example
     * // Create many GroupMembers
     * const groupMember = await prisma.groupMember.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends GroupMemberCreateManyArgs>(args?: SelectSubset<T, GroupMemberCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many GroupMembers and returns the data saved in the database.
     * @param {GroupMemberCreateManyAndReturnArgs} args - Arguments to create many GroupMembers.
     * @example
     * // Create many GroupMembers
     * const groupMember = await prisma.groupMember.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many GroupMembers and only return the `id`
     * const groupMemberWithIdOnly = await prisma.groupMember.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends GroupMemberCreateManyAndReturnArgs>(args?: SelectSubset<T, GroupMemberCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GroupMemberPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a GroupMember.
     * @param {GroupMemberDeleteArgs} args - Arguments to delete one GroupMember.
     * @example
     * // Delete one GroupMember
     * const GroupMember = await prisma.groupMember.delete({
     *   where: {
     *     // ... filter to delete one GroupMember
     *   }
     * })
     * 
     */
    delete<T extends GroupMemberDeleteArgs>(args: SelectSubset<T, GroupMemberDeleteArgs<ExtArgs>>): Prisma__GroupMemberClient<$Result.GetResult<Prisma.$GroupMemberPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one GroupMember.
     * @param {GroupMemberUpdateArgs} args - Arguments to update one GroupMember.
     * @example
     * // Update one GroupMember
     * const groupMember = await prisma.groupMember.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends GroupMemberUpdateArgs>(args: SelectSubset<T, GroupMemberUpdateArgs<ExtArgs>>): Prisma__GroupMemberClient<$Result.GetResult<Prisma.$GroupMemberPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more GroupMembers.
     * @param {GroupMemberDeleteManyArgs} args - Arguments to filter GroupMembers to delete.
     * @example
     * // Delete a few GroupMembers
     * const { count } = await prisma.groupMember.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends GroupMemberDeleteManyArgs>(args?: SelectSubset<T, GroupMemberDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more GroupMembers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GroupMemberUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many GroupMembers
     * const groupMember = await prisma.groupMember.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends GroupMemberUpdateManyArgs>(args: SelectSubset<T, GroupMemberUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more GroupMembers and returns the data updated in the database.
     * @param {GroupMemberUpdateManyAndReturnArgs} args - Arguments to update many GroupMembers.
     * @example
     * // Update many GroupMembers
     * const groupMember = await prisma.groupMember.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more GroupMembers and only return the `id`
     * const groupMemberWithIdOnly = await prisma.groupMember.updateManyAndReturn({
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
    updateManyAndReturn<T extends GroupMemberUpdateManyAndReturnArgs>(args: SelectSubset<T, GroupMemberUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GroupMemberPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one GroupMember.
     * @param {GroupMemberUpsertArgs} args - Arguments to update or create a GroupMember.
     * @example
     * // Update or create a GroupMember
     * const groupMember = await prisma.groupMember.upsert({
     *   create: {
     *     // ... data to create a GroupMember
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the GroupMember we want to update
     *   }
     * })
     */
    upsert<T extends GroupMemberUpsertArgs>(args: SelectSubset<T, GroupMemberUpsertArgs<ExtArgs>>): Prisma__GroupMemberClient<$Result.GetResult<Prisma.$GroupMemberPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of GroupMembers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GroupMemberCountArgs} args - Arguments to filter GroupMembers to count.
     * @example
     * // Count the number of GroupMembers
     * const count = await prisma.groupMember.count({
     *   where: {
     *     // ... the filter for the GroupMembers we want to count
     *   }
     * })
    **/
    count<T extends GroupMemberCountArgs>(
      args?: Subset<T, GroupMemberCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], GroupMemberCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a GroupMember.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GroupMemberAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends GroupMemberAggregateArgs>(args: Subset<T, GroupMemberAggregateArgs>): Prisma.PrismaPromise<GetGroupMemberAggregateType<T>>

    /**
     * Group by GroupMember.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GroupMemberGroupByArgs} args - Group by arguments.
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
      T extends GroupMemberGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: GroupMemberGroupByArgs['orderBy'] }
        : { orderBy?: GroupMemberGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, GroupMemberGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetGroupMemberGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the GroupMember model
   */
  readonly fields: GroupMemberFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for GroupMember.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__GroupMemberClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    group<T extends StudyGroupDefaultArgs<ExtArgs> = {}>(args?: Subset<T, StudyGroupDefaultArgs<ExtArgs>>): Prisma__StudyGroupClient<$Result.GetResult<Prisma.$StudyGroupPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the GroupMember model
   */
  interface GroupMemberFieldRefs {
    readonly id: FieldRef<"GroupMember", 'String'>
    readonly groupId: FieldRef<"GroupMember", 'String'>
    readonly userId: FieldRef<"GroupMember", 'String'>
    readonly userName: FieldRef<"GroupMember", 'String'>
    readonly role: FieldRef<"GroupMember", 'String'>
    readonly joinedAt: FieldRef<"GroupMember", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * GroupMember findUnique
   */
  export type GroupMemberFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GroupMember
     */
    select?: GroupMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GroupMember
     */
    omit?: GroupMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GroupMemberInclude<ExtArgs> | null
    /**
     * Filter, which GroupMember to fetch.
     */
    where: GroupMemberWhereUniqueInput
  }

  /**
   * GroupMember findUniqueOrThrow
   */
  export type GroupMemberFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GroupMember
     */
    select?: GroupMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GroupMember
     */
    omit?: GroupMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GroupMemberInclude<ExtArgs> | null
    /**
     * Filter, which GroupMember to fetch.
     */
    where: GroupMemberWhereUniqueInput
  }

  /**
   * GroupMember findFirst
   */
  export type GroupMemberFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GroupMember
     */
    select?: GroupMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GroupMember
     */
    omit?: GroupMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GroupMemberInclude<ExtArgs> | null
    /**
     * Filter, which GroupMember to fetch.
     */
    where?: GroupMemberWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GroupMembers to fetch.
     */
    orderBy?: GroupMemberOrderByWithRelationInput | GroupMemberOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for GroupMembers.
     */
    cursor?: GroupMemberWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GroupMembers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GroupMembers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GroupMembers.
     */
    distinct?: GroupMemberScalarFieldEnum | GroupMemberScalarFieldEnum[]
  }

  /**
   * GroupMember findFirstOrThrow
   */
  export type GroupMemberFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GroupMember
     */
    select?: GroupMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GroupMember
     */
    omit?: GroupMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GroupMemberInclude<ExtArgs> | null
    /**
     * Filter, which GroupMember to fetch.
     */
    where?: GroupMemberWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GroupMembers to fetch.
     */
    orderBy?: GroupMemberOrderByWithRelationInput | GroupMemberOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for GroupMembers.
     */
    cursor?: GroupMemberWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GroupMembers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GroupMembers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GroupMembers.
     */
    distinct?: GroupMemberScalarFieldEnum | GroupMemberScalarFieldEnum[]
  }

  /**
   * GroupMember findMany
   */
  export type GroupMemberFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GroupMember
     */
    select?: GroupMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GroupMember
     */
    omit?: GroupMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GroupMemberInclude<ExtArgs> | null
    /**
     * Filter, which GroupMembers to fetch.
     */
    where?: GroupMemberWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GroupMembers to fetch.
     */
    orderBy?: GroupMemberOrderByWithRelationInput | GroupMemberOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing GroupMembers.
     */
    cursor?: GroupMemberWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GroupMembers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GroupMembers.
     */
    skip?: number
    distinct?: GroupMemberScalarFieldEnum | GroupMemberScalarFieldEnum[]
  }

  /**
   * GroupMember create
   */
  export type GroupMemberCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GroupMember
     */
    select?: GroupMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GroupMember
     */
    omit?: GroupMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GroupMemberInclude<ExtArgs> | null
    /**
     * The data needed to create a GroupMember.
     */
    data: XOR<GroupMemberCreateInput, GroupMemberUncheckedCreateInput>
  }

  /**
   * GroupMember createMany
   */
  export type GroupMemberCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many GroupMembers.
     */
    data: GroupMemberCreateManyInput | GroupMemberCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * GroupMember createManyAndReturn
   */
  export type GroupMemberCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GroupMember
     */
    select?: GroupMemberSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the GroupMember
     */
    omit?: GroupMemberOmit<ExtArgs> | null
    /**
     * The data used to create many GroupMembers.
     */
    data: GroupMemberCreateManyInput | GroupMemberCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GroupMemberIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * GroupMember update
   */
  export type GroupMemberUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GroupMember
     */
    select?: GroupMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GroupMember
     */
    omit?: GroupMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GroupMemberInclude<ExtArgs> | null
    /**
     * The data needed to update a GroupMember.
     */
    data: XOR<GroupMemberUpdateInput, GroupMemberUncheckedUpdateInput>
    /**
     * Choose, which GroupMember to update.
     */
    where: GroupMemberWhereUniqueInput
  }

  /**
   * GroupMember updateMany
   */
  export type GroupMemberUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update GroupMembers.
     */
    data: XOR<GroupMemberUpdateManyMutationInput, GroupMemberUncheckedUpdateManyInput>
    /**
     * Filter which GroupMembers to update
     */
    where?: GroupMemberWhereInput
    /**
     * Limit how many GroupMembers to update.
     */
    limit?: number
  }

  /**
   * GroupMember updateManyAndReturn
   */
  export type GroupMemberUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GroupMember
     */
    select?: GroupMemberSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the GroupMember
     */
    omit?: GroupMemberOmit<ExtArgs> | null
    /**
     * The data used to update GroupMembers.
     */
    data: XOR<GroupMemberUpdateManyMutationInput, GroupMemberUncheckedUpdateManyInput>
    /**
     * Filter which GroupMembers to update
     */
    where?: GroupMemberWhereInput
    /**
     * Limit how many GroupMembers to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GroupMemberIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * GroupMember upsert
   */
  export type GroupMemberUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GroupMember
     */
    select?: GroupMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GroupMember
     */
    omit?: GroupMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GroupMemberInclude<ExtArgs> | null
    /**
     * The filter to search for the GroupMember to update in case it exists.
     */
    where: GroupMemberWhereUniqueInput
    /**
     * In case the GroupMember found by the `where` argument doesn't exist, create a new GroupMember with this data.
     */
    create: XOR<GroupMemberCreateInput, GroupMemberUncheckedCreateInput>
    /**
     * In case the GroupMember was found with the provided `where` argument, update it with this data.
     */
    update: XOR<GroupMemberUpdateInput, GroupMemberUncheckedUpdateInput>
  }

  /**
   * GroupMember delete
   */
  export type GroupMemberDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GroupMember
     */
    select?: GroupMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GroupMember
     */
    omit?: GroupMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GroupMemberInclude<ExtArgs> | null
    /**
     * Filter which GroupMember to delete.
     */
    where: GroupMemberWhereUniqueInput
  }

  /**
   * GroupMember deleteMany
   */
  export type GroupMemberDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which GroupMembers to delete
     */
    where?: GroupMemberWhereInput
    /**
     * Limit how many GroupMembers to delete.
     */
    limit?: number
  }

  /**
   * GroupMember without action
   */
  export type GroupMemberDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GroupMember
     */
    select?: GroupMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GroupMember
     */
    omit?: GroupMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GroupMemberInclude<ExtArgs> | null
  }


  /**
   * Model ChallengeRating
   */

  export type AggregateChallengeRating = {
    _count: ChallengeRatingCountAggregateOutputType | null
    _avg: ChallengeRatingAvgAggregateOutputType | null
    _sum: ChallengeRatingSumAggregateOutputType | null
    _min: ChallengeRatingMinAggregateOutputType | null
    _max: ChallengeRatingMaxAggregateOutputType | null
  }

  export type ChallengeRatingAvgAggregateOutputType = {
    rating: number | null
    battlesTotal: number | null
    battlesWon: number | null
    winRate: number | null
    currentStreak: number | null
    longestStreak: number | null
    totalXP: number | null
  }

  export type ChallengeRatingSumAggregateOutputType = {
    rating: number | null
    battlesTotal: number | null
    battlesWon: number | null
    winRate: number | null
    currentStreak: number | null
    longestStreak: number | null
    totalXP: number | null
  }

  export type ChallengeRatingMinAggregateOutputType = {
    id: string | null
    userId: string | null
    userName: string | null
    userAvatar: string | null
    rating: number | null
    tier: string | null
    battlesTotal: number | null
    battlesWon: number | null
    winRate: number | null
    currentStreak: number | null
    longestStreak: number | null
    totalXP: number | null
    updatedAt: Date | null
  }

  export type ChallengeRatingMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    userName: string | null
    userAvatar: string | null
    rating: number | null
    tier: string | null
    battlesTotal: number | null
    battlesWon: number | null
    winRate: number | null
    currentStreak: number | null
    longestStreak: number | null
    totalXP: number | null
    updatedAt: Date | null
  }

  export type ChallengeRatingCountAggregateOutputType = {
    id: number
    userId: number
    userName: number
    userAvatar: number
    rating: number
    tier: number
    battlesTotal: number
    battlesWon: number
    winRate: number
    currentStreak: number
    longestStreak: number
    totalXP: number
    updatedAt: number
    _all: number
  }


  export type ChallengeRatingAvgAggregateInputType = {
    rating?: true
    battlesTotal?: true
    battlesWon?: true
    winRate?: true
    currentStreak?: true
    longestStreak?: true
    totalXP?: true
  }

  export type ChallengeRatingSumAggregateInputType = {
    rating?: true
    battlesTotal?: true
    battlesWon?: true
    winRate?: true
    currentStreak?: true
    longestStreak?: true
    totalXP?: true
  }

  export type ChallengeRatingMinAggregateInputType = {
    id?: true
    userId?: true
    userName?: true
    userAvatar?: true
    rating?: true
    tier?: true
    battlesTotal?: true
    battlesWon?: true
    winRate?: true
    currentStreak?: true
    longestStreak?: true
    totalXP?: true
    updatedAt?: true
  }

  export type ChallengeRatingMaxAggregateInputType = {
    id?: true
    userId?: true
    userName?: true
    userAvatar?: true
    rating?: true
    tier?: true
    battlesTotal?: true
    battlesWon?: true
    winRate?: true
    currentStreak?: true
    longestStreak?: true
    totalXP?: true
    updatedAt?: true
  }

  export type ChallengeRatingCountAggregateInputType = {
    id?: true
    userId?: true
    userName?: true
    userAvatar?: true
    rating?: true
    tier?: true
    battlesTotal?: true
    battlesWon?: true
    winRate?: true
    currentStreak?: true
    longestStreak?: true
    totalXP?: true
    updatedAt?: true
    _all?: true
  }

  export type ChallengeRatingAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ChallengeRating to aggregate.
     */
    where?: ChallengeRatingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChallengeRatings to fetch.
     */
    orderBy?: ChallengeRatingOrderByWithRelationInput | ChallengeRatingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ChallengeRatingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChallengeRatings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChallengeRatings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ChallengeRatings
    **/
    _count?: true | ChallengeRatingCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ChallengeRatingAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ChallengeRatingSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ChallengeRatingMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ChallengeRatingMaxAggregateInputType
  }

  export type GetChallengeRatingAggregateType<T extends ChallengeRatingAggregateArgs> = {
        [P in keyof T & keyof AggregateChallengeRating]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateChallengeRating[P]>
      : GetScalarType<T[P], AggregateChallengeRating[P]>
  }




  export type ChallengeRatingGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ChallengeRatingWhereInput
    orderBy?: ChallengeRatingOrderByWithAggregationInput | ChallengeRatingOrderByWithAggregationInput[]
    by: ChallengeRatingScalarFieldEnum[] | ChallengeRatingScalarFieldEnum
    having?: ChallengeRatingScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ChallengeRatingCountAggregateInputType | true
    _avg?: ChallengeRatingAvgAggregateInputType
    _sum?: ChallengeRatingSumAggregateInputType
    _min?: ChallengeRatingMinAggregateInputType
    _max?: ChallengeRatingMaxAggregateInputType
  }

  export type ChallengeRatingGroupByOutputType = {
    id: string
    userId: string
    userName: string
    userAvatar: string | null
    rating: number
    tier: string
    battlesTotal: number
    battlesWon: number
    winRate: number
    currentStreak: number
    longestStreak: number
    totalXP: number
    updatedAt: Date
    _count: ChallengeRatingCountAggregateOutputType | null
    _avg: ChallengeRatingAvgAggregateOutputType | null
    _sum: ChallengeRatingSumAggregateOutputType | null
    _min: ChallengeRatingMinAggregateOutputType | null
    _max: ChallengeRatingMaxAggregateOutputType | null
  }

  type GetChallengeRatingGroupByPayload<T extends ChallengeRatingGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ChallengeRatingGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ChallengeRatingGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ChallengeRatingGroupByOutputType[P]>
            : GetScalarType<T[P], ChallengeRatingGroupByOutputType[P]>
        }
      >
    >


  export type ChallengeRatingSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    userName?: boolean
    userAvatar?: boolean
    rating?: boolean
    tier?: boolean
    battlesTotal?: boolean
    battlesWon?: boolean
    winRate?: boolean
    currentStreak?: boolean
    longestStreak?: boolean
    totalXP?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["challengeRating"]>

  export type ChallengeRatingSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    userName?: boolean
    userAvatar?: boolean
    rating?: boolean
    tier?: boolean
    battlesTotal?: boolean
    battlesWon?: boolean
    winRate?: boolean
    currentStreak?: boolean
    longestStreak?: boolean
    totalXP?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["challengeRating"]>

  export type ChallengeRatingSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    userName?: boolean
    userAvatar?: boolean
    rating?: boolean
    tier?: boolean
    battlesTotal?: boolean
    battlesWon?: boolean
    winRate?: boolean
    currentStreak?: boolean
    longestStreak?: boolean
    totalXP?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["challengeRating"]>

  export type ChallengeRatingSelectScalar = {
    id?: boolean
    userId?: boolean
    userName?: boolean
    userAvatar?: boolean
    rating?: boolean
    tier?: boolean
    battlesTotal?: boolean
    battlesWon?: boolean
    winRate?: boolean
    currentStreak?: boolean
    longestStreak?: boolean
    totalXP?: boolean
    updatedAt?: boolean
  }

  export type ChallengeRatingOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "userName" | "userAvatar" | "rating" | "tier" | "battlesTotal" | "battlesWon" | "winRate" | "currentStreak" | "longestStreak" | "totalXP" | "updatedAt", ExtArgs["result"]["challengeRating"]>

  export type $ChallengeRatingPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ChallengeRating"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      userName: string
      userAvatar: string | null
      rating: number
      tier: string
      battlesTotal: number
      battlesWon: number
      winRate: number
      currentStreak: number
      longestStreak: number
      totalXP: number
      updatedAt: Date
    }, ExtArgs["result"]["challengeRating"]>
    composites: {}
  }

  type ChallengeRatingGetPayload<S extends boolean | null | undefined | ChallengeRatingDefaultArgs> = $Result.GetResult<Prisma.$ChallengeRatingPayload, S>

  type ChallengeRatingCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ChallengeRatingFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ChallengeRatingCountAggregateInputType | true
    }

  export interface ChallengeRatingDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ChallengeRating'], meta: { name: 'ChallengeRating' } }
    /**
     * Find zero or one ChallengeRating that matches the filter.
     * @param {ChallengeRatingFindUniqueArgs} args - Arguments to find a ChallengeRating
     * @example
     * // Get one ChallengeRating
     * const challengeRating = await prisma.challengeRating.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ChallengeRatingFindUniqueArgs>(args: SelectSubset<T, ChallengeRatingFindUniqueArgs<ExtArgs>>): Prisma__ChallengeRatingClient<$Result.GetResult<Prisma.$ChallengeRatingPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ChallengeRating that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ChallengeRatingFindUniqueOrThrowArgs} args - Arguments to find a ChallengeRating
     * @example
     * // Get one ChallengeRating
     * const challengeRating = await prisma.challengeRating.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ChallengeRatingFindUniqueOrThrowArgs>(args: SelectSubset<T, ChallengeRatingFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ChallengeRatingClient<$Result.GetResult<Prisma.$ChallengeRatingPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ChallengeRating that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChallengeRatingFindFirstArgs} args - Arguments to find a ChallengeRating
     * @example
     * // Get one ChallengeRating
     * const challengeRating = await prisma.challengeRating.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ChallengeRatingFindFirstArgs>(args?: SelectSubset<T, ChallengeRatingFindFirstArgs<ExtArgs>>): Prisma__ChallengeRatingClient<$Result.GetResult<Prisma.$ChallengeRatingPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ChallengeRating that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChallengeRatingFindFirstOrThrowArgs} args - Arguments to find a ChallengeRating
     * @example
     * // Get one ChallengeRating
     * const challengeRating = await prisma.challengeRating.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ChallengeRatingFindFirstOrThrowArgs>(args?: SelectSubset<T, ChallengeRatingFindFirstOrThrowArgs<ExtArgs>>): Prisma__ChallengeRatingClient<$Result.GetResult<Prisma.$ChallengeRatingPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ChallengeRatings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChallengeRatingFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ChallengeRatings
     * const challengeRatings = await prisma.challengeRating.findMany()
     * 
     * // Get first 10 ChallengeRatings
     * const challengeRatings = await prisma.challengeRating.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const challengeRatingWithIdOnly = await prisma.challengeRating.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ChallengeRatingFindManyArgs>(args?: SelectSubset<T, ChallengeRatingFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChallengeRatingPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ChallengeRating.
     * @param {ChallengeRatingCreateArgs} args - Arguments to create a ChallengeRating.
     * @example
     * // Create one ChallengeRating
     * const ChallengeRating = await prisma.challengeRating.create({
     *   data: {
     *     // ... data to create a ChallengeRating
     *   }
     * })
     * 
     */
    create<T extends ChallengeRatingCreateArgs>(args: SelectSubset<T, ChallengeRatingCreateArgs<ExtArgs>>): Prisma__ChallengeRatingClient<$Result.GetResult<Prisma.$ChallengeRatingPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ChallengeRatings.
     * @param {ChallengeRatingCreateManyArgs} args - Arguments to create many ChallengeRatings.
     * @example
     * // Create many ChallengeRatings
     * const challengeRating = await prisma.challengeRating.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ChallengeRatingCreateManyArgs>(args?: SelectSubset<T, ChallengeRatingCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ChallengeRatings and returns the data saved in the database.
     * @param {ChallengeRatingCreateManyAndReturnArgs} args - Arguments to create many ChallengeRatings.
     * @example
     * // Create many ChallengeRatings
     * const challengeRating = await prisma.challengeRating.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ChallengeRatings and only return the `id`
     * const challengeRatingWithIdOnly = await prisma.challengeRating.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ChallengeRatingCreateManyAndReturnArgs>(args?: SelectSubset<T, ChallengeRatingCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChallengeRatingPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ChallengeRating.
     * @param {ChallengeRatingDeleteArgs} args - Arguments to delete one ChallengeRating.
     * @example
     * // Delete one ChallengeRating
     * const ChallengeRating = await prisma.challengeRating.delete({
     *   where: {
     *     // ... filter to delete one ChallengeRating
     *   }
     * })
     * 
     */
    delete<T extends ChallengeRatingDeleteArgs>(args: SelectSubset<T, ChallengeRatingDeleteArgs<ExtArgs>>): Prisma__ChallengeRatingClient<$Result.GetResult<Prisma.$ChallengeRatingPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ChallengeRating.
     * @param {ChallengeRatingUpdateArgs} args - Arguments to update one ChallengeRating.
     * @example
     * // Update one ChallengeRating
     * const challengeRating = await prisma.challengeRating.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ChallengeRatingUpdateArgs>(args: SelectSubset<T, ChallengeRatingUpdateArgs<ExtArgs>>): Prisma__ChallengeRatingClient<$Result.GetResult<Prisma.$ChallengeRatingPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ChallengeRatings.
     * @param {ChallengeRatingDeleteManyArgs} args - Arguments to filter ChallengeRatings to delete.
     * @example
     * // Delete a few ChallengeRatings
     * const { count } = await prisma.challengeRating.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ChallengeRatingDeleteManyArgs>(args?: SelectSubset<T, ChallengeRatingDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ChallengeRatings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChallengeRatingUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ChallengeRatings
     * const challengeRating = await prisma.challengeRating.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ChallengeRatingUpdateManyArgs>(args: SelectSubset<T, ChallengeRatingUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ChallengeRatings and returns the data updated in the database.
     * @param {ChallengeRatingUpdateManyAndReturnArgs} args - Arguments to update many ChallengeRatings.
     * @example
     * // Update many ChallengeRatings
     * const challengeRating = await prisma.challengeRating.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ChallengeRatings and only return the `id`
     * const challengeRatingWithIdOnly = await prisma.challengeRating.updateManyAndReturn({
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
    updateManyAndReturn<T extends ChallengeRatingUpdateManyAndReturnArgs>(args: SelectSubset<T, ChallengeRatingUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChallengeRatingPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ChallengeRating.
     * @param {ChallengeRatingUpsertArgs} args - Arguments to update or create a ChallengeRating.
     * @example
     * // Update or create a ChallengeRating
     * const challengeRating = await prisma.challengeRating.upsert({
     *   create: {
     *     // ... data to create a ChallengeRating
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ChallengeRating we want to update
     *   }
     * })
     */
    upsert<T extends ChallengeRatingUpsertArgs>(args: SelectSubset<T, ChallengeRatingUpsertArgs<ExtArgs>>): Prisma__ChallengeRatingClient<$Result.GetResult<Prisma.$ChallengeRatingPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ChallengeRatings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChallengeRatingCountArgs} args - Arguments to filter ChallengeRatings to count.
     * @example
     * // Count the number of ChallengeRatings
     * const count = await prisma.challengeRating.count({
     *   where: {
     *     // ... the filter for the ChallengeRatings we want to count
     *   }
     * })
    **/
    count<T extends ChallengeRatingCountArgs>(
      args?: Subset<T, ChallengeRatingCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ChallengeRatingCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ChallengeRating.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChallengeRatingAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ChallengeRatingAggregateArgs>(args: Subset<T, ChallengeRatingAggregateArgs>): Prisma.PrismaPromise<GetChallengeRatingAggregateType<T>>

    /**
     * Group by ChallengeRating.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChallengeRatingGroupByArgs} args - Group by arguments.
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
      T extends ChallengeRatingGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ChallengeRatingGroupByArgs['orderBy'] }
        : { orderBy?: ChallengeRatingGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ChallengeRatingGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetChallengeRatingGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ChallengeRating model
   */
  readonly fields: ChallengeRatingFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ChallengeRating.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ChallengeRatingClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
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
   * Fields of the ChallengeRating model
   */
  interface ChallengeRatingFieldRefs {
    readonly id: FieldRef<"ChallengeRating", 'String'>
    readonly userId: FieldRef<"ChallengeRating", 'String'>
    readonly userName: FieldRef<"ChallengeRating", 'String'>
    readonly userAvatar: FieldRef<"ChallengeRating", 'String'>
    readonly rating: FieldRef<"ChallengeRating", 'Int'>
    readonly tier: FieldRef<"ChallengeRating", 'String'>
    readonly battlesTotal: FieldRef<"ChallengeRating", 'Int'>
    readonly battlesWon: FieldRef<"ChallengeRating", 'Int'>
    readonly winRate: FieldRef<"ChallengeRating", 'Float'>
    readonly currentStreak: FieldRef<"ChallengeRating", 'Int'>
    readonly longestStreak: FieldRef<"ChallengeRating", 'Int'>
    readonly totalXP: FieldRef<"ChallengeRating", 'Int'>
    readonly updatedAt: FieldRef<"ChallengeRating", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ChallengeRating findUnique
   */
  export type ChallengeRatingFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChallengeRating
     */
    select?: ChallengeRatingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChallengeRating
     */
    omit?: ChallengeRatingOmit<ExtArgs> | null
    /**
     * Filter, which ChallengeRating to fetch.
     */
    where: ChallengeRatingWhereUniqueInput
  }

  /**
   * ChallengeRating findUniqueOrThrow
   */
  export type ChallengeRatingFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChallengeRating
     */
    select?: ChallengeRatingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChallengeRating
     */
    omit?: ChallengeRatingOmit<ExtArgs> | null
    /**
     * Filter, which ChallengeRating to fetch.
     */
    where: ChallengeRatingWhereUniqueInput
  }

  /**
   * ChallengeRating findFirst
   */
  export type ChallengeRatingFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChallengeRating
     */
    select?: ChallengeRatingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChallengeRating
     */
    omit?: ChallengeRatingOmit<ExtArgs> | null
    /**
     * Filter, which ChallengeRating to fetch.
     */
    where?: ChallengeRatingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChallengeRatings to fetch.
     */
    orderBy?: ChallengeRatingOrderByWithRelationInput | ChallengeRatingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ChallengeRatings.
     */
    cursor?: ChallengeRatingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChallengeRatings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChallengeRatings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ChallengeRatings.
     */
    distinct?: ChallengeRatingScalarFieldEnum | ChallengeRatingScalarFieldEnum[]
  }

  /**
   * ChallengeRating findFirstOrThrow
   */
  export type ChallengeRatingFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChallengeRating
     */
    select?: ChallengeRatingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChallengeRating
     */
    omit?: ChallengeRatingOmit<ExtArgs> | null
    /**
     * Filter, which ChallengeRating to fetch.
     */
    where?: ChallengeRatingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChallengeRatings to fetch.
     */
    orderBy?: ChallengeRatingOrderByWithRelationInput | ChallengeRatingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ChallengeRatings.
     */
    cursor?: ChallengeRatingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChallengeRatings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChallengeRatings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ChallengeRatings.
     */
    distinct?: ChallengeRatingScalarFieldEnum | ChallengeRatingScalarFieldEnum[]
  }

  /**
   * ChallengeRating findMany
   */
  export type ChallengeRatingFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChallengeRating
     */
    select?: ChallengeRatingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChallengeRating
     */
    omit?: ChallengeRatingOmit<ExtArgs> | null
    /**
     * Filter, which ChallengeRatings to fetch.
     */
    where?: ChallengeRatingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChallengeRatings to fetch.
     */
    orderBy?: ChallengeRatingOrderByWithRelationInput | ChallengeRatingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ChallengeRatings.
     */
    cursor?: ChallengeRatingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChallengeRatings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChallengeRatings.
     */
    skip?: number
    distinct?: ChallengeRatingScalarFieldEnum | ChallengeRatingScalarFieldEnum[]
  }

  /**
   * ChallengeRating create
   */
  export type ChallengeRatingCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChallengeRating
     */
    select?: ChallengeRatingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChallengeRating
     */
    omit?: ChallengeRatingOmit<ExtArgs> | null
    /**
     * The data needed to create a ChallengeRating.
     */
    data: XOR<ChallengeRatingCreateInput, ChallengeRatingUncheckedCreateInput>
  }

  /**
   * ChallengeRating createMany
   */
  export type ChallengeRatingCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ChallengeRatings.
     */
    data: ChallengeRatingCreateManyInput | ChallengeRatingCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ChallengeRating createManyAndReturn
   */
  export type ChallengeRatingCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChallengeRating
     */
    select?: ChallengeRatingSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ChallengeRating
     */
    omit?: ChallengeRatingOmit<ExtArgs> | null
    /**
     * The data used to create many ChallengeRatings.
     */
    data: ChallengeRatingCreateManyInput | ChallengeRatingCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ChallengeRating update
   */
  export type ChallengeRatingUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChallengeRating
     */
    select?: ChallengeRatingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChallengeRating
     */
    omit?: ChallengeRatingOmit<ExtArgs> | null
    /**
     * The data needed to update a ChallengeRating.
     */
    data: XOR<ChallengeRatingUpdateInput, ChallengeRatingUncheckedUpdateInput>
    /**
     * Choose, which ChallengeRating to update.
     */
    where: ChallengeRatingWhereUniqueInput
  }

  /**
   * ChallengeRating updateMany
   */
  export type ChallengeRatingUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ChallengeRatings.
     */
    data: XOR<ChallengeRatingUpdateManyMutationInput, ChallengeRatingUncheckedUpdateManyInput>
    /**
     * Filter which ChallengeRatings to update
     */
    where?: ChallengeRatingWhereInput
    /**
     * Limit how many ChallengeRatings to update.
     */
    limit?: number
  }

  /**
   * ChallengeRating updateManyAndReturn
   */
  export type ChallengeRatingUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChallengeRating
     */
    select?: ChallengeRatingSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ChallengeRating
     */
    omit?: ChallengeRatingOmit<ExtArgs> | null
    /**
     * The data used to update ChallengeRatings.
     */
    data: XOR<ChallengeRatingUpdateManyMutationInput, ChallengeRatingUncheckedUpdateManyInput>
    /**
     * Filter which ChallengeRatings to update
     */
    where?: ChallengeRatingWhereInput
    /**
     * Limit how many ChallengeRatings to update.
     */
    limit?: number
  }

  /**
   * ChallengeRating upsert
   */
  export type ChallengeRatingUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChallengeRating
     */
    select?: ChallengeRatingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChallengeRating
     */
    omit?: ChallengeRatingOmit<ExtArgs> | null
    /**
     * The filter to search for the ChallengeRating to update in case it exists.
     */
    where: ChallengeRatingWhereUniqueInput
    /**
     * In case the ChallengeRating found by the `where` argument doesn't exist, create a new ChallengeRating with this data.
     */
    create: XOR<ChallengeRatingCreateInput, ChallengeRatingUncheckedCreateInput>
    /**
     * In case the ChallengeRating was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ChallengeRatingUpdateInput, ChallengeRatingUncheckedUpdateInput>
  }

  /**
   * ChallengeRating delete
   */
  export type ChallengeRatingDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChallengeRating
     */
    select?: ChallengeRatingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChallengeRating
     */
    omit?: ChallengeRatingOmit<ExtArgs> | null
    /**
     * Filter which ChallengeRating to delete.
     */
    where: ChallengeRatingWhereUniqueInput
  }

  /**
   * ChallengeRating deleteMany
   */
  export type ChallengeRatingDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ChallengeRatings to delete
     */
    where?: ChallengeRatingWhereInput
    /**
     * Limit how many ChallengeRatings to delete.
     */
    limit?: number
  }

  /**
   * ChallengeRating without action
   */
  export type ChallengeRatingDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChallengeRating
     */
    select?: ChallengeRatingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChallengeRating
     */
    omit?: ChallengeRatingOmit<ExtArgs> | null
  }


  /**
   * Model ChallengeReward
   */

  export type AggregateChallengeReward = {
    _count: ChallengeRewardCountAggregateOutputType | null
    _avg: ChallengeRewardAvgAggregateOutputType | null
    _sum: ChallengeRewardSumAggregateOutputType | null
    _min: ChallengeRewardMinAggregateOutputType | null
    _max: ChallengeRewardMaxAggregateOutputType | null
  }

  export type ChallengeRewardAvgAggregateOutputType = {
    amountXP: number | null
  }

  export type ChallengeRewardSumAggregateOutputType = {
    amountXP: number | null
  }

  export type ChallengeRewardMinAggregateOutputType = {
    id: string | null
    userId: string | null
    matchId: string | null
    rewardType: string | null
    amountXP: number | null
    awardedAt: Date | null
  }

  export type ChallengeRewardMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    matchId: string | null
    rewardType: string | null
    amountXP: number | null
    awardedAt: Date | null
  }

  export type ChallengeRewardCountAggregateOutputType = {
    id: number
    userId: number
    matchId: number
    rewardType: number
    amountXP: number
    awardedAt: number
    _all: number
  }


  export type ChallengeRewardAvgAggregateInputType = {
    amountXP?: true
  }

  export type ChallengeRewardSumAggregateInputType = {
    amountXP?: true
  }

  export type ChallengeRewardMinAggregateInputType = {
    id?: true
    userId?: true
    matchId?: true
    rewardType?: true
    amountXP?: true
    awardedAt?: true
  }

  export type ChallengeRewardMaxAggregateInputType = {
    id?: true
    userId?: true
    matchId?: true
    rewardType?: true
    amountXP?: true
    awardedAt?: true
  }

  export type ChallengeRewardCountAggregateInputType = {
    id?: true
    userId?: true
    matchId?: true
    rewardType?: true
    amountXP?: true
    awardedAt?: true
    _all?: true
  }

  export type ChallengeRewardAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ChallengeReward to aggregate.
     */
    where?: ChallengeRewardWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChallengeRewards to fetch.
     */
    orderBy?: ChallengeRewardOrderByWithRelationInput | ChallengeRewardOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ChallengeRewardWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChallengeRewards from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChallengeRewards.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ChallengeRewards
    **/
    _count?: true | ChallengeRewardCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ChallengeRewardAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ChallengeRewardSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ChallengeRewardMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ChallengeRewardMaxAggregateInputType
  }

  export type GetChallengeRewardAggregateType<T extends ChallengeRewardAggregateArgs> = {
        [P in keyof T & keyof AggregateChallengeReward]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateChallengeReward[P]>
      : GetScalarType<T[P], AggregateChallengeReward[P]>
  }




  export type ChallengeRewardGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ChallengeRewardWhereInput
    orderBy?: ChallengeRewardOrderByWithAggregationInput | ChallengeRewardOrderByWithAggregationInput[]
    by: ChallengeRewardScalarFieldEnum[] | ChallengeRewardScalarFieldEnum
    having?: ChallengeRewardScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ChallengeRewardCountAggregateInputType | true
    _avg?: ChallengeRewardAvgAggregateInputType
    _sum?: ChallengeRewardSumAggregateInputType
    _min?: ChallengeRewardMinAggregateInputType
    _max?: ChallengeRewardMaxAggregateInputType
  }

  export type ChallengeRewardGroupByOutputType = {
    id: string
    userId: string
    matchId: string | null
    rewardType: string
    amountXP: number
    awardedAt: Date
    _count: ChallengeRewardCountAggregateOutputType | null
    _avg: ChallengeRewardAvgAggregateOutputType | null
    _sum: ChallengeRewardSumAggregateOutputType | null
    _min: ChallengeRewardMinAggregateOutputType | null
    _max: ChallengeRewardMaxAggregateOutputType | null
  }

  type GetChallengeRewardGroupByPayload<T extends ChallengeRewardGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ChallengeRewardGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ChallengeRewardGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ChallengeRewardGroupByOutputType[P]>
            : GetScalarType<T[P], ChallengeRewardGroupByOutputType[P]>
        }
      >
    >


  export type ChallengeRewardSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    matchId?: boolean
    rewardType?: boolean
    amountXP?: boolean
    awardedAt?: boolean
  }, ExtArgs["result"]["challengeReward"]>

  export type ChallengeRewardSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    matchId?: boolean
    rewardType?: boolean
    amountXP?: boolean
    awardedAt?: boolean
  }, ExtArgs["result"]["challengeReward"]>

  export type ChallengeRewardSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    matchId?: boolean
    rewardType?: boolean
    amountXP?: boolean
    awardedAt?: boolean
  }, ExtArgs["result"]["challengeReward"]>

  export type ChallengeRewardSelectScalar = {
    id?: boolean
    userId?: boolean
    matchId?: boolean
    rewardType?: boolean
    amountXP?: boolean
    awardedAt?: boolean
  }

  export type ChallengeRewardOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "matchId" | "rewardType" | "amountXP" | "awardedAt", ExtArgs["result"]["challengeReward"]>

  export type $ChallengeRewardPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ChallengeReward"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      matchId: string | null
      rewardType: string
      amountXP: number
      awardedAt: Date
    }, ExtArgs["result"]["challengeReward"]>
    composites: {}
  }

  type ChallengeRewardGetPayload<S extends boolean | null | undefined | ChallengeRewardDefaultArgs> = $Result.GetResult<Prisma.$ChallengeRewardPayload, S>

  type ChallengeRewardCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ChallengeRewardFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ChallengeRewardCountAggregateInputType | true
    }

  export interface ChallengeRewardDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ChallengeReward'], meta: { name: 'ChallengeReward' } }
    /**
     * Find zero or one ChallengeReward that matches the filter.
     * @param {ChallengeRewardFindUniqueArgs} args - Arguments to find a ChallengeReward
     * @example
     * // Get one ChallengeReward
     * const challengeReward = await prisma.challengeReward.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ChallengeRewardFindUniqueArgs>(args: SelectSubset<T, ChallengeRewardFindUniqueArgs<ExtArgs>>): Prisma__ChallengeRewardClient<$Result.GetResult<Prisma.$ChallengeRewardPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ChallengeReward that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ChallengeRewardFindUniqueOrThrowArgs} args - Arguments to find a ChallengeReward
     * @example
     * // Get one ChallengeReward
     * const challengeReward = await prisma.challengeReward.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ChallengeRewardFindUniqueOrThrowArgs>(args: SelectSubset<T, ChallengeRewardFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ChallengeRewardClient<$Result.GetResult<Prisma.$ChallengeRewardPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ChallengeReward that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChallengeRewardFindFirstArgs} args - Arguments to find a ChallengeReward
     * @example
     * // Get one ChallengeReward
     * const challengeReward = await prisma.challengeReward.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ChallengeRewardFindFirstArgs>(args?: SelectSubset<T, ChallengeRewardFindFirstArgs<ExtArgs>>): Prisma__ChallengeRewardClient<$Result.GetResult<Prisma.$ChallengeRewardPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ChallengeReward that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChallengeRewardFindFirstOrThrowArgs} args - Arguments to find a ChallengeReward
     * @example
     * // Get one ChallengeReward
     * const challengeReward = await prisma.challengeReward.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ChallengeRewardFindFirstOrThrowArgs>(args?: SelectSubset<T, ChallengeRewardFindFirstOrThrowArgs<ExtArgs>>): Prisma__ChallengeRewardClient<$Result.GetResult<Prisma.$ChallengeRewardPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ChallengeRewards that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChallengeRewardFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ChallengeRewards
     * const challengeRewards = await prisma.challengeReward.findMany()
     * 
     * // Get first 10 ChallengeRewards
     * const challengeRewards = await prisma.challengeReward.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const challengeRewardWithIdOnly = await prisma.challengeReward.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ChallengeRewardFindManyArgs>(args?: SelectSubset<T, ChallengeRewardFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChallengeRewardPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ChallengeReward.
     * @param {ChallengeRewardCreateArgs} args - Arguments to create a ChallengeReward.
     * @example
     * // Create one ChallengeReward
     * const ChallengeReward = await prisma.challengeReward.create({
     *   data: {
     *     // ... data to create a ChallengeReward
     *   }
     * })
     * 
     */
    create<T extends ChallengeRewardCreateArgs>(args: SelectSubset<T, ChallengeRewardCreateArgs<ExtArgs>>): Prisma__ChallengeRewardClient<$Result.GetResult<Prisma.$ChallengeRewardPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ChallengeRewards.
     * @param {ChallengeRewardCreateManyArgs} args - Arguments to create many ChallengeRewards.
     * @example
     * // Create many ChallengeRewards
     * const challengeReward = await prisma.challengeReward.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ChallengeRewardCreateManyArgs>(args?: SelectSubset<T, ChallengeRewardCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ChallengeRewards and returns the data saved in the database.
     * @param {ChallengeRewardCreateManyAndReturnArgs} args - Arguments to create many ChallengeRewards.
     * @example
     * // Create many ChallengeRewards
     * const challengeReward = await prisma.challengeReward.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ChallengeRewards and only return the `id`
     * const challengeRewardWithIdOnly = await prisma.challengeReward.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ChallengeRewardCreateManyAndReturnArgs>(args?: SelectSubset<T, ChallengeRewardCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChallengeRewardPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ChallengeReward.
     * @param {ChallengeRewardDeleteArgs} args - Arguments to delete one ChallengeReward.
     * @example
     * // Delete one ChallengeReward
     * const ChallengeReward = await prisma.challengeReward.delete({
     *   where: {
     *     // ... filter to delete one ChallengeReward
     *   }
     * })
     * 
     */
    delete<T extends ChallengeRewardDeleteArgs>(args: SelectSubset<T, ChallengeRewardDeleteArgs<ExtArgs>>): Prisma__ChallengeRewardClient<$Result.GetResult<Prisma.$ChallengeRewardPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ChallengeReward.
     * @param {ChallengeRewardUpdateArgs} args - Arguments to update one ChallengeReward.
     * @example
     * // Update one ChallengeReward
     * const challengeReward = await prisma.challengeReward.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ChallengeRewardUpdateArgs>(args: SelectSubset<T, ChallengeRewardUpdateArgs<ExtArgs>>): Prisma__ChallengeRewardClient<$Result.GetResult<Prisma.$ChallengeRewardPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ChallengeRewards.
     * @param {ChallengeRewardDeleteManyArgs} args - Arguments to filter ChallengeRewards to delete.
     * @example
     * // Delete a few ChallengeRewards
     * const { count } = await prisma.challengeReward.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ChallengeRewardDeleteManyArgs>(args?: SelectSubset<T, ChallengeRewardDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ChallengeRewards.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChallengeRewardUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ChallengeRewards
     * const challengeReward = await prisma.challengeReward.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ChallengeRewardUpdateManyArgs>(args: SelectSubset<T, ChallengeRewardUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ChallengeRewards and returns the data updated in the database.
     * @param {ChallengeRewardUpdateManyAndReturnArgs} args - Arguments to update many ChallengeRewards.
     * @example
     * // Update many ChallengeRewards
     * const challengeReward = await prisma.challengeReward.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ChallengeRewards and only return the `id`
     * const challengeRewardWithIdOnly = await prisma.challengeReward.updateManyAndReturn({
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
    updateManyAndReturn<T extends ChallengeRewardUpdateManyAndReturnArgs>(args: SelectSubset<T, ChallengeRewardUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChallengeRewardPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ChallengeReward.
     * @param {ChallengeRewardUpsertArgs} args - Arguments to update or create a ChallengeReward.
     * @example
     * // Update or create a ChallengeReward
     * const challengeReward = await prisma.challengeReward.upsert({
     *   create: {
     *     // ... data to create a ChallengeReward
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ChallengeReward we want to update
     *   }
     * })
     */
    upsert<T extends ChallengeRewardUpsertArgs>(args: SelectSubset<T, ChallengeRewardUpsertArgs<ExtArgs>>): Prisma__ChallengeRewardClient<$Result.GetResult<Prisma.$ChallengeRewardPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ChallengeRewards.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChallengeRewardCountArgs} args - Arguments to filter ChallengeRewards to count.
     * @example
     * // Count the number of ChallengeRewards
     * const count = await prisma.challengeReward.count({
     *   where: {
     *     // ... the filter for the ChallengeRewards we want to count
     *   }
     * })
    **/
    count<T extends ChallengeRewardCountArgs>(
      args?: Subset<T, ChallengeRewardCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ChallengeRewardCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ChallengeReward.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChallengeRewardAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ChallengeRewardAggregateArgs>(args: Subset<T, ChallengeRewardAggregateArgs>): Prisma.PrismaPromise<GetChallengeRewardAggregateType<T>>

    /**
     * Group by ChallengeReward.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChallengeRewardGroupByArgs} args - Group by arguments.
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
      T extends ChallengeRewardGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ChallengeRewardGroupByArgs['orderBy'] }
        : { orderBy?: ChallengeRewardGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ChallengeRewardGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetChallengeRewardGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ChallengeReward model
   */
  readonly fields: ChallengeRewardFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ChallengeReward.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ChallengeRewardClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
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
   * Fields of the ChallengeReward model
   */
  interface ChallengeRewardFieldRefs {
    readonly id: FieldRef<"ChallengeReward", 'String'>
    readonly userId: FieldRef<"ChallengeReward", 'String'>
    readonly matchId: FieldRef<"ChallengeReward", 'String'>
    readonly rewardType: FieldRef<"ChallengeReward", 'String'>
    readonly amountXP: FieldRef<"ChallengeReward", 'Int'>
    readonly awardedAt: FieldRef<"ChallengeReward", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ChallengeReward findUnique
   */
  export type ChallengeRewardFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChallengeReward
     */
    select?: ChallengeRewardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChallengeReward
     */
    omit?: ChallengeRewardOmit<ExtArgs> | null
    /**
     * Filter, which ChallengeReward to fetch.
     */
    where: ChallengeRewardWhereUniqueInput
  }

  /**
   * ChallengeReward findUniqueOrThrow
   */
  export type ChallengeRewardFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChallengeReward
     */
    select?: ChallengeRewardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChallengeReward
     */
    omit?: ChallengeRewardOmit<ExtArgs> | null
    /**
     * Filter, which ChallengeReward to fetch.
     */
    where: ChallengeRewardWhereUniqueInput
  }

  /**
   * ChallengeReward findFirst
   */
  export type ChallengeRewardFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChallengeReward
     */
    select?: ChallengeRewardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChallengeReward
     */
    omit?: ChallengeRewardOmit<ExtArgs> | null
    /**
     * Filter, which ChallengeReward to fetch.
     */
    where?: ChallengeRewardWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChallengeRewards to fetch.
     */
    orderBy?: ChallengeRewardOrderByWithRelationInput | ChallengeRewardOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ChallengeRewards.
     */
    cursor?: ChallengeRewardWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChallengeRewards from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChallengeRewards.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ChallengeRewards.
     */
    distinct?: ChallengeRewardScalarFieldEnum | ChallengeRewardScalarFieldEnum[]
  }

  /**
   * ChallengeReward findFirstOrThrow
   */
  export type ChallengeRewardFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChallengeReward
     */
    select?: ChallengeRewardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChallengeReward
     */
    omit?: ChallengeRewardOmit<ExtArgs> | null
    /**
     * Filter, which ChallengeReward to fetch.
     */
    where?: ChallengeRewardWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChallengeRewards to fetch.
     */
    orderBy?: ChallengeRewardOrderByWithRelationInput | ChallengeRewardOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ChallengeRewards.
     */
    cursor?: ChallengeRewardWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChallengeRewards from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChallengeRewards.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ChallengeRewards.
     */
    distinct?: ChallengeRewardScalarFieldEnum | ChallengeRewardScalarFieldEnum[]
  }

  /**
   * ChallengeReward findMany
   */
  export type ChallengeRewardFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChallengeReward
     */
    select?: ChallengeRewardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChallengeReward
     */
    omit?: ChallengeRewardOmit<ExtArgs> | null
    /**
     * Filter, which ChallengeRewards to fetch.
     */
    where?: ChallengeRewardWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChallengeRewards to fetch.
     */
    orderBy?: ChallengeRewardOrderByWithRelationInput | ChallengeRewardOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ChallengeRewards.
     */
    cursor?: ChallengeRewardWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChallengeRewards from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChallengeRewards.
     */
    skip?: number
    distinct?: ChallengeRewardScalarFieldEnum | ChallengeRewardScalarFieldEnum[]
  }

  /**
   * ChallengeReward create
   */
  export type ChallengeRewardCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChallengeReward
     */
    select?: ChallengeRewardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChallengeReward
     */
    omit?: ChallengeRewardOmit<ExtArgs> | null
    /**
     * The data needed to create a ChallengeReward.
     */
    data: XOR<ChallengeRewardCreateInput, ChallengeRewardUncheckedCreateInput>
  }

  /**
   * ChallengeReward createMany
   */
  export type ChallengeRewardCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ChallengeRewards.
     */
    data: ChallengeRewardCreateManyInput | ChallengeRewardCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ChallengeReward createManyAndReturn
   */
  export type ChallengeRewardCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChallengeReward
     */
    select?: ChallengeRewardSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ChallengeReward
     */
    omit?: ChallengeRewardOmit<ExtArgs> | null
    /**
     * The data used to create many ChallengeRewards.
     */
    data: ChallengeRewardCreateManyInput | ChallengeRewardCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ChallengeReward update
   */
  export type ChallengeRewardUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChallengeReward
     */
    select?: ChallengeRewardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChallengeReward
     */
    omit?: ChallengeRewardOmit<ExtArgs> | null
    /**
     * The data needed to update a ChallengeReward.
     */
    data: XOR<ChallengeRewardUpdateInput, ChallengeRewardUncheckedUpdateInput>
    /**
     * Choose, which ChallengeReward to update.
     */
    where: ChallengeRewardWhereUniqueInput
  }

  /**
   * ChallengeReward updateMany
   */
  export type ChallengeRewardUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ChallengeRewards.
     */
    data: XOR<ChallengeRewardUpdateManyMutationInput, ChallengeRewardUncheckedUpdateManyInput>
    /**
     * Filter which ChallengeRewards to update
     */
    where?: ChallengeRewardWhereInput
    /**
     * Limit how many ChallengeRewards to update.
     */
    limit?: number
  }

  /**
   * ChallengeReward updateManyAndReturn
   */
  export type ChallengeRewardUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChallengeReward
     */
    select?: ChallengeRewardSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ChallengeReward
     */
    omit?: ChallengeRewardOmit<ExtArgs> | null
    /**
     * The data used to update ChallengeRewards.
     */
    data: XOR<ChallengeRewardUpdateManyMutationInput, ChallengeRewardUncheckedUpdateManyInput>
    /**
     * Filter which ChallengeRewards to update
     */
    where?: ChallengeRewardWhereInput
    /**
     * Limit how many ChallengeRewards to update.
     */
    limit?: number
  }

  /**
   * ChallengeReward upsert
   */
  export type ChallengeRewardUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChallengeReward
     */
    select?: ChallengeRewardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChallengeReward
     */
    omit?: ChallengeRewardOmit<ExtArgs> | null
    /**
     * The filter to search for the ChallengeReward to update in case it exists.
     */
    where: ChallengeRewardWhereUniqueInput
    /**
     * In case the ChallengeReward found by the `where` argument doesn't exist, create a new ChallengeReward with this data.
     */
    create: XOR<ChallengeRewardCreateInput, ChallengeRewardUncheckedCreateInput>
    /**
     * In case the ChallengeReward was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ChallengeRewardUpdateInput, ChallengeRewardUncheckedUpdateInput>
  }

  /**
   * ChallengeReward delete
   */
  export type ChallengeRewardDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChallengeReward
     */
    select?: ChallengeRewardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChallengeReward
     */
    omit?: ChallengeRewardOmit<ExtArgs> | null
    /**
     * Filter which ChallengeReward to delete.
     */
    where: ChallengeRewardWhereUniqueInput
  }

  /**
   * ChallengeReward deleteMany
   */
  export type ChallengeRewardDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ChallengeRewards to delete
     */
    where?: ChallengeRewardWhereInput
    /**
     * Limit how many ChallengeRewards to delete.
     */
    limit?: number
  }

  /**
   * ChallengeReward without action
   */
  export type ChallengeRewardDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChallengeReward
     */
    select?: ChallengeRewardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChallengeReward
     */
    omit?: ChallengeRewardOmit<ExtArgs> | null
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


  export const ChallengeRoomScalarFieldEnum: {
    id: 'id',
    roomCode: 'roomCode',
    title: 'title',
    type: 'type',
    visibility: 'visibility',
    difficulty: 'difficulty',
    topic: 'topic',
    language: 'language',
    maxParticipants: 'maxParticipants',
    durationMinutes: 'durationMinutes',
    status: 'status',
    createdBy: 'createdBy',
    hostName: 'hostName',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ChallengeRoomScalarFieldEnum = (typeof ChallengeRoomScalarFieldEnum)[keyof typeof ChallengeRoomScalarFieldEnum]


  export const ChallengeParticipantScalarFieldEnum: {
    id: 'id',
    roomId: 'roomId',
    userId: 'userId',
    userName: 'userName',
    userAvatar: 'userAvatar',
    userRating: 'userRating',
    isHost: 'isHost',
    isReady: 'isReady',
    status: 'status',
    joinedAt: 'joinedAt',
    leftAt: 'leftAt'
  };

  export type ChallengeParticipantScalarFieldEnum = (typeof ChallengeParticipantScalarFieldEnum)[keyof typeof ChallengeParticipantScalarFieldEnum]


  export const MatchSessionScalarFieldEnum: {
    id: 'id',
    roomId: 'roomId',
    matchType: 'matchType',
    difficulty: 'difficulty',
    status: 'status',
    startedAt: 'startedAt',
    endedAt: 'endedAt',
    durationSeconds: 'durationSeconds',
    winnerId: 'winnerId',
    resultSummary: 'resultSummary',
    problemId: 'problemId',
    createdAt: 'createdAt'
  };

  export type MatchSessionScalarFieldEnum = (typeof MatchSessionScalarFieldEnum)[keyof typeof MatchSessionScalarFieldEnum]


  export const MatchParticipantScalarFieldEnum: {
    id: 'id',
    matchId: 'matchId',
    userId: 'userId',
    userName: 'userName',
    userAvatar: 'userAvatar',
    score: 'score',
    problemsSolved: 'problemsSolved',
    passedTests: 'passedTests',
    totalTests: 'totalTests',
    ratingBefore: 'ratingBefore',
    ratingAfter: 'ratingAfter',
    xpEarned: 'xpEarned',
    status: 'status',
    submittedAt: 'submittedAt'
  };

  export type MatchParticipantScalarFieldEnum = (typeof MatchParticipantScalarFieldEnum)[keyof typeof MatchParticipantScalarFieldEnum]


  export const ChallengeProblemScalarFieldEnum: {
    id: 'id',
    title: 'title',
    slug: 'slug',
    difficulty: 'difficulty',
    description: 'description',
    examples: 'examples',
    constraints: 'constraints',
    topicTags: 'topicTags',
    timeLimitMs: 'timeLimitMs',
    memoryLimitMb: 'memoryLimitMb',
    starterCodes: 'starterCodes',
    testCases: 'testCases',
    idealSolution: 'idealSolution',
    createdAt: 'createdAt'
  };

  export type ChallengeProblemScalarFieldEnum = (typeof ChallengeProblemScalarFieldEnum)[keyof typeof ChallengeProblemScalarFieldEnum]


  export const ChallengeSubmissionScalarFieldEnum: {
    id: 'id',
    matchId: 'matchId',
    userId: 'userId',
    problemId: 'problemId',
    language: 'language',
    sourceCode: 'sourceCode',
    status: 'status',
    executionTimeMs: 'executionTimeMs',
    passedTestCases: 'passedTestCases',
    totalTestCases: 'totalTestCases',
    score: 'score',
    stdout: 'stdout',
    errorDetails: 'errorDetails',
    submittedAt: 'submittedAt'
  };

  export type ChallengeSubmissionScalarFieldEnum = (typeof ChallengeSubmissionScalarFieldEnum)[keyof typeof ChallengeSubmissionScalarFieldEnum]


  export const QuizTemplateScalarFieldEnum: {
    id: 'id',
    title: 'title',
    category: 'category',
    difficulty: 'difficulty',
    timePerQuestion: 'timePerQuestion',
    totalQuestions: 'totalQuestions',
    createdAt: 'createdAt'
  };

  export type QuizTemplateScalarFieldEnum = (typeof QuizTemplateScalarFieldEnum)[keyof typeof QuizTemplateScalarFieldEnum]


  export const QuizQuestionScalarFieldEnum: {
    id: 'id',
    quizId: 'quizId',
    question: 'question',
    options: 'options',
    correctIndex: 'correctIndex',
    explanation: 'explanation',
    topic: 'topic',
    difficulty: 'difficulty'
  };

  export type QuizQuestionScalarFieldEnum = (typeof QuizQuestionScalarFieldEnum)[keyof typeof QuizQuestionScalarFieldEnum]


  export const QuizSessionScalarFieldEnum: {
    id: 'id',
    quizId: 'quizId',
    roomCode: 'roomCode',
    status: 'status',
    currentQuestion: 'currentQuestion',
    startedAt: 'startedAt',
    endedAt: 'endedAt',
    durationSeconds: 'durationSeconds',
    createdAt: 'createdAt'
  };

  export type QuizSessionScalarFieldEnum = (typeof QuizSessionScalarFieldEnum)[keyof typeof QuizSessionScalarFieldEnum]


  export const QuizAnswerScalarFieldEnum: {
    id: 'id',
    sessionId: 'sessionId',
    questionId: 'questionId',
    userId: 'userId',
    userName: 'userName',
    selectedIndex: 'selectedIndex',
    isCorrect: 'isCorrect',
    responseTimeMs: 'responseTimeMs',
    pointsAwarded: 'pointsAwarded',
    submittedAt: 'submittedAt'
  };

  export type QuizAnswerScalarFieldEnum = (typeof QuizAnswerScalarFieldEnum)[keyof typeof QuizAnswerScalarFieldEnum]


  export const FriendshipScalarFieldEnum: {
    id: 'id',
    requesterId: 'requesterId',
    recipientId: 'recipientId',
    status: 'status',
    createdAt: 'createdAt'
  };

  export type FriendshipScalarFieldEnum = (typeof FriendshipScalarFieldEnum)[keyof typeof FriendshipScalarFieldEnum]


  export const StudyGroupScalarFieldEnum: {
    id: 'id',
    name: 'name',
    description: 'description',
    createdBy: 'createdBy',
    createdAt: 'createdAt'
  };

  export type StudyGroupScalarFieldEnum = (typeof StudyGroupScalarFieldEnum)[keyof typeof StudyGroupScalarFieldEnum]


  export const GroupMemberScalarFieldEnum: {
    id: 'id',
    groupId: 'groupId',
    userId: 'userId',
    userName: 'userName',
    role: 'role',
    joinedAt: 'joinedAt'
  };

  export type GroupMemberScalarFieldEnum = (typeof GroupMemberScalarFieldEnum)[keyof typeof GroupMemberScalarFieldEnum]


  export const ChallengeRatingScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    userName: 'userName',
    userAvatar: 'userAvatar',
    rating: 'rating',
    tier: 'tier',
    battlesTotal: 'battlesTotal',
    battlesWon: 'battlesWon',
    winRate: 'winRate',
    currentStreak: 'currentStreak',
    longestStreak: 'longestStreak',
    totalXP: 'totalXP',
    updatedAt: 'updatedAt'
  };

  export type ChallengeRatingScalarFieldEnum = (typeof ChallengeRatingScalarFieldEnum)[keyof typeof ChallengeRatingScalarFieldEnum]


  export const ChallengeRewardScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    matchId: 'matchId',
    rewardType: 'rewardType',
    amountXP: 'amountXP',
    awardedAt: 'awardedAt'
  };

  export type ChallengeRewardScalarFieldEnum = (typeof ChallengeRewardScalarFieldEnum)[keyof typeof ChallengeRewardScalarFieldEnum]


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
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


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


  export type ChallengeRoomWhereInput = {
    AND?: ChallengeRoomWhereInput | ChallengeRoomWhereInput[]
    OR?: ChallengeRoomWhereInput[]
    NOT?: ChallengeRoomWhereInput | ChallengeRoomWhereInput[]
    id?: StringFilter<"ChallengeRoom"> | string
    roomCode?: StringFilter<"ChallengeRoom"> | string
    title?: StringFilter<"ChallengeRoom"> | string
    type?: StringFilter<"ChallengeRoom"> | string
    visibility?: StringFilter<"ChallengeRoom"> | string
    difficulty?: StringFilter<"ChallengeRoom"> | string
    topic?: StringFilter<"ChallengeRoom"> | string
    language?: StringFilter<"ChallengeRoom"> | string
    maxParticipants?: IntFilter<"ChallengeRoom"> | number
    durationMinutes?: IntFilter<"ChallengeRoom"> | number
    status?: StringFilter<"ChallengeRoom"> | string
    createdBy?: StringFilter<"ChallengeRoom"> | string
    hostName?: StringNullableFilter<"ChallengeRoom"> | string | null
    createdAt?: DateTimeFilter<"ChallengeRoom"> | Date | string
    updatedAt?: DateTimeFilter<"ChallengeRoom"> | Date | string
    participants?: ChallengeParticipantListRelationFilter
    matches?: MatchSessionListRelationFilter
  }

  export type ChallengeRoomOrderByWithRelationInput = {
    id?: SortOrder
    roomCode?: SortOrder
    title?: SortOrder
    type?: SortOrder
    visibility?: SortOrder
    difficulty?: SortOrder
    topic?: SortOrder
    language?: SortOrder
    maxParticipants?: SortOrder
    durationMinutes?: SortOrder
    status?: SortOrder
    createdBy?: SortOrder
    hostName?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    participants?: ChallengeParticipantOrderByRelationAggregateInput
    matches?: MatchSessionOrderByRelationAggregateInput
  }

  export type ChallengeRoomWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    roomCode?: string
    AND?: ChallengeRoomWhereInput | ChallengeRoomWhereInput[]
    OR?: ChallengeRoomWhereInput[]
    NOT?: ChallengeRoomWhereInput | ChallengeRoomWhereInput[]
    title?: StringFilter<"ChallengeRoom"> | string
    type?: StringFilter<"ChallengeRoom"> | string
    visibility?: StringFilter<"ChallengeRoom"> | string
    difficulty?: StringFilter<"ChallengeRoom"> | string
    topic?: StringFilter<"ChallengeRoom"> | string
    language?: StringFilter<"ChallengeRoom"> | string
    maxParticipants?: IntFilter<"ChallengeRoom"> | number
    durationMinutes?: IntFilter<"ChallengeRoom"> | number
    status?: StringFilter<"ChallengeRoom"> | string
    createdBy?: StringFilter<"ChallengeRoom"> | string
    hostName?: StringNullableFilter<"ChallengeRoom"> | string | null
    createdAt?: DateTimeFilter<"ChallengeRoom"> | Date | string
    updatedAt?: DateTimeFilter<"ChallengeRoom"> | Date | string
    participants?: ChallengeParticipantListRelationFilter
    matches?: MatchSessionListRelationFilter
  }, "id" | "roomCode">

  export type ChallengeRoomOrderByWithAggregationInput = {
    id?: SortOrder
    roomCode?: SortOrder
    title?: SortOrder
    type?: SortOrder
    visibility?: SortOrder
    difficulty?: SortOrder
    topic?: SortOrder
    language?: SortOrder
    maxParticipants?: SortOrder
    durationMinutes?: SortOrder
    status?: SortOrder
    createdBy?: SortOrder
    hostName?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ChallengeRoomCountOrderByAggregateInput
    _avg?: ChallengeRoomAvgOrderByAggregateInput
    _max?: ChallengeRoomMaxOrderByAggregateInput
    _min?: ChallengeRoomMinOrderByAggregateInput
    _sum?: ChallengeRoomSumOrderByAggregateInput
  }

  export type ChallengeRoomScalarWhereWithAggregatesInput = {
    AND?: ChallengeRoomScalarWhereWithAggregatesInput | ChallengeRoomScalarWhereWithAggregatesInput[]
    OR?: ChallengeRoomScalarWhereWithAggregatesInput[]
    NOT?: ChallengeRoomScalarWhereWithAggregatesInput | ChallengeRoomScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ChallengeRoom"> | string
    roomCode?: StringWithAggregatesFilter<"ChallengeRoom"> | string
    title?: StringWithAggregatesFilter<"ChallengeRoom"> | string
    type?: StringWithAggregatesFilter<"ChallengeRoom"> | string
    visibility?: StringWithAggregatesFilter<"ChallengeRoom"> | string
    difficulty?: StringWithAggregatesFilter<"ChallengeRoom"> | string
    topic?: StringWithAggregatesFilter<"ChallengeRoom"> | string
    language?: StringWithAggregatesFilter<"ChallengeRoom"> | string
    maxParticipants?: IntWithAggregatesFilter<"ChallengeRoom"> | number
    durationMinutes?: IntWithAggregatesFilter<"ChallengeRoom"> | number
    status?: StringWithAggregatesFilter<"ChallengeRoom"> | string
    createdBy?: StringWithAggregatesFilter<"ChallengeRoom"> | string
    hostName?: StringNullableWithAggregatesFilter<"ChallengeRoom"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"ChallengeRoom"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"ChallengeRoom"> | Date | string
  }

  export type ChallengeParticipantWhereInput = {
    AND?: ChallengeParticipantWhereInput | ChallengeParticipantWhereInput[]
    OR?: ChallengeParticipantWhereInput[]
    NOT?: ChallengeParticipantWhereInput | ChallengeParticipantWhereInput[]
    id?: StringFilter<"ChallengeParticipant"> | string
    roomId?: StringFilter<"ChallengeParticipant"> | string
    userId?: StringFilter<"ChallengeParticipant"> | string
    userName?: StringFilter<"ChallengeParticipant"> | string
    userAvatar?: StringNullableFilter<"ChallengeParticipant"> | string | null
    userRating?: IntFilter<"ChallengeParticipant"> | number
    isHost?: BoolFilter<"ChallengeParticipant"> | boolean
    isReady?: BoolFilter<"ChallengeParticipant"> | boolean
    status?: StringFilter<"ChallengeParticipant"> | string
    joinedAt?: DateTimeFilter<"ChallengeParticipant"> | Date | string
    leftAt?: DateTimeNullableFilter<"ChallengeParticipant"> | Date | string | null
    room?: XOR<ChallengeRoomScalarRelationFilter, ChallengeRoomWhereInput>
  }

  export type ChallengeParticipantOrderByWithRelationInput = {
    id?: SortOrder
    roomId?: SortOrder
    userId?: SortOrder
    userName?: SortOrder
    userAvatar?: SortOrderInput | SortOrder
    userRating?: SortOrder
    isHost?: SortOrder
    isReady?: SortOrder
    status?: SortOrder
    joinedAt?: SortOrder
    leftAt?: SortOrderInput | SortOrder
    room?: ChallengeRoomOrderByWithRelationInput
  }

  export type ChallengeParticipantWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    roomId_userId?: ChallengeParticipantRoomIdUserIdCompoundUniqueInput
    AND?: ChallengeParticipantWhereInput | ChallengeParticipantWhereInput[]
    OR?: ChallengeParticipantWhereInput[]
    NOT?: ChallengeParticipantWhereInput | ChallengeParticipantWhereInput[]
    roomId?: StringFilter<"ChallengeParticipant"> | string
    userId?: StringFilter<"ChallengeParticipant"> | string
    userName?: StringFilter<"ChallengeParticipant"> | string
    userAvatar?: StringNullableFilter<"ChallengeParticipant"> | string | null
    userRating?: IntFilter<"ChallengeParticipant"> | number
    isHost?: BoolFilter<"ChallengeParticipant"> | boolean
    isReady?: BoolFilter<"ChallengeParticipant"> | boolean
    status?: StringFilter<"ChallengeParticipant"> | string
    joinedAt?: DateTimeFilter<"ChallengeParticipant"> | Date | string
    leftAt?: DateTimeNullableFilter<"ChallengeParticipant"> | Date | string | null
    room?: XOR<ChallengeRoomScalarRelationFilter, ChallengeRoomWhereInput>
  }, "id" | "roomId_userId">

  export type ChallengeParticipantOrderByWithAggregationInput = {
    id?: SortOrder
    roomId?: SortOrder
    userId?: SortOrder
    userName?: SortOrder
    userAvatar?: SortOrderInput | SortOrder
    userRating?: SortOrder
    isHost?: SortOrder
    isReady?: SortOrder
    status?: SortOrder
    joinedAt?: SortOrder
    leftAt?: SortOrderInput | SortOrder
    _count?: ChallengeParticipantCountOrderByAggregateInput
    _avg?: ChallengeParticipantAvgOrderByAggregateInput
    _max?: ChallengeParticipantMaxOrderByAggregateInput
    _min?: ChallengeParticipantMinOrderByAggregateInput
    _sum?: ChallengeParticipantSumOrderByAggregateInput
  }

  export type ChallengeParticipantScalarWhereWithAggregatesInput = {
    AND?: ChallengeParticipantScalarWhereWithAggregatesInput | ChallengeParticipantScalarWhereWithAggregatesInput[]
    OR?: ChallengeParticipantScalarWhereWithAggregatesInput[]
    NOT?: ChallengeParticipantScalarWhereWithAggregatesInput | ChallengeParticipantScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ChallengeParticipant"> | string
    roomId?: StringWithAggregatesFilter<"ChallengeParticipant"> | string
    userId?: StringWithAggregatesFilter<"ChallengeParticipant"> | string
    userName?: StringWithAggregatesFilter<"ChallengeParticipant"> | string
    userAvatar?: StringNullableWithAggregatesFilter<"ChallengeParticipant"> | string | null
    userRating?: IntWithAggregatesFilter<"ChallengeParticipant"> | number
    isHost?: BoolWithAggregatesFilter<"ChallengeParticipant"> | boolean
    isReady?: BoolWithAggregatesFilter<"ChallengeParticipant"> | boolean
    status?: StringWithAggregatesFilter<"ChallengeParticipant"> | string
    joinedAt?: DateTimeWithAggregatesFilter<"ChallengeParticipant"> | Date | string
    leftAt?: DateTimeNullableWithAggregatesFilter<"ChallengeParticipant"> | Date | string | null
  }

  export type MatchSessionWhereInput = {
    AND?: MatchSessionWhereInput | MatchSessionWhereInput[]
    OR?: MatchSessionWhereInput[]
    NOT?: MatchSessionWhereInput | MatchSessionWhereInput[]
    id?: StringFilter<"MatchSession"> | string
    roomId?: StringNullableFilter<"MatchSession"> | string | null
    matchType?: StringFilter<"MatchSession"> | string
    difficulty?: StringFilter<"MatchSession"> | string
    status?: StringFilter<"MatchSession"> | string
    startedAt?: DateTimeNullableFilter<"MatchSession"> | Date | string | null
    endedAt?: DateTimeNullableFilter<"MatchSession"> | Date | string | null
    durationSeconds?: IntFilter<"MatchSession"> | number
    winnerId?: StringNullableFilter<"MatchSession"> | string | null
    resultSummary?: StringNullableFilter<"MatchSession"> | string | null
    problemId?: StringNullableFilter<"MatchSession"> | string | null
    createdAt?: DateTimeFilter<"MatchSession"> | Date | string
    room?: XOR<ChallengeRoomNullableScalarRelationFilter, ChallengeRoomWhereInput> | null
    participants?: MatchParticipantListRelationFilter
    submissions?: ChallengeSubmissionListRelationFilter
  }

  export type MatchSessionOrderByWithRelationInput = {
    id?: SortOrder
    roomId?: SortOrderInput | SortOrder
    matchType?: SortOrder
    difficulty?: SortOrder
    status?: SortOrder
    startedAt?: SortOrderInput | SortOrder
    endedAt?: SortOrderInput | SortOrder
    durationSeconds?: SortOrder
    winnerId?: SortOrderInput | SortOrder
    resultSummary?: SortOrderInput | SortOrder
    problemId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    room?: ChallengeRoomOrderByWithRelationInput
    participants?: MatchParticipantOrderByRelationAggregateInput
    submissions?: ChallengeSubmissionOrderByRelationAggregateInput
  }

  export type MatchSessionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: MatchSessionWhereInput | MatchSessionWhereInput[]
    OR?: MatchSessionWhereInput[]
    NOT?: MatchSessionWhereInput | MatchSessionWhereInput[]
    roomId?: StringNullableFilter<"MatchSession"> | string | null
    matchType?: StringFilter<"MatchSession"> | string
    difficulty?: StringFilter<"MatchSession"> | string
    status?: StringFilter<"MatchSession"> | string
    startedAt?: DateTimeNullableFilter<"MatchSession"> | Date | string | null
    endedAt?: DateTimeNullableFilter<"MatchSession"> | Date | string | null
    durationSeconds?: IntFilter<"MatchSession"> | number
    winnerId?: StringNullableFilter<"MatchSession"> | string | null
    resultSummary?: StringNullableFilter<"MatchSession"> | string | null
    problemId?: StringNullableFilter<"MatchSession"> | string | null
    createdAt?: DateTimeFilter<"MatchSession"> | Date | string
    room?: XOR<ChallengeRoomNullableScalarRelationFilter, ChallengeRoomWhereInput> | null
    participants?: MatchParticipantListRelationFilter
    submissions?: ChallengeSubmissionListRelationFilter
  }, "id">

  export type MatchSessionOrderByWithAggregationInput = {
    id?: SortOrder
    roomId?: SortOrderInput | SortOrder
    matchType?: SortOrder
    difficulty?: SortOrder
    status?: SortOrder
    startedAt?: SortOrderInput | SortOrder
    endedAt?: SortOrderInput | SortOrder
    durationSeconds?: SortOrder
    winnerId?: SortOrderInput | SortOrder
    resultSummary?: SortOrderInput | SortOrder
    problemId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: MatchSessionCountOrderByAggregateInput
    _avg?: MatchSessionAvgOrderByAggregateInput
    _max?: MatchSessionMaxOrderByAggregateInput
    _min?: MatchSessionMinOrderByAggregateInput
    _sum?: MatchSessionSumOrderByAggregateInput
  }

  export type MatchSessionScalarWhereWithAggregatesInput = {
    AND?: MatchSessionScalarWhereWithAggregatesInput | MatchSessionScalarWhereWithAggregatesInput[]
    OR?: MatchSessionScalarWhereWithAggregatesInput[]
    NOT?: MatchSessionScalarWhereWithAggregatesInput | MatchSessionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"MatchSession"> | string
    roomId?: StringNullableWithAggregatesFilter<"MatchSession"> | string | null
    matchType?: StringWithAggregatesFilter<"MatchSession"> | string
    difficulty?: StringWithAggregatesFilter<"MatchSession"> | string
    status?: StringWithAggregatesFilter<"MatchSession"> | string
    startedAt?: DateTimeNullableWithAggregatesFilter<"MatchSession"> | Date | string | null
    endedAt?: DateTimeNullableWithAggregatesFilter<"MatchSession"> | Date | string | null
    durationSeconds?: IntWithAggregatesFilter<"MatchSession"> | number
    winnerId?: StringNullableWithAggregatesFilter<"MatchSession"> | string | null
    resultSummary?: StringNullableWithAggregatesFilter<"MatchSession"> | string | null
    problemId?: StringNullableWithAggregatesFilter<"MatchSession"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"MatchSession"> | Date | string
  }

  export type MatchParticipantWhereInput = {
    AND?: MatchParticipantWhereInput | MatchParticipantWhereInput[]
    OR?: MatchParticipantWhereInput[]
    NOT?: MatchParticipantWhereInput | MatchParticipantWhereInput[]
    id?: StringFilter<"MatchParticipant"> | string
    matchId?: StringFilter<"MatchParticipant"> | string
    userId?: StringFilter<"MatchParticipant"> | string
    userName?: StringFilter<"MatchParticipant"> | string
    userAvatar?: StringNullableFilter<"MatchParticipant"> | string | null
    score?: IntFilter<"MatchParticipant"> | number
    problemsSolved?: IntFilter<"MatchParticipant"> | number
    passedTests?: IntFilter<"MatchParticipant"> | number
    totalTests?: IntFilter<"MatchParticipant"> | number
    ratingBefore?: IntFilter<"MatchParticipant"> | number
    ratingAfter?: IntFilter<"MatchParticipant"> | number
    xpEarned?: IntFilter<"MatchParticipant"> | number
    status?: StringFilter<"MatchParticipant"> | string
    submittedAt?: DateTimeNullableFilter<"MatchParticipant"> | Date | string | null
    match?: XOR<MatchSessionScalarRelationFilter, MatchSessionWhereInput>
  }

  export type MatchParticipantOrderByWithRelationInput = {
    id?: SortOrder
    matchId?: SortOrder
    userId?: SortOrder
    userName?: SortOrder
    userAvatar?: SortOrderInput | SortOrder
    score?: SortOrder
    problemsSolved?: SortOrder
    passedTests?: SortOrder
    totalTests?: SortOrder
    ratingBefore?: SortOrder
    ratingAfter?: SortOrder
    xpEarned?: SortOrder
    status?: SortOrder
    submittedAt?: SortOrderInput | SortOrder
    match?: MatchSessionOrderByWithRelationInput
  }

  export type MatchParticipantWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    matchId_userId?: MatchParticipantMatchIdUserIdCompoundUniqueInput
    AND?: MatchParticipantWhereInput | MatchParticipantWhereInput[]
    OR?: MatchParticipantWhereInput[]
    NOT?: MatchParticipantWhereInput | MatchParticipantWhereInput[]
    matchId?: StringFilter<"MatchParticipant"> | string
    userId?: StringFilter<"MatchParticipant"> | string
    userName?: StringFilter<"MatchParticipant"> | string
    userAvatar?: StringNullableFilter<"MatchParticipant"> | string | null
    score?: IntFilter<"MatchParticipant"> | number
    problemsSolved?: IntFilter<"MatchParticipant"> | number
    passedTests?: IntFilter<"MatchParticipant"> | number
    totalTests?: IntFilter<"MatchParticipant"> | number
    ratingBefore?: IntFilter<"MatchParticipant"> | number
    ratingAfter?: IntFilter<"MatchParticipant"> | number
    xpEarned?: IntFilter<"MatchParticipant"> | number
    status?: StringFilter<"MatchParticipant"> | string
    submittedAt?: DateTimeNullableFilter<"MatchParticipant"> | Date | string | null
    match?: XOR<MatchSessionScalarRelationFilter, MatchSessionWhereInput>
  }, "id" | "matchId_userId">

  export type MatchParticipantOrderByWithAggregationInput = {
    id?: SortOrder
    matchId?: SortOrder
    userId?: SortOrder
    userName?: SortOrder
    userAvatar?: SortOrderInput | SortOrder
    score?: SortOrder
    problemsSolved?: SortOrder
    passedTests?: SortOrder
    totalTests?: SortOrder
    ratingBefore?: SortOrder
    ratingAfter?: SortOrder
    xpEarned?: SortOrder
    status?: SortOrder
    submittedAt?: SortOrderInput | SortOrder
    _count?: MatchParticipantCountOrderByAggregateInput
    _avg?: MatchParticipantAvgOrderByAggregateInput
    _max?: MatchParticipantMaxOrderByAggregateInput
    _min?: MatchParticipantMinOrderByAggregateInput
    _sum?: MatchParticipantSumOrderByAggregateInput
  }

  export type MatchParticipantScalarWhereWithAggregatesInput = {
    AND?: MatchParticipantScalarWhereWithAggregatesInput | MatchParticipantScalarWhereWithAggregatesInput[]
    OR?: MatchParticipantScalarWhereWithAggregatesInput[]
    NOT?: MatchParticipantScalarWhereWithAggregatesInput | MatchParticipantScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"MatchParticipant"> | string
    matchId?: StringWithAggregatesFilter<"MatchParticipant"> | string
    userId?: StringWithAggregatesFilter<"MatchParticipant"> | string
    userName?: StringWithAggregatesFilter<"MatchParticipant"> | string
    userAvatar?: StringNullableWithAggregatesFilter<"MatchParticipant"> | string | null
    score?: IntWithAggregatesFilter<"MatchParticipant"> | number
    problemsSolved?: IntWithAggregatesFilter<"MatchParticipant"> | number
    passedTests?: IntWithAggregatesFilter<"MatchParticipant"> | number
    totalTests?: IntWithAggregatesFilter<"MatchParticipant"> | number
    ratingBefore?: IntWithAggregatesFilter<"MatchParticipant"> | number
    ratingAfter?: IntWithAggregatesFilter<"MatchParticipant"> | number
    xpEarned?: IntWithAggregatesFilter<"MatchParticipant"> | number
    status?: StringWithAggregatesFilter<"MatchParticipant"> | string
    submittedAt?: DateTimeNullableWithAggregatesFilter<"MatchParticipant"> | Date | string | null
  }

  export type ChallengeProblemWhereInput = {
    AND?: ChallengeProblemWhereInput | ChallengeProblemWhereInput[]
    OR?: ChallengeProblemWhereInput[]
    NOT?: ChallengeProblemWhereInput | ChallengeProblemWhereInput[]
    id?: StringFilter<"ChallengeProblem"> | string
    title?: StringFilter<"ChallengeProblem"> | string
    slug?: StringFilter<"ChallengeProblem"> | string
    difficulty?: StringFilter<"ChallengeProblem"> | string
    description?: StringFilter<"ChallengeProblem"> | string
    examples?: JsonFilter<"ChallengeProblem">
    constraints?: StringNullableListFilter<"ChallengeProblem">
    topicTags?: StringNullableListFilter<"ChallengeProblem">
    timeLimitMs?: IntFilter<"ChallengeProblem"> | number
    memoryLimitMb?: IntFilter<"ChallengeProblem"> | number
    starterCodes?: JsonFilter<"ChallengeProblem">
    testCases?: JsonFilter<"ChallengeProblem">
    idealSolution?: StringNullableFilter<"ChallengeProblem"> | string | null
    createdAt?: DateTimeFilter<"ChallengeProblem"> | Date | string
  }

  export type ChallengeProblemOrderByWithRelationInput = {
    id?: SortOrder
    title?: SortOrder
    slug?: SortOrder
    difficulty?: SortOrder
    description?: SortOrder
    examples?: SortOrder
    constraints?: SortOrder
    topicTags?: SortOrder
    timeLimitMs?: SortOrder
    memoryLimitMb?: SortOrder
    starterCodes?: SortOrder
    testCases?: SortOrder
    idealSolution?: SortOrderInput | SortOrder
    createdAt?: SortOrder
  }

  export type ChallengeProblemWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    slug?: string
    AND?: ChallengeProblemWhereInput | ChallengeProblemWhereInput[]
    OR?: ChallengeProblemWhereInput[]
    NOT?: ChallengeProblemWhereInput | ChallengeProblemWhereInput[]
    title?: StringFilter<"ChallengeProblem"> | string
    difficulty?: StringFilter<"ChallengeProblem"> | string
    description?: StringFilter<"ChallengeProblem"> | string
    examples?: JsonFilter<"ChallengeProblem">
    constraints?: StringNullableListFilter<"ChallengeProblem">
    topicTags?: StringNullableListFilter<"ChallengeProblem">
    timeLimitMs?: IntFilter<"ChallengeProblem"> | number
    memoryLimitMb?: IntFilter<"ChallengeProblem"> | number
    starterCodes?: JsonFilter<"ChallengeProblem">
    testCases?: JsonFilter<"ChallengeProblem">
    idealSolution?: StringNullableFilter<"ChallengeProblem"> | string | null
    createdAt?: DateTimeFilter<"ChallengeProblem"> | Date | string
  }, "id" | "slug">

  export type ChallengeProblemOrderByWithAggregationInput = {
    id?: SortOrder
    title?: SortOrder
    slug?: SortOrder
    difficulty?: SortOrder
    description?: SortOrder
    examples?: SortOrder
    constraints?: SortOrder
    topicTags?: SortOrder
    timeLimitMs?: SortOrder
    memoryLimitMb?: SortOrder
    starterCodes?: SortOrder
    testCases?: SortOrder
    idealSolution?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: ChallengeProblemCountOrderByAggregateInput
    _avg?: ChallengeProblemAvgOrderByAggregateInput
    _max?: ChallengeProblemMaxOrderByAggregateInput
    _min?: ChallengeProblemMinOrderByAggregateInput
    _sum?: ChallengeProblemSumOrderByAggregateInput
  }

  export type ChallengeProblemScalarWhereWithAggregatesInput = {
    AND?: ChallengeProblemScalarWhereWithAggregatesInput | ChallengeProblemScalarWhereWithAggregatesInput[]
    OR?: ChallengeProblemScalarWhereWithAggregatesInput[]
    NOT?: ChallengeProblemScalarWhereWithAggregatesInput | ChallengeProblemScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ChallengeProblem"> | string
    title?: StringWithAggregatesFilter<"ChallengeProblem"> | string
    slug?: StringWithAggregatesFilter<"ChallengeProblem"> | string
    difficulty?: StringWithAggregatesFilter<"ChallengeProblem"> | string
    description?: StringWithAggregatesFilter<"ChallengeProblem"> | string
    examples?: JsonWithAggregatesFilter<"ChallengeProblem">
    constraints?: StringNullableListFilter<"ChallengeProblem">
    topicTags?: StringNullableListFilter<"ChallengeProblem">
    timeLimitMs?: IntWithAggregatesFilter<"ChallengeProblem"> | number
    memoryLimitMb?: IntWithAggregatesFilter<"ChallengeProblem"> | number
    starterCodes?: JsonWithAggregatesFilter<"ChallengeProblem">
    testCases?: JsonWithAggregatesFilter<"ChallengeProblem">
    idealSolution?: StringNullableWithAggregatesFilter<"ChallengeProblem"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"ChallengeProblem"> | Date | string
  }

  export type ChallengeSubmissionWhereInput = {
    AND?: ChallengeSubmissionWhereInput | ChallengeSubmissionWhereInput[]
    OR?: ChallengeSubmissionWhereInput[]
    NOT?: ChallengeSubmissionWhereInput | ChallengeSubmissionWhereInput[]
    id?: StringFilter<"ChallengeSubmission"> | string
    matchId?: StringFilter<"ChallengeSubmission"> | string
    userId?: StringFilter<"ChallengeSubmission"> | string
    problemId?: StringFilter<"ChallengeSubmission"> | string
    language?: StringFilter<"ChallengeSubmission"> | string
    sourceCode?: StringFilter<"ChallengeSubmission"> | string
    status?: StringFilter<"ChallengeSubmission"> | string
    executionTimeMs?: IntFilter<"ChallengeSubmission"> | number
    passedTestCases?: IntFilter<"ChallengeSubmission"> | number
    totalTestCases?: IntFilter<"ChallengeSubmission"> | number
    score?: IntFilter<"ChallengeSubmission"> | number
    stdout?: StringNullableFilter<"ChallengeSubmission"> | string | null
    errorDetails?: StringNullableFilter<"ChallengeSubmission"> | string | null
    submittedAt?: DateTimeFilter<"ChallengeSubmission"> | Date | string
    match?: XOR<MatchSessionScalarRelationFilter, MatchSessionWhereInput>
  }

  export type ChallengeSubmissionOrderByWithRelationInput = {
    id?: SortOrder
    matchId?: SortOrder
    userId?: SortOrder
    problemId?: SortOrder
    language?: SortOrder
    sourceCode?: SortOrder
    status?: SortOrder
    executionTimeMs?: SortOrder
    passedTestCases?: SortOrder
    totalTestCases?: SortOrder
    score?: SortOrder
    stdout?: SortOrderInput | SortOrder
    errorDetails?: SortOrderInput | SortOrder
    submittedAt?: SortOrder
    match?: MatchSessionOrderByWithRelationInput
  }

  export type ChallengeSubmissionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ChallengeSubmissionWhereInput | ChallengeSubmissionWhereInput[]
    OR?: ChallengeSubmissionWhereInput[]
    NOT?: ChallengeSubmissionWhereInput | ChallengeSubmissionWhereInput[]
    matchId?: StringFilter<"ChallengeSubmission"> | string
    userId?: StringFilter<"ChallengeSubmission"> | string
    problemId?: StringFilter<"ChallengeSubmission"> | string
    language?: StringFilter<"ChallengeSubmission"> | string
    sourceCode?: StringFilter<"ChallengeSubmission"> | string
    status?: StringFilter<"ChallengeSubmission"> | string
    executionTimeMs?: IntFilter<"ChallengeSubmission"> | number
    passedTestCases?: IntFilter<"ChallengeSubmission"> | number
    totalTestCases?: IntFilter<"ChallengeSubmission"> | number
    score?: IntFilter<"ChallengeSubmission"> | number
    stdout?: StringNullableFilter<"ChallengeSubmission"> | string | null
    errorDetails?: StringNullableFilter<"ChallengeSubmission"> | string | null
    submittedAt?: DateTimeFilter<"ChallengeSubmission"> | Date | string
    match?: XOR<MatchSessionScalarRelationFilter, MatchSessionWhereInput>
  }, "id">

  export type ChallengeSubmissionOrderByWithAggregationInput = {
    id?: SortOrder
    matchId?: SortOrder
    userId?: SortOrder
    problemId?: SortOrder
    language?: SortOrder
    sourceCode?: SortOrder
    status?: SortOrder
    executionTimeMs?: SortOrder
    passedTestCases?: SortOrder
    totalTestCases?: SortOrder
    score?: SortOrder
    stdout?: SortOrderInput | SortOrder
    errorDetails?: SortOrderInput | SortOrder
    submittedAt?: SortOrder
    _count?: ChallengeSubmissionCountOrderByAggregateInput
    _avg?: ChallengeSubmissionAvgOrderByAggregateInput
    _max?: ChallengeSubmissionMaxOrderByAggregateInput
    _min?: ChallengeSubmissionMinOrderByAggregateInput
    _sum?: ChallengeSubmissionSumOrderByAggregateInput
  }

  export type ChallengeSubmissionScalarWhereWithAggregatesInput = {
    AND?: ChallengeSubmissionScalarWhereWithAggregatesInput | ChallengeSubmissionScalarWhereWithAggregatesInput[]
    OR?: ChallengeSubmissionScalarWhereWithAggregatesInput[]
    NOT?: ChallengeSubmissionScalarWhereWithAggregatesInput | ChallengeSubmissionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ChallengeSubmission"> | string
    matchId?: StringWithAggregatesFilter<"ChallengeSubmission"> | string
    userId?: StringWithAggregatesFilter<"ChallengeSubmission"> | string
    problemId?: StringWithAggregatesFilter<"ChallengeSubmission"> | string
    language?: StringWithAggregatesFilter<"ChallengeSubmission"> | string
    sourceCode?: StringWithAggregatesFilter<"ChallengeSubmission"> | string
    status?: StringWithAggregatesFilter<"ChallengeSubmission"> | string
    executionTimeMs?: IntWithAggregatesFilter<"ChallengeSubmission"> | number
    passedTestCases?: IntWithAggregatesFilter<"ChallengeSubmission"> | number
    totalTestCases?: IntWithAggregatesFilter<"ChallengeSubmission"> | number
    score?: IntWithAggregatesFilter<"ChallengeSubmission"> | number
    stdout?: StringNullableWithAggregatesFilter<"ChallengeSubmission"> | string | null
    errorDetails?: StringNullableWithAggregatesFilter<"ChallengeSubmission"> | string | null
    submittedAt?: DateTimeWithAggregatesFilter<"ChallengeSubmission"> | Date | string
  }

  export type QuizTemplateWhereInput = {
    AND?: QuizTemplateWhereInput | QuizTemplateWhereInput[]
    OR?: QuizTemplateWhereInput[]
    NOT?: QuizTemplateWhereInput | QuizTemplateWhereInput[]
    id?: StringFilter<"QuizTemplate"> | string
    title?: StringFilter<"QuizTemplate"> | string
    category?: StringFilter<"QuizTemplate"> | string
    difficulty?: StringFilter<"QuizTemplate"> | string
    timePerQuestion?: IntFilter<"QuizTemplate"> | number
    totalQuestions?: IntFilter<"QuizTemplate"> | number
    createdAt?: DateTimeFilter<"QuizTemplate"> | Date | string
    questions?: QuizQuestionListRelationFilter
    sessions?: QuizSessionListRelationFilter
  }

  export type QuizTemplateOrderByWithRelationInput = {
    id?: SortOrder
    title?: SortOrder
    category?: SortOrder
    difficulty?: SortOrder
    timePerQuestion?: SortOrder
    totalQuestions?: SortOrder
    createdAt?: SortOrder
    questions?: QuizQuestionOrderByRelationAggregateInput
    sessions?: QuizSessionOrderByRelationAggregateInput
  }

  export type QuizTemplateWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: QuizTemplateWhereInput | QuizTemplateWhereInput[]
    OR?: QuizTemplateWhereInput[]
    NOT?: QuizTemplateWhereInput | QuizTemplateWhereInput[]
    title?: StringFilter<"QuizTemplate"> | string
    category?: StringFilter<"QuizTemplate"> | string
    difficulty?: StringFilter<"QuizTemplate"> | string
    timePerQuestion?: IntFilter<"QuizTemplate"> | number
    totalQuestions?: IntFilter<"QuizTemplate"> | number
    createdAt?: DateTimeFilter<"QuizTemplate"> | Date | string
    questions?: QuizQuestionListRelationFilter
    sessions?: QuizSessionListRelationFilter
  }, "id">

  export type QuizTemplateOrderByWithAggregationInput = {
    id?: SortOrder
    title?: SortOrder
    category?: SortOrder
    difficulty?: SortOrder
    timePerQuestion?: SortOrder
    totalQuestions?: SortOrder
    createdAt?: SortOrder
    _count?: QuizTemplateCountOrderByAggregateInput
    _avg?: QuizTemplateAvgOrderByAggregateInput
    _max?: QuizTemplateMaxOrderByAggregateInput
    _min?: QuizTemplateMinOrderByAggregateInput
    _sum?: QuizTemplateSumOrderByAggregateInput
  }

  export type QuizTemplateScalarWhereWithAggregatesInput = {
    AND?: QuizTemplateScalarWhereWithAggregatesInput | QuizTemplateScalarWhereWithAggregatesInput[]
    OR?: QuizTemplateScalarWhereWithAggregatesInput[]
    NOT?: QuizTemplateScalarWhereWithAggregatesInput | QuizTemplateScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"QuizTemplate"> | string
    title?: StringWithAggregatesFilter<"QuizTemplate"> | string
    category?: StringWithAggregatesFilter<"QuizTemplate"> | string
    difficulty?: StringWithAggregatesFilter<"QuizTemplate"> | string
    timePerQuestion?: IntWithAggregatesFilter<"QuizTemplate"> | number
    totalQuestions?: IntWithAggregatesFilter<"QuizTemplate"> | number
    createdAt?: DateTimeWithAggregatesFilter<"QuizTemplate"> | Date | string
  }

  export type QuizQuestionWhereInput = {
    AND?: QuizQuestionWhereInput | QuizQuestionWhereInput[]
    OR?: QuizQuestionWhereInput[]
    NOT?: QuizQuestionWhereInput | QuizQuestionWhereInput[]
    id?: StringFilter<"QuizQuestion"> | string
    quizId?: StringFilter<"QuizQuestion"> | string
    question?: StringFilter<"QuizQuestion"> | string
    options?: StringNullableListFilter<"QuizQuestion">
    correctIndex?: IntFilter<"QuizQuestion"> | number
    explanation?: StringFilter<"QuizQuestion"> | string
    topic?: StringFilter<"QuizQuestion"> | string
    difficulty?: StringFilter<"QuizQuestion"> | string
    quiz?: XOR<QuizTemplateScalarRelationFilter, QuizTemplateWhereInput>
  }

  export type QuizQuestionOrderByWithRelationInput = {
    id?: SortOrder
    quizId?: SortOrder
    question?: SortOrder
    options?: SortOrder
    correctIndex?: SortOrder
    explanation?: SortOrder
    topic?: SortOrder
    difficulty?: SortOrder
    quiz?: QuizTemplateOrderByWithRelationInput
  }

  export type QuizQuestionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: QuizQuestionWhereInput | QuizQuestionWhereInput[]
    OR?: QuizQuestionWhereInput[]
    NOT?: QuizQuestionWhereInput | QuizQuestionWhereInput[]
    quizId?: StringFilter<"QuizQuestion"> | string
    question?: StringFilter<"QuizQuestion"> | string
    options?: StringNullableListFilter<"QuizQuestion">
    correctIndex?: IntFilter<"QuizQuestion"> | number
    explanation?: StringFilter<"QuizQuestion"> | string
    topic?: StringFilter<"QuizQuestion"> | string
    difficulty?: StringFilter<"QuizQuestion"> | string
    quiz?: XOR<QuizTemplateScalarRelationFilter, QuizTemplateWhereInput>
  }, "id">

  export type QuizQuestionOrderByWithAggregationInput = {
    id?: SortOrder
    quizId?: SortOrder
    question?: SortOrder
    options?: SortOrder
    correctIndex?: SortOrder
    explanation?: SortOrder
    topic?: SortOrder
    difficulty?: SortOrder
    _count?: QuizQuestionCountOrderByAggregateInput
    _avg?: QuizQuestionAvgOrderByAggregateInput
    _max?: QuizQuestionMaxOrderByAggregateInput
    _min?: QuizQuestionMinOrderByAggregateInput
    _sum?: QuizQuestionSumOrderByAggregateInput
  }

  export type QuizQuestionScalarWhereWithAggregatesInput = {
    AND?: QuizQuestionScalarWhereWithAggregatesInput | QuizQuestionScalarWhereWithAggregatesInput[]
    OR?: QuizQuestionScalarWhereWithAggregatesInput[]
    NOT?: QuizQuestionScalarWhereWithAggregatesInput | QuizQuestionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"QuizQuestion"> | string
    quizId?: StringWithAggregatesFilter<"QuizQuestion"> | string
    question?: StringWithAggregatesFilter<"QuizQuestion"> | string
    options?: StringNullableListFilter<"QuizQuestion">
    correctIndex?: IntWithAggregatesFilter<"QuizQuestion"> | number
    explanation?: StringWithAggregatesFilter<"QuizQuestion"> | string
    topic?: StringWithAggregatesFilter<"QuizQuestion"> | string
    difficulty?: StringWithAggregatesFilter<"QuizQuestion"> | string
  }

  export type QuizSessionWhereInput = {
    AND?: QuizSessionWhereInput | QuizSessionWhereInput[]
    OR?: QuizSessionWhereInput[]
    NOT?: QuizSessionWhereInput | QuizSessionWhereInput[]
    id?: StringFilter<"QuizSession"> | string
    quizId?: StringFilter<"QuizSession"> | string
    roomCode?: StringNullableFilter<"QuizSession"> | string | null
    status?: StringFilter<"QuizSession"> | string
    currentQuestion?: IntFilter<"QuizSession"> | number
    startedAt?: DateTimeNullableFilter<"QuizSession"> | Date | string | null
    endedAt?: DateTimeNullableFilter<"QuizSession"> | Date | string | null
    durationSeconds?: IntFilter<"QuizSession"> | number
    createdAt?: DateTimeFilter<"QuizSession"> | Date | string
    quiz?: XOR<QuizTemplateScalarRelationFilter, QuizTemplateWhereInput>
    answers?: QuizAnswerListRelationFilter
  }

  export type QuizSessionOrderByWithRelationInput = {
    id?: SortOrder
    quizId?: SortOrder
    roomCode?: SortOrderInput | SortOrder
    status?: SortOrder
    currentQuestion?: SortOrder
    startedAt?: SortOrderInput | SortOrder
    endedAt?: SortOrderInput | SortOrder
    durationSeconds?: SortOrder
    createdAt?: SortOrder
    quiz?: QuizTemplateOrderByWithRelationInput
    answers?: QuizAnswerOrderByRelationAggregateInput
  }

  export type QuizSessionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    roomCode?: string
    AND?: QuizSessionWhereInput | QuizSessionWhereInput[]
    OR?: QuizSessionWhereInput[]
    NOT?: QuizSessionWhereInput | QuizSessionWhereInput[]
    quizId?: StringFilter<"QuizSession"> | string
    status?: StringFilter<"QuizSession"> | string
    currentQuestion?: IntFilter<"QuizSession"> | number
    startedAt?: DateTimeNullableFilter<"QuizSession"> | Date | string | null
    endedAt?: DateTimeNullableFilter<"QuizSession"> | Date | string | null
    durationSeconds?: IntFilter<"QuizSession"> | number
    createdAt?: DateTimeFilter<"QuizSession"> | Date | string
    quiz?: XOR<QuizTemplateScalarRelationFilter, QuizTemplateWhereInput>
    answers?: QuizAnswerListRelationFilter
  }, "id" | "roomCode">

  export type QuizSessionOrderByWithAggregationInput = {
    id?: SortOrder
    quizId?: SortOrder
    roomCode?: SortOrderInput | SortOrder
    status?: SortOrder
    currentQuestion?: SortOrder
    startedAt?: SortOrderInput | SortOrder
    endedAt?: SortOrderInput | SortOrder
    durationSeconds?: SortOrder
    createdAt?: SortOrder
    _count?: QuizSessionCountOrderByAggregateInput
    _avg?: QuizSessionAvgOrderByAggregateInput
    _max?: QuizSessionMaxOrderByAggregateInput
    _min?: QuizSessionMinOrderByAggregateInput
    _sum?: QuizSessionSumOrderByAggregateInput
  }

  export type QuizSessionScalarWhereWithAggregatesInput = {
    AND?: QuizSessionScalarWhereWithAggregatesInput | QuizSessionScalarWhereWithAggregatesInput[]
    OR?: QuizSessionScalarWhereWithAggregatesInput[]
    NOT?: QuizSessionScalarWhereWithAggregatesInput | QuizSessionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"QuizSession"> | string
    quizId?: StringWithAggregatesFilter<"QuizSession"> | string
    roomCode?: StringNullableWithAggregatesFilter<"QuizSession"> | string | null
    status?: StringWithAggregatesFilter<"QuizSession"> | string
    currentQuestion?: IntWithAggregatesFilter<"QuizSession"> | number
    startedAt?: DateTimeNullableWithAggregatesFilter<"QuizSession"> | Date | string | null
    endedAt?: DateTimeNullableWithAggregatesFilter<"QuizSession"> | Date | string | null
    durationSeconds?: IntWithAggregatesFilter<"QuizSession"> | number
    createdAt?: DateTimeWithAggregatesFilter<"QuizSession"> | Date | string
  }

  export type QuizAnswerWhereInput = {
    AND?: QuizAnswerWhereInput | QuizAnswerWhereInput[]
    OR?: QuizAnswerWhereInput[]
    NOT?: QuizAnswerWhereInput | QuizAnswerWhereInput[]
    id?: StringFilter<"QuizAnswer"> | string
    sessionId?: StringFilter<"QuizAnswer"> | string
    questionId?: StringFilter<"QuizAnswer"> | string
    userId?: StringFilter<"QuizAnswer"> | string
    userName?: StringFilter<"QuizAnswer"> | string
    selectedIndex?: IntFilter<"QuizAnswer"> | number
    isCorrect?: BoolFilter<"QuizAnswer"> | boolean
    responseTimeMs?: IntFilter<"QuizAnswer"> | number
    pointsAwarded?: IntFilter<"QuizAnswer"> | number
    submittedAt?: DateTimeFilter<"QuizAnswer"> | Date | string
    session?: XOR<QuizSessionScalarRelationFilter, QuizSessionWhereInput>
  }

  export type QuizAnswerOrderByWithRelationInput = {
    id?: SortOrder
    sessionId?: SortOrder
    questionId?: SortOrder
    userId?: SortOrder
    userName?: SortOrder
    selectedIndex?: SortOrder
    isCorrect?: SortOrder
    responseTimeMs?: SortOrder
    pointsAwarded?: SortOrder
    submittedAt?: SortOrder
    session?: QuizSessionOrderByWithRelationInput
  }

  export type QuizAnswerWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    sessionId_questionId_userId?: QuizAnswerSessionIdQuestionIdUserIdCompoundUniqueInput
    AND?: QuizAnswerWhereInput | QuizAnswerWhereInput[]
    OR?: QuizAnswerWhereInput[]
    NOT?: QuizAnswerWhereInput | QuizAnswerWhereInput[]
    sessionId?: StringFilter<"QuizAnswer"> | string
    questionId?: StringFilter<"QuizAnswer"> | string
    userId?: StringFilter<"QuizAnswer"> | string
    userName?: StringFilter<"QuizAnswer"> | string
    selectedIndex?: IntFilter<"QuizAnswer"> | number
    isCorrect?: BoolFilter<"QuizAnswer"> | boolean
    responseTimeMs?: IntFilter<"QuizAnswer"> | number
    pointsAwarded?: IntFilter<"QuizAnswer"> | number
    submittedAt?: DateTimeFilter<"QuizAnswer"> | Date | string
    session?: XOR<QuizSessionScalarRelationFilter, QuizSessionWhereInput>
  }, "id" | "sessionId_questionId_userId">

  export type QuizAnswerOrderByWithAggregationInput = {
    id?: SortOrder
    sessionId?: SortOrder
    questionId?: SortOrder
    userId?: SortOrder
    userName?: SortOrder
    selectedIndex?: SortOrder
    isCorrect?: SortOrder
    responseTimeMs?: SortOrder
    pointsAwarded?: SortOrder
    submittedAt?: SortOrder
    _count?: QuizAnswerCountOrderByAggregateInput
    _avg?: QuizAnswerAvgOrderByAggregateInput
    _max?: QuizAnswerMaxOrderByAggregateInput
    _min?: QuizAnswerMinOrderByAggregateInput
    _sum?: QuizAnswerSumOrderByAggregateInput
  }

  export type QuizAnswerScalarWhereWithAggregatesInput = {
    AND?: QuizAnswerScalarWhereWithAggregatesInput | QuizAnswerScalarWhereWithAggregatesInput[]
    OR?: QuizAnswerScalarWhereWithAggregatesInput[]
    NOT?: QuizAnswerScalarWhereWithAggregatesInput | QuizAnswerScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"QuizAnswer"> | string
    sessionId?: StringWithAggregatesFilter<"QuizAnswer"> | string
    questionId?: StringWithAggregatesFilter<"QuizAnswer"> | string
    userId?: StringWithAggregatesFilter<"QuizAnswer"> | string
    userName?: StringWithAggregatesFilter<"QuizAnswer"> | string
    selectedIndex?: IntWithAggregatesFilter<"QuizAnswer"> | number
    isCorrect?: BoolWithAggregatesFilter<"QuizAnswer"> | boolean
    responseTimeMs?: IntWithAggregatesFilter<"QuizAnswer"> | number
    pointsAwarded?: IntWithAggregatesFilter<"QuizAnswer"> | number
    submittedAt?: DateTimeWithAggregatesFilter<"QuizAnswer"> | Date | string
  }

  export type FriendshipWhereInput = {
    AND?: FriendshipWhereInput | FriendshipWhereInput[]
    OR?: FriendshipWhereInput[]
    NOT?: FriendshipWhereInput | FriendshipWhereInput[]
    id?: StringFilter<"Friendship"> | string
    requesterId?: StringFilter<"Friendship"> | string
    recipientId?: StringFilter<"Friendship"> | string
    status?: StringFilter<"Friendship"> | string
    createdAt?: DateTimeFilter<"Friendship"> | Date | string
  }

  export type FriendshipOrderByWithRelationInput = {
    id?: SortOrder
    requesterId?: SortOrder
    recipientId?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
  }

  export type FriendshipWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    requesterId_recipientId?: FriendshipRequesterIdRecipientIdCompoundUniqueInput
    AND?: FriendshipWhereInput | FriendshipWhereInput[]
    OR?: FriendshipWhereInput[]
    NOT?: FriendshipWhereInput | FriendshipWhereInput[]
    requesterId?: StringFilter<"Friendship"> | string
    recipientId?: StringFilter<"Friendship"> | string
    status?: StringFilter<"Friendship"> | string
    createdAt?: DateTimeFilter<"Friendship"> | Date | string
  }, "id" | "requesterId_recipientId">

  export type FriendshipOrderByWithAggregationInput = {
    id?: SortOrder
    requesterId?: SortOrder
    recipientId?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    _count?: FriendshipCountOrderByAggregateInput
    _max?: FriendshipMaxOrderByAggregateInput
    _min?: FriendshipMinOrderByAggregateInput
  }

  export type FriendshipScalarWhereWithAggregatesInput = {
    AND?: FriendshipScalarWhereWithAggregatesInput | FriendshipScalarWhereWithAggregatesInput[]
    OR?: FriendshipScalarWhereWithAggregatesInput[]
    NOT?: FriendshipScalarWhereWithAggregatesInput | FriendshipScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Friendship"> | string
    requesterId?: StringWithAggregatesFilter<"Friendship"> | string
    recipientId?: StringWithAggregatesFilter<"Friendship"> | string
    status?: StringWithAggregatesFilter<"Friendship"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Friendship"> | Date | string
  }

  export type StudyGroupWhereInput = {
    AND?: StudyGroupWhereInput | StudyGroupWhereInput[]
    OR?: StudyGroupWhereInput[]
    NOT?: StudyGroupWhereInput | StudyGroupWhereInput[]
    id?: StringFilter<"StudyGroup"> | string
    name?: StringFilter<"StudyGroup"> | string
    description?: StringNullableFilter<"StudyGroup"> | string | null
    createdBy?: StringFilter<"StudyGroup"> | string
    createdAt?: DateTimeFilter<"StudyGroup"> | Date | string
    members?: GroupMemberListRelationFilter
  }

  export type StudyGroupOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    createdBy?: SortOrder
    createdAt?: SortOrder
    members?: GroupMemberOrderByRelationAggregateInput
  }

  export type StudyGroupWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: StudyGroupWhereInput | StudyGroupWhereInput[]
    OR?: StudyGroupWhereInput[]
    NOT?: StudyGroupWhereInput | StudyGroupWhereInput[]
    name?: StringFilter<"StudyGroup"> | string
    description?: StringNullableFilter<"StudyGroup"> | string | null
    createdBy?: StringFilter<"StudyGroup"> | string
    createdAt?: DateTimeFilter<"StudyGroup"> | Date | string
    members?: GroupMemberListRelationFilter
  }, "id">

  export type StudyGroupOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    createdBy?: SortOrder
    createdAt?: SortOrder
    _count?: StudyGroupCountOrderByAggregateInput
    _max?: StudyGroupMaxOrderByAggregateInput
    _min?: StudyGroupMinOrderByAggregateInput
  }

  export type StudyGroupScalarWhereWithAggregatesInput = {
    AND?: StudyGroupScalarWhereWithAggregatesInput | StudyGroupScalarWhereWithAggregatesInput[]
    OR?: StudyGroupScalarWhereWithAggregatesInput[]
    NOT?: StudyGroupScalarWhereWithAggregatesInput | StudyGroupScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"StudyGroup"> | string
    name?: StringWithAggregatesFilter<"StudyGroup"> | string
    description?: StringNullableWithAggregatesFilter<"StudyGroup"> | string | null
    createdBy?: StringWithAggregatesFilter<"StudyGroup"> | string
    createdAt?: DateTimeWithAggregatesFilter<"StudyGroup"> | Date | string
  }

  export type GroupMemberWhereInput = {
    AND?: GroupMemberWhereInput | GroupMemberWhereInput[]
    OR?: GroupMemberWhereInput[]
    NOT?: GroupMemberWhereInput | GroupMemberWhereInput[]
    id?: StringFilter<"GroupMember"> | string
    groupId?: StringFilter<"GroupMember"> | string
    userId?: StringFilter<"GroupMember"> | string
    userName?: StringFilter<"GroupMember"> | string
    role?: StringFilter<"GroupMember"> | string
    joinedAt?: DateTimeFilter<"GroupMember"> | Date | string
    group?: XOR<StudyGroupScalarRelationFilter, StudyGroupWhereInput>
  }

  export type GroupMemberOrderByWithRelationInput = {
    id?: SortOrder
    groupId?: SortOrder
    userId?: SortOrder
    userName?: SortOrder
    role?: SortOrder
    joinedAt?: SortOrder
    group?: StudyGroupOrderByWithRelationInput
  }

  export type GroupMemberWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    groupId_userId?: GroupMemberGroupIdUserIdCompoundUniqueInput
    AND?: GroupMemberWhereInput | GroupMemberWhereInput[]
    OR?: GroupMemberWhereInput[]
    NOT?: GroupMemberWhereInput | GroupMemberWhereInput[]
    groupId?: StringFilter<"GroupMember"> | string
    userId?: StringFilter<"GroupMember"> | string
    userName?: StringFilter<"GroupMember"> | string
    role?: StringFilter<"GroupMember"> | string
    joinedAt?: DateTimeFilter<"GroupMember"> | Date | string
    group?: XOR<StudyGroupScalarRelationFilter, StudyGroupWhereInput>
  }, "id" | "groupId_userId">

  export type GroupMemberOrderByWithAggregationInput = {
    id?: SortOrder
    groupId?: SortOrder
    userId?: SortOrder
    userName?: SortOrder
    role?: SortOrder
    joinedAt?: SortOrder
    _count?: GroupMemberCountOrderByAggregateInput
    _max?: GroupMemberMaxOrderByAggregateInput
    _min?: GroupMemberMinOrderByAggregateInput
  }

  export type GroupMemberScalarWhereWithAggregatesInput = {
    AND?: GroupMemberScalarWhereWithAggregatesInput | GroupMemberScalarWhereWithAggregatesInput[]
    OR?: GroupMemberScalarWhereWithAggregatesInput[]
    NOT?: GroupMemberScalarWhereWithAggregatesInput | GroupMemberScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"GroupMember"> | string
    groupId?: StringWithAggregatesFilter<"GroupMember"> | string
    userId?: StringWithAggregatesFilter<"GroupMember"> | string
    userName?: StringWithAggregatesFilter<"GroupMember"> | string
    role?: StringWithAggregatesFilter<"GroupMember"> | string
    joinedAt?: DateTimeWithAggregatesFilter<"GroupMember"> | Date | string
  }

  export type ChallengeRatingWhereInput = {
    AND?: ChallengeRatingWhereInput | ChallengeRatingWhereInput[]
    OR?: ChallengeRatingWhereInput[]
    NOT?: ChallengeRatingWhereInput | ChallengeRatingWhereInput[]
    id?: StringFilter<"ChallengeRating"> | string
    userId?: StringFilter<"ChallengeRating"> | string
    userName?: StringFilter<"ChallengeRating"> | string
    userAvatar?: StringNullableFilter<"ChallengeRating"> | string | null
    rating?: IntFilter<"ChallengeRating"> | number
    tier?: StringFilter<"ChallengeRating"> | string
    battlesTotal?: IntFilter<"ChallengeRating"> | number
    battlesWon?: IntFilter<"ChallengeRating"> | number
    winRate?: FloatFilter<"ChallengeRating"> | number
    currentStreak?: IntFilter<"ChallengeRating"> | number
    longestStreak?: IntFilter<"ChallengeRating"> | number
    totalXP?: IntFilter<"ChallengeRating"> | number
    updatedAt?: DateTimeFilter<"ChallengeRating"> | Date | string
  }

  export type ChallengeRatingOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    userName?: SortOrder
    userAvatar?: SortOrderInput | SortOrder
    rating?: SortOrder
    tier?: SortOrder
    battlesTotal?: SortOrder
    battlesWon?: SortOrder
    winRate?: SortOrder
    currentStreak?: SortOrder
    longestStreak?: SortOrder
    totalXP?: SortOrder
    updatedAt?: SortOrder
  }

  export type ChallengeRatingWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId?: string
    AND?: ChallengeRatingWhereInput | ChallengeRatingWhereInput[]
    OR?: ChallengeRatingWhereInput[]
    NOT?: ChallengeRatingWhereInput | ChallengeRatingWhereInput[]
    userName?: StringFilter<"ChallengeRating"> | string
    userAvatar?: StringNullableFilter<"ChallengeRating"> | string | null
    rating?: IntFilter<"ChallengeRating"> | number
    tier?: StringFilter<"ChallengeRating"> | string
    battlesTotal?: IntFilter<"ChallengeRating"> | number
    battlesWon?: IntFilter<"ChallengeRating"> | number
    winRate?: FloatFilter<"ChallengeRating"> | number
    currentStreak?: IntFilter<"ChallengeRating"> | number
    longestStreak?: IntFilter<"ChallengeRating"> | number
    totalXP?: IntFilter<"ChallengeRating"> | number
    updatedAt?: DateTimeFilter<"ChallengeRating"> | Date | string
  }, "id" | "userId">

  export type ChallengeRatingOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    userName?: SortOrder
    userAvatar?: SortOrderInput | SortOrder
    rating?: SortOrder
    tier?: SortOrder
    battlesTotal?: SortOrder
    battlesWon?: SortOrder
    winRate?: SortOrder
    currentStreak?: SortOrder
    longestStreak?: SortOrder
    totalXP?: SortOrder
    updatedAt?: SortOrder
    _count?: ChallengeRatingCountOrderByAggregateInput
    _avg?: ChallengeRatingAvgOrderByAggregateInput
    _max?: ChallengeRatingMaxOrderByAggregateInput
    _min?: ChallengeRatingMinOrderByAggregateInput
    _sum?: ChallengeRatingSumOrderByAggregateInput
  }

  export type ChallengeRatingScalarWhereWithAggregatesInput = {
    AND?: ChallengeRatingScalarWhereWithAggregatesInput | ChallengeRatingScalarWhereWithAggregatesInput[]
    OR?: ChallengeRatingScalarWhereWithAggregatesInput[]
    NOT?: ChallengeRatingScalarWhereWithAggregatesInput | ChallengeRatingScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ChallengeRating"> | string
    userId?: StringWithAggregatesFilter<"ChallengeRating"> | string
    userName?: StringWithAggregatesFilter<"ChallengeRating"> | string
    userAvatar?: StringNullableWithAggregatesFilter<"ChallengeRating"> | string | null
    rating?: IntWithAggregatesFilter<"ChallengeRating"> | number
    tier?: StringWithAggregatesFilter<"ChallengeRating"> | string
    battlesTotal?: IntWithAggregatesFilter<"ChallengeRating"> | number
    battlesWon?: IntWithAggregatesFilter<"ChallengeRating"> | number
    winRate?: FloatWithAggregatesFilter<"ChallengeRating"> | number
    currentStreak?: IntWithAggregatesFilter<"ChallengeRating"> | number
    longestStreak?: IntWithAggregatesFilter<"ChallengeRating"> | number
    totalXP?: IntWithAggregatesFilter<"ChallengeRating"> | number
    updatedAt?: DateTimeWithAggregatesFilter<"ChallengeRating"> | Date | string
  }

  export type ChallengeRewardWhereInput = {
    AND?: ChallengeRewardWhereInput | ChallengeRewardWhereInput[]
    OR?: ChallengeRewardWhereInput[]
    NOT?: ChallengeRewardWhereInput | ChallengeRewardWhereInput[]
    id?: StringFilter<"ChallengeReward"> | string
    userId?: StringFilter<"ChallengeReward"> | string
    matchId?: StringNullableFilter<"ChallengeReward"> | string | null
    rewardType?: StringFilter<"ChallengeReward"> | string
    amountXP?: IntFilter<"ChallengeReward"> | number
    awardedAt?: DateTimeFilter<"ChallengeReward"> | Date | string
  }

  export type ChallengeRewardOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    matchId?: SortOrderInput | SortOrder
    rewardType?: SortOrder
    amountXP?: SortOrder
    awardedAt?: SortOrder
  }

  export type ChallengeRewardWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId_matchId_rewardType?: ChallengeRewardUserIdMatchIdRewardTypeCompoundUniqueInput
    AND?: ChallengeRewardWhereInput | ChallengeRewardWhereInput[]
    OR?: ChallengeRewardWhereInput[]
    NOT?: ChallengeRewardWhereInput | ChallengeRewardWhereInput[]
    userId?: StringFilter<"ChallengeReward"> | string
    matchId?: StringNullableFilter<"ChallengeReward"> | string | null
    rewardType?: StringFilter<"ChallengeReward"> | string
    amountXP?: IntFilter<"ChallengeReward"> | number
    awardedAt?: DateTimeFilter<"ChallengeReward"> | Date | string
  }, "id" | "userId_matchId_rewardType">

  export type ChallengeRewardOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    matchId?: SortOrderInput | SortOrder
    rewardType?: SortOrder
    amountXP?: SortOrder
    awardedAt?: SortOrder
    _count?: ChallengeRewardCountOrderByAggregateInput
    _avg?: ChallengeRewardAvgOrderByAggregateInput
    _max?: ChallengeRewardMaxOrderByAggregateInput
    _min?: ChallengeRewardMinOrderByAggregateInput
    _sum?: ChallengeRewardSumOrderByAggregateInput
  }

  export type ChallengeRewardScalarWhereWithAggregatesInput = {
    AND?: ChallengeRewardScalarWhereWithAggregatesInput | ChallengeRewardScalarWhereWithAggregatesInput[]
    OR?: ChallengeRewardScalarWhereWithAggregatesInput[]
    NOT?: ChallengeRewardScalarWhereWithAggregatesInput | ChallengeRewardScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ChallengeReward"> | string
    userId?: StringWithAggregatesFilter<"ChallengeReward"> | string
    matchId?: StringNullableWithAggregatesFilter<"ChallengeReward"> | string | null
    rewardType?: StringWithAggregatesFilter<"ChallengeReward"> | string
    amountXP?: IntWithAggregatesFilter<"ChallengeReward"> | number
    awardedAt?: DateTimeWithAggregatesFilter<"ChallengeReward"> | Date | string
  }

  export type ChallengeRoomCreateInput = {
    id?: string
    roomCode: string
    title: string
    type?: string
    visibility?: string
    difficulty?: string
    topic?: string
    language?: string
    maxParticipants?: number
    durationMinutes?: number
    status?: string
    createdBy: string
    hostName?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    participants?: ChallengeParticipantCreateNestedManyWithoutRoomInput
    matches?: MatchSessionCreateNestedManyWithoutRoomInput
  }

  export type ChallengeRoomUncheckedCreateInput = {
    id?: string
    roomCode: string
    title: string
    type?: string
    visibility?: string
    difficulty?: string
    topic?: string
    language?: string
    maxParticipants?: number
    durationMinutes?: number
    status?: string
    createdBy: string
    hostName?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    participants?: ChallengeParticipantUncheckedCreateNestedManyWithoutRoomInput
    matches?: MatchSessionUncheckedCreateNestedManyWithoutRoomInput
  }

  export type ChallengeRoomUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    roomCode?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    visibility?: StringFieldUpdateOperationsInput | string
    difficulty?: StringFieldUpdateOperationsInput | string
    topic?: StringFieldUpdateOperationsInput | string
    language?: StringFieldUpdateOperationsInput | string
    maxParticipants?: IntFieldUpdateOperationsInput | number
    durationMinutes?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    createdBy?: StringFieldUpdateOperationsInput | string
    hostName?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    participants?: ChallengeParticipantUpdateManyWithoutRoomNestedInput
    matches?: MatchSessionUpdateManyWithoutRoomNestedInput
  }

  export type ChallengeRoomUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    roomCode?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    visibility?: StringFieldUpdateOperationsInput | string
    difficulty?: StringFieldUpdateOperationsInput | string
    topic?: StringFieldUpdateOperationsInput | string
    language?: StringFieldUpdateOperationsInput | string
    maxParticipants?: IntFieldUpdateOperationsInput | number
    durationMinutes?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    createdBy?: StringFieldUpdateOperationsInput | string
    hostName?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    participants?: ChallengeParticipantUncheckedUpdateManyWithoutRoomNestedInput
    matches?: MatchSessionUncheckedUpdateManyWithoutRoomNestedInput
  }

  export type ChallengeRoomCreateManyInput = {
    id?: string
    roomCode: string
    title: string
    type?: string
    visibility?: string
    difficulty?: string
    topic?: string
    language?: string
    maxParticipants?: number
    durationMinutes?: number
    status?: string
    createdBy: string
    hostName?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ChallengeRoomUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    roomCode?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    visibility?: StringFieldUpdateOperationsInput | string
    difficulty?: StringFieldUpdateOperationsInput | string
    topic?: StringFieldUpdateOperationsInput | string
    language?: StringFieldUpdateOperationsInput | string
    maxParticipants?: IntFieldUpdateOperationsInput | number
    durationMinutes?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    createdBy?: StringFieldUpdateOperationsInput | string
    hostName?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChallengeRoomUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    roomCode?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    visibility?: StringFieldUpdateOperationsInput | string
    difficulty?: StringFieldUpdateOperationsInput | string
    topic?: StringFieldUpdateOperationsInput | string
    language?: StringFieldUpdateOperationsInput | string
    maxParticipants?: IntFieldUpdateOperationsInput | number
    durationMinutes?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    createdBy?: StringFieldUpdateOperationsInput | string
    hostName?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChallengeParticipantCreateInput = {
    id?: string
    userId: string
    userName: string
    userAvatar?: string | null
    userRating?: number
    isHost?: boolean
    isReady?: boolean
    status?: string
    joinedAt?: Date | string
    leftAt?: Date | string | null
    room: ChallengeRoomCreateNestedOneWithoutParticipantsInput
  }

  export type ChallengeParticipantUncheckedCreateInput = {
    id?: string
    roomId: string
    userId: string
    userName: string
    userAvatar?: string | null
    userRating?: number
    isHost?: boolean
    isReady?: boolean
    status?: string
    joinedAt?: Date | string
    leftAt?: Date | string | null
  }

  export type ChallengeParticipantUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    userName?: StringFieldUpdateOperationsInput | string
    userAvatar?: NullableStringFieldUpdateOperationsInput | string | null
    userRating?: IntFieldUpdateOperationsInput | number
    isHost?: BoolFieldUpdateOperationsInput | boolean
    isReady?: BoolFieldUpdateOperationsInput | boolean
    status?: StringFieldUpdateOperationsInput | string
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    leftAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    room?: ChallengeRoomUpdateOneRequiredWithoutParticipantsNestedInput
  }

  export type ChallengeParticipantUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    roomId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    userName?: StringFieldUpdateOperationsInput | string
    userAvatar?: NullableStringFieldUpdateOperationsInput | string | null
    userRating?: IntFieldUpdateOperationsInput | number
    isHost?: BoolFieldUpdateOperationsInput | boolean
    isReady?: BoolFieldUpdateOperationsInput | boolean
    status?: StringFieldUpdateOperationsInput | string
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    leftAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ChallengeParticipantCreateManyInput = {
    id?: string
    roomId: string
    userId: string
    userName: string
    userAvatar?: string | null
    userRating?: number
    isHost?: boolean
    isReady?: boolean
    status?: string
    joinedAt?: Date | string
    leftAt?: Date | string | null
  }

  export type ChallengeParticipantUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    userName?: StringFieldUpdateOperationsInput | string
    userAvatar?: NullableStringFieldUpdateOperationsInput | string | null
    userRating?: IntFieldUpdateOperationsInput | number
    isHost?: BoolFieldUpdateOperationsInput | boolean
    isReady?: BoolFieldUpdateOperationsInput | boolean
    status?: StringFieldUpdateOperationsInput | string
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    leftAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ChallengeParticipantUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    roomId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    userName?: StringFieldUpdateOperationsInput | string
    userAvatar?: NullableStringFieldUpdateOperationsInput | string | null
    userRating?: IntFieldUpdateOperationsInput | number
    isHost?: BoolFieldUpdateOperationsInput | boolean
    isReady?: BoolFieldUpdateOperationsInput | boolean
    status?: StringFieldUpdateOperationsInput | string
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    leftAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type MatchSessionCreateInput = {
    id?: string
    matchType?: string
    difficulty?: string
    status?: string
    startedAt?: Date | string | null
    endedAt?: Date | string | null
    durationSeconds?: number
    winnerId?: string | null
    resultSummary?: string | null
    problemId?: string | null
    createdAt?: Date | string
    room?: ChallengeRoomCreateNestedOneWithoutMatchesInput
    participants?: MatchParticipantCreateNestedManyWithoutMatchInput
    submissions?: ChallengeSubmissionCreateNestedManyWithoutMatchInput
  }

  export type MatchSessionUncheckedCreateInput = {
    id?: string
    roomId?: string | null
    matchType?: string
    difficulty?: string
    status?: string
    startedAt?: Date | string | null
    endedAt?: Date | string | null
    durationSeconds?: number
    winnerId?: string | null
    resultSummary?: string | null
    problemId?: string | null
    createdAt?: Date | string
    participants?: MatchParticipantUncheckedCreateNestedManyWithoutMatchInput
    submissions?: ChallengeSubmissionUncheckedCreateNestedManyWithoutMatchInput
  }

  export type MatchSessionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    matchType?: StringFieldUpdateOperationsInput | string
    difficulty?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    durationSeconds?: IntFieldUpdateOperationsInput | number
    winnerId?: NullableStringFieldUpdateOperationsInput | string | null
    resultSummary?: NullableStringFieldUpdateOperationsInput | string | null
    problemId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    room?: ChallengeRoomUpdateOneWithoutMatchesNestedInput
    participants?: MatchParticipantUpdateManyWithoutMatchNestedInput
    submissions?: ChallengeSubmissionUpdateManyWithoutMatchNestedInput
  }

  export type MatchSessionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    roomId?: NullableStringFieldUpdateOperationsInput | string | null
    matchType?: StringFieldUpdateOperationsInput | string
    difficulty?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    durationSeconds?: IntFieldUpdateOperationsInput | number
    winnerId?: NullableStringFieldUpdateOperationsInput | string | null
    resultSummary?: NullableStringFieldUpdateOperationsInput | string | null
    problemId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    participants?: MatchParticipantUncheckedUpdateManyWithoutMatchNestedInput
    submissions?: ChallengeSubmissionUncheckedUpdateManyWithoutMatchNestedInput
  }

  export type MatchSessionCreateManyInput = {
    id?: string
    roomId?: string | null
    matchType?: string
    difficulty?: string
    status?: string
    startedAt?: Date | string | null
    endedAt?: Date | string | null
    durationSeconds?: number
    winnerId?: string | null
    resultSummary?: string | null
    problemId?: string | null
    createdAt?: Date | string
  }

  export type MatchSessionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    matchType?: StringFieldUpdateOperationsInput | string
    difficulty?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    durationSeconds?: IntFieldUpdateOperationsInput | number
    winnerId?: NullableStringFieldUpdateOperationsInput | string | null
    resultSummary?: NullableStringFieldUpdateOperationsInput | string | null
    problemId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MatchSessionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    roomId?: NullableStringFieldUpdateOperationsInput | string | null
    matchType?: StringFieldUpdateOperationsInput | string
    difficulty?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    durationSeconds?: IntFieldUpdateOperationsInput | number
    winnerId?: NullableStringFieldUpdateOperationsInput | string | null
    resultSummary?: NullableStringFieldUpdateOperationsInput | string | null
    problemId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MatchParticipantCreateInput = {
    id?: string
    userId: string
    userName: string
    userAvatar?: string | null
    score?: number
    problemsSolved?: number
    passedTests?: number
    totalTests?: number
    ratingBefore?: number
    ratingAfter?: number
    xpEarned?: number
    status?: string
    submittedAt?: Date | string | null
    match: MatchSessionCreateNestedOneWithoutParticipantsInput
  }

  export type MatchParticipantUncheckedCreateInput = {
    id?: string
    matchId: string
    userId: string
    userName: string
    userAvatar?: string | null
    score?: number
    problemsSolved?: number
    passedTests?: number
    totalTests?: number
    ratingBefore?: number
    ratingAfter?: number
    xpEarned?: number
    status?: string
    submittedAt?: Date | string | null
  }

  export type MatchParticipantUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    userName?: StringFieldUpdateOperationsInput | string
    userAvatar?: NullableStringFieldUpdateOperationsInput | string | null
    score?: IntFieldUpdateOperationsInput | number
    problemsSolved?: IntFieldUpdateOperationsInput | number
    passedTests?: IntFieldUpdateOperationsInput | number
    totalTests?: IntFieldUpdateOperationsInput | number
    ratingBefore?: IntFieldUpdateOperationsInput | number
    ratingAfter?: IntFieldUpdateOperationsInput | number
    xpEarned?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    submittedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    match?: MatchSessionUpdateOneRequiredWithoutParticipantsNestedInput
  }

  export type MatchParticipantUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    matchId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    userName?: StringFieldUpdateOperationsInput | string
    userAvatar?: NullableStringFieldUpdateOperationsInput | string | null
    score?: IntFieldUpdateOperationsInput | number
    problemsSolved?: IntFieldUpdateOperationsInput | number
    passedTests?: IntFieldUpdateOperationsInput | number
    totalTests?: IntFieldUpdateOperationsInput | number
    ratingBefore?: IntFieldUpdateOperationsInput | number
    ratingAfter?: IntFieldUpdateOperationsInput | number
    xpEarned?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    submittedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type MatchParticipantCreateManyInput = {
    id?: string
    matchId: string
    userId: string
    userName: string
    userAvatar?: string | null
    score?: number
    problemsSolved?: number
    passedTests?: number
    totalTests?: number
    ratingBefore?: number
    ratingAfter?: number
    xpEarned?: number
    status?: string
    submittedAt?: Date | string | null
  }

  export type MatchParticipantUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    userName?: StringFieldUpdateOperationsInput | string
    userAvatar?: NullableStringFieldUpdateOperationsInput | string | null
    score?: IntFieldUpdateOperationsInput | number
    problemsSolved?: IntFieldUpdateOperationsInput | number
    passedTests?: IntFieldUpdateOperationsInput | number
    totalTests?: IntFieldUpdateOperationsInput | number
    ratingBefore?: IntFieldUpdateOperationsInput | number
    ratingAfter?: IntFieldUpdateOperationsInput | number
    xpEarned?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    submittedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type MatchParticipantUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    matchId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    userName?: StringFieldUpdateOperationsInput | string
    userAvatar?: NullableStringFieldUpdateOperationsInput | string | null
    score?: IntFieldUpdateOperationsInput | number
    problemsSolved?: IntFieldUpdateOperationsInput | number
    passedTests?: IntFieldUpdateOperationsInput | number
    totalTests?: IntFieldUpdateOperationsInput | number
    ratingBefore?: IntFieldUpdateOperationsInput | number
    ratingAfter?: IntFieldUpdateOperationsInput | number
    xpEarned?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    submittedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ChallengeProblemCreateInput = {
    id?: string
    title: string
    slug: string
    difficulty?: string
    description: string
    examples?: JsonNullValueInput | InputJsonValue
    constraints?: ChallengeProblemCreateconstraintsInput | string[]
    topicTags?: ChallengeProblemCreatetopicTagsInput | string[]
    timeLimitMs?: number
    memoryLimitMb?: number
    starterCodes?: JsonNullValueInput | InputJsonValue
    testCases?: JsonNullValueInput | InputJsonValue
    idealSolution?: string | null
    createdAt?: Date | string
  }

  export type ChallengeProblemUncheckedCreateInput = {
    id?: string
    title: string
    slug: string
    difficulty?: string
    description: string
    examples?: JsonNullValueInput | InputJsonValue
    constraints?: ChallengeProblemCreateconstraintsInput | string[]
    topicTags?: ChallengeProblemCreatetopicTagsInput | string[]
    timeLimitMs?: number
    memoryLimitMb?: number
    starterCodes?: JsonNullValueInput | InputJsonValue
    testCases?: JsonNullValueInput | InputJsonValue
    idealSolution?: string | null
    createdAt?: Date | string
  }

  export type ChallengeProblemUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    difficulty?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    examples?: JsonNullValueInput | InputJsonValue
    constraints?: ChallengeProblemUpdateconstraintsInput | string[]
    topicTags?: ChallengeProblemUpdatetopicTagsInput | string[]
    timeLimitMs?: IntFieldUpdateOperationsInput | number
    memoryLimitMb?: IntFieldUpdateOperationsInput | number
    starterCodes?: JsonNullValueInput | InputJsonValue
    testCases?: JsonNullValueInput | InputJsonValue
    idealSolution?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChallengeProblemUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    difficulty?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    examples?: JsonNullValueInput | InputJsonValue
    constraints?: ChallengeProblemUpdateconstraintsInput | string[]
    topicTags?: ChallengeProblemUpdatetopicTagsInput | string[]
    timeLimitMs?: IntFieldUpdateOperationsInput | number
    memoryLimitMb?: IntFieldUpdateOperationsInput | number
    starterCodes?: JsonNullValueInput | InputJsonValue
    testCases?: JsonNullValueInput | InputJsonValue
    idealSolution?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChallengeProblemCreateManyInput = {
    id?: string
    title: string
    slug: string
    difficulty?: string
    description: string
    examples?: JsonNullValueInput | InputJsonValue
    constraints?: ChallengeProblemCreateconstraintsInput | string[]
    topicTags?: ChallengeProblemCreatetopicTagsInput | string[]
    timeLimitMs?: number
    memoryLimitMb?: number
    starterCodes?: JsonNullValueInput | InputJsonValue
    testCases?: JsonNullValueInput | InputJsonValue
    idealSolution?: string | null
    createdAt?: Date | string
  }

  export type ChallengeProblemUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    difficulty?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    examples?: JsonNullValueInput | InputJsonValue
    constraints?: ChallengeProblemUpdateconstraintsInput | string[]
    topicTags?: ChallengeProblemUpdatetopicTagsInput | string[]
    timeLimitMs?: IntFieldUpdateOperationsInput | number
    memoryLimitMb?: IntFieldUpdateOperationsInput | number
    starterCodes?: JsonNullValueInput | InputJsonValue
    testCases?: JsonNullValueInput | InputJsonValue
    idealSolution?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChallengeProblemUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    difficulty?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    examples?: JsonNullValueInput | InputJsonValue
    constraints?: ChallengeProblemUpdateconstraintsInput | string[]
    topicTags?: ChallengeProblemUpdatetopicTagsInput | string[]
    timeLimitMs?: IntFieldUpdateOperationsInput | number
    memoryLimitMb?: IntFieldUpdateOperationsInput | number
    starterCodes?: JsonNullValueInput | InputJsonValue
    testCases?: JsonNullValueInput | InputJsonValue
    idealSolution?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChallengeSubmissionCreateInput = {
    id?: string
    userId: string
    problemId: string
    language: string
    sourceCode: string
    status?: string
    executionTimeMs?: number
    passedTestCases?: number
    totalTestCases?: number
    score?: number
    stdout?: string | null
    errorDetails?: string | null
    submittedAt?: Date | string
    match: MatchSessionCreateNestedOneWithoutSubmissionsInput
  }

  export type ChallengeSubmissionUncheckedCreateInput = {
    id?: string
    matchId: string
    userId: string
    problemId: string
    language: string
    sourceCode: string
    status?: string
    executionTimeMs?: number
    passedTestCases?: number
    totalTestCases?: number
    score?: number
    stdout?: string | null
    errorDetails?: string | null
    submittedAt?: Date | string
  }

  export type ChallengeSubmissionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    problemId?: StringFieldUpdateOperationsInput | string
    language?: StringFieldUpdateOperationsInput | string
    sourceCode?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    executionTimeMs?: IntFieldUpdateOperationsInput | number
    passedTestCases?: IntFieldUpdateOperationsInput | number
    totalTestCases?: IntFieldUpdateOperationsInput | number
    score?: IntFieldUpdateOperationsInput | number
    stdout?: NullableStringFieldUpdateOperationsInput | string | null
    errorDetails?: NullableStringFieldUpdateOperationsInput | string | null
    submittedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    match?: MatchSessionUpdateOneRequiredWithoutSubmissionsNestedInput
  }

  export type ChallengeSubmissionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    matchId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    problemId?: StringFieldUpdateOperationsInput | string
    language?: StringFieldUpdateOperationsInput | string
    sourceCode?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    executionTimeMs?: IntFieldUpdateOperationsInput | number
    passedTestCases?: IntFieldUpdateOperationsInput | number
    totalTestCases?: IntFieldUpdateOperationsInput | number
    score?: IntFieldUpdateOperationsInput | number
    stdout?: NullableStringFieldUpdateOperationsInput | string | null
    errorDetails?: NullableStringFieldUpdateOperationsInput | string | null
    submittedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChallengeSubmissionCreateManyInput = {
    id?: string
    matchId: string
    userId: string
    problemId: string
    language: string
    sourceCode: string
    status?: string
    executionTimeMs?: number
    passedTestCases?: number
    totalTestCases?: number
    score?: number
    stdout?: string | null
    errorDetails?: string | null
    submittedAt?: Date | string
  }

  export type ChallengeSubmissionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    problemId?: StringFieldUpdateOperationsInput | string
    language?: StringFieldUpdateOperationsInput | string
    sourceCode?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    executionTimeMs?: IntFieldUpdateOperationsInput | number
    passedTestCases?: IntFieldUpdateOperationsInput | number
    totalTestCases?: IntFieldUpdateOperationsInput | number
    score?: IntFieldUpdateOperationsInput | number
    stdout?: NullableStringFieldUpdateOperationsInput | string | null
    errorDetails?: NullableStringFieldUpdateOperationsInput | string | null
    submittedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChallengeSubmissionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    matchId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    problemId?: StringFieldUpdateOperationsInput | string
    language?: StringFieldUpdateOperationsInput | string
    sourceCode?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    executionTimeMs?: IntFieldUpdateOperationsInput | number
    passedTestCases?: IntFieldUpdateOperationsInput | number
    totalTestCases?: IntFieldUpdateOperationsInput | number
    score?: IntFieldUpdateOperationsInput | number
    stdout?: NullableStringFieldUpdateOperationsInput | string | null
    errorDetails?: NullableStringFieldUpdateOperationsInput | string | null
    submittedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type QuizTemplateCreateInput = {
    id?: string
    title: string
    category: string
    difficulty?: string
    timePerQuestion?: number
    totalQuestions?: number
    createdAt?: Date | string
    questions?: QuizQuestionCreateNestedManyWithoutQuizInput
    sessions?: QuizSessionCreateNestedManyWithoutQuizInput
  }

  export type QuizTemplateUncheckedCreateInput = {
    id?: string
    title: string
    category: string
    difficulty?: string
    timePerQuestion?: number
    totalQuestions?: number
    createdAt?: Date | string
    questions?: QuizQuestionUncheckedCreateNestedManyWithoutQuizInput
    sessions?: QuizSessionUncheckedCreateNestedManyWithoutQuizInput
  }

  export type QuizTemplateUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    difficulty?: StringFieldUpdateOperationsInput | string
    timePerQuestion?: IntFieldUpdateOperationsInput | number
    totalQuestions?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    questions?: QuizQuestionUpdateManyWithoutQuizNestedInput
    sessions?: QuizSessionUpdateManyWithoutQuizNestedInput
  }

  export type QuizTemplateUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    difficulty?: StringFieldUpdateOperationsInput | string
    timePerQuestion?: IntFieldUpdateOperationsInput | number
    totalQuestions?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    questions?: QuizQuestionUncheckedUpdateManyWithoutQuizNestedInput
    sessions?: QuizSessionUncheckedUpdateManyWithoutQuizNestedInput
  }

  export type QuizTemplateCreateManyInput = {
    id?: string
    title: string
    category: string
    difficulty?: string
    timePerQuestion?: number
    totalQuestions?: number
    createdAt?: Date | string
  }

  export type QuizTemplateUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    difficulty?: StringFieldUpdateOperationsInput | string
    timePerQuestion?: IntFieldUpdateOperationsInput | number
    totalQuestions?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type QuizTemplateUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    difficulty?: StringFieldUpdateOperationsInput | string
    timePerQuestion?: IntFieldUpdateOperationsInput | number
    totalQuestions?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type QuizQuestionCreateInput = {
    id?: string
    question: string
    options?: QuizQuestionCreateoptionsInput | string[]
    correctIndex: number
    explanation: string
    topic: string
    difficulty?: string
    quiz: QuizTemplateCreateNestedOneWithoutQuestionsInput
  }

  export type QuizQuestionUncheckedCreateInput = {
    id?: string
    quizId: string
    question: string
    options?: QuizQuestionCreateoptionsInput | string[]
    correctIndex: number
    explanation: string
    topic: string
    difficulty?: string
  }

  export type QuizQuestionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    question?: StringFieldUpdateOperationsInput | string
    options?: QuizQuestionUpdateoptionsInput | string[]
    correctIndex?: IntFieldUpdateOperationsInput | number
    explanation?: StringFieldUpdateOperationsInput | string
    topic?: StringFieldUpdateOperationsInput | string
    difficulty?: StringFieldUpdateOperationsInput | string
    quiz?: QuizTemplateUpdateOneRequiredWithoutQuestionsNestedInput
  }

  export type QuizQuestionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    quizId?: StringFieldUpdateOperationsInput | string
    question?: StringFieldUpdateOperationsInput | string
    options?: QuizQuestionUpdateoptionsInput | string[]
    correctIndex?: IntFieldUpdateOperationsInput | number
    explanation?: StringFieldUpdateOperationsInput | string
    topic?: StringFieldUpdateOperationsInput | string
    difficulty?: StringFieldUpdateOperationsInput | string
  }

  export type QuizQuestionCreateManyInput = {
    id?: string
    quizId: string
    question: string
    options?: QuizQuestionCreateoptionsInput | string[]
    correctIndex: number
    explanation: string
    topic: string
    difficulty?: string
  }

  export type QuizQuestionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    question?: StringFieldUpdateOperationsInput | string
    options?: QuizQuestionUpdateoptionsInput | string[]
    correctIndex?: IntFieldUpdateOperationsInput | number
    explanation?: StringFieldUpdateOperationsInput | string
    topic?: StringFieldUpdateOperationsInput | string
    difficulty?: StringFieldUpdateOperationsInput | string
  }

  export type QuizQuestionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    quizId?: StringFieldUpdateOperationsInput | string
    question?: StringFieldUpdateOperationsInput | string
    options?: QuizQuestionUpdateoptionsInput | string[]
    correctIndex?: IntFieldUpdateOperationsInput | number
    explanation?: StringFieldUpdateOperationsInput | string
    topic?: StringFieldUpdateOperationsInput | string
    difficulty?: StringFieldUpdateOperationsInput | string
  }

  export type QuizSessionCreateInput = {
    id?: string
    roomCode?: string | null
    status?: string
    currentQuestion?: number
    startedAt?: Date | string | null
    endedAt?: Date | string | null
    durationSeconds?: number
    createdAt?: Date | string
    quiz: QuizTemplateCreateNestedOneWithoutSessionsInput
    answers?: QuizAnswerCreateNestedManyWithoutSessionInput
  }

  export type QuizSessionUncheckedCreateInput = {
    id?: string
    quizId: string
    roomCode?: string | null
    status?: string
    currentQuestion?: number
    startedAt?: Date | string | null
    endedAt?: Date | string | null
    durationSeconds?: number
    createdAt?: Date | string
    answers?: QuizAnswerUncheckedCreateNestedManyWithoutSessionInput
  }

  export type QuizSessionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    roomCode?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    currentQuestion?: IntFieldUpdateOperationsInput | number
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    durationSeconds?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    quiz?: QuizTemplateUpdateOneRequiredWithoutSessionsNestedInput
    answers?: QuizAnswerUpdateManyWithoutSessionNestedInput
  }

  export type QuizSessionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    quizId?: StringFieldUpdateOperationsInput | string
    roomCode?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    currentQuestion?: IntFieldUpdateOperationsInput | number
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    durationSeconds?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    answers?: QuizAnswerUncheckedUpdateManyWithoutSessionNestedInput
  }

  export type QuizSessionCreateManyInput = {
    id?: string
    quizId: string
    roomCode?: string | null
    status?: string
    currentQuestion?: number
    startedAt?: Date | string | null
    endedAt?: Date | string | null
    durationSeconds?: number
    createdAt?: Date | string
  }

  export type QuizSessionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    roomCode?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    currentQuestion?: IntFieldUpdateOperationsInput | number
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    durationSeconds?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type QuizSessionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    quizId?: StringFieldUpdateOperationsInput | string
    roomCode?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    currentQuestion?: IntFieldUpdateOperationsInput | number
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    durationSeconds?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type QuizAnswerCreateInput = {
    id?: string
    questionId: string
    userId: string
    userName: string
    selectedIndex: number
    isCorrect?: boolean
    responseTimeMs?: number
    pointsAwarded?: number
    submittedAt?: Date | string
    session: QuizSessionCreateNestedOneWithoutAnswersInput
  }

  export type QuizAnswerUncheckedCreateInput = {
    id?: string
    sessionId: string
    questionId: string
    userId: string
    userName: string
    selectedIndex: number
    isCorrect?: boolean
    responseTimeMs?: number
    pointsAwarded?: number
    submittedAt?: Date | string
  }

  export type QuizAnswerUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    questionId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    userName?: StringFieldUpdateOperationsInput | string
    selectedIndex?: IntFieldUpdateOperationsInput | number
    isCorrect?: BoolFieldUpdateOperationsInput | boolean
    responseTimeMs?: IntFieldUpdateOperationsInput | number
    pointsAwarded?: IntFieldUpdateOperationsInput | number
    submittedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    session?: QuizSessionUpdateOneRequiredWithoutAnswersNestedInput
  }

  export type QuizAnswerUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionId?: StringFieldUpdateOperationsInput | string
    questionId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    userName?: StringFieldUpdateOperationsInput | string
    selectedIndex?: IntFieldUpdateOperationsInput | number
    isCorrect?: BoolFieldUpdateOperationsInput | boolean
    responseTimeMs?: IntFieldUpdateOperationsInput | number
    pointsAwarded?: IntFieldUpdateOperationsInput | number
    submittedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type QuizAnswerCreateManyInput = {
    id?: string
    sessionId: string
    questionId: string
    userId: string
    userName: string
    selectedIndex: number
    isCorrect?: boolean
    responseTimeMs?: number
    pointsAwarded?: number
    submittedAt?: Date | string
  }

  export type QuizAnswerUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    questionId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    userName?: StringFieldUpdateOperationsInput | string
    selectedIndex?: IntFieldUpdateOperationsInput | number
    isCorrect?: BoolFieldUpdateOperationsInput | boolean
    responseTimeMs?: IntFieldUpdateOperationsInput | number
    pointsAwarded?: IntFieldUpdateOperationsInput | number
    submittedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type QuizAnswerUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionId?: StringFieldUpdateOperationsInput | string
    questionId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    userName?: StringFieldUpdateOperationsInput | string
    selectedIndex?: IntFieldUpdateOperationsInput | number
    isCorrect?: BoolFieldUpdateOperationsInput | boolean
    responseTimeMs?: IntFieldUpdateOperationsInput | number
    pointsAwarded?: IntFieldUpdateOperationsInput | number
    submittedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FriendshipCreateInput = {
    id?: string
    requesterId: string
    recipientId: string
    status?: string
    createdAt?: Date | string
  }

  export type FriendshipUncheckedCreateInput = {
    id?: string
    requesterId: string
    recipientId: string
    status?: string
    createdAt?: Date | string
  }

  export type FriendshipUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    requesterId?: StringFieldUpdateOperationsInput | string
    recipientId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FriendshipUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    requesterId?: StringFieldUpdateOperationsInput | string
    recipientId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FriendshipCreateManyInput = {
    id?: string
    requesterId: string
    recipientId: string
    status?: string
    createdAt?: Date | string
  }

  export type FriendshipUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    requesterId?: StringFieldUpdateOperationsInput | string
    recipientId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FriendshipUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    requesterId?: StringFieldUpdateOperationsInput | string
    recipientId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StudyGroupCreateInput = {
    id?: string
    name: string
    description?: string | null
    createdBy: string
    createdAt?: Date | string
    members?: GroupMemberCreateNestedManyWithoutGroupInput
  }

  export type StudyGroupUncheckedCreateInput = {
    id?: string
    name: string
    description?: string | null
    createdBy: string
    createdAt?: Date | string
    members?: GroupMemberUncheckedCreateNestedManyWithoutGroupInput
  }

  export type StudyGroupUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    members?: GroupMemberUpdateManyWithoutGroupNestedInput
  }

  export type StudyGroupUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    members?: GroupMemberUncheckedUpdateManyWithoutGroupNestedInput
  }

  export type StudyGroupCreateManyInput = {
    id?: string
    name: string
    description?: string | null
    createdBy: string
    createdAt?: Date | string
  }

  export type StudyGroupUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StudyGroupUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GroupMemberCreateInput = {
    id?: string
    userId: string
    userName: string
    role?: string
    joinedAt?: Date | string
    group: StudyGroupCreateNestedOneWithoutMembersInput
  }

  export type GroupMemberUncheckedCreateInput = {
    id?: string
    groupId: string
    userId: string
    userName: string
    role?: string
    joinedAt?: Date | string
  }

  export type GroupMemberUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    userName?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    group?: StudyGroupUpdateOneRequiredWithoutMembersNestedInput
  }

  export type GroupMemberUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    groupId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    userName?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GroupMemberCreateManyInput = {
    id?: string
    groupId: string
    userId: string
    userName: string
    role?: string
    joinedAt?: Date | string
  }

  export type GroupMemberUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    userName?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GroupMemberUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    groupId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    userName?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChallengeRatingCreateInput = {
    id?: string
    userId: string
    userName: string
    userAvatar?: string | null
    rating?: number
    tier?: string
    battlesTotal?: number
    battlesWon?: number
    winRate?: number
    currentStreak?: number
    longestStreak?: number
    totalXP?: number
    updatedAt?: Date | string
  }

  export type ChallengeRatingUncheckedCreateInput = {
    id?: string
    userId: string
    userName: string
    userAvatar?: string | null
    rating?: number
    tier?: string
    battlesTotal?: number
    battlesWon?: number
    winRate?: number
    currentStreak?: number
    longestStreak?: number
    totalXP?: number
    updatedAt?: Date | string
  }

  export type ChallengeRatingUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    userName?: StringFieldUpdateOperationsInput | string
    userAvatar?: NullableStringFieldUpdateOperationsInput | string | null
    rating?: IntFieldUpdateOperationsInput | number
    tier?: StringFieldUpdateOperationsInput | string
    battlesTotal?: IntFieldUpdateOperationsInput | number
    battlesWon?: IntFieldUpdateOperationsInput | number
    winRate?: FloatFieldUpdateOperationsInput | number
    currentStreak?: IntFieldUpdateOperationsInput | number
    longestStreak?: IntFieldUpdateOperationsInput | number
    totalXP?: IntFieldUpdateOperationsInput | number
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChallengeRatingUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    userName?: StringFieldUpdateOperationsInput | string
    userAvatar?: NullableStringFieldUpdateOperationsInput | string | null
    rating?: IntFieldUpdateOperationsInput | number
    tier?: StringFieldUpdateOperationsInput | string
    battlesTotal?: IntFieldUpdateOperationsInput | number
    battlesWon?: IntFieldUpdateOperationsInput | number
    winRate?: FloatFieldUpdateOperationsInput | number
    currentStreak?: IntFieldUpdateOperationsInput | number
    longestStreak?: IntFieldUpdateOperationsInput | number
    totalXP?: IntFieldUpdateOperationsInput | number
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChallengeRatingCreateManyInput = {
    id?: string
    userId: string
    userName: string
    userAvatar?: string | null
    rating?: number
    tier?: string
    battlesTotal?: number
    battlesWon?: number
    winRate?: number
    currentStreak?: number
    longestStreak?: number
    totalXP?: number
    updatedAt?: Date | string
  }

  export type ChallengeRatingUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    userName?: StringFieldUpdateOperationsInput | string
    userAvatar?: NullableStringFieldUpdateOperationsInput | string | null
    rating?: IntFieldUpdateOperationsInput | number
    tier?: StringFieldUpdateOperationsInput | string
    battlesTotal?: IntFieldUpdateOperationsInput | number
    battlesWon?: IntFieldUpdateOperationsInput | number
    winRate?: FloatFieldUpdateOperationsInput | number
    currentStreak?: IntFieldUpdateOperationsInput | number
    longestStreak?: IntFieldUpdateOperationsInput | number
    totalXP?: IntFieldUpdateOperationsInput | number
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChallengeRatingUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    userName?: StringFieldUpdateOperationsInput | string
    userAvatar?: NullableStringFieldUpdateOperationsInput | string | null
    rating?: IntFieldUpdateOperationsInput | number
    tier?: StringFieldUpdateOperationsInput | string
    battlesTotal?: IntFieldUpdateOperationsInput | number
    battlesWon?: IntFieldUpdateOperationsInput | number
    winRate?: FloatFieldUpdateOperationsInput | number
    currentStreak?: IntFieldUpdateOperationsInput | number
    longestStreak?: IntFieldUpdateOperationsInput | number
    totalXP?: IntFieldUpdateOperationsInput | number
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChallengeRewardCreateInput = {
    id?: string
    userId: string
    matchId?: string | null
    rewardType: string
    amountXP?: number
    awardedAt?: Date | string
  }

  export type ChallengeRewardUncheckedCreateInput = {
    id?: string
    userId: string
    matchId?: string | null
    rewardType: string
    amountXP?: number
    awardedAt?: Date | string
  }

  export type ChallengeRewardUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    matchId?: NullableStringFieldUpdateOperationsInput | string | null
    rewardType?: StringFieldUpdateOperationsInput | string
    amountXP?: IntFieldUpdateOperationsInput | number
    awardedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChallengeRewardUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    matchId?: NullableStringFieldUpdateOperationsInput | string | null
    rewardType?: StringFieldUpdateOperationsInput | string
    amountXP?: IntFieldUpdateOperationsInput | number
    awardedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChallengeRewardCreateManyInput = {
    id?: string
    userId: string
    matchId?: string | null
    rewardType: string
    amountXP?: number
    awardedAt?: Date | string
  }

  export type ChallengeRewardUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    matchId?: NullableStringFieldUpdateOperationsInput | string | null
    rewardType?: StringFieldUpdateOperationsInput | string
    amountXP?: IntFieldUpdateOperationsInput | number
    awardedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChallengeRewardUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    matchId?: NullableStringFieldUpdateOperationsInput | string | null
    rewardType?: StringFieldUpdateOperationsInput | string
    amountXP?: IntFieldUpdateOperationsInput | number
    awardedAt?: DateTimeFieldUpdateOperationsInput | Date | string
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

  export type ChallengeParticipantListRelationFilter = {
    every?: ChallengeParticipantWhereInput
    some?: ChallengeParticipantWhereInput
    none?: ChallengeParticipantWhereInput
  }

  export type MatchSessionListRelationFilter = {
    every?: MatchSessionWhereInput
    some?: MatchSessionWhereInput
    none?: MatchSessionWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type ChallengeParticipantOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type MatchSessionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ChallengeRoomCountOrderByAggregateInput = {
    id?: SortOrder
    roomCode?: SortOrder
    title?: SortOrder
    type?: SortOrder
    visibility?: SortOrder
    difficulty?: SortOrder
    topic?: SortOrder
    language?: SortOrder
    maxParticipants?: SortOrder
    durationMinutes?: SortOrder
    status?: SortOrder
    createdBy?: SortOrder
    hostName?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ChallengeRoomAvgOrderByAggregateInput = {
    maxParticipants?: SortOrder
    durationMinutes?: SortOrder
  }

  export type ChallengeRoomMaxOrderByAggregateInput = {
    id?: SortOrder
    roomCode?: SortOrder
    title?: SortOrder
    type?: SortOrder
    visibility?: SortOrder
    difficulty?: SortOrder
    topic?: SortOrder
    language?: SortOrder
    maxParticipants?: SortOrder
    durationMinutes?: SortOrder
    status?: SortOrder
    createdBy?: SortOrder
    hostName?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ChallengeRoomMinOrderByAggregateInput = {
    id?: SortOrder
    roomCode?: SortOrder
    title?: SortOrder
    type?: SortOrder
    visibility?: SortOrder
    difficulty?: SortOrder
    topic?: SortOrder
    language?: SortOrder
    maxParticipants?: SortOrder
    durationMinutes?: SortOrder
    status?: SortOrder
    createdBy?: SortOrder
    hostName?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ChallengeRoomSumOrderByAggregateInput = {
    maxParticipants?: SortOrder
    durationMinutes?: SortOrder
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

  export type ChallengeRoomScalarRelationFilter = {
    is?: ChallengeRoomWhereInput
    isNot?: ChallengeRoomWhereInput
  }

  export type ChallengeParticipantRoomIdUserIdCompoundUniqueInput = {
    roomId: string
    userId: string
  }

  export type ChallengeParticipantCountOrderByAggregateInput = {
    id?: SortOrder
    roomId?: SortOrder
    userId?: SortOrder
    userName?: SortOrder
    userAvatar?: SortOrder
    userRating?: SortOrder
    isHost?: SortOrder
    isReady?: SortOrder
    status?: SortOrder
    joinedAt?: SortOrder
    leftAt?: SortOrder
  }

  export type ChallengeParticipantAvgOrderByAggregateInput = {
    userRating?: SortOrder
  }

  export type ChallengeParticipantMaxOrderByAggregateInput = {
    id?: SortOrder
    roomId?: SortOrder
    userId?: SortOrder
    userName?: SortOrder
    userAvatar?: SortOrder
    userRating?: SortOrder
    isHost?: SortOrder
    isReady?: SortOrder
    status?: SortOrder
    joinedAt?: SortOrder
    leftAt?: SortOrder
  }

  export type ChallengeParticipantMinOrderByAggregateInput = {
    id?: SortOrder
    roomId?: SortOrder
    userId?: SortOrder
    userName?: SortOrder
    userAvatar?: SortOrder
    userRating?: SortOrder
    isHost?: SortOrder
    isReady?: SortOrder
    status?: SortOrder
    joinedAt?: SortOrder
    leftAt?: SortOrder
  }

  export type ChallengeParticipantSumOrderByAggregateInput = {
    userRating?: SortOrder
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

  export type ChallengeRoomNullableScalarRelationFilter = {
    is?: ChallengeRoomWhereInput | null
    isNot?: ChallengeRoomWhereInput | null
  }

  export type MatchParticipantListRelationFilter = {
    every?: MatchParticipantWhereInput
    some?: MatchParticipantWhereInput
    none?: MatchParticipantWhereInput
  }

  export type ChallengeSubmissionListRelationFilter = {
    every?: ChallengeSubmissionWhereInput
    some?: ChallengeSubmissionWhereInput
    none?: ChallengeSubmissionWhereInput
  }

  export type MatchParticipantOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ChallengeSubmissionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type MatchSessionCountOrderByAggregateInput = {
    id?: SortOrder
    roomId?: SortOrder
    matchType?: SortOrder
    difficulty?: SortOrder
    status?: SortOrder
    startedAt?: SortOrder
    endedAt?: SortOrder
    durationSeconds?: SortOrder
    winnerId?: SortOrder
    resultSummary?: SortOrder
    problemId?: SortOrder
    createdAt?: SortOrder
  }

  export type MatchSessionAvgOrderByAggregateInput = {
    durationSeconds?: SortOrder
  }

  export type MatchSessionMaxOrderByAggregateInput = {
    id?: SortOrder
    roomId?: SortOrder
    matchType?: SortOrder
    difficulty?: SortOrder
    status?: SortOrder
    startedAt?: SortOrder
    endedAt?: SortOrder
    durationSeconds?: SortOrder
    winnerId?: SortOrder
    resultSummary?: SortOrder
    problemId?: SortOrder
    createdAt?: SortOrder
  }

  export type MatchSessionMinOrderByAggregateInput = {
    id?: SortOrder
    roomId?: SortOrder
    matchType?: SortOrder
    difficulty?: SortOrder
    status?: SortOrder
    startedAt?: SortOrder
    endedAt?: SortOrder
    durationSeconds?: SortOrder
    winnerId?: SortOrder
    resultSummary?: SortOrder
    problemId?: SortOrder
    createdAt?: SortOrder
  }

  export type MatchSessionSumOrderByAggregateInput = {
    durationSeconds?: SortOrder
  }

  export type MatchSessionScalarRelationFilter = {
    is?: MatchSessionWhereInput
    isNot?: MatchSessionWhereInput
  }

  export type MatchParticipantMatchIdUserIdCompoundUniqueInput = {
    matchId: string
    userId: string
  }

  export type MatchParticipantCountOrderByAggregateInput = {
    id?: SortOrder
    matchId?: SortOrder
    userId?: SortOrder
    userName?: SortOrder
    userAvatar?: SortOrder
    score?: SortOrder
    problemsSolved?: SortOrder
    passedTests?: SortOrder
    totalTests?: SortOrder
    ratingBefore?: SortOrder
    ratingAfter?: SortOrder
    xpEarned?: SortOrder
    status?: SortOrder
    submittedAt?: SortOrder
  }

  export type MatchParticipantAvgOrderByAggregateInput = {
    score?: SortOrder
    problemsSolved?: SortOrder
    passedTests?: SortOrder
    totalTests?: SortOrder
    ratingBefore?: SortOrder
    ratingAfter?: SortOrder
    xpEarned?: SortOrder
  }

  export type MatchParticipantMaxOrderByAggregateInput = {
    id?: SortOrder
    matchId?: SortOrder
    userId?: SortOrder
    userName?: SortOrder
    userAvatar?: SortOrder
    score?: SortOrder
    problemsSolved?: SortOrder
    passedTests?: SortOrder
    totalTests?: SortOrder
    ratingBefore?: SortOrder
    ratingAfter?: SortOrder
    xpEarned?: SortOrder
    status?: SortOrder
    submittedAt?: SortOrder
  }

  export type MatchParticipantMinOrderByAggregateInput = {
    id?: SortOrder
    matchId?: SortOrder
    userId?: SortOrder
    userName?: SortOrder
    userAvatar?: SortOrder
    score?: SortOrder
    problemsSolved?: SortOrder
    passedTests?: SortOrder
    totalTests?: SortOrder
    ratingBefore?: SortOrder
    ratingAfter?: SortOrder
    xpEarned?: SortOrder
    status?: SortOrder
    submittedAt?: SortOrder
  }

  export type MatchParticipantSumOrderByAggregateInput = {
    score?: SortOrder
    problemsSolved?: SortOrder
    passedTests?: SortOrder
    totalTests?: SortOrder
    ratingBefore?: SortOrder
    ratingAfter?: SortOrder
    xpEarned?: SortOrder
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

  export type StringNullableListFilter<$PrismaModel = never> = {
    equals?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    has?: string | StringFieldRefInput<$PrismaModel> | null
    hasEvery?: string[] | ListStringFieldRefInput<$PrismaModel>
    hasSome?: string[] | ListStringFieldRefInput<$PrismaModel>
    isEmpty?: boolean
  }

  export type ChallengeProblemCountOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    slug?: SortOrder
    difficulty?: SortOrder
    description?: SortOrder
    examples?: SortOrder
    constraints?: SortOrder
    topicTags?: SortOrder
    timeLimitMs?: SortOrder
    memoryLimitMb?: SortOrder
    starterCodes?: SortOrder
    testCases?: SortOrder
    idealSolution?: SortOrder
    createdAt?: SortOrder
  }

  export type ChallengeProblemAvgOrderByAggregateInput = {
    timeLimitMs?: SortOrder
    memoryLimitMb?: SortOrder
  }

  export type ChallengeProblemMaxOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    slug?: SortOrder
    difficulty?: SortOrder
    description?: SortOrder
    timeLimitMs?: SortOrder
    memoryLimitMb?: SortOrder
    idealSolution?: SortOrder
    createdAt?: SortOrder
  }

  export type ChallengeProblemMinOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    slug?: SortOrder
    difficulty?: SortOrder
    description?: SortOrder
    timeLimitMs?: SortOrder
    memoryLimitMb?: SortOrder
    idealSolution?: SortOrder
    createdAt?: SortOrder
  }

  export type ChallengeProblemSumOrderByAggregateInput = {
    timeLimitMs?: SortOrder
    memoryLimitMb?: SortOrder
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

  export type ChallengeSubmissionCountOrderByAggregateInput = {
    id?: SortOrder
    matchId?: SortOrder
    userId?: SortOrder
    problemId?: SortOrder
    language?: SortOrder
    sourceCode?: SortOrder
    status?: SortOrder
    executionTimeMs?: SortOrder
    passedTestCases?: SortOrder
    totalTestCases?: SortOrder
    score?: SortOrder
    stdout?: SortOrder
    errorDetails?: SortOrder
    submittedAt?: SortOrder
  }

  export type ChallengeSubmissionAvgOrderByAggregateInput = {
    executionTimeMs?: SortOrder
    passedTestCases?: SortOrder
    totalTestCases?: SortOrder
    score?: SortOrder
  }

  export type ChallengeSubmissionMaxOrderByAggregateInput = {
    id?: SortOrder
    matchId?: SortOrder
    userId?: SortOrder
    problemId?: SortOrder
    language?: SortOrder
    sourceCode?: SortOrder
    status?: SortOrder
    executionTimeMs?: SortOrder
    passedTestCases?: SortOrder
    totalTestCases?: SortOrder
    score?: SortOrder
    stdout?: SortOrder
    errorDetails?: SortOrder
    submittedAt?: SortOrder
  }

  export type ChallengeSubmissionMinOrderByAggregateInput = {
    id?: SortOrder
    matchId?: SortOrder
    userId?: SortOrder
    problemId?: SortOrder
    language?: SortOrder
    sourceCode?: SortOrder
    status?: SortOrder
    executionTimeMs?: SortOrder
    passedTestCases?: SortOrder
    totalTestCases?: SortOrder
    score?: SortOrder
    stdout?: SortOrder
    errorDetails?: SortOrder
    submittedAt?: SortOrder
  }

  export type ChallengeSubmissionSumOrderByAggregateInput = {
    executionTimeMs?: SortOrder
    passedTestCases?: SortOrder
    totalTestCases?: SortOrder
    score?: SortOrder
  }

  export type QuizQuestionListRelationFilter = {
    every?: QuizQuestionWhereInput
    some?: QuizQuestionWhereInput
    none?: QuizQuestionWhereInput
  }

  export type QuizSessionListRelationFilter = {
    every?: QuizSessionWhereInput
    some?: QuizSessionWhereInput
    none?: QuizSessionWhereInput
  }

  export type QuizQuestionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type QuizSessionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type QuizTemplateCountOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    category?: SortOrder
    difficulty?: SortOrder
    timePerQuestion?: SortOrder
    totalQuestions?: SortOrder
    createdAt?: SortOrder
  }

  export type QuizTemplateAvgOrderByAggregateInput = {
    timePerQuestion?: SortOrder
    totalQuestions?: SortOrder
  }

  export type QuizTemplateMaxOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    category?: SortOrder
    difficulty?: SortOrder
    timePerQuestion?: SortOrder
    totalQuestions?: SortOrder
    createdAt?: SortOrder
  }

  export type QuizTemplateMinOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    category?: SortOrder
    difficulty?: SortOrder
    timePerQuestion?: SortOrder
    totalQuestions?: SortOrder
    createdAt?: SortOrder
  }

  export type QuizTemplateSumOrderByAggregateInput = {
    timePerQuestion?: SortOrder
    totalQuestions?: SortOrder
  }

  export type QuizTemplateScalarRelationFilter = {
    is?: QuizTemplateWhereInput
    isNot?: QuizTemplateWhereInput
  }

  export type QuizQuestionCountOrderByAggregateInput = {
    id?: SortOrder
    quizId?: SortOrder
    question?: SortOrder
    options?: SortOrder
    correctIndex?: SortOrder
    explanation?: SortOrder
    topic?: SortOrder
    difficulty?: SortOrder
  }

  export type QuizQuestionAvgOrderByAggregateInput = {
    correctIndex?: SortOrder
  }

  export type QuizQuestionMaxOrderByAggregateInput = {
    id?: SortOrder
    quizId?: SortOrder
    question?: SortOrder
    correctIndex?: SortOrder
    explanation?: SortOrder
    topic?: SortOrder
    difficulty?: SortOrder
  }

  export type QuizQuestionMinOrderByAggregateInput = {
    id?: SortOrder
    quizId?: SortOrder
    question?: SortOrder
    correctIndex?: SortOrder
    explanation?: SortOrder
    topic?: SortOrder
    difficulty?: SortOrder
  }

  export type QuizQuestionSumOrderByAggregateInput = {
    correctIndex?: SortOrder
  }

  export type QuizAnswerListRelationFilter = {
    every?: QuizAnswerWhereInput
    some?: QuizAnswerWhereInput
    none?: QuizAnswerWhereInput
  }

  export type QuizAnswerOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type QuizSessionCountOrderByAggregateInput = {
    id?: SortOrder
    quizId?: SortOrder
    roomCode?: SortOrder
    status?: SortOrder
    currentQuestion?: SortOrder
    startedAt?: SortOrder
    endedAt?: SortOrder
    durationSeconds?: SortOrder
    createdAt?: SortOrder
  }

  export type QuizSessionAvgOrderByAggregateInput = {
    currentQuestion?: SortOrder
    durationSeconds?: SortOrder
  }

  export type QuizSessionMaxOrderByAggregateInput = {
    id?: SortOrder
    quizId?: SortOrder
    roomCode?: SortOrder
    status?: SortOrder
    currentQuestion?: SortOrder
    startedAt?: SortOrder
    endedAt?: SortOrder
    durationSeconds?: SortOrder
    createdAt?: SortOrder
  }

  export type QuizSessionMinOrderByAggregateInput = {
    id?: SortOrder
    quizId?: SortOrder
    roomCode?: SortOrder
    status?: SortOrder
    currentQuestion?: SortOrder
    startedAt?: SortOrder
    endedAt?: SortOrder
    durationSeconds?: SortOrder
    createdAt?: SortOrder
  }

  export type QuizSessionSumOrderByAggregateInput = {
    currentQuestion?: SortOrder
    durationSeconds?: SortOrder
  }

  export type QuizSessionScalarRelationFilter = {
    is?: QuizSessionWhereInput
    isNot?: QuizSessionWhereInput
  }

  export type QuizAnswerSessionIdQuestionIdUserIdCompoundUniqueInput = {
    sessionId: string
    questionId: string
    userId: string
  }

  export type QuizAnswerCountOrderByAggregateInput = {
    id?: SortOrder
    sessionId?: SortOrder
    questionId?: SortOrder
    userId?: SortOrder
    userName?: SortOrder
    selectedIndex?: SortOrder
    isCorrect?: SortOrder
    responseTimeMs?: SortOrder
    pointsAwarded?: SortOrder
    submittedAt?: SortOrder
  }

  export type QuizAnswerAvgOrderByAggregateInput = {
    selectedIndex?: SortOrder
    responseTimeMs?: SortOrder
    pointsAwarded?: SortOrder
  }

  export type QuizAnswerMaxOrderByAggregateInput = {
    id?: SortOrder
    sessionId?: SortOrder
    questionId?: SortOrder
    userId?: SortOrder
    userName?: SortOrder
    selectedIndex?: SortOrder
    isCorrect?: SortOrder
    responseTimeMs?: SortOrder
    pointsAwarded?: SortOrder
    submittedAt?: SortOrder
  }

  export type QuizAnswerMinOrderByAggregateInput = {
    id?: SortOrder
    sessionId?: SortOrder
    questionId?: SortOrder
    userId?: SortOrder
    userName?: SortOrder
    selectedIndex?: SortOrder
    isCorrect?: SortOrder
    responseTimeMs?: SortOrder
    pointsAwarded?: SortOrder
    submittedAt?: SortOrder
  }

  export type QuizAnswerSumOrderByAggregateInput = {
    selectedIndex?: SortOrder
    responseTimeMs?: SortOrder
    pointsAwarded?: SortOrder
  }

  export type FriendshipRequesterIdRecipientIdCompoundUniqueInput = {
    requesterId: string
    recipientId: string
  }

  export type FriendshipCountOrderByAggregateInput = {
    id?: SortOrder
    requesterId?: SortOrder
    recipientId?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
  }

  export type FriendshipMaxOrderByAggregateInput = {
    id?: SortOrder
    requesterId?: SortOrder
    recipientId?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
  }

  export type FriendshipMinOrderByAggregateInput = {
    id?: SortOrder
    requesterId?: SortOrder
    recipientId?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
  }

  export type GroupMemberListRelationFilter = {
    every?: GroupMemberWhereInput
    some?: GroupMemberWhereInput
    none?: GroupMemberWhereInput
  }

  export type GroupMemberOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type StudyGroupCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    createdBy?: SortOrder
    createdAt?: SortOrder
  }

  export type StudyGroupMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    createdBy?: SortOrder
    createdAt?: SortOrder
  }

  export type StudyGroupMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    createdBy?: SortOrder
    createdAt?: SortOrder
  }

  export type StudyGroupScalarRelationFilter = {
    is?: StudyGroupWhereInput
    isNot?: StudyGroupWhereInput
  }

  export type GroupMemberGroupIdUserIdCompoundUniqueInput = {
    groupId: string
    userId: string
  }

  export type GroupMemberCountOrderByAggregateInput = {
    id?: SortOrder
    groupId?: SortOrder
    userId?: SortOrder
    userName?: SortOrder
    role?: SortOrder
    joinedAt?: SortOrder
  }

  export type GroupMemberMaxOrderByAggregateInput = {
    id?: SortOrder
    groupId?: SortOrder
    userId?: SortOrder
    userName?: SortOrder
    role?: SortOrder
    joinedAt?: SortOrder
  }

  export type GroupMemberMinOrderByAggregateInput = {
    id?: SortOrder
    groupId?: SortOrder
    userId?: SortOrder
    userName?: SortOrder
    role?: SortOrder
    joinedAt?: SortOrder
  }

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type ChallengeRatingCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    userName?: SortOrder
    userAvatar?: SortOrder
    rating?: SortOrder
    tier?: SortOrder
    battlesTotal?: SortOrder
    battlesWon?: SortOrder
    winRate?: SortOrder
    currentStreak?: SortOrder
    longestStreak?: SortOrder
    totalXP?: SortOrder
    updatedAt?: SortOrder
  }

  export type ChallengeRatingAvgOrderByAggregateInput = {
    rating?: SortOrder
    battlesTotal?: SortOrder
    battlesWon?: SortOrder
    winRate?: SortOrder
    currentStreak?: SortOrder
    longestStreak?: SortOrder
    totalXP?: SortOrder
  }

  export type ChallengeRatingMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    userName?: SortOrder
    userAvatar?: SortOrder
    rating?: SortOrder
    tier?: SortOrder
    battlesTotal?: SortOrder
    battlesWon?: SortOrder
    winRate?: SortOrder
    currentStreak?: SortOrder
    longestStreak?: SortOrder
    totalXP?: SortOrder
    updatedAt?: SortOrder
  }

  export type ChallengeRatingMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    userName?: SortOrder
    userAvatar?: SortOrder
    rating?: SortOrder
    tier?: SortOrder
    battlesTotal?: SortOrder
    battlesWon?: SortOrder
    winRate?: SortOrder
    currentStreak?: SortOrder
    longestStreak?: SortOrder
    totalXP?: SortOrder
    updatedAt?: SortOrder
  }

  export type ChallengeRatingSumOrderByAggregateInput = {
    rating?: SortOrder
    battlesTotal?: SortOrder
    battlesWon?: SortOrder
    winRate?: SortOrder
    currentStreak?: SortOrder
    longestStreak?: SortOrder
    totalXP?: SortOrder
  }

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type ChallengeRewardUserIdMatchIdRewardTypeCompoundUniqueInput = {
    userId: string
    matchId: string
    rewardType: string
  }

  export type ChallengeRewardCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    matchId?: SortOrder
    rewardType?: SortOrder
    amountXP?: SortOrder
    awardedAt?: SortOrder
  }

  export type ChallengeRewardAvgOrderByAggregateInput = {
    amountXP?: SortOrder
  }

  export type ChallengeRewardMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    matchId?: SortOrder
    rewardType?: SortOrder
    amountXP?: SortOrder
    awardedAt?: SortOrder
  }

  export type ChallengeRewardMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    matchId?: SortOrder
    rewardType?: SortOrder
    amountXP?: SortOrder
    awardedAt?: SortOrder
  }

  export type ChallengeRewardSumOrderByAggregateInput = {
    amountXP?: SortOrder
  }

  export type ChallengeParticipantCreateNestedManyWithoutRoomInput = {
    create?: XOR<ChallengeParticipantCreateWithoutRoomInput, ChallengeParticipantUncheckedCreateWithoutRoomInput> | ChallengeParticipantCreateWithoutRoomInput[] | ChallengeParticipantUncheckedCreateWithoutRoomInput[]
    connectOrCreate?: ChallengeParticipantCreateOrConnectWithoutRoomInput | ChallengeParticipantCreateOrConnectWithoutRoomInput[]
    createMany?: ChallengeParticipantCreateManyRoomInputEnvelope
    connect?: ChallengeParticipantWhereUniqueInput | ChallengeParticipantWhereUniqueInput[]
  }

  export type MatchSessionCreateNestedManyWithoutRoomInput = {
    create?: XOR<MatchSessionCreateWithoutRoomInput, MatchSessionUncheckedCreateWithoutRoomInput> | MatchSessionCreateWithoutRoomInput[] | MatchSessionUncheckedCreateWithoutRoomInput[]
    connectOrCreate?: MatchSessionCreateOrConnectWithoutRoomInput | MatchSessionCreateOrConnectWithoutRoomInput[]
    createMany?: MatchSessionCreateManyRoomInputEnvelope
    connect?: MatchSessionWhereUniqueInput | MatchSessionWhereUniqueInput[]
  }

  export type ChallengeParticipantUncheckedCreateNestedManyWithoutRoomInput = {
    create?: XOR<ChallengeParticipantCreateWithoutRoomInput, ChallengeParticipantUncheckedCreateWithoutRoomInput> | ChallengeParticipantCreateWithoutRoomInput[] | ChallengeParticipantUncheckedCreateWithoutRoomInput[]
    connectOrCreate?: ChallengeParticipantCreateOrConnectWithoutRoomInput | ChallengeParticipantCreateOrConnectWithoutRoomInput[]
    createMany?: ChallengeParticipantCreateManyRoomInputEnvelope
    connect?: ChallengeParticipantWhereUniqueInput | ChallengeParticipantWhereUniqueInput[]
  }

  export type MatchSessionUncheckedCreateNestedManyWithoutRoomInput = {
    create?: XOR<MatchSessionCreateWithoutRoomInput, MatchSessionUncheckedCreateWithoutRoomInput> | MatchSessionCreateWithoutRoomInput[] | MatchSessionUncheckedCreateWithoutRoomInput[]
    connectOrCreate?: MatchSessionCreateOrConnectWithoutRoomInput | MatchSessionCreateOrConnectWithoutRoomInput[]
    createMany?: MatchSessionCreateManyRoomInputEnvelope
    connect?: MatchSessionWhereUniqueInput | MatchSessionWhereUniqueInput[]
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

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type ChallengeParticipantUpdateManyWithoutRoomNestedInput = {
    create?: XOR<ChallengeParticipantCreateWithoutRoomInput, ChallengeParticipantUncheckedCreateWithoutRoomInput> | ChallengeParticipantCreateWithoutRoomInput[] | ChallengeParticipantUncheckedCreateWithoutRoomInput[]
    connectOrCreate?: ChallengeParticipantCreateOrConnectWithoutRoomInput | ChallengeParticipantCreateOrConnectWithoutRoomInput[]
    upsert?: ChallengeParticipantUpsertWithWhereUniqueWithoutRoomInput | ChallengeParticipantUpsertWithWhereUniqueWithoutRoomInput[]
    createMany?: ChallengeParticipantCreateManyRoomInputEnvelope
    set?: ChallengeParticipantWhereUniqueInput | ChallengeParticipantWhereUniqueInput[]
    disconnect?: ChallengeParticipantWhereUniqueInput | ChallengeParticipantWhereUniqueInput[]
    delete?: ChallengeParticipantWhereUniqueInput | ChallengeParticipantWhereUniqueInput[]
    connect?: ChallengeParticipantWhereUniqueInput | ChallengeParticipantWhereUniqueInput[]
    update?: ChallengeParticipantUpdateWithWhereUniqueWithoutRoomInput | ChallengeParticipantUpdateWithWhereUniqueWithoutRoomInput[]
    updateMany?: ChallengeParticipantUpdateManyWithWhereWithoutRoomInput | ChallengeParticipantUpdateManyWithWhereWithoutRoomInput[]
    deleteMany?: ChallengeParticipantScalarWhereInput | ChallengeParticipantScalarWhereInput[]
  }

  export type MatchSessionUpdateManyWithoutRoomNestedInput = {
    create?: XOR<MatchSessionCreateWithoutRoomInput, MatchSessionUncheckedCreateWithoutRoomInput> | MatchSessionCreateWithoutRoomInput[] | MatchSessionUncheckedCreateWithoutRoomInput[]
    connectOrCreate?: MatchSessionCreateOrConnectWithoutRoomInput | MatchSessionCreateOrConnectWithoutRoomInput[]
    upsert?: MatchSessionUpsertWithWhereUniqueWithoutRoomInput | MatchSessionUpsertWithWhereUniqueWithoutRoomInput[]
    createMany?: MatchSessionCreateManyRoomInputEnvelope
    set?: MatchSessionWhereUniqueInput | MatchSessionWhereUniqueInput[]
    disconnect?: MatchSessionWhereUniqueInput | MatchSessionWhereUniqueInput[]
    delete?: MatchSessionWhereUniqueInput | MatchSessionWhereUniqueInput[]
    connect?: MatchSessionWhereUniqueInput | MatchSessionWhereUniqueInput[]
    update?: MatchSessionUpdateWithWhereUniqueWithoutRoomInput | MatchSessionUpdateWithWhereUniqueWithoutRoomInput[]
    updateMany?: MatchSessionUpdateManyWithWhereWithoutRoomInput | MatchSessionUpdateManyWithWhereWithoutRoomInput[]
    deleteMany?: MatchSessionScalarWhereInput | MatchSessionScalarWhereInput[]
  }

  export type ChallengeParticipantUncheckedUpdateManyWithoutRoomNestedInput = {
    create?: XOR<ChallengeParticipantCreateWithoutRoomInput, ChallengeParticipantUncheckedCreateWithoutRoomInput> | ChallengeParticipantCreateWithoutRoomInput[] | ChallengeParticipantUncheckedCreateWithoutRoomInput[]
    connectOrCreate?: ChallengeParticipantCreateOrConnectWithoutRoomInput | ChallengeParticipantCreateOrConnectWithoutRoomInput[]
    upsert?: ChallengeParticipantUpsertWithWhereUniqueWithoutRoomInput | ChallengeParticipantUpsertWithWhereUniqueWithoutRoomInput[]
    createMany?: ChallengeParticipantCreateManyRoomInputEnvelope
    set?: ChallengeParticipantWhereUniqueInput | ChallengeParticipantWhereUniqueInput[]
    disconnect?: ChallengeParticipantWhereUniqueInput | ChallengeParticipantWhereUniqueInput[]
    delete?: ChallengeParticipantWhereUniqueInput | ChallengeParticipantWhereUniqueInput[]
    connect?: ChallengeParticipantWhereUniqueInput | ChallengeParticipantWhereUniqueInput[]
    update?: ChallengeParticipantUpdateWithWhereUniqueWithoutRoomInput | ChallengeParticipantUpdateWithWhereUniqueWithoutRoomInput[]
    updateMany?: ChallengeParticipantUpdateManyWithWhereWithoutRoomInput | ChallengeParticipantUpdateManyWithWhereWithoutRoomInput[]
    deleteMany?: ChallengeParticipantScalarWhereInput | ChallengeParticipantScalarWhereInput[]
  }

  export type MatchSessionUncheckedUpdateManyWithoutRoomNestedInput = {
    create?: XOR<MatchSessionCreateWithoutRoomInput, MatchSessionUncheckedCreateWithoutRoomInput> | MatchSessionCreateWithoutRoomInput[] | MatchSessionUncheckedCreateWithoutRoomInput[]
    connectOrCreate?: MatchSessionCreateOrConnectWithoutRoomInput | MatchSessionCreateOrConnectWithoutRoomInput[]
    upsert?: MatchSessionUpsertWithWhereUniqueWithoutRoomInput | MatchSessionUpsertWithWhereUniqueWithoutRoomInput[]
    createMany?: MatchSessionCreateManyRoomInputEnvelope
    set?: MatchSessionWhereUniqueInput | MatchSessionWhereUniqueInput[]
    disconnect?: MatchSessionWhereUniqueInput | MatchSessionWhereUniqueInput[]
    delete?: MatchSessionWhereUniqueInput | MatchSessionWhereUniqueInput[]
    connect?: MatchSessionWhereUniqueInput | MatchSessionWhereUniqueInput[]
    update?: MatchSessionUpdateWithWhereUniqueWithoutRoomInput | MatchSessionUpdateWithWhereUniqueWithoutRoomInput[]
    updateMany?: MatchSessionUpdateManyWithWhereWithoutRoomInput | MatchSessionUpdateManyWithWhereWithoutRoomInput[]
    deleteMany?: MatchSessionScalarWhereInput | MatchSessionScalarWhereInput[]
  }

  export type ChallengeRoomCreateNestedOneWithoutParticipantsInput = {
    create?: XOR<ChallengeRoomCreateWithoutParticipantsInput, ChallengeRoomUncheckedCreateWithoutParticipantsInput>
    connectOrCreate?: ChallengeRoomCreateOrConnectWithoutParticipantsInput
    connect?: ChallengeRoomWhereUniqueInput
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type ChallengeRoomUpdateOneRequiredWithoutParticipantsNestedInput = {
    create?: XOR<ChallengeRoomCreateWithoutParticipantsInput, ChallengeRoomUncheckedCreateWithoutParticipantsInput>
    connectOrCreate?: ChallengeRoomCreateOrConnectWithoutParticipantsInput
    upsert?: ChallengeRoomUpsertWithoutParticipantsInput
    connect?: ChallengeRoomWhereUniqueInput
    update?: XOR<XOR<ChallengeRoomUpdateToOneWithWhereWithoutParticipantsInput, ChallengeRoomUpdateWithoutParticipantsInput>, ChallengeRoomUncheckedUpdateWithoutParticipantsInput>
  }

  export type ChallengeRoomCreateNestedOneWithoutMatchesInput = {
    create?: XOR<ChallengeRoomCreateWithoutMatchesInput, ChallengeRoomUncheckedCreateWithoutMatchesInput>
    connectOrCreate?: ChallengeRoomCreateOrConnectWithoutMatchesInput
    connect?: ChallengeRoomWhereUniqueInput
  }

  export type MatchParticipantCreateNestedManyWithoutMatchInput = {
    create?: XOR<MatchParticipantCreateWithoutMatchInput, MatchParticipantUncheckedCreateWithoutMatchInput> | MatchParticipantCreateWithoutMatchInput[] | MatchParticipantUncheckedCreateWithoutMatchInput[]
    connectOrCreate?: MatchParticipantCreateOrConnectWithoutMatchInput | MatchParticipantCreateOrConnectWithoutMatchInput[]
    createMany?: MatchParticipantCreateManyMatchInputEnvelope
    connect?: MatchParticipantWhereUniqueInput | MatchParticipantWhereUniqueInput[]
  }

  export type ChallengeSubmissionCreateNestedManyWithoutMatchInput = {
    create?: XOR<ChallengeSubmissionCreateWithoutMatchInput, ChallengeSubmissionUncheckedCreateWithoutMatchInput> | ChallengeSubmissionCreateWithoutMatchInput[] | ChallengeSubmissionUncheckedCreateWithoutMatchInput[]
    connectOrCreate?: ChallengeSubmissionCreateOrConnectWithoutMatchInput | ChallengeSubmissionCreateOrConnectWithoutMatchInput[]
    createMany?: ChallengeSubmissionCreateManyMatchInputEnvelope
    connect?: ChallengeSubmissionWhereUniqueInput | ChallengeSubmissionWhereUniqueInput[]
  }

  export type MatchParticipantUncheckedCreateNestedManyWithoutMatchInput = {
    create?: XOR<MatchParticipantCreateWithoutMatchInput, MatchParticipantUncheckedCreateWithoutMatchInput> | MatchParticipantCreateWithoutMatchInput[] | MatchParticipantUncheckedCreateWithoutMatchInput[]
    connectOrCreate?: MatchParticipantCreateOrConnectWithoutMatchInput | MatchParticipantCreateOrConnectWithoutMatchInput[]
    createMany?: MatchParticipantCreateManyMatchInputEnvelope
    connect?: MatchParticipantWhereUniqueInput | MatchParticipantWhereUniqueInput[]
  }

  export type ChallengeSubmissionUncheckedCreateNestedManyWithoutMatchInput = {
    create?: XOR<ChallengeSubmissionCreateWithoutMatchInput, ChallengeSubmissionUncheckedCreateWithoutMatchInput> | ChallengeSubmissionCreateWithoutMatchInput[] | ChallengeSubmissionUncheckedCreateWithoutMatchInput[]
    connectOrCreate?: ChallengeSubmissionCreateOrConnectWithoutMatchInput | ChallengeSubmissionCreateOrConnectWithoutMatchInput[]
    createMany?: ChallengeSubmissionCreateManyMatchInputEnvelope
    connect?: ChallengeSubmissionWhereUniqueInput | ChallengeSubmissionWhereUniqueInput[]
  }

  export type ChallengeRoomUpdateOneWithoutMatchesNestedInput = {
    create?: XOR<ChallengeRoomCreateWithoutMatchesInput, ChallengeRoomUncheckedCreateWithoutMatchesInput>
    connectOrCreate?: ChallengeRoomCreateOrConnectWithoutMatchesInput
    upsert?: ChallengeRoomUpsertWithoutMatchesInput
    disconnect?: ChallengeRoomWhereInput | boolean
    delete?: ChallengeRoomWhereInput | boolean
    connect?: ChallengeRoomWhereUniqueInput
    update?: XOR<XOR<ChallengeRoomUpdateToOneWithWhereWithoutMatchesInput, ChallengeRoomUpdateWithoutMatchesInput>, ChallengeRoomUncheckedUpdateWithoutMatchesInput>
  }

  export type MatchParticipantUpdateManyWithoutMatchNestedInput = {
    create?: XOR<MatchParticipantCreateWithoutMatchInput, MatchParticipantUncheckedCreateWithoutMatchInput> | MatchParticipantCreateWithoutMatchInput[] | MatchParticipantUncheckedCreateWithoutMatchInput[]
    connectOrCreate?: MatchParticipantCreateOrConnectWithoutMatchInput | MatchParticipantCreateOrConnectWithoutMatchInput[]
    upsert?: MatchParticipantUpsertWithWhereUniqueWithoutMatchInput | MatchParticipantUpsertWithWhereUniqueWithoutMatchInput[]
    createMany?: MatchParticipantCreateManyMatchInputEnvelope
    set?: MatchParticipantWhereUniqueInput | MatchParticipantWhereUniqueInput[]
    disconnect?: MatchParticipantWhereUniqueInput | MatchParticipantWhereUniqueInput[]
    delete?: MatchParticipantWhereUniqueInput | MatchParticipantWhereUniqueInput[]
    connect?: MatchParticipantWhereUniqueInput | MatchParticipantWhereUniqueInput[]
    update?: MatchParticipantUpdateWithWhereUniqueWithoutMatchInput | MatchParticipantUpdateWithWhereUniqueWithoutMatchInput[]
    updateMany?: MatchParticipantUpdateManyWithWhereWithoutMatchInput | MatchParticipantUpdateManyWithWhereWithoutMatchInput[]
    deleteMany?: MatchParticipantScalarWhereInput | MatchParticipantScalarWhereInput[]
  }

  export type ChallengeSubmissionUpdateManyWithoutMatchNestedInput = {
    create?: XOR<ChallengeSubmissionCreateWithoutMatchInput, ChallengeSubmissionUncheckedCreateWithoutMatchInput> | ChallengeSubmissionCreateWithoutMatchInput[] | ChallengeSubmissionUncheckedCreateWithoutMatchInput[]
    connectOrCreate?: ChallengeSubmissionCreateOrConnectWithoutMatchInput | ChallengeSubmissionCreateOrConnectWithoutMatchInput[]
    upsert?: ChallengeSubmissionUpsertWithWhereUniqueWithoutMatchInput | ChallengeSubmissionUpsertWithWhereUniqueWithoutMatchInput[]
    createMany?: ChallengeSubmissionCreateManyMatchInputEnvelope
    set?: ChallengeSubmissionWhereUniqueInput | ChallengeSubmissionWhereUniqueInput[]
    disconnect?: ChallengeSubmissionWhereUniqueInput | ChallengeSubmissionWhereUniqueInput[]
    delete?: ChallengeSubmissionWhereUniqueInput | ChallengeSubmissionWhereUniqueInput[]
    connect?: ChallengeSubmissionWhereUniqueInput | ChallengeSubmissionWhereUniqueInput[]
    update?: ChallengeSubmissionUpdateWithWhereUniqueWithoutMatchInput | ChallengeSubmissionUpdateWithWhereUniqueWithoutMatchInput[]
    updateMany?: ChallengeSubmissionUpdateManyWithWhereWithoutMatchInput | ChallengeSubmissionUpdateManyWithWhereWithoutMatchInput[]
    deleteMany?: ChallengeSubmissionScalarWhereInput | ChallengeSubmissionScalarWhereInput[]
  }

  export type MatchParticipantUncheckedUpdateManyWithoutMatchNestedInput = {
    create?: XOR<MatchParticipantCreateWithoutMatchInput, MatchParticipantUncheckedCreateWithoutMatchInput> | MatchParticipantCreateWithoutMatchInput[] | MatchParticipantUncheckedCreateWithoutMatchInput[]
    connectOrCreate?: MatchParticipantCreateOrConnectWithoutMatchInput | MatchParticipantCreateOrConnectWithoutMatchInput[]
    upsert?: MatchParticipantUpsertWithWhereUniqueWithoutMatchInput | MatchParticipantUpsertWithWhereUniqueWithoutMatchInput[]
    createMany?: MatchParticipantCreateManyMatchInputEnvelope
    set?: MatchParticipantWhereUniqueInput | MatchParticipantWhereUniqueInput[]
    disconnect?: MatchParticipantWhereUniqueInput | MatchParticipantWhereUniqueInput[]
    delete?: MatchParticipantWhereUniqueInput | MatchParticipantWhereUniqueInput[]
    connect?: MatchParticipantWhereUniqueInput | MatchParticipantWhereUniqueInput[]
    update?: MatchParticipantUpdateWithWhereUniqueWithoutMatchInput | MatchParticipantUpdateWithWhereUniqueWithoutMatchInput[]
    updateMany?: MatchParticipantUpdateManyWithWhereWithoutMatchInput | MatchParticipantUpdateManyWithWhereWithoutMatchInput[]
    deleteMany?: MatchParticipantScalarWhereInput | MatchParticipantScalarWhereInput[]
  }

  export type ChallengeSubmissionUncheckedUpdateManyWithoutMatchNestedInput = {
    create?: XOR<ChallengeSubmissionCreateWithoutMatchInput, ChallengeSubmissionUncheckedCreateWithoutMatchInput> | ChallengeSubmissionCreateWithoutMatchInput[] | ChallengeSubmissionUncheckedCreateWithoutMatchInput[]
    connectOrCreate?: ChallengeSubmissionCreateOrConnectWithoutMatchInput | ChallengeSubmissionCreateOrConnectWithoutMatchInput[]
    upsert?: ChallengeSubmissionUpsertWithWhereUniqueWithoutMatchInput | ChallengeSubmissionUpsertWithWhereUniqueWithoutMatchInput[]
    createMany?: ChallengeSubmissionCreateManyMatchInputEnvelope
    set?: ChallengeSubmissionWhereUniqueInput | ChallengeSubmissionWhereUniqueInput[]
    disconnect?: ChallengeSubmissionWhereUniqueInput | ChallengeSubmissionWhereUniqueInput[]
    delete?: ChallengeSubmissionWhereUniqueInput | ChallengeSubmissionWhereUniqueInput[]
    connect?: ChallengeSubmissionWhereUniqueInput | ChallengeSubmissionWhereUniqueInput[]
    update?: ChallengeSubmissionUpdateWithWhereUniqueWithoutMatchInput | ChallengeSubmissionUpdateWithWhereUniqueWithoutMatchInput[]
    updateMany?: ChallengeSubmissionUpdateManyWithWhereWithoutMatchInput | ChallengeSubmissionUpdateManyWithWhereWithoutMatchInput[]
    deleteMany?: ChallengeSubmissionScalarWhereInput | ChallengeSubmissionScalarWhereInput[]
  }

  export type MatchSessionCreateNestedOneWithoutParticipantsInput = {
    create?: XOR<MatchSessionCreateWithoutParticipantsInput, MatchSessionUncheckedCreateWithoutParticipantsInput>
    connectOrCreate?: MatchSessionCreateOrConnectWithoutParticipantsInput
    connect?: MatchSessionWhereUniqueInput
  }

  export type MatchSessionUpdateOneRequiredWithoutParticipantsNestedInput = {
    create?: XOR<MatchSessionCreateWithoutParticipantsInput, MatchSessionUncheckedCreateWithoutParticipantsInput>
    connectOrCreate?: MatchSessionCreateOrConnectWithoutParticipantsInput
    upsert?: MatchSessionUpsertWithoutParticipantsInput
    connect?: MatchSessionWhereUniqueInput
    update?: XOR<XOR<MatchSessionUpdateToOneWithWhereWithoutParticipantsInput, MatchSessionUpdateWithoutParticipantsInput>, MatchSessionUncheckedUpdateWithoutParticipantsInput>
  }

  export type ChallengeProblemCreateconstraintsInput = {
    set: string[]
  }

  export type ChallengeProblemCreatetopicTagsInput = {
    set: string[]
  }

  export type ChallengeProblemUpdateconstraintsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type ChallengeProblemUpdatetopicTagsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type MatchSessionCreateNestedOneWithoutSubmissionsInput = {
    create?: XOR<MatchSessionCreateWithoutSubmissionsInput, MatchSessionUncheckedCreateWithoutSubmissionsInput>
    connectOrCreate?: MatchSessionCreateOrConnectWithoutSubmissionsInput
    connect?: MatchSessionWhereUniqueInput
  }

  export type MatchSessionUpdateOneRequiredWithoutSubmissionsNestedInput = {
    create?: XOR<MatchSessionCreateWithoutSubmissionsInput, MatchSessionUncheckedCreateWithoutSubmissionsInput>
    connectOrCreate?: MatchSessionCreateOrConnectWithoutSubmissionsInput
    upsert?: MatchSessionUpsertWithoutSubmissionsInput
    connect?: MatchSessionWhereUniqueInput
    update?: XOR<XOR<MatchSessionUpdateToOneWithWhereWithoutSubmissionsInput, MatchSessionUpdateWithoutSubmissionsInput>, MatchSessionUncheckedUpdateWithoutSubmissionsInput>
  }

  export type QuizQuestionCreateNestedManyWithoutQuizInput = {
    create?: XOR<QuizQuestionCreateWithoutQuizInput, QuizQuestionUncheckedCreateWithoutQuizInput> | QuizQuestionCreateWithoutQuizInput[] | QuizQuestionUncheckedCreateWithoutQuizInput[]
    connectOrCreate?: QuizQuestionCreateOrConnectWithoutQuizInput | QuizQuestionCreateOrConnectWithoutQuizInput[]
    createMany?: QuizQuestionCreateManyQuizInputEnvelope
    connect?: QuizQuestionWhereUniqueInput | QuizQuestionWhereUniqueInput[]
  }

  export type QuizSessionCreateNestedManyWithoutQuizInput = {
    create?: XOR<QuizSessionCreateWithoutQuizInput, QuizSessionUncheckedCreateWithoutQuizInput> | QuizSessionCreateWithoutQuizInput[] | QuizSessionUncheckedCreateWithoutQuizInput[]
    connectOrCreate?: QuizSessionCreateOrConnectWithoutQuizInput | QuizSessionCreateOrConnectWithoutQuizInput[]
    createMany?: QuizSessionCreateManyQuizInputEnvelope
    connect?: QuizSessionWhereUniqueInput | QuizSessionWhereUniqueInput[]
  }

  export type QuizQuestionUncheckedCreateNestedManyWithoutQuizInput = {
    create?: XOR<QuizQuestionCreateWithoutQuizInput, QuizQuestionUncheckedCreateWithoutQuizInput> | QuizQuestionCreateWithoutQuizInput[] | QuizQuestionUncheckedCreateWithoutQuizInput[]
    connectOrCreate?: QuizQuestionCreateOrConnectWithoutQuizInput | QuizQuestionCreateOrConnectWithoutQuizInput[]
    createMany?: QuizQuestionCreateManyQuizInputEnvelope
    connect?: QuizQuestionWhereUniqueInput | QuizQuestionWhereUniqueInput[]
  }

  export type QuizSessionUncheckedCreateNestedManyWithoutQuizInput = {
    create?: XOR<QuizSessionCreateWithoutQuizInput, QuizSessionUncheckedCreateWithoutQuizInput> | QuizSessionCreateWithoutQuizInput[] | QuizSessionUncheckedCreateWithoutQuizInput[]
    connectOrCreate?: QuizSessionCreateOrConnectWithoutQuizInput | QuizSessionCreateOrConnectWithoutQuizInput[]
    createMany?: QuizSessionCreateManyQuizInputEnvelope
    connect?: QuizSessionWhereUniqueInput | QuizSessionWhereUniqueInput[]
  }

  export type QuizQuestionUpdateManyWithoutQuizNestedInput = {
    create?: XOR<QuizQuestionCreateWithoutQuizInput, QuizQuestionUncheckedCreateWithoutQuizInput> | QuizQuestionCreateWithoutQuizInput[] | QuizQuestionUncheckedCreateWithoutQuizInput[]
    connectOrCreate?: QuizQuestionCreateOrConnectWithoutQuizInput | QuizQuestionCreateOrConnectWithoutQuizInput[]
    upsert?: QuizQuestionUpsertWithWhereUniqueWithoutQuizInput | QuizQuestionUpsertWithWhereUniqueWithoutQuizInput[]
    createMany?: QuizQuestionCreateManyQuizInputEnvelope
    set?: QuizQuestionWhereUniqueInput | QuizQuestionWhereUniqueInput[]
    disconnect?: QuizQuestionWhereUniqueInput | QuizQuestionWhereUniqueInput[]
    delete?: QuizQuestionWhereUniqueInput | QuizQuestionWhereUniqueInput[]
    connect?: QuizQuestionWhereUniqueInput | QuizQuestionWhereUniqueInput[]
    update?: QuizQuestionUpdateWithWhereUniqueWithoutQuizInput | QuizQuestionUpdateWithWhereUniqueWithoutQuizInput[]
    updateMany?: QuizQuestionUpdateManyWithWhereWithoutQuizInput | QuizQuestionUpdateManyWithWhereWithoutQuizInput[]
    deleteMany?: QuizQuestionScalarWhereInput | QuizQuestionScalarWhereInput[]
  }

  export type QuizSessionUpdateManyWithoutQuizNestedInput = {
    create?: XOR<QuizSessionCreateWithoutQuizInput, QuizSessionUncheckedCreateWithoutQuizInput> | QuizSessionCreateWithoutQuizInput[] | QuizSessionUncheckedCreateWithoutQuizInput[]
    connectOrCreate?: QuizSessionCreateOrConnectWithoutQuizInput | QuizSessionCreateOrConnectWithoutQuizInput[]
    upsert?: QuizSessionUpsertWithWhereUniqueWithoutQuizInput | QuizSessionUpsertWithWhereUniqueWithoutQuizInput[]
    createMany?: QuizSessionCreateManyQuizInputEnvelope
    set?: QuizSessionWhereUniqueInput | QuizSessionWhereUniqueInput[]
    disconnect?: QuizSessionWhereUniqueInput | QuizSessionWhereUniqueInput[]
    delete?: QuizSessionWhereUniqueInput | QuizSessionWhereUniqueInput[]
    connect?: QuizSessionWhereUniqueInput | QuizSessionWhereUniqueInput[]
    update?: QuizSessionUpdateWithWhereUniqueWithoutQuizInput | QuizSessionUpdateWithWhereUniqueWithoutQuizInput[]
    updateMany?: QuizSessionUpdateManyWithWhereWithoutQuizInput | QuizSessionUpdateManyWithWhereWithoutQuizInput[]
    deleteMany?: QuizSessionScalarWhereInput | QuizSessionScalarWhereInput[]
  }

  export type QuizQuestionUncheckedUpdateManyWithoutQuizNestedInput = {
    create?: XOR<QuizQuestionCreateWithoutQuizInput, QuizQuestionUncheckedCreateWithoutQuizInput> | QuizQuestionCreateWithoutQuizInput[] | QuizQuestionUncheckedCreateWithoutQuizInput[]
    connectOrCreate?: QuizQuestionCreateOrConnectWithoutQuizInput | QuizQuestionCreateOrConnectWithoutQuizInput[]
    upsert?: QuizQuestionUpsertWithWhereUniqueWithoutQuizInput | QuizQuestionUpsertWithWhereUniqueWithoutQuizInput[]
    createMany?: QuizQuestionCreateManyQuizInputEnvelope
    set?: QuizQuestionWhereUniqueInput | QuizQuestionWhereUniqueInput[]
    disconnect?: QuizQuestionWhereUniqueInput | QuizQuestionWhereUniqueInput[]
    delete?: QuizQuestionWhereUniqueInput | QuizQuestionWhereUniqueInput[]
    connect?: QuizQuestionWhereUniqueInput | QuizQuestionWhereUniqueInput[]
    update?: QuizQuestionUpdateWithWhereUniqueWithoutQuizInput | QuizQuestionUpdateWithWhereUniqueWithoutQuizInput[]
    updateMany?: QuizQuestionUpdateManyWithWhereWithoutQuizInput | QuizQuestionUpdateManyWithWhereWithoutQuizInput[]
    deleteMany?: QuizQuestionScalarWhereInput | QuizQuestionScalarWhereInput[]
  }

  export type QuizSessionUncheckedUpdateManyWithoutQuizNestedInput = {
    create?: XOR<QuizSessionCreateWithoutQuizInput, QuizSessionUncheckedCreateWithoutQuizInput> | QuizSessionCreateWithoutQuizInput[] | QuizSessionUncheckedCreateWithoutQuizInput[]
    connectOrCreate?: QuizSessionCreateOrConnectWithoutQuizInput | QuizSessionCreateOrConnectWithoutQuizInput[]
    upsert?: QuizSessionUpsertWithWhereUniqueWithoutQuizInput | QuizSessionUpsertWithWhereUniqueWithoutQuizInput[]
    createMany?: QuizSessionCreateManyQuizInputEnvelope
    set?: QuizSessionWhereUniqueInput | QuizSessionWhereUniqueInput[]
    disconnect?: QuizSessionWhereUniqueInput | QuizSessionWhereUniqueInput[]
    delete?: QuizSessionWhereUniqueInput | QuizSessionWhereUniqueInput[]
    connect?: QuizSessionWhereUniqueInput | QuizSessionWhereUniqueInput[]
    update?: QuizSessionUpdateWithWhereUniqueWithoutQuizInput | QuizSessionUpdateWithWhereUniqueWithoutQuizInput[]
    updateMany?: QuizSessionUpdateManyWithWhereWithoutQuizInput | QuizSessionUpdateManyWithWhereWithoutQuizInput[]
    deleteMany?: QuizSessionScalarWhereInput | QuizSessionScalarWhereInput[]
  }

  export type QuizQuestionCreateoptionsInput = {
    set: string[]
  }

  export type QuizTemplateCreateNestedOneWithoutQuestionsInput = {
    create?: XOR<QuizTemplateCreateWithoutQuestionsInput, QuizTemplateUncheckedCreateWithoutQuestionsInput>
    connectOrCreate?: QuizTemplateCreateOrConnectWithoutQuestionsInput
    connect?: QuizTemplateWhereUniqueInput
  }

  export type QuizQuestionUpdateoptionsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type QuizTemplateUpdateOneRequiredWithoutQuestionsNestedInput = {
    create?: XOR<QuizTemplateCreateWithoutQuestionsInput, QuizTemplateUncheckedCreateWithoutQuestionsInput>
    connectOrCreate?: QuizTemplateCreateOrConnectWithoutQuestionsInput
    upsert?: QuizTemplateUpsertWithoutQuestionsInput
    connect?: QuizTemplateWhereUniqueInput
    update?: XOR<XOR<QuizTemplateUpdateToOneWithWhereWithoutQuestionsInput, QuizTemplateUpdateWithoutQuestionsInput>, QuizTemplateUncheckedUpdateWithoutQuestionsInput>
  }

  export type QuizTemplateCreateNestedOneWithoutSessionsInput = {
    create?: XOR<QuizTemplateCreateWithoutSessionsInput, QuizTemplateUncheckedCreateWithoutSessionsInput>
    connectOrCreate?: QuizTemplateCreateOrConnectWithoutSessionsInput
    connect?: QuizTemplateWhereUniqueInput
  }

  export type QuizAnswerCreateNestedManyWithoutSessionInput = {
    create?: XOR<QuizAnswerCreateWithoutSessionInput, QuizAnswerUncheckedCreateWithoutSessionInput> | QuizAnswerCreateWithoutSessionInput[] | QuizAnswerUncheckedCreateWithoutSessionInput[]
    connectOrCreate?: QuizAnswerCreateOrConnectWithoutSessionInput | QuizAnswerCreateOrConnectWithoutSessionInput[]
    createMany?: QuizAnswerCreateManySessionInputEnvelope
    connect?: QuizAnswerWhereUniqueInput | QuizAnswerWhereUniqueInput[]
  }

  export type QuizAnswerUncheckedCreateNestedManyWithoutSessionInput = {
    create?: XOR<QuizAnswerCreateWithoutSessionInput, QuizAnswerUncheckedCreateWithoutSessionInput> | QuizAnswerCreateWithoutSessionInput[] | QuizAnswerUncheckedCreateWithoutSessionInput[]
    connectOrCreate?: QuizAnswerCreateOrConnectWithoutSessionInput | QuizAnswerCreateOrConnectWithoutSessionInput[]
    createMany?: QuizAnswerCreateManySessionInputEnvelope
    connect?: QuizAnswerWhereUniqueInput | QuizAnswerWhereUniqueInput[]
  }

  export type QuizTemplateUpdateOneRequiredWithoutSessionsNestedInput = {
    create?: XOR<QuizTemplateCreateWithoutSessionsInput, QuizTemplateUncheckedCreateWithoutSessionsInput>
    connectOrCreate?: QuizTemplateCreateOrConnectWithoutSessionsInput
    upsert?: QuizTemplateUpsertWithoutSessionsInput
    connect?: QuizTemplateWhereUniqueInput
    update?: XOR<XOR<QuizTemplateUpdateToOneWithWhereWithoutSessionsInput, QuizTemplateUpdateWithoutSessionsInput>, QuizTemplateUncheckedUpdateWithoutSessionsInput>
  }

  export type QuizAnswerUpdateManyWithoutSessionNestedInput = {
    create?: XOR<QuizAnswerCreateWithoutSessionInput, QuizAnswerUncheckedCreateWithoutSessionInput> | QuizAnswerCreateWithoutSessionInput[] | QuizAnswerUncheckedCreateWithoutSessionInput[]
    connectOrCreate?: QuizAnswerCreateOrConnectWithoutSessionInput | QuizAnswerCreateOrConnectWithoutSessionInput[]
    upsert?: QuizAnswerUpsertWithWhereUniqueWithoutSessionInput | QuizAnswerUpsertWithWhereUniqueWithoutSessionInput[]
    createMany?: QuizAnswerCreateManySessionInputEnvelope
    set?: QuizAnswerWhereUniqueInput | QuizAnswerWhereUniqueInput[]
    disconnect?: QuizAnswerWhereUniqueInput | QuizAnswerWhereUniqueInput[]
    delete?: QuizAnswerWhereUniqueInput | QuizAnswerWhereUniqueInput[]
    connect?: QuizAnswerWhereUniqueInput | QuizAnswerWhereUniqueInput[]
    update?: QuizAnswerUpdateWithWhereUniqueWithoutSessionInput | QuizAnswerUpdateWithWhereUniqueWithoutSessionInput[]
    updateMany?: QuizAnswerUpdateManyWithWhereWithoutSessionInput | QuizAnswerUpdateManyWithWhereWithoutSessionInput[]
    deleteMany?: QuizAnswerScalarWhereInput | QuizAnswerScalarWhereInput[]
  }

  export type QuizAnswerUncheckedUpdateManyWithoutSessionNestedInput = {
    create?: XOR<QuizAnswerCreateWithoutSessionInput, QuizAnswerUncheckedCreateWithoutSessionInput> | QuizAnswerCreateWithoutSessionInput[] | QuizAnswerUncheckedCreateWithoutSessionInput[]
    connectOrCreate?: QuizAnswerCreateOrConnectWithoutSessionInput | QuizAnswerCreateOrConnectWithoutSessionInput[]
    upsert?: QuizAnswerUpsertWithWhereUniqueWithoutSessionInput | QuizAnswerUpsertWithWhereUniqueWithoutSessionInput[]
    createMany?: QuizAnswerCreateManySessionInputEnvelope
    set?: QuizAnswerWhereUniqueInput | QuizAnswerWhereUniqueInput[]
    disconnect?: QuizAnswerWhereUniqueInput | QuizAnswerWhereUniqueInput[]
    delete?: QuizAnswerWhereUniqueInput | QuizAnswerWhereUniqueInput[]
    connect?: QuizAnswerWhereUniqueInput | QuizAnswerWhereUniqueInput[]
    update?: QuizAnswerUpdateWithWhereUniqueWithoutSessionInput | QuizAnswerUpdateWithWhereUniqueWithoutSessionInput[]
    updateMany?: QuizAnswerUpdateManyWithWhereWithoutSessionInput | QuizAnswerUpdateManyWithWhereWithoutSessionInput[]
    deleteMany?: QuizAnswerScalarWhereInput | QuizAnswerScalarWhereInput[]
  }

  export type QuizSessionCreateNestedOneWithoutAnswersInput = {
    create?: XOR<QuizSessionCreateWithoutAnswersInput, QuizSessionUncheckedCreateWithoutAnswersInput>
    connectOrCreate?: QuizSessionCreateOrConnectWithoutAnswersInput
    connect?: QuizSessionWhereUniqueInput
  }

  export type QuizSessionUpdateOneRequiredWithoutAnswersNestedInput = {
    create?: XOR<QuizSessionCreateWithoutAnswersInput, QuizSessionUncheckedCreateWithoutAnswersInput>
    connectOrCreate?: QuizSessionCreateOrConnectWithoutAnswersInput
    upsert?: QuizSessionUpsertWithoutAnswersInput
    connect?: QuizSessionWhereUniqueInput
    update?: XOR<XOR<QuizSessionUpdateToOneWithWhereWithoutAnswersInput, QuizSessionUpdateWithoutAnswersInput>, QuizSessionUncheckedUpdateWithoutAnswersInput>
  }

  export type GroupMemberCreateNestedManyWithoutGroupInput = {
    create?: XOR<GroupMemberCreateWithoutGroupInput, GroupMemberUncheckedCreateWithoutGroupInput> | GroupMemberCreateWithoutGroupInput[] | GroupMemberUncheckedCreateWithoutGroupInput[]
    connectOrCreate?: GroupMemberCreateOrConnectWithoutGroupInput | GroupMemberCreateOrConnectWithoutGroupInput[]
    createMany?: GroupMemberCreateManyGroupInputEnvelope
    connect?: GroupMemberWhereUniqueInput | GroupMemberWhereUniqueInput[]
  }

  export type GroupMemberUncheckedCreateNestedManyWithoutGroupInput = {
    create?: XOR<GroupMemberCreateWithoutGroupInput, GroupMemberUncheckedCreateWithoutGroupInput> | GroupMemberCreateWithoutGroupInput[] | GroupMemberUncheckedCreateWithoutGroupInput[]
    connectOrCreate?: GroupMemberCreateOrConnectWithoutGroupInput | GroupMemberCreateOrConnectWithoutGroupInput[]
    createMany?: GroupMemberCreateManyGroupInputEnvelope
    connect?: GroupMemberWhereUniqueInput | GroupMemberWhereUniqueInput[]
  }

  export type GroupMemberUpdateManyWithoutGroupNestedInput = {
    create?: XOR<GroupMemberCreateWithoutGroupInput, GroupMemberUncheckedCreateWithoutGroupInput> | GroupMemberCreateWithoutGroupInput[] | GroupMemberUncheckedCreateWithoutGroupInput[]
    connectOrCreate?: GroupMemberCreateOrConnectWithoutGroupInput | GroupMemberCreateOrConnectWithoutGroupInput[]
    upsert?: GroupMemberUpsertWithWhereUniqueWithoutGroupInput | GroupMemberUpsertWithWhereUniqueWithoutGroupInput[]
    createMany?: GroupMemberCreateManyGroupInputEnvelope
    set?: GroupMemberWhereUniqueInput | GroupMemberWhereUniqueInput[]
    disconnect?: GroupMemberWhereUniqueInput | GroupMemberWhereUniqueInput[]
    delete?: GroupMemberWhereUniqueInput | GroupMemberWhereUniqueInput[]
    connect?: GroupMemberWhereUniqueInput | GroupMemberWhereUniqueInput[]
    update?: GroupMemberUpdateWithWhereUniqueWithoutGroupInput | GroupMemberUpdateWithWhereUniqueWithoutGroupInput[]
    updateMany?: GroupMemberUpdateManyWithWhereWithoutGroupInput | GroupMemberUpdateManyWithWhereWithoutGroupInput[]
    deleteMany?: GroupMemberScalarWhereInput | GroupMemberScalarWhereInput[]
  }

  export type GroupMemberUncheckedUpdateManyWithoutGroupNestedInput = {
    create?: XOR<GroupMemberCreateWithoutGroupInput, GroupMemberUncheckedCreateWithoutGroupInput> | GroupMemberCreateWithoutGroupInput[] | GroupMemberUncheckedCreateWithoutGroupInput[]
    connectOrCreate?: GroupMemberCreateOrConnectWithoutGroupInput | GroupMemberCreateOrConnectWithoutGroupInput[]
    upsert?: GroupMemberUpsertWithWhereUniqueWithoutGroupInput | GroupMemberUpsertWithWhereUniqueWithoutGroupInput[]
    createMany?: GroupMemberCreateManyGroupInputEnvelope
    set?: GroupMemberWhereUniqueInput | GroupMemberWhereUniqueInput[]
    disconnect?: GroupMemberWhereUniqueInput | GroupMemberWhereUniqueInput[]
    delete?: GroupMemberWhereUniqueInput | GroupMemberWhereUniqueInput[]
    connect?: GroupMemberWhereUniqueInput | GroupMemberWhereUniqueInput[]
    update?: GroupMemberUpdateWithWhereUniqueWithoutGroupInput | GroupMemberUpdateWithWhereUniqueWithoutGroupInput[]
    updateMany?: GroupMemberUpdateManyWithWhereWithoutGroupInput | GroupMemberUpdateManyWithWhereWithoutGroupInput[]
    deleteMany?: GroupMemberScalarWhereInput | GroupMemberScalarWhereInput[]
  }

  export type StudyGroupCreateNestedOneWithoutMembersInput = {
    create?: XOR<StudyGroupCreateWithoutMembersInput, StudyGroupUncheckedCreateWithoutMembersInput>
    connectOrCreate?: StudyGroupCreateOrConnectWithoutMembersInput
    connect?: StudyGroupWhereUniqueInput
  }

  export type StudyGroupUpdateOneRequiredWithoutMembersNestedInput = {
    create?: XOR<StudyGroupCreateWithoutMembersInput, StudyGroupUncheckedCreateWithoutMembersInput>
    connectOrCreate?: StudyGroupCreateOrConnectWithoutMembersInput
    upsert?: StudyGroupUpsertWithoutMembersInput
    connect?: StudyGroupWhereUniqueInput
    update?: XOR<XOR<StudyGroupUpdateToOneWithWhereWithoutMembersInput, StudyGroupUpdateWithoutMembersInput>, StudyGroupUncheckedUpdateWithoutMembersInput>
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
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

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type ChallengeParticipantCreateWithoutRoomInput = {
    id?: string
    userId: string
    userName: string
    userAvatar?: string | null
    userRating?: number
    isHost?: boolean
    isReady?: boolean
    status?: string
    joinedAt?: Date | string
    leftAt?: Date | string | null
  }

  export type ChallengeParticipantUncheckedCreateWithoutRoomInput = {
    id?: string
    userId: string
    userName: string
    userAvatar?: string | null
    userRating?: number
    isHost?: boolean
    isReady?: boolean
    status?: string
    joinedAt?: Date | string
    leftAt?: Date | string | null
  }

  export type ChallengeParticipantCreateOrConnectWithoutRoomInput = {
    where: ChallengeParticipantWhereUniqueInput
    create: XOR<ChallengeParticipantCreateWithoutRoomInput, ChallengeParticipantUncheckedCreateWithoutRoomInput>
  }

  export type ChallengeParticipantCreateManyRoomInputEnvelope = {
    data: ChallengeParticipantCreateManyRoomInput | ChallengeParticipantCreateManyRoomInput[]
    skipDuplicates?: boolean
  }

  export type MatchSessionCreateWithoutRoomInput = {
    id?: string
    matchType?: string
    difficulty?: string
    status?: string
    startedAt?: Date | string | null
    endedAt?: Date | string | null
    durationSeconds?: number
    winnerId?: string | null
    resultSummary?: string | null
    problemId?: string | null
    createdAt?: Date | string
    participants?: MatchParticipantCreateNestedManyWithoutMatchInput
    submissions?: ChallengeSubmissionCreateNestedManyWithoutMatchInput
  }

  export type MatchSessionUncheckedCreateWithoutRoomInput = {
    id?: string
    matchType?: string
    difficulty?: string
    status?: string
    startedAt?: Date | string | null
    endedAt?: Date | string | null
    durationSeconds?: number
    winnerId?: string | null
    resultSummary?: string | null
    problemId?: string | null
    createdAt?: Date | string
    participants?: MatchParticipantUncheckedCreateNestedManyWithoutMatchInput
    submissions?: ChallengeSubmissionUncheckedCreateNestedManyWithoutMatchInput
  }

  export type MatchSessionCreateOrConnectWithoutRoomInput = {
    where: MatchSessionWhereUniqueInput
    create: XOR<MatchSessionCreateWithoutRoomInput, MatchSessionUncheckedCreateWithoutRoomInput>
  }

  export type MatchSessionCreateManyRoomInputEnvelope = {
    data: MatchSessionCreateManyRoomInput | MatchSessionCreateManyRoomInput[]
    skipDuplicates?: boolean
  }

  export type ChallengeParticipantUpsertWithWhereUniqueWithoutRoomInput = {
    where: ChallengeParticipantWhereUniqueInput
    update: XOR<ChallengeParticipantUpdateWithoutRoomInput, ChallengeParticipantUncheckedUpdateWithoutRoomInput>
    create: XOR<ChallengeParticipantCreateWithoutRoomInput, ChallengeParticipantUncheckedCreateWithoutRoomInput>
  }

  export type ChallengeParticipantUpdateWithWhereUniqueWithoutRoomInput = {
    where: ChallengeParticipantWhereUniqueInput
    data: XOR<ChallengeParticipantUpdateWithoutRoomInput, ChallengeParticipantUncheckedUpdateWithoutRoomInput>
  }

  export type ChallengeParticipantUpdateManyWithWhereWithoutRoomInput = {
    where: ChallengeParticipantScalarWhereInput
    data: XOR<ChallengeParticipantUpdateManyMutationInput, ChallengeParticipantUncheckedUpdateManyWithoutRoomInput>
  }

  export type ChallengeParticipantScalarWhereInput = {
    AND?: ChallengeParticipantScalarWhereInput | ChallengeParticipantScalarWhereInput[]
    OR?: ChallengeParticipantScalarWhereInput[]
    NOT?: ChallengeParticipantScalarWhereInput | ChallengeParticipantScalarWhereInput[]
    id?: StringFilter<"ChallengeParticipant"> | string
    roomId?: StringFilter<"ChallengeParticipant"> | string
    userId?: StringFilter<"ChallengeParticipant"> | string
    userName?: StringFilter<"ChallengeParticipant"> | string
    userAvatar?: StringNullableFilter<"ChallengeParticipant"> | string | null
    userRating?: IntFilter<"ChallengeParticipant"> | number
    isHost?: BoolFilter<"ChallengeParticipant"> | boolean
    isReady?: BoolFilter<"ChallengeParticipant"> | boolean
    status?: StringFilter<"ChallengeParticipant"> | string
    joinedAt?: DateTimeFilter<"ChallengeParticipant"> | Date | string
    leftAt?: DateTimeNullableFilter<"ChallengeParticipant"> | Date | string | null
  }

  export type MatchSessionUpsertWithWhereUniqueWithoutRoomInput = {
    where: MatchSessionWhereUniqueInput
    update: XOR<MatchSessionUpdateWithoutRoomInput, MatchSessionUncheckedUpdateWithoutRoomInput>
    create: XOR<MatchSessionCreateWithoutRoomInput, MatchSessionUncheckedCreateWithoutRoomInput>
  }

  export type MatchSessionUpdateWithWhereUniqueWithoutRoomInput = {
    where: MatchSessionWhereUniqueInput
    data: XOR<MatchSessionUpdateWithoutRoomInput, MatchSessionUncheckedUpdateWithoutRoomInput>
  }

  export type MatchSessionUpdateManyWithWhereWithoutRoomInput = {
    where: MatchSessionScalarWhereInput
    data: XOR<MatchSessionUpdateManyMutationInput, MatchSessionUncheckedUpdateManyWithoutRoomInput>
  }

  export type MatchSessionScalarWhereInput = {
    AND?: MatchSessionScalarWhereInput | MatchSessionScalarWhereInput[]
    OR?: MatchSessionScalarWhereInput[]
    NOT?: MatchSessionScalarWhereInput | MatchSessionScalarWhereInput[]
    id?: StringFilter<"MatchSession"> | string
    roomId?: StringNullableFilter<"MatchSession"> | string | null
    matchType?: StringFilter<"MatchSession"> | string
    difficulty?: StringFilter<"MatchSession"> | string
    status?: StringFilter<"MatchSession"> | string
    startedAt?: DateTimeNullableFilter<"MatchSession"> | Date | string | null
    endedAt?: DateTimeNullableFilter<"MatchSession"> | Date | string | null
    durationSeconds?: IntFilter<"MatchSession"> | number
    winnerId?: StringNullableFilter<"MatchSession"> | string | null
    resultSummary?: StringNullableFilter<"MatchSession"> | string | null
    problemId?: StringNullableFilter<"MatchSession"> | string | null
    createdAt?: DateTimeFilter<"MatchSession"> | Date | string
  }

  export type ChallengeRoomCreateWithoutParticipantsInput = {
    id?: string
    roomCode: string
    title: string
    type?: string
    visibility?: string
    difficulty?: string
    topic?: string
    language?: string
    maxParticipants?: number
    durationMinutes?: number
    status?: string
    createdBy: string
    hostName?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    matches?: MatchSessionCreateNestedManyWithoutRoomInput
  }

  export type ChallengeRoomUncheckedCreateWithoutParticipantsInput = {
    id?: string
    roomCode: string
    title: string
    type?: string
    visibility?: string
    difficulty?: string
    topic?: string
    language?: string
    maxParticipants?: number
    durationMinutes?: number
    status?: string
    createdBy: string
    hostName?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    matches?: MatchSessionUncheckedCreateNestedManyWithoutRoomInput
  }

  export type ChallengeRoomCreateOrConnectWithoutParticipantsInput = {
    where: ChallengeRoomWhereUniqueInput
    create: XOR<ChallengeRoomCreateWithoutParticipantsInput, ChallengeRoomUncheckedCreateWithoutParticipantsInput>
  }

  export type ChallengeRoomUpsertWithoutParticipantsInput = {
    update: XOR<ChallengeRoomUpdateWithoutParticipantsInput, ChallengeRoomUncheckedUpdateWithoutParticipantsInput>
    create: XOR<ChallengeRoomCreateWithoutParticipantsInput, ChallengeRoomUncheckedCreateWithoutParticipantsInput>
    where?: ChallengeRoomWhereInput
  }

  export type ChallengeRoomUpdateToOneWithWhereWithoutParticipantsInput = {
    where?: ChallengeRoomWhereInput
    data: XOR<ChallengeRoomUpdateWithoutParticipantsInput, ChallengeRoomUncheckedUpdateWithoutParticipantsInput>
  }

  export type ChallengeRoomUpdateWithoutParticipantsInput = {
    id?: StringFieldUpdateOperationsInput | string
    roomCode?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    visibility?: StringFieldUpdateOperationsInput | string
    difficulty?: StringFieldUpdateOperationsInput | string
    topic?: StringFieldUpdateOperationsInput | string
    language?: StringFieldUpdateOperationsInput | string
    maxParticipants?: IntFieldUpdateOperationsInput | number
    durationMinutes?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    createdBy?: StringFieldUpdateOperationsInput | string
    hostName?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    matches?: MatchSessionUpdateManyWithoutRoomNestedInput
  }

  export type ChallengeRoomUncheckedUpdateWithoutParticipantsInput = {
    id?: StringFieldUpdateOperationsInput | string
    roomCode?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    visibility?: StringFieldUpdateOperationsInput | string
    difficulty?: StringFieldUpdateOperationsInput | string
    topic?: StringFieldUpdateOperationsInput | string
    language?: StringFieldUpdateOperationsInput | string
    maxParticipants?: IntFieldUpdateOperationsInput | number
    durationMinutes?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    createdBy?: StringFieldUpdateOperationsInput | string
    hostName?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    matches?: MatchSessionUncheckedUpdateManyWithoutRoomNestedInput
  }

  export type ChallengeRoomCreateWithoutMatchesInput = {
    id?: string
    roomCode: string
    title: string
    type?: string
    visibility?: string
    difficulty?: string
    topic?: string
    language?: string
    maxParticipants?: number
    durationMinutes?: number
    status?: string
    createdBy: string
    hostName?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    participants?: ChallengeParticipantCreateNestedManyWithoutRoomInput
  }

  export type ChallengeRoomUncheckedCreateWithoutMatchesInput = {
    id?: string
    roomCode: string
    title: string
    type?: string
    visibility?: string
    difficulty?: string
    topic?: string
    language?: string
    maxParticipants?: number
    durationMinutes?: number
    status?: string
    createdBy: string
    hostName?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    participants?: ChallengeParticipantUncheckedCreateNestedManyWithoutRoomInput
  }

  export type ChallengeRoomCreateOrConnectWithoutMatchesInput = {
    where: ChallengeRoomWhereUniqueInput
    create: XOR<ChallengeRoomCreateWithoutMatchesInput, ChallengeRoomUncheckedCreateWithoutMatchesInput>
  }

  export type MatchParticipantCreateWithoutMatchInput = {
    id?: string
    userId: string
    userName: string
    userAvatar?: string | null
    score?: number
    problemsSolved?: number
    passedTests?: number
    totalTests?: number
    ratingBefore?: number
    ratingAfter?: number
    xpEarned?: number
    status?: string
    submittedAt?: Date | string | null
  }

  export type MatchParticipantUncheckedCreateWithoutMatchInput = {
    id?: string
    userId: string
    userName: string
    userAvatar?: string | null
    score?: number
    problemsSolved?: number
    passedTests?: number
    totalTests?: number
    ratingBefore?: number
    ratingAfter?: number
    xpEarned?: number
    status?: string
    submittedAt?: Date | string | null
  }

  export type MatchParticipantCreateOrConnectWithoutMatchInput = {
    where: MatchParticipantWhereUniqueInput
    create: XOR<MatchParticipantCreateWithoutMatchInput, MatchParticipantUncheckedCreateWithoutMatchInput>
  }

  export type MatchParticipantCreateManyMatchInputEnvelope = {
    data: MatchParticipantCreateManyMatchInput | MatchParticipantCreateManyMatchInput[]
    skipDuplicates?: boolean
  }

  export type ChallengeSubmissionCreateWithoutMatchInput = {
    id?: string
    userId: string
    problemId: string
    language: string
    sourceCode: string
    status?: string
    executionTimeMs?: number
    passedTestCases?: number
    totalTestCases?: number
    score?: number
    stdout?: string | null
    errorDetails?: string | null
    submittedAt?: Date | string
  }

  export type ChallengeSubmissionUncheckedCreateWithoutMatchInput = {
    id?: string
    userId: string
    problemId: string
    language: string
    sourceCode: string
    status?: string
    executionTimeMs?: number
    passedTestCases?: number
    totalTestCases?: number
    score?: number
    stdout?: string | null
    errorDetails?: string | null
    submittedAt?: Date | string
  }

  export type ChallengeSubmissionCreateOrConnectWithoutMatchInput = {
    where: ChallengeSubmissionWhereUniqueInput
    create: XOR<ChallengeSubmissionCreateWithoutMatchInput, ChallengeSubmissionUncheckedCreateWithoutMatchInput>
  }

  export type ChallengeSubmissionCreateManyMatchInputEnvelope = {
    data: ChallengeSubmissionCreateManyMatchInput | ChallengeSubmissionCreateManyMatchInput[]
    skipDuplicates?: boolean
  }

  export type ChallengeRoomUpsertWithoutMatchesInput = {
    update: XOR<ChallengeRoomUpdateWithoutMatchesInput, ChallengeRoomUncheckedUpdateWithoutMatchesInput>
    create: XOR<ChallengeRoomCreateWithoutMatchesInput, ChallengeRoomUncheckedCreateWithoutMatchesInput>
    where?: ChallengeRoomWhereInput
  }

  export type ChallengeRoomUpdateToOneWithWhereWithoutMatchesInput = {
    where?: ChallengeRoomWhereInput
    data: XOR<ChallengeRoomUpdateWithoutMatchesInput, ChallengeRoomUncheckedUpdateWithoutMatchesInput>
  }

  export type ChallengeRoomUpdateWithoutMatchesInput = {
    id?: StringFieldUpdateOperationsInput | string
    roomCode?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    visibility?: StringFieldUpdateOperationsInput | string
    difficulty?: StringFieldUpdateOperationsInput | string
    topic?: StringFieldUpdateOperationsInput | string
    language?: StringFieldUpdateOperationsInput | string
    maxParticipants?: IntFieldUpdateOperationsInput | number
    durationMinutes?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    createdBy?: StringFieldUpdateOperationsInput | string
    hostName?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    participants?: ChallengeParticipantUpdateManyWithoutRoomNestedInput
  }

  export type ChallengeRoomUncheckedUpdateWithoutMatchesInput = {
    id?: StringFieldUpdateOperationsInput | string
    roomCode?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    visibility?: StringFieldUpdateOperationsInput | string
    difficulty?: StringFieldUpdateOperationsInput | string
    topic?: StringFieldUpdateOperationsInput | string
    language?: StringFieldUpdateOperationsInput | string
    maxParticipants?: IntFieldUpdateOperationsInput | number
    durationMinutes?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    createdBy?: StringFieldUpdateOperationsInput | string
    hostName?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    participants?: ChallengeParticipantUncheckedUpdateManyWithoutRoomNestedInput
  }

  export type MatchParticipantUpsertWithWhereUniqueWithoutMatchInput = {
    where: MatchParticipantWhereUniqueInput
    update: XOR<MatchParticipantUpdateWithoutMatchInput, MatchParticipantUncheckedUpdateWithoutMatchInput>
    create: XOR<MatchParticipantCreateWithoutMatchInput, MatchParticipantUncheckedCreateWithoutMatchInput>
  }

  export type MatchParticipantUpdateWithWhereUniqueWithoutMatchInput = {
    where: MatchParticipantWhereUniqueInput
    data: XOR<MatchParticipantUpdateWithoutMatchInput, MatchParticipantUncheckedUpdateWithoutMatchInput>
  }

  export type MatchParticipantUpdateManyWithWhereWithoutMatchInput = {
    where: MatchParticipantScalarWhereInput
    data: XOR<MatchParticipantUpdateManyMutationInput, MatchParticipantUncheckedUpdateManyWithoutMatchInput>
  }

  export type MatchParticipantScalarWhereInput = {
    AND?: MatchParticipantScalarWhereInput | MatchParticipantScalarWhereInput[]
    OR?: MatchParticipantScalarWhereInput[]
    NOT?: MatchParticipantScalarWhereInput | MatchParticipantScalarWhereInput[]
    id?: StringFilter<"MatchParticipant"> | string
    matchId?: StringFilter<"MatchParticipant"> | string
    userId?: StringFilter<"MatchParticipant"> | string
    userName?: StringFilter<"MatchParticipant"> | string
    userAvatar?: StringNullableFilter<"MatchParticipant"> | string | null
    score?: IntFilter<"MatchParticipant"> | number
    problemsSolved?: IntFilter<"MatchParticipant"> | number
    passedTests?: IntFilter<"MatchParticipant"> | number
    totalTests?: IntFilter<"MatchParticipant"> | number
    ratingBefore?: IntFilter<"MatchParticipant"> | number
    ratingAfter?: IntFilter<"MatchParticipant"> | number
    xpEarned?: IntFilter<"MatchParticipant"> | number
    status?: StringFilter<"MatchParticipant"> | string
    submittedAt?: DateTimeNullableFilter<"MatchParticipant"> | Date | string | null
  }

  export type ChallengeSubmissionUpsertWithWhereUniqueWithoutMatchInput = {
    where: ChallengeSubmissionWhereUniqueInput
    update: XOR<ChallengeSubmissionUpdateWithoutMatchInput, ChallengeSubmissionUncheckedUpdateWithoutMatchInput>
    create: XOR<ChallengeSubmissionCreateWithoutMatchInput, ChallengeSubmissionUncheckedCreateWithoutMatchInput>
  }

  export type ChallengeSubmissionUpdateWithWhereUniqueWithoutMatchInput = {
    where: ChallengeSubmissionWhereUniqueInput
    data: XOR<ChallengeSubmissionUpdateWithoutMatchInput, ChallengeSubmissionUncheckedUpdateWithoutMatchInput>
  }

  export type ChallengeSubmissionUpdateManyWithWhereWithoutMatchInput = {
    where: ChallengeSubmissionScalarWhereInput
    data: XOR<ChallengeSubmissionUpdateManyMutationInput, ChallengeSubmissionUncheckedUpdateManyWithoutMatchInput>
  }

  export type ChallengeSubmissionScalarWhereInput = {
    AND?: ChallengeSubmissionScalarWhereInput | ChallengeSubmissionScalarWhereInput[]
    OR?: ChallengeSubmissionScalarWhereInput[]
    NOT?: ChallengeSubmissionScalarWhereInput | ChallengeSubmissionScalarWhereInput[]
    id?: StringFilter<"ChallengeSubmission"> | string
    matchId?: StringFilter<"ChallengeSubmission"> | string
    userId?: StringFilter<"ChallengeSubmission"> | string
    problemId?: StringFilter<"ChallengeSubmission"> | string
    language?: StringFilter<"ChallengeSubmission"> | string
    sourceCode?: StringFilter<"ChallengeSubmission"> | string
    status?: StringFilter<"ChallengeSubmission"> | string
    executionTimeMs?: IntFilter<"ChallengeSubmission"> | number
    passedTestCases?: IntFilter<"ChallengeSubmission"> | number
    totalTestCases?: IntFilter<"ChallengeSubmission"> | number
    score?: IntFilter<"ChallengeSubmission"> | number
    stdout?: StringNullableFilter<"ChallengeSubmission"> | string | null
    errorDetails?: StringNullableFilter<"ChallengeSubmission"> | string | null
    submittedAt?: DateTimeFilter<"ChallengeSubmission"> | Date | string
  }

  export type MatchSessionCreateWithoutParticipantsInput = {
    id?: string
    matchType?: string
    difficulty?: string
    status?: string
    startedAt?: Date | string | null
    endedAt?: Date | string | null
    durationSeconds?: number
    winnerId?: string | null
    resultSummary?: string | null
    problemId?: string | null
    createdAt?: Date | string
    room?: ChallengeRoomCreateNestedOneWithoutMatchesInput
    submissions?: ChallengeSubmissionCreateNestedManyWithoutMatchInput
  }

  export type MatchSessionUncheckedCreateWithoutParticipantsInput = {
    id?: string
    roomId?: string | null
    matchType?: string
    difficulty?: string
    status?: string
    startedAt?: Date | string | null
    endedAt?: Date | string | null
    durationSeconds?: number
    winnerId?: string | null
    resultSummary?: string | null
    problemId?: string | null
    createdAt?: Date | string
    submissions?: ChallengeSubmissionUncheckedCreateNestedManyWithoutMatchInput
  }

  export type MatchSessionCreateOrConnectWithoutParticipantsInput = {
    where: MatchSessionWhereUniqueInput
    create: XOR<MatchSessionCreateWithoutParticipantsInput, MatchSessionUncheckedCreateWithoutParticipantsInput>
  }

  export type MatchSessionUpsertWithoutParticipantsInput = {
    update: XOR<MatchSessionUpdateWithoutParticipantsInput, MatchSessionUncheckedUpdateWithoutParticipantsInput>
    create: XOR<MatchSessionCreateWithoutParticipantsInput, MatchSessionUncheckedCreateWithoutParticipantsInput>
    where?: MatchSessionWhereInput
  }

  export type MatchSessionUpdateToOneWithWhereWithoutParticipantsInput = {
    where?: MatchSessionWhereInput
    data: XOR<MatchSessionUpdateWithoutParticipantsInput, MatchSessionUncheckedUpdateWithoutParticipantsInput>
  }

  export type MatchSessionUpdateWithoutParticipantsInput = {
    id?: StringFieldUpdateOperationsInput | string
    matchType?: StringFieldUpdateOperationsInput | string
    difficulty?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    durationSeconds?: IntFieldUpdateOperationsInput | number
    winnerId?: NullableStringFieldUpdateOperationsInput | string | null
    resultSummary?: NullableStringFieldUpdateOperationsInput | string | null
    problemId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    room?: ChallengeRoomUpdateOneWithoutMatchesNestedInput
    submissions?: ChallengeSubmissionUpdateManyWithoutMatchNestedInput
  }

  export type MatchSessionUncheckedUpdateWithoutParticipantsInput = {
    id?: StringFieldUpdateOperationsInput | string
    roomId?: NullableStringFieldUpdateOperationsInput | string | null
    matchType?: StringFieldUpdateOperationsInput | string
    difficulty?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    durationSeconds?: IntFieldUpdateOperationsInput | number
    winnerId?: NullableStringFieldUpdateOperationsInput | string | null
    resultSummary?: NullableStringFieldUpdateOperationsInput | string | null
    problemId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    submissions?: ChallengeSubmissionUncheckedUpdateManyWithoutMatchNestedInput
  }

  export type MatchSessionCreateWithoutSubmissionsInput = {
    id?: string
    matchType?: string
    difficulty?: string
    status?: string
    startedAt?: Date | string | null
    endedAt?: Date | string | null
    durationSeconds?: number
    winnerId?: string | null
    resultSummary?: string | null
    problemId?: string | null
    createdAt?: Date | string
    room?: ChallengeRoomCreateNestedOneWithoutMatchesInput
    participants?: MatchParticipantCreateNestedManyWithoutMatchInput
  }

  export type MatchSessionUncheckedCreateWithoutSubmissionsInput = {
    id?: string
    roomId?: string | null
    matchType?: string
    difficulty?: string
    status?: string
    startedAt?: Date | string | null
    endedAt?: Date | string | null
    durationSeconds?: number
    winnerId?: string | null
    resultSummary?: string | null
    problemId?: string | null
    createdAt?: Date | string
    participants?: MatchParticipantUncheckedCreateNestedManyWithoutMatchInput
  }

  export type MatchSessionCreateOrConnectWithoutSubmissionsInput = {
    where: MatchSessionWhereUniqueInput
    create: XOR<MatchSessionCreateWithoutSubmissionsInput, MatchSessionUncheckedCreateWithoutSubmissionsInput>
  }

  export type MatchSessionUpsertWithoutSubmissionsInput = {
    update: XOR<MatchSessionUpdateWithoutSubmissionsInput, MatchSessionUncheckedUpdateWithoutSubmissionsInput>
    create: XOR<MatchSessionCreateWithoutSubmissionsInput, MatchSessionUncheckedCreateWithoutSubmissionsInput>
    where?: MatchSessionWhereInput
  }

  export type MatchSessionUpdateToOneWithWhereWithoutSubmissionsInput = {
    where?: MatchSessionWhereInput
    data: XOR<MatchSessionUpdateWithoutSubmissionsInput, MatchSessionUncheckedUpdateWithoutSubmissionsInput>
  }

  export type MatchSessionUpdateWithoutSubmissionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    matchType?: StringFieldUpdateOperationsInput | string
    difficulty?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    durationSeconds?: IntFieldUpdateOperationsInput | number
    winnerId?: NullableStringFieldUpdateOperationsInput | string | null
    resultSummary?: NullableStringFieldUpdateOperationsInput | string | null
    problemId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    room?: ChallengeRoomUpdateOneWithoutMatchesNestedInput
    participants?: MatchParticipantUpdateManyWithoutMatchNestedInput
  }

  export type MatchSessionUncheckedUpdateWithoutSubmissionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    roomId?: NullableStringFieldUpdateOperationsInput | string | null
    matchType?: StringFieldUpdateOperationsInput | string
    difficulty?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    durationSeconds?: IntFieldUpdateOperationsInput | number
    winnerId?: NullableStringFieldUpdateOperationsInput | string | null
    resultSummary?: NullableStringFieldUpdateOperationsInput | string | null
    problemId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    participants?: MatchParticipantUncheckedUpdateManyWithoutMatchNestedInput
  }

  export type QuizQuestionCreateWithoutQuizInput = {
    id?: string
    question: string
    options?: QuizQuestionCreateoptionsInput | string[]
    correctIndex: number
    explanation: string
    topic: string
    difficulty?: string
  }

  export type QuizQuestionUncheckedCreateWithoutQuizInput = {
    id?: string
    question: string
    options?: QuizQuestionCreateoptionsInput | string[]
    correctIndex: number
    explanation: string
    topic: string
    difficulty?: string
  }

  export type QuizQuestionCreateOrConnectWithoutQuizInput = {
    where: QuizQuestionWhereUniqueInput
    create: XOR<QuizQuestionCreateWithoutQuizInput, QuizQuestionUncheckedCreateWithoutQuizInput>
  }

  export type QuizQuestionCreateManyQuizInputEnvelope = {
    data: QuizQuestionCreateManyQuizInput | QuizQuestionCreateManyQuizInput[]
    skipDuplicates?: boolean
  }

  export type QuizSessionCreateWithoutQuizInput = {
    id?: string
    roomCode?: string | null
    status?: string
    currentQuestion?: number
    startedAt?: Date | string | null
    endedAt?: Date | string | null
    durationSeconds?: number
    createdAt?: Date | string
    answers?: QuizAnswerCreateNestedManyWithoutSessionInput
  }

  export type QuizSessionUncheckedCreateWithoutQuizInput = {
    id?: string
    roomCode?: string | null
    status?: string
    currentQuestion?: number
    startedAt?: Date | string | null
    endedAt?: Date | string | null
    durationSeconds?: number
    createdAt?: Date | string
    answers?: QuizAnswerUncheckedCreateNestedManyWithoutSessionInput
  }

  export type QuizSessionCreateOrConnectWithoutQuizInput = {
    where: QuizSessionWhereUniqueInput
    create: XOR<QuizSessionCreateWithoutQuizInput, QuizSessionUncheckedCreateWithoutQuizInput>
  }

  export type QuizSessionCreateManyQuizInputEnvelope = {
    data: QuizSessionCreateManyQuizInput | QuizSessionCreateManyQuizInput[]
    skipDuplicates?: boolean
  }

  export type QuizQuestionUpsertWithWhereUniqueWithoutQuizInput = {
    where: QuizQuestionWhereUniqueInput
    update: XOR<QuizQuestionUpdateWithoutQuizInput, QuizQuestionUncheckedUpdateWithoutQuizInput>
    create: XOR<QuizQuestionCreateWithoutQuizInput, QuizQuestionUncheckedCreateWithoutQuizInput>
  }

  export type QuizQuestionUpdateWithWhereUniqueWithoutQuizInput = {
    where: QuizQuestionWhereUniqueInput
    data: XOR<QuizQuestionUpdateWithoutQuizInput, QuizQuestionUncheckedUpdateWithoutQuizInput>
  }

  export type QuizQuestionUpdateManyWithWhereWithoutQuizInput = {
    where: QuizQuestionScalarWhereInput
    data: XOR<QuizQuestionUpdateManyMutationInput, QuizQuestionUncheckedUpdateManyWithoutQuizInput>
  }

  export type QuizQuestionScalarWhereInput = {
    AND?: QuizQuestionScalarWhereInput | QuizQuestionScalarWhereInput[]
    OR?: QuizQuestionScalarWhereInput[]
    NOT?: QuizQuestionScalarWhereInput | QuizQuestionScalarWhereInput[]
    id?: StringFilter<"QuizQuestion"> | string
    quizId?: StringFilter<"QuizQuestion"> | string
    question?: StringFilter<"QuizQuestion"> | string
    options?: StringNullableListFilter<"QuizQuestion">
    correctIndex?: IntFilter<"QuizQuestion"> | number
    explanation?: StringFilter<"QuizQuestion"> | string
    topic?: StringFilter<"QuizQuestion"> | string
    difficulty?: StringFilter<"QuizQuestion"> | string
  }

  export type QuizSessionUpsertWithWhereUniqueWithoutQuizInput = {
    where: QuizSessionWhereUniqueInput
    update: XOR<QuizSessionUpdateWithoutQuizInput, QuizSessionUncheckedUpdateWithoutQuizInput>
    create: XOR<QuizSessionCreateWithoutQuizInput, QuizSessionUncheckedCreateWithoutQuizInput>
  }

  export type QuizSessionUpdateWithWhereUniqueWithoutQuizInput = {
    where: QuizSessionWhereUniqueInput
    data: XOR<QuizSessionUpdateWithoutQuizInput, QuizSessionUncheckedUpdateWithoutQuizInput>
  }

  export type QuizSessionUpdateManyWithWhereWithoutQuizInput = {
    where: QuizSessionScalarWhereInput
    data: XOR<QuizSessionUpdateManyMutationInput, QuizSessionUncheckedUpdateManyWithoutQuizInput>
  }

  export type QuizSessionScalarWhereInput = {
    AND?: QuizSessionScalarWhereInput | QuizSessionScalarWhereInput[]
    OR?: QuizSessionScalarWhereInput[]
    NOT?: QuizSessionScalarWhereInput | QuizSessionScalarWhereInput[]
    id?: StringFilter<"QuizSession"> | string
    quizId?: StringFilter<"QuizSession"> | string
    roomCode?: StringNullableFilter<"QuizSession"> | string | null
    status?: StringFilter<"QuizSession"> | string
    currentQuestion?: IntFilter<"QuizSession"> | number
    startedAt?: DateTimeNullableFilter<"QuizSession"> | Date | string | null
    endedAt?: DateTimeNullableFilter<"QuizSession"> | Date | string | null
    durationSeconds?: IntFilter<"QuizSession"> | number
    createdAt?: DateTimeFilter<"QuizSession"> | Date | string
  }

  export type QuizTemplateCreateWithoutQuestionsInput = {
    id?: string
    title: string
    category: string
    difficulty?: string
    timePerQuestion?: number
    totalQuestions?: number
    createdAt?: Date | string
    sessions?: QuizSessionCreateNestedManyWithoutQuizInput
  }

  export type QuizTemplateUncheckedCreateWithoutQuestionsInput = {
    id?: string
    title: string
    category: string
    difficulty?: string
    timePerQuestion?: number
    totalQuestions?: number
    createdAt?: Date | string
    sessions?: QuizSessionUncheckedCreateNestedManyWithoutQuizInput
  }

  export type QuizTemplateCreateOrConnectWithoutQuestionsInput = {
    where: QuizTemplateWhereUniqueInput
    create: XOR<QuizTemplateCreateWithoutQuestionsInput, QuizTemplateUncheckedCreateWithoutQuestionsInput>
  }

  export type QuizTemplateUpsertWithoutQuestionsInput = {
    update: XOR<QuizTemplateUpdateWithoutQuestionsInput, QuizTemplateUncheckedUpdateWithoutQuestionsInput>
    create: XOR<QuizTemplateCreateWithoutQuestionsInput, QuizTemplateUncheckedCreateWithoutQuestionsInput>
    where?: QuizTemplateWhereInput
  }

  export type QuizTemplateUpdateToOneWithWhereWithoutQuestionsInput = {
    where?: QuizTemplateWhereInput
    data: XOR<QuizTemplateUpdateWithoutQuestionsInput, QuizTemplateUncheckedUpdateWithoutQuestionsInput>
  }

  export type QuizTemplateUpdateWithoutQuestionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    difficulty?: StringFieldUpdateOperationsInput | string
    timePerQuestion?: IntFieldUpdateOperationsInput | number
    totalQuestions?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: QuizSessionUpdateManyWithoutQuizNestedInput
  }

  export type QuizTemplateUncheckedUpdateWithoutQuestionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    difficulty?: StringFieldUpdateOperationsInput | string
    timePerQuestion?: IntFieldUpdateOperationsInput | number
    totalQuestions?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: QuizSessionUncheckedUpdateManyWithoutQuizNestedInput
  }

  export type QuizTemplateCreateWithoutSessionsInput = {
    id?: string
    title: string
    category: string
    difficulty?: string
    timePerQuestion?: number
    totalQuestions?: number
    createdAt?: Date | string
    questions?: QuizQuestionCreateNestedManyWithoutQuizInput
  }

  export type QuizTemplateUncheckedCreateWithoutSessionsInput = {
    id?: string
    title: string
    category: string
    difficulty?: string
    timePerQuestion?: number
    totalQuestions?: number
    createdAt?: Date | string
    questions?: QuizQuestionUncheckedCreateNestedManyWithoutQuizInput
  }

  export type QuizTemplateCreateOrConnectWithoutSessionsInput = {
    where: QuizTemplateWhereUniqueInput
    create: XOR<QuizTemplateCreateWithoutSessionsInput, QuizTemplateUncheckedCreateWithoutSessionsInput>
  }

  export type QuizAnswerCreateWithoutSessionInput = {
    id?: string
    questionId: string
    userId: string
    userName: string
    selectedIndex: number
    isCorrect?: boolean
    responseTimeMs?: number
    pointsAwarded?: number
    submittedAt?: Date | string
  }

  export type QuizAnswerUncheckedCreateWithoutSessionInput = {
    id?: string
    questionId: string
    userId: string
    userName: string
    selectedIndex: number
    isCorrect?: boolean
    responseTimeMs?: number
    pointsAwarded?: number
    submittedAt?: Date | string
  }

  export type QuizAnswerCreateOrConnectWithoutSessionInput = {
    where: QuizAnswerWhereUniqueInput
    create: XOR<QuizAnswerCreateWithoutSessionInput, QuizAnswerUncheckedCreateWithoutSessionInput>
  }

  export type QuizAnswerCreateManySessionInputEnvelope = {
    data: QuizAnswerCreateManySessionInput | QuizAnswerCreateManySessionInput[]
    skipDuplicates?: boolean
  }

  export type QuizTemplateUpsertWithoutSessionsInput = {
    update: XOR<QuizTemplateUpdateWithoutSessionsInput, QuizTemplateUncheckedUpdateWithoutSessionsInput>
    create: XOR<QuizTemplateCreateWithoutSessionsInput, QuizTemplateUncheckedCreateWithoutSessionsInput>
    where?: QuizTemplateWhereInput
  }

  export type QuizTemplateUpdateToOneWithWhereWithoutSessionsInput = {
    where?: QuizTemplateWhereInput
    data: XOR<QuizTemplateUpdateWithoutSessionsInput, QuizTemplateUncheckedUpdateWithoutSessionsInput>
  }

  export type QuizTemplateUpdateWithoutSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    difficulty?: StringFieldUpdateOperationsInput | string
    timePerQuestion?: IntFieldUpdateOperationsInput | number
    totalQuestions?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    questions?: QuizQuestionUpdateManyWithoutQuizNestedInput
  }

  export type QuizTemplateUncheckedUpdateWithoutSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    difficulty?: StringFieldUpdateOperationsInput | string
    timePerQuestion?: IntFieldUpdateOperationsInput | number
    totalQuestions?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    questions?: QuizQuestionUncheckedUpdateManyWithoutQuizNestedInput
  }

  export type QuizAnswerUpsertWithWhereUniqueWithoutSessionInput = {
    where: QuizAnswerWhereUniqueInput
    update: XOR<QuizAnswerUpdateWithoutSessionInput, QuizAnswerUncheckedUpdateWithoutSessionInput>
    create: XOR<QuizAnswerCreateWithoutSessionInput, QuizAnswerUncheckedCreateWithoutSessionInput>
  }

  export type QuizAnswerUpdateWithWhereUniqueWithoutSessionInput = {
    where: QuizAnswerWhereUniqueInput
    data: XOR<QuizAnswerUpdateWithoutSessionInput, QuizAnswerUncheckedUpdateWithoutSessionInput>
  }

  export type QuizAnswerUpdateManyWithWhereWithoutSessionInput = {
    where: QuizAnswerScalarWhereInput
    data: XOR<QuizAnswerUpdateManyMutationInput, QuizAnswerUncheckedUpdateManyWithoutSessionInput>
  }

  export type QuizAnswerScalarWhereInput = {
    AND?: QuizAnswerScalarWhereInput | QuizAnswerScalarWhereInput[]
    OR?: QuizAnswerScalarWhereInput[]
    NOT?: QuizAnswerScalarWhereInput | QuizAnswerScalarWhereInput[]
    id?: StringFilter<"QuizAnswer"> | string
    sessionId?: StringFilter<"QuizAnswer"> | string
    questionId?: StringFilter<"QuizAnswer"> | string
    userId?: StringFilter<"QuizAnswer"> | string
    userName?: StringFilter<"QuizAnswer"> | string
    selectedIndex?: IntFilter<"QuizAnswer"> | number
    isCorrect?: BoolFilter<"QuizAnswer"> | boolean
    responseTimeMs?: IntFilter<"QuizAnswer"> | number
    pointsAwarded?: IntFilter<"QuizAnswer"> | number
    submittedAt?: DateTimeFilter<"QuizAnswer"> | Date | string
  }

  export type QuizSessionCreateWithoutAnswersInput = {
    id?: string
    roomCode?: string | null
    status?: string
    currentQuestion?: number
    startedAt?: Date | string | null
    endedAt?: Date | string | null
    durationSeconds?: number
    createdAt?: Date | string
    quiz: QuizTemplateCreateNestedOneWithoutSessionsInput
  }

  export type QuizSessionUncheckedCreateWithoutAnswersInput = {
    id?: string
    quizId: string
    roomCode?: string | null
    status?: string
    currentQuestion?: number
    startedAt?: Date | string | null
    endedAt?: Date | string | null
    durationSeconds?: number
    createdAt?: Date | string
  }

  export type QuizSessionCreateOrConnectWithoutAnswersInput = {
    where: QuizSessionWhereUniqueInput
    create: XOR<QuizSessionCreateWithoutAnswersInput, QuizSessionUncheckedCreateWithoutAnswersInput>
  }

  export type QuizSessionUpsertWithoutAnswersInput = {
    update: XOR<QuizSessionUpdateWithoutAnswersInput, QuizSessionUncheckedUpdateWithoutAnswersInput>
    create: XOR<QuizSessionCreateWithoutAnswersInput, QuizSessionUncheckedCreateWithoutAnswersInput>
    where?: QuizSessionWhereInput
  }

  export type QuizSessionUpdateToOneWithWhereWithoutAnswersInput = {
    where?: QuizSessionWhereInput
    data: XOR<QuizSessionUpdateWithoutAnswersInput, QuizSessionUncheckedUpdateWithoutAnswersInput>
  }

  export type QuizSessionUpdateWithoutAnswersInput = {
    id?: StringFieldUpdateOperationsInput | string
    roomCode?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    currentQuestion?: IntFieldUpdateOperationsInput | number
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    durationSeconds?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    quiz?: QuizTemplateUpdateOneRequiredWithoutSessionsNestedInput
  }

  export type QuizSessionUncheckedUpdateWithoutAnswersInput = {
    id?: StringFieldUpdateOperationsInput | string
    quizId?: StringFieldUpdateOperationsInput | string
    roomCode?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    currentQuestion?: IntFieldUpdateOperationsInput | number
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    durationSeconds?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GroupMemberCreateWithoutGroupInput = {
    id?: string
    userId: string
    userName: string
    role?: string
    joinedAt?: Date | string
  }

  export type GroupMemberUncheckedCreateWithoutGroupInput = {
    id?: string
    userId: string
    userName: string
    role?: string
    joinedAt?: Date | string
  }

  export type GroupMemberCreateOrConnectWithoutGroupInput = {
    where: GroupMemberWhereUniqueInput
    create: XOR<GroupMemberCreateWithoutGroupInput, GroupMemberUncheckedCreateWithoutGroupInput>
  }

  export type GroupMemberCreateManyGroupInputEnvelope = {
    data: GroupMemberCreateManyGroupInput | GroupMemberCreateManyGroupInput[]
    skipDuplicates?: boolean
  }

  export type GroupMemberUpsertWithWhereUniqueWithoutGroupInput = {
    where: GroupMemberWhereUniqueInput
    update: XOR<GroupMemberUpdateWithoutGroupInput, GroupMemberUncheckedUpdateWithoutGroupInput>
    create: XOR<GroupMemberCreateWithoutGroupInput, GroupMemberUncheckedCreateWithoutGroupInput>
  }

  export type GroupMemberUpdateWithWhereUniqueWithoutGroupInput = {
    where: GroupMemberWhereUniqueInput
    data: XOR<GroupMemberUpdateWithoutGroupInput, GroupMemberUncheckedUpdateWithoutGroupInput>
  }

  export type GroupMemberUpdateManyWithWhereWithoutGroupInput = {
    where: GroupMemberScalarWhereInput
    data: XOR<GroupMemberUpdateManyMutationInput, GroupMemberUncheckedUpdateManyWithoutGroupInput>
  }

  export type GroupMemberScalarWhereInput = {
    AND?: GroupMemberScalarWhereInput | GroupMemberScalarWhereInput[]
    OR?: GroupMemberScalarWhereInput[]
    NOT?: GroupMemberScalarWhereInput | GroupMemberScalarWhereInput[]
    id?: StringFilter<"GroupMember"> | string
    groupId?: StringFilter<"GroupMember"> | string
    userId?: StringFilter<"GroupMember"> | string
    userName?: StringFilter<"GroupMember"> | string
    role?: StringFilter<"GroupMember"> | string
    joinedAt?: DateTimeFilter<"GroupMember"> | Date | string
  }

  export type StudyGroupCreateWithoutMembersInput = {
    id?: string
    name: string
    description?: string | null
    createdBy: string
    createdAt?: Date | string
  }

  export type StudyGroupUncheckedCreateWithoutMembersInput = {
    id?: string
    name: string
    description?: string | null
    createdBy: string
    createdAt?: Date | string
  }

  export type StudyGroupCreateOrConnectWithoutMembersInput = {
    where: StudyGroupWhereUniqueInput
    create: XOR<StudyGroupCreateWithoutMembersInput, StudyGroupUncheckedCreateWithoutMembersInput>
  }

  export type StudyGroupUpsertWithoutMembersInput = {
    update: XOR<StudyGroupUpdateWithoutMembersInput, StudyGroupUncheckedUpdateWithoutMembersInput>
    create: XOR<StudyGroupCreateWithoutMembersInput, StudyGroupUncheckedCreateWithoutMembersInput>
    where?: StudyGroupWhereInput
  }

  export type StudyGroupUpdateToOneWithWhereWithoutMembersInput = {
    where?: StudyGroupWhereInput
    data: XOR<StudyGroupUpdateWithoutMembersInput, StudyGroupUncheckedUpdateWithoutMembersInput>
  }

  export type StudyGroupUpdateWithoutMembersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StudyGroupUncheckedUpdateWithoutMembersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChallengeParticipantCreateManyRoomInput = {
    id?: string
    userId: string
    userName: string
    userAvatar?: string | null
    userRating?: number
    isHost?: boolean
    isReady?: boolean
    status?: string
    joinedAt?: Date | string
    leftAt?: Date | string | null
  }

  export type MatchSessionCreateManyRoomInput = {
    id?: string
    matchType?: string
    difficulty?: string
    status?: string
    startedAt?: Date | string | null
    endedAt?: Date | string | null
    durationSeconds?: number
    winnerId?: string | null
    resultSummary?: string | null
    problemId?: string | null
    createdAt?: Date | string
  }

  export type ChallengeParticipantUpdateWithoutRoomInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    userName?: StringFieldUpdateOperationsInput | string
    userAvatar?: NullableStringFieldUpdateOperationsInput | string | null
    userRating?: IntFieldUpdateOperationsInput | number
    isHost?: BoolFieldUpdateOperationsInput | boolean
    isReady?: BoolFieldUpdateOperationsInput | boolean
    status?: StringFieldUpdateOperationsInput | string
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    leftAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ChallengeParticipantUncheckedUpdateWithoutRoomInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    userName?: StringFieldUpdateOperationsInput | string
    userAvatar?: NullableStringFieldUpdateOperationsInput | string | null
    userRating?: IntFieldUpdateOperationsInput | number
    isHost?: BoolFieldUpdateOperationsInput | boolean
    isReady?: BoolFieldUpdateOperationsInput | boolean
    status?: StringFieldUpdateOperationsInput | string
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    leftAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ChallengeParticipantUncheckedUpdateManyWithoutRoomInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    userName?: StringFieldUpdateOperationsInput | string
    userAvatar?: NullableStringFieldUpdateOperationsInput | string | null
    userRating?: IntFieldUpdateOperationsInput | number
    isHost?: BoolFieldUpdateOperationsInput | boolean
    isReady?: BoolFieldUpdateOperationsInput | boolean
    status?: StringFieldUpdateOperationsInput | string
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    leftAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type MatchSessionUpdateWithoutRoomInput = {
    id?: StringFieldUpdateOperationsInput | string
    matchType?: StringFieldUpdateOperationsInput | string
    difficulty?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    durationSeconds?: IntFieldUpdateOperationsInput | number
    winnerId?: NullableStringFieldUpdateOperationsInput | string | null
    resultSummary?: NullableStringFieldUpdateOperationsInput | string | null
    problemId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    participants?: MatchParticipantUpdateManyWithoutMatchNestedInput
    submissions?: ChallengeSubmissionUpdateManyWithoutMatchNestedInput
  }

  export type MatchSessionUncheckedUpdateWithoutRoomInput = {
    id?: StringFieldUpdateOperationsInput | string
    matchType?: StringFieldUpdateOperationsInput | string
    difficulty?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    durationSeconds?: IntFieldUpdateOperationsInput | number
    winnerId?: NullableStringFieldUpdateOperationsInput | string | null
    resultSummary?: NullableStringFieldUpdateOperationsInput | string | null
    problemId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    participants?: MatchParticipantUncheckedUpdateManyWithoutMatchNestedInput
    submissions?: ChallengeSubmissionUncheckedUpdateManyWithoutMatchNestedInput
  }

  export type MatchSessionUncheckedUpdateManyWithoutRoomInput = {
    id?: StringFieldUpdateOperationsInput | string
    matchType?: StringFieldUpdateOperationsInput | string
    difficulty?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    durationSeconds?: IntFieldUpdateOperationsInput | number
    winnerId?: NullableStringFieldUpdateOperationsInput | string | null
    resultSummary?: NullableStringFieldUpdateOperationsInput | string | null
    problemId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MatchParticipantCreateManyMatchInput = {
    id?: string
    userId: string
    userName: string
    userAvatar?: string | null
    score?: number
    problemsSolved?: number
    passedTests?: number
    totalTests?: number
    ratingBefore?: number
    ratingAfter?: number
    xpEarned?: number
    status?: string
    submittedAt?: Date | string | null
  }

  export type ChallengeSubmissionCreateManyMatchInput = {
    id?: string
    userId: string
    problemId: string
    language: string
    sourceCode: string
    status?: string
    executionTimeMs?: number
    passedTestCases?: number
    totalTestCases?: number
    score?: number
    stdout?: string | null
    errorDetails?: string | null
    submittedAt?: Date | string
  }

  export type MatchParticipantUpdateWithoutMatchInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    userName?: StringFieldUpdateOperationsInput | string
    userAvatar?: NullableStringFieldUpdateOperationsInput | string | null
    score?: IntFieldUpdateOperationsInput | number
    problemsSolved?: IntFieldUpdateOperationsInput | number
    passedTests?: IntFieldUpdateOperationsInput | number
    totalTests?: IntFieldUpdateOperationsInput | number
    ratingBefore?: IntFieldUpdateOperationsInput | number
    ratingAfter?: IntFieldUpdateOperationsInput | number
    xpEarned?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    submittedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type MatchParticipantUncheckedUpdateWithoutMatchInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    userName?: StringFieldUpdateOperationsInput | string
    userAvatar?: NullableStringFieldUpdateOperationsInput | string | null
    score?: IntFieldUpdateOperationsInput | number
    problemsSolved?: IntFieldUpdateOperationsInput | number
    passedTests?: IntFieldUpdateOperationsInput | number
    totalTests?: IntFieldUpdateOperationsInput | number
    ratingBefore?: IntFieldUpdateOperationsInput | number
    ratingAfter?: IntFieldUpdateOperationsInput | number
    xpEarned?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    submittedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type MatchParticipantUncheckedUpdateManyWithoutMatchInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    userName?: StringFieldUpdateOperationsInput | string
    userAvatar?: NullableStringFieldUpdateOperationsInput | string | null
    score?: IntFieldUpdateOperationsInput | number
    problemsSolved?: IntFieldUpdateOperationsInput | number
    passedTests?: IntFieldUpdateOperationsInput | number
    totalTests?: IntFieldUpdateOperationsInput | number
    ratingBefore?: IntFieldUpdateOperationsInput | number
    ratingAfter?: IntFieldUpdateOperationsInput | number
    xpEarned?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    submittedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ChallengeSubmissionUpdateWithoutMatchInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    problemId?: StringFieldUpdateOperationsInput | string
    language?: StringFieldUpdateOperationsInput | string
    sourceCode?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    executionTimeMs?: IntFieldUpdateOperationsInput | number
    passedTestCases?: IntFieldUpdateOperationsInput | number
    totalTestCases?: IntFieldUpdateOperationsInput | number
    score?: IntFieldUpdateOperationsInput | number
    stdout?: NullableStringFieldUpdateOperationsInput | string | null
    errorDetails?: NullableStringFieldUpdateOperationsInput | string | null
    submittedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChallengeSubmissionUncheckedUpdateWithoutMatchInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    problemId?: StringFieldUpdateOperationsInput | string
    language?: StringFieldUpdateOperationsInput | string
    sourceCode?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    executionTimeMs?: IntFieldUpdateOperationsInput | number
    passedTestCases?: IntFieldUpdateOperationsInput | number
    totalTestCases?: IntFieldUpdateOperationsInput | number
    score?: IntFieldUpdateOperationsInput | number
    stdout?: NullableStringFieldUpdateOperationsInput | string | null
    errorDetails?: NullableStringFieldUpdateOperationsInput | string | null
    submittedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChallengeSubmissionUncheckedUpdateManyWithoutMatchInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    problemId?: StringFieldUpdateOperationsInput | string
    language?: StringFieldUpdateOperationsInput | string
    sourceCode?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    executionTimeMs?: IntFieldUpdateOperationsInput | number
    passedTestCases?: IntFieldUpdateOperationsInput | number
    totalTestCases?: IntFieldUpdateOperationsInput | number
    score?: IntFieldUpdateOperationsInput | number
    stdout?: NullableStringFieldUpdateOperationsInput | string | null
    errorDetails?: NullableStringFieldUpdateOperationsInput | string | null
    submittedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type QuizQuestionCreateManyQuizInput = {
    id?: string
    question: string
    options?: QuizQuestionCreateoptionsInput | string[]
    correctIndex: number
    explanation: string
    topic: string
    difficulty?: string
  }

  export type QuizSessionCreateManyQuizInput = {
    id?: string
    roomCode?: string | null
    status?: string
    currentQuestion?: number
    startedAt?: Date | string | null
    endedAt?: Date | string | null
    durationSeconds?: number
    createdAt?: Date | string
  }

  export type QuizQuestionUpdateWithoutQuizInput = {
    id?: StringFieldUpdateOperationsInput | string
    question?: StringFieldUpdateOperationsInput | string
    options?: QuizQuestionUpdateoptionsInput | string[]
    correctIndex?: IntFieldUpdateOperationsInput | number
    explanation?: StringFieldUpdateOperationsInput | string
    topic?: StringFieldUpdateOperationsInput | string
    difficulty?: StringFieldUpdateOperationsInput | string
  }

  export type QuizQuestionUncheckedUpdateWithoutQuizInput = {
    id?: StringFieldUpdateOperationsInput | string
    question?: StringFieldUpdateOperationsInput | string
    options?: QuizQuestionUpdateoptionsInput | string[]
    correctIndex?: IntFieldUpdateOperationsInput | number
    explanation?: StringFieldUpdateOperationsInput | string
    topic?: StringFieldUpdateOperationsInput | string
    difficulty?: StringFieldUpdateOperationsInput | string
  }

  export type QuizQuestionUncheckedUpdateManyWithoutQuizInput = {
    id?: StringFieldUpdateOperationsInput | string
    question?: StringFieldUpdateOperationsInput | string
    options?: QuizQuestionUpdateoptionsInput | string[]
    correctIndex?: IntFieldUpdateOperationsInput | number
    explanation?: StringFieldUpdateOperationsInput | string
    topic?: StringFieldUpdateOperationsInput | string
    difficulty?: StringFieldUpdateOperationsInput | string
  }

  export type QuizSessionUpdateWithoutQuizInput = {
    id?: StringFieldUpdateOperationsInput | string
    roomCode?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    currentQuestion?: IntFieldUpdateOperationsInput | number
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    durationSeconds?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    answers?: QuizAnswerUpdateManyWithoutSessionNestedInput
  }

  export type QuizSessionUncheckedUpdateWithoutQuizInput = {
    id?: StringFieldUpdateOperationsInput | string
    roomCode?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    currentQuestion?: IntFieldUpdateOperationsInput | number
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    durationSeconds?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    answers?: QuizAnswerUncheckedUpdateManyWithoutSessionNestedInput
  }

  export type QuizSessionUncheckedUpdateManyWithoutQuizInput = {
    id?: StringFieldUpdateOperationsInput | string
    roomCode?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    currentQuestion?: IntFieldUpdateOperationsInput | number
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    durationSeconds?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type QuizAnswerCreateManySessionInput = {
    id?: string
    questionId: string
    userId: string
    userName: string
    selectedIndex: number
    isCorrect?: boolean
    responseTimeMs?: number
    pointsAwarded?: number
    submittedAt?: Date | string
  }

  export type QuizAnswerUpdateWithoutSessionInput = {
    id?: StringFieldUpdateOperationsInput | string
    questionId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    userName?: StringFieldUpdateOperationsInput | string
    selectedIndex?: IntFieldUpdateOperationsInput | number
    isCorrect?: BoolFieldUpdateOperationsInput | boolean
    responseTimeMs?: IntFieldUpdateOperationsInput | number
    pointsAwarded?: IntFieldUpdateOperationsInput | number
    submittedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type QuizAnswerUncheckedUpdateWithoutSessionInput = {
    id?: StringFieldUpdateOperationsInput | string
    questionId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    userName?: StringFieldUpdateOperationsInput | string
    selectedIndex?: IntFieldUpdateOperationsInput | number
    isCorrect?: BoolFieldUpdateOperationsInput | boolean
    responseTimeMs?: IntFieldUpdateOperationsInput | number
    pointsAwarded?: IntFieldUpdateOperationsInput | number
    submittedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type QuizAnswerUncheckedUpdateManyWithoutSessionInput = {
    id?: StringFieldUpdateOperationsInput | string
    questionId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    userName?: StringFieldUpdateOperationsInput | string
    selectedIndex?: IntFieldUpdateOperationsInput | number
    isCorrect?: BoolFieldUpdateOperationsInput | boolean
    responseTimeMs?: IntFieldUpdateOperationsInput | number
    pointsAwarded?: IntFieldUpdateOperationsInput | number
    submittedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GroupMemberCreateManyGroupInput = {
    id?: string
    userId: string
    userName: string
    role?: string
    joinedAt?: Date | string
  }

  export type GroupMemberUpdateWithoutGroupInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    userName?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GroupMemberUncheckedUpdateWithoutGroupInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    userName?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GroupMemberUncheckedUpdateManyWithoutGroupInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    userName?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
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