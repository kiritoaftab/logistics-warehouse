export const validateSalesOrder = (header, shipTo, lines = []) => {
  const errors = {};

  // REQUIRED IDs (hard fail)
  if (!header.warehouse_id) {
    errors.warehouse_id = "Warehouse is required";
  }

  if (!header.client_id) {
    errors.client_id = "Client is required";
  }

  if (!shipTo?.name) {
    errors.customer_name = "Customer name is required";
  }

  // REQUIRED core fields
  if (!header.orderType) {
    errors.orderType = "Order type is required";
  }

  if (!header.priority) {
    errors.priority = "Priority is required";
  }

  // Conditional SLA
  const slaRequiredTypes = ["EXPRESS", "SAME_DAY", "NEXT_DAY"];
  if (slaRequiredTypes.includes(header.orderType) && !header.slaDueDate) {
    errors.slaDueDate = "SLA due date is required for this order type";
  }

  // Must have at least 1 valid line

  if (lines.length === 0) {
    errors.lines = "Order must have at least one line";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
