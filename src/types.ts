import * as mongoose from 'mongoose';

/**
 * Get the Type of an instance of a Document with Class properties
 * @public
 * @example
 * ```ts
 * class Name {}
 * const NameModel = Name.getModelForClass(Name);
 *
 * const t: InstanceType<Name> = await NameModel.create({} as Partitial<Name>);
 * ```
 */
export type DocumentType<T> = T & mongoose.Document;
/**
 * Used Internally for ModelTypes
 * @internal
 */
export type ModelType<T> = mongoose.Model<DocumentType<T>> & T;
/**
 * Any-param Constructor
 * @internal
 */
export type AnyParamConstructor<T> = new (...args: any) => T;
/**
 * The Type of a Model that gets returned by "getModelForClass" and "setModelForClass"
 */
export type ReturnModelType<U extends AnyParamConstructor<T>, T = any> = ModelType<InstanceType<U>> & U;

/** @internal */
export type Func = (...args: any[]) => any;

export type RequiredType = boolean | [boolean, string] | string | Func | [Func, string];

export type ValidatorFunction = (value: any) => boolean | Promise<boolean>;
export type Validator =
  | ValidatorFunction
  | RegExp
  | {
    validator: ValidatorFunction;
    message?: string;
  };

export interface BasePropOptions {
  [key: string]: any;
  /** include this value?
   * @default true (Implicitly)
   */
  select?: boolean;
  /** is this value required?
   * @default false (Implicitly)
   */
  required?: RequiredType;
  /** Only accept Values from the Enum(|Array) */
  enum?: string[] | object;
  /** Give the Property a default Value */
  default?: any;
  /** Give an Validator RegExp or Function */
  validate?: Validator | Validator[];
  /** should this value be unique?
   * @link https://docs.mongodb.com/manual/indexes/#unique-indexes
   */
  unique?: boolean;
  /** should this value get an index?
   * @link https://docs.mongodb.com/manual/indexes
   */
  index?: boolean;
  /** @link https://docs.mongodb.com/manual/indexes/#sparse-indexes */
  sparse?: boolean;
  /** when should this property expire?
   * @link https://docs.mongodb.com/manual/tutorial/expire-data
   */
  expires?: string | number;
  /** should subdocuments get their own id?
   * @default true (Implicitly)
   */
  _id?: boolean;
  /**
   * Set an Setter (Non-Virtual) to pre-process your value
   * (when using get/set both are required)
   * Please note that the option `type` is required, if get/set saves a different value than what is defined
   * @param value The Value that needs to get modified
   * @returns The Value, but modified OR anything
   * @example
   * ```ts
   * function setHello(val: string): string {
   *   return val.toLowerCase()
   * }
   * function getHello(val: string): string {
   *   return val.toUpperCase();
   * }
   * class Dummy {
   *   @prop({ set: setHello, get: getHello }) // many options can be used, like required
   *   public hello: string;
   * }
   * ```
   */
  set?(val: any): any;
  /**
   * Set an Getter (Non-Virtual) to Post-process your value
   * (when using get/set both are required)
   * Please note that the option `type` is required, if get/set saves a different value than what is defined
   * @param value The Value that needs to get modified
   * @returns The Value, but modified OR anything
   * @example
   * ```ts
   * function setHello(val: string): string {
   *   return val.toLowerCase()
   * }
   * function getHello(val: string): string {
   *   return val.toUpperCase();
   * }
   * class Dummy {
   *   @prop({ set: setHello, get: getHello }) // many options can be used, like required
   *   public hello: string;
   * }
   * ```
   */
  get?(val: any): any;
  /**
   * This may be needed if get/set is used
   * (this sets the type how it is saved to the DB)
   */
  type?: any;
  /**
   * Make a property read-only
   * @example
   * ```ts
   * class SomeClass {
   *  @prop({ immutable: true })
   *  public someprop: Readonly<string>;
   * }
   * ```
   */
  immutable?: boolean;
}

export interface PropOptions extends BasePropOptions {
  /** Reference an other Document (you should use Ref<T> as Prop type) */
  ref?: any;
  /** Take the Path and try to resolve it to a Model */
  refPath?: string;
  /**
   * Give the Property an alias in the output
   * Note: you should include the alias as a variable in the class, but not with a prop decorator
   * @example
   * ```ts
   * class Dummy {
   *   @prop({ alias: "helloWorld" })
   *   public hello: string; // normal, with @prop
   *   public helloWorld: string; // is just for type Completion, will not be included in the DB
   * }
   * ```
   */
  alias?: string;
}

export interface ValidateNumberOptions {
  /** The Number must be at least this high */
  min?: number | [number, string];
  /** The Number can only be lower than this */
  max?: number | [number, string];
}

export interface ValidateStringOptions {
  /** Only Allowes if the value matches an RegExp */
  match?: RegExp | [RegExp, string];
  /** Only Allowes if the value is in the Enum */
  enum?: string[];
  /** Only Allowes if the value is at least the lenght */
  minlength?: number | [number, string];
  /** Only Allowes if the value is not longer than the maxlenght */
  maxlength?: number | [number, string];
}

export interface TransformStringOptions {
  /** Should it be lowercased before save? */
  lowercase?: boolean;
  /** Should it be uppercased before save? */
  uppercase?: boolean;
  /** Should it be trimmed before save? */
  trim?: boolean;
}

export interface VirtualOptions {
  /** Reference an other Document (you should use Ref<T> as Prop type) */
  ref: any;
  /** Which property(on the current-Class) to match `foreignField` against */
  localField: string;
  /** Which property(on the ref-Class) to match `localField` against */
  foreignField: string;
  /** Return as One Document(true) or as Array(false) */
  justOne?: boolean;
  /** Return the number of Documents found instead of the actual Documents */
  count?: boolean;
  /**
   * DEPRECATED (see README#Migrate to 6.0.0)
   * @deprecated
   */
  overwrite: boolean;
}

export type PropOptionsWithNumberValidate = PropOptions & ValidateNumberOptions;
export type PropOptionsWithStringValidate = PropOptions & TransformStringOptions & ValidateStringOptions;
export type PropOptionsWithValidate = PropOptionsWithNumberValidate | PropOptionsWithStringValidate | VirtualOptions;

export type RefType = number | string | mongoose.Types.ObjectId | Buffer;
export type RefSchemaType = typeof mongoose.Schema.Types.Number |
  typeof mongoose.Schema.Types.String |
  typeof mongoose.Schema.Types.Buffer |
  typeof mongoose.Schema.Types.ObjectId;

/**
 * Reference another Model
 * @public
 */
export type Ref<R, T extends RefType = mongoose.Types.ObjectId> = R | T;

/**
 * An Function type for a function that dosnt have any arguments and dosnt return anything
 */
export type EmptyVoidFn = () => void;

export interface ArrayPropOptions extends BasePropOptions {
  /** What array is it?
   * Note: this is only needed because Reflect & refelact Metadata cant give an accurate Response for an array
   */
  items?: any;
  /** Same as {@link PropOptions.ref}, only that it is for an array */
  itemsRef?: any;
  /** Same as {@link PropOptions.refPath}, only that it is for an array */
  itemsRefPath?: any;
  /** Same as {@link PropOptions.refType}, only that it is for an array */
  itemsRefType?: RefSchemaType;
  /**
   * Use this to define inner-options
   * Reason this exists: https://github.com/Automattic/mongoose/issues/8012#issuecomment-530950625
   * Every other option (that is not in an interface here), that is not defined in here will be "outer-options"
   *
   * Please open a new issue if some option is mismatched or not existing / mapped
   */
  innerOptions?: {
    [key: string]: any;
  };
  /**
   * Use this to define outer-options
   * Reason this exists: https://github.com/Automattic/mongoose/issues/8012#issuecomment-530950625
   * this is used to override mapped options to be always outer-options
   *
   * Please open a new issue if some option is mismatched or not existing / mapped
   */
  outerOptions?: {
    [key: string]: any;
  };
}

export interface MapPropOptions extends BasePropOptions {
  /**
   * The type of the Map (Map<string, THIS>)
   */
  of?: any;
}

export interface IModelOptions {
  /** An Existing Mongoose Connection */
  existingMongoose?: mongoose.Mongoose;
  /** Supports all Mongoose's Schema Options */
  schemaOptions?: mongoose.SchemaOptions;
  /** An Existing Connection */
  existingConnection?: mongoose.Connection;
  /** Typegoose Custom Options */
  options?: {
    /**
     * Set a custom suffix for the model
     * @default schemaOptions.collection
     */
    customName?: string;
  };
}

export interface ImapArrayOptions {
  outerOptions: Omit<ArrayPropOptions, 'innerOptions'>;
  innerOptions: { [key: string]: any };
}
