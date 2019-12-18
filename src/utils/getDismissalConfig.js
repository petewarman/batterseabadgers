export default dismissalType => {
  switch (dismissalType) {
    case "Did not bat":
      return {
        abbr: "dnb",
        fielder: false,
        bowler: false
      };
    case "Not out":
      return {
        abbr: null,
        fielder: false,
        bowler: false
      };
    case "Bowled":
      return {
        abbr: "b.",
        fielder: false,
        bowler: true
      };
    case "Caught":
      return {
        abbr: "ct.",
        fielder: true,
        bowler: true
      };
    case "LBW":
      return {
        abbr: "lbw",
        fielder: false,
        bowler: true
      };
    case "Stumped":
      return {
        abbr: "st.",
        fielder: true,
        bowler: true
      };
    case "Run out":
      return {
        abbr: null,
        fielder: true,
        bowler: false
      };
    case "Hit wicket":
      return {
        abbr: "ht wkt.",
        fielder: false,
        bowler: true
      };
    case "Double hit":
      return {
        abbr: null,
        fielder: false,
        bowler: false
      };
    case "Obstructing field":
      return {
        abbr: null,
        fielder: false,
        bowler: false
      };
    case "Handled ball":
      return {
        abbr: null,
        fielder: false,
        bowler: false
      };
    case "Timed out":
      return {
        abbr: null,
        fielder: false,
        bowler: false
      };
    case "Retired":
      return {
        abbr: null,
        fielder: false,
        bowler: false
      };
    case "Retired hurt":
      return {
        abbr: null,
        fielder: false,
        bowler: false
      };
    case "Retired not out":
      return {
        abbr: null,
        fielder: false,
        bowler: false
      };
  }
};
