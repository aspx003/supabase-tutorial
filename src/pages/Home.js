import SmoothieCard from "../components/SmoothieCard";
import supabase from "../config/supabaseClient";
import { useEffect, useState } from "react";

const Home = () => {
  const [fetchError, setFetchError] = useState(null);
  const [smoothies, setSmoothies] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [orderBy, setOrderBy] = useState('created_at');
  const [isAsc, setIsAsc] = useState(true);

  function handleDelete(id) {
    setSmoothies(prevSmoothies => {
      return prevSmoothies.filter(sm => sm.id !== id);
    })
  }

  useEffect(() => {
    const fetchSmoothies = async () => {
      const { data, error } = await supabase.from("smoothies").select().order(orderBy, { ascending: isAsc });

      if (error) {
        setFetchError("Error fetching data");
        console.log(error);
        setSmoothies(null);
      }

      if (data) {
        setSmoothies(data);
        setIsLoading(false);
        setFetchError(null);
      }
    };

    fetchSmoothies();
  }, [orderBy, isAsc]);

  return (
    <div className="page home">
      {fetchError && <p>{fetchError}</p>}
      {isLoading && <p>Loading your blends...</p>}
      {smoothies && (
        <div className="smoothies">
          <div className="order-by">
            <p>Order By: </p>
            <button onClick={() => setOrderBy('created_at')}>Time Created</button>
            <button onClick={() => setOrderBy('title')}>Title</button>
            <button onClick={() => setOrderBy('rating')}>Rating</button>
            <button onClick={() => setIsAsc(!isAsc)}>
              {
                isAsc && <span>Descending</span>
              }
              {
                !isAsc && <span>Ascending</span>
              }
            </button>
            {orderBy}
          </div>
          <div className="smoothie-grid">
            {smoothies.map((smoothie) => (
              <SmoothieCard key={smoothie.id} smoothie={smoothie} onDelete={handleDelete} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
