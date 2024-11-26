import HeaderCenter from "./HeaderCenter";
import HeaderLeft from "./HeaderLeft";
import HeaderRight from "./HeaderRight/HeaderRight";

const Header = async () => {
  return (
    <header className=" fixed position-top z-50 bg-slate-50 dark:bg-background dark:border-b shadow h-20">
      <div className="container flex-between h-full">
        <HeaderLeft />
        <HeaderCenter />
        <HeaderRight />
      </div>
    </header>
  );
};

export default Header;
