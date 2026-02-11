// picking/Picking.jsx
import React, { useState } from "react";
import PageHeader from "../components/PageHeader";
import { Plus, Download } from "lucide-react";
import PickWaves from "./PickWaves";
import PickTasks from "./PickTasks";
import PickTaskDetail from "./PickTaskDetail";
import PickExceptions from "./PickExceptions";
import { useNavigate } from "react-router-dom";

const Picking = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("waves");
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  const actions = (
    <>
      <button className="flex items-center gap-2 rounded-md border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700">
        <Download size={16} />
        Export
      </button>
      <button
        onClick={() => navigate("/picking/createPickWavePage")}
        className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm text-white"
      >
        <Plus size={16} />
        Create Pick Wave
      </button>
    </>
  );

  // Handle task selection (when user clicks "Start Task" or "View" in PickTasks)
  const handleTaskSelect = (taskId) => {
    setSelectedTaskId(taskId);
    setActiveTab("taskDetail");
  };

  // Handle back from task detail
  const handleBackFromTaskDetail = () => {
    setSelectedTaskId(null);
    setActiveTab("tasks");
  };

  // Render the appropriate content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case "waves":
        return <PickWaves onTaskSelect={handleTaskSelect} />;
      case "tasks":
        return <PickTasks onTaskSelect={handleTaskSelect} />;
      case "taskDetail":
        return (
          <PickTaskDetail
            taskId={selectedTaskId}
            onBack={handleBackFromTaskDetail}
          />
        );
      case "exceptions":
        return <PickExceptions />;
      default:
        return <PickWaves onTaskSelect={handleTaskSelect} />;
    }
  };

  // Determine which tabs to show
  const getTabs = () => {
    if (activeTab === "taskDetail") {
      return [{ key: "taskDetail", label: "Pick Task Detail", isActive: true }];
    }

    return [
      { key: "waves", label: "Pick Waves", isActive: activeTab === "waves" },
      { key: "tasks", label: "Pick Tasks", isActive: activeTab === "tasks" },
      {
        key: "exceptions",
        label: "Pick Exceptions",
        isActive: activeTab === "exceptions",
      },
    ];
  };

  const tabs = getTabs();

  return (
    <div className="min-h-screen s p-6">
      <div className="mx-auto 2xl:max-w-[1900px]">
        <PageHeader
          title="Picking"
          subtitle="Create pick waves and execute pick tasks"
          actions={actions}
        />

        {/* Tabs - Only show when not in task detail view */}
        {activeTab !== "taskDetail" && (
          <div className="mb-6 border-b border-gray-200">
            <div className="flex items-center gap-10">
              <button
                onClick={() => setActiveTab("waves")}
                className={`px-2 pb-3 text-sm font-medium ${
                  activeTab === "waves"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500"
                }`}
              >
                Pick Waves
              </button>
              <button
                onClick={() => setActiveTab("tasks")}
                className={`px-2 pb-3 text-sm font-medium ${
                  activeTab === "tasks"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500"
                }`}
              >
                Pick Tasks
              </button>
              <button
                onClick={() => setActiveTab("exceptions")}
                className={`px-2 pb-3 text-sm font-medium ${
                  activeTab === "exceptions"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500"
                }`}
              >
                Pick Exceptions
              </button>
            </div>
          </div>
        )}

        {/* Show back button when in task detail view */}
        {activeTab === "taskDetail" && (
          <div className="mb-6">
            <button
              onClick={handleBackFromTaskDetail}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4"
            >
              ← Back to Pick Tasks
            </button>
          </div>
        )}

        {/* Render the content */}
        {renderContent()}
      </div>
    </div>
  );
};

export default Picking;
