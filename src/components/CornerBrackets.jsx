export default function CornerBrackets() {
  return (
    <>
      <div className="absolute top-1 left-1 w-4 h-4 border-t-2 border-l-2 border-[#ff2200] pointer-events-none z-30" />
      <div className="absolute top-1 right-1 w-4 h-4 border-t-2 border-r-2 border-[#ff2200] pointer-events-none z-30" />
      <div className="absolute bottom-1 left-1 w-4 h-4 border-b-2 border-l-2 border-[#ff2200] pointer-events-none z-30" />
      <div className="absolute bottom-1 right-1 w-4 h-4 border-b-2 border-r-2 border-[#ff2200] pointer-events-none z-30" />
    </>
  );
}
