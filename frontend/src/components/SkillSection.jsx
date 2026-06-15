import SkillChip from "./SkillChip.jsx";
import "./SkillSection.css";
function SkillSection({ title, skills, type }) {
    const getIconEmoji = (type) => {
        if (type === "green") return "✓";
        if (type === "yellow") return "⚠";
        if (type === "red") return "✕";
        return "•";
    };
    const getFooterMessage = (type) => {
        if (type === "green") return "Great job! You're strong in these areas.";
        if (type === "yellow") return "Keep learning and practice more to master these skills.";
        if (type === "red") return "Focus on these skills to level up!";
        return "";
    };
    return (
        <div className={`skill-section skill-section-${type}`}>
            <div className="skill-header">
                <h3>{getIconEmoji(type)} {title}</h3>
                <div className={`skill-count-badge ${type}`}>
                    {skills.length}
                </div>
            </div>
            <div className="skill-container">
                {skills.map((skill) => (
                    <SkillChip key={skill} skill={skill} type={type} />
                ))}
            </div>
            <p className="skill-footer">{getFooterMessage(type)}</p>
        </div>
    );
}
export default SkillSection;