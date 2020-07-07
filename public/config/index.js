export const site = {
  title: "Lunascope",
  feedback: "@emtwo", // can be any string
};

export const plotTemplate = {
  source: "bug_1637316_message_aboutwelcome_pull_factor_reinforcement_76_rel_release_76_77_weekly.json", // this is the source file. it is in public/data. It needs to be json for now (an array of objects, like BQ gives you)
  key: "bug_1637316_message_aboutwelcome_pull_factor_reinforcement_76_rel_release_76_77_weekly", // this is the shorthand slug for the link. It needs to be unique!
  type: "line", // the type of chart. Right now just line.
  supertitle: "Statistic Over Time", // The large text above the title
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
