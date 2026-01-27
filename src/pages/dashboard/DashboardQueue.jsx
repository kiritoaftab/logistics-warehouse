import React from "react";
import QueueCard from "./QueueCard";
import InboundQueueTable from "./InboundQueueTable";
import PickingQueueTable from "./PickingQueueTable";
import PackingQueueTable from "./PackingQueueTable";

const DashboardQueue = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
      <QueueCard title="Inbound Queue">
        <InboundQueueTable />
      </QueueCard>

      <QueueCard title="Picking Queue">
        <PickingQueueTable />
      </QueueCard>

      <QueueCard title="Packing Queue">
        <PackingQueueTable />
      </QueueCard>
    </div>
  );
};

export default DashboardQueue;
