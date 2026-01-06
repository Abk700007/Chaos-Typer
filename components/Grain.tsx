export default function Grain() {
  return (
    <div className="pointer-events-none fixed inset-0 z-40 h-full w-full overflow-hidden opacity-20">
      <div className="h-[200%] w-[200%] animate-grain bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat" />
    </div>
  );
}