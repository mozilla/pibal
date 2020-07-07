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
  let currentData;
  let currentPlot;
  let currentExperiment;
  let experimentMetadata = {};
  let currentPage = 0;
  let plots = [];
  let isNav = false;

  let EXPERIMENTER_API_URL = "https://experimenter.services.mozilla.com/api/v1/experiments"


  function handleSelectedExperiment(selectedExperiment) {
    currentExperiment = selectedExperiment.target.value;
    console.log("curr ", currentExperiment);
  }

  function overview(obj) {
    currentPlot = null;
    currentPage = 0;
  }

  function detailedInsights(obj) {
    currentPlot = null;
    currentPage = 1;
  }

  async function fetchExperimentList() {
    let experimentURL = `${EXPERIMENTER_API_URL}/`;
    let experimentData = await fetch(experimentURL).then((r) => r.json());

    experimentData = experimentData.filter(experiment => {
      return experiment.status === "Live";
    });
    for (let experiment of experimentData) {
      experimentMetadata[experiment.slug] = {
        "name": experiment.name,
        "slug": experiment.slug,
        "normandy_slug": experiment.normandy_slug,
        "status": experiment.status,
        "startDate": (new Date(experiment.start_date)).toDateString(),
        "endDate": (new Date(experiment.end_date)).toDateString(),
        "population": experiment.population
      };
    }
    let experimentList = Object.keys(experimentMetadata).sort();
    currentExperiment = experimentList[0];
    return experimentList;
  }

  async function initData() {
    let source = "statistics_bug_1635687_pref_telemetry_calibration_experiment_release_76_78_weekly.json";
    fullData = await fetch(`data/${source}`).then((r) => r.json()).then((json) => applySplit(json));

    page("/", overview);
    page("/overview", overview);
    page("/detailed_insights", detailedInsights);
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
          <Button
            level="low"
            toggled={currentPlot == null && currentPage === 0}
            href="/overview"
            on:click={() => {
              logo.rebuildLogo();
            }}>
            Overview
          </Button>
          <Button
            level="low"
            toggled={currentPlot == null && currentPage === 1}
            href="/detailed_insights"
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
  {/await}

  <main class="body">
    <Stack space={2}>
      {#await fetchExperimentList() then experimentList}
      <header>
        <h1>Experiment Report for "{experimentMetadata[currentExperiment].name}"</h1>
      </header>

      <form>
        <label><b>Experiment Slug:</b></label>
        <select on:change="{handleSelectedExperiment}">
          {#each experimentList as experiment}
            <option value={experiment}>
              {experiment}
            </option>
          {/each}
        </select>
      </form>
      {/await}

      {#if currentPage === 0}
      <Overview experiment={experimentMetadata[currentExperiment]}/>
      {:else if currentPage === 1}
      <DetailedInsights data={fullData} plots={plots}/>
      {/if}
    </Stack>
  </main>
