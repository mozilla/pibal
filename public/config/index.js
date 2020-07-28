export const site = {
  title: "Pibal",
  feedback: "@emtwo",
};

export const plotTemplate = {
  type: "line", // the type of chart. Right now just line.
  title: "A Statistic", // the title element
  subtitle: "These graphs show the statistic '<statistic>' for a variety of metrics listed below over day index of an experiment", // the subtitle element
  description: "more description!", // currently unused.
  x: "window_index", // the column that gives you the x accessor.
  y: ["point"], // the y value column name. Unlike x, it can be multiple. If you want only one, wrap a single string in an arrray
  xType: "linear",
  group: "branch",
  facet: "metric",
  plotSplit: "statistic",
  relevantRows: "",
  yAxisFormat: ".2s",
  yMouseoverFormat: ".2s"
};
