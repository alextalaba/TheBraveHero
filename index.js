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

// Monster Stats

// Health
let monsterMinHealth = 55;
let monsterMaxHealth = 80;
// Power
let monsterMinPower = 50;
let monsterMaxPower = 80;
// Defence
let monsterMinDefence = 35;
let monsterMaxDefence = 55;
// Speed
let monsterMinSpeed = 40;
let monsterMaxSpeed = 60;
// Luck
let monsterMinLuck = 25;
let monsterMaxLuck = 40;

//Main code

function Start() {
  let x = document.createElement("AUDIO");
  x.setAttribute("src", "./Sounds/Redemption.mp3");
  x.setAttribute("autoplay", "autoplay");
  x.setAttribute("loop", "loop");
  document.body.appendChild(x);

  // Abilities
  let basicAttack = new Ability("Basic Attack", 100, "power", 0, 1, true);
  let dragonForce = new Ability("Dragon Force", 10, "power", 0, 2, false);
  let defend = new Ability("Defend", 100, "defence", -1, 1, false);
  let charmedShield = new Ability("Charmed Shield", 20, "power", 0, 0.5, false);

  let carlAbilities = [
    [basicAttack, dragonForce],
    [defend, charmedShield],
  ];

  this.Carl = new Character(
    0,
    "Carl",
    Math.round(getRandomBetween(carlMinHealth, carlMaxHealth)),
    Math.round(getRandomBetween(carlMinPower, carlMaxPower)),
    Math.round(getRandomBetween(carlMinDefence, carlMaxDefence)),
    Math.round(getRandomBetween(carlMinSpeed, carlMaxSpeed)),
    Math.round(getRandomBetween(carlMinLuck, carlMaxLuck)),
    carlAbilities
  );

  let monsterAbilities = [[basicAttack], [defend]];

  this.Monster = new Character(
    1,
    "Beast",
    Math.round(getRandomBetween(monsterMinHealth, monsterMaxHealth)),
    Math.round(getRandomBetween(monsterMinPower, monsterMaxPower)),
    Math.round(getRandomBetween(monsterMinDefence, monsterMaxDefence)),
    Math.round(getRandomBetween(monsterMinSpeed, monsterMaxSpeed)),
    Math.round(getRandomBetween(monsterMinLuck, monsterMaxLuck)),
    monsterAbilities
  );

  Battle.setCharacters(Carl, Monster);

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

  static fight() {
    document.getElementById("fight").disabled = true;

    this.turn++;
    Log.logTurn();

    if (this.heroFirst) {
      if (this.Hero.alive)
        setTimeout(() => {
          let damage = this.Hero.power;
          this.Hero.attack(this.Monster, damage);
          this.Monster.displayStats();

          if (this.Monster.alive)
            setTimeout(() => {
              let damage = this.Monster.power;
              this.Monster.attack(this.Hero, damage);
              this.Hero.displayStats();

              document.getElementById("fight").disabled = !(
                this.Hero.alive && this.Monster.alive
              );
            }, 1000);
        }, 1000);
    } else {
      if (this.Monster.alive)
        setTimeout(() => {
          let damage = this.Monster.power;
          this.Monster.attack(this.Hero, damage);
          this.Hero.displayStats();

          if (this.Hero.alive)
            setTimeout(() => {
              let damage = this.Hero.power;
              this.Hero.attack(this.Monster, damage);
              this.Monster.displayStats();

              document.getElementById("fight").disabled = !(
                this.Hero.alive && this.Monster.alive
              );
            }, 1000);
        }, 1000);
    }
  }

  static declareWinner(winnerId = 0) {
    document.getElementById("winnerTitle").innerHTML =
      winnerId === 0 ? "YOU WON" : "YOU LOST";
    document.getElementById("winnerText").innerHTML =
      winnerId === 0
        ? "Carl proved once more that nothing can defeat him. Now go back home and enjoy peace another day."
        : "Carl lost his life in battle. The Monster proved to be better. Or maybe there was something in the coffee...";
    $("#endGameModal").modal("show");
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
        console.log(this.id);
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
      "<div class='col-md text-center'>" +
      this.name +
      "</div></div><div class='row'><div class='col-md'>Health: </div><div class='col-md text-right'>" +
      this.health +
      "</div></div>" +
      "</div><div class='row'><div class='col-md'>Power: </div><div class='col-md text-right'>" +
      this.power +
      "</div></div>" +
      "</div><div class='row'><div class='col-md'>Defence: </div><div class='col-md text-right'>" +
      this.defence +
      "</div></div>" +
      "</div><div class='row'><div class='col-md'>Speed: </div><div class='col-md text-right'>" +
      this.speed +
      "</div></div>" +
      "</div><div class='row'><div class='col-md'>Luck: </div><div class='col-md text-right'>" +
      this.luck +
      "%</div></div>";
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
  }

  static logTurn() {
    Battle.log += "<br>TURN " + Battle.turn + "<br>";
    document.getElementById("battleLog").innerHTML = Battle.log;
  }
  static logInfo(info) {
    Battle.log += info + "<br>";
    document.getElementById("battleLog").innerHTML = Battle.log;
  }
}
