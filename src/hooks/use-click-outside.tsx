"use client"

import { useEffect, useRef } from "react"

export function useClickOutside<T extends HTMLElement>(callback: () => void, enabled = true) {
    const ref = useRef<T>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                callback()
            }
        }

        if (enabled) {
            document.addEventListener("mousedown", handleClickOutside)
            document.addEventListener("touchstart", handleClickOutside as EventListener)
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
            document.removeEventListener("touchstart", handleClickOutside as EventListener)
        }
    }, [callback, enabled])

    return ref
}
