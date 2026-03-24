import React from 'react';

const PageHeader = ({ title, subtitle, icon = '✨', action = null }) => {
  return (
    <div className="wellnest-surface p-6 md:p-7 mb-6 sticky top-0 z-50 !bg-white border border-slate-200 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-2xl shadow-sm">
            {icon}
          </div>
          <div>
            <p className="wellnest-muted-kicker">WellNest</p>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900">{title}</h1>
            {subtitle && <p className="text-slate-600 mt-1">{subtitle}</p>}
          </div>
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    </div>
  );
};

export default PageHeader;