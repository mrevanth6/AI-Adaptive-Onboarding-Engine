import SkillChip from "./SkillChip.jsx";
import "./SkillSection.css";
import { CheckCircle2, CircleDashed, AlertCircle } from "lucide-react";
function SkillSection({ title, skills, type }) {
    const getIconEmoji = (type) => {
        if (type === "green") {
            return <CheckCircle2 size={32} className="score-icon" />
        };
        if (type === "yellow") return <AlertCircle size={32} className="score-icon" />;
        if (type === "red") return <CircleDashed size={32} className="score-icon" />;
        return <CircleDashed size={32} className="score-icon" />;
    };
    const getFooterMessage = (type) => {
        if (type === "green") return "Great job! You're strong in these areas.";
        if (type === "yellow") return "Keep learning and practice more to master these skills.";
        if (type === "red") return "Focus on these skills to level up!";
        return "";
    };
    const getTypeTitle = (type) => {
        if (type === "green") return "Proficient Skills";
        if (type === "yellow") return "Partial Skills";
        if (type === "red") return "Missing Skills";
        return "";
    }
    return (
        <div className={`skill-section skill-section-${type}`}>
            <div className="skill-header">
                <div className="header-wrapper">
                    <div className={`icon-container ${type}`}>
                        {getIconEmoji(type)}
                    </div>
                    <h3>{getTypeTitle(type)}</h3>
                </div>

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