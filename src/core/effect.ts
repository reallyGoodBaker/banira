import {Output} from './consumer'
import {Input} from './producer'

type EffectHandler<T> = (ef: T) => T | undefined

/**
 * 副作用流（过滤流）
 */
export interface Filter<T> extends Output<T>, Input<T> {
    effect(f: EffectHandler<T>): void
}

export class Effect<T> implements Filter<T> {

    private _effects: (EffectHandler<T>)[] = []
    private _next: Output<T> | null = null

    effect(f: EffectHandler<T>): void {
        if (this._effects.includes(f)) {
            return
        }

        this._effects.push(f)
    }

    put(msg: T): void {
        this.ondata.call(this, msg)
    }

    pipe(port: Output<T>): void {
        this._next = port
    }

    ondata(data: T): void {
        this._effects.forEach(f => {
            const val = f.call(undefined, data)

            if (typeof val === 'undefined') {
                return
            }

            if (!this._next) {
                return
            }

            this._next.put(val)
        })
    }

}