<script>
  // eslint-disable-next-line import/no-extraneous-dependencies
  import { fly } from "svelte/transition";
  import { Stack } from "@graph-paper/stack";
  import OneBigGraph from "./OneBigGraph.svelte";

  export let dailyData;
  export let weeklyData;

  let graphs = [
    {label: "Retention", value: [[["binomial", "retained", "daily"], ["binomial", "retained", "weekly"]]]},
    {label: "Search", value: [[["mean", "search_count", "weekly"]]]},
    {label: "Engagement", value: [
      [["mean", "active_hours", "weekly"], ["mean", "uri_count", "weekly"]],
      [["mean", "ad_clicks", "weekly"]]
    ]}
  ];

  const plotTemplate = {
    type: "line", // the type of chart. Right now just line.
    subtitle: "These graphs show the statistic '<statistic>' for a variety of metrics listed below over day index of an experiment", // the subtitle element
    description: "more description!", // currently unused.
    x: "window_index", // the column that gives you the x accessor.
    y: ["point"], // the y value column name. Unlike x, it can be multiple. If you want only one, wrap a single string in an arrray
    xType: "linear",
    group: "branch",
    yAxisFormat: ".0%",
    yMouseoverFormat: ".2%"
  };

  function getDataByType(statistic, metric, analysisWindow) {
    let fullData;
    if (analysisWindow === "daily") {
      fullData = dailyData;
    } else {
      fullData = weeklyData;
    }
    let retentionData = fullData.filter(row => {
      return row["metric"] === metric &&
        row["statistic"] === statistic &&
        !row["comparison_to_branch"] &&
        (row["parameter"] === "0.9" || !("parameter" in row));
    });
    retentionData.sort((a, b) => (a.window_index > b.window_index) ? 1 : -1)
    return retentionData;
  }

  function getPlotByData(statistic, metric, analysisWindow) {
    let title = `${metric.replace(/_/g, " ")} by ${analysisWindow} index`;
    let plot = Object.assign({}, plotTemplate);
    plot["title"] = title;

    if (metric !== "retained") {
      plot["yAxisFormat"] = plot["yMouseoverFormat"] = ".3s"
    }
    return plot;
  }
</script>

<style>
  header {
    padding-bottom: var(--space-8x);
    padding-left: calc(var(--space-1x) * 10);
  }

  header h1 {
    padding: 0px;
    margin: 0px;
    font-size: 2em;
    color: var(--cool-gray-800);
  }

  .supertitle {
    text-transform: uppercase;
    color: var(--cool-gray-600);
  }

  .subtitle {
    color: var(--cool-gray-600);
    font-style: italic;
  }

  .charts {
    display: flex;
    flex-wrap: wrap;
    grid-gap: var(--space-3x);
    padding-bottom: var(--space-4x);
  }

  h2 {
    margin: 0px;
    padding: 0px;
    font-size: var(--text-04);
    padding-bottom: var(--space-base);
  }
</style>

<div class="body">
  <div class="subtitle1">
    Results
  </div>
  <Stack space={2}>
    {#each graphs as graph}
      <div class="subtitle2 indent">Browser {graph.label}</div>
      {#each graph.value as row}
        <div class="row">
          <div class="row_left">
            <OneBigGraph data={getDataByType(...row[0])} plot={getPlotByData(...row[0])} />
          </div>
           {#if row.length > 1}
          <div class="row_right">
            <OneBigGraph data={getDataByType(...row[1])} plot={getPlotByData(...row[1])} />
          </div>
          {/if}
        </div>
      {/each}
    {/each}
  </Stack>
</div>
