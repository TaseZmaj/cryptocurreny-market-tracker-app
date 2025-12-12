// Helper function to format the timestamp
export const formatDate = (timestamp) => {
  // Converts the ISO string "2025-11-29T00:00:00Z" to a local date string
  return new Date(timestamp).toLocaleDateString();
};

export function formatCryptoPrice(price) {
  if (price === null || price === undefined) return "$0";

  // Very small coins
  if (price < 0.01) {
    return `$${price}`; // show raw value
  }

  // Numbers under a million
  if (price < 1_000_000) {
    // If < 1, show raw with all decimals
    if (price < 1) return `$${price}`;
    // Otherwise, show 2 decimals
    return `$${price.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }

  // Numbers in millions
  if (price >= 1_000_000 && price < 1_000_000_000) {
    return `$${(price / 1_000_000).toFixed(2)}M`;
  }

  // Numbers in billions
  if (price >= 1_000_000_000 && price < 1_000_000_000_000) {
    return `$${(price / 1_000_000_000).toFixed(2)}B`;
  }

  // Numbers in trillions
  if (price >= 1_000_000_000_000) {
    return `$${(price / 1_000_000_000_000).toFixed(2)}T`;
  }

  return `$${price}`;
}
