# BattleArena Framework
This code is a minimum design framework for a battle arena game. The game currently only has a single battle executed between the player and the enemy.
Some of the points to consider when looking at this framework -

CORE SYSTEMS
1. The code is built using the ECS architecture (Entities + Components + Systems).
2. The units position themselves are a specific position and then execute the attack.
3. Two attacks are are part of this framework - a bullet release, and a close slash.
4. Health properties are included for both the player and the enemy and the first to be knocked down will lose.
5. The background is static but will have the parallax scrolling included as the game evolves.

VISUALS
1. The game uses an free background and spritesheets to show the visuals.
2. The visuals have been used from craftpix.net. The license can be viewed here - https://craftpix.net/file-licenses/

GAME LOOPS AND SYSTEMS
1. The level uses a delta based rendering system

GAME DEVELOPMENT TOOLS
1. The level has been developed using the - Pixijs framework, Visual Studio Code, Adobe Photoshop and TexturePackerGUI, Node.js, Vite
