import React, { ReactNode, ElementType, ButtonHTMLAttributes } from 'react'
import classNames from 'classnames'

import SpinnerIcon from '@icons/spinner.svg'

const variantClassNames = {
  primary:
    'text-white bg-primary hover:bg-primary-hover disabled:bg-primary disabled:opacity-50',
  secondary:
    'bg-secondary hover:bg-secondary-hover text-primary disabled:bg-secondary disabled:opacity-50',
}

const sizeClassNames = {
  small: 'py-2 px-4 text-sm',
  medium: 'py-2.5 px-6',
  large: 'py-3.5 px-7',
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variantClassNames
  size?: keyof typeof sizeClassNames
  children: ReactNode
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  disabled?: boolean
  loading?: boolean
  fullWidth?: boolean
  as?: ElementType
}

const Button = React.forwardRef(
  (
    {
      children,
      leftIcon,
      rightIcon,
      variant = 'primary',
      size = 'medium',
      disabled,
      loading,
      as: Tag = 'button',
      fullWidth,
      className,
      ...props
    }: ButtonProps,
    forwardedRef,
  ) => {
    return (
      <Tag
        {...props}
        aria-busy={loading}
        disabled={disabled || loading}
        ref={forwardedRef}
        className={classNames(
          variantClassNames[variant],
          sizeClassNames[size],
          'rounded-default',
          'focus:outline-none',
          'focus:ring-4',
          'ring-blue-light',
          'disabled:cursor-not-allowed',
          'relative',
          'inline-flex',
          'items-center',
          'justify-center',
          'cursor-pointer',
          { 'w-full': fullWidth },
          className,
        )}
      >
        <span
          className={classNames('flex justify-center items-center', {
            'opacity-0': loading,
          })}
        >
          {leftIcon && (
            <span className="mr-1 fill-current w-5">{leftIcon}</span>
          )}
          {children}
          {rightIcon && (
            <span className="ml-1 fill-current w-5">{rightIcon}</span>
          )}
        </span>
        {loading && <SpinnerIcon className="animate-spin w-4 absolute" />}
      </Tag>
    )
  },
)

Button.displayName = 'Button'

export default Button
