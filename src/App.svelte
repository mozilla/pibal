<script>
  import page from "page";

  import { Button } from "@graph-paper/button";
  import { Stack } from "@graph-paper/stack";
  import { Box } from "@graph-paper/box";
  import Logo from "./components/Logo.svelte";
  import OneBigGraph from "./components/OneBigGraph.svelte";
  import Code from "./components/Code.svelte";
  import { site, plotTemplate } from "../public/config";

  let logo;
  let fullData;
  let currentData;
  let currentPlot;
  let plots = [];
  let isNav = false;

  function setPlot(key) {
    const nextPlot = plots.find((plot) => plot.key === key);
    if (nextPlot && currentPlot.key !== nextPlot.key) currentPlot = nextPlot;
  }

  function oneBigGraph(obj) {
    const { params } = obj;
    const { key } = params;

    setPlot(key);
    currentData = updateData();
  }

  function updateData() {
    let newData = fullData.filter(row => {
      return row[plotTemplate["plotSplit"]] === currentPlot["relevantRows"] &&
        row["comparison_to_control"] === "relative_uplift" &&
        (row["parameter"] === "0.9" || !("parameter" in row));
    });
    return newData;
  }

  async function initData() {
    let source = "bug_1637316_message_aboutwelcome_pull_factor_reinforcement_76_rel_release_76_77_weekly.json";
    fullData = await fetch(`data/${source}`).then((r) => r.json()).then((json) => applySplit(json));

    page("/", oneBigGraph);
    page("/:key", oneBigGraph);
    page({ hashbang: true });
  }

  async function applySplit(jsonData) {
    let plotSplitField = plotTemplate["plotSplit"];
    let plotSplitSet = new Set();

    // Create the list of plots (split by statistic)
    // to show up on the left panel.
    jsonData.forEach(dataRow => {
      dataRow["window_index"] = parseInt(dataRow["window_index"]);
      let statistic = dataRow[plotSplitField];
      if (plotSplitSet.has(statistic)) {
        return;
      }

      let plotTemplateCopy = Object.assign({}, plotTemplate);
      plotTemplateCopy["relevantRows"] = statistic;
      plotTemplateCopy["title"] = statistic;
      plotTemplateCopy["subtitle"] = plotTemplateCopy["subtitle"].replace("<statistic>", statistic);
      plotTemplateCopy["key"] = statistic;
      plots.push(plotTemplateCopy);

      plotSplitSet.add(statistic);
    });
    currentPlot = plots[0];
    return jsonData;
  }
</script>

<svelte:head>
  <title>{site.title || 'One Big Graph'}</title>
</svelte:head>

{#await initData() then currentData}
<nav
  on:mouseover={() => {
    isNav = true;
  }}
  on:mouseleave={() => {
    isNav = false;
  }}>
  <div>
    <Box padding={2}>
      <div style=" opacity: {isNav ? 1 : 0.5}; transition: opacity 300ms;">
        <Logo bind:this={logo} size={80} />
      </div>
    </Box>
    <Box pad={2}>
      <Stack space={1}>
        {#each plots as { shorthand, title, source, key }, i}
          <Button
            level="low"
            toggled={key === currentPlot.key}
            href={`/${key}`}
            on:click={() => {
              logo.rebuildLogo();
            }}>
            {shorthand || title}
          </Button>
        {/each}
      </Stack>
    </Box>
    <!-- footer -->
    {#if site.feedback}
      <Box padding={3}>
        <div
          style="padding-top: var(--space-4x); font-size: var(--text-02); color:
          var(--cool-gray-7500);">
          <div
            style="font-size: var(--text-015); text-transform: uppercase;color:
            var(--cool-gray-550); font-weight: bold;">
            feedback
          </div>
          {site.feedback}
        </div>
      </Box>
    {/if}

  </div>
</nav>
{/await}
<main>
  <Stack space={2}>
    {#if currentData}
    <OneBigGraph data={currentData} plot={currentPlot} />
    {/if}
  </Stack>
</main>
