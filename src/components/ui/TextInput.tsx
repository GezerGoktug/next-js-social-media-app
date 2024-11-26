"use client";
import { Eye, EyeOff } from "lucide-react";
import { ElementType, FocusEvent, useState } from "react";
import { Input } from "./input";
import { Label } from "./label";
import { ControllerRenderProps, FieldValues } from "react-hook-form";

const mergeCallbacks =
  (
    callback1?: (event: FocusEvent<HTMLInputElement>) => void,
    callback2?: (event: FocusEvent<HTMLInputElement>) => void
  ) =>
  (event: React.FocusEvent<HTMLInputElement>) => {
    if (callback1) callback1(event);
    if (callback2) callback2(event);
  };

interface TextInputProps<T extends FieldValues> {
  input?: ElementType;
  field: string;
  className?: string;
  placeholder?: string;
  type?: "text" | "password" | "email" | "number";
  register: ControllerRenderProps<T>;
  id?: string;
  onFocus?: (event: FocusEvent<HTMLInputElement>) => void; // onFocus callback
  onBlur?: (event: FocusEvent<HTMLInputElement>) => void; // onBlur callback
}

const TextInput = <T extends FieldValues>({
  input: CustomInput,
  field,
  className,
  register,
  placeholder,
  ...props
}: TextInputProps<T>) => {
  const [focus, setFocus] = useState(register.value ? true : false);
  const [showPassword, setShowPassword] = useState(false);
  const inputId =
    props.id || `input-${Math.random().toString(36).substr(2, 9)}`;
  const Component = CustomInput || Input;

  return (
    <>
      <div
        className={`relative py-1 ps-5 ${
          props.type === "password" ? "pe-16" : "pe-5"
        } rounded-lg border bg-card border-slate-300/50 shadow ${className}`}
      >
        <Component
          id={inputId}
          className="p-0 ring-0 border-0 focus-visible:ring-offset-0 focus-visible:ring-0  bg-transparent w-full"
          placeholder={focus ? placeholder : ""}
          {...props}
          {...register}
          onFocus={mergeCallbacks(() => setFocus(true), props?.onFocus)}
          onBlur={mergeCallbacks((e) => {
            setFocus(e.target.value ? true : false);
            register?.onBlur();
          }, props?.onBlur)}
          type={
            props.type === "password"
              ? showPassword
                ? ""
                : "password"
              : props.type
          }
        />
        <Label
          className={`absolute  transition-all ${
            focus
              ? "bg-inherit left-2 -top-2 px-3 text-xs"
              : "left-5 top-3 text-base"
          }`}
          htmlFor={inputId}
        >
          {field}
        </Label>
        {props.type === "password" && (
          <span
            className="absolute right-4 top-2 cursor-pointer bg-zinc-200 dark:bg-indigo-950 p-2 rounded-full"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <Eye size={15} /> : <EyeOff size={15} />}
          </span>
        )}
      </div>
    </>
  );
};

export default TextInput;
