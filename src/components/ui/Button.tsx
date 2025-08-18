import React, { forwardRef, ButtonHTMLAttributes, ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const buttonVariants = cva(
  `
  relative inline-flex items-center justify-center gap-2
  font-semibold tracking-tight transition-all duration-200
  disabled:opacity-50 disabled:cursor-not-allowed
  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
  active:scale-[0.98]
  `,
  {
    variants: {
      variant: {
        primary: `
          bg-gradient-to-r from-blue-600 to-blue-700
          text-white shadow-lg shadow-blue-600/25
          hover:from-blue-700 hover:to-blue-800 hover:shadow-xl hover:shadow-blue-600/30
          focus-visible:ring-blue-600
          border border-blue-700
        `,
        emergency: `
          bg-gradient-to-r from-red-600 to-red-700
          text-white shadow-lg shadow-red-600/25
          hover:from-red-700 hover:to-red-800 hover:shadow-xl hover:shadow-red-600/30
          focus-visible:ring-red-600
          border border-red-700
          before:absolute before:inset-0 before:rounded-inherit
          before:animate-ping before:bg-red-600 before:opacity-0
          hover:before:opacity-20
        `,
        cooling: `
          bg-gradient-to-r from-cyan-500 to-cyan-600
          text-white shadow-lg shadow-cyan-500/25
          hover:from-cyan-600 hover:to-cyan-700 hover:shadow-xl hover:shadow-cyan-500/30
          focus-visible:ring-cyan-500
          border border-cyan-600
        `,
        heating: `
          bg-gradient-to-r from-orange-500 to-orange-600
          text-white shadow-lg shadow-orange-500/25
          hover:from-orange-600 hover:to-orange-700 hover:shadow-xl hover:shadow-orange-500/30
          focus-visible:ring-orange-500
          border border-orange-600
        `,
        secondary: `
          bg-white dark:bg-gray-800
          text-gray-900 dark:text-gray-100
          border-2 border-gray-200 dark:border-gray-700
          hover:bg-gray-50 dark:hover:bg-gray-700
          hover:border-gray-300 dark:hover:border-gray-600
          focus-visible:ring-gray-400
          shadow-sm hover:shadow-md
        `,
        ghost: `
          bg-transparent
          text-gray-700 dark:text-gray-300
          hover:bg-gray-100 dark:hover:bg-gray-800
          hover:text-gray-900 dark:hover:text-gray-100
          focus-visible:ring-gray-400
        `,
        outline: `
          bg-transparent
          border-2 border-blue-600 dark:border-blue-400
          text-blue-600 dark:text-blue-400
          hover:bg-blue-50 dark:hover:bg-blue-950
          hover:border-blue-700 dark:hover:border-blue-300
          hover:text-blue-700 dark:hover:text-blue-300
          focus-visible:ring-blue-600
        `,
        success: `
          bg-gradient-to-r from-green-600 to-green-700
          text-white shadow-lg shadow-green-600/25
          hover:from-green-700 hover:to-green-800 hover:shadow-xl hover:shadow-green-600/30
          focus-visible:ring-green-600
          border border-green-700
        `,
      },
      size: {
        xs: 'h-7 px-3 text-xs rounded-md',
        sm: 'h-9 px-4 text-sm rounded-lg',
        md: 'h-11 px-6 text-base rounded-lg',
        lg: 'h-13 px-8 text-lg rounded-xl',
        xl: 'h-16 px-10 text-xl rounded-xl',
        icon: 'h-10 w-10 rounded-lg',
      },
      fullWidth: {
        true: 'w-full',
        false: 'w-auto',
      },
      loading: {
        true: 'cursor-wait',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      fullWidth: false,
      loading: false,
    },
  }
);

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  children: ReactNode;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  loading?: boolean;
  loadingText?: string;
  ripple?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      fullWidth,
      loading,
      loadingText,
      children,
      leftIcon,
      rightIcon,
      ripple = true,
      disabled,
      onClick,
      ...props
    },
    ref
  ) => {
    const [ripples, setRipples] = React.useState<Array<{ x: number; y: number; size: number }>>([]);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (ripple && !disabled && !loading) {
        const button = e.currentTarget;
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        const newRipple = { x, y, size };
        setRipples((prev) => [...prev, newRipple]);

        setTimeout(() => {
          setRipples((prev) => prev.slice(1));
        }, 600);
      }

      if (onClick) {
        onClick(e);
      }
    };

    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size, fullWidth, loading, className }))}
        disabled={disabled || loading}
        onClick={handleClick}
        {...props}
      >
        {/* Ripple Effect Container */}
        {ripple && (
          <span className="absolute inset-0 overflow-hidden rounded-inherit">
            {ripples.map((ripple, index) => (
              <span
                key={index}
                className="absolute animate-ripple rounded-full bg-white/30"
                style={{
                  left: ripple.x,
                  top: ripple.y,
                  width: ripple.size,
                  height: ripple.size,
                }}
              />
            ))}
          </span>
        )}

        {/* Loading Spinner */}
        {loading && (
          <svg
            className="mr-2 h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}

        {/* Button Content */}
        <span className="relative z-10 flex items-center gap-2">
          {!loading && leftIcon}
          {loading && loadingText ? loadingText : children}
          {!loading && rightIcon}
        </span>

        {/* Shine Effect on Hover */}
        <span className="absolute inset-0 -top-[2px] h-[2px] bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };

// Add these styles to your global CSS
/* const buttonStyles = `
@keyframes ripple {
  0% {
    transform: scale(0);
    opacity: 1;
  }
  100% {
    transform: scale(4);
    opacity: 0;
  }
}

.animate-ripple {
  animation: ripple 600ms ease-out;
}

.rounded-inherit {
  border-radius: inherit;
}
`; */