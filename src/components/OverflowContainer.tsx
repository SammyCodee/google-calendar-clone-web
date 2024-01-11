import {
    type ReactNode,
    type Key,
    useState,
    useRef,
    useLayoutEffect,
} from "react";

type OverflowContainerProps<T> = {
    items: T[];
    getKey: (item: T) => Key;
    renderItem: (item: T) => ReactNode;
    renderOverflow: (overflowAmount: number) => ReactNode;
    className?: string;
};

export function OverflowContainer<T>({
    items,
    getKey,
    renderItem,
    renderOverflow,
    className,
}: OverflowContainerProps<T>) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [overflowAmount, setOverflowAmount] = useState(0);

    useLayoutEffect(() => {
        if (containerRef.current == null) return;

        const observer = new ResizeObserver((entries) => {
            console.log("entries", entries);
            const containerElement = entries[0]?.target;
            if (containerElement == null) return;

            const children =
                containerElement.querySelectorAll<HTMLElement>("[data-item]");

            const overflowElement =
                containerElement.parentElement?.querySelector<HTMLElement>(
                    "[data-overflow]"
                );

            //hide by default
            if (overflowElement != null) overflowElement.style.display = "none";

            //visible by default
            children.forEach((child) => child.style.removeProperty("display"));

            let amount = 0;

            for (let i = children.length - 1; i >= 0; i--) {
                const child = children[i];
                /**
                 * The scrolling section is smaller or equal to the actual size of the container
                 * Below is to check if the child is overflowing
                 * If this is not true, meaning child is overflowing
                 */
                if (
                    containerElement.scrollHeight <=
                    containerElement.clientHeight
                ) {
                    break;
                }

                //actual amount of elements that are overflowing
                amount = children.length - i;
                console.log("children length", children.length);
                console.log("i", i);
                console.log("amount", amount);
                /**
                 * So below gonna hide the child since it is overflowing
                 */

                //hide the element
                child.style.display = "none";

                //turn to visible
                overflowElement?.style.removeProperty("display");
            }

            setOverflowAmount(amount);
        });

        observer.observe(containerRef.current);

        return () => observer.disconnect();
    }, [items]);

    return (
        <>
            <div className={className} ref={containerRef}>
                {items.map((item) => (
                    <div data-item key={getKey(item)}>
                        {renderItem(item)}
                    </div>
                ))}
            </div>
            <div data-overflow>{renderOverflow(overflowAmount)}</div>
        </>
    );
}
