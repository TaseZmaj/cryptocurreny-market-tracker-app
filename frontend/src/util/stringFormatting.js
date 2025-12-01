// Helper function to format the timestamp
export const formatDate = (timestamp) => {
  // Converts the ISO string "2025-11-29T00:00:00Z" to a local date string
  return new Date(timestamp).toLocaleDateString();
};

// Helper function to format numbers to two decimal places
export const formatPrice = (price) => {
  // Use Intl.NumberFormat for better currency formatting
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(price);
};
