const express = require("express");
const app = express();
app.use(express.json());
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const filePath = path.join(__dirname, "cricketTeam.db");
let db = null;
conncetServerAndDb = async () => {
  try {
    db = await open({ filename: filePath, driver: sqlite3.Database });
    app.listen(3000, () => {
      console.log("server started...");
    });
  } catch (e) {
    console.log(`error in db is: ${e.message}`);
    process.exit(1);
  }
};
conncetServerAndDb();
app.get("/players/", async (req, res) => {
  const query = `select * from cricket_team`;
  const playersList = await db.all(query);
  let result = [];
  convertSnakecaseToCamelcase = (each) => {
    return {
      playerId: each.player_id,
      playerName: each.player_name,
      jerseyNumber: each.jersey_number,
      role: each.role,
    };
  };
  for (let each of playersList) {
    let snakeToCamel = convertSnakecaseToCamelcase(each);
    result.push(snakeToCamel);
  }
  res.send(result);
});
app.post("/players/", async (req, res) => {
  const reqBody = req.body;
  const { playerId, playerName, jerseyNumber, role } = reqBody;
  const query = `INSERT INTO
  cricket_team (player_id,player_name,jersey_number,role) 
  VALUES (${playerId},'${playerName}',${jerseyNumber},'${role}')`;
  const updateResult = await db.run(query);
  const updateId = updateResult.lastId;
  res.send("Player Added to Team");
});
app.get("/players/:playerId/", async (req, res) => {
  const { playerId } = req.params;
  const query = `select *
    from cricket_team
    where player_id=${playerId}`;
  const getPlayer = await db.get(query);
  res.send(getPlayer);
});
app.put("/players/:playerIdBody/", async (req, res) => {
  const { playerIdBody } = req.params;
  const { playerId, playerName, jerseyNumber, role } = req.body;
  const query = `update cricket_team 
    set 
    player_id=${playerId},
    player_name='${playerName}',
    jersey_number=${jerseyNumber},
    role='${role}' 
    where player_id=${playerIdBody}`;
  const updateData = await db.run(query);
  res.send("Player Details Updated");
});

app.delete("/players/:deleteIdPlayer/", async (req, res) => {
  const { deleteIdPlayer } = req.params;
  const query = `delete from cricket_team where player_id=${deleteIdPlayer}`;
  const deleteData = await db.run(query);
  res.send("Player Removed");
});

module.exports = app;
