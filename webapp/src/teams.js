const teams = [
  {
    primaryColor: "#AA0000",
    secondaryColor: "#B3995D",
    location: "San Francisco",
    name: "49ers",
    short: "SF",
    choice: "YTljYWE5ZTYtY2VhMi0xMWU5LTk1MWUtZjZjOTI0NjcxYjBmLTA4",
  },
  {
    primaryColor: "#00338D",
    secondaryColor: "#C60C30",
    location: "Buffalo",
    name: "Bills",
    short: "BUF",
    choice: "YTk5NDI0OTktY2VhMi0xMWU5LTk1MWUtZjZjOTI0NjcxYjBmLTA4",
  },
  {
    primaryColor: "#0B162A",
    secondaryColor: "#C83803",
    location: "Chicago",
    name: "Bears",
    short: "CHI",
    choice: "YTk5OTQwNjAtY2VhMi0xMWU5LTk1MWUtZjZjOTI0NjcxYjBmLTA4",
  },
  {
    primaryColor: "#FB4F14",
    secondaryColor: "#000000",
    location: "Cincinnati",
    name: "Bengals",
    short: "CIN",
    choice: "YTk5YjE5ZjMtY2VhMi0xMWU5LTk1MWUtZjZjOTI0NjcxYjBmLTA4",
  },
  {
    primaryColor: "#FB4F14",
    secondaryColor: "#002244",
    location: "Denver",
    name: "Broncos",
    short: "DEN",
    choice: "YTlhMGY5NTEtY2VhMi0xMWU5LTk1MWUtZjZjOTI0NjcxYjBmLTA4",
  },
  {
    primaryColor: "#311D00",
    secondaryColor: "#FF3C00",
    location: "Cleveland",
    name: "Browns",
    short: "CLE",
    choice: "YTk5ZDEyMGUtY2VhMi0xMWU5LTk1MWUtZjZjOTI0NjcxYjBmLTA4",
  },
  {
    primaryColor: "#D50A0A",
    secondaryColor: "#FF7900",
    location: "Tampa Bay",
    name: "Buccaneers",
    short: "TB",
    choice: "YTlkNTZlYWEtY2VhMi0xMWU5LTk1MWUtZjZjOTI0NjcxYjBmLTA4",
  },
  {
    primaryColor: "#97233F",
    secondaryColor: "#000000",
    location: "Arizona",
    name: "Cardinals",
    short: "ARI",
    choice: "YTk4NGQ5NGYtY2VhMi0xMWU5LTk1MWUtZjZjOTI0NjcxYjBmLTA4",
  },
  {
    primaryColor: "#002A5E",
    secondaryColor: "#FFC20E",
    location: "Los Angeles",
    name: "Chargers",
    short: "LAC",
    choice: "YTliMTBkMTUtY2VhMi0xMWU5LTk1MWUtZjZjOTI0NjcxYjBmLTA4",
  },
  {
    primaryColor: "#E31837",
    secondaryColor: "#FFB81C",
    location: "Kansas City",
    name: "Chiefs",
    short: "KC",
    choice: "YTlhZDVlNzItY2VhMi0xMWU5LTk1MWUtZjZjOTI0NjcxYjBmLTA4",
  },
  {
    primaryColor: "#002C5F",
    secondaryColor: "#A2AAAD",
    location: "Indianapolis",
    name: "Colts",
    short: "IND",
    choice: "YTlhN2Y3ZDctY2VhMi0xMWU5LTk1MWUtZjZjOTI0NjcxYjBmLTA4",
  },
  {
    primaryColor: "#003594",
    secondaryColor: "#041E42",
    location: "Dallas",
    name: "Cowboys",
    short: "DAL",
    choice: "YTk5ZjFiYjktY2VhMi0xMWU5LTk1MWUtZjZjOTI0NjcxYjBmLTA4",
  },
  {
    primaryColor: "#008E97",
    secondaryColor: "#FC4C02",
    location: "Miami",
    name: "Dolphins",
    short: "MIA",
    choice: "YTliNmI4NGQtY2VhMi0xMWU5LTk1MWUtZjZjOTI0NjcxYjBmLTA4",
  },
  {
    primaryColor: "#004C54",
    secondaryColor: "#A5ACAF",
    location: "Philadelphia",
    name: "Eagles",
    short: "PHI",
    choice: "YTljNjBhZDMtY2VhMi0xMWU5LTk1MWUtZjZjOTI0NjcxYjBmLTA4",
  },
  {
    primaryColor: "#A71930",
    secondaryColor: "#000000",
    location: "Atlanta",
    name: "Falcons",
    short: "ATL",
    choice: "YTk4ZTI3ZDgtY2VhMi0xMWU5LTk1MWUtZjZjOTI0NjcxYjBmLTA4",
  },
  {
    primaryColor: "#773141",
    secondaryColor: "#FFB612",
    location: "Washington",
    name: "Football Team",
    short: "WAS",
    choice: "YTlkYjhkZTQtY2VhMi0xMWU5LTk1MWUtZjZjOTI0NjcxYjBmLTA4",
  },
  {
    primaryColor: "#0B2265",
    secondaryColor: "#A71930",
    location: "New York",
    name: "Giants",
    short: "NYG",
    choice: "YTljMGE4NTktY2VhMi0xMWU5LTk1MWUtZjZjOTI0NjcxYjBmLTA4",
  },
  {
    primaryColor: "#125740",
    secondaryColor: "#000000",
    location: "New York",
    name: "Jets",
    short: "NYJ",
    choice: "YTljMjgwYzQtY2VhMi0xMWU5LTk1MWUtZjZjOTI0NjcxYjBmLTA4",
  },
  {
    primaryColor: "#101820",
    secondaryColor: "#D7A22A",
    location: "Jacksonville",
    name: "Jaguars",
    short: "JAC",
    choice: "YTlhOWIwMjgtY2VhMi0xMWU5LTk1MWUtZjZjOTI0NjcxYjBmLTA4",
  },
  {
    primaryColor: "#0076B6",
    secondaryColor: "#B0B7BC",
    location: "Detroit",
    name: "Lions",
    short: "DET",
    choice: "YTlhMjllNzAtY2VhMi0xMWU5LTk1MWUtZjZjOTI0NjcxYjBmLTA4",
  },
  {
    primaryColor: "#203731",
    secondaryColor: "#FFB612",
    location: "Green Bay",
    name: "Packers",
    short: "GB",
    choice: "YTlhNDdjZTAtY2VhMi0xMWU5LTk1MWUtZjZjOTI0NjcxYjBmLTA4",
  },
  {
    primaryColor: "#0085CA",
    secondaryColor: "#101820",
    location: "Carolina",
    name: "Panthers",
    short: "CAR",
    choice: "YTk5NWYxOWUtY2VhMi0xMWU5LTk1MWUtZjZjOTI0NjcxYjBmLTA4",
  },
  {
    primaryColor: "#002244",
    secondaryColor: "#C60C30",
    location: "New England",
    name: "Patriots",
    short: "NE",
    choice: "YTliYzJhZDQtY2VhMi0xMWU5LTk1MWUtZjZjOTI0NjcxYjBmLTA4",
  },
  {
    primaryColor: "#D3BC8D",
    secondaryColor: "#101820",
    location: "New Orleans",
    name: "Saints",
    short: "NO",
    choice: "YTliZWNmOTEtY2VhMi0xMWU5LTk1MWUtZjZjOTI0NjcxYjBmLTA4",
  },
  {
    primaryColor: "#003594",
    secondaryColor: "#FFA300",
    location: "Los Angeles",
    name: "Rams",
    short: "LAR",
    choice: "YTliNDBlMWMtY2VhMi0xMWU5LTk1MWUtZjZjOTI0NjcxYjBmLTA4",
  },
  {
    primaryColor: "#000000",
    secondaryColor: "#A5ACAF",
    location: "Las Vegas",
    name: "Raiders",
    short: "LA",
    choice: "YTljNDUzZjUtY2VhMi0xMWU5LTk1MWUtZjZjOTI0NjcxYjBmLTA4",
  },
  {
    primaryColor: "#241773",
    secondaryColor: "#000000",
    location: "Baltimore",
    name: "Ravens",
    short: "BAL",
    choice: "YTk5MGRlNDEtY2VhMi0xMWU5LTk1MWUtZjZjOTI0NjcxYjBmLTA4",
  },
  {
    primaryColor: "#002244",
    secondaryColor: "#69BE28",
    location: "Seattle",
    name: "Seahawks",
    short: "SEA",
    choice: "YTljZTkyZGEtY2VhMi0xMWU5LTk1MWUtZjZjOTI0NjcxYjBmLTA4",
  },
  {
    primaryColor: "#FFB612",
    secondaryColor: "#101820",
    location: "Pittsburgh",
    name: "Steelers",
    short: "PIT",
    choice: "YTljN2M1M2QtY2VhMi0xMWU5LTk1MWUtZjZjOTI0NjcxYjBmLTA4",
  },
  {
    primaryColor: "#03202F",
    secondaryColor: "#A71930",
    location: "Houston",
    name: "Texans",
    short: "HOU",
    choice: "YTlhNjNmMjAtY2VhMi0xMWU5LTk1MWUtZjZjOTI0NjcxYjBmLTA4",
  },
  {
    primaryColor: "#0C2340",
    secondaryColor: "#4B92DB",
    location: "Tennessee",
    name: "Titans",
    short: "TEN",
    choice: "YTlkOTJmZmItY2VhMi0xMWU5LTk1MWUtZjZjOTI0NjcxYjBmLTA4",
  },
  {
    primaryColor: "#4F2683",
    secondaryColor: "#FFC62F",
    location: "Minnesota",
    name: "Vikings",
    short: "MIN",
    choice: "YTliYTIyODMtY2VhMi0xMWU5LTk1MWUtZjZjOTI0NjcxYjBmLTA4",
  },
];

export default teams;
