import { useEffect, useRef } from "react"

/**
 * cancels any pending api call when user navigates to another page 
 * @returns ref of abortController and function to replace it with new
 */
export const useAbortController = () => {
    const signalRef = useRef(new AbortController());

    useEffect(() => {
        return () => {
            console.log("abortController use effect")
            signalRef.current.abort("user switched page");

            // when component re-renders due to strict mode, abort is triggered and aborted property is set to true which causes
            // all the ongoing and further requests to cancel. So a new abortControlled is created to use for future requests
            signalRef.current = new AbortController();
            // renewController();
        }
    }, [])

    /**
     * replaces signalRef with new AbortController
     */
    const renewController = () => {
        signalRef.current = new AbortController();
    }

    return {
        signalRef, renewController
    }
}