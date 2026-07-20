import "./ResourceDialog.css";
import { X, ExternalLink } from "lucide-react";
function ResourceDialog({ onClose }) {
  return (
    <div className="resource-modal">
      <div className="resource-modal-content">
        <button className="close-btn" onClick={onClose}>
          <X size={24} />
        </button>
        <h2>Linux Based Programming</h2>
        <div className="resources-list">
          <div className="resource">
            <span>MDN JavaScript Docs</span>
            <a
              className="external-link"
              href="https://developer.mozilla.org"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="external-link-open">Open</span>
              <ExternalLink size={16} />
            </a>
          </div>
          <div className="resource">
            <span>MDN JavaScript Docs</span>
            <a
              className="external-link"
              href="https://developer.mozilla.org"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="external-link-open">Open</span>
              <ExternalLink size={16} />
            </a>
          </div>
          <div className="resource">
            <span>MDN JavaScript Docs</span>
            <a
              className="external-link"
              href="https://developer.mozilla.org"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="external-link-open">Open</span>
              <ExternalLink size={16} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
export default ResourceDialog;
