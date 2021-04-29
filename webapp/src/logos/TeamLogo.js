import Niners from "./49ers.js";
import Bears from "./Bears.js";
import Bengals from "./Bengals.js";
import Bills from "./Bills.js";
import Broncos from "./Broncos.js";
import Browns from "./Browns.js";
import Buccaneers from "./Buccaneers.js";
import Cardinals from "./Cardinals.js";
import Chargers from "./Chargers.js";
import Chiefs from "./Chiefs.js";
import Colts from "./Colts.js";
import Cowboys from "./Cowboys.js";
import Dolphins from "./Dolphins.js";
import Eagles from "./Eagles.js";
import Falcons from "./Falcons.js";
import FootballTeam from "./FootballTeam.js";
import Giants from "./Giants.js";
import Jaguars from "./Jaguars.js";
import Jets from "./Jets.js";
import Lions from "./Lions.js";
import Packers from "./Packers.js";
import Panthers from "./Panthers.js";
import Patriots from "./Patriots.js";
import Raiders from "./Raiders.js";
import Rams from "./Rams.js";
import Ravens from "./Ravens.js";
import Saints from "./Saints.js";
import Seahawks from "./Seahawks.js";
import Steelers from "./Steelers.js";
import Texans from "./Texans.js";
import Titans from "./Titans.js";
import Vikings from "./Vikings.js";

export default function Logo({ size, team }) {
  switch (team) {
    case "49ers":
      return <Niners size={size} />;
    case "Bears":
      return <Bears size={size} />;
    case "Bengals":
      return <Bengals size={size} />;
    case "Bills":
      return <Bills size={size} />;
    case "Broncos":
      return <Broncos size={size} />;
    case "Browns":
      return <Browns size={size} />;
    case "Buccaneers":
      return <Buccaneers size={size} />;
    case "Cardinals":
      return <Cardinals size={size} />;
    case "Chargers":
      return <Chargers size={size} />;
    case "Chiefs":
      return <Chiefs size={size} />;
    case "Colts":
      return <Colts size={size} />;
    case "Cowboys":
      return <Cowboys size={size} />;
    case "Dolphins":
      return <Dolphins size={size} />;
    case "Eagles":
      return <Eagles size={size} />;
    case "Falcons":
      return <Falcons size={size} />;
    case "Football Team":
      return <FootballTeam size={size} />;
    case "Giants":
      return <Giants size={size} />;
    case "Jaguars":
      return <Jaguars size={size} />;
    case "Jets":
      return <Jets size={size} />;
    case "Lions":
      return <Lions size={size} />;
    case "Packers":
      return <Packers size={size} />;
    case "Panthers":
      return <Panthers size={size} />;
    case "Patriots":
      return <Patriots size={size} />;
    case "Raiders":
      return <Raiders size={size} />;
    case "Rams":
      return <Rams size={size} />;
    case "Ravens":
      return <Ravens size={size} />;
    case "Saints":
      return <Saints size={size} />;
    case "Seahawks":
      return <Seahawks size={size} />;
    case "Steelers":
      return <Steelers size={size} />;
    case "Texans":
      return <Texans size={size} />;
    case "Titans":
      return <Titans size={size} />;
    case "Vikings":
      return <Vikings size={size} />;
    default:
      throw new Error(`invalid team prop: ${team}`);
  }
}
