/**
 * 以适当频率生成时钟，用来处理流
 */
interface IClock {
    abort(): void
}


/**
 * 显示器刷新时钟
 */
export function vsync(func: FrameRequestCallback): IClock {
    let task: number

    const wrapper = (dt: number) => {
        func.call(undefined, dt)
        task = requestAnimationFrame(wrapper)
    }

    const abort = () => cancelAnimationFrame(task)

    task = requestAnimationFrame(wrapper)

    return { abort }
}


/**
 * 空闲时钟
 * 每当浏览器在帧之间有空闲时间时才会执行
 */
export function clock(func: IdleRequestCallback, timeout = 1000): IClock {
    let task: number
    const abort = () => cancelIdleCallback(task)

    const wrapper = (deadline: IdleDeadline) => {
        func.call(undefined, deadline)
        task = requestIdleCallback(wrapper, { timeout })
    }

    task = requestIdleCallback(wrapper)

    return { abort }
}