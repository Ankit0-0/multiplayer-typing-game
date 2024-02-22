import { myContext } from "../context/context.jsx";

const PopUP = () => {
  const { countDown, setCountDown } = myContext();
  return (
    <div className="w-full h-full text-9xl flex items-center text-yellow-400 justify-center">
      {countDown}
    </div>
  );
};
export default PopUP;
