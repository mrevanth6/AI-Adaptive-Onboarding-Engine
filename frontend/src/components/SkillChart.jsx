import React from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';

function SkillChart({ title, data, type, colors }) {
  if (!data || data.length === 0) {
    return (
      <motion.div
        className="sc-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h3 className="sc-title">{title}</h3>
        <p className="sc-empty">No skill data available</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="sc-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -4 }}
    >
      <h3 className="sc-title">{title}</h3>

      <div className="sc-chart-container">
        {type === 'bar' ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgb(255, 255, 255, 0.1)" />
              <XAxis dataKey="skill" stroke="rgba(255, 255, 255, 0.6)" angle={-45} textAnchor="end" height={60} />
              <YAxis stroke="rgba(255, 255, 255, 0.6)" domain={[0, 100]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(30, 15, 70, 0.9)',
                  border: '1px solid #9D4EDD',
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <PolarGrid stroke="rgba(255, 255, 255, 0.2)" />
              <PolarAngleAxis dataKey="skill" stroke="rgba(255, 255, 255, 0.6)" />
              <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="rgba(255, 255, 255, 0.6)" />
              <Radar
                name={title}
                dataKey="value"
                stroke={colors[0]}
                fill={colors[0]}
                fillOpacity={0.6}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(30, 15, 70, 0.9)',
                  border: `2px solid ${colors[0]}`,
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="sc-legend">
        {data.map((item, idx) => (
          <div key={idx} className="sc-legend-item">
            <div
              className="sc-legend-color"
              style={{ backgroundColor: colors[idx % colors.length] }}
            />
            <span className="sc-legend-text">
              {item.skill}: {item.value || item.score}%
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export default SkillChart;
