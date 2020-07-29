<script>
  import { onMount } from 'svelte';

  // eslint-disable-next-line import/no-extraneous-dependencies
  import { fly } from "svelte/transition";

  export let studyLength;
  export let weeklyData = [];

  let displayData = {};
  let branches = new Set();

  function getMetricColour(metric) {
    if (metric.lower <= 0 && metric.upper <= 0) {
      return "red";
    } else if (metric.lower <= 0 && metric.upper <= 0) {
      return "green";
    } else {
      return "#333";
    }
  }

  $: {
    branches.clear();
    for (let datum of weeklyData) {
      let {
        branch, metric, statistic, window_index, comparison,
        point, upper, lower, comparison_to_branch,
      } = datum;

      if (branch === "control" ||
          comparison !== "difference" ||
          comparison_to_branch !== "control" ||
          (metric === "retained" && statistic !== "binomial") ||
          (metric !== "retained" && statistic !== "mean")) {
        continue;
      }
      branches.add(branch);

      if (!displayData[window_index]) {
        displayData[window_index] = {};
      }

      if (!displayData[window_index][branch]) {
        displayData[window_index][branch] = {};
      }

      displayData[window_index][branch][metric] = {
        point: Math.round(point * 1000) / 1000,
        upper: Math.round(upper * 1000) / 1000,
        lower: Math.round(lower * 1000) / 1000
      };
    }
  }
</script>

<style>
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

  .grid-container {
    display: grid;
    grid-template-columns: auto auto auto auto auto auto auto auto;
    padding-top: 60px;
    padding-bottom: 10px;
    padding-right: 10px;
    width: 1400px;
  }
  .grid-item {
    padding: 30px;
    font-size: 20px;
    text-align: center;
  }

  .circle {
    line-height: 55px;
    padding-left: 120px;
    display: inherit;
    width: 33%;
  }

  .circle:before {
    content: ' \25CF';
    font-size: 55px;
  }

  .grid-title {
    font-style: normal;
    font-weight: bold;
    font-size: 18px;
    color: #888888;
  }

  .line {
    width: 112px;
    height: 10px;
    border-left: 5px solid #333;
    border-right: 5px solid #333;
    border-bottom: 5px solid #333;
    margin: 0 auto;
  }

  .line:before {
    content: ' \25CF';
    font-size: 20px;
  }

  .bounds {
    width: 150px;
    height: 10px;
    margin: 0 auto;
    font-size: 12px;
    clear: both;
  }

  .minbound {
    float: left;
  }
  .maxbound {
    float: right;
  }
</style>

<div class="body">
  <div in:fly={{ duration: 400, y: 5 }}>
    <div class="subtitle1">
      Summary
    </div>
    <div class="subtitle2">
      Treatment Branches Relative to Control
    </div>
    <div class="row">
      <div class="circle" style="color: red">Significant Drop</div>
      <div class="circle">No Significance</div>
      <div class="circle" style="color: green">Significant Increase</div>
    </div>
    {#if Object.keys(displayData).length > 0}
    <div class="indent grid-container">
      <div class="grid-item"></div>
      <div class="grid-item grid-title">VARIANT</div>
      <div class="grid-item grid-title">BROWSER RETENTION</div>
      <div class="grid-item grid-title">BROWSER SEARCHES</div>
      <div class="grid-item grid-title">BROWSER ENGAGEMENT (Active Hours)</div>
      <div class="grid-item grid-title">BROWSER ENGAGEMENT (Ad Clicks)</div>
      <div class="grid-item grid-title">BROWSER ENGAGEMENT (URI Count)</div>
      <div class="grid-item grid-title">(Feature Metric)</div>
      {#each {length: studyLength} as _, i}
        {#if displayData[i+1]}
          {#each [...branches] as branch}
            <div class="grid-item">Week {i + 1}</div>
            <div class="grid-item">{branch}</div>
            <div class="grid-item" style="color: {getMetricColour(displayData[i+1][branch].retained)}">
              {displayData[i+1][branch].retained.point}
              <div class="line"/>
              <div class="bounds">
                <div class="minbound">{displayData[i+1][branch].retained.lower}</div>
                <div class="maxbound">{displayData[i+1][branch].retained.upper}</div>
              </div>
            </div>
            <div class="grid-item" style="color: {getMetricColour(displayData[i+1][branch].search_count)}">
              {displayData[i+1][branch].search_count.point}
              <div class="line"/>
              <div class="bounds">
                <div class="minbound">{displayData[i+1][branch].search_count.lower}</div>
                <div class="maxbound">{displayData[i+1][branch].search_count.upper}</div>
              </div>
            </div>
            <div class="grid-item" style="color: {getMetricColour(displayData[i+1][branch].active_hours)}">
              {displayData[i+1][branch].active_hours.point}
              <div class="line"/>
              <div class="bounds">
                <div class="minbound">{displayData[i+1][branch].active_hours.lower}</div>
                <div class="maxbound">{displayData[i+1][branch].active_hours.upper}</div>
              </div>
            </div>
            <div class="grid-item" style="color: {getMetricColour(displayData[i+1][branch].ad_clicks)}">
              {displayData[i+1][branch].ad_clicks.point}
              <div class="line"/>
              <div class="bounds">
                <div class="minbound">{displayData[i+1][branch].ad_clicks.lower}</div>
                <div class="maxbound">{displayData[i+1][branch].ad_clicks.upper}</div>
              </div>
            </div>
            <div class="grid-item" style="color: {getMetricColour(displayData[i+1][branch].uri_count)}">
              {displayData[i+1][branch].uri_count.point}
              <div class="line"/>
              <div class="bounds">
                <div class="minbound">{displayData[i+1][branch].uri_count.lower}</div>
                <div class="maxbound">{displayData[i+1][branch].uri_count.upper}</div>
              </div>
            </div>
            <div class="grid-item">N/A</div>
          {/each}
        {/if}
      {/each}
    </div>
    {/if}
  </div>
</div>

