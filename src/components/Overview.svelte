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

    console.log(experiment);

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

<main>
  <div in:fly={{ duration: 400, y: 5 }}>
    {#if experiment}
    <div style="display: flex; flex-wrap: wrap;">
      <div style="width: 33%; box-sizing: border-box;"><b>Start Date: </b>{experiment.startDate}</div>
      <div style="width: 33%; box-sizing: border-box;"><b>End Date: </b>{experiment.endDate}</div>
      <div style="width: 33%; box-sizing: border-box;"><b>Population: </b>{experiment.population}</div>
    </div>
    <hr>
    <p>
      Retention: <b style="color: red;">UNHEALTHY - 2% drop</b>
    </p>
    <p>
      Search: <b style="color: green;">HEALTHY</b>
    </p>
    <p>
      Ad Clicks: <b style="color: green;">HEALTHY</b>
    </p>
    <p>
      URI Visits: <b style="color: red;">UNHEALTHY - 0.5% drop</b>
    </p>
    <p>
      Active Hours: <b style="color: green;">HEALTHY</b>
    </p>
    {/if}
  </div>
</main>

