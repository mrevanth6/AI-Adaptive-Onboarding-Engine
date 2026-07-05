import "./SavedRoadMaps.css";
import { useNavigate } from "react-router-dom";
function SavedRoadMaps() {
  const navigate = useNavigate();
  const savedRoadmaps = JSON.parse(localStorage.getItem("savedRoadmaps")) || [];
  return (
    <div className="saved-roadmaps">
      <h2>Saved Road Maps</h2>
      <p>This is where your saved road maps will appear.</p>
      {savedRoadmaps.length === 0 ? (
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
