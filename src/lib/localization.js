function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function mergeLocalized(baseValue, localizedValue) {
  if (localizedValue === undefined || localizedValue === null) {
    return baseValue;
  }

  if (Array.isArray(baseValue) && Array.isArray(localizedValue)) {
    // Merge by index so we keep base structure (e.g. paths) and only override translated fields
    const len = Math.max(baseValue.length, localizedValue.length);
    const result = [];
    for (let i = 0; i < len; i++) {
      result.push(mergeLocalized(baseValue[i], localizedValue[i]));
    }
    return result;
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
