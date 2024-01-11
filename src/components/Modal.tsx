import { ReactNode, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { cc } from "../utils/cc";

export type ModalProps = {
    children: ReactNode;
    isOpen: boolean;
    onClose: () => void;
};

export function Modal({ children, isOpen, onClose }: ModalProps) {
    //the process of closing
    const [isClosing, setIsClosing] = useState(false);

    const prevIsOpen = useRef<boolean>();

    useEffect(() => {
        function handler(e: KeyboardEvent) {
            if (e.key === "Escape") onClose();
        }

        document.addEventListener("keydown", handler);

        return () => {
            document.removeEventListener("keydown", handler);
        };
    }, [onClose]);

    /**
     * if we actually change our isOpen and prevIsOpen, we have to make sure this goes into effect
     * before Modal component re-render
     * Will run useLayoutEffect first before browser repaint the UI
     * Run before the re-render, usually use for animation
     * Designed to handle side effects that require immediate DOM layout updates
     * https://blog.logrocket.com/react-useeffect-vs-uselayouteffect-hooks-examples/
     */
    useLayoutEffect(() => {
        //went from open to close
        if (!isOpen && prevIsOpen.current) {
            setIsClosing(true);
        }
        prevIsOpen.current = isOpen;
    }, [isOpen]);

    if (!isOpen && !isClosing) return null;

    return createPortal(
        <div
            onAnimationEnd={() => setIsClosing(false)}
            className={cc("modal", isClosing && "closing")}
        >
            <div className="overlay" onClick={onClose}></div>
            <div className="modal-body">{children}</div>
        </div>,
        document.querySelector("#modal-container") as HTMLElement
    );
}
