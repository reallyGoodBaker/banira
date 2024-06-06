/**
 * 输出
 */
export interface Output<T> {
    put(msg: T): void
}