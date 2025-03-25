import Logo from "./Logo";
import SearchBar from "./SearchBar";

const Header = () => {
  return (
    <header className="container mx-auto py-4">
      <div className="flex items-center justify-between">
        <Logo />
        <SearchBar />
      </div>
    </header>
  );
};

export default Header;
