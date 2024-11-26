const Logo = ({ className }: { className?: string }) => {
  return (
    <h1 className={`text-4xl row-center ${className}  font-bold `}>
      <div className="rounded-lg shadow-[0px_0px_15px_1px_rgba(91,33,182,1)] bg-gradient-to-br text-center flex-center h-max  from-primary to-fuchsia-500 ">
        <span className=" font-extrabold  px-2 text-gradient-r from-white to-violet-100">
          C
        </span>
      </div>
      <div className=" text-gradient-r from-primary to-fuchsia-500 py-2">
        onnectify
      </div>
    </h1>
  );
};

export default Logo;
