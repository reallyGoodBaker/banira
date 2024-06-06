export interface Observable<T> {
    add(o: Observer<T>): void
    remove(o: Observer<T>): void
    fire(data: T): void
}

export type Observer<T> = (arg: T) => void