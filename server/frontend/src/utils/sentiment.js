function sentimentClass(sentiment) {
  var value = (sentiment || "").toLowerCase();
  if (value.indexOf("pos") !== -1) {
    return "badge badge-positive";
  }
  if (value.indexOf("neg") !== -1) {
    return "badge badge-negative";
  }
  return "badge badge-neutral";
}

function sentimentLabel(sentiment) {
  if (!sentiment) {
    return "Neutral";
  }
  return sentiment.charAt(0).toUpperCase() + sentiment.slice(1).toLowerCase();
}

module.exports = { sentimentClass: sentimentClass, sentimentLabel: sentimentLabel };
