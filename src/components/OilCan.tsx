import React from 'react';

interface OilCanProps {
  grade: string;
  width?: number;
  scale?: number;
  lblBg?: string;
}

export const OilCan: React.FC<OilCanProps> = ({ grade, width = 80, scale, lblBg }) => {
  const wrapStyle: React.CSSProperties = scale ? { transform: `scale(${scale})` } : {};
  return (
    <div className="mc" style={{ width, ...wrapStyle }}>
      <div className="mc-cap" />
      <div className="mc-neck" />
      <div className="mc-sho" style={{ background: 'var(--cream)' }} />
      <div className="mc-body">
        <div className="mc-lbl" style={lblBg ? { background: lblBg } : undefined}>
          <div className="mc-brand">ASG</div>
          <div style={{ width: '50%', height: '.5px', background: 'var(--gold)', margin: '2px 0' }} />
          <div className="mc-grade">{grade}</div>
        </div>
      </div>
      <div className="mc-base" />
    </div>
  );
};

export const HeroCan: React.FC = () => (
  <div className="can-wrap">
    <div className="can-cap" />
    <div className="can-neck" />
    <div className="can-shoulder" />
    <div className="can-body">
      <div className="can-label">
        <div className="can-label-brand">ASG</div>
        <div className="can-label-line" />
        <div className="can-label-type">Full Synthetic</div>
        <div className="can-label-grade">5W-30</div>
        <div className="can-label-api">API SN Plus · ACEA A3</div>
      </div>
    </div>
    <div className="can-base" />
  </div>
);
