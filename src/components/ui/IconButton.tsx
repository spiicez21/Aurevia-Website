import React from 'react';
import { cva, VariantProps } from 'class-variance-authority';
import { twMerge } from 'tailwind-merge';

const iconButtonClasses = cva(
  'inline-flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-80',
  {
    variants: {
      variant: {
        default: 'focus:ring-white/20',
        primary: 'focus:ring-blue-500/50',
        secondary: 'focus:ring-gray-500/50',
      },
      size: {
        small: 'w-8 h-8',
        medium: 'w-10 h-10',
        large: 'w-12 h-12',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'medium',
    },
  }
);

interface IconButtonProps extends 
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof iconButtonClasses> {
  src: string;
  alt?: string;
  fill_background_color?: string;
  border_border?: string;
  border_border_radius?: string;
  effect_box_shadow?: string;
  padding?: string;
  layout_width?: string;
  w_h?: string;
  variant?: 'default' | 'primary' | 'secondary';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  className?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const IconButton = ({
  src,
  alt = "icon",
  fill_background_color = "#262624",
  border_border = "0 solid #ffffff7f",
  border_border_radius = "0px",
  effect_box_shadow = "0px 4px 13px #00000056",
  padding = "8px",
  layout_width = "auto",
  w_h = "40*40",
  variant,
  size,
  disabled = false,
  className,
  onClick,
  ...props
}: IconButtonProps) => {
  const [width, height] = w_h.split('*').map(val => val.trim());

  const getBackgroundColor = () => {
    if (fill_background_color === "#262624") return "bg-iconbutton-backgroundSecondary";
    if (fill_background_color === "#1e1e1e") return "bg-iconbutton-background";
    return `bg-[${fill_background_color}]`;
  };

  const getBorderRadius = () => {
    if (border_border_radius === "0px") return "rounded-none";
    if (border_border_radius === "14px") return "rounded-md";
    if (border_border_radius === "16px") return "rounded-lg";
    if (border_border_radius === "20px") return "rounded-xl";
    return `rounded-[${border_border_radius}]`;
  };

  const getBorder = () => {
    if (border_border === "0 solid #ffffff7f") return "border-0";
    const borderParts = border_border.split(' ');
    if (borderParts.length >= 3) {
      const borderWidth = borderParts[0];
      const borderStyle = borderParts[1];
      const borderColor = borderParts[2];
      
      if (borderColor === "#ffffff7f") {
        return `border-[${borderWidth}] border-${borderStyle} border-iconbutton-border`;
      }
      return `border-[${borderWidth}] border-${borderStyle} border-[${borderColor}]`;
    }
    return `border-[${border_border}]`;
  };

  const getBoxShadow = () => {
    if (effect_box_shadow === "0px 4px 13px #00000056") {
      return "shadow-[0px_4px_13px_#00000056]";
    }
    if (effect_box_shadow === "0px 4px 15px #000000a5") {
      return "shadow-[0px_4px_15px_#000000a5]";
    }
    return `shadow-[${effect_box_shadow}]`;
  };

  const getPadding = () => {
    if (padding === "8px") return "p-[8px]";
    if (padding === "4px") return "p-[4px]";
    return `p-[${padding}]`;
  };

  const getWidth = () => {
    if (layout_width === "auto") return "w-auto";
    return `w-[${layout_width}]`;
  };

  const buttonClasses = twMerge(
    iconButtonClasses({ variant, size }),
    getBackgroundColor(),
    getBorder(),
    getBorderRadius(),
    getBoxShadow(),
    getPadding(),
    getWidth(),
    `w-[${width}px] h-[${height}px]`,
    className
  );

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    if (typeof onClick === 'function') {
      onClick(event);
    }
  };

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={handleClick}
      className={buttonClasses}
      aria-disabled={disabled}
      {...props}
    >
      <img 
        src={src} 
        alt={alt}
        className={`w-[${width}px] h-[${height}px] object-contain`}
      />
    </button>
  );
};

export default IconButton;