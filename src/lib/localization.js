function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function mergeLocalized(baseValue, localizedValue) {
  if (localizedValue === undefined || localizedValue === null) {
    return baseValue;
  }

  if (Array.isArray(baseValue) && Array.isArray(localizedValue)) {
    return baseValue.map((item, index) => {
      const locItem = localizedValue[index];
      if (locItem === undefined || locItem === null) return item;
      return mergeLocalized(item, locItem);
    });
  }

  if (isObject(baseValue) && isObject(localizedValue)) {
    const merged = { ...baseValue };
    Object.keys(localizedValue).forEach((key) => {
      merged[key] = mergeLocalized(baseValue?.[key], localizedValue[key]);
    });
    return merged;
  }

  if (localizedValue === "") {
    return baseValue;
  }

  return localizedValue;
}

export function localizeContent(content, language) {
  if (!content || language !== "ar") {
    return content;
  }
  return mergeLocalized(content, content.ar || {});
}
