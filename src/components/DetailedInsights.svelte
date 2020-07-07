<script>
  // eslint-disable-next-line import/no-extraneous-dependencies
  import { fly } from "svelte/transition";
  import { Stack } from "@graph-paper/stack";
  import OneBigGraph from "./OneBigGraph.svelte";
  import { plotTemplate } from "../../public/config";

  export let data;
  export let plots;

  let currentStatistic;

  function setPlot(key) {
    const nextPlot = plots.find((plot) => plot.key === key);
    if (nextPlot) currentPlot = nextPlot;
  }

  function updateData() {
    let newData = data.filter(row => {
      return row[plotTemplate["plotSplit"]] === currentPlot["relevantRows"] &&
        !row["comparison_to_control"] &&
        (row["parameter"] === "0.9" || !("parameter" in row));
    });
    newData.sort((a, b) => (a.window_index > b.window_index) ? 1 : -1)
    return newData;
  }

  function handleSelectedStatistic(selectedStatistic) {
    currentStatistic = selectedStatistic.target.value;
    setPlot(currentStatistic);
    currentData = updateData();
  }

  let statisticList = plots.map((plot) => plot.key);
  let currentPlot = plots[0];
  let currentData = updateData();

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
  <Stack space={2}>
    <div in:fly={{ duration: 400, y: 5 }}>
      <form>
      <label><b>Statistic:</b></label>
        <select on:change="{handleSelectedStatistic}">
          {#each statisticList as statistic}
            <option value={statistic}>
              {statistic}
            </option>
          {/each}
        </select>
      </form>
    </div>

    <OneBigGraph data={currentData} plot={currentPlot} />
  </Stack>
</div>
