import { useParams, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react";
import supabase from '../config/supabaseClient.js'

const Update = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState(null);
  const [method, setMethod] = useState(null);
  const [rating, setRating] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formError, setFormError] = useState(null);

  useEffect(() => {
    async function fetchSmoothie() {
      const { data, error } = await supabase
        .from('smoothies')
        .select()
        .eq('id', id)
        .single()

      if (error) {
        navigate('/', { replace: true });
      }

      if (data) {
        setTitle(data.title);
        setMethod(data.method);
        setRating(data.rating);
        setLoading(false);
      }
    }

    fetchSmoothie();
  }, [id, navigate])

  async function handleSubmit(e) {
    e.preventDefault();

    if (!title || !method || !rating) {
      setFormError(
        "Please enter all the details otherwise NO smoothie for ya!"
      );
      return;
    }

    const { data, error } = await supabase
      .from("smoothies")
      .update({ title, method, rating }) // no array
      .eq('id', id)
      .select(); // need this select in v2!!!

    if (error) {
      console.log(error);
      setFormError("Bad boy! No smoothies for you!");
    }

    if (data) {
      setFormError(null);
      navigate("/");
    }
  }


  return (
    <div className="page update">
      {
        loading &&
        <h3>Your smoothie is being blended...</h3>
      }

      {
        !loading &&
        <form onSubmit={handleSubmit}>
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <label htmlFor="method">Method:</label>
          <textarea
            id="method"
            value={method}
            onChange={(e) => setMethod(e.target.value)}
          />

          <label htmlFor="rating">Rating:</label>
          <input
            type="number"
            id="rating"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
          />

          <button>Update Smoothie Recipe</button>

          {formError && <p className="error">{formError}</p>}
        </form>
      }
    </div>
  )
}

export default Update