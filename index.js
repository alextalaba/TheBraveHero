let maxTurn = 20;

// Carl Stats

// Health
let carlMinHealth = 65;
let carlMaxHealth = 95;
// Power
let carlMinPower = 60;
let carlMaxPower = 70;
// Defence
let carlMinDefence = 40;
let carlMaxDefence = 50;
// Speed
let carlMinSpeed = 40;
let carlMaxSpeed = 50;
// Luck
let carlMinLuck = 10;
let carlMaxLuck = 30;

// Beast Stats

// Health
let beastMinHealth = 55;
let beastMaxHealth = 80;
// Power
let beastMinPower = 50;
let beastMaxPower = 80;
// Defence
let beastMinDefence = 35;
let beastMaxDefence = 55;
// Speed
let beastMinSpeed = 40;
let beastMaxSpeed = 60;
// Luck
let beastMinLuck = 25;
let beastMaxLuck = 40;

let musicOn = false;
// Start music
function playMusic() {
  if (!musicOn) {
    let x = document.createElement("AUDIO");
    x.setAttribute("src", "./Sounds/Redemption.mp3");
    x.setAttribute("autoplay", "autoplay");
    x.setAttribute("loop", "loop");
    document.body.appendChild(x);
  }
  musicOn = true;
}

function onLoad() {
  $(document).ready(function () {
    $("#startingModal").modal("show");
  });
}

//Main code

function Start() {
  playMusic();

  // Abilities (abilities[0]=offensive abilities, abilities[1]=deffensive abilities)
  let basicAttack = new Ability("Basic Attack", 100, "power", 0, 1, true);
  let dragonForce = new Ability("Dragon Force", 10, "power", 0, 2, false);
  let defend = new Ability("Defend", 100, "defence", -1, 1, false);
  let charmedShield = new Ability("Charmed Shield", 20, "power", 0, 0.5, false);

  let carlAbilities = [
    [basicAttack, dragonForce],
    [defend, charmedShield],
  ];

  Carl = new Character(
    0,
    "Carl",
    Math.round(getRandomBetween(carlMinHealth, carlMaxHealth)),
    Math.round(getRandomBetween(carlMinPower, carlMaxPower)),
    Math.round(getRandomBetween(carlMinDefence, carlMaxDefence)),
    Math.round(getRandomBetween(carlMinSpeed, carlMaxSpeed)),
    Math.round(getRandomBetween(carlMinLuck, carlMaxLuck)),
    carlAbilities
  );

  let beastAbilities = [[basicAttack], [defend]];

  Beast = new Character(
    1,
    "Beast",
    Math.round(getRandomBetween(beastMinHealth, beastMaxHealth)),
    Math.round(getRandomBetween(beastMinPower, beastMaxPower)),
    Math.round(getRandomBetween(beastMinDefence, beastMaxDefence)),
    Math.round(getRandomBetween(beastMinSpeed, beastMaxSpeed)),
    Math.round(getRandomBetween(beastMinLuck, beastMaxLuck)),
    beastAbilities
  );

  Battle.setCharacters(Carl, Beast);

  Battle.initialize();
}

function getRandomBetween(min, max) {
  return min + Math.random() * (max - min);
}

class Battle {
  Hero = new Character();
  Monster = new Character();
  heroFirst;
  turn = 0;
  log = "";

  // Prepare battle
  static initialize() {
    document.getElementById("start").innerHTML = "RESTART";

    this.turn = 0;
    this.log = "";

    document.getElementById("battleLog").innerHTML = this.log;

    this.whosFirst();

    this.Hero.displayStats();
    this.Monster.displayStats();
    document.getElementById("fight").disabled = false;
  }

  // Assign battle characters
  static setCharacters(hero, monster) {
    this.Hero = hero;
    this.Monster = monster;
  }

  // Set starting character
  static whosFirst() {
    let heroSpeed = this.Hero.speed;
    let monsterSpeed = this.Monster.speed;

    this.heroFirst = false;

    if (heroSpeed > monsterSpeed) {
      this.heroFirst = true;
    } else if (heroSpeed === monsterSpeed) {
      let heroLuck = this.Hero.luck;
      let monsterLuck = this.Monster.luck;

      if (heroLuck > monsterLuck) {
        this.heroFirst = true;
      }
    }
  }

  static nextTurn() {
    document.getElementById("fight").disabled = true;
    this.turn++;

    Log.logTurn();

    if (this.turn > maxTurn) {
      this.declareWinner(this.Hero.health >= this.Monster.health ? 3 : 4);
    } else {
      if (this.heroFirst) {
        this.fight(this.Hero, this.Monster);
      } else {
        this.fight(this.Monster, this.Hero);
      }
    }
  }

  static fight(first = new Character(), second = new Character()) {
    if (first.alive)
      setTimeout(() => {
        let damage = first.power;
        first.attack(second, damage);
        second.displayStats();

        if (second.alive)
          setTimeout(() => {
            let damage = second.power;
            second.attack(first, damage);
            first.displayStats();

            document.getElementById("fight").disabled = !(
              first.alive && second.alive
            );
          }, 1000);
      }, 1000);
  }

  static declareWinner(winnerId = 0) {
    document.getElementById("winnerTitle").innerHTML =
      winnerId === 0 || winnerId === 3 ? "YOU WON" : "YOU LOST";

    switch (winnerId) {
      case 0:
        document.getElementById("monsterImage").src =
          "./Img/MonsterDefeated.png";
        document.getElementById("winnerText").innerHTML =
          "Carl proved once more that nothing can defeat him. Now go back home and enjoy peace another day.";
        break;

      case 1:
        document.getElementById("carlImage").src = "./Img/CarlDefeated.png";
        document.getElementById("winnerText").innerHTML =
          "Carl lost his life in battle. The Monster proved to be better. Or maybe there was something in the coffee...";
        break;

      case 3:
        document.getElementById("monsterImage").src =
          "./Img/MonsterDefeated.png";
        document.getElementById("winnerText").innerHTML =
          "The exhausted monster trembled in front of Carl's might. It ran away in terror.";
        break;

      case 4:
        document.getElementById("carlImage").src = "./Img/CarlDefeated.png";
        document.getElementById("winnerText").innerHTML =
          "Carl ran away back to his mother's place where he cried for 3.5 hours. Ah, the adventurer's life!";
        break;

      default:
        break;
    }
    // $("#endGameModal").modal("show");
    document.getElementById("endGameModal").show = true;
  }
}

class Character {
  id = 0;
  name = "";
  health = 0;
  power = 0;
  defence = 0;
  speed = 0;
  luck = 0;
  alive = false;
  abilities;

  constructor(id, name, health, power, defence, speed, luck, abilities) {
    this.id = id;
    this.name = name;
    this.health = health;
    this.power = power;
    this.defence = defence;
    this.speed = speed;
    this.luck = luck;
    this.alive = true;
    this.abilities = abilities;
  }

  attack(target, power) {
    let miss = Character.roll(target.luck);
    let damage = power;
    let success = false;
    let offensiveAbilities = "";
    let deffensiveAbilities = "";

    if (!miss) {
      // cast offensive abilities
      if (this.abilities[0].length > 0) {
        this.abilities[0].forEach((ability) => {
          [damage, success] = ability.use(damage, target);
          if (success) {
            offensiveAbilities += ability.name + "... ";
            success = false;
          }
        });
      }

      // cast defensive abilities
      if (target.abilities[1].length > 0) {
        target.abilities[1].forEach((ability) => {
          [damage, success] = ability.use(damage, target);
          if (success) {
            deffensiveAbilities += ability.name + "... ";
            success = false;
          }
        });
      }

      if (damage < 0) {
        damage = 0;
      } else if (damage > 100) {
        damage = 100;
      }
      damage = damage;
      target.health = target.health - damage;

      Log.logAttack(
        this,
        target,
        true,
        damage,
        offensiveAbilities,
        deffensiveAbilities
      );

      if (target.health <= 0) {
        target.alive = false;

        Log.logInfo(target.name + " died in combat.");
        document.getElementById("fight").disabled = true;

        Battle.declareWinner(this.id);
      }
    } else {
      Log.logAttack(this, target, false);
    }
  }

  static roll(luck) {
    return Math.random() <= luck / 100.0;
  }

  displayStats() {
    document.getElementById(this.id).innerHTML =
      "<div class='row'>" +
      "<div class='col-md text-center'><h4>" +
      this.name +
      "</h4></div></div><div class='row'><div class='col-md'><h5>Health: </h5></div><div class='col-md text-right'><h5>" +
      this.health +
      "</h5></div></div>" +
      "</div><div class='row'><div class='col-md'><h5>Power: </h5></div><div class='col-md text-right'><h5>" +
      this.power +
      "</h5></div></div>" +
      "</div><div class='row'><div class='col-md'><h5>Defence: </h5></div><div class='col-md text-right'><h5>" +
      this.defence +
      "</h5></div></div>" +
      "</div><div class='row'><div class='col-md'><h5>Speed: </h5></div><div class='col-md text-right'><h5>" +
      this.speed +
      "</h4></div></div>" +
      "</div><div class='row'><div class='col-md'><h5>Luck: </h5></div><div class='col-md text-right'><h5>" +
      this.luck +
      "%</h5></div></div>";
  }

  getStat(stat) {
    switch (stat) {
      case "health":
        return this.health;
      case "power":
        return this.power;
      case "defence":
        return this.defence;
      case "speed":
        return this.speed;
      case "luck":
        return this.luck;

      default:
        break;
    }
  }
  setStat(stat, newValue) {
    switch (stat) {
      case "health":
        this.health = newValue;
        break;
      case "power":
        this.power = newValue;
        break;
      case "defence":
        this.defence = newValue;
        break;
      case "speed":
        this.speed = newValue;
        break;
      case "luck":
        this.luck = newValue;
        break;

      default:
        break;
    }
  }
}

class Ability {
  name;
  influencedStat;
  chance;
  influencerStat;
  influenceAmount;
  influencePercent;
  useTargetLuck;

  constructor(
    name = "",
    chance = 100,
    influenceStat = "",
    influenceAmount = 0,
    influencePercent = 0,
    useTargetLuck = false
  ) {
    this.name = name;
    this.influenceStat = influenceStat;
    this.chance = chance;
    this.influenceAmount = influenceAmount;
    this.influencePercent = influencePercent;
    this.useTargetLuck = useTargetLuck;
  }

  // Returns modified damage and casting success or fail
  use(damage, target = new Character()) {
    let cast = Character.roll(
      this.useTargetLuck ? target.luck * this.chance : this.chance
    );

    if (cast) {
      let oldValue = Number(damage);
      let newValue = Number(
        oldValue * this.influencePercent +
          this.influenceAmount * target.getStat(this.influenceStat)
      );
      return [newValue, true];
    }
    return [damage, false];
  }
}

class Log {
  static logAttack(
    attacker,
    defender,
    hit,
    damage = 0,
    offensiveAbilities = "",
    deffensiveAbilities = ""
  ) {
    Battle.log +=
      attacker.name +
      (hit ? " hit " + defender.name + " for " + damage : " missed!") +
      "<br>" +
      " Offensive ablities used: " +
      offensiveAbilities +
      "<br>" +
      " Deffensive ablities used: " +
      deffensiveAbilities +
      "<br><br>";
    document.getElementById("battleLog").innerHTML = Battle.log;
    this.scrollLog();
  }

  static logTurn() {
    Battle.log += "<br>TURN " + Battle.turn + "<br>";
    document.getElementById("battleLog").innerHTML = Battle.log;
    this.scrollLog();
  }

  static logInfo(info) {
    Battle.log += info + "<br>";
    document.getElementById("battleLog").innerHTML = Battle.log;
    this.scrollLog();
  }

  static scrollLog() {
    var log = document.getElementById("battleLog");
    log.scrollTop = log.scrollHeight;
  }
}
