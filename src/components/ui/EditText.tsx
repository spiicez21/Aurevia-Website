import React from 'react';
import { cva, VariantProps } from 'class-variance-authority';
import { twMerge } from 'tailwind-merge';

const editTextClasses = cva(
  'w-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        default: 'focus:ring-white/20',
        primary: 'focus:ring-blue-500/50',
        secondary: 'focus:ring-gray-500/50',
      },
      size: {
        small: 'text-xs px-3 py-2',
        medium: 'text-sm px-4 py-3',
        large: 'text-base px-5 py-4',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'medium',
    },
  }
);

interface EditTextProps extends 
  React.InputHTMLAttributes<HTMLInputElement>,
  VariantProps<typeof editTextClasses> {
  // Required parameters with defaults
  placeholder?: string;
  text_font_size?: string;
  text_font_family?: string;
  text_font_weight?: string;
  text_line_height?: string;
  text_text_align?: 'left' | 'center' | 'right' | 'justify';
  text_color?: string;
  fill_background_color?: string;
  border_border?: string;
  border_border_radius?: string;
  effect_box_shadow?: string;
  
  // Optional parameters (no defaults)
  layout_width?: string;
  padding?: string;
  position?: string;
  
  // Standard React props
  variant?: 'default' | 'primary' | 'secondary';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  className?: string;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  type?: string;
}

const EditText = ({
  // Required parameters with defaults
  placeholder = "How can i help you ?",
  text_font_size = "12",
  text_font_family = "Inter",
  text_font_weight = "400",
  text_line_height = "15px",
  text_text_align = "left",
  text_color = "#ffffff33",
  fill_background_color = "#262624",
  border_border = "0 solid #ffffff7f",
  border_border_radius = "14px",
  effect_box_shadow = "0px 4px 15px #000000a5",
  
  // Optional parameters (no defaults)
  layout_width,
  padding,
  position,
  
  // Standard React props
  variant,
  size,
  disabled = false,
  className,
  value,
  onChange,
  onFocus,
  onBlur,
  type = "text",
  ...props
}: EditTextProps) => {
  // Safe validation for optional parameters
  const hasValidWidth = layout_width && typeof layout_width === 'string' && layout_width.trim() !== '';
  const hasValidPadding = padding && typeof padding === 'string' && padding.trim() !== '';
  const hasValidPosition = position && typeof position === 'string' && position.trim() !== '';

  // Build optional Tailwind classes
  const optionalClasses = [
    hasValidWidth ? `w-[${layout_width}]` : '',
    hasValidPadding ? `p-[${padding}]` : '',
    hasValidPosition ? position : '',
  ].filter(Boolean).join(' ');

  // Map style values to Tailwind classes or use hardcoded values
  const getFontSize = () => {
    if (text_font_size === "12") return "text-xs";
    return `text-[${text_font_size}px]`;
  };

  const getFontWeight = () => {
    if (text_font_weight === "400") return "font-normal";
    return `font-[${text_font_weight}]`;
  };

  const getLineHeight = () => {
    if (text_line_height === "15px") return "leading-sm";
    return `leading-[${text_line_height}]`;
  };

  const getTextColor = () => {
    if (text_color === "#ffffff33") return "text-text-secondary";
    return `text-[${text_color}]`;
  };

  const getBackgroundColor = () => {
    if (fill_background_color === "#262624") return "bg-edittext-background";
    return `bg-[${fill_background_color}]`;
  };

  const getBorderRadius = () => {
    if (border_border_radius === "14px") return "rounded-md";
    return `rounded-[${border_border_radius}]`;
  };

  const getBorder = () => {
    if (border_border === "0 solid #ffffff7f") return "border-0";
    const borderParts = border_border.split(' ');
    if (borderParts.length >= 3) {
      const width = borderParts[0];
      const style = borderParts[1];
      const color = borderParts[2];
      
      if (color === "#ffffff7f") {
        return `border-[${width}] border-${style} border-edittext-border`;
      }
      return `border-[${width}] border-${style} border-[${color}]`;
    }
    return `border-[${border_border}]`;
  };

  const getBoxShadow = () => {
    if (effect_box_shadow === "0px 4px 15px #000000a5") {
      return "shadow-[0px_4px_15px_#000000a5]";
    }
    return `shadow-[${effect_box_shadow}]`;
  };

  const getTextAlign = () => {
    switch (text_text_align) {
      case 'center': return 'text-center';
      case 'right': return 'text-right';
      case 'justify': return 'text-justify';
      default: return 'text-left';
    }
  };

  // Build the complete className
  const inputClasses = twMerge(
    editTextClasses({ variant, size }),
    getFontSize(),
    `font-[${text_font_family}]`,
    getFontWeight(),
    getLineHeight(),
    getTextAlign(),
    getTextColor(),
    getBackgroundColor(),
    getBorder(),
    getBorderRadius(),
    getBoxShadow(),
    'placeholder:text-current placeholder:opacity-100',
    optionalClasses,
    className
  );

  // Safe event handlers
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    if (typeof onChange === 'function') {
      onChange(event);
    }
  };

  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    if (disabled) return;
    if (typeof onFocus === 'function') {
      onFocus(event);
    }
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    if (disabled) return;
    if (typeof onBlur === 'function') {
      onBlur(event);
    }
  };

  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      disabled={disabled}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      className={inputClasses}
      aria-disabled={disabled}
      {...props}
    />
  );
};

export default EditText;