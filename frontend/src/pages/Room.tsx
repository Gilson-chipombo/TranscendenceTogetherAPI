import { useParams } from "react-router-dom";

const Room = () => {
  const { id } = useParams();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Sala {id}</h1>
    </div>
  );
};

export default Room;