import "./SkillAnalysis.css";
import SkillSection from "./SkillSection.jsx";
import roadmap from "../assets/roadmap.json";
function SkillAnalysis() {
    const { gap_analysis } = roadmap;
    return (
        <div className="skill-analysis">
            <div className='skill-sections'>
                <SkillSection
                    title="Proficient Skills"
                    skills={gap_analysis.proficient}
                    type="green"
                />
                <SkillSection
                    title="Partial"
                    skills={gap_analysis.partial}
                    type="yellow"
                />
                <SkillSection
                    title="Missing"
                    skills={gap_analysis.missing}
                    type="red"
                />
            </div>
        </div>
    );
}
export default SkillAnalysis;