import type {Output} from './consumer'

type TypeOnData<T> = (data: T) => void

/**
 * 输入
 */
export interface Input<T> {
    pipe(port: Output<T>): void
    ondata: TypeOnData<T>
}

export abstract class InputStream<T> implements Input<T> {

    static nullFunc: TypeOnData<any> = () => {}

    pipe(port: Output<T>): void {
        let _ondata: TypeOnData<T> = InputStream.nullFunc

        if (typeof this.ondata === 'function') {
            _ondata = this.ondata
        }

        this.ondata = (data: T) => {
            _ondata.call(this, data)
            port.put.call(port, data)
        }
    }

    abstract ondata(data: T): void
}