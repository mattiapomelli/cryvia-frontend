import React, { Fragment, ReactNode } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import classNames from 'classnames'

export interface BaseModalProps {
  show: boolean
  onClose: () => void
}

export interface ModalProps extends BaseModalProps {
  children: ReactNode
  title?: string
  size?: 'medium' | 'large'
  closable?: boolean
}

const Modal = ({
  show,
  onClose,
  title,
  size = 'medium',
  children,
  closable = true,
}: ModalProps) => {
  return (
    <Transition appear show={show} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-20 overflow-y-auto"
        onClose={closable ? onClose : () => undefined}
      >
        <div className="min-h-screen px-4 flex justify-center items-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div
              className={classNames(
                'inline-block w-full py-6 px-5 sm:px-6 align-middle transition-all transform bg-white shadow-xl rounded-2xl mb-10',
                size === 'large' ? 'max-w-3xl' : 'max-w-md',
              )}
            >
              {title && (
                <h3 className="text-xl font-bold mb-4 text-center">{title}</h3>
              )}
              {children}
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  )
}

export default Modal
