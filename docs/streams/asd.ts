const allStreams = Object.entries(modelStreams).flatMap(
  ([modelName, streams]) =>
    streams.map((stream) => ({
      ...stream,
      modelLabel: modelName,
    }))
);

// Sort all streams by date (newest first)
allStreams.sort((a, b) => b.rawDate.localeCompare(a.rawDate));

// Get model statistics
const modelStats = Object.entries(modelStreams)
  .map(([modelName, streams]) => ({
    name: modelName,
    label: modelName,
    count: streams.length,
    latestDate: streams[0]?.date,
    oldestDate: streams[streams.length - 1]?.date,
  }))
  .sort((a, b) => a.label.localeCompare(b.label));

const totalStreams = allStreams.length;
const dateRange =
  totalStreams > 0
    ? `${allStreams[allStreams.length - 1].date} – ${allStreams[0].date}`
    : "No streams available";
