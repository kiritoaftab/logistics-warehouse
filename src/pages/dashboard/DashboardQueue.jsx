// DashboardQueue.jsx (updated to pass warehouseId to all queue tables)
import QueueCard from "./QueueCard";
import InboundQueueTable from "./InboundQueueTable";
import PickingQueueTable from "./PickingQueueTable";
import PackingQueueTable from "./PackingQueueTable";

const DashboardQueue = ({ warehouseId = "1" }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
      <QueueCard
        title="Inbound Queue"
        viewAllPath="/inbound"
        warehouseId={warehouseId}
      >
        <InboundQueueTable warehouseId={warehouseId} />
      </QueueCard>

      <QueueCard
        title="Picking Queue"
        viewAllPath="/picking"
        warehouseId={warehouseId}
      >
        <PickingQueueTable warehouseId={warehouseId} />
      </QueueCard>

      <QueueCard
        title="Packing Queue"
        viewAllPath="/packing"
        warehouseId={warehouseId}
      >
        <PackingQueueTable warehouseId={warehouseId} />
      </QueueCard>
    </div>
  );
};

export default DashboardQueue;
