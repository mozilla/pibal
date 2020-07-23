<script>
  import page from "page";
  // eslint-disable-next-line import/no-extraneous-dependencies
  import { fly } from "svelte/transition";

  import { Button } from "@graph-paper/button";
  import { Stack } from "@graph-paper/stack";
  import { Box } from "@graph-paper/box";
  import Logo from "./components/Logo.svelte";
  import OneBigGraph from "./components/OneBigGraph.svelte";
  import Overview from "./components/Overview.svelte";
  import DetailedInsights from "./components/DetailedInsights.svelte";
  import Code from "./components/Code.svelte";
  import { site, plotTemplate } from "../public/config";

  let logo;
  let fullData;
  let currentPlot;
  let currentExperiment;
  let currentPage = 0;
  let plots = [];
  let isNav = false;

  let EXPERIMENTER_API_URL = "https://experimenter.services.mozilla.com/api/v1/experiments"


  async function overview(ctx) {
    currentPlot = null;
    currentPage = 0;

    currentExperiment = await fetchExperimentData(ctx.params.experiment_slug);

    let normandy_slug = currentExperiment.normandy_slug.replace(/-/g, '_');;
    let source = `statistics_${normandy_slug}_daily.json`;
    fullData = await fetch(`data/${source}`).then((r) => r.json()).then((json) => applySplit(json));
  }

  function detailedInsights(obj) {
    currentPlot = null;
    currentPage = 1;
  }

  async function fetchExperimentData(slug) {
    let experimentURL = `${EXPERIMENTER_API_URL}/${slug}`;
    let experiment = await fetch(experimentURL).then((r) => r.json());
    return {
        "name": experiment.name,
        "slug": experiment.slug,
        "normandy_slug": experiment.normandy_slug,
        "status": experiment.status,
        "startDate": (new Date(experiment.start_date)).toDateString(),
        "endDate": (new Date(experiment.end_date)).toDateString(),
        "population": experiment.population
      };
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

  page("/:experiment_slug", overview);
  page("/overview/:experiment_slug", overview);
  page("/detailed_insights/:experiment_slug", detailedInsights);
  page({ hashbang: true });
</script>

<style>
  h1 {
    padding: 0px;
    margin: 0px;
    font-size: 2em;
    color: var(--cool-gray-800);
  }

  .body {
    padding-bottom: var(--space-8x);
    padding-left: calc(var(--space-1x) * 10);
  }
</style>

<svelte:head>
  <title>{site.title || 'One Big Graph'}</title>
</svelte:head>
  {#if currentExperiment}
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
          <Button
            level="low"
            toggled={currentPlot == null && currentPage === 0}
            href="/overview/{currentExperiment.slug}"
            on:click={() => {
              logo.rebuildLogo();
            }}>
            Overview
          </Button>
          <Button
            level="low"
            toggled={currentPlot == null && currentPage === 1}
            href="/detailed_insights/{currentExperiment.slug}"
            on:click={() => {
              logo.rebuildLogo();
            }}>
            Detailed Insights
          </Button>
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
  {/if}

  <main class="body">
    <Stack space={2}>
      {#if currentExperiment}
      <header>
        <h1>"{currentExperiment.name}" Analysis Report</h1>
      </header>
      {/if}

      {#if currentPage === 0}
      <Overview experiment={currentExperiment}/>
      {:else if currentPage === 1}
      <DetailedInsights data={fullData} plots={plots}/>
      {/if}
    </Stack>
  </main>
