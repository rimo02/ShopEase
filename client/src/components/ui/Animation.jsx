import { useInView } from "../../hooks/useInView"
import { cn } from "../../lib/utils";

const Animation = ({
    children,
    className,
    animation = 'fade-in-up',
    delay = 'delay-100',
    threshold = 0.1,
    rootMargin = "-50px"
}) => {

    const { ref, isInView } = useInView(threshold, rootMargin);

    return (
        <div
            ref={ref}
            className={cn(
                isInView ? `animate-${animation} ${delay}` : 'opacity-0',
                className
            )}
        >
            {children}
        </div>
    )

}

export default Animation