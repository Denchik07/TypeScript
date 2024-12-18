enum HeroType { // еnum для типів героїв
    Shooter = "SHOOTER",
    Artillery = "ARTILLERY",
    Assassin = "ASSASSIN",
    Commando = "COMMANDO",
}


enum AttackType { // еnum для типів атак
    Ballistic = "BALLISTIC",
    Explosive = "EXPLOSIVE",
    Melee = "MELEE",
    Versatile = "VERSATILE",
}

// іnterface для характеристик героя
interface HeroStats {
    health: number;
    attack: number;
    defense: number;
    speed: number;
}

// іnterface для героя
interface Hero {
    id: number;
    name: string;
    type: HeroType;
    attackType: AttackType;
    stats: HeroStats;
    isAlive: boolean;
    ammunitionType?: string; // тільки для типа сommando
}

// типи для результату атаки
type AttackResult = {
    damage: number;
    isCritical: boolean;
    remainingHealth: number;
};

function createHero(name: string, type: HeroType, ammunitionType?: string): Hero {
    const baseStats: Record<HeroType, HeroStats> = {
        [HeroType.Shooter]: { health: 100, attack: 35, defense: 15, speed: 20 },
        [HeroType.Artillery]: { health: 120, attack: 50, defense: 10, speed: 10 },
        [HeroType.Assassin]: { health: 90, attack: 60, defense: 10, speed: 30 },
        [HeroType.Commando]: { health: 110, attack: 40, defense: 20, speed: 15 },
    };

    const attackTypes: Record<HeroType, AttackType> = {
        [HeroType.Shooter]: AttackType.Ballistic,
        [HeroType.Artillery]: AttackType.Explosive,
        [HeroType.Assassin]: AttackType.Melee,
        [HeroType.Commando]: AttackType.Versatile,
    };

    return {
        id: Math.floor(Math.random() * 10000),
        name,
        type,
        attackType: attackTypes[type],
        stats: baseStats[type],
        isAlive: true,
        ammunitionType: type === HeroType.Commando ? ammunitionType : undefined,
    };
} // функція створення нового героя

// розрахунок пошкоджень
function calculateDamage(attacker: Hero, defender: Hero): AttackResult {
    const baseDamage = Math.max(0, attacker.stats.attack - defender.stats.defense);
    const isCritical = Math.random() < 0.2; // 20% шанс критичного удару
    const damage = isCritical ? baseDamage * 2 : baseDamage;
    const remainingHealth = Math.max(0, defender.stats.health - damage);

    return {
        damage,
        isCritical,
        remainingHealth,
    };
}

// дженерік функція для пошуку героя в масиві
function findHeroByProperty<T extends keyof Hero>(
    heroes: Hero[],
    property: T,
    value: Hero[T]
): Hero | undefined {
    return heroes.find((hero) => hero[property] === value);
}

// проведення раунду бою між героями
function battleRound(hero1: Hero, hero2: Hero): string {
    if (!hero1.isAlive || !hero2.isAlive) {
        return `${hero1.name} або ${hero2.name} вже мертві. Бій неможливий`;
    }

    const attackResult1 = calculateDamage(hero1, hero2);
    hero2.stats.health = attackResult1.remainingHealth;
    hero2.isAlive = hero2.stats.health > 0;

    const attackResult2 = calculateDamage(hero2, hero1);
    hero1.stats.health = attackResult2.remainingHealth;
    hero1.isAlive = hero1.stats.health > 0;

    return `Раунд завершено
${hero1.name} завдав ${attackResult1.damage} пошкоджень (${attackResult1.isCritical ? "критичний удар" : ""}), залишилося ${hero2.stats.health} здоровя у ${hero2.name}.
${hero2.name} завдав ${attackResult2.damage} пошкоджень (${attackResult2.isCritical ? "критичний удар" : ""}), залишилося ${hero1.stats.health} здоровя у ${hero1.name}.
`;
}


const heroes: Hero[] = [ // практичне застосування
    createHero("джейсон", HeroType.Shooter),
    createHero("ліна", HeroType.Artillery),
    createHero("шінобі", HeroType.Assassin),
    createHero("макс", HeroType.Commando, "лазерні"),
];

// демонстрація роботи
console.log("--- мтворені герої ---");
console.log(heroes);

console.log("\n--- пошук героя за типом ---");
const shooter = findHeroByProperty(heroes, "type", HeroType.Shooter);
console.log(shooter);

console.log("\n--- проведення бою ---");
if (heroes.length >= 2) {
    const battleResult = battleRound(heroes[0], heroes[1]);
    console.log(battleResult);
}

console.log("\n--- Статистика героїв псля бою ---");
console.log(heroes);
