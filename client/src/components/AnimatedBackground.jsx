function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <div className="animate-blob-1 absolute -top-24 -left-24 w-96 h-96 bg-lime-400/10 rounded-full blur-3xl" />
      <div className="animate-blob-2 absolute -bottom-24 -right-24 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl" />
    </div>
  );
}

export default AnimatedBackground;
