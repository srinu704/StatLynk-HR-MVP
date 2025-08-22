export default function Progress({ value }: { value:number }){
  return <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden">
    <div className="h-full bg-blue-600" style={{ width: `${Math.max(0,Math.min(100,value))}%` }} />
  </div>;
}