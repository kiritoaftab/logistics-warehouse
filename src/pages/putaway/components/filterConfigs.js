export const putawayFilterConfig = ({
  filters,
  filterOptions,
}) => [
  {
    key: "dateRange",
    type: "select",
    label: "Date Range",
    value: filters.dateRange,
    options: ["Today", "Yesterday", "Last 7 Days", "This Month", "All"],
  },
  {
    key: "warehouse",
    type: "select",
    label: "Warehouse",
    value: filters.warehouse,
    options: filterOptions.warehouses,
  },
  {
    key: "client",
    type: "paginated",
    label: "Client",
  },
  {
    key: "status",
    type: "select",
    label: "Status",
    value: filters.status,
    options: filterOptions.statuses,
  },
  {
    key: "zone",
    type: "select",
    label: "Zone",
    value: filters.zone,
    options: ["All", "Zone A", "Zone B", "Zone C", "Zone D"],
  },
  {
    key: "search",
    type: "search",
    label: "Search",
    placeholder: "Task ID / GRN / SKU",
    value: filters.search,
  },
];


export const applyPutawayFilters = (data, filters) => {
  const now = new Date();

  return data.filter((task) => {
    if (filters.client !== "All") {
      if (task.sku?.client_id !== Number(filters.client)) {
        return false;
      }
    }

    if (filters.warehouse !== "All") {
      if (
        task.destination_location?.warehouse_id !==
        Number(filters.warehouse)
      ) {
        return false;
      }
    }

    return true;
  });
};

