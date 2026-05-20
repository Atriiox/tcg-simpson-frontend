import { useRef } from "react";
import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { FaTimes } from "react-icons/fa";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, children }: Props) {
  const lastChildren = useRef(children);

  if (isOpen) {
    lastChildren.current = children;
  }

  return (
    <Transition show={isOpen}>
      <Dialog onClose={onClose} className="relative z-50">
        <TransitionChild
          enter="transition duration-300 ease-out"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition duration-300 ease-in"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div
            className="fixed inset-0 bg-simpson-dark/40 backdrop-blur-sm"
            aria-hidden="true"
          />
        </TransitionChild>

        <div className="fixed inset-0 flex min-h-full items-center justify-center p-4">
          <TransitionChild
            enter="transition duration-300 ease-out"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="transition duration-300 ease-in"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <DialogPanel className="relative w-full max-w-lg mx-auto bg-white dark:bg-simpson-darklight text-text p-2 rounded-xl shadow-xl border border-simpson-gray dark:border-simpson-dark text-left flex flex-col gap-4 overflow-y-auto max-h-[90vh]">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 text-text/40 hover:text-text transition-colors rounded-full hover:bg-simpson-light dark:hover:bg-simpson-darklight cursor-pointer"
                aria-label="Fermer la modale"
              >
                <FaTimes className="w-4 h-4" />
              </button>
              {lastChildren.current}
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
}
