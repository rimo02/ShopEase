import { useEffect, useRef, useState } from "react";

export function useInView(threshold, rootMargin) {
    const ref = useRef(null)
    const [isInView, setIsInView] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true);
                    observer.disconnect()
                }
            },
            {
                threshold,
                rootMargin
            }
        );

        if (ref.current) {
            observer.observe(ref.current)
        }
        return () => observer.disconnect()
    }, [threshold, rootMargin])

    return { ref, isInView }
}