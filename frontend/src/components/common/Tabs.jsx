import React from "react";

const Tabs = ({ activeTab, setActiveTab, tabs }) => {
  return (
    <div className="bg-green-medium rounded-full flex">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => setActiveTab(tab.value)}
          className={`w-1/2 py-3 rounded-full font-nexa font-bold border transition-all duration-200
            ${
              activeTab === tab.value
                ? "bg-white-intense text-green-dark border-green-medium"
                : "text-white-intense border-transparent"
            }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default Tabs;