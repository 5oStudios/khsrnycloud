const Header = () => {
  return (
    <header className="w-full p-6 border-b border-border bg-card/50 backdrop-blur-xl">
      <div className="flex items-center justify-center">
        <h1 className="text-4xl font-bold text-glow bg-gradient-to-r from-neon-purple via-neon-cyan to-neon-pink bg-clip-text text-transparent animate-glow-pulse">
          KHSRNY
        </h1>
      </div>
      <p className="text-center text-muted-foreground mt-2 text-sm tracking-wider">
        UPLOAD • PREVIEW • SHARE
      </p>
    </header>
  );
};

export default Header;