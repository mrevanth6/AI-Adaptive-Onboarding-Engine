import "./ResourceDialog.css";
import { X, ExternalLink } from "lucide-react";
function ResourceDialog({ topic, resources, onClose }) {
  return (
    <div className="resource-modal">
      <div className="resource-modal-content">
        <button className="close-btn" onClick={onClose}>
          <X size={24} />
        </button>
        <h2>{topic}</h2>
        <div className="resources-list">
          {resources.map((resource, index) => (
            <div className="resource" key={index}>
              <span>{resource.title}</span>
              <a
                className="external-link"
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="external-link-open">Open</span>
                <ExternalLink size={16} />
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
export default ResourceDialog;
