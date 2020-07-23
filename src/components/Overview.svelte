<script>

  // eslint-disable-next-line import/no-extraneous-dependencies
  import { fly } from "svelte/transition";

  export let experiment;


  async function fetchExperimentData() {
    // let experimentURL = `${EXPERIMENTER_API_URL}/${experimentName}/`;
    let experimentURL = `${EXPERIMENTER_API_URL}/`;
    let experimentData = await fetch(experimentURL).then((r) => r.json());
    let experiment;
    for (let experimentObj of experimentData) {
      if (experimentObj.slug === experimentName) {
        experiment = experimentObj;
        break;
      }
    }
    return {
      "startDate": (new Date(experiment.start_date)).toDateString(),
      "endDate": (new Date(experiment.end_date)).toDateString(),
      "population": experiment.population
    };
  }
</script>

<style>
  h1 {
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

<div>
  <div in:fly={{ duration: 400, y: 5 }}>
    {#if experiment}

    <div class="subtitle1">
      Summary
    </div>
    <div class="row">
      <div class="row_left">
        <div class="custom_label">Retention:</div> <b style="color: green;">HEALTHY</b>/<b style="color: red;">UNHEALTHY</b>???
      </div>
      <div class="row_right">
        <div class="custom_label">Search:</div> <b style="color: green;">HEALTHY</b>/<b style="color: red;">UNHEALTHY</b>???
      </div>
    </div>
    <div class="row">
      <div class="row_left">
        <div class="custom_label">Ad Clicks:</div> <b style="color: green;">HEALTHY</b>/<b style="color: red;">UNHEALTHY</b>???
      </div>
      <div class="row_right">
        <div class="custom_label">URI Visits:</div> <b style="color: green;">HEALTHY</b>/<b style="color: red;">UNHEALTHY</b>???
      </div>
    </div>
    <div class="row">
      <div class="row_left">
        <div class="custom_label">Active Hours:</div> <b style="color: green;">HEALTHY</b>/<b style="color: red;">UNHEALTHY</b>???
      </div>
    </div>
    {/if}
  </div>
</div>

