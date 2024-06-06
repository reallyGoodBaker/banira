import { Output } from './consumer'
import { Effect } from './effect'
import { Input, InputStream } from './producer'
import { Observable, Observer } from './observable'

const mainEventStream: Event[] = []

class EventObservable implements Observable<Event> {

    static Events = new Map<string, EventObservable>()
    static getInstance(type: string) {
        let instance: EventObservable | undefined

        if (instance = this.Events.get(type)) {
            return instance
        }

        instance = new EventObservable()
        this.Events.set(type, instance)

        return instance
    }

    private _events: (Observer<Event>)[] = []

    add(o: Observer<Event>): void {
        if (this._events.includes(o)) {
            return
        }

        this._events.push(o)
    }

    remove(o: Observer<Event>): void {
        if (!this._events.includes(o)) {
            return
        }

        const ev = this._events
        const index = ev.indexOf(o)

        this._events = ev.slice(0, index).concat(ev.slice(index + 1))
    }

    fire(data: Event): void {
        this._events
            .slice(0)
            .forEach(observer => observer.call(undefined, data))
    }

}

/**
 * 将 Event 克隆以防失效
 */
function cloneEvent(ev: Event): Event {
    let cloned = {}

    for (const k in ev) {
        //@ts-ignore
        cloned[k] = ev[k]
    }

    return cloned as Event
}

const FunctionFactory = {
    map: new WeakMap<HTMLElement, Observer<Event>>(),
    singleton(f: Observer<Event>, el: HTMLElement) {
        let fn: Observer<Event> | undefined
        if (fn = FunctionFactory.map.get(el)) {
            return f
        }

        FunctionFactory.map.set(el, f)
        return f
    }
}

/**
 * 事件输入
 */
export function event(element: HTMLElement, type: keyof HTMLElementEventMap) {
    let ev: Output<Event> | undefined

    // if (ev = mainEventStream.includes(type)) {
    //     return ev
    // }

    // ev = 
}