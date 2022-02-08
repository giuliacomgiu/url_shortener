const app = require("express")();
const {Client} = require("pg");
const HashRing = require("hashring");
const crypto = require("crypto");

const hashring = new HashRing();
hashring.add("shard1")
hashring.add("shard2")

const clients = {
  "shard1": new Client({
    "host":"172.17.0.3",
    "port":"5432",
    "user":"postgres",
    "database":"postgres",
    "password":"password",
  }),
  "shard2": new Client({
    "host":"172.17.0.4",
    "port":"5432",
    "user":"postgres",
    "database":"postgres",
    "password":"password",
  })
}

connect();
async function connect() {
  await clients["shard1"].connect();
  await clients["shard2"].connect();
}

app.get("/:urlId", async (req, res) => {
  const urlId = req.params.urlId;
  const server = hashring.get(urlId);
  const urls = await clients[server].query("SELECT URL FROM URLS WHERE URL_ID = $1", [urlId]);

  if(urls.rowCount == 0){
    res.sendStatus(404)
  } else {
    res.send({
      "urls":  JSON.stringify(urls.rows.map(r => r.url)),
      "shard": server
    })
  }
})


app.post("/", async (req, res) => {
  const url = req.query.url;
  const hash = crypto.createHash("sha256").update(url).digest("base64");
  const urlId = hash.slice(0,5);
  const server = hashring.get(urlId);

  await clients[server].query("INSERT INTO URLS(URL, URL_ID) VALUES ($1, $2)", [url, urlId]);

  res.send({
    "urlId": urlId,
    "url": url,
    "server": server
  })
})

app.listen(8081, '0.0.0.0');
console.log(`Running on http://0.0.0.0:8081`);