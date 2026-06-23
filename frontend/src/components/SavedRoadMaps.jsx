import "./SavedRoadMaps.css";
function SavedRoadMaps() {
    return (
        <div className="saved-roadmaps">
            <h2>Saved Road Maps</h2>
            <p>This is where your saved road maps will appear.</p>
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
                        <tr>
                            <td>Frontend Developer</td>
                            <td>78%</td>
                            <td>22 Jun 2026</td>
                            <td>
                                <button className="view-btn">View</button>
                            </td>
                        </tr>

                        <tr>
                            <td>MERN Developer</td>
                            <td>82%</td>
                            <td>20 Jun 2026</td>
                            <td>
                                <button className="view-btn">View</button>
                            </td>
                        </tr>
                    </tbody>
                </table>

            </div>
        </div>
    );
}
export default SavedRoadMaps;