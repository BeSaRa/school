export type ConstructorType<T> = new (...args: any[]) => T;
export type AbstractConstructorType<T> = abstract new (...args: any[]) => T;
