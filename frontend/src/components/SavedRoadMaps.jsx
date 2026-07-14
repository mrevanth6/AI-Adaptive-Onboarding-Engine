import "./SavedRoadMaps.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { BeatLoader } from "react-spinners";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;
function SavedRoadMaps() {
  const navigate = useNavigate();
  const [savedRoadmaps, setSavedRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchSavedRoadmaps = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login", { replace: true });
        return;
      }
      const response = await axios.get(`${API_URL}/api/saved-roadmaps`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSavedRoadmaps(response.data.savedRoadmaps);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchSavedRoadmaps();
  }, []);

  return (
    <div className="saved-roadmaps">
      <h2>Saved Road Maps</h2>
      <p>This is where your saved road maps will appear.</p>
      {loading ? (
        <div className="loading">
          <BeatLoader color="black" size={10} />
        </div>
      ) : savedRoadmaps.length === 0 ? (
        <p>No saved road maps found.</p>
      ) : (
        <div className="table-container">
          <table className="roadmap-table">
            <thead>
              <tr>
                <th>Role</th>
                <th>Score</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {savedRoadmaps.map((el, index) => (
                <tr key={index}>
                  <td>{el.role_title}</td>
                  <td>{el.roadmap.gap_analysis.readiness_score}</td>
                  <td>{new Date(el.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button
                      className="view-btn"
                      onClick={() =>
                        navigate("/roadmap", { state: el.roadmap })
                      }
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
export default SavedRoadMaps;
