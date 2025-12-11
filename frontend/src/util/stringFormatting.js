// Helper function to format the timestamp
export const formatDate = (timestamp) => {
  // Converts the ISO string "2025-11-29T00:00:00Z" to a local date string
  return new Date(timestamp).toLocaleDateString();
};

// TODO: FIX THE FORMAT IT DOESNT TAKE INTO ACCOUN THAT SOMETHING CAN BE WORTH 0.000001
export const formatPrice = (price) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(price);
};
