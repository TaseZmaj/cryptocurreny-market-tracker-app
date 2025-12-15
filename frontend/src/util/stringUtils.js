// Helper function to format the timestamp
// export const formatDate = (timestamp) => {
//   // Converts the ISO string "2025-11-29T00:00:00Z" to a local date string
//   return new Date(timestamp).toLocaleDateString();
// };

export function formatCryptoPrice(price) {
  if (price === null || price === undefined || typeof price !== "number")
    return "$0";

  if (price < 0.01) {
    return `$${price.toFixed(8)}`;
  }

  if (price < 1_000_000) {
    if (price < 1) {
      return `$${price.toFixed(6)}`;
    }

    return `$${price.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }

  if (price >= 1_000_000 && price < 1_000_000_000) {
    return `$${(price / 1_000_000).toFixed(2)}M`;
  }

  if (price >= 1_000_000_000 && price < 1_000_000_000_000) {
    return `$${(price / 1_000_000_000).toFixed(2)}B`;
  }

  if (price >= 1_000_000_000_000) {
    return `$${(price / 1_000_000_000_000).toFixed(2)}T`;
  }

  return `$${price}`; // Fallback
}

export function formatCryptoPriceChart(price) {
  if (
    price === null ||
    price === undefined ||
    typeof price !== "number" ||
    price === 0
  )
    return "$0";

  if (price < 0.01) {
    if (price.toFixed(8) === "0.00000000") return "$0";
    return `$${price.toFixed(8)}`;
  }

  if (price < 1_000) {
    if (price < 1) {
      return `$${price.toFixed(6)}`;
    }
    return `$${price.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }

  if (price >= 1_000 && price < 1_000_000) {
    return `$${(price / 1_000).toFixed(2)}K`;
  }

  if (price >= 1_000_000 && price < 1_000_000_000) {
    return `$${(price / 1_000_000).toFixed(2)}M`;
  }

  if (price >= 1_000_000_000 && price < 1_000_000_000_000) {
    return `$${(price / 1_000_000_000).toFixed(2)}B`;
  }

  if (price >= 1_000_000_000_000) {
    return `$${(price / 1_000_000_000_000).toFixed(2)}T`;
  }

  return `$${price}`;
}

export function estimateTextWidth(text) {
  let width = 0;

  for (const char of text) {
    if (char >= "A" && char <= "Z") width += 1.2; // capitals
    else if ("MW".includes(char)) width += 1.4; // very wide
    else if ("il".includes(char)) width += 0.5; // very narrow
    else width += 1; // normal
  }

  return width;
}

export function getTitleFontSize(name) {
  const estimatedWidth = estimateTextWidth(name);

  const base = 3; // rem
  const min = 1.2; // rem
  const scale = 0.1;

  return `${Math.max(min, base - estimatedWidth * scale)}rem`;
}

export function getSymbolFontSize(symbol) {
  const estimatedWidth = estimateTextWidth(symbol);

  const base = 1.5; // rem
  const min = 1; // rem
  const scale = 0.5;

  return `${Math.max(min, base - estimatedWidth * scale)}rem`;
}

export function formatDate(inputDate) {
  const date = new Date(inputDate);

  const day = date.getDate();
  const year = date.getFullYear();

  const month = date.toLocaleDateString("en-US", { month: "long" });

  const getDaySuffix = (d) => {
    if (d > 3 && d < 21) return "th";
    switch (d % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  return `${day}${getDaySuffix(day)} ${month} ${year}`;
}

//2025-12-13T00:00:00Z to "2018-10-19"
export function formatIsoToYMD(iso) {
  return iso.slice(0, 10); // "2018-05-04"
}
