import "./SkillChip.css";
function SkillChip({ skill, type }) {
    return (
        <p
            className={`skill-chip ${type}`}>{skill}
        </p>
    );
}
export default SkillChip;